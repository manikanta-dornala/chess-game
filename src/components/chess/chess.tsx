import React, { createRef } from 'react';
import PawnPromotion from '../pawn-promotion-popover/pawn-promotion';
import BoardComponent from '../board/board';
import Popover from '../pawn-promotion-popover/popover';
import { GameState } from '../../common/game';
import { IPiece } from '../../common/interfaces';
import { ChessColor, MoveType, PieceName } from '../../common/enums';
import { PositionHelper } from '../../common/position-helper';
import { MovesHelper } from '../../common/moves-helper';

import './chess.css';
import ScoreComponent from './score/score';
import NotationsComponent from './notations/notations';
import AlertsComponent from './alerts/alerts';
import { IBot } from '../../common/bots/bot';

export default class ChessComponent extends React.Component<
    { bottomColor: ChessColor; bot: IBot | null; id: number },
    any
> {
    private boardRef = createRef<HTMLDivElement>();
    private grabbedPiece: IPiece | null = null;
    private grabbedPieceCurrPosition: string = '';
    private gameState: GameState;
    private highlightPositions: string[] = [];
    private bottomColor: ChessColor;
    private showPawnPromotionLogic = false;
    private pawnPromotionPosition: string | null = null;
    private pawnPromotionCoord: { x: number; y: number } | null = null;
    constructor(props: any) {
        super(props);
        this.handlePromotionSelect = this.handlePromotionSelect.bind(this);
        this.gameState = new GameState();
        this.bottomColor = this.props.bottomColor;
        if (this.props.bot) {
            this.makeBotTurn = this.makeBotTurn.bind(this);
            setInterval(this.makeBotTurn, 100);
        }
    }

    componentDidUpdate(
        prevProps: Readonly<{
            bottomColor: ChessColor;
            bot: IBot | null;
            id: number;
        }>,
        prevState: Readonly<any>,
        snapshot?: any
    ): void {
        if (prevProps.id !== this.props.id) {
            this.newGame();
        }
    }

    render(): React.ReactNode {
        return (
            <div className="wrapper">
                <div className="chess-container">
                    <div
                        id="chess-game"
                        onDragOver={(e) => e.preventDefault()}
                        onDragStart={this.handleDragStart}
                        onDragEnd={this.handleDragEnd}
                        onTouchStart={this.handleTouchStart}
                        onTouchEnd={this.handleTouchEnd}
                        ref={this.boardRef}
                    >
                        <BoardComponent
                            board={this.gameState.board}
                            highlightPositions={this.highlightPositions}
                            bottomColor={this.bottomColor}
                            grabbedPiecePosition={this.grabbedPieceCurrPosition}
                            validMoves={this.gameState.currentValidMoves}
                        />
                    </div>
                    {this.pawnPromotionCoord && (
                        <Popover
                            show={this.showPawnPromotionLogic}
                            onClose={() => {}}
                            coord={this.pawnPromotionCoord}
                        >
                            <PawnPromotion
                                color={this.gameState.turn}
                                onSelect={this.handlePromotionSelect}
                            />
                        </Popover>
                    )}
                    {this.noMoreMoves() && (
                        <AlertsComponent
                            gameState={this.gameState}
                            x={(() => this.boardRef!.current!.offsetLeft)()}
                            y={this.boardRef.current!.offsetTop}
                            pixelSize={this.getPixelSize()}
                        ></AlertsComponent>
                    )}
                </div>
                <div className="info-container">
                    <button className="btn" onClick={this.toggleBoardColor}>
                        Flip Board
                    </button>
                    <h3>Current turn</h3>
                    <p>{this.gameState.turn}</p>
                    <button
                        onClick={this.undoLastMove}
                        disabled={
                            !this.gameState.boards.length ||
                            this.showPawnPromotionLogic
                        }
                    >
                        Undo last move
                    </button>
                    <ScoreComponent gameState={this.gameState}></ScoreComponent>
                    <NotationsComponent
                        gameState={this.gameState}
                    ></NotationsComponent>
                </div>
            </div>
        );
    }

    private handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        if (this.isGrabbable(target)) {
            this.grabPiece(e.clientX, e.clientY);
        }
    };

    private handleDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
        this.dropPiece(e.clientX, e.clientY);
    };

    private handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        const target = document.elementFromPoint(
            touch.clientX,
            touch.clientY
        ) as HTMLElement;
        if (this.isGrabbable(target)) {
            this.grabPiece(touch.clientX, touch.clientY);
        }
    };

    private handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.changedTouches[0];
        this.dropPiece(touch.clientX, touch.clientY);
    };

    private grabPiece = (x: number, y: number) => {
        const position = this.getPositionAtCoord(x, y);
        const piece = this.gameState.board.get(position);
        if (piece) {
            this.highlightPositions = this.gameState.currentValidMoves[
                position
            ].map((move) => move.target);
            this.grabbedPiece = piece;
            this.grabbedPieceCurrPosition = position;
            this.forceUpdate();
        }
    };

    private dropPiece = (x: number, y: number) => {
        if (this.grabbedPiece) {
            const targetPosition = this.getPositionAtCoord(x, y);
            if (this.highlightPositions.includes(targetPosition)) {
                const move = this.gameState.makeMove(
                    this.grabbedPieceCurrPosition,
                    targetPosition
                );
                if (move?.type === MoveType.Promote) {
                    this.togglePawnPromotion(move.target);
                }
            }
        }
        this.resetGrab();
    };

    private togglePawnPromotion(position: string) {
        this.pawnPromotionPosition = position;
        this.pawnPromotionCoord = this.getCoordAtPosition(position);
        this.pawnPromotionCoord = this.boundPawnPromitionCoord(
            this.pawnPromotionCoord
        );
        this.showPawnPromotionLogic = !!this.pawnPromotionCoord;
        this.forceUpdate();
    }

    private boundPawnPromitionCoord(coord: { x: number; y: number }) {
        const offsetTop = this.boardRef.current!.offsetTop;
        coord.y += 50 * this.getPixelSize();
        coord.x += 50 * this.getPixelSize();
        if (coord.y > offsetTop + 600 * this.getPixelSize()) {
            coord.y = coord.y - 250 * this.getPixelSize();
        }
        return coord;
    }

    private handlePromotionSelect(pieceName: PieceName) {
        if (this.pawnPromotionPosition) {
            this.gameState.handlePawnPromotion(this.pawnPromotionPosition, {
                name: pieceName,
                color: this.gameState.turn,
            });
            this.resetPawnPromotion();
        }
    }

    private toggleBoardColor = () => {
        this.bottomColor =
            this.bottomColor === ChessColor.Light
                ? ChessColor.Dark
                : ChessColor.Light;
        if (this.pawnPromotionPosition) {
            this.togglePawnPromotion(this.pawnPromotionPosition);
        }
        this.forceUpdate();
    };

    private undoLastMove = () => {
        if (!this.props.bot) {
            this.takeBack();
        } else {
            if (this.gameState.turn !== this.props.bot.turn) {
                this.takeBack();
                this.takeBack();
            }
        }

        this.forceUpdate();
    };

    private takeBack = () => {
        this.resetPawnPromotion();
        this.gameState.takeBack();
        this.resetPawnPromotion();
    };

    newGame = () => {
        this.resetPawnPromotion();
        this.gameState = new GameState();
        this.forceUpdate();
    };

    private resetGrab() {
        this.grabbedPiece = null;
        this.grabbedPieceCurrPosition = '';
        this.highlightPositions = [];
        this.forceUpdate();
    }

    private resetPawnPromotion() {
        this.pawnPromotionCoord = null;
        this.pawnPromotionPosition = null;
        this.showPawnPromotionLogic = false;
        this.forceUpdate();
    }

    private getPositionAtCoord(x: number, y: number) {
        const fileIndex = Math.floor(
            (this.boundX(x) - this.boardRef.current!.offsetLeft) /
                (100 * this.getPixelSize())
        );
        const rankIndex = Math.floor(
            (this.boundY(y) - this.boardRef.current!.offsetTop) /
                (100 * this.getPixelSize())
        );
        return PositionHelper.gridCoordToPosition({
            rankIndex,
            fileIndex,
            bottomColor: this.bottomColor,
        });
    }

    private getCoordAtPosition(position: string) {
        const indices = PositionHelper.getPositionToCoord(
            position,
            this.bottomColor
        );
        const offsetLeft = this.boardRef.current!.offsetLeft;
        const offsetTop = this.boardRef.current!.offsetTop;
        return {
            x: offsetLeft + 100 * indices.x * this.getPixelSize(),
            y: offsetTop + 100 * indices.y * this.getPixelSize(),
        };
    }

    private boundX = (x: number) =>
        Math.max(
            this.boardRef.current!.offsetLeft,
            Math.min(
                x,
                this.boardRef.current!.offsetLeft + 701 * this.getPixelSize()
            )
        );
    private boundY = (y: number) =>
        Math.max(
            this.boardRef.current!.offsetTop,
            Math.min(
                y,
                this.boardRef.current!.offsetTop + 701 * this.getPixelSize()
            )
        );

    private isGrabbable(element: HTMLElement) {
        const isNotBotTurn =
            !this.props.bot ||
            (this.props.bot && this.props.bot.turn !== this.gameState.turn);
        const pieceIsGrabbable =
            !this.grabbedPiece && element.classList.contains('chess-piece');
        return isNotBotTurn && pieceIsGrabbable;
    }

    private getPixelSize(): number {
        const p = this.boardRef!.current!.clientWidth / 800.0;
        // const p = Math.min(window.innerWidth, window.innerHeight) / 1000.0;
        return p;
    }

    private noMoreMoves = () =>
        MovesHelper.noPieceCanMove(this.gameState.turn, this.gameState.board);

    private async makeBotTurn() {
        if (
            this.props.bot &&
            this.gameState.turn === this.props.bot.turn &&
            !this.props.bot.isMakingTurn &&
            !this.noMoreMoves()
        ) {
            const lastMove = this.gameState.lastMove();
            if (
                lastMove &&
                lastMove.type === MoveType.Promote &&
                lastMove.piece.color === this.props.bot.turn
            ) {
                this.gameState.board.set(lastMove.target, {
                    name: PieceName.Queen,
                    color: this.props.bot.turn,
                });
                this.gameState.turn =
                    this.gameState.turn === ChessColor.Dark
                        ? ChessColor.Light
                        : ChessColor.Dark;
            } else {
                const move = await this.props.bot.getMove(
                    this.gameState.board,
                    this.gameState.lastMove()
                );
                if (move) {
                    this.gameState.makeMove(move?.position, move?.target);
                }
            }
            this.props.bot.isMakingTurn = false;
            this.forceUpdate();
        }
    }
}

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

export default class ChessComponent extends React.Component {
    private boardRef = createRef<HTMLDivElement>();
    private grabbedPiece: IPiece | null = null;
    private grabbedPieceCurrPosition: string = '';
    private gameState = new GameState();
    private highlightPositions: string[] = [];
    private bottomColor = ChessColor.Light;

    private showPawnPromotionLogic = false;
    private pawnPromotionPosition: string | null = null;
    private pawnPromotionCoord: { x: number; y: number } | null = null;

    constructor(props: any) {
        super(props);
        this.handlePromotionSelect = this.handlePromotionSelect.bind(this);
    }

    render(): React.ReactNode {
        return (
            <div className="container">
                <div className="chess-container">
                    <div
                        id="chess-game"
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={this.dropPiece}
                        onDragStart={this.grabPiece}
                        ref={this.boardRef}
                    >
                        <BoardComponent
                            board={this.gameState.board}
                            highlightPositions={this.highlightPositions}
                            bottomColor={this.bottomColor}
                            grabbedPiecePosition={this.grabbedPieceCurrPosition}
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
                    {this.isCheckMate() && (
                        <Popover
                            show={this.isCheckMate()}
                            onClose={() => {}}
                            coord={{
                                x:
                                    this.boardRef.current!.offsetLeft +
                                    275 * this.getPixelSize(),
                                y:
                                    this.boardRef.current!.offsetTop +
                                    350 * this.getPixelSize(),
                            }}
                        >
                            <div
                                className="grid"
                                style={{ background: 'white', padding: '3em' }}
                            >
                                checkmate {this.gameState.turn} king
                            </div>
                        </Popover>
                    )}
                </div>
                <div className="info">
                    <button className="btn" onClick={this.newGame}>
                        New Game
                    </button>
                    <br></br>
                    <br></br>
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

    private grabPiece = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (this.isGrabbable(target)) {
            const position = this.getPositionAtCoord(e.clientX, e.clientY);
            const piece = this.gameState.board[position];
            if (piece) {
                this.highlightPositions = MovesHelper.getLegalMoves(
                    this.gameState.turn,
                    piece,
                    position,
                    this.gameState.board,
                    this.gameState.lastMove()
                ).map((move) => move.target);

                this.grabbedPiece = piece;
                this.grabbedPieceCurrPosition = position;
                this.forceUpdate();
            }
        }
    };

    private dropPiece = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.grabbedPiece) {
            const targetPosition = this.getPositionAtCoord(
                e.clientX,
                e.clientY
            );
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
        this.resetPawnPromotion();
        this.gameState.takeBack();
        this.resetPawnPromotion();
        this.forceUpdate();
    };

    private newGame = () => {
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
        return !this.grabbedPiece && element.classList.contains('chess-piece');
    }

    private isKingInCheck() {
        return MovesHelper.isKingInCheck(
            this.gameState.turn,
            this.gameState.board
        );
    }

    private isCheckMate() {
        const isCheckMate = MovesHelper.isCheckMate(
            this.gameState.turn,
            this.gameState.board,
            this.gameState.lastMove()
        );

        return isCheckMate;
    }

    private getPixelSize(): number {
        const p = Math.min(window.innerWidth, window.innerHeight) / 1000.0;
        return p;
    }
}

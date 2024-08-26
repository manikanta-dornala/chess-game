import React, { createRef } from 'react';
import PawnPromotion from '../pawn-promotion-popover/pawn-promotion';
import BoardComponent from '../board/board';
import Popover from '../pawn-promotion-popover/popover';
import { GameState } from '../../common/game';
import { IMove, IPiece } from '../../common/interfaces';
import { ChessColor, MoveType, PieceName } from '../../common/enums';
import { PositionHelper } from '../../common/position-helper';
import { MovesHelper } from '../../common/moves-helper';

import './chess.css';

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
                            isKingInCheck={this.isKingInCheck()}
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
                                x: this.boardRef.current!.offsetLeft + 275,
                                y: this.boardRef.current!.offsetTop + 350,
                            }}
                        >
                            <div
                                className="grid"
                                style={{ background: 'white', padding: '50px' }}
                            >
                                checkmate {this.gameState.turn} king
                            </div>
                        </Popover>
                    )}
                </div>
                <div className="info">
                    <button onClick={this.newGame}>New Game</button>
                    <button onClick={this.toggleBoardColor}>Flip Board</button>
                    <p>Current turn: {this.gameState.turn}</p>
                    {/* <p>{this.checkmateMessage()}</p> */}
                    <button
                        onClick={this.undoLastMove}
                        disabled={
                            !this.gameState.boards.length ||
                            this.showPawnPromotionLogic
                        }
                    >
                        Undo last move
                    </button>
                    {this.gameState.moves.length > 0 && <p>Moves</p>}
                    <ul style={{ height: '50vh', overflow: 'scroll' }}>
                        {this.gameState.moves.map(this.renderMove)}
                    </ul>
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
                    this.gameState.lastMove(),
                    this.gameState.castlingRights
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
        coord.y += 50;
        coord.x += 50;
        if (coord.y > offsetTop + 600) {
            coord.y = coord.y - 250;
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

    private renderMove = (move: IMove) => (
        <li
            key={`${move.position}-${move.piece.color}-${move.piece.name}-${move.target}`}
        >
            {`${move.position} ${move.piece.color} ${move.piece.name} ${move.type.toLowerCase()} ${move.target}`}
        </li>
    );

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
            (this.boundX(x) - this.boardRef.current!.offsetLeft) / 100
        );
        const rankIndex = Math.floor(
            (this.boundY(y) - this.boardRef.current!.offsetTop) / 100
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
            x: offsetLeft + 100 * indices.x,
            y: offsetTop + 100 * indices.y,
        };
    }

    private boundX = (x: number) =>
        Math.max(
            this.boardRef.current!.offsetLeft,
            Math.min(x, this.boardRef.current!.offsetLeft + 701)
        );
    private boundY = (y: number) =>
        Math.max(
            this.boardRef.current!.offsetTop,
            Math.min(y, this.boardRef.current!.offsetTop + 701)
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
            this.gameState.lastMove(),
            this.gameState.castlingRights
        );

        return isCheckMate;
    }
}

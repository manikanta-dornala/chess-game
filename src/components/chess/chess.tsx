import PawnPromotion from '../pawn-promotion-popover/pawn-promotion';
import React, { createRef } from 'react';
import BoardComponent from '../board/board';
import { GameState } from '../../common/game';
import { IMove, IPiece } from '../../common/interfaces';
import { ChessColor, MoveType, PieceName } from '../../common/enums';

import './chess.css';
import { PositionHelper } from '../../common/position-helper';
import { MovesHelper } from '../../common/moves-helper';
import Popover from '../pawn-promotion-popover/popover';

export default class ChessComponent extends React.Component {
    private boardRef = createRef<HTMLDivElement>();
    grabbedPiece: IPiece | null = null;
    grabbedPieceCurrPosition: string = '';
    gameState = new GameState();
    highlightPositions: string[] = [];
    grabbedElm: HTMLElement | null = null;
    bottomColor = ChessColor.Light;

    showPawnPromotionLogic = false;
    pawnPromotionPosition: string | null = null;
    pawnPromotionCoord: { x: number; y: number } | null = null;

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
                                onSelect={this.handlePromotionSelect}
                            />
                        </Popover>
                    )}
                </div>
                <div className="info">
                    <button
                        onClick={(e) => {
                            this.gameState = new GameState();
                            this.forceUpdate();
                        }}
                    >
                        New Game
                    </button>
                    <p></p>
                    <button onClick={this.toggleBoardColor}>Flip Board</button>
                    <p>
                        Current turn: {this.gameState.turn}{' '}
                        {this.isKingInCheck() ? 'check' : ''}
                    </p>
                    <p>
                        {MovesHelper.isCheckMate(
                            this.gameState.turn,
                            this.gameState.board,
                            this.gameState.lastMove(),
                            this.gameState.castlingRights
                        )
                            ? 'Checkmate'
                            : ''}
                    </p>
                    <button
                        onClick={this.undoLastMove}
                        disabled={!this.gameState.boards.length}
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

    grabPiece = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (this.isGrabbable(target)) {
            const position = this.getPositionAtCoord(
                this.boundX(e.clientX),
                this.boundY(e.clientY)
            );
            const piece = this.gameState.board[position];
            if (piece) {
                this.highlightPositions = MovesHelper.getLegalMoves(
                    this.gameState.turn,
                    piece,
                    position,
                    this.gameState.board,
                    this.gameState.lastMove(),
                    this.gameState.castlingRights
                ).map((e) => e.target);
                this.grabbedPiece = piece;
                this.grabbedElm = target;
                this.grabbedPieceCurrPosition = position;
                this.forceUpdate();
            }
        }
    };

    dropPiece = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.grabbedPiece) {
            const targetPosition = this.getPositionAtCoord(
                this.boundX(e.clientX),
                this.boundY(e.clientY)
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

    togglePawnPromotion(position: string) {
        console.log('toggle at', position);
        this.pawnPromotionPosition = position;
        this.pawnPromotionCoord = this.getCoordAtPosition(position);
        if (this.pawnPromotionCoord) this.showPawnPromotionLogic = true;
        this.forceUpdate();
    }

    handlePromotionSelect(pieceName: PieceName) {
        console.log(
            'promoted to',
            pieceName,
            'at',
            this.pawnPromotionPosition,
            this.pawnPromotionCoord,
            this.gameState
        );
        if (this.pawnPromotionPosition) {
            console.log(pieceName);
            this.gameState.handlePawnPromotion(this.pawnPromotionPosition, {
                name: pieceName,
                color: this.gameState.turn,
            });
            this.pawnPromotionCoord = null;
            this.pawnPromotionPosition = null;
            this.showPawnPromotionLogic = false;
            this.forceUpdate();
        }
    }

    toggleBoardColor = () => {
        this.bottomColor =
            this.bottomColor === ChessColor.Light
                ? ChessColor.Dark
                : ChessColor.Light;
        this.forceUpdate();
    };

    undoLastMove = () => {
        this.gameState.takeBack();
        this.forceUpdate();
    };

    renderMove = (move: IMove) => (
        <li
            key={`${move.position}-${move.piece.color}-${move.piece.name}-${move.target}`}
        >
            {`${move.position} ${move.piece.color} ${move.piece.name} ${move.type.toLowerCase()} ${move.target}`}
        </li>
    );

    resetGrab = () => {
        this.grabbedPiece = null;
        this.grabbedPieceCurrPosition = '';
        this.highlightPositions = [];
        this.forceUpdate();
    };

    boundX = (x: number) =>
        this.boundCoordinate(x, this.getBoardDimensions().offsetLeft ?? 0);
    boundY = (y: number) =>
        this.boundCoordinate(y, this.getBoardDimensions().offsetTop ?? 0);

    boundCoordinate = (coord: number, min: number) =>
        Math.max(min, Math.min(coord, min + 701));

    getPositionAtCoord(x: number, y: number) {
        const minX = this.boardRef.current?.offsetLeft ?? 0;
        const minY = this.boardRef.current?.offsetTop ?? 0;
        const fileIndex = Math.floor((x - minX) / 100);
        const rankIndex = Math.floor((y - minY) / 100);
        return PositionHelper.gridCoordToPosition({
            rankIndex,
            fileIndex,
            bottomColor: this.bottomColor,
        });
    }

    getCoordAtPosition(position: string) {
        const indices = PositionHelper.getPositionToCoord(
            position,
            this.bottomColor
        );
        if (indices) {
            const minX = this.boardRef.current?.offsetLeft ?? 0;
            const minY = this.boardRef.current?.offsetTop ?? 0;
            return {
                x: minX + 100 * indices.x,
                y: minY + 100 * indices.y,
            };
        }
        return null;
    }

    isGrabbable(element: HTMLElement): boolean {
        return !this.grabbedPiece && element.classList.contains('chess-piece');
    }

    private getBoardDimensions() {
        if (this.boardRef.current) {
            const { offsetLeft, offsetTop } = this.boardRef.current;
            return { offsetLeft, offsetTop };
        }
        return { offsetLeft: 0, offsetTop: 0 };
    }

    isKingInCheck() {
        return MovesHelper.isKingInCheck(
            this.gameState.turn,
            this.gameState.board
        );
    }
}

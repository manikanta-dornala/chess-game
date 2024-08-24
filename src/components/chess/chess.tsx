import React, { createRef } from 'react';
import BoardComponent from '../board/board';
import { GameState, IMove } from '../../common/game';
import { IPiece } from '../../common/piece';
import { ChessColor } from '../../common/enums';

import './chess.css';
import { ChessPositionHelper } from '../../common/chess-position-helper';

export default class ChessComponent extends React.Component {
    private boardRef = createRef<HTMLDivElement>();
    grabbedPiece: IPiece | null = null;
    grabbedPieceCurrPosition = '';
    gameState = new GameState();
    highlightPositions: string[] = [];
    grabbedElm: HTMLElement | null = null;
    bottomColor = ChessColor.Light;

    render(): React.ReactNode {
        return (
            <div className="container">
                <div className="chess-container">
                    <div
                        id="chess-game"
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={this.dropPiece}
                        onDragStart={this.grabPiece}
                        onDrag={(e) => this.hideGrabbedElement()}
                        ref={this.boardRef}
                    >
                        <BoardComponent
                            gameState={this.gameState}
                            highlightPositions={this.highlightPositions}
                            bottomColor={this.bottomColor}
                        />
                    </div>
                </div>
                <div className="info">
                    <button onClick={this.toggleBoardColor}>Flip Board</button>
                    <p>Current turn: {this.gameState.turn}</p>
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
                this.highlightPositions = this.gameState.getPossibleTargets(
                    piece,
                    position
                );
                this.grabbedPiece = piece;
                this.grabbedElm = target;
                this.grabbedPieceCurrPosition = position;
                this.forceUpdate();
            }
        }
    };

    dropPiece = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.grabbedPiece) {
            this.showGrabbedElement();
            const targetPosition = this.getPositionAtCoord(
                this.boundX(e.clientX),
                this.boundY(e.clientY)
            );
            if (this.highlightPositions.includes(targetPosition)) {
                this.gameState.makeMove(
                    this.grabbedPieceCurrPosition,
                    targetPosition
                );
            }
            this.resetGrab();
        }
    };

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

    hideGrabbedElement = () => {
        if (this.grabbedElm) this.grabbedElm.style.display = 'none';
    };

    showGrabbedElement = () => {
        if (this.grabbedElm) this.grabbedElm.style.display = 'block';
    };

    resetGrab = () => {
        this.grabbedPiece = null;
        this.highlightPositions = [];
        this.forceUpdate();
    };

    boundX = (x: number) =>
        this.boundCoordinate(x, this.boardRef.current?.offsetLeft ?? 0);
    boundY = (y: number) =>
        this.boundCoordinate(y, this.boardRef.current?.offsetTop ?? 0);

    boundCoordinate = (coord: number, min: number) =>
        Math.max(min, Math.min(coord, min + 701));

    getPositionAtCoord(x: number, y: number) {
        const minX = this.boardRef.current?.offsetLeft ?? 0;
        const minY = this.boardRef.current?.offsetTop ?? 0;
        const fileIndex = Math.floor((x - minX) / 100);
        const rankIndex = Math.floor((y - minY) / 100);
        return ChessPositionHelper.gridCoordToPosition({
            rankIndex,
            fileIndex,
            bottomColor: this.bottomColor,
        });
    }

    isGrabbable(element: HTMLElement): boolean {
        return !this.grabbedPiece && element.classList.contains('chess-piece');
    }
}

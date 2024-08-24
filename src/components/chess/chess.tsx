import React, { createRef } from 'react';
import BoardComponent from '../board/board';
import { GameState, IMove } from '../../common/game';
import { IPiece } from '../../common/piece';
import { ChessColor } from '../../common/enums';

import './chess.css';
import { BoardCoordinateSystem } from '../../common/constants';

export default class ChessComponent extends React.Component {
    private boardRef = createRef<HTMLDivElement>();
    grabbedPiece: IPiece | null = null;
    grabbedPieceCurrPosition: string = '';
    gameState: GameState;
    highlightPositions: Array<string> = [];
    grabbedElm: HTMLElement | null = null;
    bottomColor = ChessColor.Light;
    constructor(props: any) {
        super(props);
        this.gameState = new GameState();
    }

    render(): React.ReactNode {
        return (
            <div className="container">
                <div className="chess-container">
                    <div
                        id="chess-game"
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={(e) => this.dropPiece(e)}
                        onDragStart={(e) => this.grabPiece(e)}
                        onDrag={(e) => {
                            if (this.grabbedElm) {
                                this.grabbedElm.style.display = 'none';
                            }
                        }}
                        ref={this.boardRef}
                    >
                        <BoardComponent
                            gameState={this.gameState}
                            highlightPositions={this.highlightPositions}
                            bottomColor={this.bottomColor}
                        ></BoardComponent>
                    </div>
                </div>
                <div className="info">
                    <button
                        onClick={(e) => {
                            this.bottomColor =
                                this.bottomColor === ChessColor.Light
                                    ? ChessColor.Dark
                                    : ChessColor.Light;
                            this.forceUpdate();
                        }}
                    >
                        Flip Board
                    </button>
                    <p>Current turn: {this.gameState.turn}</p>

                    <button
                        onClick={(e) => {
                            this.gameState.takeBack();
                            this.forceUpdate();
                        }}
                        disabled={this.gameState.boards.length === 0}
                    >
                        Undo last move
                    </button>
                    {this.gameState.moves.length ? <p>Moves</p> : ''}
                    <ul>
                        {this.gameState.moves.map((move: IMove) => {
                            return (
                                <li>
                                    {move.position} {move.piece.color}{' '}
                                    {move.piece.name} {move.type.toLowerCase()}{' '}
                                    {move.target}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }

    grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        let currelm = e.target as HTMLElement;
        if (
            (this.grabbedPiece === null || this.grabbedPiece === undefined) &&
            currelm.classList.contains('chess-piece')
        ) {
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
                this.forceUpdate();
                this.grabbedElm = currelm;
                this.grabbedPieceCurrPosition = position;
            }
        }
    }

    dropPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.grabbedPiece) {
            if (this.grabbedElm) {
                this.grabbedElm.style.display = 'block';
            }
            const currPosition = this.grabbedPieceCurrPosition;
            const targetPosition = this.getPositionAtCoord(
                this.boundX(e.clientX),
                this.boundY(e.clientY)
            );

            this.gameState.makeMove(currPosition, targetPosition);

            this.grabbedPiece = null;
            this.highlightPositions = [];
            this.forceUpdate();
        }
    }

    boundX(x: number) {
        const minX = this.boardRef.current?.offsetLeft ?? 0;
        // x = x;
        x = x < minX ? minX : x;
        x = x > minX + 701 ? minX + 701 : x;
        return x;
    }

    boundY(y: number) {
        const minY = this.boardRef.current?.offsetTop ?? 0;
        // y = y;
        y = y < minY ? minY : y;
        y = y > minY + 701 ? minY + 701 : y;
        return y;
    }

    getPositionAtCoord(x: number, y: number) {
        const minX = this.boardRef.current?.offsetLeft ?? 0;
        const minY = this.boardRef.current?.offsetTop ?? 0;

        let i = Math.floor((x - minX) / 100);
        let j = Math.floor((y - minY) / 100);
        return BoardCoordinateSystem.gridCoordToPosition({
            rankIndex: j,
            fileIndex: i,
            bottomColor: this.bottomColor,
        });
    }
}

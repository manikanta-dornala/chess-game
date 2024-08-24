import React, { createRef } from 'react';
import BoardComponent from '../board/board';
import { GameState, getCoordToPosition } from '../../common/game';
import { ChessColor } from '../../common/enums';
import { IPiece } from '../../common/piece';

export default class ChessComponent extends React.Component {
    private boardRef = createRef<HTMLDivElement>();
    grabbedPiece: IPiece | null = null;
    grabbedPieceInitialPosition: string = '';
    gameState: GameState;
    highlightPositions: Array<string> = [];
    grabbedElm: HTMLElement | null = null;
    constructor(props: any) {
        super(props);
        this.gameState = new GameState(ChessColor.Light);
    }

    render(): React.ReactNode {
        return (
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
                ></BoardComponent>
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
            const piece = this.gameState.squares[position];

            if (piece) {
                this.highlightPositions = this.gameState.getPossibleMoves(
                    piece,
                    position
                );
                this.grabbedPiece = piece;
                this.forceUpdate();
                this.grabbedElm = currelm;
                this.grabbedPieceInitialPosition = position;
            }
        }
    }

    movePiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {}

    dropPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.grabbedPiece) {
            if (this.grabbedElm) {
                this.grabbedElm.style.display = 'block';
            }
            const initialPosition = this.grabbedPieceInitialPosition;
            const finalPosition = this.getPositionAtCoord(
                this.boundX(e.clientX),
                this.boundY(e.clientY)
            );

            this.gameState.makeMove(initialPosition, finalPosition);

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
        return getCoordToPosition({ rankIndex: j, fileIndex: i });
    }
}

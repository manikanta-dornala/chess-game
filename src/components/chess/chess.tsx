import React, { createRef } from 'react';
import BoardComponent from '../board/board';
import {
    BoardState,
    cloneBoardState,
    getPieceAtPosition,
} from '../../common/game';
import { ChessColor, PieceName } from '../../common/enums';

export default class ChessComponent extends React.Component<{}, BoardState> {
    private boardRef = createRef<HTMLDivElement>();
    grabbedPiece: any = null;
    grabbedPieceInitialPosition: string = '';
    constructor(props: any) {
        super(props);
        const boardState = new BoardState(ChessColor.Light);
        this.state = boardState;
    }

    render(): React.ReactNode {
        return (
            <div
                id="chess-game"
                // onMouseDown={(e) => this.grabPiece(e)}
                // onMouseMove={(e) => this.movePiece(e)}
                // onMouseUp={(e) => this.dropPiece(e)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={(e) => this.dropPiece(e)}
                onDragStart={(e) => this.grabPiece(e)}
                ref={this.boardRef}
            >
                <BoardComponent boardState={this.state}></BoardComponent>
            </div>
        );
    }

    grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        let currelm = e.target as HTMLElement;
        if (
            (this.grabbedPiece === null || this.grabbedPiece === undefined) &&
            currelm.classList.contains('chess-piece')
        ) {
            // const elm = new HTMLDivElement();
            // elm.style.position = 'absolute';
            // elm.style.left = `${this.boundX(e.clientX)}px`;
            // elm.style.top = `${this.boundY(e.clientY)}px`;
            this.grabbedPieceInitialPosition = this.getPositionAtCoord(
                this.boundX(e.clientX),
                this.boundY(e.clientY)
            );
            const piece = getPieceAtPosition(
                this.grabbedPieceInitialPosition,
                this.state
            );

            this.grabbedPiece = piece;

            // this.grabbedPiece = elm;
        }
    }

    movePiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {}

    dropPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.grabbedPiece) {
            const move = {
                initial: this.grabbedPieceInitialPosition,
                final: this.getPositionAtCoord(
                    this.boundX(e.clientX),
                    this.boundY(e.clientY)
                ),
            };

            console.log(move);

            if (move.initial !== move.final) {
                const initial = this.state.coordinateMap[move.initial];
                const final = this.state.coordinateMap[move.final];

                // const newBoardState: BoardState = this.state;
                let initialState = this.state.map[initial[0]][initial[1]];
                let finalState = this.state.map[final[0]][final[1]];
                finalState.piece = initialState.piece;
                initialState.piece = undefined;

                this.setState((prev) => this.state);
            }

            this.grabbedPiece = null;
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
        return this.state.map[j][i].position;
    }
}

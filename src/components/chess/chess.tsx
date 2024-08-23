import React, { createRef } from 'react';
import BoardComponent from '../board/board';
import { GameState } from '../../common/game';
import { ChessColor } from '../../common/enums';

export default class ChessComponent extends React.Component {
    private boardRef = createRef<HTMLDivElement>();
    grabbedPiece: any = null;
    grabbedPieceInitialPosition: string = '';
    gameState: GameState;
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
                ref={this.boardRef}
            >
                <BoardComponent gameState={this.gameState}></BoardComponent>
            </div>
        );
    }

    grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        let currelm = e.target as HTMLElement;
        if (
            (this.grabbedPiece === null || this.grabbedPiece === undefined) &&
            currelm.classList.contains('chess-piece')
        ) {
            this.grabbedPieceInitialPosition = this.getPositionAtCoord(
                this.boundX(e.clientX),
                this.boundY(e.clientY)
            );
            const piece = this.gameState.getPieceAtPosition(
                this.grabbedPieceInitialPosition
            );

            this.grabbedPiece = piece;
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

            if (move.initial !== move.final) {
                const initial = this.gameState.coordinateMap[move.initial];
                const final = this.gameState.coordinateMap[move.final];

                // const newBoardState: BoardState = this.gameState;
                let initialState = this.gameState.map[initial[0]][initial[1]];
                let finalState = this.gameState.map[final[0]][final[1]];
                finalState.piece = initialState.piece;
                initialState.piece = undefined;

                this.setState((prev) => this.gameState);
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
        return this.gameState.map[j][i].position;
    }
}

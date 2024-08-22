import React, { createRef } from 'react';

import './board.css';
import SquareComponent from '../square/square';
import { getInitialPosisitions } from '../../common/initial-positions';
import { ChessColor } from '../../common/enums';

const xAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const yAxis = ['1', '2', '3', '4', '5', '6', '7', '8'].reverse();

export default class BoardComponent extends React.Component {
    private boardRef = createRef<HTMLDivElement>();
    initialPositions = getInitialPosisitions(ChessColor.Light);
    grabbedPiece: any = null;
    constructor(props: any) {
        super(props);
        let boardState: Array<Array<any>> = [[]];
        for (let j = 0; j < yAxis.length; j++) {
            boardState[j] = [];
            for (let i = 0; i < xAxis.length; i++) {
                let position = xAxis[i] + yAxis[j];
                boardState[j].push({ position: position });
            }
        }
        this.state = { boardState: boardState };
    }

    render(): React.ReactNode {
        let squares = [];
        for (let j = 0; j < yAxis.length; j++) {
            for (let i = 0; i < xAxis.length; i++) {
                let position = xAxis[i] + yAxis[j];
                squares.push(
                    <SquareComponent
                        key={position}
                        position={position}
                        index={i + j}
                        piece={this.initialPositions[position]}
                    ></SquareComponent>
                );
            }
        }
        return (
            <div
                id="board"
                onMouseDown={(e) => this.grabPiece(e)}
                onMouseMove={(e) => this.movePiece(e)}
                onMouseUp={(e) => this.dropPiece(e)}
                ref={this.boardRef}
            >
                {squares}
            </div>
        );
    }

    grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        let elm = e.target as HTMLElement;
        if (!this.grabbedPiece && elm.classList.contains('chess-piece')) {
            elm.style.position = 'absolute';
            elm.style.left = `${this.boundX(e.clientX)}px`;
            elm.style.top = `${this.boundY(e.clientY)}px`;
            this.grabbedPiece = elm;
        }
    }

    movePiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (this.grabbedPiece) {
            this.grabbedPiece.style.position = 'absolute';
            this.grabbedPiece.style.left = `${this.boundX(e.clientX)}px`;
            this.grabbedPiece.style.top = `${this.boundY(e.clientY)}px`;
        }
    }

    dropPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.grabbedPiece = null;
    }

    boundX(x: number) {
        const minX = this.boardRef.current?.offsetLeft ?? 0;
        x = x - 50;
        x = x < minX ? minX : x;
        x = x > minX + 701 ? minX + 701 : x;
        return x;
    }

    boundY(y: number) {
        const minY = this.boardRef.current?.offsetTop ?? 0;
        y = y - 50;
        y = y < minY ? minY : y;
        y = y > minY + 701 ? minY + 701 : y;
        return y;
    }
}

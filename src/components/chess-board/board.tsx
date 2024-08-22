import React from 'react';

import './board.css';
import SquareComponent from '../square/square';

const xAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const yAxis = ['1', '2', '3', '4', '5', '6', '7', '8'].reverse();

export default class BoardComponent extends React.Component {
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
                        squarePosition={position}
                        index={i + j}
                    ></SquareComponent>
                );
            }
        }
        return <div id="board">{squares}</div>;
    }
}

import React from 'react';

import './board.css';
import SquareComponent from '../square/square';
import { BoardState, xAxis, yAxis } from '../../common/game';

export default class BoardComponent extends React.Component<{
    boardState: BoardState;
}> {
    render(): React.ReactNode {
        let squares = [];
        for (let j = 0; j < yAxis.length; j++) {
            for (let i = 0; i < xAxis.length; i++) {
                let position = xAxis[i] + yAxis[j];
                squares.push(
                    <SquareComponent
                        key={position}
                        position={position}
                        boardState={this.props.boardState}
                    ></SquareComponent>
                );
            }
        }
        return <div className="board">{squares}</div>;
    }
}

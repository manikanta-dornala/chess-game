import React from 'react';

import './board.css';
import SquareComponent from '../square/square';
import { GameState, xAxis, yAxis } from '../../common/game';

export default class BoardComponent extends React.Component<{
    gameState: GameState;
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
                        gameState={this.props.gameState}
                    ></SquareComponent>
                );
            }
        }
        return <div className="board">{squares}</div>;
    }
}

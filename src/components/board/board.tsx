import React from 'react';

import './board.css';
import SquareComponent from '../square/square';
import { GameState, chessFiles, chessRanks } from '../../common/game';

export default class BoardComponent extends React.Component<{
    gameState: GameState;
    highlightPositions: Array<string>;
}> {
    render(): React.ReactNode {
        let squares = [];
        for (let j = 0; j < chessRanks.length; j++) {
            for (let i = 0; i < chessFiles.length; i++) {
                let position = chessFiles[i] + chessRanks[j];
                squares.push(
                    <SquareComponent
                        key={position}
                        position={position}
                        gameState={this.props.gameState}
                        highlight={this.props.highlightPositions.includes(
                            position
                        )}
                    ></SquareComponent>
                );
            }
        }
        return <div className="board">{squares}</div>;
    }
}

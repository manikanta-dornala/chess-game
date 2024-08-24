import React from 'react';

import './board.css';
import { BoardCoordinateSystem, GameState } from '../../common/game';
import { ChessColor } from '../../common/enums';
import SquareComponent from './square/square';

export default class BoardComponent extends React.Component<{
    gameState: GameState;
    bottomColor: ChessColor;
    highlightPositions: Array<string>;
}> {
    render(): React.ReactNode {
        let squares = [];
        for (let j = 0; j < BoardCoordinateSystem.ranks.length; j++) {
            for (let i = 0; i < BoardCoordinateSystem.files.length; i++) {
                let position = BoardCoordinateSystem.getCoordToPosition({
                    rankIndex: j,
                    fileIndex: i,
                    bottomColor: this.props.bottomColor,
                });
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

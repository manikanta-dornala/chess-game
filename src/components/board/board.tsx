import React from 'react';

import './board.css';
import { GameState } from '../../common/game';
import { ChessColor } from '../../common/enums';
import SquareComponent from './square/square';
import { ChessPositionHelper } from '../../common/chess-position-helper';

export default class BoardComponent extends React.Component<{
    gameState: GameState;
    bottomColor: ChessColor;
    highlightPositions: Array<string>;
    grabbedPiecePosition: string;
}> {
    getSquares() {
        let squares = [];
        for (let j = 0; j < ChessPositionHelper.ranks.length; j++) {
            for (let i = 0; i < ChessPositionHelper.files.length; i++) {
                let position = ChessPositionHelper.gridCoordToPosition({
                    rankIndex: j,
                    fileIndex: i,
                    bottomColor: this.props.bottomColor,
                });
                squares.push(
                    <SquareComponent
                        key={position}
                        position={position}
                        piece={this.props.gameState.board[position]}
                        highlight={this.props.highlightPositions.includes(
                            position
                        )}
                        grabbedPieceOpacity={
                            this.props.grabbedPiecePosition === position
                                ? 0.2
                                : 1
                        }
                    ></SquareComponent>
                );
            }
        }
        return squares;
    }
    render(): React.ReactNode {
        return <div className="board">{this.getSquares()}</div>;
    }
}

import React from 'react';
import { GameState } from '../../../common/game';
import { ChessColor } from '../../../common/enums';
import { PieceSymbols } from '../../../common/initial-piece-positions';

import './score.css';

export default class ScoreComponent extends React.Component<
    { gameState: GameState },
    any
> {
    getCapturedPiecesUI(color: ChessColor) {
        const capturedPieces = this.props.gameState.capturedPieces[color];
        const opponentColor =
            color === ChessColor.Light ? ChessColor.Dark : ChessColor.Light;
        return capturedPieces
            .map((pieceName) => PieceSymbols[opponentColor][pieceName])
            .join('');
    }

    render() {
        return (
            <div>
                <h3>Score</h3>
                <h4>{ChessColor.Light}</h4>
                <p className="captured-pieces">
                    {this.getCapturedPiecesUI(ChessColor.Light)}
                </p>
                <h4>{ChessColor.Dark}</h4>
                <p className="captured-pieces">
                    {this.getCapturedPiecesUI(ChessColor.Dark)}
                </p>
            </div>
        );
    }
}

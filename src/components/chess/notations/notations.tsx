import React from 'react';
import { GameState } from '../../../common/game';
import { ChessColor } from '../../../common/enums';
import getFEN from '../../../common/notations/fen';
import { getPGN, getMovePGN } from '../../../common/notations/pgn';
import './notations';
import { PieceSymbols } from '../../../common/initial-piece-positions';
export default class NotationsComponent extends React.Component<
    { gameState: GameState },
    any
> {
    render() {
        return (
            <div>
                <h3>FEN (Forsyth-Edwards Notation)</h3>
                <p className="notations">{getFEN(this.props.gameState)}</p>
                <div hidden={this.props.gameState.moves.length === 0}>
                    <h3>PGN (Portable Game Notation) </h3>
                    <p className="notations">
                        {getPGN(this.props.gameState.moves)}
                    </p>
                    <h3>Moves</h3>
                    <table className="moves-table">
                        <tbody>{this.renderMoves()}</tbody>
                    </table>
                </div>
            </div>
        );
    }

    renderMoves(): React.ReactNode[] {
        let blackMoves = 1;
        const moves: React.ReactNode[] = [];

        this.props.gameState.moves.forEach((move) => {
            moves.push(
                <tr
                    key={`${move.position}-${move.piece.color}-${move.piece.name}-${move.target}`}
                >
                    <td>{blackMoves}</td>
                    <td>{getMovePGN(move)}</td>{' '}
                    <td>
                        {move.position}{' '}
                        <span style={{ fontFamily: 'Merida' }}>
                            {PieceSymbols[move.piece.color][move.piece.name]}
                        </span>{' '}
                        {move.type.toLowerCase()} {move.target}
                    </td>
                </tr>
            );
            if (move.piece.color === ChessColor.Dark) {
                blackMoves += 1;
            }
        });
        return moves;
    }
}

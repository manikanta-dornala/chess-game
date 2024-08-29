import React from 'react';
import { GameState } from '../../../common/game';
import { ChessColor } from '../../../common/enums';
import getFEN from '../../../common/notations/fen';
import './notations.css';
import { PieceSymbols } from '../../../common/initial-piece-positions';
import { getFullPGN } from '../../../common/notations/pgn';
export default class NotationsComponent extends React.Component<
    { gameState: GameState },
    any
> {
    render() {
        return (
            <div>
                <h3>
                    <a
                        href="https://www.chess.com/terms/fen-chess"
                        target="_blank"
                    >
                        FEN
                    </a>{' '}
                    (Forsyth-Edwards Notation)
                </h3>
                <p className="notations">
                    {getFEN({
                        board: this.props.gameState.board,
                        turn: this.props.gameState.turn,
                        lastMove: this.props.gameState.lastMove(),
                        halfmoveClock: this.props.gameState.halfmoveClock,
                        fullmoveNumber: this.props.gameState.fullmoveNumber,
                    })}
                </p>
                <div hidden={this.props.gameState.moves.length === 0}>
                    <h3>
                        <a
                            href="https://www.chess.com/terms/chess-pgn"
                            target="_blank"
                        >
                            PGN
                        </a>{' '}
                        (Portable Game Notation)
                    </h3>
                    <p className="notations">
                        {getFullPGN(this.props.gameState.moves)}
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
        const moves: React.ReactNode[] = [];

        this.props.gameState.moves.forEach((move, index) => {
            moves.push(
                <tr
                    key={`${move.position}-${move.piece.color}-${move.piece.name}-${move.target}`}
                >
                    <td>{index + 1}</td>
                    <td>{move.pgn}</td>
                    <td>
                        {move.position}{' '}
                        <span style={{ fontFamily: 'Merida' }}>
                            {PieceSymbols[move.piece.color][move.piece.name]}
                        </span>{' '}
                        {move.type.toLowerCase()} {move.target}
                    </td>
                </tr>
            );
        });
        return moves;
    }
}

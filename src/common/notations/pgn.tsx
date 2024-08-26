import { ChessColor, MoveType, PieceName } from '../enums';
import { IMove } from '../interfaces';

export function getPGN(moves: IMove[]): string {
    let pgn = '';
    let moveNumber = 1;

    moves.forEach((move, index) => {
        if (move.piece.color === ChessColor.Light) {
            pgn += `${moveNumber}. `;
        }

        pgn += getMovePGN(move);

        if (move.piece.color === ChessColor.Dark) {
            moveNumber++;
        }
        pgn += ' ';
    });

    return pgn.trim();
}

export function getMovePGN(move: IMove): string {
    const pieceNotation = getPieceNotation(move.piece.name);
    const target = move.target;

    switch (move.type) {
        case MoveType.Castling:
            return target === 'g1' || target === 'g8' ? 'O-O' : 'O-O-O';
        case MoveType.Capture:
        case MoveType.EnPassant:
            const captureNotation =
                move.piece.name === PieceName.Pawn
                    ? move.position[0]
                    : pieceNotation;
            return `${captureNotation}x${target}`;
        case MoveType.Promote:
            return `${target}=${getPieceNotation(PieceName.Queen)}`; // Default promotion to Queen
        default:
            return pieceNotation + target;
    }
}

function getPieceNotation(name: PieceName): string {
    switch (name) {
        case PieceName.Knight:
            return 'N';
        case PieceName.Bishop:
            return 'B';
        case PieceName.Rook:
            return 'R';
        case PieceName.Queen:
            return 'Q';
        case PieceName.King:
            return 'K';
        default:
            return ''; // Pawns don't have a letter in PGN notation
    }
}

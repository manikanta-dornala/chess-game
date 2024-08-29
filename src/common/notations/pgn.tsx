import { ChessColor, MoveType, PieceName } from '../enums';
import { IBoard, IMove } from '../interfaces';

export function getFullPGN(moves: IMove[]): string {
    return moves
        .map((move) => {
            return `${move.piece.color === ChessColor.Light ? move.fullMoveNumber + '. ' : ''}${move.pgn}`;
        })
        .join(' ');
}

export function getMovePGN(
    move: IMove,
    currentPossibleMoves: { [position: string]: IMove[] },
    board: IBoard
): string {
    const pieceNotation = getPieceNotation(move.piece.name);
    const isCapture = !!board[move.target] || move.type === MoveType.EnPassant;
    let disambiguation = '';

    // Find moves by the same piece type that can move to the same target square
    const similarMoves = Object.values(currentPossibleMoves)
        .flat()
        .filter(
            (m) =>
                m.piece.name === move.piece.name &&
                m.piece.color === move.piece.color &&
                m.target === move.target &&
                m.position !== move.position
        );

    if (similarMoves.length > 0) {
        // Check if pieces can be distinguished by file
        const sameFileMoves = similarMoves.filter(
            (m) => m.position[0] === move.position[0]
        );
        if (sameFileMoves.length > 0) {
            // If there are multiple pieces on the same file, disambiguate by rank
            const sameRankMoves = sameFileMoves.filter(
                (m) => m.position[1] === move.position[1]
            );
            if (sameRankMoves.length > 0) {
                disambiguation = move.position; // use full square notation (file + rank)
            } else {
                disambiguation = move.position[1]; // use rank
            }
        } else {
            disambiguation = move.position[0]; // use file
        }
    }

    const captureNotation = isCapture ? 'x' : '';
    const targetSquare = move.target;
    const promotion =
        move.type === MoveType.Promote
            ? `=${getPieceNotation(move.piece.name)}`
            : '';
    const enPassantSuffix = move.type === MoveType.EnPassant ? ' e.p.' : '';

    return `${pieceNotation}${disambiguation}${captureNotation}${targetSquare}${promotion}${enPassantSuffix}`;
}

export function getPieceNotation(name: PieceName): string {
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

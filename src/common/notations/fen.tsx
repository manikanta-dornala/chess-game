import { ChessColor, PieceName, MoveType } from '../enums';
import { ICastlingRights, IMove } from '../interfaces';
import { Board } from '../Board';

export default function getFEN({
    board,
    turn,
    lastMove,
    halfmoveClock,
    fullmoveNumber,
}: {
    board: Board;
    turn: ChessColor;
    lastMove: IMove | null;
    halfmoveClock: number;
    fullmoveNumber: number;
}): string {
    let fen = '';

    const castlingRights: ICastlingRights = {
        [ChessColor.Light]: board.lightCastlingRight,
        [ChessColor.Dark]: board.darkCastlingRight,
    };

    // 1. Piece placement
    for (let rank = 8; rank >= 1; rank--) {
        let emptySquares = 0;
        for (let file = 0; file < 8; file++) {
            const position = String.fromCharCode(97 + file) + rank; // e.g., "a8", "b8", etc.
            const piece = board.get(position);

            if (piece) {
                if (emptySquares > 0) {
                    fen += emptySquares;
                    emptySquares = 0;
                }
                const pieceChar = getPieceChar(piece.name, piece.color);
                fen += pieceChar;
            } else {
                emptySquares++;
            }
        }
        if (emptySquares > 0) {
            fen += emptySquares;
        }
        if (rank > 1) {
            fen += '/';
        }
    }

    // 2. Active color
    fen += ` ${turn === ChessColor.Light ? 'w' : 'b'}`;

    // 3. Castling rights
    let castling = '';
    if (castlingRights[ChessColor.Light]) {
        if (
            board['h1']?.name === PieceName.Rook &&
            board['e1']?.name === PieceName.King
        )
            castling += 'K';
        if (
            board['a1']?.name === PieceName.Rook &&
            board['e1']?.name === PieceName.King
        )
            castling += 'Q';
    }
    if (castlingRights[ChessColor.Dark]) {
        if (
            board['h8']?.name === PieceName.Rook &&
            board['e8']?.name === PieceName.King
        )
            castling += 'k';
        if (
            board['a8']?.name === PieceName.Rook &&
            board['e8']?.name === PieceName.King
        )
            castling += 'q';
    }
    fen += ` ${castling || '-'}`;

    // 4. En passant target square
    const enPassantTarget = getEnPassantTarget(lastMove);
    fen += ` ${enPassantTarget || '-'}`;

    // 5. Halfmove clock
    fen += ` ${halfmoveClock}`;

    // 6. Fullmove number
    fen += ` ${fullmoveNumber}`;

    return fen;
}

// Helper function to get the FEN character for a piece
function getPieceChar(name: PieceName, color: ChessColor): string {
    const pieceMap: { [key in PieceName]: string } = {
        [PieceName.Pawn]: 'p',
        [PieceName.Knight]: 'n',
        [PieceName.Bishop]: 'b',
        [PieceName.Rook]: 'r',
        [PieceName.Queen]: 'q',
        [PieceName.King]: 'k',
    };
    const char = pieceMap[name];
    return color === ChessColor.Light ? char.toUpperCase() : char.toLowerCase();
}

// Helper function to calculate the en passant target square
function getEnPassantTarget(lastMove: IMove | null): string | null {
    if (
        lastMove &&
        lastMove.piece.name === PieceName.Pawn &&
        lastMove.type === MoveType.DoubleMove
    ) {
        const file = lastMove.target[0];

        const enPassantRank =
            lastMove.piece.color === ChessColor.Light ? '3' : '6';
        return `${file}${enPassantRank}`;
    }
    return null;
}

import { ChessColor, PieceName } from './enums';
import { IPiece } from './piece';

export const initial_piece_positions: {
    [position: string]: IPiece;
} = {
    a1: { name: PieceName.Rook, color: ChessColor.Light },
    b1: { name: PieceName.Knight, color: ChessColor.Light },
    c1: { name: PieceName.Bishop, color: ChessColor.Light },
    d1: { name: PieceName.Queen, color: ChessColor.Light },
    e1: { name: PieceName.King, color: ChessColor.Light },
    f1: { name: PieceName.Bishop, color: ChessColor.Light },
    g1: { name: PieceName.Knight, color: ChessColor.Light },
    h1: { name: PieceName.Rook, color: ChessColor.Light },
    a2: { name: PieceName.Pawn, color: ChessColor.Light },
    b2: { name: PieceName.Pawn, color: ChessColor.Light },
    c2: { name: PieceName.Pawn, color: ChessColor.Light },
    d2: { name: PieceName.Pawn, color: ChessColor.Light },
    e2: { name: PieceName.Pawn, color: ChessColor.Light },
    f2: { name: PieceName.Pawn, color: ChessColor.Light },
    g2: { name: PieceName.Pawn, color: ChessColor.Light },
    h2: { name: PieceName.Pawn, color: ChessColor.Light },
    a7: { name: PieceName.Pawn, color: ChessColor.Dark },
    b7: { name: PieceName.Pawn, color: ChessColor.Dark },
    c7: { name: PieceName.Pawn, color: ChessColor.Dark },
    d7: { name: PieceName.Pawn, color: ChessColor.Dark },
    e7: { name: PieceName.Pawn, color: ChessColor.Dark },
    f7: { name: PieceName.Pawn, color: ChessColor.Dark },
    g7: { name: PieceName.Pawn, color: ChessColor.Dark },
    h7: { name: PieceName.Pawn, color: ChessColor.Dark },
    a8: { name: PieceName.Rook, color: ChessColor.Dark },
    b8: { name: PieceName.Knight, color: ChessColor.Dark },
    c8: { name: PieceName.Bishop, color: ChessColor.Dark },
    d8: { name: PieceName.Queen, color: ChessColor.Dark },
    e8: { name: PieceName.King, color: ChessColor.Dark },
    f8: { name: PieceName.Bishop, color: ChessColor.Dark },
    g8: { name: PieceName.Knight, color: ChessColor.Dark },
    h8: { name: PieceName.Rook, color: ChessColor.Dark },
};

export abstract class BoardCoordinateSystem {
    public static files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    public static ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    public static gridCoordToPosition({
        rankIndex,
        fileIndex,
        bottomColor,
    }: {
        rankIndex: number;
        fileIndex: number;
        bottomColor: ChessColor;
    }) {
        if (bottomColor === ChessColor.Light)
            return this.files[fileIndex] + this.ranks[rankIndex];
        else {
            const pos = this.files[7 - fileIndex] + this.ranks[7 - rankIndex];
            return pos;
        }
    }
}

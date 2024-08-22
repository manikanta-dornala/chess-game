import { ChessColor, PieceName } from './enums';
import { IPiece } from './piece';

export function getInitialPosisitions(bottomColor: ChessColor) {
    let topColor =
        bottomColor === ChessColor.Light ? ChessColor.Dark : ChessColor.Light;

    const initial_piece_positions: {
        [position: string]: IPiece;
    } = {
        a1: { name: PieceName.Rook, color: bottomColor },
        b1: { name: PieceName.Knight, color: bottomColor },
        c1: { name: PieceName.Bishop, color: bottomColor },
        d1: { name: PieceName.Queen, color: bottomColor },
        e1: { name: PieceName.King, color: bottomColor },
        f1: { name: PieceName.Bishop, color: bottomColor },
        g1: { name: PieceName.Knight, color: bottomColor },
        h1: { name: PieceName.Rook, color: bottomColor },
        a2: { name: PieceName.Pawn, color: bottomColor },
        b2: { name: PieceName.Pawn, color: bottomColor },
        c2: { name: PieceName.Pawn, color: bottomColor },
        d2: { name: PieceName.Pawn, color: bottomColor },
        e2: { name: PieceName.Pawn, color: bottomColor },
        f2: { name: PieceName.Pawn, color: bottomColor },
        g2: { name: PieceName.Pawn, color: bottomColor },
        h2: { name: PieceName.Pawn, color: bottomColor },
        a7: { name: PieceName.Pawn, color: topColor },
        b7: { name: PieceName.Pawn, color: topColor },
        c7: { name: PieceName.Pawn, color: topColor },
        d7: { name: PieceName.Pawn, color: topColor },
        e7: { name: PieceName.Pawn, color: topColor },
        f7: { name: PieceName.Pawn, color: topColor },
        g7: { name: PieceName.Pawn, color: topColor },
        h7: { name: PieceName.Pawn, color: topColor },
        a8: { name: PieceName.Rook, color: topColor },
        b8: { name: PieceName.Knight, color: topColor },
        c8: { name: PieceName.Bishop, color: topColor },
        d8: { name: PieceName.Queen, color: topColor },
        e8: { name: PieceName.King, color: topColor },
        f8: { name: PieceName.Bishop, color: topColor },
        g8: { name: PieceName.Knight, color: topColor },
        h8: { name: PieceName.Rook, color: topColor },
    };
    return initial_piece_positions;
}

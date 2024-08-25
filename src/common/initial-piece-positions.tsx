import { ChessColor, PieceName } from './enums';
import { IPiece } from './interfaces';
import { PositionHelper } from './position-helper';

const lightPieces: { [position: string]: IPiece } = {
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
};

const darkPieces: { [position: string]: IPiece } = {
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

export const InitialPiecePositions: { [position: string]: IPiece } = {};
PositionHelper.validSquares.forEach((position) => {
    InitialPiecePositions[position] =
        lightPieces[position] ?? darkPieces[position] ?? null;
});

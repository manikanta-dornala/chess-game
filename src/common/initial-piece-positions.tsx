import { ChessColor, PieceName } from './enums';
import { IPiece } from './piece';

const createPiece = (name: PieceName, color: ChessColor) => ({ name, color });

const lightPieces = {
    a1: createPiece(PieceName.Rook, ChessColor.Light),
    b1: createPiece(PieceName.Knight, ChessColor.Light),
    c1: createPiece(PieceName.Bishop, ChessColor.Light),
    d1: createPiece(PieceName.Queen, ChessColor.Light),
    e1: createPiece(PieceName.King, ChessColor.Light),
    f1: createPiece(PieceName.Bishop, ChessColor.Light),
    g1: createPiece(PieceName.Knight, ChessColor.Light),
    h1: createPiece(PieceName.Rook, ChessColor.Light),
    a2: createPiece(PieceName.Pawn, ChessColor.Light),
    b2: createPiece(PieceName.Pawn, ChessColor.Light),
    c2: createPiece(PieceName.Pawn, ChessColor.Light),
    d2: createPiece(PieceName.Pawn, ChessColor.Light),
    e2: createPiece(PieceName.Pawn, ChessColor.Light),
    f2: createPiece(PieceName.Pawn, ChessColor.Light),
    g2: createPiece(PieceName.Pawn, ChessColor.Light),
    h2: createPiece(PieceName.Pawn, ChessColor.Light),
};

const darkPieces = {
    a7: createPiece(PieceName.Pawn, ChessColor.Dark),
    b7: createPiece(PieceName.Pawn, ChessColor.Dark),
    c7: createPiece(PieceName.Pawn, ChessColor.Dark),
    d7: createPiece(PieceName.Pawn, ChessColor.Dark),
    e7: createPiece(PieceName.Pawn, ChessColor.Dark),
    f7: createPiece(PieceName.Pawn, ChessColor.Dark),
    g7: createPiece(PieceName.Pawn, ChessColor.Dark),
    h7: createPiece(PieceName.Pawn, ChessColor.Dark),
    a8: createPiece(PieceName.Rook, ChessColor.Dark),
    b8: createPiece(PieceName.Knight, ChessColor.Dark),
    c8: createPiece(PieceName.Bishop, ChessColor.Dark),
    d8: createPiece(PieceName.Queen, ChessColor.Dark),
    e8: createPiece(PieceName.King, ChessColor.Dark),
    f8: createPiece(PieceName.Bishop, ChessColor.Dark),
    g8: createPiece(PieceName.Knight, ChessColor.Dark),
    h8: createPiece(PieceName.Rook, ChessColor.Dark),
};

export const InitialPiecePositions: { [position: string]: IPiece } = {
    ...lightPieces,
    ...darkPieces,
};

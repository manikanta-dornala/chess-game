export enum ChessColor {
    Light = 'light',
    Dark = 'dark',
}

export enum PieceName {
    Pawn = 'pawn',
    Knight = 'knight',
    Bishop = 'bishop',
    Rook = 'rook',
    Queen = 'queen',
    King = 'king',
}

export enum MoveType {
    Move = 'move',
    DoubleMove = 'Move',
    Capture = 'capture',
    EnPassant = 'en passant',
    Promote = 'promote',
    Castling = 'castling',
}

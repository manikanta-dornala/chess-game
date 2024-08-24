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

export enum ChessDirection {
    Up = 'up',
    Down = 'Down',
}

export enum MoveType {
    Move = 'move',
    PawnMove2 = 'move 2',
    Capture = 'capture',
    EnPassant = 'en passant',
    Promote = 'promote',
}

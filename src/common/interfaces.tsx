import { ChessColor, MoveType, PieceName } from './enums';

export interface IPiece {
    name: PieceName;
    color: ChessColor;
}

export interface IBoard {
    [position: string]: IPiece | null;
}

export interface IMove {
    target: string;
    type: MoveType;
    piece: IPiece;
    position: string;
}

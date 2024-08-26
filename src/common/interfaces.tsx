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

export interface IMoveSet {
    file: number;
    rank: number;
}

export interface ICastlingRights {
    [ChessColor.Light]: boolean;
    [ChessColor.Dark]: boolean;
}

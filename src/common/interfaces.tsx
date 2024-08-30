import { ChessColor, MoveType, PieceName } from './enums';

export interface IPiece {
    name: PieceName;
    color: ChessColor;
}

export interface IMove {
    target: string;
    type: MoveType;
    piece: IPiece;
    position: string;
    pgn: string | null;
    fullMoveNumber: number | undefined;
    halfMoveNumber: number | undefined;
}

export function createMove({
    piece,
    position,
    target,
    type,
}: {
    target: string;
    type: MoveType;
    piece: IPiece;
    position: string;
}): IMove {
    return {
        target,
        type,
        piece,
        position,
        pgn: null,
        fullMoveNumber: undefined,
        halfMoveNumber: undefined,
    };
}

export interface IMoveSet {
    file: number;
    rank: number;
}

export interface ICastlingRights {
    [ChessColor.Light]: boolean;
    [ChessColor.Dark]: boolean;
}

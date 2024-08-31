import { Board } from '../Board';
import { ChessColor } from '../enums';
import { IMove } from '../interfaces';

export interface IBot {
    turn: ChessColor;
    isMakingTurn: boolean;

    getMove(board: Board, lastMove: IMove | null): IMove | null;
}

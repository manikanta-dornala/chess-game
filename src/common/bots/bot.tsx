import { Board } from '../Board';
import { ChessColor } from '../enums';
import { IMove } from '../interfaces';

export abstract class Bot {
    public turn: ChessColor;
    public isMakingTurn: boolean;
    constructor(turn: ChessColor) {
        this.turn = turn;
        this.isMakingTurn = false;
    }
    abstract getMove(
        board: Board,
        lastMove: IMove | null
    ): Promise<IMove | null>;
}

export type BotConstructor = new (turn: ChessColor) => Bot;

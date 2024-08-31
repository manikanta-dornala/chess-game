import { ChessColor } from '../enums';
import { IMove } from '../interfaces';
import { Board } from '../Board';
import { IBot } from './bot';
import { MovesHelper } from '../moves-helper';
import { PositionHelper } from '../position-helper';

export class RandomBot implements IBot {
    turn: ChessColor;
    isMakingTurn: boolean;
    constructor(turn: ChessColor) {
        this.turn = turn;
        this.isMakingTurn = false;
    }
    async getMove(board: Board, lastMove: IMove | null): Promise<IMove | null> {
        this.isMakingTurn = true;
        const myLegalMoves: IMove[] = [];
        PositionHelper.validSquares.forEach((position) => {
            const piece = board.get(position);
            if (piece && piece.color === this.turn) {
                const moves = MovesHelper.getLegalMoves(
                    this.turn,
                    piece,
                    position,
                    board
                );
                myLegalMoves.push(...moves);
            }
        });

        let result: IMove | null = null;
        if (myLegalMoves.length) {
            const randIndex = Math.floor(Math.random() * myLegalMoves.length);
            result = myLegalMoves[randIndex];
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(result);
            });
        });
    }
}

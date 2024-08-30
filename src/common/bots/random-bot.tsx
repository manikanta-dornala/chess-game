import { ChessColor } from '../enums';
import { IMove } from '../interfaces';
import { Board } from '../Board';
import { IBot } from './bot';
import { MovesHelper } from '../moves-helper';
import { PositionHelper } from '../position-helper';

export class RandomBot implements IBot {
    turn: ChessColor;
    constructor(turn: ChessColor) {
        this.turn = turn;
    }
    getMove(board: Board, lastMove: IMove | null): IMove | null {
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
        if (myLegalMoves.length) {
            const randIndex = Math.floor(Math.random() * myLegalMoves.length);
            return myLegalMoves[randIndex];
        }
        return null;
    }
}

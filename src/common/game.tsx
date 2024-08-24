import { ChessColor, MoveType } from './enums';
import { InitialPiecePositions } from './initial-piece-positions';
import { IMove, MovesHelper } from './moves-helper';
import { IPiece } from './piece';

export interface IBoard {
    [position: string]: IPiece | null;
}

export class GameState {
    board: IBoard; // Represents the current state of the chessboard
    turn: ChessColor = ChessColor.Light; // Tracks whose turn it is, starts with Light
    moves: Array<IMove> = []; // Tracks all moves made in the game
    boards: Array<IBoard> = []; // History of board states for undo functionality

    constructor() {
        this.board = { ...InitialPiecePositions }; // Initialize the board with the default piece positions
    }

    // Reverts the game state to the previous turn
    takeBack() {
        if (this.boards.length) {
            this.moves.pop(); // Remove the last move from history
            this.board = this.boards.pop() ?? this.board; // Revert to the previous board state
            this.turn =
                this.turn === ChessColor.Light
                    ? ChessColor.Dark
                    : ChessColor.Light; // Switch turn back to the previous player
        }
    }

    // Executes a move if it's valid
    makeMove(curr: string, target: string) {
        const currPiece = this.board[curr];
        if (!currPiece) return; // Exit if there's no piece to move

        const validMove = MovesHelper.getLegalMoves(
            this.turn,
            currPiece,
            curr,
            this.board,
            this.lastMove()
        ).find((move) => move.target === target);
        if (validMove) {
            this.boards.push({ ...this.board }); // Save the current board state
            this.board[target] = currPiece; // Move the piece to the target square
            this.board[curr] = null; // Clear the original square

            if (validMove.type === MoveType.EnPassant) {
                const lastMove = this.lastMove();
                if (lastMove) this.board[lastMove.target] = null; // Handle En Passant capture
            }

            this.turn =
                this.turn === ChessColor.Light
                    ? ChessColor.Dark
                    : ChessColor.Light; // Switch turn to the other player
            this.moves.push(validMove); // Record the move
        }
    }

    // Returns the last move that was made
    lastMove(): IMove | undefined {
        return this.moves[this.moves.length - 1];
    }
}

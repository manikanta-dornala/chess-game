import { ChessColor, MoveType, PieceName } from './enums';
import { InitialPiecePositions } from './initial-piece-positions';
import { MovesHelper } from './moves-helper';
import { IMove, IPiece } from './interfaces';
import { Board } from './Board';
import { PositionHelper } from './position-helper';
import { getMovePGN } from './notations/pgn';

export class GameState {
    board: Board; // Represents the current state of the chessboard
    turn: ChessColor = ChessColor.Light; // Tracks whose turn it is, starts with Light
    moves: Array<IMove> = []; // Tracks all moves made in the game
    boards: Array<Board> = []; // History of board states for undo functionality
    blockMoves = false; // Tracks if game is currently halted for Pawn Promotion
    halfmoveClock: number = 0; // Counts halfmoves since last capture or pawn move
    fullmoveNumber: number = 1; // Counts full moves
    capturedPieces: { [key in ChessColor]: PieceName[] } = {
        [ChessColor.Light]: [],
        [ChessColor.Dark]: [],
    };
    currentValidMoves: { [position: string]: IMove[] } = {};
    constructor() {
        this.board = new Board(InitialPiecePositions); // Initialize the board with the default piece positions

        this.computeAllValidMoves();
        console.log(PositionHelper.validSquares);
    }

    // Reverts the game state to the previous turn
    takeBack() {
        if (this.boards.length) {
            const lastMove = this.moves.pop(); // Remove the last move from history
            this.board = this.boards.pop() ?? this.board; // Revert to the previous board state
            this.turn =
                this.turn === ChessColor.Light
                    ? ChessColor.Dark
                    : ChessColor.Light; // Switch turn back to the previous player
            this.blockMoves = false;

            // Update halfmove clock and fullmove number
            this.halfmoveClock = Math.max(0, this.halfmoveClock - 1);
            if (this.turn === ChessColor.Dark) {
                this.fullmoveNumber = Math.max(1, this.fullmoveNumber - 1);
            }
            if (
                (lastMove &&
                    (lastMove.type === MoveType.Capture ||
                        lastMove.type === MoveType.EnPassant)) ||
                (lastMove && this.board.get(lastMove.target))
            ) {
                this.capturedPieces[this.turn].pop();
            }
            this.computeAllValidMoves();
        }
    }

    computeAllValidMoves() {
        this.currentValidMoves = {};
        PositionHelper.validSquares.forEach((position) => {
            const piece = this.board.get(position);
            if (piece) {
                this.currentValidMoves[position] = MovesHelper.getLegalMoves(
                    this.turn,
                    piece,
                    position,
                    this.board
                );
            }
        });
    }

    // Executes a move if it's valid
    makeMove(curr: string, target: string): IMove | undefined {
        const currPiece = this.board.get(curr);
        if (!currPiece || this.blockMoves) return; // Exit if there's no piece to move

        const validMove = this.currentValidMoves[curr].find(
            (move) => move.target === target
        );
        if (validMove) {
            const newBoard = this.board.newCopy(); // Make a copy of the board
            this.boards.push(this.board); // Save the current board state
            const pieceAtTarget = this.board.get(validMove.target);
            newBoard.set(target, currPiece); // Move the piece to the target square
            newBoard.set(curr, null); // Clear the original square

            if (pieceAtTarget) {
                this.capturedPieces[this.turn].push(pieceAtTarget.name);
            }

            newBoard.enPassantPossible = validMove.type === MoveType.DoubleMove;
            if (newBoard.enPassantPossible) {
                newBoard.enPassantCapturePosition = validMove.target;
                const file = validMove.target[0];
                const rank =
                    validMove.piece.color === ChessColor.Light ? '3' : '6';
                newBoard.enPassantTarget = `${file}${rank}`;
            } else {
                newBoard.enPassantCapturePosition = null;
                newBoard.enPassantTarget = null;
            }

            if (validMove.type === MoveType.EnPassant) {
                const lastMove = this.lastMove();
                if (lastMove) {
                    newBoard.set(lastMove.target, null);
                    this.capturedPieces[this.turn].push(PieceName.Pawn);
                } // Handle En Passant capture
            }

            if (validMove.type === MoveType.Castling) {
                const rook = {
                    name: PieceName.Rook,
                    color: validMove.piece.color,
                };
                if (validMove.target === 'g8') {
                    newBoard['f8'] = rook;
                    newBoard['h8'] = null;
                }
                if (validMove.target === 'g1') {
                    newBoard['f1'] = rook;
                    newBoard['h1'] = null;
                }
                if (validMove.target === 'c8') {
                    newBoard['d8'] = rook;
                    newBoard['a8'] = null;
                }
                if (validMove.target === 'c1') {
                    newBoard['d1'] = rook;
                    newBoard['a1'] = null;
                }
            }

            if (
                validMove.piece.name === PieceName.King &&
                validMove.type === MoveType.Move
            ) {
                if (validMove.piece.color === ChessColor.Light)
                    newBoard.lightCastlingRight = false;
                if (validMove.piece.color === ChessColor.Dark)
                    newBoard.darkCastlingRight = false;
            }

            if (validMove.piece.name === PieceName.Pawn) {
                const lastRank =
                    validMove.piece.color === ChessColor.Light ? '8' : '1'; //
                if (validMove.target[1] === lastRank) {
                    validMove.type = MoveType.Promote;
                    this.blockMoves = true;
                }
            }

            // Switch turn to the other player
            if (validMove.type !== MoveType.Promote) {
                this.turn =
                    this.turn === ChessColor.Light
                        ? ChessColor.Dark
                        : ChessColor.Light;
            }
            validMove.pgn = getMovePGN(
                validMove,
                this.currentValidMoves,
                this.board
            );
            validMove.fullMoveNumber = this.fullmoveNumber;
            this.moves.push(validMove); // Record the move

            // Update halfmove clock
            if (
                currPiece.name === PieceName.Pawn ||
                validMove.type === MoveType.Capture
            ) {
                this.halfmoveClock = 0;
            } else {
                this.halfmoveClock++;
            }

            // Update fullmove number
            if (this.turn === ChessColor.Dark) {
                this.fullmoveNumber++;
            }
            this.board = newBoard;
        }
        this.computeAllValidMoves();
        return validMove;
    }

    handlePawnPromotion(position: string, piece: IPiece) {
        this.board.set(position, piece);
        this.blockMoves = false;
        this.turn =
            this.turn === ChessColor.Light ? ChessColor.Dark : ChessColor.Light; // Switch turn to the other player
        this.computeAllValidMoves();
    }

    // Returns the last move that was made
    lastMove(): IMove | null {
        return this.moves[this.moves.length - 1] ?? null;
    }
}

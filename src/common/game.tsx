import { ChessPositionHelper } from './chess-position-helper';
import { ChessColor, ChessDirection, MoveType, PieceName } from './enums';
import { InitialPiecePositions } from './initial-piece-positions';
import { IPiece } from './piece';
import { PieceMoveSets } from './piece-move-sets';

export interface IMove {
    target: string;
    type: MoveType;
    piece: IPiece;
    position: string;
}

export interface IBoard {
    [position: string]: IPiece | null;
}

export class GameState {
    board: IBoard; // Represents the current state of the chessboard
    turn: ChessColor = ChessColor.Light; // Tracks whose turn it is, starts with Light
    direction: { [key in ChessColor]: ChessDirection }; // Maps each color to the direction their pieces move
    moves: Array<IMove> = []; // Tracks all moves made in the game
    boards: Array<IBoard> = []; // History of board states for undo functionality

    constructor() {
        this.board = { ...InitialPiecePositions }; // Initialize the board with the default piece positions
        this.direction = {
            [ChessColor.Light]: ChessDirection.Up,
            [ChessColor.Dark]: ChessDirection.Down,
        };
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

        const validMove = getLegalMoves(
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

export function isCheckMate(
    turn: ChessColor,
    board: IBoard,
    lastMove: IMove | undefined
): boolean {
    let kingPosition: string | undefined = undefined;
    ChessPositionHelper.validSquares.forEach((position) => {
        const piece = board[position];
        if (piece?.name === PieceName.King && piece.color === turn)
            kingPosition = position;
    });

    if (!kingPosition) return false;

    let legalMoves: IMove[] = [];
    ChessPositionHelper.validSquares.forEach((position) => {
        const piece = board[position];
        if (piece?.color === turn) {
            legalMoves = legalMoves.concat(
                getLegalMoves(turn, piece, position, board, lastMove)
            );
        }
    });
    return legalMoves.length === 0;
}

export function getLegalMoves(
    turn: ChessColor,
    piece: IPiece,
    position: string,
    board: IBoard,
    lastMove: IMove | undefined
): IMove[] {
    const moves = getPossibleMoves(turn, piece, position, board, lastMove);

    return moves.filter((move) => {
        const newboard = { ...board };
        newboard[move.target] = move.piece;
        newboard[position] = null;
        if (move.type === MoveType.EnPassant) {
            if (lastMove) newboard[lastMove.target] = null; // Handle En Passant capture
        }
        if (isKingInCheck(turn, newboard)) return false;
        return true;
    });
}

// Returns all valid moves for a piece at a given position
export function getPossibleMoves(
    turn: ChessColor,
    piece: IPiece,
    position: string,
    board: IBoard,
    lastMove: IMove | undefined
): IMove[] {
    if (turn !== piece.color) return []; // Exit if it's not this piece's turn

    const possibleMoves =
        piece.name === PieceName.Pawn
            ? getPawnMoves(piece, position, board, lastMove)
            : getPieceMoves(piece, position, board);

    return possibleMoves;
}

// Handles pawn-specific moves including En Passant
export function getPawnMoves(
    piece: IPiece,
    position: string,
    board: IBoard,
    lastMove: IMove | undefined
): IMove[] {
    const [file, rank] = [position[0], parseInt(position[1])];
    const moves: IMove[] = [];
    const moveDir = piece.color === ChessColor.Light ? 1 : -1; // Determine the direction of movement
    const baseRank = piece.color === ChessColor.Light ? 2 : 7; // The initial rank of the pawn
    const enPassantRank = piece.color === ChessColor.Light ? 5 : 4; // The rank where En Passant can occur

    // Helper function to add a move
    const addMove = (target: string, type: MoveType) =>
        moves.push({ piece, type, target, position });

    const forwardOne = `${file}${rank + moveDir}`;
    const forwardTwo = `${file}${rank + 2 * moveDir}`;
    const captureTargets = [
        `${String.fromCharCode(file.charCodeAt(0) - 1)}${rank + moveDir}`,
        `${String.fromCharCode(file.charCodeAt(0) + 1)}${rank + moveDir}`,
    ];

    // Handle normal forward movement
    if (
        ChessPositionHelper.validSquares.has(forwardOne) &&
        !board[forwardOne]
    ) {
        addMove(forwardOne, MoveType.Move);
        // Handle two-step move from base rank
        if (
            rank === baseRank &&
            ChessPositionHelper.validSquares.has(forwardTwo) &&
            !board[forwardTwo]
        ) {
            addMove(forwardTwo, MoveType.DoubleMove);
        }
    }

    // Handle captures and En Passant
    captureTargets.forEach((target) => {
        if (ChessPositionHelper.validSquares.has(target)) {
            const targetPiece = board[target];
            if (targetPiece && targetPiece.color !== piece.color) {
                addMove(target, MoveType.Capture); // Capture an enemy piece
            } else if (rank === enPassantRank && !targetPiece) {
                const enPassantPawnPos = `${target[0]}${rank}`;
                if (
                    lastMove?.type === MoveType.DoubleMove &&
                    lastMove.target === enPassantPawnPos
                ) {
                    addMove(target, MoveType.EnPassant); // Handle En Passant
                }
            }
        }
    });

    return moves;
}

// Handles all non-pawn moves (Rook, Bishop, Queen, King, Knight)
export function getPieceMoves(
    piece: IPiece,
    position: string,
    board: IBoard
): IMove[] {
    const [file, rank] = [position[0], parseInt(position[1])];
    const moves: IMove[] = [];

    const moveLimit =
        piece.name === PieceName.King || piece.name === PieceName.Knight
            ? 1
            : 8;
    const moveSet = PieceMoveSets[piece.name];

    // Generate moves based on the piece's move pattern
    for (const { file: df, rank: dr } of moveSet) {
        for (let i = 1; i <= moveLimit; i++) {
            const targetFile = String.fromCharCode(file.charCodeAt(0) + df * i);
            const targetRank = rank + dr * i;
            const targetPos = `${targetFile}${targetRank}`;

            if (!ChessPositionHelper.validSquares.has(targetPos)) break; // Stop if the target is not valid

            const targetPiece = board[targetPos];
            if (targetPiece) {
                if (targetPiece.color !== piece.color) {
                    moves.push({
                        piece,
                        type: MoveType.Capture,
                        target: targetPos,
                        position,
                    }); // Capture an enemy piece
                }
                break; // Stop if there's a piece in the way
            } else {
                moves.push({
                    piece,
                    type: MoveType.Move,
                    target: targetPos,
                    position,
                }); // Regular move to an empty square
            }
        }
    }

    return moves;
}

// Determines if the king of the specified color is in check
export function isKingInCheck(color: ChessColor, board: IBoard): boolean {
    const kingPosition = Object.keys(board).find((position) => {
        const piece = board[position];
        return piece?.name === PieceName.King && piece.color === color;
    });

    if (!kingPosition) return false;

    // Check if any opposing piece can attack the king's position
    const opponentColor =
        color === ChessColor.Light ? ChessColor.Dark : ChessColor.Light;
    for (const position of Object.keys(board)) {
        const piece = board[position];
        if (piece?.color === opponentColor) {
            const possibleMoves =
                piece.name === PieceName.Pawn
                    ? getPawnMoves(piece, position, board, undefined)
                    : getPieceMoves(piece, position, board);
            if (possibleMoves.map((e) => e.target).includes(kingPosition)) {
                return true;
            }
        }
    }
    return false;
}

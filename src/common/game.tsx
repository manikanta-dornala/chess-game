import { ChessPositionHelper } from './chess-position-helper';
import { ChessColor, ChessDirection, MoveType, PieceName } from './enums';
import { InitialPiecePositions } from './initial-piece-positions';
import { IPiece } from './piece';

export interface IMove {
    target: string;
    type: MoveType;
    piece: IPiece;
    position: string;
}

export class GameState {
    board: { [position: string]: IPiece | null }; // Represents the current state of the chessboard
    turn: ChessColor = ChessColor.Light; // Tracks whose turn it is, starts with Light
    direction: { [key in ChessColor]: ChessDirection }; // Maps each color to the direction their pieces move
    validSquares: Set<string>; // Set of all valid positions on the board
    moves: Array<IMove> = []; // Tracks all moves made in the game
    boards: Array<{ [position: string]: IPiece | null }> = []; // History of board states for undo functionality

    constructor() {
        this.board = { ...InitialPiecePositions }; // Initialize the board with the default piece positions
        this.direction = {
            [ChessColor.Light]: ChessDirection.Up,
            [ChessColor.Dark]: ChessDirection.Down,
        };

        this.validSquares = new Set(
            ChessPositionHelper.ranks.flatMap((rank) =>
                ChessPositionHelper.files.map((file) => {
                    const position = `${file}${rank}`;
                    this.board[position] = this.board[position] ?? null; // Ensure empty squares are represented as null
                    return position;
                })
            )
        );
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

        const validMove = this.getPossibleMoves(currPiece, curr).find(
            (move) => move.target === target
        );
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

    // Returns all possible target squares for a given piece
    getPossibleTargets(piece: IPiece, position: string): string[] {
        return this.getPossibleMoves(piece, position).map(
            (move) => move.target
        );
    }

    // Returns all valid moves for a piece at a given position
    getPossibleMoves(piece: IPiece, position: string): IMove[] {
        if (this.turn !== piece.color) return []; // Exit if it's not this piece's turn

        switch (piece.name) {
            case PieceName.Pawn:
                return this.getPawnMoves(piece, position);
            case PieceName.Rook:
            case PieceName.Bishop:
            case PieceName.Queen:
            case PieceName.King:
            case PieceName.Knight:
                return this.getPieceMoves(piece, position);
            default:
                return [];
        }
    }

    // Handles pawn-specific moves including En Passant
    private getPawnMoves(piece: IPiece, position: string): IMove[] {
        const [file, rank] = [position[0], parseInt(position[1])];
        const moves: IMove[] = [];
        const moveDir =
            this.direction[piece.color] === ChessDirection.Up ? 1 : -1; // Determine the direction of movement
        const baseRank =
            this.direction[piece.color] === ChessDirection.Up ? 2 : 7; // The initial rank of the pawn
        const enPassantRank =
            this.direction[piece.color] === ChessDirection.Up ? 5 : 4; // The rank where En Passant can occur

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
        if (this.validSquares.has(forwardOne) && !this.board[forwardOne]) {
            addMove(forwardOne, MoveType.Move);
            // Handle two-step move from base rank
            if (
                rank === baseRank &&
                this.validSquares.has(forwardTwo) &&
                !this.board[forwardTwo]
            ) {
                addMove(forwardTwo, MoveType.PawnMove2);
            }
        }

        // Handle captures and En Passant
        captureTargets.forEach((target) => {
            if (this.validSquares.has(target)) {
                const targetPiece = this.board[target];
                if (targetPiece && targetPiece.color !== piece.color) {
                    addMove(target, MoveType.Capture); // Capture an enemy piece
                } else if (rank === enPassantRank && !targetPiece) {
                    const enPassantPawnPos = `${target[0]}${rank}`;
                    const lastMove = this.lastMove();
                    if (
                        lastMove?.type === MoveType.PawnMove2 &&
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
    private getPieceMoves(piece: IPiece, position: string): IMove[] {
        const [file, rank] = [position[0], parseInt(position[1])];
        const moves: IMove[] = [];
        interface IMoveSet {
            file: number;
            rank: number;
        }

        // Define the move patterns for each piece type
        const moveSets: Record<PieceName, IMoveSet[]> = {
            [PieceName.Rook]: [
                { file: 0, rank: 1 },
                { file: 0, rank: -1 },
                { file: 1, rank: 0 },
                { file: -1, rank: 0 },
            ],
            [PieceName.Bishop]: [
                { file: 1, rank: 1 },
                { file: 1, rank: -1 },
                { file: -1, rank: 1 },
                { file: -1, rank: -1 },
            ],
            [PieceName.Queen]: [
                { file: 0, rank: 1 },
                { file: 0, rank: -1 },
                { file: 1, rank: 0 },
                { file: -1, rank: 0 },
                { file: 1, rank: 1 },
                { file: 1, rank: -1 },
                { file: -1, rank: 1 },
                { file: -1, rank: -1 },
            ],
            [PieceName.King]: [
                { file: 0, rank: 1 },
                { file: 0, rank: -1 },
                { file: 1, rank: 0 },
                { file: -1, rank: 0 },
                { file: 1, rank: 1 },
                { file: 1, rank: -1 },
                { file: -1, rank: 1 },
                { file: -1, rank: -1 },
            ],
            [PieceName.Knight]: [
                { file: 2, rank: 1 },
                { file: 2, rank: -1 },
                { file: -2, rank: 1 },
                { file: -2, rank: -1 },
                { file: 1, rank: 2 },
                { file: 1, rank: -2 },
                { file: -1, rank: 2 },
                { file: -1, rank: -2 },
            ],
            [PieceName.Pawn]: [], // Empty because pawns are handled separately
        };

        const moveLimit =
            piece.name === PieceName.King || piece.name === PieceName.Knight
                ? 1
                : 8;
        const moveSet = moveSets[piece.name];

        // Generate moves based on the piece's move pattern
        for (const { file: df, rank: dr } of moveSet) {
            for (let i = 1; i <= moveLimit; i++) {
                const targetFile = String.fromCharCode(
                    file.charCodeAt(0) + df * i
                );
                const targetRank = rank + dr * i;
                const targetPos = `${targetFile}${targetRank}`;

                if (!this.validSquares.has(targetPos)) break; // Stop if the target is not valid

                const targetPiece = this.board[targetPos];
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

    // Returns the last move that was made
    lastMove(): IMove | undefined {
        return this.moves[this.moves.length - 1];
    }
}

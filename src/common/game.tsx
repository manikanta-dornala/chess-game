import { BoardCoordinateSystem, initial_piece_positions } from './constants';
import { ChessColor, ChessDirection, MoveType, PieceName } from './enums';
import { IPiece } from './piece';

export interface IMove {
    target: string;
    type: MoveType;
    piece: IPiece;
    position: string;
}

export class GameState {
    board: { [position: string]: IPiece | null };
    turn: ChessColor = ChessColor.Light;
    direction = {
        [ChessColor.Light]: ChessDirection.Up,
        [ChessColor.Dark]: ChessDirection.Down,
    };
    validSquares: Set<string> = new Set();
    moves: Array<IMove> = [];
    constructor() {
        let initialPositions = initial_piece_positions;
        this.board = {};
        for (let j = 0; j < BoardCoordinateSystem.ranks.length; j++) {
            for (let i = 0; i < BoardCoordinateSystem.files.length; i++) {
                let position =
                    BoardCoordinateSystem.files[i] +
                    BoardCoordinateSystem.ranks[j];
                this.board[position] = initialPositions[position]
                    ? initialPositions[position]
                    : null;
                this.validSquares.add(position);
            }
        }
    }

    makeMove(curr: string, target: string) {
        const currPiece = this.board[curr];
        if (!currPiece) return; // no piece to move

        // check if there's any move that can land curr piece in target
        const moves = this.getPossibleMoves(currPiece, curr).filter(
            (move) => move.target === target
        );

        if (moves.length) {
            const move = moves[0];
            this.board[target] = currPiece;
            this.board[curr] = null;

            if (move.type === MoveType.EnPassant) {
                const lastMove = this.lastMove();
                if (lastMove) this.board[lastMove.target] = null;
            }

            this.turn =
                this.turn === ChessColor.Light
                    ? ChessColor.Dark
                    : ChessColor.Light;
            this.moves.push(move);
        }
    }

    getPossibleTargets(piece: IPiece, position: string): Array<string> {
        return this.getPossibleMoves(piece, position).map((m) => m.target);
    }

    getPossibleMoves(piece: IPiece, position: string): Array<IMove> {
        if (this.turn !== piece.color) return [];
        if (piece.name === PieceName.Pawn) {
            return this.getPawnMoves(piece, position);
        }
        if (
            [
                PieceName.Rook,
                PieceName.Bishop,
                PieceName.Queen,
                PieceName.King,
                PieceName.Knight,
            ].includes(piece.name)
        ) {
            return this.getPieceMoves(piece, position);
        }
        return [];
    }

    getPawnMoves(piece: IPiece, position: string): Array<IMove> {
        const file = position[0];
        const rank = parseInt(position[1]);
        const moves: IMove[] = [];

        const moveDirection =
            this.direction[this.turn] === ChessDirection.Up ? 1 : -1;
        const baseRank =
            this.direction[this.turn] === ChessDirection.Up ? 2 : 7;
        const enPassantRank =
            this.direction[this.turn] === ChessDirection.Up ? 5 : 4;

        const forwardOne = `${file}${rank + moveDirection}`;
        const forwardTwo = `${file}${rank + 2 * moveDirection}`;
        const captureLeft = `${String.fromCharCode(file.charCodeAt(0) - 1)}${rank + moveDirection}`;
        const captureRight = `${String.fromCharCode(file.charCodeAt(0) + 1)}${rank + moveDirection}`;

        // One step forward
        if (this.validSquares.has(forwardOne) && !this.board[forwardOne]) {
            moves.push({
                piece,
                type: MoveType.Move,
                target: forwardOne,
                position,
            });

            // Two steps forward from the base rank
            if (
                rank === baseRank &&
                this.validSquares.has(forwardTwo) &&
                !this.board[forwardTwo]
            ) {
                moves.push({
                    piece,
                    type: MoveType.PawnMove2,
                    target: forwardTwo,
                    position,
                });
            }
        }

        // Captures (only if an enemy piece is present)
        [captureLeft, captureRight].forEach((target) => {
            if (this.validSquares.has(target)) {
                const targetPiece = this.board[target];
                if (targetPiece && targetPiece.color !== this.turn) {
                    moves.push({
                        piece,
                        type: MoveType.Capture,
                        target,
                        position,
                    });
                }
            }
        });

        // En passant
        if (rank === enPassantRank) {
            [captureLeft, captureRight].forEach((target) => {
                const enPassantPawnPos = `${target[0]}${rank}`;
                const lastMove = this.lastMove();
                if (
                    this.validSquares.has(target) &&
                    !this.board[target] &&
                    lastMove?.type === MoveType.PawnMove2 &&
                    lastMove.target === enPassantPawnPos
                ) {
                    moves.push({
                        piece,
                        type: MoveType.EnPassant,
                        target,
                        position,
                    });
                }
            });
        }

        return moves;
    }

    getPieceMoves(piece: IPiece, position: string) {
        const file = position[0];
        const rank = parseInt(position[1]);
        const moves: IMove[] = [];

        const rook_move_set = [
            { file: 0, rank: 1 }, // up
            { file: 0, rank: -1 }, // down
            { file: -1, rank: 0 }, // left
            { file: 1, rank: 0 }, // right
        ];

        const bishop_move_set = [
            { file: 1, rank: 1 }, // up-right
            { file: 1, rank: -1 }, // down-right
            { file: -1, rank: 1 }, // up-left
            { file: -1, rank: -1 }, // down-left
        ];

        const queen_king_move_set = [...rook_move_set, ...bishop_move_set];

        const knight_move_set = [
            { file: 2, rank: 1 },
            { file: 2, rank: -1 },
            { file: -2, rank: 1 },
            { file: -2, rank: -1 },
            { file: 1, rank: 2 },
            { file: 1, rank: -2 },
            { file: -1, rank: 2 },
            { file: -1, rank: -2 },
        ];

        let move_set: Array<{
            file: number;
            rank: number;
        }> = [];
        let move_count = 1;
        if (piece.name === PieceName.Bishop) {
            move_set = bishop_move_set;
            move_count = 8;
        }
        if (piece.name === PieceName.Rook) {
            move_set = rook_move_set;
            move_count = 8;
        }
        if (piece.name === PieceName.Queen) {
            move_set = queen_king_move_set;
            move_count = 8;
        }
        if (piece.name === PieceName.King) {
            move_set = queen_king_move_set;
            move_count = 2;
        }
        if (piece.name === PieceName.Knight) {
            move_set = knight_move_set;
            move_count = 2;
        }

        for (const { file: df, rank: dr } of move_set) {
            for (let i = 1; i < move_count; i++) {
                const targetFile = String.fromCharCode(
                    file.charCodeAt(0) + df * i
                );
                const targetRank = rank + dr * i;
                const targetPos = `${targetFile}${targetRank}`;

                // Check if the target position is a valid square
                if (!this.validSquares.has(targetPos)) break;

                const targetPiece = this.board[targetPos];
                if (targetPiece) {
                    // Stop if a piece is encountered
                    if (targetPiece.color !== piece.color) {
                        // Capture the enemy piece
                        moves.push({
                            piece: piece,
                            type: MoveType.Capture,
                            target: targetPos,
                            position: position,
                        });
                    }
                    break; // Stop further movement in this direction
                } else {
                    // If the square is empty, add the move
                    moves.push({
                        piece: piece,
                        type: MoveType.Move,
                        target: targetPos,
                        position: position,
                    });
                }
            }
        }

        return moves;
    }

    lastMove() {
        if (this.moves.length) {
            return this.moves[this.moves.length - 1];
        }
    }
}

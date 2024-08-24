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
        if (piece.name === PieceName.Rook) {
            return this.getRookMoves(piece, position);
        }
        return [];
    }

    getPawnMoves(piece: IPiece, position: string): Array<IMove> {
        const file = position[0];
        const rank = position[1];
        const moves: Set<IMove> = new Set();
        const baseRank =
            this.direction[this.turn] === ChessDirection.Up ? '2' : '7';
        const moveAdd =
            this.direction[this.turn] === ChessDirection.Up ? 1 : -1;
        const enpassantRank =
            this.direction[this.turn] === ChessDirection.Up ? '5' : '4';

        // pawn can move one step forward
        moves.add({
            target: file + (parseInt(rank) + moveAdd),
            type: MoveType.Move,
            piece: piece,
            position: position,
        });

        // if at base, pawn can move two steps forward
        if (rank === baseRank) {
            moves.add({
                target: file + (parseInt(rank) + moveAdd + moveAdd),
                type: MoveType.PawnMove2,
                piece: piece,
                position: position,
            });
        }

        // capture positions
        moves.add({
            target:
                String.fromCharCode(file.charCodeAt(0) - 1) +
                (parseInt(rank) + moveAdd), // left diagnol,
            type: MoveType.Capture,
            piece: piece,
            position: position,
        });

        moves.add({
            target:
                String.fromCharCode(file.charCodeAt(0) + 1) +
                (parseInt(rank) + moveAdd), // right diagnol
            type: MoveType.Capture,
            piece: piece,
            position: position,
        });

        // en passant positions
        if (rank === enpassantRank) {
            moves.add({
                target:
                    String.fromCharCode(file.charCodeAt(0) - 1) +
                    (parseInt(rank) + moveAdd), // left,
                type: MoveType.EnPassant,
                piece: piece,
                position: position,
            });

            moves.add({
                target:
                    String.fromCharCode(file.charCodeAt(0) + 1) +
                    (parseInt(rank) + moveAdd), // right
                type: MoveType.EnPassant,
                piece: piece,
                position: position,
            });
        }

        const validMoves = Array.from(moves).filter((move) => {
            // target has to be a chess square
            if (!this.validSquares.has(move.target)) return false;

            let pieceAtTarget = this.board[move.target];
            // Check if there are no pieces at final pos when moving
            if (
                (move.type === MoveType.Move ||
                    move.type === MoveType.PawnMove2) &&
                !pieceAtTarget
            ) {
                return true;
            }

            //Check if its enemy when capturing
            if (move.type === MoveType.Capture) {
                if (!pieceAtTarget) return false;
                if (pieceAtTarget.color !== this.turn) return true;
            }

            //Check if enpassant is valid
            if (move.type === MoveType.EnPassant) {
                if (pieceAtTarget) return false;

                const enpassant_pawn_pos =
                    move.target[0] + (parseInt(move.target[1]) - moveAdd);

                const lastMove = this.lastMove();
                if (
                    lastMove &&
                    lastMove.type === MoveType.PawnMove2 &&
                    lastMove.target === enpassant_pawn_pos
                )
                    return true;
            }

            return false;
        });

        return validMoves;
    }

    getRookMoves(piece: IPiece, position: string): Array<IMove> {
        const file = position[0];
        const rank = parseInt(position[1]);
        const moves: IMove[] = [];

        const directions = [
            { file: 0, rank: 1 }, // up
            { file: 0, rank: -1 }, // down
            { file: -1, rank: 0 }, // left
            { file: 1, rank: 0 }, // right
        ];

        for (const { file: df, rank: dr } of directions) {
            for (let i = 1; i < 8; i++) {
                const newFile = String.fromCharCode(
                    file.charCodeAt(0) + df * i
                );
                const newRank = rank + dr * i;
                const targetPos = `${newFile}${newRank}`;

                if (!this.validSquares.has(targetPos)) break;

                const pieceAtTarget = this.board[targetPos];
                if (pieceAtTarget) {
                    if (pieceAtTarget.color === piece.color) {
                        // Friendly piece; stop movement in this direction
                        break;
                    } else {
                        // Enemy piece; capture and stop movement
                        moves.push({
                            piece: piece,
                            type: MoveType.Capture,
                            target: targetPos,
                            position: position,
                        });
                        break;
                    }
                }

                // If no piece at the target position, add move
                moves.push({
                    piece: piece,
                    type: MoveType.Move,
                    target: targetPos,
                    position: position,
                });
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

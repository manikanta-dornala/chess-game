import { ChessColor, ChessDirection, MoveType, PieceName } from './enums';
import { IPiece } from './piece';

export abstract class BoardCoordinateSystem {
    public static files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    public static ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    public static getCoordToPosition({
        rankIndex,
        fileIndex,
        bottomColor,
    }: {
        rankIndex: number;
        fileIndex: number;
        bottomColor: ChessColor;
    }) {
        if (bottomColor === ChessColor.Light)
            return this.files[fileIndex] + this.ranks[rankIndex];
        else {
            const pos = this.files[7 - fileIndex] + this.ranks[7 - rankIndex];
            return pos;
        }
    }
}

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
        let initialPositions = this.getInitialPositions();
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

    getInitialPositions() {
        const initial_piece_positions: {
            [position: string]: IPiece;
        } = {
            a1: { name: PieceName.Rook, color: ChessColor.Light },
            b1: { name: PieceName.Knight, color: ChessColor.Light },
            c1: { name: PieceName.Bishop, color: ChessColor.Light },
            d1: {
                name: PieceName.Queen,
                color: ChessColor.Light,
            },
            e1: {
                name: PieceName.King,
                color: ChessColor.Light,
            },
            f1: { name: PieceName.Bishop, color: ChessColor.Light },
            g1: { name: PieceName.Knight, color: ChessColor.Light },
            h1: { name: PieceName.Rook, color: ChessColor.Light },
            a2: { name: PieceName.Pawn, color: ChessColor.Light },
            b2: { name: PieceName.Pawn, color: ChessColor.Light },
            c2: { name: PieceName.Pawn, color: ChessColor.Light },
            d2: { name: PieceName.Pawn, color: ChessColor.Light },
            e2: { name: PieceName.Pawn, color: ChessColor.Light },
            f2: { name: PieceName.Pawn, color: ChessColor.Light },
            g2: { name: PieceName.Pawn, color: ChessColor.Light },
            h2: { name: PieceName.Pawn, color: ChessColor.Light },
            a7: { name: PieceName.Pawn, color: ChessColor.Dark },
            b7: { name: PieceName.Pawn, color: ChessColor.Dark },
            c7: { name: PieceName.Pawn, color: ChessColor.Dark },
            d7: { name: PieceName.Pawn, color: ChessColor.Dark },
            e7: { name: PieceName.Pawn, color: ChessColor.Dark },
            f7: { name: PieceName.Pawn, color: ChessColor.Dark },
            g7: { name: PieceName.Pawn, color: ChessColor.Dark },
            h7: { name: PieceName.Pawn, color: ChessColor.Dark },
            a8: { name: PieceName.Rook, color: ChessColor.Dark },
            b8: { name: PieceName.Knight, color: ChessColor.Dark },
            c8: { name: PieceName.Bishop, color: ChessColor.Dark },
            d8: {
                name: PieceName.Queen,
                color: ChessColor.Dark,
            },
            e8: {
                name: PieceName.King,
                color: ChessColor.Dark,
            },
            f8: { name: PieceName.Bishop, color: ChessColor.Dark },
            g8: { name: PieceName.Knight, color: ChessColor.Dark },
            h8: { name: PieceName.Rook, color: ChessColor.Dark },
        };
        return initial_piece_positions;
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
                type: MoveType.Move,
                piece: piece,
                position: position,
            });
        }

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

        const validMoves = Array.from(moves).filter((move) => {
            // target has to be a chess square
            if (!this.validSquares.has(move.target)) return false;

            const pieceAtTarget = this.board[move.target];
            // Check if there are no pieces at final pos when moving
            if (move.type === MoveType.Move && !pieceAtTarget) {
                return true;
            }

            //Check if its enemy when capturing
            if (move.type === MoveType.Capture) {
                if (!pieceAtTarget) return false;
                if (pieceAtTarget.color !== this.turn) return true;
            }

            return false;
        });

        return validMoves;
    }
}

import { ChessColor, ChessDirection, MoveType, PieceName } from './enums';
import { IPiece } from './piece';

export const chessFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const chessRanks = ['1', '2', '3', '4', '5', '6', '7', '8'].reverse();

export function getCoordToPosition({
    rankIndex,
    fileIndex,
}: {
    rankIndex: number;
    fileIndex: number;
}) {
    return chessFiles[fileIndex] + chessRanks[rankIndex];
}

interface IMove {
    target: string;
    type: MoveType;
}

export class GameState {
    squares: { [position: string]: IPiece | null };
    bottomColor: ChessColor;
    turn: ChessColor = ChessColor.Light;
    direction = {
        [ChessColor.Light]: ChessDirection.Up,
        [ChessColor.Dark]: ChessDirection.Down,
    };
    validSquares: Set<string> = new Set();
    constructor(bottomColor: ChessColor) {
        this.bottomColor = bottomColor;
        let initialPositions = this.getInitialPositions(bottomColor);
        this.squares = {};
        for (let j = 0; j < chessRanks.length; j++) {
            for (let i = 0; i < chessFiles.length; i++) {
                let position = chessFiles[i] + chessRanks[j];
                this.squares[position] = initialPositions[position]
                    ? initialPositions[position]
                    : null;
                this.validSquares.add(position);
            }
        }
        this.direction = {
            [ChessColor.Light]:
                bottomColor === ChessColor.Light
                    ? ChessDirection.Up
                    : ChessDirection.Down,
            [ChessColor.Dark]:
                bottomColor === ChessColor.Light
                    ? ChessDirection.Down
                    : ChessDirection.Up,
        };
    }

    getInitialPositions(bottomColor: ChessColor) {
        let topColor =
            bottomColor === ChessColor.Light
                ? ChessColor.Dark
                : ChessColor.Light;

        const initial_piece_positions: {
            [position: string]: IPiece;
        } = {
            a1: { name: PieceName.Rook, color: bottomColor },
            b1: { name: PieceName.Knight, color: bottomColor },
            c1: { name: PieceName.Bishop, color: bottomColor },
            d1: { name: PieceName.Queen, color: bottomColor },
            e1: { name: PieceName.King, color: bottomColor },
            f1: { name: PieceName.Bishop, color: bottomColor },
            g1: { name: PieceName.Knight, color: bottomColor },
            h1: { name: PieceName.Rook, color: bottomColor },
            a2: { name: PieceName.Pawn, color: bottomColor },
            b2: { name: PieceName.Pawn, color: bottomColor },
            c2: { name: PieceName.Pawn, color: bottomColor },
            d2: { name: PieceName.Pawn, color: bottomColor },
            e2: { name: PieceName.Pawn, color: bottomColor },
            f2: { name: PieceName.Pawn, color: bottomColor },
            g2: { name: PieceName.Pawn, color: bottomColor },
            h2: { name: PieceName.Pawn, color: bottomColor },
            a7: { name: PieceName.Pawn, color: topColor },
            b7: { name: PieceName.Pawn, color: topColor },
            c7: { name: PieceName.Pawn, color: topColor },
            d7: { name: PieceName.Pawn, color: topColor },
            e7: { name: PieceName.Pawn, color: topColor },
            f7: { name: PieceName.Pawn, color: topColor },
            g7: { name: PieceName.Pawn, color: topColor },
            h7: { name: PieceName.Pawn, color: topColor },
            a8: { name: PieceName.Rook, color: topColor },
            b8: { name: PieceName.Knight, color: topColor },
            c8: { name: PieceName.Bishop, color: topColor },
            d8: { name: PieceName.Queen, color: topColor },
            e8: { name: PieceName.King, color: topColor },
            f8: { name: PieceName.Bishop, color: topColor },
            g8: { name: PieceName.Knight, color: topColor },
            h8: { name: PieceName.Rook, color: topColor },
        };
        return initial_piece_positions;
    }

    makeMove(initialPosition: string, finalPosition: string) {
        if (!this.isMoveLegal(initialPosition, finalPosition)) return;
        const piece = this.squares[initialPosition];
        this.squares[finalPosition] = piece;
        this.squares[initialPosition] = null;
        this.turn =
            this.turn === ChessColor.Light ? ChessColor.Dark : ChessColor.Light;
    }

    isMoveLegal(initialPosition: string, finalPosition: string): boolean {
        if (initialPosition === finalPosition) return false;

        const currPiece = this.squares[initialPosition];
        if (!currPiece) {
            // there is no piece on this square
            return false;
        }
        if (currPiece.color !== this.turn) {
            // Not your turn
            return false;
        }
        const destPiece = this.squares[finalPosition];
        if (destPiece && destPiece.color === currPiece?.color) {
            // cannot eat pieces of own color
            return false;
        }
        const possibleTargets = this.getPossibleTargets(
            currPiece,
            initialPosition
        );
        if (possibleTargets.includes(finalPosition)) return true;

        return false;
    }

    getPossibleTargets(piece: IPiece, position: string): Array<string> {
        return this.getPossibleMoves(piece, position).map((m) => m.target);
    }

    getPossibleMoves(piece: IPiece, position: string): Array<IMove> {
        if (this.turn !== piece.color) return [];
        if (piece.name === PieceName.Pawn) {
            return this.getPawnMoves(position);
        }
        return [];
    }

    getPawnMoves(position: string): Array<IMove> {
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
        });

        // if at base, pawn can move two steps forward
        if (rank === baseRank) {
            moves.add({
                target: file + (parseInt(rank) + moveAdd + moveAdd),
                type: MoveType.Move,
            });
        }

        const kill_pos = [
            String.fromCharCode(file.charCodeAt(0) - 1) +
                (parseInt(rank) + moveAdd), // left diagnol
            String.fromCharCode(file.charCodeAt(0) + 1) +
                (parseInt(rank) + moveAdd), // right diagnol
        ];

        kill_pos.forEach((pos) => {
            const pieceAtPos = this.squares[pos];
            if (pieceAtPos && pieceAtPos.color !== this.turn) {
                moves.add({
                    target: pos,
                    type: MoveType.Capture,
                });
            }
        });

        return Array.from(moves).filter((move) =>
            this.validSquares.has(move.target)
        );
    }
}

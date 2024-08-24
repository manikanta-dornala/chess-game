import { ChessColor, PieceName } from './enums';
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

export class GameState {
    squares: { [position: string]: IPiece | null };
    coordinateMap: { [name: string]: [number, number] } = {};
    bottomColor: ChessColor;
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
            }
        }
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
    }

    isMoveLegal(initialPosition: string, finalPosition: string): boolean {
        if (initialPosition === finalPosition) return false;

        const currPiece = this.squares[initialPosition];
        if (!currPiece) {
            return false;
        }
        const destPiece = this.squares[finalPosition];
        if (destPiece && destPiece.color === currPiece?.color) {
            // cannot eat pieces of own color
            return false;
        }
        const possibleMoves = this.getPossibleMoves(currPiece, initialPosition);
        if (possibleMoves.includes(finalPosition)) return true;

        return false;
    }

    getPossibleMoves(piece: IPiece, position: string): Array<string> {
        if (piece.name === PieceName.Pawn) {
            return getPawnMoves(position);
        }
        return [];
    }
}

function getPawnMoves(position: string): Array<string> {
    const file = position[0];
    const rank = position[1];
    const moves: Array<string> = [];
    if (rank === '2') {
        moves.push(file + (parseInt(rank) + 1));
        moves.push(file + (parseInt(rank) + 2));
    } else {
        moves.push(file + (parseInt(rank) + 1));
    }
    return moves;
}

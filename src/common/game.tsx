import { ChessColor, PieceName } from './enums';
import { IPiece } from './piece';

export const xAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const yAxis = ['1', '2', '3', '4', '5', '6', '7', '8'].reverse();

export class BoardState {
    coordinateMap: { [name: string]: [number, number] } = {};
    map: Array<Array<{ position: string; piece?: IPiece }>> = [];
    bottomColor: ChessColor;
    constructor(bottomColor: ChessColor) {
        this.bottomColor = bottomColor;
        let initialPositions = this.getInitialPositions(bottomColor);
        for (let j = 0; j < yAxis.length; j++) {
            this.map[j] = [];
            for (let i = 0; i < xAxis.length; i++) {
                let name = xAxis[i] + yAxis[j];
                this.map[j].push({
                    position: name,
                    piece: initialPositions[name],
                });
                this.coordinateMap[name] = [j, i];
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
}

export function cloneBoardState(curr: BoardState) {
    const cloned = new BoardState(curr.bottomColor);
    cloned.coordinateMap = structuredClone(curr.coordinateMap);
    cloned.map = structuredClone(curr.map);
    return cloned;
}

export function getPieceAtPosition(position: string, boardState: BoardState) {
    const pos = boardState.coordinateMap[position];
    const i = pos[0];
    const j = pos[1];
    const piece = boardState.map[i][j].piece;
    if (piece !== null && piece !== undefined) return piece;
    return null;
}

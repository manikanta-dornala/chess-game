import { IPiece } from './interfaces';
import { PositionHelper } from './position-helper';

export class Board {
    a8: IPiece | null = null;
    b8: IPiece | null = null;
    c8: IPiece | null = null;
    d8: IPiece | null = null;
    e8: IPiece | null = null;
    f8: IPiece | null = null;
    g8: IPiece | null = null;
    h8: IPiece | null = null;
    a7: IPiece | null = null;
    b7: IPiece | null = null;
    c7: IPiece | null = null;
    d7: IPiece | null = null;
    e7: IPiece | null = null;
    f7: IPiece | null = null;
    g7: IPiece | null = null;
    h7: IPiece | null = null;
    a6: IPiece | null = null;
    b6: IPiece | null = null;
    c6: IPiece | null = null;
    d6: IPiece | null = null;
    e6: IPiece | null = null;
    f6: IPiece | null = null;
    g6: IPiece | null = null;
    h6: IPiece | null = null;
    a5: IPiece | null = null;
    b5: IPiece | null = null;
    c5: IPiece | null = null;
    d5: IPiece | null = null;
    e5: IPiece | null = null;
    f5: IPiece | null = null;
    g5: IPiece | null = null;
    h5: IPiece | null = null;
    a4: IPiece | null = null;
    b4: IPiece | null = null;
    c4: IPiece | null = null;
    d4: IPiece | null = null;
    e4: IPiece | null = null;
    f4: IPiece | null = null;
    g4: IPiece | null = null;
    h4: IPiece | null = null;
    a3: IPiece | null = null;
    b3: IPiece | null = null;
    c3: IPiece | null = null;
    d3: IPiece | null = null;
    e3: IPiece | null = null;
    f3: IPiece | null = null;
    g3: IPiece | null = null;
    h3: IPiece | null = null;
    a2: IPiece | null = null;
    b2: IPiece | null = null;
    c2: IPiece | null = null;
    d2: IPiece | null = null;
    e2: IPiece | null = null;
    f2: IPiece | null = null;
    g2: IPiece | null = null;
    h2: IPiece | null = null;
    a1: IPiece | null = null;
    b1: IPiece | null = null;
    c1: IPiece | null = null;
    d1: IPiece | null = null;
    e1: IPiece | null = null;
    f1: IPiece | null = null;
    g1: IPiece | null = null;
    h1: IPiece | null = null;

    lightCastlingRight = true;
    darkCastlingRight = true;

    enPassantPossible: boolean = false;
    enPassantCapturePosition: string | null = null;
    enPassantTarget: string | null = null;

    constructor(piecePositions: { [position: string]: IPiece }) {
        for (let position in piecePositions) {
            this.set(position, piecePositions[position]);
        }
    }

    set(position: string, piece: IPiece | null) {
        if (this.hasOwnProperty(position)) {
            (this as any)[position] = piece;
        }
    }

    get(position: string): IPiece | null {
        if (this.hasOwnProperty(position)) {
            return (this as any)[position] as IPiece | null;
        }
        return null; // Return null if the position does not exist
    }

    newCopy(): Board {
        const piecePositions: { [position: string]: IPiece } = {};
        PositionHelper.validSquares.forEach((position) => {
            const piece = (this as any)[position];
            if (piece) piecePositions[position] = piece;
        });
        const board = new Board(piecePositions);
        board.lightCastlingRight = this.lightCastlingRight;
        board.darkCastlingRight = this.darkCastlingRight;
        return board;
    }
}

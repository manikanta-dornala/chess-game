import { PieceName } from './enums';
import { IMoveSet } from './interfaces';

export const PieceMoveSets: Record<PieceName, IMoveSet[]> = {
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
        { file: 2, rank: 0 }, // for castling
        { file: -2, rank: 0 }, // for castling
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

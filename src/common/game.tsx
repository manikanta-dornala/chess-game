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
    boards: Array<{ [position: string]: IPiece | null }> = [];

    constructor() {
        this.board = { ...initial_piece_positions };
        BoardCoordinateSystem.ranks.forEach((rank) =>
            BoardCoordinateSystem.files.forEach((file) => {
                const position = `${file}${rank}`;
                this.validSquares.add(position);
                if (!this.board[position]) {
                    this.board[position] = null;
                }
            })
        );
    }

    takeBack() {
        if (this.boards.length > 0) {
            this.moves.pop();
            this.board = this.boards.pop() || this.board;
            this.turn =
                this.turn === ChessColor.Light
                    ? ChessColor.Dark
                    : ChessColor.Light;
        }
    }

    makeMove(curr: string, target: string) {
        const currPiece = this.board[curr];
        if (!currPiece) return;

        const validMove = this.getPossibleMoves(currPiece, curr).find(
            (move) => move.target === target
        );

        if (validMove) {
            this.boards.push({ ...this.board });
            this.board[target] = currPiece;
            this.board[curr] = null;

            if (validMove.type === MoveType.EnPassant) {
                const lastMove = this.lastMove();
                if (lastMove) this.board[lastMove.target] = null;
            }

            this.turn =
                this.turn === ChessColor.Light
                    ? ChessColor.Dark
                    : ChessColor.Light;
            this.moves.push(validMove);
        }
    }

    getPossibleTargets(piece: IPiece, position: string): Array<string> {
        return this.getPossibleMoves(piece, position).map(
            (move) => move.target
        );
    }

    getPossibleMoves(piece: IPiece, position: string): Array<IMove> {
        if (this.turn !== piece.color) return [];

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

    getPawnMoves(piece: IPiece, position: string): Array<IMove> {
        const [file, rank] = [position[0], parseInt(position[1])];
        const moves: IMove[] = [];
        const moveDir =
            this.direction[piece.color] === ChessDirection.Up ? 1 : -1;
        const baseRank =
            this.direction[piece.color] === ChessDirection.Up ? 2 : 7;
        const enPassantRank =
            this.direction[piece.color] === ChessDirection.Up ? 5 : 4;

        const addMove = (target: string, type: MoveType) =>
            moves.push({ piece, type, target, position });

        const forwardOne = `${file}${rank + moveDir}`;
        const forwardTwo = `${file}${rank + 2 * moveDir}`;
        const captureTargets = [
            `${String.fromCharCode(file.charCodeAt(0) - 1)}${rank + moveDir}`,
            `${String.fromCharCode(file.charCodeAt(0) + 1)}${rank + moveDir}`,
        ];

        // Move forward
        if (this.validSquares.has(forwardOne) && !this.board[forwardOne]) {
            addMove(forwardOne, MoveType.Move);
            if (
                rank === baseRank &&
                this.validSquares.has(forwardTwo) &&
                !this.board[forwardTwo]
            ) {
                addMove(forwardTwo, MoveType.PawnMove2);
            }
        }

        // Capture and En Passant
        captureTargets.forEach((target) => {
            if (this.validSquares.has(target)) {
                const targetPiece = this.board[target];
                if (targetPiece && targetPiece.color !== piece.color) {
                    addMove(target, MoveType.Capture);
                } else if (rank === enPassantRank && !targetPiece) {
                    const enPassantPawnPos = `${target[0]}${rank}`;
                    const lastMove = this.lastMove();
                    if (
                        lastMove?.type === MoveType.PawnMove2 &&
                        lastMove.target === enPassantPawnPos
                    ) {
                        addMove(target, MoveType.EnPassant);
                    }
                }
            }
        });

        return moves;
    }

    getPieceMoves(piece: IPiece, position: string): Array<IMove> {
        const [file, rank] = [position[0], parseInt(position[1])];
        const moves: IMove[] = [];
        interface IMoveSet {
            file: number;
            rank: number;
        }
        const moveSets: {
            [key in PieceName]: Array<IMoveSet>;
        } = {
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
            [PieceName.Pawn]: [],
        };

        const moveLimit =
            piece.name === PieceName.King || piece.name === PieceName.Knight
                ? 1
                : 8;
        const moveSet = moveSets[piece.name];

        for (const { file: df, rank: dr } of moveSet) {
            for (let i = 1; i <= moveLimit; i++) {
                const targetFile = String.fromCharCode(
                    file.charCodeAt(0) + df * i
                );
                const targetRank = rank + dr * i;
                const targetPos = `${targetFile}${targetRank}`;

                if (!this.validSquares.has(targetPos)) break;

                const targetPiece = this.board[targetPos];
                if (targetPiece) {
                    if (targetPiece.color !== piece.color) {
                        moves.push({
                            piece,
                            type: MoveType.Capture,
                            target: targetPos,
                            position,
                        });
                    }
                    break;
                } else {
                    moves.push({
                        piece,
                        type: MoveType.Move,
                        target: targetPos,
                        position,
                    });
                }
            }
        }

        return moves;
    }

    lastMove(): IMove | undefined {
        return this.moves[this.moves.length - 1];
    }
}

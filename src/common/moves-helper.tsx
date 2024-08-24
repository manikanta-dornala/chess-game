import { PositionHelper } from './position-helper';
import { ChessColor, MoveType, PieceName } from './enums';
import { IBoard } from './game';
import { IPiece } from './piece';
import { PieceMoveSets } from './piece-move-sets';

export interface IMove {
    target: string;
    type: MoveType;
    piece: IPiece;
    position: string;
}
export abstract class MovesHelper {
    public static isCheckMate(
        turn: ChessColor,
        board: IBoard,
        lastMove: IMove | undefined
    ): boolean {
        let kingPosition: string | undefined = undefined;
        PositionHelper.validSquares.forEach((position) => {
            const piece = board[position];
            if (piece?.name === PieceName.King && piece.color === turn)
                kingPosition = position;
        });

        if (!kingPosition) return false;

        let legalMoves: IMove[] = [];
        PositionHelper.validSquares.forEach((position) => {
            const piece = board[position];
            if (piece?.color === turn) {
                legalMoves = legalMoves.concat(
                    this.getLegalMoves(turn, piece, position, board, lastMove)
                );
            }
        });
        return legalMoves.length === 0;
    }

    public static getLegalMoves(
        turn: ChessColor,
        piece: IPiece,
        position: string,
        board: IBoard,
        lastMove: IMove | undefined
    ): IMove[] {
        const moves = this.getPossibleMoves(
            turn,
            piece,
            position,
            board,
            lastMove
        );

        return moves.filter((move) => {
            const newboard = { ...board };
            newboard[move.target] = move.piece;
            newboard[position] = null;
            if (move.type === MoveType.EnPassant) {
                if (lastMove) newboard[lastMove.target] = null; // Handle En Passant capture
            }
            if (this.isKingInCheck(turn, newboard)) return false;
            return true;
        });
    }

    // Returns all valid moves for a piece at a given position
    public static getPossibleMoves(
        turn: ChessColor,
        piece: IPiece,
        position: string,
        board: IBoard,
        lastMove: IMove | undefined
    ): IMove[] {
        if (turn !== piece.color) return []; // Exit if it's not this piece's turn

        const possibleMoves =
            piece.name === PieceName.Pawn
                ? this.getPawnMoves(piece, position, board, lastMove)
                : this.getPieceMoves(piece, position, board);

        return possibleMoves;
    }

    // Handles pawn-specific moves including En Passant
    public static getPawnMoves(
        piece: IPiece,
        position: string,
        board: IBoard,
        lastMove: IMove | undefined
    ): IMove[] {
        const [file, rank] = [position[0], parseInt(position[1])];
        const moves: IMove[] = [];
        const moveDir = piece.color === ChessColor.Light ? 1 : -1; // Determine the direction of movement
        const baseRank = piece.color === ChessColor.Light ? 2 : 7; // The initial rank of the pawn
        const enPassantRank = piece.color === ChessColor.Light ? 5 : 4; // The rank where En Passant can occur

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
        if (PositionHelper.validSquares.has(forwardOne) && !board[forwardOne]) {
            addMove(forwardOne, MoveType.Move);
            // Handle two-step move from base rank
            if (
                rank === baseRank &&
                PositionHelper.validSquares.has(forwardTwo) &&
                !board[forwardTwo]
            ) {
                addMove(forwardTwo, MoveType.DoubleMove);
            }
        }

        // Handle captures and En Passant
        captureTargets.forEach((target) => {
            if (PositionHelper.validSquares.has(target)) {
                const targetPiece = board[target];
                if (targetPiece && targetPiece.color !== piece.color) {
                    addMove(target, MoveType.Capture); // Capture an enemy piece
                } else if (rank === enPassantRank && !targetPiece) {
                    const enPassantPawnPos = `${target[0]}${rank}`;
                    if (
                        lastMove?.type === MoveType.DoubleMove &&
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
    public static getPieceMoves(
        piece: IPiece,
        position: string,
        board: IBoard
    ): IMove[] {
        const [file, rank] = [position[0], parseInt(position[1])];
        const moves: IMove[] = [];

        const moveLimit =
            piece.name === PieceName.King || piece.name === PieceName.Knight
                ? 1
                : 8;
        const moveSet = PieceMoveSets[piece.name];

        // Generate moves based on the piece's move pattern
        for (const { file: df, rank: dr } of moveSet) {
            for (let i = 1; i <= moveLimit; i++) {
                const targetFile = String.fromCharCode(
                    file.charCodeAt(0) + df * i
                );
                const targetRank = rank + dr * i;
                const targetPos = `${targetFile}${targetRank}`;

                if (!PositionHelper.validSquares.has(targetPos)) break; // Stop if the target is not valid

                const targetPiece = board[targetPos];
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

    // Determines if the king of the specified color is in check
    public static isKingInCheck(color: ChessColor, board: IBoard): boolean {
        const kingPosition = Object.keys(board).find((position) => {
            const piece = board[position];
            return piece?.name === PieceName.King && piece.color === color;
        });

        if (!kingPosition) return false;

        // Check if any opposing piece can attack the king's position
        const opponentColor =
            color === ChessColor.Light ? ChessColor.Dark : ChessColor.Light;
        for (const position of Object.keys(board)) {
            const piece = board[position];
            if (piece?.color === opponentColor) {
                const possibleMoves =
                    piece.name === PieceName.Pawn
                        ? this.getPawnMoves(piece, position, board, undefined)
                        : this.getPieceMoves(piece, position, board);
                if (possibleMoves.map((e) => e.target).includes(kingPosition)) {
                    return true;
                }
            }
        }
        return false;
    }
}

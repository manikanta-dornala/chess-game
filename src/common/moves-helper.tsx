import { PositionHelper } from './position-helper';
import { ChessColor, MoveType, PieceName } from './enums';
import { IBoard, ICastlingRights, IMove, IPiece } from './interfaces';
import { PieceMoveSets } from './piece-move-sets';
import { cache } from './utils';

export abstract class MovesHelper {
    public static getLegalMoves(
        turn: ChessColor,
        piece: IPiece,
        position: string,
        board: IBoard,
        lastMove: IMove | null
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

    @cache
    // Returns all valid moves for a piece at a given position
    public static getPossibleMoves(
        turn: ChessColor,
        piece: IPiece,
        position: string,
        board: IBoard,
        lastMove: IMove | null
    ): IMove[] {
        if (turn !== piece.color) return []; // Exit if it's not this piece's turn

        const possibleMoves =
            piece.name === PieceName.Pawn
                ? this.getPawnMoves(piece, position, board, lastMove)
                : this.getPieceMoves(piece, position, board);

        if (
            board[turn + 'CastlingRight'] &&
            piece.name === PieceName.King &&
            piece.color === turn
        ) {
            this.getCastlingMoves(turn, board).forEach((move) =>
                possibleMoves.push(move)
            );
        }
        return possibleMoves;
    }

    public static getCastlingMoves(turn: ChessColor, board: IBoard): IMove[] {
        const moves: IMove[] = [];

        const kingPos = turn === ChessColor.Light ? 'e1' : 'e8';
        const kingTargetPos =
            turn === ChessColor.Light ? ['c1', 'g1'] : ['c8', 'g8'];
        const kingPassingPos =
            turn === ChessColor.Light ? ['d1', 'f1'] : ['d8', 'f8'];

        // King is in Check or would be in check while castling
        let wouldKingBeInCheck = false;
        [kingPos]
            .concat(kingPassingPos)
            .concat(kingTargetPos)
            .forEach((position) => {
                if (this.isKingInCheckAt(position, turn, board)) {
                    wouldKingBeInCheck = true;
                    return;
                }
            });
        if (wouldKingBeInCheck) return [];

        const rooksPos =
            turn === ChessColor.Light ? ['a1', 'h1'] : ['a8', 'h8'];

        const emptyPos =
            turn === ChessColor.Light
                ? [
                      ['b1', 'c1', 'd1'],
                      ['f1', 'g1'],
                  ]
                : [
                      ['b8', 'c8', 'd8'],
                      ['f8', 'g8'],
                  ];
        for (let i = 0; i < 2; i++) {
            const rookPos = rooksPos[i];
            const rookIsMine =
                board[rookPos]?.name === PieceName.Rook &&
                board[rookPos]?.color === turn;
            let pathIsClear = true;
            emptyPos[i].forEach((pos) => {
                pathIsClear = pathIsClear && !board[pos];
            });
            if (rookIsMine && pathIsClear) {
                moves.push({
                    piece: { name: PieceName.King, color: turn },
                    type: MoveType.Castling,
                    position: kingPos,
                    target: kingTargetPos[i],
                });
            }
        }
        return moves;
    }

    @cache
    // Handles pawn-specific moves including En Passant
    public static getPawnMoves(
        piece: IPiece,
        position: string,
        board: IBoard,
        lastMove: IMove | null
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

    @cache
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

                // Stop if the target is not valid
                if (!PositionHelper.validSquares.has(targetPos)) break;

                const targetPiece = board[targetPos];
                if (targetPiece) {
                    // Capture an enemy piece
                    if (targetPiece.color !== piece.color) {
                        moves.push({
                            piece,
                            type: MoveType.Capture,
                            target: targetPos,
                            position,
                        });
                    }
                    // Stop moving forward there's a piece in the way
                    break;
                } else {
                    // Regular move to an empty square
                    let move: IMove | null = {
                        piece,
                        type: MoveType.Move,
                        target: targetPos,
                        position,
                    };
                    if (move) moves.push(move);
                }
            }
        }

        return moves;
    }

    @cache
    // Determines if the king of the specified color is in check
    public static isKingInCheck(turn: ChessColor, board: IBoard): boolean {
        const kingPosition = PositionHelper.getKingPosition(turn, board);
        console.log('kingPosition', kingPosition);
        if (!kingPosition) return false;

        return this.isKingInCheckAt(kingPosition, turn, board);
    }

    @cache
    public static isKingInCheckAt(
        kingPosition: string,
        turn: ChessColor,
        board: IBoard
    ) {
        // Check if any opposing piece can attack the king's position
        const opponentColor =
            turn === ChessColor.Light ? ChessColor.Dark : ChessColor.Light;
        let isKingInCheck = false;
        PositionHelper.validSquares.forEach((position) => {
            const piece = board[position];
            if (piece?.color === opponentColor) {
                const possibleMoves =
                    piece.name === PieceName.Pawn
                        ? this.getPawnMoves(piece, position, board, null)
                        : this.getPieceMoves(piece, position, board);
                if (possibleMoves.map((e) => e.target).includes(kingPosition)) {
                    isKingInCheck = true;
                    return;
                }
            }
        });
        return isKingInCheck;
    }

    public static isCheckMate(
        turn: ChessColor,
        board: IBoard,
        lastMove: IMove | null
    ): boolean {
        let kingPosition = PositionHelper.getKingPosition(turn, board);

        if (!kingPosition) return false;

        let legalMoves: IMove[] = [];
        PositionHelper.validSquares.forEach((position) => {
            const piece = board[position];
            if (piece?.color === turn) {
                legalMoves = legalMoves.concat(
                    this.getLegalMoves(turn, piece, position, board, lastMove)
                );
            }
            if (legalMoves.length > 0) {
                // Legal Moves exist, king can move
                return false;
            }
        });
        return legalMoves.length === 0;
    }
}

import { ChessColor, PieceName } from './enums';
import { Board } from './Board';
import { cache } from './utils';

export abstract class PositionHelper {
    public static files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    public static ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    @cache
    public static gridCoordToPosition({
        rankIndex,
        fileIndex,
        bottomColor,
    }: {
        rankIndex: number;
        fileIndex: number;
        bottomColor: ChessColor;
    }): string {
        const file = this.files[fileIndex];
        const rank = this.ranks[rankIndex];

        return bottomColor === ChessColor.Light
            ? file + rank
            : this.files[7 - fileIndex] + this.ranks[7 - rankIndex];
    }

    @cache
    public static getPositionToCoord(
        position: string,
        bottomColor: ChessColor
    ) {
        const file = position[0];
        const rank = position[1];
        return bottomColor === ChessColor.Light
            ? { x: this.files.indexOf(file), y: this.ranks.indexOf(rank) }
            : {
                  x: 7 - this.files.indexOf(file),
                  y: 7 - this.ranks.indexOf(rank),
              };
    }

    @cache
    public static getSquareColor(position: string): ChessColor {
        const xPos = position[0];
        const yPos = parseInt(position[1], 10);
        if (['a', 'c', 'e', 'g'].includes(xPos) && yPos % 2 === 0) {
            return ChessColor.Light;
        } else if (['b', 'd', 'f', 'h'].includes(xPos) && yPos % 2 === 1) {
            return ChessColor.Light;
        }
        return ChessColor.Dark;
    }

    public static validSquares = new Set(
        PositionHelper.ranks.flatMap((rank) =>
            PositionHelper.files.map((file) => {
                const position = `${file}${rank}`;
                return position;
            })
        )
    );

    @cache
    public static getKingPosition(
        turn: ChessColor,
        board: Board
    ): string | null {
        let kingPosition = null;
        this.validSquares.forEach((position) => {
            const piece = board.get(position);
            if (piece?.name === PieceName.King && piece?.color === turn) {
                kingPosition = position;
            }
        });
        return kingPosition;
    }
}

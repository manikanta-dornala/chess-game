import { ChessColor } from './enums';

export abstract class ChessPositionHelper {
    public static files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    public static ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

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
        ChessPositionHelper.ranks.flatMap((rank) =>
            ChessPositionHelper.files.map((file) => {
                const position = `${file}${rank}`;
                return position;
            })
        )
    );
}

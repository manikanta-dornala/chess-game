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
}

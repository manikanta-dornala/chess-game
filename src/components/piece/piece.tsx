import React from 'react';
import { PieceType, ChessColor } from '../../common/enums';
export default class Piece extends React.Component<
    { type: PieceType; color: ChessColor },
    { type: PieceType; color: ChessColor }
> {
    imgPathMap = {
        [PieceType.Pawn]: {
            [ChessColor.Light]: '../assets/pawn_w.png',
            [ChessColor.Dark]: '../assets/pawn_b.png',
        },
        [PieceType.Knight]: {
            [ChessColor.Light]: 'assets/knight_w.png',
            [ChessColor.Dark]: 'assets/knight_b.png',
        },
        [PieceType.Bishop]: {
            [ChessColor.Light]: 'assets/bishop_w.png',
            [ChessColor.Dark]: 'assets/bishop_b.png',
        },
        [PieceType.Rook]: {
            [ChessColor.Light]: 'assets/rook_w.png',
            [ChessColor.Dark]: 'assets/rook_b.png',
        },
        [PieceType.Queen]: {
            [ChessColor.Light]: 'assets/queen_w.png',
            [ChessColor.Dark]: 'assets/queen_b.png',
        },
        [PieceType.King]: {
            [ChessColor.Light]: 'assets/king_w.png',
            [ChessColor.Dark]: 'assets/king_b.png',
        },
    };

    constructor(props: { type: PieceType; color: ChessColor }) {
        super(props);
        this.state = props;
    }

    render(): React.ReactNode {
        return (
            <img src={this.imgPathMap[this.state.type][this.state.color]}></img>
        );
    }
}

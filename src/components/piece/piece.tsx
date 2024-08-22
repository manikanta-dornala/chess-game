import React from 'react';
import { PieceName, ChessColor } from '../../common/enums';

import './piece.css';

interface IPieceProps {
    name: PieceName;
    color: ChessColor;
}
interface IPieceState {
    name: PieceName;
    color: ChessColor;
}
export default class PieceComponent extends React.Component<
    IPieceProps,
    IPieceState
> {
    imgPathMap = {
        [PieceName.Pawn]: {
            [ChessColor.Light]: '../assets/white-pawn.png',
            [ChessColor.Dark]: '../assets/black-pawn.png',
        },
        [PieceName.Knight]: {
            [ChessColor.Light]: '../assets/white-knight.png',
            [ChessColor.Dark]: '../assets/black-knight.png',
        },
        [PieceName.Bishop]: {
            [ChessColor.Light]: '../assets/white-bishop.png',
            [ChessColor.Dark]: '../assets/black-bishop.png',
        },
        [PieceName.Rook]: {
            [ChessColor.Light]: '../assets/white-rook.png',
            [ChessColor.Dark]: '../assets/black-rook.png',
        },
        [PieceName.Queen]: {
            [ChessColor.Light]: '../assets/white-queen.png',
            [ChessColor.Dark]: '../assets/black-queen.png',
        },
        [PieceName.King]: {
            [ChessColor.Light]: '../assets/white-king.png',
            [ChessColor.Dark]: '../assets/black-king.png',
        },
    };

    constructor(props: IPieceProps) {
        super(props);
        this.state = props;
    }

    render(): React.ReactNode {
        return (
            <img
                className="piece"
                src={this.imgPathMap[this.state.name][this.state.color]}
                alt={this.state.color + ' ' + this.state.name}
            ></img>
        );
    }
}

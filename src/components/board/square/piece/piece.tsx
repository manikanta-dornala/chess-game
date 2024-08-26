import React from 'react';
import { PieceName, ChessColor } from '../../../../common/enums';
import './piece.css';

interface IPieceProps {
    name: PieceName;
    color: ChessColor;
    opacity?: number; // Add this optional prop
}
const pieceImgs = {
    [ChessColor.Light]: {
        [PieceName.Queen]: '♕',
        [PieceName.Rook]: '♖',
        [PieceName.Bishop]: '♗',
        [PieceName.Knight]: '♘',
        [PieceName.King]: '♔',
        [PieceName.Pawn]: '♙',
    },

    [ChessColor.Dark]: {
        [PieceName.Queen]: '♛',
        [PieceName.Rook]: '♜',
        [PieceName.Bishop]: '♝',
        [PieceName.Knight]: '♞',
        [PieceName.King]: '♚',
        [PieceName.Pawn]: '♟',
    },
};
export default class PieceComponent extends React.PureComponent<IPieceProps> {
    render() {
        const { name, color, opacity = 1 } = this.props; // Default opacity to 1 if not provided
        return (
            <div
                className={`chess-piece`}
                draggable={true}
                style={{ opacity }} // Apply opacity here
            >
                {pieceImgs[color][name]}
            </div>
        );
    }
}

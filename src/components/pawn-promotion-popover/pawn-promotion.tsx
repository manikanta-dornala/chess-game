import React from 'react';
import { ChessColor, PieceName } from '../../common/enums';
import './pawn-promotion.css';
interface IPawnPromotionProps {
    color: ChessColor;
    onSelect: (piece: PieceName) => void;
}
export default class PawnPromotionComponent extends React.Component<
    IPawnPromotionProps,
    any
> {
    promotionPieces = [
        PieceName.Queen,
        PieceName.Rook,
        PieceName.Bishop,
        PieceName.Knight,
    ];

    pieceImgs = {
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

    render(): React.ReactNode {
        return (
            <div className="promotion-ui">
                {this.promotionPieces.map((piece) => (
                    <button
                        key={piece}
                        onClick={() => this.props.onSelect(piece)}
                    >
                        <span
                            style={{
                                fontSize: 'xx-large',
                                fontFamily: 'Merida',
                            }}
                        >
                            {this.pieceImgs[this.props.color][piece]}
                        </span>
                        {' ' + piece}
                    </button>
                ))}
            </div>
        );
    }
}

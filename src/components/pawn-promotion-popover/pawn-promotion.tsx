import React from 'react';
import { PieceName } from '../../common/enums';

interface IPawnPromotionProps {
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

    render(): React.ReactNode {
        return (
            <div className="promotion-ui">
                {this.promotionPieces.map((piece) => (
                    <button
                        key={piece}
                        onClick={() => this.props.onSelect(piece)}
                    >
                        {piece}
                    </button>
                ))}
            </div>
        );
    }
}

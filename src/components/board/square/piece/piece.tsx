import React from 'react';
import { PieceName, ChessColor } from '../../../../common/enums';
import './piece.css';
import { PieceSymbols } from '../../../../common/initial-piece-positions';

interface IPieceProps {
    name: PieceName;
    color: ChessColor;
    opacity?: number; // Add this optional prop
}

export default class PieceComponent extends React.PureComponent<IPieceProps> {
    render() {
        const { name, color, opacity = 1 } = this.props; // Default opacity to 1 if not provided
        return (
            <div
                className={`chess-piece`}
                draggable={true}
                style={{ opacity }} // Apply opacity here
            >
                {PieceSymbols[color][name]}
            </div>
        );
    }
}

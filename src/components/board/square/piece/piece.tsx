import React from 'react';
import { PieceName, ChessColor } from '../../../../common/enums';
import './piece.css';

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
                className={`chess-piece ${color}-${name}`}
                draggable={true}
                style={{ opacity }} // Apply opacity here
            ></div>
        );
    }
}

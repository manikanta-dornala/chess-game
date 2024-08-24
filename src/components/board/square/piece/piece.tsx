import React from 'react';
import { PieceName, ChessColor } from '../../../../common/enums';
import './piece.css';

interface IPieceProps {
    name: PieceName;
    color: ChessColor;
}

export default class PieceComponent extends React.PureComponent<IPieceProps> {
    render() {
        return (
            <div
                className={`chess-piece ${this.props.color}-${this.props.name}`}
                draggable={true}
            ></div>
        );
    }
}

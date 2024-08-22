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
    constructor(props: IPieceProps) {
        super(props);
        this.state = props;
    }

    render(): React.ReactNode {
        return (
            <div
                className={
                    'chess-piece ' + this.state.color + '-' + this.state.name
                }
            ></div>
        );
    }
}

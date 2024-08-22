import React from 'react';

import './square.css';
import { ChessColor } from '../../common/enums';
import PieceComponent from '../piece/piece';
import { IPiece } from '../../common/piece';

interface ISquareProps {
    position: string;
    index: number;
    piece: IPiece;
}
interface ISquareState {
    position: string;
    color: ChessColor;
    piece: IPiece;
}
export default class SquareComponent extends React.Component<
    ISquareProps,
    ISquareState
> {
    constructor(props: ISquareProps) {
        super(props);
        this.state = {
            position: props.position,
            color: getSquareColor(props.position),
            piece: props.piece,
        };
    }

    render(): React.ReactNode {
        let id = 'board-square-' + this.state.position + '-' + this.state.color;
        let squareClass =
            this.state.color === ChessColor.Light
                ? 'lightSquare'
                : 'darkSquare';
        let txtClr = this.state.color === ChessColor.Light ? 'black' : 'white';

        return (
            <div id={id}>
                <span className="squareLabel" style={{ color: txtClr }}>
                    {this.state.position}
                </span>
                <div className={squareClass + ' boardSquare'}>
                    {this.state.piece && (
                        <PieceComponent
                            name={this.state.piece.name}
                            color={this.state.piece.color}
                        ></PieceComponent>
                    )}
                </div>
            </div>
        );
    }
}

export function getSquareColor(position: string): ChessColor {
    let xPos = position[0];
    let yPos = parseInt(position[1]);
    let color = ChessColor.Dark;
    if (
        ['a', 'c', 'e', 'g'].findIndex((x) => x === xPos) !== -1 &&
        yPos % 2 === 0
    ) {
        color = ChessColor.Light;
    } else if (
        ['b', 'd', 'f', 'h'].findIndex((x) => x === xPos) !== -1 &&
        yPos % 2 === 1
    ) {
        color = ChessColor.Light;
    }
    return color;
}

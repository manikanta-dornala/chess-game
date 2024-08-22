import React from 'react';

import './square.css';
import { ChessColor, PieceType } from '../../common/enums';
import Piece from '../piece/piece';

interface ISquareProps {
    position: string;
    index: number;
}
interface ISquareState {
    position: string;
    color: ChessColor;
}
export default class Square extends React.Component<
    ISquareProps,
    ISquareState
> {
    constructor(props: ISquareProps) {
        super(props);
        this.state = {
            position: props.position,
            color: getSquareColor(props.position),
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
                    <Piece
                        type={PieceType.Pawn}
                        color={ChessColor.Light}
                    ></Piece>
                </div>
            </div>
        );
    }
}

export function getSquareColor(position: string): ChessColor {
    let xPos = position[0];
    let yPos = parseInt(position[1]);
    let kind = ChessColor.Dark;
    if (
        ['a', 'c', 'e', 'g'].findIndex((x) => x === xPos) !== -1 &&
        yPos % 2 === 0
    ) {
        kind = ChessColor.Light;
    } else if (
        ['b', 'd', 'f', 'h'].findIndex((x) => x === xPos) !== -1 &&
        yPos % 2 === 1
    ) {
        kind = ChessColor.Light;
    }
    return kind;
}

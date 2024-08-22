import React from 'react';

import './square.css';
import { ChessColor } from '../../common/enums';
import PieceComponent from '../piece/piece';
import { getInitialPosisitions } from '../../common/initial-positions';

interface ISquareProps {
    squarePosition: string;
    index: number;
}
interface ISquareState {
    squarePosition: string;
    squareColor: ChessColor;
}
export default class SquareComponent extends React.Component<
    ISquareProps,
    ISquareState
> {
    initialPositions = getInitialPosisitions(ChessColor.Light);
    constructor(props: ISquareProps) {
        super(props);
        this.state = {
            squarePosition: props.squarePosition,
            squareColor: getSquareColor(props.squarePosition),
        };
    }

    render(): React.ReactNode {
        let id =
            'board-square-' +
            this.state.squarePosition +
            '-' +
            this.state.squareColor;
        let squareClass =
            this.state.squareColor === ChessColor.Light
                ? 'lightSquare'
                : 'darkSquare';
        let txtClr =
            this.state.squareColor === ChessColor.Light ? 'black' : 'white';
        let piece = this.initialPositions[this.state.squarePosition];
        return (
            <div id={id}>
                <span className="squareLabel" style={{ color: txtClr }}>
                    {this.state.squarePosition}
                </span>
                <div className={squareClass + ' boardSquare'}>
                    {piece && (
                        <PieceComponent
                            name={piece.name}
                            color={piece.color}
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

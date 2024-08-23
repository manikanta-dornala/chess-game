import React from 'react';

import './square.css';
import { ChessColor } from '../../common/enums';
// import PieceComponent from '../piece/piece';
import { IPiece } from '../../common/piece';
import { BoardState, getPieceAtPosition } from '../../common/game';
import PieceComponent from '../piece/piece';

interface ISquareProps {
    position: string;
    // index: number;
    boardState: BoardState;
}
interface ISquareState {
    position: string;
    color: ChessColor;
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
        };
    }

    render(): React.ReactNode {
        let id = 'board-square-' + this.state.position + '-' + this.state.color;
        let squareClass =
            this.state.color === ChessColor.Light
                ? 'lightSquare'
                : 'darkSquare';
        let txtClr = this.state.color === ChessColor.Light ? 'black' : 'white';

        const piece = getPieceAtPosition(
            this.props.position,
            this.props.boardState
        );
        let piececomp = <div></div>;
        if (piece !== null && piece !== undefined) {
            piececomp = (
                <PieceComponent
                    name={piece.name}
                    color={piece.color}
                ></PieceComponent>
            );
        }
        return (
            <div>
                <span className="squareLabel" style={{ color: txtClr }}>
                    {this.state.position}
                </span>
                <div className={squareClass + ' boardSquare '}>{piececomp}</div>
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

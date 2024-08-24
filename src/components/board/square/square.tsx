import React from 'react';

import './square.css';
import { GameState } from '../../../common/game';
import { ChessColor } from '../../../common/enums';
import PieceComponent from './piece/piece';

interface ISquareProps {
    position: string;
    // index: number;
    gameState: GameState;
    highlight: boolean;
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

        const piece = this.props.gameState.board[this.props.position];
        let piececomp = <div></div>;
        if (piece !== null && piece !== undefined) {
            piececomp = (
                <PieceComponent
                    name={piece.name}
                    color={piece.color}
                ></PieceComponent>
            );
        }
        let highlightcomp = <div></div>;
        if (this.props.highlight) {
            highlightcomp = (
                <div
                    className={
                        'highlight ' +
                        (this.state.color === ChessColor.Light
                            ? 'highlight-light'
                            : 'highlight-dark')
                    }
                ></div>
            );
        }
        return (
            <div id={id}>
                <span className="squareLabel" style={{ color: txtClr }}>
                    {this.state.position}
                </span>
                <div className={squareClass + ' boardSquare '}>
                    {piececomp}
                    {highlightcomp}
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

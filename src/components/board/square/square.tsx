import React from 'react';
import './square.css';
import { GameState } from '../../../common/game';
import { ChessColor } from '../../../common/enums';
import PieceComponent from './piece/piece';

interface ISquareProps {
    position: string;
    gameState: GameState;
    highlight: boolean;
}

interface ISquareState {
    color: ChessColor;
}

export default class SquareComponent extends React.Component<
    ISquareProps,
    ISquareState
> {
    state: ISquareState = {
        color: getSquareColor(this.props.position),
    };

    render(): React.ReactNode {
        const { position, highlight, gameState } = this.props;
        const { color } = this.state;

        const squareClass =
            color === ChessColor.Light
                ? 'lightSquare boardSquare'
                : 'darkSquare boardSquare';

        const highlightClass = highlight
            ? color === ChessColor.Light
                ? 'highlight-border-light'
                : 'highlight-border-dark'
            : '';

        const piece = gameState.board[position];

        return (
            <div id={`board-square-${position}-${color}`}>
                <span
                    className="squareLabel"
                    style={{
                        color: color === ChessColor.Light ? 'black' : 'white',
                    }}
                >
                    {position}
                </span>
                <div className={`${squareClass} ${highlightClass}`}>
                    {piece && (
                        <PieceComponent name={piece.name} color={piece.color} />
                    )}
                </div>
            </div>
        );
    }
}

function getSquareColor(position: string): ChessColor {
    const [file, rank] = [position[0], parseInt(position[1], 10)];
    const isLightSquare =
        (['a', 'c', 'e', 'g'].includes(file) && rank % 2 === 0) ||
        (['b', 'd', 'f', 'h'].includes(file) && rank % 2 === 1);

    return isLightSquare ? ChessColor.Light : ChessColor.Dark;
}

import React from 'react';
import './square.css';
import { GameState } from '../../../common/game';
import { ChessColor } from '../../../common/enums';
import PieceComponent from './piece/piece';
import { ChessPositionHelper } from '../../../common/chess-position-helper';

interface ISquareProps {
    position: string;
    gameState: GameState;
    highlight: boolean;
    grabbedPieceOpacity: number;
}

interface ISquareState {
    color: ChessColor;
}

export default class SquareComponent extends React.Component<
    ISquareProps,
    ISquareState
> {
    state: ISquareState = {
        color: ChessPositionHelper.getSquareColor(this.props.position),
    };

    render(): React.ReactNode {
        const {
            position,
            highlight,
            gameState,
            grabbedPieceOpacity = 1,
        } = this.props;
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
                        <PieceComponent
                            name={piece.name}
                            color={piece.color}
                            opacity={grabbedPieceOpacity}
                        />
                    )}
                </div>
            </div>
        );
    }
}

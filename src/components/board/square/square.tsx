import React from 'react';
import './square.css';
import { ChessColor } from '../../../common/enums';
import PieceComponent from './piece/piece';
import { PositionHelper } from '../../../common/position-helper';
import { IMove, IPiece } from '../../../common/interfaces';

interface ISquareProps {
    position: string;
    piece: IPiece | null;
    highlight: boolean;
    isKingInCheck: boolean;
    isPieceGrabbed: boolean;
    validMoves: IMove[] | null | undefined;
}

interface ISquareState {
    color: ChessColor;
}

export default class SquareComponent extends React.Component<
    ISquareProps,
    ISquareState
> {
    state: ISquareState = {
        color: PositionHelper.getSquareColor(this.props.position),
    };

    render(): React.ReactNode {
        const {
            position,
            piece,
            highlight,
            isKingInCheck,
            isPieceGrabbed,
            validMoves,
        } = this.props;
        const { color } = this.state;

        const squareClass =
            color === ChessColor.Light
                ? 'lightSquare boardSquare'
                : 'darkSquare boardSquare';

        const highlightClass = isKingInCheck
            ? 'highlight-border-king-check'
            : highlight
              ? color === ChessColor.Light
                  ? 'highlight-border-light'
                  : 'highlight-border-dark'
              : '';

        const pieceOpacity = isPieceGrabbed ? 0.2 : 1;
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
                            opacity={pieceOpacity}
                            draggable={!!validMoves && validMoves.length > 0}
                        />
                    )}
                </div>
            </div>
        );
    }
}

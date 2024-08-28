import React from 'react';

import './board.css';
import { ChessColor, PieceName } from '../../common/enums';
import SquareComponent from './square/square';
import { PositionHelper } from '../../common/position-helper';
import { IBoard, IMove } from '../../common/interfaces';
import { MovesHelper } from '../../common/moves-helper';

export default class BoardComponent extends React.Component<{
    board: IBoard;
    bottomColor: ChessColor;
    highlightPositions: Array<string>;
    grabbedPiecePosition: string;
    validMoves: { [position: string]: IMove[] };
}> {
    getSquares() {
        const {
            board,
            bottomColor,
            highlightPositions,
            grabbedPiecePosition,
            validMoves,
        } = this.props;
        let squares = [];
        for (let j = 0; j < PositionHelper.ranks.length; j++) {
            for (let i = 0; i < PositionHelper.files.length; i++) {
                let position = PositionHelper.gridCoordToPosition({
                    rankIndex: j,
                    fileIndex: i,
                    bottomColor: bottomColor,
                });
                const piece = board[position];
                const shouldHighlight = highlightPositions.includes(position);
                const isPieceAtPositionGrabbed =
                    grabbedPiecePosition === position;
                var foo =
                    piece?.name === PieceName.King
                        ? MovesHelper.isKingInCheckAt(
                              position,
                              piece?.color,
                              board
                          )
                        : false;
                squares.push(
                    <SquareComponent
                        key={position}
                        position={position}
                        piece={piece}
                        highlight={shouldHighlight}
                        isPieceGrabbed={isPieceAtPositionGrabbed}
                        isKingInCheck={foo}
                        validMoves={
                            validMoves[position] ? validMoves[position] : null
                        }
                    ></SquareComponent>
                );
            }
        }
        return squares;
    }
    render(): React.ReactNode {
        return <div className="board">{this.getSquares()}</div>;
    }
}

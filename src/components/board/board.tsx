import React from 'react';

import './board.css';
import { GameState } from '../../common/game';
import { ChessColor, PieceName } from '../../common/enums';
import SquareComponent from './square/square';
import { PositionHelper } from '../../common/position-helper';
import { MovesHelper } from '../../common/moves-helper';

export default class BoardComponent extends React.Component<{
    gameState: GameState;
    bottomColor: ChessColor;
    highlightPositions: Array<string>;
    grabbedPiecePosition: string;
}> {
    getSquares() {
        const {
            gameState,
            bottomColor,
            highlightPositions,
            grabbedPiecePosition,
        } = this.props;
        let squares = [];
        for (let j = 0; j < PositionHelper.ranks.length; j++) {
            for (let i = 0; i < PositionHelper.files.length; i++) {
                let position = PositionHelper.gridCoordToPosition({
                    rankIndex: j,
                    fileIndex: i,
                    bottomColor: bottomColor,
                });
                const piece = gameState.board[position];
                const shouldHighlight = highlightPositions.includes(position);
                const isPieceAtPositionGrabbed =
                    grabbedPiecePosition === position;
                const isKingInCheck =
                    piece?.name === PieceName.King &&
                    piece?.color === gameState.turn &&
                    MovesHelper.isKingInCheck(gameState.turn, gameState.board);
                squares.push(
                    <SquareComponent
                        key={position}
                        position={position}
                        piece={piece}
                        highlight={shouldHighlight}
                        isPieceGrabbed={isPieceAtPositionGrabbed}
                        isKingInCheck={isKingInCheck}
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

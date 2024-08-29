import React from 'react';
import { GameState } from '../../../common/game';
import Popover from '../../pawn-promotion-popover/popover';
import { MovesHelper } from '../../../common/moves-helper';

export default class AlertsComponent extends React.Component<
    { gameState: GameState; x: number; y: number; pixelSize: number },
    any
> {
    render() {
        const { gameState, x, y, pixelSize } = this.props;
        const isKingInCheck = MovesHelper.isKingInCheck(
            gameState.turn,
            gameState.board
        );

        return (
            <Popover
                show={true}
                onClose={() => {}}
                coord={{
                    x: x + 275 * pixelSize,
                    y: y + 350 * pixelSize,
                }}
            >
                <div
                    className="grid"
                    style={{ background: 'white', padding: '3em' }}
                >
                    {isKingInCheck
                        ? `checkmate ${gameState.turn} king`
                        : 'draw by stalemate'}
                </div>
            </Popover>
        );
    }
}

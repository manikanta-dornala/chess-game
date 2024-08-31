import React, { useState } from 'react';
import './App.css';
import ChessComponent from './components/chess/chess';
import { ChessColor } from './common/enums';
import { RandomBot } from './common/bots/random-bot';
import Select, {
    components,
    ControlProps,
    Props,
    StylesConfig,
} from 'react-select';

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            resetKey: 0,
        };
    }

    handleReset = () => {
        this.setState((prevState: any) => ({
            resetKey: prevState.resetKey + 1, // Change the key to force a component restart
        }));
    };

    render() {
        const { resetKey } = this.state;

        return (
            <div className="Chess">
                <span>
                    <button onClick={this.handleReset}>New Game</button>
                </span>

                <hr />
                <ChessComponent
                    bot={new RandomBot(ChessColor.Dark)}
                    bottomColor={ChessColor.Light}
                    id={resetKey}
                />
            </div>
        );
    }
}

export default App;

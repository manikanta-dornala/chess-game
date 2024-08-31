import React, { useState } from 'react';
import './App.css';
import ChessComponent from './components/chess/chess';
import { ChessColor } from './common/enums';
import { RandomBot } from './common/bots/random-bot';
function App() {
    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => {
        setResetKey((prevKey) => prevKey + 1); // Change the key to force a component restart
    };
    return (
        <div className="Chess">
            <button onClick={handleReset}>New Game</button>
            <hr></hr>
            <ChessComponent
                bot={new RandomBot(ChessColor.Dark)}
                bottomColor={ChessColor.Light}
                id={resetKey}
            ></ChessComponent>
        </div>
    );
}

export default App;

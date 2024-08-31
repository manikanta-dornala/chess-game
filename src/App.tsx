import React from 'react';
import ChessComponent from './components/chess/chess';
import { ChessColor } from './common/enums';
import { RandomBot } from './common/bots/random-bot';
import Select, { SingleValue } from 'react-select';
import { Bot, BotConstructor } from './common/bots/bot';
import './App.css';

interface IAppState {
    resetKey: number;
    showNewGameSelectionUI: boolean;
    selectedBotOption: IBotOptions;
    selectedTurnOption: ITurnOptions;
    bot: Bot | null;
}

interface IBotOptions {
    label: string;
    value: BotConstructor | null;
}
interface ITurnOptions {
    label: ChessColor;
    value: ChessColor;
}
class App extends React.Component<any, IAppState> {
    botOptions: IBotOptions[] = [
        { label: 'No Bot', value: null },
        {
            label: 'Random',
            value: RandomBot,
        },
    ];
    turnOptions: ITurnOptions[] = [
        { label: ChessColor.Light, value: ChessColor.Light },
        { label: ChessColor.Dark, value: ChessColor.Dark },
    ];

    constructor(props: any) {
        super(props);
        const selectedTurn = this.turnOptions[0].value;
        const selectedBot = this.botOptions[0].value;
        this.state = {
            resetKey: 0,
            showNewGameSelectionUI: false,
            selectedTurnOption: this.turnOptions[0],
            selectedBotOption: this.botOptions[0],
            bot: selectedBot ? new selectedBot(selectedTurn) : null,
        };
        this.toggleNewGameUI = this.toggleNewGameUI.bind(this);
        this.handleBotOptionChange = this.handleBotOptionChange.bind(this);
        this.handleTurnOptionChange = this.handleTurnOptionChange.bind(this);
        this.handleStartNewGame = this.handleStartNewGame.bind(this);
    }

    handleStartNewGame = () => {
        const bot = this.getBot();
        this.setState((state: IAppState) => {
            state.resetKey += 1;
            state.showNewGameSelectionUI = false;
            state.bot = bot;
            return state;
        });
    };

    render() {
        const {
            resetKey,
            showNewGameSelectionUI,
            selectedTurnOption,
            selectedBotOption,
            bot,
        } = this.state;

        return (
            <div className="Chess">
                <div style={{ display: 'flex' }}>
                    <button
                        onClick={this.toggleNewGameUI}
                        disabled={showNewGameSelectionUI}
                    >
                        New Game
                    </button>

                    {showNewGameSelectionUI && (
                        <div
                            style={{
                                paddingLeft: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                zIndex: 1000,
                            }}
                        >
                            <label style={{ marginRight: '10px' }}>Bot:</label>
                            <Select
                                options={this.botOptions}
                                value={selectedBotOption}
                                onChange={this.handleBotOptionChange}
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        flex: 1, // Make the Select component flexible in width
                                    }),
                                }}
                            ></Select>
                        </div>
                    )}

                    {showNewGameSelectionUI && (
                        <div
                            style={{
                                paddingLeft: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                zIndex: 1000,
                            }}
                        >
                            <label style={{ marginRight: '10px' }}>
                                Your Color:
                            </label>
                            <Select
                                options={this.turnOptions}
                                placeholder={'Your Color'}
                                value={selectedTurnOption}
                                onChange={this.handleTurnOptionChange}
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        flex: 1, // Make the Select component flexible in width
                                    }),
                                }}
                            ></Select>
                        </div>
                    )}
                    {showNewGameSelectionUI && (
                        <button
                            style={{
                                marginLeft: '10px',
                            }}
                            onClick={this.handleStartNewGame}
                        >
                            Start
                        </button>
                    )}

                    <div
                        hidden={showNewGameSelectionUI}
                        className="selected-options"
                    >
                        Bot: {selectedBotOption.label}, Your Color:{' '}
                        {selectedTurnOption.label}
                    </div>
                </div>
                <ChessComponent
                    bot={bot}
                    bottomColor={selectedTurnOption.value}
                    id={resetKey}
                />
            </div>
        );
    }

    toggleNewGameUI() {
        this.setState((currState: any) => {
            currState.showNewGameSelectionUI = true;
            return currState;
        });
    }

    handleBotOptionChange(newValue: SingleValue<IBotOptions>) {
        this.setState((state: IAppState) => {
            state.selectedBotOption = newValue!;
            return state;
        });
    }

    handleTurnOptionChange(newValue: SingleValue<ITurnOptions>) {
        this.setState((state: IAppState) => {
            state.selectedTurnOption = newValue!;
            return state;
        });
    }

    getBot() {
        if (
            this.state.selectedBotOption &&
            this.state.selectedBotOption.value
        ) {
            const botTurn =
                this.state.selectedTurnOption.value === ChessColor.Light
                    ? ChessColor.Dark
                    : ChessColor.Light;
            const BotClass = this.state.selectedBotOption.value;
            const bot = new BotClass(botTurn);
            return bot;
        }
        return null;
    }
}

export default App;

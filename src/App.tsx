import React from 'react';
import './App.css';
import {ColorArray, Puzzle} from "./Puzzle";
import {GameState} from "./Game";


const App: React.FC = () => {
    const [Won, setWon] = React.useState(false);
    const passcode = process.env.REACT_APP_PASSCODE;

    const game = Puzzle.instance;
    game.startGameLoop();

    const colors = [...ColorArray];
    colors.push(colors.shift()!);

    const interval = setInterval(() => {
            if (game.state === GameState.Won) {
                clearInterval(interval)
                setWon(true);
                console.log("You won!")
            }
            game.render();
        }
        , 400);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Puzzle</h1>
                {Won && <><h2>You won! Secret passcode is </h2> <h2>{passcode}</h2></>}
                <div style={{display: 'flex', flexDirection: 'row', padding: 10, margin: 20}}>
                    {colors.map((color, index) => {
                        return <div key={index} style={{width: '50px', height: '50px', backgroundColor: color}}/>
                    })}
                </div>
                <img src="/windows.png" alt="windows" style={{maxHeight: "50vh"}}></img>
            </header>
        </div>
    );
}

export default App;

import React, { Component, createRef, useRef } from "react";
import styles from './game.module.css';
import Timer from "./timer";

class Game extends Component {
	constructor(props) {
        super(props);
        this.inputRef = createRef();
        this.state = {
            prompt: ["The", " ", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"],
            testContent: "The quick brown fox jumps over the lazy dog",

            userInput: "",
            correctChars: 0,
            errorCnt: 0,
            startedOnce: false,
            started: false,
            finished: false,

            startTimeFrom: 10,

            timerKey: 0,
            wpm: 0,

            status: props.status
        }}

    timerStartFunc(time) {
        this.setState({
            startTimeFrom: time,
        });
    }

    startGame(){
        this.setState({
            startedOnce: true,
            started: true
        })
    }

    handleUserInputChange(e){
        this.setState({
            userInput: e.target.value
        })
    }

	render(){
		return(
			<div className={styles.gameWrapper}>
                <h3>Rapid Keys</h3>
                {!this.state.startedOnce ? <button onClick={this.startGame.bind(this)}>Start Typing</button> : <button>Stop Test</button>}
                <div>
                    {this.state.started ? <Timer startTimeFrom={this.state.startTimeFrom} timerStartFunc={this.timerStartFunc.bind(this)} started={this.started}></Timer> : null}
                </div>
                {this.state.started && <div>
                    <div className={styles.promptContainer}>
                        {this.state.testContent.split('').map((ch, i) => {
                            let color;
                            if (i < this.state.userInput.length) {
                                color =
                                    ch === this.state.userInput[i]
                                        ? '#197f0b'
                                        : '#a62626';
                            }
                            return (<span style={{ color: color }} key={i}>
                                {ch}
                            </span>
                            );
                        })}
                    </div>
                    <div>
                        <textarea
                            ref={this.inputRef}
                            className="test-input"
                            placeholder="Start typing..."
                            onChange={(e) => this.handleUserInputChange(e)}
                            autoFocus
                            cols="50"
                            rows="4"
                        ></textarea>
                    </div>
                </div>}
			</div>
		)
	}
}
 
export default Game;
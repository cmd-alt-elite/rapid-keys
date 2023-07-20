import React, { Component } from "react";
import styles from './game.module.css';
import Timer from "./timer";

class Game extends Component {
	constructor(props) {
        super(props);
        this.state = {
            prompt: ["The", " ", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"],
            textInput: "",

            correctChars: 0,
            errorCnt: 0,

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
            started: true,
        })
    }

	render(){
		return(
			<div className={styles.gameWrapper}>
                Hello
                <div className={styles.promptContainer}>
                    {this.state.prompt.map((word, key) => (
                        <span className={styles.styling} key={key}>
                            {/* {word.characters.map((character, index2) => (
                                <span className={styles.styling}>{character.character}</span>
                            ))} */}
                            {word}
                        </span>
                    ))}
                </div>
                <div>
                    {this.state.started ? <Timer startTimeFrom={this.state.startTimeFrom} timerStartFunc={this.timerStartFunc.bind(this)}></Timer> : null}
                </div>
                <button onClick={this.startGame.bind(this)}></button>
			</div>
		)
	}
}
 
export default Game;
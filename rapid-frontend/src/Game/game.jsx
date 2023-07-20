import React, { Component, createRef } from "react";
import { generate } from "random-words";
import styles from './game.module.css';
import Timer from "./timer";
import { useParams } from "react-router-dom";
import { socket } from "../Socket/sockets";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class Game extends Component {
	constructor(props) {
        super(props);
        this.inputRef = createRef();
        this.state = {
            testContent: "The quick brown fox jumps over the lazy dog",

            userInput: "",
            correctChars: 0,
            errorCnt: 0,
            startedOnce: false,
            started: false,
            finished: false,

            currentWPM: 0,
            finalWPM: 0,

            timerKey: 0,

            status: props.status
        }
    }

    componentDidMount(){
        socket.on("game_start", (leBool)=>{
            console.log(leBool);
            console.log("this confirms that you are loser");
        })
        let { id } = this.props.params;
        const material =  generate({exactly: 25, join: " ", seed: id});
        console.log(material)
        console.log(id)
        this.setState({
            testContent: material,
        });
    }

    startGame(){
        // console.log(this.state.startTimeFrom);
        this.setState({
            startedOnce: true,
            started: true,
            finished: false,
        })
    }

    updateTempWPM(nextState) {
        this.setState({currentWPM: nextState});
      }

    handleUserInputChange(e){
        this.setState({
            userInput: e.target.value
        })
        if(e.target.value === this.state.testContent){
            
            this.inputRef.current.value = "";
            
            this.setState({
                started: false,
                finished: true,
                userInput: ""
            })
            // calculate wpm
            // navigate 
        }
            
        
    }

	render(){
		return(
			<div className={styles.gameWrapper}>
                <h3>Rapid Keys</h3>
                {!this.state.startedOnce ? <button onClick={this.startGame.bind(this)}>Start Typing</button>: null}
                <div>
                    {this.state.startedOnce ? <Timer finished={this.state.finished} started={this.started} userInput={this.state.userInput} updateTempWPM={this.updateTempWPM}></Timer> : null}
                </div>
                {this.state.startedOnce && 
                <div className={styles.testWrapper}>
                    <div>
                        <input
                            ref={this.inputRef}
                            className={styles.testInput}
                            placeholder="Start typing..."
                            onChange={(e) => this.handleUserInputChange(e)}
                            autoFocus
                        ></input>
                    </div>
                    <div className={styles.promptContainer}>
                        {this.state.testContent.split('').map((ch, i) => {
                            let color;
                            if (i < this.state.userInput.length) {
                                // ch === this.state.userInput[i] ? this.setState({correctChars: this.state.correctChars+1}) : this.setState({errorCnt: this.state.errorCnt+1});
                                color =
                                    ch === this.state.userInput[i]
                                        ? '#34d61e'
                                        : '#d91818';
                            }
                            return (<span style={{ backgroundColor: color }} key={i}>
                                {ch}
                            </span>
                            );
                        })}
                    </div>
                    
                </div>}
                <div>{this.state.currentWPM}</div>
                {this.state.finished && <button onClick={()=>{window.location.reload(false)}}>New Test</button>}
			</div>
		)
	}
}
 
export default withParams(Game);
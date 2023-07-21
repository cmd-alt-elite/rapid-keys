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
            errorCnt: 0,
            startedOnce: false,
            started: false,
            finished: false,
            readyToPlay: false,
            timeTillBegin: 5,

            currentWPM: 0,
            finalWPM: 0,

            timerKey: 0,
            canStart: false,

            status: props.status
            
        }
    }

    componentDidMount(){
        socket.on("game_start", (leBool)=>{
            console.log("this confirms that you are loser");
            console.log(this.state.timeTillBegin);
            this.setState({readyToPlay: true});
            setTimeout(()=>{
                setInterval(()=>{
                    this.setState((prevState)=>{return{timeTillBegin: prevState.timeTillBegin-1}})
                },1000)
                this.setState({
                startedOnce: leBool,
                started: leBool,
                finished: !leBool,
            })
        }, 5000) 
        })

        socket.on("player_joined", (players)=>{
            console.log("players in this room are : " + players);
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
        this.setState({
            startedOnce: true,
            started: true,
            finished: false,
        })
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
        }
    }

	render(){
		return(
			<div className={styles.gameWrapper}>
                <h3>rapid keys</h3>
                {!this.state.startedOnce ? <div className={styles.wait}>
                    The game will start in 30 seconds or as soon as 4 players have joined the room.
                    </div>: null
                }
                {
                    !this.state.startedOnce && this.state.readyToPlay && <div className={styles.isReady}>The game will start in {this.state.timeTillBegin} seconds.</div>
                }
                <div>
                    {this.state.startedOnce ? <Timer finished={this.state.finished} started={this.started} userInput={this.state.userInput} updateTempWPM={this.updateTempWPM}></Timer> : null}
                </div>
                {this.state.startedOnce && 
                <div className={styles.testWrapper}>
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
                    <div className={styles.inputContainer}>
                        <input
                            ref={this.inputRef}
                            className={styles.testInput}
                            placeholder="Start typing here..."
                            onChange={(e) => this.handleUserInputChange(e)}
                            autoFocus
                        ></input>
                    </div>
                </div>}
                {this.state.finished && <button onClick={()=>{window.location.reload(false)}}>New Test</button>}
			</div>
		)
	}
}
 
export default withParams(Game);
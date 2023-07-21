import React, { Component, createRef } from "react";
import { generate } from "random-words";
import styles from './solo.module.css';
import Timer from "./timer";
import { useParams } from "react-router-dom";
import { socket } from "../Socket/sockets";
import NewGameBtn from "./newBtn";
import ProgressBar from 'react-bootstrap/ProgressBar';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class Solo extends Component {
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
            readyToPlay: true,
            timeTillBegin: 5,

            currentWPM: 0,
            finalWPM: 0,

            timerKey: 0,
            canStart: false,
            players : null,

            status: props.status
            
        }
    }

    componentDidMount(){
            console.log("this confirms that you are loser");
            console.log(this.state.timeTillBegin);
            this.setState({readyToPlay: true});
            setTimeout(()=>{
                this.setState({
                startedOnce: true,
                started: false,
                finished: true,
            })
        }, 5000) 
            var leInterval = setInterval(()=>{
                const updatedTime = this.state.timeTillBegin - 1;
                console.log(updatedTime);
                this.setState({timeTillBegin: updatedTime})
                if(updatedTime <= 0){clearInterval(leInterval)}
            },1000)
        

        let { id } = this.props.params;
        const material =  generate({exactly: 25, join: " "});
        console.log(material)
        console.log(id)
        this.setState({
            testContent: material,
        });
    }

    componentDidUpdate(){
        console.log(100*this.state.userInput.length/this.state.testContent.length);
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
                started: true,
                finished: false,
                userInput: "",
                startedOnce : true,
            })
        }
    }

	render(){
		return(
			<div className={styles.gameWrapper}>
                <h3>rapid keys : solo</h3>
                {/* {!this.state.startedOnce ? <div className={styles.wait}>
                    The game will start in 30 seconds or as soon as 4 players have joined the room.
                    </div>: null
                } */}
                {
                    !this.state.startedOnce && <div className={styles.isReady}>The game will start in <strong>{this.state.timeTillBegin}</strong> seconds.</div>
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
                                
                                color =
                                    ch === this.state.userInput[i]
                                        ? '#5a5c69'
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
                    Hello
                    {/* 100*this.state.userInput.length/this.state.testContent.length */}
                    {this.state.userInput.length && <ProgressBar now={60}/>}
                <div>
                    {this.state.players && this.state.players.map((name, key) => {
                        return (<p key={name.username}>{name}</p>)
                    })}
                </div>
                </div>}
                {!this.state.finished && <NewGameBtn/>}
			</div>
		)
	}
}
 
export default withParams(Solo);
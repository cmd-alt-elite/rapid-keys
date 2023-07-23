import React, { Component, createRef } from "react";
import styles from './game.module.css';
import Timer from "./timer";
import { useParams } from "react-router-dom";
import { socket } from "../Socket/sockets";
import NewGameBtn from "./newBtn";
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function withParams(Component) {
    
  return props => <Component {...props} params={useParams()} />;
}

// TODO: solo difficulty
// TODO: show accuracy to others
// TODO: switch to time based system instead of completion based?
// TODO: choose #players

class Game extends Component {
	constructor(props) {
        super(props);
        this.inputRef = createRef();
        this.state = {
            testContent: "",
            userInput: "",
            errorCnt: 0,
            correctCnt: 0,

            startedOnce: false,
            started: false,
            finished: false,
            readyToPlay: false,

            timeTillBegin: 5,

            progress: null,
            players : null,
            stats: null,
        }
    }

    componentDidMount(){
        socket.on("game_start", (text)=>{
            console.log(text);
            this.setState({
                readyToPlay: true,
                testContent: text
            });
            setTimeout(()=>{
                this.setState({
                startedOnce: true,
                started: true,
                finished: false,
            })
        }, 5000) 
            var leInterval = setInterval(()=>{
                const updatedTime = this.state.timeTillBegin - 1;
                this.setState({timeTillBegin: updatedTime})
                if(updatedTime <= 0){clearInterval(leInterval)}
            },1000)
        })
        socket.on("player_joined", (name)=>{
            var playersParsed = JSON.parse(name);
            this.setState({players : playersParsed});
          })
    }

    componentDidUpdate(){
        socket.emit("send_progress", {progress: Math.min(Math.round(100*(this.state.userInput.length+this.state.errorCnt)/(this.state.testContent.length+this.state.errorCnt)), 100)})
        socket.on("receive_progress", (progress)=>{
            var progressParsed = JSON.parse(progress);
            this.setState({progress: progressParsed});
        })
        socket.on("receive_stats", (stats)=>{
            var statsParsed = JSON.parse(stats);
            this.setState({stats: statsParsed});
        })
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

        if(e.target.value.slice(-1) !== this.state.testContent[e.target.value.length-1]){
            var updateErrCnt = this.state.errorCnt;
            this.setState({
                errorCnt: updateErrCnt+1
            })
        }

        if(e.target.value === this.state.testContent){
            this.inputRef.current.disabled = true;
            this.setState({
                started: false,
                finished: true,
            })
        }
    }

	render(){
		return(
            
			<div className={styles.gameWrapper}>
                <h3>rapid keys</h3>
                {!this.state.startedOnce ? <div className={styles.wait}>
                    The game will start in 30 seconds or as soon as 3 players have joined the room.
                    </div>: null
                }
                <div>
                    {this.state.startedOnce ? <Timer finished={this.state.finished} started={this.started} userInput={this.state.userInput} updateTempWPM={this.updateTempWPM}></Timer> : null}
                </div>
                {
                    !this.state.startedOnce && <div className={styles.playersHead}>Players in Lobby</div>
                }
                {
                    !this.state.startedOnce && this.state.players &&
                    this.state.players.map((name) => {
                        return (<div className={styles.playersWrap}> 
                            <p key={name.username} className={styles.playersInLobby}>{name.username}</p>
                        </div>)
                    })
                }
                {
                    !this.state.startedOnce && this.state.readyToPlay && <div className={styles.isReady}><strong>{this.state.timeTillBegin}</strong></div>
                }
                
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
                    {this.state.startedOnce && this.state.progress && this.state.progress.map((progress)=>{return(
                        <div className={styles.progressBarWrap}>
                            <div className={styles.username-progress}>
                            {progress.username}  
                            </div>
                            <div className={styles.sthYaar}>
                                <ProgressBar now={progress.progress} striped animated = "true" className={styles.progress}/>
                            </div>
                        </div>
                    )})}
                </div>}
                {
                    this.state.finished && this.state.stats && <div className={styles.leadHead}>Results</div>
                }
                {
                    this.state.finished && <div className={styles.accuracy}>Accuracy: {(100*(1-(this.state.errorCnt/this.state.testContent.length))).toFixed(2)}%</div>
                }
                {this.state.finished && this.state.stats &&
                    this.state.stats.map((stat)=>{
                        if(stat.wpm !== -1){
                            return (<div className={styles.leaderboard}>
                                {stat.username}: {stat.wpm}
                            </div>)
                        }else{return null}
                    })
                }
                {this.state.finished && <NewGameBtn/>}
			</div>
		)
	}
}
 
export default withParams(Game);
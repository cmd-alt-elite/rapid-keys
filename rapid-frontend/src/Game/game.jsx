import React, { Component, createRef } from "react";
import styles from './game.module.css';
import Timer from "./timer";
import { useParams } from "react-router-dom";
import { socket } from "../Socket/sockets";
import NewGameBtn from "./newBtn";
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Btns from "./btns";

function withParams(Component) {
    
  return props => <Component {...props} params={useParams()} />;
}

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
            isInRoom: props.isInRoom,

            backOver: false,
        }
    }

    componentDidMount(){
        if(!this.props.isInRoom){
            window.location.replace("/online");
        }
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
        socket.on("receive_progress", (progress)=>{
            var progressParsed = JSON.parse(progress);
            this.setState({progress: progressParsed});
        })
        socket.on("receive_stats", (stats)=>{
            var statsParsed = JSON.parse(stats);
            this.setState({stats: statsParsed});
        })
        socket.on("game_end", (leBool)=>{
            this.setState({backOver: leBool});
            console.log(leBool);
        })
    }

    preventCopyPaste = (e) => {
        e.preventDefault();
      }
        
    startGame = () => {
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
        
        if(this.state.backOver === true){
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
                    <Btns></Btns>
                    </div>: null
                }
                <div>
                    {this.state.startedOnce ? <Timer finished={this.state.finished} started={this.started} errorCnt={this.state.errorCnt} userInput={this.state.userInput} testContent={this.state.testContent}></Timer> : null}
                </div>
                {
                    this.state.finished && <div className={styles.accuracy}>Accuracy: {(100*(1-(this.state.errorCnt/this.state.testContent.length))).toFixed(2)}%</div>
                }
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
                            onPaste={(e) => this.preventCopyPaste(e)}
                            autoFocus
                        ></input>
                    </div>
                    {this.state.startedOnce && this.state.progress && this.state.progress.map((progress)=>{return(
                        <div className={styles.progressBarWrap}>
                            <div className={styles.usernameProgress}>
                            {progress.username}:
                            </div>
                            <div className={styles.sthYaar}>
                                <ProgressBar now={progress.progress} striped animated = "true" className={styles.progress}/> 
                            </div>
                            <div className={styles.currentWpm}>
                                <b>{progress.current_wpm}wpm</b>
                            </div>
                        </div>
                    )})}
                </div>}
                {
                    this.state.finished && this.state.stats && <div className={styles.leadHead}><strong>Results</strong></div>
                }
                {this.state.finished && this.state.stats &&
                    this.state.stats.map((stat)=>{
                        if(stat.wpm !== -1){
                            return (<div className={styles.leaderboard}>
                                {stat.username}: <b>{stat.wpm}wpm</b> and <b>{stat.accuracy}%</b> accuracy
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
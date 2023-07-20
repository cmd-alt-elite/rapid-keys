import React, { Component, createRef } from "react";
import { generate } from "random-words";
import styles from './game.module.css';
import Timer from "./timer";
import { useParams } from "react-router-dom";

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

            timerKey: 0,
            wpm: 0,

            status: props.status
        }}

    componentDidMount(){
        let { id } = this.props.params;
        const material =  generate({exactly: 25, join: " ", seed: id});
        console.log(material)
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

    handleUserInputChange(e){

        this.setState({
            userInput: e.target.value
        })
        // if(e.target.value.slice(-1) === "$"){
            if(e.target.value === this.state.testContent){
                
                this.inputRef.current.value = ""; 
                
                console.log(this.state.correctChars);
                
                // console.log(this.state.userInput);
                // console.log(this.state.testContent);
                
                // console.log(this.state.userInput === this.state.testContent);
                this.setState({
                    started: false,
                    finished: true,
                    userInput: ""
                })
                // get incorrect and correct count
                // calculate wpm
                // navigate 
            }
            
        // }
        
    }

	render(){
		return(
			<div className={styles.gameWrapper}>
                <h3>Rapid Keys</h3>
                {!this.state.startedOnce ? <button onClick={this.startGame.bind(this)}>Start Typing</button>: null}
                <div>
                    {this.state.startedOnce ? <Timer finished={this.state.finished} startTimeFrom={this.state.startTimeFrom} started={this.started}></Timer> : null}
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
                                        ? '#197f0b'
                                        : '#a62626';
                            }
                            return (<span style={{ color: color }} key={i}>
                                {ch}
                            </span>
                            );
                        })}
                    </div>
                    
                </div>}
                {this.state.finished && <button onClick={()=>{window.location.reload(false)}}>New Test</button>}
			</div>
		)
	}
}
 
export default withParams(Game);
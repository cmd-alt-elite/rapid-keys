import React, { Component, createRef } from "react";
import { generate } from "random-words";
import styles from './solo.module.css';
import Timer from "./timer";
import { useParams } from "react-router-dom";
import NewGameBtn from "./newBtn";
import ProgressBar from 'react-bootstrap/ProgressBar';
import HomeBtn from "./homeBtn";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class Solo extends Component {
	constructor(props) {
        super(props);
        this.inputRef = createRef();
        this.state = {
            soloText: props.soloText,
            testContent: "",

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
                this.setState({timeTillBegin: updatedTime})
                if(updatedTime <= 0){clearInterval(leInterval)}
            },1000)
        

        let { id } = this.props.params;
        const material =  generate({exactly: 25, join: " "});
        console.log(material)
        console.log(id)
        if(!this.props.soloText){
            this.setState({
                testContent: material,
            });
        }
        else{
            this.setState({
                testContent: this.props.soloText
            })
        }  
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
                started: true,
                finished: false,
            })
        }
    }

	render(){
		return(
			<div className={styles.gameWrapper}>
                <h3>rapid keys : solo</h3>
                {
                    !this.state.startedOnce && <div className={styles.isReady}><strong>{this.state.timeTillBegin}</strong></div>
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
                    {
                        !this.state.finished && <div class={styles.accuracy}><b>Accuracy: {(100*(1-(this.state.errorCnt/this.state.testContent.length))).toFixed(2)}%</b></div>
                    }
                    {this.state.startedOnce && 
                    <div className={styles.progressWrap}>
                        <div className={styles.progress}>
                            <ProgressBar now={100*this.state.userInput.length/this.state.testContent.length}/>
                        </div>
                    </div>}
                </div>}
                {this.state.startedOnce && <NewGameBtn/>}
                 <HomeBtn/>
			</div>
		)
	}
}
 
export default withParams(Solo);
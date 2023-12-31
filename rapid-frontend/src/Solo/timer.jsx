import React, { Component } from 'react';
import styles from "./solo.module.css";
import axios from 'axios';
import { useParams } from "react-router-dom";

function withParams(Component) {
	return props => <Component {...props} params={useParams()} />;
}
class Timer extends Component{
	constructor(props) {
        super(props);
        this.state = {
            timerOn: false,
            timerStart: 0,
			started: props.started,
			finished: props.finished,
            timerTime: 0,
			userInput: props.userInput,
			currentWPM: 0,
			finalWPM: 0,
			id: this.props.params.id
        }
		this.baseState = this.state;
    }

	componentDidMount(){
		this.startTimer();
	}

	componentWillUnmount(){
		clearInterval(this.timer);
	}

	componentDidUpdate(prevProps, prevState){
		if(this.props.finished !== prevProps.finished){
			console.log(this.state.id);
			console.log(this.state.currentWPM);
			axios.post(`https://rapid-keys-back.onrender.com/solo`, {
                username: this.state.id,
				wpm: this.state.currentWPM
            }).catch((e)=>{console.log(e)})
			clearInterval(this.timer);
			this.setState({
				timerOn: false,
				timerStart: 0,
			});
		}
		if(this.state.timerTime !== prevState.timerTime){
			this.setState({currentWPM: Math.round(12000*this.props.userInput.length/(this.state.timerTime))});
		}
	}


	startTimer = () => {
		this.setState({
			timerOn: true,
			timerTime: this.state.timerTime,
			timerStart: this.state.timerTime
		});
		this.timer = setInterval(()=>{
			const updatedTime = this.state.timerTime + 50;

			this.setState({
				timerTime: updatedTime
			});
		}, 50)
	}

	render(){
		return(
			<div className={styles.timer}>
				<div className="countdown">Timer: {Math.floor(this.state.timerTime/1000)}</div>
				<br />
				<div>WPM: {this.state.currentWPM}</div>
			</div>
		)
	}
}

export default withParams(Timer);
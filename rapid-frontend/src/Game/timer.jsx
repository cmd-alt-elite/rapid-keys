import React, { Component } from 'react';

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
			finalWPM: 0
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
			// else{
				// console.log("Test Over")
				// clearInterval(this.timer);
				// this.setState(this.baseState);
				// this.state.timerStartFunc(this.state.timerTime);
			// }
			
		}, 50)
	}
	render(){
		return(
			<div>
				<div className="countdown">Timer: {Math.floor(this.state.timerTime/1000)}</div>
				<br />
				<div>WPM: {this.state.currentWPM}</div>
			</div>
		)
	}
}

export default Timer;
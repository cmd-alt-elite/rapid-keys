import React, { Component } from 'react';

class Timer extends Component{
	constructor(props) {
        super(props);
        this.state = {
            timerOn: false,
            timerStart: 0,
            timerTime: 1000 * props.startTimeFrom,
            timerStartFunc: props.timerStartFunc,
        }
    }

	componentDidMount(){
		console.log(this.state.timerTime);
		this.startTimer();
	}

	startTimer = () => {
		
		this.setState({
			timerOn: true,
			timerTime: this.state.timerTime,
			timerStart: this.state.timerTime
		});
		this.timer = setInterval(()=>{
			const updatedTime = this.state.timerTime - 1000;
			if(updatedTime >= 0){
				this.setState({
					timerTime: updatedTime
				});
			}else{
				clearInterval(this.timer);
				this.setState({timerOn:false});
				this.state.timerStartFunc(this.state.timerTime);
			}
			
		}, 1000)
	}
	render(){
		return(
			<div className="countdown">hello {Math.floor(this.state.timerTime/1000)}</div>
		)
	}
}

export default Timer;
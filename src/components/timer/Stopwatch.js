import React, { Component } from "react";
import "./App.css";
import { Button,  Text} from '@chakra-ui/react'

class Stopwatch extends Component {
  state = {
    timerOn: false,
    timerStart: 0,
    timerTime: 0
  };

  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: Date.now() - this.state.timerTime
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart
      });
    }, 10);
  };

  stopTimer = () => {
    this.setState({ timerOn: false });
    clearInterval(this.timer);
  };

  resetTimer = () => {
    this.setState({
      timerStart: 0,
      timerTime: 0
    });
  };

  render() {
    const { timerTime } = this.state;
    let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
    return (
      <div className="Stopwatch">
        <div className="Stopwatch-header">Stopwatch</div>

        <Text fontSize='4xl'>{hours} : {minutes} : {seconds} : {centiseconds}</Text>
        {this.state.timerOn === false && this.state.timerTime === 0 && (
          <Button colorScheme='green' onClick={this.startTimer}>Start</Button>
        )}
        {this.state.timerOn === true && (
          <Button colorScheme='red' onClick={this.stopTimer}>Stop</Button>
        )}
        {this.state.timerOn === false && this.state.timerTime > 0 && (
          <Button colorScheme='blue' onClick={this.startTimer}>Resume</Button>
        )}
        {this.state.timerOn === false && this.state.timerTime > 0 && (
          <Button onClick={this.resetTimer}>Reset</Button>
        )}
      </div>
    );
  }
}

export default Stopwatch;
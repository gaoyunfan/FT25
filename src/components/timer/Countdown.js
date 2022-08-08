import React, { Component } from "react";
import "./App.css";
import { Button,  Text} from '@chakra-ui/react'

class Countdown extends Component {
  state = {
    timerOn: false,
    timerStart: 0,
    timerTime: 0
  };

  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: this.state.timerTime
    });
    this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 10;
      if (newTime >= 0) {
        this.setState({
          timerTime: newTime
        });
      } else {
        clearInterval(this.timer);
        this.setState({ timerOn: false });
        alert("Countdown ended");
      }
    }, 10);
  };

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({ timerOn: false });
  };
  resetTimer = () => {
    if (this.state.timerOn === false) {
      this.setState({
        timerTime: this.state.timerStart
      });
    }
  };

  adjustTimer = input => {
    const { timerTime, timerOn } = this.state;
    if (!timerOn) {
      if (input === "incHours" && timerTime + 3600000 < 216000000) {
        this.setState({ timerTime: timerTime + 3600000 });
      } else if (input === "decHours" && timerTime - 3600000 >= 0) {
        this.setState({ timerTime: timerTime - 3600000 });
      } else if (input === "incMinutes" && timerTime + 60000 < 216000000) {
        this.setState({ timerTime: timerTime + 60000 });
      } else if (input === "decMinutes" && timerTime - 60000 >= 0) {
        this.setState({ timerTime: timerTime - 60000 });
      } else if (input === "incSeconds" && timerTime + 1000 < 216000000) {
        this.setState({ timerTime: timerTime + 1000 });
      } else if (input === "decSeconds" && timerTime - 1000 >= 0) {
        this.setState({ timerTime: timerTime - 1000 });
      }
    }
  };

  render() {
    const { timerTime, timerStart, timerOn } = this.state;
    let seconds = ("0" + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor((timerTime / 3600000) % 60)).slice(-2);

    return (
      <div className="Countdown">
        <div className="Countdown-header">Countdown</div>
        <div className="Countdown-label">Hours : Minutes : Seconds</div>
        <div className="Countdown-display">
          <Button colorScheme='teal' size='xs' onClick={() => this.adjustTimer("incHours")}>+</Button>
          <Button colorScheme='teal' size='xs' onClick={() => this.adjustTimer("incMinutes")}>
            +
          </Button>
          <Button colorScheme='teal' size='xs' onClick={() => this.adjustTimer("incSeconds")}>
            +
          </Button>

          <Text fontSize='4xl'>{hours} : {minutes} : {seconds}</Text>
            
          

          <Button colorScheme='teal' size='xs' onClick={() => this.adjustTimer("decHours")}> - </Button>
          <Button colorScheme='teal' size='xs' onClick={() => this.adjustTimer("decMinutes")}>
            -
          </Button>
          <Button colorScheme='teal' size='xs' onClick={() => this.adjustTimer("decSeconds")}>
            -
          </Button>
        </div>

        {timerOn === false && (timerStart === 0 || timerTime === timerStart) && (
          <Button colorScheme='green' className="Button-start" onClick={this.startTimer}>
            Start
          </Button>
        )}
        {timerOn === true && timerTime >= 1000 && (
          <Button colorScheme='red' className="Button-stop" onClick={this.stopTimer}>
            Stop
          </Button>
        )}
        {timerOn === false &&
          (timerStart !== 0 && timerStart !== timerTime && timerTime !== 0) && (
            <Button colorScheme='blue' className="Button-start" onClick={this.startTimer}>
              Resume
            </Button>
          )}

        {(timerOn === false || timerTime < 1000) &&
          (timerStart !== timerTime && timerStart > 0) && (
            <Button  className="Button-reset" onClick={this.resetTimer}>
              Reset
            </Button>
          )}
      </div>
    );
  }
}

export default Countdown;
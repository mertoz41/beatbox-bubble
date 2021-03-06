import React, {Component} from 'react'
import {ReactMic} from 'react-mic'
import { Button, Icon, Grid } from 'semantic-ui-react'

class Mic extends Component {
    state = {
        record: false,
        countDown: 5,
        chunk: [],
        timer: 5
    }
audioChunks = []
    
    record = () => { 
        if (this.state.record) {
            this.startRecord()
        } else {
            this.countDown(this.state.countDown)
        setTimeout(()=>{this.startRecord()}, this.state.countDown * 1000)
        }
    }
    countDown = (countDown) =>{
        let timeLeft = countDown
        let timer = setInterval(()=>{
            timeLeft --
            this.setState({timer: timeLeft})
            if (timeLeft <= 0){
                clearInterval(timer)
            }
        }, 1000)
    }

    startRecord = () =>{
        this.setState({ record: !this.state.record})
    }
     
    onData(recordedBlob) {
       
        console.log('chunk of real-time data is: ', recordedBlob);
    }
    
    onStop = (recordedBlob) => { 
        this.props.recordIncome(recordedBlob)
         
    }

    handleChange = (event) =>{
        this.setState({countDown: parseInt(event.target.value)
        })
         
    }
    displayTimer = (sec) =>{
        let string = sec.toString()
         
        return string
    }
    
    render(){
        let button
        if (this.state.record) {
            button = "stop"
        } else {
            button = "play"
        } 
        return(
            <div className="mic">
                <div className="timer">
                <h3>{this.state.timer}</h3>
                </div>
            <ReactMic
                record={this.state.record}
                className="sound-wave"
                onStop={this.onStop}
                onData={this.onData}
                strokeColor="#98FB98"
                backgroundColor= "#C0C0C0"/>
                <div className="select">
                <select value={this.state.countDown} onChange={this.handleChange}>
                    <option value="1">one</option>
                    <option value="2">two</option>
                    <option value="3">three</option>
                    <option value="4">four</option>
                    <option value="5">five</option>
                </select>
                </div>
                <div className="play-button">
                <Button icon onClick={this.record} type="button"><Icon name={button}/></Button>
                </div>
                
            </div>
        )
    }
}
export default Mic 
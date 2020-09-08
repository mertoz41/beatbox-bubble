import React,{Component} from 'react'
import { Button, Icon } from 'semantic-ui-react'


class TrackPlayer extends Component{
    state = {
        trackName: ""
    }

    resetState = () =>{
        this.setState({ trackName: ""})
        this.props.removeTrack()
    }

    playTrack = ()=>{
        console.log("experimenting")
         
        new Audio(this.props.recordedTrack.blobURL).play()
    }
    fixState = (event)=>{
        let trackName = event.target.value
        this.setState({trackName: trackName})
        console.log(trackName)
    }

    exportTrack = (event) =>{
        event.preventDefault()
        let track = this.props.recordedTrack
        let name = this.state.trackName
        track.name = name
        

        debugger 
         
        this.props.postTrack(track)
    }

    render(){
            return(
                <div className="trackPlayer">
                    <h3>Export track</h3>
                    <Button icon onClick={this.playTrack}><Icon name="play"/></Button>
                    <Button icon onClick={this.resetState}><Icon name="trash alternate"/></Button>
                    <form>
                        <input onChange={event=> this.fixState(event)} value={this.state.trackName} placeholder="track name goes here..."/>
                        <Button icon onClick={event=> this.exportTrack(event)}><Icon name="upload" /></Button>
                    </form>
                </div>
            )
        }
}

export default TrackPlayer
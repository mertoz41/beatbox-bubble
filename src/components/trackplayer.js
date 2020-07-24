import React,{Component} from 'react'
import { Button, Icon } from 'semantic-ui-react'


class TrackPlayer extends Component{
    state = {
        trackName: ""
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
        let name = this.state.trackName
        let trackObj = {
            [name]: this.props.recordedTrack.blobURL
        }
        this.props.postTrack(trackObj)
    }
    // render(){
    //     return(
    //         <div className="trackPlayer">
    //             <Button icon onClick={this.playTrack}><Icon name="play"/></Button>
    //             <form>
    //                 <input onChange={event=> this.fixState(event)} value={this.state.trackName} placeholder="track name goes here..."/>
    //                 <button type="submit" onClick={event => this.exportTrack(event)}>Share track</button>
    //             </form>
    //             trackplayer experimenting
    //         </div>
    //     )
    // }
    render(){
            return(
                <div className="trackPlayer">
                    <Button icon onClick={this.playTrack}><Icon name="play"/></Button>
                    <form>
                        <input onChange={event=> this.fixState(event)} value={this.state.trackName} placeholder="track name goes here..."/>
                        <button type="submit" onClick={event => this.exportTrack(event)}>Share track</button>
                    </form>
                    trackplayer experimenting
                </div>
            )
        }
}

export default TrackPlayer
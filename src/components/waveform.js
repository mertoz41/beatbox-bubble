import React, { Component } from 'react'
import WaveSurfer from 'wavesurfer.js';
import { Button, Icon } from 'semantic-ui-react'




class Waveform extends Component{

    state = {
        playing: false 
    }
    componentDidMount(){
        let id = this.props.track.id.toString()

         
        this.waveform = WaveSurfer.create({
            container: `#waveform-${id}`,
            scrollParent: true,
            backend: 'WebAudio',
            height: 90,
            progressColor: '#98FB98',
            responsive: true,
            waveColor: '#EFEFEF',
            cursorColor: 'transparent',
          });
           
          this.waveform.load(this.getBlob(this.props.track))
    }

    getBlob = (track) =>{
         
        let blob = `http://localhost:3000${track.blob}`
        return blob 
    }

    handlePlaying = () => {
        this.setState({ playing: !this.state.playing})
        this.waveform.playPause();

    }
    render(){ 
        let buttonName
        if (this.state.playing){
            buttonName = 'pause'
        } else {
            buttonName = 'play'
        }
        return(
            <div>
                    <div id={'waveform-' + this.props.track.id.toString()}/>
                    <div className="singlewaveform">
                    <Button icon onClick={this.handlePlaying}>
                        <Icon name={buttonName}/>
                    </Button>
                    </div>

                
        </div>

        )
    }
}

export default Waveform
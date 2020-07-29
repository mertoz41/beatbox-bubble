import React,{Component} from 'react'
import Pads from './pads'
import Mic from './mic'
import Controls from './controls'
import TrackPlayer from './trackplayer'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'


class Playlist extends Component{

    recordIncome = (record) =>{
        console.log(record)
        this.props.trackIncoming(record) 
    }

    render(){
        return(
            <div>
                {this.props.namedChannels.length < 1 ?
                null
                :
                <div>
                <Mic recordIncome={this.recordIncome}/>
                

                <Controls removePad={this.props.removePad} addPad={this.props.addPad} bpm={this.props.bpm} handleBpmChange={this.props.handleBpmChange} playing={this.props.playing} togglePlaying={this.props.togglePlaying} />
                </div>
                }
                <Pads mutedList={this.props.mutedList} mute={this.props.mute} namedChannels={this.props.namedChannels} pos={this.props.pos} pads={this.props.pads} toggleActive={this.props.toggleActive}/>
                <div>
                {this.props.recordedTrack ? 
                <div>
                <TrackPlayer removeTrack={this.props.removeTrack} postTrack={this.props.postTrack} recordedTrack={this.props.recordedTrack}/>
                </div>
                :
                null
                }
                <div className="playlist-modal">

                
                <Modal trigger={<Button icon><Icon name="info"/></Button>} basic size='small'>
                <Header icon='info' content='Playlist Instructions' />
                <Modal.Content>
                    <ul>
                        <li>Assigned patterns/samples will have their own channels</li>
                        <li>Toggle channel pads to activate pattern/sample sounds</li>
                        <li>Press play to start the sequencer</li>
                        <li>Adjust sequencer speed with BPM</li>
                        <li>Press Add/remove to add or remove a pad to all channels</li>
                        <li>Set the timer for when to record and start mixing!</li>
                </ul>

                </Modal.Content>
                </Modal>
                </div>
                
                </div>
            </div>
        )
    }
}

export default Playlist
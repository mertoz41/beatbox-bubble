import React,{Component} from 'react'
import Mic from './mic'
import Playlist from './playlist'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'



class Recorder extends Component{
    state = {
        records: [],
        recordName: "",
        recordNames: [],
        recordwBlobs: []
        }

    resetState = () =>{
        this.setState({recordName: "", records: []})
    }

    recordIncome = (record) =>{
        debugger 
        this.setState({records: [...this.state.records, record]})

    }

    assignRecord = (event) =>{
        let recordName = event.target.value
         
        this.setState({
            recordName: recordName
        })
    }

    addToPlaylist = (event, pattern) =>{
        
        event.preventDefault()
        let record = {}
        let name = this.state.recordName
        record[name] = pattern
        this.setState({recordwBlobs: [...this.state.recordwBlobs, record]})
        this.props.addPattern(record) 
        this.resetState()
    
    }

    playRecord = (sound) =>{
         
        new Audio(sound.blobURL).play()
    }
    playPatternRecord = (sound) =>{
        let audio = Object.values(sound)[0] 
        new Audio(audio.blobURL).play()
    }
    patternName = (pattern) =>{
        let name = Object.keys(pattern)[0]
        return name
    }
    exportTrack = (event, pattern) =>{
        
        event.preventDefault()
        this.props.postTrack(pattern)
        
    }

    
    render(){
       

        return(
            <div>
                <Mic recordIncome={this.recordIncome}/>
                

                {this.state.records.map((instance) =>{
                    return(
                        <div className="records-edit">
                            <Button icon onClick={() => this.playRecord(instance)}><Icon name="play"/></Button>
                            <Button icon onClick={this.resetState}><Icon name="trash alternate"/></Button>
                            <form onSubmit={(event) => this.addToPlaylist(event, instance)}>
                                <input onChange={this.assignRecord} value={this.state.recordName} placeholder="pattern name goes here..."/>
                                <button type="submit">Add to Playlist</button>
                            </form>
                        </div>
                    )
                })}
                

                <div className="recorder-modal">

                
                <Modal trigger={<Button icon><Icon name="info"/></Button>} basic size='small'>
                <Header icon='info' content='Pattern Recorder Instructions' />
                <Modal.Content>
                    <ul>
                        <li>set the timer for when to start recording</li>
                        <li>press play to record</li>
                        <li>activate the sampler by pressing the hand button to make a pattern</li>
                        <li>press stop to end recording</li>
                        <li>name the pattern to add it to the playlist</li>
                </ul>

                </Modal.Content>
                </Modal>
                </div>

                <div className="records">
                {this.props.recordedPatterns.map((pattern)=>{
                    return(
                    <div>
                        <p>{this.patternName(pattern)}</p>
                    <Button icon onClick={() => this.playPatternRecord(pattern)}><Icon name="play"/></Button>
                    <Button icon onClick={() => this.props.deletePattern(pattern)}><Icon name="trash alternate"/></Button>
                    <Button icon onClick={event=> this.exportTrack(event, pattern)}><Icon name="upload" /></Button>

                    </div>
                    )
                })}
                </div>
                

                

            
                
                

                
               
               
            </div>
        )
    }
}

export default Recorder
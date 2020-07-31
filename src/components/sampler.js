import React,{Component} from 'react'
import Mic from './mic'
import SamplePad from './samplepad'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'






class Sampler extends Component {
    state = {
        sampleIncoming: [],
        sampleEditing: {},
        sampleLetter: ""
    }

    fixState = (event)=>{
        let sampleLetter = event.target.value
        this.setState({sampleLetter: sampleLetter})
    }
    resetState = () =>{
        this.setState({sampleEditing: {}, sampleLetter: "", sampleIncoming: []})
    }

    recordIncome = (record) => {
        this.setState({sampleIncoming: [...this.state.sampleIncoming, record], sampleEditing: record})
      }

    saveSample = (event) =>{
        event.preventDefault()
        let sampleLetter = this.state.sampleLetter
        let sampleBlob = this.state.sampleEditing.blobURL
        let sampleObj = {[sampleLetter]: sampleBlob}
        if (this.props.sampleLetters.includes(sampleLetter)){
            alert(`${sampleLetter} is already assigned.`)
        } else {
        this.props.getSampleSounds(sampleObj)
        this.resetState()
        }
    }
    playSample = (sampleBlob) =>{
        let url = sampleBlob.blobURL
        new Audio(url).play()
    }
    deleteSample = (sampleBlob) =>{
        debugger 
        let samples = this.state.sampleIncoming
        let updatedSamples = samples.filter((sample) => sample !== sampleBlob)
        this.setState({sampleIncoming: updatedSamples})
    }
    render(){
        return(
            <div>
                <Mic recordIncome={this.recordIncome}/>
                {this.state.sampleIncoming.map((sample) => {
                    return(
                        <div className="sample-question">
                            <h5>Assign sample a letter</h5>
                            <Button Icon onClick={() => this.playSample(sample)}><Icon name="play"/></Button>
                            <Button Icon onClick={() => this.deleteSample(sample)}><Icon name="trash alternate"/></Button>
                            <form onSubmit={event => this.saveSample(event)}>
                                <input value={this.state.sampleName} placeholder="Assign sample here" onChange={event => this.fixState(event)} maxLength="1"/>
                                <Button type="submit"><Icon name="plus"/></Button>
                            </form>

                            </div>
                    )
                })}
                <div className="sampler-modal">

               
                <Modal trigger={<Button icon><Icon name="info"/></Button>} basic size='small'>
                <Header icon='info' content='Sampler Instructions' />
                <Modal.Content>
                    <ul>
                        <li>set the timer for when to start recording</li>
                        <li>press play to record</li>
                        <li>press stop to end recording</li>
                        <li>assign sample to a letter</li>
                        <li>press hand button to activate sampler anywhere in the machine</li>
                        <li>press fork button to add sample directly to the playlist</li>
                </ul>

                </Modal.Content>
                </Modal>
                </div>
                {this.props.recordedSamples.map(audio =>{
                    return(
                        <div>
                            <SamplePad addPattern={this.props.addPattern} deleteSample={this.props.deleteSample} sample={audio}/>
                        </div>
                    )
                })}

            </div>
        )
    }
}

export default Sampler
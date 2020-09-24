import React, {Component} from 'react'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import Sampler from './sampler'
import Recorder from './recorder'
import Playlist from './playlist'
import { Button, Icon } from 'semantic-ui-react'
import Navbar from './Navbar'
import store from '../redux/store'
import { connect } from 'react-redux'
import { withRouter } from "react-router";



class Machine extends Component {
    constructor(){
        super()
        this.state = {
          blobChannels: [],
          muted: [],
          experiment: "",
          recordedSamples: [],
          sampleLetters: [],
          recordedPatterns: [],
          url: "",
          playing: false,
          pos: 0,
          bpm: 220,
          pads: [],
          namedChannels: [],
          activeItem: 'Sampler',
          channelLength: 8,
          recordedTrack: null
        }
        this.togglePlaying = this.togglePlaying.bind(this)
        this.toggleActive = this.toggleActive.bind(this)
    
      }
      // modularize components <tabs> <machine screen> 

      resetSequencer = () =>{
        this.setState({pads: []})
      }
    
      togglePlaying() {
         
        if (this.state.playing){
          clearInterval(this.timerId)
          this.setState({playing: false})
        } else {
          this.setTimer()
          this.setState({playing: true})
        }
      }
      toggleActive(rowIndex, id) {
        let namedChannels =[...this.state.namedChannels]
        let namedChannelstate = namedChannels[rowIndex]
        let selectedPad = namedChannelstate[Object.keys(namedChannelstate)[0]][id]

        if (selectedPad === 1) {
          namedChannels[rowIndex][Object.keys(namedChannelstate)[0]][id] = 0
        } else {
          namedChannels[rowIndex][Object.keys(namedChannelstate)[0]][id] = 1

        }

        this.setState({namedChannels: namedChannels})
    }
  
      setTimer() {
        this.timerId = setInterval(() => this.tick(), this.calculateTempo(this.state.bpm))
      }

      calculateTempo(bpm) {
        return 60000 / bpm;
      }
    
      tick() { 
        let pos = this.state.pos; 
        pos++;
        if (pos > this.state.channelLength - 1) {
            pos = 0;
        }
        this.setState({ pos: pos });
        this.checkPad()
    }

      checkPad() {
        this.state.namedChannels.map((obj, rowIndex) => {
          obj[Object.keys(obj)[0]].map((pad, index) => {
            if (index === this.state.pos && pad === 1 ) {
              this.playSound(rowIndex)
            }
          })
        })

      }
    
      playSound(index){  
       
        if (this.state.muted.includes(index)){
        } else {
        new Audio(this.state.blobChannels[index]).play()
        }
      }

      handleItemClick = (event) =>{
          this.setState({activeItem: event.target.innerText})
      }


      getSampleSounds = (record) => {
        let letter = Object.keys(record)[0]
        this.setState({recordedSamples: [...this.state.recordedSamples, record], sampleLetters: [...this.state.sampleLetters, letter]})
      }

      playSampleSounds = (event) =>{
        
        let assignedSamples = this.state.recordedSamples
        let sampleObj = {}
        this.state.recordedSamples.map((sample)=>{
          let letter = Object.keys(sample)[0]
          let blob = Object.values(sample)[0]
          sampleObj[letter] = blob
        })
        
        new Audio(sampleObj[event.key]).play() 
         
      }

      addPattern = (record) =>{ 

        let channelPadsArray = []
        for (let i = 0; i < this.state.channelLength; i++){
          channelPadsArray.push(0)
        }

        let name = Object.keys(record)[0]
        let blob = Object.values(record)[0]
        let patternObj = {
          [name]: channelPadsArray
        }
        let updatedPads = []
        if (this.state.pads[0]){
          this.state.pads[0].forEach(pad =>{
            updatedPads.push(0)
          })
        } else {
          updatedPads = [0,0,0,0,0,0,0,0]
        }
          this.setState({
            blobChannels: [...this.state.blobChannels, blob],
            pads: [...this.state.pads, updatedPads],
            recordedPatterns: [...this.state.recordedPatterns, record],
            namedChannels: [...this.state.namedChannels, patternObj]
          })
          
      }

      handleBpmChange = (bpm) =>{

        this.setState({ bpm: bpm.target.value})
        if (this.state.playing) {
          clearInterval(this.timerId)
          this.setTimer()
        }

      }

      addPad = () =>{

        let namedChannels = this.state.namedChannels
        namedChannels.map(pad => {
          pad[Object.keys(pad)[0]].push(0)
        })
        
        this.setState({
          channelLength: this.state.channelLength + 1,
          namedChannels: namedChannels
        })
         
      }

      removePad = () =>{

        this.setState({
          channelLength: this.state.channelLength - 1
        })
        let namedChannels = this.state.namedChannels
        namedChannels.forEach(pad => {
          pad[Object.keys(pad)[0]].pop()
        })

      }

      deleteSample = (sample) =>{
        
        let sampleBlob = Object.values(sample)[0]
        let sampleName = Object.keys(sample)[0]
        let filteredBlobChannels = this.state.blobChannels.filter((piece) => piece !== sampleBlob)
        let filteredNamedChannels = this.state.namedChannels.filter((channel) => Object.keys(channel)[0] !== sampleName)
        let filteredRecordedPatterns = this.state.recordedPatterns.filter((pattern) => pattern !== sample)
        let updatedSampleLetters = this.state.sampleLetters.filter((letter) => letter !== Object.keys(sample)[0]) 
        let samples = this.state.recordedSamples
        let updatedSamples = samples.filter(smp => smp !== sample)
        this.setState({ 
          recordedSamples: updatedSamples,
          sampleLetters: updatedSampleLetters,
          blobChannels: filteredBlobChannels,
          namedChannels: filteredNamedChannels,
          recordedPatterns: filteredRecordedPatterns
          })
        
      }
      deletePattern =(pattern)=>{

        let namedChannels = this.state.namedChannels
        let patterns = this.state.recordedPatterns
        let key = Object.keys(pattern)[0]
        let blobs = this.state.blobChannels
        let blobUrl = Object.values(pattern)[0]
        let updatedBlobChannels = blobs.filter((blob) => blob !== blobUrl)
        let updatedPatterns = patterns.filter((ptrn) => ptrn !== pattern)
        let updatedNamedChannels = namedChannels.filter((pad) => Object.keys(pad)[0] !== key)
         
        this.setState({recordedPatterns: updatedPatterns, blobChannels: updatedBlobChannels, namedChannels: updatedNamedChannels})
        this.resetSequencer()

      }

      mute = (index) =>{

        let mutedRows = this.state.muted
        if (mutedRows.includes(index)){
          let found = mutedRows.find(num => num == index)
          let updatedRows = mutedRows.filter(num => num !== found)
          this.setState({muted: updatedRows})
        } else {
          this.setState({muted: [...this.state.muted, index]})
        }
         
      }

      trackIncoming = (record) =>{
        this.setState({recordedTrack: record})
         
      }

      postTrack = (track) =>{

        let id = this.props.loggedInUser.id
        let trackName = track.name
        let trackBlob = track.blob
      
        
        let formData = new FormData()
        formData.append("id", id)
        formData.append("track", trackBlob)
        formData.append("name", trackName)
         
        fetch('http://localhost:3000/songs', {
          method: "POST",
          headers: {
                   "Accept" : "application/json"
          },
          body: formData

        })
        .then(resp => resp.json())
        .then(resp => {
          let loggedInUser = {...this.props.loggedInUser}
          loggedInUser.songs.unshift(resp)
          let timeline = [...this.props.timeline]
          let forTl = resp 
          forTl.comments = []
          forTl.shared = []
          timeline.unshift(forTl)
          store.dispatch({type: "ADD_SONG_TIMELINE", timeline: timeline})
          store.dispatch({type: "ADD_SONG_USER", loggedInUser: loggedInUser})
          this.props.history.push("/timeline")
        }) 
      
      }

      removeTrack = () =>{

        this.setState({recordedTrack: null})
        
      }
    
    render(){
        return(
            <div>
              <Navbar getTimeline={this.props.getTimeline} toLoggedInUserProfile={this.props.toLoggedInUserProfile} logUserOut={this.props.logUserOut} backToTimeline={this.props.backToTimeline} searchedUser={this.props.searchedUser} users={this.props.users} loggedInUser={this.props.loggedInUser} startMachine={this.props.startMachine}/>
              <Grid>
                <Grid.Column width={2}>
                <Menu fluid vertical tabular>
                <Menu.Item
            name='Sampler'
            active={this.state.activeItem === 'Sampler'}
            onClick={event => this.handleItemClick(event)}
          />
          <Menu.Item
            name='Recorder'
            active={this.state.activeItem === 'Recorder'}
            onClick={event => this.handleItemClick(event)}
          />
          <Menu.Item
            name='Playlist'
            active={this.state.activeItem === 'Playlist'}
            onClick={event => this.handleItemClick(event)}
          />
        </Menu>
        </Grid.Column>
        </Grid>
        {this.state.activeItem === "Sampler" ? 
        < Sampler addPattern={this.addPattern} sampleLetters={this.state.sampleLetters} deleteSample={this.deleteSample} recordedSamples={this.state.recordedSamples} getSampleSounds={this.getSampleSounds}/>
        :
        null
        }
        {this.state.activeItem === "Recorder" ?
        <Recorder postTrack={this.postTrack}deletePattern={this.deletePattern}recordedPatterns={this.state.recordedPatterns} blobChannels={this.state.blobChannels} addPattern={this.addPattern}/>
        :
        null
        }
        {this.state.activeItem === "Playlist" ?
        <Playlist removeTrack={this.removeTrack} postTrack={this.postTrack} recordedTrack={this.state.recordedTrack} trackIncoming={this.trackIncoming} mutedList={this.state.muted} mute={this.mute} namedChannels={this.state.namedChannels} removePad={this.removePad} addPad={this.addPad} bpm={this.state.bpm} handleBpmChange={this.handleBpmChange} playing={this.state.playing} togglePlaying={this.togglePlaying} pos={this.state.pos} pads={this.state.pads} toggleActive={this.toggleActive}/>
        :
        null      
        }
        <div className="activate-sampler">
            <Button icon onKeyDown={event => this.playSampleSounds(event)}><Icon name="hand paper outline" /></Button>
            </div>
            
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
  return{
    loggedInUser: state.loggedInUser,
    timeline: state.timeline
  }
}
export default connect(mapStateToProps)(withRouter(Machine)) 
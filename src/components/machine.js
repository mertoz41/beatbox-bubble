import React, {Component} from 'react'
import { Menu } from 'semantic-ui-react'
import Sampler from './sampler'
import Recorder from './recorder'
import Playlist from './playlist'
import { Button, Icon } from 'semantic-ui-react'



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
        console.log('changed', rowIndex, id)
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
        console.log(pos);
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
        console.log(index, "experimenting")
        if (this.state.muted.includes(index)){
          console.log(index, "muted")
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
        let updatedSampleLetters = this.state.sampleLetters.filter((letter) => letter !== Object.keys(sample)[0]) 
        let samples = this.state.recordedSamples
        let updatedSamples = samples.filter(smp => smp !== sample)
        this.setState({ recordedSamples: updatedSamples, sampleLetters: updatedSampleLetters})
        
         
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

        // let reader = new FileReader()
        // reader.readAsDataURL(this.state.recordedTrack)
        // let blober = new Blob(chunks, {type: 'audio/mpeg-3'})

        let url = Object.values(track)[0]
        let id = this.props.loggedInUser.id
        let trac = this.state.recordedTrack
        let trackName = Object.keys(track)[0]
      
        
        
        let formData = new FormData()
        formData.append("id", id)
        formData.append("track", this.state.recordedTrack.blob)
        formData.append("name", trackName)
         
         
        fetch('http://localhost:3000/add', {
          method: "PATCH",
          headers: {
                   "Accept" : "application/json"
                  //  "Content-Type": "multipart/form-data"
          },
          body: formData

        })
        .then(resp => resp.json())
        .then(resp => {console.log(resp)})
         


       

    //     var fd = new FormData();
    //   fd.append('fname', 'test.wav');
    //   fd.append('data', soundBlob);
    //   $.ajax({
    // type: 'POST',
    // url: '/upload.php',
    // data: fd,
    // processData: false,
    // contentType: false
    //   }).done(function(data) {
    //    console.log(data);
    //   });
         
        // fetch('http://localhost:3000/add', {
        //   method: 'PATCH',
        //   headers: {
        //     "Content-Type": "application/json",
        //     "Accept" : "application/json"

        //   },
        //   body: JSON.stringify({formData})
        // })
        // .then(resp => resp.json())
        // .then(resp => {
           
        // })
   
        
      }
    
    render(){
        return(
            <div>
                <Menu pointing>
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
        {this.state.activeItem === "Sampler" ? 
        < Sampler addPattern={this.addPattern} sampleLetters={this.state.sampleLetters} deleteSample={this.deleteSample} recordedSamples={this.state.recordedSamples} getSampleSounds={this.getSampleSounds}/>
        :
        null
        }
        {this.state.activeItem === "Recorder" ?
        <Recorder deletePattern={this.deletePattern}recordedPatterns={this.state.recordedPatterns} blobChannels={this.state.blobChannels} addPattern={this.addPattern}/>
        :
        null
        }
        {this.state.activeItem === "Playlist" ?
        <Playlist postTrack={this.postTrack} recordedTrack={this.state.recordedTrack} trackIncoming={this.trackIncoming} mutedList={this.state.muted} mute={this.mute} namedChannels={this.state.namedChannels} removePad={this.removePad} addPad={this.addPad} bpm={this.state.bpm} handleBpmChange={this.handleBpmChange} playing={this.state.playing} togglePlaying={this.togglePlaying} pos={this.state.pos} pads={this.state.pads} toggleActive={this.toggleActive}/>
        :
        null      
        }
            <Button icon onKeyDown={event => this.playSampleSounds(event)}><Icon name="hand paper outline" /></Button>
            
            </div>
        )
    }
}

export default Machine 
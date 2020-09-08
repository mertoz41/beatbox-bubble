import React, {Component, Fragment} from 'react';
import './App.css';
import Login from './components/login'
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Machine from './components/machine'
import Timeline from './components/timeline'
import Profile from './components/profile'

class App extends Component {
  constructor(){
    super()

  
  this.state ={
    loggedInUser: null,
    session: false,
    users: [],
    searchedUser: null,
    timeline: [],
    selectedSong: null
  }
}

  componentDidMount(){
    this.fetchUsers()
    if (localStorage.getItem('jwt')){
      this.checkJwt()
    }    
  }

  fetchUsers = () =>{
    fetch('http://localhost:3000/users')
    .then(resp => resp.json())
    .then(resp => {
      this.setState({users: resp})
    })
  }

  checkJwt = () =>{
    
      fetch('http://localhost:3000/check', {
        method: 'GET',
        headers: {
          "Authentication": localStorage.getItem('jwt')
        }
      })
      .then(resp => resp.json())
      .then(resp => {
        this.logUser(resp.user)
      })
  }

  addLoggedInUserShares = (obj, song) => {
    let loggedInUser = this.state.loggedInUser
    
    let found = loggedInUser.shares.find(share => share.sharedsong_id == obj.id)
    if (found){
      let filteredShares = loggedInUser.shares.filter(share => share.sharedsong_id !== obj.id)
      loggedInUser.shares = filteredShares
      let filteredSharedSongs = loggedInUser.sharedsongs.filter(song => song.id !== obj.id)
      loggedInUser.sharedsongs = filteredSharedSongs
      this.setState({loggedInUser: loggedInUser})
    } else {
      loggedInUser.shares.push(obj)
      loggedInUser.sharedsongs.push(song)
      this.setState({loggedInUser: loggedInUser})
    }

  }

  getTimeline = (id) =>{
    fetch(`http://localhost:3000/timeline/${id}`)
        .then(resp => resp.json())
        .then(resp => {
          resp.tl_tracks.forEach((track) => {
            if (!track.shared){
              track.shared = []
            }
          })
          this.setState({timeline: resp.tl_tracks})
        })
  }


  toLoggedInUserProfile = (user) =>{

    this.setState({searchedUser: user, timeline: []})
  }
  fetchEachSong = (id) =>{

    fetch(`http://localhost:3000/songs/${id}`)
        .then(resp => resp.json())
        .then(resp => {

          if (this.state.selectedSong){
            this.setState({selectedSong: resp.song})
          }
              
            let filtered = this.state.timeline.filter((song) => song.id !== resp.song.id)
            filtered.push(resp.song)
            let sortedFiltered = filtered.sort((a,b) => b.created_at - a.created_at)
            
            this.setState({
                timeline: filtered
            })
             
        })

  }
      

  

  showTrackComments = (track) =>{
     
    this.setState({selectedSong: track})
  }

  searchedUser = (user) =>{


     
    let id = user.id
    let userObj = {}
    fetch(`http://localhost:3000/users/${id}`)
    .then(resp => resp.json())
    .then(resp => {
       
      this.setState({
        searchedUser: resp.user,
        timeline: []
      })
    })  
}

addNewSong = (song) =>{
  let loggedInUser = this.state.loggedInUser
  loggedInUser.songs.unshift(song)
  let timeline = this.state.timeline
  let forTl = song 
  debugger 
  forTl.comments = []
  forTl.shared = []
  timeline.unshift(forTl)
  this.setState({
    loggedInUser: loggedInUser,
    timeline: timeline
  })
  this.exitMachine()

}

  closeComments = () =>{
    this.setState({selectedSong: null})
  }

  logUser =(user)=>{
     
    this.setState({ loggedInUser: user })
    this.getTimeline(user.id)
  }

  startMachine = () =>{
    this.setState({session: true})
  }
  backToTimeline = () => {
    this.setState({
      searchedUser: null,
      session: false,
      selectedSong: null
    })
    this.getTimeline(this.state.loggedInUser.id)
     
  }

  exitMachine = () =>{
    setTimeout(this.setState({session: false}), 4000)
    this.reFetchLoggedInUser(this.state.loggedInUser.id)
  }

  reFetchLoggedInUser = (id) => {
     

  fetch(`http://localhost:3000/users/${id}`)
  .then(resp => resp.json())
  .then(resp => {
    this.setState({loggedInUser: resp.user})
  })
     

}

  logUserOut = () => {
    
    this.setState({
    
      loggedInUser: null,
      loggedInUserSongs: [],
      searchedUser: null,
      session: false,
      timeline: [],
      selectedSong: null

    })
  }


  render(){
  return (
    <BrowserRouter>
      <Switch>
          <Route exact path="/login" render={() =>
              this.state.loggedInUser ? 
              <Redirect to="/timeline" />
              :
              <Login logUser={this.logUser} />
              }
            />
          <Route exact path="/timeline" render={() =>
              this.state.loggedInUser ? 
              <Timeline addLoggedInUserShares={this.addLoggedInUserShares} getTimeline={this.getTimeline} toLoggedInUserProfile={this.toLoggedInUserProfile}closeComments={this.closeComments} selectedSong={this.state.selectedSong} showTrackComments={this.showTrackComments} timeline={this.state.timeline} fetchEachSong={this.fetchEachSong} logUserOut={this.logUserOut} backToTimeline={this.backToTimeline} reFetchLoggedInUser={this.reFetchLoggedInUser} loggedInUserSharedSongsIds={this.state.loggedInUserSharedSongsIds} loggedInUserSharedSongsList={this.state.loggedInUserSharedSongsList} selectedUser={this.state.searchedUser} searchedUser={this.searchedUser} users={this.state.users} startMachine={this.startMachine} loggedInUser={this.state.loggedInUser} />
              :
              <Redirect to="/login" />
              }
              />
          <Route exact path="/" render={()=>
          this.state.loggedInUser ?
          <Redirect to='/timeline' />
            :
          <Login logUser={this.logUser} />
            }
          />

          <Route exact path="/machine" render={() => 
              this.state.session ? 
              <Machine  addNewSong={this.addNewSong} toLoggedInUserProfile={this.toLoggedInUserProfile} exitMachine={this.exitMachine} logUserOut={this.logUserOut} backToTimeline={this.backToTimeline} searchedUser={this.searchedUser} users={this.state.users} loggedInUser={this.state.loggedInUser} startMachine={this.startMachine}/>
              :
              <Redirect to="/login" />
              }
          />
          <Route exact path="/profile" render={() =>
            this.state.searchedUser ?
            <Profile toLoggedInUserProfile={this.toLoggedInUserProfile} searchedUserSharedSongsList={this.state.searchedUserSharedSongsList} logUserOut={this.logUserOut} backToTimeline={this.backToTimeline} userSharedSongsList={this.state.userSharedSongsList} searchedUserFollowersList={this.state.searchedUserFollowersList} searchedUserFollowingList={this.state.searchedUserFollowingList} followersList={this.state.followersList} followingList={this.state.followingList} followUser={this.followUser} selectedUser={this.state.searchedUser} searchedUser={this.searchedUser} users={this.state.users} startMachine={this.startMachine} loggedInUser={this.state.loggedInUser} reFetchLoggedInUser={this.reFetchLoggedInUser} />
            :
            <Redirect to="/login" />
          }
          />
        
          



      </Switch>
    </BrowserRouter>

  )}
}

export default App;

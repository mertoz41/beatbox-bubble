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
    loggedInUserSongs: [],
    session: false,
    users: [],
    searchedUser: null,
    followingList: [],
    followersList: [],
    loggedInUserSharedSongsList: [],
    loggedInUserSharedSongsIds: [],
    searchedUserFollowingList: [],
    searchedUserFollowersList: [],
    searchedUserSharedSongsIds: [],
    searchedUserSharedSongsList: [],
    timeline: [],
    selectedSong: null
  }
}

  componentDidMount(){
    fetch('http://localhost:3000/users')
    .then(resp => resp.json())
    .then(resp => {
      this.setState({users: resp})
    })
  }

  getTimeline = (id) =>{
    fetch(`http://localhost:3000/timeline/${id}`)
        .then(resp => resp.json())
        .then(resp => {
             
            resp.tl_tracks.forEach((song) => {
                this.fetchEachSong(song.id)
            })
            
        })
  }

  toLoggedInUserProfile = (user) =>{
    this.setState({searchedUser: user})
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

             
            this.setState({
                timeline: filtered
            })
             
        })

  }

  createSelectedUser = (user) =>{
    let preLoggedInUser = this.state.loggedInUser
    debugger 

    if (user.id === preLoggedInUser.id) {
      this.setState({
        loggedInUser: user,
        searchedUser: user
      })
    } else {
    //   let userObj = {}
    //   userObj["id"] = user.id
    //   userObj["username"] = user.username
    //   userObj["songs"] = user.songs
    //   userObj["followers"] = user.followed_by
    //   userObj["following"] = user.follows

    //   this.setState({
    //     loggedInUser: user,
    //     searchedUser: userObj
    //   })
    // }

     
    let userObj = {}
      userObj["id"] = user.id
      userObj["username"] = user.username
      userObj["songs"] = user.songs
      userObj["sharedsongs"] = user.sharedsongs
      userObj["followers"] = user.followed_by
      userObj["following"] = user.follows

      let followList = []
      let followedList = []
      let searchedUserSharedSongsIds = []
      let searchedUserSharedSongsList = []
      user.follows.forEach((user) => followList.push(user.followed_id))
      user.followed_by.forEach((user) => followedList.push(user.follower_id))
      user.sharedsongs.forEach((song) => searchedUserSharedSongsIds.push(song.id))
      user.sharedsongs.forEach((song) => searchedUserSharedSongsList.push(song))

      this.setState({
        searchedUserFollowingList: followList,
        searchedUserFollowersList: followedList, 
        searchedUser: userObj,
        searchedUserSharedSongsIds: searchedUserSharedSongsIds,
        searchedUserSharedSongsList: searchedUserSharedSongsList
       })
      }
      

  }

  showTrackComments = (track) =>{
    this.setState({selectedSong: track})
  }

  searchedUser = (user) =>{

     

    if (user === this.state.loggedInUser){
      this.reFetchLoggedInUser(user.id)
    } else {

    let id = user.id
    let userObj = {}
    fetch(`http://localhost:3000/users/${id}`)
    .then(resp => resp.json())
    .then(resp => {
     
      this.createSelectedUser(resp.user)
       
     
      // userObj["id"] = resp.user.id
      // userObj["username"] = resp.user.username
      // userObj["songs"] = resp.user.songs
      // userObj["followers"] = resp.user.followed_by
      // userObj["following"] = resp.user.follows
      // let followList = []
      // let followedList = []
      // let searchedUserSharedSongsIds = []
      // let searchedUserSharedSongsList = []
      //     resp.user.follows.forEach((user) => followList.push(user.followed_id))
      //     resp.user.followed_by.forEach((user) => followedList.push(user.follower_id))
      //     resp.user.sharedsongs.forEach((song) => searchedUserSharedSongsIds.push(song.id))
      //     resp.user.sharedsongs.forEach((song) => searchedUserSharedSongsList.push(song))

      //     debugger 
         

      // this.setState({
      //    searchedUserFollowingList: followList,
      //    searchedUserFollowersList: followedList, 
      //    searchedUser: userObj,
      //    searchedUserSharedSongsIds: searchedUserSharedSongsIds,
      //    searchedUserSharedSongsList: searchedUserSharedSongsList
      //   })
      
    })
  }
     
  }

  followUser = (user) =>{
    let experiment = user 
    let loggedInUserFollows = this.state.loggedInUser.follows
    let found = loggedInUserFollows.find((followObj) => followObj.followed_id == user.id )
    if (found) {
      this.unfollowUser(found)
    } else {

    

    debugger 
    // let searchedUser = {
    //   id: user.id,
    //   username: user.username
    // }

    

    // let followingUsers = this.state.followingList
    // if (followingUsers.includes(user.id)){
    //   this.unfollowUser(user)
    // } else {
     
    let followed_id = user.id
    let follower_id = this.state.loggedInUser.id
    let followObj ={
      followed: followed_id,
      follower: follower_id
    }

    fetch('http://localhost:3000/follows', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        followObj
      })
    })
    .then(resp => resp.json())
    .then(console.log)
    // this.setState({
    //   followingList: [...this.state.followingList, followed_id]
    // })
    this.searchedUser(user)
    this.reFetchLoggedInUser(follower_id)
  }
  }
  closeComments = () =>{
    this.setState({selectedSong: null})
  }

  unfollowUser = (user) =>{

    
    let loggedInUser = this.state.loggedInUser
    debugger 
    let loggedInUserUsername = this.state.loggedInUser.username
    let searchedUser = {
      id: user.id,
      username: user.username
    }
    
    
    let id = user.id 
    let list = this.state.followingList
    let updated = list.filter((id) => id !== id)
    let found = loggedInUser.follows.find((user) => user.followed_id == id)
     
    fetch(`http://localhost:3000/follows/${found.id}`, {
      method: "DELETE"
    })
    .then(resp => resp.json())
    .then(console.log)
    this.setState({followingList: updated})
    this.searchedUser(searchedUser)
    this.updateLoggedInUser(loggedInUser.id)
  }

  updateLoggedInUser = (id) =>{
    fetch(`http://localhost:3000/users/${id}`)
    .then(resp => resp.json())
    .then(resp => { 
      let followList = []
      let followedList = []
          resp.user.follows.forEach((user) => followList.push(user.followed_id))
          resp.user.followed_by.forEach((user) => followedList.push(user.follower_id))
          this.setState({
            loggedInUser: resp.user,
            followingList: followList,
            followersList: followedList
          })
    })
    
  }

  

  logUser =(user)=>{
     

    fetch('http://localhost:3000/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
          },
          body: JSON.stringify(user)
        })
        .then(resp => resp.json())
        .then(resp => {
          this.getTimeline(resp.user.id)
           
           
          let followList = []
          let followedList = []
          let loggedInUserSongs =[]
          let loggedInUserSharedSongsList = []
          let loggedInUserSharedSongsIds = []
          resp.user.follows.forEach((user) => followList.push(user.followed_id))
          resp.user.followed_by.forEach((user) => followedList.push(user.follower_id))
          resp.sharedsongswithcounts.forEach((song) => loggedInUserSharedSongsList.push(song))
          resp.user.sharedsongs.forEach((song) => loggedInUserSharedSongsIds.push(song.id))
          resp.user.songs.forEach((song) => loggedInUserSongs.push(song))
          
          
           
          
          this.setState({
            loggedInUser: resp.user,
            loggedInUserSongs: loggedInUserSongs,
            followingList: followList,
            followersList: followedList,
            loggedInUserSharedSongsList: loggedInUserSharedSongsList,
            loggedInUserSharedSongsIds: loggedInUserSharedSongsIds
          })
        })
  }

  startMachine = () =>{
    this.setState({session: true})
  }
  backToTimeline = () => {
    this.setState({
      searchedUser: null,
      searchedUserFollowersList: [],
      searchedUserFollowingList: [],
      searchedUserSharedSongsIds: [],
      session: false
    })
     
  }

  exitMachine = () =>{
    setTimeout(this.setState({session: false}), 4000)
    this.reFetchLoggedInUser(this.state.loggedInUser.id)
  }

  reFetchLoggedInUser = (id) => {
     

  fetch(`http://localhost:3000/users/${id}`)
  .then(resp => resp.json())
  .then(resp => {
     
    this.createSelectedUser(resp.user)})

}

  logUserOut = () => {
    
    this.setState({
      followersList: [],
      followingList: [],
      loggedInUser: null,
      loggedInUserSongs: [],
      userSharedSongsList: [],
      userSharedSongsIds: [],
      loggedInUserSharedSongsList: [],
      loggedInUserSharedSongsIds: [],
      searchedUserFollowingList: [],
      searchedUserFollowersList: [],
      searchedUserSharedSongsList: [],
      searchedUserSharedSongsIds: [],
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
              <Timeline toLoggedInUserProfile={this.toLoggedInUserProfile}closeComments={this.closeComments} selectedSong={this.state.selectedSong} showTrackComments={this.showTrackComments} timeline={this.state.timeline} fetchEachSong={this.fetchEachSong} logUserOut={this.logUserOut} backToTimeline={this.backToTimeline} reFetchLoggedInUser={this.reFetchLoggedInUser} loggedInUserSharedSongsIds={this.state.loggedInUserSharedSongsIds} loggedInUserSharedSongsList={this.state.loggedInUserSharedSongsList} selectedUser={this.state.searchedUser} searchedUser={this.searchedUser} users={this.state.users} startMachine={this.startMachine} loggedInUser={this.state.loggedInUser} />
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
              <Machine  toLoggedInUserProfile={this.toLoggedInUserProfile} exitMachine={this.exitMachine} logUserOut={this.logUserOut} backToTimeline={this.backToTimeline} searchedUser={this.searchedUser} users={this.state.users} loggedInUser={this.state.loggedInUser} startMachine={this.startMachine}/>
              :
              <Redirect to="/login" />
              }
          />
          
            <Profile toLoggedInUserProfile={this.toLoggedInUserProfile} searchedUserSharedSongsList={this.state.searchedUserSharedSongsList} logUserOut={this.logUserOut} backToTimeline={this.backToTimeline} userSharedSongsList={this.state.userSharedSongsList} searchedUserFollowersList={this.state.searchedUserFollowersList} searchedUserFollowingList={this.state.searchedUserFollowingList} followersList={this.state.followersList} followingList={this.state.followingList} followUser={this.followUser} selectedUser={this.state.searchedUser} searchedUser={this.searchedUser} users={this.state.users} startMachine={this.startMachine} loggedInUser={this.state.loggedInUser}/>



      </Switch>
    </BrowserRouter>

  )}
}

export default App;

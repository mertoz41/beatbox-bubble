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
            // resp.tl_tracks.forEach((song) => {
            //     this.fetchEachSong(song.id)
            // })
            
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
            debugger 
             

             
            this.setState({
                timeline: filtered
            })
             
        })

  }

  createSelectedUser = (user) =>{
    let preLoggedInUser = this.state.loggedInUser
     

    // if (user.id === preLoggedInUser.id) {
    //   this.setState({
    //     loggedInUser: user,
    //     searchedUser: user
    //   })
    // } else {
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
      

  

  showTrackComments = (track) =>{
     
    this.setState({selectedSong: track})
  }

  searchedUser = (user) =>{

     

    // if (user === this.state.loggedInUser){
    //   this.reFetchLoggedInUser(user.id)
    // } else {
    debugger 
    let id = user.id
    let userObj = {}
    fetch(`http://localhost:3000/users/${id}`)
    .then(resp => resp.json())
    .then(resp => {
       
      this.setState({
        searchedUser: resp.user,
        timeline: []
      })


     
      // this.createSelectedUser(resp.user)
       
     
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
      
    // })
  // }
     
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

  // followUser = (user) =>{
  //   let loggedInUserFollows = this.state.loggedInUser.follows
  //   let foundFollowObj = loggedInUserFollows.find((followObj) => followObj.followed_id == user.id )
  //   // followed_id is the action person
 
  //   if (foundFollowObj) {
  //     this.unfollowUser(foundFollowObj)
  //   } else {

    

     
  //   // let searchedUser = {
  //   //   id: user.id,
  //   //   username: user.username
  //   // }

    

  //   // let followingUsers = this.state.followingList
  //   // if (followingUsers.includes(user.id)){
  //   //   this.unfollowUser(user)
  //   // } else {
     
  //   let followed_id = user.id
  //   let follower_id = this.state.loggedInUser.id
  //   let followObj ={
  //     followed: followed_id,
  //     follower: follower_id
  //   }

  //   fetch('http://localhost:3000/follows', {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       followObj
  //     })
  //   })
  //   .then(resp => resp.json())
  //   .then(console.log)
  //   // this.setState({
  //   //   followingList: [...this.state.followingList, followed_id]
  //   // })
  //   this.searchedUser(user)
  //   this.reFetchLoggedInUser(this.state.loggedInUser.id)
  //   // this.reFetchLoggedInUser(follower_id)
  // }
  // }
  closeComments = () =>{
    this.setState({selectedSong: null})
  }

  // unfollowUser = (obj) =>{
  //   let unfollowedUser = this.state.users.find((user) => user.id == obj.followed_id)

    
  //   // let loggedInUser = this.state.loggedInUser
  //   // debugger 
  //   // let loggedInUserUsername = this.state.loggedInUser.username
  //   // let searchedUser = {
  //   //   id: user.id,
  //   //   username: user.username
  //   // }
    
    
  //   // let id = user.id 
  //   // let list = this.state.followingList
  //   // let updated = list.filter((id) => id !== id)
  //   // let found = loggedInUser.follows.find((user) => user.followed_id == id)
     
  //   fetch(`http://localhost:3000/follows/${obj.id}`, {
  //     method: "DELETE"
  //   })
  //   .then(resp => resp.json())
  //   .then(console.log)
  //   this.searchedUser(unfollowedUser)
  //   this.reFetchLoggedInUser(this.state.loggedInUser.id)
  // }

  // // updateLoggedInUser = (id) =>{
  // //   fetch(`http://localhost:3000/users/${id}`)
  // //   .then(resp => resp.json())
  // //   .then(resp => { 
  // //     let followList = []
  // //     let followedList = []
  // //         resp.user.follows.forEach((user) => followList.push(user.followed_id))
  // //         resp.user.followed_by.forEach((user) => followedList.push(user.follower_id))
  // //         this.setState({
  // //           loggedInUser: resp.user,
  // //           followingList: followList,
  // //           followersList: followedList
  // //         })
  // //   })
    
  // // }

  

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
              <Timeline getTimeline={this.getTimeline} toLoggedInUserProfile={this.toLoggedInUserProfile}closeComments={this.closeComments} selectedSong={this.state.selectedSong} showTrackComments={this.showTrackComments} timeline={this.state.timeline} fetchEachSong={this.fetchEachSong} logUserOut={this.logUserOut} backToTimeline={this.backToTimeline} reFetchLoggedInUser={this.reFetchLoggedInUser} loggedInUserSharedSongsIds={this.state.loggedInUserSharedSongsIds} loggedInUserSharedSongsList={this.state.loggedInUserSharedSongsList} selectedUser={this.state.searchedUser} searchedUser={this.searchedUser} users={this.state.users} startMachine={this.startMachine} loggedInUser={this.state.loggedInUser} />
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

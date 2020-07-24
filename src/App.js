import React, {Component, Fragment} from 'react';
import './App.css';
import Login from './components/login'
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Machine from './components/machine'
import Timeline from './components/timeline'
import Profile from './components/profile'

class App extends Component {
  state ={
    loggedInUser: null,
    session: false,
    users: [],
    searchedUser: null,
    followingList: []
  }

  componentDidMount(){
    fetch('http://localhost:3000/users')
    .then(resp => resp.json())
    .then(resp => {
      this.setState({users: resp})
    })
  }

  searchedUser = (user) =>{
    
     
    let id = user.id
    let userObj = {}
    fetch(`http://localhost:3000/users/${id}`)
    .then(resp => resp.json())
    .then(resp => {
       
      userObj["id"] = resp.user.id
      userObj["username"] = resp.user.username
      userObj["urls"] = resp.urls
      userObj["followers"] = resp.user.followed_by
      userObj["following"] = resp.user.follows
       
       
      this.setState({searchedUser: userObj})
    })
     
  }

  followUser = (user) =>{
    let searchedUser = {
      id: user.id,
      username: user.username
    }

    let loggedUser = {
      username: this.state.loggedInUser.username,
      password: ""
    }

    let followingUsers = this.state.followingList
    if (followingUsers.includes(user.id)){
      this.unfollowUser(user)
    } else {
     
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
    this.setState({
      followingList: [...this.state.followingList, followed_id]
    })
    this.searchedUser(searchedUser)
    this.updateLoggedInUser(follower_id)
  }
  }

  unfollowUser = (user) =>{
    
    let loggedInUser = this.state.loggedInUser
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
          resp.user.follows.forEach((user) => followList.push(user.followed_id)) 
          this.setState({
            loggedInUser: resp.user,
            followingList: followList
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
          let followList = []
          resp.user.follows.forEach((user) => followList.push(user.followed_id)) 
          this.setState({
            loggedInUser: resp.user,
            followingList: followList
          })
        })
  }

  startMachine = () =>{
    this.setState({session: true})
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
              <Timeline selectedUser={this.state.searchedUser} searchedUser={this.searchedUser} users={this.state.users} startMachine={this.startMachine} loggedInUser={this.state.loggedInUser} />
              :
              <Redirect to="/login" />
              }
              />

          <Route exact path="/machine" render={() => 
              this.state.session ? 
              <Machine loggedInUser={this.state.loggedInUser}/>
              :
              <Redirect to="/login" />
              }
          />
          
            <Profile followingList={this.state.followingList} followUser={this.followUser} selectedUser={this.state.searchedUser} searchedUser={this.searchedUser} users={this.state.users} startMachine={this.startMachine} loggedInUser={this.state.loggedInUser}/>



      </Switch>
    </BrowserRouter>

  )}
}

export default App;

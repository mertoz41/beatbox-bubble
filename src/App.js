import React, {Component, Fragment} from 'react';
import './App.css';
import Login from './components/login'
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Machine from './components/machine'
import Timeline from './components/timeline'
import Profile from './components/profile'
import store from './redux/store';
import {connect} from 'react-redux'

class App extends Component {
  

  state = { selectedSong: null }
  


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
      store.dispatch({type: "ALL_USERS_INCOMING", users: resp})
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
        this.getTimeline(resp.user.id)
        store.dispatch({type: "LOG_USER_IN", loggedInUser: resp.user})
      })
  }


  getTimeline = (id) =>{

    fetch(`http://localhost:3000/timeline/${id}`)
    .then(resp => resp.json())
    .then(resp => {
    resp.tl_tracks.sort((a, b) => {
        let keyA = new Date(a.created_at), keyB = new Date(b.created_at);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0 
        })
    let ordered = resp.tl_tracks.reverse()
    store.dispatch({type: "TIMELINE_INCOMING", timeline: ordered})
    })
  }

  addNewSong = (song) =>{
      let loggedInUser = this.state.loggedInUser
      loggedInUser.songs.unshift(song)
      let timeline = this.state.timeline
      let forTl = song 
      forTl.comments = []
      forTl.shared = []
      timeline.unshift(forTl)
      this.setState({
        loggedInUser: loggedInUser,
        timeline: timeline
      })
}

  render(){
  return (
    <BrowserRouter>
      <Switch>
          <Route exact path="/login" render={() =>
              this.props.loggedInUser ? 
              <Redirect to="/timeline" />
              :
              <Login getTimeline={this.getTimeline} />
              }
            />
          <Route exact path="/timeline" render={() =>
              this.props.loggedInUser ? 
              <Timeline getTimeline={this.getTimeline} />
              :
              <Redirect to="/login" />
              }
              />
          <Route exact path="/" render={()=>
          this.props.loggedInUser ?
          <Redirect to='/timeline' />
            :
          <Login getTimeline={this.getTimeline}/>
            }
          />

          <Route exact path="/machine" render={() => 
              this.props.session ? 
              <Machine  getTimeline={this.getTimeline} addNewSong={this.addNewSong}   />
              :
              <Redirect to="/login" />
              }
          />
          <Route exact path="/profile/:name" render={() =>
            this.props.searchedUser ?
            <Profile getTimeline={this.getTimeline} />
            :
            <Redirect to="/login" />
          }
          />
        
          



      </Switch>
    </BrowserRouter>

  )}
}
const mapStateToProps = (state) =>{
  return{
    loggedInUser: state.loggedInUser,
    session: state.session,
    searchedUser: state.searchedUser
  }
}
export default connect(mapStateToProps)(App);

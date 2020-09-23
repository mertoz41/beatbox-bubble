import React,{Component} from 'react'
import { Search, Grid, Button, Icon  } from 'semantic-ui-react'
import { withRouter } from "react-router";
import { Redirect } from 'react-router-dom';
import mics from '../pictures/mics.png'
import {connect} from 'react-redux'
import store from '../redux/store';




class Navbar extends Component{

    state = {

        searching: "",
        boxers: []

    }

    fixState = (event) =>{

        let searched = event.target.value
        let excludedLoggedInUser = this.props.users.filter((user) => user.username !== this.props.loggedInUser.username) 
        let found = excludedLoggedInUser.filter((user) => user.username.includes(searched))
        found = found.map(boxer => ({title: boxer.username}))
        this.setState({
            searching: searched,
            boxers: found
        })

    }

    selectedUser =(event) =>{
         

        let foundUser = this.props.users.find((user) => user.username == event.target.innerText)

        fetch(`http://localhost:3000/users/${foundUser.id}`)
        .then(resp => resp.json())
        .then(resp => {
            store.dispatch({type: "SEARCHED_USER_INCOMING", searchedUser: resp.user})
            this.props.history.push(`/profile/${resp.user.username}`)
             
        })

        // this.props.searchedUser(foundUser)
        // this.props.history.push('/machine')

    }

    machineRedirect = () =>{
        store.dispatch({type: "START_MACHINE"})

        this.props.history.push('/machine')
        // this.props.startMachine()

    }
    timelineRedirect = () =>{

        store.dispatch({type: "BACK_TO_TIMELINE"})
        this.props.getTimeline(this.props.loggedInUser.id)
        this.props.history.push('/timeline')


    }

    userRedirect = () =>{
         
         
        // this.props.searchedUser(this.props.loggedInUser)
        store.dispatch({type: "SEARCHED_USER_INCOMING", searchedUser: this.props.loggedInUser})
        this.props.history.push(`/profile/${this.props.loggedInUser.username}`)

    }

    logOut = () =>{
        
        localStorage.clear()
        this.props.history.push('/login')
        store.dispatch({type: "LOG_USER_OUT"})
        // this.props.logUserOut()

    }


    render(){
        return(
            <div className="nav-header">
                <Grid>
                <Grid.Column width={3}>
                <Search placeholder="Search beatboxers" onResultSelect={event => this.selectedUser(event)} results={this.state.boxers} value={this.state.searching} onSearchChange={event => this.fixState(event)}/>
                </Grid.Column>
                <div className="mic-img">
                    <img src={mics} width="300"/>
                </div>
                <div className="home-button">
                <Button icon onClick={this.timelineRedirect}><Icon name="globe"/></Button>
                </div>
                <div className="machine-button">

                <Button icon onClick={this.machineRedirect}><Icon name="microphone"/></Button>
                </div>

                
                

                <div class="username">
                <Button icon labelPosition='left' onClick={() => this.userRedirect()}>
                <Icon name='user' />
                {this.props.loggedInUser.username}
                </Button>
                <Button icon labelPosition='right' onClick={this.logOut}>
                Logout 
                <Icon name='sign out alternate' />
                </Button>
                </div>
      
        
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        loggedInUser: state.loggedInUser,
        users: state.users
    }
}

export default connect(mapStateToProps)(withRouter(Navbar))
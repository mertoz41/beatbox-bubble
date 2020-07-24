import React,{Component} from 'react'
import { Search, Grid, Button, Icon  } from 'semantic-ui-react'
import { withRouter } from "react-router";



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
        this.props.searchedUser(foundUser)



    }

    machineRedirect = () =>{
        this.props.history.push('/machine')
        this.props.startMachine()
    }

    userRedirect = () =>{
        this.props.searchedUser(this.props.loggedInUser)
        // this.props.history.push('/profile')

    }


    render(){
        return(
            <div className="header">
                <Grid>
                <Grid.Column width={3}>
                <Search placeholder="Search beatboxers" onResultSelect={event => this.selectedUser(event)} results={this.state.boxers} value={this.state.searching} onSearchChange={event => this.fixState(event)}/>
                </Grid.Column>
        
                </Grid>
                <div className="music">
                <Button icon onClick={this.machineRedirect}>
                <Icon name='music' />
                
                </Button>
                </div>

                <Grid>
                

                <div class="username">
                <Button icon labelPosition='left' onClick={this.userRedirect}>
                <Icon name='user' />
                {this.props.loggedInUser.username}
                </Button>
                <Button icon labelPosition='right'>
                Logout 
                <Icon name='sign out alternate' />
                </Button>
                </div>
      
        
                </Grid>
            </div>
        )
    }
}

export default withRouter(Navbar)
import React,{ Component } from 'react'
import Navbar from './Navbar'
import { Redirect } from 'react-router-dom';


class Timeline extends Component {
    render(){
        if (this.props.selectedUser){
            return <Redirect to="/profile" />
        }
        return(
            <div>
                <Navbar searchedUser={this.props.searchedUser} users={this.props.users} loggedInUser={this.props.loggedInUser} startMachine={this.props.startMachine}/>
                timeline experimenting
            </div>
        )
    }
}

export default Timeline 
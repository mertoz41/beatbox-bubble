import React, { Component } from 'react'
import {Feed} from 'semantic-ui-react'

class Followerslist extends Component{
    getUsername =(id) =>{
        let users = this.props.users
        let found = users.find(user => user.id == id)
        return found.username 
    }
    getPicture = (id) => {
        let users = this.props.users
        let found = users.find((user) => user.id == id)
        let userImage = require(`../pictures/${found.username}.png`)
        return userImage
    }
    render(){
        return(
            <div className="following-list-scroller">
                <Feed>
                {this.props.followersList.map((person) => {
                    return(
                        <Feed.Event>
                        <Feed.Label>
                            <img src={this.getPicture(person.id)} />
                        </Feed.Label>
                        <Feed.User>
                        <h4>{person.username}</h4>
                        </Feed.User>
                        </Feed.Event>
                    )
                })}
                </Feed>
            </div>
        )
    }
}

export default Followerslist
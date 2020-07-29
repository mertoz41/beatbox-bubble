import React, { Component } from 'react'
import {Feed } from 'semantic-ui-react'


class Followinglist extends Component {
    getUsername =(id) =>{
        let userId = id 
        let users = this.props.users
        let found = users.find(user => user.id == userId)
         
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
            <div>
                <Feed>
              
                
                {this.props.followingList.map((id) => {
                    return(
                        <Feed.Event>
                        <Feed.Label>
                            <img src={this.getPicture(id)} />
                        </Feed.Label>
                        <Feed.User>
                        {this.getUsername(id)}
                        </Feed.User>
                        </Feed.Event>
        

                    )
                })}
                </Feed>
            </div>
        )
    }
}

export default Followinglist
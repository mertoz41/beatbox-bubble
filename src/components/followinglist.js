import React, { Component } from 'react'
import {Feed } from 'semantic-ui-react'


class Followinglist extends Component {
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
              
                
                {this.props.selectedUser.follows.map((followObj) => {
                    return(
                        <Feed.Event>
                        <Feed.Label>
                            <img src={this.getPicture(followObj.followed_id)} />
                        </Feed.Label>
                        <Feed.User>
                        {this.getUsername(followObj.followed_id)}
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
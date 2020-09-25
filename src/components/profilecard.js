import React, { Component } from 'react'
import { Button, Feed, Icon, Label, Card, Image} from 'semantic-ui-react'
import {connect} from 'react-redux'


export class Profilecard extends Component {
    render() {
        let userImage = require(`../pictures/${this.props.searchedUser.username}.png`)

        let followButton
         
        if (this.props.followedByLoggedInUser){
            followButton = "Unfollow"
        } else {
            followButton = "Follow"
        }
        return (
            <div>
                <Card>
                    <Image src={userImage} width="300" height="300"/>
                    {this.props.loggedInUser == this.props.searchedUser ?
                    null
                    :
                    <Button onClick={() => this.props.followFunction(this.props.searchedUser)}>{followButton}</Button>
                    }
                    <Card.Content>
                    <Card.Header>{this.props.searchedUser.username}</Card.Header>
                    </Card.Content>
                 </Card>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        loggedInUser: state.loggedInUser,
        searchedUser: state.searchedUser
    }
}

export default connect(mapStateToProps)(Profilecard)

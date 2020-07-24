import React,{Component} from 'react'
import Navbar from './Navbar'
import { Button, Icon, Card, Image} from 'semantic-ui-react'


class Profile extends Component{
    state = {
        userTracks: []

    }

    playAudio = (track) =>{
        let string = `http://localhost:3000${track}`
        new Audio(string).play()
    }

    audioName = (track) =>{
        let splitted = track.split('/')
        let name = splitted[splitted.length -1]
        return name 
    }

    render(){
        let userImage = require(`../pictures/${this.props.selectedUser.username}.png`)
        let urls = this.props.selectedUser.urls
        let loggedInUser = this.props.loggedInUser.username
        let selectedUser = this.props.selectedUser.username
        let followButton
         
        if (this.props.followingList.includes(this.props.selectedUser.id)){
            followButton = "Unfollow"
        } else {
            followButton = "Follow"
        }
        return(
            <div>
                <Navbar searchedUser={this.props.searchedUser} users={this.props.users} loggedInUser={this.props.loggedInUser} startMachine={this.props.startMachine}/>

                <Card>
                    <Image src={userImage}/>
                    {loggedInUser == selectedUser ?
                    null
                    :
                    <Button onClick={() => this.props.followUser(this.props.selectedUser)}>{followButton}</Button>
                    }
                    <Card.Content>
                    <Card.Header>{this.props.selectedUser.username}</Card.Header>
                    <Card.Header>following {this.props.selectedUser.following.length}</Card.Header>
                    <Card.Header>followers {this.props.selectedUser.followers.length}</Card.Header>
                    </Card.Content>
                 </Card>

                    <div className="user-tracks">
                    <div className="scroller-profile">
                    {urls.map((track) => {
                        return(
                        <div>
                            <p>{this.audioName(track)}</p>
                            <Button onClick={() =>this.playAudio(track)}><Icon name="play"/></Button>
                        </div>
                        )
                    })}
                    </div>
                    </div>

                
            </div>
        )
    }
}

export default Profile
import React,{Component} from 'react'
import Navbar from './Navbar'
import Followmenu from './followmenu'
import Waveform from './waveform'
import Waveformpro from './waveformpro'
import WaveSurfer from 'wavesurfer.js';
import { Button, Feed, Icon, Label, Card, Image} from 'semantic-ui-react'
import { connect } from 'react-redux'
import Profilecard from './profilecard'
import Usersongs from './usersongs'
import Usersharedsongs from './usersharedsongs'





class Profile extends Component{
    state = {
        
        showFollowingList: false,
        showFollowersList: false,
        playing: false,
        followedByLoggedInUser: false,
        selectedUserFollowers: [],
        loggedInUserFollowObjs: []
    }

    componentDidMount(){
         
        let loggedInUserFollowingList = this.props.loggedInUser.follows
        let selectedUser = this.props.selectedUser
        let selectedUserFollowersArray = []
        selectedUser.followed_by.forEach(follow => {
            let foundUser = this.props.users.find(user => user.id == follow.follower_id)
            selectedUserFollowersArray.push(foundUser)
        })
        this.setState({selectedUserFollowers: selectedUserFollowersArray, loggedInUserFollowObjs: loggedInUserFollowingList}) 
        let found = loggedInUserFollowingList.find(follower => follower.followed_id == selectedUser.id)
        if (found){
            this.setState({followedByLoggedInUser: true})
        }

        
    }



 

    followUser = (selectedUser) =>{

        let followed_id = this.props.selectedUser.id
        let follower_id = this.props.loggedInUser.id
        let followObj = {
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
    .then(resp => {
         
        this.setState({
            loggedInUserFollowObjs: [...this.state.loggedInUserFollowObjs, resp.followObj]
        })
    })
    }

    unfollowUser = () =>{
        let followObjects = this.state.loggedInUserFollowObjs
         
        let followObj = followObjects.find(obj => obj.followed_id == this.props.selectedUser.id && obj.follower_id == this.props.loggedInUser.id)
        let filtered = followObjects.filter(obj => obj.followed_id !== this.props.selectedUser.id)
         

        fetch(`http://localhost:3000/follows/${followObj.id}`, {
        method: "DELETE"
        })
        .then(resp => resp.json())
        .then(console.log)
        this.setState({loggedInUserFollowObjs: filtered})
    }




    showFollowing = () =>{
        this.setState({
            showFollowingList: !this.state.showFollowingList
        })
    }

    getTrackDate = (track) =>{
         
        let date = new Date(track.created_at)
        let time = date.toLocaleTimeString()

        let post = time.split(':').splice(0,2).join(':')
        let ampm = time.split(':')[2].split(' ')[1]

        return `${date.toLocaleDateString()}`

    }

    followFunction = (user) =>{

        let userInstance = {id: this.props.loggedInUser.id, username: this.props.loggedInUser.username}
        let followersList = this.state.selectedUserFollowers

    
        if (this.state.followedByLoggedInUser){
            // user to be unfollowed
            let filtered = followersList.filter(person => person.id !== userInstance.id)
             
            this.setState({
                followedByLoggedInUser: false,
                selectedUserFollowers: filtered
            })
            this.unfollowUser()
        } else {
            // user to be followed
            this.setState({
                followedByLoggedInUser: true,
                selectedUserFollowers: [...this.state.selectedUserFollowers, userInstance]
            })
            console.log("user to be followed")
            this.followUser()
        }

    }
    
    showFollowers = () =>{
        this.setState({
            showFollowersList: !this.state.showFollowersList
        })
    }


  

    render(){

         
        return(
            <div>
                <Navbar getTimeline={this.props.getTimeline}toLoggedInUserProfile={this.props.toLoggedInUserProfile} logUserOut={this.props.logUserOut} backToTimeline={this.props.backToTimeline} searchedUser={this.props.searchedUser} users={this.props.users} loggedInUser={this.props.loggedInUser} startMachine={this.props.startMachine}/>
                <div className="profile-card">
                    <Profilecard followFunction={this.followFunction} followedByLoggedInUser={this.state.followedByLoggedInUser}/>
                    <Followmenu followersList={this.state.selectedUserFollowers} selectedUser={this.props.selectedUser} users={this.props.users}/>
                </div>
                 

                    <div className="user-tracks">
                    <div className="profile-sections">
                        <h3>{this.props.selectedUser.username}'s tracks</h3>
                        </div>
                        <Usersongs />
                    </div>
                    <div className="user-shared-tracks">
                        <div className="profile-sections">
                    <h3>{this.props.selectedUser.username}'s shared tracks</h3>
                    </div>
                        <Usersharedsongs />
                    </div>

                
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        loggedInUser: state.loggedInUser,
        users: state.users,
        selectedUser: state.searchedUser
    }
}

export default connect(mapStateToProps)(Profile)
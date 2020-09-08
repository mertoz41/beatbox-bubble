import React,{Component} from 'react'
import Navbar from './Navbar'
import Followmenu from './followmenu'
import Waveform from './waveform'
import Waveformpro from './waveformpro'
import WaveSurfer from 'wavesurfer.js';
import { Button, Feed, Icon, Label, Card, Image} from 'semantic-ui-react'





class Profile extends Component{
    state = {
        userTracks: [],
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
        let followersArray = []
        selectedUser.followed_by.forEach(follow => {
            let foundUser = this.props.users.find(user => user.id == follow.follower_id)
            followersArray.push(foundUser)
        })
        this.setState({selectedUserFollowers: followersArray, loggedInUserFollowObjs: loggedInUserFollowingList}) 
        let found = loggedInUserFollowingList.find(follower => follower.followed_id == selectedUser.id)
        if (found){
            this.setState({followedByLoggedInUser: true})
        }

        
    }

    componentWillUnmount(){
        this.props.reFetchLoggedInUser(this.props.loggedInUser.id)
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
            let filtered = followersList.filter(person => person.id !== userInstance.id)
             
            this.setState({
                followedByLoggedInUser: false,
                selectedUserFollowers: filtered
            })
            console.log("user to be unfollowed")
            this.unfollowUser()
            // unfollow user 
        } else {
            this.setState({
                followedByLoggedInUser: true,
                selectedUserFollowers: [...this.state.selectedUserFollowers, userInstance]
            })
            console.log("user to be followed")
            this.followUser()
            // follow user 
        }

    }
    
    showFollowers = () =>{
        this.setState({
            showFollowersList: !this.state.showFollowersList
        })
    }
    findUsername = (song) =>{
        let user_id = song.user_id
        let users = this.props.users 
        let found = users.find((user) => user.id == user_id)
        return found.username
        
    }
    prepareTrack = (wave, song) =>{
        let waveObj = {}
        let wavy = wave
        let blob = `http://localhost:3000${song.blob}`
        wavy.load(blob)
         
        waveObj[song.id] = wavy
        this.setState({ userTracks: [...this.state.userTracks, waveObj]})
    }

    playTrack = (id) =>{
        let userTracks = this.state.userTracks
        let found = userTracks.find((track) => track[id])
         

    }

    waveformCreator = (track) =>{
        let blob = `http://localhost:3000${track.blob}`
        let id = track.id.toString()
        let stuff = document.querySelector(`#wave-${id}`)

          

       
            let waveform = WaveSurfer.create({
            container: `#wave-${id}`,
            scrollParent: true,
            backend: 'WebAudio',
            height: 90,
            progressColor: '#00FF00',
            responsive: true,
            waveColor: '#EFEFEF',
            cursorColor: 'transparent',
          });
          
           
          this.prepareTrack(waveform, track)
            
        
    }

    toString= (id) =>{
        return id.toString() 
    }

    test = (track) => {
        setTimeout( () => this.waveformCreator(track), 1000)
        return "test"
    }

    render(){

         
         
        let userImage = require(`../pictures/${this.props.selectedUser.username}.png`)
        
        let loggedInUser = this.props.loggedInUser.username
        let selectedUser = this.props.selectedUser.username
        let found = this.props.loggedInUser.follows.find((followObj) => followObj.followed_id == this.props.selectedUser.id)


        let followButton
         
        if (this.state.followedByLoggedInUser){
            followButton = "Unfollow"
        } else {
            followButton = "Follow"
        }
        return(
            <div>
                <Navbar getTimeline={this.props.getTimeline}toLoggedInUserProfile={this.props.toLoggedInUserProfile} logUserOut={this.props.logUserOut} backToTimeline={this.props.backToTimeline} searchedUser={this.props.searchedUser} users={this.props.users} loggedInUser={this.props.loggedInUser} startMachine={this.props.startMachine}/>
                <div className="profile-card">
                <Card>
                    <Image src={userImage} width="300" height="300"/>
                    {loggedInUser == selectedUser ?
                    null
                    :
                    <Button onClick={() => this.followFunction(this.props.selectedUser)}>{followButton}</Button>
                    }
                    <Card.Content>
                    <Card.Header>{this.props.selectedUser.username}</Card.Header>
                    </Card.Content>
                 </Card>
                 {loggedInUser == selectedUser ?
                 <Followmenu followersList={this.state.selectedUserFollowers} selectedUser={this.props.selectedUser} users={this.props.users}/>
                 :
                //  null
                 <Followmenu followersList={this.state.selectedUserFollowers} selectedUser={this.props.selectedUser} users={this.props.users}/>
                 
                }
                </div>
                 

                    <div className="user-tracks">
                    <div className="profile-sections">
                        <h3>{this.props.selectedUser.username}'s tracks</h3>
                        </div>
                    <div className="scroller-user-songs">
                        <Feed>
                    {this.props.selectedUser.songs.map((track) => {
                        return(
                            <Feed.Event>
                            <Feed.Content>
                        <div className="user-song">
                            <div className="track-name">
                            <h4>{track.name}</h4>
                            </div>
                            <Feed.Summary>
                            </Feed.Summary>
                            <Waveformpro track={track} />
                        </div>
                        </Feed.Content>
                        </Feed.Event>
                        )
                    })}
                    </Feed>
                    </div>
                    </div>
                    <div className="user-shared-tracks">
                        <div className="profile-sections">
                    <h3>{this.props.selectedUser.username}'s shared tracks</h3>
                    </div>
                    <div className="scroller-user-shared-songs">


                        
                        {this.props.selectedUser.sharedsongs.map((song) => {
                            return(
                                <div className="user-shared-song">
                                    <div className="user-shared-song-name">
                                    <h4>{song.name} by {this.findUsername(song)}</h4>
                                    </div>
                                    <Waveformpro track={song} />
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
import React,{Component} from 'react'
import Navbar from './Navbar'
import Followmenu from './followmenu'
import Waveform from './waveform'
import WaveSurfer from 'wavesurfer.js';
import { Button, Feed, Icon, Label, Card, Image} from 'semantic-ui-react'





class Profile extends Component{
    state = {
        userTracks: [],
        showFollowingList: false,
        showFollowersList: false,
        playing: false,
        followedByLoggedInUser: false
    }

    componentDidMount(){
        let loggedInUserFollowingList = this.props.loggedInUser.follows
        let selectedUser = this.props.selectedUser
        let found = loggedInUserFollowingList.find(follower => follower.followed_id == selectedUser.id)
        if (found){
            this.setState({followedByLoggedInUser: true})
        }

        // loggedinuser needs to be fetched inorder to get the updated follows list
        // following follows section on profile component needs to get updated as loggedinuser follows or unfollows the user.
        
    }

    componentWillUnmount(){

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
    .then(console.log)
    }

    unfollowUser = () =>{
        let loggedInUser = this.props.loggedInUser
        let followObj = loggedInUser.follows.find(obj => obj.followed_id == this.props.selectedUser.id)

        fetch(`http://localhost:3000/follows/${followObj.id}`, {
        method: "DELETE"
        })
        .then(resp => resp.json())
        .then(console.log)
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
        let userInstance = user
    
        if (this.state.followedByLoggedInUser){
            this.setState({
                followedByLoggedInUser: false
            })
            console.log("user to be unfollowed")
            this.unfollowUser()
            // unfollow user 
        } else {
            this.setState({
                followedByLoggedInUser: true
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
                 <Followmenu selectedUser={this.props.selectedUser} followingList={this.props.followingList} followersList={this.props.followersList} users={this.props.users}/>
                 :
                //  null
                 <Followmenu selectedUser={this.props.selectedUser} followingList={this.props.searchedUserFollowingList} followersList={this.props.searchedUserFollowersList} users={this.props.users}/>
                 
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
                            <Feed.Date>{this.getTrackDate(track)}</Feed.Date>
                            </Feed.Summary>
                            <Waveform track={track} />
                            {/* <div id={"wave-" + this.toString(track.id)}/> */}  
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
                                    <h4>{song.name} by {this.findUsername(song)}</h4>
                                    <Waveform track={song} />
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
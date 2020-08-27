import React,{ Component } from 'react'
import Navbar from './Navbar'
import { Redirect } from 'react-router-dom';
import { Button, Feed, Icon, Label } from 'semantic-ui-react'
import Comments from './comments'
import Waveform from './waveform'
import Explore from './explore'



class Timeline extends Component {
    state = {
        timeline: [],
        selectedSong: null,
        loggedInUserShares: [],
        loggedInUserSharedSongs: [],
        songNames: [],
        exploreSongs: []
    }



    componentDidMount(){
        let loggedInUser = this.props.loggedInUser
        this.getTimeline(loggedInUser.id)
        this.getExplore()
        let namesList = loggedInUser.sharedsongs.map(song => song.name)
         
         
        this.setState({loggedInUserShares: loggedInUser.shares, loggedInUserSharedSongs: loggedInUser.sharedsongs, songNames: namesList})

        // timeline needs to be sorted from recent to oldest. 

        

        // fetch(`http://localhost:3000/timeline/${loggedInUser.id}`)
        // .then(resp => resp.json())
        // .then(resp => {
             
        //     resp.tl_tracks.forEach((song) => {
        //         this.fetchEachSong(song.id)
        //     })
            
        // })
        // // this.state.timeline.forEach((song) => this.trackComments(song))
    }
    getExplore = () =>{
        fetch('http://localhost:3000/explore')
        .then(resp => resp.json())
        .then(resp => {
            this.setState({exploreSongs: resp.explore_songs})
        })
    }
    getTimeline = (id) =>{
        fetch(`http://localhost:3000/timeline/${id}`)
            .then(resp => resp.json())
            .then(resp => {
            //   resp.tl_tracks.forEach((track) => {
            //     if (!track.shared){
            //       track.shared = []
            //     }
            //   }) 
     
              this.setState({timeline: resp.tl_tracks})
                // resp.tl_tracks.forEach((song) => {
                //     this.fetchEachSong(song.id)
                // })
                
            })
      }
    

    // fetchEachSong = (id) => {
    //     // let timeline = this.state.timeline
    //     // let found = timeline.find((song) => song.id == id)
    //     // if (found){
    //     //     let filtered = timeline.filter((song) => song !== found)
    //     // }
        
         
    //     fetch(`http://localhost:3000/songs/${id}`)
    //     .then(resp => resp.json())
    //     .then(resp => {
              
    //         let filtered = this.state.timeline.filter((song) => song.id !== resp.song.id)
    //         filtered.push(resp.song)

             
    //         this.setState({
    //             timeline: filtered
    //         })
             
    //     })

    // }

    getTrackDate = (track) =>{
         
        let date = new Date(track.created_at)
        let time = date.toLocaleTimeString()

        let post = time.split(':').splice(0,2).join(':')
        let ampm = time.split(':')[2].split(' ')[1]

        return `${date.toLocaleDateString()}`

    }
    findUserName = (track) => {
         
        let allUsers = this.props.users 
        let found = allUsers.find((user) => user.id == track.user_id)
        return found.username
    }
    findUserImage = (track) => {
         
        let allUsers = this.props.users 
        let found = allUsers.find((user) => user.id == track.user_id)

        let userImage = require(`../pictures/${found.username}.png`)
        return userImage
    }
    playSong = (track) =>{
        let url = track.blob
        new Audio(`http://localhost:3000${url}`).play() 
    }

    trackComments = (track) =>{
        this.setState({selectedSong: track})

         
         
        // fetch(`http://localhost:3000/songs/${track.id}`)
        // .then(resp => resp.json())
        // .then(resp => { 
        //     debugger 
        // })
        

    }

    postComment = (commnt) =>{
         
        let comment = commnt 
        let song = this.state.selectedSong
        let selectedSongId = this.state.selectedSong.id
        let loggedInUserId = this.props.loggedInUser.id
        let commentObj = {
            user_id: loggedInUserId,
            song_id: selectedSongId,
            message: comment
        }
        fetch('http://localhost:3000/comments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                commentObj
            })
        })
        .then(resp => resp.json())
        .then(resp => {
             
            // this.props.getTimeline(this.props.loggedInUser.id)
            let selectedSong = this.state.selectedSong
            selectedSong.comments.push(resp.nu_comment)
            
             
            this.showTrackComments(selectedSong)
            // this.props.fetchEachSong(resp.nu_comment.song_id) 

            // this.setState({
            //     selectedSongComments: [...this.state.selectedSongComments, resp.nu_comment]
            // })
        })
        // this.trackComments(song)
    }

    getComments = (track)=>{
        let song = track
        let num 
        if (song.comments){
            num = song.comments.length
        } else {
            num = 0
        }
         
        return num
    }

    shareSongFunc = (track) =>{
        let loggedInUser = this.props.loggedInUser
        let loggedInUserSharedSongs = this.state.loggedInUserSharedSongs

        let sharedVersion = loggedInUserSharedSongs.find((song) => song.name === track.name)


        
         
        
        
         
        if (sharedVersion){
            this.unshareSong(sharedVersion, track)
        } else {
             
        let shareObj = {
            song_id: track.id,
            user_id: loggedInUser.id
        }
        
        fetch('http://localhost:3000/shares', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({shareObj})
        })
        .then(resp => resp.json())
        .then(resp => {
            let timeline = this.state.timeline
            let found = timeline.find(song => song == track)
            found.shared.push(resp.shared_obj)
            timeline.splice(timeline.indexOf(track), 1, found) 
            let songsList = this.state.songNames
            songsList.push(track.name)
            this.setState({
                loggedInUserShares: [...this.state.loggedInUserShares, resp.shared_obj],
                loggedInUserSharedSongs: [...this.state.loggedInUserSharedSongs, resp.shared_song],
                timeline: timeline,
                songNames: songsList
            })
            // need to update the shared songs shared prop in timeline as well
            // resp.shared_obj to be added on found.shared
            // this.props.getTimeline(this.props.loggedInUser.id)
        })
    }
    this.getExplore()
    }

    unshareSong = (sharedV, track) =>{
        // let shares = this.props.loggedInUser.shares
        // let found = shares.find((share) => share.sharedsong_id == track.id)
        let loggedInUserShares = this.state.loggedInUserShares
        let loggedInUserSharedSongs = this.state.loggedInUserSharedSongs

        let filteredShares = loggedInUserShares.filter(share => share.sharedsong_id !== sharedV.id)
        let filteredSharedSongs = loggedInUserSharedSongs.filter(song => song.id !== sharedV.id)
        let filteredSongShares = track.shared.filter(song => song.sharedsong_id !== sharedV.id)
        track.shared = filteredSongShares
        let updatedTrack = track
        let timeline = this.state.timeline
        timeline.splice(timeline.indexOf(track), 1, updatedTrack)
        let filteredSongNames = this.state.songNames.filter(song => song !== track.name)
        this.setState({timeline: timeline, songNames: filteredSongNames})
         

         

        fetch(`http://localhost:3000/sharedsongs/${sharedV.id}`, {
            method: "DELETE"
        })
        .then(resp => resp.json())
        this.setState({
            loggedInUserShares: filteredShares,
            loggedInUserSharedSongs: filteredSharedSongs
        })
        // this.props.fetchEachSong(track.id)
        // this.props.reFetchLoggedInUser(this.props.loggedInUser.id)
        // this.props.getTimeline(this.props.loggedInUser.id)
    }

    showTrackComments = (track) =>{
         
        this.setState({selectedSong: track})
    }

    closeComments = () =>{
        this.setState({
            selectedSong: null
        })
    }

    songCommentCount = (song) =>{
        let songC = song
        return song.comment_count
         
    }

    
    render(){
        if (this.props.selectedUser){
            return <Redirect to="/profile" />
        }
     
        return(
            <div>
                <Navbar toLoggedInUserProfile={this.props.toLoggedInUserProfile} logUserOut={this.props.logUserOut} backToTimeline={this.props.backToTimeline} searchedUser={this.props.searchedUser} users={this.props.users} loggedInUser={this.props.loggedInUser} startMachine={this.props.startMachine}/>
                <Explore users={this.props.users} exploreSongs={this.state.exploreSongs}/>
                <div className="timeline">
                    <Feed>
                    {this.state.timeline.map((track) =>{
                        return(
                            <Feed.Event>
                            <Feed.Label>
                            <div className="tl-image">
                            <img src={this.findUserImage(track)} />
                            </div>
                            </Feed.Label>
                                <div className='timeline-song'>
                            <Feed.Content>
                            <Feed.Summary>
                                <div className="timeline-song-letters">

                                
                            <Feed.User>{this.findUserName(track)}</Feed.User>: {track.name}
                            <Feed.Date>{this.getTrackDate(track)}</Feed.Date>
                            </div>
                            </Feed.Summary>
                            <Feed.Meta>
                            <div className="experiment">
                            <Waveform track={track} />
                            </div>
                            <div className="timeline-buttons">
                            <Button onClick={() => this.showTrackComments(track)} as='div' labelPosition='left'>
                            <Label as='a' basic>
                                {track.comments.length}
                            </Label>
                            <Button icon>
                                {track.comments.length > 0 ?
                                <Icon name='comment' />
                                :
                                <Icon name='comment outline' />
                            }
                            </Button>
                            </Button>
                            <Button as="div" labelPosition='left' onClick={() => this.shareSongFunc(track)}>
                                <Label as='a' basic>
                                    {track.shared.length}
                                </Label>
                                <Button icon>
                                    {this.state.songNames.includes(track.name) ?
                                    <Icon name='bookmark' />
                                    :
                                    <Icon name="bookmark outline" />
                                }
                                </Button>
                            </Button>
                            </div>
                            {/* <Feed.Like>
                            <Icon name='retweet' />4 Likes
                            </Feed.Like> */}
                            </Feed.Meta>
                            </Feed.Content>
                            </div>

                            </Feed.Event>
                        
                        )
                    })}
                    </Feed>
                </div>
                {this.state.selectedSong ?
                <Comments closeComments={this.closeComments} postComment={this.postComment} allUsers={this.props.users} loggedInUser={this.props.loggedInUser} selectedSong={this.state.selectedSong}/>
            :
            null
            }
            </div>
        )
    }
}

export default Timeline 
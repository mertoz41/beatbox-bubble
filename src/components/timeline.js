import React,{ Component } from 'react'
import Navbar from './Navbar'
import { Redirect } from 'react-router-dom';
import { Button, Feed, Icon, Label } from 'semantic-ui-react'
import Comments from './comments'
import Waveform from './waveform'
import Explore from './explore'
import {connect} from 'react-redux'
import store from '../redux/store'
import Timelinefeed from './timelinefeed'



class Timeline extends Component {
    state = {
        selectedSong: null,
        loggedInUserSharedObjects: [],
        loggedInUserSharedSongs: [],
        sharedSongNames: [],
        exploreSongs: [],
        showExplore: false
    }



    componentDidMount(){

        let loggedInUser = this.props.loggedInUser
        this.getExplore()
        let namesList = loggedInUser.sharedsongs.map(song => song.name)
        this.setState({loggedInUserSharedObjects: loggedInUser.shares, loggedInUserSharedSongs: loggedInUser.sharedsongs, sharedSongNames: namesList})

    }

    getExplore = () =>{

        // explore section content

        fetch('http://localhost:3000/explore')
        .then(resp => resp.json())
        .then(resp => {
            this.setState({exploreSongs: resp.explore_songs})
        })

    }





    postComment = (commnt) =>{
        // create comment object for post request
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
            // comment object is added to the selected song to be displayed in comments section. 
            let selectedSong = this.state.selectedSong
            selectedSong.comments.push(resp.nu_comment)
            this.showTrackComments(selectedSong)
           
        })
    }
  

    shareSongFunc = (track) =>{
        // determine whether song exists inside logged in users shared songs list.
        let loggedInUserSharedSongs = this.state.loggedInUserSharedSongs
        let sharedVersion = loggedInUserSharedSongs.find((song) => song.name === track.name)

        if (sharedVersion){
            // call unshare func.
            this.unshareSong(sharedVersion, track)
        } else {
            // create a share obj for post request. 
             
        let shareObj = {
            song_id: track.id,
            user_id: this.props.loggedInUser.id
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
            let exploreSongs = this.state.exploreSongs
            let exploredVersion = exploreSongs.find((song) => song.name == track.name)
            // update explored songs section

            if (exploredVersion){
                exploredVersion.shares.push(resp.shared_obj)
                exploreSongs.splice(exploreSongs.indexOf(track), 1, exploredVersion)
                this.setState({exploreSongs: exploreSongs})
            }
            // update songs shared list, timeline, logged in users shared objects and songs, and shared song names list
             
            let foundSong = timeline.find(song => song == track)
            foundSong.shared.push(resp.shared_obj)
            timeline.splice(timeline.indexOf(track), 1, foundSong) 
            let songsList = this.state.sharedSongNames
            songsList.push(track.name)
            this.setState({
                loggedInUserSharedObjects: [...this.state.loggedInUserSharedObjects, resp.shared_obj],
                loggedInUserSharedSongs: [...this.state.loggedInUserSharedSongs, resp.shared_song],
                timeline: timeline,
                sharedSongNames: songsList
            })
        
        })
    }
    }

    unshareSong = (sharedV, track) =>{

        // update shared objects
        let loggedInUserSharedObjects = this.state.loggedInUserSharedObjects
        let filteredShares = loggedInUserSharedObjects.filter(share => share.sharedsong_id !== sharedV.id)


        // update shared songs
        let loggedInUserSharedSongs = this.state.loggedInUserSharedSongs
        let filteredSharedSongs = loggedInUserSharedSongs.filter(song => song.id !== sharedV.id)

        // update track's shared prop and push it back to timeline.
        let filteredSongShares = track.shared.filter(song => song.user_id !== this.props.loggedInUser.id)
        track.shared = filteredSongShares
        let updatedTrack = track
        let timeline = this.state.timeline
        timeline.splice(timeline.indexOf(track), 1, updatedTrack)

        // update sharedSongNames which is used to show whether song is shared or not. 
        let filteredSongNames = this.state.sharedSongNames.filter(song => song !== track.name)

        // update explore section if unshared song exists in exploreSongs. 
        let exploreSongs = this.state.exploreSongs
        let exploredVersion = exploreSongs.find((song) => song.name == track.name)
        if (exploredVersion){
        let filteredShares = exploredVersion.shares.filter(share => share.user_id !== this.props.loggedInUser.id)
        exploredVersion.shares = filteredShares
        exploreSongs.splice(exploreSongs.indexOf(exploredVersion), 1, exploredVersion)
        this.setState({exploreSongs: exploreSongs})
        }

        this.setState({
            timeline: timeline,
            sharedSongNames: filteredSongNames
        })

        fetch(`http://localhost:3000/shares/${this.props.loggedInUser.id}`, {
            method: "DELETE"
        })
        .then(resp => resp.json())
        this.setState({
            loggedInUserSharedObjects: filteredShares,
            loggedInUserSharedSongs: filteredSharedSongs
        })
   
    }

    showTrackComments = (track) =>{
        this.setState({selectedSong: track})
    }

    closeComments = () =>{
        this.setState({
            selectedSong: null
        })
    }


    showExploreSect = () =>{
        // display explore section
        this.setState({
            showExplore: !this.state.showExplore
        })
    }

    
    render(){
        
     
        return(
            <div>
                <Navbar getTimeline={this.props.getTimeline} toLoggedInUserProfile={this.props.toLoggedInUserProfile} logUserOut={this.props.logUserOut} backToTimeline={this.props.backToTimeline} searchedUser={this.props.searchedUser} users={this.props.users} loggedInUser={this.props.loggedInUser} startMachine={this.props.startMachine}/>
                <div onClick={() => this.showExploreSect()} className="explore-writing">
                    <h3>Explore</h3>
                </div>
                {this.state.showExplore ?
                    <Explore users={this.props.users} exploreSongs={this.state.exploreSongs}/>
                : 
                    null   
                }
                <div className="timeline">
                    <div className="timeline-writing">
                        <h3>Timeline</h3>
                    </div>
                    <div className="timeline-scroller">
                        <Timelinefeed showTrackComments={this.showTrackComments}/>
                    </div>
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

const mapStateToProps = (state) =>{
    return {
        loggedInUser: state.loggedInUser,
        users: state.users,
        timeline: state.timeline
    }
}

export default connect(mapStateToProps)(Timeline) 
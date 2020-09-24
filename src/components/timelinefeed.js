import React, { Component } from 'react'
import { Button, Feed, Icon, Label } from 'semantic-ui-react'
import Waveform from './waveform'
import {connect} from 'react-redux'


export class Timelinefeed extends Component {

    state = {
        loggedInUserSharedObjects: [],
        loggedInUserSharedSongs: [],
        sharedSongNames: [],
    }
    componentDidMount(){

        let loggedInUser = this.props.loggedInUser
        let namesList = loggedInUser.sharedsongs.map(song => song.name)
        this.setState({loggedInUserSharedObjects: loggedInUser.shares, loggedInUserSharedSongs: loggedInUser.sharedsongs, sharedSongNames: namesList})

    }


    findUserImage = (track) => {
         
        let allUsers = this.props.users 
        let found = allUsers.find((user) => user.id == track.user_id)
        let userImage = require(`../pictures/${found.username}.png`)
        return userImage

    }

    findUserName = (track) => {
         
        let allUsers = this.props.users 
        let found = allUsers.find((user) => user.id == track.user_id)
        return found.username

    }
    getTrackDate = (track) =>{
         
        let date = new Date(track.created_at)
        let time = date.toLocaleTimeString()
        let post = time.split(':').splice(0,2).join(':')
        let ampm = time.split(':')[2].split(' ')[1]
        return `${date.toLocaleDateString()}`

    }

    showTrackComments = (track) =>{
        this.setState({selectedSong: track})
    }




    render() {
        return (
            <div>
                <Feed>
                    {this.props.timeline.map((track) =>{
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
                            <Button onClick={() => this.props.showTrackComments(track)} as='div' labelPosition='left'>
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
                                    {this.state.sharedSongNames.includes(track.name) ?
                                    <Icon name='bookmark' />
                                    :
                                    <Icon name="bookmark outline" />
                                }
                                </Button>
                            </Button>
                            </div>
                            </Feed.Meta>
                            </Feed.Content>
                            </div>

                            </Feed.Event>
                        
                        )
                    })}
                    </Feed>
                
            </div>
        )
    }
} 
const mapStateToProps = (state) =>{
    return{
        timeline: state.timeline,
        users: state.users,
        loggedInUser: state.loggedInUser
    }
}

export default connect(mapStateToProps)(Timelinefeed)

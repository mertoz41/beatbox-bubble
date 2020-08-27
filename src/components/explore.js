import React, { Component } from 'react'
import { Button, Feed, Icon, Label } from 'semantic-ui-react'
import Waveform from './waveform'


class Explore extends Component{
    // waveforms on explore section looks awkward.
    // samesong appears twice with different entitities
    findUserImage = (track) => {
         
        let allUsers = this.props.users 
        let found = allUsers.find((user) => user.id == track.user_id)

        let userImage = require(`../pictures/${found.username}.png`)
        return userImage
    }

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

    render(){
        return(
            <div>
                <div className="explore">
                <div className="explore-writing">
                <h3>Explore</h3>
                </div>
                <div className="timeline-scroller">
                    <Feed>
                    {this.props.exploreSongs.map((track) =>{
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
                            <div className="explore-bubble">
                            <Waveform track={track} />
                            </div>
                            <div className="timeline-buttons">
                            {/* <Button onClick={() => this.showTrackComments(track)} as='div' labelPosition='left'>
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
                            </Button> */}
                            <Button as="div" labelPosition='left'>
                                <Label as='a' basic>
                                    {track.shares.length}
                                </Label>
                                <Button icon>
                                    <Icon name='bookmark' />
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
                </div>
            </div>
        )
    }
}


export default Explore
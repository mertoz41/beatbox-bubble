import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Feed} from 'semantic-ui-react'
import Waveformpro from './waveformpro'



export class Usersongs extends Component {
    render() {
        return (
            <div className="scroller-user-songs">
                <Feed>
                    {this.props.searchedUser.songs.map((track) => {
                        return(
                            <Feed.Event>
                                <Feed.Content>
                                    <div className="user-song">
                                        <div className="track-name">
                                            <h4>{track.name}</h4>
                                        </div>
                                        <Waveformpro track={track} />
                                    </div>
                                </Feed.Content>
                            </Feed.Event>
                        )})}
                </Feed>
                
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        searchedUser: state.searchedUser
    }
}

export default connect(mapStateToProps)(Usersongs)

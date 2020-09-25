import React, { Component } from 'react'
import { connect } from 'react-redux'
import Waveformpro from './waveformpro'

export class Usersharedsongs extends Component {
    findUsername = (song) =>{
        let user_id = song.user_id
        let users = this.props.users 
        let found = users.find((user) => user.id == user_id)
        return found.username
    }
    render() {
        return (
            <div className="scroller-user-shared-songs">
                {this.props.searchedUser.sharedsongs.map((song) => {
                    return(
                        <div className="user-shared-song">
                            <div className="user-shared-song-name">
                                <h4>{song.name} by {this.findUsername(song)}</h4>
                            </div>
                            <Waveformpro track={song} />
                        </div>
                            )})}
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        searchedUser: state.searchedUser,
        users: state.users
    }
}

export default connect(mapStateToProps)(Usersharedsongs)

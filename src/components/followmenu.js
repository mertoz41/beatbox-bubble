import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import Followinglist from './followinglist'
import Followerslist from './followerslist'


class Followmenu extends Component{
    state = {
        active: "following"
    }

    handleItemClick = (event) =>{ 
         
        let active = event
        this.setState({
            active: active
        })
         
    }
    render(){
        return(
            <div className="follow-menu">
                <Menu tabular>
        <Menu.Item name='following' value={this.state.active} active={this.state.active === 'following'} onClick={() => this.handleItemClick("following")}>Following {this.props.followingList.length}</Menu.Item>
                <Menu.Item name='followers' active={this.state.active === 'followers'} value={this.state.active} onClick={() => this.handleItemClick("followers")}>Followers {this.props.followersList.length}</Menu.Item>
                </Menu>
                {this.state.active === "following" ?
                <div className="following-list">
                <Followinglist followingList= {this.props.followingList} users={this.props.users}/>
                </div>
                :
                <div className="followers-list">
                <Followerslist followersList= {this.props.followersList} users={this.props.users}/>
                </div>
                }
            </div>
        )
    }
}

export default Followmenu
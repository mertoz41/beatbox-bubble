import React, { Component } from 'react'
import { Button, Comment, Form, Header, Icon } from 'semantic-ui-react'
import Commenting from './commenting'



class Comments extends Component {
    state = {
        comment: "",
        allComments: []
    }

    // componentDidMount(){
    //     let song = this.props.selectedSong
    //     this.fetchComments(song.id)
       
    // }
    fetchComments = (id) =>{
         

        fetch(`http://localhost:3000/songs/${id}`)
        .then(resp => resp.json())
        .then(resp => { 
            debugger 
            this.setState({allComments: resp.comments})
        })
    }

    fixState = (event) =>{
        let comment = event.target.value
        console.log(comment)
        this.setState({comment: comment})
    }
   
    // postComment = (event) =>{
    //     event.preventDefault()
    //     let comment = this.state.comment
    //     let user = this.props.loggedInUser
    //     let song = this.props.selectedSong
    //     let commentObj = {
    //         user_id: user.id,
    //         song_id: song.id,
    //         message: comment
    //     }
    //     fetch('http://localhost:3000/comments', {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             commentObj
    //         })
    //     })
    //     .then(resp => resp.json())
    //     .then(resp => {
    //         this.setState({allComments: resp.allComments}) 
    //     })
        
         
    // }

    commentor =(comment) =>{
        let allUsers = this.props.allUsers
         
        let found = allUsers.find((user) => user.id === comment.user_id)
        return found.username
    }

    userImage =(comment) =>{
        let allUsers = this.props.allUsers
        let found = allUsers.find((user) => user.id === comment.user_id)

        let userImage = require(`../pictures/${found.username}.png`)
        return userImage
    }

    commentDate = (comment) =>{
        let date = new Date(comment.created_at)
        let time = date.toLocaleTimeString()

        let post = time.split(':').splice(0,2).join(':')
        let ampm = time.split(':')[2].split(' ')[1]

        return `${post} ${ampm} - ${date.toLocaleDateString()}`
    }


    render(){
        return(
            <div className="comments">
                <Comment.Group>
                <Header as='h3' dividing>
                    {this.props.selectedSong.name}
                    <div className="close-comments">
                    <Button icon onClick={this.props.closeComments}><Icon name="times"/></Button>
                    </div>
                </Header>
                <div className="comments-scroller">

                {this.props.selectedSong.comments.map((comment) =>{
                    return(
                    <Comment>
                <Comment.Avatar src={this.userImage(comment)} />
                <Comment.Content>
                <Comment.Author as='a'>{this.commentor(comment)}</Comment.Author>
                <Comment.Metadata>
                    <div>{this.commentDate(comment)}</div>
                </Comment.Metadata>
                <Comment.Text>{comment.message}</Comment.Text>
                </Comment.Content>
                </Comment>

                    )
                })}
                </div>

                <Commenting postComment={this.props.postComment}/> 
                {/* <Form reply onSubmit={event => this.postComment(event)}>
                <Form.TextArea onChange={event => this.fixState(event)} value={this.state.comment}/>
                <Button content='Add Comment' labelPosition='left' icon='edit' primary />
                </Form> */}
                </Comment.Group>
            </div>
        )
    }
}

export default Comments
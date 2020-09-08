import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'


class Commenting extends Component{
    state = {

        comment: ""

    }
    resetState = ()=>{

        this.setState({comment: ""})
    }

    fixState = (event) =>{

        let comment = event.target.value
        this.setState({comment: comment})

    }

    postComment = (event) =>{

        event.preventDefault()
        let comment = this.state.comment
        this.props.postComment(comment)
        this.resetState()

    }
    render(){
        return(
            <div className="commenting-box">
                <Form reply onSubmit={event => this.postComment(event)}>
                    <Form.TextArea placeholder="comment goes here" onChange={event => this.fixState(event)} value={this.state.comment}/>
                    <Button content='Add Comment' labelPosition='left' icon='edit' primary />
                </Form>
            </div>
        )
    }
}
export default Commenting
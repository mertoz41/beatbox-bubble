import React,{Component} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon} from 'semantic-ui-react'




class Login extends Component {

    state = {
        username: "",
        password: ""
    }

    fixState = (event) =>{
        let name = event.target.name
        let value = event.target.value
        this.setState({[name]: value})
    }
    
    login = (event) =>{
      event.preventDefault()
      let user = {
        username: this.state.username,
        password: this.state.password
      }
      this.props.logUser(user)


       
         
     
        // fetch('http://localhost:3000/login', {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "Accept" : "application/json"
        //   },
        //   body: JSON.stringify(this.state)
        // })
        // .then(resp => resp.json())
        // .then(resp => {
        //     if(resp.user){
        //         this.props.logUser(resp.user)
        //     } else {
        //         alert(resp.message)
        //     }
             
        // })
    }


    render(){
        return(
            <div>
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
    <h1>Beatbox Bubble</h1>
    <div className="login-icon">
    <Icon.Group size='big'>
    <Icon size='big' name='microphone'/>
  </Icon.Group>
  </div>
      <Header as='h2' color='black' textAlign='center'>
     
        Log in to your account
      </Header>
      <Form size='large' onSubmit={event => this.login(event)}>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' name="username" onChange={event => this.fixState(event)}/>
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
            name='password'
            onChange={event => this.fixState(event)}
          />

          <Button color='grey' fluid size='large'>
            Login
          </Button>
        </Segment>
      </Form>
    </Grid.Column>
    </Grid>
            </div>
        )
    }
}

export default Login
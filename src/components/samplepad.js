import React,{Component} from 'react'
import { Button, Icon } from 'semantic-ui-react'





class SamplePad extends Component {
 

    
    render(){

        let letter = Object.keys(this.props.sample)[0]
        
        return(
            <div className="samplePad">
                <p>{letter}</p>
                <Button icon onClick={() => this.props.deleteSample(this.props.sample)}><Icon name="trash"/></Button>
                <Button icon onClick={() => this.props.addPattern(this.props.sample)}><Icon name="fork"/></Button>
            </div>
        )
    }
}

export default SamplePad
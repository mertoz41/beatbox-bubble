import React,{Component} from 'react'
import Pad from './pad'
import { Button, Icon } from 'semantic-ui-react'


class Pads extends Component {
    volumeButton = (index) =>{
        console.log(index)
        let list = this.props.mutedList
        let button 
        if (list.includes(index)){
            button = "volume off"
        } else {
            button = "volume up"
        }
        return button 
         

    }

    render(){
        

        return(
            <div className='pads'>

                {this.props.namedChannels.map((obj, rowIndex) => {
                    return(
                        
                        <div className="row" key={rowIndex}>
                            <p>{Object.keys(obj)[0]}</p>
                            <div>
                                <Button Icon onClick={()=> this.props.mute(rowIndex)}><Icon name={this.volumeButton(rowIndex)}/></Button>
                            </div>

                            {obj[Object.keys(obj)[0]].map((pad, index) =>{
                                return < Pad
                                key={index} 
                                rowIndex={rowIndex}
                                id={index}
                                state={pad}
                                pos={this.props.pos}
                                toggleActive={() => this.props.toggleActive(rowIndex, index)}
                                />
                            })}
                            </div>
                            
                    )
                })}
                
            </div>
        )
    }
}

export default Pads 
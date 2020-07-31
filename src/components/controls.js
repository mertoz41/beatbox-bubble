import React from 'react'
import { Button, Icon } from 'semantic-ui-react'


const Controls = (props) => {
    let buttonText = props.playing? 'pause' : 'play'

    return (
        <div className='controls'>
            <h3>Sequence Player</h3>
            <Button Icon onClick={()=> props.togglePlaying()}><Icon name={buttonText}/></Button>
            <Button onClick={()=> props.addPad()}><Icon name="plus"/></Button>
            <Button onClick={()=> props.removePad()}><Icon name="minus" /></Button>
            <div className="bpm">
            <label>BPM:</label>
            <input 
            type="range" 
            id="bpm" 
            min="1" 
            max="420" 
            step="1" 
            defaultValue={props.bpm} 
            onChange={event => props.handleBpmChange(event)} />
        <output>
        { props.bpm }
        </output>
</div>

        </div>
    )
}

export default Controls 
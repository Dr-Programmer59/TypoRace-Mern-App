import React from 'react'
import './TimeRace.css'
function TimerRace(props) {
  const {counter}=props;

  return (
    <div className='timer'>
      <span>{counter}</span>

        
    </div>
  )
}

export default TimerRace
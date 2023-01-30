import React from 'react'
import './Home.css'
function Popup(props) {
  return (props.trigger)?(
    <div className="popup">
        <div className="inner-popup">
            <button className="closebtn" onClick={()=>props.closeTrigger(false)}>Close</button>
            {props.children}
        </div>
    </div>
  ):""
}

export default Popup
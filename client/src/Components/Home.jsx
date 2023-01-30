import React from 'react'
import logo from './logo.png'
import start from './start.png'
import './Home.css'
import Popup from './Popup'
import { useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
const socket= io.connect(" https://e075-59-103-245-59.in.ngrok.io",{secure: true})
function Tabs(props){
    const [tabsIndex, settabsIndex] = useState(1)
    const [Room, setRoom] = useState()
    const [roomTojoin, setroomTojoin] = useState("")
    
    const navigate=useNavigate();

    const createRoom=()=>{

        console.log("in the creatingbtn")
        const userId=socket.id;
        let data={name:Room,userId} 
        socket.emit("create-room",data);

    }

    const joinRoom=()=>{
        const socket_id=socket.id;

        socket.emit("check-room",{roomId:roomTojoin,socket_id})
        

    }
    console.log(props.check)
    return(
        <div className="container">
            <div className="bloc-tabs">
                <div className={(tabsIndex==1)?"tabs active-tabs":"tabs"} onClick={()=>settabsIndex(1)}>Create</div>
                <div className={(tabsIndex==2)?"tabs active-tabs":"tabs"} onClick={()=>settabsIndex(2)}>Join</div>
            </div>
            <div className="content-tabs">
                <div className={(tabsIndex==1)?"content active-content":"content"} onClick={()=>settabsIndex(1)}>
                    <div>
                    Name of the Room:
                    <input type="text" onChange={(value)=>setRoom(value.target.value)}/>
                    </div>
                    
                   
                    <button className='btn' onClick={createRoom}>Create</button>
                </div>
                <div className={(tabsIndex==2)?"content active-content":"content"} onClick={()=>settabsIndex(2)}>
                    

                <div>
                    Link of the Room:
                    <input type="text" onChange={(value)=>setroomTojoin(value.target.value)}/>
                    </div>
                   
                    {props.check?
                    <p style={{color:'red'}}>*Room is not availble</p>
                    :""
                    }
                    <button className='btn' onClick={joinRoom}>Join</button>
                    
                </div>
            </div>
        </div>
    )
}

function Home() {
    const [closePopup, setclosePopup] = useState(false)
    const [check, setcheck] = useState(false)
    const navigate=useNavigate();

    useEffect(() => {
        
        socket.on("created-room",(data)=>{
            console.log("Reactinrg room")
            console.log(data);
            navigate(`/room/${Object.values(data)[0]}`)


            
        })
        socket.on("checked-room",({check,roomId})=>{
            // console.log("abc")
            if (check){
                setcheck(false)
                navigate(`room/${roomId}`);

            
            }
            else{
                // console.log("123")
                if(!check)
                setcheck(true)
            }
            

        })
      }, [socket]);
 
    
    return (

        <div>
            <Popup trigger={closePopup} closeTrigger={setclosePopup} >
                <Tabs check={check}/>
            </Popup>
            <div className="navBar">
                <div className="logo">
                    <img src={logo} />
                </div>
                <div className="btn">
                    <button className="btnL">Login</button>
                    <button className="btnS">SignUp</button>
                </div>

            </div>
            <div className="section">
                <img src={start} alt="" />
                 <div className="btn">
                    <button >Start</button>
                    <button onClick={()=>setclosePopup(true)} >Room</button>
                </div>
            </div>
        </div>
    )
}

export default Home
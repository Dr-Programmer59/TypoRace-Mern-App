
import './Type.css';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Car from './Car';
import TimerRace from './TimerRace/TimerRace';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client'
const socket = io.connect(" https://e075-59-103-245-59.in.ngrok.io",{secure: true})



const getCloud = () => `cereal deny undress virus capture ideology descent joke similar publisher spokesperson damage north bed acquisition goal slime magnitude quarter review slogan traffic convince alcohol auction`.split(' ').sort(() => Math.random() > 0.5 ? 1 : -1)
function Timer(props) {
  const [timeElapsed, settimeElapsed] = useState(0)

  useEffect(() => {
    let id
    
    if (props.startCounter) {
      id = setInterval(() => {
        settimeElapsed((time) => time + 1)
      }, 1000);

    }
    
    return () => {
      clearInterval(id)
    }
  }, [props.startCounter])
  const speed = ((props.wordsCorrect / (timeElapsed / 60)) || 0).toFixed(2);
  return <div className='information'>
    <p>Time Passed:{timeElapsed}</p>
    <p>Speed:{speed}</p>
  </div>
}
function FilterWords(props) {

  const { active, correct, text } = props;
  if (active) {
    return <span className='active'>{text} </span>

  }
  if (correct) {
    return <span className='correct'>{text} </span>
  }
  if (correct === false) {
    return <span className='wrong'>{text} </span>
  }


  return <span>{text} </span>

}
FilterWords = React.memo(FilterWords)
function Type() {

  const [username, setusername] = useState("")
  const [carIndex, setcarIndex] = useState({})
  const [roomName, setroomName] = useState("")
  // const [socketData, setsocketData] = useState({})
  const { roomId } = useParams();
  const [userInput, setUserInput] = useState('')
  const cloud = useRef(getCloud())
  const [activWordIndex, setactivWordIndex] = useState(0)
  const [wordsCorrect, setwordsCorrect] = useState([])
  const [startCounter, setstartCounter] = useState(false)
  const [wordCharCounter, setwordCharCounter] = useState(0)
  const [userCar, setuserCar] = useState({})
  const [startRace, setstartRace] = useState(false)
  const [raceTimer, setraceTimer] = useState(10)
  const [positions, setpositions] = useState({})
  const [written, setwritten] = useState(false)

  
  const startRaceEvent=()=>{
    socket.emit("start-race",{roomId})
  }








  useEffect(() => {

    let username = prompt("Enter your user name:");
    setusername(username);
    let data = {}
    data[username] = roomId;
    socket.emit("join-room", data)
    let updatedata = {}
    updatedata[username] = 0
    setcarIndex((old_Data) => ({
      ...old_Data,
      ...updatedata
    }))
    console.log("first")
    console.log(Object.keys(carIndex).length)
    console.log(carIndex)

    
    socket.emit("check-admin",{socketId:roomId})


  }
    , [])

  useEffect(() => {
    // console.log("position is")
    // console.log(Object.keys(positions).length)
    // console.log(Object.keys(carIndex).length)
      if(Object.keys(carIndex).length==Object.keys(positions).length && Object.keys(carIndex).length!=0)
      {
        socket.emit("disconnect-race",{roomId})
      }
    
      
    }, [positions])

  useEffect(() => {
      let id
      if (raceTimer>0 && startRace) {
        id = setInterval(() => {
          setraceTimer((time) => time -1)
        }, 1000);
  
      }
      return () => {
        clearInterval(id)
  
  
      }
    }, [startRace])



  const sendMessage = (carInd) => {
    let sendingData = {};
    sendingData[username] = carInd;
    sendingData['socket_id'] = roomId

    socket.emit("send_message", sendingData)
  }
  useEffect(() => {
    socket.on('position-assign',(data)=>{
      let newdata={};
      newdata[Object.keys(data)[0]]=Object.values(data)[0];

      setpositions((oldData)=>({
        ...oldData,
        ...newdata
      }))
    })
    socket.on('is-admin',(data)=>{
    })
    socket.on("started-race",(data)=>{
      setstartRace(true)
    })


    socket.on("new-user", (data) => {
      let carsdata = {}
      let newdata = {}
      data.map((value, index) => {
        if (value['socket_id'] == roomId) {
          newdata[value['user_name']] = 0;
          carsdata[value['user_name']] = value['car'];
        }


      })
      setcarIndex((old_Data) => ({
        ...old_Data,
        ...newdata

      }))
      setuserCar((old_Data) => ({
        ...old_Data,
        ...carsdata

      }))

    })


    socket.on("receive_message", (data) => {

      setcarIndex((old_Data) => ({
        ...old_Data,
        ...data

      }))

    })
  }, [socket]);


  function processInput(value) {
    if (value.endsWith(' ') && value.trim()==cloud.current[activWordIndex].trim() && !written) {
      setwordCharCounter(0);
      sendMessage(activWordIndex)
      let data = {}
      data[username] = activWordIndex;
      setcarIndex((old_Data) => ({
        ...old_Data,
        ...data

      }))
      if (activWordIndex == cloud.current.length - 1) {
        setstartCounter(false)
        setwritten(true)
        socket.emit("complete-race",{user_name:username,roomId})
        
        setUserInput('You have completed')
        return
      }
      if (!startCounter) {
        setstartCounter(true)
      }
      setwordsCorrect((data) => {
        const word = value.trim()
        const preData = [...data];
        preData[activWordIndex] = word === cloud.current[activWordIndex]
        return preData;

      })
      setactivWordIndex(index => index + 1)
      setUserInput('')


    }
    else if(!written) {
      if (value[wordCharCounter] == cloud.current[activWordIndex][wordCharCounter]) {
        setwordCharCounter(oldValue => oldValue + 1);
        setUserInput(value)
      }
    }
  }
  return (
    <div>
      {
        (raceTimer>0 && startRace)?
      <TimerRace counter={raceTimer}/>
      :""
      
      
      }
      <h1>
        Typing Speed
      </h1>
      <div className='mainBody'>
        <Car carPos={carIndex} carImg={userCar} positions={positions} />
        <div>
          
          {
            (startRace)?
          
            <div id='textTowrite'>
              <Timer
            startCounter={startCounter}
            wordsCorrect={wordsCorrect.filter(Boolean).length}
          />

            <p>{cloud.current.map((word, count) => {
              return <FilterWords

                active={count === activWordIndex}
                correct={wordsCorrect[count - 1]}
                text={word}
              />
            })}</p>
            <input
              type="text"
              value={userInput}
              onChange={(e) => processInput(e.target.value)}
              className='textToinput'

            />
          </div>
          :<div>
            Waiting for the players...
            <button style={{width:100,height:40,marginRight:50 }} onClick={startRaceEvent}>Start Race</button>
            </div>
        
          }
          </div>
      </div>
    </div>
  );
}

export default Type;

import React from 'react'
import './Type.css'
import carImg from './car.png'
import car1 from './cars/1.png'
import car2 from './cars/2.png'
import car3 from './cars/3.png'
import car4 from './cars/4.png'
import car5 from './cars/5.png'
import car6 from './cars/6.png'
const cars=[car1,car2,car3,car4,car5,car6];



function Car(props) {
  const cars_names = Object.keys(props.carPos)
  const cars_indexes = Object.values(props.carPos)
  // console.log(props.carImg)




  return (
    <div className="body">
      {
        cars_names.map((value, index) => {
          return <div>
            <div className="name">
                {`${value}(${props.positions[value]?props.positions[value]:""})`}

              </div>
            <div className='carGridBody'>

              
              <div className="carGrid">

                <div style={{ gridColumnStart: cars_indexes[index] + 1, gridRowStart: cars_indexes[index] + 1 }}>
                  {/* {console.log(props.carImg[value])} */}
                  <img src={cars[props.carImg[value]-1]} style={{ maxWidth: 100, maxWidth: 100 }} />

                </div>

              </div>
              <div className="line"></div>



            </div>



          </div>


        })
      }
    </div>


  )
}

export default Car
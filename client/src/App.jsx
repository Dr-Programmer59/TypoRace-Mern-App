import logo from './logo.svg';
import './App.css';
import { useState , useEffect,useRef} from 'react';
import React from 'react';
import {BrowserRouter as Router, Routes, Route,Navigate} from 'react-router-dom';

import Type from './Components/Type';
import Home from './Components/Home';
function App() {
  return (
    <Router>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/room/:roomId' element={<Type/>}/>
      {/* <Route path='/drawing' element={<Check/>}/>
            <Route path='*' element={<Navigate to='/' />} />

      <Route path='/drawing/:roomId' element={<Check/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/> */}
    </Routes>
  </Router>


  
  )
}

export default App;

import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Profile from './components/auth/Profile'
import { LandingPage } from './components/landing_page/LandingPage'
import Folders from './components/Folders/Folders'
import Home from './components/home/Home'
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/folders' element={<Folders/>} />
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </Router>
  )
}

export default App

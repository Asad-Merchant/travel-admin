import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import {ToastContainer} from 'react-toastify'
import "react-toastify/ReactToastify.css"

function App() {

  return (
    <>
        <ToastContainer />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard/*' element={<Dashboard />} />
        </Routes>
    </>
  )
}

export default App

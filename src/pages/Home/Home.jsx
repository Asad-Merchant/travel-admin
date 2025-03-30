import React, { useEffect, useState } from 'react'
import './Home.css'
import { FaRegUser, FaLock } from "react-icons/fa";
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'


const Home = () => {

    const [userData, setUserData] = useState({
        user: '',
        pass: ''
    })
    const url = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()
    const handleChange = (e) => {
        const name = e.target.name 
        const value = e.target.value 
        setUserData((prev) => ({...prev, [name]:value}))
    }

    const handleSubmit = async () => {
        try {            
            const res = await fetch(url + '/api/v1/user/login', {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(userData)
            })
            const result = await res.json()
            if(!result.success){
                toast.error(result.msg)
                return 
            }
            localStorage.setItem('token', result.msg)
            toast.success("Logged in successfully.")
            navigate('/dashboard')
        } catch (error) {
            console.log(error);
            toast.error(error)
        }
    }

    const verifyUser = async () => {
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(url + '/api/v1/user/verify-user', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const result = await res.json()
            if(result.success){
                toast.success('User verified')
                navigate('/dashboard')
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(localStorage.getItem('token')){
            verifyUser()
        }
    }, [])

  return (
    <div className='home'>
        <div className="home-form">
            <div className="form-head">
                <h2>Login</h2>
                <div className="form-inputs">
                    <div className="form-input">
                        <input type="text" name='user' value={userData.user} placeholder='Enter username' onChange={handleChange} required />
                        <FaRegUser />
                    </div>
                    <div className="form-input">
                        <input type="password" name='pass' onChange={handleChange} value={userData.pass} placeholder='Enter password' required />
                        <FaLock />
                    </div>
                </div>
                <button onClick={()=>handleSubmit()}>Submit</button>
            </div>
        </div>
    </div>
  )
}

export default Home
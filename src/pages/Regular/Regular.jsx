import React, { useEffect, useState } from 'react'
import './Regular.css'
import logo from '../../assets/upload_area.png'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Regular = () => {

    const url = import.meta.env.VITE_BACKEND_URL
    const [image, setImage] = useState(null)
    const [loader, setLoader] = useState(false)
    const [userData, setUserData] = useState({
        to: '',
        currPrice: '',
        noDay: '',
        noNight: '',
        date: '',
        totalTickets: ''
    })
    // console.log(userData);
    const navigate = useNavigate()
    const handleChange = (e) => {
        const name = e.target.name 
        const value = e.target.value 
        setUserData((prev) => ({...prev, [name]:value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoader(true)
        const token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append("image", image)
        formData.append("to", userData.to)
        formData.append("currPrice", Number(userData.currPrice))
        formData.append("date", userData.date)
        formData.append("noDay", Number(userData.noDay))
        formData.append("noNight", Number(userData.noNight))
        formData.append("totalTickets", Number(userData.totalTickets))

        try {
            const res = await fetch(url+'/api/v1/package/regular-package', {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })
            console.log(res);
            
            const data = await res.json()
            if(data.success){
                setUserData({
                    to: '',
                    noDay: '',
                    noNight: '',
                    currPrice: '',
                    date: '',
                    totalTickets: ''
                })
                setImage(null)
                setLoader(false)
                toast.success('Data added successfully.')
            } else{
                setLoader(false)
                toast.error(data.msg)
            }
        } catch (error) {
            console.log(error);
            
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
                return
            } else{
                toast.error(result.msg)
                navigate('/')
                return
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        if(localStorage.getItem('token')){
            verifyUser()
        } else{
            toast.error('Not authorized')
            navigate('/')
        }
    }, [])

  return (
    <>
        {loader?
            <div className='loader-style'>
                <div className="loader"></div>
            </div>
            :
            <div className='regular'>
        <form onSubmit={(e)=>handleSubmit(e)}>
            <div className="upload-image">
                <p>Upload Image</p>
                <label htmlFor="image">
                    <img src={image?URL.createObjectURL(image):logo} alt="" />
                </label>
                <input type="file" accept='image/*' hidden id='image' onChange={(e)=>setImage(e.target.files[0])} required/>
            </div>
            <div className="form-item">
                <div className="day">
                    <p>Destination: </p>
                    <input required value={userData.to} type="text" name='to' onChange={handleChange}/>
                </div>
                <div className="night">
                    <p>Total tickets: </p>
                    <input required value={userData.totalTickets} type="number" name='totalTickets' onChange={handleChange}/>
                </div>
            </div>
                <div className="form-item">
                    <div className="day">
                        <p>No. of days: </p>
                        <input required value={userData.noDay} name='noDay' type="number" onChange={handleChange}/>
                    </div>
                    <div className="night">
                        <p>No. of nights: </p>
                        <input required value={userData.noNight} name='noNight' type="number" onChange={handleChange}/>
                    </div>
                </div>
                <div className="form-item">
                    <p>Date: </p>
                    <input required value={userData.date} name='date' type="date" onChange={handleChange} />
                </div>
                <div className="form-item">
                    <p>Price: </p>
                    <input required value={userData.currPrice} name='currPrice' type="number" onChange={handleChange}/>
                </div>
                <button type='submit'>ADD ITEM</button>
            </form>
        </div>
        }
    </>
  )
}

export default Regular
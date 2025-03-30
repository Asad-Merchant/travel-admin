import React, {useState, useEffect} from 'react'
import './Offer.css'
import logo from '../../assets/upload_area.png'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Offer = () => {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)
    const [image, setImage] = useState(null)
    const [userData, setUserData] = useState({
        to: '',
        currPrice: '',
        noDay: '',
        noNight: '',
        date: '',
        offerName: '',
        prevPrice: '',
        totalTickets: ''
    })

    // console.log(userData);
    

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
        formData.append("prevPrice", Number(userData.prevPrice))
        formData.append("offerName", userData.offerName)
        formData.append("totalTickets", userData.totalTickets)

        const res = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/v1/package/offer-package', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
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
                offerName: '',
                prevPrice: '',
                totalTickets: ''
            })
            setImage(null)
            setLoader(false)
            toast.success('Data added successfully.')
        } else{
            setLoader(false)
            toast.error("Please try again.")
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
        {
            loader?
            <div className='loader-style'>
                <div className="loader"></div>
            </div>
            :
                <div className='offer'>
            <form onSubmit={handleSubmit}>
                <div className="upload-image">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image?URL.createObjectURL(image):logo} alt="" />
                    </label>
                    <input type="file" accept='image/*' hidden id='image' onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="form-item">
                    <div className='offer-to'>
                        <p>Destination: </p>
                        <input value={userData.to} type="text" name='to' onChange={handleChange}/>
                    </div>
                    <div className='offer-name'>
                        <p>Offer Name: </p>
                        <input value={userData.offerName} type="text" name='offerName' onChange={handleChange}/>
                    </div>
                </div>
                <div className="form-item">
                    <div className="day">
                        <p>No. of days: </p>
                        <input value={userData.noDay} name='noDay' type="number" onChange={handleChange}/>
                    </div>
                    <div className="night">
                        <p>No. of nights: </p>
                        <input value={userData.noNight} name='noNight' type="number" onChange={handleChange}/>
                    </div>
                </div>
                <div className="form-item">
                    <div className="day">
                        <p>Date: </p>
                        <input value={userData.date} name='date' type="date" onChange={handleChange} />
                    </div>
                    <div className="night">
                        <p>Total tickets: </p>
                        <input required value={userData.totalTickets} type="number" name='totalTickets' onChange={handleChange}/>
                    </div>
                </div>
                <div className="form-item">
                    <div className='day'>
                        <p>New Price: </p>
                        <input value={userData.currPrice} name='currPrice' type="number" onChange={handleChange}/>
                    </div>
                    <div className='night'>
                        <p>Old Price: </p>
                        <input value={userData.prevPrice} name='prevPrice' type="number" onChange={handleChange}/>
                    </div>
                </div>
                <button type='submit'>ADD ITEM</button>
            </form>
        </div>
        }
    
    </>
    
  )
}

export default Offer
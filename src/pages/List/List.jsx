import React, { useEffect, useState } from 'react'
import './List.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const List = () => {

    const [data, setData] = useState([])
    const navigate = useNavigate()
    const url = import.meta.env.VITE_BACKEND_URL

    const fetchData = async() => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(url+'/api/v1/package/list-all', {
                method: "GET",
                headers: {"Authorization": `Bearer ${token}`}
            })
            const result = await res.json()
            if(result.success){
                setData(result.msg)
            } else{
                console.log(result.msg);
            }
        } catch (error) {
            console.log(error);
        }
    }
    console.log(data);

    const handleClick = async(id) => {
        console.log(id);
        
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(url+'/api/v1/package/delete-package',{
                method: "POST",
                headers: {
                    "Content-type": 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({packageId: id})
            })
            const result = await res.json()
            if(result.success){
                toast.success(result.msg)
                fetchData()
            } else{
                toast.error(result.msg)
            }
        } catch (error) {
            console.log(error);
            toast.error("Error")
        }
    }

    const handleDate = (date) => {
        const arr = date.split('-')
        return `${arr[2]}-${arr[1]}-${arr[0]}`
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
                fetchData()
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
    <div className='list'>
        <div className="list-table">
            <div className="list-title">
                <p>Image</p>
                <p>Destination</p>
                <p>Price</p>
                <p>Category</p>
                <p>Date</p>
                <p>Stay</p>
                <p>Action</p>
            </div>
            {
                data && data.length>0 && data.map((item, idx) => {
                    return <div className='list-item' key={idx} onClick={() => navigate('/dashboard/list-user', {state: {item}})}>
                        <img src={item.imageUrl} alt="" />
                        <p>{item.to}</p>
                        <p>{item.currPrice}</p>
                        <p>{item.packageType==="r"?"Regular":"Offer"}</p>
                        <p>{handleDate(item.date)}</p>
                        <p>{`${item.noDay}day, ${item.noNight}night`}</p>
                        <p className='cross' onClick={()=>handleClick(item._id)}>X</p>
                    </div>
                })
            }
        </div>
    </div>
  )
}

export default List
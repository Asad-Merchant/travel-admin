import React, {useEffect} from 'react'
import './Dashboard.css'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Regular from '../Regular/Regular'
import Offer from '../Offer/Offer'
import List from '../List/List'
import ListUser from '../ListUser/ListUser'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

    const navigate = useNavigate()

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
    <div className='dashboard'>
        <Navbar />
        <div className="dashboard-flex">
            <Sidebar />
              <Routes>
                  <Route path='/regular-package' element={<Regular />} />
                  <Route path='/offer-package' element={<Offer />} />
                  <Route path='/list' element={<List />} />
                  <Route path='/list-user' element={<ListUser />} />
              </Routes>
        </div>
    </div>
  )
}

export default Dashboard
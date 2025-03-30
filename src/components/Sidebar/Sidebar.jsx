import React from 'react'
import './Sidebar.css'
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { FaRectangleList } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <NavLink to='/dashboard/regular-package' className="sidebar-item">
            <IoIosAddCircleOutline size={22} />
            <p>Regular Package</p>
        </NavLink>
        <NavLink to='/dashboard/offer-package' className="sidebar-item">
            <IoIosAddCircle size={22} />
            <p>Special Offer Package</p>
        </NavLink>
        <NavLink to='/dashboard/list' className="sidebar-item">
            <FaRectangleList size={22} />
            <p>List Package</p>
        </NavLink>
    </div>
  )
}

export default Sidebar
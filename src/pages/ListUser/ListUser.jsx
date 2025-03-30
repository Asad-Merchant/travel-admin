import React, { useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './ListUser.css'
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ListUser = () => {

    const pdfRef = useRef()
    const location = useLocation()
    const data = location.state?.item 
    const navigate = useNavigate()

    console.log(data);
    
    const generatePDF = () => {
        const input = pdfRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${data.to}-${data.date}.pdf`);
        });
    };


    function handleDate(date){
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
    <div className='list-user-main'>
        <div className='list-user-main-details'>
            <p>Destination: {data.to}</p>
            <p>Stay: {data.noDay} days, {data.noNight} nights</p>
            <p>Price: {data.currPrice}</p>
            <p>Date: {handleDate(data.date)}</p>
            <button onClick={()=>generatePDF()}>Export PDF</button>
        </div>
        <div className='list-user' ref={pdfRef}>
            <div className="list-user-table">
                <div className="list-user-title">
                    <p>Name</p>
                    <p>Email</p>
                    <p>Mobile</p>
                    <p>Tickets Booked</p>
                </div>
                {
                    data.users && data.users.length>0 && data.users.map((item, idx) => {
                        return <div className='list-user-item' key={idx}>
                            <p>{item.name}</p>
                            <p>{item.email}</p>
                            <p>{item.mobile}</p>
                            <p>{item.noOfTicketsBooked}</p>
                        </div>
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default ListUser
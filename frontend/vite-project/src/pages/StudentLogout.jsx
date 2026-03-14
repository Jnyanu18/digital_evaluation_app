import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


export const StudentLogout = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    axios.get(`${import.meta.env.VITE_BASE_URL}/student/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem('token')
            
            navigate('/student/login')
        }
    })

    return (
        <div>StudentLogout</div>
    )
}

export default StudentLogout
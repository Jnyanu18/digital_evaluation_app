import React, { useContext, useEffect, useState } from 'react'
import { AdminDataContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminProtectWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { admin, setAdmin } = useContext(AdminDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/admin/login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/admin/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setAdmin(response.data)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/admin/login')
            })
    }, [ token ])

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default AdminProtectWrapper
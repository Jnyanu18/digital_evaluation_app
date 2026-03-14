import React, { useContext, useEffect, useState } from 'react'
import { StudentDataContext } from '../context/StudentContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const StudentProtectWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { student, setStudent } = useContext(StudentDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/student/login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/student/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setStudent(response.data)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/student/login')
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

export default StudentProtectWrapper
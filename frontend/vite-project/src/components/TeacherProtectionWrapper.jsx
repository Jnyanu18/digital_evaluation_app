import React, { useContext, useEffect, useState } from 'react'
import { TeacherDataContext } from '../context/TeacherContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const TeacherProtectWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { teacher, setTeacher } = useContext(TeacherDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/teacher/login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/teacher/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setTeacher(response.data)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/teacher/login')
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

export default TeacherProtectWrapper
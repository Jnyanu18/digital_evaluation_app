import React, { createContext, useState } from 'react'

export const TeacherDataContext = createContext()


const TeacherContext = ({ children }) => {

    const [ teacher, setTeacher ] = useState(null)

    return (
        <TeacherDataContext.Provider value={{ teacher, setTeacher }}>
            {children}
        </TeacherDataContext.Provider>
    )
}

export default TeacherContext
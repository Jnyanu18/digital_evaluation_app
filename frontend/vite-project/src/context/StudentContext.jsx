import React, { createContext, useState } from 'react'

export const StudentDataContext = createContext()


const StudentContext = ({ children }) => {

    const [ student, setStudent ] = useState(null)

    return (
        <StudentDataContext.Provider value={{ student, setStudent }}>
            {children}
        </StudentDataContext.Provider>
    )
}

export default StudentContext
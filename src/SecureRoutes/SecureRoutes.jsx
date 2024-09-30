import React from 'react'
import { Navigate, Outlet } from 'react-router'

const SecureRoutes = () => {
    const auth = JSON.parse(localStorage.getItem('token'));
    return auth ? <Outlet /> : <Navigate to={"/login"} />
}

export default SecureRoutes

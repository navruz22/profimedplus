import React from 'react'
import Admin from './Admin'
import { AdminLogin } from './AdminLogin'

const AdminRoutes = () => {

    const adminData = JSON.parse(localStorage.getItem('AdminData'));
    const isAuthenticated = !!adminData?.token;
    const user = adminData?.user;


    if (isAuthenticated && user.type === 'Admin') {
        console.log('work');
        return <Admin />
    } else {
        return <AdminLogin />
    }

}

export default AdminRoutes
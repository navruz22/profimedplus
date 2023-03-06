import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import RegisterClinica from './RegisterClinica'

const Admin = () => {
    return (
        <>
            <Navbar />
            <Switch>
                <Route path="/admin">
                    <RegisterClinica />
                </Route>
            </Switch>
        </>
    )
}

export default Admin
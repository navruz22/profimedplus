import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import RegisterClinica from './RegisterClinica'
import Users from './Users'

const Admin = ({ setIsAuthenticated, setUser }) => {
    return (
        <>
            <Navbar setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            <Switch>
                <Route path="/admin" exact>
                    <RegisterClinica />
                </Route>
                <Route path="/admin/users">
                    <Users />
                </Route>
            </Switch>
        </>
    )
}

export default Admin
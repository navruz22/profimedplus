import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Doctors from "./doctors/Doctors";

export const CounterAgentRouter = () => {
    return (
        <div>
            <Switch>
                <Route path="/alo24" exact>
                    <Doctors />
                </Route>
                <Redirect to="/alo24" />
            </Switch>
        </div>
    );
};
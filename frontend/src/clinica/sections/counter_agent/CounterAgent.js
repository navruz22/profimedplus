import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { CounterAgentRouter } from "./CounterAgentRouter";

export const CounterAgent = () => {
    return (
        <div>
            <Router>
                <Navbar />
                <CounterAgentRouter />
            </Router>
        </div>
    )
}
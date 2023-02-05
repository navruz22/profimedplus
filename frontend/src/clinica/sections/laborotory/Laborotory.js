import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LaborotoryRouter } from "./LaborotoryRouter";

export const Laborotory = () => {
  return (
    <Router>
      <Navbar />
      <LaborotoryRouter />
    </Router>
  );
};

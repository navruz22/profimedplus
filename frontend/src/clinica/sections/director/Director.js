import React from "react";
import { DirectorRouter } from "./DirectorRouter";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "./navbar_and_footer/Navbar";

export const Director = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <DirectorRouter />
      </Router>
    </div>
  );
};

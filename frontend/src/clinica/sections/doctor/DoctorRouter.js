import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { DoctorClients } from "./doctorclients/DoctorClients";
import Templates from "./templates/Templates";
import AdoptionTemplate from "./components/AdoptionTemplate";
import { ConclusionClients } from "./conclusion/ConclusionClients";
import Conclusion from "./conclusion/Conclusion";
// import Tables from "./tables/Tables";

export const DoctorRouter = () => {
  return (
    <div>
      <Switch>
        <Route path="/alo24" exact>
          <DoctorClients />
        </Route>
        <Route path="/alo24/templates">
          <Templates />
        </Route>
        <Route path="/alo24/adoption">
          <AdoptionTemplate />
        </Route>
        <Route path="/alo24/conclusionclients">
          <ConclusionClients />
        </Route>
        <Route path="/alo24/conclusion">
          <Conclusion />
        </Route>
        <Redirect to="/alo24" />
      </Switch>
    </div>
  );
};

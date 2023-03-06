import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Counter } from "./Counter";
import { ClinicaRegister } from "./loginAndRegister/ClinicaRegister";
import { DirectorRegistor } from "./loginAndRegister/DirectorRegistor";
import { Login } from "./loginAndRegister/Login";
import AdminRoutes from "./admin/AdminRoutes";

export const ClinicaRoutes = (isAuthenticated, user) => {
  return (
    <Switch>
      <Route path="/" exact>
        {isAuthenticated && user ? (
          <Counter section={user && user.type} />
        ) : (
          <Login />
        )}
      </Route>
      <Route path="/alo24">
        {isAuthenticated && user ? (
          <Counter section={user && user.type} />
        ) : (
          <Login />
        )}
      </Route>
      <Route path="/clinica">
        <ClinicaRegister />
      </Route>
      <Route path="/newdirector">
        <DirectorRegistor />
      </Route>
      <Route path="/admin">
        <AdminRoutes isAuthenticated={isAuthenticated} user={user} />
      </Route>
      <Redirect to="/alo24" />
    </Switch>
  );
};

import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Expense from "../cashier/expense/Expense";
import { Advers } from "./adver/Advers";
import AdverChart from "./adver_chart/AdverChart";
import OfflineClients from "./clients/OfflineClients";
import StatsionarClients from "./clients/StatsionarClients";
import CounterAgent from "./counteragent/CounterAgent";
import CounterAgentInfo from "./counteragent/CounterAgentInfo";
import CounterDoctors from "./counter_doctors/CounterDoctors";
import DirectDoctors from "./directdoctors/DirectDoctors";
import DirectServices from "./directdoctors/DirectServices";
import { EditDirector } from "./editDirector/EditDirector";
import { EditDirectorPassword } from "./editDirector/EditDirectorPassword";
import { HomePage } from "./homepage/HomePage";
import PopularServices from "./popularservices/PopularServices";
import { DebtReport } from "./report/DebtReport";
import { DiscountReport } from "./report/DiscountReport";
import DoctorProcient from "./report/DoctorProcient";
import DoctorServices from "./report/DoctorServices";
import MainReport from "./report/MainReport";
import NurseProcient from "./report/NurseProcient";
import StationarDoctorReport from "./report/StationarDoctorReport";
import { StatsionarReport } from "./report/StatsionarReport";
import { Departments } from "./services/Departments";
import { ProductConnectors } from "./services/ProductConnector";
import { Products } from "./services/Products";
import { Rooms } from "./services/Rooms";
import { Services } from "./services/Services";
import { ServiceType } from "./services/ServiceType";
import { Warehouses } from "./services/Warehouses";
import { Users } from "./users/Users";

export const DirectorRouter = () => {
  return (
    <div className="bg-slate-100">
      <Switch>
        {/* Services */}
        <Route path="/alo24" exact>
          <HomePage />
        </Route>
        <Route path="/alo24/editdirector">
          <EditDirector />
        </Route>
        <Route path="/alo24/editdirectorpassword">
          <EditDirectorPassword />
        </Route>
        <Route path="/alo24/departments">
          <Departments />
        </Route>
        <Route path="/alo24/servicetypes">
          <ServiceType />
        </Route>
        <Route path="/alo24/services">
          <Services />
        </Route>
        <Route path="/alo24/rooms">
          <Rooms />
        </Route>
        <Route path="/alo24/products">
          <Products />
        </Route>
        <Route path="/alo24/recieptproducts">
          <Warehouses />
        </Route>
        <Route path="/alo24/productconnector">
          <ProductConnectors />
        </Route>
        <Route path="/alo24/offlineclients">
          <OfflineClients />
        </Route>
        <Route path="/alo24/statsionarclients">
          <StatsionarClients />
        </Route>
        <Route path="/alo24/mainreport">
          <MainReport />
        </Route>
        <Route path="/alo24/statsionarreport">
          <StatsionarReport />
        </Route>
        <Route path="/alo24/discountreport">
          <DiscountReport />
        </Route>
        <Route path="/alo24/debtreport">
          <DebtReport />
        </Route>
        <Route path="/alo24/doctor_procient">
          <DoctorProcient />
        </Route>
        <Route path="/alo24/doctor_procient_services">
          <DoctorServices />
        </Route>
        <Route path="/alo24/doctor_procient_statsionar">
          <StationarDoctorReport />
        </Route>
        <Route path="/alo24/nurse_profit">
          <NurseProcient />
        </Route>
        <Route path="/alo24/counteragent">
          <CounterAgent />
        </Route>
        <Route path="/alo24/counteragent_info">
          <CounterAgentInfo />
        </Route>
        {/* Users */}
        <Route path="/alo24/users">
          <Users />
        </Route>
        <Route path="/alo24/advers">
          <Advers />
        </Route>
        <Route path="/alo24/adver">
          <AdverChart />
        </Route>
        <Route path="/alo24/counter_doctors">
          <CounterDoctors />
        </Route>
        <Route path="/alo24/popular_services">
          <PopularServices />
        </Route>
        <Route path="/alo24/expense">
          <Expense />
        </Route>
        <Route path="/alo24/directdoctors">
          <DirectDoctors />
        </Route>
        <Route path="/alo24/directservice">
          <DirectServices />
        </Route>
        <Redirect to="/alo24" />
      </Switch>
    </div>
  );
};

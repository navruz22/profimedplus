import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPenAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useLocation } from "react-router-dom";

export const TableClients = ({
  changeStart,
  changeEnd,
  searchId,
  searchFullname,
  connectors,
  setCurrentPage,
  countPage,
  currentConnectors,
  setCurrentConnectors,
  currentPage,
  setPageSize,
  loading,
  sortDebts,
  getPayment,
  getDebtsByClientBorn
}) => {
  const location = useLocation()
  return (
    <div className="border-0 shadow-lg table-container">
      <div className="border-0 table-container">
        <div className="table-responsive">
          <div className="bg-white flex gap-6 items-center py-2 px-2">
            <div>
              <select
                className="form-control form-control-sm selectpicker"
                placeholder="Bo'limni tanlang"
                onChange={setPageSize}
                style={{ minWidth: "50px" }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex gap-4">
              <input
                onChange={searchFullname}
                style={{ maxWidth: "100px", minWidth: "100px" }}
                type="search"
                className="w-100 form-control form-control-sm selectpicker"
                placeholder="F.I.O"
              />
              <input
                onChange={searchId}
                style={{ maxWidth: "60px" }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder="ID"
              />
            </div>
            <div className="text-center">
              <select
                className="form-control form-control-sm selectpicker"
                onChange={sortDebts}
              >
                <option value="none">hamma</option>
                <option value="statsionar">Statsionar</option>
                <option value="offline">Kunduzgi</option>
              </select>
            </div>
            <div>
              <DatePickers changeDate={getDebtsByClientBorn} />
            </div>
            <div className="text-center ml-auto">
              <Pagination
                setCurrentDatas={setCurrentConnectors}
                datas={connectors}
                setCurrentPage={setCurrentPage}
                countPage={countPage}
                totalDatas={connectors.length}
              />
            </div>
            <div
              className="text-center flex gap-2"
              style={{ maxWidth: "200px", overflow: "hidden" }}
            >
              <DatePickers changeDate={changeStart} />
              <DatePickers changeDate={changeEnd} />
            </div>
            <div className="texte-center">
              <div className="btn btn-primary">
                <ReactHTMLTableToExcel
                  id="reacthtmltoexcel"
                  table="discount-table"
                  sheet="Sheet"
                  buttonText="Excel"
                  filename="Chegirma"
                />
              </div>
            </div>
          </div>
          <table className="table m-0" id="discount-table">
            <thead>
              <tr>
                <th className="border bg-alotrade text-[16px] py-1">№</th>
                <th className="border bg-alotrade text-[16px] py-1">
                  F.I.O
                  <div className="btn-group-vertical ml-2">
                    <FontAwesomeIcon
                      onClick={() =>
                        setCurrentConnectors(
                          [...currentConnectors].sort((a, b) =>
                            a.client.fullname > b.client.fullname ? 1 : -1
                          )
                        )
                      }
                      icon={faAngleUp}
                      style={{ cursor: "pointer" }}
                    />
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setCurrentConnectors(
                          [...currentConnectors].sort((a, b) =>
                            b.client.fullname > a.client.fullname ? 1 : -1
                          )
                        )
                      }
                    />
                  </div>
                </th>
                <th className="border bg-alotrade text-[16px] py-1">
                  ID
                  <div className="btn-group-vertical ml-2">
                    <FontAwesomeIcon
                      onClick={() =>
                        setCurrentConnectors(
                          [...currentConnectors].sort((a, b) =>
                            a.client.id > b.client.id ? 1 : -1
                          )
                        )
                      }
                      icon={faAngleUp}
                      style={{ cursor: "pointer" }}
                    />
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setCurrentConnectors(
                          [...currentConnectors].sort((a, b) =>
                            b.client.id > a.client.id ? 1 : -1
                          )
                        )
                      }
                    />
                  </div>
                </th>
                <th className="border bg-alotrade text-[16px] py-1">
                  Telefon raqami
                  <div className="btn-group-vertical ml-2">
                    <FontAwesomeIcon
                      onClick={() =>
                        setCurrentConnectors(
                          [...currentConnectors].sort((a, b) =>
                            a.client.phone > b.client.phone ? 1 : -1
                          )
                        )
                      }
                      icon={faAngleUp}
                      style={{ cursor: "pointer" }}
                    />
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setCurrentConnectors(
                          [...currentConnectors].sort((a, b) =>
                            b.client.phone > a.client.phone ? 1 : -1
                          )
                        )
                      }
                    />
                  </div>
                </th>
                <th className="border bg-alotrade text-[16px] py-1">
                  Tugilgan yili
                  <div className="btn-group-vertical ml-2">
                    <FontAwesomeIcon
                      onClick={() =>
                        setCurrentConnectors(
                          [...currentConnectors].sort((a, b) =>
                            a.client.born > b.client.born ? 1 : -1
                          )
                        )
                      }
                      icon={faAngleUp}
                      style={{ cursor: "pointer" }}
                    />
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setCurrentConnectors(
                          [...currentConnectors].sort((a, b) =>
                            b.client.born > a.client.born ? 1 : -1
                          )
                        )
                      }
                    />
                  </div>
                </th>
                <th className="border bg-alotrade text-[16px] py-1">
                  Summa
                  <Sort
                    data={currentConnectors}
                    setData={setCurrentConnectors}
                    property={"total"}
                  />
                </th>
                <th className="border bg-alotrade text-[16px] py-1">
                  Qarz summasi
                  <Sort
                    data={currentConnectors}
                    setData={setCurrentConnectors}
                    property={"debt"}
                  />
                </th>
                {!location.pathname.includes('alo24/debtreport') && <th className="border bg-alotrade text-[16px] py-1">
                  Qabul
                  <div className="btn-group-vertical ml-2">
                    <Sort
                      data={currentConnectors}
                      setData={setCurrentConnectors}
                      property={"counterAgentProcient"}
                    />
                  </div>
                </th>}
              </tr>
            </thead>
            <tbody>
              {currentConnectors.map((connector, key) => {
                return (
                  <tr key={key}>
                    <td
                      className="border py-1 font-weight-bold text-right text-[16px]"
                      style={{ maxWidth: "30px !important" }}
                    >
                      {currentPage * countPage + key + 1}
                    </td>
                    <td className="border py-1 font-weight-bold text-[16px]">
                      {connector.client.fullname}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector.client.id}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector.client.phone}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {new Date(connector.client.born).toLocaleDateString()}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector.total}
                    </td>
                    <td className="border py-1 text-right text-[16px]">{connector.debt}</td>
                    {!location.pathname.includes('alo24/debtreport') && <td className="border py-1 text-center text-[16px]">
                      {loading ? (
                        <button className="btn btn-success" disabled>
                          <span className="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary py-0"
                          onClick={() => getPayment(connector)}
                        >
                          <FontAwesomeIcon icon={faPenAlt} />
                        </button>
                      )}
                    </td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

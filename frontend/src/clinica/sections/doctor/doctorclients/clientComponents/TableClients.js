import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPenAlt,
  faPrint,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useHistory } from "react-router-dom";

export const TableClients = ({
  changeStart,
  changeEnd,
  searchId,
  searchFullname,
  doctorClients,
  setCurrentPage,
  countPage,
  currentDoctorClients,
  setCurrentDoctorClients,
  currentPage,
  setPageSize,
  handlePrint,
  loading,
  setClient,
  setConnector,
  setVisible
}) => {
  const history = useHistory();
  return (
    <div className="border-0 shadow-lg table-container">
      <div className="border-0 table-container">
        <div className="table-responsive">
          <table className="table m-0" id="discount-table">
            <thead className="bg-white">
              <tr>
                <th>
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
                </th>
                <th>
                  <input
                    onChange={searchFullname}
                    style={{ maxWidth: "100px", minWidth: "100px" }}
                    type="search"
                    className="w-100 form-control form-control-sm selectpicker"
                    placeholder="F.I.O"
                  />
                </th>
                <th>
                  <input
                    onChange={searchId}
                    style={{ maxWidth: "60px" }}
                    type="search"
                    className="form-control form-control-sm selectpicker"
                    placeholder="ID"
                  />
                </th>
                <th className="text-center">
                  <Pagination
                    setCurrentDatas={setCurrentDoctorClients}
                    datas={doctorClients}
                    setCurrentPage={setCurrentPage}
                    countPage={countPage}
                    totalDatas={doctorClients.length}
                  />
                </th>
                <th
                  className="flex items-center gap-2 justify-center"
                  style={{ maxWidth: "200px", overflow: "hidden" }}
                >
                  <DatePickers changeDate={changeStart} />
                  <DatePickers changeDate={changeEnd} />
                </th>
                <th
                  className="text-center"
                  style={{ maxWidth: "200px", overflow: "hidden" }}
                >
                  <div className="btn btn-primary">
                    <ReactHTMLTableToExcel
                      id="reacthtmltoexcel"
                      table="discount-table"
                      sheet="Sheet"
                      buttonText="Excel"
                      filename="Chegirma"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th className="border bg-alotrade text-[16px] py-1">№</th>
                <th className="border bg-alotrade text-[16px] py-1">
                  F.I.O
                  <div className="btn-group-vertical ml-2">
                    <FontAwesomeIcon
                      onClick={() =>
                        setCurrentDoctorClients(
                          [...currentDoctorClients].sort((a, b) =>
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
                        setCurrentDoctorClients(
                          [...currentDoctorClients].sort((a, b) =>
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
                        setCurrentDoctorClients(
                          [...currentDoctorClients].sort((a, b) =>
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
                        setCurrentDoctorClients(
                          [...currentDoctorClients].sort((a, b) =>
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
                        setCurrentDoctorClients(
                          [...currentDoctorClients].sort((a, b) =>
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
                        setCurrentDoctorClients(
                          [...currentDoctorClients].sort((a, b) =>
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
                        setCurrentDoctorClients(
                          [...currentDoctorClients].sort((a, b) =>
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
                        setCurrentDoctorClients(
                          [...currentDoctorClients].sort((a, b) =>
                            b.client.born > a.client.born ? 1 : -1
                          )
                        )
                      }
                    />
                  </div>
                </th>
                <th className="border bg-alotrade text-[16px] py-1">
                  Tasdiqlangan
                </th>
                <th className="border bg-alotrade text-[16px] py-1 w-[12%]">
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDoctorClients.length > 0 &&
                currentDoctorClients.map((connector, key) => {
                  return (
                    <tr key={key}>
                      <td
                        className="border text-[16px] py-1 font-weight-bold text-right"
                        style={{ maxWidth: "30px !important" }}
                      >
                        {currentPage * countPage + key + 1}
                      </td>
                      <td className="border text-[16px] py-1 font-weight-bold">
                        {connector.client.firstname} {connector.client.lastname}
                      </td>
                      <td className="border text-[16px] py-1 text-right">
                        {connector.client.id}
                      </td>
                      <td className="border text-[16px] py-1 text-right">
                        {connector.client.phone}
                      </td>
                      <td className="border text-[16px] py-1 text-right">
                        {new Date(connector.client.born).toLocaleDateString()}
                      </td>
                      <td className="border text-[16px] py-1 text-right">
                        <div className="custom-control custom-checkbox text-center">
                          <input checked={connector?.connector?.accept}
                            type="checkbox"
                            className="custom-control-input border border-dager"
                            id={`product${key}`}
                          />
                          <label className="custom-control-label"
                            htmlFor={`product${key}`}></label>
                        </div>
                      </td>
                      <td className="border text-[16px] py-1 text-center flex gap-[4px] items-center">
                        {loading ? (
                          <button className="btn btn-success" disabled>
                            <span className="spinner-border spinner-border-sm"></span>
                            Loading...
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              history.push("/alo24/adoption", { ...connector })
                            }
                            className="btn btn-primary py-0"
                          >
                            <FontAwesomeIcon icon={faPenAlt} />
                          </button>
                        )}
                        {loading ? (
                          <button className="btn btn-success" disabled>
                            <span className="spinner-border spinner-border-sm"></span>
                            Loading...
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setClient(connector.client)
                              setConnector(connector.connector)
                              setVisible(true)
                            }}
                            className="btn btn-success py-0"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        )}
                        {loading ? (
                          <button className="ml-2 btn btn-success" disabled>
                            <span className="spinner-border spinner-border-sm"></span>
                            Loading...
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handlePrint(connector)
                            }
                            className="btn btn-success py-0"
                          >
                            <FontAwesomeIcon icon={faPrint} />
                          </button>
                        )}
                      </td>
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

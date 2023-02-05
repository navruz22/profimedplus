import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export const TableClients = ({
  currentConnectors,
  setCurrentConnectors,
  searchFullname,
  searchId,
  setPageSize,
  setCurrentPage,
  countPage,
  changeStart,
  changeEnd,
  currentPage,
  commentSelect,
  sortComment,
  sortDiscounts,
}) => {
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
                    setCurrentDatas={setCurrentConnectors}
                    datas={currentConnectors}
                    setCurrentPage={setCurrentPage}
                    countPage={countPage}
                    totalDatas={currentConnectors.length}
                  />
                </th>
                <th className="text-center">
                  <select
                    className="form-control form-control-sm selectpicker"
                    onChange={sortDiscounts}
                  >
                    <option value="none">hamma</option>
                    <option value="statsionar">Statsionar</option>
                    <option value="offline">Kunduzgi</option>
                  </select>
                </th>
                <th></th>
                <th
                  className="d-flex justify-content-between"
                  style={{ maxWidth: "200px", overflow: "hidden" }}
                >
                  <DatePickers changeDate={changeStart} />
                  <DatePickers changeDate={changeEnd} />
                </th>
                <th className="text-center">
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

                <th className="text-center">
                  <select
                    className="form-control form-control-sm selectpicker"
                    onChange={sortComment}
                  >
                    <option value="none">hamma</option>
                    {commentSelect.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th className="border py-1 bg-alotrade text-[14px]">№</th>
                <th className="border py-1 bg-alotrade text-[14px]">
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
                <th className="border py-1 bg-alotrade text-[14px]">
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
                <th className="border py-1 bg-alotrade text-[14px]">
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
                <th className="border py-1 bg-alotrade text-[14px]">
                  Tugilgan yil
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
                <th className="border py-1 bg-alotrade text-[14px]">
                  Jami to'lov
                  <Sort
                    data={currentConnectors}
                    setData={setCurrentConnectors}
                    property={"totalprice"}
                  />
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">
                  Procient
                  <div className="btn-group-vertical ml-2">
                    <FontAwesomeIcon
                      onClick={() =>
                        setCurrentConnectors(
                          [...currentConnectors].sort((a, b) =>
                            a.procient > b.procient ? 1 : -1
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
                            b.procient > a.procient ? 1 : -1
                          )
                        )
                      }
                    />
                  </div>
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">
                  Chegirma summasi
                  <Sort
                    data={currentConnectors}
                    setData={setCurrentConnectors}
                    property={"createdAt"}
                  />
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">Izoh</th>
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
                    <td className="border py-1 text-right text-[16px]">
                      {connector.procient}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector.discount}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector.comment}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table
            className="table"
            style={{ marginLeft: "auto", maxWidth: "300px" }}
          >
            <tbody>
              <tr>
                <td className="py-1 text-right font-weight-bold" colSpan={2}>
                  Jami:
                </td>
                <td className="py-1 font-weight-bold" colSpan={4}>
                  {currentConnectors &&
                    currentConnectors.reduce((total, el) => {
                      return total + el.discount;
                    }, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

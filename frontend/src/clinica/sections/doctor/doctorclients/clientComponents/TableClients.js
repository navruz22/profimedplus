import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPenAlt,
  faPrint,
  faPlus,
  faSearch,
  faArrowsUpDown,
  faRotate,
  faCheck,
  faPhone,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import makeAnimated from 'react-select/animated'
import { Modal } from "../../../reseption/components/Modal";
import { useTranslation } from "react-i18next";

const animatedComponents = makeAnimated()

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
  setVisible,
  clientsType,
  changeClientsType,
  getClientsByBorn,
  changeAccept,
  user,
  getClientsByName,
  getClientsById,
  sortData,
  setIsAddConnector,
  setSelectedServices,
  setNewServices,
  setNewProducts,
  saveService,
  listType,
  sendMessageToBot,
  acceptType
}) => {

  const { t } = useTranslation()

  const history = useHistory();
  const [clientBorn, setClientBorn] = useState('')

  const [modal, setModal] = useState(false)
  const [debt, setDebt] = useState(0)
  const [sort, setSort] = useState(false)

  // const isDebt = (payments) => {
  //   const debt = payments.reduce((prev, item) => prev + item.debt, 0)
  //   if (debt > 0) {
  //     return 'bg-red-400'
  //   } else {
  //     return ""
  //   }
  // }

  const isWasted = (connector) => {
    const now = new Date().getTime()
    const date = new Date(connector.stepDate).getTime()
    console.log(connector);
    return Math.round((now - date) / 60000) >= 1
  }

  const setColor = (connector) => {
    // console.log(!connector.services.some(s => s.accept === false));
    if (connector.connector.step && connector.services.some(s => s.accept === false) && isWasted(connector.connector)) {
      return 'bg-red-400'
    }
    if (connector.connector.step && connector.services.some(s => s.accept === false)) {
      return 'bg-gray-400'
    }
    if (connector.connector.step && !connector.services.some(s => s.accept === false)) {
      return 'bg-green-400'
    }
    return ''
  }

  const getTurn = (connector) => {

    const data = [...doctorClients].filter(el => el.connector.step).sort((a, b) => new Date(a.connector.stepDate) - new Date(b.connector.stepDate))
    const index = data.reduce((prev, el, ind) => {
      if (connector?.connector?._id === el?.connector?._id) {
        prev = ind
      }
      return prev;
    }, 0)
    return index + 1
  }

  return (
    <div className="border-0 shadow-lg table-container">
      <div className="border-0 table-container">
        <div className="table-responsive">
          <div className="bg-white flex gap-6 items-center py-2 px-2">
            <div>
              <input
                onChange={searchFullname}
                style={{ maxWidth: "100px", minWidth: "100px" }}
                type="search"
                className="w-100 form-control form-control-sm selectpicker"
                placeholder={t("F.I.O")}
                onKeyDown={(e) => e.key === 'Enter' && getClientsByName()}
              />
            </div>
            <div>
              <input
                onChange={searchId}
                style={{ maxWidth: "60px" }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder={t("ID")}
                onKeyDown={(e) => e.key === 'Enter' && getClientsById()}
              />
            </div>
            <div className="flex items-center gap-4">
              <input
                onKeyDown={(e) => e.key === 'Enter' && getClientsByBorn(e.target.value)}
                type="date"
                name="born"
                onChange={(e) => setClientBorn(e.target.value)}
                className="form-control inp"
                placeholder=""
                style={{ color: '#999' }}
              />
              <button onClick={() => getClientsByBorn(clientBorn)}>
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ cursor: "pointer" }}
                />
              </button>
            </div>
            <div
              className="flex items-center gap-2 justify-center"
              style={{ maxWidth: "200px", overflow: "hidden" }}
            >
              <DatePickers changeDate={changeStart} />
              <DatePickers changeDate={changeEnd} />
            </div>
            <div
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
            </div>
            {/* {listType === 'all' && <div
              className="text-center"
              style={{ maxWidth: "200px" }}
            >
              <select
                className="form-control form-control-sm selectpicker"
                placeholder="Mijozalar"
                onChange={changeClientsType}
              >
                <option value="offline">{t("Kunduzgi")}</option>
                <option value="statsionar">{t("Statsionar")}</option>
              </select>
            </div>} */}
            {listType === 'all' && <div
              className="text-center"
              style={{ maxWidth: "200px" }}
            >
              <select
                className="form-control form-control-sm selectpicker"
                placeholder="Mijozalar"
                onChange={changeAccept}
                defaultValue={'not'}
              >
                <option value="all">{t("Hammasi")}</option>
                <option value="accept">{t("Tasdiqlangan")}</option>
                <option value="not">{t("Tasdiqlanmagan")}</option>
              </select>
            </div>}
          </div>
          <table className="table m-0" id="discount-table">
            <thead>
              <tr>
                <th className="border bg-alotrade text-[16px] py-1">№</th>
                <th className="border bg-alotrade text-[16px] py-1">
                  {t("F.I.O")}
                </th>
                <th className="border bg-alotrade text-[16px] py-1">
                  {t("Kelgan vaqti")}
                </th>
                <th className="border bg-alotrade text-[16px] py-1">
                  {t("Navbat")}
                </th>
                {/* <th className="border bg-alotrade text-[16px] py-1">
                  {t("ID")}
                </th> */}
                <th className="border bg-alotrade text-[16px] py-1">
                  {t("Telefon raqami")}
                </th>
                <th className="border bg-alotrade text-[16px] py-1">
                  {t("Tug'ilgan yili")}
                </th>
                {clientsType === 'statsionar' && <th className="border bg-alotrade text-[16px] py-1">
                  {t("Kelgan vaqti")}
                </th>}
                {clientsType === 'statsionar' && <th className="border bg-alotrade text-[16px] py-1">
                  {t("Xonasi")}
                </th>}
                {listType !== 'operation' && acceptType === 'accept' && <th className="border bg-alotrade text-[16px] py-1">
                  {t("Tasdiqlangan")}
                </th>}
                {listType !== 'operation' && <th className="border bg-alotrade text-[16px] py-1 w-[12%]">
                </th>}
              </tr>
            </thead>
            <tbody>
              {currentDoctorClients.length > 0 &&
                currentDoctorClients.map((connector, key) => {
                  return (
                    <tr key={key}>
                      <td
                        className={`${listType === 'operation' ? "" : setColor(connector)} border text-[16px] py-1 font-weight-bold text-right`}
                        style={{ maxWidth: "30px !important" }}
                        onClick={() => {
                          const debt = connector.payments.reduce((prev, item) => prev + item.debt, 0)
                          if (debt > 0) {
                            setDebt(debt)
                            setModal(true)
                          }
                        }}
                      >
                        {currentPage * countPage + key + 1}
                      </td>
                      <td
                        style={{ cursor: listType !== 'operation' && "pointer" }}
                        onClick={() =>
                          listType !== 'operation' && history.push("/alo24/adoption", { ...connector, clientsType, user })
                        }
                        className="border text-[18px] py-1 font-weight-bold">
                        {listType === 'operation' ? `${connector?.firstname} ${connector?.lastname}` : `${connector?.client?.firstname} ${connector?.client?.lastname}`}
                      </td>
                      <td className="border text-[18px] py-1 text-right">
                        {listType === 'operation' ? `${new Date(connector?.createdAt).toLocaleTimeString('ru-RU')}` : listType === 'nextsteps' ? `${new Date(connector?.connector?.stepDate).toLocaleDateString('ru-RU')} ${new Date(connector?.connector?.stepDate).toLocaleTimeString('ru-RU')}` : `${new Date(connector?.connector?.createdAt).toLocaleDateString('ru-RU')} ${new Date([...connector?.services].filter(service => service.department._id === user.specialty._id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt).toLocaleTimeString('ru-RU')}`}
                      </td>
                      <td className={`${listType === 'all' && connector.connector?.isBooking && 'bg-green-400'} border text-[18px] py-1 text-right font-bold`}>
                        {listType === 'all' && connector.connector?.isBooking ? t('Belgilangan') : `${listType === 'operation' ? 'ПО' : connector?.connector?.step ? 'KO' : "A"} ${listType === 'operation' ? connector?.turn : (connector?.connector?.step ? getTurn(connector) : [...connector?.services].filter(service => service.department.probirka === false)[0]?.turn)}`}
                      </td>
                      {/* <td className="border text-[16px] py-1 text-right">
                        {listType === 'operation' ? connector?.id : connector?.client?.id}
                      </td> */}
                      <td className="border text-[18px] py-1 text-right">
                        {listType === 'operation' ? connector?.phone : connector?.client?.phone}
                      </td>
                      <td className="border text-[18px] py-1 text-right">
                        {listType === 'operation' ? new Date(connector?.born).toLocaleDateString() : new Date(connector?.client?.born).toLocaleDateString()}
                      </td>
                      {clientsType === 'statsionar' && <td className="border text-[18px] py-1 text-right">
                        {new Date(connector?.connector?.createdAt).toLocaleDateString()} {new Date(connector?.connector?.createdAt).toLocaleTimeString().slice(0, 5)}
                      </td>}
                      {clientsType === 'statsionar' && <td className="border text-[16px] py-1 text-right">
                        {connector?.connector?.room?.room?.type} {connector?.connector?.room?.room?.number} {connector?.connector?.room?.room?.place}
                      </td>}
                      {listType !== 'operation' && acceptType === 'accept' && <td className="border text-[16px] bg-white py-1 text-right">
                        <div className="custom-control custom-checkbox text-center">
                          <input checked={connector?.services?.filter(service => service.department._id === user?.specialty?._id && !service.department.probirka && service.accept).length > 0 ? true : false}
                            type="checkbox"
                            className="custom-control-input border border-dager"
                            id={`product${key}`}
                          />
                          <label className="custom-control-label"
                            htmlFor={`product${key}`}></label>
                        </div>
                      </td>}
                      {listType !== 'operation' && <td className=" bg-white py-1 text-center">
                        <button
                          onClick={() =>
                            saveService(connector.services, connector.connector._id)
                          }
                          className="w-full bg-alotrade rounded-2 text-[18px] font-bold text-white"
                        >
                         {t("Qabul qilish")}
                        </button>
                      </td>}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        modal={modal}
        text={""}
        setModal={setModal}
        basic={debt}
      />
    </div>
  );
};

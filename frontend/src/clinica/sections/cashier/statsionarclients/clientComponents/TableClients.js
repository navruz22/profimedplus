import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faMoneyBill, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import { useLocation } from "react-router-dom";
import ReactHtmlTableToExcel from "react-html-table-to-excel";


export const TableClients = ({
    changeClient,
    baseUrl,
    setVisible,
    setCheck,
    setModal1,
    modal,
    changeStart,
    changeEnd,
    searchPhone,
    setClient,
    searchId,
    searchFullname,
    searchProbirka,
    connectors,
    setConnector,
    setCurrentPage,
    countPage,
    currentConnectors,
    setCurrentConnectors,
    currentPage,
    setPageSize,
    loading,
    setServices,
    setProducts,
}) => {

    const location = useLocation()

    const getTotalprice = (connector) => {
        const days = Math.round(
            Math.abs(
                ((connector?.room?.endday ? new Date(connector.room.endday).getTime() : new Date().getTime())
                    -
                    new Date(connector?.room?.beginday).getTime())
                /
                (24 * 60 * 60 * 1000)
            )
        ) * connector?.room?.room?.price;
        let servicesTotal = connector.services.reduce((prev, s) => s.service && s.refuse === false && prev + (s.service.price * s.pieces), 0)
        let productsTotal = connector.products.length > 0 && connector.products.reduce((prev, el) => prev + (el.refuse === false && (el.payment && (el.product.price * el.pieces)) || 0), 0) || 0
        return servicesTotal + productsTotal + days;
    }

    const getDebt = (connector) => {
        const debt = connector?.payments.length > 0 ? (getTotalprice(connector) - (connector?.discount?.discount || 0)) - connector.payments.reduce((prev, el) => prev + el.payment, 0) : 0;
        return debt
    }

    const setPosition = (connector) => {
        const total = getTotalprice(connector)
        const debt = getDebt(connector);
        const payments = connector.payments.reduce((prev, el) => prev + el.payment, 0)
        if (debt) {
            return "bg-red-400"
        }
        if (total > 0 && payments > 0 && (total - (connector?.discount?.discount || 0)) === payments) {
            return 'bg-green-400'
        }
        return "bg-orange-400"
    }

    return (
        <div className="border-0 table-container">
            <div className="border-0 table-container">
                <div className="table-responsive">
                    <div className="bg-white flex gap-6 items-center py-2 px-2">
                        <div>
                            <select
                                className="form-control form-control-sm selectpicker"
                                placeholder="Bo'limni tanlang"
                                onChange={setPageSize}
                                style={{ minWidth: '50px' }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={'all'}>Barchasi</option>
                            </select>
                        </div>
                        <div>
                            <input
                                onChange={searchFullname}
                                style={{ maxWidth: '100px', minWidth: '100px' }}
                                type="search"
                                className="w-100 form-control form-control-sm selectpicker"
                                placeholder="F.I.O"
                            />
                        </div>
                        <div>
                            <input
                                onChange={searchPhone}
                                style={{ maxWidth: '100px', minWidth: '100px' }}
                                type="search"
                                className="w-100 form-control form-control-sm selectpicker"
                                placeholder="Tel"
                            />
                        </div>
                        <div>
                            <input
                                onChange={searchId}
                                style={{ maxWidth: '80px' }}
                                type="search"
                                className="form-control form-control-sm selectpicker"
                                placeholder="ID"
                            />
                        </div>
                        <div>
                            <input
                                onChange={searchProbirka}
                                style={{ maxWidth: '70px' }}
                                type="search"
                                className="form-control form-control-sm selectpicker"
                                placeholder="Probirka"
                            />
                        </div>
                        {/* <div
                            className="text-center"
                            style={{ maxWidth: '120px', overflow: 'hidden' }}
                        >
                            <input
                                type="date"
                                name="born"
                                className="form-control inp"
                                placeholder=""
                                style={{ color: '#999' }}
                                onKeyDown={(e) => e.key === 'Enter' && getConnectorsByClientBorn(e)}
                            />
                        </div> */}
                        <div className="text-center ml-auto ">
                            <Pagination
                                setCurrentDatas={setCurrentConnectors}
                                datas={connectors}
                                setCurrentPage={setCurrentPage}
                                countPage={countPage}
                                totalDatas={connectors.length}
                            />
                        </div>
                        <div
                            className="text-center ml-auto flex gap-2"
                            style={{ overflow: 'hidden' }}
                        >
                            <DatePickers changeDate={changeStart} />
                            <DatePickers changeDate={changeEnd} />
                        </div>
                        <div className="texte-center">
                            <div className="btn btn-primary">
                                <ReactHtmlTableToExcel
                                    id="reacthtmltoexcel"
                                    table="statsionarreport-table"
                                    sheet="Sheet"
                                    buttonText="Excel"
                                    filename="Statsionar"
                                />
                            </div>
                        </div>
                    </div>
                    <table className="table m-0 table-sm">
                        <thead>
                            <tr>
                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
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
                                <th className="border py-1 bg-alotrade text-[16px]">Tel</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
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
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Probirka
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"probirka"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    To'lov summasi
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"totalprice"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    To'langan
                                    <div className="btn-group-vertical ml-2">
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        a.services.length > b.services.length ? 1 : -1
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
                                                        b.services.length > a.services.length ? 1 : -1
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Chegirma
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Qarz
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                {!location.pathname.includes('/alo24/statsionarreport') && <th className="border py-1 bg-alotrade text-[16px]">
                                    Qabul qilish
                                    <div className="btn-group-vertical ml-2">
                                        <Sort
                                            data={currentConnectors}
                                            setData={setCurrentConnectors}
                                            property={"counterAgentProcient"}
                                        />
                                    </div>
                                </th>}

                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Chek
                                    <div className="btn-group-vertical ml-2">
                                        <Sort
                                            data={currentConnectors}
                                            setData={setCurrentConnectors}
                                            property={"counterAgentProcient"}
                                        />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConnectors.map((connector, key) => {
                                return (
                                    <tr key={key}>
                                        <td
                                            className={`${setPosition(connector)} border py-1 font-weight-bold text-right text-[16px]`}
                                            style={{ maxWidth: "30px !important" }}
                                        >
                                            {currentPage * countPage + key + 1}
                                        </td>
                                        <td className="border py-1 text-[16px] font-weight-bold">
                                            {connector.client.lastname +
                                                " " +
                                                connector.client.firstname}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            +998{connector.client.phone}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.client.id}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.probirka}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {getTotalprice(connector)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.payments.reduce((prev, el) => prev + el.payment, 0)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {(connector?.discount?.discount || 0)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {getDebt(connector)}
                                        </td>
                                        {!location.pathname.includes('/alo24/statsionarreport') && <td className="border py-1 text-[16px] text-center">
                                            {loading ? (
                                                <button className="btn btn-success" disabled>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Loading...
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-success py-0"
                                                    onClick={() => {
                                                        changeClient(connector, key)
                                                        setVisible(true);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faMoneyBill} />
                                                </button>
                                            )}
                                        </td>}
                                        <td className="border py-1 text-[16px] text-center">
                                            {loading ? (
                                                <button className="btn btn-success" disabled>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Loading...
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary py-0"
                                                    onClick={() => {
                                                        setCheck(connector);
                                                        setModal1(true);
                                                    }}
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
                    <table className="table m-0 table-sm d-none" id='statsionarreport-table'>
                        <thead>
                            <tr>
                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
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
                                <th className="border py-1 bg-alotrade text-[16px]">Tel</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
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
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Probirka
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"probirka"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    To'lov summasi
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"totalprice"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    To'langan
                                    <div className="btn-group-vertical ml-2">
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        a.services.length > b.services.length ? 1 : -1
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
                                                        b.services.length > a.services.length ? 1 : -1
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Chegirma
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Qarz
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                {!location.pathname.includes('/alo24/statsionarreport') && <th className="border py-1 bg-alotrade text-[16px]">
                                    Qabul qilish
                                    <div className="btn-group-vertical ml-2">
                                        <Sort
                                            data={currentConnectors}
                                            setData={setCurrentConnectors}
                                            property={"counterAgentProcient"}
                                        />
                                    </div>
                                </th>}

                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Chek
                                    <div className="btn-group-vertical ml-2">
                                        <Sort
                                            data={currentConnectors}
                                            setData={setCurrentConnectors}
                                            property={"counterAgentProcient"}
                                        />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {connectors.map((connector, key) => {
                                return (
                                    <tr key={key}>
                                        <td
                                            className={`${setPosition(connector)} border py-1 font-weight-bold text-right text-[16px]`}
                                            style={{ maxWidth: "30px !important" }}
                                        >
                                            {currentPage * countPage + key + 1}
                                        </td>
                                        <td className="border py-1 text-[16px] font-weight-bold">
                                            {connector.client.lastname +
                                                " " +
                                                connector.client.firstname}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            +998{connector.client.phone}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.client.id}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.probirka}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {getTotalprice(connector)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.payments.reduce((prev, el) => prev + el.payment, 0)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {(connector?.discount?.discount || 0)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {getDebt(connector)}
                                        </td>
                                        {!location.pathname.includes('/alo24/statsionarreport') && <td className="border py-1 text-[16px] text-center">
                                            {loading ? (
                                                <button className="btn btn-success" disabled>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Loading...
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-success py-0"
                                                    onClick={() => {
                                                        changeClient(connector, key)
                                                        setVisible(true);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faMoneyBill} />
                                                </button>
                                            )}
                                        </td>}
                                        <td className="border py-1 text-[16px] text-center">
                                            {loading ? (
                                                <button className="btn btn-success" disabled>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Loading...
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary py-0"
                                                    onClick={() => {
                                                        setCheck(connector);
                                                        setModal1(true);
                                                    }}
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

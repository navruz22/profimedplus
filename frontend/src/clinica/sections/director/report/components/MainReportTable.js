import { faAngleDown, faAngleUp, faMoneyBill, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "../../../cashier/components/Pagination";
import { DatePickers } from "../../../cashier/offlineclients/clientComponents/DatePickers";
import { Sort } from "../../../cashier/offlineclients/clientComponents/Sort";

export const MainReportTable = ({
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
    searchStorage
}) => {

    const getTotalprice = (connector) => {
        let servicesTotal = connector.services.reduce((prev, s) => s.service && prev + (s.service.price * s.pieces), 0)
        let productsTotal = connector.products.length > 0 && connector.products.reduce((prev, el) => prev + el.payment && (el.product.price * el.pieces), 0) || 0
        return servicesTotal + productsTotal - (connector?.discount?.discount || 0)
    }

    const getDebt = (connector) => {
        const debt = getTotalprice(connector) - connector.payments.reduce((prev, el) => prev + el.payment, 0)
        return debt
    }

    const setPosition = (connector) => {
        const total = getTotalprice(connector)
        const debt = getDebt(connector);
        const payments = connector.payments.reduce((prev, el) => prev + el.payment, 0)
        if (debt) {
            return "bg-red-400"
        }
        if (total > 0 && payments > 0 && total === payments) {
            return 'bg-green-400'
        }
        return "bg-orange-400"
    }

    return (
        <div className="border-0 table-container">
            <div className="border-0 table-container">
                <div className="table-responsive">
                    <table className="table m-0 table-sm">
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
                                        onChange={searchPhone}
                                        style={{ maxWidth: "100px", minWidth: "100px" }}
                                        type="search"
                                        className="w-100 form-control form-control-sm selectpicker"
                                        placeholder="Tel"
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
                                <th>
                                    <input
                                        onChange={searchProbirka}
                                        style={{ maxWidth: "50px" }}
                                        type="search"
                                        className="form-control form-control-sm selectpicker"
                                        placeholder="Probirka"
                                    />
                                </th>
                                <th className="text-center" colSpan={3}>
                                    <Pagination
                                        setCurrentDatas={setCurrentConnectors}
                                        datas={connectors}
                                        setCurrentPage={setCurrentPage}
                                        countPage={countPage}
                                        totalDatas={connectors.length}
                                    />
                                </th>
                                <th
                                    className="text-center"
                                    style={{ maxWidth: "120px", overflow: "hidden" }}
                                >
                                    <DatePickers changeDate={changeStart} />
                                </th>
                                <th
                                    className="text-center"
                                    style={{ maxWidth: "120px", overflow: "hidden" }}
                                >
                                    <DatePickers changeDate={changeEnd} />
                                </th>
                            </tr>
                        </thead>
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
                                    Naqt
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
                                    Plastik
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    O'tkazma
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
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Chegirma
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Check
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
                                            {connector.payments.reduce((prev, el) => prev + el.cash, 0)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.payments.reduce((prev, el) => prev + el.card, 0)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.payments.reduce((prev, el) => prev + el.transfer, 0)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {getDebt(connector)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {(connector?.discount?.discount || 0)}
                                        </td>
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
                            <tr>
                                <td
                                    colSpan={3}
                                    className={`py-1 font-weight-bold text-left text-[16px]`}
                                >
                                    Qoldiq: {searchStorage.reduce((prev, connector) => {
                                        let payments = connector.payments.reduce((prev, el) => prev + el.payment, 0)
                                        let debts = connector.payments.reduce((prev, el) => prev + el.debt, 0)
                                        let discounts = (connector?.discount?.discount || 0)
                                        return prev + (payments - discounts - debts)
                                    }, 0)}
                                </td>
                                <td className="py-1 text-[16px] text-right">
                                </td>
                                <td className="py-1 text-[16px] text-right">
                                </td>
                                <td className="py-1 text-[16px] text-right">
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => {
                                        return prev + el.payments.reduce((prev, el) => prev + el.cash, 0)
                                    }, 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => {
                                        return prev + el.payments.reduce((prev, el) => prev + el.card, 0)
                                    }, 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => {
                                        return prev + el.payments.reduce((prev, el) => prev + el.transfer, 0)
                                    }, 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => {
                                        return prev + el.payments.reduce((prev, el) => prev + el.debt, 0)
                                    }, 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => prev + (el?.discount?.discount || 0), 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

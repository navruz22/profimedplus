import { useToast } from '@chakra-ui/react'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers'
import { Sort } from '../adver/Sort'
import { Pagination } from '../components/Pagination'
import Select from "react-select"
import ReactHtmlTableToExcel from 'react-html-table-to-excel'

const CounterAgentInfo = () => {

    //===================================================================
    //===================================================================

    const location = useLocation()
    console.log(location);
    //===================================================================
    //===================================================================

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0)),
    )
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1)),
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // RegisterPage
    const [visible, setVisible] = useState(false)

    const changeVisible = () => setVisible(!visible)

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastConnector = (currentPage + 1) * countPage
    const indexFirstConnector = indexLastConnector - countPage
    const [currentConnectors, setCurrentConnectors] = useState([])

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const toast = useToast()

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            })
        },
        [toast],
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const { request, loading } = useHttp()
    const auth = useContext(AuthContext)

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // getConnectors
    const [connectors, setConnectors] = useState([])
    const [searchStorage, setSearchStrorage] = useState([])

    const getConnectors = useCallback(
        async (beginDay, endDay, counterdoctor) => {
            try {
                const data = await request(
                    `/api/counter_agent/doctors_services/get`,
                    "POST",
                    {
                        clinica: location?.state?.connector?.clinica,
                        counter_agent: location?.state?.connector?._id,
                        beginDay,
                        endDay,
                        counterdoctor: counterdoctor
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    },
                )
                setConnectors(data)
                setSearchStrorage(data)
                setCurrentConnectors(
                    data.slice(indexFirstConnector, indexLastConnector),
                )
            } catch (error) {
                notify({
                    title: error,
                    description: '',
                    status: 'error',
                })
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector],
    )
    //====================================================================
    //====================================================================+

    const [baseUrl, setBaseurl] = useState();

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request(`/api/baseurl`, "GET", null);
            setBaseurl(data.baseUrl);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, notify]);

    //====================================================================
    //====================================================================

    const changeCounterDoctor = (e) => {
        if (e.value === 'none') {
            getConnectors(beginDay, endDay, '')
        } else {
            getConnectors(beginDay, endDay, e.value)
        }
    }

    const [doctors, setDoctors] = useState([]);

    const getDoctorsList = useCallback(async () => {
        try {
            const data = await request(
                `/api/counter_agent/counterdoctorall/get`,
                "POST",
                {
                    clinica: location?.state?.connector?.clinica,
                    counter_agent: location?.state?.connector?._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctors([...data].map(item => ({
                value: item._id,
                label: item.firstname + ' ' + item.lastname
            })))
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [auth, request, notify])

    useEffect(() => {
        getDoctorsList()
    }, [getDoctorsList])

    //====================================================================
    //====================================================================
    // SEARCH
    const searchFullname = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.fullname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()),
            )
            setConnectors(searching)
            setCurrentConnectors(searching.slice(0, countPage))
        },
        [searchStorage, countPage],
    )
    //====================================================================
    //====================================================================

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(
            new Date(new Date().setDate(new Date(e).getDate() + 1)).setUTCHours(
                0,
                0,
                0,
                0
            )
        );

        setEndDay(date);
        getConnectors(beginDay, date);
    }

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentConnectors(connectors.slice(0, countPage))
        },
        [countPage, connectors],
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // useEffect

    const [t, setT] = useState(0)

    useEffect(() => {
        if (auth.clinica && !t) {
            setT(1)
            getConnectors(beginDay, endDay)
            getBaseUrl()
        }
    }, [auth, getConnectors, getBaseUrl, t, beginDay, endDay])

    //====================================================================
    //====================================================================
    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="border-0 table-container">
                            <div className="border-0 table-container">
                                <div className="table-responsive">
                                    <div className="bg-white flex items-center justify-between py-2 px-2">
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
                                        <div className='font-weight-bold'>
                                            {location?.state?.connector?.firstname + ' ' + location?.state?.connector?.lastname}
                                        </div>
                                        <div className='w-[300px]'>
                                            <Select
                                                onChange={changeCounterDoctor}
                                                // styles={CustomStyle}
                                                // value={value}
                                                options={[{
                                                    label: "Hammasi",
                                                    value: "none"
                                                }, ...doctors]}
                                                // isDisabled={isDisabled}
                                                // placeholder={placeholder}
                                                components={{
                                                    IndicatorSeparator: () => null,
                                                }}
                                            />
                                        </div>
                                        <div className="text-center">
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
                                        <div className="text-center">
                                            <div className="btn btn-primary">
                                                <ReactHtmlTableToExcel
                                                    id="reacthtmltoexcel"
                                                    table="counter_agent_info-table"
                                                    sheet="Sheet"
                                                    buttonText="Excel"
                                                    filename="Konter agent ulushi"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <table className="table m-0 table-sm" id="counter_agent_info-table">
                                        <thead>
                                            <tr>
                                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                                <th className='border py-1 bg-alotrade text-[16px]'>Mijoz</th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    Kelgan vaqti
                                                    <Sort
                                                        data={currentConnectors}
                                                        setData={setCurrentConnectors}
                                                        property={'createdAt'}
                                                    />
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    Xizmat nomi
                                                    <Sort
                                                        data={currentConnectors}
                                                        setData={setCurrentConnectors}
                                                        property={'totalprice'}
                                                    />
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    Umumiy narxi
                                                    <Sort
                                                        data={currentConnectors}
                                                        setData={setCurrentConnectors}
                                                        property={'totalprice'}
                                                    />
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    Agent ulushi
                                                    <Sort
                                                        data={currentConnectors}
                                                        setData={setCurrentConnectors}
                                                        property={'counteragent_profit'}
                                                    />
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    Shifokor ulushi
                                                    <Sort
                                                        data={currentConnectors}
                                                        setData={setCurrentConnectors}
                                                        property={'counterdoctor_profit'}
                                                    />
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    Yunaltiruvchi shifokor
                                                    <Sort
                                                        data={currentConnectors}
                                                        setData={setCurrentConnectors}
                                                        property={'counterdoctor_profit'}
                                                    />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentConnectors.map((connector, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td
                                                            className="border py-1 font-weight-bold text-right"
                                                            style={{ maxWidth: '30px !important' }}
                                                        >
                                                            {currentPage * countPage + key + 1}
                                                        </td>
                                                        <td className="border py-1 text-left font-weight-bold text-[16px]">
                                                            {connector?.client?.lastname +
                                                                ' ' +
                                                                connector?.client?.firstname}
                                                        </td>

                                                        <td className="border py-1 text-left text-[16px]">
                                                            {new Date(connector?.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="border py-1 text-left text-[16px]">
                                                            {connector?.service?.name}
                                                        </td>
                                                        <td className="border py-1 text-right text-[16px]">
                                                            {connector.totalprice}
                                                        </td>
                                                        <td className="border py-1 text-right text-[16px]">
                                                            {connector?.counteragent_profit}
                                                        </td>
                                                        <td className="border py-1 text-right text-[16px]">
                                                            {connector.counterdoctor_profit}
                                                        </td>
                                                        <td className="border py-1 font-weight-bold text-[16px]">
                                                            {connector?.counterdoctor?.lastname +
                                                                ' ' +
                                                                connector?.counterdoctor?.firstname}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            <tr>
                                                <td
                                                    className="border py-1 font-weight-bold text-right"
                                                    style={{ maxWidth: '30px !important' }}
                                                >
                                                </td>
                                                <td className="border py-1 text-left font-weight-bold text-[16px]">
                                                </td>
                                                <td className="border py-1 text-left text-[16px]">
                                                </td>
                                                <td className="border py-1 text-left text-[16px]">
                                                </td>
                                                <td className="border py-1 text-right font-weight-bold text-[18px]">
                                                    {searchStorage.reduce((prev, item) => prev + item.totalprice, 0)}
                                                </td>
                                                <td className="border py-1 text-right font-weight-bold text-[18px]">
                                                    {searchStorage.reduce((prev, item) => prev + item.counteragent_profit, 0)}
                                                </td>
                                                <td className="border py-1 text-right font-weight-bold text-[18px]">
                                                    {searchStorage.reduce((prev, item) => prev + item.counterdoctor_profit, 0)}
                                                </td>
                                                <td className="border py-1 font-weight-bold text-[16px]">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CounterAgentInfo
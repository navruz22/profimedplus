import { useToast } from '@chakra-ui/react'
import { faPrint } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import Print from './components/Print'
import { Sort } from '../adver/Sort'
import { Pagination } from '../components/Pagination'
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers'

const OfflineClients = () => {

    //=================================================
    //=================================================

    //=================================================
    //=================================================
    // AUTH
    const [load, setLoad] = useState(false)

    const { request, loading } = useHttp()

    const auth = useContext(AuthContext)

    //=================================================
    //=================================================

    //=================================================
    //=================================================

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

    //=================================================
    //=================================================

    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastUser = (currentPage + 1) * countPage
    const indexFirstUser = indexLastUser - countPage



    //=================================================
    //=================================================

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );

    //=================================================
    //=================================================

    const [currentClients, setCurrentClients] = useState([])
    const [searchStorage, setSearchStrorage] = useState([])

    const getConnectors = useCallback(async (beginDay, endDay) => {
        try {
            const data = await request(
                `/api/offlineclient/client/getall`,
                'POST',
                { clinica: auth.clinica._id, beginDay, endDay },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            setSearchStrorage(data)
            setCurrentClients(data.slice(indexFirstUser, indexLastUser))
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [request, auth, notify, setSearchStrorage, indexFirstUser, indexLastUser])

    //=================================================
    //=================================================

    const componentRef = useRef()
    const print = useReactToPrint({
        content: () => componentRef.current,
    })

    const [printBody, setPrintBody] = useState({
        connector: {},
        client: {},
        services: []
    })

    const handlePrint = (connector) => {
        setPrintBody(connector)
        setTimeout(() => {
            print()
        }, 1000)
    }

    const searchName =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.fullname.toLowerCase().includes(e.target.value.toLowerCase()),
            )
            setCurrentClients(searching.slice(0, countPage))
        }

    const setPageSize =
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentClients(searchStorage.slice(0, countPage))
        }


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
    };

    const [t, setT] = useState()
    useEffect(() => {
        if (!t) {
            setT(1)
            getConnectors(beginDay, endDay)
        }
    }, [getConnectors])

    //=================================================
    //=================================================

    return (
        <>
            <div className="d-none">
                <div
                    ref={componentRef}
                    className="container p-4"
                    style={{ fontFamily: "times" }}
                >
                    <Print
                        doctor={auth.doctor}
                        clientConnector={printBody}
                    />
                </div>
            </div>
            <div className="content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="border-0 table-container">
                            <div className="border-0 table-container">
                                <div className="table-responsive">
                                    <table className="table m-0">
                                        <thead className="bg-white">
                                            <tr>
                                                <th>
                                                    <select
                                                        className="form-control form-control-sm selectpicker"
                                                        placeholder="Bo'limni tanlang"
                                                        onChange={setPageSize}
                                                        style={{ minWidth: '50px' }}
                                                    >
                                                        <option value={10}>10</option>
                                                        <option value={25}>25</option>
                                                        <option value={50}>50</option>
                                                        <option value={100}>100</option>
                                                    </select>
                                                </th>
                                                <th></th>
                                                <th>
                                                    <input
                                                        onChange={searchName}
                                                        style={{ maxWidth: '200px', minWidth: '100px' }}
                                                        type="search"
                                                        className="w-100 form-control form-control-sm selectpicker"
                                                        placeholder="Mijoz ismi"
                                                    />
                                                </th>
                                                <th className='text-right'>
                                                    <DatePickers changeDate={changeStart} />
                                                </th>
                                                <th>
                                                    <DatePickers changeDate={changeEnd} />
                                                </th>
                                                <th colSpan={2}>
                                                    <Pagination
                                                        setCurrentDatas={setCurrentClients}
                                                        datas={searchStorage}
                                                        setCurrentPage={setCurrentPage}
                                                        countPage={countPage}
                                                        totalDatas={searchStorage.length}
                                                    />
                                                </th>
                                            </tr>
                                        </thead>
                                        <thead>
                                            <tr>
                                                <th className="border-right bg-alotrade text-[16px]">№</th>
                                                <th className="border-right bg-alotrade text-[16px]">Kelgan vaqti</th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    F.I.Sh
                                                    {/* <Sort
                                                    data={currentUsers}
                                                    setData={setCurrentUsers}
                                                    property={'lastname'}
                                                /> */}
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    ID
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    Tel
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    Tug'ilgan san'asi
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px] text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentClients.length > 0 && currentClients.map((connector, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td className="border-right text-[16px] font-weight-bold">
                                                            {key + 1}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {new Date(connector.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {connector.client.fullname}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {connector?.client?.id}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {'+998' + connector.client.phone}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {new Date(connector.client.born).toLocaleDateString()}
                                                        </td>
                                                        <td className="border-right text-[16px] text-center">
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
                                                                    className="ml-2 btn btn-success py-0"
                                                                >
                                                                    <FontAwesomeIcon icon={faPrint} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OfflineClients
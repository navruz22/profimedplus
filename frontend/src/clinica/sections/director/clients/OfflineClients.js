import { useToast } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import { Sort } from '../adver/Sort'
import { Pagination } from '../components/Pagination'

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
    console.log(searchStorage);
    //=================================================
    //=================================================

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
        <div className="content-wrapper px-lg-5 px-3">
            <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="border-0 table-container">
                        <div className="border-0 table-container">
                            <div className="table-responsive">
                                <table className="table m-0">
                                    {/* <thead className="bg-white">
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
                                            <th>
                                                <select
                                                    defaultValue="none"
                                                    className="form-control form-control-sm selectpicker"
                                                    placeholder="Bo'limni tanlang"
                                                    onChange={sortType}
                                                    style={{ minWidth: '50px' }}
                                                >
                                                    <option value="all">Barchasi foydalanuvchilar</option>
                                                    {sections.map((section, index) => {
                                                        return (
                                                            <option value={section.type} key={index}>
                                                                {section.value}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </th>
                                            <th></th>
                                            <th>
                                                <input
                                                    onChange={searchName}
                                                    style={{ maxWidth: '100px', minWidth: '100px' }}
                                                    type="search"
                                                    className="w-100 form-control form-control-sm selectpicker"
                                                    placeholder=""
                                                />
                                            </th>
                                            <th colSpan={2}>
                                                <Pagination
                                                    setCurrentDatas={setCurrentUsers}
                                                    datas={users}
                                                    setCurrentPage={setCurrentPage}
                                                    countPage={countPage}
                                                    totalDatas={users.length}
                                                />
                                            </th>
                                        </tr>
                                    </thead> */}
                                    <thead>
                                        <tr>
                                            <th className="border-right bg-alotrade text-[16px]">№</th>
                                            <th className="border-right bg-alotrade text-[16px]">
                                                F.I.Sh
                                                {/* <Sort
                                                    data={currentUsers}
                                                    setData={setCurrentUsers}
                                                    property={'lastname'}
                                                /> */}
                                            </th>
                                            <th className="border-right bg-alotrade text-[16px]">
                                                Tel
                                            </th>
                                            <th className="border-right bg-alotrade text-[16px]">
                                                Tugilgan san'asi
                                            </th>
                                            <th className="border-right bg-alotrade text-[16px] text-center">Tahrirlash</th>
                                            <th className="text-center bg-alotrade text-[16px]">O'chirish</th>
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
                                                        {connector.client.fullname}
                                                    </td>
                                                    <td className="border-right text-[16px]">
                                                        {'+998' + connector.client.phone}
                                                    </td>
                                                    <td className="border-right text-[16px]">
                                                        {new Date(connector.client.born).toLocaleDateString()}
                                                    </td>
                                                    <td className="border-right text-[16px] text-center">
                                                        {loading ? (
                                                            <button className="btn btn-success" disabled>
                                                                <span class="spinner-border spinner-border-sm"></span>
                                                                Loading...
                                                            </button>
                                                        ) : (
                                                            <button
                                                                // onClick={() => {
                                                                //     setUser(user)
                                                                //     setVisible(true)
                                                                // }}
                                                                type="button"
                                                                className="bg-alotrade rounded text-white font-semibold py-1 px-2"
                                                                style={{ fontSize: '75%' }}
                                                            >
                                                                Tahrirlash
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="text-center text-[16px]">
                                                        {loading ? (
                                                            <button className="btn btn-secondary" disabled>
                                                                <span class="spinner-border spinner-border-sm"></span>
                                                                Loading...
                                                            </button>
                                                        ) : (
                                                            <button
                                                                // onClick={() => {
                                                                //     setRemove(user)
                                                                //     setModal(true)
                                                                // }}
                                                                type="button"
                                                                className="bg-red-400 rounded text-white font-semibold py-1 px-2"
                                                                style={{ fontSize: '75%' }}
                                                            >
                                                                O'chirish
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
    )
}

export default OfflineClients
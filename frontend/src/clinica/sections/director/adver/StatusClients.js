import { useToast } from '@chakra-ui/react'
import { faPenAlt, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import Print from '../clients/components/Print'
import { Pagination } from '../components/Pagination'
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import ReactHtmlTableToExcel from 'react-html-table-to-excel'

const animatedComponents = makeAnimated()

const StatusClients = () => {

    //=================================================
    //=================================================
    const { t } = useTranslation()
    //=================================================
    //=================================================
    // AUTH

    const { request, loading } = useHttp()

    const auth = useContext(AuthContext)

    //=================================================
    //=================================================

    const history = useHistory()

    const { state } = useLocation()

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
                `/api/adver/status/clients`,
                'POST',
                { clinica: auth.clinica._id, beginDay, endDay, status: state.status },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            setSearchStrorage(data)
            setCurrentClients(data)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [request, auth, notify, setSearchStrorage])

    //=================================================
    //=================================================

    // const [doctors, setDoctors] = useState([])

    // const getDoctors = useCallback(async () => {
    //     try {
    //         const data = await request(
    //             `/api/doctor/get`,
    //             'POST',
    //             { clinica: auth.clinica._id },
    //             {
    //                 Authorization: `Bearer ${auth.token}`,
    //             },
    //         )
    //         setDoctors([...data].map(el => ({
    //             value: el.specialty._id,
    //             label: el.firstname + ' ' + el.lastname
    //         })))
    //     } catch (error) {
    //         notify({
    //             title: t(`${error}`),
    //             description: '',
    //             status: 'error',
    //         })
    //     }
    // }, [request, auth, notify])

    //=================================================
    //=================================================

    const [baseUrl, setBaseUrl] = useState()

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request('/api/baseurl', 'GET', null)
            setBaseUrl(data.baseUrl)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [request, notify])

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


    const [name, setName] = useState('')

    const searchName =
        (e) => {
            const searching = searchStorage.filter((item) => {
                const age = (new Date().getFullYear() - new Date(item?.client?.born).getFullYear())
                return item.client.fullname.toLowerCase().includes(e.target.value.toLowerCase()) && age >= minAge && age <= maxAge
            })
            setCurrentClients(searching)
            setName(e.target.value)

        }

    const setPageSize =
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentClients(searchStorage.slice(0, e.target.value))
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

    const [s, setS] = useState()
    useEffect(() => {
        if (!s) {
            setS(1)
            getConnectors(beginDay, endDay)
            // getDoctors()
            getBaseUrl()
        }
    }, [getConnectors, getBaseUrl, beginDay, endDay])

    //=================================================
    //=================================================
    const [age, setAge] = useState(null)
    const [minAge, setMinAge] = useState(1)
    const [maxAge, setMaxAge] = useState(100)


    const [gender, setGender] = useState(null)
    const [national, setNational] = useState(null)

    const changeNational = (e) => {
        setNational(e.target.value)
    }

    const changeGender = (e) => {
        setGender(e.target.value)
    }

    const changeMinAge = (e) => {
        const min_age = e.target.value
        setCurrentClients([...searchStorage].filter(connector => {
            const age = (new Date().getFullYear() - new Date(connector?.client?.born).getFullYear())
            const isGender = gender ? connector?.client?.gender === gender : true
            const isNational = national && connector?.client?.national ? connector?.client?.national === national : true
            const isName = name ? connector.client.fullname.toLowerCase().includes(name.toLowerCase()) : true
            return age >= min_age && age <= maxAge && isGender && isNational && isName
        }
        ))
        setMinAge(min_age)
    }

    const changeMaxAge = (e) => {
        const max_age = e.target.value
        setCurrentClients([...searchStorage].filter(connector => {
            const age = (new Date().getFullYear() - new Date(connector?.client?.born).getFullYear())
            const isGender = gender ? connector?.client?.gender === gender : true
            const isNational = national && connector?.client?.national ? connector?.client?.national === national : true
            const isName = name ? connector.client.fullname.toLowerCase().includes(name.toLowerCase()) : true
            return age >= minAge && age <= max_age && isGender && isNational && isName
        }
        ))
        setMaxAge(max_age)
    }

    const setSearch = () => {
        const getAge = age => new Date().getFullYear() - new Date(age?.client?.born).getFullYear()
        if (gender && !national) {
            setCurrentClients([...searchStorage].filter(connector =>
                getAge(connector) >= minAge && getAge(connector) <= maxAge && connector?.client?.gender === gender
            ))
        } else if (national && !gender) {
            setCurrentClients([...searchStorage].filter(connector =>
                getAge(connector) >= minAge && getAge(connector) <= maxAge && (connector?.client?.national && connector?.client?.national === national)
            ))
            // } else if (gender && national && !age) {
            //     setCurrentClients([...searchStorage].filter(connector =>
            //         connector?.client?.gender === gender && (connector?.client?.national && connector?.client?.national === national)
            //     ))
            // } else if (age && gender && national) {
            //     setCurrentClients([...searchStorage].filter(connector =>
            //         new Date().getFullYear() - new Date(connector?.client?.born).getFullYear() === age && (connector?.client?.national && connector?.client?.national === national) && connector?.client?.gender === gender
            //     ))
        } else {
            // age && setCurrentClients([...searchStorage].filter(connector =>
            //     new Date().getFullYear() - new Date(connector?.client?.born).getFullYear() === age
            // ))
            national && setCurrentClients([...searchStorage].filter(connector =>
                connector?.client?.national && connector?.client?.national === national
            ))
            gender && setCurrentClients([...searchStorage].filter(connector =>
                connector?.client?.gender === gender
            ))
        }
    }

    //=================================================
    //=================================================

    // const changeDoctorClients = (e) => {
    //     if (e.value === 'all') {
    //         setCurrentClients([...searchStorage])
    //     } else {
    //         setCurrentClients([...searchStorage].filter(el => el.services.some(i => !i.accept && i.department._id === e.value)))
    //     }
    // }

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
                        baseUrl={baseUrl}
                        clinica={auth && auth.clinica}
                        connector={printBody}
                    />
                </div>
            </div>
            <div className="content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        {/* <div className="w-[300px] mb-2">
                            <Select
                                components={animatedComponents}
                                options={[
                                    {
                                        value: 'all',
                                        label: 'Xammasi',
                                    },
                                    ...doctors
                                ]}
                                theme={(theme) => ({
                                    ...theme,
                                    borderRadius: 0,
                                    padding: 0,
                                    height: 0,
                                })}
                                onChange={changeDoctorClients}
                            />
                        </div> */}
                        <div className="border-0 table-container">
                            <div className="border-0 table-container">
                                <div className="table-responsive">
                                    <div className='bg-white flex items-center justify-between gap-2 p-2'>
                                        {/* <div>
                                            <select
                                                className="form-control form-control-sm selectpicker"
                                                placeholder={t("Bo'limni tanlang")}
                                                onChange={setPageSize}
                                                style={{ minWidth: '50px' }}
                                            >
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                        </div> */}
                                        <div>
                                            <input
                                                onChange={searchName}
                                                value={name}
                                                style={{ maxWidth: '200px', minWidth: '100px' }}
                                                type="search"
                                                className="w-100 form-control form-control-sm selectpicker"
                                                placeholder={t("F.I.Sh")}
                                            />
                                        </div>
                                        <div className='text-right'>
                                            <DatePickers changeDate={changeStart} />
                                        </div>
                                        <div>
                                            <DatePickers changeDate={changeEnd} />
                                        </div>
                                        {/* <div>
                                            <Pagination
                                                setCurrentDatas={setCurrentClients}
                                                datas={searchStorage}
                                                setCurrentPage={setCurrentPage}
                                                countPage={countPage}
                                                totalDatas={searchStorage.length}
                                            />
                                        </div> */}

                                        <div className='flex items-center gap-2'>
                                            <div>Yoshi:{' '}</div>
                                            <input
                                                onChange={changeMinAge}
                                                value={minAge}
                                                style={{ maxWidth: '200px', minWidth: '100px' }}
                                                type="number"
                                                className="w-100 form-control form-control-sm selectpicker"
                                                placeholder={t("dan")}
                                            />
                                            <div>dan</div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <input
                                                onChange={changeMaxAge}
                                                value={maxAge}
                                                style={{ maxWidth: '200px', minWidth: '100px' }}
                                                type="number"
                                                className="w-100 form-control form-control-sm selectpicker"
                                                placeholder={t("gacha")}
                                            />
                                            <div>gacha</div>
                                        </div>
                                        <div>
                                            <select
                                                className="form-control form-control-sm selectpicker"
                                                placeholder={t("Jinsi")}
                                                onChange={changeGender}
                                                style={{ minWidth: '50px' }}
                                            >
                                                <option value={''}>{t("Jinsi")}</option>
                                                <option value={'man'}>{t("Erkak")}</option>
                                                <option value={'woman'}>{t("Ayol")}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <select
                                                className="form-control form-control-sm selectpicker"
                                                placeholder={t("Fuqoroligi")}
                                                onChange={changeNational}
                                                style={{ minWidth: '50px' }}
                                            >
                                                <option value={''}>{t("Fuqoroligi")}</option>
                                                <option value={'uzb'}>{t("Uzbek")}</option>
                                                <option value={'foreigner'}>{t("Chet'ellik")}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-success py-0"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setSearch()
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </div>
                                        <div className="texte-center">
                                            <div className="btn btn-primary">
                                                <ReactHtmlTableToExcel
                                                    id="reacthtmltoexcel"
                                                    table="clients-table"
                                                    sheet="Sheet"
                                                    buttonText="Excel"
                                                    filename={t("Mijozlar")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <table className="table m-0" id="clients-table">
                                        <thead>
                                            <tr>
                                                <th className="border-right bg-alotrade text-[16px]">№</th>
                                                <th className="border-right bg-alotrade text-[16px]">{t("Status")}</th>
                                                <th className="border-right bg-alotrade text-[16px]">{t("Kelgan vaqti")}</th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    {t("F.I.Sh")}
                                                    {/* <Sort
                                                    data={currentUsers}
                                                    setData={setCurrentUsers}
                                                    property={'lastname'}
                                                /> */}
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    {t("ID")}
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    {t("Tel")}
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    {t("Manzil")}
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    {t("Yoshi")}
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    {t("Jinsi")}
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    {t("Fuqoroligi")}
                                                </th>
                                                <th className="border-right bg-alotrade text-[16px]">
                                                    {t("Tug'ilgan san'asi")}
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
                                                            {connector?.status?.name}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {new Date(connector?.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {connector?.client?.fullname}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {connector?.client?.id}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {'+998' + connector?.client?.phone}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {connector?.client?.address}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {new Date().getFullYear() - new Date(connector?.client?.born).getFullYear()}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {connector?.client?.gender ? connector?.client?.gender === 'man' ? t('Erkak') : t('Ayol') : ''}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {connector?.client?.national ? connector?.client?.national === 'uzb' ? t('Uzbek') : t("Chet'ellik") : ''}
                                                        </td>
                                                        <td className="border-right text-[16px]">
                                                            {new Date(connector?.client?.born).toLocaleDateString()}
                                                        </td>
                                                        <td className="border py-1 text-center text-[16px]">
                                                            {loading ? (
                                                                <button className="btn btn-success" disabled>
                                                                    <span className="spinner-border spinner-border-sm"></span>
                                                                    Loading...
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() =>
                                                                        history.push("/alo24/statsionarclient_history", { connector, clinica: auth?.clinica, user: auth?.user, baseUrl })
                                                                    }
                                                                    className="btn btn-primary py-0"
                                                                >
                                                                    <FontAwesomeIcon icon={faPenAlt} />
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

export default StatusClients
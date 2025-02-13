import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '../../../loader/Loader'
import { useToast } from '@chakra-ui/react'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import { checkStatus } from './checkData'
import { Modal } from './modal/Modal'
import { Sort } from './Sort'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers'

export const Status = () => {
    //====================================================================
    //====================================================================
    const [modal, setModal] = useState(false)
    const [modal1, setModal1] = useState(false)
    const [remove, setRemove] = useState()

    const clearInputs = useCallback(() => {
        const inputs = document.getElementsByTagName('input')
        for (const input of inputs) {
            input.value = ''
        }
    }, [])
    //====================================================================
    //====================================================================
    const { t } = useTranslation()
    //====================================================================
    //====================================================================

    const history = useHistory()

    // const { state: } = useLocation()

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

    const [status, setStatus] = useState({
        clinica: auth.clinica && auth.clinica._id,
    })
    //====================================================================
    //====================================================================

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );


    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getStatus(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
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
        getStatus(beginDay, date);
    };

    //====================================================================
    //====================================================================
    const [statuses, setStatuss] = useState()

    const getStatus = useCallback(async (beginDay, endDay) => {
        try {
            const data = await request(
                `/api/adver/status/getall`,
                'POST',
                { clinica: auth.clinica._id, beginDay, endDay },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            setStatuss(data)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [request, auth, notify])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================

    const createHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/adver/status/register`,
                'POST',
                { ...status },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} ${t("statusi yaratildi")}!`,
                description: '',
                status: 'success',
            })
            getStatus()
            setStatus({
                clinica: auth.clinica && auth.clinica._id,
            })
            clearInputs()
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [request, auth, notify, getStatus, status, clearInputs])

    const updateHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/adver/status`,
                'PUT',
                { ...status },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} ${t("statusi yangilandi")}!`,
                description: '',
                status: 'success',
            })
            getStatus()
            setStatus({
                clinica: auth.clinica && auth.clinica._id,
            })
            clearInputs()
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [request, auth, notify, getStatus, status, clearInputs])

    const saveHandler = () => {
        if (checkStatus(status)) {
            return notify(checkStatus(status))
        }
        if (status._id) {
            return updateHandler()
        } else {
            return createHandler()
        }
    }

    const keyPressed = (e) => {
        if (e.key === 'Enter') {
            return saveHandler()
        }
    }

    const deleteHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/adver/status`,
                'DELETE',
                { ...remove },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} ${t("statuslarni o'chirildi")}!`,
                description: '',
                status: 'success',
            })
            getStatus()
            setModal(false)
            setStatus({
                clinica: auth.clinica && auth.clinica._id,
            })
            clearInputs()
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, remove, notify, getStatus, clearInputs])

    const deleteAll = useCallback(async () => {
        if (statuses && statuses.length === 0) {
            return notify({
                title: `Statuslar mavjud emas`,
                description: '',
                status: 'warning',
            })
        }
        try {
            const data = await request(
                `/api/adver/status/deleteall`,
                'DELETE',
                { ...status },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            localStorage.setItem('delete', data)
            notify({
                title: t(`Barcha Statuslar o'chirildi!`),
                description: '',
                status: 'success',
            })
            getStatus()
            setModal1(false)
            setStatus({
                clinica: auth.clinica && auth.clinica._id,
            })
            clearInputs()
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, notify, getStatus, clearInputs, status, statuses])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================

    const inputHandler = (e) => {
        setStatus({ ...status, name: e.target.value })
    }

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [state, setState] = useState({})
    localStorage.setItem('state', state)
    useEffect(() => {
        getStatus(beginDay, endDay)
        return () => {
            setState({}) // This worked for me
        }
    }, [getStatus, beginDay, endDay])
    //====================================================================
    //====================================================================

    return (
        <>
            {loading ? <Loader /> : ''}
            <div className="content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="border-0 table-container">
                            <div className="table-responsive">
                                <table className="table m-0">
                                    <thead>
                                        <tr>
                                            <th className="bg-alotrade text-[14px]">{t("Status nomini kiriting")}</th>
                                            <th className="bg-alotrade text-[14px]">{t("Saqlash")}</th>
                                            <th className="bg-alotrade text-[14px]">{t("O'chirish")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input
                                                    style={{ minWidth: '70px' }}
                                                    value={status.name}
                                                    onKeyUp={keyPressed}
                                                    onChange={inputHandler}
                                                    type="text"
                                                    className="form-control w-75"
                                                    id="inputName"
                                                    placeholder={t("Status nomini kiriting")}
                                                />
                                            </td>
                                            <td>
                                                {loading ? <button className='btn btn-info' disabled>
                                                    <span class="spinner-border spinner-border-sm"></span>
                                                    Loading...
                                                </button>
                                                    :
                                                    <button
                                                        onClick={saveHandler}
                                                        className="btn btn-info py-1 px-4"
                                                    >
                                                        {t("Saqlash")}
                                                    </button>
                                                }
                                            </td>
                                            <td>
                                                {loading ? <button className='btn btn-danger' disabled>
                                                    <span class="spinner-border spinner-border-sm"></span>
                                                    Loading...
                                                </button>
                                                    :
                                                    <button
                                                        onClick={() => setModal1(true)}
                                                        className="btn btn-danger py-0 px-4 pt-1"
                                                    >
                                                        <span className="icon-trash-2"></span>
                                                    </button>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="border-0 table-container">
                            <div className="border-0 table-container">
                                <div className="table-responsive">
                                    <div className='bg-white flex items-center justify-center gap-2 p-2'>
                                        <div className='flex items-center gap-2'>
                                            <div className='text-right'>
                                                <DatePickers changeDate={changeStart} />
                                            </div>
                                            <div>
                                                <DatePickers changeDate={changeEnd} />
                                            </div>
                                        </div>
                                    </div>
                                    <table className="table m-0">
                                        <thead>
                                            <tr>
                                                <th className="border-right  text-[12px] bg-alotrade">№</th>
                                                <th className="border-right  text-[12px] bg-alotrade">
                                                    {t("Nomi")}{'  '}
                                                    <Sort
                                                        data={statuses}
                                                        setData={setStatuss}
                                                        property={'name'}
                                                    />
                                                </th>
                                                <th className="border-right text-center text-[12px] bg-alotrade">{t("Mijozlar")}</th>
                                                <th className="border-right text-center text-[12px] bg-alotrade">{t("Batafsil")}</th>
                                                <th className="border-right text-center text-[12px] bg-alotrade">{t("Tahrirlash")}</th>
                                                <th className="text-center text-[12px] bg-alotrade">{t("O'chirish")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {statuses &&
                                                statuses.map((d, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td className="border-right text-[16px] font-weight-bold">{key + 1}</td>
                                                            <td className='border-right text-[16px]'>{d.name}</td>
                                                            <td className='border-right text-[16px]'>{d.clients}</td>
                                                            <td className='border-right text-center'>
                                                                {loading ? (
                                                                    <button className="btn btn-success" disabled>
                                                                        <span class="spinner-border spinner-border-sm"></span>
                                                                        Loading...
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            history.push('/alo24/status_clients', {
                                                                                status: d._id
                                                                            })
                                                                        }}
                                                                        // type="button"
                                                                        className="btn btn-info font-semibold py-1 px-2"
                                                                        style={{ fontSize: '14px' }}
                                                                    >
                                                                        {t("Batafsil")}
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td className='border-right text-center'>
                                                                <button
                                                                    onClick={() => setStatus(d)}
                                                                    id={`btn${key}`}
                                                                    type="button"
                                                                    className="text-white font-semibold bg-alotrade rounded py-1 px-2"
                                                                    style={{ fontSize: '14px' }}
                                                                >
                                                                    {t("Tahrirlash")}
                                                                </button>
                                                            </td>
                                                            <td className='border-right text-center'>
                                                                <button
                                                                    onClick={() => {
                                                                        setRemove(d)
                                                                        setModal(true)
                                                                    }}
                                                                    type="button"
                                                                    className="text-white font-semibold bg-red-400 rounded-lg py-1 px-2"
                                                                    style={{ fontSize: '14px' }}
                                                                >
                                                                    {t("O'chirish")}
                                                                </button>
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

            <Modal
                modal={modal}
                setModal={setModal}
                basic={remove && remove.name}
                text={t("Statusni o'chirishni tasdiqlaysizmi?")}
                handler={deleteHandler}
            />

            <Modal
                modal={modal1}
                setModal={setModal1}
                basic={''}
                text={t("Barcha statuslarni o'chirishni tasdiqlaysizmi?")}
                handler={deleteAll}
            />
        </>
    )
}

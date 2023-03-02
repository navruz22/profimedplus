import { useToast } from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { useHttp } from '../../../hooks/http.hook';
import RegisterDoctor from './components/RegisterDoctor';
import Table from './components/Table';

const Doctors = () => {
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;

    //====================================================
    //====================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================
    //====================================================

    const toast = useToast();

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
        [toast]
    );

    //====================================================
    //====================================================

    const [visible, setVisible] = useState(false);

    const changeVisible = () => setVisible(!visible);

    //====================================================
    //====================================================

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );

    const [counterdoctor, setCounterdoctor] = useState('')

    //====================================================
    //====================================================

    const [doctor, setDoctor] = useState({
        lastname: "",
        firstname: "",
        clinica_name: "",
        clinica: auth?.clinica?._id,
        counter_agent: auth?.user?._id,
    })

    const changeDoctorData = (e) => {
        setDoctor({ ...doctor, [e.target.name]: e.target.value });
    }

    //==============================================================
    //==============================================================

    const createHandler = async () => {
        try {
            const data = await request(
                `/api/counter_agent/doctor/create`,
                "POST",
                { ...doctor },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: `${data.firstname} ${data.lastname} yunaltiruvchi shifokor yaratildi!`,
                description: "",
                status: "success",
            });
            setDoctor({
                lastname: "",
                firstname: "",
                clinica_name: "",
                clinica: auth?.clinica?._id,
                counter_agent: auth?.user?._id,
            })
            getDoctorsList()
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    const checkData = () => {
        if (!doctor.firstname) {
            return notify({
                title: "Shifokorni nomi terilmagan!",
                description: "",
                status: "error"
            })
        }
        if (!doctor.lastname) {
            return notify({
                title: "Shifokorni familiyasi terilmagan!",
                description: "",
                status: "error"
            })
        }
        if (!doctor.clinica_name) {
            return notify({
                title: "Shifokorni klinikasi terilmagan!",
                description: "",
                status: "error"
            })
        }
        createHandler();
    }

    //==============================================================
    //==============================================================

    const [counterdoctors, setCounterdoctors] = useState([]);
    const [searchStorage, setSearchStorage] = useState([]);

    const getCounterDoctorsService = useCallback(async (beginDay, endDay, counterdoctor) => {
        try {
            const data = await request(
                `/api/counter_agent/doctors_services/get`,
                "POST",
                {
                    clinica: auth && auth.clinica._id,
                    counter_agent: auth.user._id,
                    counterdoctor,
                    beginDay,
                    endDay
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setSearchStorage(data);
            setCounterdoctors(
                data.slice(indexFirstConnector, indexLastConnector)
            );
            console.log(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [auth, request, notify, counterdoctor, beginDay, endDay, indexFirstConnector, indexLastConnector])

    //==============================================================
    //==============================================================

    const setPageSize =
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCounterdoctors(searchStorage.slice(0, e.target.value));
        }

    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getCounterDoctorsService(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, counterdoctor);
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
        getCounterDoctorsService(beginDay, date, counterdoctor);
    }

    //==============================================================
    //==============================================================

    const changeCounterDoctor = (e) => {
        if (e.target.value === 'none') {
            setCounterdoctor('')
            getCounterDoctorsService(beginDay, endDay, '')
        } else {
            setCounterdoctor(e.target.value)
            getCounterDoctorsService(beginDay, endDay, e.target.value)
        }
    }

    const searchClientName = (e) => {
        const searching = searchStorage.filter((item) =>
            item.client.firstname
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
            item.client.lastname
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );
        setCounterdoctors(searching);
    }

    //==============================================================
    //==============================================================

    const [doctors, setDoctors] = useState([]);

    const getDoctorsList = useCallback(async () => {
        try {
            const data = await request(
                `/api/counter_agent/counterdoctorall/get`,
                "POST",
                {
                    clinica: auth && auth.clinica._id,
                    counter_agent: auth.user._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctors(data)
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

    //==============================================================
    //==============================================================

    const [t, setT] = useState(0);

    useEffect(() => {
        if (auth.clinica && !t) {
            setT(1);
            getCounterDoctorsService(beginDay, endDay, counterdoctor);
        }
    }, [getCounterDoctorsService, auth, t]);

    //==============================================================
    //==============================================================


    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="row">
                            <div className="col-12 text-end">
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "d-none" : ""
                                        }`}
                                    onClick={changeVisible}
                                >
                                    Registratsiya
                                </button>
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "" : "d-none"
                                        }`}
                                    onClick={changeVisible}
                                >
                                    Registratsiya
                                </button>
                            </div>
                        </div>
                        <div className={` ${visible ? "" : "d-none"}`}>
                            <RegisterDoctor
                                loading={loading}
                                changeDoctorData={changeDoctorData}
                                doctor={doctor}
                                checkData={checkData}
                            />
                        </div>
                        <Table
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            changeCounterDoctor={changeCounterDoctor}
                            counterDoctorsList={doctors}
                            connectors={searchStorage}
                            setCurrentConnectors={setCounterdoctors}
                            currentConnectors={counterdoctors}
                            currentPage={currentPage}
                            countPage={countPage}
                            setPageSize={setPageSize}
                            searchClientName={searchClientName}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Doctors
import { useToast } from '@chakra-ui/react';
import { faAngleDown, faAngleUp, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { useHttp } from '../../../hooks/http.hook';
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers';
import { Pagination } from '../components/Pagination';
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()

const DoctorProcient = () => {

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );


    //======================================================
    //======================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    const history = useHistory()

    //======================================================
    //======================================================

    const [clinicaDataSelect, setClinicaDataSelect] = useState({
        value: auth?.clinica?._id,
        label: auth?.clinica?.name,
    });
    const [clinicaValue, setClinicaValue] = useState(auth?.clinica?._id)

    //======================================================
    //======================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastConnector = (currentPage + 1) * countPage
    const indexFirstConnector = indexLastConnector - countPage

    //======================================================
    //======================================================

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

    //======================================================
    //======================================================

    const [doctors, setDoctors] = useState([])
    const [currentDoctors, setCurrentDoctors] = useState([])
    const [searchStorage, setSearchStrorage] = useState([])

    const getDoctorCleitns = useCallback(
        async (beginDay, endDay, clinica) => {
            try {
                const data = await request(
                    `/api/doctor_procient/doctor/get`,
                    "POST",
                    { clinica: clinica, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setDoctors(data)
                setSearchStrorage(data)
                setCurrentDoctors(
                    data.slice(indexFirstConnector, indexLastConnector),
                )
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify]
    );

    //=======================================================
    //=======================================================

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getDoctorCleitns(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, clinicaValue);
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
        getDoctorCleitns(beginDay, date, clinicaValue);
    }

    //=======================================================
    //=======================================================

    const setPageSize =
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentDoctors(doctors.slice(0, e.target.value))
        }

    const searchFullname =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.firstname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                item.lastname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            )
            setDoctors(searching)
            setCurrentDoctors(searching.slice(0, countPage))
        }

    //=======================================================
    //=======================================================

    const [t, setT] = useState(0);

    useEffect(() => {
        if (!t) {
            setT(1)
            getDoctorCleitns(beginDay, endDay, clinicaValue)
        }
    }, [getDoctorCleitns, t, beginDay, endDay, clinicaValue])

    return (
        <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
            <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    {auth?.clinica?.mainclinica && auth?.clinica?.filials.length > 0 && <div className="w-[300px] mb-2">
                        <Select
                            value={clinicaDataSelect}
                            onChange={(e) => {
                                setClinicaDataSelect(e)
                                setClinicaValue(e.value);
                                getDoctorCleitns(beginDay, endDay, e.value);
                            }}
                            components={animatedComponents}
                            options={[
                                {
                                    value: auth?.clinica?._id,
                                    label: auth?.clinica?.name,
                                },
                                ...[...auth?.clinica?.filials].map(el => ({
                                    value: el._id,
                                    label: el.name
                                }))]}
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                padding: 0,
                                height: 0,
                            })}
                        />
                    </div>}
                    <div className="border-0 table-container">
                        <div className="border-0 table-container">
                            <div className="table-responsive">
                                <div className="bg-white flex gap-4 items-center p-2">
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
                                    <div>
                                        <input
                                            onChange={searchFullname}
                                            style={{ minWidth: "100px" }}
                                            type="search"
                                            className="w-100 form-control form-control-sm selectpicker"
                                            placeholder="F.I.O"
                                        />
                                    </div>
                                    <div
                                        className="text-center ml-auto flex gap-2"
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <DatePickers changeDate={changeStart} />
                                        <DatePickers changeDate={changeEnd} />
                                    </div>
                                    <div className="text-center ml-auto mr-4">
                                        <Pagination
                                            setCurrentDatas={setCurrentDoctors}
                                            datas={doctors}
                                            setCurrentPage={setCurrentPage}
                                            countPage={countPage}
                                            totalDatas={doctors.length}
                                        />
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
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
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
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    b.client.fullname > a.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                Bo'lim
                                                <div className="btn-group-vertical ml-2">
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
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
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    b.client.fullname > a.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                Umumiy summa
                                                <div className="btn-group-vertical ml-2">
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
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
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    b.client.fullname > a.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                Shifokor ulushi
                                                <div className="btn-group-vertical ml-2">
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
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
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    b.client.fullname > a.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentDoctors.map((doctor, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td
                                                        className={`border py-1 font-weight-bold text-right text-[16px]`}
                                                        style={{ maxWidth: "30px !important" }}
                                                    >
                                                        {currentPage * countPage + key + 1}
                                                    </td>
                                                    <td className="border py-1 text-[16px] font-weight-bold">
                                                        {doctor.lastname +
                                                            " " +
                                                            doctor.firstname}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-center">
                                                        {doctor?.specialty?.name}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {doctor.total}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {doctor.profit}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-center">
                                                        {loading ? (
                                                            <button className="btn btn-success" disabled>
                                                                <span class="spinner-border spinner-border-sm"></span>
                                                                Loading...
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    history.push('/alo24/doctor_procient_services', {
                                                                        doctor
                                                                    })
                                                                }}
                                                                type="button"
                                                                className="bg-alotrade rounded text-white font-semibold py-1 px-2"
                                                                style={{ fontSize: '75%' }}
                                                            >
                                                                Batafsil
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
                </div>
            </div>
        </div>
    )
}

export default DoctorProcient
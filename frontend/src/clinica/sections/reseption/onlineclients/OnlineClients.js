import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal, Modal as Modal2 } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import { checkClientData, checkProductsData, checkServicesData, } from "./checkData/checkData";
import { CheckModal } from "../components/ModalCheck";

export const OnlineClients = () => {
    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );
    //====================================================================
    //====================================================================
    // MODAL
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // RegisterPage
    const [visible, setVisible] = useState(false);

    const changeVisible = () => setVisible(!visible);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;
    const [currentConnectors, setCurrentConnectors] = useState([]);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
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
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    const [searchStorage, setSearchStrorage] = useState([]);

    const getConnectors = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/onlineclient/client/getall`,
                    "POST",
                    { clinica: auth && auth.clinica._id, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setConnectors(data);
                setSearchStrorage(data);
                setCurrentConnectors(
                    data.slice(indexFirstConnector, indexLastConnector)
                );
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );
    //====================================================================
    //====================================================================+

    //====================================================================
    //====================================================================
    // SEARCH
    const searchFullname = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.fullname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchId = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.id.toString().includes(e.target.value)
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchProbirka = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.probirka.toString().includes(e.target.value)
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchPhone = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.phone.toString().includes(e.target.value)
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentConnectors(connectors.slice(0, countPage));
        },
        [countPage, connectors]
    );
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // DEPARTMENTS
    const [departments, setDepartments] = useState([]);

    const getDepartments = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/department/getall`,
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDepartments(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [connector, setConnector] = useState({
        clinica: auth.clinica && auth.clinica._id,
        probirka: 0,
    });

    const [check, setCheck] = useState({});

    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const changeService = (services) => {
        let s = [];
        services.map((service) => {
            if (service.department.probirka) {
                setConnector({ ...connector, probirka: 1, clinica: auth.clinica._id });
            }
            return s.push({
                clinica: auth.clinica._id,
                reseption: auth.user._id,
                serviceid: service.service._id,
                service: service.service,
                department: service.department._id,
                pieces: 1,
            });
        });
        setServices(s);
        setSelectedServices(services);
    };

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // COUNTERDOCTORS
    const [counterdoctors, setCounterDoctors] = useState([]);

    const getCounterDoctors = useCallback(async () => {
        try {
            const data = await request(
                `/api/user/gettype`,
                "POST",
                { clinica: auth.clinica._id, type: "CounterDoctor" },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setCounterDoctors(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [counteragent, setCounterAgent] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
    });

    const changeCounterAgent = (e) => {
        if (e.target.value === "delete") {
            let s = { ...counteragent };
            delete s.counterdoctor;
            delete s.counteragent;
            setCounterAgent(s);
        } else {
            setCounterAgent({
                ...counteragent,
                counterdoctor: JSON.parse(e.target.value)._id,
                counteragent: JSON.parse(e.target.value).user,
                clinica: auth.clinica._id,
            });
        }
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // ADVERS
    const [advers, setAdvers] = useState([]);

    const getAdvers = useCallback(async () => {
        try {
            const data = await request(
                `/api/adver/adver/getall`,
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setAdvers(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [adver, setAdver] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
    });

    const changeAdver = (e) => {
        if (e.target.value === "delete") {
            let s = { ...adver };
            delete s.adver;
            setAdver(s);
        } else {
            setAdver({
                ...adver,
                adver: e.target.value,
            });
        }
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // PRODUCTS
    const [products, setProducts] = useState([]);

    const getProducts = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/product/getall`,
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );

            let s = [];
            data.map((product) => {
                return s.push({
                    label: product.name,
                    value: product._id,
                    product: product,
                });
            });
            setProducts(s);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [newproducts, setNewProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const changeProduct = (newproducts) => {
        let s = [];
        newproducts.map((product) => {
            return s.push({
                clinica: auth.clinica._id,
                reseption: auth.user._id,
                productid: product.product._id,
                product: product.product,
                pieces: 1,
            });
        });
        setNewProducts(s);
        setSelectedProducts(newproducts);
    };

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // BASEURL
    const [baseUrl, setBaseurl] = useState();

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request(`/api/baseurl`, "GET", null);
            setBaseurl(data);
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

    //====================================================================
    //====================================================================
    // CLIENT

    const [client, setClient] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
    });

    const changeClientData = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const changeClientBorn = (e) => {
        setClient({ ...client, born: e });
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CLEAR

    const clearDatas = useCallback(() => {
        setClient({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
        setConnector({
            clinica: auth.clinica && auth.clinica._id,
            probirka: 0,
        });
        setAdver({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
        setCounterAgent({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
        setNewProducts([]);
        setServices([]);
        setSelectedProducts([]);
        setSelectedServices([]);
    }, [auth]);

    const checkData = () => {
        if (checkClientData(client)) {
            return notify(checkClientData(client));
        }

        if (checkServicesData(services && services)) {
            return notify(checkServicesData(services));
        }

        if (checkProductsData(newproducts)) {
            return notify(checkProductsData(newproducts));
        }
        setModal(true);
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CreateHandler

    const createHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/onlineclient/client/register`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counteragent: { ...counteragent, clinica: auth.clinica._id },
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: "Mijoz muvaffaqqiyatli yaratildi.",
                description: "",
                status: "success",
            });
            const s = [data, ...connectors];
            setConnectors(s);
            setSearchStrorage(s);
            setCurrentConnectors(s.slice(indexFirstConnector, indexLastConnector));
            setModal(false);
            clearDatas();
            setVisible(false);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        connector,
        notify,
        services,
        newproducts,
        request,
        indexLastConnector,
        indexFirstConnector,
        connectors,
        clearDatas,
        adver,
        counteragent,
    ]);

    const updateHandler = useCallback(async () => {
        if (checkClientData(client)) {
            return notify(checkClientData(client));
        }
        try {
            const data = await request(
                `/api/onlineclient/client/update`,
                "PUT",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    counteragent: { ...counteragent, clinica: auth.clinica._id },
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            getConnectors(beginDay, endDay);
            notify({
                title: `${data.lastname + " " + data.firstname
                    }  ismli mijoz ma'lumotlari muvaffaqqiyatl yangilandi.`,
                description: "",
                status: "success",
            });
            clearDatas();
            setVisible(false);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        adver,
        counteragent,
        connector,
        notify,
        request,
        clearDatas,
        getConnectors,
        beginDay,
        endDay,
    ]);

    const addHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/onlineclient/client/add`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counteragent: { ...counteragent, clinica: auth.clinica._id },
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            localStorage.setItem("data", data);
            getConnectors(beginDay, endDay);
            notify({
                title: `${client.lastname + " " + client.firstname
                    }  ismli mijozga xizmatlar muvaffaqqiyatli qo'shildi.`,
                description: "",
                status: "success",
            });
            clearDatas();
            setModal(false);
            setVisible(false);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        services,
        newproducts,
        connector,
        adver,
        counteragent,
        beginDay,
        endDay,
        notify,
        request,
        clearDatas,
        getConnectors,
    ]);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // ChangeDate

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

    const changeBronDay = (date, indx) => {
        const arr = [...services].map((item, index) => {
            if (index === indx) {
                item.bronday = date;
                return item;
            }
            return item;
        });
        setServices(arr);
    };

    //====================================================================
    //====================================================================
    //Post To Offline
    const [postConnector, setPostConnecter] = useState({});

    const PostToOffline = async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/registeronline`,
                "POST",
                { ...postConnector },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            localStorage.setItem("data", data);
            setModal2(false)
            notify({
                title: "Mijoz ma'lumotlari kunduzgi mijozlar ro'yxatiga o'tkazildi.",
                description: "",
                status: "success",
            });
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // useEffect
    const [t, setT] = useState(0);

    useEffect(() => {
        if (auth.clinica && !t) {
            setT(1);
            getConnectors(beginDay, endDay);
            getDepartments();
            getCounterDoctors();
            getAdvers();
            getProducts();
            getBaseUrl();
        }
    }, [
        auth,
        getConnectors,
        getAdvers,
        t,
        getProducts,
        getCounterDoctors,
        getDepartments,
        getBaseUrl,
        beginDay,
        endDay,
    ]);

    //====================================================================
    //====================================================================
    return (
        <div>
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
                            <RegisterClient
                                selectedServices={selectedServices}
                                selectedProducts={selectedProducts}
                                updateData={updateHandler}
                                checkData={checkData}
                                setNewProducts={setNewProducts}
                                setNewServices={setServices}
                                newservices={services}
                                newproducts={newproducts}
                                changeProduct={changeProduct}
                                changeService={changeService}
                                changeAdver={changeAdver}
                                changeCounterAgent={changeCounterAgent}
                                client={client}
                                setClient={setClient}
                                changeClientData={changeClientData}
                                changeClientBorn={changeClientBorn}
                                departments={departments}
                                counterdoctors={counterdoctors}
                                advers={advers}
                                products={products}
                                loading={loading}
                                changeBronDay={changeBronDay}
                            />
                        </div>
                        <TableClients
                            setVisible={setVisible}
                            modal1={modal1}
                            setModal1={setModal1}
                            setCheck={setCheck}
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            searchPhone={searchPhone}
                            setClient={setClient}
                            setConnector={setConnector}
                            searchFullname={searchFullname}
                            searchId={searchId}
                            connectors={connectors}
                            searchProbirka={searchProbirka}
                            // setModal={setModal}
                            setConnectors={setConnectors}
                            // setConnector={setConnector}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            setCountPage={setCountPage}
                            currentConnectors={currentConnectors}
                            setCurrentConnectors={setCurrentConnectors}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            loading={loading}
                            setModal2={setModal2}
                            setPostConnector={setPostConnecter}
                        />
                    </div>
                </div>
            </div>

            <CheckModal
                baseUrl={baseUrl}
                connector={check}
                modal={modal1}
                setModal={setModal1}
            />

            <Modal
                modal={modal}
                text={"ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?"}
                setModal={setModal}
                handler={client._id ? addHandler : createHandler}
                basic={client.lastname + " " + client.firstname}
            />

            <Modal2
                modal={modal2}
                text={" malumotlarni qabul qilishni tasdiqlaysizmi?"}
                setModal={setModal2}
                handler={PostToOffline}
                basic={postConnector.client && postConnector.client.fullname}
            />
        </div>
    );
};

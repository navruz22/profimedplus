import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal, Modal as Modal2, Modal as Modal3 } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import { checkClientData, checkProductsData, checkServicesData, } from "./checkData/checkData";
import { CheckModal } from "../components/ModalCheck";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import AllServices from "../components/AllServices";
import { useTranslation } from "react-i18next";
import Print from "../../laborotory/components/Print";
import AllModal from "./clientComponents/AllModal";
import { useHistory, useLocation } from "react-router-dom";
import { SmallCheck } from "../components/SmallCheck";
import { SmallCheck2 } from "../components/SmallCheck2";


export const OfflineClients = () => {
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
    const [modal3, setModal3] = useState(false);
    const [modal4, setModal4] = useState(false);
    //====================================================================
    //====================================================================

    const [servicesBody, setServicesBody] = useState([])

    //====================================================================
    //====================================================================

    const { state } = useLocation()

    const history = useHistory()

    //====================================================================
    //====================================================================

    const [isAddService, setIsAddService] = useState(false)

    //====================================================================
    //====================================================================

    const { t } = useTranslation()

    //====================================================================
    //====================================================================

    const [connectorPrint, setConnectorPrint] = useState({})
    const [clientPrint, setClientPrint] = useState({})

    //====================================================================
    //====================================================================

    const [printBody, setPrintBody] = useState(null)

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const componentRef2 = useRef()
    const handlePrint2 = useReactToPrint({
        content: () => componentRef2.current,
    })

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
    const [isActive, setIsActive] = useState(true)
    const [listType, setListType] = useState('all')
    //====================================================================
    //====================================================================
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    const [searchStorage, setSearchStrorage] = useState([]);

    const getConnectors = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/offlineclient/client/getallreseption`,
                    "POST",
                    { clinica: auth && auth.clinica?._id, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setConnectors([...data].filter(el => !el.step));
                setSearchStrorage(data);
                setCurrentConnectors([...data].filter(el => !el.step))
            } catch (error) {
                notify({
                    title: t(`${error}`),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );
    //====================================================================
    //====================================================================

    const getConnectorsByClientBorn = async (e) => {
        try {
            const data = await request(
                `/api/offlineclient/client/getallreseption`,
                "POST",
                { clinica: auth && auth.clinica?._id, clientborn: new Date(e) },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setConnectors(data);
            setSearchStrorage(data);
            setCurrentConnectors(data);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }

    //====================================================================
    //====================================================================

    const [clientId, setClientId] = useState('')

    const getClientsById = async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/getallreseption`,
                "POST",
                { clinica: auth && auth.clinica?._id, clientId },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setConnectors(data);
            setSearchStrorage(data);
            setCurrentConnectors(data);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }

    //====================================================================
    //====================================================================

    const [name, setName] = useState('')

    const getByClientName = async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/getallreseption`,
                "POST",
                { clinica: auth && auth?.clinica?._id, name },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setConnectors(data);
            setSearchStrorage(data);
            setCurrentConnectors(data);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }

    //====================================================================
    //====================================================================

    const [phone, setPhone] = useState('')

    const getByClientPhone = async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/getallreseption`,
                "POST",
                { clinica: auth && auth.clinica._id, phone },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setConnectors(data);
            setSearchStrorage(data);
            setCurrentConnectors(
                data
            );
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }


    //====================================================================
    //====================================================================
    // SEARCH
    const searchFullname = (e) => {
        const searching = searchStorage.filter((item) =>
            item.client.fullname
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );
        setName(e.target.value)
        setConnectors(searching);
        setCurrentConnectors(searching);
    }

    const searchId = (e) => {
        const searching = searchStorage.filter((item) =>
            item.client.id.toString().includes(e.target.value)
        );
        setClientId(e.target.value);
        setConnectors(searching);
        setCurrentConnectors(searching);
    }

    const searchProbirka = (e) => {
        const searching = searchStorage.filter((item) =>
            item.probirka.toString().includes(e.target.value)
        );
        setConnectors(searching);
        setCurrentConnectors(searching);
    }

    const searchPhone = (e) => {
        const searching = searchStorage.filter((item) =>
            item.client.phone.toString().includes(e.target.value)
        );
        setPhone(e.target.value)
        setConnectors(searching);
        setCurrentConnectors(searching);
    }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = (e) => {
        setCurrentPage(0);
        setCountPage(e.target.value);
        setCurrentConnectors(connectors);
    }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // DEPARTMENTS
    const [departments, setDepartments] = useState([]);

    const getDepartments = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/department/reseption`,
                "POST",
                { clinica: auth?.clinica?._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDepartments(data);
        } catch (error) {
            notify({
                title: t(`${error}`),
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
                addUser: 'Qabulxona',
                pieces: 1,
            });
        });
        setServices(s);
        setSelectedServices(services);
    };

    //====================================================================
    //====================================================================

    const [isAddConnector, setIsAddConnector] = useState(false);

    //====================================================================
    //====================================================================
    // COUNTERDOCTORS
    const [counterdoctors, setCounterDoctors] = useState([]);

    const getCounterDoctors = useCallback(async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/counter_doctors/get`,
                "POST",
                { clinica: auth?.clinica?._id, },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setCounterDoctors([...data].map(item => ({
                value: item._id,
                label: item.firstname + ' ' + item.lastname,
            })));
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [counterdoctor, setCounterDoctor] = useState(null);

    const changeCounterDoctor = (e) => {
        if (e.value === "delete") {
            setCounterDoctor(null)
        } else {
            setCounterDoctor(e.value);
        }
    };
    //====================================================================
    //====================================================================

    const [serviceTypes, setServiceTypes] = useState([])

    const getServiceTypes = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/servicetype/getall`,
                "POST",
                { clinica: auth?.clinica?._id, },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setServiceTypes(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify])

    //====================================================================
    //====================================================================
    // ADVERS
    const [advers, setAdvers] = useState([]);

    const getAdvers = useCallback(async () => {
        try {
            const data = await request(
                `/api/adver/adver/getall`,
                "POST",
                { clinica: auth.clinica?._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setAdvers(data);
        } catch (error) {
            notify({
                title: t(`${error}`),
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
                `/api/services/product/getallreseption`,
                "POST",
                { clinica: auth?.clinica?._id },
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
                title: t(`${error}`),
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
            setBaseurl(data.baseUrl);
        } catch (error) {
            notify({
                title: t(`${error}`),
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

    const [clientDate, setClientDate] = useState(new Date().toISOString().slice(0, 10))

    const [client, setClient] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
        born: new Date()
    });

    const changeClientData = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };



    const changeClientBorn = (e) => {
        setClientDate(e.target.value);
        setClient({ ...client, born: new Date(e.target.value) });
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
        setCounterDoctor(null);
        setNewProducts([]);
        setServices([]);
        setSelectedProducts([]);
        setSelectedServices([]);
        setClientDate(new Date().toISOString().slice(0, 10))
        setIsAddConnector(false);
        setStep(false)
    }, [auth]);

    const checkData = () => {
        if (checkClientData(client, t)) {
            return notify(checkClientData(client, t));
        }

        if (checkServicesData(services && services, t)) {
            return notify(checkServicesData(services, t));
        }

        if (checkProductsData(newproducts, t)) {
            return notify(checkProductsData(newproducts, t));
        }
        setModal(true);
    };
    //====================================================================
    //====================================================================

    const [checkType, setCheckType] = useState('nextsteps')

    //====================================================================
    //====================================================================
    // CreateHandler

    const createHandler = useCallback(async () => {
        setIsActive(false)
        try {
            const data = await request(
                `/api/offlineclient/client/register`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counterdoctor: counterdoctor,
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );

            notify({
                title: t("Mijoz muvaffaqqiyatli yaratildi."),
                description: "",
                status: "success",
            });
            getConnectors(beginDay, endDay);
            setModal(false);
            clearDatas();
            setVisible(false);
            showSmallCehckReturn(data)
            setTimeout(() => {
                setIsActive(true)
                // history.push({
                //     pathname: '/alo24/cashier',
                //     state: data?.client._id,
                // });
            }, 5000)

        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
            setIsActive(true)
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
        counterdoctor,
    ]);

    const updateHandler = useCallback(async () => {
        setIsActive(false)
        if (checkClientData(client)) {
            return notify(checkClientData(client));
        }
        try {
            const data = await request(
                `/api/offlineclient/client/update`,
                "PUT",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    counterdoctor: counterdoctor,
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            getConnectors(beginDay, endDay);
            notify({
                title: `${data.lastname + " " + data.firstname
                    }  ${t("ismli mijoz ma'lumotlari muvaffaqqiyatl yangilandi.")}`,
                description: "",
                status: "success",
            });
            clearDatas();
            setVisible(false);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        adver,
        counterdoctor,
        connector,
        notify,
        request,
        clearDatas,
        getConnectors,
        beginDay,
        endDay,
    ]);

    const addHandler = useCallback(async () => {
        setIsActive(false)
        try {
            const data = await request(
                `/api/offlineclient/client/add`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counterdoctor: counterdoctor,
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            history.push({
                pathname: '/alo24/cashier',
                state: data?.client._id,
            });
            localStorage.setItem("data", data);
            getConnectors(beginDay, endDay);
            notify({
                title: `${client.lastname + " " + client.firstname
                    }  ${t("ismli mijozga xizmatlar muvaffaqqiyatli qo'shildi.")}`,
                description: "",
                status: "success",
            });
            clearDatas();
            setModal(false);
            setVisible(false);
            setTimeout(() => {
                setIsActive(true)
            }, 5000)
            setIsAddService(false)
        } catch (error) {
            notify({
                title: t(`${error}`),
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
        counterdoctor,
        beginDay,
        endDay,
        notify,
        request,
        clearDatas,
        getConnectors,
    ]);

    const addConnectorHandler = async () => {
        setIsActive(false)
        try {
            const data = await request(
                `/api/offlineclient/client/connector/add`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counterdoctor: counterdoctor,
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            getConnectors(beginDay, endDay);
            clearDatas()
            setModal(false);
            setTimeout(() => {
                setIsActive(true)
            }, 5000)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }

    const showSmallCehckReturn = (connector) => {
        setCheckType('all')
        setPrintBody({ ...connector, turntitle: [...connector?.services].filter(service => service.department.probirka === false)[0]?.department?.turntitle || 'L', turn: [...connector?.services].filter(service => service.department.probirka === false)[0]?.turn || [...connector?.services].filter(service => service.department.probirka)[0]?.turn })
        setTimeout(() => {
            handlePrint()
        }, 1000)
        setTimeout(() => {
            setPrintBody(null)
        }, 2000)
    }

    //====================================================================
    //====================================================================

    const [afterClients, setAfterClients] = useState([])

    const getAfterClients = useCallback(
        async () => {
            try {
                const data = await request(
                    `/api/offlineclient/client/after_client/get`,
                    "POST",
                    { clinica: auth && auth?.clinica?._id },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setAfterClients(data);
            } catch (error) {
                notify({
                    title: t(`${error}`),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify]
    );

    const createAfterClient = useCallback(async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/after_client/register`,
                "POST",
                {
                    connector: connector,
                    clinica: auth?.clinica?._id
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: t("Mijoz muvaffaqqiyatli yaratildi."),
                description: "",
                status: "success",
            });
            const arr = [...afterClients, data];
            setAfterClients(arr)
            setOperationList('operation', arr)
            clearDatas()
            setModal4(false)
            showSmallCehck2(data)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        notify,
        connector,
    ]);

    const changeAfterClient = (data) => {
        setConnector({ ...data })
        setModal4(true)
    }

    const showSmallCehck2 = (connector) => {
        setCheckType('operation')
        setPrintBody({ ...connector })
        setTimeout(() => {
            handlePrint()
        }, 1000)
        setTimeout(() => {
            setPrintBody(null)
        }, 2000)
    }

    //====================================================================
    //====================================================================
    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getConnectors(beginDay, date);
    }

    //====================================================================
    //====================================================================

    const selectDepartment = (e) => {
        let arr = []
        if (listType === 'all') {
            if (e.target.value === 'all') {
                arr = [...searchStorage]
            } else {
                arr = [...searchStorage].filter(el => el.services.some(s => s.department._id === e.target.value))
            }
            setAllList('all', arr)
        } else {
            if (e.target.value === 'all') {
                arr = [...searchStorage]
            } else {
                arr = [...searchStorage].filter(el => el.services.some(s => s.department._id === e.target.value))
            }
            setNextsList('nextsteps', arr)
        }
    }

    //====================================================================
    //====================================================================
    // useEffect

    const [s, setS] = useState(0);

    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
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
        s,
        getProducts,
        getCounterDoctors,
        getDepartments,
        getBaseUrl,
        beginDay,
        endDay,
    ]);


    useEffect(() => {
        if (state?.onlineclient) {
            let onlineclient = state?.onlineclient
            setClient({
                clinica: auth.clinica && auth.clinica._id,
                reseption: auth.user && auth.user._id,
                firstname: onlineclient.firstname,
                lastname: onlineclient.lastname,
                phone: onlineclient.phone
            })
            setVisible(true)
        }
    }, [state?.onlineclient])

    useEffect(() => {
        getAfterClients()
    }, [])

    //====================================================================
    //====================================================================

    const setAllList = (listtype, arr = []) => {
        setListType(listtype)
        setConnectors([...arr].filter(el => !el.step))
        setCurrentConnectors([...arr].filter(el => !el.step))
    }

    const setNextsList = (listtype, arr = []) => {
        setListType(listtype)
        setConnectors([...arr].filter(item => item.step).sort((a, b) => new Date(a.stepDate) - new Date(b.stepDate)))
        setCurrentConnectors([...arr].filter(item => item.step).sort((a, b) => new Date(a.stepDate) - new Date(b.stepDate)))
    }

    const setOperationList = (listtype, arr = []) => {
        setListType(listtype)
        setConnectors([...arr])
        setCurrentConnectors([...arr])
    }

    const changeListType = (listtype) => {
        if (listtype === 'nextsteps') {
            setNextsList(listtype, [...searchStorage])
        }
        if (listtype === 'all') {
            setAllList(listtype, [...searchStorage])
        }
        if (listtype === 'operation') {
            setOperationList(listtype, [...afterClients])
        }
    }

    //====================================================================
    //====================================================================

    const [step, setStep] = useState(false)

    const changeStep = (connector) => {
        if (!connector.step) {
            setStep(true)
            setConnector(connector)
            setModal3(true)
        }
    }

    const showSmallCehck = (connector) => {
        setCheckType('nextsteps')
        const depart = [...connector.services].filter(el => el.department.probirka === false)[0]?.department?._id
        const data = [...searchStorage].filter(el => el.services.some(el => el.department._id === depart)).filter(item => item.step).sort((a, b) => new Date(a.stepDate) - new Date(b.stepDate))
        const index = [...data].reduce((prev, el, ind) => {
            if (connector._id === el._id) {
                prev = ind
            }
            return prev;
        }, 0)
        setPrintBody({ ...connector, turn: index + 1 })
        setTimeout(() => {
            handlePrint()
        }, 1000)
        setTimeout(() => {
            setPrintBody(null)
        }, 2000)
    }

    const handleNextStep = useCallback(async () => {
        // setIsActive(false)
        try {
            const data = await request(
                `/api/offlineclient/client/next_step`,
                "POST",
                {
                    connectorId: connector._id,
                    step,
                    stepDate: new Date()
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: t("Mijoz muvaffaqqiyatli yaratildi."),
                description: "",
                status: "success",
            });
            const arr = [...searchStorage].map(el => {
                if (el._id === connector._id) {
                    el.step = true;
                    el.stepDate = new Date()
                }
                return el
            })
            setNextsList('nextsteps', arr)
            setModal3(false);
            clearDatas();
            setVisible(false);
            showSmallCehck(data)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
            setIsActive(true)
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
        counterdoctor,
    ]);

    const handleAccessNext = async (id, value) => {
        try {
            const data = await request(
                `/api/offlineclient/client/next_step/access`,
                "POST",
                {
                    connectorId: id,
                    access: value,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            const arr = [...searchStorage].map(el => {
                if (el._id === data._id) {
                    el.stepAccess = data.stepAccess
                }
                return el
            })
            if (listType === 'nextsteps') {
                setNextsList('nextsteps', arr)
            } else {
                setAllList('all', arr)
            }
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }

    //====================================================================
    //====================================================================
    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="row justify-content-between">
                            <div className="col-3 text-end">
                                <button
                                    className={`btn bg-green-500 text-white mb-2 w-100 ${visible ? "d-none" : ""
                                        }`}
                                    onClick={changeVisible}
                                >
                                    {t("Registratsiya")}
                                </button>
                                <button
                                    className={`btn bg-green-500 text-white mb-2 w-100 ${visible ? "" : "d-none"
                                        }`}
                                    onClick={changeVisible}
                                >
                                    {t("Registratsiya")}
                                </button>
                            </div>
                            <div className="col-6 text-end flex justify-between gap-4">
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100`}
                                    onClick={() => changeListType('all')}
                                >
                                    {t("DASTLABKI KO'RIK")}
                                </button>
                                <button
                                    className={`btn bg-green-400 text-white mb-2 w-100`}
                                    onClick={() => changeListType('nextsteps')}
                                >
                                    {t("KO")}
                                </button>
                                <button
                                    className={`btn bg-orange-500 text-white mb-2 w-100`}
                                    onClick={() => changeListType('operation')}
                                >
                                    {t("ПО")}
                                </button>
                            </div>
                        </div>
                        <div className={` ${visible ? "" : "d-none"}`}>
                            <RegisterClient
                                isAddService={isAddService}
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
                                changeCounterDoctor={changeCounterDoctor}
                                client={client}
                                setClient={setClient}
                                changeClientData={changeClientData}
                                changeClientBorn={changeClientBorn}
                                departments={departments}
                                counterdoctors={counterdoctors}
                                advers={advers}
                                products={products}
                                loading={loading}
                                clientDate={clientDate}
                                setClientDate={setClientDate}
                                setIsAddConnector={setIsAddConnector}
                                servicetypes={serviceTypes}
                                listType={listType}
                                connector={connector}
                                setConnector={setConnector}
                            />
                        </div>
                        <TableClients
                            setIsAddService={setIsAddService}
                            setVisible={setVisible}
                            modal1={modal1}
                            setModal1={setModal1}
                            setCheck={setCheck}
                            getConnectorsByClientBorn={getConnectorsByClientBorn}
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
                            // setModal2={setModal2}
                            loading={loading}
                            setClientDate={setClientDate}
                            setIsAddConnector={setIsAddConnector}
                            getClientsById={getClientsById}
                            getByClientName={getByClientName}
                            getByClientPhone={getByClientPhone}
                            setPrintBody={setPrintBody}
                            handlePrint={handlePrint}
                            allModalHandle={(services, connector, client) => {
                                setServicesBody(services)
                                setConnectorPrint(connector)
                                setClientPrint(client)
                                setTimeout(() => {
                                    setModal2(true)
                                }, 1000)
                            }}
                            changeStep={changeStep}
                            listType={listType}
                            showSmallCehck={showSmallCehck}
                            changeAfterClient={changeAfterClient}
                            showSmallCehck2={showSmallCehck2}
                            showSmallCehckReturn={showSmallCehckReturn}
                            handleAccessNext={handleAccessNext}
                            departments={departments}
                            selectDepartment={selectDepartment}
                        />
                    </div>
                </div>
            </div>

            <CheckModal
                clinica={auth && auth.clinica}
                baseUrl={baseUrl}
                connector={check}
                modal={modal1}
                setModal={setModal1}
            />

            <div className="d-none">
                <div className="w-[10.4cm] p-2 bg-white text-center" ref={componentRef}>
                    {
                        printBody && checkType === 'nextsteps' ? <SmallCheck
                            baseUrl={baseUrl}
                            clinica={auth?.clinica}
                            connector={printBody}
                            client={printBody?.client}
                            sections={printBody?.services}
                            turn={printBody?.turn}
                            turntitle={'KO'}
                        /> : printBody && checkType === 'all' ?
                            <SmallCheck
                                baseUrl={baseUrl}
                                clinica={auth?.clinica}
                                connector={printBody}
                                client={printBody?.client}
                                sections={printBody?.services}
                                turn={printBody?.turn}
                                turntitle={printBody?.turntitle}
                            />
                            : printBody && checkType === 'operation' && <SmallCheck2
                                baseUrl={baseUrl}
                                clinica={auth?.clinica}
                                client={printBody}
                                turn={printBody?.turn}
                            />
                    }
                </div>
            </div>


            <Modal
                modal={modal}
                text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
                setModal={setModal}
                handler={client._id && !isAddConnector ? isActive && addHandler : client._id && isAddConnector ? isActive && addConnectorHandler : isActive && createHandler}
                basic={client.lastname + " " + client.firstname}
            />
            <Modal2
                modal={modal3}
                text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
                setModal={() => {
                    setModal3(false)
                    setStep(false)
                    clearDatas()
                }}
                handler={handleNextStep}
            />
            <Modal2
                modal={modal4}
                text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
                setModal={() => {
                    setModal4(false)
                    clearDatas()
                }}
                handler={createAfterClient}
            />
            <AllModal
                modal={modal2}
                services={servicesBody}
                setModal={setModal2}
                handler={handlePrint}
                client={clientPrint}
                connector={connectorPrint}
                clinica={auth?.clinica}
                doctor={auth?.user}
                baseUrl={baseUrl}
            />
        </div>
    );
};

import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import AdoptionTemplate from "../components/AdoptionTemplate";
import Print from "../components/Print";
import { TableClients } from "./clientComponents/TableClients";
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { checkClientData, checkProductsData, checkServicesData } from "../../reseption/offlineclients/checkData/checkData";
import { Modal } from "../../reseption/components/Modal";
import { useTranslation } from "react-i18next";
import { OfflineClients } from "../OfflineClients";

const animatedComponents = makeAnimated()

export const DoctorClients = () => {
  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setUTCHours(0, 0, 0, 0))
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  //====================================================================
  //====================================================================
  const { t } = useTranslation()

  //====================================================================
  //====================================================================


  //====================================================================
  //====================================================================
  // RegisterPage
  const [visible, setVisible] = useState(false);


  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [countPage, setCountPage] = useState(10);

  const indexLastConnector = (currentPage + 1) * countPage;
  const indexFirstConnector = indexLastConnector - countPage;

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

  const [listType, setListType] = useState('all')

  const changeListType = (listtype) => {
    if (listtype === 'nextsteps') {
      setListType(listtype)
      setDoctorClients([...searchStorage].filter(item => item.connector.step).sort((a, b) => new Date(a.connector.stepDate) - new Date(b.connector.stepDate)))
      setCurrentDoctorClients([...searchStorage].filter(item => item.connector.step).sort((a, b) => new Date(a.connector.stepDate) - new Date(b.connector.stepDate)))
    }
    if (listtype === 'all') {
      setListType(listtype)
      setDoctorClients([...searchStorage].filter(el => !el.connector.step).filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1))
      setCurrentDoctorClients([...searchStorage].filter(el => !el.connector.step).filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1))
    }
    if (listtype === 'operation') {
      setListType(listtype)
      setDoctorClients([...afterClients])
      setCurrentDoctorClients([...afterClients])
    }
  }

  //====================================================================
  //====================================================================

  const [clientsType, setClientsType] = useState('offline')

  //====================================================================
  //====================================================================
  // getConnectors
  const [doctorClients, setDoctorClients] = useState([]);
  const [searchStorage, setSearchStorage] = useState([]);
  const [currentDoctorClients, setCurrentDoctorClients] = useState([]);

  const getDoctorClients = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/doctor/clients/getclients`,
          "POST",
          {
            clinica: auth && auth.clinica._id,
            beginDay,
            endDay,
            department: auth?.user?.specialty?._id,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        let data2 = [...data].filter(connector => connector.services
          .filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1)
          .sort((a, b) =>
            a.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn -
            b.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn)
        setSearchStorage(data)
        if (listType === 'nextsteps') {
          setDoctorClients([...data].filter(item => item.connector.step).sort((a, b) => new Date(a.connector.stepDate) - new Date(b.connector.stepDate)))
          setCurrentDoctorClients([...data].filter(item => item.connector.step).sort((a, b) => new Date(a.connector.stepDate) - new Date(b.connector.stepDate)))
        }
        if (listType === 'all') {
          setDoctorClients([...data2].filter(el => !el.connector.step))
          setCurrentDoctorClients([...data2].filter(el => !el.connector.step))
        }
      } catch (error) {
        notify({
          title: t(error),
          description: "",
          status: "error",
        });
      }
    },
    [request, auth, notify, listType]
  );

  const getStatsionarClients = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/doctor/clients/statsionarclients/get`,
          "POST",
          {
            clinica: auth && auth.clinica._id,
            beginDay,
            endDay,
            department: auth?.user?.specialty._id,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        // setDoctorClients([...data].filter(item => item.connector.room.endday === null));
        // setSearchStorage([...data].filter(item => item.connector.room.endday === null));
        // setCurrentDoctorClients(
        //   [...data].filter(item => item.connector.room.endday === null).slice(indexFirstConnector, indexLastConnector)
        // );
        setDoctorClients([...data].filter(connector => connector.services.filter(service => !service.department.probirka && service.accept).length < 1));
        setSearchStorage(data);
        setCurrentDoctorClients(
          [...data].filter(connector => connector.services.filter(service => !service.department.probirka && service.accept).length < 1)
        );
      } catch (error) {
        notify({
          title: t(error),
          description: "",
          status: "error",
        });
      }
    },
    [request, auth, notify, indexFirstConnector, indexLastConnector]
  );

  //===================================================================
  //===================================================================

  //===================================================================
  //===================================================================
  //Get by born date

  const getDoctorClientsByBorn = async (e) => {
    try {
      const data = await request(
        `/api/doctor/clients/getclients`,
        "POST",
        {
          clientborn: new Date(new Date(e)),
          department: auth?.user?.specialty,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(data);
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }


  const getStatsionarClientsByBorn = async (e) => {
    try {
      const data = await request(
        `/api/doctor/clients/statsionarclients/get`,
        "POST",
        {
          clientborn: new Date(new Date(e)),
          department: auth?.user?.specialty,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(data);
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }

  const getClientsByBorn = (e) => {
    if (clientsType === 'offline') {
      getDoctorClientsByBorn(e)
    } else {
      getStatsionarClientsByBorn(e)
    }
  }

  //===================================================================
  //===================================================================

  const getDoctorClientsByName = async () => {
    try {
      const data = await request(
        `/api/doctor/clients/getclients`,
        "POST",
        {
          name: fullname,
          department: auth?.user?.specialty?._id,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(data);
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }

  const getStatsionarClientsName = async (e) => {
    try {
      const data = await request(
        `/api/doctor/clients/statsionarclients/get`,
        "POST",
        {
          name: fullname,
          department: auth?.user?.specialty?._id,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(data);
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }

  const getClientsByName = () => {
    if (clientsType === 'offline') {
      getDoctorClientsByName()
    } else {
      getStatsionarClientsName()
    }
  }

  //===================================================================
  //===================================================================

  const getDoctorClientsById = async () => {
    try {
      const data = await request(
        `/api/doctor/clients/getclients`,
        "POST",
        {
          clientId: clientId,
          department: auth?.user?.specialty?._id,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(data);
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }

  const getStatsionarClientsId = async (e) => {
    try {
      const data = await request(
        `/api/doctor/clients/statsionarclients/get`,
        "POST",
        {
          clientId: clientId,
          department: auth?.user?.specialty?._id,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(data);
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }

  const getClientsById = () => {
    if (clientsType === 'offline') {
      getDoctorClientsById()
    } else {
      getStatsionarClientsId()
    }
  }

  //===================================================================
  //===================================================================
  
  //===================================================================
  //===================================================================

  const [modal, setModal] = useState(false);



  //===================================================================
  //===================================================================


  //===================================================================
  //===================================================================
  // Searching

  const [fullname, setFullname] = useState('')
  const [clientId, setClientId] = useState('')

  const searchFullname =
    (e) => {
      const searching = [...searchStorage].filter((item) => {
        return (item.client.firstname + item.client.lastname)
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      });
      setDoctorClients(searching);
      setCurrentDoctorClients(searching);
      setFullname(e.target.value)
    }

  const searchId =
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.id.toString().includes(e.target.value)
      );
      setDoctorClients(searching);
      setCurrentDoctorClients(searching);
      setClientId(e.target.value)
    }

  //===================================================================
  //===================================================================

  const setPageSize =
    (e) => {
      setCurrentPage(0);
      setCountPage(e.target.value);
      setCurrentDoctorClients(searchStorage.slice(0, e.target.value));
    }

  //====================================================================
  //====================================================================
  // ChangeDate

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    if (clientsType === 'offline') {
      getDoctorClients(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay)
    } else {
      getStatsionarClients(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay)
    }
  };

  const changeEnd = (e) => {
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

    setEndDay(date);
    if (clientsType === 'offline') {
      getDoctorClients(beginDay, date)
    } else {
      getStatsionarClients(beginDay, date)
    }
  };

  //====================================================================
  //====================================================================

  const [baseUrl, setBaseurl] = useState();

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request(`/api/baseurl`, "GET", null);
      setBaseurl(data.baseUrl);
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }, [request, notify]);

  //====================================================================
  //====================================================================
 

  //====================================================================
  //====================================================================
  // useEffect

  const [s, setS] = useState(0);

  useEffect(() => {
    if (auth.clinica && !s) {
      setS(1);
      getDoctorClients(beginDay, endDay);
      getBaseUrl()
    }
  }, [auth, beginDay, s, endDay, getDoctorClients,]);


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

  //=====================================================================
  //=====================================================================

  

  //=================================================================
  //=================================================================

  const saveService = async (sections, id) => {
    try {
      const data = await request(
        `/api/doctor/clients/adopt`,
        "POST",
        {
          services: sections,
          connector: id
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: t(data.message),
        description: "",
        status: "success",
      });
      getDoctorClients(beginDay, endDay)
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }

  //=================================================================
  //=================================================================
  

  const changeClientsType = (e) => {
    if (e.target.value === 'offline') {
      getDoctorClients(beginDay, endDay)
    }
    if (e.target.value === 'statsionar') {
      getStatsionarClients(beginDay, endDay)
    }
    setClientsType(e.target.value)
  }

  //=====================================================================
  //=====================================================================

  const [acceptType, setAcceptType] = useState('not')

  const changeAccept = (e) => {

    let searching = []

    if (e.target.value === 'accept') {
      searching = [...searchStorage].filter(el => !el.connector.step).filter(connector => [...connector.services].some(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept))
    }
    if (e.target.value === 'not') {
      searching = [...searchStorage].filter(el => !el.connector.step).filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1)
    }
    if (e.target.value === 'all') {
      searching = [...searchStorage].filter(el => !el.connector.step)
    }
    setAcceptType(e.target.value)
    setDoctorClients(searching);
    setCurrentDoctorClients(searching);
  }

  //=====================================================================
  //=====================================================================

  const sortData = (isSort, setIsSort) => {
    if (!isSort) {
      setDoctorClients([...searchStorage].filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1).sort((a, b) => a.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn - b.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn));
      setCurrentDoctorClients(
        [...searchStorage].filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1).sort((a, b) => a.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn - b.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn)
      );
    } else {
      setDoctorClients([...searchStorage].filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1).sort((a, b) => b.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn - a.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn));
      setCurrentDoctorClients(
        [...searchStorage].filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1).sort((a, b) => b.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn - a.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn)
      );
    }
    setIsSort(!isSort)
  }

  //=====================================================================
  //=====================================================================

  const [afterClients, setAfterClients] = useState([])

  const getAfterClients = useCallback(
    async () => {
      try {
        const data = await request(
          `/api/offlineclient/client/after_client/get`,
          "POST",
          { clinica: auth && auth.clinica._id },
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

  useEffect(() => {
    getAfterClients()
  }, [])

  //=====================================================================
  //=====================================================================

  //=====================================================================
  //=====================================================================

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="container p-4"
          style={{ fontFamily: "times" }}
        >
          <Print
            doctor={auth.user}
            connector={printBody.connector}
            client={printBody.client}
            sections={printBody.services}
            clinica={auth && auth.clinica}
            baseUrl={baseUrl}
          />
        </div>
      </div>
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="row justify-content-end">
              {!auth?.user?.isOne && <div className="col-6 flex text-center justify-end gap-4">
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
                {/* <button
                  className={`btn bg-orange-500 text-white mb-2 w-100`}
                  onClick={() => changeListType('operation')}
                >
                  {t("ПО")}
                </button> */}
              </div>}
            </div>
            <TableClients
              sortData={sortData}
              changeAccept={changeAccept}
              getClientsByName={getClientsByName}
              changeStart={changeStart}
              changeEnd={changeEnd}
              searchId={searchId}
              searchFullname={searchFullname}
              doctorClients={doctorClients}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              currentDoctorClients={currentDoctorClients}
              setCurrentDoctorClients={setCurrentDoctorClients}
              currentPage={currentPage}
              setPageSize={setPageSize}
              loading={loading}
              handlePrint={handlePrint}
              clientsType={clientsType}
              acceptType={acceptType}
              changeClientsType={changeClientsType}
              getClientsByBorn={getClientsByBorn}
              user={auth?.user}
              getClientsById={getClientsById}
              saveService={saveService}
              listType={listType}
            />
          </div>
        </div>
      </div>
    </>
  );
};

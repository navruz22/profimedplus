import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Select from "react-select";

export const Conclusion = () => {

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

  const [serviceTypes, setServiceTypes] = useState([]);
  const [servicesColumn, setServicesColumn] = useState([])
  const getServiceTypes = useCallback(
    async () => {
      try {
        const data = await request(
          `/api/labaratory/servicetype/get`,
          "POST",
          {
            clinica: auth && auth.clinica._id,
            department: auth?.user?.specialty,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setServiceTypes([...data].map((el => ({
          value: el._id,
          label: el.name,
          services: el.services
        }))))
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

  // ====================================================================
  // ====================================================================

  const [serviceClients, setServiceClietns] = useState([])

  const getClientsServices =
    async (servicetype, colservices) => {
      try {
        const data = await request(
          `/api/labaratory/clients/result`,
          "POST",
          {
            clinica: auth && auth.clinica._id,
            servicetype
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        sortData(data, colservices);
      } catch (error) {
        notify({
          title: error,
          description: "",
          status: "error",
        });
      }
    }


  const sortData = (currentData, colservices) => {
    const data = []

    if (currentData.length > 0) {
      for (const client of currentData) {
        let services = []
        for (const column of colservices) {
          let currentService = [...client.services].filter(service => service.service._id === column._id)

          if (currentService.length > 0) {
            services.push(...currentService)
          } else {
            services.push({
              tables: [],
              service: []
            })
          }
        }
        data.push({ ...client, services })
      }
    }
    setServiceClietns(data);
  }

  const handleChangeServiceType = (e) => {
    setServicesColumn(e.services)
    getClientsServices(e.value, e.services)
  }

  const handleChangeServiceClient = (e, index, serviceid) => {
    const current = [...serviceClients].map((client, ind) => {
      if (ind === index) {
        const newServices = client.services.map((service) => {
          if (service._id === serviceid) {
            service.tables = [...service.tables].map((table) => ({ ...table, col2: e.target.value }))
            if (e.target.value.length > 0) {
              service.accept = true;
            } else {
              service.accept = false;
            }
          }
          return service;
        })
        client.services = newServices
      }
      return client;
    })
    setServiceClietns(current)
  }

  const isExistColumn = (serviceid) => {
    return servicesColumn.some(el => el._id === serviceid)
  }

  // ======================================
  // ======================================

  const handleConclusion = async () => {
    const send = serviceClients.reduce((prev, el) => {
      console.log(el.services);
      let service = el.services.filter(item => item.tables.length > 0)
      prev.push(...service);
      return prev;
    }, [])
    console.log(send);
    try {
      const data = await request(
        `/api/labaratory/conclusion/save`,
        "POST",
        {
          services: send
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: data.message,
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
  }

  // ======================================
  // ======================================

  const addTrow = (servicelength) => {

    if ((servicesColumn.length - servicelength) > 0) {
      let ind = 0;
      while (ind < (servicesColumn.length - servicelength)) {
        ind += 1;
        return <td className="border py-1 text-right text-[16px]"></td>
      }
    }
  }

  const isDone = (services) => {
    const done = services.filter(service => service.tables.length > 0)
      .filter(service => !service.tables[0].col2)
    if (done.length > 0) {
      return 'bg-red-600'
    } else {
      return ""
    }
  }

  // ======================================
  // ======================================

  useEffect(() => {
    getServiceTypes()
  }, [getServiceTypes])

  console.log(serviceClients);

  return <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
    <div className="flex justify-end mb-2">
      <div className="w-[300px]">
        <Select
          options={serviceTypes}
          onChange={e => handleChangeServiceType(e)}
        />
      </div>
    </div>
    <div className="row gutters">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="shadow-lg border-alotrade table-container">
          <div className="table-responsive">
            <table className="table m-0" id="discount-table">
              <thead>
                <tr>
                  <th className="border bg-alotrade py-1 text-[14px]">№</th>
                  <th className="border bg-alotrade py-1 text-[14px]">
                    Probirka
                  </th>
                  <th className="border bg-alotrade py-1 text-[14px]">
                    F.I.O
                  </th>
                  <th className="border bg-alotrade py-1 text-[14px]">
                    Tugilgan yili
                  </th>
                  {servicesColumn.length > 0 && servicesColumn.map((col, ind) =>
                    <th className="border bg-alotrade py-1 text-[14px]" key={ind}>
                      {col.shortname}
                    </th>)}
                </tr>
              </thead>
              <tbody>
                {serviceClients.map((service, ind) => (
                  <tr key={ind}>
                    <td
                      className={`${isDone(service.services)} border py-1 font-weight-bold text-right text-[16px]`}
                      style={{ maxWidth: "30px !important" }}
                    >
                      {ind + 1}
                    </td>
                    <td
                      className="border py-1 font-weight-bold text-right text-[18px]"
                    >
                      {service.connector.probirka}
                    </td>
                    <td className="border py-1 font-weight-bold text-[16px]">
                      {service.client.firstname} {service.client.lastname}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {new Date(service.client.born).toLocaleDateString()}
                    </td>
                    {service.services.map((s, index) => <td key={index} className="border py-1 font-weight-bold text-[16px]">
                      {isExistColumn(s.service._id) ? s.tables && s.tables.length > 0 && <div>
                        <input className="outline-none border-[1px] border-black px-2 " value={s?.tables[0]?.col2} onChange={e => handleChangeServiceClient(e, ind, s._id)} />
                      </div> : ""}
                    </td>
                    )}
                    {addTrow(service.services.length)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-center">
      <button className="rounded-lg font-semibold text-white px-4 py-2 bg-alotrade" onClick={() => handleConclusion()}>
        Saqlash
      </button>
    </div>
  </div>
};

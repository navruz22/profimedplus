import { useToast } from "@chakra-ui/react";
import {
  faSave,
  faTrash,
  faTrashAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Print from "./Print";
import { useReactToPrint } from 'react-to-print'
import TextEditor from "./TextEditor";
import LabPrint from "../../laborotory/components/Print"

const DoctorTemplate = ({ client, connector, services }) => {

  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);

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

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState();

  const [baseUrl, setBaseUrl] = useState()

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request('/api/baseurl', 'GET', null)
      setBaseUrl(data.baseUrl)
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [request, notify])

  const getTemplates = useCallback(async () => {
    try {
      const data = await request(
        `/api/doctor/template/getall`,
        "POST",
        {
          clinica: auth && auth.clinica._id,
          doctor: auth && auth.user._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setTemplates(
        data.map((el) => ({
          template: el.template,
          label: el.name,
          value: el.name,
        }))
      );
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, auth, notify]);

  const uploadFile = async (e, serviceid) => {
    const files = e.target.files[0]
    const data = new FormData()
    data.append('file', files)
    const res = await fetch('/api/upload', { method: 'POST', body: data })
    const file = await res.json()
    setSections([...sections].map(section => {
      if (section._id === serviceid) {
        section.files.push(`${baseUrl}/api/upload/file/${file.filename}`)
      }
      return section;
    }))
    notify({
      status: 'success',
      description: '',
      title: 'Surat muvaffaqqiyatli yuklandi',
    })

  }

  const saveService = async () => {
    try {
      const data = await request(
        `/api/doctor/clients/adopt`,
        "POST",
        {
          services: sections,
          connector: connector._id
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

  const deleteFile = (file, serviceid) => {
    setSections([...sections].map(section => {
      if (section._id === serviceid) {
        const filterFile = [...section.files].filter(el => el !== file)
        section.files = filterFile;
      }
      return section;
    }))
  }


  const handleAddTemplate = (template, serviceid) => {
    const newSections = sections.map((section) => {
      if (section.service._id === serviceid) {
        section.templates.push({
          template: template.template,
          name: template.label,
        });
      }
      return section;
    });
    setSections(newSections);
  };

  const handleChangeTemplate = (e, index, serviceid) => {
    const newSections = [...sections].map((section) => {
      if (section._id === serviceid) {
        const newTemplates = section.templates.map((template, ind) => {
          if (ind === index) {
            template.template = e;
          }
          return template;
        });
        section.templates = newTemplates;
      }
      return section;
    });
    setSections(newSections);
  };

  const handleDeleteTemplate = (index, serviceid) => {
    const newSections = [...sections].map((section) => {
      if (section._id === serviceid) {
        const newTemplates = section.templates.filter((_, ind) => ind !== index);
        section.templates = newTemplates;
      }
      return section;
    });
    setSections(newSections);
  }

  useEffect(() => {
    setSections(services);
  }, [services]);

  const [t, setT] = useState()
  useEffect(() => {
    // if (!t) {
    getTemplates();
    getBaseUrl()
    // }
  }, [getTemplates, getBaseUrl]);

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="p-[2cm]"
          style={{ fontFamily: "times" }}
        >
          <Print
            doctor={auth.user}
            connector={connector}
            client={client}
            sections={sections}
            clinica={auth && auth.clinica}
            baseUrl={baseUrl}
          />
        </div>
      </div>
      <div className="container p-4 bg-white" style={{ fontFamily: "times" }}>
        <div className="px-4">
          {/* <div className="row" style={{ fontSize: "10pt" }}>
            <div
              className="col-4"
              style={{ border: "1px solid", textAlign: "center" }}
            >
              <p className="pt-2">
                O'zbekiston Respublikasi Sog'liqni Saqlash Vazirligi
              </p>
            </div>
            <div
              className="col-4"
              style={{
                border: "1px solid",
                textAlign: "center",
                borderLeft: "none",
              }}
            >
              <p className="pt-2">IFUD: 86900</p>
            </div>
            <div
              className="col-4"
              style={{
                border: "1px solid",
                textAlign: "center",
                borderLeft: "none",
              }}
            >
              <p style={{ margin: "0" }}>
                O'zbekiston Respublikasi SSV 31.12.2020y dagi №363 buyrug'i
                bilan tasdiqlangan
              </p>
            </div>
          </div> */}
          <div className="row" style={{ fontSize: "20pt" }}>
            <div className="col-6 pt-2" style={{ textAlign: "center" }}>
              <p className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                {auth?.clinica?.name}
              </p>
            </div>
            <div className="col-6" style={{ textAlign: "center" }}>
              <p className="text-end m-0">
                {/* <img width="120" src={qr && qr} alt="QR" /> */}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-12" style={{ padding: "0" }}>
              <table
                style={{
                  width: "100%",
                  border: "2px solid",
                  borderTop: "3px solid",
                }}
              >
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Mijozning F.I.SH
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    <h4>
                      {client && client.lastname + " " + client.firstname}
                    </h4>
                  </td>
                  <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                    <p className="fw-bold fs-5 m-0">
                      TAHLIL <br /> NATIJALARI
                    </p>
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Tug'ilgan yili
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && new Date(client.born).toLocaleDateString()}
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Kelgan sanasi
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {connector &&
                      new Date(connector.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="p-0 fw-bold"
                    style={{
                      width: "100px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Namuna
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "100px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {connector && connector.probirka}
                  </td>
                </tr>

                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Manzil
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && client.address}
                  </td>
                  <td
                    className="p-0 fw-bold"
                    style={{
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    ID
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && client.id}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          {/* <div className="row mt-3" style={{ backgroundColor: "#C0C0C0" }}>
            <div className="col-4">
              <p className="px-2 m-0">"GEMO-TEST" х/к</p>
            </div>
            <div className="col-8">
              <p className="px-2 m-0 text-end pr-5">
                Xizmatlar litsenziyalangan. LITSENZIYA №21830906 03.09.2020. SSV
                RU
              </p>
            </div> 
          </div> */}
        </div>
        <div className="row pt-4 w-full">
          {sections.length > 0 &&
            sections.map((section, index) => (
              <div key={index} className={"w-full"}>
                <div className="w-full flex items-center mb-4">
                  <div className="w-[200px] mr-[20rem]">
                    <Select
                      options={templates}
                      onChange={(e) =>
                        handleAddTemplate(e, section.service._id)
                      }
                    />
                  </div>
                  <h2 className="block text-[18px] font-bold">
                    {section?.service?.name}
                  </h2>
                </div>
                {section.templates.length > 0 &&
                  section.templates.map((template, index) => (
                    <div
                      key={index}
                      className="p-[10px] w-full border border-black"
                    >
                      <div className="flex justify-between items-center py-2 px-4">
                        <div className="text-[18px] font-bold">
                          {template?.name}
                        </div>
                        <div className="flex justify-between items-center">
                          <FontAwesomeIcon
                            onClick={() => handleDeleteTemplate(index, section._id)}
                            icon={faTrash}
                            style={{ cursor: "pointer", fontSize: '18px', color: 'red' }}
                          />
                        </div>
                      </div>
                      <div className="">
                        <TextEditor value={template?.template} onChange={(data) => handleChangeTemplate(data, index, section._id)} />
                      </div>
                    </div>
                  ))}
                <div>
                  <div
                    className='mt-4 mb-2'
                  >
                    <input
                      onChange={(e) => uploadFile(e, section._id)}
                      type="file"
                      className=''
                    />
                  </div>
                  <div className="">
                    {section.files.map((file) => <div className="w-[400px]">
                      <img src={file} alt='file' />
                      <div className="px-4 pt-2">
                        <button className="" onClick={() => deleteFile(file, section._id)} >
                          <FontAwesomeIcon fontSize={16} icon={faTrash} />
                        </button>
                      </div>
                    </div>)}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="row">
          <div className="col-12 text-center my-4">
            <button className="btn btn-success px-4 mx-4" onClick={() => saveService()} > Tasdiqlash</button>
            <button className="btn btn-info px-5" onClick={handlePrint} >Chop etish</button>
          </div>
        </div>
      </div>
    </>
  );
};

const LabTemplate = ({ client, connector, services }) => {
  // const clientId = useParams().clientid
  // const connectorId = useParams().connectorid
  console.log(services);
  const { request } = useHttp();
  const auth = useContext(AuthContext);

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

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  // const [client, setClient] = useState();
  // const [connector, setConnector] = useState();
  const [sections, setSections] = useState([]);

  const [baseUrl, setBaseUrl] = useState()

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request('/api/baseurl', 'GET', null)
      setBaseUrl(data.baseUrl)
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [request, notify])

  // const [tablesSelect, setTablesSelect] = useState([])

  // const getServices = useCallback(async () => {
  //   try {
  //     const data = await request(
  //       `/api/doctor/table/services`,
  //       'POST',
  //       { clinica: auth.clinica._id, doctor: auth.user },
  //       {
  //         Authorization: `Bearer ${auth.token}`,
  //       },
  //     )
  //     setTablesSelect([...data].map(service => {
  //       return {
  //         label: service.name,
  //         value: service._id,
  //         column: service.column,
  //         tables: service.tables,
  //       }
  //     }))
  //   } catch (error) {
  //     notify({
  //       title: error,
  //       description: '',
  //       status: 'error',
  //     })
  //   }
  // }, [
  //   request,
  //   auth,
  //   notify
  // ])

  const uploadFile = async (e, serviceid) => {
    const files = e.target.files[0]
    const data = new FormData()
    data.append('file', files)
    const res = await fetch('/api/upload', { method: 'POST', body: data })
    const file = await res.json()
    setSections([...sections].map(section => {
      const ser = section.services.map((s) => {
        if (s._id === serviceid) {
          s.files.push(`${baseUrl}/api/upload/file/${file.filename}`)
        }
        return s;
      })
      section.services = ser;
      return section;
    }))
    notify({
      status: 'success',
      description: '',
      title: 'Surat muvaffaqqiyatli yuklandi',
    })

  }

  const saveService = async () => {
    const sendData = [...sections].reduce((prev, section) => {
      prev.push(...section.services)
      return prev;
    }, [])
    try {
      const data = await request(
        `/api/labaratory/adopt`,
        "POST",
        {
          services: sendData
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

  const deleteFile = (file, serviceid) => {
    setSections([...sections].map(section => {
      if (section._id === serviceid) {
        const filterFile = [...section.files].filter(el => el !== file)
        section.files = filterFile;
      }
      return section;
    }))
  }

  const handleCheckAllAccept = (ind) => {
    const filtered = sections.map((section, index) => {
      if (index === ind) {
        let newServices = [];
        const isAllTrue = section.services.filter(s => s.accept).length === section.services.length;
        if (isAllTrue) {
          newServices = section.services.map(service => ({ ...service, accept: false }))
        } else {
          newServices = section.services.map(service => ({ ...service, accept: true }))
        }
        section.services = newServices;
      }
      return section;
    })
    setSections(filtered);
  }
  const handleCheckAccept = (ind, serviceid) => {
    const filtered = sections.map((section, index) => {
      if (index === ind) {
        let newServices = section.services.map((service) => {
          if (service._id === serviceid) {
            service.accept = !service.accept
          }
          return service;
        })
        section.services = newServices
      }
      return section;
    })
    setSections(filtered)
  }

  const handleChangeTables = (e, sectionind, serviceid, tableind, prop) => {
    const newSections = [...sections].map((section, index) => {
      if (index === sectionind) {
        const newServices = section.services.map((service) => {
          if (service._id === serviceid) {
            const newTables = service.tables.map((table, ind) => {
              if (ind === tableind) {
                table[`${prop}`] = e.target.value;
              }
              return table;
            });
            service.tables = newTables;
          }
          return service;
        })
        section.services = newServices;
      }
      return section;
    });
    setSections(newSections);
  };

  //===========================================================
  //===========================================================

  useEffect(() => {
    const serviceTypes = []
    const serviceIdArr = []
    for (const service of services) {
      if (service.tables.length > 0) {
        const check = service.serviceid.servicetype._id;
        if (!serviceIdArr.includes(check)) {
          serviceTypes.push({
            servicetypeid: check,
            servicetypename: service.serviceid.servicetype.name,
            services: [service],
            column: service.column
          })
          serviceIdArr.push(check);
        } else {
          if (service.column && service.tables && service.tables.length > 0) {
            const checkCols = Object.keys(service.column).filter(el => el.includes('col')).length;
            const index = serviceTypes.findIndex(el =>
              el.column && el.servicetypeid === check
              && Object.keys(el.column).filter(el => el.includes('col')).length === checkCols)
            if (index >= 0) {
              serviceTypes[index].services.push(service)
              serviceTypes[index].column = service.column
            } else {
              serviceTypes.push({
                servicetypeid: check,
                servicetypename: service.serviceid.servicetype.name,
                services: [service],
                column: service.column
              })
            }
          } else {
            serviceTypes.push({
              servicetypeid: check,
              servicetypename: service.serviceid.servicetype.name,
              services: [service],
            })
          }
        }
      }
    }
    setSections(serviceTypes);

  }, [services]);

  useEffect(() => {
    // if (!t) {
    // getServices()
    getBaseUrl()
    // }
  }, [getBaseUrl]);

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="container p-4"
          style={{ fontFamily: "times" }}
        >
          <LabPrint
            baseUrl={baseUrl}
            clinica={connector?.clinica}
            connector={connector}
            client={client}
            sections={sections}
          />
        </div>
      </div>
      <div className="container p-4 bg-white text-center" style={{ fontFamily: "times" }}>
        <div className="px-4">
          {/* <div className="row" style={{ fontSize: "10pt" }}>
            <div
              className="col-4"
              style={{ border: "1px solid", textAlign: "center" }}
            >
              <p className="pt-2">
                O'zbekiston Respublikasi Sog'liqni Saqlash Vazirligi
              </p>
            </div>
            <div
              className="col-4"
              style={{
                border: "1px solid",
                textAlign: "center",
                borderLeft: "none",
              }}
            >
              <p className="pt-2">IFUD: 86900</p>
            </div>
            <div
              className="col-4"
              style={{
                border: "1px solid",
                textAlign: "center",
                borderLeft: "none",
              }}
            >
              <p style={{ margin: "0" }}>
                O'zbekiston Respublikasi SSV 31.12.2020y dagi №363 buyrug'i
                bilan tasdiqlangan
              </p>
            </div>
          </div> */}
          <div className="row" style={{ fontSize: "20pt" }}>
            <div className="col-6 pt-2" style={{ textAlign: "center" }}>
              <pre className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                {connector?.clinica?.name}
              </pre>
            </div>
            <div className="col-6" style={{ textAlign: "center" }}>
              <p className="text-end m-0">
                {/* <img width="120" src={qr && qr} alt="QR" /> */}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-12" style={{ padding: "0" }}>
              <table
                style={{
                  width: "100%",
                  border: "2px solid",
                  borderTop: "3px solid",
                }}
              >
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Mijozning F.I.SH
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    <h4>
                      {client && client.lastname + " " + client.firstname}
                    </h4>
                  </td>
                  <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                    <p className="fw-bold fs-5 m-0">
                      TAHLIL <br /> NATIJALARI
                    </p>
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Tug'ilgan yili
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && new Date(client.born).toLocaleDateString()}
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Kelgan sanasi
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {connector &&
                      new Date(connector.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="p-0 fw-bold"
                    style={{
                      width: "100px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Namuna
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "100px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {connector && connector.probirka}
                  </td>
                </tr>

                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    Manzil
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && client.address}
                  </td>
                  <td
                    className="p-0 fw-bold"
                    style={{
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    ID
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && client.id}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div className="pt-4 w-full text-center">
          {sections.length > 0 &&
            sections.map((section, index) => {
              if (section.services.filter(serv => serv.column && serv.tables.length > 0).length > 0) {
                return <div key={index} className={"w-full mb-4 text-center"}>
                  <div className="w-full flex justify-center items-center mb-4">
                    <h2 className="block text-[18px] font-bold">
                      {section?.servicetypename}
                    </h2>
                  </div>
                  <table className="w-full text-center">
                    <thead>
                      <tr>
                        <th className="border-2 bg-gray-400 border-black px-[10px] text-center">{section?.column?.col1}</th>
                        {section?.column?.col2 && <th className="border-2 bg-gray-400 border-black px-[10px] text-center">{section?.column?.col2}</th>}
                        {section?.column?.col3 && <th className="border-2 bg-gray-400 border-black px-[10px] py-[7px] text-center">{section?.column?.col3}</th>}
                        {section?.column?.col4 && <th className="border-2 bg-gray-400 border-black px-[10px] text-center">{section?.column?.col4}</th>}
                        {section?.column?.col5 && <th className="border-2 bg-gray-400 border-black px-[10px] text-center">{section?.column?.col5}</th>}
                        <th className="border-2 bg-gray-400 border-black  p">
                          <div className="custom-control custom-checkbox text-center">
                            <input
                              checked={section.services.filter(s => s.accept).length === section.services.length}
                              type="checkbox"
                              className="custom-control-input border border-dager"
                              id={`section${index}`}
                              onChange={() => handleCheckAllAccept(index)}
                            />
                            <label className="custom-control-label"
                              htmlFor={`section${index}`}></label>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section?.services.map((service, ind) => {
                        return <>
                          {service.tables.length > 0 && service.tables.map((table, key, tabless) => (
                            <tr key={key} >
                              <td className="border-2 border-black p-[10px]"> <textarea rows={2}
                                className={"w-full border-none outline-none"}
                                onChange={(e) => handleChangeTables(e, index, service._id, key, "col1")}
                              >
                                {table?.col1}
                              </textarea> </td>
                              <td className="border-2 border-black p-[10px] text-center">
                                <textarea rows={2}
                                  className={"w-full border-none outline-none text-center focus:outline-2 focus:outline-emerald-600"}
                                  onChange={(e) => handleChangeTables(e, index, service._id, key, "col2")}
                                  onKeyDown={
                                    (e) => {
                                      if (e.key === "ArrowDown") {
                                        if (key === service.tables.length - 1 && ind !== section.services.length - 1 && index !== sections.length - 1) {
                                          document.getElementById(`result${index}-${ind + 1}-${0}`).focus()
                                        } else if (index !== sections.length - 1 && ind === section.services.length - 1 && key === service.tables.length - 1) {
                                          document.getElementById(`result${index + 1}-${0}-${0}`).focus()
                                        } else if (index === sections.length - 1 && ind === section.services.length - 1 && key === service.tables.length - 1) {
                                          document.getElementById(`result${0}-${0}-${0}`).focus()
                                        } else {
                                          document.getElementById(`result${index}-${ind}-${key + 1}`).focus()
                                        }
                                      }
                                      if (e.key === "ArrowUp") {
                                        if (key === 0 && ind === 0 && index === 0) {
                                          document.getElementById(`result${sections.length - 1}-${sections[sections.length - 1].services.length - 1}-${sections[sections.length - 1].services[sections[sections.length - 1].services.length - 1].tables.length - 1}`).focus()
                                        } else if (key === 0 && ind !== 0 && index === 0) {
                                          document.getElementById(`result${index}-${ind - 1}-${sections[index].services[ind - 1].tables.length - 1}`).focus()
                                        } else if (key === 0 && ind !== 0 && index !== 0) {
                                          document.getElementById(`result${index - 1}-${sections[index - 1].services[services.length - 1]}-${sections[index - 1].services[services.length - 1].tables.length - 1}`).focus()
                                        } else {
                                          document.getElementById(`result${index}-${ind}-${key - 1}`).focus()
                                        }
                                      }
                                    }}
                                  id={`result${index}-${ind}-${key}`}
                                >
                                  {table?.col2}
                                </textarea>
                              </td>
                              <td className="border-2 border-black p-[10px]">
                                <textarea rows={2}
                                  className={"w-full border-none outline-none text-center"}
                                  onChange={(e) => handleChangeTables(e, index, service._id, key, "col3")}
                                >
                                  {table?.col3}
                                </textarea>
                              </td>
                              {section?.column?.col4 && <td className="border-2 border-black p-[10px]">
                                <textarea rows={2}
                                  className={"w-full border-none outline-none text-center"}
                                  onChange={(e) => handleChangeTables(e, index, service._id, key, "col4")}
                                >
                                  {table?.col4}
                                </textarea></td>}
                              {section?.column?.col5 && <td className="border-2 border-black p-[10px]">
                                <textarea rows={2}
                                  className={"w-full border-none outline-none text-center"}
                                  onChange={(e) => handleChangeTables(e, index, service._id, key, "col5")}
                                >
                                  {table?.col5}
                                </textarea></td>}
                              <td rowSpan={tabless.length} className={`${key > 0 ? 'hidden' : ''} border-2 border-black p-[10px]`}>
                                <div className="custom-control custom-checkbox text-center">
                                  <input
                                    checked={service.accept}
                                    type="checkbox"
                                    className="custom-control-input border border-dager"
                                    id={`service${service._id}`}
                                    onChange={() => handleCheckAccept(index, service._id)}
                                  />
                                  <label className="custom-control-label"
                                    htmlFor={`service${service._id}`}></label>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      })}
                    </tbody>
                  </table>
                </div>
              }
            })}
        </div>
        {sections.length > 0 && sections.map((section) => section.services.map((service, ind) => (
          <div
            className='mt-4 mb-2' key={ind}>
            <h2 className="text-[16px] font-bold mb-2">{service.service.name}</h2>
            <div
            >
              <input
                onChange={(e) => uploadFile(e, service._id)}
                type="file"
                className=''
              />
            </div>
            <div className="">
              {service.files.map((file) => <div className="w-[400px]">
                <img src={file} alt='file' />
                <div className="px-4 pt-2">
                  <button className="" onClick={() => deleteFile(file, service._id)} >
                    <FontAwesomeIcon fontSize={16} icon={faTrash} />
                  </button>
                </div>
              </div>)}
            </div>
          </div>
        )))}
        <div className="row">
          <div className="col-12 text-center my-4">
            <button className="btn btn-success px-4 mx-4" onClick={() => saveService()} > Tasdiqlash</button>
            <button className="btn btn-info px-5" onClick={handlePrint} >Chop etish</button>
          </div>
        </div>
      </div>
    </>
  );
};


const AdoptionTemplate = () => {
  const { client, connector, services } = useLocation().state

  const [type, setType] = useState('doctor')

  return <div className="container p-4 bg-white text-center">
    <div className="w-[300px]">
      <Select
        options={[
          {
            label: "Shifokor",
            value: "doctor"
          },
          {
            label: "Laboratoriya",
            value: "laboratory"
          }
        ]}
        onChange={e => setType(e.value)}
      />
    </div>
    {type === 'doctor' ? <DoctorTemplate client={client} connector={connector} services={services} /> : <LabTemplate client={client} connector={connector} services={services} />}
  </div>
}

export default AdoptionTemplate;

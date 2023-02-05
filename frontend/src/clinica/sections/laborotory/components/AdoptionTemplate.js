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

const AdoptionTemplate = () => {
  // const clientId = useParams().clientid
  // const connectorId = useParams().connectorid

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

  const {
    state: { client, connector, services },
  } = useLocation();

  // const [client, setClient] = useState();
  // const [connector, setConnector] = useState();
  const [sections, setSections] = useState([]);
  const [tablesections, setTableSections] = useState();
  const [tablecolumns, setTableColumns] = useState();
  const [sectionFiles, setSectionFiles] = useState();
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

  const [tablesSelect, setTablesSelect] = useState([])

  const getServices = useCallback(async () => {
    try {
      const data = await request(
        `/api/doctor/table/services`,
        'POST',
        { clinica: auth.clinica._id, doctor: auth.user },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setTablesSelect([...data].map(service => {
        return {
          label: service.name,
          value: service._id,
          column: service.column,
          tables: service.tables,
        }
      }))
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [
    request,
    auth,
    notify
  ])

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
    console.log('work');
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

  function handleUpload(url) {
    // url of cdn backed file returned

  }

  function handleMultipleUpload(files) {
    // Array of file objects returned

  }

  const handleCheckAllAccept = (ind) => {
    console.log('work');
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
  console.log(sections);
  const handleChangeTables = (e, sectionind, serviceid, tableind, prop) => {
    const newSections = [...sections].map((section, index) => {
      if (index === sectionind) {
        const newServices = section.services.map((service) => {
          if (service._id === serviceid) {
            const newTables = service.tables.map((table, ind) => {
              console.log(table);
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

  useEffect(() => {
    const serviceTypes = []
    const serviceIdArr = []
    for (const service of services) {
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
        const index = serviceTypes.findIndex(el => el.servicetypeid === check)
        serviceTypes[index].services.push(service)
        serviceTypes[index].column = service.column
      }
    }
    const servicesByCol = [];
    for (const service of serviceTypes) {
      let col3 = [];
      let col4 = [];
      let col5 = []
      let obj = {
        servicetypeid: service.servicetypeid,
        servicetypename: service.servicetypename,
      }
      for (const s of service.services) {
        const checkCols = Object.keys(s.column).filter(el => el.includes('col')).length
        checkCols === 3 && col3.push(s)
        checkCols === 4 && col4.push(s)
        checkCols === 5 && col5.push(s)
      }
      if (col3.length > 0) {
        servicesByCol.push({ ...obj, services: col3, column: col3[0].column })
      }
      if (col4.length > 0) {
        servicesByCol.push({ ...obj, services: col4, column: col4[0].column })
      }
      if (col5.length > 0) {
        servicesByCol.push({ ...obj, services: col5, column: col5[0].column })
      }
    }
    setSections(servicesByCol);
  }, [services]);

  useEffect(() => {
    // if (!t) {
    getServices()
    getBaseUrl()
    // }
  }, [getServices, getBaseUrl]);

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="container p-4"
          style={{ fontFamily: "times" }}
        >
          <Print
            doctor={auth.doctor}
            connector={connector}
            client={client}
            sections={sections}
          />
        </div>
      </div>
      <div className="container p-4 bg-white" style={{ fontFamily: "times" }}>
        <div className="px-4">
          <div className="row" style={{ fontSize: "10pt" }}>
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
          </div>
          <div className="row" style={{ fontSize: "20pt" }}>
            <div className="col-6 pt-2" style={{ textAlign: "center" }}>
              <p className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                "GEMO-TEST" <br />
                MARKAZIY LABORATORIYA
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
          <div className="row mt-3" style={{ backgroundColor: "#C0C0C0" }}>
            <div className="col-4">
              <p className="px-2 m-0">"GEMO-TEST" х/к</p>
            </div>
            <div className="col-8">
              <p className="px-2 m-0 text-end pr-5">
                Xizmatlar litsenziyalangan. LITSENZIYA №21830906 03.09.2020. SSV
                RU
              </p>
            </div>
          </div>
        </div>
        <div className="row pt-4 w-full">
          {sections.length > 0 &&
            sections.map((section, index) => (
              <div key={index} className={"w-full mb-4"}>
                <div className="w-full flex justify-center items-center mb-4">
                  <h2 className="block text-[18px] font-bold">
                    {section?.servicetypename}
                  </h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="border-2 bg-gray-400 border-black px-[10px] py-[2px] text-center">{section?.column?.col1}</th>
                      {section.column.col2 && <th className="border-2 bg-gray-400 border-black px-[10px] py-[2px] text-center">{section?.column?.col2}</th>}
                      {section.column.col3 && <th className="border-2 bg-gray-400 border-black px-[10px] py-[2px] text-center">{section?.column?.col3}</th>}
                      {section.column.col4 && <th className="border-2 bg-gray-400 border-black px-[10px] py-[2px] text-center">{section?.column?.col4}</th>}
                      {section.column.col5 && <th className="border-2 bg-gray-400 border-black px-[10px] py-[2px] text-center">{section?.column?.col5}</th>}
                      <th className="border-2 bg-gray-400 border-black  py-[2px]">
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
                        {service.tables.map((table, key) => (
                          <tr key={key} >
                            <td className="border-2 border-black p-[10px]"> <textarea rows={2}
                              className={"w-full border-none outline-none"}
                              onChange={(e) => handleChangeTables(e, index, service._id, key, "col1")}
                            >
                              {table?.col1}
                            </textarea> </td>
                            <td className="border-2 border-black p-[10px]">
                              <textarea rows={2}
                                className={"w-full border-none outline-none"}
                                onChange={(e) => handleChangeTables(e, index, service._id, key, "col2")}
                              >
                                {table?.col2}
                              </textarea>
                            </td>
                            <td className="border-2 border-black p-[10px]">
                              <textarea rows={2}
                                className={"w-full border-none outline-none"}
                                onChange={(e) => handleChangeTables(e, index, service._id, key, "col3")}
                              >
                                {table?.col3}
                              </textarea>
                            </td>
                            {table?.col4 && <td className="border-2 border-black p-[10px]">
                              <textarea rows={2}
                                className={"w-full border-none outline-none"}
                                onChange={(e) => handleChangeTables(e, index, service._id, key, "col4")}
                              >
                                {table?.col4}
                              </textarea></td>}
                            {table?.col5 && <td className="border-2 border-black p-[10px]">
                              <textarea rows={2}
                                className={"w-full border-none outline-none"}
                                onChange={(e) => handleChangeTables(e, index, service._id, key, "col5")}
                              >
                                {table?.col5}
                              </textarea></td>}
                            <td rowSpan={service.tables.length} className="border-2 border-black p-[10px]">
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
            ))}
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

export default AdoptionTemplate;

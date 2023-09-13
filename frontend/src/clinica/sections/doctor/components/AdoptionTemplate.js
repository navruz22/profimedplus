import { useToast } from "@chakra-ui/react";
import {
  faBell,
  faPlus,
  faSave,
  faTrash,
  faTrashAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Select, { components } from "react-select";
import makeAnimated from 'react-select/animated'
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Print from "./Print";
import { useReactToPrint } from 'react-to-print'
import TextEditor from "./TextEditor";
import LabPrint from "../../laborotory/components/Print"
import DoctorResult from "../conclusion/components/DoctorResult";
import QRCode from "qrcode"
import { useTranslation } from "react-i18next";
import AllServices from "./AllServices";
import ModalPrint from "./ModalPrint";
import ReactHtmlParser from 'react-html-parser'
import { Modal } from "../../reseption/components/Modal";
import { checkProductsData, checkServicesData } from "../../reseption/offlineclients/checkData/checkData";

const animatedComponents = makeAnimated()

const CustomMenuWithInput = ({ selectProps: { onHover, onChange, outHover }, ...props }) => {

  const { data } = props
  return (
    <div className="hover:bg-sky-300 hover:bg-opacity-50 text-[16px] font-sans py-2 cursor-auto" onMouseLeave={() => outHover()} onMouseEnter={() => onHover(data)} onClick={() => onChange(data)} >
      {props.children}
    </div>
  )
}


const DoctorTemplate = ({ client, connector, services, clientsType, baseUrl }) => {

  const { t } = useTranslation()

  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);

  const [modal, setModal] = useState(false)

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

  // const componentRef = useRef()
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: client && client?.firstname + ' ' + client?.lastname,

  // })

  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState();

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
        if (!section.files) {
          section.files = [`${baseUrl}/api/upload/file/${file.filename}`]
        } else {
          section.files.push(`${baseUrl}/api/upload/file/${file.filename}`)
        }
      }
      return section;
    }))
    notify({
      status: 'success',
      description: '',
      title: 'Surat muvaffaqqiyatli yuklandi',
    })

  }

  const handleSave = () => {
    if (clientsType === 'offline') {
      saveService()
    } else {
      saveStatsionarService()
    }
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
        title: t(data.message),
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

  const saveStatsionarService = async () => {
    try {
      const data = await request(
        `/api/doctor/clients/statsionar/adopt`,
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
        title: t(data.message),
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

  const handleChangeTemplateName = (e, index, serviceid) => {
    const newSections = [...sections].map((section) => {
      if (section._id === serviceid) {
        const newTemplates = section.templates.map((template, ind) => {
          if (ind === index) {
            template.name = e;
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

  const changeTransform = (e, index, serviceid) => {
    const newSections = [...sections].map((section) => {
      if (section._id === serviceid) {
        const newTemplates = section.templates.map((template, ind) => {
          if (ind === index) {
            template.transform = e ? false : true
          }
          return template;
        });
        section.templates = newTemplates;
      }
      return section;
    });
    setSections(newSections);
  }

  useEffect(() => {
    setSections([...services].filter(service => service.department.probirka === false && service.department._id === auth?.user?.specialty?._id));
  }, [services]);


  const [qr, setQr] = useState()

  useEffect(() => {
    if (connector && baseUrl) {
      QRCode.toDataURL(`${baseUrl}/clienthistory/laboratory/${connector._id}`)
        .then(data => {
          setQr(data)
        })
    }
  }, [connector, baseUrl])

  useEffect(() => {
    getTemplates();
  }, [getTemplates]);

  //=====================================================================
  //=====================================================================

  const [templateModal, setTemplateModal] = useState(false)
  const [templateModalTitle, setTemplateModalTitle] = useState("")
  const [templateModalText, setTemplateModalText] = useState("")

  const handleOnHover = (data) => {
    setTemplateModal(true)
    setTemplateModalTitle(data?.label)
    setTemplateModalText(data?.template)
  }

  return (
    <>
      <div className="container p-4 bg-white" style={{ fontFamily: "times" }}>
        <div className="px-4">
          {auth?.clinica?.ifud1 && <div className="row" style={{ fontSize: "10pt" }}>
            <div
              className="col-4"
              style={{ border: "1px solid", textAlign: "center" }}
            >
              <p className="pt-2">
                {auth?.clinica?.ifud1}
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
              <p className="pt-2">{auth?.clinica?.ifud2}</p>
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
                {auth?.clinica?.ifud3}
              </p>
            </div>
          </div>}
          <div className="flex justify-between items-center" style={{ fontSize: "20pt" }}>
            <div className="pt-2" style={{ textAlign: "center" }}>
              <pre className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                {auth?.clinica?.name}
              </pre>
            </div>
            <div className="pt-2" style={{ textAlign: "center" }}>
              <pre className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                {auth?.clinica?.name2}
              </pre>
            </div>
            <div className="" style={{ textAlign: "center" }}>
              <p className="text-end m-0">
                <img width="120" src={qr && qr} alt="QR" />
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
                    {t("Mijozning F.I.SH")}
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
                      {t("TAHLIL")} <br /> {t("NATIJALARI")}
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
                    {t("Tug'ilgan yili")}
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
                    {t("Kelgan sanasi")}
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
                    {t("NAMUNA")}
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
                    {t("Manzil")}
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
                    {t("ID")}
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
          <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
            <span className="text-[14px] font-bold">{auth.clinica?.organitionName}</span>
            <span className="text-[14px] font-bold">{auth?.clinica?.license}</span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-[20px] font-bold">{auth?.user?.signature}</span>
          </div>
        </div>
        <div className="pt-4 w-full">
          {sections.length > 0 &&
            sections.map((section, index) => (
              <div key={index} className={"w-full"}>
                <div className="w-full flex items-center mb-4">
                  <div className="w-[200px] mr-[20rem]">
                    <Select
                      id="template-select"
                      // ref={selectRef}
                      options={templates}
                      onChange={(e) => {
                        handleAddTemplate(e, section.service._id)
                        setTemplateModal(false)
                      }
                      }
                      components={{ Option: CustomMenuWithInput }}
                      onHover={handleOnHover}
                      outHover={() => setTemplateModal(false)}
                      closeMenuOnSelect={true}
                    />
                  </div>
                  <h2 className="block text-[18px] font-bold">
                    {section?.service?.name}
                  </h2>
                </div>
                {section.templates && section.templates.length > 0 &&
                  section.templates.map((template, index) => (
                    <div
                      key={index}
                      className="p-[10px] w-full border border-black"
                    >
                      <div className="flex justify-between items-center py-2 px-4">
                        <div className="text-[18px] font-bold">
                          <input
                            value={template?.name}
                            placeholder={t("Shablon nomi kiritish")}
                            className="w-[200px] border outline-0 rounded-sm p-1"
                            onChange={(e) => {
                              handleChangeTemplateName(e.target.value, index, section._id)
                            }}
                          >
                          </input>
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
                        <TextEditor changeTransform={() => changeTransform(template?.transform, index, section._id)} transform={template?.transform} value={template?.template} onChange={(data) => handleChangeTemplate(data, index, section._id)} />
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
                    {section.files && section.files.length > 0 && section.files.map((file) => <div className="w-[400px]">
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
            <button className="btn btn-success px-4 mx-4" onClick={() => handleSave()} > {t("Tasdiqlash")}</button>
            <button className="btn btn-info px-5" onClick={() => setModal(true)} >{t("Chop etish")}</button>
          </div>
        </div>
      </div>
      <ModalPrint
        doctor={auth.user}
        connector={connector}
        client={client}
        clinica={auth && auth.clinica}
        baseUrl={baseUrl}
        qr={qr}
        modal={modal}
        services={sections}
        setModal={setModal}
      />
      <div className={`${templateModal ? "fixed" : "hidden"} border-2 border-green-500 top-[50%] left-[30%] translate-y-[-50%] max-w-[800px] h-[600px] bg-white p-2 overflow-scroll`}>
        <h2 className="block text-center mb-4 text-[16px] font-bold">
          {templateModalTitle}
        </h2>
        <div
          className={`w-full text-[14px] mb-2 print_word`}
        >

          {ReactHtmlParser(templateModalText)}

        </div>
      </div>
    </>
  );
};

const LabTemplate = ({ client, connector, services, baseUrl }) => {

  const { t } = useTranslation()

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

  const [sections, setSections] = useState([]);


  const handleCheckAllAccept = (ind) => {
    const filtered = sections.map((section, index) => {
      if (index === ind) {
        let newServices = [];
        const isAllTrue = section.services.filter(s => s.tables.filter(table => table.accept).length === s.tables.length).length === section.services.length;
        if (isAllTrue) {
          newServices = section.services.map(service => {
            const newTables = [...service.tables].map(item => {
              item.accept = false;
              return item;
            })
            service.tables = newTables;
            service.accept = false;
            return service
          })
        } else {
          newServices = section.services.map(service => {
            const newTables = [...service.tables].map(item => {
              item.accept = true;
              return item;
            })
            service.tables = newTables;
            service.accept = true;
            return service
          })
        }
        section.services = newServices;
      }
      return section;
    })
    setSections(filtered);
  }
  const handleCheckAccept = (ind, serviceid, tableind) => {
    const filtered = sections.map((section, index) => {
      if (index === ind) {
        let newServices = section.services.map((service) => {
          if (service._id === serviceid) {
            let tables = [...service.tables].map((table, i) => {
              if (i === tableind) {
                table.accept = table.accept ? false : true;
              }
              return table
            })
            service.tables = tables;
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

  const [qr, setQr] = useState()

  useEffect(() => {
    const servicetypesAll = services.reduce((prev, el) => {
      if (!prev.includes(el.serviceid.servicetype.name)) {
        prev.push(el.serviceid.servicetype.name)
      }
      return prev;
    }, [])
    let servicetypes = []
    for (const type of servicetypesAll) {
      services.map((service) => {
        if (service.column && service.tables.length > 0) {
          if (service.serviceid.servicetype.name === type && service.tables.length <= 2) {
            const cols = Object.keys(service.column).filter(c => c.includes('col') && service.column[c]).length;
            const isExist = servicetypes.findIndex(i => i.servicetype === type && i.cols === cols)
            if (isExist >= 0) {
              servicetypes[isExist].services.push(service);
            } else {
              servicetypes.push({
                column: service.column,
                servicetype: type,
                services: [service],
                cols: cols
              })
            }
          }
        }
        return service;
      })
    }

    const servicesmore = [...servicetypesAll].reduce((prev, el) => {
      services.map((service) => {
        if (service.serviceid.servicetype.name === el && service.tables.length > 2) {
          prev.push({
            column: service.column,
            servicetype: service.service.name,
            services: [service]
          })
        }
        return service;
      })
      return prev;
    }, [])

    setSections([...servicetypes, ...servicesmore])

  }, [services]);

  useEffect(() => {
    if (connector && baseUrl) {
      QRCode.toDataURL(`${baseUrl}/clienthistory/laboratory/${connector._id}`)
        .then(data => {
          setQr(data)
        })
    }
  }, [connector, baseUrl])

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
            clinica={auth?.clinica}
            connector={connector}
            client={client}
            sections={sections}
            qr={qr}
          />
        </div>
      </div>
      <div className="container p-4 bg-white text-center" style={{ fontFamily: "times" }}>
        <div className="px-4">
          {auth?.clinica?.ifud1 && <div className="row" style={{ fontSize: "10pt" }}>
            <div
              className="col-4"
              style={{ border: "1px solid", textAlign: "center" }}
            >
              <p className="pt-2">
                {auth?.clinica?.ifud1}
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
              <p className="pt-2">{t("IFUD")}: {auth?.clinica?.ifud2}</p>
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
                {auth?.clinica?.ifud3}
              </p>
            </div>
          </div>}
          <div className="row" style={{ fontSize: "20pt" }}>
            <div className="col-6 pt-2" style={{ textAlign: "center" }}>
              <pre className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                {auth?.clinica?.name}
              </pre>
            </div>
            <div className="col-6 pt-2" style={{ textAlign: "center" }}>
              <pre className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                {auth?.clinica?.name2}
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
                    {t("Mijozning F.I.SH")}
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
                      {t("TAHLIL")} <br /> {t("NATIJALARI")}
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
                    {t("Tug'ilgan yili")}
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
                    {t("Kelgan sanasi")}
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
                    {t("NAMUNA")}
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
                    {t("Manzil")}
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
                    {t("ID")}
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
          <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
            <span className="text-[14px] font-bold">{auth.clinica?.organitionName}</span>
            <span className="text-[14px] font-bold">{auth?.clinica?.license}</span>
          </div>
        </div>
        <div className="pt-4 w-full text-center">
          {sections.length > 0 &&
            sections.map((section, index) => {
              if (section.services.filter(serv => serv.column && serv.tables.length > 0).length > 0) {
                return <div key={index} className={"w-full mb-4 text-center"}>
                  <div className="w-full flex justify-center items-center mb-4">
                    <h2 className="block text-[18px] font-bold">
                      {section?.servicetype}
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
                              checked={section.services.filter(s => s.tables.filter(t => t.accept).length === s.tables.length).length === section.services.length}
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
                          {service.tables && service.tables.length > 0 && service.tables.map((table, key, tabless) => (
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
                              <td className={`border-2 border-black p-[10px]`}>
                                <div className="custom-control custom-checkbox text-center">
                                  <input
                                    checked={table?.accept}
                                    type="checkbox"
                                    className="custom-control-input border border-dager"
                                    id={`service${table._id}`}
                                    onChange={() => handleCheckAccept(index, service._id, key)}
                                  />
                                  <label className="custom-control-label"
                                    htmlFor={`service${table._id}`}></label>
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
        <div className="row">
          <div className="col-12 text-center my-4">
            <button className="btn btn-info px-5" onClick={handlePrint} >{t("Chop etish")}</button>
          </div>
        </div>
      </div>
    </>
  );
};


const AdoptionTemplate = () => {

  const { t } = useTranslation()

  const { client, connector, services, clientsType, user } = useLocation().state;
  
  const connectorData = useLocation().state;

  const [modal, setModal] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [modalBody, setModalBody] = useState('all')

  const [type, setType] = useState('doctor')

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
  }, [request, notify]);


  //============================================================================
  //============================================================================

  const [isAddConnector, setIsAddConnector] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const [client2, setClient] = useState({})
  const [connector2, setConnector] = useState({})


  const addServices = async () => {
    setIsActive(false)
    try {
      const data = await request(
        `/api/doctor/clients/service/add`,
        "POST", 
        {
          client: { ...client2, clinica: auth.clinica._id },
          connector: { ...connector2, clinica: auth.clinica._id },
          services: [...newservices],
          products: [...newproducts],
          clinica: auth && auth.clinica._id,
          user: auth?.user,
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
      setSelectedServices(null);
      setConnector({})
      setClient({})
      setModal2(false);
      setNewProducts([])
      setNewServices([])
      setVisible(false);
      setTimeout(() => {
        setIsActive(true)
      }, 5000)
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }

  const addConnectorHandler = async () => {
    setIsActive(false)
    try {
      const data = await request(
        `/api/offlineclient/client/connector/add`,
        "POST",
        {
          client: { ...client2, clinica: auth.clinica._id },
          connector: { probirka: connector2?.probirka, clinica: auth.clinica._id },
          services: [...newservices],
          products: [...newproducts],
          // counterdoctor: counterdoctor,
          // adver: { ...adver, clinica: auth.clinica._id },
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setSelectedServices(null);
      setConnector({})
      setClient({})
      setModal2(false);
      setNewProducts([])
      setNewServices([])
      setVisible(false);
      setIsAddConnector(false)
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

  const [departments, setDepartments] = useState([]);

  const getDepartments = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/department/reseption`,
        "POST",
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDepartments(data);
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }, [request, auth, notify]);
  const [products, setProducts] = useState([]);

  const getProducts = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/product/getallreseption`,
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
        title: t(error),
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
  const [newservices, setNewServices] = useState([]);
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
        addUser: auth?.user?.specialty?.name,
        pieces: 1,
      });
    });
    setNewServices(s);
    setSelectedServices(services);
  };
  const [services2, setServices] = useState([])

  const getServices = useCallback(
    (e) => {
      var s = []
      if (e === 'all') {
        departments.map((department) => {
          return department.services.map((service) => {
            return s.push({
              label: service.name,
              value: service._id,
              service: service,
              department: department,
            })
          })
        })
      } else {
        departments.map((department) => {
          if (e === department._id) {
            department.services.map((service) => {
              s.push({
                label: service.name,
                value: service._id,
                service: service,
                department: department,
              })
              return ''
            })
          }
          return ''
        })
      }
      setServices(s)
    },
    [departments],
  )

  useEffect(() => {
    if (departments) {
      getServices('all')
    }
  }, [departments, getServices])

  const checkData = () => {
    if (checkServicesData(newservices && newservices)) {
      return notify(checkServicesData(newservices));
    }

    if (checkProductsData(newproducts)) {
      return notify(checkProductsData(newproducts));
    }
    setModal2(true);
  };

  //============================================================================
  //============================================================================

  const sendMessageToBot = async (firstname, lastname) => {
    try {
      const data = await request(
        `/api/bot/send`,
        "POST",
        {
          firstname,
          lastname,
          room: auth?.user?.specialty?.room
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: 'Success',
        description: "",
        status: "success",
      });
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }

  //============================================================================
  //============================================================================

  useEffect(() => {
    getBaseUrl()
    getDepartments()
    getProducts()
  }, [getBaseUrl, getDepartments, getProducts]);

  return <div className="container p-4 bg-white text-center">
    <div className="flex">
      <div className="w-[300px]">
        <Select
          options={[
            {
              label: t("Shifokor"),
              value: "doctor"
            },
            {
              label: t("Laboratoriya"),
              value: "laboratory"
            },
            {
              label: t("Xammasi"),
              value: "all"
            }
          ]}
          placeholder={t("Tanlang...")}
          onChange={e => setType(e.value)}
        />
      </div>
      <button onClick={() => {
        setModal(true)
        setModalBody('all')
      }} className="ml-4 block px-4 py-2 bg-alotrade text-center rounded-2 text-white">
        Xizmatlar
      </button>
      <button onClick={() => {
        setModal(true)
        setModalBody('own')
      }} className="ml-4 block px-4 py-2 bg-alotrade text-center rounded-2 text-white">
        Yullanma
      </button>
      <button
        onClick={() => {
          setClient(client)
          setConnector(connector)
          setIsAddConnector(false)
          setVisible(!visible)
          setSelectedServices(null)
          setNewServices([])
          setNewProducts([])
        }}
        className="ml-4 block px-4 py-2 bg-alotrade text-center rounded-2 text-white"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {/* <button
        onClick={() =>
          sendMessageToBot(client?.firstname, client?.lastname)
        }
        className="ml-4 block px-4 py-2 bg-orange-400 text-center rounded-2 text-white"
      >
        <FontAwesomeIcon icon={faBell} />
      </button> */}
    </div>
    <div className={` ${visible ? "bg-white" : "d-none"}`}>
      <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
        <div className="card">
          <div className="card-header text-left">
            <div className="card-title">{t("Xizmatlar bilan ishlash")}</div>
          </div>
          <div className="card-body">
            <div className="row gutters">
              <div className="col-12 text-left">
                <div className="form-group">
                  <label htmlFor="education">{t("Izoh")}</label>
                  <input
                    value={connector.comment || ''}
                    onChange={(e) => setConnector({ ...connector2, comment: e.target.value })}
                    type="text"
                    className="form-control form-control-sm"
                    id="comment"
                    name="comment"
                    placeholder={t("Izoh")}
                  />
                </div>
              </div>
              <div className="col-12 text-left">
                <div className="form-group">
                  <label htmlFor="fullName">{t("Bo'limlar")}</label>
                  <select
                    className="form-control form-control-sm selectpicker"
                    placeholder="Reklamalarni tanlash"
                    onChange={(event) => getServices(event.target.value)}
                  >
                    <option value="all"> {t("Barcha bo'limlar")}</option>
                    {departments.map((department, index) => {
                      return (
                        <option key={index} value={department._id}>
                          {department.name}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="col-12 text-left">
                <div className="form-group">
                  <label htmlFor="inputEmail">{t("Xizmatlar")}</label>
                  <Select
                    value={selectedServices}
                    onChange={changeService}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={services2}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      padding: 0,
                      height: 0,
                    })}
                    isMulti
                  />
                </div>
              </div>
              <div className="col-12 text-left">
                <div className="form-group">
                  <label htmlFor="inputEmail">{t("Mahsulotlar")}</label>
                  <Select
                    value={selectedProducts}
                    onChange={changeProduct}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={products}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      padding: 0,
                      height: 0,
                    })}
                    isMulti
                  />
                </div>
              </div>
              <div className="col-12 text-left">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="border bg-alotrade py-1">№</th>
                      <th className="border bg-alotrade py-1">{t("Nomi")}</th>
                      <th className="border bg-alotrade py-1">{t("Narxi")}</th>
                      <th className="border bg-alotrade py-1">{t("Soni")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newservices &&
                      newservices.map((service, index) => {
                        return (
                          <tr key={index}>
                            <td className="py-1">{index + 1}</td>
                            <td className="py-1">{service.service.name}</td>
                            <td className="text-right py-1">
                              {service.service.price * service.pieces}
                            </td>
                            <td className="text-right py-1">
                              <input
                                onChange={(e) =>
                                  setNewServices(
                                    Object.values({
                                      ...newservices,
                                      [index]: {
                                        ...newservices[index],
                                        pieces: e.target.value,
                                      },
                                    }),
                                  )
                                }
                                className="text-right outline-none"
                                style={{ maxWidth: '50px', outline: 'none' }}
                                defaultValue={service.pieces}
                                type="number"
                              />
                            </td>
                          </tr>
                        )
                      })}
                    <tr className="border"></tr>
                    {newproducts &&
                      newproducts.map((product, index) => {
                        return (
                          <tr key={index}>
                            <td className="py-1">{index + 1}</td>
                            <td className="py-1">{product.product.name}</td>
                            <td className="text-right py-1">
                              {product.product.price * product.pieces}
                            </td>
                            <td className="text-right py-1">
                              <input
                                onChange={(e) =>
                                  setNewProducts(
                                    Object.values({
                                      ...newproducts,
                                      [index]: {
                                        ...newproducts[index],
                                        pieces: e.target.value,
                                      },
                                    }),
                                  )
                                }
                                className="text-right outline-none"
                                style={{ maxWidth: '50px', outline: 'none' }}
                                defaultValue={product.pieces}
                                type="number"
                              />
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th className="text-right" colSpan={2}>
                        {t("Jami")}:
                      </th>
                      <th colSpan={2}>
                        {newservices.reduce((summa, service) => {
                          return (
                            summa +
                            service.service.price * parseInt(service.pieces)
                          )
                        }, 0) +
                          newproducts.reduce((summa, product) => {
                            return (
                              summa +
                              product.product.price * parseInt(product.pieces)
                            )
                          }, 0)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="text-right">
                  <button onClick={checkData} className="bg-alotrade rounded text-white py-2 px-3">
                      {t("Saqlash")}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {type === 'doctor' && <DoctorTemplate user={user} clientsType={clientsType} baseUrl={baseUrl} client={client} connector={connector} services={services} />}
    {type === 'laboratory' && <LabTemplate client={client} connector={connector} services={services} baseUrl={baseUrl} />}
    {type === 'all' && <DoctorResult client={client} connector={connectorData} user={auth?.user} clinica={auth?.clinica} baseUrl={baseUrl} />}
    <AllServices
      modal={modal}
      services={services || []}
      setModal={setModal}
      modalBody={modalBody}
      user={user}
    />
    <Modal
      modal={modal2}
      text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
      setModal={setModal2}
      handler={isActive && isAddConnector ? addConnectorHandler : isActive && addServices}
      basic={client.lastname + " " + client.firstname}
    />
  </div>
}

export default AdoptionTemplate;

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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

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
          className="container p-4"
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
                        {/* <textarea
                          rows={7}
                          className={"w-full border-none outline-none"}
                          onChange={(e) =>
                            handleChangeTemplate(e, index, section._id)
                          }
                        >
                          {template?.template}
                        </textarea> */}
                        <CKEditor
                          editor={DecoupledEditor}
                          data={template?.template}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            handleChangeTemplate(data, index, section._id)
                          }}
                          onReady={editor => {
                            editor.ui.getEditableElement().parentElement.insertBefore(
                              editor.ui.view.toolbar.element,
                              editor.ui.getEditableElement()
                            );

                            this.editor = editor;
                          }}
                          onError={(error, { willEditorRestart }) => {
                            if (willEditorRestart) {
                              this.editor.ui.view.toolbar.element.remove();
                            }
                          }}
                        />
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

export default AdoptionTemplate;

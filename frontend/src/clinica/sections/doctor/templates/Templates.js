import React, { useCallback, useContext, useEffect, useState } from 'react';
import RegisterTemplate from "./RegisterTemplate";
import { Modal } from "./../components/Modal";
import { useToast } from "@chakra-ui/react";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import { ExcelCols } from "./uploadExcel/ExcelCols";
import TableTemplate from "./TableTemplate";
import { checkTemplates } from "./uploadExcel/checkData";

const Templates = () => {
    //====================================================================
    //====================================================================
    // Pagenation
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastTemplate = (currentPage + 1) * countPage
    const indexFirstTemplate = indexLastTemplate - countPage
    const [currentTemplates, setCurrentTemplates] = useState([])
    const [searchStorage, setSearchStrorage] = useState()

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [remove, setRemove] = useState()

    const clearInputs = useCallback(() => {
        const inputs = document.getElementsByTagName('textarea')
        for (const input of inputs) {
            input.value = ''
        }
    }, [])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const toast = useToast()

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            })
        },
        [toast],
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const { request, loading } = useHttp()
    const auth = useContext(AuthContext)

    const [templates, setTemplates] = useState([])
    const [template, setTemplate] = useState({})

    const getTemplates = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/template/getall`,
                'POST',
                { clinica: auth.clinica._id, doctor: auth.user._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            setTemplates(data)
            setSearchStrorage(data)
            setCurrentTemplates(data.slice(indexFirstTemplate, indexLastTemplate))
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
        notify,
        setCurrentTemplates,
        indexLastTemplate,
        indexFirstTemplate,
        setSearchStrorage,
    ])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [imports, setImports] = useState([])
    const [changeImports, setChangeImports] = useState([])
    const sections = [
        { name: 'Shablon nomi', value: 'name' },
        { name: "Shablon", value: 'template' }
    ]
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentTemplates(templates.slice(0, e.target.value))
        },
        [templates],
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Handlers

    const checkUploadData = () => {
        if (checkTemplates(changeImports))
            return notify(checkTemplates(imports))
        createAllHandler()
    }

    const createHandler = useCallback(async () => {
        if (!template.name) {
            return notify({
                title: "Diqqat! Shablon nomini kiriting.",
                description: '',
                status: 'error',
            })
        }
        if (!template.template) {
            return notify({
                title: "Diqqat! Shablonni kiriting.",
                description: '',
                status: 'error',
            })
        }
        try {
            const data = await request(
                `/api/doctor/template/create`,
                'POST',
                { template: { ...template, clinica: auth.clinica._id, doctor: auth.user._id } },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} shabloni yaratildi!`,
                description: '',
                status: 'success',
            })
            getTemplates()
            setTemplate({})
            clearInputs()
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, getTemplates, template, notify, clearInputs])

    const createAllHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/template/createall`,
                'POST',
                { templates: [...changeImports], clinica: auth.clinica._id, doctor: auth.user._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            localStorage.setItem("data", data)
            notify({
                title: `Shablonlar yaratildi!`,
                description: '',
                status: 'success',
            })
            getTemplates()
            setTemplate({})
            clearInputs()
            setModal2(false)
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, notify, clearInputs, getTemplates, changeImports])

    const deleteHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/template/delete`,
                'POST',
                { template: { ...remove } },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} shabloni o'chirildi!`,
                description: '',
                status: 'success',
            })
            getTemplates()
            setRemove()
            clearInputs()
            setModal(false)
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, getTemplates, remove, notify, clearInputs])

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // SEARCH

    const searchTemplate = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.template.toLowerCase().includes(e.target.value.toLowerCase()),
            )
            setTemplates(searching)
            setCurrentTemplates(searching.slice(0, countPage))
        },
        [searchStorage, countPage],
    )

    const searchName = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.name.toLowerCase().includes(e.target.value.toLowerCase()),
            )
            setTemplates(searching)
            setCurrentTemplates(searching.slice(0, countPage))
        },
        [searchStorage, countPage],
    )
    //====================================================================
    //====================================================================


    //====================================================================
    //====================================================================
    // useEffect

    const [t, setT] = useState()
    useEffect(() => {
        if (!t) {
            setT(1)
            getTemplates()
        }
    }, [getTemplates, t])
    //====================================================================
    //====================================================================

    return (
        <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
            <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <RegisterTemplate
                        template={template}
                        setTemplate={setTemplate}
                        createHandler={createHandler}
                    />

                    <TableTemplate
                        setTemplate={setTemplate}
                        templates={templates}
                        currentTemplates={currentTemplates}
                        setModal={setModal}
                        setCurrentTemplates={setCurrentTemplates}
                        setModal2={setModal2}
                        countPage={countPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setRemove={setRemove}
                        loading={loading}
                        setImports={setImports}
                        setPageSize={setPageSize}
                        searchName={searchName}
                        searchTemplate={searchTemplate}
                    />

                    <Modal
                        modal={modal2}
                        setModal={setModal2}
                        handler={checkUploadData}
                        text={
                            <ExcelCols
                                createdData={changeImports}
                                setData={setChangeImports}
                                data={imports}
                                sections={sections}
                            />
                        }
                    />

                    <Modal
                        modal={modal}
                        setModal={setModal}
                        handler={deleteHandler}
                        text=" shablonini ochirishni tasdiqlaysizmi?"
                        basic={remove && remove.name}
                    />
                </div>
            </div>
        </div>
    );
};

export default Templates;

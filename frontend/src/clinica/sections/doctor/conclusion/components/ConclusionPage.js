import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import TextEditor from "./TextEditor";
import ReactHtmlParser from 'react-html-parser'
import "../../components/Print.css"
import { useToast } from "@chakra-ui/react";
import { useHttp } from "../../../../hooks/http.hook";
import { AuthContext } from "../../../../context/AuthContext";
import Select from "react-select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


const ConclusionPage = ({ connector, onChange, setConnector }) => {
    console.log(connector?.client?.conclusions);

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })


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

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    const handleDeleteTemplate = (i) => {
        const newTemplates = [...connector.client.conclusions].filter((temp, ind) => ind !== i)
        setConnector({
            ...connector, client: {
                ...connector.client,
                conclusions: newTemplates
            }
        })
    }

    //====================================================================
    //====================================================================

    const saveClient = async () => {
        try {
            const data = await request(
                `/api/doctor/conclusion/client/save`,
                "POST",
                {
                    client: { ...connector.client }
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: data.message,
                description: "",
                status: "error",
            });
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    const [temps, setTemps] = useState([])

    const getConclusionTemps = useCallback(
        async () => {
            try {
                const data = await request(
                    `/api/doctor/conclusion/template/get`,
                    "POST",
                    {
                        clinica: auth && auth.clinica._id
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setTemps([...data].map(item => ({
                    ...item,
                    value: item._id,
                    label: item.name
                })));
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

    useEffect(() => {
        getConclusionTemps()
    }, [getConclusionTemps])


    return (
        <>
            <div className="pt-2">
                <div className="w-[300px]">
                    <Select
                        options={temps}
                        onChange={e => {
                            const newTemp = connector.client.conclusions ? [...connector.client.conclusions, {
                                name: e.name,
                                template: e.template
                            }] : [{
                                name: e.name,
                                template: e.template
                            }]
                            setConnector({
                                ...connector, client: {
                                    ...connector.client,
                                    conclusions: newTemp
                                }
                            })
                        }}
                    />
                </div>
            </div>
            <div className="container w-[21cm]">
                <div className="flex justify-between items-center w-full mb-4">
                    <div className="text-[16px] font-bold">
                        Ўзбекистон Республикаси <br />
                        Соғлиқни сақлаш вазирлиги <br />
                        {connector?.clinica?.name}
                    </div>
                    <div className="text-[16px] font-bold">
                        Ўзбекистон Республикаси <br />
                        Соғлиқни сақлаш вазирининг <br />
                        2020 йил 31 декабрдаги   № 363-сонли <br />
                        буйруғи билан тасдиқланган <br />
                        003- рақамли тиббий хужжат шакли <br />
                    </div>
                </div>
                <h1 className="text-center mb-4 text-[18px] font-bold">ТИББИЙ БАЙОННОМАДАН КЎЧИРМА №: {connector?.client?.id}</h1>
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
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Mijozning F.I.SH
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    fontSize: "20px",
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                <h4>
                                    {connector?.client && connector.client.lastname + " " + connector.client.firstname}
                                </h4>
                            </td>
                            <td colSpan={2} style={{ width: "25%" }}>
                                <p className="fw-bold fs-5 m-0">
                                    {connector?.client?.department}
                                </p>
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Tug'ilgan yili
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client && new Date(connector.client.born).toLocaleDateString()}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Jinsi
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client?.gender === 'man' && 'Erkak'}
                                {connector?.client?.gender === 'women' && 'Ayol'}
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Kelgan sanasi
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector &&
                                    new Date(connector?.room?.beginday).toLocaleDateString()}
                            </td>
                            <td
                                className="p-0 fw-bold"
                                style={{
                                    width: "100px",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Ketgan vaqti
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
                                {connector?.room?.endday && new Date(connector?.room?.endday).toLocaleDateString()}
                            </td>
                        </tr>

                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Manzil
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector.client && connector.client.address}
                            </td>
                            <td
                                className="p-0 fw-bold"
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                ID
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector.client && connector.client.id}
                            </td>
                        </tr>
                    </table>
                </div>
                <div>
                    {connector.client?.conclusions && connector.client?.conclusions.map((t, i) =>
                        <div>
                            <div className="flex justify-between items-center py-2 px-4">
                                <div className="flex justify-between items-center">
                                    <FontAwesomeIcon
                                        onClick={() => handleDeleteTemplate(i)}
                                        icon={faTrash}
                                        style={{ cursor: "pointer", fontSize: '18px', color: 'red' }}
                                    />
                                </div>
                            </div>
                            <TextEditor
                                value={t.template}
                                onChange={(html, key) => {
                                    const newTemplates = [...connector.client.conclusions].map((temp, index) => {
                                        if (index === i) {
                                            temp.template = html
                                        }
                                        return temp;
                                    })
                                    setConnector({
                                        ...connector, client: {
                                            ...connector.client,
                                            conclusions: newTemplates
                                        }
                                    })
                                }}
                                index={i}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="container p-4 bg-white">
                <div className="row">
                    <div className="col-12 text-center my-4">
                        <button className="btn btn-success px-4 mx-4" onClick={saveClient} > Tasdiqlash</button>
                        <button className="btn btn-info px-5" onClick={handlePrint} >Chop etish</button>
                    </div>
                </div>
            </div>
            <div className="d-none">
                <div ref={componentRef} className="container w-[21cm]">
                    <div className="flex justify-between items-center w-full mb-4">
                        <div className="text-[16px] font-bold">
                            Ўзбекистон Республикаси <br />
                            Соғлиқни сақлаш вазирлиги <br />
                            {connector?.clinica?.name}
                        </div>
                        <div className="text-[16px] font-bold">
                            Ўзбекистон Республикаси <br />
                            Соғлиқни сақлаш вазирининг <br />
                            2020 йил 31 декабрдаги   № 363-сонли <br />
                            буйруғи билан тасдиқланган <br />
                            003- рақамли тиббий хужжат шакли <br />
                        </div>
                    </div>
                    <h1 className="text-center mb-4 text-[18px] font-bold">СТАЦИОНАР БЕМОРНИНГ ТИББИЙ КАРТАСИ №: {connector?.client?.id}</h1>
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
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Mijozning F.I.SH
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        fontSize: "20px",
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    <h4>
                                        {connector?.client && connector.client.lastname + " " + connector.client.firstname}
                                    </h4>
                                </td>
                                <td colSpan={2} style={{ width: "25%" }}>
                                    <p className="fw-bold fs-5 m-0">
                                        {connector?.client?.department}
                                    </p>
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Tug'ilgan yili
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector?.client && new Date(connector.client.born).toLocaleDateString()}
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Jinsi
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector?.client?.gender === 'man' && 'Erkak'}
                                    {connector?.client?.gender === 'women' && 'Ayol'}
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Kelgan sanasi
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector &&
                                        new Date(connector?.room?.beginday).toLocaleDateString()}
                                </td>
                                <td
                                    className="p-0 fw-bold"
                                    style={{
                                        width: "100px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Ketgan vaqti
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
                                    {connector?.room?.endday && new Date(connector?.room?.endday).toLocaleDateString()}
                                </td>
                            </tr>

                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Manzil
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector.client && connector.client.address}
                                </td>
                                <td
                                    className="p-0 fw-bold"
                                    style={{
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    ID
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector.client && connector.client.id}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="mb-4 mt-4 text-[16px]">
                        <p className="font-bold">1. <span className="mr-[20px]">Қон гурухи: {connector?.client?.bloodgroup}</span>  резус мансублиги: {connector?.client?.rezus}</p>
                        <p className="font-bold">2. Дориларнинг ножўя таЪсири: {connector?.client?.medicineresult}</p>
                        <p className="font-bold">3. <span className="mr-[30px]">Бўйи: {connector?.client?.height},</span> <span className="mr-[30px]">вазни: {connector?.client?.weight},</span> тана харорати: {connector?.client?.temperature}</p>
                        <p className="font-bold">4. Қариндошларнинг яшаш жойи ва телефон рақамлари: {connector?.client?.relative_info}</p>
                        <p className="font-bold">5. Иш жойи, касби, лавозими: {connector?.client?.profession_info}</p>
                        <p className="font-bold">6. Бемор қаердан юборилган: {connector?.client?.sending_info}</p>
                        <p className="font-bold">7. Касалхонага шошилинч равишда келтирилган: {connector?.client?.isAmbulance}</p>
                        <p className="font-bold">8. Қандай транспортда келтирилган: {connector?.client?.ambulance_transport}</p>
                        <p className="font-bold">9. Касаллик бошлангандан сўнг утган вақт, жарохатдан сўнг: {connector?.client?.start_sickness}</p>
                        <p className="font-bold">10. Бемор йўлланмасидаги ташҳис: {connector?.client?.conter_diagnosis}</p>
                        <p className="font-bold">11. Қабулхонада қуйилган ташҳис: {connector?.client?.diagnosis}</p>
                    </div>
                    <div className="print_word">
                        {connector.client?.conclusions && connector.client.conclusions.map(t => ReactHtmlParser(t.template))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConclusionPage;
import { useEffect, useRef, useState } from "react";
import ReactHtmlParser from 'react-html-parser'
import { useReactToPrint } from "react-to-print";
import QRcode from "../../../../../qrcode.png"

const DoctorResult = ({ connector, clinica, baseUrl }) => {

    const [doctorServices, setDoctorServices] = useState([])
    const [labServices, setLabServices] = useState([])
    console.log(labServices);
    useEffect(() => {
        setDoctorServices([...connector.services].filter(service => service.department.probirka == false));
        const serviceTypes = []
        const serviceIdArr = []
        for (const service of connector.services) {
            if (service.department.probirka) {
                const check = service.serviceid.servicetype._id
                if (!serviceIdArr.includes(check)) {
                    serviceTypes.push({
                        servicetypeid: check,
                        servicetypename: service.serviceid.servicetype.name,
                        services: [service],
                        column: service.column
                    })
                    serviceIdArr.push(check);
                } else {
                    const checkCols = Object.keys(service?.column).filter(el => el.includes('col')).length;
                    const index = serviceTypes.findIndex(el =>
                        el.servicetypeid === check
                        && Object.keys(el?.column).filter(el => el.includes('col')).length === checkCols)
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
                }
            }
        }
        setLabServices([...serviceTypes].map(section =>
            ({ ...section, services: section.services })).filter(el => el.services.length > 0))
    }, [connector]);
    const getWidth = (table) => {
        if (table.col5) {
            return `${1280 / 5}px`
        }
        if (!table.col5 && table.col4) {
            return `${1280 / 4}px`
        }
        if (table.col3 && !table.col4) {
            return `${1280 / 3}px`
        }
    }

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    return (
        <>
            <div className="container p-4">
                {clinica?.ifud1 && <div className="row" style={{ marginTop: '10px', fontSize: "10pt" }}>
                    <div
                        className="col-4"
                        style={{ border: "1px solid", textAlign: "center" }}
                    >
                        <p className="pt-2">
                            {clinica?.ifud1}
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
                        <p className="pt-2">IFUD: {clinica?.ifud2}</p>
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
                            {clinica?.ifud3}
                        </p>
                    </div>
                </div>}
                <div className="flex justify-between items-center" style={{ fontSize: "20pt", marginBottom: "30px" }}>
                    <div className="" style={{ textAlign: "center" }}>
                        <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
                            {clinica?.name}
                        </pre>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <img style={{ width: "150px" }} src={baseUrl + '/api/upload/file/' + clinica?.image} alt="logo" />
                    </div>
                    <div className="" style={{ textAlign: "center" }}>
                        <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
                            {clinica?.name2}
                        </pre>
                    </div>
                    <div className="" style={{ textAlign: "center" }}>
                        <p className="text-end m-0">
                            <img width="100" src={QRcode} alt="QR" />
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className="" style={{ padding: "0" }}>
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
                                    <h4 className='text-[20px]'>
                                        {connector?.client && connector?.client.lastname + " " + connector?.client.firstname}
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
                                    {connector?.client && new Date(connector?.client.born).toLocaleDateString()}
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
                                    {connector?.client && connector?.client.address}
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
                                    {connector?.client && connector?.client?.id}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
                    <span className="text-[14px] font-bold">{clinica?.organitionName}</span>
                    <span className="text-[14px] font-bold">{clinica?.license}</span>
                </div>
                <div className="row pt-2 w-full">
                    {doctorServices.length > 0 &&
                        doctorServices.map((section, index) => (
                            <div key={index} className={"w-full"}>
                                {section.templates && section.templates.length > 0 &&
                                    section.templates.map((template, index) => (
                                        <div>
                                            <h2 className="block text-[24px] font-bold">
                                                {template?.name}
                                            </h2>
                                            <div
                                                key={index}
                                                className="w-full text-[16px] mb-2 print_word"
                                            >

                                                {ReactHtmlParser(template.template)}

                                            </div>
                                        </div>
                                    ))}
                                <div>
                                    <div className="mt-1">
                                        {section.files && section.files.length > 0 && section.files.map((file) => <div className="w-full">
                                            <img src={file} alt='file' />
                                        </div>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="pt-2 w-full text-center">
                    {labServices.length > 0 &&
                        labServices.map((section, index) => (
                            <div key={index} className={"w-full text-center mb-1"}>
                                <div className="w-full flex justify-center items-center mb-1">
                                    <h2 className="block text-[18px] font-bold">
                                        {section?.servicetypename}
                                    </h2>
                                </div>
                                <table className="w-full text-center">
                                    <thead>
                                        <tr>
                                            <th className="border-[1px] border-black bg-gray-400 text-[16px] px-[12px] py-1 text-center">{section?.column?.col1}</th>
                                            {section?.column?.col2 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col2}</th>}
                                            {section?.column?.col3 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col3}</th>}
                                            {section?.column?.col4 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col4}</th>}
                                            {section?.column?.col5 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col5}</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section?.services.map((service, ind) => {
                                            return service.tables.map((table, key) => (
                                                <tr key={key} >
                                                    <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}> <pre
                                                        style={{ fontFamily: "sans-serif" }}
                                                        className="border-none outline-none text-left"
                                                    >
                                                        {table?.col1}
                                                    </pre> </td>
                                                    <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                        <pre
                                                            style={{ fontFamily: "sans-serif" }}
                                                            className="border-none outline-none"
                                                        >
                                                            {table?.col2}
                                                        </pre>
                                                    </td>
                                                    <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                        <pre
                                                            style={{ fontFamily: "sans-serif" }}
                                                            className="border-none outline-none"
                                                        >
                                                            {table?.col3}
                                                        </pre>
                                                    </td>
                                                    {section?.column?.col4 && <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                        <pre
                                                            style={{ fontFamily: "sans-serif" }}
                                                            className="border-none outline-none"
                                                        >
                                                            {table?.col4}
                                                        </pre></td>}
                                                    {section?.column?.col5 && <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                        <pre
                                                            style={{ fontFamily: "sans-serif" }}
                                                            className="border-none outline-none"
                                                        >
                                                            {table?.col5}
                                                        </pre></td>}
                                                </tr>
                                            ))
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    {labServices.map((section => <div className='py-[20px]'>
                        <div className="">
                            {section.services.map(service => service.files && service.files.map((file) => <div className="w-[400px]">
                                <img src={file} alt='file' />
                            </div>))}
                        </div>
                    </div>))}
                </div>
            </div>
            <div  className="d-none">
                <div ref={componentRef} className="container w-[21cm]">
                    {clinica?.ifud1 && <div className="row" style={{ marginTop: '10px', fontSize: "10pt" }}>
                        <div
                            className="col-4"
                            style={{ border: "1px solid", textAlign: "center" }}
                        >
                            <p className="pt-2">
                                {clinica?.ifud1}
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
                            <p className="pt-2">IFUD: {clinica?.ifud2}</p>
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
                                {clinica?.ifud3}
                            </p>
                        </div>
                    </div>}
                    <div className="flex justify-between items-center" style={{ fontSize: "20pt", marginBottom: "30px" }}>
                        <div className="" style={{ textAlign: "center" }}>
                            <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
                                {clinica?.name}
                            </pre>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <img style={{ width: "150px" }} src={baseUrl + '/api/upload/file/' + clinica?.image} alt="logo" />
                        </div>
                        <div className="" style={{ textAlign: "center" }}>
                            <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
                                {clinica?.name2}
                            </pre>
                        </div>
                        <div className="" style={{ textAlign: "center" }}>
                            <p className="text-end m-0">
                                <img width="100" src={QRcode} alt="QR" />
                            </p>
                        </div>
                    </div>
                    <div className="">
                        <div className="" style={{ padding: "0" }}>
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
                                        <h4 className='text-[20px]'>
                                            {connector?.client && connector?.client.lastname + " " + connector?.client.firstname}
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
                                        {connector?.client && new Date(connector?.client.born).toLocaleDateString()}
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
                                        {connector?.client && connector?.client.address}
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
                                        {connector?.client && connector?.client?.id}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
                        <span className="text-[14px] font-bold">{clinica?.organitionName}</span>
                        <span className="text-[14px] font-bold">{clinica?.license}</span>
                    </div>
                    <div className="row pt-2 w-full">
                        {doctorServices.length > 0 &&
                            doctorServices.map((section, index) => (
                                <div key={index} className={"w-full"}>
                                    {section.templates && section.templates.length > 0 &&
                                        section.templates.map((template, index) => (
                                            <div>
                                                <h2 className="block text-[24px] font-bold">
                                                    {template?.name}
                                                </h2>
                                                <div
                                                    key={index}
                                                    className="w-full text-[16px] mb-2 print_word"
                                                >

                                                    {ReactHtmlParser(template.template)}

                                                </div>
                                            </div>
                                        ))}
                                    <div>
                                        <div className="mt-1">
                                            {section.files && section.files.length > 0 && section.files.map((file) => <div className="w-full">
                                                <img src={file} alt='file' />
                                            </div>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="pt-2 w-full text-center">
                        {labServices.length > 0 &&
                            labServices.map((section, index) => (
                                <div key={index} className={"w-full text-center mb-1"}>
                                    <div className="w-full flex justify-center items-center mb-1">
                                        <h2 className="block text-[18px] font-bold">
                                            {section?.servicetypename}
                                        </h2>
                                    </div>
                                    <table className="w-full text-center">
                                        <thead>
                                            <tr>
                                                <th className="border-[1px] border-black bg-gray-400 text-[16px] px-[12px] py-1 text-center">{section?.column?.col1}</th>
                                                {section?.column?.col2 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col2}</th>}
                                                {section?.column?.col3 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col3}</th>}
                                                {section?.column?.col4 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col4}</th>}
                                                {section?.column?.col5 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col5}</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section?.services.map((service, ind) => {
                                                return service.tables.map((table, key) => (
                                                    <tr key={key} >
                                                        <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}> <pre
                                                            style={{ fontFamily: "sans-serif" }}
                                                            className="border-none outline-none text-left"
                                                        >
                                                            {table?.col1}
                                                        </pre> </td>
                                                        <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                            <pre
                                                                style={{ fontFamily: "sans-serif" }}
                                                                className="border-none outline-none"
                                                            >
                                                                {table?.col2}
                                                            </pre>
                                                        </td>
                                                        <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                            <pre
                                                                style={{ fontFamily: "sans-serif" }}
                                                                className="border-none outline-none"
                                                            >
                                                                {table?.col3}
                                                            </pre>
                                                        </td>
                                                        {section?.column?.col4 && <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                            <pre
                                                                style={{ fontFamily: "sans-serif" }}
                                                                className="border-none outline-none"
                                                            >
                                                                {table?.col4}
                                                            </pre></td>}
                                                        {section?.column?.col5 && <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                            <pre
                                                                style={{ fontFamily: "sans-serif" }}
                                                                className="border-none outline-none"
                                                            >
                                                                {table?.col5}
                                                            </pre></td>}
                                                    </tr>
                                                ))
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        {labServices.map((section => <div className='py-[20px]'>
                            <div className="">
                                {section.services.map(service => service.files && service.files.map((file) => <div className="w-[400px]">
                                    <img src={file} alt='file' />
                                </div>))}
                            </div>
                        </div>))}
                    </div>
                </div>
            </div>
            <div className="container p-4 bg-white">
                <div className="row">
                    <div className="col-12 text-center my-4">
                        <button className="btn btn-success px-4 mx-4"  > Tasdiqlash</button>
                        <button className="btn btn-info px-5" onClick={handlePrint} >Chop etish</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DoctorResult;
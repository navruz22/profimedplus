import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import QRcode from "../../../../qrcode.png"

const Print = ({ client, connector, sections, baseUrl, clinica }) => {

    const location = useLocation()

    const [printSections, setPrintSections] = useState([])

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

    useEffect(() => {
        if (location.pathname.includes('alo24/adoption')) {
            setPrintSections([...sections].map(section =>
                ({ ...section, services: section.services.filter(s => s.accept) })).filter(el => el.services.length > 0))
        } else {
            const serviceTypes = []
            const serviceIdArr = []
            for (const service of sections) {
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
                    const checkCols = Object.keys(service.column).filter(el => el.includes('col')).length;
                    const index = serviceTypes.findIndex(el =>
                        el.servicetypeid === check
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
                }
            }
            setPrintSections([...serviceTypes].map(section =>
                ({ ...section, services: section.services.filter(s => s.accept) })).filter(el => el.services.length > 0))
        }
    }, [sections, location])


    return (
        <div className="px-2 bg-white">
            <div>
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
                <div className="flex justify-between items-center" style={{ fontSize: "20pt", marginBottom: "30px" }}>
                    <div>
                        <pre className="text-center border-none outline-none" style={{ fontFamily: "-moz-initial" }}>
                            {clinica?.name}
                        </pre>
                    </div>
                    <div style={{ maxWidth: "150px", marginRight: "60px", textAlign: "center" }}>
                        <img src={baseUrl + '/api/upload/file/' + clinica?.image} alt="logo" />
                    </div>
                    <div className="" style={{ textAlign: "center" }}>
                        <p className="text-end m-0">
                            <img width="120" src={QRcode} alt="QR" />
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
            </div>
            <div className="pt-4 w-full text-center">
                {printSections.length > 0 &&
                    printSections.map((section, index) => (
                        <div key={index} className={"w-full text-center mb-4"}>
                            <div className="w-full flex justify-center items-center mb-4">
                                <h2 className="block text-[18px] font-bold">
                                    {section?.servicetypename}
                                </h2>
                            </div>
                            <table className="w-full text-center">
                                <thead>
                                    <tr>
                                        <th className="border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col1}</th>
                                        {section?.column?.col2 && <th className="border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col2}</th>}
                                        {section?.column?.col3 && <th className="border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col3}</th>}
                                        {section?.column?.col4 && <th className="border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col4}</th>}
                                        {section?.column?.col5 && <th className="border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col5}</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {section?.services.map((service, ind) => {
                                        return service.accept && service.tables.map((table, key) => (
                                            <tr key={key} >
                                                <td className={`border-[1px] border-black py-1 px-[12px]`}> <pre
                                                    style={{ width: getWidth(table) }}
                                                    className="border-none outline-none text-left"
                                                >
                                                    {table?.col1}
                                                </pre> </td>
                                                <td className={`border-[1px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ width: getWidth(table) }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col2}
                                                    </pre>
                                                </td>
                                                <td className={`border-[1px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ width: getWidth(table) }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col3}
                                                    </pre>
                                                </td>
                                                {table?.col4 && <td className={`border-[1px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ width: getWidth(table) }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col4}
                                                    </pre></td>}
                                                {table?.col5 && <td className={`border-[1px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ width: getWidth(table) }}
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
                {printSections.map((section => <div className='py-[20px]'>
                    <div className="">
                        {section.services.map(service => service.files.map((file) => <div className="w-[400px]">
                            <img src={file} alt='file' />
                        </div>))}
                    </div>
                </div>))}
            </div>
        </div>
    )
}

export default Print
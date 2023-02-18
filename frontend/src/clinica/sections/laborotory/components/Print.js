import React, { useEffect, useState } from 'react'

const Print = ({ client, connector, sections }) => {

    const [printSections, setPrintSections] = useState([])
    console.log(sections);
    useEffect(() => {
        setPrintSections([...sections].map(section =>
            ({ ...section, services: section.services.filter(s => s.accept) })).filter(el => el.services.length > 0))
    }, [sections])

    return (
        <div className="px-2 bg-white">
            <div>
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
                {printSections.length > 0 &&
                    printSections.map((section, index) => (
                        <div key={index} className={"w-full"}>
                            <div className="w-full flex justify-center items-center mb-4">
                                <h2 className="block text-[18px] font-bold">
                                    {section?.servicetypename}
                                </h2>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="border border-black px-[10px] py-1 text-center">{section?.column?.col1}</th>
                                        {section.column.col2 && <th className="border border-black px-[10px] py-1 text-center">{section?.column?.col2}</th>}
                                        {section.column.col3 && <th className="border border-black px-[10px] py-1 text-center">{section?.column?.col3}</th>}
                                        {section.column.col4 && <th className="border border-black px-[10px] py-1 text-center">{section?.column?.col4}</th>}
                                        {section.column.col5 && <th className="border border-black px-[10px] py-1 text-center">{section?.column?.col5}</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {section?.services.map((service, ind) => {
                                        return service.accept && service.tables.map((table, key) => (
                                            <tr key={key} >
                                                <td className="border border-black p-[10px]"> <pre
                                                    className="border-none outline-none"
                                                >
                                                    {table?.col1}
                                                </pre> </td>
                                                <td className="border border-black p-[10px]">
                                                    <pre
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col2}
                                                    </pre>
                                                </td>
                                                <td className="border border-black p-[10px]">
                                                    <pre
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col3}
                                                    </pre>
                                                </td>
                                                {table?.col4 && <td className="border border-black p-[10px]">
                                                    <pre
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col4}
                                                    </pre></td>}
                                                {table?.col5 && <td className="border border-black p-[10px]">
                                                    <pre
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col5}
                                                    </pre></td>}
                                            </tr>
                                        ))
                                    })}
                                </tbody>
                            </table>
                            {/* <div>
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
                </div> */}
                        </div>
                    ))}
            </div>
        </div>

    );
}

export default Print
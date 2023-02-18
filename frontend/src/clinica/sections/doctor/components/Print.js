import React from 'react'

const Print = ({ client, connector, sections, clinica }) => {
    console.log(clinica);
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
                <div className="flex justify-around" style={{ fontSize: "20pt" }}>
                    <div className="" style={{ textAlign: "center" }}>
                        <p className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                            {clinica.name}
                        </p>
                    </div>
                    <div className="" style={{ textAlign: "center" }}>
                        <img src={clinica?.image} alt="logo" />
                    </div>
                    <div className="" style={{ textAlign: "center" }}>
                        <p className="text-end m-0">
                            <img width="120" src={'https://chart.googleapis.com/chart?cht=qr&chl=%2B998992234244&chs=180x180&choe=UTF-8&chld=L|2'} alt="QR" />
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
                            <div className="w-full flex justify-center items-center mb-2">
                                <h2 className="block text-[24px] font-bold">
                                    {section?.service?.name}
                                </h2>
                            </div>
                            {section.templates.length > 0 &&
                                section.templates.map((template, index) => (
                                    <div
                                        key={index}
                                        className="w-full mb-2"
                                    >
                                        <pre
                                            className='border-none font-semibold text-[18px]'
                                        >
                                            {template?.template}
                                        </pre>
                                    </div>
                                ))}
                            <div>
                                <div className="mt-2">
                                    {section.files.map((file) => <div className="w-full">
                                        <img src={file} alt='file' />
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>

    );
}

export default Print
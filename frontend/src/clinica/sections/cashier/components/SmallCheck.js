import { useEffect, useState } from "react";


export const SmallCheck = ({ baseUrl, clinica, connector, qr, user }) => {
    console.log(connector);

    const [departments, setDeparmtents] = useState([])

    useEffect(() => {
        if (connector && connector.services && connector.services.length > 0) {
            let all = []
            for (const service of connector?.services) {
                let isExist = [...all].findIndex(item => item?.department === service?.department?._id)
                if (isExist >= 0) {
                    all[isExist].turn = service.turn;
                } else {
                    all.push({
                        department: service?.department?._id,
                        name: service?.department?.name,
                        turn: service?.turn,
                        room: service?.department?.room
                    })
                }
            }
            setDeparmtents(all)
        }
    }, [connector])

    return (

        <div>
            <div className='w-full text-center mb-4'>
                <img
                    className='mx-auto'
                    style={{ width: "150px" }}
                    src={baseUrl + '/api/upload/file/' + clinica?.image}
                    alt="logo"
                />
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                        Manzil:{' '}
                    </strong>
                </div>
                <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                    {clinica && clinica.address}
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                        Telefon raqam:{' '}
                    </strong>
                </div>
                <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                    {clinica?.phone1}
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                        Sana:{' '}
                    </strong>
                </div>
                <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                    {connector &&
                        new Date(connector.createdAt).toLocaleDateString() +
                        ' ' +
                        new Date(connector.createdAt).toLocaleTimeString()}
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                        Mijoz:{' '}
                    </strong>
                </div>
                <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                    {connector.client && connector.client.lastname} {connector.client && connector.client.firstname}
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                        ID:{' '}
                    </strong>
                </div>
                <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                    {connector.client && connector.client.id}
                </div>
            </div>
            {connector.probirka && <div className="flex justify-between items-center">
                <div>
                    <strong style={{ color: "black", fontSize: '30px', fontFamily: 'times' }}>
                        Namuna:{' '}
                    </strong>
                </div>
                <div style={{ fontWeight: "bold", color: "black", fontSize: '30px', fontFamily: 'times' }}>
                    {connector.probirka && connector.probirka}
                </div>
            </div>}
            <table className="w-full py-2">
                <thead className="">
                    <tr>
                        <th className="border border-black-800 text-[20px] text-center w-[33%] font-bold">Bo'lim</th>
                        <th className="border border-black-800 text-[20px] text-center w-[33%] font-bold">Navbat</th>
                        <th className="border border-black-800 text-[20px] text-center w-[33%] font-bold">Xona</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((d, ind) => (
                        <tr key={ind}>
                            <td className="border border-black-800 text-[20px] text-center font-bold">{d?.name}</td>
                            <td className="border border-black-800 text-[20px] text-center font-bold">{d?.turn}</td>
                            <td className="border border-black-800 text-[20px] text-center font-bold">{d?.room}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                {connector.services &&
                    connector.services.map((service, index) => (
                        <div className="mb-1">
                            <div className="text-left text-[20px] font-bold">
                                {index + 1} {service.service.name}
                            </div>
                            <div className="text-right text-[20px] font-bold">
                                {service.pieces} * {service.service.price} = {service.service.price * service.pieces}
                            </div>
                        </div>
                    ))}
            </div>
            <div className="border-2 border-black-800">
                <div
                    className="p-1 mt-2 flex justify-between items-center text-[24px] font-bold"
                >
                    <div>Jami:</div>
                    <div>
                        {connector.products &&
                            connector.services &&
                            connector.services.reduce((summ, service) => {
                                return (
                                    summ +
                                    (service.refuse === false ? service.service.price * parseInt(service.pieces) : 0)
                                )
                            }, 0) +
                            connector.products.reduce((summ, product) => {
                                return (
                                    summ +
                                    product.product.price * parseInt(product.pieces)
                                )
                            }, 0)}
                    </div>
                </div>
                <div className=" p-1 mt-2 flex justify-between items-center text-[24px] font-bold">
                    <div>Chegirma:</div>
                    <div>{connector?.discount?.discount || 0}</div>
                </div>
                <div className="p-1 mt-2 flex justify-between items-center text-[24px] font-bold">
                    <div>Qaytarilgan:</div>
                    <div>{connector && connector.services && connector.products && (connector.services.reduce((prev, el) => prev + (el.refuse && el.service.price || 0), 0) + connector.products.reduce((prev, el) => prev + (el.refuse && el.product.price || 0), 0))}</div>
                </div>
                <div className="p-1 mt-2 flex justify-between items-center text-[24px] font-bold">
                    <div>Qarz:</div>
                    <div>{connector && connector.payments && connector.payments.reduce((prev, el) => prev + el.debt, 0) || 0}</div>
                </div>
                <div className="p-1 mt-2 flex justify-between items-center text-[24px] font-bold">
                    <div>To'langan:</div>
                    <div>{connector && connector.payments && connector.payments.reduce((prev, el) => prev + el.payment, 0) || 0}</div>
                </div>
            </div>
            <div className="mt-4" style={{ fontWeight: "bold", color: "black", fontSize: '24px', fontFamily: 'times' }}>
                {user?.firstname + ' ' + user?.lastname}
            </div>
            <div className="mt-4 w-full flex justify-center">
                <img width="150" src={qr && qr} alt="QR" />
            </div>
            <div className="w-full h-[5px] mt-[5cm] border-2 border-[#000]">
            </div>
        </div>

    )
}

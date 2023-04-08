

export const SmallCheck = ({ baseUrl, clinica, connector, qr }) => {
    return (
        
            <div>
                <div className='w-full text-center mb-4'>
                    <img
                        className='mx-auto'
                        style={{ width: "100px" }}
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
                        <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                            Namuna:{' '}
                        </strong>
                    </div>
                    <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                        {connector.probirka && connector.probirka}
                    </div>
                </div>}
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
                <div
                    className="border-2 border-black-800 p-1 mt-2 flex justify-between items-center text-[24px] font-bold"
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
            </div>
       
    )
}

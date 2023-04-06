import React from 'react'

export const Check = ({ baseUrl, clinica, connector, qr }) => {

  return (
    <div>
      <div className="container px-5">
        <div className="row">
          <table className="table ">
            <tbody>
              <tr>
                <td>
                  <ul className="list-unstyled  text-start ml-3 mb-0">
                    <li className='flex items-center mb-2' style={{ fontSize: '11pt', fontFamily: 'times' }}>
                      <div className='mr-2'>
                        <strong style={{ color: "black", fontSize: '11pt', fontFamily: 'times' }}>
                          Manzil:{' '}
                        </strong>
                      </div>
                      <div style={{color: "black"}}>
                        {clinica && clinica.address}
                      </div>
                    </li>
                    <li className='flex items-center' style={{ textAlign: '', fontSize: '11pt' }}>
                      <div className='mr-2'>
                        <strong style={{ color: "black", fontSize: '11pt', fontFamily: 'times' }}>
                          Telefon raqam:{' '}
                        </strong>
                      </div>
                      <div style={{color: "black"}}> 
                        {clinica?.phone1}
                      </div>
                    </li>
                    <li style={{ color: "black", textAlign: '', fontSize: '11pt' }}>
                      {connector.probirka && connector.probirka ? (
                        <h6
                          className="d-inline-block"
                          style={{ fontSize: '27pt', fontFamily: 'times' }}
                        >
                          NAMUNA: {connector.probirka}
                        </h6>
                      ) : (
                        ''
                      )}
                      <div className="ml-3 fs-5 mt-4">
                        {connector &&
                          new Date(connector.createdAt).toLocaleDateString() +
                          ' ' +
                          new Date(connector.createdAt).toLocaleTimeString()}
                      </div>
                    </li>
                  </ul>
                </td>
                <td className="text-center" style={{ transform: "translateX(-100px)" }}>
                  <div className='w-full text-center'>
                    <img
                      className='mx-auto'
                      width="200"
                      src={baseUrl + '/api/upload/file/' + clinica?.image}
                      alt="logo"
                    />
                  </div>
                </td>
                <td className="text-right">
                  <img
                    width="140"
                    className="mr-3 d-inline "
                    src={qr && qr}
                    alt="QR"
                  />
                  <br />
                  <p className="pr-3 mr-1 mb-0 " style={{ fontSize: '11pt' }}>
                    Bu yerni skanerlang
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="invoice-from ps-4">
              <h6
                className="d-inline-block"
                style={{
                  textTransform: 'uppercase',
                  fontFamily: 'times',
                  fontSize: '20px',
                }}
              >
                ID: {connector.client && connector.client.id}
              </h6>
            </div>
          </div>
          <div className="col-4">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: '20px', fontFamily: 'times' }}
              >
                F.I.O: {connector.client && connector.client.lastname}{' '}
                {connector.client && connector.client.firstname}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: '20px', fontFamily: 'times' }}
              >
                Yil:{' '}
                {new Date(
                  connector.client && connector.client.born,
                ).toLocaleDateString()}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-right pr-4">
              <h6
                className="d-inline-block"
                style={{ fontSize: '20px', fontFamily: 'times' }}
              >
                Tel: +998{connector.client && connector.client.phone}
              </h6>
            </div>
          </div>

          <div className="col-lg-12">
            <div
              className="table-responsive"
              style={{ overflow: 'hidden', outline: 'none' }}
            >
              <table
                className="table table-bordered text-dark mt-2"
                style={{ fontSize: '18px', fontFamily: 'times' }}
              >
                <thead className="text-dark">
                  <tr className="bg-white">
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      №
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      Bo'lim
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      Navbat
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      Soni
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      Summasi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connector.services &&
                    connector.services.map((service, index) => {
                      if (service.refuse === false) {
                        return (
                          <tr
                            key={index}
                            className="bg-white"
                            style={{ fontFamily: 'times', fontSize: '18px' }}
                          >
                            <td className="py-0 border text-right font-weight-bold">
                              {index + 1}
                            </td>
                            <td className="py-0 border pl-2 font-weight-bold">
                              {service.service.name}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.turn}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.pieces}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.service.price * service.pieces}
                            </td>
                          </tr>
                        )
                      }
                    })}
                  {connector.products &&
                    connector.products.map((product, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {product.product.name}
                          </td>
                          <td className="py-0 border pl-2 text-right"></td>
                          <td className="py-0 border pl-2 text-right">
                            {product.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {product.product.price * product.pieces}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
              {(connector.services && connector.services.some(s => s.refuse) || connector.products && connector.products.some(p => p.refuse)) &&
                <h2 className='text-[21px] font-bold mt-4 mb-2'>Qaytarilgan</h2>}
              {(connector.services && connector.services.some(s => s.refuse) || connector.products && connector.products.some(p => p.refuse)) && <table
                className="table table-bordered text-dark mt-2"
                style={{ fontSize: '11pt', fontFamily: 'times' }}
              >
                <thead className="text-dark">
                  <tr className="bg-white">
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      №
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Bo'lim
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Navbat
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Soni
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Summasi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connector.services &&
                    connector.services.map((service, index) => {
                      return service.refuse && (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {service.service.name}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.turn}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.service.price * service.pieces}
                          </td>
                        </tr>
                      )
                    })}
                  {connector.products &&
                    connector.products.map((product, index) => {
                      return product.refuse && (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {product.product.name}
                          </td>
                          <td className="py-0 border pl-2 text-right"></td>
                          <td className="py-0 border pl-2 text-right">
                            {product.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {product.product.price * product.pieces}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>}
              <div className='my-4 flex justify-between items-center'>
                <div
                  className="text-right text-[16px] font-weight-bold"
                >
                  Jami: {' '}
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
                <div className="text-right text-[16px] font-weight-bold">
                  Chegirma: {connector?.discount?.discount || 0}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  Qaytarilgan: {connector && connector.services && connector.products && (connector.services.reduce((prev, el) => prev + (el.refuse && el.service.price || 0), 0) + connector.products.reduce((prev, el) => prev + (el.refuse && el.product.price || 0), 0))}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  Qarz: {connector && connector.payments && connector.payments.reduce((prev, el) => prev + el.debt, 0) || 0}
                </div>
                <div colSpan={2} className="text-right text-[16px] font-weight-bold">
                  To'langan: {connector && connector.payments && connector.payments.reduce((prev, el) => prev + el.payment, 0) || 0}
                </div>
              </div>
              <div className=" fs-5" style={{ fontFamily: 'Times' }}>
                Mijoz imzosi: ________________
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ border: '2px dashed black', margin: '50px 0' }}></div>
      <div className="container px-5">
        <div className="row">
          <table className="table ">
            <tbody>
              <tr>
                <td>
                  <ul className="list-unstyled  text-start ml-3 mb-0">
                    <li className='flex items-center mb-2' style={{ fontSize: '11pt', fontFamily: 'times' }}>
                      <div className='mr-2'>
                        <strong style={{ color: "black", fontSize: '11pt', fontFamily: 'times' }}>
                          Manzil:{' '}
                        </strong>
                      </div>
                      <div style={{color: "black"}}>
                        {clinica && clinica.address}
                      </div>
                    </li>
                    <li className='flex items-center' style={{ textAlign: '', fontSize: '11pt' }}>
                      <div className='mr-2'>
                        <strong style={{ color: "black", fontSize: '11pt', fontFamily: 'times' }}>
                          Telefon raqam:{' '}
                        </strong>
                      </div>
                      <div style={{color: "black"}}> 
                        {clinica?.phone1}
                      </div>
                    </li>
                    <li style={{ color: "black", textAlign: '', fontSize: '11pt' }}>
                      {connector.probirka && connector.probirka ? (
                        <h6
                          className="d-inline-block"
                          style={{ fontSize: '27pt', fontFamily: 'times' }}
                        >
                          NAMUNA: {connector.probirka}
                        </h6>
                      ) : (
                        ''
                      )}
                      <div className="ml-3 fs-5 mt-4">
                        {connector &&
                          new Date(connector.createdAt).toLocaleDateString() +
                          ' ' +
                          new Date(connector.createdAt).toLocaleTimeString()}
                      </div>
                    </li>
                  </ul>
                </td>
                <td className="text-center" style={{ transform: "translateX(-100px)" }}>
                  <div className='w-full text-center'>
                    <img
                      className='mx-auto'
                      width="200"
                      src={baseUrl + '/api/upload/file/' + clinica?.image}
                      alt="logo"
                    />
                  </div>
                </td>
                <td className="text-right">
                  <img
                    width="140"
                    className="mr-3 d-inline "
                    src={qr && qr}
                    alt="QR"
                  />
                  <br />
                  <p className="pr-3 mr-1 mb-0 " style={{ fontSize: '11pt' }}>
                    Bu yerni skanerlang
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="invoice-from ps-4">
              <h6
                className="d-inline-block"
                style={{
                  textTransform: 'uppercase',
                  fontFamily: 'times',
                  fontSize: '20px',
                }}
              >
                ID: {connector.client && connector.client.id}
              </h6>
            </div>
          </div>
          <div className="col-4">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: '20px', fontFamily: 'times' }}
              >
                F.I.O: {connector.client && connector.client.lastname}{' '}
                {connector.client && connector.client.firstname}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: '20px', fontFamily: 'times' }}
              >
                Yil:{' '}
                {new Date(
                  connector.client && connector.client.born,
                ).toLocaleDateString()}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-right pr-4">
              <h6
                className="d-inline-block"
                style={{ fontSize: '20px', fontFamily: 'times' }}
              >
                Tel: +998{connector.client && connector.client.phone}
              </h6>
            </div>
          </div>

          <div className="col-lg-12">
            <div
              className="table-responsive"
              style={{ overflow: 'hidden', outline: 'none' }}
            >
              <table
                className="table table-bordered text-dark mt-2"
                style={{ fontSize: '18px', fontFamily: 'times' }}
              >
                <thead className="text-dark">
                  <tr className="bg-white">
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      №
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      Bo'lim
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      Navbat
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      Soni
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '18px', fontFamily: 'times' }}
                    >
                      Summasi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connector.services &&
                    connector.services.map((service, index) => {
                      if (service.refuse === false) {
                        return (
                          <tr
                            key={index}
                            className="bg-white"
                            style={{ fontFamily: 'times', fontSize: '18px' }}
                          >
                            <td className="py-0 border text-right font-weight-bold">
                              {index + 1}
                            </td>
                            <td className="py-0 border pl-2 font-weight-bold">
                              {service.service.name}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.turn}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.pieces}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.service.price * service.pieces}
                            </td>
                          </tr>
                        )
                      }
                    })}
                  {connector.products &&
                    connector.products.map((product, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {product.product.name}
                          </td>
                          <td className="py-0 border pl-2 text-right"></td>
                          <td className="py-0 border pl-2 text-right">
                            {product.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {product.product.price * product.pieces}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
              {(connector.services && connector.services.some(s => s.refuse) || connector.products && connector.products.some(p => p.refuse)) &&
                <h2 className='text-[21px] font-bold mt-4 mb-2'>Qaytarilgan</h2>}
              {(connector.services && connector.services.some(s => s.refuse) || connector.products && connector.products.some(p => p.refuse)) && <table
                className="table table-bordered text-dark mt-2"
                style={{ fontSize: '11pt', fontFamily: 'times' }}
              >
                <thead className="text-dark">
                  <tr className="bg-white">
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      №
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Bo'lim
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Navbat
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Soni
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: '11pt', fontFamily: 'times' }}
                    >
                      Summasi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connector.services &&
                    connector.services.map((service, index) => {
                      return service.refuse && (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {service.service.name}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.turn}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {service.service.price * service.pieces}
                          </td>
                        </tr>
                      )
                    })}
                  {connector.products &&
                    connector.products.map((product, index) => {
                      return product.refuse && (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: 'times', fontSize: '12pt' }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {product.product.name}
                          </td>
                          <td className="py-0 border pl-2 text-right"></td>
                          <td className="py-0 border pl-2 text-right">
                            {product.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {product.product.price * product.pieces}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>}
              <div className='my-4 flex justify-between items-center'>
                <div
                  className="text-right text-[16px] font-weight-bold"
                >
                  Jami: {' '}
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
                <div className="text-right text-[16px] font-weight-bold">
                  Chegirma: {connector?.discount?.discount || 0}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  Qaytarilgan: {connector && connector.services && connector.products && (connector.services.reduce((prev, el) => prev + (el.refuse && el.service.price || 0), 0) + connector.products.reduce((prev, el) => prev + (el.refuse && el.product.price || 0), 0))}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  Qarz: {connector && connector.payments && connector.payments.reduce((prev, el) => prev + el.debt, 0) || 0}
                </div>
                <div colSpan={2} className="text-right text-[16px] font-weight-bold">
                  To'langan: {connector && connector.payments && connector.payments.reduce((prev, el) => prev + el.payment, 0) || 0}
                </div>
              </div>
              <div className=" fs-5" style={{ fontFamily: 'Times' }}>
                Mijoz imzosi: ________________
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

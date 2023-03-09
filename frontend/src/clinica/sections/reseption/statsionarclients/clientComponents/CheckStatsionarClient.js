import React from "react";

const CheckStatsionarClient = ({ connector, qr }) => {
  return (
    <div className="container p-3">
      <div className="row">
        <table className="table ">
          <tbody>
            <tr>
              <td>
                <ul className="list-unstyled  text-left m-3">
                  <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                    <b
                      style={{
                        fontSize: "10pt",
                        fontFamily: "times",
                      }}
                    >
                      {connector.clinica && connector.clinica.name}
                    </b>
                  </li>
                  <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                    <strong
                      style={{
                        fontSize: "10pt",
                        fontFamily: "times",
                      }}
                    >
                      Manzil:{" "}
                    </strong>{" "}
                    {connector.clinica && connector.clinica.address}
                  </li>
                  <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                    <strong
                      style={{
                        fontSize: "10pt",
                        fontFamily: "times",
                      }}
                    >
                      Bank:{" "}
                    </strong>{" "}
                    {connector.clinica && connector.clinica.bank}
                  </li>
                  <li style={{ fontSize: "10pt", fontFamily: "times" }}>
                    <strong
                      style={{
                        fontSize: "10pt",
                        fontFamily: "times",
                      }}
                    >
                      MFO:{" "}
                    </strong>{" "}
                    {connector.clinica && connector.clinica.mfo}
                  </li>
                  <li style={{ textAlign: "", fontSize: "10pt" }}>
                    <strong
                      style={{
                        fontSize: "10pt",
                        fontFamily: "times",
                      }}
                    >
                      INN:
                    </strong>
                    {connector.clinica && connector.clinica.inn}
                  </li>
                  <li style={{ textAlign: "", fontSize: "10pt" }}>
                    <strong style={{ fontSize: "10pt", fontFamily: "times" }}>
                      Hisob raqam:{" "}
                    </strong>{" "}
                    {connector.clinica && connector.clinica.banknumber}
                  </li>
                  <li style={{ textAlign: "", fontSize: "10pt" }}>
                    <strong style={{ fontSize: "10pt", fontFamily: "times" }}>
                      Telefon raqam:{" "}
                    </strong>
                    {connector.clinica && connector.clinica.phone1}
                  </li>
                </ul>
              </td>
              <td className="text-right">
                <img
                  className="mr-3 d-inline-block"
                  width="150"
                  src={connector.clinica && connector.clinica.image}
                  alt="logo"
                />
                <br />
                <img
                  width="140"
                  className="mr-3 d-inline-block"
                  src={qr && qr}
                  alt="QR"
                />
                <br />
                <p className="pr-3 mr-1" style={{ fontSize: "10pt" }}>
                  Bu yerni skanerlang
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="row" id="statsionar">
        <div className="col-lg-12">
          <div className="invoice-from">
            <table
              className="table table-bordered bg-white"
              style={{ fontSize: "10pt", fontFamily: "times" }}
            >
              <thead>
                <tr className="bg-white text-dark">
                  <td className="w-25 p-1 text-left px-3 py-1 border font-weight-bold">
                    Mijoz F.I.SH
                  </td>
                  <td className="w-75 p-1 px-3 py-1 border">
                    {connector.client && connector.client.fullname}{" "}
                  </td>
                </tr>
                <tr className="bg-white text-dark">
                  <td className="w-25 p-1 text-left px-3 py-1 border font-weight-bold">
                    Tug'ilgan yili
                  </td>
                  <td className="w-75 p-1 px-3 py-1 border">
                    {connector.client &&
                      new Date(connector.client.born).toLocaleDateString()}{" "}
                  </td>
                </tr>
                <tr className="bg-white text-dark">
                  <td className="w-25 p-1 text-left px-3 py-1 border font-weight-bold">
                    Telefon raqami
                  </td>
                  <td className="w-75 p-1 px-3 py-1 border">
                    +998{connector.client && connector.client.phone}{" "}
                  </td>
                </tr>
                <tr className="bg-white text-dark">
                  <td className="w-25 p-1 text-left px-3 py-1 border font-weight-bold">
                    Manzili
                  </td>
                  <td className="w-75 p-1 px-3 py-1 border">
                    {connector.client && connector.client.address}{" "}
                  </td>
                </tr>
                <tr className="bg-white text-dark">
                  <td className="w-25 p-1 text-left px-3 py-1 border font-weight-bold">
                    Kelgan vaqti
                  </td>
                  <td className="w-75 p-1 px-3 py-1 border">
                    {connector.client &&
                      new Date(
                        connector.room.beginday
                      ).toLocaleDateString()}{" "}
                  </td>
                </tr>
                <tr className="bg-white text-dark">
                  <td className="w-25 p-1 text-left px-3 py-1 border font-weight-bold">
                    Ketgan vaqti
                  </td>
                  <td className="w-75 p-1 px-3 py-1 border">
                    {connector.client &&
                      connector.room.endday &&
                      new Date(connector.room.endday).toLocaleDateString()}{" "}
                  </td>
                </tr>
                <tr className="bg-white text-dark">
                  <td className="w-25 p-1 text-left px-3 py-1 border font-weight-bold">
                    Oldindan to'lov
                  </td>
                  <td className="w-75 p-1 px-3 py-1 border">Oldindan to'lov</td>
                </tr>
                <tr className="bg-white text-dark">
                  <td className="w-25 p-1 text-left px-3 py-1 border font-weight-bold">
                    Tashxiz
                  </td>
                  <td className="w-75 p-1 px-3 py-1 border">
                    {connector.diagnosis && connector.diagnosis}{" "}
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div className="col-lg-12">
          <div
            className="table-responsive"
            style={{ overflow: "hidden", outline: "none" }}
            tabIndex="0"
          >
            <table
              className="table table-bordered"
              style={{ fontSize: "10pt", fontFamily: "times" }}
            >
              <thead>
                <tr className="bg-white text-dark">
                  <td className="text-center font-weight-bold border py-1">
                    №
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Xizmat turi
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Miqdori (dona)
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Narxi (1 dona)
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Narxi (umumiy)
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Vaqti
                  </td>
                </tr>
              </thead>
              <tbody>
                {connector.services &&
                  connector.services.map((service, index) => {
                    return (
                      <tr key={index}>
                        <td className="border py-1 text-bold font-weight-bold">
                          {index + 1}
                        </td>
                        <td className="text-left px-2 border py-1 font-weight-bold">
                          {service.service.name}
                        </td>
                        <td className="text-right border py-1">
                          {service.pieces}
                        </td>
                        <td className="text-right border py-1">
                          {service.service.price}
                        </td>
                        <td className="text-right border py-1">
                          {service.pieces * service.service.price}
                        </td>
                        <td className="text-right border py-1">
                          {new Date(service.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                {connector.products &&
                  connector.products.map((product, index) => {
                    return (
                      <tr key={index}>
                        <td className="border py-1 text-bold font-weight-bold">
                          {index + 1}
                        </td>
                        <td className="text-left px-2 border py-1 font-weight-bold">
                          {product.product.name}
                        </td>
                        <td className="text-right border py-1">
                          {product.pieces}
                        </td>
                        <td className="text-right border py-1">
                          {product.product.price}
                        </td>
                        <td className="text-right border py-1">
                          {product.pieces * product.product.price}
                        </td>
                        <td className="text-right border py-1">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                <tr>
                  <td className="border py-1 text-bold">Xona</td>
                  <td className="text-left border px-2 py-1 text-bold font-weight-bold">
                    {connector.room && connector.room.room.type}
                  </td>
                  <td className="text-right border py-1 text-bold">
                    {connector.room &&
                      Math.round(
                        Math.abs(
                          (new Date(connector.room.beginday).getTime()
                            -
                            new Date().getTime())
                          /
                          (24 * 60 * 60 * 1000)
                        )
                      )}
                  </td>
                  <td className="text-right border py-1 text-bold">
                    {connector.room && connector.room.room.price}
                  </td>
                  <td className="text-right border py-1">{connector.room &&
                    Math.round(
                      Math.abs(
                        (new Date(connector.room.beginday).getTime()
                          -
                          new Date().getTime())
                        /
                        (24 * 60 * 60 * 1000)
                      )
                    ) * connector.room.room.price
                  }</td>
                  <td className="text-right border py-1 text-bold">
                    {connector.room &&
                      new Date(connector.room.beginday).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="text-right px-3 font-weight-bold" colSpan="4">
                    Jami to'lov:
                  </td>
                  <td className=" text-right">To'lov</td>
                </tr>
                <tr>
                  <td className="text-right px-3 font-weight-bold" colSpan="4">
                    Oldindan to'lov:
                  </td>
                  <td className=" text-right">Oldindan to'lov</td>
                </tr>
                <tr>
                  <td className="text-right px-3 font-weight-bold" colSpan="4">
                    To'langan:
                  </td>
                  <td className=" text-right">To'lov</td>
                </tr>
                <tr>
                  <td className="text-right px-3 font-weight-bold" colSpan="4">
                    Qarz:
                  </td>
                  <td className=" text-right">To'lov</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <h6
            className="mt-3"
            style={{ fontSize: "10pt", fontFamily: "times" }}
          >
            Qabul:{" "}
          </h6>
          <hr />
          <h6
            className="mt-3"
            style={{
              fontSize: "10pt",
              fontFamily: "times",
            }}
          >
            Mijoz: {connector.client && connector.client.fullname}
          </h6>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default CheckStatsionarClient;

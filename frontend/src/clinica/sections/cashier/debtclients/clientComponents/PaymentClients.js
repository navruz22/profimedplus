import React from "react";
import "react-datepicker/dist/react-datepicker.css";

export const PaymentClients = ({
  payment,
  payCount,
  setPayCount,
  checkPayCount,
  loading,
  setPayment
}) => {
  return (
    <>
      {/* Row start */}
      <div className="row gutters">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Mijozning ma'lumotlari</div>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border py-1 bg-alotrade">
                      #
                    </th>
                    <th scope="col" className="border py-1 bg-alotrade">
                      Malumot
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="border py-1">F.I.O.</td>
                    <td className="py-1">
                      {payment.client && payment.client.fullname}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="border py-1">Telefon raqami:</td>
                    <td className="py-1">
                      +998{payment.client && payment.client.phone}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="border py-1">Tugilgan yili</td>
                    <td className="py-1">
                      {new Date(
                        payment.client && payment.client.born
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="border py-1">ID:</td>
                    <td className="py-1">
                      {payment.client && payment.client.id}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="border py-1">Summa:</td>
                    <td className="py-1">{payment.total && payment.total}</td>
                  </tr>
                  <tr className="border">
                    <td className="border py-1">Qarz summasi:</td>
                    <td className="py-1">{payment.debt && payment.debt}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                {/* <label htmlFor="">To'lov</label>
                <input
                  value={payCount}
                  onChange={(e) => setPayCount(e.target.value)}
                  type="text"
                  className="form-control form-control-sm"
                  id="payment"
                  name="pay"
                  placeholder="To'lov summasi..."
                /> */}
                <div className="btn-group mb-3 w-100" role="group" aria-label="Basic example">
                  <button
                    onClick={() => {
                      setPayment({
                        ...payment,
                        type: 'cash',
                        card: 0,
                        transfer: 0,
                        cash: +payCount
                      })
                    }}
                    type="button"
                    className={`btn btn-sm py-1 text-white  ${payment.type === "cash" ? "bg-amber-500" : "bg-alotrade"}`}
                  >
                    Naqt
                  </button>
                  <button
                    onClick={() => {
                      setPayment({
                        ...payment,
                        type: 'card',
                        card: +payCount,
                        transfer: 0,
                        cash: 0
                      })
                    }}
                    type="button"
                    className={`btn btn-sm py-1 text-white ${payment.type === "card" ? "bg-amber-500" : "bg-alotrade"}`}
                  >
                    Plastik
                  </button>
                  <button
                    onClick={() => {
                      setPayment({
                        ...payment,
                        type: 'transfer',
                        card: 0,
                        transfer: +payCount,
                        cash: 0
                      })
                    }}
                    type="button"
                    className={`btn btn-sm py-1 text-white ${payment.type === "transfer" ? "bg-amber-500" : "bg-alotrade"}`}
                  >
                    O'tkazma
                  </button>
                </div>
                {payment.type === "cash" &&
                  <div className="input-group input-group-sm mb-3">
                    <div className="input-group-prepend w-25">
                      <span
                        className="w-100 input-group-text bg-primary text-white font-weight-bold"
                        id="inputGroup-sizing-sm"
                        style={{ fontSize: "9pt" }}>
                        Naqt
                      </span>
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Naqt to'lov"
                      value={payCount || ''}
                      name="cash"
                      onChange={(e) => setPayCount(e.target.value)}
                    />
                  </div>}
                {payment.type === "card" &&
                  <div className="input-group input-group-sm mb-3">
                    <div className="input-group-prepend w-25">
                      <span
                        className="w-100 input-group-text bg-primary text-white font-weight-bold"
                        id="inputGroup-sizing-sm"
                        style={{ fontSize: "9pt" }}>
                        Plastik
                      </span>
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Karta orqali to'lov to'lov"
                      value={payCount || ''}
                      name="card"
                      onChange={(e) => setPayCount(e.target.value)}
                    />
                  </div>}
                {payment.type === "transfer" &&
                  <div className="input-group input-group-sm mb-3">
                    <div className="input-group-prepend w-25">
                      <span
                        className="w-100 input-group-text bg-primary text-white font-weight-bold"
                        id="inputGroup-sizing-sm"
                        style={{ fontSize: "9pt" }}>
                        O'tkazma
                      </span>
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="O'tkazma to'lov"
                      value={payCount || ''}
                      name="transfer"
                      onChange={(e) => setPayCount(e.target.value)}
                    />
                  </div>}
              </div>
              <div className="text-right">
                {loading ? (
                  <button className="bg-alotrade text-white py-2 px-3" disabled>
                    <span className="spinner-border spinner-border-sm"></span>
                    Loading...
                  </button>
                ) : (
                  <button
                    className="bg-alotrade text-white py-2 px-3 font-semibold"
                    onClick={checkPayCount}
                  >
                    To'lov qilish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Row end */}
    </>
  );
};

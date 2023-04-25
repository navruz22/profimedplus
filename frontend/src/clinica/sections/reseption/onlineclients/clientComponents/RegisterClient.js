import React, { useCallback, useEffect, useState } from "react";
import { DatePickers } from "./DatePickers";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

export const RegisterClient = ({
  selectedServices,
  selectedProducts,
  updateData,
  checkData,
  setNewServices,
  setNewProducts,
  newproducts,
  newservices,
  changeProduct,
  changeService,
  changeCounterAgent,
  changeAdver,
  setClient,
  client,
  changeClientData,
  changeClientBorn,
  departments,
  counterdoctors,
  advers,
  products,
  loading,
  changeBronDay,
}) => {
  const [services, setServices] = useState([]);
  const getServices = useCallback(
    (e) => {
      var s = [];
      if (e === "all") {
        departments.map((department) => {
          return department.services.map((service) => {
            return s.push({
              label: service.name,
              value: service._id,
              service: service,
              department: department,
            });
          });
        });
      } else {
        departments.map((department) => {
          if (e === department._id) {
            department.services.map((service) => {
              s.push({
                label: service.name,
                value: service._id,
                service: service,
                department: department,
              });
              return "";
            });
          }
          return "";
        });
      }
      setServices(s);
    },
    [departments]
  );

  useEffect(() => {
    if (departments) {
      getServices("all");
    }
  }, [departments, getServices]);
  return (
    <>
      {/* Row start */}
      <div className="row gutters">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Mijozning shaxsiy ma'lumotlari</div>
            </div>
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="fullName">Familiyasi</label>
                    <input
                      value={client.lastname}
                      onChange={changeClientData}
                      type="text"
                      className="form-control form-control-sm"
                      id="lastname"
                      name="lastname"
                      placeholder="Familiyasi"
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="inputEmail">Ismi</label>
                    <input
                      defaultValue={client.firstname}
                      onChange={changeClientData}
                      type="text"
                      className="form-control form-control-sm"
                      id="firstname"
                      name="firstname"
                      placeholder="Ismi"
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="education">Otasining ismi</label>
                    <input
                      defaultValue={client.fathername}
                      onChange={changeClientData}
                      type="text"
                      className="form-control form-control-sm"
                      id="fathername"
                      name="fathername"
                      placeholder="Otasining ismi"
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <label htmlFor="education">Tug'ilgan sanasi</label>
                  <DatePickers
                    dateFormat="dd/MM/yyyy"
                    changeDate={changeClientBorn}
                  />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="addreSs">Telefon raqami</label>
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          id="inputGroup-sizing-sm"
                        >
                          +998
                        </span>
                      </div>
                      <input
                        defaultValue={client.phone}
                        onChange={changeClientData}
                        type="number"
                        className="form-control"
                        name="phone"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="biO">Jinsi</label>
                    <div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          checked={
                            client.gender && client.gender === "man"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setClient({ ...client, gender: "man" });
                          }}
                          type="radio"
                          id="customRadioInline1"
                          name="gender"
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customRadioInline1"
                        >
                          Erkak
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          defaultChecked={
                            client.gender === "woman" ? true : false
                          }
                          onChange={(e) => {
                            setClient({ ...client, gender: "woman" });
                          }}
                          type="radio"
                          id="customRadioInline2"
                          name="gender"
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customRadioInline2"
                        >
                          Ayol
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="biO">Fuqoroligi</label>
                    <div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          checked={
                            client.national && client.national === 'uzb'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setClient({ ...client, national: 'uzb' })
                          }}
                          type="radio"
                          id="national1"
                          name="national"
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="national1"
                        >
                          Uzbek
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          defaultChecked={
                            client.national === 'foreigner' ? true : false
                          }
                          onChange={(e) => {
                            setClient({ ...client, national: 'foreigner' })
                          }}
                          type="radio"
                          id="national2"
                          name="national"
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="national2"
                        >
                          Chet'ellik
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="biO">Manzili</label>
                    <textarea
                      defaultValue={client.address}
                      onChange={changeClientData}
                      className="form-control form-control-sm"
                      name="address"
                      rows={1}
                      placeholder="Navoiy shahar ...."
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="biO">Kontragent</label>
                    <select
                      onChange={changeCounterAgent}
                      className="form-control form-control-sm selectpicker"
                      placeholder="Kontragentlarni tanlash"
                    >
                      <option value="delete">Tanlanmagan</option>
                      {counterdoctors.map((counterdoctor, index) => {
                        return (
                          <option
                            key={index}
                            value={JSON.stringify(counterdoctor)}
                            id={counterdoctor.user}
                          >
                            {counterdoctor.lastname +
                              " " +
                              counterdoctor.firstname}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="biO">Reklama</label>
                    <select
                      onChange={changeAdver}
                      className="form-control form-control-sm selectpicker"
                      placeholder="Reklamalarni tanlash"
                    >
                      <option value="delete">Tanlanmagan</option>
                      {advers.map((adver, index) => {
                        return (
                          <option key={index} value={adver._id}>
                            {adver.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {client._id ? (
                  <div className="col-12 text-right">
                    {loading ? (
                      <button className="btn btn-primary" disabled>
                        <span className="spinner-border spinner-border-sm"></span>
                        Loading...
                      </button>
                    ) : (
                      <button onClick={updateData} className="btn btn-primary">
                        Yangilash
                      </button>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Xizmatlar bilan ishlash</div>
            </div>
            <div className="card-body">
              <div className="row gutters">
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="fullName">Bo'limlar</label>
                    <select
                      className="form-control form-control-sm selectpicker"
                      placeholder="Reklamalarni tanlash"
                      onChange={(event) => getServices(event.target.value)}
                    >
                      <option value="all"> Barcha bo'limlar</option>
                      {departments.map((department, index) => {
                        return (
                          <option key={index} value={department._id}>
                            {department.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="inputEmail">Xizmatlar</label>
                    <Select
                      value={selectedServices}
                      onChange={changeService}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={services}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        padding: 0,
                        height: 0,
                      })}
                      isMulti
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="inputEmail">Mahsulotlar</label>
                    <Select
                      value={selectedProducts}
                      onChange={changeProduct}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={products}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        padding: 0,
                        height: 0,
                      })}
                      isMulti
                    />
                  </div>
                </div>
                <div className="col-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="border py-1 bg-alotrade">№</th>
                        <th className="border py-1 bg-alotrade">Nomi</th>
                        <th className="border py-1 bg-alotrade">Narxi</th>
                        <th className="border py-1 bg-alotrade">Soni</th>
                        <th className="border py-1 bg-alotrade">Xizmat vaqti</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newservices &&
                        newservices.map((service, index) => {
                          return (
                            <tr key={index}>
                              <td className="py-1">{index + 1}</td>
                              <td className="py-1">{service.service.name}</td>
                              <td className="text-right py-1">
                                {service.service.price * service.pieces}
                              </td>
                              <td className="text-right py-1">
                                <input
                                  onChange={(e) =>
                                    setNewServices(
                                      Object.values({
                                        ...newservices,
                                        [index]: {
                                          ...newservices[index],
                                          pieces: e.target.value,
                                        },
                                      })
                                    )
                                  }
                                  className="text-right outline-none"
                                  style={{ maxWidth: "50px", outline: "none" }}
                                  defaultValue={service.pieces}
                                  type="number"
                                />
                              </td>
                              <td className=" text-right py-1">
                                <div>
                                  <DatePickers
                                    timeInputLabel="Time:"
                                    dateFormat="MM/dd/yyyy hh:mm"
                                    showTimeInput
                                    changeDate={(date) =>
                                      changeBronDay(date, index)
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      <tr className="border"></tr>
                      {newproducts &&
                        newproducts.map((product, index) => {
                          return (
                            <tr key={index}>
                              <td className="py-1">{index + 1}</td>
                              <td className="py-1">{product.product.name}</td>
                              <td className="text-right py-1">
                                {product.product.price * product.pieces}
                              </td>
                              <td className="text-right py-1">
                                <input
                                  onChange={(e) =>
                                    setNewProducts(
                                      Object.values({
                                        ...newproducts,
                                        [index]: {
                                          ...newproducts[index],
                                          pieces: e.target.value,
                                        },
                                      })
                                    )
                                  }
                                  className="text-right outline-none"
                                  style={{ maxWidth: "50px", outline: "none" }}
                                  defaultValue={product.pieces}
                                  type="number"
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th className="text-right" colSpan={2}>
                          Jami:
                        </th>
                        <th colSpan={2}>
                          {newservices.reduce((summa, service) => {
                            return (
                              summa +
                              service.service.price * parseInt(service.pieces)
                            );
                          }, 0) +
                            newproducts.reduce((summa, product) => {
                              return (
                                summa +
                                product.product.price * parseInt(product.pieces)
                              );
                            }, 0)}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="text-right">
                    {loading ? (
                      <button className="bg-alotrade text-white py-2 px-3 rounded" disabled>
                        <span className="spinner-border spinner-border-sm"></span>
                        Loading...
                      </button>
                    ) : (
                      <button onClick={checkData} className="bg-alotrade text-white py-2 px-3 rounded">
                        Saqlash
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Row end */}
    </>
  );
};

import React from "react";

export const InputService = ({
  departments,
  setService,
  service,
  inputHandler,
  keyPressed,
  saveHandler,
  servicetypes,
  loading
}) => {
  return (
    <div className="border-0 table-container">
      <div className="table-responsive">
        <table className="table m-0">
          <thead>
            <tr>
              <th className="bg-alotrade text-[14px]">Bo'lim nomi</th>
              <th className="bg-alotrade text-[14px]">Xizmat turi</th>
              <th className="bg-alotrade text-[14px]">Xizmat nomi</th>
              <th className="bg-alotrade text-[14px]">Qisqartma nomi</th>
              <th className="bg-alotrade text-[14px]">Xizmat xonasi</th>
              <th className="bg-alotrade text-[14px]">Narxi</th>
              <th className="bg-alotrade text-[14px]">Doktor ulushi</th>
              <th className="bg-alotrade text-[14px]">Kounteragent ulushi</th>
              <th className="bg-alotrade text-[14px]">Kounterdoktor ulushi</th>
              <th className="bg-alotrade text-[14px]">Saqlash</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <select
                  className="text-[14px] form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) =>
                    setService({
                      ...service,
                      department: e.target.value,
                    })
                  }
                  placeholder="Bo'limni tanlang"
                  style={{ minWidth: "70px" }}
                >
                  <option>Bo'limni tanlang</option>
                  {departments &&
                    departments.map((department, index) => {
                      return (
                        <option key={index} value={department._id}>
                          {department.name}
                        </option>
                      );
                    })}
                </select>
              </td>
              <td>
                <select
                  className="form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) => {
                    if (e.target.value === "delete") {
                      let k = { ...service };
                      delete k.servicetype;
                      setService({
                        ...k,
                      });
                    } else {
                      setService({
                        ...service,
                        servicetype: e.target.value,
                      });
                    }
                  }}
                  placeholder="Xizmat turini tanlang"
                  style={{ minWidth: "70px" }}
                >
                  {servicetypes &&
                    servicetypes.map((servicetype, index) => {
                      if (
                        service.department &&
                        (service.department === servicetype.department._id ||
                          (service.department._id &&
                            service.department._id ===
                            servicetype.department._id))
                      ) {
                        return (
                          <option key={index} value={servicetype._id}>
                            {servicetype.name}
                          </option>
                        );
                      }
                      return "";
                    })}
                  <option value="delete">Xizmat turini o'chirish</option>
                </select>
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="name"
                  value={service.name}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="name"
                  placeholder="Xizmat nomini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="shortname"
                  value={service.shortname && service.shortname}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="shortname"
                  placeholder="Qisqartma nomini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="serviceroom"
                  value={service.serviceroom && service.serviceroom}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="shortname"
                  placeholder="Qisqartma nomini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="price"
                  value={service.price}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="price"
                  placeholder="Xizmat narxini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="doctorProcient"
                  value={service.doctorProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="doctorProcient"
                  placeholder="Shifokor ulushini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="counterAgentProcient"
                  value={service.counterAgentProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="counterAgentProcient"
                  placeholder="Kontragent ulushini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="counterDoctorProcient"
                  value={service.counterDoctorProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="counterDoctorProcient"
                  placeholder="Yo'naltiruvchi shifokor ulushini kiriting"
                />
              </td>
              <td>
                {loading ? <button
                  className="btn btn-info"
                  disabled
                >
                  <span class="spinner-border spinner-border-sm"></span>
                  Loading...
                </button> : <button
                  onClick={saveHandler}
                  className="btn btn-info py-1 px-4"
                >
                  Saqlash
                </button>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

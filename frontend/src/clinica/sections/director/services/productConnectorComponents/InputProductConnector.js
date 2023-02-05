import React from "react";

export const InputProductConnector = ({
  services,
  setServices,
  departments,
  setProductConnector,
  productConnector,
  inputHandler,
  keyPressed,
  saveHandler,
  products,
  loading
}) => {
  return (
    <div className="border-0 table-container">
      <div className="table-responsive">
        <table className="table m-0">
          <thead>
            <tr>
              <th className="bg-alotrade text-[16px]">Bo'lim nomi</th>
              <th className="bg-alotrade text-[16px]">Xizmat nomi</th>
              <th className="bg-alotrade text-[16px]">Mahsulot nomi</th>
              <th className="bg-alotrade text-[16px]">Soni</th>
              <th className="bg-alotrade text-[16px]">Saqlash</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <select
                  className="form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) =>
                    setServices(departments[e.target.value].services)
                  }
                  placeholder="Bo'limni tanlang"
                  style={{ minWidth: "70px" }}
                >
                  <option>Bo'limni tanlang</option>
                  {departments &&
                    departments.map((department, index) => {
                      return (
                        <option key={index} value={index}>
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
                    setProductConnector({
                      ...productConnector,
                      service: e.target.value,
                    });
                  }}
                  placeholder="Xizmat nomini tanlang"
                  style={{ minWidth: "70px" }}
                >
                  <option>Xizmat nomini tanlang</option>
                  {services &&
                    services.map((service, index) => {
                      return (
                        <option key={index} value={service._id}>
                          {service.name}
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
                    setProductConnector({
                      ...productConnector,
                      product: e.target.value,
                    });
                  }}
                  placeholder="Mahsulot turini tanlang"
                  style={{ minWidth: "70px" }}
                >
                  <option>Mahsulot turini tanlang</option>
                  {products &&
                    products.map((product, index) => {
                      return (
                        <option key={index} value={product._id}>
                          {product.name}
                        </option>
                      );
                    })}
                </select>
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="pieces"
                  value={productConnector.pieces}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="pieces"
                  placeholder="Mahsulot sonini kiriting"
                />
              </td>
              <td>
                {loading ? <button className="btn btn-info" disabled>
                  <span class="spinner-border spinner-border-sm"></span>
                  Loading...
                </button>
                  :
                  <button
                    onClick={saveHandler}
                    className="btn btn-info py-1 px-4"
                  >
                    Saqlash
                  </button>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

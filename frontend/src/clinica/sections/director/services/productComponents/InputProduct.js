import React from "react";

export const InputProduct = ({
  setProduct,
  product,
  inputHandler,
  keyPressed,
  saveHandler,
  loading
}) => {
  const si = ["dona", "kg", "g", "l", "ml", "pachka"]
  return (
    <div className="border-0 shadow-lg table-container">
      <div className="table-responsive">
        <table className="table m-0">
          <thead>
            <tr>
              <th className="bg-alotrade text-[16px]">Mahsulot nomi</th>
              <th className="bg-alotrade text-[16px]">O'lchov birligi</th>
              <th className="bg-alotrade text-[16px]">Sotuv narxi</th>
              <th className="bg-alotrade text-[16px]">Soni</th>
              <th className="bg-alotrade text-[16px]">Saqlash</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="name"
                  value={product.name}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="name"
                  placeholder="Mahsulot nomini kiriting"
                />
              </td>
              <td>
                <select
                  className="form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) => {
                    if (e.target.value === "delete") {
                      let k = { ...product };
                      delete k.unit;
                      setProduct({
                        ...k,
                      });
                    } else {
                      setProduct({
                        ...product,
                        unit: e.target.value,
                      });
                    }
                  }}
                  placeholder="O'lchov birligini tanlang"
                  style={{ minWidth: "70px" }}
                >
                  <option>O'lchov birligini tanlang</option>
                  {si.map((s, key) => {
                    return <option value={s} key={key}>{s}</option>;
                  })}
                </select>
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="price"
                  value={product.price}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="price"
                  placeholder="Mahsulot narxini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="total"
                  value={product.total}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="total"
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

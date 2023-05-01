import React from "react";

export const InputRoom = ({
  room,
  inputHandler,
  keyPressed,
  saveHandler,
  loading
}) => {
  return (
    <div className="border-0 table-container">
      <div className="table-responsive">
        <table className="table m-0">
          <thead>
            <tr>
              <th className="bg-alotrade text-[16px]">Xona turi</th>
              <th className="bg-alotrade text-[16px]">Xona raqami</th>
              <th className="bg-alotrade text-[16px]">O'rin raqami</th>
              <th className="bg-alotrade text-[16px]">Narxi</th>
              <th className="bg-alotrade text-[16px]">Shifokor ulushi</th>
              <th className="bg-alotrade text-[16px]">Hamshira ulushi</th>
              <th className="bg-alotrade text-[16px]">Saqlash</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="type"
                  value={room.type && room.type}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="type"
                  placeholder="Xona turini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="number"
                  value={room.number && room.number}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="number"
                  placeholder="Xona nomini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="place"
                  value={room.place}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="place"
                  placeholder="Yotoq o'rnini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="price"
                  value={room.price}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="price"
                  placeholder="Narxini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="doctorProcient"
                  value={room?.doctorProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="doctorProcient"
                  placeholder="Narxini kiriting"
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="nurseProcient"
                  value={room?.nurseProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="nurseProcient"
                  placeholder="Hamshira ulushini"
                />
              </td>
              <td>
                {loading ?
                  <button
                    className="btn btn-info"
                    disabled
                  >
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

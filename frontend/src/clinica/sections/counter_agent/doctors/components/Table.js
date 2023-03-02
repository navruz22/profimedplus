import React from 'react'
import { Pagination } from '../../../reseption/components/Pagination'
import { DatePickers } from '../../../reseption/offlineclients/clientComponents/DatePickers'
import { Sort } from '../../../reseption/offlineclients/clientComponents/Sort'

const Table = ({
    changeStart,
    changeEnd,
    searchClientName,
    connectors,
    setCurrentPage,
    countPage,
    currentConnectors,
    setCurrentConnectors,
    currentPage,
    setPageSize,
    counterDoctorsList,
    changeCounterDoctor
}) => {
    return (
        <div className="border-0 table-container mt-6">
            <div className="border-0 table-container">
                <div className="table-responsive">
                    <div className="bg-white flex gap-6 items-center py-2 px-2">
                        <div>
                            <select
                                className="form-control form-control-sm selectpicker"
                                placeholder="Bo'limni tanlang"
                                onChange={setPageSize}
                                style={{ minWidth: '50px' }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <div>
                            <select
                                className="form-control form-control-sm selectpicker"
                                placeholder="Bo'limni tanlang"
                                onChange={changeCounterDoctor}
                                style={{ minWidth: '50px' }}
                            >
                                <option value={'none'}>Hammasi</option>
                                {counterDoctorsList.length > 0 && counterDoctorsList.map(item =>
                                    <option value={item._id}>{item.firstname + ' ' + item.lastname}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <input
                                onChange={searchClientName}
                                style={{ maxWidth: '100px', minWidth: '100px' }}
                                type="search"
                                className="w-100 form-control form-control-sm selectpicker"
                                placeholder="Mijoz F.I.O"
                            />
                        </div>
                        <div className="text-center ml-auto ">
                            <Pagination
                                setCurrentDatas={setCurrentConnectors}
                                datas={connectors}
                                setCurrentPage={setCurrentPage}
                                countPage={countPage}
                                totalDatas={connectors.length}
                            />
                        </div>
                        <div
                            className="text-center ml-auto flex gap-2"
                            style={{ overflow: 'hidden' }}
                        >
                            <DatePickers changeDate={changeStart} />
                            <DatePickers changeDate={changeEnd} />
                        </div>
                    </div>
                    <table className="table m-0">
                        <thead>
                            <tr>
                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Yunaltiruvchi shifokor
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={'totalprice'}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Yunaltiruvchini klinikasi
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={'totalprice'}
                                    />
                                </th>
                                <th className='border py-1 bg-alotrade text-[16px]'>Mijoz</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Xizmat nomi
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={'totalprice'}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Umumiy narxi
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={'totalprice'}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Agent ulushi
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={'counteragent_profit'}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Shifokor ulushi
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={'counterdoctor_profit'}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConnectors.map((connector, key) => {
                                return (
                                    <tr key={key}>
                                        <td
                                            className="border py-1 font-weight-bold text-right"
                                            style={{ maxWidth: '30px !important' }}
                                        >
                                            {currentPage * countPage + key + 1}
                                        </td>
                                        <td className="border py-1 font-weight-bold text-[16px]">
                                            {connector?.counterdoctor?.lastname +
                                                ' ' +
                                                connector?.counterdoctor?.firstname}
                                        </td>
                                        <td className="border py-1 font-weight-bold text-[16px]">
                                            {connector?.counterdoctor?.clinica_name}
                                        </td>
                                        <td className="border py-1 text-left text-[16px]">
                                            {connector?.client?.lastname +
                                                ' ' +
                                                connector?.client?.firstname}
                                        </td>
                                        <td className="border py-1 text-left text-[16px]">
                                            {connector?.service?.name}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector.totalprice}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector?.counteragent_profit}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector.counterdoctor_profit}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Table
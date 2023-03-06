import { faPenAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Pagination } from '../../sections/reseption/components/Pagination'

export const ClinicasTable = ({
    searchFullname,
    connectors,
    setCurrentPage,
    countPage,
    currentConnectors,
    setCurrentConnectors,
    currentPage,
    setPageSize,
    setClinicaData,
    setVisible,
    setDirectorData,
    setRegisterType
}) => {
    return (
        <div className="border-0 table-container">
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
                            <input
                                onChange={searchFullname}
                                style={{ maxWidth: '100px', minWidth: '100px' }}
                                type="search"
                                className="w-100 form-control form-control-sm selectpicker"
                                placeholder="F.I.O"
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
                    </div>
                    <table className="table m-0">
                        <thead>
                            <tr>
                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Shifoxona
                                </th>
                                <th className='border py-1 bg-alotrade text-[16px]'>Tel</th>
                                <th className='border py-1 bg-alotrade text-[16px]'>Yaratilgan vaqti</th>
                                <th className='border py-1 bg-alotrade text-[16px]'>Sh.X.</th>
                                <th className='border py-1 bg-alotrade text-[16px]'>Dir-or</th>
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
                                            {connector?.name}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            +998{connector?.phone1}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {new Date(connector.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="border py-1 text-center text-[16px]">
                                            <button
                                                className="btn btn-primary py-0"
                                                onClick={() => {
                                                    let obj = { ...connector }
                                                    delete obj.director;
                                                    setClinicaData(obj);
                                                    setVisible(true)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPenAlt} />
                                            </button>
                                        </td>
                                        <td className="border py-1 text-center text-[16px]">
                                            <button
                                                className="btn btn-primary py-0"
                                                onClick={() => {
                                                    setDirectorData(connector.director);
                                                    setVisible(true)
                                                    setRegisterType('director')
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPenAlt} />
                                            </button>
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

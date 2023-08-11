import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


export const SmallCheck = ({ baseUrl, clinica, client, connector, qr, turn, turntitle }) => {
    console.log(connector);
    const { t } = useTranslation()

    return (
        <>
            <div>
                <div className='w-full text-center mb-4'>
                    <img
                        className='mx-auto'
                        style={{ width: "150px" }}
                        src={baseUrl + '/api/upload/file/' + clinica?.image}
                        alt="logo"
                    />
                </div>
                <div>
                    <h1 className="uppercase font-bold text-[36px]">{turntitle === 'A' ? t("DASTLABKI KO'RIK") : t("Qayta ko'rik")}</h1>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                            {turntitle === 'A' ? t("Vaqti") : t('Muolaja vaqti')}:{' '}
                        </strong>
                    </div>
                    <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                        {connector &&
                            new Date().toLocaleDateString() +
                            ' ' +
                            new Date().toLocaleTimeString()}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                            {t("ID")}:{' '}
                        </strong>
                    </div>
                    <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                    {connector.client && connector.client.id}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                            {t("Xona")}:{' '}
                        </strong>
                    </div>
                    <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                    {connector?.services.filter(el => !el.department.probirka)[0]?.department?.room}
                    </div>
                </div>
                <div className="mt-4" style={{ fontWeight: "bold", color: "black", fontSize: '24px', fontFamily: 'times' }}>
                    {client?.firstname + ' ' + client?.lastname}
                </div>
                <div style={{ fontWeight: "bold", color: "black", fontSize: '100px'}}>
                     {turntitle === 'A' && connector.isBooking ?  t('Belgilangan') : `${turntitle} ${turn}`}
                </div>
                <div className="w-full h-[5px] mt-[5cm] border-2 border-[#000]">
                </div>
            </div>
        </>
    )
}

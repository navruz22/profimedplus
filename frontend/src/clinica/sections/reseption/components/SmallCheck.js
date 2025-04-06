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
                    <h1 className="uppercase font-bold text-[36px]">{turntitle === 'KO' ? t("Qayta ko'rik") : t("DASTLABKI KO'RIK")}</h1>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                            {turntitle === 'KO' ? t('Muolaja vaqti') : t("Vaqti")}{' '}
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
                <div className="mt-4" style={{ fontWeight: "bold", color: "black", fontSize: '32px', fontFamily: 'times' }}>
                    {client?.firstname + ' ' + client?.lastname}
                </div>
                <div style={{ fontWeight: "bold", color: "black", fontSize: client.brondate ? "48px" : '100px' }}>
                    {client.brondate ? `${new Date(client.brondate).toLocaleDateString('Ru-ru')} ${new Date(client.brondate).toLocaleTimeString('Ru-ru').slice(0, 5)}` : (turntitle === 'A' && connector.isBooking ? t('Belgilangan') : `${turntitle} ${turn}`)}
                </div>
                <div style={{ marginTop: '1cm', fontWeight: "bold", color: "black", fontSize: '60px' }}>
                    {t("Xona")}:{connector?.services.filter(el => !el.department.probirka)[0]?.department?.room}
                </div>
                <div className="w-full h-[5px] border-2 border-[#000]">
                </div>
            </div>
        </>
    )
}

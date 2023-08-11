import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


export const SmallCheck2 = ({ baseUrl, client, turn, clinica }) => {

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
                    <h1 className="uppercase font-bold text-[36px]">{t("Operatsion ko'rik")}</h1>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                            {t("Vaqti")}:{' '}
                        </strong>
                    </div>
                    <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                        {client &&
                            new Date(client?.createdAt).toLocaleDateString() +
                            ' ' +
                            new Date(client?.createdAt).toLocaleTimeString()}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <strong style={{ color: "black", fontSize: '20px', fontFamily: 'times' }}>
                            {t("ID")}:{' '}
                        </strong>
                    </div>
                    <div style={{ fontWeight: "bold", color: "black", fontSize: '20px', fontFamily: 'times' }}>
                    {client?.id}
                    </div>
                </div>
                <div className="mt-4" style={{ fontWeight: "bold", color: "black", fontSize: '24px', fontFamily: 'times' }}>
                    {client?.firstname + ' ' + client?.lastname}
                </div>
                <div style={{ fontWeight: "bold", color: "black", fontSize: '100px'}}>
                    ПО: {turn}
                </div>
                <div className="w-full h-[5px] mt-[5cm] border-2 border-[#000]">
                </div>
            </div>
        </>
    )
}

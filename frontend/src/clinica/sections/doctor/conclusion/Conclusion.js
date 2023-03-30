import { useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import ClientCard from "./components/ClientCard";


const Conclusion = () => {
    const { connector } = useLocation().state

    const toast = useToast();

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
        [toast]
    );

    //====================================================================
    //====================================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    const [type, setType] = useState('')

    //====================================================================
    //====================================================================

    const [connectorInfo, setConnectorInfo] = useState()

    const getConnectorInfo = useCallback(
        async () => {
            try {
                const data = await request(
                    `/api/doctor/conclusion/client_info/get`,
                    "POST",
                    {
                        clinica: auth && auth.clinica._id,
                        connector: connector._id,
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setConnectorInfo(data);
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify]
    );

    useEffect(() => {
        getConnectorInfo()
    }, [getConnectorInfo])

    //====================================================================
    //====================================================================

    return <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="flex justify-between items-center">
            <button onClick={() => setType('clientcard')} className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Bemor kartasi</button>
            <button className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Shifokor kurigi</button>
            <button className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Shartnoma bajarishi</button>
            <button className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Xarorat</button>
            <button className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Xulosa</button>
        </div>
        {type === 'clientcard' && <ClientCard connector={connectorInfo} onChange={(text) => {
            setConnectorInfo({
                ...connectorInfo, client: {
                    ...connectorInfo.client,
                    template: text
                }
            })
        }} />}
    </div>
}

export default Conclusion
import { useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import ClientCard from "./components/ClientCard";
import ConclusionPage from "./components/ConclusionPage";
import ConclusionsTemp from "./components/ConclusionsTemp";
import DoctorResult from "./components/DoctorResult";


const Conclusion = () => {
    const { connector } = useLocation().state
    console.log(connector);
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


    // const saveClientCard = () => {
    //     const 
    // }

    //====================================================================
    //====================================================================

    return <div className="container p-4 bg-white">
        <div className="flex justify-between items-center">
            <button onClick={() => setType('clientcard')} className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Bemor kartasi</button>
            <button onClick={() => setType('doctorresult')} className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Shifokor kurigi</button>
            <button onClick={() => setType('conclusion_temp')} className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Shablonlar</button>
            {/* <button className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Xarorat</button> */}
            <button onClick={() => setType('conclusion_page')} className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Xulosa</button>
        </div>
        {type === 'clientcard' && <ClientCard  connector={connectorInfo} setConnector={setConnectorInfo}  />}
        {type === 'doctorresult' && <DoctorResult connector={connectorInfo} />}
        {type === 'conclusion_temp' && <ConclusionsTemp />}
        {type === 'conclusion_page' && <ConclusionPage connector={connectorInfo} setConnector={setConnectorInfo} />}
    </div>
}

export default Conclusion
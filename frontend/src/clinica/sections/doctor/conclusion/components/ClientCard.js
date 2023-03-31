import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import TextEditor from "./TextEditor";
import ReactHtmlParser from 'react-html-parser'
import "../../components/Print.css"


const ClientCard = ({ connector, onChange, saveClientCard }) => {
    console.log(connector?.client?.template);

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    return (
        <>
            <div className="container w-[21cm]">
                <div className="flex justify-between items-center w-full mb-4">
                    <div className="text-[16px] font-bold">
                        Ўзбекистон Республикаси <br />
                        Соғлиқни сақлаш вазирлиги <br />
                        {connector?.clinica?.name}
                    </div>
                    <div className="text-[16px] font-bold">
                        Ўзбекистон Республикаси <br />
                        Соғлиқни сақлаш вазирининг <br />
                        2020 йил 31 декабрдаги   № 363-сонли <br />
                        буйруғи билан тасдиқланган <br />
                        003- рақамли тиббий хужжат шакли <br />
                    </div>
                </div>
                <h1 className="text-center mb-4 text-[18px] font-bold">СТАЦИОНАР БЕМОРНИНГ ТИББИЙ КАРТАСИ №: {connector?.client?.id}</h1>
                <div className="col-12" style={{ padding: "0" }}>
                    <table
                        style={{
                            width: "100%",
                            border: "2px solid",
                            borderTop: "3px solid",
                        }}
                    >
                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Mijozning F.I.SH
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    fontSize: "20px",
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                <h4>
                                    {connector?.client && connector.client.lastname + " " + connector.client.firstname}
                                </h4>
                            </td>
                            <td colSpan={2} style={{ width: "25%" }}>
                                <p className="fw-bold fs-5 m-0">
                                    {connector?.client?.department}
                                </p>
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Tug'ilgan yili
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client && new Date(connector.client.born).toLocaleDateString()}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Jinsi
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client?.gender === 'man' && 'Erkak'}
                                {connector?.client?.gender === 'women' && 'Ayol'}
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Kelgan sanasi
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector &&
                                    new Date(connector?.room?.beginday).toLocaleDateString()}
                            </td>
                            <td
                                className="p-0 fw-bold"
                                style={{
                                    width: "100px",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Ketgan vaqti
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "100px",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.room?.endday && new Date(connector?.room?.endday).toLocaleDateString()}
                            </td>
                        </tr>

                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                Manzil
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector.client && connector.client.address}
                            </td>
                            <td
                                className="p-0 fw-bold"
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                ID
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector.client && connector.client.id}
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="mb-4 mt-4 text-[16px]">
                    <p className="font-bold">1. <span className="mr-[20px]">Қон гурухи: {connector?.client?.bloodgroup}</span>  резус мансублиги: {connector?.client?.rezus}</p>
                    <p className="font-bold">2. Дориларнинг ножўя таЪсири: {connector?.client?.medicineresult}</p>
                    <p className="font-bold">3. <span className="mr-[30px]">Бўйи: {connector?.client?.height},</span> <span className="mr-[30px]">вазни: {connector?.client?.weight},</span> тана харорати: {connector?.client?.temperature}</p>
                    <p className="font-bold">4. Қариндошларнинг яшаш жойи ва телефон рақамлари: {connector?.client?.relative_info}</p>
                    <p className="font-bold">5. Иш жойи, касби, лавозими: {connector?.client?.profession_info}</p>
                    <p className="font-bold">6. Бемор қаердан юборилган: {connector?.client?.sending_info}</p>
                    <p className="font-bold">7. Касалхонага шошилинч равишда келтирилган: {connector?.client?.isAmbulance}</p>
                    <p className="font-bold">8. Қандай транспортда келтирилган: {connector?.client?.ambulance_transport}</p>
                    <p className="font-bold">9. Касаллик бошлангандан сўнг утган вақт, жарохатдан сўнг: {connector?.client?.start_sickness}</p>
                    <p className="font-bold">10. Бемор йўлланмасидаги ташҳис: {connector?.client?.conter_diagnosis}</p>
                    <p className="font-bold">11. Қабулхонада қуйилган ташҳис: {connector?.client?.diagnosis}</p>
                </div>
                <div>
                    <TextEditor
                        value={connector?.client?.template ? connector?.client?.template : temp}
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className="container p-4 bg-white">
                <div className="row">
                    <div className="col-12 text-center my-4">
                        <button className="btn btn-success px-4 mx-4"  > Tasdiqlash</button>
                        <button className="btn btn-info px-5" onClick={handlePrint} >Chop etish</button>
                    </div>
                </div>
            </div>
            <div className="d-none">
                <div ref={componentRef} className="container w-[21cm]">
                    <div className="flex justify-between items-center w-full mb-4">
                        <div className="text-[16px] font-bold">
                            Ўзбекистон Республикаси <br />
                            Соғлиқни сақлаш вазирлиги <br />
                            {connector?.clinica?.name}
                        </div>
                        <div className="text-[16px] font-bold">
                            Ўзбекистон Республикаси <br />
                            Соғлиқни сақлаш вазирининг <br />
                            2020 йил 31 декабрдаги   № 363-сонли <br />
                            буйруғи билан тасдиқланган <br />
                            003- рақамли тиббий хужжат шакли <br />
                        </div>
                    </div>
                    <h1 className="text-center mb-4 text-[18px] font-bold">СТАЦИОНАР БЕМОРНИНГ ТИББИЙ КАРТАСИ №: {connector?.client?.id}</h1>
                    <div className="col-12" style={{ padding: "0" }}>
                        <table
                            style={{
                                width: "100%",
                                border: "2px solid",
                                borderTop: "3px solid",
                            }}
                        >
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Mijozning F.I.SH
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        fontSize: "20px",
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    <h4>
                                        {connector?.client && connector.client.lastname + " " + connector.client.firstname}
                                    </h4>
                                </td>
                                <td colSpan={2} style={{ width: "25%" }}>
                                    <p className="fw-bold fs-5 m-0">
                                        {connector?.client?.department}
                                    </p>
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Tug'ilgan yili
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector?.client && new Date(connector.client.born).toLocaleDateString()}
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Jinsi
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector?.client?.gender === 'man' && 'Erkak'}
                                    {connector?.client?.gender === 'women' && 'Ayol'}
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Kelgan sanasi
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector &&
                                        new Date(connector?.room?.beginday).toLocaleDateString()}
                                </td>
                                <td
                                    className="p-0 fw-bold"
                                    style={{
                                        width: "100px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Ketgan vaqti
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "100px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector?.room?.endday && new Date(connector?.room?.endday).toLocaleDateString()}
                                </td>
                            </tr>

                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Manzil
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "25%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector.client && connector.client.address}
                                </td>
                                <td
                                    className="p-0 fw-bold"
                                    style={{
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    ID
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector.client && connector.client.id}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="mb-4 mt-4 text-[16px]">
                        <p className="font-bold">1. <span className="mr-[20px]">Қон гурухи: {connector?.client?.bloodgroup}</span>  резус мансублиги: {connector?.client?.rezus}</p>
                        <p className="font-bold">2. Дориларнинг ножўя таЪсири: {connector?.client?.medicineresult}</p>
                        <p className="font-bold">3. <span className="mr-[30px]">Бўйи: {connector?.client?.height},</span> <span className="mr-[30px]">вазни: {connector?.client?.weight},</span> тана харорати: {connector?.client?.temperature}</p>
                        <p className="font-bold">4. Қариндошларнинг яшаш жойи ва телефон рақамлари: {connector?.client?.relative_info}</p>
                        <p className="font-bold">5. Иш жойи, касби, лавозими: {connector?.client?.profession_info}</p>
                        <p className="font-bold">6. Бемор қаердан юборилган: {connector?.client?.sending_info}</p>
                        <p className="font-bold">7. Касалхонага шошилинч равишда келтирилган: {connector?.client?.isAmbulance}</p>
                        <p className="font-bold">8. Қандай транспортда келтирилган: {connector?.client?.ambulance_transport}</p>
                        <p className="font-bold">9. Касаллик бошлангандан сўнг утган вақт, жарохатдан сўнг: {connector?.client?.start_sickness}</p>
                        <p className="font-bold">10. Бемор йўлланмасидаги ташҳис: {connector?.client?.conter_diagnosis}</p>
                        <p className="font-bold">11. Қабулхонада қуйилган ташҳис: {connector?.client?.diagnosis}</p>
                    </div>
                    <div className="print_word">
                        {ReactHtmlParser(connector?.client?.template || temp)}
                    </div>
                </div>
            </div>
        </>
    )
}


const temp = `
<table><tbody><tr><td colspan="1" rowspan="1"><p style="text-align: center"><strong>11. Касалхонада қўйилган ташҳис</strong></p></td><td colspan="1" rowspan="1"><p style="text-align: center"><strong>Касаллик аниқланган сана </strong></p></td><td colspan="1" rowspan="1"><p style="text-align: center"><strong>Шифокор имзоси</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr></tbody></table><p>12. Касалхонада қўйилган якуний ташҳис</p><p>а) асосий:</p><p>б) асосий касалликнинг асорати:</p><p>в) аниқланган ҳамроҳ&nbsp;касалликлар:</p><p>13. Мазкур йил давомида шу касаллик бўйича касалхонага ётиши: биринчи марта,қайта&nbsp;(чизинг)</p><p>Ҳаммаси бўлиб______________________________марта</p><p>14. Жарроҳлик операциялари, оғриқсизлантириш усуллари ва операциядан кейинги асоратлар</p><table><tbody><tr><td colspan="1" rowspan="1"><p style="text-align: center">Операция номи</p></td><td colspan="1" rowspan="1"><p style="text-align: center">Вақти, соати</p></td><td colspan="1" rowspan="1"><p style="text-align: center">Оғриқсизлантириш усули</p></td><td colspan="1" rowspan="1"><p style="text-align: center">Асоратлари</p></td></tr><tr><td colspan="1" rowspan="1"><p>1.</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>2.</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>3.</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr></tbody></table><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<strong>&nbsp;Операция қилувчи:</strong>_________________________________</p><p>15. Даволашнинг бошқа турлари (кўрсатинг)__________________________________</p><p>____________________________________________________________________</p><p>16.Меҳнатга яроқсизлиқ варағи ёки маълумотнома: №__________________________дан___________________гача №_____________________дан_________________гача</p><p>17. Даволаш натижаси: касалхонадан жавоб берилди: тузалди, бир оз яхшиланди, ўзгаришсиз, оғирлашган ҳолда, ўлди, бошқа муассасага ўтказилди</p><p>____________________________________________________________________</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;(даволаш муассасасининг номи)</p><p>Қабулхонада вафот этди, ҳомиладорликнинг 28-ҳафтасигача вафот этди, ҳомиладорликнинг 28-ҳафтасидан кейин вафот этди, туғиш олдидан вафот этди, туққандан сўнг вафот этди.</p><p>18. Меҳнат қобилияти тикланди, сустлашди, вақтинча йўқолди, мазкур касаллик сабабли бутунлай йўқолди, бошқа сабабларга кўра (чизинг).</p><p>19. Экспертизага юбориш учун хулоса:</p><p>20. Алоҳида белгилар:</p><p>21. Қабул қилинганда текширилди:а) Қон&nbsp;(RW,ОИТС&nbsp;ва бошқа), б)&nbsp;ахлат&nbsp;посеви,</p><p>&nbsp; &nbsp; &nbsp;в)педикулёз) &nbsp; г) мавҳум касалликлар ______________________________________</p><p>&nbsp;Даволаш шифокори__________________ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Бўлим мудири____________________</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Ф.И.О., &nbsp;имзо &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Ф.И.О., &nbsp; имзо</p><p><br></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<strong>БЎЛИМ ШИФОКОРИНИНГ КЎРИГИ<br>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; (текшириш ва даволаш режаси)</strong></p><p style="text-align: right">&nbsp;</p><table><tbody><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: right"><strong>&nbsp;</strong></p></td></tr></tbody></table><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;                &nbsp;<strong>&nbsp;КУНДАЛИК</strong></p><table><tbody><tr><td colspan="1" rowspan="40" colwidth="117"><p><strong>САНА</strong></p></td><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p><br></p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1"><p>&nbsp;</p></td></tr></tbody></table><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;                                  &nbsp; Беморнинг қабул бўлимидаги бирламчи кўрик варақаси</strong></p><p><strong>Сана:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Вақти:</strong></p><p><strong>1.Бемор:</strong></p><p><strong>2.Ёши:</strong></p><p><strong>3.Келтирилган усули:</strong></p><p><strong>Шикояти:</strong></p><p><strong>Жойлашуви:</strong></p><p><strong>Хусусияти:</strong></p><p><strong>Оғриқ хуруж бошланиши:</strong></p><p><strong>Бошқа шикоятлари:</strong></p><p><strong>Анамнез:</strong></p><p><strong>Status praesens( курик даврида органларда патологик ўзгаришлар борлиги)</strong></p><p><br></p><p><strong>Status localis:</strong></p><p><br></p><p><br></p><p><strong>Тахминий ташхис:</strong></p><p><br></p><p><br></p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;                                &nbsp; ТЕКШИРУВ РЕЖАСИ</strong></p><p><strong>1. Умумий қон тахлили:</strong></p><p><strong>2. Умумий пешоб тахлили:</strong></p><p><strong>3. Биохимик тахлил(кўрсаткичлари):</strong></p><p><strong>4.Коагулограмма:</strong></p><p><strong>5.ЭКГ:</strong></p><p><strong>6.Рентген текшируви:</strong></p><p><strong>7.УТТ:</strong></p><p><strong>8.ЭФГДС:</strong></p><p><strong>9.МСКТ/МРТ:</strong></p><p><strong>10.Мутахассислар маслахати:</strong></p><p><strong>11. Кўрсатилган ёрдам</strong></p><table><tbody><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: center">Буюрилган дори воситалари</p></td><td colspan="1" rowspan="1"><p style="text-align: right">Бажарилган</p></td><td colspan="1" rowspan="1" colwidth="110"><p>&nbsp; муолажа &nbsp;&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p>натижалари</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="413"><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;(номи,миқдори,юбориш усули)</p></td><td colspan="1" rowspan="1"><p style="text-align: center">Бажарилган вакти</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: center">Шифокор</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: center">Хамшира</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">1</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">2</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">3</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">4</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">5</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">6</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">7</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">8</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">9</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="79"><p style="text-align: right">10</p></td><td colspan="1" rowspan="1" colwidth="413"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="110"><p style="text-align: right">&nbsp;</p></td><td colspan="1" rowspan="1" colwidth="144"><p style="text-align: right">&nbsp;</p></td></tr></tbody></table><p><strong>Динамик ахволи:&nbsp;</strong></p><p><strong><br></strong></p><p><strong>Тавсиялар:</strong></p><p><strong><br></strong></p><p><strong>Ф.И.О шифокор:___________________________ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Мажмуа бўйича маьсул шахс:__________________________</strong></p><p><br></p><h3 style="text-align: center"><strong>ПАТОЛОГОАНАТОМ ХУЛОСАСИ</strong></h3><p>&nbsp;</p><table><tbody><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>&nbsp;</strong></p></td></tr></tbody></table><p>&nbsp;</p><p><strong>Патоморфологик хулоса (ташҳис)</strong></p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; а) Асосий:</strong></p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; б) Асосий касаллик асорати:&nbsp;</strong></p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; в) Йўлдош касалликлар:</strong></p><p><strong>&nbsp;</strong></p><p><strong>&nbsp;</strong></p><p><strong>&nbsp;</strong></p><p style="text-align: right"><strong>Шифокор&nbsp;Ф.И.О.,имзоси _______________________________</strong></p><p>&nbsp;</p><p><br></p>
`

export default ClientCard
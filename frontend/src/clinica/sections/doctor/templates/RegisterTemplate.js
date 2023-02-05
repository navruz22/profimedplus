import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

const RegisterTemplate = ({ setTemplate, template, createHandler }) => {
    return (
        <div className="my-4 shadow-lg">
            <table className="w-full text-sm border border-collapse">
                <thead className="bg-primary text-white">
                    <tr>
                        <th className="border bg-alotrade border-collapse p-2">
                            Nomi
                        </th>
                        <th className="border bg-alotrade border-collapse px-2">
                            Shablon
                        </th>
                        <th className="border bg-alotrade border-collapse px-2 text-center">Saqlash</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    <tr>
                        <td className="border border-collapse p-2">
                            <textarea
                                value={template.name}
                                placeholder="Shablon nomi kiritish"
                                className="w-full border outline-0 rounded-sm p-1"
                                onChange={(e) => {
                                    setTemplate({ ...template, name: e.target.value })
                                }}
                            >
                            </textarea>
                        </td>
                        <td className="border border-collapse p-2">
                            <textarea
                                value={template.template}
                                placeholder="Shablon kiritish uchun maydon"
                                className="w-full border outline-0 rounded-sm p-1"
                                onChange={(e) => {
                                    setTemplate({ ...template, template: e.target.value })
                                }}
                            >
                            </textarea>
                        </td>
                        <td className="border border-collapse text-center">
                            <button
                                className="px-8 py-1 bg-teal-500 text-white hover:bg-teal-600 rounded-sm "
                                onClick={createHandler}
                            >
                                <FontAwesomeIcon icon={faFloppyDisk} className="text-base" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
};

export default RegisterTemplate;

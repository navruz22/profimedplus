import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from "draftjs-to-html"
import { convertToHTML } from 'draft-convert';
import htmlToDraft from 'html-to-draftjs';

const RegisterTemplate = ({ setTemplate, template, createHandler, onChange, editorState }) => {
    console.log(template);

    return (
        <div className="my-4 shadow-lg">
            <div className="w-full text-sm border border-collapse">
                <div className="bg-alotrade">
                    <div className="border border-collapse p-2">
                        <div className='bg-alotrade py-1'>
                            <p className='text-center text-[18px] font-bold text-white'>Nomi</p>
                        </div>
                        <div className='bg-alotrade text-center py-1'>
                            <input
                                value={template.name}
                                placeholder="Shablon nomi kiritish"
                                className="w-[200px] border outline-0 rounded-sm p-1"
                                onChange={(e) => {
                                    setTemplate({ ...template, name: e.target.value })
                                }}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="border border-collapse p-2">
                        <div className='py-1'>
                            <p className='text-center text-[18px] font-bold text-white'>Shablon</p>
                        </div>
                        <div className='text-center py-1 px-4 bg-white'>
                            <Editor
                                editorState={editorState}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={onChange}
                                editorStyle={{ overflowY: "scroll", minHeight: "150px", maxHeight: "400px" }}
                            />
                        </div>
                    </div>
                    <div className="border border-collapse py-2 bg-white px-2 text-right">
                        <button
                            className="px-8 py-1 bg-teal-500 text-white hover:bg-teal-600 rounded-sm "
                            onClick={createHandler}
                        >
                            <FontAwesomeIcon icon={faFloppyDisk} className="text-base" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterTemplate;

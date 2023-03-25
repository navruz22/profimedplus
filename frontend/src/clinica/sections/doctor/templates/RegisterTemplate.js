import React, { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { EditorContent } from '@tiptap/react'
import {
    FaBold,
    FaHeading,
    FaItalic,
    FaListOl,
    FaListUl,
    FaQuoteLeft,
    FaRedo,
    FaStrikethrough,
    FaUnderline,
    FaUndo
} from "react-icons/fa";
import { BsTextCenter, BsTextLeft, BsTextRight } from "react-icons/bs"
import './style.css'


const RegisterTemplate = ({ setTemplate, template, createHandler, editor }) => {


    if (!editor) {
        return null;
    }
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
                                value={template?.name}
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
                            <div className="flex gap-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => editor.chain().focus().toggleBold().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaBold />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleItalic().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaItalic />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaUnderline />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleStrike().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaStrikethrough />
                                    </button>
                                    <button
                                        onClick={() =>
                                            editor.chain().focus().toggleHeading({ level: 2 }).run()
                                        }
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaHeading />
                                    </button>
                                    <button
                                        onClick={() =>
                                            editor.chain().focus().toggleHeading({ level: 3 }).run()
                                        }
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaHeading className="heading3" />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaListUl />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaListOl />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <FaQuoteLeft />
                                    </button>
                                </div>
                                <div>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().undo().run()}>
                                        <FaUndo />
                                    </button>
                                    <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().redo().run()}>
                                        <FaRedo />
                                    </button>
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <BsTextLeft />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <BsTextCenter />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                        className="bg-slate-200 rounded-g p-2"
                                    >
                                        <BsTextRight />
                                    </button>
                                    <button
                                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                    className="bg-slate-200 rounded-g p-2"
                                >
                                    justify
                                </button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().unsetTextAlign().run()}>unsetTextAlign</button>
                                </div>
                            </div>
                            <div className='flex gap-2 flex-wrap mt-2'>
                                <button className="bg-slate-200 rounded-g p-2"
                                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                                    }
                                >
                                    вставить таблицу
                                </button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addColumnBefore().run()}>
                                    добавить столбец перед
                                </button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addColumnAfter().run()}>добавить столбец после</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().deleteColumn().run()}>удалть столбец</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addRowBefore().run()}>добавить строку перед</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().addRowAfter().run()}>добавить строку после</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().deleteRow().run()}>удалить строку</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().deleteTable().run()}>удалить таблицу</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().mergeCells().run()}>объединить ячейки</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().splitCell().run()}>
                                    разделить ячейку</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
                                    переключить столбец заголовка
                                </button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
                                    переключить строку заголовка
                                </button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
                                    переключить ячейку заголовка
                                </button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().mergeOrSplit().run()}>объединить или разделить</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().setCellAttribute('colspan', 2).run()}>
                                    установить атрибут ячейки
                                </button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().fixTables().run()}>
                                    исправить таблицы</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().goToNextCell().run()}>перейти к следующей ячейке</button>
                                <button className="bg-slate-200 rounded-g p-2" onClick={() => editor.chain().focus().goToPreviousCell().run()}>
                                    перейти к предыдущей ячейке
                                </button>
                            </div>
                        </div>
                        <div className='bg-white w-[21cm]'>
                            <EditorContent editor={editor} />
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

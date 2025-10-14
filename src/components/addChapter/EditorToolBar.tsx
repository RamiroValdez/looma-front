import { toggleStrongCommand, toggleEmphasisCommand, wrapInHeadingCommand, wrapInOrderedListCommand, wrapInBulletListCommand } from '@milkdown/preset-commonmark';
import type {useEditor} from "@milkdown/react";
import { callCommand } from "@milkdown/kit/utils"
import React from "react";


interface Props {
    editorGetter?: ReturnType<typeof useEditor>['get'];
}

export default function EditorToolbar({ editorGetter }: Props) {

    const [isBoldActive, setIsBoldActive] = React.useState(false);
    const [isItalicActive, setIsItalicActive] = React.useState(false);

    const executeCommand = (cmd: any, payload?: any) => {
        if (!editorGetter) {
            console.log('Editor no disponible');
            return;
        }

        try {
            const editor = typeof editorGetter === 'function' ? editorGetter() : editorGetter;

            if (!editor || !editor.ctx) {
                console.log('Editor no tiene contexto');
                return;
            }

            if (payload !== undefined) {
                // comando con argumento (como el heading level)
                callCommand(cmd.key, payload)(editor.ctx);
            } else {
                callCommand(cmd.key)(editor.ctx);
            }
        } catch (error) {
            console.error('Error ejecutando comando:', error);
        }
    };

    const executeListCommand = (cmd: any) => {
        if (!editorGetter) {
            console.log('Editor no disponible');
            return;
        }

        try {
            const editor = typeof editorGetter === 'function' ? editorGetter() : editorGetter;

            if (!editor || !editor.ctx) {
                console.log('Editor no tiene contexto');
                return;
            }

            callCommand(cmd.key) (editor.ctx);
        }catch (error) {
            console.error('Error ejecutando comando:', error);
        }
    }

    const handleHeadingClick = (level: number) => {
        executeCommand(wrapInHeadingCommand, level);
    };

    return (
        <div className="flex items-center space-x-3 bg-[#4C3B63] text-white px-2 py-2 text-sm">
            <div className="flex outline rounded-lg p-1">
                <div className="flex items-center">
                    <button
                        onClick={() => {executeCommand(toggleStrongCommand); setIsBoldActive(!isBoldActive);}}
                        type="button"
                        className={`font-bold hover:text-gray-200 p-1 hover:bg-[#55426F] cursor-pointer rounded-l-lg border-r ${isBoldActive ? 'bg-[#55426F] text-gray-200' : ''}`}
                        disabled={!editorGetter}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/></svg>
                    </button>
                    <button
                        onClick={() => {executeCommand(toggleEmphasisCommand); setIsItalicActive(!isItalicActive);}}
                        type="button"
                        className={`italic hover:text-gray-200 p-1 hover:bg-[#55426F] border-r cursor-pointer ${isItalicActive ? 'bg-[#55426F] text-gray-200' : ''}`}
                        disabled={!editorGetter}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>
                    </button>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => handleHeadingClick(1)}
                        type="button"
                        className={`font-bold hover:text-gray-200 p-1 hover:bg-[#55426F] border-r cursor-pointer`}
                        disabled={!editorGetter}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M200-280v-400h80v160h160v-160h80v400h-80v-160H280v160h-80Zm480 0v-320h-80v-80h160v400h-80Z"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => handleHeadingClick(2)}
                        type="button"
                        className={`font-bold hover:text-gray-200 p-1 hover:bg-[#55426F] border-r cursor-pointer`}
                        disabled={!editorGetter}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M120-280v-400h80v160h160v-160h80v400h-80v-160H200v160h-80Zm400 0v-160q0-33 23.5-56.5T600-520h160v-80H520v-80h240q33 0 56.5 23.5T840-600v80q0 33-23.5 56.5T760-440H600v80h240v80H520Z"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => handleHeadingClick(3)}
                        type="button"
                        className={`font-bold hover:text-gray-200 p-1 hover:bg-[#55426F] border-r cursor-pointer`}
                        disabled={!editorGetter}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M120-280v-400h80v160h160v-160h80v400h-80v-160H200v160h-80Zm400 0v-80h240v-80H600v-80h160v-80H520v-80h240q33 0 56.5 23.5T840-600v240q0 33-23.5 56.5T760-280H520Z"/>
                        </svg>
                    </button>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => executeListCommand(wrapInBulletListCommand)}
                        type="button"
                        className={`font-bold hover:text-gray-200 p-1 hover:bg-[#55426F] border-r cursor-pointer`}
                        disabled={!editorGetter}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"/>
                        </svg>
                    </button>

                    <button
                        onClick={() => executeListCommand(wrapInOrderedListCommand)}
                        type="button"
                        className={`font-bold hover:text-gray-200 p-1 hover:bg-[#55426F] cursor-pointer rounded-r-lg`}
                        disabled={!editorGetter}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <button className="ml-auto bg-white text-black font-bold px-3 py-1 rounded-md hover:bg-[#5C17A6] hover:text-white">
                Subir PDF/Word
            </button>
        </div>
    );
}

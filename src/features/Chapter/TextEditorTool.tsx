import { Editor, rootCtx, defaultValueCtx  } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';
import { history } from '@milkdown/kit/plugin/history';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { Milkdown, useEditor } from '@milkdown/react';
import '@milkdown/theme-nord/style.css';
import '@milkdown/kit/prose/view/style/prosemirror.css';
import {useEffect, useState} from "react";
import { gfm } from '@milkdown/kit/preset/gfm';

interface TextEditorToolProps {
    chapterContent: string;
    onChange: (v: string) => void;
    setEditorRef?: (editorGetter: ReturnType<typeof useEditor>['get']) => void;
}

export default function TextEditorTool({chapterContent, onChange, setEditorRef}: TextEditorToolProps) {

    const [editorValue, setEditorValue] = useState(chapterContent);

    const { get } = useEditor((root) =>
        Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
                ctx.set(defaultValueCtx, editorValue);
                ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
                    setEditorValue(markdown); // actualiza estado local
                    onChange(markdown);      // actualiza estado del padre
                });
            })
            .config(nord)
            .use(commonmark) // Habilita Markdown internamente
            .use(history)
            .use(listener)
            .use(gfm)
    );

    useEffect(() => {
        if (setEditorRef) {
            const timer = setTimeout(() => {
                if (get) {
                    setEditorRef(get);
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [get, setEditorRef]);


    return (
        <div className="border border-gray-300 rounded-lg p-4 h-80 overflow-y-auto">
            <Milkdown />
        </div>
    );
}

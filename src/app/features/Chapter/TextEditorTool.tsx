import { Editor, rootCtx, defaultValueCtx  } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';
import { history } from '@milkdown/kit/plugin/history';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { Milkdown, useEditor } from '@milkdown/react';
import '@milkdown/theme-nord/style.css';
import '@milkdown/kit/prose/view/style/prosemirror.css';
import {useEffect, useRef, useState} from "react";
import { gfm } from '@milkdown/kit/preset/gfm';
import { editorViewCtx, parserCtx } from '@milkdown/kit/core';


interface TextEditorToolProps {
    chapterContent: string;
    onChange: (v: string) => void;
    setEditorRef?: (editorGetter: ReturnType<typeof useEditor>['get']) => void;
}

export default function TextEditorTool({chapterContent, onChange, setEditorRef}: TextEditorToolProps) {

    const [editorValue, setEditorValue] = useState(chapterContent);
    const scheduledUpdateRef = useRef<number | null>(null);

    const { get } = useEditor((root) =>
        Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
                ctx.set(defaultValueCtx, editorValue);
                ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
                    setEditorValue(markdown); 
                    onChange(markdown);     
                });
            })
            .config(nord)
            .use(commonmark) 
            .use(history)
            .use(listener)
            .use(gfm)
    );

    useEffect(() => {
        setEditorValue(chapterContent);
        const editor = get();
        if (!editor) return;
        if (chapterContent === editorValue) return;

        // Programar una actualización para el próximo frame, cuando el editor ya debería estar montado.
        if (scheduledUpdateRef.current) {
            cancelAnimationFrame(scheduledUpdateRef.current);
        }
        scheduledUpdateRef.current = requestAnimationFrame(() => {
            try {
                editor.action((ctx) => {
                    const view = ctx.get(editorViewCtx);
                    const parser = ctx.get(parserCtx);
                    const doc = parser(chapterContent);
                    if (doc) {
                        view.dispatch(view.state.tr.replaceWith(0, view.state.doc.content.size, doc));
                    }
                });
            } catch (_) {
                // Si aún no está inyectado editorView, omitimos silenciosamente.
            }
        });

        return () => {
            if (scheduledUpdateRef.current) {
                cancelAnimationFrame(scheduledUpdateRef.current);
                scheduledUpdateRef.current = null;
            }
        };
    }, [chapterContent, get, editorValue]);

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
        <div className="p-4 h-80 overflow-y-auto max-w-full ">
            <Milkdown />
        </div>
    );
}

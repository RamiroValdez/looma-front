import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { gfm } from '@milkdown/kit/preset/gfm';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/react';
import '@milkdown/theme-nord/style.css';
import '@milkdown/kit/prose/view/style/prosemirror.css';

interface TextViewerProps {
    content: string;
}

function htmlToMarkdown(input: string): string {
    return input
        .replace(/<br\s*\/?>/gi, '\n\n<br />\n\n')
}

export default function TextViewer({ content }: TextViewerProps) {

    const formattedContent = htmlToMarkdown(content);

    useEditor((root) =>
            Editor.make()
                .config((ctx) => {
                    ctx.set(rootCtx, root);
                    ctx.set(defaultValueCtx, formattedContent);
                    ctx.set(editorViewOptionsCtx, { editable: () => false });
                })
                .config(nord)
                .use(commonmark)
                .use(gfm),
        [formattedContent]
    );

    return (
            <Milkdown />
    );
}


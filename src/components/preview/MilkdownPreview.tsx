import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
    markdown: string;
};

export const MarkdownPreview = ({ markdown }: Props) => {
    return (
        <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
            </ReactMarkdown>
        </div>
    );
};


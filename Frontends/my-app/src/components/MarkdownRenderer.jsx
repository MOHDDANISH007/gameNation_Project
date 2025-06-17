// components/MarkdownRenderer.jsx
'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-4xl font-bold text-purple-600 my-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold text-blue-600 my-3" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-2xl text-teal-500 my-2" {...props} />,
        p: ({ node, ...props }) => <p className="text-base text-gray-800 my-1" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

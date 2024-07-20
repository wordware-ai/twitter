import { FC, memo } from 'react'
import ReactMarkdown, { Options } from 'react-markdown'
import remarkGfm from 'remark-gfm'

// import { cn } from '@/lib/utils'

export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.className === nextProps.className,
)
export const Markdown: FC<{ content: string }> = ({ content }) => {
  return (
    <MemoizedReactMarkdown
      // className={cn('prose-sm prose-p:leading-relaxed prose-pre:p-0 break-words')}
      remarkPlugins={[remarkGfm]}
      components={{
        ul: ({ ...props }) => (
          <ul
            className="mb-1 list-disc last:mb-0"
            {...props}
          />
        ),
        ol: ({ ...props }) => (
          <ol
            className="mb-1 list-decimal last:mb-0"
            {...props}
          />
        ),
        li: ({ children, ...props }) => (
          <li
            className="mb-1 last:mb-0"
            {...props}>
            {children}
          </li>
        ),

        h1: ({ ...props }) => (
          <h1
            className="mb-2 mt-1 text-xl font-bold last:mb-0"
            {...props}
          />
        ),
        h2: ({ ...props }) => (
          <h2
            className="mb-2 mt-1 text-lg font-bold last:mb-0"
            {...props}
          />
        ),
        h3: ({ ...props }) => (
          <h3
            className="mb-2 mt-1 text-base font-bold last:mb-0"
            {...props}
          />
        ),
        p: ({ ...props }) => (
          <p
            className="mb-2 last:mb-0"
            {...props}
          />
        ),
        strong: ({ ...props }) => (
          <strong
            className="font-bold"
            {...props}
          />
        ),
      }}>
      {content}
    </MemoizedReactMarkdown>
  )
}

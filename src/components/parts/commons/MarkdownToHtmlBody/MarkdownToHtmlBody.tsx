import React, { VFC } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import 'github-markdown-css';

import { Box, styled } from '@mui/system';

type Props = {
  content: string;
};

export const MarkdownToHtmlBody: VFC<Props> = ({ content }) => {
  return (
    <StyledMarkdownBody className="markdown-body">
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
        plugins={[gfm]}
        unwrapDisallowed={false}
      >
        {content}
      </ReactMarkdown>
    </StyledMarkdownBody>
  );
};

const StyledMarkdownBody = styled(Box)`
  &.markdown-body {
    color: ${(props) => props.theme.palette.textColor.main};
    background-color: whitesmoke;
    p {
      white-space: pre-wrap;
    }
    pre {
      background-color: rgb(30, 30, 30);
    }
    code {
      color: #white;
    }
    p::selection,
    li::selection,
    h1::selection,
    h2::selection,
    h3::selection,
    h4::selection,
    h5::selection,
    h6::selection,
    code::selection {
      background-color: #b4d5fe;
      color: #333;
    }
  }
`;

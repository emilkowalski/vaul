import * as React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';

export async function Code({ code }: { code: string }) {
  const highlightedCode = await highlightCode(code);

  return (
    <section
      dangerouslySetInnerHTML={{
        __html: highlightedCode,
      }}
    />
  );
}

async function highlightCode(code: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      defaultLang: 'tsx',
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(code);

  return String(file);
}

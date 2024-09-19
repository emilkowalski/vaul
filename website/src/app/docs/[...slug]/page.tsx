import fs from 'node:fs';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import { useMDXComponents } from '../../../../mdx-components';
import rehypePreviewCodeBlock from '@/utils/rehype-preview-code-block';
import { visit } from 'unist-util-visit';
import { UnistNode, UnistTree } from '../../../utils/unist';
import { kebabCase } from '@/utils/kebab-case';
import { OnThisPage } from '@/app/components/on-this-page';

export const runtime = 'nodejs';
export const dynamic = 'force-static';

const contentSource = 'src/app/docs/content';

export function generateStaticParams() {
  const targets = fs.readdirSync(path.join(process.cwd(), contentSource), { recursive: true });
  const files: string[] = [];

  for (const target of targets) {
    if (fs.lstatSync(path.join(process.cwd(), contentSource, target)).isDirectory()) {
      continue;
    }
    files.push(target);
  }

  return files.map((file) => ({
    slug: file.replace('.mdx', '').split('/'),
  }));
}

interface Params {
  params: {
    slug: string[];
  };
}

const options = {
  keepBackground: false,
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
};

export default async function Page({ params }: Params) {
  const source = fs.readFileSync(path.join(process.cwd(), contentSource, params.slug.join('/')) + '.mdx', 'utf8');

  const components = useMDXComponents({});

  let headings = [] as { value: string; id: string }[];

  function extractHeadings() {
    return (tree: UnistTree) => {
      const treeHeadings: { value: string; id: string }[] = [];

      visit(tree, 'heading', (node: UnistNode) => {
        const text = node.children!.map((child) => child.value).join('');
        const id = kebabCase(text);

        treeHeadings.push({ value: text, id });
      });

      headings = treeHeadings;
    };
  }

  // Compile MDX content and extract headings
  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypePreviewCodeBlock, [rehypePrettyCode, options]],
        remarkPlugins: [extractHeadings],
      },
      parseFrontmatter: true,
    },
    components,
  });

  // TypeScript variables for frontmatter
  const pageTitle = frontmatter.title as string;
  const pageDescription = frontmatter.description as string;

  return (
    <div className="flex pt-16 px-8">
      <div className="max-w-[672px] w-full mx-auto px-4">
        <h1 className="text-[32px] font-semibold mb-6 text-primary" style={{ letterSpacing: '-0.03em' }}>
          {pageTitle}
        </h1>
        <p className="text-secondary text-[15px] mb-6">{pageDescription}</p>
        <div data-main-content className="flex flex-col">
          {content}
        </div>
      </div>
      <OnThisPage headings={headings} />{' '}
    </div>
  );
}

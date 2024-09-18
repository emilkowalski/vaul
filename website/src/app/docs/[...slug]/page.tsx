import fs from 'node:fs';
import path from 'node:path';
// import { useMDXComponents } from '@/mdx-components';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import { useMDXComponents } from '../../../../mdx-components';
import rehypePreviewCodeBlock from '@/utils/rehype-preview-code-block';

export const runtime = 'nodejs';
export const dynamic = 'force-static';

const contentSource = 'src/app/docs/content';

export function generateStaticParams() {
  // Recursively fetech all files in the content directory
  const targets = fs.readdirSync(path.join(process.cwd(), contentSource), {
    recursive: true,
  });

  // Declare an empty array to store the files
  const files = [];

  for (const target of targets) {
    // If the target is a directory, skip it, otherwise add it to the files array
    if (fs.lstatSync(path.join(process.cwd(), contentSource, target.toString())).isDirectory()) {
      continue;
    }

    // Built the files array
    files.push(target);
  }

  // Return the files array with the slug (filename without extension)
  return files.map((file) => ({
    slug: file.toString().replace('.mdx', '').split('/'),
  }));
}

interface Params {
  params: {
    slug: string[];
  };
}

const options = {
  // See Options section below.
};

export default async function Page({ params }: Params) {
  // Read the MDX file from the content source direectory
  const source = fs.readFileSync(path.join(process.cwd(), contentSource, params.slug.join('/')) + '.mdx', 'utf8');

  // MDX accepts a list of React components
  const components = useMDXComponents({});

  // We compile the MDX content with the frontmatter, components, and plugins
  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypePreviewCodeBlock, [rehypePrettyCode, options]],
      },
      parseFrontmatter: true,
    },
    components,
  });

  // (Optional) Set some easy variables to assign types, because TypeScript
  const pageTitle = frontmatter.title as string;
  const pageDescription = frontmatter.description as string;

  // Render the page
  return (
    <>
      <h1 className="text-[32px] font-semibold mb-6 text-primary" style={{ letterSpacing: '-0.03em' }}>
        {pageTitle}
      </h1>
      <p className="text-secondary text-[15px]">{pageDescription}</p>
      <div>{content}</div>
    </>
  );
}

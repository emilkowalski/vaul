import path from 'path';
import fs from 'fs';
import { visit } from 'unist-util-visit';
import { UnistNode, UnistTree } from './unist';

const rehypePreviewCodeBlock = () => (tree: UnistTree) => {
  // @ts-ignore
  visit(tree, (node: UnistNode) => {
    if (node.name === 'Preview') {
      const file = getAttribute(node, 'file');

      if (typeof file === 'string') {
        const filePath = `${process.cwd()}/src/app/components/demos/${file}.tsx`;

        if (fileExists(filePath)) {
          let source = fs.readFileSync(path.join(filePath), 'utf8');

          // Apply props to the node itself
          node.attributes = node.attributes || [];
          node.attributes.push({
            name: 'source',
            value: source,
            type: 'mdxJsxAttribute',
          });
        }
      }
    }
  });
};

function getAttribute(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)?.value;
}

function fileExists(path: string) {
  try {
    fs.accessSync(path);
    return true;
  } catch (e) {
    return false;
  }
}

export default rehypePreviewCodeBlock;

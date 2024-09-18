import { u } from 'unist-builder';
import { UnistNode } from './unist';

interface Args {
  name: string;
  props?: Record<string, unknown>;
  children?: UnistNode[];
}

/**
 * A tiny wrapper around unist-builder to easily create
 * a node that is an HTML element or a React component.
 */
export const mdxElement = ({ name, props = {}, children = [] }: Args): UnistNode => {
  const isHtmlElement = name.toLowerCase() === name;
  if (isHtmlElement) {
    return u('element', { tagName: name, properties: props }, children);
  }

  return u('mdxJsxFlowElement', {
    name,
    children,
    attributes: [
      ...Object.entries(props).map(([name, value]) => ({
        name,
        type: 'mdxJsxAttribute',
        value: typeof value === 'boolean' ? boolean(value) : value,
      })),
    ],
    data: { _mdxExplicitJsx: true },
  });
};

const boolean = (value: boolean) => ({
  type: 'mdxJsxAttributeValueExpression',
  data: {
    estree: {
      sourceType: 'module',
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'Literal',
            value,
          },
        },
      ],
    },
  },
});

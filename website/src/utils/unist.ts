import type { Node } from 'unist';

export interface UnistTree extends Node {
  children: UnistNode[];
}

export interface UnistNode extends Node {
  type: string;
  name?: string;
  value?: string;
  tagName?: string;
  depth?: number;
  attributes?: UnistNodeAttr[];
  properties?: Record<string, unknown>;
  children?: UnistNode[];
  data?: {
    meta?: string;
    _mdxExplicitJsx?: boolean;
  };
}

export interface UnistNodeAttr {
  type: string;
  name: string;
  value: unknown;
}

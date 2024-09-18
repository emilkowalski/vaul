import SnapPoints from '@/app/components/demos/snap-points';
import { Preview } from '@/app/components/preview/preview';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="text-[32px] font-semibold mb-6 text-primary" style={{ letterSpacing: '-0.03em' }} {...props} />
    ),
    p: (props) => <p className="text-[15px] text-[#505058]" {...props} />,
    Preview,
    SnapPoints,
    ...components,
  };
}

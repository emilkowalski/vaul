import SnapPoints from '@/app/components/demos/snap-points';
import { Preview } from '@/app/components/preview/preview';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="text-[32px] font-semibold mb-6 text-primary" style={{ letterSpacing: '-0.03em' }} {...props} />
    ),
    h2: (props) => (
      <h2
        className="text-[24px] mt-12 font-semibold mb-4 text-primary"
        style={{ letterSpacing: '-0.03em' }}
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="text-[16px] mt-8 font-semibold mb-3 text-primary"
        style={{ letterSpacing: '-0.03em' }}
        {...props}
      />
    ),
    p: (props) => <p className="text-[15px] text-[#505058]" {...props} />,
    pre: (props) => <pre className="shadow-sm p-4 rounded-lg my-6" {...props} />,
    Preview,
    SnapPoints,
    ...components,
  };
}

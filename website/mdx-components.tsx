import SnapPoints from '@/app/components/demos/snap-points';
import SnapPointsNoModal from '@/app/components/demos/snap-points-no-modal';
import SnapPointsSequential from '@/app/components/demos/snap-points-sequential';
import NestedDrawers from '@/app/components/demos/nested-drawers';
import DefaultDrawer from '@/app/components/demos/default-drawer';
import WithScaledBackground from '@/app/components/demos/with-scaled-background';
import SideDrawer from '@/app/components/demos/side-drawer';
import { Preview } from '@/app/components/preview/preview';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
      <h1 className="text-[32px] font-semibold mb-6 text-primary" style={{ letterSpacing: '-0.03em' }} {...props} />
    ),
    h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
      <h2
        className="text-[24px] mt-12 font-semibold mb-4 text-primary"
        style={{ letterSpacing: '-0.03em' }}
        {...props}
      />
    ),
    h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
      <h3
        className="text-[16px] mt-8 font-semibold mb-3 text-primary"
        style={{ letterSpacing: '-0.03em' }}
        {...props}
      />
    ),
    p: (props: React.HTMLProps<HTMLParagraphElement>) => <p className="text-[15px] text-secondary" {...props} />,
    pre: (props: React.HTMLProps<HTMLPreElement>) => <pre className="shadow-sm p-4 rounded-lg my-6" {...props} />,
    Preview,
    SnapPoints,
    SnapPointsNoModal,
    SnapPointsSequential,
    NestedDrawers,
    DefaultDrawer,
    WithScaledBackground,
    SideDrawer,
    ...components,
  };
}

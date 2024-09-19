import SnapPoints from '@/app/components/demos/snap-points';
import SnapPointsNoModal from '@/app/components/demos/snap-points-no-modal';
import SnapPointsSequential from '@/app/components/demos/snap-points-sequential';
import NestedDrawers from '@/app/components/demos/nested-drawers';
import DefaultDrawer from '@/app/components/demos/default-drawer';
import WithScaledBackground from '@/app/components/demos/with-scaled-background';
import SideDrawer from '@/app/components/demos/side-drawer';
import { Preview } from '@/app/components/preview/preview';
import type { MDXComponents } from 'mdx/types';
import { kebabCase } from '@/utils/kebab-case';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
      <h1 className="text-[32px] font-semibold mb-6 text-primary" style={{ letterSpacing: '-0.03em' }} {...props} />
    ),
    h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
      <a
        href={`#${kebabCase(String(props.children))}`}
        className="text-[24px] mt-12 font-semibold mb-4 text-primary inline-block group relative w-fit"
        style={{ letterSpacing: '-0.03em' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute right-[-24px] top-[10px] opacity-0 shadow-none outline-none group-hover:opacity-100 group-focus:opacity-100"
        >
          <path
            d="M10 19.0004L9.82843 19.1719C8.26634 20.734 5.73368 20.734 4.17158 19.1719L3.82843 18.8288C2.26634 17.2667 2.26633 14.734 3.82843 13.1719L7.17158 9.8288C8.73368 8.2667 11.2663 8.2667 12.8284 9.8288L13.1716 10.1719C13.8252 10.8256 14.2053 11.6491 14.312 12.5004"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.68799 12.5004C9.79463 13.3516 10.1748 14.1752 10.8284 14.8288L11.1715 15.1719C12.7336 16.734 15.2663 16.734 16.8284 15.1719L20.1715 11.8288C21.7336 10.2667 21.7336 7.73404 20.1715 6.17194L19.8284 5.8288C18.2663 4.2667 15.7336 4.2667 14.1715 5.8288L14 6.00037"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h2 style={{ scrollMarginTop: '32px' }} id={kebabCase(String(props.children))}>
          {props.children}
        </h2>
      </a>
    ),
    h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
      <a
        href={`#${kebabCase(String(props.children))}`}
        className="text-[16px] mt-8 font-semibold mb-3 text-primary inline-block w-fit group relative"
        style={{ letterSpacing: '-0.03em' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute right-[-24px] top-[4px] opacity-0 shadow-none outline-none group-hover:opacity-100 group-focus:opacity-100"
        >
          <path
            d="M10 19.0004L9.82843 19.1719C8.26634 20.734 5.73368 20.734 4.17158 19.1719L3.82843 18.8288C2.26634 17.2667 2.26633 14.734 3.82843 13.1719L7.17158 9.8288C8.73368 8.2667 11.2663 8.2667 12.8284 9.8288L13.1716 10.1719C13.8252 10.8256 14.2053 11.6491 14.312 12.5004"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.68799 12.5004C9.79463 13.3516 10.1748 14.1752 10.8284 14.8288L11.1715 15.1719C12.7336 16.734 15.2663 16.734 16.8284 15.1719L20.1715 11.8288C21.7336 10.2667 21.7336 7.73404 20.1715 6.17194L19.8284 5.8288C18.2663 4.2667 15.7336 4.2667 14.1715 5.8288L14 6.00037"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h3 style={{ scrollMarginTop: '32px' }} id={kebabCase(String(props.children))}>
          {props.children}
        </h3>
      </a>
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

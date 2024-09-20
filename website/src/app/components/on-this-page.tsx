'use client';

import React from 'react';
import { useActiveScrollElement } from '../hooks/use-active-scroll-element';
import clsx from 'clsx';

export function OnThisPage({ headings }: { headings: { id: string; value: string }[] }) {
  const ref = React.useRef<HTMLUListElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const ids = React.useMemo(() => headings.map((h) => h.id), [headings]);
  const activeHeading = useActiveScrollElement(ids);

  React.useEffect(() => {
    const link = ref.current?.querySelector<HTMLElement>(`a[href="#${activeHeading}"]`);

    if (link) {
      setStyle({
        top: link.offsetTop + 'px',
        height: link.offsetHeight + 'px',
      });
    }
  }, [activeHeading]);

  return (
    <aside className="w-[220px] hidden md:block sticky top-16 h-[calc(100vh-8rem)]">
      {headings.length > 0 ? (
        <>
          <span className="text-[13px] text-secondary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M2.75 12H21.25M2.75 5.75H21.25M2.75 18.25H11.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            On this page
          </span>
          <ul className="mt-4 dotted-left dotted space-y-1 relative" ref={ref}>
            <div
              aria-hidden
              className="w-[3px] h-5 top-[5px] bg-primary absolute left-0 rounded-full translate-y-[-3px] -translate-x-[1px]"
              style={{ top: style.top, transition: '0.25s ease top' }}
            />
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={clsx('text-[13px] hover:text-primary transition-colors ml-5', {
                    'text-primary': activeHeading === heading.id,
                    'text-secondary': activeHeading !== heading.id,
                  })}
                >
                  {heading.value}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </aside>
  );
}

'use client';

import { useMemo } from 'react';

export function OnThisPage() {
  const headings = useMemo(() => {
    const contentArea = document.querySelector('[data-main-content]');
    if (!contentArea) return [];

    const headings = Array.from(contentArea.querySelectorAll('h2, h3')).map((heading) => ({
      id: heading.id,
      text: heading.textContent,
    }));

    return headings;
  }, []);

  return (
    <aside className="w-[220px] hidden md:block">
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
    </aside>
  );
}

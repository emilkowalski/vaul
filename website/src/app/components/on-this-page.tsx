'use client';

export function OnThisPage({ headings }: { headings: { id: string; value: string }[] }) {
  return (
    <aside className="w-[220px] hidden md:block sticky top-16 h-[calc(100vh-4rem)]">
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
          <ul className="mt-4 dotted-left dotted space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className="text-[13px] text-secondary hover:text-primary transition-colors ml-5"
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

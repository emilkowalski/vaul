import Link from 'next/link';

export function Sidebar() {
  return (
    <nav className="px-4 py-5 dotted dotted-right bg-subtle sticky top-0 h-screen hidden md:block">
      <div className="flex gap-1 items-baseline dotted-bottom pb-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold inline-block">Vaul</span>
        </Link>
        <span className="text-xs text-gray-600 mt-0.5">
          by <Link href="/">Emil Kowalski</Link>
        </span>
      </div>
      <div className="mt-5">
        {NAV_ITEMS.map((section, index) => (
          <div>
            <span className="text-xs text-tertiary font-medium inline-block mb-2">{section.name}</span>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="h-7 flex items-center font-medium text-[13px] text-secondary px-2 -ml-2 hover:bg-el-hover-bg rounded-md"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            {index === NAV_ITEMS.length - 1 ? null : (
              <div aria-hidden className="h-px w-[90%] mx-auto dotted-bottom pb-5 mb-5" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

const NAV_ITEMS = [
  {
    name: 'Basics',
    items: [
      {
        name: 'Getting Started',
        href: '/docs/getting-started',
      },
      {
        name: 'Anatomy',
        href: '/docs/anatomy',
      },
      {
        name: 'API',
        href: '/docs/api',
      },
    ],
  },
  {
    name: 'Examples',
    items: [
      {
        name: 'Default',
        href: '/docs/default',
      },
      {
        name: 'Scaled Background',
        href: '/docs/scaled-background',
      },
      {
        name: 'Snap Points',
        href: '/docs/snap-points',
      },
      {
        name: 'Nested Drawers',
        href: '/docs/nested-drawers',
      },
      {
        name: 'Non-dismissible',
        href: '/docs/non-dismissible',
      },
      {
        name: 'Non-modal',
        href: '/docs/non-modal',
      },
    ],
  },
];

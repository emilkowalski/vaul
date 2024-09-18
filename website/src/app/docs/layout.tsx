import Link from 'next/link';
import { Inter } from 'next/font/google';
import clsx from 'clsx';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={clsx('bg-gray-50 grid grid-cols-[220px,1fr]', inter.className)}>
      <nav className="px-4 py-5 dotted dotted-right">
        <div className="flex gap-1 items-baseline">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-semibold inline-block">Vaul</span>
          </Link>
          <span className="text-xs text-gray-600 mt-0.5">
            by <Link href="/">Emil Kowalski</Link>
          </span>
        </div>
      </nav>
      <div className="flex pt-16 px-8">
        <main className="max-w-[640px] w-full mx-auto bg-gray-50">{children}</main>
        <aside className="w-[220px]">
          <span className="text-[13px] text-gray-700 flex items-center gap-2">
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
      </div>
    </div>
  );
}

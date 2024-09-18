import Link from 'next/link';
import { Inter } from 'next/font/google';
import clsx from 'clsx';
import localFont from 'next/font/local';
import { Sidebar } from '../components/sidebar';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

const commitMono = localFont({
  src: './commit-mono.woff2',
  variable: '--font-mono',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={clsx('bg-main grid grid-cols-[220px,1fr] min-h-[300vh]', inter.className, commitMono.variable)}>
      <Sidebar />
      <div className="flex pt-16 px-8">
        <main className="max-w-[672px] w-full mx-auto px-4">{children}</main>
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

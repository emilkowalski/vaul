import Link from 'next/link';
import { Inter } from 'next/font/google';
import clsx from 'clsx';
import localFont from 'next/font/local';
import { Sidebar } from '../components/sidebar';
import { ThemeProvider } from 'next-themes';
import { OnThisPage } from '../components/on-this-page';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

const commitMono = localFont({
  src: './commit-mono.woff2',
  variable: '--font-mono',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log(children);

  return (
    <div className={clsx('bg-main md:grid grid-cols-[220px,1fr] min-h-[300vh]', inter.className, commitMono.variable)}>
      <Sidebar />
      <div className="flex pt-16 px-8">
        <div className="max-w-[672px] w-full mx-auto px-4">{children}</div>
        <OnThisPage />
      </div>
    </div>
  );
}

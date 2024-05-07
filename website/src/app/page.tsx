import { Hero } from './components/hero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vaul',
  description: 'Drawer component for React.',
  openGraph: {
    title: 'Vaul',
    description: 'Drawer component for React.',
    url: 'https://vaul.emilkowal.ski',
    siteName: 'Emil Kowalski',
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    title: 'Emil Kowalski',
    card: 'summary_large_image',
  },
  themeColor: '#000000',
};

export default function Home() {
  return (
    <div className="antialiased">
      <Hero />
    </div>
  );
}

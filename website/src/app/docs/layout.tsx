import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 grid grid-cols-[220px,1fr]">
      <nav className="px-4 py-5 dotted dotted-right">
        <div className="flex gap-1 items-baseline">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-medium inline-block">Vaul</span>
          </Link>
          <span className="text-xs text-gray-600 mt-0.5">
            by <Link href="/">Emil Kowalski</Link>
          </span>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

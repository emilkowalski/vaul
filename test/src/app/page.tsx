'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <div className="w-scareen h-screen bg-white p-8 flex flex-col justify-center gap-6 items-center">
      <Link href="/with-scaled-background">With scaled background</Link>
      <Link href="/without-scaled-background">Without scaled background</Link>
      <Link href="/with-snap-points">With snap points</Link>
      <Link href="/with-modal-false">With modal false</Link>
      <Link href="/scrollable-with-inputs">Scrollable with inputs</Link>
      <Link href="/nested-drawers">Nested drawers</Link>
      <Link href="/non-dismissible">Non-dismissible</Link>
      <Link href="/initial-snap">Initial snap</Link>
      <Link href="/controlled">Controlled</Link>
      <Link href="/default-open">Controlled</Link>
    </div>
  );
}

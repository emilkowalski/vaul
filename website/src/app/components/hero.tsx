'use client';

import { usePathname } from 'next/navigation';
import { Drawer } from 'vaul';

export function Hero() {
  const pathname = usePathname();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute top-0 w-[1000px] z-10 h-[400px] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.15] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#A4A4A3, transparent 50%)' }}
      />
      <svg
        className="absolute pointer-events-none inset-0 h-full w-full stroke-gray-200 opacity-50 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
        aria-hidden
      >
        <defs>
          <pattern
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>
      <div className="max-w-2xl mx-auto text-center pt-64">
        <div className="flex flex-col relative">
          <h1 className="text-7xl font-semibold mb-4 relative">Vaul</h1>
          <p className="text-gray-600 text-xl">Drawer component for React.</p>
        </div>
        <div className="flex gap-4 justify-center mt-6">
          <Drawer.Root snapPoints={pathname.includes('test') ? undefined : [0.2, 0.5, 1]}>
            <Drawer.Trigger asChild>
              <button
                type="button"
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Open Drawer
              </button>
            </Drawer.Trigger>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Portal>
              <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[10px]">
                <div className="max-w-md w-full mx-auto flex flex-col p-4 rounded-t-[10px]">
                  <input className="border border-gray-400 my-8" placeholder="Input" />
                  <p>
                    But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was
                    born and I will give you a complete account of the system, and expound the actual teachings of the
                    great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or
                    avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue
                    pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who
                    loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally
                    circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial
                    example, which of us ever undertakes laborious physical exercise, except to obtain some advantage
                    from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no
                    annoying consequences, or one who avoids a pain that produces no resultant pleasure?
                  </p>
                  <input className="border border-gray-400 my-8" placeholder="Input" />
                  <p>
                    On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and
                    demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee
                    the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their
                    duty through weakness of will, which is the same as saying through shrinking from toil and pain.
                    These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice
                    is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is
                    to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty
                    or the obligations of business it will frequently occur that pleasures have to be repudiated and
                    annoyances accepted. The wise man therefore always holds in these matters to this principle of
                    selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid
                    worse pains.
                  </p>
                  <input className="border border-gray-400 my-8" placeholder="Input" />
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
          <a
            href="https://github.com/emilkowalski/vaul"
            className="font-semibold text-sm px-4 py-2.5 hover:bg-gray-100 rounded-full"
            target="_blank"
          >
            GitHub <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

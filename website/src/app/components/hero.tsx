'use client';

import { Drawer } from 'vaul';

export function MyDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed z-30 inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-40 mt-24 flex h-full max-h-[90%] flex-col rounded-t-[10px]">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <div className="max-w-md mx-auto overflow-y-auto flex flex-col h-32">
              <Drawer.Title className="font-medium mb-4">Unstyled drawer for React.</Drawer.Title>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-8">
                It uses{' '}
                <a
                  href="https://www.radix-ui.com/docs/primitives/components/dialog"
                  className="underline"
                  target="_blank"
                >
                  Radix's Dialog primitive
                </a>{' '}
                under the hood and is inspired by{' '}
                <a
                  href="https://twitter.com/devongovett/status/1674470185783402496"
                  className="underline"
                  target="_blank"
                >
                  this tweet.
                </a>
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
              <p className="text-zinc-600 mb-2">
                This component can be used as a replacement for a Dialog on mobile and tablet devices.
              </p>
            </div>
          </div>
          <div className="p-4 bg-zinc-100 border-t border-zinc-200 mt-auto">
            <div className="flex gap-6 justify-end max-w-md mx-auto">
              <a
                className="text-xs text-zinc-600 flex items-center gap-0.25"
                href="https://github.com/emilkowalski/vaul"
                target="_blank"
              >
                GitHub
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  width="16"
                  aria-hidden="true"
                  className="w-3 h-3 ml-1"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                </svg>
              </a>
              <a
                className="text-xs text-zinc-600 flex items-center gap-0.25"
                href="https://twitter.com/emilkowalski_"
                target="_blank"
              >
                Twitter
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  width="16"
                  aria-hidden="true"
                  className="w-3 h-3 ml-1"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                </svg>
              </a>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function Hero() {
  return (
    <div className="bg-zinc-100 flex min-h-screen flex-col">
      <div className="grid grid-cols-1 gap-32">
        {[...Array(10)].map((_, idx) => (
          <MyDrawer key={`key-${idx}`}>
            <button className="mb-1 h-32 w-full bg-red-100">Drawer {idx}</button>
          </MyDrawer>
        ))}
        <p>lorem</p>
      </div>
    </div>
  );
}

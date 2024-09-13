'use client';

import { useState } from 'react';
import { Drawer } from 'vaul';

export default function Page() {
  return (
    <div className="w-screen h-screen bg-white p-8 flex justify-center items-center" data-vaul-drawer-wrapper="">
      <Drawer.Root defaultOpen>
        <Drawer.Trigger asChild>
          <button data-testid="trigger" className="text-2xl">
            Open Drawer
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay data-testid="overlay" className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            data-testid="content"
            className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0"
          >
            <Drawer.Close data-testid="drawer-close">Close</Drawer.Close>
            <button data-testid="controlled-close" className="text-2xl">
              Close
            </button>
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
              <div className="max-w-md mx-auto">
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
                    Radix&apos;s Dialog primitive
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button data-testid="fully-controlled-trigger" className="text-2xl">
            Open Drawer
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay data-testid="overlay" className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            data-testid="fully-controlled-content"
            className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0"
          >
            <Drawer.Close data-testid="drawer-close">Close</Drawer.Close>
            <button data-testid="controlled-close" className="text-2xl">
              Close
            </button>
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
              <div className="max-w-md mx-auto">
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
                    Radix&apos;s Dialog primitive
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
    </div>
  );
}

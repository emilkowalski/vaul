'use client';

import { Drawer } from 'vaul';
import React from 'react';

import { Background } from './background';
import Header from './header';

export function Hero() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 bg-[#edece9]">
      <Background />
      <div className="relative z-10 flex items-center justify-center flex-col w-full h-full text-center">
        <div className="flex flex-col relative w-full">
          <Header />
          <p className="text-gray-600 text-xl">A modal component built on Vaul</p>
        </div>
        <div className="flex gap-4 justify-center mt-6">
          <Drawer.Root shouldScaleBackground>
            <Drawer.Trigger asChild>
              <button
                type="button"
                className="rounded-lg text-white bg-[#1b3e35] px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-500 hover:opacity-80"
              >
                Open Modal
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-[#060E0C]/60" />
              <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0 outline-none">
                <div className="p-4 bg-white rounded-t-[10px] flex-1">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                  <div className="max-w-md mx-auto">
                    <Drawer.Title className="font-medium mb-4">Drawer for React.</Drawer.Title>
                    <p className="text-gray-600 mb-2">
                      This component can be used as a Dialog replacement on mobile and tablet devices. You can read
                      about why and how it was built{' '}
                      <a
                        target="_blank"
                        className="underline"
                        href="https://emilkowal.ski/ui/building-a-drawer-component"
                      >
                        here
                      </a>
                      .
                    </p>
                    <p className="text-gray-600 mb-2">
                      It comes unstyled, has gesture-driven animations, and is made by{' '}
                      <a href="https://emilkowal.ski/" className="underline" target="_blank">
                        Emil Kowalski
                      </a>
                      .
                    </p>
                    <p className="text-gray-600 mb-8">
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
                  </div>
                </div>
                <div className="p-4 bg-gray-100 border-t border-gray-200 mt-auto">
                  <div className="flex gap-6 justify-end max-w-md mx-auto">
                    <a
                      className="text-xs text-gray-600 flex items-center gap-0.25"
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
                      className="text-xs text-gray-600 flex items-center gap-0.25"
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
          <a
            href="https://github.com/emilkowalski/vaul"
            className="font-medium text-sm px-4 py-2.5 border border-[#1b3e35]/0 hover:border-[#1b3e35] rounded-lg"
            target="_blank"
          >
            GitHub <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

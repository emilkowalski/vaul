'use client';

import { Drawer } from 'vaul';

export default function Page() {
  return (
    <div className="w-screen h-screen bg-white p-8 flex justify-center items-center" data-vaul-drawer-wrapper="">
      <Drawer.Root shouldScaleBackground>
        <Drawer.Trigger asChild>
          <button data-testid="trigger">Open Drawer</button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            data-testid="content"
            className="bg-gray-100 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%] fixed bottom-0 left-0 right-0"
          >
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="font-medium mb-4">Drawer for React.</Drawer.Title>
                <p className="text-gray-600 mb-2">
                  This component can be used as a Dialog replacement on mobile and tablet devices.
                </p>
                <p className="text-gray-600 mb-2">It comes unstyled and has gesture-driven animations.</p>
                <p className="text-gray-600 mb-6">
                  It uses{' '}
                  <a
                    href="https://www.radix-ui.com/docs/primitives/components/dialog"
                    className="underline"
                    target="_blank"
                  >
                    Radix&rsquo;s Dialog primitive
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
                <Drawer.NestedRoot>
                  <Drawer.Trigger
                    data-testid="nested-trigger"
                    className="rounded-md mb-6 w-full bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    Open Second Drawer
                  </Drawer.Trigger>
                  <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                    <Drawer.Content
                      data-testid="nested-content"
                      className="bg-gray-100 flex flex-col rounded-t-[10px] h-full mt-24 max-h-[94%] fixed bottom-0 left-0 right-0"
                    >
                      <Drawer.Close data-testid="nested-close">Close</Drawer.Close>
                      <div className="p-4 bg-white rounded-t-[10px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                        <div className="max-w-md mx-auto">
                          <Drawer.Title className="font-medium mb-4">This drawer is nested.</Drawer.Title>
                          <p className="text-gray-600 mb-2">
                            Place a <span className="font-mono text-[15px] font-semibold">`Drawer.NestedRoot`</span>{' '}
                            inside another drawer and it will be nested automatically for you.
                          </p>
                          <p className="text-gray-600 mb-2">
                            You can view more examples{' '}
                            <a
                              href="https://github.com/emilkowalski/vaul#examples"
                              className="underline"
                              target="_blank"
                            >
                              here
                            </a>
                            .
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
                </Drawer.NestedRoot>
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
    </div>
  );
}

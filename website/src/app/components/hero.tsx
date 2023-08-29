'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Drawer } from 'vaul';

export function Hero() {
  const [snap, setSnap] = useState<number | string | null>('148px');

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
          <Drawer.Root snapPoints={['148px', '355px', 1]} activeSnapPoint={snap} setActiveSnapPoint={setSnap}>
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
              <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
                <div
                  className={clsx('flex flex-col max-w-md mx-auto w-full p-4 pt-5', {
                    'overflow-y-auto': snap === 1,
                    'overflow-hidden': snap !== 1,
                  })}
                >
                  <div className="flex items-center">
                    <svg
                      className="text-yellow-400 h-5 w-5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <svg
                      className="text-yellow-400 h-5 w-5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <svg
                      className="text-yellow-400 h-5 w-5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <svg
                      className="text-yellow-400 h-5 w-5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <svg
                      className="text-gray-300 h-5 w-5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>{' '}
                  <h1 className="text-2xl mt-2 font-medium">The Hidden Details</h1>
                  <p className="text-sm mt-1 text-gray-600 mb-6">2 modules, 27 hours of video</p>
                  <p className="text-gray-600">
                    The world of user interface design is an intricate landscape filled with hidden details and nuance.
                    In this course, you will learn something cool. To the untrained eye, a beautifully designed UI.
                  </p>
                  <button className="bg-black text-gray-50 mt-8 rounded-md h-[48px] flex-shrink-0 font-medium">
                    Buy for $199
                  </button>
                  <div className="mt-12">
                    <h2 className="text-xl font-medium">Module 01. The Details</h2>
                    <div className="space-y-4 mt-4">
                      <div>
                        <span className="block">Layers of UI</span>
                        <span className="text-gray-600">A basic introduction to Layers of Design.</span>
                      </div>
                      <div>
                        <span className="block">Typography</span>
                        <span className="text-gray-600">The fundamentals of type.</span>
                      </div>
                      <div>
                        <span className="block">UI Animations</span>
                        <span className="text-gray-600">Going through the right easings and durations.</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12">
                    <figure>
                      <blockquote className="font-serif">
                        “I especially loved the typography video. That’s probably my favorite aspect of design, and I
                        love getting the insight to how you work.”
                      </blockquote>
                      <figcaption>
                        <span className="text-sm text-gray-600 mt-2 block">Yvonne Ray, Frontend Developer</span>
                      </figcaption>
                    </figure>
                  </div>
                  <div className="mt-12">
                    <h2 className="text-xl font-medium">Module 02. The Process</h2>
                    <div className="space-y-4 mt-4">
                      <div>
                        <span className="block">Build</span>
                        <span className="text-gray-600">Create cool components to practice.</span>
                      </div>
                      <div>
                        <span className="block">User Insight</span>
                        <span className="text-gray-600">Find out what users think and fine-tune.</span>
                      </div>
                      <div>
                        <span className="block">Putting it all together</span>
                        <span className="text-gray-600">Let's build an app together and apply everything.</span>
                      </div>
                    </div>
                  </div>
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

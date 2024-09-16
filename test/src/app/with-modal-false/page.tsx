'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { Drawer } from 'vaul';

const snapPoints = ['148px', '355px', 1];

export default function Page() {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  const activeSnapPointIndex = snapPoints.indexOf(snap as string);

  return (
    <div className="w-screen h-screen bg-white p-8 flex justify-center items-center">
      <div data-testid="active-snap-index">{activeSnapPointIndex}</div>
      <Drawer.Root modal={false} snapPoints={snapPoints} setActiveSnapPoint={setSnap}>
        <Drawer.Trigger asChild>
          <button data-testid="trigger">Open Drawer</button>
        </Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Portal>
          <Drawer.Content
            data-testid="content"
            className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]"
          >
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
                The world of user interface design is an intricate landscape filled with hidden details and nuance. In
                this course, you will learn something cool. To the untrained eye, a beautifully designed UI.
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
                    “I especially loved the hidden details video. That was so useful, learned a lot by just reading it.
                    Can&rsquo;t wait for more course content!”
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
                    <span className="text-gray-600">Let&apos;s build an app together and apply everything.</span>
                  </div>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

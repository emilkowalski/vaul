'use client';
import React, { useState } from 'react'
import { Drawer } from 'vaul'

export function Hero() {

  const [open, setOpen] = useState<boolean>(false)
  const [modal, setModal] = useState<boolean>(true)

  return (
    <div className='relative'>
      <div
        aria-hidden
        className='absolute top-0 w-[1000px] z-10 h-[400px] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.15] pointer-events-none'
        style={{ backgroundImage: 'radial-gradient(#A4A4A3, transparent 50%)' }}
      />
      <svg
        className='absolute pointer-events-none inset-0 h-full w-full stroke-gray-200 opacity-50 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]'
        aria-hidden
      >
        <defs>
          <pattern
            id='83fd4e5a-9d52-42fc-97b6-718e5d7ee527'
            width={200}
            height={200}
            x='50%'
            y={-1}
            patternUnits='userSpaceOnUse'
          >
            <path d='M100 200V.5M.5 .5H200' fill='none' />
          </pattern>
        </defs>
        <svg x='50%' y={-1} className='overflow-visible fill-gray-50'>
          <path
            d='M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z'
            strokeWidth={0}
          />
        </svg>
        <rect width='100%' height='100%' strokeWidth={0} fill='url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)' />
      </svg>
      <div className='max-w-2xl mx-auto text-center pt-50'>
        <div className='flex flex-col relative'>
          <h1 className='text-7xl font-semibold mb-4 relative'>Vaul</h1>
          <p className='text-gray-600 text-xl'>Drawer component for React.</p>
        </div>
        <div className='flex gap-4 justify-center mt-6'>
          <button
            type='button'
            className='rounded-full bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            onClick={() => {setOpen(true)}}
          >
            Open Drawer
          </button>
          <button
            type='button'
            className='border border-gray-800 w-[200px] rounded-full bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            onClick={() => {console.log("DO NOTHING CLICKED!")}}
          >
            Does nothing
          </button>
          <a
            href='https://github.com/emilkowalski/vaul'
            className='font-medium text-sm px-4 py-2.5 hover:bg-gray-100 rounded-full'
            target='_blank'
          >
            GitHub <span aria-hidden='true'>→</span>
          </a>
          <Drawer.Root open={open} onOpenChange={setOpen} modal={modal} >
            <Drawer.Portal>
              <Drawer.Overlay className='fixed inset-0 bg-black/40' />
              <Drawer.Content className={
                'flex flex-col ' + 
                'bg-gray-100 rounded-t-[10px] ' + 
                'border border-gray-800 ' + 
                'mt-24 ' + 
                'h-[60%] max-h-[96%] ' + 
                'fixed bottom-0 left-0 right-0 ' + 
                'md:max-w-[550px] md:mx-auto lg:max-w-[50vw]'
              }>
                <div className='p-4 bg-white rounded-t-[10px] flex-1'>
                  <div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8' />
                  <div className='max-w-md mx-auto flex flex-col items-center'>
                    <Drawer.Title className='font-medium mb-4'>
                      {`Drawer for React: ${modal ? '' : 'NON-'}MODAL`}
                    </Drawer.Title>
                    <button
                      type='button'
                      className={
                        'self-center block my-5 ' +
                        'border border-gray-800 ' + 
                        'rounded-full bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                      }
                      onClick={() => {setModal(!modal)}}
                    >
                      {`Make ${modal ? 'non-' : ''}modal`}
                    </button>

                    <p className='text-gray-600 mb-2'>
                      This component can be used as a Dialog replacement on mobile and tablet devices. You can read
                      about why and how it was built{' '}
                      <a
                        target='_blank'
                        className='underline'
                        href='https://emilkowal.ski/ui/building-a-drawer-component'
                      >
                        here
                      </a>
                      .
                    </p>
                    <p className='text-gray-600 mb-2'>
                      It comes unstyled, has gesture-driven animations, and is made by{' '}
                      <a href='https://emilkowal.ski/' className='underline' target='_blank'>
                        Emil Kowalski
                      </a>
                      .
                    </p>
                    <p className='text-gray-600 mb-8'>
                      It uses{' '}
                      <a
                        href='https://www.radix-ui.com/docs/primitives/components/dialog'
                        className='underline'
                        target='_blank'
                      >
                        Radix's Dialog primitive
                      </a>{' '}
                      under the hood and is inspired by{' '}
                      <a
                        href='https://twitter.com/devongovett/status/1674470185783402496'
                        className='underline'
                        target='_blank'
                      >
                        this tweet.
                      </a>
                    </p>
                  </div>
                </div>
                <div className='p-4 bg-gray-100 border-t border-gray-200 mt-auto'>
                  <div className='flex gap-6 justify-end max-w-md mx-auto'>
                    <a
                      className='text-xs text-gray-600 flex items-center gap-0.25'
                      href='https://github.com/emilkowalski/vaul'
                      target='_blank'
                    >
                      GitHub
                      <svg
                        fill='none'
                        height='16'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                        width='16'
                        aria-hidden='true'
                        className='w-3 h-3 ml-1'
                      >
                        <path d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6'></path>
                        <path d='M15 3h6v6'></path>
                        <path d='M10 14L21 3'></path>
                      </svg>
                    </a>
                    <a
                      className='text-xs text-gray-600 flex items-center gap-0.25'
                      href='https://twitter.com/emilkowalski_'
                      target='_blank'
                    >
                      Twitter
                      <svg
                        fill='none'
                        height='16'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                        width='16'
                        aria-hidden='true'
                        className='w-3 h-3 ml-1'
                      >
                        <path d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6'></path>
                        <path d='M15 3h6v6'></path>
                        <path d='M10 14L21 3'></path>
                      </svg>
                    </a>
                  </div>
                </div>
                

              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </div>
    </div>
  );
}

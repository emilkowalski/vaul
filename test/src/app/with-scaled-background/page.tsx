'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Drawer } from 'vaul';
import { DrawerDirection } from 'vaul/src/types';

const CenteredContent = () => {
  return (
    <div className="max-w-md mx-auto">
      <Drawer.Title className="font-medium mb-4">Unstyled drawer for React.</Drawer.Title>
      <p className="text-zinc-600 mb-2">
        This component can be used as a replacement for a Dialog on mobile and tablet devices.
      </p>
      <p className="text-zinc-600 mb-8">
        It uses{' '}
        <a href="https://www.radix-ui.com/docs/primitives/components/dialog" className="underline" target="_blank">
          Radix&apos;s Dialog primitive
        </a>{' '}
        under the hood and is inspired by{' '}
        <a href="https://twitter.com/devongovett/status/1674470185783402496" className="underline" target="_blank">
          this tweet.
        </a>
      </p>
    </div>
  );
};

const DrawerContent = ({ drawerDirection }: { drawerDirection: DrawerDirection }) => {
  return (
    <Drawer.Content
      data-testid="content"
      className={clsx({
        'bg-zinc-100 flex fixed p-6': true,
        'rounded-t-[10px] flex-col h-[50%] bottom-0 left-0 right-0': drawerDirection === 'bottom',
        'rounded-b-[10px] flex-col h-[50%] top-0 left-0 right-0': drawerDirection === 'top',
        'rounded-r-[10px] flex-row w-[50%] left-0 top-0 bottom-0': drawerDirection === 'left',
        'rounded-l-[10px] flex-row w-[50%] right-0 top-0 bottom-0': drawerDirection === 'right',
      })}
    >
      <div
        className={clsx({
          'w-full h-full flex rounded-full gap-8': true,
          'flex-col': drawerDirection === 'bottom',
          'flex-col-reverse': drawerDirection === 'top',
          'flex-row-reverse': drawerDirection === 'left',
          'flex-row ': drawerDirection === 'right',
        })}
      >
        <div
          className={clsx({
            'rounded-full bg-zinc-300': true,
            'mx-auto w-12 h-1.5': drawerDirection === 'top' || drawerDirection === 'bottom',
            'my-auto h-12 w-1.5': drawerDirection === 'left' || drawerDirection === 'right',
          })}
        />
        <div className="grid place-content-center w-full h-full">
          <CenteredContent />
        </div>
      </div>
    </Drawer.Content>
  );
};

export default function Page() {
  const [direction, setDirection] = useState<DrawerDirection>('bottom');

  return (
    <div
      className="w-screen h-screen bg-white p-8 flex flex-col gap-2 justify-center items-center"
      data-vaul-drawer-wrapper=""
    >
      <select
        value={direction}
        className="border-zinc-300 border-2 px-4 py-1 rounded-lg"
        onChange={(e) => setDirection(e.target.value as DrawerDirection)}
      >
        <option value="top">Top</option>
        <option value="bottom">Bottom</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
      </select>
      <Drawer.Root shouldScaleBackground direction={direction}>
        <Drawer.Trigger asChild>
          <button data-testid="trigger" className="text-2xl">
            Open Drawer
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay data-testid="overlay" className="fixed inset-0 bg-black/40" />
          <DrawerContent drawerDirection={direction} />
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

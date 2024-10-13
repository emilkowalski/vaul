'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { Drawer } from 'vaul';

const snapPoints = ['148px', '355px', 1];

export default function Page() {
  return (
    <div className="w-screen h-screen bg-white p-8 flex justify-center items-center">
      <Drawer.Root>
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
            <select>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

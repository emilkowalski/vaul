'use client';
import clsx from 'clsx';
import { useState } from 'react';
import { Drawer } from 'vaul';

export default function Page() {
  return (
    <div className="h-screen flex flex-col gap-20 overflow-auto py-20">
      <Default />
      <WithNested />
    </div>
  );
}

function Default() {
  const [parent, setParent] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-3xl font-semibold">Default</h1>
      <div
        ref={setParent}
        className="bg-zinc-200 w-[440px] h-[400px] rounded-lg relative flex justify-center items-center overflow-hidden"
      >
        <Drawer.Root container={parent}>
          <Drawer.Trigger>Open Drawer</Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="absolute inset-0 bg-black/40" />
            <Drawer.Content className="absolute bg-zinc-100 inset-x-0 rounded-t-[10px] bottom-0 h-[56%] p-6">
              <Drawer.Title>Unstyled drawer for React.</Drawer.Title>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  );
}

function WithNested() {
  const [parent, setParent] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-3xl font-semibold">With Nested</h1>
      <div
        ref={setParent}
        className="bg-zinc-200 w-[440px] h-[400px] rounded-lg relative flex justify-center items-center overflow-hidden"
      >
        <Drawer.Root>
          <Drawer.Trigger>Open Drawer</Drawer.Trigger>
          <Drawer.Portal container={parent}>
            <Drawer.Overlay className="absolute inset-0 bg-black/40" />
            <Drawer.Content className="absolute bg-zinc-100 inset-x-0 rounded-t-[10px] bottom-0 h-[56%] p-6">
              <Drawer.Title>Unstyled drawer for React.</Drawer.Title>
              <Drawer.NestedRoot container={parent}>
                <Drawer.Trigger>Open nested drawer</Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="absolute inset-0 bg-black/40" />
                  <Drawer.Content className="absolute bg-zinc-100 inset-x-0 rounded-t-[10px] bottom-0 h-[56%] p-6">
                    <Drawer.Title>Unstyled drawer for React.</Drawer.Title>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.NestedRoot>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  );
}

import { Code } from '../code';
import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { CopyButton } from './copy-button';
import clsx from 'clsx';

const TABS = ['preview', 'code'];

export function Preview({ source, children, inline }: { source: string; children: React.ReactNode; inline?: boolean }) {
  const code = `\`\`\`
${source}
  \`\`\``;

  return (
    <div className={clsx(inline ? 'shadow-sm rounded-lg overflow-hidden my-6 mb-12' : '')}>
      <Tabs.Root defaultValue="preview">
        <div className={clsx('px-4 py-2 border-b border-solid-border flex justify-between', inline ? 'bg-subtle' : '')}>
          <Tabs.List className="space-x-3">
            {TABS.map((tab) => (
              <Tabs.Trigger
                value={tab}
                className="capitalize text-xs text-tertiary font-medium data-[state=active]:text-secondary hover:text-secondary relative [&>div]:data-[state=active]:block"
                key={tab}
              >
                <div aria-hidden className="absolute bottom-[-11px] translate-y-1/2 w-full h-px bg-secondary hidden" />
                {tab}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <CopyButton source={source} />
        </div>
        <div className={clsx('rounded-lg h-[300px]', inline ? '' : 'shadow-sm mt-4')}>
          <Tabs.Content value="preview" className="p-4 h-full">
            <div className="grid place-items-center h-full">{children}</div>
          </Tabs.Content>
          <Tabs.Content value="code" className="p-4 h-full overflow-y-auto">
            <Code code={code} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}

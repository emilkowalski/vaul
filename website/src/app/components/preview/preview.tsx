import { Code } from '../code';
import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { CopyButton } from './copy-button';

const TABS = ['preview', 'code'];

export function Preview({ source, children }: { source: string; children: React.ReactNode }) {
  const code = `\`\`\`
${source}
  \`\`\``;

  return (
    <div>
      <Tabs.Root defaultValue="preview">
        <div className="px-4 py-3 border-b border-solid-border flex justify-between">
          <Tabs.List className="space-x-3">
            {TABS.map((tab) => (
              <Tabs.Trigger
                value={tab}
                className="capitalize text-xs text-tertiary font-medium data-[state=active]:text-secondary hover:text-secondary relative [&>div]:data-[state=active]:block"
                key={tab}
              >
                <div aria-hidden className="absolute bottom-[-15px] translate-y-1/2 w-full h-px bg-secondary hidden" />
                {tab}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <CopyButton source={source} />
        </div>
        <div className="rounded-lg shadow-sm h-[300px] mt-4">
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

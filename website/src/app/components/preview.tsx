import { Code } from './code';

export function Preview({ source }: { source: string }) {
  const code = `\`\`\`
${source}
  \`\`\``;

  return (
    <div>
      <Code code={code} />
    </div>
  );
}

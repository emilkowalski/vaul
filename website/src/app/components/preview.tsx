import { Code } from './code';

export function Preview(props) {
  const code = `\`\`\`
${props.source}
  \`\`\``;

  return (
    <div>
      <Code code={code} />
    </div>
  );
}

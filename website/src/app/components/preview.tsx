import { Code } from './code';

export function Preview(props) {
  const code = `\`${props.source}\``;

  return (
    <div>
      {props.source}
      <Code code={code} />
    </div>
  );
}

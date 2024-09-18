'use client';

import copy from 'copy-to-clipboard';
import React from 'react';

export function CopyButton({ source }: { source: string }) {
  const [copying, setCopying] = React.useState(0);

  function handleCopy() {
    copy(source);
    setCopying((c) => c + 1);
    setTimeout(() => {
      setCopying((c) => c - 1);
    }, 2000);
  }

  return (
    <button className="text-xs text-secondary font-medium" onClick={handleCopy}>
      {copying ? 'Copied!' : 'Copy Code'}
    </button>
  );
}

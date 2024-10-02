'use client';

import { cn } from '@/app/utils';
import React, { forwardRef } from 'react';

interface SplitTextProps {
  id?: string;
  className?: string;
  children: string;
}

export const SplitText = forwardRef<HTMLDivElement, SplitTextProps>(function SplitTextInner(
  { id, children, className },
  ref,
) {
  const text = React.Children.toArray(children).join('');
  const characters = text.split('');

  return (
    <div id={id} className="inline-block whitespace-nowrap" ref={ref}>
      {characters.map((char, index) => (
        <span key={index} id={`${id}-${index}`} className={cn('inline-block', className)}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
});

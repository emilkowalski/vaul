import React from 'react';

export function useSnapPoints({ snapPoints }: { snapPoints?: number[]; drawerRef: React.RefObject<HTMLDivElement> }) {
  const [activeSnapPoint, setActiveSnapPoint] = React.useState<number | null>(snapPoints?.[0] ?? null);

  const snapPointHeights = React.useMemo(
    () => snapPoints?.map((snapPoint) => window.innerHeight - snapPoint * window.innerHeight) ?? null,
    [snapPoints],
  );

  function onRelease({ draggedDistance }: { draggedDistance: number }) {
    console.log(draggedDistance);
  }

  return {
    activeSnapPoint,
    onRelease,
    snapPointHeights,
  };
}

import React from 'react';
import { set } from './helpers';

export function useSnapPoints({
  snapPoints,
  drawerRef,
}: {
  snapPoints?: number[];
  drawerRef: React.RefObject<HTMLDivElement>;
}) {
  const [activeSnapPoint, setActiveSnapPoint] = React.useState<number | null>(snapPoints?.[0] ?? null);
  const hasWindow = typeof window !== 'undefined';

  const activeSnapPointIndex = React.useMemo(
    () => snapPoints?.findIndex((snapPoint) => snapPoint === activeSnapPoint) ?? null,
    [snapPoints, activeSnapPoint],
  );

  const snapPointHeights = React.useMemo(
    () => snapPoints?.map((snapPoint) => hasWindow && window.innerHeight - snapPoint * window.innerHeight) ?? null,
    [snapPoints],
  );

  const activeSnapPointHeight = React.useMemo(
    () => snapPointHeights?.[activeSnapPointIndex] ?? null,
    [snapPointHeights, activeSnapPoint],
  );

  function onRelease({ draggedDistance }: { draggedDistance: number }) {
    console.log(draggedDistance);
  }

  function onDrag({ draggedDistance }: { draggedDistance: number }) {
    const newYValue = activeSnapPointHeight - draggedDistance;

    set(drawerRef.current, {
      transform: `translateY(${newYValue}px)`,
    });
  }

  return {
    activeSnapPoint,
    onRelease,
    onDrag,
    snapPointHeights,
  };
}

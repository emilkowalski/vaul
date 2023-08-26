import React from 'react';
import { dampenValue, set } from './helpers';
import { TRANSITIONS } from './constants';

function dampingFactor(draggedDistance) {
  const decayRate = 0.01; // Adjust this to change the speed of decay
  return Math.exp(-decayRate * draggedDistance);
}

export function useSnapPoints({
  snapPoints,
  drawerRef,
  isOpen,
}: {
  snapPoints?: number[];
  isOpen: boolean;
  drawerRef: React.RefObject<HTMLDivElement>;
}) {
  const [activeSnapPoint, setActiveSnapPoint] = React.useState<number | null>(snapPoints?.[0] ?? null);
  const hasWindow = typeof window !== 'undefined';
  const isLastSnapPoint = React.useMemo(
    () => activeSnapPoint === snapPoints?.[snapPoints.length - 1] ?? null,
    [snapPoints, activeSnapPoint],
  );

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

  function snapToPoint(height: number) {
    const newSnapPointIndex = snapPointHeights?.findIndex((snapPointHeight) => snapPointHeight === height) ?? null;
    set(drawerRef.current, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      transform: `translateY(${height}px)`,
    });
    setActiveSnapPoint(snapPoints?.[newSnapPointIndex] ?? null);
  }

  function onRelease({
    draggedDistance,
    closeDrawer,
    velocity,
  }: {
    draggedDistance: number;
    closeDrawer: () => void;
    velocity: number;
  }) {
    const currentPosition = activeSnapPointHeight - draggedDistance;

    if (velocity > 0.8 && draggedDistance < 0) {
      closeDrawer();
      setActiveSnapPoint(snapPoints[0]);
      return;
    }

    // Find the closest snap point to the current position
    const closestSnapPoint = snapPointHeights?.reduce((prev, curr) => {
      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });

    snapToPoint(closestSnapPoint);
  }

  function onDrag({ draggedDistance }: { draggedDistance: number }) {
    const newYValue = activeSnapPointHeight - draggedDistance;

    if (isLastSnapPoint && newYValue < activeSnapPointHeight) {
      const dampenedDraggedDistance = dampenValue(draggedDistance);

      set(drawerRef.current, {
        transform: `translateY(${Math.min(activeSnapPointHeight - dampenedDraggedDistance, activeSnapPointHeight)}px)`,
      });
      return;
    }

    set(drawerRef.current, {
      transform: `translateY(${newYValue}px)`,
    });
  }

  return {
    isLastSnapPoint,
    onRelease,
    onDrag,
    snapPointHeights,
  };
}

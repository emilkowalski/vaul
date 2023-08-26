import React from 'react';
import { dampenValue, set } from './helpers';
import { TRANSITIONS, VELOCITY_THRESHOLD } from './constants';

export function useSnapPoints({
  snapPoints,
  drawerRef,
  overlayRef,
  fadeFrom,
}: {
  snapPoints?: number[];
  fadeFrom?: number;
  drawerRef: React.RefObject<HTMLDivElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
}) {
  const [activeSnapPoint, setActiveSnapPoint] = React.useState<number | null>(snapPoints?.[0] ?? null);
  const hasWindow = typeof window !== 'undefined';
  const isLastSnapPoint = React.useMemo(
    () => activeSnapPoint === snapPoints?.[snapPoints.length - 1] ?? null,
    [snapPoints, activeSnapPoint],
  );
  const fadeFromSnapPoint = React.useMemo(() => {
    if (!snapPoints) return null;
    if (fadeFrom) {
      return snapPoints?.findIndex((snapPoint) => snapPoint === fadeFrom) ?? null;
    }
    return snapPoints[snapPoints.length - 1];
  }, [snapPoints, fadeFrom]);

  const shouldFade = (snapPoints && snapPoints.length > 0 && fadeFromSnapPoint === activeSnapPoint) || !snapPoints;

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

    if (newSnapPointIndex !== snapPointHeights.length - 1) {
      console.log('xpp?');

      set(overlayRef.current, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        opacity: '0',
      });
    } else {
      set(overlayRef.current, {
        opacity: '1',
      });
    }

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

    if (velocity > 2 && draggedDistance < 0) {
      closeDrawer();
      setActiveSnapPoint(snapPoints[0]);
      return;
    }

    if (velocity > VELOCITY_THRESHOLD) {
      // -1 = down, 1 = up, might need a better name
      const dragDirection = draggedDistance > 0 ? 1 : -1;
      // Don't do anything if we swipe upwards while being on the last snap point
      if (dragDirection > 0 && isLastSnapPoint) return;

      snapToPoint(snapPointHeights[activeSnapPointIndex + dragDirection]);
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
    activeSnapPoint,
    shouldFade,
    setActiveSnapPoint,
    onRelease,
    onDrag,
    snapPointHeights,
  };
}

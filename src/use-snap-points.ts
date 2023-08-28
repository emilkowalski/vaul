import React from 'react';
import { dampenValue, set } from './helpers';
import { TRANSITIONS, VELOCITY_THRESHOLD } from './constants';
import { useControllableState } from './use-controllable-state';

export function useSnapPoints({
  activeSnapPointProp,
  setActiveSnapPointProp,
  snapPoints,
  drawerRef,
  overlayRef,
  fadeFromIndex,
}: {
  activeSnapPointProp?: number | string | null;
  setActiveSnapPointProp?(snapPoint: number | null): void;
  snapPoints?: (number | string)[];
  fadeFromIndex: number;
  drawerRef: React.RefObject<HTMLDivElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
}) {
  const [activeSnapPoint, setActiveSnapPoint] = useControllableState({
    prop: activeSnapPointProp,
    defaultProp: snapPoints?.[0],
    onChange: setActiveSnapPointProp,
  });

  const hasWindow = typeof window !== 'undefined';
  const isLastSnapPoint = React.useMemo(
    () => activeSnapPoint === snapPoints?.[snapPoints.length - 1] ?? null,
    [snapPoints, activeSnapPoint],
  );

  const shouldFade =
    (snapPoints && snapPoints.length > 0 && snapPoints[fadeFromIndex] === activeSnapPoint) || !snapPoints;

  const activeSnapPointIndex = React.useMemo(
    () => snapPoints?.findIndex((snapPoint) => snapPoint === activeSnapPoint) ?? null,
    [snapPoints, activeSnapPoint],
  );

  const snapPointHeights = React.useMemo(
    () =>
      snapPoints?.map((snapPoint) => {
        const isPx = typeof snapPoint === 'string';
        let snapPointAsNumber = 0;

        if (isPx) {
          snapPointAsNumber = parseInt(snapPoint, 10);
        }

        const height = isPx ? snapPointAsNumber : snapPoint * window.innerHeight;

        return hasWindow && window.innerHeight - height;
      }) ?? null,
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

    if (newSnapPointIndex !== snapPointHeights.length - 1 && newSnapPointIndex !== fadeFromIndex) {
      set(overlayRef.current, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        opacity: '0',
      });
    } else {
      set(overlayRef.current, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        opacity: '1',
      });
    }

    setActiveSnapPoint(snapPoints?.[newSnapPointIndex] ?? null);
  }

  React.useEffect(() => {
    if (activeSnapPointProp) {
      const newIndex = snapPoints?.findIndex((snapPoint) => snapPoint === activeSnapPointProp) ?? null;

      snapToPoint(snapPointHeights[newIndex]);
    }
  }, [activeSnapPointProp]);

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
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1;
    const isFirst = activeSnapPointIndex === 0;

    if (isOverlaySnapPoint) {
      set(overlayRef.current, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });
    }

    if (velocity > 2 && draggedDistance < 0) {
      closeDrawer();
      return;
    }

    if (velocity > 2 && draggedDistance > 0) {
      snapToPoint(snapPointHeights[snapPoints.length - 1]);
      return;
    }

    // Find the closest snap point to the current position
    const closestSnapPoint = snapPointHeights?.reduce((prev, curr) => {
      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });

    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < window.innerHeight * 0.4) {
      // -1 = down, 1 = up, might need a better name
      const dragDirection = draggedDistance > 0 ? 1 : -1;
      // Don't do anything if we swipe upwards while being on the last snap point
      if (dragDirection > 0 && isLastSnapPoint) return;

      if (isFirst && dragDirection < 0) {
        closeDrawer();
      }

      snapToPoint(snapPointHeights[activeSnapPointIndex + dragDirection]);
      return;
    }

    snapToPoint(closestSnapPoint);
  }

  function onDrag({ draggedDistance }: { draggedDistance: number }) {
    const newYValue = activeSnapPointHeight - draggedDistance;

    if (newYValue < snapPointHeights[snapPointHeights.length - 1]) {
      // The thing here is that we don't need to dampen the whole value, only additional 40px above the last snap point, figure this out
      const dampenedDraggedDistance = dampenValue(draggedDistance);

      set(drawerRef.current, {
        transform: `translateY(${Math.min(
          snapPointHeights[snapPointHeights.length - 1] - dampenedDraggedDistance,
          Math.min(snapPointHeights[snapPointHeights.length - 1]),
        )}px)`,
      });
      return;
    }

    set(drawerRef.current, {
      transform: `translateY(${newYValue}px)`,
    });
  }

  function getPercentageDragged(absDraggedDistance: number, isDraggingDown: boolean) {
    if (!snapPoints) return null;
    // If this is true we are dragging to a snap point that is supposed to have an overlay
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1;
    const isOverlaySnapPointOrHigher = activeSnapPointIndex >= fadeFromIndex;

    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }

    // Don't animate, but still use this one if we are dragging away from the overlaySnapPoint
    if (isOverlaySnapPoint && !isDraggingDown) return 1;
    if (!shouldFade && !isOverlaySnapPoint) return null;
    // Either fadeFrom index or the one before
    const targetSnapPointIndex = isOverlaySnapPoint ? activeSnapPointIndex + 1 : activeSnapPointIndex - 1;

    // Get the distance from overlaySnapPoint to the one before or vice-versa to calculate the opacity percentage accordingly
    const snapPointDistance = isOverlaySnapPoint
      ? snapPointHeights[targetSnapPointIndex] - snapPointHeights[targetSnapPointIndex - 1]
      : snapPointHeights[targetSnapPointIndex + 1] - snapPointHeights[targetSnapPointIndex];

    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);

    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }

  return {
    isLastSnapPoint,
    activeSnapPoint,
    shouldFade,
    getPercentageDragged,
    setActiveSnapPoint,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointHeights,
  };
}

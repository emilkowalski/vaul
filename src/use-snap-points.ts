import React, { useCallback } from 'react';
import { set } from './helpers';
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
  const [activeSnapPoint, setActiveSnapPoint] = useControllableState<string | number | null>({
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

  const snapPointsOffset = React.useMemo(
    () =>
      snapPoints?.map((snapPoint) => {
        const hasWindow = typeof window !== 'undefined';
        const isPx = typeof snapPoint === 'string';
        let snapPointAsNumber = 0;

        if (isPx) {
          snapPointAsNumber = parseInt(snapPoint, 10);
        }

        const height = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerHeight : 0;

        return hasWindow && window.innerHeight - height;
      }) ?? null,
    [snapPoints],
  );

  const activeSnapPointOffset = React.useMemo(
    () => (activeSnapPointIndex !== null ? snapPointsOffset?.[activeSnapPointIndex] : null),
    [snapPointsOffset, activeSnapPointIndex],
  );

  const snapToPoint = useCallback(
    (height: number) => {
      const newSnapPointIndex = snapPointsOffset?.findIndex((snapPointHeight) => snapPointHeight === height) ?? null;

      set(drawerRef.current, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        transform: `translateY(${height}px)`,
      });

      if (
        snapPointsOffset &&
        newSnapPointIndex !== snapPointsOffset.length - 1 &&
        newSnapPointIndex !== fadeFromIndex
      ) {
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

      setActiveSnapPoint(newSnapPointIndex !== null ? snapPoints?.[newSnapPointIndex] : null);
    },
    [drawerRef, snapPoints, snapPointsOffset, fadeFromIndex, overlayRef, setActiveSnapPoint],
  );

  React.useEffect(() => {
    if (activeSnapPointProp) {
      const newIndex = snapPoints?.findIndex((snapPoint) => snapPoint === activeSnapPointProp) ?? null;
      if (snapPointsOffset && newIndex && snapPointsOffset[newIndex]) {
        snapToPoint(snapPointsOffset[newIndex] as number);
      }
    }
  }, [activeSnapPointProp, snapPoints, snapPointsOffset, snapToPoint]);

  function onRelease({
    draggedDistance,
    closeDrawer,
    velocity,
  }: {
    draggedDistance: number;
    closeDrawer: () => void;
    velocity: number;
  }) {
    if (typeof activeSnapPointOffset !== 'number') return;
    const currentPosition = activeSnapPointOffset - draggedDistance;
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

    if (velocity > 2 && draggedDistance > 0 && snapPointsOffset && snapPoints) {
      snapToPoint(snapPointsOffset[snapPoints.length - 1] as number);
      return;
    }

    // Find the closest snap point to the current position
    const closestSnapPoint = snapPointsOffset?.reduce((prev, curr) => {
      if (typeof prev !== 'number' || typeof curr !== 'number') return prev;

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

      snapToPoint(snapPointsOffset[activeSnapPointIndex + dragDirection]);
      return;
    }

    snapToPoint(closestSnapPoint);
  }

  function onDrag({ draggedDistance }: { draggedDistance: number }) {
    const newYValue = activeSnapPointOffset - draggedDistance;

    if (newYValue < snapPointsOffset[snapPointsOffset.length - 1]) {
      setActiveSnapPoint(snapPoints?.[snapPoints.length - 1] ?? null);
      set(drawerRef.current, {
        transform: `translateY(${0}px)`,
      });
      return;
    }

    set(drawerRef.current, {
      transform: `translateY(${newYValue}px)`,
    });
  }

  function getPercentageDragged(absDraggedDistance: number, isDraggingDown: boolean) {
    if (!snapPoints || !activeSnapPointIndex || !snapPointsOffset) return null;
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
      ? snapPointsOffset[targetSnapPointIndex] - snapPointsOffset[targetSnapPointIndex - 1]
      : snapPointsOffset[targetSnapPointIndex + 1] - snapPointsOffset[targetSnapPointIndex];

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
    snapPointsOffset,
  };
}

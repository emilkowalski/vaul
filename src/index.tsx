'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useRef, useState } from 'react';
import { DrawerContext, useDrawerContext } from './context';
import './style.css';
import { usePreventScroll, isInput, isIOS } from './use-prevent-scroll';
import { useComposedRefs } from './use-composed-refs';
import { usePositionFixed } from './use-position-fixed';
import { useSnapPoints } from './use-snap-points';
import { set, reset, getTranslate, dampenValue, isVertical } from './helpers';
import { TRANSITIONS, VELOCITY_THRESHOLD } from './constants';
import { DrawerDirection } from './types';

const CLOSE_THRESHOLD = 0.25;

const SCROLL_LOCK_TIMEOUT = 100;

const BORDER_RADIUS = 8;

const NESTED_DISPLACEMENT = 16;

const WINDOW_TOP_OFFSET = 26;

const DRAG_CLASS = 'vaul-dragging';

interface WithFadeFromProps {
  snapPoints: (number | string)[];
  fadeFromIndex: number;
}

interface WithoutFadeFromProps {
  snapPoints?: (number | string)[];
  fadeFromIndex?: never;
}

type DialogProps = {
  activeSnapPoint?: number | string | null;
  setActiveSnapPoint?: (snapPoint: number | string | null) => void;
  children?: React.ReactNode;
  open?: boolean;
  closeThreshold?: number;
  noBodyStyles?: boolean;
  onOpenChange?: (open: boolean) => void;
  shouldScaleBackground?: boolean;
  setBackgroundColorOnScale?: boolean;
  scrollLockTimeout?: number;
  fixed?: boolean;
  dismissible?: boolean;
  handleOnly?: boolean;
  onDrag?: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void;
  onRelease?: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void;
  modal?: boolean;
  nested?: boolean;
  onClose?: (preventClose?: () => void) => void;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  preventScrollRestoration?: boolean;
  disablePreventScroll?: boolean;
} & (WithFadeFromProps | WithoutFadeFromProps);

function Root({
  open: openProp,
  onOpenChange,
  children,
  shouldScaleBackground,
  onDrag: onDragProp,
  onRelease: onReleaseProp,
  snapPoints,
  nested = false,
  setBackgroundColorOnScale = true,
  closeThreshold = CLOSE_THRESHOLD,
  scrollLockTimeout = SCROLL_LOCK_TIMEOUT,
  dismissible = true,
  handleOnly = false,
  fadeFromIndex = snapPoints && snapPoints.length - 1,
  activeSnapPoint: activeSnapPointProp,
  setActiveSnapPoint: setActiveSnapPointProp,
  fixed,
  modal = true,
  onClose,
  noBodyStyles,
  direction = 'bottom',
  preventScrollRestoration = true,
  disablePreventScroll = false,
}: DialogProps) {
  const [isOpen = false, setIsOpen] = React.useState<boolean>(false);
  const [hasBeenOpened, setHasBeenOpened] = React.useState<boolean>(false);
  // Not visible = translateY(100%)
  const [visible, setVisible] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [justReleased, setJustReleased] = React.useState<boolean>(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const openTime = React.useRef<Date | null>(null);
  const dragStartTime = React.useRef<Date | null>(null);
  const dragEndTime = React.useRef<Date | null>(null);
  const lastTimeDragPrevented = React.useRef<Date | null>(null);
  const isAllowedToDrag = React.useRef<boolean>(false);
  const nestedOpenChangeTimer = React.useRef<NodeJS.Timeout | null>(null);
  const pointerStart = React.useRef(0);
  const keyboardIsOpen = React.useRef(false);
  const previousDiffFromInitial = React.useRef(0);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const shouldClose = React.useRef(true);
  const drawerHeightRef = React.useRef(drawerRef.current?.getBoundingClientRect().height || 0);
  const initialDrawerHeight = React.useRef(0);

  const onSnapPointChange = React.useCallback((activeSnapPointIndex: number) => {
    // Change openTime ref when we reach the last snap point to prevent dragging for 500ms incase it's scrollable.
    if (snapPoints && activeSnapPointIndex === snapPointsOffset.length - 1) openTime.current = new Date();
  }, []);

  const {
    activeSnapPoint,
    activeSnapPointIndex,
    setActiveSnapPoint,
    onRelease: onReleaseSnapPoints,
    snapPointsOffset,
    onDrag: onDragSnapPoints,
    shouldFade,
    getPercentageDragged: getSnapPointsPercentageDragged,
  } = useSnapPoints({
    snapPoints,
    activeSnapPointProp,
    setActiveSnapPointProp,
    drawerRef,
    fadeFromIndex,
    overlayRef,
    onSnapPointChange,
    direction,
  });

  usePreventScroll({
    isDisabled: !isOpen || isDragging || !modal || justReleased || !hasBeenOpened || disablePreventScroll,
  });

  const { restorePositionSetting } = usePositionFixed({
    isOpen,
    modal,
    nested,
    hasBeenOpened,
    preventScrollRestoration,
    noBodyStyles,
  });

  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }

  function onPress(event: React.PointerEvent<HTMLDivElement>) {
    if (!dismissible && !snapPoints) return;
    if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) return;
    drawerHeightRef.current = drawerRef.current?.getBoundingClientRect().height || 0;
    setIsDragging(true);
    dragStartTime.current = new Date();

    // iOS doesn't trigger mouseUp after scrolling so we need to listen to touched in order to disallow dragging
    if (isIOS()) {
      window.addEventListener('touchend', () => (isAllowedToDrag.current = false), { once: true });
    }
    // Ensure we maintain correct pointer capture even when going outside of the drawer
    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    pointerStart.current = isVertical(direction) ? event.clientY : event.clientX;
  }

  function shouldDrag(el: EventTarget, isDraggingInDirection: boolean) {
    let element = el as HTMLElement;
    const highlightedText = window.getSelection()?.toString();
    const swipeAmount = drawerRef.current ? getTranslate(drawerRef.current, direction) : null;
    const date = new Date();

    if (element.hasAttribute('data-vaul-no-drag') || element.closest('[data-vaul-no-drag]')) {
      return false;
    }

    if (direction === 'right' || direction === 'left') {
      return true;
    }

    // Allow scrolling when animating
    if (openTime.current && date.getTime() - openTime.current.getTime() < 500) {
      return false;
    }

    if (swipeAmount !== null) {
      if (direction === 'bottom' ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }

    // Don't drag if there's highlighted text
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }

    // Disallow dragging if drawer was scrolled within `scrollLockTimeout`
    if (
      lastTimeDragPrevented.current &&
      date.getTime() - lastTimeDragPrevented.current.getTime() < scrollLockTimeout &&
      swipeAmount === 0
    ) {
      lastTimeDragPrevented.current = date;
      return false;
    }

    if (isDraggingInDirection) {
      lastTimeDragPrevented.current = date;

      // We are dragging down so we should allow scrolling
      return false;
    }

    // Keep climbing up the DOM tree as long as there's a parent
    while (element) {
      // Check if the element is scrollable
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented.current = new Date();

          // The element is scrollable and not scrolled to the top, so don't drag
          return false;
        }

        if (element.getAttribute('role') === 'dialog') {
          return true;
        }
      }

      // Move up to the parent element
      element = element.parentNode as HTMLElement;
    }

    // No scrollable parents not scrolled to the top found, so drag
    return true;
  }

  function onDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!drawerRef.current) {
      return;
    }
    // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
    if (isDragging) {
      const directionMultiplier = direction === 'bottom' || direction === 'right' ? 1 : -1;
      const draggedDistance =
        (pointerStart.current - (isVertical(direction) ? event.clientY : event.clientX)) * directionMultiplier;
      const isDraggingInDirection = draggedDistance > 0;

      // Pre condition for disallowing dragging in the close direction.
      const noCloseSnapPointsPreCondition = snapPoints && !dismissible && !isDraggingInDirection;

      // Disallow dragging down to close when first snap point is the active one and dismissible prop is set to false.
      if (noCloseSnapPointsPreCondition && activeSnapPointIndex === 0) return;

      // We need to capture last time when drag with scroll was triggered and have a timeout between
      const absDraggedDistance = Math.abs(draggedDistance);
      const wrapper = document.querySelector('[vaul-drawer-wrapper]');

      // Calculate the percentage dragged, where 1 is the closed position
      let percentageDragged = absDraggedDistance / drawerHeightRef.current;
      const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance, isDraggingInDirection);

      if (snapPointPercentageDragged !== null) {
        percentageDragged = snapPointPercentageDragged;
      }

      // Disallow close dragging beyond the smallest snap point.
      if (noCloseSnapPointsPreCondition && percentageDragged >= 1) {
        return;
      }

      if (!isAllowedToDrag.current && !shouldDrag(event.target, isDraggingInDirection)) return;
      drawerRef.current.classList.add(DRAG_CLASS);
      // If shouldDrag gave true once after pressing down on the drawer, we set isAllowedToDrag to true and it will remain true until we let go, there's no reason to disable dragging mid way, ever, and that's the solution to it
      isAllowedToDrag.current = true;
      set(drawerRef.current, {
        transition: 'none',
      });

      set(overlayRef.current, {
        transition: 'none',
      });

      if (snapPoints) {
        onDragSnapPoints({ draggedDistance });
      }

      // Run this only if snapPoints are not defined or if we are at the last snap point (highest one)
      if (isDraggingInDirection && !snapPoints) {
        const dampenedDraggedDistance = dampenValue(draggedDistance);

        const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
        set(drawerRef.current, {
          transform: isVertical(direction)
            ? `translate3d(0, ${translateValue}px, 0)`
            : `translate3d(${translateValue}px, 0, 0)`,
        });
        return;
      }

      const opacityValue = 1 - percentageDragged;

      if (shouldFade || (fadeFromIndex && activeSnapPointIndex === fadeFromIndex - 1)) {
        onDragProp?.(event, percentageDragged);

        set(
          overlayRef.current,
          {
            opacity: `${opacityValue}`,
            transition: 'none',
          },
          true,
        );
      }

      if (wrapper && overlayRef.current && shouldScaleBackground) {
        // Calculate percentageDragged as a fraction (0 to 1)
        const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
        const borderRadiusValue = 8 - percentageDragged * 8;

        const translateValue = Math.max(0, 14 - percentageDragged * 14);

        set(
          wrapper,
          {
            borderRadius: `${borderRadiusValue}px`,
            transform: isVertical(direction)
              ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)`
              : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
            transition: 'none',
          },
          true,
        );
      }

      if (!snapPoints) {
        const translateValue = absDraggedDistance * directionMultiplier;

        set(drawerRef.current, {
          transform: isVertical(direction)
            ? `translate3d(0, ${translateValue}px, 0)`
            : `translate3d(${translateValue}px, 0, 0)`,
        });
      }
    }
  }

  React.useEffect(() => {
    return () => {
      scaleBackground(false);
      restorePositionSetting();
    };
  }, []);

  React.useEffect(() => {
    function onVisualViewportChange() {
      if (!drawerRef.current) return;

      const focusedElement = document.activeElement as HTMLElement;
      if (isInput(focusedElement) || keyboardIsOpen.current) {
        const visualViewportHeight = window.visualViewport?.height || 0;
        // This is the height of the keyboard
        let diffFromInitial = window.innerHeight - visualViewportHeight;
        const drawerHeight = drawerRef.current.getBoundingClientRect().height || 0;
        if (!initialDrawerHeight.current) {
          initialDrawerHeight.current = drawerHeight;
        }
        const offsetFromTop = drawerRef.current.getBoundingClientRect().top;

        // visualViewport height may change due to some subtle changes to the keyboard. Checking if the height changed by 60 or more will make sure that they keyboard really changed its open state.
        if (Math.abs(previousDiffFromInitial.current - diffFromInitial) > 60) {
          keyboardIsOpen.current = !keyboardIsOpen.current;
        }

        if (snapPoints && snapPoints.length > 0 && snapPointsOffset && activeSnapPointIndex) {
          const activeSnapPointHeight = snapPointsOffset[activeSnapPointIndex] || 0;
          diffFromInitial += activeSnapPointHeight;
        }

        previousDiffFromInitial.current = diffFromInitial;
        // We don't have to change the height if the input is in view, when we are here we are in the opened keyboard state so we can correctly check if the input is in view
        if (drawerHeight > visualViewportHeight || keyboardIsOpen.current) {
          const height = drawerRef.current.getBoundingClientRect().height;
          let newDrawerHeight = height;

          if (height > visualViewportHeight) {
            newDrawerHeight = visualViewportHeight - WINDOW_TOP_OFFSET;
          }
          // When fixed, don't move the drawer upwards if there's space, but rather only change it's height so it's fully scrollable when the keyboard is open
          if (fixed) {
            drawerRef.current.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
          } else {
            drawerRef.current.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
          }
        } else {
          drawerRef.current.style.height = `${initialDrawerHeight.current}px`;
        }

        if (snapPoints && snapPoints.length > 0 && !keyboardIsOpen.current) {
          drawerRef.current.style.bottom = `0px`;
        } else {
          // Negative bottom value would never make sense
          drawerRef.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
        }
      }
    }

    window.visualViewport?.addEventListener('resize', onVisualViewportChange);
    return () => window.visualViewport?.removeEventListener('resize', onVisualViewportChange);
  }, [activeSnapPointIndex, snapPoints, snapPointsOffset]);

  function preventClose() {
    shouldClose.current = false;
  }

  function closeDrawer() {
    if (!drawerRef.current) return;

    cancelDrag();

    onClose?.(preventClose);

    if (shouldClose.current === true) {
      set(drawerRef.current, {
        transform: isVertical(direction)
          ? `translate3d(0, ${direction === 'bottom' ? '100%' : '-100%'}, 0)`
          : `translate3d(${direction === 'right' ? '100%' : '-100%'}, 0, 0)`,
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });

      set(overlayRef.current, {
        opacity: '0',
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });

      scaleBackground(false);

      setTimeout(() => {
        setVisible(false);
        setIsOpen(false);
      }, 300);
    } else {
      resetDrawer();
    }

    shouldClose.current = true;

    setTimeout(() => {
      // reset(document.documentElement, 'scrollBehavior');
      if (snapPoints) {
        setActiveSnapPoint(snapPoints[0]);
      }
    }, TRANSITIONS.DURATION * 1000); // seconds to ms
  }

  React.useEffect(() => {
    if (!isOpen && shouldScaleBackground) {
      // Can't use `onAnimationEnd` as the component will be invisible by then
      const id = setTimeout(() => {
        reset(document.body);
      }, 200);

      return () => clearTimeout(id);
    }
  }, [isOpen, shouldScaleBackground]);

  // LayoutEffect to prevent extra render where openProp and isOpen are not synced yet
  React.useLayoutEffect(() => {
    if (openProp) {
      setIsOpen(true);
      setHasBeenOpened(true);
    } else {
      closeDrawer();
    }
  }, [openProp]);

  // This can be done much better
  React.useEffect(() => {
    if (mounted) {
      onOpenChange?.(isOpen);
    }
  }, [isOpen]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  function resetDrawer() {
    if (!drawerRef.current) return;
    const wrapper = document.querySelector('[vaul-drawer-wrapper]');
    const currentSwipeAmount = getTranslate(drawerRef.current, direction);

    set(drawerRef.current, {
      transform: 'translate3d(0, 0, 0)',
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    });

    set(overlayRef.current, {
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      opacity: '1',
    });

    // Don't reset background if swiped upwards
    if (shouldScaleBackground && currentSwipeAmount && currentSwipeAmount > 0 && isOpen) {
      set(
        wrapper,
        {
          borderRadius: `${BORDER_RADIUS}px`,
          overflow: 'hidden',
          ...(isVertical(direction)
            ? {
                transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
                transformOrigin: 'top',
              }
            : {
                transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
                transformOrigin: 'left',
              }),
          transitionProperty: 'transform, border-radius',
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        },
        true,
      );
    }
  }

  function cancelDrag() {
    if (!isDragging || !drawerRef.current) return;

    drawerRef.current.classList.remove(DRAG_CLASS);
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = new Date();
  }

  function onRelease(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !drawerRef.current) return;

    drawerRef.current.classList.remove(DRAG_CLASS);
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = new Date();
    const swipeAmount = getTranslate(drawerRef.current, direction);

    if (!shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount)) return;

    if (dragStartTime.current === null) return;

    const timeTaken = dragEndTime.current.getTime() - dragStartTime.current.getTime();
    const distMoved = pointerStart.current - (isVertical(direction) ? event.clientY : event.clientX);
    const velocity = Math.abs(distMoved) / timeTaken;

    if (velocity > 0.05) {
      // `justReleased` is needed to prevent the drawer from focusing on an input when the drag ends, as it's not the intent most of the time.
      setJustReleased(true);

      setTimeout(() => {
        setJustReleased(false);
      }, 200);
    }

    if (snapPoints) {
      const directionMultiplier = direction === 'bottom' || direction === 'right' ? 1 : -1;
      onReleaseSnapPoints({
        draggedDistance: distMoved * directionMultiplier,
        closeDrawer,
        velocity,
        dismissible,
      });
      onReleaseProp?.(event, true);
      return;
    }

    // Moved upwards, don't do anything
    if (direction === 'bottom' || direction === 'right' ? distMoved > 0 : distMoved < 0) {
      resetDrawer();
      onReleaseProp?.(event, true);
      return;
    }

    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }

    const visibleDrawerHeight = Math.min(drawerRef.current.getBoundingClientRect().height ?? 0, window.innerHeight);

    if (swipeAmount >= visibleDrawerHeight * closeThreshold) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }

    onReleaseProp?.(event, true);
    resetDrawer();
  }

  React.useEffect(() => {
    // Trigger enter animation without using CSS animation
    if (isOpen) {
      set(document.documentElement, {
        scrollBehavior: 'auto',
      });

      openTime.current = new Date();
      scaleBackground(true);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (drawerRef.current && visible) {
      // Find all scrollable elements inside our drawer and assign a class to it so that we can disable overflow when dragging to prevent pointermove not being captured
      const children = drawerRef?.current?.querySelectorAll('*');
      children?.forEach((child: Element) => {
        const htmlChild = child as HTMLElement;
        if (htmlChild.scrollHeight > htmlChild.clientHeight || htmlChild.scrollWidth > htmlChild.clientWidth) {
          htmlChild.classList.add('vaul-scrollable');
        }
      });
    }
  }, [visible]);

  function scaleBackground(open: boolean) {
    const wrapper = document.querySelector('[vaul-drawer-wrapper]');

    if (!wrapper || !shouldScaleBackground) return;

    if (open) {
      if (setBackgroundColorOnScale) {
        if (!noBodyStyles) {
          // setting original styles initially
          set(document.body, {
            background: document.body.style.backgroundColor || document.body.style.background,
          });
          // setting body styles, with cache ignored, so that we can get correct original styles in reset
          set(
            document.body,
            {
              background: 'black',
            },
            true,
          );
        }
      }

      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        ...(isVertical(direction)
          ? {
              transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
              transformOrigin: 'top',
            }
          : {
              transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
              transformOrigin: 'left',
            }),
        transitionProperty: 'transform, border-radius',
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });
    } else {
      // Exit
      reset(wrapper, 'overflow');
      reset(wrapper, 'transform');
      reset(wrapper, 'borderRadius');
      set(wrapper, {
        transitionProperty: 'transform, border-radius',
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });
    }
  }

  function onNestedOpenChange(o: boolean) {
    const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const y = o ? -NESTED_DISPLACEMENT : 0;

    if (nestedOpenChangeTimer.current) {
      window.clearTimeout(nestedOpenChangeTimer.current);
    }

    set(drawerRef.current, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      transform: `scale(${scale}) translate3d(0, ${y}px, 0)`,
    });

    if (!o && drawerRef.current) {
      nestedOpenChangeTimer.current = setTimeout(() => {
        const translateValue = getTranslate(drawerRef.current as HTMLElement, direction);
        set(drawerRef.current, {
          transition: 'none',
          transform: isVertical(direction)
            ? `translate3d(0, ${translateValue}px, 0)`
            : `translate3d(${translateValue}px, 0, 0)`,
        });
      }, 500);
    }
  }

  function onNestedDrag(event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) {
    if (percentageDragged < 0) return;

    const initialDim = isVertical(direction) ? window.innerHeight : window.innerWidth;
    const initialScale = (initialDim - NESTED_DISPLACEMENT) / initialDim;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newTranslate = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;

    set(drawerRef.current, {
      transform: isVertical(direction)
        ? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)`
        : `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
      transition: 'none',
    });
  }

  function onNestedRelease(event: React.PointerEvent<HTMLDivElement>, o: boolean) {
    const dim = isVertical(direction) ? window.innerHeight : window.innerWidth;
    const scale = o ? (dim - NESTED_DISPLACEMENT) / dim : 1;
    const translate = o ? -NESTED_DISPLACEMENT : 0;

    if (o) {
      set(drawerRef.current, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        transform: isVertical(direction)
          ? `scale(${scale}) translate3d(0, ${translate}px, 0)`
          : `scale(${scale}) translate3d(${translate}px, 0, 0)`,
      });
    }
  }

  return (
    <DialogPrimitive.Root
      modal={modal}
      onOpenChange={(o: boolean) => {
        if (openProp !== undefined) {
          onOpenChange?.(o);
          return;
        }

        if (!o) {
          closeDrawer();
        } else {
          setHasBeenOpened(true);
          setIsOpen(o);
        }
      }}
      open={isOpen}
    >
      <DrawerContext.Provider
        value={{
          visible,
          activeSnapPoint,
          snapPoints,
          setActiveSnapPoint,
          drawerRef,
          overlayRef,
          scaleBackground,
          onOpenChange,
          onPress,
          setVisible,
          onRelease,
          onDrag,
          dismissible,
          handleOnly,
          isOpen,
          isDragging,
          shouldFade,
          closeDrawer,
          onNestedDrag,
          onNestedOpenChange,
          onNestedRelease,
          keyboardIsOpen,
          openProp,
          modal,
          snapPointsOffset,
          direction,
        }}
      >
        {children}
      </DrawerContext.Provider>
    </DialogPrimitive.Root>
  );
}

type HandleProps = React.ComponentPropsWithoutRef<'div'> & {
  preventCycle?: boolean;
};

const LONG_HANDLE_PRESS_TIMEOUT = 250;
const DOUBLE_TAP_TIMEOUT = 120;

const Handle = React.forwardRef<HTMLDivElement, HandleProps>(function (
  { preventCycle = false, children, ...rest },
  ref,
) {
  const {
    visible,
    closeDrawer,
    isDragging,
    snapPoints,
    activeSnapPoint,
    setActiveSnapPoint,
    dismissible,
    handleOnly,
    onPress,
    onDrag,
  } = useDrawerContext();

  const closeTimeoutIdRef = React.useRef<number | null>(null);
  const shouldCancelInteractionRef = React.useRef(false);

  function handleStartCycle() {
    // Stop if this is the second click of a double click
    if (shouldCancelInteractionRef.current) {
      handleCancelInteraction();
      return;
    }
    window.setTimeout(() => {
      handleCycleSnapPoints();
    }, DOUBLE_TAP_TIMEOUT);
  }

  function handleCycleSnapPoints() {
    // Prevent accidental taps while resizing drawer
    if (isDragging || preventCycle || shouldCancelInteractionRef.current) {
      handleCancelInteraction();
      return;
    }
    // Make sure to clear the timeout id if the user releases the handle before the cancel timeout
    handleCancelInteraction();

    if ((!snapPoints || snapPoints.length === 0) && dismissible) {
      closeDrawer();
      return;
    }

    const isLastSnapPoint = activeSnapPoint === snapPoints[snapPoints.length - 1];
    if (isLastSnapPoint && dismissible) {
      closeDrawer();
      return;
    }

    const currentSnapIndex = snapPoints.findIndex((point) => point === activeSnapPoint);
    if (currentSnapIndex === -1) return; // activeSnapPoint not found in snapPoints
    const nextSnapPoint = snapPoints[currentSnapIndex + 1];
    setActiveSnapPoint(nextSnapPoint);
  }

  function handleStartInteraction() {
    closeTimeoutIdRef.current = window.setTimeout(() => {
      // Cancel click interaction on a long press
      shouldCancelInteractionRef.current = true;
    }, LONG_HANDLE_PRESS_TIMEOUT);
  }

  function handleCancelInteraction() {
    window.clearTimeout(closeTimeoutIdRef.current);
    shouldCancelInteractionRef.current = false;
  }

  return (
    <div
      onClick={handleStartCycle}
      onDoubleClick={() => {
        shouldCancelInteractionRef.current = true;
        closeDrawer();
      }}
      onPointerCancel={handleCancelInteraction}
      onPointerDown={(e) => {
        if (handleOnly) onPress(e);
        handleStartInteraction();
      }}
      onPointerMove={(e) => {
        if (handleOnly) onDrag(e);
      }}
      // onPointerUp is already handled by the content component
      ref={ref}
      vaul-drawer-visible={visible ? 'true' : 'false'}
      vaul-handle=""
      aria-hidden="true"
      {...rest}
    >
      {/* Expand handle's hit area beyond what's visible to ensure a 44x44 tap target for touch devices */}
      <span vaul-handle-hitarea="" aria-hidden="true">
        {children}
      </span>
    </div>
  );
});

Handle.displayName = 'Drawer.Handle';

const Overlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  function ({ children, ...rest }, ref) {
    const { overlayRef, snapPoints, onRelease, shouldFade, isOpen, visible } = useDrawerContext();
    const composedRef = useComposedRefs(ref, overlayRef);
    const hasSnapPoints = snapPoints && snapPoints.length > 0;

    return (
      <DialogPrimitive.Overlay
        onMouseUp={onRelease}
        ref={composedRef}
        vaul-drawer-visible={visible ? 'true' : 'false'}
        vaul-overlay=""
        vaul-snap-points={isOpen && hasSnapPoints ? 'true' : 'false'}
        vaul-snap-points-overlay={isOpen && shouldFade ? 'true' : 'false'}
        {...rest}
      />
    );
  },
);

Overlay.displayName = 'Drawer.Overlay';

type ContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  onAnimationEnd?: (open: boolean) => void;
};

const Content = React.forwardRef<HTMLDivElement, ContentProps>(function (
  { onOpenAutoFocus, onPointerDownOutside, onAnimationEnd, style, ...rest },
  ref,
) {
  const {
    drawerRef,
    onPress,
    onRelease,
    onDrag,
    dismissible,
    keyboardIsOpen,
    snapPointsOffset,
    visible,
    closeDrawer,
    modal,
    openProp,
    onOpenChange,
    setVisible,
    handleOnly,
    direction,
  } = useDrawerContext();
  const composedRef = useComposedRefs(ref, drawerRef);
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const wasBeyondThePointRef = React.useRef(false);

  const isDeltaInDirection = (delta: { x: number; y: number }, direction: DrawerDirection, threshold = 0) => {
    if (wasBeyondThePointRef.current) return true;

    const deltaY = Math.abs(delta.y);
    const deltaX = Math.abs(delta.x);
    const isDeltaX = deltaX > deltaY;
    const dFactor = ['bottom', 'right'].includes(direction) ? 1 : -1;

    if (direction === 'left' || direction === 'right') {
      const isReverseDirection = delta.x * dFactor < 0;
      if (!isReverseDirection && deltaX >= 0 && deltaX <= threshold) {
        return isDeltaX;
      }
    } else {
      const isReverseDirection = delta.y * dFactor < 0;
      if (!isReverseDirection && deltaY >= 0 && deltaY <= threshold) {
        return !isDeltaX;
      }
    }

    wasBeyondThePointRef.current = true;
    return true;
  };

  React.useEffect(() => {
    // Trigger enter animation without using CSS animation
    setVisible(true);
  }, []);

  return (
    <DialogPrimitive.Content
      vaul-drawer=""
      vaul-drawer-direction={direction}
      vaul-drawer-visible={visible ? 'true' : 'false'}
      {...rest}
      ref={composedRef}
      style={
        snapPointsOffset && snapPointsOffset.length > 0
          ? ({
              '--snap-point-height': `${snapPointsOffset[0]!}px`,
              ...style,
            } as React.CSSProperties)
          : style
      }
      onOpenAutoFocus={(e) => {
        if (onOpenAutoFocus) {
          onOpenAutoFocus(e);
        } else {
          e.preventDefault();
          drawerRef.current?.focus();
        }
      }}
      onPointerDown={(event) => {
        if (handleOnly) return;
        rest.onPointerDown?.(event);
        pointerStartRef.current = { x: event.clientX, y: event.clientY };
        onPress(event);
      }}
      onPointerDownOutside={(e) => {
        onPointerDownOutside?.(e);
        if (!modal || e.defaultPrevented) {
          e.preventDefault();
          return;
        }
        if (keyboardIsOpen.current) {
          keyboardIsOpen.current = false;
        }
        e.preventDefault();
        onOpenChange?.(false);
        if (!dismissible || openProp !== undefined) {
          return;
        }

        closeDrawer();
      }}
      onFocusOutside={(e) => {
        if (!modal) {
          e.preventDefault();
          return;
        }
      }}
      onEscapeKeyDown={(e) => {
        if (!modal) {
          e.preventDefault();
          return;
        }
      }}
      onPointerMove={(event) => {
        if (handleOnly) return;
        rest.onPointerMove?.(event);
        if (!pointerStartRef.current) return;
        const yPosition = event.clientY - pointerStartRef.current.y;
        const xPosition = event.clientX - pointerStartRef.current.x;

        const swipeStartThreshold = event.pointerType === 'touch' ? 10 : 2;
        const delta = { x: xPosition, y: yPosition };

        const isAllowedToSwipe = isDeltaInDirection(delta, direction, swipeStartThreshold);
        if (isAllowedToSwipe) onDrag(event);
        else if (Math.abs(xPosition) > swipeStartThreshold || Math.abs(yPosition) > swipeStartThreshold) {
          pointerStartRef.current = null;
        }
      }}
      onPointerUp={(event) => {
        rest.onPointerUp?.(event);
        pointerStartRef.current = null;
        wasBeyondThePointRef.current = false;
        onRelease(event);
      }}
    />
  );
});

Content.displayName = 'Drawer.Content';

function NestedRoot({ onDrag, onOpenChange, ...rest }: DialogProps) {
  const { onNestedDrag, onNestedOpenChange, onNestedRelease } = useDrawerContext();

  if (!onNestedDrag) {
    throw new Error('Drawer.NestedRoot must be placed in another drawer');
  }

  return (
    <Root
      nested
      onClose={() => {
        onNestedOpenChange(false);
      }}
      onDrag={(e, p) => {
        onNestedDrag(e, p);
        onDrag?.(e, p);
      }}
      onOpenChange={(o) => {
        if (o) {
          onNestedOpenChange(o);
        }
        onOpenChange?.(o);
      }}
      onRelease={onNestedRelease}
      {...rest}
    />
  );
}

export const Drawer = {
  Root,
  NestedRoot,
  Content,
  Handle,
  Overlay,
  Trigger: DialogPrimitive.Trigger,
  Portal: DialogPrimitive.Portal,
  Close: DialogPrimitive.Close,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
};

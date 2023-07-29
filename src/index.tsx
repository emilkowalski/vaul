'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useControllableState } from './use-controllable-state';
import { DrawerContext, useDrawerContext } from './context';
import React, { useEffect } from 'react';
import './style.css';
import { usePreventScroll } from './use-prevent-scroll';
import { useComposedRefs } from './use-composed-refs';
import { SnapPoint } from './types';

const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1],
};

const BORDER_RADIUS = 8;

const cache = new Map();

interface Style {
  [key: string]: string;
}

function set(el?: Element | HTMLElement | null, styles?: Style, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement) || !styles) return;
  let originalStyles: Style = {};

  Object.entries(styles).forEach(([key, value]: [string, string]) => {
    if (key.startsWith('--')) {
      el.style.setProperty(key, value);
      return;
    }

    originalStyles[key] = (el.style as any)[key];
    (el.style as any)[key] = value;
  });

  if (ignoreCache) return;
  cache.set(el, originalStyles);
}

function reset(el: Element | HTMLElement | null, prop?: string) {
  if (!el || !(el instanceof HTMLElement)) return;
  let originalStyles = cache.get(el);

  if (!originalStyles) {
    (el.style as any) = {};
    return;
  }

  if (prop) {
    (el.style as any)[prop] = originalStyles[prop];
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      (el.style as any)[key] = value;
    });
  }
}

function getSnapPointHeight(snapPoint: SnapPoint | number, drawerRef: React.RefObject<HTMLDivElement>) {
  if (!drawerRef.current) return;
  const drawerHeight = drawerRef.current.getBoundingClientRect().height;
  const fraction = typeof snapPoint === 'number' ? snapPoint : snapPoint.fraction;

  const snapPointHeight = fraction * drawerHeight;
  return drawerHeight - snapPointHeight;
}

interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  shouldScaleBackground?: boolean;
  dismissible?: boolean;
  fixedHeight?: boolean;
  snapPoints?: number[];
  onSnapPointChange?(snapPoint: number): void;
}

function Root({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  shouldScaleBackground,
  fixedHeight,
  dismissible = true,
  snapPoints,
  onSnapPointChange,
}: DialogProps) {
  const [isOpen = false, setIsOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeSnapPoint, setActiveSnapPoint] = React.useState<SnapPoint | null>(
    snapPoints?.length > 0
      ? {
          fraction: snapPoints[0],
          height: 0,
        }
      : null,
  );
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const dragStartTime = React.useRef<Date | null>(null);
  const dragEndTime = React.useRef<Date | null>(null);
  const lastTimeDragPrevented = React.useRef<Date | null>(null);
  const isPointerDown = React.useRef(false);
  const pointerStartY = React.useRef(0);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const initialViewportHeight = React.useRef(0);
  const isLastSnapPoint = activeSnapPoint?.fraction === snapPoints?.[snapPoints?.length - 1];
  const isFirstSnapPoint = activeSnapPoint?.fraction === snapPoints?.[0];

  usePreventScroll({
    isDisabled: !isOpen || isDragging || fixedHeight,
  });

  function getScale() {
    return (window.innerWidth - 26) / window.innerWidth;
  }

  function onPress(event: React.PointerEvent<HTMLDivElement>) {
    if (!dismissible) return;
    isPointerDown.current = true;
    if (snapPoints) {
      setActiveSnapPoint((s) => ({ ...s, height: getSnapPointHeight(activeSnapPoint, drawerRef) }));
    }
    dragStartTime.current = new Date();

    // Ensure we maintain correct pointer capture even when going outside of the drawer
    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    pointerStartY.current = event.clientY;
  }

  function shouldDrag(el: EventTarget, isDraggingDown: boolean) {
    let element = el as HTMLElement;
    const date = new Date();
    const highlightedText = window.getSelection().toString();

    // Don't drag if there's highlighted text
    if (highlightedText.length > 0) {
      return false;
    }

    // We don't want to scroll, but rather drag if the current snapPoint is not the last one
    if (snapPoints && !isLastSnapPoint) return true;

    // Disallow dragging if drawer was scrolled within last second
    if (lastTimeDragPrevented.current && date.getTime() - lastTimeDragPrevented.current.getTime() < 1000) {
      lastTimeDragPrevented.current = new Date();
      return false;
    }

    // Keep climbing up the DOM tree as long as there's a parent
    while (element) {
      // Check if the element is scrollable
      if (element.scrollHeight > element.clientHeight) {
        if (element.role === 'dialog' || element.getAttribute('vaul-drawer')) return true;
        // if (snapPoints && activeSnapPoint === snapPoints[snapPoints?.length - 1]) return false;

        if (element.scrollTop > 0) {
          lastTimeDragPrevented.current = new Date();

          // The element is scrollable and not scrolled to the top, so don't drag
          return false;
        }

        if (isDraggingDown && element !== document.body) {
          lastTimeDragPrevented.current = new Date();
          // Element is scrolled to the top, but we are dragging down so we should allow scrolling
          return false;
        }
      }

      // Move up to the parent element
      element = element.parentNode as HTMLElement;
    }

    // No scrollable parents not scrolled to the top found, so drag
    return true;
  }

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
    if (isPointerDown.current) {
      const draggedDistance = pointerStartY.current - event.clientY;

      const isDraggingDown = draggedDistance > 0;

      if (!shouldDrag(event.target, isDraggingDown)) return;
      setIsDragging(true);
      const swipeFrom = activeSnapPoint?.height || 0;

      const drawerHeight = drawerRef.current?.getBoundingClientRect().height || 0;

      set(drawerRef.current, {
        transition: 'none',
      });

      // Allow dragging upwards up to 40px
      if (draggedDistance > 0 && !snapPoints) {
        set(drawerRef.current, {
          '--swipe-amount': `${Math.max(draggedDistance * -1, -40)}px`,
        });
        return;
      }

      // We need to capture last time when drag with scroll was triggered and have a timeout between
      const absDraggedDistance = Math.abs(draggedDistance);
      const wrapper = document.querySelector('[vaul-drawer-wrapper]');

      const percentageDragged = absDraggedDistance / drawerHeight;
      const opacityValue = 1 - percentageDragged;

      if (!snapPoints) {
        set(
          overlayRef.current,
          {
            opacity: `${opacityValue}`,
          },
          true,
        );
      }

      if (wrapper && overlayRef.current && shouldScaleBackground) {
        // Calculate percentageDragged as a fraction (0 to 1)
        const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
        const borderRadiusValue = 8 - percentageDragged * 8;

        const translateYValue = Math.max(0, 14 - percentageDragged * 14);

        set(
          wrapper,
          {
            borderRadius: `${borderRadiusValue}px`,
            transform: `scale(${scaleValue}) translateY(${translateYValue}px)`,
            transition: 'none',
          },
          true,
        );
      }

      set(drawerRef.current, {
        '--swipe-amount': `${activeSnapPoint ? swipeFrom - draggedDistance : absDraggedDistance}px`,
      });
    }
  }

  useEffect(() => {
    initialViewportHeight.current = window.visualViewport.height;

    function onVisualViewportChange() {
      if (!drawerRef.current || fixedHeight) return;

      const visualViewportHeight = window.visualViewport.height;
      const diffFromInitial = initialViewportHeight.current - visualViewportHeight;
      const drawerHeight = drawerRef.current?.getBoundingClientRect().height || 0;
      const offsetFromTop = drawerRef.current?.getBoundingClientRect().top;

      if (drawerHeight > visualViewportHeight) {
        drawerRef.current.style.height = `${visualViewportHeight - offsetFromTop}px`;
      } else {
        drawerRef.current.style.height = 'initial';
      }

      drawerRef.current.style.bottom = `${diffFromInitial}px`;
    }

    window.visualViewport.addEventListener('resize', onVisualViewportChange);
    return () => window.visualViewport.removeEventListener('resize', onVisualViewportChange);
  }, []);

  function closeDrawer() {
    if (!dismissible) return;
    setIsOpen(false);
    const drawerHeight = drawerRef.current?.getBoundingClientRect().height || 0;

    if (drawerRef.current) {
      set(drawerRef.current, {
        '--hide-to': `${drawerHeight.toFixed()}px`,
      });

      const opacityValue = overlayRef.current?.style.opacity || 1;

      set(overlayRef.current, {
        '--opacity-from': `${opacityValue}`,
      });
    }
  }

  React.useEffect(() => {
    if (!isOpen && shouldScaleBackground) {
      // Can't use `onAnimationEnd` as the component will be unmounted by then
      const id = setTimeout(() => {
        reset(document.body);
      }, 200);

      return () => clearTimeout(id);
    }
  }, [isOpen]);

  function resetDrawer() {
    const wrapper = document.querySelector('[vaul-drawer-wrapper]');
    const currentSwipeAmount = Number(
      getComputedStyle(drawerRef.current).getPropertyValue('--swipe-amount').slice(0, -2),
    );

    set(drawerRef.current, {
      '--swipe-amount': `${0}px`,
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    });

    // Don't reset background if swiped upwards
    if (shouldScaleBackground && currentSwipeAmount > 0 && isOpen) {
      set(
        wrapper,
        {
          borderRadius: `${BORDER_RADIUS}px`,
          overflow: 'hidden',
          transform: `scale(${getScale()}) translateY(calc(env(safe-area-inset-top) + 14px))`,
          transformOrigin: 'top',
          transitionProperty: 'transform, border-radius',
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        },
        true,
      );
    }
  }

  function snapToNextPoint() {
    const activeSnapPointIndex = snapPoints?.findIndex((snapPoint) => snapPoint === activeSnapPoint?.fraction);

    const nextSnapPointHeight = getSnapPointHeight(snapPoints[activeSnapPointIndex + 1], drawerRef);
    setActiveSnapPoint({ fraction: snapPoints[activeSnapPointIndex + 1], height: nextSnapPointHeight });
    onSnapPointChange?.(snapPoints[activeSnapPointIndex + 1]);
    set(drawerRef.current, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      '--show-to': `${nextSnapPointHeight}px`,
      '--swipe-amount': `${nextSnapPointHeight}px`,
    });
  }

  function snapToPreviousPoint() {
    const activeSnapPointIndex = snapPoints?.findIndex((snapPoint) => snapPoint === activeSnapPoint?.fraction);

    const previousSnapPointHeight = getSnapPointHeight(snapPoints[activeSnapPointIndex - 1], drawerRef);
    setActiveSnapPoint({ fraction: snapPoints[activeSnapPointIndex - 1], height: previousSnapPointHeight });
    onSnapPointChange?.(snapPoints[activeSnapPointIndex - 1]);
    set(drawerRef.current, {
      '--show-to': `${previousSnapPointHeight}px`,
      '--swipe-amount': `${previousSnapPointHeight}px`,
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    });
  }

  function onRelease(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(false);
    isPointerDown.current = false;
    dragEndTime.current = new Date();
    const swipeAmount = drawerRef.current
      ? getComputedStyle(drawerRef.current).getPropertyValue('--swipe-amount').slice(0, -2)
      : null;

    if (!shouldDrag(event.target, false) || !swipeAmount) return;

    if (dragStartTime.current === null) return;

    const y = event.clientY;

    const timeTaken = dragEndTime.current.getTime() - dragStartTime.current.getTime();
    const distMoved = pointerStartY.current - y;
    const velocity = Math.abs(distMoved) / timeTaken;

    if (distMoved > 0) {
      if (activeSnapPoint && distMoved > 10 && !isLastSnapPoint && velocity > 0.1) {
        snapToNextPoint();
        return;
      }

      resetDrawer();
      return;
    }

    if (distMoved < 0 && !isFirstSnapPoint && velocity > 0.1) {
      snapToPreviousPoint();
      return;
    }

    if (velocity > 0.4) {
      closeDrawer();
      return;
    }

    if (y > window.innerHeight * 0.75 && !snapPoints) {
      closeDrawer();
      return;
    }

    resetDrawer();
  }

  function onAnimationStart(e: React.AnimationEvent<HTMLDivElement>) {
    const wrapper = document.querySelector('[vaul-drawer-wrapper]');

    if (!wrapper || !shouldScaleBackground) return;

    if (e.animationName === 'show-dialog') {
      set(
        document.body,
        {
          background: 'black',
        },
        true,
      );

      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        transform: `scale(${getScale()}) translateY(calc(env(safe-area-inset-top) + 14px))`,
        transformOrigin: 'top',
        transitionProperty: 'transform, border-radius',
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });
    } else if (e.animationName === 'hide-dialog') {
      // Exit
      reset(wrapper, 'transform');
      reset(wrapper, 'borderRadius');
      set(wrapper, {
        transitionProperty: 'transform, border-radius',
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });
    }
  }

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(o) => {
        setIsOpen(o);

        if (o && snapPoints) {
          setActiveSnapPoint({ fraction: snapPoints[0], height: getSnapPointHeight(snapPoints[0], drawerRef) });
          onSnapPointChange?.(snapPoints[0]);
        }
      }}
    >
      <DrawerContext.Provider
        value={{
          drawerRef,
          overlayRef,
          onAnimationStart,
          onPress,
          onRelease,
          onMove,
          dismissible,
          snapPoints,
          isOpen,
          isDragging,
          activeSnapPoint,
        }}
      >
        {children}
      </DrawerContext.Provider>
    </DialogPrimitive.Root>
  );
}

const Overlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  function ({ children, ...rest }, ref) {
    const { overlayRef, onRelease } = useDrawerContext();
    const composedRef = useComposedRefs(ref, overlayRef);

    return <DialogPrimitive.Overlay onMouseUp={onRelease} ref={composedRef} vaul-overlay="" {...rest} />;
  },
);

const Content = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
  function ({ children, onOpenAutoFocus, onPointerDownOutside, ...rest }, ref) {
    const {
      drawerRef,
      onPress,
      onRelease,
      onAnimationStart,
      onMove,
      dismissible,
      snapPoints,
      isOpen,
      isDragging,
      activeSnapPoint,
    } = useDrawerContext();
    const [mounted, setMounted] = React.useState(false);
    const composedRef = useComposedRefs(ref, drawerRef);

    useEffect(() => {
      if (isOpen) {
        setMounted(true);
        if (snapPoints?.length > 0 && activeSnapPoint.fraction === snapPoints[0]) {
          set(drawerRef.current, {
            '--show-to': `${getSnapPointHeight(activeSnapPoint, drawerRef)}px`,
          });
        }
      } else {
        setMounted(false);
      }
    }, [isOpen]);

    return (
      <DialogPrimitive.Content
        onAnimationStart={onAnimationStart}
        onPointerDown={onPress}
        onPointerUp={onRelease}
        onPointerMove={onMove}
        onOpenAutoFocus={(e) => {
          if (onOpenAutoFocus) {
            onOpenAutoFocus(e);
          } else {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          if (!dismissible) {
            e.preventDefault();
          }
          onPointerDownOutside?.(e);
        }}
        ref={composedRef}
        {...rest}
        style={{ ...rest.style }}
        vaul-drawer=""
        vaul-drawer-state={mounted ? 'open' : 'closed'}
        vaul-drawer-is-dragging={isDragging ? 'true' : 'false'}
      >
        {children}
      </DialogPrimitive.Content>
    );
  },
);
export const Drawer = Object.assign(
  {},
  {
    Root,
    Content,
    Overlay,
    Trigger: DialogPrimitive.Trigger,
    Portal: DialogPrimitive.Portal,
    Close: DialogPrimitive.Close,
    Title: DialogPrimitive.Title,
    Description: DialogPrimitive.Description,
  },
);

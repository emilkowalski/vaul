'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useControllableState } from './use-controllable-state';
import { DrawerContext, useDrawerContext } from './context';
import React, { useEffect } from 'react';
import './style.css';
import { usePreventScroll } from './use-prevent-scroll';
import { useComposedRefs } from './use-composed-refs';

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

interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  shouldScaleBackground?: boolean;
  dismissible?: boolean;
}

function Root({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  shouldScaleBackground,
  dismissible = true,
}: DialogProps) {
  const [isOpen = false, setIsOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const dragStartTime = React.useRef<Date | null>(null);
  const dragEndTime = React.useRef<Date | null>(null);
  const lastTimeDragPrevented = React.useRef<Date | null>(null);
  const pointerStartY = React.useRef(0);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const initialViewportHeight = React.useRef(0);

  usePreventScroll({
    isDisabled: !isOpen || isDragging,
  });

  function getScale() {
    return (window.innerWidth - 26) / window.innerWidth;
  }

  function onPress(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(true);
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
      lastTimeDragPrevented.current = new Date();
      return false;
    }

    // Disallow dragging if drawer was scrolled within last second
    if (lastTimeDragPrevented.current && date.getTime() - lastTimeDragPrevented.current.getTime() < 1000) {
      lastTimeDragPrevented.current = new Date();
      return false;
    }

    // Keep climbing up the DOM tree as long as there's a parent
    while (element) {
      // Check if the element is scrollable
      if (element.scrollHeight > element.clientHeight) {
        if (element.role === 'dialog') return true;

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
    if (isDragging) {
      const draggedDistance = pointerStartY.current - (event as unknown as React.PointerEvent<HTMLDivElement>).clientY;
      const isDraggingDown = draggedDistance > 0;

      if (!shouldDrag(event.target, isDraggingDown)) return;

      const drawerHeight = drawerRef.current?.getBoundingClientRect().height || 0;

      set(drawerRef.current, {
        transition: 'none',
      });

      // Allow dragging upwards up to 40px
      if (draggedDistance > 0) {
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

      set(
        overlayRef.current,
        {
          opacity: `${opacityValue}`,
        },
        true,
      );

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
        '--swipe-amount': `${absDraggedDistance}px`,
      });
    }
  }

  useEffect(() => {
    initialViewportHeight.current = window.visualViewport.height;

    function onVisualViewportChange() {
      if (!drawerRef.current) return;

      const visualViewportHeight = window.visualViewport.height;
      const diffFromInitial = initialViewportHeight.current - visualViewportHeight;
      const drawerHeight = drawerRef.current?.getBoundingClientRect().height || 0;

      if (drawerHeight > visualViewportHeight) {
        drawerRef.current.style.height = `${visualViewportHeight - 72}px`;
      } else {
        drawerRef.current.style.height = 'initial';
      }

      drawerRef.current.style.bottom = `${diffFromInitial}px`;
    }

    window.visualViewport.addEventListener('resize', onVisualViewportChange);
    return () => window.visualViewport.removeEventListener('resize', onVisualViewportChange);
  });

  function closeDrawer() {
    setIsOpen(false);
    const drawerHeight = drawerRef.current?.getBoundingClientRect().height || 0;

    if (drawerRef.current) {
      const swipeAmount = getComputedStyle(drawerRef.current).getPropertyValue('--swipe-amount').slice(0, -2);

      set(drawerRef.current, {
        '--hide-from': `${Number(swipeAmount).toFixed()}px`,
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
      transition: `transform 500ms cubic-bezier(0.32, 0.72, 0, 1)`,
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

  function onRelease(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(false);
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

    // Moved upwards, don't do anything
    if (distMoved > 0) {
      resetDrawer();
      return;
    }

    if (velocity > 0.4 && dismissible) {
      closeDrawer();
      return;
    }

    if (y > window.innerHeight * 0.75 && dismissible) {
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
        setIsDragging(false);
        setIsOpen(!dismissible || o);
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
  function ({ children, onOpenAutoFocus, ...rest }, ref) {
    const { drawerRef, onPress, onRelease, onAnimationStart, onMove } = useDrawerContext();
    const composedRef = useComposedRefs(ref, drawerRef);

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
        ref={composedRef}
        {...rest}
        vaul-drawer=""
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

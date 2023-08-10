'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useControllableState } from './use-controllable-state';
import { DrawerContext, useDrawerContext } from './context';
import React, { useEffect } from 'react';
import './style.css';
import { usePreventScroll, isInput, isIOS } from './use-prevent-scroll';
import { useComposedRefs } from './use-composed-refs';

const CLOSE_THRESHOLD = 0.25;

const SCROLL_LOCK_TIMEOUT = 1000;

const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1],
};

const ANIMATION_DURATION = 501;

const BORDER_RADIUS = 8;

const cache = new Map();

interface Style {
  [key: string]: string;
}

function isInView(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    // Need + 40 for safari detection
    rect.bottom <= window.visualViewport.height + 40 &&
    rect.right <= window.visualViewport.width
  );
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
  closeThreshold?: number;
  onOpenChange?(open: boolean): void;
  shouldScaleBackground?: boolean;
  scrollLockTimeout?: number;
  dismissible?: boolean;
  onDrag?(event: React.PointerEvent<HTMLDivElement>, percentageDragged: number): void;
  onRelease?(event: React.PointerEvent<HTMLDivElement>, open: boolean): void;
}

function Root({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  shouldScaleBackground,
  onDrag: onDragProp,
  onRelease: onReleaseProp,
  closeThreshold = CLOSE_THRESHOLD,
  scrollLockTimeout = SCROLL_LOCK_TIMEOUT,
  dismissible = true,
}: DialogProps) {
  const [isOpen = false, setIsOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(true);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const dragStartTime = React.useRef<Date | null>(null);
  const dragEndTime = React.useRef<Date | null>(null);
  const lastTimeScrolled = React.useRef<Date | null>(null);
  const nestedOpenChangeTimer = React.useRef<NodeJS.Timeout>(null);
  const pointerStartY = React.useRef(0);
  const keyboardIsOpen = React.useRef(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const initialViewportHeight = React.useRef(0);
  const previousBodyPosition = React.useRef<Record<string, string>>({});
  const vaulScaledBgWrapper = typeof window !== 'undefined' ? document.querySelector('[vaul-drawer-wrapper]') : null;
  usePreventScroll({
    isDisabled: !isOpen || isDragging || isAnimating,
  });

  function getScale() {
    return (window.innerWidth - 26) / window.innerWidth;
  }

  function onPress(event: React.PointerEvent<HTMLDivElement>) {
    if (!dismissible) return;
    if (!drawerRef.current.contains(event.target as Node) || (event.target as HTMLElement).tagName === 'BUTTON') return;

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
      return false;
    }

    // Disallow dragging if drawer was scrolled within last second
    if (
      lastTimeScrolled.current &&
      date.getTime() - lastTimeScrolled.current.getTime() < scrollLockTimeout &&
      !isDragging
    ) {
      return false;
    }

    // Keep climbing up the DOM tree as long as there's a parent
    while (element) {
      // Check if the element is scrollable
      if (element.scrollHeight > element.clientHeight) {
        if (element.role === 'dialog' || element.getAttribute('vaul-drawer')) return true;

        if (element.scrollTop > 0) {
          lastTimeScrolled.current = new Date();

          // The element is scrollable and not scrolled to the top, so don't drag
          return false;
        }

        if (isDraggingDown && element !== document.body) {
          lastTimeScrolled.current = new Date();
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

  const drawerHeight = drawerRef.current?.getBoundingClientRect().height || 0;

  function onDrag(event: React.PointerEvent<HTMLDivElement>) {
    // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
    if (isDragging) {
      const draggedDistance = Math.trunc(pointerStartY.current - event.clientY);

      const isDraggingDown = draggedDistance > 0;

      if (!shouldDrag(event.target, isDraggingDown)) return;

      requestAnimationFrame(() => {
        set(drawerRef.current, {
          transition: 'none',
        });

        set(overlayRef.current, {
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
        const percentageDragged = absDraggedDistance / drawerHeight;
        const opacityValue = 1 - percentageDragged;
        onDragProp?.(event, percentageDragged);

        set(
          overlayRef.current,
          {
            opacity: `${opacityValue}`,
          },
          true,
        );

        if (vaulScaledBgWrapper && overlayRef.current && shouldScaleBackground) {
          // Calculate percentageDragged as a fraction (0 to 1)
          const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
          const borderRadiusValue = 8 - percentageDragged * 8;

          const translateYValue = Math.max(0, 14 - percentageDragged * 14);

          set(
            vaulScaledBgWrapper,
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
      });
    }
  }

  useEffect(() => {
    initialViewportHeight.current = window.visualViewport.height;

    function onVisualViewportChange() {
      if (!drawerRef.current) return;
      const focusedElement = document.activeElement as HTMLElement;

      if ((!isInView(focusedElement) && isInput(focusedElement)) || keyboardIsOpen.current) {
        requestAnimationFrame(() => {
          const visualViewportHeight = window.visualViewport.height;
          const diffFromInitial = initialViewportHeight.current - visualViewportHeight;
          const drawerHeight = drawerRef.current.getBoundingClientRect().height || 0;
          const offsetFromTop = drawerRef.current.getBoundingClientRect().top;
          keyboardIsOpen.current = !keyboardIsOpen.current;
          // We don't have to change the height if the input is in view, when we are here we are in the opened keyboard state so we can accuretly check if the input is in view
          if (drawerHeight > visualViewportHeight) {
            drawerRef.current.style.height = `${visualViewportHeight - offsetFromTop}px`;
          } else {
            drawerRef.current.style.height = 'initial';
          }

          drawerRef.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
        });
      }
    }

    window.visualViewport.addEventListener('resize', onVisualViewportChange);
    return () => window.visualViewport.removeEventListener('resize', onVisualViewportChange);
  }, []);

  function closeDrawer() {
    if (!dismissible) return;
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
    const currentSwipeAmount = Number(
      getComputedStyle(drawerRef.current).getPropertyValue('--swipe-amount').slice(0, -2),
    );

    requestAnimationFrame(() => {
      set(drawerRef.current, {
        '--swipe-amount': '0px',
        transition: `transform 500ms cubic-bezier(0.32, 0.72, 0, 1)`,
      });

      set(overlayRef.current, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        opacity: '1',
      });

      // Don't reset background if swiped upwards
      if (shouldScaleBackground && currentSwipeAmount > 0 && isOpen) {
        set(
          vaulScaledBgWrapper,
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
    });
  }

  function onRelease(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).tagName === 'BUTTON' || !isDragging) return;
    setIsDragging(false);
    dragEndTime.current = new Date();
    const swipeAmount = drawerRef.current
      ? Number.parseInt(getComputedStyle(drawerRef.current).getPropertyValue('--swipe-amount').slice(0, -2), 10)
      : null;

    if (!shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount)) return;

    if (dragStartTime.current === null) return;

    const y = event.clientY;

    const timeTaken = dragEndTime.current.getTime() - dragStartTime.current.getTime();
    const distMoved = pointerStartY.current - y;
    const velocity = Math.abs(distMoved) / timeTaken;

    // Moved upwards, don't do anything
    if (distMoved > 0) {
      resetDrawer();
      onReleaseProp?.(event, false);
      return;
    }

    if (velocity > 0.4) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }

    const visibleDrawerHeight = Math.min(drawerRef.current?.getBoundingClientRect().height || 0, window.innerHeight);

    if (swipeAmount >= visibleDrawerHeight * closeThreshold) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }

    onReleaseProp?.(event, true);
    resetDrawer();
  }

  function onAnimationStart(e: React.AnimationEvent<HTMLDivElement>) {
    if (!vaulScaledBgWrapper || !shouldScaleBackground) return;

    if (e.animationName === 'show-dialog') {
      set(
        document.body,
        {
          background: 'black',
        },
        true,
      );

      set(vaulScaledBgWrapper, {
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
      reset(vaulScaledBgWrapper, 'transform');
      reset(vaulScaledBgWrapper, 'borderRadius');
      set(vaulScaledBgWrapper, {
        transitionProperty: 'transform, border-radius',
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });
    }
  }

  function onNestedOpenChange(o: boolean) {
    const scale = o ? (window.innerWidth - 16) / window.innerWidth : 1;
    const y = o ? -16 : 0;
    window.clearTimeout(nestedOpenChangeTimer.current);

    set(drawerRef.current, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      transform: `scale(${scale}) translateY(${y}px)`,
    });

    if (!o) {
      nestedOpenChangeTimer.current = setTimeout(() => {
        set(drawerRef.current, {
          transition: 'none',
          transform: 'translateY(var(--swipe-amount))',
        });
      }, 500);
    }
  }

  function onNestedDrag(event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) {
    if (percentageDragged < 0) return;
    const initialScale = (window.innerWidth - 16) / window.innerWidth;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newY = -16 + percentageDragged * 16;

    set(drawerRef.current, {
      transform: `scale(${newScale}) translateY(${newY}px)`,
      transition: 'none',
    });
  }

  function onNestedRelease(event: React.PointerEvent<HTMLDivElement>, o: boolean) {
    const scale = o ? (window.innerWidth - 16) / window.innerWidth : 1;
    const y = o ? -16 : 0;

    if (o) {
      set(drawerRef.current, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        transform: `scale(${scale}) translateY(${y}px)`,
      });
    }
  }

  function setPositionFixed() {
    // If previousBodyPosition is already set, don't set it again.
    if (previousBodyPosition === undefined) {
      previousBodyPosition.current = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
      };

      // Update the dom inside an animation frame
      const { scrollY, scrollX, innerHeight } = window;
      document.body.style.setProperty('position', 'fixed', 'important');
      document.body.style.top = `${-scrollY}px`;
      document.body.style.left = `${-scrollX}px`;
      document.body.style.right = '0px';

      setTimeout(
        () =>
          requestAnimationFrame(() => {
            // Attempt to check if the bottom bar appeared due to the position change
            const bottomBarHeight = innerHeight - window.innerHeight;
            if (bottomBarHeight && scrollY >= innerHeight) {
              // Move the content further up so that the bottom bar doesn't hide it
              document.body.style.top = `${-(scrollY + bottomBarHeight)}px`;
            }
          }),
        300,
      );
    }
  }

  function restorePositionSetting() {
    if (previousBodyPosition !== undefined) {
      // Convert the position from "px" to Int
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);

      // Restore styles
      document.body.style.position = previousBodyPosition.current.position;
      document.body.style.top = previousBodyPosition.current.top;
      document.body.style.left = previousBodyPosition.current.left;
      document.body.style.right = 'unset';

      // Restore scroll
      requestAnimationFrame(() => {
        window.scrollTo(x, y);
      });

      previousBodyPosition.current = undefined;
    }
  }

  React.useEffect(() => {
    // This is needed to force Safari toolbar to show **before** the drawer starts animating to prevent a gnarly shift from happenning
    if (isOpen && isIOS()) {
      setPositionFixed();
    } else {
      restorePositionSetting();
    }
  }, [isOpen]);

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(o) => {
        if (o) {
          setPositionFixed();
        } else {
          restorePositionSetting();
        }
        setIsOpen(o);
      }}
    >
      <DrawerContext.Provider
        value={{
          drawerRef,
          overlayRef,
          onAnimationStart,
          onPress,
          onRelease,
          onDrag,
          dismissible,
          isOpen,
          onNestedDrag,
          onNestedOpenChange,
          onNestedRelease,
          keyboardIsOpen,
          setIsAnimating,
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

type ContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  onAnimationEnd?: (open: boolean) => void;
};

const Content = React.forwardRef<HTMLDivElement, ContentProps>(function (
  { children, onOpenAutoFocus, onPointerDownOutside, onAnimationEnd, ...rest },
  ref,
) {
  const {
    drawerRef,
    onPress,
    onRelease,
    onAnimationStart,
    onDrag,
    dismissible,
    isOpen,
    keyboardIsOpen,
    setIsAnimating,
  } = useDrawerContext();
  const composedRef = useComposedRefs(ref, drawerRef);
  const animationEndTimer = React.useRef<NodeJS.Timeout>(null);

  return (
    <DialogPrimitive.Content
      onAnimationStart={(e) => {
        window.clearTimeout(animationEndTimer.current);
        setIsAnimating(true);

        animationEndTimer.current = setTimeout(() => {
          setIsAnimating(false);
          onAnimationEnd?.(isOpen);
        }, ANIMATION_DURATION);
        onAnimationStart(e);
      }}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerMove={onDrag}
      onOpenAutoFocus={(e) => {
        if (onOpenAutoFocus) {
          onOpenAutoFocus(e);
        } else {
          e.preventDefault();
        }
      }}
      onPointerDownOutside={(e) => {
        if (keyboardIsOpen.current) {
          keyboardIsOpen.current = false;
          set(drawerRef.current, {
            '--hide-to': `200%`,
          });
        }
        if (!dismissible) {
          e.preventDefault();
        }
        onPointerDownOutside?.(e);
      }}
      ref={composedRef}
      {...rest}
      vaul-drawer=""
    >
      {children}
    </DialogPrimitive.Content>
  );
});

function NestedRoot({ children, onDrag, onOpenChange }: DialogProps) {
  const { onNestedDrag, onNestedOpenChange, onNestedRelease } = useDrawerContext();

  if (!onNestedDrag) {
    throw new Error('Drawer.NestedRoot must be placed in another drawer');
  }

  return (
    <Root
      onDrag={(e, p) => {
        onNestedDrag(e, p);
        onDrag?.(e, p);
      }}
      onOpenChange={(o) => {
        onNestedOpenChange(o);
        onOpenChange?.(o);
      }}
      onRelease={onNestedRelease}
    >
      {children}
    </Root>
  );
}

export const Drawer = Object.assign(
  {},
  {
    Root,
    NestedRoot,
    Content,
    Overlay,
    Trigger: DialogPrimitive.Trigger,
    Portal: DialogPrimitive.Portal,
    Close: DialogPrimitive.Close,
    Title: DialogPrimitive.Title,
    Description: DialogPrimitive.Description,
  },
);

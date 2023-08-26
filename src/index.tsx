'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useControllableState } from './use-controllable-state';
import { DrawerContext, useDrawerContext } from './context';
import React from 'react';
import './style.css';
import { usePreventScroll, isInput } from './use-prevent-scroll';
import { useComposedRefs } from './use-composed-refs';
import { useSafariThemeColor } from './use-safari-theme-color';
import { usePositionFixed } from './use-position-fixed';
import { useSnapPoints } from './use-snap-points';
import { set, reset, getTranslateY, isInView, dampenValue } from './helpers';
import { TRANSITIONS, VELOCITY_THRESHOLD } from './constants';

const CLOSE_THRESHOLD = 0.25;

const SCROLL_LOCK_TIMEOUT = 500;

const ANIMATION_DURATION = 501;

const BORDER_RADIUS = 8;

const NESTED_DISPLACEMENT = 16;

const WINDOW_TOP_OFFSET = 26;

type WithFadeFromProps = {
  snapPoints: number[];
  fadeFrom: number;
};

type WithoutFadeFromProps = {
  snapPoints?: number[];
  fadeFrom?: never;
};

type DialogProps = {
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
  experimentalSafariThemeAnimation?: boolean;
} & (WithFadeFromProps | WithoutFadeFromProps);

function Root({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  shouldScaleBackground,
  onDrag: onDragProp,
  onRelease: onReleaseProp,
  experimentalSafariThemeAnimation,
  snapPoints,
  closeThreshold = CLOSE_THRESHOLD,
  scrollLockTimeout = SCROLL_LOCK_TIMEOUT,
  dismissible = true,
  fadeFrom,
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
  const lastTimeDragPrevented = React.useRef<Date | null>(null);
  const nestedOpenChangeTimer = React.useRef<NodeJS.Timeout>(null);
  const pointerStartY = React.useRef(0);
  const keyboardIsOpen = React.useRef(false);
  const previousDiffFromInitial = React.useRef(0);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const { onDrag: changeThemeColorOnDrag, onRelease: themeTransitionOnRelease } = useSafariThemeColor(
    drawerRef,
    overlayRef,
    isOpen,
    experimentalSafariThemeAnimation,
  );
  const {
    activeSnapPoint,
    activeSnapPointIndex,
    setActiveSnapPoint,
    onRelease: onReleaseSnapPoints,
    snapPointHeights,
    onDrag: onDragSnapPoints,
    shouldFade,
    getPercentageDragged: getSnapPointsPercentageDragged,
  } = useSnapPoints({ snapPoints, drawerRef: drawerRef, fadeFrom, overlayRef: overlayRef });

  usePreventScroll({
    isDisabled: !isOpen || isDragging || isAnimating,
  });

  usePositionFixed({ isOpen });

  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }

  function onPress(event: React.PointerEvent<HTMLDivElement>) {
    if (!dismissible) return;
    if (
      (drawerRef.current && !drawerRef.current.contains(event.target as Node)) ||
      (event.target as HTMLElement).tagName === 'BUTTON'
    )
      return;

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
    const swipeAmount = drawerRef.current ? getTranslateY(drawerRef.current) : null;

    // Don't drag if there's highlighted text
    if (highlightedText.length > 0) {
      return false;
    }

    // Disallow dragging if drawer was scrolled within last second
    if (
      lastTimeDragPrevented.current &&
      date.getTime() - lastTimeDragPrevented.current.getTime() < scrollLockTimeout &&
      swipeAmount === 0
    ) {
      lastTimeDragPrevented.current = new Date();
      return false;
    }

    // Keep climbing up the DOM tree as long as there's a parent
    while (element) {
      // Check if the element is scrollable
      if (element.scrollHeight > element.clientHeight) {
        if (element.role === 'dialog' || element.getAttribute('vaul-drawer')) return true;

        if (element.scrollTop > 0) {
          lastTimeDragPrevented.current = new Date();

          // The element is scrollable and not scrolled to the top, so don't drag
          return false;
        }

        if (isDraggingDown && element !== document.body && !swipeAmount) {
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

  function onDrag(event: React.PointerEvent<HTMLDivElement>) {
    // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
    if (isDragging) {
      const draggedDistance = pointerStartY.current - event.clientY;
      const isDraggingDown = draggedDistance > 0;

      if (!shouldDrag(event.target, isDraggingDown)) return;

      const drawerHeight = drawerRef.current?.getBoundingClientRect().height || 0;

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
      if (draggedDistance > 0 && !snapPoints) {
        const dampenedDraggedDistance = dampenValue(draggedDistance);

        set(drawerRef.current, {
          transform: `translateY(${Math.min(dampenedDraggedDistance * -1, 0)}px)`,
        });
        return;
      }

      // We need to capture last time when drag with scroll was triggered and have a timeout between
      const absDraggedDistance = Math.abs(draggedDistance);
      const wrapper = document.querySelector('[vaul-drawer-wrapper]');

      let percentageDragged = absDraggedDistance / drawerHeight;
      const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance);

      if (snapPointPercentageDragged !== null) {
        percentageDragged = snapPointPercentageDragged;
      }

      const opacityValue = 1 - percentageDragged;

      if (shouldFade || activeSnapPointIndex === snapPoints.length - 2) {
        changeThemeColorOnDrag(percentageDragged);
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

      if (!snapPoints) {
        set(drawerRef.current, {
          transform: `translateY(${absDraggedDistance}px)`,
        });
      }
    }
  }

  React.useEffect(() => {
    function onVisualViewportChange() {
      if (!drawerRef.current) return;

      const focusedElement = document.activeElement as HTMLElement;

      if ((!isInView(focusedElement) && isInput(focusedElement)) || keyboardIsOpen.current) {
        const visualViewportHeight = window.visualViewport.height;
        // This is the height of the keyboard
        const diffFromInitial = window.innerHeight - visualViewportHeight;
        const drawerHeight = drawerRef.current?.getBoundingClientRect().height || 0;
        const offsetFromTop = drawerRef.current?.getBoundingClientRect().top;

        // visualViewport height may change due to some subtle changes to the keyboard. Checking if the height changed by 60 or more will make sure that they keyboard really changed its open state.
        if (Math.abs(previousDiffFromInitial.current - diffFromInitial) > 60) {
          keyboardIsOpen.current = !keyboardIsOpen.current;
        }

        previousDiffFromInitial.current = diffFromInitial;
        // We don't have to change the height if the input is in view, when we are here we are in the opened keyboard state so we can correctly check if the input is in view
        if (drawerHeight > visualViewportHeight || keyboardIsOpen.current) {
          const height = drawerRef.current?.getBoundingClientRect().height;
          let newDrawerHeight = height;

          if (height > visualViewportHeight) {
            newDrawerHeight = visualViewportHeight - WINDOW_TOP_OFFSET;
          }

          drawerRef.current.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
        } else {
          drawerRef.current.style.height = 'initial';
        }

        // Negative bottom value would never make sense
        drawerRef.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
      }
    }

    window.visualViewport.addEventListener('resize', onVisualViewportChange);
    return () => window.visualViewport.removeEventListener('resize', onVisualViewportChange);
  }, []);

  function closeDrawer() {
    if (!dismissible) return;
    drawerRef.current.setAttribute('vaul-closed-by-dragging', 'true');
    setIsOpen(false);

    if (drawerRef.current) {
      set(drawerRef.current, {
        transform: `translateY(100%)`,
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
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
  }, [isOpen, shouldScaleBackground]);

  function resetDrawer() {
    const wrapper = document.querySelector('[vaul-drawer-wrapper]');
    const currentSwipeAmount = getTranslateY(drawerRef.current);

    set(drawerRef.current, {
      transform: 'translateY(0px)',
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    });

    set(overlayRef.current, {
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      opacity: '1',
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
    if ((event.target as HTMLElement).tagName === 'BUTTON' || !isDragging) return;
    setIsDragging(false);
    dragEndTime.current = new Date();
    const swipeAmount = getTranslateY(drawerRef.current);

    if (!shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount)) return;

    if (dragStartTime.current === null) return;

    const y = event.clientY;

    const timeTaken = dragEndTime.current.getTime() - dragStartTime.current.getTime();
    const distMoved = pointerStartY.current - y;
    const velocity = Math.abs(distMoved) / timeTaken;

    if (snapPoints) {
      onReleaseSnapPoints({ draggedDistance: distMoved, closeDrawer, velocity });
      return;
    }

    // Moved upwards, don't do anything
    if (distMoved > 0) {
      resetDrawer();
      onReleaseProp?.(event, true);
      themeTransitionOnRelease(true);
      return;
    }

    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      onReleaseProp?.(event, false);
      themeTransitionOnRelease(false);
      return;
    }

    const visibleDrawerHeight = Math.min(drawerRef.current?.getBoundingClientRect().height || 0, window.innerHeight);

    if (swipeAmount >= visibleDrawerHeight * closeThreshold) {
      closeDrawer();
      onReleaseProp?.(event, false);
      themeTransitionOnRelease(false);
      return;
    }

    onReleaseProp?.(event, true);
    themeTransitionOnRelease(true);
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
    } else if (e.animationName === 'hide-dialog' || e.animationName === 'fake-animation') {
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

  function onNestedOpenChange(o: boolean) {
    const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const y = o ? -NESTED_DISPLACEMENT : 0;
    window.clearTimeout(nestedOpenChangeTimer.current);

    set(drawerRef.current, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      transform: `scale(${scale}) translateY(${y}px)`,
    });

    if (!o) {
      nestedOpenChangeTimer.current = setTimeout(() => {
        set(drawerRef.current, {
          transition: 'none',
          transform: `translateY(${getTranslateY(drawerRef.current)}px)`,
        });
      }, 500);
    }
  }

  function onNestedDrag(event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) {
    if (percentageDragged < 0) return;
    const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newY = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;

    set(drawerRef.current, {
      transform: `scale(${newScale}) translateY(${newY}px)`,
      transition: 'none',
    });
  }

  function onNestedRelease(event: React.PointerEvent<HTMLDivElement>, o: boolean) {
    const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const y = o ? -NESTED_DISPLACEMENT : 0;

    if (o) {
      set(drawerRef.current, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        transform: `scale(${scale}) translateY(${y}px)`,
      });
    }
  }

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(o) => {
        if (!o && snapPoints) {
          closeDrawer();
        }
        setIsOpen(o);
      }}
    >
      <DrawerContext.Provider
        value={{
          activeSnapPoint,
          snapPoints,
          setActiveSnapPoint,
          drawerRef,
          overlayRef,
          onAnimationStart,
          onPress,
          onRelease,
          onDrag,
          dismissible,
          isOpen,
          shouldFade,
          onNestedDrag,
          onNestedOpenChange,
          onNestedRelease,
          keyboardIsOpen,
          setIsAnimating,
          snapPointHeights,
          experimentalSafariThemeAnimation,
        }}
      >
        {children}
      </DrawerContext.Provider>
    </DialogPrimitive.Root>
  );
}

const Overlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  function ({ children, ...rest }, ref) {
    const { overlayRef, snapPoints, onRelease, experimentalSafariThemeAnimation, shouldFade, activeSnapPoint } =
      useDrawerContext();
    const composedRef = useComposedRefs(ref, overlayRef);
    const hasSnapPoints = snapPoints && snapPoints.length > 0;

    return (
      <DialogPrimitive.Overlay
        onMouseUp={onRelease}
        ref={composedRef}
        vaul-overlay=""
        vaul-snap-points={hasSnapPoints ? 'true' : 'false'}
        vaul-theme-transition={experimentalSafariThemeAnimation ? 'true' : 'false'}
        vaul-snap-points-overlay={shouldFade ? 'true' : 'false'}
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
  { children, onOpenAutoFocus, onPointerDownOutside, onAnimationEnd, style, ...rest },
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
    snapPointHeights,
    setActiveSnapPoint,
    snapPoints,
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
          if (snapPoints && !isOpen) {
            setActiveSnapPoint(snapPoints[0]);
          }
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
        drawerRef.current.setAttribute('vaul-clicked-outside', 'true');
        onPointerDownOutside?.(e);
      }}
      ref={composedRef}
      style={
        snapPointHeights
          ? ({
              '--snap-point-height': `${snapPointHeights[0]}px`,
              ...style,
            } as React.CSSProperties)
          : style
      }
      {...rest}
      vaul-drawer=""
    >
      {children}
    </DialogPrimitive.Content>
  );
});

Content.displayName = 'Drawer.Content';

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

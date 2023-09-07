'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';
import { useControllableState } from './use-controllable-state';
import { DrawerContext, useDrawerContext } from './context';
import './style.css';
import { usePreventScroll, isInput, isIOS } from './use-prevent-scroll';
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
  defaultOpen?: boolean;
  closeThreshold?: number;
  onOpenChange?: (open: boolean) => void;
  shouldScaleBackground?: boolean;
  scrollLockTimeout?: number;
  dismissible?: boolean;
  onDrag?: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void;
  onRelease?: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void;
  experimentalSafariThemeAnimation?: boolean;
  modal?: boolean;
  nested?: boolean;
  onClose?: () => void;
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
  nested,
  closeThreshold = CLOSE_THRESHOLD,
  scrollLockTimeout = SCROLL_LOCK_TIMEOUT,
  dismissible = true,
  fadeFromIndex = snapPoints && snapPoints.length - 1,
  activeSnapPoint: activeSnapPointProp,
  setActiveSnapPoint: setActiveSnapPointProp,
  modal = true,
  onClose,
}: DialogProps) {
  const [isOpen = false, setIsOpen] = React.useState<boolean>(false);
  // Not visible = translateY(100%)
  const [visible, setVisible] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [justReleased, setJustReleased] = React.useState<boolean>(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const dragStartTime = React.useRef<Date | null>(null);
  const dragEndTime = React.useRef<Date | null>(null);
  const lastTimeDragPrevented = React.useRef<Date | null>(null);
  const isAllowedToDrag = React.useRef<boolean>(false);
  const nestedOpenChangeTimer = React.useRef<NodeJS.Timeout | null>(null);
  const pointerStartY = React.useRef(0);
  const keyboardIsOpen = React.useRef(false);
  const previousDiffFromInitial = React.useRef(0);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const drawerHeightRef = React.useRef(drawerRef.current?.getBoundingClientRect().height || 0);
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
  });

  usePreventScroll({
    isDisabled: !isOpen || isDragging || !modal || justReleased,
  });

  usePositionFixed({ isOpen, modal, nested });

  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }

  function onPress(event: React.PointerEvent<HTMLDivElement>) {
    if (!dismissible) return;
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

    pointerStartY.current = event.clientY;
  }

  function shouldDrag(el: EventTarget, isDraggingDown: boolean) {
    let element = el as HTMLElement;
    const date = new Date();
    const highlightedText = window.getSelection()?.toString();
    const swipeAmount = drawerRef.current ? getTranslateY(drawerRef.current) : null;

    if (swipeAmount > 0) {
      return true;
    }

    // Don't drag if there's highlighted text
    if (highlightedText && highlightedText.length > 0) {
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
        if (element.getAttribute('role') === 'dialog') {
          return true;
        }

        if (isDraggingDown && element !== document.body && !swipeAmount && swipeAmount >= 0) {
          lastTimeDragPrevented.current = new Date();

          // Element is scrolled to the top, but we are dragging down so we should allow scrolling
          return false;
        }

        if (element.scrollTop !== 0) {
          lastTimeDragPrevented.current = new Date();

          // The element is scrollable and not scrolled to the top, so don't drag
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

      if (!isAllowedToDrag.current && !shouldDrag(event.target, isDraggingDown)) return;

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
      if (draggedDistance > 0 && !snapPoints) {
        const dampenedDraggedDistance = dampenValue(draggedDistance);

        set(drawerRef.current, {
          transform: `translate3d(0, ${Math.min(dampenedDraggedDistance * -1, 0)}px, 0)`,
        });
        return;
      }

      // We need to capture last time when drag with scroll was triggered and have a timeout between
      const absDraggedDistance = Math.abs(draggedDistance);
      const wrapper = document.querySelector('[vaul-drawer-wrapper]');

      let percentageDragged = absDraggedDistance / drawerHeightRef.current;
      const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance, isDraggingDown);

      if (snapPointPercentageDragged !== null) {
        percentageDragged = snapPointPercentageDragged;
      }

      const opacityValue = 1 - percentageDragged;

      if (shouldFade || (fadeFromIndex && activeSnapPointIndex === fadeFromIndex - 1)) {
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
            transform: `scale(${scaleValue}) translate3d(0, ${translateYValue}px, 0)`,
            transition: 'none',
          },
          true,
        );
      }

      if (!snapPoints) {
        set(drawerRef.current, {
          transform: `translate3d(0, ${absDraggedDistance}px, 0)`,
        });
      }
    }
  }

  React.useEffect(() => {
    function onVisualViewportChange() {
      if (!drawerRef.current) return;

      const focusedElement = document.activeElement as HTMLElement;
      if (isInput(focusedElement) || keyboardIsOpen.current) {
        const visualViewportHeight = window.visualViewport?.height || 0;
        // This is the height of the keyboard
        let diffFromInitial = window.innerHeight - visualViewportHeight;
        const drawerHeight = drawerRef.current.getBoundingClientRect().height || 0;
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

          drawerRef.current.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
        } else {
          drawerRef.current.style.height = 'initial';
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

  function closeDrawer() {
    if (!dismissible || !drawerRef.current) return;

    onClose?.();
    if (drawerRef.current) {
      set(drawerRef.current, {
        transform: `translate3d(0, 100%, 0)`,
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });

      set(overlayRef.current, {
        opacity: '0',
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });

      scaleBackground(false);
    }

    setTimeout(() => {
      setIsOpen(false);
      setVisible(false);

      if (snapPoints) {
        setActiveSnapPoint(snapPoints[0]);
      }
    }, ANIMATION_DURATION);
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

  // This can be done much better
  React.useEffect(() => {
    if (openProp) {
      setIsOpen(true);
    } else {
      closeDrawer();
    }
  }, [openProp]);

  // This can be done much better
  React.useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen]);

  function resetDrawer() {
    if (!drawerRef.current) return;
    const wrapper = document.querySelector('[vaul-drawer-wrapper]');
    const currentSwipeAmount = getTranslateY(drawerRef.current);

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
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
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
    if (!isDragging || !drawerRef.current) return;
    if (isAllowedToDrag.current && isInput(event.target as HTMLElement)) {
      // If we were just dragging, prevent focusing on inputs etc. on release
      (event.target as HTMLInputElement).blur();
    }

    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = new Date();
    const swipeAmount = getTranslateY(drawerRef.current);

    if (!shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount)) return;

    if (dragStartTime.current === null) return;

    const y = event.clientY;

    const timeTaken = dragEndTime.current.getTime() - dragStartTime.current.getTime();
    const distMoved = pointerStartY.current - y;
    const velocity = Math.abs(distMoved) / timeTaken;

    if (velocity > 0.05) {
      // `justReleased` is needed to prevent the drawer from focusing on an input when the drag ends, as it's not the intent most of the time.
      setJustReleased(true);

      setTimeout(() => {
        setJustReleased(false);
      }, 200);
    }

    if (snapPoints) {
      onReleaseSnapPoints({
        draggedDistance: distMoved,
        closeDrawer,
        velocity,
      });
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

    const visibleDrawerHeight = Math.min(drawerRef.current.getBoundingClientRect().height || 0, window.innerHeight);

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

  function scaleBackground(open: boolean) {
    const wrapper = document.querySelector('[vaul-drawer-wrapper]');

    if (!wrapper || !shouldScaleBackground) return;

    if (open) {
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
        transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
        transformOrigin: 'top',
        transitionProperty: 'transform, border-radius',
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      });
    } else {
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

    if (nestedOpenChangeTimer.current) {
      window.clearTimeout(nestedOpenChangeTimer.current);
    }

    set(drawerRef.current, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      transform: `scale(${scale}) translate3d(0, ${y}px, 0)`,
    });

    if (!o && drawerRef.current) {
      nestedOpenChangeTimer.current = setTimeout(() => {
        set(drawerRef.current, {
          transition: 'none',
          transform: `translate3d(0, ${getTranslateY(drawerRef.current as HTMLElement)}px, 0)`,
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
      transform: `scale(${newScale}) translate3d(0, ${newY}px, 0)`,
      transition: 'none',
    });
  }

  function onNestedRelease(event: React.PointerEvent<HTMLDivElement>, o: boolean) {
    const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const y = o ? -NESTED_DISPLACEMENT : 0;

    if (o) {
      set(drawerRef.current, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        transform: `scale(${scale}) translate3d(0, ${y}px, 0)`,
      });
    }
  }

  return (
    <DialogPrimitive.Root
      modal={modal}
      onOpenChange={(o: boolean) => {
        if (!o) {
          closeDrawer();
        } else {
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
          onPress,
          setVisible,
          onRelease,
          onDrag,
          dismissible,
          isOpen,
          shouldFade,
          closeDrawer,
          onNestedDrag,
          onNestedOpenChange,
          onNestedRelease,
          keyboardIsOpen,
          modal,
          snapPointsOffset,
          experimentalSafariThemeAnimation,
        }}
      >
        {children}
      </DrawerContext.Provider>
    </DialogPrimitive.Root>
  );
}

const Overlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  function ({ children, style, ...rest }, ref) {
    const { overlayRef, snapPoints, onRelease, experimentalSafariThemeAnimation, shouldFade, isOpen, visible } =
      useDrawerContext();
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
        vaul-theme-transition={experimentalSafariThemeAnimation ? 'true' : 'false'}
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
    onDrag,
    dismissible,
    isOpen,
    keyboardIsOpen,
    snapPointsOffset,
    visible,
    setVisible,
    closeDrawer,
    scaleBackground,
  } = useDrawerContext();
  const composedRef = useComposedRefs(ref, drawerRef);

  React.useEffect(() => {
    // Trigger enter animation without using CSS animation
    setVisible(true);
    scaleBackground(true);
  }, []);

  return (
    <DialogPrimitive.Content
      onOpenAutoFocus={(e) => {
        if (onOpenAutoFocus) {
          onOpenAutoFocus(e);
        } else {
          e.preventDefault();
        }
      }}
      onPointerDown={onPress}
      onPointerDownOutside={(e) => {
        if (keyboardIsOpen.current) {
          keyboardIsOpen.current = false;
        }
        e.preventDefault();

        if (!dismissible) {
          return;
        }

        closeDrawer();
        onPointerDownOutside?.(e);
      }}
      onPointerMove={onDrag}
      onPointerUp={onRelease}
      ref={composedRef}
      style={
        snapPointsOffset
          ? ({
              '--snap-point-height': `${snapPointsOffset[0]}px`,
              ...style,
            } as React.CSSProperties)
          : style
      }
      {...rest}
      vaul-drawer=""
      vaul-drawer-visible={visible ? 'true' : 'false'}
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
    >
      {children}
    </Root>
  );
}

export const Drawer = {
  Root,
  NestedRoot,
  Content,
  Overlay,
  Trigger: DialogPrimitive.Trigger,
  Portal: DialogPrimitive.Portal,
  Close: DialogPrimitive.Close,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
};

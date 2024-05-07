import React from 'react';

let previousBodyPosition: Record<string, string> | null = null;

export function usePositionFixed({
  isOpen,
  modal,
  nested,
  hasBeenOpened,
  preventScrollRestoration,
  noBodyStyles,
}: {
  isOpen: boolean;
  modal: boolean;
  nested: boolean;
  hasBeenOpened: boolean;
  preventScrollRestoration: boolean;
  noBodyStyles: boolean;
}) {
  const [activeUrl, setActiveUrl] = React.useState(() => (typeof window !== 'undefined' ? window.location.href : ''));
  const scrollPos = React.useRef(0);

  const setPositionFixed = React.useCallback(() => {
    // If previousBodyPosition is already set, don't set it again.
    if (previousBodyPosition === null && isOpen && !noBodyStyles) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
        right: 'unset',
      };

      // Update the dom inside an animation frame
      const { scrollX, innerHeight } = window;

      document.body.style.setProperty('position', 'fixed', 'important');
      Object.assign(document.body.style, {
        top: `${-scrollPos.current}px`,
        left: `${-scrollX}px`,
        right: '0px',
        height: 'auto',
      });

      window.setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            // Attempt to check if the bottom bar appeared due to the position change
            const bottomBarHeight = innerHeight - window.innerHeight;
            if (bottomBarHeight && scrollPos.current >= innerHeight) {
              // Move the content further up so that the bottom bar doesn't hide it
              document.body.style.top = `${-(scrollPos.current + bottomBarHeight)}px`;
            }
          }),
        300,
      );
    }
  }, [isOpen]);

  const restorePositionSetting = React.useCallback(() => {
    if (previousBodyPosition !== null && !noBodyStyles) {
      // Convert the position from "px" to Int
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);

      // Restore styles
      Object.assign(document.body.style, previousBodyPosition);

      window.requestAnimationFrame(() => {
        if (preventScrollRestoration && activeUrl !== window.location.href) {
          setActiveUrl(window.location.href);
          return;
        }

        window.scrollTo(x, y);
      });

      previousBodyPosition = null;
    }
  }, [activeUrl]);

  React.useEffect(() => {
    function onScroll() {
      scrollPos.current = window.scrollY;
    }

    onScroll();

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  React.useEffect(() => {
    if (nested || !hasBeenOpened) return;
    // This is needed to force Safari toolbar to show **before** the drawer starts animating to prevent a gnarly shift from happening
    if (isOpen) {
      // avoid for standalone mode (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      !isStandalone && setPositionFixed();

      if (!modal) {
        window.setTimeout(() => {
          restorePositionSetting();
        }, 500);
      }
    } else {
      restorePositionSetting();
    }
  }, [isOpen, hasBeenOpened, activeUrl, modal, nested, setPositionFixed, restorePositionSetting]);

  return { restorePositionSetting };
}

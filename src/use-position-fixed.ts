import { useEffect } from 'react';
import { isIOS } from './use-prevent-scroll';

let previousBodyPosition = null;

function setPositionFixed() {
  // If previousBodyPosition is already set, don't set it again.
  if (previousBodyPosition === null) {
    previousBodyPosition = {
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
  if (previousBodyPosition !== null) {
    // Convert the position from "px" to Int
    const y = -parseInt(document.body.style.top, 10);
    const x = -parseInt(document.body.style.left, 10);

    // Restore styles
    document.body.style.position = previousBodyPosition.position;
    document.body.style.top = previousBodyPosition.top;
    document.body.style.left = previousBodyPosition.left;
    document.body.style.right = 'unset';

    // Restore scroll
    requestAnimationFrame(() => {
      window.scrollTo(x, y);
    });

    previousBodyPosition = null;
  }
}

export function usePositionFixed(isOpen: boolean) {
  useEffect(() => {
    // This is needed to force Safari toolbar to show **before** the drawer starts animating to prevent a gnarly shift from happenning
    if (isOpen && isIOS()) {
      setPositionFixed();
    } else {
      restorePositionSetting();
    }
  }, [isOpen]);
}

import React from 'react';

interface DrawerContextValue {
  drawerRef: React.RefObject<HTMLDivElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
  onAnimationStart: (event: React.AnimationEvent<HTMLDivElement>) => void;
  onPress: (event: React.PointerEvent<HTMLDivElement>) => void;
  onRelease: (event: React.PointerEvent<HTMLDivElement>) => void;
  onDrag: (event: React.PointerEvent<HTMLDivElement>) => void;
  onNestedDrag: (event: React.PointerEvent<HTMLDivElement>) => void;
  onNestedOpenChange: (o: boolean) => void;
  dismissible: boolean;
  isOpen: boolean;
  keyboardIsOpen: React.MutableRefObject<boolean>;
}

export const DrawerContext = React.createContext<DrawerContextValue | undefined>(undefined);

export const useDrawerContext = () => React.useContext(DrawerContext);

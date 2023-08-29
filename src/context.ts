import React from 'react';

interface DrawerContextValue {
  drawerRef: React.RefObject<HTMLDivElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
  onAnimationStart: (event: React.AnimationEvent<HTMLDivElement>) => void;
  onPress: (event: React.PointerEvent<HTMLDivElement>) => void;
  onRelease: (event: React.PointerEvent<HTMLDivElement>) => void;
  onDrag: (event: React.PointerEvent<HTMLDivElement>) => void;
  onNestedDrag: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void;
  onNestedOpenChange: (o: boolean) => void;
  onNestedRelease: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void;
  dismissible: boolean;
  isOpen: boolean;
  setIsAnimating: (o: boolean) => void;
  keyboardIsOpen: React.MutableRefObject<boolean>;
  experimentalSafariThemeAnimation: boolean;
  snapPointsOffset: number[] | null;
  snapPoints: (number | string)[] | null;
  modal: boolean;
  shouldFade: boolean;
  activeSnapPoint: number | string | null;
  setActiveSnapPoint: (o: number | string | null) => void;
}

export const DrawerContext = React.createContext<DrawerContextValue | undefined>(undefined);

export const useDrawerContext = () => React.useContext(DrawerContext);

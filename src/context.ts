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
  experimentalSafariThemeAnimation?: boolean;
  snapPointsOffset: number[] | null;
  snapPoints?: (number | string)[] | null;
  modal: boolean;
  shouldFade: boolean;
  activeSnapPoint?: number | string | null;
  setActiveSnapPoint: (o: number | string | null) => void;
  visible: boolean;
  setVisible: (o: boolean) => void;
}

export const DrawerContext = React.createContext<DrawerContextValue>({
  drawerRef: { current: null },
  overlayRef: { current: null },
  onAnimationStart: () => {},
  onPress: () => {},
  onRelease: () => {},
  onDrag: () => {},
  onNestedDrag: () => {},
  onNestedOpenChange: () => {},
  onNestedRelease: () => {},
  dismissible: false,
  isOpen: false,
  setIsAnimating: () => {},
  keyboardIsOpen: { current: false },
  experimentalSafariThemeAnimation: false,
  snapPointsOffset: null,
  snapPoints: null,
  modal: false,
  shouldFade: false,
  activeSnapPoint: null,
  setActiveSnapPoint: () => {},
  visible: false,
  setVisible: () => {},
});

export const useDrawerContext = () => React.useContext(DrawerContext);

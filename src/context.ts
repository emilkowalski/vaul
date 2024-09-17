import React from 'react';
import { DrawerDirection } from './types';

interface DrawerContextValue {
  drawerRef: React.RefObject<HTMLDivElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
  onPress: (event: React.PointerEvent<HTMLDivElement>) => void;
  onRelease: (event: React.PointerEvent<HTMLDivElement>) => void;
  onDrag: (event: React.PointerEvent<HTMLDivElement>) => void;
  onNestedDrag: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void;
  onNestedOpenChange: (o: boolean) => void;
  onNestedRelease: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void;
  dismissible: boolean;
  isOpen: boolean;
  isDragging: boolean;
  keyboardIsOpen: React.MutableRefObject<boolean>;
  snapPointsOffset: number[] | null;
  snapPoints?: (number | string)[] | null;
  modal: boolean;
  shouldFade: boolean;
  activeSnapPoint?: number | string | null;
  setActiveSnapPoint: (o: number | string | null) => void;
  closeDrawer: () => void;
  openProp?: boolean;
  onOpenChange?: (o: boolean) => void;
  direction?: DrawerDirection;
  shouldScaleBackground: boolean;
  setBackgroundColorOnScale: boolean;
  noBodyStyles: boolean;
  handleOnly?: boolean;
  container?: HTMLElement | null;
}

export const DrawerContext = React.createContext<DrawerContextValue>({
  drawerRef: { current: null },
  overlayRef: { current: null },
  onPress: () => {},
  onRelease: () => {},
  onDrag: () => {},
  onNestedDrag: () => {},
  onNestedOpenChange: () => {},
  onNestedRelease: () => {},
  openProp: undefined,
  dismissible: false,
  isOpen: false,
  isDragging: false,
  keyboardIsOpen: { current: false },
  snapPointsOffset: null,
  snapPoints: null,
  handleOnly: false,
  modal: false,
  shouldFade: false,
  activeSnapPoint: null,
  onOpenChange: () => {},
  setActiveSnapPoint: () => {},
  closeDrawer: () => {},
  direction: 'bottom',
  shouldScaleBackground: false,
  setBackgroundColorOnScale: true,
  noBodyStyles: false,
  container: null,
});

export const useDrawerContext = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawerContext must be used within a Drawer.Root');
  }
  return context;
};

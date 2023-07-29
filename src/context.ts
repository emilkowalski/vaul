import React from 'react';
import { SnapPoint } from './types';

interface DrawerContextValue {
  drawerRef: React.RefObject<HTMLDivElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
  onAnimationStart: (event: React.AnimationEvent<HTMLDivElement>) => void;
  onPress: (event: React.PointerEvent<HTMLDivElement>) => void;
  onRelease: (event: React.PointerEvent<HTMLDivElement>) => void;
  onMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  dismissible: boolean;
  snapPoints: number[];
  isOpen: boolean;
  isDragging: boolean;
  activeSnapPoint: SnapPoint;
}

export const DrawerContext = React.createContext<DrawerContextValue>({
  drawerRef: React.createRef(),
  overlayRef: React.createRef(),
  onAnimationStart: () => {},
  onPress: () => {},
  onRelease: () => {},
  onMove: () => {},
  dismissible: true,
  snapPoints: [],
  isOpen: false,
  isDragging: false,
  activeSnapPoint: undefined,
});

export const useDrawerContext = () => React.useContext(DrawerContext);

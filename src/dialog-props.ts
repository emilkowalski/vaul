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
  closeThreshold?: number;
  noBodyStyles?: boolean;
  onOpenChange?: (open: boolean) => void;
  shouldScaleBackground?: boolean;
  setBackgroundColorOnScale?: boolean;
  scrollLockTimeout?: number;
  fixed?: boolean;
  dismissible?: boolean;
  dragHandleOnly?: boolean;
  cycleSnapPointsOnHandleClick?: boolean;
  handleHandleClicked?: () => void
  fastDragSkipsToEnd?: boolean, // :aa
  onDrag?: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void;
  onRelease?: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void;
  modal?: boolean;
  nested?: boolean;
    /** 
     * :aa
     * 
     * If supplied, will be called when any gesture / event would
     * normally close the drawer.  If the default close behavior is also desired, 
     * this function should return false.
    */
  handleCloseGesture?: () => boolean;
  onClose?: () => void;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  preventScrollRestoration?: boolean;
  disablePreventScroll?: boolean;
} & (WithFadeFromProps | WithoutFadeFromProps);

export { type DialogProps as default }


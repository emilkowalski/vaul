import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

interface WithFadeFromProps {
    /**
     * Array of numbers from 0 to 100 that corresponds to % of the screen a given snap point should take up.
     * Should go from least visible. Example `[0.2, 0.5, 0.8]`.
     * You can also use px values, which doesn't take screen height into account.
     */
    snapPoints: (number | string)[];
    /**
     * Index of a `snapPoint` from which the overlay fade should be applied. Defaults to the last snap point.
     */
    fadeFromIndex: number;
}
interface WithoutFadeFromProps {
    /**
     * Array of numbers from 0 to 100 that corresponds to % of the screen a given snap point should take up.
     * Should go from least visible. Example `[0.2, 0.5, 0.8]`.
     * You can also use px values, which doesn't take screen height into account.
     */
    snapPoints?: (number | string)[];
    fadeFromIndex?: never;
}
type DialogProps = {
    activeSnapPoint?: number | string | null;
    setActiveSnapPoint?: (snapPoint: number | string | null) => void;
    children?: React.ReactNode;
    open?: boolean;
    /**
     * Number between 0 and 1 that determines when the drawer should be closed.
     * Example: threshold of 0.5 would close the drawer if the user swiped for 50% of the height of the drawer or more.
     * @default 0.25
     */
    closeThreshold?: number;
    /**
     * When `true` the `body` doesn't get any styles assigned from Vaul
     */
    noBodyStyles?: boolean;
    onOpenChange?: (open: boolean) => void;
    shouldScaleBackground?: boolean;
    /**
     * When `false` we don't change body's background color when the drawer is open.
     * @default true
     */
    setBackgroundColorOnScale?: boolean;
    /**
     * Duration for which the drawer is not draggable after scrolling content inside of the drawer.
     * @default 500ms
     */
    scrollLockTimeout?: number;
    /**
     * When `true`, don't move the drawer upwards if there's space, but rather only change it's height so it's fully scrollable when the keyboard is open
     */
    fixed?: boolean;
    /**
     * When `true` only allows the drawer to be dragged by the `<Drawer.Handle />` component.
     * @default false
     */
    handleOnly?: boolean;
    /**
     * When `false` dragging, clicking outside, pressing esc, etc. will not close the drawer.
     * Use this in comination with the `open` prop, otherwise you won't be able to open/close the drawer.
     * @default true
     */
    dismissible?: boolean;
    onDrag?: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void;
    onRelease?: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void;
    /**
     * When `false` it allows to interact with elements outside of the drawer without closing it.
     * @default true
     */
    modal?: boolean;
    nested?: boolean;
    onClose?: () => void;
    /**
     * Direction of the drawer. Can be `top` or `bottom`, `left`, `right`.
     * @default 'bottom'
     */
    direction?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * Opened by default, skips initial enter animation. Still reacts to `open` state changes
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * When set to `true` prevents scrolling on the document body on mount, and restores it on unmount.
     * @default false
     */
    disablePreventScroll?: boolean;
    /**
     * When `true` Vaul will reposition inputs rather than scroll then into view if the keyboard is in the way.
     * Setting it to `false` will fall back to the default browser behavior.
     * @default true when {@link snapPoints} is defined
     */
    repositionInputs?: boolean;
    /**
     * Disabled velocity based swiping for snap points.
     * This means that a snap point won't be skipped even if the velocity is high enough.
     * Useful if each snap point in a drawer is equally important.
     * @default false
     */
    snapToSequentialPoint?: boolean;
    container?: HTMLElement | null;
    /**
     * Gets triggered after the open or close animation ends, it receives an `open` argument with the `open` state of the drawer by the time the function was triggered.
     * Useful to revert any state changes for example.
     */
    onAnimationEnd?: (open: boolean) => void;
    preventScrollRestoration?: boolean;
    autoFocus?: boolean;
} & (WithFadeFromProps | WithoutFadeFromProps);
declare function Root({ open: openProp, onOpenChange, children, onDrag: onDragProp, onRelease: onReleaseProp, snapPoints, shouldScaleBackground, setBackgroundColorOnScale, closeThreshold, scrollLockTimeout, dismissible, handleOnly, fadeFromIndex, activeSnapPoint: activeSnapPointProp, setActiveSnapPoint: setActiveSnapPointProp, fixed, modal, onClose, nested, noBodyStyles, direction, defaultOpen, disablePreventScroll, snapToSequentialPoint, preventScrollRestoration, repositionInputs, onAnimationEnd, container, autoFocus, }: DialogProps): React.JSX.Element;
declare const Overlay: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
type ContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;
declare const Content: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
type HandleProps = React.ComponentPropsWithoutRef<'div'> & {
    preventCycle?: boolean;
};
declare const Handle: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
    preventCycle?: boolean | undefined;
} & React.RefAttributes<HTMLDivElement>>;
declare function NestedRoot({ onDrag, onOpenChange, open: nestedIsOpen, ...rest }: DialogProps): React.JSX.Element;
type PortalProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>;
declare function Portal(props: PortalProps): React.JSX.Element;
declare const Drawer: {
    Root: typeof Root;
    NestedRoot: typeof NestedRoot;
    Content: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Overlay: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Trigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
    Portal: typeof Portal;
    Handle: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
        preventCycle?: boolean | undefined;
    } & React.RefAttributes<HTMLDivElement>>;
    Close: React.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React.RefAttributes<HTMLButtonElement>>;
    Title: React.ForwardRefExoticComponent<DialogPrimitive.DialogTitleProps & React.RefAttributes<HTMLHeadingElement>>;
    Description: React.ForwardRefExoticComponent<DialogPrimitive.DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
};

export { Content, type ContentProps, type DialogProps, Drawer, Handle, type HandleProps, NestedRoot, Overlay, Portal, Root, type WithFadeFromProps, type WithoutFadeFromProps };

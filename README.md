https://github.com/emilkowalski/vaul/assets/36730035/fdf8c5e8-ade8-433b-8bb0-4ce10e722516

Vaul is an unstyled drawer component for React that can be used as a Dialog replacement on tablet and mobile devices. You can read about why and how it was built [here](https://emilkowal.ski/ui/building-a-drawer-component).

## Usage

To start using the library, install it in your project:,

```bash
npm install vaul
```

Use the drawer in your app.

```jsx
import { Drawer } from 'vaul';

function MyComponent() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>Open</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content>
          <Drawer.Handle />
          <p>Content</p>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

## Examples

Play around with the examples on codesandbox:

- [With scaled background](https://codesandbox.io/p/sandbox/drawer-with-scale-g24vvh?file=%2Fapp%2Fmy-drawer.tsx%3A1%2C1)
- [Without scaled background](https://codesandbox.io/p/sandbox/drawer-with-scale-forked-nx2glp?file=%2Fapp%2Fmy-drawer.tsx%3A4%2C1)
- [With snap points](https://codesandbox.io/p/sandbox/drawer-non-dismissable-forked-jchtff?file=/app/my-drawer.tsx:1,1)
- [Scrollable with inputs](https://codesandbox.io/p/sandbox/drawer-with-scale-forked-73f8jw?file=%2Fapp%2Fmy-drawer.tsx%3A1%2C1)
- [Drawer from right instead of bottom](https://codesandbox.io/p/devbox/drawer-direction-right-n338ml?file=%2Fapp%2Fmy-drawer.tsx%3A47%2C2)
- [Nested drawers](https://codesandbox.io/p/sandbox/drawer-non-dismissable-forked-5z2r3j?file=%2Fapp%2Fmy-drawer.tsx%3A49%2C16-49%2C246)
- [Non-dismissible](https://codesandbox.io/p/sandbox/drawer-without-scale-forked-kxh9j5?file=%2Fapp%2Fmy-drawer.tsx%3A1%2C1)
- [Non-draggable element](https://codesandbox.io/p/devbox/drawer-with-scale-forked-hwtfws?file=%2Fapp%2Fmy-drawer.tsx%3A42%2C37)

## API Reference

### Root

Contains all parts of a dialog. Use `shouldScaleBackground` to enable background scaling, it requires an element with `[vaul-drawer-wrapper]` data attribute to scale its background.
Can be controlled with the `value` and `onOpenChange` props. Can be opened by default via the `open` prop.

Additional props:

`closeThreshold`: Number between 0 and 1 that determines when the drawer should be closed. Example: threshold of 0.5 would close the drawer if the user swiped for 50% of the height of the drawer or more.

`scrollLockTimeout`: Duration for which the drawer is not draggable after scrolling content inside of the drawer. Defaults to 500ms.

`snapPoints`: Array of numbers from 0 to 100 that corresponds to % of the screen a given snap point should take up. Should go from least visible. Example `[0.2, 0.5, 0.8]`. You can also use px values, which doesn't take screen height into account.

`fadeFromIndex`: Index of a `snapPoint` from which the overlay fade should be applied. Defaults to the last snap point.

`modal`: When `false` it allows to interact with elements outside of the drawer without closing it. Defaults to `true`.

`handleOnly`: When `true` only allows the drawer to be dragged by the `<Drawer.Handle />` component. Defaults to `false`.

`direction`: Direction of the drawer. Can be `top` or `bottom`, `left`, `right`. Defaults to `bottom`.

`preventScrollRestoration`: When `true` it prevents scroll restoration when the drawer is closed after a navigation happens inside of it. Defaults to `true`.

`disablePreventScroll`: When `true` scroll prevention mechanism will be disabled. Scroll prevention ensures that page will not scroll on mobile when opening drawer. However this mechanism gets confused when drawer has an input with autofocus and therefore opens simulataneosly with touch keyboard. Defaults to `true`. `modal` set to `false` also disables it.

`noBodyStyles`: When `true` the `body` doesn't get any styles assigned from Vaul.

`setBackgroundColorOnScale`: When `false` we don't change body's background color when the drawer is open. `true` by default.

`[data-vaul-no-drag]`: When interacting with an element with this data attribute, the drawer won't be dragged.

### Trigger

The button that opens the dialog. [Props](https://www.radix-ui.com/docs/primitives/components/dialog#trigger).

### Content

Content that should be rendered in the drawer. [Props](https://www.radix-ui.com/docs/primitives/components/dialog#content).

### Overlay

A layer that covers the inert portion of the view when the dialog is open. [Props](https://www.radix-ui.com/docs/primitives/components/dialog#overlay).

### Title

An accessible title to be announced when the dialog is opened. [Props](https://www.radix-ui.com/docs/primitives/components/dialog#title).

### Description

An optional accessible description to be announced when the dialog is opened. [Props](https://www.radix-ui.com/docs/primitives/components/dialog#description).

### Close

The button that closes the dialog. [Props](https://www.radix-ui.com/docs/primitives/components/dialog#close).

### Handle

A drag hint (also known as grabber). Shows people that they can drag the drawer to resize it; they can also tap it to cycle through the snap points, and double tap quickly to close the drawer. Set `preventCycle={true}` to stop this behavior. If you want to change the handle's hit area you can do so by styling the `[vaul-handle-hitarea]` selector (Defaults to 44x44 on mobile devices).

### Portal

Portals your drawer into the body.

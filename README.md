## To contact Emil for support -

- X: https://x.com/emilkowalski_
- Slack: @Emil Kowalski at https://join.slack.com/t/linearcustomers/shared_invite/zt-m578rgpw-bpI9xlI5uYHXeh3R6hK_YA
- BSky: https://bsky.app/profile/emilkowal.ski
- Email: e@emilkowal.ski


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
          <Drawer.Title>Title</Drawer.Title>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

## Documentation

Find the full API reference and examples in the [documentation](https://vaul.emilkowal.ski/getting-started).

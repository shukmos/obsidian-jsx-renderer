# JSX Renderer for Obsidian

Render JSX artifacts from Claude and other LLMs as interactive React components directly inside Obsidian.

## Features

- **Markdown code blocks** — Fenced ` ```jsx ` blocks are rendered as live React components.
- **`.jsx` file view** — Open `.jsx` files in Obsidian to see the rendered output.
- **Source / render toggle** — Switch between source code and rendered output with one click.
- **Settings** — Configure default view, error detail visibility, and auto-render behavior.
- **Mobile support** — Works on iOS, iPadOS, and Android.

## Installation

### Via BRAT (recommended for beta testing)

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) from Obsidian Community Plugins.
2. Open BRAT settings → **Add Beta Plugin**.
3. Enter `shukmos/obsidian-jsx-renderer`.
4. Enable the plugin in Settings → Community Plugins.

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/shukmos/obsidian-jsx-renderer/releases).
2. Create `.obsidian/plugins/jsx-renderer/` in your vault.
3. Place the downloaded files in that folder.
4. Enable the plugin in Settings → Community Plugins.

## Usage

### Code blocks

Write a fenced code block with the `jsx` language tag:

````markdown
```jsx
export default function Hello() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}
```
````

The code block will be replaced with the rendered component. Click **"Show source"** to view the original code.

### `.jsx` files

Create a `.jsx` file anywhere in your vault. The file must have a default export:

```jsx
export default function App() {
  return <div>Hello from JSX!</div>;
}
```

Open the file in Obsidian to see the rendered result.

### Requirements for JSX code

- Must use `export default function ComponentName()` syntax.
- React Hooks are supported (`useState`, `useEffect`, etc.).
- Only React is available as a dependency — no external imports.
- Inline styles are recommended for styling.

## Settings

| Setting | Default | Description |
|---|---|---|
| Default to source view | Off | Show source code instead of rendered output on open. |
| Show error details | On | Display detailed error messages when rendering fails. |
| Auto render JSX files | On | Automatically render `.jsx` files on open. When off, use the render button. |

## Security

This plugin uses **runtime code evaluation** (`new Function()`) to execute JSX code as React components. This is inherent to the plugin's purpose — rendering arbitrary JSX.

- Only open JSX files and code blocks that you trust.
- The plugin does **not** make any network requests.
- The plugin does **not** access files outside the rendered JSX scope.
- Code runs in the same context as Obsidian itself (no sandbox).

## License

[MIT](LICENSE)

# Scrollable Box

A container that scrolls its content when it overflows. Extends [Box](box.md) with scrollbar support, mouse wheel scrolling, and keyboard navigation.

## Creating a Scrollable Box

```javascript
let tmpScrollBox = blessed.scrollablebox({
    parent: pScreen,
    top: 2,
    left: 0,
    width: '100%',
    bottom: 1,
    scrollable: true,
    keys: true,
    vi: true,
    mouse: true,
    scrollbar: {
        ch: ' ',
        style: { bg: 'blue' },
    },
    border: { type: 'line' },
    label: ' Content ',
    tags: true,
    style: {
        border: { fg: 'cyan' },
    },
});
terminalUI.registerWidget('#ScrollContent', tmpScrollBox);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scrollable` | Boolean | `true` | Enable scrolling |
| `scrollbar` | Object | | Scrollbar configuration |
| `scrollbar.ch` | String | | Character for the scrollbar thumb |
| `scrollbar.style` | Object | | Scrollbar style (bg, fg) |
| `alwaysScroll` | Boolean | `false` | Always show scrollbar |
| `baseLimit` | Number | | Maximum children to render |
| `keys` | Boolean | `false` | Enable keyboard scrolling |
| `vi` | Boolean | `false` | Vi-style keys |
| `mouse` | Boolean | `false` | Enable mouse wheel scrolling |

Plus all [Box](box.md) options.

## Methods

| Method | Description |
|--------|-------------|
| `scroll(offset)` | Scroll by a relative offset (positive = down) |
| `scrollTo(index)` | Scroll to a child index position |
| `setScrollPerc(percent)` | Set scroll position by percentage (0-100) |
| `getScrollPerc()` | Get current scroll percentage |

Inherits all [Box](box.md) methods.

## Events

| Event | Description |
|-------|-------------|
| `scroll` | Content was scrolled |
| `wheelup` | Mouse wheel scrolled up |
| `wheeldown` | Mouse wheel scrolled down |

## Keyboard

| Key | Action |
|-----|--------|
| Up / k | Scroll up one line |
| Down / j | Scroll down one line |
| Page Up | Scroll up one page |
| Page Down | Scroll down one page |

## Usage with Pict

Scrollable Box is the ideal widget for rendering long Pict view content. Register it as the content destination and views can render as much text as needed.

```javascript
let tmpScroll = blessed.scrollablebox({
    parent: pScreen,
    top: 3, left: 0, width: '100%', bottom: 1,
    scrollable: true, keys: true, mouse: true,
    scrollbar: { style: { bg: 'green' } },
    border: { type: 'line' },
    tags: true,
    padding: { left: 1, right: 1 },
});
terminalUI.registerWidget('#Article', tmpScroll);
```

## Pict View Template

Render long-form content into the scrollable container.

```javascript
Templates: [{
    Hash: 'Article-Template',
    Template: [
        '{bold}{~D:Record.Title~}{/bold}',
        '{gray-fg}By {~D:Record.Author~}{/gray-fg}',
        '',
        '{~D:Record.Body~}',
        '',
        '{underline}Tags{/underline}',
        '{~D:Record.Tags~}',
    ].join('\n')
}],
Renderables: [{
    RenderableHash: 'Article-Content',
    TemplateHash: 'Article-Template',
    ContentDestinationAddress: '#Article',
    RenderMethod: 'replace'
}]
```

## Scrollbar Styles

```javascript
// Minimal scrollbar
scrollbar: {
    ch: ' ',
    style: { bg: 'gray' },
}

// Block character scrollbar
scrollbar: {
    ch: '\u2588',
    style: { fg: 'blue' },
}

// Track and thumb
scrollbar: {
    ch: ' ',
    track: { ch: '\u2502', style: { fg: 'gray' } },
    style: { bg: 'white' },
}
```

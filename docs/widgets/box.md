# Box

The fundamental blessed container widget. Most other widgets extend Box. It displays content, supports borders, padding, alignment, and tagged formatting strings.

## Creating a Box

```javascript
let tmpBox = blessed.box({
    parent: pScreen,
    top: 0,
    left: 0,
    width: '100%',
    height: '50%',
    content: 'Hello',
    tags: true,
    border: { type: 'line' },
    label: ' My Box ',
    padding: { left: 1, right: 1 },
    style: {
        fg: 'white',
        bg: 'black',
        border: { fg: 'cyan' },
        label: { fg: 'cyan', bold: true },
    },
});
terminalUI.registerWidget('#MyBox', tmpBox);
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `parent` | Element | Parent widget (usually the screen) |
| `top` | Number/String | Top position (`0`, `'50%'`, `'center'`) |
| `left` | Number/String | Left position |
| `right` | Number/String | Right position |
| `bottom` | Number/String | Bottom position |
| `width` | Number/String | Width (`20`, `'100%'`, `'half'`) |
| `height` | Number/String | Height |
| `content` | String | Initial text content |
| `tags` | Boolean | Enable blessed format tags in content |
| `border` | Object/Boolean | Border style (`{ type: 'line' }` or `true`) |
| `label` | String | Text label in the border |
| `padding` | Number/Object | Content padding (`1` or `{ left: 1, right: 1, top: 0, bottom: 0 }`) |
| `align` | String | Horizontal alignment: `'left'`, `'center'`, `'right'` |
| `valign` | String | Vertical alignment: `'top'`, `'middle'`, `'bottom'` |
| `shadow` | Boolean | Drop shadow effect |
| `hidden` | Boolean | Start hidden |
| `scrollable` | Boolean | Allow content scrolling |
| `mouse` | Boolean | Enable mouse interaction |
| `keys` | Boolean | Enable keyboard interaction |
| `style` | Object | Foreground, background, and sub-element styles |

## Methods

| Method | Description |
|--------|-------------|
| `setContent(text)` | Set the box content (used by ContentAssignment) |
| `getContent()` | Get the current content string |
| `setText(text)` | Set content, stripping ANSI codes |
| `getText()` | Get content without ANSI codes |
| `hide()` | Hide the box |
| `show()` | Show the box |
| `toggle()` | Toggle visibility |
| `focus()` | Give keyboard focus to this box |
| `setLabel(text)` | Change the border label |
| `destroy()` | Remove from parent |

## Events

| Event | Description |
|-------|-------------|
| `focus` | Box received focus |
| `blur` | Box lost focus |
| `click` | Mouse click on box (requires `mouse: true`) |
| `keypress` | Key pressed while focused (requires `keys: true`) |

## Pict View Template

```javascript
Templates: [{
    Hash: 'Info-Box-Template',
    Template: [
        '{bold}System Info{/bold}',
        '',
        '{yellow-fg}Host:{/yellow-fg}  {~D:Record.Hostname~}',
        '{yellow-fg}OS:{/yellow-fg}    {~D:Record.Platform~}',
        '{yellow-fg}Arch:{/yellow-fg}  {~D:Record.Architecture~}',
    ].join('\n')
}]
```

## Style Object

The `style` option supports nested properties:

```javascript
style: {
    fg: 'white',
    bg: 'blue',
    bold: true,
    border: {
        fg: 'cyan',
    },
    label: {
        fg: 'white',
        bold: true,
    },
    focus: {
        border: { fg: 'yellow' },
    },
    hover: {
        bg: 'green',
    },
}
```

# Text

A simple text display element that shrinks to fit its content. Unlike Box, Text automatically sets `shrink: true` so it only takes as much space as the content requires.

## Creating a Text Widget

```javascript
let tmpText = blessed.text({
    parent: pScreen,
    top: 5,
    left: 2,
    content: 'Status: Ready',
    tags: true,
    style: {
        fg: 'green',
    },
});
terminalUI.registerWidget('#StatusText', tmpText);
```

## Options

Inherits all options from [Box](box.md) with one difference:

| Option | Default | Description |
|--------|---------|-------------|
| `shrink` | `true` | Automatically sizes to fit content |

All other Box options (positioning, style, tags, border, etc.) work the same way.

## Methods

Same as [Box](box.md): `setContent()`, `getContent()`, `setText()`, `getText()`, `hide()`, `show()`, `toggle()`, `focus()`.

## When to Use Text vs Box

Use **Text** when you want the widget to automatically size itself to the content. Use **Box** when you want to define explicit dimensions.

```javascript
// Text -- shrinks to fit
let tmpLabel = blessed.text({
    parent: pScreen,
    top: 0,
    left: 0,
    content: 'Hello',
    tags: true,
});

// Box -- fixed size
let tmpPanel = blessed.box({
    parent: pScreen,
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: 'Hello',
    tags: true,
});
```

## Pict View Template

```javascript
Templates: [{
    Hash: 'Label-Template',
    Template: '{bold}{~D:Record.Label~}:{/bold} {~D:Record.Value~}'
}],
Renderables: [{
    RenderableHash: 'Label-Renderable',
    TemplateHash: 'Label-Template',
    ContentDestinationAddress: '#StatusText',
    RenderMethod: 'replace'
}]
```

# Message

A temporary notification dialog that auto-hides after a set duration. Useful for flash messages, success confirmations, and non-blocking alerts.

## Creating a Message Dialog

```javascript
let tmpMessage = blessed.message({
    parent: pScreen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: 5,
    border: { type: 'line' },
    tags: true,
    hidden: true,
    style: {
        fg: 'white',
        bg: 'black',
        border: { fg: 'green' },
    },
});
terminalUI.registerWidget('#Notification', tmpMessage);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ignoreKeys` | Array | | Key names to ignore (won't dismiss the message) |

Plus all [Box](box.md) options. Typically created with `hidden: true`.

## Methods

| Method | Description |
|--------|-------------|
| `display(text, time, callback)` | Show a message for `time` seconds |
| `log(text, time, callback)` | Alias for `display()` |
| `error(text, time, callback)` | Show an error message (prefixed in red) |

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | String | | Message content |
| `time` | Number | `3` | Seconds to display (0 or Infinity = manual dismiss) |
| `callback` | Function | | Called after the message is hidden |

## Dismissal

- Auto-hides after `time` seconds (if > 0)
- Any keypress dismisses immediately
- Mouse click dismisses (if `mouse: true`)

## Usage

```javascript
// Success message (3 seconds)
tmpMessage.display('Item saved successfully!', 3, () =>
{
    pScreen.render();
});

// Error message (stays until keypress)
tmpMessage.error('Connection failed.', 0, () =>
{
    pScreen.render();
});
```

## Usage with Pict

```javascript
function showNotification(pText, pDuration)
{
    tmpMessage.display(pText, pDuration || 3, () =>
    {
        pScreen.render();
    });
}

// Use in a save handler
pScreen.key(['C-s'], () =>
{
    _Pict.AppData.Status.Message = 'Saving...';
    _Pict.views['StatusBar'].render();

    // Simulate save
    setTimeout(() =>
    {
        _Pict.AppData.Status.Message = 'Ready';
        _Pict.views['StatusBar'].render();
        showNotification('{green-fg}Saved!{/green-fg}', 2);
    }, 500);
});
```

## Pict View Template

The message widget manages its own display. Use Pict templates for surrounding context.

```javascript
Templates: [{
    Hash: 'Status-Template',
    Template: ' {~D:Record.Message~}'
}],
Renderables: [{
    RenderableHash: 'Status',
    TemplateHash: 'Status-Template',
    ContentDestinationAddress: '#StatusBar',
    RenderMethod: 'replace'
}]
```

# Log

An append-only scrollable text output widget. New lines are added at the bottom and the view auto-scrolls to show the latest entry. Useful for activity logs, console output, and event streams.

## Creating a Log

```javascript
let tmpLog = blessed.log({
    parent: pScreen,
    top: '50%',
    left: 0,
    width: '100%',
    bottom: 2,
    label: ' Activity Log ',
    border: { type: 'line' },
    tags: true,
    scrollable: true,
    scrollOnInput: true,
    mouse: true,
    scrollbar: {
        style: { bg: 'green' },
    },
    style: {
        border: { fg: 'green' },
        label: { fg: 'green', bold: true },
    },
});
terminalUI.registerWidget('#ActivityLog', tmpLog);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scrollback` | Number | `Infinity` | Maximum number of lines to keep |
| `scrollOnInput` | Boolean | `false` | Auto-scroll to bottom when new content added |

Plus all [Box](box.md) options (border, style, tags, scrollable, mouse, etc.).

## Methods

| Method | Description |
|--------|-------------|
| `log(text, ...)` | Append a formatted line (supports `util.format` style) |
| `add(text, ...)` | Alias for `log()` |
| `pushLine(text)` | Append a single line |

Inherits Box methods: `setContent()`, `getContent()`, `hide()`, `show()`, etc.

## Usage with Pict

The Log widget is one of the most natural fits for Pict's content assignment. Register it and append lines from view lifecycle hooks.

```javascript
let tmpLog = blessed.log({
    parent: pScreen,
    top: '50%', left: 0, width: '100%', bottom: 1,
    label: ' Log ', border: { type: 'line' },
    tags: true, scrollOnInput: true, mouse: true,
    scrollbar: { style: { bg: 'blue' } },
    style: { border: { fg: 'blue' } },
});
terminalUI.registerWidget('#EventLog', tmpLog);

// Log events directly
tmpLog.log('{green-fg}[INFO]{/green-fg} Application started');
tmpLog.log('{yellow-fg}[WARN]{/yellow-fg} Config file not found, using defaults');
tmpLog.log('{red-fg}[ERROR]{/red-fg} Connection refused');
pScreen.render();
```

## Pict View Template

You can use ContentAssignment append mode to add log lines from a view.

```javascript
Templates: [{
    Hash: 'Log-Entry-Template',
    Template: '{cyan-fg}[{~D:Record.Timestamp~}]{/cyan-fg} {~D:Record.Message~}'
}],
Renderables: [{
    RenderableHash: 'Log-Entry',
    TemplateHash: 'Log-Entry-Template',
    ContentDestinationAddress: '#EventLog',
    RenderMethod: 'append'
}]
```

Using `RenderMethod: 'append'` adds each rendered template as a new entry instead of replacing the log contents.

## Scrollback Limit

For long-running applications, set `scrollback` to prevent unbounded memory growth.

```javascript
let tmpLog = blessed.log({
    parent: pScreen,
    scrollback: 500,
    scrollOnInput: true,
    ...
});
```

When the limit is reached, the oldest lines are removed as new ones are added.

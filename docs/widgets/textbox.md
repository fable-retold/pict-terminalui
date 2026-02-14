# Textbox

A single-line text input field. The user types text and presses Enter to submit or Escape to cancel.

## Creating a Textbox

```javascript
let tmpTextbox = blessed.textbox({
    parent: pScreen,
    top: 5,
    left: 2,
    width: 30,
    height: 1,
    inputOnFocus: true,
    border: { type: 'line' },
    style: {
        fg: 'white',
        bg: 'black',
        focus: { border: { fg: 'yellow' } },
    },
});
terminalUI.registerWidget('#NameInput', tmpTextbox);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputOnFocus` | Boolean | `false` | Automatically enter input mode when focused |
| `secret` | Boolean | `false` | Hide all typed characters |
| `censor` | Boolean | `false` | Replace typed characters with asterisks |

Plus all [Box](box.md) options (positioning, border, style, etc.).

## Methods

| Method | Description |
|--------|-------------|
| `setValue(value)` | Set the input value programmatically |
| `getValue()` | Get the current input value |
| `clearValue()` | Clear the input |
| `readInput(callback)` | Enter input mode; `callback(err, value)` on submit/cancel |
| `submit()` | Programmatically trigger a submit |
| `cancel()` | Programmatically trigger a cancel |
| `focus()` | Focus the textbox |

## Events

| Event | Callback | Description |
|-------|----------|-------------|
| `submit` | `(value)` | User pressed Enter |
| `cancel` | | User pressed Escape |
| `action` | `(value)` | Either submit or cancel occurred |

## Usage with Pict

Register the textbox as a widget, then use `marshalFromView` to read the value into AppData.

```javascript
// In your application setup
let tmpNameInput = blessed.textbox({
    parent: pScreen,
    top: 3, left: 15, width: 30, height: 3,
    inputOnFocus: true,
    border: { type: 'line' },
});
terminalUI.registerWidget('#NameInput', tmpNameInput);

// Handle submit
tmpNameInput.on('submit', (pValue) =>
{
    _Pict.AppData.Form.Name = pValue;
    _Pict.views['FormResult'].render();
});
```

## Pict View Template

Display a label next to the input. The textbox widget handles its own input; the template renders the label.

```javascript
Templates: [{
    Hash: 'Name-Field-Label',
    Template: '{bold}Name:{/bold}'
}],
Renderables: [{
    RenderableHash: 'Name-Label',
    TemplateHash: 'Name-Field-Label',
    ContentDestinationAddress: '#NameLabel',
    RenderMethod: 'replace'
}]
```

## Password Input

Use `secret` or `censor` for password fields.

```javascript
let tmpPasswordInput = blessed.textbox({
    parent: pScreen,
    top: 5, left: 15, width: 30, height: 3,
    inputOnFocus: true,
    censor: true,
    border: { type: 'line' },
});
```

With `censor: true`, typed characters display as `*`. With `secret: true`, nothing is displayed at all.

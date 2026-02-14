# Textarea

A multi-line text input with cursor navigation and scrolling. Users can type freely across multiple lines.

## Creating a Textarea

```javascript
let tmpTextarea = blessed.textarea({
    parent: pScreen,
    top: 2,
    left: 0,
    width: '100%',
    height: 10,
    inputOnFocus: true,
    border: { type: 'line' },
    label: ' Notes ',
    scrollable: true,
    mouse: true,
    style: {
        fg: 'white',
        bg: 'black',
        focus: { border: { fg: 'green' } },
    },
});
terminalUI.registerWidget('#NotesInput', tmpTextarea);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputOnFocus` | Boolean | `false` | Enter input mode automatically on focus |
| `keys` | Boolean | `false` | Enable key bindings (E to open editor, Enter to edit) |
| `mouse` | Boolean | `false` | Right-click opens external `$EDITOR` |
| `value` | String | `''` | Initial content |

Plus all [Box](box.md) options.

## Methods

| Method | Description |
|--------|-------------|
| `setValue(value)` | Set the textarea content |
| `getValue()` | Get the current content |
| `clearInput()` | Clear the input and reset cursor |
| `clearValue()` | Clear the value only |
| `readInput(callback)` | Enter input mode; `callback(err, value)` on done |
| `submit()` | Emit submit event with current value |
| `cancel()` | Emit cancel event |
| `focus()` | Focus the textarea |

## Events

| Event | Callback | Description |
|-------|----------|-------------|
| `submit` | `(value)` | Content submitted |
| `cancel` | | Input cancelled |
| `action` | `(value)` | Either submit or cancel |
| `keypress` | `(ch, key)` | Any key pressed while in input mode |

## Keyboard Controls

When in input mode:

| Key | Action |
|-----|--------|
| Backspace | Delete character before cursor |
| Enter | New line |
| Arrow keys | Move cursor |

When not in input mode (if `keys: true`):

| Key | Action |
|-----|--------|
| `e` | Open content in `$EDITOR` |
| Enter | Enter input mode |

## Usage with Pict

```javascript
// Register widget
let tmpNotes = blessed.textarea({
    parent: pScreen,
    top: 5, left: 0, width: '100%', height: 10,
    inputOnFocus: true,
    border: { type: 'line' },
    label: ' Description ',
});
terminalUI.registerWidget('#DescriptionInput', tmpNotes);

// Sync value to AppData on submit
tmpNotes.on('submit', (pValue) =>
{
    _Pict.AppData.Item.Description = pValue;
});

// Pre-fill from AppData
tmpNotes.setValue(_Pict.AppData.Item.Description || '');
```

## Pict View Template

Render a label or instructions near the textarea.

```javascript
Templates: [{
    Hash: 'Notes-Instructions',
    Template: '{gray-fg}Type your notes below. Press Escape when done.{/gray-fg}'
}],
Renderables: [{
    RenderableHash: 'Notes-Help',
    TemplateHash: 'Notes-Instructions',
    ContentDestinationAddress: '#NotesHelp',
    RenderMethod: 'replace'
}]
```

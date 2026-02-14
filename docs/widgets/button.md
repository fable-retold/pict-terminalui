# Button

A clickable button that responds to Enter, Space, or mouse click. Emits a `press` event when activated.

## Creating a Button

```javascript
let tmpButton = blessed.button({
    parent: pScreen,
    top: 10,
    left: 2,
    width: 16,
    height: 3,
    content: ' Save ',
    align: 'center',
    mouse: true,
    border: { type: 'line' },
    style: {
        fg: 'white',
        bg: 'blue',
        focus: { bg: 'green' },
        hover: { bg: 'green' },
    },
});
terminalUI.registerWidget('#SaveButton', tmpButton);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | String | | Button label text |
| `align` | String | `'center'` | Label alignment |
| `mouse` | Boolean | `false` | Enable mouse click |

Plus all [Box](box.md) options.

## Methods

| Method | Description |
|--------|-------------|
| `press()` | Programmatically trigger the button press |
| `setContent(text)` | Change the button label |
| `focus()` | Give focus to the button |

## Events

| Event | Description |
|-------|-------------|
| `press` | Button was activated (Enter, Space, or click) |

## Keyboard

| Key | Action |
|-----|--------|
| Enter | Press the button |
| Space | Press the button |

## Usage with Pict

```javascript
let tmpSaveBtn = blessed.button({
    parent: pScreen,
    top: 12, left: 2, width: 14, height: 3,
    content: ' Save ',
    align: 'center',
    mouse: true,
    border: { type: 'line' },
    style: { fg: 'white', bg: 'blue', focus: { bg: 'green' } },
});
terminalUI.registerWidget('#SaveBtn', tmpSaveBtn);

tmpSaveBtn.on('press', () =>
{
    _Pict.AppData.Status.Message = 'Saved!';
    _Pict.views['StatusBar'].render();
});
```

## Pict View Template

Render contextual text near the button.

```javascript
Templates: [{
    Hash: 'Save-Area-Template',
    Template: '{bold}Actions:{/bold}\n\nPress Enter on the Save button to persist changes.'
}],
Renderables: [{
    RenderableHash: 'Save-Area',
    TemplateHash: 'Save-Area-Template',
    ContentDestinationAddress: '#ActionArea',
    RenderMethod: 'replace'
}]
```

## Multiple Buttons

Use a Form container for Tab navigation between multiple buttons.

```javascript
let tmpForm = blessed.form({ parent: pScreen, keys: true });

let tmpSave = blessed.button({
    parent: tmpForm, top: 0, left: 0, width: 12, height: 3,
    content: ' Save ', mouse: true, border: { type: 'line' },
    style: { fg: 'white', bg: 'blue', focus: { bg: 'green' } },
});

let tmpCancel = blessed.button({
    parent: tmpForm, top: 0, left: 14, width: 12, height: 3,
    content: ' Cancel ', mouse: true, border: { type: 'line' },
    style: { fg: 'white', bg: 'red', focus: { bg: 'yellow' } },
});

tmpSave.on('press', () => { tmpForm.submit(); });
tmpCancel.on('press', () => { tmpForm.cancel(); });
```

See [Form](form.md) for details on form-based navigation.

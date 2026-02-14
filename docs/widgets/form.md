# Form

A container that manages Tab navigation between child input widgets (textboxes, checkboxes, radio buttons, buttons). When submitted, collects values from all named children.

## Creating a Form

```javascript
let tmpForm = blessed.form({
    parent: pScreen,
    top: 2,
    left: 2,
    width: '80%',
    height: 20,
    keys: true,
    border: { type: 'line' },
    label: ' New User ',
    style: {
        border: { fg: 'cyan' },
    },
});
terminalUI.registerWidget('#UserForm', tmpForm);

// Add fields to the form
blessed.text({ parent: tmpForm, top: 1, left: 1, content: 'Name:' });
let tmpName = blessed.textbox({
    parent: tmpForm, name: 'name',
    top: 1, left: 10, width: 30, height: 1,
    inputOnFocus: true,
    style: { fg: 'white', bg: 'black' },
});

blessed.text({ parent: tmpForm, top: 3, left: 1, content: 'Email:' });
let tmpEmail = blessed.textbox({
    parent: tmpForm, name: 'email',
    top: 3, left: 10, width: 30, height: 1,
    inputOnFocus: true,
    style: { fg: 'white', bg: 'black' },
});

let tmpAdmin = blessed.checkbox({
    parent: tmpForm, name: 'admin',
    top: 5, left: 1, content: 'Administrator',
    mouse: true,
});

let tmpSubmit = blessed.button({
    parent: tmpForm,
    top: 7, left: 1, width: 12, height: 3,
    content: ' Save ', align: 'center',
    mouse: true, border: { type: 'line' },
    style: { fg: 'white', bg: 'blue', focus: { bg: 'green' } },
});
tmpSubmit.on('press', () => { tmpForm.submit(); });
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `keys` | Boolean | `false` | Enable Tab/Shift+Tab navigation between fields |
| `vi` | Boolean | `false` | Vi-style navigation |

Plus all [Box](box.md) options.

## Methods

| Method | Description |
|--------|-------------|
| `focusNext()` | Focus the next child input |
| `focusPrevious()` | Focus the previous child input |
| `focusFirst()` | Focus the first child input |
| `focusLast()` | Focus the last child input |
| `submit()` | Collect values from all named children and emit `submit` |
| `cancel()` | Emit `cancel` event |
| `reset()` | Reset all children to default values |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `submission` | Object | Last collected form data |

## Events

| Event | Callback | Description |
|-------|----------|-------------|
| `submit` | `(data)` | Form submitted; `data` is `{ fieldName: value, ... }` |
| `cancel` | | Form cancelled |

## Keyboard

| Key | Action |
|-----|--------|
| Tab | Focus next field |
| Shift+Tab | Focus previous field |
| Escape | Focus the form container itself |

## Named Fields

Each child input should have a `name` property. When the form is submitted, the data object uses these names as keys.

```javascript
blessed.textbox({ parent: tmpForm, name: 'username', ... });
blessed.textbox({ parent: tmpForm, name: 'password', censor: true, ... });
blessed.checkbox({ parent: tmpForm, name: 'remember', ... });
```

On submit:

```javascript
tmpForm.on('submit', (pData) =>
{
    // pData = { username: 'alice', password: 'secret', remember: true }
});
```

## Usage with Pict

```javascript
tmpForm.on('submit', (pData) =>
{
    // Sync form data to AppData
    _Pict.AppData.FormResult = pData;
    _Pict.AppData.Status.Message = 'Form submitted';
    _Pict.views['FormResult'].render();
    _Pict.views['StatusBar'].render();
});

tmpForm.on('cancel', () =>
{
    _Pict.AppData.Status.Message = 'Form cancelled';
    _Pict.views['StatusBar'].render();
});
```

## Pict View Template

Display form results in a separate widget.

```javascript
Templates: [{
    Hash: 'Form-Result-Template',
    Template: [
        '{bold}Submitted Data{/bold}',
        '',
        'Username: {~D:Record.username~}',
        'Admin:    {~D:Record.admin~}',
    ].join('\n')
}],
Renderables: [{
    RenderableHash: 'Form-Result',
    TemplateHash: 'Form-Result-Template',
    ContentDestinationAddress: '#FormResult',
    RenderMethod: 'replace'
}]
```

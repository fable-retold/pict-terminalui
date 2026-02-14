# Prompt

A modal dialog that asks the user for text input. Displays a message, a text field, and OK/Cancel buttons. Hidden by default; call `readInput()` to show it.

## Creating a Prompt

```javascript
let tmpPrompt = blessed.prompt({
    parent: pScreen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: 8,
    border: { type: 'line' },
    label: ' Input ',
    tags: true,
    hidden: true,
    style: {
        fg: 'white',
        bg: 'black',
        border: { fg: 'yellow' },
    },
});
terminalUI.registerWidget('#InputPrompt', tmpPrompt);
```

## Options

Standard [Box](box.md) options. The prompt is typically created with `hidden: true` and centered on screen.

## Methods

| Method | Description |
|--------|-------------|
| `readInput(text, value, callback)` | Show the prompt with a message and optional default value |

### readInput Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | String | The message/question to display |
| `value` | String | Default value in the text field (pass `''` for empty) |
| `callback` | Function | `(err, value)` -- `value` is the entered text, `null` on cancel |

## Usage

```javascript
tmpPrompt.readInput('Enter your name:', '', (pError, pValue) =>
{
    if (pValue !== null)
    {
        _Pict.AppData.User.Name = pValue;
        _Pict.views['Profile'].render();
    }
    pScreen.render();
});
```

## Usage with Pict

```javascript
// Trigger from a key binding
pScreen.key(['n'], () =>
{
    tmpPrompt.readInput('Item name:', '', (pError, pValue) =>
    {
        if (pValue)
        {
            _Pict.AppData.Items.push({ Name: pValue });
            _Pict.AppData.Status.Message = `Added: ${pValue}`;
            _Pict.views['ItemList'].render();
            _Pict.views['StatusBar'].render();
        }
        pScreen.render();
    });
});
```

## Pict View Template

Update a view after the prompt returns.

```javascript
Templates: [{
    Hash: 'Item-Added-Template',
    Template: '{green-fg}Added {~D:Record.Name~} to the list.{/green-fg}'
}],
Renderables: [{
    RenderableHash: 'Item-Added',
    TemplateHash: 'Item-Added-Template',
    ContentDestinationAddress: '#StatusMessage',
    RenderMethod: 'replace'
}]
```

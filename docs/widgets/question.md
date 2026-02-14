# Question

A modal yes/no confirmation dialog. Displays a question and two buttons (OK and Cancel). Hidden by default; call `ask()` to show it.

## Creating a Question Dialog

```javascript
let tmpQuestion = blessed.question({
    parent: pScreen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: 7,
    border: { type: 'line' },
    label: ' Confirm ',
    tags: true,
    hidden: true,
    style: {
        fg: 'white',
        bg: 'black',
        border: { fg: 'red' },
    },
});
terminalUI.registerWidget('#ConfirmDialog', tmpQuestion);
```

## Options

Standard [Box](box.md) options. Typically created with `hidden: true` and centered.

## Methods

| Method | Description |
|--------|-------------|
| `ask(text, callback)` | Show the dialog with a question |

### ask Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | String | The question to display |
| `callback` | Function | `(err, answer)` -- `answer` is `true` for Yes, `false` for No |

## Keyboard

| Key | Action |
|-----|--------|
| Enter / Y | Answer yes |
| Escape / N / Q | Answer no |

## Usage

```javascript
tmpQuestion.ask('Delete this item?', (pError, pAnswer) =>
{
    if (pAnswer)
    {
        // User confirmed
        deleteItem();
    }
    pScreen.render();
});
```

## Usage with Pict

```javascript
// Confirm before destructive action
pScreen.key(['delete'], () =>
{
    let tmpItem = _Pict.AppData.SelectedItem;
    if (!tmpItem) return;

    tmpQuestion.ask(`Delete "${tmpItem.Name}"?`, (pError, pAnswer) =>
    {
        if (pAnswer)
        {
            let tmpIndex = _Pict.AppData.Items.indexOf(tmpItem);
            if (tmpIndex >= 0)
            {
                _Pict.AppData.Items.splice(tmpIndex, 1);
            }
            _Pict.AppData.Status.Message = `Deleted ${tmpItem.Name}`;
            _Pict.views['ItemList'].render();
            _Pict.views['StatusBar'].render();
        }
        pScreen.render();
    });
});
```

## Pict View Template

Reflect the deletion in a status view.

```javascript
Templates: [{
    Hash: 'Status-Template',
    Template: '{~D:Record.Message~}'
}],
Renderables: [{
    RenderableHash: 'Status-Content',
    TemplateHash: 'Status-Template',
    ContentDestinationAddress: '#StatusBar',
    RenderMethod: 'replace'
}]
```

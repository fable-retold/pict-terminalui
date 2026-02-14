# Loading

An animated loading spinner overlay. Displays a spinning character animation (`|`, `/`, `-`, `\`) with a text label. Locks keyboard input while visible.

## Creating a Loading Indicator

```javascript
let tmpLoading = blessed.loading({
    parent: pScreen,
    top: 'center',
    left: 'center',
    width: '40%',
    height: 5,
    border: { type: 'line' },
    tags: true,
    hidden: true,
    style: {
        fg: 'white',
        bg: 'black',
        border: { fg: 'yellow' },
    },
});
terminalUI.registerWidget('#Loading', tmpLoading);
```

## Options

Standard [Box](box.md) options. Typically created with `hidden: true` and centered.

## Methods

| Method | Description |
|--------|-------------|
| `load(text)` | Show the loading indicator with a text label and start animating |
| `stop()` | Stop the animation and hide |

## Behavior

- Displays a spinning character that updates every 200ms
- Locks key events on the screen while active (keyboard input is blocked)
- Must be stopped explicitly with `stop()`

## Usage

```javascript
tmpLoading.load('Fetching data...');

// Simulate async work
setTimeout(() =>
{
    tmpLoading.stop();
    _Pict.AppData.Status.Message = 'Data loaded';
    _Pict.views['DataView'].render();
    _Pict.views['StatusBar'].render();
    pScreen.render();
}, 2000);
```

## Usage with Pict

```javascript
pScreen.key(['r'], () =>
{
    tmpLoading.load('Refreshing...');

    // Simulate API call
    setTimeout(() =>
    {
        _Pict.AppData.Items = generateNewData();
        tmpLoading.stop();

        _Pict.AppData.Status.Message = `Loaded ${_Pict.AppData.Items.length} items`;
        _Pict.views['ItemList'].render();
        _Pict.views['StatusBar'].render();
        pScreen.render();
    }, 1500);
});
```

## Pict View Template

The loading widget is self-contained. Use Pict templates for the content that appears after loading completes.

```javascript
Templates: [{
    Hash: 'Data-Loaded-Template',
    Template: [
        '{bold}Data Loaded{/bold}',
        '',
        'Items: {~D:Record.Count~}',
        'Last refresh: {~D:Record.Timestamp~}',
    ].join('\n')
}],
Renderables: [{
    RenderableHash: 'Data-Content',
    TemplateHash: 'Data-Loaded-Template',
    ContentDestinationAddress: '#DataView',
    RenderMethod: 'replace'
}]
```

# List

A scrollable, selectable list of items. This is the closest thing to a dropdown or select element in the terminal. Users navigate with arrow keys or mouse and select with Enter.

## Creating a List

```javascript
let tmpList = blessed.list({
    parent: pScreen,
    top: 2,
    left: 0,
    width: '50%',
    height: '80%',
    items: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'],
    keys: true,
    vi: true,
    mouse: true,
    border: { type: 'line' },
    label: ' Select Item ',
    scrollbar: {
        style: { bg: 'green' },
    },
    style: {
        fg: 'white',
        bg: 'black',
        selected: { fg: 'black', bg: 'green', bold: true },
        item: { fg: 'white' },
        border: { fg: 'cyan' },
    },
});
terminalUI.registerWidget('#ItemList', tmpList);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | Array | `[]` | String array of list items |
| `interactive` | Boolean | `true` | Allow selection |
| `keys` | Boolean | `false` | Enable keyboard navigation |
| `vi` | Boolean | `false` | Vi-style keys (j/k for down/up) |
| `mouse` | Boolean | `false` | Enable mouse selection and scroll |
| `search` | Function | | Custom search handler |
| `scrollbar` | Object | | Scrollbar style (`{ style: { bg: 'green' } }`) |
| `style.selected` | Object | | Style for the highlighted item |
| `style.item` | Object | | Style for regular items |

Plus all [Box](box.md) options.

## Methods

| Method | Description |
|--------|-------------|
| `setItems(items)` | Replace all items with a new array |
| `add(content)` | Add a single item at the end |
| `addItem(content)` | Alias for `add()` |
| `removeItem(index)` | Remove item by index |
| `insertItem(index, content)` | Insert item at position |
| `clearItems()` | Remove all items |
| `select(index)` | Select item by index |
| `move(offset)` | Move selection by offset (+1 = down, -1 = up) |
| `up(amount)` | Move selection up |
| `down(amount)` | Move selection down |
| `getItem(index)` | Get an item element by index |
| `fuzzyFind(search)` | Search items by text |
| `scrollTo(index)` | Scroll to show item at index |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `selected` | Number | Index of the currently selected item |
| `value` | String | Text of the currently selected item |
| `items` | Array | Array of item elements |

## Events

| Event | Callback | Description |
|-------|----------|-------------|
| `select item` | `(item, index)` | Item was selected (Enter or click) |
| `select` | `(item, index)` | Alias for `select item` |
| `action` | `(item, index)` | Item was activated |

## Keyboard

| Key | Action |
|-----|--------|
| Up / k | Move selection up |
| Down / j | Move selection down |
| Page Up | Scroll up one page |
| Page Down | Scroll down one page |
| Home / g | Jump to first item |
| End / G | Jump to last item |
| Enter | Select the current item |

## Usage with Pict

```javascript
let tmpFileList = blessed.list({
    parent: pScreen,
    top: 1, left: 0, width: '40%', bottom: 1,
    items: [],
    keys: true, vi: true, mouse: true,
    border: { type: 'line' },
    label: ' Files ',
    scrollbar: { style: { bg: 'blue' } },
    style: {
        selected: { fg: 'black', bg: 'cyan' },
        border: { fg: 'blue' },
    },
});
terminalUI.registerWidget('#FileList', tmpFileList);

// Populate from AppData
tmpFileList.setItems(_Pict.AppData.Files.map((f) => f.Name));

// Handle selection
tmpFileList.on('select', (pItem, pIndex) =>
{
    _Pict.AppData.SelectedFile = _Pict.AppData.Files[pIndex];
    _Pict.views['FileDetail'].render();
});

tmpFileList.focus();
```

## Pict View Template

Render the selected item details in a separate view.

```javascript
Templates: [{
    Hash: 'File-Detail-Template',
    Template: [
        '{bold}{~D:Record.Name~}{/bold}',
        '',
        'Size:     {~D:Record.Size~} bytes',
        'Modified: {~D:Record.Modified~}',
        'Type:     {~D:Record.Type~}',
    ].join('\n')
}],
Renderables: [{
    RenderableHash: 'File-Detail',
    TemplateHash: 'File-Detail-Template',
    ContentDestinationAddress: '#FileDetail',
    RenderMethod: 'replace'
}]
```

## Dynamic Updates

Update the list when data changes and re-render.

```javascript
// Add a new item
_Pict.AppData.Files.push({ Name: 'new-file.txt', Size: 0 });
tmpFileList.setItems(_Pict.AppData.Files.map((f) => f.Name));
pScreen.render();
```

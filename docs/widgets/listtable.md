# List Table

An interactive, scrollable data table. Combines the selection behavior of [List](list.md) with column layout. The first row is treated as a sticky header; remaining rows are selectable.

## Creating a List Table

```javascript
let tmpTable = blessed.listtable({
    parent: pScreen,
    top: 2,
    left: 0,
    width: '100%',
    height: '80%',
    keys: true,
    vi: true,
    mouse: true,
    border: { type: 'line' },
    label: ' Users ',
    align: 'left',
    pad: 2,
    scrollbar: {
        style: { bg: 'blue' },
    },
    style: {
        fg: 'white',
        header: { fg: 'cyan', bold: true },
        cell: { fg: 'white' },
        selected: { fg: 'black', bg: 'green' },
        border: { fg: 'blue' },
    },
    data: [
        ['Name', 'Email', 'Role'],
        ['Alice', 'alice@example.com', 'Admin'],
        ['Bob', 'bob@example.com', 'User'],
        ['Carol', 'carol@example.com', 'Editor'],
    ],
});
terminalUI.registerWidget('#UserTable', tmpTable);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` / `rows` | Array | `[]` | Array of arrays; first row is the header |
| `pad` | Number | `2` | Padding between columns |
| `align` | String | `'left'` | Cell alignment: `'left'`, `'center'`, `'right'` |
| `style.header` | Object | | Style for the header row |
| `style.cell` | Object | | Style for data cells |
| `style.selected` | Object | | Style for the selected row |

Plus all [List](list.md) options (keys, vi, mouse, scrollbar, etc.).

## Methods

| Method | Description |
|--------|-------------|
| `setData(rows)` | Replace all table data (first row = header) |
| `setRows(rows)` | Alias for `setData()` |
| `select(index)` | Select a data row (0 = first data row, not header) |

Inherits all [List](list.md) methods.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `selected` | Number | Index of the selected data row |

## Events

Same as [List](list.md):

| Event | Callback | Description |
|-------|----------|-------------|
| `select` | `(item, index)` | Row was selected |

## Usage with Pict

```javascript
let tmpTable = blessed.listtable({
    parent: pScreen,
    top: 1, left: 0, width: '100%', bottom: 1,
    keys: true, vi: true, mouse: true,
    border: { type: 'line' },
    label: ' Records ',
    pad: 3,
    style: {
        header: { fg: 'yellow', bold: true },
        selected: { fg: 'black', bg: 'cyan' },
        border: { fg: 'blue' },
    },
});
terminalUI.registerWidget('#RecordTable', tmpTable);

// Build table data from AppData
function refreshTable()
{
    let tmpRows = [['ID', 'Name', 'Status']];
    _Pict.AppData.Records.forEach((pRecord) =>
    {
        tmpRows.push([String(pRecord.ID), pRecord.Name, pRecord.Status]);
    });
    tmpTable.setData(tmpRows);
    pScreen.render();
}

tmpTable.on('select', (pItem, pIndex) =>
{
    _Pict.AppData.SelectedRecord = _Pict.AppData.Records[pIndex];
    _Pict.views['RecordDetail'].render();
});

refreshTable();
tmpTable.focus();
```

## Pict View Template

Render detail for the selected row.

```javascript
Templates: [{
    Hash: 'Record-Detail-Template',
    Template: [
        '{bold}Record #{~D:Record.ID~}{/bold}',
        '',
        'Name:   {~D:Record.Name~}',
        'Status: {yellow-fg}{~D:Record.Status~}{/yellow-fg}',
        'Created: {~D:Record.Created~}',
    ].join('\n')
}],
Renderables: [{
    RenderableHash: 'Record-Detail',
    TemplateHash: 'Record-Detail-Template',
    ContentDestinationAddress: '#RecordDetail',
    RenderMethod: 'replace'
}]
```

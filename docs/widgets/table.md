# Table

A static, non-interactive data table. Displays rows and columns with automatic column width calculation. For an interactive, scrollable table with row selection, see [List Table](listtable.md).

## Creating a Table

```javascript
let tmpTable = blessed.table({
    parent: pScreen,
    top: 2,
    left: 2,
    width: '90%',
    height: 10,
    border: { type: 'line' },
    label: ' Summary ',
    tags: true,
    pad: 2,
    align: 'left',
    data: [
        ['Metric', 'Value', 'Change'],
        ['Users', '1,234', '+12%'],
        ['Revenue', '$45,600', '+8%'],
        ['Errors', '23', '-15%'],
    ],
    style: {
        fg: 'white',
        border: { fg: 'cyan' },
        header: { fg: 'cyan', bold: true },
        cell: { fg: 'white' },
    },
});
terminalUI.registerWidget('#SummaryTable', tmpTable);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` / `rows` | Array | `[]` | Array of arrays; first row is the header |
| `pad` | Number | `2` | Padding (spaces) between columns |
| `align` | String | `'left'` | Cell alignment: `'left'`, `'center'`, `'right'` |
| `style.header` | Object | | Style for the header row |
| `style.cell` | Object | | Style for data cells |

Plus all [Box](box.md) options.

## Methods

| Method | Description |
|--------|-------------|
| `setData(rows)` | Replace all table data |
| `setRows(rows)` | Alias for `setData()` |

## Display

```
  Metric    Value     Change
  Users     1,234     +12%
  Revenue   $45,600   +8%
  Errors    23        -15%
```

Column widths are calculated automatically based on content. The `pad` value controls spacing between columns.

## Usage with Pict

```javascript
let tmpTable = blessed.table({
    parent: pScreen,
    top: 2, left: 2, width: '90%',
    border: { type: 'line' },
    pad: 3,
    style: { header: { fg: 'yellow', bold: true }, border: { fg: 'blue' } },
});
terminalUI.registerWidget('#StatsTable', tmpTable);

// Build table from AppData
function refreshStats()
{
    let tmpRows = [['Name', 'Count', 'Status']];
    _Pict.AppData.Stats.forEach((pStat) =>
    {
        tmpRows.push([pStat.Name, String(pStat.Count), pStat.Status]);
    });
    tmpTable.setData(tmpRows);
    pScreen.render();
}
```

## Pict View Template

Render a title or description above the table.

```javascript
Templates: [{
    Hash: 'Stats-Header-Template',
    Template: '{bold}System Statistics{/bold}\n{gray-fg}Updated: {~D:Record.LastUpdate~}{/gray-fg}'
}],
Renderables: [{
    RenderableHash: 'Stats-Header',
    TemplateHash: 'Stats-Header-Template',
    ContentDestinationAddress: '#StatsTitle',
    RenderMethod: 'replace'
}]
```

## Table vs List Table

| Feature | Table | List Table |
|---------|-------|------------|
| Interactive | No | Yes |
| Row selection | No | Yes |
| Scrollable | No | Yes |
| Keyboard navigation | No | Yes |
| Use case | Static display | Data browsing |

Use Table for dashboards and summaries. Use [List Table](listtable.md) when users need to select rows.

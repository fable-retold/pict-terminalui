# Progress Bar

A visual progress indicator that fills horizontally (or vertically) to show completion.

## Creating a Progress Bar

```javascript
let tmpProgress = blessed.progressbar({
    parent: pScreen,
    bottom: 1,
    left: 0,
    width: '100%',
    height: 1,
    filled: 0,
    pch: '\u2588',
    orientation: 'horizontal',
    style: {
        bar: { bg: 'green' },
        bg: 'black',
    },
});
terminalUI.registerWidget('#Progress', tmpProgress);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `filled` | Number | `0` | Initial fill percentage (0-100) |
| `pch` | String | | Fill character (e.g. `'\u2588'` for a solid block) |
| `orientation` | String | `'horizontal'` | Fill direction: `'horizontal'` or `'vertical'` |
| `keys` | Boolean | `false` | Enable arrow keys to adjust |
| `mouse` | Boolean | `false` | Click to set progress position |

Plus all [Box](box.md) options.

## Methods

| Method | Description |
|--------|-------------|
| `progress(amount)` | Add `amount` percent to current progress |
| `setProgress(percent)` | Set progress to an absolute percentage (0-100) |
| `reset()` | Reset to 0% |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `filled` | Number | Current fill percentage (0-100) |
| `value` | Number | Same as `filled` |

## Events

| Event | Description |
|-------|-------------|
| `complete` | Progress reached 100% |
| `reset` | Progress was reset to 0% |

## Usage with Pict

```javascript
let tmpProgress = blessed.progressbar({
    parent: pScreen,
    bottom: 1, left: 0, width: '100%', height: 1,
    filled: 0,
    pch: '\u2588',
    style: { bar: { bg: 'blue' }, bg: 'black' },
});
terminalUI.registerWidget('#DownloadProgress', tmpProgress);

// Simulate a download
let tmpPercent = 0;
let tmpInterval = setInterval(() =>
{
    tmpPercent += 5;
    tmpProgress.setProgress(tmpPercent);
    _Pict.AppData.Download.Percent = tmpPercent;
    _Pict.views['DownloadStatus'].render();
    pScreen.render();

    if (tmpPercent >= 100)
    {
        clearInterval(tmpInterval);
    }
}, 200);
```

## Pict View Template

Show progress details alongside the bar.

```javascript
Templates: [{
    Hash: 'Download-Status-Template',
    Template: 'Downloading: {~D:Record.Filename~} ({~D:Record.Percent~}%)'
}],
Renderables: [{
    RenderableHash: 'Download-Status',
    TemplateHash: 'Download-Status-Template',
    ContentDestinationAddress: '#DownloadLabel',
    RenderMethod: 'replace'
}]
```

## Styled Progress

Combine progress bar with a status line for a polished look.

```javascript
let tmpBar = blessed.progressbar({
    parent: pScreen,
    bottom: 0, left: 0, width: '100%', height: 1,
    filled: 0,
    pch: '\u2588',
    style: { bar: { bg: 'green' }, bg: 'black' },
});

let tmpStatusLine = blessed.box({
    parent: pScreen,
    bottom: 1, left: 0, width: '100%', height: 1,
    tags: true,
    style: { fg: 'white', bg: 'black' },
});
terminalUI.registerWidget('#ProgressBar', tmpBar);
terminalUI.registerWidget('#ProgressLabel', tmpStatusLine);
```

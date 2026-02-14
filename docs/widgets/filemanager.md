# File Manager

An interactive file browser that displays directory contents. Users can navigate directories, select files, and browse the filesystem. Extends [List](list.md) with directory-aware behavior.

## Creating a File Manager

```javascript
let tmpFileManager = blessed.filemanager({
    parent: pScreen,
    top: 1,
    left: 0,
    width: '50%',
    bottom: 1,
    keys: true,
    vi: true,
    mouse: true,
    border: { type: 'line' },
    label: ' Files ',
    scrollbar: {
        style: { bg: 'blue' },
    },
    style: {
        fg: 'white',
        selected: { fg: 'black', bg: 'cyan' },
        border: { fg: 'blue' },
    },
});
terminalUI.registerWidget('#FileBrowser', tmpFileManager);
```

## Options

Inherits all [List](list.md) options (keys, vi, mouse, scrollbar, style, etc.) plus:

| Option | Type | Description |
|--------|------|-------------|
| `cwd` | String | Starting directory path |
| `label` | String | Border label (supports `%path` for dynamic path display) |

## Methods

| Method | Description |
|--------|-------------|
| `refresh(cwd, callback)` | Reload directory contents |
| `pick(cwd, callback)` | Show a file picker starting at `cwd` |
| `reset(cwd, callback)` | Reset to a directory |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `cwd` | String | Current working directory |
| `file` | String | Currently selected file name |
| `value` | String | Full path to selected file |

## Events

| Event | Callback | Description |
|-------|----------|-------------|
| `cd` | `(file, oldCwd)` | Changed to a new directory |
| `file` | `(file)` | A file was selected (Enter pressed on a file) |
| `refresh` | | Directory contents were reloaded |
| `error` | `(error, path)` | Error reading directory |

## Display

Directories are shown in blue with a `/` suffix. Symlinks are shown in cyan with a `@` suffix. Regular files use the default color.

```
 ../
 documents/
 config.json
 readme.md
 script.js
```

## Navigation

| Key | Action |
|-----|--------|
| Enter | Open directory or select file |
| Up / k | Move selection up |
| Down / j | Move selection down |
| Backspace | Go to parent directory |

## Usage with Pict

```javascript
let tmpFileMgr = blessed.filemanager({
    parent: pScreen,
    top: 1, left: 0, width: '50%', bottom: 1,
    cwd: process.cwd(),
    keys: true, vi: true, mouse: true,
    border: { type: 'line' },
    label: ' %path ',
    scrollbar: { style: { bg: 'blue' } },
    style: { selected: { fg: 'black', bg: 'cyan' }, border: { fg: 'blue' } },
});
terminalUI.registerWidget('#FileBrowser', tmpFileMgr);

tmpFileMgr.on('file', (pFile) =>
{
    _Pict.AppData.SelectedFile = {
        Path: pFile,
        Name: require('path').basename(pFile),
    };
    _Pict.views['FileDetail'].render();
});

tmpFileMgr.refresh(process.cwd());
tmpFileMgr.focus();
```

## Pict View Template

Show file details in a panel next to the file manager.

```javascript
Templates: [{
    Hash: 'File-Detail-Template',
    Template: [
        '{bold}Selected File{/bold}',
        '',
        'Name: {~D:Record.Name~}',
        'Path: {~D:Record.Path~}',
    ].join('\n')
}],
Renderables: [{
    RenderableHash: 'File-Detail',
    TemplateHash: 'File-Detail-Template',
    ContentDestinationAddress: '#FileDetail',
    RenderMethod: 'replace'
}]
```

## File Picker Pattern

Use `pick()` for a one-shot file selection dialog.

```javascript
pScreen.key(['o'], () =>
{
    tmpFileMgr.pick(process.cwd(), (pError, pFile) =>
    {
        if (pFile)
        {
            _Pict.AppData.OpenFile = { Path: pFile };
            _Pict.views['FileContent'].render();
        }
        pScreen.render();
    });
});
```

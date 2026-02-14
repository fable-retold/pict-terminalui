# Checkbox

A boolean toggle widget that displays as `[x]` when checked or `[ ]` when unchecked. Can be toggled with Enter, Space, or mouse click.

## Creating a Checkbox

```javascript
let tmpCheckbox = blessed.checkbox({
    parent: pScreen,
    top: 3,
    left: 2,
    width: 30,
    height: 1,
    content: 'Enable notifications',
    checked: false,
    mouse: true,
    style: {
        fg: 'white',
    },
});
terminalUI.registerWidget('#NotifyCheckbox', tmpCheckbox);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | String | | Label text displayed after the checkbox |
| `text` | String | | Alias for `content` |
| `checked` | Boolean | `false` | Initial checked state |
| `mouse` | Boolean | `false` | Enable mouse toggle |

Plus all [Box](box.md) options.

## Methods

| Method | Description |
|--------|-------------|
| `check()` | Set to checked |
| `uncheck()` | Set to unchecked |
| `toggle()` | Toggle the checked state |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `checked` | Boolean | Current checked state |
| `value` | Boolean | Same as `checked` |

## Events

| Event | Description |
|-------|-------------|
| `check` | Checkbox was checked |
| `uncheck` | Checkbox was unchecked |

## Keyboard

| Key | Action |
|-----|--------|
| Enter | Toggle |
| Space | Toggle |

## Display

```
[x] Enable notifications
[ ] Send daily digest
```

## Usage with Pict

```javascript
let tmpNotify = blessed.checkbox({
    parent: pScreen,
    top: 4, left: 2, width: 30, height: 1,
    content: 'Enable notifications',
    mouse: true,
});
terminalUI.registerWidget('#NotifyCheck', tmpNotify);

tmpNotify.on('check', () =>
{
    _Pict.AppData.Settings.Notifications = true;
    _Pict.views['Settings'].render();
});

tmpNotify.on('uncheck', () =>
{
    _Pict.AppData.Settings.Notifications = false;
    _Pict.views['Settings'].render();
});
```

## Pict View Template

Display settings status alongside the checkboxes.

```javascript
Templates: [{
    Hash: 'Settings-Status-Template',
    Template: [
        '{bold}Current Settings{/bold}',
        '',
        'Notifications: {~D:Record.Notifications~}',
        'Dark Mode:     {~D:Record.DarkMode~}',
    ].join('\n')
}],
Renderables: [{
    RenderableHash: 'Settings-Status',
    TemplateHash: 'Settings-Status-Template',
    ContentDestinationAddress: '#SettingsStatus',
    RenderMethod: 'replace'
}]
```

## Multiple Checkboxes

Stack checkboxes vertically, incrementing `top` for each.

```javascript
let tmpOptions = ['Verbose logging', 'Dark mode', 'Auto-save'];
tmpOptions.forEach((pLabel, pIndex) =>
{
    let tmpCb = blessed.checkbox({
        parent: pScreen,
        top: 3 + pIndex,
        left: 2,
        width: 30,
        height: 1,
        content: pLabel,
        mouse: true,
    });
    terminalUI.registerWidget(`#Option-${pIndex}`, tmpCb);
});
```

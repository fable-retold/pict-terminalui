# List Bar

A horizontal menu bar of selectable commands or tabs. Items are displayed side by side and can be selected with arrow keys, number keys, or mouse.

## Creating a List Bar

```javascript
let tmpListBar = blessed.listbar({
    parent: pScreen,
    top: 0,
    left: 0,
    width: '100%',
    height: 1,
    mouse: true,
    keys: true,
    autoCommandKeys: true,
    style: {
        bg: 'blue',
        item: { fg: 'white', bg: 'blue' },
        selected: { fg: 'blue', bg: 'white' },
        prefix: { fg: 'yellow' },
    },
    commands: {
        'Home': { callback: () => { navigateTo('Home'); } },
        'Files': { callback: () => { navigateTo('Files'); } },
        'Settings': { callback: () => { navigateTo('Settings'); } },
        'Quit': { callback: () => { process.exit(0); } },
    },
});
terminalUI.registerWidget('#MenuBar', tmpListBar);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `commands` / `items` | Object/Array | | Menu items (see format below) |
| `autoCommandKeys` | Boolean | `false` | Use number keys 1-9 to select items |
| `keys` | Boolean | `false` | Enable arrow key navigation |
| `vi` | Boolean | `false` | Vi-style navigation (h/l) |
| `mouse` | Boolean | `false` | Enable mouse click |

Plus all [Box](box.md) options.

## Command Format

Commands can be an object or array:

```javascript
// Object format
commands: {
    'Label': { callback: function() {} },
    'Label2': { callback: function() {} },
}

// Array format
commands: [
    { text: 'Label', callback: function() {} },
    { text: 'Label2', callback: function() {} },
]
```

## Methods

| Method | Description |
|--------|-------------|
| `setItems(commands)` | Replace all menu items |
| `add(command)` | Add a single menu item |
| `select(index)` | Select item by index |
| `selectTab(index)` | Alias for `select()` |
| `moveLeft()` | Move selection left |
| `moveRight()` | Move selection right |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `selected` | Number | Index of the selected item |

## Events

| Event | Callback | Description |
|-------|----------|-------------|
| `select` | `(item, index)` | Item was selected |

## Keyboard

| Key | Action |
|-----|--------|
| Left / h | Move selection left |
| Right / l | Move selection right |
| Tab | Move to next item |
| Shift+Tab | Move to previous item |
| 1-9 | Select item by number (if `autoCommandKeys` is true) |
| Enter | Activate selected item callback |

## Display

```
 1:Home  2:Files  3:Settings  4:Quit
```

When `autoCommandKeys` is true, number prefixes are shown.

## Usage with Pict

```javascript
let tmpTabBar = blessed.listbar({
    parent: pScreen,
    top: 0, left: 0, width: '100%', height: 1,
    mouse: true, keys: true, autoCommandKeys: true,
    style: {
        bg: 'blue',
        item: { fg: 'white', bg: 'blue' },
        selected: { fg: 'blue', bg: 'white', bold: true },
    },
    commands: {
        'Dashboard': { callback: () => {
            _Pict.AppData.Status.Route = 'Dashboard';
            _Pict.views['Dashboard'].render();
            _Pict.views['StatusBar'].render();
        }},
        'Reports': { callback: () => {
            _Pict.AppData.Status.Route = 'Reports';
            _Pict.views['Reports'].render();
            _Pict.views['StatusBar'].render();
        }},
    },
});
terminalUI.registerWidget('#TabBar', tmpTabBar);
tmpTabBar.focus();
```

## Pict View Template

The list bar manages its own items. Use a Pict template for the content area below it.

```javascript
Templates: [{
    Hash: 'Dashboard-Template',
    Template: '{bold}Dashboard{/bold}\n\nActive users: {~D:Record.ActiveUsers~}\nRequests/sec: {~D:Record.RequestRate~}'
}]
```

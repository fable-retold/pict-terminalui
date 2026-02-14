# Quick Start

Pict Terminal UI lets you write standard Pict views that render to a blessed terminal interface. If you know how to build a Pict web application with views, templates, and renderables, you already know how to build a TUI.

## Install

```bash
npm install pict pict-view pict-application blessed pict-terminalui
```

## How It Works

Pict views normally render HTML into the DOM via the `ContentAssignment` service. Pict Terminal UI overrides that service so content flows to blessed widgets instead.

```
Pict View  -->  Template Engine  -->  ContentAssignment  -->  blessed widget
                (same as always)      (overridden)            (instead of DOM)
```

The address strings you put in your view configuration (like `#MyContainer`) map to registered blessed widgets instead of CSS selectors.

## Minimal Example

This creates a single Pict view that renders into a blessed box on the terminal.

```javascript
const blessed = require('blessed');
const libPict = require('pict');
const libPictView = require('pict-view');
const libPictTerminalUI = require('pict-terminalui');

// 1. Create a Pict instance
let _Pict = new libPict({ Product: 'MyTUI', LogNoisiness: 0 });

// 2. Create the terminal UI bridge (wires ContentAssignment overrides)
let _TUI = new libPictTerminalUI(_Pict, { Title: 'My First TUI' });

// 3. Create the blessed screen
let _Screen = _TUI.createScreen();

// 4. Create a blessed box and register it by address
let _Box = blessed.box({
    parent: _Screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    tags: true,
    border: { type: 'line' },
    label: ' Hello ',
});
_TUI.registerWidget('#MainBox', _Box);

// 5. Set up app data
_Pict.AppData.Greeting = { Name: 'World' };

// 6. Create a view with a template
let _View = _Pict.addView('Hello', {
    ViewIdentifier: 'Hello',
    DefaultRenderable: 'Hello-Content',
    DefaultDestinationAddress: '#MainBox',
    DefaultTemplateRecordAddress: 'AppData.Greeting',
    AutoRender: false,
    AutoInitialize: false,
    Templates: [{
        Hash: 'Hello-Template',
        Template: '{bold}Hello, {~D:Record.Name~}!{/bold}\n\nThis is a Pict view in the terminal.'
    }],
    Renderables: [{
        RenderableHash: 'Hello-Content',
        TemplateHash: 'Hello-Template',
        ContentDestinationAddress: '#MainBox',
        RenderMethod: 'replace'
    }]
}, libPictView);

// 7. Render the view -- content goes to the blessed box
_View.render();
_Screen.render();
```

Press `Ctrl-C` to quit.

## Key Concepts

### Widget Registry

The terminal UI bridge maintains a map of address strings to blessed widgets. When a Pict view renders to `#SomeAddress`, the bridge looks up that address in the registry and sets the widget content.

```javascript
_TUI.registerWidget('#Header', headerBox);
_TUI.registerWidget('#Content', contentBox);
_TUI.registerWidget('#Footer', footerBox);
```

### Templates with Blessed Tags

Blessed widgets support their own tag format for colors and formatting. You can use these directly in your Pict templates.

```javascript
Template: '{bold}Title{/bold}\n{yellow-fg}Status: {/yellow-fg}{~D:Record.Status~}'
```

Available tags include `{bold}`, `{underline}`, `{blink}`, `{inverse}`, and color tags like `{red-fg}`, `{blue-bg}`, `{green-fg}`.

### Routing Between Views

Multiple views can render to the same widget address. To navigate, render the new view -- it replaces the content.

```javascript
// "Route" to different views by rendering them into the same widget
screen.key(['h'], () => { _Pict.views['Home'].render(); });
screen.key(['a'], () => { _Pict.views['About'].render(); });
```

### Data Binding

Pict's template data expressions work the same way. Set values on `AppData`, change them, and re-render the view.

```javascript
_Pict.AppData.Counter = { Value: 0 };

setInterval(() => {
    _Pict.AppData.Counter.Value++;
    _Pict.views['Counter'].render();
}, 1000);
```

## Next Steps

- [Building an App](building-an-app.md) -- Full walkthrough of a multi-view application
- [Box](widgets/box.md) -- The fundamental blessed container widget
- [List](widgets/list.md) -- Scrollable selection lists
- [Form](widgets/form.md) -- Forms with tab navigation between fields

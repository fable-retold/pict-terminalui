# Building an App

This guide walks through building a complete multi-view terminal application with Pict Terminal UI. We will create an app with a header, a content area that switches between views, and a status bar.

## Project Setup

```bash
mkdir my-tui-app && cd my-tui-app
npm init -y
npm install pict pict-view pict-application blessed pict-terminalui
```

Create the following directory structure:

```
my-tui-app/
  source/
    views/
      PictView-Header.js
      PictView-Home.js
      PictView-Detail.js
      PictView-StatusBar.js
    App.js
  package.json
```

## Suppress Blessed Stderr Noise

Blessed tries to parse the system terminfo file at startup, which can produce Setulc-related warnings on stderr. Add this at the very top of your entry point, before any other requires.

```javascript
const _origStderrWrite = process.stderr.write;
process.stderr.write = function (pChunk)
{
    if (typeof pChunk === 'string' && pChunk.indexOf('Setulc') !== -1)
    {
        return true;
    }
    return _origStderrWrite.apply(process.stderr, arguments);
};
```

The `createScreen()` method on PictTerminalUI also uses blessed's bundled terminfo to avoid the issue at the screen level, but this stderr filter catches any noise that happens before the screen is created.

## Define Your Views

Each view is a standard Pict view with a configuration object containing templates and renderables.

### Header View

```javascript
const libPictView = require('pict-view');

const _ViewConfiguration =
{
    ViewIdentifier: 'App-Header',
    DefaultRenderable: 'Header-Content',
    DefaultDestinationAddress: '#App-Header',
    AutoRender: false,

    Templates:
    [
        {
            Hash: 'Header-Template',
            Template: '{center}{bold}My TUI App{/bold} | [H]ome  [D]etail  [Ctrl-C] Quit{/center}'
        }
    ],

    Renderables:
    [
        {
            RenderableHash: 'Header-Content',
            TemplateHash: 'Header-Template',
            ContentDestinationAddress: '#App-Header',
            RenderMethod: 'replace'
        }
    ]
};

class HeaderView extends libPictView
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
    }
}

module.exports = HeaderView;
module.exports.default_configuration = _ViewConfiguration;
```

### Home View

Templates can reference data from `AppData` using Pict's `{~D:Record.Field~}` expressions.

```javascript
const libPictView = require('pict-view');

const _ViewConfiguration =
{
    ViewIdentifier: 'App-Home',
    DefaultRenderable: 'Home-Content',
    DefaultDestinationAddress: '#App-Content',
    DefaultTemplateRecordAddress: 'AppData.Home',
    AutoRender: false,

    Templates:
    [
        {
            Hash: 'Home-Template',
            Template: '{bold}Welcome{/bold}\n\n{~D:Record.Description~}\n\nItems loaded: {~D:Record.ItemCount~}'
        }
    ],

    Renderables:
    [
        {
            RenderableHash: 'Home-Content',
            TemplateHash: 'Home-Template',
            ContentDestinationAddress: '#App-Content',
            RenderMethod: 'replace'
        }
    ]
};

class HomeView extends libPictView
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
    }
}

module.exports = HomeView;
module.exports.default_configuration = _ViewConfiguration;
```

### Detail View

This view uses `onAfterRender` to do extra work after the template renders. This is the same lifecycle hook pattern used in browser-based Pict apps.

```javascript
const libPictView = require('pict-view');

const _ViewConfiguration =
{
    ViewIdentifier: 'App-Detail',
    DefaultRenderable: 'Detail-Content',
    DefaultDestinationAddress: '#App-Content',
    DefaultTemplateRecordAddress: 'AppData.Detail',
    AutoRender: false,

    Templates:
    [
        {
            Hash: 'Detail-Template',
            Template: '{bold}{~D:Record.Title~}{/bold}\n\n{~D:Record.Body~}\n\n{gray-fg}Last updated: {~D:Record.Updated~}{/gray-fg}'
        }
    ],

    Renderables:
    [
        {
            RenderableHash: 'Detail-Content',
            TemplateHash: 'Detail-Template',
            ContentDestinationAddress: '#App-Content',
            RenderMethod: 'replace'
        }
    ]
};

class DetailView extends libPictView
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
    }

    onAfterRender(pRenderable)
    {
        // Update the status bar whenever this view renders
        this.pict.AppData.Status.Message = 'Viewing detail';
        if (this.pict.views['App-StatusBar'])
        {
            this.pict.views['App-StatusBar'].render();
        }
        return super.onAfterRender(pRenderable);
    }
}

module.exports = DetailView;
module.exports.default_configuration = _ViewConfiguration;
```

### Status Bar View

```javascript
const libPictView = require('pict-view');

const _ViewConfiguration =
{
    ViewIdentifier: 'App-StatusBar',
    DefaultRenderable: 'StatusBar-Content',
    DefaultDestinationAddress: '#App-StatusBar',
    DefaultTemplateRecordAddress: 'AppData.Status',
    AutoRender: false,

    Templates:
    [
        {
            Hash: 'StatusBar-Template',
            Template: ' {~D:Record.Route~} | {~D:Record.Message~}'
        }
    ],

    Renderables:
    [
        {
            RenderableHash: 'StatusBar-Content',
            TemplateHash: 'StatusBar-Template',
            ContentDestinationAddress: '#App-StatusBar',
            RenderMethod: 'replace'
        }
    ]
};

class StatusBarView extends libPictView
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
    }
}

module.exports = StatusBarView;
module.exports.default_configuration = _ViewConfiguration;
```

## Build the Application

The application class wires everything together: creating the terminal UI, building blessed widgets, registering them, adding views, and binding navigation keys.

```javascript
const blessed = require('blessed');
const libPict = require('pict');
const libPictApplication = require('pict-application');
const libPictTerminalUI = require('pict-terminalui');

const libHeaderView = require('./views/PictView-Header.js');
const libHomeView = require('./views/PictView-Home.js');
const libDetailView = require('./views/PictView-Detail.js');
const libStatusBarView = require('./views/PictView-StatusBar.js');

class MyApp extends libPictApplication
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        // Register views with Pict
        this.pict.addView('App-Header', libHeaderView.default_configuration, libHeaderView);
        this.pict.addView('App-Home', libHomeView.default_configuration, libHomeView);
        this.pict.addView('App-Detail', libDetailView.default_configuration, libDetailView);
        this.pict.addView('App-StatusBar', libStatusBarView.default_configuration, libStatusBarView);
    }

    onAfterInitializeAsync(fCallback)
    {
        // Set up application state
        this.pict.AppData.Home = {
            Description: 'A sample multi-view terminal application.',
            ItemCount: 42
        };
        this.pict.AppData.Detail = {
            Title: 'Item Detail',
            Body: 'This is the detail view for the selected item.',
            Updated: new Date().toISOString()
        };
        this.pict.AppData.Status = {
            Route: 'Home',
            Message: 'Ready'
        };

        // Create the terminal UI and screen
        this.terminalUI = new libPictTerminalUI(this.pict, { Title: 'My TUI App' });
        let tmpScreen = this.terminalUI.createScreen();

        // Build and register blessed widgets
        this._buildLayout(tmpScreen);

        // Bind navigation
        this._bindKeys(tmpScreen);

        // Render initial views
        this.pict.views['App-Header'].render();
        this.pict.views['App-Home'].render();
        this.pict.views['App-StatusBar'].render();
        tmpScreen.render();

        return super.onAfterInitializeAsync(fCallback);
    }

    _buildLayout(pScreen)
    {
        let tmpHeader = blessed.box({
            parent: pScreen,
            top: 0, left: 0, width: '100%', height: 1,
            tags: true,
            style: { fg: 'white', bg: 'blue' },
        });
        this.terminalUI.registerWidget('#App-Header', tmpHeader);

        let tmpContent = blessed.box({
            parent: pScreen,
            top: 1, left: 0, width: '100%', bottom: 1,
            tags: true,
            border: { type: 'line' },
            style: { border: { fg: 'cyan' } },
            padding: { left: 1, right: 1 },
            scrollable: true,
            mouse: true,
        });
        this.terminalUI.registerWidget('#App-Content', tmpContent);

        let tmpStatusBar = blessed.box({
            parent: pScreen,
            bottom: 0, left: 0, width: '100%', height: 1,
            tags: true,
            style: { fg: 'white', bg: 'gray' },
        });
        this.terminalUI.registerWidget('#App-StatusBar', tmpStatusBar);
    }

    _bindKeys(pScreen)
    {
        pScreen.key(['h'], () => { this.navigateTo('Home'); });
        pScreen.key(['d'], () => { this.navigateTo('Detail'); });
    }

    navigateTo(pRoute)
    {
        let tmpViewName = `App-${pRoute}`;
        if (tmpViewName in this.pict.views)
        {
            this.pict.AppData.Status.Route = pRoute;
            this.pict.AppData.Status.Message = `Navigated to ${pRoute}`;
            this.pict.views[tmpViewName].render();
            this.pict.views['App-StatusBar'].render();
        }
    }
}

// Bootstrap
let _Pict = new libPict({ Product: 'MyTUIApp', LogNoisiness: 0 });
let _App = _Pict.addApplication('MyApp', {
    Name: 'MyApp',
    MainViewportViewIdentifier: 'App-Header',
    AutoRenderMainViewportViewAfterInitialize: false,
    AutoSolveAfterInitialize: false,
}, MyApp);

_App.initializeAsync((pError) =>
{
    if (pError) { console.error(pError); process.exit(1); }
});
```

## Anatomy of the Pattern

### 1. ContentAssignment Override

When you create a `PictTerminalUI` instance, it sets custom functions on Pict's `ContentAssignment` service:

| ContentAssignment Method | What Happens |
|--------------------------|--------------|
| `assignContent(address, content)` | Looks up address in widget registry, calls `widget.setContent(content)` |
| `appendContent(address, content)` | Gets existing content, appends new content, sets combined |
| `prependContent(address, content)` | Gets existing content, prepends new content, sets combined |
| `readContent(address)` | Returns `widget.getContent()` |
| `getElement(address)` | Returns `[widget]` if registered, `[]` otherwise |

This is the same override mechanism used by `Pict-Environment-Log` in Pict's test suite, and it works with any Pict view without modification.

### 2. Widget Registration

Blessed widgets are registered by the same address strings that views use in their `ContentDestinationAddress`. This is the mapping layer between Pict's virtual DOM and blessed's real widgets.

```javascript
// In the view configuration
ContentDestinationAddress: '#App-Content'

// In the application setup
terminalUI.registerWidget('#App-Content', blessedBox);
```

### 3. View Lifecycle

The full Pict view lifecycle works normally:

- `onBeforeInitialize` / `onInitialize` / `onAfterInitialize`
- `onBeforeRender` / `onBeforeProject` / `onProject` / `onAfterProject` / `onAfterRender`
- `onBeforeSolve` / `onSolve` / `onAfterSolve`
- `onBeforeMarshalToView` / `onMarshalToView` / `onAfterMarshalToView`
- `onBeforeMarshalFromView` / `onMarshalFromView` / `onAfterMarshalFromView`

You can override any of these in your view classes, just as you would for a browser app.

### 4. Routing

There is no hash-based URL router in the terminal. Instead, routing is done by rendering different views into the same widget address. Bind keyboard shortcuts to trigger navigation.

```javascript
pScreen.key(['1'], () => { this.pict.views['Page-One'].render(); });
pScreen.key(['2'], () => { this.pict.views['Page-Two'].render(); });
```

## Tips

### Blessed Tag Reference

Use these tags in your Pict template strings for formatting:

| Tag | Effect |
|-----|--------|
| `{bold}...{/bold}` | Bold text |
| `{underline}...{/underline}` | Underlined text |
| `{blink}...{/blink}` | Blinking text |
| `{inverse}...{/inverse}` | Inverted colors |
| `{red-fg}...{/red-fg}` | Red foreground |
| `{blue-bg}...{/blue-bg}` | Blue background |
| `{center}...{/center}` | Centered text |

Colors: `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `black`, `gray`.

### Screen Rendering

The terminal UI bridge calls `screen.render()` automatically after each content assignment. If you are doing many assignments in a row and want to batch them, you can call `screen.render()` once at the end yourself.

### Working with Interactive Widgets

For interactive blessed widgets (lists, textboxes, forms), you will need to `focus()` them and handle their events directly. The content assignment bridge handles display content. For input data flow, use the Pict `marshalFromView` / `marshalToView` lifecycle hooks to sync data between `AppData` and widget state.

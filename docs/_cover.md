# Pict Terminal UI

> Standard Pict views rendered to the terminal via blessed

Bridge the Pict MVC framework to blessed terminal widgets. Define views with templates and renderables exactly as you would for the browser, and have them render to a terminal UI instead.

- **Standard Pict Views** -- Use the same view lifecycle, templates, and data binding you already know
- **ContentAssignment Bridge** -- Overrides Pict's content assignment to route renders to blessed widgets
- **Widget Registry** -- Map address strings like `#MyBox` to blessed widgets; views render into them automatically
- **Setulc-Safe Screen** -- Handles the blessed terminfo quirk so your terminal stays clean on startup and exit

[Quick Start](README.md)
[Building an App](building-an-app.md)
[Widget Reference](widgets/box.md)
[GitHub](https://github.com/stevenvelozo/pict-terminalui)

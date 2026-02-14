#!/usr/bin/env node
/**
 * Pict Terminal UI -- Example Application
 *
 * Demonstrates multiple Pict views rendered to blessed terminal widgets
 * with keyboard-driven routing between views.
 *
 * Run:  node example/Example-App.js
 * Quit: Ctrl-C
 * Nav:  H = Home, A = About, S = Settings
 * Settings toggles: 1, 2, 3
 */

// Suppress blessed's Setulc stderr noise before anything loads
const _origStderrWrite = process.stderr.write;
process.stderr.write = function (pChunk)
{
	if (typeof pChunk === 'string' && pChunk.indexOf('Setulc') !== -1)
	{
		return true;
	}
	return _origStderrWrite.apply(process.stderr, arguments);
};

const blessed = require('blessed');
const libPict = require('pict');
const libPictApplication = require('pict-application');

const libPictTerminalUI = require('../source/Pict-TerminalUI.js');

// Views
const libViewLayout = require('./views/PictView-TUI-Layout.js');
const libViewHeader = require('./views/PictView-TUI-Header.js');
const libViewHome = require('./views/PictView-TUI-Home.js');
const libViewAbout = require('./views/PictView-TUI-About.js');
const libViewSettings = require('./views/PictView-TUI-Settings.js');
const libViewStatusBar = require('./views/PictView-TUI-StatusBar.js');

// ─────────────────────────────────────────────
//  Application class
// ─────────────────────────────────────────────
class ExampleTUIApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.terminalUI = null;
		this.currentRoute = 'Home';

		// Add views
		this.pict.addView('TUI-Layout', libViewLayout.default_configuration, libViewLayout);
		this.pict.addView('TUI-Header', libViewHeader.default_configuration, libViewHeader);
		this.pict.addView('TUI-Home', libViewHome.default_configuration, libViewHome);
		this.pict.addView('TUI-About', libViewAbout.default_configuration, libViewAbout);
		this.pict.addView('TUI-Settings', libViewSettings.default_configuration, libViewSettings);
		this.pict.addView('TUI-StatusBar', libViewStatusBar.default_configuration, libViewStatusBar);
	}

	onAfterInitializeAsync(fCallback)
	{
		// Initialize shared application state
		this.pict.AppData.TUI =
		{
			AppName: 'pict-terminalui',
			AppVersion: '0.0.1',
			CurrentRoute: 'Home',
			ViewCount: Object.keys(this.pict.views).length,
			StatusMessage: 'Ready',
			Settings:
			{
				VerboseLogging: false,
				NightMode: false,
				Notifications: true,
				Theme: 'default'
			}
		};

		// Create the terminal UI environment
		this.terminalUI = new libPictTerminalUI(this.pict,
			{
				Title: 'Pict Terminal UI Demo'
			});

		// Create the blessed screen
		let tmpScreen = this.terminalUI.createScreen();

		// Build the blessed widget layout
		this._createBlessedLayout(tmpScreen);

		// Bind navigation keys
		this._bindNavigation(tmpScreen);

		// Render the layout view (which triggers child view renders)
		this.pict.views['TUI-Layout'].render();

		// Do the initial blessed screen render
		tmpScreen.render();

		return super.onAfterInitializeAsync(fCallback);
	}

	/**
	 * Create the blessed widget layout and register widgets with the
	 * terminal UI bridge so that pict view addresses map to widgets.
	 */
	_createBlessedLayout(pScreen)
	{
		// Application container (conceptual -- not rendered to directly)
		let tmpAppContainer = blessed.box(
			{
				parent: pScreen,
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
			});
		this.terminalUI.registerWidget('#TUI-Application-Container', tmpAppContainer);

		// Header bar
		let tmpHeader = blessed.box(
			{
				parent: pScreen,
				top: 0,
				left: 0,
				width: '100%',
				height: 3,
				tags: true,
				style:
				{
					fg: 'white',
					bg: 'blue',
					bold: true,
				},
			});
		this.terminalUI.registerWidget('#TUI-Header', tmpHeader);

		// Main content area
		let tmpContent = blessed.box(
			{
				parent: pScreen,
				top: 3,
				left: 0,
				width: '100%',
				bottom: 1,
				tags: true,
				scrollable: true,
				mouse: true,
				keys: true,
				vi: true,
				scrollbar:
				{
					style: { bg: 'green' },
				},
				border:
				{
					type: 'line',
				},
				style:
				{
					border: { fg: 'cyan' },
				},
				label: ' Home ',
				padding:
				{
					left: 1,
					right: 1,
				},
			});
		this.terminalUI.registerWidget('#TUI-Content', tmpContent);

		// Status bar
		let tmpStatusBar = blessed.box(
			{
				parent: pScreen,
				bottom: 0,
				left: 0,
				width: '100%',
				height: 1,
				tags: true,
				style:
				{
					fg: 'white',
					bg: 'gray',
				},
			});
		this.terminalUI.registerWidget('#TUI-StatusBar', tmpStatusBar);

		// Keep references for later use
		this._contentBox = tmpContent;
	}

	/**
	 * Bind keyboard shortcuts for navigation between views.
	 */
	_bindNavigation(pScreen)
	{
		pScreen.key(['h'], () => { this.navigateTo('Home'); });
		pScreen.key(['a'], () => { this.navigateTo('About'); });
		pScreen.key(['s'], () => { this.navigateTo('Settings'); });

		// Settings toggles (only active when on Settings view)
		pScreen.key(['1'], () => { this._toggleSetting('VerboseLogging'); });
		pScreen.key(['2'], () => { this._toggleSetting('NightMode'); });
		pScreen.key(['3'], () => { this._toggleSetting('Notifications'); });
	}

	/**
	 * Navigate to a named route by re-rendering the appropriate view
	 * into the content area.
	 *
	 * @param {string} pRoute - The route name (Home, About, Settings).
	 */
	navigateTo(pRoute)
	{
		let tmpViewName = `TUI-${pRoute}`;

		if (!(tmpViewName in this.pict.views))
		{
			this.pict.log.warn(`View [${tmpViewName}] not found; staying on current route.`);
			return;
		}

		this.currentRoute = pRoute;
		this.pict.AppData.TUI.CurrentRoute = pRoute;
		this.pict.AppData.TUI.StatusMessage = `Navigated to ${pRoute}`;

		// Update the content box label to reflect the current view
		if (this._contentBox)
		{
			this._contentBox.setLabel(` ${pRoute} `);
		}

		// Render the target view into the content area
		this.pict.views[tmpViewName].render();

		// Re-render the status bar
		this.pict.views['TUI-StatusBar'].render();
	}

	/**
	 * Toggle a boolean setting and re-render the settings view.
	 *
	 * @param {string} pSettingName - The setting key in AppData.TUI.Settings.
	 */
	_toggleSetting(pSettingName)
	{
		if (this.currentRoute !== 'Settings')
		{
			return;
		}

		let tmpSettings = this.pict.AppData.TUI.Settings;
		if (pSettingName in tmpSettings)
		{
			tmpSettings[pSettingName] = !tmpSettings[pSettingName];

			// Update theme based on night mode
			if (pSettingName === 'NightMode')
			{
				tmpSettings.Theme = tmpSettings.NightMode ? 'dark' : 'default';
			}

			this.pict.AppData.TUI.StatusMessage = `Toggled ${pSettingName} to ${tmpSettings[pSettingName]}`;

			// Re-render settings and status bar
			this.pict.views['TUI-Settings'].render();
			this.pict.views['TUI-StatusBar'].render();
		}
	}

	/**
	 * Called by the layout view template to trigger widget creation.
	 * This is a no-op since we create widgets in onAfterInitializeAsync,
	 * but it satisfies the template expression.
	 */
	renderLayoutWidgets()
	{
		return '';
	}
}

// ─────────────────────────────────────────────
//  Bootstrap
// ─────────────────────────────────────────────
let _Pict = new libPict(
	{
		Product: 'PictTerminalUIDemo',
		LogNoisiness: 0,
	});

let _App = _Pict.addApplication('TUI-Demo',
	{
		Name: 'TUI-Demo',
		MainViewportViewIdentifier: 'TUI-Layout',
		AutoRenderMainViewportViewAfterInitialize: false,
		AutoSolveAfterInitialize: false,
	}, ExampleTUIApplication);

_App.initializeAsync(
	(pError) =>
	{
		if (pError)
		{
			console.error('Application initialization failed:', pError);
			process.exit(1);
		}
	});

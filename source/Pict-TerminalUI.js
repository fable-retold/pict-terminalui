/**
 * Pict-TerminalUI
 *
 * A Pict environment that bridges ContentAssignment to blessed terminal widgets.
 *
 * Instead of rendering to the DOM, Pict views render to blessed boxes on a
 * terminal screen.  This module:
 *
 *   1. Creates a setulc-safe blessed screen (same technique as
 *      pict-terminalui-reference/blessedscreen).
 *   2. Overrides ContentAssignment custom functions so that any pict view
 *      render/assign/read call is routed to a named blessed box widget.
 *   3. Provides a simple "widget registry" where address strings (the same
 *      CSS-selector-style strings pict views use) are mapped to blessed
 *      widget objects.
 *
 * Usage:
 *
 *   const libPict = require('pict');
 *   const libPictTerminalUI = require('pict-terminalui');
 *
 *   let _Pict = new libPict({ ... });
 *   let _TerminalUI = new libPictTerminalUI(_Pict);
 *
 *   // Register blessed widgets by address
 *   _TerminalUI.registerWidget('#MyContainer', someBlessedBox);
 *
 *   // Now any view that renders to '#MyContainer' will set the box content.
 */

const blessed = require('blessed');
const libPath = require('path');

class PictTerminalUI
{
	constructor(pPict, pOptions)
	{
		this.pict = pPict;
		this.options = Object.assign(
			{
				Title: 'Pict Terminal Application',
				FullUnicode: true,
				SmartCSR: true,
			}, pOptions);

		// Registry of address -> blessed widget
		this.widgets = {};

		// The blessed screen
		this.screen = null;

		// Guard hook -- return true to block quit
		this.onBeforeQuit = null;

		// Wire up content assignment overrides
		this.pict.ContentAssignment.customAssignFunction = this._assignContent.bind(this);
		this.pict.ContentAssignment.customAppendFunction = this._appendContent.bind(this);
		this.pict.ContentAssignment.customPrependFunction = this._prependContent.bind(this);
		this.pict.ContentAssignment.customReadFunction = this._readContent.bind(this);
		this.pict.ContentAssignment.customGetElementFunction = this._getElement.bind(this);
	}

	/**
	 * Create the blessed screen.  Uses the bundled terminfo to avoid
	 * the Setulc parse error that blessed's terminfo compiler chokes on.
	 */
	createScreen()
	{
		const blessedTerminfoFile = libPath.resolve(
			libPath.dirname(require.resolve('blessed')),
			'..', 'usr', 'xterm-256color'
		);

		const prog = blessed.program(
			{
				terminal: blessedTerminfoFile,
				forceUnicode: this.options.FullUnicode,
			});

		this.screen = blessed.screen(
			{
				program: prog,
				smartCSR: this.options.SmartCSR,
				title: this.options.Title,
				fullUnicode: this.options.FullUnicode,
			});

		this._bindQuit();

		return this.screen;
	}

	/**
	 * Destroy the blessed screen and exit.
	 */
	destroyScreen()
	{
		if (this.screen)
		{
			this.screen.destroy();
		}
		process.exit(0);
	}

	_bindQuit()
	{
		this.screen.key(['C-c'], () =>
		{
			if (typeof this.onBeforeQuit === 'function' && this.onBeforeQuit())
			{
				return;
			}
			this.destroyScreen();
		});
	}

	/**
	 * Register a blessed widget for a given address string.
	 *
	 * @param {string} pAddress - The address (e.g. '#MyContainer').
	 * @param {object} pWidget - A blessed widget (box, text, log, etc.).
	 */
	registerWidget(pAddress, pWidget)
	{
		this.widgets[pAddress] = pWidget;
	}

	/**
	 * Unregister a widget.
	 *
	 * @param {string} pAddress - The address to unregister.
	 */
	unregisterWidget(pAddress)
	{
		delete this.widgets[pAddress];
	}

	/**
	 * Get the blessed widget for an address, or null if not registered.
	 *
	 * @param {string} pAddress - The address to look up.
	 * @returns {object|null}
	 */
	getWidget(pAddress)
	{
		return this.widgets[pAddress] || null;
	}

	/**
	 * Render the screen (call after content changes).
	 */
	render()
	{
		if (this.screen)
		{
			this.screen.render();
		}
	}

	// ─────────────────────────────────────────────
	//  ContentAssignment overrides
	// ─────────────────────────────────────────────

	_assignContent(pAddress, pContent)
	{
		let tmpWidget = this.getWidget(pAddress);
		if (tmpWidget)
		{
			tmpWidget.setContent(String(pContent));
			this.render();
		}
		else
		{
			this.pict.log.trace(`PictTerminalUI ASSIGN to [${pAddress}] -- no widget registered`);
		}
	}

	_appendContent(pAddress, pContent)
	{
		let tmpWidget = this.getWidget(pAddress);
		if (tmpWidget)
		{
			let tmpExisting = tmpWidget.getContent() || '';
			tmpWidget.setContent(tmpExisting + String(pContent));
			this.render();
		}
		else
		{
			this.pict.log.trace(`PictTerminalUI APPEND to [${pAddress}] -- no widget registered`);
		}
	}

	_prependContent(pAddress, pContent)
	{
		let tmpWidget = this.getWidget(pAddress);
		if (tmpWidget)
		{
			let tmpExisting = tmpWidget.getContent() || '';
			tmpWidget.setContent(String(pContent) + tmpExisting);
			this.render();
		}
		else
		{
			this.pict.log.trace(`PictTerminalUI PREPEND to [${pAddress}] -- no widget registered`);
		}
	}

	_readContent(pAddress)
	{
		let tmpWidget = this.getWidget(pAddress);
		if (tmpWidget)
		{
			return tmpWidget.getContent() || '';
		}
		this.pict.log.trace(`PictTerminalUI READ from [${pAddress}] -- no widget registered`);
		return '';
	}

	_getElement(pAddress)
	{
		let tmpWidget = this.getWidget(pAddress);
		if (tmpWidget)
		{
			return [tmpWidget];
		}
		return [];
	}
}

module.exports = PictTerminalUI;
module.exports.default = PictTerminalUI;

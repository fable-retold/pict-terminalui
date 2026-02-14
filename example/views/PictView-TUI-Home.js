const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: 'TUI-Home',

	DefaultRenderable: 'TUI-Home-Content',
	DefaultDestinationAddress: '#TUI-Content',
	DefaultTemplateRecordAddress: 'AppData.TUI',

	AutoRender: false,

	Templates:
	[
		{
			Hash: 'TUI-Home-Template',
			Template: [
				'{bold}Welcome to Pict Terminal UI{/bold}',
				'',
				'This application demonstrates how standard Pict views',
				'and templates can render to a blessed terminal interface.',
				'',
				'The Pict ContentAssignment service has been overridden',
				'so that view rendering targets blessed widgets instead',
				'of DOM elements.',
				'',
				'{bold}Features:{/bold}',
				'  * Standard Pict views with templates and renderables',
				'  * Multiple views with keyboard-driven navigation',
				'  * AppData shared across views via Pict data provider',
				'  * Same view lifecycle (init, render, solve, marshal)',
				'',
				'{yellow-fg}Current route: {/yellow-fg}{~D:Record.CurrentRoute~}',
				'{yellow-fg}View count: {/yellow-fg}{~D:Record.ViewCount~}',
			].join('\n')
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'TUI-Home-Content',
			TemplateHash: 'TUI-Home-Template',
			ContentDestinationAddress: '#TUI-Content',
			RenderMethod: 'replace'
		}
	]
};

class TUIHomeView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = TUIHomeView;
module.exports.default_configuration = _ViewConfiguration;

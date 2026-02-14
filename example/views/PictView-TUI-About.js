const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: 'TUI-About',

	DefaultRenderable: 'TUI-About-Content',
	DefaultDestinationAddress: '#TUI-Content',
	DefaultTemplateRecordAddress: 'AppData.TUI',

	AutoRender: false,

	Templates:
	[
		{
			Hash: 'TUI-About-Template',
			Template: [
				'{bold}About Pict Terminal UI{/bold}',
				'',
				'{underline}Architecture{/underline}',
				'',
				'Pict-TerminalUI bridges the Pict MVC framework to the',
				'blessed terminal rendering library.  It works by',
				'overriding the customAssignFunction (and friends) on',
				"Pict's ContentAssignment service.",
				'',
				'When a Pict view calls render(), its template is parsed',
				'normally by the Pict template engine.  The resulting',
				'content string is then routed to a blessed widget',
				'instead of a DOM element.',
				'',
				'{underline}How It Works{/underline}',
				'',
				'1. Create a Pict instance',
				'2. Create a PictTerminalUI instance (wires overrides)',
				'3. Create a blessed screen via PictTerminalUI',
				'4. Register blessed widgets by address string',
				'5. Define standard Pict views with templates',
				'6. View renders flow to blessed widgets automatically',
				'',
				'{yellow-fg}Application: {/yellow-fg}{~D:Record.AppName~}',
				'{yellow-fg}Version: {/yellow-fg}{~D:Record.AppVersion~}',
			].join('\n')
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'TUI-About-Content',
			TemplateHash: 'TUI-About-Template',
			ContentDestinationAddress: '#TUI-Content',
			RenderMethod: 'replace'
		}
	]
};

class TUIAboutView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = TUIAboutView;
module.exports.default_configuration = _ViewConfiguration;

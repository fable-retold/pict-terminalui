const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: 'TUI-Header',

	DefaultRenderable: 'TUI-Header-Content',
	DefaultDestinationAddress: '#TUI-Header',
	DefaultTemplateRecordAddress: 'AppData.TUI',

	AutoRender: false,

	Templates:
	[
		{
			Hash: 'TUI-Header-Template',
			Template: '{center}{bold}Pict Terminal UI Demo{/bold}{/center}\n{center}[H]ome  [A]bout  [S]ettings  [Ctrl-C] Quit{/center}'
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'TUI-Header-Content',
			TemplateHash: 'TUI-Header-Template',
			ContentDestinationAddress: '#TUI-Header',
			RenderMethod: 'replace'
		}
	]
};

class TUIHeaderView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = TUIHeaderView;
module.exports.default_configuration = _ViewConfiguration;

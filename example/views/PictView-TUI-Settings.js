const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: 'TUI-Settings',

	DefaultRenderable: 'TUI-Settings-Content',
	DefaultDestinationAddress: '#TUI-Content',
	DefaultTemplateRecordAddress: 'AppData.TUI.Settings',

	AutoRender: false,

	Templates:
	[
		{
			Hash: 'TUI-Settings-Template',
			Template: [
				'{bold}Settings{/bold}',
				'',
				'Use these keyboard shortcuts to toggle settings:',
				'',
				'  [1] Toggle verbose logging: {~D:Record.VerboseLogging~}',
				'  [2] Toggle night mode:      {~D:Record.NightMode~}',
				'  [3] Toggle notifications:   {~D:Record.Notifications~}',
				'',
				'{underline}Current Configuration{/underline}',
				'',
				'  Verbose Logging:  {~D:Record.VerboseLogging~}',
				'  Night Mode:       {~D:Record.NightMode~}',
				'  Notifications:    {~D:Record.Notifications~}',
				'  Theme:            {~D:Record.Theme~}',
				'',
				'{gray-fg}Press a number key to toggle a setting.{/gray-fg}',
			].join('\n')
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'TUI-Settings-Content',
			TemplateHash: 'TUI-Settings-Template',
			ContentDestinationAddress: '#TUI-Content',
			RenderMethod: 'replace'
		}
	]
};

class TUISettingsView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = TUISettingsView;
module.exports.default_configuration = _ViewConfiguration;

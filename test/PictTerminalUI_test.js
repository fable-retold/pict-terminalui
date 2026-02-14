const libChai = require('chai');
const libExpect = libChai.expect;

const libPict = require('pict');
const libPictView = require('pict-view');

const libPictTerminalUI = require('../source/Pict-TerminalUI.js');

suite
(
	'Pict-TerminalUI',
	() =>
	{
		suite
		(
			'Widget Registry',
			() =>
			{
				test
				(
					'Register and retrieve widgets',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						// Create a mock widget
						let tmpWidget = { content: '', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#TestBox', tmpWidget);

						libExpect(_TerminalUI.getWidget('#TestBox')).to.equal(tmpWidget);
						libExpect(_TerminalUI.getWidget('#NonExistent')).to.be.null;

						_TerminalUI.unregisterWidget('#TestBox');
						libExpect(_TerminalUI.getWidget('#TestBox')).to.be.null;

						return fDone();
					}
				);
			}
		);

		suite
		(
			'Content Assignment Override',
			() =>
			{
				test
				(
					'Assign content to a registered widget via Pict ContentAssignment',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: '', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#MyBox', tmpWidget);

						// Use Pict's ContentAssignment directly
						_Pict.ContentAssignment.assignContent('#MyBox', 'Hello Terminal!');

						libExpect(tmpWidget.content).to.equal('Hello Terminal!');

						return fDone();
					}
				);

				test
				(
					'Append content to a registered widget',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: 'First', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#AppendBox', tmpWidget);

						_Pict.ContentAssignment.appendContent('#AppendBox', ' Second');

						libExpect(tmpWidget.content).to.equal('First Second');

						return fDone();
					}
				);

				test
				(
					'Prepend content to a registered widget',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: 'Second', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#PrependBox', tmpWidget);

						_Pict.ContentAssignment.prependContent('#PrependBox', 'First ');

						libExpect(tmpWidget.content).to.equal('First Second');

						return fDone();
					}
				);

				test
				(
					'Read content from a registered widget',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: 'ReadMe', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#ReadBox', tmpWidget);

						let tmpContent = _Pict.ContentAssignment.readContent('#ReadBox');

						libExpect(tmpContent).to.equal('ReadMe');

						return fDone();
					}
				);

				test
				(
					'Get element returns array with widget when registered',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: '', setContent: function () {}, getContent: function () { return ''; } };

						_TerminalUI.registerWidget('#GetBox', tmpWidget);

						let tmpElements = _Pict.ContentAssignment.getElement('#GetBox');

						libExpect(tmpElements).to.be.an('array');
						libExpect(tmpElements.length).to.equal(1);
						libExpect(tmpElements[0]).to.equal(tmpWidget);

						return fDone();
					}
				);

				test
				(
					'Get element returns empty array when widget not registered',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpElements = _Pict.ContentAssignment.getElement('#Missing');

						libExpect(tmpElements).to.be.an('array');
						libExpect(tmpElements.length).to.equal(0);

						return fDone();
					}
				);

				test
				(
					'Assign to unregistered widget does not throw',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						// Should not throw
						_Pict.ContentAssignment.assignContent('#Nowhere', 'content');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'View Rendering',
			() =>
			{
				test
				(
					'Render a Pict view into a registered widget',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: '', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#ViewTarget', tmpWidget);

						// Set up app data
						_Pict.AppData.Greeting = { Message: 'Hello from the TUI!' };

						// Create a view configuration
						let tmpViewConfig =
						{
							ViewIdentifier: 'Test-View',
							DefaultRenderable: 'Test-Renderable',
							DefaultDestinationAddress: '#ViewTarget',
							DefaultTemplateRecordAddress: 'AppData.Greeting',

							AutoRender: false,
							AutoInitialize: false,

							Templates:
							[
								{
									Hash: 'Test-Template',
									Template: 'Message: {~D:Record.Message~}'
								}
							],

							Renderables:
							[
								{
									RenderableHash: 'Test-Renderable',
									TemplateHash: 'Test-Template',
									ContentDestinationAddress: '#ViewTarget',
									RenderMethod: 'replace'
								}
							]
						};

						let _View = _Pict.addView('Test-View', tmpViewConfig, libPictView);
						_View.render();

						libExpect(tmpWidget.content).to.equal('Message: Hello from the TUI!');

						return fDone();
					}
				);

				test
				(
					'Re-render view after data change reflects new data',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: '', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#DataTarget', tmpWidget);

						_Pict.AppData.Counter = { Value: 1 };

						let tmpViewConfig =
						{
							ViewIdentifier: 'Counter-View',
							DefaultRenderable: 'Counter-Renderable',
							DefaultDestinationAddress: '#DataTarget',
							DefaultTemplateRecordAddress: 'AppData.Counter',

							AutoRender: false,
							AutoInitialize: false,

							Templates:
							[
								{
									Hash: 'Counter-Template',
									Template: 'Count: {~D:Record.Value~}'
								}
							],

							Renderables:
							[
								{
									RenderableHash: 'Counter-Renderable',
									TemplateHash: 'Counter-Template',
									ContentDestinationAddress: '#DataTarget',
									RenderMethod: 'replace'
								}
							]
						};

						let _View = _Pict.addView('Counter-View', tmpViewConfig, libPictView);

						_View.render();
						libExpect(tmpWidget.content).to.equal('Count: 1');

						// Change data and re-render
						_Pict.AppData.Counter.Value = 42;
						_View.render();
						libExpect(tmpWidget.content).to.equal('Count: 42');

						return fDone();
					}
				);

				test
				(
					'Multiple views rendering to different widgets',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpHeaderWidget = { content: '', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };
						let tmpContentWidget = { content: '', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#Header', tmpHeaderWidget);
						_TerminalUI.registerWidget('#Content', tmpContentWidget);

						let tmpHeaderConfig =
						{
							ViewIdentifier: 'Multi-Header',
							DefaultRenderable: 'Header-Renderable',
							DefaultDestinationAddress: '#Header',
							AutoRender: false,
							AutoInitialize: false,
							Templates: [{ Hash: 'Header-T', Template: 'HEADER' }],
							Renderables: [{ RenderableHash: 'Header-Renderable', TemplateHash: 'Header-T', ContentDestinationAddress: '#Header', RenderMethod: 'replace' }]
						};

						let tmpContentConfig =
						{
							ViewIdentifier: 'Multi-Content',
							DefaultRenderable: 'Content-Renderable',
							DefaultDestinationAddress: '#Content',
							AutoRender: false,
							AutoInitialize: false,
							Templates: [{ Hash: 'Content-T', Template: 'CONTENT' }],
							Renderables: [{ RenderableHash: 'Content-Renderable', TemplateHash: 'Content-T', ContentDestinationAddress: '#Content', RenderMethod: 'replace' }]
						};

						let _HeaderView = _Pict.addView('Multi-Header', tmpHeaderConfig, libPictView);
						let _ContentView = _Pict.addView('Multi-Content', tmpContentConfig, libPictView);

						_HeaderView.render();
						_ContentView.render();

						libExpect(tmpHeaderWidget.content).to.equal('HEADER');
						libExpect(tmpContentWidget.content).to.equal('CONTENT');

						return fDone();
					}
				);

				test
				(
					'View routing: render different views to the same widget',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: '', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#RouterTarget', tmpWidget);

						let tmpHomeConfig =
						{
							ViewIdentifier: 'Route-Home',
							DefaultRenderable: 'Home-R',
							DefaultDestinationAddress: '#RouterTarget',
							AutoRender: false,
							AutoInitialize: false,
							Templates: [{ Hash: 'Home-RT', Template: 'Home Page' }],
							Renderables: [{ RenderableHash: 'Home-R', TemplateHash: 'Home-RT', ContentDestinationAddress: '#RouterTarget', RenderMethod: 'replace' }]
						};

						let tmpAboutConfig =
						{
							ViewIdentifier: 'Route-About',
							DefaultRenderable: 'About-R',
							DefaultDestinationAddress: '#RouterTarget',
							AutoRender: false,
							AutoInitialize: false,
							Templates: [{ Hash: 'About-RT', Template: 'About Page' }],
							Renderables: [{ RenderableHash: 'About-R', TemplateHash: 'About-RT', ContentDestinationAddress: '#RouterTarget', RenderMethod: 'replace' }]
						};

						let _HomeView = _Pict.addView('Route-Home', tmpHomeConfig, libPictView);
						let _AboutView = _Pict.addView('Route-About', tmpAboutConfig, libPictView);

						// Simulate routing: render Home first
						_HomeView.render();
						libExpect(tmpWidget.content).to.equal('Home Page');

						// Navigate to About
						_AboutView.render();
						libExpect(tmpWidget.content).to.equal('About Page');

						// Navigate back to Home
						_HomeView.render();
						libExpect(tmpWidget.content).to.equal('Home Page');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'ProjectContent Integration',
			() =>
			{
				test
				(
					'projectContent with replace method works',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: 'old', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#ProjectBox', tmpWidget);

						_Pict.ContentAssignment.projectContent('replace', '#ProjectBox', 'new content');

						libExpect(tmpWidget.content).to.equal('new content');

						return fDone();
					}
				);

				test
				(
					'projectContent with append method works',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						let tmpWidget = { content: 'start', setContent: function (pContent) { this.content = pContent; }, getContent: function () { return this.content; } };

						_TerminalUI.registerWidget('#AppendProjectBox', tmpWidget);

						_Pict.ContentAssignment.projectContent('append', '#AppendProjectBox', ' end');

						libExpect(tmpWidget.content).to.equal('start end');

						return fDone();
					}
				);

				test
				(
					'projectContent with virtual-assignment stores in manifest',
					(fDone) =>
					{
						let _Pict = new libPict({ Product: 'TerminalUI-Test', LogNoisiness: 0 });
						let _TerminalUI = new libPictTerminalUI(_Pict);

						_Pict.ContentAssignment.projectContent('virtual-assignment', 'VirtualKey', 'virtual content');

						// Virtual assignments go to the manifest, not a widget
						let tmpValue = _Pict.ContentAssignment.manifest.getValueByHash(_Pict, 'VirtualKey');
						libExpect(tmpValue).to.equal('virtual content');

						return fDone();
					}
				);
			}
		);
	}
);

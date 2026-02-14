# Radio Button

A mutually exclusive selection option. When one radio button in a group is selected, all others in the same parent (RadioSet or Form) are automatically deselected.

## Creating Radio Buttons

Radio buttons must be placed inside a RadioSet (or Form) container for the mutual exclusion to work.

```javascript
let tmpRadioSet = blessed.radioset({
    parent: pScreen,
    top: 3,
    left: 2,
    width: 30,
    height: 5,
});

let tmpSmall = blessed.radiobutton({
    parent: tmpRadioSet,
    top: 0,
    left: 0,
    content: 'Small',
    mouse: true,
});

let tmpMedium = blessed.radiobutton({
    parent: tmpRadioSet,
    top: 1,
    left: 0,
    content: 'Medium',
    checked: true,
    mouse: true,
});

let tmpLarge = blessed.radiobutton({
    parent: tmpRadioSet,
    top: 2,
    left: 0,
    content: 'Large',
    mouse: true,
});

terminalUI.registerWidget('#SizeRadioSet', tmpRadioSet);
```

## RadioSet Options

RadioSet is a container with no special options beyond [Box](box.md).

## RadioButton Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | String | | Label text displayed after the radio indicator |
| `checked` | Boolean | `false` | Initial selected state |
| `mouse` | Boolean | `false` | Enable mouse selection |

## Methods

Same as [Checkbox](checkbox.md):

| Method | Description |
|--------|-------------|
| `check()` | Select this radio button (deselects others in group) |
| `uncheck()` | Deselect this radio button |
| `toggle()` | Toggle selection |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `checked` | Boolean | Whether this option is selected |
| `value` | Boolean | Same as `checked` |

## Events

| Event | Description |
|-------|-------------|
| `check` | This radio button was selected |
| `uncheck` | This radio button was deselected |

## Display

```
(*) Small
( ) Medium
( ) Large
```

## Usage with Pict

```javascript
let tmpRadioSet = blessed.radioset({
    parent: pScreen, top: 4, left: 2, width: 30, height: 4,
});

let tmpSizes = ['Small', 'Medium', 'Large'];
let tmpRadios = {};

tmpSizes.forEach((pSize, pIndex) =>
{
    let tmpRadio = blessed.radiobutton({
        parent: tmpRadioSet,
        top: pIndex, left: 0,
        content: pSize,
        mouse: true,
        checked: pIndex === 1,
    });

    tmpRadio.on('check', () =>
    {
        _Pict.AppData.Order.Size = pSize;
        _Pict.views['OrderSummary'].render();
    });

    tmpRadios[pSize] = tmpRadio;
});
```

## Pict View Template

Show the current selection in a summary view.

```javascript
Templates: [{
    Hash: 'Order-Summary-Template',
    Template: [
        '{bold}Order Summary{/bold}',
        '',
        'Selected size: {yellow-fg}{~D:Record.Size~}{/yellow-fg}',
    ].join('\n')
}],
Renderables: [{
    RenderableHash: 'Order-Summary',
    TemplateHash: 'Order-Summary-Template',
    ContentDestinationAddress: '#OrderSummary',
    RenderMethod: 'replace'
}]
```

## Inside a Form

Radio buttons also work inside a Form container, which provides Tab navigation.

```javascript
let tmpForm = blessed.form({ parent: pScreen, keys: true });

let tmpRadioSet = blessed.radioset({ parent: tmpForm, top: 0, left: 0, width: 30, height: 4 });

blessed.radiobutton({ parent: tmpRadioSet, top: 0, content: 'Option A', mouse: true, checked: true });
blessed.radiobutton({ parent: tmpRadioSet, top: 1, content: 'Option B', mouse: true });
blessed.radiobutton({ parent: tmpRadioSet, top: 2, content: 'Option C', mouse: true });

tmpForm.on('submit', (pData) =>
{
    // pData contains the checked state of each named child
});
```

See [Form](form.md) for details.

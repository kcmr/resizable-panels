# resizable-panels

`<resizable-panels>` allows to resize the width (default) or the height (vertical mode) of the component childrens.

Example:

```html
    <resizable-panels>
      <div>Lorem ipsum dolor…</div>
      <div>Second panel</div>
      <div>Third panel</div>
    </resizable-panels>
```
Vertical mode:

```html
    <resizable-panels vertical>
      <div>Lorem ipsum dolor…</div>
      <div>Second panel</div>
      <div>Third panel</div>
    </resizable-panels>
```

## Styling

The following custom CSS properties are available for styling:

| Custom property                | Description                             | Default     |
|:-------------------------------|:----------------------------------------|------------:|
| --resizable-panels-knob-size   | width (default) or height of the knobs  | 4px         |
| --resizable-panels-knob-color  | background color of the knobs           | transparent |
| --resizable-panels-knob        | Mixin applied to the knob               | {}          |

## Install

Install the component using [Bower](http://bower.io/):

```bash
$ bower i -S kcmr/resizable-panels
```

## Usage

Import Web Components polyfill:

```js
<script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
```

Import Custom Element:

```html
<link rel="import" href="bower_components/resizable-panels/resizable-panels.html"> 
```

Use it!

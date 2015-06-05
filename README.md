# mintParallax.js
视差效果组件，通过陀螺仪或光标位置实现。

### Demo

![Demo](http://chart.apis.google.com/chart?cht=qr&chs=200x200&chl=http%3A//cople.github.io/mintParallax.js/&chld=H|0)
[Demo](http://cople.github.io/mintParallax.js/)

### Usage

```js
var mp = new mintParallax("#demo");
```

### Options

```html
<div id="demo"
     data-x-range="true"   /* optional, number */
     data-y-range="true"   /* optional, number */
     data-invert-x="false" /* optional, boolean */
     data-invert-y="false" /* optional, boolean */
>
    <img src="fragment1.png" data-depth="0.0" /* required, 0.0 ~ 1.0 */ >
    <img src="fragment2.png" data-depth="0.2">
    <img src="fragment3.png" data-depth="0.4">
    <img src="fragment4.png" data-depth="0.6">
    <img src="fragment5.png" data-depth="0.8">
    <img src="fragment6.png" data-depth="1.0">
</div>
```

### Methods

```js
mp.enable();
mp.disable();
```
<div align="center">
  <h1>
    <img width="150" src="./ukiyo-icon.svg" alt="Ukiyo.js">
    <br>
    Ukiyo.js
  </h1>
  <p>Modern parallax library for picture elements and any images</p>
  <p>
    <img src="https://img.shields.io/bundlephobia/minzip/ukiyojs">
    <img src="https://img.shields.io/github/license/yitengjun/ukiyojs">
  </p>
  <p>
    <a href="https://yitengjun.github.io/ukiyo-js/" target="_blank">
    ⛰️<br>
    <b>DEMO</b></a>
  </p>
</div>
<br>

## Installation
You can install the library via npm/yarn:
```sh
npm install ukiyojs
```
```sh
yarn add ukiyojs
```

or via CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/ukiyojs@4.0.9/dist/ukiyo.min.js"></script>
```

Import Ukiyo.js:
```javascript
import Ukiyo from "ukiyojs";
```

## Usage
### HTML
Give the element you want to parallax a cool name in order to call it in JavaScript.
#### 🏞 ```<img>```
```html
<img class="ukiyo" src="image.jpg">
```
#### 🏞 ```<picture>```
```html
<picture>
  <source srcset="~">
  <img class="ukiyo" src="image.jpg">
<picture>
```
```picture``` tag element is also supported: set the parallax to the ```img``` tag inside the picture tag.
#### 📺 ```<video>```
```html
<video class="ukiyo" src="~" type="~">
```
#### 🖼️ Using ```background-image```
```html
<div class="ukiyo"></div>
```
> Don't forget the styling of ```background-image``` on element.

### JavaScript
To instantiate Ukiyo, the first argument should specify the element to be parallaxed.
```javascript
// CSS selector
new Ukiyo(".ukiyo")

// or node
const images = document.querySelectorAll(".ukiyo")
new Ukiyo(images)

// or HTMLCollection
const images = document.getElementsByClassName('ukiyo');
new simpleParallax(images);
```
You are now ready to go.

## Options

| Option | Type | Default | Description | 
| - | - | - | - |
| ```scale``` | ```number``` | ```1.5``` | Parallax image scaling factor. | 
| ```speed``` | ```number```  | ```1.5``` | Parallax speed. | 
| ```willChange``` | ```boolean``` | ```false``` | If true, the element will be given a ```will-change: transform``` when Parallax is active. | 
| ```wrapperClass``` | ```string```  | ```null``` | Class name of the automatically generated wrapper element. | 
| ```externalRAF``` | ```boolean```  | ```false``` | Use external requestAnimationFrame | 

These configurations can be made with the following JavaScript code:
```javascript
const parallax = document.querySelector('.image')

new Ukiyo(parallax, {
    scale: 1.5, // 1~2 is recommended
    speed: 1.5, // 1~2 is recommended
    willChange: true, // This may not be valid in all cases
    wrapperClass: "ukiyo-wrapper",
    externalRAF: false
})
```

### Element Options
These options can be individually set for an element using the ```data-u-*``` attribute, as shown in the following example:
```html
<img
  data-u-scale="2"
  data-u-speed="1.7"
  data-u-wrapper-class="wrapper-name"
  data-u-willchange
>
```
| Attribute | Values | Description |
| - | - | - |
| ```data-u-scale``` | ```number``` | ```scale``` option. |
| ```data-u-speed``` | ```number``` | ```speed``` option. |
| ```data-u-willchange``` |  | ```willChange``` option. Simply attach it to the element to make it valid. |
| ```data-u-wrapper-class``` | string | ```wrapperClass``` option. |
|  |  |  |

> Option names start with ```data-u-*```. Don't forget to prefix the option name with a "**u**", if u do.

### Using external requestAnimationFrame
By default, parallax animations are automatically depicted in a ```requestAnimationFrame```, but animations can also be called in an external ```requestAnimationFrame```.

```javascript
const parallax = new Ukiyo(".ukiyo", {
  externalRAF: true
})

function raf(time) {
  // animate parallax
  parallax.animate()

  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
```
To enable the ```externalRAF``` option, call the animation with the ```animate()``` method in the ```requestAnimationFrame``` process.

## Methods
### ```reset()```
To reset the instance and recalculate the size and position of the elements, you can use the following code:

```javascript
const instance = new Ukiyo(".image")

instance.reset()
```

### ```destroy()```
Destroy instance:
```javascript
const instance = new Ukiyo(".image")

instance.destroy()
```

## Browser Support
| IE         | Edge   | Firefox | Chrome | Opera  | Safari | iOS Safari | 
| ---------- | ------ | ------- | ------ | ------ | ------ | ---------- | 
| ❌No Support | ✅Latest | ✅Latest  | ✅Latest | ✅Latest | ✅Latest | ✅Latest     | 

> Parallax animation is automatically disabled on browsers that do not support it.

## License
[MIT License](https://github.com/yitengjun/ukiyojs/blob/main/LICENSE)

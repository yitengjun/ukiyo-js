<div align="center">
  <h1>
    <img width="180" src="./ukiyo-icon.svg" alt="Ukiyo.js">
    <br>
    Ukiyo.js
  </h1>
  <p>Dynamic, modern, and efficient background parallax effect.</p>
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

## ⛰️ Features
- 🏞️ Background parallax for ```<img>```, ```<picture>```, ```<video>``` and ```background-image```
- 🚀 Efficient and dynamic animations
- 📚 No dependencies
- 📝 TypeScript support

<br />

## 📦 Installation
Install ```ukiyojs``` using your package manager of choice.
```sh
# npm
npm install ukiyojs

# yarn
yarn add ukiyojs

# pnpm
pnpm add ukiyojs
```

Import Ukiyo:
```javascript
import Ukiyo from "ukiyojs";
```
---
or import via CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/ukiyojs@4.1.2/dist/ukiyo.min.js"></script>
```

<br />

## 🕹️ Usage
### HTML
Give the elements cool names like *ukiyo* to call them in scripts for parallax effects.

- #### 🏞 ```<img>```
```html
<img class="ukiyo" src="image.jpg">
```

- 🌅 __```<picture>```__
```html
<picture>
  <source srcset="~">
  <!-- give a name to img element inside picture element. -->
  <img class="ukiyo" src="image.jpg">
<picture>
```

- 🎬 __```<video>```__
```html
<video class="ukiyo" src="~" type="~">
```

- 🖼️ CSS __```background-image```__
```html
<div class="ukiyo"></div>
```

---

### JavaScript
Instantiate Ukiyo with the cool name you gave to the element as the first argument. The element selection supports the following types:
```javascript
// CSS selector
new Ukiyo(".ukiyo")

// or node
const images = document.querySelectorAll(".ukiyo")
new Ukiyo(images)

// or HTMLCollection
const images = document.getElementsByClassName('ukiyo');
new Ukiyo(images);
```
There you go, all set! Now let's see it in action.

<br />

## ⚙️ Options
### Instance Options
```javascript
const parallax = document.querySelector('.image')

new Ukiyo(parallax, {
    scale: 1.5, // 1~2 is recommended
    speed: 1.5, // 1~2 is recommended
    willChange: true,
    wrapperClass: "ukiyo-wrapper",
    externalRAF: false
})
```

| Option | Type | Default | Description | 
| - | - | - | - |
| ```scale``` | ```number``` | ```1.5``` | Parallax image scaling factor. | 
| ```speed``` | ```number```  | ```1.5``` | Parallax speed. | 
| ```willChange``` | ```boolean``` | ```false``` | When true is specified, the elements will receive will-change: transform when Parallax is active. | 
| ```wrapperClass``` | ```string```  | ```null``` | Set any class name to the automatically generated wrapper element. | 
| ```externalRAF``` | ```boolean```  | ```false``` | Set it to true if you want to use an external requestAnimationFrame. | 

---

### Element attributes
Additionally, you can individually set these options for elements using the ```data-u-*``` attribute, like this:
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
| ```data-u-willchange``` |  | ```willChange``` option. Just add this to the element to enable it. |
| ```data-u-wrapper-class``` | ```string``` | ```wrapperClass``` option. |
|  |  |  |

> Option names start with ```data-u-*```. Don't forget to prefix the option name with a ```u```, if *u* do.

---

### 🚀 Using external requestAnimationFrame
By default, parallax animation is automatically rendered using the library's ```requestAnimationFrame```, but you can use an external ```requestAnimationFrame``` to run the animation.

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
Enable the ```externalRAF``` option, and then call the ```animate()``` method within your custom ```requestAnimationFrame``` to trigger the parallax animation.

<br />

## 🔧 Methods
- #### ```reset()```
To reset the instance and recalculate the size and position of the elements, use the following code:

```javascript
const instance = new Ukiyo(".image")

instance.reset()
```

- #### ```destroy()```
Destroy instance:
```javascript
const instance = new Ukiyo(".image")

instance.destroy()
```

<br />

## 📍Notes
<details>
<summary>🚧 When using Lenis in combination</summary>

- As of July 2023, we have identified a bug in Safari when using it in conjunction with [Lenis](https://github.com/studio-freight/lenis), which causes parallax effects to become distorted during scrolling. This issue is due to a bug in Safari itself. To address this bug, you may need to apply styles like ```pointer-events: none;``` to the parallax elements, preventing scroll events from affecting them. However, please be cautious as this may disable interaction events for those elements.

  - https://github.com/studio-freight/lenis/issues/187
</details>

<br />

## 🖥️ Browser Support
| IE         | Edge   | Firefox | Chrome | Opera  | Safari | iOS Safari | 
| ---------- | ------ | ------- | ------ | ------ | ------ | ---------- | 
| ❌No Support | ✅Latest | ✅Latest  | ✅Latest | ✅Latest | ✅Latest | ✅Latest     | 

> Parallax animations are automatically disabled in browsers that do not support them.

<br />

## 🏕️ Examples
How is Ukiyo being used? 👀

- [UKIYO](https://ukiyo-js.dev) - from [@yitengjun](https://github.com/yitengjun)
- [YTNG - Portfolio](https://ytng.dev) - from [@yitengjun](https://github.com/yitengjun)

<br />

## 📃 License
[MIT License](https://github.com/yitengjun/ukiyojs/blob/main/LICENSE)

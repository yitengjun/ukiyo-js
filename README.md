<div align="center">
  <h1>
    <img width="125" src="./ukiyo.png" alt="">
    <br>
    Ukiyo.js</h1>
  Simple and lightweight JavaScript library for background parallax,<br>with support for picture/img elements.
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
``` html
<script src="ukiyo.min.js"></script>
```

## Usage  
### HTML
Give the element you want to parallax a cool name to call it in JavaScript.
#### ```<img>``` tag
```html
<img class="ukiyo" src="image.jpg">
```

#### ```<picture>``` tag
```html
<picture>
  <source srcset="img.webp" type="image/webp">
  <img class="ukiyo" src="img.png" alt="">
<picture>
```
```picture``` tag element is also supported: set the parallax to the ```img``` tag inside the picture tag.

#### Other Element
```html
<div class="ukiyo"></div>
```
> Don't forget to set the ```background-image``` to the style when you set it in the img tag element.

### JavaScript
```javascript
const image = document.querySelector('.ukiyo');

new Ukiyo(image)
```
You are now ready to go.

> If you want to apply it to more than one element, you need to loop through them as follows:
```javascript
const images = document.querySelectorAll(".ukiyo");
// You can do the loop in any way you like.
images.forEach(image => {
  new Ukiyo(image, {
    speed: 2,
    scale: 1.25
  });
});
```

## Options

| Option       | Type    | Default | Description                                                                            | 
| ------------ | ------- | ------- | -------------------------------------------------------------------------------------- | 
| ```scale```        | ```number```  | ```1.5```     | Parallax image scaling factor.                                                          | 
| ```speed```        | ```number```  | ```1.5```     | Parallax speed.                                                                         | 
| ```willChange```   | ```boolean``` | ```false```   | If true, the element will be given a ```will-change: transform``` when Parallax is active. | 
| ```wrapperClass``` | ```string```  | ```null```    | Class name of the automatically generated wrapper element.                              | 

These can be configured with the following JS code:
```javascript
const parallax = document.querySelector('.image');

new BgParallax(parallax, {
    scale: 1.5, // 1~2 is recommended
    speed: 1.5, // 1~2 is recommended
    willChange: true, // This may not be valid in all cases
    wrapperClass: "ukiyo-wrapper"
})
```

### Element Options
```html
<img
data-u-scale="2"
data-u-speed="1.7"
data-u-wrapper-class="wrapper-name"
data-u-willchange
>
```
You can set options directly on the element.
When setting these options for an element, prefix them with **```data-u-```**.

- ```data-u-scale```
- ```data-u-speed```
- ```data-u-willchange``` Simply attach it to the element to make it valid.
- ```data-u-wrapper-class```
> Option names start with ```data-u-```. Don't forget to prefix the option name with a "**u**", if u do.

## Methods
### ```reset()```
Reset the instance and recalculate the size and position of the elements etc :

```javascript
const image = document.querySelector('.image');
const instance = new Ukiyo(image);

instance.reset();
```

### ```destroy()```
Destroy instance:
```javascript
const image = document.querySelector('.image');
const instance = new Ukiyo(image);

instance.destroy();
```

## Browser Support
| IE         | Edge   | Firefox | Chrome | Opera  | Safari | iOS Safari | 
| ---------- | ------ | ------- | ------ | ------ | ------ | ---------- | 
| ❌No Support | ✅Latest | ✅Latest  | ✅Latest | ✅Latest | ✅Latest | ✅Latest     | 

To support older browsers such as IE, you will need to use the Intersection Observer API, ```Promise``` and ```closest``` polyfills.
If you use ```img``` tag, you will also need to use the ```object-fit``` polyfill.

> However, please note that even with polyfill, the Parallax animation does not run smoothly in IE.

## License
MIT License

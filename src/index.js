import { isImageLoaded, browserCheck } from './utils';

export default class Ukiyo {
  /**
   * @constructor
   * @param {HTMLElement} element - Target element
   * @param {object} options - Options of ukiyo.js
   */
  constructor(element, options = {}) {
    if (!element || !browserCheck()) return;

    const defaults = {
      scale: 1.5,
      speed: 1.5,
      wrapperClass: null,
      willChange: false
    };
    const elementOptionScale = element.getAttribute('data-u-scale');
    const elementOptionSpeed = element.getAttribute('data-u-speed');
    const elementOptionWillChange = element.getAttribute('data-u-willchange');

    this.element = element;
    this.wrapper = document.createElement('div');

    this.options = { ...defaults, ...options };
    if (elementOptionScale !== null) this.options.scale = elementOptionScale;
    if (elementOptionSpeed !== null) this.options.speed = elementOptionSpeed;
    if (elementOptionWillChange !== null) this.options.willChange = true;

    this.isIMGtag = this.element.tagName.toLowerCase() === 'img';
    this.overflow = null;
    this.observer = null;
    this.requestId = null;
    this.timer = null;
    this.reset = this.reset.bind(this);

    this.isInit = false;

    if (this.isIMGtag) {
      const path = this.element.getAttribute('src');
      isImageLoaded(path).then((res) => {
        this._init();
      });
    } else {
      this._init();
    }
  }

  /**
   * Initialization
   */
  _init() {
    if (this.isInit) return;

    this._setupElements();
    this._observer();
    this._addEvent();

    this.isInit = true;
  }

  /**
   * Element and option settings
   */
  _setupElements() {
    // Set CSS style for the element
    this._setStyles(true);

    const elementOptionWrapperClass = this.element.getAttribute('data-u-wrapper-class');
    if (this.options.wrapperClass || elementOptionWrapperClass) {
      const customClass = elementOptionWrapperClass ? elementOptionWrapperClass : this.options.wrapperClass;
      this.wrapper.classList.add(customClass);
    }

    // Wrapping an element by adding a wrapper element
    const pictureTag = this.element.closest('picture');
    if (pictureTag !== null) {
      pictureTag.parentNode.insertBefore(this.wrapper, pictureTag);
      this.wrapper.appendChild(pictureTag);
    } else {
      this.element.parentNode.insertBefore(this.wrapper, this.element);
      this.wrapper.appendChild(this.element);
    }
  }

  /**
   * Setting CSS styles for an element
   * @param  {boolean} init - Enable the default style
   */
  _setStyles(init) {
    const elementHeight = this.element.clientHeight;
    const elementWidth = this.element.clientWidth;
    const elementStyle = document.defaultView.getComputedStyle(this.element);
    const isPositionAbsolute = elementStyle.position === 'absolute';

    // Difference between the height of the element and the wrapper
    this.overflow = elementHeight - elementHeight * this.options.scale;

    if (elementStyle.position === 'absolute' && elementStyle.marginRight !== '0px' && elementStyle.marginLeft !== '0px' && elementStyle.marginLeft === elementStyle.marginRight) {
      this.wrapper.style.margin = 'auto';
    }

    if (elementStyle.marginTop !== '0px' || elementStyle.marginBottom !== '0px') {
      this.wrapper.style.marginTop = elementStyle.marginTop;
      this.wrapper.style.marginBottom = elementStyle.marginBottom;
      this.element.style.marginTop = '0';
      this.element.style.marginBottom = '0';
    }

    if (elementStyle.inset !== 'auto') {
      this.wrapper.style.top = elementStyle.top;
      this.wrapper.style.right = elementStyle.right;
      this.wrapper.style.bottom = elementStyle.bottom;
      this.wrapper.style.left = elementStyle.left;
      this.element.style.top = '0';
      this.element.style.right = '0';
      this.element.style.bottom = '0';
      this.element.style.left = '0';
    }

    if (elementStyle.transform !== 'none') this.wrapper.style.transform = elementStyle.transform;

    if (elementStyle.zIndex !== 'auto') this.wrapper.style.zIndex = elementStyle.zIndex;

    if (isPositionAbsolute) {
      this.wrapper.style.position = 'absolute';
    } else {
      this.wrapper.style.position = 'relative';
    }

    // Initial style settings
    if (init) {
      this.wrapper.style.width = '100%';
      this.wrapper.style.overflow = 'hidden';
      this.element.style.display = 'block';
      this.element.style.overflow = 'hidden';
      this.element.style.backfaceVisibility = 'hidden';

      if (elementStyle.padding !== '0px') {
        this.element.style.padding = '0';
      }

      if (this.isIMGtag) {
        this.element.style.objectFit = 'cover';
      } else {
        this.element.style.backgroundPosition = 'center';
      }
    }

    if (isPositionAbsolute) {
      this.wrapper.style.width = elementWidth + 'px';
      this.element.style.width = '100%';
    }
    if (elementStyle.maxHeight !== 'none') {
      this.wrapper.style.maxHeight = elementStyle.maxHeight;
      this.element.style.maxHeight = 'none';
    }
    if (elementStyle.minHeight !== '0px') {
      this.wrapper.style.minHeight = elementStyle.minHeight;
      this.element.style.minHeight = 'none';
    }

    this.wrapper.style.height = elementHeight + 'px';
    this.element.style.height = elementHeight * this.options.scale + 'px';
  }

  /**
   * Observe the element
   */
  _observer() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver(this._observerCallback.bind(this), options);
    this.observer.observe(this.wrapper);
  }

  /**
   * IntersectionObserver callback
   * @param {object} entries - IntersectionObserverEntry
   */
  _observerCallback(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Is visible
        this.isVisible = true;
        this._update();
      } else {
        // Is not visible
        this.isVisible = false;
        this._cancel();
      }
    });
  }

  /**
   * Animate the update of the image position
   */
  _update() {
    this._setPosition();

    this.requestId = window.requestAnimationFrame(this._update.bind(this));
  }

  /**
   * Set the parallax value to an element
   */
  _setPosition() {
    if (this.options.willChange && this.element.style.willChange !== 'transform') {
      this.element.style.willChange = 'transform';
    }

    this.element.style.transform = `translate3d(0 , ${this._getTranslate()}px , 0)`;
  }

  /**
   * Calculating the value of parallax
   * @return {number} Parallax value
   */
  _getTranslate() {
    const overflow = Math.abs(this.overflow);
    const progress = this._getProgress() / 100;
    const translateY = this.overflow + overflow * progress * this.options.speed;

    return Math.round(translateY);
  }

  /**
   * Get the percentage of an element's position relative to the viewport
   * @return {number} The percentage of the element's position in the viewport
   */
  _getProgress() {
    const viewportHeight = window.innerHeight;
    const elementHeight = this.wrapper.offsetHeight;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const elementOffsetTop = this.wrapper.getBoundingClientRect().top + scrollTop;

    const distance = scrollTop + viewportHeight - elementOffsetTop;
    const percentage = distance / ((viewportHeight + elementHeight) / 100);

    return Math.min(100, Math.max(0, percentage));
  }

  /**
   * Cancel animation
   */
  _cancel() {
    if (!this.requestId) return;

    if (this.options.willChange) this.element.style.willChange = 'auto';

    window.cancelAnimationFrame(this.requestId);
  }

  /**
   * Add event
   */
  _addEvent() {
    // Resize Event
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)) {
      window.addEventListener('orientationchange', this.resize.bind(this));
    } else {
      window.addEventListener('resize', this.resize.bind(this));
    }
  }

  /**
   * Resize
   */
  resize() {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.reset, 450);
  }

  /**
   * Reset
   */
  reset() {
    this.wrapper.style.height = '';
    this.wrapper.style.width = '';
    this.wrapper.style.position = '';
    this.element.style.height = '';
    this.element.style.width = '';

    if (this.wrapper.style.margin !== '0px') {
      this.wrapper.style.margin = '';
      this.element.style.margin = '';
    }

    if (this.wrapper.style.inset !== 'auto') {
      this.wrapper.style.top = '';
      this.wrapper.style.right = '';
      this.wrapper.style.bottom = '';
      this.wrapper.style.left = '';
      this.element.style.top = '';
      this.element.style.right = '';
      this.element.style.bottom = '';
      this.element.style.left = '';
    }

    if (this.wrapper.style.transform !== 'none') {
      this.wrapper.style.transform = '';
      this.element.style.transform = '';
    }

    if (this.wrapper.style.zIndex !== 'auto') {
      this.wrapper.style.zIndex = '';
    }

    this._setStyles();
    this._setPosition();
  }

  /**
   * Destroy instance
   */
  destroy() {
    this._cancel();
    this.observer.disconnect();

    this.wrapper.removeAttribute('style');
    this.element.removeAttribute('style');

    this.wrapper.replaceWith(...this.wrapper.childNodes);

    this.isInit = false;
  }
}

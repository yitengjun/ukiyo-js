import type { UkiyoOptions } from '../types/index';
import { isImageLoaded, isSPSafari } from './utils';
import { defaults } from './options';

/**
 * Parallax class
 */
export class Parallax {
  private options: UkiyoOptions;
  private element: HTMLElement;
  private wrapper: HTMLElement;
  private overflow?: number;
  private vh: number;
  private observer?: IntersectionObserver;
  private isVisible: boolean;
  private overflowAbs?: number;
  private wrapperHeight?: number;
  private damp: number;
  private elementTagName: string;

  constructor(element: HTMLElement, options: Partial<UkiyoOptions>) {
    this.element = element;
    this.wrapper = document.createElement('div');

    this.options = { ...defaults, ...options };
    this.updateOptions();

    this.vh = document.documentElement.clientHeight;
    this.isVisible = false;
    this.damp = this.calcDamp(document.documentElement.clientWidth);

    this.elementTagName = this.element.tagName.toLowerCase();

    if (this.elementTagName === 'img') {
      const path: string | null = this.element.getAttribute('src');

      if (!path) return;
      isImageLoaded(path).then(() => {
        this.createParallax();
      });
    } else {
      this.createParallax();
    }
  }

  /**
   * Create Parallax
   */
  private createParallax(): void {
    this.setStyle(true);
    this.wrapElement();

    if (!isSPSafari()) {
      this.createObserver();
    }
  }

  /**
   * Update options
   */
  private updateOptions(): void {
    const elementOptionScale = this.element.getAttribute('data-u-scale');
    const elementOptionSpeed = this.element.getAttribute('data-u-speed');
    const elementOptionWillChange =
      this.element.getAttribute('data-u-willchange');

    if (elementOptionScale !== null)
      this.options.scale = Number(elementOptionScale);
    if (elementOptionSpeed !== null)
      this.options.speed = Number(elementOptionSpeed);
    if (elementOptionWillChange !== null) this.options.willChange = true;
  }

  /**
   * Sets the style of an element
   */
  private setStyle(onInit = false): void {
    const elementHeight = this.element.clientHeight;
    const elementWidth = this.element.clientWidth;
    const style = window.getComputedStyle(this.element);
    const isPositionAbsolute = style.position === 'absolute';
    const wrapperStyle = this.wrapper.style;
    const elementStyle = this.element.style;

    // Difference between the height of the element and the wrapper
    this.overflow =
      Math.floor((elementHeight - elementHeight * this.options.scale) * 10) /
      10;
    this.overflowAbs = Math.abs(this.overflow);

    // When using both margin: auto and position: absolute
    if (
      isPositionAbsolute &&
      style.marginRight !== '0px' &&
      style.marginLeft !== '0px' &&
      style.marginLeft === style.marginRight
    ) {
      wrapperStyle.margin = 'auto';
    }

    if (style.marginTop !== '0px' || style.marginBottom !== '0px') {
      wrapperStyle.marginTop = style.marginTop;
      wrapperStyle.marginBottom = style.marginBottom;
      elementStyle.marginTop = '0';
      elementStyle.marginBottom = '0';
    }

    if (style.inset !== 'auto') {
      wrapperStyle.top = style.top;
      wrapperStyle.right = style.right;
      wrapperStyle.bottom = style.bottom;
      wrapperStyle.left = style.left;
      elementStyle.top = '0';
      elementStyle.right = '0';
      elementStyle.bottom = '0';
      elementStyle.left = '0';
    }

    if (style.transform !== 'none') wrapperStyle.transform = style.transform;

    if (style.zIndex !== 'auto') wrapperStyle.zIndex = style.zIndex;

    if (isPositionAbsolute) {
      wrapperStyle.position = 'absolute';
    } else {
      wrapperStyle.position = 'relative';
    }

    const hasGrid =
      style.gridArea !== 'auto' &&
      style.gridArea !== 'auto / auto / auto / auto';
    if (hasGrid) {
      wrapperStyle.gridArea = style.gridArea;
      elementStyle.gridArea = 'auto';
    }

    // Initial style settings
    if (onInit) {
      wrapperStyle.width = '100%';
      wrapperStyle.overflow = 'hidden';
      elementStyle.display = 'block';
      elementStyle.overflow = 'hidden';
      elementStyle.backfaceVisibility = 'hidden';

      if (style.padding !== '0px') {
        elementStyle.padding = '0';
      }

      if (this.elementTagName === 'img') {
        elementStyle.objectFit = 'cover';
      } else if (this.elementTagName !== 'video') {
        elementStyle.backgroundPosition = 'center';
      }
    }

    if (style.borderRadius !== '0px') {
      wrapperStyle.borderRadius = style.borderRadius;

      if (!wrapperStyle.isolation) {
        wrapperStyle.isolation = 'isolate';
      }

      if (style.marginLeft !== '0px') {
        wrapperStyle.marginLeft = style.marginLeft;
        elementStyle.marginLeft = '0';
      }
      if (style.marginRight !== '0px') {
        wrapperStyle.marginRight = style.marginRight;
        elementStyle.marginRight = '0';
      }

      wrapperStyle.width = elementWidth + 'px';
    }

    if (isPositionAbsolute) {
      wrapperStyle.width = elementWidth + 'px';
      elementStyle.width = '100%';
    }

    if (style.maxHeight !== 'none') {
      wrapperStyle.maxHeight = style.maxHeight;
      elementStyle.maxHeight = 'none';
    }
    if (style.minHeight !== '0px') {
      wrapperStyle.minHeight = style.minHeight;
      elementStyle.minHeight = 'none';
    }

    elementStyle.width = elementWidth + 'px';

    wrapperStyle.setProperty('height', elementHeight + 'px', 'important');
    elementStyle.setProperty(
      'height',
      elementHeight * this.options.scale + 'px',
      'important',
    );

    this.wrapperHeight = elementHeight;
  }

  /**
   * Wrap element
   */
  private wrapElement(): void {
    const elementOptionWrapperClass: string | null | undefined =
      this.element.getAttribute('data-u-wrapper-class');
    const customClass: string | null =
      elementOptionWrapperClass || this.options.wrapperClass;

    if (customClass) {
      this.wrapper.classList.add(customClass);
    }

    const pictureTag: HTMLElement | null = this.element.closest('picture');

    if (pictureTag !== null) {
      if (pictureTag.parentNode !== null) {
        pictureTag.parentNode.insertBefore(this.wrapper, pictureTag);
      }
      this.wrapper.appendChild(pictureTag);
    } else {
      const parent = this.element.parentNode;
      if (parent !== null) {
        parent.insertBefore(this.wrapper, this.element);
      }
      this.wrapper.appendChild(this.element);
    }
  }

  /**
   * Check visible
   */
  private checkVisible(): void {
    const rect = this.wrapper.getBoundingClientRect();
    const isInView = 0 < rect.bottom && rect.top < this.vh;
    if (isInView) {
      this.onEnter();
    } else {
      this.onLeave();
    }
  }

  /**
   * Create Observer
   */
  private createObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    this.observer = new IntersectionObserver(
      this.handleIntersect.bind(this),
      options,
    );
    this.observer.observe(this.wrapper);
  }

  /**
   * Observer callback
   */
  private handleIntersect(entry: IntersectionObserverEntry[]): void {
    if (entry[0].isIntersecting) {
      this.onEnter();
    } else {
      this.onLeave();
    }
  }

  /**
   * OnEnter
   */
  private onEnter(): void {
    const elementStyle = this.element.style;
    if (this.options.willChange && elementStyle.willChange !== 'transform') {
      elementStyle.willChange = 'transform';
    }
    this.isVisible = true;
  }

  /**
   * OnLeave
   */
  private onLeave(): void {
    const elementStyle = this.element.style;
    if (this.options.willChange && elementStyle.willChange === 'transform') {
      elementStyle.willChange = '';
    }
    this.isVisible = false;
  }

  /**
   * Calculating the value of parallax
   */
  private calcTranslateValue(): number {
    let scrollTop = window.pageYOffset;
    if (scrollTop < 0) scrollTop = 0;

    const elementOffsetTop =
      this.wrapper.getBoundingClientRect().top + scrollTop;
    const distance = scrollTop + this.vh - elementOffsetTop;
    const percentageDistance =
      distance / ((this.vh + this.wrapperHeight!) / 100);
    const percentage = Math.min(100, Math.max(0, percentageDistance)) / 100;

    const translateValue =
      this.overflow! +
      this.overflowAbs! * percentage * this.options.speed * this.damp;

    return Number(translateValue.toFixed(4));
  }

  /**
   * Calculate parallax damp
   */
  private calcDamp(screenSize: number): number {
    const max = 1;
    const min = 0.5;
    let scale = this.options.scale;
    let speed = this.options.speed;

    if ((speed >= 1.4 || scale >= 1.4) && screenSize <= 1000) {
      if (scale < 1) scale = 1;
      if (speed < 1) speed = 1;

      const defaultSpeedScale = 3;
      const offset = 0.2;
      const SpeedScale = defaultSpeedScale - (scale + speed);

      const screenSizeFactor = 1 - (screenSize / 1000 + SpeedScale);
      const offsetFactor = 1 + offset - screenSizeFactor;
      const constrainedFactor = Math.max(min, Math.min(max, offsetFactor));

      return Math.floor(constrainedFactor * 100) / 100;
    } else {
      return max;
    }
  }

  /**
   * Set the parallax value to element
   */
  private transformParallax(): void {
    this.element.style.transform = `translate3d(0 , ${this.calcTranslateValue()}px , 0)`;
  }

  /**
   * Animate parallax
   */
  public animate(): void {
    if (isSPSafari()) {
      this.checkVisible();
    }

    if (window.pageYOffset < 0) return;
    if (!this.isVisible) return;

    this.transformParallax();
  }

  /**
   * Reset parallax
   */
  public reset(): void {
    this.damp = this.calcDamp(window.innerWidth);

    const wrapperStyle = this.wrapper.style;
    const elementStyle = this.element.style;

    this.vh = document.documentElement.clientHeight;
    wrapperStyle.width = '';
    wrapperStyle.position = '';
    wrapperStyle.height = '100%';
    elementStyle.width = '';

    if (this.elementTagName === 'img' && wrapperStyle.position === 'absolute') {
      wrapperStyle.height = '100%';
    }

    if (wrapperStyle.gridArea === '') {
      elementStyle.height = '';
    } else {
      elementStyle.height = '100%';
    }

    if (wrapperStyle.margin !== '0px') {
      wrapperStyle.margin = '';
      elementStyle.margin = '';
    }

    if (wrapperStyle.inset !== 'auto') {
      wrapperStyle.top = '';
      wrapperStyle.right = '';
      wrapperStyle.bottom = '';
      wrapperStyle.left = '';
      elementStyle.top = '';
      elementStyle.right = '';
      elementStyle.bottom = '';
      elementStyle.left = '';
    }

    if (wrapperStyle.transform !== 'none') {
      wrapperStyle.transform = '';
      elementStyle.transform = '';
    }

    if (wrapperStyle.zIndex !== 'auto') {
      wrapperStyle.zIndex = '';
    }

    if (wrapperStyle.borderRadius !== '0px') {
      wrapperStyle.borderRadius = '';
      wrapperStyle.isolation = '';
    }

    this.setStyle();
    this.transformParallax();
  }

  /**
   * Destroy instance
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.wrapper.removeAttribute('style');
    this.element.removeAttribute('style');

    this.wrapper.replaceWith(...this.wrapper.childNodes);
  }
}

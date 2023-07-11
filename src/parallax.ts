import type { UkiyoOptions } from './types.ts';
import { isImageLoaded, isSPSafari } from './utils.ts';
import { defaults } from './options.ts';

/**
 * Parallax class
 */
export class Parallax {
  readonly options: UkiyoOptions;

  private element: HTMLElement;

  private wrapper: HTMLElement;

  private overflow?: number;

  private vh: number;

  private observer?: IntersectionObserver;

  private isVisible: boolean;

  private wrapperHeight?: number;

  private damp: number;

  private elementTagName: string;

  constructor(element: HTMLElement, options?: UkiyoOptions) {
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
   * Update options based on element attributes
   */
  private updateOptions(): void {
    const scaleAttributeValue = this.element.getAttribute('data-u-scale');
    const speedAttributeValue = this.element.getAttribute('data-u-speed');
    const willChangeAttributeValue = this.element.getAttribute('data-u-willchange');

    if (scaleAttributeValue !== null) {
      this.options.scale = Number(scaleAttributeValue);
    }

    if (speedAttributeValue !== null) {
      this.options.speed = Number(speedAttributeValue);
    }

    if (willChangeAttributeValue !== null) {
      this.options.willChange = true;
    }
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
    this.overflow = Math.floor((elementHeight - elementHeight * this.options.scale!) * 10) / 10;

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

    const hasGrid = style.gridArea !== 'auto' && style.gridArea !== 'auto / auto / auto / auto';
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

      wrapperStyle.width = `${elementWidth}px`;
    }

    if (isPositionAbsolute) {
      wrapperStyle.width = `${elementWidth}px`;
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

    elementStyle.width = `${elementWidth}px`;

    wrapperStyle.setProperty('height', `${elementHeight}px`, 'important');
    elementStyle.setProperty('height', `${elementHeight * this.options.scale!}px`, 'important');

    this.wrapperHeight = elementHeight;
  }

  /**
   * Wrap the element by adding a wrapper container
   */
  private wrapElement(): void {
    const dataWrapperClass = this.element.getAttribute('data-u-wrapper-class');
    const wrapperClass = dataWrapperClass || this.options.wrapperClass;

    if (wrapperClass) {
      this.wrapper.classList.add(wrapperClass);
    }

    const pictureElement = this.element.closest('picture');
    const targetElement = pictureElement !== null ? pictureElement : this.element;
    const parentElement = targetElement.parentNode;

    if (parentElement !== null) {
      parentElement.insertBefore(this.wrapper, targetElement);
    }

    this.wrapper.appendChild(targetElement);
  }

  /**
   * Check visibility of the element
   */
  private checkVisible(): void {
    const rect = this.wrapper.getBoundingClientRect();
    const isInView = rect.bottom > 0 && rect.top < window.innerHeight;

    if (isInView) {
      this.onEnter();
    } else {
      this.onLeave();
    }
  }

  /**
   * Create IntersectionObserver
   */
  private createObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const intersectionCallback: IntersectionObserverCallback = (
      entry: IntersectionObserverEntry[],
    ) => {
      if (entry[0].isIntersecting) {
        this.onEnter();
      } else {
        this.onLeave();
      }
    };

    this.observer = new IntersectionObserver(intersectionCallback, options);
    this.observer.observe(this.wrapper);
  }

  private onEnter(): void {
    const elementStyle = this.element.style;
    const willChangeValue = 'transform';

    if (this.options.willChange && elementStyle.willChange !== willChangeValue) {
      elementStyle.willChange = willChangeValue;
    }
    this.isVisible = true;
  }

  private onLeave(): void {
    const { element, options } = this;
    const { willChange } = options;

    if (willChange && element.style.willChange === 'transform') {
      element.style.willChange = '';
    }

    this.isVisible = false;
  }

  /**
   * Calculating the value of parallax
   */
  private calcTranslateValue(): number {
    let scrollYOffset = window.pageYOffset;
    if (scrollYOffset < 0) {
      scrollYOffset = 0;
    }

    const wrapperTopOffset = this.wrapper.getBoundingClientRect().top + scrollYOffset;
    const scrollDistance = scrollYOffset + this.vh - wrapperTopOffset;
    const scrollDistancePercentage = scrollDistance / ((this.vh + this.wrapperHeight!) / 100);
    const scrollPercentage = Math.min(100, Math.max(0, scrollDistancePercentage)) / 100;

    const speedDifference = (this.overflow! * this.options.speed! - this.overflow!) / 2;
    const translateValue =
      this.overflow! * (1 - scrollPercentage) * this.options.speed! * this.damp - speedDifference;

    return Number(translateValue.toFixed(4));
  }

  /**
   * Calculate parallax damp
   */
  private calcDamp(screenSize: number): number {
    const MAX_DAMP = 1;
    const MIN_DAMP = 0.5;
    const SCREEN_SIZE_THRESHOLD = 1000;
    const PARALLAX_SCALE_THRESHOLD = 1.4;
    const PARALLAX_SPEED_THRESHOLD = 1.4;

    let parallaxScale = this.options.scale!;
    let parallaxSpeed = this.options.speed!;

    const isParallaxThresholdReached =
      parallaxSpeed >= PARALLAX_SPEED_THRESHOLD || parallaxScale >= PARALLAX_SCALE_THRESHOLD;
    const isScreenSizeThresholdReached = screenSize <= SCREEN_SIZE_THRESHOLD;

    if (!isParallaxThresholdReached || !isScreenSizeThresholdReached) {
      return MAX_DAMP;
    }

    if (parallaxScale < 1) parallaxScale = 1;
    if (parallaxSpeed < 1) parallaxSpeed = 1;

    const DEFAULT_SPEED_SCALE = 3;
    const DAMP_OFFSET = 0.2;

    const speedScaleFactor = DEFAULT_SPEED_SCALE - (parallaxScale + parallaxSpeed);
    const screenSizeFactorOffset = 1 - (screenSize / 1000 + speedScaleFactor);
    const dampOffsetFactor = 1 + DAMP_OFFSET - screenSizeFactorOffset;
    const constrainedDampFactor = Math.max(MIN_DAMP, Math.min(MAX_DAMP, dampOffsetFactor));
    const roundedDampValue = Math.floor(constrainedDampFactor * 100) / 100;

    return roundedDampValue;
  }

  /**
   * Apply parallax transformation to the element
   */
  private applyParallax(): void {
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

    this.applyParallax();
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
    this.applyParallax();
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

import { isSupportedBrowser, getElements } from './utils.ts';
import { Parallax } from './parallax.ts';
import type { UkiyoOptions, TElement } from './types.ts';

export default class Ukiyo {
  readonly elements: HTMLElement[] = [];

  readonly options?: UkiyoOptions;

  private instances: Parallax[];

  readonly externalRAF: boolean;

  private requestId?: number;

  private timer?: number;

  readonly onResizeEvent: EventListenerOrEventListenerObject;

  private isInit: boolean;

  constructor(elements: TElement | null, options?: UkiyoOptions) {
    if (!elements) {
      throw new Error(`Argument 'elements' cannot be null.`);
    }

    this.elements = getElements(elements);
    this.options = options;

    this.instances = [];
    this.externalRAF = (this.options && this.options.externalRAF) || false;
    this.onResizeEvent = this.resize.bind(this);
    this.isInit = false;

    if (!isSupportedBrowser()) return;

    this.init();
  }

  /**
   * Initializes
   */
  private init(): void {
    if (this.isInit) return;

    // Create parallax
    this.instances = this.elements.map(
      (element: HTMLElement) => new Parallax(element, this.options),
    );

    if (!this.externalRAF) {
      this.animate();
    }

    this.addEventListeners();

    this.isInit = true;
  }

  /**
   * Animation
   */
  public animate(): void {
    this.instances.forEach((instance) => {
      instance.animate();
    });

    if (!this.externalRAF) {
      this.requestId = window.requestAnimationFrame(this.animate.bind(this));
    }
  }

  /**
   * Cancel animation
   */
  private cancel(): void {
    if (this.requestId) {
      window.cancelAnimationFrame(this.requestId);
    }
  }

  /**
   * Reset all instances
   */
  public reset(): void {
    this.instances.forEach((instance) => {
      instance.reset();
    });
  }

  /**
   * Resize event
   */
  private resize(): void {
    clearTimeout(this.timer);

    this.timer = window.setTimeout(this.reset.bind(this), 500);
    this.reset.bind(this);
  }

  /**
   * Add event listeners
   */
  private addEventListeners(): void {
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)) {
      window.addEventListener('orientationchange', this.onResizeEvent);
    } else {
      window.addEventListener('resize', this.onResizeEvent);
    }
  }

  /**
   * Destroy all instances
   */
  public destroy(): void {
    this.cancel();

    window.removeEventListener('resize', this.onResizeEvent);
    window.removeEventListener('orientationchange', this.onResizeEvent);

    this.instances.forEach((instance) => {
      instance.destroy();
    });

    this.isInit = false;
  }
}

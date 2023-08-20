import { isSupportedBrowser, getElements } from './utils.ts';
import { Parallax } from './parallax.ts';
import type { UkiyoOptions, TElement } from './types.ts';

export default class Ukiyo {
  private instances: Parallax[];

  readonly externalRAF: boolean;

  private requestId?: number;

  private timer?: number;

  readonly onResizeEvent: EventListenerOrEventListenerObject;

  constructor(elements: TElement | null, options?: UkiyoOptions) {
    if (!elements) {
      throw new Error(`Argument 'elements' cannot be null.`);
    }

    this.instances = [];
    this.externalRAF = (options && options.externalRAF) || false;
    this.onResizeEvent = this.resize.bind(this);

    if (isSupportedBrowser()) {
      this.init(getElements(elements), options);
    }
  }

  /**
   * Initializes
   */
  private init(elements: HTMLElement[], options?: UkiyoOptions): void {
    // Create parallax
    this.instances = elements.map((element: HTMLElement) => new Parallax(element, options));

    if (!this.externalRAF) {
      this.animate();
    }

    // Add event listeners
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)) {
      window.addEventListener('orientationchange', this.onResizeEvent);
    } else {
      window.addEventListener('resize', this.onResizeEvent);
    }
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
   * Destroy all instances
   */
  public destroy(): void {
    if (this.requestId) {
      window.cancelAnimationFrame(this.requestId);
    }

    window.removeEventListener('resize', this.onResizeEvent);
    window.removeEventListener('orientationchange', this.onResizeEvent);

    this.instances.forEach((instance) => {
      instance.destroy();
    });
  }
}

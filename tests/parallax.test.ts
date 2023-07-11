import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import Ukiyo from '../src/index';
import { Parallax } from '../src/parallax';
import { defaults } from '../src/options';

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

describe('Ukiyo', () => {
  const totalElements = 3;

  beforeEach(() => {
    for (let i = 0; i < totalElements; i++) {
      const div = document.createElement('div');
      div.classList.add('ukiyo');
      document.body.appendChild(div);
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should throw an error if elements argument is null', () => {
      expect(() => {
        new Ukiyo(null);
      }).toThrow("Argument 'elements' cannot be null.");
    });

    it('should test the externalRAF property of the Ukiyo class when creating instances', () => {
      document.body.innerHTML = `
  <div id="default"></div>
  <div id="withExternalRAF"></div>
  `;
      const ukiyoDefault = new Ukiyo('#default');
      const ukiyoWithExternalRAF = new Ukiyo('#withExternalRAF', {
        externalRAF: true,
      });

      expect(ukiyoDefault.externalRAF).toEqual(false);
      expect(ukiyoWithExternalRAF.externalRAF).toEqual(true);
    });
  });

  describe('animate', () => {
    it('should call animate method for each instance', () => {
      const parallaxMock = vi.spyOn(Parallax.prototype, 'animate');
      new Ukiyo('.ukiyo');

      expect(parallaxMock).toHaveBeenCalledTimes(totalElements);
    });

    it('should request animation frame if externalRAF is false', () => {
      const requestAnimationFrameMock = vi.spyOn(window, 'requestAnimationFrame');
      new Ukiyo('.ukiyo', {
        externalRAF: false,
      });

      expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    });

    it('should not request animation frame if externalRAF is true', () => {
      const requestAnimationFrameMock = vi.spyOn(window, 'requestAnimationFrame');
      new Ukiyo('.ukiyo', {
        externalRAF: true,
      });

      expect(requestAnimationFrameMock).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should call reset method for each instance', () => {
      const resetMock = vi.spyOn(Parallax.prototype, 'reset');
      const ukiyo = new Ukiyo('.ukiyo');

      ukiyo.reset();

      expect(resetMock).toHaveBeenCalledTimes(totalElements);
    });
  });

  describe('addEventListeners', () => {
    it('should add resize event listener for non-mobile devices', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      new Ukiyo('.ukiyo');

      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    });
    it('should add orientationchange event listener for mobile devices', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const userAgentMock = 'iPhone';
      Object.defineProperty(navigator, 'userAgent', { value: userAgentMock });

      new Ukiyo('.ukiyo');

      expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
    });
  });

  describe('destroy', () => {
    it('should call cancel, remove event listeners, and destroy each instance', () => {
      const removeEventListenerMock = vi.spyOn(window, 'removeEventListener');
      const destroyMock = vi.spyOn(Parallax.prototype, 'destroy');

      const ukiyo = new Ukiyo('.ukiyo');
      ukiyo.destroy();

      expect(removeEventListenerMock).toHaveBeenCalledTimes(2);
      expect(removeEventListenerMock).toHaveBeenCalledWith('resize', ukiyo.onResizeEvent);
      expect(removeEventListenerMock).toHaveBeenCalledWith(
        'orientationchange',
        ukiyo.onResizeEvent,
      );
      expect(destroyMock).toHaveBeenCalledTimes(totalElements);
    });
  });
});
describe('Parallax', () => {
  describe('options', () => {
    const prefix = 'data-u-';

    it('should have default options', () => {
      const target = document.createElement('div');
      const ukiyo = new Parallax(target);
      expect(ukiyo.options.speed).toEqual(defaults.speed);
      expect(ukiyo.options.scale).toEqual(defaults.scale);
      expect(ukiyo.options.wrapperClass).toEqual(defaults.wrapperClass);
      expect(ukiyo.options.willChange).toEqual(defaults.willChange);
    });

    it('should apply custom speed from attribute', () => {
      const customSpeed = 2;
      const target = document.createElement('div');
      target.setAttribute(`${prefix}speed`, `${customSpeed}`);
      const parallax = new Parallax(target);
      expect(parallax.options.speed).toEqual(customSpeed);
    });

    it('should apply custom scale from attribute', () => {
      const customScale = 2;
      const target = document.createElement('div');
      target.setAttribute(`${prefix}scale`, `${customScale}`);
      const parallax = new Parallax(target);
      expect(parallax.options.scale).toEqual(customScale);
    });

    it('should apply custom wrapper class as an option', () => {
      document.body.innerHTML = `
    <div id="ukiyo"></div>
  `;

      const attribute = `${prefix}wrapper-class`;
      const customWrapperClass = 'coolWrapperClassName';

      const target = document.getElementById('ukiyo');

      if (!target) return;

      target.setAttribute(attribute, customWrapperClass);

      new Parallax(target);

      const wrapperClass = target.parentElement?.className;
      expect(wrapperClass).toEqual(customWrapperClass);
    });
  });

  describe('calcDamp', () => {
    const maxDamp = 1;
    const minDamp = 0.5;
    let parallax;
    let div;
    beforeEach(() => {
      div = document.createElement('div');
      parallax = new Parallax(div);
    });
    it('should return maximum damp when parallax threshold is not reached', () => {
      const screenSize = 900;
      const damp = parallax['calcDamp'](screenSize);
      expect(damp).toBe(maxDamp);
    });
    it('should return maximum damp when screen size threshold is not reached', () => {
      const screenSize = 1100;
      const damp = parallax['calcDamp'](screenSize);
      expect(damp).toBe(maxDamp);
    });

    it('should calculate damp correctly when both parallax and screen size thresholds are reached', () => {
      const screenSize = 500;
      const damp = parallax['calcDamp'](screenSize);
      expect(damp).toBeLessThanOrEqual(maxDamp);
    });

    it('should return maximum damp when parallax scale threshold is not reached', () => {
      parallax = new Parallax(div, { scale: 1.3 });
      const screenSize = 950;
      const damp = parallax['calcDamp'](screenSize);
      expect(damp).toBe(maxDamp);
    });

    it('should return maximum damp when parallax speed threshold is not reached', () => {
      parallax = new Parallax(div, { speed: 1.3 });
      const screenSize = 950;
      const damp = parallax['calcDamp'](screenSize);
      expect(damp).toBe(maxDamp);
    });

    it('should handle damp below minimum value', () => {
      const screenSize = 100;
      const damp = parallax['calcDamp'](screenSize);
      expect(damp).toBe(minDamp);
    });
  });
});

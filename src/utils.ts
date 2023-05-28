import type { TElement } from '../types/index.ts';

/**
 * Check if the current browser supports the required features
 */
export const isSupportedBrowser = (): boolean => {
  const promise =
    typeof Promise !== 'undefined' &&
    Promise.toString().indexOf('[native code]') !== -1;
  const closest = typeof Element !== 'undefined' && Element.prototype.closest;

  return promise && closest && 'IntersectionObserver' in window;
};

/**
 * Determine if an image is loaded
 */
export const isImageLoaded = async (src: string): Promise<HTMLImageElement> => {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
};

/**
 * Convert a NodeList to an array
 */
const convertToArray = (nodeList: NodeList | HTMLCollection): HTMLElement[] => {
  return Array.prototype.slice.call(nodeList);
};

/**
 * Get an array of elements
 */
export const getElements = (elements: TElement): HTMLElement[] => {
  if (Array.isArray(elements)) return elements;
  if (typeof elements === 'string')
    return convertToArray(document.querySelectorAll(elements));
  if (elements instanceof HTMLElement) return [elements];
  if (elements instanceof NodeList) return convertToArray(elements);
  if (elements instanceof HTMLCollection) return convertToArray(elements);
  return [elements];
};

/**
 * Determine if the current browser is Safari on iOS
 */
export const isSPSafari = (): boolean => {
  const userAgent = window.navigator.userAgent;
  const isSP = !!userAgent.match(/iPad/i) || !!userAgent.match(/iPhone/i);
  const webkit = !!userAgent.match(/WebKit/i);
  const isSPSafari = isSP && webkit && !userAgent.match(/CriOS/i);
  return isSPSafari;
};

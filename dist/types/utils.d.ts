import type { TElement } from './types.ts';
/**
 * Check if the current browser supports the required features
 */
export declare const isSupportedBrowser: () => boolean;
/**
 * Determine if an image is loaded
 */
export declare const isImageLoaded: (src: string) => Promise<HTMLImageElement>;
/**
 * Get an array of elements
 */
export declare const getElements: (elements: TElement) => HTMLElement[];
/**
 * Determine if the current browser is Safari on iOS
 */
export declare const isSPSafari: () => boolean;

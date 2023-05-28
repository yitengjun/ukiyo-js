import type { UkiyoOptions } from '../types/index.ts';
/**
 * Parallax class
 */
export declare class Parallax {
    private options;
    private element;
    private wrapper;
    private overflow?;
    private vh;
    private observer?;
    private isVisible;
    private wrapperHeight?;
    private damp;
    private elementTagName;
    constructor(element: HTMLElement, options?: UkiyoOptions);
    /**
     * Create Parallax
     */
    private createParallax;
    /**
     * Update options
     */
    private updateOptions;
    /**
     * Sets the style of an element
     */
    private setStyle;
    /**
     * Wrap element
     */
    private wrapElement;
    /**
     * Check visible
     */
    private checkVisible;
    /**
     * Create Observer
     */
    private createObserver;
    /**
     * Observer callback
     */
    private handleIntersect;
    /**
     * OnEnter
     */
    private onEnter;
    /**
     * OnLeave
     */
    private onLeave;
    /**
     * Calculating the value of parallax
     */
    private calcTranslateValue;
    /**
     * Calculate parallax damp
     */
    private calcDamp;
    /**
     * Set the parallax value to element
     */
    private transformParallax;
    /**
     * Animate parallax
     */
    animate(): void;
    /**
     * Reset parallax
     */
    reset(): void;
    /**
     * Destroy instance
     */
    destroy(): void;
}

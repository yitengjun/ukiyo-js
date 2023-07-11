import type { UkiyoOptions } from './types.ts';
/**
 * Parallax class
 */
export declare class Parallax {
    readonly options: UkiyoOptions;
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
     * Update options based on element attributes
     */
    private updateOptions;
    /**
     * Sets the style of an element
     */
    private setStyle;
    /**
     * Wrap the element by adding a wrapper container
     */
    private wrapElement;
    /**
     * Check visibility of the element
     */
    private checkVisible;
    /**
     * Create IntersectionObserver
     */
    private createObserver;
    private onEnter;
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
     * Apply parallax transformation to the element
     */
    private applyParallax;
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

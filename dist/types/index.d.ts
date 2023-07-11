import type { UkiyoOptions, TElement } from './types.ts';
export default class Ukiyo {
    readonly elements: HTMLElement[];
    readonly options?: UkiyoOptions;
    private instances;
    readonly externalRAF: boolean;
    private requestId?;
    private timer?;
    readonly onResizeEvent: EventListenerOrEventListenerObject;
    private isInit;
    constructor(elements: TElement | null, options?: UkiyoOptions);
    /**
     * Initializes
     */
    private init;
    /**
     * Animation
     */
    animate(): void;
    /**
     * Cancel animation
     */
    private cancel;
    /**
     * Reset all instances
     */
    reset(): void;
    /**
     * Resize event
     */
    private resize;
    /**
     * Add event listeners
     */
    private addEventListeners;
    /**
     * Destroy all instances
     */
    destroy(): void;
}

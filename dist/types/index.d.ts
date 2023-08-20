import type { UkiyoOptions, TElement } from './types.ts';
export default class Ukiyo {
    private instances;
    readonly externalRAF: boolean;
    private requestId?;
    private timer?;
    readonly onResizeEvent: EventListenerOrEventListenerObject;
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
     * Reset all instances
     */
    reset(): void;
    /**
     * Resize event
     */
    private resize;
    /**
     * Destroy all instances
     */
    destroy(): void;
}

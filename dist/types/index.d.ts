export default class Ukiyo {
    private elements;
    private options;
    private instances;
    private externalRAF;
    private requestId?;
    private timer?;
    private onResizeEvent;
    private isInit;
    private constructor();
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

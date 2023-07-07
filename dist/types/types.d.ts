export type TElement = string | HTMLElement | HTMLElement[] | NodeList | HTMLCollection;
/**
 * Parallax Options
 */
export interface UkiyoOptions {
    /**
     * Parallax scale
     * @default 1.5
     */
    scale?: number;
    /**
     * Parallax speed
     * @default 1.5
     */
    speed?: number;
    /**
     * Wrapper element class
     * @default null
     */
    wrapperClass?: string | null;
    /**
     * Enabling the CSS will-change property during parallax animation
     * @default false
     */
    willChange?: boolean;
    /**
     * Animate parallax using external requestAnimationFrame()
     * @default false
     */
    externalRAF?: boolean;
}

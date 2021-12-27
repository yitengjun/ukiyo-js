/**
 * Wait for the images to load
 * @param  {string} src - Image source
 * @return {object} Promise Object
 */
const isImageLoaded = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

/**
 * Determine if the browser supports it
 * @return {boolean}
 */
const browserCheck = () => {
  const promise = typeof Promise !== 'undefined' && Promise.toString().indexOf('[native code]') !== -1;
  const closest = Element.prototype.closest;

  return promise && closest && 'IntersectionObserver' in window;
};

export { isImageLoaded, browserCheck };

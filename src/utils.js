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

export { isImageLoaded };

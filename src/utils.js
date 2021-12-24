/**
 * Wait for the images to load
 * @param  {string} src - Image source
 * @return {object} Promise Object
 */
const isImageLoaded = async (src) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  return img;
};

export { isImageLoaded };

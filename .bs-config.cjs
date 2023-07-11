/**
 * Browsersync config
 */
module.exports = {
  ui: false,
  server: {
    routes: {
      '/': 'tests/src',
    },
  },
  notify: false,
};

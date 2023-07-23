/**
 * Browsersync config
 */
module.exports = {
  ui: false,
  server: {
    routes: {
      '/': 'tests/demo',
      '/docs': 'docs',
    },
  },
  notify: false,
};

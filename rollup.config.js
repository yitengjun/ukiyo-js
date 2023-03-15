import pluginTypescript from '@rollup/plugin-typescript';
import buble from '@rollup/plugin-buble';
import terser from '@rollup/plugin-terser';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

const bubleOptions = {
  exclude: ['node_modules/**'],
  objectAssign: 'Object.assign',
  transforms: {
    asyncAwait: false,
  },
};

export default {
  input: './src/ukiyo.ts',
  output: [
    {
      name: 'Ukiyo',
      file: pkg.browser,
      format: 'umd',
      sourcemap: false,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: false,
    },
    {
      file: './dist/ukiyo.min.js',
      format: 'umd',
      name: 'Ukiyo',
    },
    {
      file: './docs/js/ukiyo.min.js',
      format: 'umd',
      name: 'Ukiyo',
    },
    {
      file: './demo/ukiyo.min.js',
      format: 'umd',
      name: 'Ukiyo',
    },
  ],
  plugins: [
    pluginTypescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    buble(bubleOptions),
    terser(),
  ],
};

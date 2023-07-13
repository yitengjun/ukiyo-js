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
  input: './src/index.ts',
  output: [
    {
      name: 'Ukiyo',
      file: './dist/ukiyo.umd.min.js',
      format: 'umd',
      sourcemap: false,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: false,
      exports: 'named',
    },
    {
      file: './dist/ukiyo.min.js',
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

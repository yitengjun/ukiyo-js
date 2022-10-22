import buble from '@rollup/plugin-buble';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve'

const bubleOptions = {
  exclude: ['node_modules/**'],
  objectAssign: 'Object.assign',
};

export default {
  input: './src/index.js',
  output: {
    file: './dist/ukiyo.min.js',
    format: 'umd',
    name: 'Ukiyo'
  },
  plugins: [buble(bubleOptions), terser(), serve('docs')]
};

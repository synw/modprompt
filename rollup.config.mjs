import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

//const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'dist/mod.es.mjs',
      format: 'esm'
    },
    {
      file: 'dist/mod.min.js',
      format: 'iife',
      name: '$tpl',
      plugins: [terser()]
    }],
  plugins: [
    typescript(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
  ],
};
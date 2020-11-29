import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from '@rollup/plugin-node-resolve';

// rollup.config.js
const config = {
  input: 'src/index.ts',
  plugins: [
    nodeResolve({
      jsxnext: true,
      main: true,
      browser: true
    }),
    typescript()
  ],
  external: [
    "d3"
  ],
  output: {
    extend: true,
    file: 'dist/index.js',
    format: 'umd',
    name: 'betterGraphs',
    sourcemap: true,
    globals: {
      d3: "d3"
    },
  },
};

export default config;
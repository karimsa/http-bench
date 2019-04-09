import nodeResolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'

export default {
  input: './benchmarks/express.js',
  output: {
    format: 'cjs',
    file: './benchmarks/express-minified.js',
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    cjs({
      preferBuiltins: true,
    }),
    json(),
    replace({
      'process.env.NODE_ENV': '"production"',
      'process.env.NO_DEPRECATION': '""',
      'process.env.TRACE_DEPRECATION': '""',
      // 'process.env.DEBUG': '""',
      'process.env.DEBUG_FD': '""',
      'process.env.DEBUG_MIME': '""',
    }),
  ],
}

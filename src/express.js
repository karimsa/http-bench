/**
 * @file src/index.js
 * @copyright 2019-present NxtGenDevs Inc. All rights reserved.
 */

import {
  express,
  parseQuery,
  parseJSON,
  writeJSON,
  addRoute,
  listen,
} from './express.macro'

const app = express()

addRoute(app, 'post', '/hello', async (req, res) => {
  const { name } = await parseJSON(req)
  const query = parseQuery(req)
  writeJSON(res, { hello: name, query })
})

listen(app, 3000, () => {
  if (process.env.BENCH_START) {
    process.exit()
  }
})

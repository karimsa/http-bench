/**
 * @file src/express.macro.js
 * @copyright 2019-present NxtGenDevs Inc. All rights reserved.
 */

const { createMacro } = require('babel-plugin-macros')
const {
  functionDeclaration,
  identifier,
  callExpression,
  stringLiteral,
} = require('@babel/types')

const { t, g } = require('./helpers')

const transforms = {
  express(path) {
    path.parentPath.replaceWithSourceString(`require('http').createServer()`)
  },

  parseQuery(path) {
    const [reqId] = path.parent.arguments
    const qs = path.parentPath.scope.generateUidIdentifier('qs')
    path.parentPath.scope.push({
      id: qs,
      init: callExpression(identifier('require'), [
        stringLiteral('querystring'),
      ]),
      kind: 'const',
    })
    path.parentPath.replaceWithSourceString(g`
      ${qs}.parse(${reqId}.parsedUrl)
    `)
  },

  parseJSON(path) {
    const [req] = path.parent.arguments
    const buffer = path.parentPath.scope.generateUid('buffer')

    path.parentPath.replaceWithSourceString(g`
      new Promise((resolve, reject) => {
        let ${buffer} = ''

        ${req}.setEncoding('utf8')
        ${req}.on('data', chunk => { ${buffer} += chunk })
        ${req}.on('error', reject)
        ${req}.on('end', () => {
          try {
            resolve(JSON.parse(${buffer}))
          } catch (err) {
            reject(err)
          }
        })
      })
    `)
  },

  writeJSON(path) {
    const [res, object] = path.parent.arguments

    path.parentPath.replaceWithSourceString(g`
      (
        ${res}.writeHead(200, {
          'Content-Type': 'application/json',
        }),
        ${res}.end(JSON.stringify(${object}))
      )
    `)
  },

  addRoute(path, state) {
    let [_, method, route, handler] = path.parent.arguments

    // stringify the method and route
    method = method.value.toUpperCase()
    route = route.value

    // Capture handler
    const handlerId = path.parentPath.scope.generateUid('routeHandler')
    const handlerNode = functionDeclaration(
      identifier(handlerId),
      handler.params,
      handler.body,
      handler.generator,
      handler.async,
    )
    path.parentPath.insertBefore(handlerNode)
    path.parentPath.remove()

    // Add to state
    state.router = state.router || {}
    state.router[method] = state.router[method] || {}
    state.router[method][route] = state.router[method][route] || []
    state.router[method][route].push(handlerId)
  },

  listen(path, state) {
    const [appId, port, cb] = path.parent.arguments
    const urlPkg = path.parentPath.scope.generateUid('url')

    let routeHandlers = ''
    for (const method of Object.keys(state.router)) {
      for (const route of Object.keys(state.router[method])) {
        routeHandlers += g`case '${method} ${route}':\n`

        for (const handlerId of state.router[method][route]) {
          routeHandlers += `  ${handlerId}(req, res)\n`
        }

        routeHandlers += `  break`
      }
    }

    state.pkgIds = state.pkgIds || {}
    state.pkgIds.url = urlPkg.name

    path.parentPath.insertBefore(t`
      const ${urlPkg} = require('url')
      ${appId}.on('request', (req, res) => {
        req.parsedUrl = ${urlPkg}.parse(req.url)
        switch (req.method + ' ' + req.parsedUrl.pathname) {
          ${routeHandlers}

          default:
            res.writeHead(404)
            res.end()
        }
      }).listen(${port}, ${cb})
    `)
    path.parentPath.remove()
  },
}

module.exports = createMacro(function({ references, state }) {
  for (const key of Object.keys(references)) {
    if (references[key]) {
      for (const path of references[key]) {
        transforms[key](path, state)
      }
    }
  }
})

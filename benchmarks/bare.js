const url = require('url')
const qs = require('querystring')

require('http')
  .createServer((req, res) => {
    const parsed = url.parse(req.url)
    const query = qs.parse(parsed.query)
    if (req.method === 'POST' && parsed.pathname === '/hello') {
      let buffer = ''
      req.on('data', chunk => {
        buffer += chunk
      })
      req.on('end', () => {
        try {
          const { name } = JSON.parse(buffer)
          res.writeHead(200, {
            'Content-Type': 'application/json',
          })
          res.end(JSON.stringify({ hello: name, query }))
        } catch (err) {
          res.writeHead(500)
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    } else {
      res.writeHead(404)
      res.end()
    }
  })
  .listen(3000, () => {
    if (process.env.BENCH_START) {
      process.exit()
    }
  })

'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.disable('etag')
app.disable('x-powered-by')

app.post('/hello', bodyParser.json(), function(req, res) {
  res.json({ hello: req.body.name, query: req.query })
})

app.listen(3000, () => {
  if (process.env.BENCH_START) {
    process.exit()
  }
})

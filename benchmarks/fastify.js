'use strict'

const fastify = require('fastify')()

const schema = {
  schema: {
    querystring: {
      a: { type: 'string' },
      b: { type: 'string' },
    },

    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    },

    response: {
      200: {
        type: 'object',
        properties: {
          hello: {
            type: 'string',
          },
          query: {
            type: 'object',
            properties: {
              a: { type: 'string' },
              b: { type: 'string' },
            },
          },
        },
      },
    },
  },
}

fastify.post('/hello', schema, function(req, reply) {
  reply.send({ hello: req.body.name, query: req.query })
})

fastify.listen(3000, () => {
  if (process.env.BENCH_START) {
    process.exit()
  }
})

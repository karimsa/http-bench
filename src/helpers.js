const generate = require('@babel/generator').default
const { parse } = require('@babel/core')

function renderBit(bit) {
  if (typeof bit === 'string') {
    return bit
  } else if (typeof bit === 'object' && 'type' in bit) {
    return generate(bit).code
  } else if (Array.isArray(bit)) {
    return bit.map(renderBit).join(', ')
  }

  console.warn({ bit })
  throw new Error(`Unknown bit visited`)
}

function g(str, ...bits) {
  let source = str[0]
  for (let i = 1; i < str.length; ++i) {
    source += renderBit(bits[i - 1]) + str[i]
  }
  return source
}

function t(...args) {
  return parse(g(...args))
}

module.exports = {
  t,
  g,
}

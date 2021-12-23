const fastify = require('fastify')({ logger: true })
var argv = require('minimist')(process.argv.slice(2))

console.log(argv._[0])

fastify.post('/', async (request, reply) => {
  const buffer = Buffer.from(request.body.payload, 'hex')

  const data = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))

  return eval(`
    function decode(data) {
        ${argv._[0]}
    }

    decode(data)
  `)
})

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

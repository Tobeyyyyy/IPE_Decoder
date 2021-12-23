const { Isolate } = require('isolated-vm')

let clients = {}
let config = {
  timeout: 1000
}

function init(script, clientId, timeout, memoryLimit) {
  config.timeout = timeout ?? 1000

  const isolate = new Isolate({ memoryLimit: memoryLimit ?? 8 })
  const context = isolate.createContextSync()
  const jail = context.global

  jail.setSync('get_input', () => clients[clientId].currentInput)

  clients[clientId] = {
    context,
    script: isolate.compileScriptSync(`
        input = get_input()
        data = new DataView(input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength));

        function decode(data) {
            ${script}
        }

        result = decode(data)

        JSON.stringify(result)
    `),
    currentInput: ''
  }
}

function decode(input, clientId) {
  clients[clientId].currentInput = input
  const result = JSON.parse(clients[clientId].script.runSync(clients[clientId].context, { timeout: config.timeout }))
  return result
}

module.exports.isolatedVmTest = [init, decode]

const { Isolate } = require('isolated-vm')

let clients = {}

function init(script, clientId) {
  const isolate = new Isolate({ memoryLimit: 8 })
  const context = isolate.createContextSync()
  const jail = context.global

  jail.setSync('get_input', () => clients[clientId].currentInput)

  clients[clientId] = {
    context,
    script: isolate.compileScriptSync(`
        const input = get_input()
        const data = new DataView(input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength));

        function decode(data) {
            ${script}
        }

        const result = decode(data)

        JSON.stringify(result)
    `),
    currentInput: ''
  }
}

function decode(input, clientId) {
  clients[clientId].currentInput = input
  const result = JSON.parse(clients[clientId].script.runSync(clients[clientId].context))
  return result
}

module.exports.isolatedVmTest = [init, decode]

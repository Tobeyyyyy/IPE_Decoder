const { VM, VMScript } = require('vm2')

let clients = {}
let config = {
  timeout: 1000
}

function init(script, clientId, timeout) {
  config.timeout = timeout ?? 1000

  const vmScript = new VMScript(`
    data = get_input();

    function decode(data) {
        ${script}
    }

    decode(data)
  `).compile()

  clients[clientId] = {
    vm: new VM({
      sandbox: { get_input: () => clients[clientId].currentInput },
      timeout: config.timeout,
      fixAsync: true
    }),
    script: vmScript,
    currentInput: ''
  }
}

function decode(input, clientId) {
  clients[clientId].currentInput = input
  const result = clients[clientId].vm.run(clients[clientId].script)
  return result
}

module.exports.vm2test = [init, decode]

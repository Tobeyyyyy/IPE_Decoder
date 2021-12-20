const { VM, VMScript } = require('vm2')

let clients = {}

function init(script, clientId) {
  const vmScript = new VMScript(`
    const data = get_input();

    function decode(data) {
        ${script}
    }

    decode(data)
  `).compile()

  clients[clientId] = {
    vm: new VM({ sandbox: { get_input: () => clients[clientId].currentInput }, timeout: 1000, fixAsync: true }),
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

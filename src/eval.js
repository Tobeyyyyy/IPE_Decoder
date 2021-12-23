let clients = {}

function init(script, clientId) {
  clients[clientId] = { script }
}

function decode(data, clientId) {
  return eval(`
    function decode(data) {
        ${clients[clientId].script}
    }

    decode(data)
  `)
}

module.exports.evalTest = [init, decode]

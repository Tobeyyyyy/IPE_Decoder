const axios = require('axios')
const { exec } = require('child_process')
const portfinder = require('portfinder')

let clients = {}

function init(script, clientId, timeout, memoryLimit) {
  portfinder.getPort((err, port) => {
    exec(`docker run --memory="${memoryLimit}m" -p ${port}:3000  decoder "${script}"`)

    clients[clientId] = {
      port
    }
  })
}

function decode(input, clientId) {
  return axios({
    method: 'POST',
    url: 'http://localhost:' + clients[clientId].port,
    data: { payload: input },
    headers: { 'Content-Type': 'application/json' }
  }).then((data) => data.data)
}

module.exports.dockerTest = [init, decode]

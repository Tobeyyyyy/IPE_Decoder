const axios = require('axios')

function init(script, clientId, timeout, memoryLimit) {}

function decode(data) {
  return axios({
    method: 'POST',
    url: 'http://localhost:3000/',
    data: { payload: '0101000000000000005500000AB00A50037011' },
    headers: { 'Content-Type': 'application/json' }
  }).then((data) => data.data)
}

module.exports.dockerTest = [init, decode]

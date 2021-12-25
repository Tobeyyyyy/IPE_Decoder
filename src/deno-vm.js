const { DenoWorker } = require('deno-vm')

let clients = {}

function init(script, clientId, timeout, memoryLimit, cb) {
  clients[clientId] = {
    worker: new DenoWorker(
      `
        function hexStringToArrayBuffer(hexString) {
          hexString = hexString.replace(/^0x/, '');
          
          if (hexString.length % 2 != 0) {
              console.log('WARNING: expecting an even number of characters in the hexString');
          }

          var bad = hexString.match(/[G-Z\\s]/i);
          if (bad) {
              console.log('WARNING: found non-hex characters', bad);    
          }
          
          var pairs = hexString.match(/[\\dA-F]{2}/gi);
          
          var integers = pairs.map(function(s) {
              return parseInt(s, 16);
          });
          
          var array = new Uint8Array(integers);
          
          return array.buffer;
        }
      
        self.onmessage = (e) => {    
            const buffer = hexStringToArrayBuffer(e.data)            
            const dataView = new DataView(buffer)

            function decode(data) {
                ${script}
            }

            self.postMessage(decode(dataView));
        };
      `,
      { permissions: {} }
    )
  }

  clients[clientId].worker.onmessage = cb

  return clients[clientId].worker
}

function decode(input, clientId) {
  clients[clientId].worker.postMessage(input)
}

module.exports.denoTest = [init, decode]

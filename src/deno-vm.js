const { DenoWorker } = require('deno-vm')

const script = `
    self.onmessage = (e) => {
        self.postMessage(e.data * 2);
    };
`

const worker = new DenoWorker(script, { permissions: {} })

worker.onmessage = (e) => {
  console.log('Number: ' + e.data)
}

worker.postMessage(2)

const { vm2test } = require('./vm2')
const { isolatedVmTest } = require('./v8-isolate')
const { evalTest } = require('./eval')
const { decodeStringBuffer, decodeBuffer, decodeStringTypedArray, decodeTypedArray } = require('./decoder')
const { toArrayBuffer, boxValues } = require('../src/utils')
const { decode: commonDecode, example_SDI } = require('./common-decoder')
const { dockerTest } = require('./docker')
const { denoTest } = require('./deno-vm')
const argv = require('minimist')(process.argv.slice(2))

async function main(d) {
  const payloadString = '0101000000000000005500000AB00A50037011'
  const buffer = Buffer.from(payloadString, 'hex')
  const dataView = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))

  const decoder = d || argv.d
  const timeout = argv.t || 1000
  const memoryLimit = argv.m || 300
  const benchmark = argv.b || 'latency'

  let init, decode, payload

  if (decoder === 'common') {
    init = () => {}
    decode = (input) => commonDecode(input, example_SDI)
    payload = dataView
  } else if (decoder === 'static') {
    init = () => {}
    decode = decodeTypedArray
    payload = dataView
  } else if (decoder === 'eval') {
    ;[init, decode] = evalTest
    payload = dataView
  } else if (decoder === 'docker') {
    ;[init, decode] = dockerTest
    payload = payloadString
  } else if (decoder === 'vm2') {
    ;[init, decode] = vm2test
    payload = dataView
  } else if (decoder === 'isolatedVM') {
    ;[init, decode] = isolatedVmTest
    payload = dataView
  } else if (decoder === 'denoVM') {
    ;[init, decode] = denoTest
    payload = payloadString
  } else {
    throw new Error('No decoder selected')
  }

  if (benchmark === 'latency') {
    if (decoder !== 'denoVM') {
      init(decodeStringTypedArray, 0, timeout, memoryLimit)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      let results = []

      for (let i = 0; i < 100000; i++) {
        let startTime = performance.now()

        // Decode here

        await decode(dataView, 0)

        // *******

        let endTime = performance.now()

        if (i % 1000 === 0) {
          // console.log(`${i} ${endTime - startTime}`)
        }
        results.push(endTime - startTime)
      }

      console.log(decoder, boxValues(results))
    } else {
      let results = []
      let startTime

      init(decodeStringTypedArray, 0, timeout, memoryLimit, (response) => {
        endTime = performance.now()
        results.push(endTime - startTime)

        if (results.length < 100000) {
          startTime = performance.now()
          decode(payload, 0)
        } else {
          console.log(decoder, boxValues(results))
        }
      })
      await new Promise((resolve) => setTimeout(resolve, 3000))

      startTime = performance.now()
      decode(payload, 0)
    }
  } else if (benchmark === 'memory') {
    // total: 16000 mb
    //
    // 2000 clients
    //
    // vm2: 2.7 % = 432 mb               / 2000 = 0,216 mb
    //
    // 1000 clients:
    //
    // isolated-vm: 7.9 % = 1264 mb      / 1000 = 1.264 mb
    // vm2: 
    // eval: 0.7 %
    // static: 0.6 %
    //
    // 1 client:
    //
    // deno-vm: 0.8% = 128mb
    // docker: 23.5 mb

    let clients = []
    let runs = 0

    for (let i = 0; i < 2; i++) {
      init(decodeStringTypedArray, i, timeout, memoryLimit)
      clients.push(i)
    }
    await new Promise((resolve) => setTimeout(resolve, 3000))

    while (true) {
      const clientId = Math.floor(Math.random() * clients.length)
      await decode(payload, clientId)
      runs++

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (runs % 1000) {
        console.log(runs)
      }
    }
  }
}

// main()

// main('static')
// main('common')
// main('eval')
// main('vm2')
// main('isolatedVM')
main()

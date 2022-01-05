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
  const client_count = argv.c || 1

  let init, decode, payload

  if (decoder === 'common') {
    init = () => {}
    decode = (input) => commonDecode(input, example_SDI)
    payload = dataView
  } else if (decoder === 'nativ') {
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
    if (decoder !== 'denoVM' && decoder !== 'docker') {
      let results = []

      for (let i = 0; i < 100000; i++) {
        let startTime = performance.now()

        // Decode here

        const result = await decode(payload, 0)
        console.log(result)

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

    for (let i = 0; i < client_count; i++) {
      init(decodeStringTypedArray, i, timeout, memoryLimit, () => {})
      clients.push(i)
    }
    await new Promise((resolve) => setTimeout(resolve, 3000))

    while (true) {
      const clientId = Math.floor(Math.random() * clients.length)
      await decode(payload, clientId)
      runs++

      await new Promise((resolve) => setTimeout(resolve, 100))

      console.log(runs)
    }
  } else if (benchmark === 'throughput') {
    if (decoder !== 'denoVM' && decoder !== 'docker') {
      init(decodeStringTypedArray, 0, timeout, memoryLimit)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      let startTime = Date.now()
      let counter = 0

      // konfig. Decoder 28754925
      // eval 20825664
      // isolatedVM 1409704 (1801801)
      // vm2 459585 (579150)
      // docker 46710 (53.050)
      // deno 472083 (533807)

      while (Date.now() - startTime < 60000) {
        if (counter % 1000 === 0) {
          console.log(counter)
        }
        await decode(payload, 0)
        counter++
      }

      console.log(counter)
    } else {
      let startTime
      let counter

      init(decodeStringTypedArray, 0, timeout, memoryLimit, (response) => {
        if (Date.now() - startTime < 60000) {
          counter++
          decode(payload, 0)

          if (counter % 1000 === 0) {
            console.log(counter)
          }
        } else {
          console.log(counter)
        }
      })
      await new Promise((resolve) => setTimeout(resolve, 3000))

      startTime = Date.now()
      counter = 0

      decode(payload, 0)
    }
  }
}

if (argv.d) {
  main()
} else {
  ;(async () => {
    await main('static')
    await main('common')
    await main('eval')
    await main('vm2')
    await main('isolatedVM')
    await main('docker')
    await main('denoVM')
  })()
}

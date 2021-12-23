const { vm2test } = require('./vm2')
const { isolatedVmTest } = require('./v8-isolate')
const { evalTest } = require('./eval')
const { decodeStringBuffer, decodeBuffer, decodeStringTypedArray, decodeTypedArray } = require('./decoder')
const { toArrayBuffer, boxValues } = require('../src/utils')
const { decode: commonDecode, example_SDI } = require('./common-decoder')
const { dockerTest } = require('./docker')
const argv = require('minimist')(process.argv.slice(2))

async function main(d) {
  const buffer = Buffer.from('0101000000000000005500000AB00A50037011', 'hex')

  const dataView = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))

  const decoder = d || argv.d
  const timeout = argv.t
  const memoryLimit = argv.m

  let init, decode

  if (decoder === 'common') {
    init = () => {}
    decode = (input) => commonDecode(input, example_SDI)
  } else if (decoder === 'static') {
    init = () => {}
    decode = decodeTypedArray
  } else if (decoder === 'eval') {
    ;[init, decode] = evalTest
  } else if (decoder === 'docker') {
    ;[init, decode] = dockerTest
  } else if (decoder === 'vm2') {
    ;[init, decode] = vm2test
  } else if (decoder === 'isolatedVM') {
    ;[init, decode] = isolatedVmTest
  } else if (decoder === 'denoVM') {
    // TODO:
  }

  init(decodeStringTypedArray, 0, timeout, memoryLimit)
  console.log(await decode(dataView, 0))

  // let results = []

  // init(decodeStringTypedArray, 0, timeout, memoryLimit)

  // for (let i = 0; i < 100000; i++) {
  //   let startTime = performance.now()

  //   // Decode here

  //   decode(dataView, 0)

  //   // *******

  //   let endTime = performance.now()

  //   if (i % 1000 === 0) {
  //     // console.log(`${i} ${endTime - startTime}`)
  //   }
  //   results.push(endTime - startTime)
  // }

  // console.log(decoder, boxValues(results))
}

main()

// main('static')
// main('common')
// main('eval')
// main('vm2')
// main('isolatedVM')

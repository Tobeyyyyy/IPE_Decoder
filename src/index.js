const { vm2test } = require('./vm2')
const { isolatedVmTest } = require('./v8-isolate')
const { decodeStringBuffer, decodeBuffer, decodeStringTypedArray, decodeTypedArray } = require('./decoder')
const { toArrayBuffer } = require('../src/utils')
const { decode: commonDecode, example_SDI } = require('./common-decoder')

async function main() {
  const buffer = Buffer.from('0101000000000000005500000AB00A50037011', 'hex')

  const dataView = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))

  const [init, decode] = isolatedVmTest

  init(decodeStringTypedArray, 'abc')

  try {
    const result = await decode(dataView, 'abc')
    console.log(result)
  } catch (error) {
    console.log('Script runtime error:', error)
  }
}

main()

const { vm2test } = require('./vm2')
const { isolatedVmTest } = require('./v8-isolate')
const { decodeStringBuffer, decodeBuffer, decodeStringTypedArray, decodeTypedArray } = require('./decoder')
const { toArrayBuffer } = require('../src/utils')

async function main() {
  const buffer = Buffer.from('0101000000000000005500000AB00A50037011', 'hex')

  const [init, decode] = isolatedVmTest

  init(decodeStringTypedArray, 'abc')

  try {
    const result = await decode(buffer, 'abc')
    console.log(result)
  } catch (error) {
    console.log('Script runtime error:', error)
  }
}

main()

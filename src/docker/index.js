let script

process.stdin.on('readable', function () {
  var buf = process.stdin.read()

  if (!script) {
    script = buf.toString('utf8')
  } else {
    const buffer = Buffer.from(buf.toString('utf8'), 'hex')
    let data = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))

    const result = eval(`
      function decode(data) {
        ${script}
      }
      decode(data)
    `)

    console.log(JSON.stringify(result))
  }
})

const Docker = require('dockerode')
const Stream = require('stream')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })

let clients = {}

function init(script, clientId, timeout, memoryLimit, cb) {
  const passStream = new Stream.PassThrough()

  passStream.on('data', (chunk) => {
    const data = chunk.toString('utf8')
    cb(JSON.parse(data.substring(data.indexOf('{'))))
  })

  docker.createContainer(
    { Image: 'decoder', OpenStdin: true, HostConfig: { Memory: memoryLimit * 1000000 }, NetworkDisabled: true },
    (err, container) => {
      if (err) {
        console.log(err)
        return
      }

      container.attach({ stream: true, stdin: true, stdout: true, stderr: true }, function (err, stream) {
        if (err) throw err
        stream.pipe(passStream)

        container.start(function (err, data) {
          if (err) throw err

          stream.write(script)

          clients[clientId] = {
            container,
            stream
          }
        })
      })
    }
  )

  // portfinder.getPort((err, port) => {
  //   exec(`docker run --memory="${memoryLimit}m" -p ${port}:3000  decoder "${script}"`)
  //   clients[clientId] = {
  //     port
  //   }
  // })
}

function decode(input, clientId) {
  clients[clientId].stream.write(input)

  // return axios({
  //   method: 'POST',
  //   url: 'http://localhost:' + clients[clientId].port,
  //   data: { payload: input },
  //   headers: { 'Content-Type': 'application/json' }
  // }).then((data) => data.data)
}

module.exports.dockerTest = [init, decode]

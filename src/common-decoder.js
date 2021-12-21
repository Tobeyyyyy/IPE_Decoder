var Validator = require('jsonschema').Validator
var v = new Validator()

const schema = {
  id: '/Decoder',
  type: 'object',
  properties: {
    preprocess: { $ref: '/Preprocess' },
    readings: { $ref: '/Readings' },
    management: { $ref: '/Management' }
  }
}

const preprocess = {
  id: '/Preprocess',
  type: 'object',
  properties: {
    action: { type: 'string', validateEnum: ['convertToUTF-8'] }
  }
}

const readings = {
  id: '/Readings',
  type: 'array',
  items: {
    type: 'object',
    properties: {}
  }
}

const management = {
  id: '/Management',
  type: 'array',
  items: {
    type: 'object',
    properties: {}
  }
}

const example_SDI = {
  readings: [],
  peter: 123
}

v.addSchema(preprocess, '/Preprocess')
v.addSchema(readings, '/Readings')
v.addSchema(management, '/Management')

console.log(v.validate(example_SDI, schema).valid)

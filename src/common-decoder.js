var Validator = require('jsonschema').Validator
var v = new Validator()

const schema = {
  id: '/Decoder',
  type: 'object',
  properties: {
    preprocess: { $ref: '/Preprocess' },
    readings: { $ref: '/Readings' }
  }
}

const preprocessSchema = {
  id: '/Preprocess',
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['convertToUTF-8'] }
  }
}

const readingsSchema = {
  id: '/Readings',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      isManagment: { type: 'boolean' },
      type: { type: 'string' },
      cnd: { type: 'string' },
      valueName: { type: 'string' },
      decode: { $ref: '/Decode' }
    }
  }
}

const decodeSchema = {
  id: '/Decode',
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['string', 'number', 'boolean'] },
    action: { $ref: '/Action' },
    postprocess: { $ref: '/Postprocess' }
  }
}

const actionSchema = {
  id: '/Action',
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['binary', 'json', 'xml', 'csv'] },
    index: { type: 'integer' },
    offset: { type: 'integer' },
    operator: { $ref: '/Operator' }
  }
}

const operatorSchema = {
  id: '/Operator',
  type: 'array'
}

const postprocessSchema = {
  id: '/Postprocess',
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['scale'] }
  }
}

module.exports.example_SDI = {
  readings: [
    {
      isManagment: false,
      type: 'cod:tempe',
      cnd: 'org.onem2m.home.moduleclass.temperature',
      valueName: 'curT0',
      decode: {
        type: 'number',
        action: {
          type: 'binary',
          index: 12,
          offset: 2
        },
        postprocess: {
          type: 'scale',
          value: 0.01
        }
      }
    },
    {
      isManagment: false,
      type: 'cod:aiQSr',
      cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
      valueName: 'humiy',
      decode: {
        type: 'number',
        action: {
          type: 'binary',
          index: 14,
          offset: 2
        },
        postprocess: {
          type: 'scale',
          value: 0.01
        }
      }
    },
    {
      isManagment: false,
      type: 'cod:aiQSr',
      cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
      valueName: 'co2',
      decode: {
        type: 'number',
        action: {
          type: 'binary',
          index: 16,
          offset: 2
        }
      }
    },
    {
      isManagment: false,
      type: 'cod:motSr',
      cnd: 'org.onem2m.common.moduleclass.motionSensor',
      valueName: 'alarm',
      decode: {
        type: 'boolean',
        action: {
          type: 'binary',
          index: 17,
          offset: 1,
          operator: ['gt', 0]
        }
      }
    },
    {
      isManagment: true,
      type: 'm2m:bat',
      mgd: 1006,
      valueName: 'btl',
      decode: {
        type: 'number',
        action: {
          type: 'binary',
          index: 8,
          offset: 2
        }
      }
    }
  ]
}

v.addSchema(actionSchema, '/Action')
v.addSchema(postprocessSchema, '/Postprocess')
v.addSchema(operatorSchema, '/Operator')
v.addSchema(decodeSchema, '/Decode')
v.addSchema(preprocessSchema, '/Preprocess')
v.addSchema(readingsSchema, '/Readings')

// console.log(v.validate(example_SDI, schema, { allowUnknownAttributes: false }).valid)

module.exports.decode = function decode(input, commonDecoder) {
  const result = {
    readings: [],
    management: []
  }

  if (commonDecoder.preprocess) {
  }

  for (const r of commonDecoder.readings) {
    const reading = {
      type: r.type,
      [r.isManagment ? 'mgd' : 'cnd']: r[r.isManagment ? 'mgd' : 'cnd'],
      valueName: r.valueName
    }

    let value

    if (r.decode.type === 'number') {
      if (r.decode.action.type === 'binary') {
        value = getBytes(input, r.decode.action.index, r.decode.action.offset)
      }

      if (r.decode.postprocess) {
        if (r.decode.postprocess.type === 'scale') {
          value = value * r.decode.postprocess.value
        }
      }
    } else if (r.decode.type === 'boolean') {
      if (r.decode.action.type === 'binary') {
        value = getBytes(input, r.decode.action.index, r.decode.action.offset)
      }

      switch (r.decode.action.operator[0]) {
        case 'gt':
          value = value > r.decode.action.operator[1]
          break
        case 'lt':
          value = value < r.decode.action.operator[1]
          break
        case 'eq':
          value = value === r.decode.action.operator[1]
          break
        case 'lte':
          value = value <= r.decode.action.operator[1]
          break
        case 'gte':
          value = value >= r.decode.action.operator[1]
          break
      }
    }

    reading.value = value

    if (r.isManagment) {
      result.management.push(reading)
    } else {
      result.readings.push(reading)
    }
  }

  return result
}

function getBytes(input, index, offset) {
  switch (offset) {
    case 1:
      return input.getUint8(index)
    case 2:
      return input.getUint16(index)
    case 4:
      return input.getUint32(index)
  }
}

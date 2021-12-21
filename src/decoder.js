const SDI = Buffer.from('0101000000000000005500000AB00A50037011', 'hex')
module.exports.SDI_example_value = new DataView(SDI.buffer.slice(SDI.byteOffset, SDI.byteOffset + SDI.byteLength))

const NKE = {
  MEASUREMENT_TYPE_TEMPERATURE: 23.2,
  MEASUREMENT_TYPE_HUMIDITY: 0.5,
  MEASUREMENT_TYPE_CO2: 453,
  MEASUREMENT_TYPE_NO2_GAS: 28,
  MEASUREMENT_TYPE_NOISE_LEVEL: 12
}
// const NKE_example_value = new DataView(Buffer.from('0101000000000000005500000AB00A50037011', 'hex'))

module.exports.decodeBuffer = (data) => {
  const type = data[0]
  const version = data[1]

  if (type === 1 && version === 1) {
    return {
      readings: [
        {
          type: 'cod:tempe',
          cnd: 'org.onem2m.home.moduleclass.temperature',
          valueName: 'curT0',
          value: data.readUIntBE(12, 2) / 100
        },
        {
          type: 'cod:aiQSr',
          cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
          valueName: 'humiy',
          value: data.readUIntBE(14, 2) / 100
        },
        {
          type: 'cod:aiQSr',
          cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
          valueName: 'co2',
          value: data.readUIntBE(16, 2)
        },
        {
          type: 'cod:motSr',
          cnd: 'org.onem2m.common.moduleclass.motionSensor',
          valueName: 'alarm',
          value: data[18] > 0
        }
      ],
      management: [
        {
          type: 'm2m:bat',
          mgd: 1006,
          valueName: 'btl',
          value: data.readUIntBE(8, 2)
        }
      ]
    }
  } else if (type === 2 && version === 4) {
    /* ... */
  }
}

module.exports.decodeTypedArray = (data) => {
  const type = data.getUint8(0)
  const version = data.getUint8(1)

  if (type === 1 && version === 1) {
    return {
      readings: [
        {
          type: 'cod:tempe',
          cnd: 'org.onem2m.home.moduleclass.temperature',
          valueName: 'curT0',
          value: data.getUint16(12) / 100
        },
        {
          type: 'cod:aiQSr',
          cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
          valueName: 'humiy',
          value: data.getUint16(14) / 100
        },
        {
          type: 'cod:aiQSr',
          cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
          valueName: 'co2',
          value: data.getUint16(16)
        },
        {
          type: 'cod:motSr',
          cnd: 'org.onem2m.common.moduleclass.motionSensor',
          valueName: 'alarm',
          value: data.getUint8(17) > 0
        }
      ],
      management: [
        {
          type: 'm2m:bat',
          mgd: 1006,
          valueName: 'btl',
          value: data.getUint16(8)
        }
      ]
    }
  } else if (type === 2 && version === 4) {
    /* ... */
  }
}

module.exports.decodeStringBuffer = `
  const type = data[0]
  const version = data[1]

  if (type === 1 && version === 1) {
    return {
      readings: [
        {
          type: 'cod:tempe',
          cnd: 'org.onem2m.home.moduleclass.temperature',
          valueName: 'curT0',
          value: data.readUIntBE(12, 2) / 100
        },
        {
          type: 'cod:aiQSr',
          cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
          valueName: 'humiy',
          value: data.readUIntBE(14, 2) / 100
        },
        {
          type: 'cod:aiQSr',
          cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
          valueName: 'co2',
          value: data.readUIntBE(16, 2)
        },
        {
          type: 'cod:motSr',
          cnd: 'org.onem2m.common.moduleclass.motionSensor',
          valueName: 'alarm',
          value: data[18] > 0
        }
      ],
      management: [
        {
          type: 'm2m:bat',
          mgd: 1006,
          valueName: 'btl',
          value: data.readUIntBE(8, 2)
        }
      ]
    }
  } else if (type === 2 && version === 4) {
    /* ... */
  }
`

module.exports.decodeStringTypedArray = `
  const type = data.getUint8(0)
  const version = data.getUint8(1)

  if (type === 1 && version === 1) {
    return {
      readings: [
        {
          type: 'cod:tempe',
          cnd: 'org.onem2m.home.moduleclass.temperature',
          valueName: 'curT0',
          value: data.getUint16(12) / 100
        },
        {
          type: 'cod:aiQSr',
          cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
          valueName: 'humiy',
          value: data.getUint16(14) / 100
        },
        {
          type: 'cod:aiQSr',
          cnd: 'org.onem2m.common.moduleclass.airQualitySensor',
          valueName: 'co2',
          value: data.getUint16(16)
        },
        {
          type: 'cod:motSr',
          cnd: 'org.onem2m.common.moduleclass.motionSensor',
          valueName: 'alarm',
          value: data.getUint8(17) > 0
        }
      ],
      management: [
        {
          type: 'm2m:bat',
          mgd: 1006,
          valueName: 'btl',
          value: data.getUint16(8)
        }
      ]
    }
  } else if (type === 2 && version === 4) {
    /* ... */
  }
`

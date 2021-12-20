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

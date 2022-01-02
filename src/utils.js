function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

module.exports.toArrayBuffer = toArrayBuffer

const asc = (arr) => arr.sort((a, b) => a - b)

const sum = (arr) => arr.reduce((a, b) => a + b, 0)

const mean = (arr) => sum(arr) / arr.length

// sample standard deviation
const std = (arr) => {
  const mu = mean(arr)
  const diffArr = arr.map((a) => (a - mu) ** 2)
  return Math.sqrt(sum(diffArr) / (arr.length - 1))
}

const quantile = (arr, q) => {
  const sorted = asc(arr)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  } else {
    return sorted[base]
  }
}

const q25 = (arr) => quantile(arr, 0.25)

const q50 = (arr) => quantile(arr, 0.5)

const q75 = (arr) => quantile(arr, 0.75)

const median = (arr) => q50(arr)

module.exports.boxValues = (arr) => {
  arr = arr.slice(100, arr.length - 1)

  const sorted = asc(arr)

  return {
    median: median(arr),
    q25: q25(arr),
    q75: q75(arr),
    q2_5: quantile(arr, 0.025),
    q97_5: quantile(arr, 0.975),
    low: sorted[0],
    high: sorted[sorted.length - 1],
    avg: mean(arr)
  }
}

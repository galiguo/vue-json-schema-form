/**
 * @param {*} res 需要处理的数据数组list
 * @param {*} mapping 映射字段 {name: "id", nameCn: "nameEn"}
 * @param {*} options 取值字段（组件中使用的值）{key: "value", des: "label"}
 * @description: 数组对象的 属性值 映射
 */
export const remoteDataMap = (res = [], mapping = {}, options = {}) => {
  const {
    des = 'nameCn',
    key = 'name'
  } = options || {}
  const label = mapping[des] || ''
  const value = mapping[key] || ''
  if (mapping && value) {
    return (res || []).map(v => {
      return {
        ...v,
        [`${des}`]: v[label],
        [`${key}`]: v[value]
      }
    })
  }
  return (res || []).map(v => {
    return {
      [`${des}`]: v,
      [`${key}`]: v
    }
  })
}

export const handlerDataParams = (needParamsmap = {}) => {
  const result = {}
  for (const key in needParamsmap) {
    if (Object.hasOwnProperty.call(needParamsmap, key)) {
      const el = needParamsmap[key]
      Object.values(el).map(v => {
        if (!result[v]) {
          result[v] = []
        }
        result[v].push(key)
      })
    }
  }
  return result
}
/**
 * @param {*} obj
 * @description: 判断对象中每个属性是否都有值
 */
export const isEveryKeyhasValue = (obj = {}) => {
  let flag = true
  for (const key in obj) {
    if (!obj[key]) {
      return false
    }
    if (Array.isArray(obj[key]) && obj[key]?.length === 0) {
      return false
    }
  }
  return flag
}

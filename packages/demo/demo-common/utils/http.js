import VueResource from 'vue-resource'
import message from './message'
import qs from 'qs'

const Vue = window.Vue
Vue.use(VueResource)

const apiSuccessCodeListMap = {
}
const getAPISuccessCode = (path) => {
  const matchKey = Object.keys(apiSuccessCodeListMap).find(regStr => {
    const reg = new RegExp(`${regStr}`)
    return reg.test(path)
  })
  return matchKey ? apiSuccessCodeListMap[matchKey] : 200
}
export default {
  /**
   * 如需自定义处理错误信息，传入第三个参数handle为true，如需隐藏报错，传入第四个参数silent为true
   * @param {string} url
   * @param {any} query
   * @param {boolean} handle
   * @param {boolean} silent
   * @param {any} options
   * @returns {Promise<any>}
   */
  get(url, query = null, handle = false, silent = false, options = {}) {
    return this.ajax({
      url: url,
      method: 'get',
      data: query,
      handle: handle,
      silent: silent,
      options
    })
  },
  /**
   * 如需自定义处理错误信息，传入第三个参数handle为true，如需隐藏报错，传入第四个参数silent为true
   * @param {string} url
   * @param {any} query
   * @param {boolean} handle
   * @param {boolean} silent
   * @param {any} options
   * @returns {Promise<any>}
   */
  post(url, params = null, handle = false, silent = false, options = {}) {
    return this.ajax({
      url: url,
      method: 'post',
      data: params,
      handle: handle,
      silent: silent,
      options
    })
  },
  put(url, params = null, handle = false, silent = false, options = {}) {
    return this.ajax({
      url: url,
      method: 'put',
      data: params,
      handle: handle,
      silent: silent,
      options
    })
  },
  delete(url, params = null, handle = false, silent = false, options = {}) {
    return this.ajax({
      url: url,
      method: 'delete',
      data: params,
      handle: handle,
      silent: silent,
      options
    })
  },
  jsonp(url, params = {}, handle = false, silent = false, options = {}) {
    return this.ajax({
      url: url,
      method: 'jsonp',
      data: params,
      handle: handle,
      silent: silent,
      options
    })
  },
  download(url, opts, filetype, filename) {
    return Vue.http.post(url, opts, { responseType: 'blob' }).then(res => {
      return res.blob().then(blob => {
        let serverName = ((res.headers.map && res.headers.map['content-disposition'] || [])[0] || '').split('filename=')[1]
        let name = filename || (filetype ? (serverName + '.' + filetype || 'file') : serverName)
        let result = document.createElement('a')
        let binaryData = []
        binaryData.push(blob)
        result.href = window.URL.createObjectURL(new Blob(binaryData))
        result.download = decodeURIComponent(name)
        result.click()
      })
    })
  },
  ajax(opts) {
    opts.options = opts.options || {}
    let url = opts.url
    let options = opts.options || {}
    let data = (opts.method === 'get' || opts.method === 'jsonp') ? { params: opts.data, ...options } : opts.data
    let apiSuccessCode = getAPISuccessCode(url)
    let error = ''
    let logParams = {}
    let ajaxParams = ((opts.method === 'get' || opts.method === 'jsonp') ? data.params : data) || {}
    Object.keys(ajaxParams).forEach(k => {
      if (ajaxParams[k] && ajaxParams[k].length && ajaxParams[k].length > 128) {
        logParams[k] = ajaxParams[k].slice(0, 128)
      } else {
        logParams[k] = ajaxParams[k]
      }
    })
    return new Promise((resolve, reject) => {
      Vue.http[opts.method](url, data, options).then(response => {
        let data = response.data || {}
        let code = data.code || 0
        let msg = data.msg || data.message || ''
        data.msg = msg
        if (code === apiSuccessCode || opts.handle) {
          resolve(data)
        } else {
          error = msg
          message.error('接口报错：' + error)
          reject(new Error(error))
        }
      }, response => {
        let type = '接口报错'
        error = url + ' ' + (response.status || 0) + ' ' + (response.statusText || '出现未知问题')
        if (!opts.silent || (!!opts.silent && (typeof (options.silentStatus) !== 'undefined') && options.silentStatus !== response.status)) {
          message.error(type + '：' + error)
        }
        reject(new Error(error))
      }).catch(error => {
        console.warn(error)
      })
    })
  }
}

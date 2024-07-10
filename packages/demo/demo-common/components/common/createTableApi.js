import http from '@/lib/http'
import { initiativeMonitor } from '@bilibili/bsk-monitor'

export default {
  /**
   * @param {*} params.tableField 来源表的字段
   * @description: 集成任务新建表，需要带过去的key
   */
  createTableKey(params = {}) {
    return http.post('/beast/datacollect/dwdsink/gencreatetablesql', params)
  },
  /**
   * @param {*} formData 数据同步任务的相关数据
   * @description: 集成新建表需要的dwdKey
   */
  async getCreateTableKeys(formData) {
    const createTableParams = {
      tableField: formData.sourceFields || [],
      database: formData.database || ''
    }
    const result = await this.createTableKey(createTableParams)
    initiativeMonitor({
      type: '0',
      trackId: 'lancer-new-table',
      params: JSON.stringify({
        'table-type': 'hive'
      })
    })
    return new Promise((resolve, reject) => {
      resolve(result)
    })
  }
}

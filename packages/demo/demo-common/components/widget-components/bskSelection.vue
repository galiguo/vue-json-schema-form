<template>
  <div :class="$style.box">
    <el-form-item
      :label="selectConfig.title + '：'"
      :prop="curNodePath"
      :class="$style.elFormItem"
      :rules="itemRules">
      <template slot="label" v-if="selectConfig.description">{{ selectConfig.title }}
        <el-tooltip effect="dark" placement="top-start" :content="selectConfig.description">
          <icon :class="$style.iconqs"></icon>
        </el-tooltip>
        :
      </template>
      <div :class="$style.formItem">
        <el-select
          v-model="table"
          :filterable="selectConfig.filterable"
          :allow-create="selectConfig.allowCreate || needAllowCreate"
          :remote="!needAllowCreate"
          value-key="value"
          :size="selectConfig.size"
          :clearable="selectConfig.clearable"
          :multiple="selectConfig.multiple"
          :disabled="selectConfig.disabled"
          :multiple-limit="selectConfig.multipleLimit"
          :remote-method="getRemoteList"
          :placeholder="selectConfig.placeholder || '请选择'"
        >
          <el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="selectConfig.selectValueKey ? item : item.value" :disabled="item.disabled">
          </el-option>
        </el-select>
      </div>
    </el-form-item>
    <div :class="$style.bskfield_btn_content" v-if="schema.canCreateTable">
      <el-button :disabled="!!table" size="middle" icon="el-icon-plus" type="text" @click="createTable(false)">快速建表</el-button>
      <el-button size="middle" icon="el-icon-edit" type="text" @click="createTable(true)" :disabled="!table">修改表</el-button>
    </div>
    <createTableDialog
      ref="createTableDialog"
      :title="dialogTitle"
      :urn="tableUrn"
      :dwdKey="dwdKey"
      :isEdit="dialogTitle === '编辑'"
      :dsType="1"
      :isDraft="schema.isDraftOperation"
      dsName="Hive"
      @getList="tableChanged"
      @draftSuccess="draftSuccess">
    </createTableDialog>
  </div>
</template>

<script>
import {
  fieldProps,
  vueUtils,
  formUtils,
  schemaValidate
} from '@lljj/vue-json-schema-form'
// import http from '@/lib/http'
import debounce from 'lodash/debounce'
// import { remoteDataMap } from '@/lib/remoteDatamap'
// import createTableDialog from '@/pages/dm/createTableDialog'
// import checkDialog from '@/components/checkDialog'
// import createTableApi from '../common/createTableApi'
export default {
  name: 'bskSelectField',
  components: {
    createTableDialog
    // checkDialog
  },
  props: {
    ...fieldProps,
    // 如果配置 ui:fieldProps，这里申明参数
    fieldProps: {
      type: null,
      default: null
    }
  },
  provide() {
    return {
      modelLevelDefault: this.schema.modelLevel
    }
  },
  inject: ['jobId'],
  data() {
    // isDraftOperation 是否建草稿表，传入建表组件内
    // needPushSinkFields 改表时追加字段的标识，false表示正常改表，ture表示改表且追加字段
    return {
      schemaValidate,
      vueUtils,
      optionList: [],
      options: {
        key: 'value',
        des: 'label'
      },
      dwdKey: '',
      tableUrn: ''
      // createTableDialogVisible: false,
      // checkDialogModel: {
      //   visible: false,
      //   data: [],
      //   cb: () => {}
      // }
    }
  },
  computed: {
    ...mapState(['userInfo']),
    ...mapState('workspace', ['currentWorkspace']),
    selectConfig() {
      const selectOptions = formUtils.getUiOptions({
        schema: this.schema,
        uiSchema: this.uiSchema || {}
      })
      return selectOptions
    },
    curValue() {
      return vueUtils.getPathVal(this.rootFormData, this.curNodePath)
    },
    hasClearFlag() {
      return this.fieldProps?.clearNum
    },
    needAllowCreate() {
      return this.rootFormData?.separate || false
    },
    // 任务编辑时，是否有需要追加到sink端的字段标识
    needPushSinkFields() {
      return this.fieldProps?.pushSinkFields
    },
    itemRules() {
      return [{
        required: this.selectConfig.required,
        validator: (rule, value, callback) => {
          const message = this.schema['err:required'] || '请选择'
          const hasPattern = this.schema?.pattern || ''
          const errPattern = this.schema['err:pattern'] || '请选择指定库'
          const regex = new RegExp(this.schema?.pattern)
          if (value) {
            if (hasPattern) { // 需要正则校验
              regex.test(value) ? callback() : callback(new Error(errPattern))
            } else { // 不需要正则校验
              callback()
            }
          } else {
            rule.required ? callback(new Error(message)) : callback()
          }
        }
      }]
    },
    table: {
      get() {
        return vueUtils.getPathVal(this.rootFormData, this.curNodePath) || ''
      },
      set(value) {
        // vueUtils.setPathVal(this.rootFormData, vueUtils.computedCurPath(this.curNodePath, 'table'), value)
        return this.$set(this.rootFormData, 'table', value)
      }
    }
  },
  created() {
  },
  watch: {
    hasClearFlag(val) {
      val && (this.optionList = [])
    },
    needPushSinkFields(val) { // 修改表字段（来源表字段有新增，要同步到sink表字段中，触发改表）
      val && this.createTable(true, val)
    }
  },
  methods: {
    // async validCheck() {
    //   const req = { opsUser: this.userInfo.username, workspace: this.currentWorkspace, operation: 'createTab' }
    //   try {
    //     const { data } = await http.post('/governa/openEvent/checkCommonEvent', req)
    //     if (data.isPass === false) {
    //       return new Promise((resolve, reject) => {
    //         this.checkDialogModel = {
    //           visible: true,
    //           data: data.details,
    //           cb: resolve
    //         }
    //       })
    //     }
    //     return true
    //   } catch (e) {
    //     return Promise.reject(e)
    //   } finally {
    //   }
    // },
    async createTable(isEdit, needPushSinkFields) {
      this.dialogTitle = isEdit ? '编辑' : '新建'
      // 新建表时校验 改表时需要urn
      isEdit && (this.tableUrn = `urn:datacenter:tab:Hive1.${this.table}`)

      // 新建表 或 改表时要追加字段
      const createTableParams = {
        ...this.fieldProps,
        database: this.rootFormData?.db || ''
      }
      createTableApi.getCreateTableKeys(createTableParams).then(res => {
        const sendKey = res.msg || ''
        this.dwdKey = sendKey
        // this.createTableDialogVisible = true
        this.$refs.createTableDialog?.openDialog({
          workspace: !isEdit ? this.currentWorkspace : '',
          operation: !isEdit ? 'createTab' : '',
          sourceType: 'archer_job',
          sourceKey: this.jobId
        })
      })
    },
    tableChanged() {
      // 改表需要重新获取 表字段信息
      if (this.dialogTitle === '编辑') {
        this.$set(this.fieldProps, 'tableHasEdit', true)
      }
    },
    handlerApi(value) {
      const apiObj = this.schema.api || {}
      if (!apiObj.uri) {
        return
      }
      const url = apiObj.uri
      let apiParams = {}
      let mb = p => o => p.map(c => (o = (o || {})[c])) && o
      for (const p in apiObj.params) {
        const paramItem = apiObj.params[p].split('.') || []
        this.$nextTick(() => {
          const queryData = { // 取值参数有可能是父组件传过来的，如jobId
            ...this.rootFormData,
            ...this.fieldProps,
            ...this.fieldProps?.formData || {}
          }
          apiParams[p] = mb(paramItem)(queryData)
          // rootFormData拿不到整个formData，只能拿到当前传过来的model
          // let key = paramItem?.length > 1 ? paramItem[1] : (paramItem?.length === 1 ? paramItem[0] : '')
          // apiParams[p] = queryData[key]
          apiParams[apiObj.searchKey || 'searchKey'] = value
          // apiParams.searchKey = value
        })
      }
      this.$nextTick(() => {
        if (value) {
          const that = this
          return http[apiObj.method](url, apiParams, false, true, {
            before(request) {
              if (that.previousRequest) {
                that.previousRequest.abort()
              }
              that.previousRequest = request
            },
            hide: true
          }).then((resp) => {
            const resulet = resp[apiObj.res] || []
            // this.remoteDatas[key] = resulet || []
            this.optionList = remoteDataMap(resulet, apiObj?.option, this.options) // 需要处理映射
          })
        } else {
          this.optionList = []
        }
      })
    },
    getRemoteList: debounce(function (value) {
      if (this.needAllowCreate) return // 有分表时用户输入 不需要远程获取
      this.handlerApi(value)
    }, 300),
    draftSuccess(data) {
      const table = data.data?.split(':')[3]?.split('.')[2]
      const db = data.data?.split(':')[3]?.split('.')[1]
      this.table = table
      db && (this.rootFormData.db = db)
      this.$nextTick(() => {
        table && this.$set(this.rootFormData, 'table', db + '.' + table)
      })
    }
  }
}
</script>

<style module lang="stylus">
  .box {
    :global {
      .el-form-item.is-error {
        :local {
          .uploadBox {
            color: #F56C6C
          }
        }
      }
    }
  }
  :global {
    .arrayOrderList_item {
      :local {
        .elFormItem {
          margin-bottom: 0
        }
      }
    }
  }
  .formItem {
    align-items: center
    display: flex
  }
  .bskfield_btn_content {
    display: flex;
    justify-content: flex-end;
    margin-top: -10px;
  }
  .iconqs {
    cursor: pointer;
    vertical-align: sub;
    background-size: 100% 100%;
    width: 14px;
    height: 14px;
  }
</style>

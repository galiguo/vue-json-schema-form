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
          :remote="!schema.localMethod && schema.needRemote"
          value-key="value"
          :size="selectConfig.size"
          :clearable="selectConfig.clearable"
          :multiple="selectConfig.multiple"
          :multiple-limit="selectConfig.multipleLimit"
          :remote-method="getRemoteList"
          :placeholder="selectConfig.placeholder || '请选择'"
          :class="$style.selectForm"
        >
          <el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="selectConfig.selectValueKey ? item : item.value" :disabled="item.disabled">
          </el-option>
        </el-select>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import {
  fieldProps,
  vueUtils,
  formUtils,
  schemaValidate
} from '@lljj/vue-json-schema-form'
import http from 'demo-common/utils/http'
import debounce from 'lodash/debounce'
import { remoteDataMap } from 'demo-common/utils/remoteDatamap'

export default {
  name: 'bskSelectionField',
  props: {
    ...fieldProps,
    // 如果配置 ui:fieldProps，这里申明参数
    fieldProps: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      schemaValidate,
      vueUtils,
      optionList: [],
      options: {
        key: 'value',
        des: 'label'
      },
      rootFormData: {}
    }
  },
  computed: {
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
    itemRules() {
      return this.selectConfig.required ? [{
        required: this.selectConfig.required,
        message: this.schema['err:required'] || '请选择'
      }] : []
    },
    table: {
      get() {
        return vueUtils.getPathVal(this.rootFormData, this.curNodePath) || ''
      },
      set(value) {
        this.$set(this.rootFormData, this.curNodePath, value)
        // vueUtils.setPathVal(this.rootFormData, vueUtils.computedCurPath(this.curNodePath, 'table'), value)
        return this.$set(this.rootFormData, 'table', value)
      }
    },
    localMethod() {
      return this.schema.localMethod || false
    }
  },
  created() {
  },
  mounted() {
    this.handlerRequestApi()
  },
  watch: {
    hasClearFlag(val) {
      val && (this.optionList = [])
    },
    localMethod(val) {
      this.handlerRequestApi()
    }
  },
  methods: {
    handlerApi(value) {
      const apiObj = this.schema.api || {}
      if (!apiObj.uri) {
        return
      }
      const url = apiObj.uri
      let apiParams = {}
      for (const p in apiObj.params) {
        const paramItem = apiObj.params[p].split('.') || []
        this.$nextTick(() => {
          // apiParams[p] = mb(paramItem)(this.rootFormData)
          // rootFormData拿不到整个formData，只能拿到当前传过来的model
          let key = paramItem?.length > 1 ? paramItem[1] : (paramItem?.length === 1 ? paramItem[0] : '')
          apiParams[p] = this.rootFormData[key]
          // searchKey可配置别名
          apiParams[apiObj.searchKey || 'searchKey'] = value
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
            this.optionList = remoteDataMap(resulet, apiObj?.option, this.options) // 需要处理映射
          })
        } else {
          this.optionList = []
        }
      })
    },
    getRemoteList: debounce(function (value) {
      if (!this.schema.localMethod && this.schema.needRemote) {
        this.handlerApi(value)
      }
    }, 300),
    handlerRequestApi() {
      if (this.selectConfig) {
        const { localMethod = false } = this.schema
        if (localMethod) {
          // 立刻请求接口获取下拉框内容
          this.$nextTick(() => {
            this.sendQuest(this.schema)
          })
        }
      }
    },
    sendQuest(config) {
        const apiObj = config.api || {}
        if (!apiObj.uri) {
            return
        }
        const url = apiObj.uri
        // TODO: 获取数据前先置空,是否需要待测试！
        Object.assign(config, {
            'ui:enumOptions': []
        })
        return http[apiObj.method](url).then((resp) => {
            const resulet = resp[apiObj.res] || []
            Object.assign(config, {
            'ui:enumOptions': remoteDataMap(resulet, apiObj?.option) // 需要处理映射
            })
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
  .selectForm {
    :global {
    }
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

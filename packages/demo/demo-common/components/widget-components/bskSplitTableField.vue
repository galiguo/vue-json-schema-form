<template>
  <div :class="$style.box" :style="{'width': selectConfig.width || '', 'flex-basis': selectConfig.width || ''}">
    <el-form-item
      :label="(selectConfig.title || '') + (selectConfig.title ? '：': '')"
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
        <el-checkbox
        :disabled="selectConfig.disabled || false"
        :size="selectConfig.size"
        slot="label"
        v-model="selectValue">有分表</el-checkbox>
        <span :class="$style.bskfield_tips">{{ selectConfig.placeholder || '' }}</span>
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

export default {
  name: 'bskSplitTableField',
  components: {},
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
      // optionList: [],
      options: {
        key: 'value',
        des: 'label'
      }
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
    itemRules() {
      return [{
        required: this.selectConfig.required,
        message: this.schema['err:required'] || '请选择'
      }]
    },
    optionList() {
      return this.selectConfig.needRemote ? [] : (this.selectConfig.enumOptions || [])
    },
    selectValue: {
      get() {
        return vueUtils.getPathVal(this.rootFormData, this.curNodePath) || ''
      },
      set(value) {
        return vueUtils.setPathVal(this.rootFormData, this.curNodePath, value)
      }
    }
  },
  created() {
  },
  watch: {
  },
  methods: {
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
      .el-checkbox__label {
        font-size: 12px !important
      }
    }
  }
  :global {
    .arrayOrderList_item {
      :local {
        .elFormItem {
          margin-bottom: 0
          padding-right: 10px
        }
      }
    }
  }
  .formItem {
    align-items: center
    display: flex
  }
  .bskfield_tips {
    font-size: 12px;
    display: inline-block;
    padding-left: 10px;
    line-height: 20px;
  }
  .iconqs {
    cursor: pointer;
    vertical-align: sub;
    background-size: 100% 100%;
    width: 14px;
    height: 14px;
  }
</style>

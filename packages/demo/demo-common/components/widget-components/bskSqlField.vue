<template>
  <div :class="$style.box">
    <el-form-item
      :label="selectConfig.title + '：'"
      :prop="curNodePath"
      :class="$style.elFormItem">
      <div :class="$style.bsksqlfield_content">
        <div :class="$style.bsksqlfield_sql">
          <codemirror v-model="sql" :options="codeOptions"></codemirror>
        </div>
        <el-row>
          <el-button size="mini" type="primary" :disabled="!sql" @click="explan">解析</el-button>
        </el-row>
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
import '../../css/codemirror.css'
import { codemirror } from 'vue-codemirror'
export default {
  name: 'bskSqlField',
  components: {
    codemirror
  },
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
      codeTheme: 'mdn-like'
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
    codeOptions() {
      return {
        tabSize: 4,
        styleActiveLine: true,
        lineWrapping: true,
        lineNumbers: true,
        line: true,
        mode: 'text/x-mysql',
        theme: this.codeTheme,
        showHint: true,
        placeholder: this.selectConfig.placeholder || '请录入',
        readOnly: this.selectConfig.readOnly,
        hintOptions: {
          completeSingle: false
        }
      }
    },
    sql: {
      get() {
        return vueUtils.getPathVal(this.rootFormData, this.curNodePath) || ''
      },
      set(value) {
        return this.$set(this.rootFormData, 'sql', value)
      }
    },
    sourceTableValue() { // 来源表的值
      return this.fieldProps?.sourceTable || ''
    }
  },
  watch: {
    sourceTableValue(val) {
      // Todo: source.table被清空和切换时，SQL内容需要被清空嘛？暂时不需要
    }
  },
  created() {
  },
  methods: {
    /**
     * @description: sql 解析需要触发父组件的方法 重新更新获取表字段的接口
     */
    explan() {
      const hasClick = this.fieldProps.emitSql + 1
      this.$set(this.fieldProps, 'emitSql', hasClick)
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
  .bsksqlfield_content {
    width: 100%;
    display: flex;
    .bsksqlfield_sql {
      min-width: calc(100% - 60px);
      margin-right: 10px;
    }
  }
  .iconqs {
    cursor: pointer;
    vertical-align: sub;
    background-size: 100% 100%;
    width: 14px;
    height: 14px;
    // background-image: url('~@/assets/form_qs.svg');
  }
</style>

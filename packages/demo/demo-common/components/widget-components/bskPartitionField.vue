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
        <ul :class="$style.bskfield_content" v-if="partition && partition.length > 0">
          <li v-for="(l, i) in partition" :key="i">
            <span :class="$style.bskfield_span">{{ l.field }}</span>
            <span :class="$style.bskfield_span">{{ l.fieldDesc }}</span>
          </li>
        </ul>
        <span v-else :class="$style.bskfield_none"> 暂无分区字段信息 </span>
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
    name: 'bskPartitionField',
    components: {
    },
    props: {
      ...fieldProps
    },
    data() {
      return {
        schemaValidate,
        vueUtils
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
      partition: {
        get() { // partitions：编辑时详情返回的值， partitionFields：表字段信息
          const partitions = vueUtils.getPathVal(this.rootFormData, this.curNodePath)
          const partitionLists = partitions && partitions.length > 0 ? partitions : this.partitionFields
          this.$set(this.rootFormData, 'partition', partitionLists)
          return partitionLists
        },
        set(value) {
          return this.$set(this.rootFormData, 'partition', value)
        }
      },
      partitionFields() { // 分区字段 需要根据分区标识过滤
        return (this.selectConfig.enumOptions || []).filter(v => v.isPartition) || []
      }
    },
    watch: {},
    created() {},
    methods: {}
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
  .bskfield_content {
    width: 100%;
    li {
      display flex
      justify-content space-between
      // width 100%
      background-color #f2f2f2
      border-left: 5px solid #606266;
      cursor: pointer;
      color: #606266;
      margin: 5px 0;
      height: 28px;
      font-size: 12px;
      line-height: 28px;
      &:hover {
        background-color: #f9f9f9;
        border-color: #409eff;
      }
      .bskfield_span {
        margin: 0 20px;
      }
    }
  }
  .bskfield_none {
    font-size: 12px;
    padding-left: 5px;
  }
  .iconqs {
    cursor: pointer;
    vertical-align: sub;
    background-size: 100% 100%;
    width: 14px;
    height: 14px;
  }
</style>

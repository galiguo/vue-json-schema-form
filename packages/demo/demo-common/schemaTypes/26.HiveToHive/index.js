/*
 * @Author: zhanganqi01
 * @Date: 2024-07-09 11:33:43
 * @LastEditTime: 2024-07-09 16:10:21
 * @FilePath: /configured-fe/packages/demo/demo-common/schemaTypes/26.HiveToHive/index.js
 * @Description: test
 */
export default {
    schema: {
        title: '来源组件',
        type: 'object',
        required: ['db', 'table'],
        properties: {
            db: {
                title: '数据库',
                type: 'string',
                'ui:widget': 'SelectWidget',
                'ui:enumOptions': [],
                'err:required': '请选择',
                pattern: '',
                api: {
                    uri: '/api/datapipe/pipeline/display/db/list/source_query',
                    method: 'get',
                    params: {
                        pipelineId: 'sync.pipelineId'
                    },
                    res: 'data'
                },
                'ui:options': {
                    required: 'true',
                    filterable: true,
                    clearable: true,
                    placeholder: '请选择库名',
                    disabled: false,
                    size: 'mini'
                }
            },
            partition: {
                type: 'string',
                title: '分区字段',
                'ui:field': 'bskPartitionField',
                'ui:enumOptions': [],
                description: '分区字段，来源是表字段接口',
                'err:required': '必须输入'
            },
            sql: {
                title: '过滤SQL',
                type: 'string',
                'ui:field': 'bskSqlField',
                'ui:options': {
                    required: true,
                    placeholder: '请录入查询SQL,此SQL不支持注释，如:\n            select\n            column1 as a, column2\n            from source_table\n            where column4>=0',
                    disabled: false,
                    size: 'mini'
                }
            },
            bio: {
                type: 'string',
                title: 'Bio',
                minLength: 10
            },
        },
    },
    formData: {
        db: '',
        partition: 88,
        sql: '',
        bio: '知道的越多、就知道的越少'
    },
    uiSchema: {
        bio: {
            'ui:options': {
                placeholder: '请输入你的签名',
                type: 'textarea',
                rows: 6
            }
        }
    },
    errorSchema: {
        bio: {
            'err:minLength': '签名最小长度10个字符串'
        }
    }
};

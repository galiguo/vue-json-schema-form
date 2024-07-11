export default {
  schema: {
    title: "节点筛选配置",
    type: "object",
    required: [],
    properties: {
      owner: {
        "err:required": "请选择责任人",
        path: "owner.table",
        "ui:options": {
          filterable: true,
          clearable: true,
          size: "mini",
          multiple: true,
          disabled: false,
          placeholder: "请选择责任人"
        },
        needRemote: true, //needRemote 根据关键字远程搜索
        "ui:field": "bskSelectionField",
        api: {
          res: "data",
          method: "get",
          searchKey: "name",
          params: {
            searchKey: "owner.table"
          },
          uri: "/camelot/user/list",
          option: {
            label: "nickname",
            value: "username"
          }
        },
        title: "责任人",
        type: "array",
        items: {
          type: "string"
        },
        "ui:enumOptions": [],
        required: false
      },
      containDeleted: {
        "ui:options": {
          filterable: true,
          clearable: true,
          size: "mini",
          disabled: false,
          placeholder: "请选择是否包含删除节点"
        },
        "ui:widget": "SelectWidget",
        title: "包含删除节点",
        type: "boolean",
        "ui:enumOptions": [{
            label: "是",
            value: true
          },
          {
            label: "否",
            value: false
          }
        ]
      },
      sla: {
        "err:required": "请选择SLA等级",
        "ui:options": {
          filterable: true,
          clearable: true,
          size: "mini",
          multiple: true,
          disabled: false,
          placeholder: "请选择sla等级"
        },
        pattern: "",
        "ui:widget": "SelectWidget",
        title: "sla等级",
        type: "array",
        items: {
          type: "string"
        },
        "ui:enumOptions": [{
            label: "S",
            value: "S"
          },
          {
            label: "A",
            value: "A"
          },
          {
            label: "B",
            value: "B"
          }
        ],
        required: false
      },
      workspace: {
        localMethod: true, //是否立即请求接口（不根据关键字发起远程查询）
        "ui:options": {
          filterable: true,
          clearable: true,
          size: "mini",
          multiple: true,
          disabled: false,
          placeholder: "请选择归属空间"
        },
        "ui:widget": "SelectWidget",
        api: {
          res: "data",
          method: "get",
          uri: "/camelot/workspace/list",
          option: {
            label: "nickname",
            value: "name"
          }
        },
        title: "归属空间",
        type: "array",
        items: {
          type: "string"
        },
        "ui:enumOptions": []
      }
    }
  },
  formData: {

  },
  uiSchema: {

  },
  errorSchema: {

  }
}

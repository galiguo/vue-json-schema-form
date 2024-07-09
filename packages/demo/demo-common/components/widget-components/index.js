/*
 * @Author: zhanganqi01
 * @Date: 2024-07-09 12:06:42
 * @LastEditTime: 2024-07-09 12:12:28
 * @FilePath: /configured-fe/packages/demo/demo-common/components/widget-components/index.js
 * @Description: 自定义组件
 */
const ExtraComponents = {
  bskSelectField: () => import('./bskSelection'),
  bskPartitionField: () => import('./bskPartitionField'),
  bskSqlField: () => import('./bskSqlField'),
  bskSelectionField: () => import('./bskSelectionField'),
  bskSplitTableField: () => import('./bskSplitTableField')
}

export default ExtraComponents
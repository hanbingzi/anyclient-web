import { AllNodeType } from '../../base/types/server-node.types';

export interface ICompleteQueryParam {
  /**
   * 查询的类型
   * 1.(inputDB.) 查看数据库下的view和table ---tableChain
   * 2.(from|join|update|into) 查询表中的字段 ---columnChain
   * 3.(create', 'alter', 'drop)创建、修改、删除表、函数、触发器 ---ddlChain
   * 4.('select', 'insert', 'update', 'delete', 'call')(into|from|update|table|join)查询库下的表名  ---dmlChain
   * 5（检查sql语句中的表名）复用tableName--tableDetectorChain
   */
  nodeTypes: AllNodeType[];
  /**
   * 需要查询的库
   */
  schema?: string;
  /**
   * 查询的表格
   */
  tables?: string[];
}

export interface ICompleteNode {
  name: string;
  description?: string;
  nodeType?: AllNodeType;
}

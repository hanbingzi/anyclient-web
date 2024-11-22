# 一.项目说明

## 1.1 开发前配置

### 1.2.1 配置prettier

- 项目统一使用prettier格式化，所有需要配置prettier

1. idea搜索prettier插件，安装
2. setting搜索prettier，然后选择automatic开头的选项，即可完成配置

## 1.2 项目结构

```text
any-client-startup
├─package.json
├─PROJECT.md
├─typings
├─src
|  ├─node
|  |  ├─common-modules.ts //系统node组件注册
|  |  └start-server.ts //后台node启动入口
|  ├─modules
|  |    ├─welcome //欢迎页
|  |    |  
|  |    ├─toolbar-option //数据库选择框
|  |    |  
|  |    ├─todo //测试
|  |    |  
|  |    ├─server-manager //服务管理
|  |    |      
|  |    ├─server-list //连接列表
|  |    |      
|  |    ├─server-explorer //服务图标注册
|  |    |      
|  |    ├─server-client //*重点，所有服务访问接口
|  |    |       ├─node
|  |    |       |  ├─base-client.ts //统一封装sql执行封装
|  |    |       |  ├─connectionManager.ts // 服务连接池管理
|  |    |       ├─common
|  |    |       |   ├─utils //所有客户端类型工具类
|  |    |       |   ├─types //
|  |    |       |   ├─page
|  |    |       |   ├─fields
|  |    |       |   ├─dialet //所有客户端的sql语言
|  |    |       |   ├─convert //所有客户端的类型转换
|  |    |       |   ├─connect //所有客户端的连接配置
|  |    |       ├─browser
|  |    |       |    ├─sql-server-api.service.ts //sql统一封装的接口
|  |    ├─query-explorer
|  |    |       ├─browser
|  |    |       |    ├─table-result //sql执行结果展示页
|  |    |       |    ├─redis-result //redis执行结果展示页
|  |    |  
|  |    ├─open-recent //
|  |    |     
|  |    ├─local-store-db
|  |    |       
|  |    ├─icons
|  |    |   ├─values 
|  |    |   ├─tools //页面操作按钮图标
|  |    |   ├─server //所有服务图标
|  |    |   ├─node //服务节点图标
|  |    |   ├─main //系统图标
|  |    |   ├─font //纯字体图标
|  |    |   ├─common //通用图标
|  |    |     
|  |    ├─doc-editor //文档展示，各种语言的文档展示封装
|  |    |     
|  |    ├─data-view //
|  |    |     ├─browser
|  |    |     |    ├─zk-view //zookeeper展示
|  |    |     |    ├─zk-create
|  |    |     |    ├─view-view //sql view展示
|  |    |     |    ├─table-view //sql table展示，重要
|  |    |     |    ├─table-edit //sql table编辑
|  |    |     |    ├─sql-db-edit //sql db编辑
|  |    |     |    ├─redis-view //redis 结果编辑
|  |    |     |    ├─object-data //任何类型的keyvalue数据展示
|  |    |     |    ├─kafka-view //kafka数据展示
|  |    | 
|  |    ├─data-item-info
|  |    |         
|  |    ├─components
|  |    |     ├─title //
|  |    |     ├─table-view
|  |    |     ├─table-editor //核心 -- 系统内所有表格展示的封装
|  |    |     ├─style //统一样式
|  |    |     ├─select-input
|  |    |     ├─select //因为opensumi中的select的label，显示svg有问题，所以拷贝自opensumi的2.23版本，进行的代码修改。
|  |    |     ├─scrollbars //因为scrollbars由2.23升级到2.27，导致旧的2.23版本scrollbars在新代码中失效，所以，从opensumi的components中拷贝而来。后期应该研究升级后的scrollbars如何使用
|  |    |     ├─recycle-tree //拷贝自opensumi的2.23版本
|  |    |     ├─pagination //分页器
|  |    |     ├─loading 
|  |    |     ├─list-view
|  |    |     ├─form
|  |    |     ├─error
|  |    |     ├─date-picker
|  |    |     ├─data-view
|  |    |     ├─alert
|  |    |      
|  |    ├─codelens-command //命令提示结构
|  |    |        
|  |    ├─base
|  |    |  ├─constant.ts
|  |    |  ├─utils //系统封装通用工具
|  |    |  ├─types
|  |    |  ├─param
|  |    |  ├─model //
|  |    |  ├─icon
|  |    |  ├─hooks //所有hook统一封装
|  |    |  ├─config //系统内置配置
|  |    |  ├─command
|  |    |    
|  |    ├─app
|  |    
|  ├─extension
|  ├─common
|  |   ├─i18n
|  |   |  
|  ├─browser //系统初始化
|  |    ├─common-modules.ts // 系统前端组件注册
|  |    ├─index.ts
|  |    ├─layout-config.ts
|  |    ├─render-app.ts 
|  |    ├─status-bar
|  |    ├─menu-bar
├─server_resource //
|        ├─windows
|        ├─linux
├─scripts
|    
├─public
|  
├─extensions
|    
├─configs

```

# 二 开发

## 1. 常用注释

### 1.1 CommandService

此服务是用来执行注册的命令

CommandService引入

```
@Autowired(CommandService)
private readonly commandService:CommandService;
```
CommandService使用

```
this.commandService.executeCommand(commandId,params)
```

### 1.2 用户配置项

此服务用来获取用户在setting中设置的配置项

```
@Autowired(PreferenceService)
private readonly preferenceService: PreferenceService;
```

使用如下，获取了一个editor.previewMode的配置项

```
const preview = this.preferenceService.get<boolean>('editor.previewMode');
```

### 1.3 右下角消息提示

```
@Autowired(IMessageService)
protected readonly messages: IMessageService;
```

使用

```
this.messages.info('保存成功');
```

## 2. 常用规范

- 防止sql代码被格式化

```text
部分sql语句使用 // @formatter:off // @formatter:on关闭代码格式化,否则sql语句会换行，此处尤其注意，
IDEA要在File-->Setting-->Editor-->CodeStyle-->Formatter-->开启Turn formatter on/off
```

# 三. 开发示例

## 1. 数据库开发示例

### 1.1 树列表开发

树列表核心模块为：**open-recent**

要实现树列表的展示，核心操作在**open-recent/browser/services/server-tree-api.service.ts**类上的**resolveChildren**方法

比如要实现数据库的下级菜单，调用链为如下

```text
菜单调用接口方法
|
├─resolveChildren  
|      ├─resolveSqlChildren（调用server-client/browser/sql-server-api.service.ts的如下方法）  
|      |      ├─showDatabases
|      |      |       └─执行sql，mysql示例（SHOW DATABASES）
|      |      ├─showSqlDatabaseSubItem（postgres，mssql调用sql，查询所有的schema）
|      |      ├─showSqlModelItem
|      |      ├─showTables（调用sql，查询db下的所有table）
|      |      ├─showViews（查询db下的所有view）
|      |      ├─showFunctions（查询db下的所有function）
|      |      ├─showSequences（查询db下的所有sequence）
|      |      ├─showProcedures（查询db下的所有procedure）
|      |      └─showTriggers（查询db下的所有trigger）
|      |
|      ├─resolveRedisChildren
|      ├─resolveZookeeperChildren
|      └resolveKafkaChildren

```
### 1.2 树右键开发

#### 1.2.1 核心类

1. 配置树的右键显示内容：**src/modules/base/config/menu/menu.config.ts**->**SERVER_COMMANDS_CONFIG**
2. 注册树的右键**src/modules/open-recent/browser/connect-tree.contribution.ts**

#### 1.2.2 menu.config.ts配置右键菜单-代码示例

比如db的右键菜单配置为

```js
export const db: Command[][] = [
  [CommandIds.newQuery],
  [CommandIds.refresh],
  [{ ...CommandIds.copy, label: '复制库名' }],
  [CommandIds.editDb, { ...CommandIds._delete, label: '删除库' }],
  [
  // CommandIds.sqlStructureAndDataBackup,
  // CommandIds.sqlStructureBackup,
  // CommandIds.runSqlFile,
  ],
];
//其中CommandIds.newQuery内容如下
export const newQuery: Command = { label: '新建查询', id: CommandIds.newQuery };
```

#### 1.2.3 connect-tree.contribution.ts注册右键

```text
registerMenus(menuRegistry: IMenuRegistry) void {
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerSqlServer, SERVER_COMMANDS_CONFIG.sqlServer);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerRedisServer, SERVER_COMMANDS_CONFIG.redisServer);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerZkServer, SERVER_COMMANDS_CONFIG.zkServer);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerKafkaServer, SERVER_COMMANDS_CONFIG.kafkaServer);
  //关系数据库菜单
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerDb, SERVER_COMMANDS_CONFIG.db);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerOrclDb, SERVER_COMMANDS_CONFIG.orclDb);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerPostgresDb, SERVER_COMMANDS_CONFIG.PostgresDb);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerSchema, SERVER_COMMANDS_CONFIG.schema);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerTables, SERVER_COMMANDS_CONFIG.tables);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerTable, SERVER_COMMANDS_CONFIG.table);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerTableViews, SERVER_COMMANDS_CONFIG.tableViews);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerTableView, SERVER_COMMANDS_CONFIG.tableView);
  //trigger function procedure sequence
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerTriggers, SERVER_COMMANDS_CONFIG.triggers);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerTrigger, SERVER_COMMANDS_CONFIG.trigger);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerFunctions, SERVER_COMMANDS_CONFIG.functions);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerFunction, SERVER_COMMANDS_CONFIG._function);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerProcedures, SERVER_COMMANDS_CONFIG.procedures);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerProcedure, SERVER_COMMANDS_CONFIG.procedure);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerSequences, SERVER_COMMANDS_CONFIG.sequences);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerSequence, SERVER_COMMANDS_CONFIG.sequence);
  //redis
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerRedisDb, SERVER_COMMANDS_CONFIG.redisDb);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerRedisNode, SERVER_COMMANDS_CONFIG.redisNode);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerRedisKey, SERVER_COMMANDS_CONFIG.redisKey);
  //zookeeper
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerZKNode, SERVER_COMMANDS_CONFIG.zkNode);
  //kafka
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerTopics, SERVER_COMMANDS_CONFIG.topics);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerTopic, SERVER_COMMANDS_CONFIG.topic);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerBrokers, SERVER_COMMANDS_CONFIG.brokers);
  this.batchRegisterMenus(menuRegistry, ServerMenuIds.ServerExplorerGroups, SERVER_COMMANDS_CONFIG.groups),;
};

```

#### 1.2.4 connect-tree.contribution.ts注册执行命令

```typescript
commands.registerCommand(ServerCommandIds.newQuery, {
  execute: async (node?: ServerNode) => {
    //执行命令的具体内容
    }
  })
```


### 1.3 表格增删改查开发

#### 1.3.1 核心类

- **src/modules/data-view/browser/table-view/table-view.service.ts**：表格逻辑处理
- **src/modules/data-view/browser/table-view/table-view.view.tsx**：表格展示

#### 1.3.2 扩展数据库类型

表格的所有操作，都是**table-view.view.tsx**页面按钮调用的**table-view.service.ts**内部的方法，
**table-view.service.ts**内部继续调用**open-recent/browser/services/server-tree-api.service.ts**

#### 1.3.3 调用链

```text
table-view.view.tsx
├─handleRemove(删除)
|      └─table-view.service.ts
|               └─table-view.service.ts->remove()
|                   └─sql-server-api.service.ts->deleteTableDataByCompositeKeys()//
|                                                       └─执行sql（DELETE FROM tableName WHERE key=1 ）
├─handleRefresh（刷新）
|      └─table-view.service.ts
|               └─table-view.service.ts->refresh();
|                   └─sql-server-api.service.ts──selectTableData()
|                                              |       └─执行sql（select * from tableName)
                                               ├─showColumns()
|                                                       └─执行sql（select cloumns from **) 
├─handlePage（翻页）
|      └─table-view.service.ts
|               └─table-view.service.ts->selectTableData()-->走的跟刷新一样，参数不同
|     
├─handleSave（保存，新增和修改的保存）
|      └─table-view.service.ts
|               └─table-view.service.ts->save()
|                   └─sql-server-api.service.ts->updateBatchDataByCompositeKey()//
|                                                       └─执行sql（update */insert into）
├─handleFilter（过滤查询）
|      └─table-view.service.ts
|               └─table-view.service.ts->filter()-->走的跟刷新一样，参数不同

```

### 1.4 表字段编辑开发
### 1.4.1 核心类
- src/modules/data-view/browser/table-edit/table-edit.service.ts
- src/modules/data-view/browser/table-edit/table-edit.view.tsx

# 四. 错误解决

### 1. 开发环境没有debug按钮,或者nodejs18启动报错

报错代码为：

```
 "error:0308010C:digital envelope routines::unsupported"
```

解决：在powershell中运行如下命令：

```powershell
 $env:NODE_OPTIONS = "--openssl-legacy-provider"

```
linux/mac
```shell
export NODE_OPTIONS=--openssl-legacy-provider
```

或者命令中注入参数

```text
 "start": "cross-env NODE_OPTIONS=--openssl-legacy-provider run-p start:client start:server start:webview",
```

<h1 align="center">ClientBiz Web </h1>

[官网地址](https://www.clientbiz.cn)

ClientBiz是一款开源的，支持WEB和客户端版本的，能够支持连接各种类型的关系数据库、非关系型数据库、时序数据库、图数据库、消息队列、注册中心等数据服务的管理软件。

![perview](./doc/images/clientbiz-main.jpg)

[ClientBiz IDE 版本请移步此处（源码地址）](./README-zh_CN.md)

<h2 align="center">ClientBiz当前支持的客户端 </h2>

|     ![mysql](./doc/icons/server/mysql.svg)     | ![postgresql](./doc/icons/server/postgre.svg) | ![oracle](./doc/icons/server/oracle.svg) | ![mariadb](./doc/icons/server/mariadb.svg) |   ![redis](./doc/icons/server/sqlserver.svg)   | ![redis](./doc/icons/server/redis.svg) |
|:----------------------------------------------:|:---------------------------------------------:|:----------------------------------------:|:------------------------------------------:|:----------------------------------------------:|:--------------------------------------:|
|                     Mysql                      |                  Postgresql                   |                  Oracle                  |                  Mariadb                   |                   SqlServer                    |                 Redis                  |
| ![zookeeper](./doc/icons/server/zookeeper.svg) |    ![kafka](./doc/icons/server/kafka.svg)     |     ![dm](./doc/icons/server/dm.svg)     |    ![tidb](./doc/icons/server/tidb.svg)    | ![oceanbase](./doc/icons/server/oceanbase.svg) |   ![db2](./doc/icons/server/db2.svg)   |
|                   Zookeeper                    |                     Kafka                     |                    达梦                    |                    TiDB                    |                   oceanbase                    |                  DB2                   |
|      ![etcd](./doc/icons/server/etcd.svg)      | ![TDEngine](./doc/icons/server/tdengine.svg)  | ![clickhouse](./doc/icons/server/clickhouse.svg) |   ![Presto](./doc/icons/server/presto.svg)    |  ![trino](./doc/icons/server/trino.svg)  |                                      |
|                      Etcd                      |                   TDEngine                    |                    ClickHouse                    |                    Presto                     |                  Trino                   |                                                        |



## 功能特点

- 开源免费
- 支持web和客户端方式安装
- 传统IDE方式管理SQL及其他语言脚本
- 方便的Git管理SQL及其他语言脚本
- 丰富的第三方客户端支持
- 优秀的智能脚本语言提示
- 可视化操作的SQL查询结果展示


## 支持的客户端功能介绍

### 1.数据库支持功能
```bash
├── 数据库  
│   └── 右键
│       ├── 新建库
│       ├── 删除库
│       ├── 刷新
│       └── 关闭连接              
├── 表   
│   ├── 右键
│   │   ├── 新建库
│   │   ├── 删除库
│   │   ├── 刷新
│   │   └── 关闭连接
│   ├── 查询
│   └── 编辑

                     
├── 视图
│   ├── browser
│   └── node
├── 函数
├── 存储过程
└── 触发器
```

### 2.Redis支持功能
```bash
├── extensions                  # 内置插件安装位置
├── configs                     # 构建配置
├── src
│   ├── browser
│   └── node
├── tsconfig.json
├── package.json
└── README.md
```
### 3.Zookeeper支持功能
```bash
├── extensions                  # 内置插件安装位置
├── configs                     # 构建配置
├── src
│   ├── browser
│   └── node
├── tsconfig.json
├── package.json
└── README.md
```
### 4.Kafka支持功能
```bash
├── extensions                  # 内置插件安装位置
├── configs                     # 构建配置
├── src
│   ├── browser
│   └── node
├── tsconfig.json
├── package.json
└── README.md
```
### 5.Etcd支持功能
```bash
├── extensions                  # 内置插件安装位置
├── configs                     # 构建配置
├── src
│   ├── browser
│   └── node
├── tsconfig.json
├── package.json
└── README.md
```
1. 
2. 展示数据结构
  - 展示所有数据库
  - 展示表
  - 展示视图
  - 展示函数
  - 展示存储过程
  - 展示触发器





## Quick Start

```bash
$ git clone git@github.com:opensumi/ide-startup.git
$ cd ide-startup
$ yarn
$ yarn start
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080).
.


## 请作者喝杯咖啡

开源创作不易，请多支持
<div style="display: flex;flex-direction: row">
<img src="./doc/images/wechat-pay.jpg" >
<img src="./doc/images/zifubao-pay.jpg">

</div>

## 商务联系

作者邮箱：hanbingzi@aliyun.com

加我微信
![WeChat](./doc/images/ContactUs.jpg)


## 最后

注：作者已断断续续的全职开发此产品花费将近两年，都穷的无米下锅，目前正在找工作，如果有Java方面的技术岗或管理岗，希望能加我微信或者邮箱联系作者

作者邮箱：hanbingzi@aliyun.com

## License

Licensed under the [MIT](LICENSE) license.

<h1 align="center">ClientBiz Web </h1>

[官网地址](https://www.clientbiz.cn)

ClientBiz是一款开源的，支持WEB和客户端版本的，能够支持连接各种类型的关系数据库、非关系型数据库、时序数据库、图数据库、消息队列、注册中心等数据服务的管理软件。

![perview](./doc/images/clientbiz-main.jpg)

[ClientBiz IDE 源码地址](./README-zh_CN.md)

<h2 align="center">ClientBiz当前支持的客户端 </h2>
<div align="center">
<div style="display: flex; justify-content: space-between;padding: 10px 20px">
    <div style="text-align: center;">
        <img src="./doc/icons/server/mysql.svg" width="100px" height="100px">
        <p>Mysql</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/postgre.svg" width="100px" height="100px">
        <p>Postgresql</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/oracle.svg" width="100px" height="100px">
        <p>Oracle</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/mariadb.svg" width="100px" height="100px">
        <p>mariadb</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/sqlserver.svg" width="100px" height="100px">
        <p>SqlServer</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/redis.svg" width="100px" height="100px">
        <p>Redis</p>
    </div>
</div>

<div style="display: flex; justify-content: space-between;padding: 10px 20px">
    <div style="text-align: center;">
        <img src="./doc/icons/server/zookeeper.svg" width="100px" height="100px">
        <p>Zookeeper</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/kafka.svg" width="100px" height="100px">
        <p>Kafka</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/dm.svg" width="100px" height="100px">
        <p>达梦</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/tidb.svg" width="100px" height="100px">
        <p>TiDB</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/oceanbase.svg" width="100px" height="100px">
        <p>OceanBase</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/db2.svg" width="100px" height="100px">
        <p>DB2</p>
    </div>
</div>
<div style="display: flex; justify-content: space-between; padding: 10px 20px">
    <div style="text-align: center;">
        <img src="./doc/icons/server/ClickHouse.svg" width="100px" height="100px">
        <p>ClickHouse</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/presto.svg" width="100px" height="100px">
        <p>Presto</p>
    </div>
    <div style="text-align: center;">
        <img src="./doc/icons/server/Trino.svg" width="100px" height="100px">
        <p>Trino</p>
    </div>
   
</div>

</div>

## 功能特点

- 开源免费
- 支持web和客户端方式安装
- 传统IDE方式管理SQL及其他语言脚本
- 方便的Git管理SQL及其他语言脚本
- 丰富的第三方客户端支持
- 优秀的智能脚本语言提示
- 可视化操作的SQL查询结果展示


## 支持的客户端功能介绍

### 数据库支持功能

![mysql](./doc/icons/server/mysql.svg)
![mysql](./doc/icons/server/postgre.svg)
![mysql](./doc/icons/server/oracle.svg)
![mysql](./doc/icons/server/mariadb.svg)
![mysql](./doc/icons/server/sqlserver.svg)
![mysql](./doc/icons/server/dm.svg)
![mysql](./doc/icons/server/tidb.svg)
![mysql](./doc/icons/server/oceanbase.svg)
![mysql](./doc/icons/server/db2.svg)
![mysql](./doc/icons/server/clickhouse.svg)
![mysql](./doc/icons/server/presto.svg)
![mysql](./doc/icons/server/trino.svg)





## Quick Start

```bash
$ git clone git@github.com:opensumi/ide-startup.git
$ cd ide-startup
$ yarn
$ yarn start
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080).

You can add `workspaceDir` to the URL to open the specified directory, for
example `http://0.0.0.0:8080?workspaceDir=/path/to/dir`.

## Project Structure

```bash
.
├── extensions                  # The Buit-in extensions
├── configs                     # Build configuration
├── src
│   ├── browser
│   └── node
├── tsconfig.json
├── package.json
└── README.md
```

## Use Docker

```bash
# Pull the image
docker pull ghcr.io/opensumi/opensumi-web:latest

# Run
docker run --init --rm -d  -p 8080:8000/tcp ghcr.io/opensumi/opensumi-web:latest
```

Open `http://0.0.0.0:8080`

## License

Copyright (c) 2019-present Alibaba Group Holding Limited, Ant Group Co. Ltd.

Licensed under the [MIT](LICENSE) license.

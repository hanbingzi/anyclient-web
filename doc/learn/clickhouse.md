# clickhouse

## 参考网址

https://www.cnblogs.com/daiss314/p/16771303.html 基本操作

## 安装

```shell
docker run -d -p 18123:8123 -p 19000:9000 --name clickhouse_test yandex/clickhouse-server
```

## 修改密码

要将 ClickHouse 中的 default 用户密码设置为 AAAaaa，请按照以下步骤操作：

1. 打开 ClickHouse 配置文件。这通常在 /etc/clickhouse-server/users.xml 或 /etc/clickhouse-server/users.d/ 目录下。

2. 找到 <users> 部分下的 <default> 用户配置。

3. 在 <default> 部分中，找到 <password> 标签。如果该标签不存在，您需要添加它。

4. 将 <password> 标签的内容更改为新密码 AAAaaa。
5. 保存并关闭配置文件。

6. 重启 ClickHouse 服务以应用更改

## clickhouse数据库相关操作

第一：进入容器（ docker exec -it clickhouse /bin/bash）
第二：进入clickhouse-client命令行（clickhouse-client）
第三：创建表（

```
CREATE TABLE IF NOT EXISTS test
(
branch String COMMENT '分支',
ten_id Nullable(String) COMMENT '租户Id',
sys_id Nullable(String) COMMENT '系统Id'
) ENGINE = MergeTree() PARTITION BY branch
ORDER BY (branch)
PRIMARY KEY (branch) SETTINGS index_granularity=8192;

）
```

第四：插入表

```
insert into test (branch,ten_id,sys_id) values('bbbb','test','1');
```

第五：修改表

```
alter table test modify column age String;
```

## 端口说明

### 8123端口（HTTP端口）：

1. 用于通过HTTP协议与ClickHouse数据库进行交互。

2. 支持RESTful API和HTTP查询语法。

3. 可以使用浏览器、curl等工具发送HTTP请求，并接收响应。

4. 通常用于执行查询、获取数据和管理ClickHouse集群。

### 9000端口（TCP端口）：

1. 用于通过TCP/IP协议与ClickHouse数据库进行交互。

2. 使用ClickHouse自定义二进制协议进行通信。

3. 支持更高的并发性和性能。

4. 通常用于大规模数据导入、数据写入和数据处理等高性能场景。


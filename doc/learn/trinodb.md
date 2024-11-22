# TrinoDb

- 官网：https://trino.io/docs/current/connector/postgresql.html

## Trino Docker 安装

1. 不挂在目录安装

```shell
 docker run -d -p 8080:8080 --name trinodb trinodb/trino
```

2. 挂载配置文件安装

```shell
# 先将容器里面catalog部分配置文件拷贝出来，方便使用,因为catalog里面有一些默认的配置文件，方便学习
docker cp trino_v:/etc/trino/catalog .
docker run -d --name trino_v1 -p 8081:8080 --volume $PWD/catalog:/etc/trino/catalog trinodb/trino:425
```

## connect配置

### mysql配置

在catalog下面新建文件mysql.properties,填入如下内容

```text
connector.name=mysql
connection-url=jdbc:mysql://111.67.196.4:3306
connection-user=root
connection-password=oracle123iop
```

### postgresql配置

在catalog下面新建文件postgresql.properties,填入如下内容

```text
connector.name=postgresql
connection-url=jdbc:postgresql://111.67.196.4:5432/test
connection-user=postgres
connection-password=oracle123iop
```

# oracle

## 参考网址

```text
https://cloud.tencent.com/developer/article/1852042
```

## docker创建

1. oracle18c创建docker命令

```text
docker run --name oracle_18c -d -p 15211:1521 -e ORACLE_PASSWORD=oracle123iop gvenzl/oracle-xe:18
```

2. oracle11g创建docker命令

```text
docker run --name oracle11g_test -d -p 15212:1521 -e ORACLE_PASSWORD=oracle123iop gvenzl/oracle-xe:11
```

## 创建用户

```sql
-- 进入容器
--docker exec -it oracle11g_test /bin/bash
-- 进入oracle管理端
sqlplus
/ as sysdba
```

```sql


-- oracle为用户名称
create
user oracle identified by password;

grant connect,resource,create
session to oracle;

grant unlimited
tablespace to oracle;
--创建完就可以用navicat连接了                
```


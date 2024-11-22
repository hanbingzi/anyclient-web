# oceanbase

## 参考网址

https://blog.csdn.net/suixinfeixiangfei/article/details/131207121

## 使用

### 1.安装

```shell
# 根据当前容器部署最大规格的实例
docker run -p 2881:2881 --name obstandalone -d oceanbase/oceanbase-ce
# 部署 mini 的独立实例
docker run -p 2881:2881 --name obstandalone -e MINI_MODE=1 -d oceanbase/oceanbase-ce
```

### 2.查看是否启动成功

```shell
docker logs obstandalone | tail -1
```

### 3.进入容器内部

```shell
# 需要等待30s，
docker exec -it obstandalone ob-mysql sys
```

### 4.修改密码

```shell
alter user root identified by 'root123';
```

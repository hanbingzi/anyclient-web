## 1.etcd docker创建

```cmd

docker run -d \
  --name etcd-test \
  -p 2379:2379 \
  -p 2380:2380 \
  --env ALLOW_NONE_AUTHENTICATION=yes \
  --env ETCD_ADVERTISE_CLIENT_URLS=http://0.0.0.0:2379 \
  --env ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379 \
  --env ETCD_LISTEN_PEER_URLS=http://0.0.0.0:2380 \
  --env ETCD_INITIAL_ADVERTISE_PEER_URLS=http://0.0.0.0:2380 \
  --env ETCD_INITIAL_CLUSTER=node1=http://0.0.0.0:2380 \
  --env ETCD_NAME=node1 \
  --env ETCD_ROOT_PASSWORD=oracle123iop \
  bitnami/etcd:3.5


docker run -d \
  --name etcd-server \
  -p 2379:2379 \
  -p 2380:2380 \
  --env ALLOW_NONE_AUTHENTICATION=yes \
  bitnami/etcd:3.5


```

# etcd常用命令

## 键值操作：

### 设置键值对

```
etcdctl put mykey "Hello, etcd!"
```

### 获取键值

```
etcdctl get mykey
```

### 删除键

```
etcdctl del mykey
```

### 按前缀获取键值

```
etcdctl get --prefix myprefix
```

### 监视键的变化

etcdctl watch mykey
集群管理：
bash
复制

### 查看集群成员列表

```
etcdctl member list
```

### 查看集群状态

```
etcdctl endpoint status
```

### 查看集群健康状态

```
etcdctl endpoint health
```

### 添加新成员

```
etcdctl member add newnode --peer-urls=http://10.0.0.10:2380
```

### 删除成员

```
etcdctl member remove 8211f1d0f64f3269
```

用户和角色管理：
bash
复制

### 创建用户

```
etcdctl user add myuser
```

### 创建角色

```
etcdctl role add myrole
```

### 将角色授予用户

```
etcdctl user grant-role myuser myrole
```

### 为角色授予权限

```
etcdctl role grant-permission myrole read /myprefix/ --prefix
```

### 列出所有用户

```
etcdctl user list
```

### 列出所有角色

```
etcdctl role list
```

备份和恢复：
bash
复制

### 创建快照

```
etcdctl snapshot save snapshot.db
```

### 从快照恢复

```
etcdctl snapshot restore snapshot.db --data-dir=/var/lib/etcd
```

性能和调试：
bash
复制

### 检查性能

```
etcdctl check perf
```

### 检查数据库状态

```
etcdctl check datascale
```

### 压缩数据库

```
etcdctl compact 3
```

### 整理碎片

```
etcdctl defrag
```

租约操作：
bash
复制

### 创建租约

```
etcdctl lease grant 60
```

### 撤销租约

```
etcdctl lease revoke 694d71f9779b13f4
```

### 续约租约

```
etcdctl lease keep-alive 694d71f9779b13f4
```

事务操作：
bash
复制

```
etcdctl txn --interactive

compares:
value("foo") = "bar"

success requests (get, put, del):
put foo "bar2"

failure requests (get, put, del):
put foo "bar3"
```

安全相关：
bash
复制

### 启用身份验证

```
etcdctl auth enable
```

### 禁用身份验证

```
etcdctl auth disable
```

### 生成根证书

```
etcdctl user add root
```

### 生成客户端证书

```
etcdctl --endpoints=https://127.0.0.1:2379 \
--cacert=/path/to/ca.pem \
--cert=/path/to/client.pem \
--key=/path/to/client-key.pem \
```




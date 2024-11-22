# tidb

## 参考网址

# tidb 快速部署 - 转载

## Docker部署TiDB的流程-

下面是部署TiDB的整个流程，我们将在后续的章节中逐步详细介绍每一步的具体操作。

```text
| 步骤 | 操作 |
| --- | --- |
| 步骤1 | 拉取TiDB镜像 |
| 步骤2 | 创建网络 |
| 步骤3 | 启动PD节点 |
| 步骤4 | 启动TiDB节点 |
| 步骤5 | 启动TiKV节点 |
| 步骤6 | 使用TiDB客户端 |
```

接下来，让我们一步一步来实现这些操作。

### 步骤1：拉取TiDB镜像

首先，我们需要从Docker Hub上拉取TiDB的镜像。TiDB的官方镜像名为 **pingcap/tidb**。

使用以下命令拉取镜像：

```shell
docker pull pingcap/tidb
```

### 步骤2：创建网络

为了使得TiDB的各个节点可以相互通信，我们需要创建一个Docker网络。

使用以下命令创建网络：

```shell
docker network create tidb-network
```

### 步骤3：启动PD节点

PD是TiDB的调度组件，负责实现数据的自动迁移和负载均衡。

使用以下命令启动PD节点：

```shell
docker run -d --name pd --network tidb-network pingcap/tidb pd-server --pd-addr=pd:2379
```

### 步骤4：启动TiDB节点

TiDB是TiDB集群的SQL层，负责接收和处理用户的SQL请求。

使用以下命令启动TiDB节点：

```shell
docker run -d --name tidb --network tidb-network -p 4000:4000 pingcap/tidb
```

### 步骤5：启动TiKV节点

TiKV是TiDB集群的存储层，负责存储数据并提供高可用性。

使用以下命令启动TiKV节点：

```shell
docker run -d --name tikv1 --network tidb-network pingcap/tidb tikv-server --pd-addr=pd:2379
docker run -d --name tikv2 --network tidb-network pingcap/tidb tikv-server --pd-addr=pd:2379
```

### 步骤6：使用TiDB客户端

现在，我们已经成功启动了TiDB集群的各个组件。我们可以使用TiDB客户端连接到数据库并执行SQL查询。

使用以下命令启动TiDB客户端：

```shell
docker run -it --network tidb-network pingcap/tidb mysql --host=tidb --port=4000
```

### 步骤7：修改密码

随便使用一个客户端，执行以下命令

```shell
SET PASSWORD FOR 'root'@'%' = 'password';
```

### 总结

通过以上步骤，我们成功地使用Docker部署了TiDB集群。您现在可以开始使用TiDB进行开发和测试了。

-----------------------------------
©著作权归作者所有：来自51CTO博客作者mob64ca12e20c7d的原创作品，请联系作者获取转载授权，否则将追究法律责任
docker 部署tidb
https://blog.51cto.com/u_16213371/7576867

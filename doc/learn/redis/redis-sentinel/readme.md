# redis集群哨兵模式
参考网址：https://juejin.cn/post/7088702645317140510?from=search-suggest
## docker 启动方式
```shell
 docker-compose up -d
 存在问题，docker启动后，哨兵给的地址，无法访问，因为是docker内部的地址
```

## 本地启动方式
### 命令
启动下面的命令即可使用哨兵模式
```shell
./redis6/redis-server ./master/conf/redis.conf 
./redis6/redis-server ./slave1/conf/redis.conf 
./redis6/redis-server ./slave2/conf/redis.conf 

./redis6/redis-sentinel ./sentinel1/conf/sentinel.conf
./redis6/redis-sentinel ./sentinel2/conf/sentinel.conf
./redis6/redis-sentinel ./sentinel3/conf/sentinel.conf

```

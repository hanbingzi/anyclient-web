for port in $(seq 6179 6184); \
do
  echo ${port} start
  ./redis6/redis-server ./node-${port}/conf/redis.conf
done

for port in $(seq 6179 6184); \
do
  echo ${port} start
  rm -rf ./node-${port}/nodes.conf
  rm -rf ./node-${port}/dump.rdb
done

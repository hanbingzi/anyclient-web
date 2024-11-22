# 第一章：项目



# 第二章：常用命令

## git提交规范说明

 类型       | 描述                          
----------|-----------------------------
 build    | 编译相关的修改，例如发布版本、对项目构建或者依赖的改动 
 chore    | 其他修改, 比如改变构建流程、或者增加依赖库、工具等  
 ci       | 持续集成修改                      
 docs     | 文档修改                        
 feat     | 新特性、新功能                     
 fix      | 修改bug                       
 perf     | 优化相关，比如提升性能、体验              
 refactor | 代码重构                        
 revert   | 回滚到上一个版本                    
 style    | 代码格式修改, 注意不是 css 修改         
 test     | 测试用例修改                      

## yarn 常用命令

1. yarn init 初始化包
2. yarn add xxx 安装包
3. yarn remove xxx 移除包
4. yarn upgrade xxx 更新包
5. yarn add xxx --dev 安装开发依赖的包
6. yarn global add xxx 全局安装
7. yarn config set registry url 设置下载镜像的地址
8. yarn install 安装所有依赖 9、yarn run 执行包

# js数组操作

* join()
* join() 方法用于把数组中的所有元素放入一个字符串。元素是通过指定的分隔符进行分隔的，默认使用','号分割，不改变原数组。
* push()
* push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度
* pop()
* pop() 方法用于删除并返回数组的最后一个元素
* shift()
* shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。返回第一个元素，改变原数组
* unshift()
* unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。返回新长度，改变原数组。
* slice()
* slice()返回一个新的数组，
* splice()
* splice 删除数组固定位置的元素
* substring() 和 substr()
* 相同点：如果只是写一个参数，两者的作用都一样：都是是截取字符串从当前下标以后直到字符串最后的字符串片段。
* 不同点：第二个参数
* substr（startIndex,lenth）： 第二个参数是截取字符串的长度（从起始点截取某个长度的字符串）；
* substring（startIndex, endIndex）： 第二个参数是截取字符串最终的下标 （截取2个位置之间的字符串,‘含头不含尾’）。
* sort 排序
* 按照 Unicode code 位置排序，默认升序
* reverse()
* reverse() 方法用于颠倒数组中元素的顺序
* 详细的在此网站上查看
* https://www.jianshu.com/p/360aed2079b4

# 第三章



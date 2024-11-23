-- 这是一个注释
SELECT * FROM sys_user;



select * from sys_manager;

create table sys_user(
id bigint auto_increment,
name varchar(50),
age int,
sex varchar(2),
address varchar(300),
primary key(id)

)charset=utf8;

create table sys_role(
id bigint auto_increment,
role_name varchar(50),
primary key(id)

)charset=utf8;

insert into sys_user(name,age,sex,address) value('张三',29,'男','山东省济宁市曲阜市防山乡齐王坡');
insert into sys_user(name,age,sex,address) value('李四',20,'男','山东省济宁市曲阜市防山乡程庄');
insert into sys_user(name,age,sex,address) value('王五',21,'男','山东省济宁市曲阜市防山乡宋家村');
insert into sys_user(name,age,sex,address) value('孔娇',17,'女','山东省济宁市曲阜市防山乡纪庄');
insert into sys_user(name,age,sex,address) value('孔艳娇',21,'女','山东省济宁市曲阜市防山乡纪庄');

insert into sys_role(role_name) value('超级管理员');
insert into sys_role(role_name) value('普通用户');
insert into sys_role(role_name) value('测试用户');
insert into sys_role(role_name) value('水工');
insert into sys_role(role_name) value('电工');
insert into sys_role(role_name) value('机械工');
insert into sys_role(role_name) value('维修人员');
insert into sys_role(role_name) value('后勤人员');
insert into sys_role(role_name) value('巡查人员');

select * from sys_user;
select * from sys_role;













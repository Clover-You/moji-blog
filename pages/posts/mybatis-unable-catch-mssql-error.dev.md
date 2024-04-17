---
title: MyBatis 无法捕获MSSQL异常
author: Clover
date: 2024-04-07 20:50:01
lang: zh-CN
tags: java,
categories: NOTES
pid: 7384234-2341213
---

> 数据库使用的是SqlServer，后端使用的是 MyBatisPlus

在后端执行update语句去修改数据时，数据库有一个触发器检查当前修改的数据是否是某个状态，例如订单是否完成，如果完成了则抛出错误禁止修改。

但是在我执行sql语句后无法捕获触发器抛出的异常，执行正常但是响应行数为0（确定有数据）

```
==>  Preparing: update xxx_table SET status=?, actual_qty=? WHERE ticket_no = ? AND prd_id = ?
==> Parameters: 1(Integer), 26(Integer), 86896(Integer), 383(Integer)
<==    Updates: 0
```

```xml
<update id="updateXXX">
  update xxx_table
  <set>
    <if test="checkCut.status != null">
      status=#{checkCut.status,jdbcType=TINYINT},
    </if>
    <if test="checkCut.actualQty != null">
      actual_qty=#{checkCut.actualQty,jdbcType=INTEGER}
    </if>
  </set>
  <where>
    ticket_no = #{checkCut.ticketNo} AND prd_id = #{checkCut.prdId}
  </where>
</update>
```

自定义一个 `interceptor` 也拦截不到任何异常信息

```java
@Intercepts({
    @Signature(
        type = Executor.class,
        method = "update",
        args = {MappedStatement.class, Object.class}
    )
})
public class TestHandler implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        Object result = null;
        try {
            // 执行SQL语句
            result = invocation.proceed();
        } catch (Exception e) {
            if (e instanceof SQLException) {
                SQLException sqlException = (SQLException) e;
                // 从数据库中抛出来的异常，重新抛出
                throw sqlException;
            } else {
                // 包装成PersistenceException类型的异常
                throw new PersistenceException(e);
            }
        }
        return result;
    }

}
```

在DataGrip中跑这个sql，发现执行出现了错误。触发器抛出了异常，没错啊，可是MyBatis为何捕获不到异常?

```
UPDATE xxx_table SET actual_qty=18, status=1 WHERE (ticket_no = 12826 AND prd_id =154)
[2023-03-17 11:28:27] [S0002][50000] The ticket already completed, can not change the status!
[2023-03-17 11:28:27] 1 row affected in 69 ms
[2023-03-17 11:28:27] [S0001][3609] Line 1: The transaction ended in the trigger. The batch has been aborted.
```

MyBatis底层默认调用的是SimpleExecute 的 org.apache.ibatis.executor.statement.PreparedStatementHandler#update

## 解决

1. 设置 `set nocount on` 表示不返回受影响行数

2. 如果存储过程中抛出了自定义异常，那么异常级别必须大于10，因为1—10之间不会被catch捕获。19以后是非常严重的级别。

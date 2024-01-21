---
title: SQL queries
prev: ./table-mapping
next: ./kotysa-sqlite
---

# Type-safe SQL queries

Kotysa provides you a DSL to write type-safe SQL queries in pure Kotlin.

**Table of content**

[[toc]]

## Select

### Select one or several columns or tables

* Single select returns either column's type or table's mapped Entity type
* 2 selects return a `Pair<T, U>`
* 3 selects return a `Triple<T, U, V>`
* 4 selects and more return a `List<Any?>`

```kotlin
// select a Table, returns this table's mapped Entity (= will select all columns from this table)
fun selectUserById(id: Int) =
    (sqlClient select Users
        from Users
        where Users.id eq id
        ).fetchOne()

// select a single column
fun selectFirstnameById(id: Int) =
    (sqlClient select Users.firstname
        from Users
        where Users.id eq id
        ).fetchOne()

// returns Pair<String, String?>
fun selectFirstnameAndAliasById(id: Int) =
    (sqlClient select Users.firstname and Users.alias
        from Users
        where Users.id eq id
        ).fetchOne()

// returns Triple<String, UUID, String?>
fun selectFirstnameAndRoleIdAndAliasById(id: Int) =
    (sqlClient select Users.firstname and Users.roleId and Users.alias
        from Users
        where Users.id eq id
        ).fetchOne()

// returns List<Any?>
fun selectFirstnameAndLastnameAndAliasAndIsAdminById(id: Int) =
    (sqlClient select Users.firstname and Users.lastname and Users.alias and Users.isAdmin
        from Users
        where Users.id eq id
        ).fetchOne()

// fetchAll = multiple results
// returns List<Pair<String, String?>>
fun selectAllFirstnameAndAlias() =
    (sqlClient select Users.firstname and Users.alias
        from Users
        ).fetchAll()
```

### Count

Counts the number of rows having a non-null value for the specified column

```kotlin{2}
fun countWithAlias() =
    (sqlClient selectCount Users.alias
        from Users
        ).fetchOne()
```

### Distinct

Returns distinct values of the specified column

```kotlin{2}
val distinctFirstnames =
    (sqlClient selectDistinct Users.firstname
        from Users
        ).fetchAll()
```

### Min, max and sum

```kotlin{2,7,12}
fun selectUserMinId() =
    (sqlClient selectMin Users.id
        from Users
        ).fetchOne()

fun selectUserMaxId() =
    (sqlClient selectMax Users.id 
        from Users
        ).fetchOne()

fun selectUserSumId() =
    (sqlClient selectSum Users.id
        from Users
        ).fetchOne()
```

### Select from

Shortcut to return rows from a table as table's mapped Entity (= will select all columns from this table)

```kotlin{2,8}
fun selectFirstUserByFirstname(firstname: String) =
    (sqlClient selectFrom Users
        where Users.firstname eq firstname
        // null String forbidden ^^^^^^^^
        ).fetchFirst()

fun selectAllUsersByAliases(alias1: String?) =
    (sqlClient selectFrom Users
        where Users.alias eq alias1
        // null String accepted ^^
        // if alias1==null, Kotysa will generate "WHERE user.alias IS NULL" SQL
        ).fetchAll()
```

### Select all from

Shortcut to return all rows from a table as table's mapped Entity (= will select all columns from this table)

```kotlin
fun selectAll() = sqlClient selectAllFrom Users
```
* SqlClient returns a `List<User>`
* ReactorSqlCLient returns a `reactor.core.publisher.Flux<User>`
* VertxSqlClient returns a `io.smallrye.mutiny.Uni<List<User>>`
* CoroutinesSqlCLient returns a `kotlinx.coroutines.flow.Flow<User>`

### Count all from

Shortcut to return the total number of rows of a table
```kotlin
fun countAll() = sqlClient selectCountAllFrom Users
```

* SqlClient returns a `Long`
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Long>`
* VertxSqlClient returns a `io.smallrye.mutiny.Uni<Long>`
* CoroutinesSqlCLient is a **suspend function** that returns a `Long`

### Map selected columns to a DTO
`selectAndBuild` gives access to a code block that will be executed for each returned row

::: tip Tip
Allow you to build a DTO from columns of several tables
:::

```kotlin{7}
data class UserDto(
    val name: String,
    val alias: String?
)

fun selectAllUsersMappedToDto() =
    (sqlClient selectAndBuild { UserDto(it[Users.firstname]!!, it[Users.alias]) }
        from Users
        ).fetchAll()
```

* SqlClient returns a `List<UserDto>`
* ReactorSqlCLient returns a `reactor.core.publisher.Flux<UserDto>`
* VertxSqlClient returns a `io.smallrye.mutiny.Uni<List<UserDto>>`
* CoroutinesSqlCLient returns a `kotlinx.coroutines.flow.Flow<UserDto>`

### Or
SQL `OR` clause

```kotlin{4}
fun selectAllUsersByAliases(alias1: String?, alias2: String?) =
        (sqlClient selectFrom Users
            where Users.alias eq alias1
                or Users.alias eq alias2
            ).fetchAll()
```

### Join

Join database tables with `JOIN` clause(s) :
* innerJoin
* leftJoin
* rightJoin
* fullJoin

`JOIN` clauses can be chained.

```kotlin{3}
val admins =
    (sqlClient selectFrom Users
        innerJoin Roles on Users.roleId eq Roles.id
        where Roles.label eq "admin"
        ).fetchAll() // returns all admin users
```

Of course, you can also join tables using equality clause between columns too, this query returns the same results

```kotlin{3-4}
val admins =
    (sqlClient select Users
        from Users and Roles
        where Users.roleId eq Roles.id            
        and Roles.label eq "admin"
        ).fetchAll() // returns all admin users
```

### Limit and offset

For pagination, use `LIMIT` and `OFFSET`

```kotlin{3}
val pagination =
    (sqlClient selectFrom Users
        limit 5 offset 1
        ).fetchAll()
```

### Group by

```kotlin{4}
val countUsersGroupByCountry =
    (sqlClient selectCount Users.id and Users.country
        from Users
        groupBy Users.country
        ).fetchAll()
```

### Order by

```kotlin{3}
fun selectUserByIdAsc() =
    (sqlClient selectFrom Users
        orderByAsc Users.id
        ).fetchAll()
```

### Subqueries

Kotysa provides subquery support.

```kotlin{4-8,16-21,30-34,41-46,53-58}
// subquery in select
fun selectUserById(id: Int) =
  (sqlClient select Users.firstname
          and {
    (this select Roles.label
            from Roles
            where Roles.id eq Users.roleId)
  }
          from Users
          where Users.id eq id
          ).fetchOne()

// Kotysa supports case when exists subquery in select
fun selectCaseWhenExistsSubQuery(userIds: List<Int>) =
  (sqlClient selectDistinct Roles.label
          andCaseWhenExists {
    (this select Users.id
            from Users
            where Users.roleId eq Roles.id
            and Users.id `in` userIds)
  } then true `else` false
          from Roles)
    .fetchAll()

// subquery in where
fun selectRoleLabelWhereEqUserSubQuery(userId: Int) =
  (sqlClient select Roles.label
          from Roles
          where Roles.id eq
          {
            (this select Users.roleId
                    from Users
                    where Users.id eq userId)
          })
    .fetchOne()

// where exists subquery
fun selectRoleLabelWhereExistsUserSubQuery(userIds: List<Int>) =
  (sqlClient select Roles.label
          from Roles
          whereExists {
            (this select Users.id
                    from Users
                    where Users.roleId eq Roles.id
                    and Users.id `in` userIds)
          })
    .fetchAll()

// Kotysa supports case when exists subquery in order by
fun selectOrderByCaseWhenExistsSubQuery(userIds: List<Int>) =
  (sqlClient select Roles.label
          from Roles
          orderByDescCaseWhenExists {
    (this select Users.id
            from Users
            where Users.roleId eq Roles.id
            and Users.id `in` userIds)
  } then true `else` false
          andAsc Roles.label)
    .fetchAll()
```

### Aliases

Kotysa provides aliases support for columns and tables.

```kotlin{3,5,9,11,16-18}
// column alias. 2 syntaxes are available
fun selectAliasedFirstnameByFirstnameGet(firstname: String) =
  (sqlClient select H2Users.firstname `as` "fna"
          from H2Users
          where H2Users.firstname["fna"] eq firstname
          ).fetchOne()

fun selectAliasedFirstnameByFirstnameAlias(firstname: String) =
  (sqlClient select H2Users.firstname `as` "fna"
          from H2Users
          where QueryAlias<String>("fna") eq firstname
          ).fetchOne()

// table alias
fun selectFirstnameByFirstnameTableAlias(firstname: String) =
  (sqlClient select H2Users["u"].firstname
          from H2Users `as` "u"
          where H2Users["u"].firstname eq firstname
          ).fetchOne()
```

### Conditional queries

Kotysa offers a specific query syntax for complex queries with conditional clauses. \
Note : A query that uses `query.selects()` always returns a `List<Any?>` \
Here is an example.

```kotlin
fun selectConditionalSyntax(params: Int = 0): List<List<Any?>> {
    val selects = sqlClient.selects()
    selects.select(tableUsers.firstname)
    if (params > 0) {
        selects.select(tableUsers.lastname)
    }
    if (params > 1) {
        selects.select(tableRoles.label)
    }
        
    val froms = selects.froms()
    froms.from(tableUsers)
    if (params > 0) {
        froms.from(tableUserRoles)
    }
    if (params > 1) {
        froms.from(tableRoles)
    }

    val wheres = froms.wheres()
    wheres.where(tableUsers.id).sup(0)
    if (params > 0) {
        wheres.where(tableUserRoles.userId).eq(tableUsers.id)
    }
    if (params > 1) {
        wheres.where(tableRoles.id).eq(tableUserRoles.roleId)
    }

    val groupsBy = wheres.groupsBy()
    groupsBy.groupBy(tableUsers.firstname)
    if (params > 0) {
        groupsBy.groupBy(tableUsers.lastname)
    }
    if (params > 1) {
        groupsBy.groupBy(tableRoles.label)
    }

    val ordersBy = groupsBy.ordersBy()
    if (params > 0) {
        ordersBy.orderByDesc(tableUsers.lastname)
    }
    if (params > 1) {
        ordersBy.orderByAsc(tableRoles.label)
    }
    ordersBy.orderByAsc(tableUsers.firstname)

    return ordersBy.fetchAll()
}
```

### Fetch the database

Use the terminal operation that you need to fetch single or multiple results

**With kotysa-jdbc, kotysa-spring-jdbc and kotysa-sqlite**
* `fun fetchOne(): T?` returns one result
  * @throws NoResultException if no results
  * @throws NonUniqueResultException if more than one result
* `fun fetchOneOrNull(): T?` returns one result, or null if no results
  * @throws NonUniqueResultException if more than one result
* `fun fetchFirst(): T?` returns the first result
  * @throws NoResultException if no results
* `fun fetchFirstOrNull(): T?` returns the first result, or null if no results
* `fun fetchAll(): List<T>` returns several results as `List`, can be empty if no results
* `fun fetchAllStream(): Stream<T>` returns several results as `java.util.stream.Stream`, can be empty if no results

**With kotysa-r2dbc or kotysa-spring-r2dbc using Coroutines syntax**
* `suspend fun fetchOne(): T?` returns one result
  * @throws NoResultException if no results
  * @throws NonUniqueResultException if more than one result
* `suspend fun fetchOneOrNull(): T?` returns one result, or null if no results
  * @throws NonUniqueResultException if more than one result
* `suspend fun fetchFirst(): T?` returns the first result
  * @throws NoResultException if no results
* `suspend fun fetchFirstOrNull(): T?` returns the first result, or null if no results
* `fun fetchAll(): Flow<T>` returns several results as `kotlinx.coroutines.flow.Flow`, can be empty if no results

**With kotysa-spring-r2dbc using Reactor syntax**
* `fun fetchOne(): Mono<T>` returns one result as `reactor.core.publisher.Mono`, or an empty Mono if no result
  * @throws NonUniqueResultException if more than one result
* `fun fetchFirst(): Mono<T>` returns the first result as `reactor.core.publisher.Mono`, or an empty Mono if no
result
* `fun fetchAll(): Flux<T>` returns several results as `reactor.core.publisher.Flux`, or an empty Flux if no result

**With kotysa-vertx-sqlclient using Mutiny syntax**
* `fun fetchOne(): Uni<T>` returns one result as `io.smallrye.mutiny.Uni`, or an empty Uni if no result
  * @throws NonUniqueResultException if more than one result
* `fun fetchFirst(): Uni<T>` returns the first result as `io.smallrye.mutiny.Uni`, or an empty Uni if no result
* `fun fetchAll(): Uni<List<T>>` returns several results as `io.smallrye.mutiny.Uni` that contains a List, or an empty
Uni if no result

## Create table

Use `createTable` or `createTableIfNotExists`

```kotlin{1,3}
fun createTable() = sqlClient createTable Users
// or
fun createTable() = sqlClient createTableIfNotExists Users
```

* SqlClient returns void
* CoroutinesSqlCLient is a **suspend function** that returns void
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Void>`
* VertxSqlClient returns a `io.smallrye.mutiny.Uni<Void>`

## Insert

Insert one or several mapped objects in a database table

```kotlin{7-8}
private val roleUser = Role("user")
private val roleAdmin = Role("admin")

private val userJdoe = User("John", roleUser.id, "USA")
private val userBboss = User("Big boss", roleAdmin.id, "France", "TheBoss")

fun insertRoles() = sqlClient.insert(roleUser, roleAdmin)
fun insertUsers() = sqlClient.insert(userJdoe, userBboss)
```

* SqlClient returns void
* CoroutinesSqlCLient is a **suspend function** that returns void
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Void>`
* VertxSqlClient returns a `io.smallrye.mutiny.Uni<Void>`


### InsertAndReturn

Insert one or several mapped objects in a database table, and return the inserted objects,
useful for auto-incremented columns and/or columns with default values

```kotlin{3}
private val userCharles = User("Charles", roleUser.id, "United Kingdom")

fun insertUserAndReturn() = sqlClient insertAndReturn userCharles
```

::: tip
T corresponds to the inserted entity type
:::

* SqlClient returns `T` or a `List<T>` if several entities passed
* CoroutinesSqlCLient is a **suspend function** that returns `T` or a `kotlinx.coroutines.flow.Flow<T>` if several entities passed
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<T>` or a `reactor.core.publisher.Flux<T>` if several entities passed
* VertxSqlClient returns a `io.smallrye.mutiny.Uni<T>` or a `io.smallrye.mutiny.Multi<T>` if several entities passed

## Delete

### Normal delete

Delete rows from a table, return the number of deleted rows

```kotlin{2,4}
fun deleteById(id: Int) =
        (sqlClient deleteFrom Users
                where Users.id eq id
                ).execute()
```

* SqlClient returns Int
* CoroutinesSqlCLient is a **suspend function** that returns Int
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Int>`
* VertxSqlClient returns a `io.smallrye.mutiny.Uni<Int>`

### Delete all

Shortcut to delete all rows from a table, return the number of deleted rows

```kotlin
fun deleteAll() = sqlClient deleteAllFrom Users
```

* SqlClient returns Int
* CoroutinesSqlCLient is a **suspend function** that returns Int
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Int>`
* VertxSqlClient returns a `io.smallrye.mutiny.Uni<Int>`

## Update

Update rows from a table, return the number of updated rows

```kotlin{2-3,5}
fun updateUserFirstname(id: Int, newFirstname: String) =
        (sqlClient update Users
                set Users.firstname eq newFirstname
                where Users.id eq id
                ).execute()
```

You can also set a column with a column's value, and for number you can add or subtract from this column's value

```kotlin{2-3,5}
fun incrementUserMessageCount(id: Int) =
        (sqlClient update Users
                set Users.messageCount eq Users.messageCount plus 1
                where Users.id eq id
                ).execute()
```

* SqlClient returns Int
* CoroutinesSqlCLient is a **suspend function** that returns Int
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Int>`
* VertxSqlClient returns a `io.smallrye.mutiny.Uni<Int>`

## Transaction

Kotysa provides a functional Transaction support, all queries inside the transaction block will be transactional.

```kotlin
operator.transactional { transaction ->
    // for example : transaction will rollback when exiting this code block
    transaction.setRollbackOnly()

    // execute your queries inside this transaction
}
```

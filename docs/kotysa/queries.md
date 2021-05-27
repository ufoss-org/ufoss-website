---
title: Queries
prev: ./table-mapping
next: ./kotysa-android
---

# Type-safe SQL queries

Kotysa provides you a DSL to write type-safe SQL queries in pure Kotlin.

**Table of content**

[[toc]]

## Select

### Select from

Returns rows from a table as mapped Objects

```kotlin
fun selectFirstByFirstname(firstname: String) =
    (sqlClient selectFrom USER
        where USER.firstname eq firstname
        // null String forbidden ^^^^^^^^
        ).fetchFirst()

fun selectAllByAliases(alias1: String?) =
    (sqlClient selectFrom USER
        where USER.alias eq alias1
        // null String accepted ^^
        // if alias1==null, Kotysa will generate "WHERE user.alias IS NULL" SQL
        ).fetchAll()
```

### Count

Counts the number of rows having a non-null value for the specified column

```kotlin
fun countWithAlias() =
    (sqlClient selectCount USER.alias
        from USER
        ).fetchOne()
```

### Distinct

Returns distinct values of the specified column

```kotlin
val distinctFirstnames =
    (sqlClient selectDistinct USER.firstname
        from USER
        ).fetchAll()
```

### Min, max and sum

```kotlin
fun selectUserMinId() =
    (sqlClient selectMin USER.id
        from USER
        ).fetchOne()

fun selectUserMaxId() =
    (sqlClient selectMax USER.id 
        from USER
        ).fetchOne()

fun selectUserSumId() =
    (sqlClient selectSum USER.id
        from USER
        ).fetchOne()
```

### Select all from

Returns all rows from a table as mapped Objects

```kotlin
fun selectAll() = sqlClient selectAllFrom USER
```
* SqlClient returns a `List<User>`
* ReactorSqlCLient returns a `reactor.core.publisher.Flux<User>`
* CoroutinesSqlCLient returns a `kotlinx.coroutines.flow.Flow<User>`

### Count all from

Return the number of rows of a table
```kotlin
fun countAll() = sqlClient selectCountAllFrom USER
```

* SqlClient returns a `Long`
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Long>`
* CoroutinesSqlCLient is a **suspend function** that returns a `Long`

### Map selected columns to a DTO
Code block will be executed for each return rows

::: tip Tip
Allow you to build a DTO from columns of several tables
:::

```kotlin
data class UserDto(
    val name: String,
    val alias: String?
)

fun selectAllMappedToDto() =
    (sqlClient select { UserDto(it[USER.firstname]!!, it[USER.alias]) }
        from USER
        ).fetchAll()
```

### Or

```kotlin
fun selectAllByAliases(alias1: String?, alias2: String?) =
        (sqlClient selectFrom USER
            where USER.alias eq alias1
            or USER.alias eq alias2
            ).fetchAll()
```

### Join

Join database tables with join clause

```kotlin
val admins =
    (sqlClient selectFrom USER
        innerJoin ROLE on USER.roleId eq ROLE.id
        where ROLE.label eq "admin"
        ).fetchAll() // returns all admin users
```

### Limit and offset

For pagination, use LIMIT and OFFSET

```kotlin
val pagination =
    (sqlClient selectFrom USER
        limit 1 offset 1
        ).fetchAll()
```

### Group by

```kotlin
val countUsersGroupByCountry =
    (sqlClient selectCount USER.id and USER.country
        from USER
        groupBy USER.country
        ).fetchAll()
```

### Order by

```kotlin
fun selectUserByIdAsc() =
    (sqlClient selectFrom USER
        orderByAsc USER.id
        ).fetchAll()
```

### Fetch the database

::: tip
If you use kotysa-android or kotysa-spring-jdbc, use `org.ufoss.kotysa.SqlClient`
:::

**SqlClient**
* ```fun fetchOne(): T?``` returns one result
  * @throws NoResultException if no results
  * @throws NonUniqueResultException if more than one result
* ```fun fetchOneOrNull(): T?``` returns one result, or null if no results
  * @throws NonUniqueResultException if more than one result
* ```fun fetchFirst(): T?``` returns the first result
  * @throws NoResultException if no results
* ```fun fetchFirstOrNull(): T?``` returns the first result, or null if no results
* ```fun fetchAll(): List<T>``` returns several results as `List`, can be empty if no results
* ```fun fetchAllStream(): Stream<T>``` returns several results as `java.util.stream.Stream`, can be empty if no results

::: tip
If you use kotysa-spring-r2dbc, use reactive `org.ufoss.kotysa.r2dbc.ReactorSqlClient` or coroutines `org.ufoss.kotysa.CoroutinesSqlClient`
:::

**ReactorSqlClient**
* ```fun fetchOne(): Mono<T>``` returns one result as `reactor.core.publisher.Mono`, or an empty Mono if no result
  * @throws NonUniqueResultException if more than one result
* ```fun fetchFirst(): Mono<T>``` returns the first result as `reactor.core.publisher.Mono`, or an empty Mono if no result
* ```fun fetchAll(): Flux<T>``` returns several results as `reactor.core.publisher.Flux`, or an empty Flux if no result

**CoroutinesSqlClient**
* ```suspend fun fetchOne(): T?``` returns one result
  * @throws NoResultException if no results
  * @throws NonUniqueResultException if more than one result
* ```suspend fun fetchOneOrNull(): T?``` returns one result, or null if no results
  * @throws NonUniqueResultException if more than one result
* ```suspend fun fetchFirst(): T?``` returns the first result
  * @throws NoResultException if no results
* ```suspend fun fetchFirstOrNull(): T?``` returns the first result, or null if no results
* ```fun fetchAll(): Flow<T>``` returns several results as `kotlinx.coroutines.flow.Flow`, can be empty if no results

## Create table

Use `createTable` or `createTableIfNotExists`

```kotlin
fun createTable() = sqlClient createTable USER
// or
fun createTable() = sqlClient createTableIfNotExists USER
```

* SqlClient returns void
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Void>`
* CoroutinesSqlCLient is a **suspend function** that returns void

## Insert

Insert some mapped objects in a database table

```kotlin
private val roleUser = Role("user")
private val roleAdmin = Role("admin")

private val userJdoe = User("John", roleUser.id, "USA")
private val userBboss = User("Big boss", roleAdmin.id, "France", "TheBoss")

fun insert() = sqlClient.insert(jdoe, bboss)
```

## Delete

### Normal Delete

Delete rows from a table, return the number of deleted rows

```kotlin
fun deleteById(id: UUID) =
        (sqlClient deleteFrom USER
                where USER.id eq id
                ).execute()
```

* SqlClient returns Int
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Int>`
* CoroutinesSqlCLient is a **suspend function** that returns Int

### Delete all

Deletes all rows from a table, return the number of deleted rows

```kotlin
fun deleteAll() = sqlClient deleteAllFrom USER
```

* SqlClient returns Int
* ReactorSqlCLient returns a `reactor.core.publisher.Mono<Int>`
* CoroutinesSqlCLient is a **suspend function** that returns Int

## Update

Update rows from a table, return the number of updated rows

```kotlin
fun updateFirstname(newFirstname: String) =
        (sqlClient update USER
                set USER.firstname eq newFirstname
                ).execute()
```

## Transaction

Kotysa provides a functional Transaction support, all queries inside the transaction block will be transactional.

```kotlin
operator.execute<Unit> { transaction ->
    // transaction will rollback when exiting this code block
    transaction.setRollbackOnly()

    // do your queries
}
```

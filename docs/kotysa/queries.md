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

### Select and map results to a DTO
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

## Create table

Use `createTable` or `createTableIfNotExists`

```kotlin
fun createTable() = sqlClient createTable USER
// or
fun createTable() = sqlClient createTableIfNotExists USER
```

## Insert

Insert mapped objects in the database table

```kotlin
private val roleUser = Role("user")
private val roleAdmin = Role("admin")

private val userJdoe = User("John", roleUser.id, "USA")
private val userBboss = User("Big boss", roleAdmin.id, "France", "TheBoss")

fun insert() = sqlClient.insert(jdoe, bboss)
```

* ```select ...``` that returns one (```fetchOne()``` and ```fetchFirst()```) or several (```fetchAll()```) results
* ```createTable ...``` for table creation
* ```insert ...``` for single or multiple rows insertion
* ```deleteFrom ...``` that returns number of deleted rows
* ```update ...``` to update fields, returns number of updated rows

```kotlin
fun deleteAll() = sqlClient deleteAllFrom USER

fun deleteById(id: UUID) =
        (sqlClient deleteFrom USER
                where USER.id eq id
                ).execute()

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

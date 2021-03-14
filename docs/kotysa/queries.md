---
title: Queries
prev: ./table-mapping
next: ./kotysa-android
---

# Type-safe SQL queries

All Kotysa's **SqlClient** implementations support :
* ```select ...``` that returns one (```fetchOne()``` and ```fetchFirst()```) or several (```fetchAll()```) results
* ```createTable ...``` for table creation
* ```insert ...``` for single or multiple rows insertion
* ```deleteFrom ...``` that returns number of deleted rows
* ```update ...``` to update fields, returns number of updated rows

```kotlin
fun selectAll() = sqlClient selectAllFrom USER

fun countAll() = sqlClient selectCountAllFrom USER

fun countWithAlias() =
        (sqlClient selectCount USER.alias
                from USER
                ).fetchOne()

fun selectAllMappedToDto() =
        (sqlClient select { UserDto(it[USER.firstname]!!, it[USER.alias]) }
                from USER
                ).fetchAll()

fun selectFirstByFirstname(firstname: String) =
        (sqlClient selectFrom USER
                where USER.firstname eq firstname
                // null String forbidden ^^^^^^^^
                ).fetchFirst()

fun selectAllByAliases(alias1: String?, alias2: String?) =
        (sqlClient selectFrom USER
                where USER.alias eq alias1
                // null String accepted ^^
                // if alias1==null, Kotysa will generate "WHERE user.alias IS NULL" SQL
                or USER.alias eq alias2
                ).fetchAll()

val admins = (sqlClient selectFrom USER
        innerJoin ROLE on USER.roleId eq ROLE.id
        where ROLE.label eq "admin"
        ).fetchAll() // returns all admin users

fun createTable() = sqlClient createTable USER

fun insert() = sqlClient.insert(jdoe, bboss)

fun deleteAll() = sqlClient deleteAllFrom USER

fun deleteById(id: UUID) =
        (sqlClient deleteFrom USER
                where USER.id eq id
                ).execute()

fun updateFirstname(newFirstname: String) =
        (sqlClient update USER
                set USER.firstname eq newFirstname
                ).execute()

private val roleUser = Role("user")
private val roleAdmin = Role("admin")

private val userJdoe = User("John", roleUser.id)
private val userBboss = User("Big boss", roleAdmin.id, "TheBoss")

data class UserDto(
        val name: String,
        val alias: String?
)
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

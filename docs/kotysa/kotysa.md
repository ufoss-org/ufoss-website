---
title: Kotysa
prev: /dino/dino
next: ./table-mapping
---

# Kotysa

Kotysa is a light ORM that offers the idiomatic way to write **Ko**tlin **ty**pe-**sa**fe SQL for JVM and Android. \
Kotysa Query API is agnostic from Sql Engine : change your database engine or your web framework (Ktor, Spring...), but keep your SQL layer stable.

## Supported Databases

### On JVM
* MySQL : [MySQL supported data types](table-mapping.html#mysql)
* PostgreSQL : [PostgreSQL supported data types](table-mapping.html#postgresql)
* H2 : [H2 supported data types](table-mapping.html#h2)
* Microsoft SQL Server : [MSSQL supported data types](table-mapping.html#mssql)
* MariaDB : [MariaDB supported data types](table-mapping.html#mariadb)

If you use Spring, check [Kotysa for Spring JDBC](kotysa-spring-jdbc.html) for WebMVC or
[Kotysa for Spring R2DBC](kotysa-spring-r2dbc.html) for WebFlux, which supports both Reactive and Coroutines syntax

If you use Ktor, or anything else, check [Kotysa for JDBC](kotysa-jdbc.html) or [Kotysa for R2DBC](kotysa-r2dbc.html)
for Coroutines async SQL.

### On Android
Check [Kotysa for SqLite on Android](kotysa-android.html) : [SqLite supported data types](table-mapping.html#sqlite)

**Table of content**

[[toc]]

## Easy to use : 3 steps only

::: tip Description
No annotations, no code generation, no proxy, just regular Kotlin code ! No JPA, just pure SQL !
:::

### step 1 -> Create Kotlin entities

data classes are great for that !

```kotlin
data class Role(
        val label: String,
        val id: UUID = UUID.randomUUID()
)

data class User(
        val firstname: String,
        val roleId: UUID,
        val country: String,
        val alias: String? = null,
        val id: Int? = null
)
```

### step 2 -> Describe database model

Use [type-safe Tables DSL](table-mapping.html) to map your entities with the database tables,
this is the ORM (object-relational mapping) step

```kotlin
object Roles : H2Table<Role>("roles") {
    val id = uuid(Role::id)
            .primaryKey()
    val label = varchar(Role::label)
}

object Users : H2Table<User>("users") {
    val id = autoIncrementInteger(User::id)
            .primaryKey("PK_users")
    val firstname = varchar(User::firstname, "fname")
    val roleId = uuid(User::roleId)
            .foreignKey(Roles.id, "FK_users_roles")
    val country = varchar(User::country)
    val alias = varchar(User::alias)
}

// List all your mapped tables
private val tables = tables().h2(Roles, Users)
```

### step 3 -> Write SQL queries

Use [type-safe SqlClient DSL](queries.html), Kotysa executes SQL query for you !

You don't have to be aware of all subtle SQL differences between databases, Kotysa will generate the right SQL syntax for your database.

```kotlin
val admins = (sqlClient selectFrom Users
        innerJoin Roles on Users.roleId eq Roles.id
        where Roles.label eq "admin"
        ).fetchAll() // returns all admin users
```

### Samples

* See or [sample projects](https://github.com/ufoss-org/kotysa/tree/master/samples) for jdbc, r2dbc, spring-jdbc, spring-r2dbc-reactive and spring-r2dbc-coroutines.
* [Real world sample project](https://github.com/pull-vert/demo-kotlin) is a Spring Boot reactive web application with a R2DBC backend accessed via Kotysa, with HTTP2, JWT based Security, Bean validation, RestDoc...

## Source code

&#x1F468;&#x200D;&#x1F4BB; Open source code of Kotysa is available on [github](https://github.com/ufoss-org/kotysa), feel free to watch it, submit issues, contribute, fork, copy, whatever you want.

::: tip Status
Regular releases will provide new features to Kotysa, see [next milestones](https://github.com/ufoss-org/kotysa/milestones).
:::

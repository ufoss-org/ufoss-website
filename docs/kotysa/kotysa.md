---
title: Kotysa
prev: /dino/dino
next: ./table-mapping
---

# Kotysa

Kotysa is a light ORM that offers the idiomatic way to write **Ko**tlin **ty**pe-**sa**fe SQL.
Kotysa Query API is agnostic from Sql Engine : change database engine without code change.

## Supported Databases

* MySQL with [Spring JDBC](kotysa-spring-jdbc.html) or [Spring R2DBC](kotysa-spring-r2dbc.html) -> [MySQL supported data types](table-mapping.html#mysql)
* PostgreSQL with [Spring JDBC](kotysa-spring-jdbc.html) or [Spring R2DBC](kotysa-spring-r2dbc.html) -> [PostgreSQL supported data types](table-mapping.html#postgresql)
* H2 with [Spring JDBC](kotysa-spring-jdbc.html) or [Spring R2DBC](kotysa-spring-r2dbc.html) -> [H2 supported data types](table-mapping.html#h2)
* Microsoft SQL Server with [Spring JDBC](kotysa-spring-jdbc.html) or [Spring R2DBC](kotysa-spring-r2dbc.html) -> [MSSQL supported data types](table-mapping.html#mssql)
* [SqLite on Android](kotysa-android.html) -> [SqLite supported data types](table-mapping.html#sqlite)

**Table of content**

[[toc]]

## Easy to use : 3 steps only

::: tip Description
No annotations, no external configuration files, no code generation, just regular Kotlin code ! No JPA, just pure SQL !
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
object ROLE : H2Table<Role>("roles") {
    val id = uuid(Role::id)
            .primaryKey()
    val label = varchar(Role::label)
}

object USER : H2Table<User>("users") {
    val id = autoIncrementInteger(User::id)
            .primaryKey("PK_users")
    val firstname = varchar(User::firstname, "fname")
    val roleId = uuid(User::roleId)
            .foreignKey(ROLE.id, "FK_users_roles")
    val country = varchar(User::country)
    val alias = varchar(User::alias)
}

// List all your mapped tables
private val tables = tables().h2(ROLE, USER)
```

### step 3 -> Write SQL queries

Use [type-safe SqlClient DSL](queries.html), Kotysa generates SQL for you !

You don't have to be aware of all subtle SQL differences between databases, Kotysa will generate the right SQL syntax for your database.

```kotlin
val admins = (sqlClient selectFrom USER
        innerJoin ROLE on USER.roleId eq ROLE.id
        where ROLE.label eq "admin"
        ).fetchAll() // returns all admin users
```

::: tip Notice
Kotysa provides [Kotlin Coroutines first class support with R2DBC](kotysa-spring-r2dbc.html#coroutines-first-class-support)
:::

### Samples

* See [basic sample projects for jdbc, r2dbc-reactive and r2dbc-coroutines](https://github.com/ufoss-org/kotysa/tree/master/samples), using Spring Boot with [spring-fu](https://github.com/spring-projects-experimental/spring-fu).
* [Real world sample project](https://github.com/pull-vert/demo-kotlin) is a Spring Boot reactive web application with a R2DBC backend accessed via Kotysa, with HTTP2, JWT based Security, Bean validation, RestDoc...

## Source code

&#x1F468;&#x200D;&#x1F4BB; Open source code of Kotysa is available on [github](https://github.com/ufoss-org/kotysa), feel free to watch it, submit issues, contribute, fork, copy, whatever you want.

::: tip Status
Regular releases will provide new features to Kotysa, see [next milestones](https://github.com/ufoss-org/kotysa/milestones).
:::

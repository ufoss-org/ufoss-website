---
title: Kotysa
prev: /dino/dino
next: ./table-mapping
---

# Kotysa

The idiomatic way to write **Ko**tlin **ty**pe-**sa**fe SQL.

::: warning
Kotysa is still in active development phase. Regular early releases will provide new features, see [next milestones](https://github.com/ufoss-org/kotysa/milestones).
:::

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
        val alias: String? = null,
        val id: UUID = UUID.randomUUID()
)
```

### step 2 -> Describe database model

Use [type-safe Tables DSL](table-mapping.html) to map your entities with the database tables,
this is the ORM (object-relational mapping) step

```kotlin
val tables =
        tables().postgresql { // choose database type
            table<Role> {
                name = "roles"
                column { it[Role::id].uuid() }
                    .primaryKey()
                column { it[Role::label].varchar() }
            }
            table<User> {
                name = "users"
                column { it[User::id].uuid() }
                    .primaryKey()
                column { it[User::firstname].varchar {
                    name = "first-name"
                } }
                column { it[User::roleId].uuid() }
                    .foreignKey<Role>()
                column { it[User::alias].varchar() }
            }
        }
```

### step 3 -> Write SQL queries

Use [type-safe SqlClient DSL](queries.html), Kotysa generates SQL for you !

You don't have to be aware of all SQL differences between databases, Kotysa will generate the right SQL syntax for your database.

```kotlin
val admins = sqlClient.select<User>()
        .innerJoin<Role>().on { it[User::roleId] }
        .where { it[Role::label] eq "admin" }
        .fetchAll() // returns all admin users
```

## Getting started

Kotysa is agnostic from Sql Engine :
* use Kotysa with [Spring R2DBC](kotysa-spring-r2dbc.html)
* use Kotysa with [Spring JDBC](kotysa-spring-jdbc.html)
* use Kotysa with [SqLite on Android](kotysa-android.html)

::: tip Notice
Kotysa provides [Kotlin Coroutines first class support with R2DBC](kotysa-spring-r2dbc.html#coroutines-first-class-support)
:::

### Samples

* See [basic sample projects](https://github.com/ufoss-org/kotysa/tree/master/samples).
* [Real world sample project with R2DBC](https://github.com/pull-vert/demo-kotlin) is a Spring Boot Reactive web application with a R2DBC backend accessed via Kotysa, HTTP2, JWT based Security, Bean validation, RestDoc...

## Source code

&#x1F468;&#x200D;&#x1F4BB; Open source code is available on [github](https://github.com/ufoss-org/kotysa), feel free to watch it, contribute, fork, copy, whatever you want.

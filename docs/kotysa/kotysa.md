---
title: Kotysa
prev: /dino/dino
next: ./table-mapping
---

# Kotysa

The idiomatic way to write **Ko**tlin **ty**pe-**sa**fe SQL.

::: warning
Kotysa is still in active development phase, some key features are still missing. Regular early releases will provide new features, see [next milestones](https://github.com/ufoss-org/kotysa/milestones).
:::

**Table of content**

[[toc]]

## Easy to use : 3 steps only
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

Use [type-safe DSL](table-mapping) to map database model based to entities

```kotlin
val tables =
        tables().postgresql { // choose database type
            table<Role> {
                name = "roles"
                column { it[Role::id].uuid() }.primaryKey()
                column { it[Role::label].varchar() }
            }
            table<User> {
                name = "users"
                column { it[User::id].uuid() }.primaryKey()
                column { it[User::firstname].varchar().name("first-name") }
                column { it[User::roleId].uuid() }.foreignKey<Role>()
                column { it[User::alias].varchar() }
            }
        }
```

### step 3 -> Write SQL queries

Use [type-safe SqlClient DSL](queries), Kotysa generates SQL for you !

```kotlin
val admins = sqlClient.select<User>()
        .innerJoin<Role>().on { it[User::roleId] }
        .where { it[Role::label] eq "admin" }
        .fetchAll() // returns all admin users
```

::: tip Description
No annotations, no code generation, just regular Kotlin code ! No JPA, just pure SQL !
:::

## Getting started

Kotysa is agnostic from Sql Engine (SqLite on Android and R2DBC. JDBC in future) :
* use Kotysa with [Spring data R2DBC](kotysa-spring-r2dbc)
* use Kotysa with [SqLite on Android](kotysa-android)

::: tip Notice
Kotysa provides [Kotlin Coroutines first class support with R2DBC](kotysa-spring-r2dbc#coroutines-first-class-support)
:::

### Samples

* See [basic sample projects](https://github.com/ufoss-org/kotysa/tree/master/samples).
* [Real world sample project with R2DBC](https://github.com/pull-vert/demo-kotlin) is a Spring Boot Reactive web application with a R2DBC backend accessed via Kotysa, HTTP2, JWT based Security, Bean validation, RestDoc...

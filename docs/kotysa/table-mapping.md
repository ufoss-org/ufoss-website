---
title: Table mapping
prev: ./kotysa
next: ./queries
---

# Table mapping

This step allows describing how to map a table to a class (aka Entity).

**Table of content**

[[toc]]

## Describe database model with type-safe DSL

These are 2 simple entities that we will use :

```kotlin
data class Role(
        val label: String,
        val id: UUID = UUID.randomUUID()
)

data class User(
        val firstname: String,
        val lastname: String,
        val isAdmin: Boolean,
        val roleId: UUID,
        val alias: String? = null,
        val id: UUID = UUID.randomUUID()
)
```

Use Kotysa's ```tables``` functional DSL to define all mappings rules (columns, primary and foreign keys...) beetween
your entities and the database tables, this is the ORM (object-relational mapping) step in Kotlin.

This DSL is based on type and nullability of your entities fields.

```kotlin
val tables =
        tables().h2 { // choose database type
            table<Role> {
                name = "roles"
                column { it[Role::id].uuid() }
                    .primaryKey()
                column { it[Role::label].varchar() }
            }
            table<User> {
                name = "users"
                column { it[User::id].uuid() }.primaryKey()
                column { it[User::firstname].varchar {
                    name = "fname"
                } }
                column { it[User::lastname].varchar {
                    name = "lname"
                } }                
                column { it[User::isAdmin].boolean() }
                column { it[User::roleId].uuid() }
                    .foreignKey<Role>()
                column { it[User::alias].varchar() }
            }
        }
```

## Data types

More supported data types will be added later.

Kotysa uses Java 8+ ```java.time.*``` (and Kotlinx-datetime equivalents) types for dates.

### H2

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description
        <th>SQL type</th>
    </tr>
    <tr>
        <td>String</td>
        <td>Represents a variable-length character string, maximum length fixed</td>
        <td>varchar</td>
    </tr>
    <tr>
        <td>java.time.LocalDate or kotlinx.datetime.LocalDate</td>
        <td>Represents a date without time part and without timezone</td>
        <td>date</td>
    </tr>
    <tr>
        <td rowspan="2">java.time.LocalDateTime or kotlinx.datetime.LocalDateTime</td>
        <td rowspan="2">Represents a date+time without timezone</td>
        <td>timestamp</td>
    </tr>
    <tr>
        <td>datetime</td>
    </tr>
    <tr>
        <td>java.time.OffsetDateTime</td>
        <td>Represents a date+time with timezone</td>
        <td>timestampWithTimeZone</td>
    </tr>
    <tr>
        <td>java.time.LocalTime</td>
        <td>Represents a time without a date part and without timezone</td>
        <td>time</td>
    </tr>
    <tr>
        <td>Boolean</td>
        <td>Represents a boolean state. Nullable Boolean is not allowed !</td>
        <td>boolean</td>
    </tr>
    <tr>
        <td>java.util.UUID</td>
        <td>Universally unique identifier (128 bit value)</td>
        <td>uuid</td>
    </tr>
    <tr>
        <td rowspan="2">Int</td>
        <td>Represents an integer</td>
        <td>integer</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented integer</td>
        <td>autoIncrementInteger</td>
    </tr>
</table>

### PostgreSQL

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description
        <th>SQL type</th>
    </tr>
    <tr>
        <td>String</td>
        <td>Represents a variable-length character string, maximum length fixed</td>
        <td>varchar</td>
    </tr>
    <tr>
        <td>java.time.LocalDate or kotlinx.datetime.LocalDate</td>
        <td>Represents a date without time part and without timezone</td>
        <td>date</td>
    </tr>
    <tr>
        <td>java.time.LocalDateTime or kotlinx.datetime.LocalDateTime</td>
        <td>Represents a date+time without timezone</td>
        <td>timestamp</td>
    </tr>
    <tr>
        <td>java.time.OffsetDateTime</td>
        <td>Represents a date+time with timezone.<br />PostgreSQL uses UTC timezone to store TIMESTAMP WITH TIME ZONE, so you may have to override equals to use Instant based "isEqual" method on java.time.OffsetDateTime fields</td>
        <td>timestampWithTimeZone</td>
    </tr>
    <tr>
        <td>java.time.LocalTime</td>
        <td>Represents a time without a date part and without timezone</td>
        <td>time</td>
    </tr>
    <tr>
        <td>Boolean</td>
        <td>Represents a boolean state. Nullable Boolean is not allowed !</td>
        <td>boolean</td>
    </tr>
    <tr>
        <td>java.util.UUID</td>
        <td>Universally unique identifier (128 bit value)</td>
        <td>uuid</td>
    </tr>
    <tr>
        <td rowspan="2">Int</td>
        <td>Represents an integer</td>
        <td>integer</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented integer</td>
        <td>serial</td>
    </tr>
</table>

### MySQL

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description
        <th>SQL type</th>
    </tr>
    <tr>
        <td>String</td>
        <td>Represents a variable-length character string, maximum length fixed (size is mandatory in MySQL)</td>
        <td>varchar</td>
    </tr>
    <tr>
        <td>java.time.LocalDate or kotlinx.datetime.LocalDate</td>
        <td>Represents a date without time part and without timezone</td>
        <td>date</td>
    </tr>
    <tr>
        <td>java.time.LocalDateTime or kotlinx.datetime.LocalDateTime</td>
        <td>Represents a date+time without timezone</td>
        <td>datetime</td>
    </tr>
    <tr>
        <td>java.time.LocalTime</td>
        <td>Represents a time without a date part and without timezone</td>
        <td>time</td>
    </tr>
    <tr>
        <td>Boolean</td>
        <td>Represents a boolean state. Nullable Boolean is not allowed !</td>
        <td>boolean</td>
    </tr>
    <tr>
        <td rowspan="2">Int</td>
        <td>Represents an integer</td>
        <td>integer</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented integer</td>
        <td>autoIncrementInteger</td>
    </tr>
</table>

### SqLite

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description
        <th>SQL type</th>
    </tr>
    <tr>
        <td>String</td>
        <td>Represents a variable-length character string, maximum length fixed</td>
        <td>text</td>
    </tr>
    <tr>
        <td>java.time.LocalDate or kotlinx.datetime.LocalDate</td>
        <td>Represents a date without time part and without timezone</td>
        <td>text</td>
    </tr>
    <tr>
        <td>java.time.LocalDateTime or kotlinx.datetime.LocalDateTime</td>
        <td>Represents a date+time without timezone</td>
        <td>text</td>
    </tr>
    <tr>
        <td>java.time.OffsetDateTime</td>
        <td>Represents a date+time with timezone</td>
        <td>text</td>
    </tr>
    <tr>
        <td>java.time.LocalTime</td>
        <td>Represents a time without a date part and without timezone</td>
        <td>text</td>
    </tr>
    <tr>
        <td>Boolean</td>
        <td>Represents a boolean state. Nullable Boolean is not allowed !</td>
        <td>integer</td>
    </tr>
    <tr>
        <td>Int</td>
        <td>Represents an integer</td>
        <td>integer</td>
    </tr>
</table>

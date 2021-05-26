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
object ROLE : H2Table<Role>("roles") {
    val id = uuid(Role::id)
            .primaryKey()
    val label = varchar(Role::label)
}

object USER : H2Table<User>("users") {
    val id = uuid(User::id)
            .primaryKey("PK_users")
    val firstname = varchar(User::firstname, "fname")
    val lastname = varchar(User::lastname, "lname")
    val isAdmin = boolean(User::isAdmin)
    val roleId = uuid(User::roleId)
            .foreignKey(ROLE.id, "FK_users_roles")
    val alias = varchar(User::alias)
}

private val tables = tables().h2(ROLE, USER)
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
    <tr>
        <td rowspan="2">Long</td>
        <td>Represents a long</td>
        <td>bigInt</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented long</td>
        <td>autoIncrementBigInt</td>
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
    <tr>
        <td rowspan="2">Long</td>
        <td>Represents a long</td>
        <td>bigInt</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented long</td>
        <td>bigSerial</td>
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
    <tr>
        <td rowspan="2">Long</td>
        <td>Represents a long</td>
        <td>bigInt</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented long</td>
        <td>autoIncrementBigInt</td>
    </tr>
</table>

### MSSQL

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
        <td>Boolean</td>
        <td>Represents a boolean state. Nullable Boolean is not allowed !</td>
        <td>bit</td>
    </tr>
    <tr>
        <td rowspan="2">Int</td>
        <td>Represents an integer</td>
        <td>integer</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented integer</td>
        <td>identityInteger</td>
    </tr>
    <tr>
        <td rowspan="2">Long</td>
        <td>Represents a long</td>
        <td>bigInt</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented long</td>
        <td>identityBigInt</td>
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
        <td rowspan="2">Int</td>
        <td>Represents an integer</td>
        <td>integer</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented integer</td>
        <td>autoIncrementInteger</td>
    </tr>
    <tr>
        <td rowspan="2">Long</td>
        <td>Represents a long</td>
        <td>integer</td>
    </tr>
    <tr>
        <td>Represents an auto-incremented long</td>
        <td>autoIncrementInteger</td>
    </tr>
</table>

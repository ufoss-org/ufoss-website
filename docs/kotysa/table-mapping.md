---
title: Table mapping
prev: ./kotysa
next: ./queries
---

# Table mapping

This step allows describing how to map a table to a class (aka Entity).

**Table of content**

[[toc]]

## Mapping of the database model

### Entities = simple Kotlin classes

Kotlin's [data classes](https://kotlinlang.org/docs/data-classes.html) are great for entities because their main purpose
is to hold data. \
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
        val messageCount: Int = 0,
        val alias: String? = null,
        val id: Int? = null
)
```

### Mapping entities to database tables

Define all mappings rules (columns, primary and foreign keys, indexes...) between your entities and the database tables.
This is the ORM (object-relational mapping) step.

This DSL is based on type and nullability of your entities fields.

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
    val lastname = varchar(User::lastname, "lname")
    val isAdmin = boolean(User::isAdmin)
    val roleId = uuid(User::roleId)
            .foreignKey(Roles.id, "FK_users_roles")
    val messageCount = integer(User::messageCount)
    val alias = varchar(User::alias)
}

private val tables = tables().h2(Roles, Users)
```

### Declare your indexes

In Kotysa, indexes are part of the table mapping. Just add `unique` on a column, or create an `index` from several
columns of a table.

```kotlin
object Roles : H2Table<Role>("roles") {
    val id = uuid(Role::id)
        .primaryKey()
    val label = varchar(Role::label)
        .unique() // unique index on label column
}

object Users : H2Table<User>("users") {
    // ...
    val firstname = varchar(User::firstname, "fname")
    val lastname = varchar(User::lastname, "lname")
    // ...
    init {
        // creates an index on the firstname, lastname column pair
        index(setOf(firstname, lastname), indexName = "full_name_index")
    }
}
```

## Data types

Kotysa uses Java 8+ ```java.time.*``` and `kotlinx-datetime` corresponding types for dates.

### PostgreSQL

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description</th>
        <th>SQL type</th>
    </tr>
    <tr>
        <td rowspan="2">String</td>
        <td>Represents a variable-length character string, maximum length fixed</td>
        <td>varchar</td>
    </tr>
    <tr>
        <td>Represents a variable-length character string, unlimited length</td>
        <td>text</td>
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
        <td>Represents a boolean state</td>
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
    <tr>
        <td>Float</td>
        <td>Represents a single precision floating point number</td>
        <td>real</td>
    </tr>
    <tr>
        <td>Double</td>
        <td>Represents a double precision floating point number</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>BigDecimal</td>
        <td>Represents a exact decimal number with fixed precision and scale</td>
        <td>decimal or numeric</td>
    </tr>
    <tr>
        <td>ByteArray</td>
        <td>Binary object stored as bytes</td>
        <td>bytea</td>
    </tr>
</table>

### MySQL

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description</th>
        <th>SQL type</th>
    </tr>
    <tr>
        <td rowspan="5">String</td>
        <td>Represents a variable-length character string, maximum length fixed (size is mandatory in MySQL). Default size = 255</td>
        <td>varchar</td>
    </tr>
    <tr>
        <td>Represents a variable-length character string, max length = 255</td>
        <td>tinytext</td>
    </tr>
    <tr>
        <td>Represents a variable-length character string, max length = 65_535</td>
        <td>text</td>
    </tr>
    <tr>
        <td>Represents a variable-length character string, max length = 16_777_215</td>
        <td>mediumtext</td>
    </tr>
    <tr>
        <td>Represents a variable-length character string, max length = 4_294_967_295</td>
        <td>longtext</td>
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
        <td>Represents a boolean state</td>
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
    <tr>
        <td>Float</td>
        <td>Represents a single precision floating point number</td>
        <td>float</td>
    </tr>
    <tr>
        <td>Double</td>
        <td>Represents a double precision floating point number</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>BigDecimal</td>
        <td>Represents a exact decimal number with fixed precision and scale</td>
        <td>decimal or numeric</td>
    </tr>
    <tr>
        <td rowspan="2">ByteArray</td>
        <td>Binary object stored as bytes</td>
        <td>binary</td>
    </tr>
    <tr>
        <td>Large binary object stored as bytes<br />=> only supported with jdbc</td>
        <td>blob</td>
    </tr>
</table>

### H2

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description</th>
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
        <td>Represents a boolean state</td>
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
    <tr>
        <td>Float</td>
        <td>Represents a single precision floating point number</td>
        <td>real</td>
    </tr>
    <tr>
        <td>Double</td>
        <td>Represents a double precision floating point number</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>BigDecimal</td>
        <td>Represents a exact decimal number with fixed precision and scale</td>
        <td>decimal or numeric</td>
    </tr>
    <tr>
        <td rowspan="2">ByteArray</td>
        <td>Binary object stored as bytes</td>
        <td>binary</td>
    </tr>
    <tr>
        <td>Large binary object stored as bytes<br />=> only supported with jdbc</td>
        <td>blob</td>
    </tr>
</table>

### MSSQL

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description</th>
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
        <td>datetime</td>
    </tr>
    <tr>
        <td>Boolean</td>
        <td>Represents a boolean state</td>
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
    <tr>
        <td>Float</td>
        <td>Represents a single precision floating point number</td>
        <td>real</td>
    </tr>
    <tr>
        <td>Double</td>
        <td>Represents a double precision floating point number</td>
        <td>float</td>
    </tr>
    <tr>
        <td>BigDecimal</td>
        <td>Represents a exact decimal number with fixed precision and scale</td>
        <td>decimal or numeric</td>
    </tr>
    <tr>
        <td>ByteArray</td>
        <td>Binary object stored as bytes</td>
        <td>binary</td>
    </tr>
</table>

### MariaDB

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description</th>
        <th>SQL type</th>
    </tr>
    <tr>
        <td rowspan="5">String</td>
        <td>Represents a variable-length character string, maximum length fixed (size is mandatory in MariaDB). Default size = 255</td>
        <td>varchar</td>
    </tr>
    <tr>
        <td>Represents a variable-length character string, max length = 255</td>
        <td>tinytext</td>
    </tr>
    <tr>
        <td>Represents a variable-length character string, max length = 65_535</td>
        <td>text</td>
    </tr>
    <tr>
        <td>Represents a variable-length character string, max length = 16_777_215</td>
        <td>mediumtext</td>
    </tr>
    <tr>
        <td>Represents a variable-length character string, max length = 4_294_967_295</td>
        <td>longtext</td>
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
        <td>Represents a boolean state</td>
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
    <tr>
        <td>Float</td>
        <td>Represents a single precision floating point number</td>
        <td>float</td>
    </tr>
    <tr>
        <td>Double</td>
        <td>Represents a double precision floating point number</td>
        <td>double precision</td>
    </tr>
    <tr>
        <td>BigDecimal</td>
        <td>Represents a exact decimal number with fixed precision and scale</td>
        <td>decimal or numeric</td>
    </tr>
    <tr>
        <td rowspan="2">ByteArray</td>
        <td>Binary object stored as bytes</td>
        <td>binary</td>
    </tr>
    <tr>
        <td>Large binary object stored as bytes<br />=> only supported with jdbc</td>
        <td>blob</td>
    </tr>
</table>

### SqLite

<table>
    <tr>
        <th>Kotlin type</th>
        <th>Description</th>
        <th>SQL type</th>
    </tr>
    <tr>
        <td>String</td>
        <td>Represents a variable-length character string, maximum length fixed</td>
        <td rowspan="5">text</td>
    </tr>
    <tr>
        <td>java.time.LocalDate or kotlinx.datetime.LocalDate</td>
        <td>Represents a date without time part and without timezone</td>
    </tr>
    <tr>
        <td>java.time.LocalDateTime or kotlinx.datetime.LocalDateTime</td>
        <td>Represents a date+time without timezone</td>
    </tr>
    <tr>
        <td>java.time.OffsetDateTime</td>
        <td>Represents a date+time with timezone</td>
    </tr>
    <tr>
        <td>java.time.LocalTime</td>
        <td>Represents a time without a date part and without timezone</td>
    </tr>
    <tr>
        <td>Boolean</td>
        <td>Represents a boolean state</td>
        <td rowspan="2">integer</td>
    </tr>
    <tr>
        <td rowspan="2">Int</td>
        <td>Represents an integer</td>
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
    <tr>
        <td>Float</td>
        <td>Represents a single precision floating point number</td>
        <td rowspan="2">real</td>
    </tr>
    <tr>
        <td>Double</td>
        <td>Represents a double precision floating point number</td>
    </tr>
    <tr>
        <td>ByteArray</td>
        <td>Binary object stored as bytes</td>
        <td>blob</td>
    </tr>
</table>

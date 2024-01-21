---
title: Kotysa for Spring JDBC
prev: ./kotysa-sqlite
next: ./kotysa-spring-r2dbc
---

# Kotysa for Spring JDBC

## Dependency

`kotysa-spring-jdbc` is a single dependency you can add to your Spring project. \
This is a companion version for `spring-jdbc` 6.0.x (included in Spring boot 3.0.X) and does not replace it.

```groovy{6}
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-spring-jdbc:3.2.1'
    
    implementation 'org.springframework:spring-jdbc'
}
```

Check this [sample project](https://github.com/ufoss-org/kotysa/tree/master/samples/kotysa-spring-jdbc) for a Spring
Boot Servlet WebMVC application with a JDBC backend accessed via `kotysa-spring-jdbc`

## Usage

`kotysa-spring-jdbc` provides a SQL client on top of `spring-jdbc`, 
it can be obtained via an Extension function directly on spring-jdbc's ```JdbcOperations```.

```kotlin
class Repository(client: JdbcOperations, tables: H2Tables) {

	private val sqlClient = client.sqlClient(tables)

	// enjoy sqlClient for spring-jdbc :)
}
```

## Supported databases

* [MySQL](table-mapping.html#mysql)
* [PostgreSQL](table-mapping.html#postgresql)
* [MSSQL](table-mapping.html#mssql)
* [MariaDB](table-mapping.html#mariadb)
* [H2](table-mapping.html#h2)
* [Oracle](table-mapping.html#oracle)

## Transaction

`kotysa-spring-jdbc` provides a transaction on top of `spring-tx`, 
it can be obtained via an Extension function directly on spring-tx's ```TransactionOperations```.

```kotlin
class Service(template: TransactionOperations) {

	private val operator = template.transactionalOp()

	// use transaction
}
```

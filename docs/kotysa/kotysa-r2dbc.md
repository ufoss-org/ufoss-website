---
title: Kotysa for R2DBC
prev: ./kotysa-jdbc
next: ./kotysa-vertx-sqlclient
---

# Kotysa for R2DBC

## Dependency

`kotysa-r2dbc` is a single dependency you can add to your project, compatible with R2DBC 1.0.0.

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-r2dbc:3.0.2'

    // Choose the right R2DBC driver for your database
    runtimeOnly 'io.r2dbc:r2dbc-h2:xyz'
    runtimeOnly 'org.mariadb:r2dbc-mariadb:xyz'
    runtimeOnly 'com.github.jasync-sql:jasync-r2dbc-mysql:xyz'
    runtimeOnly 'io.r2dbc:r2dbc-mssql:xyz'
    runtimeOnly 'org.postgresql:r2dbc-postgresql:xyz'
    runtimeOnly 'com.oracle.database.r2dbc:oracle-r2dbc:xyz'
}
```

Check this [sample project](https://github.com/ufoss-org/kotysa/tree/master/samples/kotysa-ktor-r2dbc-coroutines) for a
Ktor Netty application, that provides Coroutines support by default, with a R2DBC backend accessed via `kotysa-r2dbc`

## Usage

`kotysa-r2dbc` provides a coroutines SQL client on top of `r2dbc-spi`, 
it can be obtained via an Extension function directly on ```io.r2dbc.spi.ConnectionFactory```.

It provides a SQL client API using ```suspend``` functions, and ```Flow``` from [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines).

```kotlin
class Repository(connectionFactory: ConnectionFactory, tables: H2Tables) {

	private val sqlClient = connectionFactory.coSqlClient(tables)

	// enjoy coroutines sqlClient for r2dbc :)
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

In `kotysa-r2dbc`, transaction is available directly on the sqlClient.

```kotlin
sqlClient.transactional { transaction ->
    // execute your queries inside this transaction
}
```

---
title: Kotysa for Vertx Sqlclient
prev: ./kotysa-r2dbc
next: ./postgresql-textsearch
---

# Kotysa for Vertx sqlclient

## Dependency

`kotysa-vertx-sqlclient` is a single dependency you can add to your project. \
This is a companion version for `smallrye-mutiny-vertx-sql-client` 2.X.Y, included in Quarkus 2.13.X and does not replace it.

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-vertx-sqlclient:2.3.3'

    // Choose the right R2DBC driver for your database
    implementation "io.smallrye.reactive:smallrye-mutiny-vertx-pg-client:xyz"
    // for both mysql and mariadb
    implementation "io.smallrye.reactive:smallrye-mutiny-vertx-mysql-client:xyz"
    implementation "io.smallrye.reactive:smallrye-mutiny-vertx-mssql-client:xyz"
}
```

Check this [sample project](https://github.com/ufoss-org/kotysa/tree/master/samples/kotysa-quarkus-vertx-sqlclient) for
a Quarkus Reactive Resteasy application with a Mutiny Vertx Sqlclient backend accessed via `kotysa-vertx-sqlclient`.

## Usage

`kotysa-vertx-sqlclient` provides a reactive SQL client on top of `smallrye-mutiny-vertx-sql-client`, 
it can be obtained via an Extension function directly on ```io.vertx.mutiny.sqlclient.Pool```.

It provides a SQL client API using ```Uni``` and ```Multi``` from Mutiny.

```kotlin
class Repository(private val dbClient: PgPool, private val tables: PostgresqlTables) {

    @Produces
    fun sqlClient() = dbClient.sqlClient(tables)

	// enjoy reactive sqlClient for Quarkus with Vertx sqlclient :)
}
```

## Supported databases

* [MySQL](table-mapping.html#mysql)
* [PostgreSQL](table-mapping.html#postgresql)
* [MSSQL](table-mapping.html#mssql)
* [MariaDB](table-mapping.html#mariadb)

## Transaction

In `kotysa-vertx-sqlclient`, transaction is available directly on the sqlClient.

```kotlin
sqlClient.transactional { transaction ->
    // execute your queries inside this transaction
}
```

---
title: Kotysa for Vertx Sqlclient
prev: ./kotysa-r2dbc
next: ./postgresql-textsearch
---

# Kotysa for Vertx sqlclient

## Dependency

`kotysa-vertx-sqlclient` is a single dependency you can add to your project. \
This is a companion version for `smallrye-mutiny-vertx-sql-client` 3.X.Y (for Mutiny) and `vertx-sql-client` 4.X.Y (for
Coroutines), included in Quarkus 3.X.Y and does not replace it.

```groovy{6}
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-vertx-sqlclient:3.2.1'

    // Mutiny : Choose the right R2DBC driver for your database
    implementation "io.smallrye.reactive:smallrye-mutiny-vertx-pg-client:xyz"
    // for both mysql and mariadb
    implementation "io.smallrye.reactive:smallrye-mutiny-vertx-mysql-client:xyz"
    implementation "io.smallrye.reactive:smallrye-mutiny-vertx-mssql-client:xyz"
    implementation "io.smallrye.reactive:smallrye-mutiny-vertx-oracle-client:xyz"

    // Coroutines : Choose the right R2DBC driver for your database
    implementation "io.vertx:vertx-pg-client:xyz"
    // for both mysql and mariadb
    implementation "io.vertx:vertx-mysql-client:xyz"
    implementation "io.vertx:vertx-mssql-client:xyz"
    implementation "io.vertx:vertx-oracle-client:xyz"
}
```

Check this [reactive sample project with mutiny](https://github.com/ufoss-org/kotysa/tree/master/samples/kotysa-quarkus-vertx-sqlclient-mutiny),
and this [coroutines sample project](https://github.com/ufoss-org/kotysa/tree/master/samples/kotysa-quarkus-vertx-sqlclient-coroutines)
for a Quarkus Reactive Resteasy application with a Vertx Sqlclient backend accessed via `kotysa-vertx-sqlclient`.

## Coroutines support

`kotysa-vertx-sqlclient` provides a coroutines SQL client on top of `vertx-sql-client`,
it can be obtained via an Extension function directly on ```io.vertx.sqlclient.Pool```.

It provides a SQL client API using ```suspend``` functions and ```Flow``` from
[kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines).

```kotlin
class Repository(private val dbClient: PgPool, private val tables: PostgresqlTables) {

    @Produces
    fun sqlClient() = dbClient.coSqlClient(tables)

	// enjoy coroutines sqlClient for Quarkus with Vertx sqlclient :)
}
```

## Reactive support

`kotysa-vertx-sqlclient` provides a reactive SQL client on top of `smallrye-mutiny-vertx-sql-client`, 
it can be obtained via an Extension function directly on ```io.vertx.mutiny.sqlclient.Pool```.

It provides a SQL client API using ```Uni``` and ```Multi``` from Mutiny.

```kotlin
class Repository(private val dbClient: PgPool, private val tables: PostgresqlTables) {

    @Produces
    fun sqlClient() = dbClient.sqlClient(tables)

	// enjoy Mutiny reactive sqlClient for Quarkus with Vertx sqlclient :)
}
```

## Supported databases

* [MySQL](table-mapping.html#mysql)
* [PostgreSQL](table-mapping.html#postgresql)
* [MSSQL](table-mapping.html#mssql)
* [MariaDB](table-mapping.html#mariadb)
* [Oracle](table-mapping.html#oracle)

## Transaction

In `kotysa-vertx-sqlclient`, transaction is available directly on the sqlClient.

```kotlin
sqlClient.transactional { transaction ->
    // execute your queries inside this transaction
}
```

---
title: Kotysa for Spring R2DBC
prev: ./kotysa-spring-jdbc
next: ./kotysa-jdbc
---

# Kotysa for Spring R2DBC

## Dependency

`kotysa-spring-r2dbc` is a single dependency you can add to your Spring project. \
This is a companion version for `spring-r2dbc` 5.3.x (included in Spring boot 2.7.X, 2.6.X, 2.5.x and 2.4.x) and does
not replace it.

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-spring-r2dbc:2.3.3'
    
    implementation 'org.springframework:spring-r2dbc'
}
```
Check this [reactive sample project](https://github.com/ufoss-org/kotysa/tree/master/samples/kotysa-spring-r2dbc-reactive),
and this [coroutines sample project](https://github.com/ufoss-org/kotysa/tree/master/samples/kotysa-spring-r2dbc-coroutines)
for a Spring Boot WebFlux application with a R2DBC backend accessed via `kotysa-spring-r2dbc`

## Coroutines support

`kotysa-spring-r2dbc` provides a coroutines SQL client on top of `spring-r2dbc`,
it can be obtained via an Extension function directly on spring-r2dbc's ```DatabaseClient```.

It provides a SQL client API using ```suspend``` functions and ```Flow``` from [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines).

```kotlin
class Repository(client: DatabaseClient, tables: H2Tables) {

	private val sqlClient = client.coSqlClient(tables)

	// enjoy coroutines sqlClient for spring-r2dbc :)
}
```

## Reactive support

`kotysa-spring-r2dbc` provides a reactive SQL client on top of `spring-r2dbc`, 
it can be obtained via an Extension function directly on spring-r2dbc's ```DatabaseClient```.

It provides a SQL client API using ```Mono``` and ```Flux``` from Reactor.

```kotlin
class Repository(client: DatabaseClient, tables: Tables) {

	private val sqlClient = client.sqlClient(tables)

	// enjoy reactive sqlClient for spring-r2dbc :)
}
```

## Supported databases

* [MySQL](table-mapping.html#mysql)
* [PostgreSQL](table-mapping.html#postgresql)
* [MSSQL](table-mapping.html#mssql)
* [MariaDB](table-mapping.html#mariadb)
* [H2](table-mapping.html#h2)

## Coroutines transaction

`kotysa-spring-r2dbc` provides transaction support to use with coroutines SqlClient on top of `spring-tx`,
it can be obtained via an Extension function directly on spring-tx's ```TransactionalOperator```.

```kotlin
class Service(template: TransactionalOperator) {

	private val operator = template.coTransactionalOp()

	// use transaction with coroutines SqlClient
}
```

## Reactive transaction

`kotysa-spring-r2dbc` provides transaction support to use with reactive SqlClient on top of `spring-tx`, 
it can be obtained via an Extension function directly on spring-tx's ```TransactionalOperator```.

```kotlin
class Service(template: TransactionalOperator) {

	private val operator = template.transactionalOp()

	// use transaction with reactive SqlClient
}
```

---
title: kotysa-spring-r2dbc
prev: ./kotysa-android
next: ./kotysa-spring-jdbc
---

# Kotysa for Spring R2DBC

## Dependency

kotysa-spring-r2dbc is a single dependency you can add to your Spring project. \
This is a companion version for spring-r2dbc 5.3.0 (included in Spring boot 2.4.0-RC1) and does not replace it.

```groovy
repositories {
    jcenter()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-spring-r2dbc:0.1.8'
    
    implementation 'org.springframework:spring-r2dbc'
}
```

## Reactive support

kotysa-spring-r2dbc provides a reactive SQL client on top of spring-r2dbc, 
it can be obtained via an Extension function directly on spring-r2dbc's ```DatabaseClient```.

It provides a SQL client API using Reactor ```Mono``` and ```Flux```.

```kotlin
class Repository(client: DatabaseClient, tables: Tables) {

	private val sqlClient = client.sqlClient(tables)

	// enjoy reactive sqlClient for spring-r2dbc :)
}
```

## Coroutines first class support

kotysa-spring-r2dbc provides a coroutines SQL client on top of spring-r2dbc, 
it can be obtained via an Extension function directly on spring-r2dbc's ```DatabaseClient```.

It provides a SQL client API using ```suspend``` functions and ```Flow``` from kotlinx-coroutines.

```kotlin
class Repository(client: DatabaseClient, tables: Tables) {

	private val sqlClient = client.coSqlClient(tables)

	// enjoy coroutines sqlClient for spring-r2dbc :)
}
```

## Supported databases

* [MySQL](table-mapping.html#mysql)
* [PostgreSQL](table-mapping.html#postgresql)
* [H2](table-mapping.html#h2)

## Reactive transaction

kotysa-spring-r2dbc provides transaction support to use with reactive SqlClient on top of spring-tx, 
it can be obtained via an Extension function directly on spring-tx's ```TransactionalOperator```.

```kotlin
class Service(template: TransactionalOperator) {

	private val operator = template.transactionalOp()

	// use transaction with reactive SqlClient
}
```

## Coroutines transaction

kotysa-spring-r2dbc provides transaction support to use with coroutines SqlClient on top of spring-tx, 
it can be obtained via an Extension function directly on spring-tx's ```TransactionalOperator```.

```kotlin
class Service(template: TransactionalOperator) {

	private val operator = template.coTransactionalOp()

	// use transaction with coroutines SqlClient
}
```

---
title: kotysa-spring-r2dbc
prev: ./kotysa-android
next: ./kotysa-spring-jdbc
---

# Kotysa for Spring R2DBC

## Dependency

kotysa-spring-r2dbc is an additional dependency you can add to your Spring project. \
It is an extension to Spring R2DBC, and does not replace it.

```groovy
repositories {
    jcenter()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-spring-r2dbc:0.1.6'
    
    implementation 'org.springframework.data:spring-data-r2dbc'
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

* [H2](table-mapping#h2)
* [PostgreSQL](table-mapping#postgresql)

## Transaction

kotysa-spring-r2dbc provides a transaction on top of spring-tx, 
it can be obtained via an Extension function directly on spring-tx's ```TransactionalOperator```.

```kotlin
class Service(template: TransactionalOperator) {

	private val operator = template.transactionalOp()

	// use transaction
}
```

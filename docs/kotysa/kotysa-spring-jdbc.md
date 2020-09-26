---
title: kotysa-spring-jdbc
prev: ./kotysa-spring-r2dbc
---

# Kotysa for Spring JDBC

## Dependency

kotysa-spring-jdbc is an additional dependency you can add to your Spring project. \
It is an extension to Spring JDBC, and does not replace it.

```groovy
repositories {
    jcenter()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-spring-jdbc:0.1.6'
    
    implementation 'org.springframework:spring-jdbc'
}
```

## Usage

kotysa-spring-jdbc provides a SQL client on top of spring-jdbc, 
it can be obtained via an Extension function directly on spring-jdbc's ```JdbcOperations```.

```kotlin
class UserRepository(client: JdbcOperations, tables: Tables) {

	private val sqlClient = client.sqlClient(tables)

	// enjoy sqlClient for spring-jdbc :)
}
```

## Supported databases

* [H2](table-mapping#h2)
* [PostgreSQL](table-mapping#postgresql)

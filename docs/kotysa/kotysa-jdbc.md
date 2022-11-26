---
title: Kotysa for JDBC
prev: ./kotysa-spring-r2dbc
next: ./kotysa-r2dbc
---

# Kotysa for JDBC

## Dependency

`kotysa-jdbc` is a single dependency you can add to your project.

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-jdbc:2.3.0'

    // Choose the right JDBC driver for your database
    implementation 'com.h2database:h2:xyz'
    implementation 'mysql:mysql-connector-java:xyz'
    implementation 'com.microsoft.sqlserver:mssql-jdbc:xyz'
    implementation 'org.mariadb.jdbc:mariadb-java-client:xyz'
    implementation 'org.postgresql:postgresql:xyz'
}
```

Check this [sample project](https://github.com/ufoss-org/kotysa/tree/master/samples/kotysa-ktor-jdbc) for a Ktor Netty
application with a JDBC backend accessed via `kotysa-jdbc`.

Check this [sample project](https://github.com/ufoss-org/kotysa/tree/master/samples/kotysa-quarkus-jdbc) for a
Quarkus Resteasy application with a JDBC backend accessed via `kotysa-jdbc`.

## Usage

`kotysa-jdbc` provides a SQL client on top of JVM's included jdbc, 
it can be obtained via an Extension function directly on ```javax.sql.DataSource```.

```kotlin
class Repository(dataSource: DataSource, tables: H2Tables) {

	private val sqlClient = dataSource.sqlClient(tables)

	// enjoy sqlClient for jdbc :)
}
```

## Supported databases

* [MySQL](table-mapping.html#mysql)
* [PostgreSQL](table-mapping.html#postgresql)
* [MSSQL](table-mapping.html#mssql)
* [MariaDB](table-mapping.html#mariadb)
* [H2](table-mapping.html#h2)

## Transaction

In `kotysa-jdbc`, transaction is available directly on the sqlClient.

```kotlin
sqlClient.transactional { transaction ->
    // do your queries inside this transaction
}
```

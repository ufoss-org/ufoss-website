---
title: kotysa-android
prev: ./queries
next: ./kotysa-spring-r2dbc
---

# Kotysa for SqLite on Android

## Dependency

kotysa-android is a single dependency you can add to your Android project.

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.ufoss.kotysa:kotysa-android:1.0.1'
}
```

## Usage

kotysa-android provides a SQL client on top of Android's included SqLite, 
it can be obtained via an Extension function directly on Android's```SQLiteOpenHelper```.

```kotlin
class Repository(sqLiteOpenHelper: SQLiteOpenHelper, tables: Tables) {

	private val sqlClient = sqLiteOpenHelper.sqlClient(tables)

	// enjoy sqlClient for Android :)
}
```

See [SqLite supported types](table-mapping.html#sqlite)

## Transaction

kotysa-android provides a transaction on top of Android's included SqLite, 
it can be obtained via an Extension function directly on Android's ```SQLiteDatabase```.

```kotlin
class Service(client: SQLiteDatabase) {

	private val operator = client.transactionalOp()

	// use transaction
}
```

---
title: PostgreSQL textsearch
prev: ./kotysa-vertx-sqlclient
---

# PostgreSQL textsearch

Kotysa supports PostgreSQL textsearch, with `tsvector` columns and `tsquery` to query them.

::: warning
These are PostgreSQL specific features, which are therefore reserved for PostgreSQL Kotysa SQL client.
:::

## step 1 -> table mapping for tsvector

This is a simple example of how to declare `tsvector`, and corresponding GIST or GIN indexes that allow to efficiently
query the tsvector. See [this article](https://www.postgresql.org/docs/current/textsearch-tables.html#TEXTSEARCH-TABLES-INDEX)

```kotlin
data class Article(
        val content: String,
        val title: String?,
        val id: UUID = UUID.randomUUID()
)

object Articles : PostgresqlTable<Article>() {
    val id = uuid(Article::id)
                .primaryKey()
    val content = text(Article::content)
    val title = varchar(Article::title)

    val articleSearchable = tsvector(TsvectorType.english, content)
        .withGinIndex()
    val articleSearchableBoth = tsvector(TsvectorType.english, content, title)
        .withGistIndex()
}
```

## step 2 -> text search querying

4 available functions can be used to build a tsquery, depending on what you need :
* `toTsquery` creates a tsquery value from querytext, which must consist of single tokens separated by the tsquery
operators `&` (AND), `|` (OR), `!` (NOT), and `<->` (FOLLOWED BY), possibly grouped using parentheses. In other words,
the input to `toTsquery` must already follow the general rules for tsquery input.
* `plaintoTsquery` transforms the unformatted text querytext to a tsquery value. The text is parsed and normalized much
as for to_tsvector, then the `&` (AND) tsquery operator is inserted between surviving words.
* `phrasetoTsquery` behaves much like `plaintoTsquery`, except that it inserts the `<->` (FOLLOWED BY) operator between
surviving words instead of the `&` (AND) operator. Also, stop words are not simply discarded, but are accounted for by
inserting `<N>` operators rather than `<->` operators. This function is useful when searching for exact lexeme
sequences, since the FOLLOWED BY operators check lexeme order not just the presence of all the lexemes.
* `websearchToTsquery`creates a tsquery value from querytext using an alternative syntax in which simple unformatted
text is a valid query. Unlike `plaintoTsquery` and `phrasetoTsquery`, it also recognizes certain operators. Moreover,
this function will never raise syntax errors, which makes it possible to use raw user-supplied input for search.

```kotlin
// Use tsquery only in the where clause
(sqlClient selectFrom Articles
    where Articles.articleSearchable toTsquery "table|create"
    ).fetchAll()
    
// Declare a tsquery that is used to rank and order results matching
// your text query from the most relevant to the less one
val tsquery = sqlClient toTsquery "table|create" `as` "query"

sqlClient.select(Articles.content).andTsRankCd(Articles.articleSearchableBoth, tsquery).`as`("rank")
            .from(Articles).and(tsquery)
            .where(tsquery).applyOn(Articles.articleSearchableBoth)
            .orderByDesc(QueryAlias<Float>("rank"))
            .fetchAll()
```

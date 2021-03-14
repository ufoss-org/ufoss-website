---
title: Dino
next: /kotysa/kotysa
---

# &#x1f996; Dino &#x1f995;

* Dino is a IO library that works with one thread per IO operation, for example a multiplexed TCP server that runs with
Dino will create two threads for each client Socket : one thread for read operations and one thread for write operations.
* Dino is designed from the start to be used in conjunction with
[Project Loom virtual threads](https://wiki.openjdk.java.net/display/loom/Main) and
[JDK14 foreign memory](https://cr.openjdk.java.net/~mcimadamore/panama/memaccess_javadoc/jdk/incubator/foreign/package-summary.html).

::: warning
Dino is in an early stage of development, do not use it in production yet.
:::

**Table of content**

[[toc]]

## Requirements

* Base modules of Dino require JDK11, the last Long Term Support Java version.
* Additional modules allow benefiting from additional features available in more recent JDKs, such as virtual threads
and foreign memory, transparently thanks to ServiceLoader.
These additional modules have a **-jdk1X** suffix, so you easily know which modules you can import as dependency,
depending on the JDK your project uses.

## Features

### Virtual threads

* Virtual threads are much lighter than regular JDK threads, allowing millions of them running at the same time.
* No need for Thread pooling, we just create a fresh new virtual thread when needed.
* With virtual threads, we do not need complex synchronisation required by multi-threaded Selector based NIO.

### Foreign Memory

* Foreign Memory was added as an experimental feature in JDK14 to support low-level, safe and efficient memory access.
* Foreign Memory provides nice features like spatial safety, temporal safety and thread-confinement.
* Dino uses exclusively off-heap native MemorySegments.

### Other Java features

* JDK9
  * Dino is fully modular thanks to Jigsaw modules
  * Compact Strings (in progress)
* JDK11
  * TLSv1.3 (later)
* JDK14
  * Foreign memory (in progress)
* JDK1X (release version is not known yet)
  * Project Loom virtual threads (in progress)

... and more to come

## Source code

&#x1F468;&#x200D;&#x1F4BB; Open source code of Dino is available on [github](https://github.com/ufoss-org/dino), feel free to watch it, contribute, fork, copy, whatever you want.

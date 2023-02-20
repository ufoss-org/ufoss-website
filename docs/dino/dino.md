---
title: Dino
---

# &#x1f996; Dino &#x1f995;

Dino is an IO library for the JVM. Dino is designed from the start to use
[Project Loom](https://wiki.openjdk.java.net/display/loom/Main) that allows to run as much virtual threads as needed to
read and write from/to network, without needing thread pools or event-loop.

Dino uses NIO in blocking mode with virtual threads, that acts as a regular blocking behavior but uses non-blocking
under the hood.

::: warning Status
Dino is in an early stage of development, do not use it in production yet.
:::

**Table of content**

[[toc]]

## Requirements

Dino modules require JDK19 for virtual thread and foreign memory support.

::: tip Roadmap
First stable Dino release will probably target Java 21 LTS.
:::

## Features

### Virtual threads

* Virtual threads are much lighter than regular JDK threads, allowing millions of them running at the same time.
* No need for Thread pooling, we just create a fresh new virtual thread when needed.
* With virtual threads, we do not need complex synchronisation required by multithreaded event-loop + Selector based
NIO.

### Foreign Memory

* Foreign Memory was added as an experimental feature in Java 14. With Java 19 it was promoted to preview state and is
no longer incubating. It provides low-level, safe and efficient memory access.
* Foreign Memory provides nice features like spatial safety, temporal safety and thread-confinement.
* Dino uses exclusively off-heap native MemorySegments.

## Source code

&#x1F468;&#x200D;&#x1F4BB; Open source code of Dino is available on [github](https://github.com/ufoss-org/dino), feel
free to watch it, contribute, fork.

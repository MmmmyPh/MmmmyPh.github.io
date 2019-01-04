---
title: Generator函数含义与用法
tags:
  - JavaScript
  - 学习笔记
---

<!-- 要点：

    回调与Promise缺陷

    函数的暂停与重新启动，函数体内外数据交换，错误处理机制

    thunk函数 -->

> 自从开始使用React+Redux+Redux-Saga后，在Saga里Generator函数用的很多，回过头想想，对Generator貌似没有真正的理解多少？

## JavaScript异步

对于单线程的JS来说，异步显得尤为重要。在 Generator 出来之前，JS中的异步操作主要有下面几种方式：

- 回调函数

- 事件监听

- 发布/订阅

- Promise


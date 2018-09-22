---
title: HTTP基础概念梳理(未完成)
tags:
  - http
  - 学习笔记
date: 2018-09-21 20:55:47
---


# URI

URI = Universal Resource Identifier 统一资源标志符。

指在「某一个规则」下用于唯一标识某一资源的标识符（字符串）。无论用什么方法/形式，只要能够唯一的标识一个资源，那么这个就是URI。

# URL
URL = Universal Resource Locator 统一资源定位符。

URL的重点在于定位，用定位的方式实现了URI的功能，以位置来描述资源。

更重要的一点在于，URL不仅标识了 Web 资源，还指定了操作或者获取方式，同时指出了主要访问机制和网络位置。

因此URL是URI的子集（locators are also identifiers）。

# URN

URN = Universal Resource Name 统一资源名称。

与URL类似，URN也是URI的子集，只不过是用名称来定位。

使用URN可以在不知道其网络位置及访问方式的情况下讨论资源。

无论用定位还是名称的方式，都是URI的一种实现。

[参考链接1](http://web.jobbole.com/83452/)

[参考链接2](https://www.jianshu.com/p/ba15d066f777)

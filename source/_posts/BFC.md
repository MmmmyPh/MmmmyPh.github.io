---
title: BFC学习笔记
date: 2018-04-30 14:29:49
tags:
  - CSS
  - 学习笔记
---

> BFC概念阅读理解，有点绕，常回家看看

<!-- more -->

## BFC概念

BFC是一个名词概念，是指一个独立于其包裹盒的布局环境，可以理解为一个内部物品不受外部影响的盒子（一个实际上看不到的盒子）。

也就是说，BFC内部的元素布局不受外部影响，在同一个BFC内，所有的盒子（包括块盒与行盒）都在垂直方向上，沿着父元素的边缘，从上到下进行排列

## BFC布局规则

### 对内：

1. BFC内部元素会在垂直方向上按顺序一个个排列。

2. BFC内部的`Box`之间的距离由`margin`属性决定，同一个BFC内的相邻兄弟元素的垂直方向的`margin`会发生重叠。

3. BFC内部的每个`Box`的`margin box`的左边缘，都会与`container box`的`content box`的左边缘接触（属性`direction`为`rtl`的会于此相反），即使有`float`的元素也是这样。

### 对外：

1. BFC区域不会与`float box`相互重叠。

2. BFC是页面中的一个独立布局容器区域，容器内部元素不会影响外部元素，同样，外部的元素也无法影响容器内部的元素。

3. BFC区域的高度计算，会把`float`的元素也计算在内(原因是BFC是独立容器，内部元素不应该影响外部，所以会计算浮动子元素高度，进行包裹)

## BFC的生成条件

生成一个BFC布局容器，可以是下列任何一个：

- 页面根元素（整个html本身就是一个大的BFC）

- `float`不为`none`

- `overflow`不为`visible`

- `position`为`fixed`或`absolute`

- `display`显式设置为`inline-block`,`flex`,`inline-flex`,`table-cell`,`table-caption`

## BFC应用

- 两栏布局,双飞翼布局

    - 利用对外规则1，以及`overflow:hidden`

```HTML
<style>
    .con{margin:0 auto; width:1200px;}
    .left{float:left; margin-right:20px; width:100px; background:#f00;}
    .right{float:right; margin-left:20px; width:100px; background:#00f;}
    .center{background:#999; height:200px; overflow:hidden;}
</style>

<div class="con">
    <div class="left">left</div>
    <div class="right">right</div>
    <div class="center">center</div>
</div>
```

- 清除浮动

    - 利用对外规则3，以及`overflow:hidden`

- 嵌套元素`margin`重叠

    - 利用对外规则2

```HTML
<style>
html,body{margin: 0px; padding: 0px;}
.wrap{
    background:yellow;
    width: 600px;
}
.inner{
    width:80px;
    height:50px;
    margin-top: 50px;
    margin-bottom: 50px;
    margin-left: 50px;
    background:red;
}
</style>

<div class="wrap">
  <div class="inner"></div>
</div>
```

通常情况下，这上面的`wrap`元素和`inner`元素的`margin`会产生重叠，但是如果让`wrap`产生`BFC`（比如利用`overflow:hidden`），那么就不会有重叠的问题

- 同级元素`margin`重叠

    - 利用对外规则2，以及BFC生成条件

把某一个元素包裹在一个`wrap`内，让`wrap`形成BFC，使得某一个元素进入另一个BFC,以避免同级元素`margin`的重叠

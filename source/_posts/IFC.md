---
title: IFC学习笔记
date: 2018-04-30 14:33:47
tags:
  - CSS
  - 学习笔记
---

## IFC概念与形成

IFC与BFC一样,不是某一个具体的元素、不是一种具体的属性，而是一种环境、一种格式化上下文、一种布局特性。`inline-level`的盒子会参与到IFC中。

在一个IFC中，`inline-level`的元素在水平方向上一个接一个排列。元素水平方向上的`margin`,`border`,`padding`属性是生效的。在垂直方向上，IFC内部元素的对其方式包括：元素底部，顶部，文本基线等。

这些`inline-level`的元素元素排列成行形成的矩形区域被称为 **行盒(`line box`)**。

`line box`的宽度，取决于它的 **包含块** 以及 **是否存在`float`元素**。

`line box`的高度，由其内部包含的元素中，实际高度最高的元素计算得出。`line box`的高度足够包裹其内部最高的元素，也有可能比最高的元素还要高（比如内部元素按照 *基线* 对齐）。

如果一个`line box`中的所有`inline-level box`的宽度和小于`line box`的宽度，那么这些`inline-level box`会根据`text-align`属性来进行水平方向上的对其方式的定位。

当一个`line box`无法放下其内部的所有`inline-level box`，就会产生折行，同时生成一个或者多个新的`line box`。这些`line boxes`在垂直方向上进行堆叠，并且没有垂直分隔（如`margin-bottom`这种，除非有其他的指定）,并且这些`line box`不会发生重叠。

通常情况下，`line box`的左右边界分别接触它的包含块的左右边界，但是如果存在`float box`，那么这个`float box`会在`line box`的边界与包含块的边界之间。同一个IFC下的`line boxes`可能因为`float box`的存在导致宽度不同，而高度也可能因为内部元素的高度（比如一个大的img元素）不同而不同。

{% asset_img img-line-box-width.jpg 同一个IFC下LineBox宽度由于float元素发生的变化 %}

>上图中，由于float的元素存在，同一个IFC下的三个由于文字折行产生的`line-box`（用蓝色线框框出）的宽度不同

当一个`inline box`的宽度超出了它所在的`line box`的宽度，这一个`inline box`会被分割成多个`inline box`，并分布在几个不同的`line box`内。但是如果这个`inline box`的内容是 *一个字符*,或是 *语言的特定折行规则不允许在`inline box`内进行折行*, 又或是 *该`inline box`的`white-space`属性为`nowrap`或`pre`*,则此时这个`inline box`不会折行，而是会在水平方向上溢出`line box`的范围。

当一个`inline box`被分割时，在 *分割处*，元素的`margin`,`padding`,`border`将不会产生显式效果。

`line box`的存在条件是: **在IFC中** 并且 **包含inline-level元素** ，如果`line box`里 **没有文本，空白，换行符，内联元素，也没有其他的存在IFC环境中的元素，(如inline-block，inline- table，images等)** ，将会被视为零高度，也将会被视为没有意义。

另外，在IFC中是不能存在`block-level`的元素的，如果将一个`block-level`元素插入到IFC中,该IFC将会被分割成左右(上下？)两个新的IFC，然后与这个`block-level`元素垂直排列，亦即表明，IFC对外表现为一个块盒来参与外部的布局。

## line-height

`line-height`行高字面指的是一行文字的高度。具体的说，就是 *两行文字基线之间的距离*, 基线指的是小写字母`x`的下边缘。

>在此还要补充一个概念：`content area`，即内容区域，`content area`的高度为文字`fontSize`的一个盒子，是包裹着文字的一个box

简单的理解，可以是下面这个公式：

```
lineHeight = fontSize + lineSpace(行间距)
```

因为根据IFC的定义，`line box`和`line box`之间是没有间距的，因此 *行间距这个概念其实不是`line box`之间的间距*，而是从直观上我们能看到的两行字中间（只有文本时）的间距。

那么对于某一个特定特定的`line box`来说，存在 *上行内间距* 和 *下行内间距* ，且相等，都等于 `(lineHeight - fontSize) / 2`。

但是有时候`line box`的高度， *会小于* `content area`的高度，亦即 `lineHeight < fontSize`：

```CSS
p{line-height:12px; height:30px;}
```

在这种情况下,这个`p`元素的高度会 **优先计算为`line-height`**，然后，在`p`元素上加上 **与`font-size`等值的`margin-top`和`margin-bottom`**,并且在这种情况下如果文字过多发生折行，由于字体过大，会发生文字重叠。

{% asset_img img-ifc-0.png 文字发生重叠 %}

`line-height`的取值方式有：

- `inherit`（默认值）

    继承父元素的`line-height`值

- `normal`（初始值）

    这个初始值取决于用户代理。桌面浏览器（包括火狐浏览器）使用默认值，约为`1.2`，这取决于元素的 `font-family`。

- `<number>`

    该属性的 *应用值* 是这个无单位数字`<number>`乘以该元素的`font-size`值。计算值与指定值相同。大多数情况下，使用这种方法设置line-height是首选方法，在继承情况下不会有异常的值。

- `<length>`

    指定`<length>`用于计算 `line box` 的高度。就是一般写的`20px`这种。

- `<percentage>`

    与元素自身的`font-size`有关。计算值是给定的百分比值乘以元素计算出的字体大小。

## vertical-align

两个链接：

1. [我对CSS vertical-align的一些理解与认识（一）](http://www.zhangxinxu.com/wordpress/2010/05/%E6%88%91%E5%AF%B9css-vertical-align%E7%9A%84%E4%B8%80%E4%BA%9B%E7%90%86%E8%A7%A3%E4%B8%8E%E8%AE%A4%E8%AF%86%EF%BC%88%E4%B8%80%EF%BC%89/)

2. [CSS vertical-align的深入理解(二)之text-top篇](http://www.zhangxinxu.com/wordpress/2010/06/css-vertical-align%E7%9A%84%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%EF%BC%88%E4%BA%8C%EF%BC%89%E4%B9%8Btext-top%E7%AF%87/)

## IFC应用

在处理弹窗的水平垂直居中时，根据IFC可以有这样的处理方式：

```HTML
<div class="wrap">
    <div class="panel"></div>
</div>
```

```CSS
.wrap{position:fixed; top:0; right:0; bottom:0; left:0;  background:rgba(0,0,0,0.6); text-align:center;}
.wrap:before{content:"";  display:inline-block; height:100%; width:0; vertical-align:middle;}
.panel{display:inline-block; width:200px; height:100px; background:#fff; vertical-align:middle;}
```

这样，就算在无法兼容`transform:translate()`的IE8上也能对宽高不固定的弹窗进行居中设置。

>[参考链接1](https://juejin.im/post/5909db2fda2f60005d2093db)
>[参考链接2](https://segmentfault.com/a/1190000004466536)
>[参考链接3](https://www.cnblogs.com/fsjohnhuang/p/5259121.html)
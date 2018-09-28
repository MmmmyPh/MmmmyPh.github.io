---
title: BFC,IFC学习笔记
tags:
  - CSS
  - 学习笔记
date: 2018-04-20 18:18:50
---

先整理一下几个常见名词的意义：

## 视觉格式化模型
视觉格式化模型(visual formatting model)是用来处理文档并将它显示在视觉媒体上的机制，它也是CSS中的一个概念。

视觉格式化模型定义了盒（Box）的生成，盒主要包括了块盒、行内盒、匿名盒（没有名字不能被选择器选中的盒）以及一些实验性的盒（未来可能添加到规范中）。

## Formatting Context(格式化上下文)

`Formatting Context`指的是页面里的一块渲染区域，这块渲染区域指定了其内部子元素的定位及与其他元素的关系和互相作用的规则，同时也规定了自身对外的布局规则。

常见的`Formatting Context`有 `Block Formatting Context`(CSS2.1),`Inline Formatting Context`(CSS2.1),`GFC`(CSS3),`FFC`(CSS3)

## Box(盒)

`Box`是CSS布局的对象和基本单位。CSS的作用对象并不是`document tree`，而是根据`document tree`生成的`render tree`，`Box`就是`render tree`的节点。

直观地说，在CSS2.1中，页面中的每一个DOM元素都可以看成一个`Box`，而`Box`分为三种类型，不同类型的`Box`参与不同的格式化上下文：

- *block-level box:块级盒*

- *inline-level box：行内盒*

- *匿名盒*

Box的类型由下面两个因素共同决定：

- 元素类型

- 元素的`display`属性

## Block-level Element(块级元素)

`block-level element`的定义是指那些在源文档中以 *占有一整行的块* 为视觉格式化的元素（例如：<p\>）。

除了p元素，div元素等默认的块级元素，其他将元素`display`属性为：`block`,`list-item`,`table`的元素都会成为一个块级元素。

## Block-level Box(块级盒)

块级盒参与`Block Formatting Context`，即 `BFC`。

每一个块级盒都会生成一个包含了子`box`及生成内容（generated content），并且参与任何定位方案的`principal block-level box`。

除了`table box`，`replaced element`，一个`block-level box`也是一个`block container box`。

一个`block container box`是 **只包含`block-level boxes`** 或 **建立一个只包含`inline-level boxes`的`Block Formatting Context`** 两者之一（either...or...）.

并不是所有的`block container boxes`都是`block-level boxes`：`non-replaced inline blocks`和`non-replaced table cells`都是`block container boxes`但并不是`block-level boxes`。

**满足`block containers`定义的`Block-level box` 被称为 `block box`。**

当含义明确的时候，"block-level box," "block container box," 和 "block box" 都可以被简单称为 "block"。

## Principal Block-level Box

`principal block-level box`是一个由给定元素生成的，直接受应用到元素的样式规则影响的`block-level box`。

大多数的元素只会生成一个`box`,那么对于这些元素来说，`principal block-level box`和`block-level box`是等价的，因为没有涉及到其他的`box`。

然而，根据元素的`display`属性，一个元素可以生成多个`box`，例如：`list-item`。当对这样的元素进行样式声明时，样式会应用的`principal block-level box`，同时生成的其他的任何`box`会在此基础上进行相应的重新渲染。

举个例子：
> CSS 2.1 offers basic visual formatting of lists. An element with 'display: list-item' generates a principal block box for the element's content and, depending on the values of 'list-style-type' and 'list-style-image', possibly also a marker box as a visual indication that the element is a list item.

`display:list-item`的元素,如果同时声明了`list-style-type` 或 `list-style-image`属性，那么除了`principal block box`之外，还会产生一个`marker box`。

可以通过`list properties`来影响`marker`的类型（图片，数字等）及相对`principal box`的位置（outside 或 inside）

需要注意的是，这个`marker box`是`principal box`的一个子box,因此它会继承应用在`principal box`上的样式（例如color）,但是无法单独给`marker box`设置样式以及相对于`principal box`的定位。

除了`display:table`以外的`block-level elements`都会仅仅只生成一个`principal block-level box`，使得对于那些元素来说,他们 *只是* `block boxes`。

因此，所有的`principal block-level box`都是`block-level box`，但并不是每一个`block-level box`都是`principal block-level box`（例如：匿名块盒）。并且，行内元素（包括行内块）本身不会生成任何的`principal box`,也不会有`principal inline box`这样的东西。

## Anonymous Block Box(匿名块盒)

```HTML
<div>
    Anonymous Block
    <p>text</p>
</div>
```

在如同上面一样的结构中，如果一个`block container box`（上面的div元素）中包含了一个`block-level box`（上面的p元素）在内，那么我们会**强制认为，这个`block container box`中， *只含有* `block-level box`在内**，并且认定，在文本 "Anonymous Block"周围，存在一个`Anonymous Block Box(匿名块盒)`（看似是一个`inline`级别的内容）。

更多关于匿名块盒，可以参考[规范](https://www.w3.org/TR/CSS21/visuren.html#anonymous-block-level)

## Inline-level Element(行级元素)

`inline-level element`的定义是指那些在给定源文档中 *不生成新的内容块的元素*，元素的内容都分散式地排列在行内（例如：p元素里的em元素,行内图片等）。

`display`属性为`inline`,`inline-block`,`inline-table`的元素是`inline-level`的。

`inline-level elements`生成 *参与* `Block Formatting Context`的`inline-level boxes`。

## Inline Box(行内盒)

`inline box`是一个 *既是* `inline-level`的, *并且* 其内容参与由它生成的`Block Formatting Context`的盒。

一个`display:inline`的`non-replaced element`会生成一个`inline box`。

非`inline box`的`inline-level box`（例如：`replaced inline-level elements`, `inline-block elements`, 以及 `inline-table elements`）被称作 `atomic inline-level box(原子行内级别盒)`，这些盒作为 *单个不透明盒(single opaque box)* 参与他们的`Block Formatting Context`。

## Anonymous Inline Box(匿名行内盒)

任何被直接放在 *块级容器元素*（不是 *行内元素*）内的文本，都必须被视作一个 匿名行内元素(`anonymous inline element`)。

## Line Box(行盒)

`line box`是一个由`inline-level box`在水平方向上排列成行而形成的一个矩形区域。

**`line box`还有很多的特性，随后整理**

## BFC

{% post_link BFC 查看BFC学习笔记 %}

## IFC

{% post_link IFC 查看IFC学习笔记 %}

>需要谨记的是：*IFC与BFC,不是某一个具体的元素，也不是一种具体的属性，而是一种环境，一种上下文，一种布局特性。*
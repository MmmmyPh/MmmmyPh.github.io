---
title: BFC,IFC学习笔记
tags:
  - CSS
  - 学习笔记
date: 2018-04-20 18:18:50
---

>BFC和IFC属于CSS视觉格式化模型下的概念，其中的名词概念比较多，且容易误解，在此先做一个整理，之后如果有什么新的理解将继续修改。
>时常回顾，温故知新

<!-- more -->

## 视觉格式化模型

视觉格式化模型(visual formatting model)是用来处理和在视觉媒体上显示文档时使用的计算规则，它也是CSS中的一个基础概念。

视觉格式化模型定义了盒（Box）的生成，盒主要包括了块盒、行内盒、匿名盒（没有名字不能被选择器选中的盒）以及一些实验性的盒（未来可能添加到规范中）。

## Formatting Context(格式化上下文)

`Formatting Context`指的是页面里的一块渲染区域，这块渲染区域指定了其内部子元素的定位及与其他元素的关系和互相作用的规则，同时也规定了自身对外的布局规则。

常见的格式化上下文有 `Block Formatting Context`(CSS2.1),`Inline Formatting Context`(CSS2.1),`GFC`(CSS3),`FFC`(CSS3)。

## Block(块)

一个抽象概念，一个快在文档流上占据了一个独立的区域，块与块之间在垂直方向上按照顺序以此堆叠。

## Containing Block(包含块)

包含其他盒子的块成为包含块。

## Box(盒)

`Box`是一个抽象的概念，由CSS引擎根据文档内容创建，是CSS布局的对象和基本单位，用于文档元素的定位、布局和格式化等。盒子与元素并不是一一对应的，有时多个元素会合并生成一个盒子，有时一个元素会生成多个盒子（如匿名盒子）。

CSS的作用对象并不是`document tree`，而是根据`document tree`生成的`render tree`，`Box`就是`render tree`的节点。

直观地说，在CSS2.1中，页面中的每一个DOM元素都可以看成一个`Box`，而`Box`分为三种类型，不同类型的`Box`参与不同的格式化上下文：

- block-level box ：块级盒

- inline-level box ：行内盒

- 匿名盒

Box的类型由下面两个因素共同决定：

- 元素类型

- 元素的`display`属性

## Replaced Element(可替换元素)

可替换元素是一类外观不由CSS控制，外观渲染独立于CSS的外部对象。元素本身并没有实际内容，最终显示的内容及样式，是由浏览器根据元素的某些属性来进行判断。例如`<image>`的显示内容由`src`属性决定。

典型的可替换元素有:  `<iframe>`、`<embed>`、`<img>`、`<object>`、`<video>`和表单元素，如`<textarea>`、`<input>`。而例如 `<audio>`、`<canvas>`、`<option>`、`<option>`、`<applet>` 等某些元素只在一些特殊情况下表现为可替换元素。

通过`CSS content`属性来插入的对象,被称作 **匿名可替换元素（anonymous replaced elements）**。

>Note: 一部分（并非全部）可替换元素，本身具有尺寸和基线（baseline），会被像vertical-align之类的一些 CSS 属性用到。

## Non-replaced Element(非可替换元素)

大部分的HTML元素都属于费可替换元素。

```HTML
<div>non-replaced element</div>
<p>non-replaced element</p>
```

上面的`div`和`p`元素称为 **非可替换** 的原因是他们标签里包裹的内容被忠实地呈现在页面上，并没有被别的东西替换。

## Block-level块级相关概念

>Note: 盒子分为“块盒子”和“块级盒子”两种，但元素只有“块级元素”，而没有“块元素”。下面的“行内级元素”也是一样。

### Block-level Element(块级元素)

`block-level element`的定义是指那些在源文档中以 *占有一整行的块* 为视觉格式化的元素（例如：<p\>）。

除了p，div等默认的块级元素，其他将元素`display`属性为：`block`,`list-item`,`table`的元素都会成为一个块级元素。

每一个块级元素都会 **至少** 生成一个`principal block-level box`（主块级盒）, 这个主块级盒包含了子`box`及生成内容（generated content），并且参与任何定位方案的。

>Note 1：有一些元素，比如列表项会生成额外的盒子来放置项目符号，而那些会生成列表项的元素可能会生成更多的盒子。不过，多数元素只生成一个主块级盒子。
>Note 2: 元素是否是块级元素仅是元素本身的属性，并不直接用于格式化上下文的创建或布局。

### Block-level Box(块级盒)

块级盒由块级元素生成，一个块级元素至少会生成一个块级盒，但是也有可能生成多个（例如列表项元素）。

块级盒参与`Block Formatting Context`，即 `BFC`。

### Block container box/Block containing box(块容器盒)

根据W3C标准，除去`table box`，`replaced element`，一个块级盒就是一个块容器盒。

块容器盒侧重于当前盒子作为“容器”的角色，它本身不参与当前块的布局和定位，它仅仅描述当前盒子与其后代的关系，也就是说，块容器盒的主要作用是：确定子元素的定位、布局等。

一个块容器盒可能是下面的两者中的一个：

- 只包含其他块级盒

- 只包含行内盒并同时创建一个行内格式化上下文（`Inline Formatting Context`）

### Principal Block-level Box(主块级盒)

主块级盒是一个由给定元素生成的，直接受应用到元素的样式规则影响的块级盒。

每一个块级元素都会至少生成一个块级盒，即主块级盒。大多数的元素只会生成一个盒,那么对于这些元素来说，主块级盒和块级盒是等价的，因为没有涉及到其他的盒。

然而，根据元素的`display`属性，一个元素可以生成多个盒，例如：`list-item`。当对这样的元素进行样式声明时，样式会应用的主块级盒，同时生成的其他的任何盒会在此基础上进行相应的重新渲染。

举个例子：
> CSS 2.1 offers basic visual formatting of lists. An element with 'display: list-item' generates a principal block box for the element's content and, depending on the values of 'list-style-type' and 'list-style-image', possibly also a marker box as a visual indication that the element is a list item.

`display:list-item`的元素,如果同时声明了`list-style-type` 或 `list-style-image`属性，那么除了`principal block box`之外，还会产生一个`marker box`来放置项目符号（就是list-item前面的那个黑点）。

可以通过`list properties`来影响`marker`的类型（图片，数字等）及相对`principal box`的位置（outside 或 inside）

需要注意的是，这个`marker box`是`principal box`的一个子box,因此它会继承应用在`principal box`上的样式（例如color）,但是无法单独给`marker box`设置样式以及相对于`principal box`的定位。

除了`display:table`以外的块级盒都会仅仅只生成一个主块级盒，使得对于那些元素来说,他们 *只是* 块盒。

因此，所有的主块级盒都是块级盒，但并不是每一个块级盒都是主块级盒（例如：匿名块盒）。并且，行内元素（包括行内块）本身不会生成任何的`principal box`,也不会有`principal inline box`这样的东西。

### Anonymous Block Box(匿名块盒)

```HTML
<div>
    Anonymous Block
    <p>text</p>
</div>
```

在如同上面一样的结构中，如果一个`block container box`（上面的div元素）中包含了一个`block-level box`（上面的p元素）在内，那么我们会**强制认为，这个`block container box`中， *只含有* `block-level box`在内**，并且认定，在文本 "Anonymous Block"周围，存在一个`Anonymous Block Box(匿名块盒)`（看似是一个`inline`级别的内容）。

更多关于匿名块盒，可以参考[规范](https://www.w3.org/TR/CSS21/visuren.html#anonymous-block-level)

### 块盒、块级盒、块容器盒

{% asset_img venn_blocks.png 块盒、块级盒、块容器盒关系 %}

- 并不是所有的 **块容器盒** 都是 **块级盒**：`non-replaced inline blocks（非替换行内块）`和`non-replaced table cells（非替换表格单元格）`都 **是块容器盒** 但并 **不是块级盒**。

- 并不是 **块级盒** 都是是 **块容器盒** ，比如表格

注意到 **块级盒与块容器盒是不同的** 这一点很重要。

- **块盒** 描述了元素与其父元素和兄弟元素之间的行为

- **块容器盒** 描述了元素跟其后代之间的行为。

**满足块容器盒定义的块级盒被称为 `block box(块盒)`。**

当含义明确的时候，块级盒、块容器盒、块盒都可以被简单称为`Block（块）`。

## Inline-level行内级相关概念

### Inline-level Element(行内级元素)

行内级元素的定义是指那些在给定源文档中 *不生成新的内容块的元素*，内容都分散式地排列在行内的元素（例如：p元素里的em元素,行内图片等）。

`display`属性为`inline`,`inline-block`,`inline-table`的元素是行内级元素。

`inline-level elements`生成 *参与* `Block Formatting Context`的`inline-level boxes`。

>与块级元素一样，元素是否是行内级元素仅是元素本身的属性，并不直接用于格式化上下文的创建或布局。

### Inline Box(行内盒)

`inline box`是一个 *既是* `inline-level`的, *并且* 其内容参与由它生成的`Block Formatting Context`的盒。

一个`display:inline`的`non-replaced element`会生成一个`inline box`。

非`inline box`的`inline-level box`（例如：`replaced inline-level elements`, `inline-block elements`, 以及 `inline-table elements`）被称作 `atomic inline-level box(原子行内级别盒)`，这些盒作为 *单个不透明盒(single opaque box)* 参与他们的`Block Formatting Context`。

### Anonymous Inline Box(匿名行内盒)

任何被直接放在 *块级容器元素*（不是 *行内元素*）内的文本，都必须被视作一个 匿名行内元素(`anonymous inline element`)。

### Line Box(行盒)

`line box`是一个由`inline-level box`在水平方向上排列成行而形成的一个矩形区域。

**`line box`还有很多的特性，随后整理**

## BFC

{% post_link BFC 查看BFC学习笔记 %}

## IFC

{% post_link IFC 查看IFC学习笔记 %}

>需要谨记的是：*IFC与BFC,不是某一个具体的元素，也不是一种具体的属性，而是一种环境，一种上下文，一种布局特性。*

## 参考资料

- [MDN视觉格式化模型](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Visual_formatting_model)
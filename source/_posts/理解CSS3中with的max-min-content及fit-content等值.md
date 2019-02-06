---
title: 理解CSS3中with的max/min-content及fit-content等值
tags:
  - CSS
  - 学习笔记
date: 2019-02-06 21:19:06
---


>Whaaa? 我又听说了CSS3里`width`有几个新的关键字成员？

<!-- more -->

上网看个文章，发现：Whaaa? 怎么又有新的属性了？再仔细看了看，额。。。事实上也不算新，挺早就有了，只不过之前不知道，而且基本都还属于实验性质的属性，说不准哪天删除了？

但是既然看到了，而且好久没学习CSS了，那么该学还是得学习这几个属性：

- `width: fill-available`

- `width: max-content`

- `width: min-content`

- `width: fit-content`

# 兼容性

这一套新的[兼容性](https://caniuse.com/#feat=intrinsic-width)目前来说，在PC端的Chrome和Firefox都已经能够较好地支持，IE系的就不看了，Edge都要死了。。。而基本上在移动端已经可用很好地使用了。

{% asset_img intrinsic&extrinsic-sizing.png Intrinsic&Extrinsic Sizing %}

但是如果真的要在实际生产中使用，还是需要加入浏览起私有前缀会更稳妥：

```CSS
.min-content {
  width: -webkit-min-content;
  width: -moz-min-content;
  width: min-content;
}
```

# width: fill-available

`width: fill-available`，从字面即可看出它的意义：填满当前元素所处父元素的可用空间。一个没有设置过任何其他样式`<div>`元素的`width`表现，天生就是`fill-available`的，即在横向上填满父元素的可用空间。

那么，`width: fill-available`出现的意义在于，非`block`元素也可以在横向上填满父元素的可用空间。例如`inline-block`：

```CSS
.fill-available{
  display: inline-block;
  width: fill-available;
}
```

设置了`width: fill-available`的`inline-block`元素，不再会按照自身的**收缩包裹**特性，在横向上缩小到自身内容的大小，而是会充满父元素的可用空间。

这样，就让一个`inline-block`水平的元素，同时具有了自身在父元素中的*对齐定位特性*，以及块级元素的*自动填充特性*。例如，我们可以用一个`inline-block`元素来表现成一个垂直居中的块级元素：

{% asset_img fill-available.png width:fill-available %}

关键CSS代码：

```CSS
.box {
  height: 200px;
  /* 行高控制垂直居中 */
  line-height: 200px;
}

.inline-block {
  /* inline-block元素，响应父元素行高及vertical-align控制 */
  display: inline-block;
  /* 阻止继承父元素行高，以防文字显示问题 */
  line-height: 20px;
  /* 元素垂直居中 */
  vertical-align: middle;
}

.fill-available {
  /* 元素如同块级元素那般横向盛满 */
  width: -webkit-fill-available;
  width: -moz-fill-available;
  width: -moz-available;    /* FireFox目前这个生效 */
  width: fill-available;
}
```

# width: max-content

`max-content`表示，采用当前元素内部的子元素**宽度最大**的那个子元素的宽度作为当前元素的宽度。如果元素子元素中有文本，那么将采用文本不换行时的文本元素宽度与其他子元素宽度进行比较，就如同设置了`white-space: no-wrap`一样。

{% asset_img max-content.png width:max-content %}

可以在上图中看到，设置了`width:max-content`的元素，对于内部元素中两行文本，采用了**不换行后最长的**那一行文本的宽度作为自身宽度。如果将其中的某一个文本替换成例如`img`等，也是同样的道理。

# width: min-content

`min-content`单从字面理解，可能会误认为是采用宽度最小的那个子元素的宽度，但是其实是,采用内部元素**最小宽度最大的**那个元素的宽度值,作为容器元素的宽度。

> 最小宽度值：对于替换元素，例如图片,最小宽度值就是图片呈现的宽度。对于文本元素，如果文本全是中文，那么就是一个中文字符的宽度；如果包含英文在内，由于英文单词内不准换行，那么最小宽度值就是最长的那个英文单词的宽度。

如果容器是块级元素，原先撑满父元素的容器元素会“收缩”到内部元素的最小宽度最大值那个宽度。如果容器是`inline-block`元素，也不会被内部元素给撑开,也会“固定收缩”到最小宽度最大值那个宽度。

如果在其中加入图片元素，那么在图片与文字混合的这个容器元素中，容器会始终跟随图片的宽度进行自适应，这是一个之前比较难以实现的效果。

{% asset_img min-content-1.png width:min-content-1 %}

上图采用`min-content`后，容器元素将跟随图片的宽度进行缩放，因为图片的宽度为640px，大于文本的最小宽度值。

{% asset_img min-content-2.png width:min-content-2 %}

上图采用`min-content`后，容器元素针对纯文本内部元素，采用了或中文一个字符宽度，或英文单词宽度作为自身的宽度值。

# width: fit-content

`width: fit-content`理解起来就是，收缩以适应内容:'shrink-to-fit'。这一特性，与在`float`,`absolute`以及`inline-block`身上的尺寸收缩特性的表现是一致的。

如果说`width: fill-available`可以理解为让`inline-block`的内容在保持原先`inline-block`水平属性的同时，具有`block`元素撑满容器的特性。

那么，`width: fit-content`就可以理解为，让`block`的内容在保持原先`block`水平属性的同时，具有`inline-block`元素的收缩效果，同时，也不至于如同`float`,`absolute`那样脱离普通文档流。

下面一个图中的例子就是利用`fit-content`来实现元素的收缩，同时直接利用`margin: auto`来进行居中，也不需要担心会有其他元素在同一行跟在后面。

如果要用`inline-block`的元素来实现同样效果，那么就需要在父元素中设置`text-align: center`来进行元素居中，同时自己还要设置`text-align: left`来保持文本的靠左。

{% asset_img fit-content.png width:fit-content %}

# 展开

## CSS2.1尺寸体系

CSS2.1中常见的尺寸分为这几个：

1. 充分利用可用空间

    比如`div`元素，默认宽度即是100%撑满父元素的宽度，这样就是充分利用空间：`fill-available`。

2. 收缩与包裹

    典型代表是`inline-block`、绝对定位，英文是'shrink-to-fit'(收缩到合适)。理解上可以理解为，收缩元素的宽度到“恰好包裹住”内部元素。现在可以用`fit-content`来形容。

3. 收缩到最小

    收缩到最小最典型的表现是`table-layout: auto`的`table`元素。如果`table`的父元素宽度不够，`table`的列数过多或者某些内容宽度过长，那么`th`,`td`中的文本就会被随意折行，英文最多折行到一个单词的大小，如果只有中文，那么最多就会把这一系列文本直接折行成每行只有一个中文。

    这其实就是`min-content`的特性。

4. 超出容器限制

    一般情况下，除非特殊设置，子元素的宽度尺寸都不会超出父元素。但是对于连续的英文或数字，或者被设置了`white-space: nowrap`，那么在父元素宽度不够的时候，内容不会产生任何折行，这时，子元素宽度就会超出父元素的尺寸范围。

    这一特性与`max-content`的表现类似

列举了上面四个发现，其实这四个新的`width`关键字表现的特性在CSS2.1中已经都有了，那么，明确地写成一个关键字最大的好处在于：**帮助元素在原有的`display`水平下，实现其他`display`值才能够实现的特性**，从而帮助更好地进行布局。

## Intrinsic & Extrinsic Sizing

上面那张兼容性的图中的标题是`Intrinsic & Extrinsic Sizing`,即*内部尺寸与外部尺寸*。

- 内部尺寸：元素的尺寸由内部的子元素决定；

- 外部尺寸：元素的尺寸由外部的元素决定；

## Demo

关于这几个属性写了一个[小demo](https://jsfiddle.net/MmmmyPh/7q6nc5p4/52/)，也加深自己的理解。
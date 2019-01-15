---
title: JavaScript函数柯里化
tags:
  - JavaScript
  - 函数化编程
  - 学习笔记
---

# 柯里化的定义

用中文在google上搜索柯里化，会找到好多有关柯里化的文章。看了几篇不同的文章后，就产生一个疑惑，什么是真正的柯里化的定义？因为不同文章在最开始部分对于柯里化的定义文字，是完全不同的两个概念。

于是我就去查找维基百科，而在维基百科上，关于柯里化的定义，中文和英文其实也恰好表述了两个概念：

中文定义：

> 在计算机科学中，柯里化（英语：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

英文定义：

> In mathematics and computer science, currying is the technique of translating the evaluation of a function that takes multiple arguments into evaluating a sequence of functions, each with a single argument.

英文版本的定义翻译过来，确切的应该是：

> 在数学和计算机科学中，柯里化是一种将一个多参数函数转化为一系列单参数函数的技术。

应该说现在维基上的中英文两版在最开头对柯里化的定义是完全不同的。基于中文翻译时常不准确的原则，我还是选择相信英文版本的维基定义。

维基百科中对于柯里化的中文描述，更像是另一个概念：偏函数应用（Partial Application），具体的后续再谈,先看柯里化。

# JavaScript实现的柯里化

按照定义，对一个多参数函数进行柯里化后，返回的是一系列单参数函数,每次传入一个参数进行调用，直到最后返回多参数函数执行的结果。

那么可以知道，在调用这个柯里化后的单参数函数到一定次数（多参数函数的参数个数）之前，函数返回的都是一个新的函数，这就很明显需要用到递归。

根据这个来写代码：

```JavaScript
// ES5
var curry = function (fn, arr) {
  var slice = Array.prototype.slice
  var length = fn.length
  var args = arr || []

  return function () {
    args = args.concat(slice.call( arguments))
    if(args.length < length){
      // 如果柯里化后的函数调用使用参数不足原函数所需参数数量，继续返回一个柯里化函数
      return curry(fn, args)
    }else {
      return fn.apply(null, args)
    }
  }
}

// ES6
const curry = (fn, arr = []) => (...args) => (
  arg => arg.length >= fn.length
    ? fn(...arg)
    : curry(fn, ..arg)
)([...arr, ...args])
```

## 带有占位符功能的柯里化函数

上面的柯里化函数可以很好的处理参数从左至右依次传入的情况，但是如果想要在某些位置的参数未知的情况下，传入它后面的参数，那么我们需要在上面的基础上，增加一个占位符。

```JavaScript
function curry(fn, args, vacants, placeholder) {
  placeholder = placeholder || {}
  var length = fn.length
  args = args || []
  vacants = vacants || []

  return function () {
    
  }
}
```

# 柯里化函数的作用
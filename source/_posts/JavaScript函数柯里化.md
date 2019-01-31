---
title: JavaScript函数柯里化
tags:
  - JavaScript
  - 函数化编程
  - 学习笔记
date: 2019-01-16 22:03:48
---

> 从进入JS的世界开始就一直在听说柯里化这个词，到底柯里化是什么？

<!-- more -->

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

以下代码主要来自于[JavaScript专题之函数柯里化](https://github.com/mqyqingfeng/Blog/issues/42)，原博对代码注释并没有特别的详细，还是得自己分析写注释才能够明白思路

```JavaScript
/**
 * @description 带有占位符，可分批分位置传参的柯里化函数
 *
 * @param {function} fn 需要被柯里化的函数
 * @param {array} args 用于记录 fn 中已传入的所有参数，包括占位参数
 * @param {array} holes 用于记录 fn 的参数中，当前剩余的占位参数的位置
 * @param {string} _ 占位参数
 */
function curry(fn, args, holes, _) {
  args = args || []
  holes = holes || []
  _ = _ || 'placeholder'
  var length = fn.length

  return function() {
    var _args = args.slice(0),
        _holes = holes.slice(0),
        argsLen = args.length,
        holesLen = holes.length,
        index = 0, // index 用来指向当前传入的 arguments 被遍历到的成员是第几个占位符
        i,
        temp

    for (i = 0; i < arguments.length; i++) {
      temp = arguments[i]
      if (temp === _ && holesLen) {
        // 如果当前 temp 为占位符，且上一次调用传入的参数中已经出现过占位符
        index++
        // 只有当当前 temp 的位置为一个新的占位符位置时才会被推入 _args 数组
        // 否则将跳过这个占位符
        if (index > holesLen) {
          _args.push(temp)
          _holes.push(_args.length)
          // _holes = _holes.push([argsLen - 1 + index - holesLen])
        }
      } else if (temp === _) {
        // 如果当前 temp 为占位符，且上一次调用传入的参数中没有出现过占位符
        // 那么，先直接推入 _args 数组
        // 再在 _holes 数组中记录这个占位符在 _args 中的位置
        _args.push(temp)
        _holes.push(argsLen + i)
      } else if (holesLen) {
        // 如果当前 temp 不为占位符，且上一次调用传入的参数中有占位符
        // 判断当前 temp 的位置是否为一个已有的占位符的位置，用 index 来标识这个位置
        if (index >= holesLen) {
          // 如果在 (temp === _ && holesLen) 语句中已经跳过了所有占位符位置，那么就证明这是一个新的参数
          _args.push(temp)
        } else {
          // 如果在 (temp === _ && holesLen) 语句中没有跳过所有占位符，那么就证明这是一个用来替代占位符的参数
          _args.splice(_holes[index], 1, temp)
          _holes.splice(index, 1)
        }
      } else {
        // 如果当前 temp 不为占位符，且上一次调用传入的参数中没有占位符
        // 那么直接推入接下来要用的 _args 数组
        _args.push(temp)
      }
    }
  
    if (_holes.length || _args.length < length) {
      return curry.call(this, fn, _args, _holes, _)
    } else {
      return fn.apply(this, _args)
    }
  }
}
```

使用：

```JavaScript
var _ = 'placeholder'
var fn = curry(function(a,b,c,d,e){
  console.log([a,b,c,d,e])
})

// 输出都是 [1,2,3,4,5]
fn(1, 2, 3, 4, 5);
fn(_, 2, 3, 4, 5)(1);
fn(1, _, 3, 4, 5)(2);
fn(1, _, 3)(_, 4)(2)(5);
fn(1, _, _, 4)(_, 3)(2)(5);
fn(_, 2)(_, _, 4)(1)(3)(5)
```

# 柯里化函数的意义

## 参数固定与函数复用

参数的固定与函数复用分两个方面

### 将不会随意改变的参数固定下来，返回一个等待接收剩余参数的函数，以待复用

```JavaScript
function ajax(type, url, data){
  var xhr = new XMLHttpRequest()
  xhr.open(type, url, true)
  xhr.send(data)
}

// 柯里化后就有了一个只处理'POST'操作的 AJAX 请求
var post = curry(ajax('POST'))

// 更进一步,还可以针对特定 url
var postTo = post('www.test.com')

// 使用时，只要传入参数即可
postTo('name=moses')
```

另外，也可以利用柯里化较为抽象、通用的函数，放在map,filter这样的原生函数中使用，效果拔群：

```JavaScript
var getProp = curry(function(key, obj){
  return obj[key]
})

var person = [{name: 'moses'},{name:'PPPPP'}]
var names = person.map(getProp('name'))
```

这样，`names`就是一个完全由`person`中的`name`值组成的数组,`getProp`函数还可以用来在别的地方取不同的属性值。

虽然在这个例子中看起来代码量反而变多了，但是放在一个完整的项目里，一个通用且抽象的多参数函数，缩小了函数的适用范围，但在另一方面提升了使用功能的明确性，在业务代码的编写中节省代码量。

### 固定易变参数，生成一个明确的功能函数

这方面典型的代表就是`bind`函数，提前固定`this`的值，以防后续在函数调用时，由于调用环境的变化导致`this`指向报错。

`Function.prototype.bind`方法将目标函数执行上下文设置为`bind`方法的第一个值，方法的其他参数将依次传给目标函数，但并不执行（这也可以看做使一种延迟执行），返回一个新的绑定了执行上下文的函数。

## 延迟执行

柯里化的另一个意义就是延迟执行，不断地积累参数，直到最后参数积累完成时再一次性进行计算执行。

# 关于柯里化的性能备注

> 通常来说，使用柯里化确实会产生一定的性能开销。但是大多数情况下，性能瓶颈总是来源于其他原因，而非柯里化

关于性能有几个点：

- 存取`arguments`对象通常要比存取命名参数要**慢**一些

- 有一些老版本的浏览器，在`arguments.length`的实现上相当慢

- 创建大量嵌套作用域和闭包会带来额外的开销，无论使在内存还是运行速度上都是

# 我真的需要柯里化么？

如果不进行函数式编程的学习和应用，我在日常的开发中基本感受不到柯里化的需求，如果没有准备好进行纯正的函数式编程，那么柯里化显得可有可无。

柯里化实现的那些特性，比如说延迟执行、绑定参数，那么`bind`和箭头函数已经可以满足，而且性能也往往比柯里化要更好一些。

但是另一方面来说，柯里化应函数式编程而生，在进行函数式编程的过程中，柯里化是必不可少的工具。柯里化的思想，也有助于提升函数的复用性。

并且，提供了`placeholder`的柯里化函数，在我们无法同时得到一个函数的所有参数时，利用柯里化，暂存所有已知参数，等待位置参数返回，在进行函数调用时，就显得尤为有用，因为不用再手动进行参数的暂存。

# 最后

在开篇的时候除了柯里化的定义，还提到了与其相似的一个偏函数应用。

仔细看在这片文章里提到的柯里化实现，按照现在的实现，不仅仅可以传入单参数，还可以传入多参数，甚至带有占位符的多参数，似乎显得“不那么柯里化”？结合偏函数应用的定义，是不是更像是一个柯里化和偏函数应用的中间产物？那这到底是为什么？

之后再总结一下偏函数应用吧。
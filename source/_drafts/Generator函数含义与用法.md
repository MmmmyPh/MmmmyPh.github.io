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

> 自从开始使用React+Redux+Redux-Saga后，在Saga里Generator函数用的很多，回过头想想，对Generator貌似没有一个很系统的理解。这次就稍微整理一下。

# JavaScript异步

对于单线程的JS来说，异步显得尤为重要，简单总结异步，就是将一个可能非常耗时或者类似请求的任务分成两段，先执行第一段，转而执行其他任务，等准被完毕后，再回头执行第二段。在 Generator 出来之前，JS中的异步操作主要有下面几种方式：

- 回调函数

- 事件监听

- 发布/订阅

- Promise

## 回调函数

考虑一个例子来理解回调：

> 你到一个商店买东西，刚好要的东西没货，于是你在店员那儿留下你的联系电话，然后离开去做别的事情；过了几天店里有货了，店员给打了电话给你，然后你就去店里取货。

在这个例子里，你的电话号码就是**回调函数**，你把你的电话留给店员，叫做**登记回调函数**，店里有货了，叫做**触发回调关联的事件**，店员给你打电话，叫做**触发回调函数**，你去店里取货，叫做**响应回调事件**

```javaScript
fs.readFile('./fs-example.js', function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

上面代码中，`readFile`函数的第二个参数，就是回调函数，也就是任务的第二段。等到操作系统返回了`fs-example.js`这个文件以后，回调函数才会执行。

## Promise

```javaScript
var readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function(data){
  console.log(data.toString());
})
.then(function(){
  return readFile(fileB);
})
.then(function(data){
  console.log(data.toString());
})
.catch(function(err) {
  console.log(err);
});
```

## 问题所在

回调函数本身没有问题，问题在于，当需要写一系列的需要按照次序进行的异步操作时，会出现一个令人恶心的回调地狱。

```javaScript
fs.readFile('./a.js', function (err, data) {
  fs.readFile('./b.js', function (err, data) {
    ...
  });
});
```

虽然不太常见，但是可以想象，当出现多重嵌套时，代码横向发展乱成一团。

Promise的出现就是为了解决这个问题，让代码纵向发展，但是Promise的写法也导致了如果出现一系列有次序的异步操作，会出现一大堆的then，并且有很多的代码冗余。

# Generator

> Generator出现的目标是用更像同步编程的方式实现异步编程的目标。

> Generator可以暂停、恢复函数执行，且能够实现函数内外的数据交换和错误处理，这三点一起构成了一个异步编程的完整解决方案。

## 基本概念与暂停、恢复执行

Generator可以理解成一个状态机，用`yield`关键字分割定义了内部不同的状态，形式上是一个用星号在`function`关键字和函数名之间标识,以示与普通函数的区别。

```javaScript
function* gen(){
  yield 'hello'
  yield 'generator'
  return
}

let g = gen()
g.next()
g.next()
```

上面的代码中，`gen`就是一个Generator函数，调用`gen`函数返回的是一个**遍历器对象**。

需要注意的是，执行这个函数并不会执行函数内部的逻辑，只有在第一次调用`g.next()`的时候，才会开始执行函数内部的逻辑，遇到`yield`关键字，暂停这一次执行，交出函数的执行权。

用`yield`关键字暂停执行，用遍历器对象的`next`方法来恢复执行，这是Generator函数能够用来封装异步方法的根本原因。

## 函数体内外的数据交换

Generator函数有着完整的函数体内外数据的交换机制。

`next`方法返回一个包含了`value`和`done`属性的对象,`value`属性是Generator函数向外输出数据的途径；

同时，`next`方法还可以接受参数，用来作为上一个`yield`关键字暂停函数，重新启动时跟在上一个`yield`后的表达式的返回值，这是向Generator函数输入数据的途径。

```javaScript
function* gen(x){
  let y = yield x * 2
  return y
}
let g = gen(3)
let z = g.next() // {value: 6, done: false}
g.next(3) // {value: 3, done: true}
```

## 错误处理

Generator函数内部还可以部署错误处理代码，用来捕获处理**函数体外**抛出的错误。

```javaScript
function* gen(x){
    try {
        let y = yield x + 2;
    } catch (error) {
        console.log(error);
    }
}
let g = gen(3)
g.next()  // {value: 5, done: false}
g.throw('error') // error
```

在函数体外使用了`g.throw`抛出错误后，会被函数体内的`try...catch`捕获；

如果`try`代码块内有多个`yield`，使用`g.throw`都会跳过所有未执行到的`yield`表达式，并且自动执行`try...catch`代码块后的一条`yield`表达式，如果没有，则会将`done`设置为`true`(即`g.throw`的执行附带执行一次`g.next`)；

后续如果继续用`g.throw`抛出错误，将不再被Generator函数捕获，需要在外部进行错误捕获。

```javaScript
function* gen(x){
  try {
    let y = yield x + 2;
    let z = yield 333;
    let i = yield 444
  } catch (error) {
    console.log(error);
  }

  let j = yield 55555
  let k = yield 6666
}

let g5 = gen(1)
g5.next() // {value: 3, done: false}
g5.throw('err') // err
g5.next() // {value: 6666, done: false}
```

以下几种情况，用`g.throw`抛出的错误会被外部`try...catch`代码块捕获：

1. Generator内部没有部署`try...catch`代码块

2. 在实例化了Generator后，没有执行`g.next`直接使用`g.throw`抛出错误。这是因为，实例化Generator不代表Generator内部代码逻辑开始执行，只有在第一次执行了`g.next`方法后，才启动了Generator内部的逻辑

如果在Generator内部没有部署`try...catch`代码，那么在Generator内部抛出的错误也将会被外部捕获：

```javaScript
function* foo() {
  var x = yield 3
  var y = x.toUpperCase()
  yield y
}

var it = foo()

it.next(); // {value:3, done: false}

try {
  it.next(42)
} catch (err) {
  console.log(err)
}
it.next(3) // {value: undefined, done: true}
```

`it.next(42)`传入的数值42不具有`toUpperCase`方法，因此会抛出TypeError错误被函数体外的`try...catch`捕获。

同时，如果一旦在Generator中抛出错误，且未被内部捕获，那么整个Generator将会被标记为`done:true`，接下来再执行`g.next()`也只会得到`{value: undefined, done: true}`

## Generator对异步任务封装

```javaScript
let fetch = require('node-fetch')

function* genFetch(){
  let url = 'https://api.github.com/users/github'
  let result = yield fetch(url)
  console.log(result)
}

let g = genFetch()
let result = g.next()
result.value.then((data) => {
  return data.json()
}).then((json) => {
  g.next(json)
})
```

用Generator函数封装了一个异步动作，执行`genFetch`返回一个遍历器对象后，使用`g.next()`开启异步第一段；`fetch`返回一个Promise对象，所以在`then`中进行数据的解析，并用`g.next()`开始异步任务的第二段。

逻辑很清晰，但是流程管理看起来很复杂，也会对理解代码造成负担。

# Thunk函数

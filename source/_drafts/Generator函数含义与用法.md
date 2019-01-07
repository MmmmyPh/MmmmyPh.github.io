---
title: Generator函数含义与用法
tags:
  - JavaScript
  - 学习笔记
---

> 自从开始使用React+Redux+Redux-Saga后，在Saga里Generator函数用的很多，回过头想想，对Generator貌似没有一个很系统的理解。那么这次就稍微整理一下笔记吧。

**Generator的目的，是让我们能够以更像编写同步代码的方式，完成异步代码的编写，与此同时，相比回调函数和Promise，Generator最大的优势是，在处理多个串行异步任务时，能够保证异步动作能够按照我们想要的方式依次进行，又不至于如使用回调函数那般陷入回调地狱。**

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
let readFile = require('fs-readfile-promise');

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

> Generator出现的目标是用更像同步编程的方式实现异步编程的目标，更重要的是，Generator可以以同步编程的方式，让异步编程按照我们想要的次序依次进行，即，在前一个异步完成后，再调用后一个异步动作，并同时不至于陷入回调地狱。
>
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
  let x = yield 3
  let y = x.toUpperCase()
  yield y
}

let it = foo()

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

Thunk函数是对**传名调用**的一个实现：将传入函数的表达式，放入一个临时函数中，再将临时函数传入目标函数中，函数中用到表达式的地方都用调用这个临时函数来替代。

这个临时函数，就是Thunk函数。

在JavaScript是使用传值调用的语言，对于JS来说，Thunk函数替换的是多参数函数，将多参数函数替换成一个只接受回调函数的单参数函数。

## 简单的Thunk函数转换器

将一个多参数函数，转换成一个只接受回调函数的Thunk函数：

```javaScript
const Thunkify = function(fn) {
  return function (...args) {
    return function (callBack) {
      return fn.call(null, ...args, callBack)
    }
  }
}
```

## Thunkify模块

有一个现成的Thunkify模块，在之前的简单的Thunk转换函数的基础上还增加了对回调函数调用次数的限制判断，保证回调函数只会执行一次。

```javaScript
function thunkify(fn) {
  return function () {
    // 创建一个数组，用于存放多参数函数除了回调函数以外其他所有函数
    var args = new Array(arguments.length)
    // 获取上下文环境，用于后面绑定执行上下文
    var ctx = this

    // 将函数参数放到数组的对应位置
    for(var i = 0; i < arguments.length; i++){
      args[i] = arguments[i]
    }

    // fn.apply(ctx, args)
    // 对fn的执行函数不能放在这里
    // 因为对于异步任务，回调函数只有在主线程有空了的情况下才会执行，所以当fn.apply()放在这里，
    // 异步函数能够确保流程控制函数被作为回调函数的内容注入后，回调函数才会执行
    // 而同步函数则不能，传给同步函数的回调函数，会在流程控制函数注入前就立刻执行，之后再注入控制函数就实效了
    // 因此要将异步任务的执行时机延后

    return function (cb) {
      // 定义一个是否执行的flag
      var called
      // 在参数数组中压入回调函数，并用flag保证回调只执行一次
      args.push(function(){
        if(call) return
        called = true
        cb.apply(null, arguments)
      })

      // 在try...catch模块中执行函数，捕获错误后也将错误信息传入回调函数中
      try{
        // 整个函数的执行被定义在传入了回调函数之后，这是为了兼容Thunk化的同步任务
        fn.apply(ctx, args)
      }catch (err) {
        cb(err)
      }
    }
  }
}
```

应用：

```javaScript
function f(a, b, cb){
  let sum = a + b;
  cb(sum);
  cb(sum);
}

let ft = thunkify(f);
let print = console.log.bind(console);
ft(1, 2)(print);
```

上面那段代码中，只会有一次输出。而如果直接调用函数`f`，则会有两次输出。

## 基于Thunk函数的Generator函数自动流程

一般意义上来说，Thunk函数是没有什么实际作用的，但是当需要对Generator函数进行自动执行的管理时，Thunk函数就有了大用处。

例如下面这个按照次序读取文件Generator函数：

```javaScript
// 模拟文件
const file = {
  'file1.txt': "file2.txt",
  'file2.txt': 'Hello, Generator!'
};

// 模拟读取文件操作
function readFile(filename, cb) {
  setTimeout(function() {
    cb(null, file[filename]);
  }, 1000)
}

// 用之前的thunkify模块将 readFile 函数转化为一个 Thunk 函数
const readFileThunk = thunkify(readFile)

function* readGen() {
  // 读取 file1 的内容
  const f1 = yield readFile('file1.text')
  // 用读取到的 file1 内容作为下一个文件名，读取 file2 的内容
  const f2 = yield readFile(f1)
  console.log(f2)
}
```

手动执行上面这个Generator函数：

```javaScript
let read = readGen()
let file1 = read.next()

file1.value(function (err, data){
  if(err) throw err
  let file2 = read.next(data)
  file2.value(function (err, data){
    if(err) throw err
    read.next(data)
  })
})
```

仔细观察上面手动执行的逻辑：对整个Generator函数的调用执行的过程，就是向`read.next`调用返回的`value`属性（由于`readFile`函数经过Thunk转换，调用返回的是一个函数）传入同一个回调函数的过程。

那么，在此基础上，就可以进行自动执行逻辑的编写了：

```javaScript
function run(gen) {
  let g = gen()

  function next(err, data) {
    let result = g.next()
    if(result.done) return
    result.value(next)
  }

  next()
}

function* genFunc(){
  ...
}

run(genFunc)
```

**注意：能够使用自动执行模块的Generator函数，其内部包含的异步函数，都需要经过Thunk化转化为一个Thunk函数：执行一次后返回一个接收回调函数的函数。**

## 基于Promise的自动执行

基于Promise的自动执行，与基于Thunk函数的类似，只不过，基于Promise的自动执行要求Generator函数中，跟随在`yield`关键字后的异步动作，返回的必须是一个Promise对象，然后不是直接调用回调函数，而是`then`方法，层层回调。

# co模块

[co模块](https://github.com/tj/co)合并了Thunk函数和Promise两种模式，源码很精炼，给人启发很多。

立个flag，之后要去再研究研究co的源码，写一些总结。
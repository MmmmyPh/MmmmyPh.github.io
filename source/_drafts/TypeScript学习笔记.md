---
title: TypeScript疑问记录
tags:
  - TypeScript
  - 学习笔记
---

# 接口检查条件

下面这种不报错

```TypeScript
function printLabel(labelledObj: { label: string }) {
	console.log(labelledObj.label);
}
let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

```TypeScript
interface SquareConfig {
	color?: string;
	width?: number;
}
function createSquare(config: SquareConfig): {color: string; area: number} {
	// ...
}
let config = { color: 'black', height: 100 }
let square = createSquare(config)
```

下面这种报错

```TypeScript
function printLabel(labelledObj: { label: string }) {
	console.log(labelledObj.label);
}
printLabel({ size: 10, label: "Size 10 Object" });
```

```TypeScript
interface SquareConfig {
    color?: string;
    width?: number;
}
function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}
let mySquare = createSquare({ colour: "red", width: 100 });
```

原因： 当**对象字面量**被赋值给变量，或者作为参数传递时，会被 *特殊对待* 而且会经过 *额外属性检查*。 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。

绕开报错的方法：

1. 类型断言

```TypeScript
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

2. 添加字符串索引签名

```TypeScript
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

3. 将这个对象赋值给一个另一个变量

这也就是上面不会报错的例子。因为`config`没有进行对象类型（接口）的指定，不会经过额外属性检查，所以编译器不会报错。

但是向这样的简单代码，不需要用这样的方法。对于包含方法和内部状态的复杂对象字面量来讲，可能需要使用这些技巧，但是大部额外属性检查错误是真正的bug，亦即是说，应该去检查'option bags'的类型定义，修改类型声明。
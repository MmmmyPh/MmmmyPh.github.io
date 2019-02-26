---
title: JavaScript方法函数总结
tags:
  - JavaScript
  - 学习笔记
---

> 记录一下工作以及学习中碰到的JS方法，时常复习，也可以作为以后备用

## 数据类型检查

```JavaScript
/**
* 获取数据的类型
* @param {any} data
* @returns {String} Data type of data
*/
const typeCheck = data => Object.prototype.toString.call( data ).match( /\[object (.*?)\]/ )[ 1 ].toLowerCase();

/**
 * 在typeCheck对象上挂载判断传入参数的类型判断函数
 * @param {any} obj
 * @returns {Boolean}
 */
[
  'Null',
  'Undefined',
  'Object',
  'Array',
  'String',
  'Number',
  'Boolean',
  'Function',
  'RegExp',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
].forEach( t => {
  typeCheck[ `is${ t }` ] = ( obj ) => !!( obj && typeCheck( obj ) === t.toLowerCase() );
} );
```

## Object相关

### 检查对象是否为空

```JavaScript
/**
 * * 检查一个Object对象是否为空
 * @param {Object} object
 * @returns
 */
export const isEmpty = obj => {
  for ( let name in obj ) {
    return false;
  }
  return true;
};
```

### 检查对象的深度

```JavaScript
/**
 * * 检查对象的深度
 * @param {any} obj
 * @returns
 */
export const depthOf = obj => {
  let level = 1;
  let key;
  for ( key in obj ) {
    if ( !obj.hasOwnProperty( key ) ) continue;

    if ( typeof obj[ key ] === 'object' ) {
      let depth = depthOf( obj[ key ] ) + 1;
      level = Math.max( depth, level );
    }
  }
  return level;
};
```

# 临时记录

## transduce

```JavaScript
const isEven = num => num % 2 === 0;
const triple = num => num * 3;

const genNumArr = (length, limit) => Array.from({ length }, _ => Math.floor(Math.random() * limit));

const bigNum = genNumArr(1e6, 100);

const filter = judgeFunc => reducer => ( acc, value ) => judgeFunc( value ) ? reducer( acc, value ) : acc;

const map = f => reducer => ( acc, value ) => reducer( acc, f( value ) );

const pipe = ( ...fns ) => ( ...args ) => fns.reduce( ( fx, fy ) => fy( fx ), ...args );

const pushReducer = (acc, value) => (acc.push(value), acc);

// 解析：
bigNum.reduce(map(triple)(filter(isEven)(pushReducer)), []);

// 其中的reduce的callback：
(acc, value) => {
	return filter(isEven)(pushReducer)(acc, triple(value))
}
//==>
(acc, value) => {
	return ((acc, value) => {
		if(isEven(value)) return pushReducer(acc, value)
		return acc
	})(acc, triple(value))
}
//==>
(acc, value) => {
	let newValue = triple(value)
	if(isEven(newValue)) return pushReducer(acc, newValue)
	return acc
}

// 采用了pipe也是一样的执行顺序，先map,再filter
bigNum.reduce(
  pipe(
    filter(isEven),
    map(triple)
  )(pushReducer),
  []
);
```
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
function sub_curry(fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        return fn.apply(this, args.concat([].slice.call(arguments)));
    };
}

function curry(fn, length) {

    length = length || fn.length;

    var slice = Array.prototype.slice;

    return function() {
        if (arguments.length < length) {
            var combined = [fn].concat(slice.call(arguments));
            return curry(sub_curry.apply(this, combined), length - arguments.length);
        } else {
            return fn.apply(this, arguments);
        }
    };
}

function f(a, b, c) {
    return [a, b, c]
}

const cF1 = curry(f) === function() {
    if (arguments.length < f.length) {
        var combined = [f].concat(slice.call(arguments));
        return curry(sub_curry.apply(this, combined), f.length - arguments.length);
    } else {
        return f.apply(this, arguments);
    }
};

const cF2 = cF1(1) ===
    curry(function() {
        return f.apply(this, [1].concat([].slice.call(arguments)));
    }, 2) ===

    function() {
        if (arguments.length < 2) {
            var combined = [function() {
                return f.apply(this, [1].concat([].slice.call(arguments)));
            }].concat(slice.call(arguments));
            return curry(sub_curry.apply(this, combined), 2 - arguments.length);
        } else {
            return f.apply(this, arguments);
        }
    };

const cF3 = cF(1)(2) 
			=== curry(sub_curry.apply(this, [function() {
					return f.apply(this, [1].concat([].slice.call(arguments)));
				}, 2]), 1) 
			=== function() {
					if (arguments.length < 1) {
						//...
					} else {
						return function() {
							return function () {
								return f.apply(this, [1].concat([].slice.call(arguments)));
							}.apply(this, [2].concat([].slice.call(arguments)));
						}.apply(this, arguments);
					}
				};
	
const cF4 = cF(1)(2)(3)
			=== function (3) {
					return function () {
						return f.apply(this, [1].concat([].slice.call(arguments)));
					}.apply(this, [2].concat([].slice.call(arguments)));
				}
			=== function () {
					return f.apply(this, [1].concat([].slice.call(arguments)));
				}.apply(this, [2, 3]);
			=== f.apply(this, [1, 2, 3]);
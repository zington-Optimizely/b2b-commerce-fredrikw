/* eslint-disable no-bitwise */
/* eslint-disable no-extend-native */
/* eslint-disable prefer-rest-params */

import "url-search-params-polyfill";

if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, "fill", {
        value(value: any) {

            // Steps 1-2.
            if (this == null) {
                throw new TypeError("this is null or not defined");
            }

            const O = Object(this);

            // Steps 3-5.
            // eslint-disable-next-line no-bitwise
            const len = O.length >>> 0;

            // Steps 6-7.c
            const start = arguments[1];
            // eslint-disable-next-line no-bitwise
            const relativeStart = start >> 0;

            // Step 8.
            let k = relativeStart < 0
                ? Math.max(len + relativeStart, 0)
                : Math.min(relativeStart, len);

            // Steps 9-10.
            const end = arguments[2];
            const relativeEnd = end === undefined
                // eslint-disable-next-line no-bitwise
                ? len : end >> 0;

            // Step 11.
            const final = relativeEnd < 0
                ? Math.max(len + relativeEnd, 0)
                : Math.min(relativeEnd, len);

            // Step 12.
            while (k < final) {
                O[k] = value;
                k++;
            }

            // Step 13.
            return O;
        },
    });
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, "startsWith", {
        value(search: string, pos: number) {
            const position = !pos || pos < 0 ? 0 : +pos;
            return this.substring(position, position + search.length) === search;
        },
    });
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find#Polyfill
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value(predicate: any) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
            throw TypeError("\"this\" is null or not defined");
        }

        const o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        const len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== "function") {
            throw TypeError("predicate must be a function");
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        const thisArg = arguments[1];

        // 5. Let k be 0.
        let k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            const kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
            }
            // e. Increase k by 1.
            k++;
        }

        // 7. Return undefined.
        return undefined;
        },
        configurable: true,
        writable: true,
    });
}

// https://tc39.es/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement: any, ...args: number[]) {
        if (this == null) {
            throw new TypeError("Array.prototype.includes called on null or undefined");
        }

        const O = Object(this);
        const len = parseInt(O.length, 10) || 0;
        if (len === 0) {
            return false;
        }

        const n = args[1] || 0;
        let k: any;

        if (n >= 0) {
            k = n;
        } else {
            k = len + n;

            if (k < 0) {
                k = 0;
            }
        }

        let currentElement: any;

        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement
            // eslint-disable-next-line no-self-compare
            || (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }

        return false;
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill
// https://tc39.es/ecma262/#sec-string.prototype.includes
if (!String.prototype.includes) {
    String.prototype.includes = function (search: any, start: any) {
      if (search instanceof RegExp) {
        throw TypeError("first argument must not be a RegExp");
      }
      if (start === undefined) { start = 0; }
      return this.indexOf(search, start) !== -1;
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#Polyfill
// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, "findIndex", {
      value(predicate: any) {
       // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError("\"this\" is null or not defined");
        }

        const o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        const len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== "function") {
          throw new TypeError("predicate must be a function");
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        const thisArg = arguments[1];

        // 5. Let k be 0.
        let k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return k.
          const kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return k;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return -1.
        return -1;
      },
      configurable: true,
      writable: true,
    });
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
if (!Element.prototype.matches) {
    Element.prototype.matches
        = (Element.prototype as any).msMatchesSelector
        || Element.prototype.webkitMatchesSelector;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
if (!Element.prototype.closest) {
    Element.prototype.closest = function (s: string) {
        let el: any = this;

        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
if(!Number.isNaN) {
    Number.isNaN = function isNaN(input: number) {
        // eslint-disable-next-line no-self-compare
        return typeof input === "number" && input !== input;
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
if (Number.isFinite === undefined) {
    Number.isFinite = function (value) {
        // eslint-disable-next-line no-restricted-globals
        return typeof value === "number" && isFinite(value);
    };
}

if (!window.WeakSet) {
    class WeakSet<T extends object = object> {
        private readonly map = new WeakMap<T>();

        constructor(values?: readonly T[] | null | undefined) {
            values?.forEach(this.add);
        }

        add(value: T) {
            this.map.set(value, this);
            return this;
        }

        delete(value: T) {
            return this.map.delete(value);
        }

        has(value: T) {
            return this.map.has(value);
        }
    }

    window.WeakSet = WeakSet as any;
}

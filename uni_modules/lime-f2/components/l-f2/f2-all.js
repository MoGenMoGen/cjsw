(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.F2 = {}));
}(this, (function (exports) { 'use strict';

    var isArrayLike = function (value) {
      /**
       * isArrayLike([1, 2, 3]) => true
       * isArrayLike(document.body.children) => true
       * isArrayLike('abc') => true
       * isArrayLike(Function) => false
       */
      return value !== null && typeof value !== 'function' && isFinite(value.length);
    };

    var contains = function (arr, value) {
      if (!isArrayLike(arr)) {
        return false;
      }

      return arr.indexOf(value) > -1;
    };

    var filter = function (arr, func) {
      if (!isArrayLike(arr)) {
        return arr;
      }

      var result = [];

      for (var index = 0; index < arr.length; index++) {
        var value = arr[index];

        if (func(value, index)) {
          result.push(value);
        }
      }

      return result;
    };

    var toString = {}.toString;

    var isType = function (value, type) {
      return toString.call(value) === '[object ' + type + ']';
    };

    /**
     * 是否为函数
     * @param  {*} fn 对象
     * @return {Boolean}  是否函数
     */
    var isFunction = (function (value) {
      return isType(value, 'Function');
    });

    // isFinite,
    var isNil = function (value) {
      /**
       * isNil(null) => true
       * isNil() => true
       */
      return value === null || value === undefined;
    };

    var isArray = (function (value) {
      return Array.isArray ? Array.isArray(value) : isType(value, 'Array');
    });

    var isObject = (function (value) {
      /**
       * isObject({}) => true
       * isObject([1, 2, 3]) => true
       * isObject(Function) => true
       * isObject(null) => false
       */
      var type = typeof value;
      return value !== null && type === 'object' || type === 'function';
    });

    function each(elements, func) {
      if (!elements) {
        return;
      }

      var rst;

      if (isArray(elements)) {
        for (var i = 0, len = elements.length; i < len; i++) {
          rst = func(elements[i], i);

          if (rst === false) {
            break;
          }
        }
      } else if (isObject(elements)) {
        for (var k in elements) {
          if (elements.hasOwnProperty(k)) {
            rst = func(elements[k], k);

            if (rst === false) {
              break;
            }
          }
        }
      }
    }

    var keys = Object.keys ? function (obj) {
      return Object.keys(obj);
    } : function (obj) {
      var result = [];
      each(obj, function (value, key) {
        if (!(isFunction(obj) && key === 'prototype')) {
          result.push(key);
        }
      });
      return result;
    };

    function isMatch(obj, attrs) {
      var _keys = keys(attrs);

      var length = _keys.length;
      if (isNil(obj)) return !length;

      for (var i = 0; i < length; i += 1) {
        var key = _keys[i];

        if (attrs[key] !== obj[key] || !(key in obj)) {
          return false;
        }
      }

      return true;
    }

    var isObjectLike = function (value) {
      /**
       * isObjectLike({}) => true
       * isObjectLike([1, 2, 3]) => true
       * isObjectLike(Function) => false
       * isObjectLike(null) => false
       */
      return typeof value === 'object' && value !== null;
    };

    var isPlainObject = function (value) {
      /**
       * isObjectLike(new Foo) => false
       * isObjectLike([1, 2, 3]) => false
       * isObjectLike({ x: 0, y: 0 }) => true
       * isObjectLike(Object.create(null)) => true
       */
      if (!isObjectLike(value) || !isType(value, 'Object')) {
        return false;
      }

      if (Object.getPrototypeOf(value) === null) {
        return true;
      }

      var proto = value;

      while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
      }

      return Object.getPrototypeOf(value) === proto;
    };

    function find(arr, predicate) {
      if (!isArray(arr)) return null;

      var _predicate;

      if (isFunction(predicate)) {
        _predicate = predicate;
      }

      if (isPlainObject(predicate)) {
        _predicate = function (a) {
          return isMatch(a, predicate);
        };
      }

      if (_predicate) {
        for (var i = 0; i < arr.length; i += 1) {
          if (_predicate(arr[i])) {
            return arr[i];
          }
        }
      }

      return null;
    }

    var getRange = function (values) {
      // 存在 NaN 时，min,max 判定会出问题
      var filterValues = values.filter(function (v) {
        return !isNaN(v);
      });

      if (!filterValues.length) {
        // 如果没有数值则直接返回0
        return {
          min: 0,
          max: 0
        };
      }

      if (isArray(values[0])) {
        var tmp = [];

        for (var i = 0; i < values.length; i++) {
          tmp = tmp.concat(values[i]);
        }

        filterValues = tmp;
      }

      var max = Math.max.apply(null, filterValues);
      var min = Math.min.apply(null, filterValues);
      return {
        min: min,
        max: max
      };
    };

    var isString = (function (str) {
      return isType(str, 'String');
    });

    var uniq = function (arr) {
      var resultArr = [];
      each(arr, function (item) {
        if (!contains(resultArr, item)) {
          resultArr.push(item);
        }
      });
      return resultArr;
    };

    function head(o) {
      if (isArrayLike(o)) {
        return o[0];
      }

      return undefined;
    }

    function last(o) {
      if (isArrayLike(o)) {
        var arr = o;
        return arr[arr.length - 1];
      }

      return undefined;
    }

    var fixedBase = function (v, base) {
      var str = base.toString();
      var index = str.indexOf('.');

      if (index === -1) {
        return Math.round(v);
      }

      var length = str.substr(index + 1).length;

      if (length > 20) {
        length = 20;
      }

      return parseFloat(v.toFixed(length));
    };

    /**
     * 判断是否数字
     * @return {Boolean} 是否数字
     */

    var isNumber = function (value) {
      return isType(value, 'Number');
    };

    var toString$1 = (function (value) {
      if (isNil(value)) return '';
      return value.toString();
    });

    var lowerFirst = function (value) {
      var str = toString$1(value);
      return str.charAt(0).toLowerCase() + str.substring(1);
    };

    function substitute(str, o) {
      if (!str || !o) {
        return str;
      }

      return str.replace(/\\?\{([^{}]+)\}/g, function (match, name) {
        if (match.charAt(0) === '\\') {
          return match.slice(1);
        }

        return o[name] === undefined ? '' : o[name];
      });
    }

    var upperFirst = function (value) {
      var str = toString$1(value);
      return str.charAt(0).toUpperCase() + str.substring(1);
    };

    var toString$2 = {}.toString;

    var getType = function (value) {
      return toString$2.call(value).replace(/^\[object /, '').replace(/]$/, '');
    };

    /**
     * 是否是布尔类型
     *
     * @param {Object} value 测试的值
     * @return {Boolean}
     */

    var isBoolean = function (value) {
      return isType(value, 'Boolean');
    };

    var isDate = function (value) {
      return isType(value, 'Date');
    };

    var objectProto = Object.prototype;

    var isPrototype = function (value) {
      var Ctor = value && value.constructor;
      var proto = typeof Ctor === 'function' && Ctor.prototype || objectProto;
      return value === proto;
    };

    // FIXME: Mutable param should be forbidden in static lang.
    function _mix(dist, obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && key !== 'constructor' && obj[key] !== undefined) {
          dist[key] = obj[key];
        }
      }
    }

    function mix(dist, src1, src2, src3) {
      if (src1) _mix(dist, src1);
      if (src2) _mix(dist, src2);
      if (src3) _mix(dist, src3);
      return dist;
    }

    var MAX_MIX_LEVEL = 5;

    function _deepMix(dist, src, level, maxLevel) {
      level = level || 0;
      maxLevel = maxLevel || MAX_MIX_LEVEL;

      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          var value = src[key];

          if (value !== null && isPlainObject(value)) {
            if (!isPlainObject(dist[key])) {
              dist[key] = {};
            }

            if (level < maxLevel) {
              _deepMix(dist[key], value, level + 1, maxLevel);
            } else {
              dist[key] = src[key];
            }
          } else if (isArray(value)) {
            dist[key] = [];
            dist[key] = dist[key].concat(value);
          } else if (value !== undefined) {
            dist[key] = value;
          }
        }
      }
    } // todo 重写


    var deepMix = function (rst) {
      var args = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
      }

      for (var i = 0; i < args.length; i += 1) {
        _deepMix(rst, args[i]);
      }

      return rst;
    };

    var indexOf = function (arr, obj) {
      if (!isArrayLike(arr)) {
        return -1;
      }

      var m = Array.prototype.indexOf;

      if (m) {
        return m.call(arr, obj);
      }

      var index = -1;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === obj) {
          index = i;
          break;
        }
      }

      return index;
    };

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function isEmpty(value) {
      /**
       * isEmpty(null) => true
       * isEmpty() => true
       * isEmpty(true) => true
       * isEmpty(1) => true
       * isEmpty([1, 2, 3]) => false
       * isEmpty('abc') => false
       * isEmpty({ a: 1 }) => false
       */
      if (isNil(value)) {
        return true;
      }

      if (isArrayLike(value)) {
        return !value.length;
      }

      var type = getType(value);

      if (type === 'Map' || type === 'Set') {
        return !value.size;
      }

      if (isPrototype(value)) {
        return !Object.keys(value).length;
      }

      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }

      return true;
    }

    var isEqual = function (value, other) {
      if (value === other) {
        return true;
      }

      if (!value || !other) {
        return false;
      }

      if (isString(value) || isString(other)) {
        return false;
      }

      if (isArrayLike(value) || isArrayLike(other)) {
        if (value.length !== other.length) {
          return false;
        }

        var rst = true;

        for (var i = 0; i < value.length; i++) {
          rst = isEqual(value[i], other[i]);

          if (!rst) {
            break;
          }
        }

        return rst;
      }

      if (isObjectLike(value) || isObjectLike(other)) {
        var valueKeys = Object.keys(value);
        var otherKeys = Object.keys(other);

        if (valueKeys.length !== otherKeys.length) {
          return false;
        }

        var rst = true;

        for (var i = 0; i < valueKeys.length; i++) {
          rst = isEqual(value[valueKeys[i]], other[valueKeys[i]]);

          if (!rst) {
            break;
          }
        }

        return rst;
      }

      return false;
    };

    var map = function (arr, func) {
      if (!isArrayLike(arr)) {
        // @ts-ignore
        return arr;
      }

      var result = [];

      for (var index = 0; index < arr.length; index++) {
        var value = arr[index];
        result.push(func(value, index));
      }

      return result;
    };

    function size(o) {
      if (isNil(o)) {
        return 0;
      }

      if (isArrayLike(o)) {
        return o.length;
      }

      return Object.keys(o).length;
    }

    function merge(dataArray) {
      var rst = [];

      for (var i = 0, len = dataArray.length; i < len; i++) {
        rst = rst.concat(dataArray[i]);
      }

      return rst;
    }

    function values(data, name) {
      var rst = [];
      var tmpMap = {};

      for (var i = 0, len = data.length; i < len; i++) {
        var obj = data[i];
        var value = obj[name];

        if (!isNil(value)) {
          if (!isArray(value)) {
            if (!tmpMap[value]) {
              rst.push(value);
              tmpMap[value] = true;
            }
          } else {
            each(value, function (val) {
              if (!tmpMap[val]) {
                rst.push(val);
                tmpMap[val] = true;
              }
            });
          }
        }
      }

      return rst;
    }

    function firstValue(data, name) {
      var rst = null;

      for (var i = 0, len = data.length; i < len; i++) {
        var obj = data[i];
        var value = obj[name];

        if (!isNil(value)) {
          if (isArray(value)) {
            rst = value[0];
          } else {
            rst = value;
          }

          break;
        }
      }

      return rst;
    }

    function groupToMap(data, fields) {
      if (!fields) {
        return {
          0: data
        };
      }

      var callback = function callback(row) {
        var unique = '_';

        for (var i = 0, l = fields.length; i < l; i++) {
          unique += row[fields[i]] && row[fields[i]].toString();
        }

        return unique;
      };

      var groups = {};

      for (var i = 0, len = data.length; i < len; i++) {
        var row = data[i];
        var key = callback(row);

        if (groups[key]) {
          groups[key].push(row);
        } else {
          groups[key] = [row];
        }
      }

      return groups;
    }

    function group(data, fields, appendConditions) {
      if (appendConditions === void 0) {
        appendConditions = {};
      }

      if (!fields) {
        return [data];
      }

      var groups = groupToMap(data, fields);
      var array = [];

      if (fields.length === 1 && appendConditions[fields[0]]) {
        var _values = appendConditions[fields[0]];
        each(_values, function (value) {
          value = '_' + value;
          array.push(groups[value]);
        });
      } else {
        for (var i in groups) {
          array.push(groups[i]);
        }
      }

      return array;
    }

    function remove(arr, obj) {
      if (!arr) {
        return;
      }

      var index = arr.indexOf(obj);

      if (index !== -1) {
        arr.splice(index, 1);
      }
    }

    function getRange$1(values) {
      if (!values.length) {
        return {
          min: 0,
          max: 0
        };
      }

      var max = Math.max.apply(null, values);
      var min = Math.min.apply(null, values);
      return {
        min: min,
        max: max
      };
    }

    var array = /*#__PURE__*/Object.freeze({
        __proto__: null,
        merge: merge,
        values: values,
        firstValue: firstValue,
        group: group,
        groupToMap: groupToMap,
        remove: remove,
        getRange: getRange$1
    });

    /**
     * Detects support for options object argument in addEventListener.
     * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
     * @private
     */

    var supportsEventListenerOptions = function () {
      var supports = false;

      try {
        var options = Object.defineProperty({}, 'passive', {
          get: function get() {
            supports = true;
          }
        });
        window.addEventListener('e', null, options);
      } catch (e) {// continue regardless of error
      }

      return supports;
    }(); // Default passive to true as expected by Chrome for 'touchstart' and 'touchend' events.
    // https://github.com/chartjs/Chart.js/issues/4287


    var eventListenerOptions = supportsEventListenerOptions ? {
      passive: true
    } : false;
    /* global wx, my */
    // weixin miniprogram

    var isWx = typeof wx === 'object' && typeof wx.getSystemInfoSync === 'function'; // ant miniprogram

    var isMy = typeof my === 'object' && typeof my.getSystemInfoSync === 'function'; // in node

    var isNode = typeof global && !typeof window; // in browser

    var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.sessionStorage !== 'undefined';

    function isCanvasElement(el) {
      if (!el || typeof el !== 'object') return false;

      if (el.nodeType === 1 && el.nodeName) {
        // HTMLCanvasElement
        return true;
      } // CanvasElement


      return !!el.isCanvasElement;
    }

    function getPixelRatio() {
      return window && window.devicePixelRatio || 1;
    }

    function getStyle(el, property) {
      return el.currentStyle ? el.currentStyle[property] : document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
    }

    function getWidth(el) {
      var width = getStyle(el, 'width');

      if (width === 'auto') {
        width = el.offsetWidth;
      }

      return parseFloat(width);
    }

    function getHeight(el) {
      var height = getStyle(el, 'height');

      if (height === 'auto') {
        height = el.offsetHeight;
      }

      return parseFloat(height);
    }

    function getDomById(id) {
      if (!id) {
        return null;
      }

      return document.getElementById(id);
    }

    function getRelativePosition(point, canvas) {
      var canvasDom = canvas.get('el');
      if (!canvasDom) return point;

      var _canvasDom$getBoundin = canvasDom.getBoundingClientRect(),
          top = _canvasDom$getBoundin.top,
          left = _canvasDom$getBoundin.left;

      var paddingLeft = parseFloat(getStyle(canvasDom, 'padding-left'));
      var paddingTop = parseFloat(getStyle(canvasDom, 'padding-top'));
      var mouseX = point.x - left - paddingLeft;
      var mouseY = point.y - top - paddingTop;
      return {
        x: mouseX,
        y: mouseY
      };
    }

    function addEventListener(source, type, listener) {
      source.addEventListener(type, listener, eventListenerOptions);
    }

    function removeEventListener(source, type, listener) {
      source.removeEventListener(type, listener, eventListenerOptions);
    }

    function landscapePoint(point, canvas) {
      var landscape = canvas.get('landscape');

      if (!landscape) {
        return point;
      }

      if (isFunction(landscape)) {
        return landscape(point, canvas);
      } // 默认顺时针旋转90度


      var height = canvas.get('height');
      var x = point.y;
      var y = height - point.x;
      return {
        x: x,
        y: y
      };
    }

    function convertPoints(ev, canvas) {
      var touches = ev.touches; // 认为是mouse事件

      if (!touches) {
        var point = getRelativePosition({
          x: ev.clientX,
          y: ev.clientY
        }, canvas);
        return [landscapePoint(point, canvas)];
      } // 单指 touchend 后，touchs 会变空，最后的触点要从changedTouches里拿


      if (!touches.length) {
        // 为了防止万一，加个空逻辑
        touches = ev.changedTouches || [];
      }

      var points = [];

      for (var i = 0, len = touches.length; i < len; i++) {
        var touch = touches[i]; // x, y: 相对canvas原点的位置，clientX, clientY 相对于可视窗口的位置

        var x = touch.x,
            y = touch.y,
            clientX = touch.clientX,
            clientY = touch.clientY;

        var _point = void 0; // 小程序环境会有x,y


        if (isNumber(x) || isNumber(y)) {
          _point = {
            x: x,
            y: y
          };
        } else {
          // 浏览器环境再计算下canvas的相对位置
          _point = getRelativePosition({
            x: clientX,
            y: clientY
          }, canvas);
        }

        points.push(landscapePoint(_point, canvas));
      }

      return points;
    }

    function createEvent(event, chart) {
      var canvas = chart.get('canvas');
      var points = convertPoints(event, canvas); // touchend会没有points

      var point = points[0] || {};
      return {
        type: event.type,
        chart: chart,
        "native": event,
        x: point.x,
        y: point.y
      };
    }

    function measureText(text, font, ctx) {
      if (!ctx) {
        ctx = document.createElement('canvas').getContext('2d');
      }

      ctx.font = font || '12px sans-serif';
      return ctx.measureText(text);
    }

    /**
     * @fileOverview Utility for F2
     * @author dxq613 @gmail.com
     * @author sima.zhang1990@gmail.com
     */

    function isObjectValueEqual(a, b) {
      // for vue.js
      a = Object.assign({}, a);
      b = Object.assign({}, b);
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);

      if (aProps.length !== bProps.length) {
        return false;
      }

      for (var i = 0, len = aProps.length; i < len; i++) {
        var propName = aProps[i];

        if (a[propName] !== b[propName]) {
          return false;
        }
      }

      return true;
    }

    function parsePadding(padding) {
      var top;
      var right;
      var bottom;
      var left;

      if (isNumber(padding) || isString(padding)) {
        top = bottom = left = right = padding;
      } else if (isArray(padding)) {
        top = padding[0];
        right = !isNil(padding[1]) ? padding[1] : padding[0];
        bottom = !isNil(padding[2]) ? padding[2] : padding[0];
        left = !isNil(padding[3]) ? padding[3] : right;
      }

      return [top, right, bottom, left];
    }

    function directionEnabled(mode, dir) {
      if (mode === undefined) {
        return true;
      } else if (typeof mode === 'string') {
        return mode.indexOf(dir) !== -1;
      }

      return false;
    }

    function toTimeStamp(value) {
      if (isString(value)) {
        if (value.indexOf('T') > 0) {
          value = new Date(value).getTime();
        } else {
          // new Date('2010/01/10') 和 new Date('2010-01-10') 的差别在于:
          // 如果仅有年月日时，前者是带有时区的: Fri Jan 10 2020 02:40:13 GMT+0800 (中国标准时间)
          // 后者会格式化成 Sun Jan 10 2010 08:00:00 GMT+0800 (中国标准时间)
          value = new Date(value.replace(/-/gi, '/')).getTime();
        }
      }

      if (isDate(value)) {
        value = value.getTime();
      }

      return value;
    }

    var Util = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Array: array,
        upperFirst: upperFirst,
        lowerFirst: lowerFirst,
        isString: isString,
        isNumber: isNumber,
        isBoolean: isBoolean,
        isFunction: isFunction,
        isDate: isDate,
        isArray: isArray,
        isNil: isNil,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isEqual: isEqual,
        deepMix: deepMix,
        mix: mix,
        each: each,
        uniq: uniq,
        find: find,
        isObjectValueEqual: isObjectValueEqual,
        parsePadding: parsePadding,
        directionEnabled: directionEnabled,
        toTimeStamp: toTimeStamp,
        substitute: substitute,
        isWx: isWx,
        isMy: isMy,
        isNode: isNode,
        isBrowser: isBrowser,
        isCanvasElement: isCanvasElement,
        getPixelRatio: getPixelRatio,
        getStyle: getStyle,
        getWidth: getWidth,
        getHeight: getHeight,
        getDomById: getDomById,
        getRelativePosition: getRelativePosition,
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        createEvent: createEvent,
        convertPoints: convertPoints,
        measureText: measureText
    });

    /**
     * @fileOverview default theme
     * @author dxq613@gail.com
     */
    var color1 = '#E8E8E8'; // color of axis-line and axis-grid

    var color2 = '#808080'; // color of axis label

    var defaultAxis = {
      label: {
        fill: color2,
        fontSize: 10
      },
      line: {
        stroke: color1,
        lineWidth: 1
      },
      grid: {
        type: 'line',
        stroke: color1,
        lineWidth: 1,
        lineDash: [2]
      },
      tickLine: null,
      labelOffset: 7.5
    };
    var Theme = {
      fontFamily: '"Helvetica Neue", "San Francisco", Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", sans-serif',
      defaultColor: '#1890FF',
      pixelRatio: 1,
      padding: 'auto',
      appendPadding: 15,
      colors: ['#1890FF', '#2FC25B', '#FACC14', '#223273', '#8543E0', '#13C2C2', '#3436C7', '#F04864'],
      shapes: {
        line: ['line', 'dash'],
        point: ['circle', 'hollowCircle']
      },
      sizes: [4, 10],
      axis: {
        common: defaultAxis,
        // common axis configuration
        bottom: mix({}, defaultAxis, {
          grid: null
        }),
        left: mix({}, defaultAxis, {
          line: null
        }),
        right: mix({}, defaultAxis, {
          line: null
        }),
        circle: mix({}, defaultAxis, {
          line: null
        }),
        radius: mix({}, defaultAxis, {
          labelOffset: 4
        })
      },
      shape: {
        line: {
          lineWidth: 2,
          lineJoin: 'round',
          lineCap: 'round'
        },
        point: {
          lineWidth: 0,
          size: 3
        },
        area: {
          fillOpacity: 0.1
        }
      },
      _defaultAxis: defaultAxis
    };

    var lang = {
      general: {
        title: '这是一个图表，',
        withTitle: '这是一个关于“{title}”的图表。'
      },
      coord: {
        cartesian: 'X轴是{xLabel}Y轴是{yLabel}' // polar: '弧度是{xLabel}半径是{yLabel}'

      },
      scale: {
        linear: '数值型，数据最小值为{min}，最大值为{max}；',
        cat: '分类型, 分类类型有：{values}；',
        timeCat: '时间型，时间范围从{start}到{end}；'
      },
      geometry: {
        prefix: '共有{count}种分类组成，',
        oneData: '第{index}类是{name}，数据是{values};',
        partData: '第{index}类是{name}，共有{count}项数据，前{part}项是{values};',
        allData: '第{index}类是{name}，有{count}项数据，分别是{values};'
      },
      legend: {
        prefix: '图例分类有：'
      }
    };

    var Global = {
      version: '3.8.9',
      scales: {},
      widthRatio: {
        column: 1 / 2,
        rose: 0.999999,
        multiplePie: 3 / 4
      },
      lineDash: [4, 4],
      lang: lang
    };

    Global.setTheme = function (theme) {
      deepMix(Global, theme);
    };

    Global.setTheme(Theme);

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends.apply(this, arguments);
    }

    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    var EVENT_AFTER_INIT = 'afterinit';
    var EVENT_BEFORE_RENDER = 'beforerender';
    var EVENT_AFTER_RENDER = 'afterrender';
    var EVENT_BEFORE_DATA_CHANGE = 'beforedatachange';
    var EVENT_AFTER_DATA_CHANGE = 'afterdatachange';
    var EVENT_AFTER_SIZE_CHANGE = '_aftersizechange';
    var EVENT_AFTER_GEOM_INIT = '_aftergeominit';
    var EVENT_BEFORE_GEOM_DRAW = 'beforegeomdraw';
    var EVENT_AFTER_GEOM_DRAW = 'aftergeomdraw';
    var EVENT_CLEAR = 'clear';
    var EVENT_CLEAR_INNER = 'clearinner';
    var EVENT_REPAINT = 'repaint';

    // 实现简单的事件机制

    var EventEmit = /*#__PURE__*/function () {
      function EventEmit() {
        this.__events = {};
      }

      var _proto = EventEmit.prototype;

      _proto.on = function on(type, listener) {
        if (!type || !listener) {
          return;
        }

        var events = this.__events[type] || [];
        events.push(listener);
        this.__events[type] = events;
      };

      _proto.emit = function emit(type, e) {
        var _this = this;

        if (isObject(type)) {
          e = type;
          type = e && e.type;
        }

        if (!type) {
          return;
        }

        var events = this.__events[type];

        if (!events || !events.length) {
          return;
        }

        events.forEach(function (listener) {
          listener.call(_this, e);
        });
      };

      _proto.off = function off(type, listener) {
        var __events = this.__events;
        var events = __events[type];

        if (!events || !events.length) {
          return;
        } // 如果没有指定方法，则删除所有项


        if (!listener) {
          delete __events[type];
          return;
        } // 删除指定的 listener


        for (var i = 0, len = events.length; i < len; i++) {
          if (events[i] === listener) {
            events.splice(i, 1);
            i--;
          }
        }
      };

      return EventEmit;
    }();

    var Base = /*#__PURE__*/function (_Emit) {
      _inheritsLoose(Base, _Emit);

      var _proto = Base.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        return {};
      };

      function Base(cfg) {
        var _this;

        _this = _Emit.call(this) || this;
        var attrs = {};

        var defaultCfg = _this.getDefaultCfg();

        _this._attrs = attrs;
        mix(attrs, defaultCfg, cfg);
        return _this;
      }

      _proto.get = function get(name) {
        return this._attrs[name];
      };

      _proto.set = function set(name, value) {
        this._attrs[name] = value;
      };

      _proto.destroy = function destroy() {
        this._attrs = {};
        this.destroyed = true;
      };

      return Base;
    }(EventEmit);

    var Plot = /*#__PURE__*/function () {
      function Plot(cfg) {
        mix(this, cfg);

        this._init();
      }

      var _proto = Plot.prototype;

      _proto._init = function _init() {
        var self = this;
        var start = self.start;
        var end = self.end;
        var xMin = Math.min(start.x, end.x);
        var xMax = Math.max(start.x, end.x);
        var yMin = Math.min(start.y, end.y);
        var yMax = Math.max(start.y, end.y);
        this.tl = {
          x: xMin,
          y: yMin
        };
        this.tr = {
          x: xMax,
          y: yMin
        };
        this.bl = {
          x: xMin,
          y: yMax
        };
        this.br = {
          x: xMax,
          y: yMax
        };
        this.width = xMax - xMin;
        this.height = yMax - yMin;
      }
      /**
       * reset
       * @param  {Object} start start point
       * @param  {Object} end end point
       */
      ;

      _proto.reset = function reset(start, end) {
        this.start = start;
        this.end = end;

        this._init();
      }
      /**
       * check the point is in the range of plot
       * @param  {Number}  x x value
       * @param  {[type]}  y y value
       * @return {Boolean} return the result
       */
      ;

      _proto.isInRange = function isInRange(x, y) {
        if (isObject(x)) {
          y = x.y;
          x = x.x;
        }

        var tl = this.tl;
        var br = this.br;
        return tl.x <= x && x <= br.x && tl.y <= y && y <= br.y;
      };

      return Plot;
    }();

    var Matrix = {
      generateDefault: function generateDefault() {
        return [1, 0, 0, 1, 0, 0];
      },
      isChanged: function isChanged(m) {
        return m[0] !== 1 || m[1] !== 0 || m[2] !== 0 || m[3] !== 1 || m[4] !== 0 || m[5] !== 0;
      },
      multiply: function multiply(m1, m2) {
        var m11 = m1[0] * m2[0] + m1[2] * m2[1];
        var m12 = m1[1] * m2[0] + m1[3] * m2[1];
        var m21 = m1[0] * m2[2] + m1[2] * m2[3];
        var m22 = m1[1] * m2[2] + m1[3] * m2[3];
        var dx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
        var dy = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
        return [m11, m12, m21, m22, dx, dy];
      },
      scale: function scale(out, m, v) {
        out[0] = m[0] * v[0];
        out[1] = m[1] * v[0];
        out[2] = m[2] * v[1];
        out[3] = m[3] * v[1];
        out[4] = m[4];
        out[5] = m[5];
        return out;
      },
      rotate: function rotate(out, m, radian) {
        var c = Math.cos(radian);
        var s = Math.sin(radian);
        var m11 = m[0] * c + m[2] * s;
        var m12 = m[1] * c + m[3] * s;
        var m21 = m[0] * -s + m[2] * c;
        var m22 = m[1] * -s + m[3] * c;
        out[0] = m11;
        out[1] = m12;
        out[2] = m21;
        out[3] = m22;
        out[4] = m[4];
        out[5] = m[5];
        return out;
      },
      translate: function translate(out, m, v) {
        out[0] = m[0];
        out[1] = m[1];
        out[2] = m[2];
        out[3] = m[3];
        out[4] = m[4] + m[0] * v[0] + m[2] * v[1];
        out[5] = m[5] + m[1] * v[0] + m[3] * v[1];
        return out;
      },
      transform: function transform(m, actions) {
        var out = [].concat(m);

        for (var i = 0, len = actions.length; i < len; i++) {
          var action = actions[i];

          switch (action[0]) {
            case 't':
              Matrix.translate(out, out, [action[1], action[2]]);
              break;

            case 's':
              Matrix.scale(out, out, [action[1], action[2]]);
              break;

            case 'r':
              Matrix.rotate(out, out, action[1]);
              break;
          }
        }

        return out;
      }
    };

    /**
     * 2 Dimensional Vector
     * @module vector2
     */
    var Vector2 = {
      /**
       * Creates a new, empty vector2
       *
       * @return {vector2} a new 2D vector
       */
      create: function create() {
        return [0, 0];
      },

      /**
       * Calculates the length of a vector2
       *
       * @param {vector2} v vector to calculate length of
       * @return {Number} length of v
       */
      length: function length(v) {
        var x = v[0];
        var y = v[1];
        return Math.sqrt(x * x + y * y);
      },

      /**
       * Normalize a vector2
       *
       * @param {vector2} out the receiving vector
       * @param {vector2} v vector to normalize
       * @return {vector2} out
       */
      normalize: function normalize(out, v) {
        var len = this.length(v);

        if (len === 0) {
          out[0] = 0;
          out[1] = 0;
        } else {
          out[0] = v[0] / len;
          out[1] = v[1] / len;
        }

        return out;
      },

      /**
       * Adds two vector2's
       *
       * @param {vector2} out the receiving vector
       * @param {vector2} v1 the first operand
       * @param {vector2} v2 the second operand
       * @return {vector2} out
       */
      add: function add(out, v1, v2) {
        out[0] = v1[0] + v2[0];
        out[1] = v1[1] + v2[1];
        return out;
      },

      /**
       * Subtracts vector v2 from vector v1
       *
       * @param {vector2} out the receiving vector
       * @param {vector2} v1 the first operand
       * @param {vector2} v2 the second operand
       * @return {vector2} out
       */
      sub: function sub(out, v1, v2) {
        out[0] = v1[0] - v2[0];
        out[1] = v1[1] - v2[1];
        return out;
      },

      /**
       * Scales a vector2 by a scalar number
       *
       * @param {vector2} out the receiving vector
       * @param {vector2} v the vector to scale
       * @param {Number} s amount to scale the vector by
       * @return {vector2} out
       */
      scale: function scale(out, v, s) {
        out[0] = v[0] * s;
        out[1] = v[1] * s;
        return out;
      },

      /**
       * Calculates the dot product of two vector2's
       *
       * @param {vector2} v1 the first operand
       * @param {vector2} v2 the second operand
       * @return {Number} dot product of v1 and v2
       */
      dot: function dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
      },

      /**
       * Calculates the direction of two vector2's
       *
       * @param {vector2} v1 the first operand
       * @param {vector2} v2 the second operand
       * @return {Boolean} the direction of v1 and v2
       */
      direction: function direction(v1, v2) {
        return v1[0] * v2[1] - v2[0] * v1[1];
      },

      /**
       * Calculates the angle of two vector2's
       *
       * @param {vector2} v1 the first operand
       * @param {vector2} v2 the second operand
       * @return {Number} angle of v1 and v2
       */
      angle: function angle(v1, v2) {
        var theta = this.dot(v1, v2) / (this.length(v1) * this.length(v2));
        return Math.acos(theta);
      },

      /**
       * Calculates the angle of two vector2's with direction
       *
       * @param {vector2} v1 the first operand
       * @param {vector2} v2 the second operand
       * @param {Boolean} direction the direction of two vector2's
       * @return {Number} angle of v1 and v2
       */
      angleTo: function angleTo(v1, v2, direction) {
        var angle = this.angle(v1, v2);
        var angleLargeThanPI = this.direction(v1, v2) >= 0;

        if (direction) {
          if (angleLargeThanPI) {
            return Math.PI * 2 - angle;
          }

          return angle;
        }

        if (angleLargeThanPI) {
          return angle;
        }

        return Math.PI * 2 - angle;
      },

      /**
       * whether a vector2 is zero vector
       *
       * @param  {vector2} v vector to calculate
       * @return {Boolean}   is or not a zero vector
       */
      zero: function zero(v) {
        return v[0] === 0 && v[1] === 0;
      },

      /**
       * Calculates the euclidian distance between two vector2's
       *
       * @param {vector2} v1 the first operand
       * @param {vector2} v2 the second operand
       * @return {Number} distance between a and b
       */
      distance: function distance(v1, v2) {
        var x = v2[0] - v1[0];
        var y = v2[1] - v1[1];
        return Math.sqrt(x * x + y * y);
      },

      /**
       * Creates a new vector2 initialized with values from an existing vector
       *
       * @param {vector2} v vector to clone
       * @return {Array} a new 2D vector
       */
      clone: function clone(v) {
        return [v[0], v[1]];
      },

      /**
       * Return the minimum of two vector2's
       *
       * @param {vector2} out the receiving vector
       * @param {vector2} v1 the first operand
       * @param {vector2} v2 the second operand
       * @return {vector2} out
       */
      min: function min(out, v1, v2) {
        out[0] = Math.min(v1[0], v2[0]);
        out[1] = Math.min(v1[1], v2[1]);
        return out;
      },

      /**
       * Return the maximum of two vector2's
       *
       * @param {vector2} out the receiving vector
       * @param {vector2} v1 the first operand
       * @param {vector2} v2 the second operand
       * @return {vector2} out
       */
      max: function max(out, v1, v2) {
        out[0] = Math.max(v1[0], v2[0]);
        out[1] = Math.max(v1[1], v2[1]);
        return out;
      },

      /**
       * Transforms the vector2 with a mat2d
       *
       * @param {vector2} out the receiving vector
       * @param {vector2} v the vector to transform
       * @param {mat2d} m matrix to transform with
       * @return {vector2} out
       */
      transformMat2d: function transformMat2d(out, v, m) {
        var x = v[0];
        var y = v[1];
        out[0] = m[0] * x + m[2] * y + m[4];
        out[1] = m[1] * x + m[3] * y + m[5];
        return out;
      }
    };

    var defaultMatrix = [1, 0, 0, 1, 0, 0];

    var Base$1 = /*#__PURE__*/function () {
      var _proto = Base.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {};

      function Base(cfg) {
        this._initDefaultCfg();

        mix(this, cfg);
        var start;
        var end;

        if (this.plot) {
          start = this.plot.bl;
          end = this.plot.tr;
          this.start = start;
          this.end = end;
        } else {
          start = this.start;
          end = this.end;
        }

        this.init(start, end);
      }

      _proto._scale = function _scale(s1, s2) {
        var matrix = this.matrix;
        var center = this.center;
        Matrix.translate(matrix, matrix, [center.x, center.y]);
        Matrix.scale(matrix, matrix, [s1, s2]);
        Matrix.translate(matrix, matrix, [-center.x, -center.y]);
      };

      _proto.init = function init(start, end) {
        this.matrix = [].concat(defaultMatrix); // 设置中心点

        this.center = {
          x: (end.x - start.x) / 2 + start.x,
          y: (end.y - start.y) / 2 + start.y
        };

        if (this.scale) {
          this._scale(this.scale[0], this.scale[1]);
        }
      };

      _proto.convertPoint = function convertPoint(point) {
        var _this$_convertPoint = this._convertPoint(point),
            x = _this$_convertPoint.x,
            y = _this$_convertPoint.y;

        if (!Matrix.isChanged(this.matrix)) {
          return {
            x: x,
            y: y
          };
        }

        var vector = [x, y];
        Vector2.transformMat2d(vector, vector, this.matrix);
        return {
          x: vector[0],
          y: vector[1]
        };
      };

      _proto.invertPoint = function invertPoint(point) {
        return this._invertPoint(point);
      };

      _proto._convertPoint = function _convertPoint(point) {
        return point;
      };

      _proto._invertPoint = function _invertPoint(point) {
        return point;
      };

      _proto.reset = function reset(plot) {
        this.plot = plot;
        var bl = plot.bl,
            tr = plot.tr;
        this.start = bl;
        this.end = tr;
        this.init(bl, tr);
      };

      return Base;
    }();

    var Cartesian = /*#__PURE__*/function (_Base) {
      _inheritsLoose(Cartesian, _Base);

      function Cartesian() {
        return _Base.apply(this, arguments) || this;
      }

      var _proto = Cartesian.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'cartesian';
        this.transposed = false;
        this.isRect = true;
      };

      _proto.init = function init(start, end) {
        _Base.prototype.init.call(this, start, end);

        this.x = {
          start: start.x,
          end: end.x
        };
        this.y = {
          start: start.y,
          end: end.y
        };
      };

      _proto._convertPoint = function _convertPoint(point) {
        var self = this;
        var transposed = self.transposed;
        var xDim = transposed ? 'y' : 'x';
        var yDim = transposed ? 'x' : 'y';
        var x = self.x;
        var y = self.y;
        return {
          x: x.start + (x.end - x.start) * point[xDim],
          y: y.start + (y.end - y.start) * point[yDim]
        };
      };

      _proto._invertPoint = function _invertPoint(point) {
        var self = this;
        var transposed = self.transposed;
        var xDim = transposed ? 'y' : 'x';
        var yDim = transposed ? 'x' : 'y';
        var x = self.x;
        var y = self.y;
        var rst = {};
        rst[xDim] = (point.x - x.start) / (x.end - x.start);
        rst[yDim] = (point.y - y.start) / (y.end - y.start);
        return rst;
      };

      return Cartesian;
    }(Base$1);

    Base$1.Cartesian = Cartesian;
    Base$1.Rect = Cartesian;

    /**
     * @fileOverview the Attribute base class
     */

    function toScaleString(scale, value) {
      if (isString(value)) {
        return value;
      }

      return scale.invert(scale.scale(value));
    }
    /**
     * 所有视觉通道属性的基类
     * @class Attr
     */


    var AttributeBase = /*#__PURE__*/function () {
      function AttributeBase(cfg) {
        var _this = this;

        /**
         * 属性的类型
         * @type {String}
         */
        this.type = 'base';
        /**
         * 属性的名称
         * @type {String}
         */

        this.name = null;
        /**
         * 回调函数
         * @type {Function}
         */

        this.method = null;
        /**
         * 备选的值数组
         * @type {Array}
         */

        this.values = [];
        /**
         * 属性内部的度量
         * @type {Array}
         */

        this.scales = [];
        /**
         * 是否通过线性取值, 如果未指定，则根据数值的类型判定
         * @type {Boolean}
         */

        this.linear = null;
        /**
         * 当用户设置的 callback 返回 null 时, 应该返回默认 callback 中的值
         */

        var mixedCallback = null;
        var defaultCallback = this.callback;

        if (cfg.callback) {
          var userCallback = cfg.callback;

          mixedCallback = function mixedCallback() {
            for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
              params[_key] = arguments[_key];
            }

            var ret = userCallback.apply(void 0, params);

            if (isNil(ret)) {
              ret = defaultCallback.apply(_this, params);
            }

            return ret;
          };
        }

        mix(this, cfg);

        if (mixedCallback) {
          mix(this, {
            callback: mixedCallback
          });
        }
      } // 获取属性值，将值映射到视觉通道


      var _proto = AttributeBase.prototype;

      _proto._getAttrValue = function _getAttrValue(scale, value) {
        var values = this.values;

        if (scale.isCategory && !this.linear) {
          var index = scale.translate(value);
          return values[index % values.length];
        }

        var percent = scale.scale(value);
        return this.getLinearValue(percent);
      }
      /**
       * 如果进行线性映射，返回对应的映射值
       * @protected
       * @param  {Number} percent 百分比
       * @return {*}  颜色值、形状、大小等
       */
      ;

      _proto.getLinearValue = function getLinearValue(percent) {
        var values = this.values;
        var steps = values.length - 1;
        var step = Math.floor(steps * percent);
        var leftPercent = steps * percent - step;
        var start = values[step];
        var end = step === steps ? start : values[step + 1];
        var rstValue = start + (end - start) * leftPercent;
        return rstValue;
      }
      /**
       * 默认的回调函数
       * @param {*} value 回调函数的值
       * @type {Function}
       * @return {Array} 返回映射后的值
       */
      ;

      _proto.callback = function callback(value) {
        var self = this;
        var scale = self.scales[0];
        var rstValue = null;

        if (scale.type === 'identity') {
          rstValue = scale.value;
        } else {
          rstValue = self._getAttrValue(scale, value);
        }

        return rstValue;
      }
      /**
       * 根据度量获取属性名
       * @return {Array} dims of this Attribute
       */
      ;

      _proto.getNames = function getNames() {
        var scales = this.scales;
        var names = this.names;
        var length = Math.min(scales.length, names.length);
        var rst = [];

        for (var i = 0; i < length; i++) {
          rst.push(names[i]);
        }

        return rst;
      }
      /**
       * 根据度量获取维度名
       * @return {Array} dims of this Attribute
       */
      ;

      _proto.getFields = function getFields() {
        var scales = this.scales;
        var rst = [];
        each(scales, function (scale) {
          rst.push(scale.field);
        });
        return rst;
      }
      /**
       * 根据名称获取度量
       * @param  {String} name the name of scale
       * @return {Scale} scale
       */
      ;

      _proto.getScale = function getScale(name) {
        var scales = this.scales;
        var names = this.names;
        var index = names.indexOf(name);
        return scales[index];
      }
      /**
       * 映射数据
       * @param {*} param1...paramn 多个数值
       * @return {Array} 映射的值组成的数组
       */
      ;

      _proto.mapping = function mapping() {
        var scales = this.scales;
        var callback = this.callback;

        for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          params[_key2] = arguments[_key2];
        }

        var values = params;

        if (callback) {
          for (var i = 0, len = params.length; i < len; i++) {
            params[i] = this._toOriginParam(params[i], scales[i]);
          }

          values = callback.apply(this, params);
        }

        values = [].concat(values);
        return values;
      } // 原始的参数
      ;

      _proto._toOriginParam = function _toOriginParam(param, scale) {
        var rst = param;

        if (!scale.isLinear) {
          if (isArray(param)) {
            rst = [];

            for (var i = 0, len = param.length; i < len; i++) {
              rst.push(toScaleString(scale, param[i]));
            }
          } else {
            rst = toScaleString(scale, param);
          }
        }

        return rst;
      };

      return AttributeBase;
    }();

    var Position = /*#__PURE__*/function (_Base) {
      _inheritsLoose(Position, _Base);

      function Position(cfg) {
        var _this;

        _this = _Base.call(this, cfg) || this;
        _this.names = ['x', 'y'];
        _this.type = 'position';
        return _this;
      }

      var _proto = Position.prototype;

      _proto.mapping = function mapping(x, y) {
        var scales = this.scales;
        var coord = this.coord;
        var scaleX = scales[0];
        var scaleY = scales[1];
        var rstX;
        var rstY;
        var obj;

        if (isNil(x) || isNil(y)) {
          return [];
        }

        if (isArray(y) && isArray(x)) {
          rstX = [];
          rstY = [];

          for (var i = 0, j = 0, xLen = x.length, yLen = y.length; i < xLen && j < yLen; i++, j++) {
            obj = coord.convertPoint({
              x: scaleX.scale(x[i]),
              y: scaleY.scale(y[j])
            });
            rstX.push(obj.x);
            rstY.push(obj.y);
          }
        } else if (isArray(y)) {
          x = scaleX.scale(x);
          rstY = [];
          each(y, function (yVal) {
            yVal = scaleY.scale(yVal);
            obj = coord.convertPoint({
              x: x,
              y: yVal
            });

            if (rstX && rstX !== obj.x) {
              if (!isArray(rstX)) {
                rstX = [rstX];
              }

              rstX.push(obj.x);
            } else {
              rstX = obj.x;
            }

            rstY.push(obj.y);
          });
        } else if (isArray(x)) {
          y = scaleY.scale(y);
          rstX = [];
          each(x, function (xVal) {
            xVal = scaleX.scale(xVal);
            obj = coord.convertPoint({
              x: xVal,
              y: y
            });

            if (rstY && rstY !== obj.y) {
              if (!isArray(rstY)) {
                rstY = [rstY];
              }

              rstY.push(obj.y);
            } else {
              rstY = obj.y;
            }

            rstX.push(obj.x);
          });
        } else {
          x = scaleX.scale(x);
          y = scaleY.scale(y);
          var point = coord.convertPoint({
            x: x,
            y: y
          });
          rstX = point.x;
          rstY = point.y;
        }

        return [rstX, rstY];
      };

      return Position;
    }(AttributeBase);

    var Shape = /*#__PURE__*/function (_Base) {
      _inheritsLoose(Shape, _Base);

      function Shape(cfg) {
        var _this;

        _this = _Base.call(this, cfg) || this;
        _this.names = ['shape'];
        _this.type = 'shape';
        _this.gradient = null;
        return _this;
      }
      /**
       * @override
       */


      var _proto = Shape.prototype;

      _proto.getLinearValue = function getLinearValue(percent) {
        var values = this.values;
        var index = Math.round((values.length - 1) * percent);
        return values[index];
      };

      return Shape;
    }(AttributeBase);

    var Size = /*#__PURE__*/function (_Base) {
      _inheritsLoose(Size, _Base);

      function Size(cfg) {
        var _this;

        _this = _Base.call(this, cfg) || this;
        _this.names = ['size'];
        _this.type = 'size';
        _this.gradient = null;
        return _this;
      }

      return Size;
    }(AttributeBase);

    function getValue(start, end, percent, index) {
      var value = start[index] + (end[index] - start[index]) * percent;
      return value;
    } // convert to hex


    function arr2hex(arr) {
      return '#' + toRGBValue(arr[0]) + toRGBValue(arr[1]) + toRGBValue(arr[2]);
    }

    function toRGBValue(value) {
      value = Math.round(value);
      value = value.toString(16);

      if (value.length === 1) {
        value = '0' + value;
      }

      return value;
    }

    function calColor(colors, percent) {
      var steps = colors.length - 1;
      var step = Math.floor(steps * percent);
      var left = steps * percent - step;
      var start = colors[step];
      var end = step === steps ? start : colors[step + 1];
      var rgb = arr2hex([getValue(start, end, left, 0), getValue(start, end, left, 1), getValue(start, end, left, 2)]);
      return rgb;
    }

    function hex2arr(str) {
      var arr = [];
      arr.push(parseInt(str.substr(1, 2), 16));
      arr.push(parseInt(str.substr(3, 2), 16));
      arr.push(parseInt(str.substr(5, 2), 16));
      return arr;
    }

    var colorCache = {
      black: '#000000',
      blue: '#0000ff',
      grey: '#808080',
      green: '#008000',
      orange: '#ffa500',
      pink: '#ffc0cb',
      purple: '#800080',
      red: '#ff0000',
      white: '#ffffff',
      yellow: '#ffff00'
    };
    /**
     * Returns a hexadecimal string representing this color in RGB space, such as #f7eaba.
     * @param  {String} color color value
     * @return {String} Returns a hexadecimal string
     */

    function toHex(color) {
      if (colorCache[color]) {
        return colorCache[color];
      }

      if (color[0] === '#') {
        if (color.length === 7) {
          return color;
        }

        var hex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) {
          return '#' + r + r + g + g + b + b;
        }); // hex3 to hex6

        colorCache[color] = hex;
        return hex;
      } // rgb/rgba to hex


      var rst = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
      rst.shift();
      rst = arr2hex(rst);
      colorCache[color] = rst;
      return rst;
    }
    /**
     * handle the gradient color
     * @param  {Array} colors the colors
     * @return {String} return the color value
     */


    function gradient(colors) {
      var points = [];

      if (isString(colors)) {
        colors = colors.split('-');
      }

      each(colors, function (color) {
        if (color.indexOf('#') === -1) {
          color = toHex(color);
        }

        points.push(hex2arr(color));
      });
      return function (percent) {
        return calColor(points, percent);
      };
    }

    var Color = /*#__PURE__*/function (_Base) {
      _inheritsLoose(Color, _Base);

      function Color(cfg) {
        var _this;

        _this = _Base.call(this, cfg) || this;
        _this.names = ['color'];
        _this.type = 'color';
        _this.gradient = null;

        if (isString(_this.values)) {
          _this.linear = true;
        }

        return _this;
      }
      /**
       * @override
       */


      var _proto = Color.prototype;

      _proto.getLinearValue = function getLinearValue(percent) {
        var gradient$1 = this.gradient;

        if (!gradient$1) {
          var values = this.values;
          gradient$1 = gradient(values);
          this.gradient = gradient$1;
        }

        return gradient$1(percent);
      };

      return Color;
    }(AttributeBase);

    var Attr = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Position: Position,
        Shape: Shape,
        Size: Size,
        Color: Color
    });

    var Shape$1 = {};
    var ShapeBase = {
      _coord: null,

      /**
       * draw the shape
       * @param {Object} cfg options
       * @param {Object} container container to store the shapes
       */
      draw: function draw(cfg, container) {
        if (this.drawShape) {
          this.drawShape(cfg, container);
        }
      },

      /**
       * set the coordinate instance
       * @param {Coord} coord coordinate instance
       */
      setCoord: function setCoord(coord) {
        this._coord = coord;
      },

      /**
       * convert the normalized value to the canvas position
       * @param  {point} point the point to convert
       * @return {point} point return the result
       */
      parsePoint: function parsePoint(point) {
        var coord = this._coord;

        if (coord.isPolar) {
          if (point.x === 1) point.x = 0.9999999;
          if (point.y === 1) point.y = 0.9999999;
        }

        return coord.convertPoint(point);
      },

      /**
       * convert the normalized value to the canvas position
       * @param  {points} points the array that store the points
       * @return {points} points return the result
       */
      parsePoints: function parsePoints(points) {
        if (!points) return false;
        var self = this;
        var rst = [];
        points.forEach(function (point) {
          rst.push(self.parsePoint(point));
        });
        return rst;
      }
    };
    var ShapeFactoryBase = {
      defaultShapeType: null,
      setCoord: function setCoord(coord) {
        this._coord = coord;
      },
      getShape: function getShape(type) {
        var self = this;

        if (isArray(type)) {
          type = type[0];
        }

        var shape = self[type] || self[self.defaultShapeType];
        shape._coord = self._coord;
        return shape;
      },
      getShapePoints: function getShapePoints(type, cfg) {
        var shape = this.getShape(type);
        var fn = shape.getPoints || shape.getShapePoints || this.getDefaultPoints;
        var points = fn(cfg);
        return points;
      },
      getDefaultPoints: function getDefaultPoints()
      /* cfg */
      {
        return [];
      },
      drawShape: function drawShape(type, cfg, container) {
        var shape = this.getShape(type);

        if (!cfg.color) {
          cfg.color = Global.colors[0];
        }

        return shape.draw(cfg, container);
      }
    };

    Shape$1.registerFactory = function (factoryName, cfg) {
      var className = upperFirst(factoryName);
      var geomObj = mix({}, ShapeFactoryBase, cfg);
      Shape$1[className] = geomObj;
      geomObj.name = factoryName;
      return geomObj;
    };

    Shape$1.registerShape = function (factoryName, shapeType, cfg) {
      var className = upperFirst(factoryName);
      var factory = Shape$1[className];
      var shapeObj = mix({}, ShapeBase, cfg);
      factory[shapeType] = shapeObj;
      return shapeObj;
    };

    Shape$1.registShape = Shape$1.registerShape;

    Shape$1.getShapeFactory = function (factoryName) {
      var self = this;
      factoryName = factoryName || 'point';
      var className = upperFirst(factoryName);
      return self[className];
    };

    function _mix$1(dist, obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && key !== 'constructor' && obj[key] !== undefined) {
          dist[key] = obj[key];
        }
      }
    }

    var mix$1 = function mix(dist, src1, src2, src3) {
      if (src1) _mix$1(dist, src1);
      if (src2) _mix$1(dist, src2);
      if (src3) _mix$1(dist, src3);
      return dist;
    };

    var mix_1 = mix$1;

    var Adjust = /*#__PURE__*/function () {
      var _proto = Adjust.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.adjustNames = ['x', 'y']; // 调整的维度，默认,x,y都做调整
      };

      function Adjust(cfg) {
        this._initDefaultCfg();

        mix_1(this, cfg);
      }
      /**
       * @override
       */


      _proto.processAdjust = function processAdjust()
      /* dataArray */
      {};

      return Adjust;
    }();

    var base = Adjust;

    function generateScaleAria(scale) {
      var type = scale.type,
          values = scale.values;

      if (type === 'linear') {
        return substitute(lang.scale.linear, scale);
      }

      if (type === 'cat') {
        return substitute(lang.scale.cat, {
          values: values.slice(0, 10).join(' ')
        });
      }

      if (type === 'timeCat') {
        var start = scale.getText(values[0]);
        var end = scale.getText(values[values.length - 1]);
        return substitute(lang.scale.timeCat, {
          start: start,
          end: end
        });
      }

      return '';
    }
    function generateCoordAria(coord, xScale, yScale) {
      var type = coord.type;

      if (!lang.coord[type]) {
        return '';
      }

      return substitute(lang.coord[type], {
        xLabel: generateScaleAria(xScale),
        yLabel: generateScaleAria(yScale)
      });
    }

    var GROUP_ATTRS = ['color', 'size', 'shape'];
    var FIELD_ORIGIN = '_origin';
    var FIELD_ORIGIN_Y = '_originY';

    function parseFields(field) {
      if (isArray(field)) {
        return field;
      }

      if (isString(field)) {
        return field.split('*');
      }

      return [field];
    }
    /**
     * The parent class for Geometry
     * @class Geom
     */


    var Geom = /*#__PURE__*/function (_Base) {
      _inheritsLoose(Geom, _Base);

      function Geom() {
        return _Base.apply(this, arguments) || this;
      }

      var _proto = Geom.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        return {
          /**
           * geometry type
           * @type {String}
           */
          type: null,

          /**
           * the data of geometry
           * @type {Array}
           */
          data: null,

          /**
           * the attrs of geo,etry
           * @type {Object}
           */
          attrs: {},
          scales: {},

          /**
           * group for storing the shapes
           * @type {Canvas}
           */
          container: null,

          /**
           * style options
           * @type {Object}
           */
          styleOptions: null,
          chart: null,
          shapeType: '',

          /**
           * wether to generate key points for each shape
           * @protected
           * @type {Boolean}
           */
          generatePoints: false,
          attrOptions: {},
          sortable: false,
          startOnZero: true,
          visible: true,
          connectNulls: false,
          // 是否丢弃没有值的分组。
          ignoreEmptyGroup: false,
          // 是否已经初始化
          isInit: false
        };
      };

      _proto.init = function init() {
        var self = this;
        var isInit = self.get('isInit');

        if (isInit) {
          return;
        }

        self._initAttrs();

        self._processData();

        self.set('isInit', true);
      };

      _proto._getGroupScales = function _getGroupScales() {
        var self = this;
        var scales = [];
        each(GROUP_ATTRS, function (attrName) {
          var attr = self.getAttr(attrName);

          if (attr) {
            var attrScales = attr.scales;
            each(attrScales, function (scale) {
              if (scale && scale.isCategory && scales.indexOf(scale) === -1) {
                scales.push(scale);
              }
            });
          }
        });
        return scales;
      };

      _proto._groupData = function _groupData(data) {
        var self = this;
        var colDefs = self.get('colDefs');

        var groupScales = self._getGroupScales();

        if (groupScales.length) {
          var appendConditions = {};
          var names = [];
          each(groupScales, function (scale) {
            var field = scale.field;
            names.push(field);

            if (colDefs && colDefs[field] && colDefs[field].values) {
              // users have defined
              appendConditions[scale.field] = colDefs[field].values;
            }
          });
          return group(data, names, appendConditions);
        }

        return [data];
      };

      _proto._setAttrOptions = function _setAttrOptions(attrName, attrCfg) {
        var options = this.get('attrOptions');
        options[attrName] = attrCfg;
        var attrs = this.get('attrs'); // 说明已经初始化过了

        if (Object.keys(attrs).length) {
          this._createAttr(attrName, attrCfg);
        }
      };

      _proto._createAttrOption = function _createAttrOption(attrName, field, cfg, defaultValues) {
        var attrCfg = {};
        attrCfg.field = field;

        if (cfg) {
          if (isFunction(cfg)) {
            attrCfg.callback = cfg;
          } else {
            attrCfg.values = cfg;
          }
        } else {
          attrCfg.values = defaultValues;
        }

        this._setAttrOptions(attrName, attrCfg);
      };

      _proto._createAttr = function _createAttr(type, option) {
        var self = this;
        var attrs = self.get('attrs');
        var coord = self.get('coord');
        var className = upperFirst(type);
        var fields = parseFields(option.field);

        if (type === 'position') {
          option.coord = coord;
        }

        var scales = [];

        for (var i = 0, len = fields.length; i < len; i++) {
          var field = fields[i];

          var scale = self._createScale(field);

          scales.push(scale);
        }

        if (type === 'position') {
          var yScale = scales[1]; // 饼图的处理，但是还不知道为啥

          if (coord.type === 'polar' && coord.transposed && self.hasAdjust('stack')) {
            if (yScale.values.length) {
              yScale.change({
                nice: false,
                min: 0,
                max: Math.max.apply(null, yScale.values)
              });
            }
          }
        }

        option.scales = scales;
        var attr = new Attr[className](option);
        attrs[type] = attr;
        return attr;
      };

      _proto._initAttrs = function _initAttrs() {
        var self = this;
        var attrOptions = self.get('attrOptions');

        for (var type in attrOptions) {
          if (attrOptions.hasOwnProperty(type)) {
            this._createAttr(type, attrOptions[type]);
          }
        }
      };

      _proto._createScale = function _createScale(field) {
        var scales = this.get('scales');
        var scale = scales[field];

        if (!scale) {
          scale = this.get('chart').createScale(field);
          scales[field] = scale;
        }

        return scale;
      };

      _proto._processData = function _processData() {
        var self = this;
        var data = this.get('data');
        var dataArray = [];

        var groupedArray = this._groupData(data);

        if (this.get('ignoreEmptyGroup')) {
          var yScale = this.getYScale();
          groupedArray = groupedArray.filter(function (group) {
            return group.some(function (item) {
              return typeof item[yScale.field] !== 'undefined';
            });
          });
        }

        for (var i = 0, len = groupedArray.length; i < len; i++) {
          var subData = groupedArray[i];

          var tempData = self._saveOrigin(subData);

          if (this.hasAdjust('dodge')) {
            self._numberic(tempData);
          }

          dataArray.push(tempData);
        }

        if (self.get('adjust')) {
          self._adjustData(dataArray);
        }

        if (self.get('sortable')) {
          self._sort(dataArray);
        }

        self.emit('afterprocessdata', {
          dataArray: dataArray
        });
        self.set('mappingData', dataArray);
        self.set('dataArray', dataArray);
        return dataArray;
      };

      _proto._saveOrigin = function _saveOrigin(data) {
        var rst = [];

        for (var i = 0, len = data.length; i < len; i++) {
          var origin = data[i];
          var obj = {};

          for (var k in origin) {
            obj[k] = origin[k];
          }

          obj[FIELD_ORIGIN] = origin;
          rst.push(obj);
        }

        return rst;
      };

      _proto._numberic = function _numberic(data) {
        var positionAttr = this.getAttr('position');
        var scales = positionAttr.scales;

        for (var j = 0, len = data.length; j < len; j++) {
          var obj = data[j];
          var count = Math.min(2, scales.length);

          for (var i = 0; i < count; i++) {
            var scale = scales[i];

            if (scale.isCategory) {
              var field = scale.field;
              obj[field] = scale.translate(obj[field]);
            }
          }
        }
      };

      _proto._adjustData = function _adjustData(dataArray) {
        var self = this;
        var adjust = self.get('adjust');

        if (adjust) {
          var adjustType = upperFirst(adjust.type);

          if (!base[adjustType]) {
            throw new Error('not support such adjust : ' + adjust);
          }

          var xScale = self.getXScale();
          var yScale = self.getYScale();
          var cfg = mix({
            xField: xScale.field,
            yField: yScale.field
          }, adjust);
          var adjustObject = new base[adjustType](cfg);
          adjustObject.processAdjust(dataArray);

          if (adjustType === 'Stack') {
            self._updateStackRange(yScale.field, yScale, dataArray);
          }
        }
      };

      _proto._updateStackRange = function _updateStackRange(field, scale, dataArray) {
        var mergeArray = merge(dataArray);
        var min = scale.min;
        var max = scale.max;

        for (var i = 0, len = mergeArray.length; i < len; i++) {
          var obj = mergeArray[i];
          var tmpMin = Math.min.apply(null, obj[field]);
          var tmpMax = Math.max.apply(null, obj[field]);

          if (tmpMin < min) {
            min = tmpMin;
          }

          if (tmpMax > max) {
            max = tmpMax;
          }
        }

        if (min < scale.min || max > scale.max) {
          scale.change({
            min: min,
            max: max
          });
        }
      };

      _proto._sort = function _sort(mappedArray) {
        var self = this;
        var xScale = self.getXScale();
        var field = xScale.field,
            type = xScale.type;

        if (type !== 'identity' && xScale.values.length > 1) {
          each(mappedArray, function (itemArr) {
            itemArr.sort(function (obj1, obj2) {
              if (type === 'timeCat') {
                return toTimeStamp(obj1[FIELD_ORIGIN][field]) - toTimeStamp(obj2[FIELD_ORIGIN][field]);
              }

              return xScale.translate(obj1[FIELD_ORIGIN][field]) - xScale.translate(obj2[FIELD_ORIGIN][field]);
            });
          });
        }

        self.set('hasSorted', true);
        self.set('dataArray', mappedArray);
      };

      _proto.paint = function paint() {
        var self = this;
        var dataArray = self.get('mappingData');
        var mappedArray = [];
        var shapeFactory = self.getShapeFactory();
        shapeFactory.setCoord(self.get('coord'));

        self._beforeMapping(dataArray);

        for (var i = 0, len = dataArray.length; i < len; i++) {
          var data = dataArray[i];

          if (data.length) {
            var mappedData = self._mapping(data);

            mappedArray.push(mappedData);
            self.draw(mappedData, shapeFactory);
          }
        }

        self.set('dataArray', mappedArray);
        this.generateAria();
      };

      _proto.getShapeFactory = function getShapeFactory() {
        var shapeFactory = this.get('shapeFactory');

        if (!shapeFactory) {
          var shapeType = this.get('shapeType');
          shapeFactory = Shape$1.getShapeFactory(shapeType);
          this.set('shapeFactory', shapeFactory);
        }

        return shapeFactory;
      };

      _proto._mapping = function _mapping(data) {
        var self = this;
        var attrs = self.get('attrs');
        var yField = self.getYScale().field; // 用来缓存转换的值，减少mapping耗时

        var mappedCache = {};
        var mappedData = new Array(data.length);

        for (var k in attrs) {
          if (attrs.hasOwnProperty(k)) {
            var attr = attrs[k];
            var names = attr.names;
            var scales = attr.scales;

            for (var i = 0, len = data.length; i < len; i++) {
              var record = data[i];

              var mappedRecord = _extends({}, record, mappedData[i]);

              mappedRecord[FIELD_ORIGIN_Y] = record[yField]; // 获取视觉属性对应的value值
              // 位置的缓存命中率低，还是每次单独计算

              if (attr.type === 'position') {
                var values = self._getAttrValues(attr, record);

                for (var j = 0, _len = values.length; j < _len; j++) {
                  var val = values[j];
                  var name = names[j];
                  mappedRecord[name] = isArray(val) && val.length === 1 ? val[0] : val;
                }
              } else {
                // 除了position其他都只有一项
                var _name = names[0];
                var field = scales[0].field;
                var value = record[field];
                var key = "" + _name + value;
                var _values = mappedCache[key];

                if (!_values) {
                  _values = self._getAttrValues(attr, record);
                  mappedCache[key] = _values;
                }

                mappedRecord[_name] = _values[0];
              } // 设置新数组


              mappedData[i] = mappedRecord;
            }
          }
        }

        return mappedData;
      };

      _proto._getAttrValues = function _getAttrValues(attr, record) {
        var scales = attr.scales;
        var params = [];

        for (var i = 0, len = scales.length; i < len; i++) {
          var scale = scales[i];
          var field = scale.field;

          if (scale.type === 'identity') {
            params.push(scale.value);
          } else {
            params.push(record[field]);
          }
        }

        var values = attr.mapping.apply(attr, params);
        return values;
      };

      _proto.getAttrValue = function getAttrValue(attrName, record) {
        var attr = this.getAttr(attrName);
        var rst = null;

        if (attr) {
          var values = this._getAttrValues(attr, record);

          rst = values[0];
        }

        return rst;
      };

      _proto._beforeMapping = function _beforeMapping(dataArray) {
        var self = this;

        if (self.get('generatePoints')) {
          self._generatePoints(dataArray);
        }
      };

      _proto.isInCircle = function isInCircle() {
        var coord = this.get('coord');
        return coord && coord.isPolar;
      };

      _proto.getCallbackCfg = function getCallbackCfg(fields, cfg, origin) {
        if (!fields) {
          return cfg;
        }

        var tmpCfg = {};
        var params = fields.map(function (field) {
          return origin[field];
        });
        each(cfg, function (v, k) {
          if (isFunction(v)) {
            tmpCfg[k] = v.apply(null, params);
          } else {
            tmpCfg[k] = v;
          }
        });
        return tmpCfg;
      };

      _proto.getDrawCfg = function getDrawCfg(obj) {
        var self = this;
        var isInCircle = self.isInCircle();
        var cfg = {
          origin: obj,
          x: obj.x,
          y: obj.y,
          color: obj.color,
          size: obj.size,
          shape: obj.shape,
          isInCircle: isInCircle,
          opacity: obj.opacity
        };
        var styleOptions = self.get('styleOptions');

        if (styleOptions && styleOptions.style) {
          cfg.style = self.getCallbackCfg(styleOptions.fields, styleOptions.style, obj[FIELD_ORIGIN]);
        }

        if (self.get('generatePoints')) {
          cfg.points = obj.points;
          cfg.nextPoints = obj.nextPoints;
        }

        if (isInCircle) {
          cfg.center = self.get('coord').center;
        }

        return cfg;
      };

      _proto.draw = function draw(data, shapeFactory) {
        var self = this;
        var container = self.get('container');
        var yScale = self.getYScale();
        each(data, function (obj, index) {
          if (yScale && isNil(obj._origin[yScale.field])) {
            return;
          }

          obj.index = index;
          var cfg = self.getDrawCfg(obj);
          var shape = obj.shape;
          self.drawShape(shape, obj, cfg, container, shapeFactory);
        });
      };

      _proto.drawShape = function drawShape(shape, shapeData, cfg, container, shapeFactory) {
        var gShape = shapeFactory.drawShape(shape, cfg, container);

        if (gShape) {
          each([].concat(gShape), function (s) {
            s.set('origin', shapeData);
          });
        }
      };

      _proto._generatePoints = function _generatePoints(dataArray) {
        var self = this;
        var shapeFactory = self.getShapeFactory();
        var shapeAttr = self.getAttr('shape');
        each(dataArray, function (data) {
          for (var i = 0, len = data.length; i < len; i++) {
            var obj = data[i];
            var cfg = self.createShapePointsCfg(obj);
            var shape = shapeAttr ? self._getAttrValues(shapeAttr, obj) : null;
            var points = shapeFactory.getShapePoints(shape, cfg);
            obj.points = points;
          }
        }); // 添加nextPoints

        each(dataArray, function (data, index) {
          var nextData = dataArray[index + 1];

          if (nextData) {
            data[0].nextPoints = nextData[0].points;
          }
        });
      } // 生成无障碍文本
      ;

      _proto.generateAria = function generateAria() {
        var container = this.get('container');
        var aria = container.get('aria');

        if (!aria) {
          return;
        }

        var ariaLables = [];
        var coord = this.get('coord');
        var xScale = this.getXScale();
        var yScale = this.getYScale();
        var coordAriaLabel = generateCoordAria(coord, xScale, yScale);
        ariaLables.push(coordAriaLabel);
        var _lang$geometry = lang.geometry,
            prefix = _lang$geometry.prefix,
            oneData = _lang$geometry.oneData,
            partData = _lang$geometry.partData,
            allData = _lang$geometry.allData;
        var dataArray = this.get('dataArray');
        var count = dataArray.length; // 只处理一个，不然太复杂

        var groupScale = this._getGroupScales()[0];

        if (groupScale) {
          var prefixLabel = substitute(prefix, {
            count: count
          });
          ariaLables.push(prefixLabel);
          each(dataArray, function (data, index) {
            var len = data.length;
            if (!len) return;
            var firstObj = data[0]._origin;

            if (len === 1) {
              ariaLables.push(substitute(oneData, {
                index: index + 1,
                count: len,
                name: firstObj[groupScale.field],
                values: firstObj[yScale.field]
              }));
            } else {
              var template = len > 5 ? partData : allData;
              var values = data.slice(0, 5).map(function (record) {
                var _origin = record._origin;
                var xValue = xScale.getText(_origin[xScale.field]);
                var yValue = yScale.getText(_origin[yScale.field]);
                return xValue + ":" + yValue;
              });
              ariaLables.push(substitute(template, {
                index: index + 1,
                count: len,
                part: 3,
                name: firstObj[groupScale.field],
                values: values.join(' ')
              }));
            }
          });
        }

        container.set('ariaLabel', ariaLables.join(''));
      }
      /**
       * get the info of each shape
       * @protected
       * @param  {Object} obj the data item
       * @return {Object} cfg return the result
       */
      ;

      _proto.createShapePointsCfg = function createShapePointsCfg(obj) {
        var xScale = this.getXScale();
        var yScale = this.getYScale();

        var x = this._normalizeValues(obj[xScale.field], xScale);

        var y;

        if (yScale) {
          y = this._normalizeValues(obj[yScale.field], yScale);
        } else {
          y = obj.y ? obj.y : 0.1;
        }

        return {
          x: x,
          y: y,
          y0: yScale ? yScale.scale(this.getYMinValue()) : undefined
        };
      };

      _proto.getYMinValue = function getYMinValue() {
        var yScale = this.getYScale();
        var min = yScale.min,
            max = yScale.max;
        var value;

        if (this.get('startOnZero')) {
          if (max <= 0 && min <= 0) {
            value = max;
          } else {
            value = min >= 0 ? min : 0;
          }
        } else {
          value = min;
        }

        return value;
      };

      _proto._normalizeValues = function _normalizeValues(values, scale) {
        var rst = [];

        if (isArray(values)) {
          for (var i = 0, len = values.length; i < len; i++) {
            var v = values[i];
            rst.push(scale.scale(v));
          }
        } else {
          rst = scale.scale(values);
        }

        return rst;
      };

      _proto.getAttr = function getAttr(name) {
        return this.get('attrs')[name];
      };

      _proto.getXScale = function getXScale() {
        return this.getAttr('position').scales[0];
      };

      _proto.getYScale = function getYScale() {
        return this.getAttr('position').scales[1];
      };

      _proto.hasAdjust = function hasAdjust(adjust) {
        return this.get('adjust') && this.get('adjust').type === adjust;
      };

      _proto._getSnap = function _getSnap(scale, item, arr) {
        var i = 0;
        var values;
        var yField = this.getYScale().field; // 叠加的维度

        if (this.hasAdjust('stack') && scale.field === yField) {
          values = [];
          arr.forEach(function (obj) {
            values.push(obj[FIELD_ORIGIN_Y]);
          });

          for (var len = values.length; i < len; i++) {
            if (values[0][0] > item) {
              break;
            }

            if (values[values.length - 1][1] <= item) {
              i = values.length - 1;
              break;
            }

            if (values[i][0] <= item && values[i][1] > item) {
              break;
            }
          }
        } else {
          values = scale.values;
          values.sort(function (a, b) {
            return a - b;
          });

          for (var _len2 = values.length; i < _len2; i++) {
            // 如果只有1个点直接返回第1个点
            if (_len2 <= 1) {
              break;
            } // 第1个点和第2个点之间


            if ((values[0] + values[1]) / 2 > item) {
              break;
            } // 中间的点


            if ((values[i - 1] + values[i]) / 2 <= item && (values[i + 1] + values[i]) / 2 > item) {
              break;
            } // 最后2个点


            if ((values[values.length - 2] + values[values.length - 1]) / 2 <= item) {
              i = values.length - 1;
              break;
            }
          }
        }

        var result = values[i];
        return result;
      };

      _proto.getSnapRecords = function getSnapRecords(point) {
        var self = this;
        var coord = self.get('coord');
        var xScale = self.getXScale();
        var yScale = self.getYScale();
        var xfield = xScale.field;
        var dataArray = self.get('dataArray');

        if (!this.get('hasSorted')) {
          this._sort(dataArray);
        }

        var rst = [];
        var invertPoint = coord.invertPoint(point);
        var invertPointX = invertPoint.x;

        if (self.isInCircle() && !coord.transposed && invertPointX > (1 + xScale.rangeMax()) / 2) {
          invertPointX = xScale.rangeMin();
        }

        var xValue = xScale.invert(invertPointX);

        if (!xScale.isCategory) {
          xValue = self._getSnap(xScale, xValue);
        }

        var tmp = [];
        dataArray.forEach(function (data) {
          data.forEach(function (obj) {
            var originValue = isNil(obj[FIELD_ORIGIN]) ? obj[xfield] : obj[FIELD_ORIGIN][xfield];

            if (self._isEqual(originValue, xValue, xScale)) {
              tmp.push(obj);
            }
          });
        }); // special for pie chart

        if (this.hasAdjust('stack') && coord.isPolar && coord.transposed) {
          if (invertPointX >= 0 && invertPointX <= 1) {
            var yValue = yScale.invert(invertPoint.y);
            yValue = self._getSnap(yScale, yValue, tmp);
            tmp.forEach(function (obj) {
              if (isArray(yValue) ? obj[FIELD_ORIGIN_Y].toString() === yValue.toString() : obj[FIELD_ORIGIN_Y] === yValue) {
                rst.push(obj);
              }
            });
          }
        } else {
          rst = tmp;
        }

        return rst;
      };

      _proto.getRecords = function getRecords(value) {
        var _this = this;

        var xScale = this.getXScale();
        var dataArray = this.get('dataArray');
        var xfield = xScale.field;
        return dataArray.map(function (data) {
          for (var len = data.length, i = len - 1; i >= 0; i--) {
            var obj = data[i];
            var originValue = isNil(obj[FIELD_ORIGIN]) ? obj[xfield] : obj[FIELD_ORIGIN][xfield];

            if (_this._isEqual(originValue, value, xScale)) {
              return obj;
            }
          }

          return null;
        });
      };

      _proto._isEqual = function _isEqual(originValue, value, scale) {
        if (scale.type === 'timeCat') {
          return toTimeStamp(originValue) === value;
        }

        return value === originValue;
      };

      _proto.position = function position(field) {
        this._setAttrOptions('position', {
          field: field
        });

        return this;
      };

      _proto.color = function color(field, values) {
        this._createAttrOption('color', field, values, Global.colors);

        return this;
      };

      _proto.size = function size(field, values) {
        this._createAttrOption('size', field, values, Global.sizes);

        return this;
      };

      _proto.shape = function shape(field, values) {
        var type = this.get('type');
        var shapes = Global.shapes[type] || [];

        this._createAttrOption('shape', field, values, shapes);

        return this;
      };

      _proto.style = function style(field, cfg) {
        var styleOptions = this.get('styleOptions');

        if (!styleOptions) {
          styleOptions = {};
          this.set('styleOptions', styleOptions);
        }

        if (isObject(field)) {
          cfg = field;
          field = null;
        }

        var fields;

        if (field) {
          fields = parseFields(field);
        }

        styleOptions.fields = fields;
        styleOptions.style = cfg;
        return this;
      };

      _proto.adjust = function adjust(type) {
        if (isString(type)) {
          type = {
            type: type
          };
        }

        this.set('adjust', type);
        return this;
      };

      _proto.animate = function animate(cfg) {
        this.set('animateCfg', cfg);
        return this;
      };

      _proto.changeData = function changeData(data) {
        this.set('data', data); // 改变数据后，情况度量，因为需要重新实例化

        this.set('scales', {});
        if (!this.get('isInit')) return;
        this.set('isInit', false);
        this.init();
      };

      _proto.clearInner = function clearInner() {
        var container = this.get('container');

        if (container) {
          container.clear(); // container.setMatrix([ 1, 0, 0, 1, 0, 0 ]);
        }
      };

      _proto.reset = function reset() {
        this.set('isInit', false);
        this.set('attrs', {});
        this.set('attrOptions', {});
        this.set('adjust', null);
        this.clearInner();
      };

      _proto.clear = function clear() {
        this.clearInner();
      };

      _proto.destroy = function destroy() {
        this.set('isInit', false);
        this.clear();

        _Base.prototype.destroy.call(this);
      };

      _proto._display = function _display(visible) {
        this.set('visible', visible);
        var container = this.get('container');
        var canvas = container.get('canvas');
        container.set('visible', visible);
        canvas.draw();
      };

      _proto.show = function show() {
        this._display(true);
      };

      _proto.hide = function hide() {
        this._display(false);
      };

      return Geom;
    }(Base);

    var methodCache = {};
    /**
     * 获取计算 ticks 的方法
     * @param key 键值
     * @returns 计算 ticks 的方法
     */

    function getTickMethod(key) {
      return methodCache[key];
    }
    /**
     * 注册计算 ticks 的方法
     * @param key 键值
     * @param method 方法
     */

    function registerTickMethod(key, method) {
      methodCache[key] = method;
    }

    var Scale =
    /** @class */
    function () {
      function Scale(cfg) {
        /**
         * 度量的类型
         */
        this.type = 'base';
        /**
         * 是否分类类型的度量
         */

        this.isCategory = false;
        /**
         * 是否线性度量，有linear, time 度量
         */

        this.isLinear = false;
        /**
         * 是否连续类型的度量，linear,time,log, pow, quantile, quantize 都支持
         */

        this.isContinuous = false;
        /**
         * 是否是常量的度量，传入和传出一致
         */

        this.isIdentity = false;
        this.values = [];
        this.range = [0, 1];
        this.ticks = [];
        this.__cfg__ = cfg;
        this.initCfg();
        this.init();
      } // 对于原始值的必要转换，如分类、时间字段需转换成数值，用transform/map命名可能更好


      Scale.prototype.translate = function (v) {
        return v;
      };
      /** 重新初始化 */


      Scale.prototype.change = function (cfg) {
        // 覆盖配置项，而不替代
        mix(this.__cfg__, cfg);
        this.init();
      };

      Scale.prototype.clone = function () {
        return this.constructor(this.__cfg__);
      };
      /** 获取坐标轴需要的ticks */


      Scale.prototype.getTicks = function () {
        var _this = this;

        return map(this.ticks, function (tick, idx) {
          if (isObject(tick)) {
            // 仅当符合Tick类型时才有意义
            return tick;
          }

          return {
            text: _this.getText(tick, idx),
            tickValue: tick,
            value: _this.scale(tick)
          };
        });
      };
      /** 获取Tick的格式化结果 */


      Scale.prototype.getText = function (value, key) {
        var formatter = this.formatter;
        var res = formatter ? formatter(value, key) : value;

        if (isNil(res) || !isFunction(res.toString)) {
          return '';
        }

        return res.toString();
      }; // 获取配置项中的值，当前 scale 上的值可能会被修改


      Scale.prototype.getConfig = function (key) {
        return this.__cfg__[key];
      }; // scale初始化


      Scale.prototype.init = function () {
        mix(this, this.__cfg__);
        this.setDomain();

        if (isEmpty(this.getConfig('ticks'))) {
          this.ticks = this.calculateTicks();
        }
      }; // 子类上覆盖某些属性，不能直接在类上声明，否则会被覆盖


      Scale.prototype.initCfg = function () {};

      Scale.prototype.setDomain = function () {};

      Scale.prototype.calculateTicks = function () {
        var tickMethod = this.tickMethod;
        var ticks = [];

        if (isString(tickMethod)) {
          var method = getTickMethod(tickMethod);

          if (!method) {
            throw new Error('There is no method to to calculate ticks!');
          }

          ticks = method(this);
        } else if (isFunction(tickMethod)) {
          ticks = tickMethod(this);
        }

        return ticks;
      }; // range 的最小值


      Scale.prototype.rangeMin = function () {
        return head(this.range);
      }; // range 的最大值


      Scale.prototype.rangeMax = function () {
        return last(this.range);
      };
      /** 定义域转 0~1 */


      Scale.prototype.calcPercent = function (value, min, max) {
        if (isNumber(value)) {
          return (value - min) / (max - min);
        }

        return NaN;
      };
      /** 0~1转定义域 */


      Scale.prototype.calcValue = function (percent, min, max) {
        return min + percent * (max - min);
      };

      return Scale;
    }();

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };

      return extendStatics(d, b);
    };

    function __extends(d, b) {
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

      return r;
    }

    /**
     * 分类度量
     * @class
     */

    var Category =
    /** @class */
    function (_super) {
      __extends(Category, _super);

      function Category() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = 'cat';
        _this.isCategory = true;
        return _this;
      }

      Category.prototype.translate = function (value) {
        var index = indexOf(this.values, value);

        if (index === -1) {
          return isNumber(value) ? value : NaN;
        }

        return index;
      };

      Category.prototype.scale = function (value) {
        var order = this.translate(value); // 分类数据允许 0.5 范围内调整
        // if (order < this.min - 0.5 || order > this.max + 0.5) {
        //   return NaN;
        // }

        var percent = this.calcPercent(order, this.min, this.max);
        return this.calcValue(percent, this.rangeMin(), this.rangeMax());
      };

      Category.prototype.invert = function (scaledValue) {
        var domainRange = this.max - this.min;
        var percent = this.calcPercent(scaledValue, this.rangeMin(), this.rangeMax());
        var idx = Math.round(domainRange * percent) + this.min;

        if (idx < this.min || idx > this.max) {
          return NaN;
        }

        return this.values[idx];
      };

      Category.prototype.getText = function (value) {
        var args = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
        }

        var v = value; // value为index

        if (isNumber(value) && !this.values.includes(value)) {
          v = this.values[v];
        }

        return _super.prototype.getText.apply(this, __spreadArrays([v], args));
      }; // 复写属性


      Category.prototype.initCfg = function () {
        this.tickMethod = 'cat';
      }; // 设置 min, max


      Category.prototype.setDomain = function () {
        // 用户有可能设置 min
        if (isNil(this.getConfig('min'))) {
          this.min = 0;
        }

        if (isNil(this.getConfig('max'))) {
          var size = this.values.length;
          this.max = size > 1 ? size - 1 : size;
        }
      };

      return Category;
    }(Scale);

    var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
    var twoDigitsOptional = "[1-9]\\d?";
    var twoDigits = "\\d\\d";
    var threeDigits = "\\d{3}";
    var fourDigits = "\\d{4}";
    var word = "[^\\s]+";
    var literal = /\[([^]*?)\]/gm;

    function shorten(arr, sLen) {
      var newArr = [];

      for (var i = 0, len = arr.length; i < len; i++) {
        newArr.push(arr[i].substr(0, sLen));
      }

      return newArr;
    }

    var monthUpdate = function (arrName) {
      return function (v, i18n) {
        var lowerCaseArr = i18n[arrName].map(function (v) {
          return v.toLowerCase();
        });
        var index = lowerCaseArr.indexOf(v.toLowerCase());

        if (index > -1) {
          return index;
        }

        return null;
      };
    };

    function assign(origObj) {
      var args = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
      }

      for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var obj = args_1[_a];

        for (var key in obj) {
          // @ts-ignore ex
          origObj[key] = obj[key];
        }
      }

      return origObj;
    }

    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthNamesShort = shorten(monthNames, 3);
    var dayNamesShort = shorten(dayNames, 3);
    var defaultI18n = {
      dayNamesShort: dayNamesShort,
      dayNames: dayNames,
      monthNamesShort: monthNamesShort,
      monthNames: monthNames,
      amPm: ["am", "pm"],
      DoFn: function (dayOfMonth) {
        return dayOfMonth + ["th", "st", "nd", "rd"][dayOfMonth % 10 > 3 ? 0 : (dayOfMonth - dayOfMonth % 10 !== 10 ? 1 : 0) * dayOfMonth % 10];
      }
    };
    var globalI18n = assign({}, defaultI18n);

    var setGlobalDateI18n = function (i18n) {
      return globalI18n = assign(globalI18n, i18n);
    };

    var regexEscape = function (str) {
      return str.replace(/[|\\{()[^$+*?.-]/g, "\\$&");
    };

    var pad = function (val, len) {
      if (len === void 0) {
        len = 2;
      }

      val = String(val);

      while (val.length < len) {
        val = "0" + val;
      }

      return val;
    };

    var formatFlags = {
      D: function (dateObj) {
        return String(dateObj.getDate());
      },
      DD: function (dateObj) {
        return pad(dateObj.getDate());
      },
      Do: function (dateObj, i18n) {
        return i18n.DoFn(dateObj.getDate());
      },
      d: function (dateObj) {
        return String(dateObj.getDay());
      },
      dd: function (dateObj) {
        return pad(dateObj.getDay());
      },
      ddd: function (dateObj, i18n) {
        return i18n.dayNamesShort[dateObj.getDay()];
      },
      dddd: function (dateObj, i18n) {
        return i18n.dayNames[dateObj.getDay()];
      },
      M: function (dateObj) {
        return String(dateObj.getMonth() + 1);
      },
      MM: function (dateObj) {
        return pad(dateObj.getMonth() + 1);
      },
      MMM: function (dateObj, i18n) {
        return i18n.monthNamesShort[dateObj.getMonth()];
      },
      MMMM: function (dateObj, i18n) {
        return i18n.monthNames[dateObj.getMonth()];
      },
      YY: function (dateObj) {
        return pad(String(dateObj.getFullYear()), 4).substr(2);
      },
      YYYY: function (dateObj) {
        return pad(dateObj.getFullYear(), 4);
      },
      h: function (dateObj) {
        return String(dateObj.getHours() % 12 || 12);
      },
      hh: function (dateObj) {
        return pad(dateObj.getHours() % 12 || 12);
      },
      H: function (dateObj) {
        return String(dateObj.getHours());
      },
      HH: function (dateObj) {
        return pad(dateObj.getHours());
      },
      m: function (dateObj) {
        return String(dateObj.getMinutes());
      },
      mm: function (dateObj) {
        return pad(dateObj.getMinutes());
      },
      s: function (dateObj) {
        return String(dateObj.getSeconds());
      },
      ss: function (dateObj) {
        return pad(dateObj.getSeconds());
      },
      S: function (dateObj) {
        return String(Math.round(dateObj.getMilliseconds() / 100));
      },
      SS: function (dateObj) {
        return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
      },
      SSS: function (dateObj) {
        return pad(dateObj.getMilliseconds(), 3);
      },
      a: function (dateObj, i18n) {
        return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
      },
      A: function (dateObj, i18n) {
        return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
      },
      ZZ: function (dateObj) {
        var offset = dateObj.getTimezoneOffset();
        return (offset > 0 ? "-" : "+") + pad(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60, 4);
      },
      Z: function (dateObj) {
        var offset = dateObj.getTimezoneOffset();
        return (offset > 0 ? "-" : "+") + pad(Math.floor(Math.abs(offset) / 60), 2) + ":" + pad(Math.abs(offset) % 60, 2);
      }
    };

    var monthParse = function (v) {
      return +v - 1;
    };

    var emptyDigits = [null, twoDigitsOptional];
    var emptyWord = [null, word];
    var amPm = ["isPm", word, function (v, i18n) {
      var val = v.toLowerCase();

      if (val === i18n.amPm[0]) {
        return 0;
      } else if (val === i18n.amPm[1]) {
        return 1;
      }

      return null;
    }];
    var timezoneOffset = ["timezoneOffset", "[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?", function (v) {
      var parts = (v + "").match(/([+-]|\d\d)/gi);

      if (parts) {
        var minutes = +parts[1] * 60 + parseInt(parts[2], 10);
        return parts[0] === "+" ? minutes : -minutes;
      }

      return 0;
    }];
    var parseFlags = {
      D: ["day", twoDigitsOptional],
      DD: ["day", twoDigits],
      Do: ["day", twoDigitsOptional + word, function (v) {
        return parseInt(v, 10);
      }],
      M: ["month", twoDigitsOptional, monthParse],
      MM: ["month", twoDigits, monthParse],
      YY: ["year", twoDigits, function (v) {
        var now = new Date();
        var cent = +("" + now.getFullYear()).substr(0, 2);
        return +("" + (+v > 68 ? cent - 1 : cent) + v);
      }],
      h: ["hour", twoDigitsOptional, undefined, "isPm"],
      hh: ["hour", twoDigits, undefined, "isPm"],
      H: ["hour", twoDigitsOptional],
      HH: ["hour", twoDigits],
      m: ["minute", twoDigitsOptional],
      mm: ["minute", twoDigits],
      s: ["second", twoDigitsOptional],
      ss: ["second", twoDigits],
      YYYY: ["year", fourDigits],
      S: ["millisecond", "\\d", function (v) {
        return +v * 100;
      }],
      SS: ["millisecond", twoDigits, function (v) {
        return +v * 10;
      }],
      SSS: ["millisecond", threeDigits],
      d: emptyDigits,
      dd: emptyDigits,
      ddd: emptyWord,
      dddd: emptyWord,
      MMM: ["month", word, monthUpdate("monthNamesShort")],
      MMMM: ["month", word, monthUpdate("monthNames")],
      a: amPm,
      A: amPm,
      ZZ: timezoneOffset,
      Z: timezoneOffset
    }; // Some common format strings

    var globalMasks = {
      default: "ddd MMM DD YYYY HH:mm:ss",
      shortDate: "M/D/YY",
      mediumDate: "MMM D, YYYY",
      longDate: "MMMM D, YYYY",
      fullDate: "dddd, MMMM D, YYYY",
      isoDate: "YYYY-MM-DD",
      isoDateTime: "YYYY-MM-DDTHH:mm:ssZ",
      shortTime: "HH:mm",
      mediumTime: "HH:mm:ss",
      longTime: "HH:mm:ss.SSS"
    };

    var setGlobalDateMasks = function (masks) {
      return assign(globalMasks, masks);
    };
    /***
     * Format a date
     * @method format
     * @param {Date|number} dateObj
     * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
     * @returns {string} Formatted date string
     */


    var format = function (dateObj, mask, i18n) {
      if (mask === void 0) {
        mask = globalMasks["default"];
      }

      if (i18n === void 0) {
        i18n = {};
      }

      if (typeof dateObj === "number") {
        dateObj = new Date(dateObj);
      }

      if (Object.prototype.toString.call(dateObj) !== "[object Date]" || isNaN(dateObj.getTime())) {
        throw new Error("Invalid Date pass to format");
      }

      mask = globalMasks[mask] || mask;
      var literals = []; // Make literals inactive by replacing them with @@@

      mask = mask.replace(literal, function ($0, $1) {
        literals.push($1);
        return "@@@";
      });
      var combinedI18nSettings = assign(assign({}, globalI18n), i18n); // Apply formatting rules

      mask = mask.replace(token, function ($0) {
        return formatFlags[$0](dateObj, combinedI18nSettings);
      }); // Inline literal values back into the formatted value

      return mask.replace(/@@@/g, function () {
        return literals.shift();
      });
    };
    /**
     * Parse a date string into a Javascript Date object /
     * @method parse
     * @param {string} dateStr Date string
     * @param {string} format Date parse format
     * @param {i18n} I18nSettingsOptional Full or subset of I18N settings
     * @returns {Date|null} Returns Date object. Returns null what date string is invalid or doesn't match format
     */


    function parse(dateStr, format, i18n) {
      if (i18n === void 0) {
        i18n = {};
      }

      if (typeof format !== "string") {
        throw new Error("Invalid format in fecha parse");
      } // Check to see if the format is actually a mask


      format = globalMasks[format] || format; // Avoid regular expression denial of service, fail early for really long strings
      // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS

      if (dateStr.length > 1000) {
        return null;
      } // Default to the beginning of the year.


      var today = new Date();
      var dateInfo = {
        year: today.getFullYear(),
        month: 0,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        isPm: null,
        timezoneOffset: null
      };
      var parseInfo = [];
      var literals = []; // Replace all the literals with @@@. Hopefully a string that won't exist in the format

      var newFormat = format.replace(literal, function ($0, $1) {
        literals.push(regexEscape($1));
        return "@@@";
      });
      var specifiedFields = {};
      var requiredFields = {}; // Change every token that we find into the correct regex

      newFormat = regexEscape(newFormat).replace(token, function ($0) {
        var info = parseFlags[$0];
        var field = info[0],
            regex = info[1],
            requiredField = info[3]; // Check if the person has specified the same field twice. This will lead to confusing results.

        if (specifiedFields[field]) {
          throw new Error("Invalid format. " + field + " specified twice in format");
        }

        specifiedFields[field] = true; // Check if there are any required fields. For instance, 12 hour time requires AM/PM specified

        if (requiredField) {
          requiredFields[requiredField] = true;
        }

        parseInfo.push(info);
        return "(" + regex + ")";
      }); // Check all the required fields are present

      Object.keys(requiredFields).forEach(function (field) {
        if (!specifiedFields[field]) {
          throw new Error("Invalid format. " + field + " is required in specified format");
        }
      }); // Add back all the literals after

      newFormat = newFormat.replace(/@@@/g, function () {
        return literals.shift();
      }); // Check if the date string matches the format. If it doesn't return null

      var matches = dateStr.match(new RegExp(newFormat, "i"));

      if (!matches) {
        return null;
      }

      var combinedI18nSettings = assign(assign({}, globalI18n), i18n); // For each match, call the parser function for that date part

      for (var i = 1; i < matches.length; i++) {
        var _a = parseInfo[i - 1],
            field = _a[0],
            parser = _a[2];
        var value = parser ? parser(matches[i], combinedI18nSettings) : +matches[i]; // If the parser can't make sense of the value, return null

        if (value == null) {
          return null;
        }

        dateInfo[field] = value;
      }

      if (dateInfo.isPm === 1 && dateInfo.hour != null && +dateInfo.hour !== 12) {
        dateInfo.hour = +dateInfo.hour + 12;
      } else if (dateInfo.isPm === 0 && +dateInfo.hour === 12) {
        dateInfo.hour = 0;
      }

      var dateWithoutTZ = new Date(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute, dateInfo.second, dateInfo.millisecond);
      var validateFields = [["month", "getMonth"], ["day", "getDate"], ["hour", "getHours"], ["minute", "getMinutes"], ["second", "getSeconds"]];

      for (var i = 0, len = validateFields.length; i < len; i++) {
        // Check to make sure the date field is within the allowed range. Javascript dates allows values
        // outside the allowed range. If the values don't match the value was invalid
        if (specifiedFields[validateFields[i][0]] && dateInfo[validateFields[i][0]] !== dateWithoutTZ[validateFields[i][1]]()) {
          return null;
        }
      }

      if (dateInfo.timezoneOffset == null) {
        return dateWithoutTZ;
      }

      return new Date(Date.UTC(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute - dateInfo.timezoneOffset, dateInfo.second, dateInfo.millisecond));
    }

    var fecha = {
      format: format,
      parse: parse,
      defaultI18n: defaultI18n,
      setGlobalDateI18n: setGlobalDateI18n,
      setGlobalDateMasks: setGlobalDateMasks
    };

    var fecha1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': fecha,
        assign: assign,
        format: format,
        parse: parse,
        defaultI18n: defaultI18n,
        setGlobalDateI18n: setGlobalDateI18n,
        setGlobalDateMasks: setGlobalDateMasks
    });

    /**
     * 二分右侧查找
     * https://github.com/d3/d3-array/blob/master/src/bisector.js
     */

    function bisector (getter) {
      /**
       * x: 目标值
       * lo: 起始位置
       * hi: 结束位置
       */
      return function (a, x, _lo, _hi) {
        var lo = isNil(_lo) ? 0 : _lo;
        var hi = isNil(_hi) ? a.length : _hi;

        while (lo < hi) {
          var mid = lo + hi >>> 1;

          if (getter(a[mid]) > x) {
            hi = mid;
          } else {
            lo = mid + 1;
          }
        }

        return lo;
      };
    }

    var FORMAT_METHOD = 'format';
    function timeFormat(time, mask) {
      var method = fecha1[FORMAT_METHOD] || fecha[FORMAT_METHOD];
      return method(time, mask);
    }
    /**
     * 转换成时间戳
     * @param value 时间值
     */

    function toTimeStamp$1(value) {
      if (isString(value)) {
        if (value.indexOf('T') > 0) {
          value = new Date(value).getTime();
        } else {
          // new Date('2010/01/10') 和 new Date('2010-01-10') 的差别在于:
          // 如果仅有年月日时，前者是带有时区的: Fri Jan 10 2020 02:40:13 GMT+0800 (中国标准时间)
          // 后者会格式化成 Sun Jan 10 2010 08:00:00 GMT+0800 (中国标准时间)
          value = new Date(value.replace(/-/gi, '/')).getTime();
        }
      }

      if (isDate(value)) {
        value = value.getTime();
      }

      return value;
    }
    var SECOND = 1000;
    var MINUTE = 60 * SECOND;
    var HOUR = 60 * MINUTE;
    var DAY = 24 * HOUR;
    var MONTH = DAY * 31;
    var YEAR = DAY * 365;
    var intervals = [['HH:mm:ss', SECOND], ['HH:mm:ss', SECOND * 10], ['HH:mm:ss', SECOND * 30], ['HH:mm', MINUTE], ['HH:mm', MINUTE * 10], ['HH:mm', MINUTE * 30], ['HH', HOUR], ['HH', HOUR * 6], ['HH', HOUR * 12], ['YYYY-MM-DD', DAY], ['YYYY-MM-DD', DAY * 4], ['YYYY-WW', DAY * 7], ['YYYY-MM', MONTH], ['YYYY-MM', MONTH * 4], ['YYYY-MM', MONTH * 6], ['YYYY', DAY * 380]];
    function getTickInterval(min, max, tickCount) {
      var target = (max - min) / tickCount;
      var idx = bisector(function (o) {
        return o[1];
      })(intervals, target) - 1;
      var interval = intervals[idx];

      if (idx < 0) {
        interval = intervals[0];
      } else if (idx >= intervals.length) {
        interval = last(intervals);
      }

      return interval;
    }

    /**
     * 时间分类度量
     * @class
     */

    var TimeCat =
    /** @class */
    function (_super) {
      __extends(TimeCat, _super);

      function TimeCat() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = 'timeCat';
        return _this;
      }
      /**
       * @override
       */


      TimeCat.prototype.translate = function (value) {
        value = toTimeStamp$1(value);
        var index = this.values.indexOf(value);

        if (index === -1) {
          if (isNumber(value) && value < this.values.length) {
            index = value;
          } else {
            index = NaN;
          }
        }

        return index;
      };
      /**
       * 由于时间类型数据需要转换一下，所以复写 getText
       * @override
       */


      TimeCat.prototype.getText = function (value, tickIndex) {
        var index = this.translate(value);

        if (index > -1) {
          var result = this.values[index];
          var formatter = this.formatter;
          result = formatter ? formatter(result, tickIndex) : timeFormat(result, this.mask);
          return result;
        }

        return value;
      };

      TimeCat.prototype.initCfg = function () {
        this.tickMethod = 'time-cat';
        this.mask = 'YYYY-MM-DD';
        this.tickCount = 7; // 一般时间数据会显示 7， 14， 30 天的数字
      };

      TimeCat.prototype.setDomain = function () {
        var values = this.values; // 针对时间分类类型，会将时间统一转换为时间戳

        each(values, function (v, i) {
          values[i] = toTimeStamp$1(v);
        });
        values.sort(function (v1, v2) {
          return v1 - v2;
        });

        _super.prototype.setDomain.call(this);
      };

      return TimeCat;
    }(Category);

    /**
     * 连续度量的基类
     * @class
     */

    var Continuous =
    /** @class */
    function (_super) {
      __extends(Continuous, _super);

      function Continuous() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.isContinuous = true;
        return _this;
      }

      Continuous.prototype.scale = function (value) {
        if (isNil(value)) {
          return NaN;
        }

        var rangeMin = this.rangeMin();
        var rangeMax = this.rangeMax();
        var max = this.max;
        var min = this.min;

        if (max === min) {
          return rangeMin;
        }

        var percent = this.getScalePercent(value);
        return rangeMin + percent * (rangeMax - rangeMin);
      };

      Continuous.prototype.init = function () {
        _super.prototype.init.call(this); // init 完成后保证 min, max 包含 ticks 的范围


        var ticks = this.ticks;
        var firstTick = head(ticks);
        var lastTick = last(ticks);

        if (firstTick < this.min) {
          this.min = firstTick;
        }

        if (lastTick > this.max) {
          this.max = lastTick;
        } // strict-limit 方式


        if (!isNil(this.minLimit)) {
          this.min = firstTick;
        }

        if (!isNil(this.maxLimit)) {
          this.max = lastTick;
        }
      };

      Continuous.prototype.setDomain = function () {
        var _a = getRange(this.values),
            min = _a.min,
            max = _a.max;

        if (isNil(this.min)) {
          this.min = min;
        }

        if (isNil(this.max)) {
          this.max = max;
        }

        if (this.min > this.max) {
          this.min = min;
          this.max = max;
        }
      };

      Continuous.prototype.calculateTicks = function () {
        var _this = this;

        var ticks = _super.prototype.calculateTicks.call(this);

        if (!this.nice) {
          ticks = filter(ticks, function (tick) {
            return tick >= _this.min && tick <= _this.max;
          });
        }

        return ticks;
      }; // 计算原始值值占的百分比


      Continuous.prototype.getScalePercent = function (value) {
        var max = this.max;
        var min = this.min;
        return (value - min) / (max - min);
      };

      Continuous.prototype.getInvertPercent = function (value) {
        return (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
      };

      return Continuous;
    }(Scale);

    /**
     * 线性度量
     * @class
     */

    var Linear =
    /** @class */
    function (_super) {
      __extends(Linear, _super);

      function Linear() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = 'linear';
        _this.isLinear = true;
        return _this;
      }

      Linear.prototype.invert = function (value) {
        var percent = this.getInvertPercent(value);
        return this.min + percent * (this.max - this.min);
      };

      Linear.prototype.initCfg = function () {
        this.tickMethod = 'wilkinson-extended';
        this.nice = false;
      };

      return Linear;
    }(Continuous);

    // 虽然数学上 b 不支持负数，但是这里需要支持 负数

    function calBase(a, b) {
      var e = Math.E;
      var value;

      if (b >= 0) {
        value = Math.pow(e, Math.log(b) / a); // 使用换底公式求底
      } else {
        value = Math.pow(e, Math.log(-b) / a) * -1; // 使用换底公式求底
      }

      return value;
    }
    function log(a, b) {
      if (a === 1) {
        return 1;
      }

      return Math.log(b) / Math.log(a);
    }
    function getLogPositiveMin(values, base, max) {
      if (isNil(max)) {
        max = Math.max.apply(null, values);
      }

      var positiveMin = max;
      each(values, function (value) {
        if (value > 0 && value < positiveMin) {
          positiveMin = value;
        }
      });

      if (positiveMin === max) {
        positiveMin = max / base;
      }

      if (positiveMin > 1) {
        positiveMin = 1;
      }

      return positiveMin;
    }

    /**
     * Log 度量，处理非均匀分布
     */

    var Log =
    /** @class */
    function (_super) {
      __extends(Log, _super);

      function Log() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = 'log';
        return _this;
      }
      /**
       * @override
       */


      Log.prototype.invert = function (value) {
        var base = this.base;
        var max = log(base, this.max);
        var rangeMin = this.rangeMin();
        var range = this.rangeMax() - rangeMin;
        var min;
        var positiveMin = this.positiveMin;

        if (positiveMin) {
          if (value === 0) {
            return 0;
          }

          min = log(base, positiveMin / base);
          var appendPercent = 1 / (max - min) * range; // 0 到 positiveMin的占比

          if (value < appendPercent) {
            // 落到 0 - positiveMin 之间
            return value / appendPercent * positiveMin;
          }
        } else {
          min = log(base, this.min);
        }

        var percent = (value - rangeMin) / range;
        var tmp = percent * (max - min) + min;
        return Math.pow(base, tmp);
      };

      Log.prototype.initCfg = function () {
        this.tickMethod = 'log';
        this.base = 10;
        this.tickCount = 6;
        this.nice = true;
      }; // 设置


      Log.prototype.setDomain = function () {
        _super.prototype.setDomain.call(this);

        var min = this.min;

        if (min < 0) {
          throw new Error('When you use log scale, the minimum value must be greater than zero!');
        }

        if (min === 0) {
          this.positiveMin = getLogPositiveMin(this.values, this.base, this.max);
        }
      }; // 根据当前值获取占比


      Log.prototype.getScalePercent = function (value) {
        var max = this.max;
        var min = this.min;

        if (max === min) {
          return 0;
        } // 如果值小于等于0，则按照0处理


        if (value <= 0) {
          return 0;
        }

        var base = this.base;
        var positiveMin = this.positiveMin; // 如果min == 0, 则根据比0大的最小值，计算比例关系。这个最小值作为坐标轴上的第二个tick，第一个是0但是不显示

        if (positiveMin) {
          min = positiveMin * 1 / base;
        }

        var percent; // 如果数值小于次小值，那么就计算 value / 次小值 占整体的比例

        if (value < positiveMin) {
          percent = value / positiveMin / (log(base, max) - log(base, min));
        } else {
          percent = (log(base, value) - log(base, min)) / (log(base, max) - log(base, min));
        }

        return percent;
      };

      return Log;
    }(Continuous);

    /**
     * Pow 度量，处理非均匀分布
     */

    var Pow =
    /** @class */
    function (_super) {
      __extends(Pow, _super);

      function Pow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = 'pow';
        return _this;
      }
      /**
       * @override
       */


      Pow.prototype.invert = function (value) {
        var percent = this.getInvertPercent(value);
        var exponent = this.exponent;
        var max = calBase(exponent, this.max);
        var min = calBase(exponent, this.min);
        var tmp = percent * (max - min) + min;
        var factor = tmp >= 0 ? 1 : -1;
        return Math.pow(tmp, exponent) * factor;
      };

      Pow.prototype.initCfg = function () {
        this.tickMethod = 'pow';
        this.exponent = 2;
        this.tickCount = 5;
        this.nice = true;
      }; // 获取度量计算时，value占的定义域百分比


      Pow.prototype.getScalePercent = function (value) {
        var max = this.max;
        var min = this.min;

        if (max === min) {
          return 0;
        }

        var exponent = this.exponent;
        var percent = (calBase(exponent, value) - calBase(exponent, min)) / (calBase(exponent, max) - calBase(exponent, min));
        return percent;
      };

      return Pow;
    }(Continuous);

    /**
     * 时间度量
     * @class
     */

    var Time =
    /** @class */
    function (_super) {
      __extends(Time, _super);

      function Time() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = 'time';
        return _this;
      }
      /**
       * @override
       */


      Time.prototype.getText = function (value, index) {
        var numberValue = this.translate(value);
        var formatter = this.formatter;
        return formatter ? formatter(numberValue, index) : timeFormat(numberValue, this.mask);
      };
      /**
       * @override
       */


      Time.prototype.scale = function (value) {
        var v = value;

        if (isString(v) || isDate(v)) {
          v = this.translate(v);
        }

        return _super.prototype.scale.call(this, v);
      };
      /**
       * 将时间转换成数字
       * @override
       */


      Time.prototype.translate = function (v) {
        return toTimeStamp$1(v);
      };

      Time.prototype.initCfg = function () {
        this.tickMethod = 'time-pretty';
        this.mask = 'YYYY-MM-DD';
        this.tickCount = 7;
        this.nice = false;
      };

      Time.prototype.setDomain = function () {
        var values = this.values; // 是否设置了 min, max，而不是直接取 this.min, this.max

        var minConfig = this.getConfig('min');
        var maxConfig = this.getConfig('max'); // 如果设置了 min,max 则转换成时间戳

        if (!isNil(minConfig) || !isNumber(minConfig)) {
          this.min = this.translate(this.min);
        }

        if (!isNil(maxConfig) || !isNumber(maxConfig)) {
          this.max = this.translate(this.max);
        } // 没有设置 min, max 时


        if (values && values.length) {
          // 重新计算最大最小值
          var timeStamps_1 = [];
          var min_1 = Infinity; // 最小值

          var secondMin_1 = min_1; // 次小值

          var max_1 = 0; // 使用一个循环，计算min,max,secondMin

          each(values, function (v) {
            var timeStamp = toTimeStamp$1(v);

            if (isNaN(timeStamp)) {
              throw new TypeError("Invalid Time: " + v + " in time scale!");
            }

            if (min_1 > timeStamp) {
              secondMin_1 = min_1;
              min_1 = timeStamp;
            } else if (secondMin_1 > timeStamp) {
              secondMin_1 = timeStamp;
            }

            if (max_1 < timeStamp) {
              max_1 = timeStamp;
            }

            timeStamps_1.push(timeStamp);
          }); // 存在多个值时，设置最小间距

          if (values.length > 1) {
            this.minTickInterval = secondMin_1 - min_1;
          }

          if (isNil(minConfig)) {
            this.min = min_1;
          }

          if (isNil(maxConfig)) {
            this.max = max_1;
          }
        }
      };

      return Time;
    }(Linear);

    /**
     * 分段度量
     */

    var Quantize =
    /** @class */
    function (_super) {
      __extends(Quantize, _super);

      function Quantize() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = 'quantize';
        return _this;
      }

      Quantize.prototype.invert = function (value) {
        var ticks = this.ticks;
        var length = ticks.length;
        var percent = this.getInvertPercent(value);
        var minIndex = Math.floor(percent * (length - 1)); // 最后一个

        if (minIndex >= length - 1) {
          return last(ticks);
        } // 超出左边界， 则取第一个


        if (minIndex < 0) {
          return head(ticks);
        }

        var minTick = ticks[minIndex];
        var nextTick = ticks[minIndex + 1]; // 比当前值小的 tick 在度量上的占比

        var minIndexPercent = minIndex / (length - 1);
        var maxIndexPercent = (minIndex + 1) / (length - 1);
        return minTick + (percent - minIndexPercent) / (maxIndexPercent - minIndexPercent) * (nextTick - minTick);
      };

      Quantize.prototype.initCfg = function () {
        this.tickMethod = 'r-pretty';
        this.tickCount = 5;
        this.nice = true;
      };

      Quantize.prototype.calculateTicks = function () {
        var ticks = _super.prototype.calculateTicks.call(this);

        if (!this.nice) {
          // 如果 nice = false ,补充 min, max
          if (last(ticks) !== this.max) {
            ticks.push(this.max);
          }

          if (head(ticks) !== this.min) {
            ticks.unshift(this.min);
          }
        }

        return ticks;
      }; // 计算当前值在刻度中的占比


      Quantize.prototype.getScalePercent = function (value) {
        var ticks = this.ticks; // 超出左边界

        if (value < head(ticks)) {
          return 0;
        } // 超出右边界


        if (value > last(ticks)) {
          return 1;
        }

        var minIndex = 0;
        each(ticks, function (tick, index) {
          if (value >= tick) {
            minIndex = index;
          } else {
            return false;
          }
        });
        return minIndex / (ticks.length - 1);
      };

      return Quantize;
    }(Continuous);

    var Quantile =
    /** @class */
    function (_super) {
      __extends(Quantile, _super);

      function Quantile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = 'quantile';
        return _this;
      }

      Quantile.prototype.initCfg = function () {
        this.tickMethod = 'quantile';
        this.tickCount = 5;
        this.nice = true;
      };

      return Quantile;
    }(Quantize);

    var map$1 = {};

    function getClass(key) {
      return map$1[key];
    }

    function registerClass(key, cls) {
      if (getClass(key)) {
        throw new Error("type '" + key + "' existed.");
      }

      map$1[key] = cls;
    }

    /**
     * identity scale原则上是定义域和值域一致，scale/invert方法也是一致的
     * 参考R的实现：https://github.com/r-lib/scales/blob/master/R/pal-identity.r
     * 参考d3的实现（做了下转型）：https://github.com/d3/d3-scale/blob/master/src/identity.js
     */

    var Identity =
    /** @class */
    function (_super) {
      __extends(Identity, _super);

      function Identity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = 'identity';
        _this.isIdentity = true;
        return _this;
      }

      Identity.prototype.calculateTicks = function () {
        return this.values;
      };

      Identity.prototype.scale = function (value) {
        // 如果传入的值不等于 identity 的值，则直接返回，用于一维图时的 dodge
        if (this.values[0] !== value && isNumber(value)) {
          return value;
        }

        return this.range[0];
      };

      Identity.prototype.invert = function (value) {
        var range = this.range;

        if (value < range[0] || value > range[1]) {
          return NaN;
        }

        return this.values[0];
      };

      return Identity;
    }(Scale);

    var DEFAULT_Q = [1, 5, 2, 2.5, 4, 3];
    var eps = Number.EPSILON * 100; // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers

    function mod(n, m) {
      return (n % m + m) % m;
    }

    function simplicity(q, Q, j, lmin, lmax, lstep) {
      var n = size(Q);
      var i = indexOf(Q, q);
      var v = 0;
      var m = mod(lmin, lstep);

      if ((m < eps || lstep - m < eps) && lmin <= 0 && lmax >= 0) {
        v = 1;
      }

      return 1 - i / (n - 1) - j + v;
    }

    function simplicityMax(q, Q, j) {
      var n = size(Q);
      var i = indexOf(Q, q);
      var v = 1;
      return 1 - i / (n - 1) - j + v;
    }

    function density(k, m, dmin, dmax, lmin, lmax) {
      var r = (k - 1) / (lmax - lmin);
      var rt = (m - 1) / (Math.max(lmax, dmax) - Math.min(dmin, lmin));
      return 2 - Math.max(r / rt, rt / r);
    }

    function densityMax(k, m) {
      if (k >= m) {
        return 2 - (k - 1) / (m - 1);
      }

      return 1;
    }

    function coverage(dmin, dmax, lmin, lmax) {
      var range = dmax - dmin;
      return 1 - 0.5 * (Math.pow(dmax - lmax, 2) + Math.pow(dmin - lmin, 2)) / Math.pow(0.1 * range, 2);
    }

    function coverageMax(dmin, dmax, span) {
      var range = dmax - dmin;

      if (span > range) {
        var half = (span - range) / 2;
        return 1 - Math.pow(half, 2) / Math.pow(0.1 * range, 2);
      }

      return 1;
    }

    function legibility() {
      return 1;
    }
    /**
     * An Extension of Wilkinson's Algorithm for Position Tick Labels on Axes
     * https://www.yuque.com/preview/yuque/0/2019/pdf/185317/1546999150858-45c3b9c2-4e86-4223-bf1a-8a732e8195ed.pdf
     * @param dmin 最小值
     * @param dmax 最大值
     * @param m tick个数
     * @param onlyLoose 是否允许扩展min、max，不绝对强制，例如[3, 97]
     * @param Q nice numbers集合
     * @param w 四个优化组件的权重
     */


    function extended(dmin, dmax, m, onlyLoose, Q, w) {
      if (m === void 0) {
        m = 5;
      }

      if (onlyLoose === void 0) {
        onlyLoose = true;
      }

      if (Q === void 0) {
        Q = DEFAULT_Q;
      }

      if (w === void 0) {
        w = [0.25, 0.2, 0.5, 0.05];
      } // 异常数据情况下，直接返回，防止 oom


      if (typeof dmin !== 'number' || typeof dmax !== 'number') {
        return {
          min: 0,
          max: 0,
          ticks: []
        };
      }

      if (dmin === dmax || m === 1) {
        return {
          min: dmin,
          max: dmax,
          ticks: [dmin]
        };
      }

      var best = {
        score: -2,
        lmin: 0,
        lmax: 0,
        lstep: 0
      };
      var j = 1;

      while (j < Infinity) {
        for (var _i = 0, Q_1 = Q; _i < Q_1.length; _i++) {
          var q = Q_1[_i];
          var sm = simplicityMax(q, Q, j);

          if (Number.isNaN(sm)) {
            throw new Error('NaN');
          }

          if (w[0] * sm + w[1] + w[2] + w[3] < best.score) {
            j = Infinity;
            break;
          }

          var k = 2;

          while (k < Infinity) {
            var dm = densityMax(k, m);

            if (w[0] * sm + w[1] + w[2] * dm + w[3] < best.score) {
              break;
            }

            var delta = (dmax - dmin) / (k + 1) / j / q;
            var z = Math.ceil(Math.log10(delta));

            while (z < Infinity) {
              var step = j * q * Math.pow(10, z);
              var cm = coverageMax(dmin, dmax, step * (k - 1));

              if (w[0] * sm + w[1] * cm + w[2] * dm + w[3] < best.score) {
                break;
              }

              var minStart = Math.floor(dmax / step) * j - (k - 1) * j;
              var maxStart = Math.ceil(dmin / step) * j;

              if (minStart > maxStart) {
                z = z + 1;
                continue;
              }

              for (var start = minStart; start <= maxStart; start = start + 1) {
                var lmin = start * (step / j);
                var lmax = lmin + step * (k - 1);
                var lstep = step;
                var s = simplicity(q, Q, j, lmin, lmax, lstep);
                var c = coverage(dmin, dmax, lmin, lmax);
                var g = density(k, m, dmin, dmax, lmin, lmax);
                var l = legibility();
                var score = w[0] * s + w[1] * c + w[2] * g + w[3] * l;

                if (score > best.score && (!onlyLoose || lmin <= dmin && lmax >= dmax)) {
                  best.lmin = lmin;
                  best.lmax = lmax;
                  best.lstep = lstep;
                  best.score = score;
                }
              }

              z = z + 1;
            }

            k = k + 1;
          }
        }

        j = j + 1;
      } // 步长为浮点数时处理精度


      var toFixed = Number.isInteger(best.lstep) ? 0 : Math.ceil(Math.abs(Math.log10(best.lstep)));
      var range = [];

      for (var tick = best.lmin; tick <= best.lmax; tick += best.lstep) {
        range.push(tick);
      }

      var ticks = toFixed ? map(range, function (x) {
        return Number.parseFloat(x.toFixed(toFixed));
      }) : range;
      return {
        min: Math.min(dmin, head(ticks)),
        max: Math.max(dmax, last(ticks)),
        ticks: ticks
      };
    }

    /**
     * 计算分类 ticks
     * @param cfg 度量的配置项
     * @returns 计算后的 ticks
     */

    function calculateCatTicks(cfg) {
      var values = cfg.values,
          tickInterval = cfg.tickInterval,
          tickCount = cfg.tickCount;
      var ticks = values;

      if (isNumber(tickInterval)) {
        return filter(ticks, function (__, i) {
          return i % tickInterval === 0;
        });
      }

      var min = cfg.min,
          max = cfg.max;

      if (isNil(min)) {
        min = 0;
      }

      if (isNil(max)) {
        max = values.length - 1;
      }

      if (isNumber(tickCount) && tickCount < max - min) {
        // 简单过滤，部分情况下小数的倍数也可以是整数
        // tslint:disable-next-line: no-shadowed-variable
        var ticks_1 = extended(min, max, tickCount, false, [1, 2, 5, 3, 4, 7, 6, 8, 9]).ticks;
        var valid = filter(ticks_1, function (tick) {
          return tick >= min && tick <= max;
        });
        return valid.map(function (index) {
          return values[index];
        });
      }

      return values.slice(min, max + 1);
    }

    function d3Linear(cfg) {
      var min = cfg.min,
          max = cfg.max,
          nice = cfg.nice,
          tickCount = cfg.tickCount;
      var linear = new D3Linear();
      linear.domain([min, max]);

      if (nice) {
        linear.nice(tickCount);
      }

      return linear.ticks(tickCount);
    }
    var DEFAULT_COUNT = 5;
    var e10 = Math.sqrt(50);
    var e5 = Math.sqrt(10);
    var e2 = Math.sqrt(2); // https://github.com/d3/d3-scale

    var D3Linear =
    /** @class */
    function () {
      function D3Linear() {
        this._domain = [0, 1];
      }

      D3Linear.prototype.domain = function (domain) {
        if (domain) {
          this._domain = Array.from(domain, Number);
          return this;
        }

        return this._domain.slice();
      };

      D3Linear.prototype.nice = function (count) {
        var _a, _b;

        if (count === void 0) {
          count = DEFAULT_COUNT;
        }

        var d = this._domain.slice();

        var i0 = 0;
        var i1 = this._domain.length - 1;
        var start = this._domain[i0];
        var stop = this._domain[i1];
        var step;

        if (stop < start) {
          _a = [stop, start], start = _a[0], stop = _a[1];
          _b = [i1, i0], i0 = _b[0], i1 = _b[1];
        }

        step = tickIncrement(start, stop, count);

        if (step > 0) {
          start = Math.floor(start / step) * step;
          stop = Math.ceil(stop / step) * step;
          step = tickIncrement(start, stop, count);
        } else if (step < 0) {
          start = Math.ceil(start * step) / step;
          stop = Math.floor(stop * step) / step;
          step = tickIncrement(start, stop, count);
        }

        if (step > 0) {
          d[i0] = Math.floor(start / step) * step;
          d[i1] = Math.ceil(stop / step) * step;
          this.domain(d);
        } else if (step < 0) {
          d[i0] = Math.ceil(start * step) / step;
          d[i1] = Math.floor(stop * step) / step;
          this.domain(d);
        }

        return this;
      };

      D3Linear.prototype.ticks = function (count) {
        if (count === void 0) {
          count = DEFAULT_COUNT;
        }

        return d3ArrayTicks(this._domain[0], this._domain[this._domain.length - 1], count || DEFAULT_COUNT);
      };

      return D3Linear;
    }();

    function d3ArrayTicks(start, stop, count) {
      var reverse;
      var i = -1;
      var n;
      var ticks;
      var step;
      stop = +stop, start = +start, count = +count;

      if (start === stop && count > 0) {
        return [start];
      } // tslint:disable-next-line


      if (reverse = stop < start) {
        n = start, start = stop, stop = n;
      } // tslint:disable-next-line


      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) {
        return [];
      }

      if (step > 0) {
        start = Math.ceil(start / step);
        stop = Math.floor(stop / step);
        ticks = new Array(n = Math.ceil(stop - start + 1));

        while (++i < n) {
          ticks[i] = (start + i) * step;
        }
      } else {
        start = Math.floor(start * step);
        stop = Math.ceil(stop * step);
        ticks = new Array(n = Math.ceil(start - stop + 1));

        while (++i < n) {
          ticks[i] = (start - i) / step;
        }
      }

      if (reverse) {
        ticks.reverse();
      }

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count);
      var power = Math.floor(Math.log(step) / Math.LN10);
      var error = step / Math.pow(10, power);
      return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function snapMultiple(v, base, snapType) {
      var div;

      if (snapType === 'ceil') {
        div = Math.ceil(v / base);
      } else if (snapType === 'floor') {
        div = Math.floor(v / base);
      } else {
        div = Math.round(v / base);
      }

      return div * base;
    }

    function intervalTicks(min, max, interval) {
      // 变成 interval 的倍数
      var minTick = snapMultiple(min, interval, 'floor');
      var maxTick = snapMultiple(max, interval, 'ceil'); // 统一小数位数

      minTick = fixedBase(minTick, interval);
      maxTick = fixedBase(maxTick, interval);
      var ticks = [];

      for (var i = minTick; i <= maxTick; i = i + interval) {
        var tickValue = fixedBase(i, interval); // 防止浮点数加法出现问题

        ticks.push(tickValue);
      }

      return {
        min: minTick,
        max: maxTick,
        ticks: ticks
      };
    }

    /**
     * 按照给定的 minLimit/maxLimit/tickCount 均匀计算出刻度 ticks
     *
     * @param cfg Scale 配置项
     * @return ticks
     */

    function strictLimit(cfg, defaultMin, defaultMax) {
      var _a;

      var minLimit = cfg.minLimit,
          maxLimit = cfg.maxLimit,
          min = cfg.min,
          max = cfg.max,
          _b = cfg.tickCount,
          tickCount = _b === void 0 ? 5 : _b;
      var tickMin = isNil(minLimit) ? isNil(defaultMin) ? min : defaultMin : minLimit;
      var tickMax = isNil(maxLimit) ? isNil(defaultMax) ? max : defaultMax : maxLimit;

      if (tickMin > tickMax) {
        _a = [tickMin, tickMax], tickMax = _a[0], tickMin = _a[1];
      }

      if (tickCount <= 2) {
        return [tickMin, tickMax];
      }

      var step = (tickMax - tickMin) / (tickCount - 1);
      var ticks = [];

      for (var i = 0; i < tickCount; i++) {
        ticks.push(tickMin + step * i);
      }

      return ticks;
    }

    function d3LinearTickMethod(cfg) {
      var min = cfg.min,
          max = cfg.max,
          tickInterval = cfg.tickInterval,
          minLimit = cfg.minLimit,
          maxLimit = cfg.maxLimit;
      var ticks = d3Linear(cfg);

      if (!isNil(minLimit) || !isNil(maxLimit)) {
        return strictLimit(cfg, head(ticks), last(ticks));
      }

      if (tickInterval) {
        return intervalTicks(min, max, tickInterval).ticks;
      }

      return ticks;
    }

    /**
     * 计算线性的 ticks，使用 wilkinson extended 方法
     * @param cfg 度量的配置项
     * @returns 计算后的 ticks
     */

    function linear(cfg) {
      var min = cfg.min,
          max = cfg.max,
          tickCount = cfg.tickCount,
          nice = cfg.nice,
          tickInterval = cfg.tickInterval,
          minLimit = cfg.minLimit,
          maxLimit = cfg.maxLimit;
      var ticks = extended(min, max, tickCount, nice).ticks;

      if (!isNil(minLimit) || !isNil(maxLimit)) {
        return strictLimit(cfg, head(ticks), last(ticks));
      }

      if (tickInterval) {
        return intervalTicks(min, max, tickInterval).ticks;
      }

      return ticks;
    }

    /**
     * 计算 log 的 ticks，考虑 min = 0 的场景
     * @param cfg 度量的配置项
     * @returns 计算后的 ticks
     */

    function calculateLogTicks(cfg) {
      var base = cfg.base,
          tickCount = cfg.tickCount,
          min = cfg.min,
          max = cfg.max,
          values = cfg.values;
      var minTick;
      var maxTick = log(base, max);

      if (min > 0) {
        minTick = Math.floor(log(base, min));
      } else {
        var positiveMin = getLogPositiveMin(values, base, max);
        minTick = Math.floor(log(base, positiveMin));
      }

      var count = maxTick - minTick;
      var avg = Math.ceil(count / tickCount);
      var ticks = [];

      for (var i = minTick; i < maxTick + avg; i = i + avg) {
        ticks.push(Math.pow(base, i));
      }

      if (min <= 0) {
        // 最小值 <= 0 时显示 0
        ticks.unshift(0);
      }

      return ticks;
    }

    function pretty(min, max, n) {
      if (n === void 0) {
        n = 5;
      }

      var res = {
        max: 0,
        min: 0,
        ticks: []
      };

      if (min === max) {
        return {
          max: max,
          min: min,
          ticks: [min]
        };
      }
      /*
        R pretty:
        https://svn.r-project.org/R/trunk/src/appl/pretty.c
        https://www.rdocumentation.org/packages/base/versions/3.5.2/topics/pretty
        */


      var h = 1.5; // high.u.bias

      var h5 = 0.5 + 1.5 * h; // u5.bias
      // 反正我也不会调参，跳过所有判断步骤

      var d = max - min;
      var c = d / n; // 当d非常小的时候触发，但似乎没什么用
      // const min_n = Math.floor(n / 3);
      // const shrink_sml = Math.pow(2, 5);
      // if (Math.log10(d) < -2) {
      //   c = (_.max([ Math.abs(max), Math.abs(min) ]) * shrink_sml) / min_n;
      // }

      var base = Math.pow(10, Math.floor(Math.log10(c)));
      var toFixed = base < 1 ? Math.ceil(Math.abs(Math.log10(base))) : 0;
      var unit = base;

      if (2 * base - c < h * (c - unit)) {
        unit = 2 * base;

        if (5 * base - c < h5 * (c - unit)) {
          unit = 5 * base;

          if (10 * base - c < h * (c - unit)) {
            unit = 10 * base;
          }
        }
      }

      var nu = Math.ceil(max / unit);
      var ns = Math.floor(min / unit);
      res.max = Math.max(nu * unit, max);
      res.min = Math.min(ns * unit, min);
      var x = Number.parseFloat((ns * unit).toFixed(toFixed));

      while (x < max) {
        res.ticks.push(x);
        x += unit;

        if (toFixed) {
          x = Number.parseFloat(x.toFixed(toFixed));
        }
      }

      res.ticks.push(x);
      return res;
    }

    /**
     * 计算 Pow 的 ticks
     * @param cfg 度量的配置项
     * @returns 计算后的 ticks
     */

    function calculatePowTicks(cfg) {
      var exponent = cfg.exponent,
          tickCount = cfg.tickCount;
      var max = Math.ceil(calBase(exponent, cfg.max));
      var min = Math.floor(calBase(exponent, cfg.min));
      var ticks = pretty(min, max, tickCount).ticks;
      return ticks.map(function (tick) {
        var factor = tick >= 0 ? 1 : -1;
        return Math.pow(tick, exponent) * factor;
      });
    }

    /**
     * 计算几分位 https://github.com/simple-statistics/simple-statistics/blob/master/src/quantile_sorted.js
     * @param x  数组
     * @param p  百分比
     */
    function quantileSorted(x, p) {
      var idx = x.length * p;
      /*if (x.length === 0) { // 当前场景这些条件不可能命中
        throw new Error('quantile requires at least one value.');
      } else if (p < 0 || p > 1) {
        throw new Error('quantiles must be between 0 and 1');
      } else */

      if (p === 1) {
        // If p is 1, directly return the last element
        return x[x.length - 1];
      } else if (p === 0) {
        // If p is 0, directly return the first element
        return x[0];
      } else if (idx % 1 !== 0) {
        // If p is not integer, return the next element in array
        return x[Math.ceil(idx) - 1];
      } else if (x.length % 2 === 0) {
        // If the list has even-length, we'll take the average of this number
        // and the next value, if there is one
        return (x[idx - 1] + x[idx]) / 2;
      } else {
        // Finally, in the simple case of an integer value
        // with an odd-length list, return the x value at the index.
        return x[idx];
      }
    }

    function calculateTicks(cfg) {
      var tickCount = cfg.tickCount,
          values = cfg.values;

      if (!values || !values.length) {
        return [];
      }

      var sorted = values.slice().sort(function (a, b) {
        return a - b;
      });
      var ticks = [];

      for (var i = 0; i < tickCount; i++) {
        var p = i / (tickCount - 1);
        ticks.push(quantileSorted(sorted, p));
      }

      return ticks;
    }

    /**
     * 计算线性的 ticks，使用 R's pretty 方法
     * @param cfg 度量的配置项
     * @returns 计算后的 ticks
     */

    function linearPretty(cfg) {
      var min = cfg.min,
          max = cfg.max,
          tickCount = cfg.tickCount,
          tickInterval = cfg.tickInterval,
          minLimit = cfg.minLimit,
          maxLimit = cfg.maxLimit;
      var ticks = pretty(min, max, tickCount).ticks;

      if (!isNil(minLimit) || !isNil(maxLimit)) {
        return strictLimit(cfg, head(ticks), last(ticks));
      }

      if (tickInterval) {
        return intervalTicks(min, max, tickInterval).ticks;
      }

      return ticks;
    }

    function calculateTimeTicks(cfg) {
      var min = cfg.min,
          max = cfg.max,
          minTickInterval = cfg.minTickInterval;
      var tickInterval = cfg.tickInterval;
      var tickCount = cfg.tickCount; // 指定 tickInterval 后 tickCount 不生效，需要重新计算

      if (tickInterval) {
        tickCount = Math.ceil((max - min) / tickInterval);
      } else {
        tickInterval = getTickInterval(min, max, tickCount)[1];
        var count = (max - min) / tickInterval;
        var ratio = count / tickCount;

        if (ratio > 1) {
          tickInterval = tickInterval * Math.ceil(ratio);
        } // 如果设置了最小间距，则使用最小间距


        if (minTickInterval && tickInterval < minTickInterval) {
          tickInterval = minTickInterval;
        }
      }

      var ticks = [];

      for (var i = min; i < max + tickInterval; i += tickInterval) {
        ticks.push(i);
      }

      return ticks;
    }

    /**
     * 计算时间分类的 ticks, 保头，保尾
     * @param cfg 度量的配置项
     * @returns 计算后的 ticks
     */

    function calculateTimeCatTicks(cfg) {
      var ticks = calculateCatTicks(cfg);
      var lastValue = last(cfg.values);

      if (lastValue !== last(ticks)) {
        ticks.push(lastValue);
      }

      return ticks;
    }

    function getYear(date) {
      return new Date(date).getFullYear();
    }

    function createYear(year) {
      return new Date(year, 0, 1).getTime();
    }

    function getMonth(date) {
      return new Date(date).getMonth();
    }

    function diffMonth(min, max) {
      var minYear = getYear(min);
      var maxYear = getYear(max);
      var minMonth = getMonth(min);
      var maxMonth = getMonth(max);
      return (maxYear - minYear) * 12 + (maxMonth - minMonth) % 12;
    }

    function creatMonth(year, month) {
      return new Date(year, month, 1).getTime();
    }

    function diffDay(min, max) {
      return Math.ceil((max - min) / DAY);
    }

    function diffHour(min, max) {
      return Math.ceil((max - min) / HOUR);
    }

    function diffMinus(min, max) {
      return Math.ceil((max - min) / (60 * 1000));
    }
    /**
     * 计算 time 的 ticks，对 month, year 进行 pretty 处理
     * @param cfg 度量的配置项
     * @returns 计算后的 ticks
     */


    function timePretty(cfg) {
      var min = cfg.min,
          max = cfg.max,
          minTickInterval = cfg.minTickInterval,
          tickCount = cfg.tickCount;
      var tickInterval = cfg.tickInterval;
      var ticks = []; // 指定 tickInterval 后 tickCount 不生效，需要重新计算

      if (!tickInterval) {
        tickInterval = (max - min) / tickCount; // 如果设置了最小间距，则使用最小间距

        if (minTickInterval && tickInterval < minTickInterval) {
          tickInterval = minTickInterval;
        }
      }

      var minYear = getYear(min); // 如果间距大于 1 年，则将开始日期从整年开始

      if (tickInterval > YEAR) {
        var maxYear = getYear(max);
        var yearInterval = Math.ceil(tickInterval / YEAR);

        for (var i = minYear; i <= maxYear + yearInterval; i = i + yearInterval) {
          ticks.push(createYear(i));
        }
      } else if (tickInterval > MONTH) {
        // 大于月时
        var monthInterval = Math.ceil(tickInterval / MONTH);
        var mmMoth = getMonth(min);
        var dMonths = diffMonth(min, max);

        for (var i = 0; i <= dMonths + monthInterval; i = i + monthInterval) {
          ticks.push(creatMonth(minYear, i + mmMoth));
        }
      } else if (tickInterval > DAY) {
        // 大于天
        var date = new Date(min);
        var year = date.getFullYear();
        var month = date.getMonth();
        var mday = date.getDate();
        var day = Math.ceil(tickInterval / DAY);
        var ddays = diffDay(min, max);

        for (var i = 0; i < ddays + day; i = i + day) {
          ticks.push(new Date(year, month, mday + i).getTime());
        }
      } else if (tickInterval > HOUR) {
        // 大于小时
        var date = new Date(min);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var hours = Math.ceil(tickInterval / HOUR);
        var dHours = diffHour(min, max);

        for (var i = 0; i <= dHours + hours; i = i + hours) {
          ticks.push(new Date(year, month, day, hour + i).getTime());
        }
      } else if (tickInterval > MINUTE) {
        // 大于分钟
        var dMinus = diffMinus(min, max);
        var minutes = Math.ceil(tickInterval / MINUTE);

        for (var i = 0; i <= dMinus + minutes; i = i + minutes) {
          ticks.push(min + i * MINUTE);
        }
      } else {
        // 小于分钟
        var interval = tickInterval;

        if (interval < SECOND) {
          interval = SECOND;
        }

        var minSecond = Math.floor(min / SECOND) * SECOND;
        var dSeconds = Math.ceil((max - min) / SECOND);
        var seconds = Math.ceil(interval / SECOND);

        for (var i = 0; i < dSeconds + seconds; i = i + seconds) {
          ticks.push(minSecond + i * SECOND);
        }
      } // 最好是能从算法能解决这个问题，但是如果指定了 tickInterval，计算 ticks，也只能这么算，所以
      // 打印警告提示


      if (ticks.length >= 512) {
        console.warn("Notice: current ticks length(" + ticks.length + ") >= 512, may cause performance issues, even out of memory. Because of the configure \"tickInterval\"(in milliseconds, current is " + tickInterval + ") is too small, increase the value to solve the problem!");
      }

      return ticks;
    }

    registerTickMethod('cat', calculateCatTicks);
    registerTickMethod('time-cat', calculateTimeCatTicks);
    registerTickMethod('wilkinson-extended', linear);
    registerTickMethod('r-pretty', linearPretty);
    registerTickMethod('time', calculateTimeTicks);
    registerTickMethod('time-pretty', timePretty);
    registerTickMethod('log', calculateLogTicks);
    registerTickMethod('pow', calculatePowTicks);
    registerTickMethod('quantile', calculateTicks);
    registerTickMethod('d3-linear', d3LinearTickMethod);

    registerClass('cat', Category);
    registerClass('category', Category);
    registerClass('identity', Identity);
    registerClass('linear', Linear);
    registerClass('log', Log);
    registerClass('pow', Pow);
    registerClass('time', Time);
    registerClass('timeCat', TimeCat);
    registerClass('quantize', Quantize);
    registerClass('quantile', Quantile);

    // cat平均算法，保头保尾
    var CatTick = (function (cfg) {
      var values = cfg.values,
          tickCount = cfg.tickCount;

      if (!tickCount) {
        return values;
      }

      if (values.length <= 1) {
        return values;
      } // 获取间隔步长, 最小是1


      var step = parseInt(values.length / (tickCount - 1)) || 1;
      var ticks = []; // 按间隔数取对应节点

      for (var index = 0; index < values.length; index = index + step) {
        ticks.push(values[index]);
      }

      var last = values[values.length - 1]; // 如果最后一个tick不等于原数据的最后一个

      if (ticks[ticks.length - 1] !== last) {
        if (ticks.length >= tickCount) {
          // 如果当前的tick个数满足要求
          ticks[ticks.length - 1] = last;
        } else {
          // 不满足tickCount则直接加入最后一个
          ticks.push(last);
        }
      }

      return ticks;
    });

    // 认为是nice的刻度
    var SNAP_COUNT_ARRAY = [1, 1.2, 1.5, 2, 2.2, 2.4, 2.5, 3, 4, 5, 6, 7.5, 8, 10];
    var DEFAULT_COUNT$1 = 5; // 默认刻度值

    var LinearTick = (function (cfg) {
      var _ref = cfg || {},
          tickCount = _ref.tickCount,
          tickInterval = _ref.tickInterval;

      var _ref2 = cfg || {},
          min = _ref2.min,
          max = _ref2.max;

      min = isNaN(min) ? 0 : min;
      max = isNaN(max) ? 0 : max;
      var count = tickCount && tickCount >= 2 ? tickCount : DEFAULT_COUNT$1; // 计算interval， 优先取tickInterval

      var interval = tickInterval || getBestInterval({
        tickCount: count,
        max: max,
        min: min
      }); // 通过interval计算最小tick

      var minTick = Math.floor(min / interval) * interval; // 如果指定了tickInterval, count 需要根据指定的tickInterval来算计

      if (tickInterval) {
        var intervalCount = Math.abs(Math.ceil((max - minTick) / tickInterval)) + 1; // tickCount 作为最小 count 处理

        count = Math.max(count, intervalCount);
      }

      var ticks = [];
      var tickLength = 0;
      var fixedLength = getFixedLength(interval);

      while (tickLength < count) {
        ticks.push(toFixed(minTick + tickLength * interval, fixedLength));
        tickLength++;
      }

      return ticks;
    });
    var DECIMAL_LENGTH = 12;

    function getFactor(number) {
      // 取正数
      number = Math.abs(number);
      var factor = 1;

      if (number === 0) {
        return factor;
      } // 小于1,逐渐放大


      if (number < 1) {
        var count = 0;

        while (number < 1) {
          factor = factor / 10;
          number = number * 10;
          count++;
        } // 浮点数计算出现问题


        if (factor.toString().length > DECIMAL_LENGTH) {
          factor = parseFloat(factor.toFixed(count));
        }

        return factor;
      } // 大于10逐渐缩小


      while (number > 10) {
        factor = factor * 10;
        number = number / 10;
      }

      return factor;
    } // 获取最佳匹配刻度


    function getBestInterval(_ref3) {
      var tickCount = _ref3.tickCount,
          min = _ref3.min,
          max = _ref3.max;

      // 如果最大最小相等，则直接按1处理
      if (min === max) {
        return 1 * getFactor(max);
      } // 1.计算平均刻度间隔


      var avgInterval = (max - min) / (tickCount - 1); // 2.数据标准归一化 映射到[1-10]区间

      var factor = getFactor(avgInterval);
      var calInterval = avgInterval / factor;
      var calMax = max / factor;
      var calMin = min / factor; // 根据平均值推算最逼近刻度值

      var similarityIndex = 0;

      for (var index = 0; index < SNAP_COUNT_ARRAY.length; index++) {
        var item = SNAP_COUNT_ARRAY[index];

        if (calInterval <= item) {
          similarityIndex = index;
          break;
        }
      }

      var similarityInterval = getInterval(similarityIndex, tickCount, calMin, calMax); // 小数点位数还原到数据的位数, 因为similarityIndex有可能是小数，所以需要保留similarityIndex自己的小数位数

      var fixedLength = getFixedLength(similarityInterval) + getFixedLength(factor);
      return toFixed(similarityInterval * factor, fixedLength);
    }

    function getInterval(startIndex, tickCount, min, max) {
      var verify = false;
      var interval = SNAP_COUNT_ARRAY[startIndex]; // 刻度值校验，如果不满足，循环下去

      for (var i = startIndex; i < SNAP_COUNT_ARRAY.length; i++) {
        if (intervalIsVerify({
          interval: SNAP_COUNT_ARRAY[i],
          tickCount: tickCount,
          max: max,
          min: min
        })) {
          // 有符合条件的interval
          interval = SNAP_COUNT_ARRAY[i];
          verify = true;
          break;
        }
      } // 如果不满足, 依次缩小10倍，再计算


      if (!verify) {
        return 10 * getInterval(0, tickCount, min / 10, max / 10);
      }

      return interval;
    } // 刻度是否满足展示需求


    function intervalIsVerify(_ref4) {
      var interval = _ref4.interval,
          tickCount = _ref4.tickCount,
          max = _ref4.max,
          min = _ref4.min;
      var minTick = Math.floor(min / interval) * interval;

      if (minTick + (tickCount - 1) * interval >= max) {
        return true;
      }

      return false;
    } // 计算小数点应该保留的位数


    function getFixedLength(num) {
      var str = num.toString();
      var index = str.indexOf('.');
      var indexOfExp = str.indexOf('e-');
      var length = indexOfExp >= 0 ? parseInt(str.substr(indexOfExp + 2), 10) : str.substr(index + 1).length;

      if (length > 20) {
        // 最多保留20位小数
        length = 20;
      }

      return length;
    } // @antv/util fixedbase不支持科学计数法的判断，需要提mr


    function toFixed(v, length) {
      return parseFloat(v.toFixed(length));
    }

    var Linear$1 = getClass('linear');
    var Identity$1 = getClass('identity');
    var Category$1 = getClass('category');
    var TimeCat$1 = getClass('timeCat'); // 覆盖0.3.x的 cat 方法

    registerTickMethod('cat', CatTick);
    registerTickMethod('time-cat', CatTick); // 覆盖linear 度量的tick算法

    registerTickMethod('wilkinson-extended', LinearTick);
    Scale.Linear = Linear$1;
    Scale.Identity = Identity$1;
    Scale.Category = Category$1;
    Scale.Cat = Category$1;
    Scale.TimeCat = TimeCat$1;

    function isFullCircle(coord) {
      if (!coord.isPolar) {
        return false;
      }

      var startAngle = coord.startAngle;
      var endAngle = coord.endAngle;

      if (!isNil(startAngle) && !isNil(endAngle) && endAngle - startAngle < Math.PI * 2) {
        return false;
      }

      return true;
    }

    function clearObj(obj) {
      Object.keys(obj).forEach(function (key) {
        delete obj[key];
      });
    }

    var ScaleController = /*#__PURE__*/function () {
      function ScaleController(cfg) {
        // defs 列定义
        this.defs = {}; // 已经实例化的scale

        this.scales = {};
        mix(this, cfg);
      }

      var _proto = ScaleController.prototype;

      _proto.setFieldDef = function setFieldDef(field, cfg) {
        var defs = this.defs;

        if (isObject(field)) {
          mix(defs, field);
        } else {
          defs[field] = cfg;
        } // 因为可能同时变更多个scale，所以要把所有已实例化的scale都更新下


        this.updateScales();
      };

      _proto._getDef = function _getDef(field) {
        var defs = this.defs;
        var def = null;

        if (Global.scales[field] || defs[field]) {
          def = mix({}, Global.scales[field]);
          each(defs[field], function (v, k) {
            if (isNil(v)) {
              delete def[k];
            } else {
              def[k] = v;
            }
          });
        }

        return def;
      };

      _proto._getDefaultType = function _getDefaultType(field, data, def) {
        if (def && def.type) {
          return def.type;
        }

        var type = 'linear';
        var value = firstValue(data, field);

        if (isArray(value)) {
          value = value[0];
        }

        if (isString(value)) {
          type = 'cat';
        }

        return type;
      };

      _proto._getScaleDef = function _getScaleDef(type, field, data, def) {
        var values$1;

        if (def && def.values) {
          values$1 = def.values;
        } else {
          values$1 = values(data, field);
        }

        var cfg = {
          field: field,
          values: values$1
        };

        if (type !== 'cat' && type !== 'timeCat') {
          if (!def || !(def.min && def.max)) {
            var _Array$getRange = getRange$1(values$1),
                min = _Array$getRange.min,
                max = _Array$getRange.max;

            cfg.min = min;
            cfg.max = max;
            cfg.nice = true;
          }
        } else {
          cfg.isRounding = false; // used for tickCount calculation
        }

        return cfg;
      } // 调整range，为了让图形居中
      ;

      _proto._adjustRange = function _adjustRange(type, cfg) {
        var range = cfg.range,
            values = cfg.values; // 如果是线性, 或者有自定义range都不处理

        if (type === 'linear' || range || !values) {
          return cfg;
        }

        var count = values.length; // 单只有一条数据时，在中间显示

        if (count === 1) {
          cfg.range = [0.5, 1];
        } else {
          var chart = this.chart;
          var coord = chart.get('coord');
          var widthRatio = Global.widthRatio.multiplePie;
          var offset = 0;

          if (isFullCircle(coord)) {
            if (!coord.transposed) {
              cfg.range = [0, 1 - 1 / count];
            } else {
              offset = 1 / count * widthRatio;
              cfg.range = [offset / 2, 1 - offset / 2];
            }
          } else {
            // 为了让图形居中，所以才设置range
            offset = 1 / count * 0.5; // 这里可能用0.25会更合理

            cfg.range = [offset, 1 - offset];
          }
        }

        return cfg;
      };

      _proto._getScaleCfg = function _getScaleCfg(field, data) {
        var self = this;

        var def = self._getDef(field);

        if (!data || !data.length) {
          if (def && def.type) {
            def.field = field;
            return {
              type: def.type,
              cfg: def
            };
          }

          return {
            type: 'identity',
            cfg: {
              value: field,
              field: field.toString(),
              values: [field]
            }
          };
        }

        var firstObj = data[0];
        var firstValue$1 = firstObj[field];

        if (firstValue$1 === null) {
          firstValue$1 = firstValue(data, field);
        }

        if (isNumber(field) || isNil(firstValue$1) && !def) {
          return {
            type: 'identity',
            cfg: {
              value: field,
              field: field.toString(),
              values: [field]
            }
          };
        }

        var type = self._getDefaultType(field, data, def);

        var cfg = self._getScaleDef(type, field, data, def);

        def && mix(cfg, def);
        cfg = this._adjustRange(type, cfg);
        return {
          type: type,
          cfg: cfg
        };
      };

      _proto.createScale = function createScale(field, data) {
        var scales = this.scales;

        var _this$_getScaleCfg = this._getScaleCfg(field, data),
            type = _this$_getScaleCfg.type,
            cfg = _this$_getScaleCfg.cfg;

        var scale = scales[field]; // 如果已经存在，且类型相等时直接返回

        if (scale && scale.type === type) {
          scale.change(cfg);
          return scale;
        }

        var Scale = getClass(type);
        var newScale = new Scale(cfg);
        scales[field] = newScale;
        return newScale;
      };

      _proto._updateScale = function _updateScale(scale) {
        var field = scale.field; // 因为每个field的数据都会不同

        var data = this.chart._getScaleData(field);

        var _this$_getScaleCfg2 = this._getScaleCfg(field, data),
            cfg = _this$_getScaleCfg2.cfg;

        scale.change(cfg);
      };

      _proto.updateScales = function updateScales() {
        var _this = this;

        var scales = this.scales; // 修改完列定义后，需要更新已经实例化的scale
        // 如果是还没有实例化的，在geom初始化的时候会被实例化，所以这里可以不用更新

        each(scales, function (scale) {
          _this._updateScale(scale);
        });
      } // 调整scale从0开始
      ;

      _proto.adjustStartZero = function adjustStartZero(scale) {
        var defs = this.defs;
        var field = scale.field,
            min = scale.min,
            max = scale.max; // 如果有定义，则不处理

        if (defs[field] && defs[field].min) {
          return;
        }

        if (min > 0) {
          scale.change({
            min: 0
          });
        } else if (max < 0) {
          scale.change({
            max: 0
          });
        }
      };

      _proto.clear = function clear() {
        // this.defs = {};
        // this.scales = {};
        clearObj(this.defs);
        clearObj(this.scales);
        this.data = null;
      };

      return ScaleController;
    }();

    var Abastract = /*#__PURE__*/function () {
      var _proto = Abastract.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        /**
         * ticks
         * @type {Array}
         */
        this.ticks = [];
        /**
         * the configuration for tickLine
         * @type {Object}
         */

        this.tickLine = {};
        /**
         * the direction of ticks, 1 means clockwise
         * @type {Number}
         */

        this.offsetFactor = 1;
        /**
         * the top container
         * @type {container}
         */

        this.frontContainer = null;
        /**
         * the back container
         * @type {[type]}
         */

        this.backContainer = null;
        /**
         * points for draw grid line
         * @type {Array}
         */

        this.gridPoints = [];
      };

      function Abastract(cfg) {
        this._initDefaultCfg();

        mix(this, cfg);
        this.draw();
      }

      _proto.draw = function draw() {
        var line = this.line,
            tickLine = this.tickLine,
            label = this.label,
            grid = this.grid;
        grid && this.drawGrid(grid); // draw the grid lines

        tickLine && this.drawTicks(tickLine); // draw the tickLine

        line && this.drawLine(line); // draw axis line

        label && this.drawLabels(); // draw ticks
      };

      _proto.drawTicks = function drawTicks(tickCfg) {
        var self = this;
        var ticks = self.ticks;
        var length = tickCfg.length;
        var container = self.getContainer(tickCfg.top);
        each(ticks, function (tick) {
          var start = self.getOffsetPoint(tick.value);
          var end = self.getSidePoint(start, length);
          var shape = container.addShape('line', {
            className: 'axis-tick',
            attrs: mix({
              x1: start.x,
              y1: start.y,
              x2: end.x,
              y2: end.y
            }, tickCfg)
          });
          shape._id = self._id + '-ticks';
        });
      };

      _proto.drawLabels = function drawLabels() {
        var self = this;
        var labelOffset = self.labelOffset;
        var labels = self.labels;
        each(labels, function (labelShape) {
          var container = self.getContainer(labelShape.get('top'));
          var start = self.getOffsetPoint(labelShape.get('value'));

          var _self$getSidePoint = self.getSidePoint(start, labelOffset),
              x = _self$getSidePoint.x,
              y = _self$getSidePoint.y;

          labelShape.attr(mix({
            x: x,
            y: y
          }, self.getTextAlignInfo(start, labelOffset), labelShape.get('textStyle')));
          labelShape._id = self._id + '-' + labelShape.attr('text');
          container.add(labelShape);
        });
      };

      _proto.drawLine = function drawLine() {};

      _proto.drawGrid = function drawGrid(grid) {
        var self = this;
        var gridPoints = self.gridPoints,
            ticks = self.ticks;
        var gridCfg = grid;
        var count = gridPoints.length;
        each(gridPoints, function (subPoints, index) {
          if (isFunction(grid)) {
            var tick = ticks[index] || {};
            var executedGrid = grid(tick.text, index, count);
            gridCfg = executedGrid ? mix({}, Global._defaultAxis.grid, executedGrid) : null;
          }

          if (gridCfg) {
            var type = gridCfg.type; // has two types: 'line' and 'arc'

            var points = subPoints.points;
            var container = self.getContainer(gridCfg.top);
            var shape;

            if (type === 'arc') {
              var center = self.center,
                  startAngle = self.startAngle,
                  endAngle = self.endAngle;
              var radius = Vector2.length([points[0].x - center.x, points[0].y - center.y]);
              shape = container.addShape('Arc', {
                className: 'axis-grid',
                attrs: mix({
                  x: center.x,
                  y: center.y,
                  startAngle: startAngle,
                  endAngle: endAngle,
                  r: radius
                }, gridCfg)
              });
            } else {
              shape = container.addShape('Polyline', {
                className: 'axis-grid',
                attrs: mix({
                  points: points
                }, gridCfg)
              });
            }

            shape._id = subPoints._id;
          }
        });
      };

      _proto.getOffsetPoint = function getOffsetPoint() {};

      _proto.getAxisVector = function getAxisVector() {};

      _proto.getOffsetVector = function getOffsetVector(point, offset) {
        var self = this;
        var axisVector = self.getAxisVector(point);
        var normal = Vector2.normalize([], axisVector);
        var factor = self.offsetFactor;
        var verticalVector = [normal[1] * -1 * factor, normal[0] * factor];
        return Vector2.scale([], verticalVector, offset);
      };

      _proto.getSidePoint = function getSidePoint(point, offset) {
        var self = this;
        var offsetVector = self.getOffsetVector(point, offset);
        return {
          x: point.x + offsetVector[0],
          y: point.y + offsetVector[1]
        };
      };

      _proto.getTextAlignInfo = function getTextAlignInfo(point, offset) {
        var self = this;
        var offsetVector = self.getOffsetVector(point, offset);
        var align;
        var baseLine;

        if (offsetVector[0] > 0) {
          align = 'left';
        } else if (offsetVector[0] < 0) {
          align = 'right';
        } else {
          align = 'center';
        }

        if (offsetVector[1] > 0) {
          baseLine = 'top';
        } else if (offsetVector[1] < 0) {
          baseLine = 'bottom';
        } else {
          baseLine = 'middle';
        }

        return {
          textAlign: align,
          textBaseline: baseLine
        };
      };

      _proto.getContainer = function getContainer(isTop) {
        var frontContainer = this.frontContainer,
            backContainer = this.backContainer;
        return isTop ? frontContainer : backContainer;
      };

      return Abastract;
    }();

    var Line = /*#__PURE__*/function (_Abstract) {
      _inheritsLoose(Line, _Abstract);

      function Line() {
        return _Abstract.apply(this, arguments) || this;
      }

      var _proto = Line.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        _Abstract.prototype._initDefaultCfg.call(this);

        this.start = null;
        this.end = null;
      };

      _proto.getOffsetPoint = function getOffsetPoint(value) {
        var start = this.start,
            end = this.end;
        return {
          x: start.x + (end.x - start.x) * value,
          y: start.y + (end.y - start.y) * value
        };
      };

      _proto.getAxisVector = function getAxisVector() {
        var start = this.start,
            end = this.end;
        return [end.x - start.x, end.y - start.y];
      };

      _proto.drawLine = function drawLine(lineCfg) {
        var container = this.getContainer(lineCfg.top);
        var start = this.start,
            end = this.end;
        container.addShape('line', {
          className: 'axis-line',
          attrs: mix({
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y
          }, lineCfg)
        });
      };

      return Line;
    }(Abastract);

    Abastract.Line = Line;

    function formatTicks(ticks) {
      var tmp = ticks.slice(0);

      if (tmp.length > 0) {
        var first = tmp[0];
        var last = tmp[tmp.length - 1];

        if (first.value !== 0) {
          tmp.unshift({
            value: 0
          });
        }

        if (last.value !== 1) {
          tmp.push({
            value: 1
          });
        }
      }

      return tmp;
    }

    var AxisController = /*#__PURE__*/function () {
      function AxisController(cfg) {
        this.axisCfg = {};
        this.frontPlot = null;
        this.backPlot = null;
        this.axes = {}; // store the axes's options

        mix(this, cfg);
      }

      var _proto = AxisController.prototype;

      _proto._isHide = function _isHide(field) {
        var axisCfg = this.axisCfg;
        return !axisCfg || axisCfg[field] === false;
      };

      _proto._getLinePosition = function _getLinePosition(scale, dimType, index, transposed) {
        var position = '';
        var field = scale.field;
        var axisCfg = this.axisCfg;

        if (axisCfg[field] && axisCfg[field].position) {
          position = axisCfg[field].position;
        } else if (dimType === 'x') {
          position = transposed ? 'left' : 'bottom';
        } else if (dimType === 'y') {
          position = index ? 'right' : 'left';

          if (transposed) {
            position = 'bottom';
          }
        }

        return position;
      };

      _proto._getLineCfg = function _getLineCfg(coord, dimType, position) {
        var start;
        var end;
        var factor = 1; // Mark clockwise or counterclockwise

        if (dimType === 'x') {
          start = {
            x: 0,
            y: 0
          };
          end = {
            x: 1,
            y: 0
          };
        } else {
          if (position === 'right') {
            // there will be several y axes
            start = {
              x: 1,
              y: 0
            };
            end = {
              x: 1,
              y: 1
            };
          } else {
            start = {
              x: 0,
              y: 0
            };
            end = {
              x: 0,
              y: 1
            };
            factor = -1;
          }
        }

        if (coord.transposed) {
          factor *= -1;
        }

        return {
          offsetFactor: factor,
          start: coord.convertPoint(start),
          end: coord.convertPoint(end)
        };
      };

      _proto._getCircleCfg = function _getCircleCfg(coord) {
        return {
          startAngle: coord.startAngle,
          endAngle: coord.endAngle,
          center: coord.center,
          radius: coord.circleRadius
        };
      };

      _proto._getRadiusCfg = function _getRadiusCfg(coord) {
        var transposed = coord.transposed;
        var start;
        var end;

        if (transposed) {
          start = {
            x: 0,
            y: 0
          };
          end = {
            x: 1,
            y: 0
          };
        } else {
          start = {
            x: 0,
            y: 0
          };
          end = {
            x: 0,
            y: 1
          };
        }

        return {
          offsetFactor: -1,
          start: coord.convertPoint(start),
          end: coord.convertPoint(end)
        };
      };

      _proto._getAxisCfg = function _getAxisCfg(coord, scale, verticalScale, dimType, defaultCfg) {
        var _this = this;

        var self = this;
        var axisCfg = this.axisCfg;
        var ticks = scale.getTicks();
        var cfg = deepMix({
          ticks: ticks,
          frontContainer: this.frontPlot,
          backContainer: this.backPlot
        }, defaultCfg, axisCfg[scale.field]);
        var labels = [];
        var label = cfg.label;
        var count = ticks.length;
        var maxWidth = 0;
        var maxHeight = 0;
        var labelCfg = label;
        each(ticks, function (tick, index) {
          if (isFunction(label)) {
            var executedLabel = label(tick.text, index, count);
            labelCfg = executedLabel ? mix({}, Global._defaultAxis.label, executedLabel) : null;
          }

          if (labelCfg) {
            var textStyle = {};

            if (labelCfg.textAlign) {
              textStyle.textAlign = labelCfg.textAlign;
            }

            if (labelCfg.textBaseline) {
              textStyle.textBaseline = labelCfg.textBaseline;
            }

            var container = labelCfg.top ? _this.frontPlot : _this.backPlot;
            var axisLabel = container.addShape('text', {
              className: 'axis-label',
              aria: false,
              attrs: mix({
                x: 0,
                y: 0,
                text: tick.text,
                fontFamily: self.chart.get('canvas').get('fontFamily')
              }, labelCfg),
              value: tick.value,
              textStyle: textStyle,
              top: labelCfg.top,
              context: self.chart.get('canvas').get('context')
            });
            labels.push(axisLabel);

            var _axisLabel$getBBox = axisLabel.getBBox(),
                width = _axisLabel$getBBox.width,
                height = _axisLabel$getBBox.height;

            maxWidth = Math.max(maxWidth, width);
            maxHeight = Math.max(maxHeight, height);
          }
        });
        cfg.labels = labels;
        cfg.maxWidth = maxWidth;
        cfg.maxHeight = maxHeight;
        return cfg;
      };

      _proto._createAxis = function _createAxis(coord, scale, verticalScale, dimType, index) {
        if (index === void 0) {
          index = '';
        }

        var self = this;
        var coordType = coord.type;
        var transposed = coord.transposed;
        var type;
        var key;
        var defaultCfg;

        if (coordType === 'cartesian' || coordType === 'rect') {
          var position = self._getLinePosition(scale, dimType, index, transposed);

          defaultCfg = Global.axis[position];
          defaultCfg.position = position;
          type = 'Line';
          key = position;
        } else {
          if (dimType === 'x' && !transposed || dimType === 'y' && transposed) {
            defaultCfg = Global.axis.circle;
            type = 'Circle';
            key = 'circle';
          } else {
            defaultCfg = Global.axis.radius;
            type = 'Line';
            key = 'radius';
          }
        }

        var cfg = self._getAxisCfg(coord, scale, verticalScale, dimType, defaultCfg);

        cfg.type = type;
        cfg.dimType = dimType;
        cfg.verticalScale = verticalScale;
        cfg.index = index;
        this.axes[key] = cfg;
      };

      _proto.createAxis = function createAxis(coord, xScale, yScales) {
        var self = this;

        if (xScale && !self._isHide(xScale.field)) {
          self._createAxis(coord, xScale, yScales[0], 'x');
        }

        each(yScales, function (yScale, index) {
          if (!self._isHide(yScale.field)) {
            self._createAxis(coord, yScale, xScale, 'y', index);
          }
        });
        var axes = this.axes;
        var chart = self.chart;

        if (chart._isAutoPadding()) {
          var userPadding = parsePadding(chart.get('padding'));
          var appendPadding = parsePadding(chart.get('appendPadding'));
          var legendRange = chart.get('legendRange') || {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          };
          var padding = [userPadding[0] === 'auto' ? legendRange.top + appendPadding[0] * 2 : userPadding[0], userPadding[1] === 'auto' ? legendRange.right + appendPadding[1] : userPadding[1], userPadding[2] === 'auto' ? legendRange.bottom + appendPadding[2] : userPadding[2], userPadding[3] === 'auto' ? legendRange.left + appendPadding[3] : userPadding[3]];

          if (coord.isPolar) {
            var circleAxis = axes.circle;

            if (circleAxis) {
              var maxHeight = circleAxis.maxHeight,
                  maxWidth = circleAxis.maxWidth,
                  labelOffset = circleAxis.labelOffset;
              padding[0] += maxHeight + labelOffset;
              padding[1] += maxWidth + labelOffset;
              padding[2] += maxHeight + labelOffset;
              padding[3] += maxWidth + labelOffset;
            }
          } else {
            if (axes.right && userPadding[1] === 'auto') {
              var _axes$right = axes.right,
                  _maxWidth = _axes$right.maxWidth,
                  _labelOffset = _axes$right.labelOffset;
              padding[1] += _maxWidth + _labelOffset;
            }

            if (axes.left && userPadding[3] === 'auto') {
              var _axes$left = axes.left,
                  _maxWidth2 = _axes$left.maxWidth,
                  _labelOffset2 = _axes$left.labelOffset;
              padding[3] += _maxWidth2 + _labelOffset2;
            }

            if (axes.bottom && userPadding[2] === 'auto') {
              var _axes$bottom = axes.bottom,
                  _maxHeight = _axes$bottom.maxHeight,
                  _labelOffset3 = _axes$bottom.labelOffset;
              padding[2] += _maxHeight + _labelOffset3;
            }
          }

          chart.set('_padding', padding);

          chart._updateLayout(padding);
        }

        each(axes, function (axis) {
          var type = axis.type,
              grid = axis.grid,
              verticalScale = axis.verticalScale,
              ticks = axis.ticks,
              dimType = axis.dimType,
              position = axis.position,
              index = axis.index;
          var appendCfg;

          if (coord.isPolar) {
            if (type === 'Line') {
              appendCfg = self._getRadiusCfg(coord);
            } else if (type === 'Circle') {
              appendCfg = self._getCircleCfg(coord);
            }
          } else {
            appendCfg = self._getLineCfg(coord, dimType, position);
          }

          if (grid && verticalScale) {
            var gridPoints = [];
            var verticalTicks = formatTicks(verticalScale.getTicks());
            each(ticks, function (tick) {
              var subPoints = [];
              each(verticalTicks, function (verticalTick) {
                var x = dimType === 'x' ? tick.value : verticalTick.value;
                var y = dimType === 'x' ? verticalTick.value : tick.value;

                if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
                  var point = coord.convertPoint({
                    x: x,
                    y: y
                  });
                  subPoints.push(point);
                }
              });
              gridPoints.push({
                points: subPoints,
                _id: 'axis-' + dimType + index + '-grid-' + tick.tickValue
              });
            });
            axis.gridPoints = gridPoints;

            if (coord.isPolar) {
              axis.center = coord.center;
              axis.startAngle = coord.startAngle;
              axis.endAngle = coord.endAngle;
            }
          }

          appendCfg._id = 'axis-' + dimType;

          if (!isNil(index)) {
            appendCfg._id = 'axis-' + dimType + index;
          }

          new Abastract[type](mix(axis, appendCfg));
        });
      };

      _proto.clear = function clear() {
        this.axes = {};
        this.frontPlot.clear();
        this.backPlot.clear();
      };

      return AxisController;
    }();

    var calcDirection = function calcDirection(start, end) {
      var xDistance = end.x - start.x;
      var yDistance = end.y - start.y; // x 的距离大于y 说明是横向，否则就是纵向

      if (Math.abs(xDistance) > Math.abs(yDistance)) {
        return xDistance > 0 ? 'right' : 'left';
      }

      return yDistance > 0 ? 'down' : 'up';
    }; // 计算2点之间的距离


    var calcDistance = function calcDistance(point1, point2) {
      var xDistance = Math.abs(point2.x - point1.x);
      var yDistance = Math.abs(point2.y - point1.y);
      return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    };

    var getCenter = function getCenter(point1, point2) {
      var x = point1.x + (point2.x - point1.x) / 2;
      var y = point1.y + (point2.y - point1.y) / 2;
      return {
        x: x,
        y: y
      };
    };

    var PRESS_DELAY = 250;

    var EventController = /*#__PURE__*/function () {
      function EventController(_ref) {
        var _this = this;

        var canvas = _ref.canvas,
            el = _ref.el;

        _defineProperty(this, "_click", function (ev) {
          var points = convertPoints(ev, _this.canvas);
          ev.points = points;

          _this.emitEvent('click', ev);
        });

        _defineProperty(this, "_start", function (ev) {
          var points = convertPoints(ev, _this.canvas);

          if (!points) {
            return;
          }

          ev.points = points;

          _this.emitEvent('touchstart', ev); // 防止上次的内容没有清理掉，重新reset下


          _this.reset(); // 记录touch start 的时间


          _this.startTime = Date.now(); // 记录touch start 的点

          _this.startPoints = points;

          if (points.length > 1) {
            _this.startDistance = calcDistance(points[0], points[1]);
            _this.center = getCenter(points[0], points[1]);
          } else {
            // 如果touchstart后停顿250ms, 则也触发press事件
            _this.pressTimeout = setTimeout(function () {
              // 这里固定触发press事件
              var eventType = 'press';
              var direction = 'none';
              ev.direction = direction;

              _this.emitStart(eventType, ev);

              _this.emitEvent(eventType, ev);

              _this.eventType = eventType;
              _this.direction = direction;
            }, PRESS_DELAY);
          }
        });

        _defineProperty(this, "_move", function (ev) {
          var points = convertPoints(ev, _this.canvas);
          if (!points) return;

          _this.clearPressTimeout();

          ev.points = points;

          _this.emitEvent('touchmove', ev);

          var startPoints = _this.startPoints;
          if (!startPoints) return; // 多指触控

          if (points.length > 1) {
            // touchstart的距离
            var startDistance = _this.startDistance;
            var currentDistance = calcDistance(points[0], points[1]);
            ev.zoom = currentDistance / startDistance;
            ev.center = _this.center; // 触发缩放事件

            _this.emitStart('pinch', ev);

            _this.emitEvent('pinch', ev);
          } else {
            var deltaX = points[0].x - startPoints[0].x;
            var deltaY = points[0].y - startPoints[0].y;
            var direction = _this.direction || calcDirection(startPoints[0], points[0]);
            _this.direction = direction; // 获取press或者pan的事件类型
            // press 按住滑动, pan表示平移
            // 如果start后立刻move，则触发pan, 如果有停顿，则触发press

            var eventType = _this.getEventType(points);

            ev.direction = direction;
            ev.deltaX = deltaX;
            ev.deltaY = deltaY;

            _this.emitStart(eventType, ev);

            _this.emitEvent(eventType, ev); // 记录最后2次move的时间和坐标，为了给swipe事件用


            var prevMoveTime = _this.lastMoveTime;
            var now = Date.now(); // 最后2次的时间间隔一定要大于0，否则swipe没发计算

            if (now - prevMoveTime > 0) {
              _this.prevMoveTime = prevMoveTime;
              _this.prevMovePoints = _this.lastMovePoints;
              _this.lastMoveTime = now;
              _this.lastMovePoints = points;
            }
          }
        });

        _defineProperty(this, "_end", function (ev) {
          var points = convertPoints(ev, _this.canvas);
          ev.points = points;

          _this.emitEnd(ev);

          _this.emitEvent('touchend', ev); // swipe事件处理, 在touchend之后触发


          var lastMoveTime = _this.lastMoveTime;
          var now = Date.now(); // 做这个判断是为了最后一次touchmove后到end前，还有一个停顿的过程
          // 100 是拍的一个值，理论这个值会很短，一般不卡顿的话在10ms以内

          if (now - lastMoveTime < 100) {
            var prevMoveTime = _this.prevMoveTime || _this.startTime;
            var intervalTime = lastMoveTime - prevMoveTime; // 时间间隔一定要大于0, 否则计算没意义

            if (intervalTime > 0) {
              var prevMovePoints = _this.prevMovePoints || _this.startPoints;
              var lastMovePoints = _this.lastMovePoints; // move速率

              var velocity = calcDistance(prevMovePoints[0], lastMovePoints[0]) / intervalTime; // 0.3 是参考hammerjs的设置

              if (velocity > 0.3) {
                ev.velocity = velocity;
                ev.direction = calcDirection(prevMovePoints[0], lastMovePoints[0]);

                _this.emitEvent('swipe', ev);
              }
            }
          }

          _this.reset();

          var touches = ev.touches; // 当多指只释放了1指时也会触发end, 这时重新触发一次start

          if (touches && touches.length > 0) {
            _this._start(ev);
          }
        });

        _defineProperty(this, "_cancel", function (ev) {
          _this.emitEvent('touchcancel', ev);

          _this.reset();
        });

        // canvasEl
        this.canvas = canvas;
        this.delegateEvent(el); // 用来记录当前触发的事件

        this.processEvent = {};
      }

      var _proto = EventController.prototype;

      _proto.delegateEvent = function delegateEvent(canvasEl) {
        // 代理这几个事件
        canvasEl.addEventListener('click', this._click);
        canvasEl.addEventListener('touchstart', this._start);
        canvasEl.addEventListener('touchmove', this._move);
        canvasEl.addEventListener('touchend', this._end);
        canvasEl.addEventListener('touchcancel', this._cancel);
      };

      _proto.emitEvent = function emitEvent(type, ev) {
        var canvas = this.canvas;
        canvas.emit(type, ev);
      };

      _proto.getEventType = function getEventType(points) {
        var eventType = this.eventType,
            canvas = this.canvas,
            startTime = this.startTime,
            startPoints = this.startPoints;

        if (eventType) {
          return eventType;
        }

        var type;
        var panEventListeners = canvas.__events.pan; // 如果没有pan事件的监听，默认都是press

        if (!panEventListeners || !panEventListeners.length) {
          type = 'press';
        } else {
          // 如果有pan事件的处理，press则需要停顿250ms, 且移动距离小于10
          var now = Date.now();

          if (now - startTime > PRESS_DELAY && calcDistance(startPoints[0], points[0]) < 10) {
            type = 'press';
          } else {
            type = 'pan';
          }
        }

        this.eventType = type;
        return type;
      };

      _proto.enable = function enable(eventType) {
        this.processEvent[eventType] = true;
      } // 是否进行中的事件
      ;

      _proto.isProcess = function isProcess(eventType) {
        return this.processEvent[eventType];
      } // 触发start事件
      ;

      _proto.emitStart = function emitStart(type, ev) {
        if (this.isProcess(type)) {
          return;
        }

        this.enable(type);
        this.emitEvent(type + "start", ev);
      } // 触发end事件
      ;

      _proto.emitEnd = function emitEnd(ev) {
        var _this2 = this;

        var processEvent = this.processEvent;
        Object.keys(processEvent).forEach(function (type) {
          _this2.emitEvent(type + "end", ev);

          delete processEvent[type];
        });
      };

      _proto.clearPressTimeout = function clearPressTimeout() {
        if (this.pressTimeout) {
          clearTimeout(this.pressTimeout);
          this.pressTimeout = 0;
        }
      };

      _proto.reset = function reset() {
        this.clearPressTimeout();
        this.startTime = 0;
        this.startPoints = null;
        this.startDistance = 0;
        this.direction = null;
        this.eventType = null;
        this.pinch = false;
        this.prevMoveTime = 0;
        this.prevMovePoints = null;
        this.lastMoveTime = 0;
        this.lastMovePoints = null;
      };

      return EventController;
    }();

    var CanvasElement = /*#__PURE__*/function (_EventEmit) {
      _inheritsLoose(CanvasElement, _EventEmit);

      function CanvasElement(ctx) {
        var _this;

        _this = _EventEmit.call(this) || this;
        _this.context = ctx; // canvas实际的宽高 (width/height) * pixelRatio

        _this.width = 0;
        _this.height = 0;
        _this.style = {};
        _this.currentStyle = {};
        _this.attrs = {}; // 用来标识是CanvasElement实例

        _this.isCanvasElement = true;
        return _this;
      }

      var _proto = CanvasElement.prototype;

      _proto.getContext = function getContext()
      /* type */
      {
        return this.context;
      };

      _proto.getBoundingClientRect = function getBoundingClientRect() {
        var width = this.width;
        var height = this.height; // 默认都处理成可视窗口的顶部位置

        return {
          top: 0,
          right: width,
          bottom: height,
          left: 0
        };
      };

      _proto.setAttribute = function setAttribute(key, value) {
        this.attrs[key] = value;
      };

      _proto.addEventListener = function addEventListener(type, listener) {
        this.on(type, listener);
      };

      _proto.removeEventListener = function removeEventListener(type, listener) {
        this.off(type, listener);
      };

      _proto.dispatchEvent = function dispatchEvent(type, e) {
        this.emit(type, e);
      };

      return CanvasElement;
    }(EventEmit);

    function supportEventListener(canvas) {
      if (!canvas) {
        return false;
      } // 非 HTMLCanvasElement


      if (canvas.nodeType !== 1 || !canvas.nodeName || canvas.nodeName.toLowerCase() !== 'canvas') {
        return false;
      } // 微信小程序canvas.getContext('2d')时也是CanvasRenderingContext2D
      // 也会有ctx.canvas, 而且nodeType也是1，所以还要在看下是否支持addEventListener


      var support = false;

      try {
        canvas.addEventListener('eventTest', function () {
          support = true;
        });
        canvas.dispatchEvent(new Event('eventTest'));
      } catch (error) {
        support = false;
      }

      return support;
    }

    var CanvasElement$1 = {
      create: function create(ctx) {
        if (!ctx) {
          return null;
        }

        if (supportEventListener(ctx.canvas)) {
          return ctx.canvas;
        }

        return new CanvasElement(ctx);
      }
    };

    function _mod(n, m) {
      return (n % m + m) % m;
    }

    function _addStop(steps, gradient) {
      each(steps, function (item) {
        item = item.split(':');
        gradient.addColorStop(Number(item[0]), item[1]);
      });
    } // the string format: 'l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'


    function _parseLineGradient(color, shape, context) {
      var arr = color.split(' ');
      var angle = arr[0].slice(2, arr[0].length - 1);
      angle = _mod(parseFloat(angle) * Math.PI / 180, Math.PI * 2);
      var steps = arr.slice(1);

      var _shape$getBBox = shape.getBBox(),
          minX = _shape$getBBox.minX,
          minY = _shape$getBBox.minY,
          maxX = _shape$getBBox.maxX,
          maxY = _shape$getBBox.maxY;

      var start;
      var end;

      if (angle >= 0 && angle < 0.5 * Math.PI) {
        start = {
          x: minX,
          y: minY
        };
        end = {
          x: maxX,
          y: maxY
        };
      } else if (0.5 * Math.PI <= angle && angle < Math.PI) {
        start = {
          x: maxX,
          y: minY
        };
        end = {
          x: minX,
          y: maxY
        };
      } else if (Math.PI <= angle && angle < 1.5 * Math.PI) {
        start = {
          x: maxX,
          y: maxY
        };
        end = {
          x: minX,
          y: minY
        };
      } else {
        start = {
          x: minX,
          y: maxY
        };
        end = {
          x: maxX,
          y: minY
        };
      }

      var tanTheta = Math.tan(angle);
      var tanTheta2 = tanTheta * tanTheta;
      var x = (end.x - start.x + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.x;
      var y = tanTheta * (end.x - start.x + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.y;
      var gradient = context.createLinearGradient(start.x, start.y, x, y);

      _addStop(steps, gradient);

      return gradient;
    } // the string format: 'r(0.5, 0.5, 0.1) 0:#ffffff 1:#1890ff'


    function _parseRadialGradient(color, shape, context) {
      var arr = color.split(' ');
      var circleCfg = arr[0].slice(2, arr[0].length - 1);
      circleCfg = circleCfg.split(',');
      var fx = parseFloat(circleCfg[0]);
      var fy = parseFloat(circleCfg[1]);
      var fr = parseFloat(circleCfg[2]);
      var steps = arr.slice(1); // if radius is 0, no gradient, stroke with the last color

      if (fr === 0) {
        var _color = steps[steps.length - 1];
        return _color.split(':')[1];
      }

      var _shape$getBBox2 = shape.getBBox(),
          width = _shape$getBBox2.width,
          height = _shape$getBBox2.height,
          minX = _shape$getBBox2.minX,
          minY = _shape$getBBox2.minY;

      var r = Math.sqrt(width * width + height * height) / 2;
      var gradient = context.createRadialGradient(minX + width * fx, minY + height * fy, fr * r, minX + width / 2, minY + height / 2, r);

      _addStop(steps, gradient);

      return gradient;
    }

    function parseStyle(color, shape, context) {
      if (color[1] === '(') {
        try {
          var firstCode = color[0];

          if (firstCode === 'l') {
            return _parseLineGradient(color, shape, context);
          } else if (firstCode === 'r') {
            return _parseRadialGradient(color, shape, context);
          }
        } catch (ev) {
          console.error('error in parsing gradient string, please check if there are any extra whitespaces.');
          console.error(ev);
        }
      }

      return color;
    }

    var ALIAS_ATTRS_MAP = {
      stroke: 'strokeStyle',
      fill: 'fillStyle',
      opacity: 'globalAlpha'
    };
    var SHAPE_ATTRS = ['fillStyle', 'font', 'globalAlpha', 'lineCap', 'lineWidth', 'lineJoin', 'miterLimit', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'strokeStyle', 'textAlign', 'textBaseline', 'lineDash', 'shadow' // 兼容支付宝小程序
    ];
    var CLIP_SHAPES = ['circle', 'sector', 'polygon', 'rect', 'polyline'];

    var Element = /*#__PURE__*/function () {
      var _proto = Element.prototype;

      _proto._initProperties = function _initProperties() {
        this._attrs = {
          zIndex: 0,
          visible: true,
          destroyed: false
        };
      };

      function Element(cfg) {
        this._initProperties();

        mix(this._attrs, cfg);
        var attrs = this._attrs.attrs;

        if (attrs) {
          this.initAttrs(attrs);
        }

        this.initTransform();
      }

      _proto.get = function get(name) {
        return this._attrs[name];
      };

      _proto.set = function set(name, value) {
        this._attrs[name] = value;
      };

      _proto.isGroup = function isGroup() {
        return this.get('isGroup');
      };

      _proto.isShape = function isShape() {
        return this.get('isShape');
      };

      _proto.initAttrs = function initAttrs(attrs) {
        this.attr(mix(this.getDefaultAttrs(), attrs));
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {};
      };

      _proto._setAttr = function _setAttr(name, value) {
        var attrs = this._attrs.attrs;

        if (name === 'clip') {
          value = this._setAttrClip(value);
        } else {
          var alias = ALIAS_ATTRS_MAP[name];

          if (alias) {
            attrs[alias] = value;
          }
        }

        attrs[name] = value;
      };

      _proto._getAttr = function _getAttr(name) {
        return this._attrs.attrs[name];
      } // _afterAttrsSet() {}
      ;

      _proto._setAttrClip = function _setAttrClip(clip) {
        if (clip && CLIP_SHAPES.indexOf(clip._attrs.type) > -1) {
          if (clip.get('canvas') === null) {
            clip = Object.assign({}, clip);
          }

          clip.set('parent', this.get('parent'));
          clip.set('context', this.get('context'));
          return clip;
        }

        return null;
      };

      _proto.attr = function attr(name, value) {
        var self = this;
        if (self.get('destroyed')) return null;
        var argumentsLen = arguments.length;

        if (argumentsLen === 0) {
          return self._attrs.attrs;
        }

        if (isObject(name)) {
          this._attrs.bbox = null;

          for (var k in name) {
            self._setAttr(k, name[k]);
          }

          if (self._afterAttrsSet) {
            self._afterAttrsSet();
          }

          return self;
        }

        if (argumentsLen === 2) {
          this._attrs.bbox = null;

          self._setAttr(name, value);

          if (self._afterAttrsSet) {
            self._afterAttrsSet();
          }

          return self;
        }

        return self._getAttr(name);
      };

      _proto.getParent = function getParent() {
        return this.get('parent');
      };

      _proto.draw = function draw(context) {
        if (this.get('destroyed')) {
          return;
        }

        if (this.get('visible')) {
          this.setContext(context);
          this.drawInner(context);
          this.restoreContext(context);
        }
      };

      _proto.setContext = function setContext(context) {
        var clip = this._attrs.attrs.clip;
        context.save();

        if (clip) {
          clip.resetTransform(context);
          clip.createPath(context);
          context.clip();
        }

        this.resetContext(context);
        this.resetTransform(context);
      };

      _proto.restoreContext = function restoreContext(context) {
        context.restore();
      };

      _proto.resetContext = function resetContext(context) {
        var elAttrs = this._attrs.attrs;

        for (var k in elAttrs) {
          if (SHAPE_ATTRS.indexOf(k) > -1) {
            var v = elAttrs[k];

            if ((k === 'fillStyle' || k === 'strokeStyle') && v) {
              v = parseStyle(v, this, context);
            }

            if (k === 'lineDash' && context.setLineDash && isArray(v)) {
              context.setLineDash(v);
            } else {
              context[k] = v;
            }
          }
        }
      };

      _proto.hasFill = function hasFill() {
        return this.get('canFill') && this._attrs.attrs.fillStyle;
      };

      _proto.hasStroke = function hasStroke() {
        return this.get('canStroke') && this._attrs.attrs.strokeStyle;
      };

      _proto.drawInner = function drawInner()
      /* context */
      {};

      _proto.show = function show() {
        this.set('visible', true);
        return this;
      };

      _proto.hide = function hide() {
        this.set('visible', false);
        return this;
      };

      _proto.isVisible = function isVisible() {
        return this.get('visible');
      };

      _proto.getAriaLabel = function getAriaLabel() {
        var _this$_attrs = this._attrs,
            destroyed = _this$_attrs.destroyed,
            visible = _this$_attrs.visible,
            isShape = _this$_attrs.isShape,
            aria = _this$_attrs.aria;

        if (destroyed || !visible || isShape && !aria) {
          return;
        }

        return this._getAriaLabel();
      };

      _proto._getAriaLabel = function _getAriaLabel() {
        return this._attrs.ariaLabel;
      };

      _proto._removeFromParent = function _removeFromParent() {
        var parent = this.get('parent');

        if (parent) {
          var children = parent.get('children');
          remove(children, this);
        }

        return this;
      };

      _proto.remove = function remove(destroy) {
        if (destroy) {
          this.destroy();
        } else {
          this._removeFromParent();
        }
      };

      _proto.destroy = function destroy() {
        var destroyed = this.get('destroyed');

        if (destroyed) {
          return null;
        }

        this._removeFromParent();

        this._attrs = {};
        this.set('destroyed', true);
      };

      _proto.getBBox = function getBBox() {
        return {
          minX: 0,
          maxX: 0,
          minY: 0,
          maxY: 0,
          width: 0,
          height: 0
        };
      };

      _proto.initTransform = function initTransform() {
        var attrs = this._attrs.attrs || {};

        if (!attrs.matrix) {
          attrs.matrix = [1, 0, 0, 1, 0, 0];
        }

        this._attrs.attrs = attrs;
      };

      _proto.getMatrix = function getMatrix() {
        return this._attrs.attrs.matrix;
      };

      _proto.setMatrix = function setMatrix(m) {
        this._attrs.attrs.matrix = [m[0], m[1], m[2], m[3], m[4], m[5]];
      };

      _proto.transform = function transform(actions) {
        var matrix = this._attrs.attrs.matrix;
        this._attrs.attrs.matrix = Matrix.transform(matrix, actions);
        return this;
      };

      _proto.setTransform = function setTransform(actions) {
        this._attrs.attrs.matrix = [1, 0, 0, 1, 0, 0];
        return this.transform(actions);
      };

      _proto.translate = function translate(x, y) {
        var matrix = this._attrs.attrs.matrix;
        Matrix.translate(matrix, matrix, [x, y]);
      };

      _proto.rotate = function rotate(rad) {
        var matrix = this._attrs.attrs.matrix;
        Matrix.rotate(matrix, matrix, rad);
      };

      _proto.scale = function scale(sx, sy) {
        var matrix = this._attrs.attrs.matrix;
        Matrix.scale(matrix, matrix, [sx, sy]);
      };

      _proto.moveTo = function moveTo(x, y) {
        var cx = this._attrs.x || 0;
        var cy = this._attrs.y || 0;
        this.translate(x - cx, y - cy);
        this.set('x', x);
        this.set('y', y);
      };

      _proto.apply = function apply(v) {
        var m = this._attrs.attrs.matrix;
        Vector2.transformMat2d(v, v, m);
        return this;
      };

      _proto.resetTransform = function resetTransform(context) {
        var mo = this._attrs.attrs.matrix;

        if (Matrix.isChanged(mo)) {
          context.transform(mo[0], mo[1], mo[2], mo[3], mo[4], mo[5],!0);
        }
      };

      _proto.isDestroyed = function isDestroyed() {
        return this.get('destroyed');
      };

      return Element;
    }();

    var Shape$2 = /*#__PURE__*/function (_Element) {
      _inheritsLoose(Shape, _Element);

      function Shape() {
        return _Element.apply(this, arguments) || this;
      }

      var _proto = Shape.prototype;

      _proto._initProperties = function _initProperties() {
        this._attrs = {
          zIndex: 0,
          visible: true,
          destroyed: false,
          isShape: true,
          attrs: {}
        };
      };

      _proto.getType = function getType() {
        return this._attrs.type;
      };

      _proto.drawInner = function drawInner(context) {
        var self = this;
        var attrs = self.get('attrs');
        self.createPath(context);
        var originOpacity = context.globalAlpha;

        if (self.hasFill()) {
          var fillOpacity = attrs.fillOpacity;

          if (!isNil(fillOpacity) && fillOpacity !== 1) {
            context.globalAlpha = fillOpacity;
            context.fill();
            context.globalAlpha = originOpacity;
          } else {
            context.fill();
          }
        }

        if (self.hasStroke()) {
          var lineWidth = attrs.lineWidth;

          if (lineWidth > 0) {
            var strokeOpacity = attrs.strokeOpacity;

            if (!isNil(strokeOpacity) && strokeOpacity !== 1) {
              context.globalAlpha = strokeOpacity;
            }

            context.stroke();
          }
        }
      };

      _proto.getBBox = function getBBox() {
        var bbox = this._attrs.bbox;

        if (!bbox) {
          bbox = this.calculateBox();

          if (bbox) {
            bbox.x = bbox.minX;
            bbox.y = bbox.minY;
            bbox.width = bbox.maxX - bbox.minX;
            bbox.height = bbox.maxY - bbox.minY;
          }

          this._attrs.bbox = bbox;
        }

        return bbox;
      };

      _proto.calculateBox = function calculateBox() {
        return null;
      };

      _proto.createPath = function createPath() {};

      return Shape;
    }(Element);

    function parseRadius(radius, width, height) {
      radius = parsePadding(radius); // 都为0

      if (!radius[0] && !radius[1] && !radius[2] && !radius[3]) {
        return radius;
      }

      var minWidth = Math.max(radius[0] + radius[1], radius[2] + radius[3]);
      var minHeight = Math.max(radius[0] + radius[3], radius[1] + radius[2]);
      var scale = Math.min(width / minWidth, height / minHeight);

      if (scale < 1) {
        return radius.map(function (r) {
          return r * scale;
        });
      }

      return radius;
    }

    var Rect = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Rect, _Shape);

      function Rect() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Rect.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canFill = true;
        this._attrs.canStroke = true;
        this._attrs.type = 'rect';
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          radius: 0,
          lineWidth: 0
        };
      };

      _proto.createRadiusPath = function createRadiusPath(context, x, y, width, height, radius) {
        radius = parseRadius(radius, width, height);
        context.moveTo(x + radius[0], y);
        context.lineTo(x + width - radius[1], y);
        context.arc(x + width - radius[1], y + radius[1], radius[1], -Math.PI / 2, 0, false);
        context.lineTo(x + width, y + height - radius[2]);
        context.arc(x + width - radius[2], y + height - radius[2], radius[2], 0, Math.PI / 2, false);
        context.lineTo(x + radius[3], y + height);
        context.arc(x + radius[3], y + height - radius[3], radius[3], Math.PI / 2, Math.PI, false);
        context.lineTo(x, y + radius[0]);
        context.arc(x + radius[0], y + radius[0], radius[0], Math.PI, Math.PI * 3 / 2, false);
        context.closePath();
      };

      _proto.createPath = function createPath(context) {
        var self = this;
        var attrs = self.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            width = attrs.width,
            height = attrs.height,
            radius = attrs.radius;
        context.beginPath();

        if (!radius || !(width * height)) {
          context.rect(x, y, width, height);
        } else {
          this.createRadiusPath(context, x, y, width, height, radius);
        }
      };

      _proto.calculateBox = function calculateBox() {
        var attrs = this.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            width = attrs.width,
            height = attrs.height;
        return {
          minX: x,
          minY: y,
          maxX: x + width,
          maxY: y + height
        };
      };

      return Rect;
    }(Shape$2);

    var imageCaches = {};

    var ImageShape = /*#__PURE__*/function (_Rect) {
      _inheritsLoose(ImageShape, _Rect);

      function ImageShape() {
        return _Rect.apply(this, arguments) || this;
      }

      var _proto = ImageShape.prototype;

      _proto._initProperties = function _initProperties() {
        _Rect.prototype._initProperties.call(this);

        this._attrs.canFill = false;
        this._attrs.canStroke = false;
        this._attrs.loading = false;
        this._attrs.image = null;
        this._attrs.type = 'image';
      };

      _proto.draw = function draw(context) {
        var _this = this;

        // 如果图片还在loading中直接返回，等下次绘制
        if (this.get('loading')) {
          return;
        } // 如果已经有image对象，直接绘制，会调用createPath绘制


        var image = this.get('image');

        if (image) {
          _Rect.prototype.draw.call(this, context);

          return;
        }

        var attrs = this.get('attrs');
        var src = attrs.src;

        if (src && window.Image) {
          var cacheImage = this.get('cacheImage'); // 如果有缓存，则直接从缓存中拿

          if (cacheImage && imageCaches[src]) {
            this.set('image', imageCaches[src]);
            this.draw(context);
            return;
          }

          this.set('loading', true);

          var _image = new Image(); // 设置跨域, 等同于 image.crossOrigin = 'anonymous'


          _image.crossOrigin = '';

          _image.onload = function () {
            _this.set('loading', false);

            _this.set('image', _image);

            _this.draw(context);
          }; // src 一定要在 crossOrigin 之后，否则 toDataURL 就会报 SecurityError


          _image.src = src; // 设置全局缓存

          if (cacheImage) {
            imageCaches[src] = _image;
          }
        }
      };

      _proto.createPath = function createPath(context) {
        var image = this.get('image');
        this.drawImage(context, image);
      };

      _proto.drawImage = function drawImage(context, image) {
        var _this$_attrs = this._attrs,
            attrs = _this$_attrs.attrs,
            destroyed = _this$_attrs.destroyed;

        if (destroyed) {
          return;
        }

        var x = attrs.x,
            y = attrs.y,
            width = attrs.width,
            height = attrs.height,
            sx = attrs.sx,
            sy = attrs.sy,
            swidth = attrs.swidth,
            sheight = attrs.sheight,
            radius = attrs.radius,
            fillOpacity = attrs.fillOpacity;

        if (radius) {
          context.save();
          this.createRadiusPath(context, x, y, width, height, radius);
          context.clip();
        } // 设置透明度


        var originOpacity = context.globalAlpha;

        if (!isNil(fillOpacity)) {
          context.globalAlpha = fillOpacity;
        }

        if (!isNil(sx) && !isNil(sy) && !isNil(swidth) && !isNil(sheight)) {
          context.drawImage(image, sx, sy, swidth, sheight, x, y, width, height);
        } else {
          context.drawImage(image, x, y, width, height);
        }

        context.globalAlpha = originOpacity;

        if (radius) {
          // 因为 save 和 restore 会一定程度上影响绘图性能，所以只在必要是调用
          context.restore();
        }
      };

      return ImageShape;
    }(Rect);

    var Circle = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Circle, _Shape);

      function Circle() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Circle.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canFill = true;
        this._attrs.canStroke = true;
        this._attrs.type = 'circle';
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {
          x: 0,
          y: 0,
          r: 0,
          lineWidth: 0
        };
      };

      _proto.createPath = function createPath(context) {
        var attrs = this.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            r = attrs.r;
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.closePath();
      };

      _proto.calculateBox = function calculateBox() {
        var attrs = this.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            r = attrs.r;
        return {
          minX: x - r,
          maxX: x + r,
          minY: y - r,
          maxY: y + r
        };
      };

      return Circle;
    }(Shape$2);

    var start = Vector2.create();
    var end = Vector2.create();
    var extremity = Vector2.create();

    function getCubicBezierXYatT(startPt, controlPt1, controlPt2, endPt, T) {
      var x = CubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
      var y = CubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
      return {
        x: x,
        y: y
      };
    } // cubic helper formula at T distance


    function CubicN(T, a, b, c, d) {
      var t2 = T * T;
      var t3 = t2 * T;
      return a + (-a * 3 + T * (3 * a - a * T)) * T + (3 * b + T * (-6 * b + b * 3 * T)) * T + (c * 3 - c * 3 * T) * t2 + d * t3;
    }

    function cubicBezierBounds(c) {
      var minX = Infinity;
      var maxX = -Infinity;
      var minY = Infinity;
      var maxY = -Infinity;
      var s = {
        x: c[0],
        y: c[1]
      };
      var c1 = {
        x: c[2],
        y: c[3]
      };
      var c2 = {
        x: c[4],
        y: c[5]
      };
      var e = {
        x: c[6],
        y: c[7]
      };

      for (var t = 0; t < 100; t++) {
        var pt = getCubicBezierXYatT(s, c1, c2, e, t / 100);

        if (pt.x < minX) {
          minX = pt.x;
        }

        if (pt.x > maxX) {
          maxX = pt.x;
        }

        if (pt.y < minY) {
          minY = pt.y;
        }

        if (pt.y > maxY) {
          maxY = pt.y;
        }
      }

      return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
      };
    }

    function getBBoxFromPoints(points, lineWidth) {
      if (points.length === 0) {
        return;
      }

      var p = points[0];
      var left = p.x;
      var right = p.x;
      var top = p.y;
      var bottom = p.y;
      var len = points.length;

      for (var i = 1; i < len; i++) {
        p = points[i];
        left = Math.min(left, p.x);
        right = Math.max(right, p.x);
        top = Math.min(top, p.y);
        bottom = Math.max(bottom, p.y);
      }

      lineWidth = lineWidth / 2 || 0;
      return {
        minX: left - lineWidth,
        minY: top - lineWidth,
        maxX: right + lineWidth,
        maxY: bottom + lineWidth
      };
    }

    function getBBoxFromLine(x0, y0, x1, y1, lineWidth) {
      lineWidth = lineWidth / 2 || 0;
      return {
        minX: Math.min(x0, x1) - lineWidth,
        minY: Math.min(y0, y1) - lineWidth,
        maxX: Math.max(x0, x1) + lineWidth,
        maxY: Math.max(y0, y1) + lineWidth
      };
    }

    function getBBoxFromArc(x, y, r, startAngle, endAngle, anticlockwise) {
      var diff = Math.abs(startAngle - endAngle);

      if (diff % (Math.PI * 2) < 1e-4 && diff > 1e-4) {
        // Is a circle
        return {
          minX: x - r,
          minY: y - r,
          maxX: x + r,
          maxY: y + r
        };
      }

      start[0] = Math.cos(startAngle) * r + x;
      start[1] = Math.sin(startAngle) * r + y;
      end[0] = Math.cos(endAngle) * r + x;
      end[1] = Math.sin(endAngle) * r + y;
      var min = [0, 0];
      var max = [0, 0];
      Vector2.min(min, start, end);
      Vector2.max(max, start, end); // Thresh to [0, Math.PI * 2]

      startAngle = startAngle % (Math.PI * 2);

      if (startAngle < 0) {
        startAngle = startAngle + Math.PI * 2;
      }

      endAngle = endAngle % (Math.PI * 2);

      if (endAngle < 0) {
        endAngle = endAngle + Math.PI * 2;
      }

      if (startAngle > endAngle && !anticlockwise) {
        endAngle += Math.PI * 2;
      } else if (startAngle < endAngle && anticlockwise) {
        startAngle += Math.PI * 2;
      }

      if (anticlockwise) {
        var tmp = endAngle;
        endAngle = startAngle;
        startAngle = tmp;
      }

      for (var angle = 0; angle < endAngle; angle += Math.PI / 2) {
        if (angle > startAngle) {
          extremity[0] = Math.cos(angle) * r + x;
          extremity[1] = Math.sin(angle) * r + y;
          Vector2.min(min, extremity, min);
          Vector2.max(max, extremity, max);
        }
      }

      return {
        minX: min[0],
        minY: min[1],
        maxX: max[0],
        maxY: max[1]
      };
    }

    function getBBoxFromBezierGroup(points, lineWidth) {
      var minX = Infinity;
      var maxX = -Infinity;
      var minY = Infinity;
      var maxY = -Infinity;

      for (var i = 0, len = points.length; i < len; i++) {
        var bbox = cubicBezierBounds(points[i]);

        if (bbox.minX < minX) {
          minX = bbox.minX;
        }

        if (bbox.maxX > maxX) {
          maxX = bbox.maxX;
        }

        if (bbox.minY < minY) {
          minY = bbox.minY;
        }

        if (bbox.maxY > maxY) {
          maxY = bbox.maxY;
        }
      }

      lineWidth = lineWidth / 2 || 0;
      return {
        minX: minX - lineWidth,
        minY: minY - lineWidth,
        maxX: maxX + lineWidth,
        maxY: maxY + lineWidth
      };
    }

    var Line$1 = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Line, _Shape);

      function Line() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Line.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canStroke = true;
        this._attrs.type = 'line';
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
          lineWidth: 1
        };
      };

      _proto.createPath = function createPath(context) {
        var attrs = this.get('attrs');
        var x1 = attrs.x1,
            y1 = attrs.y1,
            x2 = attrs.x2,
            y2 = attrs.y2;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
      };

      _proto.calculateBox = function calculateBox() {
        var attrs = this.get('attrs');
        var x1 = attrs.x1,
            y1 = attrs.y1,
            x2 = attrs.x2,
            y2 = attrs.y2,
            lineWidth = attrs.lineWidth;
        return getBBoxFromLine(x1, y1, x2, y2, lineWidth);
      };

      return Line;
    }(Shape$2);

    var Polygon = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Polygon, _Shape);

      function Polygon() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Polygon.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canFill = true;
        this._attrs.canStroke = true;
        this._attrs.type = 'polygon';
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {
          points: null,
          lineWidth: 0
        };
      };

      _proto.createPath = function createPath(context) {
        var self = this;
        var attrs = self.get('attrs');
        var points = attrs.points;
        context.beginPath();

        for (var i = 0, len = points.length; i < len; i++) {
          var point = points[i];

          if (i === 0) {
            context.moveTo(point.x, point.y);
          } else {
            context.lineTo(point.x, point.y);
          }
        }

        context.closePath();
      };

      _proto.calculateBox = function calculateBox() {
        var attrs = this.get('attrs');
        var points = attrs.points;
        return getBBoxFromPoints(points);
      };

      return Polygon;
    }(Shape$2);

    /**
     * @fileOverview convert the line to curve
     * @author dxq613@gmail.com
     */

    function getPoint(v) {
      return [v.x, v.y];
    }

    function smoothBezier(points, smooth, isLoop, constraint) {
      var cps = [];
      var prevPoint;
      var nextPoint;
      var hasConstraint = !!constraint;
      var min;
      var max;
      var point;
      var len;
      var l;
      var i;

      if (hasConstraint) {
        min = [Infinity, Infinity];
        max = [-Infinity, -Infinity];

        for (i = 0, l = points.length; i < l; i++) {
          point = getPoint(points[i]);
          Vector2.min(min, min, point);
          Vector2.max(max, max, point);
        }

        Vector2.min(min, min, constraint[0]);
        Vector2.max(max, max, constraint[1]);
      }

      for (i = 0, len = points.length; i < len; i++) {
        point = getPoint(points[i]);

        if (isLoop) {
          prevPoint = getPoint(points[i ? i - 1 : len - 1]);
          nextPoint = getPoint(points[(i + 1) % len]);
        } else {
          if (i === 0 || i === len - 1) {
            cps.push([point[0], point[1]]);
            continue;
          } else {
            prevPoint = getPoint(points[i - 1]);
            nextPoint = getPoint(points[i + 1]);
          }
        }

        var v = Vector2.sub([], nextPoint, prevPoint);
        Vector2.scale(v, v, smooth);
        var d0 = Vector2.distance(point, prevPoint);
        var d1 = Vector2.distance(point, nextPoint);
        var sum = d0 + d1;

        if (sum !== 0) {
          d0 /= sum;
          d1 /= sum;
        }

        var v1 = Vector2.scale([], v, -d0);
        var v2 = Vector2.scale([], v, d1);
        var cp0 = Vector2.add([], point, v1);
        var cp1 = Vector2.add([], point, v2);

        if (hasConstraint) {
          Vector2.max(cp0, cp0, min);
          Vector2.min(cp0, cp0, max);
          Vector2.max(cp1, cp1, min);
          Vector2.min(cp1, cp1, max);
        }

        cps.push([cp0[0], cp0[1]]);
        cps.push([cp1[0], cp1[1]]);
      }

      if (isLoop) {
        cps.push(cps.shift());
      }

      return cps;
    }

    function catmullRom2bezier(pointList, z, constraint) {
      var isLoop = !!z;
      var controlPointList = smoothBezier(pointList, 0.4, isLoop, constraint);
      var len = pointList.length;
      var d1 = [];
      var cp1;
      var cp2;
      var p;

      for (var i = 0; i < len - 1; i++) {
        cp1 = controlPointList[i * 2];
        cp2 = controlPointList[i * 2 + 1];
        p = pointList[i + 1];
        d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p.x, p.y]);
      }

      if (isLoop) {
        cp1 = controlPointList[len];
        cp2 = controlPointList[len + 1];
        p = pointList[0];
        d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p.x, p.y]);
      }

      return d1;
    }

    function _filterPoints(points) {
      var filteredPoints = [];

      for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];

        if (!isNaN(point.x) && !isNaN(point.y)) {
          filteredPoints.push(point);
        }
      }

      return filteredPoints;
    }

    var Polyline = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Polyline, _Shape);

      function Polyline() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Polyline.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canFill = true;
        this._attrs.canStroke = true;
        this._attrs.type = 'polyline';
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {
          points: null,
          lineWidth: 1,
          smooth: false
        };
      };

      _proto.createPath = function createPath(context) {
        var self = this;
        var attrs = self.get('attrs');
        var points = attrs.points,
            smooth = attrs.smooth;

        var filteredPoints = _filterPoints(points);

        context.beginPath();

        if (filteredPoints.length) {
          context.moveTo(filteredPoints[0].x, filteredPoints[0].y);

          if (smooth) {
            var constaint = [[0, 0], [1, 1]];
            var sps = catmullRom2bezier(filteredPoints, false, constaint);

            for (var i = 0, n = sps.length; i < n; i++) {
              var sp = sps[i];
              context.bezierCurveTo(sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]);
            }
          } else {
            var _i;

            var l;

            for (_i = 1, l = filteredPoints.length - 1; _i < l; _i++) {
              context.lineTo(filteredPoints[_i].x, filteredPoints[_i].y);
            }

            context.lineTo(filteredPoints[l].x, filteredPoints[l].y);
          }
        }
      };

      _proto.calculateBox = function calculateBox() {
        var attrs = this.get('attrs');
        var points = attrs.points,
            smooth = attrs.smooth,
            lineWidth = attrs.lineWidth;

        var filteredPoints = _filterPoints(points);

        if (smooth) {
          var newPoints = [];
          var constaint = [[0, 0], [1, 1]];
          var sps = catmullRom2bezier(filteredPoints, false, constaint);

          for (var i = 0, n = sps.length; i < n; i++) {
            var sp = sps[i];

            if (i === 0) {
              newPoints.push([filteredPoints[0].x, filteredPoints[0].y, sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]]);
            } else {
              var lastPoint = sps[i - 1];
              newPoints.push([lastPoint[5], lastPoint[6], sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]]);
            }
          }

          return getBBoxFromBezierGroup(newPoints, lineWidth);
        }

        return getBBoxFromPoints(filteredPoints, lineWidth);
      };

      return Polyline;
    }(Shape$2);

    var Arc = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Arc, _Shape);

      function Arc() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Arc.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canStroke = true;
        this._attrs.canFill = true;
        this._attrs.type = 'arc';
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {
          x: 0,
          y: 0,
          r: 0,
          startAngle: 0,
          endAngle: Math.PI * 2,
          anticlockwise: false,
          lineWidth: 1
        };
      };

      _proto.createPath = function createPath(context) {
        var attrs = this.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            r = attrs.r,
            startAngle = attrs.startAngle,
            endAngle = attrs.endAngle,
            anticlockwise = attrs.anticlockwise;
        context.beginPath();

        if (startAngle !== endAngle) {
          context.arc(x, y, r, startAngle, endAngle, anticlockwise);
        }
      };

      _proto.calculateBox = function calculateBox() {
        var attrs = this.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            r = attrs.r,
            startAngle = attrs.startAngle,
            endAngle = attrs.endAngle,
            anticlockwise = attrs.anticlockwise;
        return getBBoxFromArc(x, y, r, startAngle, endAngle, anticlockwise);
      };

      return Arc;
    }(Shape$2);

    var Sector = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Sector, _Shape);

      function Sector() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Sector.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canFill = true;
        this._attrs.canStroke = true;
        this._attrs.type = 'sector';
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {
          x: 0,
          y: 0,
          lineWidth: 0,
          r: 0,
          r0: 0,
          startAngle: 0,
          endAngle: Math.PI * 2,
          anticlockwise: false
        };
      };

      _proto.createPath = function createPath(context) {
        var attrs = this.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            startAngle = attrs.startAngle,
            endAngle = attrs.endAngle,
            r = attrs.r,
            r0 = attrs.r0,
            anticlockwise = attrs.anticlockwise;
        context.beginPath();
        var unitX = Math.cos(startAngle);
        var unitY = Math.sin(startAngle);
        context.moveTo(unitX * r0 + x, unitY * r0 + y);
        context.lineTo(unitX * r + x, unitY * r + y); // 当扇形的角度非常小的时候，就不进行弧线的绘制；或者整个只有1个扇形时，会出现end<0的情况不绘制

        if (Math.abs(endAngle - startAngle) > 0.0001 || startAngle === 0 && endAngle < 0) {
          context.arc(x, y, r, startAngle, endAngle, anticlockwise);
          context.lineTo(Math.cos(endAngle) * r0 + x, Math.sin(endAngle) * r0 + y);

          if (r0 !== 0) {
            context.arc(x, y, r0, endAngle, startAngle, !anticlockwise);
          }
        }

        context.closePath();
      };

      _proto.calculateBox = function calculateBox() {
        var attrs = this.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            r = attrs.r,
            r0 = attrs.r0,
            startAngle = attrs.startAngle,
            endAngle = attrs.endAngle,
            anticlockwise = attrs.anticlockwise;
        var outerBBox = getBBoxFromArc(x, y, r, startAngle, endAngle, anticlockwise);
        var innerBBox = getBBoxFromArc(x, y, r0, startAngle, endAngle, anticlockwise);
        return {
          minX: Math.min(outerBBox.minX, innerBBox.minX),
          minY: Math.min(outerBBox.minY, innerBBox.minY),
          maxX: Math.max(outerBBox.maxX, innerBBox.maxX),
          maxY: Math.max(outerBBox.maxY, innerBBox.maxY)
        };
      };

      return Sector;
    }(Shape$2);

    var Rect$1 = {
      calcRotatedBox: function calcRotatedBox(_ref) {
        var width = _ref.width,
            height = _ref.height,
            rotate = _ref.rotate;
        var absRotate = Math.abs(rotate);
        return {
          width: Math.abs(width * Math.cos(absRotate) + height * Math.sin(absRotate)),
          height: Math.abs(height * Math.cos(absRotate) + width * Math.sin(absRotate))
        };
      }
    };

    var textWidthCacheCounter = 0;
    var textWidthCache = {};
    var TEXT_CACHE_MAX = 5000;

    var Text = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Text, _Shape);

      function Text() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Text.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canFill = true;
        this._attrs.canStroke = true;
        this._attrs.type = 'text';
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {
          lineWidth: 0,
          lineCount: 1,
          fontSize: 12,
          fontFamily: 'sans-serif',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontVariant: 'normal',
          textAlign: 'start',
          textBaseline: 'bottom',
          lineHeight: null,
          textArr: null
        };
      };

      _proto._getFontStyle = function _getFontStyle() {
        var attrs = this._attrs.attrs;
        var fontSize = attrs.fontSize,
            fontFamily = attrs.fontFamily,
            fontWeight = attrs.fontWeight,
            fontStyle = attrs.fontStyle,
            fontVariant = attrs.fontVariant;
        return fontStyle + " " + fontVariant + " " + fontWeight + " " + fontSize + "px " + fontFamily;
      };

      _proto._afterAttrsSet = function _afterAttrsSet() {
        var attrs = this._attrs.attrs;
        attrs.font = this._getFontStyle();

        if (attrs.text) {
          var text = attrs.text;
          var textArr = null;
          var lineCount = 1;

          if (isString(text) && text.indexOf('\n') !== -1) {
            textArr = text.split('\n');
            lineCount = textArr.length;
          }

          attrs.lineCount = lineCount;
          attrs.textArr = textArr;
        }

        this.set('attrs', attrs);
      };

      _proto._getTextHeight = function _getTextHeight() {
        var attrs = this._attrs.attrs;

        if (attrs.height) {
          return attrs.height;
        }

        var lineCount = attrs.lineCount;
        var fontSize = attrs.fontSize * 1;

        if (lineCount > 1) {
          var spaceingY = this._getSpaceingY();

          return fontSize * lineCount + spaceingY * (lineCount - 1);
        }

        return fontSize;
      };

      _proto._getSpaceingY = function _getSpaceingY() {
        var attrs = this._attrs.attrs;
        var lineHeight = attrs.lineHeight;
        var fontSize = attrs.fontSize * 1;
        return lineHeight ? lineHeight - fontSize : fontSize * 0.14;
      };

      _proto.drawInner = function drawInner(context) {
        var self = this;
        var attrs = self._attrs.attrs;
        var text = attrs.text;
        var x = attrs.x;
        var y = attrs.y;

        if (isNil(text) || isNaN(x) || isNaN(y)) {
          // text will be 0
          return;
        }

        var textArr = attrs.textArr;
        var fontSize = attrs.fontSize * 1;

        var spaceingY = self._getSpaceingY();

        if (attrs.rotate) {
          // do rotation
          context.translate(x, y);
          context.rotate(attrs.rotate);
          x = 0;
          y = 0;
        }

        var textBaseline = attrs.textBaseline;
        var height;

        if (textArr) {
          height = self._getTextHeight();
        }

        var subY; // context.beginPath();

        if (self.hasFill()) {
          var fillOpacity = attrs.fillOpacity;

          if (!isNil(fillOpacity) && fillOpacity !== 1) {
            context.globalAlpha = fillOpacity;
          }

          if (textArr) {
            for (var i = 0, len = textArr.length; i < len; i++) {
              var subText = textArr[i];
              subY = y + i * (spaceingY + fontSize) - height + fontSize; // bottom;

              if (textBaseline === 'middle') {
                subY += height - fontSize - (height - fontSize) / 2;
              }

              if (textBaseline === 'top') {
                subY += height - fontSize;
              }

              context.fillText(subText, x, subY);
            }
          } else {
            context.fillText(text, x, y);
          }
        }

        if (self.hasStroke()) {
          if (textArr) {
            for (var _i = 0, _len = textArr.length; _i < _len; _i++) {
              var _subText = textArr[_i];
              subY = y + _i * (spaceingY + fontSize) - height + fontSize; // bottom;

              if (textBaseline === 'middle') {
                subY += height - fontSize - (height - fontSize) / 2;
              }

              if (textBaseline === 'top') {
                subY += height - fontSize;
              }

              context.strokeText(_subText, x, subY);
            }
          } else {
            context.strokeText(text, x, y);
          }
        }
      };

      _proto._getAriaLabel = function _getAriaLabel() {
        return this._attrs.attrs.text;
      };

      _proto.calculateBox = function calculateBox() {
        var self = this;
        var attrs = self._attrs.attrs;
        var x = attrs.x,
            y = attrs.y,
            textAlign = attrs.textAlign,
            textBaseline = attrs.textBaseline;

        var width = self._getTextWidth(); // attrs.width


        if (!width) {
          return {
            minX: x,
            minY: y,
            maxX: x,
            maxY: y
          };
        }

        var height = self._getTextHeight(); // attrs.height


        if (attrs.rotate) {
          var rotatedBox = Rect$1.calcRotatedBox({
            width: width,
            height: height,
            rotate: attrs.rotate
          });
          width = rotatedBox.width;
          height = rotatedBox.height;
        }

        var point = {
          x: x,
          y: y - height
        }; // default textAlign: start, textBaseline: bottom

        if (textAlign) {
          if (textAlign === 'end' || textAlign === 'right') {
            point.x -= width;
          } else if (textAlign === 'center') {
            point.x -= width / 2;
          }
        }

        if (textBaseline) {
          if (textBaseline === 'top') {
            point.y += height;
          } else if (textBaseline === 'middle') {
            point.y += height / 2;
          }
        }

        return {
          minX: point.x,
          minY: point.y,
          maxX: point.x + width,
          maxY: point.y + height
        };
      };

      _proto._getTextWidth = function _getTextWidth() {
        var attrs = this._attrs.attrs;

        if (attrs.width) {
          return attrs.width;
        }

        var text = attrs.text;
        var context = this.get('context');
        if (isNil(text)) return undefined;
        var font = attrs.font;
        var textArr = attrs.textArr;
        var key = text + '' + font;

        if (textWidthCache[key]) {
          return textWidthCache[key];
        }

        var width = 0;

        if (textArr) {
          for (var i = 0, length = textArr.length; i < length; i++) {
            var subText = textArr[i];
            width = Math.max(width, measureText(subText, font, context).width);
          }
        } else {
          width = measureText(text, font, context).width;
        }

        if (textWidthCacheCounter > TEXT_CACHE_MAX) {
          textWidthCacheCounter = 0;
          textWidthCache = {};
        }

        textWidthCacheCounter++;
        textWidthCache[key] = width;
        return width;
      };

      return Text;
    }(Shape$2);

    var Custom = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Custom, _Shape);

      function Custom() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Custom.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canFill = true;
        this._attrs.canStroke = true;
        this._attrs.createPath = null;
        this._attrs.type = 'custom';
      };

      _proto.createPath = function createPath(context) {
        var createPath = this.get('createPath');
        createPath && createPath.call(this, context);
      };

      _proto.calculateBox = function calculateBox() {
        var calculateBox = this.get('calculateBox');
        return calculateBox && calculateBox.call(this);
      };

      return Custom;
    }(Shape$2);

    var SYMBOLS = {
      circle: function circle(x, y, r, ctx) {
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
      },
      square: function square(x, y, r, ctx) {
        ctx.moveTo(x - r, y - r);
        ctx.lineTo(x + r, y - r);
        ctx.lineTo(x + r, y + r);
        ctx.lineTo(x - r, y + r);
        ctx.closePath();
      }
    };

    var Marker = /*#__PURE__*/function (_Shape) {
      _inheritsLoose(Marker, _Shape);

      function Marker() {
        return _Shape.apply(this, arguments) || this;
      }

      var _proto = Marker.prototype;

      _proto._initProperties = function _initProperties() {
        _Shape.prototype._initProperties.call(this);

        this._attrs.canFill = true;
        this._attrs.canStroke = true;
        this._attrs.type = 'marker';
      };

      _proto.getDefaultAttrs = function getDefaultAttrs() {
        return {
          x: 0,
          y: 0,
          lineWidth: 0
        };
      };

      _proto.createPath = function createPath(context) {
        var attrs = this.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            radius = attrs.radius;
        var symbol = attrs.symbol || 'circle';
        var method;

        if (isFunction(symbol)) {
          method = symbol;
        } else {
          method = SYMBOLS[symbol];
        }

        context.beginPath();
        method(x, y, radius, context, this);
      };

      _proto.calculateBox = function calculateBox() {
        var attrs = this.get('attrs');
        var x = attrs.x,
            y = attrs.y,
            radius = attrs.radius;
        return {
          minX: x - radius,
          minY: y - radius,
          maxX: x + radius,
          maxY: y + radius
        };
      };

      return Marker;
    }(Shape$2);

    Shape$2.Rect = Rect;
    Shape$2.Image = ImageShape;
    Shape$2.Circle = Circle;
    Shape$2.Line = Line$1;
    Shape$2.Polygon = Polygon;
    Shape$2.Polyline = Polyline;
    Shape$2.Arc = Arc;
    Shape$2.Sector = Sector;
    Shape$2.Text = Text;
    Shape$2.Custom = Custom;
    Shape$2.Marker = Marker;

    var SHAPE_MAP = {};
    var INDEX = '_INDEX';

    function getComparer(compare) {
      return function (left, right) {
        var result = compare(left, right);
        return result === 0 ? left[INDEX] - right[INDEX] : result;
      };
    }

    var Container = {
      getGroupClass: function getGroupClass() {},
      getChildren: function getChildren() {
        return this.get('children');
      },
      addShape: function addShape(type, cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        var shapeType = SHAPE_MAP[type];

        if (!shapeType) {
          shapeType = upperFirst(type);
          SHAPE_MAP[type] = shapeType;
        }

        var shape = new Shape$2[shapeType](cfg);
        this.add(shape);
        return shape;
      },
      addGroup: function addGroup(cfg) {
        var groupClass = this.getGroupClass();
        var rst = new groupClass(cfg);
        this.add(rst);
        return rst;
      },
      contain: function contain(item) {
        var children = this.get('children');
        return children.indexOf(item) > -1;
      },
      sort: function sort() {
        var children = this.get('children');

        for (var i = 0, len = children.length; i < len; i++) {
          var child = children[i];
          child[INDEX] = i;
        }

        children.sort(getComparer(function (obj1, obj2) {
          return obj1.get('zIndex') - obj2.get('zIndex');
        }));
        return this;
      },
      drawChildren: function drawChildren(context) {
        var children = this.get('children');

        for (var i = 0, len = children.length; i < len; i++) {
          var child = children[i];
          child.draw(context);
        }

        return this;
      },
      clear: function clear() {
        var children = this.get('children');

        while (children.length !== 0) {
          children[children.length - 1].remove(true);
        }

        return this;
      },
      add: function add(items) {
        var self = this;
        var children = self.get('children');

        if (!isArray(items)) {
          items = [items];
        }

        for (var i = 0, len = items.length; i < len; i++) {
          var item = items[i];
          var parent = item.get('parent');

          if (parent) {
            var descendants = parent.get('children');
            remove(descendants, item);
          }

          self._setEvn(item);

          children.push(item);
        }

        return self;
      },
      _setEvn: function _setEvn(item) {
        var self = this;
        var _self$_attrs = self._attrs,
            context = _self$_attrs.context,
            canvas = _self$_attrs.canvas,
            aria = _self$_attrs.aria;
        var _item$_attrs = item._attrs,
            isGroup = _item$_attrs.isGroup,
            type = _item$_attrs.type;
        item._attrs.parent = self;
        item._attrs.context = context;
        item._attrs.canvas = canvas; // 是否需要无障碍处理

        if (aria && item._attrs.aria !== false) {
          item._attrs.aria = aria;
        }

        if (type === 'text' && canvas && canvas.get('fontFamily')) {
          item._attrs.attrs.fontFamily = item._attrs.attrs.fontFamily || canvas.get('fontFamily');
        }

        var clip = item._attrs.attrs.clip;

        if (clip) {
          clip._attrs.parent = self;
          clip._attrs.context = context;
          clip._attrs.canvas = canvas;
        }

        if (isGroup) {
          var children = item._attrs.children;

          for (var i = 0, len = children.length; i < len; i++) {
            item._setEvn(children[i]);
          }
        }
      },
      _getAriaLabel: function _getAriaLabel() {
        var _this$_attrs = this._attrs,
            aria = _this$_attrs.aria,
            ariaLabel = _this$_attrs.ariaLabel,
            children = _this$_attrs.children; // 主动关闭

        if (!aria) return;
        var childAriaLabels = [];

        if (children && children.length) {
          for (var i = 0, len = children.length; i < len; i++) {
            var _childAriaLabel = children[i].getAriaLabel();

            if (_childAriaLabel) {
              childAriaLabels.push(_childAriaLabel);
            }
          }
        }

        var childAriaLabel = childAriaLabels.join(' '); // 2个都有时拼接成完整句子

        if (ariaLabel && childAriaLabel) {
          return ariaLabel + " " + childAriaLabel + " ";
        } // 只有1个，或者都没有


        return ariaLabel || childAriaLabel;
      }
    };

    var Group = /*#__PURE__*/function (_Rect) {
      _inheritsLoose(Group, _Rect);

      function Group() {
        return _Rect.apply(this, arguments) || this;
      }

      var _proto = Group.prototype;

      _proto._initProperties = function _initProperties() {
        this._attrs = {
          type: 'group',
          zIndex: 0,
          visible: true,
          destroyed: false,
          isGroup: true,
          canFill: true,
          canStroke: true,
          attrs: {},
          children: []
        };
      };

      _proto.getBBox = function getBBox() {
        var self = this;
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        var children = self.get('children');

        for (var i = 0, length = children.length; i < length; i++) {
          var child = children[i];

          if (child.get('visible')) {
            var box = child.getBBox();

            if (!box) {
              continue;
            }

            var leftTop = [box.minX, box.minY];
            var leftBottom = [box.minX, box.maxY];
            var rightTop = [box.maxX, box.minY];
            var rightBottom = [box.maxX, box.maxY];
            var matrix = child.attr('matrix');
            Vector2.transformMat2d(leftTop, leftTop, matrix);
            Vector2.transformMat2d(leftBottom, leftBottom, matrix);
            Vector2.transformMat2d(rightTop, rightTop, matrix);
            Vector2.transformMat2d(rightBottom, rightBottom, matrix);
            minX = Math.min(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0], minX);
            maxX = Math.max(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0], maxX);
            minY = Math.min(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1], minY);
            maxY = Math.max(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1], maxY);
          }
        }

        return {
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };
      };

      _proto.createPath = function createPath(context) {
        var attrs = this.get('attrs'); // 只有在有fillStyle或strokeStyle 时才需要绘制

        if (!attrs.fillStyle && !attrs.strokeStyle) {
          return;
        }

        _Rect.prototype.createPath.call(this, context);
      };

      _proto.drawInner = function drawInner(context) {
        _Rect.prototype.drawInner.call(this, context);

        this.drawChildren(context);
      };

      _proto.destroy = function destroy() {
        if (this.get('destroyed')) {
          return;
        }

        this.clear();

        _Rect.prototype.destroy.call(this);
      };

      return Group;
    }(Rect);

    mix(Group.prototype, Container, {
      getGroupClass: function getGroupClass() {
        return Group;
      }
    });

    var requestAnimationFrame = typeof window === 'object' && window.requestAnimationFrame ? window.requestAnimationFrame : function (fn) {
      return setTimeout(fn, 16);
    };

    var Canvas = /*#__PURE__*/function (_EventEmit) {
      _inheritsLoose(Canvas, _EventEmit);

      var _proto = Canvas.prototype;

      _proto.get = function get(name) {
        return this._attrs[name];
      };

      _proto.set = function set(name, value) {
        this._attrs[name] = value;
      };

      function Canvas(cfg) {
        var _this;

        _this = _EventEmit.call(this) || this;
        var title = cfg.title;
        var ariaLabel = title ? substitute(lang.general.withTitle, {
          title: title
        }) : lang.general.title;
        _this._attrs = mix({
          type: 'canvas',
          children: [],
          ariaLabel: ariaLabel
        }, cfg);

        _this._initPixelRatio();

        _this._initCanvas();

        return _this;
      }

      _proto._initPixelRatio = function _initPixelRatio() {
        var pixelRatio = this.get('pixelRatio');

        if (!pixelRatio) {
          this.set('pixelRatio', getPixelRatio());
        }
      };

      _proto.beforeDraw = function beforeDraw() {
        var context = this._attrs.context;
        var el = this._attrs.el;
        context && context.clearRect && context.clearRect(0, 0, el.width, el.height);
      };

      _proto._initCanvas = function _initCanvas() {
        var self = this;
        var el = self.get('el');
        var context = self.get('context');

        if (!el && !context) {
          throw new Error('Please specify the id, el or context of the chart!');
        }

        var canvas;

        if (el) {
          // DOMElement or String
          canvas = isString(el) ? getDomById(el) : el;
        } else {
          // 说明没有指定el
          canvas = CanvasElement$1.create(context);
        }

        if (context && canvas && !canvas.getContext) {
          canvas.getContext = function () {
            return context;
          };
        }

        var width = self.get('width');

        if (!width) {
          width = getWidth(canvas);
        }

        var height = self.get('height');

        if (!height) {
          height = getHeight(canvas);
        }

        self.set('canvas', this);
        self.set('el', canvas);
        self.set('context', context || canvas.getContext('2d'));
        self.changeSize(width, height); // 初始化事件控制器

        var eventController = new EventController({
          canvas: this,
          el: canvas
        });
        self.set('eventController', eventController);
      };

      _proto.changeSize = function changeSize(width, height) {
        var pixelRatio = this.get('pixelRatio');
        var canvasDOM = this.get('el'); // HTMLCanvasElement or canvasElement
        // 浏览器环境设置style样式

        if (canvasDOM.style) {
          canvasDOM.style.width = width + 'px';
          canvasDOM.style.height = height + 'px';
        }

        if (isCanvasElement(canvasDOM)) {
          canvasDOM.width = width * pixelRatio;
          canvasDOM.height = height * pixelRatio;

          if (pixelRatio !== 1) {
            var ctx = this.get('context');
            ctx.scale(pixelRatio, pixelRatio);
          }
        }

        this.set('width', width);
        this.set('height', height);
      };

      _proto.getWidth = function getWidth() {
        var pixelRatio = this.get('pixelRatio');
        var width = this.get('width');
        return width * pixelRatio;
      };

      _proto.getHeight = function getHeight() {
        var pixelRatio = this.get('pixelRatio');
        var height = this.get('height');
        return height * pixelRatio;
      };

      _proto.getPointByClient = function getPointByClient(clientX, clientY) {
        var el = this.get('el');
        var bbox = el.getBoundingClientRect();
        var width = bbox.right - bbox.left;
        var height = bbox.bottom - bbox.top;
        return {
          x: (clientX - bbox.left) * (el.width / width),
          y: (clientY - bbox.top) * (el.height / height)
        };
      };

      _proto._beginDraw = function _beginDraw() {
        this._attrs.toDraw = true;
      };

      _proto._endDraw = function _endDraw() {
        this._attrs.toDraw = false;
      };

      _proto.draw = function draw() {
        var self = this;

        function drawInner() {
          self.set('animateHandler', requestAnimationFrame(function () {
            self.set('animateHandler', undefined);

            if (self.get('toDraw')) {
              drawInner();
            }
          }));
          self.beforeDraw();

          try {
            var context = self._attrs.context;
            self.drawChildren(context); // 支付宝，微信小程序，需要调context.draw才能完成绘制， 所以这里直接判断是否有.draw方法

            if (context.draw) {
              context.draw();
            } // 设置无障碍文本


            self.setAriaLabel();
          } catch (ev) {
            console.warn('error in draw canvas, detail as:');
            console.warn(ev);

            self._endDraw();
          }

          self._endDraw();
        }

        if (self.get('destroyed')) {
          return;
        }

        if (self.get('animateHandler')) {
          this._beginDraw();
        } else {
          drawInner();
        }
      } // 设置无障碍文本
      ;

      _proto.setAriaLabel = function setAriaLabel() {
        var el = this._attrs.el;

        var ariaLabel = this._getAriaLabel();

        if (ariaLabel && el.setAttribute) {
          el.setAttribute('aria-label', ariaLabel);
        }
      };

      _proto.destroy = function destroy() {
        if (this.get('destroyed')) {
          return;
        } // 需要清理 canvas 画布内容，否则会导致 spa 应用 ios 下 canvas 白屏
        // https://stackoverflow.com/questions/52532614/total-canvas-memory-use-exceeds-the-maximum-limit-safari-12
        // https://github.com/antvis/F2/issues/630


        var el = this.get('el');
        el.width = 0;
        el.height = 0;
        this.clear();
        this._attrs = {};
        this.set('destroyed', true);
      };

      _proto.isDestroyed = function isDestroyed() {
        return this.get('destroyed');
      };

      return Canvas;
    }(EventEmit);

    mix(Canvas.prototype, Container, {
      getGroupClass: function getGroupClass() {
        return Group;
      }
    });

    var engines = {};

    function registerEngine(name, engine) {
      engines[name] = engine;
    }

    function getEngine(name) {
      var G = engines[name];

      if (G) {
        return G;
      }

      return {
        Canvas: Canvas,
        Group: Group,
        Shape: Shape$2
      };
    }

    function createCanvas(cfg) {
      var renderer = cfg.renderer;
      var G = getEngine(renderer);
      return new G.Canvas(cfg);
    }

    var G = /*#__PURE__*/Object.freeze({
        __proto__: null,
        registerEngine: registerEngine,
        getEngine: getEngine,
        createCanvas: createCanvas,
        Canvas: Canvas,
        Group: Group,
        Shape: Shape$2,
        Matrix: Matrix,
        Vector2: Vector2
    });

    function getClip(coord) {
      var start = coord.start;
      var end = coord.end;
      var width = end.x - start.x;
      var height = Math.abs(end.y - start.y);
      var margin = 10;
      var clip;

      if (coord.isPolar) {
        var circleRadius = coord.circleRadius,
            center = coord.center,
            startAngle = coord.startAngle,
            endAngle = coord.endAngle;
        clip = new Shape$2.Sector({
          attrs: {
            x: center.x,
            y: center.y,
            r: circleRadius,
            r0: 0,
            startAngle: startAngle,
            endAngle: endAngle
          }
        });
      } else {
        clip = new Shape$2.Rect({
          attrs: {
            x: start.x,
            y: end.y - margin,
            width: width,
            height: height + 2 * margin
          }
        });
      }

      clip.isClip = true;
      return clip;
    }

    function isPointInPlot(point, plot) {
      var x = point.x,
          y = point.y;
      var tl = plot.tl,
          tr = plot.tr,
          br = plot.br;
      return x >= tl.x && x <= tr.x && y >= tl.y && y <= br.y;
    }

    var Helper = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getClip: getClip,
        isPointInPlot: isPointInPlot
    });

    function compare(a, b) {
      return a - b;
    }

    function _isScaleExist(scales, compareScale) {
      var flag = false;
      each(scales, function (scale) {
        var scaleValues = [].concat(scale.values);
        var compareScaleValues = [].concat(compareScale.values);

        if (scale.type === compareScale.type && scale.field === compareScale.field && scaleValues.sort(compare).toString() === compareScaleValues.sort(compare).toString()) {
          flag = true;
          return;
        }
      });
      return flag;
    }

    var Chart = /*#__PURE__*/function (_Base) {
      _inheritsLoose(Chart, _Base);

      Chart.initPlugins = function initPlugins() {
        return {
          _plugins: [],
          _cacheId: 0,
          register: function register(plugins) {
            var p = this._plugins;
            [].concat(plugins).forEach(function (plugin) {
              if (p.indexOf(plugin) === -1) {
                p.push(plugin);
              }
            });
            this._cacheId++;
          },
          unregister: function unregister(plugins) {
            var p = this._plugins;
            [].concat(plugins).forEach(function (plugin) {
              var idx = p.indexOf(plugin);

              if (idx !== -1) {
                p.splice(idx, 1);
              }
            });
            this._cacheId++;
          },
          clear: function clear() {
            this._plugins = [];
            this._cacheId++;
          },
          count: function count() {
            return this._plugins.length;
          },
          getAll: function getAll() {
            return this._plugins;
          },
          notify: function notify(chart, hook, args) {
            var descriptors = this.descriptors(chart);
            var ilen = descriptors.length;
            var i;
            var descriptor;
            var plugin;
            var params;
            var method;

            for (i = 0; i < ilen; ++i) {
              descriptor = descriptors[i];
              plugin = descriptor.plugin;
              method = plugin[hook];

              if (typeof method === 'function') {
                params = [chart].concat(args || []);

                if (method.apply(plugin, params) === false) {
                  return false;
                }
              }
            }

            return true;
          },
          descriptors: function descriptors(chart) {
            var cache = chart._plugins || (chart._plugins = {});

            if (cache.id === this._cacheId) {
              return cache.descriptors;
            }

            var plugins = [];
            var descriptors = [];

            this._plugins.concat(chart && chart.get('plugins') || []).forEach(function (plugin) {
              var idx = plugins.indexOf(plugin);

              if (idx !== -1) {
                return;
              }

              plugins.push(plugin);
              descriptors.push({
                plugin: plugin
              });
            });

            cache.descriptors = descriptors;
            cache.id = this._cacheId;
            return descriptors;
          }
        };
      };

      var _proto = Chart.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        return {
          /**
           * the id of canvas
           * @type {String}
           */
          id: null,

          /** 图表渲染引擎 */
          renderer: 'canvas',
          rendered: false,

          /**
           * padding
           * @type {Array|Number}
           */
          padding: Global.padding,

          /**
           * data
           * @type {Array}
           */
          data: null,

          /**
           * scales of chart
           * @type {Object}
           */
          scales: {},

          /**
           * @private
           * geometry instances
           * @type {Array}
           */
          geoms: [],

          /**
           * scale configuration
           * @type {Object}
           */
          colDefs: null,
          pixelRatio: Global.pixelRatio,

          /**
           * filter options
           * @type {Object}
           */
          filters: null,
          appendPadding: Global.appendPadding
        };
      };

      _proto._syncYScales = function _syncYScales() {
        var syncY = this.get('syncY');

        if (!syncY) {
          return;
        }

        var geoms = this.get('geoms');
        var syncScales = [];
        var min = [];
        var max = [];
        each(geoms, function (geom) {
          var yScale = geom.getYScale();

          if (yScale.isLinear) {
            syncScales.push(yScale);
            min.push(yScale.min);
            max.push(yScale.max);
          }
        });
        min = Math.min.apply(null, min);
        max = Math.max.apply(null, max);
        each(syncScales, function (scale) {
          scale.change({
            min: min
          });
          scale.change({
            max: max
          });
        });
      };

      _proto._getFieldsForLegend = function _getFieldsForLegend() {
        var fields = [];
        var geoms = this.get('geoms');
        each(geoms, function (geom) {
          var attrOptions = geom.get('attrOptions');
          var attrCfg = attrOptions.color;

          if (attrCfg && attrCfg.field && isString(attrCfg.field)) {
            var arr = attrCfg.field.split('*');
            each(arr, function (item) {
              if (fields.indexOf(item) === -1) {
                fields.push(item);
              }
            });
          }
        });
        return fields;
      };

      _proto._getScaleData = function _getScaleData(field) {
        var data = this.get('data');
        var filteredData = this.get('filteredData');

        if (filteredData.length) {
          var legendFields = this._getFieldsForLegend();

          if (legendFields.indexOf(field) === -1) {
            data = filteredData;
          }
        }

        return data;
      } // _updateScales() {
      //   const scaleController = this.get('scaleController');
      //   scaleController.updateScales();
      //   this._adjustScale();
      // }
      ;

      _proto._adjustScale = function _adjustScale() {
        var self = this;
        var scaleController = self.get('scaleController'); // 看起来是为了让柱状图最小或最大都默认从0开始

        var geoms = this.get('geoms');

        for (var i = 0; i < geoms.length; i++) {
          var geom = geoms[i];

          if (geom.get('type') === 'interval') {
            var yScale = geom.getYScale();
            scaleController.adjustStartZero(yScale);
          }
        }
      };

      _proto._removeGeoms = function _removeGeoms() {
        var geoms = this.get('geoms');

        while (geoms.length > 0) {
          var geom = geoms.shift();
          geom.destroy();
        }
      };

      _proto._clearGeoms = function _clearGeoms() {
        var geoms = this.get('geoms');

        for (var i = 0, length = geoms.length; i < length; i++) {
          var geom = geoms[i];
          geom.clear();
        }
      };

      _proto._clearInner = function _clearInner() {
        this._clearGeoms();

        Chart.plugins.notify(this, 'clearInner');
        this.emit(EVENT_CLEAR_INNER);
        this.get('axisController') && this.get('axisController').clear();
      };

      _proto._initFilteredData = function _initFilteredData() {
        var filters = this.get('filters');
        var data = this.get('data') || [];

        if (filters) {
          data = data.filter(function (obj) {
            var rst = true;
            each(filters, function (fn, k) {
              if (fn) {
                rst = fn(obj[k], obj);

                if (!rst) {
                  return false;
                }
              }
            });
            return rst;
          });
        }

        this.set('filteredData', data);
      };

      _proto._changeGeomsData = function _changeGeomsData() {
        var geoms = this.get('geoms');
        var data = this.get('filteredData');

        for (var i = 0, length = geoms.length; i < length; i++) {
          var geom = geoms[i];
          geom.changeData(data);
        }
      };

      _proto._initGeom = function _initGeom(geom) {
        if (geom.get('isInit')) {
          return;
        }

        var coord = this.get('coord');
        var data = this.get('filteredData');
        var colDefs = this.get('colDefs');
        var middlePlot = this.get('middlePlot');
        geom.set('chart', this);
        geom.set('container', middlePlot.addGroup());
        geom.set('data', data);
        geom.set('coord', coord);
        geom.set('colDefs', colDefs);
        geom.init();
        this.emit(EVENT_AFTER_GEOM_INIT, geom);
      };

      _proto._initGeoms = function _initGeoms() {
        var geoms = this.get('geoms');

        for (var i = 0, length = geoms.length; i < length; i++) {
          this._initGeom(geoms[i]);
        }
      };

      _proto._initCoord = function _initCoord() {
        var plot = this.get('plotRange');
        var coordCfg = mix({
          type: 'cartesian'
        }, this.get('coordCfg'), {
          plot: plot
        });
        var type = coordCfg.type;
        var C = Base$1[upperFirst(type)];
        var coord = new C(coordCfg);
        this.set('coord', coord);
      };

      _proto._initLayout = function _initLayout() {
        var padding = this.get('_padding');

        if (!padding) {
          padding = this.get('margin') || this.get('padding');
          padding = parsePadding(padding);
        }

        var top = padding[0] === 'auto' ? 0 : padding[0];
        var right = padding[1] === 'auto' ? 0 : padding[1];
        var bottom = padding[2] === 'auto' ? 0 : padding[2];
        var left = padding[3] === 'auto' ? 0 : padding[3];
        var width = this.get('width');
        var height = this.get('height');
        var start = {
          x: left,
          y: top
        };
        var end = {
          x: width - right,
          y: height - bottom
        };
        var plot = this.get('plot');

        if (plot) {
          plot.reset(start, end);
          return;
        }

        var newPlot = new Plot({
          start: start,
          end: end
        });
        this.set('plotRange', newPlot);
        this.set('plot', newPlot);
      };

      _proto._initCanvas = function _initCanvas() {
        var self = this;

        try {
          var canvas = createCanvas({
            renderer: self.get('renderer'),
            el: self.get('el') || self.get('id'),
            context: self.get('context'),
            pixelRatio: self.get('pixelRatio'),
            width: self.get('width'),
            height: self.get('height'),
            fontFamily: Global.fontFamily,
            aria: self.get('aria'),
            title: self.get('title'),
            landscape: self.get('landscape')
          });
          self.set('canvas', canvas);
          self.set('el', canvas.get('el'));
          self.set('width', canvas.get('width'));
          self.set('height', canvas.get('height'));
        } catch (error) {
          throw error;
        }

        Chart.plugins.notify(self, 'afterCanvasInit');
      };

      _proto._initLayers = function _initLayers() {
        var canvas = this.get('canvas');
        this.set('backPlot', canvas.addGroup());
        this.set('middlePlot', canvas.addGroup({
          zIndex: 10
        }));
        this.set('frontPlot', canvas.addGroup({
          zIndex: 20
        }));
      };

      _proto._initEvents = function _initEvents() {
        var _this2 = this;

        // 数据更新后的一些更新
        this.on(EVENT_AFTER_DATA_CHANGE, function () {
          // 数据更新后，重新设置filterdata
          _this2._initFilteredData(); // 更新geoms里的数据


          _this2._changeGeomsData();
        }); // 大小变化后的一些更新

        this.on(EVENT_AFTER_SIZE_CHANGE, function () {
          _this2._initLayout(); // layout变化后，坐标轴也需要做相应的变化


          var coord = _this2.get('coord');

          if (coord) {
            coord.reset(_this2.get('plot'));
          }
        });
      };

      _proto._initScaleController = function _initScaleController() {
        var scaleController = new ScaleController({
          chart: this
        }); // 让colDefs 和 scaleController.defs 用同一个对象，这样就不用考虑同步的问题

        this.set('colDefs', scaleController.defs); // 已经实例化的scales 也保持统一个对象

        this.set('scales', scaleController.scales);
        this.set('scaleController', scaleController);
      };

      _proto._clearScaleController = function _clearScaleController() {
        var scaleController = this.get('scaleController');
        scaleController.clear();
      };

      _proto._init = function _init() {
        var self = this;

        self._initCanvas();

        self._initLayout();

        self._initLayers();

        self._initEvents();

        self._initScaleController();

        self.set('axisController', new AxisController({
          frontPlot: self.get('frontPlot').addGroup({
            className: 'axisContainer'
          }),
          backPlot: self.get('backPlot').addGroup({
            className: 'axisContainer'
          }),
          chart: self
        }));
        Chart.plugins.notify(self, 'init');
      };

      function Chart(cfg) {
        var _this;

        _this = _Base.call(this, cfg) || this;

        var self = _assertThisInitialized(_this);

        each(Geom, function (geomConstructor, className) {
          var methodName = lowerFirst(className);

          self[methodName] = function (cfg) {
            var geom = new geomConstructor(cfg);
            self.addGeom(geom);
            return geom;
          };
        });

        self._init();

        return _this;
      }

      _proto.init = function init() {
        // 初始filterData
        this._initFilteredData(); // initialization coordinate instance


        this._initCoord();

        Chart.plugins.notify(this, 'beforeGeomInit'); // init all geometry instances

        this._initGeoms(); // 多 Y 轴的情况时，统一 Y 轴的数值范围。


        this._syncYScales(); // do some adjust for data


        this._adjustScale();

        this.emit(EVENT_AFTER_INIT);
      }
      /**
       * set data and some scale configuration
       * @chainable
       * @param  {Array} data the dataset to visualize
       * @param  {Object} colDefs the configuration for scales
       * @return {Chart} return the chart instance
       */
      ;

      _proto.source = function source(data, colDefs) {
        this.set('data', data);

        if (colDefs) {
          this.scale(colDefs);
        }

        return this;
      };

      _proto.scale = function scale(field, cfg) {
        var scaleController = this.get('scaleController');
        scaleController.setFieldDef(field, cfg);
        return this;
      }
      /**
       * configure the axis
       * @chainable
       * @param  {String|Boolean} field the field name of data
       * @param  {Object} cfg configuration for axis
       * @return {Chart} return the chart instance
       */
      ;

      _proto.axis = function axis(field, cfg) {
        var axisController = this.get('axisController');

        if (!field) {
          axisController.axisCfg = null;
        } else {
          axisController.axisCfg = axisController.axisCfg || {};
          axisController.axisCfg[field] = cfg;
        }

        return this;
      }
      /**
       * configure the coordinate
       * @chainable
       * @param  {String} type set the type of coodinate
       * @param  {Object} cfg configuration for coordinate
       * @return {Chart} return the chart instance
       */
      ;

      _proto.coord = function coord(type, cfg) {
        var coordCfg;

        if (isObject(type)) {
          coordCfg = type;
        } else {
          coordCfg = cfg || {};
          coordCfg.type = type || 'cartesian';
        }

        this.set('coordCfg', coordCfg);
        return this;
      };

      _proto.filter = function filter(field, condition) {
        var filters = this.get('filters') || {};
        filters[field] = condition;
        this.set('filters', filters); // 如果已经render过，则再重新触发一次change

        if (this.get('rendered')) {
          this.emit(EVENT_AFTER_DATA_CHANGE, this.get('data'));
        }
      }
      /**
       * render the chart
       * @chainable
       * @return {Chart} return the chart instance
       */
      ;

      _proto.render = function render() {
        var rendered = this.get('rendered');
        var canvas = this.get('canvas');
        var geoms = this.get('geoms'); // 已经渲染过

        if (rendered) {
          this._initGeoms();

          this._adjustScale();
        } else {
          this.init();
          this.set('rendered', true);
        }

        this.emit(EVENT_BEFORE_RENDER);
        Chart.plugins.notify(this, 'beforeGeomDraw');

        this._renderAxis();

        var middlePlot = this.get('middlePlot');

        if (this.get('limitInPlot') && !middlePlot.attr('clip')) {
          var coord = this.get('coord');
          var clip = getClip(coord);
          clip.set('canvas', middlePlot.get('canvas'));
          middlePlot.attr('clip', clip);
        }

        this.emit(EVENT_BEFORE_GEOM_DRAW);

        for (var i = 0, length = geoms.length; i < length; i++) {
          var geom = geoms[i];
          geom.paint();
        }

        this.emit(EVENT_AFTER_GEOM_DRAW);
        Chart.plugins.notify(this, 'afterGeomDraw');
        canvas.sort();
        this.get('frontPlot').sort();
        Chart.plugins.notify(this, 'beforeCanvasDraw');
        canvas.draw();
        this.emit(EVENT_AFTER_RENDER);
        return this;
      }
      /**
       * clear the chart, include geometris and all the shapes
       * @chainable
       * @return {Chart} return the chart
       */
      ;

      _proto.clear = function clear() {
        Chart.plugins.notify(this, 'clear');
        this.emit(EVENT_CLEAR);

        this._clearInner();

        this._removeGeoms();

        this._clearScaleController();

        this.set('legendItems', null);
        this.set('filters', null);
        this.set('isUpdate', false);
        this.set('_padding', null);
        this.set('rendered', false);
        var canvas = this.get('canvas');
        canvas.draw();
        return this;
      };

      _proto.repaint = function repaint() {
        // 如果在没有render之前就repaint的，就直接return退出
        var rendered = this.get('rendered');

        if (!rendered) {
          return;
        }

        this.set('isUpdate', true);
        this.set('legendItems', null);
        Chart.plugins.notify(this, 'repaint');

        this._clearInner();

        this.emit(EVENT_REPAINT);
        this.render();
      };

      _proto.changeData = function changeData(data) {
        this.emit(EVENT_BEFORE_DATA_CHANGE, data);
        this.set('data', data);
        Chart.plugins.notify(this, 'changeData');
        this.emit(EVENT_AFTER_DATA_CHANGE, data);
        this.set('_padding', null);
        this.repaint();
      };

      _proto.changeSize = function changeSize(width, height) {
        if (width) {
          this.set('width', width);
        } else {
          width = this.get('width');
        }

        if (height) {
          this.set('height', height);
        } else {
          height = this.get('height');
        }

        var canvas = this.get('canvas');
        canvas.changeSize(width, height);
        this.emit(EVENT_AFTER_SIZE_CHANGE, {
          width: width,
          height: height
        });
        this.repaint();
        return this;
      };

      _proto.destroy = function destroy() {
        this.clear();
        var canvas = this.get('canvas');
        canvas.destroy();
        Chart.plugins.notify(this, 'afterCanvasDestroyed');

        if (this._interactions) {
          each(this._interactions, function (interaction) {
            interaction.destroy();
          });
        }

        _Base.prototype.destroy.call(this);
      }
      /**
       * calculate dataset's position on canvas
       * @param  {Object} record the dataset
       * @return {Object} return the position
       */
      ;

      _proto.getPosition = function getPosition(record) {
        var self = this;
        var coord = self.get('coord');
        var xScale = self.getXScale();
        var xField = xScale.field;
        var yScales = self.getYScales(); // default first

        var yScale = yScales[0];
        var yField = yScale.field;

        for (var i = 0, len = yScales.length; i < len; i++) {
          var scale = yScales[i];
          var field = scale.field;

          if (record[field]) {
            yScale = scale;
            yField = field;
            break;
          }
        }

        var x = xScale.scale(record[xField]);
        var y = yScale.scale(record[yField]);
        return coord.convertPoint({
          x: x,
          y: y
        });
      }
      /**
       * get the data item of the point
       * @param  {Object} point canvas position
       * @return {Object} return the data item
       */
      ;

      _proto.getRecord = function getRecord(point) {
        var self = this;
        var coord = self.get('coord');
        var xScale = self.getXScale();
        var yScale = self.getYScales()[0];
        var invertPoint = coord.invertPoint(point);
        var record = {};
        record[xScale.field] = xScale.invert(invertPoint.x);
        record[yScale.field] = yScale.invert(invertPoint.y);
        return record;
      }
      /**
       * get the dataset of the point
       * @param  {Object} point canvas position
       * @return {Array} return the dataset
      **/
      ;

      _proto.getSnapRecords = function getSnapRecords(point) {
        var geom = this.get('geoms')[0];
        var data = [];

        if (geom) {
          // need to judge
          data = geom.getSnapRecords(point);
        }

        return data;
      }
      /**
       * creat scale instances
       * @param  {String} field field name of data
       * @return {Scale} return the scale
       */
      ;

      _proto.createScale = function createScale(field) {
        var data = this._getScaleData(field);

        var scaleController = this.get('scaleController');
        return scaleController.createScale(field, data);
      }
      /**
       * @protected
       * add geometry instance to geoms
       * @param {Geom} geom geometry instance
       */
      ;

      _proto.addGeom = function addGeom(geom) {
        var geoms = this.get('geoms');
        geoms.push(geom);
      }
      /**
       * get the scale of x axis
       * @return {Scale} return the scale
       */
      ;

      _proto.getXScale = function getXScale() {
        var self = this;
        var geoms = self.get('geoms');
        var xScale = geoms[0].getXScale();
        return xScale;
      }
      /**
       * get the scale of y axis
       * @return {Array} return the scale
       */
      ;

      _proto.getYScales = function getYScales() {
        var geoms = this.get('geoms');
        var rst = [];
        each(geoms, function (geom) {
          var yScale = geom.getYScale();

          if (rst.indexOf(yScale) === -1) {
            rst.push(yScale);
          }
        });
        return rst;
      };

      _proto.getLegendItems = function getLegendItems() {
        if (this.get('legendItems')) {
          return this.get('legendItems');
        }

        var legendItems = {};
        var scales = [];
        var geoms = this.get('geoms');
        each(geoms, function (geom) {
          var colorAttr = geom.getAttr('color');

          if (colorAttr) {
            var scale = colorAttr.getScale('color'); // 只支持分类图例

            if (scale.isCategory && !_isScaleExist(scales, scale)) {
              scales.push(scale);
              var field = scale.field;
              var ticks = scale.getTicks();
              var items = [];
              each(ticks, function (tick) {
                var text = tick.text;
                var name = text;
                var scaleValue = tick.value;
                var value = scale.invert(scaleValue);
                var color = colorAttr.mapping(value).join('') || Global.defaultColor;
                var marker = {
                  fill: color,
                  radius: 3,
                  symbol: 'circle',
                  stroke: '#ffffff'
                };
                items.push({
                  name: name,
                  // for display
                  dataValue: value,
                  // the origin value
                  checked: true,
                  marker: marker
                });
              });
              legendItems[field] = items;
            }
          }
        });
        this.set('legendItems', legendItems);
        return legendItems;
      } // register the plugins
      ;

      _proto.registerPlugins = function registerPlugins(plugins) {
        var self = this;
        var chartPlugins = self.get('plugins') || [];

        if (!isArray(chartPlugins)) {
          chartPlugins = [chartPlugins];
        }

        [].concat(plugins).forEach(function (plugin) {
          if (chartPlugins.indexOf(plugin) === -1) {
            plugin.init && plugin.init(self); // init

            chartPlugins.push(plugin);
          }
        });
        Chart.plugins._cacheId++;
        self.set('plugins', chartPlugins);
      };

      _proto._renderAxis = function _renderAxis() {
        var axisController = this.get('axisController');
        var xScale = this.getXScale();
        var yScales = this.getYScales();
        var coord = this.get('coord');
        Chart.plugins.notify(this, 'beforeRenderAxis');
        axisController.createAxis(coord, xScale, yScales);
      };

      _proto._isAutoPadding = function _isAutoPadding() {
        if (this.get('_padding')) {
          return false;
        }

        var padding = this.get('padding');

        if (isArray(padding)) {
          return padding.indexOf('auto') !== -1;
        }

        return padding === 'auto';
      };

      _proto._updateLayout = function _updateLayout(padding) {
        var width = this.get('width');
        var height = this.get('height');
        var start = {
          x: padding[3],
          y: padding[0]
        };
        var end = {
          x: width - padding[1],
          y: height - padding[2]
        };
        var plot = this.get('plot');
        var coord = this.get('coord');
        plot.reset(start, end);
        coord.reset(plot);
      }
      /**
       * 是否为横屏展示
       *
       * @param {Boolean} landscape 是否为横屏
       */
      ;

      _proto.landscape = function landscape(_landscape) {
        var canvas = this.get('canvas');
        canvas.set('landscape', _landscape);
      };

      return Chart;
    }(Base);

    Chart.plugins = Chart.initPlugins();

    var track = function track() {
      return null;
    };

    /**
     * @fileOverview shape util
     * @author dxq613@gmail.com
     */

    function splitPoints(obj) {
      var points = [];
      var x = obj.x;
      var y = obj.y;
      y = isArray(y) ? y : [y];
      y.forEach(function (yItem, index) {
        var point = {
          x: isArray(x) ? x[index] : x,
          y: yItem
        };
        points.push(point);
      });
      return points;
    }

    function splitArray(data, yField, connectNulls) {
      if (!data.length) return [];
      var arr = [];
      var tmp = [];
      var yValue;
      each(data, function (obj) {
        yValue = obj._origin ? obj._origin[yField] : obj[yField];

        if (connectNulls) {
          if (!isNil(yValue)) {
            tmp.push(obj);
          }
        } else {
          if (isArray(yValue) && isNil(yValue[0]) || isNil(yValue)) {
            if (tmp.length) {
              arr.push(tmp);
              tmp = [];
            }
          } else {
            tmp.push(obj);
          }
        }
      });

      if (tmp.length) {
        arr.push(tmp);
      }

      return arr;
    }

    var SHAPES = ['circle', 'hollowCircle', 'rect'];
    var Point = Shape$1.registerFactory('point', {
      defaultShapeType: 'circle',
      getDefaultPoints: function getDefaultPoints(pointInfo) {
        return splitPoints(pointInfo);
      }
    });

    function getPointsCfg(cfg) {
      var style = {
        lineWidth: 0,
        stroke: cfg.color,
        fill: cfg.color
      };

      if (cfg.size) {
        style.size = cfg.size;
      }

      mix(style, cfg.style);
      return mix({}, Global.shape.point, style);
    }

    function drawShape(cfg, container, shape) {
      if (cfg.size === 0) return;
      var pointCfg = getPointsCfg(cfg);
      var size = pointCfg.r || pointCfg.size;
      var x = cfg.x;
      var y = !isArray(cfg.y) ? [cfg.y] : cfg.y;

      if (shape === 'hollowCircle') {
        pointCfg.lineWidth = 1;
        pointCfg.fill = null;
      }

      for (var i = 0, len = y.length; i < len; i++) {
        if (shape === 'rect') {
          return container.addShape('Rect', {
            className: 'point',
            attrs: mix({
              x: x - size,
              y: y[i] - size,
              width: size * 2,
              height: size * 2
            }, pointCfg)
          });
        }

        return container.addShape('Circle', {
          className: 'point',
          attrs: mix({
            x: x,
            y: y[i],
            r: size
          }, pointCfg)
        });
      }
    }

    each(SHAPES, function (shapeType) {
      Shape$1.registerShape('point', shapeType, {
        draw: function draw(cfg, container) {
          return drawShape(cfg, container, shapeType);
        }
      });
    });

    var Point$1 = /*#__PURE__*/function (_Geom) {
      _inheritsLoose(Point, _Geom);

      function Point() {
        return _Geom.apply(this, arguments) || this;
      }

      var _proto = Point.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var cfg = _Geom.prototype.getDefaultCfg.call(this);

        cfg.type = 'point';
        cfg.shapeType = 'point';
        cfg.generatePoints = false;
        return cfg;
      };

      _proto.draw = function draw(data, shapeFactory) {
        var self = this;
        var container = self.get('container');
        each(data, function (obj) {
          var shape = obj.shape;
          var cfg = self.getDrawCfg(obj);

          if (isArray(obj.y)) {
            var hasStack = self.hasAdjust('stack');
            each(obj.y, function (y, idx) {
              cfg.y = y;

              if (!hasStack || idx !== 0) {
                self.drawShape(shape, obj, cfg, container, shapeFactory);
              }
            });
          } else if (!isNil(obj.y)) {
            self.drawShape(shape, obj, cfg, container, shapeFactory);
          }
        });
      };

      return Point;
    }(Geom);

    Geom.Point = Point$1;

    var Line$2 = Shape$1.registerFactory('line', {
      defaultShapeType: 'line'
    });

    function getStyle$1(cfg) {
      var style = {
        strokeStyle: cfg.color
      };

      if (cfg.size >= 0) {
        style.lineWidth = cfg.size;
      }

      mix(style, cfg.style);
      return mix({}, Global.shape.line, style);
    }

    function drawLines(cfg, container, style, smooth) {
      var points = cfg.points;

      if (points.length && isArray(points[0].y)) {
        var topPoints = [];
        var bottomPoints = [];

        for (var i = 0, len = points.length; i < len; i++) {
          var point = points[i];
          var tmp = splitPoints(point);
          bottomPoints.push(tmp[0]);
          topPoints.push(tmp[1]);
        }

        if (cfg.isInCircle) {
          topPoints.push(topPoints[0]);
          bottomPoints.push(bottomPoints[0]);
        }

        if (cfg.isStack) {
          return container.addShape('Polyline', {
            className: 'line',
            attrs: mix({
              points: topPoints,
              smooth: smooth
            }, style)
          });
        }

        var topShape = container.addShape('Polyline', {
          className: 'line',
          attrs: mix({
            points: topPoints,
            smooth: smooth
          }, style)
        });
        var bottomShape = container.addShape('Polyline', {
          className: 'line',
          attrs: mix({
            points: bottomPoints,
            smooth: smooth
          }, style)
        });
        return [topShape, bottomShape];
      }

      if (cfg.isInCircle) {
        points.push(points[0]);
      }

      return container.addShape('Polyline', {
        className: 'line',
        attrs: mix({
          points: points,
          smooth: smooth
        }, style)
      });
    }

    var SHAPES$1 = ['line', 'smooth', 'dash'];
    each(SHAPES$1, function (shapeType) {
      Shape$1.registerShape('line', shapeType, {
        draw: function draw(cfg, container) {
          var smooth = shapeType === 'smooth';
          var style = getStyle$1(cfg);

          if (shapeType === 'dash') {
            style.lineDash = Global.lineDash;
          }

          return drawLines(cfg, container, style, smooth);
        }
      });
    });

    var Path = /*#__PURE__*/function (_Geom) {
      _inheritsLoose(Path, _Geom);

      function Path() {
        return _Geom.apply(this, arguments) || this;
      }

      var _proto = Path.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var cfg = _Geom.prototype.getDefaultCfg.call(this);

        cfg.type = 'path';
        cfg.shapeType = 'line';
        return cfg;
      };

      _proto.getDrawCfg = function getDrawCfg(obj) {
        var cfg = _Geom.prototype.getDrawCfg.call(this, obj);

        cfg.isStack = this.hasAdjust('stack');
        return cfg;
      };

      _proto.draw = function draw(data, shapeFactory) {
        var self = this;
        var container = self.get('container');
        var yScale = self.getYScale();
        var connectNulls = self.get('connectNulls');
        var splitArrayObj = splitArray(data, yScale.field, connectNulls);
        var cfg = this.getDrawCfg(data[0]);
        cfg.origin = data;
        each(splitArrayObj, function (subData, splitedIndex) {
          cfg.splitedIndex = splitedIndex;
          cfg.points = subData;
          self.drawShape(cfg.shape, data[0], cfg, container, shapeFactory);
        });
      };

      return Path;
    }(Geom);

    Geom.Path = Path;

    var Line$3 = /*#__PURE__*/function (_Path) {
      _inheritsLoose(Line, _Path);

      function Line() {
        return _Path.apply(this, arguments) || this;
      }

      var _proto = Line.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var cfg = _Path.prototype.getDefaultCfg.call(this);

        cfg.type = 'line';
        cfg.sortable = true;
        return cfg;
      };

      return Line;
    }(Path);

    Geom.Line = Line$3;

    function equals(v1, v2) {
      return Math.abs(v1 - v2) < 0.00001;
    }

    function notEmpty(value) {
      return !isNaN(value) && !isNil(value);
    }

    function filterPoints(points) {
      var filteredPoints = []; // filter the point which x or y is NaN

      for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];

        if (notEmpty(point.x) && notEmpty(point.y)) {
          filteredPoints.push(point);
        }
      }

      return filteredPoints;
    }

    function equalsCenter(points, center) {
      var eqls = true;
      each(points, function (point) {
        if (!equals(point.x, center.x) || !equals(point.y, center.y)) {
          eqls = false;
          return false;
        }
      });
      return eqls;
    }

    function drawRectShape(topPoints, bottomPoints, container, style, isSmooth) {
      var shape;
      var points = topPoints.concat(bottomPoints);

      if (isSmooth) {
        shape = container.addShape('Custom', {
          className: 'area',
          attrs: mix({
            points: points
          }, style),
          createPath: function createPath(context) {
            var constaint = [[0, 0], [1, 1]];
            var points = filterPoints(this._attrs.attrs.points);
            var pointsLen = points.length;
            var topPoints = points.slice(0, pointsLen / 2);
            var bottomPoints = points.slice(pointsLen / 2, pointsLen);
            var topSps = catmullRom2bezier(topPoints, false, constaint);
            context.beginPath();
            context.moveTo(topPoints[0].x, topPoints[0].y);

            for (var i = 0, n = topSps.length; i < n; i++) {
              var sp = topSps[i];
              context.bezierCurveTo(sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]);
            }

            if (bottomPoints.length) {
              var bottomSps = catmullRom2bezier(bottomPoints, false, constaint);
              context.lineTo(bottomPoints[0].x, bottomPoints[0].y);

              for (var _i = 0, _n = bottomSps.length; _i < _n; _i++) {
                var _sp = bottomSps[_i];
                context.bezierCurveTo(_sp[1], _sp[2], _sp[3], _sp[4], _sp[5], _sp[6]);
              }
            }

            context.closePath();
          },
          calculateBox: function calculateBox() {
            var points = filterPoints(this._attrs.attrs.points);
            return getBBoxFromPoints(points);
          }
        });
      } else {
        shape = container.addShape('Polyline', {
          className: 'area',
          attrs: mix({
            points: points
          }, style)
        });
      }

      return shape;
    }

    function drawShape$1(cfg, container, isSmooth) {
      var self = this;
      var points = cfg.points;
      var topPoints = [];
      var bottomPoints = [];
      each(points, function (point) {
        bottomPoints.push(point[0]);
        topPoints.push(point[1]);
      });
      var style = mix({
        fillStyle: cfg.color
      }, Global.shape.area, cfg.style);
      bottomPoints.reverse();
      topPoints = self.parsePoints(topPoints);
      bottomPoints = self.parsePoints(bottomPoints);

      if (cfg.isInCircle) {
        topPoints.push(topPoints[0]);
        bottomPoints.unshift(bottomPoints[bottomPoints.length - 1]);

        if (equalsCenter(bottomPoints, cfg.center)) {
          bottomPoints = [];
        }
      }

      return drawRectShape(topPoints, bottomPoints, container, style, isSmooth);
    }

    var Area = Shape$1.registerFactory('area', {
      defaultShapeType: 'area',
      getDefaultPoints: function getDefaultPoints(obj) {
        var x = obj.x;
        var y = obj.y;
        var y0 = obj.y0;
        y = isArray(y) ? y : [y0, y];
        var points = [];
        points.push({
          x: x,
          y: y[0]
        }, {
          x: x,
          y: y[1]
        });
        return points;
      }
    });
    var SHAPES$2 = ['area', 'smooth'];
    each(SHAPES$2, function (shapeType) {
      Shape$1.registerShape('area', shapeType, {
        draw: function draw(cfg, container) {
          var smooth = shapeType === 'smooth';
          return drawShape$1.call(this, cfg, container, smooth);
        }
      });
    });

    var Area$1 = /*#__PURE__*/function (_Geom) {
      _inheritsLoose(Area, _Geom);

      function Area() {
        return _Geom.apply(this, arguments) || this;
      }

      var _proto = Area.prototype;

      /**
       * get the default configuration
       * @protected
       * @return {Object} return the result
       */
      _proto.getDefaultCfg = function getDefaultCfg() {
        var cfg = _Geom.prototype.getDefaultCfg.call(this);

        cfg.type = 'area';
        cfg.shapeType = 'area';
        cfg.generatePoints = true;
        cfg.sortable = true;
        return cfg;
      };

      _proto.draw = function draw(data, shapeFactory) {
        var self = this;
        var container = self.get('container');
        var cfg = this.getDrawCfg(data[0]);
        var yScale = self.getYScale();
        var connectNulls = self.get('connectNulls');
        var splitArrayfn = splitArray(data, yScale.field, connectNulls);
        cfg.origin = data;
        each(splitArrayfn, function (subData, splitedIndex) {
          cfg.splitedIndex = splitedIndex;
          var points = subData.map(function (obj) {
            return obj.points;
          });
          cfg.points = points;
          self.drawShape(cfg.shape, data[0], cfg, container, shapeFactory);
        });
      };

      return Area;
    }(Geom);

    Geom.Area = Area$1;

    /**
     * @fileOverview Utility for calculate the with ratui in x axis
     * @author sima.zhang1990@gmail.com
     * @author dxq613@gmail.com
     */
    var SizeMixin = {
      initEvent: function initEvent() {
        var _this = this;

        var chart = this.get('chart');

        if (!chart) {
          return;
        }

        chart.on(EVENT_AFTER_SIZE_CHANGE, function () {
          _this.set('_width', null);
        });
      },
      getDefaultSize: function getDefaultSize() {
        var defaultSize = this.get('defaultSize');

        if (!defaultSize) {
          var coord = this.get('coord');
          var xScale = this.getXScale();
          var dataArray = this.get('dataArray');
          var values = uniq(xScale.values);
          var count = values.length;
          var range = xScale.range;
          var normalizeSize = 1 / count;
          var widthRatio = 1;

          if (coord && coord.isPolar) {
            if (coord.transposed && count > 1) {
              widthRatio = Global.widthRatio.multiplePie;
            } else {
              widthRatio = Global.widthRatio.rose;
            }
          } else {
            if (xScale.isLinear) {
              normalizeSize *= range[1] - range[0];
            }

            widthRatio = Global.widthRatio.column;
          }

          normalizeSize *= widthRatio;

          if (this.hasAdjust('dodge')) {
            normalizeSize = normalizeSize / dataArray.length;
          }

          defaultSize = normalizeSize;
          this.set('defaultSize', defaultSize);
        }

        return defaultSize;
      },
      getDimWidth: function getDimWidth(dimName) {
        var coord = this.get('coord');
        var start = coord.convertPoint({
          x: 0,
          y: 0
        });
        var end = coord.convertPoint({
          x: dimName === 'x' ? 1 : 0,
          y: dimName === 'x' ? 0 : 1
        });
        var width = 0;

        if (start && end) {
          width = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        }

        return width;
      },
      _getWidth: function _getWidth() {
        var width = this.get('_width');

        if (!width) {
          var coord = this.get('coord');

          if (coord && coord.isPolar && !coord.transposed) {
            width = (coord.endAngle - coord.startAngle) * coord.circleRadius;
          } else {
            width = this.getDimWidth('x');
          }

          this.set('_width', width);
        }

        return width;
      },
      _toNormalizedSize: function _toNormalizedSize(size) {
        var width = this._getWidth();

        return size / width;
      },
      _toCoordSize: function _toCoordSize(normalizeSize) {
        var width = this._getWidth();

        return width * normalizeSize;
      },
      getNormalizedSize: function getNormalizedSize(obj) {
        var size = this.getAttrValue('size', obj);

        if (isNil(size)) {
          size = this.getDefaultSize();
        } else {
          size = this._toNormalizedSize(size);
        }

        return size;
      },
      getSize: function getSize(obj) {
        var size = this.getAttrValue('size', obj);

        if (isNil(size)) {
          var normalizeSize = this.getDefaultSize();
          size = this._toCoordSize(normalizeSize);
        }

        return size;
      }
    };

    function getRectPoints(cfg) {
      var x = cfg.x,
          y = cfg.y,
          y0 = cfg.y0,
          size = cfg.size;
      var ymin = y0;
      var ymax = y;

      if (isArray(y)) {
        ymax = y[1];
        ymin = y[0];
      }

      var xmin;
      var xmax;

      if (isArray(x)) {
        xmin = x[0];
        xmax = x[1];
      } else {
        xmin = x - size / 2;
        xmax = x + size / 2;
      }

      return [{
        x: xmin,
        y: ymin
      }, {
        x: xmin,
        y: ymax
      }, {
        x: xmax,
        y: ymax
      }, {
        x: xmax,
        y: ymin
      }];
    }

    function getRectRange(points) {
      var xValues = [];
      var yValues = [];

      for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];
        xValues.push(point.x);
        yValues.push(point.y);
      }

      var xMin = Math.min.apply(null, xValues);
      var yMin = Math.min.apply(null, yValues);
      var xMax = Math.max.apply(null, xValues);
      var yMax = Math.max.apply(null, yValues);
      return {
        x: xMin,
        y: yMin,
        width: xMax - xMin,
        height: yMax - yMin
      };
    }

    function getMiddlePoint(a, b) {
      var x = (a.x - b.x) / 2 + b.x;
      var y = (a.y - b.y) / 2 + b.y;
      return {
        x: x,
        y: y
      };
    }

    var Interval = Shape$1.registerFactory('interval', {
      defaultShapeType: 'rect',
      getDefaultPoints: function getDefaultPoints(cfg) {
        return getRectPoints(cfg);
      }
    });
    Shape$1.registerShape('interval', 'rect', {
      draw: function draw(cfg, container) {
        var points = this.parsePoints(cfg.points);
        var style = mix({
          fill: cfg.color
        }, Global.shape.interval, cfg.style);

        if (cfg.isInCircle) {
          var newPoints = points.slice(0);

          if (this._coord.transposed) {
            newPoints = [points[0], points[3], points[2], points[1]];
          }

          var _cfg$center = cfg.center,
              x = _cfg$center.x,
              y = _cfg$center.y;
          var v = [1, 0];
          var v0 = [newPoints[0].x - x, newPoints[0].y - y];
          var v1 = [newPoints[1].x - x, newPoints[1].y - y];
          var v2 = [newPoints[2].x - x, newPoints[2].y - y];
          var startAngle = Vector2.angleTo(v, v1);
          var endAngle = Vector2.angleTo(v, v2);
          var r0 = Vector2.length(v0);
          var r = Vector2.length(v1);

          if (startAngle >= 1.5 * Math.PI) {
            startAngle = startAngle - 2 * Math.PI;
          }

          if (endAngle >= 1.5 * Math.PI) {
            endAngle = endAngle - 2 * Math.PI;
          }

          return container.addShape('Sector', {
            className: 'interval',
            attrs: mix({
              x: x,
              y: y,
              r: r,
              r0: r0,
              startAngle: startAngle,
              endAngle: endAngle
            }, style)
          });
        }

        var rectCfg = getRectRange(points);
        return container.addShape('rect', {
          className: 'interval',
          attrs: mix(rectCfg, style)
        });
      }
    }); // 金字塔 和 漏斗图

    ['pyramid', 'funnel'].forEach(function (shapeType) {
      Shape$1.registerShape('interval', shapeType, {
        getPoints: function getPoints(cfg) {
          cfg.size = cfg.size * 2; // 漏斗图的 size 是柱状图的两倍

          return getRectPoints(cfg);
        },
        draw: function draw(cfg, container) {
          var points = this.parsePoints(cfg.points);
          var nextPoints = this.parsePoints(cfg.nextPoints);
          var polygonPoints = null;

          if (nextPoints) {
            polygonPoints = [points[0], points[1], nextPoints[1], nextPoints[0]];
          } else {
            polygonPoints = [points[0], points[1]]; // pyramid 顶部是三角形，所以取中心点就好了，funnel顶部是长方形

            if (shapeType === 'pyramid') {
              polygonPoints.push(getMiddlePoint(points[2], points[3]));
            } else {
              polygonPoints.push(points[2], points[3]);
            }
          }

          var attrs = mix({
            fill: cfg.color,
            points: polygonPoints
          }, Global.shape.interval, cfg.style);
          return container.addShape('polygon', {
            className: 'interval',
            attrs: attrs
          });
        }
      });
    });

    var Interval$1 = /*#__PURE__*/function (_Geom) {
      _inheritsLoose(Interval, _Geom);

      var _proto = Interval.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var cfg = _Geom.prototype.getDefaultCfg.call(this);

        cfg.type = 'interval';
        cfg.shapeType = 'interval';
        cfg.generatePoints = true;
        return cfg;
      };

      function Interval(cfg) {
        var _this;

        _this = _Geom.call(this, cfg) || this;
        mix(_assertThisInitialized(_this), SizeMixin);
        return _this;
      }

      _proto.init = function init() {
        _Geom.prototype.init.call(this); // 绑定事件


        this.initEvent();
      };

      _proto.createShapePointsCfg = function createShapePointsCfg(obj) {
        var cfg = _Geom.prototype.createShapePointsCfg.call(this, obj);

        cfg.size = this.getNormalizedSize(obj);
        return cfg;
      };

      _proto.clearInner = function clearInner() {
        _Geom.prototype.clearInner.call(this);

        this.set('defaultSize', null);
      };

      return Interval;
    }(Geom);

    Geom.Interval = Interval$1;

    var Polygon$1 = Shape$1.registerFactory('polygon', {
      defaultShapeType: 'polygon',
      getDefaultPoints: function getDefaultPoints(pointInfo) {
        var points = [];
        var x = pointInfo.x,
            y = pointInfo.y;

        for (var i = 0, len = x.length; i < len; i++) {
          points.push({
            x: x[i],
            y: y[i]
          });
        }

        return points;
      }
    });
    Shape$1.registerShape('polygon', 'polygon', {
      draw: function draw(cfg, container) {
        var points = this.parsePoints(cfg.points);
        var style = mix({
          fill: cfg.color,
          points: points
        }, cfg.style);
        return container.addShape('Polygon', {
          className: 'polygon',
          attrs: style
        });
      }
    });

    var Polygon$2 = /*#__PURE__*/function (_Geom) {
      _inheritsLoose(Polygon, _Geom);

      function Polygon() {
        return _Geom.apply(this, arguments) || this;
      }

      var _proto = Polygon.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var cfg = _Geom.prototype.getDefaultCfg.call(this);

        cfg.type = 'polygon';
        cfg.shapeType = 'polygon';
        cfg.generatePoints = true;
        return cfg;
      };

      _proto.createShapePointsCfg = function createShapePointsCfg(obj) {
        var cfg = _Geom.prototype.createShapePointsCfg.call(this, obj);

        var self = this;
        var x = cfg.x;
        var y = cfg.y;
        var temp;

        if (!(isArray(x) && isArray(y))) {
          var xScale = self.getXScale();
          var yScale = self.getYScale();
          var xCount = xScale.values ? xScale.values.length : xScale.ticks.length;
          var yCount = yScale.values ? yScale.values.length : yScale.ticks.length;
          var xOffset = 0.5 * 1 / xCount;
          var yOffset = 0.5 * 1 / yCount;

          if (xScale.isCategory && yScale.isCategory) {
            x = [x - xOffset, x - xOffset, x + xOffset, x + xOffset];
            y = [y - yOffset, y + yOffset, y + yOffset, y - yOffset];
          } else if (isArray(x)) {
            temp = x;
            x = [temp[0], temp[0], temp[1], temp[1]];
            y = [y - yOffset / 2, y + yOffset / 2, y + yOffset / 2, y - yOffset / 2];
          } else if (isArray(y)) {
            temp = y;
            y = [temp[0], temp[1], temp[1], temp[0]];
            x = [x - xOffset / 2, x - xOffset / 2, x + xOffset / 2, x + xOffset / 2];
          }

          cfg.x = x;
          cfg.y = y;
        }

        return cfg;
      };

      return Polygon;
    }(Geom);

    Geom.Polygon = Polygon$2;

    function _sortValue(value) {
      var sorted = value.sort(function (a, b) {
        return a < b ? 1 : -1;
      });
      var length = sorted.length;

      if (length < 4) {
        var min = sorted[length - 1];

        for (var i = 0; i < 4 - length; i++) {
          sorted.push(min);
        }
      }

      return sorted;
    } // from left bottom corner, and clockwise


    function getCandlePoints(x, y, width) {
      var yValues = _sortValue(y);

      var points = [{
        x: x,
        y: yValues[0]
      }, {
        x: x,
        y: yValues[1]
      }, {
        x: x - width / 2,
        y: yValues[2]
      }, {
        x: x - width / 2,
        y: yValues[1]
      }, {
        x: x + width / 2,
        y: yValues[1]
      }, {
        x: x + width / 2,
        y: yValues[2]
      }, {
        x: x,
        y: yValues[2]
      }, {
        x: x,
        y: yValues[3]
      }];
      return points;
    }

    var Schema = Shape$1.registerFactory('schema', {});
    Shape$1.registerShape('schema', 'candle', {
      getPoints: function getPoints(cfg) {
        return getCandlePoints(cfg.x, cfg.y, cfg.size);
      },
      draw: function draw(cfg, container) {
        var points = this.parsePoints(cfg.points);
        var style = mix({
          stroke: cfg.color,
          fill: cfg.color,
          lineWidth: 1
        }, cfg.style);
        return container.addShape('Custom', {
          className: 'schema',
          attrs: style,
          createPath: function createPath(ctx) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.moveTo(points[2].x, points[2].y);

            for (var i = 3; i < 6; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.closePath();
            ctx.moveTo(points[6].x, points[6].y);
            ctx.lineTo(points[7].x, points[7].y);
          }
        });
      }
    });

    var Schema$1 = /*#__PURE__*/function (_Geom) {
      _inheritsLoose(Schema, _Geom);

      var _proto = Schema.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var cfg = _Geom.prototype.getDefaultCfg.call(this);

        cfg.type = 'schema';
        cfg.shapeType = 'schema';
        cfg.generatePoints = true;
        return cfg;
      };

      function Schema(cfg) {
        var _this;

        _this = _Geom.call(this, cfg) || this;
        mix(_assertThisInitialized(_this), SizeMixin);
        return _this;
      }

      _proto.init = function init() {
        _Geom.prototype.init.call(this); // 绑定事件


        this.initEvent();
      };

      _proto.createShapePointsCfg = function createShapePointsCfg(obj) {
        var cfg = _Geom.prototype.createShapePointsCfg.call(this, obj);

        cfg.size = this.getNormalizedSize(obj);
        return cfg;
      };

      _proto.clearInner = function clearInner() {
        _Geom.prototype.clearInner.call(this);

        this.set('defaultSize', null);
      };

      return Schema;
    }(Geom);

    Geom.Schema = Schema$1;

    var toString$3 = {}.toString;

    var isType$1 = function isType(value, type) {
      return toString$3.call(value) === '[object ' + type + ']';
    };

    var isType_1 = isType$1;

    var isArray$1 = Array.isArray ? Array.isArray : function (value) {
      return isType_1(value, 'Array');
    };
    var isArray_1 = isArray$1;

    // isFinite,
    var isNil$1 = function isNil(value) {
      /**
       * isNil(null) => true
       * isNil() => true
       */
      return value === null || value === undefined;
    };

    var isNil_1 = isNil$1;

    function _inheritsLoose$1(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }

    var Stack = /*#__PURE__*/function (_Adjust) {
      _inheritsLoose$1(Stack, _Adjust);

      function Stack() {
        return _Adjust.apply(this, arguments) || this;
      }

      var _proto = Stack.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.xField = null; // 调整对应的 x 方向对应的字段名称

        this.yField = null; // 调整对应的 y 方向对应的字段名称
      };

      _proto.processAdjust = function processAdjust(dataArray) {
        this.processStack(dataArray);
      };

      _proto.processStack = function processStack(dataArray) {
        var self = this;
        var xField = self.xField;
        var yField = self.yField;
        var count = dataArray.length;
        var stackCache = {
          positive: {},
          negative: {}
        }; // 层叠顺序翻转

        if (self.reverseOrder) {
          dataArray = dataArray.slice(0).reverse();
        }

        for (var i = 0; i < count; i++) {
          var data = dataArray[i];

          for (var j = 0, len = data.length; j < len; j++) {
            var item = data[j];
            var x = item[xField] || 0;
            var y = item[yField];
            var xkey = x.toString();
            y = isArray_1(y) ? y[1] : y;

            if (!isNil_1(y)) {
              var direction = y >= 0 ? 'positive' : 'negative';

              if (!stackCache[direction][xkey]) {
                stackCache[direction][xkey] = 0;
              }

              item[yField] = [stackCache[direction][xkey], y + stackCache[direction][xkey]];
              stackCache[direction][xkey] += y;
            }
          }
        }
      };

      return Stack;
    }(base);

    base.Stack = Stack;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var isObject$1 = function isObject(value) {
      /**
       * isObject({}) => true
       * isObject([1, 2, 3]) => true
       * isObject(Function) => true
       * isObject(null) => false
       */
      var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
      return value !== null && type === 'object' || type === 'function';
    };

    var isObject_1 = isObject$1;

    var each$1 = function each(elements, func) {
      if (!elements) {
        return;
      }

      var rst = void 0;

      if (isArray_1(elements)) {
        for (var i = 0, len = elements.length; i < len; i++) {
          rst = func(elements[i], i);

          if (rst === false) {
            break;
          }
        }
      } else if (isObject_1(elements)) {
        for (var k in elements) {
          if (elements.hasOwnProperty(k)) {
            rst = func(elements[k], k);

            if (rst === false) {
              break;
            }
          }
        }
      }
    };

    var each_1 = each$1;

    function _inheritsLoose$2(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }

    var MARGIN_RATIO = 1 / 2;
    var DODGE_RATIO = 1 / 2;

    var Dodge = /*#__PURE__*/function (_Adjust) {
      _inheritsLoose$2(Dodge, _Adjust);

      function Dodge() {
        return _Adjust.apply(this, arguments) || this;
      }

      var _proto = Dodge.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        /**
         * 调整过程中,2个数据的间距
         * @type {Number}
         */
        this.marginRatio = MARGIN_RATIO;
        /**
         * 调整占单位宽度的比例,例如：占2个分类间距的 1/2
         * @type {Number}
         */

        this.dodgeRatio = DODGE_RATIO;
        this.adjustNames = ['x', 'y']; // 调整的维度，默认,x,y都做调整
      };

      _proto.getDodgeOffset = function getDodgeOffset(range, index, count) {
        var self = this;
        var pre = range.pre;
        var next = range.next;
        var tickLength = next - pre;
        var width = tickLength * self.dodgeRatio / count;
        var margin = self.marginRatio * width;
        var offset = 1 / 2 * (tickLength - count * width - (count - 1) * margin) + ((index + 1) * width + index * margin) - 1 / 2 * width - 1 / 2 * tickLength;
        return (pre + next) / 2 + offset;
      };

      _proto.processAdjust = function processAdjust(dataArray) {
        var self = this;
        var count = dataArray.length;
        var xField = self.xField;
        each_1(dataArray, function (data, index) {
          for (var i = 0, len = data.length; i < len; i++) {
            var obj = data[i];
            var value = obj[xField];
            var range = {
              pre: len === 1 ? value - 1 : value - 0.5,
              next: len === 1 ? value + 1 : value + 0.5
            };
            var dodgeValue = self.getDodgeOffset(range, index, count);
            obj[xField] = dodgeValue;
          }
        });
      };

      return Dodge;
    }(base);

    base.Dodge = Dodge;

    /**
     * 是否为函数
     * @param  {*} fn 对象
     * @return {Boolean}  是否函数
     */

    var isFunction$1 = function isFunction(value) {
      return isType_1(value, 'Function');
    };

    var isFunction_1 = isFunction$1;

    /**
     * @param {Array} arr The array to iterate over.
     * @param {Function} [fn] The iteratee invoked per element.
     * @return {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * maxBy(objects, 'n');
     * // => { 'n': 2 }
     */

    var maxBy = function maxBy(arr, fn) {
      if (!isArray_1(arr)) {
        return undefined;
      }

      var max = arr[0];
      var maxData = void 0;

      if (isFunction_1(fn)) {
        maxData = fn(arr[0]);
      } else {
        maxData = arr[0][fn];
      }

      var data = void 0;
      each_1(arr, function (val) {
        if (isFunction_1(fn)) {
          data = fn(val);
        } else {
          data = val[fn];
        }

        if (data > maxData) {
          max = val;
          maxData = data;
        }
      });
      return max;
    };

    var maxBy_1 = maxBy;

    var merge$1 = function merge(dataArray) {
      var rst = [];

      for (var i = 0; i < dataArray.length; i++) {
        rst = rst.concat(dataArray[i]);
      }

      return rst;
    };

    var merge_1 = merge$1;

    function _inheritsLoose$3(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }

    var ArrayUtil = {
      merge: merge_1
    };

    var Symmetric = /*#__PURE__*/function (_Adjust) {
      _inheritsLoose$3(Symmetric, _Adjust);

      function Symmetric() {
        return _Adjust.apply(this, arguments) || this;
      }

      var _proto = Symmetric.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.xField = null; // 调整对应的 x 方向对应的字段名称

        this.yField = null; // 调整对应的 y 方向对应的字段名称

        this.cacheMax = null; // 缓存的最大值

        this.adjustNames = ['y']; // Only support stack y

        this.groupFields = null; // 参与分组的数据维度
      }; // 获取最大的y值


      _proto._getMax = function _getMax(dim) {
        var self = this;
        var mergeData = self.mergeData;
        var maxRecord = maxBy_1(mergeData, function (obj) {
          var value = obj[dim];

          if (isArray_1(value)) {
            return Math.max.apply(null, value);
          }

          return value;
        });
        var maxValue = maxRecord[dim];
        var max = isArray_1(maxValue) ? Math.max.apply(null, maxValue) : maxValue;
        return max;
      }; // 获取每个字段最大的值


      _proto._getXValuesMax = function _getXValuesMax() {
        var self = this;
        var yField = self.yField;
        var xField = self.xField;
        var cache = {};
        var mergeData = self.mergeData;
        each_1(mergeData, function (obj) {
          var xValue = obj[xField];
          var yValue = obj[yField];
          var max = isArray_1(yValue) ? Math.max.apply(null, yValue) : yValue;
          cache[xValue] = cache[xValue] || 0;

          if (cache[xValue] < max) {
            cache[xValue] = max;
          }
        });
        return cache;
      }; // 入口函数


      _proto.processAdjust = function processAdjust(dataArray) {
        var self = this;
        var mergeData = ArrayUtil.merge(dataArray);
        self.mergeData = mergeData;

        self._processSymmetric(dataArray);

        self.mergeData = null;
      }; // 处理对称


      _proto._processSymmetric = function _processSymmetric(dataArray) {
        var self = this;
        var xField = self.xField;
        var yField = self.yField;

        var max = self._getMax(yField);

        var first = dataArray[0][0];
        var cache;

        if (first && isArray_1(first[yField])) {
          cache = self._getXValuesMax();
        }

        each_1(dataArray, function (data) {
          each_1(data, function (obj) {
            var value = obj[yField];
            var offset;

            if (isArray_1(value)) {
              var xValue = obj[xField];
              var valueMax = cache[xValue];
              offset = (max - valueMax) / 2;
              var tmp = [];
              /* eslint-disable no-loop-func */

              each_1(value, function (subVal) {
                // 多个字段
                tmp.push(offset + subVal);
              });
              /* eslint-enable no-loop-func */

              obj[yField] = tmp;
            } else {
              offset = (max - value) / 2;
              obj[yField] = [offset, value + offset];
            }
          });
        });
      };

      return Symmetric;
    }(base);

    base.Symmetric = Symmetric;

    var Polar = /*#__PURE__*/function (_Base) {
      _inheritsLoose(Polar, _Base);

      function Polar() {
        return _Base.apply(this, arguments) || this;
      }

      var _proto = Polar.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'polar';
        this.startAngle = -Math.PI / 2;
        this.endAngle = Math.PI * 3 / 2;
        this.inner = 0;
        this.innerRadius = 0; // alias

        this.isPolar = true;
        this.transposed = false;
        this.center = null;
        this.radius = null; // relative, 0 ~ 1
      };

      _proto.init = function init(start, end) {
        _Base.prototype.init.call(this, start, end);

        var self = this;
        var inner = self.inner || self.innerRadius;
        var width = Math.abs(end.x - start.x);
        var height = Math.abs(end.y - start.y);
        var maxRadius;
        var center;

        if (self.startAngle === -Math.PI && self.endAngle === 0) {
          maxRadius = Math.min(width / 2, height);
          center = {
            x: (start.x + end.x) / 2,
            y: start.y
          };
        } else {
          maxRadius = Math.min(width, height) / 2;
          center = {
            x: (start.x + end.x) / 2,
            y: (start.y + end.y) / 2
          };
        }

        var radius = self.radius;

        if (radius > 0 && radius <= 1) {
          maxRadius = maxRadius * radius;
        }

        this.x = {
          start: self.startAngle,
          end: self.endAngle
        };
        this.y = {
          start: maxRadius * inner,
          end: maxRadius
        };
        this.center = center;
        this.circleRadius = maxRadius; // the radius value in px
      };

      _proto._convertPoint = function _convertPoint(point) {
        var self = this;
        var center = self.center;
        var transposed = self.transposed;
        var xDim = transposed ? 'y' : 'x';
        var yDim = transposed ? 'x' : 'y';
        var x = self.x;
        var y = self.y;
        var angle = x.start + (x.end - x.start) * point[xDim];
        var radius = y.start + (y.end - y.start) * point[yDim];
        return {
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius
        };
      };

      _proto._invertPoint = function _invertPoint(point) {
        var self = this;
        var center = self.center,
            transposed = self.transposed,
            x = self.x,
            y = self.y;
        var xDim = transposed ? 'y' : 'x';
        var yDim = transposed ? 'x' : 'y';
        var m = [1, 0, 0, 1, 0, 0];
        Matrix.rotate(m, m, x.start);
        var startV = [1, 0];
        Vector2.transformMat2d(startV, startV, m);
        startV = [startV[0], startV[1]];
        var pointV = [point.x - center.x, point.y - center.y];

        if (Vector2.zero(pointV)) {
          return {
            x: 0,
            y: 0
          };
        }

        var theta = Vector2.angleTo(startV, pointV, x.end < x.start);

        if (Math.abs(theta - Math.PI * 2) < 0.001) {
          theta = 0;
        }

        var l = Vector2.length(pointV);
        var percentX = theta / (x.end - x.start);
        percentX = x.end - x.start > 0 ? percentX : -percentX;
        var percentY = (l - y.start) / (y.end - y.start);
        var rst = {};
        rst[xDim] = percentX;
        rst[yDim] = percentY;
        return rst;
      };

      return Polar;
    }(Base$1);

    Base$1.Polar = Polar;

    var Circle$1 = /*#__PURE__*/function (_Abstract) {
      _inheritsLoose(Circle, _Abstract);

      function Circle() {
        return _Abstract.apply(this, arguments) || this;
      }

      var _proto = Circle.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        _Abstract.prototype._initDefaultCfg.call(this);

        this.startAngle = -Math.PI / 2; // start angle，in radian

        this.endAngle = Math.PI * 3 / 2; // end angle, in radian

        this.radius = null; // radius

        this.center = null; // center
      };

      _proto.getOffsetPoint = function getOffsetPoint(value) {
        var startAngle = this.startAngle,
            endAngle = this.endAngle;
        var angle = startAngle + (endAngle - startAngle) * value;
        return this._getCirclePoint(angle);
      };

      _proto._getCirclePoint = function _getCirclePoint(angle, radius) {
        var self = this;
        var center = self.center;
        radius = radius || self.radius;
        return {
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius
        };
      };

      _proto.getTextAlignInfo = function getTextAlignInfo(point, offset) {
        var self = this;
        var offsetVector = self.getOffsetVector(point, offset);
        var align;
        var baseLine = 'middle';

        if (offsetVector[0] > 0) {
          align = 'left';
        } else if (offsetVector[0] < 0) {
          align = 'right';
        } else {
          align = 'center';

          if (offsetVector[1] > 0) {
            baseLine = 'top';
          } else if (offsetVector[1] < 0) {
            baseLine = 'bottom';
          }
        }

        return {
          textAlign: align,
          textBaseline: baseLine
        };
      };

      _proto.getAxisVector = function getAxisVector(point) {
        var center = this.center;
        var factor = this.offsetFactor;
        return [(point.y - center.y) * factor, (point.x - center.x) * -1 * factor];
      };

      _proto.drawLine = function drawLine(lineCfg) {
        var center = this.center,
            radius = this.radius,
            startAngle = this.startAngle,
            endAngle = this.endAngle;
        var container = this.getContainer(lineCfg.top);
        container.addShape('arc', {
          className: 'axis-line',
          attrs: mix({
            x: center.x,
            y: center.y,
            r: radius,
            startAngle: startAngle,
            endAngle: endAngle
          }, lineCfg)
        });
      };

      return Circle;
    }(Abastract);

    Abastract.Circle = Circle$1;

    var KEYWORDS_PERCENT = {
      min: 0,
      median: 0.5,
      max: 1
    };

    var GuideBase = /*#__PURE__*/function () {
      var _proto = GuideBase.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {};

      function GuideBase(cfg) {
        this._initDefaultCfg();

        deepMix(this, cfg);
      }

      _proto._getNormalizedValue = function _getNormalizedValue(val, scale) {
        var rst;

        if (isNil(KEYWORDS_PERCENT[val])) {
          rst = scale.scale(val);
        } else {
          rst = KEYWORDS_PERCENT[val];
        }

        return rst;
      };

      _proto.parsePercentPoint = function parsePercentPoint(coord, position) {
        var xPercent = parseFloat(position[0]) / 100;
        var yPercent = parseFloat(position[1]) / 100;
        var start = coord.start;
        var end = coord.end;
        var width = Math.abs(start.x - end.x);
        var height = Math.abs(start.y - end.y);
        var x = width * xPercent + Math.min(start.x, end.x);
        var y = height * yPercent + Math.min(start.y, end.y);
        return {
          x: x,
          y: y
        };
      };

      _proto.parsePoint = function parsePoint(coord, position) {
        var self = this;
        var xScale = self.xScale;
        var yScales = self.yScales;

        if (isFunction(position)) {
          position = position(xScale, yScales); // position 必须是对象
        } // 如果数据格式是 ['50%', '50%'] 的格式
        // fix: 原始数据中可能会包含 'xxx5%xxx' 这样的数据，需要判断下 https://github.com/antvis/f2/issues/590


        if (isString(position[0]) && position[0].indexOf('%') !== -1 && !isNaN(position[0].slice(0, -1))) {
          return this.parsePercentPoint(coord, position);
        }

        var x = self._getNormalizedValue(position[0], xScale);

        var y = self._getNormalizedValue(position[1], yScales[0]);

        var point = coord.convertPoint({
          x: x,
          y: y
        });

        if (self.limitInPlot) {
          // limit in chart plotRange
          if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
            return point;
          }

          return null;
        }

        return point;
      }
      /**
       * render the guide component
       * @param  {Coord} coord  coordinate instance
       * @param  {Canvas.Group} group the container
       */
      ;

      _proto.render = function render()
      /* coord,group */
      {};

      _proto.repaint = function repaint() {
        this.remove();
        var coord = this.coord,
            container = this.container,
            canvas = this.canvas;

        if (container && !container.isDestroyed()) {
          this.render(coord, container);
          canvas.draw();
        }
      };

      _proto.remove = function remove() {
        var element = this.element;
        element && element.remove(true);
      };

      _proto.changeVisible = function changeVisible(visible) {
        var self = this;
        self.visible = visible;
        var element = self.element;
        if (!element) return;

        if (element.set) {
          element.set('visible', visible);
        } else {
          element.style.display = visible ? '' : 'none';
        }
      };

      return GuideBase;
    }();

    var Text$1 = /*#__PURE__*/function (_GuideBase) {
      _inheritsLoose(Text, _GuideBase);

      function Text() {
        return _GuideBase.apply(this, arguments) || this;
      }

      var _proto = Text.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'text';
        /**
         * the position of text
         * @type {Function | Array}
         */

        this.position = null;
        /**
         * the display content
         * @type {String}
         */

        this.content = null;
        /**
         * style configuration for text
         * @type {Object}
         */

        this.style = {
          fill: '#000000'
        };
        /**
         * offset of horizontal direction
         * @type {Number}
         */

        this.offsetX = 0;
        /**
         * offset of vertical direction
         * @type {Number}
         */

        this.offsetY = 0;
      };

      _proto.render = function render(coord, container) {
        var position = this.position;
        var point = this.parsePoint(coord, position);

        if (!point) {
          return;
        }

        var content = this.content,
            style = this.style,
            offsetX = this.offsetX,
            offsetY = this.offsetY;

        if (offsetX) {
          point.x += offsetX;
        }

        if (offsetY) {
          point.y += offsetY;
        }

        var shape = container.addShape('text', {
          className: 'guide-text',
          attrs: mix({
            x: point.x,
            y: point.y,
            text: content
          }, style)
        });
        this.element = shape;
        return shape;
      };

      return Text;
    }(GuideBase);

    GuideBase.Text = Text$1;

    var Line$4 = /*#__PURE__*/function (_GuideBase) {
      _inheritsLoose(Line, _GuideBase);

      function Line() {
        return _GuideBase.apply(this, arguments) || this;
      }

      var _proto = Line.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'line';
        this.start = [];
        this.end = [];
        this.style = {
          stroke: '#000000',
          lineWidth: 1
        };
      };

      _proto.render = function render(coord, container) {
        var points = [];
        points[0] = this.parsePoint(coord, this.start);
        points[1] = this.parsePoint(coord, this.end);

        if (!points[0] || !points[1]) {
          return;
        }

        var shape = container.addShape('Line', {
          className: 'guide-line',
          attrs: mix({
            x1: points[0].x,
            y1: points[0].y,
            x2: points[1].x,
            y2: points[1].y
          }, this.style)
        });
        this.element = shape;
        return shape;
      };

      return Line;
    }(GuideBase);

    GuideBase.Line = Line$4;

    var Arc$1 = /*#__PURE__*/function (_GuideBase) {
      _inheritsLoose(Arc, _GuideBase);

      function Arc() {
        return _GuideBase.apply(this, arguments) || this;
      }

      var _proto = Arc.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'arc';
        /**
         * start point
         * @type {Array | Function}
         */

        this.start = [];
        /**
         * end point
         * @type {Array | Function}
         */

        this.end = [];
        /**
         * style configuration
         * @type {Object}
         */

        this.style = {
          stroke: '#999999',
          lineWidth: 1
        };
      };

      _proto.render = function render(coord, container) {
        var self = this;
        var start = self.parsePoint(coord, self.start);
        var end = self.parsePoint(coord, self.end);

        if (!start || !end) {
          return;
        }

        var coordCenter = coord.center;
        var radius = Math.sqrt((start.x - coordCenter.x) * (start.x - coordCenter.x) + (start.y - coordCenter.y) * (start.y - coordCenter.y));
        var startAngle = Math.atan2(start.y - coordCenter.y, start.x - coordCenter.x);
        var endAngle = Math.atan2(end.y - coordCenter.y, end.x - coordCenter.x);
        var shape = container.addShape('arc', {
          className: 'guide-arc',
          attrs: mix({
            x: coordCenter.x,
            y: coordCenter.y,
            r: radius,
            startAngle: startAngle,
            endAngle: endAngle
          }, self.style)
        });
        self.element = shape;
        return shape;
      };

      return Arc;
    }(GuideBase);

    GuideBase.Arc = Arc$1;

    var Rect$2 = /*#__PURE__*/function (_GuideBase) {
      _inheritsLoose(Rect, _GuideBase);

      function Rect() {
        return _GuideBase.apply(this, arguments) || this;
      }

      var _proto = Rect.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'rect';
        this.start = [];
        this.end = [];
        this.style = {
          fill: '#CCD7EB',
          opacity: 0.4
        };
      };

      _proto.render = function render(coord, container) {
        var start = this.parsePoint(coord, this.start);
        var end = this.parsePoint(coord, this.end);

        if (!start || !end) {
          return;
        }

        var shape = container.addShape('rect', {
          className: 'guide-rect',
          attrs: mix({
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
            width: Math.abs(end.x - start.x),
            height: Math.abs(start.y - end.y)
          }, this.style)
        });
        this.element = shape;
        return shape;
      };

      return Rect;
    }(GuideBase);

    GuideBase.Rect = Rect$2;

    function getOffsetFromAlign(alignX, alignY, width, height) {
      var result = [];

      if (alignX === 'left' && alignY === 'top') {
        result[0] = 0;
        result[1] = 0;
      } else if (alignX === 'right' && alignY === 'top') {
        result[0] = -width;
        result[1] = 0;
      } else if (alignX === 'left' && alignY === 'bottom') {
        result[0] = 0;
        result[1] = Math.floor(-height);
      } else if (alignX === 'right' && alignY === 'bottom') {
        result[0] = Math.floor(-width);
        result[1] = Math.floor(-height);
      } else if (alignX === 'right' && alignY === 'middle') {
        result[0] = Math.floor(-width);
        result[1] = Math.floor(-height / 2);
      } else if (alignX === 'left' && alignY === 'middle') {
        result[0] = 0;
        result[1] = Math.floor(-height / 2);
      } else if (alignX === 'center' && alignY === 'bottom') {
        result[0] = Math.floor(-width / 2);
        result[1] = Math.floor(-height);
      } else if (alignX === 'center' && alignY === 'top') {
        result[0] = Math.floor(-width / 2);
        result[1] = 0;
      } else {
        result[0] = Math.floor(-width / 2);
        result[1] = Math.floor(-height / 2);
      }

      return result;
    }

    function modifyCSS(DOM, CSS) {
      for (var key in CSS) {
        if (CSS.hasOwnProperty(key)) {
          DOM.style[key] = CSS[key];
        }
      }

      return DOM;
    }

    function createDom(str) {
      var container = document.createElement('div');
      str = str.replace(/(^\s*)|(\s*$)/g, '');
      container.innerHTML = '' + str;
      return container.childNodes[0];
    }

    var Html = /*#__PURE__*/function (_GuideBase) {
      _inheritsLoose(Html, _GuideBase);

      function Html() {
        return _GuideBase.apply(this, arguments) || this;
      }

      var _proto = Html.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'html';
        /**
         * dom position
         * @type {Object | Array}
         */

        this.position = null;
        /**
          * alignment for horizontal direction，can be 'left','center','right'
          * @type {String}
          */

        this.alignX = 'center';
        /**
          * alignment for vertical direction，can be 'top', 'middle', 'bottom'
          * @type {String}
          */

        this.alignY = 'middle';
        /**
          * offset for horizontal direction
          * @type {Number}
          */

        this.offsetX = null;
        /**
          * offset for vertical direction
          * @type {Number}
          */

        this.offsetY = null;
        /**
        * the html string
        *@type {String | Function}
        */

        this.html = null;
      } // override paint
      ;

      _proto.render = function render(coord, container) {
        var self = this;
        var position = self.parsePoint(coord, self.position);

        if (!position) {
          return;
        }

        var myNode = createDom(self.html);
        myNode = modifyCSS(myNode, {
          position: 'absolute',
          top: Math.floor(position.y) + 'px',
          left: Math.floor(position.x) + 'px',
          visibility: 'hidden'
        });
        var canvasDom = container.get('canvas').get('el');
        var parentNode = canvasDom.parentNode;
        parentNode = modifyCSS(parentNode, {
          position: 'relative'
        });
        var wrapperNode = createDom('<div class="guideWapper" style="position: absolute;top: 0; left: 0;"></div>');
        parentNode.appendChild(wrapperNode);
        wrapperNode.appendChild(myNode);
        var canvasOffsetTop = canvasDom.offsetTop;
        var canvasOffsetLeft = canvasDom.offsetLeft;
        var alignX = self.alignX,
            alignY = self.alignY,
            offsetX = self.offsetX,
            offsetY = self.offsetY;
        var width = getWidth(myNode);
        var height = getHeight(myNode);
        var newOffset = getOffsetFromAlign(alignX, alignY, width, height);
        position.x = position.x + newOffset[0] + canvasOffsetLeft;
        position.y = position.y + newOffset[1] + canvasOffsetTop;

        if (offsetX) {
          position.x += offsetX;
        }

        if (offsetY) {
          position.y += offsetY;
        }

        modifyCSS(myNode, {
          top: Math.floor(position.y) + 'px',
          left: Math.floor(position.x) + 'px',
          visibility: 'visible'
        });
        self.element = wrapperNode;
      };

      _proto.remove = function remove() {
        var element = this.element;
        element && element.parentNode && element.parentNode.removeChild(element);
      };

      return Html;
    }(GuideBase);

    GuideBase.Html = Html;

    var Tag = /*#__PURE__*/function (_GuideBase) {
      _inheritsLoose(Tag, _GuideBase);

      function Tag() {
        return _GuideBase.apply(this, arguments) || this;
      }

      var _proto = Tag.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'tag';
        this.position = null;
        this.content = null;
        this.direct = 'tl';
        this.autoAdjust = true;
        this.offsetX = 0;
        this.offsetY = 0;
        this.side = 4;
        this.background = {
          padding: 5,
          radius: 2,
          fill: '#1890FF'
        };
        this.textStyle = {
          fontSize: 12,
          fill: '#ffffff',
          textAlign: 'center',
          textBaseline: 'middle'
        };
        this.withPoint = true;
        this.pointStyle = {
          fill: '#1890FF',
          r: 3,
          lineWidth: 1,
          stroke: '#ffffff'
        };
      };

      _proto._getDirect = function _getDirect(container, point, tagWidth, tagHeight) {
        var direct = this.direct;
        var side = this.side;
        var canvas = container.get('canvas');
        var clientWidth = canvas.get('width');
        var clientHeight = canvas.get('height');
        var x = point.x,
            y = point.y;
        var vertical = direct[0];
        var horizontal = direct[1]; // adjust for vertical direction

        if (vertical === 't' && y - side - tagHeight < 0) {
          vertical = 'b';
        } else if (vertical === 'b' && y + side + tagHeight > clientHeight) {
          vertical = 't';
        } // adjust for horizontal direction


        var diff = vertical === 'c' ? side : 0;

        if (horizontal === 'l' && x - diff - tagWidth < 0) {
          horizontal = 'r';
        } else if (horizontal === 'r' && x + diff + tagWidth > clientWidth) {
          horizontal = 'l';
        } else if (horizontal === 'c') {
          if (tagWidth / 2 + x + diff > clientWidth) {
            horizontal = 'l';
          } else if (x - tagWidth / 2 - diff < 0) {
            horizontal = 'r';
          }
        }

        direct = vertical + horizontal;
        return direct;
      };

      _proto.render = function render(coord, container) {
        var position = this.parsePoint(coord, this.position);

        if (!position) {
          return;
        } // 数据不在显示范围内时，x/y 会为NaN


        if (isNaN(position.x) || isNaN(position.y)) {
          return;
        }

        var content = this.content,
            background = this.background,
            textStyle = this.textStyle;
        var shapes = [];
        var wrapperContainer = container.addGroup({
          className: 'guide-tag'
        });

        if (this.withPoint) {
          var pointShape = wrapperContainer.addShape('Circle', {
            className: 'guide-tag-point',
            attrs: mix({
              x: position.x,
              y: position.y
            }, this.pointStyle)
          });
          shapes.push(pointShape);
        }

        var tagContainer = wrapperContainer.addGroup(); // create a text shape

        var tagText = tagContainer.addShape('text', {
          className: 'guide-tag-text',
          zIndex: 1,
          attrs: mix({
            x: 0,
            y: 0,
            text: content
          }, textStyle)
        });
        shapes.push(tagText); // create background box

        var textBBox = tagText.getBBox();
        var padding = parsePadding(background.padding);
        var tagWidth = textBBox.width + padding[1] + padding[3];
        var tagHeight = textBBox.height + padding[0] + padding[2];
        var yMin = textBBox.minY - padding[0];
        var xMin = textBBox.minX - padding[3];
        var tagBg = tagContainer.addShape('rect', {
          className: 'guide-tag-bg',
          zIndex: -1,
          attrs: mix({
            x: xMin,
            y: yMin,
            width: tagWidth,
            height: tagHeight
          }, background)
        });
        shapes.push(tagBg);
        var direct = this.autoAdjust ? this._getDirect(container, position, tagWidth, tagHeight) : this.direct;
        var side = this.side;
        var x = position.x + this.offsetX;
        var y = position.y + this.offsetY;
        var arrowPoints;
        var radius = parsePadding(background.radius);

        if (direct === 'tl') {
          arrowPoints = [{
            x: tagWidth + xMin - side - 1,
            y: tagHeight + yMin - 1
          }, // 这个 1 是为了防止出现白边
          {
            x: tagWidth + xMin,
            y: tagHeight + yMin - 1
          }, {
            x: tagWidth + xMin,
            y: tagHeight + side + yMin
          }];
          radius[2] = 0;
          x = x - tagWidth;
          y = y - side - tagHeight;
        } else if (direct === 'cl') {
          arrowPoints = [{
            x: tagWidth + xMin - 1,
            y: (tagHeight - side) / 2 + yMin - 1
          }, {
            x: tagWidth + xMin - 1,
            y: (tagHeight + side) / 2 + yMin + 1
          }, {
            x: tagWidth + side + xMin,
            y: tagHeight / 2 + yMin
          }];
          x = x - tagWidth - side;
          y = y - tagHeight / 2;
        } else if (direct === 'bl') {
          arrowPoints = [{
            x: tagWidth + xMin,
            y: -side + yMin
          }, {
            x: tagWidth + xMin - side - 1,
            y: yMin + 1
          }, {
            x: tagWidth + xMin,
            y: yMin + 1
          }];
          radius[1] = 0;
          x = x - tagWidth;
          y = y + side;
        } else if (direct === 'bc') {
          arrowPoints = [{
            x: tagWidth / 2 + xMin,
            y: -side + yMin
          }, {
            x: (tagWidth - side) / 2 + xMin - 1,
            y: yMin + 1
          }, {
            x: (tagWidth + side) / 2 + xMin + 1,
            y: yMin + 1
          }];
          x = x - tagWidth / 2;
          y = y + side;
        } else if (direct === 'br') {
          arrowPoints = [{
            x: xMin,
            y: yMin - side
          }, {
            x: xMin,
            y: yMin + 1
          }, {
            x: xMin + side + 1,
            y: yMin + 1
          }];
          radius[0] = 0;
          y = y + side;
        } else if (direct === 'cr') {
          arrowPoints = [{
            x: xMin - side,
            y: tagHeight / 2 + yMin
          }, {
            x: xMin + 1,
            y: (tagHeight - side) / 2 + yMin - 1
          }, {
            x: xMin + 1,
            y: (tagHeight + side) / 2 + yMin + 1
          }];
          x = x + side;
          y = y - tagHeight / 2;
        } else if (direct === 'tr') {
          arrowPoints = [{
            x: xMin,
            y: tagHeight + side + yMin
          }, {
            x: xMin,
            y: tagHeight + yMin - 1
          }, {
            x: side + xMin + 1,
            y: tagHeight + yMin - 1
          }];
          radius[3] = 0;
          y = y - tagHeight - side;
        } else if (direct === 'tc') {
          arrowPoints = [{
            x: (tagWidth - side) / 2 + xMin - 1,
            y: tagHeight + yMin - 1
          }, {
            x: (tagWidth + side) / 2 + xMin + 1,
            y: tagHeight + yMin - 1
          }, {
            x: tagWidth / 2 + xMin,
            y: tagHeight + side + yMin
          }];
          x = x - tagWidth / 2;
          y = y - tagHeight - side;
        }

        var sideShape = tagContainer.addShape('Polygon', {
          className: 'guide-tag-side',
          zIndex: 0,
          attrs: {
            points: arrowPoints,
            fill: background.fill
          }
        });
        shapes.push(sideShape);
        tagBg.attr('radius', radius);
        tagContainer.moveTo(x - xMin, y - yMin);
        tagContainer.sort();
        this.element = wrapperContainer;
        return shapes;
      };

      return Tag;
    }(GuideBase);

    GuideBase.Tag = Tag;

    var Point$2 = /*#__PURE__*/function (_GuideBase) {
      _inheritsLoose(Point, _GuideBase);

      function Point() {
        return _GuideBase.apply(this, arguments) || this;
      }

      var _proto = Point.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'point';
        this.position = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.style = {
          fill: '#1890FF',
          r: 3,
          lineWidth: 1,
          stroke: '#ffffff'
        };
      };

      _proto.render = function render(coord, container) {
        var position = this.parsePoint(coord, this.position);
        if (!position) return null;
        var shape = container.addShape('Circle', {
          className: 'guide-point',
          attrs: mix({
            x: position.x + this.offsetX,
            y: position.y + this.offsetY
          }, this.style)
        });
        this.element = shape;
        return shape;
      };

      return Point;
    }(GuideBase);

    GuideBase.Point = Point$2;

    var RegionFilter = /*#__PURE__*/function (_GuideBase) {
      _inheritsLoose(RegionFilter, _GuideBase);

      function RegionFilter() {
        return _GuideBase.apply(this, arguments) || this;
      }

      var _proto = RegionFilter.prototype;

      _proto._initDefaultCfg = function _initDefaultCfg() {
        this.type = 'regionFilter';
        this.start = [];
        this.end = [];
        this.color = null;
        this.style = null;
      };

      _proto.render = function render(coord) {
        var start = this.parsePoint(coord, this.start);
        var end = this.parsePoint(coord, this.end);

        if (!start || !end) {
          return;
        }

        var clip = new Rect({
          attrs: {
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
            width: Math.abs(end.x - start.x),
            height: Math.abs(end.y - start.y)
          }
        }); // 新建剪切区域

        this.clip = clip;
        var chart = this.chart;
        var color = this.color;
        var style = this.style || {};
        var regionElements = [];
        var geoms = chart.get('geoms');
        geoms.map(function (geom) {
          var geomContainer = geom.get('container');
          var children = geomContainer.get('children');
          var group = geomContainer.addGroup({
            zIndex: 10,
            className: 'guide-region-filter'
          });
          children.map(function (c) {
            if (c.get('isShape')) {
              var type = c.get('type');
              var attrs = mix({}, c.get('attrs'), style);

              if (color && (attrs.fill || attrs.fillStyle)) {
                attrs.fill = attrs.fillStyle = color;
              }

              if (color && (attrs.stroke || attrs.strokeStyle)) {
                attrs.stroke = attrs.strokeStyle = color;
              }

              var cfg = {
                attrs: attrs
              };

              if (type === 'custom' || type === 'Custom') {
                // custom 类型的 shape 会自定义绘制 path 的逻辑
                cfg.createPath = c.get('createPath');
                cfg.calculateBox = c.get('calculateBox');
              }

              group.addShape(type, cfg);
            }

            return c;
          });
          group.attr('clip', clip);
          geomContainer.sort();
          regionElements.push(group);
          return geom;
        });
        this.element = regionElements;
      };

      _proto.remove = function remove() {
        var element = this.element;
        each(element, function (group) {
          group && group.remove(true);
        });
        this.clip && this.clip.remove(true);
      };

      return RegionFilter;
    }(GuideBase);

    GuideBase.RegionFilter = RegionFilter;

    var MARKER_RADIUS = 3;

    var List = /*#__PURE__*/function () {
      var _proto = List.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        return {
          showTitle: false,

          /**
           * title string
           * @type {?String}
           */
          title: null,

          /**
           * items array
           * @type {?Array}
           */
          items: null,

          /**
           * offset between title and items
           * @type {Number}
           */
          titleGap: 12,

          /**
           * offset between each item
           * @type {Number}
           */
          itemGap: 10,

          /**
           * the offset between each item in vertical direaction
           * @type {Number}
           */
          itemMarginBottom: 12,

          /**
           * the formatter for item text
           * @type {[type]}
           */
          itemFormatter: null,
          itemWidth: null,

          /**
           * offset between marker and text
           * @type {Number}
           */
          wordSpace: 6,
          x: 0,
          y: 0,
          layout: 'horizontal',

          /**
           * the join string of `name` and `value`
           * @type {String}
           */
          joinString: ': '
        };
      };

      function List(cfg) {
        deepMix(this, this.getDefaultCfg(), cfg);

        this._init();

        this._renderTitle();

        this._renderItems();
      }

      _proto._init = function _init() {
        var parent = this.parent;
        if (!parent) return;
        var container = parent.addGroup({
          zIndex: this.zIndex || 0
        });
        this.container = container;
        var wrapper = container.addGroup();
        this.wrapper = wrapper;
        var itemsGroup = wrapper.addGroup({
          className: 'itemsGroup'
        });
        this.itemsGroup = itemsGroup;
      };

      _proto._renderTitle = function _renderTitle(title) {
        title = title || this.title;
        var titleShape = this.titleShape;
        var titleHeight = 0;

        if (this.showTitle && title) {
          if (titleShape && !titleShape.get('destroyed')) {
            titleShape.attr('text', title);
          } else {
            var wrapper = this.wrapper,
                titleStyle = this.titleStyle;
            titleShape = wrapper.addShape('text', {
              className: 'title',
              attrs: mix({
                x: 0,
                y: 0,
                text: title
              }, titleStyle)
            });
            this.titleShape = titleShape;
          }

          titleHeight = titleShape.getBBox().height + this.titleGap;
        }

        this._titleHeight = titleHeight;
      };

      _proto._renderItems = function _renderItems(items) {
        var self = this;
        items = items || self.items;

        if (!items) {
          return;
        }

        if (self.reversed) {
          items.reverse();
        }

        each(items, function (item, index) {
          self._addItem(item, index);
        });

        if (items.length > 1) {
          this._adjustItems();
        }

        this._renderBackground();
      };

      _proto._renderBackground = function _renderBackground() {
        var background = this.background;

        if (background) {
          var container = this.container;
          var wrapper = this.wrapper;

          var _wrapper$getBBox = wrapper.getBBox(),
              minX = _wrapper$getBBox.minX,
              minY = _wrapper$getBBox.minY,
              width = _wrapper$getBBox.width,
              height = _wrapper$getBBox.height;

          var padding = background.padding || [0, 0, 0, 0];
          padding = parsePadding(padding);
          var attrs = mix({
            x: minX - padding[3],
            y: minY - padding[0],
            width: width + padding[1] + padding[3],
            height: height + padding[0] + padding[2]
          }, background);
          var backShape = this.backShape;

          if (backShape) {
            backShape.attr(attrs);
          } else {
            backShape = container.addShape('Rect', {
              zIndex: -1,
              attrs: attrs
            });
          }

          this.backShape = backShape;
          container.sort();
        }
      };

      _proto._addItem = function _addItem(item) {
        var itemsGroup = this.itemsGroup;
        var itemGroup = itemsGroup.addGroup({
          name: item.name,
          value: item.value,
          dataValue: item.dataValue,
          checked: item.checked
        });
        var unCheckStyle = this.unCheckStyle,
            unCheckColor = this.unCheckColor,
            nameStyle = this.nameStyle,
            valueStyle = this.valueStyle,
            wordSpace = this.wordSpace;
        var marker = item.marker,
            value = item.value;
        var startX = 0;

        if (unCheckColor) {
          unCheckStyle.fill = unCheckColor;
        }

        if (marker) {
          var radius = marker.radius || MARKER_RADIUS;
          var markerAttrs = mix({
            x: radius,
            y: this._titleHeight
          }, marker);

          if (item.checked === false) {
            mix(markerAttrs, unCheckStyle);
          }

          var markerShape = itemGroup.addShape('marker', {
            className: 'item-marker',
            attrs: markerAttrs
          });
          startX += markerShape.getBBox().width + wordSpace;
        }

        var nameText;
        var name = item.name;

        if (name) {
          var joinString = this.joinString || '';
          name = value ? name + joinString : name;
          nameText = itemGroup.addShape('text', {
            className: 'name',
            attrs: mix({
              x: startX,
              y: this._titleHeight,
              text: this._formatItemValue(name)
            }, nameStyle, item.checked === false ? unCheckStyle : null)
          });
        }

        if (value) {
          var valueX = startX;

          if (nameText) {
            valueX += nameText.getBBox().width;
          }

          itemGroup.addShape('text', {
            className: 'value',
            attrs: mix({
              x: valueX,
              y: this._titleHeight,
              text: value
            }, valueStyle, item.checked === false ? unCheckStyle : null)
          });
        }

        return itemGroup;
      };

      _proto._formatItemValue = function _formatItemValue(value) {
        var formatter = this.itemFormatter;

        if (formatter) {
          value = formatter.call(this, value);
        }

        return value;
      };

      _proto._getMaxItemWidth = function _getMaxItemWidth() {
        var width;
        var itemWidth = this.itemWidth;

        if (isNumber(itemWidth) || isNil(itemWidth)) {
          return itemWidth;
        }

        if (itemWidth === 'auto') {
          var itemsGroup = this.itemsGroup;
          var children = itemsGroup.get('children');
          var count = children.length;
          var maxItemWidth = 0;

          for (var i = 0; i < count; i++) {
            var _children$i$getBBox = children[i].getBBox(),
                _width = _children$i$getBBox.width;

            maxItemWidth = Math.max(maxItemWidth, _width);
          }

          var maxLength = this.maxLength;
          var itemGap = this.itemGap;
          var twoAvgWidth = (maxLength - itemGap) / 2;
          var threeAvgWidth = (maxLength - itemGap * 2) / 3;

          if (count === 2) {
            width = Math.max(maxItemWidth, twoAvgWidth);
          } else {
            // 1. max <= 3Avg, 3Avg
            // 2. 3Avg < max && max < 2avg, 2avg
            // 3. max > 2avg, max, one column
            if (maxItemWidth <= threeAvgWidth) {
              width = threeAvgWidth;
            } else if (maxItemWidth <= twoAvgWidth) {
              width = twoAvgWidth;
            } else {
              width = maxItemWidth;
            }
          }

          return width;
        }
      };

      _proto._adjustHorizontal = function _adjustHorizontal() {
        var maxLength = this.maxLength,
            itemsGroup = this.itemsGroup;
        var children = itemsGroup.get('children');
        var itemGap = this.itemGap,
            itemMarginBottom = this.itemMarginBottom;
        var titleHeight = this._titleHeight;
        var row = 0;
        var rowWidth = 0;
        var width;
        var height;

        var itemWidth = this._getMaxItemWidth();

        var legendHitBoxes = [];

        for (var i = 0, len = children.length; i < len; i++) {
          var child = children[i];
          var box = child.getBBox();
          var childHeight = box.height;
          var childWidth = box.width;
          width = itemWidth || childWidth;
          height = childHeight + itemMarginBottom;

          if (width - (maxLength - rowWidth) > 0.0001) {
            row++;
            rowWidth = 0;
          }

          child.moveTo(rowWidth, row * height);
          legendHitBoxes.push({
            x: rowWidth,
            y: row * height + titleHeight - childHeight / 2,
            width: childWidth * 1.375,
            height: childHeight * 1.375
          });
          rowWidth += width + itemGap;
        }

        this.legendHitBoxes = legendHitBoxes;
        return;
      };

      _proto._adjustVertical = function _adjustVertical() {
        var maxLength = this.maxLength,
            itemsGroup = this.itemsGroup;
        var itemGap = this.itemGap,
            itemMarginBottom = this.itemMarginBottom,
            itemWidth = this.itemWidth;
        var titleHeight = this._titleHeight;
        var children = itemsGroup.get('children');
        var colHeight = 0;
        var width;
        var height;
        var maxItemWidth = 0;
        var totalWidth = 0;
        var legendHitBoxes = [];

        for (var i = 0, length = children.length; i < length; i++) {
          var child = children[i];
          var bbox = child.getBBox();
          width = bbox.width;
          height = bbox.height;

          if (isNumber(itemWidth)) {
            maxItemWidth = itemWidth + itemGap;
          } else if (width > maxItemWidth) {
            maxItemWidth = width + itemGap;
          }

          if (maxLength - colHeight < height) {
            colHeight = 0;
            totalWidth += maxItemWidth;
            child.moveTo(totalWidth, 0);
            legendHitBoxes.push({
              x: totalWidth,
              y: titleHeight - height / 2,
              width: width * 1.375,
              height: height * 1.375
            });
          } else {
            child.moveTo(totalWidth, colHeight);
            legendHitBoxes.push({
              x: totalWidth,
              y: colHeight - height / 2 + titleHeight,
              width: width * 1.375,
              height: height * 1.375
            });
          }

          colHeight += height + itemMarginBottom;
        }

        this.legendHitBoxes = legendHitBoxes;
        return;
      };

      _proto._adjustItems = function _adjustItems() {
        var layout = this.layout;

        if (layout === 'horizontal') {
          this._adjustHorizontal();
        } else {
          this._adjustVertical();
        }
      };

      _proto.moveTo = function moveTo(x, y) {
        this.x = x;
        this.y = y;
        var container = this.container;
        container && container.moveTo(x, y);
        return this;
      };

      _proto.setItems = function setItems(items) {
        this.clearItems();

        this._renderItems(items);
      };

      _proto.setTitle = function setTitle(title) {
        this._renderTitle(title);
      };

      _proto.clearItems = function clearItems() {
        var itemsGroup = this.itemsGroup;
        itemsGroup.clear();
      };

      _proto.getWidth = function getWidth() {
        var container = this.container;
        var bbox = container.getBBox();
        return bbox.width;
      };

      _proto.getHeight = function getHeight() {
        var container = this.container;
        var bbox = container.getBBox();
        return bbox.height;
      };

      _proto.show = function show() {
        var container = this.container;
        container.show();
      };

      _proto.hide = function hide() {
        var container = this.container;
        container.hide();
      };

      _proto.clear = function clear() {
        var container = this.container;
        container.clear();
        container.remove(true);
      };

      return List;
    }();

    var TextBox = /*#__PURE__*/function () {
      var _proto = TextBox.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        return {
          x: 0,
          y: 0,
          content: '',
          textStyle: {
            fontSize: 12,
            fill: '#ffffff',
            textAlign: 'center',
            textBaseline: 'middle',
            fontFamily: 'Arial'
          },
          background: {
            radius: 1,
            fill: 'rgba(0, 0, 0, 0.65)',
            padding: [3, 5]
          },
          width: 0,
          height: 0,
          className: ''
        };
      };

      function TextBox(cfg) {
        deepMix(this, this.getDefaultCfg(), cfg);

        this._init();

        var content = this.content,
            x = this.x,
            y = this.y;

        if (!isNil(content)) {
          this.updateContent(content);
        }

        this.updatePosition(x, y);
      }

      _proto._init = function _init() {
        var content = this.content,
            textStyle = this.textStyle,
            background = this.background,
            className = this.className,
            visible = this.visible,
            context = this.context;
        var container = new Group({
          context: context,
          className: className,
          zIndex: 0,
          visible: visible
        });
        var text = container.addShape('Text', {
          className: className + '-text',
          zIndex: 1,
          attrs: mix({
            text: content,
            x: 0,
            y: 0
          }, textStyle)
        });
        var backgroundShape = container.addShape('Rect', {
          className: className + '-bg',
          zIndex: -1,
          attrs: mix({
            x: 0,
            y: 0,
            width: 0,
            height: 0
          }, background)
        });
        container.sort();
        this.container = container;
        this.textShape = text;
        this.backgroundShape = backgroundShape;
      };

      _proto._getBBox = function _getBBox() {
        var textShape = this.textShape;
        var background = this.background;
        var textBBox = textShape.getBBox();
        var padding = parsePadding(background.padding);
        var width = textBBox.width + padding[1] + padding[3];
        var height = textBBox.height + padding[0] + padding[2];
        var x = textBBox.minX - padding[3];
        var y = textBBox.minY - padding[0];
        return {
          x: x,
          y: y,
          width: width,
          height: height
        };
      };

      _proto.updateContent = function updateContent(text) {
        var textShape = this.textShape,
            backgroundShape = this.backgroundShape;

        if (!isNil(text)) {
          if (!isObject(text)) {
            text = {
              text: text
            };
          }

          textShape.attr(text); // update box shape

          var _this$_getBBox = this._getBBox(),
              x = _this$_getBBox.x,
              y = _this$_getBBox.y,
              tipWidth = _this$_getBBox.width,
              tipHeight = _this$_getBBox.height;

          var width = this.width || tipWidth;
          var height = this.height || tipHeight;
          backgroundShape.attr({
            x: x,
            y: y,
            width: width,
            height: height
          });
          this._width = width;
          this._height = height;
          this.content = text.text;
        }
      };

      _proto.updatePosition = function updatePosition(x, y) {
        var container = this.container;

        var _this$_getBBox2 = this._getBBox(),
            xMin = _this$_getBBox2.x,
            yMin = _this$_getBBox2.y;

        container.moveTo(x - xMin, y - yMin);
        this.x = x - xMin;
        this.y = y - yMin;
      };

      _proto.getWidth = function getWidth() {
        return this._width;
      };

      _proto.getHeight = function getHeight() {
        return this._height;
      };

      _proto.show = function show() {
        this.container.show();
      };

      _proto.hide = function hide() {
        this.container.hide();
      };

      _proto.clear = function clear() {
        var container = this.container;
        container.clear();
        container.remove(true);
        this.container = null;
        this.textShape = null;
        this.backgroundShape = null;
      };

      return TextBox;
    }();

    var GAP = 4;
    /**
     * TODOList：
     * 1. 移除 fixed 参数
     */

    var Tooltip = /*#__PURE__*/function () {
      var _proto = Tooltip.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        return {
          /**
           * wether show the crosshairs
           * @type {Object}
           */
          showCrosshairs: false,

          /**
           * the style for crosshairs
           * @type {Object}
           */
          crosshairsStyle: {
            stroke: 'rgba(0, 0, 0, 0.25)',
            lineWidth: 1
          },

          /**
           * the type of crosshairs, optional value is 'x', 'y' or 'xy', default is 'y'
           */
          crosshairsType: 'y',

          /**
           * show or hide the x axis tip
           */
          showXTip: false,

          /**
           * show or hide the y axis tip
           */
          showYTip: false,
          xTip: null,
          xTipBackground: {
            radius: 1,
            fill: 'rgba(0, 0, 0, 0.65)',
            padding: [3, 5]
          },
          xTipTextStyle: {
            fontSize: 12,
            fill: '#ffffff',
            textAlign: 'center',
            textBaseline: 'middle'
          },
          yTip: null,
          yTipBackground: {
            radius: 1,
            fill: 'rgba(0, 0, 0, 0.65)',
            padding: [3, 5]
          },
          yTipTextStyle: {
            fontSize: 12,
            fill: '#ffffff',
            textAlign: 'center',
            textBaseline: 'middle'
          },

          /**
           * the style for tooltip container's background
           * @type {Object}
           */
          background: null,

          /**
           * layout, can be horizontal or vertical
           * @type {String}
           */
          layout: 'horizontal',
          offsetX: 0,
          offsetY: 0
        };
      };

      function Tooltip(cfg) {
        deepMix(this, this.getDefaultCfg(), cfg);
        var frontPlot = this.frontPlot,
            custom = this.custom;

        if (!custom) {
          // custom means user do customize
          var container = new List(mix({
            parent: frontPlot,
            zIndex: 3
          }, cfg));
          this.container = container;
          var fixed = this.fixed,
              background = this.background;

          if (!fixed) {
            this.tooltipArrow = frontPlot.addShape('Polygon', {
              className: 'tooltip-arrow',
              visible: false,
              zIndex: 2,
              attrs: mix({
                points: []
              }, background)
            });
          }
        }

        if (this.showXTip) {
          var xTipBackground = this.xTipBackground,
              xTipTextStyle = this.xTipTextStyle;
          var xTipBox = new TextBox({
            context: frontPlot.get('context'),
            className: 'xTip',
            background: xTipBackground,
            textStyle: xTipTextStyle,
            visible: false
          });
          frontPlot.add(xTipBox.container);
          this.xTipBox = xTipBox;
        }

        if (this.showYTip) {
          var yTipBackground = this.yTipBackground,
              yTipTextStyle = this.yTipTextStyle;
          var yTipBox = new TextBox({
            context: frontPlot.get('context'),
            className: 'yTip',
            background: yTipBackground,
            textStyle: yTipTextStyle,
            visible: false
          });
          frontPlot.add(yTipBox.container);
          this.yTipBox = yTipBox;
        }

        if (this.showCrosshairs) {
          this._renderCrosshairs();
        }

        frontPlot.sort();
      }

      _proto.setContent = function setContent(title, items) {
        this.title = title;
        this.items = items;

        if (!this.custom) {
          var container = this.container;
          container.setTitle(title);
          container.setItems(items);
        }
      };

      _proto.setYTipContent = function setYTipContent(val) {
        var yTip = this.yTip;

        if (isFunction(yTip)) {
          val = yTip(val);
        } else {
          val = mix({
            text: val
          }, yTip);
        }

        this.yTipBox && this.yTipBox.updateContent(val);
      };

      _proto.setYTipPosition = function setYTipPosition(pos) {
        var plotRange = this.plotRange;
        var crosshairsShapeX = this.crosshairsShapeX;

        if (this.showYTip) {
          var yTipBox = this.yTipBox;
          var yTipHeight = yTipBox.getHeight();
          var yTipWidth = yTipBox.getWidth();
          var posX = plotRange.tl.x - yTipWidth;
          var posY = pos - yTipHeight / 2;

          if (posY <= plotRange.tl.y) {
            posY = plotRange.tl.y;
          }

          if (posY + yTipHeight >= plotRange.br.y) {
            posY = plotRange.br.y - yTipHeight;
          }

          if (posX < 0) {
            posX = plotRange.tl.x;
            crosshairsShapeX && crosshairsShapeX.attr('x1', plotRange.tl.x + yTipWidth);
          }

          yTipBox.updatePosition(posX, posY);
        }
      };

      _proto.setXTipContent = function setXTipContent(val) {
        var xTip = this.xTip;

        if (isFunction(xTip)) {
          val = xTip(val);
        } else {
          val = mix({
            text: val
          }, xTip);
        }

        this.xTipBox && this.xTipBox.updateContent(val);
      };

      _proto.setXTipPosition = function setXTipPosition(pos) {
        var showXTip = this.showXTip,
            canvas = this.canvas,
            plotRange = this.plotRange,
            xTipBox = this.xTipBox,
            crosshairsShapeY = this.crosshairsShapeY;

        if (showXTip) {
          // const el = canvas.get('el');
          // const canvasHeight = Util.getHeight(el);
          var canvasHeight = canvas.get('height');
          var xTipWidth = xTipBox.getWidth();
          var xTipHeight = xTipBox.getHeight();
          var posX = pos - xTipWidth / 2;
          var posY = plotRange.br.y;

          if (posX <= plotRange.tl.x) {
            posX = plotRange.tl.x;
          }

          if (posX + xTipWidth >= plotRange.tr.x) {
            posX = plotRange.tr.x - xTipWidth;
          }

          if (canvasHeight - posY < xTipHeight) {
            posY -= xTipHeight;
          }

          xTipBox.updatePosition(posX, posY);
          crosshairsShapeY && crosshairsShapeY.attr('y1', posY);
        }
      };

      _proto.setXCrosshairPosition = function setXCrosshairPosition(pos) {
        this.crosshairsShapeX && this.crosshairsShapeX.moveTo(0, pos);
      };

      _proto.setYCrosshairPosition = function setYCrosshairPosition(pos) {
        this.crosshairsShapeY && this.crosshairsShapeY.moveTo(pos, 0);
      };

      _proto.setPosition = function setPosition(items) {
        var container = this.container,
            plotRange = this.plotRange,
            offsetX = this.offsetX,
            offsetY = this.offsetY,
            fixed = this.fixed,
            tooltipArrow = this.tooltipArrow;

        if (!container) {
          return;
        }

        var containerBBox = container.container.getBBox();
        var minX = containerBBox.minX,
            minY = containerBBox.minY,
            width = containerBBox.width,
            height = containerBBox.height;
        var tl = plotRange.tl,
            tr = plotRange.tr;
        var posX = 0;
        var posY = tl.y - height - GAP + offsetY;

        if (posY < 0) {
          posY = 0;
        }

        if (fixed) {
          var x = (tl.x + tr.x) / 2;
          posX = x - width / 2 + offsetX;
        } else {
          var _x;

          if (items.length > 1) {
            _x = (items[0].x + items[items.length - 1].x) / 2;
          } else {
            _x = items[0].x;
          }

          posX = _x - width / 2 + offsetX;

          if (posX < tl.x) {
            posX = tl.x;
          }

          if (posX + width > tr.x) {
            posX = tr.x - width;
          }

          if (tooltipArrow) {
            var arrowY = posY + height;
            tooltipArrow.attr('points', [{
              x: _x - 3,
              y: arrowY
            }, {
              x: _x + 3,
              y: arrowY
            }, {
              x: _x,
              y: arrowY + GAP
            }]);
            var backShape = container.backShape;
            var radius = parsePadding(backShape.attr('radius'));

            if (_x === tl.x) {
              radius[3] = 0;
              tooltipArrow.attr('points', [{
                x: tl.x,
                y: arrowY
              }, {
                x: tl.x + GAP,
                y: arrowY
              }, {
                x: tl.x,
                y: arrowY + GAP
              }]);
            } else if (_x === tr.x) {
              radius[2] = 0;
              tooltipArrow.attr('points', [{
                x: tr.x - GAP,
                y: arrowY
              }, {
                x: tr.x,
                y: arrowY
              }, {
                x: tr.x,
                y: arrowY + GAP
              }]);
            }

            backShape.attr('radius', radius);
          }
        }

        container.moveTo(posX - minX, posY - minY);
      };

      _proto.setMarkers = function setMarkers(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        var self = this;
        var _cfg = cfg,
            items = _cfg.items,
            style = _cfg.style,
            type = _cfg.type;

        var markerGroup = self._getMarkerGroup(type);

        if (type === 'circle') {
          for (var i = 0, length = items.length; i < length; i++) {
            var item = items[i];
            markerGroup.addShape('marker', {
              className: 'tooltip-circle-marker',
              attrs: mix({
                x: item.x,
                y: item.y,
                stroke: item.color
              }, style)
            });
          }
        } else {
          markerGroup.addShape('rect', {
            className: 'tooltip-rect-marker',
            attrs: style
          });
        }
      };

      _proto.clearMarkers = function clearMarkers() {
        var markerGroup = this.markerGroup;
        markerGroup && markerGroup.clear();
      };

      _proto.show = function show() {
        var crosshairsShapeX = this.crosshairsShapeX;
        var crosshairsShapeY = this.crosshairsShapeY;
        var markerGroup = this.markerGroup;
        var container = this.container;
        var tooltipArrow = this.tooltipArrow;
        var xTipBox = this.xTipBox;
        var yTipBox = this.yTipBox;
        var canvas = this.canvas;
        crosshairsShapeX && crosshairsShapeX.show();
        crosshairsShapeY && crosshairsShapeY.show();
        markerGroup && markerGroup.show();
        container && container.show();
        tooltipArrow && tooltipArrow.show();
        xTipBox && xTipBox.show();
        yTipBox && yTipBox.show();
        canvas.draw();
      };

      _proto.hide = function hide() {
        var crosshairsShapeX = this.crosshairsShapeX;
        var crosshairsShapeY = this.crosshairsShapeY;
        var markerGroup = this.markerGroup;
        var container = this.container;
        var tooltipArrow = this.tooltipArrow;
        var xTipBox = this.xTipBox;
        var yTipBox = this.yTipBox;
        crosshairsShapeX && crosshairsShapeX.hide();
        crosshairsShapeY && crosshairsShapeY.hide();
        markerGroup && markerGroup.hide();
        container && container.hide();
        tooltipArrow && tooltipArrow.hide();
        xTipBox && xTipBox.hide();
        yTipBox && yTipBox.hide();
      };

      _proto.destroy = function destroy() {
        var crosshairsShapeX = this.crosshairsShapeX;
        var crosshairsShapeY = this.crosshairsShapeY;
        var markerGroup = this.markerGroup;
        var container = this.container;
        var tooltipArrow = this.tooltipArrow;
        var xTipBox = this.xTipBox;
        var yTipBox = this.yTipBox;
        crosshairsShapeX && crosshairsShapeX.remove(true);
        crosshairsShapeY && crosshairsShapeY.remove(true);
        markerGroup && markerGroup.remove(true);
        tooltipArrow && tooltipArrow.remove(true);
        container && container.clear();
        xTipBox && xTipBox.clear();
        yTipBox && yTipBox.clear();
        this.destroyed = true;
      };

      _proto._getMarkerGroup = function _getMarkerGroup(type) {
        var markerGroup = this.markerGroup;

        if (!markerGroup) {
          if (type === 'circle') {
            markerGroup = this.frontPlot.addGroup({
              zIndex: 1
            });
            this.frontPlot.sort();
          } else {
            markerGroup = this.backPlot.addGroup();
          }

          this.markerGroup = markerGroup;
        } else {
          markerGroup.clear();
        }

        return markerGroup;
      };

      _proto._renderCrosshairs = function _renderCrosshairs() {
        var crosshairsType = this.crosshairsType,
            crosshairsStyle = this.crosshairsStyle,
            frontPlot = this.frontPlot,
            plotRange = this.plotRange;
        var tl = plotRange.tl,
            br = plotRange.br;

        if (directionEnabled(crosshairsType, 'x')) {
          this.crosshairsShapeX = frontPlot.addShape('Line', {
            className: 'tooltip-crosshairs-x',
            zIndex: 0,
            visible: false,
            attrs: mix({
              x1: tl.x,
              y1: 0,
              x2: br.x,
              y2: 0
            }, crosshairsStyle)
          });
        }

        if (directionEnabled(crosshairsType, 'y')) {
          this.crosshairsShapeY = frontPlot.addShape('Line', {
            className: 'tooltip-crosshairs-y',
            zIndex: 0,
            visible: false,
            attrs: mix({
              x1: 0,
              y1: br.y,
              x2: 0,
              y2: tl.y
            }, crosshairsStyle)
          });
        }
      };

      return Tooltip;
    }();

    Global.tooltip = deepMix({
      triggerOn: 'press',
      triggerOff: 'pressend',
      alwaysShow: false,
      showTitle: false,
      showCrosshairs: false,
      crosshairsStyle: {
        stroke: 'rgba(0, 0, 0, 0.25)',
        lineWidth: 1
      },
      showTooltipMarker: true,
      background: {
        radius: 1,
        fill: 'rgba(0, 0, 0, 0.65)',
        padding: [3, 5]
      },
      titleStyle: {
        fontSize: 12,
        fill: '#ffffff',
        textAlign: 'start',
        textBaseline: 'top'
      },
      nameStyle: {
        fontSize: 12,
        fill: 'rgba(255, 255, 255, 0.65)',
        textAlign: 'start',
        textBaseline: 'middle'
      },
      valueStyle: {
        fontSize: 12,
        fill: '#ffffff',
        textAlign: 'start',
        textBaseline: 'middle'
      },
      showItemMarker: true,
      itemMarkerStyle: {
        radius: 3,
        symbol: 'circle',
        lineWidth: 1,
        stroke: '#ffffff'
      },
      layout: 'horizontal',
      snap: false
    }, Global.tooltip || {});

    function _getTooltipValueScale(geom) {
      var colorAttr = geom.getAttr('color');

      if (colorAttr) {
        var colorScale = colorAttr.getScale(colorAttr.type);

        if (colorScale.isLinear) {
          return colorScale;
        }
      }

      var xScale = geom.getXScale();
      var yScale = geom.getYScale();

      if (yScale) {
        return yScale;
      }

      return xScale;
    }

    function getTooltipName(geom, origin) {
      var name;
      var nameScale;

      var groupScales = geom._getGroupScales();

      if (groupScales.length) {
        each(groupScales, function (scale) {
          nameScale = scale;
          return false;
        });
      }

      if (nameScale) {
        var field = nameScale.field;
        name = nameScale.getText(origin[field]);
      } else {
        var valueScale = _getTooltipValueScale(geom);

        name = valueScale.alias || valueScale.field;
      }

      return name;
    }

    function getTooltipValue(geom, origin) {
      var scale = _getTooltipValueScale(geom);

      return scale.getText(origin[scale.field]);
    }

    function getTooltipTitle(geom, origin) {
      var position = geom.getAttr('position');
      var field = position.getFields()[0];
      var scale = geom.get('scales')[field];
      return scale.getText(origin[scale.field]);
    }

    function _indexOfArray(items, item) {
      var rst = -1;
      each(items, function (sub, index) {
        if (sub.title === item.title && sub.name === item.name && sub.value === item.value && sub.color === item.color) {
          rst = index;
          return false;
        }
      });
      return rst;
    }

    function _uniqItems(items) {
      var tmp = [];
      each(items, function (item) {
        var index = _indexOfArray(tmp, item);

        if (index === -1) {
          tmp.push(item);
        } else {
          tmp[index] = item;
        }
      });
      return tmp;
    }

    function isEqual$1(arr1, arr2) {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    }

    var TooltipController = /*#__PURE__*/function () {
      function TooltipController(cfg) {
        var _this = this;

        _defineProperty(this, "handleShowEvent", function (ev) {
          var chart = _this.chart;
          if (!_this.enable) return;
          var plot = chart.get('plotRange');
          var point = createEvent(ev, chart);

          if (!isPointInPlot(point, plot) && !_this._tooltipCfg.alwaysShow) {
            // not in chart plot
            _this.hideTooltip();

            return;
          }

          var lastTimeStamp = _this.timeStamp;
          var timeStamp = +new Date();

          if (timeStamp - lastTimeStamp > 16) {
            _this.showTooltip(point);

            _this.timeStamp = timeStamp;
          }
        });

        _defineProperty(this, "handleHideEvent", function () {
          if (!_this.enable) return;

          _this.hideTooltip();
        });

        this.enable = true;
        this.cfg = {};
        this.tooltip = null;
        this.chart = null;
        this.timeStamp = 0;
        mix(this, cfg);
        var _chart = this.chart;

        var canvas = _chart.get('canvas');

        this.canvas = canvas;
        this.canvasDom = canvas.get('el');
      }

      var _proto = TooltipController.prototype;

      _proto._setCrosshairsCfg = function _setCrosshairsCfg() {
        var self = this;
        var chart = self.chart;
        var defaultCfg = mix({}, Global.tooltip);
        var geoms = chart.get('geoms');
        var shapes = [];
        each(geoms, function (geom) {
          var type = geom.get('type');

          if (shapes.indexOf(type) === -1) {
            shapes.push(type);
          }
        });
        var coordType = chart.get('coord').type;

        if (geoms.length && (coordType === 'cartesian' || coordType === 'rect')) {
          if (shapes.length === 1 && ['line', 'area', 'path', 'point'].indexOf(shapes[0]) !== -1) {
            mix(defaultCfg, {
              showCrosshairs: true
            });
          }
        }

        return defaultCfg;
      };

      _proto._getMaxLength = function _getMaxLength(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        var _cfg = cfg,
            layout = _cfg.layout,
            plotRange = _cfg.plotRange;
        return layout === 'horizontal' ? plotRange.br.x - plotRange.bl.x : plotRange.bl.y - plotRange.tr.y;
      };

      _proto.render = function render() {
        var self = this;

        if (self.tooltip) {
          return;
        }

        var chart = self.chart;
        var canvas = chart.get('canvas');
        var frontPlot = chart.get('frontPlot').addGroup({
          className: 'tooltipContainer',
          zIndex: 10
        });
        var backPlot = chart.get('backPlot').addGroup({
          className: 'tooltipContainer'
        });
        var plotRange = chart.get('plotRange');
        var coord = chart.get('coord');

        var defaultCfg = self._setCrosshairsCfg();

        var cfg = self.cfg; // 通过 chart.tooltip() 接口传入的 tooltip 配置项

        var tooltipCfg = deepMix({
          plotRange: plotRange,
          frontPlot: frontPlot,
          backPlot: backPlot,
          canvas: canvas,
          fixed: coord.transposed || coord.isPolar
        }, defaultCfg, cfg); // 创建 tooltip 实例需要的配置，不应该修改 this.cfg，即用户传入的配置

        tooltipCfg.maxLength = self._getMaxLength(tooltipCfg);
        this._tooltipCfg = tooltipCfg;
        var tooltip = new Tooltip(tooltipCfg);
        self.tooltip = tooltip; // 需要保持tooltip一直显示

        if (tooltipCfg.alwaysShow && self.prePoint) {
          this.showTooltip(self.prePoint);
        }

        self.bindEvents();
      };

      _proto.clear = function clear() {
        var tooltip = this.tooltip;

        if (tooltip) {
          tooltip.destroy();
          this.unBindEvents();
        }

        this.tooltip = null;
        this._lastActive = null;
      };

      _proto._getTooltipMarkerStyle = function _getTooltipMarkerStyle(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        var _cfg2 = cfg,
            type = _cfg2.type,
            items = _cfg2.items;
        var tooltipCfg = this._tooltipCfg;

        if (type === 'rect') {
          var x;
          var y;
          var width;
          var height;
          var chart = this.chart;

          var _chart$get = chart.get('plotRange'),
              tl = _chart$get.tl,
              br = _chart$get.br;

          var coord = chart.get('coord');
          var firstItem = items[0];
          var lastItem = items[items.length - 1];
          var intervalWidth = firstItem.width;

          if (coord.transposed) {
            x = tl.x;
            y = lastItem.y - intervalWidth * 0.75;
            width = br.x - tl.x;
            height = firstItem.y - lastItem.y + 1.5 * intervalWidth;
          } else {
            x = firstItem.x - intervalWidth * 0.75;
            y = tl.y;
            width = lastItem.x - firstItem.x + 1.5 * intervalWidth;
            height = br.y - tl.y;
          }

          cfg.style = mix({
            x: x,
            y: y,
            width: width,
            height: height,
            fill: '#CCD6EC',
            opacity: 0.3
          }, tooltipCfg.tooltipMarkerStyle);
        } else {
          cfg.style = mix({
            radius: 4,
            fill: '#ffffff',
            lineWidth: 2
          }, tooltipCfg.tooltipMarkerStyle);
        }

        return cfg;
      };

      _proto._setTooltip = function _setTooltip(point, items, tooltipMarkerCfg) {
        if (tooltipMarkerCfg === void 0) {
          tooltipMarkerCfg = {};
        }

        this.prePoint = point;
        var lastActive = this._lastActive;
        var tooltip = this.tooltip;
        var cfg = this._tooltipCfg;
        items = _uniqItems(items);
        var chart = this.chart;
        var coord = chart.get('coord');
        var yScale = chart.getYScales()[0];
        var snap = cfg.snap;

        if (snap === false && yScale.isLinear) {
          var invertPoint = coord.invertPoint(point);
          var plot = chart.get('plotRange');
          var tip;
          var pos;

          if (isPointInPlot(point, plot)) {
            if (coord.transposed) {
              tip = yScale.invert(invertPoint.x);
              pos = point.x;
              tooltip.setXTipContent(tip);
              tooltip.setXTipPosition(pos);
              tooltip.setYCrosshairPosition(pos);
            } else {
              tip = yScale.invert(invertPoint.y);
              pos = point.y;
              tooltip.setYTipContent(tip);
              tooltip.setYTipPosition(pos);
              tooltip.setXCrosshairPosition(pos);
            }
          }
        }

        if (cfg.onShow) {
          cfg.onShow({
            x: point.x,
            y: point.y,
            tooltip: tooltip,
            items: items,
            tooltipMarkerCfg: tooltipMarkerCfg
          });
        }

        if (isEqual$1(lastActive, items)) {
          if (snap === false && (directionEnabled(cfg.crosshairsType, 'y') || cfg.showYTip)) {
            var canvas = this.chart.get('canvas');
            canvas.draw();
          }

          return;
        }

        this._lastActive = items;
        var onChange = cfg.onChange;

        if (onChange) {
          onChange({
            x: point.x,
            y: point.y,
            tooltip: tooltip,
            items: items,
            tooltipMarkerCfg: tooltipMarkerCfg
          });
        }

        var first = items[0];
        var title = first.title || first.name;
        var xTipPosX = first.x;

        if (items.length > 1) {
          xTipPosX = (items[0].x + items[items.length - 1].x) / 2;
        }

        tooltip.setContent(title, items, coord.transposed);
        tooltip.setPosition(items, point);

        if (coord.transposed) {
          var yTipPosY = first.y;

          if (items.length > 1) {
            yTipPosY = (items[0].y + items[items.length - 1].y) / 2;
          }

          tooltip.setYTipContent(title);
          tooltip.setYTipPosition(yTipPosY);
          tooltip.setXCrosshairPosition(yTipPosY);

          if (snap) {
            tooltip.setXTipContent(first.value);
            tooltip.setXTipPosition(xTipPosX);
            tooltip.setYCrosshairPosition(xTipPosX);
          }
        } else {
          tooltip.setXTipContent(title);
          tooltip.setXTipPosition(xTipPosX);
          tooltip.setYCrosshairPosition(xTipPosX);

          if (snap) {
            tooltip.setYTipContent(first.value);
            tooltip.setYTipPosition(first.y);
            tooltip.setXCrosshairPosition(first.y);
          }
        }

        var markerItems = tooltipMarkerCfg.items;

        if (cfg.showTooltipMarker && markerItems.length) {
          tooltipMarkerCfg = this._getTooltipMarkerStyle(tooltipMarkerCfg);
          tooltip.setMarkers(tooltipMarkerCfg);
        } else {
          tooltip.clearMarkers();
        }

        tooltip.show();
      };

      _proto.showTooltip = function showTooltip(point) {
        var self = this;
        var chart = self.chart;
        var tooltipMarkerType;
        var tooltipMarkerItems = [];
        var items = [];
        var cfg = self._tooltipCfg;
        var showItemMarker = cfg.showItemMarker,
            itemMarkerStyle = cfg.itemMarkerStyle,
            alwaysShow = cfg.alwaysShow;
        var marker;

        if (showItemMarker) {
          marker = itemMarkerStyle;
        }

        var geoms = chart.get('geoms');
        var coord = chart.get('coord');
        each(geoms, function (geom) {
          if (geom.get('visible')) {
            var type = geom.get('type');
            var records = geom.getSnapRecords(point);
            var adjust = geom.get('adjust'); // 漏斗图和金子塔图tooltip位置有问题，暂时不开放显示

            if (type === 'interval' && adjust && adjust.type === 'symmetric') {
              return;
            }

            each(records, function (record) {
              var x = record.x,
                  y = record.y,
                  _origin = record._origin,
                  color = record.color;

              if ((x || !isNaN(x)) && (y || !isNaN(y))) {
                var tooltipItem = {
                  x: x,
                  y: isArray(y) ? y[1] : y,
                  color: color || Global.defaultColor,
                  origin: _origin,
                  name: getTooltipName(geom, _origin),
                  value: getTooltipValue(geom, _origin),
                  title: getTooltipTitle(geom, _origin)
                };

                if (marker) {
                  tooltipItem.marker = mix({
                    fill: color || Global.defaultColor
                  }, marker);
                }

                items.push(tooltipItem);

                if (['line', 'area', 'path'].indexOf(type) !== -1) {
                  tooltipMarkerType = 'circle';
                  tooltipMarkerItems.push(tooltipItem);
                } else if (type === 'interval' && (coord.type === 'cartesian' || coord.type === 'rect')) {
                  tooltipMarkerType = 'rect';
                  tooltipItem.width = geom.getSize(record._origin);
                  tooltipMarkerItems.push(tooltipItem);
                }
              }
            });
          }
        });

        if (items.length) {
          var tooltipMarkerCfg = {
            items: tooltipMarkerItems,
            type: tooltipMarkerType
          };

          self._setTooltip(point, items, tooltipMarkerCfg);

          return;
        }

        if (!alwaysShow) {
          self.hideTooltip();
        }
      };

      _proto.hideTooltip = function hideTooltip() {
        var cfg = this._tooltipCfg;
        this._lastActive = null;
        var tooltip = this.tooltip;

        if (tooltip) {
          tooltip.hide();

          if (cfg.onHide) {
            cfg.onHide({
              tooltip: tooltip
            });
          }

          var canvas = this.chart.get('canvas');
          canvas.draw();
        }
      };

      _proto._handleEvent = function _handleEvent(methodName, method, action) {
        var canvas = this.canvas;
        each([].concat(methodName), function (aMethod) {
          if (action === 'bind') {
            canvas.on(aMethod, method);
          } else {
            canvas.off(aMethod, method);
          }
        });
      };

      _proto.bindEvents = function bindEvents() {
        var cfg = this._tooltipCfg;
        var triggerOn = cfg.triggerOn,
            triggerOff = cfg.triggerOff,
            alwaysShow = cfg.alwaysShow;
        triggerOn && this._handleEvent(triggerOn, this.handleShowEvent, 'bind'); // 如果 !alwaysShow, 则在手势离开后就隐藏

        if (!alwaysShow) {
          this._handleEvent(triggerOff, this.handleHideEvent, 'bind');
        }
      };

      _proto.unBindEvents = function unBindEvents() {
        var cfg = this._tooltipCfg;
        var triggerOn = cfg.triggerOn,
            triggerOff = cfg.triggerOff,
            alwaysShow = cfg.alwaysShow;
        triggerOn && this._handleEvent(triggerOn, this.handleShowEvent, 'unBind');

        if (!alwaysShow) {
          this._handleEvent(triggerOff, this.handleHideEvent, 'unBind');
        }
      };

      return TooltipController;
    }();

    function init(chart) {
      var tooltipController = new TooltipController({
        chart: chart
      });
      chart.set('tooltipController', tooltipController);

      chart.tooltip = function (enable, cfg) {
        if (isObject(enable)) {
          cfg = enable;
          enable = true;
        }

        tooltipController.enable = enable;

        if (cfg) {
          tooltipController.cfg = cfg;
        }

        return this;
      };
    }

    function afterGeomDraw(chart) {
      var tooltipController = chart.get('tooltipController');
      tooltipController.render();

      chart.showTooltip = function (point) {
        tooltipController.showTooltip(point);
        return this;
      };

      chart.hideTooltip = function () {
        tooltipController.hideTooltip();
        return this;
      };
    }

    function clearInner(chart) {
      var tooltipController = chart.get('tooltipController');
      tooltipController.clear();
    }
    var tooltip = {
      init: init,
      afterGeomDraw: afterGeomDraw,
      clearInner: clearInner
    };

    var Tooltip$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init,
        afterGeomDraw: afterGeomDraw,
        clearInner: clearInner,
        'default': tooltip
    });

    Global.guide = deepMix({
      line: {
        style: {
          stroke: '#a3a3a3',
          lineWidth: 1
        },
        top: true
      },
      text: {
        style: {
          fill: '#787878',
          textAlign: 'center',
          textBaseline: 'middle'
        },
        offsetX: 0,
        offsetY: 0,
        top: true
      },
      rect: {
        style: {
          fill: '#fafafa'
        },
        top: false
      },
      arc: {
        style: {
          stroke: '#a3a3a3'
        },
        top: true
      },
      html: {
        offsetX: 0,
        offsetY: 0,
        alignX: 'center',
        alignY: 'middle'
      },
      tag: {
        top: true,
        offsetX: 0,
        offsetY: 0,
        side: 4,
        background: {
          padding: 5,
          radius: 2,
          fill: '#1890FF'
        },
        textStyle: {
          fontSize: 12,
          fill: '#ffffff',
          textAlign: 'center',
          textBaseline: 'middle'
        }
      },
      point: {
        top: true,
        offsetX: 0,
        offsetY: 0,
        style: {
          fill: '#ffffff',
          r: 3,
          lineWidth: 2,
          stroke: '#1890ff'
        }
      }
    }, Global.guide || {});

    var GuideController = /*#__PURE__*/function () {
      function GuideController(cfg) {
        this.guides = [];
        this.xScale = null;
        this.yScales = null;
        this.guideShapes = [];
        mix(this, cfg);
      }

      var _proto = GuideController.prototype;

      _proto._toString = function _toString(position) {
        if (isFunction(position)) {
          position = position(this.xScale, this.yScales);
        }

        position = position.toString();
        return position;
      };

      _proto._getId = function _getId(shape, guide) {
        var id = guide.id;

        if (!id) {
          var type = guide.type;

          if (type === 'arc' || type === 'line' || type === 'rect') {
            id = this._toString(guide.start) + '-' + this._toString(guide.end);
          } else {
            id = this._toString(guide.position);
          }
        }

        return id;
      };

      _proto.paint = function paint(coord) {
        var self = this;
        var chart = self.chart,
            guides = self.guides,
            xScale = self.xScale,
            yScales = self.yScales;
        var guideShapes = [];
        each(guides, function (guide, idx) {
          guide.xScale = xScale;
          guide.yScales = yScales;
          var container;

          if (guide.type === 'regionFilter') {
            // TODO: RegionFilter support animation
            guide.chart = chart;
          } else {
            container = guide.top ? self.frontPlot : self.backPlot;
          }

          guide.coord = coord;
          guide.container = container;
          guide.canvas = chart.get('canvas');
          var shape = guide.render(coord, container);

          if (shape) {
            var id = self._getId(shape, guide);

            [].concat(shape).forEach(function (s) {
              s._id = s.get('className') + '-' + id;
              s.set('index', idx);
              guideShapes.push(s);
            });
          }
        });
        self.guideShapes = guideShapes;
      };

      _proto.clear = function clear() {
        this.reset();
        this.guides = [];
        return this;
      };

      _proto.reset = function reset() {
        var guides = this.guides;
        each(guides, function (guide) {
          guide.remove();
        });
      };

      _proto._createGuide = function _createGuide(type, cfg) {
        var ClassName = upperFirst(type);
        var guide = new GuideBase[ClassName](deepMix({}, Global.guide[type], cfg));
        this.guides.push(guide);
        return guide;
      };

      _proto.line = function line(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        return this._createGuide('line', cfg);
      };

      _proto.text = function text(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        return this._createGuide('text', cfg);
      };

      _proto.arc = function arc(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        return this._createGuide('arc', cfg);
      };

      _proto.html = function html(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        return this._createGuide('html', cfg);
      };

      _proto.rect = function rect(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        return this._createGuide('rect', cfg);
      };

      _proto.tag = function tag(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        return this._createGuide('tag', cfg);
      };

      _proto.point = function point(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        return this._createGuide('point', cfg);
      };

      _proto.regionFilter = function regionFilter(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        return this._createGuide('regionFilter', cfg);
      };

      return GuideController;
    }();

    function init$1(chart) {
      var guideController = new GuideController({
        frontPlot: chart.get('frontPlot').addGroup({
          zIndex: 20,
          className: 'guideContainer'
        }),
        backPlot: chart.get('backPlot').addGroup({
          className: 'guideContainer'
        })
      });
      chart.set('guideController', guideController);
      /**
       * 为图表添加 guide
       * @return {GuideController} 返回 guide 控制器
       */

      chart.guide = function () {
        return guideController;
      };
    }

    function afterGeomDraw$1(chart) {
      var guideController = chart.get('guideController');

      if (!guideController.guides.length) {
        return;
      }

      var xScale = chart.getXScale();
      var yScales = chart.getYScales();
      var coord = chart.get('coord');
      guideController.xScale = xScale;
      guideController.yScales = yScales;
      guideController.chart = chart; // for regionFilter

      guideController.paint(coord);
    }

    function clear(chart) {
      chart.get('guideController').clear();
    }

    function repaint(chart) {
      chart.get('guideController').reset();
    }
    var guide = {
      init: init$1,
      afterGeomDraw: afterGeomDraw$1,
      clear: clear,
      repaint: repaint
    };

    var Guide = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$1,
        afterGeomDraw: afterGeomDraw$1,
        clear: clear,
        repaint: repaint,
        'default': guide
    });

    var LEGEND_GAP = 12;
    var MARKER_SIZE = 3;
    var DEFAULT_CFG = {
      itemMarginBottom: 12,
      itemGap: 10,
      showTitle: false,
      titleStyle: {
        fontSize: 12,
        fill: '#808080',
        textAlign: 'start',
        textBaseline: 'top'
      },
      nameStyle: {
        fill: '#808080',
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'middle'
      },
      valueStyle: {
        fill: '#000000',
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'middle'
      },
      unCheckStyle: {
        fill: '#bfbfbf'
      },
      itemWidth: 'auto',
      wordSpace: 6,
      selectedMode: 'multiple' // 'multiple' or 'single'

    }; // Register the default configuration for Legend

    Global.legend = deepMix({
      common: DEFAULT_CFG,
      // common legend configuration
      right: mix({
        position: 'right',
        layout: 'vertical'
      }, DEFAULT_CFG),
      left: mix({
        position: 'left',
        layout: 'vertical'
      }, DEFAULT_CFG),
      top: mix({
        position: 'top',
        layout: 'horizontal'
      }, DEFAULT_CFG),
      bottom: mix({
        position: 'bottom',
        layout: 'horizontal'
      }, DEFAULT_CFG)
    }, Global.legend || {});

    function getPaddingByPos(pos, appendPadding) {
      var padding = 0;
      appendPadding = parsePadding(appendPadding);

      switch (pos) {
        case 'top':
          padding = appendPadding[0];
          break;

        case 'right':
          padding = appendPadding[1];
          break;

        case 'bottom':
          padding = appendPadding[2];
          break;

        case 'left':
          padding = appendPadding[3];
          break;
      }

      return padding;
    }

    var LegendController = /*#__PURE__*/function () {
      function LegendController(cfg) {
        var _this = this;

        _defineProperty(this, "handleEvent", function (ev) {
          var self = _this;

          function findItem(x, y) {
            var result = null;
            var legends = self.legends;
            each(legends, function (legendItems) {
              each(legendItems, function (legend) {
                var itemsGroup = legend.itemsGroup,
                    legendHitBoxes = legend.legendHitBoxes;
                var children = itemsGroup.get('children');

                if (children.length) {
                  var legendPosX = legend.x;
                  var legendPosY = legend.y;
                  each(legendHitBoxes, function (box, index) {
                    if (x >= box.x + legendPosX && x <= box.x + box.width + legendPosX && y >= box.y + legendPosY && y <= box.height + box.y + legendPosY) {
                      // inbox
                      result = {
                        clickedItem: children[index],
                        clickedLegend: legend
                      };
                      return false;
                    }
                  });
                }
              });
            });
            return result;
          }

          var chart = self.chart;

          var _createEvent = createEvent(ev, chart),
              x = _createEvent.x,
              y = _createEvent.y;

          var clicked = findItem(x, y);

          if (clicked && clicked.clickedLegend.clickable !== false) {
            var clickedItem = clicked.clickedItem,
                clickedLegend = clicked.clickedLegend;

            if (clickedLegend.onClick) {
              ev.clickedItem = clickedItem;
              clickedLegend.onClick(ev);
            } else if (!clickedLegend.custom) {
              var checked = clickedItem.get('checked');
              var value = clickedItem.get('dataValue');
              var filteredVals = clickedLegend.filteredVals,
                  field = clickedLegend.field,
                  selectedMode = clickedLegend.selectedMode;
              var isSingeSelected = selectedMode === 'single';

              if (isSingeSelected) {
                chart.filter(field, function (val) {
                  return val === value;
                });
              } else {
                if (checked) {
                  filteredVals.push(value);
                } else {
                  remove(filteredVals, value);
                }

                chart.filter(field, function (val) {
                  return filteredVals.indexOf(val) === -1;
                });
              }

              chart.repaint();
            }
          }
        });

        this.legendCfg = {};
        this.enable = true;
        this.position = 'top';
        mix(this, cfg);
        var _chart = this.chart;
        this.canvasDom = _chart.get('canvas').get('el');
        this.clear();
      }

      var _proto = LegendController.prototype;

      _proto.addLegend = function addLegend(scale, items, filteredVals) {
        var self = this;
        var legendCfg = self.legendCfg;
        var field = scale.field;
        var fieldCfg = legendCfg[field];

        if (fieldCfg === false) {
          return null;
        }

        if (fieldCfg && fieldCfg.custom) {
          self.addCustomLegend(field);
        } else {
          var position = legendCfg.position || self.position;

          if (fieldCfg && fieldCfg.position) {
            position = fieldCfg.position;
          }

          if (scale.isCategory) {
            self._addCategoryLegend(scale, items, position, filteredVals);
          }
        }
      };

      _proto.addCustomLegend = function addCustomLegend(field) {
        var self = this;
        var legendCfg = self.legendCfg;

        if (field && legendCfg[field]) {
          legendCfg = legendCfg[field];
        }

        var position = legendCfg.position || self.position;
        var legends = self.legends;
        legends[position] = legends[position] || [];
        var items = legendCfg.items;

        if (!items) {
          return null;
        }

        var container = self.container;
        each(items, function (item) {
          if (!isPlainObject(item.marker)) {
            item.marker = {
              symbol: item.marker || 'circle',
              fill: item.fill,
              radius: MARKER_SIZE
            };
          } else {
            item.marker.radius = item.marker.radius || MARKER_SIZE;
          }

          item.checked = isNil(item.checked) ? true : item.checked;
          item.name = item.name || item.value;
        });
        var legend = new List(deepMix({}, Global.legend[position], legendCfg, {
          maxLength: self._getMaxLength(position),
          items: items,
          parent: container
        }));
        legends[position].push(legend);
      };

      _proto.clear = function clear() {
        var legends = this.legends;
        each(legends, function (legendItems) {
          each(legendItems, function (legend) {
            legend.clear();
          });
        });
        this.legends = {};
        this.unBindEvents();
      };

      _proto._isFiltered = function _isFiltered(scale, values, value) {
        var rst = false;
        each(values, function (val) {
          rst = rst || scale.getText(val) === scale.getText(value);

          if (rst) {
            return false;
          }
        });
        return rst;
      };

      _proto._getMaxLength = function _getMaxLength(position) {
        var chart = this.chart;
        var appendPadding = parsePadding(chart.get('appendPadding'));
        return position === 'right' || position === 'left' ? chart.get('height') - (appendPadding[0] + appendPadding[2]) : chart.get('width') - (appendPadding[1] + appendPadding[3]);
      };

      _proto._addCategoryLegend = function _addCategoryLegend(scale, items, position, filteredVals) {
        var self = this;
        var legendCfg = self.legendCfg,
            legends = self.legends,
            container = self.container,
            chart = self.chart;
        var field = scale.field;
        legends[position] = legends[position] || [];
        var symbol = 'circle';

        if (legendCfg[field] && legendCfg[field].marker) {
          symbol = legendCfg[field].marker;
        } else if (legendCfg.marker) {
          symbol = legendCfg.marker;
        }

        each(items, function (item) {
          if (isPlainObject(symbol)) {
            mix(item.marker, symbol);
          } else {
            item.marker.symbol = symbol;
          }

          if (filteredVals) {
            item.checked = !self._isFiltered(scale, filteredVals, item.dataValue);
          }
        });
        var legendItems = chart.get('legendItems');
        legendItems[field] = items;
        var lastCfg = deepMix({}, Global.legend[position], legendCfg[field] || legendCfg, {
          maxLength: self._getMaxLength(position),
          items: items,
          field: field,
          filteredVals: filteredVals,
          parent: container
        });

        if (lastCfg.showTitle) {
          deepMix(lastCfg, {
            title: scale.alias || scale.field
          });
        }

        var legend = new List(lastCfg);
        legends[position].push(legend);
        return legend;
      };

      _proto._alignLegend = function _alignLegend(legend, pre, position) {
        var self = this;
        var _self$plotRange = self.plotRange,
            tl = _self$plotRange.tl,
            bl = _self$plotRange.bl;
        var chart = self.chart;
        var offsetX = legend.offsetX || 0;
        var offsetY = legend.offsetY || 0;
        var chartWidth = chart.get('width');
        var chartHeight = chart.get('height');
        var appendPadding = parsePadding(chart.get('appendPadding'));
        var legendHeight = legend.getHeight();
        var legendWidth = legend.getWidth();
        var x = 0;
        var y = 0;

        if (position === 'left' || position === 'right') {
          var verticalAlign = legend.verticalAlign || 'middle';
          var height = Math.abs(tl.y - bl.y);
          x = position === 'left' ? appendPadding[3] : chartWidth - legendWidth - appendPadding[1];
          y = (height - legendHeight) / 2 + tl.y;

          if (verticalAlign === 'top') {
            y = tl.y;
          } else if (verticalAlign === 'bottom') {
            y = bl.y - legendHeight;
          }

          if (pre) {
            y = pre.get('y') - legendHeight - LEGEND_GAP;
          }
        } else {
          var align = legend.align || 'left';
          x = appendPadding[3];

          if (align === 'center') {
            x = chartWidth / 2 - legendWidth / 2;
          } else if (align === 'right') {
            x = chartWidth - (legendWidth + appendPadding[1]);
          }

          y = position === 'top' ? appendPadding[0] + Math.abs(legend.container.getBBox().minY) : chartHeight - legendHeight;

          if (pre) {
            var preWidth = pre.getWidth();
            x = pre.x + preWidth + LEGEND_GAP;
          }
        }

        if (position === 'bottom' && offsetY > 0) {
          offsetY = 0;
        }

        if (position === 'right' && offsetX > 0) {
          offsetX = 0;
        }

        legend.moveTo(x + offsetX, y + offsetY);
      };

      _proto.alignLegends = function alignLegends() {
        var self = this;
        var legends = self.legends;
        each(legends, function (legendItems, position) {
          each(legendItems, function (legend, index) {
            var pre = legendItems[index - 1];

            self._alignLegend(legend, pre, position);
          });
        });
        return self;
      };

      _proto.bindEvents = function bindEvents() {
        var legendCfg = this.legendCfg;
        var triggerOn = legendCfg.triggerOn || 'touchstart';
        addEventListener(this.canvasDom, triggerOn, this.handleEvent);
      };

      _proto.unBindEvents = function unBindEvents() {
        var legendCfg = this.legendCfg;
        var triggerOn = legendCfg.triggerOn || 'touchstart';
        removeEventListener(this.canvasDom, triggerOn, this.handleEvent);
      };

      return LegendController;
    }();

    function init$2(chart) {
      var legendController = new LegendController({
        container: chart.get('backPlot').addGroup(),
        plotRange: chart.get('plotRange'),
        chart: chart
      });
      chart.set('legendController', legendController);

      chart.legend = function (field, cfg) {
        var legendCfg = legendController.legendCfg;
        legendController.enable = true;

        if (isBoolean(field)) {
          legendController.enable = field;
          legendCfg = cfg || {};
        } else if (isObject(field)) {
          legendCfg = field;
        } else {
          legendCfg[field] = cfg;
        }

        legendController.legendCfg = legendCfg;
        return this;
      };
    }

    function beforeGeomDraw(chart) {
      var legendController = chart.get('legendController');
      if (!legendController.enable) return null; // legend is not displayed

      var legendCfg = legendController.legendCfg,
          container = legendController.container;

      if (legendCfg && legendCfg.custom) {
        legendController.addCustomLegend();
      } else {
        var legendItems = chart.getLegendItems();
        var scales = chart.get('scales');
        var filters = chart.get('filters');
        each(legendItems, function (items, field) {
          var scale = scales[field];
          var values = scale.values;
          var filteredVals;

          if (filters && filters[field]) {
            filteredVals = values.filter(function (v) {
              return !filters[field](v);
            });
          } else {
            filteredVals = [];
          }

          legendController.addLegend(scale, items, filteredVals);
        });
      }

      if (legendCfg && legendCfg.clickable !== false) {
        legendController.bindEvents();
      }

      var legends = legendController.legends;
      var legendRange = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      each(legends, function (legendItems, position) {
        var padding = 0;
        each(legendItems, function (legend) {
          var width = legend.getWidth();
          var height = legend.getHeight();

          if (position === 'top' || position === 'bottom') {
            padding = Math.max(padding, height);

            if (legend.offsetY > 0) {
              padding += legend.offsetY;
            }
          } else {
            padding = Math.max(padding, width);

            if (legend.offsetX > 0) {
              padding += legend.offsetX;
            }
          }
        });
        legendRange[position] = padding + getPaddingByPos(position, chart.get('appendPadding'));
      });
      chart.set('legendRange', legendRange);

      if (Object.keys(legends).length) {
        container.set('ariaLabel', lang.legend.prefix);
      } else {
        container.set('ariaLabel', null);
      }
    }

    function afterGeomDraw$2(chart) {
      var legendController = chart.get('legendController');
      legendController.alignLegends();
    }

    function clearInner$1(chart) {
      var legendController = chart.get('legendController');
      legendController.clear();
      chart.set('legendRange', null);
    }
    var legend = {
      init: init$2,
      beforeGeomDraw: beforeGeomDraw,
      afterGeomDraw: afterGeomDraw$2,
      clearInner: clearInner$1
    };

    var Legend = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$2,
        beforeGeomDraw: beforeGeomDraw,
        afterGeomDraw: afterGeomDraw$2,
        clearInner: clearInner$1,
        'default': legend
    });

    var clock = typeof performance === 'object' && performance.now ? performance : Date;

    var Timeline = /*#__PURE__*/function () {
      function Timeline() {
        this.anims = [];
        this.time = null;
        this.playing = false;
        this.canvas = [];
      }

      var _proto = Timeline.prototype;

      _proto.play = function play() {
        var self = this;
        self.time = clock.now();
        self.playing = true;

        function step() {
          if (self.playing) {
            requestAnimationFrame(step);
            self.update();
          }
        }

        requestAnimationFrame(step);
      };

      _proto.stop = function stop() {
        this.playing = false;
        this.time = null;
        this.canvas = [];
      };

      _proto.pushAnim = function pushAnim(animInfo) {
        // 先启动动画
        if (!this.playing) {
          this.play();
        }

        var delay = animInfo.delay,
            duration = animInfo.duration;
        var startTime = this.time + delay;
        var endTime = startTime + duration;
        animInfo.startTime = startTime;
        animInfo.endTime = endTime;
        this.anims.push(animInfo);
      };

      _proto.update = function update() {
        var currentTime = clock.now();
        this.canvas = [];

        if (!this.anims.length) {
          this.stop();
          return;
        }

        for (var i = 0; i < this.anims.length; i++) {
          var propertyAnim = this.anims[i];

          if (currentTime < propertyAnim.startTime || propertyAnim.hasEnded) {
            continue;
          }

          var shape = propertyAnim.shape; // shape

          if (shape.get('destroyed')) {
            this.anims.splice(i, 1);
            i--;
            continue;
          }

          var startState = propertyAnim.startState,
              endState = propertyAnim.endState,
              interpolate = propertyAnim.interpolate,
              duration = propertyAnim.duration;

          if (currentTime >= propertyAnim.startTime && !propertyAnim.hasStarted) {
            propertyAnim.hasStarted = true;

            if (propertyAnim.onStart) {
              propertyAnim.onStart();
            }
          }

          var t = (currentTime - propertyAnim.startTime) / duration;
          t = Math.max(0, Math.min(t, 1));
          t = propertyAnim.easing(t);

          if (propertyAnim.onFrame) {
            propertyAnim.onFrame(t);
          } else {
            for (var key in interpolate) {
              var diff = interpolate[key];
              var value = diff(t);
              var newValue = void 0;

              if (key === 'points') {
                newValue = [];
                var aLen = Math.max(startState.points.length, endState.points.length);

                for (var j = 0; j < aLen; j += 2) {
                  newValue.push({
                    x: value[j],
                    y: value[j + 1]
                  });
                }
              } else {
                newValue = value;
              }

              shape._attrs.attrs[key] = newValue;
              shape._attrs.bbox = null; // should clear calculated bbox
            }
          }

          var canvas = shape.get('canvas');

          if (this.canvas.indexOf(canvas) === -1) {
            this.canvas.push(canvas);
          }

          if (propertyAnim.onUpdate) {
            propertyAnim.onUpdate(t);
          }

          if (currentTime >= propertyAnim.endTime && !propertyAnim.hasEnded) {
            propertyAnim.hasEnded = true;

            if (propertyAnim.onEnd) {
              propertyAnim.onEnd();
            }
          }

          if (t === 1) {
            // end
            this.anims.splice(i, 1);
            i--;
          }
        }

        this.canvas.map(function (c) {
          c.draw();
          return c;
        });
        this.time = clock.now();
      };

      return Timeline;
    }();

    function linear$1(k) {
      return k;
    }

    function quadraticIn(k) {
      return k * k;
    }

    function quadraticOut(k) {
      return k * (2 - k);
    }

    function quadraticInOut(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k;
      }

      return -0.5 * (--k * (k - 2) - 1);
    }

    function cubicIn(k) {
      return k * k * k;
    }

    function cubicOut(k) {
      return --k * k * k + 1;
    }

    function cubicInOut(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
      }

      return 0.5 * ((k -= 2) * k * k + 2);
    }

    function elasticIn(k) {
      var s;
      var a = 0.1;
      var p = 0.4;
      if (k === 0) return 0;
      if (k === 1) return 1;

      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(1 / a);
      }

      return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    }

    function elasticOut(k) {
      var s;
      var a = 0.1;
      var p = 0.4;
      if (k === 0) return 0;
      if (k === 1) return 1;

      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(1 / a);
      }

      return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
    }

    function elasticInOut(k) {
      var s;
      var a = 0.1;
      var p = 0.4;
      if (k === 0) return 0;
      if (k === 1) return 1;

      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(1 / a);
      }

      if ((k *= 2) < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
      }

      return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }

    function backIn(k) {
      var s = 1.70158;
      return k * k * ((s + 1) * k - s);
    }

    function backOut(k) {
      var s = 1.70158;
      return (k = k - 1) * k * ((s + 1) * k + s) + 1;
    }

    function backInOut(k) {
      var s = 1.70158 * 1.525;

      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }

      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }

    function bounceIn(k) {
      return 1 - bounceOut(1 - k);
    }

    function bounceOut(k) {
      if ((k /= 1) < 1 / 2.75) {
        return 7.5625 * k * k;
      } else if (k < 2 / 2.75) {
        return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
      } else if (k < 2.5 / 2.75) {
        return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
      }

      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
    }

    function bounceInOut(k) {
      if (k < 0.5) {
        return bounceIn(k * 2) * 0.5;
      }

      return bounceOut(k * 2 - 1) * 0.5 + 0.5;
    }

    var Easing = /*#__PURE__*/Object.freeze({
        __proto__: null,
        linear: linear$1,
        quadraticIn: quadraticIn,
        quadraticOut: quadraticOut,
        quadraticInOut: quadraticInOut,
        cubicIn: cubicIn,
        cubicOut: cubicOut,
        cubicInOut: cubicInOut,
        elasticIn: elasticIn,
        elasticOut: elasticOut,
        elasticInOut: elasticInOut,
        backIn: backIn,
        backOut: backOut,
        backInOut: backInOut,
        bounceIn: bounceIn,
        bounceOut: bounceOut,
        bounceInOut: bounceInOut
    });

    function plainArray(arr) {
      var result = [];

      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i]) {
          result.push(arr[i].x);
          result.push(arr[i].y);
        }
      }

      return result;
    }

    function interpolateNumber(a, b) {
      a = +a;
      b -= a;
      return function (t) {
        return a + b * t;
      };
    }

    function interpolateArray(a, b) {
      var nb = b ? b.length : 0;
      var na = a ? Math.min(nb, a.length) : 0;
      var x = new Array(na);
      var c = new Array(nb);
      var i;

      for (i = 0; i < na; ++i) {
        x[i] = interpolateNumber(a[i], b[i]);
      }

      for (; i < nb; ++i) {
        c[i] = b[i];
      }

      return function (t) {
        for (i = 0; i < na; ++i) {
          c[i] = x[i](t);
        }

        return c;
      };
    }

    var Animator = /*#__PURE__*/function () {
      function Animator(shape, source, timeline) {
        this.hasStarted = false;
        this.hasEnded = false;
        this.shape = shape;
        this.source = source;
        this.timeline = timeline;
        this.animate = null;
      } // delay, attrs, duration, easing


      var _proto = Animator.prototype;

      _proto.to = function to(cfg) {
        if (cfg === void 0) {
          cfg = {};
        }

        var delay = cfg.delay || 0;
        var attrs = cfg.attrs || {};
        var duration = cfg.duration || 1000;
        var easing; // 缓动函数

        if (typeof cfg.easing === 'function') {
          easing = cfg.easing;
        } else {
          easing = Easing[cfg.easing] || linear$1;
        }

        var animInfo = {
          shape: this.shape,
          delay: delay,
          duration: duration,
          easing: easing
        };
        var interpolate = {}; // 差值函数

        for (var attrName in attrs) {
          var startValue = this.source[attrName];
          var endValue = attrs[attrName];

          if (attrName === 'points') {
            startValue = plainArray(startValue);
            endValue = plainArray(endValue);
            interpolate.points = interpolateArray(startValue, endValue);
            this.source.points = startValue;
            attrs.points = endValue;
          } else if (attrName === 'matrix') {
            interpolate.matrix = interpolateArray(startValue, endValue);
          } else {
            interpolate[attrName] = interpolateNumber(startValue, endValue);
          }
        }

        animInfo.interpolate = interpolate;
        animInfo.startState = this.source;
        animInfo.endState = attrs;
        this.timeline.pushAnim(animInfo);
        this.animate = animInfo;
        return this;
      };

      _proto.onFrame = function onFrame(callback) {
        // 自定义每一帧动画的动作
        if (this.animate) {
          this.animate.onFrame = function (frame) {
            callback(frame);
          };
        }

        return this;
      };

      _proto.onStart = function onStart(callback) {
        if (this.animate) {
          this.animate.onStart = function () {
            callback();
          };
        }

        return this;
      };

      _proto.onUpdate = function onUpdate(callback) {
        if (this.animate) {
          this.animate.onUpdate = function (frame) {
            callback(frame);
          };
        }

        return this;
      };

      _proto.onEnd = function onEnd(callback) {
        if (this.animate) {
          this.animate.onEnd = function () {
            callback();
          };
        }

        return this;
      };

      return Animator;
    }();

    var defaultAnimationCfg = {
      appear: {
        duration: 450,
        easing: 'quadraticOut'
      },
      // 'appear' animation options
      update: {
        duration: 300,
        easing: 'quadraticOut'
      },
      // 'update' animation options
      enter: {
        duration: 300,
        easing: 'quadraticOut'
      },
      // 'enter' animation options
      leave: {
        duration: 350,
        easing: 'quadraticIn'
      } // 'leave' animation options

    };
    var Animate = {
      defaultCfg: {},
      Action: {},
      getAnimation: function getAnimation(geomType, coord, animationType) {
        var geomAnimateCfg = this.defaultCfg[geomType];

        if (geomAnimateCfg) {
          var animation = geomAnimateCfg[animationType];

          if (isFunction(animation)) {
            return animation(coord);
          }
        }

        return false;
      },
      getAnimateCfg: function getAnimateCfg(geomType, animationType) {
        var defaultCfg = defaultAnimationCfg[animationType];
        var geomConfig = this.defaultCfg[geomType];

        if (geomConfig && geomConfig.cfg && geomConfig.cfg[animationType]) {
          return deepMix({}, defaultCfg, geomConfig.cfg[animationType]);
        }

        return defaultCfg;
      },
      registerAnimation: function registerAnimation(animationName, animationFun) {
        var _extends2;

        if (!this.Action) {
          this.Action = {};
        }

        this.Action = _extends({}, this.Action, (_extends2 = {}, _extends2[animationName] = animationFun, _extends2));
      }
    };

    /**
     * Utility
     * @author sima.zhang1990@gmail.com
     */

    function getCoordInfo(coord) {
      var start = coord.start;
      var end = coord.end;
      return {
        start: start,
        end: end,
        width: end.x - start.x,
        height: Math.abs(end.y - start.y)
      };
    }

    function getScaledMatrix(shape, v, direct) {
      var scaledMatrix;
      shape.apply(v);
      var x = v[0];
      var y = v[1];

      if (direct === 'x') {
        shape.transform([['t', x, y], ['s', 0.01, 1], ['t', -x, -y]]);
        var matrix = shape.getMatrix();
        scaledMatrix = Matrix.transform(matrix, [['t', x, y], ['s', 100, 1], ['t', -x, -y]]);
      } else if (direct === 'y') {
        shape.transform([['t', x, y], ['s', 1, 0.01], ['t', -x, -y]]);

        var _matrix = shape.getMatrix();

        scaledMatrix = Matrix.transform(_matrix, [['t', x, y], ['s', 1, 100], ['t', -x, -y]]);
      } else if (direct === 'xy') {
        shape.transform([['t', x, y], ['s', 0.01, 0.01], ['t', -x, -y]]);

        var _matrix2 = shape.getMatrix();

        scaledMatrix = Matrix.transform(_matrix2, [['t', x, y], ['s', 100, 100], ['t', -x, -y]]);
      }

      return scaledMatrix;
    }

    function getAnimateParam(animateCfg, index, id) {
      var result = {};

      if (animateCfg.delay) {
        result.delay = isFunction(animateCfg.delay) ? animateCfg.delay(index, id) : animateCfg.delay;
      }

      result.easing = animateCfg.easing;
      result.duration = animateCfg.duration;
      result.delay = animateCfg.delay;
      return result;
    }

    function doAnimation(shape, endState, animateCfg, callback) {
      var id = shape._id;
      var index = shape.get('index');

      var _getAnimateParam = getAnimateParam(animateCfg, index, id),
          easing = _getAnimateParam.easing,
          delay = _getAnimateParam.delay,
          duration = _getAnimateParam.duration;

      var anim = shape.animate().to({
        attrs: endState,
        duration: duration,
        delay: delay,
        easing: easing
      });

      if (callback) {
        anim.onEnd(function () {
          callback();
        });
      }
    }

    /**
     * Animation functions for shape
     * @author sima.zhang1990@gmail.com
     */
    /*
    function waveIn(shape, animateCfg, coord) {
      const clip = Helpers.getClip(coord);
      clip.set('canvas', shape.get('canvas'));
      shape.attr('clip', clip);
      const onEnd = function() {
        shape.attr('clip', null);
        clip.remove(true);
      };
      Helpers.doAnimation(clip, clip.endState, animateCfg, onEnd);
    }

    function scaleInX(shape, animateCfg) {
      const box = shape.getBBox();
      const points = shape.get('origin').points;
      let x;
      const y = (box.minY + box.maxY) / 2;

      if (points[0].y - points[1].y > 0) { // 当顶点在零点之下
        x = box.maxX;
      } else {
        x = box.minX;
      }
      const scaledMatrix = Helpers.getScaledMatrix(shape, [ x, y ], 'x');
      Helpers.doAnimation(shape, { matrix: scaledMatrix }, animateCfg);
    }

    function scaleInY(shape, animateCfg) {
      const box = shape.getBBox();
      const points = shape.get('origin').points;
      const x = (box.minX + box.maxX) / 2;
      let y;

      if (points[0].y - points[1].y <= 0) { // 当顶点在零点之下
        y = box.maxY;
      } else {
        y = box.minY;
      }
      const scaledMatrix = Helpers.getScaledMatrix(shape, [ x, y ], 'x');
      Helpers.doAnimation(shape, { matrix: scaledMatrix }, animateCfg);
    }
    */

    function fadeIn(shape, animateCfg) {
      var fillOpacity = isNil(shape.attr('fillOpacity')) ? 1 : shape.attr('fillOpacity');
      var strokeOpacity = isNil(shape.attr('strokeOpacity')) ? 1 : shape.attr('strokeOpacity');
      shape.attr('fillOpacity', 0);
      shape.attr('strokeOpacity', 0);
      var endState = {
        fillOpacity: fillOpacity,
        strokeOpacity: strokeOpacity
      };
      doAnimation(shape, endState, animateCfg);
    }

    var ShapeAction = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fadeIn: fadeIn
    });

    /**
     * Group animate functions
     * @author sima.zhang1990@gmail.com
     */

    function _groupScaleIn(container, animateCfg, coord, zeroY, type) {
      var _getCoordInfo = getCoordInfo(coord),
          start = _getCoordInfo.start,
          end = _getCoordInfo.end,
          width = _getCoordInfo.width,
          height = _getCoordInfo.height;

      var x;
      var y;
      var clip = new Shape$2.Rect({
        attrs: {
          x: start.x,
          y: end.y,
          width: width,
          height: height
        }
      });

      if (type === 'y') {
        x = start.x + width / 2;
        y = zeroY.y < start.y ? zeroY.y : start.y;
      } else if (type === 'x') {
        x = zeroY.x > start.x ? zeroY.x : start.x;
        y = start.y + height / 2;
      } else if (type === 'xy') {
        if (coord.isPolar) {
          x = coord.center.x;
          y = coord.center.y;
        } else {
          x = (start.x + end.x) / 2;
          y = (start.y + end.y) / 2;
        }
      }

      var endMatrix = getScaledMatrix(clip, [x, y], type);
      clip.isClip = true;
      clip.endState = {
        matrix: endMatrix
      };
      clip.set('canvas', container.get('canvas'));
      container.attr('clip', clip);

      var onEnd = function onEnd() {
        container.attr('clip', null);
        clip.remove(true);
      };

      doAnimation(clip, clip.endState, animateCfg, onEnd);
    }

    function _shapeScale(container, animateCfg, type) {
      var shapes = container.get('children');
      var x;
      var y;
      var endMatrix;

      for (var i = 0, len = shapes.length; i < len; i++) {
        var shape = shapes[i];
        var box = shape.getBBox();
        x = (box.minX + box.maxX) / 2;
        y = (box.minY + box.maxY) / 2;
        endMatrix = getScaledMatrix(shape, [x, y], type);
        doAnimation(shape, {
          matrix: endMatrix
        }, animateCfg);
      }
    }

    function groupScaleInX(container, animateCfg, coord, zeroY) {
      _groupScaleIn(container, animateCfg, coord, zeroY, 'x');
    }

    function groupScaleInY(container, animateCfg, coord, zeroY) {
      _groupScaleIn(container, animateCfg, coord, zeroY, 'y');
    }

    function groupScaleInXY(container, animateCfg, coord, zeroY) {
      _groupScaleIn(container, animateCfg, coord, zeroY, 'xy');
    }

    function shapesScaleInX(container, animateCfg) {
      _shapeScale(container, animateCfg, 'x');
    }

    function shapesScaleInY(container, animateCfg) {
      _shapeScale(container, animateCfg, 'y');
    }

    function shapesScaleInXY(container, animateCfg) {
      _shapeScale(container, animateCfg, 'xy');
    }

    function groupWaveIn(container, animateCfg, coord) {
      var clip = getClip(coord);
      clip.set('canvas', container.get('canvas'));
      container.attr('clip', clip);

      var onEnd = function onEnd() {
        container.attr('clip', null);
        clip.remove(true);
      };

      var endState = {};

      if (coord.isPolar) {
        var startAngle = coord.startAngle,
            endAngle = coord.endAngle;
        endState.endAngle = endAngle;
        clip.attr('endAngle', startAngle);
      } else {
        var start = coord.start,
            end = coord.end;
        var width = Math.abs(start.x - end.x);
        var height = Math.abs(start.y - end.y);

        if (coord.isTransposed) {
          clip.attr('height', 0);
          endState.height = height;
        } else {
          clip.attr('width', 0);
          endState.width = width;
        }
      }

      doAnimation(clip, endState, animateCfg, onEnd);
    }

    var GroupAction = /*#__PURE__*/Object.freeze({
        __proto__: null,
        groupWaveIn: groupWaveIn,
        groupScaleInX: groupScaleInX,
        groupScaleInY: groupScaleInY,
        groupScaleInXY: groupScaleInXY,
        shapesScaleInX: shapesScaleInX,
        shapesScaleInY: shapesScaleInY,
        shapesScaleInXY: shapesScaleInXY
    });

    /**
     * Handle the detail animations
     * @author sima.zhang1990@gmail.com
     */
    var timeline;

    Element.prototype.animate = function () {
      var attrs = mix({}, this.get('attrs'));
      return new Animator(this, attrs, timeline);
    };

    Chart.prototype.animate = function (cfg) {
      this.set('animate', cfg);
      return this;
    };

    Animate.Action = ShapeAction;
    Animate.defaultCfg = {
      interval: {
        enter: function enter(coord) {
          if (coord.isPolar && coord.transposed) {
            // for pie chart
            return function (shape) {
              shape.set('zIndex', -1);
              var container = shape.get('parent');
              container.sort();
            };
          }

          return fadeIn;
        }
      },
      area: {
        enter: function enter(coord) {
          if (coord.isPolar) return null;
          return fadeIn;
        }
      },
      line: {
        enter: function enter(coord) {
          if (coord.isPolar) return null;
          return fadeIn;
        }
      },
      path: {
        enter: function enter(coord) {
          if (coord.isPolar) return null;
          return fadeIn;
        }
      }
    };
    var GROUP_ANIMATION = {
      line: function line(coord) {
        if (coord.isPolar) {
          return groupScaleInXY;
        }

        return groupWaveIn;
      },
      area: function area(coord) {
        if (coord.isPolar) {
          return groupScaleInXY;
        }

        return groupWaveIn;
      },
      path: function path(coord) {
        if (coord.isPolar) {
          return groupScaleInXY;
        }

        return groupWaveIn;
      },
      point: function point() {
        return shapesScaleInXY;
      },
      interval: function interval(coord) {
        var result;

        if (coord.isPolar) {
          // polar coodinate
          result = groupScaleInXY;

          if (coord.transposed) {
            // pie chart
            result = groupWaveIn;
          }
        } else {
          result = coord.transposed ? groupScaleInX : groupScaleInY;
        }

        return result;
      },
      schema: function schema() {
        return groupWaveIn;
      }
    };

    function diff(fromAttrs, toAttrs) {
      var endState = {};

      for (var k in toAttrs) {
        if (isNumber(fromAttrs[k]) && fromAttrs[k] !== toAttrs[k]) {
          endState[k] = toAttrs[k];
        } else if (isArray(fromAttrs[k]) && JSON.stringify(fromAttrs[k]) !== JSON.stringify(toAttrs[k])) {
          endState[k] = toAttrs[k];
        }
      }

      return endState;
    } // Add a unique id identifier to each shape


    function _getShapeId(geom, dataObj, geomIdx) {
      var type = geom.get('type');
      var id = 'geom' + geomIdx + '-' + type;
      var xScale = geom.getXScale();
      var yScale = geom.getYScale();
      var xField = xScale.field || 'x';
      var yField = yScale.field || 'y';
      var yVal = dataObj[yField];
      var xVal;

      if (xScale.isIdentity) {
        xVal = xScale.value;
      } else {
        xVal = dataObj[xField];
      }

      if (type === 'interval' || type === 'schema') {
        id += '-' + xVal;
      } else if (type === 'line' || type === 'area' || type === 'path') {
        id += '-' + type;
      } else {
        id += xScale.isCategory ? '-' + xVal : '-' + xVal + '-' + yVal;
      }

      var groupScales = geom._getGroupScales();

      each(groupScales, function (groupScale) {
        var field = groupScale.field;

        if (groupScale.type !== 'identity') {
          id += '-' + dataObj[field];
        }
      });
      return id;
    } // get geometry's shapes


    function getShapes(geoms, chart, coord) {
      var shapes = [];
      each(geoms, function (geom, geomIdx) {
        var geomContainer = geom.get('container');
        var geomShapes = geomContainer.get('children');
        var type = geom.get('type');
        var animateCfg = isNil(geom.get('animateCfg')) ? _getAnimateCfgByShapeType(type, chart) : geom.get('animateCfg');

        if (animateCfg !== false) {
          each(geomShapes, function (shape, index) {
            if (shape.get('className') === type) {
              shape._id = _getShapeId(geom, shape.get('origin')._origin, geomIdx);
              shape.set('coord', coord);
              shape.set('animateCfg', animateCfg);
              shape.set('index', index);
              shapes.push(shape);
            }
          });
        }

        geom.set('shapes', geomShapes);
      });
      return shapes;
    }

    function cache(shapes) {
      var rst = {};

      for (var i = 0, len = shapes.length; i < len; i++) {
        var shape = shapes[i];
        if (!shape._id || shape.isClip) continue;
        var id = shape._id;
        rst[id] = {
          _id: id,
          type: shape.get('type'),
          // the type of shape
          attrs: mix({}, shape._attrs.attrs),
          // the graphics attributes of shape
          className: shape.get('className'),
          geomType: shape.get('className'),
          index: shape.get('index'),
          coord: shape.get('coord'),
          animateCfg: shape.get('animateCfg')
        };
      }

      return rst;
    }

    function getAnimate(geomType, coord, animationType, animationName) {
      var result;

      if (isFunction(animationName)) {
        result = animationName;
      } else if (isString(animationName)) {
        result = Animate.Action[animationName];
      } else {
        result = Animate.getAnimation(geomType, coord, animationType);
      }

      return result;
    }

    function getAnimateCfg(geomType, animationType, animateCfg) {
      if (animateCfg === false || isObject(animateCfg) && animateCfg[animationType] === false) {
        return false;
      }

      var defaultCfg = Animate.getAnimateCfg(geomType, animationType);

      if (animateCfg && animateCfg[animationType]) {
        return deepMix({}, defaultCfg, animateCfg[animationType]);
      }

      return defaultCfg;
    }

    function addAnimate(cache, shapes, canvas) {
      var animate;
      var animateCfg; // the order of animation: leave -> update -> enter

      var updateShapes = [];
      var newShapes = [];
      each(shapes, function (shape) {
        var result = cache[shape._id];

        if (!result) {
          newShapes.push(shape);
        } else {
          shape.set('cacheShape', result);
          updateShapes.push(shape);
          delete cache[shape._id];
        }
      }); // first do the leave animation

      each(cache, function (deletedShape) {
        var className = deletedShape.className,
            coord = deletedShape.coord,
            _id = deletedShape._id,
            attrs = deletedShape.attrs,
            index = deletedShape.index,
            type = deletedShape.type;
        animateCfg = getAnimateCfg(className, 'leave', deletedShape.animateCfg);
        if (animateCfg === false) return true;
        animate = getAnimate(className, coord, 'leave', animateCfg.animation);

        if (isFunction(animate)) {
          var tempShape = canvas.addShape(type, {
            attrs: attrs,
            index: index,
            canvas: canvas,
            className: className
          });
          tempShape._id = _id;
          animate(tempShape, animateCfg, coord);
        }
      }); // then do the update animation

      each(updateShapes, function (updateShape) {
        var className = updateShape.get('className');
        animateCfg = getAnimateCfg(className, 'update', updateShape.get('animateCfg'));
        if (animateCfg === false) return true;
        var coord = updateShape.get('coord');
        var cacheAttrs = updateShape.get('cacheShape').attrs;
        var endState = diff(cacheAttrs, updateShape._attrs.attrs); // 判断如果属性相同的话就不进行变换

        if (Object.keys(endState).length) {
          animate = getAnimate(className, coord, 'update', animateCfg.animation);

          if (isFunction(animate)) {
            animate(updateShape, animateCfg, coord);
          } else {
            var startState = {};
            each(endState, function (value, key) {
              startState[key] = cacheAttrs[key];
            });
            updateShape.attr(startState);
            updateShape.animate().to({
              attrs: endState,
              duration: animateCfg.duration,
              easing: animateCfg.easing,
              delay: animateCfg.delay
            }).onEnd(function () {
              updateShape.set('cacheShape', null);
            });
          }
        }
      }); // last, enter animation

      each(newShapes, function (newShape) {
        // 新图形元素的进场元素
        var className = newShape.get('className');
        var coord = newShape.get('coord');
        animateCfg = getAnimateCfg(className, 'enter', newShape.get('animateCfg'));
        if (animateCfg === false) return true;
        animate = getAnimate(className, coord, 'enter', animateCfg.animation);

        if (isFunction(animate)) {
          if (className === 'interval' && coord.isPolar && coord.transposed) {
            var index = newShape.get('index');
            var lastShape = updateShapes[index - 1];
            animate(newShape, animateCfg, lastShape);
          } else {
            animate(newShape, animateCfg, coord);
          }
        }
      });
    }

    function _getAnimateCfgByShapeType(type, chart) {
      if (!type) {
        return null;
      }

      var animateCfg = chart.get('animate');

      if (type.indexOf('guide-tag') > -1) {
        type = 'guide-tag';
      }

      if (isObject(animateCfg)) {
        return animateCfg[type];
      }

      if (animateCfg === false) {
        return false;
      }

      return null;
    }

    function afterCanvasInit()
    /* chart */
    {
      timeline = new Timeline();
      timeline.play();
    }

    function beforeCanvasDraw(chart) {
      if (chart.get('animate') === false) {
        return;
      }

      var isUpdate = chart.get('isUpdate');
      var canvas = chart.get('canvas');
      var coord = chart.get('coord');
      var geoms = chart.get('geoms');
      var caches = canvas.get('caches') || [];

      if (caches.length === 0) {
        isUpdate = false;
      }

      var cacheShapes = getShapes(geoms, chart, coord);

      var _chart$get = chart.get('axisController'),
          frontPlot = _chart$get.frontPlot,
          backPlot = _chart$get.backPlot;

      var axisShapes = frontPlot.get('children').concat(backPlot.get('children'));
      var guideShapes = [];

      if (chart.get('guideController')) {
        guideShapes = chart.get('guideController').guideShapes;
      }

      var componentShapes = [];
      axisShapes.concat(guideShapes).forEach(function (s) {
        var className = s.get('className');

        var animateCfg = _getAnimateCfgByShapeType(className, chart);

        s.set('coord', coord);
        s.set('animateCfg', animateCfg);
        componentShapes.push(s);
        cacheShapes.push(s);
      });
      canvas.set('caches', cache(cacheShapes));

      if (isUpdate) {
        addAnimate(caches, cacheShapes, canvas);
      } else {
        // do the appear animation
        var animateCfg;
        var animate;
        each(geoms, function (geom) {
          var type = geom.get('type');
          var geomCfg = isNil(geom.get('animateCfg')) ? _getAnimateCfgByShapeType(type, chart) : geom.get('animateCfg');

          if (geomCfg !== false) {
            animateCfg = getAnimateCfg(type, 'appear', geomCfg);
            animate = getAnimate(type, coord, 'appear', animateCfg.animation);

            if (isFunction(animate)) {
              var shapes = geom.get('shapes');
              each(shapes, function (shape) {
                animate(shape, animateCfg, coord);
              });
            } else if (GROUP_ANIMATION[type]) {
              // do the default animation
              animate = GroupAction[animateCfg.animation] || GROUP_ANIMATION[type](coord);
              var yScale = geom.getYScale();
              var zeroY = coord.convertPoint({
                x: 0,
                y: yScale.scale(geom.getYMinValue())
              });
              var container = geom.get('container');
              animate && animate(container, animateCfg, coord, zeroY);
            }
          }
        }); // do the animation of components

        each(componentShapes, function (shape) {
          var animateCfg = shape.get('animateCfg');
          var className = shape.get('className');

          if (animateCfg && animateCfg.appear) {
            // if user configure
            var defaultCfg = Animate.getAnimateCfg(className, 'appear');
            var appearCfg = deepMix({}, defaultCfg, animateCfg.appear);

            var _animate = getAnimate(className, coord, 'appear', appearCfg.animation);

            if (isFunction(_animate)) {
              _animate(shape, appearCfg, coord);
            }
          }
        });
      }
    }

    function afterCanvasDestroyed()
    /* chart */
    {
      timeline.stop();
    }
    var detail = {
      afterCanvasInit: afterCanvasInit,
      beforeCanvasDraw: beforeCanvasDraw,
      afterCanvasDestroyed: afterCanvasDestroyed
    };

    var Animation = /*#__PURE__*/Object.freeze({
        __proto__: null,
        afterCanvasInit: afterCanvasInit,
        beforeCanvasDraw: beforeCanvasDraw,
        afterCanvasDestroyed: afterCanvasDestroyed,
        'default': detail
    });

    function getScale(chart, field) {
      var scales = chart.get('scales');
      return scales[field];
    }

    function getFieldRange(scale, limitRange, type) {
      if (!scale) return [0, 1];
      var minRatio = 0;
      var maxRatio = 0;

      if (type === 'linear') {
        var min = limitRange.min,
            max = limitRange.max;
        minRatio = (scale.min - min) / (max - min);
        maxRatio = (scale.max - min) / (max - min);
      } else {
        var originValues = limitRange;
        var values = scale.values || [];
        var firstIndex = originValues.indexOf(values[0]);
        var lastIndex = originValues.indexOf(values[values.length - 1]);
        minRatio = firstIndex / (originValues.length - 1);
        maxRatio = lastIndex / (originValues.length - 1);
      }

      return [minRatio, maxRatio];
    }

    function getLimitRange(data, scale) {
      var result;
      var field = scale.field,
          type = scale.type;
      var values$1 = values(data, field);

      if (type === 'linear') {
        result = getRange$1(values$1);

        if (scale.min < result.min) {
          result.min = scale.min;
        }

        if (scale.max > result.max) {
          result.max = scale.max;
        }
      } else if (type === 'timeCat') {
        each(values$1, function (v, i) {
          values$1[i] = toTimeStamp(v);
        });
        values$1.sort(function (v1, v2) {
          return v1 - v2;
        });
        result = values$1;
      } else {
        result = values$1;
      }

      return result;
    }

    var DEFAULT_CFG$1 = {
      mode: 'x',
      xStyle: {
        backgroundColor: 'rgba(202, 215, 239, .2)',
        fillerColor: 'rgba(202, 215, 239, .5)',
        size: 4,
        lineCap: 'round',
        offsetX: 0,
        offsetY: 8
      },
      yStyle: {
        backgroundColor: 'rgba(202, 215, 239, .2)',
        fillerColor: 'rgba(202, 215, 239, .5)',
        size: 4,
        lineCap: 'round',
        offsetX: 8,
        offsetY: 0
      }
    };

    function init$3(chart) {
      chart.set('_limitRange', {});

      chart.scrollBar = function (cfg) {
        if (cfg === true) {
          cfg = DEFAULT_CFG$1;
        } else if (isObject(cfg)) {
          cfg = deepMix({}, DEFAULT_CFG$1, cfg);
        }

        this.set('_scrollBarCfg', cfg);
      };
    }

    function clear$1(chart) {
      chart.set('_limitRange', {});
    }

    function changeData(chart) {
      chart.set('_limitRange', {});
    }

    function clearInner$2(chart) {
      var hBar = chart.get('_horizontalBar');
      var vBar = chart.get('_verticalBar');
      hBar && hBar.remove(true);
      vBar && vBar.remove(true);
      chart.set('_horizontalBar', null);
      chart.set('_verticalBar', null);
    }

    function afterGeomDraw$3(chart) {
      var scrollBarCfg = chart.get('_scrollBarCfg');
      if (!scrollBarCfg) return;
      var data = chart.get('data');
      var plotRange = chart.get('plotRange');
      var backPlot = chart.get('backPlot');
      var canvas = chart.get('canvas');
      var canvasHeight = canvas.get('height');
      var limitRange = chart.get('_limitRange');
      var mode = scrollBarCfg.mode;

      if (directionEnabled(mode, 'x')) {
        var _scrollBarCfg$xStyle = scrollBarCfg.xStyle,
            offsetX = _scrollBarCfg$xStyle.offsetX,
            offsetY = _scrollBarCfg$xStyle.offsetY,
            lineCap = _scrollBarCfg$xStyle.lineCap,
            backgroundColor = _scrollBarCfg$xStyle.backgroundColor,
            fillerColor = _scrollBarCfg$xStyle.fillerColor,
            size = _scrollBarCfg$xStyle.size;
        var xScale = chart.getXScale();
        var xLimitRange = limitRange[xScale.field];

        if (!xLimitRange) {
          xLimitRange = getLimitRange(data, xScale);
          limitRange[xScale.field] = xLimitRange;
        }

        var currentRange = getFieldRange(xScale, xLimitRange, xScale.type);
        var horizontalBar = chart.get('_horizontalBar');
        var yPos = canvasHeight - size / 2 + offsetY;

        if (horizontalBar) {
          var progressLine = horizontalBar.get('children')[1];
          progressLine.attr({
            x1: Math.max(plotRange.bl.x + plotRange.width * currentRange[0] + offsetX, plotRange.bl.x),
            x2: Math.min(plotRange.bl.x + plotRange.width * currentRange[1] + offsetX, plotRange.br.x)
          });
        } else {
          horizontalBar = backPlot.addGroup({
            className: 'horizontalBar'
          });
          horizontalBar.addShape('line', {
            attrs: {
              x1: plotRange.bl.x + offsetX,
              y1: yPos,
              x2: plotRange.br.x + offsetX,
              y2: yPos,
              lineWidth: size,
              stroke: backgroundColor,
              lineCap: lineCap
            }
          });
          horizontalBar.addShape('line', {
            attrs: {
              x1: Math.max(plotRange.bl.x + plotRange.width * currentRange[0] + offsetX, plotRange.bl.x),
              y1: yPos,
              x2: Math.min(plotRange.bl.x + plotRange.width * currentRange[1] + offsetX, plotRange.br.x),
              y2: yPos,
              lineWidth: size,
              stroke: fillerColor,
              lineCap: lineCap
            }
          });
          chart.set('_horizontalBar', horizontalBar);
        }
      }

      if (directionEnabled(mode, 'y')) {
        var _scrollBarCfg$yStyle = scrollBarCfg.yStyle,
            _offsetX = _scrollBarCfg$yStyle.offsetX,
            _offsetY = _scrollBarCfg$yStyle.offsetY,
            _lineCap = _scrollBarCfg$yStyle.lineCap,
            _backgroundColor = _scrollBarCfg$yStyle.backgroundColor,
            _fillerColor = _scrollBarCfg$yStyle.fillerColor,
            _size = _scrollBarCfg$yStyle.size;
        var yScale = chart.getYScales()[0];
        var yLimitRange = limitRange[yScale.field];

        if (!yLimitRange) {
          yLimitRange = getLimitRange(data, yScale);
          limitRange[yScale.field] = yLimitRange;
        }

        var _currentRange = getFieldRange(yScale, yLimitRange, yScale.type);

        var verticalBar = chart.get('_verticalBar');
        var xPos = _size / 2 + _offsetX;

        if (verticalBar) {
          var _progressLine = verticalBar.get('children')[1];

          _progressLine.attr({
            y1: Math.max(plotRange.tl.y + plotRange.height * _currentRange[0] + _offsetY, plotRange.tl.y),
            y2: Math.min(plotRange.tl.y + plotRange.height * _currentRange[1] + _offsetY, plotRange.bl.y)
          });
        } else {
          verticalBar = backPlot.addGroup({
            className: 'verticalBar'
          });
          verticalBar.addShape('line', {
            attrs: {
              x1: xPos,
              y1: plotRange.tl.y + _offsetY,
              x2: xPos,
              y2: plotRange.bl.y + _offsetY,
              lineWidth: _size,
              stroke: _backgroundColor,
              lineCap: _lineCap
            }
          });
          verticalBar.addShape('line', {
            attrs: {
              x1: xPos,
              y1: Math.max(plotRange.tl.y + plotRange.height * _currentRange[0] + _offsetY, plotRange.tl.y),
              x2: xPos,
              y2: Math.min(plotRange.tl.y + plotRange.height * _currentRange[1] + _offsetY, plotRange.bl.y),
              lineWidth: _size,
              stroke: _fillerColor,
              lineCap: _lineCap
            }
          });
          chart.set('_verticalBar', verticalBar);
        }
      }
    }
    var scrollBar = {
      init: init$3,
      clear: clear$1,
      changeData: changeData,
      clearInner: clearInner$2,
      afterGeomDraw: afterGeomDraw$3
    };

    var ScrollBar = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$3,
        clear: clear$1,
        changeData: changeData,
        clearInner: clearInner$2,
        afterGeomDraw: afterGeomDraw$3,
        'default': scrollBar
    });

    var DEFAULT_CFG$2 = {
      anchorOffset: 5,
      // 锚点的偏移量
      inflectionOffset: 15,
      // 拐点的偏移量
      sidePadding: 20,
      // 文本距离画布四边的距离
      lineHeight: 32,
      // 文本的行高
      adjustOffset: 15,
      // 发生调整时的偏移量
      skipOverlapLabels: false,
      // 是否不展示重叠的文本
      triggerOn: 'touchstart',
      // 点击行为触发的时间类型
      activeShape: false,
      // 当有图形被选中的时候，是否激活图形
      activeStyle: {
        offset: 1,
        appendRadius: 8,
        fillOpacity: 0.5
      },
      label1OffsetY: -1,
      label2OffsetY: 1
    };

    function getEndPoint(center, angle, r) {
      return {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle)
      };
    } // 计算中间角度


    function getMiddleAngle(startAngle, endAngle) {
      if (endAngle < startAngle) {
        endAngle += Math.PI * 2;
      }

      return (endAngle + startAngle) / 2;
    } // 判断两个矩形是否相交


    function isOverlap(label1, label2) {
      var label1BBox = label1.getBBox();
      var label2BBox = label2.getBBox();
      return Math.max(label1BBox.minX, label2BBox.minX) <= Math.min(label1BBox.maxX, label2BBox.maxX) && Math.max(label1BBox.minY, label2BBox.minY) <= Math.min(label1BBox.maxY, label2BBox.maxY);
    }

    var controller = /*#__PURE__*/function () {
      function controller(cfg) {
        var _this = this;

        _defineProperty(this, "_handleEvent", function (ev) {
          var self = _this;
          var chart = self.chart,
              drawnLabels = self.drawnLabels,
              pieLabelCfg = self.pieLabelCfg;
          var onClick = pieLabelCfg.onClick,
              activeShape = pieLabelCfg.activeShape;
          var canvasEvent = createEvent(ev, chart);
          var x = canvasEvent.x,
              y = canvasEvent.y; // 查找被点击的 label

          var clickedShape;

          for (var i = 0, len = drawnLabels.length; i < len; i++) {
            var shape = drawnLabels[i];
            var bbox = shape.getBBox(); // 通过最小包围盒来判断击中情况

            if (x >= bbox.minX && x <= bbox.maxX && y >= bbox.minY && y <= bbox.maxY) {
              clickedShape = shape;
              break;
            }
          }

          var pieData = chart.getSnapRecords({
            x: x,
            y: y
          });

          if (clickedShape) {
            canvasEvent.data = clickedShape.get('data');
          } else if (pieData.length) {
            // 击中饼图扇形区域
            canvasEvent.data = pieData[0]._origin;
          }

          onClick && onClick(canvasEvent);
          canvasEvent.data && activeShape && _this._activeShape(canvasEvent.data);
        });

        mix(this, cfg);
        var _chart = this.chart;
        this.canvasDom = _chart.get('canvas').get('el');
      }

      var _proto = controller.prototype;

      _proto.renderLabels = function renderLabels() {
        var self = this;
        var chart = self.chart,
            pieLabelCfg = self.pieLabelCfg,
            labelGroup = self.labelGroup;
        var halves = [[], // left
        [] // right
        ]; // 存储左右 labels

        var geom = chart.get('geoms')[0];
        var shapes = geom.get('container').get('children');
        var anchorOffset = pieLabelCfg.anchorOffset,
            inflectionOffset = pieLabelCfg.inflectionOffset,
            label1 = pieLabelCfg.label1,
            label2 = pieLabelCfg.label2,
            lineHeight = pieLabelCfg.lineHeight,
            skipOverlapLabels = pieLabelCfg.skipOverlapLabels,
            label1OffsetY = pieLabelCfg.label1OffsetY,
            label2OffsetY = pieLabelCfg.label2OffsetY;
        var coord = chart.get('coord');
        var center = coord.center,
            radius = coord.circleRadius;
        shapes.forEach(function (shape) {
          var _shape$_attrs$attrs = shape._attrs.attrs,
              startAngle = _shape$_attrs$attrs.startAngle,
              endAngle = _shape$_attrs$attrs.endAngle;
          var middleAngle = getMiddleAngle(startAngle, endAngle);
          var anchorPoint = getEndPoint(center, middleAngle, radius + anchorOffset);
          var inflectionPoint = getEndPoint(center, middleAngle, radius + inflectionOffset);
          var origin = shape.get('origin');
          var _origin = origin._origin,
              color = origin.color;
          var label = {
            _anchor: anchorPoint,
            _inflection: inflectionPoint,
            _data: _origin,
            x: inflectionPoint.x,
            y: inflectionPoint.y,
            r: radius + inflectionOffset,
            fill: color
          };
          var textGroup = new Group({
            context: chart.get('canvas').get('context'),
            // 兼容 node、小程序环境
            data: _origin // 存储原始数据

          });
          var textAttrs = {
            x: 0,
            y: 0,
            fontSize: 12,
            lineHeight: 12,
            fill: '#808080'
          };

          if (isFunction(label1)) {
            textGroup.addShape('Text', {
              attrs: mix({
                textBaseline: 'bottom'
              }, textAttrs, label1(_origin, color)),
              data: _origin,
              // 存储原始数据
              offsetY: label1OffsetY
            });
          }

          if (isFunction(label2)) {
            textGroup.addShape('Text', {
              attrs: mix({
                textBaseline: 'top'
              }, textAttrs, label2(_origin, color)),
              data: _origin,
              // 存储原始数据
              offsetY: label2OffsetY
            });
          }

          label.textGroup = textGroup; // 判断文本的方向

          if (anchorPoint.x < center.x) {
            label._side = 'left';
            halves[0].push(label);
          } else {
            label._side = 'right';
            halves[1].push(label);
          }
        });
        var drawnLabels = [];

        if (skipOverlapLabels) {
          var lastLabel; // 存储上一个 label 对象，用于检测文本是否重叠

          var labels = halves[1].concat(halves[0]); // 顺时针

          for (var i = 0, len = labels.length; i < len; i++) {
            var label = labels[i];

            var textGroup = self._drawLabel(label);

            if (lastLabel) {
              if (isOverlap(textGroup, lastLabel)) {
                // 重叠了就不绘制
                continue;
              }
            }

            labelGroup.add(textGroup);

            self._drawLabelLine(label);

            lastLabel = textGroup;
            drawnLabels.push(textGroup);
          }
        } else {
          var height = chart.get('height');
          var maxCountForOneSide = parseInt(height / lineHeight, 10);
          halves.forEach(function (half) {
            if (half.length > maxCountForOneSide) {
              half.splice(maxCountForOneSide, half.length - maxCountForOneSide);
            }

            half.sort(function (a, b) {
              return a.y - b.y;
            });

            var labels = self._antiCollision(half);

            drawnLabels = drawnLabels.concat(labels);
          });
        }

        this.drawnLabels = drawnLabels;
      };

      _proto.bindEvents = function bindEvents() {
        var pieLabelCfg = this.pieLabelCfg;
        var triggerOn = pieLabelCfg.triggerOn || 'touchstart';
        addEventListener(this.canvasDom, triggerOn, this._handleEvent);
      };

      _proto.unBindEvents = function unBindEvents() {
        var pieLabelCfg = this.pieLabelCfg;
        var triggerOn = pieLabelCfg.triggerOn || 'touchstart';
        removeEventListener(this.canvasDom, triggerOn, this._handleEvent);
      };

      _proto.clear = function clear() {
        this.labelGroup && this.labelGroup.clear();
        this.halo && this.halo.remove(true);
        this.lastSelectedData = null;
        this.drawnLabels = [];
        this.unBindEvents();
      };

      _proto._drawLabel = function _drawLabel(label) {
        var pieLabelCfg = this.pieLabelCfg,
            chart = this.chart;
        var canvasWidth = chart.get('width');
        var sidePadding = pieLabelCfg.sidePadding;
        var y = label.y,
            textGroup = label.textGroup;
        var children = textGroup.get('children');
        var textAttrs = {
          textAlign: label._side === 'left' ? 'left' : 'right',
          x: label._side === 'left' ? sidePadding : canvasWidth - sidePadding
        };
        children.forEach(function (child) {
          child.attr(textAttrs);
          child.attr('y', y + child.get('offsetY'));
        });
        return textGroup;
      };

      _proto._drawLabelLine = function _drawLabelLine(label, maxLabelWidth) {
        var chart = this.chart,
            pieLabelCfg = this.pieLabelCfg,
            labelGroup = this.labelGroup;
        var canvasWidth = chart.get('width');
        var sidePadding = pieLabelCfg.sidePadding,
            adjustOffset = pieLabelCfg.adjustOffset,
            lineStyle = pieLabelCfg.lineStyle,
            anchorStyle = pieLabelCfg.anchorStyle,
            skipOverlapLabels = pieLabelCfg.skipOverlapLabels;
        var _anchor = label._anchor,
            _inflection = label._inflection,
            fill = label.fill,
            y = label.y;
        var lastPoint = {
          x: label._side === 'left' ? sidePadding : canvasWidth - sidePadding,
          y: y
        };
        var points = [_anchor, _inflection, lastPoint];

        if (!skipOverlapLabels && _inflection.y !== y) {
          // 展示全部文本文本位置做过调整
          if (_inflection.y < y) {
            // 文本被调整下去了，则添加拐点连接线
            var point1 = _inflection;
            var point2 = {
              x: label._side === 'left' ? lastPoint.x + maxLabelWidth + adjustOffset : lastPoint.x - maxLabelWidth - adjustOffset,
              y: _inflection.y
            };
            var point3 = {
              x: label._side === 'left' ? lastPoint.x + maxLabelWidth : lastPoint.x - maxLabelWidth,
              y: lastPoint.y
            };
            points = [_anchor, point1, point2, point3, lastPoint];

            if (label._side === 'right' && point2.x < point1.x || label._side === 'left' && point2.x > point1.x) {
              points = [_anchor, point3, lastPoint];
            }
          } else {
            points = [_anchor, {
              x: _inflection.x,
              y: y
            }, lastPoint];
          }
        }

        labelGroup.addShape('Polyline', {
          attrs: mix({
            points: points,
            lineWidth: 1,
            stroke: fill
          }, lineStyle)
        }); // 绘制锚点

        labelGroup.addShape('Circle', {
          attrs: mix({
            x: _anchor.x,
            y: _anchor.y,
            r: 2,
            fill: fill
          }, anchorStyle)
        });
      };

      _proto._antiCollision = function _antiCollision(half) {
        var self = this;
        var chart = self.chart,
            pieLabelCfg = self.pieLabelCfg;
        var coord = chart.get('coord');
        var canvasHeight = chart.get('height');
        var center = coord.center,
            r = coord.circleRadius;
        var inflectionOffset = pieLabelCfg.inflectionOffset,
            lineHeight = pieLabelCfg.lineHeight;
        var startY = center.y - r - inflectionOffset - lineHeight;
        var overlapping = true;
        var totalH = canvasHeight;
        var i;
        var maxY = 0;
        var minY = Number.MIN_VALUE;
        var maxLabelWidth = 0;
        var boxes = half.map(function (label) {
          var labelY = label.y;

          if (labelY > maxY) {
            maxY = labelY;
          }

          if (labelY < minY) {
            minY = labelY;
          }

          var textGroup = label.textGroup;
          var labelWidth = textGroup.getBBox().width;

          if (labelWidth >= maxLabelWidth) {
            maxLabelWidth = labelWidth;
          }

          return {
            size: lineHeight,
            targets: [labelY - startY]
          };
        });

        if (maxY - startY > totalH) {
          totalH = maxY - startY;
        }

        var iteratorBoxed = function iteratorBoxed(boxes) {
          boxes.forEach(function (box) {
            var target = (Math.min.apply(minY, box.targets) + Math.max.apply(minY, box.targets)) / 2;
            box.pos = Math.min(Math.max(minY, target - box.size / 2), totalH - box.size);
          });
        };

        while (overlapping) {
          iteratorBoxed(boxes); // detect overlapping and join boxes

          overlapping = false;
          i = boxes.length;

          while (i--) {
            if (i > 0) {
              var previousBox = boxes[i - 1];
              var box = boxes[i];

              if (previousBox.pos + previousBox.size > box.pos) {
                // overlapping
                previousBox.size += box.size;
                previousBox.targets = previousBox.targets.concat(box.targets); // overflow, shift up

                if (previousBox.pos + previousBox.size > totalH) {
                  previousBox.pos = totalH - previousBox.size;
                }

                boxes.splice(i, 1); // removing box

                overlapping = true;
              }
            }
          }
        }

        i = 0;
        boxes.forEach(function (b) {
          var posInCompositeBox = startY; // middle of the label

          b.targets.forEach(function () {
            half[i].y = b.pos + posInCompositeBox + lineHeight / 2;
            posInCompositeBox += lineHeight;
            i++;
          });
        });
        var drawnLabels = [];
        half.forEach(function (label) {
          var textGroup = self._drawLabel(label);

          var labelGroup = self.labelGroup;
          labelGroup.add(textGroup);

          self._drawLabelLine(label, maxLabelWidth);

          drawnLabels.push(textGroup);
        });
        return drawnLabels;
      };

      _proto._getSelectedShapeByData = function _getSelectedShapeByData(data) {
        var selectedShape = null;
        var chart = this.chart;
        var geom = chart.get('geoms')[0];
        var container = geom.get('container');
        var children = container.get('children');
        each(children, function (child) {
          if (child.get('isShape') && child.get('className') === geom.get('type')) {
            // get geometry's shape
            var shapeData = child.get('origin')._origin;

            if (isObjectValueEqual(shapeData, data)) {
              selectedShape = child;
              return false;
            }
          }
        });
        return selectedShape;
      };

      _proto._activeShape = function _activeShape(data) {
        var chart = this.chart,
            lastSelectedData = this.lastSelectedData,
            pieLabelCfg = this.pieLabelCfg;

        if (data === lastSelectedData) {
          return;
        }

        this.lastSelectedData = data;
        var activeStyle = pieLabelCfg.activeStyle;

        var selectedShape = this._getSelectedShapeByData(data);

        var _selectedShape$_attrs = selectedShape._attrs.attrs,
            x = _selectedShape$_attrs.x,
            y = _selectedShape$_attrs.y,
            startAngle = _selectedShape$_attrs.startAngle,
            endAngle = _selectedShape$_attrs.endAngle,
            r = _selectedShape$_attrs.r,
            fill = _selectedShape$_attrs.fill;
        var frontPlot = chart.get('frontPlot');
        this.halo && this.halo.remove(true);
        var halo = frontPlot.addShape('sector', {
          attrs: mix({
            x: x,
            y: y,
            r: r + activeStyle.offset + activeStyle.appendRadius,
            r0: r + activeStyle.offset,
            fill: fill,
            startAngle: startAngle,
            endAngle: endAngle
          }, activeStyle)
        });
        this.halo = halo;
        chart.get('canvas').draw();
      };

      return controller;
    }();

    function init$4(chart) {
      var frontPlot = chart.get('frontPlot');
      var labelGroup = frontPlot.addGroup({
        className: 'pie-label',
        zIndex: 0
      });
      var pieLabelController = new controller({
        chart: chart,
        labelGroup: labelGroup
      });
      chart.set('pieLabelController', pieLabelController);

      chart.pieLabel = function (cfg) {
        cfg = deepMix({}, DEFAULT_CFG$2, cfg);
        pieLabelController.pieLabelCfg = cfg;
        return this;
      };
    }

    function afterGeomDraw$4(chart) {
      var controller = chart.get('pieLabelController');

      if (controller.pieLabelCfg) {
        // 用户配置了饼图文本
        controller.renderLabels();
        controller.bindEvents(); // 绑定事件
      }
    }

    function clearInner$3(chart) {
      var controller = chart.get('pieLabelController');

      if (controller.pieLabelCfg) {
        // 用户配置了饼图文本
        controller.clear();
      }
    }
    var pieLabel = {
      init: init$4,
      afterGeomDraw: afterGeomDraw$4,
      clearInner: clearInner$3
    };

    var PieLabel = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$4,
        afterGeomDraw: afterGeomDraw$4,
        clearInner: clearInner$3,
        'default': pieLabel
    });

    var DEFAULT_CFG$3 = {
      label: null,
      offsetX: 0,
      offsetY: 0
    };
    var DEFAULT_LABEL_CFG = {
      textBaseline: 'middle',
      fill: '#808080'
    }; // 2个点的中心点

    function getMiddlePoint$1(a, b) {
      var x = (a.x - b.x) / 2 + b.x;
      var y = (a.y - b.y) / 2 + b.y;
      return {
        x: x,
        y: y
      };
    } // function getLabelPoint(points, nextPoints) {
    //   let start;
    //   if (nextPoints && nextPoints.length) {
    //     start = getMiddlePoint(points[1], nextPoints[1]);
    //   } else {
    //     const nextPoint = getMiddlePoint(points[2], points[3]);
    //     start = getMiddlePoint(points[1], nextPoint);
    //   }
    //   const end = getMiddlePoint(points[1], points[2]);
    //   return { start, end };
    // }


    var Controller = /*#__PURE__*/function () {
      function Controller(_ref) {
        var chart = _ref.chart,
            container = _ref.container;
        this.cfg = null;
        this.chart = chart;
        this.container = container;
      }

      var _proto = Controller.prototype;

      _proto.draw = function draw() {
        var chart = this.chart,
            container = this.container,
            cfg = this.cfg;
        if (!cfg) return;
        var labelCfg = mix({}, DEFAULT_CFG$3, cfg);
        var geom = chart.get('geoms')[0];
        var shapes = geom.get('container').get('children');
        shapes.forEach(function (shape) {
          var origin = shape.get('origin');
          var attrs = shape.get('attrs');
          var _origin = origin._origin,
              color = origin.color;
          var points = attrs.points;

          if (labelCfg.label) {
            var labelAttrs = labelCfg.label(_origin, color);
            var point = getMiddlePoint$1(points[1], points[2]);
            container.addShape('Text', {
              attrs: mix({
                x: point.x + labelCfg.offsetX,
                y: point.y + labelCfg.offsetY
              }, DEFAULT_LABEL_CFG, labelAttrs)
            });
          }

          if (labelCfg.guide) {
            var _labelAttrs = labelCfg.guide(_origin, color);

            var _point = getMiddlePoint$1(getMiddlePoint$1(points[0], points[1]), getMiddlePoint$1(points[2], points[3] || points[2]));

            container.addShape('Text', {
              attrs: mix({
                x: _point.x,
                y: _point.y,
                textBaseline: 'middle',
                textAlign: 'center'
              }, DEFAULT_LABEL_CFG, _labelAttrs)
            });
          }
        });
      };

      _proto.clear = function clear() {
        var container = this.container;
        container.clear();
      };

      return Controller;
    }();

    function init$5(chart) {
      var frontPlot = chart.get('frontPlot');
      var labelGroup = frontPlot.addGroup({
        className: 'label',
        zIndex: 0
      });
      var labelController = new Controller({
        chart: chart,
        container: labelGroup
      });
      chart.set('intervalLabelController', labelController);

      chart.intervalLabel = function (cfg) {
        labelController.cfg = cfg;
      };
    }

    function afterGeomDraw$5(chart) {
      var labelController = chart.get('intervalLabelController');
      labelController.draw();
    }

    function clearInner$4(chart) {
      var labelController = chart.get('intervalLabelController');
      labelController.clear();
    }
    var intervalLabel = {
      init: init$5,
      afterGeomDraw: afterGeomDraw$5,
      clearInner: clearInner$4
    };

    var intervalLabel$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init$5,
        afterGeomDraw: afterGeomDraw$5,
        clearInner: clearInner$4,
        'default': intervalLabel
    });

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    // #ifdef H5 
  var hammer = createCommonjsModule(function (module) {
      /*! Hammer.JS - v2.0.7 - 2016-04-22
       * http://hammerjs.github.io/
       *
       * Copyright (c) 2016 Jorik Tangelder;
       * Licensed under the MIT license */
      (function (window, document, exportName, undefined$1) {

        var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
        var TEST_ELEMENT = document.createElement('div');
        var TYPE_FUNCTION = 'function';
        var round = Math.round;
        var abs = Math.abs;
        var now = Date.now;
        /**
         * set a timeout with a given scope
         * @param {Function} fn
         * @param {Number} timeout
         * @param {Object} context
         * @returns {number}
         */

        function setTimeoutContext(fn, timeout, context) {
          return setTimeout(bindFn(fn, context), timeout);
        }
        /**
         * if the argument is an array, we want to execute the fn on each entry
         * if it aint an array we don't want to do a thing.
         * this is used by all the methods that accept a single and array argument.
         * @param {*|Array} arg
         * @param {String} fn
         * @param {Object} [context]
         * @returns {Boolean}
         */


        function invokeArrayArg(arg, fn, context) {
          if (Array.isArray(arg)) {
            each(arg, context[fn], context);
            return true;
          }

          return false;
        }
        /**
         * walk objects and arrays
         * @param {Object} obj
         * @param {Function} iterator
         * @param {Object} context
         */


        function each(obj, iterator, context) {
          var i;

          if (!obj) {
            return;
          }

          if (obj.forEach) {
            obj.forEach(iterator, context);
          } else if (obj.length !== undefined$1) {
            i = 0;

            while (i < obj.length) {
              iterator.call(context, obj[i], i, obj);
              i++;
            }
          } else {
            for (i in obj) {
              obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
          }
        }
        /**
         * wrap a method with a deprecation warning and stack trace
         * @param {Function} method
         * @param {String} name
         * @param {String} message
         * @returns {Function} A new function wrapping the supplied method.
         */


        function deprecate(method, name, message) {
          var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
          return function () {
            var e = new Error('get-stack-trace');
            var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';
            var log = window.console && (window.console.warn || window.console.log);

            if (log) {
              log.call(window.console, deprecationMessage, stack);
            }

            return method.apply(this, arguments);
          };
        }
        /**
         * extend object.
         * means that properties in dest will be overwritten by the ones in src.
         * @param {Object} target
         * @param {...Object} objects_to_assign
         * @returns {Object} target
         */


        var assign;

        if (typeof Object.assign !== 'function') {
          assign = function assign(target) {
            if (target === undefined$1 || target === null) {
              throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);

            for (var index = 1; index < arguments.length; index++) {
              var source = arguments[index];

              if (source !== undefined$1 && source !== null) {
                for (var nextKey in source) {
                  if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                  }
                }
              }
            }

            return output;
          };
        } else {
          assign = Object.assign;
        }
        /**
         * extend object.
         * means that properties in dest will be overwritten by the ones in src.
         * @param {Object} dest
         * @param {Object} src
         * @param {Boolean} [merge=false]
         * @returns {Object} dest
         */


        var extend = deprecate(function extend(dest, src, merge) {
          var keys = Object.keys(src);
          var i = 0;

          while (i < keys.length) {
            if (!merge || merge && dest[keys[i]] === undefined$1) {
              dest[keys[i]] = src[keys[i]];
            }

            i++;
          }

          return dest;
        }, 'extend', 'Use `assign`.');
        /**
         * merge the values from src in the dest.
         * means that properties that exist in dest will not be overwritten by src
         * @param {Object} dest
         * @param {Object} src
         * @returns {Object} dest
         */

        var merge = deprecate(function merge(dest, src) {
          return extend(dest, src, true);
        }, 'merge', 'Use `assign`.');
        /**
         * simple class inheritance
         * @param {Function} child
         * @param {Function} base
         * @param {Object} [properties]
         */

        function inherit(child, base, properties) {
          var baseP = base.prototype,
              childP;
          childP = child.prototype = Object.create(baseP);
          childP.constructor = child;
          childP._super = baseP;

          if (properties) {
            assign(childP, properties);
          }
        }
        /**
         * simple function bind
         * @param {Function} fn
         * @param {Object} context
         * @returns {Function}
         */


        function bindFn(fn, context) {
          return function boundFn() {
            return fn.apply(context, arguments);
          };
        }
        /**
         * let a boolean value also be a function that must return a boolean
         * this first item in args will be used as the context
         * @param {Boolean|Function} val
         * @param {Array} [args]
         * @returns {Boolean}
         */


        function boolOrFn(val, args) {
          if (typeof val == TYPE_FUNCTION) {
            return val.apply(args ? args[0] || undefined$1 : undefined$1, args);
          }

          return val;
        }
        /**
         * use the val2 when val1 is undefined
         * @param {*} val1
         * @param {*} val2
         * @returns {*}
         */


        function ifUndefined(val1, val2) {
          return val1 === undefined$1 ? val2 : val1;
        }
        /**
         * addEventListener with multiple events at once
         * @param {EventTarget} target
         * @param {String} types
         * @param {Function} handler
         */


        function addEventListeners(target, types, handler) {
          each(splitStr(types), function (type) {
            target.addEventListener(type, handler, false);
          });
        }
        /**
         * removeEventListener with multiple events at once
         * @param {EventTarget} target
         * @param {String} types
         * @param {Function} handler
         */


        function removeEventListeners(target, types, handler) {
          each(splitStr(types), function (type) {
            target.removeEventListener(type, handler, false);
          });
        }
        /**
         * find if a node is in the given parent
         * @method hasParent
         * @param {HTMLElement} node
         * @param {HTMLElement} parent
         * @return {Boolean} found
         */


        function hasParent(node, parent) {
          while (node) {
            if (node == parent) {
              return true;
            }

            node = node.parentNode;
          }

          return false;
        }
        /**
         * small indexOf wrapper
         * @param {String} str
         * @param {String} find
         * @returns {Boolean} found
         */


        function inStr(str, find) {
          return str.indexOf(find) > -1;
        }
        /**
         * split string on whitespace
         * @param {String} str
         * @returns {Array} words
         */


        function splitStr(str) {
          return str.trim().split(/\s+/g);
        }
        /**
         * find if a array contains the object using indexOf or a simple polyFill
         * @param {Array} src
         * @param {String} find
         * @param {String} [findByKey]
         * @return {Boolean|Number} false when not found, or the index
         */


        function inArray(src, find, findByKey) {
          if (src.indexOf && !findByKey) {
            return src.indexOf(find);
          } else {
            var i = 0;

            while (i < src.length) {
              if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
                return i;
              }

              i++;
            }

            return -1;
          }
        }
        /**
         * convert array-like objects to real arrays
         * @param {Object} obj
         * @returns {Array}
         */


        function toArray(obj) {
          return Array.prototype.slice.call(obj, 0);
        }
        /**
         * unique array with objects based on a key (like 'id') or just by the array's value
         * @param {Array} src [{id:1},{id:2},{id:1}]
         * @param {String} [key]
         * @param {Boolean} [sort=False]
         * @returns {Array} [{id:1},{id:2}]
         */


        function uniqueArray(src, key, sort) {
          var results = [];
          var values = [];
          var i = 0;

          while (i < src.length) {
            var val = key ? src[i][key] : src[i];

            if (inArray(values, val) < 0) {
              results.push(src[i]);
            }

            values[i] = val;
            i++;
          }

          if (sort) {
            if (!key) {
              results = results.sort();
            } else {
              results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
              });
            }
          }

          return results;
        }
        /**
         * get the prefixed property
         * @param {Object} obj
         * @param {String} property
         * @returns {String|Undefined} prefixed
         */


        function prefixed(obj, property) {
          var prefix, prop;
          var camelProp = property[0].toUpperCase() + property.slice(1);
          var i = 0;

          while (i < VENDOR_PREFIXES.length) {
            prefix = VENDOR_PREFIXES[i];
            prop = prefix ? prefix + camelProp : property;

            if (prop in obj) {
              return prop;
            }

            i++;
          }

          return undefined$1;
        }
        /**
         * get a unique id
         * @returns {number} uniqueId
         */


        var _uniqueId = 1;

        function uniqueId() {
          return _uniqueId++;
        }
        /**
         * get the window object of an element
         * @param {HTMLElement} element
         * @returns {DocumentView|Window}
         */


        function getWindowForElement(element) {
          var doc = element.ownerDocument || element;
          return doc.defaultView || doc.parentWindow || window;
        }

        var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
        var SUPPORT_TOUCH = ('ontouchstart' in window);
        var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined$1;
        var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
        var INPUT_TYPE_TOUCH = 'touch';
        var INPUT_TYPE_PEN = 'pen';
        var INPUT_TYPE_MOUSE = 'mouse';
        var INPUT_TYPE_KINECT = 'kinect';
        var COMPUTE_INTERVAL = 25;
        var INPUT_START = 1;
        var INPUT_MOVE = 2;
        var INPUT_END = 4;
        var INPUT_CANCEL = 8;
        var DIRECTION_NONE = 1;
        var DIRECTION_LEFT = 2;
        var DIRECTION_RIGHT = 4;
        var DIRECTION_UP = 8;
        var DIRECTION_DOWN = 16;
        var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
        var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
        var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
        var PROPS_XY = ['x', 'y'];
        var PROPS_CLIENT_XY = ['clientX', 'clientY'];
        /**
         * create new input type manager
         * @param {Manager} manager
         * @param {Function} callback
         * @returns {Input}
         * @constructor
         */

        function Input(manager, callback) {
          var self = this;
          this.manager = manager;
          this.callback = callback;
          this.element = manager.element;
          this.target = manager.options.inputTarget; // smaller wrapper around the handler, for the scope and the enabled state of the manager,
          // so when disabled the input events are completely bypassed.

          this.domHandler = function (ev) {
            if (boolOrFn(manager.options.enable, [manager])) {
              self.handler(ev);
            }
          };

          this.init();
        }

        Input.prototype = {
          /**
           * should handle the inputEvent data and trigger the callback
           * @virtual
           */
          handler: function () {},

          /**
           * bind the events
           */
          init: function () {
            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
          },

          /**
           * unbind the events
           */
          destroy: function () {
            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
          }
        };
        /**
         * create new input type manager
         * called by the Manager constructor
         * @param {Hammer} manager
         * @returns {Input}
         */

        function createInputInstance(manager) {
          var Type;
          var inputClass = manager.options.inputClass;

          if (inputClass) {
            Type = inputClass;
          } else if (SUPPORT_POINTER_EVENTS) {
            Type = PointerEventInput;
          } else if (SUPPORT_ONLY_TOUCH) {
            Type = TouchInput;
          } else if (!SUPPORT_TOUCH) {
            Type = MouseInput;
          } else {
            Type = TouchMouseInput;
          }

          return new Type(manager, inputHandler);
        }
        /**
         * handle input events
         * @param {Manager} manager
         * @param {String} eventType
         * @param {Object} input
         */


        function inputHandler(manager, eventType, input) {
          var pointersLen = input.pointers.length;
          var changedPointersLen = input.changedPointers.length;
          var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
          var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
          input.isFirst = !!isFirst;
          input.isFinal = !!isFinal;

          if (isFirst) {
            manager.session = {};
          } // source event is the normalized value of the domEvents
          // like 'touchstart, mouseup, pointerdown'


          input.eventType = eventType; // compute scale, rotation etc

          computeInputData(manager, input); // emit secret event

          manager.emit('hammer.input', input);
          manager.recognize(input);
          manager.session.prevInput = input;
        }
        /**
         * extend the data with some usable properties like scale, rotate, velocity etc
         * @param {Object} manager
         * @param {Object} input
         */


        function computeInputData(manager, input) {
          var session = manager.session;
          var pointers = input.pointers;
          var pointersLength = pointers.length; // store the first input to calculate the distance and direction

          if (!session.firstInput) {
            session.firstInput = simpleCloneInputData(input);
          } // to compute scale and rotation we need to store the multiple touches


          if (pointersLength > 1 && !session.firstMultiple) {
            session.firstMultiple = simpleCloneInputData(input);
          } else if (pointersLength === 1) {
            session.firstMultiple = false;
          }

          var firstInput = session.firstInput;
          var firstMultiple = session.firstMultiple;
          var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
          var center = input.center = getCenter(pointers);
          input.timeStamp = now();
          input.deltaTime = input.timeStamp - firstInput.timeStamp;
          input.angle = getAngle(offsetCenter, center);
          input.distance = getDistance(offsetCenter, center);
          computeDeltaXY(session, input);
          input.offsetDirection = getDirection(input.deltaX, input.deltaY);
          var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
          input.overallVelocityX = overallVelocity.x;
          input.overallVelocityY = overallVelocity.y;
          input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
          input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
          input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
          input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;
          computeIntervalInputData(session, input); // find the correct target

          var target = manager.element;

          if (hasParent(input.srcEvent.target, target)) {
            target = input.srcEvent.target;
          }

          input.target = target;
        }

        function computeDeltaXY(session, input) {
          var center = input.center;
          var offset = session.offsetDelta || {};
          var prevDelta = session.prevDelta || {};
          var prevInput = session.prevInput || {};

          if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
            prevDelta = session.prevDelta = {
              x: prevInput.deltaX || 0,
              y: prevInput.deltaY || 0
            };
            offset = session.offsetDelta = {
              x: center.x,
              y: center.y
            };
          }

          input.deltaX = prevDelta.x + (center.x - offset.x);
          input.deltaY = prevDelta.y + (center.y - offset.y);
        }
        /**
         * velocity is calculated every x ms
         * @param {Object} session
         * @param {Object} input
         */


        function computeIntervalInputData(session, input) {
          var last = session.lastInterval || input,
              deltaTime = input.timeStamp - last.timeStamp,
              velocity,
              velocityX,
              velocityY,
              direction;

          if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined$1)) {
            var deltaX = input.deltaX - last.deltaX;
            var deltaY = input.deltaY - last.deltaY;
            var v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY);
            session.lastInterval = input;
          } else {
            // use latest velocity info if it doesn't overtake a minimum period
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
          }

          input.velocity = velocity;
          input.velocityX = velocityX;
          input.velocityY = velocityY;
          input.direction = direction;
        }
        /**
         * create a simple clone from the input used for storage of firstInput and firstMultiple
         * @param {Object} input
         * @returns {Object} clonedInputData
         */


        function simpleCloneInputData(input) {
          // make a simple copy of the pointers because we will get a reference if we don't
          // we only need clientXY for the calculations
          var pointers = [];
          var i = 0;

          while (i < input.pointers.length) {
            pointers[i] = {
              clientX: round(input.pointers[i].clientX),
              clientY: round(input.pointers[i].clientY)
            };
            i++;
          }

          return {
            timeStamp: now(),
            pointers: pointers,
            center: getCenter(pointers),
            deltaX: input.deltaX,
            deltaY: input.deltaY
          };
        }
        /**
         * get the center of all the pointers
         * @param {Array} pointers
         * @return {Object} center contains `x` and `y` properties
         */


        function getCenter(pointers) {
          var pointersLength = pointers.length; // no need to loop when only one touch

          if (pointersLength === 1) {
            return {
              x: round(pointers[0].clientX),
              y: round(pointers[0].clientY)
            };
          }

          var x = 0,
              y = 0,
              i = 0;

          while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
          }

          return {
            x: round(x / pointersLength),
            y: round(y / pointersLength)
          };
        }
        /**
         * calculate the velocity between two points. unit is in px per ms.
         * @param {Number} deltaTime
         * @param {Number} x
         * @param {Number} y
         * @return {Object} velocity `x` and `y`
         */


        function getVelocity(deltaTime, x, y) {
          return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
          };
        }
        /**
         * get the direction between two points
         * @param {Number} x
         * @param {Number} y
         * @return {Number} direction
         */


        function getDirection(x, y) {
          if (x === y) {
            return DIRECTION_NONE;
          }

          if (abs(x) >= abs(y)) {
            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
          }

          return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
        }
        /**
         * calculate the absolute distance between two points
         * @param {Object} p1 {x, y}
         * @param {Object} p2 {x, y}
         * @param {Array} [props] containing x and y keys
         * @return {Number} distance
         */


        function getDistance(p1, p2, props) {
          if (!props) {
            props = PROPS_XY;
          }

          var x = p2[props[0]] - p1[props[0]],
              y = p2[props[1]] - p1[props[1]];
          return Math.sqrt(x * x + y * y);
        }
        /**
         * calculate the angle between two coordinates
         * @param {Object} p1
         * @param {Object} p2
         * @param {Array} [props] containing x and y keys
         * @return {Number} angle
         */


        function getAngle(p1, p2, props) {
          if (!props) {
            props = PROPS_XY;
          }

          var x = p2[props[0]] - p1[props[0]],
              y = p2[props[1]] - p1[props[1]];
          return Math.atan2(y, x) * 180 / Math.PI;
        }
        /**
         * calculate the rotation degrees between two pointersets
         * @param {Array} start array of pointers
         * @param {Array} end array of pointers
         * @return {Number} rotation
         */


        function getRotation(start, end) {
          return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
        }
        /**
         * calculate the scale factor between two pointersets
         * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
         * @param {Array} start array of pointers
         * @param {Array} end array of pointers
         * @return {Number} scale
         */


        function getScale(start, end) {
          return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
        }

        var MOUSE_INPUT_MAP = {
          mousedown: INPUT_START,
          mousemove: INPUT_MOVE,
          mouseup: INPUT_END
        };
        var MOUSE_ELEMENT_EVENTS = 'mousedown';
        var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';
        /**
         * Mouse events input
         * @constructor
         * @extends Input
         */

        function MouseInput() {
          this.evEl = MOUSE_ELEMENT_EVENTS;
          this.evWin = MOUSE_WINDOW_EVENTS;
          this.pressed = false; // mousedown state

          Input.apply(this, arguments);
        }

        inherit(MouseInput, Input, {
          /**
           * handle mouse events
           * @param {Object} ev
           */
          handler: function MEhandler(ev) {
            var eventType = MOUSE_INPUT_MAP[ev.type]; // on start we want to have the left mouse button down

            if (eventType & INPUT_START && ev.button === 0) {
              this.pressed = true;
            }

            if (eventType & INPUT_MOVE && ev.which !== 1) {
              eventType = INPUT_END;
            } // mouse must be down


            if (!this.pressed) {
              return;
            }

            if (eventType & INPUT_END) {
              this.pressed = false;
            }

            this.callback(this.manager, eventType, {
              pointers: [ev],
              changedPointers: [ev],
              pointerType: INPUT_TYPE_MOUSE,
              srcEvent: ev
            });
          }
        });
        var POINTER_INPUT_MAP = {
          pointerdown: INPUT_START,
          pointermove: INPUT_MOVE,
          pointerup: INPUT_END,
          pointercancel: INPUT_CANCEL,
          pointerout: INPUT_CANCEL
        }; // in IE10 the pointer types is defined as an enum

        var IE10_POINTER_TYPE_ENUM = {
          2: INPUT_TYPE_TOUCH,
          3: INPUT_TYPE_PEN,
          4: INPUT_TYPE_MOUSE,
          5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816

        };
        var POINTER_ELEMENT_EVENTS = 'pointerdown';
        var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel'; // IE10 has prefixed support, and case-sensitive

        if (window.MSPointerEvent && !window.PointerEvent) {
          POINTER_ELEMENT_EVENTS = 'MSPointerDown';
          POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
        }
        /**
         * Pointer events input
         * @constructor
         * @extends Input
         */


        function PointerEventInput() {
          this.evEl = POINTER_ELEMENT_EVENTS;
          this.evWin = POINTER_WINDOW_EVENTS;
          Input.apply(this, arguments);
          this.store = this.manager.session.pointerEvents = [];
        }

        inherit(PointerEventInput, Input, {
          /**
           * handle mouse events
           * @param {Object} ev
           */
          handler: function PEhandler(ev) {
            var store = this.store;
            var removePointer = false;
            var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
            var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
            var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
            var isTouch = pointerType == INPUT_TYPE_TOUCH; // get index of the event in the store

            var storeIndex = inArray(store, ev.pointerId, 'pointerId'); // start and mouse must be down

            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
              if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
              }
            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
              removePointer = true;
            } // it not found, so the pointer hasn't been down (so it's probably a hover)


            if (storeIndex < 0) {
              return;
            } // update the event in the store


            store[storeIndex] = ev;
            this.callback(this.manager, eventType, {
              pointers: store,
              changedPointers: [ev],
              pointerType: pointerType,
              srcEvent: ev
            });

            if (removePointer) {
              // remove from the store
              store.splice(storeIndex, 1);
            }
          }
        });
        var SINGLE_TOUCH_INPUT_MAP = {
          touchstart: INPUT_START,
          touchmove: INPUT_MOVE,
          touchend: INPUT_END,
          touchcancel: INPUT_CANCEL
        };
        var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
        var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';
        /**
         * Touch events input
         * @constructor
         * @extends Input
         */

        function SingleTouchInput() {
          this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
          this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
          this.started = false;
          Input.apply(this, arguments);
        }

        inherit(SingleTouchInput, Input, {
          handler: function TEhandler(ev) {
            var type = SINGLE_TOUCH_INPUT_MAP[ev.type]; // should we handle the touch events?

            if (type === INPUT_START) {
              this.started = true;
            }

            if (!this.started) {
              return;
            }

            var touches = normalizeSingleTouches.call(this, ev, type); // when done, reset the started state

            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
              this.started = false;
            }

            this.callback(this.manager, type, {
              pointers: touches[0],
              changedPointers: touches[1],
              pointerType: INPUT_TYPE_TOUCH,
              srcEvent: ev
            });
          }
        });
        /**
         * @this {TouchInput}
         * @param {Object} ev
         * @param {Number} type flag
         * @returns {undefined|Array} [all, changed]
         */

        function normalizeSingleTouches(ev, type) {
          var all = toArray(ev.touches);
          var changed = toArray(ev.changedTouches);

          if (type & (INPUT_END | INPUT_CANCEL)) {
            all = uniqueArray(all.concat(changed), 'identifier', true);
          }

          return [all, changed];
        }

        var TOUCH_INPUT_MAP = {
          touchstart: INPUT_START,
          touchmove: INPUT_MOVE,
          touchend: INPUT_END,
          touchcancel: INPUT_CANCEL
        };
        var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';
        /**
         * Multi-user touch events input
         * @constructor
         * @extends Input
         */

        function TouchInput() {
          this.evTarget = TOUCH_TARGET_EVENTS;
          this.targetIds = {};
          Input.apply(this, arguments);
        }

        inherit(TouchInput, Input, {
          handler: function MTEhandler(ev) {
            var type = TOUCH_INPUT_MAP[ev.type];
            var touches = getTouches.call(this, ev, type);

            if (!touches) {
              return;
            }

            this.callback(this.manager, type, {
              pointers: touches[0],
              changedPointers: touches[1],
              pointerType: INPUT_TYPE_TOUCH,
              srcEvent: ev
            });
          }
        });
        /**
         * @this {TouchInput}
         * @param {Object} ev
         * @param {Number} type flag
         * @returns {undefined|Array} [all, changed]
         */

        function getTouches(ev, type) {
          var allTouches = toArray(ev.touches);
          var targetIds = this.targetIds; // when there is only one touch, the process can be simplified

          if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
          }

          var i,
              targetTouches,
              changedTouches = toArray(ev.changedTouches),
              changedTargetTouches = [],
              target = this.target; // get target touches from touches

          targetTouches = allTouches.filter(function (touch) {
            return hasParent(touch.target, target);
          }); // collect touches

          if (type === INPUT_START) {
            i = 0;

            while (i < targetTouches.length) {
              targetIds[targetTouches[i].identifier] = true;
              i++;
            }
          } // filter changed touches to only contain touches that exist in the collected target ids


          i = 0;

          while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
              changedTargetTouches.push(changedTouches[i]);
            } // cleanup removed touches


            if (type & (INPUT_END | INPUT_CANCEL)) {
              delete targetIds[changedTouches[i].identifier];
            }

            i++;
          }

          if (!changedTargetTouches.length) {
            return;
          }

          return [// merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
          uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true), changedTargetTouches];
        }
        /**
         * Combined touch and mouse input
         *
         * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
         * This because touch devices also emit mouse events while doing a touch.
         *
         * @constructor
         * @extends Input
         */


        var DEDUP_TIMEOUT = 2500;
        var DEDUP_DISTANCE = 25;

        function TouchMouseInput() {
          Input.apply(this, arguments);
          var handler = bindFn(this.handler, this);
          this.touch = new TouchInput(this.manager, handler);
          this.mouse = new MouseInput(this.manager, handler);
          this.primaryTouch = null;
          this.lastTouches = [];
        }

        inherit(TouchMouseInput, Input, {
          /**
           * handle mouse and touch events
           * @param {Hammer} manager
           * @param {String} inputEvent
           * @param {Object} inputData
           */
          handler: function TMEhandler(manager, inputEvent, inputData) {
            var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH,
                isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;

            if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
              return;
            } // when we're in a touch event, record touches to  de-dupe synthetic mouse event


            if (isTouch) {
              recordTouches.call(this, inputEvent, inputData);
            } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
              return;
            }

            this.callback(manager, inputEvent, inputData);
          },

          /**
           * remove the event listeners
           */
          destroy: function destroy() {
            this.touch.destroy();
            this.mouse.destroy();
          }
        });

        function recordTouches(eventType, eventData) {
          if (eventType & INPUT_START) {
            this.primaryTouch = eventData.changedPointers[0].identifier;
            setLastTouch.call(this, eventData);
          } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            setLastTouch.call(this, eventData);
          }
        }

        function setLastTouch(eventData) {
          var touch = eventData.changedPointers[0];

          if (touch.identifier === this.primaryTouch) {
            var lastTouch = {
              x: touch.clientX,
              y: touch.clientY
            };
            this.lastTouches.push(lastTouch);
            var lts = this.lastTouches;

            var removeLastTouch = function () {
              var i = lts.indexOf(lastTouch);

              if (i > -1) {
                lts.splice(i, 1);
              }
            };

            setTimeout(removeLastTouch, DEDUP_TIMEOUT);
          }
        }

        function isSyntheticEvent(eventData) {
          var x = eventData.srcEvent.clientX,
              y = eventData.srcEvent.clientY;

          for (var i = 0; i < this.lastTouches.length; i++) {
            var t = this.lastTouches[i];
            var dx = Math.abs(x - t.x),
                dy = Math.abs(y - t.y);

            if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
              return true;
            }
          }

          return false;
        }

        var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
        var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined$1; // magical touchAction value

        var TOUCH_ACTION_COMPUTE = 'compute';
        var TOUCH_ACTION_AUTO = 'auto';
        var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented

        var TOUCH_ACTION_NONE = 'none';
        var TOUCH_ACTION_PAN_X = 'pan-x';
        var TOUCH_ACTION_PAN_Y = 'pan-y';
        var TOUCH_ACTION_MAP = getTouchActionProps();
        /**
         * Touch Action
         * sets the touchAction property or uses the js alternative
         * @param {Manager} manager
         * @param {String} value
         * @constructor
         */

        function TouchAction(manager, value) {
          this.manager = manager;
          this.set(value);
        }

        TouchAction.prototype = {
          /**
           * set the touchAction value on the element or enable the polyfill
           * @param {String} value
           */
          set: function (value) {
            // find out the touch-action by the event handlers
            if (value == TOUCH_ACTION_COMPUTE) {
              value = this.compute();
            }

            if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
              this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }

            this.actions = value.toLowerCase().trim();
          },

          /**
           * just re-set the touchAction value
           */
          update: function () {
            this.set(this.manager.options.touchAction);
          },

          /**
           * compute the value for the touchAction property based on the recognizer's settings
           * @returns {String} value
           */
          compute: function () {
            var actions = [];
            each(this.manager.recognizers, function (recognizer) {
              if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
              }
            });
            return cleanTouchActions(actions.join(' '));
          },

          /**
           * this method is called on each input cycle and provides the preventing of the browser behavior
           * @param {Object} input
           */
          preventDefaults: function (input) {
            var srcEvent = input.srcEvent;
            var direction = input.offsetDirection; // if the touch action did prevented once this session

            if (this.manager.session.prevented) {
              srcEvent.preventDefault();
              return;
            }

            var actions = this.actions;
            var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

            if (hasNone) {
              //do not prevent defaults if this is a tap gesture
              var isTapPointer = input.pointers.length === 1;
              var isTapMovement = input.distance < 2;
              var isTapTouchTime = input.deltaTime < 250;

              if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
              }
            }

            if (hasPanX && hasPanY) {
              // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
              return;
            }

            if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
              return this.preventSrc(srcEvent);
            }
          },

          /**
           * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
           * @param {Object} srcEvent
           */
          preventSrc: function (srcEvent) {
            this.manager.session.prevented = true;
            srcEvent.preventDefault();
          }
        };
        /**
         * when the touchActions are collected they are not a valid value, so we need to clean things up. *
         * @param {String} actions
         * @returns {*}
         */

        function cleanTouchActions(actions) {
          // none
          if (inStr(actions, TOUCH_ACTION_NONE)) {
            return TOUCH_ACTION_NONE;
          }

          var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
          var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y); // if both pan-x and pan-y are set (different recognizers
          // for different directions, e.g. horizontal pan but vertical swipe?)
          // we need none (as otherwise with pan-x pan-y combined none of these
          // recognizers will work, since the browser would handle all panning

          if (hasPanX && hasPanY) {
            return TOUCH_ACTION_NONE;
          } // pan-x OR pan-y


          if (hasPanX || hasPanY) {
            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
          } // manipulation


          if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
            return TOUCH_ACTION_MANIPULATION;
          }

          return TOUCH_ACTION_AUTO;
        }

        function getTouchActionProps() {
          if (!NATIVE_TOUCH_ACTION) {
            return false;
          }

          var touchMap = {};
          var cssSupports = window.CSS && window.CSS.supports;
          ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function (val) {
            // If css.supports is not supported but there is native touch-action assume it supports
            // all values. This is the case for IE 10 and 11.
            touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
          });
          return touchMap;
        }
        /**
         * Recognizer flow explained; *
         * All recognizers have the initial state of POSSIBLE when a input session starts.
         * The definition of a input session is from the first input until the last input, with all it's movement in it. *
         * Example session for mouse-input: mousedown -> mousemove -> mouseup
         *
         * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
         * which determines with state it should be.
         *
         * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
         * POSSIBLE to give it another change on the next cycle.
         *
         *               Possible
         *                  |
         *            +-----+---------------+
         *            |                     |
         *      +-----+-----+               |
         *      |           |               |
         *   Failed      Cancelled          |
         *                          +-------+------+
         *                          |              |
         *                      Recognized       Began
         *                                         |
         *                                      Changed
         *                                         |
         *                                  Ended/Recognized
         */


        var STATE_POSSIBLE = 1;
        var STATE_BEGAN = 2;
        var STATE_CHANGED = 4;
        var STATE_ENDED = 8;
        var STATE_RECOGNIZED = STATE_ENDED;
        var STATE_CANCELLED = 16;
        var STATE_FAILED = 32;
        /**
         * Recognizer
         * Every recognizer needs to extend from this class.
         * @constructor
         * @param {Object} options
         */

        function Recognizer(options) {
          this.options = assign({}, this.defaults, options || {});
          this.id = uniqueId();
          this.manager = null; // default is enable true

          this.options.enable = ifUndefined(this.options.enable, true);
          this.state = STATE_POSSIBLE;
          this.simultaneous = {};
          this.requireFail = [];
        }

        Recognizer.prototype = {
          /**
           * @virtual
           * @type {Object}
           */
          defaults: {},

          /**
           * set options
           * @param {Object} options
           * @return {Recognizer}
           */
          set: function (options) {
            assign(this.options, options); // also update the touchAction, in case something changed about the directions/enabled state

            this.manager && this.manager.touchAction.update();
            return this;
          },

          /**
           * recognize simultaneous with an other recognizer.
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          recognizeWith: function (otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
              return this;
            }

            var simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);

            if (!simultaneous[otherRecognizer.id]) {
              simultaneous[otherRecognizer.id] = otherRecognizer;
              otherRecognizer.recognizeWith(this);
            }

            return this;
          },

          /**
           * drop the simultaneous link. it doesnt remove the link on the other recognizer.
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          dropRecognizeWith: function (otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
              return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            delete this.simultaneous[otherRecognizer.id];
            return this;
          },

          /**
           * recognizer can only run when an other is failing
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          requireFailure: function (otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
              return this;
            }

            var requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);

            if (inArray(requireFail, otherRecognizer) === -1) {
              requireFail.push(otherRecognizer);
              otherRecognizer.requireFailure(this);
            }

            return this;
          },

          /**
           * drop the requireFailure link. it does not remove the link on the other recognizer.
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          dropRequireFailure: function (otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
              return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            var index = inArray(this.requireFail, otherRecognizer);

            if (index > -1) {
              this.requireFail.splice(index, 1);
            }

            return this;
          },

          /**
           * has require failures boolean
           * @returns {boolean}
           */
          hasRequireFailures: function () {
            return this.requireFail.length > 0;
          },

          /**
           * if the recognizer can recognize simultaneous with an other recognizer
           * @param {Recognizer} otherRecognizer
           * @returns {Boolean}
           */
          canRecognizeWith: function (otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
          },

          /**
           * You should use `tryEmit` instead of `emit` directly to check
           * that all the needed recognizers has failed before emitting.
           * @param {Object} input
           */
          emit: function (input) {
            var self = this;
            var state = this.state;

            function emit(event) {
              self.manager.emit(event, input);
            } // 'panstart' and 'panmove'


            if (state < STATE_ENDED) {
              emit(self.options.event + stateStr(state));
            }

            emit(self.options.event); // simple 'eventName' events

            if (input.additionalEvent) {
              // additional event(panleft, panright, pinchin, pinchout...)
              emit(input.additionalEvent);
            } // panend and pancancel


            if (state >= STATE_ENDED) {
              emit(self.options.event + stateStr(state));
            }
          },

          /**
           * Check that all the require failure recognizers has failed,
           * if true, it emits a gesture event,
           * otherwise, setup the state to FAILED.
           * @param {Object} input
           */
          tryEmit: function (input) {
            if (this.canEmit()) {
              return this.emit(input);
            } // it's failing anyway


            this.state = STATE_FAILED;
          },

          /**
           * can we emit?
           * @returns {boolean}
           */
          canEmit: function () {
            var i = 0;

            while (i < this.requireFail.length) {
              if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
              }

              i++;
            }

            return true;
          },

          /**
           * update the recognizer
           * @param {Object} inputData
           */
          recognize: function (inputData) {
            // make a new copy of the inputData
            // so we can change the inputData without messing up the other recognizers
            var inputDataClone = assign({}, inputData); // is is enabled and allow recognizing?

            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
              this.reset();
              this.state = STATE_FAILED;
              return;
            } // reset when we've reached the end


            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
              this.state = STATE_POSSIBLE;
            }

            this.state = this.process(inputDataClone); // the recognizer has recognized a gesture
            // so trigger an event

            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
              this.tryEmit(inputDataClone);
            }
          },

          /**
           * return the state of the recognizer
           * the actual recognizing happens in this method
           * @virtual
           * @param {Object} inputData
           * @returns {Const} STATE
           */
          process: function (inputData) {},
          // jshint ignore:line

          /**
           * return the preferred touch-action
           * @virtual
           * @returns {Array}
           */
          getTouchAction: function () {},

          /**
           * called when the gesture isn't allowed to recognize
           * like when another is being recognized or it is disabled
           * @virtual
           */
          reset: function () {}
        };
        /**
         * get a usable string, used as event postfix
         * @param {Const} state
         * @returns {String} state
         */

        function stateStr(state) {
          if (state & STATE_CANCELLED) {
            return 'cancel';
          } else if (state & STATE_ENDED) {
            return 'end';
          } else if (state & STATE_CHANGED) {
            return 'move';
          } else if (state & STATE_BEGAN) {
            return 'start';
          }

          return '';
        }
        /**
         * direction cons to string
         * @param {Const} direction
         * @returns {String}
         */


        function directionStr(direction) {
          if (direction == DIRECTION_DOWN) {
            return 'down';
          } else if (direction == DIRECTION_UP) {
            return 'up';
          } else if (direction == DIRECTION_LEFT) {
            return 'left';
          } else if (direction == DIRECTION_RIGHT) {
            return 'right';
          }

          return '';
        }
        /**
         * get a recognizer by name if it is bound to a manager
         * @param {Recognizer|String} otherRecognizer
         * @param {Recognizer} recognizer
         * @returns {Recognizer}
         */


        function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
          var manager = recognizer.manager;

          if (manager) {
            return manager.get(otherRecognizer);
          }

          return otherRecognizer;
        }
        /**
         * This recognizer is just used as a base for the simple attribute recognizers.
         * @constructor
         * @extends Recognizer
         */


        function AttrRecognizer() {
          Recognizer.apply(this, arguments);
        }

        inherit(AttrRecognizer, Recognizer, {
          /**
           * @namespace
           * @memberof AttrRecognizer
           */
          defaults: {
            /**
             * @type {Number}
             * @default 1
             */
            pointers: 1
          },

          /**
           * Used to check if it the recognizer receives valid input, like input.distance > 10.
           * @memberof AttrRecognizer
           * @param {Object} input
           * @returns {Boolean} recognized
           */
          attrTest: function (input) {
            var optionPointers = this.options.pointers;
            return optionPointers === 0 || input.pointers.length === optionPointers;
          },

          /**
           * Process the input and return the state for the recognizer
           * @memberof AttrRecognizer
           * @param {Object} input
           * @returns {*} State
           */
          process: function (input) {
            var state = this.state;
            var eventType = input.eventType;
            var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
            var isValid = this.attrTest(input); // on cancel input and we've recognized before, return STATE_CANCELLED

            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
              return state | STATE_CANCELLED;
            } else if (isRecognized || isValid) {
              if (eventType & INPUT_END) {
                return state | STATE_ENDED;
              } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
              }

              return state | STATE_CHANGED;
            }

            return STATE_FAILED;
          }
        });
        /**
         * Pan
         * Recognized when the pointer is down and moved in the allowed direction.
         * @constructor
         * @extends AttrRecognizer
         */

        function PanRecognizer() {
          AttrRecognizer.apply(this, arguments);
          this.pX = null;
          this.pY = null;
        }

        inherit(PanRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof PanRecognizer
           */
          defaults: {
            event: 'pan',
            threshold: 10,
            pointers: 1,
            direction: DIRECTION_ALL
          },
          getTouchAction: function () {
            var direction = this.options.direction;
            var actions = [];

            if (direction & DIRECTION_HORIZONTAL) {
              actions.push(TOUCH_ACTION_PAN_Y);
            }

            if (direction & DIRECTION_VERTICAL) {
              actions.push(TOUCH_ACTION_PAN_X);
            }

            return actions;
          },
          directionTest: function (input) {
            var options = this.options;
            var hasMoved = true;
            var distance = input.distance;
            var direction = input.direction;
            var x = input.deltaX;
            var y = input.deltaY; // lock to axis?

            if (!(direction & options.direction)) {
              if (options.direction & DIRECTION_HORIZONTAL) {
                direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
              } else {
                direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
              }
            }

            input.direction = direction;
            return hasMoved && distance > options.threshold && direction & options.direction;
          },
          attrTest: function (input) {
            return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
          },
          emit: function (input) {
            this.pX = input.deltaX;
            this.pY = input.deltaY;
            var direction = directionStr(input.direction);

            if (direction) {
              input.additionalEvent = this.options.event + direction;
            }

            this._super.emit.call(this, input);
          }
        });
        /**
         * Pinch
         * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
         * @constructor
         * @extends AttrRecognizer
         */

        function PinchRecognizer() {
          AttrRecognizer.apply(this, arguments);
        }

        inherit(PinchRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof PinchRecognizer
           */
          defaults: {
            event: 'pinch',
            threshold: 0,
            pointers: 2
          },
          getTouchAction: function () {
            return [TOUCH_ACTION_NONE];
          },
          attrTest: function (input) {
            return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
          },
          emit: function (input) {
            if (input.scale !== 1) {
              var inOut = input.scale < 1 ? 'in' : 'out';
              input.additionalEvent = this.options.event + inOut;
            }

            this._super.emit.call(this, input);
          }
        });
        /**
         * Press
         * Recognized when the pointer is down for x ms without any movement.
         * @constructor
         * @extends Recognizer
         */

        function PressRecognizer() {
          Recognizer.apply(this, arguments);
          this._timer = null;
          this._input = null;
        }

        inherit(PressRecognizer, Recognizer, {
          /**
           * @namespace
           * @memberof PressRecognizer
           */
          defaults: {
            event: 'press',
            pointers: 1,
            time: 251,
            // minimal time of the pointer to be pressed
            threshold: 9 // a minimal movement is ok, but keep it low

          },
          getTouchAction: function () {
            return [TOUCH_ACTION_AUTO];
          },
          process: function (input) {
            var options = this.options;
            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTime = input.deltaTime > options.time;
            this._input = input; // we only allow little movement
            // and we've reached an end event, so a tap is possible

            if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
              this.reset();
            } else if (input.eventType & INPUT_START) {
              this.reset();
              this._timer = setTimeoutContext(function () {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
              }, options.time, this);
            } else if (input.eventType & INPUT_END) {
              return STATE_RECOGNIZED;
            }

            return STATE_FAILED;
          },
          reset: function () {
            clearTimeout(this._timer);
          },
          emit: function (input) {
            if (this.state !== STATE_RECOGNIZED) {
              return;
            }

            if (input && input.eventType & INPUT_END) {
              this.manager.emit(this.options.event + 'up', input);
            } else {
              this._input.timeStamp = now();
              this.manager.emit(this.options.event, this._input);
            }
          }
        });
        /**
         * Rotate
         * Recognized when two or more pointer are moving in a circular motion.
         * @constructor
         * @extends AttrRecognizer
         */

        function RotateRecognizer() {
          AttrRecognizer.apply(this, arguments);
        }

        inherit(RotateRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof RotateRecognizer
           */
          defaults: {
            event: 'rotate',
            threshold: 0,
            pointers: 2
          },
          getTouchAction: function () {
            return [TOUCH_ACTION_NONE];
          },
          attrTest: function (input) {
            return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
          }
        });
        /**
         * Swipe
         * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
         * @constructor
         * @extends AttrRecognizer
         */

        function SwipeRecognizer() {
          AttrRecognizer.apply(this, arguments);
        }

        inherit(SwipeRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof SwipeRecognizer
           */
          defaults: {
            event: 'swipe',
            threshold: 10,
            velocity: 0.3,
            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
            pointers: 1
          },
          getTouchAction: function () {
            return PanRecognizer.prototype.getTouchAction.call(this);
          },
          attrTest: function (input) {
            var direction = this.options.direction;
            var velocity;

            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
              velocity = input.overallVelocity;
            } else if (direction & DIRECTION_HORIZONTAL) {
              velocity = input.overallVelocityX;
            } else if (direction & DIRECTION_VERTICAL) {
              velocity = input.overallVelocityY;
            }

            return this._super.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers == this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
          },
          emit: function (input) {
            var direction = directionStr(input.offsetDirection);

            if (direction) {
              this.manager.emit(this.options.event + direction, input);
            }

            this.manager.emit(this.options.event, input);
          }
        });
        /**
         * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
         * between the given interval and position. The delay option can be used to recognize multi-taps without firing
         * a single tap.
         *
         * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
         * multi-taps being recognized.
         * @constructor
         * @extends Recognizer
         */

        function TapRecognizer() {
          Recognizer.apply(this, arguments); // previous time and center,
          // used for tap counting

          this.pTime = false;
          this.pCenter = false;
          this._timer = null;
          this._input = null;
          this.count = 0;
        }

        inherit(TapRecognizer, Recognizer, {
          /**
           * @namespace
           * @memberof PinchRecognizer
           */
          defaults: {
            event: 'tap',
            pointers: 1,
            taps: 1,
            interval: 300,
            // max time between the multi-tap taps
            time: 250,
            // max time of the pointer to be down (like finger on the screen)
            threshold: 9,
            // a minimal movement is ok, but keep it low
            posThreshold: 10 // a multi-tap can be a bit off the initial position

          },
          getTouchAction: function () {
            return [TOUCH_ACTION_MANIPULATION];
          },
          process: function (input) {
            var options = this.options;
            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTouchTime = input.deltaTime < options.time;
            this.reset();

            if (input.eventType & INPUT_START && this.count === 0) {
              return this.failTimeout();
            } // we only allow little movement
            // and we've reached an end event, so a tap is possible


            if (validMovement && validTouchTime && validPointers) {
              if (input.eventType != INPUT_END) {
                return this.failTimeout();
              }

              var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
              var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
              this.pTime = input.timeStamp;
              this.pCenter = input.center;

              if (!validMultiTap || !validInterval) {
                this.count = 1;
              } else {
                this.count += 1;
              }

              this._input = input; // if tap count matches we have recognized it,
              // else it has began recognizing...

              var tapCount = this.count % options.taps;

              if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                  return STATE_RECOGNIZED;
                } else {
                  this._timer = setTimeoutContext(function () {
                    this.state = STATE_RECOGNIZED;
                    this.tryEmit();
                  }, options.interval, this);
                  return STATE_BEGAN;
                }
              }
            }

            return STATE_FAILED;
          },
          failTimeout: function () {
            this._timer = setTimeoutContext(function () {
              this.state = STATE_FAILED;
            }, this.options.interval, this);
            return STATE_FAILED;
          },
          reset: function () {
            clearTimeout(this._timer);
          },
          emit: function () {
            if (this.state == STATE_RECOGNIZED) {
              this._input.tapCount = this.count;
              this.manager.emit(this.options.event, this._input);
            }
          }
        });
        /**
         * Simple way to create a manager with a default set of recognizers.
         * @param {HTMLElement} element
         * @param {Object} [options]
         * @constructor
         */

        function Hammer(element, options) {
          options = options || {};
          options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
          return new Manager(element, options);
        }
        /**
         * @const {string}
         */


        Hammer.VERSION = '2.0.7';
        /**
         * default settings
         * @namespace
         */

        Hammer.defaults = {
          /**
           * set if DOM events are being triggered.
           * But this is slower and unused by simple implementations, so disabled by default.
           * @type {Boolean}
           * @default false
           */
          domEvents: false,

          /**
           * The value for the touchAction property/fallback.
           * When set to `compute` it will magically set the correct value based on the added recognizers.
           * @type {String}
           * @default compute
           */
          touchAction: TOUCH_ACTION_COMPUTE,

          /**
           * @type {Boolean}
           * @default true
           */
          enable: true,

          /**
           * EXPERIMENTAL FEATURE -- can be removed/changed
           * Change the parent input target element.
           * If Null, then it is being set the to main element.
           * @type {Null|EventTarget}
           * @default null
           */
          inputTarget: null,

          /**
           * force an input class
           * @type {Null|Function}
           * @default null
           */
          inputClass: null,

          /**
           * Default recognizer setup when calling `Hammer()`
           * When creating a new Manager these will be skipped.
           * @type {Array}
           */
          preset: [// RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
          [RotateRecognizer, {
            enable: false
          }], [PinchRecognizer, {
            enable: false
          }, ['rotate']], [SwipeRecognizer, {
            direction: DIRECTION_HORIZONTAL
          }], [PanRecognizer, {
            direction: DIRECTION_HORIZONTAL
          }, ['swipe']], [TapRecognizer], [TapRecognizer, {
            event: 'doubletap',
            taps: 2
          }, ['tap']], [PressRecognizer]],

          /**
           * Some CSS properties can be used to improve the working of Hammer.
           * Add them to this method and they will be set when creating a new Manager.
           * @namespace
           */
          cssProps: {
            /**
             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userSelect: 'none',

            /**
             * Disable the Windows Phone grippers when pressing an element.
             * @type {String}
             * @default 'none'
             */
            touchSelect: 'none',

            /**
             * Disables the default callout shown when you touch and hold a touch target.
             * On iOS, when you touch and hold a touch target such as a link, Safari displays
             * a callout containing information about the link. This property allows you to disable that callout.
             * @type {String}
             * @default 'none'
             */
            touchCallout: 'none',

            /**
             * Specifies whether zooming is enabled. Used by IE10>
             * @type {String}
             * @default 'none'
             */
            contentZooming: 'none',

            /**
             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userDrag: 'none',

            /**
             * Overrides the highlight color shown when the user taps a link or a JavaScript
             * clickable element in iOS. This property obeys the alpha value, if specified.
             * @type {String}
             * @default 'rgba(0,0,0,0)'
             */
            tapHighlightColor: 'rgba(0,0,0,0)'
          }
        };
        var STOP = 1;
        var FORCED_STOP = 2;
        /**
         * Manager
         * @param {HTMLElement} element
         * @param {Object} [options]
         * @constructor
         */

        function Manager(element, options) {
          this.options = assign({}, Hammer.defaults, options || {});
          this.options.inputTarget = this.options.inputTarget || element;
          this.handlers = {};
          this.session = {};
          this.recognizers = [];
          this.oldCssProps = {};
          this.element = element;
          this.input = createInputInstance(this);
          this.touchAction = new TouchAction(this, this.options.touchAction);
          toggleCssProps(this, true);
          each(this.options.recognizers, function (item) {
            var recognizer = this.add(new item[0](item[1]));
            item[2] && recognizer.recognizeWith(item[2]);
            item[3] && recognizer.requireFailure(item[3]);
          }, this);
        }

        Manager.prototype = {
          /**
           * set options
           * @param {Object} options
           * @returns {Manager}
           */
          set: function (options) {
            assign(this.options, options); // Options that need a little more setup

            if (options.touchAction) {
              this.touchAction.update();
            }

            if (options.inputTarget) {
              // Clean up existing event listeners and reinitialize
              this.input.destroy();
              this.input.target = options.inputTarget;
              this.input.init();
            }

            return this;
          },

          /**
           * stop recognizing for this session.
           * This session will be discarded, when a new [input]start event is fired.
           * When forced, the recognizer cycle is stopped immediately.
           * @param {Boolean} [force]
           */
          stop: function (force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
          },

          /**
           * run the recognizers!
           * called by the inputHandler function on every movement of the pointers (touches)
           * it walks through all the recognizers and tries to detect the gesture that is being made
           * @param {Object} inputData
           */
          recognize: function (inputData) {
            var session = this.session;

            if (session.stopped) {
              return;
            } // run the touch-action polyfill


            this.touchAction.preventDefaults(inputData);
            var recognizer;
            var recognizers = this.recognizers; // this holds the recognizer that is being recognized.
            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
            // if no recognizer is detecting a thing, it is set to `null`

            var curRecognizer = session.curRecognizer; // reset when the last recognizer is recognized
            // or when we're in a new session

            if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
              curRecognizer = session.curRecognizer = null;
            }

            var i = 0;

            while (i < recognizers.length) {
              recognizer = recognizers[i]; // find out if we are allowed try to recognize the input for this one.
              // 1.   allow if the session is NOT forced stopped (see the .stop() method)
              // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
              //      that is being recognized.
              // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
              //      this can be setup with the `recognizeWith()` method on the recognizer.

              if (session.stopped !== FORCED_STOP && ( // 1
              !curRecognizer || recognizer == curRecognizer || // 2
              recognizer.canRecognizeWith(curRecognizer))) {
                // 3
                recognizer.recognize(inputData);
              } else {
                recognizer.reset();
              } // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
              // current active recognizer. but only if we don't already have an active recognizer


              if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
              }

              i++;
            }
          },

          /**
           * get a recognizer by its event name.
           * @param {Recognizer|String} recognizer
           * @returns {Recognizer|Null}
           */
          get: function (recognizer) {
            if (recognizer instanceof Recognizer) {
              return recognizer;
            }

            var recognizers = this.recognizers;

            for (var i = 0; i < recognizers.length; i++) {
              if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
              }
            }

            return null;
          },

          /**
           * add a recognizer to the manager
           * existing recognizers with the same event name will be removed
           * @param {Recognizer} recognizer
           * @returns {Recognizer|Manager}
           */
          add: function (recognizer) {
            if (invokeArrayArg(recognizer, 'add', this)) {
              return this;
            } // remove existing


            var existing = this.get(recognizer.options.event);

            if (existing) {
              this.remove(existing);
            }

            this.recognizers.push(recognizer);
            recognizer.manager = this;
            this.touchAction.update();
            return recognizer;
          },

          /**
           * remove a recognizer by name or instance
           * @param {Recognizer|String} recognizer
           * @returns {Manager}
           */
          remove: function (recognizer) {
            if (invokeArrayArg(recognizer, 'remove', this)) {
              return this;
            }

            recognizer = this.get(recognizer); // let's make sure this recognizer exists

            if (recognizer) {
              var recognizers = this.recognizers;
              var index = inArray(recognizers, recognizer);

              if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
              }
            }

            return this;
          },

          /**
           * bind event
           * @param {String} events
           * @param {Function} handler
           * @returns {EventEmitter} this
           */
          on: function (events, handler) {
            if (events === undefined$1) {
              return;
            }

            if (handler === undefined$1) {
              return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function (event) {
              handlers[event] = handlers[event] || [];
              handlers[event].push(handler);
            });
            return this;
          },

          /**
           * unbind event, leave emit blank to remove all handlers
           * @param {String} events
           * @param {Function} [handler]
           * @returns {EventEmitter} this
           */
          off: function (events, handler) {
            if (events === undefined$1) {
              return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function (event) {
              if (!handler) {
                delete handlers[event];
              } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
              }
            });
            return this;
          },

          /**
           * emit event to the listeners
           * @param {String} event
           * @param {Object} data
           */
          emit: function (event, data) {
            // we also want to trigger dom events
            if (this.options.domEvents) {
              triggerDomEvent(event, data);
            } // no handlers, so skip it all


            var handlers = this.handlers[event] && this.handlers[event].slice();

            if (!handlers || !handlers.length) {
              return;
            }

            data.type = event;

            data.preventDefault = function () {
              data.srcEvent.preventDefault();
            };

            var i = 0;

            while (i < handlers.length) {
              handlers[i](data);
              i++;
            }
          },

          /**
           * destroy the manager and unbinds all events
           * it doesn't unbind dom events, that is the user own responsibility
           */
          destroy: function () {
            this.element && toggleCssProps(this, false);
            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null;
          }
        };
        /**
         * add/remove the css properties as defined in manager.options.cssProps
         * @param {Manager} manager
         * @param {Boolean} add
         */

        function toggleCssProps(manager, add) {
          var element = manager.element;

          if (!element.style) {
            return;
          }

          var prop;
          each(manager.options.cssProps, function (value, name) {
            prop = prefixed(element.style, name);

            if (add) {
              manager.oldCssProps[prop] = element.style[prop];
              element.style[prop] = value;
            } else {
              element.style[prop] = manager.oldCssProps[prop] || '';
            }
          });

          if (!add) {
            manager.oldCssProps = {};
          }
        }
        /**
         * trigger dom event
         * @param {String} event
         * @param {Object} data
         */


        function triggerDomEvent(event, data) {
          var gestureEvent = document.createEvent('Event');
          gestureEvent.initEvent(event, true, true);
          gestureEvent.gesture = data;
          data.target.dispatchEvent(gestureEvent);
        }

        assign(Hammer, {
          INPUT_START: INPUT_START,
          INPUT_MOVE: INPUT_MOVE,
          INPUT_END: INPUT_END,
          INPUT_CANCEL: INPUT_CANCEL,
          STATE_POSSIBLE: STATE_POSSIBLE,
          STATE_BEGAN: STATE_BEGAN,
          STATE_CHANGED: STATE_CHANGED,
          STATE_ENDED: STATE_ENDED,
          STATE_RECOGNIZED: STATE_RECOGNIZED,
          STATE_CANCELLED: STATE_CANCELLED,
          STATE_FAILED: STATE_FAILED,
          DIRECTION_NONE: DIRECTION_NONE,
          DIRECTION_LEFT: DIRECTION_LEFT,
          DIRECTION_RIGHT: DIRECTION_RIGHT,
          DIRECTION_UP: DIRECTION_UP,
          DIRECTION_DOWN: DIRECTION_DOWN,
          DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
          DIRECTION_VERTICAL: DIRECTION_VERTICAL,
          DIRECTION_ALL: DIRECTION_ALL,
          Manager: Manager,
          Input: Input,
          TouchAction: TouchAction,
          TouchInput: TouchInput,
          MouseInput: MouseInput,
          PointerEventInput: PointerEventInput,
          TouchMouseInput: TouchMouseInput,
          SingleTouchInput: SingleTouchInput,
          Recognizer: Recognizer,
          AttrRecognizer: AttrRecognizer,
          Tap: TapRecognizer,
          Pan: PanRecognizer,
          Swipe: SwipeRecognizer,
          Pinch: PinchRecognizer,
          Rotate: RotateRecognizer,
          Press: PressRecognizer,
          on: addEventListeners,
          off: removeEventListeners,
          each: each,
          merge: merge,
          extend: extend,
          assign: assign,
          inherit: inherit,
          bindFn: bindFn,
          prefixed: prefixed
        }); // this prevents errors when Hammer is loaded in the presence of an AMD
        //  style loader but by script tag, not by the loader.

        var freeGlobal = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}; // jshint ignore:line

        freeGlobal.Hammer = Hammer;

        if (typeof undefined$1 === 'function' && undefined$1.amd) {
          undefined$1(function () {
            return Hammer;
          });
        } else if ( module.exports) {
          module.exports = Hammer;
        } else {
          window[exportName] = Hammer;
        }
      })(window, document, 'Hammer');
    });

    // #endif
  Chart._Interactions = {};;

    Chart.registerInteraction = function (type, constructor) {
      Chart._Interactions[type] = constructor;
    };

    Chart.getInteraction = function (type) {
      return Chart._Interactions[type];
    };

    Chart.prototype.interaction = function (type, cfg) {
      var interactions = this._interactions || {};

      if (interactions[type]) {
        // if reprated, destroy last
        interactions[type].destroy();
      }

      var Ctor = Chart.getInteraction(type);
      var interact = new Ctor(cfg, this);
      interactions[type] = interact;
      this._interactions = interactions;
      return this;
    };

    Chart.prototype.clearInteraction = function (type) {
      var interactions = this._interactions;
      if (!interactions) return;

      if (type) {
        interactions[type] && interactions[type].destroy();
        delete interactions[type];
      } else {
        each(interactions, function (interaction, key) {
          interaction.destroy();
          delete interactions[key];
        });
      }

      return this;
    };

    var Hammer;

    if (!isWx && !isMy) {
      Hammer = hammer;
    }

    var TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend'];

    var Interaction = /*#__PURE__*/function () {
      var _proto = Interaction.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        return {
          startEvent: TOUCH_EVENTS[0],
          processEvent: TOUCH_EVENTS[1],
          endEvent: TOUCH_EVENTS[2],
          resetEvent: null
        };
      };

      // override
      _proto.start = function start() {} // override
      ;

      _proto.process = function process() {} // override
      ;

      _proto.end = function end() {} // override
      ;

      _proto.reset = function reset() {};

      function Interaction(cfg, chart) {
        var _this = this;

        _defineProperty(this, "_start", function (ev) {
          _this.preStart && _this.preStart(ev);

          _this.start(ev);

          _this.onStart && _this.onStart(ev);
        });

        _defineProperty(this, "_process", function (ev) {
          _this.preProcess && _this.preProcess(ev);

          _this.process(ev);

          _this.onProcess && _this.onProcess(ev);
        });

        _defineProperty(this, "_end", function (ev) {
          _this.preEnd && _this.preEnd(ev);

          _this.end(ev);

          _this.onEnd && _this.onEnd(ev);
        });

        _defineProperty(this, "_reset", function (ev) {
          _this.preReset && _this.preReset(ev);

          _this.reset(ev);

          _this.onReset && _this.onReset(ev);
        });

        var defaultCfg = this.getDefaultCfg();
        deepMix(this, defaultCfg, cfg);
        this.chart = chart;
        this.canvas = chart.get('canvas');
        this.el = chart.get('canvas').get('el');

        this._bindEvents();
      }

      _proto._bindEvents = function _bindEvents() {
        this._clearEvents(); // clear events


        var startEvent = this.startEvent,
            processEvent = this.processEvent,
            endEvent = this.endEvent,
            resetEvent = this.resetEvent,
            el = this.el;

        if (Hammer) {
          this.hammer = new Hammer(el);
        }

        this._bindEvent(startEvent, this._start);

        this._bindEvent(processEvent, this._process);

        this._bindEvent(endEvent, this._end);

        this._bindEvent(resetEvent, this._reset);
      };

      _proto._clearEvents = function _clearEvents() {
        var startEvent = this.startEvent,
            processEvent = this.processEvent,
            endEvent = this.endEvent,
            resetEvent = this.resetEvent;

        if (this.hammer) {
          this.hammer.destroy();
          this.hammer = null;
        }

        this._clearTouchEvent(startEvent, this._start);

        this._clearTouchEvent(processEvent, this._process);

        this._clearTouchEvent(endEvent, this._end);

        this._clearTouchEvent(resetEvent, this._reset);
      };

      _proto._bindEvent = function _bindEvent(eventName, method) {
        var el = this.el;

        if (eventName) {
          if (TOUCH_EVENTS.indexOf(eventName) !== -1) {
            addEventListener(el, eventName, method);
          } else if (this.hammer) {
            this.hammer.on(eventName, method);
          }
        }
      };

      _proto._clearTouchEvent = function _clearTouchEvent(eventName, method) {
        var el = this.el;

        if (eventName && TOUCH_EVENTS.indexOf(eventName) !== -1) {
          removeEventListener(el, eventName, method);
        }
      };

      _proto.destroy = function destroy() {
        this._clearEvents();
      };

      return Interaction;
    }();

    var PieSelect = /*#__PURE__*/function (_Interaction) {
      _inheritsLoose(PieSelect, _Interaction);

      var _proto = PieSelect.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var defaultCfg = _Interaction.prototype.getDefaultCfg.call(this);

        defaultCfg = mix({}, defaultCfg, {
          startEvent: 'tap',
          processEvent: null,
          animate: false,
          offset: 1,
          appendRadius: 8,
          style: {
            fillOpacity: 0.5
          },
          cancelable: true,
          defaultSelected: null // set the default selected shape

        });

        if (isWx || isMy) {
          // 小程序
          defaultCfg.startEvent = 'touchstart';
          defaultCfg.endEvent = 'touchend';
        }

        return defaultCfg;
      };

      function PieSelect(cfg, chart) {
        var _this;

        _this = _Interaction.call(this, cfg, chart) || this;

        var self = _assertThisInitialized(_this);

        chart.registerPlugins({
          clearInner: function clearInner() {
            self.halo && self.halo.remove(true);
            self.selected = false;
            self.selectedShape = null;
            self.lastShape = null;
            self.halo = null;
            self.defaultSelected = null;
          }
        });
        var defaultSelected = self.defaultSelected;

        if (isObject(defaultSelected)) {
          var selectedShape = self._getSelectedShapeByData(defaultSelected);

          selectedShape && self._selectedShape(selectedShape);

          _this.canvas.draw();
        }

        return _this;
      }

      _proto._getSelectedShapeByData = function _getSelectedShapeByData(data) {
        var selectedShape = null;
        var chart = this.chart;
        var geom = chart.get('geoms')[0];
        var container = geom.get('container');
        var children = container.get('children');
        each(children, function (child) {
          if (child.get('isShape') && child.get('className') === geom.get('type')) {
            // get geometry's shape
            var shapeData = child.get('origin')._origin;

            if (isObjectValueEqual(shapeData, data)) {
              selectedShape = child;
              return false;
            }
          }
        });
        return selectedShape;
      };

      _proto._selectedShape = function _selectedShape(selectedShape) {
        var offset = this.offset,
            style = this.style,
            appendRadius = this.appendRadius,
            chart = this.chart;
        this.lastShape = selectedShape;
        var _selectedShape$_attrs = selectedShape._attrs.attrs,
            x = _selectedShape$_attrs.x,
            y = _selectedShape$_attrs.y,
            startAngle = _selectedShape$_attrs.startAngle,
            endAngle = _selectedShape$_attrs.endAngle,
            r = _selectedShape$_attrs.r,
            fill = _selectedShape$_attrs.fill;
        var frontPlot = chart.get('frontPlot');
        var halo = frontPlot.addShape('sector', {
          attrs: mix({
            x: x,
            y: y,
            r: r + offset + appendRadius,
            r0: r + offset,
            fill: fill,
            startAngle: startAngle,
            endAngle: endAngle
          }, style)
        });
        this.halo = halo;
        var animate = this.animate;

        if (animate) {
          if (animate === true) {
            animate = {
              duration: 300
            };
          }

          halo.attr('r', r + offset);
          halo.animate().to(mix({
            attrs: {
              r: r + offset + appendRadius
            }
          }, animate));
        }
      };

      _proto.start = function start(ev) {
        var chart = this.chart;

        if (ev.type === 'tap') {
          ev.clientX = ev.center.x;
          ev.clientY = ev.center.y;
        }

        var _createEvent = createEvent(ev, chart),
            x = _createEvent.x,
            y = _createEvent.y;

        var records = chart.getSnapRecords({
          x: x,
          y: y
        });

        if (!records.length) {
          this.selected = false;
          this.selectedShape = null;
          return;
        }

        var data = records[0]._origin;

        var selectedShape = this._getSelectedShapeByData(data);

        var lastShape = this.lastShape;
        this.selectedShape = selectedShape;
        this.selected = true;

        if (selectedShape === lastShape) {
          if (!this.cancelable) {
            return;
          }

          this.halo && this.halo.remove(true);
          this.lastShape = null;
          this.selected = false;
        } else {
          this.halo && this.halo.remove(true);

          this._selectedShape(selectedShape);
        }

        this.canvas.draw();
      };

      _proto.end = function end(ev) {
        var selectedShape = this.selectedShape;

        if (selectedShape && !selectedShape.get('destroyed')) {
          ev.data = selectedShape.get('origin')._origin;
          ev.shapeInfo = selectedShape.get('origin');
          ev.shape = selectedShape;
          ev.selected = !!this.selected;
        }
      };

      return PieSelect;
    }(Interaction);

    Chart.registerInteraction('pie-select', PieSelect);

    var IntervalSelect = /*#__PURE__*/function (_Interaction) {
      _inheritsLoose(IntervalSelect, _Interaction);

      var _proto = IntervalSelect.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var defaultCfg = _Interaction.prototype.getDefaultCfg.call(this);

        defaultCfg = mix({}, defaultCfg, {
          startEvent: 'tap',
          processEvent: null,
          selectAxis: true,
          selectAxisStyle: {
            fontWeight: 'bold'
          },
          mode: 'shape',
          selectStyle: {
            fillOpacity: 1
          },
          unSelectStyle: {
            fillOpacity: 0.4
          },
          cancelable: true,
          defaultSelected: null // set the default selected shape

        });

        if (isWx || isMy) {
          // 小程序
          defaultCfg.startEvent = 'touchstart';
          defaultCfg.endEvent = 'touchend';
        }

        return defaultCfg;
      };

      function IntervalSelect(cfg, chart) {
        var _this;

        _this = _Interaction.call(this, cfg, chart) || this;
        var defaultSelected = _this.defaultSelected;

        if (isObject(defaultSelected)) {
          var _this$_selectShapesBy = _this._selectShapesByData(defaultSelected),
              selectedShape = _this$_selectShapesBy.selectedShape,
              unSelectedShapes = _this$_selectShapesBy.unSelectedShapes;

          selectedShape && _this._selectShapes(selectedShape, unSelectedShapes);
          _this.selectedShape = selectedShape;
        }

        return _this;
      }

      _proto._getIntervalShapes = function _getIntervalShapes() {
        var children = [];
        var chart = this.chart;
        var geoms = chart.get('geoms');
        geoms.forEach(function (geom) {
          if (geom.get('type') === 'interval') {
            // only works for Interval geometry type
            var container = geom.get('container');
            children = children.concat(container.get('children'));
          }
        });
        return children;
      };

      _proto._resetShape = function _resetShape(shape) {
        var originAttrs = shape.get('_originAttrs');

        if (originAttrs) {
          shape._attrs.attrs = originAttrs;
          shape.set('_originAttrs', null);
        }
      };

      _proto._setEventData = function _setEventData(ev) {
        var selectedShape = this.selectedShape;

        if (selectedShape && !selectedShape.get('destroyed')) {
          ev.data = selectedShape.get('origin')._origin;
          ev.shapeInfo = selectedShape.get('origin');
          ev.shape = selectedShape;
          ev.selected = !!selectedShape.get('_selected');
        }
      };

      _proto._selectShapesByData = function _selectShapesByData(data) {
        var children = this._getIntervalShapes();

        var selectedShape = null;
        var unSelectedShapes = [];
        each(children, function (child) {
          if (child.get('isShape') && child.get('className') === 'interval') {
            // get geometry's shape
            var shapeData = child.get('origin')._origin;

            if (isObjectValueEqual(shapeData, data)) {
              selectedShape = child;
            } else {
              unSelectedShapes.push(child);
            }
          }
        });
        return {
          selectedShape: selectedShape,
          unSelectedShapes: unSelectedShapes
        };
      };

      _proto._selectShapes = function _selectShapes(selectedShape, unSelectedShapes) {
        var selectStyle = this.selectStyle,
            unSelectStyle = this.unSelectStyle,
            selectAxisStyle = this.selectAxisStyle,
            chart = this.chart;

        if (!selectedShape.get('_originAttrs')) {
          var originAttrs = Object.assign({}, selectedShape.attr());
          selectedShape.set('_originAttrs', originAttrs);
        }

        selectedShape.attr(selectStyle);
        each(unSelectedShapes, function (child) {
          if (!child.get('_originAttrs')) {
            var _originAttrs = Object.assign({}, child.attr());

            child.set('_originAttrs', _originAttrs);
          } else {
            child.attr(child.get('_originAttrs'));
          }

          child.set('_selected', false);
          unSelectStyle && child.attr(unSelectStyle);
        });
        selectedShape.set('_selected', true);

        if (this.selectAxis) {
          if (this.selectedAxisShape) {
            this._resetShape(this.selectedAxisShape);
          }

          var xScale = chart.getXScale();

          var origin = selectedShape.get('origin')._origin;

          var _chart$get = chart.get('axisController'),
              frontPlot = _chart$get.frontPlot,
              backPlot = _chart$get.backPlot;

          var axisShape;
          each(frontPlot.get('children').concat(backPlot.get('children')), function (s) {
            if (s.get('value') === xScale.scale(origin[xScale.field])) {
              axisShape = s;
              return false;
            }
          });
          this.selectedAxisShape = axisShape;
          axisShape.set('_originAttrs', Object.assign({}, axisShape.attr()));
          axisShape.attr(selectAxisStyle);
        }

        this.canvas.draw();
      };

      _proto.reset = function reset() {
        var self = this;

        if (!self.selectedShape) {
          return;
        }

        var children = self._getIntervalShapes();

        each(children, function (child) {
          self._resetShape(child);

          child.set('_selected', false);
        });

        if (self.selectedAxisShape) {
          self._resetShape(self.selectedAxisShape);
        }

        self.canvas.draw();
        self.selectedShape = null;
        self.selectedAxisShape = null;
      };

      _proto.start = function start(ev) {
        var chart = this.chart;

        if (ev.type === 'tap') {
          ev.clientX = ev.center.x;
          ev.clientY = ev.center.y;
        }

        var _createEvent = createEvent(ev, chart),
            x = _createEvent.x,
            y = _createEvent.y;

        var mode = this.mode;

        var children = this._getIntervalShapes();

        var selectedShape;
        var unSelectedShapes = [];

        if (mode === 'shape') {
          var plot = chart.get('plotRange');

          if (!isPointInPlot({
            x: x,
            y: y
          }, plot)) {
            this.reset();
            return;
          }

          each(children, function (child) {
            var box = child.getBBox();

            if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.height + box.y) {
              // inbox
              selectedShape = child;
            } else {
              unSelectedShapes.push(child);
            }
          });
        } else if (mode === 'range') {
          var records = chart.getSnapRecords({
            x: x,
            y: y
          });

          if (!records.length) {
            this.reset();
            return;
          }

          var data = records[0]._origin;

          var result = this._selectShapesByData(data);

          selectedShape = result.selectedShape;
          unSelectedShapes = result.unSelectedShapes;
        }

        if (selectedShape) {
          this.selectedShape = selectedShape;

          if (selectedShape.get('_selected')) {
            if (!this.cancelable) {
              this._setEventData(ev);

              return;
            }

            this.reset();
          } else {
            this._selectShapes(selectedShape, unSelectedShapes);
          }
        } else {
          this.reset();
        }

        this._setEventData(ev);
      };

      _proto.end = function end(ev) {
        this._setEventData(ev);
      };

      return IntervalSelect;
    }(Interaction);

    Chart.registerInteraction('interval-select', IntervalSelect);

    /**
     * filter the data out of scale' range
     */

    function beforeGeomInit(chart) {
      chart.set('limitInPlot', true);
      var data = chart.get('filteredData');
      var colDefs = chart.get('colDefs');
      if (!colDefs) return data;
      var geoms = chart.get('geoms');
      var isSpecialGeom = false; // TODO

      each(geoms, function (geom) {
        if (['area', 'line', 'path'].indexOf(geom.get('type')) !== -1) {
          isSpecialGeom = true;
          return false;
        }
      });
      var fields = [];
      each(colDefs, function (def, key) {
        if (!isSpecialGeom && def && (def.values || def.min || def.max)) {
          fields.push(key);
        }
      });

      if (fields.length === 0) {
        return data;
      }

      var geomData = [];
      each(data, function (obj) {
        var flag = true;
        each(fields, function (field) {
          var value = obj[field];

          if (value) {
            var colDef = colDefs[field];

            if (colDef.type === 'timeCat') {
              var values = colDef.values;

              if (isNumber(values[0])) {
                value = toTimeStamp(value);
              }
            }

            if (colDef.values && colDef.values.indexOf(value) === -1 || colDef.min && value < colDef.min || colDef.max && value > colDef.max) {
              flag = false;
            }
          }
        });

        if (flag) {
          geomData.push(obj);
        }
      });
      chart.set('filteredData', geomData);
    }

    var FilterPlugin = /*#__PURE__*/Object.freeze({
        __proto__: null,
        beforeGeomInit: beforeGeomInit
    });

    var TOUCH_EVENTS$1 = ['touchstart', 'touchmove', 'touchend', 'touchStart', 'touchMove', 'touchEnd'];
    var DAY_TIMESTAMPS = 86400000;

    function _handleMove(e) {
      if (e.type === 'swipe' && e.deltaTime > 350) {
        // 区分 pan 操作和 swipe 操作
        return null;
      }

      var currentDeltaX = this.currentDeltaX,
          currentDeltaY = this.currentDeltaY,
          lastPoint = this.lastPoint;
      var deltaX;
      var deltaY;

      if (TOUCH_EVENTS$1.indexOf(e.type) !== -1) {
        // support touch and miniprogram
        var currentPoint = e.touches[0];
        deltaX = currentPoint.x - lastPoint.x;
        deltaY = currentPoint.y - lastPoint.y;
        this.lastPoint = currentPoint;
      } else if (currentDeltaX !== null && currentDeltaY !== null) {
        deltaX = e.deltaX - currentDeltaX;
        deltaY = e.deltaY - currentDeltaY;
        this.currentDeltaX = e.deltaX;
        this.currentDeltaY = e.deltaY;
      }

      if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
        var lastTimestamp = this._timestamp;
        var now = +new Date();

        if (now - lastTimestamp > 16) {
          this._doMove(deltaX, deltaY);

          this._timestamp = now;
        }
      }
    }

    function _doMove(deltaX, deltaY) {
      var self = this;
      var mode = self.mode,
          chart = self.chart,
          limitRange = self.limitRange;
      var coord = chart.get('coord');
      var start = coord.start,
          end = coord.end;
      var data = chart.get('data');

      if (directionEnabled(mode, 'x') && deltaX !== 0) {
        var xScale = chart.getXScale();
        var xField = xScale.field;

        if (!limitRange[xField]) {
          limitRange[xField] = getLimitRange(data, xScale);
        }

        var coordWidth = end.x - start.x;

        if (xScale.isCategory) {
          self._handleCatScale(xScale, deltaX, coordWidth);
        } else if (xScale.isLinear) {
          self._handleLinearScale(xScale, deltaX, coordWidth, 'x');
        }

        self.xRange = getFieldRange(xScale, limitRange[xField], xScale.type);
      }

      if (directionEnabled(mode, 'y') && deltaY !== 0) {
        var coordHeight = start.y - end.y;
        var yScales = chart.getYScales();
        each(yScales, function (yScale) {
          var yField = yScale.field;

          if (!limitRange[yField]) {
            limitRange[yField] = getLimitRange(data, yScale);
          }

          yScale.isLinear && self._handleLinearScale(yScale, deltaY, coordHeight, 'y');
        });
        var scale = yScales[0];
        self.yRange = getFieldRange(scale, limitRange[scale.field], scale.type);
      }

      chart.repaint();
    }

    function _handleLinearScale(scale, delta, range, flag) {
      var field = scale.field,
          min = scale.min,
          max = scale.max;
      var limitRange = this.limitRange;
      if (min === limitRange[field].min && max === limitRange[field].max) return;
      var ratio = delta / range;
      var panValue = ratio * (max - min);
      var newMax = flag === 'x' ? max - panValue : max + panValue;
      var newMin = flag === 'x' ? min - panValue : min + panValue;

      if (limitRange[field] && !isNil(limitRange[field].min) && newMin <= limitRange[field].min) {
        newMin = limitRange[field].min;
        newMax = max - min + newMin;
      }

      if (limitRange[field] && !isNil(limitRange[field].max) && newMax >= limitRange[field].max) {
        newMax = limitRange[field].max;
        newMin = newMax - (max - min);
      }

      this.updateLinearScale(field, newMin, newMax);
    }

    function _handleCatScale(scale, delta, range) {
      var type = scale.type,
          field = scale.field,
          values = scale.values,
          ticks = scale.ticks,
          tickCount = scale.tickCount;
      var duplicateRemovalValues = uniq(values);
      var originValues = this.limitRange[field];
      var lastValueIndex = originValues.length - 1;
      var currentLength = duplicateRemovalValues.length;
      var speed = this.speed || 1;
      var step = range / (currentLength * speed);
      var firstIndex = originValues.indexOf(duplicateRemovalValues[0]);
      var lastIndex = originValues.indexOf(duplicateRemovalValues[currentLength - 1]);
      var minIndex = firstIndex;
      var maxIndex = lastIndex;
      var ratio = Math.abs(delta / range);
      var panStep = this.step || Math.max(1, parseInt(ratio * currentLength));
      this._panCumulativeDelta += delta;
      minIndex = this._panCumulativeDelta > step ? Math.max(0, minIndex - panStep) : this._panCumulativeDelta < -step ? Math.min(lastValueIndex - currentLength + 1, minIndex + panStep) : minIndex;
      maxIndex = Math.min(lastValueIndex, minIndex + currentLength - 1);

      if (minIndex === firstIndex && maxIndex === lastIndex) {
        return null;
      }

      var newValues = originValues.slice(minIndex, maxIndex + 1);
      var newTicks = null;

      if (type === 'timeCat') {
        var tickGap = ticks.length > 2 ? ticks[1] - ticks[0] : DAY_TIMESTAMPS;

        if (this._panCumulativeDelta > step) {
          for (var i = ticks[0] - tickGap; i >= newValues[0]; i -= tickGap) {
            ticks.unshift(i);
          }
        } else if (this._panCumulativeDelta < -step) {
          for (var _i = ticks[ticks.length - 1] + tickGap; _i <= newValues[newValues.length - 1]; _i += tickGap) {
            ticks.push(_i);
          }
        }

        newTicks = ticks;
      } else if (type === 'cat') {
        var catTicks = getTickMethod('cat');
        newTicks = catTicks({
          tickCount: tickCount,
          values: newValues
        });
      } else {
        // 保留之前的ticks
        newTicks = ticks;
      }

      this.updateCatScale(field, newValues, newTicks, originValues, minIndex, maxIndex);
      this._panCumulativeDelta = minIndex !== firstIndex ? 0 : this._panCumulativeDelta;
    }
    var MoveMixin = {
      _handleMove: _handleMove,
      _doMove: _doMove,
      _handleLinearScale: _handleLinearScale,
      _handleCatScale: _handleCatScale
    };

    function updateLinearScale(field, min, max) {
      var chart = this.chart;
      var scale = getScale(chart, field); // const colDef = Helper.getColDef(chart, field);
      // chart.scale(field, Util.mix({}, colDef, {
      //   min,
      //   max,
      //   nice: false
      // }));

      scale.change({
        min: min,
        max: max,
        nice: false
      });
    }

    function updateCatScale(field, newValues, ticks, values, minIndex, maxIndex) {
      var chart = this.chart; // const colDef = Helper.getColDef(chart, field);

      var scale = getScale(chart, field);
      scale.change({
        values: newValues,
        ticks: ticks,
        scale: function scale(value) {
          if (this.type === 'timeCat') {
            value = toTimeStamp(value);
          }

          var rangeMin = this.rangeMin();
          var rangeMax = this.rangeMax();
          var range = rangeMax - rangeMin;
          var min;
          var max;
          var percent;
          var currentIndex = values.indexOf(value); // 在完整数据集中的索引值

          if (currentIndex >= 0 && currentIndex < minIndex) {
            // 不在范围内，左侧数据
            max = rangeMin > 0 ? -0.1 : rangeMin - 0.1;
            min = max - range;
            percent = currentIndex / minIndex;
          } else if (currentIndex >= 0 && currentIndex > maxIndex) {
            // 不在范围内，右侧数据
            min = rangeMax < 1 ? 1.1 : rangeMax + 0.1;
            max = min + range;
            percent = (currentIndex - maxIndex - 1) / (values.length - 1 - maxIndex);
          } else {
            // 数值在当前 this.values 范围内
            var index = this.translate(value);

            if (this.values.length === 1) {
              percent = index;
            } else {
              percent = index / (this.values.length - 1);
            }

            min = rangeMin;
            max = rangeMax;
          }

          return min + percent * (max - min);
        },
        getTicks: function getTicks() {
          var self = this;
          var ticks = this.ticks;
          var rst = [];
          each(ticks, function (tick) {
            var obj;

            if (isObject(tick)) {
              obj = tick;
            } else {
              var value = self.scale(tick);
              value = value >= 0 && value <= 1 ? value : NaN;
              obj = {
                text: isString(tick) ? tick : self.getText(tick),
                value: value,
                tickValue: tick // 用于坐标轴上文本动画时确定前后帧的对应关系

              };
            }

            rst.push(obj);
          });
          return rst;
        }
      });
    }
    var UpdateScaleMixin = {
      updateLinearScale: updateLinearScale,
      updateCatScale: updateCatScale
    };

    var Swipe = /*#__PURE__*/function (_Interaction) {
      _inheritsLoose(Swipe, _Interaction);

      var _proto = Swipe.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var defaultCfg = _Interaction.prototype.getDefaultCfg.call(this);

        defaultCfg = mix({}, defaultCfg, {
          startEvent: 'touchstart',
          processEvent: 'swipe',
          endEvent: 'touchend',
          currentDeltaX: null,
          threshold: 10,
          // Minimal distance required before recognizing.
          velocity: 0.3,
          // Minimal velocity required before recognizing, unit is in px per ms.
          limitRange: {},
          _timestamp: 0,
          _panCumulativeDelta: 0,
          speed: 5
        });
        return defaultCfg;
      };

      function Swipe(cfg, chart) {
        var _this;

        _this = _Interaction.call(this, cfg, chart) || this;

        var self = _assertThisInitialized(_this);

        var hammer = self.hammer,
            threshold = self.threshold,
            velocity = self.velocity;

        if (hammer) {
          hammer.get('swipe').set({
            direction: 6,
            // only support horizontal
            threshold: threshold,
            velocity: velocity
          });
        }

        chart.registerPlugins([FilterPlugin, {
          changeData: function changeData() {
            self.limitRange = {};
          },
          clear: function clear() {
            self.limitRange = {};
          }
        }]);
        self.mode = 'x';
        mix(self, UpdateScaleMixin, MoveMixin);
        return _this;
      }

      _proto.process = function process(e) {
        this.currentDeltaX = 0;

        this._handleMove(e);
      };

      _proto.end = function end() {
        this.currentDeltaX = null;
        this._panCumulativeDelta = 0;
      };

      return Swipe;
    }(Interaction);

    Chart.registerInteraction('swipe', Swipe);

    var Pan = /*#__PURE__*/function (_Interaction) {
      _inheritsLoose(Pan, _Interaction);

      var _proto = Pan.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var defaultCfg = _Interaction.prototype.getDefaultCfg.call(this);

        defaultCfg = mix({}, defaultCfg, {
          startEvent: 'panstart',
          processEvent: 'panmove',
          endEvent: 'panend',
          resetEvent: 'touchend',
          mode: 'x',
          panThreshold: 10,
          // Minimal pan distance required before recognizing
          pressThreshold: 9,
          // Minimal movement that is allowed while pressing
          pressTime: 251,
          // Minimal press time in ms
          currentDeltaX: null,
          currentDeltaY: null,
          limitRange: {},
          _timestamp: 0,
          lastPoint: null,
          _panCumulativeDelta: 0,
          speed: 5
        });

        if (isWx || isMy) {
          // 小程序
          defaultCfg.startEvent = 'touchstart';
          defaultCfg.processEvent = 'touchmove';
          defaultCfg.endEvent = 'touchend';
        }

        return defaultCfg;
      };

      function Pan(cfg, chart) {
        var _this;

        _this = _Interaction.call(this, cfg, chart) || this;

        var self = _assertThisInitialized(_this);

        var hammer = self.hammer,
            panThreshold = self.panThreshold;
        chart.set('limitInPlot', true);

        if (hammer) {
          hammer.get('pan').set({
            threshold: panThreshold
          }); // 为了兼容hammer的pan 和 tooltips里的press, 后面去hammerjs的时候需要去掉

          chart.get('canvas').on('pan', function () {});
        } // chart.registerPlugins([ FilterPlugin, {
        //   changeData() {
        //     self.limitRange = {};
        //   },
        //   clear() {
        //     self.limitRange = {};
        //   }
        // }]);


        mix(_assertThisInitialized(_this), UpdateScaleMixin, MoveMixin);
        return _this;
      }

      _proto.start = function start(e) {
        if (this.pressed) return;
        this.currentDeltaX = 0;
        this.currentDeltaY = 0;

        if (e.type === 'touchstart' || e.type === 'touchStart') {
          this.lastPoint = e.touches[0];
        }

        this._handleMove(e);
      };

      _proto.process = function process(e) {
        if (this.pressed) return;

        this._handleMove(e);
      };

      _proto.end = function end() {
        if (this.pressed) return;
        this.currentDeltaX = null;
        this.currentDeltaY = null;
        this.lastPoint = null;
        this._panCumulativeDelta = 0;
      };

      return Pan;
    }(Interaction);

    Chart.registerInteraction('pan', Pan);

    var Pinch = /*#__PURE__*/function (_Interaction) {
      _inheritsLoose(Pinch, _Interaction);

      var _proto = Pinch.prototype;

      _proto.getDefaultCfg = function getDefaultCfg() {
        var defaultCfg = _Interaction.prototype.getDefaultCfg.call(this);

        return mix({}, defaultCfg, {
          startEvent: 'pinchstart',
          processEvent: 'pinch',
          endEvent: 'pinchend',
          resetEvent: 'touchend',
          pressThreshold: 9,
          // Minimal movement that is allowed while pressing
          pressTime: 251,
          // Minimal press time in ms
          mode: 'x',
          currentPinchScaling: null,
          originValues: null,
          minScale: null,
          maxScale: null,
          limitRange: {},
          sensitivity: 1,
          _pinchCumulativeDelta: 0,
          _timestamp: 0
        });
      };

      function Pinch(cfg, chart) {
        var _this;

        _this = _Interaction.call(this, cfg, chart) || this;

        var self = _assertThisInitialized(_this);

        var hammer = self.hammer;
        hammer.get('pinch').set({
          // open pinch recognizer
          enable: true
        });
        chart.registerPlugins([FilterPlugin, {
          changeData: function changeData() {
            self.limitRange = {};
            self.originTicks = null;
          },
          clear: function clear() {
            self.limitRange = {};
            self.originTicks = null;
          }
        }]);
        mix(self, UpdateScaleMixin);
        return _this;
      }

      _proto.start = function start() {
        if (this.pressed) return;
        this.currentPinchScaling = 1;
      };

      _proto.process = function process(e) {
        if (this.pressed) return;

        this._handlePinch(e);
      };

      _proto.end = function end(e) {
        if (this.pressed) return;

        this._handlePinch(e);

        this.currentPinchScaling = null; // reset

        this.pinchCumulativeDelta = 0;
      };

      _proto._handlePinch = function _handlePinch(e) {
        var currentPinchScaling = this.currentPinchScaling;
        var diff = 1 / currentPinchScaling * e.scale;
        var rect = e.target.getBoundingClientRect();
        var offsetX = e.center.x - rect.left;
        var offsetY = e.center.y - rect.top;
        var center = {
          x: offsetX,
          y: offsetY
        }; // fingers position difference

        var x = Math.abs(e.pointers[0].clientX - e.pointers[1].clientX);
        var y = Math.abs(e.pointers[0].clientY - e.pointers[1].clientY); // diagonal fingers will change both (xy) axes

        var p = x / y;
        var xy;

        if (p > 0.3 && p < 1.7) {
          xy = 'xy';
        } else if (x > y) {
          xy = 'x';
        } else {
          xy = 'y';
        }

        var lastTimestamp = this._timestamp;
        var now = +new Date();

        if (now - lastTimestamp > 16) {
          this._doZoom(diff, center, xy);

          this._timestamp = now;
        } // Keep track of overall scale


        this.currentPinchScaling = e.scale;
      };

      _proto._doZoom = function _doZoom(diff, center, whichAxes) {
        var self = this;
        var mode = self.mode,
            chart = self.chart,
            limitRange = self.limitRange; // Which axe should be modified when figers were used.

        var _whichAxes;

        if (mode === 'xy' && whichAxes !== undefined) {
          // based on fingers positions
          _whichAxes = whichAxes;
        } else {
          _whichAxes = 'xy';
        }

        var data = chart.get('data');

        if (directionEnabled(mode, 'x') && directionEnabled(_whichAxes, 'x')) {
          // x
          var xScale = chart.getXScale();
          var xField = xScale.field;

          if (!limitRange[xField]) {
            limitRange[xField] = getLimitRange(data, xScale);
          }

          if (xScale.isCategory) {
            // 横轴为分类类型
            self._zoomCatScale(xScale, diff, center);
          } else if (xScale.isLinear) {
            self._zoomLinearScale(xScale, diff, center, 'x');
          }

          this.xRange = getFieldRange(xScale, limitRange[xField], xScale.type);
        }

        if (directionEnabled(mode, 'y') && directionEnabled(_whichAxes, 'y')) {
          // y
          var yScales = chart.getYScales();
          each(yScales, function (yScale) {
            var yField = yScale.field;

            if (!limitRange[yField]) {
              limitRange[yField] = getLimitRange(data, yScale);
            }

            yScale.isLinear && self._zoomLinearScale(yScale, diff, center, 'y');
          });
          var scale = yScales[0];
          this.yRange = getFieldRange(scale, limitRange[scale.field], scale.type);
        }

        chart.repaint();
      };

      _proto._zoomLinearScale = function _zoomLinearScale(scale, zoom, center, flag) {
        var chart = this.chart;
        var min = scale.min,
            max = scale.max,
            field = scale.field;
        var valueRange = max - min;
        var limitRange = this.limitRange;
        var originRange = limitRange[field].max - limitRange[field].min;
        var coord = chart.get('coord');
        var newDiff = valueRange * (zoom - 1);

        if (this.minScale && zoom < 1) {
          // zoom in
          var maxRange = originRange / this.minScale;
          newDiff = Math.max(valueRange - maxRange, newDiff);
        }

        if (this.maxScale && zoom >= 1) {
          // zoom out
          var minRange = originRange / this.maxScale;
          newDiff = Math.min(valueRange - minRange, newDiff);
        }

        var offsetPoint = coord.invertPoint(center);
        var percent = flag === 'x' ? offsetPoint.x : offsetPoint.y;
        var minDelta = newDiff * percent;
        var maxDelta = newDiff * (1 - percent);
        var newMax = max - maxDelta;
        var newMin = min + minDelta;
        this.updateLinearScale(field, newMin, newMax);
      } // 针对分类类型
      ;

      _proto._zoomCatScale = function _zoomCatScale(scale, zoom, center) {
        var pinchCumulativeDelta = this._pinchCumulativeDelta;
        var sensitivity = this.sensitivity;
        pinchCumulativeDelta = zoom > 1 ? pinchCumulativeDelta + 1 : pinchCumulativeDelta - 1;
        this._pinchCumulativeDelta = pinchCumulativeDelta;
        var field = scale.field,
            values = scale.values;
        var chart = this.chart;
        var coord = chart.get('coord');

        if (!this.originTicks) {
          this.originTicks = scale.ticks;
        }

        var originValues = this.limitRange[field];
        var originValuesLen = originValues.length;
        var minScale = this.minScale || 1;
        var maxScale = this.maxScale || 5;
        var minCount = parseInt(originValuesLen / maxScale);
        var maxCount = parseInt(originValuesLen / minScale);
        var currentLen = values.length;

        if (pinchCumulativeDelta > 0 && currentLen <= minCount) {
          return null;
        }

        if (pinchCumulativeDelta < 0 && currentLen >= maxCount) {
          return null;
        }

        var lastLabelIndex = originValuesLen - 1;
        var firstValue = values[0];
        var lastValue = values[currentLen - 1];
        var minIndex = originValues.indexOf(firstValue);
        var maxIndex = originValues.indexOf(lastValue);
        var chartCenter = (coord.start.x + coord.end.x) / 2;
        var centerPointer = center.x;

        if (Math.abs(pinchCumulativeDelta) > sensitivity) {
          var deltaCount = Math.max(1, parseInt(currentLen * Math.abs(zoom - 1)));

          if (pinchCumulativeDelta < 0) {
            if (centerPointer >= chartCenter) {
              if (minIndex <= 0) {
                maxIndex = Math.min(lastLabelIndex, maxIndex + deltaCount);
              } else {
                minIndex = Math.max(0, minIndex - deltaCount);
              }
            } else if (centerPointer < chartCenter) {
              if (maxIndex >= lastLabelIndex) {
                minIndex = Math.max(0, minIndex - deltaCount);
              } else {
                maxIndex = Math.min(lastLabelIndex, maxIndex + deltaCount);
              }
            }

            this._pinchCumulativeDelta = 0;
          } else if (pinchCumulativeDelta > 0) {
            if (centerPointer >= chartCenter) {
              minIndex = minIndex < maxIndex ? minIndex = Math.min(maxIndex, minIndex + deltaCount) : minIndex;
            } else if (centerPointer < chartCenter) {
              maxIndex = maxIndex > minIndex ? maxIndex = Math.max(minIndex, maxIndex - deltaCount) : maxIndex;
            }

            this._pinchCumulativeDelta = 0;
          }

          var newValues = originValues.slice(minIndex, maxIndex + 1);
          this.updateCatScale(field, newValues, this.originTicks, originValues, minIndex, maxIndex);
        }
      };

      return Pinch;
    }(Interaction);

    Chart.registerInteraction('pinch', Pinch);

    /**
     * all
     */

    Chart.plugins.register([Tooltip$1, Legend, Guide, Animation, ScrollBar, PieLabel, intervalLabel$1]);
    var indexAll = {
      Global: Global,
      Chart: Chart,
      Shape: Shape$1,
      G: G,
      Util: Util,
      Helper: Helper,
      track: track,
      Interaction: Interaction,
      Animate: Animate
    };

    exports.Animate = Animate;
    exports.Chart = Chart;
    exports.G = G;
    exports.Global = Global;
    exports.Helper = Helper;
    exports.Interaction = Interaction;
    exports.Shape = Shape$1;
    exports.Util = Util;
    exports.default = indexAll;
    exports.track = track;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

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

    var SHAPES = ['line', 'smooth', 'dash'];
    each(SHAPES, function (shapeType) {
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

    /**
     * Only support simple bar chart, line chart and pie chart
     */
    var indexSimple = {
      Global: Global,
      Chart: Chart,
      Shape: Shape$1,
      G: G,
      Util: Util,
      Helper: Helper,
      track: track
    };

    exports.Chart = Chart;
    exports.G = G;
    exports.Global = Global;
    exports.Helper = Helper;
    exports.Shape = Shape$1;
    exports.Util = Util;
    exports.default = indexSimple;
    exports.track = track;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
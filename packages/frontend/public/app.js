var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/eventemitter3@4.0.7/node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "../../node_modules/.pnpm/eventemitter3@4.0.7/node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context2, once) {
      this.fn = fn;
      this.context = context2;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context2, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context2 || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i2 = 0, l3 = handlers.length, ee = new Array(l3); i2 < l3; i2++) {
        ee[i2] = handlers[i2].fn;
      }
      return ee;
    };
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i2;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i2 = 1, args = new Array(len - 1); i2 < len; i2++) {
          args[i2 - 1] = arguments[i2];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j3;
        for (i2 = 0; i2 < length; i2++) {
          if (listeners[i2].once)
            this.removeListener(event, listeners[i2].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i2].fn.call(listeners[i2].context);
              break;
            case 2:
              listeners[i2].fn.call(listeners[i2].context, a1);
              break;
            case 3:
              listeners[i2].fn.call(listeners[i2].context, a1, a2);
              break;
            case 4:
              listeners[i2].fn.call(listeners[i2].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j3 = 1, args = new Array(len - 1); j3 < len; j3++) {
                  args[j3 - 1] = arguments[j3];
                }
              listeners[i2].fn.apply(listeners[i2].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter.prototype.on = function on(event, fn, context2) {
      return addListener(this, event, fn, context2, false);
    };
    EventEmitter.prototype.once = function once(event, fn, context2) {
      return addListener(this, event, fn, context2, true);
    };
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context2, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context2 || listeners.context === context2)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i2 = 0, events = [], length = listeners.length; i2 < length; i2++) {
          if (listeners[i2].fn !== fn || once && !listeners[i2].once || context2 && listeners[i2].context !== context2) {
            events.push(listeners[i2]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    EventEmitter.prefixed = prefix;
    EventEmitter.EventEmitter = EventEmitter;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter;
    }
  }
});

// ../../node_modules/.pnpm/earcut@2.2.4/node_modules/earcut/src/earcut.js
var require_earcut = __commonJS({
  "../../node_modules/.pnpm/earcut@2.2.4/node_modules/earcut/src/earcut.js"(exports, module) {
    "use strict";
    module.exports = earcut;
    module.exports.default = earcut;
    function earcut(data, holeIndices, dim) {
      dim = dim || 2;
      var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
      if (!outerNode || outerNode.next === outerNode.prev)
        return triangles;
      var minX, minY, maxX, maxY, x2, y2, invSize;
      if (hasHoles)
        outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
      if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];
        for (var i2 = dim; i2 < outerLen; i2 += dim) {
          x2 = data[i2];
          y2 = data[i2 + 1];
          if (x2 < minX)
            minX = x2;
          if (y2 < minY)
            minY = y2;
          if (x2 > maxX)
            maxX = x2;
          if (y2 > maxY)
            maxY = y2;
        }
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 32767 / invSize : 0;
      }
      earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
      return triangles;
    }
    function linkedList(data, start, end, dim, clockwise) {
      var i2, last;
      if (clockwise === signedArea(data, start, end, dim) > 0) {
        for (i2 = start; i2 < end; i2 += dim)
          last = insertNode(i2, data[i2], data[i2 + 1], last);
      } else {
        for (i2 = end - dim; i2 >= start; i2 -= dim)
          last = insertNode(i2, data[i2], data[i2 + 1], last);
      }
      if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
      }
      return last;
    }
    function filterPoints(start, end) {
      if (!start)
        return start;
      if (!end)
        end = start;
      var p3 = start, again;
      do {
        again = false;
        if (!p3.steiner && (equals(p3, p3.next) || area(p3.prev, p3, p3.next) === 0)) {
          removeNode(p3);
          p3 = end = p3.prev;
          if (p3 === p3.next)
            break;
          again = true;
        } else {
          p3 = p3.next;
        }
      } while (again || p3 !== end);
      return end;
    }
    function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
      if (!ear)
        return;
      if (!pass && invSize)
        indexCurve(ear, minX, minY, invSize);
      var stop = ear, prev, next;
      while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;
        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
          triangles.push(prev.i / dim | 0);
          triangles.push(ear.i / dim | 0);
          triangles.push(next.i / dim | 0);
          removeNode(ear);
          ear = next.next;
          stop = next.next;
          continue;
        }
        ear = next;
        if (ear === stop) {
          if (!pass) {
            earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
          } else if (pass === 1) {
            ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
            earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
          } else if (pass === 2) {
            splitEarcut(ear, triangles, dim, minX, minY, invSize);
          }
          break;
        }
      }
    }
    function isEar(ear) {
      var a2 = ear.prev, b3 = ear, c2 = ear.next;
      if (area(a2, b3, c2) >= 0)
        return false;
      var ax = a2.x, bx = b3.x, cx = c2.x, ay = a2.y, by = b3.y, cy = c2.y;
      var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
      var p3 = c2.next;
      while (p3 !== a2) {
        if (p3.x >= x0 && p3.x <= x1 && p3.y >= y0 && p3.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p3.x, p3.y) && area(p3.prev, p3, p3.next) >= 0)
          return false;
        p3 = p3.next;
      }
      return true;
    }
    function isEarHashed(ear, minX, minY, invSize) {
      var a2 = ear.prev, b3 = ear, c2 = ear.next;
      if (area(a2, b3, c2) >= 0)
        return false;
      var ax = a2.x, bx = b3.x, cx = c2.x, ay = a2.y, by = b3.y, cy = c2.y;
      var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
      var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
      var p3 = ear.prevZ, n2 = ear.nextZ;
      while (p3 && p3.z >= minZ && n2 && n2.z <= maxZ) {
        if (p3.x >= x0 && p3.x <= x1 && p3.y >= y0 && p3.y <= y1 && p3 !== a2 && p3 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, p3.x, p3.y) && area(p3.prev, p3, p3.next) >= 0)
          return false;
        p3 = p3.prevZ;
        if (n2.x >= x0 && n2.x <= x1 && n2.y >= y0 && n2.y <= y1 && n2 !== a2 && n2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, n2.x, n2.y) && area(n2.prev, n2, n2.next) >= 0)
          return false;
        n2 = n2.nextZ;
      }
      while (p3 && p3.z >= minZ) {
        if (p3.x >= x0 && p3.x <= x1 && p3.y >= y0 && p3.y <= y1 && p3 !== a2 && p3 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, p3.x, p3.y) && area(p3.prev, p3, p3.next) >= 0)
          return false;
        p3 = p3.prevZ;
      }
      while (n2 && n2.z <= maxZ) {
        if (n2.x >= x0 && n2.x <= x1 && n2.y >= y0 && n2.y <= y1 && n2 !== a2 && n2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, n2.x, n2.y) && area(n2.prev, n2, n2.next) >= 0)
          return false;
        n2 = n2.nextZ;
      }
      return true;
    }
    function cureLocalIntersections(start, triangles, dim) {
      var p3 = start;
      do {
        var a2 = p3.prev, b3 = p3.next.next;
        if (!equals(a2, b3) && intersects(a2, p3, p3.next, b3) && locallyInside(a2, b3) && locallyInside(b3, a2)) {
          triangles.push(a2.i / dim | 0);
          triangles.push(p3.i / dim | 0);
          triangles.push(b3.i / dim | 0);
          removeNode(p3);
          removeNode(p3.next);
          p3 = start = b3;
        }
        p3 = p3.next;
      } while (p3 !== start);
      return filterPoints(p3);
    }
    function splitEarcut(start, triangles, dim, minX, minY, invSize) {
      var a2 = start;
      do {
        var b3 = a2.next.next;
        while (b3 !== a2.prev) {
          if (a2.i !== b3.i && isValidDiagonal(a2, b3)) {
            var c2 = splitPolygon(a2, b3);
            a2 = filterPoints(a2, a2.next);
            c2 = filterPoints(c2, c2.next);
            earcutLinked(a2, triangles, dim, minX, minY, invSize, 0);
            earcutLinked(c2, triangles, dim, minX, minY, invSize, 0);
            return;
          }
          b3 = b3.next;
        }
        a2 = a2.next;
      } while (a2 !== start);
    }
    function eliminateHoles(data, holeIndices, outerNode, dim) {
      var queue = [], i2, len, start, end, list;
      for (i2 = 0, len = holeIndices.length; i2 < len; i2++) {
        start = holeIndices[i2] * dim;
        end = i2 < len - 1 ? holeIndices[i2 + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next)
          list.steiner = true;
        queue.push(getLeftmost(list));
      }
      queue.sort(compareX);
      for (i2 = 0; i2 < queue.length; i2++) {
        outerNode = eliminateHole(queue[i2], outerNode);
      }
      return outerNode;
    }
    function compareX(a2, b3) {
      return a2.x - b3.x;
    }
    function eliminateHole(hole, outerNode) {
      var bridge = findHoleBridge(hole, outerNode);
      if (!bridge) {
        return outerNode;
      }
      var bridgeReverse = splitPolygon(bridge, hole);
      filterPoints(bridgeReverse, bridgeReverse.next);
      return filterPoints(bridge, bridge.next);
    }
    function findHoleBridge(hole, outerNode) {
      var p3 = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m2;
      do {
        if (hy <= p3.y && hy >= p3.next.y && p3.next.y !== p3.y) {
          var x2 = p3.x + (hy - p3.y) * (p3.next.x - p3.x) / (p3.next.y - p3.y);
          if (x2 <= hx && x2 > qx) {
            qx = x2;
            m2 = p3.x < p3.next.x ? p3 : p3.next;
            if (x2 === hx)
              return m2;
          }
        }
        p3 = p3.next;
      } while (p3 !== outerNode);
      if (!m2)
        return null;
      var stop = m2, mx = m2.x, my = m2.y, tanMin = Infinity, tan;
      p3 = m2;
      do {
        if (hx >= p3.x && p3.x >= mx && hx !== p3.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p3.x, p3.y)) {
          tan = Math.abs(hy - p3.y) / (hx - p3.x);
          if (locallyInside(p3, hole) && (tan < tanMin || tan === tanMin && (p3.x > m2.x || p3.x === m2.x && sectorContainsSector(m2, p3)))) {
            m2 = p3;
            tanMin = tan;
          }
        }
        p3 = p3.next;
      } while (p3 !== stop);
      return m2;
    }
    function sectorContainsSector(m2, p3) {
      return area(m2.prev, m2, p3.prev) < 0 && area(p3.next, m2, m2.next) < 0;
    }
    function indexCurve(start, minX, minY, invSize) {
      var p3 = start;
      do {
        if (p3.z === 0)
          p3.z = zOrder(p3.x, p3.y, minX, minY, invSize);
        p3.prevZ = p3.prev;
        p3.nextZ = p3.next;
        p3 = p3.next;
      } while (p3 !== start);
      p3.prevZ.nextZ = null;
      p3.prevZ = null;
      sortLinked(p3);
    }
    function sortLinked(list) {
      var i2, p3, q2, e3, tail, numMerges, pSize, qSize, inSize = 1;
      do {
        p3 = list;
        list = null;
        tail = null;
        numMerges = 0;
        while (p3) {
          numMerges++;
          q2 = p3;
          pSize = 0;
          for (i2 = 0; i2 < inSize; i2++) {
            pSize++;
            q2 = q2.nextZ;
            if (!q2)
              break;
          }
          qSize = inSize;
          while (pSize > 0 || qSize > 0 && q2) {
            if (pSize !== 0 && (qSize === 0 || !q2 || p3.z <= q2.z)) {
              e3 = p3;
              p3 = p3.nextZ;
              pSize--;
            } else {
              e3 = q2;
              q2 = q2.nextZ;
              qSize--;
            }
            if (tail)
              tail.nextZ = e3;
            else
              list = e3;
            e3.prevZ = tail;
            tail = e3;
          }
          p3 = q2;
        }
        tail.nextZ = null;
        inSize *= 2;
      } while (numMerges > 1);
      return list;
    }
    function zOrder(x2, y2, minX, minY, invSize) {
      x2 = (x2 - minX) * invSize | 0;
      y2 = (y2 - minY) * invSize | 0;
      x2 = (x2 | x2 << 8) & 16711935;
      x2 = (x2 | x2 << 4) & 252645135;
      x2 = (x2 | x2 << 2) & 858993459;
      x2 = (x2 | x2 << 1) & 1431655765;
      y2 = (y2 | y2 << 8) & 16711935;
      y2 = (y2 | y2 << 4) & 252645135;
      y2 = (y2 | y2 << 2) & 858993459;
      y2 = (y2 | y2 << 1) & 1431655765;
      return x2 | y2 << 1;
    }
    function getLeftmost(start) {
      var p3 = start, leftmost = start;
      do {
        if (p3.x < leftmost.x || p3.x === leftmost.x && p3.y < leftmost.y)
          leftmost = p3;
        p3 = p3.next;
      } while (p3 !== start);
      return leftmost;
    }
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
      return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
    }
    function isValidDiagonal(a2, b3) {
      return a2.next.i !== b3.i && a2.prev.i !== b3.i && !intersectsPolygon(a2, b3) && // dones't intersect other edges
      (locallyInside(a2, b3) && locallyInside(b3, a2) && middleInside(a2, b3) && // locally visible
      (area(a2.prev, a2, b3.prev) || area(a2, b3.prev, b3)) || // does not create opposite-facing sectors
      equals(a2, b3) && area(a2.prev, a2, a2.next) > 0 && area(b3.prev, b3, b3.next) > 0);
    }
    function area(p3, q2, r2) {
      return (q2.y - p3.y) * (r2.x - q2.x) - (q2.x - p3.x) * (r2.y - q2.y);
    }
    function equals(p1, p22) {
      return p1.x === p22.x && p1.y === p22.y;
    }
    function intersects(p1, q1, p22, q2) {
      var o1 = sign2(area(p1, q1, p22));
      var o22 = sign2(area(p1, q1, q2));
      var o3 = sign2(area(p22, q2, p1));
      var o4 = sign2(area(p22, q2, q1));
      if (o1 !== o22 && o3 !== o4)
        return true;
      if (o1 === 0 && onSegment(p1, p22, q1))
        return true;
      if (o22 === 0 && onSegment(p1, q2, q1))
        return true;
      if (o3 === 0 && onSegment(p22, p1, q2))
        return true;
      if (o4 === 0 && onSegment(p22, q1, q2))
        return true;
      return false;
    }
    function onSegment(p3, q2, r2) {
      return q2.x <= Math.max(p3.x, r2.x) && q2.x >= Math.min(p3.x, r2.x) && q2.y <= Math.max(p3.y, r2.y) && q2.y >= Math.min(p3.y, r2.y);
    }
    function sign2(num) {
      return num > 0 ? 1 : num < 0 ? -1 : 0;
    }
    function intersectsPolygon(a2, b3) {
      var p3 = a2;
      do {
        if (p3.i !== a2.i && p3.next.i !== a2.i && p3.i !== b3.i && p3.next.i !== b3.i && intersects(p3, p3.next, a2, b3))
          return true;
        p3 = p3.next;
      } while (p3 !== a2);
      return false;
    }
    function locallyInside(a2, b3) {
      return area(a2.prev, a2, a2.next) < 0 ? area(a2, b3, a2.next) >= 0 && area(a2, a2.prev, b3) >= 0 : area(a2, b3, a2.prev) < 0 || area(a2, a2.next, b3) < 0;
    }
    function middleInside(a2, b3) {
      var p3 = a2, inside = false, px = (a2.x + b3.x) / 2, py = (a2.y + b3.y) / 2;
      do {
        if (p3.y > py !== p3.next.y > py && p3.next.y !== p3.y && px < (p3.next.x - p3.x) * (py - p3.y) / (p3.next.y - p3.y) + p3.x)
          inside = !inside;
        p3 = p3.next;
      } while (p3 !== a2);
      return inside;
    }
    function splitPolygon(a2, b3) {
      var a22 = new Node(a2.i, a2.x, a2.y), b22 = new Node(b3.i, b3.x, b3.y), an = a2.next, bp = b3.prev;
      a2.next = b3;
      b3.prev = a2;
      a22.next = an;
      an.prev = a22;
      b22.next = a22;
      a22.prev = b22;
      bp.next = b22;
      b22.prev = bp;
      return b22;
    }
    function insertNode(i2, x2, y2, last) {
      var p3 = new Node(i2, x2, y2);
      if (!last) {
        p3.prev = p3;
        p3.next = p3;
      } else {
        p3.next = last.next;
        p3.prev = last;
        last.next.prev = p3;
        last.next = p3;
      }
      return p3;
    }
    function removeNode(p3) {
      p3.next.prev = p3.prev;
      p3.prev.next = p3.next;
      if (p3.prevZ)
        p3.prevZ.nextZ = p3.nextZ;
      if (p3.nextZ)
        p3.nextZ.prevZ = p3.prevZ;
    }
    function Node(i2, x2, y2) {
      this.i = i2;
      this.x = x2;
      this.y = y2;
      this.prev = null;
      this.next = null;
      this.z = 0;
      this.prevZ = null;
      this.nextZ = null;
      this.steiner = false;
    }
    earcut.deviation = function(data, holeIndices, dim, triangles) {
      var hasHoles = holeIndices && holeIndices.length;
      var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
      var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
      if (hasHoles) {
        for (var i2 = 0, len = holeIndices.length; i2 < len; i2++) {
          var start = holeIndices[i2] * dim;
          var end = i2 < len - 1 ? holeIndices[i2 + 1] * dim : data.length;
          polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
      }
      var trianglesArea = 0;
      for (i2 = 0; i2 < triangles.length; i2 += 3) {
        var a2 = triangles[i2] * dim;
        var b3 = triangles[i2 + 1] * dim;
        var c2 = triangles[i2 + 2] * dim;
        trianglesArea += Math.abs(
          (data[a2] - data[c2]) * (data[b3 + 1] - data[a2 + 1]) - (data[a2] - data[b3]) * (data[c2 + 1] - data[a2 + 1])
        );
      }
      return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
    };
    function signedArea(data, start, end, dim) {
      var sum = 0;
      for (var i2 = start, j3 = end - dim; i2 < end; i2 += dim) {
        sum += (data[j3] - data[i2]) * (data[i2 + 1] + data[j3 + 1]);
        j3 = i2;
      }
      return sum;
    }
    earcut.flatten = function(data) {
      var dim = data[0][0].length, result = { vertices: [], holes: [], dimensions: dim }, holeIndex = 0;
      for (var i2 = 0; i2 < data.length; i2++) {
        for (var j3 = 0; j3 < data[i2].length; j3++) {
          for (var d2 = 0; d2 < dim; d2++)
            result.vertices.push(data[i2][j3][d2]);
        }
        if (i2 > 0) {
          holeIndex += data[i2 - 1].length;
          result.holes.push(holeIndex);
        }
      }
      return result;
    };
  }
});

// ../../node_modules/.pnpm/punycode@1.3.2/node_modules/punycode/punycode.js
var require_punycode = __commonJS({
  "../../node_modules/.pnpm/punycode@1.3.2/node_modules/punycode/punycode.js"(exports, module) {
    (function(root) {
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = typeof module == "object" && module && !module.nodeType && module;
      var freeGlobal = typeof global == "object" && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
        root = freeGlobal;
      }
      var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
      function error(type) {
        throw RangeError(errors[type]);
      }
      function map4(array, fn) {
        var length = array.length;
        var result = [];
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      function mapDomain(string, fn) {
        var parts = string.split("@");
        var result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          string = parts[1];
        }
        string = string.replace(regexSeparators, ".");
        var labels = string.split(".");
        var encoded = map4(labels, fn).join(".");
        return result + encoded;
      }
      function ucs2decode(string) {
        var output = [], counter = 0, length = string.length, value, extra;
        while (counter < length) {
          value = string.charCodeAt(counter++);
          if (value >= 55296 && value <= 56319 && counter < length) {
            extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      function ucs2encode(array) {
        return map4(array, function(value) {
          var output = "";
          if (value > 65535) {
            value -= 65536;
            output += stringFromCharCode(value >>> 10 & 1023 | 55296);
            value = 56320 | value & 1023;
          }
          output += stringFromCharCode(value);
          return output;
        }).join("");
      }
      function basicToDigit(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      }
      function digitToBasic(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }
      function adapt(delta, numPoints, firstTime) {
        var k3 = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k3 += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k3 + (baseMinusTMin + 1) * delta / (delta + skew));
      }
      function decode(input) {
        var output = [], inputLength = input.length, out, i2 = 0, n2 = initialN, bias = initialBias, basic, j3, index, oldi, w3, k3, digit, t2, baseMinusT;
        basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (j3 = 0; j3 < basic; ++j3) {
          if (input.charCodeAt(j3) >= 128) {
            error("not-basic");
          }
          output.push(input.charCodeAt(j3));
        }
        for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          for (oldi = i2, w3 = 1, k3 = base; ; k3 += base) {
            if (index >= inputLength) {
              error("invalid-input");
            }
            digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i2) / w3)) {
              error("overflow");
            }
            i2 += digit * w3;
            t2 = k3 <= bias ? tMin : k3 >= bias + tMax ? tMax : k3 - bias;
            if (digit < t2) {
              break;
            }
            baseMinusT = base - t2;
            if (w3 > floor(maxInt / baseMinusT)) {
              error("overflow");
            }
            w3 *= baseMinusT;
          }
          out = output.length + 1;
          bias = adapt(i2 - oldi, out, oldi == 0);
          if (floor(i2 / out) > maxInt - n2) {
            error("overflow");
          }
          n2 += floor(i2 / out);
          i2 %= out;
          output.splice(i2++, 0, n2);
        }
        return ucs2encode(output);
      }
      function encode(input) {
        var n2, delta, handledCPCount, basicLength, bias, j3, m2, q2, k3, t2, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
        input = ucs2decode(input);
        inputLength = input.length;
        n2 = initialN;
        delta = 0;
        bias = initialBias;
        for (j3 = 0; j3 < inputLength; ++j3) {
          currentValue = input[j3];
          if (currentValue < 128) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        handledCPCount = basicLength = output.length;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          for (m2 = maxInt, j3 = 0; j3 < inputLength; ++j3) {
            currentValue = input[j3];
            if (currentValue >= n2 && currentValue < m2) {
              m2 = currentValue;
            }
          }
          handledCPCountPlusOne = handledCPCount + 1;
          if (m2 - n2 > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error("overflow");
          }
          delta += (m2 - n2) * handledCPCountPlusOne;
          n2 = m2;
          for (j3 = 0; j3 < inputLength; ++j3) {
            currentValue = input[j3];
            if (currentValue < n2 && ++delta > maxInt) {
              error("overflow");
            }
            if (currentValue == n2) {
              for (q2 = delta, k3 = base; ; k3 += base) {
                t2 = k3 <= bias ? tMin : k3 >= bias + tMax ? tMax : k3 - bias;
                if (q2 < t2) {
                  break;
                }
                qMinusT = q2 - t2;
                baseMinusT = base - t2;
                output.push(
                  stringFromCharCode(digitToBasic(t2 + qMinusT % baseMinusT, 0))
                );
                q2 = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q2, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n2;
        }
        return output.join("");
      }
      function toUnicode(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      }
      function toASCII(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
        });
      }
      punycode = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        "version": "1.3.2",
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define("punycode", function() {
          return punycode;
        });
      } else if (freeExports && freeModule) {
        if (module.exports == freeExports) {
          freeModule.exports = punycode;
        } else {
          for (key in punycode) {
            punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
          }
        }
      } else {
        root.punycode = punycode;
      }
    })(exports);
  }
});

// ../../node_modules/.pnpm/url@0.11.0/node_modules/url/util.js
var require_util = __commonJS({
  "../../node_modules/.pnpm/url@0.11.0/node_modules/url/util.js"(exports, module) {
    "use strict";
    module.exports = {
      isString: function(arg) {
        return typeof arg === "string";
      },
      isObject: function(arg) {
        return typeof arg === "object" && arg !== null;
      },
      isNull: function(arg) {
        return arg === null;
      },
      isNullOrUndefined: function(arg) {
        return arg == null;
      }
    };
  }
});

// ../../node_modules/.pnpm/querystring@0.2.0/node_modules/querystring/decode.js
var require_decode = __commonJS({
  "../../node_modules/.pnpm/querystring@0.2.0/node_modules/querystring/decode.js"(exports, module) {
    "use strict";
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    module.exports = function(qs, sep, eq, options) {
      sep = sep || "&";
      eq = eq || "=";
      var obj = {};
      if (typeof qs !== "string" || qs.length === 0) {
        return obj;
      }
      var regexp = /\+/g;
      qs = qs.split(sep);
      var maxKeys = 1e3;
      if (options && typeof options.maxKeys === "number") {
        maxKeys = options.maxKeys;
      }
      var len = qs.length;
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
      for (var i2 = 0; i2 < len; ++i2) {
        var x2 = qs[i2].replace(regexp, "%20"), idx = x2.indexOf(eq), kstr, vstr, k3, v2;
        if (idx >= 0) {
          kstr = x2.substr(0, idx);
          vstr = x2.substr(idx + 1);
        } else {
          kstr = x2;
          vstr = "";
        }
        k3 = decodeURIComponent(kstr);
        v2 = decodeURIComponent(vstr);
        if (!hasOwnProperty(obj, k3)) {
          obj[k3] = v2;
        } else if (Array.isArray(obj[k3])) {
          obj[k3].push(v2);
        } else {
          obj[k3] = [obj[k3], v2];
        }
      }
      return obj;
    };
  }
});

// ../../node_modules/.pnpm/querystring@0.2.0/node_modules/querystring/encode.js
var require_encode = __commonJS({
  "../../node_modules/.pnpm/querystring@0.2.0/node_modules/querystring/encode.js"(exports, module) {
    "use strict";
    var stringifyPrimitive = function(v2) {
      switch (typeof v2) {
        case "string":
          return v2;
        case "boolean":
          return v2 ? "true" : "false";
        case "number":
          return isFinite(v2) ? v2 : "";
        default:
          return "";
      }
    };
    module.exports = function(obj, sep, eq, name) {
      sep = sep || "&";
      eq = eq || "=";
      if (obj === null) {
        obj = void 0;
      }
      if (typeof obj === "object") {
        return Object.keys(obj).map(function(k3) {
          var ks = encodeURIComponent(stringifyPrimitive(k3)) + eq;
          if (Array.isArray(obj[k3])) {
            return obj[k3].map(function(v2) {
              return ks + encodeURIComponent(stringifyPrimitive(v2));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k3]));
          }
        }).join(sep);
      }
      if (!name)
        return "";
      return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
    };
  }
});

// ../../node_modules/.pnpm/querystring@0.2.0/node_modules/querystring/index.js
var require_querystring = __commonJS({
  "../../node_modules/.pnpm/querystring@0.2.0/node_modules/querystring/index.js"(exports) {
    "use strict";
    exports.decode = exports.parse = require_decode();
    exports.encode = exports.stringify = require_encode();
  }
});

// ../../node_modules/.pnpm/url@0.11.0/node_modules/url/url.js
var require_url = __commonJS({
  "../../node_modules/.pnpm/url@0.11.0/node_modules/url/url.js"(exports) {
    "use strict";
    var punycode = require_punycode();
    var util = require_util();
    exports.parse = urlParse;
    exports.resolve = urlResolve;
    exports.resolveObject = urlResolveObject;
    exports.format = urlFormat;
    exports.Url = Url;
    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }
    var protocolPattern = /^([a-z0-9.+-]+:)/i;
    var portPattern = /:[0-9]*$/;
    var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
    var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
    var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
    var autoEscape = ["'"].concat(unwise);
    var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
    var hostEndingChars = ["/", "?", "#"];
    var hostnameMaxLen = 255;
    var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
    var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
    var unsafeProtocol = {
      "javascript": true,
      "javascript:": true
    };
    var hostlessProtocol = {
      "javascript": true,
      "javascript:": true
    };
    var slashedProtocol = {
      "http": true,
      "https": true,
      "ftp": true,
      "gopher": true,
      "file": true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    var querystring = require_querystring();
    function urlParse(url2, parseQueryString, slashesDenoteHost) {
      if (url2 && util.isObject(url2) && url2 instanceof Url)
        return url2;
      var u2 = new Url();
      u2.parse(url2, parseQueryString, slashesDenoteHost);
      return u2;
    }
    Url.prototype.parse = function(url2, parseQueryString, slashesDenoteHost) {
      if (!util.isString(url2)) {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url2);
      }
      var queryIndex = url2.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url2.indexOf("#") ? "?" : "#", uSplit = url2.split(splitter), slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, "/");
      url2 = uSplit.join(splitter);
      var rest = url2;
      rest = rest.trim();
      if (!slashesDenoteHost && url2.split("#").length === 1) {
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = "";
            this.query = {};
          }
          return this;
        }
      }
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        var hostEnd = -1;
        for (var i2 = 0; i2 < hostEndingChars.length; i2++) {
          var hec = rest.indexOf(hostEndingChars[i2]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        var auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }
        hostEnd = -1;
        for (var i2 = 0; i2 < nonHostChars.length; i2++) {
          var hec = rest.indexOf(nonHostChars[i2]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        if (hostEnd === -1)
          hostEnd = rest.length;
        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost();
        this.hostname = this.hostname || "";
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i2 = 0, l3 = hostparts.length; i2 < l3; i2++) {
            var part = hostparts[i2];
            if (!part)
              continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = "";
              for (var j3 = 0, k3 = part.length; j3 < k3; j3++) {
                if (part.charCodeAt(j3) > 127) {
                  newpart += "x";
                } else {
                  newpart += part[j3];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i2);
                var notHost = hostparts.slice(i2 + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = "/" + notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        } else {
          this.hostname = this.hostname.toLowerCase();
        }
        if (!ipv6Hostname) {
          this.hostname = punycode.toASCII(this.hostname);
        }
        var p3 = this.port ? ":" + this.port : "";
        var h2 = this.hostname || "";
        this.host = h2 + p3;
        this.href += this.host;
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== "/") {
            rest = "/" + rest;
          }
        }
      }
      if (!unsafeProtocol[lowerProto]) {
        for (var i2 = 0, l3 = autoEscape.length; i2 < l3; i2++) {
          var ae = autoEscape[i2];
          if (rest.indexOf(ae) === -1)
            continue;
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }
      var hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        this.search = "";
        this.query = {};
      }
      if (rest)
        this.pathname = rest;
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "/";
      }
      if (this.pathname || this.search) {
        var p3 = this.pathname || "";
        var s2 = this.search || "";
        this.path = p3 + s2;
      }
      this.href = this.format();
      return this;
    };
    function urlFormat(obj) {
      if (util.isString(obj))
        obj = urlParse(obj);
      if (!(obj instanceof Url))
        return Url.prototype.format.call(obj);
      return obj.format();
    }
    Url.prototype.format = function() {
      var auth = this.auth || "";
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ":");
        auth += "@";
      }
      var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
        if (this.port) {
          host += ":" + this.port;
        }
      }
      if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
        query = querystring.stringify(this.query);
      }
      var search = this.search || query && "?" + query || "";
      if (protocol && protocol.substr(-1) !== ":")
        protocol += ":";
      if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = "//" + (host || "");
        if (pathname && pathname.charAt(0) !== "/")
          pathname = "/" + pathname;
      } else if (!host) {
        host = "";
      }
      if (hash && hash.charAt(0) !== "#")
        hash = "#" + hash;
      if (search && search.charAt(0) !== "?")
        search = "?" + search;
      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace("#", "%23");
      return protocol + host + pathname + search + hash;
    };
    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }
    Url.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };
    function urlResolveObject(source, relative) {
      if (!source)
        return relative;
      return urlParse(source, false, true).resolveObject(relative);
    }
    Url.prototype.resolveObject = function(relative) {
      if (util.isString(relative)) {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }
      var result = new Url();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }
      result.hash = relative.hash;
      if (relative.href === "") {
        result.href = result.format();
        return result;
      }
      if (relative.slashes && !relative.protocol) {
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== "protocol")
            result[rkey] = relative[rkey];
        }
        if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
          result.path = result.pathname = "/";
        }
        result.href = result.format();
        return result;
      }
      if (relative.protocol && relative.protocol !== result.protocol) {
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v2 = 0; v2 < keys.length; v2++) {
            var k3 = keys[v2];
            result[k3] = relative[k3];
          }
          result.href = result.format();
          return result;
        }
        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || "").split("/");
          while (relPath.length && !(relative.host = relPath.shift()))
            ;
          if (!relative.host)
            relative.host = "";
          if (!relative.hostname)
            relative.hostname = "";
          if (relPath[0] !== "")
            relPath.unshift("");
          if (relPath.length < 2)
            relPath.unshift("");
          result.pathname = relPath.join("/");
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || "";
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        if (result.pathname || result.search) {
          var p3 = result.pathname || "";
          var s2 = result.search || "";
          result.path = p3 + s2;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }
      var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
      if (psychotic) {
        result.hostname = "";
        result.port = null;
        if (result.host) {
          if (srcPath[0] === "")
            srcPath[0] = result.host;
          else
            srcPath.unshift(result.host);
        }
        result.host = "";
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === "")
              relPath[0] = relative.host;
            else
              relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
      }
      if (isRelAbs) {
        result.host = relative.host || relative.host === "" ? relative.host : result.host;
        result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
      } else if (relPath.length) {
        if (!srcPath)
          srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!util.isNullOrUndefined(relative.search)) {
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
        }
        result.href = result.format();
        return result;
      }
      if (!srcPath.length) {
        result.pathname = null;
        if (result.search) {
          result.path = "/" + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
      var up = 0;
      for (var i2 = srcPath.length; i2 >= 0; i2--) {
        last = srcPath[i2];
        if (last === ".") {
          srcPath.splice(i2, 1);
        } else if (last === "..") {
          srcPath.splice(i2, 1);
          up++;
        } else if (up) {
          srcPath.splice(i2, 1);
          up--;
        }
      }
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift("..");
        }
      }
      if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
        srcPath.unshift("");
      }
      if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
        srcPath.push("");
      }
      var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
        var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
      mustEndAbs = mustEndAbs || result.host && srcPath.length;
      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift("");
      }
      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join("/");
      }
      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };
    Url.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host)
        this.hostname = host;
    };
  }
});

// ../../node_modules/.pnpm/@pixi+constants@7.2.4/node_modules/@pixi/constants/lib/index.mjs
var ENV = /* @__PURE__ */ ((ENV2) => {
  ENV2[ENV2["WEBGL_LEGACY"] = 0] = "WEBGL_LEGACY";
  ENV2[ENV2["WEBGL"] = 1] = "WEBGL";
  ENV2[ENV2["WEBGL2"] = 2] = "WEBGL2";
  return ENV2;
})(ENV || {});
var RENDERER_TYPE = /* @__PURE__ */ ((RENDERER_TYPE2) => {
  RENDERER_TYPE2[RENDERER_TYPE2["UNKNOWN"] = 0] = "UNKNOWN";
  RENDERER_TYPE2[RENDERER_TYPE2["WEBGL"] = 1] = "WEBGL";
  RENDERER_TYPE2[RENDERER_TYPE2["CANVAS"] = 2] = "CANVAS";
  return RENDERER_TYPE2;
})(RENDERER_TYPE || {});
var BUFFER_BITS = /* @__PURE__ */ ((BUFFER_BITS2) => {
  BUFFER_BITS2[BUFFER_BITS2["COLOR"] = 16384] = "COLOR";
  BUFFER_BITS2[BUFFER_BITS2["DEPTH"] = 256] = "DEPTH";
  BUFFER_BITS2[BUFFER_BITS2["STENCIL"] = 1024] = "STENCIL";
  return BUFFER_BITS2;
})(BUFFER_BITS || {});
var BLEND_MODES = /* @__PURE__ */ ((BLEND_MODES2) => {
  BLEND_MODES2[BLEND_MODES2["NORMAL"] = 0] = "NORMAL";
  BLEND_MODES2[BLEND_MODES2["ADD"] = 1] = "ADD";
  BLEND_MODES2[BLEND_MODES2["MULTIPLY"] = 2] = "MULTIPLY";
  BLEND_MODES2[BLEND_MODES2["SCREEN"] = 3] = "SCREEN";
  BLEND_MODES2[BLEND_MODES2["OVERLAY"] = 4] = "OVERLAY";
  BLEND_MODES2[BLEND_MODES2["DARKEN"] = 5] = "DARKEN";
  BLEND_MODES2[BLEND_MODES2["LIGHTEN"] = 6] = "LIGHTEN";
  BLEND_MODES2[BLEND_MODES2["COLOR_DODGE"] = 7] = "COLOR_DODGE";
  BLEND_MODES2[BLEND_MODES2["COLOR_BURN"] = 8] = "COLOR_BURN";
  BLEND_MODES2[BLEND_MODES2["HARD_LIGHT"] = 9] = "HARD_LIGHT";
  BLEND_MODES2[BLEND_MODES2["SOFT_LIGHT"] = 10] = "SOFT_LIGHT";
  BLEND_MODES2[BLEND_MODES2["DIFFERENCE"] = 11] = "DIFFERENCE";
  BLEND_MODES2[BLEND_MODES2["EXCLUSION"] = 12] = "EXCLUSION";
  BLEND_MODES2[BLEND_MODES2["HUE"] = 13] = "HUE";
  BLEND_MODES2[BLEND_MODES2["SATURATION"] = 14] = "SATURATION";
  BLEND_MODES2[BLEND_MODES2["COLOR"] = 15] = "COLOR";
  BLEND_MODES2[BLEND_MODES2["LUMINOSITY"] = 16] = "LUMINOSITY";
  BLEND_MODES2[BLEND_MODES2["NORMAL_NPM"] = 17] = "NORMAL_NPM";
  BLEND_MODES2[BLEND_MODES2["ADD_NPM"] = 18] = "ADD_NPM";
  BLEND_MODES2[BLEND_MODES2["SCREEN_NPM"] = 19] = "SCREEN_NPM";
  BLEND_MODES2[BLEND_MODES2["NONE"] = 20] = "NONE";
  BLEND_MODES2[BLEND_MODES2["SRC_OVER"] = 0] = "SRC_OVER";
  BLEND_MODES2[BLEND_MODES2["SRC_IN"] = 21] = "SRC_IN";
  BLEND_MODES2[BLEND_MODES2["SRC_OUT"] = 22] = "SRC_OUT";
  BLEND_MODES2[BLEND_MODES2["SRC_ATOP"] = 23] = "SRC_ATOP";
  BLEND_MODES2[BLEND_MODES2["DST_OVER"] = 24] = "DST_OVER";
  BLEND_MODES2[BLEND_MODES2["DST_IN"] = 25] = "DST_IN";
  BLEND_MODES2[BLEND_MODES2["DST_OUT"] = 26] = "DST_OUT";
  BLEND_MODES2[BLEND_MODES2["DST_ATOP"] = 27] = "DST_ATOP";
  BLEND_MODES2[BLEND_MODES2["ERASE"] = 26] = "ERASE";
  BLEND_MODES2[BLEND_MODES2["SUBTRACT"] = 28] = "SUBTRACT";
  BLEND_MODES2[BLEND_MODES2["XOR"] = 29] = "XOR";
  return BLEND_MODES2;
})(BLEND_MODES || {});
var DRAW_MODES = /* @__PURE__ */ ((DRAW_MODES2) => {
  DRAW_MODES2[DRAW_MODES2["POINTS"] = 0] = "POINTS";
  DRAW_MODES2[DRAW_MODES2["LINES"] = 1] = "LINES";
  DRAW_MODES2[DRAW_MODES2["LINE_LOOP"] = 2] = "LINE_LOOP";
  DRAW_MODES2[DRAW_MODES2["LINE_STRIP"] = 3] = "LINE_STRIP";
  DRAW_MODES2[DRAW_MODES2["TRIANGLES"] = 4] = "TRIANGLES";
  DRAW_MODES2[DRAW_MODES2["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
  DRAW_MODES2[DRAW_MODES2["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
  return DRAW_MODES2;
})(DRAW_MODES || {});
var FORMATS = /* @__PURE__ */ ((FORMATS2) => {
  FORMATS2[FORMATS2["RGBA"] = 6408] = "RGBA";
  FORMATS2[FORMATS2["RGB"] = 6407] = "RGB";
  FORMATS2[FORMATS2["RG"] = 33319] = "RG";
  FORMATS2[FORMATS2["RED"] = 6403] = "RED";
  FORMATS2[FORMATS2["RGBA_INTEGER"] = 36249] = "RGBA_INTEGER";
  FORMATS2[FORMATS2["RGB_INTEGER"] = 36248] = "RGB_INTEGER";
  FORMATS2[FORMATS2["RG_INTEGER"] = 33320] = "RG_INTEGER";
  FORMATS2[FORMATS2["RED_INTEGER"] = 36244] = "RED_INTEGER";
  FORMATS2[FORMATS2["ALPHA"] = 6406] = "ALPHA";
  FORMATS2[FORMATS2["LUMINANCE"] = 6409] = "LUMINANCE";
  FORMATS2[FORMATS2["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
  FORMATS2[FORMATS2["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
  FORMATS2[FORMATS2["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
  return FORMATS2;
})(FORMATS || {});
var TARGETS = /* @__PURE__ */ ((TARGETS2) => {
  TARGETS2[TARGETS2["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
  TARGETS2[TARGETS2["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
  return TARGETS2;
})(TARGETS || {});
var TYPES = /* @__PURE__ */ ((TYPES2) => {
  TYPES2[TYPES2["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
  TYPES2[TYPES2["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
  TYPES2[TYPES2["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
  TYPES2[TYPES2["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
  TYPES2[TYPES2["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
  TYPES2[TYPES2["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
  TYPES2[TYPES2["UNSIGNED_INT_10F_11F_11F_REV"] = 35899] = "UNSIGNED_INT_10F_11F_11F_REV";
  TYPES2[TYPES2["UNSIGNED_INT_2_10_10_10_REV"] = 33640] = "UNSIGNED_INT_2_10_10_10_REV";
  TYPES2[TYPES2["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
  TYPES2[TYPES2["UNSIGNED_INT_5_9_9_9_REV"] = 35902] = "UNSIGNED_INT_5_9_9_9_REV";
  TYPES2[TYPES2["BYTE"] = 5120] = "BYTE";
  TYPES2[TYPES2["SHORT"] = 5122] = "SHORT";
  TYPES2[TYPES2["INT"] = 5124] = "INT";
  TYPES2[TYPES2["FLOAT"] = 5126] = "FLOAT";
  TYPES2[TYPES2["FLOAT_32_UNSIGNED_INT_24_8_REV"] = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV";
  TYPES2[TYPES2["HALF_FLOAT"] = 36193] = "HALF_FLOAT";
  return TYPES2;
})(TYPES || {});
var SAMPLER_TYPES = /* @__PURE__ */ ((SAMPLER_TYPES2) => {
  SAMPLER_TYPES2[SAMPLER_TYPES2["FLOAT"] = 0] = "FLOAT";
  SAMPLER_TYPES2[SAMPLER_TYPES2["INT"] = 1] = "INT";
  SAMPLER_TYPES2[SAMPLER_TYPES2["UINT"] = 2] = "UINT";
  return SAMPLER_TYPES2;
})(SAMPLER_TYPES || {});
var SCALE_MODES = /* @__PURE__ */ ((SCALE_MODES2) => {
  SCALE_MODES2[SCALE_MODES2["NEAREST"] = 0] = "NEAREST";
  SCALE_MODES2[SCALE_MODES2["LINEAR"] = 1] = "LINEAR";
  return SCALE_MODES2;
})(SCALE_MODES || {});
var WRAP_MODES = /* @__PURE__ */ ((WRAP_MODES2) => {
  WRAP_MODES2[WRAP_MODES2["CLAMP"] = 33071] = "CLAMP";
  WRAP_MODES2[WRAP_MODES2["REPEAT"] = 10497] = "REPEAT";
  WRAP_MODES2[WRAP_MODES2["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
  return WRAP_MODES2;
})(WRAP_MODES || {});
var MIPMAP_MODES = /* @__PURE__ */ ((MIPMAP_MODES2) => {
  MIPMAP_MODES2[MIPMAP_MODES2["OFF"] = 0] = "OFF";
  MIPMAP_MODES2[MIPMAP_MODES2["POW2"] = 1] = "POW2";
  MIPMAP_MODES2[MIPMAP_MODES2["ON"] = 2] = "ON";
  MIPMAP_MODES2[MIPMAP_MODES2["ON_MANUAL"] = 3] = "ON_MANUAL";
  return MIPMAP_MODES2;
})(MIPMAP_MODES || {});
var ALPHA_MODES = /* @__PURE__ */ ((ALPHA_MODES2) => {
  ALPHA_MODES2[ALPHA_MODES2["NPM"] = 0] = "NPM";
  ALPHA_MODES2[ALPHA_MODES2["UNPACK"] = 1] = "UNPACK";
  ALPHA_MODES2[ALPHA_MODES2["PMA"] = 2] = "PMA";
  ALPHA_MODES2[ALPHA_MODES2["NO_PREMULTIPLIED_ALPHA"] = 0] = "NO_PREMULTIPLIED_ALPHA";
  ALPHA_MODES2[ALPHA_MODES2["PREMULTIPLY_ON_UPLOAD"] = 1] = "PREMULTIPLY_ON_UPLOAD";
  ALPHA_MODES2[ALPHA_MODES2["PREMULTIPLIED_ALPHA"] = 2] = "PREMULTIPLIED_ALPHA";
  return ALPHA_MODES2;
})(ALPHA_MODES || {});
var CLEAR_MODES = /* @__PURE__ */ ((CLEAR_MODES2) => {
  CLEAR_MODES2[CLEAR_MODES2["NO"] = 0] = "NO";
  CLEAR_MODES2[CLEAR_MODES2["YES"] = 1] = "YES";
  CLEAR_MODES2[CLEAR_MODES2["AUTO"] = 2] = "AUTO";
  CLEAR_MODES2[CLEAR_MODES2["BLEND"] = 0] = "BLEND";
  CLEAR_MODES2[CLEAR_MODES2["CLEAR"] = 1] = "CLEAR";
  CLEAR_MODES2[CLEAR_MODES2["BLIT"] = 2] = "BLIT";
  return CLEAR_MODES2;
})(CLEAR_MODES || {});
var GC_MODES = /* @__PURE__ */ ((GC_MODES2) => {
  GC_MODES2[GC_MODES2["AUTO"] = 0] = "AUTO";
  GC_MODES2[GC_MODES2["MANUAL"] = 1] = "MANUAL";
  return GC_MODES2;
})(GC_MODES || {});
var PRECISION = /* @__PURE__ */ ((PRECISION2) => {
  PRECISION2["LOW"] = "lowp";
  PRECISION2["MEDIUM"] = "mediump";
  PRECISION2["HIGH"] = "highp";
  return PRECISION2;
})(PRECISION || {});
var MASK_TYPES = /* @__PURE__ */ ((MASK_TYPES2) => {
  MASK_TYPES2[MASK_TYPES2["NONE"] = 0] = "NONE";
  MASK_TYPES2[MASK_TYPES2["SCISSOR"] = 1] = "SCISSOR";
  MASK_TYPES2[MASK_TYPES2["STENCIL"] = 2] = "STENCIL";
  MASK_TYPES2[MASK_TYPES2["SPRITE"] = 3] = "SPRITE";
  MASK_TYPES2[MASK_TYPES2["COLOR"] = 4] = "COLOR";
  return MASK_TYPES2;
})(MASK_TYPES || {});
var MSAA_QUALITY = /* @__PURE__ */ ((MSAA_QUALITY2) => {
  MSAA_QUALITY2[MSAA_QUALITY2["NONE"] = 0] = "NONE";
  MSAA_QUALITY2[MSAA_QUALITY2["LOW"] = 2] = "LOW";
  MSAA_QUALITY2[MSAA_QUALITY2["MEDIUM"] = 4] = "MEDIUM";
  MSAA_QUALITY2[MSAA_QUALITY2["HIGH"] = 8] = "HIGH";
  return MSAA_QUALITY2;
})(MSAA_QUALITY || {});
var BUFFER_TYPE = /* @__PURE__ */ ((BUFFER_TYPE2) => {
  BUFFER_TYPE2[BUFFER_TYPE2["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
  BUFFER_TYPE2[BUFFER_TYPE2["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
  BUFFER_TYPE2[BUFFER_TYPE2["UNIFORM_BUFFER"] = 35345] = "UNIFORM_BUFFER";
  return BUFFER_TYPE2;
})(BUFFER_TYPE || {});

// ../../node_modules/.pnpm/@pixi+settings@7.2.4/node_modules/@pixi/settings/lib/adapter.mjs
var BrowserAdapter = {
  createCanvas: (width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (url2, options) => fetch(url2, options),
  parseXML: (xml) => {
    const parser = new DOMParser();
    return parser.parseFromString(xml, "text/xml");
  }
};

// ../../node_modules/.pnpm/@pixi+settings@7.2.4/node_modules/@pixi/settings/lib/settings.mjs
var settings = {
  ADAPTER: BrowserAdapter,
  RESOLUTION: 1,
  CREATE_IMAGE_BITMAP: false,
  ROUND_PIXELS: false
};

// ../../node_modules/.pnpm/ismobilejs@1.1.1/node_modules/ismobilejs/esm/isMobile.js
var appleIphone = /iPhone/i;
var appleIpod = /iPod/i;
var appleTablet = /iPad/i;
var appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
var androidPhone = /\bAndroid(?:.+)Mobile\b/i;
var androidTablet = /Android/i;
var amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
var amazonTablet = /Silk/i;
var windowsPhone = /Windows Phone/i;
var windowsTablet = /\bWindows(?:.+)ARM\b/i;
var otherBlackBerry = /BlackBerry/i;
var otherBlackBerry10 = /BB10/i;
var otherOpera = /Opera Mini/i;
var otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
var otherFirefox = /Mobile(?:.+)Firefox\b/i;
var isAppleTabletOnIos13 = function(navigator2) {
  return typeof navigator2 !== "undefined" && navigator2.platform === "MacIntel" && typeof navigator2.maxTouchPoints === "number" && navigator2.maxTouchPoints > 1 && typeof MSStream === "undefined";
};
function createMatch(userAgent) {
  return function(regex) {
    return regex.test(userAgent);
  };
}
function isMobile(param) {
  var nav = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0
  };
  if (!param && typeof navigator !== "undefined") {
    nav = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints || 0
    };
  } else if (typeof param === "string") {
    nav.userAgent = param;
  } else if (param && param.userAgent) {
    nav = {
      userAgent: param.userAgent,
      platform: param.platform,
      maxTouchPoints: param.maxTouchPoints || 0
    };
  }
  var userAgent = nav.userAgent;
  var tmp = userAgent.split("[FBAN");
  if (typeof tmp[1] !== "undefined") {
    userAgent = tmp[0];
  }
  tmp = userAgent.split("Twitter");
  if (typeof tmp[1] !== "undefined") {
    userAgent = tmp[0];
  }
  var match = createMatch(userAgent);
  var result = {
    apple: {
      phone: match(appleIphone) && !match(windowsPhone),
      ipod: match(appleIpod),
      tablet: !match(appleIphone) && (match(appleTablet) || isAppleTabletOnIos13(nav)) && !match(windowsPhone),
      universal: match(appleUniversal),
      device: (match(appleIphone) || match(appleIpod) || match(appleTablet) || match(appleUniversal) || isAppleTabletOnIos13(nav)) && !match(windowsPhone)
    },
    amazon: {
      phone: match(amazonPhone),
      tablet: !match(amazonPhone) && match(amazonTablet),
      device: match(amazonPhone) || match(amazonTablet)
    },
    android: {
      phone: !match(windowsPhone) && match(amazonPhone) || !match(windowsPhone) && match(androidPhone),
      tablet: !match(windowsPhone) && !match(amazonPhone) && !match(androidPhone) && (match(amazonTablet) || match(androidTablet)),
      device: !match(windowsPhone) && (match(amazonPhone) || match(amazonTablet) || match(androidPhone) || match(androidTablet)) || match(/\bokhttp\b/i)
    },
    windows: {
      phone: match(windowsPhone),
      tablet: match(windowsTablet),
      device: match(windowsPhone) || match(windowsTablet)
    },
    other: {
      blackberry: match(otherBlackBerry),
      blackberry10: match(otherBlackBerry10),
      opera: match(otherOpera),
      firefox: match(otherFirefox),
      chrome: match(otherChrome),
      device: match(otherBlackBerry) || match(otherBlackBerry10) || match(otherOpera) || match(otherFirefox) || match(otherChrome)
    },
    any: false,
    phone: false,
    tablet: false
  };
  result.any = result.apple.device || result.android.device || result.windows.device || result.other.device;
  result.phone = result.apple.phone || result.android.phone || result.windows.phone;
  result.tablet = result.apple.tablet || result.android.tablet || result.windows.tablet;
  return result;
}

// ../../node_modules/.pnpm/@pixi+settings@7.2.4/node_modules/@pixi/settings/lib/utils/isMobile.mjs
var isMobileCall = isMobile.default ?? isMobile;
var isMobile2 = isMobileCall(globalThis.navigator);

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/index.mjs
var lib_exports = {};
__export(lib_exports, {
  BaseTextureCache: () => BaseTextureCache,
  BoundingBox: () => BoundingBox,
  CanvasRenderTarget: () => CanvasRenderTarget,
  DATA_URI: () => DATA_URI,
  EventEmitter: () => import_eventemitter3.default,
  ProgramCache: () => ProgramCache,
  TextureCache: () => TextureCache,
  clearTextureCache: () => clearTextureCache,
  correctBlendMode: () => correctBlendMode,
  createIndicesForQuads: () => createIndicesForQuads,
  decomposeDataUri: () => decomposeDataUri,
  deprecation: () => deprecation,
  destroyTextureCache: () => destroyTextureCache,
  determineCrossOrigin: () => determineCrossOrigin,
  earcut: () => import_earcut.default,
  getBufferType: () => getBufferType,
  getCanvasBoundingBox: () => getCanvasBoundingBox,
  getResolutionOfUrl: () => getResolutionOfUrl,
  hex2rgb: () => hex2rgb,
  hex2string: () => hex2string,
  interleaveTypedArrays: () => interleaveTypedArrays,
  isMobile: () => isMobile2,
  isPow2: () => isPow2,
  isWebGLSupported: () => isWebGLSupported,
  log2: () => log2,
  nextPow2: () => nextPow2,
  path: () => path,
  premultiplyBlendMode: () => premultiplyBlendMode,
  premultiplyRgba: () => premultiplyRgba,
  premultiplyTint: () => premultiplyTint,
  premultiplyTintToRgba: () => premultiplyTintToRgba,
  removeItems: () => removeItems,
  rgb2hex: () => rgb2hex,
  sayHello: () => sayHello,
  sign: () => sign,
  skipHello: () => skipHello,
  string2hex: () => string2hex,
  trimCanvas: () => trimCanvas,
  uid: () => uid,
  url: () => url
});

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/settings.mjs
settings.RETINA_PREFIX = /@([0-9\.]+)x/;
settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/index.mjs
var import_eventemitter3 = __toESM(require_eventemitter3(), 1);
var import_earcut = __toESM(require_earcut(), 1);

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/url.mjs
var import_url = __toESM(require_url(), 1);
var url = {
  parse: import_url.parse,
  format: import_url.format,
  resolve: import_url.resolve
};

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/path.mjs
function assertPath(path2) {
  if (typeof path2 !== "string") {
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(path2)}`);
  }
}
function removeUrlParams(url2) {
  const re = url2.split("?")[0];
  return re.split("#")[0];
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}
function normalizeStringPosix(path2, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code = -1;
  for (let i2 = 0; i2 <= path2.length; ++i2) {
    if (i2 < path2.length) {
      code = path2.charCodeAt(i2);
    } else if (code === 47) {
      break;
    } else {
      code = 47;
    }
    if (code === 47) {
      if (lastSlash === i2 - 1 || dots === 1) {
      } else if (lastSlash !== i2 - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              }
              lastSlash = i2;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i2;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) {
            res += "/..";
          } else {
            res = "..";
          }
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path2.slice(lastSlash + 1, i2)}`;
        } else {
          res = path2.slice(lastSlash + 1, i2);
        }
        lastSegmentLength = i2 - lastSlash - 1;
      }
      lastSlash = i2;
      dots = 0;
    } else if (code === 46 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
var path = {
  toPosix(path2) {
    return replaceAll(path2, "\\", "/");
  },
  isUrl(path2) {
    return /^https?:/.test(this.toPosix(path2));
  },
  isDataUrl(path2) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(path2);
  },
  hasProtocol(path2) {
    return /^[^/:]+:\//.test(this.toPosix(path2));
  },
  getProtocol(path2) {
    assertPath(path2);
    path2 = this.toPosix(path2);
    let protocol = "";
    const isFile = /^file:\/\/\//.exec(path2);
    const isHttp = /^[^/:]+:\/\//.exec(path2);
    const isWindows = /^[^/:]+:\//.exec(path2);
    if (isFile || isHttp || isWindows) {
      const arr = isFile?.[0] || isHttp?.[0] || isWindows?.[0];
      protocol = arr;
      path2 = path2.slice(arr.length);
    }
    return protocol;
  },
  toAbsolute(url2, customBaseUrl, customRootUrl) {
    if (this.isDataUrl(url2))
      return url2;
    const baseUrl = removeUrlParams(this.toPosix(customBaseUrl ?? settings.ADAPTER.getBaseUrl()));
    const rootUrl = removeUrlParams(this.toPosix(customRootUrl ?? this.rootname(baseUrl)));
    assertPath(url2);
    url2 = this.toPosix(url2);
    if (url2.startsWith("/")) {
      return path.join(rootUrl, url2.slice(1));
    }
    const absolutePath = this.isAbsolute(url2) ? url2 : this.join(baseUrl, url2);
    return absolutePath;
  },
  normalize(path2) {
    path2 = this.toPosix(path2);
    assertPath(path2);
    if (path2.length === 0)
      return ".";
    let protocol = "";
    const isAbsolute = path2.startsWith("/");
    if (this.hasProtocol(path2)) {
      protocol = this.rootname(path2);
      path2 = path2.slice(protocol.length);
    }
    const trailingSeparator = path2.endsWith("/");
    path2 = normalizeStringPosix(path2, false);
    if (path2.length > 0 && trailingSeparator)
      path2 += "/";
    if (isAbsolute)
      return `/${path2}`;
    return protocol + path2;
  },
  isAbsolute(path2) {
    assertPath(path2);
    path2 = this.toPosix(path2);
    if (this.hasProtocol(path2))
      return true;
    return path2.startsWith("/");
  },
  join(...segments) {
    if (segments.length === 0) {
      return ".";
    }
    let joined;
    for (let i2 = 0; i2 < segments.length; ++i2) {
      const arg = segments[i2];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === void 0)
          joined = arg;
        else {
          const prevArg = segments[i2 - 1] ?? "";
          if (this.extname(prevArg)) {
            joined += `/../${arg}`;
          } else {
            joined += `/${arg}`;
          }
        }
      }
    }
    if (joined === void 0) {
      return ".";
    }
    return this.normalize(joined);
  },
  dirname(path2) {
    assertPath(path2);
    if (path2.length === 0)
      return ".";
    path2 = this.toPosix(path2);
    let code = path2.charCodeAt(0);
    const hasRoot = code === 47;
    let end = -1;
    let matchedSlash = true;
    const proto = this.getProtocol(path2);
    const origpath = path2;
    path2 = path2.slice(proto.length);
    for (let i2 = path2.length - 1; i2 >= 1; --i2) {
      code = path2.charCodeAt(i2);
      if (code === 47) {
        if (!matchedSlash) {
          end = i2;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1)
      return hasRoot ? "/" : this.isUrl(origpath) ? proto + path2 : proto;
    if (hasRoot && end === 1)
      return "//";
    return proto + path2.slice(0, end);
  },
  rootname(path2) {
    assertPath(path2);
    path2 = this.toPosix(path2);
    let root = "";
    if (path2.startsWith("/"))
      root = "/";
    else {
      root = this.getProtocol(path2);
    }
    if (this.isUrl(path2)) {
      const index = path2.indexOf("/", root.length);
      if (index !== -1) {
        root = path2.slice(0, index);
      } else
        root = path2;
      if (!root.endsWith("/"))
        root += "/";
    }
    return root;
  },
  basename(path2, ext) {
    assertPath(path2);
    if (ext)
      assertPath(ext);
    path2 = removeUrlParams(this.toPosix(path2));
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i2;
    if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
      if (ext.length === path2.length && ext === path2)
        return "";
      let extIdx = ext.length - 1;
      let firstNonSlashEnd = -1;
      for (i2 = path2.length - 1; i2 >= 0; --i2) {
        const code = path2.charCodeAt(i2);
        if (code === 47) {
          if (!matchedSlash) {
            start = i2 + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i2 + 1;
          }
          if (extIdx >= 0) {
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i2;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end)
        end = firstNonSlashEnd;
      else if (end === -1)
        end = path2.length;
      return path2.slice(start, end);
    }
    for (i2 = path2.length - 1; i2 >= 0; --i2) {
      if (path2.charCodeAt(i2) === 47) {
        if (!matchedSlash) {
          start = i2 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i2 + 1;
      }
    }
    if (end === -1)
      return "";
    return path2.slice(start, end);
  },
  extname(path2) {
    assertPath(path2);
    path2 = removeUrlParams(this.toPosix(path2));
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for (let i2 = path2.length - 1; i2 >= 0; --i2) {
      const code = path2.charCodeAt(i2);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i2 + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i2 + 1;
      }
      if (code === 46) {
        if (startDot === -1)
          startDot = i2;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path2.slice(startDot, end);
  },
  parse(path2) {
    assertPath(path2);
    const ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path2.length === 0)
      return ret;
    path2 = removeUrlParams(this.toPosix(path2));
    let code = path2.charCodeAt(0);
    const isAbsolute = this.isAbsolute(path2);
    let start;
    const protocol = "";
    ret.root = this.rootname(path2);
    if (isAbsolute || this.hasProtocol(path2)) {
      start = 1;
    } else {
      start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i2 = path2.length - 1;
    let preDotState = 0;
    for (; i2 >= start; --i2) {
      code = path2.charCodeAt(i2);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i2 + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i2 + 1;
      }
      if (code === 46) {
        if (startDot === -1)
          startDot = i2;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute)
          ret.base = ret.name = path2.slice(1, end);
        else
          ret.base = ret.name = path2.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path2.slice(1, startDot);
        ret.base = path2.slice(1, end);
      } else {
        ret.name = path2.slice(startPart, startDot);
        ret.base = path2.slice(startPart, end);
      }
      ret.ext = path2.slice(startDot, end);
    }
    ret.dir = this.dirname(path2);
    if (protocol)
      ret.dir = protocol + ret.dir;
    return ret;
  },
  sep: "/",
  delimiter: ":"
};

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/logging/deprecation.mjs
var warnings = {};
function deprecation(version, message, ignoreDepth = 3) {
  if (warnings[message]) {
    return;
  }
  let stack = new Error().stack;
  if (typeof stack === "undefined") {
    console.warn("PixiJS Deprecation Warning: ", `${message}
Deprecated since v${version}`);
  } else {
    stack = stack.split("\n").splice(ignoreDepth).join("\n");
    if (console.groupCollapsed) {
      console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", `${message}
Deprecated since v${version}`);
      console.warn(stack);
      console.groupEnd();
    } else {
      console.warn("PixiJS Deprecation Warning: ", `${message}
Deprecated since v${version}`);
      console.warn(stack);
    }
  }
  warnings[message] = true;
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/browser/hello.mjs
function skipHello() {
  deprecation("7.0.0", "skipHello is deprecated, please use settings.RENDER_OPTIONS.hello");
}
function sayHello() {
  deprecation("7.0.0", `sayHello is deprecated, please use Renderer's "hello" option`);
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/browser/isWebGLSupported.mjs
var supported;
function isWebGLSupported() {
  if (typeof supported === "undefined") {
    supported = function supported2() {
      const contextOptions = {
        stencil: true,
        failIfMajorPerformanceCaveat: settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
      };
      try {
        if (!settings.ADAPTER.getWebGLRenderingContext()) {
          return false;
        }
        const canvas = settings.ADAPTER.createCanvas();
        let gl = canvas.getContext("webgl", contextOptions) || canvas.getContext("experimental-webgl", contextOptions);
        const success = !!gl?.getContextAttributes()?.stencil;
        if (gl) {
          const loseContext = gl.getExtension("WEBGL_lose_context");
          if (loseContext) {
            loseContext.loseContext();
          }
        }
        gl = null;
        return success;
      } catch (e3) {
        return false;
      }
    }();
  }
  return supported;
}

// ../../node_modules/.pnpm/colord@2.9.3/node_modules/colord/index.mjs
var r = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) };
var t = function(r2) {
  return "string" == typeof r2 ? r2.length > 0 : "number" == typeof r2;
};
var n = function(r2, t2, n2) {
  return void 0 === t2 && (t2 = 0), void 0 === n2 && (n2 = Math.pow(10, t2)), Math.round(n2 * r2) / n2 + 0;
};
var e = function(r2, t2, n2) {
  return void 0 === t2 && (t2 = 0), void 0 === n2 && (n2 = 1), r2 > n2 ? n2 : r2 > t2 ? r2 : t2;
};
var u = function(r2) {
  return (r2 = isFinite(r2) ? r2 % 360 : 0) > 0 ? r2 : r2 + 360;
};
var a = function(r2) {
  return { r: e(r2.r, 0, 255), g: e(r2.g, 0, 255), b: e(r2.b, 0, 255), a: e(r2.a) };
};
var o = function(r2) {
  return { r: n(r2.r), g: n(r2.g), b: n(r2.b), a: n(r2.a, 3) };
};
var i = /^#([0-9a-f]{3,8})$/i;
var s = function(r2) {
  var t2 = r2.toString(16);
  return t2.length < 2 ? "0" + t2 : t2;
};
var h = function(r2) {
  var t2 = r2.r, n2 = r2.g, e3 = r2.b, u2 = r2.a, a2 = Math.max(t2, n2, e3), o3 = a2 - Math.min(t2, n2, e3), i2 = o3 ? a2 === t2 ? (n2 - e3) / o3 : a2 === n2 ? 2 + (e3 - t2) / o3 : 4 + (t2 - n2) / o3 : 0;
  return { h: 60 * (i2 < 0 ? i2 + 6 : i2), s: a2 ? o3 / a2 * 100 : 0, v: a2 / 255 * 100, a: u2 };
};
var b = function(r2) {
  var t2 = r2.h, n2 = r2.s, e3 = r2.v, u2 = r2.a;
  t2 = t2 / 360 * 6, n2 /= 100, e3 /= 100;
  var a2 = Math.floor(t2), o3 = e3 * (1 - n2), i2 = e3 * (1 - (t2 - a2) * n2), s2 = e3 * (1 - (1 - t2 + a2) * n2), h2 = a2 % 6;
  return { r: 255 * [e3, i2, o3, o3, s2, e3][h2], g: 255 * [s2, e3, e3, i2, o3, o3][h2], b: 255 * [o3, o3, s2, e3, e3, i2][h2], a: u2 };
};
var g = function(r2) {
  return { h: u(r2.h), s: e(r2.s, 0, 100), l: e(r2.l, 0, 100), a: e(r2.a) };
};
var d = function(r2) {
  return { h: n(r2.h), s: n(r2.s), l: n(r2.l), a: n(r2.a, 3) };
};
var f = function(r2) {
  return b((n2 = (t2 = r2).s, { h: t2.h, s: (n2 *= ((e3 = t2.l) < 50 ? e3 : 100 - e3) / 100) > 0 ? 2 * n2 / (e3 + n2) * 100 : 0, v: e3 + n2, a: t2.a }));
  var t2, n2, e3;
};
var c = function(r2) {
  return { h: (t2 = h(r2)).h, s: (u2 = (200 - (n2 = t2.s)) * (e3 = t2.v) / 100) > 0 && u2 < 200 ? n2 * e3 / 100 / (u2 <= 100 ? u2 : 200 - u2) * 100 : 0, l: u2 / 2, a: t2.a };
  var t2, n2, e3, u2;
};
var l = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
var p = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
var v = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
var m = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
var y = { string: [[function(r2) {
  var t2 = i.exec(r2);
  return t2 ? (r2 = t2[1]).length <= 4 ? { r: parseInt(r2[0] + r2[0], 16), g: parseInt(r2[1] + r2[1], 16), b: parseInt(r2[2] + r2[2], 16), a: 4 === r2.length ? n(parseInt(r2[3] + r2[3], 16) / 255, 2) : 1 } : 6 === r2.length || 8 === r2.length ? { r: parseInt(r2.substr(0, 2), 16), g: parseInt(r2.substr(2, 2), 16), b: parseInt(r2.substr(4, 2), 16), a: 8 === r2.length ? n(parseInt(r2.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(r2) {
  var t2 = v.exec(r2) || m.exec(r2);
  return t2 ? t2[2] !== t2[4] || t2[4] !== t2[6] ? null : a({ r: Number(t2[1]) / (t2[2] ? 100 / 255 : 1), g: Number(t2[3]) / (t2[4] ? 100 / 255 : 1), b: Number(t2[5]) / (t2[6] ? 100 / 255 : 1), a: void 0 === t2[7] ? 1 : Number(t2[7]) / (t2[8] ? 100 : 1) }) : null;
}, "rgb"], [function(t2) {
  var n2 = l.exec(t2) || p.exec(t2);
  if (!n2)
    return null;
  var e3, u2, a2 = g({ h: (e3 = n2[1], u2 = n2[2], void 0 === u2 && (u2 = "deg"), Number(e3) * (r[u2] || 1)), s: Number(n2[3]), l: Number(n2[4]), a: void 0 === n2[5] ? 1 : Number(n2[5]) / (n2[6] ? 100 : 1) });
  return f(a2);
}, "hsl"]], object: [[function(r2) {
  var n2 = r2.r, e3 = r2.g, u2 = r2.b, o3 = r2.a, i2 = void 0 === o3 ? 1 : o3;
  return t(n2) && t(e3) && t(u2) ? a({ r: Number(n2), g: Number(e3), b: Number(u2), a: Number(i2) }) : null;
}, "rgb"], [function(r2) {
  var n2 = r2.h, e3 = r2.s, u2 = r2.l, a2 = r2.a, o3 = void 0 === a2 ? 1 : a2;
  if (!t(n2) || !t(e3) || !t(u2))
    return null;
  var i2 = g({ h: Number(n2), s: Number(e3), l: Number(u2), a: Number(o3) });
  return f(i2);
}, "hsl"], [function(r2) {
  var n2 = r2.h, a2 = r2.s, o3 = r2.v, i2 = r2.a, s2 = void 0 === i2 ? 1 : i2;
  if (!t(n2) || !t(a2) || !t(o3))
    return null;
  var h2 = function(r3) {
    return { h: u(r3.h), s: e(r3.s, 0, 100), v: e(r3.v, 0, 100), a: e(r3.a) };
  }({ h: Number(n2), s: Number(a2), v: Number(o3), a: Number(s2) });
  return b(h2);
}, "hsv"]] };
var N = function(r2, t2) {
  for (var n2 = 0; n2 < t2.length; n2++) {
    var e3 = t2[n2][0](r2);
    if (e3)
      return [e3, t2[n2][1]];
  }
  return [null, void 0];
};
var x = function(r2) {
  return "string" == typeof r2 ? N(r2.trim(), y.string) : "object" == typeof r2 && null !== r2 ? N(r2, y.object) : [null, void 0];
};
var M = function(r2, t2) {
  var n2 = c(r2);
  return { h: n2.h, s: e(n2.s + 100 * t2, 0, 100), l: n2.l, a: n2.a };
};
var H = function(r2) {
  return (299 * r2.r + 587 * r2.g + 114 * r2.b) / 1e3 / 255;
};
var $ = function(r2, t2) {
  var n2 = c(r2);
  return { h: n2.h, s: n2.s, l: e(n2.l + 100 * t2, 0, 100), a: n2.a };
};
var j = function() {
  function r2(r3) {
    this.parsed = x(r3)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return r2.prototype.isValid = function() {
    return null !== this.parsed;
  }, r2.prototype.brightness = function() {
    return n(H(this.rgba), 2);
  }, r2.prototype.isDark = function() {
    return H(this.rgba) < 0.5;
  }, r2.prototype.isLight = function() {
    return H(this.rgba) >= 0.5;
  }, r2.prototype.toHex = function() {
    return r3 = o(this.rgba), t2 = r3.r, e3 = r3.g, u2 = r3.b, i2 = (a2 = r3.a) < 1 ? s(n(255 * a2)) : "", "#" + s(t2) + s(e3) + s(u2) + i2;
    var r3, t2, e3, u2, a2, i2;
  }, r2.prototype.toRgb = function() {
    return o(this.rgba);
  }, r2.prototype.toRgbString = function() {
    return r3 = o(this.rgba), t2 = r3.r, n2 = r3.g, e3 = r3.b, (u2 = r3.a) < 1 ? "rgba(" + t2 + ", " + n2 + ", " + e3 + ", " + u2 + ")" : "rgb(" + t2 + ", " + n2 + ", " + e3 + ")";
    var r3, t2, n2, e3, u2;
  }, r2.prototype.toHsl = function() {
    return d(c(this.rgba));
  }, r2.prototype.toHslString = function() {
    return r3 = d(c(this.rgba)), t2 = r3.h, n2 = r3.s, e3 = r3.l, (u2 = r3.a) < 1 ? "hsla(" + t2 + ", " + n2 + "%, " + e3 + "%, " + u2 + ")" : "hsl(" + t2 + ", " + n2 + "%, " + e3 + "%)";
    var r3, t2, n2, e3, u2;
  }, r2.prototype.toHsv = function() {
    return r3 = h(this.rgba), { h: n(r3.h), s: n(r3.s), v: n(r3.v), a: n(r3.a, 3) };
    var r3;
  }, r2.prototype.invert = function() {
    return w({ r: 255 - (r3 = this.rgba).r, g: 255 - r3.g, b: 255 - r3.b, a: r3.a });
    var r3;
  }, r2.prototype.saturate = function(r3) {
    return void 0 === r3 && (r3 = 0.1), w(M(this.rgba, r3));
  }, r2.prototype.desaturate = function(r3) {
    return void 0 === r3 && (r3 = 0.1), w(M(this.rgba, -r3));
  }, r2.prototype.grayscale = function() {
    return w(M(this.rgba, -1));
  }, r2.prototype.lighten = function(r3) {
    return void 0 === r3 && (r3 = 0.1), w($(this.rgba, r3));
  }, r2.prototype.darken = function(r3) {
    return void 0 === r3 && (r3 = 0.1), w($(this.rgba, -r3));
  }, r2.prototype.rotate = function(r3) {
    return void 0 === r3 && (r3 = 15), this.hue(this.hue() + r3);
  }, r2.prototype.alpha = function(r3) {
    return "number" == typeof r3 ? w({ r: (t2 = this.rgba).r, g: t2.g, b: t2.b, a: r3 }) : n(this.rgba.a, 3);
    var t2;
  }, r2.prototype.hue = function(r3) {
    var t2 = c(this.rgba);
    return "number" == typeof r3 ? w({ h: r3, s: t2.s, l: t2.l, a: t2.a }) : n(t2.h);
  }, r2.prototype.isEqual = function(r3) {
    return this.toHex() === w(r3).toHex();
  }, r2;
}();
var w = function(r2) {
  return r2 instanceof j ? r2 : new j(r2);
};
var S = [];
var k = function(r2) {
  r2.forEach(function(r3) {
    S.indexOf(r3) < 0 && (r3(j, y), S.push(r3));
  });
};

// ../../node_modules/.pnpm/colord@2.9.3/node_modules/colord/plugins/names.mjs
function names_default(e3, f4) {
  var a2 = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, r2 = {};
  for (var d2 in a2)
    r2[a2[d2]] = d2;
  var l3 = {};
  e3.prototype.toName = function(f5) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b))
      return "transparent";
    var d3, i2, n2 = r2[this.toHex()];
    if (n2)
      return n2;
    if (null == f5 ? void 0 : f5.closest) {
      var o3 = this.toRgb(), t2 = 1 / 0, b3 = "black";
      if (!l3.length)
        for (var c2 in a2)
          l3[c2] = new e3(a2[c2]).toRgb();
      for (var g3 in a2) {
        var u2 = (d3 = o3, i2 = l3[g3], Math.pow(d3.r - i2.r, 2) + Math.pow(d3.g - i2.g, 2) + Math.pow(d3.b - i2.b, 2));
        u2 < t2 && (t2 = u2, b3 = g3);
      }
      return b3;
    }
  };
  f4.string.push([function(f5) {
    var r3 = f5.toLowerCase(), d3 = "transparent" === r3 ? "#0000" : a2[r3];
    return d3 ? new e3(d3).toRgb() : null;
  }, "name"]);
}

// ../../node_modules/.pnpm/@pixi+color@7.2.4/node_modules/@pixi/color/lib/Color.mjs
k([names_default]);
var _Color = class {
  constructor(value = 16777215) {
    this._value = null;
    this._components = new Float32Array(4);
    this._components.fill(1);
    this._int = 16777215;
    this.value = value;
  }
  get red() {
    return this._components[0];
  }
  get green() {
    return this._components[1];
  }
  get blue() {
    return this._components[2];
  }
  get alpha() {
    return this._components[3];
  }
  setValue(value) {
    this.value = value;
    return this;
  }
  set value(value) {
    if (value instanceof _Color) {
      this._value = this.cloneSource(value._value);
      this._int = value._int;
      this._components.set(value._components);
    } else if (value === null) {
      throw new Error("Cannot set PIXI.Color#value to null");
    } else if (this._value === null || !this.isSourceEqual(this._value, value)) {
      this.normalize(value);
      this._value = this.cloneSource(value);
    }
  }
  get value() {
    return this._value;
  }
  cloneSource(value) {
    if (typeof value === "string" || typeof value === "number" || value instanceof Number || value === null) {
      return value;
    } else if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      return value.slice(0);
    } else if (typeof value === "object" && value !== null) {
      return { ...value };
    }
    return value;
  }
  isSourceEqual(value1, value2) {
    const type1 = typeof value1;
    const type2 = typeof value2;
    if (type1 !== type2) {
      return false;
    } else if (type1 === "number" || type1 === "string" || value1 instanceof Number) {
      return value1 === value2;
    } else if (Array.isArray(value1) && Array.isArray(value2) || ArrayBuffer.isView(value1) && ArrayBuffer.isView(value2)) {
      if (value1.length !== value2.length) {
        return false;
      }
      return value1.every((v2, i2) => v2 === value2[i2]);
    } else if (value1 !== null && value2 !== null) {
      const keys1 = Object.keys(value1);
      const keys2 = Object.keys(value2);
      if (keys1.length !== keys2.length) {
        return false;
      }
      return keys1.every((key) => value1[key] === value2[key]);
    }
    return value1 === value2;
  }
  toRgba() {
    const [r2, g3, b3, a2] = this._components;
    return { r: r2, g: g3, b: b3, a: a2 };
  }
  toRgb() {
    const [r2, g3, b3] = this._components;
    return { r: r2, g: g3, b: b3 };
  }
  toRgbaString() {
    const [r2, g3, b3] = this.toUint8RgbArray();
    return `rgba(${r2},${g3},${b3},${this.alpha})`;
  }
  toUint8RgbArray(out) {
    const [r2, g3, b3] = this._components;
    out = out ?? [];
    out[0] = Math.round(r2 * 255);
    out[1] = Math.round(g3 * 255);
    out[2] = Math.round(b3 * 255);
    return out;
  }
  toRgbArray(out) {
    out = out ?? [];
    const [r2, g3, b3] = this._components;
    out[0] = r2;
    out[1] = g3;
    out[2] = b3;
    return out;
  }
  toNumber() {
    return this._int;
  }
  toLittleEndianNumber() {
    const value = this._int;
    return (value >> 16) + (value & 65280) + ((value & 255) << 16);
  }
  multiply(value) {
    const [r2, g3, b3, a2] = _Color.temp.setValue(value)._components;
    this._components[0] *= r2;
    this._components[1] *= g3;
    this._components[2] *= b3;
    this._components[3] *= a2;
    this.refreshInt();
    this._value = null;
    return this;
  }
  premultiply(alpha, applyToRGB = true) {
    if (applyToRGB) {
      this._components[0] *= alpha;
      this._components[1] *= alpha;
      this._components[2] *= alpha;
    }
    this._components[3] = alpha;
    this.refreshInt();
    this._value = null;
    return this;
  }
  toPremultiplied(alpha, applyToRGB = true) {
    if (alpha === 1) {
      return (255 << 24) + this._int;
    }
    if (alpha === 0) {
      return applyToRGB ? 0 : this._int;
    }
    let r2 = this._int >> 16 & 255;
    let g3 = this._int >> 8 & 255;
    let b3 = this._int & 255;
    if (applyToRGB) {
      r2 = r2 * alpha + 0.5 | 0;
      g3 = g3 * alpha + 0.5 | 0;
      b3 = b3 * alpha + 0.5 | 0;
    }
    return (alpha * 255 << 24) + (r2 << 16) + (g3 << 8) + b3;
  }
  toHex() {
    const hexString = this._int.toString(16);
    return `#${"000000".substring(0, 6 - hexString.length) + hexString}`;
  }
  toHexa() {
    const alphaValue = Math.round(this._components[3] * 255);
    const alphaString = alphaValue.toString(16);
    return this.toHex() + "00".substring(0, 2 - alphaString.length) + alphaString;
  }
  setAlpha(alpha) {
    this._components[3] = this._clamp(alpha);
    return this;
  }
  round(steps) {
    const [r2, g3, b3] = this._components;
    this._components[0] = Math.round(r2 * steps) / steps;
    this._components[1] = Math.round(g3 * steps) / steps;
    this._components[2] = Math.round(b3 * steps) / steps;
    this.refreshInt();
    this._value = null;
    return this;
  }
  toArray(out) {
    out = out ?? [];
    const [r2, g3, b3, a2] = this._components;
    out[0] = r2;
    out[1] = g3;
    out[2] = b3;
    out[3] = a2;
    return out;
  }
  normalize(value) {
    let r2;
    let g3;
    let b3;
    let a2;
    if ((typeof value === "number" || value instanceof Number) && value >= 0 && value <= 16777215) {
      const int = value;
      r2 = (int >> 16 & 255) / 255;
      g3 = (int >> 8 & 255) / 255;
      b3 = (int & 255) / 255;
      a2 = 1;
    } else if ((Array.isArray(value) || value instanceof Float32Array) && value.length >= 3 && value.length <= 4) {
      value = this._clamp(value);
      [r2, g3, b3, a2 = 1] = value;
    } else if ((value instanceof Uint8Array || value instanceof Uint8ClampedArray) && value.length >= 3 && value.length <= 4) {
      value = this._clamp(value, 0, 255);
      [r2, g3, b3, a2 = 255] = value;
      r2 /= 255;
      g3 /= 255;
      b3 /= 255;
      a2 /= 255;
    } else if (typeof value === "string" || typeof value === "object") {
      if (typeof value === "string") {
        const match = _Color.HEX_PATTERN.exec(value);
        if (match) {
          value = `#${match[2]}`;
        }
      }
      const color = w(value);
      if (color.isValid()) {
        ({ r: r2, g: g3, b: b3, a: a2 } = color.rgba);
        r2 /= 255;
        g3 /= 255;
        b3 /= 255;
      }
    }
    if (r2 !== void 0) {
      this._components[0] = r2;
      this._components[1] = g3;
      this._components[2] = b3;
      this._components[3] = a2;
      this.refreshInt();
    } else {
      throw new Error(`Unable to convert color ${value}`);
    }
  }
  refreshInt() {
    this._clamp(this._components);
    const [r2, g3, b3] = this._components;
    this._int = (r2 * 255 << 16) + (g3 * 255 << 8) + (b3 * 255 | 0);
  }
  _clamp(value, min = 0, max = 1) {
    if (typeof value === "number") {
      return Math.min(Math.max(value, min), max);
    }
    value.forEach((v2, i2) => {
      value[i2] = Math.min(Math.max(v2, min), max);
    });
    return value;
  }
};
var Color = _Color;
Color.shared = new _Color();
Color.temp = new _Color();
Color.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/color/hex.mjs
function hex2rgb(hex, out = []) {
  deprecation("7.2.0", "utils.hex2rgb is deprecated, use Color#toRgbArray instead");
  return Color.shared.setValue(hex).toRgbArray(out);
}
function hex2string(hex) {
  deprecation("7.2.0", "utils.hex2string is deprecated, use Color#toHex instead");
  return Color.shared.setValue(hex).toHex();
}
function string2hex(string) {
  deprecation("7.2.0", "utils.string2hex is deprecated, use Color#toNumber instead");
  return Color.shared.setValue(string).toNumber();
}
function rgb2hex(rgb) {
  deprecation("7.2.0", "utils.rgb2hex is deprecated, use Color#toNumber instead");
  return Color.shared.setValue(rgb).toNumber();
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/color/premultiply.mjs
function mapPremultipliedBlendModes() {
  const pm = [];
  const npm = [];
  for (let i2 = 0; i2 < 32; i2++) {
    pm[i2] = i2;
    npm[i2] = i2;
  }
  pm[BLEND_MODES.NORMAL_NPM] = BLEND_MODES.NORMAL;
  pm[BLEND_MODES.ADD_NPM] = BLEND_MODES.ADD;
  pm[BLEND_MODES.SCREEN_NPM] = BLEND_MODES.SCREEN;
  npm[BLEND_MODES.NORMAL] = BLEND_MODES.NORMAL_NPM;
  npm[BLEND_MODES.ADD] = BLEND_MODES.ADD_NPM;
  npm[BLEND_MODES.SCREEN] = BLEND_MODES.SCREEN_NPM;
  const array = [];
  array.push(npm);
  array.push(pm);
  return array;
}
var premultiplyBlendMode = mapPremultipliedBlendModes();
function correctBlendMode(blendMode, premultiplied) {
  return premultiplyBlendMode[premultiplied ? 1 : 0][blendMode];
}
function premultiplyRgba(rgb, alpha, out, premultiply = true) {
  deprecation("7.2.0", `utils.premultiplyRgba has moved to Color.premultiply`);
  return Color.shared.setValue(rgb).premultiply(alpha, premultiply).toArray(out ?? new Float32Array(4));
}
function premultiplyTint(tint, alpha) {
  deprecation("7.2.0", `utils.premultiplyTint has moved to Color.toPremultiplied`);
  return Color.shared.setValue(tint).toPremultiplied(alpha);
}
function premultiplyTintToRgba(tint, alpha, out, premultiply = true) {
  deprecation("7.2.0", `utils.premultiplyTintToRgba has moved to Color.premultiply`);
  return Color.shared.setValue(tint).premultiply(alpha, premultiply).toArray(out ?? new Float32Array(4));
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/const.mjs
var DATA_URI = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i;

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/data/createIndicesForQuads.mjs
function createIndicesForQuads(size, outBuffer = null) {
  const totalIndices = size * 6;
  outBuffer = outBuffer || new Uint16Array(totalIndices);
  if (outBuffer.length !== totalIndices) {
    throw new Error(`Out buffer length is incorrect, got ${outBuffer.length} and expected ${totalIndices}`);
  }
  for (let i2 = 0, j3 = 0; i2 < totalIndices; i2 += 6, j3 += 4) {
    outBuffer[i2 + 0] = j3 + 0;
    outBuffer[i2 + 1] = j3 + 1;
    outBuffer[i2 + 2] = j3 + 2;
    outBuffer[i2 + 3] = j3 + 0;
    outBuffer[i2 + 4] = j3 + 2;
    outBuffer[i2 + 5] = j3 + 3;
  }
  return outBuffer;
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/data/getBufferType.mjs
function getBufferType(array) {
  if (array.BYTES_PER_ELEMENT === 4) {
    if (array instanceof Float32Array) {
      return "Float32Array";
    } else if (array instanceof Uint32Array) {
      return "Uint32Array";
    }
    return "Int32Array";
  } else if (array.BYTES_PER_ELEMENT === 2) {
    if (array instanceof Uint16Array) {
      return "Uint16Array";
    }
  } else if (array.BYTES_PER_ELEMENT === 1) {
    if (array instanceof Uint8Array) {
      return "Uint8Array";
    }
  }
  return null;
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/data/interleaveTypedArrays.mjs
var map = { Float32Array, Uint32Array, Int32Array, Uint8Array };
function interleaveTypedArrays(arrays, sizes) {
  let outSize = 0;
  let stride = 0;
  const views = {};
  for (let i2 = 0; i2 < arrays.length; i2++) {
    stride += sizes[i2];
    outSize += arrays[i2].length;
  }
  const buffer = new ArrayBuffer(outSize * 4);
  let out = null;
  let littleOffset = 0;
  for (let i2 = 0; i2 < arrays.length; i2++) {
    const size = sizes[i2];
    const array = arrays[i2];
    const type = getBufferType(array);
    if (!views[type]) {
      views[type] = new map[type](buffer);
    }
    out = views[type];
    for (let j3 = 0; j3 < array.length; j3++) {
      const indexStart = (j3 / size | 0) * stride + littleOffset;
      const index = j3 % size;
      out[indexStart + index] = array[j3];
    }
    littleOffset += size;
  }
  return new Float32Array(buffer);
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/data/pow2.mjs
function nextPow2(v2) {
  v2 += v2 === 0 ? 1 : 0;
  --v2;
  v2 |= v2 >>> 1;
  v2 |= v2 >>> 2;
  v2 |= v2 >>> 4;
  v2 |= v2 >>> 8;
  v2 |= v2 >>> 16;
  return v2 + 1;
}
function isPow2(v2) {
  return !(v2 & v2 - 1) && !!v2;
}
function log2(v2) {
  let r2 = (v2 > 65535 ? 1 : 0) << 4;
  v2 >>>= r2;
  let shift = (v2 > 255 ? 1 : 0) << 3;
  v2 >>>= shift;
  r2 |= shift;
  shift = (v2 > 15 ? 1 : 0) << 2;
  v2 >>>= shift;
  r2 |= shift;
  shift = (v2 > 3 ? 1 : 0) << 1;
  v2 >>>= shift;
  r2 |= shift;
  return r2 | v2 >> 1;
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/data/removeItems.mjs
function removeItems(arr, startIdx, removeCount) {
  const length = arr.length;
  let i2;
  if (startIdx >= length || removeCount === 0) {
    return;
  }
  removeCount = startIdx + removeCount > length ? length - startIdx : removeCount;
  const len = length - removeCount;
  for (i2 = startIdx; i2 < len; ++i2) {
    arr[i2] = arr[i2 + removeCount];
  }
  arr.length = len;
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/data/sign.mjs
function sign(n2) {
  if (n2 === 0)
    return 0;
  return n2 < 0 ? -1 : 1;
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/data/uid.mjs
var nextUid = 0;
function uid() {
  return ++nextUid;
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/media/BoundingBox.mjs
var _BoundingBox = class {
  constructor(left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }
  get width() {
    return this.right - this.left;
  }
  get height() {
    return this.bottom - this.top;
  }
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
};
var BoundingBox = _BoundingBox;
BoundingBox.EMPTY = new _BoundingBox(0, 0, 0, 0);

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/media/caches.mjs
var ProgramCache = {};
var TextureCache = /* @__PURE__ */ Object.create(null);
var BaseTextureCache = /* @__PURE__ */ Object.create(null);
function destroyTextureCache() {
  let key;
  for (key in TextureCache) {
    TextureCache[key].destroy();
  }
  for (key in BaseTextureCache) {
    BaseTextureCache[key].destroy();
  }
}
function clearTextureCache() {
  let key;
  for (key in TextureCache) {
    delete TextureCache[key];
  }
  for (key in BaseTextureCache) {
    delete BaseTextureCache[key];
  }
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/media/CanvasRenderTarget.mjs
var CanvasRenderTarget = class {
  constructor(width, height, resolution) {
    this._canvas = settings.ADAPTER.createCanvas();
    this._context = this._canvas.getContext("2d");
    this.resolution = resolution || settings.RESOLUTION;
    this.resize(width, height);
  }
  clear() {
    this._checkDestroyed();
    this._context.setTransform(1, 0, 0, 1, 0, 0);
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }
  resize(desiredWidth, desiredHeight) {
    this._checkDestroyed();
    this._canvas.width = Math.round(desiredWidth * this.resolution);
    this._canvas.height = Math.round(desiredHeight * this.resolution);
  }
  destroy() {
    this._context = null;
    this._canvas = null;
  }
  get width() {
    this._checkDestroyed();
    return this._canvas.width;
  }
  set width(val) {
    this._checkDestroyed();
    this._canvas.width = Math.round(val);
  }
  get height() {
    this._checkDestroyed();
    return this._canvas.height;
  }
  set height(val) {
    this._checkDestroyed();
    this._canvas.height = Math.round(val);
  }
  get canvas() {
    this._checkDestroyed();
    return this._canvas;
  }
  get context() {
    this._checkDestroyed();
    return this._context;
  }
  _checkDestroyed() {
    if (this._canvas === null) {
      throw new TypeError("The CanvasRenderTarget has already been destroyed");
    }
  }
};

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/media/getCanvasBoundingBox.mjs
function checkRow(data, width, y2) {
  for (let x2 = 0, index = 4 * y2 * width; x2 < width; ++x2, index += 4) {
    if (data[index + 3] !== 0)
      return false;
  }
  return true;
}
function checkColumn(data, width, x2, top, bottom) {
  const stride = 4 * width;
  for (let y2 = top, index = top * stride + 4 * x2; y2 <= bottom; ++y2, index += stride) {
    if (data[index + 3] !== 0)
      return false;
  }
  return true;
}
function getCanvasBoundingBox(canvas) {
  const { width, height } = canvas;
  const context2 = canvas.getContext("2d", {
    willReadFrequently: true
  });
  if (context2 === null) {
    throw new TypeError("Failed to get canvas 2D context");
  }
  const imageData = context2.getImageData(0, 0, width, height);
  const data = imageData.data;
  let left = 0;
  let top = 0;
  let right = width - 1;
  let bottom = height - 1;
  while (top < height && checkRow(data, width, top))
    ++top;
  if (top === height)
    return BoundingBox.EMPTY;
  while (checkRow(data, width, bottom))
    --bottom;
  while (checkColumn(data, width, left, top, bottom))
    ++left;
  while (checkColumn(data, width, right, top, bottom))
    --right;
  ++right;
  ++bottom;
  return new BoundingBox(left, top, right, bottom);
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/media/trimCanvas.mjs
function trimCanvas(canvas) {
  const boundingBox = getCanvasBoundingBox(canvas);
  const { width, height } = boundingBox;
  let data = null;
  if (!boundingBox.isEmpty()) {
    const context2 = canvas.getContext("2d");
    if (context2 === null) {
      throw new TypeError("Failed to get canvas 2D context");
    }
    data = context2.getImageData(boundingBox.left, boundingBox.top, width, height);
  }
  return { width, height, data };
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/network/decomposeDataUri.mjs
function decomposeDataUri(dataUri) {
  const dataUriMatch = DATA_URI.exec(dataUri);
  if (dataUriMatch) {
    return {
      mediaType: dataUriMatch[1] ? dataUriMatch[1].toLowerCase() : void 0,
      subType: dataUriMatch[2] ? dataUriMatch[2].toLowerCase() : void 0,
      charset: dataUriMatch[3] ? dataUriMatch[3].toLowerCase() : void 0,
      encoding: dataUriMatch[4] ? dataUriMatch[4].toLowerCase() : void 0,
      data: dataUriMatch[5]
    };
  }
  return void 0;
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/network/determineCrossOrigin.mjs
var tempAnchor;
function determineCrossOrigin(url$1, loc = globalThis.location) {
  if (url$1.startsWith("data:")) {
    return "";
  }
  loc = loc || globalThis.location;
  if (!tempAnchor) {
    tempAnchor = document.createElement("a");
  }
  tempAnchor.href = url$1;
  const parsedUrl = url.parse(tempAnchor.href);
  const samePort = !parsedUrl.port && loc.port === "" || parsedUrl.port === loc.port;
  if (parsedUrl.hostname !== loc.hostname || !samePort || parsedUrl.protocol !== loc.protocol) {
    return "anonymous";
  }
  return "";
}

// ../../node_modules/.pnpm/@pixi+utils@7.2.4/node_modules/@pixi/utils/lib/network/getResolutionOfUrl.mjs
function getResolutionOfUrl(url2, defaultValue2 = 1) {
  const resolution = settings.RETINA_PREFIX?.exec(url2);
  if (resolution) {
    return parseFloat(resolution[1]);
  }
  return defaultValue2;
}

// ../../node_modules/.pnpm/@pixi+extensions@7.2.4/node_modules/@pixi/extensions/lib/index.mjs
var ExtensionType = /* @__PURE__ */ ((ExtensionType2) => {
  ExtensionType2["Renderer"] = "renderer";
  ExtensionType2["Application"] = "application";
  ExtensionType2["RendererSystem"] = "renderer-webgl-system";
  ExtensionType2["RendererPlugin"] = "renderer-webgl-plugin";
  ExtensionType2["CanvasRendererSystem"] = "renderer-canvas-system";
  ExtensionType2["CanvasRendererPlugin"] = "renderer-canvas-plugin";
  ExtensionType2["Asset"] = "asset";
  ExtensionType2["LoadParser"] = "load-parser";
  ExtensionType2["ResolveParser"] = "resolve-parser";
  ExtensionType2["CacheParser"] = "cache-parser";
  ExtensionType2["DetectionParser"] = "detection-parser";
  return ExtensionType2;
})(ExtensionType || {});
var normalizeExtension = (ext) => {
  if (typeof ext === "function" || typeof ext === "object" && ext.extension) {
    if (!ext.extension) {
      throw new Error("Extension class must have an extension object");
    }
    const metadata = typeof ext.extension !== "object" ? { type: ext.extension } : ext.extension;
    ext = { ...metadata, ref: ext };
  }
  if (typeof ext === "object") {
    ext = { ...ext };
  } else {
    throw new Error("Invalid extension type");
  }
  if (typeof ext.type === "string") {
    ext.type = [ext.type];
  }
  return ext;
};
var normalizePriority = (ext, defaultPriority) => normalizeExtension(ext).priority ?? defaultPriority;
var extensions = {
  _addHandlers: {},
  _removeHandlers: {},
  _queue: {},
  remove(...extensions22) {
    extensions22.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => this._removeHandlers[type]?.(ext));
    });
    return this;
  },
  add(...extensions22) {
    extensions22.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => {
        const handlers = this._addHandlers;
        const queue = this._queue;
        if (!handlers[type]) {
          queue[type] = queue[type] || [];
          queue[type].push(ext);
        } else {
          handlers[type](ext);
        }
      });
    });
    return this;
  },
  handle(type, onAdd, onRemove) {
    const addHandlers = this._addHandlers;
    const removeHandlers = this._removeHandlers;
    if (addHandlers[type] || removeHandlers[type]) {
      throw new Error(`Extension type ${type} already has a handler`);
    }
    addHandlers[type] = onAdd;
    removeHandlers[type] = onRemove;
    const queue = this._queue;
    if (queue[type]) {
      queue[type].forEach((ext) => onAdd(ext));
      delete queue[type];
    }
    return this;
  },
  handleByMap(type, map4) {
    return this.handle(type, (extension) => {
      map4[extension.name] = extension.ref;
    }, (extension) => {
      delete map4[extension.name];
    });
  },
  handleByList(type, list, defaultPriority = -1) {
    return this.handle(type, (extension) => {
      if (list.includes(extension.ref)) {
        return;
      }
      list.push(extension.ref);
      list.sort((a2, b3) => normalizePriority(b3, defaultPriority) - normalizePriority(a2, defaultPriority));
    }, (extension) => {
      const index = list.indexOf(extension.ref);
      if (index !== -1) {
        list.splice(index, 1);
      }
    });
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/geometry/ViewableBuffer.mjs
var ViewableBuffer = class {
  constructor(sizeOrBuffer) {
    if (typeof sizeOrBuffer === "number") {
      this.rawBinaryData = new ArrayBuffer(sizeOrBuffer);
    } else if (sizeOrBuffer instanceof Uint8Array) {
      this.rawBinaryData = sizeOrBuffer.buffer;
    } else {
      this.rawBinaryData = sizeOrBuffer;
    }
    this.uint32View = new Uint32Array(this.rawBinaryData);
    this.float32View = new Float32Array(this.rawBinaryData);
  }
  get int8View() {
    if (!this._int8View) {
      this._int8View = new Int8Array(this.rawBinaryData);
    }
    return this._int8View;
  }
  get uint8View() {
    if (!this._uint8View) {
      this._uint8View = new Uint8Array(this.rawBinaryData);
    }
    return this._uint8View;
  }
  get int16View() {
    if (!this._int16View) {
      this._int16View = new Int16Array(this.rawBinaryData);
    }
    return this._int16View;
  }
  get uint16View() {
    if (!this._uint16View) {
      this._uint16View = new Uint16Array(this.rawBinaryData);
    }
    return this._uint16View;
  }
  get int32View() {
    if (!this._int32View) {
      this._int32View = new Int32Array(this.rawBinaryData);
    }
    return this._int32View;
  }
  view(type) {
    return this[`${type}View`];
  }
  destroy() {
    this.rawBinaryData = null;
    this._int8View = null;
    this._uint8View = null;
    this._int16View = null;
    this._uint16View = null;
    this._int32View = null;
    this.uint32View = null;
    this.float32View = null;
  }
  static sizeOf(type) {
    switch (type) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(`${type} isn't a valid view type`);
    }
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/checkMaxIfStatementsInShader.mjs
var fragTemplate = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join("\n");
function generateIfTestSrc(maxIfs) {
  let src = "";
  for (let i2 = 0; i2 < maxIfs; ++i2) {
    if (i2 > 0) {
      src += "\nelse ";
    }
    if (i2 < maxIfs - 1) {
      src += `if(test == ${i2}.0){}`;
    }
  }
  return src;
}
function checkMaxIfStatementsInShader(maxIfs, gl) {
  if (maxIfs === 0) {
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  }
  const shader = gl.createShader(gl.FRAGMENT_SHADER);
  while (true) {
    const fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));
    gl.shaderSource(shader, fragmentSrc);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      maxIfs = maxIfs / 2 | 0;
    } else {
      break;
    }
  }
  return maxIfs;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/state/State.mjs
var BLEND = 0;
var OFFSET = 1;
var CULLING = 2;
var DEPTH_TEST = 3;
var WINDING = 4;
var DEPTH_MASK = 5;
var State = class {
  constructor() {
    this.data = 0;
    this.blendMode = BLEND_MODES.NORMAL;
    this.polygonOffset = 0;
    this.blend = true;
    this.depthMask = true;
  }
  get blend() {
    return !!(this.data & 1 << BLEND);
  }
  set blend(value) {
    if (!!(this.data & 1 << BLEND) !== value) {
      this.data ^= 1 << BLEND;
    }
  }
  get offsets() {
    return !!(this.data & 1 << OFFSET);
  }
  set offsets(value) {
    if (!!(this.data & 1 << OFFSET) !== value) {
      this.data ^= 1 << OFFSET;
    }
  }
  get culling() {
    return !!(this.data & 1 << CULLING);
  }
  set culling(value) {
    if (!!(this.data & 1 << CULLING) !== value) {
      this.data ^= 1 << CULLING;
    }
  }
  get depthTest() {
    return !!(this.data & 1 << DEPTH_TEST);
  }
  set depthTest(value) {
    if (!!(this.data & 1 << DEPTH_TEST) !== value) {
      this.data ^= 1 << DEPTH_TEST;
    }
  }
  get depthMask() {
    return !!(this.data & 1 << DEPTH_MASK);
  }
  set depthMask(value) {
    if (!!(this.data & 1 << DEPTH_MASK) !== value) {
      this.data ^= 1 << DEPTH_MASK;
    }
  }
  get clockwiseFrontFace() {
    return !!(this.data & 1 << WINDING);
  }
  set clockwiseFrontFace(value) {
    if (!!(this.data & 1 << WINDING) !== value) {
      this.data ^= 1 << WINDING;
    }
  }
  get blendMode() {
    return this._blendMode;
  }
  set blendMode(value) {
    this.blend = value !== BLEND_MODES.NONE;
    this._blendMode = value;
  }
  get polygonOffset() {
    return this._polygonOffset;
  }
  set polygonOffset(value) {
    this.offsets = !!value;
    this._polygonOffset = value;
  }
  toString() {
    return `[@pixi/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`;
  }
  static for2d() {
    const state = new State();
    state.depthTest = false;
    state.blend = true;
    return state;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/autoDetectResource.mjs
var INSTALLED = [];
function autoDetectResource(source, options) {
  if (!source) {
    return null;
  }
  let extension = "";
  if (typeof source === "string") {
    const result = /\.(\w{3,4})(?:$|\?|#)/i.exec(source);
    if (result) {
      extension = result[1].toLowerCase();
    }
  }
  for (let i2 = INSTALLED.length - 1; i2 >= 0; --i2) {
    const ResourcePlugin = INSTALLED[i2];
    if (ResourcePlugin.test && ResourcePlugin.test(source, extension)) {
      return new ResourcePlugin(source, options);
    }
  }
  throw new Error("Unrecognized source type to auto-detect Resource");
}

// ../../node_modules/.pnpm/@pixi+runner@7.2.4/node_modules/@pixi/runner/lib/Runner.mjs
var Runner = class {
  constructor(name) {
    this.items = [];
    this._name = name;
    this._aliasCount = 0;
  }
  emit(a0, a1, a2, a3, a4, a5, a6, a7) {
    if (arguments.length > 8) {
      throw new Error("max arguments reached");
    }
    const { name, items } = this;
    this._aliasCount++;
    for (let i2 = 0, len = items.length; i2 < len; i2++) {
      items[i2][name](a0, a1, a2, a3, a4, a5, a6, a7);
    }
    if (items === this.items) {
      this._aliasCount--;
    }
    return this;
  }
  ensureNonAliasedItems() {
    if (this._aliasCount > 0 && this.items.length > 1) {
      this._aliasCount = 0;
      this.items = this.items.slice(0);
    }
  }
  add(item) {
    if (item[this._name]) {
      this.ensureNonAliasedItems();
      this.remove(item);
      this.items.push(item);
    }
    return this;
  }
  remove(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.ensureNonAliasedItems();
      this.items.splice(index, 1);
    }
    return this;
  }
  contains(item) {
    return this.items.includes(item);
  }
  removeAll() {
    this.ensureNonAliasedItems();
    this.items.length = 0;
    return this;
  }
  destroy() {
    this.removeAll();
    this.items = null;
    this._name = null;
  }
  get empty() {
    return this.items.length === 0;
  }
  get name() {
    return this._name;
  }
};
Object.defineProperties(Runner.prototype, {
  dispatch: { value: Runner.prototype.emit },
  run: { value: Runner.prototype.emit }
});

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/Resource.mjs
var Resource = class {
  constructor(width = 0, height = 0) {
    this._width = width;
    this._height = height;
    this.destroyed = false;
    this.internal = false;
    this.onResize = new Runner("setRealSize");
    this.onUpdate = new Runner("update");
    this.onError = new Runner("onError");
  }
  bind(baseTexture) {
    this.onResize.add(baseTexture);
    this.onUpdate.add(baseTexture);
    this.onError.add(baseTexture);
    if (this._width || this._height) {
      this.onResize.emit(this._width, this._height);
    }
  }
  unbind(baseTexture) {
    this.onResize.remove(baseTexture);
    this.onUpdate.remove(baseTexture);
    this.onError.remove(baseTexture);
  }
  resize(width, height) {
    if (width !== this._width || height !== this._height) {
      this._width = width;
      this._height = height;
      this.onResize.emit(width, height);
    }
  }
  get valid() {
    return !!this._width && !!this._height;
  }
  update() {
    if (!this.destroyed) {
      this.onUpdate.emit();
    }
  }
  load() {
    return Promise.resolve(this);
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  style(_renderer, _baseTexture, _glTexture) {
    return false;
  }
  dispose() {
  }
  destroy() {
    if (!this.destroyed) {
      this.destroyed = true;
      this.dispose();
      this.onError.removeAll();
      this.onError = null;
      this.onResize.removeAll();
      this.onResize = null;
      this.onUpdate.removeAll();
      this.onUpdate = null;
    }
  }
  static test(_source, _extension) {
    return false;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/BufferResource.mjs
var BufferResource = class extends Resource {
  constructor(source, options) {
    const { width, height } = options || {};
    if (!width || !height) {
      throw new Error("BufferResource width or height invalid");
    }
    super(width, height);
    this.data = source;
  }
  upload(renderer, baseTexture, glTexture) {
    const gl = renderer.gl;
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
    const width = baseTexture.realWidth;
    const height = baseTexture.realHeight;
    if (glTexture.width === width && glTexture.height === height) {
      gl.texSubImage2D(baseTexture.target, 0, 0, 0, width, height, baseTexture.format, glTexture.type, this.data);
    } else {
      glTexture.width = width;
      glTexture.height = height;
      gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, width, height, 0, baseTexture.format, glTexture.type, this.data);
    }
    return true;
  }
  dispose() {
    this.data = null;
  }
  static test(source) {
    return source instanceof Float32Array || source instanceof Uint8Array || source instanceof Uint32Array;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/BaseTexture.mjs
var defaultBufferOptions = {
  scaleMode: SCALE_MODES.NEAREST,
  format: FORMATS.RGBA,
  alphaMode: ALPHA_MODES.NPM
};
var _BaseTexture = class extends import_eventemitter3.default {
  constructor(resource = null, options = null) {
    super();
    options = Object.assign({}, _BaseTexture.defaultOptions, options);
    const {
      alphaMode,
      mipmap,
      anisotropicLevel,
      scaleMode,
      width,
      height,
      wrapMode,
      format: format2,
      type,
      target,
      resolution,
      resourceOptions
    } = options;
    if (resource && !(resource instanceof Resource)) {
      resource = autoDetectResource(resource, resourceOptions);
      resource.internal = true;
    }
    this.resolution = resolution || settings.RESOLUTION;
    this.width = Math.round((width || 0) * this.resolution) / this.resolution;
    this.height = Math.round((height || 0) * this.resolution) / this.resolution;
    this._mipmap = mipmap;
    this.anisotropicLevel = anisotropicLevel;
    this._wrapMode = wrapMode;
    this._scaleMode = scaleMode;
    this.format = format2;
    this.type = type;
    this.target = target;
    this.alphaMode = alphaMode;
    this.uid = uid();
    this.touched = 0;
    this.isPowerOfTwo = false;
    this._refreshPOT();
    this._glTextures = {};
    this.dirtyId = 0;
    this.dirtyStyleId = 0;
    this.cacheId = null;
    this.valid = width > 0 && height > 0;
    this.textureCacheIds = [];
    this.destroyed = false;
    this.resource = null;
    this._batchEnabled = 0;
    this._batchLocation = 0;
    this.parentTextureArray = null;
    this.setResource(resource);
  }
  get realWidth() {
    return Math.round(this.width * this.resolution);
  }
  get realHeight() {
    return Math.round(this.height * this.resolution);
  }
  get mipmap() {
    return this._mipmap;
  }
  set mipmap(value) {
    if (this._mipmap !== value) {
      this._mipmap = value;
      this.dirtyStyleId++;
    }
  }
  get scaleMode() {
    return this._scaleMode;
  }
  set scaleMode(value) {
    if (this._scaleMode !== value) {
      this._scaleMode = value;
      this.dirtyStyleId++;
    }
  }
  get wrapMode() {
    return this._wrapMode;
  }
  set wrapMode(value) {
    if (this._wrapMode !== value) {
      this._wrapMode = value;
      this.dirtyStyleId++;
    }
  }
  setStyle(scaleMode, mipmap) {
    let dirty;
    if (scaleMode !== void 0 && scaleMode !== this.scaleMode) {
      this.scaleMode = scaleMode;
      dirty = true;
    }
    if (mipmap !== void 0 && mipmap !== this.mipmap) {
      this.mipmap = mipmap;
      dirty = true;
    }
    if (dirty) {
      this.dirtyStyleId++;
    }
    return this;
  }
  setSize(desiredWidth, desiredHeight, resolution) {
    resolution = resolution || this.resolution;
    return this.setRealSize(desiredWidth * resolution, desiredHeight * resolution, resolution);
  }
  setRealSize(realWidth, realHeight, resolution) {
    this.resolution = resolution || this.resolution;
    this.width = Math.round(realWidth) / this.resolution;
    this.height = Math.round(realHeight) / this.resolution;
    this._refreshPOT();
    this.update();
    return this;
  }
  _refreshPOT() {
    this.isPowerOfTwo = isPow2(this.realWidth) && isPow2(this.realHeight);
  }
  setResolution(resolution) {
    const oldResolution = this.resolution;
    if (oldResolution === resolution) {
      return this;
    }
    this.resolution = resolution;
    if (this.valid) {
      this.width = Math.round(this.width * oldResolution) / resolution;
      this.height = Math.round(this.height * oldResolution) / resolution;
      this.emit("update", this);
    }
    this._refreshPOT();
    return this;
  }
  setResource(resource) {
    if (this.resource === resource) {
      return this;
    }
    if (this.resource) {
      throw new Error("Resource can be set only once");
    }
    resource.bind(this);
    this.resource = resource;
    return this;
  }
  update() {
    if (!this.valid) {
      if (this.width > 0 && this.height > 0) {
        this.valid = true;
        this.emit("loaded", this);
        this.emit("update", this);
      }
    } else {
      this.dirtyId++;
      this.dirtyStyleId++;
      this.emit("update", this);
    }
  }
  onError(event) {
    this.emit("error", this, event);
  }
  destroy() {
    if (this.resource) {
      this.resource.unbind(this);
      if (this.resource.internal) {
        this.resource.destroy();
      }
      this.resource = null;
    }
    if (this.cacheId) {
      delete BaseTextureCache[this.cacheId];
      delete TextureCache[this.cacheId];
      this.cacheId = null;
    }
    this.dispose();
    _BaseTexture.removeFromCache(this);
    this.textureCacheIds = null;
    this.destroyed = true;
  }
  dispose() {
    this.emit("dispose", this);
  }
  castToBaseTexture() {
    return this;
  }
  static from(source, options, strict = settings.STRICT_TEXTURE_CACHE) {
    const isFrame = typeof source === "string";
    let cacheId = null;
    if (isFrame) {
      cacheId = source;
    } else {
      if (!source._pixiId) {
        const prefix = options?.pixiIdPrefix || "pixiid";
        source._pixiId = `${prefix}_${uid()}`;
      }
      cacheId = source._pixiId;
    }
    let baseTexture = BaseTextureCache[cacheId];
    if (isFrame && strict && !baseTexture) {
      throw new Error(`The cacheId "${cacheId}" does not exist in BaseTextureCache.`);
    }
    if (!baseTexture) {
      baseTexture = new _BaseTexture(source, options);
      baseTexture.cacheId = cacheId;
      _BaseTexture.addToCache(baseTexture, cacheId);
    }
    return baseTexture;
  }
  static fromBuffer(buffer, width, height, options) {
    buffer = buffer || new Float32Array(width * height * 4);
    const resource = new BufferResource(buffer, { width, height });
    const type = buffer instanceof Float32Array ? TYPES.FLOAT : TYPES.UNSIGNED_BYTE;
    return new _BaseTexture(resource, Object.assign({}, defaultBufferOptions, { type }, options));
  }
  static addToCache(baseTexture, id) {
    if (id) {
      if (!baseTexture.textureCacheIds.includes(id)) {
        baseTexture.textureCacheIds.push(id);
      }
      if (BaseTextureCache[id] && BaseTextureCache[id] !== baseTexture) {
        console.warn(`BaseTexture added to the cache with an id [${id}] that already had an entry`);
      }
      BaseTextureCache[id] = baseTexture;
    }
  }
  static removeFromCache(baseTexture) {
    if (typeof baseTexture === "string") {
      const baseTextureFromCache = BaseTextureCache[baseTexture];
      if (baseTextureFromCache) {
        const index = baseTextureFromCache.textureCacheIds.indexOf(baseTexture);
        if (index > -1) {
          baseTextureFromCache.textureCacheIds.splice(index, 1);
        }
        delete BaseTextureCache[baseTexture];
        return baseTextureFromCache;
      }
    } else if (baseTexture?.textureCacheIds) {
      for (let i2 = 0; i2 < baseTexture.textureCacheIds.length; ++i2) {
        delete BaseTextureCache[baseTexture.textureCacheIds[i2]];
      }
      baseTexture.textureCacheIds.length = 0;
      return baseTexture;
    }
    return null;
  }
};
var BaseTexture = _BaseTexture;
BaseTexture.defaultOptions = {
  mipmap: MIPMAP_MODES.POW2,
  anisotropicLevel: 0,
  scaleMode: SCALE_MODES.LINEAR,
  wrapMode: WRAP_MODES.CLAMP,
  alphaMode: ALPHA_MODES.UNPACK,
  target: TARGETS.TEXTURE_2D,
  format: FORMATS.RGBA,
  type: TYPES.UNSIGNED_BYTE
};
BaseTexture._globalBatch = 0;

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/BatchDrawCall.mjs
var BatchDrawCall = class {
  constructor() {
    this.texArray = null;
    this.blend = 0;
    this.type = DRAW_MODES.TRIANGLES;
    this.start = 0;
    this.size = 0;
    this.data = null;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/geometry/Buffer.mjs
var UID = 0;
var Buffer2 = class {
  constructor(data, _static = true, index = false) {
    this.data = data || new Float32Array(1);
    this._glBuffers = {};
    this._updateID = 0;
    this.index = index;
    this.static = _static;
    this.id = UID++;
    this.disposeRunner = new Runner("disposeBuffer");
  }
  update(data) {
    if (data instanceof Array) {
      data = new Float32Array(data);
    }
    this.data = data || this.data;
    this._updateID++;
  }
  dispose() {
    this.disposeRunner.emit(this, false);
  }
  destroy() {
    this.dispose();
    this.data = null;
  }
  set index(value) {
    this.type = value ? BUFFER_TYPE.ELEMENT_ARRAY_BUFFER : BUFFER_TYPE.ARRAY_BUFFER;
  }
  get index() {
    return this.type === BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
  }
  static from(data) {
    if (data instanceof Array) {
      data = new Float32Array(data);
    }
    return new Buffer2(data);
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/geometry/Attribute.mjs
var Attribute = class {
  constructor(buffer, size = 0, normalized = false, type = TYPES.FLOAT, stride, start, instance, divisor = 1) {
    this.buffer = buffer;
    this.size = size;
    this.normalized = normalized;
    this.type = type;
    this.stride = stride;
    this.start = start;
    this.instance = instance;
    this.divisor = divisor;
  }
  destroy() {
    this.buffer = null;
  }
  static from(buffer, size, normalized, type, stride) {
    return new Attribute(buffer, size, normalized, type, stride);
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/geometry/utils/interleaveTypedArrays.mjs
var map2 = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array
};
function interleaveTypedArrays2(arrays, sizes) {
  let outSize = 0;
  let stride = 0;
  const views = {};
  for (let i2 = 0; i2 < arrays.length; i2++) {
    stride += sizes[i2];
    outSize += arrays[i2].length;
  }
  const buffer = new ArrayBuffer(outSize * 4);
  let out = null;
  let littleOffset = 0;
  for (let i2 = 0; i2 < arrays.length; i2++) {
    const size = sizes[i2];
    const array = arrays[i2];
    const type = getBufferType(array);
    if (!views[type]) {
      views[type] = new map2[type](buffer);
    }
    out = views[type];
    for (let j3 = 0; j3 < array.length; j3++) {
      const indexStart = (j3 / size | 0) * stride + littleOffset;
      const index = j3 % size;
      out[indexStart + index] = array[j3];
    }
    littleOffset += size;
  }
  return new Float32Array(buffer);
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/geometry/Geometry.mjs
var byteSizeMap = { 5126: 4, 5123: 2, 5121: 1 };
var UID2 = 0;
var map3 = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array,
  Uint16Array
};
var Geometry = class {
  constructor(buffers = [], attributes = {}) {
    this.buffers = buffers;
    this.indexBuffer = null;
    this.attributes = attributes;
    this.glVertexArrayObjects = {};
    this.id = UID2++;
    this.instanced = false;
    this.instanceCount = 1;
    this.disposeRunner = new Runner("disposeGeometry");
    this.refCount = 0;
  }
  addAttribute(id, buffer, size = 0, normalized = false, type, stride, start, instance = false) {
    if (!buffer) {
      throw new Error("You must pass a buffer when creating an attribute");
    }
    if (!(buffer instanceof Buffer2)) {
      if (buffer instanceof Array) {
        buffer = new Float32Array(buffer);
      }
      buffer = new Buffer2(buffer);
    }
    const ids = id.split("|");
    if (ids.length > 1) {
      for (let i2 = 0; i2 < ids.length; i2++) {
        this.addAttribute(ids[i2], buffer, size, normalized, type);
      }
      return this;
    }
    let bufferIndex = this.buffers.indexOf(buffer);
    if (bufferIndex === -1) {
      this.buffers.push(buffer);
      bufferIndex = this.buffers.length - 1;
    }
    this.attributes[id] = new Attribute(bufferIndex, size, normalized, type, stride, start, instance);
    this.instanced = this.instanced || instance;
    return this;
  }
  getAttribute(id) {
    return this.attributes[id];
  }
  getBuffer(id) {
    return this.buffers[this.getAttribute(id).buffer];
  }
  addIndex(buffer) {
    if (!(buffer instanceof Buffer2)) {
      if (buffer instanceof Array) {
        buffer = new Uint16Array(buffer);
      }
      buffer = new Buffer2(buffer);
    }
    buffer.type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
    this.indexBuffer = buffer;
    if (!this.buffers.includes(buffer)) {
      this.buffers.push(buffer);
    }
    return this;
  }
  getIndex() {
    return this.indexBuffer;
  }
  interleave() {
    if (this.buffers.length === 1 || this.buffers.length === 2 && this.indexBuffer)
      return this;
    const arrays = [];
    const sizes = [];
    const interleavedBuffer = new Buffer2();
    let i2;
    for (i2 in this.attributes) {
      const attribute = this.attributes[i2];
      const buffer = this.buffers[attribute.buffer];
      arrays.push(buffer.data);
      sizes.push(attribute.size * byteSizeMap[attribute.type] / 4);
      attribute.buffer = 0;
    }
    interleavedBuffer.data = interleaveTypedArrays2(arrays, sizes);
    for (i2 = 0; i2 < this.buffers.length; i2++) {
      if (this.buffers[i2] !== this.indexBuffer) {
        this.buffers[i2].destroy();
      }
    }
    this.buffers = [interleavedBuffer];
    if (this.indexBuffer) {
      this.buffers.push(this.indexBuffer);
    }
    return this;
  }
  getSize() {
    for (const i2 in this.attributes) {
      const attribute = this.attributes[i2];
      const buffer = this.buffers[attribute.buffer];
      return buffer.data.length / (attribute.stride / 4 || attribute.size);
    }
    return 0;
  }
  dispose() {
    this.disposeRunner.emit(this, false);
  }
  destroy() {
    this.dispose();
    this.buffers = null;
    this.indexBuffer = null;
    this.attributes = null;
  }
  clone() {
    const geometry = new Geometry();
    for (let i2 = 0; i2 < this.buffers.length; i2++) {
      geometry.buffers[i2] = new Buffer2(this.buffers[i2].data.slice(0));
    }
    for (const i2 in this.attributes) {
      const attrib = this.attributes[i2];
      geometry.attributes[i2] = new Attribute(attrib.buffer, attrib.size, attrib.normalized, attrib.type, attrib.stride, attrib.start, attrib.instance);
    }
    if (this.indexBuffer) {
      geometry.indexBuffer = geometry.buffers[this.buffers.indexOf(this.indexBuffer)];
      geometry.indexBuffer.type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
    }
    return geometry;
  }
  static merge(geometries) {
    const geometryOut = new Geometry();
    const arrays = [];
    const sizes = [];
    const offsets = [];
    let geometry;
    for (let i2 = 0; i2 < geometries.length; i2++) {
      geometry = geometries[i2];
      for (let j3 = 0; j3 < geometry.buffers.length; j3++) {
        sizes[j3] = sizes[j3] || 0;
        sizes[j3] += geometry.buffers[j3].data.length;
        offsets[j3] = 0;
      }
    }
    for (let i2 = 0; i2 < geometry.buffers.length; i2++) {
      arrays[i2] = new map3[getBufferType(geometry.buffers[i2].data)](sizes[i2]);
      geometryOut.buffers[i2] = new Buffer2(arrays[i2]);
    }
    for (let i2 = 0; i2 < geometries.length; i2++) {
      geometry = geometries[i2];
      for (let j3 = 0; j3 < geometry.buffers.length; j3++) {
        arrays[j3].set(geometry.buffers[j3].data, offsets[j3]);
        offsets[j3] += geometry.buffers[j3].data.length;
      }
    }
    geometryOut.attributes = geometry.attributes;
    if (geometry.indexBuffer) {
      geometryOut.indexBuffer = geometryOut.buffers[geometry.buffers.indexOf(geometry.indexBuffer)];
      geometryOut.indexBuffer.type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
      let offset = 0;
      let stride = 0;
      let offset2 = 0;
      let bufferIndexToCount = 0;
      for (let i2 = 0; i2 < geometry.buffers.length; i2++) {
        if (geometry.buffers[i2] !== geometry.indexBuffer) {
          bufferIndexToCount = i2;
          break;
        }
      }
      for (const i2 in geometry.attributes) {
        const attribute = geometry.attributes[i2];
        if ((attribute.buffer | 0) === bufferIndexToCount) {
          stride += attribute.size * byteSizeMap[attribute.type] / 4;
        }
      }
      for (let i2 = 0; i2 < geometries.length; i2++) {
        const indexBufferData = geometries[i2].indexBuffer.data;
        for (let j3 = 0; j3 < indexBufferData.length; j3++) {
          geometryOut.indexBuffer.data[j3 + offset2] += offset;
        }
        offset += geometries[i2].buffers[bufferIndexToCount].data.length / stride;
        offset2 += indexBufferData.length;
      }
    }
    return geometryOut;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/BatchGeometry.mjs
var BatchGeometry = class extends Geometry {
  constructor(_static = false) {
    super();
    this._buffer = new Buffer2(null, _static, false);
    this._indexBuffer = new Buffer2(null, _static, true);
    this.addAttribute("aVertexPosition", this._buffer, 2, false, TYPES.FLOAT).addAttribute("aTextureCoord", this._buffer, 2, false, TYPES.FLOAT).addAttribute("aColor", this._buffer, 4, true, TYPES.UNSIGNED_BYTE).addAttribute("aTextureId", this._buffer, 1, true, TYPES.FLOAT).addIndex(this._indexBuffer);
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/const.mjs
var PI_2 = Math.PI * 2;
var RAD_TO_DEG = 180 / Math.PI;
var DEG_TO_RAD = Math.PI / 180;
var SHAPES = /* @__PURE__ */ ((SHAPES2) => {
  SHAPES2[SHAPES2["POLY"] = 0] = "POLY";
  SHAPES2[SHAPES2["RECT"] = 1] = "RECT";
  SHAPES2[SHAPES2["CIRC"] = 2] = "CIRC";
  SHAPES2[SHAPES2["ELIP"] = 3] = "ELIP";
  SHAPES2[SHAPES2["RREC"] = 4] = "RREC";
  return SHAPES2;
})(SHAPES || {});

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/Point.mjs
var Point = class {
  constructor(x2 = 0, y2 = 0) {
    this.x = 0;
    this.y = 0;
    this.x = x2;
    this.y = y2;
  }
  clone() {
    return new Point(this.x, this.y);
  }
  copyFrom(p3) {
    this.set(p3.x, p3.y);
    return this;
  }
  copyTo(p3) {
    p3.set(this.x, this.y);
    return p3;
  }
  equals(p3) {
    return p3.x === this.x && p3.y === this.y;
  }
  set(x2 = 0, y2 = x2) {
    this.x = x2;
    this.y = y2;
    return this;
  }
  toString() {
    return `[@pixi/math:Point x=${this.x} y=${this.y}]`;
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/shapes/Rectangle.mjs
var tempPoints = [new Point(), new Point(), new Point(), new Point()];
var Rectangle = class {
  constructor(x2 = 0, y2 = 0, width = 0, height = 0) {
    this.x = Number(x2);
    this.y = Number(y2);
    this.width = Number(width);
    this.height = Number(height);
    this.type = SHAPES.RECT;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  static get EMPTY() {
    return new Rectangle(0, 0, 0, 0);
  }
  clone() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }
  copyFrom(rectangle) {
    this.x = rectangle.x;
    this.y = rectangle.y;
    this.width = rectangle.width;
    this.height = rectangle.height;
    return this;
  }
  copyTo(rectangle) {
    rectangle.x = this.x;
    rectangle.y = this.y;
    rectangle.width = this.width;
    rectangle.height = this.height;
    return rectangle;
  }
  contains(x2, y2) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }
    if (x2 >= this.x && x2 < this.x + this.width) {
      if (y2 >= this.y && y2 < this.y + this.height) {
        return true;
      }
    }
    return false;
  }
  intersects(other, transform) {
    if (!transform) {
      const x02 = this.x < other.x ? other.x : this.x;
      const x12 = this.right > other.right ? other.right : this.right;
      if (x12 <= x02) {
        return false;
      }
      const y02 = this.y < other.y ? other.y : this.y;
      const y12 = this.bottom > other.bottom ? other.bottom : this.bottom;
      return y12 > y02;
    }
    const x0 = this.left;
    const x1 = this.right;
    const y0 = this.top;
    const y1 = this.bottom;
    if (x1 <= x0 || y1 <= y0) {
      return false;
    }
    const lt = tempPoints[0].set(other.left, other.top);
    const lb = tempPoints[1].set(other.left, other.bottom);
    const rt = tempPoints[2].set(other.right, other.top);
    const rb = tempPoints[3].set(other.right, other.bottom);
    if (rt.x <= lt.x || lb.y <= lt.y) {
      return false;
    }
    const s2 = Math.sign(transform.a * transform.d - transform.b * transform.c);
    if (s2 === 0) {
      return false;
    }
    transform.apply(lt, lt);
    transform.apply(lb, lb);
    transform.apply(rt, rt);
    transform.apply(rb, rb);
    if (Math.max(lt.x, lb.x, rt.x, rb.x) <= x0 || Math.min(lt.x, lb.x, rt.x, rb.x) >= x1 || Math.max(lt.y, lb.y, rt.y, rb.y) <= y0 || Math.min(lt.y, lb.y, rt.y, rb.y) >= y1) {
      return false;
    }
    const nx = s2 * (lb.y - lt.y);
    const ny = s2 * (lt.x - lb.x);
    const n00 = nx * x0 + ny * y0;
    const n10 = nx * x1 + ny * y0;
    const n01 = nx * x0 + ny * y1;
    const n11 = nx * x1 + ny * y1;
    if (Math.max(n00, n10, n01, n11) <= nx * lt.x + ny * lt.y || Math.min(n00, n10, n01, n11) >= nx * rb.x + ny * rb.y) {
      return false;
    }
    const mx = s2 * (lt.y - rt.y);
    const my = s2 * (rt.x - lt.x);
    const m00 = mx * x0 + my * y0;
    const m10 = mx * x1 + my * y0;
    const m01 = mx * x0 + my * y1;
    const m11 = mx * x1 + my * y1;
    if (Math.max(m00, m10, m01, m11) <= mx * lt.x + my * lt.y || Math.min(m00, m10, m01, m11) >= mx * rb.x + my * rb.y) {
      return false;
    }
    return true;
  }
  pad(paddingX = 0, paddingY = paddingX) {
    this.x -= paddingX;
    this.y -= paddingY;
    this.width += paddingX * 2;
    this.height += paddingY * 2;
    return this;
  }
  fit(rectangle) {
    const x1 = Math.max(this.x, rectangle.x);
    const x2 = Math.min(this.x + this.width, rectangle.x + rectangle.width);
    const y1 = Math.max(this.y, rectangle.y);
    const y2 = Math.min(this.y + this.height, rectangle.y + rectangle.height);
    this.x = x1;
    this.width = Math.max(x2 - x1, 0);
    this.y = y1;
    this.height = Math.max(y2 - y1, 0);
    return this;
  }
  ceil(resolution = 1, eps = 1e-3) {
    const x2 = Math.ceil((this.x + this.width - eps) * resolution) / resolution;
    const y2 = Math.ceil((this.y + this.height - eps) * resolution) / resolution;
    this.x = Math.floor((this.x + eps) * resolution) / resolution;
    this.y = Math.floor((this.y + eps) * resolution) / resolution;
    this.width = x2 - this.x;
    this.height = y2 - this.y;
    return this;
  }
  enlarge(rectangle) {
    const x1 = Math.min(this.x, rectangle.x);
    const x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
    const y1 = Math.min(this.y, rectangle.y);
    const y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);
    this.x = x1;
    this.width = x2 - x1;
    this.y = y1;
    this.height = y2 - y1;
    return this;
  }
  toString() {
    return `[@pixi/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/shapes/Circle.mjs
var Circle = class {
  constructor(x2 = 0, y2 = 0, radius = 0) {
    this.x = x2;
    this.y = y2;
    this.radius = radius;
    this.type = SHAPES.CIRC;
  }
  clone() {
    return new Circle(this.x, this.y, this.radius);
  }
  contains(x2, y2) {
    if (this.radius <= 0) {
      return false;
    }
    const r2 = this.radius * this.radius;
    let dx = this.x - x2;
    let dy = this.y - y2;
    dx *= dx;
    dy *= dy;
    return dx + dy <= r2;
  }
  getBounds() {
    return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }
  toString() {
    return `[@pixi/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/shapes/Ellipse.mjs
var Ellipse = class {
  constructor(x2 = 0, y2 = 0, halfWidth = 0, halfHeight = 0) {
    this.x = x2;
    this.y = y2;
    this.width = halfWidth;
    this.height = halfHeight;
    this.type = SHAPES.ELIP;
  }
  clone() {
    return new Ellipse(this.x, this.y, this.width, this.height);
  }
  contains(x2, y2) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }
    let normx = (x2 - this.x) / this.width;
    let normy = (y2 - this.y) / this.height;
    normx *= normx;
    normy *= normy;
    return normx + normy <= 1;
  }
  getBounds() {
    return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
  }
  toString() {
    return `[@pixi/math:Ellipse x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/shapes/Polygon.mjs
var Polygon = class {
  constructor(...points) {
    let flat = Array.isArray(points[0]) ? points[0] : points;
    if (typeof flat[0] !== "number") {
      const p3 = [];
      for (let i2 = 0, il = flat.length; i2 < il; i2++) {
        p3.push(flat[i2].x, flat[i2].y);
      }
      flat = p3;
    }
    this.points = flat;
    this.type = SHAPES.POLY;
    this.closeStroke = true;
  }
  clone() {
    const points = this.points.slice();
    const polygon = new Polygon(points);
    polygon.closeStroke = this.closeStroke;
    return polygon;
  }
  contains(x2, y2) {
    let inside = false;
    const length = this.points.length / 2;
    for (let i2 = 0, j3 = length - 1; i2 < length; j3 = i2++) {
      const xi = this.points[i2 * 2];
      const yi = this.points[i2 * 2 + 1];
      const xj = this.points[j3 * 2];
      const yj = this.points[j3 * 2 + 1];
      const intersect = yi > y2 !== yj > y2 && x2 < (xj - xi) * ((y2 - yi) / (yj - yi)) + xi;
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  }
  toString() {
    return `[@pixi/math:PolygoncloseStroke=${this.closeStroke}points=${this.points.reduce((pointsDesc, currentPoint) => `${pointsDesc}, ${currentPoint}`, "")}]`;
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/shapes/RoundedRectangle.mjs
var RoundedRectangle = class {
  constructor(x2 = 0, y2 = 0, width = 0, height = 0, radius = 20) {
    this.x = x2;
    this.y = y2;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.type = SHAPES.RREC;
  }
  clone() {
    return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
  }
  contains(x2, y2) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }
    if (x2 >= this.x && x2 <= this.x + this.width) {
      if (y2 >= this.y && y2 <= this.y + this.height) {
        const radius = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
        if (y2 >= this.y + radius && y2 <= this.y + this.height - radius || x2 >= this.x + radius && x2 <= this.x + this.width - radius) {
          return true;
        }
        let dx = x2 - (this.x + radius);
        let dy = y2 - (this.y + radius);
        const radius2 = radius * radius;
        if (dx * dx + dy * dy <= radius2) {
          return true;
        }
        dx = x2 - (this.x + this.width - radius);
        if (dx * dx + dy * dy <= radius2) {
          return true;
        }
        dy = y2 - (this.y + this.height - radius);
        if (dx * dx + dy * dy <= radius2) {
          return true;
        }
        dx = x2 - (this.x + radius);
        if (dx * dx + dy * dy <= radius2) {
          return true;
        }
      }
    }
    return false;
  }
  toString() {
    return `[@pixi/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/Matrix.mjs
var Matrix = class {
  constructor(a2 = 1, b3 = 0, c2 = 0, d2 = 1, tx = 0, ty = 0) {
    this.array = null;
    this.a = a2;
    this.b = b3;
    this.c = c2;
    this.d = d2;
    this.tx = tx;
    this.ty = ty;
  }
  fromArray(array) {
    this.a = array[0];
    this.b = array[1];
    this.c = array[3];
    this.d = array[4];
    this.tx = array[2];
    this.ty = array[5];
  }
  set(a2, b3, c2, d2, tx, ty) {
    this.a = a2;
    this.b = b3;
    this.c = c2;
    this.d = d2;
    this.tx = tx;
    this.ty = ty;
    return this;
  }
  toArray(transpose, out) {
    if (!this.array) {
      this.array = new Float32Array(9);
    }
    const array = out || this.array;
    if (transpose) {
      array[0] = this.a;
      array[1] = this.b;
      array[2] = 0;
      array[3] = this.c;
      array[4] = this.d;
      array[5] = 0;
      array[6] = this.tx;
      array[7] = this.ty;
      array[8] = 1;
    } else {
      array[0] = this.a;
      array[1] = this.c;
      array[2] = this.tx;
      array[3] = this.b;
      array[4] = this.d;
      array[5] = this.ty;
      array[6] = 0;
      array[7] = 0;
      array[8] = 1;
    }
    return array;
  }
  apply(pos, newPos) {
    newPos = newPos || new Point();
    const x2 = pos.x;
    const y2 = pos.y;
    newPos.x = this.a * x2 + this.c * y2 + this.tx;
    newPos.y = this.b * x2 + this.d * y2 + this.ty;
    return newPos;
  }
  applyInverse(pos, newPos) {
    newPos = newPos || new Point();
    const id = 1 / (this.a * this.d + this.c * -this.b);
    const x2 = pos.x;
    const y2 = pos.y;
    newPos.x = this.d * id * x2 + -this.c * id * y2 + (this.ty * this.c - this.tx * this.d) * id;
    newPos.y = this.a * id * y2 + -this.b * id * x2 + (-this.ty * this.a + this.tx * this.b) * id;
    return newPos;
  }
  translate(x2, y2) {
    this.tx += x2;
    this.ty += y2;
    return this;
  }
  scale(x2, y2) {
    this.a *= x2;
    this.d *= y2;
    this.c *= x2;
    this.b *= y2;
    this.tx *= x2;
    this.ty *= y2;
    return this;
  }
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const a1 = this.a;
    const c1 = this.c;
    const tx1 = this.tx;
    this.a = a1 * cos - this.b * sin;
    this.b = a1 * sin + this.b * cos;
    this.c = c1 * cos - this.d * sin;
    this.d = c1 * sin + this.d * cos;
    this.tx = tx1 * cos - this.ty * sin;
    this.ty = tx1 * sin + this.ty * cos;
    return this;
  }
  append(matrix) {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    this.a = matrix.a * a1 + matrix.b * c1;
    this.b = matrix.a * b1 + matrix.b * d1;
    this.c = matrix.c * a1 + matrix.d * c1;
    this.d = matrix.c * b1 + matrix.d * d1;
    this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
    this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;
    return this;
  }
  setTransform(x2, y2, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
    this.a = Math.cos(rotation + skewY) * scaleX;
    this.b = Math.sin(rotation + skewY) * scaleX;
    this.c = -Math.sin(rotation - skewX) * scaleY;
    this.d = Math.cos(rotation - skewX) * scaleY;
    this.tx = x2 - (pivotX * this.a + pivotY * this.c);
    this.ty = y2 - (pivotX * this.b + pivotY * this.d);
    return this;
  }
  prepend(matrix) {
    const tx1 = this.tx;
    if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
      const a1 = this.a;
      const c1 = this.c;
      this.a = a1 * matrix.a + this.b * matrix.c;
      this.b = a1 * matrix.b + this.b * matrix.d;
      this.c = c1 * matrix.a + this.d * matrix.c;
      this.d = c1 * matrix.b + this.d * matrix.d;
    }
    this.tx = tx1 * matrix.a + this.ty * matrix.c + matrix.tx;
    this.ty = tx1 * matrix.b + this.ty * matrix.d + matrix.ty;
    return this;
  }
  decompose(transform) {
    const a2 = this.a;
    const b3 = this.b;
    const c2 = this.c;
    const d2 = this.d;
    const pivot = transform.pivot;
    const skewX = -Math.atan2(-c2, d2);
    const skewY = Math.atan2(b3, a2);
    const delta = Math.abs(skewX + skewY);
    if (delta < 1e-5 || Math.abs(PI_2 - delta) < 1e-5) {
      transform.rotation = skewY;
      transform.skew.x = transform.skew.y = 0;
    } else {
      transform.rotation = 0;
      transform.skew.x = skewX;
      transform.skew.y = skewY;
    }
    transform.scale.x = Math.sqrt(a2 * a2 + b3 * b3);
    transform.scale.y = Math.sqrt(c2 * c2 + d2 * d2);
    transform.position.x = this.tx + (pivot.x * a2 + pivot.y * c2);
    transform.position.y = this.ty + (pivot.x * b3 + pivot.y * d2);
    return transform;
  }
  invert() {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    const tx1 = this.tx;
    const n2 = a1 * d1 - b1 * c1;
    this.a = d1 / n2;
    this.b = -b1 / n2;
    this.c = -c1 / n2;
    this.d = a1 / n2;
    this.tx = (c1 * this.ty - d1 * tx1) / n2;
    this.ty = -(a1 * this.ty - b1 * tx1) / n2;
    return this;
  }
  identity() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
    return this;
  }
  clone() {
    const matrix = new Matrix();
    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;
    return matrix;
  }
  copyTo(matrix) {
    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;
    return matrix;
  }
  copyFrom(matrix) {
    this.a = matrix.a;
    this.b = matrix.b;
    this.c = matrix.c;
    this.d = matrix.d;
    this.tx = matrix.tx;
    this.ty = matrix.ty;
    return this;
  }
  toString() {
    return `[@pixi/math:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
  }
  static get IDENTITY() {
    return new Matrix();
  }
  static get TEMP_MATRIX() {
    return new Matrix();
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/groupD8.mjs
var ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
var uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
var vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
var vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
var rotationCayley = [];
var rotationMatrices = [];
var signum = Math.sign;
function init() {
  for (let i2 = 0; i2 < 16; i2++) {
    const row = [];
    rotationCayley.push(row);
    for (let j3 = 0; j3 < 16; j3++) {
      const _ux = signum(ux[i2] * ux[j3] + vx[i2] * uy[j3]);
      const _uy = signum(uy[i2] * ux[j3] + vy[i2] * uy[j3]);
      const _vx = signum(ux[i2] * vx[j3] + vx[i2] * vy[j3]);
      const _vy = signum(uy[i2] * vx[j3] + vy[i2] * vy[j3]);
      for (let k3 = 0; k3 < 16; k3++) {
        if (ux[k3] === _ux && uy[k3] === _uy && vx[k3] === _vx && vy[k3] === _vy) {
          row.push(k3);
          break;
        }
      }
    }
  }
  for (let i2 = 0; i2 < 16; i2++) {
    const mat = new Matrix();
    mat.set(ux[i2], uy[i2], vx[i2], vy[i2], 0, 0);
    rotationMatrices.push(mat);
  }
}
init();
var groupD8 = {
  E: 0,
  SE: 1,
  S: 2,
  SW: 3,
  W: 4,
  NW: 5,
  N: 6,
  NE: 7,
  MIRROR_VERTICAL: 8,
  MAIN_DIAGONAL: 10,
  MIRROR_HORIZONTAL: 12,
  REVERSE_DIAGONAL: 14,
  uX: (ind) => ux[ind],
  uY: (ind) => uy[ind],
  vX: (ind) => vx[ind],
  vY: (ind) => vy[ind],
  inv: (rotation) => {
    if (rotation & 8) {
      return rotation & 15;
    }
    return -rotation & 7;
  },
  add: (rotationSecond, rotationFirst) => rotationCayley[rotationSecond][rotationFirst],
  sub: (rotationSecond, rotationFirst) => rotationCayley[rotationSecond][groupD8.inv(rotationFirst)],
  rotate180: (rotation) => rotation ^ 4,
  isVertical: (rotation) => (rotation & 3) === 2,
  byDirection: (dx, dy) => {
    if (Math.abs(dx) * 2 <= Math.abs(dy)) {
      if (dy >= 0) {
        return groupD8.S;
      }
      return groupD8.N;
    } else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
      if (dx > 0) {
        return groupD8.E;
      }
      return groupD8.W;
    } else if (dy > 0) {
      if (dx > 0) {
        return groupD8.SE;
      }
      return groupD8.SW;
    } else if (dx > 0) {
      return groupD8.NE;
    }
    return groupD8.NW;
  },
  matrixAppendRotationInv: (matrix, rotation, tx = 0, ty = 0) => {
    const mat = rotationMatrices[groupD8.inv(rotation)];
    mat.tx = tx;
    mat.ty = ty;
    matrix.append(mat);
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/ObservablePoint.mjs
var ObservablePoint = class {
  constructor(cb, scope, x2 = 0, y2 = 0) {
    this._x = x2;
    this._y = y2;
    this.cb = cb;
    this.scope = scope;
  }
  clone(cb = this.cb, scope = this.scope) {
    return new ObservablePoint(cb, scope, this._x, this._y);
  }
  set(x2 = 0, y2 = x2) {
    if (this._x !== x2 || this._y !== y2) {
      this._x = x2;
      this._y = y2;
      this.cb.call(this.scope);
    }
    return this;
  }
  copyFrom(p3) {
    if (this._x !== p3.x || this._y !== p3.y) {
      this._x = p3.x;
      this._y = p3.y;
      this.cb.call(this.scope);
    }
    return this;
  }
  copyTo(p3) {
    p3.set(this._x, this._y);
    return p3;
  }
  equals(p3) {
    return p3.x === this._x && p3.y === this._y;
  }
  toString() {
    return `[@pixi/math:ObservablePoint x=${0} y=${0} scope=${this.scope}]`;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    if (this._x !== value) {
      this._x = value;
      this.cb.call(this.scope);
    }
  }
  get y() {
    return this._y;
  }
  set y(value) {
    if (this._y !== value) {
      this._y = value;
      this.cb.call(this.scope);
    }
  }
};

// ../../node_modules/.pnpm/@pixi+math@7.2.4/node_modules/@pixi/math/lib/Transform.mjs
var _Transform = class {
  constructor() {
    this.worldTransform = new Matrix();
    this.localTransform = new Matrix();
    this.position = new ObservablePoint(this.onChange, this, 0, 0);
    this.scale = new ObservablePoint(this.onChange, this, 1, 1);
    this.pivot = new ObservablePoint(this.onChange, this, 0, 0);
    this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);
    this._rotation = 0;
    this._cx = 1;
    this._sx = 0;
    this._cy = 0;
    this._sy = 1;
    this._localID = 0;
    this._currentLocalID = 0;
    this._worldID = 0;
    this._parentID = 0;
  }
  onChange() {
    this._localID++;
  }
  updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew.y);
    this._sx = Math.sin(this._rotation + this.skew.y);
    this._cy = -Math.sin(this._rotation - this.skew.x);
    this._sy = Math.cos(this._rotation - this.skew.x);
    this._localID++;
  }
  toString() {
    return `[@pixi/math:Transform position=(${this.position.x}, ${this.position.y}) rotation=${this.rotation} scale=(${this.scale.x}, ${this.scale.y}) skew=(${this.skew.x}, ${this.skew.y}) ]`;
  }
  updateLocalTransform() {
    const lt = this.localTransform;
    if (this._localID !== this._currentLocalID) {
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;
      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;
      this._parentID = -1;
    }
  }
  updateTransform(parentTransform) {
    const lt = this.localTransform;
    if (this._localID !== this._currentLocalID) {
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;
      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;
      this._parentID = -1;
    }
    if (this._parentID !== parentTransform._worldID) {
      const pt = parentTransform.worldTransform;
      const wt = this.worldTransform;
      wt.a = lt.a * pt.a + lt.b * pt.c;
      wt.b = lt.a * pt.b + lt.b * pt.d;
      wt.c = lt.c * pt.a + lt.d * pt.c;
      wt.d = lt.c * pt.b + lt.d * pt.d;
      wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
      wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
      this._parentID = parentTransform._worldID;
      this._worldID++;
    }
  }
  setFromMatrix(matrix) {
    matrix.decompose(this);
    this._localID++;
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    if (this._rotation !== value) {
      this._rotation = value;
      this.updateSkew();
    }
  }
};
var Transform = _Transform;
Transform.IDENTITY = new _Transform();

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/defaultProgram.mjs
var defaultFragment = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/defaultProgram2.mjs
var defaultVertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/compileShader.mjs
function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/defaultValue.mjs
function booleanArray(size) {
  const array = new Array(size);
  for (let i2 = 0; i2 < array.length; i2++) {
    array[i2] = false;
  }
  return array;
}
function defaultValue(type, size) {
  switch (type) {
    case "float":
      return 0;
    case "vec2":
      return new Float32Array(2 * size);
    case "vec3":
      return new Float32Array(3 * size);
    case "vec4":
      return new Float32Array(4 * size);
    case "int":
    case "uint":
    case "sampler2D":
    case "sampler2DArray":
      return 0;
    case "ivec2":
      return new Int32Array(2 * size);
    case "ivec3":
      return new Int32Array(3 * size);
    case "ivec4":
      return new Int32Array(4 * size);
    case "uvec2":
      return new Uint32Array(2 * size);
    case "uvec3":
      return new Uint32Array(3 * size);
    case "uvec4":
      return new Uint32Array(4 * size);
    case "bool":
      return false;
    case "bvec2":
      return booleanArray(2 * size);
    case "bvec3":
      return booleanArray(3 * size);
    case "bvec4":
      return booleanArray(4 * size);
    case "mat2":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3":
      return new Float32Array([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    case "mat4":
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
  }
  return null;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/uniformParsers.mjs
var uniformParsers = [
  {
    test: (data) => data.type === "float" && data.size === 1 && !data.isArray,
    code: (name) => `
            if(uv["${name}"] !== ud["${name}"].value)
            {
                ud["${name}"].value = uv["${name}"]
                gl.uniform1f(ud["${name}"].location, uv["${name}"])
            }
            `
  },
  {
    test: (data, uniform) => (data.type === "sampler2D" || data.type === "samplerCube" || data.type === "sampler2DArray") && data.size === 1 && !data.isArray && (uniform == null || uniform.castToBaseTexture !== void 0),
    code: (name) => `t = syncData.textureCount++;

            renderer.texture.bind(uv["${name}"], t);

            if(ud["${name}"].value !== t)
            {
                ud["${name}"].value = t;
                gl.uniform1i(ud["${name}"].location, t);
; // eslint-disable-line max-len
            }`
  },
  {
    test: (data, uniform) => data.type === "mat3" && data.size === 1 && !data.isArray && uniform.a !== void 0,
    code: (name) => `
            gl.uniformMatrix3fv(ud["${name}"].location, false, uv["${name}"].toArray(true));
            `,
    codeUbo: (name) => `
                var ${name}_matrix = uv.${name}.toArray(true);

                data[offset] = ${name}_matrix[0];
                data[offset+1] = ${name}_matrix[1];
                data[offset+2] = ${name}_matrix[2];
        
                data[offset + 4] = ${name}_matrix[3];
                data[offset + 5] = ${name}_matrix[4];
                data[offset + 6] = ${name}_matrix[5];
        
                data[offset + 8] = ${name}_matrix[6];
                data[offset + 9] = ${name}_matrix[7];
                data[offset + 10] = ${name}_matrix[8];
            `
  },
  {
    test: (data, uniform) => data.type === "vec2" && data.size === 1 && !data.isArray && uniform.x !== void 0,
    code: (name) => `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v.x || cv[1] !== v.y)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    gl.uniform2f(ud["${name}"].location, v.x, v.y);
                }`,
    codeUbo: (name) => `
                v = uv.${name};

                data[offset] = v.x;
                data[offset+1] = v.y;
            `
  },
  {
    test: (data) => data.type === "vec2" && data.size === 1 && !data.isArray,
    code: (name) => `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v[0] || cv[1] !== v[1])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    gl.uniform2f(ud["${name}"].location, v[0], v[1]);
                }
            `
  },
  {
    test: (data, uniform) => data.type === "vec4" && data.size === 1 && !data.isArray && uniform.width !== void 0,
    code: (name) => `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    cv[2] = v.width;
                    cv[3] = v.height;
                    gl.uniform4f(ud["${name}"].location, v.x, v.y, v.width, v.height)
                }`,
    codeUbo: (name) => `
                    v = uv.${name};

                    data[offset] = v.x;
                    data[offset+1] = v.y;
                    data[offset+2] = v.width;
                    data[offset+3] = v.height;
                `
  },
  {
    test: (data, uniform) => data.type === "vec4" && data.size === 1 && !data.isArray && uniform.red !== void 0,
    code: (name) => `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha)
                {
                    cv[0] = v.red;
                    cv[1] = v.green;
                    cv[2] = v.blue;
                    cv[3] = v.alpha;
                    gl.uniform4f(ud["${name}"].location, v.red, v.green, v.blue, v.alpha)
                }`,
    codeUbo: (name) => `
                    v = uv.${name};

                    data[offset] = v.red;
                    data[offset+1] = v.green;
                    data[offset+2] = v.blue;
                    data[offset+3] = v.alpha;
                `
  },
  {
    test: (data, uniform) => data.type === "vec3" && data.size === 1 && !data.isArray && uniform.red !== void 0,
    code: (name) => `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.a)
                {
                    cv[0] = v.red;
                    cv[1] = v.green;
                    cv[2] = v.blue;
    
                    gl.uniform3f(ud["${name}"].location, v.red, v.green, v.blue)
                }`,
    codeUbo: (name) => `
                    v = uv.${name};

                    data[offset] = v.red;
                    data[offset+1] = v.green;
                    data[offset+2] = v.blue;
                `
  },
  {
    test: (data) => data.type === "vec4" && data.size === 1 && !data.isArray,
    code: (name) => `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    cv[2] = v[2];
                    cv[3] = v[3];

                    gl.uniform4f(ud["${name}"].location, v[0], v[1], v[2], v[3])
                }`
  }
];

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/generateUniformsSync.mjs
var GLSL_TO_SINGLE_SETTERS_CACHED = {
  float: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1f(location, v);
    }`,
  vec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2f(location, v[0], v[1])
    }`,
  vec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3f(location, v[0], v[1], v[2])
    }`,
  vec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4f(location, v[0], v[1], v[2], v[3]);
    }`,
  int: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
  ivec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
  ivec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
  ivec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,
  uint: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1ui(location, v);
    }`,
  uvec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2ui(location, v[0], v[1]);
    }`,
  uvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3ui(location, v[0], v[1], v[2]);
    }`,
  uvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4ui(location, v[0], v[1], v[2], v[3]);
    }`,
  bool: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1i(location, v);
    }`,
  bvec2: `
    if (cv[0] != v[0] || cv[1] != v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
  bvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
  bvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,
  mat2: "gl.uniformMatrix2fv(location, false, v)",
  mat3: "gl.uniformMatrix3fv(location, false, v)",
  mat4: "gl.uniformMatrix4fv(location, false, v)",
  sampler2D: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
  samplerCube: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
  sampler2DArray: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`
};
var GLSL_TO_ARRAY_SETTERS = {
  float: `gl.uniform1fv(location, v)`,
  vec2: `gl.uniform2fv(location, v)`,
  vec3: `gl.uniform3fv(location, v)`,
  vec4: "gl.uniform4fv(location, v)",
  mat4: "gl.uniformMatrix4fv(location, false, v)",
  mat3: "gl.uniformMatrix3fv(location, false, v)",
  mat2: "gl.uniformMatrix2fv(location, false, v)",
  int: "gl.uniform1iv(location, v)",
  ivec2: "gl.uniform2iv(location, v)",
  ivec3: "gl.uniform3iv(location, v)",
  ivec4: "gl.uniform4iv(location, v)",
  uint: "gl.uniform1uiv(location, v)",
  uvec2: "gl.uniform2uiv(location, v)",
  uvec3: "gl.uniform3uiv(location, v)",
  uvec4: "gl.uniform4uiv(location, v)",
  bool: "gl.uniform1iv(location, v)",
  bvec2: "gl.uniform2iv(location, v)",
  bvec3: "gl.uniform3iv(location, v)",
  bvec4: "gl.uniform4iv(location, v)",
  sampler2D: "gl.uniform1iv(location, v)",
  samplerCube: "gl.uniform1iv(location, v)",
  sampler2DArray: "gl.uniform1iv(location, v)"
};
function generateUniformsSync(group, uniformData) {
  const funcFragments = [`
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
    `];
  for (const i2 in group.uniforms) {
    const data = uniformData[i2];
    if (!data) {
      if (group.uniforms[i2]?.group) {
        if (group.uniforms[i2].ubo) {
          funcFragments.push(`
                        renderer.shader.syncUniformBufferGroup(uv.${i2}, '${i2}');
                    `);
        } else {
          funcFragments.push(`
                        renderer.shader.syncUniformGroup(uv.${i2}, syncData);
                    `);
        }
      }
      continue;
    }
    const uniform = group.uniforms[i2];
    let parsed = false;
    for (let j3 = 0; j3 < uniformParsers.length; j3++) {
      if (uniformParsers[j3].test(data, uniform)) {
        funcFragments.push(uniformParsers[j3].code(i2, uniform));
        parsed = true;
        break;
      }
    }
    if (!parsed) {
      const templateType = data.size === 1 && !data.isArray ? GLSL_TO_SINGLE_SETTERS_CACHED : GLSL_TO_ARRAY_SETTERS;
      const template = templateType[data.type].replace("location", `ud["${i2}"].location`);
      funcFragments.push(`
            cu = ud["${i2}"];
            cv = cu.value;
            v = uv["${i2}"];
            ${template};`);
    }
  }
  return new Function("ud", "uv", "renderer", "syncData", funcFragments.join("\n"));
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/getTestContext.mjs
var unknownContext = {};
var context = unknownContext;
function getTestContext() {
  if (context === unknownContext || context?.isContextLost()) {
    const canvas = settings.ADAPTER.createCanvas();
    let gl;
    if (settings.PREFER_ENV >= ENV.WEBGL2) {
      gl = canvas.getContext("webgl2", {});
    }
    if (!gl) {
      gl = canvas.getContext("webgl", {}) || canvas.getContext("experimental-webgl", {});
      if (!gl) {
        gl = null;
      } else {
        gl.getExtension("WEBGL_draw_buffers");
      }
    }
    context = gl;
  }
  return context;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/getMaxFragmentPrecision.mjs
var maxFragmentPrecision;
function getMaxFragmentPrecision() {
  if (!maxFragmentPrecision) {
    maxFragmentPrecision = PRECISION.MEDIUM;
    const gl = getTestContext();
    if (gl) {
      if (gl.getShaderPrecisionFormat) {
        const shaderFragment = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        maxFragmentPrecision = shaderFragment.precision ? PRECISION.HIGH : PRECISION.MEDIUM;
      }
    }
  }
  return maxFragmentPrecision;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/logProgramError.mjs
function logPrettyShaderError(gl, shader) {
  const shaderSrc = gl.getShaderSource(shader).split("\n").map((line, index) => `${index}: ${line}`);
  const shaderLog = gl.getShaderInfoLog(shader);
  const splitShader = shaderLog.split("\n");
  const dedupe = {};
  const lineNumbers = splitShader.map((line) => parseFloat(line.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"))).filter((n2) => {
    if (n2 && !dedupe[n2]) {
      dedupe[n2] = true;
      return true;
    }
    return false;
  });
  const logArgs = [""];
  lineNumbers.forEach((number) => {
    shaderSrc[number - 1] = `%c${shaderSrc[number - 1]}%c`;
    logArgs.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
  });
  const fragmentSourceToLog = shaderSrc.join("\n");
  logArgs[0] = fragmentSourceToLog;
  console.error(shaderLog);
  console.groupCollapsed("click to view full shader code");
  console.warn(...logArgs);
  console.groupEnd();
}
function logProgramError(gl, program, vertexShader, fragmentShader) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      logPrettyShaderError(gl, vertexShader);
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      logPrettyShaderError(gl, fragmentShader);
    }
    console.error("PixiJS Error: Could not initialize shader.");
    if (gl.getProgramInfoLog(program) !== "") {
      console.warn("PixiJS Warning: gl.getProgramInfoLog()", gl.getProgramInfoLog(program));
    }
  }
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/mapSize.mjs
var GLSL_TO_SIZE = {
  float: 1,
  vec2: 2,
  vec3: 3,
  vec4: 4,
  int: 1,
  ivec2: 2,
  ivec3: 3,
  ivec4: 4,
  uint: 1,
  uvec2: 2,
  uvec3: 3,
  uvec4: 4,
  bool: 1,
  bvec2: 2,
  bvec3: 3,
  bvec4: 4,
  mat2: 4,
  mat3: 9,
  mat4: 16,
  sampler2D: 1
};
function mapSize(type) {
  return GLSL_TO_SIZE[type];
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/mapType.mjs
var GL_TABLE = null;
var GL_TO_GLSL_TYPES = {
  FLOAT: "float",
  FLOAT_VEC2: "vec2",
  FLOAT_VEC3: "vec3",
  FLOAT_VEC4: "vec4",
  INT: "int",
  INT_VEC2: "ivec2",
  INT_VEC3: "ivec3",
  INT_VEC4: "ivec4",
  UNSIGNED_INT: "uint",
  UNSIGNED_INT_VEC2: "uvec2",
  UNSIGNED_INT_VEC3: "uvec3",
  UNSIGNED_INT_VEC4: "uvec4",
  BOOL: "bool",
  BOOL_VEC2: "bvec2",
  BOOL_VEC3: "bvec3",
  BOOL_VEC4: "bvec4",
  FLOAT_MAT2: "mat2",
  FLOAT_MAT3: "mat3",
  FLOAT_MAT4: "mat4",
  SAMPLER_2D: "sampler2D",
  INT_SAMPLER_2D: "sampler2D",
  UNSIGNED_INT_SAMPLER_2D: "sampler2D",
  SAMPLER_CUBE: "samplerCube",
  INT_SAMPLER_CUBE: "samplerCube",
  UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
  SAMPLER_2D_ARRAY: "sampler2DArray",
  INT_SAMPLER_2D_ARRAY: "sampler2DArray",
  UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray"
};
function mapType(gl, type) {
  if (!GL_TABLE) {
    const typeNames = Object.keys(GL_TO_GLSL_TYPES);
    GL_TABLE = {};
    for (let i2 = 0; i2 < typeNames.length; ++i2) {
      const tn = typeNames[i2];
      GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn];
    }
  }
  return GL_TABLE[type];
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/setPrecision.mjs
function setPrecision(src, requestedPrecision, maxSupportedPrecision) {
  if (src.substring(0, 9) !== "precision") {
    let precision = requestedPrecision;
    if (requestedPrecision === PRECISION.HIGH && maxSupportedPrecision !== PRECISION.HIGH) {
      precision = PRECISION.MEDIUM;
    }
    return `precision ${precision} float;
${src}`;
  } else if (maxSupportedPrecision !== PRECISION.HIGH && src.substring(0, 15) === "precision highp") {
    return src.replace("precision highp", "precision mediump");
  }
  return src;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/unsafeEvalSupported.mjs
var unsafeEval;
function unsafeEvalSupported() {
  if (typeof unsafeEval === "boolean") {
    return unsafeEval;
  }
  try {
    const func = new Function("param1", "param2", "param3", "return param1[param2] === param3;");
    unsafeEval = func({ a: "b" }, "a", "b") === true;
  } catch (e3) {
    unsafeEval = false;
  }
  return unsafeEval;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/Program.mjs
var UID3 = 0;
var nameCache = {};
var _Program = class {
  constructor(vertexSrc, fragmentSrc, name = "pixi-shader", extra = {}) {
    this.extra = {};
    this.id = UID3++;
    this.vertexSrc = vertexSrc || _Program.defaultVertexSrc;
    this.fragmentSrc = fragmentSrc || _Program.defaultFragmentSrc;
    this.vertexSrc = this.vertexSrc.trim();
    this.fragmentSrc = this.fragmentSrc.trim();
    this.extra = extra;
    if (this.vertexSrc.substring(0, 8) !== "#version") {
      name = name.replace(/\s+/g, "-");
      if (nameCache[name]) {
        nameCache[name]++;
        name += `-${nameCache[name]}`;
      } else {
        nameCache[name] = 1;
      }
      this.vertexSrc = `#define SHADER_NAME ${name}
${this.vertexSrc}`;
      this.fragmentSrc = `#define SHADER_NAME ${name}
${this.fragmentSrc}`;
      this.vertexSrc = setPrecision(this.vertexSrc, _Program.defaultVertexPrecision, PRECISION.HIGH);
      this.fragmentSrc = setPrecision(this.fragmentSrc, _Program.defaultFragmentPrecision, getMaxFragmentPrecision());
    }
    this.glPrograms = {};
    this.syncUniforms = null;
  }
  static get defaultVertexSrc() {
    return defaultVertex;
  }
  static get defaultFragmentSrc() {
    return defaultFragment;
  }
  static from(vertexSrc, fragmentSrc, name) {
    const key = vertexSrc + fragmentSrc;
    let program = ProgramCache[key];
    if (!program) {
      ProgramCache[key] = program = new _Program(vertexSrc, fragmentSrc, name);
    }
    return program;
  }
};
var Program = _Program;
Program.defaultVertexPrecision = PRECISION.HIGH;
Program.defaultFragmentPrecision = isMobile2.apple.device ? PRECISION.HIGH : PRECISION.MEDIUM;

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/UniformGroup.mjs
var UID4 = 0;
var UniformGroup = class {
  constructor(uniforms, isStatic, isUbo) {
    this.group = true;
    this.syncUniforms = {};
    this.dirtyId = 0;
    this.id = UID4++;
    this.static = !!isStatic;
    this.ubo = !!isUbo;
    if (uniforms instanceof Buffer2) {
      this.buffer = uniforms;
      this.buffer.type = BUFFER_TYPE.UNIFORM_BUFFER;
      this.autoManage = false;
      this.ubo = true;
    } else {
      this.uniforms = uniforms;
      if (this.ubo) {
        this.buffer = new Buffer2(new Float32Array(1));
        this.buffer.type = BUFFER_TYPE.UNIFORM_BUFFER;
        this.autoManage = true;
      }
    }
  }
  update() {
    this.dirtyId++;
    if (!this.autoManage && this.buffer) {
      this.buffer.update();
    }
  }
  add(name, uniforms, _static) {
    if (!this.ubo) {
      this.uniforms[name] = new UniformGroup(uniforms, _static);
    } else {
      throw new Error("[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them");
    }
  }
  static from(uniforms, _static, _ubo) {
    return new UniformGroup(uniforms, _static, _ubo);
  }
  static uboFrom(uniforms, _static) {
    return new UniformGroup(uniforms, _static ?? true, true);
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/Shader.mjs
var Shader = class {
  constructor(program, uniforms) {
    this.uniformBindCount = 0;
    this.program = program;
    if (uniforms) {
      if (uniforms instanceof UniformGroup) {
        this.uniformGroup = uniforms;
      } else {
        this.uniformGroup = new UniformGroup(uniforms);
      }
    } else {
      this.uniformGroup = new UniformGroup({});
    }
    this.disposeRunner = new Runner("disposeShader");
  }
  checkUniformExists(name, group) {
    if (group.uniforms[name]) {
      return true;
    }
    for (const i2 in group.uniforms) {
      const uniform = group.uniforms[i2];
      if (uniform.group) {
        if (this.checkUniformExists(name, uniform)) {
          return true;
        }
      }
    }
    return false;
  }
  destroy() {
    this.uniformGroup = null;
    this.disposeRunner.emit(this);
    this.disposeRunner.destroy();
  }
  get uniforms() {
    return this.uniformGroup.uniforms;
  }
  static from(vertexSrc, fragmentSrc, uniforms) {
    const program = Program.from(vertexSrc, fragmentSrc);
    return new Shader(program, uniforms);
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/BatchShaderGenerator.mjs
var BatchShaderGenerator = class {
  constructor(vertexSrc, fragTemplate3) {
    this.vertexSrc = vertexSrc;
    this.fragTemplate = fragTemplate3;
    this.programCache = {};
    this.defaultGroupCache = {};
    if (!fragTemplate3.includes("%count%")) {
      throw new Error('Fragment template must contain "%count%".');
    }
    if (!fragTemplate3.includes("%forloop%")) {
      throw new Error('Fragment template must contain "%forloop%".');
    }
  }
  generateShader(maxTextures) {
    if (!this.programCache[maxTextures]) {
      const sampleValues = new Int32Array(maxTextures);
      for (let i2 = 0; i2 < maxTextures; i2++) {
        sampleValues[i2] = i2;
      }
      this.defaultGroupCache[maxTextures] = UniformGroup.from({ uSamplers: sampleValues }, true);
      let fragmentSrc = this.fragTemplate;
      fragmentSrc = fragmentSrc.replace(/%count%/gi, `${maxTextures}`);
      fragmentSrc = fragmentSrc.replace(/%forloop%/gi, this.generateSampleSrc(maxTextures));
      this.programCache[maxTextures] = new Program(this.vertexSrc, fragmentSrc);
    }
    const uniforms = {
      tint: new Float32Array([1, 1, 1, 1]),
      translationMatrix: new Matrix(),
      default: this.defaultGroupCache[maxTextures]
    };
    return new Shader(this.programCache[maxTextures], uniforms);
  }
  generateSampleSrc(maxTextures) {
    let src = "";
    src += "\n";
    src += "\n";
    for (let i2 = 0; i2 < maxTextures; i2++) {
      if (i2 > 0) {
        src += "\nelse ";
      }
      if (i2 < maxTextures - 1) {
        src += `if(vTextureId < ${i2}.5)`;
      }
      src += "\n{";
      src += `
	color = texture2D(uSamplers[${i2}], vTextureCoord);`;
      src += "\n}";
    }
    src += "\n";
    src += "\n";
    return src;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/BatchTextureArray.mjs
var BatchTextureArray = class {
  constructor() {
    this.elements = [];
    this.ids = [];
    this.count = 0;
  }
  clear() {
    for (let i2 = 0; i2 < this.count; i2++) {
      this.elements[i2] = null;
    }
    this.count = 0;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/canUploadSameBuffer.mjs
function canUploadSameBuffer() {
  return !isMobile2.apple.device;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/maxRecommendedTextures.mjs
function maxRecommendedTextures(max) {
  let allowMax = true;
  const navigator2 = settings.ADAPTER.getNavigator();
  if (isMobile2.tablet || isMobile2.phone) {
    if (isMobile2.apple.device) {
      const match = navigator2.userAgent.match(/OS (\d+)_(\d+)?/);
      if (match) {
        const majorVersion = parseInt(match[1], 10);
        if (majorVersion < 11) {
          allowMax = false;
        }
      }
    }
    if (isMobile2.android.device) {
      const match = navigator2.userAgent.match(/Android\s([0-9.]*)/);
      if (match) {
        const majorVersion = parseInt(match[1], 10);
        if (majorVersion < 7) {
          allowMax = false;
        }
      }
    }
  }
  return allowMax ? max : 4;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/ObjectRenderer.mjs
var ObjectRenderer = class {
  constructor(renderer) {
    this.renderer = renderer;
  }
  flush() {
  }
  destroy() {
    this.renderer = null;
  }
  start() {
  }
  stop() {
    this.flush();
  }
  render(_object) {
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/texture.mjs
var defaultFragment2 = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/texture2.mjs
var defaultVertex2 = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/BatchRenderer.mjs
var _BatchRenderer = class extends ObjectRenderer {
  constructor(renderer) {
    super(renderer);
    this.setShaderGenerator();
    this.geometryClass = BatchGeometry;
    this.vertexSize = 6;
    this.state = State.for2d();
    this.size = _BatchRenderer.defaultBatchSize * 4;
    this._vertexCount = 0;
    this._indexCount = 0;
    this._bufferedElements = [];
    this._bufferedTextures = [];
    this._bufferSize = 0;
    this._shader = null;
    this._packedGeometries = [];
    this._packedGeometryPoolSize = 2;
    this._flushId = 0;
    this._aBuffers = {};
    this._iBuffers = {};
    this.maxTextures = 1;
    this.renderer.on("prerender", this.onPrerender, this);
    renderer.runners.contextChange.add(this);
    this._dcIndex = 0;
    this._aIndex = 0;
    this._iIndex = 0;
    this._attributeBuffer = null;
    this._indexBuffer = null;
    this._tempBoundTextures = [];
  }
  static get defaultMaxTextures() {
    this._defaultMaxTextures = this._defaultMaxTextures ?? maxRecommendedTextures(32);
    return this._defaultMaxTextures;
  }
  static set defaultMaxTextures(value) {
    this._defaultMaxTextures = value;
  }
  static get canUploadSameBuffer() {
    this._canUploadSameBuffer = this._canUploadSameBuffer ?? canUploadSameBuffer();
    return this._canUploadSameBuffer;
  }
  static set canUploadSameBuffer(value) {
    this._canUploadSameBuffer = value;
  }
  get MAX_TEXTURES() {
    deprecation("7.1.0", "BatchRenderer#MAX_TEXTURES renamed to BatchRenderer#maxTextures");
    return this.maxTextures;
  }
  static get defaultVertexSrc() {
    return defaultVertex2;
  }
  static get defaultFragmentTemplate() {
    return defaultFragment2;
  }
  setShaderGenerator({
    vertex: vertex6 = _BatchRenderer.defaultVertexSrc,
    fragment: fragment9 = _BatchRenderer.defaultFragmentTemplate
  } = {}) {
    this.shaderGenerator = new BatchShaderGenerator(vertex6, fragment9);
  }
  contextChange() {
    const gl = this.renderer.gl;
    if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
      this.maxTextures = 1;
    } else {
      this.maxTextures = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), _BatchRenderer.defaultMaxTextures);
      this.maxTextures = checkMaxIfStatementsInShader(this.maxTextures, gl);
    }
    this._shader = this.shaderGenerator.generateShader(this.maxTextures);
    for (let i2 = 0; i2 < this._packedGeometryPoolSize; i2++) {
      this._packedGeometries[i2] = new this.geometryClass();
    }
    this.initFlushBuffers();
  }
  initFlushBuffers() {
    const {
      _drawCallPool,
      _textureArrayPool
    } = _BatchRenderer;
    const MAX_SPRITES = this.size / 4;
    const MAX_TA = Math.floor(MAX_SPRITES / this.maxTextures) + 1;
    while (_drawCallPool.length < MAX_SPRITES) {
      _drawCallPool.push(new BatchDrawCall());
    }
    while (_textureArrayPool.length < MAX_TA) {
      _textureArrayPool.push(new BatchTextureArray());
    }
    for (let i2 = 0; i2 < this.maxTextures; i2++) {
      this._tempBoundTextures[i2] = null;
    }
  }
  onPrerender() {
    this._flushId = 0;
  }
  render(element) {
    if (!element._texture.valid) {
      return;
    }
    if (this._vertexCount + element.vertexData.length / 2 > this.size) {
      this.flush();
    }
    this._vertexCount += element.vertexData.length / 2;
    this._indexCount += element.indices.length;
    this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
    this._bufferedElements[this._bufferSize++] = element;
  }
  buildTexturesAndDrawCalls() {
    const {
      _bufferedTextures: textures,
      maxTextures
    } = this;
    const textureArrays = _BatchRenderer._textureArrayPool;
    const batch = this.renderer.batch;
    const boundTextures = this._tempBoundTextures;
    const touch = this.renderer.textureGC.count;
    let TICK = ++BaseTexture._globalBatch;
    let countTexArrays = 0;
    let texArray = textureArrays[0];
    let start = 0;
    batch.copyBoundTextures(boundTextures, maxTextures);
    for (let i2 = 0; i2 < this._bufferSize; ++i2) {
      const tex = textures[i2];
      textures[i2] = null;
      if (tex._batchEnabled === TICK) {
        continue;
      }
      if (texArray.count >= maxTextures) {
        batch.boundArray(texArray, boundTextures, TICK, maxTextures);
        this.buildDrawCalls(texArray, start, i2);
        start = i2;
        texArray = textureArrays[++countTexArrays];
        ++TICK;
      }
      tex._batchEnabled = TICK;
      tex.touched = touch;
      texArray.elements[texArray.count++] = tex;
    }
    if (texArray.count > 0) {
      batch.boundArray(texArray, boundTextures, TICK, maxTextures);
      this.buildDrawCalls(texArray, start, this._bufferSize);
      ++countTexArrays;
      ++TICK;
    }
    for (let i2 = 0; i2 < boundTextures.length; i2++) {
      boundTextures[i2] = null;
    }
    BaseTexture._globalBatch = TICK;
  }
  buildDrawCalls(texArray, start, finish) {
    const {
      _bufferedElements: elements,
      _attributeBuffer,
      _indexBuffer,
      vertexSize
    } = this;
    const drawCalls = _BatchRenderer._drawCallPool;
    let dcIndex = this._dcIndex;
    let aIndex = this._aIndex;
    let iIndex = this._iIndex;
    let drawCall = drawCalls[dcIndex];
    drawCall.start = this._iIndex;
    drawCall.texArray = texArray;
    for (let i2 = start; i2 < finish; ++i2) {
      const sprite = elements[i2];
      const tex = sprite._texture.baseTexture;
      const spriteBlendMode = premultiplyBlendMode[tex.alphaMode ? 1 : 0][sprite.blendMode];
      elements[i2] = null;
      if (start < i2 && drawCall.blend !== spriteBlendMode) {
        drawCall.size = iIndex - drawCall.start;
        start = i2;
        drawCall = drawCalls[++dcIndex];
        drawCall.texArray = texArray;
        drawCall.start = iIndex;
      }
      this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
      aIndex += sprite.vertexData.length / 2 * vertexSize;
      iIndex += sprite.indices.length;
      drawCall.blend = spriteBlendMode;
    }
    if (start < finish) {
      drawCall.size = iIndex - drawCall.start;
      ++dcIndex;
    }
    this._dcIndex = dcIndex;
    this._aIndex = aIndex;
    this._iIndex = iIndex;
  }
  bindAndClearTexArray(texArray) {
    const textureSystem = this.renderer.texture;
    for (let j3 = 0; j3 < texArray.count; j3++) {
      textureSystem.bind(texArray.elements[j3], texArray.ids[j3]);
      texArray.elements[j3] = null;
    }
    texArray.count = 0;
  }
  updateGeometry() {
    const {
      _packedGeometries: packedGeometries,
      _attributeBuffer: attributeBuffer,
      _indexBuffer: indexBuffer
    } = this;
    if (!_BatchRenderer.canUploadSameBuffer) {
      if (this._packedGeometryPoolSize <= this._flushId) {
        this._packedGeometryPoolSize++;
        packedGeometries[this._flushId] = new this.geometryClass();
      }
      packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
      packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
      this.renderer.geometry.bind(packedGeometries[this._flushId]);
      this.renderer.geometry.updateBuffers();
      this._flushId++;
    } else {
      packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
      packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
      this.renderer.geometry.updateBuffers();
    }
  }
  drawBatches() {
    const dcCount = this._dcIndex;
    const { gl, state: stateSystem } = this.renderer;
    const drawCalls = _BatchRenderer._drawCallPool;
    let curTexArray = null;
    for (let i2 = 0; i2 < dcCount; i2++) {
      const { texArray, type, size, start, blend } = drawCalls[i2];
      if (curTexArray !== texArray) {
        curTexArray = texArray;
        this.bindAndClearTexArray(texArray);
      }
      this.state.blendMode = blend;
      stateSystem.set(this.state);
      gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
    }
  }
  flush() {
    if (this._vertexCount === 0) {
      return;
    }
    this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
    this._indexBuffer = this.getIndexBuffer(this._indexCount);
    this._aIndex = 0;
    this._iIndex = 0;
    this._dcIndex = 0;
    this.buildTexturesAndDrawCalls();
    this.updateGeometry();
    this.drawBatches();
    this._bufferSize = 0;
    this._vertexCount = 0;
    this._indexCount = 0;
  }
  start() {
    this.renderer.state.set(this.state);
    this.renderer.texture.ensureSamplerType(this.maxTextures);
    this.renderer.shader.bind(this._shader);
    if (_BatchRenderer.canUploadSameBuffer) {
      this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
    }
  }
  stop() {
    this.flush();
  }
  destroy() {
    for (let i2 = 0; i2 < this._packedGeometryPoolSize; i2++) {
      if (this._packedGeometries[i2]) {
        this._packedGeometries[i2].destroy();
      }
    }
    this.renderer.off("prerender", this.onPrerender, this);
    this._aBuffers = null;
    this._iBuffers = null;
    this._packedGeometries = null;
    this._attributeBuffer = null;
    this._indexBuffer = null;
    if (this._shader) {
      this._shader.destroy();
      this._shader = null;
    }
    super.destroy();
  }
  getAttributeBuffer(size) {
    const roundedP2 = nextPow2(Math.ceil(size / 8));
    const roundedSizeIndex = log2(roundedP2);
    const roundedSize = roundedP2 * 8;
    if (this._aBuffers.length <= roundedSizeIndex) {
      this._iBuffers.length = roundedSizeIndex + 1;
    }
    let buffer = this._aBuffers[roundedSize];
    if (!buffer) {
      this._aBuffers[roundedSize] = buffer = new ViewableBuffer(roundedSize * this.vertexSize * 4);
    }
    return buffer;
  }
  getIndexBuffer(size) {
    const roundedP2 = nextPow2(Math.ceil(size / 12));
    const roundedSizeIndex = log2(roundedP2);
    const roundedSize = roundedP2 * 12;
    if (this._iBuffers.length <= roundedSizeIndex) {
      this._iBuffers.length = roundedSizeIndex + 1;
    }
    let buffer = this._iBuffers[roundedSizeIndex];
    if (!buffer) {
      this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
    }
    return buffer;
  }
  packInterleavedGeometry(element, attributeBuffer, indexBuffer, aIndex, iIndex) {
    const {
      uint32View,
      float32View
    } = attributeBuffer;
    const packedVertices = aIndex / this.vertexSize;
    const uvs = element.uvs;
    const indicies = element.indices;
    const vertexData = element.vertexData;
    const textureId = element._texture.baseTexture._batchLocation;
    const alpha = Math.min(element.worldAlpha, 1);
    const argb = Color.shared.setValue(element._tintRGB).toPremultiplied(alpha, element._texture.baseTexture.alphaMode > 0);
    for (let i2 = 0; i2 < vertexData.length; i2 += 2) {
      float32View[aIndex++] = vertexData[i2];
      float32View[aIndex++] = vertexData[i2 + 1];
      float32View[aIndex++] = uvs[i2];
      float32View[aIndex++] = uvs[i2 + 1];
      uint32View[aIndex++] = argb;
      float32View[aIndex++] = textureId;
    }
    for (let i2 = 0; i2 < indicies.length; i2++) {
      indexBuffer[iIndex++] = packedVertices + indicies[i2];
    }
  }
};
var BatchRenderer = _BatchRenderer;
BatchRenderer.defaultBatchSize = 4096;
BatchRenderer.extension = {
  name: "batch",
  type: ExtensionType.RendererPlugin
};
BatchRenderer._drawCallPool = [];
BatchRenderer._textureArrayPool = [];
extensions.add(BatchRenderer);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/filters/defaultFilter.mjs
var defaultFragment3 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/filters/defaultFilter2.mjs
var defaultVertex3 = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/filters/Filter.mjs
var _Filter = class extends Shader {
  constructor(vertexSrc, fragmentSrc, uniforms) {
    const program = Program.from(vertexSrc || _Filter.defaultVertexSrc, fragmentSrc || _Filter.defaultFragmentSrc);
    super(program, uniforms);
    this.padding = 0;
    this.resolution = _Filter.defaultResolution;
    this.multisample = _Filter.defaultMultisample;
    this.enabled = true;
    this.autoFit = true;
    this.state = new State();
  }
  apply(filterManager, input, output, clearMode, _currentState) {
    filterManager.applyFilter(this, input, output, clearMode);
  }
  get blendMode() {
    return this.state.blendMode;
  }
  set blendMode(value) {
    this.state.blendMode = value;
  }
  get resolution() {
    return this._resolution;
  }
  set resolution(value) {
    this._resolution = value;
  }
  static get defaultVertexSrc() {
    return defaultVertex3;
  }
  static get defaultFragmentSrc() {
    return defaultFragment3;
  }
};
var Filter = _Filter;
Filter.defaultResolution = 1;
Filter.defaultMultisample = MSAA_QUALITY.NONE;

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/background/BackgroundSystem.mjs
var BackgroundSystem = class {
  constructor() {
    this.clearBeforeRender = true;
    this._backgroundColor = new Color(0);
    this.alpha = 1;
  }
  init(options) {
    this.clearBeforeRender = options.clearBeforeRender;
    const { backgroundColor, background, backgroundAlpha } = options;
    const color = background ?? backgroundColor;
    if (color !== void 0) {
      this.color = color;
    }
    this.alpha = backgroundAlpha;
  }
  get color() {
    return this._backgroundColor.value;
  }
  set color(value) {
    this._backgroundColor.setValue(value);
  }
  get alpha() {
    return this._backgroundColor.alpha;
  }
  set alpha(value) {
    this._backgroundColor.setAlpha(value);
  }
  get backgroundColor() {
    return this._backgroundColor;
  }
  destroy() {
  }
};
BackgroundSystem.defaultOptions = {
  backgroundAlpha: 1,
  backgroundColor: 0,
  clearBeforeRender: true
};
BackgroundSystem.extension = {
  type: [
    ExtensionType.RendererSystem,
    ExtensionType.CanvasRendererSystem
  ],
  name: "background"
};
extensions.add(BackgroundSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/batch/BatchSystem.mjs
var BatchSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.emptyRenderer = new ObjectRenderer(renderer);
    this.currentRenderer = this.emptyRenderer;
  }
  setObjectRenderer(objectRenderer) {
    if (this.currentRenderer === objectRenderer) {
      return;
    }
    this.currentRenderer.stop();
    this.currentRenderer = objectRenderer;
    this.currentRenderer.start();
  }
  flush() {
    this.setObjectRenderer(this.emptyRenderer);
  }
  reset() {
    this.setObjectRenderer(this.emptyRenderer);
  }
  copyBoundTextures(arr, maxTextures) {
    const { boundTextures } = this.renderer.texture;
    for (let i2 = maxTextures - 1; i2 >= 0; --i2) {
      arr[i2] = boundTextures[i2] || null;
      if (arr[i2]) {
        arr[i2]._batchLocation = i2;
      }
    }
  }
  boundArray(texArray, boundTextures, batchId, maxTextures) {
    const { elements, ids, count } = texArray;
    let j3 = 0;
    for (let i2 = 0; i2 < count; i2++) {
      const tex = elements[i2];
      const loc = tex._batchLocation;
      if (loc >= 0 && loc < maxTextures && boundTextures[loc] === tex) {
        ids[i2] = loc;
        continue;
      }
      while (j3 < maxTextures) {
        const bound = boundTextures[j3];
        if (bound && bound._batchEnabled === batchId && bound._batchLocation === j3) {
          j3++;
          continue;
        }
        ids[i2] = j3;
        tex._batchLocation = j3;
        boundTextures[j3] = tex;
        break;
      }
    }
  }
  destroy() {
    this.renderer = null;
  }
};
BatchSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "batch"
};
extensions.add(BatchSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/context/ContextSystem.mjs
var CONTEXT_UID_COUNTER = 0;
var ContextSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.webGLVersion = 1;
    this.extensions = {};
    this.supports = {
      uint32Indices: false
    };
    this.handleContextLost = this.handleContextLost.bind(this);
    this.handleContextRestored = this.handleContextRestored.bind(this);
  }
  get isLost() {
    return !this.gl || this.gl.isContextLost();
  }
  contextChange(gl) {
    this.gl = gl;
    this.renderer.gl = gl;
    this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
  }
  init(options) {
    if (options.context) {
      this.initFromContext(options.context);
    } else {
      const alpha = this.renderer.background.alpha < 1;
      const premultipliedAlpha = options.premultipliedAlpha;
      this.preserveDrawingBuffer = options.preserveDrawingBuffer;
      this.useContextAlpha = options.useContextAlpha;
      this.powerPreference = options.powerPreference;
      this.initFromOptions({
        alpha,
        premultipliedAlpha,
        antialias: options.antialias,
        stencil: true,
        preserveDrawingBuffer: options.preserveDrawingBuffer,
        powerPreference: options.powerPreference
      });
    }
  }
  initFromContext(gl) {
    this.gl = gl;
    this.validateContext(gl);
    this.renderer.gl = gl;
    this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
    this.renderer.runners.contextChange.emit(gl);
    const view = this.renderer.view;
    if (view.addEventListener !== void 0) {
      view.addEventListener("webglcontextlost", this.handleContextLost, false);
      view.addEventListener("webglcontextrestored", this.handleContextRestored, false);
    }
  }
  initFromOptions(options) {
    const gl = this.createContext(this.renderer.view, options);
    this.initFromContext(gl);
  }
  createContext(canvas, options) {
    let gl;
    if (settings.PREFER_ENV >= ENV.WEBGL2) {
      gl = canvas.getContext("webgl2", options);
    }
    if (gl) {
      this.webGLVersion = 2;
    } else {
      this.webGLVersion = 1;
      gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
      if (!gl) {
        throw new Error("This browser does not support WebGL. Try using the canvas renderer");
      }
    }
    this.gl = gl;
    this.getExtensions();
    return this.gl;
  }
  getExtensions() {
    const { gl } = this;
    const common = {
      loseContext: gl.getExtension("WEBGL_lose_context"),
      anisotropicFiltering: gl.getExtension("EXT_texture_filter_anisotropic"),
      floatTextureLinear: gl.getExtension("OES_texture_float_linear"),
      s3tc: gl.getExtension("WEBGL_compressed_texture_s3tc"),
      s3tc_sRGB: gl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
      etc: gl.getExtension("WEBGL_compressed_texture_etc"),
      etc1: gl.getExtension("WEBGL_compressed_texture_etc1"),
      pvrtc: gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      atc: gl.getExtension("WEBGL_compressed_texture_atc"),
      astc: gl.getExtension("WEBGL_compressed_texture_astc")
    };
    if (this.webGLVersion === 1) {
      Object.assign(this.extensions, common, {
        drawBuffers: gl.getExtension("WEBGL_draw_buffers"),
        depthTexture: gl.getExtension("WEBGL_depth_texture"),
        vertexArrayObject: gl.getExtension("OES_vertex_array_object") || gl.getExtension("MOZ_OES_vertex_array_object") || gl.getExtension("WEBKIT_OES_vertex_array_object"),
        uint32ElementIndex: gl.getExtension("OES_element_index_uint"),
        floatTexture: gl.getExtension("OES_texture_float"),
        floatTextureLinear: gl.getExtension("OES_texture_float_linear"),
        textureHalfFloat: gl.getExtension("OES_texture_half_float"),
        textureHalfFloatLinear: gl.getExtension("OES_texture_half_float_linear")
      });
    } else if (this.webGLVersion === 2) {
      Object.assign(this.extensions, common, {
        colorBufferFloat: gl.getExtension("EXT_color_buffer_float")
      });
    }
  }
  handleContextLost(event) {
    event.preventDefault();
    setTimeout(() => {
      if (this.gl.isContextLost() && this.extensions.loseContext) {
        this.extensions.loseContext.restoreContext();
      }
    }, 0);
  }
  handleContextRestored() {
    this.renderer.runners.contextChange.emit(this.gl);
  }
  destroy() {
    const view = this.renderer.view;
    this.renderer = null;
    if (view.removeEventListener !== void 0) {
      view.removeEventListener("webglcontextlost", this.handleContextLost);
      view.removeEventListener("webglcontextrestored", this.handleContextRestored);
    }
    this.gl.useProgram(null);
    if (this.extensions.loseContext) {
      this.extensions.loseContext.loseContext();
    }
  }
  postrender() {
    if (this.renderer.objectRenderer.renderingToScreen) {
      this.gl.flush();
    }
  }
  validateContext(gl) {
    const attributes = gl.getContextAttributes();
    const isWebGl2 = "WebGL2RenderingContext" in globalThis && gl instanceof globalThis.WebGL2RenderingContext;
    if (isWebGl2) {
      this.webGLVersion = 2;
    }
    if (attributes && !attributes.stencil) {
      console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
    }
    const hasuint32 = isWebGl2 || !!gl.getExtension("OES_element_index_uint");
    this.supports.uint32Indices = hasuint32;
    if (!hasuint32) {
      console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
    }
  }
};
ContextSystem.defaultOptions = {
  context: null,
  antialias: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  powerPreference: "default"
};
ContextSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "context"
};
extensions.add(ContextSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/DepthResource.mjs
var DepthResource = class extends BufferResource {
  upload(renderer, baseTexture, glTexture) {
    const gl = renderer.gl;
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
    const width = baseTexture.realWidth;
    const height = baseTexture.realHeight;
    if (glTexture.width === width && glTexture.height === height) {
      gl.texSubImage2D(baseTexture.target, 0, 0, 0, width, height, baseTexture.format, glTexture.type, this.data);
    } else {
      glTexture.width = width;
      glTexture.height = height;
      gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, width, height, 0, baseTexture.format, glTexture.type, this.data);
    }
    return true;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/framebuffer/Framebuffer.mjs
var Framebuffer = class {
  constructor(width, height) {
    this.width = Math.round(width || 100);
    this.height = Math.round(height || 100);
    this.stencil = false;
    this.depth = false;
    this.dirtyId = 0;
    this.dirtyFormat = 0;
    this.dirtySize = 0;
    this.depthTexture = null;
    this.colorTextures = [];
    this.glFramebuffers = {};
    this.disposeRunner = new Runner("disposeFramebuffer");
    this.multisample = MSAA_QUALITY.NONE;
  }
  get colorTexture() {
    return this.colorTextures[0];
  }
  addColorTexture(index = 0, texture) {
    this.colorTextures[index] = texture || new BaseTexture(null, {
      scaleMode: SCALE_MODES.NEAREST,
      resolution: 1,
      mipmap: MIPMAP_MODES.OFF,
      width: this.width,
      height: this.height
    });
    this.dirtyId++;
    this.dirtyFormat++;
    return this;
  }
  addDepthTexture(texture) {
    this.depthTexture = texture || new BaseTexture(new DepthResource(null, { width: this.width, height: this.height }), {
      scaleMode: SCALE_MODES.NEAREST,
      resolution: 1,
      width: this.width,
      height: this.height,
      mipmap: MIPMAP_MODES.OFF,
      format: FORMATS.DEPTH_COMPONENT,
      type: TYPES.UNSIGNED_SHORT
    });
    this.dirtyId++;
    this.dirtyFormat++;
    return this;
  }
  enableDepth() {
    this.depth = true;
    this.dirtyId++;
    this.dirtyFormat++;
    return this;
  }
  enableStencil() {
    this.stencil = true;
    this.dirtyId++;
    this.dirtyFormat++;
    return this;
  }
  resize(width, height) {
    width = Math.round(width);
    height = Math.round(height);
    if (width === this.width && height === this.height)
      return;
    this.width = width;
    this.height = height;
    this.dirtyId++;
    this.dirtySize++;
    for (let i2 = 0; i2 < this.colorTextures.length; i2++) {
      const texture = this.colorTextures[i2];
      const resolution = texture.resolution;
      texture.setSize(width / resolution, height / resolution);
    }
    if (this.depthTexture) {
      const resolution = this.depthTexture.resolution;
      this.depthTexture.setSize(width / resolution, height / resolution);
    }
  }
  dispose() {
    this.disposeRunner.emit(this, false);
  }
  destroyDepthTexture() {
    if (this.depthTexture) {
      this.depthTexture.destroy();
      this.depthTexture = null;
      ++this.dirtyId;
      ++this.dirtyFormat;
    }
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/renderTexture/BaseRenderTexture.mjs
var BaseRenderTexture = class extends BaseTexture {
  constructor(options = {}) {
    if (typeof options === "number") {
      const width = arguments[0];
      const height = arguments[1];
      const scaleMode = arguments[2];
      const resolution = arguments[3];
      options = { width, height, scaleMode, resolution };
    }
    options.width = options.width || 100;
    options.height = options.height || 100;
    options.multisample ?? (options.multisample = MSAA_QUALITY.NONE);
    super(null, options);
    this.mipmap = MIPMAP_MODES.OFF;
    this.valid = true;
    this._clear = new Color([0, 0, 0, 0]);
    this.framebuffer = new Framebuffer(this.realWidth, this.realHeight).addColorTexture(0, this);
    this.framebuffer.multisample = options.multisample;
    this.maskStack = [];
    this.filterStack = [{}];
  }
  set clearColor(value) {
    this._clear.setValue(value);
  }
  get clearColor() {
    return this._clear.value;
  }
  get clear() {
    return this._clear;
  }
  resize(desiredWidth, desiredHeight) {
    this.framebuffer.resize(desiredWidth * this.resolution, desiredHeight * this.resolution);
    this.setRealSize(this.framebuffer.width, this.framebuffer.height);
  }
  dispose() {
    this.framebuffer.dispose();
    super.dispose();
  }
  destroy() {
    super.destroy();
    this.framebuffer.destroyDepthTexture();
    this.framebuffer = null;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/BaseImageResource.mjs
var BaseImageResource = class extends Resource {
  constructor(source) {
    const sourceAny = source;
    const width = sourceAny.naturalWidth || sourceAny.videoWidth || sourceAny.width;
    const height = sourceAny.naturalHeight || sourceAny.videoHeight || sourceAny.height;
    super(width, height);
    this.source = source;
    this.noSubImage = false;
  }
  static crossOrigin(element, url2, crossorigin) {
    if (crossorigin === void 0 && !url2.startsWith("data:")) {
      element.crossOrigin = determineCrossOrigin(url2);
    } else if (crossorigin !== false) {
      element.crossOrigin = typeof crossorigin === "string" ? crossorigin : "anonymous";
    }
  }
  upload(renderer, baseTexture, glTexture, source) {
    const gl = renderer.gl;
    const width = baseTexture.realWidth;
    const height = baseTexture.realHeight;
    source = source || this.source;
    if (typeof HTMLImageElement !== "undefined" && source instanceof HTMLImageElement) {
      if (!source.complete || source.naturalWidth === 0) {
        return false;
      }
    } else if (typeof HTMLVideoElement !== "undefined" && source instanceof HTMLVideoElement) {
      if (source.readyState <= 1 && source.buffered.length === 0) {
        return false;
      }
    }
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
    if (!this.noSubImage && baseTexture.target === gl.TEXTURE_2D && glTexture.width === width && glTexture.height === height) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, baseTexture.format, glTexture.type, source);
    } else {
      glTexture.width = width;
      glTexture.height = height;
      gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, baseTexture.format, glTexture.type, source);
    }
    return true;
  }
  update() {
    if (this.destroyed) {
      return;
    }
    const source = this.source;
    const width = source.naturalWidth || source.videoWidth || source.width;
    const height = source.naturalHeight || source.videoHeight || source.height;
    this.resize(width, height);
    super.update();
  }
  dispose() {
    this.source = null;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/ImageResource.mjs
var ImageResource = class extends BaseImageResource {
  constructor(source, options) {
    options = options || {};
    if (typeof source === "string") {
      const imageElement = new Image();
      BaseImageResource.crossOrigin(imageElement, source, options.crossorigin);
      imageElement.src = source;
      source = imageElement;
    }
    super(source);
    if (!source.complete && !!this._width && !!this._height) {
      this._width = 0;
      this._height = 0;
    }
    this.url = source.src;
    this._process = null;
    this.preserveBitmap = false;
    this.createBitmap = (options.createBitmap ?? settings.CREATE_IMAGE_BITMAP) && !!globalThis.createImageBitmap;
    this.alphaMode = typeof options.alphaMode === "number" ? options.alphaMode : null;
    this.bitmap = null;
    this._load = null;
    if (options.autoLoad !== false) {
      this.load();
    }
  }
  load(createBitmap) {
    if (this._load) {
      return this._load;
    }
    if (createBitmap !== void 0) {
      this.createBitmap = createBitmap;
    }
    this._load = new Promise((resolve2, reject) => {
      const source = this.source;
      this.url = source.src;
      const completed = () => {
        if (this.destroyed) {
          return;
        }
        source.onload = null;
        source.onerror = null;
        this.resize(source.width, source.height);
        this._load = null;
        if (this.createBitmap) {
          resolve2(this.process());
        } else {
          resolve2(this);
        }
      };
      if (source.complete && source.src) {
        completed();
      } else {
        source.onload = completed;
        source.onerror = (event) => {
          reject(event);
          this.onError.emit(event);
        };
      }
    });
    return this._load;
  }
  process() {
    const source = this.source;
    if (this._process !== null) {
      return this._process;
    }
    if (this.bitmap !== null || !globalThis.createImageBitmap) {
      return Promise.resolve(this);
    }
    const createImageBitmap2 = globalThis.createImageBitmap;
    const cors = !source.crossOrigin || source.crossOrigin === "anonymous";
    this._process = fetch(source.src, {
      mode: cors ? "cors" : "no-cors"
    }).then((r2) => r2.blob()).then((blob) => createImageBitmap2(blob, 0, 0, source.width, source.height, {
      premultiplyAlpha: this.alphaMode === null || this.alphaMode === ALPHA_MODES.UNPACK ? "premultiply" : "none"
    })).then((bitmap) => {
      if (this.destroyed) {
        return Promise.reject();
      }
      this.bitmap = bitmap;
      this.update();
      this._process = null;
      return Promise.resolve(this);
    });
    return this._process;
  }
  upload(renderer, baseTexture, glTexture) {
    if (typeof this.alphaMode === "number") {
      baseTexture.alphaMode = this.alphaMode;
    }
    if (!this.createBitmap) {
      return super.upload(renderer, baseTexture, glTexture);
    }
    if (!this.bitmap) {
      this.process();
      if (!this.bitmap) {
        return false;
      }
    }
    super.upload(renderer, baseTexture, glTexture, this.bitmap);
    if (!this.preserveBitmap) {
      let flag = true;
      const glTextures = baseTexture._glTextures;
      for (const key in glTextures) {
        const otherTex = glTextures[key];
        if (otherTex !== glTexture && otherTex.dirtyId !== baseTexture.dirtyId) {
          flag = false;
          break;
        }
      }
      if (flag) {
        if (this.bitmap.close) {
          this.bitmap.close();
        }
        this.bitmap = null;
      }
    }
    return true;
  }
  dispose() {
    this.source.onload = null;
    this.source.onerror = null;
    super.dispose();
    if (this.bitmap) {
      this.bitmap.close();
      this.bitmap = null;
    }
    this._process = null;
    this._load = null;
  }
  static test(source) {
    return typeof HTMLImageElement !== "undefined" && (typeof source === "string" || source instanceof HTMLImageElement);
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/TextureUvs.mjs
var TextureUvs = class {
  constructor() {
    this.x0 = 0;
    this.y0 = 0;
    this.x1 = 1;
    this.y1 = 0;
    this.x2 = 1;
    this.y2 = 1;
    this.x3 = 0;
    this.y3 = 1;
    this.uvsFloat32 = new Float32Array(8);
  }
  set(frame, baseFrame, rotate) {
    const tw = baseFrame.width;
    const th = baseFrame.height;
    if (rotate) {
      const w22 = frame.width / 2 / tw;
      const h2 = frame.height / 2 / th;
      const cX = frame.x / tw + w22;
      const cY = frame.y / th + h2;
      rotate = groupD8.add(rotate, groupD8.NW);
      this.x0 = cX + w22 * groupD8.uX(rotate);
      this.y0 = cY + h2 * groupD8.uY(rotate);
      rotate = groupD8.add(rotate, 2);
      this.x1 = cX + w22 * groupD8.uX(rotate);
      this.y1 = cY + h2 * groupD8.uY(rotate);
      rotate = groupD8.add(rotate, 2);
      this.x2 = cX + w22 * groupD8.uX(rotate);
      this.y2 = cY + h2 * groupD8.uY(rotate);
      rotate = groupD8.add(rotate, 2);
      this.x3 = cX + w22 * groupD8.uX(rotate);
      this.y3 = cY + h2 * groupD8.uY(rotate);
    } else {
      this.x0 = frame.x / tw;
      this.y0 = frame.y / th;
      this.x1 = (frame.x + frame.width) / tw;
      this.y1 = frame.y / th;
      this.x2 = (frame.x + frame.width) / tw;
      this.y2 = (frame.y + frame.height) / th;
      this.x3 = frame.x / tw;
      this.y3 = (frame.y + frame.height) / th;
    }
    this.uvsFloat32[0] = this.x0;
    this.uvsFloat32[1] = this.y0;
    this.uvsFloat32[2] = this.x1;
    this.uvsFloat32[3] = this.y1;
    this.uvsFloat32[4] = this.x2;
    this.uvsFloat32[5] = this.y2;
    this.uvsFloat32[6] = this.x3;
    this.uvsFloat32[7] = this.y3;
  }
  toString() {
    return `[@pixi/core:TextureUvs x0=${this.x0} y0=${this.y0} x1=${this.x1} y1=${this.y1} x2=${this.x2} y2=${this.y2} x3=${this.x3} y3=${this.y3}]`;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/Texture.mjs
var DEFAULT_UVS = new TextureUvs();
function removeAllHandlers(tex) {
  tex.destroy = function _emptyDestroy() {
  };
  tex.on = function _emptyOn() {
  };
  tex.once = function _emptyOnce() {
  };
  tex.emit = function _emptyEmit() {
  };
}
var Texture = class extends import_eventemitter3.default {
  constructor(baseTexture, frame, orig, trim, rotate, anchor, borders) {
    super();
    this.noFrame = false;
    if (!frame) {
      this.noFrame = true;
      frame = new Rectangle(0, 0, 1, 1);
    }
    if (baseTexture instanceof Texture) {
      baseTexture = baseTexture.baseTexture;
    }
    this.baseTexture = baseTexture;
    this._frame = frame;
    this.trim = trim;
    this.valid = false;
    this._uvs = DEFAULT_UVS;
    this.uvMatrix = null;
    this.orig = orig || frame;
    this._rotate = Number(rotate || 0);
    if (rotate === true) {
      this._rotate = 2;
    } else if (this._rotate % 2 !== 0) {
      throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
    }
    this.defaultAnchor = anchor ? new Point(anchor.x, anchor.y) : new Point(0, 0);
    this.defaultBorders = borders;
    this._updateID = 0;
    this.textureCacheIds = [];
    if (!baseTexture.valid) {
      baseTexture.once("loaded", this.onBaseTextureUpdated, this);
    } else if (this.noFrame) {
      if (baseTexture.valid) {
        this.onBaseTextureUpdated(baseTexture);
      }
    } else {
      this.frame = frame;
    }
    if (this.noFrame) {
      baseTexture.on("update", this.onBaseTextureUpdated, this);
    }
  }
  update() {
    if (this.baseTexture.resource) {
      this.baseTexture.resource.update();
    }
  }
  onBaseTextureUpdated(baseTexture) {
    if (this.noFrame) {
      if (!this.baseTexture.valid) {
        return;
      }
      this._frame.width = baseTexture.width;
      this._frame.height = baseTexture.height;
      this.valid = true;
      this.updateUvs();
    } else {
      this.frame = this._frame;
    }
    this.emit("update", this);
  }
  destroy(destroyBase) {
    if (this.baseTexture) {
      if (destroyBase) {
        const { resource } = this.baseTexture;
        if (resource?.url && TextureCache[resource.url]) {
          Texture.removeFromCache(resource.url);
        }
        this.baseTexture.destroy();
      }
      this.baseTexture.off("loaded", this.onBaseTextureUpdated, this);
      this.baseTexture.off("update", this.onBaseTextureUpdated, this);
      this.baseTexture = null;
    }
    this._frame = null;
    this._uvs = null;
    this.trim = null;
    this.orig = null;
    this.valid = false;
    Texture.removeFromCache(this);
    this.textureCacheIds = null;
  }
  clone() {
    const clonedFrame = this._frame.clone();
    const clonedOrig = this._frame === this.orig ? clonedFrame : this.orig.clone();
    const clonedTexture = new Texture(this.baseTexture, !this.noFrame && clonedFrame, clonedOrig, this.trim?.clone(), this.rotate, this.defaultAnchor, this.defaultBorders);
    if (this.noFrame) {
      clonedTexture._frame = clonedFrame;
    }
    return clonedTexture;
  }
  updateUvs() {
    if (this._uvs === DEFAULT_UVS) {
      this._uvs = new TextureUvs();
    }
    this._uvs.set(this._frame, this.baseTexture, this.rotate);
    this._updateID++;
  }
  static from(source, options = {}, strict = settings.STRICT_TEXTURE_CACHE) {
    const isFrame = typeof source === "string";
    let cacheId = null;
    if (isFrame) {
      cacheId = source;
    } else if (source instanceof BaseTexture) {
      if (!source.cacheId) {
        const prefix = options?.pixiIdPrefix || "pixiid";
        source.cacheId = `${prefix}-${uid()}`;
        BaseTexture.addToCache(source, source.cacheId);
      }
      cacheId = source.cacheId;
    } else {
      if (!source._pixiId) {
        const prefix = options?.pixiIdPrefix || "pixiid";
        source._pixiId = `${prefix}_${uid()}`;
      }
      cacheId = source._pixiId;
    }
    let texture = TextureCache[cacheId];
    if (isFrame && strict && !texture) {
      throw new Error(`The cacheId "${cacheId}" does not exist in TextureCache.`);
    }
    if (!texture && !(source instanceof BaseTexture)) {
      if (!options.resolution) {
        options.resolution = getResolutionOfUrl(source);
      }
      texture = new Texture(new BaseTexture(source, options));
      texture.baseTexture.cacheId = cacheId;
      BaseTexture.addToCache(texture.baseTexture, cacheId);
      Texture.addToCache(texture, cacheId);
    } else if (!texture && source instanceof BaseTexture) {
      texture = new Texture(source);
      Texture.addToCache(texture, cacheId);
    }
    return texture;
  }
  static fromURL(url2, options) {
    const resourceOptions = Object.assign({ autoLoad: false }, options?.resourceOptions);
    const texture = Texture.from(url2, Object.assign({ resourceOptions }, options), false);
    const resource = texture.baseTexture.resource;
    if (texture.baseTexture.valid) {
      return Promise.resolve(texture);
    }
    return resource.load().then(() => Promise.resolve(texture));
  }
  static fromBuffer(buffer, width, height, options) {
    return new Texture(BaseTexture.fromBuffer(buffer, width, height, options));
  }
  static fromLoader(source, imageUrl, name, options) {
    const baseTexture = new BaseTexture(source, Object.assign({
      scaleMode: BaseTexture.defaultOptions.scaleMode,
      resolution: getResolutionOfUrl(imageUrl)
    }, options));
    const { resource } = baseTexture;
    if (resource instanceof ImageResource) {
      resource.url = imageUrl;
    }
    const texture = new Texture(baseTexture);
    if (!name) {
      name = imageUrl;
    }
    BaseTexture.addToCache(texture.baseTexture, name);
    Texture.addToCache(texture, name);
    if (name !== imageUrl) {
      BaseTexture.addToCache(texture.baseTexture, imageUrl);
      Texture.addToCache(texture, imageUrl);
    }
    if (texture.baseTexture.valid) {
      return Promise.resolve(texture);
    }
    return new Promise((resolve2) => {
      texture.baseTexture.once("loaded", () => resolve2(texture));
    });
  }
  static addToCache(texture, id) {
    if (id) {
      if (!texture.textureCacheIds.includes(id)) {
        texture.textureCacheIds.push(id);
      }
      if (TextureCache[id] && TextureCache[id] !== texture) {
        console.warn(`Texture added to the cache with an id [${id}] that already had an entry`);
      }
      TextureCache[id] = texture;
    }
  }
  static removeFromCache(texture) {
    if (typeof texture === "string") {
      const textureFromCache = TextureCache[texture];
      if (textureFromCache) {
        const index = textureFromCache.textureCacheIds.indexOf(texture);
        if (index > -1) {
          textureFromCache.textureCacheIds.splice(index, 1);
        }
        delete TextureCache[texture];
        return textureFromCache;
      }
    } else if (texture?.textureCacheIds) {
      for (let i2 = 0; i2 < texture.textureCacheIds.length; ++i2) {
        if (TextureCache[texture.textureCacheIds[i2]] === texture) {
          delete TextureCache[texture.textureCacheIds[i2]];
        }
      }
      texture.textureCacheIds.length = 0;
      return texture;
    }
    return null;
  }
  get resolution() {
    return this.baseTexture.resolution;
  }
  get frame() {
    return this._frame;
  }
  set frame(frame) {
    this._frame = frame;
    this.noFrame = false;
    const { x: x2, y: y2, width, height } = frame;
    const xNotFit = x2 + width > this.baseTexture.width;
    const yNotFit = y2 + height > this.baseTexture.height;
    if (xNotFit || yNotFit) {
      const relationship = xNotFit && yNotFit ? "and" : "or";
      const errorX = `X: ${x2} + ${width} = ${x2 + width} > ${this.baseTexture.width}`;
      const errorY = `Y: ${y2} + ${height} = ${y2 + height} > ${this.baseTexture.height}`;
      throw new Error(`Texture Error: frame does not fit inside the base Texture dimensions: ${errorX} ${relationship} ${errorY}`);
    }
    this.valid = width && height && this.baseTexture.valid;
    if (!this.trim && !this.rotate) {
      this.orig = frame;
    }
    if (this.valid) {
      this.updateUvs();
    }
  }
  get rotate() {
    return this._rotate;
  }
  set rotate(rotate) {
    this._rotate = rotate;
    if (this.valid) {
      this.updateUvs();
    }
  }
  get width() {
    return this.orig.width;
  }
  get height() {
    return this.orig.height;
  }
  castToBaseTexture() {
    return this.baseTexture;
  }
  static get EMPTY() {
    if (!Texture._EMPTY) {
      Texture._EMPTY = new Texture(new BaseTexture());
      removeAllHandlers(Texture._EMPTY);
      removeAllHandlers(Texture._EMPTY.baseTexture);
    }
    return Texture._EMPTY;
  }
  static get WHITE() {
    if (!Texture._WHITE) {
      const canvas = settings.ADAPTER.createCanvas(16, 16);
      const context2 = canvas.getContext("2d");
      canvas.width = 16;
      canvas.height = 16;
      context2.fillStyle = "white";
      context2.fillRect(0, 0, 16, 16);
      Texture._WHITE = new Texture(BaseTexture.from(canvas));
      removeAllHandlers(Texture._WHITE);
      removeAllHandlers(Texture._WHITE.baseTexture);
    }
    return Texture._WHITE;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/renderTexture/RenderTexture.mjs
var RenderTexture = class extends Texture {
  constructor(baseRenderTexture, frame) {
    super(baseRenderTexture, frame);
    this.valid = true;
    this.filterFrame = null;
    this.filterPoolKey = null;
    this.updateUvs();
  }
  get framebuffer() {
    return this.baseTexture.framebuffer;
  }
  get multisample() {
    return this.framebuffer.multisample;
  }
  set multisample(value) {
    this.framebuffer.multisample = value;
  }
  resize(desiredWidth, desiredHeight, resizeBaseTexture = true) {
    const resolution = this.baseTexture.resolution;
    const width = Math.round(desiredWidth * resolution) / resolution;
    const height = Math.round(desiredHeight * resolution) / resolution;
    this.valid = width > 0 && height > 0;
    this._frame.width = this.orig.width = width;
    this._frame.height = this.orig.height = height;
    if (resizeBaseTexture) {
      this.baseTexture.resize(width, height);
    }
    this.updateUvs();
  }
  setResolution(resolution) {
    const { baseTexture } = this;
    if (baseTexture.resolution === resolution) {
      return;
    }
    baseTexture.setResolution(resolution);
    this.resize(baseTexture.width, baseTexture.height, false);
  }
  static create(options) {
    return new RenderTexture(new BaseRenderTexture(options));
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/renderTexture/RenderTexturePool.mjs
var RenderTexturePool = class {
  constructor(textureOptions) {
    this.texturePool = {};
    this.textureOptions = textureOptions || {};
    this.enableFullScreen = false;
    this._pixelsWidth = 0;
    this._pixelsHeight = 0;
  }
  createTexture(realWidth, realHeight, multisample = MSAA_QUALITY.NONE) {
    const baseRenderTexture = new BaseRenderTexture(Object.assign({
      width: realWidth,
      height: realHeight,
      resolution: 1,
      multisample
    }, this.textureOptions));
    return new RenderTexture(baseRenderTexture);
  }
  getOptimalTexture(minWidth, minHeight, resolution = 1, multisample = MSAA_QUALITY.NONE) {
    let key;
    minWidth = Math.ceil(minWidth * resolution - 1e-6);
    minHeight = Math.ceil(minHeight * resolution - 1e-6);
    if (!this.enableFullScreen || minWidth !== this._pixelsWidth || minHeight !== this._pixelsHeight) {
      minWidth = nextPow2(minWidth);
      minHeight = nextPow2(minHeight);
      key = ((minWidth & 65535) << 16 | minHeight & 65535) >>> 0;
      if (multisample > 1) {
        key += multisample * 4294967296;
      }
    } else {
      key = multisample > 1 ? -multisample : -1;
    }
    if (!this.texturePool[key]) {
      this.texturePool[key] = [];
    }
    let renderTexture = this.texturePool[key].pop();
    if (!renderTexture) {
      renderTexture = this.createTexture(minWidth, minHeight, multisample);
    }
    renderTexture.filterPoolKey = key;
    renderTexture.setResolution(resolution);
    return renderTexture;
  }
  getFilterTexture(input, resolution, multisample) {
    const filterTexture = this.getOptimalTexture(input.width, input.height, resolution || input.resolution, multisample || MSAA_QUALITY.NONE);
    filterTexture.filterFrame = input.filterFrame;
    return filterTexture;
  }
  returnTexture(renderTexture) {
    const key = renderTexture.filterPoolKey;
    renderTexture.filterFrame = null;
    this.texturePool[key].push(renderTexture);
  }
  returnFilterTexture(renderTexture) {
    this.returnTexture(renderTexture);
  }
  clear(destroyTextures) {
    destroyTextures = destroyTextures !== false;
    if (destroyTextures) {
      for (const i2 in this.texturePool) {
        const textures = this.texturePool[i2];
        if (textures) {
          for (let j3 = 0; j3 < textures.length; j3++) {
            textures[j3].destroy(true);
          }
        }
      }
    }
    this.texturePool = {};
  }
  setScreenSize(size) {
    if (size.width === this._pixelsWidth && size.height === this._pixelsHeight) {
      return;
    }
    this.enableFullScreen = size.width > 0 && size.height > 0;
    for (const i2 in this.texturePool) {
      if (!(Number(i2) < 0)) {
        continue;
      }
      const textures = this.texturePool[i2];
      if (textures) {
        for (let j3 = 0; j3 < textures.length; j3++) {
          textures[j3].destroy(true);
        }
      }
      this.texturePool[i2] = [];
    }
    this._pixelsWidth = size.width;
    this._pixelsHeight = size.height;
  }
};
RenderTexturePool.SCREEN_KEY = -1;

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/utils/Quad.mjs
var Quad = class extends Geometry {
  constructor() {
    super();
    this.addAttribute("aVertexPosition", new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ])).addIndex([0, 1, 3, 2]);
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/utils/QuadUv.mjs
var QuadUv = class extends Geometry {
  constructor() {
    super();
    this.vertices = new Float32Array([
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1
    ]);
    this.uvs = new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ]);
    this.vertexBuffer = new Buffer2(this.vertices);
    this.uvBuffer = new Buffer2(this.uvs);
    this.addAttribute("aVertexPosition", this.vertexBuffer).addAttribute("aTextureCoord", this.uvBuffer).addIndex([0, 1, 2, 0, 2, 3]);
  }
  map(targetTextureFrame, destinationFrame) {
    let x2 = 0;
    let y2 = 0;
    this.uvs[0] = x2;
    this.uvs[1] = y2;
    this.uvs[2] = x2 + destinationFrame.width / targetTextureFrame.width;
    this.uvs[3] = y2;
    this.uvs[4] = x2 + destinationFrame.width / targetTextureFrame.width;
    this.uvs[5] = y2 + destinationFrame.height / targetTextureFrame.height;
    this.uvs[6] = x2;
    this.uvs[7] = y2 + destinationFrame.height / targetTextureFrame.height;
    x2 = destinationFrame.x;
    y2 = destinationFrame.y;
    this.vertices[0] = x2;
    this.vertices[1] = y2;
    this.vertices[2] = x2 + destinationFrame.width;
    this.vertices[3] = y2;
    this.vertices[4] = x2 + destinationFrame.width;
    this.vertices[5] = y2 + destinationFrame.height;
    this.vertices[6] = x2;
    this.vertices[7] = y2 + destinationFrame.height;
    this.invalidate();
    return this;
  }
  invalidate() {
    this.vertexBuffer._updateID++;
    this.uvBuffer._updateID++;
    return this;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/filters/FilterState.mjs
var FilterState = class {
  constructor() {
    this.renderTexture = null;
    this.target = null;
    this.legacy = false;
    this.resolution = 1;
    this.multisample = MSAA_QUALITY.NONE;
    this.sourceFrame = new Rectangle();
    this.destinationFrame = new Rectangle();
    this.bindingSourceFrame = new Rectangle();
    this.bindingDestinationFrame = new Rectangle();
    this.filters = [];
    this.transform = null;
  }
  clear() {
    this.target = null;
    this.filters = null;
    this.renderTexture = null;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/filters/FilterSystem.mjs
var tempPoints2 = [new Point(), new Point(), new Point(), new Point()];
var tempMatrix = new Matrix();
var FilterSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.defaultFilterStack = [{}];
    this.texturePool = new RenderTexturePool();
    this.statePool = [];
    this.quad = new Quad();
    this.quadUv = new QuadUv();
    this.tempRect = new Rectangle();
    this.activeState = {};
    this.globalUniforms = new UniformGroup({
      outputFrame: new Rectangle(),
      inputSize: new Float32Array(4),
      inputPixel: new Float32Array(4),
      inputClamp: new Float32Array(4),
      resolution: 1,
      filterArea: new Float32Array(4),
      filterClamp: new Float32Array(4)
    }, true);
    this.forceClear = false;
    this.useMaxPadding = false;
  }
  init() {
    this.texturePool.setScreenSize(this.renderer.view);
  }
  push(target, filters2) {
    const renderer = this.renderer;
    const filterStack = this.defaultFilterStack;
    const state = this.statePool.pop() || new FilterState();
    const renderTextureSystem = this.renderer.renderTexture;
    let resolution = filters2[0].resolution;
    let multisample = filters2[0].multisample;
    let padding = filters2[0].padding;
    let autoFit = filters2[0].autoFit;
    let legacy = filters2[0].legacy ?? true;
    for (let i2 = 1; i2 < filters2.length; i2++) {
      const filter = filters2[i2];
      resolution = Math.min(resolution, filter.resolution);
      multisample = Math.min(multisample, filter.multisample);
      padding = this.useMaxPadding ? Math.max(padding, filter.padding) : padding + filter.padding;
      autoFit = autoFit && filter.autoFit;
      legacy = legacy || (filter.legacy ?? true);
    }
    if (filterStack.length === 1) {
      this.defaultFilterStack[0].renderTexture = renderTextureSystem.current;
    }
    filterStack.push(state);
    state.resolution = resolution;
    state.multisample = multisample;
    state.legacy = legacy;
    state.target = target;
    state.sourceFrame.copyFrom(target.filterArea || target.getBounds(true));
    state.sourceFrame.pad(padding);
    const sourceFrameProjected = this.tempRect.copyFrom(renderTextureSystem.sourceFrame);
    if (renderer.projection.transform) {
      this.transformAABB(tempMatrix.copyFrom(renderer.projection.transform).invert(), sourceFrameProjected);
    }
    if (autoFit) {
      state.sourceFrame.fit(sourceFrameProjected);
      if (state.sourceFrame.width <= 0 || state.sourceFrame.height <= 0) {
        state.sourceFrame.width = 0;
        state.sourceFrame.height = 0;
      }
    } else if (!state.sourceFrame.intersects(sourceFrameProjected)) {
      state.sourceFrame.width = 0;
      state.sourceFrame.height = 0;
    }
    this.roundFrame(state.sourceFrame, renderTextureSystem.current ? renderTextureSystem.current.resolution : renderer.resolution, renderTextureSystem.sourceFrame, renderTextureSystem.destinationFrame, renderer.projection.transform);
    state.renderTexture = this.getOptimalFilterTexture(state.sourceFrame.width, state.sourceFrame.height, resolution, multisample);
    state.filters = filters2;
    state.destinationFrame.width = state.renderTexture.width;
    state.destinationFrame.height = state.renderTexture.height;
    const destinationFrame = this.tempRect;
    destinationFrame.x = 0;
    destinationFrame.y = 0;
    destinationFrame.width = state.sourceFrame.width;
    destinationFrame.height = state.sourceFrame.height;
    state.renderTexture.filterFrame = state.sourceFrame;
    state.bindingSourceFrame.copyFrom(renderTextureSystem.sourceFrame);
    state.bindingDestinationFrame.copyFrom(renderTextureSystem.destinationFrame);
    state.transform = renderer.projection.transform;
    renderer.projection.transform = null;
    renderTextureSystem.bind(state.renderTexture, state.sourceFrame, destinationFrame);
    renderer.framebuffer.clear(0, 0, 0, 0);
  }
  pop() {
    const filterStack = this.defaultFilterStack;
    const state = filterStack.pop();
    const filters2 = state.filters;
    this.activeState = state;
    const globalUniforms = this.globalUniforms.uniforms;
    globalUniforms.outputFrame = state.sourceFrame;
    globalUniforms.resolution = state.resolution;
    const inputSize = globalUniforms.inputSize;
    const inputPixel = globalUniforms.inputPixel;
    const inputClamp = globalUniforms.inputClamp;
    inputSize[0] = state.destinationFrame.width;
    inputSize[1] = state.destinationFrame.height;
    inputSize[2] = 1 / inputSize[0];
    inputSize[3] = 1 / inputSize[1];
    inputPixel[0] = Math.round(inputSize[0] * state.resolution);
    inputPixel[1] = Math.round(inputSize[1] * state.resolution);
    inputPixel[2] = 1 / inputPixel[0];
    inputPixel[3] = 1 / inputPixel[1];
    inputClamp[0] = 0.5 * inputPixel[2];
    inputClamp[1] = 0.5 * inputPixel[3];
    inputClamp[2] = state.sourceFrame.width * inputSize[2] - 0.5 * inputPixel[2];
    inputClamp[3] = state.sourceFrame.height * inputSize[3] - 0.5 * inputPixel[3];
    if (state.legacy) {
      const filterArea = globalUniforms.filterArea;
      filterArea[0] = state.destinationFrame.width;
      filterArea[1] = state.destinationFrame.height;
      filterArea[2] = state.sourceFrame.x;
      filterArea[3] = state.sourceFrame.y;
      globalUniforms.filterClamp = globalUniforms.inputClamp;
    }
    this.globalUniforms.update();
    const lastState = filterStack[filterStack.length - 1];
    this.renderer.framebuffer.blit();
    if (filters2.length === 1) {
      filters2[0].apply(this, state.renderTexture, lastState.renderTexture, CLEAR_MODES.BLEND, state);
      this.returnFilterTexture(state.renderTexture);
    } else {
      let flip = state.renderTexture;
      let flop = this.getOptimalFilterTexture(flip.width, flip.height, state.resolution);
      flop.filterFrame = flip.filterFrame;
      let i2 = 0;
      for (i2 = 0; i2 < filters2.length - 1; ++i2) {
        if (i2 === 1 && state.multisample > 1) {
          flop = this.getOptimalFilterTexture(flip.width, flip.height, state.resolution);
          flop.filterFrame = flip.filterFrame;
        }
        filters2[i2].apply(this, flip, flop, CLEAR_MODES.CLEAR, state);
        const t2 = flip;
        flip = flop;
        flop = t2;
      }
      filters2[i2].apply(this, flip, lastState.renderTexture, CLEAR_MODES.BLEND, state);
      if (i2 > 1 && state.multisample > 1) {
        this.returnFilterTexture(state.renderTexture);
      }
      this.returnFilterTexture(flip);
      this.returnFilterTexture(flop);
    }
    state.clear();
    this.statePool.push(state);
  }
  bindAndClear(filterTexture, clearMode = CLEAR_MODES.CLEAR) {
    const {
      renderTexture: renderTextureSystem,
      state: stateSystem
    } = this.renderer;
    if (filterTexture === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture) {
      this.renderer.projection.transform = this.activeState.transform;
    } else {
      this.renderer.projection.transform = null;
    }
    if (filterTexture?.filterFrame) {
      const destinationFrame = this.tempRect;
      destinationFrame.x = 0;
      destinationFrame.y = 0;
      destinationFrame.width = filterTexture.filterFrame.width;
      destinationFrame.height = filterTexture.filterFrame.height;
      renderTextureSystem.bind(filterTexture, filterTexture.filterFrame, destinationFrame);
    } else if (filterTexture !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture) {
      renderTextureSystem.bind(filterTexture);
    } else {
      this.renderer.renderTexture.bind(filterTexture, this.activeState.bindingSourceFrame, this.activeState.bindingDestinationFrame);
    }
    const autoClear = stateSystem.stateId & 1 || this.forceClear;
    if (clearMode === CLEAR_MODES.CLEAR || clearMode === CLEAR_MODES.BLIT && autoClear) {
      this.renderer.framebuffer.clear(0, 0, 0, 0);
    }
  }
  applyFilter(filter, input, output, clearMode) {
    const renderer = this.renderer;
    renderer.state.set(filter.state);
    this.bindAndClear(output, clearMode);
    filter.uniforms.uSampler = input;
    filter.uniforms.filterGlobals = this.globalUniforms;
    renderer.shader.bind(filter);
    filter.legacy = !!filter.program.attributeData.aTextureCoord;
    if (filter.legacy) {
      this.quadUv.map(input._frame, input.filterFrame);
      renderer.geometry.bind(this.quadUv);
      renderer.geometry.draw(DRAW_MODES.TRIANGLES);
    } else {
      renderer.geometry.bind(this.quad);
      renderer.geometry.draw(DRAW_MODES.TRIANGLE_STRIP);
    }
  }
  calculateSpriteMatrix(outputMatrix, sprite) {
    const { sourceFrame, destinationFrame } = this.activeState;
    const { orig } = sprite._texture;
    const mappedMatrix = outputMatrix.set(destinationFrame.width, 0, 0, destinationFrame.height, sourceFrame.x, sourceFrame.y);
    const worldTransform = sprite.worldTransform.copyTo(Matrix.TEMP_MATRIX);
    worldTransform.invert();
    mappedMatrix.prepend(worldTransform);
    mappedMatrix.scale(1 / orig.width, 1 / orig.height);
    mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y);
    return mappedMatrix;
  }
  destroy() {
    this.renderer = null;
    this.texturePool.clear(false);
  }
  getOptimalFilterTexture(minWidth, minHeight, resolution = 1, multisample = MSAA_QUALITY.NONE) {
    return this.texturePool.getOptimalTexture(minWidth, minHeight, resolution, multisample);
  }
  getFilterTexture(input, resolution, multisample) {
    if (typeof input === "number") {
      const swap = input;
      input = resolution;
      resolution = swap;
    }
    input = input || this.activeState.renderTexture;
    const filterTexture = this.texturePool.getOptimalTexture(input.width, input.height, resolution || input.resolution, multisample || MSAA_QUALITY.NONE);
    filterTexture.filterFrame = input.filterFrame;
    return filterTexture;
  }
  returnFilterTexture(renderTexture) {
    this.texturePool.returnTexture(renderTexture);
  }
  emptyPool() {
    this.texturePool.clear(true);
  }
  resize() {
    this.texturePool.setScreenSize(this.renderer.view);
  }
  transformAABB(matrix, rect) {
    const lt = tempPoints2[0];
    const lb = tempPoints2[1];
    const rt = tempPoints2[2];
    const rb = tempPoints2[3];
    lt.set(rect.left, rect.top);
    lb.set(rect.left, rect.bottom);
    rt.set(rect.right, rect.top);
    rb.set(rect.right, rect.bottom);
    matrix.apply(lt, lt);
    matrix.apply(lb, lb);
    matrix.apply(rt, rt);
    matrix.apply(rb, rb);
    const x0 = Math.min(lt.x, lb.x, rt.x, rb.x);
    const y0 = Math.min(lt.y, lb.y, rt.y, rb.y);
    const x1 = Math.max(lt.x, lb.x, rt.x, rb.x);
    const y1 = Math.max(lt.y, lb.y, rt.y, rb.y);
    rect.x = x0;
    rect.y = y0;
    rect.width = x1 - x0;
    rect.height = y1 - y0;
  }
  roundFrame(frame, resolution, bindingSourceFrame, bindingDestinationFrame, transform) {
    if (frame.width <= 0 || frame.height <= 0 || bindingSourceFrame.width <= 0 || bindingSourceFrame.height <= 0) {
      return;
    }
    if (transform) {
      const { a: a2, b: b3, c: c2, d: d2 } = transform;
      if ((Math.abs(b3) > 1e-4 || Math.abs(c2) > 1e-4) && (Math.abs(a2) > 1e-4 || Math.abs(d2) > 1e-4)) {
        return;
      }
    }
    transform = transform ? tempMatrix.copyFrom(transform) : tempMatrix.identity();
    transform.translate(-bindingSourceFrame.x, -bindingSourceFrame.y).scale(bindingDestinationFrame.width / bindingSourceFrame.width, bindingDestinationFrame.height / bindingSourceFrame.height).translate(bindingDestinationFrame.x, bindingDestinationFrame.y);
    this.transformAABB(transform, frame);
    frame.ceil(resolution);
    this.transformAABB(transform.invert(), frame);
  }
};
FilterSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "filter"
};
extensions.add(FilterSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/framebuffer/GLFramebuffer.mjs
var GLFramebuffer = class {
  constructor(framebuffer) {
    this.framebuffer = framebuffer;
    this.stencil = null;
    this.dirtyId = -1;
    this.dirtyFormat = -1;
    this.dirtySize = -1;
    this.multisample = MSAA_QUALITY.NONE;
    this.msaaBuffer = null;
    this.blitFramebuffer = null;
    this.mipLevel = 0;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/framebuffer/FramebufferSystem.mjs
var tempRectangle = new Rectangle();
var FramebufferSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.managedFramebuffers = [];
    this.unknownFramebuffer = new Framebuffer(10, 10);
    this.msaaSamples = null;
  }
  contextChange() {
    this.disposeAll(true);
    const gl = this.gl = this.renderer.gl;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    this.current = this.unknownFramebuffer;
    this.viewport = new Rectangle();
    this.hasMRT = true;
    this.writeDepthTexture = true;
    if (this.renderer.context.webGLVersion === 1) {
      let nativeDrawBuffersExtension = this.renderer.context.extensions.drawBuffers;
      let nativeDepthTextureExtension = this.renderer.context.extensions.depthTexture;
      if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
        nativeDrawBuffersExtension = null;
        nativeDepthTextureExtension = null;
      }
      if (nativeDrawBuffersExtension) {
        gl.drawBuffers = (activeTextures) => nativeDrawBuffersExtension.drawBuffersWEBGL(activeTextures);
      } else {
        this.hasMRT = false;
        gl.drawBuffers = () => {
        };
      }
      if (!nativeDepthTextureExtension) {
        this.writeDepthTexture = false;
      }
    } else {
      this.msaaSamples = gl.getInternalformatParameter(gl.RENDERBUFFER, gl.RGBA8, gl.SAMPLES);
    }
  }
  bind(framebuffer, frame, mipLevel = 0) {
    const { gl } = this;
    if (framebuffer) {
      const fbo = framebuffer.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(framebuffer);
      if (this.current !== framebuffer) {
        this.current = framebuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
      }
      if (fbo.mipLevel !== mipLevel) {
        framebuffer.dirtyId++;
        framebuffer.dirtyFormat++;
        fbo.mipLevel = mipLevel;
      }
      if (fbo.dirtyId !== framebuffer.dirtyId) {
        fbo.dirtyId = framebuffer.dirtyId;
        if (fbo.dirtyFormat !== framebuffer.dirtyFormat) {
          fbo.dirtyFormat = framebuffer.dirtyFormat;
          fbo.dirtySize = framebuffer.dirtySize;
          this.updateFramebuffer(framebuffer, mipLevel);
        } else if (fbo.dirtySize !== framebuffer.dirtySize) {
          fbo.dirtySize = framebuffer.dirtySize;
          this.resizeFramebuffer(framebuffer);
        }
      }
      for (let i2 = 0; i2 < framebuffer.colorTextures.length; i2++) {
        const tex = framebuffer.colorTextures[i2];
        this.renderer.texture.unbind(tex.parentTextureArray || tex);
      }
      if (framebuffer.depthTexture) {
        this.renderer.texture.unbind(framebuffer.depthTexture);
      }
      if (frame) {
        const mipWidth = frame.width >> mipLevel;
        const mipHeight = frame.height >> mipLevel;
        const scale = mipWidth / frame.width;
        this.setViewport(frame.x * scale, frame.y * scale, mipWidth, mipHeight);
      } else {
        const mipWidth = framebuffer.width >> mipLevel;
        const mipHeight = framebuffer.height >> mipLevel;
        this.setViewport(0, 0, mipWidth, mipHeight);
      }
    } else {
      if (this.current) {
        this.current = null;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      if (frame) {
        this.setViewport(frame.x, frame.y, frame.width, frame.height);
      } else {
        this.setViewport(0, 0, this.renderer.width, this.renderer.height);
      }
    }
  }
  setViewport(x2, y2, width, height) {
    const v2 = this.viewport;
    x2 = Math.round(x2);
    y2 = Math.round(y2);
    width = Math.round(width);
    height = Math.round(height);
    if (v2.width !== width || v2.height !== height || v2.x !== x2 || v2.y !== y2) {
      v2.x = x2;
      v2.y = y2;
      v2.width = width;
      v2.height = height;
      this.gl.viewport(x2, y2, width, height);
    }
  }
  get size() {
    if (this.current) {
      return { x: 0, y: 0, width: this.current.width, height: this.current.height };
    }
    return { x: 0, y: 0, width: this.renderer.width, height: this.renderer.height };
  }
  clear(r2, g3, b3, a2, mask = BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH) {
    const { gl } = this;
    gl.clearColor(r2, g3, b3, a2);
    gl.clear(mask);
  }
  initFramebuffer(framebuffer) {
    const { gl } = this;
    const fbo = new GLFramebuffer(gl.createFramebuffer());
    fbo.multisample = this.detectSamples(framebuffer.multisample);
    framebuffer.glFramebuffers[this.CONTEXT_UID] = fbo;
    this.managedFramebuffers.push(framebuffer);
    framebuffer.disposeRunner.add(this);
    return fbo;
  }
  resizeFramebuffer(framebuffer) {
    const { gl } = this;
    const fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
    if (fbo.stencil) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
      if (fbo.msaaBuffer) {
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.DEPTH24_STENCIL8, framebuffer.width, framebuffer.height);
      } else {
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
      }
    }
    const colorTextures = framebuffer.colorTextures;
    let count = colorTextures.length;
    if (!gl.drawBuffers) {
      count = Math.min(count, 1);
    }
    for (let i2 = 0; i2 < count; i2++) {
      const texture = colorTextures[i2];
      const parentTexture = texture.parentTextureArray || texture;
      this.renderer.texture.bind(parentTexture, 0);
      if (i2 === 0 && fbo.msaaBuffer) {
        gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.msaaBuffer);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, parentTexture._glTextures[this.CONTEXT_UID].internalFormat, framebuffer.width, framebuffer.height);
      }
    }
    if (framebuffer.depthTexture && this.writeDepthTexture) {
      this.renderer.texture.bind(framebuffer.depthTexture, 0);
    }
  }
  updateFramebuffer(framebuffer, mipLevel) {
    const { gl } = this;
    const fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
    const colorTextures = framebuffer.colorTextures;
    let count = colorTextures.length;
    if (!gl.drawBuffers) {
      count = Math.min(count, 1);
    }
    if (fbo.multisample > 1 && this.canMultisampleFramebuffer(framebuffer)) {
      fbo.msaaBuffer = fbo.msaaBuffer || gl.createRenderbuffer();
    } else if (fbo.msaaBuffer) {
      gl.deleteRenderbuffer(fbo.msaaBuffer);
      fbo.msaaBuffer = null;
      if (fbo.blitFramebuffer) {
        fbo.blitFramebuffer.dispose();
        fbo.blitFramebuffer = null;
      }
    }
    const activeTextures = [];
    for (let i2 = 0; i2 < count; i2++) {
      const texture = colorTextures[i2];
      const parentTexture = texture.parentTextureArray || texture;
      this.renderer.texture.bind(parentTexture, 0);
      if (i2 === 0 && fbo.msaaBuffer) {
        gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.msaaBuffer);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, parentTexture._glTextures[this.CONTEXT_UID].internalFormat, framebuffer.width, framebuffer.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, fbo.msaaBuffer);
      } else {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i2, texture.target, parentTexture._glTextures[this.CONTEXT_UID].texture, mipLevel);
        activeTextures.push(gl.COLOR_ATTACHMENT0 + i2);
      }
    }
    if (activeTextures.length > 1) {
      gl.drawBuffers(activeTextures);
    }
    if (framebuffer.depthTexture) {
      const writeDepthTexture = this.writeDepthTexture;
      if (writeDepthTexture) {
        const depthTexture = framebuffer.depthTexture;
        this.renderer.texture.bind(depthTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture._glTextures[this.CONTEXT_UID].texture, mipLevel);
      }
    }
    if ((framebuffer.stencil || framebuffer.depth) && !(framebuffer.depthTexture && this.writeDepthTexture)) {
      fbo.stencil = fbo.stencil || gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
      if (fbo.msaaBuffer) {
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.DEPTH24_STENCIL8, framebuffer.width, framebuffer.height);
      } else {
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
      }
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, fbo.stencil);
    } else if (fbo.stencil) {
      gl.deleteRenderbuffer(fbo.stencil);
      fbo.stencil = null;
    }
  }
  canMultisampleFramebuffer(framebuffer) {
    return this.renderer.context.webGLVersion !== 1 && framebuffer.colorTextures.length <= 1 && !framebuffer.depthTexture;
  }
  detectSamples(samples) {
    const { msaaSamples } = this;
    let res = MSAA_QUALITY.NONE;
    if (samples <= 1 || msaaSamples === null) {
      return res;
    }
    for (let i2 = 0; i2 < msaaSamples.length; i2++) {
      if (msaaSamples[i2] <= samples) {
        res = msaaSamples[i2];
        break;
      }
    }
    if (res === 1) {
      res = MSAA_QUALITY.NONE;
    }
    return res;
  }
  blit(framebuffer, sourcePixels, destPixels) {
    const { current, renderer, gl, CONTEXT_UID } = this;
    if (renderer.context.webGLVersion !== 2) {
      return;
    }
    if (!current) {
      return;
    }
    const fbo = current.glFramebuffers[CONTEXT_UID];
    if (!fbo) {
      return;
    }
    if (!framebuffer) {
      if (!fbo.msaaBuffer) {
        return;
      }
      const colorTexture = current.colorTextures[0];
      if (!colorTexture) {
        return;
      }
      if (!fbo.blitFramebuffer) {
        fbo.blitFramebuffer = new Framebuffer(current.width, current.height);
        fbo.blitFramebuffer.addColorTexture(0, colorTexture);
      }
      framebuffer = fbo.blitFramebuffer;
      if (framebuffer.colorTextures[0] !== colorTexture) {
        framebuffer.colorTextures[0] = colorTexture;
        framebuffer.dirtyId++;
        framebuffer.dirtyFormat++;
      }
      if (framebuffer.width !== current.width || framebuffer.height !== current.height) {
        framebuffer.width = current.width;
        framebuffer.height = current.height;
        framebuffer.dirtyId++;
        framebuffer.dirtySize++;
      }
    }
    if (!sourcePixels) {
      sourcePixels = tempRectangle;
      sourcePixels.width = current.width;
      sourcePixels.height = current.height;
    }
    if (!destPixels) {
      destPixels = sourcePixels;
    }
    const sameSize = sourcePixels.width === destPixels.width && sourcePixels.height === destPixels.height;
    this.bind(framebuffer);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fbo.framebuffer);
    gl.blitFramebuffer(sourcePixels.left, sourcePixels.top, sourcePixels.right, sourcePixels.bottom, destPixels.left, destPixels.top, destPixels.right, destPixels.bottom, gl.COLOR_BUFFER_BIT, sameSize ? gl.NEAREST : gl.LINEAR);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, framebuffer.glFramebuffers[this.CONTEXT_UID].framebuffer);
  }
  disposeFramebuffer(framebuffer, contextLost) {
    const fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
    const gl = this.gl;
    if (!fbo) {
      return;
    }
    delete framebuffer.glFramebuffers[this.CONTEXT_UID];
    const index = this.managedFramebuffers.indexOf(framebuffer);
    if (index >= 0) {
      this.managedFramebuffers.splice(index, 1);
    }
    framebuffer.disposeRunner.remove(this);
    if (!contextLost) {
      gl.deleteFramebuffer(fbo.framebuffer);
      if (fbo.msaaBuffer) {
        gl.deleteRenderbuffer(fbo.msaaBuffer);
      }
      if (fbo.stencil) {
        gl.deleteRenderbuffer(fbo.stencil);
      }
    }
    if (fbo.blitFramebuffer) {
      this.disposeFramebuffer(fbo.blitFramebuffer, contextLost);
    }
  }
  disposeAll(contextLost) {
    const list = this.managedFramebuffers;
    this.managedFramebuffers = [];
    for (let i2 = 0; i2 < list.length; i2++) {
      this.disposeFramebuffer(list[i2], contextLost);
    }
  }
  forceStencil() {
    const framebuffer = this.current;
    if (!framebuffer) {
      return;
    }
    const fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
    if (!fbo || fbo.stencil) {
      return;
    }
    framebuffer.stencil = true;
    const w3 = framebuffer.width;
    const h2 = framebuffer.height;
    const gl = this.gl;
    const stencil = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, stencil);
    if (fbo.msaaBuffer) {
      gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.DEPTH24_STENCIL8, w3, h2);
    } else {
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, w3, h2);
    }
    fbo.stencil = stencil;
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, stencil);
  }
  reset() {
    this.current = this.unknownFramebuffer;
    this.viewport = new Rectangle();
  }
  destroy() {
    this.renderer = null;
  }
};
FramebufferSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "framebuffer"
};
extensions.add(FramebufferSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/geometry/GeometrySystem.mjs
var byteSizeMap2 = { 5126: 4, 5123: 2, 5121: 1 };
var GeometrySystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this._activeGeometry = null;
    this._activeVao = null;
    this.hasVao = true;
    this.hasInstance = true;
    this.canUseUInt32ElementIndex = false;
    this.managedGeometries = {};
  }
  contextChange() {
    this.disposeAll(true);
    const gl = this.gl = this.renderer.gl;
    const context2 = this.renderer.context;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    if (context2.webGLVersion !== 2) {
      let nativeVaoExtension = this.renderer.context.extensions.vertexArrayObject;
      if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
        nativeVaoExtension = null;
      }
      if (nativeVaoExtension) {
        gl.createVertexArray = () => nativeVaoExtension.createVertexArrayOES();
        gl.bindVertexArray = (vao) => nativeVaoExtension.bindVertexArrayOES(vao);
        gl.deleteVertexArray = (vao) => nativeVaoExtension.deleteVertexArrayOES(vao);
      } else {
        this.hasVao = false;
        gl.createVertexArray = () => null;
        gl.bindVertexArray = () => null;
        gl.deleteVertexArray = () => null;
      }
    }
    if (context2.webGLVersion !== 2) {
      const instanceExt = gl.getExtension("ANGLE_instanced_arrays");
      if (instanceExt) {
        gl.vertexAttribDivisor = (a2, b3) => instanceExt.vertexAttribDivisorANGLE(a2, b3);
        gl.drawElementsInstanced = (a2, b3, c2, d2, e3) => instanceExt.drawElementsInstancedANGLE(a2, b3, c2, d2, e3);
        gl.drawArraysInstanced = (a2, b3, c2, d2) => instanceExt.drawArraysInstancedANGLE(a2, b3, c2, d2);
      } else {
        this.hasInstance = false;
      }
    }
    this.canUseUInt32ElementIndex = context2.webGLVersion === 2 || !!context2.extensions.uint32ElementIndex;
  }
  bind(geometry, shader) {
    shader = shader || this.renderer.shader.shader;
    const { gl } = this;
    let vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
    let incRefCount = false;
    if (!vaos) {
      this.managedGeometries[geometry.id] = geometry;
      geometry.disposeRunner.add(this);
      geometry.glVertexArrayObjects[this.CONTEXT_UID] = vaos = {};
      incRefCount = true;
    }
    const vao = vaos[shader.program.id] || this.initGeometryVao(geometry, shader, incRefCount);
    this._activeGeometry = geometry;
    if (this._activeVao !== vao) {
      this._activeVao = vao;
      if (this.hasVao) {
        gl.bindVertexArray(vao);
      } else {
        this.activateVao(geometry, shader.program);
      }
    }
    this.updateBuffers();
  }
  reset() {
    this.unbind();
  }
  updateBuffers() {
    const geometry = this._activeGeometry;
    const bufferSystem = this.renderer.buffer;
    for (let i2 = 0; i2 < geometry.buffers.length; i2++) {
      const buffer = geometry.buffers[i2];
      bufferSystem.update(buffer);
    }
  }
  checkCompatibility(geometry, program) {
    const geometryAttributes = geometry.attributes;
    const shaderAttributes = program.attributeData;
    for (const j3 in shaderAttributes) {
      if (!geometryAttributes[j3]) {
        throw new Error(`shader and geometry incompatible, geometry missing the "${j3}" attribute`);
      }
    }
  }
  getSignature(geometry, program) {
    const attribs = geometry.attributes;
    const shaderAttributes = program.attributeData;
    const strings = ["g", geometry.id];
    for (const i2 in attribs) {
      if (shaderAttributes[i2]) {
        strings.push(i2, shaderAttributes[i2].location);
      }
    }
    return strings.join("-");
  }
  initGeometryVao(geometry, shader, incRefCount = true) {
    const gl = this.gl;
    const CONTEXT_UID = this.CONTEXT_UID;
    const bufferSystem = this.renderer.buffer;
    const program = shader.program;
    if (!program.glPrograms[CONTEXT_UID]) {
      this.renderer.shader.generateProgram(shader);
    }
    this.checkCompatibility(geometry, program);
    const signature = this.getSignature(geometry, program);
    const vaoObjectHash = geometry.glVertexArrayObjects[this.CONTEXT_UID];
    let vao = vaoObjectHash[signature];
    if (vao) {
      vaoObjectHash[program.id] = vao;
      return vao;
    }
    const buffers = geometry.buffers;
    const attributes = geometry.attributes;
    const tempStride = {};
    const tempStart = {};
    for (const j3 in buffers) {
      tempStride[j3] = 0;
      tempStart[j3] = 0;
    }
    for (const j3 in attributes) {
      if (!attributes[j3].size && program.attributeData[j3]) {
        attributes[j3].size = program.attributeData[j3].size;
      } else if (!attributes[j3].size) {
        console.warn(`PIXI Geometry attribute '${j3}' size cannot be determined (likely the bound shader does not have the attribute)`);
      }
      tempStride[attributes[j3].buffer] += attributes[j3].size * byteSizeMap2[attributes[j3].type];
    }
    for (const j3 in attributes) {
      const attribute = attributes[j3];
      const attribSize = attribute.size;
      if (attribute.stride === void 0) {
        if (tempStride[attribute.buffer] === attribSize * byteSizeMap2[attribute.type]) {
          attribute.stride = 0;
        } else {
          attribute.stride = tempStride[attribute.buffer];
        }
      }
      if (attribute.start === void 0) {
        attribute.start = tempStart[attribute.buffer];
        tempStart[attribute.buffer] += attribSize * byteSizeMap2[attribute.type];
      }
    }
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    for (let i2 = 0; i2 < buffers.length; i2++) {
      const buffer = buffers[i2];
      bufferSystem.bind(buffer);
      if (incRefCount) {
        buffer._glBuffers[CONTEXT_UID].refCount++;
      }
    }
    this.activateVao(geometry, program);
    vaoObjectHash[program.id] = vao;
    vaoObjectHash[signature] = vao;
    gl.bindVertexArray(null);
    bufferSystem.unbind(BUFFER_TYPE.ARRAY_BUFFER);
    return vao;
  }
  disposeGeometry(geometry, contextLost) {
    if (!this.managedGeometries[geometry.id]) {
      return;
    }
    delete this.managedGeometries[geometry.id];
    const vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
    const gl = this.gl;
    const buffers = geometry.buffers;
    const bufferSystem = this.renderer?.buffer;
    geometry.disposeRunner.remove(this);
    if (!vaos) {
      return;
    }
    if (bufferSystem) {
      for (let i2 = 0; i2 < buffers.length; i2++) {
        const buf = buffers[i2]._glBuffers[this.CONTEXT_UID];
        if (buf) {
          buf.refCount--;
          if (buf.refCount === 0 && !contextLost) {
            bufferSystem.dispose(buffers[i2], contextLost);
          }
        }
      }
    }
    if (!contextLost) {
      for (const vaoId in vaos) {
        if (vaoId[0] === "g") {
          const vao = vaos[vaoId];
          if (this._activeVao === vao) {
            this.unbind();
          }
          gl.deleteVertexArray(vao);
        }
      }
    }
    delete geometry.glVertexArrayObjects[this.CONTEXT_UID];
  }
  disposeAll(contextLost) {
    const all = Object.keys(this.managedGeometries);
    for (let i2 = 0; i2 < all.length; i2++) {
      this.disposeGeometry(this.managedGeometries[all[i2]], contextLost);
    }
  }
  activateVao(geometry, program) {
    const gl = this.gl;
    const CONTEXT_UID = this.CONTEXT_UID;
    const bufferSystem = this.renderer.buffer;
    const buffers = geometry.buffers;
    const attributes = geometry.attributes;
    if (geometry.indexBuffer) {
      bufferSystem.bind(geometry.indexBuffer);
    }
    let lastBuffer = null;
    for (const j3 in attributes) {
      const attribute = attributes[j3];
      const buffer = buffers[attribute.buffer];
      const glBuffer = buffer._glBuffers[CONTEXT_UID];
      if (program.attributeData[j3]) {
        if (lastBuffer !== glBuffer) {
          bufferSystem.bind(buffer);
          lastBuffer = glBuffer;
        }
        const location = program.attributeData[j3].location;
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, attribute.size, attribute.type || gl.FLOAT, attribute.normalized, attribute.stride, attribute.start);
        if (attribute.instance) {
          if (this.hasInstance) {
            gl.vertexAttribDivisor(location, attribute.divisor);
          } else {
            throw new Error("geometry error, GPU Instancing is not supported on this device");
          }
        }
      }
    }
  }
  draw(type, size, start, instanceCount) {
    const { gl } = this;
    const geometry = this._activeGeometry;
    if (geometry.indexBuffer) {
      const byteSize = geometry.indexBuffer.data.BYTES_PER_ELEMENT;
      const glType = byteSize === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
      if (byteSize === 2 || byteSize === 4 && this.canUseUInt32ElementIndex) {
        if (geometry.instanced) {
          gl.drawElementsInstanced(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize, instanceCount || 1);
        } else {
          gl.drawElements(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize);
        }
      } else {
        console.warn("unsupported index buffer type: uint32");
      }
    } else if (geometry.instanced) {
      gl.drawArraysInstanced(type, start, size || geometry.getSize(), instanceCount || 1);
    } else {
      gl.drawArrays(type, start, size || geometry.getSize());
    }
    return this;
  }
  unbind() {
    this.gl.bindVertexArray(null);
    this._activeVao = null;
    this._activeGeometry = null;
  }
  destroy() {
    this.renderer = null;
  }
};
GeometrySystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "geometry"
};
extensions.add(GeometrySystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/TextureMatrix.mjs
var tempMat = new Matrix();
var TextureMatrix = class {
  constructor(texture, clampMargin) {
    this._texture = texture;
    this.mapCoord = new Matrix();
    this.uClampFrame = new Float32Array(4);
    this.uClampOffset = new Float32Array(2);
    this._textureID = -1;
    this._updateID = 0;
    this.clampOffset = 0;
    this.clampMargin = typeof clampMargin === "undefined" ? 0.5 : clampMargin;
    this.isSimple = false;
  }
  get texture() {
    return this._texture;
  }
  set texture(value) {
    this._texture = value;
    this._textureID = -1;
  }
  multiplyUvs(uvs, out) {
    if (out === void 0) {
      out = uvs;
    }
    const mat = this.mapCoord;
    for (let i2 = 0; i2 < uvs.length; i2 += 2) {
      const x2 = uvs[i2];
      const y2 = uvs[i2 + 1];
      out[i2] = x2 * mat.a + y2 * mat.c + mat.tx;
      out[i2 + 1] = x2 * mat.b + y2 * mat.d + mat.ty;
    }
    return out;
  }
  update(forceUpdate) {
    const tex = this._texture;
    if (!tex || !tex.valid) {
      return false;
    }
    if (!forceUpdate && this._textureID === tex._updateID) {
      return false;
    }
    this._textureID = tex._updateID;
    this._updateID++;
    const uvs = tex._uvs;
    this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);
    const orig = tex.orig;
    const trim = tex.trim;
    if (trim) {
      tempMat.set(orig.width / trim.width, 0, 0, orig.height / trim.height, -trim.x / trim.width, -trim.y / trim.height);
      this.mapCoord.append(tempMat);
    }
    const texBase = tex.baseTexture;
    const frame = this.uClampFrame;
    const margin = this.clampMargin / texBase.resolution;
    const offset = this.clampOffset;
    frame[0] = (tex._frame.x + margin + offset) / texBase.width;
    frame[1] = (tex._frame.y + margin + offset) / texBase.height;
    frame[2] = (tex._frame.x + tex._frame.width - margin + offset) / texBase.width;
    frame[3] = (tex._frame.y + tex._frame.height - margin + offset) / texBase.height;
    this.uClampOffset[0] = offset / texBase.realWidth;
    this.uClampOffset[1] = offset / texBase.realHeight;
    this.isSimple = tex._frame.width === texBase.width && tex._frame.height === texBase.height && tex.rotate === 0;
    return true;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/filters/spriteMask/spriteMaskFilter2.mjs
var fragment = "varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/filters/spriteMask/spriteMaskFilter3.mjs
var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/filters/spriteMask/SpriteMaskFilter.mjs
var SpriteMaskFilter = class extends Filter {
  constructor(vertexSrc, fragmentSrc, uniforms) {
    let sprite = null;
    if (typeof vertexSrc !== "string" && fragmentSrc === void 0 && uniforms === void 0) {
      sprite = vertexSrc;
      vertexSrc = void 0;
      fragmentSrc = void 0;
      uniforms = void 0;
    }
    super(vertexSrc || vertex, fragmentSrc || fragment, uniforms);
    this.maskSprite = sprite;
    this.maskMatrix = new Matrix();
  }
  get maskSprite() {
    return this._maskSprite;
  }
  set maskSprite(value) {
    this._maskSprite = value;
    if (this._maskSprite) {
      this._maskSprite.renderable = false;
    }
  }
  apply(filterManager, input, output, clearMode) {
    const maskSprite = this._maskSprite;
    const tex = maskSprite._texture;
    if (!tex.valid) {
      return;
    }
    if (!tex.uvMatrix) {
      tex.uvMatrix = new TextureMatrix(tex, 0);
    }
    tex.uvMatrix.update();
    this.uniforms.npmAlpha = tex.baseTexture.alphaMode ? 0 : 1;
    this.uniforms.mask = tex;
    this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite).prepend(tex.uvMatrix.mapCoord);
    this.uniforms.alpha = maskSprite.worldAlpha;
    this.uniforms.maskClamp = tex.uvMatrix.uClampFrame;
    filterManager.applyFilter(this, input, output, clearMode);
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/mask/MaskData.mjs
var MaskData = class {
  constructor(maskObject = null) {
    this.type = MASK_TYPES.NONE;
    this.autoDetect = true;
    this.maskObject = maskObject || null;
    this.pooled = false;
    this.isMaskData = true;
    this.resolution = null;
    this.multisample = Filter.defaultMultisample;
    this.enabled = true;
    this.colorMask = 15;
    this._filters = null;
    this._stencilCounter = 0;
    this._scissorCounter = 0;
    this._scissorRect = null;
    this._scissorRectLocal = null;
    this._colorMask = 15;
    this._target = null;
  }
  get filter() {
    return this._filters ? this._filters[0] : null;
  }
  set filter(value) {
    if (value) {
      if (this._filters) {
        this._filters[0] = value;
      } else {
        this._filters = [value];
      }
    } else {
      this._filters = null;
    }
  }
  reset() {
    if (this.pooled) {
      this.maskObject = null;
      this.type = MASK_TYPES.NONE;
      this.autoDetect = true;
    }
    this._target = null;
    this._scissorRectLocal = null;
  }
  copyCountersOrReset(maskAbove) {
    if (maskAbove) {
      this._stencilCounter = maskAbove._stencilCounter;
      this._scissorCounter = maskAbove._scissorCounter;
      this._scissorRect = maskAbove._scissorRect;
    } else {
      this._stencilCounter = 0;
      this._scissorCounter = 0;
      this._scissorRect = null;
    }
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/mask/MaskSystem.mjs
var MaskSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.enableScissor = true;
    this.alphaMaskPool = [];
    this.maskDataPool = [];
    this.maskStack = [];
    this.alphaMaskIndex = 0;
  }
  setMaskStack(maskStack) {
    this.maskStack = maskStack;
    this.renderer.scissor.setMaskStack(maskStack);
    this.renderer.stencil.setMaskStack(maskStack);
  }
  push(target, maskDataOrTarget) {
    let maskData = maskDataOrTarget;
    if (!maskData.isMaskData) {
      const d2 = this.maskDataPool.pop() || new MaskData();
      d2.pooled = true;
      d2.maskObject = maskDataOrTarget;
      maskData = d2;
    }
    const maskAbove = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
    maskData.copyCountersOrReset(maskAbove);
    maskData._colorMask = maskAbove ? maskAbove._colorMask : 15;
    if (maskData.autoDetect) {
      this.detect(maskData);
    }
    maskData._target = target;
    if (maskData.type !== MASK_TYPES.SPRITE) {
      this.maskStack.push(maskData);
    }
    if (maskData.enabled) {
      switch (maskData.type) {
        case MASK_TYPES.SCISSOR:
          this.renderer.scissor.push(maskData);
          break;
        case MASK_TYPES.STENCIL:
          this.renderer.stencil.push(maskData);
          break;
        case MASK_TYPES.SPRITE:
          maskData.copyCountersOrReset(null);
          this.pushSpriteMask(maskData);
          break;
        case MASK_TYPES.COLOR:
          this.pushColorMask(maskData);
          break;
        default:
          break;
      }
    }
    if (maskData.type === MASK_TYPES.SPRITE) {
      this.maskStack.push(maskData);
    }
  }
  pop(target) {
    const maskData = this.maskStack.pop();
    if (!maskData || maskData._target !== target) {
      return;
    }
    if (maskData.enabled) {
      switch (maskData.type) {
        case MASK_TYPES.SCISSOR:
          this.renderer.scissor.pop(maskData);
          break;
        case MASK_TYPES.STENCIL:
          this.renderer.stencil.pop(maskData.maskObject);
          break;
        case MASK_TYPES.SPRITE:
          this.popSpriteMask(maskData);
          break;
        case MASK_TYPES.COLOR:
          this.popColorMask(maskData);
          break;
        default:
          break;
      }
    }
    maskData.reset();
    if (maskData.pooled) {
      this.maskDataPool.push(maskData);
    }
    if (this.maskStack.length !== 0) {
      const maskCurrent = this.maskStack[this.maskStack.length - 1];
      if (maskCurrent.type === MASK_TYPES.SPRITE && maskCurrent._filters) {
        maskCurrent._filters[0].maskSprite = maskCurrent.maskObject;
      }
    }
  }
  detect(maskData) {
    const maskObject = maskData.maskObject;
    if (!maskObject) {
      maskData.type = MASK_TYPES.COLOR;
    } else if (maskObject.isSprite) {
      maskData.type = MASK_TYPES.SPRITE;
    } else if (this.enableScissor && this.renderer.scissor.testScissor(maskData)) {
      maskData.type = MASK_TYPES.SCISSOR;
    } else {
      maskData.type = MASK_TYPES.STENCIL;
    }
  }
  pushSpriteMask(maskData) {
    const { maskObject } = maskData;
    const target = maskData._target;
    let alphaMaskFilter = maskData._filters;
    if (!alphaMaskFilter) {
      alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];
      if (!alphaMaskFilter) {
        alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new SpriteMaskFilter()];
      }
    }
    const renderer = this.renderer;
    const renderTextureSystem = renderer.renderTexture;
    let resolution;
    let multisample;
    if (renderTextureSystem.current) {
      const renderTexture = renderTextureSystem.current;
      resolution = maskData.resolution || renderTexture.resolution;
      multisample = maskData.multisample ?? renderTexture.multisample;
    } else {
      resolution = maskData.resolution || renderer.resolution;
      multisample = maskData.multisample ?? renderer.multisample;
    }
    alphaMaskFilter[0].resolution = resolution;
    alphaMaskFilter[0].multisample = multisample;
    alphaMaskFilter[0].maskSprite = maskObject;
    const stashFilterArea = target.filterArea;
    target.filterArea = maskObject.getBounds(true);
    renderer.filter.push(target, alphaMaskFilter);
    target.filterArea = stashFilterArea;
    if (!maskData._filters) {
      this.alphaMaskIndex++;
    }
  }
  popSpriteMask(maskData) {
    this.renderer.filter.pop();
    if (maskData._filters) {
      maskData._filters[0].maskSprite = null;
    } else {
      this.alphaMaskIndex--;
      this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null;
    }
  }
  pushColorMask(maskData) {
    const currColorMask = maskData._colorMask;
    const nextColorMask = maskData._colorMask = currColorMask & maskData.colorMask;
    if (nextColorMask !== currColorMask) {
      this.renderer.gl.colorMask((nextColorMask & 1) !== 0, (nextColorMask & 2) !== 0, (nextColorMask & 4) !== 0, (nextColorMask & 8) !== 0);
    }
  }
  popColorMask(maskData) {
    const currColorMask = maskData._colorMask;
    const nextColorMask = this.maskStack.length > 0 ? this.maskStack[this.maskStack.length - 1]._colorMask : 15;
    if (nextColorMask !== currColorMask) {
      this.renderer.gl.colorMask((nextColorMask & 1) !== 0, (nextColorMask & 2) !== 0, (nextColorMask & 4) !== 0, (nextColorMask & 8) !== 0);
    }
  }
  destroy() {
    this.renderer = null;
  }
};
MaskSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "mask"
};
extensions.add(MaskSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/mask/AbstractMaskSystem.mjs
var AbstractMaskSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.maskStack = [];
    this.glConst = 0;
  }
  getStackLength() {
    return this.maskStack.length;
  }
  setMaskStack(maskStack) {
    const { gl } = this.renderer;
    const curStackLen = this.getStackLength();
    this.maskStack = maskStack;
    const newStackLen = this.getStackLength();
    if (newStackLen !== curStackLen) {
      if (newStackLen === 0) {
        gl.disable(this.glConst);
      } else {
        gl.enable(this.glConst);
        this._useCurrent();
      }
    }
  }
  _useCurrent() {
  }
  destroy() {
    this.renderer = null;
    this.maskStack = null;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/mask/ScissorSystem.mjs
var tempMatrix2 = new Matrix();
var rectPool = [];
var _ScissorSystem = class extends AbstractMaskSystem {
  constructor(renderer) {
    super(renderer);
    this.glConst = settings.ADAPTER.getWebGLRenderingContext().SCISSOR_TEST;
  }
  getStackLength() {
    const maskData = this.maskStack[this.maskStack.length - 1];
    if (maskData) {
      return maskData._scissorCounter;
    }
    return 0;
  }
  calcScissorRect(maskData) {
    if (maskData._scissorRectLocal) {
      return;
    }
    const prevData = maskData._scissorRect;
    const { maskObject } = maskData;
    const { renderer } = this;
    const renderTextureSystem = renderer.renderTexture;
    const rect = maskObject.getBounds(true, rectPool.pop() ?? new Rectangle());
    this.roundFrameToPixels(rect, renderTextureSystem.current ? renderTextureSystem.current.resolution : renderer.resolution, renderTextureSystem.sourceFrame, renderTextureSystem.destinationFrame, renderer.projection.transform);
    if (prevData) {
      rect.fit(prevData);
    }
    maskData._scissorRectLocal = rect;
  }
  static isMatrixRotated(matrix) {
    if (!matrix) {
      return false;
    }
    const { a: a2, b: b3, c: c2, d: d2 } = matrix;
    return (Math.abs(b3) > 1e-4 || Math.abs(c2) > 1e-4) && (Math.abs(a2) > 1e-4 || Math.abs(d2) > 1e-4);
  }
  testScissor(maskData) {
    const { maskObject } = maskData;
    if (!maskObject.isFastRect || !maskObject.isFastRect()) {
      return false;
    }
    if (_ScissorSystem.isMatrixRotated(maskObject.worldTransform)) {
      return false;
    }
    if (_ScissorSystem.isMatrixRotated(this.renderer.projection.transform)) {
      return false;
    }
    this.calcScissorRect(maskData);
    const rect = maskData._scissorRectLocal;
    return rect.width > 0 && rect.height > 0;
  }
  roundFrameToPixels(frame, resolution, bindingSourceFrame, bindingDestinationFrame, transform) {
    if (_ScissorSystem.isMatrixRotated(transform)) {
      return;
    }
    transform = transform ? tempMatrix2.copyFrom(transform) : tempMatrix2.identity();
    transform.translate(-bindingSourceFrame.x, -bindingSourceFrame.y).scale(bindingDestinationFrame.width / bindingSourceFrame.width, bindingDestinationFrame.height / bindingSourceFrame.height).translate(bindingDestinationFrame.x, bindingDestinationFrame.y);
    this.renderer.filter.transformAABB(transform, frame);
    frame.fit(bindingDestinationFrame);
    frame.x = Math.round(frame.x * resolution);
    frame.y = Math.round(frame.y * resolution);
    frame.width = Math.round(frame.width * resolution);
    frame.height = Math.round(frame.height * resolution);
  }
  push(maskData) {
    if (!maskData._scissorRectLocal) {
      this.calcScissorRect(maskData);
    }
    const { gl } = this.renderer;
    if (!maskData._scissorRect) {
      gl.enable(gl.SCISSOR_TEST);
    }
    maskData._scissorCounter++;
    maskData._scissorRect = maskData._scissorRectLocal;
    this._useCurrent();
  }
  pop(maskData) {
    const { gl } = this.renderer;
    if (maskData) {
      rectPool.push(maskData._scissorRectLocal);
    }
    if (this.getStackLength() > 0) {
      this._useCurrent();
    } else {
      gl.disable(gl.SCISSOR_TEST);
    }
  }
  _useCurrent() {
    const rect = this.maskStack[this.maskStack.length - 1]._scissorRect;
    let y2;
    if (this.renderer.renderTexture.current) {
      y2 = rect.y;
    } else {
      y2 = this.renderer.height - rect.height - rect.y;
    }
    this.renderer.gl.scissor(rect.x, y2, rect.width, rect.height);
  }
};
var ScissorSystem = _ScissorSystem;
ScissorSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "scissor"
};
extensions.add(ScissorSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/mask/StencilSystem.mjs
var StencilSystem = class extends AbstractMaskSystem {
  constructor(renderer) {
    super(renderer);
    this.glConst = settings.ADAPTER.getWebGLRenderingContext().STENCIL_TEST;
  }
  getStackLength() {
    const maskData = this.maskStack[this.maskStack.length - 1];
    if (maskData) {
      return maskData._stencilCounter;
    }
    return 0;
  }
  push(maskData) {
    const maskObject = maskData.maskObject;
    const { gl } = this.renderer;
    const prevMaskCount = maskData._stencilCounter;
    if (prevMaskCount === 0) {
      this.renderer.framebuffer.forceStencil();
      gl.clearStencil(0);
      gl.clear(gl.STENCIL_BUFFER_BIT);
      gl.enable(gl.STENCIL_TEST);
    }
    maskData._stencilCounter++;
    const colorMask = maskData._colorMask;
    if (colorMask !== 0) {
      maskData._colorMask = 0;
      gl.colorMask(false, false, false, false);
    }
    gl.stencilFunc(gl.EQUAL, prevMaskCount, 4294967295);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
    maskObject.renderable = true;
    maskObject.render(this.renderer);
    this.renderer.batch.flush();
    maskObject.renderable = false;
    if (colorMask !== 0) {
      maskData._colorMask = colorMask;
      gl.colorMask((colorMask & 1) !== 0, (colorMask & 2) !== 0, (colorMask & 4) !== 0, (colorMask & 8) !== 0);
    }
    this._useCurrent();
  }
  pop(maskObject) {
    const gl = this.renderer.gl;
    if (this.getStackLength() === 0) {
      gl.disable(gl.STENCIL_TEST);
    } else {
      const maskData = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
      const colorMask = maskData ? maskData._colorMask : 15;
      if (colorMask !== 0) {
        maskData._colorMask = 0;
        gl.colorMask(false, false, false, false);
      }
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
      maskObject.renderable = true;
      maskObject.render(this.renderer);
      this.renderer.batch.flush();
      maskObject.renderable = false;
      if (colorMask !== 0) {
        maskData._colorMask = colorMask;
        gl.colorMask((colorMask & 1) !== 0, (colorMask & 2) !== 0, (colorMask & 4) !== 0, (colorMask & 8) !== 0);
      }
      this._useCurrent();
    }
  }
  _useCurrent() {
    const gl = this.renderer.gl;
    gl.stencilFunc(gl.EQUAL, this.getStackLength(), 4294967295);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  }
};
StencilSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "stencil"
};
extensions.add(StencilSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/plugin/PluginSystem.mjs
var PluginSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.plugins = {};
    Object.defineProperties(this.plugins, {
      extract: {
        enumerable: false,
        get() {
          deprecation("7.0.0", "renderer.plugins.extract has moved to renderer.extract");
          return renderer.extract;
        }
      },
      prepare: {
        enumerable: false,
        get() {
          deprecation("7.0.0", "renderer.plugins.prepare has moved to renderer.prepare");
          return renderer.prepare;
        }
      },
      interaction: {
        enumerable: false,
        get() {
          deprecation("7.0.0", "renderer.plugins.interaction has been deprecated, use renderer.events");
          return renderer.events;
        }
      }
    });
  }
  init() {
    const staticMap = this.rendererPlugins;
    for (const o3 in staticMap) {
      this.plugins[o3] = new staticMap[o3](this.renderer);
    }
  }
  destroy() {
    for (const o3 in this.plugins) {
      this.plugins[o3].destroy();
      this.plugins[o3] = null;
    }
  }
};
PluginSystem.extension = {
  type: [
    ExtensionType.RendererSystem,
    ExtensionType.CanvasRendererSystem
  ],
  name: "_plugin"
};
extensions.add(PluginSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/projection/ProjectionSystem.mjs
var ProjectionSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.destinationFrame = null;
    this.sourceFrame = null;
    this.defaultFrame = null;
    this.projectionMatrix = new Matrix();
    this.transform = null;
  }
  update(destinationFrame, sourceFrame, resolution, root) {
    this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
    this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
    this.calculateProjection(this.destinationFrame, this.sourceFrame, resolution, root);
    if (this.transform) {
      this.projectionMatrix.append(this.transform);
    }
    const renderer = this.renderer;
    renderer.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix;
    renderer.globalUniforms.update();
    if (renderer.shader.shader) {
      renderer.shader.syncUniformGroup(renderer.shader.shader.uniforms.globals);
    }
  }
  calculateProjection(_destinationFrame, sourceFrame, _resolution, root) {
    const pm = this.projectionMatrix;
    const sign2 = !root ? 1 : -1;
    pm.identity();
    pm.a = 1 / sourceFrame.width * 2;
    pm.d = sign2 * (1 / sourceFrame.height * 2);
    pm.tx = -1 - sourceFrame.x * pm.a;
    pm.ty = -sign2 - sourceFrame.y * pm.d;
  }
  setTransform(_matrix) {
  }
  destroy() {
    this.renderer = null;
  }
};
ProjectionSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "projection"
};
extensions.add(ProjectionSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/renderTexture/GenerateTextureSystem.mjs
var tempTransform = new Transform();
var GenerateTextureSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this._tempMatrix = new Matrix();
  }
  generateTexture(displayObject, options) {
    const { region: manualRegion, ...textureOptions } = options || {};
    const region = manualRegion || displayObject.getLocalBounds(null, true);
    if (region.width === 0)
      region.width = 1;
    if (region.height === 0)
      region.height = 1;
    const renderTexture = RenderTexture.create({
      width: region.width,
      height: region.height,
      ...textureOptions
    });
    this._tempMatrix.tx = -region.x;
    this._tempMatrix.ty = -region.y;
    const transform = displayObject.transform;
    displayObject.transform = tempTransform;
    this.renderer.render(displayObject, {
      renderTexture,
      transform: this._tempMatrix,
      skipUpdateTransform: !!displayObject.parent,
      blit: true
    });
    displayObject.transform = transform;
    return renderTexture;
  }
  destroy() {
  }
};
GenerateTextureSystem.extension = {
  type: [
    ExtensionType.RendererSystem,
    ExtensionType.CanvasRendererSystem
  ],
  name: "textureGenerator"
};
extensions.add(GenerateTextureSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/renderTexture/RenderTextureSystem.mjs
var tempRect = new Rectangle();
var tempRect2 = new Rectangle();
var RenderTextureSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.defaultMaskStack = [];
    this.current = null;
    this.sourceFrame = new Rectangle();
    this.destinationFrame = new Rectangle();
    this.viewportFrame = new Rectangle();
  }
  contextChange() {
    const attributes = this.renderer?.gl.getContextAttributes();
    this._rendererPremultipliedAlpha = !!(attributes && attributes.alpha && attributes.premultipliedAlpha);
  }
  bind(renderTexture = null, sourceFrame, destinationFrame) {
    const renderer = this.renderer;
    this.current = renderTexture;
    let baseTexture;
    let framebuffer;
    let resolution;
    if (renderTexture) {
      baseTexture = renderTexture.baseTexture;
      resolution = baseTexture.resolution;
      if (!sourceFrame) {
        tempRect.width = renderTexture.frame.width;
        tempRect.height = renderTexture.frame.height;
        sourceFrame = tempRect;
      }
      if (!destinationFrame) {
        tempRect2.x = renderTexture.frame.x;
        tempRect2.y = renderTexture.frame.y;
        tempRect2.width = sourceFrame.width;
        tempRect2.height = sourceFrame.height;
        destinationFrame = tempRect2;
      }
      framebuffer = baseTexture.framebuffer;
    } else {
      resolution = renderer.resolution;
      if (!sourceFrame) {
        tempRect.width = renderer._view.screen.width;
        tempRect.height = renderer._view.screen.height;
        sourceFrame = tempRect;
      }
      if (!destinationFrame) {
        destinationFrame = tempRect;
        destinationFrame.width = sourceFrame.width;
        destinationFrame.height = sourceFrame.height;
      }
    }
    const viewportFrame = this.viewportFrame;
    viewportFrame.x = destinationFrame.x * resolution;
    viewportFrame.y = destinationFrame.y * resolution;
    viewportFrame.width = destinationFrame.width * resolution;
    viewportFrame.height = destinationFrame.height * resolution;
    if (!renderTexture) {
      viewportFrame.y = renderer.view.height - (viewportFrame.y + viewportFrame.height);
    }
    viewportFrame.ceil();
    this.renderer.framebuffer.bind(framebuffer, viewportFrame);
    this.renderer.projection.update(destinationFrame, sourceFrame, resolution, !framebuffer);
    if (renderTexture) {
      this.renderer.mask.setMaskStack(baseTexture.maskStack);
    } else {
      this.renderer.mask.setMaskStack(this.defaultMaskStack);
    }
    this.sourceFrame.copyFrom(sourceFrame);
    this.destinationFrame.copyFrom(destinationFrame);
  }
  clear(clearColor, mask) {
    const fallbackColor = this.current ? this.current.baseTexture.clear : this.renderer.background.backgroundColor;
    const color = Color.shared.setValue(clearColor ? clearColor : fallbackColor);
    if (this.current && this.current.baseTexture.alphaMode > 0 || !this.current && this._rendererPremultipliedAlpha) {
      color.premultiply(color.alpha);
    }
    const destinationFrame = this.destinationFrame;
    const baseFrame = this.current ? this.current.baseTexture : this.renderer._view.screen;
    const clearMask = destinationFrame.width !== baseFrame.width || destinationFrame.height !== baseFrame.height;
    if (clearMask) {
      let { x: x2, y: y2, width, height } = this.viewportFrame;
      x2 = Math.round(x2);
      y2 = Math.round(y2);
      width = Math.round(width);
      height = Math.round(height);
      this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);
      this.renderer.gl.scissor(x2, y2, width, height);
    }
    this.renderer.framebuffer.clear(color.red, color.green, color.blue, color.alpha, mask);
    if (clearMask) {
      this.renderer.scissor.pop();
    }
  }
  resize() {
    this.bind(null);
  }
  reset() {
    this.bind(null);
  }
  destroy() {
    this.renderer = null;
  }
};
RenderTextureSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "renderTexture"
};
extensions.add(RenderTextureSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/GLProgram.mjs
var GLProgram = class {
  constructor(program, uniformData) {
    this.program = program;
    this.uniformData = uniformData;
    this.uniformGroups = {};
    this.uniformDirtyGroups = {};
    this.uniformBufferBindings = {};
  }
  destroy() {
    this.uniformData = null;
    this.uniformGroups = null;
    this.uniformDirtyGroups = null;
    this.uniformBufferBindings = null;
    this.program = null;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/getAttributeData.mjs
function getAttributeData(program, gl) {
  const attributes = {};
  const totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i2 = 0; i2 < totalAttributes; i2++) {
    const attribData = gl.getActiveAttrib(program, i2);
    if (attribData.name.startsWith("gl_")) {
      continue;
    }
    const type = mapType(gl, attribData.type);
    const data = {
      type,
      name: attribData.name,
      size: mapSize(type),
      location: gl.getAttribLocation(program, attribData.name)
    };
    attributes[attribData.name] = data;
  }
  return attributes;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/getUniformData.mjs
function getUniformData(program, gl) {
  const uniforms = {};
  const totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i2 = 0; i2 < totalUniforms; i2++) {
    const uniformData = gl.getActiveUniform(program, i2);
    const name = uniformData.name.replace(/\[.*?\]$/, "");
    const isArray = !!uniformData.name.match(/\[.*?\]$/);
    const type = mapType(gl, uniformData.type);
    uniforms[name] = {
      name,
      index: i2,
      type,
      size: uniformData.size,
      isArray,
      value: defaultValue(type, uniformData.size)
    };
  }
  return uniforms;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/generateProgram.mjs
function generateProgram(gl, program) {
  const glVertShader = compileShader(gl, gl.VERTEX_SHADER, program.vertexSrc);
  const glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, program.fragmentSrc);
  const webGLProgram = gl.createProgram();
  gl.attachShader(webGLProgram, glVertShader);
  gl.attachShader(webGLProgram, glFragShader);
  const transformFeedbackVaryings = program.extra?.transformFeedbackVaryings;
  if (transformFeedbackVaryings) {
    if (typeof gl.transformFeedbackVaryings !== "function") {
      console.warn(`TransformFeedback is not supported but TransformFeedbackVaryings are given.`);
    } else {
      gl.transformFeedbackVaryings(webGLProgram, transformFeedbackVaryings.names, transformFeedbackVaryings.bufferMode === "separate" ? gl.SEPARATE_ATTRIBS : gl.INTERLEAVED_ATTRIBS);
    }
  }
  gl.linkProgram(webGLProgram);
  if (!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS)) {
    logProgramError(gl, webGLProgram, glVertShader, glFragShader);
  }
  program.attributeData = getAttributeData(webGLProgram, gl);
  program.uniformData = getUniformData(webGLProgram, gl);
  if (!/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(program.vertexSrc)) {
    const keys = Object.keys(program.attributeData);
    keys.sort((a2, b3) => a2 > b3 ? 1 : -1);
    for (let i2 = 0; i2 < keys.length; i2++) {
      program.attributeData[keys[i2]].location = i2;
      gl.bindAttribLocation(webGLProgram, i2, keys[i2]);
    }
    gl.linkProgram(webGLProgram);
  }
  gl.deleteShader(glVertShader);
  gl.deleteShader(glFragShader);
  const uniformData = {};
  for (const i2 in program.uniformData) {
    const data = program.uniformData[i2];
    uniformData[i2] = {
      location: gl.getUniformLocation(webGLProgram, i2),
      value: defaultValue(data.type, data.size)
    };
  }
  const glProgram = new GLProgram(webGLProgram, uniformData);
  return glProgram;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/utils/generateUniformBufferSync.mjs
function uboUpdate(_ud, _uv, _renderer, _syncData, buffer) {
  _renderer.buffer.update(buffer);
}
var UBO_TO_SINGLE_SETTERS = {
  float: `
        data[offset] = v;
    `,
  vec2: `
        data[offset] = v[0];
        data[offset+1] = v[1];
    `,
  vec3: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

    `,
  vec4: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];
        data[offset+3] = v[3];
    `,
  mat2: `
        data[offset] = v[0];
        data[offset+1] = v[1];

        data[offset+4] = v[2];
        data[offset+5] = v[3];
    `,
  mat3: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];

        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];
    `,
  mat4: `
        for(var i = 0; i < 16; i++)
        {
            data[offset + i] = v[i];
        }
    `
};
var GLSL_TO_STD40_SIZE = {
  float: 4,
  vec2: 8,
  vec3: 12,
  vec4: 16,
  int: 4,
  ivec2: 8,
  ivec3: 12,
  ivec4: 16,
  uint: 4,
  uvec2: 8,
  uvec3: 12,
  uvec4: 16,
  bool: 4,
  bvec2: 8,
  bvec3: 12,
  bvec4: 16,
  mat2: 16 * 2,
  mat3: 16 * 3,
  mat4: 16 * 4
};
function createUBOElements(uniformData) {
  const uboElements = uniformData.map((data) => ({
    data,
    offset: 0,
    dataLen: 0,
    dirty: 0
  }));
  let size = 0;
  let chunkSize = 0;
  let offset = 0;
  for (let i2 = 0; i2 < uboElements.length; i2++) {
    const uboElement = uboElements[i2];
    size = GLSL_TO_STD40_SIZE[uboElement.data.type];
    if (uboElement.data.size > 1) {
      size = Math.max(size, 16) * uboElement.data.size;
    }
    uboElement.dataLen = size;
    if (chunkSize % size !== 0 && chunkSize < 16) {
      const lineUpValue = chunkSize % size % 16;
      chunkSize += lineUpValue;
      offset += lineUpValue;
    }
    if (chunkSize + size > 16) {
      offset = Math.ceil(offset / 16) * 16;
      uboElement.offset = offset;
      offset += size;
      chunkSize = size;
    } else {
      uboElement.offset = offset;
      chunkSize += size;
      offset += size;
    }
  }
  offset = Math.ceil(offset / 16) * 16;
  return { uboElements, size: offset };
}
function getUBOData(uniforms, uniformData) {
  const usedUniformDatas = [];
  for (const i2 in uniforms) {
    if (uniformData[i2]) {
      usedUniformDatas.push(uniformData[i2]);
    }
  }
  usedUniformDatas.sort((a2, b3) => a2.index - b3.index);
  return usedUniformDatas;
}
function generateUniformBufferSync(group, uniformData) {
  if (!group.autoManage) {
    return { size: 0, syncFunc: uboUpdate };
  }
  const usedUniformDatas = getUBOData(group.uniforms, uniformData);
  const { uboElements, size } = createUBOElements(usedUniformDatas);
  const funcFragments = [`
    var v = null;
    var v2 = null;
    var cv = null;
    var t = 0;
    var gl = renderer.gl
    var index = 0;
    var data = buffer.data;
    `];
  for (let i2 = 0; i2 < uboElements.length; i2++) {
    const uboElement = uboElements[i2];
    const uniform = group.uniforms[uboElement.data.name];
    const name = uboElement.data.name;
    let parsed = false;
    for (let j3 = 0; j3 < uniformParsers.length; j3++) {
      const uniformParser = uniformParsers[j3];
      if (uniformParser.codeUbo && uniformParser.test(uboElement.data, uniform)) {
        funcFragments.push(`offset = ${uboElement.offset / 4};`, uniformParsers[j3].codeUbo(uboElement.data.name, uniform));
        parsed = true;
        break;
      }
    }
    if (!parsed) {
      if (uboElement.data.size > 1) {
        const size2 = mapSize(uboElement.data.type);
        const rowSize = Math.max(GLSL_TO_STD40_SIZE[uboElement.data.type] / 16, 1);
        const elementSize = size2 / rowSize;
        const remainder = (4 - elementSize % 4) % 4;
        funcFragments.push(`
                cv = ud.${name}.value;
                v = uv.${name};
                offset = ${uboElement.offset / 4};

                t = 0;

                for(var i=0; i < ${uboElement.data.size * rowSize}; i++)
                {
                    for(var j = 0; j < ${elementSize}; j++)
                    {
                        data[offset++] = v[t++];
                    }
                    offset += ${remainder};
                }

                `);
      } else {
        const template = UBO_TO_SINGLE_SETTERS[uboElement.data.type];
        funcFragments.push(`
                cv = ud.${name}.value;
                v = uv.${name};
                offset = ${uboElement.offset / 4};
                ${template};
                `);
      }
    }
  }
  funcFragments.push(`
       renderer.buffer.update(buffer);
    `);
  return {
    size,
    syncFunc: new Function("ud", "uv", "renderer", "syncData", "buffer", funcFragments.join("\n"))
  };
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/shader/ShaderSystem.mjs
var UID5 = 0;
var defaultSyncData = { textureCount: 0, uboCount: 0 };
var ShaderSystem = class {
  constructor(renderer) {
    this.destroyed = false;
    this.renderer = renderer;
    this.systemCheck();
    this.gl = null;
    this.shader = null;
    this.program = null;
    this.cache = {};
    this._uboCache = {};
    this.id = UID5++;
  }
  systemCheck() {
    if (!unsafeEvalSupported()) {
      throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
    }
  }
  contextChange(gl) {
    this.gl = gl;
    this.reset();
  }
  bind(shader, dontSync) {
    shader.disposeRunner.add(this);
    shader.uniforms.globals = this.renderer.globalUniforms;
    const program = shader.program;
    const glProgram = program.glPrograms[this.renderer.CONTEXT_UID] || this.generateProgram(shader);
    this.shader = shader;
    if (this.program !== program) {
      this.program = program;
      this.gl.useProgram(glProgram.program);
    }
    if (!dontSync) {
      defaultSyncData.textureCount = 0;
      defaultSyncData.uboCount = 0;
      this.syncUniformGroup(shader.uniformGroup, defaultSyncData);
    }
    return glProgram;
  }
  setUniforms(uniforms) {
    const shader = this.shader.program;
    const glProgram = shader.glPrograms[this.renderer.CONTEXT_UID];
    shader.syncUniforms(glProgram.uniformData, uniforms, this.renderer);
  }
  syncUniformGroup(group, syncData) {
    const glProgram = this.getGlProgram();
    if (!group.static || group.dirtyId !== glProgram.uniformDirtyGroups[group.id]) {
      glProgram.uniformDirtyGroups[group.id] = group.dirtyId;
      this.syncUniforms(group, glProgram, syncData);
    }
  }
  syncUniforms(group, glProgram, syncData) {
    const syncFunc = group.syncUniforms[this.shader.program.id] || this.createSyncGroups(group);
    syncFunc(glProgram.uniformData, group.uniforms, this.renderer, syncData);
  }
  createSyncGroups(group) {
    const id = this.getSignature(group, this.shader.program.uniformData, "u");
    if (!this.cache[id]) {
      this.cache[id] = generateUniformsSync(group, this.shader.program.uniformData);
    }
    group.syncUniforms[this.shader.program.id] = this.cache[id];
    return group.syncUniforms[this.shader.program.id];
  }
  syncUniformBufferGroup(group, name) {
    const glProgram = this.getGlProgram();
    if (!group.static || group.dirtyId !== 0 || !glProgram.uniformGroups[group.id]) {
      group.dirtyId = 0;
      const syncFunc = glProgram.uniformGroups[group.id] || this.createSyncBufferGroup(group, glProgram, name);
      group.buffer.update();
      syncFunc(glProgram.uniformData, group.uniforms, this.renderer, defaultSyncData, group.buffer);
    }
    this.renderer.buffer.bindBufferBase(group.buffer, glProgram.uniformBufferBindings[name]);
  }
  createSyncBufferGroup(group, glProgram, name) {
    const { gl } = this.renderer;
    this.renderer.buffer.bind(group.buffer);
    const uniformBlockIndex = this.gl.getUniformBlockIndex(glProgram.program, name);
    glProgram.uniformBufferBindings[name] = this.shader.uniformBindCount;
    gl.uniformBlockBinding(glProgram.program, uniformBlockIndex, this.shader.uniformBindCount);
    this.shader.uniformBindCount++;
    const id = this.getSignature(group, this.shader.program.uniformData, "ubo");
    let uboData = this._uboCache[id];
    if (!uboData) {
      uboData = this._uboCache[id] = generateUniformBufferSync(group, this.shader.program.uniformData);
    }
    if (group.autoManage) {
      const data = new Float32Array(uboData.size / 4);
      group.buffer.update(data);
    }
    glProgram.uniformGroups[group.id] = uboData.syncFunc;
    return glProgram.uniformGroups[group.id];
  }
  getSignature(group, uniformData, preFix) {
    const uniforms = group.uniforms;
    const strings = [`${preFix}-`];
    for (const i2 in uniforms) {
      strings.push(i2);
      if (uniformData[i2]) {
        strings.push(uniformData[i2].type);
      }
    }
    return strings.join("-");
  }
  getGlProgram() {
    if (this.shader) {
      return this.shader.program.glPrograms[this.renderer.CONTEXT_UID];
    }
    return null;
  }
  generateProgram(shader) {
    const gl = this.gl;
    const program = shader.program;
    const glProgram = generateProgram(gl, program);
    program.glPrograms[this.renderer.CONTEXT_UID] = glProgram;
    return glProgram;
  }
  reset() {
    this.program = null;
    this.shader = null;
  }
  disposeShader(shader) {
    if (this.shader === shader) {
      this.shader = null;
    }
  }
  destroy() {
    this.renderer = null;
    this.destroyed = true;
  }
};
ShaderSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "shader"
};
extensions.add(ShaderSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/startup/StartupSystem.mjs
var StartupSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
  }
  run(options) {
    const { renderer } = this;
    renderer.runners.init.emit(renderer.options);
    if (options.hello) {
      console.log(`PixiJS ${"7.2.4"} - ${renderer.rendererLogId} - https://pixijs.com`);
    }
    renderer.resize(renderer.screen.width, renderer.screen.height);
  }
  destroy() {
  }
};
StartupSystem.defaultOptions = {
  hello: false
};
StartupSystem.extension = {
  type: [
    ExtensionType.RendererSystem,
    ExtensionType.CanvasRendererSystem
  ],
  name: "startup"
};
extensions.add(StartupSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/state/utils/mapWebGLBlendModesToPixi.mjs
function mapWebGLBlendModesToPixi(gl, array = []) {
  array[BLEND_MODES.NORMAL] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.ADD] = [gl.ONE, gl.ONE];
  array[BLEND_MODES.MULTIPLY] = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SCREEN] = [gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.OVERLAY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.DARKEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.LIGHTEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.COLOR_DODGE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.COLOR_BURN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.HARD_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SOFT_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.DIFFERENCE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.EXCLUSION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.HUE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SATURATION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.COLOR] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.LUMINOSITY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.NONE] = [0, 0];
  array[BLEND_MODES.NORMAL_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.ADD_NPM] = [gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE];
  array[BLEND_MODES.SCREEN_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SRC_IN] = [gl.DST_ALPHA, gl.ZERO];
  array[BLEND_MODES.SRC_OUT] = [gl.ONE_MINUS_DST_ALPHA, gl.ZERO];
  array[BLEND_MODES.SRC_ATOP] = [gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.DST_OVER] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE];
  array[BLEND_MODES.DST_IN] = [gl.ZERO, gl.SRC_ALPHA];
  array[BLEND_MODES.DST_OUT] = [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.DST_ATOP] = [gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA];
  array[BLEND_MODES.XOR] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SUBTRACT] = [gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD];
  return array;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/state/StateSystem.mjs
var BLEND2 = 0;
var OFFSET2 = 1;
var CULLING2 = 2;
var DEPTH_TEST2 = 3;
var WINDING2 = 4;
var DEPTH_MASK2 = 5;
var _StateSystem = class {
  constructor() {
    this.gl = null;
    this.stateId = 0;
    this.polygonOffset = 0;
    this.blendMode = BLEND_MODES.NONE;
    this._blendEq = false;
    this.map = [];
    this.map[BLEND2] = this.setBlend;
    this.map[OFFSET2] = this.setOffset;
    this.map[CULLING2] = this.setCullFace;
    this.map[DEPTH_TEST2] = this.setDepthTest;
    this.map[WINDING2] = this.setFrontFace;
    this.map[DEPTH_MASK2] = this.setDepthMask;
    this.checks = [];
    this.defaultState = new State();
    this.defaultState.blend = true;
  }
  contextChange(gl) {
    this.gl = gl;
    this.blendModes = mapWebGLBlendModesToPixi(gl);
    this.set(this.defaultState);
    this.reset();
  }
  set(state) {
    state = state || this.defaultState;
    if (this.stateId !== state.data) {
      let diff = this.stateId ^ state.data;
      let i2 = 0;
      while (diff) {
        if (diff & 1) {
          this.map[i2].call(this, !!(state.data & 1 << i2));
        }
        diff = diff >> 1;
        i2++;
      }
      this.stateId = state.data;
    }
    for (let i2 = 0; i2 < this.checks.length; i2++) {
      this.checks[i2](this, state);
    }
  }
  forceState(state) {
    state = state || this.defaultState;
    for (let i2 = 0; i2 < this.map.length; i2++) {
      this.map[i2].call(this, !!(state.data & 1 << i2));
    }
    for (let i2 = 0; i2 < this.checks.length; i2++) {
      this.checks[i2](this, state);
    }
    this.stateId = state.data;
  }
  setBlend(value) {
    this.updateCheck(_StateSystem.checkBlendMode, value);
    this.gl[value ? "enable" : "disable"](this.gl.BLEND);
  }
  setOffset(value) {
    this.updateCheck(_StateSystem.checkPolygonOffset, value);
    this.gl[value ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
  }
  setDepthTest(value) {
    this.gl[value ? "enable" : "disable"](this.gl.DEPTH_TEST);
  }
  setDepthMask(value) {
    this.gl.depthMask(value);
  }
  setCullFace(value) {
    this.gl[value ? "enable" : "disable"](this.gl.CULL_FACE);
  }
  setFrontFace(value) {
    this.gl.frontFace(this.gl[value ? "CW" : "CCW"]);
  }
  setBlendMode(value) {
    if (value === this.blendMode) {
      return;
    }
    this.blendMode = value;
    const mode = this.blendModes[value];
    const gl = this.gl;
    if (mode.length === 2) {
      gl.blendFunc(mode[0], mode[1]);
    } else {
      gl.blendFuncSeparate(mode[0], mode[1], mode[2], mode[3]);
    }
    if (mode.length === 6) {
      this._blendEq = true;
      gl.blendEquationSeparate(mode[4], mode[5]);
    } else if (this._blendEq) {
      this._blendEq = false;
      gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
    }
  }
  setPolygonOffset(value, scale) {
    this.gl.polygonOffset(value, scale);
  }
  reset() {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
    this.forceState(this.defaultState);
    this._blendEq = true;
    this.blendMode = -1;
    this.setBlendMode(0);
  }
  updateCheck(func, value) {
    const index = this.checks.indexOf(func);
    if (value && index === -1) {
      this.checks.push(func);
    } else if (!value && index !== -1) {
      this.checks.splice(index, 1);
    }
  }
  static checkBlendMode(system, state) {
    system.setBlendMode(state.blendMode);
  }
  static checkPolygonOffset(system, state) {
    system.setPolygonOffset(1, state.polygonOffset);
  }
  destroy() {
    this.gl = null;
  }
};
var StateSystem = _StateSystem;
StateSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "state"
};
extensions.add(StateSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/system/SystemManager.mjs
var SystemManager = class extends import_eventemitter3.default {
  constructor() {
    super(...arguments);
    this.runners = {};
    this._systemsHash = {};
  }
  setup(config) {
    this.addRunners(...config.runners);
    const priority = (config.priority ?? []).filter((key) => config.systems[key]);
    const orderByPriority = [
      ...priority,
      ...Object.keys(config.systems).filter((key) => !priority.includes(key))
    ];
    for (const i2 of orderByPriority) {
      this.addSystem(config.systems[i2], i2);
    }
  }
  addRunners(...runnerIds) {
    runnerIds.forEach((runnerId) => {
      this.runners[runnerId] = new Runner(runnerId);
    });
  }
  addSystem(ClassRef, name) {
    const system = new ClassRef(this);
    if (this[name]) {
      throw new Error(`Whoops! The name "${name}" is already in use`);
    }
    this[name] = system;
    this._systemsHash[name] = system;
    for (const i2 in this.runners) {
      this.runners[i2].add(system);
    }
    return this;
  }
  emitWithCustomOptions(runner, options) {
    const systemHashKeys = Object.keys(this._systemsHash);
    runner.items.forEach((system) => {
      const systemName = systemHashKeys.find((systemId) => this._systemsHash[systemId] === system);
      system[runner.name](options[systemName]);
    });
  }
  destroy() {
    Object.values(this.runners).forEach((runner) => {
      runner.destroy();
    });
    this._systemsHash = {};
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/TextureGCSystem.mjs
var _TextureGCSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.count = 0;
    this.checkCount = 0;
    this.maxIdle = _TextureGCSystem.defaultMaxIdle;
    this.checkCountMax = _TextureGCSystem.defaultCheckCountMax;
    this.mode = _TextureGCSystem.defaultMode;
  }
  postrender() {
    if (!this.renderer.objectRenderer.renderingToScreen) {
      return;
    }
    this.count++;
    if (this.mode === GC_MODES.MANUAL) {
      return;
    }
    this.checkCount++;
    if (this.checkCount > this.checkCountMax) {
      this.checkCount = 0;
      this.run();
    }
  }
  run() {
    const tm = this.renderer.texture;
    const managedTextures = tm.managedTextures;
    let wasRemoved = false;
    for (let i2 = 0; i2 < managedTextures.length; i2++) {
      const texture = managedTextures[i2];
      if (!texture.framebuffer && this.count - texture.touched > this.maxIdle) {
        tm.destroyTexture(texture, true);
        managedTextures[i2] = null;
        wasRemoved = true;
      }
    }
    if (wasRemoved) {
      let j3 = 0;
      for (let i2 = 0; i2 < managedTextures.length; i2++) {
        if (managedTextures[i2] !== null) {
          managedTextures[j3++] = managedTextures[i2];
        }
      }
      managedTextures.length = j3;
    }
  }
  unload(displayObject) {
    const tm = this.renderer.texture;
    const texture = displayObject._texture;
    if (texture && !texture.framebuffer) {
      tm.destroyTexture(texture);
    }
    for (let i2 = displayObject.children.length - 1; i2 >= 0; i2--) {
      this.unload(displayObject.children[i2]);
    }
  }
  destroy() {
    this.renderer = null;
  }
};
var TextureGCSystem = _TextureGCSystem;
TextureGCSystem.defaultMode = GC_MODES.AUTO;
TextureGCSystem.defaultMaxIdle = 60 * 60;
TextureGCSystem.defaultCheckCountMax = 60 * 10;
TextureGCSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "textureGC"
};
extensions.add(TextureGCSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/GLTexture.mjs
var GLTexture = class {
  constructor(texture) {
    this.texture = texture;
    this.width = -1;
    this.height = -1;
    this.dirtyId = -1;
    this.dirtyStyleId = -1;
    this.mipmap = false;
    this.wrapMode = 33071;
    this.type = TYPES.UNSIGNED_BYTE;
    this.internalFormat = FORMATS.RGBA;
    this.samplerType = 0;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/utils/mapTypeAndFormatToInternalFormat.mjs
function mapTypeAndFormatToInternalFormat(gl) {
  let table;
  if ("WebGL2RenderingContext" in globalThis && gl instanceof globalThis.WebGL2RenderingContext) {
    table = {
      [TYPES.UNSIGNED_BYTE]: {
        [FORMATS.RGBA]: gl.RGBA8,
        [FORMATS.RGB]: gl.RGB8,
        [FORMATS.RG]: gl.RG8,
        [FORMATS.RED]: gl.R8,
        [FORMATS.RGBA_INTEGER]: gl.RGBA8UI,
        [FORMATS.RGB_INTEGER]: gl.RGB8UI,
        [FORMATS.RG_INTEGER]: gl.RG8UI,
        [FORMATS.RED_INTEGER]: gl.R8UI,
        [FORMATS.ALPHA]: gl.ALPHA,
        [FORMATS.LUMINANCE]: gl.LUMINANCE,
        [FORMATS.LUMINANCE_ALPHA]: gl.LUMINANCE_ALPHA
      },
      [TYPES.BYTE]: {
        [FORMATS.RGBA]: gl.RGBA8_SNORM,
        [FORMATS.RGB]: gl.RGB8_SNORM,
        [FORMATS.RG]: gl.RG8_SNORM,
        [FORMATS.RED]: gl.R8_SNORM,
        [FORMATS.RGBA_INTEGER]: gl.RGBA8I,
        [FORMATS.RGB_INTEGER]: gl.RGB8I,
        [FORMATS.RG_INTEGER]: gl.RG8I,
        [FORMATS.RED_INTEGER]: gl.R8I
      },
      [TYPES.UNSIGNED_SHORT]: {
        [FORMATS.RGBA_INTEGER]: gl.RGBA16UI,
        [FORMATS.RGB_INTEGER]: gl.RGB16UI,
        [FORMATS.RG_INTEGER]: gl.RG16UI,
        [FORMATS.RED_INTEGER]: gl.R16UI,
        [FORMATS.DEPTH_COMPONENT]: gl.DEPTH_COMPONENT16
      },
      [TYPES.SHORT]: {
        [FORMATS.RGBA_INTEGER]: gl.RGBA16I,
        [FORMATS.RGB_INTEGER]: gl.RGB16I,
        [FORMATS.RG_INTEGER]: gl.RG16I,
        [FORMATS.RED_INTEGER]: gl.R16I
      },
      [TYPES.UNSIGNED_INT]: {
        [FORMATS.RGBA_INTEGER]: gl.RGBA32UI,
        [FORMATS.RGB_INTEGER]: gl.RGB32UI,
        [FORMATS.RG_INTEGER]: gl.RG32UI,
        [FORMATS.RED_INTEGER]: gl.R32UI,
        [FORMATS.DEPTH_COMPONENT]: gl.DEPTH_COMPONENT24
      },
      [TYPES.INT]: {
        [FORMATS.RGBA_INTEGER]: gl.RGBA32I,
        [FORMATS.RGB_INTEGER]: gl.RGB32I,
        [FORMATS.RG_INTEGER]: gl.RG32I,
        [FORMATS.RED_INTEGER]: gl.R32I
      },
      [TYPES.FLOAT]: {
        [FORMATS.RGBA]: gl.RGBA32F,
        [FORMATS.RGB]: gl.RGB32F,
        [FORMATS.RG]: gl.RG32F,
        [FORMATS.RED]: gl.R32F,
        [FORMATS.DEPTH_COMPONENT]: gl.DEPTH_COMPONENT32F
      },
      [TYPES.HALF_FLOAT]: {
        [FORMATS.RGBA]: gl.RGBA16F,
        [FORMATS.RGB]: gl.RGB16F,
        [FORMATS.RG]: gl.RG16F,
        [FORMATS.RED]: gl.R16F
      },
      [TYPES.UNSIGNED_SHORT_5_6_5]: {
        [FORMATS.RGB]: gl.RGB565
      },
      [TYPES.UNSIGNED_SHORT_4_4_4_4]: {
        [FORMATS.RGBA]: gl.RGBA4
      },
      [TYPES.UNSIGNED_SHORT_5_5_5_1]: {
        [FORMATS.RGBA]: gl.RGB5_A1
      },
      [TYPES.UNSIGNED_INT_2_10_10_10_REV]: {
        [FORMATS.RGBA]: gl.RGB10_A2,
        [FORMATS.RGBA_INTEGER]: gl.RGB10_A2UI
      },
      [TYPES.UNSIGNED_INT_10F_11F_11F_REV]: {
        [FORMATS.RGB]: gl.R11F_G11F_B10F
      },
      [TYPES.UNSIGNED_INT_5_9_9_9_REV]: {
        [FORMATS.RGB]: gl.RGB9_E5
      },
      [TYPES.UNSIGNED_INT_24_8]: {
        [FORMATS.DEPTH_STENCIL]: gl.DEPTH24_STENCIL8
      },
      [TYPES.FLOAT_32_UNSIGNED_INT_24_8_REV]: {
        [FORMATS.DEPTH_STENCIL]: gl.DEPTH32F_STENCIL8
      }
    };
  } else {
    table = {
      [TYPES.UNSIGNED_BYTE]: {
        [FORMATS.RGBA]: gl.RGBA,
        [FORMATS.RGB]: gl.RGB,
        [FORMATS.ALPHA]: gl.ALPHA,
        [FORMATS.LUMINANCE]: gl.LUMINANCE,
        [FORMATS.LUMINANCE_ALPHA]: gl.LUMINANCE_ALPHA
      },
      [TYPES.UNSIGNED_SHORT_5_6_5]: {
        [FORMATS.RGB]: gl.RGB
      },
      [TYPES.UNSIGNED_SHORT_4_4_4_4]: {
        [FORMATS.RGBA]: gl.RGBA
      },
      [TYPES.UNSIGNED_SHORT_5_5_5_1]: {
        [FORMATS.RGBA]: gl.RGBA
      }
    };
  }
  return table;
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/TextureSystem.mjs
var TextureSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.boundTextures = [];
    this.currentLocation = -1;
    this.managedTextures = [];
    this._unknownBoundTextures = false;
    this.unknownTexture = new BaseTexture();
    this.hasIntegerTextures = false;
  }
  contextChange() {
    const gl = this.gl = this.renderer.gl;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    this.webGLVersion = this.renderer.context.webGLVersion;
    this.internalFormats = mapTypeAndFormatToInternalFormat(gl);
    const maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    this.boundTextures.length = maxTextures;
    for (let i2 = 0; i2 < maxTextures; i2++) {
      this.boundTextures[i2] = null;
    }
    this.emptyTextures = {};
    const emptyTexture2D = new GLTexture(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, emptyTexture2D.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    this.emptyTextures[gl.TEXTURE_2D] = emptyTexture2D;
    this.emptyTextures[gl.TEXTURE_CUBE_MAP] = new GLTexture(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.emptyTextures[gl.TEXTURE_CUBE_MAP].texture);
    for (let i2 = 0; i2 < 6; i2++) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i2, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    for (let i2 = 0; i2 < this.boundTextures.length; i2++) {
      this.bind(null, i2);
    }
  }
  bind(texture, location = 0) {
    const { gl } = this;
    texture = texture?.castToBaseTexture();
    if (texture?.valid && !texture.parentTextureArray) {
      texture.touched = this.renderer.textureGC.count;
      const glTexture = texture._glTextures[this.CONTEXT_UID] || this.initTexture(texture);
      if (this.boundTextures[location] !== texture) {
        if (this.currentLocation !== location) {
          this.currentLocation = location;
          gl.activeTexture(gl.TEXTURE0 + location);
        }
        gl.bindTexture(texture.target, glTexture.texture);
      }
      if (glTexture.dirtyId !== texture.dirtyId) {
        if (this.currentLocation !== location) {
          this.currentLocation = location;
          gl.activeTexture(gl.TEXTURE0 + location);
        }
        this.updateTexture(texture);
      } else if (glTexture.dirtyStyleId !== texture.dirtyStyleId) {
        this.updateTextureStyle(texture);
      }
      this.boundTextures[location] = texture;
    } else {
      if (this.currentLocation !== location) {
        this.currentLocation = location;
        gl.activeTexture(gl.TEXTURE0 + location);
      }
      gl.bindTexture(gl.TEXTURE_2D, this.emptyTextures[gl.TEXTURE_2D].texture);
      this.boundTextures[location] = null;
    }
  }
  reset() {
    this._unknownBoundTextures = true;
    this.hasIntegerTextures = false;
    this.currentLocation = -1;
    for (let i2 = 0; i2 < this.boundTextures.length; i2++) {
      this.boundTextures[i2] = this.unknownTexture;
    }
  }
  unbind(texture) {
    const { gl, boundTextures } = this;
    if (this._unknownBoundTextures) {
      this._unknownBoundTextures = false;
      for (let i2 = 0; i2 < boundTextures.length; i2++) {
        if (boundTextures[i2] === this.unknownTexture) {
          this.bind(null, i2);
        }
      }
    }
    for (let i2 = 0; i2 < boundTextures.length; i2++) {
      if (boundTextures[i2] === texture) {
        if (this.currentLocation !== i2) {
          gl.activeTexture(gl.TEXTURE0 + i2);
          this.currentLocation = i2;
        }
        gl.bindTexture(texture.target, this.emptyTextures[texture.target].texture);
        boundTextures[i2] = null;
      }
    }
  }
  ensureSamplerType(maxTextures) {
    const { boundTextures, hasIntegerTextures, CONTEXT_UID } = this;
    if (!hasIntegerTextures) {
      return;
    }
    for (let i2 = maxTextures - 1; i2 >= 0; --i2) {
      const tex = boundTextures[i2];
      if (tex) {
        const glTexture = tex._glTextures[CONTEXT_UID];
        if (glTexture.samplerType !== SAMPLER_TYPES.FLOAT) {
          this.renderer.texture.unbind(tex);
        }
      }
    }
  }
  initTexture(texture) {
    const glTexture = new GLTexture(this.gl.createTexture());
    glTexture.dirtyId = -1;
    texture._glTextures[this.CONTEXT_UID] = glTexture;
    this.managedTextures.push(texture);
    texture.on("dispose", this.destroyTexture, this);
    return glTexture;
  }
  initTextureType(texture, glTexture) {
    glTexture.internalFormat = this.internalFormats[texture.type]?.[texture.format] ?? texture.format;
    if (this.webGLVersion === 2 && texture.type === TYPES.HALF_FLOAT) {
      glTexture.type = this.gl.HALF_FLOAT;
    } else {
      glTexture.type = texture.type;
    }
  }
  updateTexture(texture) {
    const glTexture = texture._glTextures[this.CONTEXT_UID];
    if (!glTexture) {
      return;
    }
    const renderer = this.renderer;
    this.initTextureType(texture, glTexture);
    if (texture.resource?.upload(renderer, texture, glTexture)) {
      if (glTexture.samplerType !== SAMPLER_TYPES.FLOAT) {
        this.hasIntegerTextures = true;
      }
    } else {
      const width = texture.realWidth;
      const height = texture.realHeight;
      const gl = renderer.gl;
      if (glTexture.width !== width || glTexture.height !== height || glTexture.dirtyId < 0) {
        glTexture.width = width;
        glTexture.height = height;
        gl.texImage2D(texture.target, 0, glTexture.internalFormat, width, height, 0, texture.format, glTexture.type, null);
      }
    }
    if (texture.dirtyStyleId !== glTexture.dirtyStyleId) {
      this.updateTextureStyle(texture);
    }
    glTexture.dirtyId = texture.dirtyId;
  }
  destroyTexture(texture, skipRemove) {
    const { gl } = this;
    texture = texture.castToBaseTexture();
    if (texture._glTextures[this.CONTEXT_UID]) {
      this.unbind(texture);
      gl.deleteTexture(texture._glTextures[this.CONTEXT_UID].texture);
      texture.off("dispose", this.destroyTexture, this);
      delete texture._glTextures[this.CONTEXT_UID];
      if (!skipRemove) {
        const i2 = this.managedTextures.indexOf(texture);
        if (i2 !== -1) {
          removeItems(this.managedTextures, i2, 1);
        }
      }
    }
  }
  updateTextureStyle(texture) {
    const glTexture = texture._glTextures[this.CONTEXT_UID];
    if (!glTexture) {
      return;
    }
    if ((texture.mipmap === MIPMAP_MODES.POW2 || this.webGLVersion !== 2) && !texture.isPowerOfTwo) {
      glTexture.mipmap = false;
    } else {
      glTexture.mipmap = texture.mipmap >= 1;
    }
    if (this.webGLVersion !== 2 && !texture.isPowerOfTwo) {
      glTexture.wrapMode = WRAP_MODES.CLAMP;
    } else {
      glTexture.wrapMode = texture.wrapMode;
    }
    if (texture.resource?.style(this.renderer, texture, glTexture)) {
    } else {
      this.setStyle(texture, glTexture);
    }
    glTexture.dirtyStyleId = texture.dirtyStyleId;
  }
  setStyle(texture, glTexture) {
    const gl = this.gl;
    if (glTexture.mipmap && texture.mipmap !== MIPMAP_MODES.ON_MANUAL) {
      gl.generateMipmap(texture.target);
    }
    gl.texParameteri(texture.target, gl.TEXTURE_WRAP_S, glTexture.wrapMode);
    gl.texParameteri(texture.target, gl.TEXTURE_WRAP_T, glTexture.wrapMode);
    if (glTexture.mipmap) {
      gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
      const anisotropicExt = this.renderer.context.extensions.anisotropicFiltering;
      if (anisotropicExt && texture.anisotropicLevel > 0 && texture.scaleMode === SCALE_MODES.LINEAR) {
        const level = Math.min(texture.anisotropicLevel, gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
        gl.texParameterf(texture.target, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, level);
      }
    } else {
      gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
    }
    gl.texParameteri(texture.target, gl.TEXTURE_MAG_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
  }
  destroy() {
    this.renderer = null;
  }
};
TextureSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "texture"
};
extensions.add(TextureSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/transformFeedback/TransformFeedbackSystem.mjs
var TransformFeedbackSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
  }
  contextChange() {
    this.gl = this.renderer.gl;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID;
  }
  bind(transformFeedback) {
    const { gl, CONTEXT_UID } = this;
    const glTransformFeedback = transformFeedback._glTransformFeedbacks[CONTEXT_UID] || this.createGLTransformFeedback(transformFeedback);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, glTransformFeedback);
  }
  unbind() {
    const { gl } = this;
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
  }
  beginTransformFeedback(drawMode, shader) {
    const { gl, renderer } = this;
    if (shader) {
      renderer.shader.bind(shader);
    }
    gl.beginTransformFeedback(drawMode);
  }
  endTransformFeedback() {
    const { gl } = this;
    gl.endTransformFeedback();
  }
  createGLTransformFeedback(tf) {
    const { gl, renderer, CONTEXT_UID } = this;
    const glTransformFeedback = gl.createTransformFeedback();
    tf._glTransformFeedbacks[CONTEXT_UID] = glTransformFeedback;
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, glTransformFeedback);
    for (let i2 = 0; i2 < tf.buffers.length; i2++) {
      const buffer = tf.buffers[i2];
      if (!buffer)
        continue;
      renderer.buffer.update(buffer);
      buffer._glBuffers[CONTEXT_UID].refCount++;
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i2, buffer._glBuffers[CONTEXT_UID].buffer || null);
    }
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    tf.disposeRunner.add(this);
    return glTransformFeedback;
  }
  disposeTransformFeedback(tf, contextLost) {
    const glTF = tf._glTransformFeedbacks[this.CONTEXT_UID];
    const gl = this.gl;
    tf.disposeRunner.remove(this);
    const bufferSystem = this.renderer.buffer;
    if (bufferSystem) {
      for (let i2 = 0; i2 < tf.buffers.length; i2++) {
        const buffer = tf.buffers[i2];
        if (!buffer)
          continue;
        const buf = buffer._glBuffers[this.CONTEXT_UID];
        if (buf) {
          buf.refCount--;
          if (buf.refCount === 0 && !contextLost) {
            bufferSystem.dispose(buffer, contextLost);
          }
        }
      }
    }
    if (!glTF) {
      return;
    }
    if (!contextLost) {
      gl.deleteTransformFeedback(glTF);
    }
    delete tf._glTransformFeedbacks[this.CONTEXT_UID];
  }
  destroy() {
    this.renderer = null;
  }
};
TransformFeedbackSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "transformFeedback"
};
extensions.add(TransformFeedbackSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/view/ViewSystem.mjs
var ViewSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
  }
  init(options) {
    this.screen = new Rectangle(0, 0, options.width, options.height);
    this.element = options.view || settings.ADAPTER.createCanvas();
    this.resolution = options.resolution || settings.RESOLUTION;
    this.autoDensity = !!options.autoDensity;
  }
  resizeView(desiredScreenWidth, desiredScreenHeight) {
    this.element.width = Math.round(desiredScreenWidth * this.resolution);
    this.element.height = Math.round(desiredScreenHeight * this.resolution);
    const screenWidth = this.element.width / this.resolution;
    const screenHeight = this.element.height / this.resolution;
    this.screen.width = screenWidth;
    this.screen.height = screenHeight;
    if (this.autoDensity) {
      this.element.style.width = `${screenWidth}px`;
      this.element.style.height = `${screenHeight}px`;
    }
    this.renderer.emit("resize", screenWidth, screenHeight);
    this.renderer.runners.resize.emit(this.screen.width, this.screen.height);
  }
  destroy(removeView) {
    if (removeView) {
      this.element.parentNode?.removeChild(this.element);
    }
    this.renderer = null;
    this.element = null;
    this.screen = null;
  }
};
ViewSystem.defaultOptions = {
  width: 800,
  height: 600,
  resolution: settings.RESOLUTION,
  autoDensity: false
};
ViewSystem.extension = {
  type: [
    ExtensionType.RendererSystem,
    ExtensionType.CanvasRendererSystem
  ],
  name: "_view"
};
extensions.add(ViewSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/settings.mjs
settings.PREFER_ENV = ENV.WEBGL2;
settings.STRICT_TEXTURE_CACHE = false;
settings.RENDER_OPTIONS = {
  ...ContextSystem.defaultOptions,
  ...BackgroundSystem.defaultOptions,
  ...ViewSystem.defaultOptions,
  ...StartupSystem.defaultOptions
};
Object.defineProperties(settings, {
  WRAP_MODE: {
    get() {
      return BaseTexture.defaultOptions.wrapMode;
    },
    set(value) {
      deprecation("7.1.0", "settings.WRAP_MODE is deprecated, use BaseTexture.defaultOptions.wrapMode");
      BaseTexture.defaultOptions.wrapMode = value;
    }
  },
  SCALE_MODE: {
    get() {
      return BaseTexture.defaultOptions.scaleMode;
    },
    set(value) {
      deprecation("7.1.0", "settings.SCALE_MODE is deprecated, use BaseTexture.defaultOptions.scaleMode");
      BaseTexture.defaultOptions.scaleMode = value;
    }
  },
  MIPMAP_TEXTURES: {
    get() {
      return BaseTexture.defaultOptions.mipmap;
    },
    set(value) {
      deprecation("7.1.0", "settings.MIPMAP_TEXTURES is deprecated, use BaseTexture.defaultOptions.mipmap");
      BaseTexture.defaultOptions.mipmap = value;
    }
  },
  ANISOTROPIC_LEVEL: {
    get() {
      return BaseTexture.defaultOptions.anisotropicLevel;
    },
    set(value) {
      deprecation("7.1.0", "settings.ANISOTROPIC_LEVEL is deprecated, use BaseTexture.defaultOptions.anisotropicLevel");
      BaseTexture.defaultOptions.anisotropicLevel = value;
    }
  },
  FILTER_RESOLUTION: {
    get() {
      deprecation("7.1.0", "settings.FILTER_RESOLUTION is deprecated, use Filter.defaultResolution");
      return Filter.defaultResolution;
    },
    set(value) {
      Filter.defaultResolution = value;
    }
  },
  FILTER_MULTISAMPLE: {
    get() {
      deprecation("7.1.0", "settings.FILTER_MULTISAMPLE is deprecated, use Filter.defaultMultisample");
      return Filter.defaultMultisample;
    },
    set(value) {
      Filter.defaultMultisample = value;
    }
  },
  SPRITE_MAX_TEXTURES: {
    get() {
      return BatchRenderer.defaultMaxTextures;
    },
    set(value) {
      deprecation("7.1.0", "settings.SPRITE_MAX_TEXTURES is deprecated, use BatchRenderer.defaultMaxTextures");
      BatchRenderer.defaultMaxTextures = value;
    }
  },
  SPRITE_BATCH_SIZE: {
    get() {
      return BatchRenderer.defaultBatchSize;
    },
    set(value) {
      deprecation("7.1.0", "settings.SPRITE_BATCH_SIZE is deprecated, use BatchRenderer.defaultBatchSize");
      BatchRenderer.defaultBatchSize = value;
    }
  },
  CAN_UPLOAD_SAME_BUFFER: {
    get() {
      return BatchRenderer.canUploadSameBuffer;
    },
    set(value) {
      deprecation("7.1.0", "settings.CAN_UPLOAD_SAME_BUFFER is deprecated, use BatchRenderer.canUploadSameBuffer");
      BatchRenderer.canUploadSameBuffer = value;
    }
  },
  GC_MODE: {
    get() {
      return TextureGCSystem.defaultMode;
    },
    set(value) {
      deprecation("7.1.0", "settings.GC_MODE is deprecated, use TextureGCSystem.defaultMode");
      TextureGCSystem.defaultMode = value;
    }
  },
  GC_MAX_IDLE: {
    get() {
      return TextureGCSystem.defaultMaxIdle;
    },
    set(value) {
      deprecation("7.1.0", "settings.GC_MAX_IDLE is deprecated, use TextureGCSystem.defaultMaxIdle");
      TextureGCSystem.defaultMaxIdle = value;
    }
  },
  GC_MAX_CHECK_COUNT: {
    get() {
      return TextureGCSystem.defaultCheckCountMax;
    },
    set(value) {
      deprecation("7.1.0", "settings.GC_MAX_CHECK_COUNT is deprecated, use TextureGCSystem.defaultCheckCountMax");
      TextureGCSystem.defaultCheckCountMax = value;
    }
  },
  PRECISION_VERTEX: {
    get() {
      return Program.defaultVertexPrecision;
    },
    set(value) {
      deprecation("7.1.0", "settings.PRECISION_VERTEX is deprecated, use Program.defaultVertexPrecision");
      Program.defaultVertexPrecision = value;
    }
  },
  PRECISION_FRAGMENT: {
    get() {
      return Program.defaultFragmentPrecision;
    },
    set(value) {
      deprecation("7.1.0", "settings.PRECISION_FRAGMENT is deprecated, use Program.defaultFragmentPrecision");
      Program.defaultFragmentPrecision = value;
    }
  }
});

// ../../node_modules/.pnpm/@pixi+ticker@7.2.4/node_modules/@pixi/ticker/lib/const.mjs
var UPDATE_PRIORITY = /* @__PURE__ */ ((UPDATE_PRIORITY2) => {
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["INTERACTION"] = 50] = "INTERACTION";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["HIGH"] = 25] = "HIGH";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["NORMAL"] = 0] = "NORMAL";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["LOW"] = -25] = "LOW";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["UTILITY"] = -50] = "UTILITY";
  return UPDATE_PRIORITY2;
})(UPDATE_PRIORITY || {});

// ../../node_modules/.pnpm/@pixi+ticker@7.2.4/node_modules/@pixi/ticker/lib/TickerListener.mjs
var TickerListener = class {
  constructor(fn, context2 = null, priority = 0, once = false) {
    this.next = null;
    this.previous = null;
    this._destroyed = false;
    this.fn = fn;
    this.context = context2;
    this.priority = priority;
    this.once = once;
  }
  match(fn, context2 = null) {
    return this.fn === fn && this.context === context2;
  }
  emit(deltaTime) {
    if (this.fn) {
      if (this.context) {
        this.fn.call(this.context, deltaTime);
      } else {
        this.fn(deltaTime);
      }
    }
    const redirect = this.next;
    if (this.once) {
      this.destroy(true);
    }
    if (this._destroyed) {
      this.next = null;
    }
    return redirect;
  }
  connect(previous) {
    this.previous = previous;
    if (previous.next) {
      previous.next.previous = this;
    }
    this.next = previous.next;
    previous.next = this;
  }
  destroy(hard = false) {
    this._destroyed = true;
    this.fn = null;
    this.context = null;
    if (this.previous) {
      this.previous.next = this.next;
    }
    if (this.next) {
      this.next.previous = this.previous;
    }
    const redirect = this.next;
    this.next = hard ? null : redirect;
    this.previous = null;
    return redirect;
  }
};

// ../../node_modules/.pnpm/@pixi+ticker@7.2.4/node_modules/@pixi/ticker/lib/Ticker.mjs
var _Ticker = class {
  constructor() {
    this.autoStart = false;
    this.deltaTime = 1;
    this.lastTime = -1;
    this.speed = 1;
    this.started = false;
    this._requestId = null;
    this._maxElapsedMS = 100;
    this._minElapsedMS = 0;
    this._protected = false;
    this._lastFrame = -1;
    this._head = new TickerListener(null, null, Infinity);
    this.deltaMS = 1 / _Ticker.targetFPMS;
    this.elapsedMS = 1 / _Ticker.targetFPMS;
    this._tick = (time) => {
      this._requestId = null;
      if (this.started) {
        this.update(time);
        if (this.started && this._requestId === null && this._head.next) {
          this._requestId = requestAnimationFrame(this._tick);
        }
      }
    };
  }
  _requestIfNeeded() {
    if (this._requestId === null && this._head.next) {
      this.lastTime = performance.now();
      this._lastFrame = this.lastTime;
      this._requestId = requestAnimationFrame(this._tick);
    }
  }
  _cancelIfNeeded() {
    if (this._requestId !== null) {
      cancelAnimationFrame(this._requestId);
      this._requestId = null;
    }
  }
  _startIfPossible() {
    if (this.started) {
      this._requestIfNeeded();
    } else if (this.autoStart) {
      this.start();
    }
  }
  add(fn, context2, priority = UPDATE_PRIORITY.NORMAL) {
    return this._addListener(new TickerListener(fn, context2, priority));
  }
  addOnce(fn, context2, priority = UPDATE_PRIORITY.NORMAL) {
    return this._addListener(new TickerListener(fn, context2, priority, true));
  }
  _addListener(listener) {
    let current = this._head.next;
    let previous = this._head;
    if (!current) {
      listener.connect(previous);
    } else {
      while (current) {
        if (listener.priority > current.priority) {
          listener.connect(previous);
          break;
        }
        previous = current;
        current = current.next;
      }
      if (!listener.previous) {
        listener.connect(previous);
      }
    }
    this._startIfPossible();
    return this;
  }
  remove(fn, context2) {
    let listener = this._head.next;
    while (listener) {
      if (listener.match(fn, context2)) {
        listener = listener.destroy();
      } else {
        listener = listener.next;
      }
    }
    if (!this._head.next) {
      this._cancelIfNeeded();
    }
    return this;
  }
  get count() {
    if (!this._head) {
      return 0;
    }
    let count = 0;
    let current = this._head;
    while (current = current.next) {
      count++;
    }
    return count;
  }
  start() {
    if (!this.started) {
      this.started = true;
      this._requestIfNeeded();
    }
  }
  stop() {
    if (this.started) {
      this.started = false;
      this._cancelIfNeeded();
    }
  }
  destroy() {
    if (!this._protected) {
      this.stop();
      let listener = this._head.next;
      while (listener) {
        listener = listener.destroy(true);
      }
      this._head.destroy();
      this._head = null;
    }
  }
  update(currentTime = performance.now()) {
    let elapsedMS;
    if (currentTime > this.lastTime) {
      elapsedMS = this.elapsedMS = currentTime - this.lastTime;
      if (elapsedMS > this._maxElapsedMS) {
        elapsedMS = this._maxElapsedMS;
      }
      elapsedMS *= this.speed;
      if (this._minElapsedMS) {
        const delta = currentTime - this._lastFrame | 0;
        if (delta < this._minElapsedMS) {
          return;
        }
        this._lastFrame = currentTime - delta % this._minElapsedMS;
      }
      this.deltaMS = elapsedMS;
      this.deltaTime = this.deltaMS * _Ticker.targetFPMS;
      const head = this._head;
      let listener = head.next;
      while (listener) {
        listener = listener.emit(this.deltaTime);
      }
      if (!head.next) {
        this._cancelIfNeeded();
      }
    } else {
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    }
    this.lastTime = currentTime;
  }
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(fps) {
    const minFPS = Math.min(this.maxFPS, fps);
    const minFPMS = Math.min(Math.max(0, minFPS) / 1e3, _Ticker.targetFPMS);
    this._maxElapsedMS = 1 / minFPMS;
  }
  get maxFPS() {
    if (this._minElapsedMS) {
      return Math.round(1e3 / this._minElapsedMS);
    }
    return 0;
  }
  set maxFPS(fps) {
    if (fps === 0) {
      this._minElapsedMS = 0;
    } else {
      const maxFPS = Math.max(this.minFPS, fps);
      this._minElapsedMS = 1 / (maxFPS / 1e3);
    }
  }
  static get shared() {
    if (!_Ticker._shared) {
      const shared = _Ticker._shared = new _Ticker();
      shared.autoStart = true;
      shared._protected = true;
    }
    return _Ticker._shared;
  }
  static get system() {
    if (!_Ticker._system) {
      const system = _Ticker._system = new _Ticker();
      system.autoStart = true;
      system._protected = true;
    }
    return _Ticker._system;
  }
};
var Ticker = _Ticker;
Ticker.targetFPMS = 0.06;

// ../../node_modules/.pnpm/@pixi+ticker@7.2.4/node_modules/@pixi/ticker/lib/settings.mjs
Object.defineProperties(settings, {
  TARGET_FPMS: {
    get() {
      return Ticker.targetFPMS;
    },
    set(value) {
      deprecation("7.1.0", "settings.TARGET_FPMS is deprecated, use Ticker.targetFPMS");
      Ticker.targetFPMS = value;
    }
  }
});

// ../../node_modules/.pnpm/@pixi+ticker@7.2.4/node_modules/@pixi/ticker/lib/TickerPlugin.mjs
var TickerPlugin = class {
  static init(options) {
    options = Object.assign({
      autoStart: true,
      sharedTicker: false
    }, options);
    Object.defineProperty(this, "ticker", {
      set(ticker) {
        if (this._ticker) {
          this._ticker.remove(this.render, this);
        }
        this._ticker = ticker;
        if (ticker) {
          ticker.add(this.render, this, UPDATE_PRIORITY.LOW);
        }
      },
      get() {
        return this._ticker;
      }
    });
    this.stop = () => {
      this._ticker.stop();
    };
    this.start = () => {
      this._ticker.start();
    };
    this._ticker = null;
    this.ticker = options.sharedTicker ? Ticker.shared : new Ticker();
    if (options.autoStart) {
      this.start();
    }
  }
  static destroy() {
    if (this._ticker) {
      const oldTicker = this._ticker;
      this.ticker = null;
      oldTicker.destroy();
    }
  }
};
TickerPlugin.extension = ExtensionType.Application;
extensions.add(TickerPlugin);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/autoDetectRenderer.mjs
var renderers = [];
extensions.handleByList(ExtensionType.Renderer, renderers);
function autoDetectRenderer(options) {
  for (const RendererType of renderers) {
    if (RendererType.test(options)) {
      return new RendererType(options);
    }
  }
  throw new Error("Unable to auto-detect a suitable renderer.");
}

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/fragments/default.mjs
var $defaultVertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/fragments/defaultFilter.mjs
var $defaultFilterVertex = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/fragments/index.mjs
var defaultVertex4 = $defaultVertex;
var defaultFilterVertex = $defaultFilterVertex;

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/framebuffer/MultisampleSystem.mjs
var MultisampleSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
  }
  contextChange(gl) {
    let samples;
    if (this.renderer.context.webGLVersion === 1) {
      const framebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      samples = gl.getParameter(gl.SAMPLES);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    } else {
      const framebuffer = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
      samples = gl.getParameter(gl.SAMPLES);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, framebuffer);
    }
    if (samples >= MSAA_QUALITY.HIGH) {
      this.multisample = MSAA_QUALITY.HIGH;
    } else if (samples >= MSAA_QUALITY.MEDIUM) {
      this.multisample = MSAA_QUALITY.MEDIUM;
    } else if (samples >= MSAA_QUALITY.LOW) {
      this.multisample = MSAA_QUALITY.LOW;
    } else {
      this.multisample = MSAA_QUALITY.NONE;
    }
  }
  destroy() {
  }
};
MultisampleSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "_multisample"
};
extensions.add(MultisampleSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/geometry/GLBuffer.mjs
var GLBuffer = class {
  constructor(buffer) {
    this.buffer = buffer || null;
    this.updateID = -1;
    this.byteLength = -1;
    this.refCount = 0;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/geometry/BufferSystem.mjs
var BufferSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.managedBuffers = {};
    this.boundBufferBases = {};
  }
  destroy() {
    this.renderer = null;
  }
  contextChange() {
    this.disposeAll(true);
    this.gl = this.renderer.gl;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID;
  }
  bind(buffer) {
    const { gl, CONTEXT_UID } = this;
    const glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
    gl.bindBuffer(buffer.type, glBuffer.buffer);
  }
  unbind(type) {
    const { gl } = this;
    gl.bindBuffer(type, null);
  }
  bindBufferBase(buffer, index) {
    const { gl, CONTEXT_UID } = this;
    if (this.boundBufferBases[index] !== buffer) {
      const glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
      this.boundBufferBases[index] = buffer;
      gl.bindBufferBase(gl.UNIFORM_BUFFER, index, glBuffer.buffer);
    }
  }
  bindBufferRange(buffer, index, offset) {
    const { gl, CONTEXT_UID } = this;
    offset = offset || 0;
    const glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
    gl.bindBufferRange(gl.UNIFORM_BUFFER, index || 0, glBuffer.buffer, offset * 256, 256);
  }
  update(buffer) {
    const { gl, CONTEXT_UID } = this;
    const glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
    if (buffer._updateID === glBuffer.updateID) {
      return;
    }
    glBuffer.updateID = buffer._updateID;
    gl.bindBuffer(buffer.type, glBuffer.buffer);
    if (glBuffer.byteLength >= buffer.data.byteLength) {
      gl.bufferSubData(buffer.type, 0, buffer.data);
    } else {
      const drawType = buffer.static ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
      glBuffer.byteLength = buffer.data.byteLength;
      gl.bufferData(buffer.type, buffer.data, drawType);
    }
  }
  dispose(buffer, contextLost) {
    if (!this.managedBuffers[buffer.id]) {
      return;
    }
    delete this.managedBuffers[buffer.id];
    const glBuffer = buffer._glBuffers[this.CONTEXT_UID];
    const gl = this.gl;
    buffer.disposeRunner.remove(this);
    if (!glBuffer) {
      return;
    }
    if (!contextLost) {
      gl.deleteBuffer(glBuffer.buffer);
    }
    delete buffer._glBuffers[this.CONTEXT_UID];
  }
  disposeAll(contextLost) {
    const all = Object.keys(this.managedBuffers);
    for (let i2 = 0; i2 < all.length; i2++) {
      this.dispose(this.managedBuffers[all[i2]], contextLost);
    }
  }
  createGLBuffer(buffer) {
    const { CONTEXT_UID, gl } = this;
    buffer._glBuffers[CONTEXT_UID] = new GLBuffer(gl.createBuffer());
    this.managedBuffers[buffer.id] = buffer;
    buffer.disposeRunner.add(this);
    return buffer._glBuffers[CONTEXT_UID];
  }
};
BufferSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "buffer"
};
extensions.add(BufferSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/render/ObjectRendererSystem.mjs
var ObjectRendererSystem = class {
  constructor(renderer) {
    this.renderer = renderer;
  }
  render(displayObject, options) {
    const renderer = this.renderer;
    let renderTexture;
    let clear;
    let transform;
    let skipUpdateTransform;
    if (options) {
      renderTexture = options.renderTexture;
      clear = options.clear;
      transform = options.transform;
      skipUpdateTransform = options.skipUpdateTransform;
    }
    this.renderingToScreen = !renderTexture;
    renderer.runners.prerender.emit();
    renderer.emit("prerender");
    renderer.projection.transform = transform;
    if (renderer.context.isLost) {
      return;
    }
    if (!renderTexture) {
      this.lastObjectRendered = displayObject;
    }
    if (!skipUpdateTransform) {
      const cacheParent = displayObject.enableTempParent();
      displayObject.updateTransform();
      displayObject.disableTempParent(cacheParent);
    }
    renderer.renderTexture.bind(renderTexture);
    renderer.batch.currentRenderer.start();
    if (clear ?? renderer.background.clearBeforeRender) {
      renderer.renderTexture.clear();
    }
    displayObject.render(renderer);
    renderer.batch.currentRenderer.flush();
    if (renderTexture) {
      if (options.blit) {
        renderer.framebuffer.blit();
      }
      renderTexture.baseTexture.update();
    }
    renderer.runners.postrender.emit();
    renderer.projection.transform = null;
    renderer.emit("postrender");
  }
  destroy() {
    this.renderer = null;
    this.lastObjectRendered = null;
  }
};
ObjectRendererSystem.extension = {
  type: ExtensionType.RendererSystem,
  name: "objectRenderer"
};
extensions.add(ObjectRendererSystem);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/Renderer.mjs
var _Renderer = class extends SystemManager {
  constructor(options) {
    super();
    this.type = RENDERER_TYPE.WEBGL;
    options = Object.assign({}, settings.RENDER_OPTIONS, options);
    this.gl = null;
    this.CONTEXT_UID = 0;
    this.globalUniforms = new UniformGroup({
      projectionMatrix: new Matrix()
    }, true);
    const systemConfig = {
      runners: [
        "init",
        "destroy",
        "contextChange",
        "resolutionChange",
        "reset",
        "update",
        "postrender",
        "prerender",
        "resize"
      ],
      systems: _Renderer.__systems,
      priority: [
        "_view",
        "textureGenerator",
        "background",
        "_plugin",
        "startup",
        "context",
        "state",
        "texture",
        "buffer",
        "geometry",
        "framebuffer",
        "transformFeedback",
        "mask",
        "scissor",
        "stencil",
        "projection",
        "textureGC",
        "filter",
        "renderTexture",
        "batch",
        "objectRenderer",
        "_multisample"
      ]
    };
    this.setup(systemConfig);
    if ("useContextAlpha" in options) {
      deprecation("7.0.0", "options.useContextAlpha is deprecated, use options.premultipliedAlpha and options.backgroundAlpha instead");
      options.premultipliedAlpha = options.useContextAlpha && options.useContextAlpha !== "notMultiplied";
      options.backgroundAlpha = options.useContextAlpha === false ? 1 : options.backgroundAlpha;
    }
    this._plugin.rendererPlugins = _Renderer.__plugins;
    this.options = options;
    this.startup.run(this.options);
  }
  static test(options) {
    if (options?.forceCanvas) {
      return false;
    }
    return isWebGLSupported();
  }
  render(displayObject, options) {
    this.objectRenderer.render(displayObject, options);
  }
  resize(desiredScreenWidth, desiredScreenHeight) {
    this._view.resizeView(desiredScreenWidth, desiredScreenHeight);
  }
  reset() {
    this.runners.reset.emit();
    return this;
  }
  clear() {
    this.renderTexture.bind();
    this.renderTexture.clear();
  }
  destroy(removeView = false) {
    this.runners.destroy.items.reverse();
    this.emitWithCustomOptions(this.runners.destroy, {
      _view: removeView
    });
    super.destroy();
  }
  get plugins() {
    return this._plugin.plugins;
  }
  get multisample() {
    return this._multisample.multisample;
  }
  get width() {
    return this._view.element.width;
  }
  get height() {
    return this._view.element.height;
  }
  get resolution() {
    return this._view.resolution;
  }
  set resolution(value) {
    this._view.resolution = value;
    this.runners.resolutionChange.emit(value);
  }
  get autoDensity() {
    return this._view.autoDensity;
  }
  get view() {
    return this._view.element;
  }
  get screen() {
    return this._view.screen;
  }
  get lastObjectRendered() {
    return this.objectRenderer.lastObjectRendered;
  }
  get renderingToScreen() {
    return this.objectRenderer.renderingToScreen;
  }
  get rendererLogId() {
    return `WebGL ${this.context.webGLVersion}`;
  }
  get clearBeforeRender() {
    deprecation("7.0.0", "renderer.clearBeforeRender has been deprecated, please use renderer.background.clearBeforeRender instead.");
    return this.background.clearBeforeRender;
  }
  get useContextAlpha() {
    deprecation("7.0.0", "renderer.useContextAlpha has been deprecated, please use renderer.context.premultipliedAlpha instead.");
    return this.context.useContextAlpha;
  }
  get preserveDrawingBuffer() {
    deprecation("7.0.0", "renderer.preserveDrawingBuffer has been deprecated, we cannot truly know this unless pixi created the context");
    return this.context.preserveDrawingBuffer;
  }
  get backgroundColor() {
    deprecation("7.0.0", "renderer.backgroundColor has been deprecated, use renderer.background.color instead.");
    return this.background.color;
  }
  set backgroundColor(value) {
    deprecation("7.0.0", "renderer.backgroundColor has been deprecated, use renderer.background.color instead.");
    this.background.color = value;
  }
  get backgroundAlpha() {
    deprecation("7.0.0", "renderer.backgroundAlpha has been deprecated, use renderer.background.alpha instead.");
    return this.background.alpha;
  }
  set backgroundAlpha(value) {
    deprecation("7.0.0", "renderer.backgroundAlpha has been deprecated, use renderer.background.alpha instead.");
    this.background.alpha = value;
  }
  get powerPreference() {
    deprecation("7.0.0", "renderer.powerPreference has been deprecated, we can only know this if pixi creates the context");
    return this.context.powerPreference;
  }
  generateTexture(displayObject, options) {
    return this.textureGenerator.generateTexture(displayObject, options);
  }
};
var Renderer = _Renderer;
Renderer.extension = {
  type: ExtensionType.Renderer,
  priority: 1
};
Renderer.__plugins = {};
Renderer.__systems = {};
extensions.handleByMap(ExtensionType.RendererPlugin, Renderer.__plugins);
extensions.handleByMap(ExtensionType.RendererSystem, Renderer.__systems);
extensions.add(Renderer);

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/AbstractMultiResource.mjs
var AbstractMultiResource = class extends Resource {
  constructor(length, options) {
    const { width, height } = options || {};
    super(width, height);
    this.items = [];
    this.itemDirtyIds = [];
    for (let i2 = 0; i2 < length; i2++) {
      const partTexture = new BaseTexture();
      this.items.push(partTexture);
      this.itemDirtyIds.push(-2);
    }
    this.length = length;
    this._load = null;
    this.baseTexture = null;
  }
  initFromArray(resources, options) {
    for (let i2 = 0; i2 < this.length; i2++) {
      if (!resources[i2]) {
        continue;
      }
      if (resources[i2].castToBaseTexture) {
        this.addBaseTextureAt(resources[i2].castToBaseTexture(), i2);
      } else if (resources[i2] instanceof Resource) {
        this.addResourceAt(resources[i2], i2);
      } else {
        this.addResourceAt(autoDetectResource(resources[i2], options), i2);
      }
    }
  }
  dispose() {
    for (let i2 = 0, len = this.length; i2 < len; i2++) {
      this.items[i2].destroy();
    }
    this.items = null;
    this.itemDirtyIds = null;
    this._load = null;
  }
  addResourceAt(resource, index) {
    if (!this.items[index]) {
      throw new Error(`Index ${index} is out of bounds`);
    }
    if (resource.valid && !this.valid) {
      this.resize(resource.width, resource.height);
    }
    this.items[index].setResource(resource);
    return this;
  }
  bind(baseTexture) {
    if (this.baseTexture !== null) {
      throw new Error("Only one base texture per TextureArray is allowed");
    }
    super.bind(baseTexture);
    for (let i2 = 0; i2 < this.length; i2++) {
      this.items[i2].parentTextureArray = baseTexture;
      this.items[i2].on("update", baseTexture.update, baseTexture);
    }
  }
  unbind(baseTexture) {
    super.unbind(baseTexture);
    for (let i2 = 0; i2 < this.length; i2++) {
      this.items[i2].parentTextureArray = null;
      this.items[i2].off("update", baseTexture.update, baseTexture);
    }
  }
  load() {
    if (this._load) {
      return this._load;
    }
    const resources = this.items.map((item) => item.resource).filter((item) => item);
    const promises = resources.map((item) => item.load());
    this._load = Promise.all(promises).then(() => {
      const { realWidth, realHeight } = this.items[0];
      this.resize(realWidth, realHeight);
      return Promise.resolve(this);
    });
    return this._load;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/ArrayResource.mjs
var ArrayResource = class extends AbstractMultiResource {
  constructor(source, options) {
    const { width, height } = options || {};
    let urls;
    let length;
    if (Array.isArray(source)) {
      urls = source;
      length = source.length;
    } else {
      length = source;
    }
    super(length, { width, height });
    if (urls) {
      this.initFromArray(urls, options);
    }
  }
  addBaseTextureAt(baseTexture, index) {
    if (baseTexture.resource) {
      this.addResourceAt(baseTexture.resource, index);
    } else {
      throw new Error("ArrayResource does not support RenderTexture");
    }
    return this;
  }
  bind(baseTexture) {
    super.bind(baseTexture);
    baseTexture.target = TARGETS.TEXTURE_2D_ARRAY;
  }
  upload(renderer, texture, glTexture) {
    const { length, itemDirtyIds, items } = this;
    const { gl } = renderer;
    if (glTexture.dirtyId < 0) {
      gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, glTexture.internalFormat, this._width, this._height, length, 0, texture.format, glTexture.type, null);
    }
    for (let i2 = 0; i2 < length; i2++) {
      const item = items[i2];
      if (itemDirtyIds[i2] < item.dirtyId) {
        itemDirtyIds[i2] = item.dirtyId;
        if (item.valid) {
          gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i2, item.resource.width, item.resource.height, 1, texture.format, glTexture.type, item.resource.source);
        }
      }
    }
    return true;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/CanvasResource.mjs
var CanvasResource = class extends BaseImageResource {
  constructor(source) {
    super(source);
  }
  static test(source) {
    const { OffscreenCanvas: OffscreenCanvas2 } = globalThis;
    if (OffscreenCanvas2 && source instanceof OffscreenCanvas2) {
      return true;
    }
    return globalThis.HTMLCanvasElement && source instanceof HTMLCanvasElement;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/CubeResource.mjs
var _CubeResource = class extends AbstractMultiResource {
  constructor(source, options) {
    const { width, height, autoLoad, linkBaseTexture } = options || {};
    if (source && source.length !== _CubeResource.SIDES) {
      throw new Error(`Invalid length. Got ${source.length}, expected 6`);
    }
    super(6, { width, height });
    for (let i2 = 0; i2 < _CubeResource.SIDES; i2++) {
      this.items[i2].target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + i2;
    }
    this.linkBaseTexture = linkBaseTexture !== false;
    if (source) {
      this.initFromArray(source, options);
    }
    if (autoLoad !== false) {
      this.load();
    }
  }
  bind(baseTexture) {
    super.bind(baseTexture);
    baseTexture.target = TARGETS.TEXTURE_CUBE_MAP;
  }
  addBaseTextureAt(baseTexture, index, linkBaseTexture) {
    if (linkBaseTexture === void 0) {
      linkBaseTexture = this.linkBaseTexture;
    }
    if (!this.items[index]) {
      throw new Error(`Index ${index} is out of bounds`);
    }
    if (!this.linkBaseTexture || baseTexture.parentTextureArray || Object.keys(baseTexture._glTextures).length > 0) {
      if (baseTexture.resource) {
        this.addResourceAt(baseTexture.resource, index);
      } else {
        throw new Error(`CubeResource does not support copying of renderTexture.`);
      }
    } else {
      baseTexture.target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index;
      baseTexture.parentTextureArray = this.baseTexture;
      this.items[index] = baseTexture;
    }
    if (baseTexture.valid && !this.valid) {
      this.resize(baseTexture.realWidth, baseTexture.realHeight);
    }
    this.items[index] = baseTexture;
    return this;
  }
  upload(renderer, _baseTexture, glTexture) {
    const dirty = this.itemDirtyIds;
    for (let i2 = 0; i2 < _CubeResource.SIDES; i2++) {
      const side = this.items[i2];
      if (dirty[i2] < side.dirtyId || glTexture.dirtyId < _baseTexture.dirtyId) {
        if (side.valid && side.resource) {
          side.resource.upload(renderer, side, glTexture);
          dirty[i2] = side.dirtyId;
        } else if (dirty[i2] < -1) {
          renderer.gl.texImage2D(side.target, 0, glTexture.internalFormat, _baseTexture.realWidth, _baseTexture.realHeight, 0, _baseTexture.format, glTexture.type, null);
          dirty[i2] = -1;
        }
      }
    }
    return true;
  }
  static test(source) {
    return Array.isArray(source) && source.length === _CubeResource.SIDES;
  }
};
var CubeResource = _CubeResource;
CubeResource.SIDES = 6;

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/ImageBitmapResource.mjs
var ImageBitmapResource = class extends BaseImageResource {
  constructor(source, options) {
    options = options || {};
    let baseSource;
    let url2;
    if (typeof source === "string") {
      baseSource = ImageBitmapResource.EMPTY;
      url2 = source;
    } else {
      baseSource = source;
      url2 = null;
    }
    super(baseSource);
    this.url = url2;
    this.crossOrigin = options.crossOrigin ?? true;
    this.alphaMode = typeof options.alphaMode === "number" ? options.alphaMode : null;
    this._load = null;
    if (options.autoLoad !== false) {
      this.load();
    }
  }
  load() {
    if (this._load) {
      return this._load;
    }
    this._load = new Promise(async (resolve2, reject) => {
      if (this.url === null) {
        resolve2(this);
        return;
      }
      try {
        const response = await settings.ADAPTER.fetch(this.url, {
          mode: this.crossOrigin ? "cors" : "no-cors"
        });
        if (this.destroyed)
          return;
        const imageBlob = await response.blob();
        if (this.destroyed)
          return;
        const imageBitmap = await createImageBitmap(imageBlob, {
          premultiplyAlpha: this.alphaMode === null || this.alphaMode === ALPHA_MODES.UNPACK ? "premultiply" : "none"
        });
        if (this.destroyed)
          return;
        this.source = imageBitmap;
        this.update();
        resolve2(this);
      } catch (e3) {
        if (this.destroyed)
          return;
        reject(e3);
        this.onError.emit(e3);
      }
    });
    return this._load;
  }
  upload(renderer, baseTexture, glTexture) {
    if (!(this.source instanceof ImageBitmap)) {
      this.load();
      return false;
    }
    if (typeof this.alphaMode === "number") {
      baseTexture.alphaMode = this.alphaMode;
    }
    return super.upload(renderer, baseTexture, glTexture);
  }
  dispose() {
    if (this.source instanceof ImageBitmap) {
      this.source.close();
    }
    super.dispose();
    this._load = null;
  }
  static test(source) {
    return !!globalThis.createImageBitmap && typeof ImageBitmap !== "undefined" && (typeof source === "string" || source instanceof ImageBitmap);
  }
  static get EMPTY() {
    ImageBitmapResource._EMPTY = ImageBitmapResource._EMPTY ?? settings.ADAPTER.createCanvas(0, 0);
    return ImageBitmapResource._EMPTY;
  }
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/SVGResource.mjs
var _SVGResource = class extends BaseImageResource {
  constructor(sourceBase64, options) {
    options = options || {};
    super(settings.ADAPTER.createCanvas());
    this._width = 0;
    this._height = 0;
    this.svg = sourceBase64;
    this.scale = options.scale || 1;
    this._overrideWidth = options.width;
    this._overrideHeight = options.height;
    this._resolve = null;
    this._crossorigin = options.crossorigin;
    this._load = null;
    if (options.autoLoad !== false) {
      this.load();
    }
  }
  load() {
    if (this._load) {
      return this._load;
    }
    this._load = new Promise((resolve2) => {
      this._resolve = () => {
        this.resize(this.source.width, this.source.height);
        resolve2(this);
      };
      if (_SVGResource.SVG_XML.test(this.svg.trim())) {
        if (!btoa) {
          throw new Error("Your browser doesn't support base64 conversions.");
        }
        this.svg = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(this.svg)))}`;
      }
      this._loadSvg();
    });
    return this._load;
  }
  _loadSvg() {
    const tempImage = new Image();
    BaseImageResource.crossOrigin(tempImage, this.svg, this._crossorigin);
    tempImage.src = this.svg;
    tempImage.onerror = (event) => {
      if (!this._resolve) {
        return;
      }
      tempImage.onerror = null;
      this.onError.emit(event);
    };
    tempImage.onload = () => {
      if (!this._resolve) {
        return;
      }
      const svgWidth = tempImage.width;
      const svgHeight = tempImage.height;
      if (!svgWidth || !svgHeight) {
        throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
      }
      let width = svgWidth * this.scale;
      let height = svgHeight * this.scale;
      if (this._overrideWidth || this._overrideHeight) {
        width = this._overrideWidth || this._overrideHeight / svgHeight * svgWidth;
        height = this._overrideHeight || this._overrideWidth / svgWidth * svgHeight;
      }
      width = Math.round(width);
      height = Math.round(height);
      const canvas = this.source;
      canvas.width = width;
      canvas.height = height;
      canvas._pixiId = `canvas_${uid()}`;
      canvas.getContext("2d").drawImage(tempImage, 0, 0, svgWidth, svgHeight, 0, 0, width, height);
      this._resolve();
      this._resolve = null;
    };
  }
  static getSize(svgString) {
    const sizeMatch = _SVGResource.SVG_SIZE.exec(svgString);
    const size = {};
    if (sizeMatch) {
      size[sizeMatch[1]] = Math.round(parseFloat(sizeMatch[3]));
      size[sizeMatch[5]] = Math.round(parseFloat(sizeMatch[7]));
    }
    return size;
  }
  dispose() {
    super.dispose();
    this._resolve = null;
    this._crossorigin = null;
  }
  static test(source, extension) {
    return extension === "svg" || typeof source === "string" && source.startsWith("data:image/svg+xml") || typeof source === "string" && _SVGResource.SVG_XML.test(source);
  }
};
var SVGResource = _SVGResource;
SVGResource.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m;
SVGResource.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i;

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/VideoResource.mjs
var _VideoResource = class extends BaseImageResource {
  constructor(source, options) {
    options = options || {};
    if (!(source instanceof HTMLVideoElement)) {
      const videoElement = document.createElement("video");
      videoElement.setAttribute("preload", "auto");
      videoElement.setAttribute("webkit-playsinline", "");
      videoElement.setAttribute("playsinline", "");
      if (typeof source === "string") {
        source = [source];
      }
      const firstSrc = source[0].src || source[0];
      BaseImageResource.crossOrigin(videoElement, firstSrc, options.crossorigin);
      for (let i2 = 0; i2 < source.length; ++i2) {
        const sourceElement = document.createElement("source");
        let { src, mime } = source[i2];
        src = src || source[i2];
        const baseSrc = src.split("?").shift().toLowerCase();
        const ext = baseSrc.slice(baseSrc.lastIndexOf(".") + 1);
        mime = mime || _VideoResource.MIME_TYPES[ext] || `video/${ext}`;
        sourceElement.src = src;
        sourceElement.type = mime;
        videoElement.appendChild(sourceElement);
      }
      source = videoElement;
    }
    super(source);
    this.noSubImage = true;
    this._autoUpdate = true;
    this._isConnectedToTicker = false;
    this._updateFPS = options.updateFPS || 0;
    this._msToNextUpdate = 0;
    this.autoPlay = options.autoPlay !== false;
    this._load = null;
    this._resolve = null;
    this._onCanPlay = this._onCanPlay.bind(this);
    this._onError = this._onError.bind(this);
    if (options.autoLoad !== false) {
      this.load();
    }
  }
  update(_deltaTime = 0) {
    if (!this.destroyed) {
      const elapsedMS = Ticker.shared.elapsedMS * this.source.playbackRate;
      this._msToNextUpdate = Math.floor(this._msToNextUpdate - elapsedMS);
      if (!this._updateFPS || this._msToNextUpdate <= 0) {
        super.update();
        this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0;
      }
    }
  }
  load() {
    if (this._load) {
      return this._load;
    }
    const source = this.source;
    if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height) {
      source.complete = true;
    }
    source.addEventListener("play", this._onPlayStart.bind(this));
    source.addEventListener("pause", this._onPlayStop.bind(this));
    if (!this._isSourceReady()) {
      source.addEventListener("canplay", this._onCanPlay);
      source.addEventListener("canplaythrough", this._onCanPlay);
      source.addEventListener("error", this._onError, true);
    } else {
      this._onCanPlay();
    }
    this._load = new Promise((resolve2) => {
      if (this.valid) {
        resolve2(this);
      } else {
        this._resolve = resolve2;
        source.load();
      }
    });
    return this._load;
  }
  _onError(event) {
    this.source.removeEventListener("error", this._onError, true);
    this.onError.emit(event);
  }
  _isSourcePlaying() {
    const source = this.source;
    return !source.paused && !source.ended && this._isSourceReady();
  }
  _isSourceReady() {
    const source = this.source;
    return source.readyState > 2;
  }
  _onPlayStart() {
    if (!this.valid) {
      this._onCanPlay();
    }
    if (this.autoUpdate && !this._isConnectedToTicker) {
      Ticker.shared.add(this.update, this);
      this._isConnectedToTicker = true;
    }
  }
  _onPlayStop() {
    if (this._isConnectedToTicker) {
      Ticker.shared.remove(this.update, this);
      this._isConnectedToTicker = false;
    }
  }
  _onCanPlay() {
    const source = this.source;
    source.removeEventListener("canplay", this._onCanPlay);
    source.removeEventListener("canplaythrough", this._onCanPlay);
    const valid = this.valid;
    this.resize(source.videoWidth, source.videoHeight);
    if (!valid && this._resolve) {
      this._resolve(this);
      this._resolve = null;
    }
    if (this._isSourcePlaying()) {
      this._onPlayStart();
    } else if (this.autoPlay) {
      source.play();
    }
  }
  dispose() {
    if (this._isConnectedToTicker) {
      Ticker.shared.remove(this.update, this);
      this._isConnectedToTicker = false;
    }
    const source = this.source;
    if (source) {
      source.removeEventListener("error", this._onError, true);
      source.pause();
      source.src = "";
      source.load();
    }
    super.dispose();
  }
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(value) {
    if (value !== this._autoUpdate) {
      this._autoUpdate = value;
      if (!this._autoUpdate && this._isConnectedToTicker) {
        Ticker.shared.remove(this.update, this);
        this._isConnectedToTicker = false;
      } else if (this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying()) {
        Ticker.shared.add(this.update, this);
        this._isConnectedToTicker = true;
      }
    }
  }
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(value) {
    if (value !== this._updateFPS) {
      this._updateFPS = value;
    }
  }
  static test(source, extension) {
    return globalThis.HTMLVideoElement && source instanceof HTMLVideoElement || _VideoResource.TYPES.includes(extension);
  }
};
var VideoResource = _VideoResource;
VideoResource.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"];
VideoResource.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};

// ../../node_modules/.pnpm/@pixi+core@7.2.4/node_modules/@pixi/core/lib/textures/resources/index.mjs
INSTALLED.push(ImageBitmapResource, ImageResource, CanvasResource, VideoResource, SVGResource, BufferResource, CubeResource, ArrayResource);

// ../../node_modules/.pnpm/@pixi+display@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/display/lib/Bounds.mjs
var Bounds = class {
  constructor() {
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
    this.rect = null;
    this.updateID = -1;
  }
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  clear() {
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
  }
  getRectangle(rect) {
    if (this.minX > this.maxX || this.minY > this.maxY) {
      return Rectangle.EMPTY;
    }
    rect = rect || new Rectangle(0, 0, 1, 1);
    rect.x = this.minX;
    rect.y = this.minY;
    rect.width = this.maxX - this.minX;
    rect.height = this.maxY - this.minY;
    return rect;
  }
  addPoint(point) {
    this.minX = Math.min(this.minX, point.x);
    this.maxX = Math.max(this.maxX, point.x);
    this.minY = Math.min(this.minY, point.y);
    this.maxY = Math.max(this.maxY, point.y);
  }
  addPointMatrix(matrix, point) {
    const { a: a2, b: b3, c: c2, d: d2, tx, ty } = matrix;
    const x2 = a2 * point.x + c2 * point.y + tx;
    const y2 = b3 * point.x + d2 * point.y + ty;
    this.minX = Math.min(this.minX, x2);
    this.maxX = Math.max(this.maxX, x2);
    this.minY = Math.min(this.minY, y2);
    this.maxY = Math.max(this.maxY, y2);
  }
  addQuad(vertices) {
    let minX = this.minX;
    let minY = this.minY;
    let maxX = this.maxX;
    let maxY = this.maxY;
    let x2 = vertices[0];
    let y2 = vertices[1];
    minX = x2 < minX ? x2 : minX;
    minY = y2 < minY ? y2 : minY;
    maxX = x2 > maxX ? x2 : maxX;
    maxY = y2 > maxY ? y2 : maxY;
    x2 = vertices[2];
    y2 = vertices[3];
    minX = x2 < minX ? x2 : minX;
    minY = y2 < minY ? y2 : minY;
    maxX = x2 > maxX ? x2 : maxX;
    maxY = y2 > maxY ? y2 : maxY;
    x2 = vertices[4];
    y2 = vertices[5];
    minX = x2 < minX ? x2 : minX;
    minY = y2 < minY ? y2 : minY;
    maxX = x2 > maxX ? x2 : maxX;
    maxY = y2 > maxY ? y2 : maxY;
    x2 = vertices[6];
    y2 = vertices[7];
    minX = x2 < minX ? x2 : minX;
    minY = y2 < minY ? y2 : minY;
    maxX = x2 > maxX ? x2 : maxX;
    maxY = y2 > maxY ? y2 : maxY;
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  addFrame(transform, x0, y0, x1, y1) {
    this.addFrameMatrix(transform.worldTransform, x0, y0, x1, y1);
  }
  addFrameMatrix(matrix, x0, y0, x1, y1) {
    const a2 = matrix.a;
    const b3 = matrix.b;
    const c2 = matrix.c;
    const d2 = matrix.d;
    const tx = matrix.tx;
    const ty = matrix.ty;
    let minX = this.minX;
    let minY = this.minY;
    let maxX = this.maxX;
    let maxY = this.maxY;
    let x2 = a2 * x0 + c2 * y0 + tx;
    let y2 = b3 * x0 + d2 * y0 + ty;
    minX = x2 < minX ? x2 : minX;
    minY = y2 < minY ? y2 : minY;
    maxX = x2 > maxX ? x2 : maxX;
    maxY = y2 > maxY ? y2 : maxY;
    x2 = a2 * x1 + c2 * y0 + tx;
    y2 = b3 * x1 + d2 * y0 + ty;
    minX = x2 < minX ? x2 : minX;
    minY = y2 < minY ? y2 : minY;
    maxX = x2 > maxX ? x2 : maxX;
    maxY = y2 > maxY ? y2 : maxY;
    x2 = a2 * x0 + c2 * y1 + tx;
    y2 = b3 * x0 + d2 * y1 + ty;
    minX = x2 < minX ? x2 : minX;
    minY = y2 < minY ? y2 : minY;
    maxX = x2 > maxX ? x2 : maxX;
    maxY = y2 > maxY ? y2 : maxY;
    x2 = a2 * x1 + c2 * y1 + tx;
    y2 = b3 * x1 + d2 * y1 + ty;
    minX = x2 < minX ? x2 : minX;
    minY = y2 < minY ? y2 : minY;
    maxX = x2 > maxX ? x2 : maxX;
    maxY = y2 > maxY ? y2 : maxY;
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  addVertexData(vertexData, beginOffset, endOffset) {
    let minX = this.minX;
    let minY = this.minY;
    let maxX = this.maxX;
    let maxY = this.maxY;
    for (let i2 = beginOffset; i2 < endOffset; i2 += 2) {
      const x2 = vertexData[i2];
      const y2 = vertexData[i2 + 1];
      minX = x2 < minX ? x2 : minX;
      minY = y2 < minY ? y2 : minY;
      maxX = x2 > maxX ? x2 : maxX;
      maxY = y2 > maxY ? y2 : maxY;
    }
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  addVertices(transform, vertices, beginOffset, endOffset) {
    this.addVerticesMatrix(transform.worldTransform, vertices, beginOffset, endOffset);
  }
  addVerticesMatrix(matrix, vertices, beginOffset, endOffset, padX = 0, padY = padX) {
    const a2 = matrix.a;
    const b3 = matrix.b;
    const c2 = matrix.c;
    const d2 = matrix.d;
    const tx = matrix.tx;
    const ty = matrix.ty;
    let minX = this.minX;
    let minY = this.minY;
    let maxX = this.maxX;
    let maxY = this.maxY;
    for (let i2 = beginOffset; i2 < endOffset; i2 += 2) {
      const rawX = vertices[i2];
      const rawY = vertices[i2 + 1];
      const x2 = a2 * rawX + c2 * rawY + tx;
      const y2 = d2 * rawY + b3 * rawX + ty;
      minX = Math.min(minX, x2 - padX);
      maxX = Math.max(maxX, x2 + padX);
      minY = Math.min(minY, y2 - padY);
      maxY = Math.max(maxY, y2 + padY);
    }
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  addBounds(bounds) {
    const minX = this.minX;
    const minY = this.minY;
    const maxX = this.maxX;
    const maxY = this.maxY;
    this.minX = bounds.minX < minX ? bounds.minX : minX;
    this.minY = bounds.minY < minY ? bounds.minY : minY;
    this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
    this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
  }
  addBoundsMask(bounds, mask) {
    const _minX = bounds.minX > mask.minX ? bounds.minX : mask.minX;
    const _minY = bounds.minY > mask.minY ? bounds.minY : mask.minY;
    const _maxX = bounds.maxX < mask.maxX ? bounds.maxX : mask.maxX;
    const _maxY = bounds.maxY < mask.maxY ? bounds.maxY : mask.maxY;
    if (_minX <= _maxX && _minY <= _maxY) {
      const minX = this.minX;
      const minY = this.minY;
      const maxX = this.maxX;
      const maxY = this.maxY;
      this.minX = _minX < minX ? _minX : minX;
      this.minY = _minY < minY ? _minY : minY;
      this.maxX = _maxX > maxX ? _maxX : maxX;
      this.maxY = _maxY > maxY ? _maxY : maxY;
    }
  }
  addBoundsMatrix(bounds, matrix) {
    this.addFrameMatrix(matrix, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
  }
  addBoundsArea(bounds, area) {
    const _minX = bounds.minX > area.x ? bounds.minX : area.x;
    const _minY = bounds.minY > area.y ? bounds.minY : area.y;
    const _maxX = bounds.maxX < area.x + area.width ? bounds.maxX : area.x + area.width;
    const _maxY = bounds.maxY < area.y + area.height ? bounds.maxY : area.y + area.height;
    if (_minX <= _maxX && _minY <= _maxY) {
      const minX = this.minX;
      const minY = this.minY;
      const maxX = this.maxX;
      const maxY = this.maxY;
      this.minX = _minX < minX ? _minX : minX;
      this.minY = _minY < minY ? _minY : minY;
      this.maxX = _maxX > maxX ? _maxX : maxX;
      this.maxY = _maxY > maxY ? _maxY : maxY;
    }
  }
  pad(paddingX = 0, paddingY = paddingX) {
    if (!this.isEmpty()) {
      this.minX -= paddingX;
      this.maxX += paddingX;
      this.minY -= paddingY;
      this.maxY += paddingY;
    }
  }
  addFramePad(x0, y0, x1, y1, padX, padY) {
    x0 -= padX;
    y0 -= padY;
    x1 += padX;
    y1 += padY;
    this.minX = this.minX < x0 ? this.minX : x0;
    this.maxX = this.maxX > x1 ? this.maxX : x1;
    this.minY = this.minY < y0 ? this.minY : y0;
    this.maxY = this.maxY > y1 ? this.maxY : y1;
  }
};

// ../../node_modules/.pnpm/@pixi+display@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/display/lib/DisplayObject.mjs
var DisplayObject = class extends lib_exports.EventEmitter {
  constructor() {
    super();
    this.tempDisplayObjectParent = null;
    this.transform = new Transform();
    this.alpha = 1;
    this.visible = true;
    this.renderable = true;
    this.cullable = false;
    this.cullArea = null;
    this.parent = null;
    this.worldAlpha = 1;
    this._lastSortedIndex = 0;
    this._zIndex = 0;
    this.filterArea = null;
    this.filters = null;
    this._enabledFilters = null;
    this._bounds = new Bounds();
    this._localBounds = null;
    this._boundsID = 0;
    this._boundsRect = null;
    this._localBoundsRect = null;
    this._mask = null;
    this._maskRefCount = 0;
    this._destroyed = false;
    this.isSprite = false;
    this.isMask = false;
  }
  static mixin(source) {
    const keys = Object.keys(source);
    for (let i2 = 0; i2 < keys.length; ++i2) {
      const propertyName = keys[i2];
      Object.defineProperty(DisplayObject.prototype, propertyName, Object.getOwnPropertyDescriptor(source, propertyName));
    }
  }
  get destroyed() {
    return this._destroyed;
  }
  _recursivePostUpdateTransform() {
    if (this.parent) {
      this.parent._recursivePostUpdateTransform();
      this.transform.updateTransform(this.parent.transform);
    } else {
      this.transform.updateTransform(this._tempDisplayObjectParent.transform);
    }
  }
  updateTransform() {
    this._boundsID++;
    this.transform.updateTransform(this.parent.transform);
    this.worldAlpha = this.alpha * this.parent.worldAlpha;
  }
  getBounds(skipUpdate, rect) {
    if (!skipUpdate) {
      if (!this.parent) {
        this.parent = this._tempDisplayObjectParent;
        this.updateTransform();
        this.parent = null;
      } else {
        this._recursivePostUpdateTransform();
        this.updateTransform();
      }
    }
    if (this._bounds.updateID !== this._boundsID) {
      this.calculateBounds();
      this._bounds.updateID = this._boundsID;
    }
    if (!rect) {
      if (!this._boundsRect) {
        this._boundsRect = new Rectangle();
      }
      rect = this._boundsRect;
    }
    return this._bounds.getRectangle(rect);
  }
  getLocalBounds(rect) {
    if (!rect) {
      if (!this._localBoundsRect) {
        this._localBoundsRect = new Rectangle();
      }
      rect = this._localBoundsRect;
    }
    if (!this._localBounds) {
      this._localBounds = new Bounds();
    }
    const transformRef = this.transform;
    const parentRef = this.parent;
    this.parent = null;
    this.transform = this._tempDisplayObjectParent.transform;
    const worldBounds = this._bounds;
    const worldBoundsID = this._boundsID;
    this._bounds = this._localBounds;
    const bounds = this.getBounds(false, rect);
    this.parent = parentRef;
    this.transform = transformRef;
    this._bounds = worldBounds;
    this._bounds.updateID += this._boundsID - worldBoundsID;
    return bounds;
  }
  toGlobal(position, point, skipUpdate = false) {
    if (!skipUpdate) {
      this._recursivePostUpdateTransform();
      if (!this.parent) {
        this.parent = this._tempDisplayObjectParent;
        this.displayObjectUpdateTransform();
        this.parent = null;
      } else {
        this.displayObjectUpdateTransform();
      }
    }
    return this.worldTransform.apply(position, point);
  }
  toLocal(position, from, point, skipUpdate) {
    if (from) {
      position = from.toGlobal(position, point, skipUpdate);
    }
    if (!skipUpdate) {
      this._recursivePostUpdateTransform();
      if (!this.parent) {
        this.parent = this._tempDisplayObjectParent;
        this.displayObjectUpdateTransform();
        this.parent = null;
      } else {
        this.displayObjectUpdateTransform();
      }
    }
    return this.worldTransform.applyInverse(position, point);
  }
  setParent(container) {
    if (!container || !container.addChild) {
      throw new Error("setParent: Argument must be a Container");
    }
    container.addChild(this);
    return container;
  }
  removeFromParent() {
    this.parent?.removeChild(this);
  }
  setTransform(x2 = 0, y2 = 0, scaleX = 1, scaleY = 1, rotation = 0, skewX = 0, skewY = 0, pivotX = 0, pivotY = 0) {
    this.position.x = x2;
    this.position.y = y2;
    this.scale.x = !scaleX ? 1 : scaleX;
    this.scale.y = !scaleY ? 1 : scaleY;
    this.rotation = rotation;
    this.skew.x = skewX;
    this.skew.y = skewY;
    this.pivot.x = pivotX;
    this.pivot.y = pivotY;
    return this;
  }
  destroy(_options) {
    this.removeFromParent();
    this._destroyed = true;
    this.transform = null;
    this.parent = null;
    this._bounds = null;
    this.mask = null;
    this.cullArea = null;
    this.filters = null;
    this.filterArea = null;
    this.hitArea = null;
    this.eventMode = "auto";
    this.interactiveChildren = false;
    this.emit("destroyed");
    this.removeAllListeners();
  }
  get _tempDisplayObjectParent() {
    if (this.tempDisplayObjectParent === null) {
      this.tempDisplayObjectParent = new TemporaryDisplayObject();
    }
    return this.tempDisplayObjectParent;
  }
  enableTempParent() {
    const myParent = this.parent;
    this.parent = this._tempDisplayObjectParent;
    return myParent;
  }
  disableTempParent(cacheParent) {
    this.parent = cacheParent;
  }
  get x() {
    return this.position.x;
  }
  set x(value) {
    this.transform.position.x = value;
  }
  get y() {
    return this.position.y;
  }
  set y(value) {
    this.transform.position.y = value;
  }
  get worldTransform() {
    return this.transform.worldTransform;
  }
  get localTransform() {
    return this.transform.localTransform;
  }
  get position() {
    return this.transform.position;
  }
  set position(value) {
    this.transform.position.copyFrom(value);
  }
  get scale() {
    return this.transform.scale;
  }
  set scale(value) {
    this.transform.scale.copyFrom(value);
  }
  get pivot() {
    return this.transform.pivot;
  }
  set pivot(value) {
    this.transform.pivot.copyFrom(value);
  }
  get skew() {
    return this.transform.skew;
  }
  set skew(value) {
    this.transform.skew.copyFrom(value);
  }
  get rotation() {
    return this.transform.rotation;
  }
  set rotation(value) {
    this.transform.rotation = value;
  }
  get angle() {
    return this.transform.rotation * RAD_TO_DEG;
  }
  set angle(value) {
    this.transform.rotation = value * DEG_TO_RAD;
  }
  get zIndex() {
    return this._zIndex;
  }
  set zIndex(value) {
    this._zIndex = value;
    if (this.parent) {
      this.parent.sortDirty = true;
    }
  }
  get worldVisible() {
    let item = this;
    do {
      if (!item.visible) {
        return false;
      }
      item = item.parent;
    } while (item);
    return true;
  }
  get mask() {
    return this._mask;
  }
  set mask(value) {
    if (this._mask === value) {
      return;
    }
    if (this._mask) {
      const maskObject = this._mask.isMaskData ? this._mask.maskObject : this._mask;
      if (maskObject) {
        maskObject._maskRefCount--;
        if (maskObject._maskRefCount === 0) {
          maskObject.renderable = true;
          maskObject.isMask = false;
        }
      }
    }
    this._mask = value;
    if (this._mask) {
      const maskObject = this._mask.isMaskData ? this._mask.maskObject : this._mask;
      if (maskObject) {
        if (maskObject._maskRefCount === 0) {
          maskObject.renderable = false;
          maskObject.isMask = true;
        }
        maskObject._maskRefCount++;
      }
    }
  }
};
var TemporaryDisplayObject = class extends DisplayObject {
  constructor() {
    super(...arguments);
    this.sortDirty = null;
  }
};
DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;

// ../../node_modules/.pnpm/@pixi+display@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/display/lib/Container.mjs
var tempMatrix3 = new Matrix();
function sortChildren(a2, b3) {
  if (a2.zIndex === b3.zIndex) {
    return a2._lastSortedIndex - b3._lastSortedIndex;
  }
  return a2.zIndex - b3.zIndex;
}
var _Container = class extends DisplayObject {
  constructor() {
    super();
    this.children = [];
    this.sortableChildren = _Container.defaultSortableChildren;
    this.sortDirty = false;
  }
  onChildrenChange(_length) {
  }
  addChild(...children) {
    if (children.length > 1) {
      for (let i2 = 0; i2 < children.length; i2++) {
        this.addChild(children[i2]);
      }
    } else {
      const child = children[0];
      if (child.parent) {
        child.parent.removeChild(child);
      }
      child.parent = this;
      this.sortDirty = true;
      child.transform._parentID = -1;
      this.children.push(child);
      this._boundsID++;
      this.onChildrenChange(this.children.length - 1);
      this.emit("childAdded", child, this, this.children.length - 1);
      child.emit("added", this);
    }
    return children[0];
  }
  addChildAt(child, index) {
    if (index < 0 || index > this.children.length) {
      throw new Error(`${child}addChildAt: The index ${index} supplied is out of bounds ${this.children.length}`);
    }
    if (child.parent) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    this.sortDirty = true;
    child.transform._parentID = -1;
    this.children.splice(index, 0, child);
    this._boundsID++;
    this.onChildrenChange(index);
    child.emit("added", this);
    this.emit("childAdded", child, this, index);
    return child;
  }
  swapChildren(child, child2) {
    if (child === child2) {
      return;
    }
    const index1 = this.getChildIndex(child);
    const index2 = this.getChildIndex(child2);
    this.children[index1] = child2;
    this.children[index2] = child;
    this.onChildrenChange(index1 < index2 ? index1 : index2);
  }
  getChildIndex(child) {
    const index = this.children.indexOf(child);
    if (index === -1) {
      throw new Error("The supplied DisplayObject must be a child of the caller");
    }
    return index;
  }
  setChildIndex(child, index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error(`The index ${index} supplied is out of bounds ${this.children.length}`);
    }
    const currentIndex = this.getChildIndex(child);
    lib_exports.removeItems(this.children, currentIndex, 1);
    this.children.splice(index, 0, child);
    this.onChildrenChange(index);
  }
  getChildAt(index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error(`getChildAt: Index (${index}) does not exist.`);
    }
    return this.children[index];
  }
  removeChild(...children) {
    if (children.length > 1) {
      for (let i2 = 0; i2 < children.length; i2++) {
        this.removeChild(children[i2]);
      }
    } else {
      const child = children[0];
      const index = this.children.indexOf(child);
      if (index === -1)
        return null;
      child.parent = null;
      child.transform._parentID = -1;
      lib_exports.removeItems(this.children, index, 1);
      this._boundsID++;
      this.onChildrenChange(index);
      child.emit("removed", this);
      this.emit("childRemoved", child, this, index);
    }
    return children[0];
  }
  removeChildAt(index) {
    const child = this.getChildAt(index);
    child.parent = null;
    child.transform._parentID = -1;
    lib_exports.removeItems(this.children, index, 1);
    this._boundsID++;
    this.onChildrenChange(index);
    child.emit("removed", this);
    this.emit("childRemoved", child, this, index);
    return child;
  }
  removeChildren(beginIndex = 0, endIndex = this.children.length) {
    const begin = beginIndex;
    const end = endIndex;
    const range = end - begin;
    let removed;
    if (range > 0 && range <= end) {
      removed = this.children.splice(begin, range);
      for (let i2 = 0; i2 < removed.length; ++i2) {
        removed[i2].parent = null;
        if (removed[i2].transform) {
          removed[i2].transform._parentID = -1;
        }
      }
      this._boundsID++;
      this.onChildrenChange(beginIndex);
      for (let i2 = 0; i2 < removed.length; ++i2) {
        removed[i2].emit("removed", this);
        this.emit("childRemoved", removed[i2], this, i2);
      }
      return removed;
    } else if (range === 0 && this.children.length === 0) {
      return [];
    }
    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  }
  sortChildren() {
    let sortRequired = false;
    for (let i2 = 0, j3 = this.children.length; i2 < j3; ++i2) {
      const child = this.children[i2];
      child._lastSortedIndex = i2;
      if (!sortRequired && child.zIndex !== 0) {
        sortRequired = true;
      }
    }
    if (sortRequired && this.children.length > 1) {
      this.children.sort(sortChildren);
    }
    this.sortDirty = false;
  }
  updateTransform() {
    if (this.sortableChildren && this.sortDirty) {
      this.sortChildren();
    }
    this._boundsID++;
    this.transform.updateTransform(this.parent.transform);
    this.worldAlpha = this.alpha * this.parent.worldAlpha;
    for (let i2 = 0, j3 = this.children.length; i2 < j3; ++i2) {
      const child = this.children[i2];
      if (child.visible) {
        child.updateTransform();
      }
    }
  }
  calculateBounds() {
    this._bounds.clear();
    this._calculateBounds();
    for (let i2 = 0; i2 < this.children.length; i2++) {
      const child = this.children[i2];
      if (!child.visible || !child.renderable) {
        continue;
      }
      child.calculateBounds();
      if (child._mask) {
        const maskObject = child._mask.isMaskData ? child._mask.maskObject : child._mask;
        if (maskObject) {
          maskObject.calculateBounds();
          this._bounds.addBoundsMask(child._bounds, maskObject._bounds);
        } else {
          this._bounds.addBounds(child._bounds);
        }
      } else if (child.filterArea) {
        this._bounds.addBoundsArea(child._bounds, child.filterArea);
      } else {
        this._bounds.addBounds(child._bounds);
      }
    }
    this._bounds.updateID = this._boundsID;
  }
  getLocalBounds(rect, skipChildrenUpdate = false) {
    const result = super.getLocalBounds(rect);
    if (!skipChildrenUpdate) {
      for (let i2 = 0, j3 = this.children.length; i2 < j3; ++i2) {
        const child = this.children[i2];
        if (child.visible) {
          child.updateTransform();
        }
      }
    }
    return result;
  }
  _calculateBounds() {
  }
  _renderWithCulling(renderer) {
    const sourceFrame = renderer.renderTexture.sourceFrame;
    if (!(sourceFrame.width > 0 && sourceFrame.height > 0)) {
      return;
    }
    let bounds;
    let transform;
    if (this.cullArea) {
      bounds = this.cullArea;
      transform = this.worldTransform;
    } else if (this._render !== _Container.prototype._render) {
      bounds = this.getBounds(true);
    }
    const projectionTransform = renderer.projection.transform;
    if (projectionTransform) {
      if (transform) {
        transform = tempMatrix3.copyFrom(transform);
        transform.prepend(projectionTransform);
      } else {
        transform = projectionTransform;
      }
    }
    if (bounds && sourceFrame.intersects(bounds, transform)) {
      this._render(renderer);
    } else if (this.cullArea) {
      return;
    }
    for (let i2 = 0, j3 = this.children.length; i2 < j3; ++i2) {
      const child = this.children[i2];
      const childCullable = child.cullable;
      child.cullable = childCullable || !this.cullArea;
      child.render(renderer);
      child.cullable = childCullable;
    }
  }
  render(renderer) {
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
      return;
    }
    if (this._mask || this.filters?.length) {
      this.renderAdvanced(renderer);
    } else if (this.cullable) {
      this._renderWithCulling(renderer);
    } else {
      this._render(renderer);
      for (let i2 = 0, j3 = this.children.length; i2 < j3; ++i2) {
        this.children[i2].render(renderer);
      }
    }
  }
  renderAdvanced(renderer) {
    const filters2 = this.filters;
    const mask = this._mask;
    if (filters2) {
      if (!this._enabledFilters) {
        this._enabledFilters = [];
      }
      this._enabledFilters.length = 0;
      for (let i2 = 0; i2 < filters2.length; i2++) {
        if (filters2[i2].enabled) {
          this._enabledFilters.push(filters2[i2]);
        }
      }
    }
    const flush = filters2 && this._enabledFilters?.length || mask && (!mask.isMaskData || mask.enabled && (mask.autoDetect || mask.type !== MASK_TYPES.NONE));
    if (flush) {
      renderer.batch.flush();
    }
    if (filters2 && this._enabledFilters?.length) {
      renderer.filter.push(this, this._enabledFilters);
    }
    if (mask) {
      renderer.mask.push(this, this._mask);
    }
    if (this.cullable) {
      this._renderWithCulling(renderer);
    } else {
      this._render(renderer);
      for (let i2 = 0, j3 = this.children.length; i2 < j3; ++i2) {
        this.children[i2].render(renderer);
      }
    }
    if (flush) {
      renderer.batch.flush();
    }
    if (mask) {
      renderer.mask.pop(this);
    }
    if (filters2 && this._enabledFilters?.length) {
      renderer.filter.pop();
    }
  }
  _render(_renderer) {
  }
  destroy(options) {
    super.destroy();
    this.sortDirty = false;
    const destroyChildren = typeof options === "boolean" ? options : options?.children;
    const oldChildren = this.removeChildren(0, this.children.length);
    if (destroyChildren) {
      for (let i2 = 0; i2 < oldChildren.length; ++i2) {
        oldChildren[i2].destroy(options);
      }
    }
  }
  get width() {
    return this.scale.x * this.getLocalBounds().width;
  }
  set width(value) {
    const width = this.getLocalBounds().width;
    if (width !== 0) {
      this.scale.x = value / width;
    } else {
      this.scale.x = 1;
    }
    this._width = value;
  }
  get height() {
    return this.scale.y * this.getLocalBounds().height;
  }
  set height(value) {
    const height = this.getLocalBounds().height;
    if (height !== 0) {
      this.scale.y = value / height;
    } else {
      this.scale.y = 1;
    }
    this._height = value;
  }
};
var Container = _Container;
Container.defaultSortableChildren = false;
Container.prototype.containerUpdateTransform = Container.prototype.updateTransform;

// ../../node_modules/.pnpm/@pixi+display@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/display/lib/settings.mjs
Object.defineProperties(settings, {
  SORTABLE_CHILDREN: {
    get() {
      return Container.defaultSortableChildren;
    },
    set(value) {
      lib_exports.deprecation("7.1.0", "settings.SORTABLE_CHILDREN is deprecated, use Container.defaultSortableChildren");
      Container.defaultSortableChildren = value;
    }
  }
});

// ../../node_modules/.pnpm/@pixi+sprite@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/sprite/lib/Sprite.mjs
var tempPoint = new Point();
var indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
var Sprite = class extends Container {
  constructor(texture) {
    super();
    this._anchor = new ObservablePoint(this._onAnchorUpdate, this, texture ? texture.defaultAnchor.x : 0, texture ? texture.defaultAnchor.y : 0);
    this._texture = null;
    this._width = 0;
    this._height = 0;
    this._tintColor = new Color(16777215);
    this._tintRGB = null;
    this.tint = 16777215;
    this.blendMode = BLEND_MODES.NORMAL;
    this._cachedTint = 16777215;
    this.uvs = null;
    this.texture = texture || Texture.EMPTY;
    this.vertexData = new Float32Array(8);
    this.vertexTrimmedData = null;
    this._transformID = -1;
    this._textureID = -1;
    this._transformTrimmedID = -1;
    this._textureTrimmedID = -1;
    this.indices = indices;
    this.pluginName = "batch";
    this.isSprite = true;
    this._roundPixels = settings.ROUND_PIXELS;
  }
  _onTextureUpdate() {
    this._textureID = -1;
    this._textureTrimmedID = -1;
    this._cachedTint = 16777215;
    if (this._width) {
      this.scale.x = lib_exports.sign(this.scale.x) * this._width / this._texture.orig.width;
    }
    if (this._height) {
      this.scale.y = lib_exports.sign(this.scale.y) * this._height / this._texture.orig.height;
    }
  }
  _onAnchorUpdate() {
    this._transformID = -1;
    this._transformTrimmedID = -1;
  }
  calculateVertices() {
    const texture = this._texture;
    if (this._transformID === this.transform._worldID && this._textureID === texture._updateID) {
      return;
    }
    if (this._textureID !== texture._updateID) {
      this.uvs = this._texture._uvs.uvsFloat32;
    }
    this._transformID = this.transform._worldID;
    this._textureID = texture._updateID;
    const wt = this.transform.worldTransform;
    const a2 = wt.a;
    const b3 = wt.b;
    const c2 = wt.c;
    const d2 = wt.d;
    const tx = wt.tx;
    const ty = wt.ty;
    const vertexData = this.vertexData;
    const trim = texture.trim;
    const orig = texture.orig;
    const anchor = this._anchor;
    let w0 = 0;
    let w1 = 0;
    let h0 = 0;
    let h1 = 0;
    if (trim) {
      w1 = trim.x - anchor._x * orig.width;
      w0 = w1 + trim.width;
      h1 = trim.y - anchor._y * orig.height;
      h0 = h1 + trim.height;
    } else {
      w1 = -anchor._x * orig.width;
      w0 = w1 + orig.width;
      h1 = -anchor._y * orig.height;
      h0 = h1 + orig.height;
    }
    vertexData[0] = a2 * w1 + c2 * h1 + tx;
    vertexData[1] = d2 * h1 + b3 * w1 + ty;
    vertexData[2] = a2 * w0 + c2 * h1 + tx;
    vertexData[3] = d2 * h1 + b3 * w0 + ty;
    vertexData[4] = a2 * w0 + c2 * h0 + tx;
    vertexData[5] = d2 * h0 + b3 * w0 + ty;
    vertexData[6] = a2 * w1 + c2 * h0 + tx;
    vertexData[7] = d2 * h0 + b3 * w1 + ty;
    if (this._roundPixels) {
      const resolution = settings.RESOLUTION;
      for (let i2 = 0; i2 < vertexData.length; ++i2) {
        vertexData[i2] = Math.round(vertexData[i2] * resolution) / resolution;
      }
    }
  }
  calculateTrimmedVertices() {
    if (!this.vertexTrimmedData) {
      this.vertexTrimmedData = new Float32Array(8);
    } else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID) {
      return;
    }
    this._transformTrimmedID = this.transform._worldID;
    this._textureTrimmedID = this._texture._updateID;
    const texture = this._texture;
    const vertexData = this.vertexTrimmedData;
    const orig = texture.orig;
    const anchor = this._anchor;
    const wt = this.transform.worldTransform;
    const a2 = wt.a;
    const b3 = wt.b;
    const c2 = wt.c;
    const d2 = wt.d;
    const tx = wt.tx;
    const ty = wt.ty;
    const w1 = -anchor._x * orig.width;
    const w0 = w1 + orig.width;
    const h1 = -anchor._y * orig.height;
    const h0 = h1 + orig.height;
    vertexData[0] = a2 * w1 + c2 * h1 + tx;
    vertexData[1] = d2 * h1 + b3 * w1 + ty;
    vertexData[2] = a2 * w0 + c2 * h1 + tx;
    vertexData[3] = d2 * h1 + b3 * w0 + ty;
    vertexData[4] = a2 * w0 + c2 * h0 + tx;
    vertexData[5] = d2 * h0 + b3 * w0 + ty;
    vertexData[6] = a2 * w1 + c2 * h0 + tx;
    vertexData[7] = d2 * h0 + b3 * w1 + ty;
  }
  _render(renderer) {
    this.calculateVertices();
    renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
    renderer.plugins[this.pluginName].render(this);
  }
  _calculateBounds() {
    const trim = this._texture.trim;
    const orig = this._texture.orig;
    if (!trim || trim.width === orig.width && trim.height === orig.height) {
      this.calculateVertices();
      this._bounds.addQuad(this.vertexData);
    } else {
      this.calculateTrimmedVertices();
      this._bounds.addQuad(this.vertexTrimmedData);
    }
  }
  getLocalBounds(rect) {
    if (this.children.length === 0) {
      if (!this._localBounds) {
        this._localBounds = new Bounds();
      }
      this._localBounds.minX = this._texture.orig.width * -this._anchor._x;
      this._localBounds.minY = this._texture.orig.height * -this._anchor._y;
      this._localBounds.maxX = this._texture.orig.width * (1 - this._anchor._x);
      this._localBounds.maxY = this._texture.orig.height * (1 - this._anchor._y);
      if (!rect) {
        if (!this._localBoundsRect) {
          this._localBoundsRect = new Rectangle();
        }
        rect = this._localBoundsRect;
      }
      return this._localBounds.getRectangle(rect);
    }
    return super.getLocalBounds.call(this, rect);
  }
  containsPoint(point) {
    this.worldTransform.applyInverse(point, tempPoint);
    const width = this._texture.orig.width;
    const height = this._texture.orig.height;
    const x1 = -width * this.anchor.x;
    let y1 = 0;
    if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
      y1 = -height * this.anchor.y;
      if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
        return true;
      }
    }
    return false;
  }
  destroy(options) {
    super.destroy(options);
    this._texture.off("update", this._onTextureUpdate, this);
    this._anchor = null;
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyBaseTexture = typeof options === "boolean" ? options : options?.baseTexture;
      this._texture.destroy(!!destroyBaseTexture);
    }
    this._texture = null;
  }
  static from(source, options) {
    const texture = source instanceof Texture ? source : Texture.from(source, options);
    return new Sprite(texture);
  }
  set roundPixels(value) {
    if (this._roundPixels !== value) {
      this._transformID = -1;
    }
    this._roundPixels = value;
  }
  get roundPixels() {
    return this._roundPixels;
  }
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(value) {
    const s2 = lib_exports.sign(this.scale.x) || 1;
    this.scale.x = s2 * value / this._texture.orig.width;
    this._width = value;
  }
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(value) {
    const s2 = lib_exports.sign(this.scale.y) || 1;
    this.scale.y = s2 * value / this._texture.orig.height;
    this._height = value;
  }
  get anchor() {
    return this._anchor;
  }
  set anchor(value) {
    this._anchor.copyFrom(value);
  }
  get tint() {
    return this._tintColor.value;
  }
  set tint(value) {
    this._tintColor.setValue(value);
    this._tintRGB = this._tintColor.toLittleEndianNumber();
  }
  get tintValue() {
    return this._tintColor.toNumber();
  }
  get texture() {
    return this._texture;
  }
  set texture(value) {
    if (this._texture === value) {
      return;
    }
    if (this._texture) {
      this._texture.off("update", this._onTextureUpdate, this);
    }
    this._texture = value || Texture.EMPTY;
    this._cachedTint = 16777215;
    this._textureID = -1;
    this._textureTrimmedID = -1;
    if (value) {
      if (value.baseTexture.valid) {
        this._onTextureUpdate();
      } else {
        value.once("update", this._onTextureUpdate, this);
      }
    }
  }
};

// ../../node_modules/.pnpm/@pixi+mixin-cache-as-bitmap@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/mixin-cache-as-bitmap/lib/index.mjs
var _tempMatrix = new Matrix();
DisplayObject.prototype._cacheAsBitmap = false;
DisplayObject.prototype._cacheData = null;
DisplayObject.prototype._cacheAsBitmapResolution = null;
DisplayObject.prototype._cacheAsBitmapMultisample = null;
var CacheData = class {
  constructor() {
    this.textureCacheId = null;
    this.originalRender = null;
    this.originalRenderCanvas = null;
    this.originalCalculateBounds = null;
    this.originalGetLocalBounds = null;
    this.originalUpdateTransform = null;
    this.originalDestroy = null;
    this.originalMask = null;
    this.originalFilterArea = null;
    this.originalContainsPoint = null;
    this.sprite = null;
  }
};
Object.defineProperties(DisplayObject.prototype, {
  cacheAsBitmapResolution: {
    get() {
      return this._cacheAsBitmapResolution;
    },
    set(resolution) {
      if (resolution === this._cacheAsBitmapResolution) {
        return;
      }
      this._cacheAsBitmapResolution = resolution;
      if (this.cacheAsBitmap) {
        this.cacheAsBitmap = false;
        this.cacheAsBitmap = true;
      }
    }
  },
  cacheAsBitmapMultisample: {
    get() {
      return this._cacheAsBitmapMultisample;
    },
    set(multisample) {
      if (multisample === this._cacheAsBitmapMultisample) {
        return;
      }
      this._cacheAsBitmapMultisample = multisample;
      if (this.cacheAsBitmap) {
        this.cacheAsBitmap = false;
        this.cacheAsBitmap = true;
      }
    }
  },
  cacheAsBitmap: {
    get() {
      return this._cacheAsBitmap;
    },
    set(value) {
      if (this._cacheAsBitmap === value) {
        return;
      }
      this._cacheAsBitmap = value;
      let data;
      if (value) {
        if (!this._cacheData) {
          this._cacheData = new CacheData();
        }
        data = this._cacheData;
        data.originalRender = this.render;
        data.originalRenderCanvas = this.renderCanvas;
        data.originalUpdateTransform = this.updateTransform;
        data.originalCalculateBounds = this.calculateBounds;
        data.originalGetLocalBounds = this.getLocalBounds;
        data.originalDestroy = this.destroy;
        data.originalContainsPoint = this.containsPoint;
        data.originalMask = this._mask;
        data.originalFilterArea = this.filterArea;
        this.render = this._renderCached;
        this.renderCanvas = this._renderCachedCanvas;
        this.destroy = this._cacheAsBitmapDestroy;
      } else {
        data = this._cacheData;
        if (data.sprite) {
          this._destroyCachedDisplayObject();
        }
        this.render = data.originalRender;
        this.renderCanvas = data.originalRenderCanvas;
        this.calculateBounds = data.originalCalculateBounds;
        this.getLocalBounds = data.originalGetLocalBounds;
        this.destroy = data.originalDestroy;
        this.updateTransform = data.originalUpdateTransform;
        this.containsPoint = data.originalContainsPoint;
        this._mask = data.originalMask;
        this.filterArea = data.originalFilterArea;
      }
    }
  }
});
DisplayObject.prototype._renderCached = function _renderCached(renderer) {
  if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
    return;
  }
  this._initCachedDisplayObject(renderer);
  this._cacheData.sprite.transform._worldID = this.transform._worldID;
  this._cacheData.sprite.worldAlpha = this.worldAlpha;
  this._cacheData.sprite._render(renderer);
};
DisplayObject.prototype._initCachedDisplayObject = function _initCachedDisplayObject(renderer) {
  if (this._cacheData?.sprite) {
    return;
  }
  const cacheAlpha = this.alpha;
  this.alpha = 1;
  renderer.batch.flush();
  const bounds = this.getLocalBounds(null, true).clone();
  if (this.filters?.length) {
    const padding = this.filters[0].padding;
    bounds.pad(padding);
  }
  bounds.ceil(settings.RESOLUTION);
  const cachedRenderTexture = renderer.renderTexture.current;
  const cachedSourceFrame = renderer.renderTexture.sourceFrame.clone();
  const cachedDestinationFrame = renderer.renderTexture.destinationFrame.clone();
  const cachedProjectionTransform = renderer.projection.transform;
  const renderTexture = RenderTexture.create({
    width: bounds.width,
    height: bounds.height,
    resolution: this.cacheAsBitmapResolution || renderer.resolution,
    multisample: this.cacheAsBitmapMultisample ?? renderer.multisample
  });
  const textureCacheId = `cacheAsBitmap_${lib_exports.uid()}`;
  this._cacheData.textureCacheId = textureCacheId;
  BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId);
  Texture.addToCache(renderTexture, textureCacheId);
  const m2 = this.transform.localTransform.copyTo(_tempMatrix).invert().translate(-bounds.x, -bounds.y);
  this.render = this._cacheData.originalRender;
  renderer.render(this, { renderTexture, clear: true, transform: m2, skipUpdateTransform: false });
  renderer.framebuffer.blit();
  renderer.projection.transform = cachedProjectionTransform;
  renderer.renderTexture.bind(cachedRenderTexture, cachedSourceFrame, cachedDestinationFrame);
  this.render = this._renderCached;
  this.updateTransform = this.displayObjectUpdateTransform;
  this.calculateBounds = this._calculateCachedBounds;
  this.getLocalBounds = this._getCachedLocalBounds;
  this._mask = null;
  this.filterArea = null;
  this.alpha = cacheAlpha;
  const cachedSprite = new Sprite(renderTexture);
  cachedSprite.transform.worldTransform = this.transform.worldTransform;
  cachedSprite.anchor.x = -(bounds.x / bounds.width);
  cachedSprite.anchor.y = -(bounds.y / bounds.height);
  cachedSprite.alpha = cacheAlpha;
  cachedSprite._bounds = this._bounds;
  this._cacheData.sprite = cachedSprite;
  this.transform._parentID = -1;
  if (!this.parent) {
    this.enableTempParent();
    this.updateTransform();
    this.disableTempParent(null);
  } else {
    this.updateTransform();
  }
  this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
DisplayObject.prototype._renderCachedCanvas = function _renderCachedCanvas(renderer) {
  if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
    return;
  }
  this._initCachedDisplayObjectCanvas(renderer);
  this._cacheData.sprite.worldAlpha = this.worldAlpha;
  this._cacheData.sprite._renderCanvas(renderer);
};
DisplayObject.prototype._initCachedDisplayObjectCanvas = function _initCachedDisplayObjectCanvas(renderer) {
  if (this._cacheData?.sprite) {
    return;
  }
  const bounds = this.getLocalBounds(null, true);
  const cacheAlpha = this.alpha;
  this.alpha = 1;
  const cachedRenderTarget = renderer.canvasContext.activeContext;
  const cachedProjectionTransform = renderer._projTransform;
  bounds.ceil(settings.RESOLUTION);
  const renderTexture = RenderTexture.create({ width: bounds.width, height: bounds.height });
  const textureCacheId = `cacheAsBitmap_${lib_exports.uid()}`;
  this._cacheData.textureCacheId = textureCacheId;
  BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId);
  Texture.addToCache(renderTexture, textureCacheId);
  const m2 = _tempMatrix;
  this.transform.localTransform.copyTo(m2);
  m2.invert();
  m2.tx -= bounds.x;
  m2.ty -= bounds.y;
  this.renderCanvas = this._cacheData.originalRenderCanvas;
  renderer.render(this, { renderTexture, clear: true, transform: m2, skipUpdateTransform: false });
  renderer.canvasContext.activeContext = cachedRenderTarget;
  renderer._projTransform = cachedProjectionTransform;
  this.renderCanvas = this._renderCachedCanvas;
  this.updateTransform = this.displayObjectUpdateTransform;
  this.calculateBounds = this._calculateCachedBounds;
  this.getLocalBounds = this._getCachedLocalBounds;
  this._mask = null;
  this.filterArea = null;
  this.alpha = cacheAlpha;
  const cachedSprite = new Sprite(renderTexture);
  cachedSprite.transform.worldTransform = this.transform.worldTransform;
  cachedSprite.anchor.x = -(bounds.x / bounds.width);
  cachedSprite.anchor.y = -(bounds.y / bounds.height);
  cachedSprite.alpha = cacheAlpha;
  cachedSprite._bounds = this._bounds;
  this._cacheData.sprite = cachedSprite;
  this.transform._parentID = -1;
  if (!this.parent) {
    this.parent = renderer._tempDisplayObjectParent;
    this.updateTransform();
    this.parent = null;
  } else {
    this.updateTransform();
  }
  this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
DisplayObject.prototype._calculateCachedBounds = function _calculateCachedBounds() {
  this._bounds.clear();
  this._cacheData.sprite.transform._worldID = this.transform._worldID;
  this._cacheData.sprite._calculateBounds();
  this._bounds.updateID = this._boundsID;
};
DisplayObject.prototype._getCachedLocalBounds = function _getCachedLocalBounds() {
  return this._cacheData.sprite.getLocalBounds(null);
};
DisplayObject.prototype._destroyCachedDisplayObject = function _destroyCachedDisplayObject() {
  this._cacheData.sprite._texture.destroy(true);
  this._cacheData.sprite = null;
  BaseTexture.removeFromCache(this._cacheData.textureCacheId);
  Texture.removeFromCache(this._cacheData.textureCacheId);
  this._cacheData.textureCacheId = null;
};
DisplayObject.prototype._cacheAsBitmapDestroy = function _cacheAsBitmapDestroy(options) {
  this.cacheAsBitmap = false;
  this.destroy(options);
};

// ../../node_modules/.pnpm/@pixi+mixin-get-child-by-name@7.2.4_@pixi+display@7.2.4/node_modules/@pixi/mixin-get-child-by-name/lib/index.mjs
DisplayObject.prototype.name = null;
Container.prototype.getChildByName = function getChildByName(name, deep) {
  for (let i2 = 0, j3 = this.children.length; i2 < j3; i2++) {
    if (this.children[i2].name === name) {
      return this.children[i2];
    }
  }
  if (deep) {
    for (let i2 = 0, j3 = this.children.length; i2 < j3; i2++) {
      const child = this.children[i2];
      if (!child.getChildByName) {
        continue;
      }
      const target = child.getChildByName(name, true);
      if (target) {
        return target;
      }
    }
  }
  return null;
};

// ../../node_modules/.pnpm/@pixi+mixin-get-global-position@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/mixin-get-global-position/lib/index.mjs
DisplayObject.prototype.getGlobalPosition = function getGlobalPosition(point = new Point(), skipUpdate = false) {
  if (this.parent) {
    this.parent.toGlobal(this.position, point, skipUpdate);
  } else {
    point.x = this.position.x;
    point.y = this.position.y;
  }
  return point;
};

// ../../node_modules/.pnpm/@pixi+filter-alpha@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-alpha/lib/alpha.mjs
var fragment2 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float uAlpha;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;\n}\n";

// ../../node_modules/.pnpm/@pixi+filter-alpha@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-alpha/lib/AlphaFilter.mjs
var AlphaFilter = class extends Filter {
  constructor(alpha = 1) {
    super(defaultVertex4, fragment2, { uAlpha: 1 });
    this.alpha = alpha;
  }
  get alpha() {
    return this.uniforms.uAlpha;
  }
  set alpha(value) {
    this.uniforms.uAlpha = value;
  }
};

// ../../node_modules/.pnpm/@pixi+filter-blur@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-blur/lib/generateBlurFragSource.mjs
var GAUSSIAN_VALUES = {
  5: [0.153388, 0.221461, 0.250301],
  7: [0.071303, 0.131514, 0.189879, 0.214607],
  9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
  11: [93e-4, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
  13: [2406e-6, 9255e-6, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
  15: [489e-6, 2403e-6, 9246e-6, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448]
};
var fragTemplate2 = [
  "varying vec2 vBlurTexCoords[%size%];",
  "uniform sampler2D uSampler;",
  "void main(void)",
  "{",
  "    gl_FragColor = vec4(0.0);",
  "    %blur%",
  "}"
].join("\n");
function generateBlurFragSource(kernelSize) {
  const kernel = GAUSSIAN_VALUES[kernelSize];
  const halfLength = kernel.length;
  let fragSource = fragTemplate2;
  let blurLoop = "";
  const template = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;";
  let value;
  for (let i2 = 0; i2 < kernelSize; i2++) {
    let blur = template.replace("%index%", i2.toString());
    value = i2;
    if (i2 >= halfLength) {
      value = kernelSize - i2 - 1;
    }
    blur = blur.replace("%value%", kernel[value].toString());
    blurLoop += blur;
    blurLoop += "\n";
  }
  fragSource = fragSource.replace("%blur%", blurLoop);
  fragSource = fragSource.replace("%size%", kernelSize.toString());
  return fragSource;
}

// ../../node_modules/.pnpm/@pixi+filter-blur@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-blur/lib/generateBlurVertSource.mjs
var vertTemplate = `
    attribute vec2 aVertexPosition;

    uniform mat3 projectionMatrix;

    uniform float strength;

    varying vec2 vBlurTexCoords[%size%];

    uniform vec4 inputSize;
    uniform vec4 outputFrame;

    vec4 filterVertexPosition( void )
    {
        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
    }

    vec2 filterTextureCoord( void )
    {
        return aVertexPosition * (outputFrame.zw * inputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;
function generateBlurVertSource(kernelSize, x2) {
  const halfLength = Math.ceil(kernelSize / 2);
  let vertSource = vertTemplate;
  let blurLoop = "";
  let template;
  if (x2) {
    template = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);";
  } else {
    template = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
  }
  for (let i2 = 0; i2 < kernelSize; i2++) {
    let blur = template.replace("%index%", i2.toString());
    blur = blur.replace("%sampleIndex%", `${i2 - (halfLength - 1)}.0`);
    blurLoop += blur;
    blurLoop += "\n";
  }
  vertSource = vertSource.replace("%blur%", blurLoop);
  vertSource = vertSource.replace("%size%", kernelSize.toString());
  return vertSource;
}

// ../../node_modules/.pnpm/@pixi+filter-blur@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-blur/lib/BlurFilterPass.mjs
var BlurFilterPass = class extends Filter {
  constructor(horizontal, strength = 8, quality = 4, resolution = Filter.defaultResolution, kernelSize = 5) {
    const vertSrc = generateBlurVertSource(kernelSize, horizontal);
    const fragSrc = generateBlurFragSource(kernelSize);
    super(vertSrc, fragSrc);
    this.horizontal = horizontal;
    this.resolution = resolution;
    this._quality = 0;
    this.quality = quality;
    this.blur = strength;
  }
  apply(filterManager, input, output, clearMode) {
    if (output) {
      if (this.horizontal) {
        this.uniforms.strength = 1 / output.width * (output.width / input.width);
      } else {
        this.uniforms.strength = 1 / output.height * (output.height / input.height);
      }
    } else {
      if (this.horizontal) {
        this.uniforms.strength = 1 / filterManager.renderer.width * (filterManager.renderer.width / input.width);
      } else {
        this.uniforms.strength = 1 / filterManager.renderer.height * (filterManager.renderer.height / input.height);
      }
    }
    this.uniforms.strength *= this.strength;
    this.uniforms.strength /= this.passes;
    if (this.passes === 1) {
      filterManager.applyFilter(this, input, output, clearMode);
    } else {
      const renderTarget = filterManager.getFilterTexture();
      const renderer = filterManager.renderer;
      let flip = input;
      let flop = renderTarget;
      this.state.blend = false;
      filterManager.applyFilter(this, flip, flop, CLEAR_MODES.CLEAR);
      for (let i2 = 1; i2 < this.passes - 1; i2++) {
        filterManager.bindAndClear(flip, CLEAR_MODES.BLIT);
        this.uniforms.uSampler = flop;
        const temp = flop;
        flop = flip;
        flip = temp;
        renderer.shader.bind(this);
        renderer.geometry.draw(5);
      }
      this.state.blend = true;
      filterManager.applyFilter(this, flop, output, clearMode);
      filterManager.returnFilterTexture(renderTarget);
    }
  }
  get blur() {
    return this.strength;
  }
  set blur(value) {
    this.padding = 1 + Math.abs(value) * 2;
    this.strength = value;
  }
  get quality() {
    return this._quality;
  }
  set quality(value) {
    this._quality = value;
    this.passes = value;
  }
};

// ../../node_modules/.pnpm/@pixi+filter-blur@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-blur/lib/BlurFilter.mjs
var BlurFilter = class extends Filter {
  constructor(strength = 8, quality = 4, resolution = Filter.defaultResolution, kernelSize = 5) {
    super();
    this._repeatEdgePixels = false;
    this.blurXFilter = new BlurFilterPass(true, strength, quality, resolution, kernelSize);
    this.blurYFilter = new BlurFilterPass(false, strength, quality, resolution, kernelSize);
    this.resolution = resolution;
    this.quality = quality;
    this.blur = strength;
    this.repeatEdgePixels = false;
  }
  apply(filterManager, input, output, clearMode) {
    const xStrength = Math.abs(this.blurXFilter.strength);
    const yStrength = Math.abs(this.blurYFilter.strength);
    if (xStrength && yStrength) {
      const renderTarget = filterManager.getFilterTexture();
      this.blurXFilter.apply(filterManager, input, renderTarget, CLEAR_MODES.CLEAR);
      this.blurYFilter.apply(filterManager, renderTarget, output, clearMode);
      filterManager.returnFilterTexture(renderTarget);
    } else if (yStrength) {
      this.blurYFilter.apply(filterManager, input, output, clearMode);
    } else {
      this.blurXFilter.apply(filterManager, input, output, clearMode);
    }
  }
  updatePadding() {
    if (this._repeatEdgePixels) {
      this.padding = 0;
    } else {
      this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
    }
  }
  get blur() {
    return this.blurXFilter.blur;
  }
  set blur(value) {
    this.blurXFilter.blur = this.blurYFilter.blur = value;
    this.updatePadding();
  }
  get quality() {
    return this.blurXFilter.quality;
  }
  set quality(value) {
    this.blurXFilter.quality = this.blurYFilter.quality = value;
  }
  get blurX() {
    return this.blurXFilter.blur;
  }
  set blurX(value) {
    this.blurXFilter.blur = value;
    this.updatePadding();
  }
  get blurY() {
    return this.blurYFilter.blur;
  }
  set blurY(value) {
    this.blurYFilter.blur = value;
    this.updatePadding();
  }
  get blendMode() {
    return this.blurYFilter.blendMode;
  }
  set blendMode(value) {
    this.blurYFilter.blendMode = value;
  }
  get repeatEdgePixels() {
    return this._repeatEdgePixels;
  }
  set repeatEdgePixels(value) {
    this._repeatEdgePixels = value;
    this.updatePadding();
  }
};

// ../../node_modules/.pnpm/@pixi+filter-color-matrix@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-color-matrix/lib/colorMatrix.mjs
var fragment3 = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\nuniform float uAlpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (uAlpha == 0.0) {\n        gl_FragColor = c;\n        return;\n    }\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (c.a > 0.0) {\n      c.rgb /= c.a;\n    }\n\n    vec4 result;\n\n    result.r = (m[0] * c.r);\n        result.r += (m[1] * c.g);\n        result.r += (m[2] * c.b);\n        result.r += (m[3] * c.a);\n        result.r += m[4];\n\n    result.g = (m[5] * c.r);\n        result.g += (m[6] * c.g);\n        result.g += (m[7] * c.b);\n        result.g += (m[8] * c.a);\n        result.g += m[9];\n\n    result.b = (m[10] * c.r);\n       result.b += (m[11] * c.g);\n       result.b += (m[12] * c.b);\n       result.b += (m[13] * c.a);\n       result.b += m[14];\n\n    result.a = (m[15] * c.r);\n       result.a += (m[16] * c.g);\n       result.a += (m[17] * c.b);\n       result.a += (m[18] * c.a);\n       result.a += m[19];\n\n    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);\n\n    // Premultiply alpha again.\n    rgb *= result.a;\n\n    gl_FragColor = vec4(rgb, result.a);\n}\n";

// ../../node_modules/.pnpm/@pixi+filter-color-matrix@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-color-matrix/lib/ColorMatrixFilter.mjs
var ColorMatrixFilter = class extends Filter {
  constructor() {
    const uniforms = {
      m: new Float32Array([
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ]),
      uAlpha: 1
    };
    super(defaultFilterVertex, fragment3, uniforms);
    this.alpha = 1;
  }
  _loadMatrix(matrix, multiply = false) {
    let newMatrix = matrix;
    if (multiply) {
      this._multiply(newMatrix, this.uniforms.m, matrix);
      newMatrix = this._colorMatrix(newMatrix);
    }
    this.uniforms.m = newMatrix;
  }
  _multiply(out, a2, b3) {
    out[0] = a2[0] * b3[0] + a2[1] * b3[5] + a2[2] * b3[10] + a2[3] * b3[15];
    out[1] = a2[0] * b3[1] + a2[1] * b3[6] + a2[2] * b3[11] + a2[3] * b3[16];
    out[2] = a2[0] * b3[2] + a2[1] * b3[7] + a2[2] * b3[12] + a2[3] * b3[17];
    out[3] = a2[0] * b3[3] + a2[1] * b3[8] + a2[2] * b3[13] + a2[3] * b3[18];
    out[4] = a2[0] * b3[4] + a2[1] * b3[9] + a2[2] * b3[14] + a2[3] * b3[19] + a2[4];
    out[5] = a2[5] * b3[0] + a2[6] * b3[5] + a2[7] * b3[10] + a2[8] * b3[15];
    out[6] = a2[5] * b3[1] + a2[6] * b3[6] + a2[7] * b3[11] + a2[8] * b3[16];
    out[7] = a2[5] * b3[2] + a2[6] * b3[7] + a2[7] * b3[12] + a2[8] * b3[17];
    out[8] = a2[5] * b3[3] + a2[6] * b3[8] + a2[7] * b3[13] + a2[8] * b3[18];
    out[9] = a2[5] * b3[4] + a2[6] * b3[9] + a2[7] * b3[14] + a2[8] * b3[19] + a2[9];
    out[10] = a2[10] * b3[0] + a2[11] * b3[5] + a2[12] * b3[10] + a2[13] * b3[15];
    out[11] = a2[10] * b3[1] + a2[11] * b3[6] + a2[12] * b3[11] + a2[13] * b3[16];
    out[12] = a2[10] * b3[2] + a2[11] * b3[7] + a2[12] * b3[12] + a2[13] * b3[17];
    out[13] = a2[10] * b3[3] + a2[11] * b3[8] + a2[12] * b3[13] + a2[13] * b3[18];
    out[14] = a2[10] * b3[4] + a2[11] * b3[9] + a2[12] * b3[14] + a2[13] * b3[19] + a2[14];
    out[15] = a2[15] * b3[0] + a2[16] * b3[5] + a2[17] * b3[10] + a2[18] * b3[15];
    out[16] = a2[15] * b3[1] + a2[16] * b3[6] + a2[17] * b3[11] + a2[18] * b3[16];
    out[17] = a2[15] * b3[2] + a2[16] * b3[7] + a2[17] * b3[12] + a2[18] * b3[17];
    out[18] = a2[15] * b3[3] + a2[16] * b3[8] + a2[17] * b3[13] + a2[18] * b3[18];
    out[19] = a2[15] * b3[4] + a2[16] * b3[9] + a2[17] * b3[14] + a2[18] * b3[19] + a2[19];
    return out;
  }
  _colorMatrix(matrix) {
    const m2 = new Float32Array(matrix);
    m2[4] /= 255;
    m2[9] /= 255;
    m2[14] /= 255;
    m2[19] /= 255;
    return m2;
  }
  brightness(b3, multiply) {
    const matrix = [
      b3,
      0,
      0,
      0,
      0,
      0,
      b3,
      0,
      0,
      0,
      0,
      0,
      b3,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  tint(color, multiply) {
    const [r2, g3, b3] = Color.shared.setValue(color).toArray();
    const matrix = [
      r2,
      0,
      0,
      0,
      0,
      0,
      g3,
      0,
      0,
      0,
      0,
      0,
      b3,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  greyscale(scale, multiply) {
    const matrix = [
      scale,
      scale,
      scale,
      0,
      0,
      scale,
      scale,
      scale,
      0,
      0,
      scale,
      scale,
      scale,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  blackAndWhite(multiply) {
    const matrix = [
      0.3,
      0.6,
      0.1,
      0,
      0,
      0.3,
      0.6,
      0.1,
      0,
      0,
      0.3,
      0.6,
      0.1,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  hue(rotation, multiply) {
    rotation = (rotation || 0) / 180 * Math.PI;
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);
    const sqrt = Math.sqrt;
    const w3 = 1 / 3;
    const sqrW = sqrt(w3);
    const a00 = cosR + (1 - cosR) * w3;
    const a01 = w3 * (1 - cosR) - sqrW * sinR;
    const a02 = w3 * (1 - cosR) + sqrW * sinR;
    const a10 = w3 * (1 - cosR) + sqrW * sinR;
    const a11 = cosR + w3 * (1 - cosR);
    const a12 = w3 * (1 - cosR) - sqrW * sinR;
    const a20 = w3 * (1 - cosR) - sqrW * sinR;
    const a21 = w3 * (1 - cosR) + sqrW * sinR;
    const a22 = cosR + w3 * (1 - cosR);
    const matrix = [
      a00,
      a01,
      a02,
      0,
      0,
      a10,
      a11,
      a12,
      0,
      0,
      a20,
      a21,
      a22,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  contrast(amount, multiply) {
    const v2 = (amount || 0) + 1;
    const o3 = -0.5 * (v2 - 1);
    const matrix = [
      v2,
      0,
      0,
      0,
      o3,
      0,
      v2,
      0,
      0,
      o3,
      0,
      0,
      v2,
      0,
      o3,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  saturate(amount = 0, multiply) {
    const x2 = amount * 2 / 3 + 1;
    const y2 = (x2 - 1) * -0.5;
    const matrix = [
      x2,
      y2,
      y2,
      0,
      0,
      y2,
      x2,
      y2,
      0,
      0,
      y2,
      y2,
      x2,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  desaturate() {
    this.saturate(-1);
  }
  negative(multiply) {
    const matrix = [
      -1,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      1,
      0,
      0,
      0,
      -1,
      1,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  sepia(multiply) {
    const matrix = [
      0.393,
      0.7689999,
      0.18899999,
      0,
      0,
      0.349,
      0.6859999,
      0.16799999,
      0,
      0,
      0.272,
      0.5339999,
      0.13099999,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  technicolor(multiply) {
    const matrix = [
      1.9125277891456083,
      -0.8545344976951645,
      -0.09155508482755585,
      0,
      11.793603434377337,
      -0.3087833385928097,
      1.7658908555458428,
      -0.10601743074722245,
      0,
      -70.35205161461398,
      -0.231103377548616,
      -0.7501899197440212,
      1.847597816108189,
      0,
      30.950940869491138,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  polaroid(multiply) {
    const matrix = [
      1.438,
      -0.062,
      -0.062,
      0,
      0,
      -0.122,
      1.378,
      -0.122,
      0,
      0,
      -0.016,
      -0.016,
      1.483,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  toBGR(multiply) {
    const matrix = [
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  kodachrome(multiply) {
    const matrix = [
      1.1285582396593525,
      -0.3967382283601348,
      -0.03992559172921793,
      0,
      63.72958762196502,
      -0.16404339962244616,
      1.0835251566291304,
      -0.05498805115633132,
      0,
      24.732407896706203,
      -0.16786010706155763,
      -0.5603416277695248,
      1.6014850761964943,
      0,
      35.62982807460946,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  browni(multiply) {
    const matrix = [
      0.5997023498159715,
      0.34553243048391263,
      -0.2708298674538042,
      0,
      47.43192855600873,
      -0.037703249837783157,
      0.8609577587992641,
      0.15059552388459913,
      0,
      -36.96841498319127,
      0.24113635128153335,
      -0.07441037908422492,
      0.44972182064877153,
      0,
      -7.562075277591283,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  vintage(multiply) {
    const matrix = [
      0.6279345635605994,
      0.3202183420819367,
      -0.03965408211312453,
      0,
      9.651285835294123,
      0.02578397704808868,
      0.6441188644374771,
      0.03259127616149294,
      0,
      7.462829176470591,
      0.0466055556782719,
      -0.0851232987247891,
      0.5241648018700465,
      0,
      5.159190588235296,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  colorTone(desaturation, toned, lightColor, darkColor, multiply) {
    desaturation = desaturation || 0.2;
    toned = toned || 0.15;
    lightColor = lightColor || 16770432;
    darkColor = darkColor || 3375104;
    const temp = Color.shared;
    const [lR, lG, lB] = temp.setValue(lightColor).toArray();
    const [dR, dG, dB] = temp.setValue(darkColor).toArray();
    const matrix = [
      0.3,
      0.59,
      0.11,
      0,
      0,
      lR,
      lG,
      lB,
      desaturation,
      0,
      dR,
      dG,
      dB,
      toned,
      0,
      lR - dR,
      lG - dG,
      lB - dB,
      0,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  night(intensity, multiply) {
    intensity = intensity || 0.1;
    const matrix = [
      intensity * -2,
      -intensity,
      0,
      0,
      0,
      -intensity,
      0,
      intensity,
      0,
      0,
      0,
      intensity,
      intensity * 2,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  predator(amount, multiply) {
    const matrix = [
      11.224130630493164 * amount,
      -4.794486999511719 * amount,
      -2.8746118545532227 * amount,
      0 * amount,
      0.40342438220977783 * amount,
      -3.6330697536468506 * amount,
      9.193157196044922 * amount,
      -2.951810836791992 * amount,
      0 * amount,
      -1.316135048866272 * amount,
      -3.2184197902679443 * amount,
      -4.2375030517578125 * amount,
      7.476448059082031 * amount,
      0 * amount,
      0.8044459223747253 * amount,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  lsd(multiply) {
    const matrix = [
      2,
      -0.4,
      0.5,
      0,
      0,
      -0.5,
      2,
      -0.4,
      0,
      0,
      -0.4,
      -0.5,
      3,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, multiply);
  }
  reset() {
    const matrix = [
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(matrix, false);
  }
  get matrix() {
    return this.uniforms.m;
  }
  set matrix(value) {
    this.uniforms.m = value;
  }
  get alpha() {
    return this.uniforms.uAlpha;
  }
  set alpha(value) {
    this.uniforms.uAlpha = value;
  }
};
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.greyscale;

// ../../node_modules/.pnpm/@pixi+filter-displacement@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-displacement/lib/displacement.mjs
var fragment4 = "varying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\nuniform mat2 rotation;\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform highp vec4 inputSize;\nuniform vec4 inputClamp;\n\nvoid main(void)\n{\n  vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n  map -= 0.5;\n  map.xy = scale * inputSize.zw * (rotation * map.xy);\n\n  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));\n}\n";

// ../../node_modules/.pnpm/@pixi+filter-displacement@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-displacement/lib/displacement2.mjs
var vertex2 = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n	gl_Position = filterVertexPosition();\n	vTextureCoord = filterTextureCoord();\n	vFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;\n}\n";

// ../../node_modules/.pnpm/@pixi+filter-displacement@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-displacement/lib/DisplacementFilter.mjs
var DisplacementFilter = class extends Filter {
  constructor(sprite, scale) {
    const maskMatrix = new Matrix();
    sprite.renderable = false;
    super(vertex2, fragment4, {
      mapSampler: sprite._texture,
      filterMatrix: maskMatrix,
      scale: { x: 1, y: 1 },
      rotation: new Float32Array([1, 0, 0, 1])
    });
    this.maskSprite = sprite;
    this.maskMatrix = maskMatrix;
    if (scale === null || scale === void 0) {
      scale = 20;
    }
    this.scale = new Point(scale, scale);
  }
  apply(filterManager, input, output, clearMode) {
    this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, this.maskSprite);
    this.uniforms.scale.x = this.scale.x;
    this.uniforms.scale.y = this.scale.y;
    const wt = this.maskSprite.worldTransform;
    const lenX = Math.sqrt(wt.a * wt.a + wt.b * wt.b);
    const lenY = Math.sqrt(wt.c * wt.c + wt.d * wt.d);
    if (lenX !== 0 && lenY !== 0) {
      this.uniforms.rotation[0] = wt.a / lenX;
      this.uniforms.rotation[1] = wt.b / lenX;
      this.uniforms.rotation[2] = wt.c / lenY;
      this.uniforms.rotation[3] = wt.d / lenY;
    }
    filterManager.applyFilter(this, input, output, clearMode);
  }
  get map() {
    return this.uniforms.mapSampler;
  }
  set map(value) {
    this.uniforms.mapSampler = value;
  }
};

// ../../node_modules/.pnpm/@pixi+filter-fxaa@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-fxaa/lib/fxaa.mjs
var fragment5 = `varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;
uniform sampler2D uSampler;
uniform highp vec4 inputSize;


/**
 Basic FXAA implementation based on the code on geeks3d.com with the
 modification that the texture2DLod stuff was removed since it's
 unsupported by WebGL.

 --

 From:
 https://github.com/mitsuhiko/webgl-meincraft

 Copyright (c) 2011 by Armin Ronacher.

 Some rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are
 met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above
 copyright notice, this list of conditions and the following
 disclaimer in the documentation and/or other materials provided
 with the distribution.

 * The names of the contributors may not be used to endorse or
 promote products derived from this software without specific
 prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef FXAA_REDUCE_MIN
#define FXAA_REDUCE_MIN   (1.0/ 128.0)
#endif
#ifndef FXAA_REDUCE_MUL
#define FXAA_REDUCE_MUL   (1.0 / 8.0)
#endif
#ifndef FXAA_SPAN_MAX
#define FXAA_SPAN_MAX     8.0
#endif

//optimized version for mobile, where dependent
//texture reads can be a bottleneck
vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,
          vec2 v_rgbNW, vec2 v_rgbNE,
          vec2 v_rgbSW, vec2 v_rgbSE,
          vec2 v_rgbM) {
    vec4 color;
    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;
    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;
    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;
    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;
    vec4 texColor = texture2D(tex, v_rgbM);
    vec3 rgbM  = texColor.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    mediump vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                  dir * rcpDirMin)) * inverseVP;

    vec3 rgbA = 0.5 * (
                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = vec4(rgbA, texColor.a);
    else
        color = vec4(rgbB, texColor.a);
    return color;
}

void main() {

      vec4 color;

      color = fxaa(uSampler, vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

      gl_FragColor = color;
}
`;

// ../../node_modules/.pnpm/@pixi+filter-fxaa@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-fxaa/lib/fxaa2.mjs
var vertex3 = "\nattribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvoid texcoords(vec2 fragCoord, vec2 inverseVP,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = filterVertexPosition();\n\n   vFragCoord = aVertexPosition * outputFrame.zw;\n\n   texcoords(vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n";

// ../../node_modules/.pnpm/@pixi+filter-fxaa@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-fxaa/lib/FXAAFilter.mjs
var FXAAFilter = class extends Filter {
  constructor() {
    super(vertex3, fragment5);
  }
};

// ../../node_modules/.pnpm/@pixi+filter-noise@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-noise/lib/noise.mjs
var fragment6 = "precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float uNoise;\nuniform float uSeed;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float randomValue = rand(gl_FragCoord.xy * uSeed);\n    float diff = (randomValue - 0.5) * uNoise;\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n    }\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    // Premultiply alpha again.\n    color.rgb *= color.a;\n\n    gl_FragColor = color;\n}\n";

// ../../node_modules/.pnpm/@pixi+filter-noise@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/filter-noise/lib/NoiseFilter.mjs
var NoiseFilter = class extends Filter {
  constructor(noise = 0.5, seed = Math.random()) {
    super(defaultFilterVertex, fragment6, {
      uNoise: 0,
      uSeed: 0
    });
    this.noise = noise;
    this.seed = seed;
  }
  get noise() {
    return this.uniforms.uNoise;
  }
  set noise(value) {
    this.uniforms.uNoise = value;
  }
  get seed() {
    return this.uniforms.uSeed;
  }
  set seed(value) {
    this.uniforms.uSeed = value;
  }
};

// ../../node_modules/.pnpm/pixi.js@7.2.4_@pixi+utils@7.2.4/node_modules/pixi.js/lib/filters.mjs
var filters = {
  AlphaFilter,
  BlurFilter,
  BlurFilterPass,
  ColorMatrixFilter,
  DisplacementFilter,
  FXAAFilter,
  NoiseFilter
};
Object.entries(filters).forEach(([key, FilterClass]) => {
  Object.defineProperty(filters, key, {
    get() {
      lib_exports.deprecation("7.1.0", `filters.${key} has moved to ${key}`);
      return FilterClass;
    }
  });
});

// ../../node_modules/.pnpm/@pixi+events@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/events/lib/EventTicker.mjs
var EventsTickerClass = class {
  constructor() {
    this.interactionFrequency = 10;
    this._deltaTime = 0;
    this._didMove = false;
    this.tickerAdded = false;
    this._pauseUpdate = true;
  }
  init(events) {
    this.removeTickerListener();
    this.events = events;
    this.interactionFrequency = 10;
    this._deltaTime = 0;
    this._didMove = false;
    this.tickerAdded = false;
    this._pauseUpdate = true;
  }
  get pauseUpdate() {
    return this._pauseUpdate;
  }
  set pauseUpdate(paused) {
    this._pauseUpdate = paused;
  }
  addTickerListener() {
    if (this.tickerAdded || !this.domElement) {
      return;
    }
    Ticker.system.add(this.tickerUpdate, this, UPDATE_PRIORITY.INTERACTION);
    this.tickerAdded = true;
  }
  removeTickerListener() {
    if (!this.tickerAdded) {
      return;
    }
    Ticker.system.remove(this.tickerUpdate, this);
    this.tickerAdded = false;
  }
  pointerMoved() {
    this._didMove = true;
  }
  update() {
    if (!this.domElement || this._pauseUpdate) {
      return;
    }
    if (this._didMove) {
      this._didMove = false;
      return;
    }
    const rootPointerEvent = this.events["rootPointerEvent"];
    if (this.events.supportsTouchEvents && rootPointerEvent.pointerType === "touch") {
      return;
    }
    globalThis.document.dispatchEvent(new PointerEvent("pointermove", {
      clientX: rootPointerEvent.clientX,
      clientY: rootPointerEvent.clientY
    }));
  }
  tickerUpdate(deltaTime) {
    this._deltaTime += deltaTime;
    if (this._deltaTime < this.interactionFrequency) {
      return;
    }
    this._deltaTime = 0;
    this.update();
  }
};
var EventsTicker = new EventsTickerClass();

// ../../node_modules/.pnpm/@pixi+events@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/events/lib/FederatedEvent.mjs
var FederatedEvent = class {
  constructor(manager) {
    this.bubbles = true;
    this.cancelBubble = true;
    this.cancelable = false;
    this.composed = false;
    this.defaultPrevented = false;
    this.eventPhase = FederatedEvent.prototype.NONE;
    this.propagationStopped = false;
    this.propagationImmediatelyStopped = false;
    this.layer = new Point();
    this.page = new Point();
    this.NONE = 0;
    this.CAPTURING_PHASE = 1;
    this.AT_TARGET = 2;
    this.BUBBLING_PHASE = 3;
    this.manager = manager;
  }
  get layerX() {
    return this.layer.x;
  }
  get layerY() {
    return this.layer.y;
  }
  get pageX() {
    return this.page.x;
  }
  get pageY() {
    return this.page.y;
  }
  get data() {
    return this;
  }
  composedPath() {
    if (this.manager && (!this.path || this.path[this.path.length - 1] !== this.target)) {
      this.path = this.target ? this.manager.propagationPath(this.target) : [];
    }
    return this.path;
  }
  initEvent(_type, _bubbles, _cancelable) {
    throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  initUIEvent(_typeArg, _bubblesArg, _cancelableArg, _viewArg, _detailArg) {
    throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  preventDefault() {
    if (this.nativeEvent instanceof Event && this.nativeEvent.cancelable) {
      this.nativeEvent.preventDefault();
    }
    this.defaultPrevented = true;
  }
  stopImmediatePropagation() {
    this.propagationImmediatelyStopped = true;
  }
  stopPropagation() {
    this.propagationStopped = true;
  }
};

// ../../node_modules/.pnpm/@pixi+events@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/events/lib/FederatedMouseEvent.mjs
var FederatedMouseEvent = class extends FederatedEvent {
  constructor() {
    super(...arguments);
    this.client = new Point();
    this.movement = new Point();
    this.offset = new Point();
    this.global = new Point();
    this.screen = new Point();
  }
  get clientX() {
    return this.client.x;
  }
  get clientY() {
    return this.client.y;
  }
  get x() {
    return this.clientX;
  }
  get y() {
    return this.clientY;
  }
  get movementX() {
    return this.movement.x;
  }
  get movementY() {
    return this.movement.y;
  }
  get offsetX() {
    return this.offset.x;
  }
  get offsetY() {
    return this.offset.y;
  }
  get globalX() {
    return this.global.x;
  }
  get globalY() {
    return this.global.y;
  }
  get screenX() {
    return this.screen.x;
  }
  get screenY() {
    return this.screen.y;
  }
  getLocalPosition(displayObject, point, globalPos) {
    return displayObject.worldTransform.applyInverse(globalPos || this.global, point);
  }
  getModifierState(key) {
    return "getModifierState" in this.nativeEvent && this.nativeEvent.getModifierState(key);
  }
  initMouseEvent(_typeArg, _canBubbleArg, _cancelableArg, _viewArg, _detailArg, _screenXArg, _screenYArg, _clientXArg, _clientYArg, _ctrlKeyArg, _altKeyArg, _shiftKeyArg, _metaKeyArg, _buttonArg, _relatedTargetArg) {
    throw new Error("Method not implemented.");
  }
};

// ../../node_modules/.pnpm/@pixi+events@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/events/lib/FederatedPointerEvent.mjs
var FederatedPointerEvent = class extends FederatedMouseEvent {
  constructor() {
    super(...arguments);
    this.width = 0;
    this.height = 0;
    this.isPrimary = false;
  }
  getCoalescedEvents() {
    if (this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove") {
      return [this];
    }
    return [];
  }
  getPredictedEvents() {
    throw new Error("getPredictedEvents is not supported!");
  }
};

// ../../node_modules/.pnpm/@pixi+events@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/events/lib/FederatedWheelEvent.mjs
var FederatedWheelEvent = class extends FederatedMouseEvent {
  constructor() {
    super(...arguments);
    this.DOM_DELTA_PIXEL = 0;
    this.DOM_DELTA_LINE = 1;
    this.DOM_DELTA_PAGE = 2;
  }
};
FederatedWheelEvent.DOM_DELTA_PIXEL = 0;
FederatedWheelEvent.DOM_DELTA_LINE = 1;
FederatedWheelEvent.DOM_DELTA_PAGE = 2;

// ../../node_modules/.pnpm/@pixi+events@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/events/lib/EventBoundary.mjs
var PROPAGATION_LIMIT = 2048;
var tempHitLocation = new Point();
var tempLocalMapping = new Point();
var EventBoundary = class {
  constructor(rootTarget) {
    this.dispatch = new lib_exports.EventEmitter();
    this.moveOnAll = false;
    this.enableGlobalMoveEvents = true;
    this.mappingState = {
      trackingData: {}
    };
    this.eventPool = /* @__PURE__ */ new Map();
    this._allInteractiveElements = [];
    this._hitElements = [];
    this._isPointerMoveEvent = false;
    this.rootTarget = rootTarget;
    this.hitPruneFn = this.hitPruneFn.bind(this);
    this.hitTestFn = this.hitTestFn.bind(this);
    this.mapPointerDown = this.mapPointerDown.bind(this);
    this.mapPointerMove = this.mapPointerMove.bind(this);
    this.mapPointerOut = this.mapPointerOut.bind(this);
    this.mapPointerOver = this.mapPointerOver.bind(this);
    this.mapPointerUp = this.mapPointerUp.bind(this);
    this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this);
    this.mapWheel = this.mapWheel.bind(this);
    this.mappingTable = {};
    this.addEventMapping("pointerdown", this.mapPointerDown);
    this.addEventMapping("pointermove", this.mapPointerMove);
    this.addEventMapping("pointerout", this.mapPointerOut);
    this.addEventMapping("pointerleave", this.mapPointerOut);
    this.addEventMapping("pointerover", this.mapPointerOver);
    this.addEventMapping("pointerup", this.mapPointerUp);
    this.addEventMapping("pointerupoutside", this.mapPointerUpOutside);
    this.addEventMapping("wheel", this.mapWheel);
  }
  addEventMapping(type, fn) {
    if (!this.mappingTable[type]) {
      this.mappingTable[type] = [];
    }
    this.mappingTable[type].push({
      fn,
      priority: 0
    });
    this.mappingTable[type].sort((a2, b3) => a2.priority - b3.priority);
  }
  dispatchEvent(e3, type) {
    e3.propagationStopped = false;
    e3.propagationImmediatelyStopped = false;
    this.propagate(e3, type);
    this.dispatch.emit(type || e3.type, e3);
  }
  mapEvent(e3) {
    if (!this.rootTarget) {
      return;
    }
    const mappers = this.mappingTable[e3.type];
    if (mappers) {
      for (let i2 = 0, j3 = mappers.length; i2 < j3; i2++) {
        mappers[i2].fn(e3);
      }
    } else {
      console.warn(`[EventBoundary]: Event mapping not defined for ${e3.type}`);
    }
  }
  hitTest(x2, y2) {
    EventsTicker.pauseUpdate = true;
    const useMove = this._isPointerMoveEvent && this.enableGlobalMoveEvents;
    const fn = useMove ? "hitTestMoveRecursive" : "hitTestRecursive";
    const invertedPath = this[fn](this.rootTarget, this.rootTarget.eventMode, tempHitLocation.set(x2, y2), this.hitTestFn, this.hitPruneFn);
    return invertedPath && invertedPath[0];
  }
  propagate(e3, type) {
    if (!e3.target) {
      return;
    }
    const composedPath = e3.composedPath();
    e3.eventPhase = e3.CAPTURING_PHASE;
    for (let i2 = 0, j3 = composedPath.length - 1; i2 < j3; i2++) {
      e3.currentTarget = composedPath[i2];
      this.notifyTarget(e3, type);
      if (e3.propagationStopped || e3.propagationImmediatelyStopped)
        return;
    }
    e3.eventPhase = e3.AT_TARGET;
    e3.currentTarget = e3.target;
    this.notifyTarget(e3, type);
    if (e3.propagationStopped || e3.propagationImmediatelyStopped)
      return;
    e3.eventPhase = e3.BUBBLING_PHASE;
    for (let i2 = composedPath.length - 2; i2 >= 0; i2--) {
      e3.currentTarget = composedPath[i2];
      this.notifyTarget(e3, type);
      if (e3.propagationStopped || e3.propagationImmediatelyStopped)
        return;
    }
  }
  all(e3, type, targets = this._allInteractiveElements) {
    if (targets.length === 0)
      return;
    e3.eventPhase = e3.BUBBLING_PHASE;
    const events = Array.isArray(type) ? type : [type];
    for (let i2 = targets.length - 1; i2 >= 0; i2--) {
      events.forEach((event) => {
        e3.currentTarget = targets[i2];
        this.notifyTarget(e3, event);
      });
    }
  }
  propagationPath(target) {
    const propagationPath = [target];
    for (let i2 = 0; i2 < PROPAGATION_LIMIT && target !== this.rootTarget; i2++) {
      if (!target.parent) {
        throw new Error("Cannot find propagation path to disconnected target");
      }
      propagationPath.push(target.parent);
      target = target.parent;
    }
    propagationPath.reverse();
    return propagationPath;
  }
  hitTestMoveRecursive(currentTarget, eventMode, location, testFn, pruneFn, ignore = false) {
    let shouldReturn = false;
    if (this._interactivePrune(currentTarget))
      return null;
    if (currentTarget.eventMode === "dynamic" || eventMode === "dynamic") {
      EventsTicker.pauseUpdate = false;
    }
    if (currentTarget.interactiveChildren && currentTarget.children) {
      const children = currentTarget.children;
      for (let i2 = children.length - 1; i2 >= 0; i2--) {
        const child = children[i2];
        const nestedHit = this.hitTestMoveRecursive(child, this._isInteractive(eventMode) ? eventMode : child.eventMode, location, testFn, pruneFn, ignore || pruneFn(currentTarget, location));
        if (nestedHit) {
          if (nestedHit.length > 0 && !nestedHit[nestedHit.length - 1].parent) {
            continue;
          }
          const isInteractive = currentTarget.isInteractive();
          if (nestedHit.length > 0 || isInteractive) {
            if (isInteractive)
              this._allInteractiveElements.push(currentTarget);
            nestedHit.push(currentTarget);
          }
          if (this._hitElements.length === 0)
            this._hitElements = nestedHit;
          shouldReturn = true;
        }
      }
    }
    const isInteractiveMode = this._isInteractive(eventMode);
    const isInteractiveTarget = currentTarget.isInteractive();
    if (isInteractiveTarget && isInteractiveTarget)
      this._allInteractiveElements.push(currentTarget);
    if (ignore || this._hitElements.length > 0)
      return null;
    if (shouldReturn)
      return this._hitElements;
    if (isInteractiveMode && (!pruneFn(currentTarget, location) && testFn(currentTarget, location))) {
      return isInteractiveTarget ? [currentTarget] : [];
    }
    return null;
  }
  hitTestRecursive(currentTarget, eventMode, location, testFn, pruneFn) {
    if (this._interactivePrune(currentTarget) || pruneFn(currentTarget, location)) {
      return null;
    }
    if (currentTarget.eventMode === "dynamic" || eventMode === "dynamic") {
      EventsTicker.pauseUpdate = false;
    }
    if (currentTarget.interactiveChildren && currentTarget.children) {
      const children = currentTarget.children;
      for (let i2 = children.length - 1; i2 >= 0; i2--) {
        const child = children[i2];
        const nestedHit = this.hitTestRecursive(child, this._isInteractive(eventMode) ? eventMode : child.eventMode, location, testFn, pruneFn);
        if (nestedHit) {
          if (nestedHit.length > 0 && !nestedHit[nestedHit.length - 1].parent) {
            continue;
          }
          const isInteractive = currentTarget.isInteractive();
          if (nestedHit.length > 0 || isInteractive)
            nestedHit.push(currentTarget);
          return nestedHit;
        }
      }
    }
    const isInteractiveMode = this._isInteractive(eventMode);
    const isInteractiveTarget = currentTarget.isInteractive();
    if (isInteractiveMode && testFn(currentTarget, location)) {
      return isInteractiveTarget ? [currentTarget] : [];
    }
    return null;
  }
  _isInteractive(int) {
    return int === "static" || int === "dynamic";
  }
  _interactivePrune(displayObject) {
    if (!displayObject || displayObject.isMask || !displayObject.visible || !displayObject.renderable) {
      return true;
    }
    if (displayObject.eventMode === "none") {
      return true;
    }
    if (displayObject.eventMode === "passive" && !displayObject.interactiveChildren) {
      return true;
    }
    if (displayObject.isMask) {
      return true;
    }
    return false;
  }
  hitPruneFn(displayObject, location) {
    if (displayObject.hitArea) {
      displayObject.worldTransform.applyInverse(location, tempLocalMapping);
      if (!displayObject.hitArea.contains(tempLocalMapping.x, tempLocalMapping.y)) {
        return true;
      }
    }
    if (displayObject._mask) {
      const maskObject = displayObject._mask.isMaskData ? displayObject._mask.maskObject : displayObject._mask;
      if (maskObject && !maskObject.containsPoint?.(location)) {
        return true;
      }
    }
    return false;
  }
  hitTestFn(displayObject, location) {
    if (displayObject.eventMode === "passive") {
      return false;
    }
    if (displayObject.hitArea) {
      return true;
    }
    if (displayObject.containsPoint) {
      return displayObject.containsPoint(location);
    }
    return false;
  }
  notifyTarget(e3, type) {
    type = type ?? e3.type;
    const handlerKey = `on${type}`;
    e3.currentTarget[handlerKey]?.(e3);
    const key = e3.eventPhase === e3.CAPTURING_PHASE || e3.eventPhase === e3.AT_TARGET ? `${type}capture` : type;
    this.notifyListeners(e3, key);
    if (e3.eventPhase === e3.AT_TARGET) {
      this.notifyListeners(e3, type);
    }
  }
  mapPointerDown(from) {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e3 = this.createPointerEvent(from);
    this.dispatchEvent(e3, "pointerdown");
    if (e3.pointerType === "touch") {
      this.dispatchEvent(e3, "touchstart");
    } else if (e3.pointerType === "mouse" || e3.pointerType === "pen") {
      const isRightButton = e3.button === 2;
      this.dispatchEvent(e3, isRightButton ? "rightdown" : "mousedown");
    }
    const trackingData = this.trackingData(from.pointerId);
    trackingData.pressTargetsByButton[from.button] = e3.composedPath();
    this.freeEvent(e3);
  }
  mapPointerMove(from) {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    this._allInteractiveElements.length = 0;
    this._hitElements.length = 0;
    this._isPointerMoveEvent = true;
    const e3 = this.createPointerEvent(from);
    this._isPointerMoveEvent = false;
    const isMouse = e3.pointerType === "mouse" || e3.pointerType === "pen";
    const trackingData = this.trackingData(from.pointerId);
    const outTarget = this.findMountedTarget(trackingData.overTargets);
    if (trackingData.overTargets?.length > 0 && outTarget !== e3.target) {
      const outType = from.type === "mousemove" ? "mouseout" : "pointerout";
      const outEvent = this.createPointerEvent(from, outType, outTarget);
      this.dispatchEvent(outEvent, "pointerout");
      if (isMouse)
        this.dispatchEvent(outEvent, "mouseout");
      if (!e3.composedPath().includes(outTarget)) {
        const leaveEvent = this.createPointerEvent(from, "pointerleave", outTarget);
        leaveEvent.eventPhase = leaveEvent.AT_TARGET;
        while (leaveEvent.target && !e3.composedPath().includes(leaveEvent.target)) {
          leaveEvent.currentTarget = leaveEvent.target;
          this.notifyTarget(leaveEvent);
          if (isMouse)
            this.notifyTarget(leaveEvent, "mouseleave");
          leaveEvent.target = leaveEvent.target.parent;
        }
        this.freeEvent(leaveEvent);
      }
      this.freeEvent(outEvent);
    }
    if (outTarget !== e3.target) {
      const overType = from.type === "mousemove" ? "mouseover" : "pointerover";
      const overEvent = this.clonePointerEvent(e3, overType);
      this.dispatchEvent(overEvent, "pointerover");
      if (isMouse)
        this.dispatchEvent(overEvent, "mouseover");
      let overTargetAncestor = outTarget?.parent;
      while (overTargetAncestor && overTargetAncestor !== this.rootTarget.parent) {
        if (overTargetAncestor === e3.target)
          break;
        overTargetAncestor = overTargetAncestor.parent;
      }
      const didPointerEnter = !overTargetAncestor || overTargetAncestor === this.rootTarget.parent;
      if (didPointerEnter) {
        const enterEvent = this.clonePointerEvent(e3, "pointerenter");
        enterEvent.eventPhase = enterEvent.AT_TARGET;
        while (enterEvent.target && enterEvent.target !== outTarget && enterEvent.target !== this.rootTarget.parent) {
          enterEvent.currentTarget = enterEvent.target;
          this.notifyTarget(enterEvent);
          if (isMouse)
            this.notifyTarget(enterEvent, "mouseenter");
          enterEvent.target = enterEvent.target.parent;
        }
        this.freeEvent(enterEvent);
      }
      this.freeEvent(overEvent);
    }
    const allMethods = [];
    const allowGlobalPointerEvents = this.enableGlobalMoveEvents ?? true;
    this.moveOnAll ? allMethods.push("pointermove") : this.dispatchEvent(e3, "pointermove");
    allowGlobalPointerEvents && allMethods.push("globalpointermove");
    if (e3.pointerType === "touch") {
      this.moveOnAll ? allMethods.splice(1, 0, "touchmove") : this.dispatchEvent(e3, "touchmove");
      allowGlobalPointerEvents && allMethods.push("globaltouchmove");
    }
    if (isMouse) {
      this.moveOnAll ? allMethods.splice(1, 0, "mousemove") : this.dispatchEvent(e3, "mousemove");
      allowGlobalPointerEvents && allMethods.push("globalmousemove");
      this.cursor = e3.target?.cursor;
    }
    if (allMethods.length > 0) {
      this.all(e3, allMethods);
    }
    this._allInteractiveElements.length = 0;
    this._hitElements.length = 0;
    trackingData.overTargets = e3.composedPath();
    this.freeEvent(e3);
  }
  mapPointerOver(from) {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const trackingData = this.trackingData(from.pointerId);
    const e3 = this.createPointerEvent(from);
    const isMouse = e3.pointerType === "mouse" || e3.pointerType === "pen";
    this.dispatchEvent(e3, "pointerover");
    if (isMouse)
      this.dispatchEvent(e3, "mouseover");
    if (e3.pointerType === "mouse")
      this.cursor = e3.target?.cursor;
    const enterEvent = this.clonePointerEvent(e3, "pointerenter");
    enterEvent.eventPhase = enterEvent.AT_TARGET;
    while (enterEvent.target && enterEvent.target !== this.rootTarget.parent) {
      enterEvent.currentTarget = enterEvent.target;
      this.notifyTarget(enterEvent);
      if (isMouse)
        this.notifyTarget(enterEvent, "mouseenter");
      enterEvent.target = enterEvent.target.parent;
    }
    trackingData.overTargets = e3.composedPath();
    this.freeEvent(e3);
    this.freeEvent(enterEvent);
  }
  mapPointerOut(from) {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const trackingData = this.trackingData(from.pointerId);
    if (trackingData.overTargets) {
      const isMouse = from.pointerType === "mouse" || from.pointerType === "pen";
      const outTarget = this.findMountedTarget(trackingData.overTargets);
      const outEvent = this.createPointerEvent(from, "pointerout", outTarget);
      this.dispatchEvent(outEvent);
      if (isMouse)
        this.dispatchEvent(outEvent, "mouseout");
      const leaveEvent = this.createPointerEvent(from, "pointerleave", outTarget);
      leaveEvent.eventPhase = leaveEvent.AT_TARGET;
      while (leaveEvent.target && leaveEvent.target !== this.rootTarget.parent) {
        leaveEvent.currentTarget = leaveEvent.target;
        this.notifyTarget(leaveEvent);
        if (isMouse)
          this.notifyTarget(leaveEvent, "mouseleave");
        leaveEvent.target = leaveEvent.target.parent;
      }
      trackingData.overTargets = null;
      this.freeEvent(outEvent);
      this.freeEvent(leaveEvent);
    }
    this.cursor = null;
  }
  mapPointerUp(from) {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const now = performance.now();
    const e3 = this.createPointerEvent(from);
    this.dispatchEvent(e3, "pointerup");
    if (e3.pointerType === "touch") {
      this.dispatchEvent(e3, "touchend");
    } else if (e3.pointerType === "mouse" || e3.pointerType === "pen") {
      const isRightButton = e3.button === 2;
      this.dispatchEvent(e3, isRightButton ? "rightup" : "mouseup");
    }
    const trackingData = this.trackingData(from.pointerId);
    const pressTarget = this.findMountedTarget(trackingData.pressTargetsByButton[from.button]);
    let clickTarget = pressTarget;
    if (pressTarget && !e3.composedPath().includes(pressTarget)) {
      let currentTarget = pressTarget;
      while (currentTarget && !e3.composedPath().includes(currentTarget)) {
        e3.currentTarget = currentTarget;
        this.notifyTarget(e3, "pointerupoutside");
        if (e3.pointerType === "touch") {
          this.notifyTarget(e3, "touchendoutside");
        } else if (e3.pointerType === "mouse" || e3.pointerType === "pen") {
          const isRightButton = e3.button === 2;
          this.notifyTarget(e3, isRightButton ? "rightupoutside" : "mouseupoutside");
        }
        currentTarget = currentTarget.parent;
      }
      delete trackingData.pressTargetsByButton[from.button];
      clickTarget = currentTarget;
    }
    if (clickTarget) {
      const clickEvent = this.clonePointerEvent(e3, "click");
      clickEvent.target = clickTarget;
      clickEvent.path = null;
      if (!trackingData.clicksByButton[from.button]) {
        trackingData.clicksByButton[from.button] = {
          clickCount: 0,
          target: clickEvent.target,
          timeStamp: now
        };
      }
      const clickHistory = trackingData.clicksByButton[from.button];
      if (clickHistory.target === clickEvent.target && now - clickHistory.timeStamp < 200) {
        ++clickHistory.clickCount;
      } else {
        clickHistory.clickCount = 1;
      }
      clickHistory.target = clickEvent.target;
      clickHistory.timeStamp = now;
      clickEvent.detail = clickHistory.clickCount;
      if (clickEvent.pointerType === "mouse") {
        const isRightButton = clickEvent.button === 2;
        this.dispatchEvent(clickEvent, isRightButton ? "rightclick" : "click");
      } else if (clickEvent.pointerType === "touch") {
        this.dispatchEvent(clickEvent, "tap");
      }
      this.dispatchEvent(clickEvent, "pointertap");
      this.freeEvent(clickEvent);
    }
    this.freeEvent(e3);
  }
  mapPointerUpOutside(from) {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const trackingData = this.trackingData(from.pointerId);
    const pressTarget = this.findMountedTarget(trackingData.pressTargetsByButton[from.button]);
    const e3 = this.createPointerEvent(from);
    if (pressTarget) {
      let currentTarget = pressTarget;
      while (currentTarget) {
        e3.currentTarget = currentTarget;
        this.notifyTarget(e3, "pointerupoutside");
        if (e3.pointerType === "touch") {
          this.notifyTarget(e3, "touchendoutside");
        } else if (e3.pointerType === "mouse" || e3.pointerType === "pen") {
          this.notifyTarget(e3, e3.button === 2 ? "rightupoutside" : "mouseupoutside");
        }
        currentTarget = currentTarget.parent;
      }
      delete trackingData.pressTargetsByButton[from.button];
    }
    this.freeEvent(e3);
  }
  mapWheel(from) {
    if (!(from instanceof FederatedWheelEvent)) {
      console.warn("EventBoundary cannot map a non-wheel event as a wheel event");
      return;
    }
    const wheelEvent = this.createWheelEvent(from);
    this.dispatchEvent(wheelEvent);
    this.freeEvent(wheelEvent);
  }
  findMountedTarget(propagationPath) {
    if (!propagationPath) {
      return null;
    }
    let currentTarget = propagationPath[0];
    for (let i2 = 1; i2 < propagationPath.length; i2++) {
      if (propagationPath[i2].parent === currentTarget) {
        currentTarget = propagationPath[i2];
      } else {
        break;
      }
    }
    return currentTarget;
  }
  createPointerEvent(from, type, target) {
    const event = this.allocateEvent(FederatedPointerEvent);
    this.copyPointerData(from, event);
    this.copyMouseData(from, event);
    this.copyData(from, event);
    event.nativeEvent = from.nativeEvent;
    event.originalEvent = from;
    event.target = target ?? this.hitTest(event.global.x, event.global.y) ?? this._hitElements[0];
    if (typeof type === "string") {
      event.type = type;
    }
    return event;
  }
  createWheelEvent(from) {
    const event = this.allocateEvent(FederatedWheelEvent);
    this.copyWheelData(from, event);
    this.copyMouseData(from, event);
    this.copyData(from, event);
    event.nativeEvent = from.nativeEvent;
    event.originalEvent = from;
    event.target = this.hitTest(event.global.x, event.global.y);
    return event;
  }
  clonePointerEvent(from, type) {
    const event = this.allocateEvent(FederatedPointerEvent);
    event.nativeEvent = from.nativeEvent;
    event.originalEvent = from.originalEvent;
    this.copyPointerData(from, event);
    this.copyMouseData(from, event);
    this.copyData(from, event);
    event.target = from.target;
    event.path = from.composedPath().slice();
    event.type = type ?? event.type;
    return event;
  }
  copyWheelData(from, to) {
    to.deltaMode = from.deltaMode;
    to.deltaX = from.deltaX;
    to.deltaY = from.deltaY;
    to.deltaZ = from.deltaZ;
  }
  copyPointerData(from, to) {
    if (!(from instanceof FederatedPointerEvent && to instanceof FederatedPointerEvent))
      return;
    to.pointerId = from.pointerId;
    to.width = from.width;
    to.height = from.height;
    to.isPrimary = from.isPrimary;
    to.pointerType = from.pointerType;
    to.pressure = from.pressure;
    to.tangentialPressure = from.tangentialPressure;
    to.tiltX = from.tiltX;
    to.tiltY = from.tiltY;
    to.twist = from.twist;
  }
  copyMouseData(from, to) {
    if (!(from instanceof FederatedMouseEvent && to instanceof FederatedMouseEvent))
      return;
    to.altKey = from.altKey;
    to.button = from.button;
    to.buttons = from.buttons;
    to.client.copyFrom(from.client);
    to.ctrlKey = from.ctrlKey;
    to.metaKey = from.metaKey;
    to.movement.copyFrom(from.movement);
    to.screen.copyFrom(from.screen);
    to.shiftKey = from.shiftKey;
    to.global.copyFrom(from.global);
  }
  copyData(from, to) {
    to.isTrusted = from.isTrusted;
    to.srcElement = from.srcElement;
    to.timeStamp = performance.now();
    to.type = from.type;
    to.detail = from.detail;
    to.view = from.view;
    to.which = from.which;
    to.layer.copyFrom(from.layer);
    to.page.copyFrom(from.page);
  }
  trackingData(id) {
    if (!this.mappingState.trackingData[id]) {
      this.mappingState.trackingData[id] = {
        pressTargetsByButton: {},
        clicksByButton: {},
        overTarget: null
      };
    }
    return this.mappingState.trackingData[id];
  }
  allocateEvent(constructor) {
    if (!this.eventPool.has(constructor)) {
      this.eventPool.set(constructor, []);
    }
    const event = this.eventPool.get(constructor).pop() || new constructor(this);
    event.eventPhase = event.NONE;
    event.currentTarget = null;
    event.path = null;
    event.target = null;
    return event;
  }
  freeEvent(event) {
    if (event.manager !== this)
      throw new Error("It is illegal to free an event not managed by this EventBoundary!");
    const constructor = event.constructor;
    if (!this.eventPool.has(constructor)) {
      this.eventPool.set(constructor, []);
    }
    this.eventPool.get(constructor).push(event);
  }
  notifyListeners(e3, type) {
    const listeners = e3.currentTarget._events[type];
    if (!listeners)
      return;
    if (!e3.currentTarget.isInteractive())
      return;
    if ("fn" in listeners) {
      if (listeners.once)
        e3.currentTarget.removeListener(type, listeners.fn, void 0, true);
      listeners.fn.call(listeners.context, e3);
    } else {
      for (let i2 = 0, j3 = listeners.length; i2 < j3 && !e3.propagationImmediatelyStopped; i2++) {
        if (listeners[i2].once)
          e3.currentTarget.removeListener(type, listeners[i2].fn, void 0, true);
        listeners[i2].fn.call(listeners[i2].context, e3);
      }
    }
  }
};

// ../../node_modules/.pnpm/@pixi+events@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/events/lib/EventSystem.mjs
var MOUSE_POINTER_ID = 1;
var TOUCH_TO_POINTER = {
  touchstart: "pointerdown",
  touchend: "pointerup",
  touchendoutside: "pointerupoutside",
  touchmove: "pointermove",
  touchcancel: "pointercancel"
};
var _EventSystem = class {
  constructor(renderer) {
    this.supportsTouchEvents = "ontouchstart" in globalThis;
    this.supportsPointerEvents = !!globalThis.PointerEvent;
    this.domElement = null;
    this.resolution = 1;
    this.renderer = renderer;
    this.rootBoundary = new EventBoundary(null);
    EventsTicker.init(this);
    this.autoPreventDefault = true;
    this.eventsAdded = false;
    this.rootPointerEvent = new FederatedPointerEvent(null);
    this.rootWheelEvent = new FederatedWheelEvent(null);
    this.cursorStyles = {
      default: "inherit",
      pointer: "pointer"
    };
    this.features = new Proxy({ ..._EventSystem.defaultEventFeatures }, {
      set: (target, key, value) => {
        if (key === "globalMove") {
          this.rootBoundary.enableGlobalMoveEvents = value;
        }
        target[key] = value;
        return true;
      }
    });
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerOverOut = this.onPointerOverOut.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }
  static get defaultEventMode() {
    return this._defaultEventMode;
  }
  init(options) {
    const { view, resolution } = this.renderer;
    this.setTargetElement(view);
    this.resolution = resolution;
    _EventSystem._defaultEventMode = options.eventMode ?? "auto";
    Object.assign(this.features, options.eventFeatures ?? {});
    this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
  }
  resolutionChange(resolution) {
    this.resolution = resolution;
  }
  destroy() {
    this.setTargetElement(null);
    this.renderer = null;
  }
  setCursor(mode) {
    mode = mode || "default";
    let applyStyles = true;
    if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas) {
      applyStyles = false;
    }
    if (this.currentCursor === mode) {
      return;
    }
    this.currentCursor = mode;
    const style = this.cursorStyles[mode];
    if (style) {
      switch (typeof style) {
        case "string":
          if (applyStyles) {
            this.domElement.style.cursor = style;
          }
          break;
        case "function":
          style(mode);
          break;
        case "object":
          if (applyStyles) {
            Object.assign(this.domElement.style, style);
          }
          break;
      }
    } else if (applyStyles && typeof mode === "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, mode)) {
      this.domElement.style.cursor = mode;
    }
  }
  get pointer() {
    return this.rootPointerEvent;
  }
  onPointerDown(nativeEvent) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    if (this.supportsTouchEvents && nativeEvent.pointerType === "touch")
      return;
    const events = this.normalizeToPointerData(nativeEvent);
    if (this.autoPreventDefault && events[0].isNormalized) {
      const cancelable = nativeEvent.cancelable || !("cancelable" in nativeEvent);
      if (cancelable) {
        nativeEvent.preventDefault();
      }
    }
    for (let i2 = 0, j3 = events.length; i2 < j3; i2++) {
      const nativeEvent2 = events[i2];
      const federatedEvent = this.bootstrapEvent(this.rootPointerEvent, nativeEvent2);
      this.rootBoundary.mapEvent(federatedEvent);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  onPointerMove(nativeEvent) {
    if (!this.features.move)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    if (this.supportsTouchEvents && nativeEvent.pointerType === "touch")
      return;
    EventsTicker.pointerMoved();
    const normalizedEvents = this.normalizeToPointerData(nativeEvent);
    for (let i2 = 0, j3 = normalizedEvents.length; i2 < j3; i2++) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvents[i2]);
      this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  onPointerUp(nativeEvent) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    if (this.supportsTouchEvents && nativeEvent.pointerType === "touch")
      return;
    let target = nativeEvent.target;
    if (nativeEvent.composedPath && nativeEvent.composedPath().length > 0) {
      target = nativeEvent.composedPath()[0];
    }
    const outside = target !== this.domElement ? "outside" : "";
    const normalizedEvents = this.normalizeToPointerData(nativeEvent);
    for (let i2 = 0, j3 = normalizedEvents.length; i2 < j3; i2++) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvents[i2]);
      event.type += outside;
      this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  onPointerOverOut(nativeEvent) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    if (this.supportsTouchEvents && nativeEvent.pointerType === "touch")
      return;
    const normalizedEvents = this.normalizeToPointerData(nativeEvent);
    for (let i2 = 0, j3 = normalizedEvents.length; i2 < j3; i2++) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvents[i2]);
      this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  onWheel(nativeEvent) {
    if (!this.features.wheel)
      return;
    const wheelEvent = this.normalizeWheelEvent(nativeEvent);
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    this.rootBoundary.mapEvent(wheelEvent);
  }
  setTargetElement(element) {
    this.removeEvents();
    this.domElement = element;
    EventsTicker.domElement = element;
    this.addEvents();
  }
  addEvents() {
    if (this.eventsAdded || !this.domElement) {
      return;
    }
    EventsTicker.addTickerListener();
    const style = this.domElement.style;
    if (style) {
      if (globalThis.navigator.msPointerEnabled) {
        style.msContentZooming = "none";
        style.msTouchAction = "none";
      } else if (this.supportsPointerEvents) {
        style.touchAction = "none";
      }
    }
    if (this.supportsPointerEvents) {
      globalThis.document.addEventListener("pointermove", this.onPointerMove, true);
      this.domElement.addEventListener("pointerdown", this.onPointerDown, true);
      this.domElement.addEventListener("pointerleave", this.onPointerOverOut, true);
      this.domElement.addEventListener("pointerover", this.onPointerOverOut, true);
      globalThis.addEventListener("pointerup", this.onPointerUp, true);
    } else {
      globalThis.document.addEventListener("mousemove", this.onPointerMove, true);
      this.domElement.addEventListener("mousedown", this.onPointerDown, true);
      this.domElement.addEventListener("mouseout", this.onPointerOverOut, true);
      this.domElement.addEventListener("mouseover", this.onPointerOverOut, true);
      globalThis.addEventListener("mouseup", this.onPointerUp, true);
    }
    if (this.supportsTouchEvents) {
      this.domElement.addEventListener("touchstart", this.onPointerDown, true);
      this.domElement.addEventListener("touchend", this.onPointerUp, true);
      this.domElement.addEventListener("touchmove", this.onPointerMove, true);
    }
    this.domElement.addEventListener("wheel", this.onWheel, {
      passive: true,
      capture: true
    });
    this.eventsAdded = true;
  }
  removeEvents() {
    if (!this.eventsAdded || !this.domElement) {
      return;
    }
    EventsTicker.removeTickerListener();
    const style = this.domElement.style;
    if (globalThis.navigator.msPointerEnabled) {
      style.msContentZooming = "";
      style.msTouchAction = "";
    } else if (this.supportsPointerEvents) {
      style.touchAction = "";
    }
    if (this.supportsPointerEvents) {
      globalThis.document.removeEventListener("pointermove", this.onPointerMove, true);
      this.domElement.removeEventListener("pointerdown", this.onPointerDown, true);
      this.domElement.removeEventListener("pointerleave", this.onPointerOverOut, true);
      this.domElement.removeEventListener("pointerover", this.onPointerOverOut, true);
      globalThis.removeEventListener("pointerup", this.onPointerUp, true);
    } else {
      globalThis.document.removeEventListener("mousemove", this.onPointerMove, true);
      this.domElement.removeEventListener("mousedown", this.onPointerDown, true);
      this.domElement.removeEventListener("mouseout", this.onPointerOverOut, true);
      this.domElement.removeEventListener("mouseover", this.onPointerOverOut, true);
      globalThis.removeEventListener("mouseup", this.onPointerUp, true);
    }
    if (this.supportsTouchEvents) {
      this.domElement.removeEventListener("touchstart", this.onPointerDown, true);
      this.domElement.removeEventListener("touchend", this.onPointerUp, true);
      this.domElement.removeEventListener("touchmove", this.onPointerMove, true);
    }
    this.domElement.removeEventListener("wheel", this.onWheel, true);
    this.domElement = null;
    this.eventsAdded = false;
  }
  mapPositionToPoint(point, x2, y2) {
    let rect;
    if (!this.domElement.parentElement) {
      rect = {
        x: 0,
        y: 0,
        width: this.domElement.width,
        height: this.domElement.height,
        left: 0,
        top: 0
      };
    } else {
      rect = this.domElement.getBoundingClientRect();
    }
    const resolutionMultiplier = 1 / this.resolution;
    point.x = (x2 - rect.left) * (this.domElement.width / rect.width) * resolutionMultiplier;
    point.y = (y2 - rect.top) * (this.domElement.height / rect.height) * resolutionMultiplier;
  }
  normalizeToPointerData(event) {
    const normalizedEvents = [];
    if (this.supportsTouchEvents && event instanceof TouchEvent) {
      for (let i2 = 0, li = event.changedTouches.length; i2 < li; i2++) {
        const touch = event.changedTouches[i2];
        if (typeof touch.button === "undefined")
          touch.button = 0;
        if (typeof touch.buttons === "undefined")
          touch.buttons = 1;
        if (typeof touch.isPrimary === "undefined") {
          touch.isPrimary = event.touches.length === 1 && event.type === "touchstart";
        }
        if (typeof touch.width === "undefined")
          touch.width = touch.radiusX || 1;
        if (typeof touch.height === "undefined")
          touch.height = touch.radiusY || 1;
        if (typeof touch.tiltX === "undefined")
          touch.tiltX = 0;
        if (typeof touch.tiltY === "undefined")
          touch.tiltY = 0;
        if (typeof touch.pointerType === "undefined")
          touch.pointerType = "touch";
        if (typeof touch.pointerId === "undefined")
          touch.pointerId = touch.identifier || 0;
        if (typeof touch.pressure === "undefined")
          touch.pressure = touch.force || 0.5;
        if (typeof touch.twist === "undefined")
          touch.twist = 0;
        if (typeof touch.tangentialPressure === "undefined")
          touch.tangentialPressure = 0;
        if (typeof touch.layerX === "undefined")
          touch.layerX = touch.offsetX = touch.clientX;
        if (typeof touch.layerY === "undefined")
          touch.layerY = touch.offsetY = touch.clientY;
        touch.isNormalized = true;
        touch.type = event.type;
        normalizedEvents.push(touch);
      }
    } else if (!globalThis.MouseEvent || event instanceof MouseEvent && (!this.supportsPointerEvents || !(event instanceof globalThis.PointerEvent))) {
      const tempEvent = event;
      if (typeof tempEvent.isPrimary === "undefined")
        tempEvent.isPrimary = true;
      if (typeof tempEvent.width === "undefined")
        tempEvent.width = 1;
      if (typeof tempEvent.height === "undefined")
        tempEvent.height = 1;
      if (typeof tempEvent.tiltX === "undefined")
        tempEvent.tiltX = 0;
      if (typeof tempEvent.tiltY === "undefined")
        tempEvent.tiltY = 0;
      if (typeof tempEvent.pointerType === "undefined")
        tempEvent.pointerType = "mouse";
      if (typeof tempEvent.pointerId === "undefined")
        tempEvent.pointerId = MOUSE_POINTER_ID;
      if (typeof tempEvent.pressure === "undefined")
        tempEvent.pressure = 0.5;
      if (typeof tempEvent.twist === "undefined")
        tempEvent.twist = 0;
      if (typeof tempEvent.tangentialPressure === "undefined")
        tempEvent.tangentialPressure = 0;
      tempEvent.isNormalized = true;
      normalizedEvents.push(tempEvent);
    } else {
      normalizedEvents.push(event);
    }
    return normalizedEvents;
  }
  normalizeWheelEvent(nativeEvent) {
    const event = this.rootWheelEvent;
    this.transferMouseData(event, nativeEvent);
    event.deltaX = nativeEvent.deltaX;
    event.deltaY = nativeEvent.deltaY;
    event.deltaZ = nativeEvent.deltaZ;
    event.deltaMode = nativeEvent.deltaMode;
    this.mapPositionToPoint(event.screen, nativeEvent.clientX, nativeEvent.clientY);
    event.global.copyFrom(event.screen);
    event.offset.copyFrom(event.screen);
    event.nativeEvent = nativeEvent;
    event.type = nativeEvent.type;
    return event;
  }
  bootstrapEvent(event, nativeEvent) {
    event.originalEvent = null;
    event.nativeEvent = nativeEvent;
    event.pointerId = nativeEvent.pointerId;
    event.width = nativeEvent.width;
    event.height = nativeEvent.height;
    event.isPrimary = nativeEvent.isPrimary;
    event.pointerType = nativeEvent.pointerType;
    event.pressure = nativeEvent.pressure;
    event.tangentialPressure = nativeEvent.tangentialPressure;
    event.tiltX = nativeEvent.tiltX;
    event.tiltY = nativeEvent.tiltY;
    event.twist = nativeEvent.twist;
    this.transferMouseData(event, nativeEvent);
    this.mapPositionToPoint(event.screen, nativeEvent.clientX, nativeEvent.clientY);
    event.global.copyFrom(event.screen);
    event.offset.copyFrom(event.screen);
    event.isTrusted = nativeEvent.isTrusted;
    if (event.type === "pointerleave") {
      event.type = "pointerout";
    }
    if (event.type.startsWith("mouse")) {
      event.type = event.type.replace("mouse", "pointer");
    }
    if (event.type.startsWith("touch")) {
      event.type = TOUCH_TO_POINTER[event.type] || event.type;
    }
    return event;
  }
  transferMouseData(event, nativeEvent) {
    event.isTrusted = nativeEvent.isTrusted;
    event.srcElement = nativeEvent.srcElement;
    event.timeStamp = performance.now();
    event.type = nativeEvent.type;
    event.altKey = nativeEvent.altKey;
    event.button = nativeEvent.button;
    event.buttons = nativeEvent.buttons;
    event.client.x = nativeEvent.clientX;
    event.client.y = nativeEvent.clientY;
    event.ctrlKey = nativeEvent.ctrlKey;
    event.metaKey = nativeEvent.metaKey;
    event.movement.x = nativeEvent.movementX;
    event.movement.y = nativeEvent.movementY;
    event.page.x = nativeEvent.pageX;
    event.page.y = nativeEvent.pageY;
    event.relatedTarget = null;
    event.shiftKey = nativeEvent.shiftKey;
  }
};
var EventSystem = _EventSystem;
EventSystem.extension = {
  name: "events",
  type: [
    ExtensionType.RendererSystem,
    ExtensionType.CanvasRendererSystem
  ]
};
EventSystem.defaultEventFeatures = {
  move: true,
  globalMove: true,
  click: true,
  wheel: true
};
extensions.add(EventSystem);

// ../../node_modules/.pnpm/@pixi+events@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/events/lib/FederatedEventTarget.mjs
function convertEventModeToInteractiveMode(mode) {
  return mode === "dynamic" || mode === "static";
}
var FederatedDisplayObject = {
  onclick: null,
  onmousedown: null,
  onmouseenter: null,
  onmouseleave: null,
  onmousemove: null,
  onglobalmousemove: null,
  onmouseout: null,
  onmouseover: null,
  onmouseup: null,
  onmouseupoutside: null,
  onpointercancel: null,
  onpointerdown: null,
  onpointerenter: null,
  onpointerleave: null,
  onpointermove: null,
  onglobalpointermove: null,
  onpointerout: null,
  onpointerover: null,
  onpointertap: null,
  onpointerup: null,
  onpointerupoutside: null,
  onrightclick: null,
  onrightdown: null,
  onrightup: null,
  onrightupoutside: null,
  ontap: null,
  ontouchcancel: null,
  ontouchend: null,
  ontouchendoutside: null,
  ontouchmove: null,
  onglobaltouchmove: null,
  ontouchstart: null,
  onwheel: null,
  _internalInteractive: void 0,
  get interactive() {
    return this._internalInteractive ?? convertEventModeToInteractiveMode(EventSystem.defaultEventMode);
  },
  set interactive(value) {
    lib_exports.deprecation("7.2.0", `Setting interactive is deprecated, use eventMode = 'none'/'passive'/'auto'/'static'/'dynamic' instead.`);
    this._internalInteractive = value;
    this.eventMode = value ? "static" : "auto";
  },
  _internalEventMode: void 0,
  get eventMode() {
    return this._internalEventMode ?? EventSystem.defaultEventMode;
  },
  set eventMode(value) {
    this._internalInteractive = convertEventModeToInteractiveMode(value);
    this._internalEventMode = value;
  },
  isInteractive() {
    return this.eventMode === "static" || this.eventMode === "dynamic";
  },
  interactiveChildren: true,
  hitArea: null,
  addEventListener(type, listener, options) {
    const capture = typeof options === "boolean" && options || typeof options === "object" && options.capture;
    const context2 = typeof listener === "function" ? void 0 : listener;
    type = capture ? `${type}capture` : type;
    listener = typeof listener === "function" ? listener : listener.handleEvent;
    this.on(type, listener, context2);
  },
  removeEventListener(type, listener, options) {
    const capture = typeof options === "boolean" && options || typeof options === "object" && options.capture;
    const context2 = typeof listener === "function" ? void 0 : listener;
    type = capture ? `${type}capture` : type;
    listener = typeof listener === "function" ? listener : listener.handleEvent;
    this.off(type, listener, context2);
  },
  dispatchEvent(e3) {
    if (!(e3 instanceof FederatedEvent)) {
      throw new Error("DisplayObject cannot propagate events outside of the Federated Events API");
    }
    e3.defaultPrevented = false;
    e3.path = null;
    e3.target = this;
    e3.manager.dispatchEvent(e3);
    return !e3.defaultPrevented;
  }
};
DisplayObject.mixin(FederatedDisplayObject);

// ../../node_modules/.pnpm/@pixi+accessibility@7.2.4_apmmhdndg7szcc4swgeztfmmb4/node_modules/@pixi/accessibility/lib/accessibleTarget.mjs
var accessibleTarget = {
  accessible: false,
  accessibleTitle: null,
  accessibleHint: null,
  tabIndex: 0,
  _accessibleActive: false,
  _accessibleDiv: null,
  accessibleType: "button",
  accessiblePointerEvents: "auto",
  accessibleChildren: true,
  renderId: -1
};

// ../../node_modules/.pnpm/@pixi+accessibility@7.2.4_apmmhdndg7szcc4swgeztfmmb4/node_modules/@pixi/accessibility/lib/AccessibilityManager.mjs
DisplayObject.mixin(accessibleTarget);
var KEY_CODE_TAB = 9;
var DIV_TOUCH_SIZE = 100;
var DIV_TOUCH_POS_X = 0;
var DIV_TOUCH_POS_Y = 0;
var DIV_TOUCH_ZINDEX = 2;
var DIV_HOOK_SIZE = 1;
var DIV_HOOK_POS_X = -1e3;
var DIV_HOOK_POS_Y = -1e3;
var DIV_HOOK_ZINDEX = 2;
var AccessibilityManager = class {
  constructor(renderer) {
    this.debug = false;
    this._isActive = false;
    this._isMobileAccessibility = false;
    this.pool = [];
    this.renderId = 0;
    this.children = [];
    this.androidUpdateCount = 0;
    this.androidUpdateFrequency = 500;
    this._hookDiv = null;
    if (lib_exports.isMobile.tablet || lib_exports.isMobile.phone) {
      this.createTouchHook();
    }
    const div = document.createElement("div");
    div.style.width = `${DIV_TOUCH_SIZE}px`;
    div.style.height = `${DIV_TOUCH_SIZE}px`;
    div.style.position = "absolute";
    div.style.top = `${DIV_TOUCH_POS_X}px`;
    div.style.left = `${DIV_TOUCH_POS_Y}px`;
    div.style.zIndex = DIV_TOUCH_ZINDEX.toString();
    this.div = div;
    this.renderer = renderer;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    globalThis.addEventListener("keydown", this._onKeyDown, false);
  }
  get isActive() {
    return this._isActive;
  }
  get isMobileAccessibility() {
    return this._isMobileAccessibility;
  }
  createTouchHook() {
    const hookDiv = document.createElement("button");
    hookDiv.style.width = `${DIV_HOOK_SIZE}px`;
    hookDiv.style.height = `${DIV_HOOK_SIZE}px`;
    hookDiv.style.position = "absolute";
    hookDiv.style.top = `${DIV_HOOK_POS_X}px`;
    hookDiv.style.left = `${DIV_HOOK_POS_Y}px`;
    hookDiv.style.zIndex = DIV_HOOK_ZINDEX.toString();
    hookDiv.style.backgroundColor = "#FF0000";
    hookDiv.title = "select to enable accessibility for this content";
    hookDiv.addEventListener("focus", () => {
      this._isMobileAccessibility = true;
      this.activate();
      this.destroyTouchHook();
    });
    document.body.appendChild(hookDiv);
    this._hookDiv = hookDiv;
  }
  destroyTouchHook() {
    if (!this._hookDiv) {
      return;
    }
    document.body.removeChild(this._hookDiv);
    this._hookDiv = null;
  }
  activate() {
    if (this._isActive) {
      return;
    }
    this._isActive = true;
    globalThis.document.addEventListener("mousemove", this._onMouseMove, true);
    globalThis.removeEventListener("keydown", this._onKeyDown, false);
    this.renderer.on("postrender", this.update, this);
    this.renderer.view.parentNode?.appendChild(this.div);
  }
  deactivate() {
    if (!this._isActive || this._isMobileAccessibility) {
      return;
    }
    this._isActive = false;
    globalThis.document.removeEventListener("mousemove", this._onMouseMove, true);
    globalThis.addEventListener("keydown", this._onKeyDown, false);
    this.renderer.off("postrender", this.update);
    this.div.parentNode?.removeChild(this.div);
  }
  updateAccessibleObjects(displayObject) {
    if (!displayObject.visible || !displayObject.accessibleChildren) {
      return;
    }
    if (displayObject.accessible && displayObject.isInteractive()) {
      if (!displayObject._accessibleActive) {
        this.addChild(displayObject);
      }
      displayObject.renderId = this.renderId;
    }
    const children = displayObject.children;
    if (children) {
      for (let i2 = 0; i2 < children.length; i2++) {
        this.updateAccessibleObjects(children[i2]);
      }
    }
  }
  update() {
    const now = performance.now();
    if (lib_exports.isMobile.android.device && now < this.androidUpdateCount) {
      return;
    }
    this.androidUpdateCount = now + this.androidUpdateFrequency;
    if (!this.renderer.renderingToScreen) {
      return;
    }
    if (this.renderer.lastObjectRendered) {
      this.updateAccessibleObjects(this.renderer.lastObjectRendered);
    }
    const { x: x2, y: y2, width, height } = this.renderer.view.getBoundingClientRect();
    const { width: viewWidth, height: viewHeight, resolution } = this.renderer;
    const sx = width / viewWidth * resolution;
    const sy = height / viewHeight * resolution;
    let div = this.div;
    div.style.left = `${x2}px`;
    div.style.top = `${y2}px`;
    div.style.width = `${viewWidth}px`;
    div.style.height = `${viewHeight}px`;
    for (let i2 = 0; i2 < this.children.length; i2++) {
      const child = this.children[i2];
      if (child.renderId !== this.renderId) {
        child._accessibleActive = false;
        lib_exports.removeItems(this.children, i2, 1);
        this.div.removeChild(child._accessibleDiv);
        this.pool.push(child._accessibleDiv);
        child._accessibleDiv = null;
        i2--;
      } else {
        div = child._accessibleDiv;
        let hitArea = child.hitArea;
        const wt = child.worldTransform;
        if (child.hitArea) {
          div.style.left = `${(wt.tx + hitArea.x * wt.a) * sx}px`;
          div.style.top = `${(wt.ty + hitArea.y * wt.d) * sy}px`;
          div.style.width = `${hitArea.width * wt.a * sx}px`;
          div.style.height = `${hitArea.height * wt.d * sy}px`;
        } else {
          hitArea = child.getBounds();
          this.capHitArea(hitArea);
          div.style.left = `${hitArea.x * sx}px`;
          div.style.top = `${hitArea.y * sy}px`;
          div.style.width = `${hitArea.width * sx}px`;
          div.style.height = `${hitArea.height * sy}px`;
          if (div.title !== child.accessibleTitle && child.accessibleTitle !== null) {
            div.title = child.accessibleTitle;
          }
          if (div.getAttribute("aria-label") !== child.accessibleHint && child.accessibleHint !== null) {
            div.setAttribute("aria-label", child.accessibleHint);
          }
        }
        if (child.accessibleTitle !== div.title || child.tabIndex !== div.tabIndex) {
          div.title = child.accessibleTitle;
          div.tabIndex = child.tabIndex;
          if (this.debug)
            this.updateDebugHTML(div);
        }
      }
    }
    this.renderId++;
  }
  updateDebugHTML(div) {
    div.innerHTML = `type: ${div.type}</br> title : ${div.title}</br> tabIndex: ${div.tabIndex}`;
  }
  capHitArea(hitArea) {
    if (hitArea.x < 0) {
      hitArea.width += hitArea.x;
      hitArea.x = 0;
    }
    if (hitArea.y < 0) {
      hitArea.height += hitArea.y;
      hitArea.y = 0;
    }
    const { width: viewWidth, height: viewHeight } = this.renderer;
    if (hitArea.x + hitArea.width > viewWidth) {
      hitArea.width = viewWidth - hitArea.x;
    }
    if (hitArea.y + hitArea.height > viewHeight) {
      hitArea.height = viewHeight - hitArea.y;
    }
  }
  addChild(displayObject) {
    let div = this.pool.pop();
    if (!div) {
      div = document.createElement("button");
      div.style.width = `${DIV_TOUCH_SIZE}px`;
      div.style.height = `${DIV_TOUCH_SIZE}px`;
      div.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent";
      div.style.position = "absolute";
      div.style.zIndex = DIV_TOUCH_ZINDEX.toString();
      div.style.borderStyle = "none";
      if (navigator.userAgent.toLowerCase().includes("chrome")) {
        div.setAttribute("aria-live", "off");
      } else {
        div.setAttribute("aria-live", "polite");
      }
      if (navigator.userAgent.match(/rv:.*Gecko\//)) {
        div.setAttribute("aria-relevant", "additions");
      } else {
        div.setAttribute("aria-relevant", "text");
      }
      div.addEventListener("click", this._onClick.bind(this));
      div.addEventListener("focus", this._onFocus.bind(this));
      div.addEventListener("focusout", this._onFocusOut.bind(this));
    }
    div.style.pointerEvents = displayObject.accessiblePointerEvents;
    div.type = displayObject.accessibleType;
    if (displayObject.accessibleTitle && displayObject.accessibleTitle !== null) {
      div.title = displayObject.accessibleTitle;
    } else if (!displayObject.accessibleHint || displayObject.accessibleHint === null) {
      div.title = `displayObject ${displayObject.tabIndex}`;
    }
    if (displayObject.accessibleHint && displayObject.accessibleHint !== null) {
      div.setAttribute("aria-label", displayObject.accessibleHint);
    }
    if (this.debug)
      this.updateDebugHTML(div);
    displayObject._accessibleActive = true;
    displayObject._accessibleDiv = div;
    div.displayObject = displayObject;
    this.children.push(displayObject);
    this.div.appendChild(displayObject._accessibleDiv);
    displayObject._accessibleDiv.tabIndex = displayObject.tabIndex;
  }
  _dispatchEvent(e3, type) {
    const { displayObject: target } = e3.target;
    const boundry = this.renderer.events.rootBoundary;
    const event = Object.assign(new FederatedEvent(boundry), { target });
    boundry.rootTarget = this.renderer.lastObjectRendered;
    type.forEach((type2) => boundry.dispatchEvent(event, type2));
  }
  _onClick(e3) {
    this._dispatchEvent(e3, ["click", "pointertap", "tap"]);
  }
  _onFocus(e3) {
    if (!e3.target.getAttribute("aria-live")) {
      e3.target.setAttribute("aria-live", "assertive");
    }
    this._dispatchEvent(e3, ["mouseover"]);
  }
  _onFocusOut(e3) {
    if (!e3.target.getAttribute("aria-live")) {
      e3.target.setAttribute("aria-live", "polite");
    }
    this._dispatchEvent(e3, ["mouseout"]);
  }
  _onKeyDown(e3) {
    if (e3.keyCode !== KEY_CODE_TAB) {
      return;
    }
    this.activate();
  }
  _onMouseMove(e3) {
    if (e3.movementX === 0 && e3.movementY === 0) {
      return;
    }
    this.deactivate();
  }
  destroy() {
    this.destroyTouchHook();
    this.div = null;
    globalThis.document.removeEventListener("mousemove", this._onMouseMove, true);
    globalThis.removeEventListener("keydown", this._onKeyDown);
    this.pool = null;
    this.children = null;
    this.renderer = null;
  }
};
AccessibilityManager.extension = {
  name: "accessibility",
  type: [
    ExtensionType.RendererPlugin,
    ExtensionType.CanvasRendererPlugin
  ]
};
extensions.add(AccessibilityManager);

// ../../node_modules/.pnpm/@pixi+app@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/app/lib/Application.mjs
var _Application = class {
  constructor(options) {
    this.stage = new Container();
    options = Object.assign({
      forceCanvas: false
    }, options);
    this.renderer = autoDetectRenderer(options);
    _Application._plugins.forEach((plugin) => {
      plugin.init.call(this, options);
    });
  }
  render() {
    this.renderer.render(this.stage);
  }
  get view() {
    return this.renderer.view;
  }
  get screen() {
    return this.renderer.screen;
  }
  destroy(removeView, stageOptions) {
    const plugins = _Application._plugins.slice(0);
    plugins.reverse();
    plugins.forEach((plugin) => {
      plugin.destroy.call(this);
    });
    this.stage.destroy(stageOptions);
    this.stage = null;
    this.renderer.destroy(removeView);
    this.renderer = null;
  }
};
var Application = _Application;
Application._plugins = [];
extensions.handleByList(ExtensionType.Application, Application._plugins);

// ../../node_modules/.pnpm/@pixi+app@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/app/lib/ResizePlugin.mjs
var ResizePlugin = class {
  static init(options) {
    Object.defineProperty(this, "resizeTo", {
      set(dom) {
        globalThis.removeEventListener("resize", this.queueResize);
        this._resizeTo = dom;
        if (dom) {
          globalThis.addEventListener("resize", this.queueResize);
          this.resize();
        }
      },
      get() {
        return this._resizeTo;
      }
    });
    this.queueResize = () => {
      if (!this._resizeTo) {
        return;
      }
      this.cancelResize();
      this._resizeId = requestAnimationFrame(() => this.resize());
    };
    this.cancelResize = () => {
      if (this._resizeId) {
        cancelAnimationFrame(this._resizeId);
        this._resizeId = null;
      }
    };
    this.resize = () => {
      if (!this._resizeTo) {
        return;
      }
      this.cancelResize();
      let width;
      let height;
      if (this._resizeTo === globalThis.window) {
        width = globalThis.innerWidth;
        height = globalThis.innerHeight;
      } else {
        const { clientWidth, clientHeight } = this._resizeTo;
        width = clientWidth;
        height = clientHeight;
      }
      this.renderer.resize(width, height);
      this.render();
    };
    this._resizeId = null;
    this._resizeTo = null;
    this.resizeTo = options.resizeTo || null;
  }
  static destroy() {
    globalThis.removeEventListener("resize", this.queueResize);
    this.cancelResize();
    this.cancelResize = null;
    this.queueResize = null;
    this.resizeTo = null;
    this.resize = null;
  }
};
ResizePlugin.extension = ExtensionType.Application;
extensions.add(ResizePlugin);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/AssetExtension.mjs
var assetKeyMap = {
  loader: ExtensionType.LoadParser,
  resolver: ExtensionType.ResolveParser,
  cache: ExtensionType.CacheParser,
  detection: ExtensionType.DetectionParser
};
extensions.handle(ExtensionType.Asset, (extension) => {
  const ref = extension.ref;
  Object.entries(assetKeyMap).filter(([key]) => !!ref[key]).forEach(([key, type]) => extensions.add(Object.assign(ref[key], { extension: ref[key].extension ?? type })));
}, (extension) => {
  const ref = extension.ref;
  Object.keys(assetKeyMap).filter((key) => !!ref[key]).forEach((key) => extensions.remove(ref[key]));
});

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/BackgroundLoader.mjs
var BackgroundLoader = class {
  constructor(loader, verbose = false) {
    this._loader = loader;
    this._assetList = [];
    this._isLoading = false;
    this._maxConcurrent = 1;
    this.verbose = verbose;
  }
  add(assetUrls) {
    assetUrls.forEach((a2) => {
      this._assetList.push(a2);
    });
    if (this.verbose)
      console.log("[BackgroundLoader] assets: ", this._assetList);
    if (this._isActive && !this._isLoading) {
      this._next();
    }
  }
  async _next() {
    if (this._assetList.length && this._isActive) {
      this._isLoading = true;
      const toLoad = [];
      const toLoadAmount = Math.min(this._assetList.length, this._maxConcurrent);
      for (let i2 = 0; i2 < toLoadAmount; i2++) {
        toLoad.push(this._assetList.pop());
      }
      await this._loader.load(toLoad);
      this._isLoading = false;
      this._next();
    }
  }
  get active() {
    return this._isActive;
  }
  set active(value) {
    if (this._isActive === value)
      return;
    this._isActive = value;
    if (value && !this._isLoading) {
      this._next();
    }
  }
};

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/utils/checkDataUrl.mjs
function checkDataUrl(url2, mimes) {
  if (Array.isArray(mimes)) {
    for (const mime of mimes) {
      if (url2.startsWith(`data:${mime}`))
        return true;
    }
    return false;
  }
  return url2.startsWith(`data:${mimes}`);
}

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/utils/checkExtension.mjs
function checkExtension(url2, extension) {
  const tempURL = url2.split("?")[0];
  const ext = lib_exports.path.extname(tempURL).toLowerCase();
  if (Array.isArray(extension)) {
    return extension.includes(ext);
  }
  return ext === extension;
}

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/utils/convertToList.mjs
var convertToList = (input, transform) => {
  if (!Array.isArray(input)) {
    input = [input];
  }
  if (!transform) {
    return input;
  }
  return input.map((item) => {
    if (typeof item === "string") {
      return transform(item);
    }
    return item;
  });
};

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/utils/copySearchParams.mjs
var copySearchParams = (targetUrl, sourceUrl) => {
  const searchParams = sourceUrl.split("?")[1];
  if (searchParams) {
    targetUrl += `?${searchParams}`;
  }
  return targetUrl;
};

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/utils/createStringVariations.mjs
function processX(base, ids, depth, result, tags) {
  const id = ids[depth];
  for (let i2 = 0; i2 < id.length; i2++) {
    const value = id[i2];
    if (depth < ids.length - 1) {
      processX(base.replace(result[depth], value), ids, depth + 1, result, tags);
    } else {
      tags.push(base.replace(result[depth], value));
    }
  }
}
function createStringVariations(string) {
  const regex = /\{(.*?)\}/g;
  const result = string.match(regex);
  const tags = [];
  if (result) {
    const ids = [];
    result.forEach((vars) => {
      const split = vars.substring(1, vars.length - 1).split(",");
      ids.push(split);
    });
    processX(string, ids, 0, result, tags);
  } else {
    tags.push(string);
  }
  return tags;
}

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/utils/isSingleItem.mjs
var isSingleItem = (item) => !Array.isArray(item);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/cache/Cache.mjs
var CacheClass = class {
  constructor() {
    this._parsers = [];
    this._cache = /* @__PURE__ */ new Map();
    this._cacheMap = /* @__PURE__ */ new Map();
  }
  reset() {
    this._cacheMap.clear();
    this._cache.clear();
  }
  has(key) {
    return this._cache.has(key);
  }
  get(key) {
    const result = this._cache.get(key);
    if (!result) {
      console.warn(`[Assets] Asset id ${key} was not found in the Cache`);
    }
    return result;
  }
  set(key, value) {
    const keys = convertToList(key);
    let cacheableAssets;
    for (let i2 = 0; i2 < this.parsers.length; i2++) {
      const parser = this.parsers[i2];
      if (parser.test(value)) {
        cacheableAssets = parser.getCacheableAssets(keys, value);
        break;
      }
    }
    if (!cacheableAssets) {
      cacheableAssets = {};
      keys.forEach((key2) => {
        cacheableAssets[key2] = value;
      });
    }
    const cacheKeys = Object.keys(cacheableAssets);
    const cachedAssets = {
      cacheKeys,
      keys
    };
    keys.forEach((key2) => {
      this._cacheMap.set(key2, cachedAssets);
    });
    cacheKeys.forEach((key2) => {
      if (this._cache.has(key2) && this._cache.get(key2) !== value) {
        console.warn("[Cache] already has key:", key2);
      }
      this._cache.set(key2, cacheableAssets[key2]);
    });
    if (value instanceof Texture) {
      const texture = value;
      keys.forEach((key2) => {
        if (texture.baseTexture !== Texture.EMPTY.baseTexture) {
          BaseTexture.addToCache(texture.baseTexture, key2);
        }
        Texture.addToCache(texture, key2);
      });
    }
  }
  remove(key) {
    this._cacheMap.get(key);
    if (!this._cacheMap.has(key)) {
      console.warn(`[Assets] Asset id ${key} was not found in the Cache`);
      return;
    }
    const cacheMap = this._cacheMap.get(key);
    const cacheKeys = cacheMap.cacheKeys;
    cacheKeys.forEach((key2) => {
      this._cache.delete(key2);
    });
    cacheMap.keys.forEach((key2) => {
      this._cacheMap.delete(key2);
    });
  }
  get parsers() {
    return this._parsers;
  }
};
var Cache = new CacheClass();

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/loader/Loader.mjs
var Loader = class {
  constructor() {
    this._parsers = [];
    this._parsersValidated = false;
    this.parsers = new Proxy(this._parsers, {
      set: (target, key, value) => {
        this._parsersValidated = false;
        target[key] = value;
        return true;
      }
    });
    this.promiseCache = {};
  }
  reset() {
    this._parsersValidated = false;
    this.promiseCache = {};
  }
  _getLoadPromiseAndParser(url2, data) {
    const result = {
      promise: null,
      parser: null
    };
    result.promise = (async () => {
      let asset = null;
      let parser = null;
      if (data.loadParser) {
        parser = this._parserHash[data.loadParser];
        if (!parser) {
          console.warn(`[Assets] specified load parser "${data.loadParser}" not found while loading ${url2}`);
        }
      }
      if (!parser) {
        for (let i2 = 0; i2 < this.parsers.length; i2++) {
          const parserX = this.parsers[i2];
          if (parserX.load && parserX.test?.(url2, data, this)) {
            parser = parserX;
            break;
          }
        }
        if (!parser) {
          console.warn(`[Assets] ${url2} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`);
          return null;
        }
      }
      asset = await parser.load(url2, data, this);
      result.parser = parser;
      for (let i2 = 0; i2 < this.parsers.length; i2++) {
        const parser2 = this.parsers[i2];
        if (parser2.parse) {
          if (parser2.parse && await parser2.testParse?.(asset, data, this)) {
            asset = await parser2.parse(asset, data, this) || asset;
            result.parser = parser2;
          }
        }
      }
      return asset;
    })();
    return result;
  }
  async load(assetsToLoadIn, onProgress) {
    if (!this._parsersValidated) {
      this._validateParsers();
    }
    let count = 0;
    const assets = {};
    const singleAsset = isSingleItem(assetsToLoadIn);
    const assetsToLoad = convertToList(assetsToLoadIn, (item) => ({
      src: item
    }));
    const total = assetsToLoad.length;
    const promises = assetsToLoad.map(async (asset) => {
      const url2 = lib_exports.path.toAbsolute(asset.src);
      if (!assets[asset.src]) {
        try {
          if (!this.promiseCache[url2]) {
            this.promiseCache[url2] = this._getLoadPromiseAndParser(url2, asset);
          }
          assets[asset.src] = await this.promiseCache[url2].promise;
          if (onProgress)
            onProgress(++count / total);
        } catch (e3) {
          delete this.promiseCache[url2];
          delete assets[asset.src];
          throw new Error(`[Loader.load] Failed to load ${url2}.
${e3}`);
        }
      }
    });
    await Promise.all(promises);
    return singleAsset ? assets[assetsToLoad[0].src] : assets;
  }
  async unload(assetsToUnloadIn) {
    const assetsToUnload = convertToList(assetsToUnloadIn, (item) => ({
      src: item
    }));
    const promises = assetsToUnload.map(async (asset) => {
      const url2 = lib_exports.path.toAbsolute(asset.src);
      const loadPromise = this.promiseCache[url2];
      if (loadPromise) {
        const loadedAsset = await loadPromise.promise;
        loadPromise.parser?.unload?.(loadedAsset, asset, this);
        delete this.promiseCache[url2];
      }
    });
    await Promise.all(promises);
  }
  _validateParsers() {
    this._parsersValidated = true;
    this._parserHash = this._parsers.filter((parser) => parser.name).reduce((hash, parser) => {
      if (hash[parser.name]) {
        console.warn(`[Assets] loadParser name conflict "${parser.name}"`);
      }
      return { ...hash, [parser.name]: parser };
    }, {});
  }
};

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/loader/parsers/LoaderParser.mjs
var LoaderParserPriority = /* @__PURE__ */ ((LoaderParserPriority2) => {
  LoaderParserPriority2[LoaderParserPriority2["Low"] = 0] = "Low";
  LoaderParserPriority2[LoaderParserPriority2["Normal"] = 1] = "Normal";
  LoaderParserPriority2[LoaderParserPriority2["High"] = 2] = "High";
  return LoaderParserPriority2;
})(LoaderParserPriority || {});

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/loader/parsers/loadJson.mjs
var validJSONExtension = ".json";
var validJSONMIME = "application/json";
var loadJson = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  name: "loadJson",
  test(url2) {
    return checkDataUrl(url2, validJSONMIME) || checkExtension(url2, validJSONExtension);
  },
  async load(url2) {
    const response = await settings.ADAPTER.fetch(url2);
    const json = await response.json();
    return json;
  }
};
extensions.add(loadJson);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/loader/parsers/loadTxt.mjs
var validTXTExtension = ".txt";
var validTXTMIME = "text/plain";
var loadTxt = {
  name: "loadTxt",
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  test(url2) {
    return checkDataUrl(url2, validTXTMIME) || checkExtension(url2, validTXTExtension);
  },
  async load(url2) {
    const response = await settings.ADAPTER.fetch(url2);
    const txt = await response.text();
    return txt;
  }
};
extensions.add(loadTxt);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/loader/parsers/loadWebFont.mjs
var validWeights = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
];
var validFontExtensions = [".ttf", ".otf", ".woff", ".woff2"];
var validFontMIMEs = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
];
var CSS_IDENT_TOKEN_REGEX = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function getFontFamilyName(url2) {
  const ext = lib_exports.path.extname(url2);
  const name = lib_exports.path.basename(url2, ext);
  const nameWithSpaces = name.replace(/(-|_)/g, " ");
  const nameTokens = nameWithSpaces.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  let valid = nameTokens.length > 0;
  for (const token of nameTokens) {
    if (!token.match(CSS_IDENT_TOKEN_REGEX)) {
      valid = false;
      break;
    }
  }
  let fontFamilyName = nameTokens.join(" ");
  if (!valid) {
    fontFamilyName = `"${fontFamilyName.replace(/[\\"]/g, "\\$&")}"`;
  }
  return fontFamilyName;
}
var loadWebFont = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  name: "loadWebFont",
  test(url2) {
    return checkDataUrl(url2, validFontMIMEs) || checkExtension(url2, validFontExtensions);
  },
  async load(url2, options) {
    const fonts = settings.ADAPTER.getFontFaceSet();
    if (fonts) {
      const fontFaces = [];
      const name = options.data?.family ?? getFontFamilyName(url2);
      const weights = options.data?.weights?.filter((weight) => validWeights.includes(weight)) ?? ["normal"];
      const data = options.data ?? {};
      for (let i2 = 0; i2 < weights.length; i2++) {
        const weight = weights[i2];
        const font = new FontFace(name, `url(${encodeURI(url2)})`, {
          ...data,
          weight
        });
        await font.load();
        fonts.add(font);
        fontFaces.push(font);
      }
      return fontFaces.length === 1 ? fontFaces[0] : fontFaces;
    }
    console.warn("[loadWebFont] FontFace API is not supported. Skipping loading font");
    return null;
  },
  unload(font) {
    (Array.isArray(font) ? font : [font]).forEach((t2) => settings.ADAPTER.getFontFaceSet().delete(t2));
  }
};
extensions.add(loadWebFont);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/loader/parsers/WorkerManager.mjs
var UUID = 0;
var MAX_WORKERS;
var WHITE_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
var checkImageBitmapCode = {
  id: "checkImageBitmap",
  code: `
    async function checkImageBitmap()
    {
        try
        {
            if (typeof createImageBitmap !== 'function') return false;

            const response = await fetch('${WHITE_PNG}');
            const imageBlob =  await response.blob();
            const imageBitmap = await createImageBitmap(imageBlob);

            return imageBitmap.width === 1 && imageBitmap.height === 1;
        }
        catch (e)
        {
            return false;
        }
    }
    checkImageBitmap().then((result) => { self.postMessage(result); });
    `
};
var workerCode = {
  id: "loadImageBitmap",
  code: `
    async function loadImageBitmap(url)
    {
        const response = await fetch(url);

        if (!response.ok)
        {
            throw new Error(\`[WorkerManager.loadImageBitmap] Failed to fetch \${url}: \`
                + \`\${response.status} \${response.statusText}\`);
        }

        const imageBlob =  await response.blob();
        const imageBitmap = await createImageBitmap(imageBlob);

        return imageBitmap;
    }
    self.onmessage = async (event) =>
    {
        try
        {
            const imageBitmap = await loadImageBitmap(event.data.data[0]);

            self.postMessage({
                data: imageBitmap,
                uuid: event.data.uuid,
                id: event.data.id,
            }, [imageBitmap]);
        }
        catch(e)
        {
            self.postMessage({
                error: e,
                uuid: event.data.uuid,
                id: event.data.id,
            });
        }
    };`
};
var workerURL;
var WorkerManagerClass = class {
  constructor() {
    this._initialized = false;
    this._createdWorkers = 0;
    this.workerPool = [];
    this.queue = [];
    this.resolveHash = {};
  }
  isImageBitmapSupported() {
    if (this._isImageBitmapSupported !== void 0)
      return this._isImageBitmapSupported;
    this._isImageBitmapSupported = new Promise((resolve2) => {
      const workerURL2 = URL.createObjectURL(new Blob([checkImageBitmapCode.code], { type: "application/javascript" }));
      const worker = new Worker(workerURL2);
      worker.addEventListener("message", (event) => {
        worker.terminate();
        URL.revokeObjectURL(workerURL2);
        resolve2(event.data);
      });
    });
    return this._isImageBitmapSupported;
  }
  loadImageBitmap(src) {
    return this._run("loadImageBitmap", [src]);
  }
  async _initWorkers() {
    if (this._initialized)
      return;
    this._initialized = true;
  }
  getWorker() {
    if (MAX_WORKERS === void 0) {
      MAX_WORKERS = navigator.hardwareConcurrency || 4;
    }
    let worker = this.workerPool.pop();
    if (!worker && this._createdWorkers < MAX_WORKERS) {
      if (!workerURL) {
        workerURL = URL.createObjectURL(new Blob([workerCode.code], { type: "application/javascript" }));
      }
      this._createdWorkers++;
      worker = new Worker(workerURL);
      worker.addEventListener("message", (event) => {
        this.complete(event.data);
        this.returnWorker(event.target);
        this.next();
      });
    }
    return worker;
  }
  returnWorker(worker) {
    this.workerPool.push(worker);
  }
  complete(data) {
    if (data.error !== void 0) {
      this.resolveHash[data.uuid].reject(data.error);
    } else {
      this.resolveHash[data.uuid].resolve(data.data);
    }
    this.resolveHash[data.uuid] = null;
  }
  async _run(id, args) {
    await this._initWorkers();
    const promise = new Promise((resolve2, reject) => {
      this.queue.push({ id, arguments: args, resolve: resolve2, reject });
    });
    this.next();
    return promise;
  }
  next() {
    if (!this.queue.length)
      return;
    const worker = this.getWorker();
    if (!worker) {
      return;
    }
    const toDo = this.queue.pop();
    const id = toDo.id;
    this.resolveHash[UUID] = { resolve: toDo.resolve, reject: toDo.reject };
    worker.postMessage({
      data: toDo.arguments,
      uuid: UUID++,
      id
    });
  }
};
var WorkerManager = new WorkerManagerClass();

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/loader/parsers/textures/utils/createTexture.mjs
function createTexture(base, loader, url2) {
  const texture = new Texture(base);
  texture.baseTexture.on("dispose", () => {
    delete loader.promiseCache[url2];
  });
  return texture;
}

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/loader/parsers/textures/loadTextures.mjs
var validImageExtensions = [".jpeg", ".jpg", ".png", ".webp", ".avif"];
var validImageMIMEs = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function loadImageBitmap(url2) {
  const response = await settings.ADAPTER.fetch(url2);
  if (!response.ok) {
    throw new Error(`[loadImageBitmap] Failed to fetch ${url2}: ${response.status} ${response.statusText}`);
  }
  const imageBlob = await response.blob();
  const imageBitmap = await createImageBitmap(imageBlob);
  return imageBitmap;
}
var loadTextures = {
  name: "loadTextures",
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High
  },
  config: {
    preferWorkers: true,
    preferCreateImageBitmap: true,
    crossOrigin: "anonymous"
  },
  test(url2) {
    return checkDataUrl(url2, validImageMIMEs) || checkExtension(url2, validImageExtensions);
  },
  async load(url2, asset, loader) {
    let src = null;
    if (globalThis.createImageBitmap && this.config.preferCreateImageBitmap) {
      if (this.config.preferWorkers && await WorkerManager.isImageBitmapSupported()) {
        src = await WorkerManager.loadImageBitmap(url2);
      } else {
        src = await loadImageBitmap(url2);
      }
    } else {
      src = await new Promise((resolve2) => {
        src = new Image();
        src.crossOrigin = this.config.crossOrigin;
        src.src = url2;
        if (src.complete) {
          resolve2(src);
        } else {
          src.onload = () => {
            resolve2(src);
          };
        }
      });
    }
    const base = new BaseTexture(src, {
      resolution: lib_exports.getResolutionOfUrl(url2),
      ...asset.data
    });
    base.resource.src = url2;
    return createTexture(base, loader, url2);
  },
  unload(texture) {
    texture.destroy(true);
  }
};
extensions.add(loadTextures);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/loader/parsers/textures/loadSVG.mjs
var validSVGExtension = ".svg";
var validSVGMIME = "image/svg+xml";
var loadSVG = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High
  },
  name: "loadSVG",
  test(url2) {
    return checkDataUrl(url2, validSVGMIME) || checkExtension(url2, validSVGExtension);
  },
  async testParse(data) {
    return SVGResource.test(data);
  },
  async parse(asset, data, loader) {
    const src = new SVGResource(asset, data?.data?.resourceOptions);
    await src.load();
    const base = new BaseTexture(src, {
      resolution: lib_exports.getResolutionOfUrl(asset),
      ...data?.data
    });
    base.resource.src = asset;
    const texture = createTexture(base, loader, asset);
    return texture;
  },
  async load(url2, _options) {
    const response = await settings.ADAPTER.fetch(url2);
    return response.text();
  },
  unload: loadTextures.unload
};
extensions.add(loadSVG);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/resolver/Resolver.mjs
var Resolver = class {
  constructor() {
    this._defaultBundleIdentifierOptions = {
      connector: "-",
      createBundleAssetId: (bundleId, assetId) => `${bundleId}${this._bundleIdConnector}${assetId}`,
      extractAssetIdFromBundle: (bundleId, assetBundleId) => assetBundleId.replace(`${bundleId}${this._bundleIdConnector}`, "")
    };
    this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector;
    this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId;
    this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle;
    this._assetMap = {};
    this._preferredOrder = [];
    this._parsers = [];
    this._resolverHash = {};
    this._bundles = {};
  }
  setBundleIdentifier(bundleIdentifier) {
    this._bundleIdConnector = bundleIdentifier.connector ?? this._bundleIdConnector;
    this._createBundleAssetId = bundleIdentifier.createBundleAssetId ?? this._createBundleAssetId;
    this._extractAssetIdFromBundle = bundleIdentifier.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle;
    if (this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar") {
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
    }
  }
  prefer(...preferOrders) {
    preferOrders.forEach((prefer) => {
      this._preferredOrder.push(prefer);
      if (!prefer.priority) {
        prefer.priority = Object.keys(prefer.params);
      }
    });
    this._resolverHash = {};
  }
  set basePath(basePath) {
    this._basePath = basePath;
  }
  get basePath() {
    return this._basePath;
  }
  set rootPath(rootPath) {
    this._rootPath = rootPath;
  }
  get rootPath() {
    return this._rootPath;
  }
  get parsers() {
    return this._parsers;
  }
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions);
    this._assetMap = {};
    this._preferredOrder = [];
    this._resolverHash = {};
    this._rootPath = null;
    this._basePath = null;
    this._manifest = null;
    this._bundles = {};
    this._defaultSearchParams = null;
  }
  setDefaultSearchParams(searchParams) {
    if (typeof searchParams === "string") {
      this._defaultSearchParams = searchParams;
    } else {
      const queryValues = searchParams;
      this._defaultSearchParams = Object.keys(queryValues).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryValues[key])}`).join("&");
    }
  }
  addManifest(manifest) {
    if (this._manifest) {
      console.warn("[Resolver] Manifest already exists, this will be overwritten");
    }
    this._manifest = manifest;
    manifest.bundles.forEach((bundle) => {
      this.addBundle(bundle.name, bundle.assets);
    });
  }
  addBundle(bundleId, assets) {
    const assetNames = [];
    if (Array.isArray(assets)) {
      assets.forEach((asset) => {
        if (typeof asset.name === "string") {
          const bundleAssetId = this._createBundleAssetId(bundleId, asset.name);
          assetNames.push(bundleAssetId);
          this.add([asset.name, bundleAssetId], asset.srcs, asset.data);
        } else {
          const bundleIds = asset.name.map((name) => this._createBundleAssetId(bundleId, name));
          bundleIds.forEach((bundleId2) => {
            assetNames.push(bundleId2);
          });
          this.add([...asset.name, ...bundleIds], asset.srcs);
        }
      });
    } else {
      Object.keys(assets).forEach((key) => {
        assetNames.push(this._createBundleAssetId(bundleId, key));
        this.add([key, this._createBundleAssetId(bundleId, key)], assets[key]);
      });
    }
    this._bundles[bundleId] = assetNames;
  }
  add(keysIn, assetsIn, data) {
    const keys = convertToList(keysIn);
    keys.forEach((key) => {
      if (this.hasKey(key)) {
        console.warn(`[Resolver] already has key: ${key} overwriting`);
      }
    });
    if (!Array.isArray(assetsIn)) {
      if (typeof assetsIn === "string") {
        assetsIn = createStringVariations(assetsIn);
      } else {
        assetsIn = [assetsIn];
      }
    }
    const assetMap = assetsIn.map((asset) => {
      let formattedAsset = asset;
      if (typeof asset === "string") {
        let parsed = false;
        for (let i2 = 0; i2 < this._parsers.length; i2++) {
          const parser = this._parsers[i2];
          if (parser.test(asset)) {
            formattedAsset = parser.parse(asset);
            parsed = true;
            break;
          }
        }
        if (!parsed) {
          formattedAsset = {
            src: asset
          };
        }
      }
      if (!formattedAsset.format) {
        formattedAsset.format = formattedAsset.src.split(".").pop();
      }
      if (!formattedAsset.alias) {
        formattedAsset.alias = keys;
      }
      if (this._basePath || this._rootPath) {
        formattedAsset.src = lib_exports.path.toAbsolute(formattedAsset.src, this._basePath, this._rootPath);
      }
      formattedAsset.src = this._appendDefaultSearchParams(formattedAsset.src);
      formattedAsset.data = formattedAsset.data ?? data;
      return formattedAsset;
    });
    keys.forEach((key) => {
      this._assetMap[key] = assetMap;
    });
  }
  resolveBundle(bundleIds) {
    const singleAsset = isSingleItem(bundleIds);
    bundleIds = convertToList(bundleIds);
    const out = {};
    bundleIds.forEach((bundleId) => {
      const assetNames = this._bundles[bundleId];
      if (assetNames) {
        const results = this.resolve(assetNames);
        const assets = {};
        for (const key in results) {
          const asset = results[key];
          assets[this._extractAssetIdFromBundle(bundleId, key)] = asset;
        }
        out[bundleId] = assets;
      }
    });
    return singleAsset ? out[bundleIds[0]] : out;
  }
  resolveUrl(key) {
    const result = this.resolve(key);
    if (typeof key !== "string") {
      const out = {};
      for (const i2 in result) {
        out[i2] = result[i2].src;
      }
      return out;
    }
    return result.src;
  }
  resolve(keys) {
    const singleAsset = isSingleItem(keys);
    keys = convertToList(keys);
    const result = {};
    keys.forEach((key) => {
      if (!this._resolverHash[key]) {
        if (this._assetMap[key]) {
          let assets = this._assetMap[key];
          const preferredOrder = this._getPreferredOrder(assets);
          const bestAsset = assets[0];
          preferredOrder?.priority.forEach((priorityKey) => {
            preferredOrder.params[priorityKey].forEach((value) => {
              const filteredAssets = assets.filter((asset) => {
                if (asset[priorityKey]) {
                  return asset[priorityKey] === value;
                }
                return false;
              });
              if (filteredAssets.length) {
                assets = filteredAssets;
              }
            });
          });
          this._resolverHash[key] = assets[0] ?? bestAsset;
        } else {
          let src = key;
          if (this._basePath || this._rootPath) {
            src = lib_exports.path.toAbsolute(src, this._basePath, this._rootPath);
          }
          src = this._appendDefaultSearchParams(src);
          this._resolverHash[key] = {
            src
          };
        }
      }
      result[key] = this._resolverHash[key];
    });
    return singleAsset ? result[keys[0]] : result;
  }
  hasKey(key) {
    return !!this._assetMap[key];
  }
  hasBundle(key) {
    return !!this._bundles[key];
  }
  _getPreferredOrder(assets) {
    for (let i2 = 0; i2 < assets.length; i2++) {
      const asset = assets[0];
      const preferred = this._preferredOrder.find((preference) => preference.params.format.includes(asset.format));
      if (preferred) {
        return preferred;
      }
    }
    return this._preferredOrder[0];
  }
  _appendDefaultSearchParams(url2) {
    if (!this._defaultSearchParams)
      return url2;
    const paramConnector = /\?/.test(url2) ? "&" : "?";
    return `${url2}${paramConnector}${this._defaultSearchParams}`;
  }
};

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/Assets.mjs
var AssetsClass = class {
  constructor() {
    this._detections = [];
    this._initialized = false;
    this.resolver = new Resolver();
    this.loader = new Loader();
    this.cache = Cache;
    this._backgroundLoader = new BackgroundLoader(this.loader);
    this._backgroundLoader.active = true;
    this.reset();
  }
  async init(options = {}) {
    if (this._initialized) {
      console.warn("[Assets]AssetManager already initialized, did you load before calling this Asset.init()?");
      return;
    }
    this._initialized = true;
    if (options.defaultSearchParams) {
      this.resolver.setDefaultSearchParams(options.defaultSearchParams);
    }
    if (options.basePath) {
      this.resolver.basePath = options.basePath;
    }
    if (options.bundleIdentifier) {
      this.resolver.setBundleIdentifier(options.bundleIdentifier);
    }
    if (options.manifest) {
      let manifest = options.manifest;
      if (typeof manifest === "string") {
        manifest = await this.load(manifest);
      }
      this.resolver.addManifest(manifest);
    }
    const resolutionPref = options.texturePreference?.resolution ?? 1;
    const resolution = typeof resolutionPref === "number" ? [resolutionPref] : resolutionPref;
    let formats2 = [];
    if (options.texturePreference?.format) {
      const formatPref = options.texturePreference?.format;
      formats2 = typeof formatPref === "string" ? [formatPref] : formatPref;
      for (const detection of this._detections) {
        if (!await detection.test()) {
          formats2 = await detection.remove(formats2);
        }
      }
    } else {
      for (const detection of this._detections) {
        if (await detection.test()) {
          formats2 = await detection.add(formats2);
        }
      }
    }
    this.resolver.prefer({
      params: {
        format: formats2,
        resolution
      }
    });
    if (options.preferences) {
      this.setPreferences(options.preferences);
    }
  }
  add(keysIn, assetsIn, data) {
    this.resolver.add(keysIn, assetsIn, data);
  }
  async load(urls, onProgress) {
    if (!this._initialized) {
      await this.init();
    }
    const singleAsset = isSingleItem(urls);
    const urlArray = convertToList(urls).map((url2) => {
      if (typeof url2 !== "string") {
        this.resolver.add(url2.src, url2);
        return url2.src;
      }
      if (!this.resolver.hasKey(url2)) {
        this.resolver.add(url2, url2);
      }
      return url2;
    });
    const resolveResults = this.resolver.resolve(urlArray);
    const out = await this._mapLoadToResolve(resolveResults, onProgress);
    return singleAsset ? out[urlArray[0]] : out;
  }
  addBundle(bundleId, assets) {
    this.resolver.addBundle(bundleId, assets);
  }
  async loadBundle(bundleIds, onProgress) {
    if (!this._initialized) {
      await this.init();
    }
    let singleAsset = false;
    if (typeof bundleIds === "string") {
      singleAsset = true;
      bundleIds = [bundleIds];
    }
    const resolveResults = this.resolver.resolveBundle(bundleIds);
    const out = {};
    const keys = Object.keys(resolveResults);
    let count = 0;
    let total = 0;
    const _onProgress = () => {
      onProgress?.(++count / total);
    };
    const promises = keys.map((bundleId) => {
      const resolveResult = resolveResults[bundleId];
      total += Object.keys(resolveResult).length;
      return this._mapLoadToResolve(resolveResult, _onProgress).then((resolveResult2) => {
        out[bundleId] = resolveResult2;
      });
    });
    await Promise.all(promises);
    return singleAsset ? out[bundleIds[0]] : out;
  }
  async backgroundLoad(urls) {
    if (!this._initialized) {
      await this.init();
    }
    if (typeof urls === "string") {
      urls = [urls];
    }
    const resolveResults = this.resolver.resolve(urls);
    this._backgroundLoader.add(Object.values(resolveResults));
  }
  async backgroundLoadBundle(bundleIds) {
    if (!this._initialized) {
      await this.init();
    }
    if (typeof bundleIds === "string") {
      bundleIds = [bundleIds];
    }
    const resolveResults = this.resolver.resolveBundle(bundleIds);
    Object.values(resolveResults).forEach((resolveResult) => {
      this._backgroundLoader.add(Object.values(resolveResult));
    });
  }
  reset() {
    this.resolver.reset();
    this.loader.reset();
    this.cache.reset();
    this._initialized = false;
  }
  get(keys) {
    if (typeof keys === "string") {
      return Cache.get(keys);
    }
    const assets = {};
    for (let i2 = 0; i2 < keys.length; i2++) {
      assets[i2] = Cache.get(keys[i2]);
    }
    return assets;
  }
  async _mapLoadToResolve(resolveResults, onProgress) {
    const resolveArray = Object.values(resolveResults);
    const resolveKeys = Object.keys(resolveResults);
    this._backgroundLoader.active = false;
    const loadedAssets3 = await this.loader.load(resolveArray, onProgress);
    this._backgroundLoader.active = true;
    const out = {};
    resolveArray.forEach((resolveResult, i2) => {
      const asset = loadedAssets3[resolveResult.src];
      const keys = [resolveResult.src];
      if (resolveResult.alias) {
        keys.push(...resolveResult.alias);
      }
      out[resolveKeys[i2]] = asset;
      Cache.set(keys, asset);
    });
    return out;
  }
  async unload(urls) {
    if (!this._initialized) {
      await this.init();
    }
    const urlArray = convertToList(urls).map((url2) => typeof url2 !== "string" ? url2.src : url2);
    const resolveResults = this.resolver.resolve(urlArray);
    await this._unloadFromResolved(resolveResults);
  }
  async unloadBundle(bundleIds) {
    if (!this._initialized) {
      await this.init();
    }
    bundleIds = convertToList(bundleIds);
    const resolveResults = this.resolver.resolveBundle(bundleIds);
    const promises = Object.keys(resolveResults).map((bundleId) => this._unloadFromResolved(resolveResults[bundleId]));
    await Promise.all(promises);
  }
  async _unloadFromResolved(resolveResult) {
    const resolveArray = Object.values(resolveResult);
    resolveArray.forEach((resolveResult2) => {
      Cache.remove(resolveResult2.src);
    });
    await this.loader.unload(resolveArray);
  }
  get detections() {
    return this._detections;
  }
  get preferWorkers() {
    return loadTextures.config.preferWorkers;
  }
  set preferWorkers(value) {
    lib_exports.deprecation("7.2.0", "Assets.prefersWorkers is deprecated, use Assets.setPreferences({ preferWorkers: true }) instead.");
    this.setPreferences({ preferWorkers: value });
  }
  setPreferences(preferences) {
    this.loader.parsers.forEach((parser) => {
      if (!parser.config)
        return;
      Object.keys(parser.config).filter((key) => key in preferences).forEach((key) => {
        parser.config[key] = preferences[key];
      });
    });
  }
};
var Assets = new AssetsClass();
extensions.handleByList(ExtensionType.LoadParser, Assets.loader.parsers).handleByList(ExtensionType.ResolveParser, Assets.resolver.parsers).handleByList(ExtensionType.CacheParser, Assets.cache.parsers).handleByList(ExtensionType.DetectionParser, Assets.detections);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/cache/parsers/cacheTextureArray.mjs
var cacheTextureArray = {
  extension: ExtensionType.CacheParser,
  test: (asset) => Array.isArray(asset) && asset.every((t2) => t2 instanceof Texture),
  getCacheableAssets: (keys, asset) => {
    const out = {};
    keys.forEach((key) => {
      asset.forEach((item, i2) => {
        out[key + (i2 === 0 ? "" : i2 + 1)] = item;
      });
    });
    return out;
  }
};
extensions.add(cacheTextureArray);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/detections/parsers/detectAvif.mjs
var detectAvif = {
  extension: {
    type: ExtensionType.DetectionParser,
    priority: 1
  },
  test: async () => {
    if (!globalThis.createImageBitmap)
      return false;
    const avifData = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
    const blob = await settings.ADAPTER.fetch(avifData).then((r2) => r2.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  },
  add: async (formats2) => [...formats2, "avif"],
  remove: async (formats2) => formats2.filter((f4) => f4 !== "avif")
};
extensions.add(detectAvif);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/detections/parsers/detectWebp.mjs
var detectWebp = {
  extension: {
    type: ExtensionType.DetectionParser,
    priority: 0
  },
  test: async () => {
    if (!globalThis.createImageBitmap)
      return false;
    const webpData = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
    const blob = await settings.ADAPTER.fetch(webpData).then((r2) => r2.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  },
  add: async (formats2) => [...formats2, "webp"],
  remove: async (formats2) => formats2.filter((f4) => f4 !== "webp")
};
extensions.add(detectWebp);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/detections/parsers/detectDefaults.mjs
var imageFormats = ["png", "jpg", "jpeg"];
var detectDefaults = {
  extension: {
    type: ExtensionType.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(true),
  add: async (formats2) => [...formats2, ...imageFormats],
  remove: async (formats2) => formats2.filter((f4) => !imageFormats.includes(f4))
};
extensions.add(detectDefaults);

// ../../node_modules/.pnpm/@pixi+assets@7.2.4_g6kcrvjte5opnujtwgun74ym6y/node_modules/@pixi/assets/lib/resolver/parsers/resolveTextureUrl.mjs
var resolveTextureUrl = {
  extension: ExtensionType.ResolveParser,
  test: loadTextures.test,
  parse: (value) => ({
    resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
    format: value.split(".").pop(),
    src: value
  })
};
extensions.add(resolveTextureUrl);

// ../../node_modules/.pnpm/@pixi+compressed-textures@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/compressed-textures/lib/const.mjs
var INTERNAL_FORMATS = /* @__PURE__ */ ((INTERNAL_FORMATS2) => {
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGB_S3TC_DXT1_EXT"] = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGBA_S3TC_DXT1_EXT"] = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGBA_S3TC_DXT3_EXT"] = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGBA_S3TC_DXT5_EXT"] = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT"] = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT"] = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT"] = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_SRGB_S3TC_DXT1_EXT"] = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_R11_EAC"] = 37488] = "COMPRESSED_R11_EAC";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_SIGNED_R11_EAC"] = 37489] = "COMPRESSED_SIGNED_R11_EAC";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RG11_EAC"] = 37490] = "COMPRESSED_RG11_EAC";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_SIGNED_RG11_EAC"] = 37491] = "COMPRESSED_SIGNED_RG11_EAC";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGB8_ETC2"] = 37492] = "COMPRESSED_RGB8_ETC2";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGBA8_ETC2_EAC"] = 37496] = "COMPRESSED_RGBA8_ETC2_EAC";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_SRGB8_ETC2"] = 37493] = "COMPRESSED_SRGB8_ETC2";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_SRGB8_ALPHA8_ETC2_EAC"] = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2"] = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2"] = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGB_PVRTC_4BPPV1_IMG"] = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGBA_PVRTC_4BPPV1_IMG"] = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGB_PVRTC_2BPPV1_IMG"] = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGBA_PVRTC_2BPPV1_IMG"] = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGB_ETC1_WEBGL"] = 36196] = "COMPRESSED_RGB_ETC1_WEBGL";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGB_ATC_WEBGL"] = 35986] = "COMPRESSED_RGB_ATC_WEBGL";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL"] = 35986] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL"] = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL";
  INTERNAL_FORMATS2[INTERNAL_FORMATS2["COMPRESSED_RGBA_ASTC_4x4_KHR"] = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR";
  return INTERNAL_FORMATS2;
})(INTERNAL_FORMATS || {});
var INTERNAL_FORMAT_TO_BYTES_PER_PIXEL = {
  [
    33776
    /* COMPRESSED_RGB_S3TC_DXT1_EXT */
  ]: 0.5,
  [
    33777
    /* COMPRESSED_RGBA_S3TC_DXT1_EXT */
  ]: 0.5,
  [
    33778
    /* COMPRESSED_RGBA_S3TC_DXT3_EXT */
  ]: 1,
  [
    33779
    /* COMPRESSED_RGBA_S3TC_DXT5_EXT */
  ]: 1,
  [
    35916
    /* COMPRESSED_SRGB_S3TC_DXT1_EXT */
  ]: 0.5,
  [
    35917
    /* COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT */
  ]: 0.5,
  [
    35918
    /* COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT */
  ]: 1,
  [
    35919
    /* COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT */
  ]: 1,
  [
    37488
    /* COMPRESSED_R11_EAC */
  ]: 0.5,
  [
    37489
    /* COMPRESSED_SIGNED_R11_EAC */
  ]: 0.5,
  [
    37490
    /* COMPRESSED_RG11_EAC */
  ]: 1,
  [
    37491
    /* COMPRESSED_SIGNED_RG11_EAC */
  ]: 1,
  [
    37492
    /* COMPRESSED_RGB8_ETC2 */
  ]: 0.5,
  [
    37496
    /* COMPRESSED_RGBA8_ETC2_EAC */
  ]: 1,
  [
    37493
    /* COMPRESSED_SRGB8_ETC2 */
  ]: 0.5,
  [
    37497
    /* COMPRESSED_SRGB8_ALPHA8_ETC2_EAC */
  ]: 1,
  [
    37494
    /* COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 */
  ]: 0.5,
  [
    37495
    /* COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 */
  ]: 0.5,
  [
    35840
    /* COMPRESSED_RGB_PVRTC_4BPPV1_IMG */
  ]: 0.5,
  [
    35842
    /* COMPRESSED_RGBA_PVRTC_4BPPV1_IMG */
  ]: 0.5,
  [
    35841
    /* COMPRESSED_RGB_PVRTC_2BPPV1_IMG */
  ]: 0.25,
  [
    35843
    /* COMPRESSED_RGBA_PVRTC_2BPPV1_IMG */
  ]: 0.25,
  [
    36196
    /* COMPRESSED_RGB_ETC1_WEBGL */
  ]: 0.5,
  [
    35986
    /* COMPRESSED_RGB_ATC_WEBGL */
  ]: 0.5,
  [
    35986
    /* COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL */
  ]: 1,
  [
    34798
    /* COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL */
  ]: 1,
  [
    37808
    /* COMPRESSED_RGBA_ASTC_4x4_KHR */
  ]: 1
};

// ../../node_modules/.pnpm/@pixi+compressed-textures@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/compressed-textures/lib/loaders/detectCompressedTextures.mjs
var storedGl;
var extensions2;
function getCompressedTextureExtensions() {
  extensions2 = {
    s3tc: storedGl.getExtension("WEBGL_compressed_texture_s3tc"),
    s3tc_sRGB: storedGl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
    etc: storedGl.getExtension("WEBGL_compressed_texture_etc"),
    etc1: storedGl.getExtension("WEBGL_compressed_texture_etc1"),
    pvrtc: storedGl.getExtension("WEBGL_compressed_texture_pvrtc") || storedGl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
    atc: storedGl.getExtension("WEBGL_compressed_texture_atc"),
    astc: storedGl.getExtension("WEBGL_compressed_texture_astc")
  };
}
var detectCompressedTextures = {
  extension: {
    type: ExtensionType.DetectionParser,
    priority: 2
  },
  test: async () => {
    const canvas = settings.ADAPTER.createCanvas();
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not available for compressed textures.");
      return false;
    }
    storedGl = gl;
    return true;
  },
  add: async (formats2) => {
    if (!extensions2)
      getCompressedTextureExtensions();
    const textureFormats = [];
    for (const extensionName in extensions2) {
      const extension = extensions2[extensionName];
      if (!extension) {
        continue;
      }
      textureFormats.push(extensionName);
    }
    return [...textureFormats, ...formats2];
  },
  remove: async (formats2) => {
    if (!extensions2)
      getCompressedTextureExtensions();
    return formats2.filter((f4) => !(f4 in extensions2));
  }
};
extensions.add(detectCompressedTextures);

// ../../node_modules/.pnpm/@pixi+compressed-textures@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/compressed-textures/lib/resources/BlobResource.mjs
var BlobResource = class extends BufferResource {
  constructor(source, options = { width: 1, height: 1, autoLoad: true }) {
    let origin;
    let data;
    if (typeof source === "string") {
      origin = source;
      data = new Uint8Array();
    } else {
      origin = null;
      data = source;
    }
    super(data, options);
    this.origin = origin;
    this.buffer = data ? new ViewableBuffer(data) : null;
    this._load = null;
    this.loaded = false;
    if (this.origin !== null && options.autoLoad !== false) {
      this.load();
    }
    if (this.origin === null && this.buffer) {
      this._load = Promise.resolve(this);
      this.loaded = true;
      this.onBlobLoaded(this.buffer.rawBinaryData);
    }
  }
  onBlobLoaded(_data) {
  }
  load() {
    if (this._load) {
      return this._load;
    }
    this._load = fetch(this.origin).then((response) => response.blob()).then((blob) => blob.arrayBuffer()).then((arrayBuffer) => {
      this.data = new Uint32Array(arrayBuffer);
      this.buffer = new ViewableBuffer(arrayBuffer);
      this.loaded = true;
      this.onBlobLoaded(arrayBuffer);
      this.update();
      return this;
    });
    return this._load;
  }
};

// ../../node_modules/.pnpm/@pixi+compressed-textures@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/compressed-textures/lib/resources/CompressedTextureResource.mjs
var CompressedTextureResource = class extends BlobResource {
  constructor(source, options) {
    super(source, options);
    this.format = options.format;
    this.levels = options.levels || 1;
    this._width = options.width;
    this._height = options.height;
    this._extension = CompressedTextureResource._formatToExtension(this.format);
    if (options.levelBuffers || this.buffer) {
      this._levelBuffers = options.levelBuffers || CompressedTextureResource._createLevelBuffers(source instanceof Uint8Array ? source : this.buffer.uint8View, this.format, this.levels, 4, 4, this.width, this.height);
    }
  }
  upload(renderer, _texture, _glTexture) {
    const gl = renderer.gl;
    const extension = renderer.context.extensions[this._extension];
    if (!extension) {
      throw new Error(`${this._extension} textures are not supported on the current machine`);
    }
    if (!this._levelBuffers) {
      return false;
    }
    for (let i2 = 0, j3 = this.levels; i2 < j3; i2++) {
      const { levelID, levelWidth, levelHeight, levelBuffer } = this._levelBuffers[i2];
      gl.compressedTexImage2D(gl.TEXTURE_2D, levelID, this.format, levelWidth, levelHeight, 0, levelBuffer);
    }
    return true;
  }
  onBlobLoaded() {
    this._levelBuffers = CompressedTextureResource._createLevelBuffers(this.buffer.uint8View, this.format, this.levels, 4, 4, this.width, this.height);
  }
  static _formatToExtension(format2) {
    if (format2 >= 33776 && format2 <= 33779) {
      return "s3tc";
    } else if (format2 >= 37488 && format2 <= 37497) {
      return "etc";
    } else if (format2 >= 35840 && format2 <= 35843) {
      return "pvrtc";
    } else if (format2 >= 36196) {
      return "etc1";
    } else if (format2 >= 35986 && format2 <= 34798) {
      return "atc";
    }
    throw new Error("Invalid (compressed) texture format given!");
  }
  static _createLevelBuffers(buffer, format2, levels, blockWidth, blockHeight, imageWidth, imageHeight) {
    const buffers = new Array(levels);
    let offset = buffer.byteOffset;
    let levelWidth = imageWidth;
    let levelHeight = imageHeight;
    let alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1);
    let alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1);
    let levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format2];
    for (let i2 = 0; i2 < levels; i2++) {
      buffers[i2] = {
        levelID: i2,
        levelWidth: levels > 1 ? levelWidth : alignedLevelWidth,
        levelHeight: levels > 1 ? levelHeight : alignedLevelHeight,
        levelBuffer: new Uint8Array(buffer.buffer, offset, levelSize)
      };
      offset += levelSize;
      levelWidth = levelWidth >> 1 || 1;
      levelHeight = levelHeight >> 1 || 1;
      alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1);
      alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1);
      levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format2];
    }
    return buffers;
  }
};

// ../../node_modules/.pnpm/@pixi+compressed-textures@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/compressed-textures/lib/parsers/parseDDS.mjs
var DDS_MAGIC_SIZE = 4;
var DDS_HEADER_SIZE = 124;
var DDS_HEADER_PF_SIZE = 32;
var DDS_HEADER_DX10_SIZE = 20;
var DDS_MAGIC = 542327876;
var DDS_FIELDS = {
  SIZE: 1,
  FLAGS: 2,
  HEIGHT: 3,
  WIDTH: 4,
  MIPMAP_COUNT: 7,
  PIXEL_FORMAT: 19
};
var DDS_PF_FIELDS = {
  SIZE: 0,
  FLAGS: 1,
  FOURCC: 2,
  RGB_BITCOUNT: 3,
  R_BIT_MASK: 4,
  G_BIT_MASK: 5,
  B_BIT_MASK: 6,
  A_BIT_MASK: 7
};
var DDS_DX10_FIELDS = {
  DXGI_FORMAT: 0,
  RESOURCE_DIMENSION: 1,
  MISC_FLAG: 2,
  ARRAY_SIZE: 3,
  MISC_FLAGS2: 4
};
var PF_FLAGS = 1;
var DDPF_ALPHA = 2;
var DDPF_FOURCC = 4;
var DDPF_RGB = 64;
var DDPF_YUV = 512;
var DDPF_LUMINANCE = 131072;
var FOURCC_DXT1 = 827611204;
var FOURCC_DXT3 = 861165636;
var FOURCC_DXT5 = 894720068;
var FOURCC_DX10 = 808540228;
var DDS_RESOURCE_MISC_TEXTURECUBE = 4;
var FOURCC_TO_FORMAT = {
  [FOURCC_DXT1]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
  [FOURCC_DXT3]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
  [FOURCC_DXT5]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT
};
var DXGI_TO_FORMAT = {
  [
    70
    /* DXGI_FORMAT_BC1_TYPELESS */
  ]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
  [
    71
    /* DXGI_FORMAT_BC1_UNORM */
  ]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
  [
    73
    /* DXGI_FORMAT_BC2_TYPELESS */
  ]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
  [
    74
    /* DXGI_FORMAT_BC2_UNORM */
  ]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
  [
    76
    /* DXGI_FORMAT_BC3_TYPELESS */
  ]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
  [
    77
    /* DXGI_FORMAT_BC3_UNORM */
  ]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
  [
    72
    /* DXGI_FORMAT_BC1_UNORM_SRGB */
  ]: INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
  [
    75
    /* DXGI_FORMAT_BC2_UNORM_SRGB */
  ]: INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
  [
    78
    /* DXGI_FORMAT_BC3_UNORM_SRGB */
  ]: INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
};
function parseDDS(arrayBuffer) {
  const data = new Uint32Array(arrayBuffer);
  const magicWord = data[0];
  if (magicWord !== DDS_MAGIC) {
    throw new Error("Invalid DDS file magic word");
  }
  const header = new Uint32Array(arrayBuffer, 0, DDS_HEADER_SIZE / Uint32Array.BYTES_PER_ELEMENT);
  const height = header[DDS_FIELDS.HEIGHT];
  const width = header[DDS_FIELDS.WIDTH];
  const mipmapCount = header[DDS_FIELDS.MIPMAP_COUNT];
  const pixelFormat = new Uint32Array(arrayBuffer, DDS_FIELDS.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT, DDS_HEADER_PF_SIZE / Uint32Array.BYTES_PER_ELEMENT);
  const formatFlags = pixelFormat[PF_FLAGS];
  if (formatFlags & DDPF_FOURCC) {
    const fourCC = pixelFormat[DDS_PF_FIELDS.FOURCC];
    if (fourCC !== FOURCC_DX10) {
      const internalFormat2 = FOURCC_TO_FORMAT[fourCC];
      const dataOffset2 = DDS_MAGIC_SIZE + DDS_HEADER_SIZE;
      const texData = new Uint8Array(arrayBuffer, dataOffset2);
      const resource = new CompressedTextureResource(texData, {
        format: internalFormat2,
        width,
        height,
        levels: mipmapCount
      });
      return [resource];
    }
    const dx10Offset = DDS_MAGIC_SIZE + DDS_HEADER_SIZE;
    const dx10Header = new Uint32Array(data.buffer, dx10Offset, DDS_HEADER_DX10_SIZE / Uint32Array.BYTES_PER_ELEMENT);
    const dxgiFormat = dx10Header[DDS_DX10_FIELDS.DXGI_FORMAT];
    const resourceDimension = dx10Header[DDS_DX10_FIELDS.RESOURCE_DIMENSION];
    const miscFlag = dx10Header[DDS_DX10_FIELDS.MISC_FLAG];
    const arraySize = dx10Header[DDS_DX10_FIELDS.ARRAY_SIZE];
    const internalFormat = DXGI_TO_FORMAT[dxgiFormat];
    if (internalFormat === void 0) {
      throw new Error(`DDSParser cannot parse texture data with DXGI format ${dxgiFormat}`);
    }
    if (miscFlag === DDS_RESOURCE_MISC_TEXTURECUBE) {
      throw new Error("DDSParser does not support cubemap textures");
    }
    if (resourceDimension === 6) {
      throw new Error("DDSParser does not supported 3D texture data");
    }
    const imageBuffers = new Array();
    const dataOffset = DDS_MAGIC_SIZE + DDS_HEADER_SIZE + DDS_HEADER_DX10_SIZE;
    if (arraySize === 1) {
      imageBuffers.push(new Uint8Array(arrayBuffer, dataOffset));
    } else {
      const pixelSize = INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[internalFormat];
      let imageSize = 0;
      let levelWidth = width;
      let levelHeight = height;
      for (let i2 = 0; i2 < mipmapCount; i2++) {
        const alignedLevelWidth = Math.max(1, levelWidth + 3 & ~3);
        const alignedLevelHeight = Math.max(1, levelHeight + 3 & ~3);
        const levelSize = alignedLevelWidth * alignedLevelHeight * pixelSize;
        imageSize += levelSize;
        levelWidth = levelWidth >>> 1;
        levelHeight = levelHeight >>> 1;
      }
      let imageOffset = dataOffset;
      for (let i2 = 0; i2 < arraySize; i2++) {
        imageBuffers.push(new Uint8Array(arrayBuffer, imageOffset, imageSize));
        imageOffset += imageSize;
      }
    }
    return imageBuffers.map((buffer) => new CompressedTextureResource(buffer, {
      format: internalFormat,
      width,
      height,
      levels: mipmapCount
    }));
  }
  if (formatFlags & DDPF_RGB) {
    throw new Error("DDSParser does not support uncompressed texture data.");
  }
  if (formatFlags & DDPF_YUV) {
    throw new Error("DDSParser does not supported YUV uncompressed texture data.");
  }
  if (formatFlags & DDPF_LUMINANCE) {
    throw new Error("DDSParser does not support single-channel (lumninance) texture data!");
  }
  if (formatFlags & DDPF_ALPHA) {
    throw new Error("DDSParser does not support single-channel (alpha) texture data!");
  }
  throw new Error("DDSParser failed to load a texture file due to an unknown reason!");
}

// ../../node_modules/.pnpm/@pixi+compressed-textures@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/compressed-textures/lib/parsers/parseKTX.mjs
var FILE_IDENTIFIER = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10];
var ENDIANNESS = 67305985;
var KTX_FIELDS = {
  FILE_IDENTIFIER: 0,
  ENDIANNESS: 12,
  GL_TYPE: 16,
  GL_TYPE_SIZE: 20,
  GL_FORMAT: 24,
  GL_INTERNAL_FORMAT: 28,
  GL_BASE_INTERNAL_FORMAT: 32,
  PIXEL_WIDTH: 36,
  PIXEL_HEIGHT: 40,
  PIXEL_DEPTH: 44,
  NUMBER_OF_ARRAY_ELEMENTS: 48,
  NUMBER_OF_FACES: 52,
  NUMBER_OF_MIPMAP_LEVELS: 56,
  BYTES_OF_KEY_VALUE_DATA: 60
};
var FILE_HEADER_SIZE = 64;
var TYPES_TO_BYTES_PER_COMPONENT = {
  [TYPES.UNSIGNED_BYTE]: 1,
  [TYPES.UNSIGNED_SHORT]: 2,
  [TYPES.INT]: 4,
  [TYPES.UNSIGNED_INT]: 4,
  [TYPES.FLOAT]: 4,
  [TYPES.HALF_FLOAT]: 8
};
var FORMATS_TO_COMPONENTS = {
  [FORMATS.RGBA]: 4,
  [FORMATS.RGB]: 3,
  [FORMATS.RG]: 2,
  [FORMATS.RED]: 1,
  [FORMATS.LUMINANCE]: 1,
  [FORMATS.LUMINANCE_ALPHA]: 2,
  [FORMATS.ALPHA]: 1
};
var TYPES_TO_BYTES_PER_PIXEL = {
  [TYPES.UNSIGNED_SHORT_4_4_4_4]: 2,
  [TYPES.UNSIGNED_SHORT_5_5_5_1]: 2,
  [TYPES.UNSIGNED_SHORT_5_6_5]: 2
};
function parseKTX(url2, arrayBuffer, loadKeyValueData = false) {
  const dataView = new DataView(arrayBuffer);
  if (!validate(url2, dataView)) {
    return null;
  }
  const littleEndian = dataView.getUint32(KTX_FIELDS.ENDIANNESS, true) === ENDIANNESS;
  const glType = dataView.getUint32(KTX_FIELDS.GL_TYPE, littleEndian);
  const glFormat = dataView.getUint32(KTX_FIELDS.GL_FORMAT, littleEndian);
  const glInternalFormat = dataView.getUint32(KTX_FIELDS.GL_INTERNAL_FORMAT, littleEndian);
  const pixelWidth = dataView.getUint32(KTX_FIELDS.PIXEL_WIDTH, littleEndian);
  const pixelHeight = dataView.getUint32(KTX_FIELDS.PIXEL_HEIGHT, littleEndian) || 1;
  const pixelDepth = dataView.getUint32(KTX_FIELDS.PIXEL_DEPTH, littleEndian) || 1;
  const numberOfArrayElements = dataView.getUint32(KTX_FIELDS.NUMBER_OF_ARRAY_ELEMENTS, littleEndian) || 1;
  const numberOfFaces = dataView.getUint32(KTX_FIELDS.NUMBER_OF_FACES, littleEndian);
  const numberOfMipmapLevels = dataView.getUint32(KTX_FIELDS.NUMBER_OF_MIPMAP_LEVELS, littleEndian);
  const bytesOfKeyValueData = dataView.getUint32(KTX_FIELDS.BYTES_OF_KEY_VALUE_DATA, littleEndian);
  if (pixelHeight === 0 || pixelDepth !== 1) {
    throw new Error("Only 2D textures are supported");
  }
  if (numberOfFaces !== 1) {
    throw new Error("CubeTextures are not supported by KTXLoader yet!");
  }
  if (numberOfArrayElements !== 1) {
    throw new Error("WebGL does not support array textures");
  }
  const blockWidth = 4;
  const blockHeight = 4;
  const alignedWidth = pixelWidth + 3 & ~3;
  const alignedHeight = pixelHeight + 3 & ~3;
  const imageBuffers = new Array(numberOfArrayElements);
  let imagePixels = pixelWidth * pixelHeight;
  if (glType === 0) {
    imagePixels = alignedWidth * alignedHeight;
  }
  let imagePixelByteSize;
  if (glType !== 0) {
    if (TYPES_TO_BYTES_PER_COMPONENT[glType]) {
      imagePixelByteSize = TYPES_TO_BYTES_PER_COMPONENT[glType] * FORMATS_TO_COMPONENTS[glFormat];
    } else {
      imagePixelByteSize = TYPES_TO_BYTES_PER_PIXEL[glType];
    }
  } else {
    imagePixelByteSize = INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[glInternalFormat];
  }
  if (imagePixelByteSize === void 0) {
    throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
  }
  const kvData = loadKeyValueData ? parseKvData(dataView, bytesOfKeyValueData, littleEndian) : null;
  const imageByteSize = imagePixels * imagePixelByteSize;
  let mipByteSize = imageByteSize;
  let mipWidth = pixelWidth;
  let mipHeight = pixelHeight;
  let alignedMipWidth = alignedWidth;
  let alignedMipHeight = alignedHeight;
  let imageOffset = FILE_HEADER_SIZE + bytesOfKeyValueData;
  for (let mipmapLevel = 0; mipmapLevel < numberOfMipmapLevels; mipmapLevel++) {
    const imageSize = dataView.getUint32(imageOffset, littleEndian);
    let elementOffset = imageOffset + 4;
    for (let arrayElement = 0; arrayElement < numberOfArrayElements; arrayElement++) {
      let mips = imageBuffers[arrayElement];
      if (!mips) {
        mips = imageBuffers[arrayElement] = new Array(numberOfMipmapLevels);
      }
      mips[mipmapLevel] = {
        levelID: mipmapLevel,
        levelWidth: numberOfMipmapLevels > 1 || glType !== 0 ? mipWidth : alignedMipWidth,
        levelHeight: numberOfMipmapLevels > 1 || glType !== 0 ? mipHeight : alignedMipHeight,
        levelBuffer: new Uint8Array(arrayBuffer, elementOffset, mipByteSize)
      };
      elementOffset += mipByteSize;
    }
    imageOffset += imageSize + 4;
    imageOffset = imageOffset % 4 !== 0 ? imageOffset + 4 - imageOffset % 4 : imageOffset;
    mipWidth = mipWidth >> 1 || 1;
    mipHeight = mipHeight >> 1 || 1;
    alignedMipWidth = mipWidth + blockWidth - 1 & ~(blockWidth - 1);
    alignedMipHeight = mipHeight + blockHeight - 1 & ~(blockHeight - 1);
    mipByteSize = alignedMipWidth * alignedMipHeight * imagePixelByteSize;
  }
  if (glType !== 0) {
    return {
      uncompressed: imageBuffers.map((levelBuffers) => {
        let buffer = levelBuffers[0].levelBuffer;
        let convertToInt = false;
        if (glType === TYPES.FLOAT) {
          buffer = new Float32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4);
        } else if (glType === TYPES.UNSIGNED_INT) {
          convertToInt = true;
          buffer = new Uint32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4);
        } else if (glType === TYPES.INT) {
          convertToInt = true;
          buffer = new Int32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4);
        }
        return {
          resource: new BufferResource(buffer, {
            width: levelBuffers[0].levelWidth,
            height: levelBuffers[0].levelHeight
          }),
          type: glType,
          format: convertToInt ? convertFormatToInteger(glFormat) : glFormat
        };
      }),
      kvData
    };
  }
  return {
    compressed: imageBuffers.map((levelBuffers) => new CompressedTextureResource(null, {
      format: glInternalFormat,
      width: pixelWidth,
      height: pixelHeight,
      levels: numberOfMipmapLevels,
      levelBuffers
    })),
    kvData
  };
}
function validate(url2, dataView) {
  for (let i2 = 0; i2 < FILE_IDENTIFIER.length; i2++) {
    if (dataView.getUint8(i2) !== FILE_IDENTIFIER[i2]) {
      console.error(`${url2} is not a valid *.ktx file!`);
      return false;
    }
  }
  return true;
}
function convertFormatToInteger(format2) {
  switch (format2) {
    case FORMATS.RGBA:
      return FORMATS.RGBA_INTEGER;
    case FORMATS.RGB:
      return FORMATS.RGB_INTEGER;
    case FORMATS.RG:
      return FORMATS.RG_INTEGER;
    case FORMATS.RED:
      return FORMATS.RED_INTEGER;
    default:
      return format2;
  }
}
function parseKvData(dataView, bytesOfKeyValueData, littleEndian) {
  const kvData = /* @__PURE__ */ new Map();
  let bytesIntoKeyValueData = 0;
  while (bytesIntoKeyValueData < bytesOfKeyValueData) {
    const keyAndValueByteSize = dataView.getUint32(FILE_HEADER_SIZE + bytesIntoKeyValueData, littleEndian);
    const keyAndValueByteOffset = FILE_HEADER_SIZE + bytesIntoKeyValueData + 4;
    const valuePadding = 3 - (keyAndValueByteSize + 3) % 4;
    if (keyAndValueByteSize === 0 || keyAndValueByteSize > bytesOfKeyValueData - bytesIntoKeyValueData) {
      console.error("KTXLoader: keyAndValueByteSize out of bounds");
      break;
    }
    let keyNulByte = 0;
    for (; keyNulByte < keyAndValueByteSize; keyNulByte++) {
      if (dataView.getUint8(keyAndValueByteOffset + keyNulByte) === 0) {
        break;
      }
    }
    if (keyNulByte === -1) {
      console.error("KTXLoader: Failed to find null byte terminating kvData key");
      break;
    }
    const key = new TextDecoder().decode(new Uint8Array(dataView.buffer, keyAndValueByteOffset, keyNulByte));
    const value = new DataView(dataView.buffer, keyAndValueByteOffset + keyNulByte + 1, keyAndValueByteSize - keyNulByte - 1);
    kvData.set(key, value);
    bytesIntoKeyValueData += 4 + keyAndValueByteSize + valuePadding;
  }
  return kvData;
}

// ../../node_modules/.pnpm/@pixi+compressed-textures@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/compressed-textures/lib/loaders/loadDDS.mjs
var loadDDS = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High
  },
  name: "loadDDS",
  test(url2) {
    return checkExtension(url2, ".dds");
  },
  async load(url2, asset, loader) {
    const response = await settings.ADAPTER.fetch(url2);
    const arrayBuffer = await response.arrayBuffer();
    const resources = parseDDS(arrayBuffer);
    const textures = resources.map((resource) => {
      const base = new BaseTexture(resource, {
        mipmap: MIPMAP_MODES.OFF,
        alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
        resolution: lib_exports.getResolutionOfUrl(url2),
        ...asset.data
      });
      return createTexture(base, loader, url2);
    });
    return textures.length === 1 ? textures[0] : textures;
  },
  unload(texture) {
    if (Array.isArray(texture)) {
      texture.forEach((t2) => t2.destroy(true));
    } else {
      texture.destroy(true);
    }
  }
};
extensions.add(loadDDS);

// ../../node_modules/.pnpm/@pixi+compressed-textures@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/compressed-textures/lib/loaders/loadKTX.mjs
var loadKTX = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High
  },
  name: "loadKTX",
  test(url2) {
    return checkExtension(url2, ".ktx");
  },
  async load(url2, asset, loader) {
    const response = await settings.ADAPTER.fetch(url2);
    const arrayBuffer = await response.arrayBuffer();
    const { compressed, uncompressed, kvData } = parseKTX(url2, arrayBuffer);
    const resources = compressed ?? uncompressed;
    const options = {
      mipmap: MIPMAP_MODES.OFF,
      alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
      resolution: lib_exports.getResolutionOfUrl(url2),
      ...asset.data
    };
    const textures = resources.map((resource) => {
      if (resources === uncompressed) {
        Object.assign(options, {
          type: resource.type,
          format: resource.format
        });
      }
      const base = new BaseTexture(resource, options);
      base.ktxKeyValueData = kvData;
      return createTexture(base, loader, url2);
    });
    return textures.length === 1 ? textures[0] : textures;
  },
  unload(texture) {
    if (Array.isArray(texture)) {
      texture.forEach((t2) => t2.destroy(true));
    } else {
      texture.destroy(true);
    }
  }
};
extensions.add(loadKTX);

// ../../node_modules/.pnpm/@pixi+compressed-textures@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/compressed-textures/lib/loaders/resolveCompressedTextureUrl.mjs
var resolveCompressedTextureUrl = {
  extension: ExtensionType.ResolveParser,
  test: (value) => {
    const temp = value.split("?")[0];
    const extension = temp.split(".").pop();
    return ["basis", "ktx", "dds"].includes(extension);
  },
  parse: (value) => {
    const temp = value.split("?")[0];
    const extension = temp.split(".").pop();
    if (extension === "ktx") {
      const extensions22 = [
        ".s3tc.ktx",
        ".s3tc_sRGB.ktx",
        ".etc.ktx",
        ".etc1.ktx",
        ".pvrt.ktx",
        ".atc.ktx",
        ".astc.ktx"
      ];
      if (extensions22.some((ext) => value.endsWith(ext))) {
        return {
          resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
          format: extensions22.find((ext) => value.endsWith(ext)),
          src: value
        };
      }
    }
    return {
      resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
      format: value.split(".").pop(),
      src: value
    };
  }
};
extensions.add(resolveCompressedTextureUrl);

// ../../node_modules/.pnpm/@pixi+extract@7.2.4_@pixi+core@7.2.4/node_modules/@pixi/extract/lib/Extract.mjs
var TEMP_RECT = new Rectangle();
var BYTES_PER_PIXEL = 4;
var _Extract = class {
  constructor(renderer) {
    this.renderer = renderer;
  }
  async image(target, format2, quality) {
    const image = new Image();
    image.src = await this.base64(target, format2, quality);
    return image;
  }
  async base64(target, format2, quality) {
    const canvas = this.canvas(target);
    if (canvas.toBlob !== void 0) {
      return new Promise((resolve2, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("ICanvas.toBlob failed!"));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve2(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }, format2, quality);
      });
    }
    if (canvas.toDataURL !== void 0) {
      return canvas.toDataURL(format2, quality);
    }
    if (canvas.convertToBlob !== void 0) {
      const blob = await canvas.convertToBlob({ type: format2, quality });
      return new Promise((resolve2, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve2(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");
  }
  canvas(target, frame) {
    const { pixels, width, height, flipY } = this._rawPixels(target, frame);
    if (flipY) {
      _Extract._flipY(pixels, width, height);
    }
    _Extract._unpremultiplyAlpha(pixels);
    const canvasBuffer = new lib_exports.CanvasRenderTarget(width, height, 1);
    const imageData = new ImageData(new Uint8ClampedArray(pixels.buffer), width, height);
    canvasBuffer.context.putImageData(imageData, 0, 0);
    return canvasBuffer.canvas;
  }
  pixels(target, frame) {
    const { pixels, width, height, flipY } = this._rawPixels(target, frame);
    if (flipY) {
      _Extract._flipY(pixels, width, height);
    }
    _Extract._unpremultiplyAlpha(pixels);
    return pixels;
  }
  _rawPixels(target, frame) {
    const renderer = this.renderer;
    if (!renderer) {
      throw new Error("The Extract has already been destroyed");
    }
    let resolution;
    let flipY = false;
    let renderTexture;
    let generated = false;
    if (target) {
      if (target instanceof RenderTexture) {
        renderTexture = target;
      } else {
        renderTexture = renderer.generateTexture(target, {
          resolution: renderer.resolution,
          multisample: renderer.multisample
        });
        generated = true;
      }
    }
    if (renderTexture) {
      resolution = renderTexture.baseTexture.resolution;
      frame = frame ?? renderTexture.frame;
      flipY = false;
      if (!generated) {
        renderer.renderTexture.bind(renderTexture);
        const fbo = renderTexture.framebuffer.glFramebuffers[renderer.CONTEXT_UID];
        if (fbo.blitFramebuffer) {
          renderer.framebuffer.bind(fbo.blitFramebuffer);
        }
      }
    } else {
      resolution = renderer.resolution;
      if (!frame) {
        frame = TEMP_RECT;
        frame.width = renderer.width / resolution;
        frame.height = renderer.height / resolution;
      }
      flipY = true;
      renderer.renderTexture.bind();
    }
    const width = Math.round(frame.width * resolution);
    const height = Math.round(frame.height * resolution);
    const pixels = new Uint8Array(BYTES_PER_PIXEL * width * height);
    const gl = renderer.gl;
    gl.readPixels(Math.round(frame.x * resolution), Math.round(frame.y * resolution), width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    if (generated) {
      renderTexture?.destroy(true);
    }
    return { pixels, width, height, flipY };
  }
  destroy() {
    this.renderer = null;
  }
  static _flipY(pixels, width, height) {
    const w3 = width << 2;
    const h2 = height >> 1;
    const temp = new Uint8Array(w3);
    for (let y2 = 0; y2 < h2; y2++) {
      const t2 = y2 * w3;
      const b3 = (height - y2 - 1) * w3;
      temp.set(pixels.subarray(t2, t2 + w3));
      pixels.copyWithin(t2, b3, b3 + w3);
      pixels.set(temp, b3);
    }
  }
  static _unpremultiplyAlpha(pixels) {
    if (pixels instanceof Uint8ClampedArray) {
      pixels = new Uint8Array(pixels.buffer);
    }
    const n2 = pixels.length;
    for (let i2 = 0; i2 < n2; i2 += 4) {
      const alpha = pixels[i2 + 3];
      if (alpha !== 0) {
        const a2 = 255.001 / alpha;
        pixels[i2] = pixels[i2] * a2 + 0.5;
        pixels[i2 + 1] = pixels[i2 + 1] * a2 + 0.5;
        pixels[i2 + 2] = pixels[i2 + 2] * a2 + 0.5;
      }
    }
  }
};
var Extract = _Extract;
Extract.extension = {
  name: "extract",
  type: ExtensionType.RendererSystem
};
extensions.add(Extract);

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/buildCircle.mjs
var buildCircle = {
  build(graphicsData) {
    const points = graphicsData.points;
    let x2;
    let y2;
    let dx;
    let dy;
    let rx;
    let ry;
    if (graphicsData.type === SHAPES.CIRC) {
      const circle = graphicsData.shape;
      x2 = circle.x;
      y2 = circle.y;
      rx = ry = circle.radius;
      dx = dy = 0;
    } else if (graphicsData.type === SHAPES.ELIP) {
      const ellipse = graphicsData.shape;
      x2 = ellipse.x;
      y2 = ellipse.y;
      rx = ellipse.width;
      ry = ellipse.height;
      dx = dy = 0;
    } else {
      const roundedRect = graphicsData.shape;
      const halfWidth = roundedRect.width / 2;
      const halfHeight = roundedRect.height / 2;
      x2 = roundedRect.x + halfWidth;
      y2 = roundedRect.y + halfHeight;
      rx = ry = Math.max(0, Math.min(roundedRect.radius, Math.min(halfWidth, halfHeight)));
      dx = halfWidth - rx;
      dy = halfHeight - ry;
    }
    if (!(rx >= 0 && ry >= 0 && dx >= 0 && dy >= 0)) {
      points.length = 0;
      return;
    }
    const n2 = Math.ceil(2.3 * Math.sqrt(rx + ry));
    const m2 = n2 * 8 + (dx ? 4 : 0) + (dy ? 4 : 0);
    points.length = m2;
    if (m2 === 0) {
      return;
    }
    if (n2 === 0) {
      points.length = 8;
      points[0] = points[6] = x2 + dx;
      points[1] = points[3] = y2 + dy;
      points[2] = points[4] = x2 - dx;
      points[5] = points[7] = y2 - dy;
      return;
    }
    let j1 = 0;
    let j22 = n2 * 4 + (dx ? 2 : 0) + 2;
    let j3 = j22;
    let j4 = m2;
    {
      const x0 = dx + rx;
      const y0 = dy;
      const x1 = x2 + x0;
      const x22 = x2 - x0;
      const y1 = y2 + y0;
      points[j1++] = x1;
      points[j1++] = y1;
      points[--j22] = y1;
      points[--j22] = x22;
      if (dy) {
        const y22 = y2 - y0;
        points[j3++] = x22;
        points[j3++] = y22;
        points[--j4] = y22;
        points[--j4] = x1;
      }
    }
    for (let i2 = 1; i2 < n2; i2++) {
      const a2 = Math.PI / 2 * (i2 / n2);
      const x0 = dx + Math.cos(a2) * rx;
      const y0 = dy + Math.sin(a2) * ry;
      const x1 = x2 + x0;
      const x22 = x2 - x0;
      const y1 = y2 + y0;
      const y22 = y2 - y0;
      points[j1++] = x1;
      points[j1++] = y1;
      points[--j22] = y1;
      points[--j22] = x22;
      points[j3++] = x22;
      points[j3++] = y22;
      points[--j4] = y22;
      points[--j4] = x1;
    }
    {
      const x0 = dx;
      const y0 = dy + ry;
      const x1 = x2 + x0;
      const x22 = x2 - x0;
      const y1 = y2 + y0;
      const y22 = y2 - y0;
      points[j1++] = x1;
      points[j1++] = y1;
      points[--j4] = y22;
      points[--j4] = x1;
      if (dx) {
        points[j1++] = x22;
        points[j1++] = y1;
        points[--j4] = y22;
        points[--j4] = x22;
      }
    }
  },
  triangulate(graphicsData, graphicsGeometry) {
    const points = graphicsData.points;
    const verts = graphicsGeometry.points;
    const indices2 = graphicsGeometry.indices;
    if (points.length === 0) {
      return;
    }
    let vertPos = verts.length / 2;
    const center = vertPos;
    let x2;
    let y2;
    if (graphicsData.type !== SHAPES.RREC) {
      const circle = graphicsData.shape;
      x2 = circle.x;
      y2 = circle.y;
    } else {
      const roundedRect = graphicsData.shape;
      x2 = roundedRect.x + roundedRect.width / 2;
      y2 = roundedRect.y + roundedRect.height / 2;
    }
    const matrix = graphicsData.matrix;
    verts.push(graphicsData.matrix ? matrix.a * x2 + matrix.c * y2 + matrix.tx : x2, graphicsData.matrix ? matrix.b * x2 + matrix.d * y2 + matrix.ty : y2);
    vertPos++;
    verts.push(points[0], points[1]);
    for (let i2 = 2; i2 < points.length; i2 += 2) {
      verts.push(points[i2], points[i2 + 1]);
      indices2.push(vertPos++, center, vertPos);
    }
    indices2.push(center + 1, center, vertPos);
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/buildPoly.mjs
function fixOrientation(points, hole = false) {
  const m2 = points.length;
  if (m2 < 6) {
    return;
  }
  let area = 0;
  for (let i2 = 0, x1 = points[m2 - 2], y1 = points[m2 - 1]; i2 < m2; i2 += 2) {
    const x2 = points[i2];
    const y2 = points[i2 + 1];
    area += (x2 - x1) * (y2 + y1);
    x1 = x2;
    y1 = y2;
  }
  if (!hole && area > 0 || hole && area <= 0) {
    const n2 = m2 / 2;
    for (let i2 = n2 + n2 % 2; i2 < m2; i2 += 2) {
      const i1 = m2 - i2 - 2;
      const i22 = m2 - i2 - 1;
      const i3 = i2;
      const i4 = i2 + 1;
      [points[i1], points[i3]] = [points[i3], points[i1]];
      [points[i22], points[i4]] = [points[i4], points[i22]];
    }
  }
}
var buildPoly = {
  build(graphicsData) {
    graphicsData.points = graphicsData.shape.points.slice();
  },
  triangulate(graphicsData, graphicsGeometry) {
    let points = graphicsData.points;
    const holes = graphicsData.holes;
    const verts = graphicsGeometry.points;
    const indices2 = graphicsGeometry.indices;
    if (points.length >= 6) {
      fixOrientation(points, false);
      const holeArray = [];
      for (let i2 = 0; i2 < holes.length; i2++) {
        const hole = holes[i2];
        fixOrientation(hole.points, true);
        holeArray.push(points.length / 2);
        points = points.concat(hole.points);
      }
      const triangles = lib_exports.earcut(points, holeArray, 2);
      if (!triangles) {
        return;
      }
      const vertPos = verts.length / 2;
      for (let i2 = 0; i2 < triangles.length; i2 += 3) {
        indices2.push(triangles[i2] + vertPos);
        indices2.push(triangles[i2 + 1] + vertPos);
        indices2.push(triangles[i2 + 2] + vertPos);
      }
      for (let i2 = 0; i2 < points.length; i2++) {
        verts.push(points[i2]);
      }
    }
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/buildRectangle.mjs
var buildRectangle = {
  build(graphicsData) {
    const rectData = graphicsData.shape;
    const x2 = rectData.x;
    const y2 = rectData.y;
    const width = rectData.width;
    const height = rectData.height;
    const points = graphicsData.points;
    points.length = 0;
    if (!(width >= 0 && height >= 0)) {
      return;
    }
    points.push(x2, y2, x2 + width, y2, x2 + width, y2 + height, x2, y2 + height);
  },
  triangulate(graphicsData, graphicsGeometry) {
    const points = graphicsData.points;
    const verts = graphicsGeometry.points;
    if (points.length === 0) {
      return;
    }
    const vertPos = verts.length / 2;
    verts.push(points[0], points[1], points[2], points[3], points[6], points[7], points[4], points[5]);
    graphicsGeometry.indices.push(vertPos, vertPos + 1, vertPos + 2, vertPos + 1, vertPos + 2, vertPos + 3);
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/buildRoundedRectangle.mjs
var buildRoundedRectangle = {
  build(graphicsData) {
    buildCircle.build(graphicsData);
  },
  triangulate(graphicsData, graphicsGeometry) {
    buildCircle.triangulate(graphicsData, graphicsGeometry);
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/const.mjs
var LINE_JOIN = /* @__PURE__ */ ((LINE_JOIN2) => {
  LINE_JOIN2["MITER"] = "miter";
  LINE_JOIN2["BEVEL"] = "bevel";
  LINE_JOIN2["ROUND"] = "round";
  return LINE_JOIN2;
})(LINE_JOIN || {});
var LINE_CAP = /* @__PURE__ */ ((LINE_CAP2) => {
  LINE_CAP2["BUTT"] = "butt";
  LINE_CAP2["ROUND"] = "round";
  LINE_CAP2["SQUARE"] = "square";
  return LINE_CAP2;
})(LINE_CAP || {});
var curves = {
  adaptive: true,
  maxLength: 10,
  minSegments: 8,
  maxSegments: 2048,
  epsilon: 1e-4,
  _segmentsCount(length, defaultSegments = 20) {
    if (!this.adaptive || !length || isNaN(length)) {
      return defaultSegments;
    }
    let result = Math.ceil(length / this.maxLength);
    if (result < this.minSegments) {
      result = this.minSegments;
    } else if (result > this.maxSegments) {
      result = this.maxSegments;
    }
    return result;
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/ArcUtils.mjs
var ArcUtils = class {
  static curveTo(x1, y1, x2, y2, radius, points) {
    const fromX = points[points.length - 2];
    const fromY = points[points.length - 1];
    const a1 = fromY - y1;
    const b1 = fromX - x1;
    const a2 = y2 - y1;
    const b22 = x2 - x1;
    const mm = Math.abs(a1 * b22 - b1 * a2);
    if (mm < 1e-8 || radius === 0) {
      if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) {
        points.push(x1, y1);
      }
      return null;
    }
    const dd = a1 * a1 + b1 * b1;
    const cc = a2 * a2 + b22 * b22;
    const tt2 = a1 * a2 + b1 * b22;
    const k1 = radius * Math.sqrt(dd) / mm;
    const k22 = radius * Math.sqrt(cc) / mm;
    const j1 = k1 * tt2 / dd;
    const j22 = k22 * tt2 / cc;
    const cx = k1 * b22 + k22 * b1;
    const cy = k1 * a2 + k22 * a1;
    const px = b1 * (k22 + j1);
    const py = a1 * (k22 + j1);
    const qx = b22 * (k1 + j22);
    const qy = a2 * (k1 + j22);
    const startAngle = Math.atan2(py - cy, px - cx);
    const endAngle = Math.atan2(qy - cy, qx - cx);
    return {
      cx: cx + x1,
      cy: cy + y1,
      radius,
      startAngle,
      endAngle,
      anticlockwise: b1 * a2 > b22 * a1
    };
  }
  static arc(_startX, _startY, cx, cy, radius, startAngle, endAngle, _anticlockwise, points) {
    const sweep = endAngle - startAngle;
    const n2 = curves._segmentsCount(Math.abs(sweep) * radius, Math.ceil(Math.abs(sweep) / PI_2) * 40);
    const theta = sweep / (n2 * 2);
    const theta2 = theta * 2;
    const cTheta = Math.cos(theta);
    const sTheta = Math.sin(theta);
    const segMinus = n2 - 1;
    const remainder = segMinus % 1 / segMinus;
    for (let i2 = 0; i2 <= segMinus; ++i2) {
      const real = i2 + remainder * i2;
      const angle = theta + startAngle + theta2 * real;
      const c2 = Math.cos(angle);
      const s2 = -Math.sin(angle);
      points.push((cTheta * c2 + sTheta * s2) * radius + cx, (cTheta * -s2 + sTheta * c2) * radius + cy);
    }
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/BatchPart.mjs
var BatchPart = class {
  constructor() {
    this.reset();
  }
  begin(style, startIndex, attribStart) {
    this.reset();
    this.style = style;
    this.start = startIndex;
    this.attribStart = attribStart;
  }
  end(endIndex, endAttrib) {
    this.attribSize = endAttrib - this.attribStart;
    this.size = endIndex - this.start;
  }
  reset() {
    this.style = null;
    this.size = 0;
    this.start = 0;
    this.attribStart = 0;
    this.attribSize = 0;
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/BezierUtils.mjs
var BezierUtils = class {
  static curveLength(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY) {
    const n2 = 10;
    let result = 0;
    let t2 = 0;
    let t22 = 0;
    let t3 = 0;
    let nt = 0;
    let nt2 = 0;
    let nt3 = 0;
    let x2 = 0;
    let y2 = 0;
    let dx = 0;
    let dy = 0;
    let prevX = fromX;
    let prevY = fromY;
    for (let i2 = 1; i2 <= n2; ++i2) {
      t2 = i2 / n2;
      t22 = t2 * t2;
      t3 = t22 * t2;
      nt = 1 - t2;
      nt2 = nt * nt;
      nt3 = nt2 * nt;
      x2 = nt3 * fromX + 3 * nt2 * t2 * cpX + 3 * nt * t22 * cpX2 + t3 * toX;
      y2 = nt3 * fromY + 3 * nt2 * t2 * cpY + 3 * nt * t22 * cpY2 + t3 * toY;
      dx = prevX - x2;
      dy = prevY - y2;
      prevX = x2;
      prevY = y2;
      result += Math.sqrt(dx * dx + dy * dy);
    }
    return result;
  }
  static curveTo(cpX, cpY, cpX2, cpY2, toX, toY, points) {
    const fromX = points[points.length - 2];
    const fromY = points[points.length - 1];
    points.length -= 2;
    const n2 = curves._segmentsCount(BezierUtils.curveLength(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY));
    let dt = 0;
    let dt2 = 0;
    let dt3 = 0;
    let t2 = 0;
    let t3 = 0;
    points.push(fromX, fromY);
    for (let i2 = 1, j3 = 0; i2 <= n2; ++i2) {
      j3 = i2 / n2;
      dt = 1 - j3;
      dt2 = dt * dt;
      dt3 = dt2 * dt;
      t2 = j3 * j3;
      t3 = t2 * j3;
      points.push(dt3 * fromX + 3 * dt2 * j3 * cpX + 3 * dt * t2 * cpX2 + t3 * toX, dt3 * fromY + 3 * dt2 * j3 * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
    }
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/buildLine.mjs
function square(x2, y2, nx, ny, innerWeight, outerWeight, clockwise, verts) {
  const ix = x2 - nx * innerWeight;
  const iy = y2 - ny * innerWeight;
  const ox = x2 + nx * outerWeight;
  const oy = y2 + ny * outerWeight;
  let exx;
  let eyy;
  if (clockwise) {
    exx = ny;
    eyy = -nx;
  } else {
    exx = -ny;
    eyy = nx;
  }
  const eix = ix + exx;
  const eiy = iy + eyy;
  const eox = ox + exx;
  const eoy = oy + eyy;
  verts.push(eix, eiy, eox, eoy);
  return 2;
}
function round(cx, cy, sx, sy, ex, ey, verts, clockwise) {
  const cx2p0x = sx - cx;
  const cy2p0y = sy - cy;
  let angle0 = Math.atan2(cx2p0x, cy2p0y);
  let angle1 = Math.atan2(ex - cx, ey - cy);
  if (clockwise && angle0 < angle1) {
    angle0 += Math.PI * 2;
  } else if (!clockwise && angle0 > angle1) {
    angle1 += Math.PI * 2;
  }
  let startAngle = angle0;
  const angleDiff = angle1 - angle0;
  const absAngleDiff = Math.abs(angleDiff);
  const radius = Math.sqrt(cx2p0x * cx2p0x + cy2p0y * cy2p0y);
  const segCount = (15 * absAngleDiff * Math.sqrt(radius) / Math.PI >> 0) + 1;
  const angleInc = angleDiff / segCount;
  startAngle += angleInc;
  if (clockwise) {
    verts.push(cx, cy, sx, sy);
    for (let i2 = 1, angle = startAngle; i2 < segCount; i2++, angle += angleInc) {
      verts.push(cx, cy, cx + Math.sin(angle) * radius, cy + Math.cos(angle) * radius);
    }
    verts.push(cx, cy, ex, ey);
  } else {
    verts.push(sx, sy, cx, cy);
    for (let i2 = 1, angle = startAngle; i2 < segCount; i2++, angle += angleInc) {
      verts.push(cx + Math.sin(angle) * radius, cy + Math.cos(angle) * radius, cx, cy);
    }
    verts.push(ex, ey, cx, cy);
  }
  return segCount * 2;
}
function buildNonNativeLine(graphicsData, graphicsGeometry) {
  const shape = graphicsData.shape;
  let points = graphicsData.points || shape.points.slice();
  const eps = graphicsGeometry.closePointEps;
  if (points.length === 0) {
    return;
  }
  const style = graphicsData.lineStyle;
  const firstPoint = new Point(points[0], points[1]);
  const lastPoint = new Point(points[points.length - 2], points[points.length - 1]);
  const closedShape = shape.type !== SHAPES.POLY || shape.closeStroke;
  const closedPath = Math.abs(firstPoint.x - lastPoint.x) < eps && Math.abs(firstPoint.y - lastPoint.y) < eps;
  if (closedShape) {
    points = points.slice();
    if (closedPath) {
      points.pop();
      points.pop();
      lastPoint.set(points[points.length - 2], points[points.length - 1]);
    }
    const midPointX = (firstPoint.x + lastPoint.x) * 0.5;
    const midPointY = (lastPoint.y + firstPoint.y) * 0.5;
    points.unshift(midPointX, midPointY);
    points.push(midPointX, midPointY);
  }
  const verts = graphicsGeometry.points;
  const length = points.length / 2;
  let indexCount = points.length;
  const indexStart = verts.length / 2;
  const width = style.width / 2;
  const widthSquared = width * width;
  const miterLimitSquared = style.miterLimit * style.miterLimit;
  let x0 = points[0];
  let y0 = points[1];
  let x1 = points[2];
  let y1 = points[3];
  let x2 = 0;
  let y2 = 0;
  let perpx = -(y0 - y1);
  let perpy = x0 - x1;
  let perp1x = 0;
  let perp1y = 0;
  let dist = Math.sqrt(perpx * perpx + perpy * perpy);
  perpx /= dist;
  perpy /= dist;
  perpx *= width;
  perpy *= width;
  const ratio = style.alignment;
  const innerWeight = (1 - ratio) * 2;
  const outerWeight = ratio * 2;
  if (!closedShape) {
    if (style.cap === LINE_CAP.ROUND) {
      indexCount += round(x0 - perpx * (innerWeight - outerWeight) * 0.5, y0 - perpy * (innerWeight - outerWeight) * 0.5, x0 - perpx * innerWeight, y0 - perpy * innerWeight, x0 + perpx * outerWeight, y0 + perpy * outerWeight, verts, true) + 2;
    } else if (style.cap === LINE_CAP.SQUARE) {
      indexCount += square(x0, y0, perpx, perpy, innerWeight, outerWeight, true, verts);
    }
  }
  verts.push(x0 - perpx * innerWeight, y0 - perpy * innerWeight, x0 + perpx * outerWeight, y0 + perpy * outerWeight);
  for (let i2 = 1; i2 < length - 1; ++i2) {
    x0 = points[(i2 - 1) * 2];
    y0 = points[(i2 - 1) * 2 + 1];
    x1 = points[i2 * 2];
    y1 = points[i2 * 2 + 1];
    x2 = points[(i2 + 1) * 2];
    y2 = points[(i2 + 1) * 2 + 1];
    perpx = -(y0 - y1);
    perpy = x0 - x1;
    dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;
    perp1x = -(y1 - y2);
    perp1y = x1 - x2;
    dist = Math.sqrt(perp1x * perp1x + perp1y * perp1y);
    perp1x /= dist;
    perp1y /= dist;
    perp1x *= width;
    perp1y *= width;
    const dx0 = x1 - x0;
    const dy0 = y0 - y1;
    const dx1 = x1 - x2;
    const dy1 = y2 - y1;
    const dot = dx0 * dx1 + dy0 * dy1;
    const cross = dy0 * dx1 - dy1 * dx0;
    const clockwise = cross < 0;
    if (Math.abs(cross) < 1e-3 * Math.abs(dot)) {
      verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 + perpx * outerWeight, y1 + perpy * outerWeight);
      if (dot >= 0) {
        if (style.join === LINE_JOIN.ROUND) {
          indexCount += round(x1, y1, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, verts, false) + 4;
        } else {
          indexCount += 2;
        }
        verts.push(x1 - perp1x * outerWeight, y1 - perp1y * outerWeight, x1 + perp1x * innerWeight, y1 + perp1y * innerWeight);
      }
      continue;
    }
    const c1 = (-perpx + x0) * (-perpy + y1) - (-perpx + x1) * (-perpy + y0);
    const c2 = (-perp1x + x2) * (-perp1y + y1) - (-perp1x + x1) * (-perp1y + y2);
    const px = (dx0 * c2 - dx1 * c1) / cross;
    const py = (dy1 * c1 - dy0 * c2) / cross;
    const pdist = (px - x1) * (px - x1) + (py - y1) * (py - y1);
    const imx = x1 + (px - x1) * innerWeight;
    const imy = y1 + (py - y1) * innerWeight;
    const omx = x1 - (px - x1) * outerWeight;
    const omy = y1 - (py - y1) * outerWeight;
    const smallerInsideSegmentSq = Math.min(dx0 * dx0 + dy0 * dy0, dx1 * dx1 + dy1 * dy1);
    const insideWeight = clockwise ? innerWeight : outerWeight;
    const smallerInsideDiagonalSq = smallerInsideSegmentSq + insideWeight * insideWeight * widthSquared;
    const insideMiterOk = pdist <= smallerInsideDiagonalSq;
    let join = style.join;
    if (join === LINE_JOIN.MITER && pdist / widthSquared > miterLimitSquared) {
      join = LINE_JOIN.BEVEL;
    }
    if (insideMiterOk) {
      switch (join) {
        case LINE_JOIN.MITER: {
          verts.push(imx, imy, omx, omy);
          break;
        }
        case LINE_JOIN.BEVEL: {
          if (clockwise) {
            verts.push(imx, imy, x1 + perpx * outerWeight, y1 + perpy * outerWeight, imx, imy, x1 + perp1x * outerWeight, y1 + perp1y * outerWeight);
          } else {
            verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight, omx, omy, x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, omx, omy);
          }
          indexCount += 2;
          break;
        }
        case LINE_JOIN.ROUND: {
          if (clockwise) {
            verts.push(imx, imy, x1 + perpx * outerWeight, y1 + perpy * outerWeight);
            indexCount += round(x1, y1, x1 + perpx * outerWeight, y1 + perpy * outerWeight, x1 + perp1x * outerWeight, y1 + perp1y * outerWeight, verts, true) + 4;
            verts.push(imx, imy, x1 + perp1x * outerWeight, y1 + perp1y * outerWeight);
          } else {
            verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight, omx, omy);
            indexCount += round(x1, y1, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, verts, false) + 4;
            verts.push(x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, omx, omy);
          }
          break;
        }
      }
    } else {
      verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 + perpx * outerWeight, y1 + perpy * outerWeight);
      switch (join) {
        case LINE_JOIN.MITER: {
          if (clockwise) {
            verts.push(omx, omy, omx, omy);
          } else {
            verts.push(imx, imy, imx, imy);
          }
          indexCount += 2;
          break;
        }
        case LINE_JOIN.ROUND: {
          if (clockwise) {
            indexCount += round(x1, y1, x1 + perpx * outerWeight, y1 + perpy * outerWeight, x1 + perp1x * outerWeight, y1 + perp1y * outerWeight, verts, true) + 2;
          } else {
            indexCount += round(x1, y1, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, verts, false) + 2;
          }
          break;
        }
      }
      verts.push(x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, x1 + perp1x * outerWeight, y1 + perp1y * outerWeight);
      indexCount += 2;
    }
  }
  x0 = points[(length - 2) * 2];
  y0 = points[(length - 2) * 2 + 1];
  x1 = points[(length - 1) * 2];
  y1 = points[(length - 1) * 2 + 1];
  perpx = -(y0 - y1);
  perpy = x0 - x1;
  dist = Math.sqrt(perpx * perpx + perpy * perpy);
  perpx /= dist;
  perpy /= dist;
  perpx *= width;
  perpy *= width;
  verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 + perpx * outerWeight, y1 + perpy * outerWeight);
  if (!closedShape) {
    if (style.cap === LINE_CAP.ROUND) {
      indexCount += round(x1 - perpx * (innerWeight - outerWeight) * 0.5, y1 - perpy * (innerWeight - outerWeight) * 0.5, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 + perpx * outerWeight, y1 + perpy * outerWeight, verts, false) + 2;
    } else if (style.cap === LINE_CAP.SQUARE) {
      indexCount += square(x1, y1, perpx, perpy, innerWeight, outerWeight, false, verts);
    }
  }
  const indices2 = graphicsGeometry.indices;
  const eps2 = curves.epsilon * curves.epsilon;
  for (let i2 = indexStart; i2 < indexCount + indexStart - 2; ++i2) {
    x0 = verts[i2 * 2];
    y0 = verts[i2 * 2 + 1];
    x1 = verts[(i2 + 1) * 2];
    y1 = verts[(i2 + 1) * 2 + 1];
    x2 = verts[(i2 + 2) * 2];
    y2 = verts[(i2 + 2) * 2 + 1];
    if (Math.abs(x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1)) < eps2) {
      continue;
    }
    indices2.push(i2, i2 + 1, i2 + 2);
  }
}
function buildNativeLine(graphicsData, graphicsGeometry) {
  let i2 = 0;
  const shape = graphicsData.shape;
  const points = graphicsData.points || shape.points;
  const closedShape = shape.type !== SHAPES.POLY || shape.closeStroke;
  if (points.length === 0)
    return;
  const verts = graphicsGeometry.points;
  const indices2 = graphicsGeometry.indices;
  const length = points.length / 2;
  const startIndex = verts.length / 2;
  let currentIndex = startIndex;
  verts.push(points[0], points[1]);
  for (i2 = 1; i2 < length; i2++) {
    verts.push(points[i2 * 2], points[i2 * 2 + 1]);
    indices2.push(currentIndex, currentIndex + 1);
    currentIndex++;
  }
  if (closedShape) {
    indices2.push(currentIndex, startIndex);
  }
}
function buildLine(graphicsData, graphicsGeometry) {
  if (graphicsData.lineStyle.native) {
    buildNativeLine(graphicsData, graphicsGeometry);
  } else {
    buildNonNativeLine(graphicsData, graphicsGeometry);
  }
}

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/QuadraticUtils.mjs
var QuadraticUtils = class {
  static curveLength(fromX, fromY, cpX, cpY, toX, toY) {
    const ax = fromX - 2 * cpX + toX;
    const ay = fromY - 2 * cpY + toY;
    const bx = 2 * cpX - 2 * fromX;
    const by = 2 * cpY - 2 * fromY;
    const a2 = 4 * (ax * ax + ay * ay);
    const b3 = 4 * (ax * bx + ay * by);
    const c2 = bx * bx + by * by;
    const s2 = 2 * Math.sqrt(a2 + b3 + c2);
    const a22 = Math.sqrt(a2);
    const a32 = 2 * a2 * a22;
    const c22 = 2 * Math.sqrt(c2);
    const ba = b3 / a22;
    return (a32 * s2 + a22 * b3 * (s2 - c22) + (4 * c2 * a2 - b3 * b3) * Math.log((2 * a22 + ba + s2) / (ba + c22))) / (4 * a32);
  }
  static curveTo(cpX, cpY, toX, toY, points) {
    const fromX = points[points.length - 2];
    const fromY = points[points.length - 1];
    const n2 = curves._segmentsCount(QuadraticUtils.curveLength(fromX, fromY, cpX, cpY, toX, toY));
    let xa = 0;
    let ya = 0;
    for (let i2 = 1; i2 <= n2; ++i2) {
      const j3 = i2 / n2;
      xa = fromX + (cpX - fromX) * j3;
      ya = fromY + (cpY - fromY) * j3;
      points.push(xa + (cpX + (toX - cpX) * j3 - xa) * j3, ya + (cpY + (toY - cpY) * j3 - ya) * j3);
    }
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/utils/index.mjs
var FILL_COMMANDS = {
  [SHAPES.POLY]: buildPoly,
  [SHAPES.CIRC]: buildCircle,
  [SHAPES.ELIP]: buildCircle,
  [SHAPES.RECT]: buildRectangle,
  [SHAPES.RREC]: buildRoundedRectangle
};
var BATCH_POOL = [];
var DRAW_CALL_POOL = [];

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/GraphicsData.mjs
var GraphicsData = class {
  constructor(shape, fillStyle = null, lineStyle = null, matrix = null) {
    this.points = [];
    this.holes = [];
    this.shape = shape;
    this.lineStyle = lineStyle;
    this.fillStyle = fillStyle;
    this.matrix = matrix;
    this.type = shape.type;
  }
  clone() {
    return new GraphicsData(this.shape, this.fillStyle, this.lineStyle, this.matrix);
  }
  destroy() {
    this.shape = null;
    this.holes.length = 0;
    this.holes = null;
    this.points.length = 0;
    this.points = null;
    this.lineStyle = null;
    this.fillStyle = null;
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/GraphicsGeometry.mjs
var tmpPoint = new Point();
var _GraphicsGeometry = class extends BatchGeometry {
  constructor() {
    super();
    this.closePointEps = 1e-4;
    this.boundsPadding = 0;
    this.uvsFloat32 = null;
    this.indicesUint16 = null;
    this.batchable = false;
    this.points = [];
    this.colors = [];
    this.uvs = [];
    this.indices = [];
    this.textureIds = [];
    this.graphicsData = [];
    this.drawCalls = [];
    this.batchDirty = -1;
    this.batches = [];
    this.dirty = 0;
    this.cacheDirty = -1;
    this.clearDirty = 0;
    this.shapeIndex = 0;
    this._bounds = new Bounds();
    this.boundsDirty = -1;
  }
  get bounds() {
    this.updateBatches();
    if (this.boundsDirty !== this.dirty) {
      this.boundsDirty = this.dirty;
      this.calculateBounds();
    }
    return this._bounds;
  }
  invalidate() {
    this.boundsDirty = -1;
    this.dirty++;
    this.batchDirty++;
    this.shapeIndex = 0;
    this.points.length = 0;
    this.colors.length = 0;
    this.uvs.length = 0;
    this.indices.length = 0;
    this.textureIds.length = 0;
    for (let i2 = 0; i2 < this.drawCalls.length; i2++) {
      this.drawCalls[i2].texArray.clear();
      DRAW_CALL_POOL.push(this.drawCalls[i2]);
    }
    this.drawCalls.length = 0;
    for (let i2 = 0; i2 < this.batches.length; i2++) {
      const batchPart = this.batches[i2];
      batchPart.reset();
      BATCH_POOL.push(batchPart);
    }
    this.batches.length = 0;
  }
  clear() {
    if (this.graphicsData.length > 0) {
      this.invalidate();
      this.clearDirty++;
      this.graphicsData.length = 0;
    }
    return this;
  }
  drawShape(shape, fillStyle = null, lineStyle = null, matrix = null) {
    const data = new GraphicsData(shape, fillStyle, lineStyle, matrix);
    this.graphicsData.push(data);
    this.dirty++;
    return this;
  }
  drawHole(shape, matrix = null) {
    if (!this.graphicsData.length) {
      return null;
    }
    const data = new GraphicsData(shape, null, null, matrix);
    const lastShape = this.graphicsData[this.graphicsData.length - 1];
    data.lineStyle = lastShape.lineStyle;
    lastShape.holes.push(data);
    this.dirty++;
    return this;
  }
  destroy() {
    super.destroy();
    for (let i2 = 0; i2 < this.graphicsData.length; ++i2) {
      this.graphicsData[i2].destroy();
    }
    this.points.length = 0;
    this.points = null;
    this.colors.length = 0;
    this.colors = null;
    this.uvs.length = 0;
    this.uvs = null;
    this.indices.length = 0;
    this.indices = null;
    this.indexBuffer.destroy();
    this.indexBuffer = null;
    this.graphicsData.length = 0;
    this.graphicsData = null;
    this.drawCalls.length = 0;
    this.drawCalls = null;
    this.batches.length = 0;
    this.batches = null;
    this._bounds = null;
  }
  containsPoint(point) {
    const graphicsData = this.graphicsData;
    for (let i2 = 0; i2 < graphicsData.length; ++i2) {
      const data = graphicsData[i2];
      if (!data.fillStyle.visible) {
        continue;
      }
      if (data.shape) {
        if (data.matrix) {
          data.matrix.applyInverse(point, tmpPoint);
        } else {
          tmpPoint.copyFrom(point);
        }
        if (data.shape.contains(tmpPoint.x, tmpPoint.y)) {
          let hitHole = false;
          if (data.holes) {
            for (let i22 = 0; i22 < data.holes.length; i22++) {
              const hole = data.holes[i22];
              if (hole.shape.contains(tmpPoint.x, tmpPoint.y)) {
                hitHole = true;
                break;
              }
            }
          }
          if (!hitHole) {
            return true;
          }
        }
      }
    }
    return false;
  }
  updateBatches() {
    if (!this.graphicsData.length) {
      this.batchable = true;
      return;
    }
    if (!this.validateBatching()) {
      return;
    }
    this.cacheDirty = this.dirty;
    const uvs = this.uvs;
    const graphicsData = this.graphicsData;
    let batchPart = null;
    let currentStyle = null;
    if (this.batches.length > 0) {
      batchPart = this.batches[this.batches.length - 1];
      currentStyle = batchPart.style;
    }
    for (let i2 = this.shapeIndex; i2 < graphicsData.length; i2++) {
      this.shapeIndex++;
      const data = graphicsData[i2];
      const fillStyle = data.fillStyle;
      const lineStyle = data.lineStyle;
      const command = FILL_COMMANDS[data.type];
      command.build(data);
      if (data.matrix) {
        this.transformPoints(data.points, data.matrix);
      }
      if (fillStyle.visible || lineStyle.visible) {
        this.processHoles(data.holes);
      }
      for (let j3 = 0; j3 < 2; j3++) {
        const style = j3 === 0 ? fillStyle : lineStyle;
        if (!style.visible)
          continue;
        const nextTexture = style.texture.baseTexture;
        const index2 = this.indices.length;
        const attribIndex = this.points.length / 2;
        nextTexture.wrapMode = WRAP_MODES.REPEAT;
        if (j3 === 0) {
          this.processFill(data);
        } else {
          this.processLine(data);
        }
        const size = this.points.length / 2 - attribIndex;
        if (size === 0)
          continue;
        if (batchPart && !this._compareStyles(currentStyle, style)) {
          batchPart.end(index2, attribIndex);
          batchPart = null;
        }
        if (!batchPart) {
          batchPart = BATCH_POOL.pop() || new BatchPart();
          batchPart.begin(style, index2, attribIndex);
          this.batches.push(batchPart);
          currentStyle = style;
        }
        this.addUvs(this.points, uvs, style.texture, attribIndex, size, style.matrix);
      }
    }
    const index = this.indices.length;
    const attrib = this.points.length / 2;
    if (batchPart) {
      batchPart.end(index, attrib);
    }
    if (this.batches.length === 0) {
      this.batchable = true;
      return;
    }
    const need32 = attrib > 65535;
    if (this.indicesUint16 && this.indices.length === this.indicesUint16.length && need32 === this.indicesUint16.BYTES_PER_ELEMENT > 2) {
      this.indicesUint16.set(this.indices);
    } else {
      this.indicesUint16 = need32 ? new Uint32Array(this.indices) : new Uint16Array(this.indices);
    }
    this.batchable = this.isBatchable();
    if (this.batchable) {
      this.packBatches();
    } else {
      this.buildDrawCalls();
    }
  }
  _compareStyles(styleA, styleB) {
    if (!styleA || !styleB) {
      return false;
    }
    if (styleA.texture.baseTexture !== styleB.texture.baseTexture) {
      return false;
    }
    if (styleA.color + styleA.alpha !== styleB.color + styleB.alpha) {
      return false;
    }
    if (!!styleA.native !== !!styleB.native) {
      return false;
    }
    return true;
  }
  validateBatching() {
    if (this.dirty === this.cacheDirty || !this.graphicsData.length) {
      return false;
    }
    for (let i2 = 0, l3 = this.graphicsData.length; i2 < l3; i2++) {
      const data = this.graphicsData[i2];
      const fill = data.fillStyle;
      const line = data.lineStyle;
      if (fill && !fill.texture.baseTexture.valid)
        return false;
      if (line && !line.texture.baseTexture.valid)
        return false;
    }
    return true;
  }
  packBatches() {
    this.batchDirty++;
    this.uvsFloat32 = new Float32Array(this.uvs);
    const batches = this.batches;
    for (let i2 = 0, l3 = batches.length; i2 < l3; i2++) {
      const batch = batches[i2];
      for (let j3 = 0; j3 < batch.size; j3++) {
        const index = batch.start + j3;
        this.indicesUint16[index] = this.indicesUint16[index] - batch.attribStart;
      }
    }
  }
  isBatchable() {
    if (this.points.length > 65535 * 2) {
      return false;
    }
    const batches = this.batches;
    for (let i2 = 0; i2 < batches.length; i2++) {
      if (batches[i2].style.native) {
        return false;
      }
    }
    return this.points.length < _GraphicsGeometry.BATCHABLE_SIZE * 2;
  }
  buildDrawCalls() {
    let TICK = ++BaseTexture._globalBatch;
    for (let i2 = 0; i2 < this.drawCalls.length; i2++) {
      this.drawCalls[i2].texArray.clear();
      DRAW_CALL_POOL.push(this.drawCalls[i2]);
    }
    this.drawCalls.length = 0;
    const colors = this.colors;
    const textureIds = this.textureIds;
    let currentGroup = DRAW_CALL_POOL.pop();
    if (!currentGroup) {
      currentGroup = new BatchDrawCall();
      currentGroup.texArray = new BatchTextureArray();
    }
    currentGroup.texArray.count = 0;
    currentGroup.start = 0;
    currentGroup.size = 0;
    currentGroup.type = DRAW_MODES.TRIANGLES;
    let textureCount = 0;
    let currentTexture = null;
    let textureId = 0;
    let native = false;
    let drawMode = DRAW_MODES.TRIANGLES;
    let index = 0;
    this.drawCalls.push(currentGroup);
    for (let i2 = 0; i2 < this.batches.length; i2++) {
      const data = this.batches[i2];
      const maxTextures = 8;
      const style = data.style;
      const nextTexture = style.texture.baseTexture;
      if (native !== !!style.native) {
        native = !!style.native;
        drawMode = native ? DRAW_MODES.LINES : DRAW_MODES.TRIANGLES;
        currentTexture = null;
        textureCount = maxTextures;
        TICK++;
      }
      if (currentTexture !== nextTexture) {
        currentTexture = nextTexture;
        if (nextTexture._batchEnabled !== TICK) {
          if (textureCount === maxTextures) {
            TICK++;
            textureCount = 0;
            if (currentGroup.size > 0) {
              currentGroup = DRAW_CALL_POOL.pop();
              if (!currentGroup) {
                currentGroup = new BatchDrawCall();
                currentGroup.texArray = new BatchTextureArray();
              }
              this.drawCalls.push(currentGroup);
            }
            currentGroup.start = index;
            currentGroup.size = 0;
            currentGroup.texArray.count = 0;
            currentGroup.type = drawMode;
          }
          nextTexture.touched = 1;
          nextTexture._batchEnabled = TICK;
          nextTexture._batchLocation = textureCount;
          nextTexture.wrapMode = WRAP_MODES.REPEAT;
          currentGroup.texArray.elements[currentGroup.texArray.count++] = nextTexture;
          textureCount++;
        }
      }
      currentGroup.size += data.size;
      index += data.size;
      textureId = nextTexture._batchLocation;
      this.addColors(colors, style.color, style.alpha, data.attribSize, data.attribStart);
      this.addTextureIds(textureIds, textureId, data.attribSize, data.attribStart);
    }
    BaseTexture._globalBatch = TICK;
    this.packAttributes();
  }
  packAttributes() {
    const verts = this.points;
    const uvs = this.uvs;
    const colors = this.colors;
    const textureIds = this.textureIds;
    const glPoints = new ArrayBuffer(verts.length * 3 * 4);
    const f32 = new Float32Array(glPoints);
    const u32 = new Uint32Array(glPoints);
    let p3 = 0;
    for (let i2 = 0; i2 < verts.length / 2; i2++) {
      f32[p3++] = verts[i2 * 2];
      f32[p3++] = verts[i2 * 2 + 1];
      f32[p3++] = uvs[i2 * 2];
      f32[p3++] = uvs[i2 * 2 + 1];
      u32[p3++] = colors[i2];
      f32[p3++] = textureIds[i2];
    }
    this._buffer.update(glPoints);
    this._indexBuffer.update(this.indicesUint16);
  }
  processFill(data) {
    if (data.holes.length) {
      buildPoly.triangulate(data, this);
    } else {
      const command = FILL_COMMANDS[data.type];
      command.triangulate(data, this);
    }
  }
  processLine(data) {
    buildLine(data, this);
    for (let i2 = 0; i2 < data.holes.length; i2++) {
      buildLine(data.holes[i2], this);
    }
  }
  processHoles(holes) {
    for (let i2 = 0; i2 < holes.length; i2++) {
      const hole = holes[i2];
      const command = FILL_COMMANDS[hole.type];
      command.build(hole);
      if (hole.matrix) {
        this.transformPoints(hole.points, hole.matrix);
      }
    }
  }
  calculateBounds() {
    const bounds = this._bounds;
    bounds.clear();
    bounds.addVertexData(this.points, 0, this.points.length);
    bounds.pad(this.boundsPadding, this.boundsPadding);
  }
  transformPoints(points, matrix) {
    for (let i2 = 0; i2 < points.length / 2; i2++) {
      const x2 = points[i2 * 2];
      const y2 = points[i2 * 2 + 1];
      points[i2 * 2] = matrix.a * x2 + matrix.c * y2 + matrix.tx;
      points[i2 * 2 + 1] = matrix.b * x2 + matrix.d * y2 + matrix.ty;
    }
  }
  addColors(colors, color, alpha, size, offset = 0) {
    const bgr = Color.shared.setValue(color).toLittleEndianNumber();
    const result = Color.shared.setValue(bgr).toPremultiplied(alpha);
    colors.length = Math.max(colors.length, offset + size);
    for (let i2 = 0; i2 < size; i2++) {
      colors[offset + i2] = result;
    }
  }
  addTextureIds(textureIds, id, size, offset = 0) {
    textureIds.length = Math.max(textureIds.length, offset + size);
    for (let i2 = 0; i2 < size; i2++) {
      textureIds[offset + i2] = id;
    }
  }
  addUvs(verts, uvs, texture, start, size, matrix = null) {
    let index = 0;
    const uvsStart = uvs.length;
    const frame = texture.frame;
    while (index < size) {
      let x2 = verts[(start + index) * 2];
      let y2 = verts[(start + index) * 2 + 1];
      if (matrix) {
        const nx = matrix.a * x2 + matrix.c * y2 + matrix.tx;
        y2 = matrix.b * x2 + matrix.d * y2 + matrix.ty;
        x2 = nx;
      }
      index++;
      uvs.push(x2 / frame.width, y2 / frame.height);
    }
    const baseTexture = texture.baseTexture;
    if (frame.width < baseTexture.width || frame.height < baseTexture.height) {
      this.adjustUvs(uvs, texture, uvsStart, size);
    }
  }
  adjustUvs(uvs, texture, start, size) {
    const baseTexture = texture.baseTexture;
    const eps = 1e-6;
    const finish = start + size * 2;
    const frame = texture.frame;
    const scaleX = frame.width / baseTexture.width;
    const scaleY = frame.height / baseTexture.height;
    let offsetX = frame.x / frame.width;
    let offsetY = frame.y / frame.height;
    let minX = Math.floor(uvs[start] + eps);
    let minY = Math.floor(uvs[start + 1] + eps);
    for (let i2 = start + 2; i2 < finish; i2 += 2) {
      minX = Math.min(minX, Math.floor(uvs[i2] + eps));
      minY = Math.min(minY, Math.floor(uvs[i2 + 1] + eps));
    }
    offsetX -= minX;
    offsetY -= minY;
    for (let i2 = start; i2 < finish; i2 += 2) {
      uvs[i2] = (uvs[i2] + offsetX) * scaleX;
      uvs[i2 + 1] = (uvs[i2 + 1] + offsetY) * scaleY;
    }
  }
};
var GraphicsGeometry = _GraphicsGeometry;
GraphicsGeometry.BATCHABLE_SIZE = 100;

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/styles/FillStyle.mjs
var FillStyle = class {
  constructor() {
    this.color = 16777215;
    this.alpha = 1;
    this.texture = Texture.WHITE;
    this.matrix = null;
    this.visible = false;
    this.reset();
  }
  clone() {
    const obj = new FillStyle();
    obj.color = this.color;
    obj.alpha = this.alpha;
    obj.texture = this.texture;
    obj.matrix = this.matrix;
    obj.visible = this.visible;
    return obj;
  }
  reset() {
    this.color = 16777215;
    this.alpha = 1;
    this.texture = Texture.WHITE;
    this.matrix = null;
    this.visible = false;
  }
  destroy() {
    this.texture = null;
    this.matrix = null;
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/styles/LineStyle.mjs
var LineStyle = class extends FillStyle {
  constructor() {
    super(...arguments);
    this.width = 0;
    this.alignment = 0.5;
    this.native = false;
    this.cap = LINE_CAP.BUTT;
    this.join = LINE_JOIN.MITER;
    this.miterLimit = 10;
  }
  clone() {
    const obj = new LineStyle();
    obj.color = this.color;
    obj.alpha = this.alpha;
    obj.texture = this.texture;
    obj.matrix = this.matrix;
    obj.visible = this.visible;
    obj.width = this.width;
    obj.alignment = this.alignment;
    obj.native = this.native;
    obj.cap = this.cap;
    obj.join = this.join;
    obj.miterLimit = this.miterLimit;
    return obj;
  }
  reset() {
    super.reset();
    this.color = 0;
    this.alignment = 0.5;
    this.width = 0;
    this.native = false;
  }
};

// ../../node_modules/.pnpm/@pixi+graphics@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/graphics/lib/Graphics.mjs
var DEFAULT_SHADERS = {};
var _Graphics = class extends Container {
  constructor(geometry = null) {
    super();
    this.shader = null;
    this.pluginName = "batch";
    this.currentPath = null;
    this.batches = [];
    this.batchTint = -1;
    this.batchDirty = -1;
    this.vertexData = null;
    this._fillStyle = new FillStyle();
    this._lineStyle = new LineStyle();
    this._matrix = null;
    this._holeMode = false;
    this.state = State.for2d();
    this._geometry = geometry || new GraphicsGeometry();
    this._geometry.refCount++;
    this._transformID = -1;
    this._tintColor = new Color(16777215);
    this.blendMode = BLEND_MODES.NORMAL;
  }
  get geometry() {
    return this._geometry;
  }
  clone() {
    this.finishPoly();
    return new _Graphics(this._geometry);
  }
  set blendMode(value) {
    this.state.blendMode = value;
  }
  get blendMode() {
    return this.state.blendMode;
  }
  get tint() {
    return this._tintColor.value;
  }
  set tint(value) {
    this._tintColor.setValue(value);
  }
  get fill() {
    return this._fillStyle;
  }
  get line() {
    return this._lineStyle;
  }
  lineStyle(options = null, color = 0, alpha, alignment = 0.5, native = false) {
    if (typeof options === "number") {
      options = { width: options, color, alpha, alignment, native };
    }
    return this.lineTextureStyle(options);
  }
  lineTextureStyle(options) {
    const defaultLineStyleOptions = {
      width: 0,
      texture: Texture.WHITE,
      color: options?.texture ? 16777215 : 0,
      matrix: null,
      alignment: 0.5,
      native: false,
      cap: LINE_CAP.BUTT,
      join: LINE_JOIN.MITER,
      miterLimit: 10
    };
    options = Object.assign(defaultLineStyleOptions, options);
    this.normalizeColor(options);
    if (this.currentPath) {
      this.startPoly();
    }
    const visible = options.width > 0 && options.alpha > 0;
    if (!visible) {
      this._lineStyle.reset();
    } else {
      if (options.matrix) {
        options.matrix = options.matrix.clone();
        options.matrix.invert();
      }
      Object.assign(this._lineStyle, { visible }, options);
    }
    return this;
  }
  startPoly() {
    if (this.currentPath) {
      const points = this.currentPath.points;
      const len = this.currentPath.points.length;
      if (len > 2) {
        this.drawShape(this.currentPath);
        this.currentPath = new Polygon();
        this.currentPath.closeStroke = false;
        this.currentPath.points.push(points[len - 2], points[len - 1]);
      }
    } else {
      this.currentPath = new Polygon();
      this.currentPath.closeStroke = false;
    }
  }
  finishPoly() {
    if (this.currentPath) {
      if (this.currentPath.points.length > 2) {
        this.drawShape(this.currentPath);
        this.currentPath = null;
      } else {
        this.currentPath.points.length = 0;
      }
    }
  }
  moveTo(x2, y2) {
    this.startPoly();
    this.currentPath.points[0] = x2;
    this.currentPath.points[1] = y2;
    return this;
  }
  lineTo(x2, y2) {
    if (!this.currentPath) {
      this.moveTo(0, 0);
    }
    const points = this.currentPath.points;
    const fromX = points[points.length - 2];
    const fromY = points[points.length - 1];
    if (fromX !== x2 || fromY !== y2) {
      points.push(x2, y2);
    }
    return this;
  }
  _initCurve(x2 = 0, y2 = 0) {
    if (this.currentPath) {
      if (this.currentPath.points.length === 0) {
        this.currentPath.points = [x2, y2];
      }
    } else {
      this.moveTo(x2, y2);
    }
  }
  quadraticCurveTo(cpX, cpY, toX, toY) {
    this._initCurve();
    const points = this.currentPath.points;
    if (points.length === 0) {
      this.moveTo(0, 0);
    }
    QuadraticUtils.curveTo(cpX, cpY, toX, toY, points);
    return this;
  }
  bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
    this._initCurve();
    BezierUtils.curveTo(cpX, cpY, cpX2, cpY2, toX, toY, this.currentPath.points);
    return this;
  }
  arcTo(x1, y1, x2, y2, radius) {
    this._initCurve(x1, y1);
    const points = this.currentPath.points;
    const result = ArcUtils.curveTo(x1, y1, x2, y2, radius, points);
    if (result) {
      const { cx, cy, radius: radius2, startAngle, endAngle, anticlockwise } = result;
      this.arc(cx, cy, radius2, startAngle, endAngle, anticlockwise);
    }
    return this;
  }
  arc(cx, cy, radius, startAngle, endAngle, anticlockwise = false) {
    if (startAngle === endAngle) {
      return this;
    }
    if (!anticlockwise && endAngle <= startAngle) {
      endAngle += PI_2;
    } else if (anticlockwise && startAngle <= endAngle) {
      startAngle += PI_2;
    }
    const sweep = endAngle - startAngle;
    if (sweep === 0) {
      return this;
    }
    const startX = cx + Math.cos(startAngle) * radius;
    const startY = cy + Math.sin(startAngle) * radius;
    const eps = this._geometry.closePointEps;
    let points = this.currentPath ? this.currentPath.points : null;
    if (points) {
      const xDiff = Math.abs(points[points.length - 2] - startX);
      const yDiff = Math.abs(points[points.length - 1] - startY);
      if (xDiff < eps && yDiff < eps) {
      } else {
        points.push(startX, startY);
      }
    } else {
      this.moveTo(startX, startY);
      points = this.currentPath.points;
    }
    ArcUtils.arc(startX, startY, cx, cy, radius, startAngle, endAngle, anticlockwise, points);
    return this;
  }
  beginFill(color = 0, alpha) {
    return this.beginTextureFill({ texture: Texture.WHITE, color, alpha });
  }
  normalizeColor(options) {
    const temp = Color.shared.setValue(options.color ?? 0);
    options.color = temp.toNumber();
    options.alpha ?? (options.alpha = temp.alpha);
  }
  beginTextureFill(options) {
    const defaultOptions = {
      texture: Texture.WHITE,
      color: 16777215,
      matrix: null
    };
    options = Object.assign(defaultOptions, options);
    this.normalizeColor(options);
    if (this.currentPath) {
      this.startPoly();
    }
    const visible = options.alpha > 0;
    if (!visible) {
      this._fillStyle.reset();
    } else {
      if (options.matrix) {
        options.matrix = options.matrix.clone();
        options.matrix.invert();
      }
      Object.assign(this._fillStyle, { visible }, options);
    }
    return this;
  }
  endFill() {
    this.finishPoly();
    this._fillStyle.reset();
    return this;
  }
  drawRect(x2, y2, width, height) {
    return this.drawShape(new Rectangle(x2, y2, width, height));
  }
  drawRoundedRect(x2, y2, width, height, radius) {
    return this.drawShape(new RoundedRectangle(x2, y2, width, height, radius));
  }
  drawCircle(x2, y2, radius) {
    return this.drawShape(new Circle(x2, y2, radius));
  }
  drawEllipse(x2, y2, width, height) {
    return this.drawShape(new Ellipse(x2, y2, width, height));
  }
  drawPolygon(...path2) {
    let points;
    let closeStroke = true;
    const poly = path2[0];
    if (poly.points) {
      closeStroke = poly.closeStroke;
      points = poly.points;
    } else if (Array.isArray(path2[0])) {
      points = path2[0];
    } else {
      points = path2;
    }
    const shape = new Polygon(points);
    shape.closeStroke = closeStroke;
    this.drawShape(shape);
    return this;
  }
  drawShape(shape) {
    if (!this._holeMode) {
      this._geometry.drawShape(shape, this._fillStyle.clone(), this._lineStyle.clone(), this._matrix);
    } else {
      this._geometry.drawHole(shape, this._matrix);
    }
    return this;
  }
  clear() {
    this._geometry.clear();
    this._lineStyle.reset();
    this._fillStyle.reset();
    this._boundsID++;
    this._matrix = null;
    this._holeMode = false;
    this.currentPath = null;
    return this;
  }
  isFastRect() {
    const data = this._geometry.graphicsData;
    return data.length === 1 && data[0].shape.type === SHAPES.RECT && !data[0].matrix && !data[0].holes.length && !(data[0].lineStyle.visible && data[0].lineStyle.width);
  }
  _render(renderer) {
    this.finishPoly();
    const geometry = this._geometry;
    geometry.updateBatches();
    if (geometry.batchable) {
      if (this.batchDirty !== geometry.batchDirty) {
        this._populateBatches();
      }
      this._renderBatched(renderer);
    } else {
      renderer.batch.flush();
      this._renderDirect(renderer);
    }
  }
  _populateBatches() {
    const geometry = this._geometry;
    const blendMode = this.blendMode;
    const len = geometry.batches.length;
    this.batchTint = -1;
    this._transformID = -1;
    this.batchDirty = geometry.batchDirty;
    this.batches.length = len;
    this.vertexData = new Float32Array(geometry.points);
    for (let i2 = 0; i2 < len; i2++) {
      const gI = geometry.batches[i2];
      const color = gI.style.color;
      const vertexData = new Float32Array(this.vertexData.buffer, gI.attribStart * 4 * 2, gI.attribSize * 2);
      const uvs = new Float32Array(geometry.uvsFloat32.buffer, gI.attribStart * 4 * 2, gI.attribSize * 2);
      const indices2 = new Uint16Array(geometry.indicesUint16.buffer, gI.start * 2, gI.size);
      const batch = {
        vertexData,
        blendMode,
        indices: indices2,
        uvs,
        _batchRGB: Color.shared.setValue(color).toRgbArray(),
        _tintRGB: color,
        _texture: gI.style.texture,
        alpha: gI.style.alpha,
        worldAlpha: 1
      };
      this.batches[i2] = batch;
    }
  }
  _renderBatched(renderer) {
    if (!this.batches.length) {
      return;
    }
    renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
    this.calculateVertices();
    this.calculateTints();
    for (let i2 = 0, l3 = this.batches.length; i2 < l3; i2++) {
      const batch = this.batches[i2];
      batch.worldAlpha = this.worldAlpha * batch.alpha;
      renderer.plugins[this.pluginName].render(batch);
    }
  }
  _renderDirect(renderer) {
    const shader = this._resolveDirectShader(renderer);
    const geometry = this._geometry;
    const worldAlpha = this.worldAlpha;
    const uniforms = shader.uniforms;
    const drawCalls = geometry.drawCalls;
    uniforms.translationMatrix = this.transform.worldTransform;
    Color.shared.setValue(this._tintColor).premultiply(worldAlpha).toArray(uniforms.tint);
    renderer.shader.bind(shader);
    renderer.geometry.bind(geometry, shader);
    renderer.state.set(this.state);
    for (let i2 = 0, l3 = drawCalls.length; i2 < l3; i2++) {
      this._renderDrawCallDirect(renderer, geometry.drawCalls[i2]);
    }
  }
  _renderDrawCallDirect(renderer, drawCall) {
    const { texArray, type, size, start } = drawCall;
    const groupTextureCount = texArray.count;
    for (let j3 = 0; j3 < groupTextureCount; j3++) {
      renderer.texture.bind(texArray.elements[j3], j3);
    }
    renderer.geometry.draw(type, size, start);
  }
  _resolveDirectShader(renderer) {
    let shader = this.shader;
    const pluginName = this.pluginName;
    if (!shader) {
      if (!DEFAULT_SHADERS[pluginName]) {
        const { maxTextures } = renderer.plugins[pluginName];
        const sampleValues = new Int32Array(maxTextures);
        for (let i2 = 0; i2 < maxTextures; i2++) {
          sampleValues[i2] = i2;
        }
        const uniforms = {
          tint: new Float32Array([1, 1, 1, 1]),
          translationMatrix: new Matrix(),
          default: UniformGroup.from({ uSamplers: sampleValues }, true)
        };
        const program = renderer.plugins[pluginName]._shader.program;
        DEFAULT_SHADERS[pluginName] = new Shader(program, uniforms);
      }
      shader = DEFAULT_SHADERS[pluginName];
    }
    return shader;
  }
  _calculateBounds() {
    this.finishPoly();
    const geometry = this._geometry;
    if (!geometry.graphicsData.length) {
      return;
    }
    const { minX, minY, maxX, maxY } = geometry.bounds;
    this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
  }
  containsPoint(point) {
    this.worldTransform.applyInverse(point, _Graphics._TEMP_POINT);
    return this._geometry.containsPoint(_Graphics._TEMP_POINT);
  }
  calculateTints() {
    if (this.batchTint !== this.tint) {
      this.batchTint = this._tintColor.toNumber();
      for (let i2 = 0; i2 < this.batches.length; i2++) {
        const batch = this.batches[i2];
        batch._tintRGB = Color.shared.setValue(this._tintColor).multiply(batch._batchRGB).toLittleEndianNumber();
      }
    }
  }
  calculateVertices() {
    const wtID = this.transform._worldID;
    if (this._transformID === wtID) {
      return;
    }
    this._transformID = wtID;
    const wt = this.transform.worldTransform;
    const a2 = wt.a;
    const b3 = wt.b;
    const c2 = wt.c;
    const d2 = wt.d;
    const tx = wt.tx;
    const ty = wt.ty;
    const data = this._geometry.points;
    const vertexData = this.vertexData;
    let count = 0;
    for (let i2 = 0; i2 < data.length; i2 += 2) {
      const x2 = data[i2];
      const y2 = data[i2 + 1];
      vertexData[count++] = a2 * x2 + c2 * y2 + tx;
      vertexData[count++] = d2 * y2 + b3 * x2 + ty;
    }
  }
  closePath() {
    const currentPath = this.currentPath;
    if (currentPath) {
      currentPath.closeStroke = true;
      this.finishPoly();
    }
    return this;
  }
  setMatrix(matrix) {
    this._matrix = matrix;
    return this;
  }
  beginHole() {
    this.finishPoly();
    this._holeMode = true;
    return this;
  }
  endHole() {
    this.finishPoly();
    this._holeMode = false;
    return this;
  }
  destroy(options) {
    this._geometry.refCount--;
    if (this._geometry.refCount === 0) {
      this._geometry.dispose();
    }
    this._matrix = null;
    this.currentPath = null;
    this._lineStyle.destroy();
    this._lineStyle = null;
    this._fillStyle.destroy();
    this._fillStyle = null;
    this._geometry = null;
    this.shader = null;
    this.vertexData = null;
    this.batches.length = 0;
    this.batches = null;
    super.destroy(options);
  }
};
var Graphics = _Graphics;
Graphics.curves = curves;
Graphics._TEMP_POINT = new Point();

// ../../node_modules/.pnpm/@pixi+mesh@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/mesh/lib/MeshBatchUvs.mjs
var MeshBatchUvs = class {
  constructor(uvBuffer, uvMatrix) {
    this.uvBuffer = uvBuffer;
    this.uvMatrix = uvMatrix;
    this.data = null;
    this._bufferUpdateId = -1;
    this._textureUpdateId = -1;
    this._updateID = 0;
  }
  update(forceUpdate) {
    if (!forceUpdate && this._bufferUpdateId === this.uvBuffer._updateID && this._textureUpdateId === this.uvMatrix._updateID) {
      return;
    }
    this._bufferUpdateId = this.uvBuffer._updateID;
    this._textureUpdateId = this.uvMatrix._updateID;
    const data = this.uvBuffer.data;
    if (!this.data || this.data.length !== data.length) {
      this.data = new Float32Array(data.length);
    }
    this.uvMatrix.multiplyUvs(data, this.data);
    this._updateID++;
  }
};

// ../../node_modules/.pnpm/@pixi+mesh@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/mesh/lib/Mesh.mjs
var tempPoint2 = new Point();
var tempPolygon = new Polygon();
var _Mesh = class extends Container {
  constructor(geometry, shader, state, drawMode = DRAW_MODES.TRIANGLES) {
    super();
    this.geometry = geometry;
    this.shader = shader;
    this.state = state || State.for2d();
    this.drawMode = drawMode;
    this.start = 0;
    this.size = 0;
    this.uvs = null;
    this.indices = null;
    this.vertexData = new Float32Array(1);
    this.vertexDirty = -1;
    this._transformID = -1;
    this._roundPixels = settings.ROUND_PIXELS;
    this.batchUvs = null;
  }
  get geometry() {
    return this._geometry;
  }
  set geometry(value) {
    if (this._geometry === value) {
      return;
    }
    if (this._geometry) {
      this._geometry.refCount--;
      if (this._geometry.refCount === 0) {
        this._geometry.dispose();
      }
    }
    this._geometry = value;
    if (this._geometry) {
      this._geometry.refCount++;
    }
    this.vertexDirty = -1;
  }
  get uvBuffer() {
    return this.geometry.buffers[1];
  }
  get verticesBuffer() {
    return this.geometry.buffers[0];
  }
  set material(value) {
    this.shader = value;
  }
  get material() {
    return this.shader;
  }
  set blendMode(value) {
    this.state.blendMode = value;
  }
  get blendMode() {
    return this.state.blendMode;
  }
  set roundPixels(value) {
    if (this._roundPixels !== value) {
      this._transformID = -1;
    }
    this._roundPixels = value;
  }
  get roundPixels() {
    return this._roundPixels;
  }
  get tint() {
    return "tint" in this.shader ? this.shader.tint : null;
  }
  set tint(value) {
    this.shader.tint = value;
  }
  get tintValue() {
    return this.shader.tintValue;
  }
  get texture() {
    return "texture" in this.shader ? this.shader.texture : null;
  }
  set texture(value) {
    this.shader.texture = value;
  }
  _render(renderer) {
    const vertices = this.geometry.buffers[0].data;
    const shader = this.shader;
    if (shader.batchable && this.drawMode === DRAW_MODES.TRIANGLES && vertices.length < _Mesh.BATCHABLE_SIZE * 2) {
      this._renderToBatch(renderer);
    } else {
      this._renderDefault(renderer);
    }
  }
  _renderDefault(renderer) {
    const shader = this.shader;
    shader.alpha = this.worldAlpha;
    if (shader.update) {
      shader.update();
    }
    renderer.batch.flush();
    shader.uniforms.translationMatrix = this.transform.worldTransform.toArray(true);
    renderer.shader.bind(shader);
    renderer.state.set(this.state);
    renderer.geometry.bind(this.geometry, shader);
    renderer.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
  }
  _renderToBatch(renderer) {
    const geometry = this.geometry;
    const shader = this.shader;
    if (shader.uvMatrix) {
      shader.uvMatrix.update();
      this.calculateUvs();
    }
    this.calculateVertices();
    this.indices = geometry.indexBuffer.data;
    this._tintRGB = shader._tintRGB;
    this._texture = shader.texture;
    const pluginName = this.material.pluginName;
    renderer.batch.setObjectRenderer(renderer.plugins[pluginName]);
    renderer.plugins[pluginName].render(this);
  }
  calculateVertices() {
    const geometry = this.geometry;
    const verticesBuffer = geometry.buffers[0];
    const vertices = verticesBuffer.data;
    const vertexDirtyId = verticesBuffer._updateID;
    if (vertexDirtyId === this.vertexDirty && this._transformID === this.transform._worldID) {
      return;
    }
    this._transformID = this.transform._worldID;
    if (this.vertexData.length !== vertices.length) {
      this.vertexData = new Float32Array(vertices.length);
    }
    const wt = this.transform.worldTransform;
    const a2 = wt.a;
    const b3 = wt.b;
    const c2 = wt.c;
    const d2 = wt.d;
    const tx = wt.tx;
    const ty = wt.ty;
    const vertexData = this.vertexData;
    for (let i2 = 0; i2 < vertexData.length / 2; i2++) {
      const x2 = vertices[i2 * 2];
      const y2 = vertices[i2 * 2 + 1];
      vertexData[i2 * 2] = a2 * x2 + c2 * y2 + tx;
      vertexData[i2 * 2 + 1] = b3 * x2 + d2 * y2 + ty;
    }
    if (this._roundPixels) {
      const resolution = settings.RESOLUTION;
      for (let i2 = 0; i2 < vertexData.length; ++i2) {
        vertexData[i2] = Math.round(vertexData[i2] * resolution) / resolution;
      }
    }
    this.vertexDirty = vertexDirtyId;
  }
  calculateUvs() {
    const geomUvs = this.geometry.buffers[1];
    const shader = this.shader;
    if (!shader.uvMatrix.isSimple) {
      if (!this.batchUvs) {
        this.batchUvs = new MeshBatchUvs(geomUvs, shader.uvMatrix);
      }
      this.batchUvs.update();
      this.uvs = this.batchUvs.data;
    } else {
      this.uvs = geomUvs.data;
    }
  }
  _calculateBounds() {
    this.calculateVertices();
    this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
  }
  containsPoint(point) {
    if (!this.getBounds().contains(point.x, point.y)) {
      return false;
    }
    this.worldTransform.applyInverse(point, tempPoint2);
    const vertices = this.geometry.getBuffer("aVertexPosition").data;
    const points = tempPolygon.points;
    const indices2 = this.geometry.getIndex().data;
    const len = indices2.length;
    const step = this.drawMode === 4 ? 3 : 1;
    for (let i2 = 0; i2 + 2 < len; i2 += step) {
      const ind0 = indices2[i2] * 2;
      const ind1 = indices2[i2 + 1] * 2;
      const ind2 = indices2[i2 + 2] * 2;
      points[0] = vertices[ind0];
      points[1] = vertices[ind0 + 1];
      points[2] = vertices[ind1];
      points[3] = vertices[ind1 + 1];
      points[4] = vertices[ind2];
      points[5] = vertices[ind2 + 1];
      if (tempPolygon.contains(tempPoint2.x, tempPoint2.y)) {
        return true;
      }
    }
    return false;
  }
  destroy(options) {
    super.destroy(options);
    if (this._cachedTexture) {
      this._cachedTexture.destroy();
      this._cachedTexture = null;
    }
    this.geometry = null;
    this.shader = null;
    this.state = null;
    this.uvs = null;
    this.indices = null;
    this.vertexData = null;
  }
};
var Mesh = _Mesh;
Mesh.BATCHABLE_SIZE = 100;

// ../../node_modules/.pnpm/@pixi+mesh@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/mesh/lib/MeshGeometry.mjs
var MeshGeometry = class extends Geometry {
  constructor(vertices, uvs, index) {
    super();
    const verticesBuffer = new Buffer2(vertices);
    const uvsBuffer = new Buffer2(uvs, true);
    const indexBuffer = new Buffer2(index, true, true);
    this.addAttribute("aVertexPosition", verticesBuffer, 2, false, TYPES.FLOAT).addAttribute("aTextureCoord", uvsBuffer, 2, false, TYPES.FLOAT).addIndex(indexBuffer);
    this._updateId = -1;
  }
  get vertexDirtyId() {
    return this.buffers[0]._updateID;
  }
};

// ../../node_modules/.pnpm/@pixi+mesh@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/mesh/lib/shader/mesh.mjs
var fragment7 = "varying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}\n";

// ../../node_modules/.pnpm/@pixi+mesh@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/mesh/lib/shader/mesh2.mjs
var vertex4 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTextureMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\n}\n";

// ../../node_modules/.pnpm/@pixi+mesh@7.2.4_itsaoqwq56fcz2brnb773dvv24/node_modules/@pixi/mesh/lib/MeshMaterial.mjs
var MeshMaterial = class extends Shader {
  constructor(uSampler, options) {
    const uniforms = {
      uSampler,
      alpha: 1,
      uTextureMatrix: Matrix.IDENTITY,
      uColor: new Float32Array([1, 1, 1, 1])
    };
    options = Object.assign({
      tint: 16777215,
      alpha: 1,
      pluginName: "batch"
    }, options);
    if (options.uniforms) {
      Object.assign(uniforms, options.uniforms);
    }
    super(options.program || Program.from(vertex4, fragment7), uniforms);
    this._colorDirty = false;
    this.uvMatrix = new TextureMatrix(uSampler);
    this.batchable = options.program === void 0;
    this.pluginName = options.pluginName;
    this._tintColor = new Color(options.tint);
    this._tintRGB = this._tintColor.toLittleEndianNumber();
    this._colorDirty = true;
    this.alpha = options.alpha;
  }
  get texture() {
    return this.uniforms.uSampler;
  }
  set texture(value) {
    if (this.uniforms.uSampler !== value) {
      if (!this.uniforms.uSampler.baseTexture.alphaMode !== !value.baseTexture.alphaMode) {
        this._colorDirty = true;
      }
      this.uniforms.uSampler = value;
      this.uvMatrix.texture = value;
    }
  }
  set alpha(value) {
    if (value === this._alpha)
      return;
    this._alpha = value;
    this._colorDirty = true;
  }
  get alpha() {
    return this._alpha;
  }
  set tint(value) {
    if (value === this.tint)
      return;
    this._tintColor.setValue(value);
    this._tintRGB = this._tintColor.toLittleEndianNumber();
    this._colorDirty = true;
  }
  get tint() {
    return this._tintColor.value;
  }
  get tintValue() {
    return this._tintColor.toNumber();
  }
  update() {
    if (this._colorDirty) {
      this._colorDirty = false;
      const baseTexture = this.texture.baseTexture;
      const applyToChannels = baseTexture.alphaMode;
      Color.shared.setValue(this._tintColor).premultiply(this._alpha, applyToChannels).toArray(this.uniforms.uColor);
    }
    if (this.uvMatrix.update()) {
      this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord;
    }
  }
};

// ../../node_modules/.pnpm/@pixi+mesh-extras@7.2.4_n7n5oqwl6kgh5ivuymthtudfje/node_modules/@pixi/mesh-extras/lib/geometry/PlaneGeometry.mjs
var PlaneGeometry = class extends MeshGeometry {
  constructor(width = 100, height = 100, segWidth = 10, segHeight = 10) {
    super();
    this.segWidth = segWidth;
    this.segHeight = segHeight;
    this.width = width;
    this.height = height;
    this.build();
  }
  build() {
    const total = this.segWidth * this.segHeight;
    const verts = [];
    const uvs = [];
    const indices2 = [];
    const segmentsX = this.segWidth - 1;
    const segmentsY = this.segHeight - 1;
    const sizeX = this.width / segmentsX;
    const sizeY = this.height / segmentsY;
    for (let i2 = 0; i2 < total; i2++) {
      const x2 = i2 % this.segWidth;
      const y2 = i2 / this.segWidth | 0;
      verts.push(x2 * sizeX, y2 * sizeY);
      uvs.push(x2 / segmentsX, y2 / segmentsY);
    }
    const totalSub = segmentsX * segmentsY;
    for (let i2 = 0; i2 < totalSub; i2++) {
      const xpos = i2 % segmentsX;
      const ypos = i2 / segmentsX | 0;
      const value = ypos * this.segWidth + xpos;
      const value2 = ypos * this.segWidth + xpos + 1;
      const value3 = (ypos + 1) * this.segWidth + xpos;
      const value4 = (ypos + 1) * this.segWidth + xpos + 1;
      indices2.push(value, value2, value3, value2, value4, value3);
    }
    this.buffers[0].data = new Float32Array(verts);
    this.buffers[1].data = new Float32Array(uvs);
    this.indexBuffer.data = new Uint16Array(indices2);
    this.buffers[0].update();
    this.buffers[1].update();
    this.indexBuffer.update();
  }
};

// ../../node_modules/.pnpm/@pixi+mesh-extras@7.2.4_n7n5oqwl6kgh5ivuymthtudfje/node_modules/@pixi/mesh-extras/lib/SimplePlane.mjs
var SimplePlane = class extends Mesh {
  constructor(texture, verticesX, verticesY) {
    const planeGeometry = new PlaneGeometry(texture.width, texture.height, verticesX, verticesY);
    const meshMaterial = new MeshMaterial(Texture.WHITE);
    super(planeGeometry, meshMaterial);
    this.texture = texture;
    this.autoResize = true;
  }
  textureUpdated() {
    this._textureID = this.shader.texture._updateID;
    const geometry = this.geometry;
    const { width, height } = this.shader.texture;
    if (this.autoResize && (geometry.width !== width || geometry.height !== height)) {
      geometry.width = this.shader.texture.width;
      geometry.height = this.shader.texture.height;
      geometry.build();
    }
  }
  set texture(value) {
    if (this.shader.texture === value) {
      return;
    }
    this.shader.texture = value;
    this._textureID = -1;
    if (value.baseTexture.valid) {
      this.textureUpdated();
    } else {
      value.once("update", this.textureUpdated, this);
    }
  }
  get texture() {
    return this.shader.texture;
  }
  _render(renderer) {
    if (this._textureID !== this.shader.texture._updateID) {
      this.textureUpdated();
    }
    super._render(renderer);
  }
  destroy(options) {
    this.shader.texture.off("update", this.textureUpdated, this);
    super.destroy(options);
  }
};

// ../../node_modules/.pnpm/@pixi+mesh-extras@7.2.4_n7n5oqwl6kgh5ivuymthtudfje/node_modules/@pixi/mesh-extras/lib/NineSlicePlane.mjs
var DEFAULT_BORDER_SIZE = 10;
var NineSlicePlane = class extends SimplePlane {
  constructor(texture, leftWidth, topHeight, rightWidth, bottomHeight) {
    super(Texture.WHITE, 4, 4);
    this._origWidth = texture.orig.width;
    this._origHeight = texture.orig.height;
    this._width = this._origWidth;
    this._height = this._origHeight;
    this._leftWidth = leftWidth ?? texture.defaultBorders?.left ?? DEFAULT_BORDER_SIZE;
    this._rightWidth = rightWidth ?? texture.defaultBorders?.right ?? DEFAULT_BORDER_SIZE;
    this._topHeight = topHeight ?? texture.defaultBorders?.top ?? DEFAULT_BORDER_SIZE;
    this._bottomHeight = bottomHeight ?? texture.defaultBorders?.bottom ?? DEFAULT_BORDER_SIZE;
    this.texture = texture;
  }
  textureUpdated() {
    this._textureID = this.shader.texture._updateID;
    this._refresh();
  }
  get vertices() {
    return this.geometry.getBuffer("aVertexPosition").data;
  }
  set vertices(value) {
    this.geometry.getBuffer("aVertexPosition").data = value;
  }
  updateHorizontalVertices() {
    const vertices = this.vertices;
    const scale = this._getMinScale();
    vertices[9] = vertices[11] = vertices[13] = vertices[15] = this._topHeight * scale;
    vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - this._bottomHeight * scale;
    vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
  }
  updateVerticalVertices() {
    const vertices = this.vertices;
    const scale = this._getMinScale();
    vertices[2] = vertices[10] = vertices[18] = vertices[26] = this._leftWidth * scale;
    vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - this._rightWidth * scale;
    vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
  }
  _getMinScale() {
    const w3 = this._leftWidth + this._rightWidth;
    const scaleW = this._width > w3 ? 1 : this._width / w3;
    const h2 = this._topHeight + this._bottomHeight;
    const scaleH = this._height > h2 ? 1 : this._height / h2;
    const scale = Math.min(scaleW, scaleH);
    return scale;
  }
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
    this._refresh();
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
    this._refresh();
  }
  get leftWidth() {
    return this._leftWidth;
  }
  set leftWidth(value) {
    this._leftWidth = value;
    this._refresh();
  }
  get rightWidth() {
    return this._rightWidth;
  }
  set rightWidth(value) {
    this._rightWidth = value;
    this._refresh();
  }
  get topHeight() {
    return this._topHeight;
  }
  set topHeight(value) {
    this._topHeight = value;
    this._refresh();
  }
  get bottomHeight() {
    return this._bottomHeight;
  }
  set bottomHeight(value) {
    this._bottomHeight = value;
    this._refresh();
  }
  _refresh() {
    const texture = this.texture;
    const uvs = this.geometry.buffers[1].data;
    this._origWidth = texture.orig.width;
    this._origHeight = texture.orig.height;
    const _uvw = 1 / this._origWidth;
    const _uvh = 1 / this._origHeight;
    uvs[0] = uvs[8] = uvs[16] = uvs[24] = 0;
    uvs[1] = uvs[3] = uvs[5] = uvs[7] = 0;
    uvs[6] = uvs[14] = uvs[22] = uvs[30] = 1;
    uvs[25] = uvs[27] = uvs[29] = uvs[31] = 1;
    uvs[2] = uvs[10] = uvs[18] = uvs[26] = _uvw * this._leftWidth;
    uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - _uvw * this._rightWidth;
    uvs[9] = uvs[11] = uvs[13] = uvs[15] = _uvh * this._topHeight;
    uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - _uvh * this._bottomHeight;
    this.updateHorizontalVertices();
    this.updateVerticalVertices();
    this.geometry.buffers[0].update();
    this.geometry.buffers[1].update();
  }
};

// ../../node_modules/.pnpm/@pixi+particle-container@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/particle-container/lib/ParticleBuffer.mjs
var ParticleBuffer = class {
  constructor(properties, dynamicPropertyFlags, size) {
    this.geometry = new Geometry();
    this.indexBuffer = null;
    this.size = size;
    this.dynamicProperties = [];
    this.staticProperties = [];
    for (let i2 = 0; i2 < properties.length; ++i2) {
      let property = properties[i2];
      property = {
        attributeName: property.attributeName,
        size: property.size,
        uploadFunction: property.uploadFunction,
        type: property.type || TYPES.FLOAT,
        offset: property.offset
      };
      if (dynamicPropertyFlags[i2]) {
        this.dynamicProperties.push(property);
      } else {
        this.staticProperties.push(property);
      }
    }
    this.staticStride = 0;
    this.staticBuffer = null;
    this.staticData = null;
    this.staticDataUint32 = null;
    this.dynamicStride = 0;
    this.dynamicBuffer = null;
    this.dynamicData = null;
    this.dynamicDataUint32 = null;
    this._updateID = 0;
    this.initBuffers();
  }
  initBuffers() {
    const geometry = this.geometry;
    let dynamicOffset = 0;
    this.indexBuffer = new Buffer2(lib_exports.createIndicesForQuads(this.size), true, true);
    geometry.addIndex(this.indexBuffer);
    this.dynamicStride = 0;
    for (let i2 = 0; i2 < this.dynamicProperties.length; ++i2) {
      const property = this.dynamicProperties[i2];
      property.offset = dynamicOffset;
      dynamicOffset += property.size;
      this.dynamicStride += property.size;
    }
    const dynBuffer = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
    this.dynamicData = new Float32Array(dynBuffer);
    this.dynamicDataUint32 = new Uint32Array(dynBuffer);
    this.dynamicBuffer = new Buffer2(this.dynamicData, false, false);
    let staticOffset = 0;
    this.staticStride = 0;
    for (let i2 = 0; i2 < this.staticProperties.length; ++i2) {
      const property = this.staticProperties[i2];
      property.offset = staticOffset;
      staticOffset += property.size;
      this.staticStride += property.size;
    }
    const statBuffer = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
    this.staticData = new Float32Array(statBuffer);
    this.staticDataUint32 = new Uint32Array(statBuffer);
    this.staticBuffer = new Buffer2(this.staticData, true, false);
    for (let i2 = 0; i2 < this.dynamicProperties.length; ++i2) {
      const property = this.dynamicProperties[i2];
      geometry.addAttribute(property.attributeName, this.dynamicBuffer, 0, property.type === TYPES.UNSIGNED_BYTE, property.type, this.dynamicStride * 4, property.offset * 4);
    }
    for (let i2 = 0; i2 < this.staticProperties.length; ++i2) {
      const property = this.staticProperties[i2];
      geometry.addAttribute(property.attributeName, this.staticBuffer, 0, property.type === TYPES.UNSIGNED_BYTE, property.type, this.staticStride * 4, property.offset * 4);
    }
  }
  uploadDynamic(children, startIndex, amount) {
    for (let i2 = 0; i2 < this.dynamicProperties.length; i2++) {
      const property = this.dynamicProperties[i2];
      property.uploadFunction(children, startIndex, amount, property.type === TYPES.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, property.offset);
    }
    this.dynamicBuffer._updateID++;
  }
  uploadStatic(children, startIndex, amount) {
    for (let i2 = 0; i2 < this.staticProperties.length; i2++) {
      const property = this.staticProperties[i2];
      property.uploadFunction(children, startIndex, amount, property.type === TYPES.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, property.offset);
    }
    this.staticBuffer._updateID++;
  }
  destroy() {
    this.indexBuffer = null;
    this.dynamicProperties = null;
    this.dynamicBuffer = null;
    this.dynamicData = null;
    this.dynamicDataUint32 = null;
    this.staticProperties = null;
    this.staticBuffer = null;
    this.staticData = null;
    this.staticDataUint32 = null;
    this.geometry.destroy();
  }
};

// ../../node_modules/.pnpm/@pixi+particle-container@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/particle-container/lib/particles.mjs
var fragment8 = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;\n    gl_FragColor = color;\n}";

// ../../node_modules/.pnpm/@pixi+particle-container@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/particle-container/lib/particles2.mjs
var vertex5 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nattribute vec2 aPositionCoord;\nattribute float aRotation;\n\nuniform mat3 translationMatrix;\nuniform vec4 uColor;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void){\n    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);\n    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);\n\n    vec2 v = vec2(x, y);\n    v = v + aPositionCoord;\n\n    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vColor = aColor * uColor;\n}\n";

// ../../node_modules/.pnpm/@pixi+particle-container@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/particle-container/lib/ParticleRenderer.mjs
var ParticleRenderer = class extends ObjectRenderer {
  constructor(renderer) {
    super(renderer);
    this.shader = null;
    this.properties = null;
    this.tempMatrix = new Matrix();
    this.properties = [
      {
        attributeName: "aVertexPosition",
        size: 2,
        uploadFunction: this.uploadVertices,
        offset: 0
      },
      {
        attributeName: "aPositionCoord",
        size: 2,
        uploadFunction: this.uploadPosition,
        offset: 0
      },
      {
        attributeName: "aRotation",
        size: 1,
        uploadFunction: this.uploadRotation,
        offset: 0
      },
      {
        attributeName: "aTextureCoord",
        size: 2,
        uploadFunction: this.uploadUvs,
        offset: 0
      },
      {
        attributeName: "aColor",
        size: 1,
        type: TYPES.UNSIGNED_BYTE,
        uploadFunction: this.uploadTint,
        offset: 0
      }
    ];
    this.shader = Shader.from(vertex5, fragment8, {});
    this.state = State.for2d();
  }
  render(container) {
    const children = container.children;
    const maxSize = container._maxSize;
    const batchSize = container._batchSize;
    const renderer = this.renderer;
    let totalChildren = children.length;
    if (totalChildren === 0) {
      return;
    } else if (totalChildren > maxSize && !container.autoResize) {
      totalChildren = maxSize;
    }
    let buffers = container._buffers;
    if (!buffers) {
      buffers = container._buffers = this.generateBuffers(container);
    }
    const baseTexture = children[0]._texture.baseTexture;
    const premultiplied = baseTexture.alphaMode > 0;
    this.state.blendMode = lib_exports.correctBlendMode(container.blendMode, premultiplied);
    renderer.state.set(this.state);
    const gl = renderer.gl;
    const m2 = container.worldTransform.copyTo(this.tempMatrix);
    m2.prepend(renderer.globalUniforms.uniforms.projectionMatrix);
    this.shader.uniforms.translationMatrix = m2.toArray(true);
    this.shader.uniforms.uColor = Color.shared.setValue(container.tintRgb).premultiply(container.worldAlpha, premultiplied).toArray(this.shader.uniforms.uColor);
    this.shader.uniforms.uSampler = baseTexture;
    this.renderer.shader.bind(this.shader);
    let updateStatic = false;
    for (let i2 = 0, j3 = 0; i2 < totalChildren; i2 += batchSize, j3 += 1) {
      let amount = totalChildren - i2;
      if (amount > batchSize) {
        amount = batchSize;
      }
      if (j3 >= buffers.length) {
        buffers.push(this._generateOneMoreBuffer(container));
      }
      const buffer = buffers[j3];
      buffer.uploadDynamic(children, i2, amount);
      const bid = container._bufferUpdateIDs[j3] || 0;
      updateStatic = updateStatic || buffer._updateID < bid;
      if (updateStatic) {
        buffer._updateID = container._updateID;
        buffer.uploadStatic(children, i2, amount);
      }
      renderer.geometry.bind(buffer.geometry);
      gl.drawElements(gl.TRIANGLES, amount * 6, gl.UNSIGNED_SHORT, 0);
    }
  }
  generateBuffers(container) {
    const buffers = [];
    const size = container._maxSize;
    const batchSize = container._batchSize;
    const dynamicPropertyFlags = container._properties;
    for (let i2 = 0; i2 < size; i2 += batchSize) {
      buffers.push(new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize));
    }
    return buffers;
  }
  _generateOneMoreBuffer(container) {
    const batchSize = container._batchSize;
    const dynamicPropertyFlags = container._properties;
    return new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize);
  }
  uploadVertices(children, startIndex, amount, array, stride, offset) {
    let w0 = 0;
    let w1 = 0;
    let h0 = 0;
    let h1 = 0;
    for (let i2 = 0; i2 < amount; ++i2) {
      const sprite = children[startIndex + i2];
      const texture = sprite._texture;
      const sx = sprite.scale.x;
      const sy = sprite.scale.y;
      const trim = texture.trim;
      const orig = texture.orig;
      if (trim) {
        w1 = trim.x - sprite.anchor.x * orig.width;
        w0 = w1 + trim.width;
        h1 = trim.y - sprite.anchor.y * orig.height;
        h0 = h1 + trim.height;
      } else {
        w0 = orig.width * (1 - sprite.anchor.x);
        w1 = orig.width * -sprite.anchor.x;
        h0 = orig.height * (1 - sprite.anchor.y);
        h1 = orig.height * -sprite.anchor.y;
      }
      array[offset] = w1 * sx;
      array[offset + 1] = h1 * sy;
      array[offset + stride] = w0 * sx;
      array[offset + stride + 1] = h1 * sy;
      array[offset + stride * 2] = w0 * sx;
      array[offset + stride * 2 + 1] = h0 * sy;
      array[offset + stride * 3] = w1 * sx;
      array[offset + stride * 3 + 1] = h0 * sy;
      offset += stride * 4;
    }
  }
  uploadPosition(children, startIndex, amount, array, stride, offset) {
    for (let i2 = 0; i2 < amount; i2++) {
      const spritePosition = children[startIndex + i2].position;
      array[offset] = spritePosition.x;
      array[offset + 1] = spritePosition.y;
      array[offset + stride] = spritePosition.x;
      array[offset + stride + 1] = spritePosition.y;
      array[offset + stride * 2] = spritePosition.x;
      array[offset + stride * 2 + 1] = spritePosition.y;
      array[offset + stride * 3] = spritePosition.x;
      array[offset + stride * 3 + 1] = spritePosition.y;
      offset += stride * 4;
    }
  }
  uploadRotation(children, startIndex, amount, array, stride, offset) {
    for (let i2 = 0; i2 < amount; i2++) {
      const spriteRotation = children[startIndex + i2].rotation;
      array[offset] = spriteRotation;
      array[offset + stride] = spriteRotation;
      array[offset + stride * 2] = spriteRotation;
      array[offset + stride * 3] = spriteRotation;
      offset += stride * 4;
    }
  }
  uploadUvs(children, startIndex, amount, array, stride, offset) {
    for (let i2 = 0; i2 < amount; ++i2) {
      const textureUvs = children[startIndex + i2]._texture._uvs;
      if (textureUvs) {
        array[offset] = textureUvs.x0;
        array[offset + 1] = textureUvs.y0;
        array[offset + stride] = textureUvs.x1;
        array[offset + stride + 1] = textureUvs.y1;
        array[offset + stride * 2] = textureUvs.x2;
        array[offset + stride * 2 + 1] = textureUvs.y2;
        array[offset + stride * 3] = textureUvs.x3;
        array[offset + stride * 3 + 1] = textureUvs.y3;
        offset += stride * 4;
      } else {
        array[offset] = 0;
        array[offset + 1] = 0;
        array[offset + stride] = 0;
        array[offset + stride + 1] = 0;
        array[offset + stride * 2] = 0;
        array[offset + stride * 2 + 1] = 0;
        array[offset + stride * 3] = 0;
        array[offset + stride * 3 + 1] = 0;
        offset += stride * 4;
      }
    }
  }
  uploadTint(children, startIndex, amount, array, stride, offset) {
    for (let i2 = 0; i2 < amount; ++i2) {
      const sprite = children[startIndex + i2];
      const result = Color.shared.setValue(sprite._tintRGB).toPremultiplied(sprite.alpha, sprite.texture.baseTexture.alphaMode > 0);
      array[offset] = result;
      array[offset + stride] = result;
      array[offset + stride * 2] = result;
      array[offset + stride * 3] = result;
      offset += stride * 4;
    }
  }
  destroy() {
    super.destroy();
    if (this.shader) {
      this.shader.destroy();
      this.shader = null;
    }
    this.tempMatrix = null;
  }
};
ParticleRenderer.extension = {
  name: "particle",
  type: ExtensionType.RendererPlugin
};
extensions.add(ParticleRenderer);

// ../../node_modules/.pnpm/@pixi+text@7.2.4_g5gcporgeyvj6eoj7ipdn3ry3a/node_modules/@pixi/text/lib/const.mjs
var TEXT_GRADIENT = /* @__PURE__ */ ((TEXT_GRADIENT2) => {
  TEXT_GRADIENT2[TEXT_GRADIENT2["LINEAR_VERTICAL"] = 0] = "LINEAR_VERTICAL";
  TEXT_GRADIENT2[TEXT_GRADIENT2["LINEAR_HORIZONTAL"] = 1] = "LINEAR_HORIZONTAL";
  return TEXT_GRADIENT2;
})(TEXT_GRADIENT || {});

// ../../node_modules/.pnpm/@pixi+text@7.2.4_g5gcporgeyvj6eoj7ipdn3ry3a/node_modules/@pixi/text/lib/TextMetrics.mjs
var contextSettings = {
  willReadFrequently: true
};
var _TextMetrics = class {
  static get experimentalLetterSpacingSupported() {
    let result = _TextMetrics._experimentalLetterSpacingSupported;
    if (result !== void 0) {
      const proto = settings.ADAPTER.getCanvasRenderingContext2D().prototype;
      result = _TextMetrics._experimentalLetterSpacingSupported = "letterSpacing" in proto || "textLetterSpacing" in proto;
    }
    return result;
  }
  constructor(text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
    this.text = text;
    this.style = style;
    this.width = width;
    this.height = height;
    this.lines = lines;
    this.lineWidths = lineWidths;
    this.lineHeight = lineHeight;
    this.maxLineWidth = maxLineWidth;
    this.fontProperties = fontProperties;
  }
  static measureText(text, style, wordWrap, canvas = _TextMetrics._canvas) {
    wordWrap = wordWrap === void 0 || wordWrap === null ? style.wordWrap : wordWrap;
    const font = style.toFontString();
    const fontProperties = _TextMetrics.measureFont(font);
    if (fontProperties.fontSize === 0) {
      fontProperties.fontSize = style.fontSize;
      fontProperties.ascent = style.fontSize;
    }
    const context2 = canvas.getContext("2d", contextSettings);
    context2.font = font;
    const outputText = wordWrap ? _TextMetrics.wordWrap(text, style, canvas) : text;
    const lines = outputText.split(/(?:\r\n|\r|\n)/);
    const lineWidths = new Array(lines.length);
    let maxLineWidth = 0;
    for (let i2 = 0; i2 < lines.length; i2++) {
      const lineWidth = _TextMetrics._measureText(lines[i2], style.letterSpacing, context2);
      lineWidths[i2] = lineWidth;
      maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }
    let width = maxLineWidth + style.strokeThickness;
    if (style.dropShadow) {
      width += style.dropShadowDistance;
    }
    const lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
    let height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness * 2) + (lines.length - 1) * (lineHeight + style.leading);
    if (style.dropShadow) {
      height += style.dropShadowDistance;
    }
    return new _TextMetrics(text, style, width, height, lines, lineWidths, lineHeight + style.leading, maxLineWidth, fontProperties);
  }
  static _measureText(text, letterSpacing, context2) {
    let useExperimentalLetterSpacing = false;
    if (_TextMetrics.experimentalLetterSpacingSupported) {
      if (_TextMetrics.experimentalLetterSpacing) {
        context2.letterSpacing = `${letterSpacing}px`;
        context2.textLetterSpacing = `${letterSpacing}px`;
        useExperimentalLetterSpacing = true;
      } else {
        context2.letterSpacing = "0px";
        context2.textLetterSpacing = "0px";
      }
    }
    let width = context2.measureText(text).width;
    if (width > 0) {
      if (useExperimentalLetterSpacing) {
        width -= letterSpacing;
      } else {
        width += (_TextMetrics.graphemeSegmenter(text).length - 1) * letterSpacing;
      }
    }
    return width;
  }
  static wordWrap(text, style, canvas = _TextMetrics._canvas) {
    const context2 = canvas.getContext("2d", contextSettings);
    let width = 0;
    let line = "";
    let lines = "";
    const cache = /* @__PURE__ */ Object.create(null);
    const { letterSpacing, whiteSpace } = style;
    const collapseSpaces = _TextMetrics.collapseSpaces(whiteSpace);
    const collapseNewlines = _TextMetrics.collapseNewlines(whiteSpace);
    let canPrependSpaces = !collapseSpaces;
    const wordWrapWidth = style.wordWrapWidth + letterSpacing;
    const tokens = _TextMetrics.tokenize(text);
    for (let i2 = 0; i2 < tokens.length; i2++) {
      let token = tokens[i2];
      if (_TextMetrics.isNewline(token)) {
        if (!collapseNewlines) {
          lines += _TextMetrics.addLine(line);
          canPrependSpaces = !collapseSpaces;
          line = "";
          width = 0;
          continue;
        }
        token = " ";
      }
      if (collapseSpaces) {
        const currIsBreakingSpace = _TextMetrics.isBreakingSpace(token);
        const lastIsBreakingSpace = _TextMetrics.isBreakingSpace(line[line.length - 1]);
        if (currIsBreakingSpace && lastIsBreakingSpace) {
          continue;
        }
      }
      const tokenWidth = _TextMetrics.getFromCache(token, letterSpacing, cache, context2);
      if (tokenWidth > wordWrapWidth) {
        if (line !== "") {
          lines += _TextMetrics.addLine(line);
          line = "";
          width = 0;
        }
        if (_TextMetrics.canBreakWords(token, style.breakWords)) {
          const characters = _TextMetrics.wordWrapSplit(token);
          for (let j3 = 0; j3 < characters.length; j3++) {
            let char = characters[j3];
            let lastChar = char;
            let k3 = 1;
            while (characters[j3 + k3]) {
              const nextChar = characters[j3 + k3];
              if (!_TextMetrics.canBreakChars(lastChar, nextChar, token, j3, style.breakWords)) {
                char += nextChar;
              } else {
                break;
              }
              lastChar = nextChar;
              k3++;
            }
            j3 += k3 - 1;
            const characterWidth = _TextMetrics.getFromCache(char, letterSpacing, cache, context2);
            if (characterWidth + width > wordWrapWidth) {
              lines += _TextMetrics.addLine(line);
              canPrependSpaces = false;
              line = "";
              width = 0;
            }
            line += char;
            width += characterWidth;
          }
        } else {
          if (line.length > 0) {
            lines += _TextMetrics.addLine(line);
            line = "";
            width = 0;
          }
          const isLastToken = i2 === tokens.length - 1;
          lines += _TextMetrics.addLine(token, !isLastToken);
          canPrependSpaces = false;
          line = "";
          width = 0;
        }
      } else {
        if (tokenWidth + width > wordWrapWidth) {
          canPrependSpaces = false;
          lines += _TextMetrics.addLine(line);
          line = "";
          width = 0;
        }
        if (line.length > 0 || !_TextMetrics.isBreakingSpace(token) || canPrependSpaces) {
          line += token;
          width += tokenWidth;
        }
      }
    }
    lines += _TextMetrics.addLine(line, false);
    return lines;
  }
  static addLine(line, newLine = true) {
    line = _TextMetrics.trimRight(line);
    line = newLine ? `${line}
` : line;
    return line;
  }
  static getFromCache(key, letterSpacing, cache, context2) {
    let width = cache[key];
    if (typeof width !== "number") {
      width = _TextMetrics._measureText(key, letterSpacing, context2) + letterSpacing;
      cache[key] = width;
    }
    return width;
  }
  static collapseSpaces(whiteSpace) {
    return whiteSpace === "normal" || whiteSpace === "pre-line";
  }
  static collapseNewlines(whiteSpace) {
    return whiteSpace === "normal";
  }
  static trimRight(text) {
    if (typeof text !== "string") {
      return "";
    }
    for (let i2 = text.length - 1; i2 >= 0; i2--) {
      const char = text[i2];
      if (!_TextMetrics.isBreakingSpace(char)) {
        break;
      }
      text = text.slice(0, -1);
    }
    return text;
  }
  static isNewline(char) {
    if (typeof char !== "string") {
      return false;
    }
    return _TextMetrics._newlines.includes(char.charCodeAt(0));
  }
  static isBreakingSpace(char, _nextChar) {
    if (typeof char !== "string") {
      return false;
    }
    return _TextMetrics._breakingSpaces.includes(char.charCodeAt(0));
  }
  static tokenize(text) {
    const tokens = [];
    let token = "";
    if (typeof text !== "string") {
      return tokens;
    }
    for (let i2 = 0; i2 < text.length; i2++) {
      const char = text[i2];
      const nextChar = text[i2 + 1];
      if (_TextMetrics.isBreakingSpace(char, nextChar) || _TextMetrics.isNewline(char)) {
        if (token !== "") {
          tokens.push(token);
          token = "";
        }
        tokens.push(char);
        continue;
      }
      token += char;
    }
    if (token !== "") {
      tokens.push(token);
    }
    return tokens;
  }
  static canBreakWords(_token, breakWords) {
    return breakWords;
  }
  static canBreakChars(_char, _nextChar, _token, _index, _breakWords) {
    return true;
  }
  static wordWrapSplit(token) {
    return _TextMetrics.graphemeSegmenter(token);
  }
  static measureFont(font) {
    if (_TextMetrics._fonts[font]) {
      return _TextMetrics._fonts[font];
    }
    const properties = {
      ascent: 0,
      descent: 0,
      fontSize: 0
    };
    const canvas = _TextMetrics._canvas;
    const context2 = _TextMetrics._context;
    context2.font = font;
    const metricsString = _TextMetrics.METRICS_STRING + _TextMetrics.BASELINE_SYMBOL;
    const width = Math.ceil(context2.measureText(metricsString).width);
    let baseline = Math.ceil(context2.measureText(_TextMetrics.BASELINE_SYMBOL).width);
    const height = Math.ceil(_TextMetrics.HEIGHT_MULTIPLIER * baseline);
    baseline = baseline * _TextMetrics.BASELINE_MULTIPLIER | 0;
    if (width === 0 || height === 0) {
      _TextMetrics._fonts[font] = properties;
      return properties;
    }
    canvas.width = width;
    canvas.height = height;
    context2.fillStyle = "#f00";
    context2.fillRect(0, 0, width, height);
    context2.font = font;
    context2.textBaseline = "alphabetic";
    context2.fillStyle = "#000";
    context2.fillText(metricsString, 0, baseline);
    const imagedata = context2.getImageData(0, 0, width, height).data;
    const pixels = imagedata.length;
    const line = width * 4;
    let i2 = 0;
    let idx = 0;
    let stop = false;
    for (i2 = 0; i2 < baseline; ++i2) {
      for (let j3 = 0; j3 < line; j3 += 4) {
        if (imagedata[idx + j3] !== 255) {
          stop = true;
          break;
        }
      }
      if (!stop) {
        idx += line;
      } else {
        break;
      }
    }
    properties.ascent = baseline - i2;
    idx = pixels - line;
    stop = false;
    for (i2 = height; i2 > baseline; --i2) {
      for (let j3 = 0; j3 < line; j3 += 4) {
        if (imagedata[idx + j3] !== 255) {
          stop = true;
          break;
        }
      }
      if (!stop) {
        idx -= line;
      } else {
        break;
      }
    }
    properties.descent = i2 - baseline;
    properties.fontSize = properties.ascent + properties.descent;
    _TextMetrics._fonts[font] = properties;
    return properties;
  }
  static clearMetrics(font = "") {
    if (font) {
      delete _TextMetrics._fonts[font];
    } else {
      _TextMetrics._fonts = {};
    }
  }
  static get _canvas() {
    if (!_TextMetrics.__canvas) {
      let canvas;
      try {
        const c2 = new OffscreenCanvas(0, 0);
        const context2 = c2.getContext("2d", contextSettings);
        if (context2?.measureText) {
          _TextMetrics.__canvas = c2;
          return c2;
        }
        canvas = settings.ADAPTER.createCanvas();
      } catch (ex) {
        canvas = settings.ADAPTER.createCanvas();
      }
      canvas.width = canvas.height = 10;
      _TextMetrics.__canvas = canvas;
    }
    return _TextMetrics.__canvas;
  }
  static get _context() {
    if (!_TextMetrics.__context) {
      _TextMetrics.__context = _TextMetrics._canvas.getContext("2d", contextSettings);
    }
    return _TextMetrics.__context;
  }
};
var TextMetrics = _TextMetrics;
TextMetrics.METRICS_STRING = "|\xC9q\xC5";
TextMetrics.BASELINE_SYMBOL = "M";
TextMetrics.BASELINE_MULTIPLIER = 1.4;
TextMetrics.HEIGHT_MULTIPLIER = 2;
TextMetrics.graphemeSegmenter = (() => {
  if (typeof Intl?.Segmenter === "function") {
    const segmenter = new Intl.Segmenter();
    return (s2) => [...segmenter.segment(s2)].map((x2) => x2.segment);
  }
  return (s2) => [...s2];
})();
TextMetrics.experimentalLetterSpacing = false;
TextMetrics._fonts = {};
TextMetrics._newlines = [
  10,
  13
];
TextMetrics._breakingSpaces = [
  9,
  32,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8200,
  8201,
  8202,
  8287,
  12288
];

// ../../node_modules/.pnpm/@pixi+text@7.2.4_g5gcporgeyvj6eoj7ipdn3ry3a/node_modules/@pixi/text/lib/TextStyle.mjs
var genericFontFamilies = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
];
var _TextStyle = class {
  constructor(style) {
    this.styleID = 0;
    this.reset();
    deepCopyProperties(this, style, style);
  }
  clone() {
    const clonedProperties = {};
    deepCopyProperties(clonedProperties, this, _TextStyle.defaultStyle);
    return new _TextStyle(clonedProperties);
  }
  reset() {
    deepCopyProperties(this, _TextStyle.defaultStyle, _TextStyle.defaultStyle);
  }
  get align() {
    return this._align;
  }
  set align(align) {
    if (this._align !== align) {
      this._align = align;
      this.styleID++;
    }
  }
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(breakWords) {
    if (this._breakWords !== breakWords) {
      this._breakWords = breakWords;
      this.styleID++;
    }
  }
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(dropShadow) {
    if (this._dropShadow !== dropShadow) {
      this._dropShadow = dropShadow;
      this.styleID++;
    }
  }
  get dropShadowAlpha() {
    return this._dropShadowAlpha;
  }
  set dropShadowAlpha(dropShadowAlpha) {
    if (this._dropShadowAlpha !== dropShadowAlpha) {
      this._dropShadowAlpha = dropShadowAlpha;
      this.styleID++;
    }
  }
  get dropShadowAngle() {
    return this._dropShadowAngle;
  }
  set dropShadowAngle(dropShadowAngle) {
    if (this._dropShadowAngle !== dropShadowAngle) {
      this._dropShadowAngle = dropShadowAngle;
      this.styleID++;
    }
  }
  get dropShadowBlur() {
    return this._dropShadowBlur;
  }
  set dropShadowBlur(dropShadowBlur) {
    if (this._dropShadowBlur !== dropShadowBlur) {
      this._dropShadowBlur = dropShadowBlur;
      this.styleID++;
    }
  }
  get dropShadowColor() {
    return this._dropShadowColor;
  }
  set dropShadowColor(dropShadowColor) {
    const outputColor = getColor(dropShadowColor);
    if (this._dropShadowColor !== outputColor) {
      this._dropShadowColor = outputColor;
      this.styleID++;
    }
  }
  get dropShadowDistance() {
    return this._dropShadowDistance;
  }
  set dropShadowDistance(dropShadowDistance) {
    if (this._dropShadowDistance !== dropShadowDistance) {
      this._dropShadowDistance = dropShadowDistance;
      this.styleID++;
    }
  }
  get fill() {
    return this._fill;
  }
  set fill(fill) {
    const outputColor = getColor(fill);
    if (this._fill !== outputColor) {
      this._fill = outputColor;
      this.styleID++;
    }
  }
  get fillGradientType() {
    return this._fillGradientType;
  }
  set fillGradientType(fillGradientType) {
    if (this._fillGradientType !== fillGradientType) {
      this._fillGradientType = fillGradientType;
      this.styleID++;
    }
  }
  get fillGradientStops() {
    return this._fillGradientStops;
  }
  set fillGradientStops(fillGradientStops) {
    if (!areArraysEqual(this._fillGradientStops, fillGradientStops)) {
      this._fillGradientStops = fillGradientStops;
      this.styleID++;
    }
  }
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(fontFamily) {
    if (this.fontFamily !== fontFamily) {
      this._fontFamily = fontFamily;
      this.styleID++;
    }
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(fontSize) {
    if (this._fontSize !== fontSize) {
      this._fontSize = fontSize;
      this.styleID++;
    }
  }
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(fontStyle) {
    if (this._fontStyle !== fontStyle) {
      this._fontStyle = fontStyle;
      this.styleID++;
    }
  }
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(fontVariant) {
    if (this._fontVariant !== fontVariant) {
      this._fontVariant = fontVariant;
      this.styleID++;
    }
  }
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(fontWeight) {
    if (this._fontWeight !== fontWeight) {
      this._fontWeight = fontWeight;
      this.styleID++;
    }
  }
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(letterSpacing) {
    if (this._letterSpacing !== letterSpacing) {
      this._letterSpacing = letterSpacing;
      this.styleID++;
    }
  }
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(lineHeight) {
    if (this._lineHeight !== lineHeight) {
      this._lineHeight = lineHeight;
      this.styleID++;
    }
  }
  get leading() {
    return this._leading;
  }
  set leading(leading) {
    if (this._leading !== leading) {
      this._leading = leading;
      this.styleID++;
    }
  }
  get lineJoin() {
    return this._lineJoin;
  }
  set lineJoin(lineJoin) {
    if (this._lineJoin !== lineJoin) {
      this._lineJoin = lineJoin;
      this.styleID++;
    }
  }
  get miterLimit() {
    return this._miterLimit;
  }
  set miterLimit(miterLimit) {
    if (this._miterLimit !== miterLimit) {
      this._miterLimit = miterLimit;
      this.styleID++;
    }
  }
  get padding() {
    return this._padding;
  }
  set padding(padding) {
    if (this._padding !== padding) {
      this._padding = padding;
      this.styleID++;
    }
  }
  get stroke() {
    return this._stroke;
  }
  set stroke(stroke) {
    const outputColor = getColor(stroke);
    if (this._stroke !== outputColor) {
      this._stroke = outputColor;
      this.styleID++;
    }
  }
  get strokeThickness() {
    return this._strokeThickness;
  }
  set strokeThickness(strokeThickness) {
    if (this._strokeThickness !== strokeThickness) {
      this._strokeThickness = strokeThickness;
      this.styleID++;
    }
  }
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(textBaseline) {
    if (this._textBaseline !== textBaseline) {
      this._textBaseline = textBaseline;
      this.styleID++;
    }
  }
  get trim() {
    return this._trim;
  }
  set trim(trim) {
    if (this._trim !== trim) {
      this._trim = trim;
      this.styleID++;
    }
  }
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(whiteSpace) {
    if (this._whiteSpace !== whiteSpace) {
      this._whiteSpace = whiteSpace;
      this.styleID++;
    }
  }
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(wordWrap) {
    if (this._wordWrap !== wordWrap) {
      this._wordWrap = wordWrap;
      this.styleID++;
    }
  }
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(wordWrapWidth) {
    if (this._wordWrapWidth !== wordWrapWidth) {
      this._wordWrapWidth = wordWrapWidth;
      this.styleID++;
    }
  }
  toFontString() {
    const fontSizeString = typeof this.fontSize === "number" ? `${this.fontSize}px` : this.fontSize;
    let fontFamilies = this.fontFamily;
    if (!Array.isArray(this.fontFamily)) {
      fontFamilies = this.fontFamily.split(",");
    }
    for (let i2 = fontFamilies.length - 1; i2 >= 0; i2--) {
      let fontFamily = fontFamilies[i2].trim();
      if (!/([\"\'])[^\'\"]+\1/.test(fontFamily) && !genericFontFamilies.includes(fontFamily)) {
        fontFamily = `"${fontFamily}"`;
      }
      fontFamilies[i2] = fontFamily;
    }
    return `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${fontSizeString} ${fontFamilies.join(",")}`;
  }
};
var TextStyle = _TextStyle;
TextStyle.defaultStyle = {
  align: "left",
  breakWords: false,
  dropShadow: false,
  dropShadowAlpha: 1,
  dropShadowAngle: Math.PI / 6,
  dropShadowBlur: 0,
  dropShadowColor: "black",
  dropShadowDistance: 5,
  fill: "black",
  fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
  fillGradientStops: [],
  fontFamily: "Arial",
  fontSize: 26,
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "normal",
  leading: 0,
  letterSpacing: 0,
  lineHeight: 0,
  lineJoin: "miter",
  miterLimit: 10,
  padding: 0,
  stroke: "black",
  strokeThickness: 0,
  textBaseline: "alphabetic",
  trim: false,
  whiteSpace: "pre",
  wordWrap: false,
  wordWrapWidth: 100
};
function getColor(color) {
  const temp = Color.shared;
  if (!Array.isArray(color)) {
    return temp.setValue(color).toHex();
  } else {
    return color.map((c2) => temp.setValue(c2).toHex());
  }
}
function areArraysEqual(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i2 = 0; i2 < array1.length; ++i2) {
    if (array1[i2] !== array2[i2]) {
      return false;
    }
  }
  return true;
}
function deepCopyProperties(target, source, propertyObj) {
  for (const prop in propertyObj) {
    if (Array.isArray(source[prop])) {
      target[prop] = source[prop].slice();
    } else {
      target[prop] = source[prop];
    }
  }
}

// ../../node_modules/.pnpm/@pixi+text@7.2.4_g5gcporgeyvj6eoj7ipdn3ry3a/node_modules/@pixi/text/lib/Text.mjs
var defaultDestroyOptions = {
  texture: true,
  children: false,
  baseTexture: true
};
var _Text = class extends Sprite {
  constructor(text, style, canvas) {
    let ownCanvas = false;
    if (!canvas) {
      canvas = settings.ADAPTER.createCanvas();
      ownCanvas = true;
    }
    canvas.width = 3;
    canvas.height = 3;
    const texture = Texture.from(canvas);
    texture.orig = new Rectangle();
    texture.trim = new Rectangle();
    super(texture);
    this._ownCanvas = ownCanvas;
    this.canvas = canvas;
    this.context = canvas.getContext("2d", {
      willReadFrequently: true
    });
    this._resolution = _Text.defaultResolution ?? settings.RESOLUTION;
    this._autoResolution = _Text.defaultAutoResolution;
    this._text = null;
    this._style = null;
    this._styleListener = null;
    this._font = "";
    this.text = text;
    this.style = style;
    this.localStyleID = -1;
  }
  static get experimentalLetterSpacing() {
    return TextMetrics.experimentalLetterSpacing;
  }
  static set experimentalLetterSpacing(value) {
    lib_exports.deprecation("7.1.0", "Text.experimentalLetterSpacing is deprecated, use TextMetrics.experimentalLetterSpacing");
    TextMetrics.experimentalLetterSpacing = value;
  }
  updateText(respectDirty) {
    const style = this._style;
    if (this.localStyleID !== style.styleID) {
      this.dirty = true;
      this.localStyleID = style.styleID;
    }
    if (!this.dirty && respectDirty) {
      return;
    }
    this._font = this._style.toFontString();
    const context2 = this.context;
    const measured = TextMetrics.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas);
    const width = measured.width;
    const height = measured.height;
    const lines = measured.lines;
    const lineHeight = measured.lineHeight;
    const lineWidths = measured.lineWidths;
    const maxLineWidth = measured.maxLineWidth;
    const fontProperties = measured.fontProperties;
    this.canvas.width = Math.ceil(Math.ceil(Math.max(1, width) + style.padding * 2) * this._resolution);
    this.canvas.height = Math.ceil(Math.ceil(Math.max(1, height) + style.padding * 2) * this._resolution);
    context2.scale(this._resolution, this._resolution);
    context2.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context2.font = this._font;
    context2.lineWidth = style.strokeThickness;
    context2.textBaseline = style.textBaseline;
    context2.lineJoin = style.lineJoin;
    context2.miterLimit = style.miterLimit;
    let linePositionX;
    let linePositionY;
    const passesCount = style.dropShadow ? 2 : 1;
    for (let i2 = 0; i2 < passesCount; ++i2) {
      const isShadowPass = style.dropShadow && i2 === 0;
      const dsOffsetText = isShadowPass ? Math.ceil(Math.max(1, height) + style.padding * 2) : 0;
      const dsOffsetShadow = dsOffsetText * this._resolution;
      if (isShadowPass) {
        context2.fillStyle = "black";
        context2.strokeStyle = "black";
        const dropShadowColor = style.dropShadowColor;
        const dropShadowBlur = style.dropShadowBlur * this._resolution;
        const dropShadowDistance = style.dropShadowDistance * this._resolution;
        context2.shadowColor = Color.shared.setValue(dropShadowColor).setAlpha(style.dropShadowAlpha).toRgbaString();
        context2.shadowBlur = dropShadowBlur;
        context2.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance;
        context2.shadowOffsetY = Math.sin(style.dropShadowAngle) * dropShadowDistance + dsOffsetShadow;
      } else {
        context2.fillStyle = this._generateFillStyle(style, lines, measured);
        context2.strokeStyle = style.stroke;
        context2.shadowColor = "black";
        context2.shadowBlur = 0;
        context2.shadowOffsetX = 0;
        context2.shadowOffsetY = 0;
      }
      let linePositionYShift = (lineHeight - fontProperties.fontSize) / 2;
      if (lineHeight - fontProperties.fontSize < 0) {
        linePositionYShift = 0;
      }
      for (let i22 = 0; i22 < lines.length; i22++) {
        linePositionX = style.strokeThickness / 2;
        linePositionY = style.strokeThickness / 2 + i22 * lineHeight + fontProperties.ascent + linePositionYShift;
        if (style.align === "right") {
          linePositionX += maxLineWidth - lineWidths[i22];
        } else if (style.align === "center") {
          linePositionX += (maxLineWidth - lineWidths[i22]) / 2;
        }
        if (style.stroke && style.strokeThickness) {
          this.drawLetterSpacing(lines[i22], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText, true);
        }
        if (style.fill) {
          this.drawLetterSpacing(lines[i22], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText);
        }
      }
    }
    this.updateTexture();
  }
  drawLetterSpacing(text, x2, y2, isStroke = false) {
    const style = this._style;
    const letterSpacing = style.letterSpacing;
    let useExperimentalLetterSpacing = false;
    if (TextMetrics.experimentalLetterSpacingSupported) {
      if (TextMetrics.experimentalLetterSpacing) {
        this.context.letterSpacing = `${letterSpacing}px`;
        this.context.textLetterSpacing = `${letterSpacing}px`;
        useExperimentalLetterSpacing = true;
      } else {
        this.context.letterSpacing = "0px";
        this.context.textLetterSpacing = "0px";
      }
    }
    if (letterSpacing === 0 || useExperimentalLetterSpacing) {
      if (isStroke) {
        this.context.strokeText(text, x2, y2);
      } else {
        this.context.fillText(text, x2, y2);
      }
      return;
    }
    let currentPosition = x2;
    const stringArray = TextMetrics.graphemeSegmenter(text);
    let previousWidth = this.context.measureText(text).width;
    let currentWidth = 0;
    for (let i2 = 0; i2 < stringArray.length; ++i2) {
      const currentChar = stringArray[i2];
      if (isStroke) {
        this.context.strokeText(currentChar, currentPosition, y2);
      } else {
        this.context.fillText(currentChar, currentPosition, y2);
      }
      let textStr = "";
      for (let j3 = i2 + 1; j3 < stringArray.length; ++j3) {
        textStr += stringArray[j3];
      }
      currentWidth = this.context.measureText(textStr).width;
      currentPosition += previousWidth - currentWidth + letterSpacing;
      previousWidth = currentWidth;
    }
  }
  updateTexture() {
    const canvas = this.canvas;
    if (this._style.trim) {
      const trimmed = lib_exports.trimCanvas(canvas);
      if (trimmed.data) {
        canvas.width = trimmed.width;
        canvas.height = trimmed.height;
        this.context.putImageData(trimmed.data, 0, 0);
      }
    }
    const texture = this._texture;
    const style = this._style;
    const padding = style.trim ? 0 : style.padding;
    const baseTexture = texture.baseTexture;
    texture.trim.width = texture._frame.width = canvas.width / this._resolution;
    texture.trim.height = texture._frame.height = canvas.height / this._resolution;
    texture.trim.x = -padding;
    texture.trim.y = -padding;
    texture.orig.width = texture._frame.width - padding * 2;
    texture.orig.height = texture._frame.height - padding * 2;
    this._onTextureUpdate();
    baseTexture.setRealSize(canvas.width, canvas.height, this._resolution);
    texture.updateUvs();
    this.dirty = false;
  }
  _render(renderer) {
    if (this._autoResolution && this._resolution !== renderer.resolution) {
      this._resolution = renderer.resolution;
      this.dirty = true;
    }
    this.updateText(true);
    super._render(renderer);
  }
  updateTransform() {
    this.updateText(true);
    super.updateTransform();
  }
  getBounds(skipUpdate, rect) {
    this.updateText(true);
    if (this._textureID === -1) {
      skipUpdate = false;
    }
    return super.getBounds(skipUpdate, rect);
  }
  getLocalBounds(rect) {
    this.updateText(true);
    return super.getLocalBounds.call(this, rect);
  }
  _calculateBounds() {
    this.calculateVertices();
    this._bounds.addQuad(this.vertexData);
  }
  _generateFillStyle(style, lines, metrics) {
    const fillStyle = style.fill;
    if (!Array.isArray(fillStyle)) {
      return fillStyle;
    } else if (fillStyle.length === 1) {
      return fillStyle[0];
    }
    let gradient;
    const dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0;
    const padding = style.padding || 0;
    const width = this.canvas.width / this._resolution - dropShadowCorrection - padding * 2;
    const height = this.canvas.height / this._resolution - dropShadowCorrection - padding * 2;
    const fill = fillStyle.slice();
    const fillGradientStops = style.fillGradientStops.slice();
    if (!fillGradientStops.length) {
      const lengthPlus1 = fill.length + 1;
      for (let i2 = 1; i2 < lengthPlus1; ++i2) {
        fillGradientStops.push(i2 / lengthPlus1);
      }
    }
    fill.unshift(fillStyle[0]);
    fillGradientStops.unshift(0);
    fill.push(fillStyle[fillStyle.length - 1]);
    fillGradientStops.push(1);
    if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
      gradient = this.context.createLinearGradient(width / 2, padding, width / 2, height + padding);
      const textHeight = metrics.fontProperties.fontSize + style.strokeThickness;
      for (let i2 = 0; i2 < lines.length; i2++) {
        const lastLineBottom = metrics.lineHeight * (i2 - 1) + textHeight;
        const thisLineTop = metrics.lineHeight * i2;
        let thisLineGradientStart = thisLineTop;
        if (i2 > 0 && lastLineBottom > thisLineTop) {
          thisLineGradientStart = (thisLineTop + lastLineBottom) / 2;
        }
        const thisLineBottom = thisLineTop + textHeight;
        const nextLineTop = metrics.lineHeight * (i2 + 1);
        let thisLineGradientEnd = thisLineBottom;
        if (i2 + 1 < lines.length && nextLineTop < thisLineBottom) {
          thisLineGradientEnd = (thisLineBottom + nextLineTop) / 2;
        }
        const gradStopLineHeight = (thisLineGradientEnd - thisLineGradientStart) / height;
        for (let j3 = 0; j3 < fill.length; j3++) {
          let lineStop = 0;
          if (typeof fillGradientStops[j3] === "number") {
            lineStop = fillGradientStops[j3];
          } else {
            lineStop = j3 / fill.length;
          }
          let globalStop = Math.min(1, Math.max(0, thisLineGradientStart / height + lineStop * gradStopLineHeight));
          globalStop = Number(globalStop.toFixed(5));
          gradient.addColorStop(globalStop, fill[j3]);
        }
      }
    } else {
      gradient = this.context.createLinearGradient(padding, height / 2, width + padding, height / 2);
      const totalIterations = fill.length + 1;
      let currentIteration = 1;
      for (let i2 = 0; i2 < fill.length; i2++) {
        let stop;
        if (typeof fillGradientStops[i2] === "number") {
          stop = fillGradientStops[i2];
        } else {
          stop = currentIteration / totalIterations;
        }
        gradient.addColorStop(stop, fill[i2]);
        currentIteration++;
      }
    }
    return gradient;
  }
  destroy(options) {
    if (typeof options === "boolean") {
      options = { children: options };
    }
    options = Object.assign({}, defaultDestroyOptions, options);
    super.destroy(options);
    if (this._ownCanvas) {
      this.canvas.height = this.canvas.width = 0;
    }
    this.context = null;
    this.canvas = null;
    this._style = null;
  }
  get width() {
    this.updateText(true);
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(value) {
    this.updateText(true);
    const s2 = lib_exports.sign(this.scale.x) || 1;
    this.scale.x = s2 * value / this._texture.orig.width;
    this._width = value;
  }
  get height() {
    this.updateText(true);
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(value) {
    this.updateText(true);
    const s2 = lib_exports.sign(this.scale.y) || 1;
    this.scale.y = s2 * value / this._texture.orig.height;
    this._height = value;
  }
  get style() {
    return this._style;
  }
  set style(style) {
    style = style || {};
    if (style instanceof TextStyle) {
      this._style = style;
    } else {
      this._style = new TextStyle(style);
    }
    this.localStyleID = -1;
    this.dirty = true;
  }
  get text() {
    return this._text;
  }
  set text(text) {
    text = String(text === null || text === void 0 ? "" : text);
    if (this._text === text) {
      return;
    }
    this._text = text;
    this.dirty = true;
  }
  get resolution() {
    return this._resolution;
  }
  set resolution(value) {
    this._autoResolution = false;
    if (this._resolution === value) {
      return;
    }
    this._resolution = value;
    this.dirty = true;
  }
};
var Text = _Text;
Text.defaultAutoResolution = true;

// ../../node_modules/.pnpm/@pixi+prepare@7.2.4_fce7w7a3bxhcl7pwxsiqqk5t2a/node_modules/@pixi/prepare/lib/CountLimiter.mjs
var CountLimiter = class {
  constructor(maxItemsPerFrame) {
    this.maxItemsPerFrame = maxItemsPerFrame;
    this.itemsLeft = 0;
  }
  beginFrame() {
    this.itemsLeft = this.maxItemsPerFrame;
  }
  allowedToUpload() {
    return this.itemsLeft-- > 0;
  }
};

// ../../node_modules/.pnpm/@pixi+prepare@7.2.4_fce7w7a3bxhcl7pwxsiqqk5t2a/node_modules/@pixi/prepare/lib/BasePrepare.mjs
function findMultipleBaseTextures(item, queue) {
  let result = false;
  if (item?._textures?.length) {
    for (let i2 = 0; i2 < item._textures.length; i2++) {
      if (item._textures[i2] instanceof Texture) {
        const baseTexture = item._textures[i2].baseTexture;
        if (!queue.includes(baseTexture)) {
          queue.push(baseTexture);
          result = true;
        }
      }
    }
  }
  return result;
}
function findBaseTexture(item, queue) {
  if (item.baseTexture instanceof BaseTexture) {
    const texture = item.baseTexture;
    if (!queue.includes(texture)) {
      queue.push(texture);
    }
    return true;
  }
  return false;
}
function findTexture(item, queue) {
  if (item._texture && item._texture instanceof Texture) {
    const texture = item._texture.baseTexture;
    if (!queue.includes(texture)) {
      queue.push(texture);
    }
    return true;
  }
  return false;
}
function drawText(_helper, item) {
  if (item instanceof Text) {
    item.updateText(true);
    return true;
  }
  return false;
}
function calculateTextStyle(_helper, item) {
  if (item instanceof TextStyle) {
    const font = item.toFontString();
    TextMetrics.measureFont(font);
    return true;
  }
  return false;
}
function findText(item, queue) {
  if (item instanceof Text) {
    if (!queue.includes(item.style)) {
      queue.push(item.style);
    }
    if (!queue.includes(item)) {
      queue.push(item);
    }
    const texture = item._texture.baseTexture;
    if (!queue.includes(texture)) {
      queue.push(texture);
    }
    return true;
  }
  return false;
}
function findTextStyle(item, queue) {
  if (item instanceof TextStyle) {
    if (!queue.includes(item)) {
      queue.push(item);
    }
    return true;
  }
  return false;
}
var _BasePrepare = class {
  constructor(renderer) {
    this.limiter = new CountLimiter(_BasePrepare.uploadsPerFrame);
    this.renderer = renderer;
    this.uploadHookHelper = null;
    this.queue = [];
    this.addHooks = [];
    this.uploadHooks = [];
    this.completes = [];
    this.ticking = false;
    this.delayedTick = () => {
      if (!this.queue) {
        return;
      }
      this.prepareItems();
    };
    this.registerFindHook(findText);
    this.registerFindHook(findTextStyle);
    this.registerFindHook(findMultipleBaseTextures);
    this.registerFindHook(findBaseTexture);
    this.registerFindHook(findTexture);
    this.registerUploadHook(drawText);
    this.registerUploadHook(calculateTextStyle);
  }
  upload(item) {
    return new Promise((resolve2) => {
      if (item) {
        this.add(item);
      }
      if (this.queue.length) {
        this.completes.push(resolve2);
        if (!this.ticking) {
          this.ticking = true;
          Ticker.system.addOnce(this.tick, this, UPDATE_PRIORITY.UTILITY);
        }
      } else {
        resolve2();
      }
    });
  }
  tick() {
    setTimeout(this.delayedTick, 0);
  }
  prepareItems() {
    this.limiter.beginFrame();
    while (this.queue.length && this.limiter.allowedToUpload()) {
      const item = this.queue[0];
      let uploaded = false;
      if (item && !item._destroyed) {
        for (let i2 = 0, len = this.uploadHooks.length; i2 < len; i2++) {
          if (this.uploadHooks[i2](this.uploadHookHelper, item)) {
            this.queue.shift();
            uploaded = true;
            break;
          }
        }
      }
      if (!uploaded) {
        this.queue.shift();
      }
    }
    if (!this.queue.length) {
      this.ticking = false;
      const completes = this.completes.slice(0);
      this.completes.length = 0;
      for (let i2 = 0, len = completes.length; i2 < len; i2++) {
        completes[i2]();
      }
    } else {
      Ticker.system.addOnce(this.tick, this, UPDATE_PRIORITY.UTILITY);
    }
  }
  registerFindHook(addHook) {
    if (addHook) {
      this.addHooks.push(addHook);
    }
    return this;
  }
  registerUploadHook(uploadHook) {
    if (uploadHook) {
      this.uploadHooks.push(uploadHook);
    }
    return this;
  }
  add(item) {
    for (let i2 = 0, len = this.addHooks.length; i2 < len; i2++) {
      if (this.addHooks[i2](item, this.queue)) {
        break;
      }
    }
    if (item instanceof Container) {
      for (let i2 = item.children.length - 1; i2 >= 0; i2--) {
        this.add(item.children[i2]);
      }
    }
    return this;
  }
  destroy() {
    if (this.ticking) {
      Ticker.system.remove(this.tick, this);
    }
    this.ticking = false;
    this.addHooks = null;
    this.uploadHooks = null;
    this.renderer = null;
    this.completes = null;
    this.queue = null;
    this.limiter = null;
    this.uploadHookHelper = null;
  }
};
var BasePrepare = _BasePrepare;
BasePrepare.uploadsPerFrame = 4;

// ../../node_modules/.pnpm/@pixi+prepare@7.2.4_fce7w7a3bxhcl7pwxsiqqk5t2a/node_modules/@pixi/prepare/lib/settings.mjs
Object.defineProperties(settings, {
  UPLOADS_PER_FRAME: {
    get() {
      return BasePrepare.uploadsPerFrame;
    },
    set(value) {
      lib_exports.deprecation("7.1.0", "settings.UPLOADS_PER_FRAME is deprecated, use prepare.BasePrepare.uploadsPerFrame");
      BasePrepare.uploadsPerFrame = value;
    }
  }
});

// ../../node_modules/.pnpm/@pixi+prepare@7.2.4_fce7w7a3bxhcl7pwxsiqqk5t2a/node_modules/@pixi/prepare/lib/Prepare.mjs
function uploadBaseTextures(renderer, item) {
  if (item instanceof BaseTexture) {
    if (!item._glTextures[renderer.CONTEXT_UID]) {
      renderer.texture.bind(item);
    }
    return true;
  }
  return false;
}
function uploadGraphics(renderer, item) {
  if (!(item instanceof Graphics)) {
    return false;
  }
  const { geometry } = item;
  item.finishPoly();
  geometry.updateBatches();
  const { batches } = geometry;
  for (let i2 = 0; i2 < batches.length; i2++) {
    const { texture } = batches[i2].style;
    if (texture) {
      uploadBaseTextures(renderer, texture.baseTexture);
    }
  }
  if (!geometry.batchable) {
    renderer.geometry.bind(geometry, item._resolveDirectShader(renderer));
  }
  return true;
}
function findGraphics(item, queue) {
  if (item instanceof Graphics) {
    queue.push(item);
    return true;
  }
  return false;
}
var Prepare = class extends BasePrepare {
  constructor(renderer) {
    super(renderer);
    this.uploadHookHelper = this.renderer;
    this.registerFindHook(findGraphics);
    this.registerUploadHook(uploadBaseTextures);
    this.registerUploadHook(uploadGraphics);
  }
};
Prepare.extension = {
  name: "prepare",
  type: ExtensionType.RendererSystem
};
extensions.add(Prepare);

// ../../node_modules/.pnpm/@pixi+sprite-tiling@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/sprite-tiling/lib/TilingSprite.mjs
var tempPoint3 = new Point();
var TilingSprite = class extends Sprite {
  constructor(texture, width = 100, height = 100) {
    super(texture);
    this.tileTransform = new Transform();
    this._width = width;
    this._height = height;
    this.uvMatrix = this.texture.uvMatrix || new TextureMatrix(texture);
    this.pluginName = "tilingSprite";
    this.uvRespectAnchor = false;
  }
  get clampMargin() {
    return this.uvMatrix.clampMargin;
  }
  set clampMargin(value) {
    this.uvMatrix.clampMargin = value;
    this.uvMatrix.update(true);
  }
  get tileScale() {
    return this.tileTransform.scale;
  }
  set tileScale(value) {
    this.tileTransform.scale.copyFrom(value);
  }
  get tilePosition() {
    return this.tileTransform.position;
  }
  set tilePosition(value) {
    this.tileTransform.position.copyFrom(value);
  }
  _onTextureUpdate() {
    if (this.uvMatrix) {
      this.uvMatrix.texture = this._texture;
    }
    this._cachedTint = 16777215;
  }
  _render(renderer) {
    const texture = this._texture;
    if (!texture || !texture.valid) {
      return;
    }
    this.tileTransform.updateLocalTransform();
    this.uvMatrix.update();
    renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
    renderer.plugins[this.pluginName].render(this);
  }
  _calculateBounds() {
    const minX = this._width * -this._anchor._x;
    const minY = this._height * -this._anchor._y;
    const maxX = this._width * (1 - this._anchor._x);
    const maxY = this._height * (1 - this._anchor._y);
    this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
  }
  getLocalBounds(rect) {
    if (this.children.length === 0) {
      this._bounds.minX = this._width * -this._anchor._x;
      this._bounds.minY = this._height * -this._anchor._y;
      this._bounds.maxX = this._width * (1 - this._anchor._x);
      this._bounds.maxY = this._height * (1 - this._anchor._y);
      if (!rect) {
        if (!this._localBoundsRect) {
          this._localBoundsRect = new Rectangle();
        }
        rect = this._localBoundsRect;
      }
      return this._bounds.getRectangle(rect);
    }
    return super.getLocalBounds.call(this, rect);
  }
  containsPoint(point) {
    this.worldTransform.applyInverse(point, tempPoint3);
    const width = this._width;
    const height = this._height;
    const x1 = -width * this.anchor._x;
    if (tempPoint3.x >= x1 && tempPoint3.x < x1 + width) {
      const y1 = -height * this.anchor._y;
      if (tempPoint3.y >= y1 && tempPoint3.y < y1 + height) {
        return true;
      }
    }
    return false;
  }
  destroy(options) {
    super.destroy(options);
    this.tileTransform = null;
    this.uvMatrix = null;
  }
  static from(source, options) {
    const texture = source instanceof Texture ? source : Texture.from(source, options);
    return new TilingSprite(texture, options.width, options.height);
  }
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
  }
};

// ../../node_modules/.pnpm/@pixi+sprite-tiling@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/sprite-tiling/lib/sprite-tiling.mjs
var gl2FragmentSrc = "#version 300 es\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nin vec2 vTextureCoord;\n\nout vec4 fragmentColor;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    vec2 unclamped = coord;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 texSample = texture(uSampler, coord, unclamped == coord ? 0.0f : -32.0f);// lod-bias very negative to force lod 0\n\n    fragmentColor = texSample * uColor;\n}\n";

// ../../node_modules/.pnpm/@pixi+sprite-tiling@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/sprite-tiling/lib/sprite-tiling2.mjs
var gl2VertexSrc = "#version 300 es\n#define SHADER_NAME Tiling-Sprite-300\n\nprecision lowp float;\n\nin vec2 aVertexPosition;\nin vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nout vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n";

// ../../node_modules/.pnpm/@pixi+sprite-tiling@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/sprite-tiling/lib/sprite-tiling-fallback.mjs
var gl1FragmentSrc = "#version 100\n#ifdef GL_EXT_shader_texture_lod\n    #extension GL_EXT_shader_texture_lod : enable\n#endif\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    vec2 unclamped = coord;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    #ifdef GL_EXT_shader_texture_lod\n        vec4 texSample = unclamped == coord\n            ? texture2D(uSampler, coord) \n            : texture2DLodEXT(uSampler, coord, 0);\n    #else\n        vec4 texSample = texture2D(uSampler, coord);\n    #endif\n\n    gl_FragColor = texSample * uColor;\n}\n";

// ../../node_modules/.pnpm/@pixi+sprite-tiling@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/sprite-tiling/lib/sprite-tiling-fallback2.mjs
var gl1VertexSrc = "#version 100\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n";

// ../../node_modules/.pnpm/@pixi+sprite-tiling@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/sprite-tiling/lib/sprite-tiling-simple.mjs
var fragmentSimpleSrc = "#version 100\n#define SHADER_NAME Tiling-Sprite-Simple-100\n\nprecision lowp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 texSample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = texSample * uColor;\n}\n";

// ../../node_modules/.pnpm/@pixi+sprite-tiling@7.2.4_egijvkz2mf6h4shwf5d3fpgilu/node_modules/@pixi/sprite-tiling/lib/TilingSpriteRenderer.mjs
var tempMat2 = new Matrix();
var TilingSpriteRenderer = class extends ObjectRenderer {
  constructor(renderer) {
    super(renderer);
    renderer.runners.contextChange.add(this);
    this.quad = new QuadUv();
    this.state = State.for2d();
  }
  contextChange() {
    const renderer = this.renderer;
    const uniforms = { globals: renderer.globalUniforms };
    this.simpleShader = Shader.from(gl1VertexSrc, fragmentSimpleSrc, uniforms);
    this.shader = renderer.context.webGLVersion > 1 ? Shader.from(gl2VertexSrc, gl2FragmentSrc, uniforms) : Shader.from(gl1VertexSrc, gl1FragmentSrc, uniforms);
  }
  render(ts) {
    const renderer = this.renderer;
    const quad = this.quad;
    let vertices = quad.vertices;
    vertices[0] = vertices[6] = ts._width * -ts.anchor.x;
    vertices[1] = vertices[3] = ts._height * -ts.anchor.y;
    vertices[2] = vertices[4] = ts._width * (1 - ts.anchor.x);
    vertices[5] = vertices[7] = ts._height * (1 - ts.anchor.y);
    const anchorX = ts.uvRespectAnchor ? ts.anchor.x : 0;
    const anchorY = ts.uvRespectAnchor ? ts.anchor.y : 0;
    vertices = quad.uvs;
    vertices[0] = vertices[6] = -anchorX;
    vertices[1] = vertices[3] = -anchorY;
    vertices[2] = vertices[4] = 1 - anchorX;
    vertices[5] = vertices[7] = 1 - anchorY;
    quad.invalidate();
    const tex = ts._texture;
    const baseTex = tex.baseTexture;
    const premultiplied = baseTex.alphaMode > 0;
    const lt = ts.tileTransform.localTransform;
    const uv = ts.uvMatrix;
    let isSimple = baseTex.isPowerOfTwo && tex.frame.width === baseTex.width && tex.frame.height === baseTex.height;
    if (isSimple) {
      if (!baseTex._glTextures[renderer.CONTEXT_UID]) {
        if (baseTex.wrapMode === WRAP_MODES.CLAMP) {
          baseTex.wrapMode = WRAP_MODES.REPEAT;
        }
      } else {
        isSimple = baseTex.wrapMode !== WRAP_MODES.CLAMP;
      }
    }
    const shader = isSimple ? this.simpleShader : this.shader;
    const w3 = tex.width;
    const h2 = tex.height;
    const W2 = ts._width;
    const H3 = ts._height;
    tempMat2.set(lt.a * w3 / W2, lt.b * w3 / H3, lt.c * h2 / W2, lt.d * h2 / H3, lt.tx / W2, lt.ty / H3);
    tempMat2.invert();
    if (isSimple) {
      tempMat2.prepend(uv.mapCoord);
    } else {
      shader.uniforms.uMapCoord = uv.mapCoord.toArray(true);
      shader.uniforms.uClampFrame = uv.uClampFrame;
      shader.uniforms.uClampOffset = uv.uClampOffset;
    }
    shader.uniforms.uTransform = tempMat2.toArray(true);
    shader.uniforms.uColor = Color.shared.setValue(ts.tint).premultiply(ts.worldAlpha, premultiplied).toArray(shader.uniforms.uColor);
    shader.uniforms.translationMatrix = ts.transform.worldTransform.toArray(true);
    shader.uniforms.uSampler = tex;
    renderer.shader.bind(shader);
    renderer.geometry.bind(quad);
    this.state.blendMode = lib_exports.correctBlendMode(ts.blendMode, premultiplied);
    renderer.state.set(this.state);
    renderer.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
  }
};
TilingSpriteRenderer.extension = {
  name: "tilingSprite",
  type: ExtensionType.RendererPlugin
};
extensions.add(TilingSpriteRenderer);

// ../../node_modules/.pnpm/@pixi+spritesheet@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/spritesheet/lib/Spritesheet.mjs
var _Spritesheet = class {
  constructor(texture, data, resolutionFilename = null) {
    this.linkedSheets = [];
    this._texture = texture instanceof Texture ? texture : null;
    this.baseTexture = texture instanceof BaseTexture ? texture : this._texture.baseTexture;
    this.textures = {};
    this.animations = {};
    this.data = data;
    const resource = this.baseTexture.resource;
    this.resolution = this._updateResolution(resolutionFilename || (resource ? resource.url : null));
    this._frames = this.data.frames;
    this._frameKeys = Object.keys(this._frames);
    this._batchIndex = 0;
    this._callback = null;
  }
  _updateResolution(resolutionFilename = null) {
    const { scale } = this.data.meta;
    let resolution = lib_exports.getResolutionOfUrl(resolutionFilename, null);
    if (resolution === null) {
      resolution = parseFloat(scale ?? "1");
    }
    if (resolution !== 1) {
      this.baseTexture.setResolution(resolution);
    }
    return resolution;
  }
  parse() {
    return new Promise((resolve2) => {
      this._callback = resolve2;
      this._batchIndex = 0;
      if (this._frameKeys.length <= _Spritesheet.BATCH_SIZE) {
        this._processFrames(0);
        this._processAnimations();
        this._parseComplete();
      } else {
        this._nextBatch();
      }
    });
  }
  _processFrames(initialFrameIndex) {
    let frameIndex = initialFrameIndex;
    const maxFrames = _Spritesheet.BATCH_SIZE;
    while (frameIndex - initialFrameIndex < maxFrames && frameIndex < this._frameKeys.length) {
      const i2 = this._frameKeys[frameIndex];
      const data = this._frames[i2];
      const rect = data.frame;
      if (rect) {
        let frame = null;
        let trim = null;
        const sourceSize = data.trimmed !== false && data.sourceSize ? data.sourceSize : data.frame;
        const orig = new Rectangle(0, 0, Math.floor(sourceSize.w) / this.resolution, Math.floor(sourceSize.h) / this.resolution);
        if (data.rotated) {
          frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.h) / this.resolution, Math.floor(rect.w) / this.resolution);
        } else {
          frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution);
        }
        if (data.trimmed !== false && data.spriteSourceSize) {
          trim = new Rectangle(Math.floor(data.spriteSourceSize.x) / this.resolution, Math.floor(data.spriteSourceSize.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution);
        }
        this.textures[i2] = new Texture(this.baseTexture, frame, orig, trim, data.rotated ? 2 : 0, data.anchor, data.borders);
        Texture.addToCache(this.textures[i2], i2);
      }
      frameIndex++;
    }
  }
  _processAnimations() {
    const animations = this.data.animations || {};
    for (const animName in animations) {
      this.animations[animName] = [];
      for (let i2 = 0; i2 < animations[animName].length; i2++) {
        const frameName = animations[animName][i2];
        this.animations[animName].push(this.textures[frameName]);
      }
    }
  }
  _parseComplete() {
    const callback = this._callback;
    this._callback = null;
    this._batchIndex = 0;
    callback.call(this, this.textures);
  }
  _nextBatch() {
    this._processFrames(this._batchIndex * _Spritesheet.BATCH_SIZE);
    this._batchIndex++;
    setTimeout(() => {
      if (this._batchIndex * _Spritesheet.BATCH_SIZE < this._frameKeys.length) {
        this._nextBatch();
      } else {
        this._processAnimations();
        this._parseComplete();
      }
    }, 0);
  }
  destroy(destroyBase = false) {
    for (const i2 in this.textures) {
      this.textures[i2].destroy();
    }
    this._frames = null;
    this._frameKeys = null;
    this.data = null;
    this.textures = null;
    if (destroyBase) {
      this._texture?.destroy();
      this.baseTexture.destroy();
    }
    this._texture = null;
    this.baseTexture = null;
    this.linkedSheets = [];
  }
};
var Spritesheet = _Spritesheet;
Spritesheet.BATCH_SIZE = 1e3;

// ../../node_modules/.pnpm/@pixi+spritesheet@7.2.4_aghqcd5tse5cazfsjow2c4mnti/node_modules/@pixi/spritesheet/lib/spritesheetAsset.mjs
var validImages = ["jpg", "png", "jpeg", "avif", "webp"];
function getCacheableAssets(keys, asset, ignoreMultiPack) {
  const out = {};
  keys.forEach((key) => {
    out[key] = asset;
  });
  Object.keys(asset.textures).forEach((key) => {
    out[key] = asset.textures[key];
  });
  if (!ignoreMultiPack) {
    const basePath = lib_exports.path.dirname(keys[0]);
    asset.linkedSheets.forEach((item, i2) => {
      const out2 = getCacheableAssets([`${basePath}/${asset.data.meta.related_multi_packs[i2]}`], item, true);
      Object.assign(out, out2);
    });
  }
  return out;
}
var spritesheetAsset = {
  extension: ExtensionType.Asset,
  cache: {
    test: (asset) => asset instanceof Spritesheet,
    getCacheableAssets: (keys, asset) => getCacheableAssets(keys, asset, false)
  },
  resolver: {
    test: (value) => {
      const tempURL = value.split("?")[0];
      const split = tempURL.split(".");
      const extension = split.pop();
      const format2 = split.pop();
      return extension === "json" && validImages.includes(format2);
    },
    parse: (value) => {
      const split = value.split(".");
      return {
        resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
        format: split[split.length - 2],
        src: value
      };
    }
  },
  loader: {
    name: "spritesheetLoader",
    extension: {
      type: ExtensionType.LoadParser,
      priority: LoaderParserPriority.Normal
    },
    async testParse(asset, options) {
      return lib_exports.path.extname(options.src).toLowerCase() === ".json" && !!asset.frames;
    },
    async parse(asset, options, loader) {
      let basePath = lib_exports.path.dirname(options.src);
      if (basePath && basePath.lastIndexOf("/") !== basePath.length - 1) {
        basePath += "/";
      }
      let imagePath = basePath + asset.meta.image;
      imagePath = copySearchParams(imagePath, options.src);
      const assets = await loader.load([imagePath]);
      const texture = assets[imagePath];
      const spritesheet = new Spritesheet(texture.baseTexture, asset, options.src);
      await spritesheet.parse();
      const multiPacks = asset?.meta?.related_multi_packs;
      if (Array.isArray(multiPacks)) {
        const promises = [];
        for (const item of multiPacks) {
          if (typeof item !== "string") {
            continue;
          }
          let itemUrl = basePath + item;
          if (options.data?.ignoreMultiPack) {
            continue;
          }
          itemUrl = copySearchParams(itemUrl, options.src);
          promises.push(loader.load({
            src: itemUrl,
            data: {
              ignoreMultiPack: true
            }
          }));
        }
        const res = await Promise.all(promises);
        spritesheet.linkedSheets = res;
        res.forEach((item) => {
          item.linkedSheets = [spritesheet].concat(spritesheet.linkedSheets.filter((sp) => sp !== item));
        });
      }
      return spritesheet;
    },
    unload(spritesheet) {
      spritesheet.destroy(true);
    }
  }
};
extensions.add(spritesheetAsset);

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/BitmapFontData.mjs
var BitmapFontData = class {
  constructor() {
    this.info = [];
    this.common = [];
    this.page = [];
    this.char = [];
    this.kerning = [];
    this.distanceField = [];
  }
};

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/formats/TextFormat.mjs
var TextFormat = class {
  static test(data) {
    return typeof data === "string" && data.startsWith("info face=");
  }
  static parse(txt) {
    const items = txt.match(/^[a-z]+\s+.+$/gm);
    const rawData = {
      info: [],
      common: [],
      page: [],
      char: [],
      chars: [],
      kerning: [],
      kernings: [],
      distanceField: []
    };
    for (const i2 in items) {
      const name = items[i2].match(/^[a-z]+/gm)[0];
      const attributeList = items[i2].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm);
      const itemData = {};
      for (const i22 in attributeList) {
        const split = attributeList[i22].split("=");
        const key = split[0];
        const strValue = split[1].replace(/"/gm, "");
        const floatValue = parseFloat(strValue);
        const value = isNaN(floatValue) ? strValue : floatValue;
        itemData[key] = value;
      }
      rawData[name].push(itemData);
    }
    const font = new BitmapFontData();
    rawData.info.forEach((info) => font.info.push({
      face: info.face,
      size: parseInt(info.size, 10)
    }));
    rawData.common.forEach((common) => font.common.push({
      lineHeight: parseInt(common.lineHeight, 10)
    }));
    rawData.page.forEach((page) => font.page.push({
      id: parseInt(page.id, 10),
      file: page.file
    }));
    rawData.char.forEach((char) => font.char.push({
      id: parseInt(char.id, 10),
      page: parseInt(char.page, 10),
      x: parseInt(char.x, 10),
      y: parseInt(char.y, 10),
      width: parseInt(char.width, 10),
      height: parseInt(char.height, 10),
      xoffset: parseInt(char.xoffset, 10),
      yoffset: parseInt(char.yoffset, 10),
      xadvance: parseInt(char.xadvance, 10)
    }));
    rawData.kerning.forEach((kerning) => font.kerning.push({
      first: parseInt(kerning.first, 10),
      second: parseInt(kerning.second, 10),
      amount: parseInt(kerning.amount, 10)
    }));
    rawData.distanceField.forEach((df) => font.distanceField.push({
      distanceRange: parseInt(df.distanceRange, 10),
      fieldType: df.fieldType
    }));
    return font;
  }
};

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/formats/XMLFormat.mjs
var XMLFormat = class {
  static test(data) {
    const xml = data;
    return "getElementsByTagName" in xml && xml.getElementsByTagName("page").length && xml.getElementsByTagName("info")[0].getAttribute("face") !== null;
  }
  static parse(xml) {
    const data = new BitmapFontData();
    const info = xml.getElementsByTagName("info");
    const common = xml.getElementsByTagName("common");
    const page = xml.getElementsByTagName("page");
    const char = xml.getElementsByTagName("char");
    const kerning = xml.getElementsByTagName("kerning");
    const distanceField = xml.getElementsByTagName("distanceField");
    for (let i2 = 0; i2 < info.length; i2++) {
      data.info.push({
        face: info[i2].getAttribute("face"),
        size: parseInt(info[i2].getAttribute("size"), 10)
      });
    }
    for (let i2 = 0; i2 < common.length; i2++) {
      data.common.push({
        lineHeight: parseInt(common[i2].getAttribute("lineHeight"), 10)
      });
    }
    for (let i2 = 0; i2 < page.length; i2++) {
      data.page.push({
        id: parseInt(page[i2].getAttribute("id"), 10) || 0,
        file: page[i2].getAttribute("file")
      });
    }
    for (let i2 = 0; i2 < char.length; i2++) {
      const letter = char[i2];
      data.char.push({
        id: parseInt(letter.getAttribute("id"), 10),
        page: parseInt(letter.getAttribute("page"), 10) || 0,
        x: parseInt(letter.getAttribute("x"), 10),
        y: parseInt(letter.getAttribute("y"), 10),
        width: parseInt(letter.getAttribute("width"), 10),
        height: parseInt(letter.getAttribute("height"), 10),
        xoffset: parseInt(letter.getAttribute("xoffset"), 10),
        yoffset: parseInt(letter.getAttribute("yoffset"), 10),
        xadvance: parseInt(letter.getAttribute("xadvance"), 10)
      });
    }
    for (let i2 = 0; i2 < kerning.length; i2++) {
      data.kerning.push({
        first: parseInt(kerning[i2].getAttribute("first"), 10),
        second: parseInt(kerning[i2].getAttribute("second"), 10),
        amount: parseInt(kerning[i2].getAttribute("amount"), 10)
      });
    }
    for (let i2 = 0; i2 < distanceField.length; i2++) {
      data.distanceField.push({
        fieldType: distanceField[i2].getAttribute("fieldType"),
        distanceRange: parseInt(distanceField[i2].getAttribute("distanceRange"), 10)
      });
    }
    return data;
  }
};

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/formats/XMLStringFormat.mjs
var XMLStringFormat = class {
  static test(data) {
    if (typeof data === "string" && data.includes("<font>")) {
      return XMLFormat.test(settings.ADAPTER.parseXML(data));
    }
    return false;
  }
  static parse(xmlTxt) {
    return XMLFormat.parse(settings.ADAPTER.parseXML(xmlTxt));
  }
};

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/formats/index.mjs
var formats = [
  TextFormat,
  XMLFormat,
  XMLStringFormat
];
function autoDetectFormat(data) {
  for (let i2 = 0; i2 < formats.length; i2++) {
    if (formats[i2].test(data)) {
      return formats[i2];
    }
  }
  return null;
}

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/utils/generateFillStyle.mjs
function generateFillStyle(canvas, context2, style, resolution, lines, metrics) {
  const fillStyle = style.fill;
  if (!Array.isArray(fillStyle)) {
    return fillStyle;
  } else if (fillStyle.length === 1) {
    return fillStyle[0];
  }
  let gradient;
  const dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0;
  const padding = style.padding || 0;
  const width = canvas.width / resolution - dropShadowCorrection - padding * 2;
  const height = canvas.height / resolution - dropShadowCorrection - padding * 2;
  const fill = fillStyle.slice();
  const fillGradientStops = style.fillGradientStops.slice();
  if (!fillGradientStops.length) {
    const lengthPlus1 = fill.length + 1;
    for (let i2 = 1; i2 < lengthPlus1; ++i2) {
      fillGradientStops.push(i2 / lengthPlus1);
    }
  }
  fill.unshift(fillStyle[0]);
  fillGradientStops.unshift(0);
  fill.push(fillStyle[fillStyle.length - 1]);
  fillGradientStops.push(1);
  if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
    gradient = context2.createLinearGradient(width / 2, padding, width / 2, height + padding);
    let lastIterationStop = 0;
    const textHeight = metrics.fontProperties.fontSize + style.strokeThickness;
    const gradStopLineHeight = textHeight / height;
    for (let i2 = 0; i2 < lines.length; i2++) {
      const thisLineTop = metrics.lineHeight * i2;
      for (let j3 = 0; j3 < fill.length; j3++) {
        let lineStop = 0;
        if (typeof fillGradientStops[j3] === "number") {
          lineStop = fillGradientStops[j3];
        } else {
          lineStop = j3 / fill.length;
        }
        const globalStop = thisLineTop / height + lineStop * gradStopLineHeight;
        let clampedStop = Math.max(lastIterationStop, globalStop);
        clampedStop = Math.min(clampedStop, 1);
        gradient.addColorStop(clampedStop, fill[j3]);
        lastIterationStop = clampedStop;
      }
    }
  } else {
    gradient = context2.createLinearGradient(padding, height / 2, width + padding, height / 2);
    const totalIterations = fill.length + 1;
    let currentIteration = 1;
    for (let i2 = 0; i2 < fill.length; i2++) {
      let stop;
      if (typeof fillGradientStops[i2] === "number") {
        stop = fillGradientStops[i2];
      } else {
        stop = currentIteration / totalIterations;
      }
      gradient.addColorStop(stop, fill[i2]);
      currentIteration++;
    }
  }
  return gradient;
}

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/utils/drawGlyph.mjs
function drawGlyph(canvas, context2, metrics, x2, y2, resolution, style) {
  const char = metrics.text;
  const fontProperties = metrics.fontProperties;
  context2.translate(x2, y2);
  context2.scale(resolution, resolution);
  const tx = style.strokeThickness / 2;
  const ty = -(style.strokeThickness / 2);
  context2.font = style.toFontString();
  context2.lineWidth = style.strokeThickness;
  context2.textBaseline = style.textBaseline;
  context2.lineJoin = style.lineJoin;
  context2.miterLimit = style.miterLimit;
  context2.fillStyle = generateFillStyle(canvas, context2, style, resolution, [char], metrics);
  context2.strokeStyle = style.stroke;
  if (style.dropShadow) {
    const dropShadowColor = style.dropShadowColor;
    const dropShadowBlur = style.dropShadowBlur * resolution;
    const dropShadowDistance = style.dropShadowDistance * resolution;
    context2.shadowColor = Color.shared.setValue(dropShadowColor).setAlpha(style.dropShadowAlpha).toRgbaString();
    context2.shadowBlur = dropShadowBlur;
    context2.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance;
    context2.shadowOffsetY = Math.sin(style.dropShadowAngle) * dropShadowDistance;
  } else {
    context2.shadowColor = "black";
    context2.shadowBlur = 0;
    context2.shadowOffsetX = 0;
    context2.shadowOffsetY = 0;
  }
  if (style.stroke && style.strokeThickness) {
    context2.strokeText(char, tx, ty + metrics.lineHeight - fontProperties.descent);
  }
  if (style.fill) {
    context2.fillText(char, tx, ty + metrics.lineHeight - fontProperties.descent);
  }
  context2.setTransform(1, 0, 0, 1, 0, 0);
  context2.fillStyle = "rgba(0, 0, 0, 0)";
}

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/utils/extractCharCode.mjs
function extractCharCode(str) {
  return str.codePointAt ? str.codePointAt(0) : str.charCodeAt(0);
}

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/utils/splitTextToCharacters.mjs
function splitTextToCharacters(text) {
  return Array.from ? Array.from(text) : text.split("");
}

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/utils/resolveCharacters.mjs
function resolveCharacters(chars) {
  if (typeof chars === "string") {
    chars = [chars];
  }
  const result = [];
  for (let i2 = 0, j3 = chars.length; i2 < j3; i2++) {
    const item = chars[i2];
    if (Array.isArray(item)) {
      if (item.length !== 2) {
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${item.length}.`);
      }
      const startCode = item[0].charCodeAt(0);
      const endCode = item[1].charCodeAt(0);
      if (endCode < startCode) {
        throw new Error("[BitmapFont]: Invalid character range.");
      }
      for (let i22 = startCode, j22 = endCode; i22 <= j22; i22++) {
        result.push(String.fromCharCode(i22));
      }
    } else {
      result.push(...splitTextToCharacters(item));
    }
  }
  if (result.length === 0) {
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  }
  return result;
}

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/BitmapFont.mjs
var _BitmapFont = class {
  constructor(data, textures, ownsTextures) {
    const [info] = data.info;
    const [common] = data.common;
    const [page] = data.page;
    const [distanceField] = data.distanceField;
    const res = lib_exports.getResolutionOfUrl(page.file);
    const pageTextures = {};
    this._ownsTextures = ownsTextures;
    this.font = info.face;
    this.size = info.size;
    this.lineHeight = common.lineHeight / res;
    this.chars = {};
    this.pageTextures = pageTextures;
    for (let i2 = 0; i2 < data.page.length; i2++) {
      const { id, file } = data.page[i2];
      pageTextures[id] = textures instanceof Array ? textures[i2] : textures[file];
      if (distanceField?.fieldType && distanceField.fieldType !== "none") {
        pageTextures[id].baseTexture.alphaMode = ALPHA_MODES.NO_PREMULTIPLIED_ALPHA;
        pageTextures[id].baseTexture.mipmap = MIPMAP_MODES.OFF;
      }
    }
    for (let i2 = 0; i2 < data.char.length; i2++) {
      const { id, page: page2 } = data.char[i2];
      let { x: x2, y: y2, width, height, xoffset, yoffset, xadvance } = data.char[i2];
      x2 /= res;
      y2 /= res;
      width /= res;
      height /= res;
      xoffset /= res;
      yoffset /= res;
      xadvance /= res;
      const rect = new Rectangle(x2 + pageTextures[page2].frame.x / res, y2 + pageTextures[page2].frame.y / res, width, height);
      this.chars[id] = {
        xOffset: xoffset,
        yOffset: yoffset,
        xAdvance: xadvance,
        kerning: {},
        texture: new Texture(pageTextures[page2].baseTexture, rect),
        page: page2
      };
    }
    for (let i2 = 0; i2 < data.kerning.length; i2++) {
      let { first, second, amount } = data.kerning[i2];
      first /= res;
      second /= res;
      amount /= res;
      if (this.chars[second]) {
        this.chars[second].kerning[first] = amount;
      }
    }
    this.distanceFieldRange = distanceField?.distanceRange;
    this.distanceFieldType = distanceField?.fieldType?.toLowerCase() ?? "none";
  }
  destroy() {
    for (const id in this.chars) {
      this.chars[id].texture.destroy();
      this.chars[id].texture = null;
    }
    for (const id in this.pageTextures) {
      if (this._ownsTextures) {
        this.pageTextures[id].destroy(true);
      }
      this.pageTextures[id] = null;
    }
    this.chars = null;
    this.pageTextures = null;
  }
  static install(data, textures, ownsTextures) {
    let fontData;
    if (data instanceof BitmapFontData) {
      fontData = data;
    } else {
      const format2 = autoDetectFormat(data);
      if (!format2) {
        throw new Error("Unrecognized data format for font.");
      }
      fontData = format2.parse(data);
    }
    if (textures instanceof Texture) {
      textures = [textures];
    }
    const font = new _BitmapFont(fontData, textures, ownsTextures);
    _BitmapFont.available[font.font] = font;
    return font;
  }
  static uninstall(name) {
    const font = _BitmapFont.available[name];
    if (!font) {
      throw new Error(`No font found named '${name}'`);
    }
    font.destroy();
    delete _BitmapFont.available[name];
  }
  static from(name, textStyle, options) {
    if (!name) {
      throw new Error("[BitmapFont] Property `name` is required.");
    }
    const {
      chars,
      padding,
      resolution,
      textureWidth,
      textureHeight,
      ...baseOptions
    } = Object.assign({}, _BitmapFont.defaultOptions, options);
    const charsList = resolveCharacters(chars);
    const style = textStyle instanceof TextStyle ? textStyle : new TextStyle(textStyle);
    const lineWidth = textureWidth;
    const fontData = new BitmapFontData();
    fontData.info[0] = {
      face: style.fontFamily,
      size: style.fontSize
    };
    fontData.common[0] = {
      lineHeight: style.fontSize
    };
    let positionX = 0;
    let positionY = 0;
    let canvas;
    let context2;
    let baseTexture;
    let maxCharHeight = 0;
    const baseTextures = [];
    const textures = [];
    for (let i2 = 0; i2 < charsList.length; i2++) {
      if (!canvas) {
        canvas = settings.ADAPTER.createCanvas();
        canvas.width = textureWidth;
        canvas.height = textureHeight;
        context2 = canvas.getContext("2d");
        baseTexture = new BaseTexture(canvas, { resolution, ...baseOptions });
        baseTextures.push(baseTexture);
        textures.push(new Texture(baseTexture));
        fontData.page.push({
          id: textures.length - 1,
          file: ""
        });
      }
      const character = charsList[i2];
      const metrics = TextMetrics.measureText(character, style, false, canvas);
      const width = metrics.width;
      const height = Math.ceil(metrics.height);
      const textureGlyphWidth = Math.ceil((style.fontStyle === "italic" ? 2 : 1) * width);
      if (positionY >= textureHeight - height * resolution) {
        if (positionY === 0) {
          throw new Error(`[BitmapFont] textureHeight ${textureHeight}px is too small (fontFamily: '${style.fontFamily}', fontSize: ${style.fontSize}px, char: '${character}')`);
        }
        --i2;
        canvas = null;
        context2 = null;
        baseTexture = null;
        positionY = 0;
        positionX = 0;
        maxCharHeight = 0;
        continue;
      }
      maxCharHeight = Math.max(height + metrics.fontProperties.descent, maxCharHeight);
      if (textureGlyphWidth * resolution + positionX >= lineWidth) {
        if (positionX === 0) {
          throw new Error(`[BitmapFont] textureWidth ${textureWidth}px is too small (fontFamily: '${style.fontFamily}', fontSize: ${style.fontSize}px, char: '${character}')`);
        }
        --i2;
        positionY += maxCharHeight * resolution;
        positionY = Math.ceil(positionY);
        positionX = 0;
        maxCharHeight = 0;
        continue;
      }
      drawGlyph(canvas, context2, metrics, positionX, positionY, resolution, style);
      const id = extractCharCode(metrics.text);
      fontData.char.push({
        id,
        page: textures.length - 1,
        x: positionX / resolution,
        y: positionY / resolution,
        width: textureGlyphWidth,
        height,
        xoffset: 0,
        yoffset: 0,
        xadvance: width - (style.dropShadow ? style.dropShadowDistance : 0) - (style.stroke ? style.strokeThickness : 0)
      });
      positionX += (textureGlyphWidth + 2 * padding) * resolution;
      positionX = Math.ceil(positionX);
    }
    for (let i2 = 0, len = charsList.length; i2 < len; i2++) {
      const first = charsList[i2];
      for (let j3 = 0; j3 < len; j3++) {
        const second = charsList[j3];
        const c1 = context2.measureText(first).width;
        const c2 = context2.measureText(second).width;
        const total = context2.measureText(first + second).width;
        const amount = total - (c1 + c2);
        if (amount) {
          fontData.kerning.push({
            first: extractCharCode(first),
            second: extractCharCode(second),
            amount
          });
        }
      }
    }
    const font = new _BitmapFont(fontData, textures, true);
    if (_BitmapFont.available[name] !== void 0) {
      _BitmapFont.uninstall(name);
    }
    _BitmapFont.available[name] = font;
    return font;
  }
};
var BitmapFont = _BitmapFont;
BitmapFont.ALPHA = [["a", "z"], ["A", "Z"], " "];
BitmapFont.NUMERIC = [["0", "9"]];
BitmapFont.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "];
BitmapFont.ASCII = [[" ", "~"]];
BitmapFont.defaultOptions = {
  resolution: 1,
  textureWidth: 512,
  textureHeight: 512,
  padding: 4,
  chars: _BitmapFont.ALPHANUMERIC
};
BitmapFont.available = {};

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/shader/msdf.mjs
var msdfFrag = "// Pixi texture info\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\n// Tint\r\nuniform vec4 uColor;\r\n\r\n// on 2D applications fwidth is screenScale / glyphAtlasScale * distanceFieldRange\r\nuniform float uFWidth;\r\n\r\nvoid main(void) {\r\n\r\n  // To stack MSDF and SDF we need a non-pre-multiplied-alpha texture.\r\n  vec4 texColor = texture2D(uSampler, vTextureCoord);\r\n\r\n  // MSDF\r\n  float median = texColor.r + texColor.g + texColor.b -\r\n                  min(texColor.r, min(texColor.g, texColor.b)) -\r\n                  max(texColor.r, max(texColor.g, texColor.b));\r\n  // SDF\r\n  median = min(median, texColor.a);\r\n\r\n  float screenPxDistance = uFWidth * (median - 0.5);\r\n  float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);\r\n  if (median < 0.01) {\r\n    alpha = 0.0;\r\n  } else if (median > 0.99) {\r\n    alpha = 1.0;\r\n  }\r\n\r\n  // Gamma correction for coverage-like alpha\r\n  float luma = dot(uColor.rgb, vec3(0.299, 0.587, 0.114));\r\n  float gamma = mix(1.0, 1.0 / 2.2, luma);\r\n  float coverage = pow(uColor.a * alpha, gamma);  \r\n\r\n  // NPM Textures, NPM outputs\r\n  gl_FragColor = vec4(uColor.rgb, coverage);\r\n}\r\n";

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/shader/msdf2.mjs
var msdfVert = "// Mesh material default fragment\r\nattribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\nuniform mat3 translationMatrix;\r\nuniform mat3 uTextureMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n\r\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\r\n}\r\n";

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/BitmapText.mjs
var pageMeshDataDefaultPageMeshData = [];
var pageMeshDataMSDFPageMeshData = [];
var charRenderDataPool = [];
var _BitmapText = class extends Container {
  constructor(text, style = {}) {
    super();
    const { align, tint, maxWidth, letterSpacing, fontName, fontSize } = Object.assign({}, _BitmapText.styleDefaults, style);
    if (!BitmapFont.available[fontName]) {
      throw new Error(`Missing BitmapFont "${fontName}"`);
    }
    this._activePagesMeshData = [];
    this._textWidth = 0;
    this._textHeight = 0;
    this._align = align;
    this._tintColor = new Color(tint);
    this._font = void 0;
    this._fontName = fontName;
    this._fontSize = fontSize;
    this.text = text;
    this._maxWidth = maxWidth;
    this._maxLineHeight = 0;
    this._letterSpacing = letterSpacing;
    this._anchor = new ObservablePoint(() => {
      this.dirty = true;
    }, this, 0, 0);
    this._roundPixels = settings.ROUND_PIXELS;
    this.dirty = true;
    this._resolution = settings.RESOLUTION;
    this._autoResolution = true;
    this._textureCache = {};
  }
  updateText() {
    const data = BitmapFont.available[this._fontName];
    const fontSize = this.fontSize;
    const scale = fontSize / data.size;
    const pos = new Point();
    const chars = [];
    const lineWidths = [];
    const lineSpaces = [];
    const text = this._text.replace(/(?:\r\n|\r)/g, "\n") || " ";
    const charsInput = splitTextToCharacters(text);
    const maxWidth = this._maxWidth * data.size / fontSize;
    const pageMeshDataPool = data.distanceFieldType === "none" ? pageMeshDataDefaultPageMeshData : pageMeshDataMSDFPageMeshData;
    let prevCharCode = null;
    let lastLineWidth = 0;
    let maxLineWidth = 0;
    let line = 0;
    let lastBreakPos = -1;
    let lastBreakWidth = 0;
    let spacesRemoved = 0;
    let maxLineHeight = 0;
    let spaceCount = 0;
    for (let i2 = 0; i2 < charsInput.length; i2++) {
      const char = charsInput[i2];
      const charCode = extractCharCode(char);
      if (/(?:\s)/.test(char)) {
        lastBreakPos = i2;
        lastBreakWidth = lastLineWidth;
        spaceCount++;
      }
      if (char === "\r" || char === "\n") {
        lineWidths.push(lastLineWidth);
        lineSpaces.push(-1);
        maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
        ++line;
        ++spacesRemoved;
        pos.x = 0;
        pos.y += data.lineHeight;
        prevCharCode = null;
        spaceCount = 0;
        continue;
      }
      const charData = data.chars[charCode];
      if (!charData) {
        continue;
      }
      if (prevCharCode && charData.kerning[prevCharCode]) {
        pos.x += charData.kerning[prevCharCode];
      }
      const charRenderData = charRenderDataPool.pop() || {
        texture: Texture.EMPTY,
        line: 0,
        charCode: 0,
        prevSpaces: 0,
        position: new Point()
      };
      charRenderData.texture = charData.texture;
      charRenderData.line = line;
      charRenderData.charCode = charCode;
      charRenderData.position.x = Math.round(pos.x + charData.xOffset + this._letterSpacing / 2);
      charRenderData.position.y = Math.round(pos.y + charData.yOffset);
      charRenderData.prevSpaces = spaceCount;
      chars.push(charRenderData);
      lastLineWidth = charRenderData.position.x + Math.max(charData.xAdvance - charData.xOffset, charData.texture.orig.width);
      pos.x += charData.xAdvance + this._letterSpacing;
      maxLineHeight = Math.max(maxLineHeight, charData.yOffset + charData.texture.height);
      prevCharCode = charCode;
      if (lastBreakPos !== -1 && maxWidth > 0 && pos.x > maxWidth) {
        ++spacesRemoved;
        lib_exports.removeItems(chars, 1 + lastBreakPos - spacesRemoved, 1 + i2 - lastBreakPos);
        i2 = lastBreakPos;
        lastBreakPos = -1;
        lineWidths.push(lastBreakWidth);
        lineSpaces.push(chars.length > 0 ? chars[chars.length - 1].prevSpaces : 0);
        maxLineWidth = Math.max(maxLineWidth, lastBreakWidth);
        line++;
        pos.x = 0;
        pos.y += data.lineHeight;
        prevCharCode = null;
        spaceCount = 0;
      }
    }
    const lastChar = charsInput[charsInput.length - 1];
    if (lastChar !== "\r" && lastChar !== "\n") {
      if (/(?:\s)/.test(lastChar)) {
        lastLineWidth = lastBreakWidth;
      }
      lineWidths.push(lastLineWidth);
      maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
      lineSpaces.push(-1);
    }
    const lineAlignOffsets = [];
    for (let i2 = 0; i2 <= line; i2++) {
      let alignOffset = 0;
      if (this._align === "right") {
        alignOffset = maxLineWidth - lineWidths[i2];
      } else if (this._align === "center") {
        alignOffset = (maxLineWidth - lineWidths[i2]) / 2;
      } else if (this._align === "justify") {
        alignOffset = lineSpaces[i2] < 0 ? 0 : (maxLineWidth - lineWidths[i2]) / lineSpaces[i2];
      }
      lineAlignOffsets.push(alignOffset);
    }
    const lenChars = chars.length;
    const pagesMeshData = {};
    const newPagesMeshData = [];
    const activePagesMeshData = this._activePagesMeshData;
    pageMeshDataPool.push(...activePagesMeshData);
    for (let i2 = 0; i2 < lenChars; i2++) {
      const texture = chars[i2].texture;
      const baseTextureUid = texture.baseTexture.uid;
      if (!pagesMeshData[baseTextureUid]) {
        let pageMeshData = pageMeshDataPool.pop();
        if (!pageMeshData) {
          const geometry = new MeshGeometry();
          let material;
          let meshBlendMode;
          if (data.distanceFieldType === "none") {
            material = new MeshMaterial(Texture.EMPTY);
            meshBlendMode = BLEND_MODES.NORMAL;
          } else {
            material = new MeshMaterial(Texture.EMPTY, { program: Program.from(msdfVert, msdfFrag), uniforms: { uFWidth: 0 } });
            meshBlendMode = BLEND_MODES.NORMAL_NPM;
          }
          const mesh = new Mesh(geometry, material);
          mesh.blendMode = meshBlendMode;
          pageMeshData = {
            index: 0,
            indexCount: 0,
            vertexCount: 0,
            uvsCount: 0,
            total: 0,
            mesh,
            vertices: null,
            uvs: null,
            indices: null
          };
        }
        pageMeshData.index = 0;
        pageMeshData.indexCount = 0;
        pageMeshData.vertexCount = 0;
        pageMeshData.uvsCount = 0;
        pageMeshData.total = 0;
        const { _textureCache } = this;
        _textureCache[baseTextureUid] = _textureCache[baseTextureUid] || new Texture(texture.baseTexture);
        pageMeshData.mesh.texture = _textureCache[baseTextureUid];
        pageMeshData.mesh.tint = this._tintColor.value;
        newPagesMeshData.push(pageMeshData);
        pagesMeshData[baseTextureUid] = pageMeshData;
      }
      pagesMeshData[baseTextureUid].total++;
    }
    for (let i2 = 0; i2 < activePagesMeshData.length; i2++) {
      if (!newPagesMeshData.includes(activePagesMeshData[i2])) {
        this.removeChild(activePagesMeshData[i2].mesh);
      }
    }
    for (let i2 = 0; i2 < newPagesMeshData.length; i2++) {
      if (newPagesMeshData[i2].mesh.parent !== this) {
        this.addChild(newPagesMeshData[i2].mesh);
      }
    }
    this._activePagesMeshData = newPagesMeshData;
    for (const i2 in pagesMeshData) {
      const pageMeshData = pagesMeshData[i2];
      const total = pageMeshData.total;
      if (!(pageMeshData.indices?.length > 6 * total) || pageMeshData.vertices.length < Mesh.BATCHABLE_SIZE * 2) {
        pageMeshData.vertices = new Float32Array(4 * 2 * total);
        pageMeshData.uvs = new Float32Array(4 * 2 * total);
        pageMeshData.indices = new Uint16Array(6 * total);
      } else {
        const total2 = pageMeshData.total;
        const vertices = pageMeshData.vertices;
        for (let i22 = total2 * 4 * 2; i22 < vertices.length; i22++) {
          vertices[i22] = 0;
        }
      }
      pageMeshData.mesh.size = 6 * total;
    }
    for (let i2 = 0; i2 < lenChars; i2++) {
      const char = chars[i2];
      let offset = char.position.x + lineAlignOffsets[char.line] * (this._align === "justify" ? char.prevSpaces : 1);
      if (this._roundPixels) {
        offset = Math.round(offset);
      }
      const xPos = offset * scale;
      const yPos = char.position.y * scale;
      const texture = char.texture;
      const pageMesh = pagesMeshData[texture.baseTexture.uid];
      const textureFrame = texture.frame;
      const textureUvs = texture._uvs;
      const index = pageMesh.index++;
      pageMesh.indices[index * 6 + 0] = 0 + index * 4;
      pageMesh.indices[index * 6 + 1] = 1 + index * 4;
      pageMesh.indices[index * 6 + 2] = 2 + index * 4;
      pageMesh.indices[index * 6 + 3] = 0 + index * 4;
      pageMesh.indices[index * 6 + 4] = 2 + index * 4;
      pageMesh.indices[index * 6 + 5] = 3 + index * 4;
      pageMesh.vertices[index * 8 + 0] = xPos;
      pageMesh.vertices[index * 8 + 1] = yPos;
      pageMesh.vertices[index * 8 + 2] = xPos + textureFrame.width * scale;
      pageMesh.vertices[index * 8 + 3] = yPos;
      pageMesh.vertices[index * 8 + 4] = xPos + textureFrame.width * scale;
      pageMesh.vertices[index * 8 + 5] = yPos + textureFrame.height * scale;
      pageMesh.vertices[index * 8 + 6] = xPos;
      pageMesh.vertices[index * 8 + 7] = yPos + textureFrame.height * scale;
      pageMesh.uvs[index * 8 + 0] = textureUvs.x0;
      pageMesh.uvs[index * 8 + 1] = textureUvs.y0;
      pageMesh.uvs[index * 8 + 2] = textureUvs.x1;
      pageMesh.uvs[index * 8 + 3] = textureUvs.y1;
      pageMesh.uvs[index * 8 + 4] = textureUvs.x2;
      pageMesh.uvs[index * 8 + 5] = textureUvs.y2;
      pageMesh.uvs[index * 8 + 6] = textureUvs.x3;
      pageMesh.uvs[index * 8 + 7] = textureUvs.y3;
    }
    this._textWidth = maxLineWidth * scale;
    this._textHeight = (pos.y + data.lineHeight) * scale;
    for (const i2 in pagesMeshData) {
      const pageMeshData = pagesMeshData[i2];
      if (this.anchor.x !== 0 || this.anchor.y !== 0) {
        let vertexCount = 0;
        const anchorOffsetX = this._textWidth * this.anchor.x;
        const anchorOffsetY = this._textHeight * this.anchor.y;
        for (let i22 = 0; i22 < pageMeshData.total; i22++) {
          pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
          pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
          pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
          pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
          pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
          pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
          pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
          pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
        }
      }
      this._maxLineHeight = maxLineHeight * scale;
      const vertexBuffer = pageMeshData.mesh.geometry.getBuffer("aVertexPosition");
      const textureBuffer = pageMeshData.mesh.geometry.getBuffer("aTextureCoord");
      const indexBuffer = pageMeshData.mesh.geometry.getIndex();
      vertexBuffer.data = pageMeshData.vertices;
      textureBuffer.data = pageMeshData.uvs;
      indexBuffer.data = pageMeshData.indices;
      vertexBuffer.update();
      textureBuffer.update();
      indexBuffer.update();
    }
    for (let i2 = 0; i2 < chars.length; i2++) {
      charRenderDataPool.push(chars[i2]);
    }
    this._font = data;
    this.dirty = false;
  }
  updateTransform() {
    this.validate();
    this.containerUpdateTransform();
  }
  _render(renderer) {
    if (this._autoResolution && this._resolution !== renderer.resolution) {
      this._resolution = renderer.resolution;
      this.dirty = true;
    }
    const { distanceFieldRange, distanceFieldType, size } = BitmapFont.available[this._fontName];
    if (distanceFieldType !== "none") {
      const { a: a2, b: b3, c: c2, d: d2 } = this.worldTransform;
      const dx = Math.sqrt(a2 * a2 + b3 * b3);
      const dy = Math.sqrt(c2 * c2 + d2 * d2);
      const worldScale = (Math.abs(dx) + Math.abs(dy)) / 2;
      const fontScale = this.fontSize / size;
      const resolution = renderer._view.resolution;
      for (const mesh of this._activePagesMeshData) {
        mesh.mesh.shader.uniforms.uFWidth = worldScale * distanceFieldRange * fontScale * resolution;
      }
    }
    super._render(renderer);
  }
  getLocalBounds() {
    this.validate();
    return super.getLocalBounds();
  }
  validate() {
    const font = BitmapFont.available[this._fontName];
    if (!font) {
      throw new Error(`Missing BitmapFont "${this._fontName}"`);
    }
    if (this._font !== font) {
      this.dirty = true;
    }
    if (this.dirty) {
      this.updateText();
    }
  }
  get tint() {
    return this._tintColor.value;
  }
  set tint(value) {
    if (this.tint === value)
      return;
    this._tintColor.setValue(value);
    for (let i2 = 0; i2 < this._activePagesMeshData.length; i2++) {
      this._activePagesMeshData[i2].mesh.tint = value;
    }
  }
  get align() {
    return this._align;
  }
  set align(value) {
    if (this._align !== value) {
      this._align = value;
      this.dirty = true;
    }
  }
  get fontName() {
    return this._fontName;
  }
  set fontName(value) {
    if (!BitmapFont.available[value]) {
      throw new Error(`Missing BitmapFont "${value}"`);
    }
    if (this._fontName !== value) {
      this._fontName = value;
      this.dirty = true;
    }
  }
  get fontSize() {
    return this._fontSize ?? BitmapFont.available[this._fontName].size;
  }
  set fontSize(value) {
    if (this._fontSize !== value) {
      this._fontSize = value;
      this.dirty = true;
    }
  }
  get anchor() {
    return this._anchor;
  }
  set anchor(value) {
    if (typeof value === "number") {
      this._anchor.set(value);
    } else {
      this._anchor.copyFrom(value);
    }
  }
  get text() {
    return this._text;
  }
  set text(text) {
    text = String(text === null || text === void 0 ? "" : text);
    if (this._text === text) {
      return;
    }
    this._text = text;
    this.dirty = true;
  }
  get maxWidth() {
    return this._maxWidth;
  }
  set maxWidth(value) {
    if (this._maxWidth === value) {
      return;
    }
    this._maxWidth = value;
    this.dirty = true;
  }
  get maxLineHeight() {
    this.validate();
    return this._maxLineHeight;
  }
  get textWidth() {
    this.validate();
    return this._textWidth;
  }
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(value) {
    if (this._letterSpacing !== value) {
      this._letterSpacing = value;
      this.dirty = true;
    }
  }
  get roundPixels() {
    return this._roundPixels;
  }
  set roundPixels(value) {
    if (value !== this._roundPixels) {
      this._roundPixels = value;
      this.dirty = true;
    }
  }
  get textHeight() {
    this.validate();
    return this._textHeight;
  }
  get resolution() {
    return this._resolution;
  }
  set resolution(value) {
    this._autoResolution = false;
    if (this._resolution === value) {
      return;
    }
    this._resolution = value;
    this.dirty = true;
  }
  destroy(options) {
    const { _textureCache } = this;
    const data = BitmapFont.available[this._fontName];
    const pageMeshDataPool = data.distanceFieldType === "none" ? pageMeshDataDefaultPageMeshData : pageMeshDataMSDFPageMeshData;
    pageMeshDataPool.push(...this._activePagesMeshData);
    for (const pageMeshData of this._activePagesMeshData) {
      this.removeChild(pageMeshData.mesh);
    }
    this._activePagesMeshData = [];
    pageMeshDataPool.filter((page) => _textureCache[page.mesh.texture.baseTexture.uid]).forEach((page) => {
      page.mesh.texture = Texture.EMPTY;
    });
    for (const id in _textureCache) {
      const texture = _textureCache[id];
      texture.destroy();
      delete _textureCache[id];
    }
    this._font = null;
    this._tintColor = null;
    this._textureCache = null;
    super.destroy(options);
  }
};
var BitmapText = _BitmapText;
BitmapText.styleDefaults = {
  align: "left",
  tint: 16777215,
  maxWidth: 0,
  letterSpacing: 0
};

// ../../node_modules/.pnpm/@pixi+text-bitmap@7.2.4_dsi4gm5h5qzs5nunlxaa2p7fmq/node_modules/@pixi/text-bitmap/lib/loadBitmapFont.mjs
var validExtensions = [".xml", ".fnt"];
var loadBitmapFont = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Normal
  },
  name: "loadBitmapFont",
  test(url2) {
    return validExtensions.includes(lib_exports.path.extname(url2).toLowerCase());
  },
  async testParse(data) {
    return TextFormat.test(data) || XMLStringFormat.test(data);
  },
  async parse(asset, data, loader) {
    const fontData = TextFormat.test(asset) ? TextFormat.parse(asset) : XMLStringFormat.parse(asset);
    const { src } = data;
    const { page: pages } = fontData;
    const textureUrls = [];
    for (let i2 = 0; i2 < pages.length; ++i2) {
      const pageFile = pages[i2].file;
      let imagePath = lib_exports.path.join(lib_exports.path.dirname(src), pageFile);
      imagePath = copySearchParams(imagePath, src);
      textureUrls.push(imagePath);
    }
    const loadedTextures = await loader.load(textureUrls);
    const textures = textureUrls.map((url2) => loadedTextures[url2]);
    return BitmapFont.install(fontData, textures, true);
  },
  async load(url2, _options) {
    const response = await settings.ADAPTER.fetch(url2);
    return response.text();
  },
  unload(bitmapFont) {
    bitmapFont.destroy();
  }
};
extensions.add(loadBitmapFont);

// ../../node_modules/.pnpm/@pixi+text-html@7.2.4_pfkygx3sh74zn4sfwd3cwz7as4/node_modules/@pixi/text-html/lib/HTMLTextStyle.mjs
var _HTMLTextStyle = class extends TextStyle {
  constructor() {
    super(...arguments);
    this._fonts = [];
    this._overrides = [];
    this._stylesheet = "";
    this.fontsDirty = false;
  }
  static from(originalStyle) {
    return new _HTMLTextStyle(Object.keys(_HTMLTextStyle.defaultOptions).reduce((obj, prop) => ({ ...obj, [prop]: originalStyle[prop] }), {}));
  }
  cleanFonts() {
    if (this._fonts.length > 0) {
      this._fonts.forEach((font) => {
        URL.revokeObjectURL(font.src);
        font.refs--;
        if (font.refs === 0) {
          if (font.fontFace) {
            document.fonts.delete(font.fontFace);
          }
          delete _HTMLTextStyle.availableFonts[font.originalUrl];
        }
      });
      this.fontFamily = "Arial";
      this._fonts.length = 0;
      this.styleID++;
      this.fontsDirty = true;
    }
  }
  loadFont(url2, options = {}) {
    const { availableFonts } = _HTMLTextStyle;
    if (availableFonts[url2]) {
      const font = availableFonts[url2];
      this._fonts.push(font);
      font.refs++;
      this.styleID++;
      this.fontsDirty = true;
      return Promise.resolve();
    }
    return settings.ADAPTER.fetch(url2).then((response) => response.blob()).then(async (blob) => new Promise((resolve2, reject) => {
      const src = URL.createObjectURL(blob);
      const reader = new FileReader();
      reader.onload = () => resolve2([src, reader.result]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    })).then(async ([src, dataSrc]) => {
      const font = Object.assign({
        family: lib_exports.path.basename(url2, lib_exports.path.extname(url2)),
        weight: "normal",
        style: "normal",
        src,
        dataSrc,
        refs: 1,
        originalUrl: url2,
        fontFace: null
      }, options);
      availableFonts[url2] = font;
      this._fonts.push(font);
      this.styleID++;
      const fontFace = new FontFace(font.family, `url(${font.src})`, {
        weight: font.weight,
        style: font.style
      });
      font.fontFace = fontFace;
      await fontFace.load();
      document.fonts.add(fontFace);
      await document.fonts.ready;
      this.styleID++;
      this.fontsDirty = true;
    });
  }
  addOverride(...value) {
    const toAdd = value.filter((v2) => !this._overrides.includes(v2));
    if (toAdd.length > 0) {
      this._overrides.push(...toAdd);
      this.styleID++;
    }
  }
  removeOverride(...value) {
    const toRemove = value.filter((v2) => this._overrides.includes(v2));
    if (toRemove.length > 0) {
      this._overrides = this._overrides.filter((v2) => !toRemove.includes(v2));
      this.styleID++;
    }
  }
  toCSS(scale) {
    return [
      `transform: scale(${scale})`,
      `transform-origin: top left`,
      "display: inline-block",
      `color: ${this.normalizeColor(this.fill)}`,
      `font-size: ${this.fontSize}px`,
      `font-family: ${this.fontFamily}`,
      `font-weight: ${this.fontWeight}`,
      `font-style: ${this.fontStyle}`,
      `font-variant: ${this.fontVariant}`,
      `letter-spacing: ${this.letterSpacing}px`,
      `text-align: ${this.align}`,
      `padding: ${this.padding}px`,
      `white-space: ${this.whiteSpace}`,
      ...this.lineHeight ? [`line-height: ${this.lineHeight}px`] : [],
      ...this.wordWrap ? [
        `word-wrap: ${this.breakWords ? "break-all" : "break-word"}`,
        `max-width: ${this.wordWrapWidth}px`
      ] : [],
      ...this.strokeThickness ? [
        `-webkit-text-stroke-width: ${this.strokeThickness}px`,
        `-webkit-text-stroke-color: ${this.normalizeColor(this.stroke)}`,
        `text-stroke-width: ${this.strokeThickness}px`,
        `text-stroke-color: ${this.normalizeColor(this.stroke)}`,
        "paint-order: stroke"
      ] : [],
      ...this.dropShadow ? [this.dropShadowToCSS()] : [],
      ...this._overrides
    ].join(";");
  }
  toGlobalCSS() {
    return this._fonts.reduce((result, font) => `${result}
            @font-face {
                font-family: "${font.family}";
                src: url('${font.dataSrc}');
                font-weight: ${font.weight};
                font-style: ${font.style}; 
            }`, this._stylesheet);
  }
  get stylesheet() {
    return this._stylesheet;
  }
  set stylesheet(value) {
    if (this._stylesheet !== value) {
      this._stylesheet = value;
      this.styleID++;
    }
  }
  normalizeColor(color) {
    if (Array.isArray(color)) {
      color = lib_exports.rgb2hex(color);
    }
    if (typeof color === "number") {
      return lib_exports.hex2string(color);
    }
    return color;
  }
  dropShadowToCSS() {
    let color = this.normalizeColor(this.dropShadowColor);
    const alpha = this.dropShadowAlpha;
    const x2 = Math.round(Math.cos(this.dropShadowAngle) * this.dropShadowDistance);
    const y2 = Math.round(Math.sin(this.dropShadowAngle) * this.dropShadowDistance);
    if (color.startsWith("#") && alpha < 1) {
      color += (alpha * 255 | 0).toString(16).padStart(2, "0");
    }
    const position = `${x2}px ${y2}px`;
    if (this.dropShadowBlur > 0) {
      return `text-shadow: ${position} ${this.dropShadowBlur}px ${color}`;
    }
    return `text-shadow: ${position} ${color}`;
  }
  reset() {
    Object.assign(this, _HTMLTextStyle.defaultOptions);
  }
  onBeforeDraw() {
    const { fontsDirty: prevFontsDirty } = this;
    this.fontsDirty = false;
    if (this.isSafari && this._fonts.length > 0 && prevFontsDirty) {
      return new Promise((resolve2) => setTimeout(resolve2, 100));
    }
    return Promise.resolve();
  }
  get isSafari() {
    const { userAgent } = settings.ADAPTER.getNavigator();
    return /^((?!chrome|android).)*safari/i.test(userAgent);
  }
  set fillGradientStops(_value) {
    console.warn("[HTMLTextStyle] fillGradientStops is not supported by HTMLText");
  }
  get fillGradientStops() {
    return super.fillGradientStops;
  }
  set fillGradientType(_value) {
    console.warn("[HTMLTextStyle] fillGradientType is not supported by HTMLText");
  }
  get fillGradientType() {
    return super.fillGradientType;
  }
  set miterLimit(_value) {
    console.warn("[HTMLTextStyle] miterLimit is not supported by HTMLText");
  }
  get miterLimit() {
    return super.miterLimit;
  }
  set trim(_value) {
    console.warn("[HTMLTextStyle] trim is not supported by HTMLText");
  }
  get trim() {
    return super.trim;
  }
  set textBaseline(_value) {
    console.warn("[HTMLTextStyle] textBaseline is not supported by HTMLText");
  }
  get textBaseline() {
    return super.textBaseline;
  }
  set leading(_value) {
    console.warn("[HTMLTextStyle] leading is not supported by HTMLText");
  }
  get leading() {
    return super.leading;
  }
  set lineJoin(_value) {
    console.warn("[HTMLTextStyle] lineJoin is not supported by HTMLText");
  }
  get lineJoin() {
    return super.lineJoin;
  }
};
var HTMLTextStyle = _HTMLTextStyle;
HTMLTextStyle.availableFonts = {};
HTMLTextStyle.defaultOptions = {
  align: "left",
  breakWords: false,
  dropShadow: false,
  dropShadowAlpha: 1,
  dropShadowAngle: Math.PI / 6,
  dropShadowBlur: 0,
  dropShadowColor: "black",
  dropShadowDistance: 5,
  fill: "black",
  fontFamily: "Arial",
  fontSize: 26,
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "normal",
  letterSpacing: 0,
  lineHeight: 0,
  padding: 0,
  stroke: "black",
  strokeThickness: 0,
  whiteSpace: "normal",
  wordWrap: false,
  wordWrapWidth: 100
};

// ../../node_modules/.pnpm/@pixi+text-html@7.2.4_pfkygx3sh74zn4sfwd3cwz7as4/node_modules/@pixi/text-html/lib/HTMLText.mjs
var _HTMLText = class extends Sprite {
  constructor(text = "", style = {}) {
    super(Texture.EMPTY);
    this._text = null;
    this._style = null;
    this._autoResolution = true;
    this._loading = false;
    this.localStyleID = -1;
    this.dirty = false;
    this.ownsStyle = false;
    const image = new Image();
    const texture = Texture.from(image, {
      scaleMode: settings.SCALE_MODE,
      resourceOptions: {
        autoLoad: false
      }
    });
    texture.orig = new Rectangle();
    texture.trim = new Rectangle();
    this.texture = texture;
    const nssvg = "http://www.w3.org/2000/svg";
    const nsxhtml = "http://www.w3.org/1999/xhtml";
    const svgRoot = document.createElementNS(nssvg, "svg");
    const foreignObject = document.createElementNS(nssvg, "foreignObject");
    const domElement = document.createElementNS(nsxhtml, "div");
    const styleElement = document.createElementNS(nsxhtml, "style");
    foreignObject.setAttribute("width", "10000");
    foreignObject.setAttribute("height", "10000");
    foreignObject.style.overflow = "hidden";
    svgRoot.appendChild(foreignObject);
    this.maxWidth = _HTMLText.defaultMaxWidth;
    this.maxHeight = _HTMLText.defaultMaxHeight;
    this._domElement = domElement;
    this._styleElement = styleElement;
    this._svgRoot = svgRoot;
    this._foreignObject = foreignObject;
    this._foreignObject.appendChild(styleElement);
    this._foreignObject.appendChild(domElement);
    this._image = image;
    this._loadImage = new Image();
    this._autoResolution = _HTMLText.defaultAutoResolution;
    this._resolution = _HTMLText.defaultResolution ?? settings.RESOLUTION;
    this.text = text;
    this.style = style;
  }
  measureText(overrides) {
    const { text, style, resolution } = Object.assign({
      text: this._text,
      style: this._style,
      resolution: this._resolution
    }, overrides);
    Object.assign(this._domElement, {
      innerHTML: text,
      style: style.toCSS(resolution)
    });
    this._styleElement.textContent = style.toGlobalCSS();
    document.body.appendChild(this._svgRoot);
    const contentBounds = this._domElement.getBoundingClientRect();
    this._svgRoot.remove();
    const contentWidth = Math.min(this.maxWidth, Math.ceil(contentBounds.width));
    const contentHeight = Math.min(this.maxHeight, Math.ceil(contentBounds.height));
    this._svgRoot.setAttribute("width", contentWidth.toString());
    this._svgRoot.setAttribute("height", contentHeight.toString());
    if (text !== this._text) {
      this._domElement.innerHTML = this._text;
    }
    if (style !== this._style) {
      Object.assign(this._domElement, { style: this._style?.toCSS(resolution) });
      this._styleElement.textContent = this._style?.toGlobalCSS();
    }
    return {
      width: contentWidth + style.padding * 2,
      height: contentHeight + style.padding * 2
    };
  }
  async updateText(respectDirty = true) {
    const { style, _image: image, _loadImage: loadImage } = this;
    if (this.localStyleID !== style.styleID) {
      this.dirty = true;
      this.localStyleID = style.styleID;
    }
    if (!this.dirty && respectDirty) {
      return;
    }
    const { width, height } = this.measureText();
    image.width = loadImage.width = Math.ceil(Math.max(1, width));
    image.height = loadImage.height = Math.ceil(Math.max(1, height));
    if (!this._loading) {
      this._loading = true;
      await new Promise((resolve2) => {
        loadImage.onload = async () => {
          await style.onBeforeDraw();
          this._loading = false;
          image.src = loadImage.src;
          loadImage.onload = null;
          loadImage.src = "";
          this.updateTexture();
          resolve2();
        };
        const svgURL = new XMLSerializer().serializeToString(this._svgRoot);
        loadImage.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(svgURL)}`;
      });
    }
  }
  get source() {
    return this._image;
  }
  updateTexture() {
    const { style, texture, _image: image, resolution } = this;
    const { padding } = style;
    const { baseTexture } = texture;
    texture.trim.width = texture._frame.width = image.width / resolution;
    texture.trim.height = texture._frame.height = image.height / resolution;
    texture.trim.x = -padding;
    texture.trim.y = -padding;
    texture.orig.width = texture._frame.width - padding * 2;
    texture.orig.height = texture._frame.height - padding * 2;
    this._onTextureUpdate();
    baseTexture.setRealSize(image.width, image.height, resolution);
    this.dirty = false;
  }
  _render(renderer) {
    if (this._autoResolution && this._resolution !== renderer.resolution) {
      this._resolution = renderer.resolution;
      this.dirty = true;
    }
    this.updateText(true);
    super._render(renderer);
  }
  _renderCanvas(renderer) {
    if (this._autoResolution && this._resolution !== renderer.resolution) {
      this._resolution = renderer.resolution;
      this.dirty = true;
    }
    this.updateText(true);
    super._renderCanvas(renderer);
  }
  getLocalBounds(rect) {
    this.updateText(true);
    return super.getLocalBounds(rect);
  }
  _calculateBounds() {
    this.updateText(true);
    this.calculateVertices();
    this._bounds.addQuad(this.vertexData);
  }
  _onStyleChange() {
    this.dirty = true;
  }
  destroy(options) {
    if (typeof options === "boolean") {
      options = { children: options };
    }
    options = Object.assign({}, _HTMLText.defaultDestroyOptions, options);
    super.destroy(options);
    const forceClear = null;
    if (this.ownsStyle) {
      this._style?.cleanFonts();
    }
    this._style = forceClear;
    this._svgRoot?.remove();
    this._svgRoot = forceClear;
    this._domElement?.remove();
    this._domElement = forceClear;
    this._foreignObject?.remove();
    this._foreignObject = forceClear;
    this._styleElement?.remove();
    this._styleElement = forceClear;
    this._loadImage.src = "";
    this._loadImage.onload = null;
    this._loadImage = forceClear;
    this._image.src = "";
    this._image = forceClear;
  }
  get width() {
    this.updateText(true);
    return Math.abs(this.scale.x) * this._image.width / this.resolution;
  }
  set width(value) {
    this.updateText(true);
    const s2 = lib_exports.sign(this.scale.x) || 1;
    this.scale.x = s2 * value / this._image.width / this.resolution;
    this._width = value;
  }
  get height() {
    this.updateText(true);
    return Math.abs(this.scale.y) * this._image.height / this.resolution;
  }
  set height(value) {
    this.updateText(true);
    const s2 = lib_exports.sign(this.scale.y) || 1;
    this.scale.y = s2 * value / this._image.height / this.resolution;
    this._height = value;
  }
  get style() {
    return this._style;
  }
  set style(style) {
    if (this._style === style) {
      return;
    }
    style = style || {};
    if (style instanceof HTMLTextStyle) {
      this.ownsStyle = false;
      this._style = style;
    } else if (style instanceof TextStyle) {
      console.warn("[HTMLText] Cloning TextStyle, if this is not what you want, use HTMLTextStyle");
      this.ownsStyle = true;
      this._style = HTMLTextStyle.from(style);
    } else {
      this.ownsStyle = true;
      this._style = new HTMLTextStyle(style);
    }
    this.localStyleID = -1;
    this.dirty = true;
  }
  get text() {
    return this._text;
  }
  set text(text) {
    text = String(text === "" || text === null || text === void 0 ? " " : text);
    text = this.sanitiseText(text);
    if (this._text === text) {
      return;
    }
    this._text = text;
    this.dirty = true;
  }
  get resolution() {
    return this._resolution;
  }
  set resolution(value) {
    this._autoResolution = false;
    if (this._resolution === value) {
      return;
    }
    this._resolution = value;
    this.dirty = true;
  }
  sanitiseText(text) {
    return text.replace(/<br>/gi, "<br/>").replace(/<hr>/gi, "<hr/>").replace(/&nbsp;/gi, "&#160;");
  }
};
var HTMLText = _HTMLText;
HTMLText.defaultDestroyOptions = {
  texture: true,
  children: false,
  baseTexture: true
};
HTMLText.defaultMaxWidth = 2024;
HTMLText.defaultMaxHeight = 2024;
HTMLText.defaultAutoResolution = true;

// src/lib/assets.ts
var loadedAssets = {};
async function loadAssets() {
  const sheet = await Assets.load("stars.json");
  const planetsheet = await Assets.load("planets.json");
  const uisheet = await Assets.load("uisheet.json");
  const font = await Assets.load("font.fnt");
  const buttonText = await Assets.load("buttontext.fnt");
  const bgTexture = await Assets.load("starfield.png");
  const navArrow = await Assets.load("navarrow.png");
  const starTexture = await Assets.load("stars.png");
  const shipyard = await Assets.load("shipyard.png");
  const market = await Assets.load("money-bag-xxl.png");
  const spaceshipTexture = await Assets.load("spaceship.png");
  loadedAssets = {
    sheet,
    planetsheet,
    uisheet,
    font,
    buttonText,
    bgTexture,
    navArrow,
    starTexture,
    spaceshipTexture,
    shipyard,
    market,
    panel: await Assets.load("ui/panel.png"),
    button: await Assets.load("ui/button.png"),
    panelBg: await Assets.load("ui/panelbg.png")
  };
}

// ../../node_modules/.pnpm/@trpc+server@10.25.1/node_modules/@trpc/server/dist/observable-ade1bad8.mjs
function identity(x2) {
  return x2;
}
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce((prev, fn) => fn(prev), input);
  };
}
function observable(subscribe) {
  const self2 = {
    subscribe(observer) {
      let teardownRef = null;
      let isDone = false;
      let unsubscribed = false;
      let teardownImmediately = false;
      function unsubscribe() {
        if (teardownRef === null) {
          teardownImmediately = true;
          return;
        }
        if (unsubscribed) {
          return;
        }
        unsubscribed = true;
        if (typeof teardownRef === "function") {
          teardownRef();
        } else if (teardownRef) {
          teardownRef.unsubscribe();
        }
      }
      teardownRef = subscribe({
        next(value) {
          if (isDone) {
            return;
          }
          observer.next?.(value);
        },
        error(err) {
          if (isDone) {
            return;
          }
          isDone = true;
          observer.error?.(err);
          unsubscribe();
        },
        complete() {
          if (isDone) {
            return;
          }
          isDone = true;
          observer.complete?.();
          unsubscribe();
        }
      });
      if (teardownImmediately) {
        unsubscribe();
      }
      return {
        unsubscribe
      };
    },
    pipe(...operations) {
      return pipeFromArray(operations)(self2);
    }
  };
  return self2;
}

// ../../node_modules/.pnpm/@trpc+server@10.25.1/node_modules/@trpc/server/dist/observable/index.mjs
function share(_opts) {
  return (originalObserver) => {
    let refCount = 0;
    let subscription = null;
    const observers = [];
    function startIfNeeded() {
      if (subscription) {
        return;
      }
      subscription = originalObserver.subscribe({
        next(value) {
          for (const observer of observers) {
            observer.next?.(value);
          }
        },
        error(error) {
          for (const observer of observers) {
            observer.error?.(error);
          }
        },
        complete() {
          for (const observer of observers) {
            observer.complete?.();
          }
        }
      });
    }
    function resetIfNeeded() {
      if (refCount === 0 && subscription) {
        const _sub = subscription;
        subscription = null;
        _sub.unsubscribe();
      }
    }
    return {
      subscribe(observer) {
        refCount++;
        observers.push(observer);
        startIfNeeded();
        return {
          unsubscribe() {
            refCount--;
            resetIfNeeded();
            const index = observers.findIndex((v2) => v2 === observer);
            if (index > -1) {
              observers.splice(index, 1);
            }
          }
        };
      }
    };
  };
}
var ObservableAbortError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ObservableAbortError";
    Object.setPrototypeOf(this, ObservableAbortError.prototype);
  }
};
function observableToPromise(observable2) {
  let abort;
  const promise = new Promise((resolve2, reject) => {
    let isDone = false;
    function onDone() {
      if (isDone) {
        return;
      }
      isDone = true;
      reject(new ObservableAbortError("This operation was aborted."));
      obs$.unsubscribe();
    }
    const obs$ = observable2.subscribe({
      next(data) {
        isDone = true;
        resolve2(data);
        onDone();
      },
      error(data) {
        isDone = true;
        reject(data);
        onDone();
      },
      complete() {
        isDone = true;
        onDone();
      }
    });
    abort = onDone;
  });
  return {
    promise,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    abort
  };
}

// ../../node_modules/.pnpm/@trpc+client@10.25.1_@trpc+server@10.25.1/node_modules/@trpc/client/dist/transformResult-a4d3dad0.mjs
var TRPCClientError = class extends Error {
  static from(cause, opts = {}) {
    if (!(cause instanceof Error)) {
      return new TRPCClientError(cause.error.message ?? "", {
        ...opts,
        cause: void 0,
        result: cause
      });
    }
    if (cause.name === "TRPCClientError") {
      return cause;
    }
    return new TRPCClientError(cause.message, {
      ...opts,
      cause,
      result: null
    });
  }
  constructor(message, opts) {
    const cause = opts?.cause;
    super(message, {
      cause
    });
    this.meta = opts?.meta;
    this.cause = cause;
    this.shape = opts?.result?.error;
    this.data = opts?.result?.error.data;
    this.name = "TRPCClientError";
    Object.setPrototypeOf(this, TRPCClientError.prototype);
  }
};
function isObject(value) {
  return !!value && !Array.isArray(value) && typeof value === "object";
}
function transformResultInner(response, runtime) {
  if ("error" in response) {
    const error = runtime.transformer.deserialize(response.error);
    return {
      ok: false,
      error: {
        ...response,
        error
      }
    };
  }
  const result = {
    ...response.result,
    ...(!response.result.type || response.result.type === "data") && {
      type: "data",
      data: runtime.transformer.deserialize(response.result.data)
    }
  };
  return {
    ok: true,
    result
  };
}
function transformResult(response, runtime) {
  let result;
  try {
    result = transformResultInner(response, runtime);
  } catch (err) {
    throw new TRPCClientError("Unable to transform response from server");
  }
  if (!result.ok && (!isObject(result.error.error) || typeof result.error.error.code !== "number")) {
    throw new TRPCClientError("Badly formatted response from server");
  }
  if (result.ok && !isObject(result.result)) {
    throw new TRPCClientError("Badly formatted response from server");
  }
  return result;
}

// ../../node_modules/.pnpm/@trpc+client@10.25.1_@trpc+server@10.25.1/node_modules/@trpc/client/dist/splitLink-4c75f7be.mjs
function createChain(opts) {
  return observable((observer) => {
    function execute(index = 0, op = opts.op) {
      const next = opts.links[index];
      if (!next) {
        throw new Error("No more links to execute - did you forget to add an ending link?");
      }
      const subscription = next({
        op,
        next(nextOp) {
          const nextObserver = execute(index + 1, nextOp);
          return nextObserver;
        }
      });
      return subscription;
    }
    const obs$ = execute();
    return obs$.subscribe(observer);
  });
}

// ../../node_modules/.pnpm/@trpc+server@10.25.1/node_modules/@trpc/server/dist/index-972002da.mjs
var noop = () => {
};
function createInnerProxy(callback, path2) {
  const proxy = new Proxy(noop, {
    get(_obj, key) {
      if (typeof key !== "string" || key === "then") {
        return void 0;
      }
      return createInnerProxy(callback, [
        ...path2,
        key
      ]);
    },
    apply(_1, _2, args) {
      return callback({
        args,
        path: path2
      });
    }
  });
  return proxy;
}
var createRecursiveProxy = (callback) => createInnerProxy(callback, []);
var createFlatProxy = (callback) => {
  return new Proxy(noop, {
    get(_obj, name) {
      if (typeof name !== "string" || name === "then") {
        return void 0;
      }
      return callback(name);
    }
  });
};

// ../../node_modules/.pnpm/@trpc+client@10.25.1_@trpc+server@10.25.1/node_modules/@trpc/client/dist/httpUtils-8a5c637a.mjs
var isFunction = (fn) => typeof fn === "function";
function _bind(fn, thisArg) {
  return isFunction(fn.bind) ? fn.bind(thisArg) : fn;
}
function getFetch(customFetchImpl) {
  if (customFetchImpl) {
    return customFetchImpl;
  }
  if (typeof window !== "undefined" && isFunction(window.fetch)) {
    return _bind(window.fetch, window);
  }
  if (typeof globalThis !== "undefined" && isFunction(globalThis.fetch)) {
    return _bind(globalThis.fetch, globalThis);
  }
  throw new Error("No fetch implementation found");
}
function getAbortController(customAbortControllerImpl) {
  if (customAbortControllerImpl) {
    return customAbortControllerImpl;
  }
  if (typeof window !== "undefined" && window.AbortController) {
    return window.AbortController;
  }
  if (typeof globalThis !== "undefined" && globalThis.AbortController) {
    return globalThis.AbortController;
  }
  return null;
}
function resolveHTTPLinkOptions(opts) {
  return {
    url: opts.url,
    fetch: getFetch(opts.fetch),
    AbortController: getAbortController(opts.AbortController)
  };
}
function arrayToDict(array) {
  const dict = {};
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    dict[index] = element;
  }
  return dict;
}
var METHOD = {
  query: "GET",
  mutation: "POST"
};
function getInput(opts) {
  return "input" in opts ? opts.runtime.transformer.serialize(opts.input) : arrayToDict(opts.inputs.map((_input) => opts.runtime.transformer.serialize(_input)));
}
var getUrl = (opts) => {
  let url2 = opts.url + "/" + opts.path;
  const queryParts = [];
  if ("inputs" in opts) {
    queryParts.push("batch=1");
  }
  if (opts.type === "query") {
    const input = getInput(opts);
    if (input !== void 0) {
      queryParts.push(`input=${encodeURIComponent(JSON.stringify(input))}`);
    }
  }
  if (queryParts.length) {
    url2 += "?" + queryParts.join("&");
  }
  return url2;
};
var getBody = (opts) => {
  if (opts.type === "query") {
    return void 0;
  }
  const input = getInput(opts);
  return input !== void 0 ? JSON.stringify(input) : void 0;
};
var jsonHttpRequester = (opts) => {
  return httpRequest({
    ...opts,
    contentTypeHeader: "application/json",
    getUrl,
    getBody
  });
};
function httpRequest(opts) {
  const { type } = opts;
  const ac = opts.AbortController ? new opts.AbortController() : null;
  const promise = new Promise((resolve2, reject) => {
    const url2 = opts.getUrl(opts);
    const body = opts.getBody(opts);
    const meta = {};
    Promise.resolve(opts.headers()).then((headers) => {
      if (type === "subscription") {
        throw new Error("Subscriptions should use wsLink");
      }
      return opts.fetch(url2, {
        method: METHOD[type],
        signal: ac?.signal,
        body,
        headers: {
          ...opts.contentTypeHeader ? {
            "content-type": opts.contentTypeHeader
          } : {},
          ...headers
        }
      });
    }).then((_res) => {
      meta.response = _res;
      return _res.json();
    }).then((json) => {
      resolve2({
        json,
        meta
      });
    }).catch(reject);
  });
  const cancel = () => {
    ac?.abort();
  };
  return {
    promise,
    cancel
  };
}

// ../../node_modules/.pnpm/@trpc+client@10.25.1_@trpc+server@10.25.1/node_modules/@trpc/client/dist/links/httpBatchLink.mjs
var throwFatalError = () => {
  throw new Error("Something went wrong. Please submit an issue at https://github.com/trpc/trpc/issues/new");
};
function dataLoader(batchLoader) {
  let pendingItems = null;
  let dispatchTimer = null;
  const destroyTimerAndPendingItems = () => {
    clearTimeout(dispatchTimer);
    dispatchTimer = null;
    pendingItems = null;
  };
  function groupItems(items) {
    const groupedItems = [
      []
    ];
    let index = 0;
    while (true) {
      const item = items[index];
      if (!item) {
        break;
      }
      const lastGroup = groupedItems[groupedItems.length - 1];
      if (item.aborted) {
        item.reject(new Error("Aborted"));
        index++;
        continue;
      }
      const isValid = batchLoader.validate(lastGroup.concat(item).map((it) => it.key));
      if (isValid) {
        lastGroup.push(item);
        index++;
        continue;
      }
      if (lastGroup.length === 0) {
        item.reject(new Error("Input is too big for a single dispatch"));
        index++;
        continue;
      }
      groupedItems.push([]);
    }
    return groupedItems;
  }
  function dispatch() {
    const groupedItems = groupItems(pendingItems);
    destroyTimerAndPendingItems();
    for (const items of groupedItems) {
      if (!items.length) {
        continue;
      }
      const batch = {
        items,
        cancel: throwFatalError
      };
      for (const item of items) {
        item.batch = batch;
      }
      const { promise, cancel } = batchLoader.fetch(batch.items.map((_item) => _item.key));
      batch.cancel = cancel;
      promise.then((result) => {
        for (let i2 = 0; i2 < result.length; i2++) {
          const value = result[i2];
          const item = batch.items[i2];
          item.resolve(value);
          item.batch = null;
        }
      }).catch((cause) => {
        for (const item of batch.items) {
          item.reject(cause);
          item.batch = null;
        }
      });
    }
  }
  function load(key) {
    const item = {
      aborted: false,
      key,
      batch: null,
      resolve: throwFatalError,
      reject: throwFatalError
    };
    const promise = new Promise((resolve2, reject) => {
      item.reject = reject;
      item.resolve = resolve2;
      if (!pendingItems) {
        pendingItems = [];
      }
      pendingItems.push(item);
    });
    if (!dispatchTimer) {
      dispatchTimer = setTimeout(dispatch);
    }
    const cancel = () => {
      item.aborted = true;
      if (item.batch?.items.every((item2) => item2.aborted)) {
        item.batch.cancel();
        item.batch = null;
      }
    };
    return {
      promise,
      cancel
    };
  }
  return {
    load
  };
}
function httpBatchLink(opts) {
  const resolvedOpts = resolveHTTPLinkOptions(opts);
  return (runtime) => {
    const maxURLLength = opts.maxURLLength || Infinity;
    const batchLoader = (type) => {
      const validate2 = (batchOps) => {
        if (maxURLLength === Infinity) {
          return true;
        }
        const path2 = batchOps.map((op) => op.path).join(",");
        const inputs = batchOps.map((op) => op.input);
        const url2 = getUrl({
          ...resolvedOpts,
          runtime,
          type,
          path: path2,
          inputs
        });
        return url2.length <= maxURLLength;
      };
      const fetch2 = (batchOps) => {
        const path2 = batchOps.map((op) => op.path).join(",");
        const inputs = batchOps.map((op) => op.input);
        const { promise, cancel } = jsonHttpRequester({
          ...resolvedOpts,
          runtime,
          type,
          path: path2,
          inputs,
          headers() {
            if (!opts.headers) {
              return {};
            }
            if (typeof opts.headers === "function") {
              return opts.headers({
                opList: batchOps
              });
            }
            return opts.headers;
          }
        });
        return {
          promise: promise.then((res) => {
            const resJSON = Array.isArray(res.json) ? res.json : batchOps.map(() => res.json);
            const result = resJSON.map((item) => ({
              meta: res.meta,
              json: item
            }));
            return result;
          }),
          cancel
        };
      };
      return {
        validate: validate2,
        fetch: fetch2
      };
    };
    const query = dataLoader(batchLoader("query"));
    const mutation = dataLoader(batchLoader("mutation"));
    const subscription = dataLoader(batchLoader("subscription"));
    const loaders = {
      query,
      subscription,
      mutation
    };
    return ({ op }) => {
      return observable((observer) => {
        const loader = loaders[op.type];
        const { promise, cancel } = loader.load(op);
        promise.then((res) => {
          const transformed = transformResult(res.json, runtime);
          if (!transformed.ok) {
            observer.error(TRPCClientError.from(transformed.error, {
              meta: res.meta
            }));
            return;
          }
          observer.next({
            context: res.meta,
            result: transformed.result
          });
          observer.complete();
        }).catch((err) => observer.error(TRPCClientError.from(err)));
        return () => {
          cancel();
        };
      });
    };
  };
}

// ../../node_modules/.pnpm/@trpc+client@10.25.1_@trpc+server@10.25.1/node_modules/@trpc/client/dist/links/httpLink.mjs
function httpLinkFactory(factoryOpts) {
  return (opts) => {
    const resolvedOpts = resolveHTTPLinkOptions(opts);
    return (runtime) => ({ op }) => observable((observer) => {
      const { path: path2, input, type } = op;
      const { promise, cancel } = factoryOpts.requester({
        ...resolvedOpts,
        runtime,
        type,
        path: path2,
        input,
        headers() {
          if (!opts.headers) {
            return {};
          }
          if (typeof opts.headers === "function") {
            return opts.headers({
              op
            });
          }
          return opts.headers;
        }
      });
      promise.then((res) => {
        const transformed = transformResult(res.json, runtime);
        if (!transformed.ok) {
          observer.error(TRPCClientError.from(transformed.error, {
            meta: res.meta
          }));
          return;
        }
        observer.next({
          context: res.meta,
          result: transformed.result
        });
        observer.complete();
      }).catch((cause) => observer.error(TRPCClientError.from(cause)));
      return () => {
        cancel();
      };
    });
  };
}
var httpLink = httpLinkFactory({
  requester: jsonHttpRequester
});

// ../../node_modules/.pnpm/@trpc+client@10.25.1_@trpc+server@10.25.1/node_modules/@trpc/client/dist/index.mjs
var TRPCUntypedClient = class {
  $request({ type, input, path: path2, context: context2 = {} }) {
    const chain$ = createChain({
      links: this.links,
      op: {
        id: ++this.requestId,
        type,
        path: path2,
        input,
        context: context2
      }
    });
    return chain$.pipe(share());
  }
  requestAsPromise(opts) {
    const req$ = this.$request(opts);
    const { promise, abort } = observableToPromise(req$);
    const abortablePromise = new Promise((resolve2, reject) => {
      opts.signal?.addEventListener("abort", abort);
      promise.then((envelope) => {
        resolve2(envelope.result.data);
      }).catch((err) => {
        reject(TRPCClientError.from(err));
      });
    });
    return abortablePromise;
  }
  query(path2, input, opts) {
    return this.requestAsPromise({
      type: "query",
      path: path2,
      input,
      context: opts?.context,
      signal: opts?.signal
    });
  }
  mutation(path2, input, opts) {
    return this.requestAsPromise({
      type: "mutation",
      path: path2,
      input,
      context: opts?.context,
      signal: opts?.signal
    });
  }
  subscription(path2, input, opts) {
    const observable$ = this.$request({
      type: "subscription",
      path: path2,
      input,
      context: opts?.context
    });
    return observable$.subscribe({
      next(envelope) {
        if (envelope.result.type === "started") {
          opts.onStarted?.();
        } else if (envelope.result.type === "stopped") {
          opts.onStopped?.();
        } else {
          opts.onData?.(envelope.result.data);
        }
      },
      error(err) {
        opts.onError?.(err);
      },
      complete() {
        opts.onComplete?.();
      }
    });
  }
  constructor(opts) {
    this.requestId = 0;
    const combinedTransformer = (() => {
      const transformer = opts.transformer;
      if (!transformer) {
        return {
          input: {
            serialize: (data) => data,
            deserialize: (data) => data
          },
          output: {
            serialize: (data) => data,
            deserialize: (data) => data
          }
        };
      }
      if ("input" in transformer) {
        return opts.transformer;
      }
      return {
        input: transformer,
        output: transformer
      };
    })();
    this.runtime = {
      transformer: {
        serialize: (data) => combinedTransformer.input.serialize(data),
        deserialize: (data) => combinedTransformer.output.deserialize(data)
      },
      combinedTransformer
    };
    this.links = opts.links.map((link) => link(this.runtime));
  }
};
var clientCallTypeMap = {
  query: "query",
  mutate: "mutation",
  subscribe: "subscription"
};
function createTRPCClientProxy(client) {
  return createFlatProxy((key) => {
    if (client.hasOwnProperty(key)) {
      return client[key];
    }
    return createRecursiveProxy(({ path: path2, args }) => {
      const pathCopy = [
        key,
        ...path2
      ];
      const clientCallType = pathCopy.pop();
      const procedureType = clientCallTypeMap[clientCallType];
      const fullPath = pathCopy.join(".");
      return client[procedureType](fullPath, ...args);
    });
  });
}
function createTRPCProxyClient(opts) {
  const client = new TRPCUntypedClient(opts);
  const proxy = createTRPCClientProxy(client);
  return proxy;
}
var getBody2 = (opts) => {
  if (!("input" in opts)) {
    return void 0;
  }
  if (!(opts.input instanceof FormData)) {
    throw new Error("Input is not FormData");
  }
  return opts.input;
};
var formDataRequester = (opts) => {
  if (opts.type !== "mutation") {
    throw new Error("We only handle mutations with formdata");
  }
  return httpRequest({
    ...opts,
    getUrl() {
      return `${opts.url}/${opts.path}`;
    },
    getBody: getBody2
  });
};
var experimental_formDataLink = httpLinkFactory({
  requester: formDataRequester
});

// src/lib/trpc.ts
var trpc = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: "http://localhost:4001"
    })
  ]
});

// ../../node_modules/.pnpm/@pixi+filter-glow@5.2.1_@pixi+core@7.2.4/node_modules/@pixi/filter-glow/dist/filter-glow.mjs
var f2 = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`;
var p2 = `varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

uniform float outerStrength;
uniform float innerStrength;

uniform vec4 glowColor;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform bool knockout;
uniform float alpha;

const float PI = 3.14159265358979323846264;

const float DIST = __DIST__;
const float ANGLE_STEP_SIZE = min(__ANGLE_STEP_SIZE__, PI * 2.0);
const float ANGLE_STEP_NUM = ceil(PI * 2.0 / ANGLE_STEP_SIZE);

const float MAX_TOTAL_ALPHA = ANGLE_STEP_NUM * DIST * (DIST + 1.0) / 2.0;

void main(void) {
    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);

    float totalAlpha = 0.0;

    vec2 direction;
    vec2 displaced;
    vec4 curColor;

    for (float angle = 0.0; angle < PI * 2.0; angle += ANGLE_STEP_SIZE) {
       direction = vec2(cos(angle), sin(angle)) * px;

       for (float curDistance = 0.0; curDistance < DIST; curDistance++) {
           displaced = clamp(vTextureCoord + direction * 
                   (curDistance + 1.0), filterClamp.xy, filterClamp.zw);

           curColor = texture2D(uSampler, displaced);

           totalAlpha += (DIST - curDistance) * curColor.a;
       }
    }
    
    curColor = texture2D(uSampler, vTextureCoord);

    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);

    float innerGlowAlpha = (1.0 - alphaRatio) * innerStrength * curColor.a;
    float innerGlowStrength = min(1.0, innerGlowAlpha);
    
    vec4 innerColor = mix(curColor, glowColor, innerGlowStrength);

    float outerGlowAlpha = alphaRatio * outerStrength * (1. - curColor.a);
    float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha);

    if (knockout) {
      float resultAlpha = (outerGlowAlpha + innerGlowAlpha) * alpha;
      gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha);
    }
    else {
      vec4 outerGlowColor = outerGlowStrength * glowColor.rgba * alpha;
      gl_FragColor = innerColor + outerGlowColor;
    }
}
`;
var e2 = class extends Filter {
  constructor(n2) {
    const r2 = Object.assign({}, e2.defaults, n2), { outerStrength: a2, innerStrength: i2, color: u2, knockout: c2, quality: s2, alpha: h2 } = r2, o3 = Math.round(r2.distance);
    super(f2, p2.replace(/__ANGLE_STEP_SIZE__/gi, `${(1 / s2 / o3).toFixed(7)}`).replace(/__DIST__/gi, `${o3.toFixed(0)}.0`)), this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]), this.uniforms.alpha = 1, Object.assign(this, { color: u2, outerStrength: a2, innerStrength: i2, padding: o3, knockout: c2, alpha: h2 });
  }
  get color() {
    return lib_exports.rgb2hex(this.uniforms.glowColor);
  }
  set color(n2) {
    lib_exports.hex2rgb(n2, this.uniforms.glowColor);
  }
  get outerStrength() {
    return this.uniforms.outerStrength;
  }
  set outerStrength(n2) {
    this.uniforms.outerStrength = n2;
  }
  get innerStrength() {
    return this.uniforms.innerStrength;
  }
  set innerStrength(n2) {
    this.uniforms.innerStrength = n2;
  }
  get knockout() {
    return this.uniforms.knockout;
  }
  set knockout(n2) {
    this.uniforms.knockout = n2;
  }
  get alpha() {
    return this.uniforms.alpha;
  }
  set alpha(n2) {
    this.uniforms.alpha = n2;
  }
};
var l2 = e2;
l2.defaults = { distance: 10, outerStrength: 4, innerStrength: 0, color: 16777215, quality: 0.1, knockout: false, alpha: 1 };

// src/lib/game-state.ts
var GameState = {
  currentView: "universe",
  selected: void 0,
  visibleShips: {}
};

// src/lib/makeInteractiveAndSelectable.ts
var deselectListeners = new import_eventemitter3.default();
function makeInteractiveAndSelectable(item, options) {
  item.interactive = true;
  item.cursor = "pointer";
  item.on("mouseover", () => {
    item.filters = [new l2()];
    options?.onMouseOver?.();
  });
  const removeGlow = () => {
    item.filters = [];
  };
  item.on("mouseout", removeGlow);
  item.on("mouseout", () => {
    options?.onMouseOut?.();
  });
  if (options?.onOrder) {
    item.on("rightclick", (event) => {
      event.stopPropagation();
      const validCommands = options.onOrder.filter((c2) => {
        if (c2.withSelection && (!GameState.selected || GameState.selected.type !== c2.withSelection)) {
          return false;
        }
        return true;
      });
      if (validCommands.length == 0) {
      } else if (validCommands.length === 1) {
        validCommands[0].action(GameState.selected.symbol);
      } else {
        console.log("not yet implemented");
      }
    });
  }
  if (options?.onSelect) {
    item.on("click", (event) => {
      deselectListeners.emit("deselect");
      event.stopPropagation();
      deselectListeners.once("deselect", () => {
        removeGlow();
        GameState.selected = false;
        item.on("mouseout", removeGlow);
      });
      item.off("mouseout", removeGlow);
      GameState.selected = options.onSelect;
    });
  }
}

// src/lib/consts.ts
var totalSize = 5e5;
var systemScale = 12;
var universeCoordinates = {
  minX: 0,
  minY: 0,
  maxX: 0,
  maxY: 0
};
var systemCoordinates = {
  minX: 0,
  minY: 0
};

// ../../node_modules/.pnpm/pixi-viewport@5.0.1/node_modules/pixi-viewport/dist/pixi_viewport.js
var S2 = Object.defineProperty;
var M2 = (c2, r2, t2) => r2 in c2 ? S2(c2, r2, { enumerable: true, configurable: true, writable: true, value: t2 }) : c2[r2] = t2;
var o2 = (c2, r2, t2) => (M2(c2, typeof r2 != "symbol" ? r2 + "" : r2, t2), t2);
var f3 = class {
  constructor(r2) {
    o2(this, "parent");
    o2(this, "paused");
    this.parent = r2, this.paused = false;
  }
  destroy() {
  }
  down(r2) {
    return false;
  }
  move(r2) {
    return false;
  }
  up(r2) {
    return false;
  }
  wheel(r2) {
    return false;
  }
  update(r2) {
  }
  resize() {
  }
  reset() {
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }
};
var C = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
var H2 = { exports: {} };
(function(c2, r2) {
  (function() {
    var t2, i2;
    i2 = function(e3) {
      return c2.exports = e3;
    }, t2 = {
      linear: function(e3, n2, s2, h2) {
        return s2 * e3 / h2 + n2;
      },
      easeInQuad: function(e3, n2, s2, h2) {
        return s2 * (e3 /= h2) * e3 + n2;
      },
      easeOutQuad: function(e3, n2, s2, h2) {
        return -s2 * (e3 /= h2) * (e3 - 2) + n2;
      },
      easeInOutQuad: function(e3, n2, s2, h2) {
        return (e3 /= h2 / 2) < 1 ? s2 / 2 * e3 * e3 + n2 : -s2 / 2 * (--e3 * (e3 - 2) - 1) + n2;
      },
      easeInCubic: function(e3, n2, s2, h2) {
        return s2 * (e3 /= h2) * e3 * e3 + n2;
      },
      easeOutCubic: function(e3, n2, s2, h2) {
        return s2 * ((e3 = e3 / h2 - 1) * e3 * e3 + 1) + n2;
      },
      easeInOutCubic: function(e3, n2, s2, h2) {
        return (e3 /= h2 / 2) < 1 ? s2 / 2 * e3 * e3 * e3 + n2 : s2 / 2 * ((e3 -= 2) * e3 * e3 + 2) + n2;
      },
      easeInQuart: function(e3, n2, s2, h2) {
        return s2 * (e3 /= h2) * e3 * e3 * e3 + n2;
      },
      easeOutQuart: function(e3, n2, s2, h2) {
        return -s2 * ((e3 = e3 / h2 - 1) * e3 * e3 * e3 - 1) + n2;
      },
      easeInOutQuart: function(e3, n2, s2, h2) {
        return (e3 /= h2 / 2) < 1 ? s2 / 2 * e3 * e3 * e3 * e3 + n2 : -s2 / 2 * ((e3 -= 2) * e3 * e3 * e3 - 2) + n2;
      },
      easeInQuint: function(e3, n2, s2, h2) {
        return s2 * (e3 /= h2) * e3 * e3 * e3 * e3 + n2;
      },
      easeOutQuint: function(e3, n2, s2, h2) {
        return s2 * ((e3 = e3 / h2 - 1) * e3 * e3 * e3 * e3 + 1) + n2;
      },
      easeInOutQuint: function(e3, n2, s2, h2) {
        return (e3 /= h2 / 2) < 1 ? s2 / 2 * e3 * e3 * e3 * e3 * e3 + n2 : s2 / 2 * ((e3 -= 2) * e3 * e3 * e3 * e3 + 2) + n2;
      },
      easeInSine: function(e3, n2, s2, h2) {
        return -s2 * Math.cos(e3 / h2 * (Math.PI / 2)) + s2 + n2;
      },
      easeOutSine: function(e3, n2, s2, h2) {
        return s2 * Math.sin(e3 / h2 * (Math.PI / 2)) + n2;
      },
      easeInOutSine: function(e3, n2, s2, h2) {
        return -s2 / 2 * (Math.cos(Math.PI * e3 / h2) - 1) + n2;
      },
      easeInExpo: function(e3, n2, s2, h2) {
        return e3 === 0 ? n2 : s2 * Math.pow(2, 10 * (e3 / h2 - 1)) + n2;
      },
      easeOutExpo: function(e3, n2, s2, h2) {
        return e3 === h2 ? n2 + s2 : s2 * (-Math.pow(2, -10 * e3 / h2) + 1) + n2;
      },
      easeInOutExpo: function(e3, n2, s2, h2) {
        return (e3 /= h2 / 2) < 1 ? s2 / 2 * Math.pow(2, 10 * (e3 - 1)) + n2 : s2 / 2 * (-Math.pow(2, -10 * --e3) + 2) + n2;
      },
      easeInCirc: function(e3, n2, s2, h2) {
        return -s2 * (Math.sqrt(1 - (e3 /= h2) * e3) - 1) + n2;
      },
      easeOutCirc: function(e3, n2, s2, h2) {
        return s2 * Math.sqrt(1 - (e3 = e3 / h2 - 1) * e3) + n2;
      },
      easeInOutCirc: function(e3, n2, s2, h2) {
        return (e3 /= h2 / 2) < 1 ? -s2 / 2 * (Math.sqrt(1 - e3 * e3) - 1) + n2 : s2 / 2 * (Math.sqrt(1 - (e3 -= 2) * e3) + 1) + n2;
      },
      easeInElastic: function(e3, n2, s2, h2) {
        var a2, p3, l3;
        return l3 = 1.70158, p3 = 0, a2 = s2, e3 === 0 || (e3 /= h2), p3 || (p3 = h2 * 0.3), a2 < Math.abs(s2) ? (a2 = s2, l3 = p3 / 4) : l3 = p3 / (2 * Math.PI) * Math.asin(s2 / a2), -(a2 * Math.pow(2, 10 * (e3 -= 1)) * Math.sin((e3 * h2 - l3) * (2 * Math.PI) / p3)) + n2;
      },
      easeOutElastic: function(e3, n2, s2, h2) {
        var a2, p3, l3;
        return l3 = 1.70158, p3 = 0, a2 = s2, e3 === 0 || (e3 /= h2), p3 || (p3 = h2 * 0.3), a2 < Math.abs(s2) ? (a2 = s2, l3 = p3 / 4) : l3 = p3 / (2 * Math.PI) * Math.asin(s2 / a2), a2 * Math.pow(2, -10 * e3) * Math.sin((e3 * h2 - l3) * (2 * Math.PI) / p3) + s2 + n2;
      },
      easeInOutElastic: function(e3, n2, s2, h2) {
        var a2, p3, l3;
        return l3 = 1.70158, p3 = 0, a2 = s2, e3 === 0 || (e3 /= h2 / 2), p3 || (p3 = h2 * (0.3 * 1.5)), a2 < Math.abs(s2) ? (a2 = s2, l3 = p3 / 4) : l3 = p3 / (2 * Math.PI) * Math.asin(s2 / a2), e3 < 1 ? -0.5 * (a2 * Math.pow(2, 10 * (e3 -= 1)) * Math.sin((e3 * h2 - l3) * (2 * Math.PI) / p3)) + n2 : a2 * Math.pow(2, -10 * (e3 -= 1)) * Math.sin((e3 * h2 - l3) * (2 * Math.PI) / p3) * 0.5 + s2 + n2;
      },
      easeInBack: function(e3, n2, s2, h2, a2) {
        return a2 === void 0 && (a2 = 1.70158), s2 * (e3 /= h2) * e3 * ((a2 + 1) * e3 - a2) + n2;
      },
      easeOutBack: function(e3, n2, s2, h2, a2) {
        return a2 === void 0 && (a2 = 1.70158), s2 * ((e3 = e3 / h2 - 1) * e3 * ((a2 + 1) * e3 + a2) + 1) + n2;
      },
      easeInOutBack: function(e3, n2, s2, h2, a2) {
        return a2 === void 0 && (a2 = 1.70158), (e3 /= h2 / 2) < 1 ? s2 / 2 * (e3 * e3 * (((a2 *= 1.525) + 1) * e3 - a2)) + n2 : s2 / 2 * ((e3 -= 2) * e3 * (((a2 *= 1.525) + 1) * e3 + a2) + 2) + n2;
      },
      easeInBounce: function(e3, n2, s2, h2) {
        var a2;
        return a2 = t2.easeOutBounce(h2 - e3, 0, s2, h2), s2 - a2 + n2;
      },
      easeOutBounce: function(e3, n2, s2, h2) {
        return (e3 /= h2) < 1 / 2.75 ? s2 * (7.5625 * e3 * e3) + n2 : e3 < 2 / 2.75 ? s2 * (7.5625 * (e3 -= 1.5 / 2.75) * e3 + 0.75) + n2 : e3 < 2.5 / 2.75 ? s2 * (7.5625 * (e3 -= 2.25 / 2.75) * e3 + 0.9375) + n2 : s2 * (7.5625 * (e3 -= 2.625 / 2.75) * e3 + 0.984375) + n2;
      },
      easeInOutBounce: function(e3, n2, s2, h2) {
        var a2;
        return e3 < h2 / 2 ? (a2 = t2.easeInBounce(e3 * 2, 0, s2, h2), a2 * 0.5 + n2) : (a2 = t2.easeOutBounce(e3 * 2 - h2, 0, s2, h2), a2 * 0.5 + s2 * 0.5 + n2);
      }
    }, i2(t2);
  }).call(C);
})(H2);
var b2 = H2.exports;
function W(c2, r2) {
  if (c2) {
    if (typeof c2 == "function")
      return c2;
    if (typeof c2 == "string")
      return b2[c2];
  } else
    return b2[r2];
}
var I = {
  removeOnInterrupt: false,
  ease: "linear",
  time: 1e3
};
var k2 = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "startX");
    o2(this, "startY");
    o2(this, "deltaX");
    o2(this, "deltaY");
    o2(this, "keepCenter");
    o2(this, "startWidth", null);
    o2(this, "startHeight", null);
    o2(this, "deltaWidth", null);
    o2(this, "deltaHeight", null);
    o2(this, "width", null);
    o2(this, "height", null);
    o2(this, "time", 0);
    this.options = Object.assign({}, I, i2), this.options.ease = W(this.options.ease), this.setupPosition(), this.setupZoom(), this.time = 0;
  }
  setupPosition() {
    typeof this.options.position < "u" ? (this.startX = this.parent.center.x, this.startY = this.parent.center.y, this.deltaX = this.options.position.x - this.parent.center.x, this.deltaY = this.options.position.y - this.parent.center.y, this.keepCenter = false) : this.keepCenter = true;
  }
  setupZoom() {
    this.width = null, this.height = null, typeof this.options.scale < "u" ? this.width = this.parent.screenWidth / this.options.scale : typeof this.options.scaleX < "u" || typeof this.options.scaleY < "u" ? (typeof this.options.scaleX < "u" && (this.width = this.parent.screenWidth / this.options.scaleX), typeof this.options.scaleY < "u" && (this.height = this.parent.screenHeight / this.options.scaleY)) : (typeof this.options.width < "u" && (this.width = this.options.width), typeof this.options.height < "u" && (this.height = this.options.height)), this.width !== null && (this.startWidth = this.parent.screenWidthInWorldPixels, this.deltaWidth = this.width - this.startWidth), this.height !== null && (this.startHeight = this.parent.screenHeightInWorldPixels, this.deltaHeight = this.height - this.startHeight);
  }
  down() {
    return this.options.removeOnInterrupt && this.parent.plugins.remove("animate"), false;
  }
  complete() {
    this.parent.plugins.remove("animate"), this.width !== null && this.parent.fitWidth(this.width, this.keepCenter, this.height === null), this.height !== null && this.parent.fitHeight(this.height, this.keepCenter, this.width === null), !this.keepCenter && this.options.position && this.parent.moveCenter(this.options.position), this.parent.emit("animate-end", this.parent), this.options.callbackOnComplete && this.options.callbackOnComplete(this.parent);
  }
  update(t2) {
    if (this.paused)
      return;
    this.time += t2;
    const i2 = new Point(this.parent.scale.x, this.parent.scale.y);
    if (this.time >= this.options.time) {
      const e3 = this.parent.width, n2 = this.parent.height;
      this.complete(), (e3 !== this.parent.width || n2 !== this.parent.height) && this.parent.emit("zoomed", { viewport: this.parent, original: i2, type: "animate" });
    } else {
      const e3 = this.options.ease(this.time, 0, 1, this.options.time);
      if (this.width !== null) {
        const n2 = this.startWidth, s2 = this.deltaWidth;
        this.parent.fitWidth(
          n2 + s2 * e3,
          this.keepCenter,
          this.height === null
        );
      }
      if (this.height !== null) {
        const n2 = this.startHeight, s2 = this.deltaHeight;
        this.parent.fitHeight(
          n2 + s2 * e3,
          this.keepCenter,
          this.width === null
        );
      }
      if (this.width === null ? this.parent.scale.x = this.parent.scale.y : this.height === null && (this.parent.scale.y = this.parent.scale.x), !this.keepCenter) {
        const n2 = this.startX, s2 = this.startY, h2 = this.deltaX, a2 = this.deltaY, p3 = new Point(this.parent.x, this.parent.y);
        this.parent.moveCenter(n2 + h2 * e3, s2 + a2 * e3), this.parent.emit("moved", { viewport: this.parent, original: p3, type: "animate" });
      }
      (this.width || this.height) && this.parent.emit("zoomed", { viewport: this.parent, original: i2, type: "animate" });
    }
  }
};
var Y = {
  sides: "all",
  friction: 0.5,
  time: 150,
  ease: "easeInOutSine",
  underflow: "center",
  bounceBox: null
};
var X = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "left");
    o2(this, "top");
    o2(this, "right");
    o2(this, "bottom");
    o2(this, "underflowX");
    o2(this, "underflowY");
    o2(this, "ease");
    o2(this, "toX");
    o2(this, "toY");
    this.options = Object.assign({}, Y, i2), this.ease = W(this.options.ease, "easeInOutSine"), this.options.sides ? this.options.sides === "all" ? this.top = this.bottom = this.left = this.right = true : this.options.sides === "horizontal" ? (this.right = this.left = true, this.top = this.bottom = false) : this.options.sides === "vertical" ? (this.left = this.right = false, this.top = this.bottom = true) : (this.top = this.options.sides.indexOf("top") !== -1, this.bottom = this.options.sides.indexOf("bottom") !== -1, this.left = this.options.sides.indexOf("left") !== -1, this.right = this.options.sides.indexOf("right") !== -1) : this.left = this.top = this.right = this.bottom = false;
    const e3 = this.options.underflow.toLowerCase();
    e3 === "center" ? (this.underflowX = 0, this.underflowY = 0) : (this.underflowX = e3.indexOf("left") !== -1 ? -1 : e3.indexOf("right") !== -1 ? 1 : 0, this.underflowY = e3.indexOf("top") !== -1 ? -1 : e3.indexOf("bottom") !== -1 ? 1 : 0), this.reset();
  }
  isActive() {
    return this.toX !== null || this.toY !== null;
  }
  down() {
    return this.toX = this.toY = null, false;
  }
  up() {
    return this.bounce(), false;
  }
  update(t2) {
    if (!this.paused) {
      if (this.bounce(), this.toX) {
        const i2 = this.toX;
        i2.time += t2, this.parent.emit("moved", { viewport: this.parent, type: "bounce-x" }), i2.time >= this.options.time ? (this.parent.x = i2.end, this.toX = null, this.parent.emit("bounce-x-end", this.parent)) : this.parent.x = this.ease(i2.time, i2.start, i2.delta, this.options.time);
      }
      if (this.toY) {
        const i2 = this.toY;
        i2.time += t2, this.parent.emit("moved", { viewport: this.parent, type: "bounce-y" }), i2.time >= this.options.time ? (this.parent.y = i2.end, this.toY = null, this.parent.emit("bounce-y-end", this.parent)) : this.parent.y = this.ease(i2.time, i2.start, i2.delta, this.options.time);
      }
    }
  }
  calcUnderflowX() {
    let t2;
    switch (this.underflowX) {
      case -1:
        t2 = 0;
        break;
      case 1:
        t2 = this.parent.screenWidth - this.parent.screenWorldWidth;
        break;
      default:
        t2 = (this.parent.screenWidth - this.parent.screenWorldWidth) / 2;
    }
    return t2;
  }
  calcUnderflowY() {
    let t2;
    switch (this.underflowY) {
      case -1:
        t2 = 0;
        break;
      case 1:
        t2 = this.parent.screenHeight - this.parent.screenWorldHeight;
        break;
      default:
        t2 = (this.parent.screenHeight - this.parent.screenWorldHeight) / 2;
    }
    return t2;
  }
  oob() {
    const t2 = this.options.bounceBox;
    if (t2) {
      const i2 = typeof t2.x > "u" ? 0 : t2.x, e3 = typeof t2.y > "u" ? 0 : t2.y, n2 = typeof t2.width > "u" ? this.parent.worldWidth : t2.width, s2 = typeof t2.height > "u" ? this.parent.worldHeight : t2.height;
      return {
        left: this.parent.left < i2,
        right: this.parent.right > n2,
        top: this.parent.top < e3,
        bottom: this.parent.bottom > s2,
        topLeft: new Point(
          i2 * this.parent.scale.x,
          e3 * this.parent.scale.y
        ),
        bottomRight: new Point(
          n2 * this.parent.scale.x - this.parent.screenWidth,
          s2 * this.parent.scale.y - this.parent.screenHeight
        )
      };
    }
    return {
      left: this.parent.left < 0,
      right: this.parent.right > this.parent.worldWidth,
      top: this.parent.top < 0,
      bottom: this.parent.bottom > this.parent.worldHeight,
      topLeft: new Point(0, 0),
      bottomRight: new Point(
        this.parent.worldWidth * this.parent.scale.x - this.parent.screenWidth,
        this.parent.worldHeight * this.parent.scale.y - this.parent.screenHeight
      )
    };
  }
  bounce() {
    var s2, h2;
    if (this.paused)
      return;
    let t2, i2 = this.parent.plugins.get("decelerate", true);
    i2 && (i2.x || i2.y) && (i2.x && i2.percentChangeX === ((s2 = i2.options) == null ? void 0 : s2.friction) || i2.y && i2.percentChangeY === ((h2 = i2.options) == null ? void 0 : h2.friction)) && (t2 = this.oob(), (t2.left && this.left || t2.right && this.right) && (i2.percentChangeX = this.options.friction), (t2.top && this.top || t2.bottom && this.bottom) && (i2.percentChangeY = this.options.friction));
    const e3 = this.parent.plugins.get("drag", true) || {}, n2 = this.parent.plugins.get("pinch", true) || {};
    if (i2 = i2 || {}, !(e3 != null && e3.active) && !(n2 != null && n2.active) && (!this.toX || !this.toY) && (!i2.x || !i2.y)) {
      t2 = t2 || this.oob();
      const a2 = t2.topLeft, p3 = t2.bottomRight;
      if (!this.toX && !i2.x) {
        let l3 = null;
        t2.left && this.left ? l3 = this.parent.screenWorldWidth < this.parent.screenWidth ? this.calcUnderflowX() : -a2.x : t2.right && this.right && (l3 = this.parent.screenWorldWidth < this.parent.screenWidth ? this.calcUnderflowX() : -p3.x), l3 !== null && this.parent.x !== l3 && (this.toX = { time: 0, start: this.parent.x, delta: l3 - this.parent.x, end: l3 }, this.parent.emit("bounce-x-start", this.parent));
      }
      if (!this.toY && !i2.y) {
        let l3 = null;
        t2.top && this.top ? l3 = this.parent.screenWorldHeight < this.parent.screenHeight ? this.calcUnderflowY() : -a2.y : t2.bottom && this.bottom && (l3 = this.parent.screenWorldHeight < this.parent.screenHeight ? this.calcUnderflowY() : -p3.y), l3 !== null && this.parent.y !== l3 && (this.toY = { time: 0, start: this.parent.y, delta: l3 - this.parent.y, end: l3 }, this.parent.emit("bounce-y-start", this.parent));
      }
    }
  }
  reset() {
    this.toX = this.toY = null, this.bounce();
  }
};
var z = {
  left: false,
  right: false,
  top: false,
  bottom: false,
  direction: null,
  underflow: "center"
};
var A = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "last");
    o2(this, "noUnderflow");
    o2(this, "underflowX");
    o2(this, "underflowY");
    this.options = Object.assign({}, z, i2), this.options.direction && (this.options.left = this.options.direction === "x" || this.options.direction === "all" ? true : null, this.options.right = this.options.direction === "x" || this.options.direction === "all" ? true : null, this.options.top = this.options.direction === "y" || this.options.direction === "all" ? true : null, this.options.bottom = this.options.direction === "y" || this.options.direction === "all" ? true : null), this.parseUnderflow(), this.last = { x: null, y: null, scaleX: null, scaleY: null }, this.update();
  }
  parseUnderflow() {
    const t2 = this.options.underflow.toLowerCase();
    t2 === "none" ? this.noUnderflow = true : t2 === "center" ? (this.underflowX = this.underflowY = 0, this.noUnderflow = false) : (this.underflowX = t2.indexOf("left") !== -1 ? -1 : t2.indexOf("right") !== -1 ? 1 : 0, this.underflowY = t2.indexOf("top") !== -1 ? -1 : t2.indexOf("bottom") !== -1 ? 1 : 0, this.noUnderflow = false);
  }
  move() {
    return this.update(), false;
  }
  update() {
    if (this.paused || this.parent.x === this.last.x && this.parent.y === this.last.y && this.parent.scale.x === this.last.scaleX && this.parent.scale.y === this.last.scaleY)
      return;
    const t2 = new Point(this.parent.x, this.parent.y), i2 = this.parent.plugins.decelerate || {};
    if (this.options.left !== null || this.options.right !== null) {
      let e3 = false;
      if (!this.noUnderflow && this.parent.screenWorldWidth < this.parent.screenWidth)
        switch (this.underflowX) {
          case -1:
            this.parent.x !== 0 && (this.parent.x = 0, e3 = true);
            break;
          case 1:
            this.parent.x !== this.parent.screenWidth - this.parent.screenWorldWidth && (this.parent.x = this.parent.screenWidth - this.parent.screenWorldWidth, e3 = true);
            break;
          default:
            this.parent.x !== (this.parent.screenWidth - this.parent.screenWorldWidth) / 2 && (this.parent.x = (this.parent.screenWidth - this.parent.screenWorldWidth) / 2, e3 = true);
        }
      else
        this.options.left !== null && this.parent.left < (this.options.left === true ? 0 : this.options.left) && (this.parent.x = -(this.options.left === true ? 0 : this.options.left) * this.parent.scale.x, i2.x = 0, e3 = true), this.options.right !== null && this.parent.right > (this.options.right === true ? this.parent.worldWidth : this.options.right) && (this.parent.x = -(this.options.right === true ? this.parent.worldWidth : this.options.right) * this.parent.scale.x + this.parent.screenWidth, i2.x = 0, e3 = true);
      e3 && this.parent.emit("moved", { viewport: this.parent, original: t2, type: "clamp-x" });
    }
    if (this.options.top !== null || this.options.bottom !== null) {
      let e3 = false;
      if (!this.noUnderflow && this.parent.screenWorldHeight < this.parent.screenHeight)
        switch (this.underflowY) {
          case -1:
            this.parent.y !== 0 && (this.parent.y = 0, e3 = true);
            break;
          case 1:
            this.parent.y !== this.parent.screenHeight - this.parent.screenWorldHeight && (this.parent.y = this.parent.screenHeight - this.parent.screenWorldHeight, e3 = true);
            break;
          default:
            this.parent.y !== (this.parent.screenHeight - this.parent.screenWorldHeight) / 2 && (this.parent.y = (this.parent.screenHeight - this.parent.screenWorldHeight) / 2, e3 = true);
        }
      else
        this.options.top !== null && this.parent.top < (this.options.top === true ? 0 : this.options.top) && (this.parent.y = -(this.options.top === true ? 0 : this.options.top) * this.parent.scale.y, i2.y = 0, e3 = true), this.options.bottom !== null && this.parent.bottom > (this.options.bottom === true ? this.parent.worldHeight : this.options.bottom) && (this.parent.y = -(this.options.bottom === true ? this.parent.worldHeight : this.options.bottom) * this.parent.scale.y + this.parent.screenHeight, i2.y = 0, e3 = true);
      e3 && this.parent.emit("moved", { viewport: this.parent, original: t2, type: "clamp-y" });
    }
    this.last.x = this.parent.x, this.last.y = this.parent.y, this.last.scaleX = this.parent.scale.x, this.last.scaleY = this.parent.scale.y;
  }
  reset() {
    this.update();
  }
};
var _ = {
  minWidth: null,
  minHeight: null,
  maxWidth: null,
  maxHeight: null,
  minScale: null,
  maxScale: null
};
var T = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    this.options = Object.assign({}, _, i2), this.clamp();
  }
  resize() {
    this.clamp();
  }
  clamp() {
    if (!this.paused) {
      if (this.options.minWidth || this.options.minHeight || this.options.maxWidth || this.options.maxHeight) {
        let t2 = this.parent.worldScreenWidth, i2 = this.parent.worldScreenHeight;
        if (this.options.minWidth !== null && t2 < this.options.minWidth) {
          const e3 = this.parent.scale.x;
          this.parent.fitWidth(this.options.minWidth, false, false, true), this.parent.scale.y *= this.parent.scale.x / e3, t2 = this.parent.worldScreenWidth, i2 = this.parent.worldScreenHeight, this.parent.emit("zoomed", { viewport: this.parent, type: "clamp-zoom" });
        }
        if (this.options.maxWidth !== null && t2 > this.options.maxWidth) {
          const e3 = this.parent.scale.x;
          this.parent.fitWidth(this.options.maxWidth, false, false, true), this.parent.scale.y *= this.parent.scale.x / e3, t2 = this.parent.worldScreenWidth, i2 = this.parent.worldScreenHeight, this.parent.emit("zoomed", { viewport: this.parent, type: "clamp-zoom" });
        }
        if (this.options.minHeight !== null && i2 < this.options.minHeight) {
          const e3 = this.parent.scale.y;
          this.parent.fitHeight(this.options.minHeight, false, false, true), this.parent.scale.x *= this.parent.scale.y / e3, t2 = this.parent.worldScreenWidth, i2 = this.parent.worldScreenHeight, this.parent.emit("zoomed", { viewport: this.parent, type: "clamp-zoom" });
        }
        if (this.options.maxHeight !== null && i2 > this.options.maxHeight) {
          const e3 = this.parent.scale.y;
          this.parent.fitHeight(this.options.maxHeight, false, false, true), this.parent.scale.x *= this.parent.scale.y / e3, this.parent.emit("zoomed", { viewport: this.parent, type: "clamp-zoom" });
        }
      } else if (this.options.minScale || this.options.maxScale) {
        const t2 = { x: null, y: null }, i2 = { x: null, y: null };
        if (typeof this.options.minScale == "number")
          t2.x = this.options.minScale, t2.y = this.options.minScale;
        else if (this.options.minScale !== null) {
          const s2 = this.options.minScale;
          t2.x = typeof s2.x > "u" ? null : s2.x, t2.y = typeof s2.y > "u" ? null : s2.y;
        }
        if (typeof this.options.maxScale == "number")
          i2.x = this.options.maxScale, i2.y = this.options.maxScale;
        else if (this.options.maxScale !== null) {
          const s2 = this.options.maxScale;
          i2.x = typeof s2.x > "u" ? null : s2.x, i2.y = typeof s2.y > "u" ? null : s2.y;
        }
        let e3 = this.parent.scale.x, n2 = this.parent.scale.y;
        t2.x !== null && e3 < t2.x && (e3 = t2.x), i2.x !== null && e3 > i2.x && (e3 = i2.x), t2.y !== null && n2 < t2.y && (n2 = t2.y), i2.y !== null && n2 > i2.y && (n2 = i2.y), (e3 !== this.parent.scale.x || n2 !== this.parent.scale.y) && (this.parent.scale.set(e3, n2), this.parent.emit("zoomed", { viewport: this.parent, type: "clamp-zoom" }));
      }
    }
  }
  reset() {
    this.clamp();
  }
};
var D = {
  friction: 0.98,
  bounce: 0.8,
  minSpeed: 0.01
};
var g2 = 16;
var E = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "x");
    o2(this, "y");
    o2(this, "percentChangeX");
    o2(this, "percentChangeY");
    o2(this, "saved");
    o2(this, "timeSinceRelease");
    this.options = Object.assign({}, D, i2), this.saved = [], this.timeSinceRelease = 0, this.reset(), this.parent.on("moved", (e3) => this.handleMoved(e3));
  }
  down() {
    return this.saved = [], this.x = this.y = null, false;
  }
  isActive() {
    return !!(this.x || this.y);
  }
  move() {
    if (this.paused)
      return false;
    const t2 = this.parent.input.count();
    return (t2 === 1 || t2 > 1 && !this.parent.plugins.get("pinch", true)) && (this.saved.push({ x: this.parent.x, y: this.parent.y, time: performance.now() }), this.saved.length > 60 && this.saved.splice(0, 30)), false;
  }
  handleMoved(t2) {
    if (this.saved.length) {
      const i2 = this.saved[this.saved.length - 1];
      t2.type === "clamp-x" && t2.original ? i2.x === t2.original.x && (i2.x = this.parent.x) : t2.type === "clamp-y" && t2.original && i2.y === t2.original.y && (i2.y = this.parent.y);
    }
  }
  up() {
    if (this.parent.input.count() === 0 && this.saved.length) {
      const t2 = performance.now();
      for (const i2 of this.saved)
        if (i2.time >= t2 - 100) {
          const e3 = t2 - i2.time;
          this.x = (this.parent.x - i2.x) / e3, this.y = (this.parent.y - i2.y) / e3, this.percentChangeX = this.percentChangeY = this.options.friction, this.timeSinceRelease = 0;
          break;
        }
    }
    return false;
  }
  activate(t2) {
    t2 = t2 || {}, typeof t2.x < "u" && (this.x = t2.x, this.percentChangeX = this.options.friction), typeof t2.y < "u" && (this.y = t2.y, this.percentChangeY = this.options.friction);
  }
  update(t2) {
    if (this.paused)
      return;
    const i2 = this.x || this.y, e3 = this.timeSinceRelease, n2 = this.timeSinceRelease + t2;
    if (this.x) {
      const s2 = this.percentChangeX, h2 = Math.log(s2);
      this.parent.x += this.x * g2 / h2 * (Math.pow(s2, n2 / g2) - Math.pow(s2, e3 / g2)), this.x *= Math.pow(this.percentChangeX, t2 / g2);
    }
    if (this.y) {
      const s2 = this.percentChangeY, h2 = Math.log(s2);
      this.parent.y += this.y * g2 / h2 * (Math.pow(s2, n2 / g2) - Math.pow(s2, e3 / g2)), this.y *= Math.pow(this.percentChangeY, t2 / g2);
    }
    this.timeSinceRelease += t2, this.x && this.y ? Math.abs(this.x) < this.options.minSpeed && Math.abs(this.y) < this.options.minSpeed && (this.x = 0, this.y = 0) : (Math.abs(this.x || 0) < this.options.minSpeed && (this.x = 0), Math.abs(this.y || 0) < this.options.minSpeed && (this.y = 0)), i2 && this.parent.emit("moved", { viewport: this.parent, type: "decelerate" });
  }
  reset() {
    this.x = this.y = null;
  }
};
var L = {
  direction: "all",
  pressDrag: true,
  wheel: true,
  wheelScroll: 1,
  reverse: false,
  clampWheel: false,
  underflow: "center",
  factor: 1,
  mouseButtons: "all",
  keyToPress: null,
  ignoreKeyToPressOnTouch: false,
  lineHeight: 20,
  wheelSwapAxes: false
};
var U = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "moved");
    o2(this, "reverse");
    o2(this, "xDirection");
    o2(this, "yDirection");
    o2(this, "keyIsPressed");
    o2(this, "mouse");
    o2(this, "underflowX");
    o2(this, "underflowY");
    o2(this, "last");
    o2(this, "current");
    o2(this, "windowEventHandlers", []);
    this.options = Object.assign({}, L, i2), this.moved = false, this.reverse = this.options.reverse ? 1 : -1, this.xDirection = !this.options.direction || this.options.direction === "all" || this.options.direction === "x", this.yDirection = !this.options.direction || this.options.direction === "all" || this.options.direction === "y", this.keyIsPressed = false, this.parseUnderflow(), this.mouseButtons(this.options.mouseButtons), this.options.keyToPress && this.handleKeyPresses(this.options.keyToPress);
  }
  handleKeyPresses(t2) {
    const i2 = (n2) => {
      t2.includes(n2.code) && (this.keyIsPressed = true);
    }, e3 = (n2) => {
      t2.includes(n2.code) && (this.keyIsPressed = false);
    };
    this.addWindowEventHandler("keyup", e3), this.addWindowEventHandler("keydown", i2);
  }
  addWindowEventHandler(t2, i2) {
    window.addEventListener(t2, i2), this.windowEventHandlers.push({ event: t2, handler: i2 });
  }
  destroy() {
    this.windowEventHandlers.forEach(({ event: t2, handler: i2 }) => {
      window.removeEventListener(t2, i2);
    });
  }
  mouseButtons(t2) {
    !t2 || t2 === "all" ? this.mouse = [true, true, true] : this.mouse = [
      t2.indexOf("left") !== -1,
      t2.indexOf("middle") !== -1,
      t2.indexOf("right") !== -1
    ];
  }
  parseUnderflow() {
    const t2 = this.options.underflow.toLowerCase();
    t2 === "center" ? (this.underflowX = 0, this.underflowY = 0) : (t2.includes("left") ? this.underflowX = -1 : t2.includes("right") ? this.underflowX = 1 : this.underflowX = 0, t2.includes("top") ? this.underflowY = -1 : t2.includes("bottom") ? this.underflowY = 1 : this.underflowY = 0);
  }
  checkButtons(t2) {
    const i2 = t2.pointerType === "mouse", e3 = this.parent.input.count();
    return !!((e3 === 1 || e3 > 1 && !this.parent.plugins.get("pinch", true)) && (!i2 || this.mouse[t2.button]));
  }
  checkKeyPress(t2) {
    return !this.options.keyToPress || this.keyIsPressed || this.options.ignoreKeyToPressOnTouch && t2.data.pointerType === "touch";
  }
  down(t2) {
    return this.paused || !this.options.pressDrag ? false : this.checkButtons(t2) && this.checkKeyPress(t2) ? (this.last = { x: t2.global.x, y: t2.global.y }, this.current = t2.pointerId, true) : (this.last = null, false);
  }
  get active() {
    return this.moved;
  }
  move(t2) {
    if (this.paused || !this.options.pressDrag)
      return false;
    if (this.last && this.current === t2.data.pointerId) {
      const i2 = t2.global.x, e3 = t2.global.y, n2 = this.parent.input.count();
      if (n2 === 1 || n2 > 1 && !this.parent.plugins.get("pinch", true)) {
        const s2 = i2 - this.last.x, h2 = e3 - this.last.y;
        if (this.moved || this.xDirection && this.parent.input.checkThreshold(s2) || this.yDirection && this.parent.input.checkThreshold(h2)) {
          const a2 = { x: i2, y: e3 };
          return this.xDirection && (this.parent.x += (a2.x - this.last.x) * this.options.factor), this.yDirection && (this.parent.y += (a2.y - this.last.y) * this.options.factor), this.last = a2, this.moved || this.parent.emit("drag-start", {
            event: t2,
            screen: new Point(this.last.x, this.last.y),
            world: this.parent.toWorld(new Point(this.last.x, this.last.y)),
            viewport: this.parent
          }), this.moved = true, this.parent.emit("moved", { viewport: this.parent, type: "drag" }), true;
        }
      } else
        this.moved = false;
    }
    return false;
  }
  up(t2) {
    if (this.paused)
      return false;
    const i2 = this.parent.input.touches;
    if (i2.length === 1) {
      const e3 = i2[0];
      return e3.last && (this.last = { x: e3.last.x, y: e3.last.y }, this.current = e3.id), this.moved = false, true;
    } else if (this.last && this.moved) {
      const e3 = new Point(this.last.x, this.last.y);
      return this.parent.emit("drag-end", {
        event: t2,
        screen: e3,
        world: this.parent.toWorld(e3),
        viewport: this.parent
      }), this.last = null, this.moved = false, true;
    }
    return false;
  }
  wheel(t2) {
    if (this.paused)
      return false;
    if (this.options.wheel) {
      const i2 = this.parent.plugins.get("wheel", true);
      if (!i2 || !i2.options.wheelZoom && !t2.ctrlKey) {
        const e3 = t2.deltaMode ? this.options.lineHeight : 1, n2 = [t2.deltaX, t2.deltaY], [s2, h2] = this.options.wheelSwapAxes ? n2.reverse() : n2;
        return this.xDirection && (this.parent.x += s2 * e3 * this.options.wheelScroll * this.reverse), this.yDirection && (this.parent.y += h2 * e3 * this.options.wheelScroll * this.reverse), this.options.clampWheel && this.clamp(), this.parent.emit("wheel-scroll", this.parent), this.parent.emit("moved", { viewport: this.parent, type: "wheel" }), this.parent.options.passiveWheel || t2.preventDefault(), this.parent.options.stopPropagation && t2.stopPropagation(), true;
      }
    }
    return false;
  }
  resume() {
    this.last = null, this.paused = false;
  }
  clamp() {
    const t2 = this.parent.plugins.get("decelerate", true) || {};
    if (this.options.clampWheel !== "y")
      if (this.parent.screenWorldWidth < this.parent.screenWidth)
        switch (this.underflowX) {
          case -1:
            this.parent.x = 0;
            break;
          case 1:
            this.parent.x = this.parent.screenWidth - this.parent.screenWorldWidth;
            break;
          default:
            this.parent.x = (this.parent.screenWidth - this.parent.screenWorldWidth) / 2;
        }
      else
        this.parent.left < 0 ? (this.parent.x = 0, t2.x = 0) : this.parent.right > this.parent.worldWidth && (this.parent.x = -this.parent.worldWidth * this.parent.scale.x + this.parent.screenWidth, t2.x = 0);
    if (this.options.clampWheel !== "x")
      if (this.parent.screenWorldHeight < this.parent.screenHeight)
        switch (this.underflowY) {
          case -1:
            this.parent.y = 0;
            break;
          case 1:
            this.parent.y = this.parent.screenHeight - this.parent.screenWorldHeight;
            break;
          default:
            this.parent.y = (this.parent.screenHeight - this.parent.screenWorldHeight) / 2;
        }
      else
        this.parent.top < 0 && (this.parent.y = 0, t2.y = 0), this.parent.bottom > this.parent.worldHeight && (this.parent.y = -this.parent.worldHeight * this.parent.scale.y + this.parent.screenHeight, t2.y = 0);
  }
};
var V = {
  speed: 0,
  acceleration: null,
  radius: null
};
var F = class extends f3 {
  constructor(t2, i2, e3 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "target");
    o2(this, "velocity");
    this.target = i2, this.options = Object.assign({}, V, e3), this.velocity = { x: 0, y: 0 };
  }
  update(t2) {
    if (this.paused)
      return;
    const i2 = this.parent.center;
    let e3 = this.target.x, n2 = this.target.y;
    if (this.options.radius)
      if (Math.sqrt(Math.pow(this.target.y - i2.y, 2) + Math.pow(this.target.x - i2.x, 2)) > this.options.radius) {
        const p3 = Math.atan2(this.target.y - i2.y, this.target.x - i2.x);
        e3 = this.target.x - Math.cos(p3) * this.options.radius, n2 = this.target.y - Math.sin(p3) * this.options.radius;
      } else
        return;
    const s2 = e3 - i2.x, h2 = n2 - i2.y;
    if (s2 || h2)
      if (this.options.speed)
        if (this.options.acceleration) {
          const a2 = Math.atan2(n2 - i2.y, e3 - i2.x), p3 = Math.sqrt(Math.pow(s2, 2) + Math.pow(h2, 2));
          if (p3) {
            const l3 = (Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2)) / (2 * this.options.acceleration);
            p3 > l3 ? this.velocity = {
              x: Math.min(this.velocity.x + (this.options.acceleration * t2, this.options.speed)),
              y: Math.min(this.velocity.y + (this.options.acceleration * t2, this.options.speed))
            } : this.velocity = {
              x: Math.max(this.velocity.x - this.options.acceleration * this.options.speed, 0),
              y: Math.max(this.velocity.y - this.options.acceleration * this.options.speed, 0)
            };
            const d2 = Math.cos(a2) * this.velocity.x, m2 = Math.sin(a2) * this.velocity.y, y2 = Math.abs(d2) > Math.abs(s2) ? e3 : i2.x + d2, x2 = Math.abs(m2) > Math.abs(h2) ? n2 : i2.y + m2;
            this.parent.moveCenter(y2, x2), this.parent.emit("moved", { viewport: this.parent, type: "follow" });
          }
        } else {
          const a2 = Math.atan2(n2 - i2.y, e3 - i2.x), p3 = Math.cos(a2) * this.options.speed, l3 = Math.sin(a2) * this.options.speed, d2 = Math.abs(p3) > Math.abs(s2) ? e3 : i2.x + p3, m2 = Math.abs(l3) > Math.abs(h2) ? n2 : i2.y + l3;
          this.parent.moveCenter(d2, m2), this.parent.emit("moved", { viewport: this.parent, type: "follow" });
        }
      else
        this.parent.moveCenter(e3, n2), this.parent.emit("moved", { viewport: this.parent, type: "follow" });
  }
};
var B = {
  radius: null,
  distance: null,
  top: null,
  bottom: null,
  left: null,
  right: null,
  speed: 8,
  reverse: false,
  noDecelerate: false,
  linear: false,
  allowButtons: false
};
var N2 = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "reverse");
    o2(this, "radiusSquared");
    o2(this, "left");
    o2(this, "top");
    o2(this, "right");
    o2(this, "bottom");
    o2(this, "horizontal");
    o2(this, "vertical");
    this.options = Object.assign({}, B, i2), this.reverse = this.options.reverse ? 1 : -1, this.radiusSquared = typeof this.options.radius == "number" ? Math.pow(this.options.radius, 2) : null, this.resize();
  }
  resize() {
    const t2 = this.options.distance;
    t2 !== null ? (this.left = t2, this.top = t2, this.right = this.parent.screenWidth - t2, this.bottom = this.parent.screenHeight - t2) : this.options.radius || (this.left = this.options.left, this.top = this.options.top, this.right = this.options.right === null ? null : this.parent.screenWidth - this.options.right, this.bottom = this.options.bottom === null ? null : this.parent.screenHeight - this.options.bottom);
  }
  down() {
    return this.paused || this.options.allowButtons || (this.horizontal = this.vertical = null), false;
  }
  move(t2) {
    if (this.paused || t2.pointerType !== "mouse" && t2.pointerId !== 1 || !this.options.allowButtons && t2.buttons !== 0)
      return false;
    const i2 = t2.global.x, e3 = t2.global.y;
    if (this.radiusSquared) {
      const n2 = this.parent.toScreen(this.parent.center);
      if (Math.pow(n2.x - i2, 2) + Math.pow(n2.y - e3, 2) >= this.radiusSquared) {
        const h2 = Math.atan2(n2.y - e3, n2.x - i2);
        this.options.linear ? (this.horizontal = Math.round(Math.cos(h2)) * this.options.speed * this.reverse * (60 / 1e3), this.vertical = Math.round(Math.sin(h2)) * this.options.speed * this.reverse * (60 / 1e3)) : (this.horizontal = Math.cos(h2) * this.options.speed * this.reverse * (60 / 1e3), this.vertical = Math.sin(h2) * this.options.speed * this.reverse * (60 / 1e3));
      } else
        this.horizontal && this.decelerateHorizontal(), this.vertical && this.decelerateVertical(), this.horizontal = this.vertical = 0;
    } else
      this.left !== null && i2 < this.left ? this.horizontal = Number(this.reverse) * this.options.speed * (60 / 1e3) : this.right !== null && i2 > this.right ? this.horizontal = -1 * this.reverse * this.options.speed * (60 / 1e3) : (this.decelerateHorizontal(), this.horizontal = 0), this.top !== null && e3 < this.top ? this.vertical = Number(this.reverse) * this.options.speed * (60 / 1e3) : this.bottom !== null && e3 > this.bottom ? this.vertical = -1 * this.reverse * this.options.speed * (60 / 1e3) : (this.decelerateVertical(), this.vertical = 0);
    return false;
  }
  decelerateHorizontal() {
    const t2 = this.parent.plugins.get("decelerate", true);
    this.horizontal && t2 && !this.options.noDecelerate && t2.activate({ x: this.horizontal * this.options.speed * this.reverse / (1e3 / 60) });
  }
  decelerateVertical() {
    const t2 = this.parent.plugins.get("decelerate", true);
    this.vertical && t2 && !this.options.noDecelerate && t2.activate({ y: this.vertical * this.options.speed * this.reverse / (1e3 / 60) });
  }
  up() {
    return this.paused || (this.horizontal && this.decelerateHorizontal(), this.vertical && this.decelerateVertical(), this.horizontal = this.vertical = null), false;
  }
  update() {
    if (!this.paused && (this.horizontal || this.vertical)) {
      const t2 = this.parent.center;
      this.horizontal && (t2.x += this.horizontal * this.options.speed), this.vertical && (t2.y += this.vertical * this.options.speed), this.parent.moveCenter(t2), this.parent.emit("moved", { viewport: this.parent, type: "mouse-edges" });
    }
  }
};
var Z = {
  noDrag: false,
  percent: 1,
  center: null,
  factor: 1,
  axis: "all"
};
var R = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "active", false);
    o2(this, "pinching", false);
    o2(this, "moved", false);
    o2(this, "lastCenter");
    this.options = Object.assign({}, Z, i2);
  }
  down() {
    return this.parent.input.count() >= 2 ? (this.active = true, true) : false;
  }
  isAxisX() {
    return ["all", "x"].includes(this.options.axis);
  }
  isAxisY() {
    return ["all", "y"].includes(this.options.axis);
  }
  move(t2) {
    if (this.paused || !this.active)
      return false;
    const i2 = t2.global.x, e3 = t2.global.y, n2 = this.parent.input.touches;
    if (n2.length >= 2) {
      const s2 = n2[0], h2 = n2[1], a2 = s2.last && h2.last ? Math.sqrt(Math.pow(h2.last.x - s2.last.x, 2) + Math.pow(h2.last.y - s2.last.y, 2)) : null;
      if (s2.id === t2.pointerId ? s2.last = { x: i2, y: e3, data: t2 } : h2.id === t2.pointerId && (h2.last = { x: i2, y: e3, data: t2 }), a2) {
        let p3;
        const l3 = new Point(
          s2.last.x + (h2.last.x - s2.last.x) / 2,
          s2.last.y + (h2.last.y - s2.last.y) / 2
        );
        this.options.center || (p3 = this.parent.toLocal(l3));
        let d2 = Math.sqrt(Math.pow(
          h2.last.x - s2.last.x,
          2
        ) + Math.pow(h2.last.y - s2.last.y, 2));
        d2 = d2 === 0 ? d2 = 1e-10 : d2;
        const m2 = (1 - a2 / d2) * this.options.percent * (this.isAxisX() ? this.parent.scale.x : this.parent.scale.y);
        this.isAxisX() && (this.parent.scale.x += m2), this.isAxisY() && (this.parent.scale.y += m2), this.parent.emit("zoomed", { viewport: this.parent, type: "pinch", center: l3 });
        const y2 = this.parent.plugins.get("clamp-zoom", true);
        if (y2 && y2.clamp(), this.options.center)
          this.parent.moveCenter(this.options.center);
        else {
          const x2 = this.parent.toGlobal(p3);
          this.parent.x += (l3.x - x2.x) * this.options.factor, this.parent.y += (l3.y - x2.y) * this.options.factor, this.parent.emit("moved", { viewport: this.parent, type: "pinch" });
        }
        !this.options.noDrag && this.lastCenter && (this.parent.x += (l3.x - this.lastCenter.x) * this.options.factor, this.parent.y += (l3.y - this.lastCenter.y) * this.options.factor, this.parent.emit("moved", { viewport: this.parent, type: "pinch" })), this.lastCenter = l3, this.moved = true;
      } else
        this.pinching || (this.parent.emit("pinch-start", this.parent), this.pinching = true);
      return true;
    }
    return false;
  }
  up() {
    return this.pinching && this.parent.input.touches.length <= 1 ? (this.active = false, this.lastCenter = null, this.pinching = false, this.moved = false, this.parent.emit("pinch-end", this.parent), true) : false;
  }
};
var j2 = {
  topLeft: false,
  friction: 0.8,
  time: 1e3,
  ease: "easeInOutSine",
  interrupt: true,
  removeOnComplete: false,
  removeOnInterrupt: false,
  forceStart: false
};
var q = class extends f3 {
  constructor(t2, i2, e3, n2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "ease");
    o2(this, "x");
    o2(this, "y");
    o2(this, "percent");
    o2(this, "snapping");
    o2(this, "deltaX");
    o2(this, "deltaY");
    o2(this, "startX");
    o2(this, "startY");
    this.options = Object.assign({}, j2, n2), this.ease = W(n2.ease, "easeInOutSine"), this.x = i2, this.y = e3, this.options.forceStart && this.snapStart();
  }
  snapStart() {
    this.percent = 0, this.snapping = { time: 0 };
    const t2 = this.options.topLeft ? this.parent.corner : this.parent.center;
    this.deltaX = this.x - t2.x, this.deltaY = this.y - t2.y, this.startX = t2.x, this.startY = t2.y, this.parent.emit("snap-start", this.parent);
  }
  wheel() {
    return this.options.removeOnInterrupt && this.parent.plugins.remove("snap"), false;
  }
  down() {
    return this.options.removeOnInterrupt ? this.parent.plugins.remove("snap") : this.options.interrupt && (this.snapping = null), false;
  }
  up() {
    if (this.parent.input.count() === 0) {
      const t2 = this.parent.plugins.get("decelerate", true);
      t2 && (t2.x || t2.y) && (t2.percentChangeX = t2.percentChangeY = this.options.friction);
    }
    return false;
  }
  update(t2) {
    if (!this.paused && !(this.options.interrupt && this.parent.input.count() !== 0))
      if (this.snapping) {
        const i2 = this.snapping;
        i2.time += t2;
        let e3, n2, s2;
        const h2 = this.startX, a2 = this.startY, p3 = this.deltaX, l3 = this.deltaY;
        if (i2.time > this.options.time)
          e3 = true, n2 = h2 + p3, s2 = a2 + l3;
        else {
          const d2 = this.ease(i2.time, 0, 1, this.options.time);
          n2 = h2 + p3 * d2, s2 = a2 + l3 * d2;
        }
        this.options.topLeft ? this.parent.moveCorner(n2, s2) : this.parent.moveCenter(n2, s2), this.parent.emit("moved", { viewport: this.parent, type: "snap" }), e3 && (this.options.removeOnComplete && this.parent.plugins.remove("snap"), this.parent.emit("snap-end", this.parent), this.snapping = null);
      } else {
        const i2 = this.options.topLeft ? this.parent.corner : this.parent.center;
        (i2.x !== this.x || i2.y !== this.y) && this.snapStart();
      }
  }
};
var K = {
  width: 0,
  height: 0,
  time: 1e3,
  ease: "easeInOutSine",
  center: null,
  interrupt: true,
  removeOnComplete: false,
  removeOnInterrupt: false,
  forceStart: false,
  noMove: false
};
var G = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "ease");
    o2(this, "xScale");
    o2(this, "yScale");
    o2(this, "xIndependent");
    o2(this, "yIndependent");
    o2(this, "snapping");
    this.options = Object.assign({}, K, i2), this.ease = W(this.options.ease), this.xIndependent = false, this.yIndependent = false, this.xScale = 0, this.yScale = 0, this.options.width > 0 && (this.xScale = t2.screenWidth / this.options.width, this.xIndependent = true), this.options.height > 0 && (this.yScale = t2.screenHeight / this.options.height, this.yIndependent = true), this.xScale = this.xIndependent ? this.xScale : this.yScale, this.yScale = this.yIndependent ? this.yScale : this.xScale, this.options.time === 0 ? (t2.container.scale.x = this.xScale, t2.container.scale.y = this.yScale, this.options.removeOnComplete && this.parent.plugins.remove("snap-zoom")) : i2.forceStart && this.createSnapping();
  }
  createSnapping() {
    const t2 = this.parent.worldScreenWidth, i2 = this.parent.worldScreenHeight, e3 = this.parent.screenWidth / this.xScale, n2 = this.parent.screenHeight / this.yScale;
    this.snapping = {
      time: 0,
      startX: t2,
      startY: i2,
      deltaX: e3 - t2,
      deltaY: n2 - i2
    }, this.parent.emit("snap-zoom-start", this.parent);
  }
  resize() {
    this.snapping = null, this.options.width > 0 && (this.xScale = this.parent.screenWidth / this.options.width), this.options.height > 0 && (this.yScale = this.parent.screenHeight / this.options.height), this.xScale = this.xIndependent ? this.xScale : this.yScale, this.yScale = this.yIndependent ? this.yScale : this.xScale;
  }
  wheel() {
    return this.options.removeOnInterrupt && this.parent.plugins.remove("snap-zoom"), false;
  }
  down() {
    return this.options.removeOnInterrupt ? this.parent.plugins.remove("snap-zoom") : this.options.interrupt && (this.snapping = null), false;
  }
  update(t2) {
    if (this.paused || this.options.interrupt && this.parent.input.count() !== 0)
      return;
    let i2;
    if (!this.options.center && !this.options.noMove && (i2 = this.parent.center), !this.snapping)
      (this.parent.scale.x !== this.xScale || this.parent.scale.y !== this.yScale) && this.createSnapping();
    else if (this.snapping) {
      const e3 = this.snapping;
      if (e3.time += t2, e3.time >= this.options.time)
        this.parent.scale.set(this.xScale, this.yScale), this.options.removeOnComplete && this.parent.plugins.remove("snap-zoom"), this.parent.emit("snap-zoom-end", this.parent), this.snapping = null;
      else {
        const s2 = this.snapping, h2 = this.ease(s2.time, s2.startX, s2.deltaX, this.options.time), a2 = this.ease(s2.time, s2.startY, s2.deltaY, this.options.time);
        this.parent.scale.x = this.parent.screenWidth / h2, this.parent.scale.y = this.parent.screenHeight / a2;
      }
      const n2 = this.parent.plugins.get("clamp-zoom", true);
      n2 && n2.clamp(), this.options.noMove || (this.options.center ? this.parent.moveCenter(this.options.center) : this.parent.moveCenter(i2));
    }
  }
  resume() {
    this.snapping = null, super.resume();
  }
};
var Q = {
  percent: 0.1,
  smooth: false,
  interrupt: true,
  reverse: false,
  center: null,
  lineHeight: 20,
  axis: "all",
  keyToPress: null,
  trackpadPinch: false,
  wheelZoom: true
};
var J = class extends f3 {
  constructor(t2, i2 = {}) {
    super(t2);
    o2(this, "options");
    o2(this, "smoothing");
    o2(this, "smoothingCenter");
    o2(this, "smoothingCount");
    o2(this, "keyIsPressed");
    this.options = Object.assign({}, Q, i2), this.keyIsPressed = false, this.options.keyToPress && this.handleKeyPresses(this.options.keyToPress);
  }
  handleKeyPresses(t2) {
    window.addEventListener("keydown", (i2) => {
      t2.includes(i2.code) && (this.keyIsPressed = true);
    }), window.addEventListener("keyup", (i2) => {
      t2.includes(i2.code) && (this.keyIsPressed = false);
    });
  }
  checkKeyPress() {
    return !this.options.keyToPress || this.keyIsPressed;
  }
  down() {
    return this.options.interrupt && (this.smoothing = null), false;
  }
  isAxisX() {
    return ["all", "x"].includes(this.options.axis);
  }
  isAxisY() {
    return ["all", "y"].includes(this.options.axis);
  }
  update() {
    if (this.smoothing) {
      const t2 = this.smoothingCenter, i2 = this.smoothing;
      let e3;
      this.options.center || (e3 = this.parent.toLocal(t2)), this.isAxisX() && (this.parent.scale.x += i2.x), this.isAxisY() && (this.parent.scale.y += i2.y), this.parent.emit("zoomed", { viewport: this.parent, type: "wheel" });
      const n2 = this.parent.plugins.get("clamp-zoom", true);
      if (n2 && n2.clamp(), this.options.center)
        this.parent.moveCenter(this.options.center);
      else {
        const s2 = this.parent.toGlobal(e3);
        this.parent.x += t2.x - s2.x, this.parent.y += t2.y - s2.y;
      }
      this.parent.emit("moved", { viewport: this.parent, type: "wheel" }), this.smoothingCount++, this.smoothingCount >= this.options.smooth && (this.smoothing = null);
    }
  }
  pinch(t2) {
    if (this.paused)
      return;
    const i2 = this.parent.input.getPointerPosition(t2), e3 = -t2.deltaY * (t2.deltaMode ? this.options.lineHeight : 1) / 200, n2 = Math.pow(2, (1 + this.options.percent) * e3);
    let s2;
    this.options.center || (s2 = this.parent.toLocal(i2)), this.isAxisX() && (this.parent.scale.x *= n2), this.isAxisY() && (this.parent.scale.y *= n2), this.parent.emit("zoomed", { viewport: this.parent, type: "wheel" });
    const h2 = this.parent.plugins.get("clamp-zoom", true);
    if (h2 && h2.clamp(), this.options.center)
      this.parent.moveCenter(this.options.center);
    else {
      const a2 = this.parent.toGlobal(s2);
      this.parent.x += i2.x - a2.x, this.parent.y += i2.y - a2.y;
    }
    this.parent.emit("moved", { viewport: this.parent, type: "wheel" }), this.parent.emit(
      "wheel-start",
      { event: t2, viewport: this.parent }
    );
  }
  wheel(t2) {
    if (this.paused || !this.checkKeyPress())
      return false;
    if (t2.ctrlKey && this.options.trackpadPinch)
      this.pinch(t2);
    else if (this.options.wheelZoom) {
      const i2 = this.parent.input.getPointerPosition(t2), n2 = (this.options.reverse ? -1 : 1) * -t2.deltaY * (t2.deltaMode ? this.options.lineHeight : 1) / 500, s2 = Math.pow(2, (1 + this.options.percent) * n2);
      if (this.options.smooth) {
        const h2 = {
          x: this.smoothing ? this.smoothing.x * (this.options.smooth - this.smoothingCount) : 0,
          y: this.smoothing ? this.smoothing.y * (this.options.smooth - this.smoothingCount) : 0
        };
        this.smoothing = {
          x: ((this.parent.scale.x + h2.x) * s2 - this.parent.scale.x) / this.options.smooth,
          y: ((this.parent.scale.y + h2.y) * s2 - this.parent.scale.y) / this.options.smooth
        }, this.smoothingCount = 0, this.smoothingCenter = i2;
      } else {
        let h2;
        this.options.center || (h2 = this.parent.toLocal(i2)), this.isAxisX() && (this.parent.scale.x *= s2), this.isAxisY() && (this.parent.scale.y *= s2), this.parent.emit("zoomed", { viewport: this.parent, type: "wheel" });
        const a2 = this.parent.plugins.get("clamp-zoom", true);
        if (a2 && a2.clamp(), this.options.center)
          this.parent.moveCenter(this.options.center);
        else {
          const p3 = this.parent.toGlobal(h2);
          this.parent.x += i2.x - p3.x, this.parent.y += i2.y - p3.y;
        }
      }
      this.parent.emit("moved", { viewport: this.parent, type: "wheel" }), this.parent.emit(
        "wheel-start",
        { event: t2, viewport: this.parent }
      );
    }
    return !this.parent.options.passiveWheel;
  }
};
var $2 = class {
  constructor(r2) {
    o2(this, "viewport");
    o2(this, "clickedAvailable");
    o2(this, "isMouseDown");
    o2(this, "last");
    o2(this, "wheelFunction");
    o2(this, "touches");
    this.viewport = r2, this.touches = [], this.addListeners();
  }
  addListeners() {
    this.viewport.interactive = true, this.viewport.forceHitArea || (this.viewport.hitArea = new Rectangle(0, 0, this.viewport.worldWidth, this.viewport.worldHeight)), this.viewport.on("pointerdown", this.down, this), this.viewport.options.allowPreserveDragOutside ? this.viewport.on("globalpointermove", this.move, this) : this.viewport.on("pointermove", this.move, this), this.viewport.on("pointerup", this.up, this), this.viewport.on("pointerupoutside", this.up, this), this.viewport.on("pointercancel", this.up, this), this.viewport.options.allowPreserveDragOutside || this.viewport.on("pointerleave", this.up, this), this.wheelFunction = (r2) => this.handleWheel(r2), this.viewport.options.events.domElement.addEventListener(
      "wheel",
      this.wheelFunction,
      { passive: this.viewport.options.passiveWheel }
    ), this.isMouseDown = false;
  }
  destroy() {
    this.viewport.options.events.domElement.removeEventListener("wheel", this.wheelFunction);
  }
  down(r2) {
    if (this.viewport.pause || !this.viewport.worldVisible)
      return;
    if (r2.pointerType === "mouse" ? this.isMouseDown = true : this.get(r2.pointerId) || this.touches.push({ id: r2.pointerId, last: null }), this.count() === 1) {
      this.last = r2.global.clone();
      const i2 = this.viewport.plugins.get("decelerate", true), e3 = this.viewport.plugins.get("bounce", true);
      (!i2 || !i2.isActive()) && (!e3 || !e3.isActive()) ? this.clickedAvailable = true : this.clickedAvailable = false;
    } else
      this.clickedAvailable = false;
    this.viewport.plugins.down(r2) && this.viewport.options.stopPropagation && r2.stopPropagation();
  }
  clear() {
    this.isMouseDown = false, this.touches = [], this.last = null;
  }
  checkThreshold(r2) {
    return Math.abs(r2) >= this.viewport.threshold;
  }
  move(r2) {
    if (this.viewport.pause || !this.viewport.worldVisible)
      return;
    const t2 = this.viewport.plugins.move(r2);
    if (this.clickedAvailable && this.last) {
      const i2 = r2.global.x - this.last.x, e3 = r2.global.y - this.last.y;
      (this.checkThreshold(i2) || this.checkThreshold(e3)) && (this.clickedAvailable = false);
    }
    t2 && this.viewport.options.stopPropagation && r2.stopPropagation();
  }
  up(r2) {
    if (this.viewport.pause || !this.viewport.worldVisible)
      return;
    r2.pointerType === "mouse" && (this.isMouseDown = false), r2.pointerType !== "mouse" && this.remove(r2.pointerId);
    const t2 = this.viewport.plugins.up(r2);
    this.clickedAvailable && this.count() === 0 && this.last && (this.viewport.emit("clicked", {
      event: r2,
      screen: this.last,
      world: this.viewport.toWorld(this.last),
      viewport: this.viewport
    }), this.clickedAvailable = false), t2 && this.viewport.options.stopPropagation && r2.stopPropagation();
  }
  getPointerPosition(r2) {
    const t2 = new Point();
    return this.viewport.options.events.mapPositionToPoint(t2, r2.clientX, r2.clientY), t2;
  }
  handleWheel(r2) {
    if (this.viewport.pause || !this.viewport.worldVisible)
      return;
    const t2 = this.viewport.toLocal(this.getPointerPosition(r2));
    this.viewport.left <= t2.x && t2.x <= this.viewport.right && this.viewport.top <= t2.y && t2.y <= this.viewport.bottom && this.viewport.plugins.wheel(r2) && !this.viewport.options.passiveWheel && r2.preventDefault();
  }
  pause() {
    this.touches = [], this.isMouseDown = false;
  }
  get(r2) {
    for (const t2 of this.touches)
      if (t2.id === r2)
        return t2;
    return null;
  }
  remove(r2) {
    for (let t2 = 0; t2 < this.touches.length; t2++)
      if (this.touches[t2].id === r2) {
        this.touches.splice(t2, 1);
        return;
      }
  }
  count() {
    return (this.isMouseDown ? 1 : 0) + this.touches.length;
  }
};
var w2 = [
  "drag",
  "pinch",
  "wheel",
  "follow",
  "mouse-edges",
  "decelerate",
  "animate",
  "bounce",
  "snap-zoom",
  "clamp-zoom",
  "snap",
  "clamp"
];
var tt = class {
  constructor(r2) {
    o2(this, "plugins");
    o2(this, "list");
    o2(this, "viewport");
    this.viewport = r2, this.list = [], this.plugins = {};
  }
  add(r2, t2, i2 = w2.length) {
    const e3 = this.plugins[r2];
    e3 && e3.destroy(), this.plugins[r2] = t2;
    const n2 = w2.indexOf(r2);
    n2 !== -1 && w2.splice(n2, 1), w2.splice(i2, 0, r2), this.sort();
  }
  get(r2, t2) {
    var i2;
    return t2 && (i2 = this.plugins[r2]) != null && i2.paused ? null : this.plugins[r2];
  }
  update(r2) {
    for (const t2 of this.list)
      t2.update(r2);
  }
  resize() {
    for (const r2 of this.list)
      r2.resize();
  }
  reset() {
    for (const r2 of this.list)
      r2.reset();
  }
  removeAll() {
    this.list.forEach((r2) => {
      r2.destroy();
    }), this.plugins = {}, this.sort();
  }
  remove(r2) {
    var t2;
    this.plugins[r2] && ((t2 = this.plugins[r2]) == null || t2.destroy(), delete this.plugins[r2], this.viewport.emit("plugin-remove", r2), this.sort());
  }
  pause(r2) {
    var t2;
    (t2 = this.plugins[r2]) == null || t2.pause();
  }
  resume(r2) {
    var t2;
    (t2 = this.plugins[r2]) == null || t2.resume();
  }
  sort() {
    this.list = [];
    for (const r2 of w2)
      this.plugins[r2] && this.list.push(this.plugins[r2]);
  }
  down(r2) {
    let t2 = false;
    for (const i2 of this.list)
      i2.down(r2) && (t2 = true);
    return t2;
  }
  move(r2) {
    let t2 = false;
    for (const i2 of this.viewport.plugins.list)
      i2.move(r2) && (t2 = true);
    return t2;
  }
  up(r2) {
    let t2 = false;
    for (const i2 of this.list)
      i2.up(r2) && (t2 = true);
    return t2;
  }
  wheel(r2) {
    let t2 = false;
    for (const i2 of this.list)
      i2.wheel(r2) && (t2 = true);
    return t2;
  }
};
var et = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: null,
  worldHeight: null,
  threshold: 5,
  passiveWheel: true,
  stopPropagation: false,
  forceHitArea: null,
  noTicker: false,
  disableOnContextMenu: false,
  ticker: Ticker.shared,
  allowPreserveDragOutside: false
};
var ht = class extends Container {
  constructor(t2) {
    super();
    o2(this, "moving");
    o2(this, "screenWidth");
    o2(this, "screenHeight");
    o2(this, "threshold");
    o2(this, "input");
    o2(this, "plugins");
    o2(this, "zooming");
    o2(this, "lastViewport");
    o2(this, "options");
    o2(this, "_dirty");
    o2(this, "_forceHitArea");
    o2(this, "_hitAreaDefault");
    o2(this, "_pause");
    o2(this, "tickerFunction");
    o2(this, "_worldWidth");
    o2(this, "_worldHeight");
    o2(this, "_disableOnContextMenu", (t3) => t3.preventDefault());
    this.options = {
      ...et,
      ...t2
    }, this.screenWidth = this.options.screenWidth, this.screenHeight = this.options.screenHeight, this._worldWidth = this.options.worldWidth, this._worldHeight = this.options.worldHeight, this.forceHitArea = this.options.forceHitArea, this.threshold = this.options.threshold, this.options.disableOnContextMenu && this.options.events.domElement.addEventListener("contextmenu", this._disableOnContextMenu), this.options.noTicker || (this.tickerFunction = () => this.update(this.options.ticker.elapsedMS), this.options.ticker.add(this.tickerFunction)), this.input = new $2(this), this.plugins = new tt(this);
  }
  destroy(t2) {
    !this.options.noTicker && this.tickerFunction && this.options.ticker.remove(this.tickerFunction), this.options.disableOnContextMenu && this.options.events.domElement.removeEventListener("contextmenu", this._disableOnContextMenu), this.input.destroy(), super.destroy(t2);
  }
  update(t2) {
    this.pause || (this.plugins.update(t2), this.lastViewport && (this.lastViewport.x !== this.x || this.lastViewport.y !== this.y ? this.moving = true : this.moving && (this.emit("moved-end", this), this.moving = false), this.lastViewport.scaleX !== this.scale.x || this.lastViewport.scaleY !== this.scale.y ? this.zooming = true : this.zooming && (this.emit("zoomed-end", this), this.zooming = false)), this.forceHitArea || (this._hitAreaDefault = new Rectangle(this.left, this.top, this.worldScreenWidth, this.worldScreenHeight), this.hitArea = this._hitAreaDefault), this._dirty = this._dirty || !this.lastViewport || this.lastViewport.x !== this.x || this.lastViewport.y !== this.y || this.lastViewport.scaleX !== this.scale.x || this.lastViewport.scaleY !== this.scale.y, this.lastViewport = {
      x: this.x,
      y: this.y,
      scaleX: this.scale.x,
      scaleY: this.scale.y
    }, this.emit("frame-end", this));
  }
  resize(t2 = window.innerWidth, i2 = window.innerHeight, e3, n2) {
    this.screenWidth = t2, this.screenHeight = i2, typeof e3 < "u" && (this._worldWidth = e3), typeof n2 < "u" && (this._worldHeight = n2), this.plugins.resize(), this.dirty = true;
  }
  get worldWidth() {
    return this._worldWidth ? this._worldWidth : this.width / this.scale.x;
  }
  set worldWidth(t2) {
    this._worldWidth = t2, this.plugins.resize();
  }
  get worldHeight() {
    return this._worldHeight ? this._worldHeight : this.height / this.scale.y;
  }
  set worldHeight(t2) {
    this._worldHeight = t2, this.plugins.resize();
  }
  getVisibleBounds() {
    return new Rectangle(this.left, this.top, this.worldScreenWidth, this.worldScreenHeight);
  }
  toWorld(t2, i2) {
    return arguments.length === 2 ? this.toLocal(new Point(t2, i2)) : this.toLocal(t2);
  }
  toScreen(t2, i2) {
    return arguments.length === 2 ? this.toGlobal(new Point(t2, i2)) : this.toGlobal(t2);
  }
  get worldScreenWidth() {
    return this.screenWidth / this.scale.x;
  }
  get worldScreenHeight() {
    return this.screenHeight / this.scale.y;
  }
  get screenWorldWidth() {
    return this.worldWidth * this.scale.x;
  }
  get screenWorldHeight() {
    return this.worldHeight * this.scale.y;
  }
  get center() {
    return new Point(
      this.worldScreenWidth / 2 - this.x / this.scale.x,
      this.worldScreenHeight / 2 - this.y / this.scale.y
    );
  }
  set center(t2) {
    this.moveCenter(t2);
  }
  moveCenter(...t2) {
    let i2, e3;
    typeof t2[0] == "number" ? (i2 = t2[0], e3 = t2[1]) : (i2 = t2[0].x, e3 = t2[0].y);
    const n2 = (this.worldScreenWidth / 2 - i2) * this.scale.x, s2 = (this.worldScreenHeight / 2 - e3) * this.scale.y;
    return (this.x !== n2 || this.y !== s2) && (this.position.set(n2, s2), this.plugins.reset(), this.dirty = true), this;
  }
  get corner() {
    return new Point(-this.x / this.scale.x, -this.y / this.scale.y);
  }
  set corner(t2) {
    this.moveCorner(t2);
  }
  moveCorner(...t2) {
    let i2, e3;
    return t2.length === 1 ? (i2 = -t2[0].x * this.scale.x, e3 = -t2[0].y * this.scale.y) : (i2 = -t2[0] * this.scale.x, e3 = -t2[1] * this.scale.y), (i2 !== this.x || e3 !== this.y) && (this.position.set(i2, e3), this.plugins.reset(), this.dirty = true), this;
  }
  get screenWidthInWorldPixels() {
    return this.screenWidth / this.scale.x;
  }
  get screenHeightInWorldPixels() {
    return this.screenHeight / this.scale.y;
  }
  findFitWidth(t2) {
    return this.screenWidth / t2;
  }
  findFitHeight(t2) {
    return this.screenHeight / t2;
  }
  findFit(t2, i2) {
    const e3 = this.screenWidth / t2, n2 = this.screenHeight / i2;
    return Math.min(e3, n2);
  }
  findCover(t2, i2) {
    const e3 = this.screenWidth / t2, n2 = this.screenHeight / i2;
    return Math.max(e3, n2);
  }
  fitWidth(t2 = this.worldWidth, i2, e3 = true, n2) {
    let s2;
    i2 && (s2 = this.center), this.scale.x = this.screenWidth / t2, e3 && (this.scale.y = this.scale.x);
    const h2 = this.plugins.get("clamp-zoom", true);
    return !n2 && h2 && h2.clamp(), i2 && s2 && this.moveCenter(s2), this;
  }
  fitHeight(t2 = this.worldHeight, i2, e3 = true, n2) {
    let s2;
    i2 && (s2 = this.center), this.scale.y = this.screenHeight / t2, e3 && (this.scale.x = this.scale.y);
    const h2 = this.plugins.get("clamp-zoom", true);
    return !n2 && h2 && h2.clamp(), i2 && s2 && this.moveCenter(s2), this;
  }
  fitWorld(t2) {
    let i2;
    t2 && (i2 = this.center), this.scale.x = this.screenWidth / this.worldWidth, this.scale.y = this.screenHeight / this.worldHeight, this.scale.x < this.scale.y ? this.scale.y = this.scale.x : this.scale.x = this.scale.y;
    const e3 = this.plugins.get("clamp-zoom", true);
    return e3 && e3.clamp(), t2 && i2 && this.moveCenter(i2), this;
  }
  fit(t2, i2 = this.worldWidth, e3 = this.worldHeight) {
    let n2;
    t2 && (n2 = this.center), this.scale.x = this.screenWidth / i2, this.scale.y = this.screenHeight / e3, this.scale.x < this.scale.y ? this.scale.y = this.scale.x : this.scale.x = this.scale.y;
    const s2 = this.plugins.get("clamp-zoom", true);
    return s2 && s2.clamp(), t2 && n2 && this.moveCenter(n2), this;
  }
  setZoom(t2, i2) {
    let e3;
    i2 && (e3 = this.center), this.scale.set(t2);
    const n2 = this.plugins.get("clamp-zoom", true);
    return n2 && n2.clamp(), i2 && e3 && this.moveCenter(e3), this;
  }
  zoomPercent(t2, i2) {
    return this.setZoom(this.scale.x + this.scale.x * t2, i2);
  }
  zoom(t2, i2) {
    return this.fitWidth(t2 + this.worldScreenWidth, i2), this;
  }
  get scaled() {
    return this.scale.x;
  }
  set scaled(t2) {
    this.setZoom(t2, true);
  }
  snapZoom(t2) {
    return this.plugins.add("snap-zoom", new G(this, t2)), this;
  }
  OOB() {
    return {
      left: this.left < 0,
      right: this.right > this.worldWidth,
      top: this.top < 0,
      bottom: this.bottom > this.worldHeight,
      cornerPoint: new Point(
        this.worldWidth * this.scale.x - this.screenWidth,
        this.worldHeight * this.scale.y - this.screenHeight
      )
    };
  }
  get right() {
    return -this.x / this.scale.x + this.worldScreenWidth;
  }
  set right(t2) {
    this.x = -t2 * this.scale.x + this.screenWidth, this.plugins.reset();
  }
  get left() {
    return -this.x / this.scale.x;
  }
  set left(t2) {
    this.x = -t2 * this.scale.x, this.plugins.reset();
  }
  get top() {
    return -this.y / this.scale.y;
  }
  set top(t2) {
    this.y = -t2 * this.scale.y, this.plugins.reset();
  }
  get bottom() {
    return -this.y / this.scale.y + this.worldScreenHeight;
  }
  set bottom(t2) {
    this.y = -t2 * this.scale.y + this.screenHeight, this.plugins.reset();
  }
  get dirty() {
    return !!this._dirty;
  }
  set dirty(t2) {
    this._dirty = t2;
  }
  get forceHitArea() {
    return this._forceHitArea;
  }
  set forceHitArea(t2) {
    t2 ? (this._forceHitArea = t2, this.hitArea = t2) : (this._forceHitArea = null, this.hitArea = new Rectangle(0, 0, this.worldWidth, this.worldHeight));
  }
  drag(t2) {
    return this.plugins.add("drag", new U(this, t2)), this;
  }
  clamp(t2) {
    return this.plugins.add("clamp", new A(this, t2)), this;
  }
  decelerate(t2) {
    return this.plugins.add("decelerate", new E(this, t2)), this;
  }
  bounce(t2) {
    return this.plugins.add("bounce", new X(this, t2)), this;
  }
  pinch(t2) {
    return this.plugins.add("pinch", new R(this, t2)), this;
  }
  snap(t2, i2, e3) {
    return this.plugins.add("snap", new q(this, t2, i2, e3)), this;
  }
  follow(t2, i2) {
    return this.plugins.add("follow", new F(this, t2, i2)), this;
  }
  wheel(t2) {
    return this.plugins.add("wheel", new J(this, t2)), this;
  }
  animate(t2) {
    return this.plugins.add("animate", new k2(this, t2)), this;
  }
  clampZoom(t2) {
    return this.plugins.add("clamp-zoom", new T(this, t2)), this;
  }
  mouseEdges(t2) {
    return this.plugins.add("mouse-edges", new N2(this, t2)), this;
  }
  get pause() {
    return !!this._pause;
  }
  set pause(t2) {
    this._pause = t2, this.lastViewport = null, this.moving = false, this.zooming = false, t2 && this.input.pause();
  }
  ensureVisible(t2, i2, e3, n2, s2) {
    s2 && (e3 > this.worldScreenWidth || n2 > this.worldScreenHeight) && (this.fit(true, e3, n2), this.emit("zoomed", { viewport: this, type: "ensureVisible" }));
    let h2 = false;
    t2 < this.left ? (this.left = t2, h2 = true) : t2 + e3 > this.right && (this.right = t2 + e3, h2 = true), i2 < this.top ? (this.top = i2, h2 = true) : i2 + n2 > this.bottom && (this.bottom = i2 + n2, h2 = true), h2 && this.emit("moved", { viewport: this, type: "ensureVisible" });
  }
};

// src/lib/button.ts
var Button = class extends Container {
  constructor(name, dimensions, clickAction) {
    super();
    this.clickAction = clickAction;
    this.interactive = true;
    this.buttonSprite = new NineSlicePlane(loadedAssets.button, 4, 4, 4, 4);
    this.buttonSprite.width = dimensions.width;
    this.buttonSprite.height = dimensions.height;
    this.addChild(this.buttonSprite);
    this.cursor = "pointer";
    this.on("mouseover", () => {
      this.buttonSprite.texture = loadedAssets.button;
      if (!this.isDisabled) {
        this.alpha = 1;
      }
    });
    this.on("mouseout", () => {
      this.buttonSprite.texture = loadedAssets.button;
      if (!this.isDisabled) {
        this.alpha = 0.9;
      }
    });
    if (this.clickAction) {
      this.on("click", this.clickAction);
    }
    const text = new BitmapText(name, {
      fontName: "buttontext",
      fontSize: 32,
      align: "right"
    });
    text.x = (dimensions.height - 32) / 2;
    text.y = (dimensions.height - 32) / 2;
    this.addChild(text);
  }
  buttonSprite;
  isDisabled = false;
  set disabled(disabled) {
    if (disabled && !this.isDisabled) {
      console.log("flip disabled");
      this.alpha = 0.5;
      this.cursor = "default";
      this.isDisabled = true;
      this.off("click");
    } else if (!disabled && this.isDisabled) {
      console.log("flip enabled");
      this.alpha = 0.9;
      this.cursor = "pointer";
      this.isDisabled = false;
      if (this.clickAction) {
        this.on("click", this.clickAction);
      }
    }
  }
  get disabled() {
    return this.isDisabled;
  }
};

// src/lib/availableActions.ts
var availableActions = [{
  name: "Refuel",
  action: async (event) => {
    event.stopPropagation();
    if (GameState.selected) {
      const refuel = await trpc.instructRefuel.mutate({
        shipSymbol: GameState.selected.symbol
      });
      GameState.visibleShips[refuel.symbol].shipData = refuel;
    }
  },
  isAvailable: () => {
    if (GameState.selected?.type === "ship") {
      const selectedShip = GameState.visibleShips[GameState.selected.symbol].shipData;
      return selectedShip.fuelAvailable < selectedShip.fuelCapacity && selectedShip.navStatus === "DOCKED";
    }
    return false;
  }
}, {
  name: "Dock",
  action: async (event) => {
    event.stopPropagation();
    if (GameState.selected) {
      const dock = await trpc.instructDock.mutate({
        shipSymbol: GameState.selected.symbol
      });
      console.log("dockresult", dock);
      GameState.visibleShips[dock.symbol].shipData = dock;
    }
  },
  isAvailable: () => {
    if (GameState.selected?.type === "ship") {
      const selectedShip = GameState.visibleShips[GameState.selected.symbol].shipData;
      return selectedShip.navStatus === "IN_ORBIT" || selectedShip.navStatus === "IN_TRANSIT" && new Date(selectedShip.arrivalOn).getTime() < Date.now();
    }
    return false;
  }
}, {
  name: "Orbit",
  action: async (event) => {
    event.stopPropagation();
    if (GameState.selected) {
      const orbit = await trpc.instructOrbit.mutate({
        shipSymbol: GameState.selected.symbol
      });
      GameState.visibleShips[orbit.symbol].shipData = orbit;
    }
  },
  isAvailable: () => {
    if (GameState.selected?.type === "ship") {
      const selectedShip = GameState.visibleShips[GameState.selected.symbol].shipData;
      return selectedShip.navStatus === "DOCKED";
    }
    return false;
  }
}, {
  name: "Extract",
  action: () => {
  },
  isAvailable: () => {
    return false;
  }
}, {
  name: "Scan Wpt",
  action: async (event) => {
    event.stopPropagation();
    if (GameState.selected) {
      const waypoints = await trpc.instructScanWaypoints.mutate({
        shipSymbol: GameState.selected.symbol
      });
      GameState.visibleShips[waypoints.symbol].shipData = waypoints;
    }
  },
  isAvailable: () => {
    if (GameState.selected?.type === "ship") {
      const selectedShip = GameState.visibleShips[GameState.selected.symbol].shipData;
      return selectedShip.navStatus === "IN_ORBIT" && Date.now() > new Date(selectedShip.reactorCooldownOn).getTime();
    }
    return false;
  }
}, {
  name: "Scan Shp",
  action: () => {
  },
  isAvailable: () => {
    return false;
  }
}];

// src/lib/UIElements.ts
var universeView;
var systemView;
var uiOverlay;
var currentCoordinate;
var currentSelected;
var backButton;
var actionButton = {};
var entityInfo;
var createUIElements = (app2) => {
  systemView = new ht({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 2e3,
    worldHeight: 2e3,
    events: app2.renderer.events
    // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  });
  systemView.drag().pinch().wheel().decelerate();
  systemView.visible = false;
  systemView.moveCenter(1e3, 1e3);
  universeView = new ht({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: totalSize,
    worldHeight: totalSize,
    events: app2.renderer.events
    // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  });
  universeView.drag().pinch().wheel().decelerate();
  universeView.moveCenter(totalSize / 2, totalSize / 2);
  uiOverlay = new Container();
  const panelBack = new TilingSprite(loadedAssets.panelBg, 208, 208);
  panelBack.height = window.innerHeight - 16;
  panelBack.x = 8;
  panelBack.width = 386;
  panelBack.y = 8;
  uiOverlay.addChild(panelBack);
  const panelBg = new NineSlicePlane(loadedAssets.panel, 19, 19, 19, 19);
  panelBg.x = 0;
  panelBg.y = 0;
  panelBg.width = 400;
  panelBg.height = window.innerHeight;
  backButton = new Button("Back", {
    height: 64,
    width: 368
  });
  backButton.on("click", (event) => {
    event.stopPropagation();
    universeView.visible = true;
    systemView.visible = false;
    GameState.currentView = "universe";
    systemView.removeChildren();
    backButton.visible = false;
  });
  backButton.y = 16;
  backButton.x = 16;
  backButton.visible = false;
  panelBg.addChild(backButton);
  const actionPanelY = window.innerHeight - 16 - Math.ceil(availableActions.length / 2) * 64;
  availableActions.forEach((action, index) => {
    actionButton[action.name] = new Button(action.name, {
      height: 64,
      width: 368 / 2
    }, action.action);
    actionButton[action.name].y = actionPanelY + Math.floor(index / 2) * 64;
    actionButton[action.name].x = index % 2 == 0 ? 200 : 16;
    actionButton[action.name].disabled = true;
    panelBg.addChild(actionButton[action.name]);
  });
  uiOverlay.addChild(panelBg);
  entityInfo = new BitmapText("Entity Information", {
    fontName: "buttontext",
    fontSize: 16,
    align: "left",
    maxWidth: 368
  });
  entityInfo.x = 16;
  entityInfo.y = window.innerHeight - 500;
  panelBg.addChild(entityInfo);
  currentCoordinate = new BitmapText("0, 0", {
    fontName: "sans-serif",
    fontSize: 18,
    align: "right"
  });
  currentCoordinate.x = window.innerWidth - 166;
  currentCoordinate.y = 16;
  currentCoordinate.maxWidth = 150;
  uiOverlay.addChild(currentCoordinate);
  currentSelected = new BitmapText("Selected: ", {
    fontName: "buttontext",
    fontSize: 18,
    align: "right"
  });
  currentSelected.x = 16;
  currentSelected.y = 104;
  uiOverlay.addChild(currentSelected);
  const bgContainer = new TilingSprite(loadedAssets.bgTexture, 4096, 4096);
  app2.stage.addChild(bgContainer);
  app2.stage.addChild(universeView);
  app2.stage.addChild(systemView);
  app2.stage.addChild(uiOverlay);
};

// src/lib/positionShips.ts
var waypointShips = {};
function resetShipWaypoints() {
  waypointShips = {};
}
function positionShip(ship) {
  let serverX, serverY, navRot, xOffset = 0, yOffset = 0;
  const arrivalOn = new Date(ship.arrivalOn);
  const departureOn = new Date(ship.departureOn);
  if (ship.destinationWaypoint.symbol !== ship.departureWaypoint.symbol && Date.now() < arrivalOn.getTime()) {
    const positionAlongPath = (Date.now() - departureOn.getTime()) / (arrivalOn.getTime() - departureOn.getTime());
    serverX = ship.departureWaypoint.x + (ship.destinationWaypoint.x - ship.departureWaypoint.x) * positionAlongPath;
    serverY = ship.departureWaypoint.y + (ship.destinationWaypoint.y - ship.departureWaypoint.y) * positionAlongPath;
    navRot = Math.atan2(ship.destinationWaypoint.y - ship.departureWaypoint.y, ship.destinationWaypoint.x - ship.departureWaypoint.x) + Math.PI / 2;
  } else {
    if (waypointShips[ship.currentWaypoint.symbol] === void 0) {
      waypointShips[ship.currentWaypoint.symbol] = 0;
    } else {
      waypointShips[ship.currentWaypoint.symbol]++;
    }
    serverX = ship.currentWaypoint.x;
    serverY = ship.currentWaypoint.y;
    xOffset = 32 * waypointShips[ship.currentWaypoint.symbol];
    yOffset = 80;
  }
  const x2 = serverX * systemScale + xOffset + Math.abs(systemCoordinates.minX) * systemScale;
  const y2 = serverY * systemScale + yOffset + Math.abs(systemCoordinates.minY) * systemScale;
  return {
    x: x2,
    y: y2,
    navRot
  };
}

// src/lib/loadUniverse.ts
var loadUniverse = async () => {
  const references = {};
  const systems = await trpc.getSystems.query();
  for (const starData of systems) {
    if (starData.x < universeCoordinates.minX)
      universeCoordinates.minX = starData.x;
    if (starData.x > universeCoordinates.maxX)
      universeCoordinates.maxX = starData.x;
    if (starData.y < universeCoordinates.minY)
      universeCoordinates.minY = starData.y;
    if (starData.y > universeCoordinates.maxY)
      universeCoordinates.maxY = starData.y;
  }
  for (const starData of systems) {
    let texture = loadedAssets.sheet.textures[`planets/tile/${starData.type}.png`];
    const star = new Sprite(texture);
    star.pivot = {
      x: 32,
      y: 32
    };
    const text = new BitmapText(starData.name + "\n(" + starData.symbol + ")", {
      fontName: "sans-serif",
      fontSize: 18,
      align: "left"
    });
    text.x = 0;
    text.y = 40;
    const starContainer = new Container();
    starContainer.addChild(star);
    starContainer.addChild(text);
    makeInteractiveAndSelectable(starContainer, {
      onOrder: [
        {
          name: "Warp",
          withSelection: "ship",
          action: async () => {
            if (GameState.selected?.symbol) {
              const system = await trpc.dataForDisplay.query({
                system: starData.symbol
              });
              const bestWaypoint = system.waypoints.find((w3) => w3.traits.find((t2) => t2.symbol === "MARKETPLACE")).symbol ?? system.waypoints[0].symbol;
              if (bestWaypoint) {
                console.log("warping to first waypoint in", system);
                const res = await trpc.instructWarp.mutate({
                  shipSymbol: GameState.selected.symbol,
                  waypointSymbol: bestWaypoint
                });
                GameState.visibleShips[res.symbol].shipData = res;
              } else {
                alert("Cannot warp to system without waypoints, nothing to target");
              }
            }
          }
        }
      ]
    });
    starContainer.on("click", () => {
      trpc.dataForDisplay.query({
        system: starData.symbol
      }).then((result) => {
        console.log("result from query", result);
        universeView.visible = false;
        systemView.visible = true;
        GameState.currentView = "system";
        systemCoordinates.minX = 0;
        systemCoordinates.minY = 0;
        result.waypoints.filter((item) => !item.orbitsSymbol).forEach((item) => {
          if (item.x < systemCoordinates.minX) {
            systemCoordinates.minX = item.x;
          }
          if (item.y < systemCoordinates.minY) {
            systemCoordinates.minY = item.y;
          }
        });
        const star2 = new Sprite(texture);
        star2.x = Math.abs(systemCoordinates.minX) * systemScale;
        star2.y = Math.abs(systemCoordinates.minY) * systemScale;
        star2.pivot = {
          x: 32,
          y: 32
        };
        systemView.addChild(star2);
        backButton.visible = true;
        resetShipWaypoints();
        GameState.visibleShips = {};
        GameState.visibleWaypoints = {};
        result.ships.forEach((ship) => {
          const shipGroup = new Container();
          const itemSprite = new Sprite(loadedAssets.spaceshipTexture);
          itemSprite.pivot = {
            x: 32,
            y: 32
          };
          const navSprite = new Sprite(loadedAssets.navArrow);
          navSprite.pivot = {
            x: navSprite.width / 2,
            y: navSprite.height / 2
          };
          navSprite.name = "nav";
          navSprite.visible = false;
          shipGroup.addChild(navSprite);
          itemSprite.scale = { x: 0.5, y: 0.5 };
          const shipPosition = positionShip(ship);
          shipGroup.x = shipPosition.x;
          shipGroup.y = shipPosition.y;
          shipGroup.addChild(itemSprite);
          const text2 = new BitmapText(ship.symbol + " - " + ship.role, {
            fontName: "sans-serif",
            fontSize: 16,
            align: "right"
          });
          text2.visible = false;
          text2.x = 0;
          text2.y = 32;
          shipGroup.addChild(text2);
          makeInteractiveAndSelectable(shipGroup, {
            onMouseOver: () => {
              text2.visible = true;
            },
            onMouseOut: () => {
              text2.visible = false;
            },
            onSelect: {
              type: "ship",
              symbol: ship.symbol
            }
          });
          systemView.addChild(shipGroup);
          GameState.visibleShips[ship.symbol] = {
            shipData: ship,
            container: shipGroup
          };
        });
        const addTraitIcons = (item, container) => {
          let xOffset = 0;
          item.traits.forEach((trait) => {
            if (trait.symbol === "MARKETPLACE") {
              const sprite = new Sprite(loadedAssets.market);
              sprite.pivot = {
                x: 32,
                y: 32
              };
              sprite.scale = { x: 0.25, y: 0.25 };
              sprite.x = xOffset - 16;
              sprite.y = 24;
              container.addChild(sprite);
              xOffset += 16;
            }
            if (trait.symbol === "SHIPYARD") {
              const sprite = new Sprite(loadedAssets.shipyard);
              sprite.pivot = {
                x: 32,
                y: 32
              };
              sprite.scale = { x: 0.25, y: 0.24 };
              sprite.x = xOffset - 16;
              sprite.y = 24;
              container.addChild(sprite);
              xOffset += 16;
            }
          });
        };
        result.waypoints.filter((item) => !item.orbitsSymbol).forEach((item) => {
          const orbit = new Graphics();
          orbit.lineStyle({
            width: 2,
            color: 4473924
          });
          orbit.drawCircle(Math.abs(systemCoordinates.minX) * systemScale, Math.abs(systemCoordinates.minY) * systemScale, Math.sqrt(Math.pow(item.x * systemScale, 2) + Math.pow(item.y * systemScale, 2)));
          systemView.addChild(orbit);
          const itemGroup = new Container();
          makeInteractiveAndSelectable(itemGroup, {
            onSelect: {
              type: "waypoint",
              symbol: item.symbol
            },
            onOrder: [
              {
                name: "navigate",
                withSelection: "ship",
                action: async (selectedSymbol) => {
                  const res = await trpc.instructNavigate.mutate({
                    shipSymbol: selectedSymbol,
                    waypointSymbol: item.symbol
                  });
                  GameState.visibleShips[res.symbol].shipData = res;
                  console.log("updated state for ship " + res.symbol);
                }
              }
            ]
          });
          const itemSprite = new Sprite(loadedAssets.planetsheet.textures[`planets/tile/${item.type}.png`]);
          itemSprite.pivot = {
            x: 32,
            y: 32
          };
          itemGroup.x = (item.x + Math.abs(systemCoordinates.minX)) * systemScale;
          itemGroup.y = (item.y + Math.abs(systemCoordinates.minY)) * systemScale;
          itemGroup.addChild(itemSprite);
          const text2 = new BitmapText(item.symbol.replace(starData.symbol + "-", "") + " - " + item.type, {
            fontName: "sans-serif",
            fontSize: 16,
            align: "right"
          });
          text2.x = 40;
          text2.y = -8;
          itemGroup.addChild(text2);
          addTraitIcons(item, itemGroup);
          result.waypoints.filter((orbitingThing) => orbitingThing.orbitsSymbol === item.symbol).forEach((orbitingThing, index) => {
            const orbitingGroup = new Container();
            makeInteractiveAndSelectable(orbitingGroup, {
              onSelect: {
                type: "waypoint",
                symbol: orbitingThing.symbol
              }
            });
            const orbitingSprite = new Sprite(loadedAssets.planetsheet.textures[`planets/tile/${orbitingThing.type}.png`]);
            orbitingSprite.pivot = {
              x: 32,
              y: 32
            };
            orbitingSprite.scale = { x: 0.75, y: 0.75 };
            orbitingGroup.x = item.x * systemScale + 32 + Math.abs(systemCoordinates.minX) * systemScale;
            orbitingGroup.y = item.y * systemScale + 48 + 64 * index + Math.abs(systemCoordinates.minY) * systemScale;
            orbitingGroup.addChild(orbitingSprite);
            const orbitingText = new BitmapText(orbitingThing.symbol.replace(starData.symbol + "-", "") + " - " + orbitingThing.type, {
              fontName: "sans-serif",
              fontSize: 16,
              align: "right"
            });
            orbitingText.x = 24;
            orbitingText.y = -8;
            orbitingGroup.addChild(orbitingText);
            addTraitIcons(orbitingThing, orbitingGroup);
            GameState.visibleWaypoints[orbitingThing.symbol] = {
              waypointData: orbitingThing,
              container: orbitingGroup
            };
            systemView.addChild(orbitingGroup);
          });
          GameState.visibleWaypoints[item.symbol] = {
            waypointData: item,
            container: itemGroup
          };
          systemView.addChild(itemGroup);
        });
        systemView.moveCenter({
          x: Math.abs(systemCoordinates.minX) * systemScale,
          y: Math.abs(systemCoordinates.minY) * systemScale
        });
      });
    });
    starContainer.x = (starData.x + Math.abs(universeCoordinates.minX)) / (universeCoordinates.maxX - universeCoordinates.minX) * totalSize;
    starContainer.y = (starData.y + Math.abs(universeCoordinates.minY)) / (universeCoordinates.maxY - universeCoordinates.minY) * totalSize;
    universeView.addChild(starContainer);
    references[starData.symbol] = starContainer;
  }
  const graphics = new Graphics();
  graphics.lineStyle({
    width: 15,
    color: 30719
  });
  const multiFactor = 5e3 / (universeCoordinates.maxX - universeCoordinates.minX) * totalSize;
  universeView.addChild(graphics);
  return {
    systems: references
  };
};

// src/lib/worldCoordinateToOriginal.ts
var worldCoordinateToOriginal = (point) => {
  const multiFactor = (universeCoordinates.maxX - universeCoordinates.minX) / totalSize;
  return {
    x: Math.round(universeCoordinates.minX + point.x * multiFactor),
    y: Math.round(universeCoordinates.minY + point.y * multiFactor)
  };
};
var systemCoordinateToOriginal = (point) => {
  return {
    x: Math.round(systemCoordinates.minX + point.x / systemScale),
    y: Math.round(systemCoordinates.minY + point.y / systemScale)
  };
};

// src/index.ts
var app = new Application({
  resizeTo: window
});
document.body.appendChild(app.view);
app.view.addEventListener("contextmenu", (e3) => {
  e3.preventDefault();
});
app.stage.interactive = true;
app.stage.hitArea = app.screen;
app.stage.on("click", (event) => {
  console.log(event);
  deselectListeners.emit("deselect");
  GameState.selected = void 0;
});
await loadAssets();
await createUIElements(app);
var loadedUniverse = await loadUniverse();
app.ticker.add(() => {
  if (GameState.currentView == "universe") {
    const worldCoordinates = worldCoordinateToOriginal(universeView.toWorld(app.renderer.plugins.interaction.rootPointerEvent.offset));
    currentCoordinate.text = worldCoordinates.x + ", " + worldCoordinates.y;
  } else {
    const systemCoordinate = systemCoordinateToOriginal(systemView.toWorld(app.renderer.plugins.interaction.rootPointerEvent.offset));
    currentCoordinate.text = systemCoordinate.x + ", " + systemCoordinate.y;
    resetShipWaypoints();
    Object.values(GameState.visibleShips).forEach((shipState) => {
      const shipPosition = positionShip(shipState.shipData);
      shipState.container.x = shipPosition.x;
      shipState.container.y = shipPosition.y;
      const nav = shipState.container.getChildByName("nav");
      if (nav) {
        if (shipPosition.navRot) {
          nav.visible = true;
          shipState.container.rotation = shipPosition.navRot;
        } else {
          nav.visible = false;
          shipState.container.rotation = 0;
        }
      }
      if (shipState.shipData.navStatus === "IN_TRANSIT" && new Date(shipState.shipData.arrivalOn).getTime() < Date.now()) {
        shipState.shipData.navStatus = "IN_ORBIT";
      }
    });
  }
  availableActions.forEach((action) => {
    const isAvailable = action.isAvailable();
    actionButton[action.name].disabled = !isAvailable;
  });
  const sizeMultiplier = universeView.worldScreenWidth / universeView.screenWidth;
  Object.values(loadedUniverse.systems).forEach((ref) => {
    ref.scale = { x: sizeMultiplier, y: sizeMultiplier };
  });
  if (GameState.selected) {
    currentSelected.text = `Selected: ${GameState.selected.symbol} - ${GameState.selected.type}`;
    if (GameState.selected.type === "ship") {
      const shipInfo = GameState.visibleShips[GameState.selected.symbol].shipData;
      const cooldownTime = new Date(shipInfo.reactorCooldownOn).getTime();
      entityInfo.text = `Entity Information
Symbol: ${shipInfo.symbol}
Location: ${shipInfo.currentWaypoint.symbol}
Fuel: ${shipInfo.fuelAvailable}/${shipInfo.fuelCapacity}
Cargo: ${shipInfo.cargoUsed}/${shipInfo.cargoCapacity}
Nav Status: ${shipInfo.navStatus}
Reactor Cooldown: ${cooldownTime > Date.now() ? Math.round((cooldownTime - Date.now()) / 1e3) + "s" : "Ready"}`;
    } else if (GameState.selected.type === "waypoint") {
      const waypointInfo = GameState.visibleWaypoints[GameState.selected.symbol].waypointData;
      entityInfo.text = `Entity Information
Symbol: ${GameState.selected.symbol}
Kind: ${waypointInfo.type}
Traits: ${waypointInfo.traits.length == 0 ? "UNKNOWN" : waypointInfo.traits.map((t2) => t2.name).join(", ")}`;
    }
  } else {
    currentSelected.text = `Selected:`;
    entityInfo.text = `Entity Information`;
  }
});
/*! Bundled license information:

punycode/punycode.js:
  (*! https://mths.be/punycode v1.3.2 by @mathias *)

@trpc/client/dist/httpUtils-8a5c637a.mjs:
  (* istanbul ignore if -- @preserve *)

@trpc/client/dist/links/wsLink.mjs:
  (* istanbul ignore next -- @preserve *)

@pixi/filter-glow/dist/filter-glow.mjs:
  (*!
   * @pixi/filter-glow - v5.2.1
   * Compiled Fri, 24 Mar 2023 22:12:11 UTC
   *
   * @pixi/filter-glow is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   *)
*/

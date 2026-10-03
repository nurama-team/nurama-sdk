"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
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

  // ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/commons.js
  var PACKET_TYPES, PACKET_TYPES_REVERSE, ERROR_PACKET;
  var init_commons = __esm({
    "../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/commons.js"() {
      PACKET_TYPES = /* @__PURE__ */ Object.create(null);
      PACKET_TYPES["open"] = "0";
      PACKET_TYPES["close"] = "1";
      PACKET_TYPES["ping"] = "2";
      PACKET_TYPES["pong"] = "3";
      PACKET_TYPES["message"] = "4";
      PACKET_TYPES["upgrade"] = "5";
      PACKET_TYPES["noop"] = "6";
      PACKET_TYPES_REVERSE = /* @__PURE__ */ Object.create(null);
      Object.keys(PACKET_TYPES).forEach((key) => {
        PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
      });
      ERROR_PACKET = { type: "error", data: "parser error" };
    }
  });

  // ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/encodePacket.browser.js
  function toArray(data) {
    if (data instanceof Uint8Array) {
      return data;
    } else if (data instanceof ArrayBuffer) {
      return new Uint8Array(data);
    } else {
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }
  }
  function encodePacketToBinary(packet, callback) {
    if (withNativeBlob && packet.data instanceof Blob) {
      return packet.data.arrayBuffer().then(toArray).then(callback);
    } else if (withNativeArrayBuffer && (packet.data instanceof ArrayBuffer || isView(packet.data))) {
      return callback(toArray(packet.data));
    }
    encodePacket(packet, false, (encoded) => {
      if (!TEXT_ENCODER) {
        TEXT_ENCODER = new TextEncoder();
      }
      callback(TEXT_ENCODER.encode(encoded));
    });
  }
  var withNativeBlob, withNativeArrayBuffer, isView, encodePacket, encodeBlobAsBase64, TEXT_ENCODER;
  var init_encodePacket_browser = __esm({
    "../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/encodePacket.browser.js"() {
      init_commons();
      withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
      withNativeArrayBuffer = typeof ArrayBuffer === "function";
      isView = (obj) => {
        return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
      };
      encodePacket = ({ type, data }, supportsBinary, callback) => {
        if (withNativeBlob && data instanceof Blob) {
          if (supportsBinary) {
            return callback(data);
          } else {
            return encodeBlobAsBase64(data, callback);
          }
        } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
          if (supportsBinary) {
            return callback(data);
          } else {
            return encodeBlobAsBase64(new Blob([data]), callback);
          }
        }
        return callback(PACKET_TYPES[type] + (data || ""));
      };
      encodeBlobAsBase64 = (data, callback) => {
        const fileReader = new FileReader();
        fileReader.onload = function() {
          const content = fileReader.result.split(",")[1];
          callback("b" + (content || ""));
        };
        return fileReader.readAsDataURL(data);
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
  var chars, lookup, decode;
  var init_base64_arraybuffer = __esm({
    "../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js"() {
      chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
      for (let i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
      }
      decode = (base64) => {
        let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === "=") {
          bufferLength--;
          if (base64[base64.length - 2] === "=") {
            bufferLength--;
          }
        }
        const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
          encoded1 = lookup[base64.charCodeAt(i)];
          encoded2 = lookup[base64.charCodeAt(i + 1)];
          encoded3 = lookup[base64.charCodeAt(i + 2)];
          encoded4 = lookup[base64.charCodeAt(i + 3)];
          bytes[p++] = encoded1 << 2 | encoded2 >> 4;
          bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
          bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
        }
        return arraybuffer;
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/decodePacket.browser.js
  var withNativeArrayBuffer2, decodePacket, decodeBase64Packet, mapBinary;
  var init_decodePacket_browser = __esm({
    "../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/decodePacket.browser.js"() {
      init_commons();
      init_base64_arraybuffer();
      withNativeArrayBuffer2 = typeof ArrayBuffer === "function";
      decodePacket = (encodedPacket, binaryType) => {
        if (typeof encodedPacket !== "string") {
          return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType)
          };
        }
        const type = encodedPacket.charAt(0);
        if (type === "b") {
          return {
            type: "message",
            data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
          };
        }
        const packetType = PACKET_TYPES_REVERSE[type];
        if (!packetType) {
          return ERROR_PACKET;
        }
        return encodedPacket.length > 1 ? {
          type: PACKET_TYPES_REVERSE[type],
          data: encodedPacket.substring(1)
        } : {
          type: PACKET_TYPES_REVERSE[type]
        };
      };
      decodeBase64Packet = (data, binaryType) => {
        if (withNativeArrayBuffer2) {
          const decoded = decode(data);
          return mapBinary(decoded, binaryType);
        } else {
          return { base64: true, data };
        }
      };
      mapBinary = (data, binaryType) => {
        switch (binaryType) {
          case "blob":
            if (data instanceof Blob) {
              return data;
            } else {
              return new Blob([data]);
            }
          case "arraybuffer":
          default:
            if (data instanceof ArrayBuffer) {
              return data;
            } else {
              return data.buffer;
            }
        }
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/index.js
  function createPacketEncoderStream() {
    return new TransformStream({
      transform(packet, controller) {
        encodePacketToBinary(packet, (encodedPacket) => {
          const payloadLength = encodedPacket.length;
          let header;
          if (payloadLength < 126) {
            header = new Uint8Array(1);
            new DataView(header.buffer).setUint8(0, payloadLength);
          } else if (payloadLength < 65536) {
            header = new Uint8Array(3);
            const view = new DataView(header.buffer);
            view.setUint8(0, 126);
            view.setUint16(1, payloadLength);
          } else {
            header = new Uint8Array(9);
            const view = new DataView(header.buffer);
            view.setUint8(0, 127);
            view.setBigUint64(1, BigInt(payloadLength));
          }
          if (packet.data && typeof packet.data !== "string") {
            header[0] |= 128;
          }
          controller.enqueue(header);
          controller.enqueue(encodedPacket);
        });
      }
    });
  }
  function totalLength(chunks) {
    return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  }
  function concatChunks(chunks, size) {
    if (chunks[0].length === size) {
      return chunks.shift();
    }
    const buffer = new Uint8Array(size);
    let j = 0;
    for (let i = 0; i < size; i++) {
      buffer[i] = chunks[0][j++];
      if (j === chunks[0].length) {
        chunks.shift();
        j = 0;
      }
    }
    if (chunks.length && j < chunks[0].length) {
      chunks[0] = chunks[0].slice(j);
    }
    return buffer;
  }
  function createPacketDecoderStream(maxPayload, binaryType) {
    if (!TEXT_DECODER) {
      TEXT_DECODER = new TextDecoder();
    }
    const chunks = [];
    let state = 0;
    let expectedLength = -1;
    let isBinary2 = false;
    return new TransformStream({
      transform(chunk, controller) {
        chunks.push(chunk);
        while (true) {
          if (state === 0) {
            if (totalLength(chunks) < 1) {
              break;
            }
            const header = concatChunks(chunks, 1);
            isBinary2 = (header[0] & 128) === 128;
            expectedLength = header[0] & 127;
            if (expectedLength < 126) {
              state = 3;
            } else if (expectedLength === 126) {
              state = 1;
            } else {
              state = 2;
            }
          } else if (state === 1) {
            if (totalLength(chunks) < 2) {
              break;
            }
            const headerArray = concatChunks(chunks, 2);
            expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
            state = 3;
          } else if (state === 2) {
            if (totalLength(chunks) < 8) {
              break;
            }
            const headerArray = concatChunks(chunks, 8);
            const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
            const n = view.getUint32(0);
            if (n > Math.pow(2, 53 - 32) - 1) {
              controller.enqueue(ERROR_PACKET);
              break;
            }
            expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
            state = 3;
          } else {
            if (totalLength(chunks) < expectedLength) {
              break;
            }
            const data = concatChunks(chunks, expectedLength);
            controller.enqueue(decodePacket(isBinary2 ? data : TEXT_DECODER.decode(data), binaryType));
            state = 0;
          }
          if (expectedLength === 0 || expectedLength > maxPayload) {
            controller.enqueue(ERROR_PACKET);
            break;
          }
        }
      }
    });
  }
  var SEPARATOR, encodePayload, decodePayload, TEXT_DECODER, protocol;
  var init_esm = __esm({
    "../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/index.js"() {
      init_encodePacket_browser();
      init_decodePacket_browser();
      init_commons();
      SEPARATOR = String.fromCharCode(30);
      encodePayload = (packets, callback) => {
        const length = packets.length;
        const encodedPackets = new Array(length);
        let count = 0;
        packets.forEach((packet, i) => {
          encodePacket(packet, false, (encodedPacket) => {
            encodedPackets[i] = encodedPacket;
            if (++count === length) {
              callback(encodedPackets.join(SEPARATOR));
            }
          });
        });
      };
      decodePayload = (encodedPayload, binaryType) => {
        const encodedPackets = encodedPayload.split(SEPARATOR);
        const packets = [];
        for (let i = 0; i < encodedPackets.length; i++) {
          const decodedPacket = decodePacket(encodedPackets[i], binaryType);
          packets.push(decodedPacket);
          if (decodedPacket.type === "error") {
            break;
          }
        }
        return packets;
      };
      protocol = 4;
    }
  });

  // ../../node_modules/.pnpm/@socket.io+component-emitter@3.1.2/node_modules/@socket.io/component-emitter/lib/esm/index.js
  function Emitter(obj) {
    if (obj) return mixin(obj);
  }
  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }
  var init_esm2 = __esm({
    "../../node_modules/.pnpm/@socket.io+component-emitter@3.1.2/node_modules/@socket.io/component-emitter/lib/esm/index.js"() {
      Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
        return this;
      };
      Emitter.prototype.once = function(event, fn) {
        function on2() {
          this.off(event, on2);
          fn.apply(this, arguments);
        }
        on2.fn = fn;
        this.on(event, on2);
        return this;
      };
      Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        if (0 == arguments.length) {
          this._callbacks = {};
          return this;
        }
        var callbacks = this._callbacks["$" + event];
        if (!callbacks) return this;
        if (1 == arguments.length) {
          delete this._callbacks["$" + event];
          return this;
        }
        var cb;
        for (var i = 0; i < callbacks.length; i++) {
          cb = callbacks[i];
          if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1);
            break;
          }
        }
        if (callbacks.length === 0) {
          delete this._callbacks["$" + event];
        }
        return this;
      };
      Emitter.prototype.emit = function(event) {
        this._callbacks = this._callbacks || {};
        var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
        if (callbacks) {
          callbacks = callbacks.slice(0);
          for (var i = 0, len = callbacks.length; i < len; ++i) {
            callbacks[i].apply(this, args);
          }
        }
        return this;
      };
      Emitter.prototype.emitReserved = Emitter.prototype.emit;
      Emitter.prototype.listeners = function(event) {
        this._callbacks = this._callbacks || {};
        return this._callbacks["$" + event] || [];
      };
      Emitter.prototype.hasListeners = function(event) {
        return !!this.listeners(event).length;
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/globals.js
  function createCookieJar() {
  }
  var nextTick, globalThisShim, defaultBinaryType;
  var init_globals = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/globals.js"() {
      nextTick = (() => {
        const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
        if (isPromiseAvailable) {
          return (cb) => Promise.resolve().then(cb);
        } else {
          return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
        }
      })();
      globalThisShim = (() => {
        if (typeof self !== "undefined") {
          return self;
        } else if (typeof window !== "undefined") {
          return window;
        } else {
          return Function("return this")();
        }
      })();
      defaultBinaryType = "arraybuffer";
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/util.js
  function pick(obj, ...attr) {
    return attr.reduce((acc, k) => {
      if (obj.hasOwnProperty(k)) {
        acc[k] = obj[k];
      }
      return acc;
    }, {});
  }
  function installTimerFunctions(obj, opts) {
    if (opts.useNativeTimers) {
      obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
      obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
    } else {
      obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
      obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
    }
  }
  function byteLength(obj) {
    if (typeof obj === "string") {
      return utf8Length(obj);
    }
    return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
  }
  function utf8Length(str) {
    let c = 0, length = 0;
    for (let i = 0, l = str.length; i < l; i++) {
      c = str.charCodeAt(i);
      if (c < 128) {
        length += 1;
      } else if (c < 2048) {
        length += 2;
      } else if (c < 55296 || c >= 57344) {
        length += 3;
      } else {
        i++;
        length += 4;
      }
    }
    return length;
  }
  function randomString() {
    return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
  }
  var NATIVE_SET_TIMEOUT, NATIVE_CLEAR_TIMEOUT, BASE64_OVERHEAD;
  var init_util = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/util.js"() {
      init_globals();
      NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
      NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
      BASE64_OVERHEAD = 1.33;
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/contrib/parseqs.js
  function encode(obj) {
    let str = "";
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (str.length)
          str += "&";
        str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
      }
    }
    return str;
  }
  function decode2(qs) {
    let qry = {};
    let pairs = qs.split("&");
    for (let i = 0, l = pairs.length; i < l; i++) {
      let pair = pairs[i].split("=");
      qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return qry;
  }
  var init_parseqs = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/contrib/parseqs.js"() {
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transport.js
  var TransportError, Transport;
  var init_transport = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transport.js"() {
      init_esm();
      init_esm2();
      init_util();
      init_parseqs();
      TransportError = class extends Error {
        constructor(reason, description, context) {
          super(reason);
          this.description = description;
          this.context = context;
          this.type = "TransportError";
        }
      };
      Transport = class extends Emitter {
        /**
         * Transport abstract constructor.
         *
         * @param {Object} opts - options
         * @protected
         */
        constructor(opts) {
          super();
          this.writable = false;
          installTimerFunctions(this, opts);
          this.opts = opts;
          this.query = opts.query;
          this.socket = opts.socket;
          this.supportsBinary = !opts.forceBase64;
        }
        /**
         * Emits an error.
         *
         * @param {String} reason
         * @param description
         * @param context - the error context
         * @return {Transport} for chaining
         * @protected
         */
        onError(reason, description, context) {
          super.emitReserved("error", new TransportError(reason, description, context));
          return this;
        }
        /**
         * Opens the transport.
         */
        open() {
          this.readyState = "opening";
          this.doOpen();
          return this;
        }
        /**
         * Closes the transport.
         */
        close() {
          if (this.readyState === "opening" || this.readyState === "open") {
            this.doClose();
            this.onClose();
          }
          return this;
        }
        /**
         * Sends multiple packets.
         *
         * @param {Array} packets
         */
        send(packets) {
          if (this.readyState === "open") {
            this.write(packets);
          } else {
          }
        }
        /**
         * Called upon open
         *
         * @protected
         */
        onOpen() {
          this.readyState = "open";
          this.writable = true;
          super.emitReserved("open");
        }
        /**
         * Called with data.
         *
         * @param {String} data
         * @protected
         */
        onData(data) {
          const packet = decodePacket(data, this.socket.binaryType);
          this.onPacket(packet);
        }
        /**
         * Called with a decoded packet.
         *
         * @protected
         */
        onPacket(packet) {
          super.emitReserved("packet", packet);
        }
        /**
         * Called upon close.
         *
         * @protected
         */
        onClose(details) {
          this.readyState = "closed";
          super.emitReserved("close", details);
        }
        /**
         * Pauses the transport, in order not to lose packets during an upgrade.
         *
         * @param onPause
         */
        pause(onPause) {
        }
        createUri(schema, query = {}) {
          return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
        }
        _hostname() {
          const hostname = this.opts.hostname;
          return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
        }
        _port() {
          if (this.opts.port && (this.opts.secure && Number(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80)) {
            return ":" + this.opts.port;
          } else {
            return "";
          }
        }
        _query(query) {
          const encodedQuery = encode(query);
          return encodedQuery.length ? "?" + encodedQuery : "";
        }
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/polling.js
  var Polling;
  var init_polling = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/polling.js"() {
      init_transport();
      init_util();
      init_esm();
      Polling = class extends Transport {
        constructor() {
          super(...arguments);
          this._polling = false;
        }
        get name() {
          return "polling";
        }
        /**
         * Opens the socket (triggers polling). We write a PING message to determine
         * when the transport is open.
         *
         * @protected
         */
        doOpen() {
          this._poll();
        }
        /**
         * Pauses polling.
         *
         * @param {Function} onPause - callback upon buffers are flushed and transport is paused
         * @package
         */
        pause(onPause) {
          this.readyState = "pausing";
          const pause = () => {
            this.readyState = "paused";
            onPause();
          };
          if (this._polling || !this.writable) {
            let total = 0;
            if (this._polling) {
              total++;
              this.once("pollComplete", function() {
                --total || pause();
              });
            }
            if (!this.writable) {
              total++;
              this.once("drain", function() {
                --total || pause();
              });
            }
          } else {
            pause();
          }
        }
        /**
         * Starts polling cycle.
         *
         * @private
         */
        _poll() {
          this._polling = true;
          this.doPoll();
          this.emitReserved("poll");
        }
        /**
         * Overloads onData to detect payloads.
         *
         * @protected
         */
        onData(data) {
          const callback = (packet) => {
            if ("opening" === this.readyState && packet.type === "open") {
              this.onOpen();
            }
            if ("close" === packet.type) {
              this.onClose({ description: "transport closed by the server" });
              return false;
            }
            this.onPacket(packet);
          };
          decodePayload(data, this.socket.binaryType).forEach(callback);
          if ("closed" !== this.readyState) {
            this._polling = false;
            this.emitReserved("pollComplete");
            if ("open" === this.readyState) {
              this._poll();
            } else {
            }
          }
        }
        /**
         * For polling, send a close packet.
         *
         * @protected
         */
        doClose() {
          const close = () => {
            this.write([{ type: "close" }]);
          };
          if ("open" === this.readyState) {
            close();
          } else {
            this.once("open", close);
          }
        }
        /**
         * Writes a packets payload.
         *
         * @param {Array} packets - data packets
         * @protected
         */
        write(packets) {
          this.writable = false;
          encodePayload(packets, (data) => {
            this.doWrite(data, () => {
              this.writable = true;
              this.emitReserved("drain");
            });
          });
        }
        /**
         * Generates uri for connection.
         *
         * @private
         */
        uri() {
          const schema = this.opts.secure ? "https" : "http";
          const query = this.query || {};
          if (false !== this.opts.timestampRequests) {
            query[this.opts.timestampParam] = randomString();
          }
          if (!this.supportsBinary && !query.sid) {
            query.b64 = 1;
          }
          return this.createUri(schema, query);
        }
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/contrib/has-cors.js
  var value, hasCORS;
  var init_has_cors = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/contrib/has-cors.js"() {
      value = false;
      try {
        value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
      } catch (err) {
      }
      hasCORS = value;
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/polling-xhr.js
  function empty() {
  }
  function unloadHandler() {
    for (let i in Request.requests) {
      if (Request.requests.hasOwnProperty(i)) {
        Request.requests[i].abort();
      }
    }
  }
  function newRequest(opts) {
    const xdomain = opts.xdomain;
    try {
      if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
        return new XMLHttpRequest();
      }
    } catch (e) {
    }
    if (!xdomain) {
      try {
        return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
      } catch (e) {
      }
    }
  }
  var BaseXHR, Request, hasXHR2, XHR;
  var init_polling_xhr = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/polling-xhr.js"() {
      init_polling();
      init_esm2();
      init_util();
      init_globals();
      init_has_cors();
      BaseXHR = class extends Polling {
        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @package
         */
        constructor(opts) {
          super(opts);
          if (typeof location !== "undefined") {
            const isSSL = "https:" === location.protocol;
            let port = location.port;
            if (!port) {
              port = isSSL ? "443" : "80";
            }
            this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
          }
        }
        /**
         * Sends data.
         *
         * @param {String} data to send.
         * @param {Function} called upon flush.
         * @private
         */
        doWrite(data, fn) {
          const req = this.request({
            method: "POST",
            data
          });
          req.on("success", fn);
          req.on("error", (xhrStatus, context) => {
            this.onError("xhr post error", xhrStatus, context);
          });
        }
        /**
         * Starts a poll cycle.
         *
         * @private
         */
        doPoll() {
          const req = this.request();
          req.on("data", this.onData.bind(this));
          req.on("error", (xhrStatus, context) => {
            this.onError("xhr poll error", xhrStatus, context);
          });
          this.pollXhr = req;
        }
      };
      Request = class _Request extends Emitter {
        /**
         * Request constructor
         *
         * @param {Object} options
         * @package
         */
        constructor(createRequest, uri, opts) {
          super();
          this.createRequest = createRequest;
          installTimerFunctions(this, opts);
          this._opts = opts;
          this._method = opts.method || "GET";
          this._uri = uri;
          this._data = void 0 !== opts.data ? opts.data : null;
          this._create();
        }
        /**
         * Creates the XHR object and sends the request.
         *
         * @private
         */
        _create() {
          var _a;
          const opts = pick(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
          opts.xdomain = !!this._opts.xd;
          const xhr = this._xhr = this.createRequest(opts);
          try {
            xhr.open(this._method, this._uri, true);
            try {
              if (this._opts.extraHeaders) {
                xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                for (let i in this._opts.extraHeaders) {
                  if (this._opts.extraHeaders.hasOwnProperty(i)) {
                    xhr.setRequestHeader(i, this._opts.extraHeaders[i]);
                  }
                }
              }
            } catch (e) {
            }
            if ("POST" === this._method) {
              try {
                xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
              } catch (e) {
              }
            }
            try {
              xhr.setRequestHeader("Accept", "*/*");
            } catch (e) {
            }
            (_a = this._opts.cookieJar) === null || _a === void 0 ? void 0 : _a.addCookies(xhr);
            if ("withCredentials" in xhr) {
              xhr.withCredentials = this._opts.withCredentials;
            }
            if (this._opts.requestTimeout) {
              xhr.timeout = this._opts.requestTimeout;
            }
            xhr.onreadystatechange = () => {
              var _a2;
              if (xhr.readyState === 3) {
                (_a2 = this._opts.cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(
                  // @ts-ignore
                  xhr.getResponseHeader("set-cookie")
                );
              }
              if (4 !== xhr.readyState)
                return;
              if (200 === xhr.status || 1223 === xhr.status) {
                this._onLoad();
              } else {
                this.setTimeoutFn(() => {
                  this._onError(typeof xhr.status === "number" ? xhr.status : 0);
                }, 0);
              }
            };
            xhr.send(this._data);
          } catch (e) {
            this.setTimeoutFn(() => {
              this._onError(e);
            }, 0);
            return;
          }
          if (typeof document !== "undefined") {
            this._index = _Request.requestsCount++;
            _Request.requests[this._index] = this;
          }
        }
        /**
         * Called upon error.
         *
         * @private
         */
        _onError(err) {
          this.emitReserved("error", err, this._xhr);
          this._cleanup(true);
        }
        /**
         * Cleans up house.
         *
         * @private
         */
        _cleanup(fromError) {
          if ("undefined" === typeof this._xhr || null === this._xhr) {
            return;
          }
          this._xhr.onreadystatechange = empty;
          if (fromError) {
            try {
              this._xhr.abort();
            } catch (e) {
            }
          }
          if (typeof document !== "undefined") {
            delete _Request.requests[this._index];
          }
          this._xhr = null;
        }
        /**
         * Called upon load.
         *
         * @private
         */
        _onLoad() {
          const data = this._xhr.responseText;
          if (data !== null) {
            this.emitReserved("data", data);
            this.emitReserved("success");
            this._cleanup();
          }
        }
        /**
         * Aborts the request.
         *
         * @package
         */
        abort() {
          this._cleanup();
        }
      };
      Request.requestsCount = 0;
      Request.requests = {};
      if (typeof document !== "undefined") {
        if (typeof attachEvent === "function") {
          attachEvent("onunload", unloadHandler);
        } else if (typeof addEventListener === "function") {
          const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
          addEventListener(terminationEvent, unloadHandler, false);
        }
      }
      hasXHR2 = (function() {
        const xhr = newRequest({
          xdomain: false
        });
        return xhr && xhr.responseType !== null;
      })();
      XHR = class extends BaseXHR {
        constructor(opts) {
          super(opts);
          const forceBase64 = opts && opts.forceBase64;
          this.supportsBinary = hasXHR2 && !forceBase64;
        }
        request(opts = {}) {
          Object.assign(opts, { xd: this.xd }, this.opts);
          return new Request(newRequest, this.uri(), opts);
        }
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/websocket.js
  var isReactNative, BaseWS, WebSocketCtor, WS;
  var init_websocket = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/websocket.js"() {
      init_transport();
      init_util();
      init_esm();
      init_globals();
      isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
      BaseWS = class extends Transport {
        get name() {
          return "websocket";
        }
        doOpen() {
          const uri = this.uri();
          const protocols = this.opts.protocols;
          const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
          if (this.opts.extraHeaders) {
            opts.headers = this.opts.extraHeaders;
          }
          try {
            this.ws = this.createSocket(uri, protocols, opts);
          } catch (err) {
            return this.emitReserved("error", err);
          }
          this.ws.binaryType = this.socket.binaryType;
          this.addEventListeners();
        }
        /**
         * Adds event listeners to the socket
         *
         * @private
         */
        addEventListeners() {
          this.ws.onopen = () => {
            if (this.opts.autoUnref) {
              this.ws._socket.unref();
            }
            this.onOpen();
          };
          this.ws.onclose = (closeEvent) => this.onClose({
            description: "websocket connection closed",
            context: closeEvent
          });
          this.ws.onmessage = (ev) => this.onData(ev.data);
          this.ws.onerror = (e) => this.onError("websocket error", e);
        }
        write(packets) {
          this.writable = false;
          for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const lastPacket = i === packets.length - 1;
            encodePacket(packet, this.supportsBinary, (data) => {
              try {
                this.doWrite(packet, data);
              } catch (e) {
              }
              if (lastPacket) {
                nextTick(() => {
                  this.writable = true;
                  this.emitReserved("drain");
                }, this.setTimeoutFn);
              }
            });
          }
        }
        doClose() {
          if (typeof this.ws !== "undefined") {
            this.ws.onerror = () => {
            };
            this.ws.close();
            this.ws = null;
          }
        }
        /**
         * Generates uri for connection.
         *
         * @private
         */
        uri() {
          const schema = this.opts.secure ? "wss" : "ws";
          const query = this.query || {};
          if (this.opts.timestampRequests) {
            query[this.opts.timestampParam] = randomString();
          }
          if (!this.supportsBinary) {
            query.b64 = 1;
          }
          return this.createUri(schema, query);
        }
      };
      WebSocketCtor = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
      WS = class extends BaseWS {
        createSocket(uri, protocols, opts) {
          return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
        }
        doWrite(_packet, data) {
          this.ws.send(data);
        }
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/webtransport.js
  var WT;
  var init_webtransport = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/webtransport.js"() {
      init_transport();
      init_globals();
      init_esm();
      WT = class extends Transport {
        get name() {
          return "webtransport";
        }
        doOpen() {
          try {
            this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
          } catch (err) {
            return this.emitReserved("error", err);
          }
          this._transport.closed.then(() => {
            this.onClose();
          }).catch((err) => {
            this.onError("webtransport error", err);
          });
          this._transport.ready.then(() => {
            this._transport.createBidirectionalStream().then((stream) => {
              const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
              const reader = stream.readable.pipeThrough(decoderStream).getReader();
              const encoderStream = createPacketEncoderStream();
              encoderStream.readable.pipeTo(stream.writable);
              this._writer = encoderStream.writable.getWriter();
              const read = () => {
                reader.read().then(({ done, value: value2 }) => {
                  if (done) {
                    return;
                  }
                  this.onPacket(value2);
                  read();
                }).catch((err) => {
                });
              };
              read();
              const packet = { type: "open" };
              if (this.query.sid) {
                packet.data = `{"sid":"${this.query.sid}"}`;
              }
              this._writer.write(packet).then(() => this.onOpen());
            });
          });
        }
        write(packets) {
          this.writable = false;
          for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const lastPacket = i === packets.length - 1;
            this._writer.write(packet).then(() => {
              if (lastPacket) {
                nextTick(() => {
                  this.writable = true;
                  this.emitReserved("drain");
                }, this.setTimeoutFn);
              }
            });
          }
        }
        doClose() {
          var _a;
          (_a = this._transport) === null || _a === void 0 ? void 0 : _a.close();
        }
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/index.js
  var transports;
  var init_transports = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/index.js"() {
      init_polling_xhr();
      init_websocket();
      init_webtransport();
      transports = {
        websocket: WS,
        webtransport: WT,
        polling: XHR
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/contrib/parseuri.js
  function parse(str) {
    if (str.length > 8e3) {
      throw "URI too long";
    }
    const src = str, b = str.indexOf("["), e = str.indexOf("]");
    if (b != -1 && e != -1) {
      str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
    }
    let m = re.exec(str || ""), uri = {}, i = 14;
    while (i--) {
      uri[parts[i]] = m[i] || "";
    }
    if (b != -1 && e != -1) {
      uri.source = src;
      uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
      uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
      uri.ipv6uri = true;
    }
    uri.pathNames = pathNames(uri, uri["path"]);
    uri.queryKey = queryKey(uri, uri["query"]);
    return uri;
  }
  function pathNames(obj, path) {
    const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
    if (path.slice(0, 1) == "/" || path.length === 0) {
      names.splice(0, 1);
    }
    if (path.slice(-1) == "/") {
      names.splice(names.length - 1, 1);
    }
    return names;
  }
  function queryKey(uri, query) {
    const data = {};
    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
      if ($1) {
        data[$1] = $2;
      }
    });
    return data;
  }
  var re, parts;
  var init_parseuri = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/contrib/parseuri.js"() {
      re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
      parts = [
        "source",
        "protocol",
        "authority",
        "userInfo",
        "user",
        "password",
        "host",
        "port",
        "relative",
        "path",
        "directory",
        "file",
        "query",
        "anchor"
      ];
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/socket.js
  var withEventListeners, OFFLINE_EVENT_LISTENERS, SocketWithoutUpgrade, SocketWithUpgrade, Socket;
  var init_socket = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/socket.js"() {
      init_transports();
      init_util();
      init_parseqs();
      init_parseuri();
      init_esm2();
      init_esm();
      init_globals();
      withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
      OFFLINE_EVENT_LISTENERS = [];
      if (withEventListeners) {
        addEventListener("offline", () => {
          OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
        }, false);
      }
      SocketWithoutUpgrade = class _SocketWithoutUpgrade extends Emitter {
        /**
         * Socket constructor.
         *
         * @param {String|Object} uri - uri or options
         * @param {Object} opts - options
         */
        constructor(uri, opts) {
          super();
          this.binaryType = defaultBinaryType;
          this.writeBuffer = [];
          this._prevBufferLen = 0;
          this._pingInterval = -1;
          this._pingTimeout = -1;
          this._maxPayload = -1;
          this._pingTimeoutTime = Infinity;
          if (uri && "object" === typeof uri) {
            opts = uri;
            uri = null;
          }
          if (uri) {
            const parsedUri = parse(uri);
            opts.hostname = parsedUri.host;
            opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
            opts.port = parsedUri.port;
            if (parsedUri.query)
              opts.query = parsedUri.query;
          } else if (opts.host) {
            opts.hostname = parse(opts.host).host;
          }
          installTimerFunctions(this, opts);
          this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
          if (opts.hostname && !opts.port) {
            opts.port = this.secure ? "443" : "80";
          }
          this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
          this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
          this.transports = [];
          this._transportsByName = {};
          opts.transports.forEach((t) => {
            const transportName = t.prototype.name;
            this.transports.push(transportName);
            this._transportsByName[transportName] = t;
          });
          this.opts = Object.assign({
            path: "/engine.io",
            agent: false,
            withCredentials: false,
            upgrade: true,
            timestampParam: "t",
            rememberUpgrade: false,
            addTrailingSlash: true,
            rejectUnauthorized: true,
            perMessageDeflate: {
              threshold: 1024
            },
            transportOptions: {},
            closeOnBeforeunload: false
          }, opts);
          this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
          if (typeof this.opts.query === "string") {
            this.opts.query = decode2(this.opts.query);
          }
          if (withEventListeners) {
            if (this.opts.closeOnBeforeunload) {
              this._beforeunloadEventListener = () => {
                if (this.transport) {
                  this.transport.removeAllListeners();
                  this.transport.close();
                }
              };
              addEventListener("beforeunload", this._beforeunloadEventListener, false);
            }
            if (this.hostname !== "localhost") {
              this._offlineEventListener = () => {
                this._onClose("transport close", {
                  description: "network connection lost"
                });
              };
              OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
            }
          }
          if (this.opts.withCredentials) {
            this._cookieJar = createCookieJar();
          }
          this._open();
        }
        /**
         * Creates transport of the given type.
         *
         * @param {String} name - transport name
         * @return {Transport}
         * @private
         */
        createTransport(name) {
          const query = Object.assign({}, this.opts.query);
          query.EIO = protocol;
          query.transport = name;
          if (this.id)
            query.sid = this.id;
          const opts = Object.assign({}, this.opts, {
            query,
            socket: this,
            hostname: this.hostname,
            secure: this.secure,
            port: this.port
          }, this.opts.transportOptions[name]);
          return new this._transportsByName[name](opts);
        }
        /**
         * Initializes transport to use and starts probe.
         *
         * @private
         */
        _open() {
          if (this.transports.length === 0) {
            this.setTimeoutFn(() => {
              this.emitReserved("error", "No transports available");
            }, 0);
            return;
          }
          const transportName = this.opts.rememberUpgrade && _SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
          this.readyState = "opening";
          const transport = this.createTransport(transportName);
          transport.open();
          this.setTransport(transport);
        }
        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @private
         */
        setTransport(transport) {
          if (this.transport) {
            this.transport.removeAllListeners();
          }
          this.transport = transport;
          transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
        }
        /**
         * Called when connection is deemed open.
         *
         * @private
         */
        onOpen() {
          this.readyState = "open";
          _SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
          this.emitReserved("open");
          this.flush();
        }
        /**
         * Handles a packet.
         *
         * @private
         */
        _onPacket(packet) {
          if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
            this.emitReserved("packet", packet);
            this.emitReserved("heartbeat");
            switch (packet.type) {
              case "open":
                this.onHandshake(JSON.parse(packet.data));
                break;
              case "ping":
                this._sendPacket("pong");
                this.emitReserved("ping");
                this.emitReserved("pong");
                this._resetPingTimeout();
                break;
              case "error":
                const err = new Error("server error");
                err.code = packet.data;
                this._onError(err);
                break;
              case "message":
                this.emitReserved("data", packet.data);
                this.emitReserved("message", packet.data);
                break;
            }
          } else {
          }
        }
        /**
         * Called upon handshake completion.
         *
         * @param {Object} data - handshake obj
         * @private
         */
        onHandshake(data) {
          this.emitReserved("handshake", data);
          this.id = data.sid;
          this.transport.query.sid = data.sid;
          this._pingInterval = data.pingInterval;
          this._pingTimeout = data.pingTimeout;
          this._maxPayload = data.maxPayload;
          this.onOpen();
          if ("closed" === this.readyState)
            return;
          this._resetPingTimeout();
        }
        /**
         * Sets and resets ping timeout timer based on server pings.
         *
         * @private
         */
        _resetPingTimeout() {
          this.clearTimeoutFn(this._pingTimeoutTimer);
          const delay = this._pingInterval + this._pingTimeout;
          this._pingTimeoutTime = Date.now() + delay;
          this._pingTimeoutTimer = this.setTimeoutFn(() => {
            this._onClose("ping timeout");
          }, delay);
          if (this.opts.autoUnref) {
            this._pingTimeoutTimer.unref();
          }
        }
        /**
         * Called on `drain` event
         *
         * @private
         */
        _onDrain() {
          this.writeBuffer.splice(0, this._prevBufferLen);
          this._prevBufferLen = 0;
          if (0 === this.writeBuffer.length) {
            this.emitReserved("drain");
          } else {
            this.flush();
          }
        }
        /**
         * Flush write buffers.
         *
         * @private
         */
        flush() {
          if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
            const packets = this._getWritablePackets();
            this.transport.send(packets);
            this._prevBufferLen = packets.length;
            this.emitReserved("flush");
          }
        }
        /**
         * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
         * long-polling)
         *
         * @private
         */
        _getWritablePackets() {
          const shouldCheckPayloadSize = this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
          if (!shouldCheckPayloadSize) {
            return this.writeBuffer;
          }
          let payloadSize = 1;
          for (let i = 0; i < this.writeBuffer.length; i++) {
            const data = this.writeBuffer[i].data;
            if (data) {
              payloadSize += byteLength(data);
            }
            if (i > 0 && payloadSize > this._maxPayload) {
              return this.writeBuffer.slice(0, i);
            }
            payloadSize += 2;
          }
          return this.writeBuffer;
        }
        /**
         * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
         *
         * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
         * `write()` method then the message would not be buffered by the Socket.IO client.
         *
         * @return {boolean}
         * @private
         */
        /* private */
        _hasPingExpired() {
          if (!this._pingTimeoutTime)
            return true;
          const hasExpired = Date.now() > this._pingTimeoutTime;
          if (hasExpired) {
            this._pingTimeoutTime = 0;
            nextTick(() => {
              this._onClose("ping timeout");
            }, this.setTimeoutFn);
          }
          return hasExpired;
        }
        /**
         * Sends a message.
         *
         * @param {String} msg - message.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @return {Socket} for chaining.
         */
        write(msg, options, fn) {
          this._sendPacket("message", msg, options, fn);
          return this;
        }
        /**
         * Sends a message. Alias of {@link Socket#write}.
         *
         * @param {String} msg - message.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @return {Socket} for chaining.
         */
        send(msg, options, fn) {
          this._sendPacket("message", msg, options, fn);
          return this;
        }
        /**
         * Sends a packet.
         *
         * @param {String} type: packet type.
         * @param {String} data.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @private
         */
        _sendPacket(type, data, options, fn) {
          if ("function" === typeof data) {
            fn = data;
            data = void 0;
          }
          if ("function" === typeof options) {
            fn = options;
            options = null;
          }
          if ("closing" === this.readyState || "closed" === this.readyState) {
            return;
          }
          options = options || {};
          options.compress = false !== options.compress;
          const packet = {
            type,
            data,
            options
          };
          this.emitReserved("packetCreate", packet);
          this.writeBuffer.push(packet);
          if (fn)
            this.once("flush", fn);
          this.flush();
        }
        /**
         * Closes the connection.
         */
        close() {
          const close = () => {
            this._onClose("forced close");
            this.transport.close();
          };
          const cleanupAndClose = () => {
            this.off("upgrade", cleanupAndClose);
            this.off("upgradeError", cleanupAndClose);
            close();
          };
          const waitForUpgrade = () => {
            this.once("upgrade", cleanupAndClose);
            this.once("upgradeError", cleanupAndClose);
          };
          if ("opening" === this.readyState || "open" === this.readyState) {
            this.readyState = "closing";
            if (this.writeBuffer.length) {
              this.once("drain", () => {
                if (this.upgrading) {
                  waitForUpgrade();
                } else {
                  close();
                }
              });
            } else if (this.upgrading) {
              waitForUpgrade();
            } else {
              close();
            }
          }
          return this;
        }
        /**
         * Called upon transport error
         *
         * @private
         */
        _onError(err) {
          _SocketWithoutUpgrade.priorWebsocketSuccess = false;
          if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
            this.transports.shift();
            return this._open();
          }
          this.emitReserved("error", err);
          this._onClose("transport error", err);
        }
        /**
         * Called upon transport close.
         *
         * @private
         */
        _onClose(reason, description) {
          if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
            this.clearTimeoutFn(this._pingTimeoutTimer);
            this.transport.removeAllListeners("close");
            this.transport.close();
            this.transport.removeAllListeners();
            if (withEventListeners) {
              if (this._beforeunloadEventListener) {
                removeEventListener("beforeunload", this._beforeunloadEventListener, false);
              }
              if (this._offlineEventListener) {
                const i = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
                if (i !== -1) {
                  OFFLINE_EVENT_LISTENERS.splice(i, 1);
                }
              }
            }
            this.readyState = "closed";
            this.id = null;
            this.emitReserved("close", reason, description);
            this.writeBuffer = [];
            this._prevBufferLen = 0;
          }
        }
      };
      SocketWithoutUpgrade.protocol = protocol;
      SocketWithUpgrade = class extends SocketWithoutUpgrade {
        constructor() {
          super(...arguments);
          this._upgrades = [];
        }
        onOpen() {
          super.onOpen();
          if ("open" === this.readyState && this.opts.upgrade) {
            for (let i = 0; i < this._upgrades.length; i++) {
              this._probe(this._upgrades[i]);
            }
          }
        }
        /**
         * Probes a transport.
         *
         * @param {String} name - transport name
         * @private
         */
        _probe(name) {
          let transport = this.createTransport(name);
          let failed = false;
          SocketWithoutUpgrade.priorWebsocketSuccess = false;
          const onTransportOpen = () => {
            if (failed)
              return;
            transport.send([{ type: "ping", data: "probe" }]);
            transport.once("packet", (msg) => {
              if (failed)
                return;
              if ("pong" === msg.type && "probe" === msg.data) {
                this.upgrading = true;
                this.emitReserved("upgrading", transport);
                if (!transport)
                  return;
                SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
                this.transport.pause(() => {
                  if (failed)
                    return;
                  if ("closed" === this.readyState)
                    return;
                  cleanup();
                  this.setTransport(transport);
                  transport.send([{ type: "upgrade" }]);
                  this.emitReserved("upgrade", transport);
                  transport = null;
                  this.upgrading = false;
                  this.flush();
                });
              } else {
                const err = new Error("probe error");
                err.transport = transport.name;
                this.emitReserved("upgradeError", err);
              }
            });
          };
          function freezeTransport() {
            if (failed)
              return;
            failed = true;
            cleanup();
            transport.close();
            transport = null;
          }
          const onerror = (err) => {
            const error = new Error("probe error: " + err);
            error.transport = transport.name;
            freezeTransport();
            this.emitReserved("upgradeError", error);
          };
          function onTransportClose() {
            onerror("transport closed");
          }
          function onclose() {
            onerror("socket closed");
          }
          function onupgrade(to) {
            if (transport && to.name !== transport.name) {
              freezeTransport();
            }
          }
          const cleanup = () => {
            transport.removeListener("open", onTransportOpen);
            transport.removeListener("error", onerror);
            transport.removeListener("close", onTransportClose);
            this.off("close", onclose);
            this.off("upgrading", onupgrade);
          };
          transport.once("open", onTransportOpen);
          transport.once("error", onerror);
          transport.once("close", onTransportClose);
          this.once("close", onclose);
          this.once("upgrading", onupgrade);
          if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") {
            this.setTimeoutFn(() => {
              if (!failed) {
                transport.open();
              }
            }, 200);
          } else {
            transport.open();
          }
        }
        onHandshake(data) {
          this._upgrades = this._filterUpgrades(data.upgrades);
          super.onHandshake(data);
        }
        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} upgrades - server upgrades
         * @private
         */
        _filterUpgrades(upgrades) {
          const filteredUpgrades = [];
          for (let i = 0; i < upgrades.length; i++) {
            if (~this.transports.indexOf(upgrades[i]))
              filteredUpgrades.push(upgrades[i]);
          }
          return filteredUpgrades;
        }
      };
      Socket = class extends SocketWithUpgrade {
        constructor(uri, opts = {}) {
          const o = typeof uri === "object" ? uri : opts;
          if (!o.transports || o.transports && typeof o.transports[0] === "string") {
            o.transports = (o.transports || ["polling", "websocket", "webtransport"]).map((transportName) => transports[transportName]).filter((t) => !!t);
          }
          super(uri, o);
        }
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/polling-fetch.js
  var Fetch;
  var init_polling_fetch = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/transports/polling-fetch.js"() {
      init_polling();
      Fetch = class extends Polling {
        doPoll() {
          this._fetch().then((res) => {
            if (!res.ok) {
              return this.onError("fetch read error", res.status, res);
            }
            res.text().then((data) => this.onData(data));
          }).catch((err) => {
            this.onError("fetch read error", err);
          });
        }
        doWrite(data, callback) {
          this._fetch(data).then((res) => {
            if (!res.ok) {
              return this.onError("fetch write error", res.status, res);
            }
            callback();
          }).catch((err) => {
            this.onError("fetch write error", err);
          });
        }
        _fetch(data) {
          var _a;
          const isPost = data !== void 0;
          const headers = new Headers(this.opts.extraHeaders);
          if (isPost) {
            headers.set("content-type", "text/plain;charset=UTF-8");
          }
          (_a = this.socket._cookieJar) === null || _a === void 0 ? void 0 : _a.appendCookies(headers);
          return fetch(this.uri(), {
            method: isPost ? "POST" : "GET",
            body: isPost ? data : null,
            headers,
            credentials: this.opts.withCredentials ? "include" : "omit"
          }).then((res) => {
            var _a2;
            (_a2 = this.socket._cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(res.headers.getSetCookie());
            return res;
          });
        }
      };
    }
  });

  // ../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/index.js
  var protocol2;
  var init_esm3 = __esm({
    "../../node_modules/.pnpm/engine.io-client@6.6.3/node_modules/engine.io-client/build/esm/index.js"() {
      init_socket();
      init_socket();
      init_transport();
      init_transports();
      init_util();
      init_parseuri();
      init_globals();
      init_polling_fetch();
      init_polling_xhr();
      init_polling_xhr();
      init_websocket();
      init_websocket();
      init_webtransport();
      protocol2 = Socket.protocol;
    }
  });

  // ../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/url.js
  function url(uri, path = "", loc) {
    let obj = uri;
    loc = loc || typeof location !== "undefined" && location;
    if (null == uri)
      uri = loc.protocol + "//" + loc.host;
    if (typeof uri === "string") {
      if ("/" === uri.charAt(0)) {
        if ("/" === uri.charAt(1)) {
          uri = loc.protocol + uri;
        } else {
          uri = loc.host + uri;
        }
      }
      if (!/^(https?|wss?):\/\//.test(uri)) {
        if ("undefined" !== typeof loc) {
          uri = loc.protocol + "//" + uri;
        } else {
          uri = "https://" + uri;
        }
      }
      obj = parse(uri);
    }
    if (!obj.port) {
      if (/^(http|ws)$/.test(obj.protocol)) {
        obj.port = "80";
      } else if (/^(http|ws)s$/.test(obj.protocol)) {
        obj.port = "443";
      }
    }
    obj.path = obj.path || "/";
    const ipv6 = obj.host.indexOf(":") !== -1;
    const host = ipv6 ? "[" + obj.host + "]" : obj.host;
    obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
    obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
    return obj;
  }
  var init_url = __esm({
    "../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/url.js"() {
      init_esm3();
    }
  });

  // ../../node_modules/.pnpm/socket.io-parser@4.2.4/node_modules/socket.io-parser/build/esm/is-binary.js
  function isBinary(obj) {
    return withNativeArrayBuffer3 && (obj instanceof ArrayBuffer || isView2(obj)) || withNativeBlob2 && obj instanceof Blob || withNativeFile && obj instanceof File;
  }
  function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
      return false;
    }
    if (Array.isArray(obj)) {
      for (let i = 0, l = obj.length; i < l; i++) {
        if (hasBinary(obj[i])) {
          return true;
        }
      }
      return false;
    }
    if (isBinary(obj)) {
      return true;
    }
    if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
      return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
        return true;
      }
    }
    return false;
  }
  var withNativeArrayBuffer3, isView2, toString, withNativeBlob2, withNativeFile;
  var init_is_binary = __esm({
    "../../node_modules/.pnpm/socket.io-parser@4.2.4/node_modules/socket.io-parser/build/esm/is-binary.js"() {
      withNativeArrayBuffer3 = typeof ArrayBuffer === "function";
      isView2 = (obj) => {
        return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
      };
      toString = Object.prototype.toString;
      withNativeBlob2 = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
      withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
    }
  });

  // ../../node_modules/.pnpm/socket.io-parser@4.2.4/node_modules/socket.io-parser/build/esm/binary.js
  function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length;
    return { packet: pack, buffers };
  }
  function _deconstructPacket(data, buffers) {
    if (!data)
      return data;
    if (isBinary(data)) {
      const placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (Array.isArray(data)) {
      const newData = new Array(data.length);
      for (let i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i], buffers);
      }
      return newData;
    } else if (typeof data === "object" && !(data instanceof Date)) {
      const newData = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          newData[key] = _deconstructPacket(data[key], buffers);
        }
      }
      return newData;
    }
    return data;
  }
  function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    delete packet.attachments;
    return packet;
  }
  function _reconstructPacket(data, buffers) {
    if (!data)
      return data;
    if (data && data._placeholder === true) {
      const isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
      if (isIndexValid) {
        return buffers[data.num];
      } else {
        throw new Error("illegal attachments");
      }
    } else if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i], buffers);
      }
    } else if (typeof data === "object") {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          data[key] = _reconstructPacket(data[key], buffers);
        }
      }
    }
    return data;
  }
  var init_binary = __esm({
    "../../node_modules/.pnpm/socket.io-parser@4.2.4/node_modules/socket.io-parser/build/esm/binary.js"() {
      init_is_binary();
    }
  });

  // ../../node_modules/.pnpm/socket.io-parser@4.2.4/node_modules/socket.io-parser/build/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    Decoder: () => Decoder,
    Encoder: () => Encoder,
    PacketType: () => PacketType,
    protocol: () => protocol3
  });
  function isObject(value2) {
    return Object.prototype.toString.call(value2) === "[object Object]";
  }
  var RESERVED_EVENTS, protocol3, PacketType, Encoder, Decoder, BinaryReconstructor;
  var init_esm4 = __esm({
    "../../node_modules/.pnpm/socket.io-parser@4.2.4/node_modules/socket.io-parser/build/esm/index.js"() {
      init_esm2();
      init_binary();
      init_is_binary();
      RESERVED_EVENTS = [
        "connect",
        "connect_error",
        "disconnect",
        "disconnecting",
        "newListener",
        "removeListener"
        // used by the Node.js EventEmitter
      ];
      protocol3 = 5;
      (function(PacketType2) {
        PacketType2[PacketType2["CONNECT"] = 0] = "CONNECT";
        PacketType2[PacketType2["DISCONNECT"] = 1] = "DISCONNECT";
        PacketType2[PacketType2["EVENT"] = 2] = "EVENT";
        PacketType2[PacketType2["ACK"] = 3] = "ACK";
        PacketType2[PacketType2["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
        PacketType2[PacketType2["BINARY_EVENT"] = 5] = "BINARY_EVENT";
        PacketType2[PacketType2["BINARY_ACK"] = 6] = "BINARY_ACK";
      })(PacketType || (PacketType = {}));
      Encoder = class {
        /**
         * Encoder constructor
         *
         * @param {function} replacer - custom replacer to pass down to JSON.parse
         */
        constructor(replacer) {
          this.replacer = replacer;
        }
        /**
         * Encode a packet as a single string if non-binary, or as a
         * buffer sequence, depending on packet type.
         *
         * @param {Object} obj - packet object
         */
        encode(obj) {
          if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if (hasBinary(obj)) {
              return this.encodeAsBinary({
                type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
                nsp: obj.nsp,
                data: obj.data,
                id: obj.id
              });
            }
          }
          return [this.encodeAsString(obj)];
        }
        /**
         * Encode packet as string.
         */
        encodeAsString(obj) {
          let str = "" + obj.type;
          if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
          }
          if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
          }
          if (null != obj.id) {
            str += obj.id;
          }
          if (null != obj.data) {
            str += JSON.stringify(obj.data, this.replacer);
          }
          return str;
        }
        /**
         * Encode packet as 'buffer sequence' by removing blobs, and
         * deconstructing packet into object with placeholders and
         * a list of buffers.
         */
        encodeAsBinary(obj) {
          const deconstruction = deconstructPacket(obj);
          const pack = this.encodeAsString(deconstruction.packet);
          const buffers = deconstruction.buffers;
          buffers.unshift(pack);
          return buffers;
        }
      };
      Decoder = class _Decoder extends Emitter {
        /**
         * Decoder constructor
         *
         * @param {function} reviver - custom reviver to pass down to JSON.stringify
         */
        constructor(reviver) {
          super();
          this.reviver = reviver;
        }
        /**
         * Decodes an encoded packet string into packet JSON.
         *
         * @param {String} obj - encoded packet
         */
        add(obj) {
          let packet;
          if (typeof obj === "string") {
            if (this.reconstructor) {
              throw new Error("got plaintext data when reconstructing a packet");
            }
            packet = this.decodeString(obj);
            const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
            if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
              packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
              this.reconstructor = new BinaryReconstructor(packet);
              if (packet.attachments === 0) {
                super.emitReserved("decoded", packet);
              }
            } else {
              super.emitReserved("decoded", packet);
            }
          } else if (isBinary(obj) || obj.base64) {
            if (!this.reconstructor) {
              throw new Error("got binary data when not reconstructing a packet");
            } else {
              packet = this.reconstructor.takeBinaryData(obj);
              if (packet) {
                this.reconstructor = null;
                super.emitReserved("decoded", packet);
              }
            }
          } else {
            throw new Error("Unknown type: " + obj);
          }
        }
        /**
         * Decode a packet String (JSON data)
         *
         * @param {String} str
         * @return {Object} packet
         */
        decodeString(str) {
          let i = 0;
          const p = {
            type: Number(str.charAt(0))
          };
          if (PacketType[p.type] === void 0) {
            throw new Error("unknown packet type " + p.type);
          }
          if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) {
            }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
              throw new Error("Illegal attachments");
            }
            p.attachments = Number(buf);
          }
          if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
              const c = str.charAt(i);
              if ("," === c)
                break;
              if (i === str.length)
                break;
            }
            p.nsp = str.substring(start, i);
          } else {
            p.nsp = "/";
          }
          const next = str.charAt(i + 1);
          if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
              const c = str.charAt(i);
              if (null == c || Number(c) != c) {
                --i;
                break;
              }
              if (i === str.length)
                break;
            }
            p.id = Number(str.substring(start, i + 1));
          }
          if (str.charAt(++i)) {
            const payload = this.tryParse(str.substr(i));
            if (_Decoder.isPayloadValid(p.type, payload)) {
              p.data = payload;
            } else {
              throw new Error("invalid payload");
            }
          }
          return p;
        }
        tryParse(str) {
          try {
            return JSON.parse(str, this.reviver);
          } catch (e) {
            return false;
          }
        }
        static isPayloadValid(type, payload) {
          switch (type) {
            case PacketType.CONNECT:
              return isObject(payload);
            case PacketType.DISCONNECT:
              return payload === void 0;
            case PacketType.CONNECT_ERROR:
              return typeof payload === "string" || isObject(payload);
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
              return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
              return Array.isArray(payload);
          }
        }
        /**
         * Deallocates a parser's resources
         */
        destroy() {
          if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
            this.reconstructor = null;
          }
        }
      };
      BinaryReconstructor = class {
        constructor(packet) {
          this.packet = packet;
          this.buffers = [];
          this.reconPack = packet;
        }
        /**
         * Method to be called when binary data received from connection
         * after a BINARY_EVENT packet.
         *
         * @param {Buffer | ArrayBuffer} binData - the raw binary data received
         * @return {null | Object} returns null if more binary data is expected or
         *   a reconstructed packet object if all buffers have been received.
         */
        takeBinaryData(binData) {
          this.buffers.push(binData);
          if (this.buffers.length === this.reconPack.attachments) {
            const packet = reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
          }
          return null;
        }
        /**
         * Cleans up binary packet reconstruction variables.
         */
        finishedReconstruction() {
          this.reconPack = null;
          this.buffers = [];
        }
      };
    }
  });

  // ../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/on.js
  function on(obj, ev, fn) {
    obj.on(ev, fn);
    return function subDestroy() {
      obj.off(ev, fn);
    };
  }
  var init_on = __esm({
    "../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/on.js"() {
    }
  });

  // ../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/socket.js
  var RESERVED_EVENTS2, Socket2;
  var init_socket2 = __esm({
    "../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/socket.js"() {
      init_esm4();
      init_on();
      init_esm2();
      RESERVED_EVENTS2 = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
        newListener: 1,
        removeListener: 1
      });
      Socket2 = class extends Emitter {
        /**
         * `Socket` constructor.
         */
        constructor(io, nsp, opts) {
          super();
          this.connected = false;
          this.recovered = false;
          this.receiveBuffer = [];
          this.sendBuffer = [];
          this._queue = [];
          this._queueSeq = 0;
          this.ids = 0;
          this.acks = {};
          this.flags = {};
          this.io = io;
          this.nsp = nsp;
          if (opts && opts.auth) {
            this.auth = opts.auth;
          }
          this._opts = Object.assign({}, opts);
          if (this.io._autoConnect)
            this.open();
        }
        /**
         * Whether the socket is currently disconnected
         *
         * @example
         * const socket = io();
         *
         * socket.on("connect", () => {
         *   console.log(socket.disconnected); // false
         * });
         *
         * socket.on("disconnect", () => {
         *   console.log(socket.disconnected); // true
         * });
         */
        get disconnected() {
          return !this.connected;
        }
        /**
         * Subscribe to open, close and packet events
         *
         * @private
         */
        subEvents() {
          if (this.subs)
            return;
          const io = this.io;
          this.subs = [
            on(io, "open", this.onopen.bind(this)),
            on(io, "packet", this.onpacket.bind(this)),
            on(io, "error", this.onerror.bind(this)),
            on(io, "close", this.onclose.bind(this))
          ];
        }
        /**
         * Whether the Socket will try to reconnect when its Manager connects or reconnects.
         *
         * @example
         * const socket = io();
         *
         * console.log(socket.active); // true
         *
         * socket.on("disconnect", (reason) => {
         *   if (reason === "io server disconnect") {
         *     // the disconnection was initiated by the server, you need to manually reconnect
         *     console.log(socket.active); // false
         *   }
         *   // else the socket will automatically try to reconnect
         *   console.log(socket.active); // true
         * });
         */
        get active() {
          return !!this.subs;
        }
        /**
         * "Opens" the socket.
         *
         * @example
         * const socket = io({
         *   autoConnect: false
         * });
         *
         * socket.connect();
         */
        connect() {
          if (this.connected)
            return this;
          this.subEvents();
          if (!this.io["_reconnecting"])
            this.io.open();
          if ("open" === this.io._readyState)
            this.onopen();
          return this;
        }
        /**
         * Alias for {@link connect()}.
         */
        open() {
          return this.connect();
        }
        /**
         * Sends a `message` event.
         *
         * This method mimics the WebSocket.send() method.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
         *
         * @example
         * socket.send("hello");
         *
         * // this is equivalent to
         * socket.emit("message", "hello");
         *
         * @return self
         */
        send(...args) {
          args.unshift("message");
          this.emit.apply(this, args);
          return this;
        }
        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @example
         * socket.emit("hello", "world");
         *
         * // all serializable datastructures are supported (no need to call JSON.stringify)
         * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
         *
         * // with an acknowledgement from the server
         * socket.emit("hello", "world", (val) => {
         *   // ...
         * });
         *
         * @return self
         */
        emit(ev, ...args) {
          var _a, _b, _c;
          if (RESERVED_EVENTS2.hasOwnProperty(ev)) {
            throw new Error('"' + ev.toString() + '" is a reserved event name');
          }
          args.unshift(ev);
          if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
            this._addToQueue(args);
            return this;
          }
          const packet = {
            type: PacketType.EVENT,
            data: args
          };
          packet.options = {};
          packet.options.compress = this.flags.compress !== false;
          if ("function" === typeof args[args.length - 1]) {
            const id = this.ids++;
            const ack = args.pop();
            this._registerAckCallback(id, ack);
            packet.id = id;
          }
          const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
          const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
          const discardPacket = this.flags.volatile && !isTransportWritable;
          if (discardPacket) {
          } else if (isConnected) {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
          } else {
            this.sendBuffer.push(packet);
          }
          this.flags = {};
          return this;
        }
        /**
         * @private
         */
        _registerAckCallback(id, ack) {
          var _a;
          const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
          if (timeout === void 0) {
            this.acks[id] = ack;
            return;
          }
          const timer = this.io.setTimeoutFn(() => {
            delete this.acks[id];
            for (let i = 0; i < this.sendBuffer.length; i++) {
              if (this.sendBuffer[i].id === id) {
                this.sendBuffer.splice(i, 1);
              }
            }
            ack.call(this, new Error("operation has timed out"));
          }, timeout);
          const fn = (...args) => {
            this.io.clearTimeoutFn(timer);
            ack.apply(this, args);
          };
          fn.withError = true;
          this.acks[id] = fn;
        }
        /**
         * Emits an event and waits for an acknowledgement
         *
         * @example
         * // without timeout
         * const response = await socket.emitWithAck("hello", "world");
         *
         * // with a specific timeout
         * try {
         *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
         * } catch (err) {
         *   // the server did not acknowledge the event in the given delay
         * }
         *
         * @return a Promise that will be fulfilled when the server acknowledges the event
         */
        emitWithAck(ev, ...args) {
          return new Promise((resolve, reject) => {
            const fn = (arg1, arg2) => {
              return arg1 ? reject(arg1) : resolve(arg2);
            };
            fn.withError = true;
            args.push(fn);
            this.emit(ev, ...args);
          });
        }
        /**
         * Add the packet to the queue.
         * @param args
         * @private
         */
        _addToQueue(args) {
          let ack;
          if (typeof args[args.length - 1] === "function") {
            ack = args.pop();
          }
          const packet = {
            id: this._queueSeq++,
            tryCount: 0,
            pending: false,
            args,
            flags: Object.assign({ fromQueue: true }, this.flags)
          };
          args.push((err, ...responseArgs) => {
            if (packet !== this._queue[0]) {
              return;
            }
            const hasError = err !== null;
            if (hasError) {
              if (packet.tryCount > this._opts.retries) {
                this._queue.shift();
                if (ack) {
                  ack(err);
                }
              }
            } else {
              this._queue.shift();
              if (ack) {
                ack(null, ...responseArgs);
              }
            }
            packet.pending = false;
            return this._drainQueue();
          });
          this._queue.push(packet);
          this._drainQueue();
        }
        /**
         * Send the first packet of the queue, and wait for an acknowledgement from the server.
         * @param force - whether to resend a packet that has not been acknowledged yet
         *
         * @private
         */
        _drainQueue(force = false) {
          if (!this.connected || this._queue.length === 0) {
            return;
          }
          const packet = this._queue[0];
          if (packet.pending && !force) {
            return;
          }
          packet.pending = true;
          packet.tryCount++;
          this.flags = packet.flags;
          this.emit.apply(this, packet.args);
        }
        /**
         * Sends a packet.
         *
         * @param packet
         * @private
         */
        packet(packet) {
          packet.nsp = this.nsp;
          this.io._packet(packet);
        }
        /**
         * Called upon engine `open`.
         *
         * @private
         */
        onopen() {
          if (typeof this.auth == "function") {
            this.auth((data) => {
              this._sendConnectPacket(data);
            });
          } else {
            this._sendConnectPacket(this.auth);
          }
        }
        /**
         * Sends a CONNECT packet to initiate the Socket.IO session.
         *
         * @param data
         * @private
         */
        _sendConnectPacket(data) {
          this.packet({
            type: PacketType.CONNECT,
            data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, data) : data
          });
        }
        /**
         * Called upon engine or manager `error`.
         *
         * @param err
         * @private
         */
        onerror(err) {
          if (!this.connected) {
            this.emitReserved("connect_error", err);
          }
        }
        /**
         * Called upon engine `close`.
         *
         * @param reason
         * @param description
         * @private
         */
        onclose(reason, description) {
          this.connected = false;
          delete this.id;
          this.emitReserved("disconnect", reason, description);
          this._clearAcks();
        }
        /**
         * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
         * the server.
         *
         * @private
         */
        _clearAcks() {
          Object.keys(this.acks).forEach((id) => {
            const isBuffered = this.sendBuffer.some((packet) => String(packet.id) === id);
            if (!isBuffered) {
              const ack = this.acks[id];
              delete this.acks[id];
              if (ack.withError) {
                ack.call(this, new Error("socket has been disconnected"));
              }
            }
          });
        }
        /**
         * Called with socket packet.
         *
         * @param packet
         * @private
         */
        onpacket(packet) {
          const sameNamespace = packet.nsp === this.nsp;
          if (!sameNamespace)
            return;
          switch (packet.type) {
            case PacketType.CONNECT:
              if (packet.data && packet.data.sid) {
                this.onconnect(packet.data.sid, packet.data.pid);
              } else {
                this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
              }
              break;
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
              this.onevent(packet);
              break;
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
              this.onack(packet);
              break;
            case PacketType.DISCONNECT:
              this.ondisconnect();
              break;
            case PacketType.CONNECT_ERROR:
              this.destroy();
              const err = new Error(packet.data.message);
              err.data = packet.data.data;
              this.emitReserved("connect_error", err);
              break;
          }
        }
        /**
         * Called upon a server event.
         *
         * @param packet
         * @private
         */
        onevent(packet) {
          const args = packet.data || [];
          if (null != packet.id) {
            args.push(this.ack(packet.id));
          }
          if (this.connected) {
            this.emitEvent(args);
          } else {
            this.receiveBuffer.push(Object.freeze(args));
          }
        }
        emitEvent(args) {
          if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
              listener.apply(this, args);
            }
          }
          super.emit.apply(this, args);
          if (this._pid && args.length && typeof args[args.length - 1] === "string") {
            this._lastOffset = args[args.length - 1];
          }
        }
        /**
         * Produces an ack callback to emit with an event.
         *
         * @private
         */
        ack(id) {
          const self2 = this;
          let sent = false;
          return function(...args) {
            if (sent)
              return;
            sent = true;
            self2.packet({
              type: PacketType.ACK,
              id,
              data: args
            });
          };
        }
        /**
         * Called upon a server acknowledgement.
         *
         * @param packet
         * @private
         */
        onack(packet) {
          const ack = this.acks[packet.id];
          if (typeof ack !== "function") {
            return;
          }
          delete this.acks[packet.id];
          if (ack.withError) {
            packet.data.unshift(null);
          }
          ack.apply(this, packet.data);
        }
        /**
         * Called upon server connect.
         *
         * @private
         */
        onconnect(id, pid) {
          this.id = id;
          this.recovered = pid && this._pid === pid;
          this._pid = pid;
          this.connected = true;
          this.emitBuffered();
          this.emitReserved("connect");
          this._drainQueue(true);
        }
        /**
         * Emit buffered events (received and emitted).
         *
         * @private
         */
        emitBuffered() {
          this.receiveBuffer.forEach((args) => this.emitEvent(args));
          this.receiveBuffer = [];
          this.sendBuffer.forEach((packet) => {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
          });
          this.sendBuffer = [];
        }
        /**
         * Called upon server disconnect.
         *
         * @private
         */
        ondisconnect() {
          this.destroy();
          this.onclose("io server disconnect");
        }
        /**
         * Called upon forced client/server side disconnections,
         * this method ensures the manager stops tracking us and
         * that reconnections don't get triggered for this.
         *
         * @private
         */
        destroy() {
          if (this.subs) {
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs = void 0;
          }
          this.io["_destroy"](this);
        }
        /**
         * Disconnects the socket manually. In that case, the socket will not try to reconnect.
         *
         * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
         *
         * @example
         * const socket = io();
         *
         * socket.on("disconnect", (reason) => {
         *   // console.log(reason); prints "io client disconnect"
         * });
         *
         * socket.disconnect();
         *
         * @return self
         */
        disconnect() {
          if (this.connected) {
            this.packet({ type: PacketType.DISCONNECT });
          }
          this.destroy();
          if (this.connected) {
            this.onclose("io client disconnect");
          }
          return this;
        }
        /**
         * Alias for {@link disconnect()}.
         *
         * @return self
         */
        close() {
          return this.disconnect();
        }
        /**
         * Sets the compress flag.
         *
         * @example
         * socket.compress(false).emit("hello");
         *
         * @param compress - if `true`, compresses the sending data
         * @return self
         */
        compress(compress) {
          this.flags.compress = compress;
          return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
         * ready to send messages.
         *
         * @example
         * socket.volatile.emit("hello"); // the server may or may not receive it
         *
         * @returns self
         */
        get volatile() {
          this.flags.volatile = true;
          return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
         * given number of milliseconds have elapsed without an acknowledgement from the server:
         *
         * @example
         * socket.timeout(5000).emit("my-event", (err) => {
         *   if (err) {
         *     // the server did not acknowledge the event in the given delay
         *   }
         * });
         *
         * @returns self
         */
        timeout(timeout) {
          this.flags.timeout = timeout;
          return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @example
         * socket.onAny((event, ...args) => {
         *   console.log(`got ${event}`);
         * });
         *
         * @param listener
         */
        onAny(listener) {
          this._anyListeners = this._anyListeners || [];
          this._anyListeners.push(listener);
          return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @example
         * socket.prependAny((event, ...args) => {
         *   console.log(`got event ${event}`);
         * });
         *
         * @param listener
         */
        prependAny(listener) {
          this._anyListeners = this._anyListeners || [];
          this._anyListeners.unshift(listener);
          return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`got event ${event}`);
         * }
         *
         * socket.onAny(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAny(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAny();
         *
         * @param listener
         */
        offAny(listener) {
          if (!this._anyListeners) {
            return this;
          }
          if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
              if (listener === listeners[i]) {
                listeners.splice(i, 1);
                return this;
              }
            }
          } else {
            this._anyListeners = [];
          }
          return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAny() {
          return this._anyListeners || [];
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.onAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        onAnyOutgoing(listener) {
          this._anyOutgoingListeners = this._anyOutgoingListeners || [];
          this._anyOutgoingListeners.push(listener);
          return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.prependAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        prependAnyOutgoing(listener) {
          this._anyOutgoingListeners = this._anyOutgoingListeners || [];
          this._anyOutgoingListeners.unshift(listener);
          return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`sent event ${event}`);
         * }
         *
         * socket.onAnyOutgoing(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAnyOutgoing(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAnyOutgoing();
         *
         * @param [listener] - the catch-all listener (optional)
         */
        offAnyOutgoing(listener) {
          if (!this._anyOutgoingListeners) {
            return this;
          }
          if (listener) {
            const listeners = this._anyOutgoingListeners;
            for (let i = 0; i < listeners.length; i++) {
              if (listener === listeners[i]) {
                listeners.splice(i, 1);
                return this;
              }
            }
          } else {
            this._anyOutgoingListeners = [];
          }
          return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAnyOutgoing() {
          return this._anyOutgoingListeners || [];
        }
        /**
         * Notify the listeners for each packet sent
         *
         * @param packet
         *
         * @private
         */
        notifyOutgoingListeners(packet) {
          if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const listeners = this._anyOutgoingListeners.slice();
            for (const listener of listeners) {
              listener.apply(this, packet.data);
            }
          }
        }
      };
    }
  });

  // ../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/contrib/backo2.js
  function Backoff(opts) {
    opts = opts || {};
    this.ms = opts.min || 100;
    this.max = opts.max || 1e4;
    this.factor = opts.factor || 2;
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
    this.attempts = 0;
  }
  var init_backo2 = __esm({
    "../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/contrib/backo2.js"() {
      Backoff.prototype.duration = function() {
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
          var rand = Math.random();
          var deviation = Math.floor(rand * this.jitter * ms);
          ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
      };
      Backoff.prototype.reset = function() {
        this.attempts = 0;
      };
      Backoff.prototype.setMin = function(min) {
        this.ms = min;
      };
      Backoff.prototype.setMax = function(max) {
        this.max = max;
      };
      Backoff.prototype.setJitter = function(jitter) {
        this.jitter = jitter;
      };
    }
  });

  // ../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/manager.js
  var Manager;
  var init_manager = __esm({
    "../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/manager.js"() {
      init_esm3();
      init_socket2();
      init_esm4();
      init_on();
      init_backo2();
      init_esm2();
      Manager = class extends Emitter {
        constructor(uri, opts) {
          var _a;
          super();
          this.nsps = {};
          this.subs = [];
          if (uri && "object" === typeof uri) {
            opts = uri;
            uri = void 0;
          }
          opts = opts || {};
          opts.path = opts.path || "/socket.io";
          this.opts = opts;
          installTimerFunctions(this, opts);
          this.reconnection(opts.reconnection !== false);
          this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
          this.reconnectionDelay(opts.reconnectionDelay || 1e3);
          this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
          this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
          this.backoff = new Backoff({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor()
          });
          this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
          this._readyState = "closed";
          this.uri = uri;
          const _parser = opts.parser || esm_exports;
          this.encoder = new _parser.Encoder();
          this.decoder = new _parser.Decoder();
          this._autoConnect = opts.autoConnect !== false;
          if (this._autoConnect)
            this.open();
        }
        reconnection(v) {
          if (!arguments.length)
            return this._reconnection;
          this._reconnection = !!v;
          if (!v) {
            this.skipReconnect = true;
          }
          return this;
        }
        reconnectionAttempts(v) {
          if (v === void 0)
            return this._reconnectionAttempts;
          this._reconnectionAttempts = v;
          return this;
        }
        reconnectionDelay(v) {
          var _a;
          if (v === void 0)
            return this._reconnectionDelay;
          this._reconnectionDelay = v;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
          return this;
        }
        randomizationFactor(v) {
          var _a;
          if (v === void 0)
            return this._randomizationFactor;
          this._randomizationFactor = v;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
          return this;
        }
        reconnectionDelayMax(v) {
          var _a;
          if (v === void 0)
            return this._reconnectionDelayMax;
          this._reconnectionDelayMax = v;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
          return this;
        }
        timeout(v) {
          if (!arguments.length)
            return this._timeout;
          this._timeout = v;
          return this;
        }
        /**
         * Starts trying to reconnect if reconnection is enabled and we have not
         * started reconnecting yet
         *
         * @private
         */
        maybeReconnectOnOpen() {
          if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
            this.reconnect();
          }
        }
        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} fn - optional, callback
         * @return self
         * @public
         */
        open(fn) {
          if (~this._readyState.indexOf("open"))
            return this;
          this.engine = new Socket(this.uri, this.opts);
          const socket = this.engine;
          const self2 = this;
          this._readyState = "opening";
          this.skipReconnect = false;
          const openSubDestroy = on(socket, "open", function() {
            self2.onopen();
            fn && fn();
          });
          const onError = (err) => {
            this.cleanup();
            this._readyState = "closed";
            this.emitReserved("error", err);
            if (fn) {
              fn(err);
            } else {
              this.maybeReconnectOnOpen();
            }
          };
          const errorSub = on(socket, "error", onError);
          if (false !== this._timeout) {
            const timeout = this._timeout;
            const timer = this.setTimeoutFn(() => {
              openSubDestroy();
              onError(new Error("timeout"));
              socket.close();
            }, timeout);
            if (this.opts.autoUnref) {
              timer.unref();
            }
            this.subs.push(() => {
              this.clearTimeoutFn(timer);
            });
          }
          this.subs.push(openSubDestroy);
          this.subs.push(errorSub);
          return this;
        }
        /**
         * Alias for open()
         *
         * @return self
         * @public
         */
        connect(fn) {
          return this.open(fn);
        }
        /**
         * Called upon transport open.
         *
         * @private
         */
        onopen() {
          this.cleanup();
          this._readyState = "open";
          this.emitReserved("open");
          const socket = this.engine;
          this.subs.push(
            on(socket, "ping", this.onping.bind(this)),
            on(socket, "data", this.ondata.bind(this)),
            on(socket, "error", this.onerror.bind(this)),
            on(socket, "close", this.onclose.bind(this)),
            // @ts-ignore
            on(this.decoder, "decoded", this.ondecoded.bind(this))
          );
        }
        /**
         * Called upon a ping.
         *
         * @private
         */
        onping() {
          this.emitReserved("ping");
        }
        /**
         * Called with data.
         *
         * @private
         */
        ondata(data) {
          try {
            this.decoder.add(data);
          } catch (e) {
            this.onclose("parse error", e);
          }
        }
        /**
         * Called when parser fully decodes a packet.
         *
         * @private
         */
        ondecoded(packet) {
          nextTick(() => {
            this.emitReserved("packet", packet);
          }, this.setTimeoutFn);
        }
        /**
         * Called upon socket error.
         *
         * @private
         */
        onerror(err) {
          this.emitReserved("error", err);
        }
        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         * @public
         */
        socket(nsp, opts) {
          let socket = this.nsps[nsp];
          if (!socket) {
            socket = new Socket2(this, nsp, opts);
            this.nsps[nsp] = socket;
          } else if (this._autoConnect && !socket.active) {
            socket.connect();
          }
          return socket;
        }
        /**
         * Called upon a socket close.
         *
         * @param socket
         * @private
         */
        _destroy(socket) {
          const nsps = Object.keys(this.nsps);
          for (const nsp of nsps) {
            const socket2 = this.nsps[nsp];
            if (socket2.active) {
              return;
            }
          }
          this._close();
        }
        /**
         * Writes a packet.
         *
         * @param packet
         * @private
         */
        _packet(packet) {
          const encodedPackets = this.encoder.encode(packet);
          for (let i = 0; i < encodedPackets.length; i++) {
            this.engine.write(encodedPackets[i], packet.options);
          }
        }
        /**
         * Clean up transport subscriptions and packet buffer.
         *
         * @private
         */
        cleanup() {
          this.subs.forEach((subDestroy) => subDestroy());
          this.subs.length = 0;
          this.decoder.destroy();
        }
        /**
         * Close the current socket.
         *
         * @private
         */
        _close() {
          this.skipReconnect = true;
          this._reconnecting = false;
          this.onclose("forced close");
        }
        /**
         * Alias for close()
         *
         * @private
         */
        disconnect() {
          return this._close();
        }
        /**
         * Called when:
         *
         * - the low-level engine is closed
         * - the parser encountered a badly formatted packet
         * - all sockets are disconnected
         *
         * @private
         */
        onclose(reason, description) {
          var _a;
          this.cleanup();
          (_a = this.engine) === null || _a === void 0 ? void 0 : _a.close();
          this.backoff.reset();
          this._readyState = "closed";
          this.emitReserved("close", reason, description);
          if (this._reconnection && !this.skipReconnect) {
            this.reconnect();
          }
        }
        /**
         * Attempt a reconnection.
         *
         * @private
         */
        reconnect() {
          if (this._reconnecting || this.skipReconnect)
            return this;
          const self2 = this;
          if (this.backoff.attempts >= this._reconnectionAttempts) {
            this.backoff.reset();
            this.emitReserved("reconnect_failed");
            this._reconnecting = false;
          } else {
            const delay = this.backoff.duration();
            this._reconnecting = true;
            const timer = this.setTimeoutFn(() => {
              if (self2.skipReconnect)
                return;
              this.emitReserved("reconnect_attempt", self2.backoff.attempts);
              if (self2.skipReconnect)
                return;
              self2.open((err) => {
                if (err) {
                  self2._reconnecting = false;
                  self2.reconnect();
                  this.emitReserved("reconnect_error", err);
                } else {
                  self2.onreconnect();
                }
              });
            }, delay);
            if (this.opts.autoUnref) {
              timer.unref();
            }
            this.subs.push(() => {
              this.clearTimeoutFn(timer);
            });
          }
        }
        /**
         * Called upon successful reconnect.
         *
         * @private
         */
        onreconnect() {
          const attempt = this.backoff.attempts;
          this._reconnecting = false;
          this.backoff.reset();
          this.emitReserved("reconnect", attempt);
        }
      };
    }
  });

  // ../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/index.js
  var esm_exports2 = {};
  __export(esm_exports2, {
    Fetch: () => Fetch,
    Manager: () => Manager,
    NodeWebSocket: () => WS,
    NodeXHR: () => XHR,
    Socket: () => Socket2,
    WebSocket: () => WS,
    WebTransport: () => WT,
    XHR: () => XHR,
    connect: () => lookup2,
    default: () => lookup2,
    io: () => lookup2,
    protocol: () => protocol3
  });
  function lookup2(uri, opts) {
    if (typeof uri === "object") {
      opts = uri;
      uri = void 0;
    }
    opts = opts || {};
    const parsed = url(uri, opts.path || "/socket.io");
    const source = parsed.source;
    const id = parsed.id;
    const path = parsed.path;
    const sameNamespace = cache[id] && path in cache[id]["nsps"];
    const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
    let io;
    if (newConnection) {
      io = new Manager(source, opts);
    } else {
      if (!cache[id]) {
        cache[id] = new Manager(source, opts);
      }
      io = cache[id];
    }
    if (parsed.query && !opts.query) {
      opts.query = parsed.queryKey;
    }
    return io.socket(parsed.path, opts);
  }
  var cache;
  var init_esm5 = __esm({
    "../../node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/index.js"() {
      init_url();
      init_manager();
      init_socket2();
      init_esm4();
      init_esm3();
      cache = {};
      Object.assign(lookup2, {
        Manager,
        Socket: Socket2,
        io: lookup2,
        connect: lookup2
      });
    }
  });

  // ../../node_modules/.pnpm/jwt-decode@4.0.0/node_modules/jwt-decode/build/esm/index.js
  var InvalidTokenError = class extends Error {
  };
  InvalidTokenError.prototype.name = "InvalidTokenError";
  function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
      let code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = "0" + code;
      }
      return "%" + code;
    }));
  }
  function base64UrlDecode(str) {
    let output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw new Error("base64 string is not of the correct length");
    }
    try {
      return b64DecodeUnicode(output);
    } catch (err) {
      return atob(output);
    }
  }
  function jwtDecode(token, options) {
    if (typeof token !== "string") {
      throw new InvalidTokenError("Invalid token specified: must be a string");
    }
    options || (options = {});
    const pos = options.header === true ? 0 : 1;
    const part = token.split(".")[pos];
    if (typeof part !== "string") {
      throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
    }
    let decoded;
    try {
      decoded = base64UrlDecode(part);
    } catch (e) {
      throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
    }
    try {
      return JSON.parse(decoded);
    } catch (e) {
      throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
    }
  }

  // src/utils/urlParams.ts
  function parseUrlParams(params, options = {}) {
    const {
      arrayFormat = "repeat",
      // Changed default to repeat for backend compatibility
      objectFormat = "bracket",
      // Changed default to bracket for API compatibility
      encode: encode2 = true
      // Changed default to true as requested
    } = options;
    const result = [];
    const encodeValue = (value2) => {
      return encode2 ? encodeURIComponent(value2) : value2;
    };
    const processValue = (key, value2) => {
      if (value2 === null || value2 === void 0) {
        return;
      }
      if (Array.isArray(value2)) {
        if (arrayFormat === "comma") {
          result.push([key, encodeValue(value2.join(","))]);
        } else if (arrayFormat === "brackets") {
          const bracketKey = `${key}[]`;
          value2.forEach((item) => {
            result.push([bracketKey, encodeValue(String(item))]);
          });
        } else if (arrayFormat === "repeat") {
          value2.forEach((item) => {
            result.push([key, encodeValue(String(item))]);
          });
        }
      } else if (value2 instanceof Date) {
        result.push([key, encodeValue(value2.toString())]);
      } else if (typeof value2 === "object") {
        if (objectFormat === "json") {
          result.push([key, encodeValue(JSON.stringify(value2))]);
        } else if (objectFormat === "dot") {
          flattenObject(value2, key, result, encodeValue);
        } else if (objectFormat === "bracket") {
          flattenObjectBracket(value2, key, result, encodeValue);
        }
      } else if (typeof value2 === "boolean") {
        result.push([key, encodeValue(value2.toString())]);
      } else if (typeof value2 === "number") {
        result.push([key, encodeValue(value2.toString())]);
      } else if (typeof value2 === "string") {
        result.push([key, encodeValue(value2)]);
      } else {
        result.push([key, encodeValue(String(value2))]);
      }
    };
    Object.entries(params).forEach(([key, value2]) => {
      processValue(key, value2);
    });
    return result;
  }
  function flattenObject(obj, prefix, result, encodeValue) {
    Object.entries(obj).forEach(([key, value2]) => {
      const newKey = `${prefix}.${key}`;
      if (value2 === null || value2 === void 0) {
        return;
      }
      if (typeof value2 === "object" && !Array.isArray(value2)) {
        flattenObject(value2, newKey, result, encodeValue);
      } else if (Array.isArray(value2)) {
        result.push([newKey, encodeValue(value2.join(","))]);
      } else {
        result.push([newKey, encodeValue(String(value2))]);
      }
    });
  }
  function flattenObjectBracket(obj, prefix, result, encodeValue) {
    Object.entries(obj).forEach(([key, value2]) => {
      const newKey = `${prefix}[${key}]`;
      if (value2 === null || value2 === void 0) {
        return;
      }
      if (typeof value2 === "object" && !Array.isArray(value2)) {
        flattenObjectBracket(value2, newKey, result, encodeValue);
      } else if (Array.isArray(value2)) {
        result.push([newKey, encodeValue(value2.join(","))]);
      } else {
        result.push([newKey, encodeValue(String(value2))]);
      }
    });
  }
  function createUrlSearchParams(params) {
    const searchParams = new URLSearchParams();
    params.forEach(([key, value2]) => {
      searchParams.append(key, value2);
    });
    return searchParams;
  }
  function paramsToUrlSearchParams(params, options) {
    const parsedParams = parseUrlParams(params, { ...options, encode: false });
    return createUrlSearchParams(parsedParams);
  }

  // src/routes/auth.ts
  function createAuthMethods(client) {
    return {
      /**
       * Registers a new user.
       * @param userData - User registration data.
       * @returns {Promise<object>} Object containing user info and tokens.
       */
      async register(userData) {
        const result = await client._request({
          endpoint: "/v1/auth/register",
          method: "POST",
          body: userData,
          sendJWT: false
        });
        if (result && result.tokens && result.tokens.access && result.tokens.refresh) {
          client._setTokens(
            result.tokens.access.token,
            result.tokens.refresh.token,
            result.tokens.access.expires,
            result.tokens.refresh.expires
          );
        } else {
          console.warn("Register response did not contain expected tokens.");
        }
        return result;
      },
      /**
       * Logs in a user.
       * @param credentials - Login credentials.
       * @returns {Promise<object>} Object containing user info and tokens (or MFA challenge token).
       */
      async login(credentials) {
        const result = await client._request({
          endpoint: "/v1/auth/login",
          method: "POST",
          body: credentials,
          sendJWT: false
        });
        if (result && "tokens" in result && result.tokens && result.tokens.access && result.tokens.refresh) {
          client._setTokens(
            result.tokens.access.token,
            result.tokens.refresh.token,
            result.tokens.access.expires,
            result.tokens.refresh.expires
          );
        } else if (result && "tokens" in result && result.tokens && result.tokens.verifyMfa) {
          client._setTokens(null, null);
          client._setVerifyMfaToken(result.tokens.verifyMfa.token);
        } else {
          console.warn(
            "Login response did not contain expected tokens or MFA challenge."
          );
          client._setTokens(null, null);
        }
        return result;
      },
      /**
       * Logs out a user.
       * @param refreshToken - The refresh token to invalidate.
       * @returns {Promise<void>}
       */
      async logout(refreshToken) {
        const tokenToInvalidate = refreshToken || client._getRefreshToken();
        if (tokenToInvalidate) {
          try {
            await client._request({
              endpoint: "/v1/auth/logout",
              method: "POST",
              body: { refreshToken: tokenToInvalidate },
              sendJWT: false
              // Logout might not need JWT, depends on API
            });
          } catch (error) {
            console.warn("Logout API call failed, but clearing local tokens:", error);
          }
        }
        client._setTokens(null, null);
      },
      /**
       * Refreshes user tokens.
       * @param refreshToken - The refresh token.
       * @returns {Promise<object>} Object containing new access and refresh tokens.
       */
      async refreshTokens(refreshToken) {
        const tokenToUse = refreshToken || client._getRefreshToken();
        if (!tokenToUse) {
          throw new Error(
            "No refresh token provided or found in client storage."
          );
        }
        const result = await client._request({
          endpoint: "/v1/auth/refresh-tokens",
          method: "POST",
          body: { refreshToken: tokenToUse },
          sendJWT: false,
          // Refresh endpoint uses the refresh token, not the access token
          _isInternalRefresh: true
          // Mark as internal to prevent recursive refresh loop if called by _request
        });
        if (result && result.access && result.refresh) {
          client._setTokens(
            result.access.token,
            result.refresh.token,
            result.access.expires,
            result.refresh.expires
          );
        } else {
          console.warn("Refresh response did not contain expected tokens.");
          client._setTokens(null, null);
        }
        return result;
      },
      /**
       * Forgets a user's password.
       * @param email - The user's email address.
       * @returns {Promise<void>}
       */
      async forgotPassword(email) {
        await client._request({
          // Specify void return type
          endpoint: "/v1/auth/forgot-password",
          method: "POST",
          body: { email },
          sendJWT: false
          // Usually doesn't require JWT
        });
      },
      /**
       * Resets a user's password.
       * @param params - Input parameters.
       * @param params.token - The password reset token.
       * @param params.password - The new password.
       * @returns Promise resolving when complete.
       */
      async resetPassword({ token, password }) {
        await client._request({
          // Specify void return type
          endpoint: "/v1/auth/reset-password",
          method: "POST",
          body: { token, password },
          sendJWT: false
          // Token is the authentication here
        });
      },
      /**
       * Sends a verification email to the authenticated user.
       * @returns Promise resolving when complete.
       */
      async sendVerificationEmail() {
        await client._request({
          // Specify void return type
          endpoint: "/v1/auth/send-verification-email",
          method: "POST",
          sendJWT: true
        });
      },
      /**
       * Public, unauthenticated resend of the verification email keyed by
       * address. For users past the verification grace window who can't log
       * in or call the authed sendVerificationEmail. Always resolves (the
       * server returns 204 regardless of whether the email exists).
       * @param email - The email address to resend the verification link to.
       */
      async resendVerification(email) {
        await client._request({
          endpoint: "/v1/auth/resend-verification",
          method: "POST",
          body: { email },
          sendJWT: false
        });
      },
      /**
       * Verifies a user's email using the provided token.
       * @param token - The email verification token.
       * @returns Promise resolving when complete.
       */
      async verifyEmail(token) {
        await client._request({
          // Specify void return type
          endpoint: `/v1/auth/verify-email?token=${encodeURIComponent(token)}`,
          method: "POST",
          sendJWT: false
          // Token is the authentication here
        });
      },
      /**
       * Enables multi-factor authentication for the authenticated user.
       * @returns Promise resolving to MFA setup details (secret, OTP URL, backup codes).
       */
      async enableMfa() {
        return client._request({
          endpoint: "/v1/auth/enable-mfa",
          method: "POST",
          sendJWT: true
        });
      },
      /**
       * Verifies an MFA token (e.g., TOTP code).
       * This is used both during initial MFA setup and during login challenges.
       * @param mfaToken - The MFA token code.
       * @returns Promise resolving to user/token data upon successful verification.
       */
      async verifyMfa(mfaToken) {
        const verifyMfaToken = client._getVerifyMfaToken();
        const requestOptions = {
          endpoint: "/v1/auth/verify-mfa",
          method: "POST",
          body: { mfaToken }
        };
        if (verifyMfaToken) {
          requestOptions.sendJWT = false;
          requestOptions.customHeaders = {
            "Authorization": `Bearer ${verifyMfaToken}`
          };
        } else {
          requestOptions.sendJWT = true;
        }
        const result = await client._request(requestOptions);
        if (result && result.tokens?.access) {
          client._setTokens(
            result.tokens.access.token,
            result.tokens.refresh.token,
            result.tokens.access.expires,
            result.tokens.refresh.expires
          );
          client._setVerifyMfaToken(null);
        }
        return result;
      },
      /**
       * Verifies an MFA backup code.
       * This is used during login when a user has lost access to their authenticator app.
       * @param backupCode - The backup code (8-character hex string).
       * @returns Promise resolving to user/token data upon successful verification.
       */
      async verifyBackupCode(backupCode) {
        const verifyMfaToken = client._getVerifyMfaToken();
        const requestOptions = {
          endpoint: "/v1/auth/verify-backup-code",
          method: "POST",
          body: { backupCode }
        };
        if (verifyMfaToken) {
          requestOptions.sendJWT = false;
          requestOptions.customHeaders = {
            "Authorization": `Bearer ${verifyMfaToken}`
          };
        } else {
          requestOptions.sendJWT = true;
        }
        const result = await client._request(requestOptions);
        if (result && result.tokens?.access) {
          client._setTokens(
            result.tokens.access.token,
            result.tokens.refresh.token,
            result.tokens.access.expires,
            result.tokens.refresh.expires
          );
          client._setVerifyMfaToken(null);
        }
        return result;
      },
      /**
       * Disables multi-factor authentication for the authenticated user.
       * Requires a current valid MFA token for confirmation.
       * @param mfaToken - The current MFA token code.
       * @returns Promise resolving when complete.
       */
      async disableMfa(mfaToken) {
        await client._request({
          // Specify void return type
          endpoint: "/v1/auth/disable-mfa",
          method: "POST",
          body: { mfaToken },
          // Use interface for body
          sendJWT: true
        });
      },
      /**
       * Changes the authenticated user's password.
       * Requires current password verification and MFA token if MFA is enabled.
       * All refresh tokens will be invalidated after password change.
       * @param currentPassword - The current password for verification.
       * @param newPassword - The new password.
       * @param mfaToken - MFA token (required if MFA is enabled).
       * @returns Promise resolving when complete.
       */
      async changePassword(currentPassword, newPassword, mfaToken) {
        await client._request({
          endpoint: "/v1/auth/change-password",
          method: "POST",
          body: { currentPassword, newPassword, mfaToken },
          sendJWT: true
        });
        client._setTokens(null, null);
      },
      /**
       * Locks a user account using a lock account token.
       * This is used when a user receives a password changed notification
       * for a change they did not initiate, allowing them to immediately
       * secure their account.
       * @param token - The lock account token from the password changed email.
       * @returns Promise resolving when the account is locked.
       */
      async lockAccount(token) {
        await client._request({
          endpoint: "/v1/auth/lock-account",
          method: "POST",
          body: { token },
          sendJWT: false
          // Token is the authentication here
        });
        client._setTokens(null, null);
      },
      /**
       * Sets a password for an OAuth-only user account.
       * This allows OAuth users to add local authentication as a backup.
       * @param password - The password to set.
       * @param mfaToken - MFA token (required if MFA is enabled).
       * @returns Promise resolving when complete.
       */
      async setPassword(password, mfaToken) {
        await client._request({
          endpoint: "/v1/auth/set-password",
          method: "POST",
          body: { password, mfaToken },
          sendJWT: true
        });
      },
      /**
       * Links an OAuth provider to the authenticated user's account.
       * This allows users to sign in with multiple OAuth providers.
       * @param provider - The OAuth provider to link (google, apple, microsoft, adobe).
       * @returns Promise resolving to user data with updated linked providers.
       */
      async linkOAuthProvider(provider) {
        const result = await client._request({
          endpoint: `/v1/auth/${provider}/link`,
          method: "POST",
          sendJWT: true
        });
        return result;
      },
      /**
       * Unlinks an OAuth provider from the authenticated user's account.
       * User must have at least one authentication method remaining (password or another OAuth provider).
       * @param provider - The OAuth provider to unlink (google, apple, microsoft, adobe).
       * @returns Promise resolving when complete.
       */
      async unlinkOAuthProvider(provider) {
        await client._request({
          endpoint: `/v1/auth/oauth/${provider}/unlink`,
          method: "DELETE",
          sendJWT: true
        });
      },
      /**
       * Gets all OAuth providers linked to the authenticated user's account.
       * @returns Promise resolving to array of linked OAuth providers.
       */
      async getLinkedOAuthProviders() {
        return client._request({
          endpoint: "/v1/auth/oauth/providers",
          method: "GET",
          sendJWT: true
        });
      },
      /**
       * Exchanges an OAuth authorization code for JWT tokens.
       * This is called after the OAuth callback redirects the user back to the app with an exchange code.
       * The exchange code is a short-lived (5 min), single-use token that can be traded for JWT tokens.
       * @param code - The exchange code received from the OAuth callback.
       * @returns Promise resolving to user data, tokens, and optional return URL.
       */
      /**
       * Registers a guest account for public chat participation.
       * Always returns void (204) regardless of outcome for anti-enumeration.
       * @param data - Guest registration data (email, displayName, optional approved color, publicToken).
       */
      async registerGuest(data) {
        await client._request({
          endpoint: "/v1/auth/register-guest",
          method: "POST",
          body: data,
          sendJWT: false
        });
      },
      /**
       * Verifies a guest account using the token from the verification email.
       * Stores auth tokens on success and returns user data.
       * @param token - The guest verification token.
       * @returns Promise resolving to user data and auth tokens.
       */
      async verifyGuest(token) {
        const result = await client._request({
          endpoint: `/v1/auth/verify-guest?token=${encodeURIComponent(token)}`,
          method: "POST",
          sendJWT: false
        });
        if (result?.tokens?.access && result?.tokens?.refresh) {
          client._setTokens(
            result.tokens.access.token,
            result.tokens.refresh.token,
            result.tokens.access.expires,
            result.tokens.refresh.expires
          );
        }
        return result;
      },
      /**
       * Upgrades a guest account to a standard account with a password.
       * Requires the user to be authenticated as a guest.
       * @param data - Upgrade data (password, optional firstName, lastName, company, userName).
       * @returns Promise resolving to the upgraded user data.
       */
      async upgradeGuest(data) {
        return client._request({
          endpoint: "/v1/auth/upgrade-guest",
          method: "POST",
          body: data,
          sendJWT: true
        });
      },
      async exchangeOAuthCode(code) {
        const result = await client._request({
          endpoint: "/v1/auth/oauth/exchange",
          method: "POST",
          body: { code },
          sendJWT: false
          // No authentication needed - the code is the proof
        });
        if (result && result.tokens) {
          if (result.tokens.access && result.tokens.refresh) {
            client._setTokens(
              result.tokens.access.token,
              result.tokens.refresh.token,
              result.tokens.access.expires,
              result.tokens.refresh.expires
            );
          } else if (result.tokens.verifyMfa) {
            console.log("[SDK] OAuth login requires MFA verification");
          } else {
            console.warn("OAuth exchange response did not contain expected tokens.");
          }
        }
        return result;
      }
    };
  }

  // src/routes/subscription.ts
  function createSubscriptionMethods(client) {
    return {
      /**
           * Retrieves the active subscription for a specific workspace.
           * Requires authentication and permission.
           * @param {string} workspaceId - The ID of the workspace.
           * @returns {Promise<Subscription>} The workspace subscription object.
           */
      async getWorkspaceSubscription(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/subscriptions/workspace/${workspaceId}`,
          sendJWT: true
        });
      },
      /**
           * Cancels the subscription for a specific workspace.
           * Requires authentication and permission.
           * @param {string} workspaceId - The ID of the workspace.
           * @returns {Promise<any>} The cancellation response.
           */
      async cancelWorkspaceSubscription(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/subscriptions/workspace/${workspaceId}`,
          sendJWT: true
        });
      },
      /**
       * Reverse a scheduled (period-end) cancellation, keeping the workspace's
       * subscription on its normal renewal cycle. Only valid while the
       * subscription is still active with a pending cancellation; a fully
       * lapsed subscription can't be resumed (the owner must re-subscribe).
       * Requires authentication and permission.
       * @param {string} workspaceId - The ID of the workspace.
       * @returns {Promise<any>} The resume response.
       */
      async resumeWorkspaceSubscription(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/subscriptions/workspace/${workspaceId}/resume`,
          sendJWT: true
        });
      },
      /**
       * Swap the workspace's active basePlan line for a different basePlan product.
       * Same code path both upgrades and downgrades; the API's pre-flight
       * capacity check is what distinguishes a permitted change from a refused
       * one. Pass `dryRun: true` to get the pre-flight verdict without mutating.
       *
       * On over-allocation the API returns 400 `planCapacityInsufficient` with
       * `errorData.violations: [{ resource, current, newLimit }]`, surfaced via
       * the SDK's normal error path.
       *
       * On success, returns the updated subscription plus a `warnings[]` array
       * of feature-gate capabilities the destination plan does NOT include (the
       * FE renders these as a confirmation notice).
       */
      async swapWorkspacePlan(workspaceId, params) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!params.newProductId) throw new Error("newProductId is required.");
        if (!params.currency) throw new Error("currency is required.");
        if (!params.billingPeriod) throw new Error("billingPeriod is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/subscriptions/workspace/${workspaceId}/plan`,
          body: params,
          sendJWT: true
        });
      },
      /**
           * Retrieves subscription orders for a specific workspace.
           * Requires authentication and permission.
           * @param {string} workspaceId - The ID of the workspace.
           * @param {GetSubscriptionOrdersParams} [params] - Optional query parameters.
           * @returns {Promise<any[]>} An array of subscription order objects.
           */
      async getWorkspaceOrders(workspaceId, params) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/subscriptions/workspace/${workspaceId}/orders`,
          params,
          sendJWT: true
        });
      },
      /**
           * Creates a subscription order for a specific workspace.
           * Requires authentication and permission.
           * @param {string} workspaceId - The ID of the workspace.
           * @param {CreateWorkspaceOrderParams} orderData - The order data.
           * @returns {Promise<any>} The created order response.
           */
      async createWorkspaceOrder(workspaceId, orderData) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!orderData.productId) throw new Error("productId is required.");
        if (typeof orderData.quantity !== "number") throw new Error("quantity is required and must be a number.");
        return client._request({
          method: "POST",
          endpoint: `/v1/subscriptions/workspace/${workspaceId}/order`,
          body: orderData,
          sendJWT: true
        });
      },
      /**
           * Retrieves all subscriptions owned by the currently authenticated user.
           * Requires authentication.
           * @param {GetSubscriptionsParams} [params] - Optional query parameters for status and sorting.
           * @returns {Promise<Subscription[]>} An array of subscription objects.
           */
      async getUserSubscriptions(params) {
        return client._request({
          method: "GET",
          endpoint: "/v1/subscriptions/",
          params,
          sendJWT: true
        });
      },
      /**
           * Retrieves the resource limits (e.g., storage, seats) for a specific resource (typically workspace).
           * Requires authentication.
           * @param {string} resourceId - The ID of the resource (e.g., workspaceId).
           * @returns {Promise<ResourceLimits>} An object containing the resource limits.
           */
      async getResourceLimits(resourceId) {
        if (!resourceId) throw new Error("resourceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/subscriptions/limits/${resourceId}`,
          // Assuming resourceId here is workspaceId
          sendJWT: true
        });
      },
      /**
           * Retrieves the seat usage for a specific resource (typically workspace).
           * Requires authentication.
           * @param {string} resourceId - The ID of the resource (e.g., workspaceId).
           * @returns {Promise<SeatUsage>} An object containing seat usage details.
           */
      async getSeatUsage(resourceId) {
        if (!resourceId) throw new Error("resourceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/subscriptions/usage/seats/${resourceId}`,
          // Assuming resourceId here is workspaceId
          sendJWT: true
        });
      },
      /**
           * Retrieves per-role (creator / reviewer) seat usage and caps for a
           * workspace. `limit` is `null` when the plan is unlimited for that
           * seat type. Requires authentication.
           * @param {string} resourceId - The workspace ID.
           * @returns {Promise<RoleUsage>} Creator- and reviewer-side seat usage.
           */
      async getRoleUsage(resourceId) {
        if (!resourceId) throw new Error("resourceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/subscriptions/usage/roles/${resourceId}`,
          sendJWT: true
        });
      },
      /**
           * Retrieves the storage usage for a specific resource (typically workspace).
           * Requires authentication.
           * @param {string} resourceId - The ID of the resource (e.g., workspaceId).
           * @returns {Promise<StorageUsage>} An object containing storage usage details.
           */
      async getStorageUsage(resourceId) {
        if (!resourceId) throw new Error("resourceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/subscriptions/usage/storage/${resourceId}`,
          // Assuming resourceId here is workspaceId
          sendJWT: true
        });
      },
      /**
           * Retrieves the workspace usage summary (billable seats and storage used).
           * Requires authentication and subscription management permission.
           * @param {string} workspaceId - The ID of the workspace.
           * @returns {Promise<{billableSeatCount: number; storageUsedInBytes: number}>} Usage summary.
           */
      async getWorkspaceUsageSummary(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/subscriptions/workspace/${workspaceId}/usage-summary`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/user.ts
  function createUserMethods(client) {
    return {
      /**
       * Retrieves the public profile of a specific user.
       * Requires authentication.
       * @param {string} userId - The ID of the user to retrieve.
       * @returns {Promise<object>} Public user object.
       */
      async getUser(userId) {
        if (!userId) {
          throw new Error("userId is required.");
        }
        return client._request({
          method: "GET",
          endpoint: `/v1/users/${userId}`,
          sendJWT: true
        });
      },
      /**
       * Retrieves the current user's profile.
       * Requires authentication.
       * @returns {Promise<PublicUser>} The current user's profile.
       * @throws {Error} If no user ID is found in the token.
       */
      async getSelf() {
        return client._request({
          method: "GET",
          endpoint: "/v1/users",
          sendJWT: true
        });
      },
      /**
       * Deletes the current user.
       * Requires authentication.
       * @returns {Promise<void>}
       */
      async deleteCurrentUser() {
        return client._request({
          method: "DELETE",
          endpoint: "/v1/users",
          sendJWT: true
        });
      },
      /**
       * Updates the user's avatar.
       * @param {object} fileData - File metadata (e.g., { name, checksum, sizeInMB }).
       * @returns {Promise<object>} Object containing signed URL data and updated user info.
       */
      async updateAvatar(fileData) {
        return client._request({
          method: "PUT",
          endpoint: "/v1/users/avatar",
          body: fileData,
          sendJWT: true
        });
      },
      /**
       * Creates a new avatar for the user.
       * @param {object} fileData - File metadata (e.g., { name, checksum, sizeInMB }).
       * @returns {Promise<object>} Object containing signed URL data and updated user info.
       */
      async createAvatar(fileData) {
        return client._request({
          method: "POST",
          endpoint: "/v1/users/avatar",
          body: fileData,
          sendJWT: true
        });
      },
      /**
       * Updates the user's preferences.
       * @param {object} preferenceData - Preference data to update (e.g., { hide: ['feedHint'] }).
       * @returns {Promise<object>} Updated user object.
       */
      async updatePreferences(preferenceData) {
        return client._request({
          method: "PATCH",
          endpoint: "/v1/users/preferences",
          body: preferenceData,
          sendJWT: true
        });
      },
      /**
       * Record that the current user has seen a one-time UI element (welcome
       * video, tutorial coachmark). Idempotent. Returns the updated user.
       * @param {string} element - one-time element key (see backend oneTimeElements).
       */
      async markSeen(element) {
        return client._request({
          method: "POST",
          endpoint: "/v1/users/has-seen",
          body: { element },
          sendJWT: true
        });
      },
      /**
       * Remove one-time UI elements from the current user's `hasSeen` so they
       * display again. Pass specific element keys, or omit to clear ALL.
       * Returns the updated user.
       * @param {string[]} [elements] - elements to remove; omit to clear all.
       */
      async unmarkSeen(elements) {
        return client._request({
          method: "DELETE",
          endpoint: "/v1/users/has-seen",
          body: elements ? { elements } : {},
          sendJWT: true
        });
      },
      /**
       * Updates the logged-in user's profile.
       * Requires authentication.
       * At least one field must be provided.
       * @param {UpdateUserData} updateData - The user data fields to update.
       * @returns {Promise<User>} The updated user object.
       */
      async updateSelf(updateData) {
        if (Object.keys(updateData).length === 0) {
          throw new Error("At least one field must be provided to update the user.");
        }
        return client._request({
          method: "PATCH",
          endpoint: "/v1/users",
          // Endpoint for updating the logged-in user
          body: updateData,
          sendJWT: true
        });
      },
      /**
       * Get the current user's active site-level Todos for the onboarding
       * drawer. Returns only todos whose completion condition isn't met and
       * (for dismissibles) that the user hasn't opted out of. Server
       * computes from live state — no caching on the server side, so a
       * fresh call always reflects ground truth.
       */
      async getTodos() {
        return client._request({
          method: "GET",
          endpoint: "/v1/users/todos",
          sendJWT: true
        });
      }
    };
  }

  // src/routes/workspace.ts
  function createWorkspaceMethods(client) {
    return {
      /**
       * Creates a new workspace.
       * Requires authentication.
       * @param data - Workspace data.
       * @returns {Promise<object>} The created workspace object.
       */
      async createWorkspace(data) {
        return client._request({
          endpoint: "/v1/workspaces",
          method: "POST",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Retrieves a specific workspace by its ID.
       * Requires authentication.
       * @param {string} workspaceId - The ID of the workspace to retrieve.
       * @returns {Promise<object>} The workspace object.
       */
      async getWorkspace(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          endpoint: `/v1/workspaces/${workspaceId}`,
          method: "GET",
          sendJWT: true
        });
      },
      /**
       * Lists all workspaces the authenticated user has access to.
       * Requires authentication.
       * @param {object} [sortParams] - Optional sorting. Keys are field names (`id`, `name`, `createdAt`, `updatedAt`);
       *   values are 1 for ascending or -1 for descending. Sent as `?sort[name]=1&sort[createdAt]=-1`.
       * @returns {Promise<Array<object>>} Workspaces with the caller's `roles` and the workspace `capabilities`.
       */
      async listWorkspaces(sortParams = {}) {
        return client._request({
          endpoint: "/v1/workspaces",
          method: "GET",
          params: Object.keys(sortParams).length > 0 ? { sort: sortParams } : void 0,
          sendJWT: true
        });
      },
      /**
       * Request signed URL data to upload a workspace logo.
       * Caller then multipart-uploads the file using the returned `signedUrlData`
       * and calls `client.asset.completeUpload(...)` to finalize.
       *
       * @param {string} fileData.checksum - The MD5 checksum.
       * @param {number} fileData.sizeInMB - The file size in MB.
       * @returns {Promise<object>} Response containing signed URL data and workspace info.
       */
      async createLogo(workspaceId, fileData) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          endpoint: `/v1/workspaces/${workspaceId}/logo`,
          method: "POST",
          body: fileData,
          sendJWT: true
        });
      },
      /**
       * Request signed URL data to replace the workspace logo. Same upload
       * shape as `createLogo`; existing logo is replaced once `completeUpload`
       * lands.
       *
       * @param {string} fileData.checksum - The MD5 checksum.
       * @param {number} fileData.sizeInMB - The file size in MB.
       * @returns {Promise<object>} Response containing signed URL data and workspace info.
       */
      async updateLogo(workspaceId, fileData) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          endpoint: `/v1/workspaces/${workspaceId}/logo`,
          method: "PUT",
          body: fileData,
          sendJWT: true
        });
      },
      /**
       * Request signed URL data to upload a workspace icon (the small square
       * shown in sidebars and tabs — distinct from the logo).
       *
       * @param {string} fileData.checksum - The MD5 checksum.
       * @param {number} fileData.sizeInMB - The file size in MB.
       * @returns {Promise<object>} Response containing signed URL data and workspace info.
       */
      async createIcon(workspaceId, fileData) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          endpoint: `/v1/workspaces/${workspaceId}/icon`,
          method: "POST",
          body: fileData,
          sendJWT: true
        });
      },
      /**
       * Request signed URL data to replace the workspace icon. Same upload
       * shape as `createIcon`.
       *
       * @param {string} fileData.checksum - The MD5 checksum.
       * @param {number} fileData.sizeInMB - The file size in MB.
       * @returns {Promise<object>} Response containing signed URL data and workspace info.
       */
      async updateIcon(workspaceId, fileData) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          endpoint: `/v1/workspaces/${workspaceId}/icon`,
          method: "PUT",
          body: fileData,
          sendJWT: true
        });
      },
      /**
       * List the projects inside a workspace that the calling user has
       * access to.
       *
       * @param {string} workspaceId - The ID of the workspace.
       * @returns {Promise<Array<object>>} An array of project objects.
       */
      async listProjects(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          endpoint: `/v1/workspaces/${workspaceId}/projects`,
          method: "GET",
          sendJWT: true
        });
      },
      /**
       * Update workspace metadata (name, description, etc.).
       *
       * @param {boolean} [updateData.updateSlug] - Whether to update the slug based on the new name.
       * @returns {Promise<object>} The updated workspace object.
       */
      async updateWorkspace(workspaceId, updateData) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          endpoint: `/v1/workspaces/${workspaceId}`,
          method: "PUT",
          body: updateData,
          sendJWT: true
        });
      },
      /**
       * Soft-delete a workspace. All nested resources (projects, chats,
       * assets) become inaccessible; bytes are reclaimed by the cleanup
       * cron.
       *
       * @param {string} workspaceId - The ID of the workspace to delete.
       * @returns {Promise<object>} Object confirming the status change.
       */
      async deleteWorkspace(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          endpoint: `/v1/workspaces/${workspaceId}`,
          method: "DELETE",
          sendJWT: true
        });
      },
      /**
       * Toggle a single workspace boolean setting (e.g. an `enableX` feature
       * flag).
       *
       * @param {string} workspaceId - The ID of the workspace.
       * @param {string} settingName - The name of the setting.
       * @param {boolean} value - The new value for the setting.
       * @returns {Promise<object>} The updated workspace object with new settings.
       */
      async updateSetting(workspaceId, settingName, value2) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!settingName) throw new Error("settingName is required.");
        return client._request({
          endpoint: `/v1/workspaces/${workspaceId}/settings/${settingName}`,
          method: "PUT",
          body: { value: value2 },
          sendJWT: true
        });
      }
    };
  }

  // src/routes/project.ts
  function createProjectMethods(client) {
    return {
      /**
       * Creates a new project.
       * @param {CreateProjectData} projectData - Data for the new project.
       * @returns {Promise<ProjectResponse>} The created project object.
       */
      async createProject(projectData) {
        return client._request({
          method: "POST",
          endpoint: "/v1/projects",
          body: projectData,
          sendJWT: true
        });
      },
      /**
       * Retrieves projects accessible by the user.
       * NOTE: API endpoint `/v1/projects` does not currently support pagination.
       * @returns {Promise<ProjectResponse[]>} List of project objects.
       */
      async getProjects() {
        return client._request({
          method: "GET",
          endpoint: "/v1/projects",
          sendJWT: true
        });
      },
      /**
       * Retrieves a specific project by its ID.
       * @param {string} projectId - The ID of the project.
       * @returns {Promise<ProjectResponse>} The project object.
       */
      async getProject(projectId) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}`,
          sendJWT: true
        });
      },
      /**
       * Updates a project.
       * @param {string} projectId - The ID of the project to update.
       * @param {UpdateProjectData} updateData - Data to update.
       * @returns {Promise<ProjectResponse>} The updated project object.
       */
      async updateProject(projectId, updateData) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}`,
          body: updateData,
          sendJWT: true
        });
      },
      /**
       * Updates a single project setting (e.g. `aiPolishEnabled`,
       * `aiCustomPreprompt`). Pass `null` to inherit the workspace's value;
       * pass a typed value to override. The valid setting names are validated
       * server-side against `projectService.validProjectSettings`.
       *
       * @param {string} projectId
       * @param {string} name - Setting key (e.g. 'aiPolishEnabled').
       * @param {unknown} value - null (inherit) | boolean | string.
       */
      async updateSetting(projectId, name, value2) {
        if (!projectId) throw new Error("projectId is required.");
        if (!name) throw new Error("name is required.");
        return client._request({
          method: "PATCH",
          endpoint: `/v1/projects/${projectId}/settings/${encodeURIComponent(name)}`,
          body: { value: value2 },
          sendJWT: true
        });
      },
      /**
       * Full-text search across assets, chat messages, and tasks within a project.
       * Results are populated per the content type's native list view (asset →
       * creator/publisher/tags; chatMessage → author/mentions/attachments; task →
       * creator/assignee/project/origin).
       *
       * @param {string} projectId
       * @param {SearchProjectParams} params - At minimum `q`. Optional filters: `contentTypes`, `dateFrom`, `dateTo`, `creatorId`, `sortBy`, `page`, `limit`.
       * @returns {Promise<SearchResponse>} Paginated search results.
       */
      async searchProject(projectId, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!params || !params.q) throw new Error("params.q is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/search`,
          params,
          sendJWT: true
        });
      },
      /**
       * Deletes a project (marks for deletion).
       * @param {string} projectId - The ID of the project to delete.
       * @returns {Promise<PublicFileSystemResponse>} The deleted public release record.
       */
      async deleteProject(projectId) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/projects/${projectId}`,
          sendJWT: true
        });
      },
      /**
       * Creates a new logo asset for a project.
       * @param {string} projectId - The ID of the project.
       * @param {LogoUploadData} logoData - File metadata for the logo.
       * @returns {Promise<any>} Object containing signed URL data and updated project info.
       */
      async createLogo(projectId, logoData) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/logo`,
          body: logoData,
          sendJWT: true
        });
      },
      /**
       * Updates the logo asset for a project.
       * @param {string} projectId - The ID of the project.
       * @param {LogoUploadData} logoData - File metadata for the new logo.
       * @returns {Promise<any>} Object containing signed URL data and updated project info.
       */
      async updateLogo(projectId, logoData) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/logo`,
          body: logoData,
          sendJWT: true
        });
      },
      /**
       * Create assets within a project and return their signed links for upload.
       * @param {string} projectId - The ID of the project.
       * @param {ProjectFileUploadBody} fileUploadBody - List of files to upload with optional destination path.
       * @returns {Promise<any[]>} Array of results, each containing asset info and signed URL data.
       */
      async createAssets(projectId, fileUploadBody) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}`,
          body: fileUploadBody,
          sendJWT: true
        });
      },
      // --- Asset Listing ---
      /**
       * Gets the home feed for a project with a specified visibility.
       * @param {string} projectId - The ID of the project.
       * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
       * @param {ListFeedParams} [params] - Query parameters for filtering and pagination.
       * @returns {Promise<PaginatedResponse<AssetResponse>>} Paginated feed items.
       */
      async getHomeFeed(projectId, visibility, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/feed/${visibility}`,
          params,
          sendJWT: true
        });
      },
      // --- Event Feed ---
      /**
       * Gets one page of the project's event feed (uploads, asset discussions,
       * publishes, submissions and public releases), most recent activity first.
       * The creator and reviewer feeds never share events.
       * @param {string} projectId - The ID of the project.
       * @param {'creator' | 'reviewer'} visibility - Which feed to read.
       * @param {ListFeedEventsParams} [params] - Filters and cursor.
       * @returns {Promise<CursorPaginatedFeedEvents>} One page of feed events.
       */
      async getFeedEvents(projectId, visibility, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/feed-events/${visibility}`,
          params,
          sendJWT: true
        });
      },
      /**
       * Sets your reaction on a feed event. One per person — a new emoji
       * replaces your previous one.
       * @returns {Promise<FeedEvent>} The updated event.
       */
      async setFeedEventReaction(projectId, visibility, eventId, emoji) {
        if (!projectId || !visibility || !eventId) throw new Error("projectId, visibility and eventId are required.");
        if (!emoji) throw new Error("emoji is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/feed-events/${visibility}/${eventId}/reaction`,
          body: { emoji },
          sendJWT: true
        });
      },
      /**
       * Removes your reaction from a feed event.
       * @returns {Promise<FeedEvent>} The updated event.
       */
      async removeFeedEventReaction(projectId, visibility, eventId) {
        if (!projectId || !visibility || !eventId) throw new Error("projectId, visibility and eventId are required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/projects/${projectId}/feed-events/${visibility}/${eventId}/reaction`,
          sendJWT: true
        });
      },
      // --- Folder Listing ---
      /**
       * Gets folders within a project with specified visibility.
       * @param {string} projectId - The ID of the project.
       * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
       * @param {ListFoldersParams} [params] - Query parameters for filtering and pagination.
       * @returns {Promise<PaginatedResponse<FolderResponse>>} Paginated list of folders.
       */
      async getFolders(projectId, visibility, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        const fileSystemParams = {
          ...params,
          resourceType: "folder",
          mediaTypes: ["folder"]
        };
        return this.getItemsAtPath(projectId, visibility, "", fileSystemParams);
      },
      // --- Chat ---
      /**
       * Gets the project chat with the specified visibility.
       * @param {string} projectId - The ID of the project.
       * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
       * @param {GetChatParams} [params] - Query parameters for message/reply limits.
       * @returns {Promise<ChatResponse>} The chat object.
       */
      async getProjectChat(projectId, visibility, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/chat/${visibility}`,
          params,
          sendJWT: true
        });
      },
      // --- Submissions ---
      /**
       * Creates a new submission for a project.
       * @param {string} projectId - The ID of the project.
       * @param {CreateSubmissionData} submissionData - Data for the submission.
       * @returns {Promise<SubmissionResponse>} The created submission object.
       */
      async createSubmission(projectId, submissionData) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/submission`,
          body: submissionData,
          sendJWT: true
        });
      },
      /**
       * Adds items to an existing submission.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {AddItemsToSubmissionData} addItemsData - Data for adding items to the submission.
       * @returns {Promise<SubmissionResponse>} The updated submission object.
       */
      async addItemsToSubmission(projectId, submissionId, addItemsData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}/add`,
          body: addItemsData,
          sendJWT: true
        });
      },
      /**
       * Retrieves submissions for a project.
       * @param {string} projectId - The ID of the project.
       * @param {ListSubmissionsParams} [params] - Query parameters for filtering and pagination.
       * @returns {Promise<PaginatedResponse<SubmissionResponse>>} Paginated list of submissions.
       */
      async getSubmissions(projectId, params) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/submission`,
          params,
          sendJWT: true
        });
      },
      /**
       * Retrieves a specific submission by its ID.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {GetSubmissionParams} [params] - Query parameters for chat message/reply options.
       * @returns {Promise<SubmissionResponse>} The submission object.
       */
      async getSubmission(projectId, submissionId, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}`,
          params,
          sendJWT: true
        });
      },
      /**
       * Updates a submission.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {UpdateSubmissionData} updateData - Data to update.
       * @returns {Promise<SubmissionResponse>} The updated submission object.
       */
      async updateSubmission(projectId, submissionId, updateData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}`,
          body: updateData,
          sendJWT: true
        });
      },
      /**
       * Releases a staged (unreleased) submission, making it visible to reviewers
       * and firing the deferred "new submission" side effects (emails,
       * notifications, system messages).
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @returns {Promise<SubmissionResponse>} The released submission object.
       */
      async releaseSubmission(projectId, submissionId) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}/release`,
          sendJWT: true
        });
      },
      /**
       * Re-releases an already-released submission's side effects (the "Release
       * Update" action) — re-notifies reviewers with the submission-update email
       * template + `submissionUpdate` notification. Does not change status.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @returns {Promise<SubmissionResponse>} The submission object.
       */
      async releaseSubmissionUpdate(projectId, submissionId) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}/release-update`,
          sendJWT: true
        });
      },
      /**
       * Gets files for a specific submission.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {string} [path] - The path to get items from (optional, defaults to root).
       * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
       * @returns {Promise<PaginatedResponse<any>>} Paginated list of files.
       */
      async getSubmissionItems(projectId, submissionId, path, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        let endpoint = `/v1/projects/${projectId}/submission/${submissionId}/files`;
        if (path && typeof path === "string" && path.trim() !== "") {
          endpoint += `/${encodeURIComponent(path)}`;
        }
        return client._request({
          method: "GET",
          endpoint,
          params,
          sendJWT: true
        });
      },
      /**
       * Creates a folder within a submission.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {CreateSubmissionFolderData} folderData - Data for creating the folder.
       * @returns {Promise<FolderResponse>} The created folder object.
       */
      async createSubmissionFolder(projectId, submissionId, folderData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/create-folder`,
          body: folderData,
          sendJWT: true
        });
      },
      /**
       * Moves items within a submission.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {MoveSubmissionItemsData} moveData - Data for moving items.
       * @returns {Promise<{count: number}>} Object containing the count of moved items.
       */
      async moveSubmissionItems(projectId, submissionId, moveData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/move`,
          body: moveData,
          sendJWT: true
        });
      },
      /**
       * Copies items within a submission.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {CopySubmissionItemsData} copyData - Data for copying items.
       * @returns {Promise<{count: number}>} Object containing the count of copied items.
       */
      async copySubmissionItems(projectId, submissionId, copyData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/copy`,
          body: copyData,
          sendJWT: true
        });
      },
      /**
       * Deletes items within a submission.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {DeleteSubmissionItemsData} deleteData - Data for deleting items.
       * @returns {Promise<{count: number}>} Object containing the count of deleted items.
       */
      async deleteSubmissionItems(projectId, submissionId, deleteData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/delete`,
          body: deleteData,
          sendJWT: true
        });
      },
      /**
       * Adds a tag to a submission.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {TagSubmissionData} tagData - Data for tagging the submission.
       * @returns {Promise<SubmissionResponse>} The updated submission object.
       */
      async tagSubmission(projectId, submissionId, tagData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}/tag`,
          body: tagData,
          sendJWT: true
        });
      },
      /**
       * Removes a tag from a submission.
       * @param {string} projectId - The ID of the project.
       * @param {string} submissionId - The ID of the submission.
       * @param {TagSubmissionData} tagData - Data for untagging the submission.
       * @returns {Promise<SubmissionResponse>} The updated submission object.
       */
      async untagSubmission(projectId, submissionId, tagData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!submissionId) throw new Error("submissionId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/submission/${submissionId}/untag`,
          body: tagData,
          sendJWT: true
        });
      },
      // --- Publishing / File System Functions ---
      /**
       * Publishes a list of items (assets, folders) within a project.
       * @param {string} projectId - The ID of the project.
       * @param {PublishItemsData} publishData - Data for publishing items.
       * @returns {Promise<any>} Object containing lists of published items and results.
       */
      async publishItems(projectId, publishData) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/publish`,
          body: publishData,
          sendJWT: true
        });
      },
      /**
       * Unpublishes a list of items (assets, folders) within a project.
       * @param {string} projectId - The ID of the project.
       * @param {UnpublishItemsData} unpublishData - Data for unpublishing items.
       * @returns {Promise<any>} Object containing lists of unpublished items and results.
       */
      async unpublishItems(projectId, unpublishData) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/unpublish`,
          body: unpublishData,
          sendJWT: true
        });
      },
      /**
       * Creates a folder within a project with file system integration.
       * @param {string} projectId - The ID of the project.
       * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
       * @param {CreateFolderData} folderData - Data for creating the folder.
       * @returns {Promise<FolderResponse>} The created folder object.
       */
      async createFolder(projectId, visibility, folderData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/files/${visibility}/create-folder`,
          body: folderData,
          sendJWT: true
        });
      },
      /**
       * Gets items at a specific path within a project.
       * @param {string} projectId - The ID of the project.
       * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
       * @param {string} [path] - The path to get items from (optional, defaults to root).
       * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
       * @param {boolean} [usePost] - Whether to use POST method (useful for large resourceIds arrays).
       * @returns {Promise<PaginatedResponse<any>>} Paginated list of items at the path.
       */
      async getItemsAtPath(projectId, visibility, path, params, usePost = false) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        let endpoint = `/v1/projects/${projectId}/files/${visibility}`;
        if (path && path.trim() !== "") {
          endpoint += `/${encodeURIComponent(path)}`;
        }
        const method = usePost ? "POST" : "GET";
        return client._request({
          method,
          endpoint,
          params: method === "GET" ? params : void 0,
          body: method === "POST" ? params : void 0,
          sendJWT: true
        });
      },
      /**
       * Moves items to a specific path within a project.
       * @param {string} projectId - The ID of the project.
       * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
       * @param {MoveItemsData} moveData - Data for moving items.
       * @returns {Promise<{count: number}>} Object containing the count of moved items.
       */
      async moveItemsToPath(projectId, visibility, moveData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/files/${visibility}/move`,
          body: moveData,
          sendJWT: true
        });
      },
      /**
       * Copies items to a specific path within a project.
       * @param {string} projectId - The ID of the project.
       * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
       * @param {CopyItemsData} copyData - Data for copying items.
       * @returns {Promise<{count: number}>} Object containing the count of copied items.
       */
      async copyItemsToPath(projectId, visibility, copyData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/files/${visibility}/copy`,
          body: copyData,
          sendJWT: true
        });
      },
      /**
       * Deletes items at a specific path within a project.
       * @param {string} projectId - The ID of the project.
       * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
       * @param {DeleteItemsData} deleteData - Data for deleting items.
       * @returns {Promise<{count: number}>} Object containing the count of deleted items.
       */
      async deleteItemsAtPath(projectId, visibility, deleteData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/files/${visibility}/delete`,
          body: deleteData,
          sendJWT: true
        });
      },
      /**
       * Asks what deleting these paths would reach, without deleting anything.
       *
       * Computed from the same cascade the delete runs, so the answer is what
       * will happen rather than an estimate of it. Only SECONDARY references
       * come back — the reviewer, submission and public-release copies that
       * would go with the selection.
       *
       * @param {string} projectId
       * @param {'creator'|'reviewer'} visibility
       * @param {DeleteItemsData} deleteData - The same body the delete takes.
       * @returns {Promise<DeleteImpact>}
       */
      async previewDeleteItemsAtPath(projectId, visibility, deleteData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required (creator or reviewer).");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/files/${visibility}/delete-preview`,
          body: deleteData,
          sendJWT: true
        });
      },
      // --- Public File System Methods ---
      /**
       * Gets all public file systems for a project.
       * @param {string} projectId - The ID of the project.
       * @param {ListPublicFileSystemsParams} [params] - Query parameters (pagination, sort, search, status, creatorId).
       * @returns {Promise<PaginatedResponse<PublicFileSystemResponse>>} Paginated list of public file systems.
       */
      async getPublicFileSystems(projectId, params) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/public`,
          params,
          sendJWT: true
        });
      },
      /**
       * Get the public audit for a project — assets that are or have been publicly exposed.
       *
       * @requires `projectAdmin` or `projectOwner` on the project (or workspace-tier admin via inheritance).
       * @param {string} projectId
       * @param {Object} [params]
       * @param {boolean} [params.currentlyPublic=false] - When true, only assets currently public.
       * @param {number} [params.page]
       * @param {number} [params.limit]
       */
      async getPublicAudit(projectId, params) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/public-audit`,
          params,
          sendJWT: true
        });
      },
      /**
       * Creates a public file system with a secure token for sharing project assets publicly.
       * @param {string} projectId - The ID of the project.
       * @param {CreatePublicFileSystemData} publicFileSystemData - Data for creating the public file system.
       * @returns {Promise<PublicFileSystemResponse>} The created public file system object.
       */
      async createPublicFileSystem(projectId, publicFileSystemData) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/public`,
          body: publicFileSystemData,
          sendJWT: true
        });
      },
      /**
       * Updates an existing public file system's title and description.
       * @param {string} projectId - The ID of the project.
       * @param {string} publicId - The ID of the public file system.
       * @param {UpdatePublicFileSystemData} updateData - Data to update.
       * @returns {Promise<PublicFileSystemResponse>} The updated public file system object.
       */
      async updatePublicFileSystem(projectId, publicId, updateData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!publicId) throw new Error("publicId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/public/${publicId}`,
          body: updateData,
          sendJWT: true
        });
      },
      /**
       * Releases a staged (unreleased) public file system, making it externally
       * accessible via its public token.
       * @param {string} projectId - The ID of the project.
       * @param {string} publicId - The ID of the public file system.
       * @returns {Promise<PublicFileSystemResponse>} The released public file system object.
       */
      async releasePublicFileSystem(projectId, publicId) {
        if (!projectId) throw new Error("projectId is required.");
        if (!publicId) throw new Error("publicId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/public/${publicId}/release`,
          sendJWT: true
        });
      },
      /**
       * Retrieves a specific public file system by its ID.
       * @param {string} projectId - The ID of the project.
       * @param {string} publicId - The ID of the public file system.
       * @returns {Promise<PublicFileSystemResponse>} The public file system object.
       */
      async getPublicFileSystem(projectId, publicId) {
        if (!projectId) throw new Error("projectId is required.");
        if (!publicId) throw new Error("publicId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/public/${publicId}`,
          sendJWT: true
        });
      },
      /**
       * Deletes a public file system and invalidates its access token.
       * @param {string} projectId - The ID of the project.
       * @param {string} publicId - The ID of the public file system.
       * @returns {Promise<PublicFileSystemResponse>} The deleted public release record.
       */
      async deletePublicFileSystem(projectId, publicId) {
        if (!projectId) throw new Error("projectId is required.");
        if (!publicId) throw new Error("publicId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/projects/${projectId}/public/${publicId}`,
          sendJWT: true
        });
      },
      /**
       * Adds additional items to an existing public file system.
       * @param {string} projectId - The ID of the project.
       * @param {string} publicId - The ID of the public file system.
       * @param {AddItemsToPublicFileSystemData} addItemsData - Data for adding items.
       * @returns {Promise<PublicFileSystemResponse>} The updated public file system object.
       */
      async addItemsToPublicFileSystem(projectId, publicId, addItemsData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!publicId) throw new Error("publicId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/public/${publicId}/add`,
          body: addItemsData,
          sendJWT: true
        });
      },
      /**
       * Gets items from a public file system at a specific path (authenticated management).
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {string} [path] - The path to get items from (optional, defaults to root).
       * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
       * @returns {Promise<PaginatedResponse<any>>} Paginated list of public file system items.
       */
      async getPublicItemsAtPath(projectId, token, path, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        let endpoint = `/v1/projects/${projectId}/public/${token}/files`;
        if (path && path.trim() !== "") {
          endpoint += `/${encodeURIComponent(path)}`;
        }
        return client._request({
          method: "GET",
          endpoint,
          params,
          sendJWT: true
        });
      },
      /**
       * Moves items within a public file system (authenticated management).
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {MovePublicItemsData} moveData - Data for moving items.
       * @returns {Promise<{count: number}>} Object containing the count of moved items.
       */
      async movePublicItemsAtPath(projectId, token, moveData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/public/${token}/files/move`,
          body: moveData,
          sendJWT: true
        });
      },
      /**
       * Copies items within a public file system (authenticated management).
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {CopyPublicItemsData} copyData - Data for copying items.
       * @returns {Promise<{count: number}>} Object containing the count of copied items.
       */
      async copyPublicItemsAtPath(projectId, token, copyData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/public/${token}/files/copy`,
          body: copyData,
          sendJWT: true
        });
      },
      /**
       * Deletes items from a public file system (authenticated management).
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {DeletePublicItemsData} deleteData - Data for deleting items.
       * @returns {Promise<{count: number}>} Object containing the count of deleted items.
       */
      async deletePublicItemsAtPath(projectId, token, deleteData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/projects/${projectId}/public/${token}/files/delete`,
          body: deleteData,
          sendJWT: true
        });
      },
      /**
       * Creates a folder inside a public file system (authenticated management).
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {CreateFolderData} folderData - Data for creating the folder (name, color, basePath).
       * @returns {Promise<FolderResponse>} The created folder object.
       */
      async createPublicFolder(projectId, token, folderData) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/public/${token}/files/create-folder`,
          body: folderData,
          sendJWT: true
        });
      },
      /**
       * Gets a public chat from an authenticated project context.
       * Unlike the public endpoint, this does NOT check token expiration.
       * Use this for internal management of public file systems.
       *
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @returns {Promise<any>} The public chat or null if none exists.
       */
      async getProjectPublicChat(projectId, token) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/public/${token}/chat`,
          sendJWT: true
        });
      },
      /**
       * Gets a public asset with its public chat from an authenticated project context.
       * Unlike the public endpoint, this does NOT check token expiration.
       * Use this for internal management of public file systems.
       *
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {string} assetId - The ID of the asset to retrieve.
       * @returns {Promise<PublicAssetResponse>} The asset with its public chat.
       */
      async getProjectPublicAsset(projectId, token, assetId) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/public/${token}/assets/${assetId}`,
          sendJWT: true
        });
      },
      /**
       * Gets messages from a public chat from an authenticated project context.
       * Unlike the public endpoint, this does NOT check token expiration.
       * Use this for internal management of public file systems.
       *
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {string} chatId - The ID of the chat.
       * @param {GetPublicChatMessagesParams} [params] - Query parameters for pagination.
       * @returns {Promise<PublicChatMessagesResponse>} Paginated list of chat messages.
       */
      async getProjectPublicChatMessages(projectId, token, chatId, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/public/${token}/chat/${chatId}/messages`,
          params,
          sendJWT: true
        });
      },
      /**
       * Creates a message in an existing public chat from an authenticated project context.
       * Unlike the public endpoint, this does NOT check token expiration.
       *
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {string} chatId - The ID of the chat.
       * @param {CreatePublicChatMessageRequest} data - Message data.
       * @returns {Promise<ChatMessage>} The created message.
       */
      async createProjectPublicChatMessage(projectId, token, chatId, data) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/public/${token}/chat/${chatId}/messages`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Creates a message on the main public topic chat from an authenticated project context.
       * Creates the chat lazily if it doesn't exist yet.
       * Unlike the public endpoint, this does NOT check token expiration.
       *
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {CreatePublicChatMessageRequest} data - Message data.
       * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
       */
      async createProjectPublicTopicChatMessage(projectId, token, data) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/public/${token}/chat/messages`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Creates a message on an asset's public chat from an authenticated project context.
       * Creates the chat lazily if it doesn't exist yet.
       * Unlike the public endpoint, this does NOT check token expiration.
       *
       * @param {string} projectId - The ID of the project.
       * @param {string} token - The public access token.
       * @param {string} assetId - The ID of the asset.
       * @param {CreatePublicChatMessageRequest} data - Message data.
       * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
       */
      async createProjectPublicAssetChatMessage(projectId, token, assetId, data) {
        if (!projectId) throw new Error("projectId is required.");
        if (!token) throw new Error("token is required.");
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/projects/${projectId}/public/${token}/assets/${assetId}/messages`,
          body: data,
          sendJWT: true
        });
      },
      // --- Highlighted Messages ---
      /**
       * Lists a project's assets for one visibility tier.
       * `creator` requires `canGetCreatorAssets`; `reviewer` requires `canGetReviewerAssets`.
       * @param {string} projectId - The project ID.
       * @param {'creator'|'reviewer'} visibility - Which tier's assets to list.
       * @param {ListAssetsParams} [params] - Filters and pagination. See ListAssetsParams.
       * @returns {Promise<PaginatedResponse<AssetResponse>>} Paginated assets.
       * @throws {Error} 'projectId is required.' or 'visibility is required.'.
       */
      async getAssets(projectId, visibility, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/assets/${visibility}`,
          params,
          sendJWT: true
        });
      },
      /**
       * Lists highlighted chat messages across a project for one visibility tier (cursor pagination only).
       * `creator` requires `canGetCreatorHighlights`; `reviewer` requires `canGetReviewerHighlights`.
       * @param {string} projectId - The project ID.
       * @param {'creator'|'reviewer'} visibility - Which tier's highlights to list.
       * @param {GetHighlightedMessagesParams} [params] - Cursor pagination. See GetHighlightedMessagesParams.
       * @returns {Promise<PaginatedResponse<ChatMessage>>} Paginated highlighted messages.
       * @throws {Error} 'projectId is required.' or 'visibility is required.'.
       */
      async getHighlightedMessages(projectId, visibility, params) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/${visibility}/highlighted-messages`,
          params,
          sendJWT: true
        });
      },
      /**
       * Top-N assets in a project by access-activity event type (plays, downloads, embeds).
       * Requires project read access. Returns asset IDs and counts only; hydrate names and
       * thumbnails through the normal asset fetch path.
       * @param {string} projectId - The project ID.
       * @param {object} [params] - `range` ('7d' | '30d' | '90d'), `eventType`, `limit`.
       * @returns {Promise<ProjectTopAccessActivityResponse>} Ranked asset IDs with counts.
       * @throws {Error} 'projectId is required.' when `projectId` is falsy.
       */
      async getTopAccessActivity(projectId, params) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/access-activity/top-assets`,
          params,
          sendJWT: true
        });
      }
    };
  }

  // src/utils/uploadSessionManager.ts
  var UploadSessionManager = class _UploadSessionManager {
    constructor() {
      this.messageListeners = /* @__PURE__ */ new Map();
      this.STORAGE_PREFIX = "nurama_upload_session_";
      this.MESSAGE_CHANNEL = "nurama_upload_sync";
      this.initializeCrossTabSync();
    }
    static getInstance() {
      if (!_UploadSessionManager.instance) {
        _UploadSessionManager.instance = new _UploadSessionManager();
      }
      return _UploadSessionManager.instance;
    }
    /**
     * Initialize cross-tab synchronization using BroadcastChannel
     */
    initializeCrossTabSync() {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        try {
          this.broadcastChannel = new BroadcastChannel(this.MESSAGE_CHANNEL);
          this.broadcastChannel.addEventListener("message", this.handleCrossTabMessage.bind(this));
        } catch (error) {
          console.warn("[UploadSessionManager] BroadcastChannel not available:", error);
        }
      }
    }
    /**
     * Handle cross-tab messages
     */
    handleCrossTabMessage(event) {
      const message = event.data;
      if (message && message.type && message.projectId && message.sessionId) {
        this.messageListeners.forEach((listener) => {
          try {
            listener(message);
          } catch (error) {
            console.error("[UploadSessionManager] Error in message listener:", error);
          }
        });
      }
    }
    /**
     * Generate storage key for upload session
     */
    getStorageKey(projectId, sessionId) {
      return `${this.STORAGE_PREFIX}${projectId}_${sessionId}`;
    }
    /**
     * Create a new upload session
     */
    createSession(projectId, sessionId, uploadData) {
      const session = {
        sessionId,
        projectId,
        uploadId: uploadData.uploadId,
        key: uploadData.key,
        assetId: uploadData.assetId,
        progress: 0,
        partNumber: 1,
        totalParts: uploadData.totalParts,
        completedParts: [],
        fileName: uploadData.fileName,
        fileSize: uploadData.fileSize,
        timestamp: Date.now(),
        status: "uploading"
      };
      this.saveSession(session);
      this.broadcastMessage("upload_status_change", projectId, sessionId, session);
      return session;
    }
    /**
     * Update upload progress for a session
     */
    updateProgress(projectId, sessionId, progress) {
      const session = this.getSession(projectId, sessionId);
      if (!session) {
        console.warn(`[UploadSessionManager] Session not found: ${sessionId}`);
        return;
      }
      const updatedSession = {
        ...session,
        progress: progress.progress,
        partNumber: progress.partNumber,
        completedParts: progress.completedParts || session.completedParts,
        timestamp: Date.now()
      };
      this.saveSession(updatedSession);
      this.broadcastMessage("upload_progress_update", projectId, sessionId, {
        progress: progress.progress,
        partNumber: progress.partNumber,
        completedParts: progress.completedParts,
        timestamp: updatedSession.timestamp
      });
    }
    /**
     * Update upload status
     */
    updateStatus(projectId, sessionId, status, error) {
      const session = this.getSession(projectId, sessionId);
      if (!session) {
        console.warn(`[UploadSessionManager] Session not found: ${sessionId}`);
        return;
      }
      const updatedSession = {
        ...session,
        status,
        error,
        timestamp: Date.now()
      };
      this.saveSession(updatedSession);
      this.broadcastMessage("upload_status_change", projectId, sessionId, {
        status,
        error,
        timestamp: updatedSession.timestamp
      });
    }
    /**
     * Get upload session data
     */
    getSession(projectId, sessionId) {
      if (typeof window === "undefined") return null;
      try {
        const key = this.getStorageKey(projectId, sessionId);
        const data = localStorage.getItem(key);
        if (data) {
          const session = JSON.parse(data);
          if (session.projectId === projectId && session.sessionId === sessionId) {
            return session;
          }
        }
      } catch (error) {
        console.warn(`[UploadSessionManager] Failed to get session ${sessionId}:`, error);
      }
      return null;
    }
    /**
     * Get all upload sessions for a project
     */
    getProjectSessions(projectId) {
      if (typeof window === "undefined") return [];
      const sessions = [];
      const prefix = `${this.STORAGE_PREFIX}${projectId}_`;
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            const data = localStorage.getItem(key);
            if (data) {
              try {
                const session = JSON.parse(data);
                if (session.projectId === projectId) {
                  sessions.push(session);
                }
              } catch (error) {
                console.warn(`[UploadSessionManager] Invalid session data in ${key}:`, error);
              }
            }
          }
        }
      } catch (error) {
        console.warn("[UploadSessionManager] Failed to get project sessions:", error);
      }
      return sessions.sort((a, b) => b.timestamp - a.timestamp);
    }
    /**
     * Get every upload session across ALL projects (scans the whole localStorage
     * prefix, not a single project). Used by app-level guards that need a global
     * "is anything uploading right now" answer without knowing the project id.
     */
    getAllSessions() {
      if (typeof window === "undefined") return [];
      const sessions = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.STORAGE_PREFIX)) {
            const data = localStorage.getItem(key);
            if (data) {
              try {
                sessions.push(JSON.parse(data));
              } catch (error) {
                console.warn(`[UploadSessionManager] Invalid session data in ${key}:`, error);
              }
            }
          }
        }
      } catch (error) {
        console.warn("[UploadSessionManager] Failed to enumerate sessions:", error);
      }
      return sessions.sort((a, b) => b.timestamp - a.timestamp);
    }
    /**
     * True when at least one upload is genuinely in flight anywhere in the app.
     *
     * "In flight" = status `uploading`/`completing` AND updated within `staleMs`.
     * The freshness window matters: a tab that crashed mid-upload leaves an
     * `uploading` row in localStorage forever (it never reaches a terminal
     * status). Progress ticks bump `timestamp` on every part, so a real upload
     * stays fresh; a dead one goes stale and stops counting — otherwise a stale
     * row would block app refreshes/navigation indefinitely.
     *
     * @param staleMs How long since the last progress update still counts as
     *   active. Default 2 minutes — comfortably longer than a single part PUT on
     *   a slow connection, short enough that a crashed upload clears quickly.
     */
    hasActiveUploads(staleMs = 2 * 60 * 1e3) {
      const cutoff = Date.now() - staleMs;
      return this.getAllSessions().some(
        (s) => (s.status === "uploading" || s.status === "completing") && s.timestamp >= cutoff
      );
    }
    /**
     * Save session to localStorage
     */
    saveSession(session) {
      if (typeof window === "undefined") return;
      try {
        const key = this.getStorageKey(session.projectId, session.sessionId);
        localStorage.setItem(key, JSON.stringify(session));
      } catch (error) {
        console.warn(`[UploadSessionManager] Failed to save session ${session.sessionId}:`, error);
      }
    }
    /**
     * Remove upload session
     */
    removeSession(projectId, sessionId) {
      if (typeof window === "undefined") return;
      try {
        const key = this.getStorageKey(projectId, sessionId);
        localStorage.removeItem(key);
        this.broadcastMessage("upload_cleanup", projectId, sessionId);
      } catch (error) {
        console.warn(`[UploadSessionManager] Failed to remove session ${sessionId}:`, error);
      }
    }
    /**
     * Clean up old or completed sessions
     */
    cleanupSessions(projectId, olderThanMs = 24 * 60 * 60 * 1e3) {
      const sessions = this.getProjectSessions(projectId);
      const cutoff = Date.now() - olderThanMs;
      sessions.forEach((session) => {
        const shouldRemove = session.timestamp < cutoff || ["completed", "failed", "cancelled"].includes(session.status) && session.timestamp < Date.now() - 60 * 60 * 1e3;
        if (shouldRemove) {
          this.removeSession(projectId, session.sessionId);
        }
      });
    }
    /**
     * Register a listener for cross-tab messages
     */
    onMessage(listenerId, callback) {
      this.messageListeners.set(listenerId, callback);
    }
    /**
     * Unregister a message listener
     */
    offMessage(listenerId) {
      this.messageListeners.delete(listenerId);
    }
    /**
     * Broadcast a message to other tabs
     */
    broadcastMessage(type, projectId, sessionId, data) {
      if (this.broadcastChannel) {
        try {
          const message = {
            type,
            projectId,
            sessionId,
            data
          };
          this.broadcastChannel.postMessage(message);
        } catch (error) {
          console.warn("[UploadSessionManager] Failed to broadcast message:", error);
        }
      }
    }
    /**
     * Cleanup resources
     */
    destroy() {
      if (this.broadcastChannel) {
        this.broadcastChannel.close();
        this.broadcastChannel = void 0;
      }
      this.messageListeners.clear();
    }
  };
  var uploadSessionManager = UploadSessionManager.getInstance();

  // src/routes/asset.ts
  function createAssetMethods(client) {
    async function uploadPart(signedUrl, partNumber, totalParts, data, options = {}, attempt = 1) {
      const { onPartProgress, maxRetries = 3, abortSignal } = options;
      try {
        if (onPartProgress) {
          onPartProgress({
            partNumber,
            totalParts,
            partPercent: 0
          });
        }
        if (abortSignal?.aborted) {
          throw new Error("Upload aborted by user");
        }
        const headers = {
          "Content-Type": "application/octet-stream"
        };
        if (typeof Buffer !== "undefined" && data instanceof Buffer) {
          headers["Content-Length"] = data.length.toString();
        }
        const response = await fetch(signedUrl, {
          method: "PUT",
          headers,
          body: data,
          signal: abortSignal
        });
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }
        const eTag = response.headers.get("ETag")?.replace(/['"]/g, "") || "";
        if (!eTag) {
          throw new Error("Server did not return an ETag");
        }
        if (onPartProgress) {
          onPartProgress({
            partNumber,
            totalParts,
            partPercent: 100
          });
        }
        return {
          ETag: eTag,
          PartNumber: partNumber
        };
      } catch (error) {
        if (attempt < maxRetries) {
          console.warn(`Part ${partNumber} upload failed (attempt ${attempt}/${maxRetries}). Retrying...`);
          const delay = Math.min(1e3 * Math.pow(2, attempt - 1) * (0.9 + Math.random() * 0.2), 1e4);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return uploadPart(signedUrl, partNumber, totalParts, data, options, attempt + 1);
        }
        throw error;
      }
    }
    return {
      /**
       * Retrieves a specific asset by its ID with optional chat data.
       * @param {string} assetId - The ID of the asset.
       * @param {GetAssetParams} [params] - Optional parameters for chat data inclusion.
       * @returns {Promise<AssetResponse>} The asset object with optional chat data.
       */
      async getAsset(assetId, params) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/assets/${assetId}`,
          params,
          sendJWT: true
        });
      },
      /**
       * Lists every location an asset is referenced — its primary file system and
       * each secondary reference (reviewer, submission, public), grouped and counted.
       *
       * Renaming an asset retitles it at every one of these locations, and deleting
       * its last primary reference removes them all — so this is what the rename and
       * delete confirmations show the user before either happens.
       *
       * @param {string} assetId - The ID of the asset.
       * @returns {Promise<AssetReferences>} The asset's references.
       */
      async getAssetReferences(assetId) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/assets/${assetId}/references`,
          sendJWT: true
        });
      },
      /**
       * Updates an asset.
       * @param {string} assetId - The ID of the asset to update.
       * @param {UpdateAssetData} updateData - Data to update (e.g., name, meta, tags, folderId).
       * @returns {Promise<AssetResponse>} The updated asset object.
       */
      async updateAsset(assetId, updateData) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/assets/${assetId}`,
          body: updateData,
          sendJWT: true
        });
      },
      /**
       * Deletes an asset (marks for deletion).
       * @param {string} assetId - The ID of the asset to delete.
       * @returns {Promise<void>} 
       */
      async deleteAsset(assetId) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/assets/${assetId}`,
          sendJWT: true
        });
      },
      /**
       * Retrieves a specific file from an asset.
       * @param {string} assetId - The ID of the asset.
       * @param {string} fileId - The ID of the file.
       * @returns {Promise<FileResponse>} The file object.
       */
      async getFile(assetId, fileId) {
        if (!assetId) throw new Error("assetId is required.");
        if (!fileId) throw new Error("fileId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/assets/${assetId}/file/${fileId}`,
          sendJWT: true
        });
      },
      /**
       * Retrieves files of a specific function type from an asset.
       * @param {string} assetId - The ID of the asset.
       * @param {string} functionType - The function type of the files (e.g., 'thumbnail', 'original').
       * @returns {Promise<FileResponse[]>} An array of file objects.
       */
      async getFilesByFunctionType(assetId, functionType) {
        if (!assetId) throw new Error("assetId is required.");
        if (!functionType) throw new Error("functionType is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/assets/${assetId}/function-type/${functionType}`,
          sendJWT: true
        });
      },
      /**
       * Complete a multipart upload initiated by `createAssets`.
       *
       * Matches the route (`POST /v1/assets/complete-upload`) and mirrors
       * `nuramaClient.scratch.completeUpload`, so moving between the asset
       * and scratch namespaces uses the same verb.
       *
       * @param {CompleteMultipartUploadData} uploadData - Data including key, uploadId, parts, and assetId.
       * @returns {Promise<any>} S3 completion response.
       */
      async completeUpload(uploadData) {
        if (!uploadData || !uploadData.key || !uploadData.uploadId || !uploadData.parts || !uploadData.assetId) {
          throw new Error("key, uploadId, parts, and assetId are required for completeUpload.");
        }
        return client._request({
          method: "POST",
          endpoint: "/v1/assets/complete-upload",
          body: uploadData,
          sendJWT: true
        });
      },
      /**
       * Uploads a file using multipart upload with the provided signed URLs
       * @param {File|Blob|Buffer|string} file - The file to upload (File/Blob in browser, Buffer/string path in Node.js)
       * @param {string[]} signedUrls - Array of signed URLs for each part
       * @param {string} key - The S3 key for the upload
       * @param {string} uploadId - The S3 uploadId for the multipart upload
       * @param {MultipartUploadOptions} options - Upload options
       * @returns {Promise<MultipartUploadResult>} The completed upload data
       */
      async multipartUpload(file, signedUrls, key, uploadId, options = {}) {
        if (!file) throw new Error("file is required");
        if (!signedUrls || !signedUrls.length) throw new Error("signedUrls array is required and cannot be empty");
        if (!key) throw new Error("key is required");
        if (!uploadId) throw new Error("uploadId is required");
        const {
          onProgress,
          abortSignal,
          enableProgressPersistence,
          projectId,
          sessionId: providedSessionId,
          fileName,
          fileSize: providedFileSize,
          assetId
        } = options;
        const totalParts = signedUrls.length;
        const completedParts = [];
        const partProgress = new Array(totalParts).fill(0);
        const calculateTotalProgress = () => {
          const totalPercent = partProgress.reduce((sum, percent) => sum + percent, 0) / totalParts;
          return Math.floor(totalPercent);
        };
        let sessionData = null;
        if (enableProgressPersistence && projectId) {
          const actualSessionId = providedSessionId || `upload_${uploadId}_${Date.now()}`;
          const actualFileName = fileName || (typeof file === "string" ? file.split("/").pop() || "unknown" : "unknown");
          let actualFileSize = providedFileSize;
          if (!actualFileSize) {
            if (typeof File !== "undefined" && file instanceof File || typeof Blob !== "undefined" && file instanceof Blob) {
              actualFileSize = file.size;
            } else if (typeof Buffer !== "undefined" && file instanceof Buffer) {
              actualFileSize = file.length;
            }
          }
          try {
            sessionData = uploadSessionManager.createSession(projectId, actualSessionId, {
              uploadId,
              key,
              fileName: actualFileName,
              fileSize: actualFileSize || 0,
              totalParts,
              assetId
            });
          } catch (error) {
            console.warn("[SDK] Failed to create upload session:", error);
          }
        }
        try {
          let fileSize;
          let getChunk;
          if (typeof File !== "undefined" && file instanceof File || typeof Blob !== "undefined" && file instanceof Blob) {
            const blob = file;
            fileSize = blob.size;
            getChunk = async (start, end) => {
              const slice = blob.slice(start, end);
              let buffer;
              if (typeof slice.arrayBuffer === "function") {
                buffer = await slice.arrayBuffer();
              } else {
                buffer = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = () => reject(new Error("Failed to read blob chunk"));
                  reader.readAsArrayBuffer(slice);
                });
              }
              if (buffer.byteLength === 0 && end > start) {
                throw new Error(`Failed to read file bytes ${start}-${end}: got 0 bytes (file may have been modified or removed)`);
              }
              return buffer;
            };
          } else if (typeof Buffer !== "undefined" && file instanceof Buffer) {
            const buffer = file;
            fileSize = buffer.length;
            getChunk = async (start, end) => {
              return buffer.slice(start, end);
            };
          } else if (typeof file === "string") {
            if (typeof process === "undefined" || typeof __require !== "function") {
              throw new Error("File path provided but environment does not support Node.js file system");
            }
            try {
              const fs = await import("fs/promises");
              const { stat, open } = fs;
              const stats = await stat(file);
              fileSize = stats.size;
              getChunk = async (start, end) => {
                const fileHandle = await open(file, "r");
                try {
                  const length = end - start;
                  const buffer = Buffer.alloc(length);
                  await fileHandle.read(buffer, 0, length, start);
                  return buffer;
                } finally {
                  await fileHandle.close();
                }
              };
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              throw new Error(`Failed to read file: ${errorMessage}`);
            }
          } else {
            throw new Error("Unsupported file type. Must be File, Blob, Buffer, or string path in Node.js");
          }
          const chunkSize = Math.ceil(fileSize / totalParts);
          for (let i = 0; i < totalParts; i++) {
            if (abortSignal?.aborted) {
              throw new Error("Upload aborted by user");
            }
            const partNumber = i + 1;
            const start = i * chunkSize;
            const end = Math.min((i + 1) * chunkSize, fileSize);
            const currentTotalProgress = calculateTotalProgress();
            client._log(`[DEBUG] Uploading part ${partNumber}/${totalParts}, bytes ${start}-${end - 1} of ${fileSize}, totalPercentComplete: ${currentTotalProgress}%`);
            const chunkData = await getChunk(start, end);
            const partOptions = {
              maxRetries: options.maxRetries,
              abortSignal,
              onPartProgress: onProgress ? (progress) => {
                partProgress[i] = progress.partPercent;
                const totalPercentComplete = calculateTotalProgress();
                if (sessionData) {
                  try {
                    const completedPartsArray = partProgress.map((percent, index) => percent === 100 ? index + 1 : null).filter((part2) => part2 !== null);
                    uploadSessionManager.updateProgress(sessionData.projectId, sessionData.sessionId, {
                      progress: totalPercentComplete,
                      partNumber: progress.partNumber,
                      completedParts: completedPartsArray
                    });
                  } catch (error) {
                    console.warn("[SDK] Failed to update upload session progress:", error);
                  }
                }
                onProgress({
                  partNumber: progress.partNumber,
                  totalParts: progress.totalParts,
                  percentComplete: progress.partPercent,
                  totalPercentComplete
                });
              } : void 0
            };
            const part = await uploadPart(
              signedUrls[i],
              partNumber,
              totalParts,
              chunkData,
              partOptions
            );
            completedParts.push(part);
          }
          completedParts.sort((a, b) => a.PartNumber - b.PartNumber);
          if (sessionData) {
            try {
              uploadSessionManager.updateStatus(sessionData.projectId, sessionData.sessionId, "completing");
            } catch (error) {
              console.warn("[SDK] Failed to update upload session status to completing:", error);
            }
          }
          return {
            key,
            uploadId,
            parts: completedParts
          };
        } catch (error) {
          if (sessionData) {
            try {
              const errorMessage = error instanceof Error ? error.message : String(error);
              uploadSessionManager.updateStatus(sessionData.projectId, sessionData.sessionId, "failed", errorMessage);
            } catch (sessionError) {
              console.warn("[SDK] Failed to update upload session status to failed:", sessionError);
            }
          }
          throw error;
        }
      },
      /**
       * Gets the page number an asset appears on based on specified filters and sorting.
       * @param {string} assetId - The ID of the asset to find the page for.
       * @param {GetAssetPageParams} [params] - Query parameters for sorting, filtering, and pagination limit.
       * @returns {Promise<AssetPageResponse>} Object containing the page number.
       */
      async getAssetPage(assetId, params) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/assets/page/${assetId}`,
          params,
          sendJWT: true
        });
      },
      /**
       * Attempts to repair assets (e.g., regenerate signed URLs for pending uploads).
       * @param {string[]} assetIds - An array of asset IDs to repair.
       * @returns {Promise<RepairAssetsResponse>} Array of repair results.
       */
      async repairAssets(assetIds) {
        if (!assetIds || assetIds.length === 0) throw new Error("assetIds array is required and cannot be empty.");
        return client._request({
          method: "POST",
          endpoint: "/v1/assets/repair",
          body: { assetIds },
          sendJWT: true
        });
      },
      /**
       * Generates signed download URLs for the original files of specified assets.
       * @param {string[]} assetIds - An array of asset IDs.
       * @returns {Promise<DownloadAssetsResponse>} Array of download URL results.
       */
      async downloadAssets(assetIds) {
        if (!assetIds || assetIds.length === 0) throw new Error("assetIds array is required and cannot be empty.");
        return client._request({
          method: "POST",
          endpoint: "/v1/assets/download",
          body: { assetIds },
          sendJWT: true
        });
      },
      /**
       * Mints a short-lived signed URL for rendering a document inline.
       *
       * Documents keep their `media` PDF in the private bucket, so unlike images
       * and video it cannot be addressed by keyPath through the file CDN. Fetch
       * this per document open; do not cache it past `expires`.
       *
       * @param {string} assetId - The document asset's ID.
       * @returns {Promise<DocumentViewUrlResponse>} Signed URL, expiry and page count.
       */
      async getDocumentViewUrl(assetId) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/assets/${assetId}/document-url`,
          sendJWT: true
        });
      },
      /**
       * Tags an asset with a specific tag.
       * @param {string} assetId - The ID of the asset to tag.
       * @param {TagAssetData} tagData - Data containing the tag ID.
       * @returns {Promise<AssetResponse>} The updated asset object.
       */
      async tagAsset(assetId, tagData) {
        if (!assetId) throw new Error("assetId is required.");
        if (!tagData.tagId) throw new Error("tagId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/assets/${assetId}/tag`,
          body: tagData,
          sendJWT: true
        });
      },
      /**
       * Untags an asset by removing a specific tag.
       * @param {string} assetId - The ID of the asset to untag.
       * @param {UntagAssetData} untagData - Data containing the tag ID to remove.
       * @returns {Promise<AssetResponse>} The updated asset object.
       */
      async untagAsset(assetId, untagData) {
        if (!assetId) throw new Error("assetId is required.");
        if (!untagData.tagId) throw new Error("tagId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/assets/${assetId}/untag`,
          body: untagData,
          sendJWT: true
        });
      },
      /**
       * Creates a short link for an asset.
       * If a short link already exists for the asset with the same visibility, returns the existing one.
       * @param {string} assetId - The ID of the asset to create a short link for.
       * @param {CreateAssetShortLinkData} [data] - Optional data including visibility context.
       * @returns {Promise<CreateAssetShortLinkResponse>} The short link object and short URL.
       */
      async createShortLink(assetId, data) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/assets/${assetId}/shortlink`,
          params: data,
          sendJWT: true
        });
      },
      // ========================================================================
      // Public Asset Link Methods
      // ========================================================================
      /**
       * Create a public download link for an asset.
       * @param {string} assetId - The asset ID.
       * @param {Object} data - Link creation data.
       * @param {string} data.projectId - The project ID.
       * @param {number} [data.validity] - Link validity in milliseconds.
       * @returns {Promise<PublicAssetLink>} The created public link.
       */
      async createPublicLink(assetId, data) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/assets/${assetId}/public-links`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Get all public download links for an asset.
       * @param {string} assetId - The asset ID.
       * @returns {Promise<{ results: PublicAssetLink[] }>} The public links.
       */
      async getPublicLinks(assetId, options) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/assets/${assetId}/public-links`,
          sendJWT: true,
          bypassCache: options?.bypassCache
        });
      },
      /**
       * Update a public download link (extend expiration or change status).
       * @param {string} assetId - The asset ID.
       * @param {string} linkId - The link ID.
       * @param {Object} data - Update data.
       * @returns {Promise<PublicAssetLink>} The updated public link.
       */
      async updatePublicLink(assetId, linkId, data) {
        if (!assetId) throw new Error("assetId is required.");
        if (!linkId) throw new Error("linkId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/assets/${assetId}/public-links/${linkId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Disable a public download link.
       * @param {string} assetId - The asset ID.
       * @param {string} linkId - The link ID.
       * @returns {Promise<PublicAssetLink>} The disabled public link.
       */
      async disablePublicLink(assetId, linkId) {
        if (!assetId) throw new Error("assetId is required.");
        if (!linkId) throw new Error("linkId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/assets/${assetId}/public-links/${linkId}/disable`,
          sendJWT: true
        });
      },
      /**
       * Reactivate a disabled/expired public download link.
       * @param {string} assetId - The asset ID.
       * @param {string} linkId - The link ID.
       * @param {Object} [data] - Reactivation data.
       * @param {number} [data.validity] - New validity in milliseconds.
       * @returns {Promise<PublicAssetLink>} The reactivated public link.
       */
      async reactivatePublicLink(assetId, linkId, data) {
        if (!assetId) throw new Error("assetId is required.");
        if (!linkId) throw new Error("linkId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/assets/${assetId}/public-links/${linkId}/reactivate`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Mint a signed multipart upload URL for a user-supplied custom thumbnail
       * image. The upload lands in the originals bucket tagged so the
       * post-processing Lambda generates the customThumbnail outputs and
       * registers them on the asset via the file-update callback.
       *
       * Caller flow:
       *   1. multipartUpload(file, response.urls, response.key, response.uploadId)
       *   2. completeCustomThumbnailUpload({ assetId, key, uploadId, parts })
       *   3. wait for the assetFileUpdate websocket event
       */
      async getCustomThumbnailUploadUrl(assetId, data) {
        if (!assetId) throw new Error("assetId is required.");
        if (!data?.fileName || !data?.mimeType || !data?.sizeInMB) {
          throw new Error("fileName, mimeType, and sizeInMB are required.");
        }
        return client._request({
          method: "POST",
          endpoint: `/v1/assets/${assetId}/custom-thumbnail/upload-url`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Finalize the multipart S3 upload for a custom thumbnail. Triggers the
       * post-processing Lambda by committing the S3 object.
       */
      async completeCustomThumbnailUpload(assetId, data) {
        if (!assetId) throw new Error("assetId is required.");
        if (!data?.key || !data?.uploadId || !data?.parts?.length) {
          throw new Error("key, uploadId, and parts are required.");
        }
        return client._request({
          method: "POST",
          endpoint: `/v1/assets/${assetId}/custom-thumbnail/complete-upload`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Remove the custom thumbnail from an asset. Soft-deletes all custom
       * thumb files; the asset falls back to the auto-generated thumbnail.
       */
      async removeCustomThumbnail(assetId) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/assets/${assetId}/custom-thumbnail`,
          sendJWT: true
        });
      },
      /**
       * Promote a chat-message attachment into a project as a fresh,
       * independent project asset. The source attachment is left untouched;
       * the new project asset has its own lifecycle, post-processing
       * pipeline, and storage footprint.
       *
       * Idempotent: a second promote of the same source into the same
       * project returns the existing promoted asset with `deduped: true`.
       *
       * Requires `canCreateAsset` on the destination project — reviewers
       * are blocked. The server additionally rejects when the source
       * attachment's workspace doesn't match the destination project's.
       */
      async promoteAttachmentToProject(assetId, payload) {
        if (!assetId) throw new Error("assetId is required.");
        if (!payload?.projectId) throw new Error("projectId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/assets/${assetId}/promote-to-project`,
          body: payload,
          sendJWT: true
        });
      },
      /**
       * Upload Session Management Methods
       */
      /**
       * Get all active upload sessions for a project
       * @param {string} projectId - The project ID to get sessions for
       * @returns {UploadSessionData[]} Array of upload session data
       */
      getUploadSessions(projectId) {
        if (!projectId) throw new Error("projectId is required");
        return uploadSessionManager.getProjectSessions(projectId);
      },
      /**
       * True when any upload is genuinely in flight anywhere in the app (across
       * all projects and tabs). Intended for app-level guards — e.g. suppressing
       * an automatic version-update page refresh while bytes are still uploading.
       * Stale (crashed-tab) sessions are ignored via the freshness window.
       * @param {number} [staleMs] - Max age of the last progress update that still
       *   counts as active (default: 2 minutes)
       * @returns {boolean}
       */
      hasActiveUploads(staleMs) {
        return uploadSessionManager.hasActiveUploads(staleMs);
      },
      /**
       * Get a specific upload session
       * @param {string} projectId - The project ID
       * @param {string} sessionId - The session ID
       * @returns {UploadSessionData | null} Upload session data or null if not found
       */
      getUploadSession(projectId, sessionId) {
        if (!projectId) throw new Error("projectId is required");
        if (!sessionId) throw new Error("sessionId is required");
        return uploadSessionManager.getSession(projectId, sessionId);
      },
      /**
       * Remove an upload session
       * @param {string} projectId - The project ID
       * @param {string} sessionId - The session ID
       */
      removeUploadSession(projectId, sessionId) {
        if (!projectId) throw new Error("projectId is required");
        if (!sessionId) throw new Error("sessionId is required");
        uploadSessionManager.removeSession(projectId, sessionId);
      },
      /**
       * Clean up old upload sessions for a project
       * @param {string} projectId - The project ID
       * @param {number} [olderThanMs] - Remove sessions older than this (default: 24 hours)
       */
      cleanupUploadSessions(projectId, olderThanMs) {
        if (!projectId) throw new Error("projectId is required");
        uploadSessionManager.cleanupSessions(projectId, olderThanMs);
      },
      /**
       * Register a listener for cross-tab upload session messages
       * @param {string} listenerId - Unique listener ID
       * @param {function} callback - Callback function to handle messages
       */
      onUploadSessionMessage(listenerId, callback) {
        if (!listenerId) throw new Error("listenerId is required");
        if (typeof callback !== "function") throw new Error("callback must be a function");
        uploadSessionManager.onMessage(listenerId, callback);
      },
      /**
       * Unregister a cross-tab upload session message listener
       * @param {string} listenerId - Unique listener ID
       */
      offUploadSessionMessage(listenerId) {
        if (!listenerId) throw new Error("listenerId is required");
        uploadSessionManager.offMessage(listenerId);
      },
      /**
       * Mark an upload session as completed
       * @param {string} projectId - The project ID
       * @param {string} sessionId - The session ID
       */
      completeUploadSession(projectId, sessionId) {
        if (!projectId) throw new Error("projectId is required");
        if (!sessionId) throw new Error("sessionId is required");
        uploadSessionManager.updateStatus(projectId, sessionId, "completed");
      },
      // ========================================================================
      // Access Activity Methods (play / download / embed metrics)
      // ========================================================================
      /**
       * Record an authenticated play event from the in-app player. Fire-and-forget;
       * server returns 204. Throw-on-failure is fine because the caller already
       * de-dupes per session.
       */
      async recordAccessActivity(assetId, body) {
        if (!assetId) throw new Error("assetId is required.");
        await client._request({
          method: "POST",
          endpoint: `/v1/assets/${assetId}/access-activity`,
          body,
          sendJWT: true
        });
      },
      /**
       * Get aggregated access-activity for a single asset. Returns totals per
       * eventType, a breakdown for the requested dimension, and a zero-filled
       * daily series.
       */
      async getAssetAccessActivity(assetId, params) {
        if (!assetId) throw new Error("assetId is required.");
        const query = new URLSearchParams();
        if (params?.range) query.set("range", params.range);
        if (params?.groupBy) query.set("groupBy", params.groupBy);
        if (params?.eventType) query.set("eventType", params.eventType);
        if (params?.limit != null) query.set("limit", String(params.limit));
        const qs = query.toString();
        return client._request({
          method: "GET",
          endpoint: `/v1/assets/${assetId}/access-activity${qs ? `?${qs}` : ""}`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/chat.ts
  function createChatMethods(client) {
    return {
      // --- Topic Chats ---
      /**
       * Creates a topic chat for a project or asset at a given visibility.
       * Requires `canCreateCreatorChat` (visibility `creator`) or `canCreateReviewerChat`
       * (visibility `reviewer`) on the topic resource. Although `visibility` is optional in
       * the type, the permission check only passes when it is one of those two values, so
       * omitting it results in 403.
       * @param {CreateTopicChatData} data - `topicType` (`project` | `asset`), `topicId`, optional `subject` (max 100 chars) and `visibility`.
       * @returns {Promise<ChatResponse>} The created chat.
       */
      async createTopicChat(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/chats/topic",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Retrieves the topic chat for a project, asset, public release or task, together
       * with its most recent messages and their replies.
       * Requires `canGetCreatorChat` or `canGetReviewerChat` on the chat, matching
       * `params.visibility`. `replies` (default 10, max 100) and `sort` (default `{ id: -1 }`)
       * are honoured, but `messages` is accepted and then not forwarded by the API handler,
       * so 10 recent messages are always returned.
       * @param {string} topicId - The ID of the topic resource (project, asset, public release or task).
       * @param {GetChatByTopicIdParams} params - See GetChatByTopicIdParams. `topicType` is one of `project`, `asset`, `public`, `task`.
       * @returns {Promise<ChatResponse>} The chat, including `recentMessages`.
       * @throws {Error} 'topicId is required.' when `topicId` is falsy.
       */
      async getChatByTopicId(topicId, params) {
        if (!topicId) throw new Error("topicId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/topic/${topicId}`,
          params,
          sendJWT: true
        });
      },
      // --- Member Chats ---
      /**
       * Creates a member ("Team") chat in a workspace with the given members.
       * Only `scopeType: 'workspace'` is accepted by the API: project-scoped member chats
       * are deprecated and `social` is not supported yet, so both are rejected with 400
       * even though the type still allows them. Requires `canCreateWorkspaceMemberChat` on
       * the workspace. The caller is always added as the first member, every member must
       * be chat-eligible in the scope (`membersInvalid` otherwise), and a random approved
       * colour is assigned (the API also accepts an optional `color`, not exposed on this type).
       * @param {CreateMemberChatData} data - `scopeType`, `scopeId`, `memberIds` and optional `subject` (max 100 chars).
       * @returns {Promise<MemberChatResponse>} The created member chat.
       */
      async createMemberChat(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/chats/member",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Lists the member chats the caller belongs to, most recently updated first, each
       * with its recent messages.
       * Defaults to index pagination (`page`, `limit` max 20); pass `paginate: 'cursor'` for
       * cursor pagination. `updatedBefore` is only accepted with index pagination,
       * `recentMessages` caps the messages returned per chat (default and max 20), and
       * `archived` narrows to chats the caller has (`true`) or has not (`false`) archived.
       * `createdBefore` / `createdAfter` from DateRangeParams are not accepted by this
       * endpoint and cause a 400.
       * @param {GetUsersMemberChatsParams} [params] - See GetUsersMemberChatsParams.
       * @returns {Promise<PaginatedResponse<MemberChatResponse>>} A paginated list of member chats.
       */
      async getUsersMemberChats(params) {
        return client._request({
          method: "GET",
          endpoint: "/v1/chats/member",
          params,
          sendJWT: true
        });
      },
      /**
       * Retrieves a member chat by ID without its messages.
       * The caller must be a member of the chat.
       * @param {string} chatId - The ID of the member chat.
       * @returns {Promise<MemberChatResponse>} The member chat with `participants`, `members` and `icon` populated.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async getMemberChat(chatId) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/member/${chatId}`,
          sendJWT: true
        });
      },
      /**
       * Retrieves every project topic chat (creator/reviewer) the caller can
       * access across all projects in a workspace, with the latest message and
       * message count for each, ordered by most recent activity. Powers the
       * workspace-level "Project Chat" list.
       * Requires `canGetWorkspace` on the workspace; access to each project's chats is
       * derived from the caller's inherited `canGetCreatorChat` / `canGetReviewerChat`.
       * @param {string} workspaceId - The ID of the workspace.
       * @returns {Promise<Array<object>>} An array of `{ project, visibility, chat }` entries; `chat.recentMessages` holds at most the latest message.
       * @throws {Error} 'workspaceId is required.' when `workspaceId` is falsy.
       */
      async getWorkspaceProjectChats(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/workspace/${workspaceId}/project-chats`,
          sendJWT: true
        });
      },
      /**
       * Updates a member chat's subject and/or colour.
       * The caller must be a member of the chat. `subject` is limited to 100 characters
       * and `color` must be one of the approved palette colours.
       * @param {string} chatId - The ID of the member chat.
       * @param {UpdateMemberChatData} data - The new `subject` and/or `color`.
       * @returns {Promise<MemberChatResponse>} The updated member chat.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async updateMemberChat(chatId, data) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/chats/member/${chatId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Marks a member chat, its messages and its attachments for deletion.
       * Only the chat's creator may delete it; other members receive 403. From the
       * members' perspective the chat disappears immediately; the rows are removed later
       * by the cleanup service.
       * @param {string} chatId - The ID of the member chat.
       * @returns {Promise<void>} Resolves with `null` (the API sends an empty body).
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async deleteMemberChat(chatId) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/chats/member/${chatId}`,
          sendJWT: true
        });
      },
      /**
       * Archives a member chat for the calling user only.
       * Adds the caller to the chat's `archivedBy` list; other members' view of the chat
       * is unaffected. The caller must be a member of the chat.
       * @param {string} chatId - The ID of the member chat.
       * @returns {Promise<MemberChatResponse>} The updated member chat.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async archiveMemberChat(chatId) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/chats/member/${chatId}/archive`,
          sendJWT: true
        });
      },
      /**
       * Unarchives a member chat for the calling user only.
       * Removes the caller from the chat's `archivedBy` list. The caller must be a member
       * of the chat.
       * @param {string} chatId - The ID of the member chat.
       * @returns {Promise<MemberChatResponse>} The updated member chat.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async unarchiveMemberChat(chatId) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/chats/member/${chatId}/unarchive`,
          sendJWT: true
        });
      },
      /**
       * Creates an icon asset for a member chat and returns signed upload URLs for it.
       * Any existing icon is marked for deletion. The caller must be a member of the chat;
       * `sizeInMB` is capped at 10 and `name` at 100 characters. Upload the file to the
       * returned `signedUrlData.urls` afterwards, exactly as for any asset upload.
       * @param {string} chatId - The ID of the member chat.
       * @param {UpdateMemberChatIconData} data - `name` (with extension), `checksum` (MD5 or SHA-256) and `sizeInMB`.
       * @returns {Promise<{ chat: MemberChatResponse } & AttachmentUploadRecord>} The updated `chat` plus the created upload record. Note the record's fields (`asset`, `signedUrlData`, `status`, ...) are spread directly onto the response; there is no `iconData` key despite the declared type.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async updateMemberChatIcon(chatId, data) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/chats/member/${chatId}/icon`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Lists the members that can be added to an existing member chat, based on the chat's
       * scope and the caller's role in it.
       * The caller must be a member of the chat. For workspace-scoped chats the result is a
       * flat array of memberships; for legacy project-scoped chats it is an
       * `AddableMembersByScope` object.
       * @param {string} chatId - The ID of the member chat.
       * @returns {Promise<MemberResponse[] | AddableMembersByScope>} Addable memberships, each with its `user` populated.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async getAddableMembers(chatId) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/member/members/${chatId}`,
          sendJWT: true
        });
      },
      /**
       * Lists the members addable to a NEW member chat, by scope, before the chat
       * exists. Use this to populate the create-chat member picker — unlike the
       * raw membership-list endpoints it isn't admin-gated, so non-admin members
       * allowed to start a Team Chat still get the correct list.
       * Requires `canCreateWorkspaceMemberChat` (or `canCreateProjectMemberChat`) on the
       * scope. For `project` scope the result is an `AddableMembersByScope` object; note
       * that project-scoped member chats can no longer be created.
       * @param {'workspace' | 'project'} scopeType - Scope of the chat to create.
       * @param {string} scopeId - ID of the scope resource.
       * @returns {Promise<MemberResponse[] | AddableMembersByScope>} Addable memberships, each with its `user` populated.
       * @throws {Error} 'scopeType is required.' or 'scopeId is required.' when either is falsy.
       */
      async getScopeAddableMembers(scopeType, scopeId) {
        if (!scopeType) throw new Error("scopeType is required.");
        if (!scopeId) throw new Error("scopeId is required.");
        return client._request({
          method: "GET",
          endpoint: "/v1/chats/member/addable",
          params: { scopeType, scopeId },
          sendJWT: true
        });
      },
      /**
       * Adds users to a member chat by user ID.
       * The caller must be a member of the chat, and every user must be chat-eligible in
       * the chat's scope (`membersInvalid` otherwise). `memberIds` is not enforced by
       * validation, but the request cannot succeed without it.
       * @param {string} chatId - The ID of the member chat.
       * @param {MemberIdList} data - `memberIds`: the user IDs to add.
       * @returns {Promise<MemberChatResponse>} The updated member chat.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async addMembers(chatId, data) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/chats/member/members/${chatId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Removes users from a member chat by user ID.
       * The caller must be a member of the chat. The chat's creator cannot be removed
       * (`ownerCannotLeaveChat`) and unknown user IDs produce `userNotFound`. Sent as a
       * DELETE with a JSON body.
       * @param {string} chatId - The ID of the member chat.
       * @param {MemberIdList} data - `memberIds`: the user IDs to remove.
       * @returns {Promise<MemberChatResponse>} The updated member chat.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async removeMembers(chatId, data) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/chats/member/members/${chatId}`,
          body: data,
          sendJWT: true
        });
      },
      // --- Generic Chat Management ---
      /**
       * Retrieves a topic chat (project, asset, task or public) by ID without its messages.
       * Requires `canGetCreatorChat` or `canGetReviewerChat` on the chat, matching its
       * visibility. Only topic chats are served here; member chats are served by
       * `getMemberChat` and a member chat ID yields `chatNotFound`.
       * @param {string} chatId - The ID of the topic chat.
       * @returns {Promise<ChatResponse>} The chat with `participants` populated.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async getChat(chatId) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/${chatId}`,
          sendJWT: true
        });
      },
      /**
       * Updates the subject of a topic chat.
       * Requires `canUpdateCreatorChat` or `canUpdateReviewerChat` on the chat, matching
       * its visibility. `subject` is limited to 100 characters. For member chats use
       * `updateMemberChat`.
       * @param {string} chatId - The ID of the topic chat.
       * @param {UpdateChatSubjectData} data - The new `subject`.
       * @returns {Promise<ChatResponse>} The updated chat.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async updateChatSubject(chatId, data) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/chats/${chatId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Marks a topic chat for deletion.
       * In practice this only succeeds for `user`-topic chats owned by the caller: project
       * and asset topic chats are refused with `topicChatsMayNotBeDeleted`, and any other
       * topic type with `unknownError`. Member chats are deleted with `deleteMemberChat`.
       * @param {string} chatId - The ID of the chat.
       * @returns {Promise<void>} Resolves with `null` (the API sends an empty body).
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async deleteChat(chatId) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/chats/${chatId}`,
          sendJWT: true
        });
      },
      // --- Messages ---
      /**
       * Posts a message to any chat type (topic, member, submission, AI, support).
       * Either `content` (max 10,000 chars) or at least one attachment is required. API
       * tokens need the `chat:write` scope (`tokenScopeMissing` / 403 otherwise); users
       * need message-create permission on the chat, e.g. `canCreateCreatorChatMessage` /
       * `canCreateReviewerChatMessage` for topic chats or membership for member chats.
       * Limits: 6 attachments, 10 of each mention kind, 5 quotes, 5 link previews and
       * 100 annotations. Mentioning users in topic/member/submission chats creates tasks
       * and notifications for them. `pageContext` is only read by AI chats and ignored by
       * every other chat type.
       * @param {string} chatId - The ID of the chat to post in.
       * @param {CreateMessageData} data - See CreateMessageData. `attachments` may mix upload-shape (`FileAttachmentData`) and scratch-shape (`ScratchAttachmentRef`) items.
       * @returns {Promise<ChatMessageResponse>} The created message. When upload-shape attachments were sent it also carries `attachmentData` with the created assets and their signed upload URLs.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async createMessage(chatId, data) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/chats/${chatId}/new-message`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Posts a message to an asset's chat at the given visibility, creating the chat first
       * if it does not exist yet (asset chats are normally auto-created, so this mainly
       * covers legacy assets).
       * Only media assets are accepted (`assetInvalidFunctionType` / 404 otherwise).
       * Requires both `canCreate{Creator|Reviewer}Chat` and
       * `canCreate{Creator|Reviewer}ChatMessage` on the asset for the chosen visibility.
       * The body follows the same rules as `createMessage`. The `params` argument is
       * neither validated nor forwarded by the API handler, so the returned chat always
       * carries 10 recent messages with 10 replies each, sorted `{ id: -1 }`.
       * @param {string} assetId - The ID of the media asset.
       * @param {'creator' | 'reviewer'} visibility - Which of the asset's two chats to post in.
       * @param {CreateAssetChatAndMessageData} data - See CreateMessageData.
       * @param {CreateAssetChatAndMessageParams} [params] - Accepted for backwards compatibility only; currently ignored by the API.
       * @returns {Promise<any>} `{ chat, message }`: the chat re-read after the message landed (so `recentMessages` includes it) and the created message, which carries `attachmentData` when upload-shape attachments were sent.
       * @throws {Error} 'assetId is required.' when `assetId` is falsy.
       */
      async createAssetChatAndMessage(assetId, visibility, data, params) {
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/chats/asset/${assetId}/${visibility}/new-message`,
          body: data,
          params,
          // Params for recent messages/replies included in response
          sendJWT: true
        });
      },
      /**
       * Lists a chat's active messages with their recent replies and populated
       * attachments and mentions.
       * Requires read access to the chat (`canGetChat`); API tokens need the `chat:read`
       * scope (`tokenScopeMissing` / 403 otherwise). Defaults to index pagination (`page`,
       * `limit` max 100, sort `{ id: -1 }`); pass `paginate: 'cursor'` for cursor
       * pagination. `createdBefore` / `createdAfter` are only accepted with index
       * pagination and `updatedBefore` is not accepted at all. `replyLimit` (default 10,
       * max 100) sets the replies returned per message; `replies` is a deprecated alias
       * that takes precedence over `replyLimit` whenever it is set to anything other than 10.
       * @param {string} chatId - The ID of the chat.
       * @param {GetMessagesParams} [params] - See GetMessagesParams.
       * @returns {Promise<PaginatedResponse<ChatMessageResponse>>} A paginated list of messages.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async getMessages(chatId, params) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/${chatId}/messages`,
          params,
          sendJWT: true
        });
      },
      /**
       * Retrieves a single message by ID with its most recent replies.
       * Requires read access to the message's chat (`canGetChatMessage`). `replies`
       * defaults to 10 (max 100) and `sort` (default `{ id: -1 }`) orders the included replies.
       * @param {string} messageId - The ID of the message.
       * @param {GetMessageParams} [params] - See GetMessageParams.
       * @returns {Promise<ChatMessageResponse>} The message.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async getMessage(messageId, params) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/message/${messageId}`,
          params,
          sendJWT: true
        });
      },
      /**
       * Revises a message's content, mentions, quotes, annotations and link previews,
       * keeping the previous version as a revision.
       * Only the author may revise, and in topic/submission chats they also need
       * `canUpdateOwnChatMessage`. Annotations are replaced, not merged: omit
       * `annotations` to keep the current ones, send `[]` to remove them all.
       * `linkPreviews` likewise replaces the stored previews. Same size limits as
       * `createMessage`.
       * @param {string} messageId - The ID of the message to revise.
       * @param {ReviseMessageData} data - See ReviseMessageData.
       * @returns {Promise<ChatMessageResponse>} The revised message.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async reviseMessage(messageId, data) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/chats/message/${messageId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Marks a message for deletion.
       * Only the author may delete, and in topic/submission chats they also need
       * `canDeleteOwnChatMessage`. The row is removed later by the cleanup service.
       * @param {string} messageId - The ID of the message.
       * @returns {Promise<ChatMessageResponse>} The deleted message.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async deleteMessage(messageId) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/chats/message/${messageId}`,
          sendJWT: true
        });
      },
      // --- Replies ---
      /**
       * Lists the active replies to a message, with attachments populated.
       * Requires read access to the message's chat (`canGetChatMessage`). Defaults to
       * index pagination (`page`, `limit` max 100, sort `{ id: -1 }`); pass
       * `paginate: 'cursor'` for cursor pagination. `createdBefore` / `createdAfter` are
       * only accepted with index pagination and `updatedBefore` is not accepted at all.
       * @param {string} messageId - The ID of the parent message.
       * @param {GetRepliesParams} [params] - See GetRepliesParams.
       * @returns {Promise<PaginatedResponse<ChatMessageResponse>>} A paginated list of replies.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async getReplies(messageId, params) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/message/${messageId}/replies`,
          params,
          sendJWT: true
        });
      },
      // --- Attachments ---
      /**
       * Creates attachment assets for an existing message and returns signed upload URLs
       * for them.
       * Only the message's author may attach, and in topic/submission chats they also
       * need `canCreateAttachment`. Only image and video file names are accepted, each
       * `checksum` must be a 32-64 character hex MD5/SHA-256 digest, `id` must be an
       * integer no greater than 10, and the message may hold at most 6 attachments in
       * total (`exceedsMaxAttachments`). The request is also checked against the
       * workspace storage quota (`uploadRequestExceedsSubscription`).
       * @param {string} messageId - The ID of the message.
       * @param {FileAttachmentData[]} attachments - The files to attach; sent as the raw JSON body array.
       * @returns {Promise<AttachmentResponse[]>} One record per input file: the input item plus `status` and, on success, `asset` and `signedUrlData` (or `error` on failure). Not a bare `Asset` as the declared type suggests.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async addAttachments(messageId, attachments) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/chats/message/${messageId}/attachment/`,
          body: attachments,
          sendJWT: true
        });
      },
      /**
       * Removes an attachment from a message and marks the asset for deletion.
       * Only the author may remove attachments, and in topic/submission chats they also
       * need `canDeleteOwnAttachment`. If the message is left with no content and no
       * attachments it is marked for deletion as well, and the deleted message is returned.
       * @param {string} messageId - The ID of the message.
       * @param {string} assetId - The ID of the attached asset to remove.
       * @returns {Promise<ChatMessageResponse>} The updated (or deleted) message.
       * @throws {Error} 'messageId is required.' or 'assetId is required.' when either is falsy.
       */
      async removeAttachment(messageId, assetId) {
        if (!messageId) throw new Error("messageId is required.");
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/chats/message/${messageId}/attachment/${assetId}`,
          sendJWT: true
        });
      },
      // --- Mentions ---
      /**
       * Lists the messages in which the caller was mentioned.
       * Defaults to index pagination (`page`, `limit` max 100, sort `{ id: -1 }`); pass
       * `paginate: 'cursor'` for cursor pagination. Filter with `chatId` and/or
       * `authorId`. `createdBefore` is only accepted with index pagination;
       * `createdAfter` and `updatedBefore` from DateRangeParams are not accepted by this
       * endpoint and cause a 400.
       * @param {GetUsersMentionsParams} [params] - See GetUsersMentionsParams.
       * @returns {Promise<PaginatedResponse<ChatMessageResponse>>} A paginated list of messages.
       */
      async getMentions(params) {
        return client._request({
          method: "GET",
          endpoint: "/v1/chats/mentions",
          params,
          sendJWT: true
        });
      },
      // --- Summaries ---
      // --- Reactions ---
      /**
       * Adds the caller's emoji reaction to a message, replacing any reaction they already
       * had on it.
       * Each user holds at most one reaction per message. Requires message-create
       * permission on the chat (`canCreateReaction`). `emoji` must be 1-10 characters.
       * @param {string} messageId - The ID of the message.
       * @param {CreateReactionData} data - The `emoji` to react with.
       * @returns {Promise<ChatMessageResponse>} The updated message, including `reactions`.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async createReaction(messageId, data) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/chats/message/${messageId}/reaction`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Removes the caller's own reaction from a message.
       * Gated by the same permission as `createReaction`. Calling it when the caller has
       * no reaction is a no-op that still returns the message.
       * @param {string} messageId - The ID of the message.
       * @returns {Promise<ChatMessageResponse>} The updated message.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async removeReaction(messageId) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/chats/message/${messageId}/reaction`,
          sendJWT: true
        });
      },
      // --- Follow/Unfollow ---
      /**
       * Adds the caller to a chat's following list so they are notified about new
       * messages and updates.
       * Works with topic, member and submission chats and is idempotent. Requires
       * message-create permission on the chat (`canCreateChatMessage`).
       * @param {string} chatId - The ID of the chat to follow.
       * @returns {Promise<void>} Resolves once followed. The API sends an empty body; re-fetch the chat if you need its `following` list.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async followChat(chatId) {
        if (!chatId) throw new Error("chatId is required.");
        await client._request({
          method: "PUT",
          endpoint: `/v1/chats/${chatId}/follow`,
          sendJWT: true
        });
      },
      /**
       * Removes the caller from a chat's following list.
       * Works with topic, member and submission chats and is idempotent. No chat
       * permission is checked, so users can stop notifications for a chat they have
       * since lost access to.
       * @param {string} chatId - The ID of the chat to unfollow.
       * @returns {Promise<void>} Resolves once unfollowed. The API sends an empty body.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async unfollowChat(chatId) {
        if (!chatId) throw new Error("chatId is required.");
        await client._request({
          method: "PUT",
          endpoint: `/v1/chats/${chatId}/unfollow`,
          sendJWT: true
        });
      },
      // --- Mentionable Assets ---
      /**
       * Lists the active assets that can be mentioned (`{{assetMention:assetId}}`) in a chat.
       * What is returned depends on the chat: project and asset topic chats return the
       * project's assets at the chat's visibility; project-scoped member chats and
       * submission chats return all of the project's assets; AI chats return the topic
       * project's assets filtered to the caller's own visibility tiers; workspace/social
       * member chats return an empty list. Requires read access to the chat
       * (`canGetChatMentionableAssets`). Defaults to index pagination (`page`, `limit`
       * max 100, sort `{ name: 1 }`); pass `paginate: 'cursor'` for cursor pagination.
       * `startAt` / `includeStartAtRecord` are not accepted here.
       * @param {string} chatId - The ID of the chat.
       * @param {GetMentionableAssetsParams} [params] - See GetMentionableAssetsParams. `nameSearch` is a case-insensitive partial match.
       * @returns {Promise<PaginatedResponse<Asset>>} A paginated list of assets.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async getMentionableAssets(chatId, params) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/${chatId}/mentionable/assets`,
          params,
          sendJWT: true
        });
      },
      // --- Mentionable Folders ---
      /**
       * Lists the active folders that can be mentioned (`{{folderMention:folderId}}`) in a chat.
       * What is returned depends on the chat: project and asset topic chats return the
       * project's folders at the chat's visibility; project-scoped member chats return
       * all of the project's folders; submission chats return the project's
       * reviewer-visibility folders; AI chats return the topic project's folders filtered
       * to the caller's own visibility tiers; workspace/social member chats return an
       * empty list. Requires read access to the chat (`canGetChatMentionableFolders`).
       * Defaults to index pagination (`page`, `limit` max 100, sort `{ name: 1 }`); pass
       * `paginate: 'cursor'` for cursor pagination. `startAt` / `includeStartAtRecord`
       * are not accepted here.
       * @param {string} chatId - The ID of the chat.
       * @param {GetMentionableFoldersParams} [params] - See GetMentionableFoldersParams. `nameSearch` is a case-insensitive partial match.
       * @returns {Promise<PaginatedResponse<Folder>>} A paginated list of folders.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async getMentionableFolders(chatId, params) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/${chatId}/mentionable/folders`,
          params,
          sendJWT: true
        });
      },
      // --- Mentionable Submissions ---
      /**
       * Lists the active submissions in a chat's project that can be mentioned
       * (`{{submissionMention:submissionId}}`).
       * The project is resolved from the chat (project/asset/task topic chats,
       * project-scoped member chats, submission chats and project-scoped AI chats); chats
       * without a project return an empty page. Requires read access to the chat
       * (`canGetChatMentionableSubmissions`). Index pagination only (`page`, `limit` max
       * 100, sort `{ createdAt: -1 }`, also sortable by `subject` and `lastMessageAt`);
       * cursor-pagination params cause a 400.
       * @param {string} chatId - The ID of the chat.
       * @param {GetMentionableSubmissionsParams} [params] - See GetMentionableSubmissionsParams. `nameSearch` is a case-insensitive partial match on the subject.
       * @returns {Promise<PaginatedResponse<MentionableSubmission>>} A paginated list of submissions.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async getMentionableSubmissions(chatId, params) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/${chatId}/mentionable/submissions`,
          params,
          sendJWT: true
        });
      },
      // --- Mentionable Public collections ---
      /**
       * Lists the active public releases (share links) owned by a chat's project that can
       * be mentioned (`{{publicMention:token}}`).
       * The project is resolved from the chat exactly as for `getMentionableSubmissions`;
       * chats without a project return an empty page. Requires read access to the chat
       * (`canGetChatMentionablePublics`). Index pagination only (`page`, `limit` max 100,
       * sort `{ createdAt: -1 }`, also sortable by `title` and `expires`);
       * cursor-pagination params cause a 400.
       * @param {string} chatId - The ID of the chat.
       * @param {GetMentionablePublicsParams} [params] - See GetMentionablePublicsParams. `nameSearch` is a case-insensitive partial match on the title.
       * @returns {Promise<PaginatedResponse<MentionablePublic>>} A paginated list of public releases; use each entry's `token` in the mention.
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async getMentionablePublics(chatId, params) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/${chatId}/mentionable/publics`,
          params,
          sendJWT: true
        });
      },
      // --- Mentionable Tasks (boards addon required) ---
      /**
       * Lists the board tasks that can be mentioned (`{{taskMention:taskId}}`) in a chat.
       * Requires the workspace to have the `boards` capability (`capabilityNotAvailable`
       * / 403 otherwise) and read access to the chat (`canGetChatMentionableTasks`).
       * Project, asset and task topic chats return tasks in the project on boards whose
       * visibility includes the chat's; project-scoped member chats return every board
       * task in the project; submission chats return tasks on reviewer-visible boards;
       * workspace/social member chats return an empty list. Legacy tasks without a board
       * are never returned. Defaults to index pagination (`page`, `limit` max 100, sort
       * `{ updatedAt: -1 }`); pass `paginate: 'cursor'` for cursor pagination.
       * @param {string} chatId - The ID of the chat.
       * @param {GetMentionableTasksParams} [params] - See GetMentionableTasksParams. `nameSearch` matches a subject substring, an exact task number or an exact task ID.
       * @returns {Promise<PaginatedResponse<any>>} A paginated list of task summaries (`id`, `subject`, `taskNumber`, `status`, `projectId`, `boardId`, `assignedToId`, `createdAt`, `updatedAt`).
       * @throws {Error} 'chatId is required.' when `chatId` is falsy.
       */
      async getMentionableTasks(chatId, params) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/${chatId}/mentionable/tasks`,
          params,
          sendJWT: true
        });
      },
      // --- Highlighting ---
      /**
       * Highlights a message, recording the caller as the highlighter.
       * In topic and submission chats this requires `canHighlightMessage` on the chat; in
       * member chats any member may highlight. For project and asset topic chats a system
       * message is posted in the project chat of the same visibility, a
       * `chatHighlightMessage` notification is sent and project members are emailed.
       * @param {string} messageId - The ID of the message.
       * @returns {Promise<ChatMessageResponse>} The highlighted message.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async highlightMessage(messageId) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/chats/message/${messageId}/highlight`,
          sendJWT: true
        });
      },
      /**
       * Removes the highlight from a message.
       * Clears the highlighter fields and removes the associated system messages and
       * notification. Same permission as `highlightMessage`.
       * @param {string} messageId - The ID of the message.
       * @returns {Promise<ChatMessageResponse>} The unhighlighted message.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async unhighlightMessage(messageId) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/chats/message/${messageId}/unhighlight`,
          sendJWT: true
        });
      },
      // --- Short Links ---
      /**
       * Creates a short link for a chat message, or returns the existing one if the
       * message already has a short link.
       * Visibility is inherited from the parent chat (`creator` / `reviewer` for topic
       * chats, `null` for member chats). Requires read access to the message's chat
       * (`canCreateMessageShortLink`).
       * @param {string} messageId - The ID of the message.
       * @returns {Promise<{ code: string; shortUrl: string }>} The 8-character alphanumeric `code` and the complete `shortUrl`.
       * @throws {Error} 'messageId is required.' when `messageId` is falsy.
       */
      async createMessageShortLink(messageId) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/chats/message/${messageId}/shortlink`,
          sendJWT: true
        });
      },
      // --- Link Previews ---
      /**
       * Fetches Open Graph / meta-tag preview data for one to five URLs.
       * Each preview carries an HMAC-SHA256 `signature` that must be passed back
       * unchanged in `linkPreviews` when creating or revising a message, as the API
       * verifies it to reject spoofed previews. Duplicate URLs are collapsed and URLs
       * that fail validation, fetching or SSRF checks are omitted, so `previews` may be
       * shorter than `urls`. Rate limited to 30 requests per minute per IP.
       * @param {FetchLinkPreviewsData} data - `urls`: 1-5 absolute http(s) URLs, each at most 2048 characters.
       * @returns {Promise<LinkPreviewResponse>} `{ previews }`.
       */
      async fetchLinkPreviews(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/link-preview",
          body: data,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/folder.ts
  function createFolderMethods(client) {
    return {
      /** Fetch a single folder by id. */
      async getFolder(folderId) {
        if (!folderId) throw new Error("folderId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/folders/${folderId}`,
          sendJWT: true
        });
      },
      /**
       * Updates a folder's name and/or color.
       * @param {string} folderId - The ID of the folder to update.
       * @param {UpdateFolderData} data - Data containing the name and/or color to update.
       * @returns {Promise<FolderResponse>} The updated folder object.
       */
      async updateFolder(folderId, data) {
        if (!folderId) throw new Error("folderId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/folders/${folderId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Updates a folder's icon.
       * @param {string} folderId - The ID of the folder to update.
       * @param {UpdateFolderIconData} data - Icon file data including name, checksum, and size.
       * @returns {Promise<any>} Object containing the updated folder and signed upload URLs.
       */
      async updateFolderIcon(folderId, data) {
        if (!folderId) throw new Error("folderId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/folders/${folderId}/icon`,
          body: data,
          sendJWT: true
        });
      },
      /** List the assets that live directly inside a folder (does not recurse). */
      async getFoldersAssets(folderId, params) {
        if (!folderId) throw new Error("folderId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/folders/${folderId}/assets`,
          params,
          sendJWT: true
        });
      },
      /**
       * Tags a folder with a specific tag.
       * @param {string} folderId - The ID of the folder to tag.
       * @param {TagFolderData} tagData - Data containing the tag ID.
       * @returns {Promise<FolderResponse>} The updated folder object.
       */
      async tagFolder(folderId, tagData) {
        if (!folderId) throw new Error("folderId is required.");
        if (!tagData.tagId) throw new Error("tagId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/folders/${folderId}/tag`,
          body: tagData,
          sendJWT: true
        });
      },
      /**
       * Untags a folder by removing a specific tag.
       * @param {string} folderId - The ID of the folder to untag.
       * @param {UntagFolderData} untagData - Data containing the tag ID to remove.
       * @returns {Promise<FolderResponse>} The updated folder object.
       */
      async untagFolder(folderId, untagData) {
        if (!folderId) throw new Error("folderId is required.");
        if (!untagData.tagId) throw new Error("tagId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/folders/${folderId}/untag`,
          body: untagData,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/invite.ts
  function createInviteMethods(client) {
    return {
      /**
       * Invite a user (by email) to a workspace or project at a given role.
       * Triggers an invitation email; the recipient accepts via the link.
       */
      async inviteUser(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/invites",
          body: data,
          sendJWT: true
        });
      },
      /** List invites the current user has issued (pending, accepted, expired). */
      async getInvites(params) {
        return client._request({
          method: "GET",
          endpoint: "/v1/invites",
          params,
          sendJWT: true
        });
      },
      /**
       * Look up an invite by id. Public — no auth — so the recipient can
       * preview the invite (target resource, role, inviter) before signing
       * up or logging in.
       */
      async getInviteById(inviteId) {
        if (!inviteId) throw new Error("inviteId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/invites/${inviteId}`,
          sendJWT: false
          // Public route - no authentication required
        });
      },
      /** Revoke a pending invite. */
      async cancelInvite(inviteId) {
        if (!inviteId) throw new Error("inviteId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/invites/${inviteId}`,
          sendJWT: true
        });
      },
      /** List pending invites attached to a workspace or project resource. */
      async getInvitesForResource(resourceId, params) {
        if (!resourceId) throw new Error("resourceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/invites/resource/${resourceId}`,
          params,
          sendJWT: true
        });
      },
      /** Accept an invite for the authenticated user. Creates the membership. */
      async acceptInvite(inviteId) {
        if (!inviteId) throw new Error("inviteId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/invites/accept/${inviteId}`,
          sendJWT: true
        });
      },
      /** Re-send a pending invite email (does not extend or reissue the token). */
      async resendInvite(inviteId) {
        if (!inviteId) throw new Error("inviteId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/invites/resend/${inviteId}`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/joinLink.ts
  function createJoinLinkMethods(client) {
    return {
      /** Create a join link for a project. */
      async createJoinLink(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/join-links",
          body: data,
          sendJWT: true
        });
      },
      /** List a project's join links. */
      async getJoinLinks(params) {
        if (!params?.projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: "/v1/join-links",
          params,
          sendJWT: true
        });
      },
      /** Update a join link's settings (role, mode, domains, expiry, enable/disable). */
      async updateJoinLink(linkId, data) {
        if (!linkId) throw new Error("linkId is required.");
        return client._request({
          method: "PATCH",
          endpoint: `/v1/join-links/${linkId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Rotate a link's token, invalidating the old URL. Optionally reset expiry.
       * Existing memberships are untouched.
       */
      async rollJoinLink(linkId, expiresAt) {
        if (!linkId) throw new Error("linkId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/join-links/${linkId}/roll`,
          body: expiresAt !== void 0 ? { expiresAt } : {},
          sendJWT: true
        });
      },
      /**
       * Public preview of a join link by token — no auth — so the join landing
       * page can show "Join <project>" before the visitor signs in.
       */
      async getJoinByToken(token) {
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/join/${token}`,
          sendJWT: false
          // Public route - no authentication required
        });
      },
      /** Redeem a join link for the authenticated user. */
      async joinByToken(token) {
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/join/${token}`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/membership.ts
  function createMembershipMethods(client) {
    return {
      /**
           * Retrieves the membership records for the currently authenticated user.
           * @returns {Promise<MembershipResponse[]>} An array of the user's membership records.
           */
      async getMyMemberships() {
        return client._request({
          method: "GET",
          endpoint: "/v1/memberships/",
          sendJWT: true
        });
      },
      /**
           * Retrieves memberships associated with a specific workspace.
           * Requires permission to get workspace members.
           * @param {string} workspaceId - The ID of the workspace.
           * @param {GetWorkspaceMembershipParams} [params] - Query parameters for pagination, sorting, filtering.
           * @returns {Promise<PaginatedMembershipResponse>} Paginated list of workspace memberships.
           */
      async getWorkspaceMemberships(workspaceId, params) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/memberships/workspace/${workspaceId}`,
          params,
          sendJWT: true
        });
      },
      /**
           * Retrieves memberships associated with a specific project.
           * Requires permission based on user's role in the project/workspace.
           * @param {string} projectId - The ID of the project.
           * @param {GetProjectMembershipParams} [params] - Query parameters for pagination, sorting, filtering.
           * @returns {Promise<PaginatedMembershipResponse>} Paginated list of project memberships.
           */
      async getProjectMemberships(projectId, params) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/memberships/project/${projectId}`,
          params,
          sendJWT: true
        });
      },
      /**
           * Deletes a specific membership record by its ID.
           * Requires specific permissions to delete others' memberships.
           * @param {string} membershipId - The ID of the membership record to delete.
           * @returns {Promise<void>} 
           */
      async deleteMembership(membershipId) {
        if (!membershipId) throw new Error("membershipId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/memberships/${membershipId}`,
          sendJWT: true
        });
      },
      /**
           * Allows the authenticated user to leave a resource (delete their own membership).
           * Cannot be used to remove ownership roles.
           * @param {string} resourceId - The ID of the resource (workspace or project) to leave.
           * @returns {Promise<void>} 
           */
      async leaveResource(resourceId) {
        if (!resourceId) throw new Error("resourceId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/memberships/leave/${resourceId}`,
          sendJWT: true
        });
      },
      /**
           * Adds a role to an existing membership record.
           * Requires permission to add roles.
           * @param {AddRemoveRoleData} data - Object containing membershipId and the role to add.
           * @returns {Promise<MembershipResponse>} The updated membership object.
           */
      async addRole(data) {
        if (!data || !data.membershipId || !data.role) {
          throw new Error("membershipId and role are required.");
        }
        return client._request({
          method: "POST",
          endpoint: "/v1/memberships/add-role",
          body: data,
          sendJWT: true
        });
      },
      /**
           * Removes a role from an existing membership record.
           * Requires permission to remove roles. Cannot remove ownership roles.
           * @param {AddRemoveRoleData} data - Object containing membershipId and the role to remove.
           * @returns {Promise<MembershipResponse>} The updated membership object.
           */
      async removeRole(data) {
        if (!data || !data.membershipId || !data.role) {
          throw new Error("membershipId and role are required.");
        }
        return client._request({
          method: "POST",
          endpoint: "/v1/memberships/remove-role",
          body: data,
          sendJWT: true
        });
      },
      /**
           * Retrieves a list of users mentionable within a project based on visibility.
           * Requires permission to get mentionable users.
           * @param {string} projectId - The ID of the project.
           * @param {'creator' | 'reviewer' | 'all'} visibility - The visibility scope. Pass 'all' to get users from both creator and reviewer visibilities (e.g. for boards visible to both).
           * @returns {Promise<MentionableUserResponse[]>} An array of mentionable user objects.
           */
      async getProjectMentionableUsers(projectId, visibility) {
        if (!projectId) throw new Error("projectId is required.");
        if (!visibility) throw new Error("visibility is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/memberships/mentionable/project/${projectId}/${visibility}`,
          sendJWT: true
        });
      },
      /**
           * Retrieves resource-specific last seen timestamps for multiple users in a workspace.
           * Requires permission to get workspace members.
           * @param {string} workspaceId - The ID of the workspace.
           * @param {GetLastSeenData} data - Object containing array of user IDs (1-100).
           * @returns {Promise<GetLastSeenResponse>} Object with results array containing last seen data.
           */
      async getWorkspaceLastSeen(workspaceId, data) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!data || !data.userIds || !Array.isArray(data.userIds) || data.userIds.length === 0) {
          throw new Error("userIds array is required and must contain at least one user ID.");
        }
        if (data.userIds.length > 100) {
          throw new Error("userIds array cannot contain more than 100 user IDs.");
        }
        return client._request({
          method: "POST",
          endpoint: `/v1/memberships/workspace/${workspaceId}/last-seen`,
          body: data,
          sendJWT: true
        });
      },
      /**
           * Retrieves resource-specific last seen timestamps for multiple users in a project.
           * Requires permission to get project members.
           * @param {string} projectId - The ID of the project.
           * @param {GetLastSeenData} data - Object containing array of user IDs (1-100).
           * @returns {Promise<GetLastSeenResponse>} Object with results array containing last seen data.
           */
      async getProjectLastSeen(projectId, data) {
        if (!projectId) throw new Error("projectId is required.");
        if (!data || !data.userIds || !Array.isArray(data.userIds) || data.userIds.length === 0) {
          throw new Error("userIds array is required and must contain at least one user ID.");
        }
        if (data.userIds.length > 100) {
          throw new Error("userIds array cannot contain more than 100 user IDs.");
        }
        return client._request({
          method: "POST",
          endpoint: `/v1/memberships/project/${projectId}/last-seen`,
          body: data,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/notification.ts
  function createNotificationMethods(client) {
    return {
      /**
           * Retrieves notifications for specified channels, with optional filtering and pagination.
           * @param {GetNotificationsData} data - Request body containing channels, types, and pagination/sorting options.
           * @returns {Promise<PaginatedNotificationResponse>} Paginated list of notifications.
           */
      async getNotifications(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/notifications/",
          body: data,
          sendJWT: true
        });
      },
      /**
           * Retrieves new notifications since the user's last viewed timestamp for the specified channels.
           * Optionally updates the last viewed timestamp.
           * @param {GetNewNotificationsData} data - Request body containing channels, types, pagination, and update flag.
           * @returns {Promise<PaginatedNotificationResponse>} Paginated list of new notifications.
           */
      async getNewNotifications(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/notifications/new",
          body: data,
          sendJWT: true
        });
      },
      /**
           * Gets the count of new (unread) notifications for the specified channels.
           * @param {GetNewNotificationCountData} data - Request body containing channels and optional types.
           * @returns {Promise<NotificationCountResponse>} Object containing the count of new notifications.
           */
      async getNewNotificationCount(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/notifications/count",
          body: data,
          sendJWT: true
        });
      },
      /**
           * Gets the count of new notifications for multiple channel/type queries in a single request.
           * @param {GetNewNotificationCountBulkData} data - Request body containing an array of channel queries.
           * @returns {Promise<NotificationCountBulkResponse>} Array of objects, each containing channels, types (if provided), and count.
           */
      async getNewNotificationCountBulk(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/notifications/count/bulk",
          body: data,
          sendJWT: true
        });
      },
      /**
           * Retrieves the last seen timestamp record for the specified channels and optional types.
           * @param {GetUsersLastNotificationsSeenData} data - Request body containing channels and optional types.
           * @returns {Promise<LastSeenResponse>} The last seen record object.
           */
      async getUsersLastNotificationsSeen(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/notifications/last-seen",
          body: data,
          sendJWT: true
        });
      },
      /**
           * Updates (or creates) the last seen timestamp for the user for the specified channels and optional types.
           * @param {UpdateUsersLastSeenData} data - Request body containing channels and optional types.
           * @returns {Promise<LastSeenResponse>} The updated (or created) last seen record object.
           */
      async updateUsersLastSeen(data) {
        return client._request({
          method: "PUT",
          endpoint: "/v1/notifications/last-seen",
          body: data,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/payment.ts
  function createPaymentMethods(client) {
    return {
      /**
       * Create a Stripe subscription checkout session.
       * Requires authentication and permission.
       * @param {StripeCheckoutRequest} checkoutData - The checkout request data.
       * @returns {Promise<StripeCheckoutResponse>} Object containing the Stripe checkout session URL.
       */
      async createStripeCheckout(checkoutData) {
        if (!checkoutData.resourceId) throw new Error("resourceId is required.");
        if (!checkoutData.productId) throw new Error("productId is required.");
        if (!checkoutData.currency) throw new Error("currency is required.");
        if (!checkoutData.billingPeriod) throw new Error("billingPeriod is required.");
        return client._request({
          method: "POST",
          endpoint: "/v1/payments/stripe/checkout",
          body: checkoutData,
          sendJWT: true
        });
      },
      /**
       * Create a manual subscription without Stripe processing.
       * Requires authentication and permission.
       * @param {ManualCheckoutRequest} checkoutData - The manual checkout request data.
       * @returns {Promise<any>} The created subscription object.
       */
      async createManualCheckout(checkoutData) {
        if (!checkoutData.resourceId) throw new Error("resourceId is required.");
        if (!checkoutData.productId) throw new Error("productId is required.");
        if (!checkoutData.currency) throw new Error("currency is required.");
        if (!checkoutData.billingPeriod) throw new Error("billingPeriod is required.");
        return client._request({
          method: "POST",
          endpoint: "/v1/payments/manual/checkout",
          body: checkoutData,
          sendJWT: true
        });
      },
      /**
       * Create a new Stripe customer for the authenticated user.
       * Requires authentication and permission.
       * @returns {Promise<StripeCustomerResponse>} Object containing the Stripe customer ID.
       */
      async createStripeCustomer() {
        return client._request({
          method: "POST",
          endpoint: "/v1/payments/stripe/customer",
          sendJWT: true
        });
      },
      /**
       * Generate a URL for the Stripe customer portal for subscription management.
       * Requires authentication and permission.
       * @returns {Promise<StripePortalResponse>} Object containing the Stripe portal session URL.
       */
      async getStripePortalUrl() {
        return client._request({
          method: "GET",
          endpoint: "/v1/payments/stripe/portal",
          sendJWT: true
        });
      }
    };
  }

  // src/routes/product.ts
  function createProductMethods(client) {
    return {
      /**
       * Retrieves available products for a specific workspace, considering restrictions.
       * Requires authentication and permission.
       * @param {string} workspaceId - The ID of the workspace.
       * @param {GetWorkspaceProductsParams} [params] - Optional query parameters.
       * @returns {Promise<ProductResponse[]>} An array of available product objects.
       */
      async getWorkspaceProducts(workspaceId, params) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/products/workspace/${workspaceId}`,
          params,
          sendJWT: true
        });
      },
      /**
       * List active starter-package "plans" available to the caller,
       * scoped by user-level restrictions but NOT bound to a workspace.
       * Used by the post-signup plan-selection overlay before any
       * workspace exists.
       * @returns {Promise<ProductResponse[]>} Active starter-package plans.
       */
      async listPlans() {
        return client._request({
          method: "GET",
          endpoint: "/v1/products/plans",
          sendJWT: true
        });
      },
      /**
       * Suggested billing currency for the caller, derived server-side from
       * the CDN geo header. A *default* for the currency selector only — the
       * user can override. Falls back to `usd` with no geo header.
       */
      async getSuggestedCurrency() {
        return client._request({
          method: "GET",
          endpoint: "/v1/products/suggested-currency",
          sendJWT: true
        });
      }
    };
  }

  // src/routes/socket.ts
  var LIFECYCLE_LISTENER_EVENTS = /* @__PURE__ */ new Set([
    "disconnect",
    "tokenExpired",
    "tokenBlacklisted",
    "reconnect_failed",
    "reconnect"
  ]);
  function createSocketMethods(client) {
    const activeConnections = {};
    const debug = client.debug;
    const _log = (...args) => {
      if (debug) {
        console.log("[SOCKET]", ...args);
      }
    };
    const getSocketIO = async () => {
      try {
        const socketModule = await Promise.resolve().then(() => (init_esm5(), esm_exports2));
        return socketModule.default || socketModule;
      } catch (error) {
        throw new Error("socket.io-client is not installed. Please install it with: npm install socket.io-client");
      }
    };
    const getAuthToken = () => {
      return client._apiKey || client._getAccessToken();
    };
    const isApiKeyMode = () => Boolean(client._apiKey);
    const getWebSocketURL = (connectionOptions) => {
      if (connectionOptions?.websocketURL) {
        return connectionOptions.websocketURL;
      }
      if (client.websocketURL) {
        return client.websocketURL;
      }
      return client.baseURL;
    };
    const connect = async (channel, options = {}) => {
      _log(`Connecting to channel: ${channel}`);
      const socketOptions = {
        autoRefresh: true,
        autoReconnect: true,
        autoReconnectOnTokenExpiry: true,
        debug: client.debug,
        ...options
      };
      if (activeConnections[channel]) {
        _log(`Already connected to channel: ${channel}`);
        return activeConnections[channel];
      }
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required. Please login first.");
      }
      const wsUrl = getWebSocketURL(options);
      _log(`Using Socket.IO URL: ${wsUrl}`);
      const io = await getSocketIO();
      const socket = io(`${wsUrl}${channel}`, {
        query: { token },
        // Reconnection configuration for resilience
        reconnection: socketOptions.autoReconnect,
        reconnectionAttempts: 10,
        // Maximum reconnection attempts before giving up
        reconnectionDelay: 1e3,
        // Start with 1 second delay
        reconnectionDelayMax: 3e4,
        // Max delay of 30 seconds between attempts
        randomizationFactor: 0.5,
        // Add jitter to avoid thundering herd problem
        // Connection timeout
        timeout: 2e4,
        // 20 seconds to establish initial connection
        // Transport configuration
        transports: ["websocket", "polling"],
        // Prefer WebSocket, fallback to polling
        upgrade: true,
        // Allow transport upgrade
        rememberUpgrade: true,
        // Remember successful upgrade
        // Ping/pong for connection health
        forceNew: false
        // Reuse existing connection if available
      });
      const socketChannel = {
        socket,
        channel,
        listeners: {}
      };
      activeConnections[channel] = socketChannel;
      return new Promise((resolve, reject) => {
        let settled = false;
        socket.on("connect", () => {
          _log(`Connected to channel: ${channel}`);
          activeConnections[channel] = socketChannel;
          if (!settled) {
            settled = true;
            resolve(socketChannel);
          }
        });
        socket.on("connect_error", (error) => {
          _log(`Connection error for channel ${channel}:`, error);
          if (!settled) {
            settled = true;
            resolve(socketChannel);
          }
        });
        socket.on("reconnect_attempt", (attempt) => {
          _log(`Reconnection attempt ${attempt} for channel: ${channel}`);
        });
        socket.on("reconnect", (attempt) => {
          _log(`Reconnected to channel ${channel} after ${attempt} attempts`);
          activeConnections[channel] = socketChannel;
          const reconnectListeners = socketChannel.listeners["reconnect"] || /* @__PURE__ */ new Set();
          reconnectListeners.forEach((listener) => listener({ type: "reconnect", attempt }));
        });
        socket.on("reconnect_failed", () => {
          _log(`Reconnection failed for channel ${channel} after maximum attempts`);
          const eventListeners = socketChannel.listeners["reconnect_failed"] || /* @__PURE__ */ new Set();
          eventListeners.forEach((listener) => listener({ type: "reconnect_failed" }));
          if (!settled) {
            settled = true;
            reject(new Error(`Connection to ${channel} failed after maximum reconnection attempts`));
          }
        });
        socket.on("tokenEvent", (event) => {
          _log(`Token event on channel ${channel}:`, event);
          if (event === "TokenExpired" && socketOptions.autoReconnectOnTokenExpiry) {
            if (isApiKeyMode()) {
              _log("Token expired event in API key mode \u2014 disconnecting (no refresh path)");
              disconnect(channel);
              const eventListeners = socketChannel.listeners["tokenExpired"] || /* @__PURE__ */ new Set();
              eventListeners.forEach((listener) => listener({ type: "tokenExpired" }));
              return;
            }
            _log("Token expired, attempting to refresh and reconnect");
            client._refreshToken().then(() => {
              _log("Token refreshed, reconnecting");
              const preservedListeners = socketChannel.listeners;
              disconnect(channel).then(() => connect(channel, options)).then((newConnection) => {
                Object.entries(preservedListeners).forEach(([listenerEvent, callbacks]) => {
                  callbacks.forEach((callback) => {
                    if (LIFECYCLE_LISTENER_EVENTS.has(listenerEvent)) {
                      if (!newConnection.listeners[listenerEvent]) {
                        newConnection.listeners[listenerEvent] = /* @__PURE__ */ new Set();
                      }
                      newConnection.listeners[listenerEvent].add(callback);
                    } else {
                      subscribe(channel, listenerEvent, callback);
                    }
                  });
                });
                (newConnection.listeners["reconnect"] || /* @__PURE__ */ new Set()).forEach((listener) => listener({ type: "reconnect", reason: "tokenRefresh" }));
              }).catch((error) => {
                _log(`Failed to re-establish subscriptions after token refresh on ${channel}:`, error);
              });
            }).catch((error) => {
              _log("Failed to refresh token", error);
              const eventListeners = socketChannel.listeners["tokenExpired"] || /* @__PURE__ */ new Set();
              eventListeners.forEach((listener) => listener({ type: "tokenExpired", error }));
            });
          } else if (event === "tokenBlacklisted") {
            _log("Token blacklisted, disconnecting");
            disconnect(channel);
            const eventListeners = socketChannel.listeners["tokenBlacklisted"] || /* @__PURE__ */ new Set();
            eventListeners.forEach((listener) => listener({ type: "tokenBlacklisted" }));
          }
        });
        socket.on("disconnect", (reason) => {
          _log(`Disconnected from channel ${channel}:`, reason);
          const eventListeners = socketChannel.listeners["disconnect"] || /* @__PURE__ */ new Set();
          eventListeners.forEach((listener) => listener({ type: "disconnect", reason }));
          delete activeConnections[channel];
        });
      });
    };
    const connectPublic = async (publicToken, options = {}) => {
      const channel = `public/${publicToken}`;
      _log(`Connecting to public channel: ${channel}`);
      const socketOptions = {
        autoReconnect: true,
        debug: client.debug,
        ...options
      };
      if (activeConnections[channel]) {
        _log(`Already connected to public channel: ${channel}`);
        return activeConnections[channel];
      }
      const wsUrl = getWebSocketURL(options);
      _log(`Using Socket.IO URL for public connection: ${wsUrl}`);
      const io = await getSocketIO();
      const socket = io(`${wsUrl}${channel}`, {
        query: { publicToken },
        // Reconnection configuration for resilience
        reconnection: socketOptions.autoReconnect,
        reconnectionAttempts: 10,
        reconnectionDelay: 1e3,
        reconnectionDelayMax: 3e4,
        randomizationFactor: 0.5,
        // Connection timeout
        timeout: 2e4,
        // Transport configuration
        transports: ["websocket", "polling"],
        upgrade: true,
        rememberUpgrade: true,
        forceNew: false
      });
      const socketChannel = {
        socket,
        channel,
        listeners: {}
      };
      return new Promise((resolve, reject) => {
        socket.on("connect", () => {
          _log(`Connected to public channel: ${channel}`);
          activeConnections[channel] = socketChannel;
          resolve(socketChannel);
        });
        socket.on("connect_error", (error) => {
          _log(`Connection error for public channel ${channel}:`, error);
          reject(error);
        });
        socket.on("reconnect_attempt", (attempt) => {
          _log(`Reconnection attempt ${attempt} for public channel: ${channel}`);
        });
        socket.on("reconnect", (attempt) => {
          _log(`Reconnected to public channel ${channel} after ${attempt} attempts`);
        });
        socket.on("reconnect_failed", () => {
          _log(`Reconnection failed for public channel ${channel} after maximum attempts`);
          const eventListeners = socketChannel.listeners["reconnect_failed"] || /* @__PURE__ */ new Set();
          eventListeners.forEach((listener) => listener({ type: "reconnect_failed" }));
        });
        socket.on("disconnect", (reason) => {
          _log(`Disconnected from public channel ${channel}:`, reason);
          const eventListeners = socketChannel.listeners["disconnect"] || /* @__PURE__ */ new Set();
          eventListeners.forEach((listener) => listener({ type: "disconnect", reason }));
          delete activeConnections[channel];
        });
      });
    };
    const disconnect = async (channel) => {
      const connection = activeConnections[channel];
      if (connection) {
        _log(`Disconnecting from channel: ${channel}`);
        connection.socket.disconnect();
        delete activeConnections[channel];
      }
    };
    const subscribe = async (channel, event, callback) => {
      let connection = activeConnections[channel];
      if (!connection) {
        connection = await connect(channel);
      }
      if (!connection.listeners[event]) {
        connection.listeners[event] = /* @__PURE__ */ new Set();
        connection.socket.on(event, (eventData) => {
          _log(`Received event '${event}' on channel ${channel}:`, eventData);
          const eventListeners = connection.listeners[event] || /* @__PURE__ */ new Set();
          eventListeners.forEach((listener) => listener(eventData));
        });
      }
      connection.listeners[event].add(callback);
      _log(`Subscribed to event '${event}' on channel ${channel}`);
    };
    const subscribePublic = async (publicToken, event, callback) => {
      const channel = `public/${publicToken}`;
      let connection = activeConnections[channel];
      if (!connection) {
        connection = await connectPublic(publicToken);
      }
      if (!connection.listeners[event]) {
        connection.listeners[event] = /* @__PURE__ */ new Set();
        connection.socket.on(event, (eventData) => {
          _log(`Received event '${event}' on public channel ${channel}:`, eventData);
          const eventListeners = connection.listeners[event] || /* @__PURE__ */ new Set();
          eventListeners.forEach((listener) => listener(eventData));
        });
      }
      connection.listeners[event].add(callback);
      _log(`Subscribed to event '${event}' on public channel ${channel}`);
    };
    const unsubscribe = (channel, event, callback) => {
      const connection = activeConnections[channel];
      if (!connection || !connection.listeners[event]) {
        return;
      }
      if (callback) {
        connection.listeners[event].delete(callback);
        _log(`Unsubscribed specific callback from event '${event}' on channel ${channel}`);
      } else {
        connection.listeners[event].clear();
        connection.socket.off(event);
        _log(`Unsubscribed all callbacks from event '${event}' on channel ${channel}`);
      }
    };
    const isConnected = (channel) => {
      return !!activeConnections[channel]?.socket.connected;
    };
    const emit = (channel, event, data) => {
      const connection = activeConnections[channel];
      if (!connection?.socket.connected) {
        _log(`Cannot emit to channel ${channel}: not connected`);
        return;
      }
      _log(`Emitting '${event}' on channel ${channel}`);
      connection.socket.emit(event, data);
    };
    const emitWithAck = (channel, event, data, timeoutMs) => {
      const connection = activeConnections[channel];
      if (!connection) return Promise.resolve(false);
      return new Promise((resolve) => {
        try {
          connection.socket.timeout(timeoutMs).emit(event, data, (err) => {
            resolve(!err);
          });
        } catch (error) {
          _log(`emitWithAck error on channel ${channel}:`, error);
          resolve(false);
        }
      });
    };
    const disconnectAll = async () => {
      _log("Disconnecting from all channels");
      const channels = Object.keys(activeConnections);
      for (const channel of channels) {
        await disconnect(channel);
      }
    };
    const onReconnectFailed = (channel, callback) => {
      const connection = activeConnections[channel];
      if (connection) {
        if (!connection.listeners["reconnect_failed"]) {
          connection.listeners["reconnect_failed"] = /* @__PURE__ */ new Set();
        }
        connection.listeners["reconnect_failed"].add(callback);
      }
    };
    const onReconnect = (channel, callback) => {
      const connection = activeConnections[channel];
      if (connection) {
        if (!connection.listeners["reconnect"]) {
          connection.listeners["reconnect"] = /* @__PURE__ */ new Set();
        }
        connection.listeners["reconnect"].add(callback);
      }
    };
    return {
      connect,
      connectPublic,
      disconnect,
      disconnectAll,
      subscribe,
      subscribePublic,
      unsubscribe,
      isConnected,
      emit,
      emitWithAck,
      onReconnect,
      onReconnectFailed
    };
  }

  // src/routes/storage.ts
  function createStorageMethods(client) {
    return {
      /**
           * Retrieves storage usage chart data for a specific resource.
           * Requires authentication and permission.
           * @param {ResourceType} resourceType - The type of the resource.
           * @param {string} resourceId - The ID of the resource.
           * @param {GetStorageChartParams} [params] - Optional query parameters for date range and aggregation.
           * @returns {Promise<ChartDataResponse>} An array of chart data entries.
           */
      async getStorageChart(resourceType, resourceId, params) {
        if (!resourceType) throw new Error("resourceType is required.");
        if (!resourceId) throw new Error("resourceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/storage/chart/${resourceType}/${resourceId}`,
          params,
          sendJWT: true
        });
      },
      /**
           * Retrieves the latest storage record for a specific resource.
           * Requires authentication and permission.
           * @param {ResourceType} resourceType - The type of the resource.
           * @param {string} resourceId - The ID of the resource.
           * @returns {Promise<StorageRecord>} The latest storage record for the resource.
           */
      async getStorageRecord(resourceType, resourceId) {
        if (!resourceType) throw new Error("resourceType is required.");
        if (!resourceId) throw new Error("resourceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/storage/${resourceType}/${resourceId}`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/task.ts
  function createTaskMethods(client) {
    return {
      /**
           * Retrieves tasks assigned to the currently authenticated user.
           * Supports filtering, sorting, and both index and cursor pagination.
           * @param {GetTasksParams} [params] - Optional query parameters for filtering, sorting, and pagination.
           * @returns {Promise<GetTasksResponse>} Paginated list of tasks.
           */
      async getMyTasks(params) {
        return client._request({
          method: "GET",
          endpoint: "/v1/tasks/",
          params,
          sendJWT: true
        });
      },
      /**
       * Bulk-create one or more tasks under a single project — single
       * round-trip replacement for the per-draft create loop the
       * EnhancedTaskCreatorModal used to drive. Per-task partial success
       * is returned in `results[]`; if `announce` is set and at least
       * one task creates, the server also posts a Nu reply linking the
       * new tasks back to the source message and rendering them as
       * inline taskCards.
       */
      async bulkCreate(data) {
        if (!data?.projectId) throw new Error("projectId is required.");
        if (!Array.isArray(data?.tasks) || data.tasks.length === 0) {
          throw new Error("tasks is required and must contain at least one draft.");
        }
        return client._request({
          method: "POST",
          endpoint: "/v1/tasks/bulk-create",
          body: data,
          sendJWT: true
        });
      },
      /**
           * Updates the status of a specific task.
           * Requires authentication and permission.
           * @param {string} taskId - The ID of the task to update.
           * @param {UpdateTaskStatusData} data - The new status for the task.
           * @returns {Promise<Task>} The updated task object.
           */
      async updateTaskStatus(taskId, data) {
        if (!taskId) throw new Error("taskId is required.");
        if (!data || !data.status) throw new Error("status is required in the request body.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/tasks/${taskId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
           * Toggles the acknowledgement status of a specific task.
           * Requires authentication and permission.
           * @param {string} taskId - The ID of the task to acknowledge/unacknowledge.
           * @returns {Promise<Task>} The updated task object with the new acknowledgement status.
           */
      async acknowledgeTask(taskId) {
        if (!taskId) throw new Error("taskId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/tasks/acknowledge/${taskId}`,
          sendJWT: true
        });
      },
      /**
           * Retrieves the count of unacknowledged tasks for the current user within a specific project.
           * Requires authentication.
           * @param {string} projectId - The ID of the project.
           * @returns {Promise<UnacknowledgedTaskCountResponse>} An object containing total, creator, and reviewer unacknowledged task counts.
           */
      async getUnacknowledgedTaskCount(projectId) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/tasks/unacknowledged/${projectId}`,
          sendJWT: true
        });
      },
      /**
           * Acknowledge every unacknowledged mention-task the current user has in a
           * project. Idempotent server-side.
           * @param {string} projectId - The ID of the project.
           * @returns {Promise<AcknowledgeAllTasksResponse>} The number acknowledged and the remaining unacknowledged count.
           */
      async acknowledgeAllTasks(projectId) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/tasks/acknowledge-all/${projectId}`,
          sendJWT: true
        });
      },
      /**
       * Add the calling user to a task's `followers` list.
       * Idempotent server-side — following an already-followed task is a no-op
       * and still returns the current task.
       * @param taskId - The ID of the task to follow.
       * @returns The updated task with the new followers array.
       */
      async followTask(taskId) {
        if (!taskId) throw new Error("taskId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/tasks/${taskId}/follow`,
          sendJWT: true
        });
      },
      /**
       * Remove the calling user from a task's `followers` list.
       * Idempotent server-side — unfollowing a task you don't follow is a
       * no-op and still returns the current task.
       * @param taskId - The ID of the task to unfollow.
       * @returns The updated task with the new followers array.
       */
      async unfollowTask(taskId) {
        if (!taskId) throw new Error("taskId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/tasks/${taskId}/unfollow`,
          sendJWT: true
        });
      },
      /**
       * Permanently delete a task. Gated server-side by
       * `canRemove{Visibility}BoardTask` for at least one of the parent
       * board's visibility tiers (see `boardPermission('Remove', 'BoardTask')`).
       *
       * Returns void; the server responds with 204 No Content.
       *
       * @param taskId - The ID of the task to delete.
       */
      async deleteTask(taskId) {
        if (!taskId) throw new Error("taskId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/tasks/${taskId}`,
          sendJWT: true
        });
      },
      /**
       * Retrieves the event log for a specific task.
       * Returns paginated events in reverse chronological order with populated actor info.
       * @param {string} taskId - The ID of the task.
       * @param {GetTaskEventsParams} [params] - Optional pagination, sort, search, and filter params.
       * @returns {Promise<GetTaskEventsResponse>} Paginated list of task events.
       */
      async getTaskEvents(taskId, params) {
        if (!taskId) throw new Error("taskId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/tasks/${taskId}/events`,
          params,
          sendJWT: true
        });
      },
      // ========================================================================
      // Task details, links and tags
      // ========================================================================
      /**
       * Update a board task's subject, description, assignee or status.
       * Requires the boards capability and board-task write permission.
       * @param {string} taskId - The task ID.
       * @param {UpdateTaskDetailsData} data - Fields to change.
       * @returns {Promise<Task>} The updated task.
       * @throws {Error} 'taskId is required.' when `taskId` is falsy.
       */
      async updateTaskDetails(taskId, data) {
        if (!taskId) throw new Error("taskId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/tasks/${taskId}/details`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Link two tasks with a typed relation (related, blocks, blockedBy, duplicate).
       * The link is symmetrical: both tasks reflect the relationship.
       * @param {string} taskId - The task ID.
       * @param {LinkTaskData} data - `linkedTaskId` and `type`.
       * @returns {Promise<TaskLink>} The created link.
       * @throws {Error} 'taskId is required.' or 'linkedTaskId is required.'.
       */
      async linkTask(taskId, data) {
        if (!taskId) throw new Error("taskId is required.");
        if (!data.linkedTaskId) throw new Error("linkedTaskId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/tasks/${taskId}/links`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Remove a task-to-task link.
       * @param {string} taskId - The task ID.
       * @param {string} linkedTaskId - The other task in the link.
       * @returns {Promise<void>} Resolves once removed.
       * @throws {Error} 'taskId is required.' or 'linkedTaskId is required.'.
       */
      async unlinkTask(taskId, linkedTaskId) {
        if (!taskId) throw new Error("taskId is required.");
        if (!linkedTaskId) throw new Error("linkedTaskId is required.");
        await client._request({
          method: "DELETE",
          endpoint: `/v1/tasks/${taskId}/links/${linkedTaskId}`,
          sendJWT: true
        });
      },
      /**
       * List the tasks linked to a task, with the relation type of each link.
       * @param {string} taskId - The task ID.
       * @returns {Promise<TaskLink[]>} The task's links.
       * @throws {Error} 'taskId is required.' when `taskId` is falsy.
       */
      async getTaskLinks(taskId) {
        if (!taskId) throw new Error("taskId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/tasks/${taskId}/links`,
          sendJWT: true
        });
      },
      /**
       * Attach a project tag to a task.
       * @param {string} taskId - The task ID.
       * @param {string} tagId - The tag ID.
       * @returns {Promise<Task>} The updated task.
       * @throws {Error} 'taskId is required.' or 'tagId is required.'.
       */
      async tagTask(taskId, tagId) {
        if (!taskId) throw new Error("taskId is required.");
        if (!tagId) throw new Error("tagId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/tasks/${taskId}/tag`,
          body: { tagId },
          sendJWT: true
        });
      },
      /**
       * Detach a project tag from a task.
       * @param {string} taskId - The task ID.
       * @param {string} tagId - The tag ID.
       * @returns {Promise<Task>} The updated task.
       * @throws {Error} 'taskId is required.' or 'tagId is required.'.
       */
      async untagTask(taskId, tagId) {
        if (!taskId) throw new Error("taskId is required.");
        if (!tagId) throw new Error("tagId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/tasks/${taskId}/untag`,
          body: { tagId },
          sendJWT: true
        });
      }
    };
  }

  // src/routes/version.ts
  function createVersionMethods(client) {
    return {
      /**
       * Retrieves the latest git commit hash of the deployed application.
       * This is a public endpoint and does not require authentication.
       * @returns {Promise<CommitResponse>} An object containing the buildCommit hash.
       */
      async getCommitHash() {
        return client._request({
          method: "GET",
          endpoint: "/v1/version/commit",
          sendJWT: false
        });
      },
      /**
       * Retrieves the API health report (database connectivity, memory, uptime).
       * Public endpoint. Resolves normally for `healthy` and `degraded`; the API
       * responds 503 for `unhealthy`, which surfaces as a thrown error with `status: 503`
       * and the report on `data`.
       * @returns {Promise<HealthStatus>} The health report.
       */
      async getHealth() {
        return client._request({
          method: "GET",
          endpoint: "/v1/version/health",
          sendJWT: false,
          bypassCache: true
        });
      }
    };
  }

  // src/routes/config.ts
  function createConfigMethods(client) {
    return {
      /**
       * Retrieves the application configuration.
       *
       * @returns {Promise<any>} A promise that resolves with the configuration object.
       * @throws {ApiError} Throws an ApiError if the request fails.
       */
      getConfig: async () => {
        return client._request({
          endpoint: "/v1/config",
          method: "GET",
          sendJWT: false
          // This endpoint does not require authentication
        });
      }
    };
  }

  // src/routes/tag.ts
  function createTagMethods(client) {
    return {
      /**
       * Creates a new tag for a specific resource.
       * @param {CreateTagData} tagData - The tag data to create.
       * @returns {Promise<Tag>} The created tag object.
       */
      async createTag(tagData) {
        if (!tagData.name) throw new Error("Tag name is required.");
        if (!tagData.ownerResourceType) throw new Error("Owner resource type is required.");
        if (!tagData.ownerResourceId) throw new Error("Owner resource ID is required.");
        return client._request({
          method: "POST",
          endpoint: "/v1/tags",
          body: tagData,
          sendJWT: true
        });
      },
      /**
       * Retrieves all tags for a specific resource.
       * @param {TagOwnerResourceType} ownerResourceType - The type of resource to get tags for.
       * @param {string} ownerResourceId - The ID of the resource to get tags for.
       * @param {GetTagsParams} [params] - Optional parameters for filtering and sorting.
       * @returns {Promise<Tags>} Array of tag objects.
       */
      async getTags(ownerResourceType, ownerResourceId, params) {
        if (!ownerResourceType) throw new Error("Owner resource type is required.");
        if (!ownerResourceId) throw new Error("Owner resource ID is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/tags/${ownerResourceType}/${ownerResourceId}`,
          params,
          sendJWT: true
        });
      },
      /**
       * Updates an existing tag.
       * @param {string} tagId - The ID of the tag to update.
       * @param {UpdateTagData} updateData - The data to update.
       * @returns {Promise<Tag>} The updated tag object.
       */
      async updateTag(tagId, updateData) {
        if (!tagId) throw new Error("Tag ID is required.");
        if (!updateData.name && !updateData.color) {
          throw new Error("At least one field (name or color) must be provided for update.");
        }
        return client._request({
          method: "PUT",
          endpoint: `/v1/tags/${tagId}`,
          body: updateData,
          sendJWT: true
        });
      },
      /**
       * Deletes a tag permanently.
       * @param {string} tagId - The ID of the tag to delete.
       * @returns {Promise<Tag>} The deleted tag object.
       */
      async deleteTag(tagId) {
        if (!tagId) throw new Error("Tag ID is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/tags/${tagId}`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/public.ts
  function createPublicMethods(client) {
    return {
      /**
       * Gets public file system details by token.
       * This endpoint does not require authentication - access is controlled by the token.
       * 
       * @param {string} token - The 10-character alphanumeric public access token.
       * @returns {Promise<PublicFileSystemDetailsResponse>} The public file system details.
       * 
       * @example
       * ```typescript
       * const publicFileSystem = await nuramaClient.public.getPublicFileSystem('abc123def4');
       * ```
       */
      async getPublicFileSystem(token) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        return client._request({
          endpoint: `/v1/public/${token}`,
          method: "GET",
          sendJWT: false
          // This is a public endpoint
        });
      },
      /**
       * Gets public items at the root level of a public file system.
       * This endpoint does not require authentication - access is controlled by the token.
       * 
       * @param {string} token - The 10-character alphanumeric public access token.
       * @param {PublicPaginationParams} params - Optional pagination and filtering parameters.
       * @returns {Promise<PublicFileSystemResponse>} Paginated list of public file system items.
       * 
       * @example
       * ```typescript
       * const publicItems = await nuramaClient.public.getPublicItems('abc123def4');
       * ```
       */
      async getPublicItems(token, params) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        const queryParams = params ? {
          ...params,
          resourceIds: Array.isArray(params.resourceIds) ? params.resourceIds : params.resourceIds ? [params.resourceIds] : [],
          resourceSlugs: Array.isArray(params.resourceSlugs) ? params.resourceSlugs : params.resourceSlugs ? [params.resourceSlugs] : [],
          resourceTags: Array.isArray(params.resourceTags) ? params.resourceTags : params.resourceTags ? [params.resourceTags] : [],
          mediaTypes: Array.isArray(params.mediaTypes) ? params.mediaTypes : params.mediaTypes ? [params.mediaTypes] : []
        } : {};
        return client._request({
          endpoint: `/v1/public/${token}/files`,
          method: "GET",
          params: queryParams,
          sendJWT: false
          // This is a public endpoint
        });
      },
      /**
       * Gets public items at a specific path within a public file system.
       * This endpoint does not require authentication - access is controlled by the token.
       * 
       * @param {string} token - The 10-character alphanumeric public access token.
       * @param {string} path - The path within the public file system to retrieve items from.
       * @param {PublicPaginationParams} params - Optional pagination and filtering parameters.
       * @returns {Promise<PublicFileSystemResponse>} Paginated list of public file system items.
       * 
       * @example
       * ```typescript
       * const items = await nuramaClient.public.getPublicItemsAtPath('abc123def4', 'folder1/subfolder');
       * ```
       */
      async getPublicItemsAtPath(token, path, params) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        if (path === null || path === void 0) throw new Error("path is required.");
        const cleanPath = path.startsWith("/") ? path.substring(1) : path;
        const queryParams = params ? {
          ...params,
          resourceIds: Array.isArray(params.resourceIds) ? params.resourceIds : params.resourceIds ? [params.resourceIds] : [],
          resourceSlugs: Array.isArray(params.resourceSlugs) ? params.resourceSlugs : params.resourceSlugs ? [params.resourceSlugs] : [],
          resourceTags: Array.isArray(params.resourceTags) ? params.resourceTags : params.resourceTags ? [params.resourceTags] : [],
          mediaTypes: Array.isArray(params.mediaTypes) ? params.mediaTypes : params.mediaTypes ? [params.mediaTypes] : []
        } : {};
        return client._request({
          endpoint: `/v1/public/${token}/files/${cleanPath}`,
          method: "GET",
          params: queryParams,
          sendJWT: false
          // This is a public endpoint
        });
      },
      /**
       * Downloads public assets by generating signed URLs for the original files.
       * This endpoint does not require authentication - access is controlled by the token.
       * 
       * @param {string} token - The 10-character alphanumeric public access token.
       * @param {DownloadPublicAssetsData} downloadData - The asset IDs to download.
       * @returns {Promise<DownloadSignedUrlData[]>} Array of signed download URLs for the requested assets.
       * 
       * @example
       * ```typescript
       * const downloadUrls = await nuramaClient.public.downloadAssets('abc123def4', {
       *   assetIds: ['507f1f77bcf86cd799439011', '507f191e810c19729de860ea']
       * });
       * ```
       */
      async downloadAssets(token, downloadData) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        if (!downloadData) throw new Error("downloadData is required.");
        if (!downloadData.assetIds || !Array.isArray(downloadData.assetIds) || downloadData.assetIds.length === 0) {
          throw new Error("downloadData.assetIds must be a non-empty array.");
        }
        return client._request({
          endpoint: `/v1/public/${token}/download`,
          method: "POST",
          body: downloadData,
          sendJWT: false
          // This is a public endpoint
        });
      },
      // ============================================================================
      // Public Chat Methods
      // ============================================================================
      /**
       * Gets the main public file system chat or a specific chat by ID.
       * This endpoint does not require authentication for read access.
       *
       * @param {string} token - The 10-character alphanumeric public access token.
       * @param {string} [chatId] - Optional specific chat ID to retrieve.
       * @returns {Promise<Chat | null>} The chat object, or null if no main chat exists yet.
       *
       * @example
       * ```typescript
       * // Get main public file system chat
       * const mainChat = await nuramaClient.public.getPublicChat('abc123def4');
       *
       * // Get specific chat by ID
       * const chat = await nuramaClient.public.getPublicChat('abc123def4', 'chat-id-here');
       * ```
       */
      async getPublicChat(token, chatId) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        const endpoint = chatId ? `/v1/public/${token}/chat/${chatId}` : `/v1/public/${token}/chat`;
        return client._request({
          endpoint,
          method: "GET",
          sendJWT: false
          // Read access is public
        });
      },
      /**
       * Gets paginated messages for a public chat.
       * This endpoint does not require authentication for read access.
       *
       * @param {string} token - The 10-character alphanumeric public access token.
       * @param {string} chatId - The ID of the chat to get messages from.
       * @param {GetPublicChatMessagesParams} [params] - Optional pagination parameters.
       * @returns {Promise<PublicChatMessagesResponse>} Paginated list of chat messages.
       *
       * @example
       * ```typescript
       * const messages = await nuramaClient.public.getPublicChatMessages('abc123def4', 'chat-id', {
       *   limit: 20,
       *   paginateReverse: false,
       * });
       * ```
       */
      async getPublicChatMessages(token, chatId, params) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          endpoint: `/v1/public/${token}/chat/${chatId}/messages`,
          method: "GET",
          params: params || {},
          sendJWT: false
          // Read access is public
        });
      },
      /**
       * Creates a message in an existing public chat.
       * Requires authentication.
       *
       * @param {string} token - The 10-character alphanumeric public access token.
       * @param {string} chatId - The ID of the chat to post to.
       * @param {CreatePublicChatMessageRequest} data - The message data.
       * @returns {Promise<ChatMessage>} The created message.
       *
       * @example
       * ```typescript
       * const message = await nuramaClient.public.createPublicChatMessage('abc123def4', 'chat-id', {
       *   content: 'Hello world!',
       * });
       * ```
       */
      async createPublicChatMessage(token, chatId, data) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        if (!chatId) throw new Error("chatId is required.");
        if (!data) throw new Error("data is required.");
        return client._request({
          endpoint: `/v1/public/${token}/chat/${chatId}/messages`,
          method: "POST",
          body: data,
          sendJWT: "optional"
          // Authenticated caller keeps identity; anonymous allowed when the release opts in
        });
      },
      /**
       * Creates a message on the main public topic chat.
       * If no main chat exists for this public file system, one is created (lazy creation).
       * Requires authentication.
       *
       * @param {string} token - The 10-character alphanumeric public access token.
       * @param {CreatePublicChatMessageRequest} data - The message data.
       * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
       *
       * @example
       * ```typescript
       * // This creates the main chat if it doesn't exist and posts the first message
       * const { chat, message } = await nuramaClient.public.createPublicTopicChatMessage('abc123def4', {
       *   content: 'First comment on this public file system!',
       * });
       * ```
       */
      async createPublicTopicChatMessage(token, data) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        if (!data) throw new Error("data is required.");
        return client._request({
          endpoint: `/v1/public/${token}/chat/messages`,
          method: "POST",
          body: data,
          sendJWT: "optional"
          // Authenticated caller keeps identity; anonymous allowed when the release opts in
        });
      },
      /**
       * Gets an asset with its public chat in the context of a public file system.
       * This endpoint does not require authentication for read access.
       *
       * @param {string} token - The 10-character alphanumeric public access token.
       * @param {string} assetId - The ID of the asset to retrieve.
       * @returns {Promise<PublicAssetResponse>} The asset with its public chat (or null if no chat exists).
       *
       * @example
       * ```typescript
       * const asset = await nuramaClient.public.getPublicAsset('abc123def4', 'asset-id');
       * if (asset.chats.public) {
       *   console.log('Asset has public chat:', asset.chats.public.id);
       * }
       * ```
       */
      async getPublicAsset(token, assetId) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        if (!assetId) throw new Error("assetId is required.");
        return client._request({
          endpoint: `/v1/public/${token}/assets/${assetId}`,
          method: "GET",
          sendJWT: false
          // Read access is public
        });
      },
      /**
       * Creates a message on an asset's public chat.
       * If no public chat exists for this asset in this public file system, one is created (lazy creation).
       * Requires authentication.
       *
       * @param {string} token - The 10-character alphanumeric public access token.
       * @param {string} assetId - The ID of the asset to post to.
       * @param {CreatePublicChatMessageRequest} data - The message data.
       * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
       *
       * @example
       * ```typescript
       * // This creates the chat if it doesn't exist and posts the first message
       * const { chat, message } = await nuramaClient.public.createPublicAssetChatMessage('abc123def4', 'asset-id', {
       *   content: 'First comment on this asset!',
       * });
       * ```
       */
      async createPublicAssetChatMessage(token, assetId, data) {
        if (!token) throw new Error("token is required.");
        if (token.length !== 10) throw new Error("token must be exactly 10 characters long.");
        if (!/^[a-zA-Z0-9]{10}$/.test(token)) throw new Error("token must contain only alphanumeric characters.");
        if (!assetId) throw new Error("assetId is required.");
        if (!data) throw new Error("data is required.");
        return client._request({
          endpoint: `/v1/public/${token}/assets/${assetId}/messages`,
          method: "POST",
          body: data,
          sendJWT: "optional"
          // Authenticated caller keeps identity; anonymous allowed when the release opts in
        });
      },
      // ========================================================================
      // Public asset links (/public-download)
      // ========================================================================
      /**
       * Resolve a public asset-link token to the minimal file info the download page shows.
       * Public endpoint; no authentication.
       * @param {string} token - The public asset-link token.
       * @returns {Promise<ResolvePublicDownloadResponse>} File name, media type and link status.
       * @throws {Error} 'token is required.' when `token` is falsy.
       */
      async resolvePublicDownload(token) {
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/public-download/${token}`,
          sendJWT: false
        });
      },
      /**
       * Get a short-lived signed download URL for a public asset-link token.
       * Public endpoint; fails with 403 for embed-only links.
       * @param {string} token - The public asset-link token.
       * @returns {Promise<PublicDownloadUrlResponse>} The signed URL and its expiry.
       * @throws {Error} 'token is required.' when `token` is falsy.
       */
      async getPublicDownloadUrl(token) {
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/public-download/${token}/download`,
          sendJWT: false
        });
      },
      /**
       * Get the HLS stream and fallback media key paths for the embeddable player.
       * Public endpoint; fails with 403 for download-only links.
       * @param {string} token - The public asset-link token.
       * @returns {Promise<PublicEmbedFilesResponse>} Stream and fallback key paths.
       * @throws {Error} 'token is required.' when `token` is falsy.
       */
      async getPublicEmbedFiles(token) {
        if (!token) throw new Error("token is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/public-download/${token}/embed-files`,
          sendJWT: false
        });
      },
      /**
       * Record a play event from the embed player for a public asset link.
       * Public endpoint; no authentication. The API responds 204.
       * @param {string} token - The public asset-link token.
       * @param {object} body - `{ eventType: 'play_started' | 'play_completed' }`.
       * @returns {Promise<void>} Resolves once recorded.
       * @throws {Error} 'token is required.' when `token` is falsy.
       */
      async recordAccessActivity(token, body) {
        if (!token) throw new Error("token is required.");
        await client._request({
          method: "POST",
          endpoint: `/v1/public-download/${token}/access-activity`,
          body,
          sendJWT: false
        });
      }
    };
  }

  // src/routes/settings.ts
  function createSettingsMethods(client) {
    return {
      /**
       * Get effective (resolved) settings for a resource with full cascade.
       * Requires authentication.
       * @param {string} resourceType - The resource type (workspace or project).
       * @param {string} resourceId - The resource ID.
       * @param {string} [workspaceId] - The workspace ID (required for projects).
       * @returns {Promise<EffectiveSettings>} The effective settings object.
       */
      async getEffectiveSettings(resourceType, resourceId, workspaceId) {
        return client._request({
          method: "GET",
          endpoint: `/v1/settings/${resourceType}/${resourceId}/effective`,
          params: workspaceId ? { workspaceId } : void 0,
          sendJWT: true
        });
      },
      /**
       * Get raw resource settings (overrides only, not cascaded).
       * Requires authentication.
       * @param {string} resourceType - The resource type (workspace or project).
       * @param {string} resourceId - The resource ID.
       * @returns {Promise<ResourceSettings | { message: string }>} The resource settings object.
       */
      async getResourceSettings(resourceType, resourceId) {
        return client._request({
          method: "GET",
          endpoint: `/v1/settings/${resourceType}/${resourceId}`,
          sendJWT: true
        });
      },
      /**
       * Get all resource settings for current user.
       * Requires authentication.
       * @returns {Promise<{ resourceSettings: ResourceSettings[] }>} Object containing array of resource settings.
       */
      async getAllResourceSettings() {
        return client._request({
          method: "GET",
          endpoint: "/v1/settings",
          sendJWT: true
        });
      },
      /**
       * Update resource-specific settings.
       * Requires authentication.
       * @param {string} resourceType - The resource type (workspace or project).
       * @param {string} resourceId - The resource ID.
       * @param {ResourceSettingsOverrides} settings - The settings to update.
       * @returns {Promise<{ message: string; settings: ResourceSettings }>} Success message and updated settings.
       */
      async updateResourceSettings(resourceType, resourceId, settings) {
        return client._request({
          method: "PUT",
          endpoint: `/v1/settings/${resourceType}/${resourceId}`,
          body: settings,
          sendJWT: true
        });
      },
      /**
       * Reset resource settings to inherit from parent/global.
       * Requires authentication.
       * @param {string} resourceType - The resource type (workspace or project).
       * @param {string} resourceId - The resource ID.
       * @returns {Promise<{ message: string }>} Success message.
       */
      async resetResourceSettings(resourceType, resourceId) {
        return client._request({
          method: "DELETE",
          endpoint: `/v1/settings/${resourceType}/${resourceId}`,
          sendJWT: true
        });
      },
      /**
       * Cleanup orphaned settings (settings for resources user no longer has access to).
       * Requires authentication.
       * @returns {Promise<{ message: string; removedCount: number }>} Success message and count of removed settings.
       */
      async cleanupOrphanedSettings() {
        return client._request({
          method: "POST",
          endpoint: "/v1/settings/cleanup",
          sendJWT: true
        });
      }
    };
  }

  // src/routes/device.ts
  function createDeviceMethods(client) {
    return {
      /**
       * Register a new device for push notifications.
       * If the same push token is registered again, the existing device will be updated.
       * Requires authentication.
       * @param {RegisterDeviceBody} deviceData - Device registration data.
       * @returns {Promise<Device>} The registered device object.
       * @example
       * const device = await client.device.registerDevice({
       *   deviceType: 'ios',
       *   pushToken: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
       *   bundleId: 'com.nurama.mobile',
       *   deviceInfo: {
       *     appVersion: '1.0.0',
       *     osVersion: '17.0',
       *     deviceModel: 'iPhone 15',
       *     deviceName: "John's iPhone"
       *   }
       * });
       */
      async registerDevice(deviceData) {
        if (!deviceData.deviceType || !deviceData.pushToken) {
          throw new Error("deviceType and pushToken are required.");
        }
        return client._request({
          method: "POST",
          endpoint: "/v1/devices",
          body: deviceData,
          sendJWT: true
        });
      },
      /**
       * Get all devices for the authenticated user.
       * Requires authentication.
       * @param {GetUserDevicesQuery} [filters] - Optional filters (status, deviceType).
       * @returns {Promise<Device[]>} Array of device objects.
       * @example
       * const devices = await client.device.getUserDevices({ status: 'active' });
       */
      async getUserDevices(filters) {
        return client._request({
          method: "GET",
          endpoint: "/v1/devices",
          params: filters,
          sendJWT: true
        });
      },
      /**
       * Get a specific device by ID.
       * Users can only access their own devices.
       * Requires authentication.
       * @param {string} deviceId - The device ID.
       * @returns {Promise<Device>} The device object.
       * @example
       * const device = await client.device.getDevice('507f1f77bcf86cd799439011');
       */
      async getDevice(deviceId) {
        if (!deviceId) {
          throw new Error("deviceId is required.");
        }
        return client._request({
          method: "GET",
          endpoint: `/v1/devices/${deviceId}`,
          sendJWT: true
        });
      },
      /**
       * Update device information.
       * Users can only update their own devices.
       * Requires authentication.
       * @param {string} deviceId - The device ID.
       * @param {UpdateDeviceBody} updateData - Data to update (pushToken, deviceInfo, status, subscribedChannels).
       * @returns {Promise<Device>} The updated device object.
       * @example
       * const device = await client.device.updateDevice('507f1f77bcf86cd799439011', {
       *   deviceInfo: { appVersion: '1.1.0' },
       *   status: 'active'
       * });
       */
      async updateDevice(deviceId, updateData) {
        if (!deviceId) {
          throw new Error("deviceId is required.");
        }
        if (Object.keys(updateData).length === 0) {
          throw new Error("At least one field must be provided to update the device.");
        }
        return client._request({
          method: "PUT",
          endpoint: `/v1/devices/${deviceId}`,
          body: updateData,
          sendJWT: true
        });
      },
      /**
       * Delete a device.
       * Users can only delete their own devices.
       * Requires authentication.
       * @param {string} deviceId - The device ID.
       * @returns {Promise<void>}
       * @example
       * await client.device.deleteDevice('507f1f77bcf86cd799439011');
       */
      async deleteDevice(deviceId) {
        if (!deviceId) {
          throw new Error("deviceId is required.");
        }
        return client._request({
          method: "DELETE",
          endpoint: `/v1/devices/${deviceId}`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/shortlink.ts
  function createShortLinkMethods(client) {
    return {
      /**
       * Resolves a short link code to its full deep link path.
       * This endpoint is publicly accessible and does not require authentication.
       * @param {string} code - The 8-character alphanumeric short link code.
       * @returns {Promise<ResolveShortLinkResponse>} The resolved deep link information.
       */
      async resolveShortLink(code) {
        if (!code) throw new Error("code is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/shortlink/${code}`,
          sendJWT: false
        });
      }
    };
  }

  // src/routes/convo.ts
  function createConvoMethods(client) {
    return {
      /**
       * Start a new conversation (video or audio).
       * Requires authentication.
       * @param {StartConvoRequest} data - Conversation start data.
       * @returns {Promise<StartConvoResponse>} The created conversation and room details.
       * @example
       * const result = await client.convo.startConvo({
       *   chatId: '507f1f77bcf86cd799439011',
       *   chatType: 'chat',
       *   convoType: 'video'
       * });
       */
      async startConvo(data) {
        if (!data.chatId || !data.chatType || !data.convoType) {
          throw new Error("chatId, chatType, and convoType are required.");
        }
        return client._request({
          method: "POST",
          endpoint: "/v1/convos",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Get a specific conversation by ID.
       * Requires authentication and permission to view the conversation.
       * @param {string} convoId - The conversation ID.
       * @returns {Promise<GetConvoResponse>} The conversation details.
       * @example
       * const result = await client.convo.getConvo('507f1f77bcf86cd799439011');
       */
      async getConvo(convoId) {
        if (!convoId) {
          throw new Error("convoId is required.");
        }
        return client._request({
          method: "GET",
          endpoint: `/v1/convos/${convoId}`,
          sendJWT: true
        });
      },
      /**
       * Join an active conversation.
       * Returns the conversation details and a Daily.co meeting token for the user.
       * Requires authentication and permission to join the conversation.
       * @param {string} convoId - The conversation ID.
       * @returns {Promise<JoinConvoResponse>} The conversation and meeting token.
       * @example
       * const result = await client.convo.joinConvo('507f1f77bcf86cd799439011');
       * // Use result.token to join the Daily.co call
       * // Use result.convo.dailyRoomUrl as the room URL
       */
      async joinConvo(convoId) {
        if (!convoId) {
          throw new Error("convoId is required.");
        }
        return client._request({
          method: "PUT",
          endpoint: `/v1/convos/${convoId}/join`,
          sendJWT: true
        });
      },
      /**
       * Rejoin an active conversation (page refresh / reconnect).
       * Only returns a new meeting token if the user is already an active participant.
       * No notifications are sent.
       * @param {string} convoId - The conversation ID.
       * @returns {Promise<JoinConvoResponse>} The conversation and meeting token.
       */
      async rejoinConvo(convoId) {
        if (!convoId) {
          throw new Error("convoId is required.");
        }
        return client._request({
          method: "PUT",
          endpoint: `/v1/convos/${convoId}/rejoin`,
          sendJWT: true
        });
      },
      /**
       * Leave an active conversation.
       * Removes the user from the active participants list.
       * Requires authentication.
       * @param {string} convoId - The conversation ID.
       * @returns {Promise<LeaveConvoResponse>} The updated conversation.
       * @example
       * const result = await client.convo.leaveConvo('507f1f77bcf86cd799439011');
       */
      async leaveConvo(convoId) {
        if (!convoId) {
          throw new Error("convoId is required.");
        }
        return client._request({
          method: "PUT",
          endpoint: `/v1/convos/${convoId}/leave`,
          sendJWT: true
        });
      },
      /**
       * Mark a conversation as complete.
       * Ends the conversation and triggers recording/transcript processing if enabled.
       * Requires authentication and permission to complete the conversation.
       * @param {string} convoId - The conversation ID.
       * @returns {Promise<CompleteConvoResponse>} The completed conversation.
       * @example
       * const result = await client.convo.completeConvo('507f1f77bcf86cd799439011');
       */
      async completeConvo(convoId) {
        if (!convoId) {
          throw new Error("convoId is required.");
        }
        return client._request({
          method: "PUT",
          endpoint: `/v1/convos/${convoId}/complete`,
          sendJWT: true
        });
      },
      /**
       * Delete/cancel a conversation.
       * Only the creator can delete a conversation.
       * Requires authentication and permission to delete the conversation.
       * @param {string} convoId - The conversation ID.
       * @returns {Promise<void>} Resolves with no value; the API responds 204.
       * @example
       * await client.convo.deleteConvo('507f1f77bcf86cd799439011');
       */
      async deleteConvo(convoId) {
        if (!convoId) {
          throw new Error("convoId is required.");
        }
        await client._request({
          method: "DELETE",
          endpoint: `/v1/convos/${convoId}`,
          sendJWT: true
        });
      },
      /**
       * Update a conversation's subject and/or description.
       * Only the conversation starter can update these fields.
       * Requires authentication.
       * @param {string} convoId - The conversation ID.
       * @param {UpdateConvoRequest} data - Update data containing subject and/or description.
       * @returns {Promise<UpdateConvoResponse>} The updated conversation.
       * @example
       * const result = await client.convo.updateConvo('507f1f77bcf86cd799439011', {
       *   subject: 'Weekly Team Sync',
       *   description: 'Discussing project updates and roadmap'
       * });
       */
      async updateConvo(convoId, data) {
        if (!convoId) {
          throw new Error("convoId is required.");
        }
        return client._request({
          method: "PATCH",
          endpoint: `/v1/convos/${convoId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * List the convos that have taken place in a chat, newest first.
       * Requires read access to the chat.
       * @param {string} chatId - The chat ID.
       * @param {object} [params] - Optional filter.
       * @param {'active'|'completed'|'cancelled'} [params.status] - Only convos in this status.
       * @returns {Promise<Convo[]>} Convos for the chat.
       */
      async getChatConvos(chatId, params) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/${chatId}/convos`,
          params,
          sendJWT: true
        });
      },
      /**
       * List every convo across all chats in a project (the "Convos drawer"), newest first.
       * Requires `canGetProject` on the project.
       * @param {string} projectId - The project ID.
       * @param {object} [params] - Optional filters.
       * @param {'creator'|'reviewer'} [params.visibility] - Only convos from chats with this visibility.
       * @param {'active'|'completed'|'cancelled'} [params.status] - Only convos in this status.
       * @returns {Promise<Convo[]>} Convos for the project.
       */
      async getProjectConvos(projectId, params) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/projects/${projectId}/convos`,
          params,
          sendJWT: true
        });
      },
      /**
       * Get conversations for a scope (project).
       * Returns paginated list of conversations with cursor-based pagination.
       * Active conversations are returned first.
       * Requires authentication and permission to view conversations.
       * @param {string} scopeId - The scope (project) ID.
       * @param {object} params - Query parameters.
       * @param {string[]} params.visibility - Array of visibility levels ('creator', 'reviewer').
       * @param {string} [params.status] - Filter by status ('active', 'completed', 'cancelled').
       * @param {string} [params.search] - Search query for participant names.
       * @param {number} [params.limit=20] - Number of results per page.
       * @param {string} [params.cursor] - Cursor for pagination.
       * @param {boolean} [params.includeCounts] - Include total counts.
       * @returns {Promise<GetScopeConvosResponse>} Paginated conversation list.
       * @example
       * const result = await client.convo.getScopeConvos('507f1f77bcf86cd799439011', {
       *   visibility: ['creator', 'reviewer'],
       *   status: 'active',
       *   limit: 20
       * });
       */
      /**
       * Promote a convo's recording or transcript to a standalone asset.
       *
       * Additive: the artifact stays bundled with the convo as well, so calling
       * this twice returns the first asset with `alreadyPromoted: true` rather
       * than making a second copy.
       *
       * Only the convo's starter may promote. A transcript is promoted as a text
       * document built from the transcript text, not the raw .vtt.
       * @param {string} convoId - The conversation ID.
       * @param {'recording'|'transcript'} kind - Which artifact to promote.
       * @param {string} dailyId - The provider's id for the artifact, taken from
       *   the convo's `recordings` / `transcripts` entries.
       * @param {PromoteConvoArtifactRequest} [data] - Optional display name.
       * @returns {Promise<PromoteConvoArtifactResponse>} The asset, and whether it already existed.
       * @example
       * const { asset } = await client.convo.promoteConvoArtifact(convoId, 'recording', rec.dailyId);
       */
      async promoteConvoArtifact(convoId, kind, dailyId, data) {
        if (!convoId) throw new Error("convoId is required.");
        if (!dailyId) throw new Error("dailyId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/convos/${convoId}/artifacts/${kind}/${dailyId}/promote`,
          body: data ?? {},
          sendJWT: true
        });
      },
      async getScopeConvos(scopeId, params) {
        if (!scopeId) {
          throw new Error("scopeId is required.");
        }
        if (!params.visibility || params.visibility.length === 0) {
          throw new Error("visibility array is required and must not be empty.");
        }
        const queryParams = new URLSearchParams();
        params.visibility.forEach((vis) => queryParams.append("visibility[]", vis));
        if (params.status) queryParams.append("status", params.status);
        if (params.search) queryParams.append("search", params.search);
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.cursor) queryParams.append("cursor", params.cursor);
        if (params.includeCounts) queryParams.append("includeCounts", "true");
        return client._request({
          method: "GET",
          endpoint: `/v1/convos/scope/${scopeId}?${queryParams.toString()}`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/board.ts
  function createBoardMethods(client) {
    return {
      // ========================================================================
      // Board CRUD
      // ========================================================================
      /**
       * Create a new board inside a project. If `columns` are omitted the
       * server seeds the standard four-column layout.
       */
      async createBoard(data) {
        if (!data.projectId) throw new Error("projectId is required.");
        if (!data.name) throw new Error("name is required.");
        return client._request({
          method: "POST",
          endpoint: "/v1/boards/",
          body: data,
          sendJWT: true
        });
      },
      /**
       * List boards in a project. Filters by visibility, free-text search,
       * and tag ids.
       */
      async getProjectBoards(projectId, params) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/boards/project/${projectId}`,
          params,
          sendJWT: true
        });
      },
      /**
       * List every task in a project across all boards. Use `boardId:
       * 'unassigned'` to fetch only tasks not yet placed on a board.
       */
      async getProjectTasks(projectId, params) {
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/boards/project/${projectId}/tasks`,
          params,
          sendJWT: true
        });
      },
      /** Fetch a board with its columns and tasks populated. */
      async getBoard(boardId) {
        if (!boardId) throw new Error("boardId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/boards/${boardId}`,
          sendJWT: true
        });
      },
      /**
       * Update a board's metadata. Set `cascade: true` to opt into
       * automatic cleanup of dependent tasks when narrowing visibility;
       * otherwise the server returns 409 with a `blockers` payload.
       */
      async updateBoard(boardId, data) {
        if (!boardId) throw new Error("boardId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/boards/${boardId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Delete a board. `disposition` controls what happens to its tasks:
       * `unassign` (default — tasks survive boardless), `delete`, or
       * `reassign` to another board/column.
       */
      async deleteBoard(boardId, body) {
        if (!boardId) throw new Error("boardId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/boards/${boardId}`,
          body: body && Object.keys(body).length > 0 ? body : void 0,
          sendJWT: true
        });
      },
      // ========================================================================
      // Column Operations
      // ========================================================================
      /** Add a column to a board. Appended at the end unless `sortOrder` is provided. */
      async addColumn(boardId, data) {
        if (!boardId) throw new Error("boardId is required.");
        if (!data.name) throw new Error("name is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/boards/${boardId}/columns`,
          body: data,
          sendJWT: true
        });
      },
      /** Reorder a board's columns. The request must include every column id. */
      async reorderColumns(boardId, data) {
        if (!boardId) throw new Error("boardId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/boards/${boardId}/columns/reorder`,
          body: data,
          sendJWT: true
        });
      },
      /** Update column metadata (name, color, task-status mapping, etc.). */
      async updateColumn(boardId, columnId, data) {
        if (!boardId) throw new Error("boardId is required.");
        if (!columnId) throw new Error("columnId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/boards/${boardId}/columns/${columnId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Delete a column. If the column holds tasks, pass `targetColumnId`
       * to move them; otherwise the call fails.
       */
      async deleteColumn(boardId, columnId, targetColumnId) {
        if (!boardId) throw new Error("boardId is required.");
        if (!columnId) throw new Error("columnId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/boards/${boardId}/columns/${columnId}`,
          body: targetColumnId ? { targetColumnId } : void 0,
          sendJWT: true
        });
      },
      // ========================================================================
      // Board Task Operations
      // ========================================================================
      /** List tasks on a board, optionally narrowed by column / assignee / tag / status / search. */
      async getBoardTasks(boardId, params) {
        if (!boardId) throw new Error("boardId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/boards/${boardId}/tasks`,
          params,
          sendJWT: true
        });
      },
      /**
       * Create a task directly on a board. When `announce` is supplied the
       * server also posts a Nu reply in the named chat threaded under the
       * given message, with this task linked via TaskRelation.
       */
      async createBoardTask(boardId, data) {
        if (!boardId) throw new Error("boardId is required.");
        if (!data.subject) throw new Error("subject is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/boards/${boardId}/tasks`,
          body: data,
          sendJWT: true
        });
      },
      /** Attach an existing project task to a board (no new task is created). */
      async addExistingTaskToBoard(boardId, data) {
        if (!boardId) throw new Error("boardId is required.");
        if (!data.taskId) throw new Error("taskId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/boards/${boardId}/tasks/add`,
          body: data,
          sendJWT: true
        });
      },
      /** Move a task to a different column on the same board. */
      async moveTask(boardId, taskId, data) {
        if (!boardId) throw new Error("boardId is required.");
        if (!taskId) throw new Error("taskId is required.");
        if (!data.columnId) throw new Error("columnId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/boards/${boardId}/tasks/${taskId}/move`,
          body: data,
          sendJWT: true
        });
      },
      /** Detach a task from a board. The task itself is preserved as boardless. */
      async removeTaskFromBoard(boardId, taskId) {
        if (!boardId) throw new Error("boardId is required.");
        if (!taskId) throw new Error("taskId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/boards/${boardId}/tasks/${taskId}`,
          sendJWT: true
        });
      },
      // ========================================================================
      // Task Detail Operations
      // ========================================================================
      // ========================================================================
      // Task Link Operations
      // ========================================================================
      // ========================================================================
      // Tagging
      // ========================================================================
      /** Attach a tag to a board. */
      async tagBoard(boardId, tagId) {
        return client._request({
          method: "PUT",
          endpoint: `/v1/boards/${boardId}/tag`,
          body: { tagId },
          sendJWT: true
        });
      },
      /** Detach a tag from a board. */
      async untagBoard(boardId, tagId) {
        return client._request({
          method: "PUT",
          endpoint: `/v1/boards/${boardId}/untag`,
          body: { tagId },
          sendJWT: true
        });
      },
      // ========================================================================
      // Following
      // ========================================================================
      /** Follow a board to receive notifications about its tasks. */
      async followBoard(boardId) {
        if (!boardId) throw new Error("boardId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/boards/${boardId}/follow`,
          sendJWT: true
        });
      },
      /** Stop following a board. */
      async unfollowBoard(boardId) {
        if (!boardId) throw new Error("boardId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/boards/${boardId}/unfollow`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/taskRelation.ts
  function createTaskRelationMethods(client) {
    return {
      /**
       * List the relations attached to a task — chat messages, chats, or
       * other resources that reference this task as context.
       */
      async getTaskRelations(taskId, params) {
        if (!taskId) throw new Error("taskId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/tasks/${taskId}/relations`,
          params,
          sendJWT: true
        });
      },
      /**
       * Attach a related resource (chat message, chat, etc.) to a task,
       * so the task surface shows the originating context.
       */
      async createTaskRelation(taskId, data) {
        if (!taskId) throw new Error("taskId is required.");
        if (!data?.resourceId) throw new Error("resourceId is required.");
        if (!data?.resourceType) throw new Error("resourceType is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/tasks/${taskId}/relations`,
          body: data,
          sendJWT: true
        });
      },
      /** Detach a related resource from a task. */
      async deleteTaskRelation(taskId, relationId) {
        if (!taskId) throw new Error("taskId is required.");
        if (!relationId) throw new Error("relationId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/tasks/${taskId}/relations/${relationId}`,
          sendJWT: true
        });
      },
      /** List task relations referencing a chat (reverse lookup). */
      async getRelationsForChat(chatId, params) {
        if (!chatId) throw new Error("chatId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chats/${chatId}/relations`,
          params,
          sendJWT: true
        });
      },
      /** List task relations referencing a specific chat message (reverse lookup). */
      async getRelationsForMessage(messageId, params) {
        if (!messageId) throw new Error("messageId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/chat-messages/${messageId}/relations`,
          params,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/bot.ts
  function createBotMethods(client) {
    return {
      /**
       * Create a bot user in a workspace.
       * Returns the new bot and the raw API key (shown only once).
       */
      async createBot(workspaceId, data) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/workspaces/${workspaceId}/bots`,
          body: data,
          sendJWT: true
        });
      },
      /** List bot users in a workspace. */
      async listBots(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/workspaces/${workspaceId}/bots`,
          sendJWT: true,
          bypassCache: true
        });
      },
      /** Get a single bot's details, including all of its API key metadata (no secrets). */
      async getBot(workspaceId, botId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!botId) throw new Error("botId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}`,
          sendJWT: true,
          bypassCache: true
        });
      },
      /** Update a bot's display name and/or color. */
      async updateBot(workspaceId, botId, data) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!botId) throw new Error("botId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Delete a bot user. Revokes all API keys, removes the workspace
       * membership, and marks the user inactive.
       */
      async deleteBot(workspaceId, botId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!botId) throw new Error("botId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}`,
          sendJWT: true
        });
      },
      /**
       * Revoke the bot's current API key and issue a new one.
       * The new raw key is returned once.
       */
      async rotateBotKey(workspaceId, botId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!botId) throw new Error("botId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/rotate-key`,
          sendJWT: true
        });
      },
      /**
       * Request signed URL data to upload a new avatar for the bot.
       * Caller multipart-uploads the file to S3 using the returned `signedUrlData`,
       * then calls `client.asset.completeUpload(...)` to finalize.
       */
      async updateBotAvatar(workspaceId, botId, fileData) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!botId) throw new Error("botId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/avatar`,
          body: fileData,
          sendJWT: true
        });
      },
      /**
       * List the bot's project memberships within the workspace.
       */
      async listProjectMemberships(workspaceId, botId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!botId) throw new Error("botId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/memberships`,
          sendJWT: true,
          bypassCache: true
        });
      },
      /**
       * Upsert the bot's membership on a project. Replaces roles if a membership
       * already exists; creates one otherwise. Idempotent.
       */
      async setProjectMembership(workspaceId, botId, projectId, data) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!botId) throw new Error("botId is required.");
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "PUT",
          endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/memberships/project/${projectId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Remove the bot's membership on a project. Idempotent.
       */
      async removeProjectMembership(workspaceId, botId, projectId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!botId) throw new Error("botId is required.");
        if (!projectId) throw new Error("projectId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/memberships/project/${projectId}`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/ai.ts
  function createAiMethods(client) {
    return {
      /**
       * Rewrite a draft chat message in a selected tone. Charges the workspace's
       * credit balance based on the underlying provider cost plus markup.
       *
       * @param data - Polish request payload.
       * @returns The polished text plus billing telemetry.
       */
      /**
       * One turn of a Compose-with-Nu drafting conversation.
       *
       * Send only the drafting thread — the chat being written into is read
       * server-side from `chatId`, under the caller's own permissions. The
       * result is Nu's commentary plus, when it has one, a proposed message.
       * Nothing is posted: the proposal is the user's to take or discard.
       */
      async composeWithNu(data) {
        if (!data?.workspaceId) throw new Error("workspaceId is required.");
        if (!data?.chatId) throw new Error("chatId is required.");
        if (!data?.messages?.length) throw new Error("messages is required.");
        return client._request({
          endpoint: "/v1/ai/compose",
          method: "POST",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Record a thumbs-up / thumbs-down on one assistant reply.
       *
       * `chatId` is required because it is what the server authorises against —
       * a user can only rate a reply in a chat they can already read — and it is
       * what the stored transcript snapshot is built from.
       */
      async submitFeedback(data) {
        if (!data?.chatId) throw new Error("chatId is required.");
        if (!data?.rating) throw new Error("rating is required.");
        if (!data?.surface) throw new Error("surface is required.");
        return client._request({
          endpoint: "/v1/ai/feedback",
          method: "POST",
          body: data,
          sendJWT: true
        });
      },
      async polish(data) {
        if (!data?.workspaceId) throw new Error("workspaceId is required.");
        if (!data?.text) throw new Error("text is required.");
        if (!data?.toneId) throw new Error("toneId is required.");
        return client._request({
          endpoint: "/v1/ai/polish",
          method: "POST",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Convert a chat message into one or more board-task drafts. The
       * frontend opens the EnhancedTaskCreatorModal in a loading state, calls
       * this method, and seeds the modal's draft list from the response's
       * `tasks` array. Requires both the AI add-on AND the Boards add-on on
       * the workspace; the server returns `productNotActive` if either is
       * missing.
       *
       * @param data - Task generation request payload.
       * @returns Tasks plus billing telemetry.
       */
      async generateTasks(data) {
        if (!data?.workspaceId) throw new Error("workspaceId is required.");
        if (!data?.projectId) throw new Error("projectId is required.");
        if (!data?.messageText) throw new Error("messageText is required.");
        return client._request({
          endpoint: "/v1/ai/task-generation",
          method: "POST",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Returns the catalogue of polish tones the platform supports. The FE
       * uses this to populate the tone dropdown without hard-coding the IDs.
       */
      async listTones() {
        return client._request({
          endpoint: "/v1/ai/tones",
          method: "GET",
          sendJWT: true
        });
      },
      /**
       * Generate one image revision (prompt-driven variant of a source
       * image or video frame). The result is staged on Scratch — the FE
       * then chooses one of two outcomes:
       *   - "Add to project" → call `nuramaClient.scratch.promote(id)` to
       *     create a project-scoped Asset immediately.
       *   - "Attach to chat" → leave the scratch id in the chat
       *     composer's pending attachments; the chat-send endpoint
       *     accepts `{ scratchId, name? }` items in `attachments[]` and
       *     promotes each to a chat-scoped Asset at send time.
       */
      async generateRevision(data) {
        if (!data?.workspaceId) throw new Error("workspaceId is required.");
        if (!data?.source) throw new Error("source is required.");
        if (!data?.prompt) throw new Error("prompt is required.");
        return client._request({
          endpoint: "/v1/ai/revisions",
          method: "POST",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Mint a signed-URL bundle for uploading a source image (typically
       * a captured video frame) into Scratch BEFORE calling
       * `generateRevision`. Use the resulting `scratchId` as the
       * `source.scratchId` on the generate call.
       *
       * Why this exists: video frames are captured client-side and need
       * to reach OpenAI as a public media URL. Posting the bytes inline
       * (as `dataUrl`) makes the API node a pass-through for multi-MB
       * payloads; staging on Scratch first keeps the node out of the
       * byte path entirely.
       */
      async createRevisionSourceUpload(data) {
        if (!data?.workspaceId) throw new Error("workspaceId is required.");
        if (!(data?.sizeInMB > 0)) throw new Error("sizeInMB must be a positive number.");
        return client._request({
          endpoint: "/v1/ai/revisions/source-upload",
          method: "POST",
          body: data,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/chatAi.ts
  function createAiChatMethods(client) {
    const buildQuery = (params) => {
      const search = new URLSearchParams();
      for (const [key, value2] of Object.entries(params)) {
        if (value2 === void 0 || value2 === null || value2 === "") continue;
        search.set(key, String(value2));
      }
      const query = search.toString();
      return query ? `?${query}` : "";
    };
    return {
      /** List the caller's topics for a scope (workspace, project, or social). */
      async listTopics(params) {
        if (!params?.workspaceId) throw new Error("workspaceId is required.");
        if (!params?.scopeType) throw new Error("scopeType is required.");
        if (params.scopeType !== "social" && !params.scopeId) {
          throw new Error("scopeId is required for workspace/project scope.");
        }
        return client._request({
          endpoint: `/v1/ai/chat/topics${buildQuery(params)}`,
          method: "GET",
          sendJWT: true
        });
      },
      /**
       * Create a new (empty) topic. After this resolves, send the first
       * message through `nuramaClient.chat.createMessage(topic.chatId, …)`.
       */
      async createTopic(data) {
        if (!data?.workspaceId) throw new Error("workspaceId is required.");
        if (!data?.scopeType) throw new Error("scopeType is required.");
        if (data.scopeType !== "social" && !data.scopeId) {
          throw new Error("scopeId is required for workspace/project scope.");
        }
        return client._request({
          endpoint: "/v1/ai/chat/topics",
          method: "POST",
          body: data,
          sendJWT: true
        });
      },
      async getTopic(topicId, params) {
        if (!topicId) throw new Error("topicId is required.");
        return client._request({
          endpoint: `/v1/ai/chat/topics/${encodeURIComponent(topicId)}${buildQuery(params)}`,
          method: "GET",
          sendJWT: true
        });
      },
      async updateTopic(topicId, data) {
        if (!topicId) throw new Error("topicId is required.");
        return client._request({
          endpoint: `/v1/ai/chat/topics/${encodeURIComponent(topicId)}`,
          method: "PATCH",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Soft-delete a topic. The backend flips the topic + its backing
       * chat + every chat-scoped attachment asset to `pendingDelete`;
       * the file-management sweeper handles the actual S3 + DB cleanup
       * asynchronously. The caller can drop the row from their local
       * list immediately — there's no "undo" surface for this.
       */
      async deleteTopic(topicId, params) {
        if (!topicId) throw new Error("topicId is required.");
        return client._request({
          endpoint: `/v1/ai/chat/topics/${encodeURIComponent(topicId)}${buildQuery(params)}`,
          method: "DELETE",
          sendJWT: true
        });
      }
    };
  }

  // src/routes/supportChat.ts
  function createSupportChatMethods(client) {
    return {
      /**
       * Get-or-create the caller's Support topic. Idempotent: re-calling
       * returns the same row, so this is safe to invoke on every page mount.
       */
      async getTopic() {
        return client._request({
          endpoint: "/v1/ai/support-chat/topic",
          method: "GET",
          sendJWT: true
        });
      },
      /**
       * Mint a Scratch upload bundle for one image attachment. The bytes
       * land in a Scratch row with a 72-hour TTL and are read by the
       * orchestrator's vision pass on the next user message — never
       * promoted to a permanent Asset.
       *
       * Same upload protocol as every other multipart upload on the
       * platform: call this, multipart-upload the bytes to `urls`, then
       * call `nuramaClient.scratch.completeUpload(scratchId, { uploadId, parts })`.
       * Send the message with `attachments: [{ scratchId, name }]`.
       */
      async createAttachment(data) {
        return client._request({
          endpoint: "/v1/ai/support-chat/attachments",
          method: "POST",
          body: data,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/blogPosts.ts
  function createBlogPostsMethods(client) {
    return {
      /** List the most recent Nurama News posts. */
      async listBlogPosts(params = {}) {
        const search = new URLSearchParams();
        if (params.limit != null) search.set("limit", String(params.limit));
        if (params.page != null) search.set("page", String(params.page));
        const query = search.toString();
        return client._request({
          endpoint: `/v1/blog-posts${query ? `?${query}` : ""}`,
          method: "GET",
          sendJWT: true
        });
      }
    };
  }

  // src/routes/credits.ts
  function createCreditsMethods(client) {
    return {
      /**
       * Get the workspace's spendable credit balance.
       */
      async getBalance(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          endpoint: `/v1/credits/balance?workspaceId=${encodeURIComponent(workspaceId)}`,
          method: "GET",
          sendJWT: true
        });
      },
      /**
       * Get the workspace's credit usage report. Same shape as the AI usage
       * report — today the data is AI-only because AI is the only service
       * that's metered.
       */
      async getUsageReport(workspaceId, params = {}) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        const query = new URLSearchParams({ workspaceId });
        if (params.startDate) query.set("startDate", params.startDate);
        if (params.endDate) query.set("endDate", params.endDate);
        if (params.userId) query.set("userId", params.userId);
        if (params.integrationPoint) query.set("integrationPoint", params.integrationPoint);
        return client._request({
          endpoint: `/v1/credits/usage?${query.toString()}`,
          method: "GET",
          sendJWT: true
        });
      }
    };
  }

  // src/routes/scratch.ts
  function createScratchMethods(client) {
    return {
      /**
       * Finish a multipart upload for a scratch row. Same `{ uploadId,
       * parts }` body the asset complete-upload route accepts. Server
       * runs `CompleteMultipartUploadCommand` against the media bucket,
       * HEADs the object for size, increments workspace storage usage,
       * writes the audit row, and flips status pendingUpload → active.
       * Creator-only.
       */
      async completeUpload(scratchId, data) {
        if (!scratchId) throw new Error("scratchId is required.");
        if (!data?.uploadId) throw new Error("uploadId is required.");
        if (!Array.isArray(data?.parts) || data.parts.length === 0) {
          throw new Error("parts is required.");
        }
        return client._request({
          endpoint: `/v1/scratch/${encodeURIComponent(scratchId)}/complete-upload`,
          method: "POST",
          body: data,
          sendJWT: true
        });
      },
      /**
       * Promote a scratch row to a real Asset. Creator-only — only the
       * user who created the scratch row can call this. Destination is
       * derived server-side from the row itself:
       *   - row has `projectId`     → asset created in that project
       *   - row has only workspace  → asset created at the workspace
       *
       * No body fields for destination on purpose: the FE doesn't get to
       * claim a scratch belongs to a different workspace / project. The
       * only optional input is `fileName` to override the asset's
       * user-facing name.
       */
      async promote(scratchId, data = {}) {
        if (!scratchId) throw new Error("scratchId is required.");
        return client._request({
          endpoint: `/v1/scratch/${encodeURIComponent(scratchId)}/promote`,
          method: "POST",
          body: data,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/token.ts
  function createTokenMethods(client) {
    return {
      /**
       * Mint a new Personal Access Token for the calling user.
       * The raw secret is in the response's `token` field — store it
       * immediately, it cannot be retrieved again.
       */
      async createToken(data) {
        return client._request({
          method: "POST",
          endpoint: "/v1/tokens",
          body: data,
          sendJWT: true
        });
      },
      /**
       * List the caller's Personal Access Tokens. Bot-access keys held
       * by the same user (rare but possible — admin who's also a bot
       * owner) are filtered out server-side and surface via the bot
       * management screens instead.
       */
      async listTokens() {
        return client._request({
          method: "GET",
          endpoint: "/v1/tokens",
          sendJWT: true,
          bypassCache: true
        });
      },
      /**
       * Revoke one of the caller's Personal Access Tokens. The revocation
       * is immediate — the token will return 401 on the very next request.
       */
      async deleteToken(tokenId) {
        if (!tokenId) throw new Error("tokenId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/tokens/${tokenId}`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/webhook.ts
  function createWebhookMethods(client) {
    return {
      /**
       * Create a webhook subscription. The signing secret is in the
       * response's `secret` field — store it immediately, it cannot be
       * retrieved again.
       *
       * @requires `canManageWebhooks` on the workspace.
       */
      async createWebhook(workspaceId, data) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/workspaces/${workspaceId}/webhooks`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * List webhook subscriptions in a workspace. Secrets are never returned.
       *
       * @requires `canManageWebhooks` on the workspace.
       */
      async listWebhooks(workspaceId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/workspaces/${workspaceId}/webhooks`,
          sendJWT: true,
          bypassCache: true
        });
      },
      /**
       * Fetch a single webhook subscription by id.
       *
       * @requires `canManageWebhooks` on the workspace.
       */
      async getWebhook(workspaceId, webhookId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!webhookId) throw new Error("webhookId is required.");
        return client._request({
          method: "GET",
          endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}`,
          sendJWT: true,
          bypassCache: true
        });
      },
      /**
       * Update a webhook subscription's url, event filter, or active state.
       *
       * @requires `canManageWebhooks` on the workspace.
       */
      async updateWebhook(workspaceId, webhookId, data) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!webhookId) throw new Error("webhookId is required.");
        return client._request({
          method: "PATCH",
          endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}`,
          body: data,
          sendJWT: true
        });
      },
      /**
       * Delete a webhook subscription. In-flight deliveries continue to
       * the receiver until they exhaust retries; no new deliveries fire.
       *
       * @requires `canManageWebhooks` on the workspace.
       */
      async deleteWebhook(workspaceId, webhookId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!webhookId) throw new Error("webhookId is required.");
        return client._request({
          method: "DELETE",
          endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}`,
          sendJWT: true
        });
      },
      /**
       * Generate a new HMAC signing secret for a subscription and return
       * it once. The old secret is invalidated immediately.
       *
       * @requires `canManageWebhooks` on the workspace.
       */
      async rotateWebhookSecret(workspaceId, webhookId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!webhookId) throw new Error("webhookId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}/rotate-secret`,
          sendJWT: true
        });
      },
      /**
       * Fire a synthetic `webhook.test` delivery to the subscription's
       * URL. The receiver gets a small payload they can use to verify
       * their HMAC + parsing setup. Returns immediately; check the
       * delivery log for the outcome.
       */
      async testWebhook(workspaceId, webhookId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!webhookId) throw new Error("webhookId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}/test`,
          sendJWT: true
        });
      },
      /**
       * Paginated list of delivery attempts for a webhook subscription.
       * Useful for diagnosing failures (HTTP status, response body snippet,
       * retry timing).
       *
       * @requires `canManageWebhooks` on the workspace.
       */
      async listWebhookDeliveries(workspaceId, webhookId, params = {}) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!webhookId) throw new Error("webhookId is required.");
        const search = new URLSearchParams();
        if (params.limit !== void 0) search.set("limit", String(params.limit));
        if (params.cursor !== void 0) search.set("cursor", params.cursor);
        if (params.status !== void 0) search.set("status", params.status);
        const qs = search.toString();
        return client._request({
          method: "GET",
          endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}/deliveries${qs ? `?${qs}` : ""}`,
          sendJWT: true,
          bypassCache: true
        });
      },
      /**
       * Re-fire a specific past delivery attempt. Useful for confirming a
       * receiver fix without waiting for the next real event.
       *
       * @requires `canManageWebhooks` on the workspace.
       */
      async replayWebhookDelivery(workspaceId, webhookId, attemptId) {
        if (!workspaceId) throw new Error("workspaceId is required.");
        if (!webhookId) throw new Error("webhookId is required.");
        if (!attemptId) throw new Error("attemptId is required.");
        return client._request({
          method: "POST",
          endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}/deliveries/${attemptId}/replay`,
          sendJWT: true
        });
      }
    };
  }

  // src/routes/supportTicket.ts
  function createSupportTicketMethods(client) {
    const buildQuery = (params = {}) => {
      const search = new URLSearchParams();
      for (const [key, value2] of Object.entries(params)) {
        if (value2 === void 0 || value2 === null || value2 === "") continue;
        search.set(key, String(value2));
      }
      const query = search.toString();
      return query ? `?${query}` : "";
    };
    return {
      /** Create a ticket. The opening message body becomes the first thread entry. */
      async createSupportTicket(data) {
        if (!data?.scopeType) throw new Error("scopeType is required.");
        if (data.scopeType !== "user" && !data.scopeId) {
          throw new Error("scopeId is required for workspace/project scope.");
        }
        if (!data?.subject) throw new Error("subject is required.");
        if (!data?.body) throw new Error("body is required.");
        return client._request({ endpoint: "/v1/support-tickets", method: "POST", body: data, sendJWT: true });
      },
      /** List the caller's own tickets + (for resource admins) tickets in their scope. */
      async listSupportTickets(params = {}) {
        return client._request({ endpoint: `/v1/support-tickets${buildQuery(params)}`, method: "GET", sendJWT: true });
      },
      async getSupportTicket(ticketId) {
        if (!ticketId) throw new Error("ticketId is required.");
        return client._request({
          endpoint: `/v1/support-tickets/${encodeURIComponent(ticketId)}`,
          method: "GET",
          sendJWT: true
        });
      },
      /** Workspaces/projects the caller may scope a new ticket to. */
      async getSupportTicketScopeOptions() {
        return client._request({ endpoint: "/v1/support-tickets/scope-options", method: "GET", sendJWT: true });
      }
    };
  }

  // src/version.ts
  var SDK_VERSION = {
    version: "1.4.0",
    buildTimestamp: "2026-10-03T11:17:12.715Z",
    buildHash: "60ddbec0797c9d1bdf96aaf49b69dda5",
    gitCommit: "626c707",
    dirty: false
  };

  // src/NuramaClient.ts
  var NuramaClient = class {
    /**
     * Creates an instance of NuramaClient.
     * @param baseURL - The base URL for the Nurama API.
     * @param options - Configuration options.
     */
    constructor(baseURL, options = {}) {
      this.browserMode = false;
      this._accessToken = null;
      this._refreshTokenValue = null;
      this._accessTokenExpiry = null;
      this._refreshTokenExpiry = null;
      this._verifyMfaToken = null;
      this._isRefreshing = false;
      this._lastRefreshAttempt = 0;
      this._cache = /* @__PURE__ */ new Map();
      // Bumped on any cache clear/invalidation so a GET already in flight won't
      // re-cache a response body that predates the clear.
      this._cacheGeneration = 0;
      this._apiKey = null;
      if (!baseURL) {
        throw new Error("baseURL is required.");
      }
      const defaultFetch = typeof fetch !== "undefined" ? fetch : void 0;
      this.baseURL = baseURL.replace(/\/$/, "");
      this.browserMode = options.browserMode || false;
      let effectiveFetch;
      if (options.fetch) {
        effectiveFetch = options.fetch;
      } else if (this.browserMode && typeof window !== "undefined" && window.fetch) {
        effectiveFetch = (url2, init) => window.fetch(url2, init);
      } else {
        effectiveFetch = defaultFetch;
      }
      if (!effectiveFetch) {
        throw new Error("Fetch implementation not found. Please provide one in options or ensure global fetch is available.");
      }
      this.fetch = effectiveFetch;
      this.tokenStorageKey = options.tokenStorageKey || "nurama_access_token";
      this.refreshTokenStorageKey = options.refreshTokenStorageKey || "nurama_refresh_token";
      this.tokenExpiryBufferSeconds = options.tokenExpiryBufferSeconds === void 0 ? 60 : options.tokenExpiryBufferSeconds;
      this.refreshLockTimeoutMs = options.refreshLockTimeoutMs === void 0 ? 1e3 : options.refreshLockTimeoutMs;
      this.tokenRefreshRetryDelayMs = options.tokenRefreshRetryDelayMs === void 0 ? 100 : options.tokenRefreshRetryDelayMs;
      this.tokenRefreshMaxWaitMs = options.tokenRefreshMaxWaitMs === void 0 ? 1e3 : options.tokenRefreshMaxWaitMs;
      this.debug = options.debug || false;
      this.websocketURL = options.websocketURL;
      this.enableCache = options.enableCache === void 0 ? true : options.enableCache;
      this.cacheDurationSeconds = options.cacheDurationSeconds === void 0 ? 5 : options.cacheDurationSeconds;
      this.invalidateCacheOnMutation = options.invalidateCacheOnMutation === void 0 ? true : options.invalidateCacheOnMutation;
      this._onUnauthorized = options.onUnauthorized;
      this._onMaintenance = options.onMaintenance;
      this._apiKey = options.apiKey || null;
      if (this.browserMode && !this._apiKey) {
        this._loadTokens();
      }
      this.auth = createAuthMethods(this);
      this.subscription = createSubscriptionMethods(this);
      this.user = createUserMethods(this);
      this.workspace = createWorkspaceMethods(this);
      this.project = createProjectMethods(this);
      this.asset = createAssetMethods(this);
      this.chat = createChatMethods(this);
      this.folder = createFolderMethods(this);
      this.invite = createInviteMethods(this);
      this.joinLink = createJoinLinkMethods(this);
      this.membership = createMembershipMethods(this);
      this.notification = createNotificationMethods(this);
      this.payment = createPaymentMethods(this);
      this.product = createProductMethods(this);
      this.socket = createSocketMethods(this);
      this.storage = createStorageMethods(this);
      this.task = createTaskMethods(this);
      this.version = createVersionMethods(this);
      this.config = createConfigMethods(this);
      this.tag = createTagMethods(this);
      this.public = createPublicMethods(this);
      this.settings = createSettingsMethods(this);
      this.device = createDeviceMethods(this);
      this.shortlink = createShortLinkMethods(this);
      this.convo = createConvoMethods(this);
      this.board = createBoardMethods(this);
      this.taskRelation = createTaskRelationMethods(this);
      this.bot = createBotMethods(this);
      this.ai = createAiMethods(this);
      this.aiChat = createAiChatMethods(this);
      this.supportChat = createSupportChatMethods(this);
      this.blogPosts = createBlogPostsMethods(this);
      this.credits = createCreditsMethods(this);
      this.scratch = createScratchMethods(this);
      this.token = createTokenMethods(this);
      this.webhook = createWebhookMethods(this);
      this.supportTicket = createSupportTicketMethods(this);
    }
    /**
     * Internal helper for conditional logging. Underscore-prefixed to flag
     * "internal contract" — accessible from sibling route modules but not
     * part of the documented public API.
     *
     * @param args - Arguments to pass to console.log.
     */
    _log(...args) {
      if (this.debug) {
        console.log(...args);
      }
    }
    /**
     * Checks if a POST endpoint is safe to cache (read-only query operations).
     * @param endpoint - The API endpoint to check.
     * @returns True if the POST endpoint is cacheable, false otherwise.
     * @private
     */
    _isCacheablePostEndpoint(endpoint) {
      const cacheablePostEndpoints = [
        "/v1/notifications/count",
        "/v1/notifications/count/bulk",
        "/v1/notifications",
        "/v1/notifications/new",
        "/v1/notifications/last-seen"
      ];
      return cacheablePostEndpoints.some((cacheableEndpoint) => endpoint === cacheableEndpoint);
    }
    /**
     * Generates a cache key for a request.
     * @param options - Request configuration.
     * @returns A unique cache key string.
     * @private
     */
    _generateCacheKey(options) {
      const { endpoint, method = "GET", params = {}, body = null } = options;
      const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
      return JSON.stringify({
        endpoint,
        method,
        params: sortedParams,
        body
      });
    }
    /**
     * Checks if a cache entry is still valid.
     * @param entry - The cache entry to check.
     * @returns True if the entry is still valid, false otherwise.
     * @private
     */
    _isCacheEntryValid(entry) {
      const now = Date.now();
      const maxAge = this.cacheDurationSeconds * 1e3;
      return now - entry.timestamp < maxAge;
    }
    /**
     * Gets a cached response if available and valid.
     * @param cacheKey - The cache key to look up.
     * @returns The cached data or null if not found/expired.
     * @private
     */
    _getCachedResponse(cacheKey) {
      const entry = this._cache.get(cacheKey);
      if (!entry) return null;
      if (this._isCacheEntryValid(entry)) {
        this._log("[DEBUG] Cache hit for key:", cacheKey);
        return entry.data;
      } else {
        this._cache.delete(cacheKey);
        this._log("[DEBUG] Cache entry expired and removed for key:", cacheKey);
        return null;
      }
    }
    /**
     * Stores a response in the cache.
     * @param cacheKey - The cache key.
     * @param data - The data to cache.
     * @private
     */
    _setCachedResponse(cacheKey, data) {
      this._cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      this._log("[DEBUG] Cached response for key:", cacheKey);
    }
    /**
     * Gets or sets a pending promise for concurrent requests.
     * @param cacheKey - The cache key.
     * @param promise - The promise to store (optional).
     * @returns The existing or new promise.
     * @private
     */
    _getPendingPromise(cacheKey, promise) {
      const entry = this._cache.get(cacheKey);
      if (promise) {
        if (entry) {
          entry.promise = promise;
        } else {
          this._cache.set(cacheKey, {
            data: null,
            timestamp: Date.now(),
            promise
          });
        }
        return promise;
      }
      if (entry?.promise && this._isCacheEntryValid(entry)) {
        this._log("[DEBUG] Returning pending promise for concurrent request:", cacheKey);
        return entry.promise;
      }
      return null;
    }
    /**
     * Clears the pending promise from a cache entry.
     * @param cacheKey - The cache key.
     * @private
     */
    _clearPendingPromise(cacheKey) {
      const entry = this._cache.get(cacheKey);
      if (entry) {
        delete entry.promise;
      }
    }
    /**
     * True if a request is a write that should invalidate cached reads for its
     * resource. Cacheable "read" POSTs (query endpoints) are excluded.
     * @private
     */
    _isMutation(method, endpoint) {
      const m = (method || "GET").toUpperCase();
      if (m === "PUT" || m === "PATCH" || m === "DELETE") return true;
      if (m === "POST") return !this._isCacheablePostEndpoint(endpoint);
      return false;
    }
    /**
     * True if a path segment looks like a resource id (UUID or numeric) rather
     * than a collection name.
     * @private
     */
    _looksLikeSegmentId(segment) {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) || /^\d+$/.test(segment);
    }
    /**
     * The resource "collection" a mutation acts on — the deepest non-id,
     * non-version path segment (e.g. `/v1/workspaces/:id/projects` -> `projects`,
     * `DELETE /v1/projects/:id` -> `projects`).
     * @private
     */
    _resourceToken(endpoint) {
      const path = (endpoint || "").split("?")[0];
      const segments = path.split("/").filter(Boolean);
      for (let i = segments.length - 1; i >= 0; i -= 1) {
        const seg = segments[i];
        if (seg === "v1" || this._looksLikeSegmentId(seg)) continue;
        return seg;
      }
      return null;
    }
    /**
     * Evict cached GET responses that belong to the same resource collection as a
     * just-completed write, so the next read is fresh. Matches the parent-nested
     * list form too — a `POST /v1/projects` also evicts a cached
     * `/v1/workspaces/:id/projects` because both paths contain the `projects`
     * segment. Cross-resource relationships that don't share a path segment
     * (e.g. a payment write vs the subscription read) are NOT covered here and
     * are handled at their call sites.
     * @private
     */
    _invalidateForMutation(endpoint) {
      this._cacheGeneration++;
      const token = this._resourceToken(endpoint);
      if (!token) {
        this._cache.clear();
        return;
      }
      for (const key of Array.from(this._cache.keys())) {
        let cachedEndpoint = "";
        try {
          cachedEndpoint = JSON.parse(key).endpoint || "";
        } catch {
          continue;
        }
        const segments = cachedEndpoint.split("?")[0].split("/").filter(Boolean);
        if (segments.includes(token)) {
          this._cache.delete(key);
        }
      }
      this._log("[DEBUG] Invalidated cached reads for resource:", token);
    }
    /**
     * Sets the access and refresh tokens with optional expiration timestamps.
     * @param accessToken - The JWT access token or null to clear.
     * @param refreshToken - The refresh token or null to clear.
     * @param accessTokenExpiry - ISO timestamp when access token expires (optional).
     * @param refreshTokenExpiry - ISO timestamp when refresh token expires (optional).
     * @private
     */
    _setTokens(accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry) {
      this._log("[DEBUG] Setting tokens. Access:", accessToken ? "Yes" : "No", "Refresh:", refreshToken ? "Yes" : "No");
      this._accessToken = accessToken;
      this._refreshTokenValue = refreshToken;
      this._accessTokenExpiry = accessTokenExpiry || null;
      this._refreshTokenExpiry = refreshTokenExpiry || null;
      if (!accessToken && !refreshToken) {
        this._verifyMfaToken = null;
      }
      if (this.browserMode) {
        try {
          if (accessToken) {
            localStorage.setItem(this.tokenStorageKey, accessToken);
          } else {
            localStorage.removeItem(this.tokenStorageKey);
          }
          if (refreshToken) {
            localStorage.setItem(this.refreshTokenStorageKey, refreshToken);
          } else {
            localStorage.removeItem(this.refreshTokenStorageKey);
          }
          if (accessTokenExpiry) {
            localStorage.setItem(`${this.tokenStorageKey}_expiry`, accessTokenExpiry);
          } else {
            localStorage.removeItem(`${this.tokenStorageKey}_expiry`);
          }
          if (refreshTokenExpiry) {
            localStorage.setItem(`${this.refreshTokenStorageKey}_expiry`, refreshTokenExpiry);
          } else {
            localStorage.removeItem(`${this.refreshTokenStorageKey}_expiry`);
          }
        } catch (e) {
          console.error("Failed to save tokens to localStorage:", e);
        }
      }
    }
    /**
     * Retrieves the current access token.
     * @returns The access token or null.
     * @private
     */
    _getAccessToken() {
      return this._accessToken;
    }
    /**
     * Retrieves the current refresh token.
     * @returns The refresh token or null.
     * @private
     */
    _getRefreshToken() {
      return this._refreshTokenValue;
    }
    /**
     * Sets the MFA verification token.
     * @param verifyMfaToken - The verify MFA token or null to clear.
     * @internal
     */
    _setVerifyMfaToken(verifyMfaToken) {
      this._log("[DEBUG] Setting verifyMfa token:", verifyMfaToken ? "Yes" : "No");
      this._verifyMfaToken = verifyMfaToken;
    }
    /**
     * Retrieves the current verify MFA token.
     * @returns The verify MFA token or null.
     * @internal
     */
    _getVerifyMfaToken() {
      return this._verifyMfaToken;
    }
    /**
     * Loads tokens and their expiration timestamps from storage (browser mode only).
     * @private
     */
    _loadTokens() {
      if (!this.browserMode) return;
      try {
        this._accessToken = localStorage.getItem(this.tokenStorageKey);
        this._refreshTokenValue = localStorage.getItem(this.refreshTokenStorageKey);
        this._accessTokenExpiry = localStorage.getItem(`${this.tokenStorageKey}_expiry`);
        this._refreshTokenExpiry = localStorage.getItem(`${this.refreshTokenStorageKey}_expiry`);
        this._log("[DEBUG] Loaded tokens from localStorage. Access:", this._accessToken ? "Yes" : "No", "Refresh:", this._refreshTokenValue ? "Yes" : "No");
        this._log("[DEBUG] Loaded token expiries. Access expiry:", this._accessTokenExpiry || "None", "Refresh expiry:", this._refreshTokenExpiry || "None");
      } catch (e) {
        console.error("Failed to load tokens from localStorage:", e);
        this._accessToken = null;
        this._refreshTokenValue = null;
        this._accessTokenExpiry = null;
        this._refreshTokenExpiry = null;
      }
    }
    /**
     * Checks if the current access token is expired or close to expiring.
     * @returns True if the token is missing, expired, or needs refresh based on buffer.
     * @private
     */
    _isTokenExpired() {
      if (this._apiKey) return false;
      const token = this._getAccessToken();
      if (!token) return true;
      try {
        const decoded = jwtDecode(token);
        if (!decoded || typeof decoded.exp !== "number") {
          console.error("Invalid token or missing exp claim.");
          return true;
        }
        const expirationTimeMs = decoded.exp * 1e3;
        const currentTimeMs = Date.now();
        const bufferMs = this.tokenExpiryBufferSeconds * 1e3;
        const needsRefresh = currentTimeMs >= expirationTimeMs - bufferMs;
        if (needsRefresh && this.debug) {
          this._log(`[DEBUG] Token needs refresh. Current: ${new Date(currentTimeMs).toISOString()}, Expires: ${new Date(expirationTimeMs).toISOString()}, Buffer: ${this.tokenExpiryBufferSeconds}s`);
        }
        return needsRefresh;
      } catch (e) {
        console.error("Failed to decode or check token expiry:", e);
        return true;
      }
    }
    /**
     * Checks if the current JWT token exists and is valid.
     * @returns {boolean} True if the token exists and is valid, false otherwise.
     */
    tokenValid() {
      return !this._isTokenExpired();
    }
    /**
     * Gets the token expiration timestamps.
     * @returns Object containing access and refresh token expiry ISO timestamps.
     * @public
     */
    getTokenExpiry() {
      return {
        access: this._accessTokenExpiry,
        refresh: this._refreshTokenExpiry
      };
    }
    /**
     * Refreshes the access token using the stored refresh token.
     * Includes a time lock to prevent rapid concurrent refresh attempts.
     * @returns Promise resolving when refresh attempt is complete (or bypassed).
     * @private
     */
    async _refreshToken() {
      const now = Date.now();
      if (this._isRefreshing) {
        this._log("[DEBUG] Token refresh already in progress, waiting...");
        const waitStartTime = Date.now();
        while (this._isRefreshing) {
          if (Date.now() - waitStartTime > this.tokenRefreshMaxWaitMs) {
            console.error("Timed out waiting for token refresh to complete.");
            throw new Error("Timeout waiting for token refresh.");
          }
          await new Promise((resolve) => setTimeout(resolve, this.tokenRefreshRetryDelayMs));
        }
        this._log("[DEBUG] Other refresh process finished.");
        if (!this._isTokenExpired()) {
          this._log("[DEBUG] Token is now valid after waiting.");
          return;
        }
        if (now - this._lastRefreshAttempt < this.refreshLockTimeoutMs) {
          this._log(`[DEBUG] Refresh attempt too soon after waiting (last attempt: ${new Date(this._lastRefreshAttempt).toISOString()}, now: ${new Date(now).toISOString()})`);
          throw new Error("Token still requires refresh after wait, but locked due to recent attempt.");
        }
      } else if (now - this._lastRefreshAttempt < this.refreshLockTimeoutMs) {
        this._log(`[DEBUG] Refresh attempt too soon (last attempt: ${new Date(this._lastRefreshAttempt).toISOString()}, now: ${new Date(now).toISOString()})`);
        if (this._isTokenExpired()) {
          throw new Error("Token requires refresh, but locked due to recent attempt.");
        }
        return;
      }
      const refreshToken = this._getRefreshToken();
      if (!refreshToken) {
        this._log("[DEBUG] No refresh token available for _refreshToken.");
        this._setTokens(null, null);
        throw new Error("Refresh token not found.");
      }
      this._isRefreshing = true;
      this._lastRefreshAttempt = now;
      try {
        this._log("[DEBUG] Attempting token refresh...");
        const response = await this._request({
          endpoint: "/v1/auth/refresh-tokens",
          method: "POST",
          body: { refreshToken },
          sendJWT: false,
          _isInternalRefresh: true
        });
        if (response && response.access && response.access.token && response.refresh && response.refresh.token) {
          this._log("[DEBUG] Token refresh successful.");
          this._setTokens(
            response.access.token,
            response.refresh.token,
            response.access.expires,
            response.refresh.expires
          );
        } else {
          console.error("Invalid token refresh response:", response);
          this._setTokens(null, null);
          throw new Error("Invalid token refresh response structure.");
        }
      } catch (error) {
        console.error("Token refresh API call failed:", error);
        const isInvalidRefreshToken = error?.status === 401 || error?.status === 403;
        if (isInvalidRefreshToken) {
          this._log("[DEBUG] Refresh token is invalid (401/403), clearing all tokens");
          this._setTokens(null, null);
        } else {
          this._log("[DEBUG] Refresh failed due to network/server error, keeping refresh token for retry");
          this._setTokens(null, refreshToken, null, this._refreshTokenExpiry);
        }
        const wrapped = new Error("Token refresh failed.");
        wrapped.reasonType = error?.data?.type;
        throw wrapped;
      } finally {
        this._isRefreshing = false;
      }
    }
    /**
     * Makes an HTTP request to the API.
     * Handles token attachment and potential refresh.
     * @param options - Request configuration.
     * @returns The response data.
     * @private
     */
    async _request(options) {
      const { endpoint, method = "GET", params = {}, body = null, sendJWT = true, customHeaders = {}, _isInternalRefresh = false, bypassCache = false } = options;
      const cacheKey = this._generateCacheKey(options);
      const isCacheablePost = method === "POST" && this._isCacheablePostEndpoint(endpoint);
      const shouldUseCache = this.enableCache && !bypassCache && !_isInternalRefresh && (method === "GET" || method === "HEAD" || isCacheablePost);
      if (isCacheablePost) {
        this._log("[DEBUG] POST request eligible for caching:", endpoint);
      }
      if (shouldUseCache) {
        const cachedResponse = this._getCachedResponse(cacheKey);
        if (cachedResponse !== null) {
          return cachedResponse;
        }
        const pendingPromise = this._getPendingPromise(cacheKey);
        if (pendingPromise) {
          return pendingPromise;
        }
      }
      let token = this._apiKey || this._getAccessToken();
      if (!_isInternalRefresh && sendJWT === true && !this._apiKey) {
        if (this._isTokenExpired()) {
          try {
            await this._refreshToken();
            token = this._getAccessToken();
          } catch (refreshError) {
            console.error("Token refresh failed during request:", refreshError);
            this._setTokens(null, null);
            if (this._onUnauthorized) {
              this._onUnauthorized({ type: refreshError?.reasonType });
            }
            throw new Error("Authentication required due to refresh failure.");
          }
          if (!token) {
            if (this._onUnauthorized) {
              this._onUnauthorized();
            }
            throw new Error("Authentication required, token unavailable after refresh attempt.");
          }
        }
      } else if (!_isInternalRefresh && sendJWT === "optional" && !this._apiKey) {
        if (token && this._isTokenExpired()) {
          try {
            await this._refreshToken();
            token = this._getAccessToken();
          } catch {
            token = null;
          }
        }
      }
      const headers = {
        "Content-Type": "application/json",
        ...customHeaders
      };
      if (sendJWT && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const config = {
        method,
        headers
      };
      if (body && (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE")) {
        if (headers["Content-Type"] === "application/json") {
          config.body = JSON.stringify(body);
        } else {
          config.body = body;
          delete headers["Content-Type"];
        }
      }
      const safeParams = params && typeof params === "object" && !Array.isArray(params) ? params : {};
      const filteredParams = Object.entries(safeParams).filter(([, value2]) => value2 !== void 0 && value2 !== null).reduce((acc, [key, value2]) => {
        acc[key] = value2;
        return acc;
      }, {});
      const searchParams = paramsToUrlSearchParams(filteredParams, { arrayFormat: "repeat" });
      const url2 = `${this.baseURL}${endpoint}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      this._log(`[DEBUG] API Request: ${method} ${url2}`, body ? { Body: body } : "");
      const cacheGenerationAtStart = this._cacheGeneration;
      const requestPromise = this._executeRequest(url2, config);
      if (shouldUseCache) {
        this._getPendingPromise(cacheKey, requestPromise);
      }
      try {
        const result = await requestPromise;
        if (shouldUseCache && result !== null && this._cacheGeneration === cacheGenerationAtStart) {
          this._setCachedResponse(cacheKey, result);
        }
        if (this.enableCache && this.invalidateCacheOnMutation && !_isInternalRefresh && this._isMutation(method, endpoint)) {
          this._invalidateForMutation(endpoint);
        }
        return result;
      } finally {
        if (shouldUseCache) {
          this._clearPendingPromise(cacheKey);
        }
      }
    }
    /**
     * Executes the actual HTTP request.
     * @param url - The complete URL to request.
     * @param config - The fetch configuration.
     * @returns The response data.
     * @private
     */
    async _executeRequest(url2, config) {
      try {
        const response = await this.fetch(url2, config);
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
            this._log("[DEBUG] API Error Response Body:", errorData);
          } catch (error2) {
            errorData = { message: response.statusText };
            this._log(`[DEBUG] API Error Response Text: ${response.statusText}`);
          }
          if ((response.status === 418 || response.status === 503) && errorData?.error === "maintenance" && this._onMaintenance) {
            try {
              this._onMaintenance();
            } catch {
            }
          }
          const error = new Error(errorData.message || errorData.type || `HTTP error! status: ${response.status}`);
          error.status = response.status;
          error.data = errorData;
          throw error;
        }
        if (response.status === 204) {
          this._log(`[DEBUG] API Response: ${response.status} No Content`);
          return null;
        }
        try {
          const responseData = await response.json();
          this._log(`[DEBUG] API Response: ${response.status}`, responseData);
          return responseData;
        } catch (error) {
          this._log(`[DEBUG] API Response OK but failed to parse as JSON: ${response.status}`, response);
          return null;
        }
      } catch (error) {
        const apiError = error;
        if (!(error instanceof Error && apiError.status)) {
          console.error(`[ERROR] API request failed: ${config.method} ${url2}`, error);
        } else {
          this._log(`[DEBUG] API Error Caught: ${config.method} ${url2}`, error);
        }
        throw error;
      }
    }
    /**
     * Gets the current user's ID from the JWT token.
     * @returns {string | null} The user ID if available, null otherwise.
     */
    getUserId() {
      const token = this._getAccessToken();
      if (!token) return null;
      try {
        const decoded = jwtDecode(token);
        return decoded?.sub || null;
      } catch (e) {
        console.error("Failed to decode token:", e);
        return null;
      }
    }
    /**
     * Gets the SDK version information including build timestamp and hash.
     * Useful for debugging and verifying which SDK version is in use.
     * @returns {SDKVersionInfo} SDK version, build timestamp, build hash, and git commit
     */
    getVersion() {
      return SDK_VERSION;
    }
    /**
     * Clears the response cache.
     * @public
     */
    clearCache() {
      this._cache.clear();
      this._cacheGeneration++;
      this._log("[DEBUG] Cache cleared");
    }
    /**
     * Gets cache statistics for debugging.
     * @returns Object containing cache statistics.
     * @public
     */
    getCacheStats() {
      const entries = Array.from(this._cache.entries()).map(([key, entry]) => ({
        key,
        timestamp: entry.timestamp,
        hasData: entry.data !== null && entry.data !== void 0,
        hasPendingPromise: !!entry.promise
      }));
      return {
        size: this._cache.size,
        entries
      };
    }
  };
  var NuramaClient_default = NuramaClient;

  // src/BotClient.ts
  var DEFAULT_BOT_BASE_URL = "https://bot.nurama.com";
  var DEFAULT_BOT_WS_URL = "https://bot-ws.nurama.com";
  var KEY_PREFIX = "nrm_bot_";
  var BotClient = class {
    /**
     * @param apiKey - Bot API key in the format `nrm_bot_{prefix}_{secret}`.
     * @param options - Configuration overrides.
     */
    constructor(apiKey, options = {}) {
      if (!apiKey) {
        throw new Error("apiKey is required.");
      }
      if (!apiKey.startsWith(KEY_PREFIX)) {
        throw new Error(`Invalid bot API key. Expected format: ${KEY_PREFIX}{prefix}_{secret}.`);
      }
      this._client = new NuramaClient_default(options.baseURL || DEFAULT_BOT_BASE_URL, {
        apiKey,
        fetch: options.fetch,
        debug: options.debug,
        enableCache: options.enableCache,
        cacheDurationSeconds: options.cacheDurationSeconds,
        websocketURL: options.websocketURL || DEFAULT_BOT_WS_URL
      });
      this.workspace = this._client.workspace;
      this.project = this._client.project;
      this.asset = this._client.asset;
      this.chat = this._client.chat;
      this.aiChat = this._client.aiChat;
      this.folder = this._client.folder;
      this.invite = this._client.invite;
      this.membership = this._client.membership;
      this.notification = this._client.notification;
      this.storage = this._client.storage;
      this.task = this._client.task;
      this.taskRelation = this._client.taskRelation;
      this.tag = this._client.tag;
      this.settings = this._client.settings;
      this.shortlink = this._client.shortlink;
      this.convo = this._client.convo;
      this.board = this._client.board;
      this.version = this._client.version;
      this.config = this._client.config;
      this.product = this._client.product;
      this.public = this._client.public;
      this.socket = this._client.socket;
    }
  };
  var BotClient_default = BotClient;

  // src/bot-browser-entry.js
  var OriginalBotClient = BotClient_default;
  var BrowserBotClient = class extends OriginalBotClient {
    constructor(apiKey, options = {}) {
      super(apiKey, {
        ...options,
        fetch: options.fetch || ((url2, init) => window.fetch(url2, init))
      });
    }
  };
  window.NuramaBotClient = BrowserBotClient;
  var bot_browser_entry_default = BrowserBotClient;
})();

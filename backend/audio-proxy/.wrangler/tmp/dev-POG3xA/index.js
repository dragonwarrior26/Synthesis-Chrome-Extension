var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-t12Zmc/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
var init_strip_cf_connecting_ip_header = __esm({
  ".wrangler/tmp/bundle-t12Zmc/strip-cf-connecting-ip-header.js"() {
    "use strict";
    __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [
          stripCfConnectingIPHeader.apply(null, argArray)
        ]);
      }
    });
  }
});

// node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    __name(PerformanceEntry, "PerformanceEntry");
    PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    }, "PerformanceMark");
    PerformanceMeasure = class extends PerformanceEntry {
      entryType = "measure";
    };
    __name(PerformanceMeasure, "PerformanceMeasure");
    PerformanceResourceTiming = class extends PerformanceEntry {
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name(PerformanceResourceTiming, "PerformanceResourceTiming");
    PerformanceObserverEntryList = class {
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
    Performance = class {
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    __name(Performance, "Performance");
    PerformanceObserver = class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    __name(PerformanceObserver, "PerformanceObserver");
    __publicField(PerformanceObserver, "supportedEntryTypes", []);
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class extends Socket {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      isRaw = false;
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
      isTTY = false;
    };
    __name(ReadStream, "ReadStream");
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class extends Socket2 {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      columns = 80;
      rows = 24;
      isTTY = false;
    };
    __name(WriteStream, "WriteStream");
  }
});

// node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process = class extends EventEmitter {
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: () => 0 });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    __name(Process, "Process");
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// ../../node_modules/.pnpm/wrangler@3.114.16_@cloudflare+workers-types@4.20260103.0/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../node_modules/.pnpm/wrangler@3.114.16_@cloudflare+workers-types@4.20260103.0/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/RequestError.js
var require_RequestError = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/RequestError.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var RequestError = class extends Error {
      constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 0;
      }
    };
    __name(RequestError, "RequestError");
    exports.default = RequestError;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/PlayerRequestError.js
var require_PlayerRequestError = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/PlayerRequestError.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var RequestError_1 = __importDefault(require_RequestError());
    var PlayerRequestError = class extends RequestError_1.default {
      constructor(message, response, statusCode) {
        super(message);
        this.response = response;
        this.statusCode = statusCode || 0;
      }
    };
    __name(PlayerRequestError, "PlayerRequestError");
    exports.default = PlayerRequestError;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/UnrecoverableError.js
var require_UnrecoverableError = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/UnrecoverableError.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnrecoverableError = class extends Error {
      constructor(message, playabilityStatus = null) {
        super(message);
        this.playabilityStatus = playabilityStatus;
      }
    };
    __name(UnrecoverableError, "UnrecoverableError");
    exports.default = UnrecoverableError;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/PlatformError.js
var require_PlatformError = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/PlatformError.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlatformError = class extends Error {
      constructor(message) {
        super(message);
      }
    };
    __name(PlatformError, "PlatformError");
    exports.default = PlatformError;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/index.js
var require_errors = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/errors/index.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlatformError = exports.RequestError = exports.UnrecoverableError = exports.PlayerRequestError = void 0;
    var PlayerRequestError_1 = require_PlayerRequestError();
    Object.defineProperty(exports, "PlayerRequestError", { enumerable: true, get: function() {
      return __importDefault(PlayerRequestError_1).default;
    } });
    var UnrecoverableError_1 = require_UnrecoverableError();
    Object.defineProperty(exports, "UnrecoverableError", { enumerable: true, get: function() {
      return __importDefault(UnrecoverableError_1).default;
    } });
    var RequestError_1 = require_RequestError();
    Object.defineProperty(exports, "RequestError", { enumerable: true, get: function() {
      return __importDefault(RequestError_1).default;
    } });
    var PlatformError_1 = require_PlatformError();
    Object.defineProperty(exports, "PlatformError", { enumerable: true, get: function() {
      return __importDefault(PlatformError_1).default;
    } });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Log.js
var require_Log = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Log.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Logger = void 0;
    var Platform_1 = require_Platform();
    var OTHER_CONTROL_CHARACTER = {
      red: "",
      green: "",
      yellow: "",
      blue: "",
      magenta: "",
      reset: ""
    };
    var DEFAULT_CONTROL_CHARACTER = {
      red: "\x1B[31m",
      green: "\x1B[32m",
      yellow: "\x1B[33m",
      blue: "\x1B[34m",
      magenta: "\x1B[35m",
      reset: "\x1B[0m"
    };
    var Logger = class {
      static replaceColorTags(message) {
        try {
          message = message.replace(/<magenta>/g, this.outputControlCharacter.magenta);
          message = message.replace(/<\/magenta>/g, this.outputControlCharacter.reset);
          message = message.replace(/<debug>/g, this.outputControlCharacter.magenta);
          message = message.replace(/<\/debug>/g, this.outputControlCharacter.reset);
          message = message.replace(/<blue>/g, this.outputControlCharacter.blue);
          message = message.replace(/<\/blue>/g, this.outputControlCharacter.reset);
          message = message.replace(/<info>/g, this.outputControlCharacter.blue);
          message = message.replace(/<\/info>/g, this.outputControlCharacter.reset);
          message = message.replace(/<green>/g, this.outputControlCharacter.green);
          message = message.replace(/<\/green>/g, this.outputControlCharacter.reset);
          message = message.replace(/<success>/g, this.outputControlCharacter.green);
          message = message.replace(/<\/success>/g, this.outputControlCharacter.reset);
          message = message.replace(/<yellow>/g, this.outputControlCharacter.yellow);
          message = message.replace(/<\/yellow>/g, this.outputControlCharacter.reset);
          message = message.replace(/<warning>/g, this.outputControlCharacter.yellow);
          message = message.replace(/<\/warning>/g, this.outputControlCharacter.reset);
          message = message.replace(/<red>/g, this.outputControlCharacter.red);
          message = message.replace(/<\/red>/g, this.outputControlCharacter.reset);
          message = message.replace(/<error>/g, this.outputControlCharacter.red);
          message = message.replace(/<\/error>/g, this.outputControlCharacter.reset);
        } catch {
        }
        return message;
      }
      static convertMessage(message) {
        return this.replaceColorTags(message);
      }
      static convertMessages(messages) {
        return messages.map((m) => this.replaceColorTags(m));
      }
      static initialization() {
        const RUNTIME = Platform_1.Platform.getShim().runtime, IS_DEFAULT_RUNTIME = RUNTIME === "default";
        if (IS_DEFAULT_RUNTIME) {
          this.outputControlCharacter = DEFAULT_CONTROL_CHARACTER;
        }
      }
      static debug(...messages) {
        if (this.logDisplay.includes("debug")) {
          console.log(this.convertMessage("<debug>[  DEBUG  ]:</debug>"), ...this.convertMessages(messages));
        }
      }
      static info(...messages) {
        if (this.logDisplay.includes("info")) {
          console.info(this.convertMessage("<info>[  INFO!  ]:</info>"), ...this.convertMessages(messages));
        }
      }
      static success(...messages) {
        if (this.logDisplay.includes("success")) {
          console.log(this.convertMessage("<success>[ SUCCESS ]:</success>"), ...this.convertMessages(messages));
        }
      }
      static warning(...messages) {
        if (this.logDisplay.includes("warning")) {
          console.warn(this.convertMessage("<warning>[ WARNING ]:</warning>"), ...this.convertMessages(messages));
        }
      }
      static error(...messages) {
        if (this.logDisplay.includes("error")) {
          console.error(this.convertMessage("<error>[  ERROR  ]:</error>"), ...this.convertMessages(messages));
        }
      }
    };
    __name(Logger, "Logger");
    exports.Logger = Logger;
    Logger.logDisplay = ["info", "success", "warning", "error"];
    Logger.outputControlCharacter = OTHER_CONTROL_CHARACTER;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/platforms/Platform.js
var require_Platform = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/platforms/Platform.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _a;
    var _Platform_shim;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Platform = void 0;
    var errors_1 = require_errors();
    var Log_1 = require_Log();
    var Platform = class {
      static load(shim) {
        shim.fileCache.initialization();
        __classPrivateFieldSet(this, _a, shim, "f", _Platform_shim);
        Log_1.Logger.initialization();
      }
      static getShim() {
        if (!__classPrivateFieldGet(this, _a, "f", _Platform_shim)) {
          throw new errors_1.PlatformError("Platform is not loaded");
        }
        return __classPrivateFieldGet(this, _a, "f", _Platform_shim);
      }
    };
    __name(Platform, "Platform");
    exports.Platform = Platform;
    _a = Platform;
    _Platform_shim = { value: void 0 };
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package.json
var require_package = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package.json"(exports, module) {
    module.exports = {
      name: "@ybd-project/ytdl-core",
      version: "6.0.8",
      description: "YBD Project fork of ytdl-core.",
      author: "YBD Project",
      repository: {
        type: "git",
        url: "git://github.com/ybd-project/ytdl-core.git"
      },
      engines: {
        node: ">=16.0"
      },
      main: "./package/platforms/Default/Default.js",
      types: "./package/platforms/Default/Default.d.ts",
      exports: {
        ".": {
          types: "./package/platforms/Default/Default.d.ts",
          node: {
            import: "./package/platforms/Default/Default.js",
            require: "./bundle/node.cjs"
          },
          browser: "./package/platforms/Browser/Browser.js",
          default: "./package/platforms/Default/Default.js"
        },
        "./default": {
          types: "./package/platforms/Default/Default.d.ts",
          default: "./package/platforms/Default/Default.js"
        },
        "./default.bundle": {
          types: "./package/platforms/Default/Default.d.ts",
          default: "./bundle/node.cjs"
        },
        "./browser": {
          types: "./package/platforms/Browser/Browser.d.ts",
          default: "./package/platforms/Browser/Browser.js"
        },
        "./browser.bundle": {
          types: "./package/platforms/Browser/Browser.d.ts",
          default: "./bundle/browser.min.js"
        },
        "./serverless": {
          types: "./package/platforms/Serverless/Serverless.d.ts",
          default: "./package/platforms/Serverless/Serverless.js"
        },
        "./serverless.bundle": {
          types: "./package/platforms/Serverless/Serverless.d.ts",
          default: "./bundle/serverless.cjs"
        },
        "./types": {
          types: "./package/types/index.d.ts",
          default: "./package/types/index.d.ts"
        }
      },
      files: [
        "package",
        "bundle"
      ],
      scripts: {
        test: "npx jest ./test/main.test.ts --detectOpenHandles",
        "clear-cache-files": "cd package/core && rmdir /s /q CacheFiles 2>nul & cd ../..",
        build: "node ./scripts/getPlayerData.mjs && rmdir /s /q package & tsc && tsc-alias && npm run clear-cache-files && npm run create-bundles",
        "publish:npm": "node ./scripts/publish.mjs latest && npm run build && npm publish --registry=https://registry.npmjs.org/",
        "publish:npm-alpha": "node ./scripts/publish.mjs alpha && npm run build && npm publish --registry=https://registry.npmjs.org/ --tag alpha",
        "publish:npm-beta": "node ./scripts/publish.mjs beta && npm run build && npm publish --registry=https://registry.npmjs.org/ --tag beta",
        "create-bundles": "npm run create-node-bundle && npm run create-browser-bundle && npm run create-serverless-bundle",
        "create-node-bundle": "rmdir /s /q bundle & mkdir bundle && esbuild ./package/platforms/Default/Default.js --bundle --target=node16 --keep-names --format=cjs --platform=node --outfile=./bundle/node.cjs --minify",
        "create-browser-bundle": "node ./scripts/createBrowserBundle.mjs",
        "create-serverless-bundle": "esbuild ./package/platforms/Serverless/Serverless.js --bundle --target=node16 --keep-names --format=cjs --platform=node --outfile=./bundle/serverless.cjs --minify",
        update: "ncu && ncu -u && npm i",
        "deleteNodeModules:examples": "node ./scripts/deleteExamplesNodeModules.js"
      },
      dependencies: {
        acorn: "^8.14.0",
        "bgutils-js": "^3.0.0",
        jsdom: "^25.0.1",
        undici: "^6.20.1"
      },
      devDependencies: {
        "@inquirer/prompts": "^7.0.0",
        "@types/jest": "^29.5.13",
        "@types/jsdom": "^21.1.7",
        "@types/node": "^22.7.7",
        "@types/sax": "^1.2.7",
        esbuild: "^0.24.0",
        eslint: "^9.13.0",
        jest: "^29.7.0",
        "npm-check-updates": "^17.1.4",
        "ts-jest": "^29.2.5",
        "tsc-alias": "^1.8.10",
        typescript: "^5.6.3"
      },
      keywords: [
        "youtube",
        "video",
        "audio",
        "download",
        "getInfo",
        "ybd-project",
        "ytdl",
        "ytdl-core",
        "secure",
        "fast",
        "browser",
        "serverless",
        "typescript"
      ],
      license: "MIT"
    };
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Constants.js
var require_Constants = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Constants.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ISSUES_URL = exports.REPO_NAME = exports.USER_NAME = exports.VERSION = exports.CURRENT_PLAYER_ID = void 0;
    var package_json_1 = __importDefault(require_package());
    exports.CURRENT_PLAYER_ID = "0ccfa671";
    exports.VERSION = package_json_1.default.version;
    exports.USER_NAME = "ybd-project";
    exports.REPO_NAME = "ytdl-core";
    exports.ISSUES_URL = `https://github.com/${exports.USER_NAME}/${exports.REPO_NAME}/issues`;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Url.js
var require_Url = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Url.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Url = void 0;
    var BASE_URL = "https://www.youtube.com";
    var URL_REGEX = /^https?:\/\//;
    var ID_REGEX = /^[a-zA-Z0-9-_]{11}$/;
    var VALID_QUERY_DOMAINS = /* @__PURE__ */ new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "gaming.youtube.com"]);
    var VALID_PATH_DOMAINS = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts|live)\/)/;
    var Url = class {
      static getBaseUrl() {
        return BASE_URL;
      }
      static getPlayerJsUrl(playerId) {
        return `${BASE_URL}/s/player/${playerId}/player_ias.vflset/en_US/base.js`;
      }
      static getWatchPageUrl(id) {
        return `${BASE_URL}/watch?v=${id}`;
      }
      static getEmbedUrl(id) {
        return `${BASE_URL}/embed/${id}`;
      }
      static getIframeApiUrl() {
        return `${BASE_URL}/iframe_api`;
      }
      static getInnertubeBaseUrl() {
        return `${BASE_URL}/youtubei/v1`;
      }
      static getTvUrl() {
        return `${BASE_URL}/tv`;
      }
      static getTokenApiUrl() {
        return `${BASE_URL}/o/oauth2/token`;
      }
      static getDeviceCodeApiUrl() {
        return `${BASE_URL}/o/oauth2/device/code`;
      }
      static validateID(id) {
        return ID_REGEX.test(id.trim());
      }
      static getURLVideoID(link) {
        const PARSED = new URL(link.trim());
        let id = PARSED.searchParams.get("v");
        if (VALID_PATH_DOMAINS.test(link.trim()) && !id) {
          const PATHS = PARSED.pathname.split("/");
          id = PARSED.host === "youtu.be" ? PATHS[1] : PATHS[2];
        } else if (PARSED.hostname && !VALID_QUERY_DOMAINS.has(PARSED.hostname)) {
          throw new Error("Not a YouTube domain");
        }
        if (!id) {
          throw new Error(`No video id found: "${link}"`);
        }
        id = id.substring(0, 11);
        if (!this.validateID(id)) {
          throw new TypeError(`Video id (${id}) does not match expected format (${ID_REGEX.toString()})`);
        }
        return id;
      }
      static getVideoID(str) {
        if (this.validateID(str)) {
          return str;
        } else if (URL_REGEX.test(str.trim())) {
          return this.getURLVideoID(str);
        } else {
          return null;
        }
      }
      static validateURL(str) {
        try {
          this.getURLVideoID(str);
          return true;
        } catch (e) {
          return false;
        }
      }
    };
    __name(Url, "Url");
    exports.Url = Url;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/UserAgents.js
var require_UserAgents = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/UserAgents.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserAgent = void 0;
    var USER_AGENTS = {
      desktop: [
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61"
      ],
      ios: [
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/127.0.0.0 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.1.45 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.2.98 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.3.110 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.5.72 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 14_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/122.0.4.82 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0.1.101 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.1.95 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/121.0.2.67 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0.0.85 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.3.92 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.5.105 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/127.0.2.56 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.1.30 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.4.102 Mobile/15E148 Safari/604.1"
      ],
      android: [
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.146 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 13; K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.127 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.128 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 11; K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.127 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.127 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 13; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.128 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 9; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.146 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 12; K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.127 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.127 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.105 Mobile Safari/537.36"
      ],
      tv: ["Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version"]
    };
    var UserAgent = class {
      static getRandomUserAgent(type) {
        const AGENTS = USER_AGENTS[type];
        if (AGENTS) {
          return AGENTS[Math.floor(Math.random() * AGENTS.length)];
        }
        return USER_AGENTS.desktop[0];
      }
    };
    __name(UserAgent, "UserAgent");
    exports.UserAgent = UserAgent;
    UserAgent.default = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
    UserAgent.ios = "com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)";
    UserAgent.android = "com.google.android.youtube/19.35.36(Linux; U; Android 13; en_US; SM-S908E Build/TP1A.220624.014) gzip";
    UserAgent.tv = "Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version";
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Fetcher.js
var require_Fetcher = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Fetcher.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Fetcher = void 0;
    var Platform_1 = require_Platform();
    var Log_1 = require_Log();
    var UserAgents_1 = require_UserAgents();
    var errors_1 = require_errors();
    var Fetcher = class {
      static async fetch(url, options, noProxyAdaptation = false) {
        const SHIM = Platform_1.Platform.getShim(), { rewriteRequest, originalProxy } = SHIM.requestRelated;
        if (!noProxyAdaptation) {
          if (typeof rewriteRequest === "function") {
            const WROTE_REQUEST = rewriteRequest(url, options || {}, { isDownloadUrl: false });
            options = WROTE_REQUEST.options;
            url = WROTE_REQUEST.url;
          }
          if (originalProxy) {
            try {
              const PARSED = new URL(originalProxy.base);
              if (!url.includes(PARSED.host)) {
                url = `${PARSED.protocol}//${PARSED.host}/?${originalProxy.urlQueryName || "url"}=${encodeURIComponent(url)}`;
              }
            } catch {
            }
          }
        }
        Log_1.Logger.debug(`[ Request ]: <magenta>${options?.method || "GET"}</magenta> -> ${url}`);
        const HEADERS = new SHIM.polyfills.Headers();
        if (options?.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            if (value) {
              HEADERS.append(key, value.toString());
            }
          });
        }
        if (!HEADERS.has("User-Agent")) {
          HEADERS.append("User-Agent", UserAgents_1.UserAgent.getRandomUserAgent("desktop"));
        }
        return await SHIM.fetcher(url, {
          method: options?.method || "GET",
          headers: HEADERS,
          body: options?.body?.toString()
        });
      }
      static async request(url, { requestOptions, rewriteRequest, originalProxy } = {}) {
        if (typeof rewriteRequest === "function") {
          const WROTE_REQUEST = rewriteRequest(url, requestOptions || {}, { isDownloadUrl: false });
          requestOptions = WROTE_REQUEST.options;
          url = WROTE_REQUEST.url;
        }
        if (originalProxy) {
          try {
            const PARSED = new URL(originalProxy.base);
            if (!url.includes(PARSED.host)) {
              url = `${PARSED.protocol}//${PARSED.host}${PARSED.pathname}?${originalProxy.urlQueryName || "url"}=${encodeURIComponent(url)}`;
            }
          } catch {
          }
        }
        const REQUEST_RESULTS = await Fetcher.fetch(url, {
          method: requestOptions?.method || "GET",
          headers: requestOptions?.headers,
          body: requestOptions?.body?.toString()
        }, true), STATUS_CODE = REQUEST_RESULTS.status.toString(), LOCATION = REQUEST_RESULTS.headers.get("location") || null;
        if (STATUS_CODE.startsWith("2")) {
          const CONTENT_TYPE = REQUEST_RESULTS.headers.get("content-type") || "";
          if (CONTENT_TYPE.includes("application/json")) {
            return REQUEST_RESULTS.json();
          }
          return REQUEST_RESULTS.text();
        } else if (STATUS_CODE.startsWith("3") && LOCATION) {
          return Fetcher.request(LOCATION.toString(), { requestOptions, rewriteRequest, originalProxy });
        }
        const ERROR = new errors_1.RequestError(`Status Code: ${STATUS_CODE}`, REQUEST_RESULTS.status);
        throw ERROR;
      }
    };
    __name(Fetcher, "Fetcher");
    exports.Fetcher = Fetcher;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/General.js
var require_General = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/General.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lastUpdateCheck = void 0;
    exports.between = between;
    exports.tryParseBetween = tryParseBetween;
    exports.parseAbbreviatedNumber = parseAbbreviatedNumber;
    exports.cutAfterJS = cutAfterJS;
    exports.checkForUpdates = checkForUpdates;
    exports.getPropInsensitive = getPropInsensitive;
    exports.setPropInsensitive = setPropInsensitive;
    exports.generateClientPlaybackNonce = generateClientPlaybackNonce;
    var Platform_1 = require_Platform();
    var Fetcher_1 = require_Fetcher();
    var Constants_1 = require_Constants();
    var Log_1 = require_Log();
    var ESCAPING_SEQUENCE = [
      { start: '"', end: '"' },
      { start: "'", end: "'" },
      { start: "`", end: "`" },
      { start: "/", end: "/", startPrefix: /(^|[[{:;,/])\s?$/ }
    ];
    var UPDATE_INTERVAL = 1e3 * 60 * 60 * 12;
    function findPropKeyInsensitive(obj, prop) {
      return Object.keys(obj).find((p) => p.toLowerCase() === prop.toLowerCase()) || null;
    }
    __name(findPropKeyInsensitive, "findPropKeyInsensitive");
    function between(haystack, left, right) {
      let pos = null;
      if (left instanceof RegExp) {
        const MATCH = haystack.match(left);
        if (!MATCH) {
          return "";
        }
        pos = (MATCH.index || 0) + MATCH[0].length;
      } else {
        pos = haystack.indexOf(left);
        if (pos === -1) {
          return "";
        }
        pos += left.length;
      }
      haystack = haystack.slice(pos);
      pos = haystack.indexOf(right);
      if (pos === -1) {
        return "";
      }
      haystack = haystack.slice(0, pos);
      return haystack;
    }
    __name(between, "between");
    function tryParseBetween(body, left, right, prepend = "", append = "") {
      try {
        const BETWEEN_STRING = between(body, left, right);
        if (!BETWEEN_STRING) {
          return null;
        }
        return JSON.parse(`${prepend}${BETWEEN_STRING}${append}`);
      } catch (err) {
        return null;
      }
    }
    __name(tryParseBetween, "tryParseBetween");
    function parseAbbreviatedNumber(string) {
      const MATCH = string.replace(",", ".").replace(" ", "").match(/([\d,.]+)([MK]?)/);
      if (MATCH) {
        const UNIT = MATCH[2];
        let number = MATCH[1];
        number = parseFloat(number);
        return Math.round(UNIT === "M" ? number * 1e6 : UNIT === "K" ? number * 1e3 : number);
      }
      return null;
    }
    __name(parseAbbreviatedNumber, "parseAbbreviatedNumber");
    function cutAfterJS(mixedJson) {
      let open = null, close = null;
      if (mixedJson[0] === "[") {
        open = "[";
        close = "]";
      } else if (mixedJson[0] === "{") {
        open = "{";
        close = "}";
      }
      if (!open) {
        throw new Error(`Can't cut unsupported JSON (need to begin with [ or { ) but got: ${mixedJson[0]}`);
      }
      let isEscapedObject = null;
      let isEscaped = false;
      let counter = 0;
      for (let i = 0; i < mixedJson.length; i++) {
        if (isEscapedObject !== null && !isEscaped && mixedJson[i] === isEscapedObject.end) {
          isEscapedObject = null;
          continue;
        } else if (!isEscaped && isEscapedObject === null) {
          for (const ESCAPED of ESCAPING_SEQUENCE) {
            if (mixedJson[i] !== ESCAPED.start) {
              continue;
            }
            if (!ESCAPED.startPrefix || mixedJson.substring(i - 10, i).match(ESCAPED.startPrefix)) {
              isEscapedObject = ESCAPED;
              break;
            }
          }
          if (isEscapedObject !== null) {
            continue;
          }
        }
        isEscaped = mixedJson[i] === "\\" && !isEscaped;
        if (isEscapedObject !== null) {
          continue;
        }
        if (mixedJson[i] === open) {
          counter++;
        } else if (mixedJson[i] === close) {
          counter--;
        }
        if (counter === 0) {
          return mixedJson.slice(0, i + 1);
        }
      }
      throw new Error(`Can't cut unsupported JSON (no matching closing bracket found)`);
    }
    __name(cutAfterJS, "cutAfterJS");
    function getPropInsensitive(obj, prop) {
      const KEY = findPropKeyInsensitive(obj, prop);
      return KEY && obj[KEY];
    }
    __name(getPropInsensitive, "getPropInsensitive");
    function setPropInsensitive(obj, prop, value) {
      const KEY = findPropKeyInsensitive(obj, prop);
      obj[KEY || prop] = value;
      return KEY;
    }
    __name(setPropInsensitive, "setPropInsensitive");
    function generateClientPlaybackNonce(length) {
      const CPN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      return Array.from({ length }, () => CPN_CHARS[Math.floor(Math.random() * CPN_CHARS.length)]).join("");
    }
    __name(generateClientPlaybackNonce, "generateClientPlaybackNonce");
    var updateWarnTimes = 0;
    var lastUpdateCheck = 0;
    exports.lastUpdateCheck = lastUpdateCheck;
    function checkForUpdates() {
      const SHIM = Platform_1.Platform.getShim(), YTDL_NO_UPDATE = SHIM.options.other.noUpdate;
      if (!YTDL_NO_UPDATE && Date.now() - lastUpdateCheck >= UPDATE_INTERVAL) {
        exports.lastUpdateCheck = lastUpdateCheck = Date.now();
        const PKG_GITHUB_API_URL = `https://raw.githubusercontent.com/${SHIM.info.repo.user}/${SHIM.info.repo.name}/dev/package.json`;
        Fetcher_1.Fetcher.request(PKG_GITHUB_API_URL, {
          requestOptions: { headers: { "User-Agent": 'Chromium";v="112", "Microsoft Edge";v="112", "Not:A-Brand";v="99' } }
        }).then((response) => {
          const PKG_FILE = JSON.parse(response);
          if (PKG_FILE.version !== Constants_1.VERSION && updateWarnTimes++ < 5) {
            Log_1.Logger.warning('@ybd-project/ytdl-core is out of date! Update with "npm install @ybd-project/ytdl-core@latest".');
          }
        }, (err) => {
          Log_1.Logger.warning("Error checking for updates:", err.message);
          Log_1.Logger.warning("It can be disabled by setting `noUpdate` to `true` in the YtdlCore options.");
        });
      }
    }
    __name(checkForUpdates, "checkForUpdates");
    exports.default = { between, tryParseBetween, parseAbbreviatedNumber, cutAfterJS, lastUpdateCheck, checkForUpdates, getPropInsensitive, setPropInsensitive, generateClientPlaybackNonce };
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/meta/Clients.js
var require_Clients = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/meta/Clients.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Clients = void 0;
    var General_1 = __importDefault(require_General());
    var UserAgents_1 = require_UserAgents();
    var Url_1 = require_Url();
    var INNERTUBE_BASE_API_URL = Url_1.Url.getInnertubeBaseUrl();
    var INNERTUBE_CLIENTS = Object.freeze({
      web: {
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20240726.00.00",
            userAgent: UserAgents_1.UserAgent.default
          }
        },
        clientName: 1,
        apiInfo: {
          key: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
        }
      },
      webCreator: {
        context: {
          client: {
            clientName: "WEB_CREATOR",
            clientVersion: "1.20240918.03.00",
            userAgent: UserAgents_1.UserAgent.default
          }
        },
        clientName: 62,
        apiInfo: {
          key: "AIzaSyBUPetSUmoZL-OhlxA7wSac5XinrygCqMo"
        }
      },
      webEmbedded: {
        context: {
          client: {
            clientName: "WEB_EMBEDDED_PLAYER",
            clientVersion: "2.20240111.09.00",
            userAgent: UserAgents_1.UserAgent.default,
            clientScreen: "EMBED"
          }
        },
        clientName: 56,
        apiInfo: {
          key: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
        }
      },
      android: {
        context: {
          client: {
            clientName: "ANDROID",
            clientVersion: "19.35.36",
            androidSdkVersion: 33,
            userAgent: UserAgents_1.UserAgent.android,
            osName: "Android",
            osVersion: "13"
          }
        },
        clientName: 3,
        apiInfo: {
          key: "AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w"
        }
      },
      ios: {
        context: {
          client: {
            clientName: "IOS",
            clientVersion: "19.29.1",
            deviceMake: "Apple",
            deviceModel: "iPhone16,2",
            userAgent: UserAgents_1.UserAgent.ios,
            osName: "iPhone",
            osVersion: "17.5.1.21F90"
          }
        },
        clientName: 5,
        apiInfo: {
          key: "AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc"
        }
      },
      mweb: {
        context: {
          client: {
            clientName: "MWEB",
            clientVersion: "2.20240726.01.00",
            userAgent: UserAgents_1.UserAgent.default
          }
        },
        clientName: 2,
        apiInfo: {}
      },
      tv: {
        context: {
          client: {
            clientName: "TVHTML5",
            clientVersion: "7.20241016.15.00",
            userAgent: UserAgents_1.UserAgent.tv
          }
        },
        clientName: 7,
        apiInfo: {}
      },
      tvEmbedded: {
        context: {
          client: {
            clientName: "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
            clientVersion: "2.0",
            userAgent: UserAgents_1.UserAgent.tv
          },
          thirdParty: {
            embedUrl: "https://www.youtube.com/"
          }
        },
        clientName: 85,
        apiInfo: {}
      }
    });
    var INNERTUBE_BASE_PAYLOAD = {
      videoId: "",
      cpn: General_1.default.generateClientPlaybackNonce(16),
      contentCheckOk: true,
      racyCheckOk: true,
      serviceIntegrityDimensions: {},
      playbackContext: {
        contentPlaybackContext: {
          vis: 0,
          splay: false,
          referer: "",
          currentUrl: "",
          autonavState: "STATE_ON",
          autoCaptionsDefaultOn: false,
          html5Preference: "HTML5_PREF_WANTS",
          lactMilliseconds: "-1",
          signatureTimestamp: 0
        }
      },
      attestationRequest: {
        omitBotguardData: true
      },
      context: {
        client: {},
        request: {
          useSsl: true,
          internalExperimentFlags: [],
          consistencyTokenJars: []
        },
        user: {
          lockedSafetyMode: false
        }
      }
    };
    var Clients = class {
      static getAuthorizationHeader(oauth2) {
        return oauth2 && oauth2.isEnabled ? { authorization: "Bearer " + oauth2.getAccessToken(), "X-Goog-AuthUser": "0" } : {};
      }
      static web({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.web, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ...Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static web_nextApi({ videoId, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.web, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD, autonavState: "STATE_OFF", playbackContext: { vis: 0, lactMilliseconds: "-1" }, captionsRequested: false };
        PAYLOAD.videoId = videoId;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL + "/next"}?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ...Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static webCreator({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.webCreator, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ...Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static webEmbedded({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.webEmbedded, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ...Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static android({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.android, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false&id=${videoId}&t=${General_1.default.generateClientPlaybackNonce(12)}`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ...Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static ios({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.ios, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?key=${CLIENT.apiInfo.key}&prettyPrint=false&id=${videoId}&t=${General_1.default.generateClientPlaybackNonce(12)}`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ...Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static mweb({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.mweb, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ...Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static tv({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.tv, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ...Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
      static tvEmbedded({ videoId, signatureTimestamp, options: { poToken, visitorData, oauth2, hl, gl } }) {
        const CLIENT = INNERTUBE_CLIENTS.tvEmbedded, PAYLOAD = { ...INNERTUBE_BASE_PAYLOAD };
        PAYLOAD.videoId = videoId;
        PAYLOAD.playbackContext.contentPlaybackContext.signatureTimestamp = signatureTimestamp;
        PAYLOAD.context.client = CLIENT.context.client;
        PAYLOAD.context.client.hl = hl || "en";
        PAYLOAD.context.client.gl = gl || "US";
        if (poToken) {
          PAYLOAD.serviceIntegrityDimensions.poToken = poToken;
        } else {
          PAYLOAD.serviceIntegrityDimensions = void 0;
        }
        if (visitorData) {
          PAYLOAD.context.client.visitorData = visitorData;
        }
        return {
          url: `${INNERTUBE_BASE_API_URL}/player?prettyPrint=false`,
          payload: PAYLOAD,
          headers: {
            "X-YouTube-Client-Name": CLIENT.clientName,
            "X-Youtube-Client-Version": CLIENT.context.client.clientVersion,
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent": CLIENT.context.client.userAgent,
            ...Clients.getAuthorizationHeader(oauth2)
          }
        };
      }
    };
    __name(Clients, "Clients");
    exports.Clients = Clients;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Base.js
var require_Base = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Base.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var Platform_1 = require_Platform();
    var errors_1 = require_errors();
    var Fetcher_1 = require_Fetcher();
    var Log_1 = require_Log();
    var SHIM = Platform_1.Platform.getShim();
    var Base = class {
      static playError(playerResponse) {
        const PLAYABILITY = playerResponse && playerResponse.playabilityStatus;
        if (!PLAYABILITY) {
          return null;
        }
        const STATUS = playerResponse.playabilityStatus.reason || null;
        if (PLAYABILITY.status === "ERROR" || PLAYABILITY.status === "LOGIN_REQUIRED") {
          return new errors_1.UnrecoverableError(PLAYABILITY.reason || PLAYABILITY.messages && PLAYABILITY.messages[0] || "Unknown error.", STATUS);
        } else if (PLAYABILITY.status === "LIVE_STREAM_OFFLINE") {
          return new errors_1.UnrecoverableError(PLAYABILITY.reason || "The live stream is offline.", STATUS);
        } else if (PLAYABILITY.status === "UNPLAYABLE") {
          return new errors_1.UnrecoverableError(PLAYABILITY.reason || "This video is unavailable.", STATUS);
        }
        return null;
      }
      static request(url, requestOptions, params, clientName) {
        return new Promise(async (resolve, reject) => {
          const HEADERS = {
            "Content-Type": "application/json",
            "X-Origin": "https://www.youtube.com",
            ...requestOptions.headers
          }, OPTS = {
            requestOptions: {
              method: "POST",
              headers: HEADERS,
              body: typeof requestOptions.payload === "string" ? requestOptions.payload : JSON.stringify(requestOptions.payload)
            },
            rewriteRequest: params.options.rewriteRequest,
            originalProxy: params.options.originalProxy
          }, IS_NEXT_API = url.includes("/next"), ALLOW_RETRY_REQUEST = !params.options.disableRetryRequest && ((OPTS.originalProxy || OPTS.rewriteRequest) && SHIM.runtime !== "browser" || HEADERS["Authorization"]), responseHandler = /* @__PURE__ */ __name((response, isRetried = false) => {
            const PLAY_ERROR = this.playError(response);
            if (PLAY_ERROR) {
              if (!isRetried && ALLOW_RETRY_REQUEST) {
                return retryRequest(PLAY_ERROR);
              }
              return reject({
                isError: true,
                error: PLAY_ERROR,
                contents: response
              });
            }
            if (!IS_NEXT_API && (!response.videoDetails || params.videoId !== response.videoDetails.videoId)) {
              const ERROR = new errors_1.PlayerRequestError("Malformed response from YouTube", response, null);
              ERROR.response = response;
              if (!isRetried && ALLOW_RETRY_REQUEST) {
                return retryRequest(ERROR);
              }
              return reject({
                isError: true,
                error: ERROR,
                contents: response
              });
            }
            resolve({
              isError: false,
              error: null,
              contents: response
            });
          }, "responseHandler"), retryRequest = /* @__PURE__ */ __name((error3) => {
            OPTS.originalProxy = void 0;
            OPTS.rewriteRequest = void 0;
            const HEADERS2 = new SHIM.polyfills.Headers(OPTS.requestOptions?.headers);
            HEADERS2.delete("Authorization");
            if (!OPTS.requestOptions) {
              OPTS.requestOptions = {};
            }
            OPTS.requestOptions.headers = HEADERS2;
            Log_1.Logger.debug(`[ ${clientName} ]: <info>Wait 2 seconds</info> and <warning>retry request...</warning> (Reason: <error>${error3?.message}</error>)`);
            setTimeout(() => {
              Fetcher_1.Fetcher.request(url, OPTS).then((res) => responseHandler(res, true)).catch((err) => {
                reject({
                  isError: true,
                  error: err,
                  contents: null
                });
              });
            }, 2e3);
            return;
          }, "retryRequest");
          try {
            Fetcher_1.Fetcher.request(url, OPTS).then((res) => responseHandler(res, false)).catch((err) => {
              if (ALLOW_RETRY_REQUEST) {
                return retryRequest(err);
              }
              reject({
                isError: true,
                error: err,
                contents: null
              });
            });
          } catch (err) {
            reject({
              isError: true,
              error: err,
              contents: null
            });
          }
        });
      }
    };
    __name(Base, "Base");
    exports.default = Base;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Web.js
var require_Web = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Web.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault(require_Base());
    var Web = class {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.web(params);
        return await Base_1.default.request(url, { payload, headers }, params, "Web");
      }
      static async getNextResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.web_nextApi(params);
        return await Base_1.default.request(url, { payload, headers }, params, "Next");
      }
    };
    __name(Web, "Web");
    exports.default = Web;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/WebCreator.js
var require_WebCreator = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/WebCreator.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault(require_Base());
    var WebCreator = class {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.webCreator(params);
        return await Base_1.default.request(url, { payload, headers }, params, "WebCreator");
      }
    };
    __name(WebCreator, "WebCreator");
    exports.default = WebCreator;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/WebEmbedded.js
var require_WebEmbedded = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/WebEmbedded.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault(require_Base());
    var WebEmbedded = class {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.webEmbedded(params);
        return await Base_1.default.request(url, { payload, headers }, params, "WebEmbedded");
      }
    };
    __name(WebEmbedded, "WebEmbedded");
    exports.default = WebEmbedded;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/MWeb.js
var require_MWeb = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/MWeb.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault(require_Base());
    var MWeb = class {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.mweb(params);
        return await Base_1.default.request(url, { payload, headers }, params, "MWeb");
      }
    };
    __name(MWeb, "MWeb");
    exports.default = MWeb;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Android.js
var require_Android = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Android.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault(require_Base());
    var Android = class {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.android(params);
        return await Base_1.default.request(url, { payload, headers }, params, "Android");
      }
    };
    __name(Android, "Android");
    exports.default = Android;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Ios.js
var require_Ios = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Ios.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault(require_Base());
    var Ios = class {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.ios(params);
        return await Base_1.default.request(url, { payload, headers }, params, "Ios");
      }
    };
    __name(Ios, "Ios");
    exports.default = Ios;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Tv.js
var require_Tv = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/Tv.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault(require_Base());
    var Tv = class {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.tv(params);
        return await Base_1.default.request(url, { payload, headers }, params, "Tv");
      }
    };
    __name(Tv, "Tv");
    exports.default = Tv;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/TvEmbedded.js
var require_TvEmbedded = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/TvEmbedded.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clients_1 = require_Clients();
    var Base_1 = __importDefault(require_Base());
    var TvEmbedded = class {
      static async getPlayerResponse(params) {
        const { url, payload, headers } = Clients_1.Clients.tvEmbedded(params);
        return await Base_1.default.request(url, { payload, headers }, params, "TvEmbedded");
      }
    };
    __name(TvEmbedded, "TvEmbedded");
    exports.default = TvEmbedded;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/index.js
var require_clients = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/clients/index.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TvEmbedded = exports.Tv = exports.Ios = exports.Android = exports.MWeb = exports.WebEmbedded = exports.WebCreator = exports.Web = void 0;
    var Web_1 = require_Web();
    Object.defineProperty(exports, "Web", { enumerable: true, get: function() {
      return __importDefault(Web_1).default;
    } });
    var WebCreator_1 = require_WebCreator();
    Object.defineProperty(exports, "WebCreator", { enumerable: true, get: function() {
      return __importDefault(WebCreator_1).default;
    } });
    var WebEmbedded_1 = require_WebEmbedded();
    Object.defineProperty(exports, "WebEmbedded", { enumerable: true, get: function() {
      return __importDefault(WebEmbedded_1).default;
    } });
    var MWeb_1 = require_MWeb();
    Object.defineProperty(exports, "MWeb", { enumerable: true, get: function() {
      return __importDefault(MWeb_1).default;
    } });
    var Android_1 = require_Android();
    Object.defineProperty(exports, "Android", { enumerable: true, get: function() {
      return __importDefault(Android_1).default;
    } });
    var Ios_1 = require_Ios();
    Object.defineProperty(exports, "Ios", { enumerable: true, get: function() {
      return __importDefault(Ios_1).default;
    } });
    var Tv_1 = require_Tv();
    Object.defineProperty(exports, "Tv", { enumerable: true, get: function() {
      return __importDefault(Tv_1).default;
    } });
    var TvEmbedded_1 = require_TvEmbedded();
    Object.defineProperty(exports, "TvEmbedded", { enumerable: true, get: function() {
      return __importDefault(TvEmbedded_1).default;
    } });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/OAuth2.js
var require_OAuth2 = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/OAuth2.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OAuth2 = void 0;
    var Platform_1 = require_Platform();
    var Log_1 = require_Log();
    var Url_1 = require_Url();
    var UserAgents_1 = require_UserAgents();
    var clients_1 = require_clients();
    var Fetcher_1 = require_Fetcher();
    var REGEX = { tvScript: new RegExp('<script\\s+id="base-js"\\s+src="([^"]+)"[^>]*><\\/script>'), clientIdentity: new RegExp('clientId:"(?<client_id>[^"]+)",[^"]*?:"(?<client_secret>[^"]+)"') };
    var FileCache = Platform_1.Platform.getShim().fileCache;
    var OAuth2 = class {
      constructor(credentials) {
        this.isEnabled = false;
        this.credentials = {
          accessToken: "",
          refreshToken: "",
          expiryDate: ""
        };
        this.accessToken = "";
        this.refreshToken = "";
        this.expiryDate = "";
        if (!credentials) {
          this.isEnabled = false;
          return;
        }
        this.isEnabled = true;
        this.credentials = credentials;
        this.accessToken = credentials.accessToken;
        this.refreshToken = credentials.refreshToken;
        this.expiryDate = credentials.expiryDate;
        this.clientId = credentials.clientData?.clientId;
        this.clientSecret = credentials.clientData?.clientSecret;
        if (this.shouldRefreshToken()) {
          try {
            this.refreshAccessToken().finally(() => this.availableTokenCheck());
          } catch {
          }
        } else {
          this.availableTokenCheck();
        }
        FileCache.set("oauth2", JSON.stringify(credentials));
      }
      async availableTokenCheck() {
        try {
          const HTML5_PLAYER_CACHE = await FileCache.get("html5Player");
          clients_1.Web.getPlayerResponse({
            videoId: "dQw4w9WgXcQ",
            signatureTimestamp: parseInt(HTML5_PLAYER_CACHE?.signatureTimestamp || "0") || 0,
            options: {
              oauth2: this
            }
          }).then(() => Log_1.Logger.debug("The specified OAuth2 token is valid.")).catch((err) => {
            if (err.error.message.includes("401")) {
              this.error("Request using the specified token failed (Web Client). Generating the token again may fix the problem.");
            }
          });
        } catch (err) {
          if ((err.message || err.error.message).includes("401")) {
            this.error("Request using the specified token failed (Web Client). Generating the token again may fix the problem.");
          }
        }
      }
      error(message) {
        Log_1.Logger.error(message);
        Log_1.Logger.info("OAuth2 is disabled due to an error.");
        this.isEnabled = false;
      }
      async getClientData() {
        const OAUTH2_CACHE = await FileCache.get("oauth2") || {};
        if (OAUTH2_CACHE.clientData?.clientId && OAUTH2_CACHE.clientData?.clientSecret) {
          return {
            clientId: OAUTH2_CACHE.clientData.clientId,
            clientSecret: OAUTH2_CACHE.clientData.clientSecret
          };
        }
        const HEADERS = {
          "User-Agent": UserAgents_1.UserAgent.tv,
          Referer: Url_1.Url.getTvUrl()
        }, YT_TV_RESPONSE = await Fetcher_1.Fetcher.fetch(Url_1.Url.getTvUrl(), {
          headers: HEADERS
        });
        if (!YT_TV_RESPONSE.ok) {
          this.error("Failed to get client data: " + YT_TV_RESPONSE.status);
          return null;
        }
        const YT_TV_HTML = await YT_TV_RESPONSE.text(), SCRIPT_PATH = REGEX.tvScript.exec(YT_TV_HTML)?.[1];
        if (SCRIPT_PATH) {
          Log_1.Logger.debug("Found YouTube TV script: " + SCRIPT_PATH);
          const SCRIPT_RESPONSE = await Fetcher_1.Fetcher.fetch(Url_1.Url.getBaseUrl() + SCRIPT_PATH, { headers: HEADERS });
          if (!SCRIPT_RESPONSE.ok) {
            this.error("TV script request failed with status code: " + SCRIPT_RESPONSE.status);
            return null;
          }
          const SCRIPT_STRING = await SCRIPT_RESPONSE.text(), CLIENT_ID = REGEX.clientIdentity.exec(SCRIPT_STRING)?.groups?.client_id, CLIENT_SECRET = REGEX.clientIdentity.exec(SCRIPT_STRING)?.groups?.client_secret;
          if (!CLIENT_ID || !CLIENT_SECRET) {
            this.error("Could not obtain client ID. Please create an issue in the repository for possible specification changes on YouTube's side.");
            return null;
          }
          Log_1.Logger.debug("Found client ID: " + CLIENT_ID);
          Log_1.Logger.debug("Found client secret: " + CLIENT_SECRET);
          return { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET };
        }
        this.error("Could not obtain script URL. Please create an issue in the repository for possible specification changes on YouTube's side.");
        return null;
      }
      shouldRefreshToken() {
        if (!this.isEnabled) {
          return false;
        }
        return Date.now() >= new Date(this.expiryDate).getTime();
      }
      async refreshAccessToken() {
        if (!this.isEnabled) {
          return;
        }
        if (!this.clientId || !this.clientSecret) {
          const data = await this.getClientData();
          if (!data) {
            return;
          }
          this.clientId = data.clientId;
          this.clientSecret = data.clientSecret;
          FileCache.set("oauth2", JSON.stringify({ accessToken: this.accessToken, refreshToken: this.refreshToken, expiryDate: this.expiryDate, clientData: { clientId: data.clientId, clientSecret: data.clientSecret } }));
        }
        if (!this.refreshToken) {
          return this.error("Refresh token is missing, make sure it is specified.");
        }
        try {
          const PAYLOAD = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: this.refreshToken,
            grant_type: "refresh_token"
          }, REFRESH_API_RESPONSE = await Fetcher_1.Fetcher.fetch(Url_1.Url.getTokenApiUrl(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(PAYLOAD)
          });
          if (!REFRESH_API_RESPONSE.ok) {
            return this.error(`Failed to refresh access token: ${REFRESH_API_RESPONSE.status}`);
          }
          const REFRESH_API_DATA = await REFRESH_API_RESPONSE.json();
          if (REFRESH_API_DATA.error_code) {
            return this.error("Authorization server returned an error: " + JSON.stringify(REFRESH_API_DATA));
          }
          this.expiryDate = new Date(Date.now() + REFRESH_API_DATA.expires_in * 1e3).toISOString();
          this.accessToken = REFRESH_API_DATA.access_token;
        } catch (err) {
          this.error(err.message);
        }
      }
      getAccessToken() {
        return this.accessToken;
      }
      getCredentials() {
        return this.credentials;
      }
      static async createOAuth2Credentials(userOperationCallback) {
        return new Promise(async (resolve) => {
          const CACHE = await FileCache.get("oauth2");
          console.log(CACHE);
          if (CACHE) {
            return resolve(CACHE);
          }
          const OAUTH2 = new OAuth2(null);
          function errorHandle() {
            resolve(null);
          }
          __name(errorHandle, "errorHandle");
          function generateUuidV4() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
              const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
              return v.toString(16);
            });
          }
          __name(generateUuidV4, "generateUuidV4");
          OAUTH2.getClientData().then((data) => {
            if (!data) {
              return resolve(null);
            }
            const { clientId, clientSecret } = data;
            Fetcher_1.Fetcher.fetch(Url_1.Url.getDeviceCodeApiUrl(), {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ client_id: clientId, scope: "http://gdata.youtube.com https://www.googleapis.com/auth/youtube-paid-content", device_id: generateUuidV4(), device_model: "ytlr::" })
            }).then((response) => response.json()).then((deviceApiResponse) => {
              if (deviceApiResponse.error || deviceApiResponse.error_code) {
                Log_1.Logger.error("[ OAuth2 ]: The OAuth2 credential could not be generated because of failure to obtain the device code.");
                return errorHandle();
              }
              Log_1.Logger.info(`[ OAuth2 ]: Please open the following URL and follow the instructions: <debug>${deviceApiResponse.verification_url}</debug>`);
              Log_1.Logger.info(`[ OAuth2 ]: Please enter the following code: <warning>${deviceApiResponse.user_code}</warning>`);
              if (typeof userOperationCallback === "function") {
                userOperationCallback({ verificationUrl: deviceApiResponse.verification_url, code: deviceApiResponse.user_code });
              }
              const BODY = JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code: deviceApiResponse.device_code,
                grant_type: "http://oauth.net/grant_type/device/1.0"
              }), REQUEST_INTERVAL = setInterval(async () => {
                const RESPONSE = await (await Fetcher_1.Fetcher.fetch(Url_1.Url.getTokenApiUrl(), {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: BODY
                })).json();
                if (RESPONSE.error) {
                  switch (RESPONSE.error) {
                    case "authorization_pending":
                    case "slow_down":
                      Log_1.Logger.debug("[ OAuth2 ]: Polling for access token...");
                      break;
                    case "access_denied": {
                      Log_1.Logger.error("[ OAuth2 ]: Generation of OAuth2 credentials failed because access to the API was forbidden.");
                      resolve(null);
                      clearInterval(REQUEST_INTERVAL);
                      break;
                    }
                    case "expired_token": {
                      Log_1.Logger.error("[ OAuth2 ]: OAuth2 credential generation failed because the device code has expired.");
                      resolve(null);
                      clearInterval(REQUEST_INTERVAL);
                      break;
                    }
                    default: {
                      Log_1.Logger.error("[ OAuth2 ]: OAuth2 credential generation failed because the API responded with the following error code:" + RESPONSE.error);
                      resolve(null);
                      clearInterval(REQUEST_INTERVAL);
                      break;
                    }
                  }
                  return;
                }
                Log_1.Logger.debug(`[ OAuth2 ]: Success to obtain access token: <success>${RESPONSE.access_token}</success>`);
                resolve({
                  accessToken: RESPONSE.access_token,
                  refreshToken: RESPONSE.refresh_token,
                  expiryDate: new Date(Date.now() + RESPONSE.expires_in * 1e3).toISOString(),
                  clientData: {
                    clientId,
                    clientSecret
                  }
                });
                clearInterval(REQUEST_INTERVAL);
              }, deviceApiResponse.interval * 1e3);
            }).catch(errorHandle);
          }).catch(errorHandle);
        });
      }
    };
    __name(OAuth2, "OAuth2");
    exports.OAuth2 = OAuth2;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Html5Player.js
var require_Html5Player = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Html5Player.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDecipherFunction = getDecipherFunction;
    exports.getNTransformFunction = getNTransformFunction;
    var Platform_1 = require_Platform();
    var Log_1 = require_Log();
    var DECIPHER_NAME_REGEXPS = ["\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\)", "\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)", '(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*""\\s*\\)', '([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(""\\)\\s*;'];
    var VARIABLE_PART = "[a-zA-Z_\\$][a-zA-Z_0-9]*";
    var VARIABLE_PART_DEFINE = `\\"?${VARIABLE_PART}\\"?`;
    var BEFORE_ACCESS = '(?:\\[\\"|\\.)';
    var AFTER_ACCESS = '(?:\\"\\]|)';
    var VARIABLE_PART_ACCESS = BEFORE_ACCESS + VARIABLE_PART + AFTER_ACCESS;
    var REVERSE_PART = ":function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}";
    var SLICE_PART = ":function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}";
    var SPLICE_PART = ":function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}";
    var SWAP_PART = ":function\\(a,b\\)\\{var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b(?:%a.length|)\\]=c(?:;return a)?\\}";
    var DECIPHER_REGEXP = `function(?: ${VARIABLE_PART})?\\(a\\)\\{a=a\\.split\\(""\\);\\s*((?:(?:a=)?${VARIABLE_PART}${VARIABLE_PART_ACCESS}\\(a,\\d+\\);)+)return a\\.join\\(""\\)\\}`;
    var HELPER_REGEXP = `var (${VARIABLE_PART})=\\{((?:(?:${VARIABLE_PART_DEFINE}${REVERSE_PART}|${VARIABLE_PART_DEFINE}${SLICE_PART}|${VARIABLE_PART_DEFINE}${SPLICE_PART}|${VARIABLE_PART_DEFINE}${SWAP_PART}),?\\n?)+)\\};`;
    var SCVR = "[a-zA-Z0-9$_]";
    var FNR = `${SCVR}+`;
    var AAR = "\\[(\\d+)]";
    var N_TRANSFORM_NAME_REGEXPS = [
      // NewPipeExtractor regexps
      `${SCVR}+="nn"\\[\\+${SCVR}+\\.${SCVR}+],${SCVR}+=${SCVR}+\\.get\\(${SCVR}+\\)\\)&&\\(${SCVR}+=(${SCVR}+)\\[(\\d+)]`,
      `${SCVR}+="nn"\\[\\+${SCVR}+\\.${SCVR}+],${SCVR}+=${SCVR}+\\.get\\(${SCVR}+\\)\\).+\\|\\|(${SCVR}+)\\(""\\)`,
      `\\(${SCVR}=String\\.fromCharCode\\(110\\),${SCVR}=${SCVR}\\.get\\(${SCVR}\\)\\)&&\\(${SCVR}=(${FNR})(?:${AAR})?\\(${SCVR}\\)`,
      `\\.get\\("n"\\)\\)&&\\(${SCVR}=(${FNR})(?:${AAR})?\\(${SCVR}\\)`,
      // Skick regexps
      '(\\w+).length\\|\\|\\w+\\(""\\)',
      '\\w+.length\\|\\|(\\w+)\\(""\\)'
    ];
    var N_TRANSFORM_REGEXP = 'function\\(\\s*(\\w+)\\s*\\)\\s*\\{var\\s*(\\w+)=(?:\\1\\.split\\(.*?\\)|String\\.prototype\\.split\\.call\\(\\1,.*?\\)),\\s*(\\w+)=(\\[.*?]);\\s*\\3\\[\\d+](.*?try)(\\{.*?})catch\\(\\s*(\\w+)\\s*\\)\\s*\\{\\s*return"enhanced_except_([A-z0-9-]+)"\\s*\\+\\s*\\1\\s*}\\s*return\\s*(\\2\\.join\\(""\\)|Array\\.prototype\\.join\\.call\\(\\2,""\\))};';
    var DECIPHER_ARGUMENT = "sig";
    var N_ARGUMENT = "ncode";
    var DECIPHER_FUNC_NAME = "YBDProjectDecipherFunc";
    var N_TRANSFORM_FUNC_NAME = "YBDProjectNTransformFunc";
    var SHIM = Platform_1.Platform.getShim();
    function matchRegex(regex, str) {
      const MATCH = str.match(new RegExp(regex, "s"));
      if (!MATCH) {
        throw new Error(`Could not match ${regex}`);
      }
      return MATCH;
    }
    __name(matchRegex, "matchRegex");
    function matchFirst(regex, str) {
      return matchRegex(regex, str)[0];
    }
    __name(matchFirst, "matchFirst");
    function matchGroup1(regex, str) {
      return matchRegex(regex, str)[1];
    }
    __name(matchGroup1, "matchGroup1");
    function getFunctionName(body, regexps) {
      let fn;
      for (const REGEX of regexps) {
        try {
          fn = matchGroup1(REGEX, body);
          try {
            fn = matchGroup1(`${fn.replace(/\$/g, "\\$")}=\\[([a-zA-Z0-9$\\[\\]]{2,})\\]`, body);
          } catch (err) {
          }
          break;
        } catch (err) {
          continue;
        }
      }
      if (!fn || fn.includes("["))
        throw Error();
      return fn;
    }
    __name(getFunctionName, "getFunctionName");
    function getExtractFunctions(extractFunctions, body) {
      for (const extractFunction of extractFunctions) {
        try {
          const FUNC = extractFunction(body);
          if (!FUNC)
            continue;
          return FUNC;
        } catch {
          continue;
        }
      }
      return null;
    }
    __name(getExtractFunctions, "getExtractFunctions");
    function extractDecipherFunc(body) {
      try {
        const HELPER_OBJECT = matchFirst(HELPER_REGEXP, body), DECIPHER_FUNCTION = matchFirst(DECIPHER_REGEXP, body), RESULTS_FUNCTION = `var ${DECIPHER_FUNC_NAME}=${DECIPHER_FUNCTION};`, CALLER_FUNCTION = `${DECIPHER_FUNC_NAME}(${DECIPHER_ARGUMENT});`;
        return HELPER_OBJECT + RESULTS_FUNCTION + CALLER_FUNCTION;
      } catch (e) {
        return null;
      }
    }
    __name(extractDecipherFunc, "extractDecipherFunc");
    function extractDecipherWithName(body) {
      try {
        const DECIPHER_FUNCTION_NAME = getFunctionName(body, DECIPHER_NAME_REGEXPS), FUNC_PATTERN = `(${DECIPHER_FUNCTION_NAME.replace(/\$/g, "\\$")}function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`, DECIPHER_FUNCTION = `var ${matchGroup1(FUNC_PATTERN, body)};`, HELPER_OBJECT_NAME = matchGroup1(";([A-Za-z0-9_\\$]{2,})\\.\\w+\\(", DECIPHER_FUNCTION), HELPER_PATTERN = `(var ${HELPER_OBJECT_NAME.replace(/\$/g, "\\$")}=\\{[\\s\\S]+?\\}\\};)`, HELPER_OBJECT = matchGroup1(HELPER_PATTERN, body), CALLER_FUNCTION = `${DECIPHER_FUNC_NAME}(${DECIPHER_ARGUMENT});`;
        return HELPER_OBJECT + DECIPHER_FUNCTION + CALLER_FUNCTION;
      } catch (e) {
        return null;
      }
    }
    __name(extractDecipherWithName, "extractDecipherWithName");
    function extractNTransformFunc(body) {
      try {
        const N_FUNCTION = matchFirst(N_TRANSFORM_REGEXP, body), RESULTS_FUNCTION = `var ${N_TRANSFORM_FUNC_NAME}=${N_FUNCTION};`, CALLER_FUNCTION = `${N_TRANSFORM_FUNC_NAME}(${N_ARGUMENT});`;
        return RESULTS_FUNCTION + CALLER_FUNCTION;
      } catch (e) {
        return null;
      }
    }
    __name(extractNTransformFunc, "extractNTransformFunc");
    function extractNTransformWithName(body) {
      try {
        const N_FUNCTION_NAME = getFunctionName(body, N_TRANSFORM_NAME_REGEXPS), FUNCTION_PATTERN = `(${N_FUNCTION_NAME.replace(/\$/g, "\\$")}=\\s*function([\\S\\s]*?\\}\\s*return (([\\w$]+?\\.join\\(""\\))|(Array\\.prototype\\.join\\.call\\([\\w$]+?,[\\n\\s]*(("")|(\\("",""\\)))\\)))\\s*\\}))`, N_TRANSFORM_FUNCTION = `var ${matchGroup1(FUNCTION_PATTERN, body)};`, CALLER_FUNCTION = `${N_FUNCTION_NAME}(${N_ARGUMENT});`;
        return N_TRANSFORM_FUNCTION + CALLER_FUNCTION;
      } catch (e) {
        return null;
      }
    }
    __name(extractNTransformWithName, "extractNTransformWithName");
    function getDecipherFunction(playerId, body) {
      const DECIPHER_FUNCTION = getExtractFunctions([extractDecipherWithName, extractDecipherFunc], body);
      if (!DECIPHER_FUNCTION) {
        Log_1.Logger.warning(`Could not parse decipher function.
Please report this issue with "${playerId}" in Issues at ${SHIM.info.issuesUrl}.
Stream URL will be missing.`);
      }
      return {
        argumentName: DECIPHER_ARGUMENT,
        code: DECIPHER_FUNCTION || ""
      };
    }
    __name(getDecipherFunction, "getDecipherFunction");
    function getNTransformFunction(playerId, body) {
      const N_TRANSFORM_FUNCTION = getExtractFunctions([extractNTransformFunc, extractNTransformWithName], body);
      if (!N_TRANSFORM_FUNCTION) {
        Log_1.Logger.warning(`Could not parse n transform function.
Please report this issue with "${playerId}" in Issues at ${SHIM.info.issuesUrl}.`);
      }
      return {
        argumentName: N_ARGUMENT,
        code: N_TRANSFORM_FUNCTION || ""
      };
    }
    __name(getNTransformFunction, "getNTransformFunction");
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Signature.js
var require_Signature = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Signature.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Signature = void 0;
    var Platform_1 = require_Platform();
    var Log_1 = require_Log();
    var Html5Player_1 = require_Html5Player();
    var SIGNATURE_TIMESTAMP_REGEX = /signatureTimestamp:(\d+)/g;
    var SHIM = Platform_1.Platform.getShim();
    var FILE_CACHE = SHIM.fileCache;
    function getDecipheredFormat(format, decipherFunction, nTransformFunction) {
      const DECIPHERED = format;
      DECIPHERED._deciphered = true;
      if (!decipherFunction) {
        return DECIPHERED;
      }
      const decipher = /* @__PURE__ */ __name((url) => {
        const SEARCH_PARAMS = new URLSearchParams("?" + url), PARAMS_URL = SEARCH_PARAMS.get("url")?.toString() || "", PARAMS_S = SEARCH_PARAMS.get("s");
        if (!PARAMS_S) {
          return PARAMS_URL;
        }
        try {
          const COMPONENTS = new URL(decodeURIComponent(PARAMS_URL)), RESULTS = SHIM.polyfills.eval(`var ${decipherFunction.argumentName}='${decodeURIComponent(PARAMS_S)}';${decipherFunction.code}`);
          COMPONENTS.searchParams.set(SEARCH_PARAMS.get("sp")?.toString() || "sig", RESULTS);
          return COMPONENTS.toString();
        } catch (err) {
          Log_1.Logger.debug(`[ Decipher ]: <error>Failed</error> to decipher URL: <error>${err}</error>`);
          return PARAMS_URL;
        }
      }, "decipher"), nTransform = /* @__PURE__ */ __name((url) => {
        const COMPONENTS = new URL(decodeURIComponent(url)), N = COMPONENTS.searchParams.get("n");
        if (!N || !nTransformFunction) {
          return url;
        }
        try {
          const RESULTS = SHIM.polyfills.eval(`var ${nTransformFunction.argumentName}='${decodeURIComponent(N)}';${nTransformFunction.code}`);
          COMPONENTS.searchParams.set("n", RESULTS);
          return COMPONENTS.toString();
        } catch (err) {
          Log_1.Logger.debug(`[ NTransform ]: <error>Failed</error> to transform N: <error>${err}</error>`);
          return url;
        }
      }, "nTransform"), CIPHER = !format.url, VIDEO_URL = format.url || format.signatureCipher || format.cipher;
      if (!VIDEO_URL) {
        return DECIPHERED;
      }
      DECIPHERED.url = nTransform(CIPHER ? decipher(VIDEO_URL) : VIDEO_URL);
      delete DECIPHERED.signatureCipher;
      delete DECIPHERED.cipher;
      return DECIPHERED;
    }
    __name(getDecipheredFormat, "getDecipheredFormat");
    var Signature = class {
      constructor() {
        this.decipherFunction = null;
        this.nTransformFunction = null;
      }
      static getSignatureTimestamp(body) {
        if (!body) {
          return "0";
        }
        const MATCH = body.match(SIGNATURE_TIMESTAMP_REGEX);
        if (MATCH) {
          return MATCH[0].split(":")[1];
        }
        return "0";
      }
      decipherFormat(format) {
        return getDecipheredFormat(format, this.decipherFunction, this.nTransformFunction);
      }
      decipherFormats(formats) {
        const DECIPHERED_FORMATS = {};
        formats.forEach((format) => {
          if (!format) {
            return;
          }
          getDecipheredFormat(format, this.decipherFunction, this.nTransformFunction);
          DECIPHERED_FORMATS[format.url] = format;
        });
        return DECIPHERED_FORMATS;
      }
      async getDecipherFunctions({ id, body }) {
        if (this.decipherFunction) {
          return this.decipherFunction;
        }
        const HTML5_PLAYER_CACHE = await FILE_CACHE.get("html5Player");
        if (HTML5_PLAYER_CACHE) {
          if (!this.decipherFunction) {
            this.decipherFunction = HTML5_PLAYER_CACHE.functions.decipher;
          }
          return HTML5_PLAYER_CACHE;
        }
        const DECIPHER_FUNCTION = (0, Html5Player_1.getDecipherFunction)(id, body) || null;
        this.decipherFunction = DECIPHER_FUNCTION;
        return DECIPHER_FUNCTION;
      }
      async getNTransform({ id, body }) {
        if (this.nTransformFunction) {
          return this.nTransformFunction;
        }
        const HTML5_PLAYER_CACHE = await FILE_CACHE.get("html5Player");
        if (HTML5_PLAYER_CACHE) {
          if (!this.nTransformFunction) {
            this.nTransformFunction = HTML5_PLAYER_CACHE.functions.nTransform;
          }
          return HTML5_PLAYER_CACHE;
        }
        const N_TRANSFORM_FUNCTION = (0, Html5Player_1.getNTransformFunction)(id, body) || null;
        this.nTransformFunction = N_TRANSFORM_FUNCTION;
        return N_TRANSFORM_FUNCTION;
      }
    };
    __name(Signature, "Signature");
    exports.Signature = Signature;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/parser/Html5Player.js
var require_Html5Player2 = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/parser/Html5Player.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPlayerFunctions = getPlayerFunctions;
    var Platform_1 = require_Platform();
    var Signature_1 = require_Signature();
    var Fetcher_1 = require_Fetcher();
    var Url_1 = require_Url();
    var Log_1 = require_Log();
    var Html5Player_1 = require_Html5Player();
    var SHIM = Platform_1.Platform.getShim();
    var GITHUB_API_BASE_URL = `https://raw.githubusercontent.com/${SHIM.info.repo.user}/${SHIM.info.repo.name}/refs/heads/dev/data/player`;
    var FileCache = SHIM.fileCache;
    function getPlayerId(body) {
      if (!body) {
        return null;
      }
      const MATCH = body.match(/player\\\/([a-zA-Z0-9]+)\\\//);
      if (MATCH) {
        return MATCH[1];
      }
      return null;
    }
    __name(getPlayerId, "getPlayerId");
    async function getPlayerFunctions(options, html5Player) {
      const CACHE = await FileCache.get("html5Player");
      if (CACHE && CACHE.signatureTimestamp) {
        return CACHE;
      }
      Log_1.Logger.debug("To speed up processing, html5Player and signatureTimestamp are pre-fetched and cached.");
      let playerId = void 0, playerBody = void 0;
      if (!html5Player?.useRetrievedFunctionsFromGithub) {
        try {
          const IFRAME_API_BODY = await Fetcher_1.Fetcher.request(Url_1.Url.getIframeApiUrl(), options);
          playerId = getPlayerId(IFRAME_API_BODY);
        } catch {
        }
      }
      if (html5Player?.useRetrievedFunctionsFromGithub || !playerId) {
        const GITHUB_PLAYER_DATA = await Fetcher_1.Fetcher.request(GITHUB_API_BASE_URL + "/data.json");
        FileCache.set("html5Player", GITHUB_PLAYER_DATA);
        return JSON.parse(GITHUB_PLAYER_DATA);
      }
      const PLAYER_URL = Url_1.Url.getPlayerJsUrl(playerId);
      if (PLAYER_URL) {
        try {
          playerBody = await Fetcher_1.Fetcher.request(PLAYER_URL, options);
        } catch {
        }
      }
      if (!playerBody) {
        try {
          playerBody = await Fetcher_1.Fetcher.request(GITHUB_API_BASE_URL + "/base.js");
        } catch {
        }
      }
      if (!playerBody) {
        throw new Error("Failed to retrieve player body.");
      }
      const DATA = {
        id: playerId,
        body: playerBody,
        signatureTimestamp: PLAYER_URL ? Signature_1.Signature.getSignatureTimestamp(playerBody) || "" : "",
        functions: {
          decipher: (0, Html5Player_1.getDecipherFunction)(playerId, playerBody),
          nTransform: (0, Html5Player_1.getNTransformFunction)(playerId, playerBody)
        }
      };
      FileCache.set("html5Player", JSON.stringify(DATA));
      return DATA;
    }
    __name(getPlayerFunctions, "getPlayerFunctions");
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/parser/Formats.js
var require_Formats = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/parser/Formats.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatParser = void 0;
    var Fetcher_1 = require_Fetcher();
    var Url_1 = require_Url();
    var FormatParser = class {
      static parseFormats(playerResponse) {
        let formats = [];
        if (playerResponse && playerResponse.streamingData) {
          formats = formats.concat(playerResponse.streamingData.formats).concat(playerResponse.streamingData.adaptiveFormats);
        }
        return formats;
      }
      static async getM3U8(url, options) {
        const _URL = new URL(url, Url_1.Url.getBaseUrl()), BODY = await Fetcher_1.Fetcher.request(_URL.toString(), options), FORMATS = {};
        BODY.split("\n").filter((line) => /^https?:\/\//.test(line)).forEach((line) => {
          const MATCH = line.match(/\/itag\/(\d+)\//) || [], ITAG = parseInt(MATCH[1]);
          FORMATS[line] = { itag: ITAG, url: line };
        });
        return FORMATS;
      }
      static parseAdditionalManifests(playerResponse, options) {
        const STREAMING_DATA = playerResponse && playerResponse.streamingData, MANIFESTS = [];
        if (STREAMING_DATA) {
          if (STREAMING_DATA.hlsManifestUrl) {
            MANIFESTS.push(this.getM3U8(STREAMING_DATA.hlsManifestUrl, options));
          }
        }
        return MANIFESTS;
      }
    };
    __name(FormatParser, "FormatParser");
    exports.FormatParser = FormatParser;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/apis/Base.js
var require_Base2 = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/apis/Base.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var Log_1 = require_Log();
    var ApiBase = class {
      static checkResponse(res, client) {
        try {
          if (res.status === "fulfilled") {
            if (res.value === null) {
              return null;
            }
            Log_1.Logger.debug(`[ ${client} ]: <success>Success</success>`);
            return Object.assign({}, res.value);
          } else {
            const REASON = res.reason || {};
            Log_1.Logger.debug(`[ ${client} ]: <error>Error</error> (Reason: <error>${REASON.error?.message || REASON.error?.toString()}</error>)`);
            return REASON;
          }
        } catch (err) {
          return (res || {})?.reason;
        }
      }
    };
    __name(ApiBase, "ApiBase");
    exports.default = ApiBase;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/apis/Player.js
var require_Player = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/apis/Player.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var CLIENTS_NUMBER;
    (function(CLIENTS_NUMBER2) {
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["web"] = 0] = "web";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["webCreator"] = 1] = "webCreator";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["webEmbedded"] = 2] = "webEmbedded";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["tvEmbedded"] = 3] = "tvEmbedded";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["ios"] = 4] = "ios";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["android"] = 5] = "android";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["mweb"] = 6] = "mweb";
      CLIENTS_NUMBER2[CLIENTS_NUMBER2["tv"] = 7] = "tv";
    })(CLIENTS_NUMBER || (CLIENTS_NUMBER = {}));
    var UPPERCASE_CLIENTS;
    (function(UPPERCASE_CLIENTS2) {
      UPPERCASE_CLIENTS2["web"] = "Web";
      UPPERCASE_CLIENTS2["webCreator"] = "WebCreator";
      UPPERCASE_CLIENTS2["webEmbedded"] = "WebEmbedded";
      UPPERCASE_CLIENTS2["tvEmbedded"] = "TvEmbedded";
      UPPERCASE_CLIENTS2["ios"] = "Ios";
      UPPERCASE_CLIENTS2["android"] = "Android";
      UPPERCASE_CLIENTS2["mweb"] = "MWeb";
      UPPERCASE_CLIENTS2["tv"] = "Tv";
    })(UPPERCASE_CLIENTS || (UPPERCASE_CLIENTS = {}));
    var clients_1 = require_clients();
    var errors_1 = require_errors();
    var Log_1 = require_Log();
    var Base_1 = __importDefault(require_Base2());
    var PlayerApi = class {
      static async getApiResponses(playerApiParams, clients) {
        const PLAYER_API_PROMISE = {
          web: clients.includes("web") ? clients_1.Web.getPlayerResponse(playerApiParams) : Promise.reject(null),
          webCreator: clients.includes("webCreator") ? clients_1.WebCreator.getPlayerResponse(playerApiParams) : Promise.reject(null),
          webEmbedded: clients.includes("webEmbedded") ? clients_1.WebEmbedded.getPlayerResponse(playerApiParams) : Promise.reject(null),
          tvEmbedded: clients.includes("tvEmbedded") ? clients_1.TvEmbedded.getPlayerResponse(playerApiParams) : Promise.reject(null),
          ios: clients.includes("ios") ? clients_1.Ios.getPlayerResponse(playerApiParams) : Promise.reject(null),
          android: clients.includes("android") ? clients_1.Android.getPlayerResponse(playerApiParams) : Promise.reject(null),
          mweb: clients.includes("mweb") ? clients_1.MWeb.getPlayerResponse(playerApiParams) : Promise.reject(null),
          tv: clients.includes("tv") ? clients_1.Tv.getPlayerResponse(playerApiParams) : Promise.reject(null)
        }, PLAYER_API_PROMISES = await Promise.allSettled(Object.values(PLAYER_API_PROMISE)), PLAYER_API_RESPONSES = {
          web: null,
          webCreator: null,
          webEmbedded: null,
          tvEmbedded: null,
          ios: null,
          android: null,
          mweb: null,
          tv: null
        };
        clients.forEach((client) => {
          PLAYER_API_RESPONSES[client] = Base_1.default.checkResponse(PLAYER_API_PROMISES[CLIENTS_NUMBER[client]], UPPERCASE_CLIENTS[client])?.contents || null;
        });
        const IS_MINIMUM_MODE = PLAYER_API_PROMISES.every((r) => r.status === "rejected");
        if (IS_MINIMUM_MODE) {
          const ERROR_TEXT = `All player APIs responded with an error. (Clients: ${clients.join(", ")})
For details, specify \`logDisplay: ["debug", "info", "success", "warning", "error"]\` in the constructor options of the YtdlCore class.`;
          if (PLAYER_API_RESPONSES.ios && !PLAYER_API_RESPONSES.ios.videoDetails) {
            throw new errors_1.UnrecoverableError(ERROR_TEXT + `
Note: This error cannot continue processing. (Details: ${JSON.stringify(PLAYER_API_RESPONSES.ios.playabilityStatus.reason)})`, PLAYER_API_RESPONSES.ios.playabilityStatus.reason);
          }
          if (!PLAYER_API_RESPONSES.web) {
            Log_1.Logger.info("As a fallback to obtain the minimum information, the web client is forced to adapt.");
            const WEB_CLIENT_PROMISE = (await Promise.allSettled([clients_1.Web.getPlayerResponse(playerApiParams)]))[0];
            PLAYER_API_RESPONSES.web = Base_1.default.checkResponse(WEB_CLIENT_PROMISE, "Web")?.contents || null;
          }
          Log_1.Logger.error(ERROR_TEXT);
          Log_1.Logger.info("Only minimal information is available, as information from the Player API is not available.");
        }
        return {
          isMinimalMode: IS_MINIMUM_MODE,
          responses: PLAYER_API_RESPONSES
        };
      }
    };
    __name(PlayerApi, "PlayerApi");
    exports.default = PlayerApi;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/apis/Next.js
var require_Next = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/apis/Next.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var clients_1 = require_clients();
    var Base_1 = __importDefault(require_Base2());
    var NextApi = class {
      static async getApiResponses(nextApiParams) {
        const NEXT_API_PROMISE = {
          web: clients_1.Web.getNextResponse(nextApiParams)
        }, NEXT_API_PROMISES = await Promise.allSettled(Object.values(NEXT_API_PROMISE)), NEXT_API_RESPONSES = {
          web: Base_1.default.checkResponse(NEXT_API_PROMISES[0], "Next")?.contents || null
        };
        return NEXT_API_RESPONSES;
      }
    };
    __name(NextApi, "NextApi");
    exports.default = NextApi;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/Extras.js
var require_Extras = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/Extras.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var Url_1 = require_Url();
    var Log_1 = require_Log();
    var NUMBER_FORMAT = /^\d+$/;
    var TIME_FORMAT = /^(?:(?:(\d+):)?(\d{1,2}):)?(\d{1,2})(?:\.(\d{3}))?$/;
    var TIME_IN_ENG_FORMAT = /(-?\d+)(ms|s|m|h)/g;
    var TIME_UNITS = {
      ms: 1,
      s: 1e3,
      m: 6e4,
      h: 36e5
    };
    function parseTimestamp(time3) {
      if (typeof time3 === "number") {
        return time3;
      }
      if (NUMBER_FORMAT.test(time3)) {
        return +time3;
      }
      const PARSED_FORMAT = TIME_FORMAT.exec(time3);
      if (PARSED_FORMAT) {
        return +(PARSED_FORMAT[1] || 0) * TIME_UNITS.h + +(PARSED_FORMAT[2] || 0) * TIME_UNITS.m + +PARSED_FORMAT[3] * TIME_UNITS.s + +(PARSED_FORMAT[4] || 0);
      } else {
        let total = 0;
        for (const PARSED of time3.matchAll(TIME_IN_ENG_FORMAT)) {
          total += +PARSED[1] * TIME_UNITS[PARSED[2]];
        }
        return total;
      }
    }
    __name(parseTimestamp, "parseTimestamp");
    function getText(obj) {
      if (obj && obj.runs) {
        return obj.runs[0].text;
      } else if (obj) {
        return obj.simpleText;
      }
      return "";
    }
    __name(getText, "getText");
    function isVerified(badges) {
      return !!(badges && badges.find((b) => b.metadataBadgeRenderer.tooltip === "Verified"));
    }
    __name(isVerified, "isVerified");
    function getRelativeTime(date, locale = "en") {
      const NOW = /* @__PURE__ */ new Date(), SECONDS_AGO = Math.floor((NOW.getTime() - date.getTime()) / 1e3), RTF = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
      if (SECONDS_AGO < 60) {
        return RTF.format(-SECONDS_AGO, "second");
      } else if (SECONDS_AGO < 3600) {
        return RTF.format(-Math.floor(SECONDS_AGO / 60), "minute");
      } else if (SECONDS_AGO < 86400) {
        return RTF.format(-Math.floor(SECONDS_AGO / 3600), "hour");
      } else if (SECONDS_AGO < 2592e3) {
        return RTF.format(-Math.floor(SECONDS_AGO / 86400), "day");
      } else if (SECONDS_AGO < 31536e3) {
        return RTF.format(-Math.floor(SECONDS_AGO / 2592e3), "month");
      } else {
        return RTF.format(-Math.floor(SECONDS_AGO / 31536e3), "year");
      }
    }
    __name(getRelativeTime, "getRelativeTime");
    function parseStringToNumber(input) {
      const SUFFIX = input.slice(-1).toUpperCase(), VALUE = parseFloat(input.slice(0, -1));
      switch (SUFFIX) {
        case "K":
          return VALUE * 1e3;
        case "M":
          return VALUE * 1e6;
        case "B":
          return VALUE * 1e9;
        default:
          return parseFloat(input);
      }
    }
    __name(parseStringToNumber, "parseStringToNumber");
    function parseRelatedVideo(details) {
      if (!details) {
        return null;
      }
      try {
        let viewCount = getText(details.viewCountText), shortViewCount = getText(details.shortViewCountText);
        if (!/^\d/.test(shortViewCount)) {
          shortViewCount = "";
        }
        viewCount = (/^\d/.test(viewCount) ? viewCount : shortViewCount).split(" ")[0];
        const BROWSE_ENDPOINT = details.shortBylineText.runs[0].navigationEndpoint.browseEndpoint, CHANNEL_ID = BROWSE_ENDPOINT.browseId, NAME = getText(details.shortBylineText), USER = decodeURIComponent((BROWSE_ENDPOINT.canonicalBaseUrl || "").split("/").slice(-1)[0] || ""), PUBLISHED_TEXT = getText(details.publishedTimeText), SHORT_VIEW_COUNT_TEXT = shortViewCount.split(" ")[0], VIDEO = {
          id: details.videoId,
          title: getText(details.title),
          published: PUBLISHED_TEXT || null,
          author: {
            id: CHANNEL_ID,
            name: NAME,
            user: USER,
            channelUrl: `https://www.youtube.com/channel/${CHANNEL_ID}`,
            userUrl: `https://www.youtube.com/` + (USER.includes("@") ? USER : "user/" + USER),
            thumbnails: (details.channelThumbnail.thumbnails || [])?.map((thumbnail) => {
              thumbnail.url = new URL(thumbnail.url, Url_1.Url.getBaseUrl()).toString();
              return thumbnail;
            }),
            subscriberCount: null,
            verified: isVerified(details.ownerBadges || [])
          },
          shortViewCountText: SHORT_VIEW_COUNT_TEXT,
          viewCount: parseInt(viewCount.replace(/,/g, "")),
          lengthSeconds: details.lengthText ? Math.floor(parseTimestamp(getText(details.lengthText)) / 1e3) : null,
          thumbnails: details.thumbnail.thumbnails || [],
          richThumbnails: details.richThumbnail ? details.richThumbnail.movingThumbnailRenderer.movingThumbnailDetails?.thumbnails || [] : [],
          isLive: !!(details.badges && details.badges.find((b) => b.metadataBadgeRenderer.label === "LIVE NOW"))
        };
        return VIDEO;
      } catch (err) {
        Log_1.Logger.debug(`<error>Failed</error> to parse related video (ID: ${details?.videoId || "Unknown"}): <error>${err}</error>`);
        return null;
      }
    }
    __name(parseRelatedVideo, "parseRelatedVideo");
    var InfoExtras = class {
      static getMedia(info3) {
        if (!info3) {
          return null;
        }
        let media = {
          category: "",
          categoryUrl: "",
          thumbnails: []
        }, microformat = null;
        try {
          microformat = info3.microformat?.playerMicroformatRenderer || null;
        } catch (err) {
        }
        if (!microformat) {
          return null;
        }
        try {
          media.category = microformat.category;
          media.thumbnails = microformat.thumbnail.thumbnails || [];
          if (media.category === "Music") {
            media.categoryUrl = Url_1.Url.getBaseUrl() + "/music";
          } else if (media.category === "Gaming") {
            media.categoryUrl = Url_1.Url.getBaseUrl() + "/gaming";
          }
        } catch (err) {
        }
        return media;
      }
      static getAuthor(info3) {
        if (!info3) {
          return null;
        }
        let channelName = null, channelId = null, user = null, thumbnails = [], subscriberCount = null, verified = false, videoSecondaryInfoRenderer = null;
        try {
          const VIDEO_SECONDARY_INFO_RENDERER = info3.contents.twoColumnWatchNextResults.results.results.contents.find((c) => c.videoSecondaryInfoRenderer);
          videoSecondaryInfoRenderer = VIDEO_SECONDARY_INFO_RENDERER?.videoSecondaryInfoRenderer;
        } catch (err) {
        }
        if (!videoSecondaryInfoRenderer || !videoSecondaryInfoRenderer.owner) {
          return null;
        }
        try {
          const VIDEO_OWNER_RENDERER = videoSecondaryInfoRenderer.owner.videoOwnerRenderer;
          channelName = VIDEO_OWNER_RENDERER.title.runs[0].text || null;
          channelId = VIDEO_OWNER_RENDERER.navigationEndpoint.browseEndpoint.browseId || null;
          user = VIDEO_OWNER_RENDERER.navigationEndpoint.browseEndpoint.canonicalBaseUrl.replace("/", "") || null;
          thumbnails = VIDEO_OWNER_RENDERER.thumbnail.thumbnails || [];
          subscriberCount = Math.floor(parseStringToNumber(VIDEO_OWNER_RENDERER.subscriberCountText.simpleText.split(" ")[0])) || null;
          verified = isVerified(VIDEO_OWNER_RENDERER.badges || []);
        } catch (err) {
        }
        try {
          const AUTHOR = {
            id: channelId || "",
            name: channelName || "",
            user: user || "",
            channelUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : "",
            externalChannelUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : "",
            userUrl: "https://www.youtube.com" + user,
            thumbnails,
            subscriberCount,
            verified
          };
          return AUTHOR;
        } catch (err) {
          return null;
        }
      }
      static getAuthorFromPlayerResponse(info3) {
        let channelName = null, channelId = null, user = null, thumbnails = [], subscriberCount = null, verified = false, microformat = null, endscreen = null;
        try {
          microformat = info3.microformat?.playerMicroformatRenderer || null;
          endscreen = info3.endscreen?.endscreenRenderer.elements.find((e) => e.endscreenElementRenderer.style === "CHANNEL")?.endscreenElementRenderer;
        } catch (err) {
        }
        if (!microformat) {
          return null;
        }
        try {
          channelName = microformat.ownerChannelName || null;
          channelId = microformat.externalChannelId;
          user = "@" + (microformat.ownerProfileUrl || "").split("@")[1];
          thumbnails = endscreen.image.thumbnails || [];
          subscriberCount = null;
          verified = false;
        } catch (err) {
        }
        try {
          const AUTHOR = {
            id: channelId || "",
            name: channelName || "",
            user: user || "",
            channelUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : "",
            externalChannelUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : "",
            userUrl: "https://www.youtube.com/" + user,
            thumbnails,
            subscriberCount,
            verified
          };
          return AUTHOR;
        } catch (err) {
          return null;
        }
      }
      static getLikes(info3) {
        if (!info3) {
          return null;
        }
        try {
          const CONTENTS = info3.contents.twoColumnWatchNextResults.results.results.contents, VIDEO = CONTENTS.find((r) => r.videoPrimaryInfoRenderer), BUTTONS = VIDEO.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons, BUTTON_VIEW_MODEL = BUTTONS.filter((b) => b.segmentedLikeDislikeButtonViewModel)[0].segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel.toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel.buttonViewModel, ACCESSIBILITY_TEXT = BUTTON_VIEW_MODEL.accessibilityText, TITLE = BUTTON_VIEW_MODEL.title;
          if (ACCESSIBILITY_TEXT) {
            const MATCH = ACCESSIBILITY_TEXT.match(/[\d,.]+/) || [];
            return parseInt((MATCH[0] || "").replace(/\D+/g, ""));
          } else if (TITLE) {
            return parseStringToNumber(TITLE);
          }
          return null;
        } catch (err) {
          return null;
        }
      }
      static getRelatedVideos(info3) {
        if (!info3) {
          return [];
        }
        let secondaryResults = [];
        try {
          secondaryResults = info3.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results;
        } catch (err) {
        }
        const VIDEOS = [];
        for (const RESULT of secondaryResults) {
          const DETAILS = RESULT.compactVideoRenderer;
          if (DETAILS) {
            const VIDEO = parseRelatedVideo(DETAILS);
            if (VIDEO) {
              VIDEOS.push(VIDEO);
            }
          } else {
            const AUTOPLAY = RESULT.compactAutoplayRenderer || RESULT.itemSectionRenderer;
            if (!AUTOPLAY || !Array.isArray(AUTOPLAY.contents)) {
              continue;
            }
            for (const CONTENT of AUTOPLAY.contents) {
              const VIDEO = parseRelatedVideo(CONTENT.compactVideoRenderer);
              if (VIDEO) {
                VIDEOS.push(VIDEO);
              }
            }
          }
        }
        return VIDEOS;
      }
      static cleanVideoDetails(videoDetails, microformat, lang = "en") {
        const DETAILS = videoDetails;
        if (DETAILS.thumbnail) {
          DETAILS.thumbnails = DETAILS.thumbnail.thumbnails;
        }
        const DESCRIPTION = DETAILS.shortDescription || getText(DETAILS.description);
        if (DESCRIPTION) {
          DETAILS.description = DESCRIPTION;
        }
        if (typeof DETAILS.thumbnail !== "undefined") {
          delete DETAILS.thumbnail;
        }
        if (typeof DETAILS.shortDescription !== "undefined") {
          delete DETAILS.shortDescription;
        }
        if (microformat) {
          DETAILS.lengthSeconds = parseInt(microformat.lengthSeconds || videoDetails.lengthSeconds.toString());
          DETAILS.publishDate = microformat.publishDate || videoDetails.publishDate || null;
          DETAILS.published = null;
          try {
            if (DETAILS.publishDate) {
              DETAILS.published = getRelativeTime(new Date(DETAILS.publishDate), lang) || null;
            }
          } catch {
          }
        }
        if (DETAILS.lengthSeconds) {
          DETAILS.lengthSeconds = parseInt(DETAILS.lengthSeconds);
        }
        if (DETAILS.viewCount) {
          DETAILS.viewCount = parseInt(DETAILS.viewCount);
        }
        return DETAILS;
      }
      static getStoryboards(info3) {
        if (!info3 || !info3.storyboards) {
          return [];
        }
        const PARTS = info3.storyboards && info3.storyboards.playerStoryboardSpecRenderer && info3.storyboards.playerStoryboardSpecRenderer.spec && info3.storyboards.playerStoryboardSpecRenderer.spec.split("|");
        if (!PARTS) {
          return [];
        }
        const _URL = new URL(PARTS.shift() || "");
        return PARTS.map((part, i) => {
          let [thumbnailWidth, thumbnailHeight, thumbnailCount, columns, rows, interval, nameReplacement, sigh] = part.split("#");
          _URL.searchParams.set("sigh", sigh);
          thumbnailCount = parseInt(thumbnailCount, 10);
          columns = parseInt(columns, 10);
          rows = parseInt(rows, 10);
          const STORYBOARD_COUNT = Math.ceil(thumbnailCount / (columns * rows));
          return {
            templateUrl: _URL.toString().replace("$L", i.toString()).replace("$N", nameReplacement),
            thumbnailWidth: parseInt(thumbnailWidth, 10),
            thumbnailHeight: parseInt(thumbnailHeight, 10),
            thumbnailCount,
            interval: parseInt(interval, 10),
            columns,
            rows,
            storyboardCount: STORYBOARD_COUNT
          };
        });
      }
      static getChapters(info3) {
        if (!info3) {
          return [];
        }
        const PLAYER_OVERLAY_RENDERER = info3.playerOverlays && info3.playerOverlays.playerOverlayRenderer, PLAYER_BAR = PLAYER_OVERLAY_RENDERER && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer && PLAYER_OVERLAY_RENDERER.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar, MARKERS_MAP = PLAYER_BAR && PLAYER_BAR.multiMarkersPlayerBarRenderer && PLAYER_BAR.multiMarkersPlayerBarRenderer.markersMap, MARKER = Array.isArray(MARKERS_MAP) && MARKERS_MAP.find((m) => m.value && Array.isArray(m.value.chapters));
        if (!MARKER) {
          return [];
        }
        const CHAPTERS = MARKER.value.chapters;
        return CHAPTERS.map((chapter) => {
          return {
            title: getText(chapter.chapterRenderer.title),
            startTime: chapter.chapterRenderer.timeRangeStartMillis / 1e3
          };
        });
      }
    };
    __name(InfoExtras, "InfoExtras");
    exports.default = InfoExtras;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/BasicInfo.js
var require_BasicInfo = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/BasicInfo.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._getBasicInfo = _getBasicInfo;
    exports.getBasicInfo = getBasicInfo;
    var OAuth2_1 = require_OAuth2();
    var Platform_1 = require_Platform();
    var Log_1 = require_Log();
    var General_1 = __importDefault(require_General());
    var Url_1 = require_Url();
    var Html5Player_1 = require_Html5Player2();
    var Formats_1 = require_Formats();
    var Player_1 = __importDefault(require_Player());
    var Next_1 = __importDefault(require_Next());
    var Extras_1 = __importDefault(require_Extras());
    var AGE_RESTRICTED_URLS = ["support.google.com/youtube/?p=age_restrictions", "youtube.com/t/community_guidelines"];
    var SUPPORTED_CLIENTS = ["web", "webCreator", "webEmbedded", "ios", "android", "mweb", "tv", "tvEmbedded"];
    var BASE_CLIENTS = ["web", "mweb", "tv", "ios"];
    var _SHIM = Platform_1.Platform.getShim();
    var CACHE = _SHIM.cache;
    var BASE_INFO = {
      videoDetails: {
        videoUrl: "",
        videoId: "",
        playabilityStatus: "UNKNOWN",
        title: "",
        author: null,
        lengthSeconds: 0,
        viewCount: 0,
        likes: null,
        media: null,
        storyboards: [],
        chapters: [],
        thumbnails: [],
        description: null,
        keywords: [],
        channelId: "",
        ageRestricted: false,
        allowRatings: false,
        isOwnerViewing: false,
        isCrawlable: false,
        isPrivate: false,
        isUnpluggedCorpus: false,
        isLiveContent: false,
        isUpcoming: false,
        isLowLatencyLiveStream: false,
        liveBroadcastDetails: {
          isLiveNow: false,
          startTimestamp: ""
        },
        published: null,
        publishDate: null,
        latencyClass: null
      },
      relatedVideos: [],
      formats: [],
      full: false,
      _metadata: {
        isMinimumMode: false,
        clients: [],
        html5PlayerId: "",
        id: "",
        options: {}
      },
      _ytdl: {
        version: _SHIM.info.version
      }
    };
    var BASE_INFO_STRING = JSON.stringify(BASE_INFO);
    function setupClients(clients, disableDefaultClients) {
      if (!clients || clients && clients.length === 0) {
        Log_1.Logger.warning("At least one client must be specified.");
        clients = BASE_CLIENTS;
      }
      clients = clients.filter((client) => SUPPORTED_CLIENTS.includes(client));
      if (disableDefaultClients) {
        return clients;
      }
      return [.../* @__PURE__ */ new Set([...BASE_CLIENTS, ...clients])];
    }
    __name(setupClients, "setupClients");
    async function _getBasicInfo(id, options, isFromGetInfo) {
      const SHIM = Platform_1.Platform.getShim(), HTML5_PLAYER_PROMISE = (0, Html5Player_1.getPlayerFunctions)(options, options.html5Player);
      if (options.oauth2 && options.oauth2 instanceof OAuth2_1.OAuth2 && options.oauth2.shouldRefreshToken()) {
        Log_1.Logger.info("The specified OAuth2 token has expired and will be renewed automatically.");
        await options.oauth2.refreshAccessToken();
      }
      if (!options.poToken && !options.disablePoTokenAutoGeneration) {
        Log_1.Logger.warning("Specify poToken for stable and fast operation. See README for details.");
        Log_1.Logger.info("Automatically generates poToken, but stable operation cannot be guaranteed.");
        const { poToken, visitorData } = await SHIM.poToken();
        options.poToken = poToken;
        options.visitorData = visitorData;
      }
      if (options.poToken && !options.visitorData) {
        Log_1.Logger.warning("If you specify a poToken, you must also specify the visitorData.");
      }
      options.clients = setupClients(options.clients, options.disableDefaultClients ?? false);
      const HTML5_PLAYER_RESPONSE = await HTML5_PLAYER_PROMISE;
      const SIGNATURE_TIMESTAMP = parseInt(HTML5_PLAYER_RESPONSE.signatureTimestamp || "0") || 0, PLAYER_API_PARAMS = {
        videoId: id,
        signatureTimestamp: SIGNATURE_TIMESTAMP,
        options
      }, VIDEO_INFO = JSON.parse(BASE_INFO_STRING);
      const PROMISES = {
        playerApiRequest: Player_1.default.getApiResponses(PLAYER_API_PARAMS, options.clients),
        nextApiRequest: Next_1.default.getApiResponses(PLAYER_API_PARAMS)
      }, { isMinimalMode, responses: PLAYER_RESPONSES } = await PROMISES.playerApiRequest, NEXT_RESPONSES = await PROMISES.nextApiRequest, PLAYER_RESPONSE_LIST = Object.values(PLAYER_RESPONSES) || [];
      VIDEO_INFO._metadata.isMinimumMode = isMinimalMode;
      VIDEO_INFO._metadata.html5PlayerId = HTML5_PLAYER_RESPONSE.id;
      VIDEO_INFO._metadata.clients = options.clients;
      VIDEO_INFO._metadata.options = options;
      VIDEO_INFO._metadata.id = id;
      if (options.includesPlayerAPIResponse || isFromGetInfo) {
        VIDEO_INFO._playerApiResponses = PLAYER_RESPONSES;
      }
      if (options.includesNextAPIResponse || isFromGetInfo) {
        VIDEO_INFO._nextApiResponses = NEXT_RESPONSES;
      }
      function getValue(array, name, value) {
        try {
          return array.filter((v) => typeof v === "object" && v !== null && v[name] && (value ? v[name] === value : true))[0];
        } catch {
          return void 0;
        }
      }
      __name(getValue, "getValue");
      const INCLUDE_STORYBOARDS = getValue(PLAYER_RESPONSE_LIST, "storyboards") || null, VIDEO_DETAILS = getValue(PLAYER_RESPONSE_LIST, "videoDetails")?.videoDetails || {}, MICROFORMAT = getValue(PLAYER_RESPONSE_LIST, "microformat")?.microformat || null, LIVE_BROADCAST_DETAILS = PLAYER_RESPONSES.web?.microformat?.playerMicroformatRenderer?.liveBroadcastDetails || null;
      const STORYBOARDS = Extras_1.default.getStoryboards(INCLUDE_STORYBOARDS), MEDIA = Extras_1.default.getMedia(PLAYER_RESPONSES.web) || Extras_1.default.getMedia(PLAYER_RESPONSES.webCreator) || Extras_1.default.getMedia(PLAYER_RESPONSES.ios) || Extras_1.default.getMedia(PLAYER_RESPONSES.android) || Extras_1.default.getMedia(PLAYER_RESPONSES.webEmbedded) || Extras_1.default.getMedia(PLAYER_RESPONSES.tvEmbedded) || Extras_1.default.getMedia(PLAYER_RESPONSES.mweb) || Extras_1.default.getMedia(PLAYER_RESPONSES.tv), AGE_RESTRICTED = !!MEDIA && AGE_RESTRICTED_URLS.some((url) => Object.values(MEDIA || {}).some((v) => typeof v === "string" && v.includes(url))), ADDITIONAL_DATA = {
        author: Extras_1.default.getAuthor(NEXT_RESPONSES.web),
        media: MEDIA,
        likes: Extras_1.default.getLikes(NEXT_RESPONSES.web),
        ageRestricted: AGE_RESTRICTED,
        storyboards: STORYBOARDS,
        chapters: Extras_1.default.getChapters(NEXT_RESPONSES.web)
      };
      const FORMATS = PLAYER_RESPONSE_LIST.reduce((items, playerResponse) => {
        return [...items, ...Formats_1.FormatParser.parseFormats(playerResponse)];
      }, []);
      VIDEO_INFO.videoDetails.videoUrl = Url_1.Url.getWatchPageUrl(id);
      VIDEO_INFO.videoDetails = Extras_1.default.cleanVideoDetails(Object.assign(VIDEO_INFO.videoDetails, VIDEO_DETAILS, ADDITIONAL_DATA), MICROFORMAT?.playerMicroformatRenderer || null, options.hl);
      VIDEO_INFO.videoDetails.playabilityStatus = getValue(PLAYER_RESPONSE_LIST, "playabilityStatus", "OK")?.playabilityStatus.status || PLAYER_RESPONSE_LIST[0]?.playabilityStatus.status || "UNKNOWN";
      VIDEO_INFO.videoDetails.liveBroadcastDetails = LIVE_BROADCAST_DETAILS;
      VIDEO_INFO.relatedVideos = options.includesRelatedVideo ? Extras_1.default.getRelatedVideos(NEXT_RESPONSES.web) : [];
      VIDEO_INFO.formats = FORMATS.filter(Boolean);
      return VIDEO_INFO;
    }
    __name(_getBasicInfo, "_getBasicInfo");
    async function getBasicInfo(link, options) {
      if (_SHIM.runtime !== "serverless") {
        General_1.default.checkForUpdates();
      }
      const ID = Url_1.Url.getVideoID(link) || (Url_1.Url.validateID(link) ? link : null);
      if (!ID) {
        throw new Error("The URL specified is not a valid URL.");
      }
      const CACHE_KEY = ["getBasicInfo", ID, options.hl, options.gl].join("-");
      if (await CACHE.has(CACHE_KEY)) {
        return CACHE.get(CACHE_KEY);
      }
      const RESULTS = await _getBasicInfo(ID, options, false);
      CACHE.set(CACHE_KEY, RESULTS, {
        ttl: 60 * 30
        //30Min
      });
      return RESULTS;
    }
    __name(getBasicInfo, "getBasicInfo");
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/meta/formats.js
var require_formats = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/meta/formats.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FORMATS = void 0;
    var FORMATS = {
      5: {
        mimeType: 'video/flv; codecs="Sorenson H.283, mp3"',
        qualityLabel: "240p",
        bitrate: 25e4,
        audioBitrate: 64
      },
      6: {
        mimeType: 'video/flv; codecs="Sorenson H.263, mp3"',
        qualityLabel: "270p",
        bitrate: 8e5,
        audioBitrate: 64
      },
      13: {
        mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
        qualityLabel: null,
        bitrate: 5e5,
        audioBitrate: null
      },
      17: {
        mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
        qualityLabel: "144p",
        bitrate: 5e4,
        audioBitrate: 24
      },
      18: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 96
      },
      22: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 2e6,
        audioBitrate: 192
      },
      34: {
        mimeType: 'video/flv; codecs="H.264, aac"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 128
      },
      35: {
        mimeType: 'video/flv; codecs="H.264, aac"',
        qualityLabel: "480p",
        bitrate: 8e5,
        audioBitrate: 128
      },
      36: {
        mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
        qualityLabel: "240p",
        bitrate: 175e3,
        audioBitrate: 32
      },
      37: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "1080p",
        bitrate: 3e6,
        audioBitrate: 192
      },
      38: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "3072p",
        bitrate: 35e5,
        audioBitrate: 192
      },
      43: {
        mimeType: 'video/webm; codecs="VP8, vorbis"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 128
      },
      44: {
        mimeType: 'video/webm; codecs="VP8, vorbis"',
        qualityLabel: "480p",
        bitrate: 1e6,
        audioBitrate: 128
      },
      45: {
        mimeType: 'video/webm; codecs="VP8, vorbis"',
        qualityLabel: "720p",
        bitrate: 2e6,
        audioBitrate: 192
      },
      46: {
        mimeType: 'audio/webm; codecs="vp8, vorbis"',
        qualityLabel: "1080p",
        bitrate: null,
        audioBitrate: 192
      },
      82: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 96
      },
      83: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "240p",
        bitrate: 5e5,
        audioBitrate: 96
      },
      84: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 2e6,
        audioBitrate: 192
      },
      85: {
        mimeType: 'video/mp4; codecs="H.264, aac"',
        qualityLabel: "1080p",
        bitrate: 3e6,
        audioBitrate: 192
      },
      91: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "144p",
        bitrate: 1e5,
        audioBitrate: 48
      },
      92: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "240p",
        bitrate: 15e4,
        audioBitrate: 48
      },
      93: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "360p",
        bitrate: 5e5,
        audioBitrate: 128
      },
      94: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "480p",
        bitrate: 8e5,
        audioBitrate: 128
      },
      95: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 15e5,
        audioBitrate: 256
      },
      96: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "1080p",
        bitrate: 25e5,
        audioBitrate: 256
      },
      100: {
        mimeType: 'audio/webm; codecs="VP8, vorbis"',
        qualityLabel: "360p",
        bitrate: null,
        audioBitrate: 128
      },
      101: {
        mimeType: 'audio/webm; codecs="VP8, vorbis"',
        qualityLabel: "360p",
        bitrate: null,
        audioBitrate: 192
      },
      102: {
        mimeType: 'audio/webm; codecs="VP8, vorbis"',
        qualityLabel: "720p",
        bitrate: null,
        audioBitrate: 192
      },
      120: {
        mimeType: 'video/flv; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 2e6,
        audioBitrate: 128
      },
      127: {
        mimeType: 'audio/ts; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 96
      },
      128: {
        mimeType: 'audio/ts; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 96
      },
      132: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "240p",
        bitrate: 15e4,
        audioBitrate: 48
      },
      133: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "240p",
        bitrate: 2e5,
        audioBitrate: null
      },
      134: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "360p",
        bitrate: 3e5,
        audioBitrate: null
      },
      135: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "480p",
        bitrate: 5e5,
        audioBitrate: null
      },
      136: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "720p",
        bitrate: 1e6,
        audioBitrate: null
      },
      137: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1080p",
        bitrate: 25e5,
        audioBitrate: null
      },
      138: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "4320p",
        bitrate: 135e5,
        audioBitrate: null
      },
      139: {
        mimeType: 'audio/mp4; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 48
      },
      140: {
        mimeType: 'audio/m4a; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 128
      },
      141: {
        mimeType: 'audio/mp4; codecs="aac"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 256
      },
      151: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 5e4,
        audioBitrate: 24
      },
      160: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "144p",
        bitrate: 1e5,
        audioBitrate: null
      },
      171: {
        mimeType: 'audio/webm; codecs="vorbis"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 128
      },
      172: {
        mimeType: 'audio/webm; codecs="vorbis"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 192
      },
      231: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "480p",
        bitrate: 5e5,
        audioBitrate: null
      },
      232: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 8e5,
        audioBitrate: null
      },
      242: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "240p",
        bitrate: 1e5,
        audioBitrate: null
      },
      243: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "360p",
        bitrate: 25e4,
        audioBitrate: null
      },
      244: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "480p",
        bitrate: 5e5,
        audioBitrate: null
      },
      247: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "720p",
        bitrate: 7e5,
        audioBitrate: null
      },
      248: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1080p",
        bitrate: 15e5,
        audioBitrate: null
      },
      249: {
        mimeType: 'audio/webm; codecs="opus"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 48
      },
      250: {
        mimeType: 'audio/webm; codecs="opus"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 64
      },
      251: {
        mimeType: 'audio/webm; codecs="opus"',
        qualityLabel: null,
        bitrate: null,
        audioBitrate: 160
      },
      264: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1440p",
        bitrate: 4e6,
        audioBitrate: null
      },
      266: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "2160p",
        bitrate: 125e5,
        audioBitrate: null
      },
      270: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1080p",
        bitrate: 25e5,
        audioBitrate: null
      },
      271: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1440p",
        bitrate: 9e6,
        audioBitrate: null
      },
      272: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "4320p",
        bitrate: 2e7,
        audioBitrate: null
      },
      278: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "144p 30fps",
        bitrate: 8e4,
        audioBitrate: null
      },
      298: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "720p",
        bitrate: 3e6,
        audioBitrate: null
      },
      299: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1080p",
        bitrate: 55e5,
        audioBitrate: null
      },
      300: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "720p",
        bitrate: 1318e3,
        audioBitrate: 48
      },
      301: {
        mimeType: 'video/ts; codecs="H.264, aac"',
        qualityLabel: "1080p",
        bitrate: 3e6,
        audioBitrate: 128
      },
      302: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "720p HFR",
        bitrate: 25e5,
        audioBitrate: null
      },
      303: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1080p HFR",
        bitrate: 5e6,
        audioBitrate: null
      },
      308: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1440p HFR",
        bitrate: 1e7,
        audioBitrate: null
      },
      311: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "720p",
        bitrate: 125e4,
        audioBitrate: null
      },
      312: {
        mimeType: 'video/mp4; codecs="H.264"',
        qualityLabel: "1080p",
        bitrate: 25e5,
        audioBitrate: null
      },
      313: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "2160p",
        bitrate: 13e6,
        audioBitrate: null
      },
      315: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "2160p HFR",
        bitrate: 2e7,
        audioBitrate: null
      },
      330: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "144p HDR, HFR",
        bitrate: 8e4,
        audioBitrate: null
      },
      331: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "240p HDR, HFR",
        bitrate: 1e5,
        audioBitrate: null
      },
      332: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "360p HDR, HFR",
        bitrate: 25e4,
        audioBitrate: null
      },
      333: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "240p HDR, HFR",
        bitrate: 5e5,
        audioBitrate: null
      },
      334: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "720p HDR, HFR",
        bitrate: 1e6,
        audioBitrate: null
      },
      335: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1080p HDR, HFR",
        bitrate: 15e5,
        audioBitrate: null
      },
      336: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "1440p HDR, HFR",
        bitrate: 5e6,
        audioBitrate: null
      },
      337: {
        mimeType: 'video/webm; codecs="VP9"',
        qualityLabel: "2160p HDR, HFR",
        bitrate: 12e6,
        audioBitrate: null
      }
    };
    exports.FORMATS = FORMATS;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Format.js
var require_Format = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/utils/Format.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatUtils = void 0;
    var formats_1 = require_formats();
    var General_1 = __importDefault(require_General());
    var AUDIO_ENCODING_RANKS = ["mp4a", "mp3", "vorbis", "aac", "opus", "flac"];
    var VIDEO_ENCODING_RANKS = ["mp4v", "avc1", "Sorenson H.283", "MPEG-4 Visual", "VP8", "VP9", "av01", "H.264"];
    function getEncodingRank(ranks, format) {
      return ranks.findIndex((enc) => format.codec.text && format.codec.text.includes(enc));
    }
    __name(getEncodingRank, "getEncodingRank");
    function getVideoBitrate(format) {
      return format.bitrate || 0;
    }
    __name(getVideoBitrate, "getVideoBitrate");
    function getVideoEncodingRank(format) {
      return getEncodingRank(VIDEO_ENCODING_RANKS, format);
    }
    __name(getVideoEncodingRank, "getVideoEncodingRank");
    function getAudioBitrate(format) {
      return format.audioBitrate || 0;
    }
    __name(getAudioBitrate, "getAudioBitrate");
    function getAudioEncodingRank(format) {
      return getEncodingRank(AUDIO_ENCODING_RANKS, format);
    }
    __name(getAudioEncodingRank, "getAudioEncodingRank");
    function sortFormatsBy(a, b, sortBy) {
      let res = 0;
      for (const FUNC of sortBy) {
        res = FUNC(b) - FUNC(a);
        if (res !== 0) {
          break;
        }
      }
      return res;
    }
    __name(sortFormatsBy, "sortFormatsBy");
    function getQualityLabel(format) {
      return parseInt(format.quality.label) || 0;
    }
    __name(getQualityLabel, "getQualityLabel");
    function sortFormatsByVideo(a, b) {
      return sortFormatsBy(a, b, [getQualityLabel, getVideoBitrate, getVideoEncodingRank]);
    }
    __name(sortFormatsByVideo, "sortFormatsByVideo");
    function sortFormatsByAudio(a, b) {
      return sortFormatsBy(a, b, [getAudioBitrate, getAudioEncodingRank]);
    }
    __name(sortFormatsByAudio, "sortFormatsByAudio");
    function getFormatByQuality(quality, formats) {
      const getFormat = /* @__PURE__ */ __name((itag) => formats.find((format) => `${format.itag}` === `${itag}`) || null, "getFormat");
      if (Array.isArray(quality)) {
        const FOUND = quality.find((itag) => getFormat(itag));
        if (!FOUND) {
          return null;
        }
        return getFormat(FOUND) || null;
      } else {
        return getFormat(quality || "") || null;
      }
    }
    __name(getFormatByQuality, "getFormatByQuality");
    var FormatUtils = class {
      static sortFormats(a, b) {
        return sortFormatsBy(a, b, [
          // Formats with both video and audio are ranked highest.
          (format) => +!!format.isHLS,
          (format) => +!!format.isDashMPD,
          (format) => +(parseInt(format.contentLength) > 0),
          (format) => +(format.hasVideo && format.hasAudio),
          (format) => +format.hasVideo,
          (format) => parseInt(format.quality.label) || 0,
          getVideoBitrate,
          getAudioBitrate,
          getVideoEncodingRank,
          getAudioEncodingRank
        ]);
      }
      static filterFormats(formats, filter) {
        let fn;
        switch (filter) {
          case "videoandaudio":
          case "audioandvideo": {
            fn = /* @__PURE__ */ __name((format) => format.hasVideo && format.hasAudio, "fn");
            break;
          }
          case "video": {
            fn = /* @__PURE__ */ __name((format) => format.hasVideo, "fn");
            break;
          }
          case "videoonly": {
            fn = /* @__PURE__ */ __name((format) => format.hasVideo && !format.hasAudio, "fn");
            break;
          }
          case "audio": {
            fn = /* @__PURE__ */ __name((format) => format.hasAudio, "fn");
            break;
          }
          case "audioonly": {
            fn = /* @__PURE__ */ __name((format) => format.hasAudio && !format.hasVideo, "fn");
            break;
          }
          default: {
            if (typeof filter === "function") {
              fn = filter;
            } else {
              throw new TypeError(`Given filter (${filter}) is not supported`);
            }
          }
        }
        return formats.filter((format) => !!format.url && fn(format));
      }
      static chooseFormat(formats, options) {
        if (typeof options.format === "object") {
          if (!options.format.url) {
            throw new Error("Invalid format given, did you use `ytdl.getFullInfo()`?");
          }
          return options.format;
        }
        if (options.filter) {
          formats = this.filterFormats(formats, options.filter);
        }
        if (options.excludingClients) {
          formats = formats.filter((format2) => !options.excludingClients?.includes(format2.sourceClientName));
        }
        if (options.includingClients && options.includingClients !== "all") {
          formats = formats.filter((format2) => options.includingClients?.includes(format2.sourceClientName));
        }
        if (formats.some((format2) => format2.isHLS)) {
          formats = formats.filter((format2) => format2.isHLS || !format2.isLive);
        }
        const QUALITY = options.quality || "highest";
        let format;
        switch (QUALITY) {
          case "highest": {
            format = formats[0];
            break;
          }
          case "lowest": {
            format = formats[formats.length - 1];
            break;
          }
          case "highestaudio": {
            formats = this.filterFormats(formats, "audio");
            formats.sort(sortFormatsByAudio);
            const BEST_AUDIO_FORMAT = formats[0];
            formats = formats.filter((format2) => sortFormatsByAudio(BEST_AUDIO_FORMAT, format2) === 0);
            const WORST_VIDEO_QUALITY = formats.map((format2) => parseInt(format2.quality.label) || 0).sort((a, b) => a - b)[0];
            format = formats.find((format2) => (parseInt(format2.quality.label) || 0) === WORST_VIDEO_QUALITY);
            break;
          }
          case "lowestaudio": {
            formats = this.filterFormats(formats, "audio");
            formats.sort(sortFormatsByAudio);
            format = formats[formats.length - 1];
            break;
          }
          case "highestvideo": {
            formats = this.filterFormats(formats, "video");
            formats.sort(sortFormatsByVideo);
            const BEST_VIDEO_FORMAT = formats[0];
            formats = formats.filter((format2) => sortFormatsByVideo(BEST_VIDEO_FORMAT, format2) === 0);
            const WORST_VIDEO_QUALITY = formats.map((format2) => format2.audioBitrate || 0).sort((a, b) => a - b)[0];
            format = formats.find((format2) => (format2.audioBitrate || 0) === WORST_VIDEO_QUALITY);
            break;
          }
          case "lowestvideo": {
            formats = this.filterFormats(formats, "video");
            formats.sort(sortFormatsByVideo);
            format = formats[formats.length - 1];
            break;
          }
          default: {
            format = getFormatByQuality(QUALITY, formats);
            break;
          }
        }
        if (!format) {
          throw new Error(`No such format found: ${QUALITY}`);
        }
        return format;
      }
      static getClientName(url) {
        try {
          const C = new URL(url).searchParams.get("c");
          switch (C) {
            case "WEB": {
              return "web";
            }
            case "MWEB": {
              return "mweb";
            }
            case "WEB_CREATOR": {
              return "webCreator";
            }
            case "WEB_EMBEDDED_PLAYER": {
              return "webEmbedded";
            }
            case "IOS": {
              return "ios";
            }
            case "ANDROID": {
              return "android";
            }
            case "TVHTML5_SIMPLY_EMBEDDED_PLAYER": {
              return "tvEmbedded";
            }
            case "TVHTML5": {
              return "tv";
            }
            default: {
              return "unknown";
            }
          }
        } catch {
          return "unknown";
        }
      }
      static addFormatMeta(adaptiveFormat, includesOriginalFormatData) {
        const ITAG = adaptiveFormat.itag, ADDITIONAL_FORMAT_DATA = formats_1.FORMATS[ITAG] || null, CODEC = adaptiveFormat.mimeType && General_1.default.between(adaptiveFormat.mimeType, 'codecs="', '"'), IS_HLS = /\/manifest\/hls_(variant|playlist)\//.test(adaptiveFormat.url), FORMAT = {
          itag: ITAG,
          url: adaptiveFormat.url,
          mimeType: adaptiveFormat.mimeType || "video/mp4",
          codec: {
            text: CODEC || "h264",
            video: null,
            audio: null
          },
          quality: {
            text: adaptiveFormat.quality,
            label: adaptiveFormat.qualityLabel || (IS_HLS ? "video" : "audio")
          },
          bitrate: adaptiveFormat.bitrate || ADDITIONAL_FORMAT_DATA?.bitrate || NaN,
          audioBitrate: ADDITIONAL_FORMAT_DATA?.audioBitrate || NaN,
          contentLength: adaptiveFormat.contentLength,
          container: adaptiveFormat.mimeType?.split(";")[0].split("/")[1] || null,
          hasVideo: !!adaptiveFormat.qualityLabel || !!!adaptiveFormat.audioQuality,
          hasAudio: !!adaptiveFormat.audioQuality,
          isLive: /\bsource[/=]yt_live_broadcast\b/.test(adaptiveFormat.url),
          isHLS: IS_HLS,
          isDashMPD: /\/manifest\/dash\//.test(adaptiveFormat.url),
          sourceClientName: IS_HLS ? "ios" : this.getClientName(adaptiveFormat.url) || "unknown"
        }, SPLITTED_CODEC = FORMAT.codec.text.split(", ");
        if (includesOriginalFormatData) {
          FORMAT.originalData = adaptiveFormat;
        }
        FORMAT.codec.video = FORMAT.hasVideo ? SPLITTED_CODEC[0] : null;
        FORMAT.codec.audio = FORMAT.hasAudio ? SPLITTED_CODEC[1] || SPLITTED_CODEC[0] : null;
        return FORMAT;
      }
    };
    __name(FormatUtils, "FormatUtils");
    exports.FormatUtils = FormatUtils;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/FullInfo.js
var require_FullInfo = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/FullInfo.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFullInfo = getFullInfo;
    var Signature_1 = require_Signature();
    var Platform_1 = require_Platform();
    var General_1 = __importDefault(require_General());
    var Url_1 = require_Url();
    var Format_1 = require_Format();
    var Formats_1 = require_Formats();
    var BasicInfo_1 = require_BasicInfo();
    var Html5Player_1 = require_Html5Player2();
    var CACHE = Platform_1.Platform.getShim().cache;
    var SIGNATURE = new Signature_1.Signature();
    async function _getFullInfo(id, options) {
      const BASIC_INFO = await (0, BasicInfo_1._getBasicInfo)(id, options, true), HTML5_PLAYER_PROMISE = (0, Html5Player_1.getPlayerFunctions)(options, options.html5Player), INFO = Object.assign({}, BASIC_INFO), FUNCTIONS = [], HTML5_PLAYER = await HTML5_PLAYER_PROMISE;
      await SIGNATURE.getDecipherFunctions(HTML5_PLAYER);
      await SIGNATURE.getNTransform(HTML5_PLAYER);
      try {
        const FORMATS = BASIC_INFO.formats;
        FUNCTIONS.push(SIGNATURE.decipherFormats(FORMATS));
        if (options.parsesHLSFormat && INFO._playerApiResponses?.ios) {
          FUNCTIONS.push(...Formats_1.FormatParser.parseAdditionalManifests(INFO._playerApiResponses.ios, options));
        }
      } catch {
      }
      const RESULTS = Object.values(Object.assign({}, ...await Promise.all(FUNCTIONS)));
      INFO.formats = RESULTS.map((format) => Format_1.FormatUtils.addFormatMeta(format, options.includesOriginalFormatData ?? false));
      INFO.formats.sort(Format_1.FormatUtils.sortFormats);
      INFO.full = true;
      if (!options.includesPlayerAPIResponse) {
        delete INFO._playerApiResponses;
      }
      if (!options.includesNextAPIResponse) {
        delete INFO._nextApiResponses;
      }
      return INFO;
    }
    __name(_getFullInfo, "_getFullInfo");
    async function getFullInfo(link, options) {
      General_1.default.checkForUpdates();
      const ID = Url_1.Url.getVideoID(link) || (Url_1.Url.validateID(link) ? link : null);
      if (!ID) {
        throw new Error("The URL specified is not a valid URL.");
      }
      const CACHE_KEY = ["getFullInfo", ID, options.hl, options.gl].join("-");
      if (await CACHE.has(CACHE_KEY)) {
        return CACHE.get(CACHE_KEY);
      }
      const RESULTS = await _getFullInfo(ID, options);
      CACHE.set(CACHE_KEY, RESULTS, {
        ttl: 60 * 30
        //30Min
      });
      return RESULTS;
    }
    __name(getFullInfo, "getFullInfo");
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/index.js
var require_Info = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Info/index.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_BasicInfo(), exports);
    __exportStar(require_FullInfo(), exports);
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Download/Download.js
var require_Download = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Download/Download.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.download = download;
    exports.downloadFromInfo = downloadFromInfo;
    var Info_1 = require_Info();
    var Format_1 = require_Format();
    var Log_1 = require_Log();
    var Platform_1 = require_Platform();
    var UserAgents_1 = require_UserAgents();
    var DOWNLOAD_REQUEST_OPTIONS = {
      method: "GET",
      headers: {
        accept: "*/*",
        origin: "https://www.youtube.com",
        referer: "https://www.youtube.com",
        DNT: "?1"
      },
      redirect: "follow"
    };
    var ReadableStream2 = Platform_1.Platform.getShim().polyfills.ReadableStream;
    function requestSetup(url, requestOptions, options) {
      if (typeof options.rewriteRequest === "function") {
        const { url: newUrl } = options.rewriteRequest(url, requestOptions, {
          isDownloadUrl: true
        });
        url = newUrl;
      }
      if (options.originalProxy) {
        try {
          const PARSED = new URL(options.originalProxy.download);
          if (!url.includes(PARSED.host)) {
            url = `${PARSED.protocol}//${PARSED.host}${PARSED.pathname}?${options.originalProxy.urlQueryName || "url"}=${encodeURIComponent(url)}`;
          }
        } catch (err) {
          Log_1.Logger.debug("[ OriginalProxy ]: The original proxy could not be adapted due to the following error: " + err);
        }
      }
      return url;
    }
    __name(requestSetup, "requestSetup");
    async function isDownloadUrlValid(format, options) {
      return new Promise((resolve) => {
        const successResponseHandler = /* @__PURE__ */ __name((res) => {
          if (res.status === 200) {
            Log_1.Logger.debug(`[ ${format.sourceClientName} ]: <success>Video URL is normal.</success> The response was received with status code <success>"${res.status}"</success>.`);
            resolve({ valid: true });
          } else {
            errorResponseHandler(new Error(`Status code: ${res.status}`));
          }
        }, "successResponseHandler"), errorResponseHandler = /* @__PURE__ */ __name((reason) => {
          Log_1.Logger.debug(`[ ${format.sourceClientName} ]: The URL for the video <error>did not return a successful response</error>. Got another format.
Reason: <error>${reason.message}</error>`);
          resolve({ valid: false, reason: reason.message });
        }, "errorResponseHandler");
        try {
          const TEST_URL = requestSetup(format.url, {}, options);
          Platform_1.Platform.getShim().fetcher(TEST_URL, {
            method: "HEAD"
          }).then((res) => successResponseHandler(res), (reason) => errorResponseHandler(reason));
        } catch (err) {
          errorResponseHandler(err);
        }
      });
    }
    __name(isDownloadUrlValid, "isDownloadUrlValid");
    function getValidDownloadUrl(formats, options) {
      return new Promise(async (resolve) => {
        let excludingClients = ["web"], format, isOk = false;
        try {
          format = Format_1.FormatUtils.chooseFormat(formats, options);
        } catch (e) {
          throw e;
        }
        if (!format) {
          throw new Error("Failed to retrieve format data.");
        }
        while (isOk === false) {
          if (!format) {
            throw new Error("Failed to retrieve format data.");
          }
          const { valid, reason } = await isDownloadUrlValid(format, options);
          if (valid) {
            isOk = true;
          } else {
            if (format.sourceClientName !== "unknown") {
              excludingClients.push(format.sourceClientName);
            }
            try {
              format = Format_1.FormatUtils.chooseFormat(formats, {
                excludingClients,
                includingClients: reason?.includes("403") ? ["ios", "android"] : "all",
                quality: options.quality,
                filter: options.filter
              });
            } catch (e) {
              throw e;
            }
          }
        }
        resolve(format);
      });
    }
    __name(getValidDownloadUrl, "getValidDownloadUrl");
    async function* streamToIterable(stream) {
      if (stream instanceof ReadableStream2) {
        const READER = stream.getReader();
        try {
          while (true) {
            const { done, value } = await READER.read();
            if (done) {
              return;
            }
            yield value;
          }
        } finally {
          READER.releaseLock();
        }
      } else {
        try {
          for await (const CHUNK of stream) {
            yield CHUNK;
          }
        } finally {
          stream.destroy();
        }
      }
    }
    __name(streamToIterable, "streamToIterable");
    function downloadVideo(videoUrl, requestOptions, options, cancel) {
      videoUrl = requestSetup(videoUrl, requestOptions, options);
      Log_1.Logger.debug("[ Download ]: Requesting URL: <magenta>" + videoUrl + "</magenta>");
      const OPTIONS = cancel ? { ...requestOptions, signal: cancel.signal } : requestOptions;
      return Platform_1.Platform.getShim().fetcher(videoUrl, OPTIONS);
    }
    __name(downloadVideo, "downloadVideo");
    async function downloadFromInfoCallback(info3, options) {
      if (!info3.formats.length) {
        throw new Error("This video is not available due to lack of video format.");
      }
      const DL_CHUNK_SIZE = typeof options.dlChunkSize === "number" ? options.dlChunkSize : 1024 * 1024 * 10, NO_NEED_SPECIFY_RANGE = (options.filter === "audioandvideo" || options.filter === "videoandaudio") && !options.range, FORMAT = await getValidDownloadUrl(info3.formats, options);
      let requestOptions = { ...DOWNLOAD_REQUEST_OPTIONS }, chunkStart = options.range ? options.range.start : 0, chunkEnd = options.range ? options.range.end || DL_CHUNK_SIZE : DL_CHUNK_SIZE, shouldEnd = false, cancel;
      const AGENT_TYPE = FORMAT.sourceClientName === "ios" || FORMAT.sourceClientName === "android" ? FORMAT.sourceClientName : FORMAT.sourceClientName.includes("tv") ? "tv" : "desktop";
      requestOptions.headers = {
        ...requestOptions.headers,
        "User-Agent": UserAgents_1.UserAgent.getRandomUserAgent(AGENT_TYPE)
      };
      if (NO_NEED_SPECIFY_RANGE) {
        const RESPONSE = await downloadVideo(FORMAT.url, requestOptions, options);
        if (!RESPONSE.ok) {
          throw new Error(`Download failed with status code <warning>"${RESPONSE.status}"</warning>.`);
        }
        const BODY = RESPONSE.body;
        if (!BODY) {
          throw new Error("Failed to retrieve response body.");
        }
        return BODY;
      }
      const READABLE_STREAM = new ReadableStream2({
        start() {
        },
        pull: async (controller) => {
          if (shouldEnd) {
            controller.close();
            return;
          }
          const CONTENT_LENGTH = FORMAT.contentLength ? parseInt(FORMAT.contentLength) : 0;
          if (chunkEnd >= CONTENT_LENGTH || options.range) {
            shouldEnd = true;
          }
          return new Promise(async (resolve, reject) => {
            try {
              cancel = new AbortController();
              const RESPONSE = await downloadVideo(FORMAT.url + "&range=" + chunkStart + "-" + chunkEnd, requestOptions, options, cancel);
              if (!RESPONSE.ok) {
                throw new Error(`Download failed with status code <warning>"${RESPONSE.status}"</warning>.`);
              }
              const BODY = RESPONSE.body;
              if (!BODY) {
                throw new Error("Failed to retrieve response body.");
              }
              for await (const CHUNK of streamToIterable(BODY)) {
                controller.enqueue(CHUNK);
              }
              chunkStart = chunkEnd + 1;
              chunkEnd += DL_CHUNK_SIZE;
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        },
        async cancel(reason) {
          cancel.abort(reason);
        }
      }, {
        highWaterMark: options.highWaterMark || 1024 * 512,
        size(chunk) {
          return chunk?.byteLength || 0;
        }
      });
      return READABLE_STREAM;
    }
    __name(downloadFromInfoCallback, "downloadFromInfoCallback");
    async function downloadFromInfo(info3, options) {
      if (!info3.full) {
        throw new Error("Cannot use `ytdl.downloadFromInfo()` when called with info from `ytdl.getBasicInfo()`");
      }
      return new Promise((resolve) => {
        resolve(downloadFromInfoCallback(info3, options));
      });
    }
    __name(downloadFromInfo, "downloadFromInfo");
    function download(link, options) {
      return new Promise((resolve) => {
        (0, Info_1.getFullInfo)(link, options).then((info3) => {
          resolve(downloadFromInfoCallback(info3, options));
        }).catch((err) => {
          throw err;
        });
      });
    }
    __name(download, "download");
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Download/index.js
var require_Download2 = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/core/Download/index.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_Download(), exports);
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/YtdlCore.js
var require_YtdlCore = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/YtdlCore.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.YtdlCore = void 0;
    var Platform_1 = require_Platform();
    var Download_1 = require_Download2();
    var Info_1 = require_Info();
    var Html5Player_1 = require_Html5Player2();
    var OAuth2_1 = require_OAuth2();
    var Url_1 = require_Url();
    var Format_1 = require_Format();
    var Constants_1 = require_Constants();
    var Log_1 = require_Log();
    var Signature_1 = require_Signature();
    var SHIM = Platform_1.Platform.getShim();
    var Cache = SHIM.cache;
    var FileCache = SHIM.fileCache;
    var YtdlCore = class {
      /* Constructor */
      constructor({ hl, gl, rewriteRequest, poToken, disablePoTokenAutoGeneration, visitorData, includesPlayerAPIResponse, includesNextAPIResponse, includesOriginalFormatData, includesRelatedVideo, clients, disableDefaultClients, disableRetryRequest, oauth2Credentials, parsesHLSFormat, originalProxy, quality, filter, excludingClients, includingClients, range, begin, liveBuffer, highWaterMark, IPv6Block, dlChunkSize, html5Player, disableBasicCache, disableFileCache, fetcher, logDisplay, noUpdate, disableInitialSetup } = {}) {
        this.hl = "en";
        this.gl = "US";
        this.disablePoTokenAutoGeneration = false;
        this.includesPlayerAPIResponse = false;
        this.includesNextAPIResponse = false;
        this.includesOriginalFormatData = false;
        this.includesRelatedVideo = true;
        this.disableDefaultClients = false;
        this.disableRetryRequest = false;
        this.oauth2 = null;
        this.parsesHLSFormat = false;
        this.excludingClients = [];
        this.includingClients = "all";
        this.version = Constants_1.VERSION;
        const SHIM2 = Platform_1.Platform.getShim();
        const LOG_DISPLAY = (logDisplay === "none" ? [] : logDisplay) || ["info", "success", "warning", "error"];
        SHIM2.options.other.logDisplay = LOG_DISPLAY;
        Log_1.Logger.logDisplay = LOG_DISPLAY;
        SHIM2.options.other.noUpdate = noUpdate ?? false;
        if (fetcher) {
          SHIM2.fetcher = fetcher;
          SHIM2.requestRelated.originalProxy = originalProxy;
          SHIM2.requestRelated.rewriteRequest = rewriteRequest;
        }
        if (disableBasicCache) {
          Cache.disable();
        }
        if (disableFileCache) {
          FileCache.disable();
        }
        this.hl = hl || "en";
        this.gl = gl || "US";
        this.rewriteRequest = rewriteRequest || void 0;
        this.disablePoTokenAutoGeneration = disablePoTokenAutoGeneration ?? false;
        this.includesPlayerAPIResponse = includesPlayerAPIResponse ?? false;
        this.includesNextAPIResponse = includesNextAPIResponse ?? false;
        this.includesOriginalFormatData = includesOriginalFormatData ?? false;
        this.includesRelatedVideo = includesRelatedVideo ?? true;
        this.clients = clients || void 0;
        this.disableDefaultClients = disableDefaultClients ?? false;
        this.parsesHLSFormat = parsesHLSFormat ?? false;
        this.disableRetryRequest = disableRetryRequest ?? false;
        this.originalProxy = originalProxy || void 0;
        if (this.originalProxy) {
          const QUERY_NAME = this.originalProxy.urlQueryName || "url";
          Log_1.Logger.debug(`<debug>"${this.originalProxy.base}"</debug> is used for <blue>API requests</blue>.`);
          Log_1.Logger.debug(`<debug>"${this.originalProxy.download}"</debug> is used for <blue>video downloads</blue>.`);
          Log_1.Logger.debug(`The query name <debug>"${QUERY_NAME}"</debug> is used to specify the URL in the request. <blue>(?${QUERY_NAME}=...)</blue>`);
        }
        this.quality = quality || void 0;
        this.filter = filter || void 0;
        this.excludingClients = excludingClients || [];
        this.includingClients = includingClients || "all";
        this.range = range || void 0;
        this.begin = begin || void 0;
        this.liveBuffer = liveBuffer || void 0;
        this.highWaterMark = highWaterMark || void 0;
        this.IPv6Block = IPv6Block || void 0;
        this.dlChunkSize = dlChunkSize || void 0;
        this.html5Player = html5Player || void 0;
        this.init({ disableInitialSetup, poToken, visitorData, oauth2Credentials, html5Player }, {
          originalProxy,
          rewriteRequest
        });
        SHIM2.options.download = {
          hl: this.hl,
          gl: this.gl,
          rewriteRequest: this.rewriteRequest,
          poToken: this.poToken,
          disablePoTokenAutoGeneration: this.disablePoTokenAutoGeneration,
          visitorData: this.visitorData,
          includesPlayerAPIResponse: this.includesPlayerAPIResponse,
          includesNextAPIResponse: this.includesNextAPIResponse,
          includesOriginalFormatData: this.includesOriginalFormatData,
          includesRelatedVideo: this.includesRelatedVideo,
          clients: this.clients,
          disableDefaultClients: this.disableDefaultClients,
          oauth2Credentials,
          parsesHLSFormat: this.parsesHLSFormat,
          originalProxy: this.originalProxy,
          quality: this.quality,
          filter: this.filter,
          excludingClients: this.excludingClients,
          includingClients: this.includingClients,
          range: this.range,
          begin: this.begin,
          liveBuffer: this.liveBuffer,
          highWaterMark: this.highWaterMark,
          IPv6Block: this.IPv6Block,
          dlChunkSize: this.dlChunkSize,
          html5Player: this.html5Player,
          disableRetryRequest: this.disableRetryRequest
        };
        Platform_1.Platform.load(SHIM2);
      }
      /* Setup */
      async init({ disableInitialSetup, poToken, visitorData, oauth2Credentials, html5Player }, requestInit = {}) {
        if (!disableInitialSetup) {
          const HTML5_PLAYER_PROMISE = (0, Html5Player_1.getPlayerFunctions)(requestInit, html5Player);
          await this.setPoToken(poToken);
          await this.setVisitorData(visitorData);
          await this.setOAuth2(oauth2Credentials || null);
          if (!this.disablePoTokenAutoGeneration) {
            this.automaticallyGeneratePoToken(requestInit);
          }
          await HTML5_PLAYER_PROMISE;
        }
      }
      async setPoToken(poToken) {
        const PO_TOKEN_CACHE = await FileCache.get("poToken");
        if (poToken) {
          this.poToken = poToken;
        } else if (PO_TOKEN_CACHE) {
          Log_1.Logger.debug("PoToken loaded from cache.");
          this.poToken = PO_TOKEN_CACHE || void 0;
        }
        FileCache.set("poToken", this.poToken || "", { ttl: 60 * 60 * 24 });
      }
      async setVisitorData(visitorData) {
        const VISITOR_DATA_CACHE = await FileCache.get("visitorData");
        if (visitorData) {
          this.visitorData = visitorData;
        } else if (VISITOR_DATA_CACHE) {
          Log_1.Logger.debug("VisitorData loaded from cache.");
          this.visitorData = VISITOR_DATA_CACHE || void 0;
        }
        FileCache.set("visitorData", this.visitorData || "", { ttl: 60 * 60 * 24 });
      }
      async setOAuth2(oauth2Credentials) {
        const OAUTH2_CACHE = await FileCache.get("oauth2") || void 0;
        try {
          if (oauth2Credentials) {
            this.oauth2 = new OAuth2_1.OAuth2(oauth2Credentials) || void 0;
          } else if (OAUTH2_CACHE) {
            this.oauth2 = new OAuth2_1.OAuth2(OAUTH2_CACHE);
          } else {
            this.oauth2 = null;
          }
        } catch {
          this.oauth2 = null;
        }
      }
      automaticallyGeneratePoToken(requestInit) {
        if (!this.poToken && !this.visitorData) {
          Log_1.Logger.debug("Since PoToken and VisitorData are <warning>not specified</warning>, they are generated <info>automatically</info>.");
          this.generatePoToken(requestInit).then(({ poToken, visitorData }) => {
            this.poToken = poToken;
            this.visitorData = visitorData;
            FileCache.set("poToken", this.poToken || "", { ttl: 60 * 60 * 24 });
            FileCache.set("visitorData", this.visitorData || "", { ttl: 60 * 60 * 24 });
          }).catch(() => {
          });
        }
      }
      initializeOptions(options) {
        const INTERNAL_OPTIONS = { ...options, oauth2: this.oauth2 };
        INTERNAL_OPTIONS.hl = options.hl || this.hl;
        INTERNAL_OPTIONS.gl = options.gl || this.gl;
        INTERNAL_OPTIONS.rewriteRequest = options.rewriteRequest || this.rewriteRequest;
        INTERNAL_OPTIONS.poToken = options.poToken || this.poToken;
        INTERNAL_OPTIONS.disablePoTokenAutoGeneration = options.disablePoTokenAutoGeneration || this.disablePoTokenAutoGeneration;
        INTERNAL_OPTIONS.visitorData = options.visitorData || this.visitorData;
        INTERNAL_OPTIONS.includesPlayerAPIResponse = options.includesPlayerAPIResponse || this.includesPlayerAPIResponse;
        INTERNAL_OPTIONS.includesNextAPIResponse = options.includesNextAPIResponse || this.includesNextAPIResponse;
        INTERNAL_OPTIONS.includesOriginalFormatData = options.includesOriginalFormatData || this.includesOriginalFormatData;
        INTERNAL_OPTIONS.includesRelatedVideo = options.includesRelatedVideo || this.includesRelatedVideo;
        INTERNAL_OPTIONS.clients = options.clients || this.clients;
        INTERNAL_OPTIONS.disableDefaultClients = options.disableDefaultClients || this.disableDefaultClients;
        INTERNAL_OPTIONS.disableRetryRequest = options.disableRetryRequest || this.disableRetryRequest;
        INTERNAL_OPTIONS.oauth2Credentials = options.oauth2Credentials || this.oauth2?.getCredentials();
        INTERNAL_OPTIONS.parsesHLSFormat = options.parsesHLSFormat || this.parsesHLSFormat;
        INTERNAL_OPTIONS.originalProxy = options.originalProxy || this.originalProxy || void 0;
        INTERNAL_OPTIONS.quality = options.quality || this.quality || void 0;
        INTERNAL_OPTIONS.filter = options.filter || this.filter || void 0;
        INTERNAL_OPTIONS.excludingClients = options.excludingClients || this.excludingClients || [];
        INTERNAL_OPTIONS.includingClients = options.includingClients || this.includingClients || "all";
        INTERNAL_OPTIONS.range = options.range || this.range || void 0;
        INTERNAL_OPTIONS.begin = options.begin || this.begin || void 0;
        INTERNAL_OPTIONS.liveBuffer = options.liveBuffer || this.liveBuffer || void 0;
        INTERNAL_OPTIONS.highWaterMark = options.highWaterMark || this.highWaterMark || void 0;
        INTERNAL_OPTIONS.IPv6Block = options.IPv6Block || this.IPv6Block || void 0;
        INTERNAL_OPTIONS.dlChunkSize = options.dlChunkSize || this.dlChunkSize || void 0;
        INTERNAL_OPTIONS.html5Player = options.html5Player || this.html5Player || void 0;
        if (!INTERNAL_OPTIONS.oauth2 && options.oauth2Credentials) {
          INTERNAL_OPTIONS.oauth2 = new OAuth2_1.OAuth2(options.oauth2Credentials);
        }
        return INTERNAL_OPTIONS;
      }
      generatePoToken(requestInit = {}) {
        return new Promise((resolve, reject) => {
          const generatePoToken = Platform_1.Platform.getShim().poToken;
          generatePoToken(requestInit).then((data) => {
            resolve(data);
          }).catch((err) => {
            reject(err);
          });
        });
      }
      /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
      download(link, options = {}) {
        return (0, Download_1.download)(link, this.initializeOptions(options));
      }
      /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
      downloadFromInfo(info3, options = {}) {
        return (0, Download_1.downloadFromInfo)(info3, this.initializeOptions(options));
      }
      /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
      getBasicInfo(link, options = {}) {
        return (0, Info_1.getBasicInfo)(link, this.initializeOptions(options));
      }
      /** TIP: The options specified in new YtdlCore() are applied by default. (The function arguments specified will take precedence.) */
      getFullInfo(link, options = {}) {
        return (0, Info_1.getFullInfo)(link, this.initializeOptions(options));
      }
    };
    __name(YtdlCore, "YtdlCore");
    exports.YtdlCore = YtdlCore;
    YtdlCore.chooseFormat = Format_1.FormatUtils.chooseFormat;
    YtdlCore.filterFormats = Format_1.FormatUtils.filterFormats;
    YtdlCore.decipherFormats = function(formats, html5Player) {
      return new Promise(async (resolve) => {
        const HTML5_PLAYER_DATA = await (0, Html5Player_1.getPlayerFunctions)({}, html5Player), SIGNATURE = new Signature_1.Signature();
        await SIGNATURE.getDecipherFunctions(HTML5_PLAYER_DATA);
        await SIGNATURE.getNTransform(HTML5_PLAYER_DATA);
        const DECIPHERED_FORMATS = formats.map((format) => SIGNATURE.decipherFormat(format));
        resolve(DECIPHERED_FORMATS);
      });
    };
    YtdlCore.toVideoFormats = function(formats, includesOriginalFormatData = false) {
      const FORMATS = formats.map((format) => Format_1.FormatUtils.addFormatMeta(format, includesOriginalFormatData));
      FORMATS.sort(Format_1.FormatUtils.sortFormats);
      return FORMATS;
    };
    YtdlCore.createOAuth2Credentials = OAuth2_1.OAuth2.createOAuth2Credentials;
    YtdlCore.validateID = Url_1.Url.validateID;
    YtdlCore.validateURL = Url_1.Url.validateURL;
    YtdlCore.getURLVideoID = Url_1.Url.getURLVideoID;
    YtdlCore.getVideoID = Url_1.Url.getVideoID;
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Renderers.js
var require_Renderers = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Renderers.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Misc.js
var require_Misc = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Misc.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Player.js
var require_Player2 = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Player.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Next.js
var require_Next2 = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Next.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Formats.js
var require_Formats2 = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/Formats.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/index.js
var require_YouTube = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/YouTube/index.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_Renderers(), exports);
    __exportStar(require_Misc(), exports);
    __exportStar(require_Player2(), exports);
    __exportStar(require_Next2(), exports);
    __exportStar(require_Formats2(), exports);
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/Clients.js
var require_Clients2 = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/Clients.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/FileCache.js
var require_FileCache = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/FileCache.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/Language.js
var require_Language = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/Language.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/Options.js
var require_Options = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/Options.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/Ytdl.js
var require_Ytdl = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/Ytdl.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/index.js
var require_types = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/types/index.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_YouTube(), exports);
    __exportStar(require_Clients2(), exports);
    __exportStar(require_FileCache(), exports);
    __exportStar(require_Language(), exports);
    __exportStar(require_Options(), exports);
    __exportStar(require_Ytdl(), exports);
  }
});

// ../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/platforms/Browser/Browser.js
var require_Browser = __commonJS({
  "../../node_modules/.pnpm/@ybd-project+ytdl-core@6.0.8/node_modules/@ybd-project/ytdl-core/package/platforms/Browser/Browser.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.YtdlCore = void 0;
    var Platform_1 = require_Platform();
    var Constants_1 = require_Constants();
    var CacheWithCacheStorage = class {
      constructor(ttl = 60) {
        this.ttl = ttl;
        this.isDisabled = false;
      }
      async getCache() {
        return await caches.open("ytdlCoreCache");
      }
      async get(key) {
        if (this.isDisabled) {
          return null;
        }
        const CACHE = await this.getCache(), RESPONSE = await CACHE.match(key);
        if (RESPONSE) {
          try {
            const DATA = await RESPONSE.json();
            if (Date.now() > DATA.expiration) {
              return null;
            }
            return DATA.contents;
          } catch {
          }
        }
        return null;
      }
      async set(key, value, { ttl } = { ttl: this.ttl }) {
        if (this.isDisabled) {
          return true;
        }
        const CACHE = await this.getCache(), DATA = JSON.stringify({
          contents: value,
          expiration: Date.now() + ttl * 1e3
        }), RESPONSE = new Response(DATA, {
          headers: { "Content-Type": "application/json" }
        });
        try {
          await CACHE.put(key, RESPONSE);
          return true;
        } catch {
          return false;
        }
      }
      async has(key) {
        if (this.isDisabled) {
          return false;
        }
        const CACHE = await this.getCache(), RESPONSE = await CACHE.match(key);
        return RESPONSE !== void 0;
      }
      async delete(key) {
        if (this.isDisabled) {
          return true;
        }
        const CACHE = await this.getCache();
        try {
          return await CACHE.delete(key);
        } catch {
          return false;
        }
      }
      disable() {
        this.isDisabled = true;
      }
      initialization() {
      }
    };
    __name(CacheWithCacheStorage, "CacheWithCacheStorage");
    Platform_1.Platform.load({
      runtime: "browser",
      server: false,
      cache: new CacheWithCacheStorage(),
      fileCache: new CacheWithCacheStorage(),
      fetcher: (url, options) => fetch(url, options),
      poToken: async () => ({
        poToken: "",
        visitorData: ""
      }),
      options: {
        download: {
          hl: "en",
          gl: "US",
          includesPlayerAPIResponse: false,
          includesNextAPIResponse: false,
          includesOriginalFormatData: false,
          includesRelatedVideo: true,
          clients: ["web", "mweb", "tv", "ios"],
          disableDefaultClients: false,
          disableFileCache: false,
          parsesHLSFormat: true
        },
        other: {
          logDisplay: ["info", "success", "warning", "error"],
          noUpdate: false
        }
      },
      requestRelated: {
        rewriteRequest: (url, options) => {
          return { url, options };
        },
        originalProxy: null
      },
      info: {
        version: Constants_1.VERSION,
        repo: {
          user: Constants_1.USER_NAME,
          name: Constants_1.REPO_NAME
        },
        issuesUrl: Constants_1.ISSUES_URL
      },
      polyfills: {
        Headers,
        ReadableStream,
        eval
      }
    });
    var YtdlCore_1 = require_YtdlCore();
    Object.defineProperty(exports, "YtdlCore", { enumerable: true, get: function() {
      return YtdlCore_1.YtdlCore;
    } });
    __exportStar(require_types(), exports);
    exports.default = YtdlCore_1.YtdlCore;
  }
});

// .wrangler/tmp/bundle-t12Zmc/middleware-loader.entry.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-t12Zmc/middleware-insertion-facade.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/index.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var src_default = {
  async fetch(request, env2) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return Response.json(
        { status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() },
        { headers: corsHeaders }
      );
    }
    if (url.pathname === "/audio" && request.method === "POST") {
      try {
        const body = await request.json();
        const videoId = body.videoId;
        if (!videoId || typeof videoId !== "string") {
          return Response.json(
            { error: "Missing or invalid videoId" },
            { status: 400, headers: corsHeaders }
          );
        }
        if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return Response.json(
            { error: "Invalid video ID format" },
            { status: 400, headers: corsHeaders }
          );
        }
        const audioInfo = await getAudioInfo(videoId);
        return Response.json(audioInfo, { headers: corsHeaders });
      } catch (error3) {
        console.error("Audio extraction error:", error3);
        return Response.json(
          { error: "Failed to extract audio info" },
          { status: 500, headers: corsHeaders }
        );
      }
    }
    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
};
async function getAudioInfo(videoId) {
  try {
    const ytdl = await Promise.resolve().then(() => __toESM(require_Browser()));
    const info3 = await ytdl.getInfo(videoId);
    const audioFormats = ytdl.filterFormats(info3.formats, "audioonly");
    if (audioFormats.length === 0) {
      throw new Error("No audio-only formats found");
    }
    audioFormats.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));
    const bestFormat = audioFormats[0];
    if (!bestFormat.url) {
      throw new Error("Audio URL is missing in best format");
    }
    return {
      videoId,
      audioUrl: bestFormat.url,
      duration: parseInt(info3.videoDetails.lengthSeconds),
      format: bestFormat.mimeType?.split(";")[0] || "audio/mp4"
    };
  } catch (error3) {
    console.error("getAudioInfo error:", error3);
    return {
      videoId,
      audioUrl: "",
      duration: 0,
      format: "",
      error: error3 instanceof Error ? error3.message : "Unknown error"
    };
  }
}
__name(getAudioInfo, "getAudioInfo");

// ../../node_modules/.pnpm/wrangler@3.114.16_@cloudflare+workers-types@4.20260103.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/.pnpm/wrangler@3.114.16_@cloudflare+workers-types@4.20260103.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-t12Zmc/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/.pnpm/wrangler@3.114.16_@cloudflare+workers-types@4.20260103.0/node_modules/wrangler/templates/middleware/common.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-t12Zmc/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map

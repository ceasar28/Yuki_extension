/*!
 * Socket.IO v4.6.0
 * (c) 2014-2023 Guillermo Rauch
 * Released under the MIT License.
 */
const t = Object.create(null);
(t.open = "0"),
  (t.close = "1"),
  (t.ping = "2"),
  (t.pong = "3"),
  (t.message = "4"),
  (t.upgrade = "5"),
  (t.noop = "6");
const e = Object.create(null);
Object.keys(t).forEach((s) => {
  e[t[s]] = s;
});
const s = { type: "error", data: "parser error" },
  i =
    "function" == typeof Blob ||
    ("undefined" != typeof Blob &&
      "[object BlobConstructor]" === Object.prototype.toString.call(Blob)),
  n = "function" == typeof ArrayBuffer,
  r = ({ type: e, data: s }, r, h) => {
    return i && s instanceof Blob
      ? r
        ? h(s)
        : o(s, h)
      : n &&
        (s instanceof ArrayBuffer ||
          ((a = s),
          "function" == typeof ArrayBuffer.isView
            ? ArrayBuffer.isView(a)
            : a && a.buffer instanceof ArrayBuffer))
      ? r
        ? h(s)
        : o(new Blob([s]), h)
      : h(t[e] + (s || ""));
    var a;
  },
  o = (t, e) => {
    const s = new FileReader();
    return (
      (s.onload = function () {
        const t = s.result.split(",")[1];
        e("b" + t);
      }),
      s.readAsDataURL(t)
    );
  },
  h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  a = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256);
for (let t = 0; t < h.length; t++) a[h.charCodeAt(t)] = t;
const c = "function" == typeof ArrayBuffer,
  p = (t, i) => {
    if ("string" != typeof t) return { type: "message", data: l(t, i) };
    const n = t.charAt(0);
    if ("b" === n) return { type: "message", data: u(t.substring(1), i) };
    return e[n]
      ? t.length > 1
        ? { type: e[n], data: t.substring(1) }
        : { type: e[n] }
      : s;
  },
  u = (t, e) => {
    if (c) {
      const s = ((t) => {
        let e,
          s,
          i,
          n,
          r,
          o = 0.75 * t.length,
          h = t.length,
          c = 0;
        "=" === t[t.length - 1] && (o--, "=" === t[t.length - 2] && o--);
        const p = new ArrayBuffer(o),
          u = new Uint8Array(p);
        for (e = 0; e < h; e += 4)
          (s = a[t.charCodeAt(e)]),
            (i = a[t.charCodeAt(e + 1)]),
            (n = a[t.charCodeAt(e + 2)]),
            (r = a[t.charCodeAt(e + 3)]),
            (u[c++] = (s << 2) | (i >> 4)),
            (u[c++] = ((15 & i) << 4) | (n >> 2)),
            (u[c++] = ((3 & n) << 6) | (63 & r));
        return p;
      })(t);
      return l(s, e);
    }
    return { base64: !0, data: t };
  },
  l = (t, e) => ("blob" === e && t instanceof ArrayBuffer ? new Blob([t]) : t),
  d = String.fromCharCode(30);
function f(t) {
  if (t)
    return (function (t) {
      for (var e in f.prototype) t[e] = f.prototype[e];
      return t;
    })(t);
}
(f.prototype.on = f.prototype.addEventListener =
  function (t, e) {
    return (
      (this._callbacks = this._callbacks || {}),
      (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e),
      this
    );
  }),
  (f.prototype.once = function (t, e) {
    function s() {
      this.off(t, s), e.apply(this, arguments);
    }
    return (s.fn = e), this.on(t, s), this;
  }),
  (f.prototype.off =
    f.prototype.removeListener =
    f.prototype.removeAllListeners =
    f.prototype.removeEventListener =
      function (t, e) {
        if (((this._callbacks = this._callbacks || {}), 0 == arguments.length))
          return (this._callbacks = {}), this;
        var s,
          i = this._callbacks["$" + t];
        if (!i) return this;
        if (1 == arguments.length) return delete this._callbacks["$" + t], this;
        for (var n = 0; n < i.length; n++)
          if ((s = i[n]) === e || s.fn === e) {
            i.splice(n, 1);
            break;
          }
        return 0 === i.length && delete this._callbacks["$" + t], this;
      }),
  (f.prototype.emit = function (t) {
    this._callbacks = this._callbacks || {};
    for (
      var e = new Array(arguments.length - 1),
        s = this._callbacks["$" + t],
        i = 1;
      i < arguments.length;
      i++
    )
      e[i - 1] = arguments[i];
    if (s) {
      i = 0;
      for (var n = (s = s.slice(0)).length; i < n; ++i) s[i].apply(this, e);
    }
    return this;
  }),
  (f.prototype.emitReserved = f.prototype.emit),
  (f.prototype.listeners = function (t) {
    return (
      (this._callbacks = this._callbacks || {}), this._callbacks["$" + t] || []
    );
  }),
  (f.prototype.hasListeners = function (t) {
    return !!this.listeners(t).length;
  });
const y =
  "undefined" != typeof self
    ? self
    : "undefined" != typeof window
    ? window
    : Function("return this")();
function g(t, ...e) {
  return e.reduce((e, s) => (t.hasOwnProperty(s) && (e[s] = t[s]), e), {});
}
const m = y.setTimeout,
  b = y.clearTimeout;
function v(t, e) {
  e.useNativeTimers
    ? ((t.setTimeoutFn = m.bind(y)), (t.clearTimeoutFn = b.bind(y)))
    : ((t.setTimeoutFn = y.setTimeout.bind(y)),
      (t.clearTimeoutFn = y.clearTimeout.bind(y)));
}
class k extends Error {
  constructor(t, e, s) {
    super(t),
      (this.description = e),
      (this.context = s),
      (this.type = "TransportError");
  }
}
class w extends f {
  constructor(t) {
    super(),
      (this.writable = !1),
      v(this, t),
      (this.opts = t),
      (this.query = t.query),
      (this.socket = t.socket);
  }
  onError(t, e, s) {
    return super.emitReserved("error", new k(t, e, s)), this;
  }
  open() {
    return (this.readyState = "opening"), this.doOpen(), this;
  }
  close() {
    return (
      ("opening" !== this.readyState && "open" !== this.readyState) ||
        (this.doClose(), this.onClose()),
      this
    );
  }
  send(t) {
    "open" === this.readyState && this.write(t);
  }
  onOpen() {
    (this.readyState = "open"),
      (this.writable = !0),
      super.emitReserved("open");
  }
  onData(t) {
    const e = p(t, this.socket.binaryType);
    this.onPacket(e);
  }
  onPacket(t) {
    super.emitReserved("packet", t);
  }
  onClose(t) {
    (this.readyState = "closed"), super.emitReserved("close", t);
  }
  pause(t) {}
}
const _ =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(
      ""
    ),
  E = {};
let A,
  O = 0,
  R = 0;
function C(t) {
  let e = "";
  do {
    (e = _[t % 64] + e), (t = Math.floor(t / 64));
  } while (t > 0);
  return e;
}
function T() {
  const t = C(+new Date());
  return t !== A ? ((O = 0), (A = t)) : t + "." + C(O++);
}
for (; R < 64; R++) E[_[R]] = R;
function B(t) {
  let e = "";
  for (let s in t)
    t.hasOwnProperty(s) &&
      (e.length && (e += "&"),
      (e += encodeURIComponent(s) + "=" + encodeURIComponent(t[s])));
  return e;
}
let N = !1;
try {
  N =
    "undefined" != typeof XMLHttpRequest &&
    "withCredentials" in new XMLHttpRequest();
} catch (t) {}
const x = N;
function L(t) {
  const e = t.xdomain;
  try {
    if ("undefined" != typeof XMLHttpRequest && (!e || x))
      return new XMLHttpRequest();
  } catch (t) {}
  if (!e)
    try {
      return new y[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch (t) {}
}
function S() {}
const P = null != new L({ xdomain: !1 }).responseType;
class q extends f {
  constructor(t, e) {
    super(),
      v(this, e),
      (this.opts = e),
      (this.method = e.method || "GET"),
      (this.uri = t),
      (this.async = !1 !== e.async),
      (this.data = void 0 !== e.data ? e.data : null),
      this.create();
  }
  create() {
    const t = g(
      this.opts,
      "agent",
      "pfx",
      "key",
      "passphrase",
      "cert",
      "ca",
      "ciphers",
      "rejectUnauthorized",
      "autoUnref"
    );
    (t.xdomain = !!this.opts.xd), (t.xscheme = !!this.opts.xs);
    const e = (this.xhr = new L(t));
    try {
      e.open(this.method, this.uri, this.async);
      try {
        if (this.opts.extraHeaders) {
          e.setDisableHeaderCheck && e.setDisableHeaderCheck(!0);
          for (let t in this.opts.extraHeaders)
            this.opts.extraHeaders.hasOwnProperty(t) &&
              e.setRequestHeader(t, this.opts.extraHeaders[t]);
        }
      } catch (t) {}
      if ("POST" === this.method)
        try {
          e.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch (t) {}
      try {
        e.setRequestHeader("Accept", "*/*");
      } catch (t) {}
      "withCredentials" in e && (e.withCredentials = this.opts.withCredentials),
        this.opts.requestTimeout && (e.timeout = this.opts.requestTimeout),
        (e.onreadystatechange = () => {
          4 === e.readyState &&
            (200 === e.status || 1223 === e.status
              ? this.onLoad()
              : this.setTimeoutFn(() => {
                  this.onError("number" == typeof e.status ? e.status : 0);
                }, 0));
        }),
        e.send(this.data);
    } catch (t) {
      return void this.setTimeoutFn(() => {
        this.onError(t);
      }, 0);
    }
    "undefined" != typeof document &&
      ((this.index = q.requestsCount++), (q.requests[this.index] = this));
  }
  onError(t) {
    this.emitReserved("error", t, this.xhr), this.cleanup(!0);
  }
  cleanup(t) {
    if (void 0 !== this.xhr && null !== this.xhr) {
      if (((this.xhr.onreadystatechange = S), t))
        try {
          this.xhr.abort();
        } catch (t) {}
      "undefined" != typeof document && delete q.requests[this.index],
        (this.xhr = null);
    }
  }
  onLoad() {
    const t = this.xhr.responseText;
    null !== t &&
      (this.emitReserved("data", t),
      this.emitReserved("success"),
      this.cleanup());
  }
  abort() {
    this.cleanup();
  }
}
if (((q.requestsCount = 0), (q.requests = {}), "undefined" != typeof document))
  if ("function" == typeof attachEvent) attachEvent("onunload", j);
  else if ("function" == typeof addEventListener) {
    addEventListener("onpagehide" in y ? "pagehide" : "unload", j, !1);
  }
function j() {
  for (let t in q.requests)
    q.requests.hasOwnProperty(t) && q.requests[t].abort();
}
const I =
    "function" == typeof Promise && "function" == typeof Promise.resolve
      ? (t) => Promise.resolve().then(t)
      : (t, e) => e(t, 0),
  D = y.WebSocket || y.MozWebSocket,
  F =
    "undefined" != typeof navigator &&
    "string" == typeof navigator.product &&
    "reactnative" === navigator.product.toLowerCase();
const M = {
    websocket: class extends w {
      constructor(t) {
        super(t), (this.supportsBinary = !t.forceBase64);
      }
      get name() {
        return "websocket";
      }
      doOpen() {
        if (!this.check()) return;
        const t = this.uri(),
          e = this.opts.protocols,
          s = F
            ? {}
            : g(
                this.opts,
                "agent",
                "perMessageDeflate",
                "pfx",
                "key",
                "passphrase",
                "cert",
                "ca",
                "ciphers",
                "rejectUnauthorized",
                "localAddress",
                "protocolVersion",
                "origin",
                "maxPayload",
                "family",
                "checkServerIdentity"
              );
        this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
        try {
          this.ws = F ? new D(t, e, s) : e ? new D(t, e) : new D(t);
        } catch (t) {
          return this.emitReserved("error", t);
        }
        (this.ws.binaryType = this.socket.binaryType || "arraybuffer"),
          this.addEventListeners();
      }
      addEventListeners() {
        (this.ws.onopen = () => {
          this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
        }),
          (this.ws.onclose = (t) =>
            this.onClose({
              description: "websocket connection closed",
              context: t,
            })),
          (this.ws.onmessage = (t) => this.onData(t.data)),
          (this.ws.onerror = (t) => this.onError("websocket error", t));
      }
      write(t) {
        this.writable = !1;
        for (let e = 0; e < t.length; e++) {
          const s = t[e],
            i = e === t.length - 1;
          r(s, this.supportsBinary, (t) => {
            try {
              this.ws.send(t);
            } catch (t) {}
            i &&
              I(() => {
                (this.writable = !0), this.emitReserved("drain");
              }, this.setTimeoutFn);
          });
        }
      }
      doClose() {
        void 0 !== this.ws && (this.ws.close(), (this.ws = null));
      }
      uri() {
        let t = this.query || {};
        const e = this.opts.secure ? "wss" : "ws";
        let s = "";
        this.opts.port &&
          (("wss" === e && 443 !== Number(this.opts.port)) ||
            ("ws" === e && 80 !== Number(this.opts.port))) &&
          (s = ":" + this.opts.port),
          this.opts.timestampRequests && (t[this.opts.timestampParam] = T()),
          this.supportsBinary || (t.b64 = 1);
        const i = B(t);
        return (
          e +
          "://" +
          (-1 !== this.opts.hostname.indexOf(":")
            ? "[" + this.opts.hostname + "]"
            : this.opts.hostname) +
          s +
          this.opts.path +
          (i.length ? "?" + i : "")
        );
      }
      check() {
        return !!D;
      }
    },
    polling: class extends w {
      constructor(t) {
        if ((super(t), (this.polling = !1), "undefined" != typeof location)) {
          const e = "https:" === location.protocol;
          let s = location.port;
          s || (s = e ? "443" : "80"),
            (this.xd =
              ("undefined" != typeof location &&
                t.hostname !== location.hostname) ||
              s !== t.port),
            (this.xs = t.secure !== e);
        }
        const e = t && t.forceBase64;
        this.supportsBinary = P && !e;
      }
      get name() {
        return "polling";
      }
      doOpen() {
        this.poll();
      }
      pause(t) {
        this.readyState = "pausing";
        const e = () => {
          (this.readyState = "paused"), t();
        };
        if (this.polling || !this.writable) {
          let t = 0;
          this.polling &&
            (t++,
            this.once("pollComplete", function () {
              --t || e();
            })),
            this.writable ||
              (t++,
              this.once("drain", function () {
                --t || e();
              }));
        } else e();
      }
      poll() {
        (this.polling = !0), this.doPoll(), this.emitReserved("poll");
      }
      onData(t) {
        ((t, e) => {
          const s = t.split(d),
            i = [];
          for (let t = 0; t < s.length; t++) {
            const n = p(s[t], e);
            if ((i.push(n), "error" === n.type)) break;
          }
          return i;
        })(t, this.socket.binaryType).forEach((t) => {
          if (
            ("opening" === this.readyState &&
              "open" === t.type &&
              this.onOpen(),
            "close" === t.type)
          )
            return (
              this.onClose({ description: "transport closed by the server" }),
              !1
            );
          this.onPacket(t);
        }),
          "closed" !== this.readyState &&
            ((this.polling = !1),
            this.emitReserved("pollComplete"),
            "open" === this.readyState && this.poll());
      }
      doClose() {
        const t = () => {
          this.write([{ type: "close" }]);
        };
        "open" === this.readyState ? t() : this.once("open", t);
      }
      write(t) {
        (this.writable = !1),
          ((t, e) => {
            const s = t.length,
              i = new Array(s);
            let n = 0;
            t.forEach((t, o) => {
              r(t, !1, (t) => {
                (i[o] = t), ++n === s && e(i.join(d));
              });
            });
          })(t, (t) => {
            this.doWrite(t, () => {
              (this.writable = !0), this.emitReserved("drain");
            });
          });
      }
      uri() {
        let t = this.query || {};
        const e = this.opts.secure ? "https" : "http";
        let s = "";
        !1 !== this.opts.timestampRequests &&
          (t[this.opts.timestampParam] = T()),
          this.supportsBinary || t.sid || (t.b64 = 1),
          this.opts.port &&
            (("https" === e && 443 !== Number(this.opts.port)) ||
              ("http" === e && 80 !== Number(this.opts.port))) &&
            (s = ":" + this.opts.port);
        const i = B(t);
        return (
          e +
          "://" +
          (-1 !== this.opts.hostname.indexOf(":")
            ? "[" + this.opts.hostname + "]"
            : this.opts.hostname) +
          s +
          this.opts.path +
          (i.length ? "?" + i : "")
        );
      }
      request(t = {}) {
        return (
          Object.assign(t, { xd: this.xd, xs: this.xs }, this.opts),
          new q(this.uri(), t)
        );
      }
      doWrite(t, e) {
        const s = this.request({ method: "POST", data: t });
        s.on("success", e),
          s.on("error", (t, e) => {
            this.onError("xhr post error", t, e);
          });
      }
      doPoll() {
        const t = this.request();
        t.on("data", this.onData.bind(this)),
          t.on("error", (t, e) => {
            this.onError("xhr poll error", t, e);
          }),
          (this.pollXhr = t);
      }
    },
  },
  V =
    /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
  U = [
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
    "anchor",
  ];
function H(t) {
  const e = t,
    s = t.indexOf("["),
    i = t.indexOf("]");
  -1 != s &&
    -1 != i &&
    (t =
      t.substring(0, s) +
      t.substring(s, i).replace(/:/g, ";") +
      t.substring(i, t.length));
  let n = V.exec(t || ""),
    r = {},
    o = 14;
  for (; o--; ) r[U[o]] = n[o] || "";
  return (
    -1 != s &&
      -1 != i &&
      ((r.source = e),
      (r.host = r.host.substring(1, r.host.length - 1).replace(/;/g, ":")),
      (r.authority = r.authority
        .replace("[", "")
        .replace("]", "")
        .replace(/;/g, ":")),
      (r.ipv6uri = !0)),
    (r.pathNames = (function (t, e) {
      const s = /\/{2,9}/g,
        i = e.replace(s, "/").split("/");
      ("/" != e.slice(0, 1) && 0 !== e.length) || i.splice(0, 1);
      "/" == e.slice(-1) && i.splice(i.length - 1, 1);
      return i;
    })(0, r.path)),
    (r.queryKey = (function (t, e) {
      const s = {};
      return (
        e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (t, e, i) {
          e && (s[e] = i);
        }),
        s
      );
    })(0, r.query)),
    r
  );
}
class K extends f {
  constructor(t, e = {}) {
    super(),
      (this.writeBuffer = []),
      t && "object" == typeof t && ((e = t), (t = null)),
      t
        ? ((t = H(t)),
          (e.hostname = t.host),
          (e.secure = "https" === t.protocol || "wss" === t.protocol),
          (e.port = t.port),
          t.query && (e.query = t.query))
        : e.host && (e.hostname = H(e.host).host),
      v(this, e),
      (this.secure =
        null != e.secure
          ? e.secure
          : "undefined" != typeof location && "https:" === location.protocol),
      e.hostname && !e.port && (e.port = this.secure ? "443" : "80"),
      (this.hostname =
        e.hostname ||
        ("undefined" != typeof location ? location.hostname : "localhost")),
      (this.port =
        e.port ||
        ("undefined" != typeof location && location.port
          ? location.port
          : this.secure
          ? "443"
          : "80")),
      (this.transports = e.transports || ["polling", "websocket"]),
      (this.writeBuffer = []),
      (this.prevBufferLen = 0),
      (this.opts = Object.assign(
        {
          path: "/engine.io",
          agent: !1,
          withCredentials: !1,
          upgrade: !0,
          timestampParam: "t",
          rememberUpgrade: !1,
          addTrailingSlash: !0,
          rejectUnauthorized: !0,
          perMessageDeflate: { threshold: 1024 },
          transportOptions: {},
          closeOnBeforeunload: !0,
        },
        e
      )),
      (this.opts.path =
        this.opts.path.replace(/\/$/, "") +
        (this.opts.addTrailingSlash ? "/" : "")),
      "string" == typeof this.opts.query &&
        (this.opts.query = (function (t) {
          let e = {},
            s = t.split("&");
          for (let t = 0, i = s.length; t < i; t++) {
            let i = s[t].split("=");
            e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
          }
          return e;
        })(this.opts.query)),
      (this.id = null),
      (this.upgrades = null),
      (this.pingInterval = null),
      (this.pingTimeout = null),
      (this.pingTimeoutTimer = null),
      "function" == typeof addEventListener &&
        (this.opts.closeOnBeforeunload &&
          ((this.beforeunloadEventListener = () => {
            this.transport &&
              (this.transport.removeAllListeners(), this.transport.close());
          }),
          addEventListener("beforeunload", this.beforeunloadEventListener, !1)),
        "localhost" !== this.hostname &&
          ((this.offlineEventListener = () => {
            this.onClose("transport close", {
              description: "network connection lost",
            });
          }),
          addEventListener("offline", this.offlineEventListener, !1))),
      this.open();
  }
  createTransport(t) {
    const e = Object.assign({}, this.opts.query);
    (e.EIO = 4), (e.transport = t), this.id && (e.sid = this.id);
    const s = Object.assign({}, this.opts.transportOptions[t], this.opts, {
      query: e,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port,
    });
    return new M[t](s);
  }
  open() {
    let t;
    if (
      this.opts.rememberUpgrade &&
      K.priorWebsocketSuccess &&
      -1 !== this.transports.indexOf("websocket")
    )
      t = "websocket";
    else {
      if (0 === this.transports.length)
        return void this.setTimeoutFn(() => {
          this.emitReserved("error", "No transports available");
        }, 0);
      t = this.transports[0];
    }
    this.readyState = "opening";
    try {
      t = this.createTransport(t);
    } catch (t) {
      return this.transports.shift(), void this.open();
    }
    t.open(), this.setTransport(t);
  }
  setTransport(t) {
    this.transport && this.transport.removeAllListeners(),
      (this.transport = t),
      t
        .on("drain", this.onDrain.bind(this))
        .on("packet", this.onPacket.bind(this))
        .on("error", this.onError.bind(this))
        .on("close", (t) => this.onClose("transport close", t));
  }
  probe(t) {
    let e = this.createTransport(t),
      s = !1;
    K.priorWebsocketSuccess = !1;
    const i = () => {
      s ||
        (e.send([{ type: "ping", data: "probe" }]),
        e.once("packet", (t) => {
          if (!s)
            if ("pong" === t.type && "probe" === t.data) {
              if (
                ((this.upgrading = !0), this.emitReserved("upgrading", e), !e)
              )
                return;
              (K.priorWebsocketSuccess = "websocket" === e.name),
                this.transport.pause(() => {
                  s ||
                    ("closed" !== this.readyState &&
                      (c(),
                      this.setTransport(e),
                      e.send([{ type: "upgrade" }]),
                      this.emitReserved("upgrade", e),
                      (e = null),
                      (this.upgrading = !1),
                      this.flush()));
                });
            } else {
              const t = new Error("probe error");
              (t.transport = e.name), this.emitReserved("upgradeError", t);
            }
        }));
    };
    function n() {
      s || ((s = !0), c(), e.close(), (e = null));
    }
    const r = (t) => {
      const s = new Error("probe error: " + t);
      (s.transport = e.name), n(), this.emitReserved("upgradeError", s);
    };
    function o() {
      r("transport closed");
    }
    function h() {
      r("socket closed");
    }
    function a(t) {
      e && t.name !== e.name && n();
    }
    const c = () => {
      e.removeListener("open", i),
        e.removeListener("error", r),
        e.removeListener("close", o),
        this.off("close", h),
        this.off("upgrading", a);
    };
    e.once("open", i),
      e.once("error", r),
      e.once("close", o),
      this.once("close", h),
      this.once("upgrading", a),
      e.open();
  }
  onOpen() {
    if (
      ((this.readyState = "open"),
      (K.priorWebsocketSuccess = "websocket" === this.transport.name),
      this.emitReserved("open"),
      this.flush(),
      "open" === this.readyState && this.opts.upgrade)
    ) {
      let t = 0;
      const e = this.upgrades.length;
      for (; t < e; t++) this.probe(this.upgrades[t]);
    }
  }
  onPacket(t) {
    if (
      "opening" === this.readyState ||
      "open" === this.readyState ||
      "closing" === this.readyState
    )
      switch (
        (this.emitReserved("packet", t), this.emitReserved("heartbeat"), t.type)
      ) {
        case "open":
          this.onHandshake(JSON.parse(t.data));
          break;
        case "ping":
          this.resetPingTimeout(),
            this.sendPacket("pong"),
            this.emitReserved("ping"),
            this.emitReserved("pong");
          break;
        case "error":
          const e = new Error("server error");
          (e.code = t.data), this.onError(e);
          break;
        case "message":
          this.emitReserved("data", t.data),
            this.emitReserved("message", t.data);
      }
  }
  onHandshake(t) {
    this.emitReserved("handshake", t),
      (this.id = t.sid),
      (this.transport.query.sid = t.sid),
      (this.upgrades = this.filterUpgrades(t.upgrades)),
      (this.pingInterval = t.pingInterval),
      (this.pingTimeout = t.pingTimeout),
      (this.maxPayload = t.maxPayload),
      this.onOpen(),
      "closed" !== this.readyState && this.resetPingTimeout();
  }
  resetPingTimeout() {
    this.clearTimeoutFn(this.pingTimeoutTimer),
      (this.pingTimeoutTimer = this.setTimeoutFn(() => {
        this.onClose("ping timeout");
      }, this.pingInterval + this.pingTimeout)),
      this.opts.autoUnref && this.pingTimeoutTimer.unref();
  }
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen),
      (this.prevBufferLen = 0),
      0 === this.writeBuffer.length ? this.emitReserved("drain") : this.flush();
  }
  flush() {
    if (
      "closed" !== this.readyState &&
      this.transport.writable &&
      !this.upgrading &&
      this.writeBuffer.length
    ) {
      const t = this.getWritablePackets();
      this.transport.send(t),
        (this.prevBufferLen = t.length),
        this.emitReserved("flush");
    }
  }
  getWritablePackets() {
    if (
      !(
        this.maxPayload &&
        "polling" === this.transport.name &&
        this.writeBuffer.length > 1
      )
    )
      return this.writeBuffer;
    let t = 1;
    for (let s = 0; s < this.writeBuffer.length; s++) {
      const i = this.writeBuffer[s].data;
      if (
        (i &&
          (t +=
            "string" == typeof (e = i)
              ? (function (t) {
                  let e = 0,
                    s = 0;
                  for (let i = 0, n = t.length; i < n; i++)
                    (e = t.charCodeAt(i)),
                      e < 128
                        ? (s += 1)
                        : e < 2048
                        ? (s += 2)
                        : e < 55296 || e >= 57344
                        ? (s += 3)
                        : (i++, (s += 4));
                  return s;
                })(e)
              : Math.ceil(1.33 * (e.byteLength || e.size))),
        s > 0 && t > this.maxPayload)
      )
        return this.writeBuffer.slice(0, s);
      t += 2;
    }
    var e;
    return this.writeBuffer;
  }
  write(t, e, s) {
    return this.sendPacket("message", t, e, s), this;
  }
  send(t, e, s) {
    return this.sendPacket("message", t, e, s), this;
  }
  sendPacket(t, e, s, i) {
    if (
      ("function" == typeof e && ((i = e), (e = void 0)),
      "function" == typeof s && ((i = s), (s = null)),
      "closing" === this.readyState || "closed" === this.readyState)
    )
      return;
    (s = s || {}).compress = !1 !== s.compress;
    const n = { type: t, data: e, options: s };
    this.emitReserved("packetCreate", n),
      this.writeBuffer.push(n),
      i && this.once("flush", i),
      this.flush();
  }
  close() {
    const t = () => {
        this.onClose("forced close"), this.transport.close();
      },
      e = () => {
        this.off("upgrade", e), this.off("upgradeError", e), t();
      },
      s = () => {
        this.once("upgrade", e), this.once("upgradeError", e);
      };
    return (
      ("opening" !== this.readyState && "open" !== this.readyState) ||
        ((this.readyState = "closing"),
        this.writeBuffer.length
          ? this.once("drain", () => {
              this.upgrading ? s() : t();
            })
          : this.upgrading
          ? s()
          : t()),
      this
    );
  }
  onError(t) {
    (K.priorWebsocketSuccess = !1),
      this.emitReserved("error", t),
      this.onClose("transport error", t);
  }
  onClose(t, e) {
    ("opening" !== this.readyState &&
      "open" !== this.readyState &&
      "closing" !== this.readyState) ||
      (this.clearTimeoutFn(this.pingTimeoutTimer),
      this.transport.removeAllListeners("close"),
      this.transport.close(),
      this.transport.removeAllListeners(),
      "function" == typeof removeEventListener &&
        (removeEventListener(
          "beforeunload",
          this.beforeunloadEventListener,
          !1
        ),
        removeEventListener("offline", this.offlineEventListener, !1)),
      (this.readyState = "closed"),
      (this.id = null),
      this.emitReserved("close", t, e),
      (this.writeBuffer = []),
      (this.prevBufferLen = 0));
  }
  filterUpgrades(t) {
    const e = [];
    let s = 0;
    const i = t.length;
    for (; s < i; s++) ~this.transports.indexOf(t[s]) && e.push(t[s]);
    return e;
  }
}
K.protocol = 4;
const Y = "function" == typeof ArrayBuffer,
  z = Object.prototype.toString,
  W =
    "function" == typeof Blob ||
    ("undefined" != typeof Blob && "[object BlobConstructor]" === z.call(Blob)),
  $ =
    "function" == typeof File ||
    ("undefined" != typeof File && "[object FileConstructor]" === z.call(File));
function J(t) {
  return (
    (Y &&
      (t instanceof ArrayBuffer ||
        ((t) =>
          "function" == typeof ArrayBuffer.isView
            ? ArrayBuffer.isView(t)
            : t.buffer instanceof ArrayBuffer)(t))) ||
    (W && t instanceof Blob) ||
    ($ && t instanceof File)
  );
}
function Q(t, e) {
  if (!t || "object" != typeof t) return !1;
  if (Array.isArray(t)) {
    for (let e = 0, s = t.length; e < s; e++) if (Q(t[e])) return !0;
    return !1;
  }
  if (J(t)) return !0;
  if (t.toJSON && "function" == typeof t.toJSON && 1 === arguments.length)
    return Q(t.toJSON(), !0);
  for (const e in t)
    if (Object.prototype.hasOwnProperty.call(t, e) && Q(t[e])) return !0;
  return !1;
}
function X(t) {
  const e = [],
    s = t.data,
    i = t;
  return (
    (i.data = G(s, e)), (i.attachments = e.length), { packet: i, buffers: e }
  );
}
function G(t, e) {
  if (!t) return t;
  if (J(t)) {
    const s = { _placeholder: !0, num: e.length };
    return e.push(t), s;
  }
  if (Array.isArray(t)) {
    const s = new Array(t.length);
    for (let i = 0; i < t.length; i++) s[i] = G(t[i], e);
    return s;
  }
  if ("object" == typeof t && !(t instanceof Date)) {
    const s = {};
    for (const i in t)
      Object.prototype.hasOwnProperty.call(t, i) && (s[i] = G(t[i], e));
    return s;
  }
  return t;
}
function Z(t, e) {
  return (t.data = tt(t.data, e)), delete t.attachments, t;
}
function tt(t, e) {
  if (!t) return t;
  if (t && !0 === t._placeholder) {
    if ("number" == typeof t.num && t.num >= 0 && t.num < e.length)
      return e[t.num];
    throw new Error("illegal attachments");
  }
  if (Array.isArray(t)) for (let s = 0; s < t.length; s++) t[s] = tt(t[s], e);
  else if ("object" == typeof t)
    for (const s in t)
      Object.prototype.hasOwnProperty.call(t, s) && (t[s] = tt(t[s], e));
  return t;
}
const et = 5;
var st;
!(function (t) {
  (t[(t.CONNECT = 0)] = "CONNECT"),
    (t[(t.DISCONNECT = 1)] = "DISCONNECT"),
    (t[(t.EVENT = 2)] = "EVENT"),
    (t[(t.ACK = 3)] = "ACK"),
    (t[(t.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
    (t[(t.BINARY_EVENT = 5)] = "BINARY_EVENT"),
    (t[(t.BINARY_ACK = 6)] = "BINARY_ACK");
})(st || (st = {}));
class it extends f {
  constructor(t) {
    super(), (this.reviver = t);
  }
  add(t) {
    let e;
    if ("string" == typeof t) {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      e = this.decodeString(t);
      const s = e.type === st.BINARY_EVENT;
      s || e.type === st.BINARY_ACK
        ? ((e.type = s ? st.EVENT : st.ACK),
          (this.reconstructor = new nt(e)),
          0 === e.attachments && super.emitReserved("decoded", e))
        : super.emitReserved("decoded", e);
    } else {
      if (!J(t) && !t.base64) throw new Error("Unknown type: " + t);
      if (!this.reconstructor)
        throw new Error("got binary data when not reconstructing a packet");
      (e = this.reconstructor.takeBinaryData(t)),
        e && ((this.reconstructor = null), super.emitReserved("decoded", e));
    }
  }
  decodeString(t) {
    let e = 0;
    const s = { type: Number(t.charAt(0)) };
    if (void 0 === st[s.type]) throw new Error("unknown packet type " + s.type);
    if (s.type === st.BINARY_EVENT || s.type === st.BINARY_ACK) {
      const i = e + 1;
      for (; "-" !== t.charAt(++e) && e != t.length; );
      const n = t.substring(i, e);
      if (n != Number(n) || "-" !== t.charAt(e))
        throw new Error("Illegal attachments");
      s.attachments = Number(n);
    }
    if ("/" === t.charAt(e + 1)) {
      const i = e + 1;
      for (; ++e; ) {
        if ("," === t.charAt(e)) break;
        if (e === t.length) break;
      }
      s.nsp = t.substring(i, e);
    } else s.nsp = "/";
    const i = t.charAt(e + 1);
    if ("" !== i && Number(i) == i) {
      const i = e + 1;
      for (; ++e; ) {
        const s = t.charAt(e);
        if (null == s || Number(s) != s) {
          --e;
          break;
        }
        if (e === t.length) break;
      }
      s.id = Number(t.substring(i, e + 1));
    }
    if (t.charAt(++e)) {
      const i = this.tryParse(t.substr(e));
      if (!it.isPayloadValid(s.type, i)) throw new Error("invalid payload");
      s.data = i;
    }
    return s;
  }
  tryParse(t) {
    try {
      return JSON.parse(t, this.reviver);
    } catch (t) {
      return !1;
    }
  }
  static isPayloadValid(t, e) {
    switch (t) {
      case st.CONNECT:
        return "object" == typeof e;
      case st.DISCONNECT:
        return void 0 === e;
      case st.CONNECT_ERROR:
        return "string" == typeof e || "object" == typeof e;
      case st.EVENT:
      case st.BINARY_EVENT:
        return Array.isArray(e) && e.length > 0;
      case st.ACK:
      case st.BINARY_ACK:
        return Array.isArray(e);
    }
  }
  destroy() {
    this.reconstructor &&
      (this.reconstructor.finishedReconstruction(),
      (this.reconstructor = null));
  }
}
class nt {
  constructor(t) {
    (this.packet = t), (this.buffers = []), (this.reconPack = t);
  }
  takeBinaryData(t) {
    if (
      (this.buffers.push(t), this.buffers.length === this.reconPack.attachments)
    ) {
      const t = Z(this.reconPack, this.buffers);
      return this.finishedReconstruction(), t;
    }
    return null;
  }
  finishedReconstruction() {
    (this.reconPack = null), (this.buffers = []);
  }
}
var rt = Object.freeze({
  __proto__: null,
  protocol: 5,
  get PacketType() {
    return st;
  },
  Encoder: class {
    constructor(t) {
      this.replacer = t;
    }
    encode(t) {
      return (t.type !== st.EVENT && t.type !== st.ACK) || !Q(t)
        ? [this.encodeAsString(t)]
        : this.encodeAsBinary({
            type: t.type === st.EVENT ? st.BINARY_EVENT : st.BINARY_ACK,
            nsp: t.nsp,
            data: t.data,
            id: t.id,
          });
    }
    encodeAsString(t) {
      let e = "" + t.type;
      return (
        (t.type !== st.BINARY_EVENT && t.type !== st.BINARY_ACK) ||
          (e += t.attachments + "-"),
        t.nsp && "/" !== t.nsp && (e += t.nsp + ","),
        null != t.id && (e += t.id),
        null != t.data && (e += JSON.stringify(t.data, this.replacer)),
        e
      );
    }
    encodeAsBinary(t) {
      const e = X(t),
        s = this.encodeAsString(e.packet),
        i = e.buffers;
      return i.unshift(s), i;
    }
  },
  Decoder: it,
});
function ot(t, e, s) {
  return (
    t.on(e, s),
    function () {
      t.off(e, s);
    }
  );
}
const ht = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  newListener: 1,
  removeListener: 1,
});
class at extends f {
  constructor(t, e, s) {
    super(),
      (this.connected = !1),
      (this.recovered = !1),
      (this.receiveBuffer = []),
      (this.sendBuffer = []),
      (this._queue = []),
      (this.ids = 0),
      (this.acks = {}),
      (this.flags = {}),
      (this.io = t),
      (this.nsp = e),
      s && s.auth && (this.auth = s.auth),
      (this._opts = Object.assign({}, s)),
      this.io._autoConnect && this.open();
  }
  get disconnected() {
    return !this.connected;
  }
  subEvents() {
    if (this.subs) return;
    const t = this.io;
    this.subs = [
      ot(t, "open", this.onopen.bind(this)),
      ot(t, "packet", this.onpacket.bind(this)),
      ot(t, "error", this.onerror.bind(this)),
      ot(t, "close", this.onclose.bind(this)),
    ];
  }
  get active() {
    return !!this.subs;
  }
  connect() {
    return (
      this.connected ||
        (this.subEvents(),
        this.io._reconnecting || this.io.open(),
        "open" === this.io._readyState && this.onopen()),
      this
    );
  }
  open() {
    return this.connect();
  }
  send(...t) {
    return t.unshift("message"), this.emit.apply(this, t), this;
  }
  emit(t, ...e) {
    if (ht.hasOwnProperty(t))
      throw new Error('"' + t.toString() + '" is a reserved event name');
    if (
      (e.unshift(t),
      this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
    )
      return this._addToQueue(e), this;
    const s = { type: st.EVENT, data: e, options: {} };
    if (
      ((s.options.compress = !1 !== this.flags.compress),
      "function" == typeof e[e.length - 1])
    ) {
      const t = this.ids++,
        i = e.pop();
      this._registerAckCallback(t, i), (s.id = t);
    }
    const i =
      this.io.engine &&
      this.io.engine.transport &&
      this.io.engine.transport.writable;
    return (
      (this.flags.volatile && (!i || !this.connected)) ||
        (this.connected
          ? (this.notifyOutgoingListeners(s), this.packet(s))
          : this.sendBuffer.push(s)),
      (this.flags = {}),
      this
    );
  }
  _registerAckCallback(t, e) {
    var s;
    const i =
      null !== (s = this.flags.timeout) && void 0 !== s
        ? s
        : this._opts.ackTimeout;
    if (void 0 === i) return void (this.acks[t] = e);
    const n = this.io.setTimeoutFn(() => {
      delete this.acks[t];
      for (let e = 0; e < this.sendBuffer.length; e++)
        this.sendBuffer[e].id === t && this.sendBuffer.splice(e, 1);
      e.call(this, new Error("operation has timed out"));
    }, i);
    this.acks[t] = (...t) => {
      this.io.clearTimeoutFn(n), e.apply(this, [null, ...t]);
    };
  }
  emitWithAck(t, ...e) {
    const s = void 0 !== this.flags.timeout || void 0 !== this._opts.ackTimeout;
    return new Promise((i, n) => {
      e.push((t, e) => (s ? (t ? n(t) : i(e)) : i(t))), this.emit(t, ...e);
    });
  }
  _addToQueue(t) {
    let e;
    "function" == typeof t[t.length - 1] && (e = t.pop());
    const s = {
      id: this.ids++,
      tryCount: 0,
      pending: !1,
      args: t,
      flags: Object.assign({ fromQueue: !0 }, this.flags),
    };
    t.push((t, ...i) => {
      if (s !== this._queue[0]) return;
      return (
        null !== t
          ? s.tryCount > this._opts.retries && (this._queue.shift(), e && e(t))
          : (this._queue.shift(), e && e(null, ...i)),
        (s.pending = !1),
        this._drainQueue()
      );
    }),
      this._queue.push(s),
      this._drainQueue();
  }
  _drainQueue() {
    if (0 === this._queue.length) return;
    const t = this._queue[0];
    if (t.pending) return;
    (t.pending = !0), t.tryCount++;
    const e = this.ids;
    (this.ids = t.id),
      (this.flags = t.flags),
      this.emit.apply(this, t.args),
      (this.ids = e);
  }
  packet(t) {
    (t.nsp = this.nsp), this.io._packet(t);
  }
  onopen() {
    "function" == typeof this.auth
      ? this.auth((t) => {
          this._sendConnectPacket(t);
        })
      : this._sendConnectPacket(this.auth);
  }
  _sendConnectPacket(t) {
    this.packet({
      type: st.CONNECT,
      data: this._pid
        ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t)
        : t,
    });
  }
  onerror(t) {
    this.connected || this.emitReserved("connect_error", t);
  }
  onclose(t, e) {
    (this.connected = !1),
      delete this.id,
      this.emitReserved("disconnect", t, e);
  }
  onpacket(t) {
    if (t.nsp === this.nsp)
      switch (t.type) {
        case st.CONNECT:
          t.data && t.data.sid
            ? this.onconnect(t.data.sid, t.data.pid)
            : this.emitReserved(
                "connect_error",
                new Error(
                  "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"
                )
              );
          break;
        case st.EVENT:
        case st.BINARY_EVENT:
          this.onevent(t);
          break;
        case st.ACK:
        case st.BINARY_ACK:
          this.onack(t);
          break;
        case st.DISCONNECT:
          this.ondisconnect();
          break;
        case st.CONNECT_ERROR:
          this.destroy();
          const e = new Error(t.data.message);
          (e.data = t.data.data), this.emitReserved("connect_error", e);
      }
  }
  onevent(t) {
    const e = t.data || [];
    null != t.id && e.push(this.ack(t.id)),
      this.connected
        ? this.emitEvent(e)
        : this.receiveBuffer.push(Object.freeze(e));
  }
  emitEvent(t) {
    if (this._anyListeners && this._anyListeners.length) {
      const e = this._anyListeners.slice();
      for (const s of e) s.apply(this, t);
    }
    super.emit.apply(this, t),
      this._pid &&
        t.length &&
        "string" == typeof t[t.length - 1] &&
        (this._lastOffset = t[t.length - 1]);
  }
  ack(t) {
    const e = this;
    let s = !1;
    return function (...i) {
      s || ((s = !0), e.packet({ type: st.ACK, id: t, data: i }));
    };
  }
  onack(t) {
    const e = this.acks[t.id];
    "function" == typeof e && (e.apply(this, t.data), delete this.acks[t.id]);
  }
  onconnect(t, e) {
    (this.id = t),
      (this.recovered = e && this._pid === e),
      (this._pid = e),
      (this.connected = !0),
      this.emitBuffered(),
      this.emitReserved("connect");
  }
  emitBuffered() {
    this.receiveBuffer.forEach((t) => this.emitEvent(t)),
      (this.receiveBuffer = []),
      this.sendBuffer.forEach((t) => {
        this.notifyOutgoingListeners(t), this.packet(t);
      }),
      (this.sendBuffer = []);
  }
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  destroy() {
    this.subs && (this.subs.forEach((t) => t()), (this.subs = void 0)),
      this.io._destroy(this);
  }
  disconnect() {
    return (
      this.connected && this.packet({ type: st.DISCONNECT }),
      this.destroy(),
      this.connected && this.onclose("io client disconnect"),
      this
    );
  }
  close() {
    return this.disconnect();
  }
  compress(t) {
    return (this.flags.compress = t), this;
  }
  get volatile() {
    return (this.flags.volatile = !0), this;
  }
  timeout(t) {
    return (this.flags.timeout = t), this;
  }
  onAny(t) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.push(t),
      this
    );
  }
  prependAny(t) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.unshift(t),
      this
    );
  }
  offAny(t) {
    if (!this._anyListeners) return this;
    if (t) {
      const e = this._anyListeners;
      for (let s = 0; s < e.length; s++)
        if (t === e[s]) return e.splice(s, 1), this;
    } else this._anyListeners = [];
    return this;
  }
  listenersAny() {
    return this._anyListeners || [];
  }
  onAnyOutgoing(t) {
    return (
      (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
      this._anyOutgoingListeners.push(t),
      this
    );
  }
  prependAnyOutgoing(t) {
    return (
      (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
      this._anyOutgoingListeners.unshift(t),
      this
    );
  }
  offAnyOutgoing(t) {
    if (!this._anyOutgoingListeners) return this;
    if (t) {
      const e = this._anyOutgoingListeners;
      for (let s = 0; s < e.length; s++)
        if (t === e[s]) return e.splice(s, 1), this;
    } else this._anyOutgoingListeners = [];
    return this;
  }
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  notifyOutgoingListeners(t) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const e = this._anyOutgoingListeners.slice();
      for (const s of e) s.apply(this, t.data);
    }
  }
}
function ct(t) {
  (t = t || {}),
    (this.ms = t.min || 100),
    (this.max = t.max || 1e4),
    (this.factor = t.factor || 2),
    (this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0),
    (this.attempts = 0);
}
(ct.prototype.duration = function () {
  var t = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(),
      s = Math.floor(e * this.jitter * t);
    t = 0 == (1 & Math.floor(10 * e)) ? t - s : t + s;
  }
  return 0 | Math.min(t, this.max);
}),
  (ct.prototype.reset = function () {
    this.attempts = 0;
  }),
  (ct.prototype.setMin = function (t) {
    this.ms = t;
  }),
  (ct.prototype.setMax = function (t) {
    this.max = t;
  }),
  (ct.prototype.setJitter = function (t) {
    this.jitter = t;
  });
class pt extends f {
  constructor(t, e) {
    var s;
    super(),
      (this.nsps = {}),
      (this.subs = []),
      t && "object" == typeof t && ((e = t), (t = void 0)),
      ((e = e || {}).path = e.path || "/socket.io"),
      (this.opts = e),
      v(this, e),
      this.reconnection(!1 !== e.reconnection),
      this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
      this.reconnectionDelay(e.reconnectionDelay || 1e3),
      this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
      this.randomizationFactor(
        null !== (s = e.randomizationFactor) && void 0 !== s ? s : 0.5
      ),
      (this.backoff = new ct({
        min: this.reconnectionDelay(),
        max: this.reconnectionDelayMax(),
        jitter: this.randomizationFactor(),
      })),
      this.timeout(null == e.timeout ? 2e4 : e.timeout),
      (this._readyState = "closed"),
      (this.uri = t);
    const i = e.parser || rt;
    (this.encoder = new i.Encoder()),
      (this.decoder = new i.Decoder()),
      (this._autoConnect = !1 !== e.autoConnect),
      this._autoConnect && this.open();
  }
  reconnection(t) {
    return arguments.length
      ? ((this._reconnection = !!t), this)
      : this._reconnection;
  }
  reconnectionAttempts(t) {
    return void 0 === t
      ? this._reconnectionAttempts
      : ((this._reconnectionAttempts = t), this);
  }
  reconnectionDelay(t) {
    var e;
    return void 0 === t
      ? this._reconnectionDelay
      : ((this._reconnectionDelay = t),
        null === (e = this.backoff) || void 0 === e || e.setMin(t),
        this);
  }
  randomizationFactor(t) {
    var e;
    return void 0 === t
      ? this._randomizationFactor
      : ((this._randomizationFactor = t),
        null === (e = this.backoff) || void 0 === e || e.setJitter(t),
        this);
  }
  reconnectionDelayMax(t) {
    var e;
    return void 0 === t
      ? this._reconnectionDelayMax
      : ((this._reconnectionDelayMax = t),
        null === (e = this.backoff) || void 0 === e || e.setMax(t),
        this);
  }
  timeout(t) {
    return arguments.length ? ((this._timeout = t), this) : this._timeout;
  }
  maybeReconnectOnOpen() {
    !this._reconnecting &&
      this._reconnection &&
      0 === this.backoff.attempts &&
      this.reconnect();
  }
  open(t) {
    if (~this._readyState.indexOf("open")) return this;
    this.engine = new K(this.uri, this.opts);
    const e = this.engine,
      s = this;
    (this._readyState = "opening"), (this.skipReconnect = !1);
    const i = ot(e, "open", function () {
        s.onopen(), t && t();
      }),
      n = ot(e, "error", (e) => {
        s.cleanup(),
          (s._readyState = "closed"),
          this.emitReserved("error", e),
          t ? t(e) : s.maybeReconnectOnOpen();
      });
    if (!1 !== this._timeout) {
      const t = this._timeout;
      0 === t && i();
      const s = this.setTimeoutFn(() => {
        i(), e.close(), e.emit("error", new Error("timeout"));
      }, t);
      this.opts.autoUnref && s.unref(),
        this.subs.push(function () {
          clearTimeout(s);
        });
    }
    return this.subs.push(i), this.subs.push(n), this;
  }
  connect(t) {
    return this.open(t);
  }
  onopen() {
    this.cleanup(), (this._readyState = "open"), this.emitReserved("open");
    const t = this.engine;
    this.subs.push(
      ot(t, "ping", this.onping.bind(this)),
      ot(t, "data", this.ondata.bind(this)),
      ot(t, "error", this.onerror.bind(this)),
      ot(t, "close", this.onclose.bind(this)),
      ot(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  onping() {
    this.emitReserved("ping");
  }
  ondata(t) {
    try {
      this.decoder.add(t);
    } catch (t) {
      this.onclose("parse error", t);
    }
  }
  ondecoded(t) {
    I(() => {
      this.emitReserved("packet", t);
    }, this.setTimeoutFn);
  }
  onerror(t) {
    this.emitReserved("error", t);
  }
  socket(t, e) {
    let s = this.nsps[t];
    return (
      s || ((s = new at(this, t, e)), (this.nsps[t] = s)),
      this._autoConnect && s.connect(),
      s
    );
  }
  _destroy(t) {
    const e = Object.keys(this.nsps);
    for (const t of e) {
      if (this.nsps[t].active) return;
    }
    this._close();
  }
  _packet(t) {
    const e = this.encoder.encode(t);
    for (let s = 0; s < e.length; s++) this.engine.write(e[s], t.options);
  }
  cleanup() {
    this.subs.forEach((t) => t()),
      (this.subs.length = 0),
      this.decoder.destroy();
  }
  _close() {
    (this.skipReconnect = !0),
      (this._reconnecting = !1),
      this.onclose("forced close"),
      this.engine && this.engine.close();
  }
  disconnect() {
    return this._close();
  }
  onclose(t, e) {
    this.cleanup(),
      this.backoff.reset(),
      (this._readyState = "closed"),
      this.emitReserved("close", t, e),
      this._reconnection && !this.skipReconnect && this.reconnect();
  }
  reconnect() {
    if (this._reconnecting || this.skipReconnect) return this;
    const t = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(),
        this.emitReserved("reconnect_failed"),
        (this._reconnecting = !1);
    else {
      const e = this.backoff.duration();
      this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        t.skipReconnect ||
          (this.emitReserved("reconnect_attempt", t.backoff.attempts),
          t.skipReconnect ||
            t.open((e) => {
              e
                ? ((t._reconnecting = !1),
                  t.reconnect(),
                  this.emitReserved("reconnect_error", e))
                : t.onreconnect();
            }));
      }, e);
      this.opts.autoUnref && s.unref(),
        this.subs.push(function () {
          clearTimeout(s);
        });
    }
  }
  onreconnect() {
    const t = this.backoff.attempts;
    (this._reconnecting = !1),
      this.backoff.reset(),
      this.emitReserved("reconnect", t);
  }
}
const ut = {};
function lt(t, e) {
  "object" == typeof t && ((e = t), (t = void 0));
  const s = (function (t, e = "", s) {
      let i = t;
      (s = s || ("undefined" != typeof location && location)),
        null == t && (t = s.protocol + "//" + s.host),
        "string" == typeof t &&
          ("/" === t.charAt(0) &&
            (t = "/" === t.charAt(1) ? s.protocol + t : s.host + t),
          /^(https?|wss?):\/\//.test(t) ||
            (t = void 0 !== s ? s.protocol + "//" + t : "https://" + t),
          (i = H(t))),
        i.port ||
          (/^(http|ws)$/.test(i.protocol)
            ? (i.port = "80")
            : /^(http|ws)s$/.test(i.protocol) && (i.port = "443")),
        (i.path = i.path || "/");
      const n = -1 !== i.host.indexOf(":") ? "[" + i.host + "]" : i.host;
      return (
        (i.id = i.protocol + "://" + n + ":" + i.port + e),
        (i.href =
          i.protocol +
          "://" +
          n +
          (s && s.port === i.port ? "" : ":" + i.port)),
        i
      );
    })(t, (e = e || {}).path || "/socket.io"),
    i = s.source,
    n = s.id,
    r = s.path,
    o = ut[n] && r in ut[n].nsps;
  let h;
  return (
    e.forceNew || e["force new connection"] || !1 === e.multiplex || o
      ? (h = new pt(i, e))
      : (ut[n] || (ut[n] = new pt(i, e)), (h = ut[n])),
    s.query && !e.query && (e.query = s.queryKey),
    h.socket(s.path, e)
  );
}
Object.assign(lt, { Manager: pt, Socket: at, io: lt, connect: lt });
export {
  pt as Manager,
  at as Socket,
  lt as connect,
  lt as default,
  lt as io,
  et as protocol,
};
//# sourceMappingURL=socket.io.esm.min.js.map

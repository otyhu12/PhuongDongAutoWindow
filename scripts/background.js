"use strict";

function showOptionsPage() {
        try { chrome.runtime.openOptionsPage() } catch (o) {
                (console.error || console.log).call(console, o.stack || o)
        }
}

function loadDisplayInfos() {
        try { chrome.system.display.getInfo(function (o) { displayInfos = o }) } catch (o) {
                (console.error || console.log).call(console, o.stack || o)
        }
}

function findCachedWindow(o) {
        var t = -1; try { for (var e = 0; e < windowCache.length; e++) windowCache[e].id === o && (t = e) } catch (n) {
                (console.error || console.log).call(console, n.stack || n)
        } return t
}

function storeWindowIntoCache(o) {
        try {
                var t = findCachedWindow(o.id);
                t >= 0 && windowCache.splice(t, 1), windowCache.length >= WINDOW_CACHE_SIZE && windowCache.shift(), console.log("Window cached " + o.id), windowCache.push(o)
        } catch (e) {
                (console.error || console.log).call(console, e.stack || e)
        }
}

function onFocusChangeListener(o) {
        function t(o) { setTimeout(function () { updateTabRules(o), setTimeout(function () { updateTabRules(o) }, 5 * WINDOW_CHANGE_DETECTION_INTERVAL) }, WINDOW_CHANGE_DETECTION_INTERVAL) } try {
                console.log("Window Focused " + o); var e = {};
                e["i" + states.lastWindowInFocus] = states.lastWindowInFocus, e["i" + states.currentWindowInFocus] = states.currentWindowInFocus, e["i" + o] = o, states.lastWindowInFocus = states.currentWindowInFocus, states.currentWindowInFocus = o, console.log("Window transition " + states.lastWindowInFocus + " to " + states.currentWindowInFocus); for (var n in e)
                        if (e.hasOwnProperty(n)) {
                                var r = e[n];
                                r !== WINDOW_ID_NONE && t(r)
                        }
        } catch (i) {
                (console.error || console.log).call(console, i.stack || i)
        }
}

function updateTabRules(o, t) {
        function e(t) {
                if (t && t.tabs)
                        chrome.storage.local.get("TAB_HELPER_OPTIONS", function (obj) {
                                var e = obj.TAB_HELPER_OPTIONS, n;
                                try { e = e ? JSON.parse(e) : { tabs: [] }, e.options || (e.options = []) } catch (t) {
                                        (console.error || console.log).call(console, t.stack || t)
                                }

                                for (e, n = 0; n < t.tabs.length; n++) {
                                        var r = t.tabs[n],
                                                i = findTabRuleMatch(e, r); if (i && i.remember && !validateTabLocation(t, r, i)) {
                                                        var a = findMonitorByWindow(t); if (a) {
                                                                var c = determinePositionByCurrentLocation(a, t); if (c) {
                                                                        var l = updateTabRuleByLocation(i, a, c, o);
                                                                        l && saveOptions(e)
                                                                }
                                                        }
                                                }
                                }
                        })
        } try { t ? e(t) : chrome.windows.get(o, { populate: !0 }, function (o) { try { o && (storeWindowIntoCache(o), e(o)) } catch (t) { t.toString().indexOf("No window with id") >= 0 } }) } catch (n) {
                (console.error || console.log).call(console, n.stack || n)
        }
}

function determinePositionByCurrentLocation(o, t) {
        var e = POSITIONS.CENTER.id; try {
                if (t.state === WINDOW_STATES.MAXIMIZED) e = POSITIONS.CENTER.id;
                else
                        for (var n in POSITIONS)
                                if (POSITIONS.hasOwnProperty(n)) { var r = calculateWorkAreaByPosition(o.workArea, POSITIONS[n].id); if (matchesWorkArea(t, r, PIXEL_MONITOR_DETECTION_DELTA)) { e = POSITIONS[n].id; break } }
        } catch (i) {
                (console.error || console.log).call(console, i.stack || i)
        } return e
}

function matchesWorkArea(o, t, e) {
        var n = !1; try {
                var r = e ? e : 0;
                n = o.top >= t.top - r && o.top <= t.top + r && o.top + o.height >= t.top - r + t.height && o.top + o.height <= t.top + r + t.height && o.left >= t.left - r && o.left <= t.left + r && o.left + o.width >= t.left - r + t.width && o.left + o.width <= t.left + r + t.width
        } catch (i) {
                (console.error || console.log).call(console, i.stack || i)
        } return n
}

function findMonitorByWindow(o) {
        var t = null; try {
                for (var e = -1, n = -1, r = 0; r < displayInfos.length; r++) {
                        var i = displayInfos[r],
                                a = i.workArea,
                                c = o.left > a.left ? o.left : a.left,
                                l = o.left + o.width < a.left + a.width ? o.left + o.width : a.left + a.width,
                                s = o.top > a.top ? o.top : a.top,
                                d = o.top + o.height < a.top + a.height ? o.top + o.height : a.top + a.height,
                                h = (l - c) * (d - s);
                        h > n && (n = h, e = r)
                }
                e !== -1 && (t = displayInfos[e])
        } catch (u) {
                (console.error || console.log).call(console, u.stack || u)
        } return t
}

function updateTabRuleByLocation(o, t, e, n) {
        var r = !1; try { o.position !== e && o.monitor.id !== t.id && (console.log("TabRule Reposition Saved (triggered by window.id:" + n + ")"), console.log(o.position + " -> " + e), console.log(o.monitor.workArea), console.log(t.workArea), o.position = e, o.monitor = t, r = !0) } catch (i) {
                (console.error || console.log).call(console, i.stack || i)
        } return r
}

function validateTabLocation(o, t, e) {
        var n = !0; try { n = o.left === e.monitor.workArea.left && o.top === e.monitor.workArea.top && o.width === e.monitor.workArea.width && o.height === e.monitor.workArea.height } catch (r) {
                (console.error || console.log).call(console, r.stack || r)
        } return n
}

function findTabRuleMatch(o, t) {

        var e = null; try {
                if (t)
                        for (var n = 0; n < o.tabs.length; n++) {
                                var r = o.tabs[n];
                                var url_cur = t.url;
                                if (url_cur == null || url_cur.length  == 0) {
                                        url_cur = t.pendingUrl;
                                }
                                if (r.active && url_cur && r.url && url_cur.indexOf(r.url) >= 0) {
                                        e = r; break
                                }
                        }

        } catch (i) {
                (console.error || console.log).call(console, i.stack || i)
        } return e
}

function findCustomPositionMatch(o, t) {
        var e = null; try {
                if (t)
                        for (var n = 0; n < o.positions.length; n++) { var r = o.positions[n]; if (r.name && "" !== r.name && r.name === t) { e = r; break } }
        } catch (i) {
                (console.error || console.log).call(console, i.stack || i)
        } return e
}

function calculateWorkAreaByPosition(o, t) {
        var e = { left: o.left, top: o.top, width: o.width, height: o.height }; if (t === POSITIONS.LEFT_HALF.id && (e.width = Math.floor(e.width / 2)), t === POSITIONS.RIGHT_HALF.id) {
                var n = Math.floor(e.width / 2);
                e.left += e.width - n, e.width = n
        } if (t === POSITIONS.TOP_HALF.id && (e.height = Math.floor(e.height / 2)), t === POSITIONS.BOTTOM_HALF.id) {
                var r = Math.floor(e.height / 2);
                e.top += e.height - r, e.height = r
        } return e
}
// lưu dữ liệu
function saveOptions(o) {
        console.log('Value is set to ' + o);

        chrome.storage.local.set({ "TAB_HELPER_OPTIONS": JSON.stringify(o) }, function () {
        })

        // localStorage.setItem(OPTIONS_KEY, JSON.stringify(o))
}

function getInt(o) {
        var t = 0; try { "string" == typeof o ? t = parseInt(o, 10) : "number" == typeof o && (t = o) } catch (e) {
                (console.error || console.log).call(console, e.stack || e)
        } return t
}

function onTabCreated(o, t) {
        function e(o, t) {
                if (t > MAX_MOVE_TRIES && console.log("Tab with empty url could not be resolved after " + MAX_MOVE_TRIES + " tries"), o.pendingUrl && "" !== o.pendingUrl) {
                        chrome.storage.local.get("TAB_HELPER_OPTIONS", function (obj) {
                                var tg = obj.TAB_HELPER_OPTIONS;
                                try { tg = tg ? JSON.parse(tg) : { tabs: [] }, tg.options || (tg.options = []) } catch (t) {
                                        (console.error || console.log).call(console, t.stack || t)
                                }
                                var n = tg;

                                var r = findTabRuleMatch(n, o);
                                console.log('onTabCreatedsss 1', r)
                                var i = !1; if (r) {
                                        console.log("Tab matched " + o.id + " moving tab with url:" + o.url); var a = calculateWorkAreaByPosition(r.monitor.workArea, r.position); if (r.custom && n.positions && n.positions.length > 0) {
                                                var c = findCustomPositionMatch(n, r.custom);
                                                c && (a = { left: getInt(c.x), top: getInt(c.y), width: getInt(c.width), height: getInt(c.height) }, i = !0)
                                        }
                                        a.tabId = o.id, r.popup && (a.type = "popup"), chrome.windows.getAll({}, function (o) { for (var t = 1; t < o.length; t++) chrome.windows.remove(o[t].id) }), chrome.windows.create(a, function (o) { i || r.position !== POSITIONS.CENTER.id || chrome.windows.update(o.id, { state: "maximized" }, function () { }), i || r.position !== POSITIONS.FULLSIZE.id || chrome.windows.update(o.id, { state: "fullscreen" }, function () { }) })
                                }
                        })
                } else console.log("Tab with empty url, trying in 100ms"), setTimeout(function () { chrome.tabs.get(o.id, function (o) { e(o, t + 1) }) }, 100)
        } try { t || console.log("Tab Created id:" + o.id + " url:" + o.url), e(o, 0) } catch (n) {
                (console.error || console.log).call(console, n.stack || n)
        }
}

try { chrome.runtime.onInstalled.addListener(function (o) { console.log("previousVersion", o.previousVersion) }) } catch (err) {
        (console.error || console.log).call(console, err.stack || err)
}
var OPTIONS_KEY = "TAB_HELPER_OPTIONS",
        POSITIONS = { FULLSIZE: { id: "fullsize", name: "fullsize" }, CENTER: { id: "center", name: "center" }, LEFT_HALF: { id: "left-half", name: "left-half" }, RIGHT_HALF: { id: "right-half", name: "right-half" }, TOP_HALF: { id: "top-half", name: "top-half" }, BOTTOM_HALF: { id: "bottom-half", name: "bottom-half" } },
        WINDOW_ID_NONE = -1,
        PIXEL_MONITOR_DETECTION_DELTA = 100,
        WINDOW_CHANGE_DETECTION_INTERVAL = 1e3,
        MAX_MOVE_TRIES = 10,
        WINDOW_CACHE_SIZE = 20,
        windowCache = [],
        WINDOW_STATES = { NORMAL: "normal", MINIMIZED: "minimized", MAXIMIZED: "maximized", FULLSCREEN: "fullscreen", DOCKED: "docked" },
        states = { lastWindowInFocus: WINDOW_ID_NONE, currentWindowInFocus: WINDOW_ID_NONE, currentWindowLocationHandler: null },
        displayInfos = [];
loadDisplayInfos();
try { chrome.windows.onFocusChanged.addListener(onFocusChangeListener) } catch (err) {
        (console.error || console.log).call(console, err.stack || err)
}
chrome.tabs.onCreated.addListener(function (tab) {
        chrome.tabs.get(tab.id, async (tab) => {
                console.log("onTabCreated " + (JSON.stringify(tab)));
                onTabCreated(tab, tab);
        });
});
chrome.runtime.onInstalled.addListener((reason) => {
        if(reason.reason == "install"){
                chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
            }else if(reason.reason == "update"){
                //call a function to handle an update
                chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
            }        
});
//# sourceMappingURL=background.js.map
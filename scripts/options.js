"use strict";
angular.module("multiWindowPositioner", ["ngFileUpload", "ui.checkbox", "uuid4"]).controller("PositionerOptionsController", ["$scope", "$timeout", "Upload", "$http", "uuid4", function (o, e, n, t, i) {
    function a() {
        try { v(), p(), l(), ro("top-section") } catch (o) {
            (console.error || console.log).call(console, o.stack || o)
        }
    }

    function r(o) { _.forEach(so.options.tabs, function (e, n) { e.position = o }), H() }

    function s(o) {
        var e = d(o);
        _.forEach(so.options.tabs, function (o, n) { o.monitor = e }), H()
    }

    function l() {
        function o(o, e, n) {
            try {
                if (o.closePageGenerator) {
                    var t = o.closePageGenerator; for (var i in so.windowHandlers)
                        if (so.windowHandlers.hasOwnProperty(i)) {
                            var a = so.windowHandlers[i];
                            a.groupId === t && c(a)
                        }
                }
            } catch (r) {
                (console.error || console.log).call(console, r.stack || r)
            }
        } try { chrome.runtime.onMessageExternal.addListener(o) } catch (e) {
            (console.error || console.log).call(console, e.stack || e)
        }
    }

    function c(o) {
        try { so.windowHandlers[o.uuid] && chrome.windows.remove(o.id, function () { delete so.windowHandlers[o.uuid], console.log("Removed window " + o.id) }) } catch (e) {
            (console.error || console.log).call(console, e.stack || e)
        }
    }

    function T() { so.showExtraOptions = !so.showExtraOptions }

    function p() {
        chrome.system.display.getInfo(function (o) {
            try {
                so.displayInfos = angular.copy(o), console.table(o), _.forEach(so.displayInfos, function (o, e) {
                    o.idx = e + 1; var n = { id: o.id, idx: o.idx, name: o.name, workArea: o.workArea };
                    Oo[n.id] = n
                }), e(function () { y() })
            } catch (n) {
                (console.error || console.log).call(console, n.stack || n)
            }
        })
    }

    function O() {
        try {
            var o = i.generate();
            _.forEach(so.displayInfos, function (e, n) {
                var t = "https://igorlino.github.io/page-generator/? title=Monitor%20" + (n + 1) + "&type=monitor&id=" + (n + 1) + "&groupid=" + o + "&extid=" + chrome.runtime.id + "&delay=" + po,
                    a = { url: t, left: e.workArea.left, top: e.workArea.top, width: e.workArea.width, height: e.workArea.height, type: "popup" },
                    r = { groupId: o, uuid: i.generate(), handler: null };
                r.handler = chrome.windows.create(a, function (o) { r.id = o.id, so.windowHandlers[r.uuid] = r, console.log("Window " + o.id + " created."), chrome.windows.update(o.id, { state: "maximized" }, function () { console.log("Maximized detection window") }), setTimeout(function () { console.log("Removing window " + o.id), c(r) }, 1e3 * po + To) })
            })
        } catch (e) {
            (console.error || console.log).call(console, e.stack || e)
        }
    }

    function m() { var o = null; return _.forEach(so.displayInfos, function (e, n) { if (console.log(e), e.isPrimary) return o = e, !1 }), o }

    function d(o) { var e = null; return _.forEach(so.displayInfos, function (n, t) { if (n.id === o) return e = n, !1 }), e }

    function E(o) { _.remove(so.options.tabs, function (e) { return e.timestamp === o.timestamp }), H() }

    function u(o) { _.remove(so.options.positions, function (e) { return o.name === e.name }), H() }

    function I() { so.showNewTabOption = !0, so.newTabOption = k(), so.newTabOption.template = null, console.log("dhasgbsdas" + m()) }

    function g(o, e) { o.x = e.workArea.left, o.y = e.workArea.top, o.width = e.workArea.width, o.height = e.workArea.height }

    function M() { so.options.positions.push({ name: "CustomPosition" + so.options.positions.length, x: 0, y: 0, height: 10, width: 10 }), H() }

    function h(o) { so.showEditTabOption = !0, so.newTabOption = angular.copy(o), so.newTabOption.position = L(o.position), so.newTabOption.defaultMonitor = A(o.defaultMonitor), so.newTabOption.monitor = d(o.monitor.id), so.editTabOptionIdx = _.findIndex(so.options.tabs, o), so.newTabOption.template = null }

    function f() { so.newTabOption.template && (so.newTabOption.name = so.newTabOption.template.name, so.newTabOption.url = so.newTabOption.template.url, so.newTabOption.code = so.newTabOption.template.code, so.newTabOption.active = so.newTabOption.template.active, so.newTabOption.remember = so.newTabOption.template.remember, so.newTabOption.template.defaultMonitor && (so.newTabOption.defaultMonitor = A(so.newTabOption.template.defaultMonitor)), so.newTabOption.template.position && (so.newTabOption.position = L(so.newTabOption.template.position))) }

    function A(o) { var e = _.findKey(Eo, function (e) { return e.id === o }); return e ? Eo[e] : null }

    function L(o) { var e = _.findKey(mo, function (e) { return e.id === o }); return e ? mo[e] : null }

    function w() { so.showNewTabOption = !1, so.showEditTabOption = !1 }

    function S() {
        console.log('update tab option');
        so.showEditTabOption = !1, so.options.tabs[so.editTabOptionIdx] = { active: so.newTabOption.active, code: so.newTabOption.code, remember: so.newTabOption.remember, url: so.newTabOption.url, name: so.newTabOption.name, monitor: so.newTabOption.monitor, fullScreen: so.newTabOption.fullScreen, popup: so.newTabOption.popup, position: so.newTabOption.position ? so.newTabOption.position.id : Oo.CENTER.id, defaultMonitor: so.newTabOption.defaultMonitor ? so.newTabOption.defaultMonitor.id : Eo.MAIN_MONITOR.id, timestamp: (new Date).toISOString() }, so.editTabOptionIdx = -1, y(), H()
    }

    function N() {
        try { so.options.tabs.push({ active: so.newTabOption.active, code: so.newTabOption.code, remember: so.newTabOption.remember, url: so.newTabOption.url, name: so.newTabOption.name, monitor: so.newTabOption.monitor, fullScreen: so.newTabOption.fullScreen, popup: so.newTabOption.popup, position: so.newTabOption.position ? so.newTabOption.position.id : Oo.CENTER.id, defaultMonitor: so.newTabOption.defaultMonitor ? so.newTabOption.defaultMonitor.id : Eo.MAIN_MONITOR.id, timestamp: (new Date).toISOString() }), so.showNewTabOption = !1, y(), H() } catch (o) {
            (console.error || console.log).call(console, o.stack || o)
        }
    }

    function b() {
        so.newTabOption = F(), so.newTabOption.template = null; try { so.options.tabs.push({ active: so.newTabOption.active, code: so.newTabOption.code, remember: so.newTabOption.remember, url: so.newTabOption.url, name: so.newTabOption.name, monitor: so.newTabOption.monitor, fullScreen: so.newTabOption.fullScreen, popup: !0, position: so.newTabOption.position ? so.newTabOption.position.id : Oo.CENTER.id, defaultMonitor: so.newTabOption.defaultMonitor ? so.newTabOption.defaultMonitor.id : Eo.MAIN_MONITOR.id, timestamp: (new Date).toISOString() }), y(), H(), console.log(so.newTabOption.monitor) } catch (o) {
            (console.error || console.log).call(console, o.stack || o)
        }
    }
    //
    function R() {
        var data = JSON.stringify(so.options);
        chrome.storage.local.set({ 'TAB_HELPER_OPTIONS': data }, function () {
            console.log("object stored", data);
        }), G()
    }

    function H() { so.dirty = !0 }

    function G() { so.dirty = !1 }

    function v() {
        return chrome.storage.local.get("TAB_HELPER_OPTIONS", function (obj) {
            try {
                console.log("dấdawdasd", obj.TAB_HELPER_OPTIONS);
                var o = obj.TAB_HELPER_OPTIONS;
                o ? (so.options = JSON.parse(o), so.options.tabs || (so.options.tabs = []), so.options.positions || (so.options.positions = []), G()) : (so.options = { tabs: [], positions: [] }, H()), (!so.options.templates || so.options.templates.length <= 0) && (so.options.templates = Q())
            } catch (e) {
                (console.error || console.log).call(console, e.stack || e)
            } return so.showsHelp || 0 !== so.options.tabs.length || (so.showsHelp = !0), so.options
        })
    }

    function D() { v(), y() }

    function P(o, e) {
        var n = null; try {
            if (e)
                for (var t in o)
                    if (o.hasOwnProperty(t)) { var i = o[t]; if (e === i.id) { n = i.monitor; break } }
        } catch (a) {
            (console.error || console.log).call(console, a.stack || a)
        } return n
    }

    function U() {
        var o = angular.copy(Eo); try {
            _.forEach(so.displayInfos, function (e, n) {
                if (e.isEnabled) {
                    var t = e.workArea,
                        i = t.height * t.width; if (e.isPrimary && (o.MAIN_MONITOR.monitor = e), !e.isPrimary)
                        if (o.NOT_MAIN_MONITOR.monitor) {
                            var a = o.NOT_MAIN_MONITOR.monitor.workArea.height * o.NOT_MAIN_MONITOR.monitor.workArea.width;
                            i > a && (o.NOT_MAIN_MONITOR.monitor = e)
                        } else o.NOT_MAIN_MONITOR.monitor = e;
                    if (o.BIGGEST_RESOLUTION.monitor) {
                        var r = o.BIGGEST_RESOLUTION.monitor.workArea.height * o.BIGGEST_RESOLUTION.monitor.workArea.width;
                        i > r && (o.BIGGEST_RESOLUTION.monitor = e)
                    } else o.BIGGEST_RESOLUTION.monitor = e; if ((!o.BIGGEST_HEIGHT.monitor || t.height > o.BIGGEST_HEIGHT.monitor.workArea.height) && (o.BIGGEST_HEIGHT.monitor = e), (!o.BIGGEST_WIDTH.monitor || t.width > o.BIGGEST_WIDTH.monitor.workArea.width) && (o.BIGGEST_WIDTH.monitor = e), o.SMALLEST_RESOLUTION.monitor) {
                        var s = o.SMALLEST_RESOLUTION.monitor.workArea.height * o.SMALLEST_RESOLUTION.monitor.workArea.width;
                        i < s && (o.SMALLEST_RESOLUTION.monitor = e)
                    } else o.SMALLEST_RESOLUTION.monitor = e;
                    (!o.SMALLEST_HEIGHT.monitor || t.height < o.SMALLEST_HEIGHT.monitor.workArea.height) && (o.SMALLEST_HEIGHT.monitor = e), (!o.SMALLEST_WIDTH.monitor || t.width < o.SMALLEST_WIDTH.monitor.workArea.width) && (o.SMALLEST_WIDTH.monitor = e)
                }
            })
        } catch (e) {
            (console.error || console.log).call(console, e.stack || e)
        } return o
    }

    function y(o) {
        try {
            var e = U(),
                n = !1;
            _.forEach(so.options.tabs, function (t, i) {
                if (t.inconsistentCustom = !1, t.custom && "" !== t.custom) {
                    var a = !1;
                    _.forEach(so.options.positions, function (o, e) { if (o.name === t.custom) return t.inconsistentCustom = !0, a = !0, !1 }), a || (n = !0)
                } var r = !1; if (_.forEach(so.displayInfos, function (o, e) { if (o.isEnabled && t.monitor.id === o.id) return r = !0, !1 }), r) t.inconsistentMonitor = !1;
                else {
                    var s = null;
                    o && (s = P(e, t.defaultMonitor), s && (t.monitor = angular.copy(s))), o && s || (t.inconsistentMonitor = !0, n = !0)
                }
            }), so.inconsistentOptions = n
        } catch (t) {
            (console.error || console.log).call(console, t.stack || t)
        }
    }

    function B() {
        function o(o, e) {
            o.workArea = angular.copy(e.workArea), o.id = e.id; var n = _.findIndex(so.displayInfos, e);
            o.name = e.name, o.idx = n + 1
        } try {
            var e = m();
            _.forEach(so.options.tabs, function (n, t) {
                var i = !1,
                    a = null;
                _.forEach(so.displayInfos, function (o, e) { if (o.isEnabled && o.workArea && o.workArea.height === n.monitor.workArea.height && o.workArea.width === n.monitor.workArea.width && (a = o), n.monitor.id === o.id) return i = !0, !1 }), i || (a ? o(n.monitor, a) : e && o(n.monitor, e))
            }), y()
        } catch (n) {
            (console.error || console.log).call(console, n.stack || n)
        }
    }

    function k() { return { active: !0, remember: !1, code: "custom", name: so.locale.RULE_NAME_PLACEHOLDER, url: "http://any.url/", monitor: m(), defaultMonitor: Eo.MAIN_MONITOR, fullScreen: !1, popup: !0, position: mo.CENTER } }

    function F() { return console.log(m()), { active: !0, remember: !0, code: "custom", name: "DongDuong", url: "https://his.lapolo.com:7000/his/screen-saver", monitor: m(), defaultMonitor: Eo.MAIN_MONITOR, fullScreen: !0, popup: !0, position: mo.FULLSIZE } }

    function W() {
        // var o = localStorage.getItem(co);
      chrome.storage.local.get("TAB_HELPER_TEMPLATE_URL", function (obj) {
            var o = obj.TAB_HELPER_TEMPLATE_URL;
      
        o && (so.templateUrl = JSON.parse(o)), so.showImportTemplateDialog = !0
    })
    }

    function C(o) {
        try {
            console.log('Value is set to ' + co + o);
            so.showImportTemplateDialog = !1, o && "" !== o && (chrome.storage.local.set({ "TAB_HELPER_TEMPLATE_URL": JSON.stringify(o) }), so.templateUrl = o, Y(o, function (o) { o.success && o.data && (o.data.tabs && x(so.options.tabs, o.data.tabs), o.data.templates && (so.replaceAllTemplates ? so.options.templates = o.data.templates : X(so.options.templates, o.data.templates)), y(!0), H()) }))
        } catch (e) {
            (console.error || console.log).call(console, e.stack || e)
        }
    }

    function x(o, e) {
        try {
            V(o); for (var n = 0; n < o.length; n++)
                for (var t = o[n], i = 0; i < e.length; i++) {
                    var a = e[i];
                    a.order = i + 1, t.code === a.code && (a.merged = !0, t.url = a.url, t.name = a.name, t.defaultMonitor = a.defaultMonitor, t.order = a.order)
                }
            for (var r = 0; r < e.length; r++) {
                var s = e[r];
                s.merged || o.push(s)
            }
            z(o)
        } catch (l) {
            (console.error || console.log).call(console, l.stack || l)
        }
    }

    function V(o) { for (var e = 0; e < o.length; e++) delete o[e].order }

    function z(o) {
        for (var e = 0; e < o.length; e++)
            for (var n = 0; n < o.length - 1 - e; n++) {
                var t = o[n],
                    i = o[n + 1];
                (t.order && i.order && t.order > i.order || t.order && !i.order) && (o[n] = i, o[n + 1] = t)
            }
    }

    function X(o, e) {
        try {
            V(o); for (var n = 0; n < o.length; n++)
                for (var t = o[n], i = 0; i < e.length; i++) {
                    var a = e[i];
                    a.order = i + 1, t.code === a.code && (a.merged = !0, t.active = a.active, t.code = a.code, t.remember = a.remember, t.url = a.url, t.name = a.name, t.defaultMonitor = a.defaultMonitor, t.position = a.position, t.order = a.order)
                }
            for (var r = 0; r < e.length; r++) {
                var s = e[r];
                newTemplate.merged || o.push(s)
            }
            z(o)
        } catch (l) {
            (console.error || console.log).call(console, l.stack || l)
        }
    }

    function Z() { so.showImportTemplateDialog = !1, so.templateUrl = "" }

    function j(e) {
        n.upload({ url: "upload/url", data: { file: e, username: o.username } }).then(function (o) { console.log("Success " + o.config.data.file.name + "uploaded. Response: " + o.data) }, function (o) { console.log("Error status: " + o.status) }, function (o) {
            var e = parseInt(100 * o.loaded / o.total);
            o.config.data.file.name ? console.log("progress: " + e + "% " + o.config.data.file.name) : console.log("progress: " + e + "% " + o.config.data.file)
        })
    }

    function J() {
        var o = angular.toJson(so.options, 3),
            e = new Blob([o], { type: "application/json" }),
            n = window.saveAs;
        n(e, "multiwindow-positioner-rule-export.json")
    }

    function Q() { return [{ active: !0, remember: !1, name: "PhuongDong", url: "https://his.lapolo.com:7000/his/screen-saver", code: "google-search", defaultMonitor: "main-monitor" }] }

    function $(o, e) { o || (K(so.options.tabs, e, e - 1), H()) }

    function q(o, e) { o || (K(so.options.tabs, e, e + 1), H()) }

    function K(o, e, n) {
        var t = o[e];
        o[e] = o[n], o[n] = t
    }

    function Y(o, e) {
        function n(n) {
            var t = oo(n.data, o);
            e(t)
        }

        function i(o) {
            var n = { success: !0, data: o.data };
            e(n)
        }
        t({ method: "get", url: o, headers: { "Cache-Control": "no-cache" } }).then(i, n)
    }

    function oo(o, e) { var n = { success: !1 }; return o ? n.error = o : n.error = eo() + " - Request failed: " + e, n }

    function eo() { var o = new Date; return o.toLocaleString() }

    function no() { return { OPTIONS_TITLE: chrome.i18n.getMessage("OPTIONS_TITLE"), TAB_SETTINGS: chrome.i18n.getMessage("TAB_SETTINGS"), TAB_POSITIONS: chrome.i18n.getMessage("TAB_POSITIONS"), CUSTOM: chrome.i18n.getMessage("CUSTOM"), WIDTH: chrome.i18n.getMessage("WIDTH"), HEIGHT: chrome.i18n.getMessage("HEIGHT"), ADD_POSITION: chrome.i18n.getMessage("ADD_POSITION"), REMOVE_POSITION: chrome.i18n.getMessage("REMOVE_POSITION"), ACTIVE: chrome.i18n.getMessage("ACTIVE"), NAME: chrome.i18n.getMessage("NAME"), URL: chrome.i18n.getMessage("URL"), REMEMBER: chrome.i18n.getMessage("REMEMBER"), MONITOR: chrome.i18n.getMessage("MONITOR"), POSITION: chrome.i18n.getMessage("POSITION"), PLAIN: chrome.i18n.getMessage("PLAIN"), EDIT_TAB_RULE: chrome.i18n.getMessage("EDIT_TAB_RULE"), DELETE_TAB_RULE: chrome.i18n.getMessage("DELETE_TAB_RULE"), MOVE_UP: chrome.i18n.getMessage("MOVE_UP"), MOVE_DOWN: chrome.i18n.getMessage("MOVE_DOWN"), NEW_TAB_OPTION_TITLE: chrome.i18n.getMessage("NEW_TAB_OPTION_TITLE"), EDIT_TAB_OPTION_TITLE: chrome.i18n.getMessage("EDIT_TAB_OPTION_TITLE"), TEMPLATE: chrome.i18n.getMessage("TEMPLATE"), PLAIN_WINDOW: chrome.i18n.getMessage("PLAIN_WINDOW"), ADD: chrome.i18n.getMessage("ADD"), UPDATE: chrome.i18n.getMessage("UPDATE"), CANCEL: chrome.i18n.getMessage("CANCEL"), TEMPLATE_URL: chrome.i18n.getMessage("TEMPLATE_URL"), REPLACE_ALL_TEMPLATES: chrome.i18n.getMessage("REPLACE_ALL_TEMPLATES"), ADD_TAB_OPTION: chrome.i18n.getMessage("ADD_TAB_OPTION"), SAVE: chrome.i18n.getMessage("SAVE"), UNDO: chrome.i18n.getMessage("UNDO"), RELOAD: chrome.i18n.getMessage("RELOAD"), IMPORT_TEMPLATE: chrome.i18n.getMessage("IMPORT_TEMPLATE"), EXPORT_TEMPLATE: chrome.i18n.getMessage("EXPORT_TEMPLATE"), SHOW_MORE_OPTIONS: chrome.i18n.getMessage("SHOW_MORE_OPTIONS"), VALIDATE_RULES: chrome.i18n.getMessage("VALIDATE_RULES"), DETECT_MONITORS: chrome.i18n.getMessage("DETECT_MONITORS"), AUTO_REPAIR_RULES: chrome.i18n.getMessage("AUTO_REPAIR_RULES"), MAXIMIZED: chrome.i18n.getMessage("MAXIMIZED"), LEFT_HALF: chrome.i18n.getMessage("LEFT_HALF"), RIGHT_HALF: chrome.i18n.getMessage("RIGHT_HALF"), TOP_HALF: chrome.i18n.getMessage("TOP_HALF"), BOTTOM_HALF: chrome.i18n.getMessage("BOTTOM_HALF"), DEFAULT_MONITOR: chrome.i18n.getMessage("DEFAULT_MONITOR"), MAIN_MONITOR: chrome.i18n.getMessage("MAIN_MONITOR"), NOT_MAIN_MONITOR: chrome.i18n.getMessage("NOT_MAIN_MONITOR"), BIGGEST_RESOLUTION: chrome.i18n.getMessage("BIGGEST_RESOLUTION"), BIGGEST_HEIGHT: chrome.i18n.getMessage("BIGGEST_HEIGHT"), BIGGEST_WIDTH: chrome.i18n.getMessage("BIGGEST_WIDTH"), SMALLEST_RESOLUTION: chrome.i18n.getMessage("SMALLEST_RESOLUTION"), SMALLEST_HEIGHT: chrome.i18n.getMessage("SMALLEST_HEIGHT"), SMALLEST_WIDTH: chrome.i18n.getMessage("SMALLEST_WIDTH"), RULE_NAME_PLACEHOLDER: chrome.i18n.getMessage("RULE_NAME_PLACEHOLDER"), DRAFT: chrome.i18n.getMessage("DRAFT") } }

    function to(o) { var e = o; return o === Eo.MAIN_MONITOR.id ? e = so.locale.MAIN_MONITOR : o === Eo.NOT_MAIN_MONITOR.id ? e = so.locale.NOT_MAIN_MONITOR : o === Eo.BIGGEST_RESOLUTION.id ? e = so.locale.BIGGEST_RESOLUTION : o === Eo.BIGGEST_HEIGHT.id ? e = so.locale.BIGGEST_HEIGHT : o === Eo.BIGGEST_WIDTH.id ? e = so.locale.BIGGEST_WIDTH : o === Eo.SMALLEST_RESOLUTION.id ? e = so.locale.SMALLEST_RESOLUTION : o === Eo.SMALLEST_HEIGHT.id ? e = so.locale.SMALLEST_HEIGHT : o === Eo.SMALLEST_WIDTH.id && (e = so.locale.SMALLEST_WIDTH), e }

    function io(o) { var e = o; return o === mo.CENTER.id ? e = so.locale.MAXIMIZED : o === mo.LEFT_HALF.id ? e = so.locale.LEFT_HALF : o === mo.RIGHT_HALF.id ? e = so.locale.RIGHT_HALF : o === mo.TOP_HALF.id ? e = so.locale.TOP_HALF : o === mo.BOTTOM_HALF.id && (e = so.locale.BOTTOM_HALF), e }

    function ao() { so.showsHelp = !so.showsHelp, ro(so.showsHelp ? "quick-info-section" : "top-section") }

    function ro(o, n, t, i) {
        var a = (angular.isDefined(t) ? t : 0, angular.isDefined(i) ? i : 0),
            r = jQuery("html, body");
        r.stop(); var s = jQuery("#" + o);
        s && s.length > 0 && e(function () { r.animate({ scrollTop: jQuery("#" + o).offset().top + a }, 800) }, 100, !1)
    } var so = o,
        lo = "TAB_HELPER_OPTIONS",
        co = "TAB_HELPER_TEMPLATE_URL",
        To = 1100,
        po = 3,
        Oo = {};
    so.locale = no(); var mo = { FULLSIZE: { id: "fullsize", name: "Fullsize" }, CENTER: { id: "center", name: so.locale.MAXIMIZED }, LEFT_HALF: { id: "left-half", name: so.locale.LEFT_HALF }, RIGHT_HALF: { id: "right-half", name: so.locale.RIGHT_HALF }, TOP_HALF: { id: "top-half", name: so.locale.TOP_HALF }, BOTTOM_HALF: { id: "bottom-half", name: so.locale.BOTTOM_HALF } },
        Eo = { MAIN_MONITOR: { id: "main-monitor", name: so.locale.MAIN_MONITOR }, NOT_MAIN_MONITOR: { id: "not-main-monitor", name: so.locale.NOT_MAIN_MONITOR }, BIGGEST_RESOLUTION: { id: "biggest-area", name: so.locale.BIGGEST_RESOLUTION }, BIGGEST_HEIGHT: { id: "biggest-height", name: so.locale.BIGGEST_HEIGHT }, BIGGEST_WIDTH: { id: "biggest-width", name: so.locale.BIGGEST_WIDTH }, SMALLEST_RESOLUTION: { id: "smallest-area", name: so.locale.SMALLEST_RESOLUTION }, SMALLEST_HEIGHT: { id: "smallest-height", name: so.locale.SMALLEST_HEIGHT }, SMALLEST_WIDTH: { id: "smallest-width", name: so.locale.SMALLEST_WIDTH } };
    so.POSITIONS = mo, so.MONITORS = Oo, so.DEFAULT_MONITORS = Eo, so.windowHandlers = {}, so.options = null, so.showNewTabOption = !1, so.showEditTabOption = !1, so.showImportTemplateDialog = !1, so.inconsistentOptions = !1, so.dirty = !1, so.showExtraOptions = !1, so.showsHelp = !1, so.isopen = !0, so.showImportTemplateDialog = !1, so.templateUrl = "", so.replaceAllTemplates = !0, so.localizeDefaultMonitor = to, so.localizePosition = io, so.markAsDirty = H, so.saveOptions = R, so.loadOptions = v, so.undoOptions = v, so.reloadOptions = D, so.detectMonitors = O, so.showAdvancedOptions = T, so.addTabOption = I, so.saveTabOption = N, so.saveTabOption1 = b, so.updateTabOption = S, so.editTabOption = h, so.useTemplateAsOption = f, so.addPosition = M, so.setCustomPositionAsMonitor = g, so.applyPositionToAll = r, so.applyMonitorToAll = s, so.autofixOptions = B, so.validateOptions = y, so.moveOptionUp = $, so.moveOptionDown = q, so.importTemplate = j, so.openImportTemplateMenu = W, so.acceptImportTemplateMenu = C, so.cancelImportTemplateMenu = Z, so.exportTemplate = J, so.cancelTabOption = w, so.deleteTabOption = E, so.deletePositionOption = u, so.toggleHelp = ao, a()
}]);

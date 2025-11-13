var __defProp = Object.defineProperty,
    __defProps = Object.defineProperties,
    __getOwnPropDescs = Object.getOwnPropertyDescriptors,
    __getOwnPropSymbols = Object.getOwnPropertySymbols,
    __hasOwnProp = Object.prototype.hasOwnProperty,
    __propIsEnum = Object.prototype.propertyIsEnumerable,
    __defNormalProp = (t, e, o) => e in t ? __defProp(t, e, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: o
    }) : t[e] = o,
    __spreadValues = (t, e) => {
        for (var o in e || (e = {})) __hasOwnProp.call(e, o) && __defNormalProp(t, o, e[o]);
        if (__getOwnPropSymbols)
            for (var o of __getOwnPropSymbols(e)) __propIsEnum.call(e, o) && __defNormalProp(t, o, e[o]);
        return t
    },
    __spreadProps = (t, e) => __defProps(t, __getOwnPropDescs(e));
! function() {
    "use strict";
    const t = "chat",
        e = "octachat",
        o = 1e3,
        n = "octadesk-octachat-app",
        i = "octadesk-octachat-app-hide";
    const a = {
            getViewportMeta: () => "undefined" != typeof document ? document.head.querySelector("meta[name=viewport]") : (console.error("Cannot get viewport meta, document not available!"), null),
            getViewportMetaContent: () => {
                const t = a.getViewportMeta();
                return t && t.content
            },
            removeViewportMeta: () => {
                const t = a.getViewportMeta();
                t && t.remove()
            },
            updateViewportMeta: (t = "") => {
                a.removeViewportMeta();
                const e = document.createElement("meta");
                e.name = "viewport", e.content = t, document.head.appendChild(e)
            }
        },
        s = () => "undefined" != typeof window && window.outerWidth < 768;
    class r {
        constructor(t) {
            this._ready = !1, this._hideOnClose = !1, this._startHide = !0, this._subDomain = "", this._showButton = !0, this._openOnMessage = !1, this._showFooterPoweredBy = !0, this._whiteLabel = !1, this._forceSelectFields = !1, this._reopen = !0, this._cookies = (() => {
                let t = window.location.hostname;
                const e = "octadesk.com",
                    n = t.includes("qaoctadesk.com") || !t.includes(e);
                if (n) {
                    const e = /^(?!www\.)([^.]*)\.([A-Za-z0-9])+\.(.)+$/,
                        o = t.match(e);
                    o && o.length > 1 && (t = t.replace(o[1], ""))
                }
                const {
                    document: i
                } = window.top || window;
                return {
                    set: (e, a, s) => {
                        if (!n) return;
                        let r = "";
                        if (s) {
                            const t = new Date;
                            t.setTime(t.getTime() + parseInt((24 * s * 60 * 60 * o).toString(), 10)), r = "; expires=" + t.toUTCString()
                        }
                        let h = `${e}=${a||""}${r}; path=/;`;
                        t && (h += ` domain=${t}`), i.cookie = h
                    },
                    get: t => {
                        const e = t + "=",
                            o = i.cookie.split(";");
                        for (let n = 0; n < o.length; n++) {
                            let t = o[n];
                            for (;
                                " " == t.charAt(0);) t = t.substring(1, t.length);
                            if (0 == t.indexOf(e)) return t.substring(e.length, t.length)
                        }
                        return null
                    },
                    erase: t => {
                        i.cookie = t + "=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                    }
                }
            })(), this.id = t.id, this._subDomain = t.subDomain, this._appSessionKeys = new Set([`octa_chat_${this._subDomain}_active`, `octa_chat_${this._subDomain}_chatKey`, `octa_chat_${this._subDomain}_userId`, `octa_chat_${this._subDomain}_guestUser`, `octa_chat_${this._subDomain}_fluxId`]), this._startHide = t.startHide, this._showButton = t.showButton, this._hideOnClose = !t.showButton && t.startHide, this._embedURL = t.embedURL, this._openOnMessage = t.openOnMessage, this._showFooterPoweredBy = t.showFooterPoweredBy, this._login = t.login, this._conversationCustomFields = t.conversationCustomFields, this._baseUrl = t.baseUrl, this._whiteLabel = t.whiteLabel, this._initialViewportMetaContent = a.getViewportMetaContent(), this.createApp();
            const e = this.getAppElement(null);
            this.createStyle(e), this.createFrame(e), this.listenEvent(), this.setScrollEvent(), this.restoreAppSession()
        }
        get _cookieName() {
            return ("ock-" + this._subDomain).toLowerCase()
        }
        get _currentLocation() {
            return window.location.toString()
        }
        listenEvent() {
            window.addEventListener("message", (t => {
                if (t.data.id !== this.id) return;
                if (this.createAppSourceEvent(t), !this._source) return;
                if (t.data.octachat && t.data.octachat.classes) return this.onChangeClasses(t.data.octachat.classes);
                if (t.data.octachat && void 0 !== t.data.octachat.style) return this.onChangeStyles(t.data.octachat.style.id);
                if (t.data.octachat && void 0 !== t.data.octachat.appSession) return this.storeAppSession(t.data.octachat.appSession);
                if (t.data.octachat && void 0 !== t.data.octachat.isReady) return this.onOctaChatReady(t.data.octachat.isReady);
                if (t.data.octachatNotification) return this.onOctaChatNotification(t.data.octachatNotification);
                if (t.data.octaChatAgentMessage) return this.handleAgentMessage();
                const o = this;
                return t.data && t.data.domain === e && t.data.name && t.data.name.length && o[t.data.name] ? o[t.data.name](t.data) : void 0
            }), !1)
        }
        onLogin(t) {
            const e = new CustomEvent("onOctaChatLogin", {
                detail: {
                    user: t.user,
                    id: this.id
                }
            });
            window.dispatchEvent(e)
        }
        onCreateChat(t) {
            const e = new CustomEvent("onOctaChatCreateChat", {
                detail: {
                    chat: t.chat,
                    id: this.id
                }
            });
            window.dispatchEvent(e)
        }
        onChooseFLux(t) {
            const e = new CustomEvent("onOctaChatChooseFLux", {
                detail: {
                    flux: t.flux,
                    id: this.id
                }
            });
            window.dispatchEvent(e)
        }
        onOpen() {
            !s() && a.getViewportMeta() || a.updateViewportMeta("width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no")
        }
        onClose() {
            this._initialViewportMetaContent && s() ? a.updateViewportMeta(this._initialViewportMetaContent) : this._initialViewportMetaContent || a.removeViewportMeta()
        }
        onOctaChatReady(t) {
            const e = new CustomEvent("onOctaChatReady", {
                detail: {
                    isReady: t,
                    id: this.id
                }
            });
            window.dispatchEvent(e), this._ready = t, this._startHide && this.hideApp(), this.notifyParentSize()
        }
        notifyParentSize() {
            return this.postMessageToChat({
                name: "parentSize",
                size: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            })
        }
        onChangeStyles(t) {
            const e = this.getAppElement(null);
            e && e.setAttribute("style", t)
        }
        onChangeClasses(t) {
            const e = this.getAppElement(null);
            e && (t.push(n), (e.classList.contains(i) || t.indexOf("octachatAppClose") >= 0 && this._hideOnClose) && t.push(i), this.clearClasses(e), e.className = t.join(" "))
        }
        onOctaChatNotification(t) {
            if (t.start) return this.startNotification(t);
            this.stopNotification()
        }
        changeUrl(t) {
            if (t && t.url)
                if (t.target) {
                    const e = window.open(t.url, t.target);
                    null == e || e.focus()
                } else window.location = t.url
        }
        postMessageToChat(e) {
            return !!this._source && (e.id = this.id || t, this._source.postMessage(e, "*"), !0)
        }
        updateUrl() {
            this._lastUrl !== this._currentLocation && (this._lastUrl = this._currentLocation, this.postMessageToChat({
                name: "newurl",
                data: this._lastUrl
            }))
        }
        getScrollPercent() {
            const t = document.documentElement,
                e = document.body,
                o = "scrollTop",
                n = "scrollHeight";
            return (t[o] || e[o]) / ((t[n] || e[n]) - t.clientHeight) * 100
        }
        setScrollEvent() {
            window.addEventListener("scroll", (() => {
                this._scrollTimeout && clearTimeout(this._scrollTimeout), this._scrollTimeout = setTimeout((() => {
                    const t = this.getScrollPercent();
                    this.postMessageToChat({
                        name: "scrollPercent",
                        data: t
                    })
                }), 1e3, null)
            }))
        }
        clearClasses(t) {
            let e = [];
            if (t.classList)
                for (let o = 0; o < t.classList.length; o++) e.push(t.classList[o]);
            else e = t.className.split(" ");
            e.forEach((e => this.removeClass(e, t)))
        }
        handleAgentMessage() {
            this.show(), this.showApp()
        }
        removeClass(t, e) {
            const o = this.getAppElement(e || null);
            o && o.classList.remove(t)
        }
        addClass(t, e) {
            const o = this.getAppElement(e || null);
            o && o.classList.add(t)
        }
        getAppElement(e) {
            return e || document.getElementById(n + (this.id || t))
        }
        createAppSourceEvent(t) {
            this._source = t.source, this.updateUrl(), setInterval((() => this.updateUrl()), 500)
        }
        startNotification(t) {
            this.stopNotification(), this._notificationInterval = setInterval((() => {
                window.document.title !== t.title ? (this._originalTitle = window.document.title, window.document.title = t.title) : this._originalTitle && (window.document.title = this._originalTitle)
            }), o, null)
        }
        stopNotification() {
            this._notificationInterval && this._originalTitle && (clearInterval(this._notificationInterval), window.document.title = this._originalTitle, this._originalTitle = void 0)
        }
        createApp() {
            const t = document.createElement("div");
            t.className = n, t.id = n + this.id, this._startHide && (t.className = "octadesk-octachat-app octadesk-octachat-app-hide"), document.body.appendChild(t)
        }
        createStyle(t) {
            var e;
            const o = document.createElement("style"),
                i = "/* Main\n--------------------------------------------------*/\n\n/*.overflow-scrolling-touch {\n    -webkit-overflow-scrolling : touch;\n    overflow: auto;\n    height: 100%;\n}*/\n\n.ooa {\n  position: fixed;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  overflow: hidden;\n  z-index: 2147483645;\n  zoom: 1;\n}\n\n.ooa-hide {\n  display: none;\n}\n\n.ooa--topLeft.ocw2 {\n  top: 1.25rem;\n  left: 1.25rem;\n  margin-top: 70px;\n  max-height: calc(100% - 2.5rem - 70px) !important;\n}\n\n.ooa--topRight.ocw2 {\n  top: 1.25rem;\n  right: 1.25rem;\n  margin-top: 70px;\n  max-height: calc(100% - 2.5rem - 70px) !important;\n}\n\n.ooa--bottomLeft.ocw2 {\n  bottom: 1.25rem;\n  left: 1.25rem;\n}\n\n.ooa--bottomRight.ocw2 {\n  right: 1.25rem;\n  bottom: 1.25rem;\n}\n\n.ooa--topLeft {\n  top: 2rem;\n  left: 2rem;\n  margin-top: 70px;\n}\n\n.ooa--topRight {\n  top: 2rem;\n  right: 2rem;\n  margin-top: 70px;\n}\n\n.ooa--bottomLeft {\n  bottom: 2rem;\n  left: 2rem;\n}\n\n.ooa--bottomRight {\n  right: 2rem;\n  bottom: 2rem;\n}\n\n.ooa.octachatAppClose {\n  width: 85px;\n  height: 85px;\n  -webkit-transition: opacity 0.8s !important;\n  transition: opacity 0.8s !important;\n}\n\n.ooa.octachatAppClose.octachatProactiveMsg {\n  width: 365px;\n  max-width: 100%;\n  height: 230px;\n  max-height: 100%;\n  -webkit-transition: opacity 0.8s !important;\n  transition: opacity 0.8s !important;\n}\n\n.ooa.octachatAppClose.octachatProactiveMsg--senderless {\n  width: 301px;\n  max-width: 100%;\n  height: 230px;\n  max-height: 100%;\n  -webkit-transition: opacity 0.8s !important;\n  transition: opacity 0.8s !important;\n}\n\n.ooa.oao.ocw2 {\n  width: 388px;\n  max-width: 100% !important;\n  max-height: calc(100% - 2.5rem);\n  -webkit-transition: opacity 0.8s !important;\n  transition: opacity 0.8s !important;\n}\n\n.ooa.oao {\n  width: 363px;\n  max-height: calc(100% - 4rem);\n  -webkit-transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1),\n    height 0.34s cubic-bezier(0.4, 0, 0.2, 1) 0.035s, opacity 0.08s;\n  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1),\n    height 0.34s cubic-bezier(0.4, 0, 0.2, 1) 0.035s, opacity 0.08s;\n}\n\n.ooa.oao.octadesk-octachat-login.ocw2 {\n  height: 805px !important;\n}\n\n.ooa.oao.login.ocw2,\n.ooa.oao.conversation.ocw2,\n.ooa.oao.contact.ocw2,\n.ooa.oao.contact.contact-kb.ocw2 {\n  height: 805px !important;\n}\n\n.ooa.oao.octadesk-octachat-login,\n.ooa.oao.login {\n  height: 540px;\n}\n\n.ooa.oao.conversation {\n  height: 560px;\n}\n\n.ooa.oao.contact {\n  height: 480px;\n}\n\n.ooa.oao.contact.contact-kb {\n  height: 650px;\n}\n\n/* Iframe\n--------------------------------------------------*/\n\n.ooa iframe {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  height: 100% !important;\n  width: 100% !important;\n  min-height: unset;\n}\n\n/* Mobile\n--------------------------------------------------*/\n\n@media only screen and (max-device-width: 767px) {\n  .octadesk-octachat-app.octachatAppOpen.octa-widget-v2 {\n    min-height: 100%;\n  }\n\n  .ooa {\n    overflow: auto;\n  }\n\n  .ooa--topLeft,\n  .ooa--topLeft.ocw2 {\n    top: 0;\n    left: 0;\n    margin-top: 0;\n  }\n\n  .ooa--topRight,\n  .ooa--topRight.ocw2 {\n    top: 0;\n    right: 0;\n    margin-top: 0;\n  }\n\n  .ooa--bottomLeft,\n  .ooa--bottomLeft.ocw2 {\n    left: 0;\n    bottom: 0;\n  }\n\n  .ooa--bottomRight,\n  .ooa--bottomRight.ocw2 {\n    right: 0;\n    bottom: 0;\n  }\n\n  .ooa.oao {\n    width: 100% !important;\n    height: 100% !important;\n    max-width: 767px !important;\n    max-height: 1023px;\n  }\n\n  .ooa.oao.ocw2 {\n    width: 100% !important;\n    height: 100% !important;\n    max-height: 100%;\n    max-width: 100% !important;\n  }\n\n  .oao.login iframe,\n  .oao.conversation iframe {\n    min-height: 280px;\n  }\n\n  .oao.contact iframe {\n    min-height: 350px;\n  }\n}\n".replace(/ocw2/g, "octa-widget-v2").replace(/ooa/g, n).replace(/oao/g, "octachatAppOpen");
            o.appendChild(document.createTextNode(i)), null == (e = this.getAppElement(t)) || e.appendChild(o)
        }
        createFrame(t) {
            var e;
            const o = [`subdomain=${this._subDomain}`, `id=${this.id}`, `showButton=${this._showButton}`, `openOnMessage=${this._openOnMessage}`, `showFooterPoweredBy=${this._showFooterPoweredBy}`, `login=${JSON.stringify(this._login)}`, `conversationCustomFields=${JSON.stringify(this._conversationCustomFields)}`, `baseUrl=${this._baseUrl}`, `whiteLabel=${this._whiteLabel}`, `forceSelectFields=${this._forceSelectFields}`, `reopen=${this._reopen}`, `url=${window.location.toString()}`],
                n = this._cookies.get(this._cookieName);
            n && o.push(`session=${n}`);
            const i = document.createElement("iframe");
            i.width = "100%", i.height = "100vh", i.allowFullscreen = !0, i.allow = "microphone", i.style.border = "0", i.setAttribute("src", `${this._embedURL}?${o.join("&")}`), null == (e = this.getAppElement(t)) || e.appendChild(i)
        }
        toggleApp() {
            return this.postMessageToChat({
                name: "toggle"
            })
        }
        showApp() {
            return this.postMessageToChat({
                name: "show"
            })
        }
        showButton() {
            return this._hideOnClose = !1, this.postMessageToChat({
                name: "showButton"
            })
        }
        hideButton() {
            return this._hideOnClose = !0, this.postMessageToChat({
                name: "hideButton"
            })
        }
        hideApp() {
            return this.postMessageToChat({
                name: "hide"
            })
        }
        storeAppSession(t) {
            Object.keys(t).forEach((e => {
                this._appSessionKeys.has(e) && t[e] && localStorage.setItem(e, t[e])
            }))
        }
        restoreAppSession() {
            if (!this._source) return void setTimeout((() => {
                this.restoreAppSession()
            }), 100);
            let t = {};
            Array.from(this._appSessionKeys).forEach((e => {
                const o = localStorage.getItem(e);
                o && (t[e] = o)
            })), Object.keys(t).length && this.postMessageToChat({
                name: "externalSessionRestore",
                data: __spreadValues({}, t)
            })
        }
        loginApp(t) {
            return this.postMessageToChat({
                name: "login",
                data: t
            })
        }
        login(t) {
            return this.loginApp(t)
        }
        setCustomFields(t) {
            return this.postMessageToChat({
                data: t,
                name: "setCustomFields"
            })
        }
        updateQueryOptions(t) {
            return this.postMessageToChat({
                data: t,
                name: "updateQueryOptions"
            })
        }
        setOrganization(t) {
            return this.postMessageToChat({
                data: t,
                name: "setOrganization"
            })
        }
        hide() {
            return this.addClass(i), !0
        }
        show() {
            return this.removeClass(i), !0
        }
        isReady() {
            return this._ready
        }
        clearSession() {
            return Array.from(this._appSessionKeys).forEach((t => localStorage.removeItem(t))), this.postMessageToChat({
                name: "clearSession"
            })
        }
        setSession(t) {
            const {
                sessionId: e
            } = t;
            if (e) {
                const t = .08;
                this._cookies.set(this._cookieName, e, t)
            } else this._cookies.erase(this._cookieName)
        }
        clearStorage() {
            return this.postMessageToChat({
                name: "clearStorage"
            })
        }
        closeConversation() {
            return this.postMessageToChat({
                name: "closeConversation"
            })
        }
    }! function(e) {
        var o, n, i, a, s, h, c, l, p, d, m, u, w, g, _;
        const f = {
                apps: {},
                isReady: t => {
                    const e = v(t);
                    return !!e && e.isReady()
                },
                hide: t => {
                    const e = v(t);
                    return !!e && e.hide()
                },
                clearSession: t => {
                    const e = v(t);
                    return !!e && e.clearSession()
                },
                setOrganization: (t, e) => {
                    const o = v(e);
                    return !!o && o.setOrganization(t)
                },
                show: t => {
                    const e = v(t);
                    return !!e && e.show()
                },
                showApp: t => {
                    const e = v(t);
                    return !!e && e.showApp()
                },
                showButton: t => {
                    const e = v(t);
                    return !!e && e.showButton()
                },
                hideButton: t => {
                    const e = v(t);
                    return !!e && e.hideButton()
                },
                hideApp: t => {
                    const e = v(t);
                    return !!e && e.hideApp()
                },
                toggle: t => {
                    const e = v(t);
                    return !!e && e.toggleApp()
                },
                login: (t, e) => {
                    const o = v(e);
                    return !!o && o.loginApp(t)
                },
                setCustomFields: (t, e) => {
                    const o = v(e);
                    return !!o && o.setCustomFields(t)
                },
                clearStorage: t => {
                    const e = v(t);
                    return !!e && e.clearStorage()
                },
                closeConversation: t => {
                    const e = v(t);
                    return !!e && e.closeConversation()
                },
                updateQueryOptions: (t, e) => {
                    const o = v(e);
                    return !!o && o.updateQueryOptions(t)
                }
            },
            b = e.chat && __spreadProps(__spreadValues(__spreadValues({}, e.chat), f), {
                apps: e.chat.apps || f.apps
            }) || f,
            v = e => b.apps[e || t],
            C = (t, e) => !!(t && ("" + t).length && "true" === ("" + t).toLocaleLowerCase() || "1" === ("" + t).toLocaleLowerCase()) || !(t && ("" + t).length && "false" === ("" + t).toLocaleLowerCase() || "0" === ("" + t).toLocaleLowerCase()) && e;
        if (!(null == (n = null == (o = e.chatOptions) ? void 0 : o.subDomain) ? void 0 : n.length)) throw new Error("[octadesk] inform an subDomain to initialize your chat widget");
        const y = new r({
            subDomain: (null == (i = window.octadesk.chatOptions) ? void 0 : i.subDomain) || "",
            id: (null == (a = window.octadesk.chatOptions) ? void 0 : a.id) || t,
            showButton: C(null == (s = window.octadesk.chatOptions) ? void 0 : s.showButton, !0),
            openOnMessage: C(null == (h = window.octadesk.chatOptions) ? void 0 : h.openOnMessage, !0),
            showFooterPoweredBy: C(null == (c = window.octadesk.chatOptions) ? void 0 : c.showFooterPoweredBy, !0),
            conversationCustomFields: (null == (l = window.octadesk.chatOptions) ? void 0 : l.conversationCustomFields) || void 0,
            login: (null == (p = window.octadesk.chatOptions) ? void 0 : p.login) || void 0,
            baseUrl: (null == (d = window.octadesk.chatOptions) ? void 0 : d.baseUrl) || "",
            whiteLabel: C(null == (m = window.octadesk.chatOptions) ? void 0 : m.whiteLabel, !1),
            startHide: C(null == (u = window.octadesk.chatOptions) ? void 0 : u.hide, !1),
            forceSelectFields: C(null == (w = window.octadesk.chatOptions) ? void 0 : w.forceSelectFields, !1),
            reopen: C(null == (g = window.octadesk.chatOptions) ? void 0 : g.reopen, !0),
            embedURL: String((null == (_ = window.octadesk.chatOptions) ? void 0 : _.embedURL) || "https://cdn.octadesk.com/old-widget-static/index.html")
        });
        b.apps = b.apps || {}, b.apps[y.id] = y, window.octadesk.chat = b
    }(window.octadesk = window.octadesk || {})
}();
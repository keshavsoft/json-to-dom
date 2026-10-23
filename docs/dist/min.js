//#region src/v42/register/meta.js
var e = {
	version: "1.41.0",
	name: "json-to-dom"
}, t = (t) => {
	t && (globalThis.ks ??= {}, globalThis.ks.jsonToDom = {
		meta: e,
		appendToDom: t
	});
}, n = {
	version: "v10",
	description: "JSON-to-DOM engine with SVG namespace support, mixed text content, and centralized traversal"
}, r = (e) => {
	if (typeof globalThis > "u" || !e) return;
	globalThis.ks ??= {};
	let t = {
		meta: n,
		buildSpecElement: e
	};
	globalThis.ks["json-to-tag"] = t, globalThis.ks.jsonToTag = t;
}, i = (e) => e == null ? null : typeof Node < "u" && e instanceof Node ? e : typeof e == "string" || typeof e == "number" ? document.createTextNode(String(e)) : typeof e == "object" && (e.nodeType === 3 || e.tagName === "#text" || !e.tagName && (e.textContent !== void 0 || e.text !== void 0)) ? document.createTextNode(e.textContent ?? e.text ?? "") : g(e), a = (e) => Array.isArray(e) ? e.map(i).flat(Infinity).filter(Boolean) : [], o = (e) => e ?? e, s = "http://www.w3.org/2000/svg", c = /* @__PURE__ */ new Set(/* @__PURE__ */ "svg.path.symbol.use.g.circle.ellipse.rect.line.polyline.polygon.text.tspan.defs.clippath.mask.pattern.marker.lineargradient.radialgradient.stop.image.filter.fegaussianblur.femerge.femergenode".split(".")), l = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	if (!t) return null;
	if (t === "checkbox") {
		let e = document.createElement("input");
		return e.type = "checkbox", e;
	}
	return c.has(t) ? document.createElementNS(s, t) : document.createElement(t);
}, u = ({ inElement: e, inTextContent: t }) => (!e || t == null || (e.textContent = t), e), d = ({ inElement: e, inProperties: t }) => (e && t && typeof t == "object" && Object.assign(e, t), e), f = "http://www.w3.org/1999/xlink", p = ({ inElement: e, inAttributes: t }) => {
	let n = e, r = t;
	if (!n || !r || typeof r != "object") return n;
	let i = typeof SVGElement < "u" ? n instanceof SVGElement : n.namespaceURI === "http://www.w3.org/2000/svg";
	return Object.entries(r).forEach(([e, t]) => {
		if (e === "class") {
			i ? n.setAttribute("class", String(t)) : n.className = t;
			return;
		}
		if (e === "xlink:href" || e === "href") {
			if (t != null) {
				let e = String(t);
				if (i) try {
					n.setAttributeNS(f, "href", e);
				} catch {}
				n.setAttribute("href", e), n.setAttribute("xlink:href", e);
			}
			return;
		}
		if (typeof t == "boolean") {
			t ? n.setAttribute(e, "") : n.removeAttribute(e);
			return;
		}
		t != null && n.setAttribute(e, String(t));
	}), n;
}, m = ({ inElement: e, inClassList: t }) => {
	if (!e || !t) return e;
	let n = typeof t == "string" ? t.split(/\s+/).filter(Boolean) : Array.isArray(t) ? t.filter((e) => typeof e == "string" && e.trim()) : [];
	return n.length && e.classList.add(...n), e;
}, h = (e) => {
	if (!e || typeof e != "object" || Array.isArray(e) || !e.tagName) return null;
	let t = l({ inTagName: e.tagName });
	if (!t) return null;
	if (u({
		inElement: t,
		inTextContent: o(e.textContent),
		inTagName: e.tagName
	}), d({
		inElement: t,
		inProperties: e.properties
	}), p({
		inElement: t,
		inAttributes: e.attributes
	}), m({
		inElement: t,
		inClassList: e.classList
	}), Array.isArray(e.children)) {
		let n = a(e.children);
		n.length && t.append(...n);
	}
	return t;
}, g = (e) => e == null ? null : typeof Node < "u" && e instanceof Node ? e : Array.isArray(e) ? a(e) : typeof e == "object" ? h(e) : typeof e == "string" || typeof e == "number" ? document.createTextNode(String(e)) : null, _ = (e = {}) => g(e?.spec ?? e?.inSpec ?? e);
r(_);
//#endregion
//#region ../spec-to-dom/src/v2/register/meta.js
var v = {
	version: "2.1.1",
	name: "spec-to-dom"
}, y = (e) => {
	e && (globalThis.ks ??= {}, globalThis.ks.specToDom = {
		meta: v,
		appendToDom: e
	});
}, b = ({ buildSpec: e, targetHtmlId: t, appendPosition: n, showLog: r }) => {
	let i = e, a = t, o = n, s = r;
	s && console.log("renderToDom 1 (content):", i);
	let c = document.getElementById(a);
	return c ? (Array.isArray(i) || i instanceof NodeList || i instanceof HTMLCollection ? o === "prepend" ? c.prepend(...i) : c.append(...i) : o === "prepend" ? c.prepend(i) : (c.innerHTML = "", c.append(i)), s && console.log("renderToDom 2 (mounted):", c), c) : null;
};
y(b);
//#endregion
//#region src/v42/index.js
var x = ({ jsonSpec: e, targetHtmlId: t, appendPosition: n, showLog: r }) => b({
	buildSpec: _(e),
	targetHtmlId: t,
	appendPosition: n,
	showLog: r
});
t(x);
//#endregion
export { x as default };

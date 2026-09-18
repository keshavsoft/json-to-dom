//#region src/v39/meta.js
var e = {
	version: "v39.0",
	description: "Pure DOM engine only from json"
}, t = (t) => {
	typeof globalThis > "u" || !t || (globalThis.ks ??= {}, globalThis.ks["json-to-dom"] = {
		meta: e,
		buildSpecElement: t
	});
}, n = ({ inSpec: e }) => e == null, r = ({ inSpec: e }) => typeof Node < "u" && e instanceof Node, i = ({ inSpec: e }) => {
	let t = e;
	return Array.isArray(t);
}, a = ({ raka: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	return Array.isArray(n) ? n.map((e) => h({
		raka: e,
		inShowLog: r
	})).flat().filter(Boolean) : [];
}, o = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	if (!t) return null;
	if (t === "checkbox") {
		let e = document.createElement("input");
		return e.type = "checkbox", e;
	}
	return document.createElement(t);
}, s = ({ inElement: e, inTextContent: t, inAllowsTextContent: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t;
	return !a || o == null ? a : n ? (a.textContent = o, a) : (i && console.warn(`[json-to-dom v11] textContent is not allowed on <${r}>; discarded "${o}"`), a);
}, c = ({ inElement: e, inProperties: t }) => {
	let n = e, r = t;
	return n && r && typeof r == "object" && Object.assign(n, r), n;
}, l = ({ inElement: e, inAttributes: t }) => {
	let n = e, r = t;
	return !n || !r || typeof r != "object" || Object.entries(r).forEach(([e, t]) => {
		e === "class" ? n.className = t : typeof t == "boolean" ? t ? n.setAttribute(e, "") : n.removeAttribute(e) : t != null && n.setAttribute(e, String(t));
	}), n;
}, u = ({ inElement: e, inClassList: t }) => {
	let n = e, r = t;
	if (!n || !r) return n;
	let i = [];
	return typeof r == "string" ? i = r.split(/\s+/).filter(Boolean) : Array.isArray(r) && (i = r.filter((e) => typeof e == "string" && e.trim().length > 0)), i.length > 0 && n.classList.add(...i), n;
}, d = ({ inElement: e, inChildren: t, inAllowsChildren: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	return !a || !Array.isArray(o) || o.length === 0 ? a : s ? (o.forEach((e) => {
		typeof Node < "u" && e instanceof Node ? a.appendChild(e) : (typeof e == "string" || typeof e == "number") && a.appendChild(document.createTextNode(String(e)));
	}), a) : (l && console.warn(`[json-to-dom v11] Children are not allowed on void tag <${c}>; discarded ${o.length} child nodes.`), a);
}, f = ({ inSpec: e, inClassList: t }) => {
	let n = e, r = t || n?.classList;
	if (!n || !n.tagName) return null;
	let i = o({ inTagName: n.tagName });
	return i ? (s({
		inElement: i,
		inTextContent: n.textContent,
		inTagName: n.tagName
	}), c({
		inElement: i,
		inProperties: n.properties
	}), l({
		inElement: i,
		inAttributes: n.attributes
	}), u({
		inElement: i,
		inClassList: r
	}), d({
		inElement: i,
		inChildren: n.children,
		inTagName: n.tagName
	}), i) : null;
}, p = ({ inChildren: e, inShowLog: t = !1, inOutput: n }) => {
	let r = e, i = t, a = n;
	return Array.isArray(r) ? r.map((e) => h({
		inSpec: e,
		inShowLog: i,
		inOutput: a
	})).flat().filter(Boolean) : [];
}, m = ({ inSpec: e, inShowLog: t = !1 }) => {
	let n = e, r = f({ inSpec: n }), i = [];
	return "children" in n && (i = Array.isArray(n.children) && n.children.length > 0 ? p({
		inChildren: n.children,
		inShowLog: t
	}) : [], r.append(...i)), r;
}, h = ({ inSpec: e, inShowLog: t = !1 } = {}) => n({ inSpec: e }) ? null : r({ inSpec: e }) ? raka : i({ inSpec: e }) ? a({
	raka,
	inShowLog: t
}) : m({
	inSpec: e,
	inShowLog: t
}), g = ({ element: e, targetHtmlId: t } = {}) => {
	let n = e, r = t;
	if (!r || typeof document > "u") return;
	let i = document.getElementById(r);
	i && (i.innerHTML = "", Array.isArray(n) ? n.forEach((e) => {
		e instanceof Node && i.appendChild(e);
	}) : n instanceof Node && i.appendChild(n));
}, _ = (e = {}) => {
	let t = e, n = t.element, r = t.targetHtmlId;
	return r && typeof document < "u" && g({
		element: n,
		targetHtmlId: r
	}), n;
}, v = ({ spec: e, domIdToPushTo: t, showLog: n }) => {
	try {
		return _({
			element: h({
				inSpec: e,
				inShowLog: n
			}),
			targetHtmlId: t
		});
	} catch (e) {
		console.log("error : ", e);
	}
}, y = v;
t(v);
//#endregion
export { v as buildSpecElement, v as default, y as specToDom };

//#region src/v5/buildSpec/isNullOrUndefined.js
var e = ({ inSpec: e }) => !e, t = ({ inSpec: e }) => e instanceof Node, n = ({ inSpec: e }) => {
	let t = e;
	return Array.isArray(t);
}, r = ({ inSpec: e }) => {
	let t = e;
	return typeof t == "object" && !!t;
}, i = ({ inSpec: e }) => e.map((e) => _(e)).flat().filter(Boolean), a = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	if (t === "checkbox") {
		let e = document.createElement("input");
		return e.type = "checkbox", e;
	}
	return document.createElement(t);
}, o = ({ inElement: e, inTextContent: t }) => {
	let n = e, r = t;
	return r && (n.textContent = r), n;
}, s = ({ inElement: e, inProperties: t }) => {
	let n = e, r = t;
	return r && Object.assign(n, r), n;
}, c = ({ inElement: e, inAttributes: t }) => {
	let n = e, r = t;
	return r && Object.entries(r).forEach(([e, t]) => {
		e === "class" ? n.className = t : n.setAttribute(e, t);
	}), n;
}, l = ({ inElement: e, inClassList: t }) => {
	let n = e, r = t;
	return r && n.classList.add(...r.split(/\s+/).filter(Boolean)), n;
}, u = ({ inElement: e, inEvents: t }) => {
	let n = e, r = t;
	return r && typeof r == "object" && Object.entries(r).forEach(([e, t]) => {
		n.addEventListener(e, t);
	}), n;
}, d = ({ inElement: e, inChildren: t }) => {
	let n = e, r = t;
	return n.tagName === "INPUT" || Array.isArray(r) && r.forEach((e) => {
		e instanceof Node && n.appendChild(e);
	}), n;
}, f = ({ inSpec: e, inClassList: t }) => {
	let n = e, r = t;
	if (!n || !n.tagName) return null;
	let i = a({ inTagName: n.tagName });
	return o({
		inElement: i,
		inTextContent: n.textContent
	}), s({
		inElement: i,
		inProperties: n.properties
	}), c({
		inElement: i,
		inAttributes: n.attributes
	}), l({
		inElement: i,
		inClassList: r
	}), u({
		inElement: i,
		inEvents: n.events
	}), d({
		inElement: i,
		inChildren: n.children
	}), i;
}, p = ({ inChildren: e }) => {
	let t = e;
	return Array.isArray(t) ? t.map((e) => _(e)).flat().filter(Boolean) : [];
}, m = {
	div: {},
	input: {},
	label: {},
	button: {},
	checkbox: {}
}, h = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	return !!(t && t in m);
}, g = ({ inSpec: e }) => {
	let t = e;
	if (!t?.tagName || !h({ inTagName: t.tagName })) return null;
	let n = p({ inChildren: t.children });
	return f({ inSpec: {
		...t,
		children: n
	} });
}, _ = (a) => {
	let o = a && typeof a == "object" && "inSpec" in a && !(a instanceof Node) && !Array.isArray(a) ? a.inSpec : a;
	return e({ inSpec: o }) ? null : t({ inSpec: o }) ? o : n({ inSpec: o }) ? i({ inSpec: o }) : r({ inSpec: o }) ? g({ inSpec: o }) : null;
};
window.ks ??= {}, window.ks["json-to-dom"] = { buildSpecElement: _ };
//#endregion
export { _ as buildSpecElement, _ as default };

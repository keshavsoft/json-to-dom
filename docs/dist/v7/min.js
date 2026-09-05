//#region src/v7/buildSpec/isNullOrUndefined.js
var e = ({ inSpec: e }) => !e, t = ({ inSpec: e }) => e instanceof Node, n = ({ inSpec: e }) => {
	let t = e;
	return Array.isArray(t);
}, r = ({ inSpec: e }) => {
	let t = e;
	return typeof t == "object" && !!t;
}, i = ({ inSpec: e }) => e.map((e) => S(e)).flat().filter(Boolean), a = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	if (t === "checkbox") {
		let e = document.createElement("input");
		return e.type = "checkbox", e;
	}
	return document.createElement(t);
}, o = ({ inElement: e, inTextContent: t, inAllowsTextContent: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t;
	return o ? n ? (a.textContent = o, a) : (i && console.warn(`[json-to-dom] textContent is not allowed on <${r}>; discarded "${o}"`), a) : a;
}, s = ({ inElement: e, inProperties: t }) => {
	let n = e, r = t;
	return r && Object.assign(n, r), n;
}, c = ({ inAttributes: e, inAllowedAttributes: t, inTagName: n, inShowLog: r = !1 }) => {
	let i = e, a = t, o = n, s = r;
	if (!i || typeof i != "object") return {};
	if (!Array.isArray(a)) return i;
	let c = {}, l = [];
	return Object.entries(i).forEach(([e, t]) => {
		a.includes(e) ? c[e] = t : l.push(e);
	}), l.length > 0 && s && console.warn(`[json-to-dom] Discarded invalid attributes for <${o}>:`, l), c;
}, l = ({ inElement: e, inAttributes: t, inAllowedAttributes: n, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, l = r, u = i;
	if (!o) return a;
	let d = c({
		inAttributes: o,
		inAllowedAttributes: s,
		inTagName: l,
		inShowLog: u
	});
	return Object.entries(d).forEach(([e, t]) => {
		e === "class" ? a.className = t : typeof t == "boolean" ? t ? a.setAttribute(e, "") : a.removeAttribute(e) : a.setAttribute(e, t);
	}), a;
}, u = ({ inElement: e, inClassList: t }) => {
	let n = e, r = t;
	return r && n.classList.add(...r.split(/\s+/).filter(Boolean)), n;
}, d = ({ inElement: e, inEvents: t }) => {
	let n = e, r = t;
	return r && typeof r == "object" && Object.entries(r).forEach(([e, t]) => {
		n.addEventListener(e, t);
	}), n;
}, f = ({ inElement: e, inChildren: t, inAllowsChildren: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	return !Array.isArray(o) || o.length === 0 ? a : s ? (o.forEach((e) => {
		e instanceof Node && a.appendChild(e);
	}), a) : (l && console.warn(`[json-to-dom] children are not allowed on <${c}>; discarded ${o.length} child nodes`), a);
}, p = ({ inSpec: e, inTagDef: t, inClassList: n, inShowLog: r = !1 }) => {
	let i = e, c = t, p = n, m = r;
	if (!i || !i.tagName) return null;
	let h = a({ inTagName: i.tagName });
	return o({
		inElement: h,
		inTextContent: i.textContent,
		inAllowsTextContent: c?.allowsTextContent,
		inTagName: i.tagName,
		inShowLog: m
	}), s({
		inElement: h,
		inProperties: i.properties
	}), l({
		inElement: h,
		inAttributes: i.attributes,
		inAllowedAttributes: c?.allowedAttributes,
		inTagName: i.tagName,
		inShowLog: m
	}), u({
		inElement: h,
		inClassList: p
	}), d({
		inElement: h,
		inEvents: i.events
	}), f({
		inElement: h,
		inChildren: i.children,
		inAllowsChildren: c?.allowsChildren,
		inTagName: i.tagName,
		inShowLog: m
	}), h;
}, m = ({ inChildren: e }) => {
	let t = e;
	return Array.isArray(t) ? t.map((e) => S(e)).flat().filter(Boolean) : [];
}, h = {
	div: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [
			"class",
			"id",
			"style",
			"title",
			"role"
		]
	},
	input: {
		allowsTextContent: !1,
		allowsChildren: !1,
		allowedAttributes: [
			"type",
			"placeholder",
			"value",
			"name",
			"disabled",
			"readonly",
			"required",
			"class",
			"id",
			"list"
		]
	},
	checkbox: {
		allowsTextContent: !1,
		allowsChildren: !1,
		allowedAttributes: [
			"type",
			"checked",
			"name",
			"value",
			"disabled",
			"required",
			"class",
			"id"
		]
	},
	label: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [
			"for",
			"class",
			"id"
		]
	},
	button: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [
			"type",
			"disabled",
			"class",
			"id",
			"name",
			"value"
		]
	},
	table: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [
			"class",
			"id",
			"style",
			"border",
			"cellpadding",
			"cellspacing"
		]
	},
	thead: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["class", "id"]
	},
	tbody: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["class", "id"]
	},
	tfoot: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["class", "id"]
	},
	tr: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["class", "id"]
	},
	th: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [
			"class",
			"id",
			"scope",
			"colspan",
			"rowspan"
		]
	},
	td: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [
			"class",
			"id",
			"colspan",
			"rowspan"
		]
	},
	datalist: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["id", "class"]
	},
	option: {
		allowsTextContent: !0,
		allowsChildren: !1,
		allowedAttributes: [
			"value",
			"label",
			"selected",
			"disabled"
		]
	}
}, g = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	return !!(t && t in h);
}, _ = ({ inTagName: e }) => h[e?.toLowerCase()] || null, v = ({ inSpec: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	if (!n?.tagName || !g({ inTagName: n.tagName })) return r && console.warn(`[json-to-dom] Not a valid element: "${n?.tagName}"`, n), null;
	let i = _({ inTagName: n.tagName }), a = i?.allowsChildren ? m({ inChildren: n.children }) : [];
	return p({
		inSpec: {
			...n,
			children: a
		},
		inTagDef: i,
		inShowLog: r
	});
}, y = ({ inTagName: e, inSpec: t }) => {
	let n = (e || t?.tagName)?.toLowerCase();
	return n ? n in h ? {
		isValid: !0,
		tagName: n,
		definition: h[n],
		error: null
	} : {
		isValid: !1,
		tagName: n,
		definition: null,
		error: `Tag <${n}> is not recognized in tags.json`
	} : {
		isValid: !1,
		tagName: null,
		definition: null,
		error: "Missing tagName"
	};
}, b = [
	"tagName",
	"textContent",
	"attributes",
	"classList",
	"events",
	"children",
	"properties"
], x = ({ inSpec: e }) => {
	let t = e, n = [], r = [], i = [], a = [];
	if (!t || typeof t != "object" || Array.isArray(t)) return {
		isValid: !1,
		tagName: null,
		errors: ["Specification must be a non-null object"],
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a
	};
	Object.keys(t).forEach((e) => {
		b.includes(e) || (i.push(e), r.push(`Unknown top-level key "${e}" in specification`));
	});
	let o = t.tagName?.toLowerCase();
	if (!o) return n.push("Missing required \"tagName\" property"), {
		isValid: !1,
		tagName: null,
		errors: n,
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a
	};
	let s = h[o];
	if (!s) return n.push(`Tag <${o}> is not recognized in tags.json`), {
		isValid: !1,
		tagName: o,
		errors: n,
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a
	};
	if (t.textContent && !s.allowsTextContent && n.push(`Tag <${o}> does not allow textContent (allowsTextContent: false)`), Array.isArray(t.children) && t.children.length > 0 && !s.allowsChildren && n.push(`Tag <${o}> is a void element and does not allow children (allowsChildren: false)`), t.attributes && typeof t.attributes == "object") {
		let e = Array.isArray(s.allowedAttributes) ? s.allowedAttributes : [];
		Object.keys(t.attributes).forEach((t) => {
			e.includes(t) || (a.push(t), n.push(`Attribute "${t}" is not allowed on <${o}>`));
		});
	}
	return {
		isValid: n.length === 0,
		tagName: o,
		errors: n,
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a
	};
}, S = (a) => {
	let o = a && typeof a == "object" && "inSpec" in a && !(a instanceof Node) && !Array.isArray(a) ? a.inSpec : a, s = !!window?.ks?.showLog;
	return e({ inSpec: o }) ? null : t({ inSpec: o }) ? o : n({ inSpec: o }) ? i({ inSpec: o }) : r({ inSpec: o }) ? v({
		inSpec: o,
		inShowLog: s
	}) : null;
};
window.ks ??= {}, window.ks.showLog = !0, window.ks["json-to-dom"] = {
	buildSpecElement: S,
	tags: h,
	validateTag: y,
	validateSpec: x
};
//#endregion
export { S as buildSpecElement, S as default, h as tags, x as validateSpec, y as validateTag };

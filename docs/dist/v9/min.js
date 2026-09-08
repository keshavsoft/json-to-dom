//#region src/v9/buildSpec/isNullOrUndefined.js
var e = ({ inSpec: e }) => !e, t = ({ inSpec: e }) => e instanceof Node, n = ({ inSpec: e }) => {
	let t = e;
	return Array.isArray(t);
}, r = ({ inSpec: e }) => {
	let t = e;
	return typeof t == "object" && !!t;
}, i = ({ inSpec: e }) => e.map((e) => O(e)).flat().filter(Boolean), a = ({ inTagName: e }) => {
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
}, c = {
	title: "HTML Global Allowed Attributes",
	description: "Standard W3C/WHATWG Global Attributes permitted on all HTML elements.",
	attributes: /* @__PURE__ */ "accesskey.autocapitalize.autofocus.class.contenteditable.dir.draggable.enterkeyhint.hidden.id.inert.inputmode.is.itemid.itemprop.itemref.itemscope.itemtype.lang.nonce.part.popover.role.slot.spellcheck.style.tabindex.title.translate".split("."),
	wildcardPrefixes: ["data-", "aria-"]
}, l = ({ inAttributeName: e, inAllowedAttributes: t = [] }) => {
	let n = e, r = Array.isArray(t) ? t : [];
	return !n || typeof n != "string" ? !1 : c.attributes.includes(n) || c.wildcardPrefixes?.some((e) => n.startsWith(e)) ? !0 : r.includes(n);
}, u = ({ inAttributes: e, inAllowedAttributes: t, inTagName: n, inShowLog: r = !1 }) => {
	let i = e, a = t, o = n, s = r;
	if (!i || typeof i != "object") return {};
	let c = {}, u = [];
	return Object.entries(i).forEach(([e, t]) => {
		l({
			inAttributeName: e,
			inAllowedAttributes: a
		}) ? c[e] = t : u.push(e);
	}), u.length > 0 && s && console.warn(`[json-to-dom] Discarded invalid attributes for <${o}>:`, u), c;
}, d = ({ inElement: e, inAttributes: t, inAllowedAttributes: n, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	if (!o) return a;
	let d = u({
		inAttributes: o,
		inAllowedAttributes: s,
		inTagName: c,
		inShowLog: l
	});
	return Object.entries(d).forEach(([e, t]) => {
		e === "class" ? a.className = t : typeof t == "boolean" ? t ? a.setAttribute(e, "") : a.removeAttribute(e) : a.setAttribute(e, t);
	}), a;
}, f = ({ inElement: e, inClassList: t }) => {
	let n = e, r = t;
	return r && n.classList.add(...r.split(/\s+/).filter(Boolean)), n;
}, p = {
	title: "Allowed Event Controls and Event Types",
	description: "Permitted HTML interactive controls and their allowed event types.",
	controls: {
		button: [
			"click",
			"dblclick",
			"focus",
			"blur",
			"keydown",
			"keyup"
		],
		input: [
			"input",
			"change",
			"focus",
			"blur",
			"keydown",
			"keyup",
			"paste",
			"click"
		],
		checkbox: [
			"change",
			"click",
			"focus",
			"blur"
		],
		select: [
			"change",
			"focus",
			"blur"
		],
		textarea: [
			"input",
			"change",
			"focus",
			"blur",
			"keydown",
			"keyup",
			"paste"
		],
		form: ["submit", "reset"]
	}
}, m = ({ inTagName: e, inEventName: t }) => {
	let n = e?.toLowerCase(), r = t?.toLowerCase();
	if (!n || !r) return !1;
	let i = p.controls?.[n];
	return Array.isArray(i) ? i.includes(r) : !1;
}, h = (e) => {
	let t = e.currentTarget, n = t.dataset.closestTarget, r = n ? t.closest(`.${n}`) : null, i = r ? r.querySelector("input") : null;
	e.output = {
		name: i?.name,
		value: i?.value,
		input: i,
		closestElement: r
	};
}, g = ({ inElement: e, inEvents: t, inTagName: n, inShowLog: r = !1 }) => {
	let i = e, a = t, o = n, s = r;
	return o === "button" && i.addEventListener("click", h), !a || typeof a != "object" || Object.entries(a).forEach(([e, t]) => {
		m({
			inTagName: o,
			inEventName: e
		}) ? i.addEventListener(e, t) : s && console.warn(`[json-to-dom] Event "${e}" is not permitted on <${o}>; discarded.`);
	}), i;
}, _ = ({ inElement: e, inChildren: t, inAllowsChildren: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	return !Array.isArray(o) || o.length === 0 ? a : s ? (o.forEach((e) => {
		e instanceof Node && a.appendChild(e);
	}), a) : (l && console.warn(`[json-to-dom] children are not allowed on <${c}>; discarded ${o.length} child nodes`), a);
}, v = ({ inSpec: e, inTagDef: t, inClassList: n, inShowLog: r = !1 }) => {
	let i = e, c = t, l = n, u = r;
	if (!i || !i.tagName) return null;
	let p = a({ inTagName: i.tagName });
	return o({
		inElement: p,
		inTextContent: i.textContent,
		inAllowsTextContent: c?.allowsTextContent,
		inTagName: i.tagName,
		inShowLog: u
	}), s({
		inElement: p,
		inProperties: i.properties
	}), d({
		inElement: p,
		inAttributes: i.attributes,
		inAllowedAttributes: c?.allowedAttributes,
		inTagName: i.tagName,
		inShowLog: u
	}), f({
		inElement: p,
		inClassList: l
	}), g({
		inElement: p,
		inEvents: i.events,
		inTagName: i.tagName,
		inShowLog: u
	}), _({
		inElement: p,
		inChildren: i.children,
		inAllowsChildren: c?.allowsChildren,
		inTagName: i.tagName,
		inShowLog: u
	}), p;
}, y = ({ inChildren: e }) => {
	let t = e;
	return Array.isArray(t) ? t.map((e) => O(e)).flat().filter(Boolean) : [];
}, b = {
	div: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["title", "role"],
		childTags: []
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
			"required"
		]
	},
	label: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: ["for"],
		childTags: []
	},
	button: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [
			"type",
			"disabled",
			"name",
			"value"
		],
		childTags: []
	},
	table: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [
			"border",
			"cellpadding",
			"cellspacing"
		],
		childTags: [
			"caption",
			"colgroup",
			"thead",
			"tbody",
			"tfoot",
			"tr"
		]
	},
	thead: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["tr"]
	},
	tbody: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["tr"]
	},
	tfoot: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["tr"]
	},
	tr: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["td", "th"]
	},
	th: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [
			"scope",
			"colspan",
			"rowspan"
		],
		childTags: []
	},
	td: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: ["colspan", "rowspan"],
		childTags: []
	},
	datalist: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["option"]
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
}, x = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	return !!(t && t in b);
}, S = ({ inTagName: e }) => b[e?.toLowerCase()] || null, C = ({ inSpec: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	if (!n?.tagName || !x({ inTagName: n.tagName })) return r && console.warn(`[json-to-dom] Not a valid element: "${n?.tagName}"`, n), null;
	let i = S({ inTagName: n.tagName }), a = i?.allowsChildren ? y({ inChildren: n.children }) : [];
	return v({
		inSpec: {
			...n,
			children: a
		},
		inTagDef: i,
		inShowLog: r
	});
}, w = ({ inTagName: e, inSpec: t }) => {
	let n = (e || t?.tagName)?.toLowerCase();
	return n ? n in b ? {
		isValid: !0,
		tagName: n,
		definition: b[n],
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
}, T = [
	"tagName",
	"textContent",
	"attributes",
	"classList",
	"events",
	"children",
	"properties"
], E = ({ inSpec: e }) => {
	let t = e, n = [], r = [], i = [], a = [], o = [];
	if (!t || typeof t != "object" || Array.isArray(t)) return {
		isValid: !1,
		tagName: null,
		errors: ["Specification must be a non-null object"],
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a,
		invalidEvents: o
	};
	Object.keys(t).forEach((e) => {
		T.includes(e) || (i.push(e), r.push(`Unknown top-level key "${e}" in specification`));
	});
	let s = t.tagName?.toLowerCase();
	if (!s) return n.push("Missing required \"tagName\" property"), {
		isValid: !1,
		tagName: null,
		errors: n,
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a,
		invalidEvents: o
	};
	let c = b[s];
	if (!c) return n.push(`Tag <${s}> is not recognized in tags.json`), {
		isValid: !1,
		tagName: s,
		errors: n,
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a,
		invalidEvents: o
	};
	if (t.textContent && !c.allowsTextContent && n.push(`Tag <${s}> does not allow textContent (allowsTextContent: false)`), Array.isArray(t.children) && t.children.length > 0 && !c.allowsChildren && n.push(`Tag <${s}> is a void element and does not allow children (allowsChildren: false)`), t.attributes && typeof t.attributes == "object") {
		let e = Array.isArray(c.allowedAttributes) ? c.allowedAttributes : [];
		Object.keys(t.attributes).forEach((t) => {
			l({
				inAttributeName: t,
				inAllowedAttributes: e
			}) || (a.push(t), n.push(`Attribute "${t}" is not allowed on <${s}>`));
		});
	}
	return t.events && typeof t.events == "object" && Object.keys(t.events).forEach((e) => {
		m({
			inTagName: s,
			inEventName: e
		}) || (o.push(e), r.push(`Event "${e}" is not permitted on <${s}>`));
	}), {
		isValid: n.length === 0,
		tagName: s,
		errors: n,
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a,
		invalidEvents: o
	};
}, D = "v9", O = (a) => {
	let o = a && typeof a == "object" && "inSpec" in a && !(a instanceof Node) && !Array.isArray(a) ? a.inSpec : a, s = !!window?.ks?.showLog;
	return e({ inSpec: o }) ? null : t({ inSpec: o }) ? o : n({ inSpec: o }) ? i({ inSpec: o }) : r({ inSpec: o }) ? C({
		inSpec: o,
		inShowLog: s
	}) : null;
};
window.ks ??= {}, window.ks.showLog = !0, window.ks["json-to-dom"] = {
	version: "v9",
	buildSpecElement: O,
	tags: b,
	globalAllowedAttributes: c,
	allowedEvents: p,
	validateTag: w,
	validateSpec: E,
	isAttributeAllowed: l,
	isEventAllowed: m
};
//#endregion
export { p as allowedEvents, O as buildSpecElement, O as default, c as globalAllowedAttributes, l as isAttributeAllowed, m as isEventAllowed, b as tags, E as validateSpec, w as validateTag, D as version };

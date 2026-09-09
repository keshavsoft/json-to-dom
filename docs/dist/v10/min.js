//#region src/v10/buildSpec/isNullOrUndefined.js
var e = ({ inSpec: e }) => e == null, t = ({ inSpec: e }) => typeof Node < "u" && e instanceof Node, n = ({ inSpec: e }) => {
	let t = e;
	return Array.isArray(t);
}, r = ({ inSpec: e }) => {
	let t = e;
	return typeof t == "object" && !!t && !Array.isArray(t);
}, i = ({ inSpec: e, inApplyEvents: t = !1, inShowLog: n = !1 }) => {
	let r = e, i = t, a = n;
	return Array.isArray(r) ? r.map((e) => P({
		inSpec: e,
		inApplyEvents: i,
		inShowLog: a
	})).flat().filter(Boolean) : [];
}, a = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	if (!t) return null;
	if (t === "checkbox") {
		let e = document.createElement("input");
		return e.type = "checkbox", e;
	}
	return document.createElement(t);
}, o = ({ inElement: e, inTextContent: t, inAllowsTextContent: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t;
	return !a || o == null ? a : n ? (a.textContent = o, a) : (i && console.warn(`[json-to-dom v10] textContent is not allowed on <${r}>; discarded "${o}"`), a);
}, s = ({ inElement: e, inProperties: t }) => {
	let n = e, r = t;
	return n && r && typeof r == "object" && Object.assign(n, r), n;
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
	}), u.length > 0 && s && console.warn(`[json-to-dom v10] Discarded invalid attributes for <${o}>:`, u), c;
}, d = ({ inElement: e, inAttributes: t, inAllowedAttributes: n, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	if (!a || !o || typeof o != "object") return a;
	let d = u({
		inAttributes: o,
		inAllowedAttributes: s,
		inTagName: c,
		inShowLog: l
	});
	return Object.entries(d).forEach(([e, t]) => {
		e === "class" ? a.className = t : typeof t == "boolean" ? t ? a.setAttribute(e, "") : a.removeAttribute(e) : t != null && a.setAttribute(e, String(t));
	}), a;
}, f = ({ inElement: e, inClassList: t }) => {
	let n = e, r = t;
	if (!n || !r) return n;
	let i = [];
	return typeof r == "string" ? i = r.split(/\s+/).filter(Boolean) : Array.isArray(r) && (i = r.filter((e) => typeof e == "string" && e.trim().length > 0)), i.length > 0 && n.classList.add(...i), n;
}, p = ({ inElement: e, inChildren: t, inAllowsChildren: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	return !a || !Array.isArray(o) || o.length === 0 ? a : s ? (o.forEach((e) => {
		typeof Node < "u" && e instanceof Node ? a.appendChild(e) : (typeof e == "string" || typeof e == "number") && a.appendChild(document.createTextNode(String(e)));
	}), a) : (l && console.warn(`[json-to-dom v10] Children are not allowed on void tag <${c}>; discarded ${o.length} child nodes.`), a);
}, m = {
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
}, h = ({ inTagName: e, inEventName: t }) => {
	let n = e?.toLowerCase(), r = t?.toLowerCase();
	if (!n || !r) return !1;
	let i = m.controls?.[n];
	return Array.isArray(i) ? i.includes(r) : !1;
}, g = ({ inTargetElement: e }) => {
	let t = e;
	if (!t) return null;
	let n = t.dataset?.closestTarget;
	return n ? t.closest(`.${n}`) : null;
}, _ = ({ inTargetElement: e, inClosestElement: t }) => {
	let n = e, r = t;
	if (!n || !r) return;
	let i = n.dataset;
	if (i?.highlight === "true" && i?.highlightClass) {
		let e = i.highlightClass.split(" ").filter(Boolean);
		e.length > 0 && r.classList.add(...e);
	}
}, v = ({ inClosestElement: e }) => {
	let t = e;
	if (!t) return {
		name: void 0,
		value: void 0,
		input: null,
		closestElement: null
	};
	let n = t.querySelector("input");
	return {
		name: n?.name,
		value: n?.value,
		input: n,
		closestElement: t
	};
}, y = ({ inEvent: e }) => {
	let t = e;
	if (!t) return;
	let n = t.currentTarget;
	if (!n) return;
	let r = g({ inTargetElement: n });
	_({
		inTargetElement: n,
		inClosestElement: r
	}), t.output = v({ inClosestElement: r });
}, b = ({ inElement: e, inTagName: t }) => {
	let n = e, r = t?.toLowerCase();
	return n && (r === "button" && n.addEventListener("click", (e) => {
		y({ inEvent: e });
	}), n);
}, x = ({ inElement: e, inEvents: t, inTagName: n, inShowLog: r = !1 }) => {
	let i = e, a = t, o = n?.toLowerCase(), s = r;
	return !i || !a || typeof a != "object" || Object.entries(a).forEach(([e, t]) => {
		typeof t == "function" && (h({
			inTagName: o,
			inEventName: e
		}) ? i.addEventListener(e, t) : s && console.warn(`[json-to-dom v10] Event "${e}" is not permitted on <${o}>; discarded.`));
	}), i;
}, S = ({ inElement: e, inEvents: t, inTagName: n, inAttachInternal: r = !0, inShowLog: i = !1 } = {}) => {
	let a = e, o = t, s = n, c = r, l = i;
	return !a || !s ? a : (c && b({
		inElement: a,
		inTagName: s
	}), o && typeof o == "object" && x({
		inElement: a,
		inEvents: o,
		inTagName: s,
		inShowLog: l
	}), a);
}, C = ({ inSpec: e, inTagDef: t, inClassList: n, inApplyEvents: r = !1, inShowLog: i = !1 }) => {
	let c = e, l = t, u = n || c?.classList, m = r, h = i;
	if (!c || !c.tagName) return null;
	let g = a({ inTagName: c.tagName });
	return g ? (o({
		inElement: g,
		inTextContent: c.textContent,
		inAllowsTextContent: l?.allowsTextContent,
		inTagName: c.tagName,
		inShowLog: h
	}), s({
		inElement: g,
		inProperties: c.properties
	}), d({
		inElement: g,
		inAttributes: c.attributes,
		inAllowedAttributes: l?.allowedAttributes,
		inTagName: c.tagName,
		inShowLog: h
	}), f({
		inElement: g,
		inClassList: u
	}), p({
		inElement: g,
		inChildren: c.children,
		inAllowsChildren: l?.allowsChildren,
		inTagName: c.tagName,
		inShowLog: h
	}), m && (typeof m == "function" ? m : S)({
		inElement: g,
		inEvents: c.events,
		inTagName: c.tagName,
		inShowLog: h
	}), g) : null;
}, w = ({ inChildren: e, inApplyEvents: t = !1, inShowLog: n = !1 }) => {
	let r = e, i = t, a = n;
	return Array.isArray(r) ? r.map((e) => typeof e == "string" || typeof e == "number" ? typeof document < "u" ? document.createTextNode(String(e)) : String(e) : P({
		inSpec: e,
		inApplyEvents: i,
		inShowLog: a
	})).flat().filter(Boolean) : [];
}, T = {
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
}, E = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	return !!(t && t in T);
}, D = ({ inTagName: e }) => T[e?.toLowerCase()] || null, O = ({ inSpec: e, inApplyEvents: t = !1, inShowLog: n = !1 }) => {
	let r = e, i = t, a = n;
	if (!r?.tagName || !E({ inTagName: r.tagName })) return a && console.warn(`[json-to-dom v10] Not a valid element: "${r?.tagName}"`, r), null;
	let o = D({ inTagName: r.tagName }), s = o?.allowsChildren ? w({
		inChildren: r.children,
		inApplyEvents: i,
		inShowLog: a
	}) : [];
	return C({
		inSpec: {
			...r,
			children: s
		},
		inTagDef: o,
		inApplyEvents: i,
		inShowLog: a
	});
}, k = ({ inTagName: e, inSpec: t }) => {
	let n = (e || t?.tagName)?.toLowerCase();
	return n ? n in T ? {
		isValid: !0,
		tagName: n,
		definition: T[n],
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
}, A = h, j = [
	"tagName",
	"textContent",
	"attributes",
	"classList",
	"events",
	"children",
	"properties"
], M = ({ inSpec: e }) => {
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
		j.includes(e) || (i.push(e), r.push(`Unknown top-level key "${e}" in specification`));
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
	let c = T[s];
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
		A({
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
}, N = "v10.0", P = (a) => {
	let o = a, s = !1, c = !1;
	return a && typeof a == "object" && !Array.isArray(a) && !(typeof Node < "u" && a instanceof Node) && "inSpec" in a && (o = a.inSpec, s = !!a.inApplyEvents, c = !!a.inShowLog), typeof globalThis < "u" && globalThis?.ks?.showLog && (c = !0), e({ inSpec: o }) ? null : t({ inSpec: o }) ? o : n({ inSpec: o }) ? i({
		inSpec: o,
		inApplyEvents: s,
		inShowLog: c
	}) : r({ inSpec: o }) ? O({
		inSpec: o,
		inApplyEvents: s,
		inShowLog: c
	}) : null;
}, F = ({ inSpec: e, inShowLog: t = !1 } = {}) => P({
	inSpec: e,
	inApplyEvents: !0,
	inShowLog: t
});
typeof globalThis < "u" && (globalThis.ks ??= {}, globalThis.ks["json-to-dom"] = {
	version: N,
	buildSpecElement: P,
	buildSpecElementWithEvents: F,
	applyEvents: S,
	tags: T,
	globalAllowedAttributes: c,
	allowedEvents: m,
	validateTag: k,
	validateSpec: M,
	isAttributeAllowed: l,
	isEventAllowed: A
});
//#endregion
export { m as allowedEvents, S as applyEvents, P as buildSpecElement, P as default, F as buildSpecElementWithEvents, c as globalAllowedAttributes, l as isAttributeAllowed, A as isEventAllowed, T as tags, M as validateSpec, k as validateTag, N as version };

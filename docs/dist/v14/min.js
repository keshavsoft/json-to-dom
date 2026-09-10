//#region src/v14/meta.js
var e = { version: "v14.0" }, t = ({ inArgs: e } = {}) => {
	let t = e, n = t, r = !0, i = !1;
	return t && typeof t == "object" && !Array.isArray(t) && !(typeof Node < "u" && t instanceof Node) && "inSpec" in t && (n = t.inSpec, i = !!t.inShowLog, r = t.inApplyEvents === !1 ? !1 : typeof t.inApplyEvents == "object" && t.inApplyEvents !== null ? {
		internal: t.inApplyEvents.internal !== !1,
		declared: t.inApplyEvents.declared !== !1
	} : !0, t.inAttachInternal === !1 && (r = typeof r == "object" ? {
		...r,
		internal: !1
	} : {
		internal: !1,
		declared: !0
	})), typeof globalThis < "u" && globalThis?.ks?.showLog && (i = !0), {
		spec: n,
		applyEvents: r,
		showLog: i
	};
}, n = ({ inSpec: e }) => e == null, r = ({ inSpec: e }) => typeof Node < "u" && e instanceof Node, i = ({ inSpec: e }) => {
	let t = e;
	return Array.isArray(t);
}, a = ({ inSpec: e }) => {
	let t = e;
	return typeof t == "object" && !!t && !Array.isArray(t);
}, o = ({ inSpec: e, inApplyEvents: t = !0, inShowLog: n = !1 }) => {
	let r = e, i = t, a = n;
	return Array.isArray(r) ? r.map((e) => I({
		inSpec: e,
		inApplyEvents: i,
		inShowLog: a
	})).flat().filter(Boolean) : [];
}, s = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	if (!t) return null;
	if (t === "checkbox") {
		let e = document.createElement("input");
		return e.type = "checkbox", e;
	}
	return document.createElement(t);
}, c = ({ inElement: e, inTextContent: t, inAllowsTextContent: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t;
	return !a || o == null ? a : n ? (a.textContent = o, a) : (i && console.warn(`[json-to-dom v11] textContent is not allowed on <${r}>; discarded "${o}"`), a);
}, l = ({ inElement: e, inProperties: t }) => {
	let n = e, r = t;
	return n && r && typeof r == "object" && Object.assign(n, r), n;
}, u = {
	title: "HTML Global Allowed Attributes",
	description: "Standard W3C/WHATWG Global Attributes permitted on all HTML elements.",
	attributes: /* @__PURE__ */ "accesskey.autocapitalize.autofocus.class.contenteditable.dir.draggable.enterkeyhint.hidden.id.inert.inputmode.is.itemid.itemprop.itemref.itemscope.itemtype.lang.nonce.part.popover.role.slot.spellcheck.style.tabindex.title.translate".split("."),
	wildcardPrefixes: ["data-", "aria-"]
}, d = ({ inAttributeName: e, inAllowedAttributes: t = [] }) => {
	let n = e, r = Array.isArray(t) ? t : [];
	return !n || typeof n != "string" ? !1 : u.attributes.includes(n) || u.wildcardPrefixes?.some((e) => n.startsWith(e)) ? !0 : r.includes(n);
}, f = ({ inAttributes: e, inAllowedAttributes: t, inTagName: n, inShowLog: r = !1 }) => {
	let i = e, a = t, o = n, s = r;
	if (!i || typeof i != "object") return {};
	let c = {}, l = [];
	return Object.entries(i).forEach(([e, t]) => {
		d({
			inAttributeName: e,
			inAllowedAttributes: a
		}) ? c[e] = t : l.push(e);
	}), l.length > 0 && s && console.warn(`[json-to-dom v11] Discarded invalid attributes for <${o}>:`, l), c;
}, p = ({ inElement: e, inAttributes: t, inAllowedAttributes: n, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	if (!a || !o || typeof o != "object") return a;
	let u = f({
		inAttributes: o,
		inAllowedAttributes: s,
		inTagName: c,
		inShowLog: l
	});
	return Object.entries(u).forEach(([e, t]) => {
		e === "class" ? a.className = t : typeof t == "boolean" ? t ? a.setAttribute(e, "") : a.removeAttribute(e) : t != null && a.setAttribute(e, String(t));
	}), a;
}, m = ({ inElement: e, inClassList: t }) => {
	let n = e, r = t;
	if (!n || !r) return n;
	let i = [];
	return typeof r == "string" ? i = r.split(/\s+/).filter(Boolean) : Array.isArray(r) && (i = r.filter((e) => typeof e == "string" && e.trim().length > 0)), i.length > 0 && n.classList.add(...i), n;
}, h = ({ inElement: e, inChildren: t, inAllowsChildren: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	return !a || !Array.isArray(o) || o.length === 0 ? a : s ? (o.forEach((e) => {
		typeof Node < "u" && e instanceof Node ? a.appendChild(e) : (typeof e == "string" || typeof e == "number") && a.appendChild(document.createTextNode(String(e)));
	}), a) : (l && console.warn(`[json-to-dom v11] Children are not allowed on void tag <${c}>; discarded ${o.length} child nodes.`), a);
}, g = {
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
}, _ = ({ inTagName: e, inEventName: t }) => {
	let n = e?.toLowerCase(), r = t?.toLowerCase();
	if (!n || !r) return !1;
	let i = g.controls?.[n];
	return Array.isArray(i) ? i.includes(r) : !1;
}, ee = ({ inTargetElement: e }) => {
	let t = e;
	if (!t) return null;
	let n = t.dataset?.closestTarget;
	return n ? t.closest(`.${n}`) : null;
}, v = ({ inTargetElement: e, inClosestElement: t }) => {
	let n = e, r = t;
	if (!n || !r) return;
	let i = n.dataset;
	if (i?.highlight === "true" && i?.highlightClass) {
		let e = i.highlightClass.split(" ").filter(Boolean);
		e.length > 0 && r.classList.add(...e);
	}
}, y = ({ inClosestElement: e }) => {
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
}, b = ({ inEvent: e }) => {
	let t = e;
	if (!t) return;
	let n = t.currentTarget;
	if (!n) return;
	let r = ee({ inTargetElement: n });
	v({
		inTargetElement: n,
		inClosestElement: r
	}), t.output = y({ inClosestElement: r });
}, x = ({ inElement: e, inTagName: t, inShowLog: n = !1 } = {}) => {
	let r = e, i = t?.toLowerCase(), a = n;
	return r && (i === "button" && (r.addEventListener("click", (e) => {
		b({ inEvent: e });
	}), r.__ksEvents ??= {
		internal: [],
		declared: []
	}, r.__ksEvents.internal.push("click"), a && console.log(`[json-to-dom v11] Hooked internal interaction on <${i}>`, r)), r);
}, S = ({ inElement: e, inEvents: t, inTagName: n, inShowLog: r = !1 } = {}) => {
	let i = e, a = t, o = n?.toLowerCase(), s = r;
	return !i || !a || typeof a != "object" ? i : (i.__ksEvents ??= {
		internal: [],
		declared: []
	}, Object.entries(a).forEach(([e, t]) => {
		typeof t == "function" && (_({
			inTagName: o,
			inEventName: e
		}) ? (i.addEventListener(e, t), i.__ksEvents.declared.push(e), s && console.log(`[json-to-dom v11] Hooked declared event "${e}" on <${o}>`, i)) : s && console.warn(`[json-to-dom v11] Event "${e}" is not permitted on <${o}>; discarded.`));
	}), i);
}, C = ({ inElement: e } = {}) => {
	let t = e;
	return t && t.__ksEvents || {
		internal: [],
		declared: []
	};
}, w = ({ inElement: e, inEvents: t, inTagName: n, inAttachInternal: r = !0, inAttachDeclared: i = !0, inShowLog: a = !1 } = {}) => {
	let o = e, s = t, c = n, l = r, u = i, d = a;
	return !o || !c ? o : (l && x({
		inElement: o,
		inTagName: c,
		inShowLog: d
	}), u && s && typeof s == "object" && S({
		inElement: o,
		inEvents: s,
		inTagName: c,
		inShowLog: d
	}), o);
}, T = ({ inElement: e, inSpec: t, inApplyEvents: n = !0, inShowLog: r = !1 } = {}) => {
	let i = e, a = t, o = n, s = r;
	if (!i || !a || !o) return i;
	let c = typeof o == "function" ? o : w, l = typeof o == "object" ? o.internal !== !1 : !!o, u = typeof o == "object" ? o.declared !== !1 : !!o;
	return c({
		inElement: i,
		inEvents: u ? a.events : null,
		inTagName: a.tagName,
		inAttachInternal: l && a.attachInternal !== !1,
		inAttachDeclared: u,
		inShowLog: s
	}), i;
}, E = ({ inSpec: e, inTagDef: t, inClassList: n, inApplyEvents: r = !0, inShowLog: i = !1 }) => {
	let a = e, o = t, u = n || a?.classList, d = r, f = i;
	if (!a || !a.tagName) return null;
	let g = s({ inTagName: a.tagName });
	return g ? (c({
		inElement: g,
		inTextContent: a.textContent,
		inAllowsTextContent: o?.allowsTextContent,
		inTagName: a.tagName,
		inShowLog: f
	}), l({
		inElement: g,
		inProperties: a.properties
	}), p({
		inElement: g,
		inAttributes: a.attributes,
		inAllowedAttributes: o?.allowedAttributes,
		inTagName: a.tagName,
		inShowLog: f
	}), m({
		inElement: g,
		inClassList: u
	}), h({
		inElement: g,
		inChildren: a.children,
		inAllowsChildren: o?.allowsChildren,
		inTagName: a.tagName,
		inShowLog: f
	}), T({
		inElement: g,
		inSpec: a,
		inApplyEvents: d,
		inShowLog: f
	}), g) : null;
}, D = ({ inChildren: e, inApplyEvents: t = !0, inShowLog: n = !1 }) => {
	let r = e, i = t, a = n;
	return Array.isArray(r) ? r.map((e) => typeof e == "string" || typeof e == "number" ? typeof document < "u" ? document.createTextNode(String(e)) : String(e) : I({
		inSpec: e,
		inApplyEvents: i,
		inShowLog: a
	})).flat().filter(Boolean) : [];
}, O = {
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
	form: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [
			"action",
			"method",
			"autocomplete",
			"enctype",
			"name",
			"novalidate",
			"target"
		],
		childTags: []
	},
	select: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [
			"name",
			"disabled",
			"required",
			"multiple",
			"size"
		],
		childTags: ["option"]
	},
	p: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: []
	},
	h2: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [],
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
}, te = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	return !!(t && t in O);
}, ne = ({ inTagName: e }) => O[e?.toLowerCase()] || null, re = ({ inSpec: e, inApplyEvents: t = !0, inShowLog: n = !1 }) => {
	let r = e, i = t, a = n;
	if (!r?.tagName || !te({ inTagName: r.tagName })) return a && console.warn(`[json-to-dom v11] Not a valid element: "${r?.tagName}"`, r), null;
	let o = ne({ inTagName: r.tagName }), s = o?.allowsChildren ? D({
		inChildren: r.children,
		inApplyEvents: i,
		inShowLog: a
	}) : [];
	return E({
		inSpec: {
			...r,
			children: s
		},
		inTagDef: o,
		inApplyEvents: i,
		inShowLog: a
	});
}, k = ({ inSpec: e, inApplyEvents: t = !0, inShowLog: s = !1 } = {}) => {
	let c = e, l = t, u = s;
	return n({ inSpec: c }) ? null : r({ inSpec: c }) ? c : i({ inSpec: c }) ? o({
		inSpec: c,
		inApplyEvents: l,
		inShowLog: u
	}) : a({ inSpec: c }) ? re({
		inSpec: c,
		inApplyEvents: l,
		inShowLog: u
	}) : null;
}, A = ({ inTagName: e, inSpec: t }) => {
	let n = (e || t?.tagName)?.toLowerCase();
	return n ? n in O ? {
		isValid: !0,
		tagName: n,
		definition: O[n],
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
}, j = _, M = [
	"tagName",
	"textContent",
	"attributes",
	"classList",
	"events",
	"children",
	"properties"
], N = {
	validateTag: A,
	validateSpec: ({ inSpec: e }) => {
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
			M.includes(e) || (i.push(e), r.push(`Unknown top-level key "${e}" in specification`));
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
		let c = O[s];
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
				d({
					inAttributeName: t,
					inAllowedAttributes: e
				}) || (a.push(t), n.push(`Attribute "${t}" is not allowed on <${s}>`));
			});
		}
		return t.events && typeof t.events == "object" && Object.keys(t.events).forEach((e) => {
			j({
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
	},
	isAttributeAllowed: d,
	isEventAllowed: j
}, P = {
	tags: O,
	globalAllowedAttributes: u,
	allowedEvents: g
}, F = {
	...N,
	...P
}, I = (e) => {
	let { spec: n, applyEvents: r, showLog: i } = t({ inArgs: e });
	return k({
		inSpec: n,
		inApplyEvents: r,
		inShowLog: i
	});
}, L = ({ spec: e, domIdToPushTo: t, showLog: n = !1 }) => {
	let r = k({
		inSpec: e,
		inShowLog: n
	}), i = document.getElementById(t), a = I({ inSpec: r });
	Array.isArray(a) ? i.append(...a) : a && i.appendChild(a);
}, R = ({ inSpec: e, inShowLog: t = !1 } = {}) => I({
	inSpec: e,
	inApplyEvents: !0,
	inShowLog: t
}), z = {
	meta: e,
	core: {
		buildSpecElement: I,
		buildSpecElementWithEvents: R,
		specToDom: L
	},
	events: {
		applyEvents: w,
		getHookedEvents: C
	},
	validate: N,
	data: P,
	blues: F
}, B = ({ inApi: e } = {}) => {
	let t = e;
	typeof globalThis > "u" || !t || (globalThis.ks ??= {}, globalThis.ks["json-to-dom"] = t);
}, V = ({ inText: e, inCollapseWhitespace: t = !0 } = {}) => {
	let n = e, r = t;
	if (n == null) return null;
	let i = String(n);
	if (r === !1) return i.length > 0 ? i : null;
	let a = i.replace(/\s+/g, " ").trim();
	return a.length > 0 ? a : null;
}, H = /* @__PURE__ */ new Set([
	"checked",
	"selected",
	"disabled",
	"readonly",
	"required",
	"multiple",
	"autofocus",
	"hidden",
	"novalidate"
]), U = ({ inAttributeName: e, inAllowedAttributes: t = [] } = {}) => {
	let n = e?.toLowerCase(), r = Array.isArray(t) ? t : [];
	return n ? u.attributes.includes(n) || u.wildcardPrefixes?.some((e) => n.startsWith(e)) ? !0 : r.includes(n) : !1;
}, W = ({ inElement: e, inAllowedAttributes: t = [] } = {}) => {
	let n = e, r = t;
	return n?.attributes ? Array.from(n.attributes).reduce((e, t) => {
		let n = t?.name?.toLowerCase();
		return U({
			inAttributeName: n,
			inAllowedAttributes: r
		}) ? H.has(n) ? (e[n] = !0, e) : (e[n] = t.value ?? "", e) : e;
	}, {}) : {};
}, G = 1, K = 3, q = 8, J = 11, Y = ({ inNode: e, inCollapseWhitespace: t = !0 } = {}) => {
	let n = e, r = t;
	if (!n || n.nodeType === q) return null;
	if (n.nodeType === K) return V({
		inText: n.textContent,
		inCollapseWhitespace: r
	});
	if (n.nodeType === J) return Array.from(n.childNodes || []).map((e) => Y({
		inNode: e,
		inCollapseWhitespace: r
	})).filter((e) => e !== null);
	if (n.nodeType !== G) return null;
	let i = n.tagName?.toLowerCase();
	if (!i) return null;
	let a = O[i] || null, o = !a || a.allowsTextContent !== !1, s = !a || a.allowsChildren !== !1, c = { tagName: i }, l = W({
		inElement: n,
		inAllowedAttributes: a?.allowedAttributes
	});
	if (Object.keys(l).length > 0 && (c.attributes = l), i === "textarea") {
		let e = V({
			inText: "value" in n ? n.value : n.textContent,
			inCollapseWhitespace: r
		});
		return e !== null && o && (c.textContent = e), c;
	}
	let u = Array.from(n.childNodes || []).map((e) => Y({
		inNode: e,
		inCollapseWhitespace: r
	})).filter((e) => e !== null);
	return u.length === 1 && typeof u[0] == "string" && o ? (c.textContent = u[0], c) : (u.length > 0 && s && (c.children = u), c);
}, X = ({ inNode: e, inCollapseWhitespace: t = !0 } = {}) => Y({
	inNode: e,
	inCollapseWhitespace: t
}), Z = ({ inDocument: e = document, inCollapseWhitespace: t = !0 } = {}) => {
	let n = e, r = t, i = n?.getElementById?.("start");
	return X({
		inNode: i,
		inCollapseWhitespace: r
	});
}, Q = {
	domToSpec: X,
	getStartSpec: Z
}, $ = {
	meta: e,
	jsonToDom: z,
	reverse: Q,
	core: z.core,
	events: z.events,
	validate: N,
	data: P
};
B({ inApi: {
	...$,
	blues: F,
	buildSpecElement: I,
	buildSpecElementWithEvents: R,
	specToDom: L,
	domToSpec: X,
	getStartSpec: Z,
	applyEvents: w,
	getHookedEvents: C
} });
var ie = I;
//#endregion
export { w as applyEvents, F as blues, I as buildSpecElement, R as buildSpecElementWithEvents, P as data, ie as default, X as domToSpec, C as getHookedEvents, Z as getStartSpec, z as jsonToDom, e as meta, Q as reverse, L as specToDom, $ as tree, N as validate };

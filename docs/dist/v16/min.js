//#region src/v16/meta.js
var e = { version: "v16.0" }, t = ({ inArgs: e } = {}) => {
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
	return Array.isArray(r) ? r.map((e) => z({
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
}, v = ({ inTargetElement: e }) => {
	let t = e;
	if (!t) return null;
	let n = t.dataset?.closestTarget;
	return n ? t.closest(`.${n}`) : null;
}, y = ({ inTargetElement: e, inClosestElement: t }) => {
	let n = e, r = t;
	if (!n || !r) return;
	let i = n.dataset;
	if (i?.highlight === "true" && i?.highlightClass) {
		let e = i.highlightClass.split(" ").filter(Boolean);
		e.length > 0 && r.classList.add(...e);
	}
}, b = ({ inClosestElement: e }) => {
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
}, x = ({ inEvent: e }) => {
	let t = e;
	if (!t) return;
	let n = t.currentTarget;
	if (!n) return;
	let r = v({ inTargetElement: n });
	y({
		inTargetElement: n,
		inClosestElement: r
	}), t.output = b({ inClosestElement: r });
}, S = ({ inElement: e, inTagName: t, inShowLog: n = !1 } = {}) => {
	let r = e, i = t?.toLowerCase(), a = n;
	return r && (i === "button" && (r.addEventListener("click", (e) => {
		x({ inEvent: e });
	}), r.__ksEvents ??= {
		internal: [],
		declared: []
	}, r.__ksEvents.internal.push("click"), a && console.log(`[json-to-dom v11] Hooked internal interaction on <${i}>`, r)), r);
}, C = ({ inElement: e, inEvents: t, inTagName: n, inShowLog: r = !1 } = {}) => {
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
}, w = ({ inElement: e } = {}) => {
	let t = e;
	return t && t.__ksEvents || {
		internal: [],
		declared: []
	};
}, T = ({ inElement: e, inEvents: t, inTagName: n, inAttachInternal: r = !0, inAttachDeclared: i = !0, inShowLog: a = !1 } = {}) => {
	let o = e, s = t, c = n, l = r, u = i, d = a;
	return !o || !c ? o : (l && S({
		inElement: o,
		inTagName: c,
		inShowLog: d
	}), u && s && typeof s == "object" && C({
		inElement: o,
		inEvents: s,
		inTagName: c,
		inShowLog: d
	}), o);
}, E = ({ inElement: e, inSpec: t, inApplyEvents: n = !0, inShowLog: r = !1 } = {}) => {
	let i = e, a = t, o = n, s = r;
	if (!i || !a || !o) return i;
	let c = typeof o == "function" ? o : T, l = typeof o == "object" ? o.internal !== !1 : !!o, u = typeof o == "object" ? o.declared !== !1 : !!o;
	return c({
		inElement: i,
		inEvents: u ? a.events : null,
		inTagName: a.tagName,
		inAttachInternal: l && a.attachInternal !== !1,
		inAttachDeclared: u,
		inShowLog: s
	}), i;
}, D = ({ inSpec: e, inTagDef: t, inClassList: n, inApplyEvents: r = !0, inShowLog: i = !1 }) => {
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
	}), E({
		inElement: g,
		inSpec: a,
		inApplyEvents: d,
		inShowLog: f
	}), g) : null;
}, O = ({ inChildren: e, inApplyEvents: t = !0, inShowLog: n = !1 }) => {
	let r = e, i = t, a = n;
	return Array.isArray(r) ? r.map((e) => typeof e == "string" || typeof e == "number" ? typeof document < "u" ? document.createTextNode(String(e)) : String(e) : z({
		inSpec: e,
		inApplyEvents: i,
		inShowLog: a
	})).flat().filter(Boolean) : [];
}, k = {
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
	h1: {
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
	span: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: []
	},
	img: {
		allowsTextContent: !1,
		allowsChildren: !1,
		allowedAttributes: [
			"src",
			"alt",
			"width",
			"height",
			"loading"
		]
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
}, A = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	return !!(t && t in k);
}, j = ({ inTagName: e }) => k[e?.toLowerCase()] || null, M = ({ inSpec: e, inApplyEvents: t = !0, inShowLog: n = !1 }) => {
	let r = e, i = t, a = n;
	if (!r?.tagName || !A({ inTagName: r.tagName })) return a && console.warn(`[json-to-dom v11] Not a valid element: "${r?.tagName}"`, r), null;
	let o = j({ inTagName: r.tagName }), s = o?.allowsChildren ? O({
		inChildren: r.children,
		inApplyEvents: i,
		inShowLog: a
	}) : [];
	return D({
		inSpec: {
			...r,
			children: s
		},
		inTagDef: o,
		inApplyEvents: i,
		inShowLog: a
	});
}, N = ({ inSpec: e, inApplyEvents: t = !0, inShowLog: s = !1 } = {}) => {
	let c = e, l = t, u = s;
	return n({ inSpec: c }) ? null : r({ inSpec: c }) ? c : i({ inSpec: c }) ? o({
		inSpec: c,
		inApplyEvents: l,
		inShowLog: u
	}) : a({ inSpec: c }) ? M({
		inSpec: c,
		inApplyEvents: l,
		inShowLog: u
	}) : null;
}, P = ({ inTagName: e, inSpec: t }) => {
	let n = (e || t?.tagName)?.toLowerCase();
	return n ? n in k ? {
		isValid: !0,
		tagName: n,
		definition: k[n],
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
}, F = _, I = [
	"tagName",
	"textContent",
	"attributes",
	"classList",
	"events",
	"children",
	"properties"
], L = {
	validateTag: P,
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
			I.includes(e) || (i.push(e), r.push(`Unknown top-level key "${e}" in specification`));
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
		let c = k[s];
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
			F({
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
	isEventAllowed: F
}, R = {
	tags: k,
	hybrid: { inlineInputRow: {
		tagName: "div",
		attributes: { class: "d-flex align-items-center gap-2 mb-3" },
		children: [{
			tagName: "label",
			textContent: "User Name",
			attributes: { class: "form-label mb-0 fw-semibold text-secondary" }
		}, {
			tagName: "input",
			attributes: {
				type: "text",
				name: "userName",
				placeholder: "Enter username...",
				class: "form-control"
			}
		}]
	} },
	globalAllowedAttributes: u,
	allowedEvents: g
}, z = (e) => {
	let { spec: n, applyEvents: r, showLog: i } = t({ inArgs: e });
	return N({
		inSpec: n,
		inApplyEvents: r,
		inShowLog: i
	});
}, B = ({ spec: e, domIdToPushTo: t, showLog: n = !1 } = {}) => {
	let r = e, i = t, a = N({
		inSpec: r,
		inShowLog: n
	}), o = document.getElementById(i), s = z({ inSpec: a });
	return o && s && (Array.isArray(s) ? o.append(...s) : o.appendChild(s)), s;
}, V = ({ inSpec: e, inShowLog: t = !1 } = {}) => z({
	inSpec: e,
	inApplyEvents: !0,
	inShowLog: t
}), H = {
	meta: e,
	core: {
		buildSpecElement: z,
		buildSpecElementWithEvents: V,
		specToDom: B
	},
	events: {
		applyEvents: T,
		getHookedEvents: w
	},
	validate: L,
	data: R
}, U = ({ inApi: e } = {}) => {
	let t = e;
	typeof globalThis > "u" || !t || (globalThis.ks ??= {}, globalThis.ks["json-to-dom"] = t);
}, W = {
	meta: e,
	jsonToDom: H,
	core: H.core,
	events: H.events,
	validate: L,
	data: R
};
U({ inApi: {
	...W,
	buildSpecElement: z,
	buildSpecElementWithEvents: V,
	specToDom: B,
	applyEvents: T,
	getHookedEvents: w
} });
var G = z;
//#endregion
export { T as applyEvents, z as buildSpecElement, V as buildSpecElementWithEvents, R as data, G as default, w as getHookedEvents, H as jsonToDom, e as meta, B as specToDom, W as tree, L as validate };

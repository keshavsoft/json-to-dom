//#region src/v27/meta.js
var e = {
	version: "v27.0",
	description: "Pure zero-overhead DOM engine with versioned validation and versioned event listener suites (v1 row actions, v2 form footer actions)"
}, t = ({ inArgs: e, inSpec: t, inShowLog: n } = {}) => {
	let r = e, i = t, a = n, o = i === void 0 ? r : i, s = !!a;
	return r && typeof r == "object" && !Array.isArray(r) && !(typeof Node < "u" && r instanceof Node) && ("inSpec" in r ? (o = r.inSpec, s = !!r.inShowLog) : "spec" in r && (o = r.spec, s = !!r.showLog)), typeof globalThis < "u" && globalThis?.ks?.showLog && (s = !0), {
		spec: o,
		showLog: s
	};
}, n = ({ inSpec: e }) => e == null, r = ({ inSpec: e }) => typeof Node < "u" && e instanceof Node, i = ({ inSpec: e }) => {
	let t = e;
	return Array.isArray(t);
}, a = ({ inSpec: e }) => {
	let t = e;
	return typeof t == "object" && !!t && !Array.isArray(t);
}, o = ({ inSpec: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	return Array.isArray(n) ? n.map((e) => g({
		inSpec: e,
		inShowLog: r
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
}, u = ({ inElement: e, inAttributes: t }) => {
	let n = e, r = t;
	return !n || !r || typeof r != "object" || Object.entries(r).forEach(([e, t]) => {
		e === "class" ? n.className = t : typeof t == "boolean" ? t ? n.setAttribute(e, "") : n.removeAttribute(e) : t != null && n.setAttribute(e, String(t));
	}), n;
}, d = ({ inElement: e, inClassList: t }) => {
	let n = e, r = t;
	if (!n || !r) return n;
	let i = [];
	return typeof r == "string" ? i = r.split(/\s+/).filter(Boolean) : Array.isArray(r) && (i = r.filter((e) => typeof e == "string" && e.trim().length > 0)), i.length > 0 && n.classList.add(...i), n;
}, f = ({ inElement: e, inChildren: t, inAllowsChildren: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	return !a || !Array.isArray(o) || o.length === 0 ? a : s ? (o.forEach((e) => {
		typeof Node < "u" && e instanceof Node ? a.appendChild(e) : (typeof e == "string" || typeof e == "number") && a.appendChild(document.createTextNode(String(e)));
	}), a) : (l && console.warn(`[json-to-dom v11] Children are not allowed on void tag <${c}>; discarded ${o.length} child nodes.`), a);
}, p = ({ inSpec: e, inClassList: t }) => {
	let n = e, r = t || n?.classList;
	if (!n || !n.tagName) return null;
	let i = s({ inTagName: n.tagName });
	return i ? (c({
		inElement: i,
		inTextContent: n.textContent,
		inTagName: n.tagName
	}), l({
		inElement: i,
		inProperties: n.properties
	}), u({
		inElement: i,
		inAttributes: n.attributes
	}), d({
		inElement: i,
		inClassList: r
	}), f({
		inElement: i,
		inChildren: n.children,
		inTagName: n.tagName
	}), i) : null;
}, m = ({ inChildren: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	return Array.isArray(n) ? n.map((e) => typeof e == "string" || typeof e == "number" ? typeof document < "u" ? document.createTextNode(String(e)) : String(e) : g({
		inSpec: e,
		inShowLog: r
	})).flat().filter(Boolean) : [];
}, h = ({ inSpec: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	if (!n?.tagName) return r && console.warn("[json-to-dom v23] Missing tagName on spec:", n), null;
	let i = Array.isArray(n.children) && n.children.length > 0 ? m({
		inChildren: n.children,
		inShowLog: r
	}) : [];
	return p({ inSpec: {
		...n,
		children: i
	} });
}, g = ({ inSpec: e, inShowLog: t = !1 } = {}) => {
	let s = e, c = t;
	return n({ inSpec: s }) ? null : r({ inSpec: s }) ? s : i({ inSpec: s }) ? o({
		inSpec: s,
		inShowLog: c
	}) : a({ inSpec: s }) ? h({
		inSpec: s,
		inShowLog: c
	}) : null;
}, _ = {
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
}, ee = ({ inTagName: e, inSpec: t }) => {
	let n = (e || t?.tagName)?.toLowerCase();
	return n ? n in _ ? {
		isValid: !0,
		tagName: n,
		definition: _[n],
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
}, v = {
	title: "HTML Global Allowed Attributes",
	description: "Standard W3C/WHATWG Global Attributes permitted on all HTML elements.",
	attributes: /* @__PURE__ */ "accesskey.autocapitalize.autofocus.class.contenteditable.dir.draggable.enterkeyhint.hidden.id.inert.inputmode.is.itemid.itemprop.itemref.itemscope.itemtype.lang.nonce.part.popover.role.slot.spellcheck.style.tabindex.title.translate".split("."),
	wildcardPrefixes: ["data-", "aria-"]
}, y = ({ inAttributeName: e, inAllowedAttributes: t = [] }) => {
	let n = e, r = Array.isArray(t) ? t : [];
	return !n || typeof n != "string" ? !1 : v.attributes.includes(n) || v.wildcardPrefixes?.some((e) => n.startsWith(e)) ? !0 : r.includes(n);
}, b = [
	"tagName",
	"textContent",
	"attributes",
	"classList",
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
	let o = typeof t.tagName == "string" ? t.tagName.toLowerCase().trim() : null;
	if (!o) return n.push("Missing or invalid 'tagName'"), {
		isValid: !1,
		tagName: null,
		errors: n,
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a
	};
	let s = _[o];
	if (!s) return n.push(`Unknown or unsupported HTML tag: <${o}>`), {
		isValid: !1,
		tagName: o,
		errors: n,
		warnings: r,
		unknownKeys: i,
		invalidAttributes: a
	};
	if (Object.keys(t).forEach((e) => {
		b.includes(e) || (i.push(e), r.push(`Unknown property key "${e}" will be ignored`));
	}), t.textContent !== void 0 && t.textContent !== null && !s.allowsTextContent && n.push(`Tag <${o}> does not allow direct textContent (allowsTextContent: false)`), Array.isArray(t.children) && t.children.length > 0 && !s.allowsChildren && n.push(`Tag <${o}> is a void element and does not allow children (allowsChildren: false)`), t.attributes && typeof t.attributes == "object") {
		let e = Array.isArray(s.allowedAttributes) ? s.allowedAttributes : [];
		Object.keys(t.attributes).forEach((t) => {
			y({
				inAttributeName: t,
				inAllowedAttributes: e
			}) || (a.push(t), n.push(`Attribute "${t}" is not allowed on <${o}>`));
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
}, S = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	return !!(t && t in _);
}, C = ({ inTagName: e }) => _[e?.toLowerCase()] || null, w = ({ inAttributes: e, inAllowedAttributes: t, inTagName: n, inShowLog: r = !1 }) => {
	let i = e, a = t, o = n, s = r;
	if (!i || typeof i != "object") return {};
	let c = {}, l = [];
	return Object.entries(i).forEach(([e, t]) => {
		y({
			inAttributeName: e,
			inAllowedAttributes: a
		}) ? c[e] = t : l.push(e);
	}), l.length > 0 && s && console.warn(`[json-to-dom v23] Discarded invalid attributes for <${o}>:`, l), c;
}, T = (e) => {
	let t = e;
	return x({ inSpec: t && typeof t == "object" && !Array.isArray(t) && ("spec" in t || "inSpec" in t) ? t.spec ?? t.inSpec : t });
};
T.validateSpec = x, T.validateTag = ee, T.isAttributeAllowed = y, T.isTagValid = S, T.getTagDefinition = C, T.filterAttributes = w;
//#endregion
//#region src/v27/validate/v2/rules/hierarchyRules.js
var E = {
	li: [
		"ul",
		"ol",
		"menu"
	],
	dt: ["dl"],
	dd: ["dl"],
	tr: [
		"table",
		"thead",
		"tbody",
		"tfoot"
	],
	th: ["tr"],
	td: ["tr"],
	thead: ["table"],
	tbody: ["table"],
	tfoot: ["table"],
	caption: ["table"],
	colgroup: ["table"],
	col: ["colgroup"],
	option: [
		"select",
		"optgroup",
		"datalist"
	],
	optgroup: ["select"],
	legend: ["fieldset"],
	summary: ["details"],
	source: [
		"video",
		"audio",
		"picture"
	],
	track: ["video", "audio"]
}, D = {
	a: ["a", "button"],
	button: [
		"button",
		"a",
		"input",
		"select",
		"textarea"
	]
}, O = ({ inTagName: e, inParentTag: t }) => {
	let n = e?.toLowerCase(), r = t?.toLowerCase(), i = [];
	if (n && E[n]) {
		let e = E[n];
		r && !e.includes(r) && i.push(`HTML Hierarchy Violation: <${n}> cannot be placed inside <${r}>. Required parent: [${e.join(", ")}].`);
	}
	return r && D[r] && D[r].includes(n) && i.push(`HTML Nesting Violation: Interactive element <${n}> cannot be nested inside <${r}>.`), {
		isValid: i.length === 0,
		errors: i
	};
}, k = [
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"source",
	"track",
	"wbr"
], A = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	return k.includes(t);
}, j = ({ inTagName: e, inSpec: t }) => {
	let n = e?.toLowerCase(), r = t, i = [];
	return A({ inTagName: n }) && (r?.textContent !== void 0 && r?.textContent !== null && r?.textContent !== "" && i.push(`Void Element Violation: <${n}> is a void tag and cannot have 'textContent'.`), Array.isArray(r?.children) && r.children.length > 0 && i.push(`Void Element Violation: <${n}> is a void tag and cannot have 'children'.`)), {
		isValid: i.length === 0,
		errors: i
	};
}, M = [
	"tagName",
	"textContent",
	"attributes",
	"classList",
	"children",
	"properties"
], N = ({ inAttributeName: e, inAllowedAttributes: t = [] }) => {
	let n = e, r = Array.isArray(t) ? t : [];
	return !n || typeof n != "string" ? !1 : v.attributes.includes(n) || v.wildcardPrefixes?.some((e) => n.startsWith(e)) ? !0 : r.includes(n);
}, P = ({ inSpec: e, inParentTag: t = null, inPath: n = "root" } = {}) => {
	let r = e, i = t, a = n, o = [], s = [], c = [], l = [], u = [];
	if (Array.isArray(r)) return r.forEach((e, t) => {
		let n = P({
			inSpec: e,
			inParentTag: i,
			inPath: `${a}[${t}]`
		});
		o.push(...n.errors), s.push(...n.warnings), c.push(...n.unknownKeys), l.push(...n.invalidAttributes), u.push(...n.hierarchyViolations);
	}), {
		isValid: o.length === 0,
		path: a,
		tagName: "array",
		errors: o,
		warnings: s,
		unknownKeys: c,
		invalidAttributes: l,
		hierarchyViolations: u
	};
	if (!r || typeof r != "object") return {
		isValid: !1,
		path: a,
		tagName: null,
		errors: [`[${a}] Specification must be a non-null object`],
		warnings: s,
		unknownKeys: c,
		invalidAttributes: l,
		hierarchyViolations: u
	};
	let d = typeof r.tagName == "string" ? r.tagName.toLowerCase().trim() : null;
	if (!d) return o.push(`[${a}] Missing or invalid 'tagName'`), {
		isValid: !1,
		path: a,
		tagName: null,
		errors: o,
		warnings: s,
		unknownKeys: c,
		invalidAttributes: l,
		hierarchyViolations: u
	};
	let f = `${a} > <${d}>`, p = _[d];
	if (!p) return o.push(`[${f}] Unknown or unsupported HTML tag: <${d}>`), {
		isValid: !1,
		path: f,
		tagName: d,
		errors: o,
		warnings: s,
		unknownKeys: c,
		invalidAttributes: l,
		hierarchyViolations: u
	};
	Object.keys(r).forEach((e) => {
		M.includes(e) || (c.push(e), s.push(`[${f}] Unknown spec property key "${e}" will be ignored`));
	});
	let m = j({
		inTagName: d,
		inSpec: r
	});
	if (m.isValid || m.errors.forEach((e) => o.push(`[${f}] ${e}`)), r.attributes && typeof r.attributes == "object") {
		let e = Array.isArray(p.allowedAttributes) ? p.allowedAttributes : [];
		Object.keys(r.attributes).forEach((t) => {
			N({
				inAttributeName: t,
				inAllowedAttributes: e
			}) || (l.push(t), o.push(`[${f}] Attribute "${t}" is not allowed on <${d}>`));
		});
	}
	let h = O({
		inTagName: d,
		inParentTag: i
	});
	return h.isValid || h.errors.forEach((e) => {
		o.push(`[${f}] ${e}`), u.push(e);
	}), Array.isArray(r.children) && r.children.forEach((e, t) => {
		if (e && typeof e == "object") {
			let n = P({
				inSpec: e,
				inParentTag: d,
				inPath: `${f}.children[${t}]`
			});
			o.push(...n.errors), s.push(...n.warnings), c.push(...n.unknownKeys), l.push(...n.invalidAttributes), u.push(...n.hierarchyViolations);
		}
	}), {
		isValid: o.length === 0,
		path: f,
		tagName: d,
		errors: o,
		warnings: s,
		unknownKeys: c,
		invalidAttributes: l,
		hierarchyViolations: u
	};
}, F = (e) => {
	let t = e;
	return P({ inSpec: t && typeof t == "object" && !Array.isArray(t) && ("spec" in t || "inSpec" in t) ? t.spec ?? t.inSpec : t });
};
F.validateSpec = P, F.checkHierarchy = O, F.checkVoidRules = j, F.isVoidTag = A, F.VOID_TAGS = k;
//#endregion
//#region src/v27/validate/index.js
var I = (e) => F(e);
I.v1 = T, I.v2 = F, I.validateSpec = F.validateSpec, I.checkHierarchy = F.checkHierarchy, I.checkVoidRules = F.checkVoidRules, I.isVoidTag = F.isVoidTag;
//#endregion
//#region src/v27/jsonToDom/index.js
var L = (e) => {
	let n = e, r = n && typeof n == "object" && !Array.isArray(n) && !(typeof Node < "u" && n instanceof Node) && ("spec" in n || "inSpec" in n || "outputType" in n || "inOutputType" in n || "validate" in n || "inValidate" in n || "debug" in n || "inDebug" in n), i = r ? n.spec ?? n.inSpec : n, a = r ? (n.outputType ?? n.inOutputType ?? "dom").toLowerCase() : "dom", o = r ? !!(n.showLog ?? n.inShowLog) : !1;
	if (r && (n.validate ?? n.inValidate ?? n.debug ?? n.inDebug) && i) {
		let e = I({ spec: i });
		e.isValid ? e.warnings && e.warnings.length > 0 && o && console.warn("[json-to-dom v25: validation warning]", e.warnings) : console.warn("[json-to-dom v25: validation error]", e.errors, e);
	}
	let { spec: s, showLog: c } = t({
		inSpec: i,
		inShowLog: o
	}), l = g({
		inSpec: s,
		inShowLog: c
	});
	return a === "html" ? l ? Array.isArray(l) ? l.map((e) => e.outerHTML).join("\n") : l.outerHTML : "" : l;
}, R = (e = {}) => {
	let t = e, n = t.spec ?? t.inSpec, r = t.domIdToPushTo ?? t.inDomIdToPushTo, i = !!(t.showLog ?? t.inShowLog), a = !!(t.validate ?? t.inValidate ?? t.debug ?? t.inDebug), o = typeof document < "u" && r ? document.getElementById(r) : null, s = L({
		spec: n,
		outputType: "dom",
		showLog: i,
		validate: a
	});
	return o && s && (Array.isArray(s) ? o.append(...s) : o.appendChild(s)), s;
}, z = (e = {}) => {
	let t = e;
	return L({
		spec: t && typeof t == "object" && !Array.isArray(t) && ("spec" in t || "inSpec" in t) ? t.spec ?? t.inSpec : t,
		outputType: "html",
		showLog: !!(t?.showLog ?? t?.inShowLog),
		validate: !!(t?.validate ?? t?.inValidate ?? t?.debug ?? t?.inDebug)
	});
}, B = {
	meta: e,
	core: {
		buildSpecElement: L,
		specToDom: R,
		specToHtml: z
	}
}, V = {
	tags: _,
	globalAllowedAttributes: v
}, H = ({ inElement: e }) => {
	let t = e;
	if (!t || typeof t.querySelectorAll != "function") return {};
	let n = t.querySelectorAll("input, select, textarea"), r = {};
	return n.forEach((e) => {
		let t = e.name || e.id;
		t && (e.type === "checkbox" ? r[t] = e.checked : e.type === "radio" ? e.checked && (r[t] = e.value) : r[t] = e.value);
	}), r;
}, U = ({ inTargetElement: e, inClosestElement: t, inContainerElement: n }) => {
	let r = e, i = t, a = n;
	if (!r || !i || r.dataset?.highlight !== "true") return;
	let o = r.dataset?.highlightClass ? r.dataset.highlightClass.split(/\s+/).filter(Boolean) : [
		"bg-primary-subtle",
		"border",
		"border-primary"
	];
	if (a && typeof a.querySelectorAll == "function") {
		let e = r.dataset?.closestTarget ? `.${r.dataset.closestTarget}` : ".ksrow", t = a.querySelectorAll("button[data-highlight-class]"), n = new Set(o);
		t.forEach((e) => {
			e.dataset?.highlightClass && e.dataset.highlightClass.split(/\s+/).filter(Boolean).forEach((e) => n.add(e));
		}), a.querySelectorAll(e).forEach((e) => {
			e !== i && e.classList.remove(...n);
		});
	}
	i.classList.add(...o);
}, W = (e = {}) => {
	let t = e, n = t.container || t.inContainer || (typeof document < "u" && (t.containerId || t.inContainerId) ? document.getElementById(t.containerId || t.inContainerId) : null), r = t.actions || t.inActions || {}, i = !!(t.showLog ?? t.inShowLog);
	if (!n) return i && console.warn("[json-to-dom listeners] bindActions: Container not found."), { remove: () => {} };
	let a = (e) => {
		let t = e.target?.closest?.("[data-action]");
		if (!t) return;
		let a = t.dataset.action, o = r[a], s = t.dataset.closestTarget || "ksrow", c = t.closest(`.${s}`) || t.parentElement;
		c && U({
			inTargetElement: t,
			inClosestElement: c,
			inContainerElement: n
		});
		let l = c ? H({ inElement: c }) : {};
		i && console.log(`[json-to-dom listeners] Action triggered: "${a}"`, {
			target: t,
			row: c,
			values: l
		}), typeof o == "function" ? o({
			event: e,
			target: t,
			row: c,
			values: l,
			container: n
		}) : i && console.warn(`[json-to-dom listeners] No handler registered for action "${a}".`);
	};
	return n.addEventListener("click", a), { remove: () => {
		n.removeEventListener("click", a);
	} };
}, G = {
	bindActions: W,
	bind: W,
	extractInputs: H,
	applyHighlight: U
}, K = (e = {}) => {
	let t = e, n = t.element || t.form || t.container || t.inElement || t.inForm || t.inContainer;
	if (!n || typeof n.querySelectorAll != "function") return {};
	let r = n.querySelectorAll("input, select, textarea"), i = {}, a = {};
	return r.forEach((e) => {
		if ((e.type || "").toLowerCase() === "checkbox") {
			let t = e.name || e.id;
			t && (a[t] = (a[t] || 0) + 1);
		}
	}), r.forEach((e) => {
		let t = e.name || e.id;
		if (!t) return;
		let n = (e.type || "").toLowerCase();
		if (n !== "button" && n !== "submit" && n !== "reset" && e.tagName !== "BUTTON") {
			if (n === "checkbox") a[t] > 1 ? (Array.isArray(i[t]) || (i[t] = []), e.checked && i[t].push(e.value)) : i[t] = e.checked;
			else if (n === "radio") e.checked ? i[t] = e.value : t in i || (i[t] = null);
			else if (e.tagName === "SELECT" && e.multiple) {
				let n = Array.from(e.selectedOptions || []).map((e) => e.value);
				i[t] = n;
			} else i[t] = e.value;
		}
	}), i;
}, q = (e = {}) => {
	let t = e, n = t.element || t.form || t.container || t.inElement || t.inForm || t.inContainer, r = t.defaultValues || t.inDefaultValues || {};
	return !n || typeof n.querySelectorAll != "function" ? { success: !1 } : n.tagName === "FORM" && typeof n.reset == "function" && Object.keys(r).length === 0 ? (n.reset(), { success: !0 }) : (n.querySelectorAll("input, select, textarea").forEach((e) => {
		let t = e.name || e.id, n = (e.type || "").toLowerCase();
		if (n === "button" || n === "submit" || n === "reset" || e.tagName === "BUTTON") return;
		let i = t && t in r ? r[t] : null;
		n === "checkbox" ? e.checked = i !== null && !!i : n === "radio" ? e.checked = i !== null && e.value === i : e.tagName === "SELECT" ? i === null ? e.options && e.options.length > 0 ? e.selectedIndex = 0 : e.value = "" : e.value = i : e.value = i === null ? "" : String(i);
	}), { success: !0 });
}, J = ({ inTargetElement: e, inClosestElement: t, inContainerElement: n }) => {
	let r = e, i = t, a = n;
	if (!r || !i || r.dataset?.highlight !== "true") return;
	let o = r.dataset?.highlightClass ? r.dataset.highlightClass.split(/\s+/).filter(Boolean) : [
		"bg-primary-subtle",
		"border",
		"border-primary"
	];
	if (a && typeof a.querySelectorAll == "function") {
		let e = r.dataset?.closestTarget ? `.${r.dataset.closestTarget}` : ".ksrow", t = a.querySelectorAll("button[data-highlight-class]"), n = new Set(o);
		t.forEach((e) => {
			e.dataset?.highlightClass && e.dataset.highlightClass.split(/\s+/).filter(Boolean).forEach((e) => n.add(e));
		}), a.querySelectorAll(e).forEach((e) => {
			e !== i && e.classList.remove(...n);
		});
	}
	i.classList.add(...o);
}, Y = (e = {}) => {
	let t = e, n = t.container || t.form || t.inContainer || t.inForm || (typeof document < "u" && (t.containerId || t.formId || t.inContainerId || t.inFormId) ? document.getElementById(t.containerId || t.formId || t.inContainerId || t.inFormId) : null), r = t.actions || t.inActions || {}, i = t.defaultValues || t.inDefaultValues || {}, a = !!(t.showLog ?? t.inShowLog);
	if (!n) return a && console.warn("[json-to-dom listeners.v2] bindActions: Container/Form not found."), { remove: () => {} };
	let o = (e) => {
		let t = e.target?.closest?.("[data-action]");
		if (!t) return;
		let o = t.dataset.action, s = r[o], c = t.dataset.closestTarget === "ksrow" || t.dataset.scope === "row", l = null, u = null, d = {};
		if (c) {
			let e = t.dataset.closestTarget || "ksrow";
			l = t.closest(`.${e}`) || t.parentElement, l && (J({
				inTargetElement: t,
				inClosestElement: l,
				inContainerElement: n
			}), d = K({ inElement: l }));
		} else u = t.closest("form") || t.closest(".ksform") || n, d = K({ inElement: u });
		let f = () => q({
			inElement: u || n,
			inDefaultValues: i
		});
		if (a && console.log(`[json-to-dom listeners.v2] Action triggered: "${o}"`, {
			target: t,
			scope: c ? "row" : "form",
			row: l,
			form: u,
			values: d
		}), (o === "cancel" || o === "reset") && typeof s != "function") {
			f();
			return;
		}
		typeof s == "function" ? s({
			event: e,
			target: t,
			row: l,
			form: u || n,
			values: d,
			reset: f,
			container: n
		}) : a && console.warn(`[json-to-dom listeners.v2] No handler registered for action "${o}".`);
	};
	return n.addEventListener("click", o), { remove: () => {
		n.removeEventListener("click", o);
	} };
}, X = {
	bindActions: Y,
	bind: Y,
	extractFormValues: K,
	resetForm: q,
	applyHighlight: J
}, Z = (e) => X.bindActions(e), Q = {
	v1: G,
	v2: X,
	bindActions: Z,
	bind: Z,
	extractFormValues: X.extractFormValues,
	extractInputs: G.extractInputs,
	resetForm: X.resetForm,
	applyHighlight: X.applyHighlight
};
Z.v1 = G.bindActions, Z.v2 = X.bindActions;
//#endregion
//#region src/v27/jsonToDom/orchestration/2.registerGlobal.js
var te = ({ inApi: e } = {}) => {
	let t = e;
	typeof window < "u" && (window.ks = window.ks || {}, window.ks["json-to-dom"] = t);
}, $ = {
	meta: e,
	jsonToDom: B,
	core: B.core,
	validate: I,
	data: V,
	listeners: Q
};
te({ inApi: {
	...$,
	buildSpecElement: L,
	specToDom: R,
	specToHtml: z,
	bindActions: Z
} });
var ne = L;
//#endregion
export { Z as bindActions, L as buildSpecElement, V as data, ne as default, B as jsonToDom, Q as listeners, e as meta, R as specToDom, z as specToHtml, $ as tree, I as validate };

//#region src/v28/meta.js
var e = {
	version: "v28.0",
	description: "3-Chapter Story-Driven DOM engine with preserved elementBuilder assembly line (v28)"
}, t = {
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
}, n = ({ inTagName: e, inSpec: n }) => {
	let r = (e || n?.tagName)?.toLowerCase();
	return r ? r in t ? {
		isValid: !0,
		tagName: r,
		definition: t[r],
		error: null
	} : {
		isValid: !1,
		tagName: r,
		definition: null,
		error: `Tag <${r}> is not recognized in tags.json`
	} : {
		isValid: !1,
		tagName: null,
		definition: null,
		error: "Missing tagName"
	};
}, r = {
	title: "HTML Global Allowed Attributes",
	description: "Standard W3C/WHATWG Global Attributes permitted on all HTML elements.",
	attributes: /* @__PURE__ */ "accesskey.autocapitalize.autofocus.class.contenteditable.dir.draggable.enterkeyhint.hidden.id.inert.inputmode.is.itemid.itemprop.itemref.itemscope.itemtype.lang.nonce.part.popover.role.slot.spellcheck.style.tabindex.title.translate".split("."),
	wildcardPrefixes: ["data-", "aria-"]
}, i = ({ inAttributeName: e, inAllowedAttributes: t = [] }) => {
	let n = e, i = Array.isArray(t) ? t : [];
	return !n || typeof n != "string" ? !1 : r.attributes.includes(n) || r.wildcardPrefixes?.some((e) => n.startsWith(e)) ? !0 : i.includes(n);
}, a = [
	"tagName",
	"textContent",
	"attributes",
	"classList",
	"children",
	"properties"
], o = ({ inSpec: e }) => {
	let n = e, r = [], o = [], s = [], c = [];
	if (!n || typeof n != "object" || Array.isArray(n)) return {
		isValid: !1,
		tagName: null,
		errors: ["Specification must be a non-null object"],
		warnings: o,
		unknownKeys: s,
		invalidAttributes: c
	};
	let l = typeof n.tagName == "string" ? n.tagName.toLowerCase().trim() : null;
	if (!l) return r.push("Missing or invalid 'tagName'"), {
		isValid: !1,
		tagName: null,
		errors: r,
		warnings: o,
		unknownKeys: s,
		invalidAttributes: c
	};
	let u = t[l];
	if (!u) return r.push(`Unknown or unsupported HTML tag: <${l}>`), {
		isValid: !1,
		tagName: l,
		errors: r,
		warnings: o,
		unknownKeys: s,
		invalidAttributes: c
	};
	if (Object.keys(n).forEach((e) => {
		a.includes(e) || (s.push(e), o.push(`Unknown property key "${e}" will be ignored`));
	}), n.textContent !== void 0 && n.textContent !== null && !u.allowsTextContent && r.push(`Tag <${l}> does not allow direct textContent (allowsTextContent: false)`), Array.isArray(n.children) && n.children.length > 0 && !u.allowsChildren && r.push(`Tag <${l}> is a void element and does not allow children (allowsChildren: false)`), n.attributes && typeof n.attributes == "object") {
		let e = Array.isArray(u.allowedAttributes) ? u.allowedAttributes : [];
		Object.keys(n.attributes).forEach((t) => {
			i({
				inAttributeName: t,
				inAllowedAttributes: e
			}) || (c.push(t), r.push(`Attribute "${t}" is not allowed on <${l}>`));
		});
	}
	return {
		isValid: r.length === 0,
		tagName: l,
		errors: r,
		warnings: o,
		unknownKeys: s,
		invalidAttributes: c
	};
}, s = ({ inTagName: e }) => {
	let n = e?.toLowerCase();
	return !!(n && n in t);
}, c = ({ inTagName: e }) => t[e?.toLowerCase()] || null, l = ({ inAttributes: e, inAllowedAttributes: t, inTagName: n, inShowLog: r = !1 }) => {
	let a = e, o = t, s = n, c = r;
	if (!a || typeof a != "object") return {};
	let l = {}, u = [];
	return Object.entries(a).forEach(([e, t]) => {
		i({
			inAttributeName: e,
			inAllowedAttributes: o
		}) ? l[e] = t : u.push(e);
	}), u.length > 0 && c && console.warn(`[json-to-dom v23] Discarded invalid attributes for <${s}>:`, u), l;
}, u = (e) => {
	let t = e;
	return o({ inSpec: t && typeof t == "object" && !Array.isArray(t) && ("spec" in t || "inSpec" in t) ? t.spec ?? t.inSpec : t });
};
u.validateSpec = o, u.validateTag = n, u.isAttributeAllowed = i, u.isTagValid = s, u.getTagDefinition = c, u.filterAttributes = l;
//#endregion
//#region src/v28/chapters/chapter1_inspection/validate/v2/rules/hierarchyRules.js
var d = {
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
}, f = {
	a: ["a", "button"],
	button: [
		"button",
		"a",
		"input",
		"select",
		"textarea"
	]
}, p = ({ inTagName: e, inParentTag: t }) => {
	let n = e?.toLowerCase(), r = t?.toLowerCase(), i = [];
	if (n && d[n]) {
		let e = d[n];
		r && !e.includes(r) && i.push(`HTML Hierarchy Violation: <${n}> cannot be placed inside <${r}>. Required parent: [${e.join(", ")}].`);
	}
	return r && f[r] && f[r].includes(n) && i.push(`HTML Nesting Violation: Interactive element <${n}> cannot be nested inside <${r}>.`), {
		isValid: i.length === 0,
		errors: i
	};
}, m = [
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
], h = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	return m.includes(t);
}, g = ({ inTagName: e, inSpec: t }) => {
	let n = e?.toLowerCase(), r = t, i = [];
	return h({ inTagName: n }) && (r?.textContent !== void 0 && r?.textContent !== null && r?.textContent !== "" && i.push(`Void Element Violation: <${n}> is a void tag and cannot have 'textContent'.`), Array.isArray(r?.children) && r.children.length > 0 && i.push(`Void Element Violation: <${n}> is a void tag and cannot have 'children'.`)), {
		isValid: i.length === 0,
		errors: i
	};
}, ee = [
	"tagName",
	"textContent",
	"attributes",
	"classList",
	"children",
	"properties"
], _ = ({ inAttributeName: e, inAllowedAttributes: t = [] }) => {
	let n = e, i = Array.isArray(t) ? t : [];
	return !n || typeof n != "string" ? !1 : r.attributes.includes(n) || r.wildcardPrefixes?.some((e) => n.startsWith(e)) ? !0 : i.includes(n);
}, v = ({ inSpec: e, inParentTag: n = null, inPath: r = "root" } = {}) => {
	let i = e, a = n, o = r, s = [], c = [], l = [], u = [], d = [];
	if (Array.isArray(i)) return i.forEach((e, t) => {
		let n = v({
			inSpec: e,
			inParentTag: a,
			inPath: `${o}[${t}]`
		});
		s.push(...n.errors), c.push(...n.warnings), l.push(...n.unknownKeys), u.push(...n.invalidAttributes), d.push(...n.hierarchyViolations);
	}), {
		isValid: s.length === 0,
		path: o,
		tagName: "array",
		errors: s,
		warnings: c,
		unknownKeys: l,
		invalidAttributes: u,
		hierarchyViolations: d
	};
	if (!i || typeof i != "object") return {
		isValid: !1,
		path: o,
		tagName: null,
		errors: [`[${o}] Specification must be a non-null object`],
		warnings: c,
		unknownKeys: l,
		invalidAttributes: u,
		hierarchyViolations: d
	};
	let f = typeof i.tagName == "string" ? i.tagName.toLowerCase().trim() : null;
	if (!f) return s.push(`[${o}] Missing or invalid 'tagName'`), {
		isValid: !1,
		path: o,
		tagName: null,
		errors: s,
		warnings: c,
		unknownKeys: l,
		invalidAttributes: u,
		hierarchyViolations: d
	};
	let m = `${o} > <${f}>`, h = t[f];
	if (!h) return s.push(`[${m}] Unknown or unsupported HTML tag: <${f}>`), {
		isValid: !1,
		path: m,
		tagName: f,
		errors: s,
		warnings: c,
		unknownKeys: l,
		invalidAttributes: u,
		hierarchyViolations: d
	};
	Object.keys(i).forEach((e) => {
		ee.includes(e) || (l.push(e), c.push(`[${m}] Unknown spec property key "${e}" will be ignored`));
	});
	let y = g({
		inTagName: f,
		inSpec: i
	});
	if (y.isValid || y.errors.forEach((e) => s.push(`[${m}] ${e}`)), i.attributes && typeof i.attributes == "object") {
		let e = Array.isArray(h.allowedAttributes) ? h.allowedAttributes : [];
		Object.keys(i.attributes).forEach((t) => {
			_({
				inAttributeName: t,
				inAllowedAttributes: e
			}) || (u.push(t), s.push(`[${m}] Attribute "${t}" is not allowed on <${f}>`));
		});
	}
	let b = p({
		inTagName: f,
		inParentTag: a
	});
	return b.isValid || b.errors.forEach((e) => {
		s.push(`[${m}] ${e}`), d.push(e);
	}), Array.isArray(i.children) && i.children.forEach((e, t) => {
		if (e && typeof e == "object") {
			let n = v({
				inSpec: e,
				inParentTag: f,
				inPath: `${m}.children[${t}]`
			});
			s.push(...n.errors), c.push(...n.warnings), l.push(...n.unknownKeys), u.push(...n.invalidAttributes), d.push(...n.hierarchyViolations);
		}
	}), {
		isValid: s.length === 0,
		path: m,
		tagName: f,
		errors: s,
		warnings: c,
		unknownKeys: l,
		invalidAttributes: u,
		hierarchyViolations: d
	};
}, y = (e) => {
	let t = e;
	return v({ inSpec: t && typeof t == "object" && !Array.isArray(t) && ("spec" in t || "inSpec" in t) ? t.spec ?? t.inSpec : t });
};
y.validateSpec = v, y.checkHierarchy = p, y.checkVoidRules = g, y.isVoidTag = h, y.VOID_TAGS = m;
//#endregion
//#region src/v28/chapters/chapter1_inspection/validate/index.js
var b = (e) => y(e);
b.v1 = u, b.v2 = y, b.validateSpec = y.validateSpec, b.checkHierarchy = y.checkHierarchy, b.checkVoidRules = y.checkVoidRules, b.isVoidTag = y.isVoidTag;
//#endregion
//#region src/v28/chapters/chapter1_inspection/standards/index.js
var x = {
	tags: t,
	globalAllowedAttributes: r
}, S = ({ spec: e } = {}) => b({ inSpec: e }), te = ({ inSpec: e }) => e == null, C = ({ inSpec: e }) => typeof Node < "u" && e instanceof Node, w = ({ inSpec: e }) => {
	let t = e;
	return Array.isArray(t);
}, T = ({ inSpec: e }) => {
	let t = e;
	return typeof t == "object" && !!t && !Array.isArray(t);
}, E = ({ inSpec: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	return Array.isArray(n) ? n.map((e) => P({
		inSpec: e,
		inShowLog: r
	})).flat().filter(Boolean) : [];
}, D = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	if (!t) return null;
	if (t === "checkbox") {
		let e = document.createElement("input");
		return e.type = "checkbox", e;
	}
	return document.createElement(t);
}, O = ({ inElement: e, inTextContent: t, inAllowsTextContent: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t;
	return !a || o == null ? a : n ? (a.textContent = o, a) : (i && console.warn(`[json-to-dom v11] textContent is not allowed on <${r}>; discarded "${o}"`), a);
}, k = ({ inElement: e, inProperties: t }) => {
	let n = e, r = t;
	return n && r && typeof r == "object" && Object.assign(n, r), n;
}, A = ({ inElement: e, inAttributes: t }) => {
	let n = e, r = t;
	return !n || !r || typeof r != "object" || Object.entries(r).forEach(([e, t]) => {
		e === "class" ? n.className = t : typeof t == "boolean" ? t ? n.setAttribute(e, "") : n.removeAttribute(e) : t != null && n.setAttribute(e, String(t));
	}), n;
}, j = ({ inElement: e, inClassList: t }) => {
	let n = e, r = t;
	if (!n || !r) return n;
	let i = [];
	return typeof r == "string" ? i = r.split(/\s+/).filter(Boolean) : Array.isArray(r) && (i = r.filter((e) => typeof e == "string" && e.trim().length > 0)), i.length > 0 && n.classList.add(...i), n;
}, M = ({ inElement: e, inChildren: t, inAllowsChildren: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	return !a || !Array.isArray(o) || o.length === 0 ? a : s ? (o.forEach((e) => {
		typeof Node < "u" && e instanceof Node ? a.appendChild(e) : (typeof e == "string" || typeof e == "number") && a.appendChild(document.createTextNode(String(e)));
	}), a) : (l && console.warn(`[json-to-dom v11] Children are not allowed on void tag <${c}>; discarded ${o.length} child nodes.`), a);
}, N = ({ inSpec: e, inClassList: t }) => {
	let n = e, r = t || n?.classList;
	if (!n || !n.tagName) return null;
	let i = D({ inTagName: n.tagName });
	return i ? (O({
		inElement: i,
		inTextContent: n.textContent,
		inTagName: n.tagName
	}), k({
		inElement: i,
		inProperties: n.properties
	}), A({
		inElement: i,
		inAttributes: n.attributes
	}), j({
		inElement: i,
		inClassList: r
	}), M({
		inElement: i,
		inChildren: n.children,
		inTagName: n.tagName
	}), i) : null;
}, ne = ({ inChildren: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	return Array.isArray(n) ? n.map((e) => typeof e == "string" || typeof e == "number" ? typeof document < "u" ? document.createTextNode(String(e)) : String(e) : P({
		inSpec: e,
		inShowLog: r
	})).flat().filter(Boolean) : [];
}, re = ({ inSpec: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	if (!n?.tagName) return r && console.warn("[json-to-dom v23] Missing tagName on spec:", n), null;
	let i = Array.isArray(n.children) && n.children.length > 0 ? ne({
		inChildren: n.children,
		inShowLog: r
	}) : [];
	return N({ inSpec: {
		...n,
		children: i
	} });
}, P = ({ inSpec: e, inShowLog: t = !1 } = {}) => {
	let n = e, r = t;
	return te({ inSpec: n }) ? null : C({ inSpec: n }) ? n : w({ inSpec: n }) ? E({
		inSpec: n,
		inShowLog: r
	}) : T({ inSpec: n }) ? re({
		inSpec: n,
		inShowLog: r
	}) : null;
}, ie = ({ inArgs: e, inSpec: t, inShowLog: n } = {}) => {
	let r = e, i = t, a = n, o = i === void 0 ? r : i, s = !!a;
	return r && typeof r == "object" && !Array.isArray(r) && !(typeof Node < "u" && r instanceof Node) && ("inSpec" in r ? (o = r.inSpec, s = !!r.inShowLog) : "spec" in r && (o = r.spec, s = !!r.showLog)), typeof globalThis < "u" && globalThis?.ks?.showLog && (s = !0), {
		spec: o,
		showLog: s
	};
}, F = ({ inElement: e }) => {
	let t = e;
	if (!t || typeof t.querySelectorAll != "function") return {};
	let n = t.querySelectorAll("input, select, textarea"), r = {};
	return n.forEach((e) => {
		let t = e.name || e.id;
		t && (e.type === "checkbox" ? r[t] = e.checked : e.type === "radio" ? e.checked && (r[t] = e.value) : r[t] = e.value);
	}), r;
}, I = ({ inTargetElement: e, inClosestElement: t, inContainerElement: n }) => {
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
}, L = (e = {}) => {
	let t = e, n = t.container || t.inContainer || (typeof document < "u" && (t.containerId || t.inContainerId) ? document.getElementById(t.containerId || t.inContainerId) : null), r = t.actions || t.inActions || {}, i = !!(t.showLog ?? t.inShowLog);
	if (!n) return i && console.warn("[json-to-dom listeners] bindActions: Container not found."), { remove: () => {} };
	let a = (e) => {
		let t = e.target?.closest?.("[data-action]");
		if (!t) return;
		let a = t.dataset.action, o = r[a], s = t.dataset.closestTarget || "ksrow", c = t.closest(`.${s}`) || t.parentElement;
		c && I({
			inTargetElement: t,
			inClosestElement: c,
			inContainerElement: n
		});
		let l = c ? F({ inElement: c }) : {};
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
}, R = {
	bindActions: L,
	bind: L,
	extractInputs: F,
	applyHighlight: I
}, z = (e = {}) => {
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
}, B = (e = {}) => {
	let t = e, n = t.element || t.form || t.container || t.inElement || t.inForm || t.inContainer, r = t.defaultValues || t.inDefaultValues || {};
	return !n || typeof n.querySelectorAll != "function" ? { success: !1 } : n.tagName === "FORM" && typeof n.reset == "function" && Object.keys(r).length === 0 ? (n.reset(), { success: !0 }) : (n.querySelectorAll("input, select, textarea").forEach((e) => {
		let t = e.name || e.id, n = (e.type || "").toLowerCase();
		if (n === "button" || n === "submit" || n === "reset" || e.tagName === "BUTTON") return;
		let i = t && t in r ? r[t] : null;
		n === "checkbox" ? e.checked = i !== null && !!i : n === "radio" ? e.checked = i !== null && e.value === i : e.tagName === "SELECT" ? i === null ? e.options && e.options.length > 0 ? e.selectedIndex = 0 : e.value = "" : e.value = i : e.value = i === null ? "" : String(i);
	}), { success: !0 });
}, V = ({ inTargetElement: e, inClosestElement: t, inContainerElement: n }) => {
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
}, H = (e = {}) => {
	let t = e, n = t.container || t.form || t.inContainer || t.inForm || (typeof document < "u" && (t.containerId || t.formId || t.inContainerId || t.inFormId) ? document.getElementById(t.containerId || t.formId || t.inContainerId || t.inFormId) : null), r = t.actions || t.inActions || {}, i = t.defaultValues || t.inDefaultValues || {}, a = !!(t.showLog ?? t.inShowLog);
	if (!n) return a && console.warn("[json-to-dom listeners.v2] bindActions: Container/Form not found."), { remove: () => {} };
	let o = (e) => {
		let t = e.target?.closest?.("[data-action]");
		if (!t) return;
		let o = t.dataset.action, s = r[o], c = t.dataset.closestTarget === "ksrow" || t.dataset.scope === "row", l = null, u = null, d = {};
		if (c) {
			let e = t.dataset.closestTarget || "ksrow";
			l = t.closest(`.${e}`) || t.parentElement, l && (V({
				inTargetElement: t,
				inClosestElement: l,
				inContainerElement: n
			}), d = z({ inElement: l }));
		} else u = t.closest("form") || t.closest(".ksform") || n, d = z({ inElement: u });
		let f = () => B({
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
}, U = {
	bindActions: H,
	bind: H,
	extractFormValues: z,
	resetForm: B,
	applyHighlight: V
}, W = (e) => U.bindActions(e), G = {
	v1: R,
	v2: U,
	bindActions: W,
	bind: W,
	extractFormValues: U.extractFormValues,
	extractInputs: R.extractInputs,
	resetForm: U.resetForm,
	applyHighlight: U.applyHighlight
};
W.v1 = R.bindActions, W.v2 = U.bindActions;
//#endregion
//#region src/v28/chapters/chapter3_activation/mountToContainer.js
var K = ({ element: e, targetHtmlId: t } = {}) => {
	let n = e, r = t;
	if (!r || typeof document > "u") return;
	let i = document.getElementById(r);
	i && (i.innerHTML = "", Array.isArray(n) ? n.forEach((e) => {
		e instanceof Node && i.appendChild(e);
	}) : n instanceof Node && i.appendChild(n));
}, q = {
	extractFormValues: G.extractFormValues,
	extractInputs: G.extractInputs,
	resetForm: G.resetForm,
	applyHighlight: G.applyHighlight
}, J = ({ inApi: e } = {}) => {
	let t = e;
	typeof window < "u" && (window.ks = window.ks || {}, window.ks["json-to-dom"] = t);
}, Y = (e) => {
	let t = e, n = t && typeof t == "object" && !Array.isArray(t) && !(typeof Node < "u" && t instanceof Node) && ("spec" in t || "inSpec" in t || "outputType" in t || "inOutputType" in t || "validate" in t || "inValidate" in t || "debug" in t || "inDebug" in t), r = n ? t.spec ?? t.inSpec : t, i = n ? (t.outputType ?? t.inOutputType ?? "dom").toLowerCase() : "dom", a = n ? !!(t.showLog ?? t.inShowLog) : !1;
	if (n && (t.validate ?? t.inValidate ?? t.debug ?? t.inDebug) && r) {
		let e = b({ inSpec: r });
		e.isValid ? e.warnings && e.warnings.length > 0 && a && console.warn("[json-to-dom v28: validation warning]", e.warnings) : console.warn("[json-to-dom v28: validation error]", e.errors, e);
	}
	let { spec: o, showLog: s } = ie({
		inSpec: r,
		inShowLog: a
	}), c = P({
		inSpec: o,
		inShowLog: s
	});
	return i === "html" ? c ? Array.isArray(c) ? c.map((e) => e.outerHTML).join("\n") : c.outerHTML : "" : c;
}, X = (e = {}) => {
	let t = e, n = t.spec ?? t.inSpec, r = t.targetHtmlId ?? t.domIdToPushTo ?? t.inDomIdToPushTo, i = Y({
		spec: n,
		outputType: "dom",
		showLog: !!(t.showLog ?? t.inShowLog),
		validate: !!(t.validate ?? t.inValidate ?? t.debug ?? t.inDebug)
	});
	return r && typeof document < "u" && K({
		element: i,
		targetHtmlId: r
	}), i;
}, Z = (e = {}) => Y({
	spec: e.spec ?? e.inSpec ?? e,
	outputType: "html"
}), Q = Y;
Q.buildSpecElement = Y, Q.specToDom = X, Q.specToHtml = Z, Q.core = N;
var $ = {
	meta: e,
	jsonToDom: Q,
	core: N,
	validate: b,
	data: x,
	listeners: G
};
J({ inApi: {
	...$,
	buildSpecElement: Y,
	specToDom: X,
	specToHtml: Z,
	bindActions: W
} });
//#endregion
export { W as bindActions, Y as buildSpecElement, Y as default, x as data, x as standards, N as elementBuilder, q as formOperations, Q as jsonToDom, G as listeners, e as meta, X as specToDom, Z as specToHtml, $ as tree, b as validate, S as validateSpec };

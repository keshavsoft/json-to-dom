//#region src/v31/meta.js
var e = {
	version: "v31.0",
	description: "Pure DOM engine (v31)"
}, t = (t) => {
	typeof globalThis > "u" || !t || (globalThis.ks ??= {}, globalThis.ks["json-to-dom"] = {
		meta: e,
		buildSpecElement: t
	});
}, n = {
	$schema: "./tags.schema.json",
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
}, r = {
	title: "HTML Global Allowed Attributes",
	description: "Standard W3C/WHATWG Global Attributes permitted on all HTML elements.",
	attributes: /* @__PURE__ */ "accesskey.autocapitalize.autofocus.class.contenteditable.dir.draggable.enterkeyhint.hidden.id.inert.inputmode.is.itemid.itemprop.itemref.itemscope.itemtype.lang.nonce.part.popover.role.slot.spellcheck.style.tabindex.title.translate".split("."),
	wildcardPrefixes: ["data-", "aria-"]
}, i = ({ inSpec: e, spec: t } = {}) => {
	let a = e ?? t, o = [], s = [];
	if (!a || typeof a != "object") return o.push("Spec must be a non-null object"), {
		isValid: !1,
		errors: o,
		warnings: s
	};
	if (Array.isArray(a)) return a.forEach((e, t) => {
		let n = i({ inSpec: e });
		n.isValid || o.push(...n.errors.map((e) => `[${t}] ${e}`)), s.push(...n.warnings.map((e) => `[${t}] ${e}`));
	}), {
		isValid: o.length === 0,
		errors: o,
		warnings: s
	};
	let c = a.tagName?.toLowerCase();
	if (!c || typeof c != "string") return o.push("Missing or invalid 'tagName'"), {
		isValid: !1,
		errors: o,
		warnings: s
	};
	let l = n[c];
	if (!l) s.push(`Tag '<${c}>' is not recognized in tags.json`);
	else if (l.allowsChildren === !1 && Array.isArray(a.children) && a.children.length > 0 && o.push(`Void tag '<${c}>' cannot have children`), l.allowsTextContent === !1 && a.textContent && s.push(`Tag '<${c}>' does not normally allow direct textContent`), a.attributes && typeof a.attributes == "object") {
		let e = /* @__PURE__ */ new Set([...r.attributes || [], ...l.allowedAttributes || []]), t = r.wildcardPrefixes || [];
		for (let n of Object.keys(a.attributes)) {
			let r = t.some((e) => n.startsWith(e));
			!e.has(n) && !r && s.push(`Attribute '${n}' is not recognized on '<${c}>'`);
		}
	}
	return Array.isArray(a.children) && a.children.forEach((e, t) => {
		let n = i({ inSpec: e });
		n.isValid || o.push(...n.errors.map((e) => `<${c}>.children[${t}]: ${e}`)), s.push(...n.warnings.map((e) => `<${c}>.children[${t}]: ${e}`));
	}), {
		isValid: o.length === 0,
		errors: o,
		warnings: s
	};
}, a = (e) => {
	let t = e, n = t && typeof t == "object" && !Array.isArray(t) && ("spec" in t || "inSpec" in t), r = n ? t.inSpec ?? t.spec : t, a = n ? !!(t.inValidate ?? t.validate ?? t.debug) : !1, o = n ? !!(t.inShowLog ?? t.showLog) : !1;
	if (a && r) {
		let e = i({ inSpec: r });
		return e.isValid ? e.warnings?.length > 0 && o && console.warn("[json-to-dom: validation warning]", e.warnings) : console.warn("[json-to-dom: validation error]", e.errors, e), e;
	}
	return { isValid: !0 };
}, o = ({ inSpec: e }) => e == null, s = ({ inSpec: e }) => typeof Node < "u" && e instanceof Node, c = ({ inSpec: e }) => {
	let t = e;
	return Array.isArray(t);
}, l = ({ inSpec: e }) => {
	let t = e;
	return typeof t == "object" && !!t && !Array.isArray(t);
}, u = ({ inSpec: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	return Array.isArray(n) ? n.map((e) => b({
		inSpec: e,
		inShowLog: r
	})).flat().filter(Boolean) : [];
}, d = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	if (!t) return null;
	if (t === "checkbox") {
		let e = document.createElement("input");
		return e.type = "checkbox", e;
	}
	return document.createElement(t);
}, f = ({ inElement: e, inTextContent: t, inAllowsTextContent: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t;
	return !a || o == null ? a : n ? (a.textContent = o, a) : (i && console.warn(`[json-to-dom v11] textContent is not allowed on <${r}>; discarded "${o}"`), a);
}, p = ({ inElement: e, inProperties: t }) => {
	let n = e, r = t;
	return n && r && typeof r == "object" && Object.assign(n, r), n;
}, m = ({ inElement: e, inAttributes: t }) => {
	let n = e, r = t;
	return !n || !r || typeof r != "object" || Object.entries(r).forEach(([e, t]) => {
		e === "class" ? n.className = t : typeof t == "boolean" ? t ? n.setAttribute(e, "") : n.removeAttribute(e) : t != null && n.setAttribute(e, String(t));
	}), n;
}, h = ({ inElement: e, inClassList: t }) => {
	let n = e, r = t;
	if (!n || !r) return n;
	let i = [];
	return typeof r == "string" ? i = r.split(/\s+/).filter(Boolean) : Array.isArray(r) && (i = r.filter((e) => typeof e == "string" && e.trim().length > 0)), i.length > 0 && n.classList.add(...i), n;
}, g = ({ inElement: e, inChildren: t, inAllowsChildren: n = !0, inTagName: r, inShowLog: i = !1 }) => {
	let a = e, o = t, s = n, c = r, l = i;
	return !a || !Array.isArray(o) || o.length === 0 ? a : s ? (o.forEach((e) => {
		typeof Node < "u" && e instanceof Node ? a.appendChild(e) : (typeof e == "string" || typeof e == "number") && a.appendChild(document.createTextNode(String(e)));
	}), a) : (l && console.warn(`[json-to-dom v11] Children are not allowed on void tag <${c}>; discarded ${o.length} child nodes.`), a);
}, _ = ({ inSpec: e, inClassList: t }) => {
	let n = e, r = t || n?.classList;
	if (!n || !n.tagName) return null;
	let i = d({ inTagName: n.tagName });
	return i ? (f({
		inElement: i,
		inTextContent: n.textContent,
		inTagName: n.tagName
	}), p({
		inElement: i,
		inProperties: n.properties
	}), m({
		inElement: i,
		inAttributes: n.attributes
	}), h({
		inElement: i,
		inClassList: r
	}), g({
		inElement: i,
		inChildren: n.children,
		inTagName: n.tagName
	}), i) : null;
}, v = ({ inChildren: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	return Array.isArray(n) ? n.map((e) => typeof e == "string" || typeof e == "number" ? typeof document < "u" ? document.createTextNode(String(e)) : String(e) : b({
		inSpec: e,
		inShowLog: r
	})).flat().filter(Boolean) : [];
}, y = ({ inSpec: e, inShowLog: t = !1 }) => {
	let n = e, r = t;
	if (!n?.tagName) return r && console.warn("[json-to-dom v23] Missing tagName on spec:", n), null;
	let i = Array.isArray(n.children) && n.children.length > 0 ? v({
		inChildren: n.children,
		inShowLog: r
	}) : [];
	return _({ inSpec: {
		...n,
		children: i
	} });
}, b = ({ inSpec: e, inShowLog: t = !1 } = {}) => {
	let n = e, r = t;
	return o({ inSpec: n }) ? null : s({ inSpec: n }) ? n : c({ inSpec: n }) ? u({
		inSpec: n,
		inShowLog: r
	}) : l({ inSpec: n }) ? y({
		inSpec: n,
		inShowLog: r
	}) : null;
}, x = ({ inArgs: e, inSpec: t, inShowLog: n } = {}) => {
	let r = e, i = t, a = n, o = i === void 0 ? r : i, s = !!a;
	return r && typeof r == "object" && !Array.isArray(r) && !(typeof Node < "u" && r instanceof Node) && ("inSpec" in r ? (o = r.inSpec, s = !!r.inShowLog) : "spec" in r && (o = r.spec, s = !!r.showLog)), typeof globalThis < "u" && globalThis?.ks?.showLog && (s = !0), {
		spec: o,
		showLog: s
	};
}, S = (e) => {
	let t = e, n = t && typeof t == "object" && !Array.isArray(t) && !(typeof Node < "u" && t instanceof Node) && ("spec" in t || "inSpec" in t), r = n ? t.spec ?? t.inSpec : t, i = n ? !!(t.showLog ?? t.inShowLog) : !1, { spec: a } = x({
		inSpec: r,
		inShowLog: i
	});
	return b({
		inSpec: a,
		inShowLog: i
	});
}, C = ({ inElement: e }) => {
	let t = e;
	if (!t || typeof t.querySelectorAll != "function") return {};
	let n = t.querySelectorAll("input, select, textarea"), r = {};
	return n.forEach((e) => {
		let t = e.name || e.id;
		t && (e.type === "checkbox" ? r[t] = e.checked : e.type === "radio" ? e.checked && (r[t] = e.value) : r[t] = e.value);
	}), r;
}, w = ({ inTargetElement: e, inClosestElement: t, inContainerElement: n }) => {
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
}, T = (e = {}) => {
	let t = e, n = t.container || t.inContainer || (typeof document < "u" && (t.containerId || t.inContainerId) ? document.getElementById(t.containerId || t.inContainerId) : null), r = t.actions || t.inActions || {}, i = !!(t.showLog ?? t.inShowLog);
	if (!n) return i && console.warn("[json-to-dom listeners] bindActions: Container not found."), { remove: () => {} };
	let a = (e) => {
		let t = e.target?.closest?.("[data-action]");
		if (!t) return;
		let a = t.dataset.action, o = r[a], s = t.dataset.closestTarget || "ksrow", c = t.closest(`.${s}`) || t.parentElement;
		c && w({
			inTargetElement: t,
			inClosestElement: c,
			inContainerElement: n
		});
		let l = c ? C({ inElement: c }) : {};
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
}, E = {
	bindActions: T,
	bind: T,
	extractInputs: C,
	applyHighlight: w
}, D = (e = {}) => {
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
}, O = (e = {}) => {
	let t = e, n = t.element || t.form || t.container || t.inElement || t.inForm || t.inContainer, r = t.defaultValues || t.inDefaultValues || {};
	return !n || typeof n.querySelectorAll != "function" ? { success: !1 } : n.tagName === "FORM" && typeof n.reset == "function" && Object.keys(r).length === 0 ? (n.reset(), { success: !0 }) : (n.querySelectorAll("input, select, textarea").forEach((e) => {
		let t = e.name || e.id, n = (e.type || "").toLowerCase();
		if (n === "button" || n === "submit" || n === "reset" || e.tagName === "BUTTON") return;
		let i = t && t in r ? r[t] : null;
		n === "checkbox" ? e.checked = i !== null && !!i : n === "radio" ? e.checked = i !== null && e.value === i : e.tagName === "SELECT" ? i === null ? e.options && e.options.length > 0 ? e.selectedIndex = 0 : e.value = "" : e.value = i : e.value = i === null ? "" : String(i);
	}), { success: !0 });
}, k = ({ inTargetElement: e, inClosestElement: t, inContainerElement: n }) => {
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
}, A = (e = {}) => {
	let t = e, n = t.container || t.form || t.inContainer || t.inForm || (typeof document < "u" && (t.containerId || t.formId || t.inContainerId || t.inFormId) ? document.getElementById(t.containerId || t.formId || t.inContainerId || t.inFormId) : null), r = t.actions || t.inActions || {}, i = t.defaultValues || t.inDefaultValues || {}, a = !!(t.showLog ?? t.inShowLog);
	if (!n) return a && console.warn("[json-to-dom listeners.v2] bindActions: Container/Form not found."), { remove: () => {} };
	let o = (e) => {
		let t = e.target?.closest?.("[data-action]");
		if (!t) return;
		let o = t.dataset.action, s = r[o], c = t.dataset.closestTarget === "ksrow" || t.dataset.scope === "row", l = null, u = null, d = {};
		if (c) {
			let e = t.dataset.closestTarget || "ksrow";
			l = t.closest(`.${e}`) || t.parentElement, l && (k({
				inTargetElement: t,
				inClosestElement: l,
				inContainerElement: n
			}), d = D({ inElement: l }));
		} else u = t.closest("form") || t.closest(".ksform") || n, d = D({ inElement: u });
		let f = () => O({
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
}, j = {
	bindActions: A,
	bind: A,
	extractFormValues: D,
	resetForm: O,
	applyHighlight: k
};
j.extractFormValues, E.extractInputs, j.resetForm, j.applyHighlight, E.bindActions, j.bindActions;
//#endregion
//#region src/v31/chapters/chapter3_activation/mountToContainer.js
var M = ({ element: e, targetHtmlId: t } = {}) => {
	let n = e, r = t;
	if (!r || typeof document > "u") return;
	let i = document.getElementById(r);
	i && (i.innerHTML = "", Array.isArray(n) ? n.forEach((e) => {
		e instanceof Node && i.appendChild(e);
	}) : n instanceof Node && i.appendChild(n));
}, N = (e = {}) => {
	let t = e, n = t.element, r = t.targetHtmlId;
	return r && typeof document < "u" && M({
		element: n,
		targetHtmlId: r
	}), n;
}, P = (e) => (a(e), N({
	element: S(e),
	targetHtmlId: e?.targetHtmlId ?? e?.domIdToPushTo ?? e?.inDomIdToPushTo
})), F = P;
t(P);
//#endregion
export { P as buildSpecElement, P as default, F as specToDom };

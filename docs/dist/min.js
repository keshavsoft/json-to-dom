//#region src/v41/register/meta.js
var e = {
	version: "1.41.0",
	name: "json-to-dom"
}, t = (t) => {
	t && (globalThis.ks ??= {}, globalThis.ks.jsonToDom = {
		meta: e,
		appendToDom: t
	});
}, n = ({ buildSpec: e, targetHtmlId: t, appendPosition: n, showLog: r }) => {
	let i = e, a = t, o = n, s = r;
	s && console.log("renderToDom 1 (content):", i);
	let c = document.getElementById(a);
	return c ? (Array.isArray(i) || i instanceof NodeList || i instanceof HTMLCollection ? o === "prepend" ? c.prepend(...i) : c.append(...i) : o === "prepend" ? c.prepend(i) : (c.innerHTML = "", c.append(i)), s && console.log("renderToDom 2 (mounted):", c), c) : null;
};
t(n);
//#endregion
export { n as default };

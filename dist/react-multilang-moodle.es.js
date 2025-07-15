import { jsx as c } from "react/jsx-runtime";
function a(o) {
  const s = {}, n = /\{mlang\s*(\w{2}(?:_\w{2})?)?\}(.*?)\{\s*mlang\s*\}/gs;
  let e;
  for (; (e = n.exec(o)) !== null; ) {
    const t = e[1] ? e[1].toLowerCase() : "other", r = e[2].trim();
    s[t] = r;
  }
  return s;
}
const m = ({
  content: o,
  currentLanguage: s,
  fallbackLanguage: n
}) => {
  const e = a(o);
  let t = "";
  const r = s.toLowerCase(), l = n == null ? void 0 : n.toLowerCase();
  if (!(Object.keys(e).length > 0))
    t = o;
  else if (e[r])
    t = e[r];
  else if (l && e[l])
    t = e[l];
  else if (e.en)
    t = e.en;
  else if (e.other)
    t = e.other;
  else {
    const i = Object.keys(e);
    i.length > 0 && (t = e[i[0]]);
  }
  return t ? /* @__PURE__ */ c(
    "div",
    {
      dangerouslySetInnerHTML: { __html: t }
    }
  ) : null;
};
export {
  m as MultilangContent,
  a as parseMoodleMultilangContent
};

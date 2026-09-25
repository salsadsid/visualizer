import { TOOLS } from "./catalog.js";

export const EMBED_PARAM = "embed";
export const EMBED_HEIGHT = 720;

const ABSOLUTE = /^([a-z][a-z0-9+.-]*:|\/\/)/i;

export const isEmbedSearch = (search) =>
    new URLSearchParams(String(search ?? "").replace(/^\?/, "")).get(EMBED_PARAM) === "1";

export function withEmbed(href) {
    if (typeof href !== "string" || href === "" || href.startsWith("#") || ABSOLUTE.test(href)) return href;
    const hashIndex = href.indexOf("#");
    const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
    const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
    const queryIndex = beforeHash.indexOf("?");
    const path = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
    const params = new URLSearchParams(queryIndex >= 0 ? beforeHash.slice(queryIndex + 1) : "");
    params.set(EMBED_PARAM, "1");
    return `${path}?${params}${hash}`;
}

const escapeAttribute = (value) =>
    String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function embedSnippet({ url, hash = "", title, height = EMBED_HEIGHT }) {
    const src = `${url}?${EMBED_PARAM}=1${hash}`;
    return `<iframe src="${escapeAttribute(src)}" width="100%" height="${height}" style="border:0;border-radius:12px" loading="lazy" title="${escapeAttribute(title)}"></iframe>`;
}

export function toolForPath(pathname) {
    let best = null;
    for (const tool of Object.values(TOOLS)) {
        const matches = pathname === tool.path || pathname.startsWith(`${tool.path}/`);
        if (matches && (!best || tool.path.length > best.path.length)) best = tool;
    }
    return best?.id ?? null;
}

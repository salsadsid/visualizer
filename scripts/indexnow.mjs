import { pathToFileURL } from "node:url";
import { siteConfig } from "../src/lib/site.js";

export const ENDPOINT = "https://api.indexnow.org/indexnow";
const DAY = 24 * 60 * 60 * 1000;

export function locsFromSitemap(xml) {
    return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
        .map(([, block]) => ({
            loc: /<loc>([^<]+)<\/loc>/.exec(block)?.[1].trim(),
            lastmod: /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1].trim() ?? null,
        }))
        .filter((entry) => entry.loc);
}

export function pickUrls(entries, { all = false, sinceDays = 7, now = Date.now() } = {}) {
    if (all) return entries.map((entry) => entry.loc);
    const cutoff = now - sinceDays * DAY;
    return entries
        .filter((entry) => entry.lastmod && Date.parse(entry.lastmod) >= cutoff)
        .map((entry) => entry.loc);
}

export function payload({ base, key, urls }) {
    const { host, origin } = new URL(base);
    return {
        host,
        key,
        keyLocation: `${origin}/${key}.txt`,
        urlList: urls.filter((url) => new URL(url).host === host),
    };
}

async function main(argv) {
    const flags = new Set(argv.filter((arg) => arg.startsWith("--")));
    const base = (argv.find((arg) => !arg.startsWith("--")) ?? siteConfig.url).replace(/\/$/, "");
    const sitemap = await fetch(`${base}/sitemap.xml`);
    if (!sitemap.ok) throw new Error(`${base}/sitemap.xml returned ${sitemap.status}`);

    const urls = pickUrls(locsFromSitemap(await sitemap.text()), { all: flags.has("--all") });
    const body = payload({ base: siteConfig.url, key: siteConfig.indexNowKey, urls });
    if (body.urlList.length === 0) {
        console.log("No recently changed pages to submit.");
        return;
    }
    if (flags.has("--dry-run")) {
        console.log(JSON.stringify(body, null, 2));
        return;
    }

    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
    });
    if (response.status !== 200 && response.status !== 202) {
        throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
    }
    console.log(`IndexNow accepted ${body.urlList.length} URLs (${response.status}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main(process.argv.slice(2)).catch((error) => {
        console.error(error.message);
        process.exit(1);
    });
}

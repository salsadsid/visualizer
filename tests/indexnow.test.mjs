import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { locsFromSitemap, payload, pickUrls } from "../scripts/indexnow.mjs";
import { siteConfig } from "../src/lib/site.js";

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://visualizer-gold.vercel.app/</loc>
<lastmod>2026-10-20</lastmod>
<changefreq>weekly</changefreq>
<priority>1</priority>
</url>
<url>
<loc>https://visualizer-gold.vercel.app/roadmap</loc>
<lastmod>2026-09-19</lastmod>
</url>
<url>
<loc>https://visualizer-gold.vercel.app/algorithms</loc>
</url>
</urlset>`;

test("reads every url and its lastmod from a sitemap", () => {
    assert.deepEqual(locsFromSitemap(SITEMAP), [
        { loc: "https://visualizer-gold.vercel.app/", lastmod: "2026-10-20" },
        { loc: "https://visualizer-gold.vercel.app/roadmap", lastmod: "2026-09-19" },
        { loc: "https://visualizer-gold.vercel.app/algorithms", lastmod: null },
    ]);
});

test("submits only pages changed within the last seven days unless asked for all", () => {
    const entries = locsFromSitemap(SITEMAP);
    const edge = Date.parse("2026-10-27T00:00:00Z");
    assert.deepEqual(pickUrls(entries, { now: edge }), ["https://visualizer-gold.vercel.app/"]);
    assert.deepEqual(pickUrls(entries, { now: edge + 1000 }), []);
    assert.deepEqual(
        pickUrls(entries, { all: true, now: edge }),
        entries.map((entry) => entry.loc)
    );
});

test("builds a payload whose urls all sit on the key's host", () => {
    const body = payload({
        base: "https://visualizer-gold.vercel.app",
        key: "abc123",
        urls: ["https://visualizer-gold.vercel.app/", "https://elsewhere.example/page"],
    });
    assert.deepEqual(body, {
        host: "visualizer-gold.vercel.app",
        key: "abc123",
        keyLocation: "https://visualizer-gold.vercel.app/abc123.txt",
        urlList: ["https://visualizer-gold.vercel.app/"],
    });
});

test("the key file in public/ holds exactly the configured key", () => {
    assert.match(siteConfig.indexNowKey, /^[a-f0-9]{32}$/);
    const file = new URL(`../public/${siteConfig.indexNowKey}.txt`, import.meta.url);
    assert.equal(readFileSync(file, "utf8"), siteConfig.indexNowKey);
});

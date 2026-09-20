import test from "node:test";
import assert from "node:assert/strict";
import {
    LEARNING_PATH,
    PLANNED,
    ROADMAP_GROUPS,
    SECTIONS,
    SORT_PAGES,
    SORT_PAGE_LIST,
    TOOLS,
    sitemapEntries,
} from "../src/lib/catalog.js";
import { SORTERS } from "../src/lib/algorithms/sorting.js";
import { buildMetadata } from "../src/lib/seo.js";
import { siteConfig } from "../src/lib/site.js";

const TITLE_SUFFIX = ` · ${siteConfig.shortName}`;
const pages = [...Object.values(TOOLS), ...SORT_PAGE_LIST];

test("every page has a title that fits in a search result", () => {
    for (const page of pages) {
        const full = `${page.title}${TITLE_SUFFIX}`;
        assert.ok(full.length <= 60, `${page.id}: "${full}" is ${full.length} characters`);
    }
});

test("every page has a description of at most 155 characters", () => {
    for (const page of pages) {
        assert.ok(page.description.length >= 70, `${page.id}: description is too short`);
        assert.ok(
            page.description.length <= 155,
            `${page.id}: description is ${page.description.length} characters`
        );
    }
});

test("paths, names, titles and descriptions are unique", () => {
    for (const field of ["path", "name", "title", "description"]) {
        const values = pages.map((page) => page[field]);
        assert.equal(new Set(values).size, values.length, `duplicate ${field}`);
    }
});

test("every page belongs to a section and has what its cards need", () => {
    for (const page of pages) {
        assert.ok(SECTIONS[page.section], `${page.id}: unknown section ${page.section}`);
        assert.ok(page.path.startsWith(`${SECTIONS[page.section].path}/`), page.id);
        assert.ok(page.name && page.teaches.length > 0, page.id);
        assert.match(page.updatedAt, /^\d{4}-\d{2}-\d{2}$/, page.id);
    }
});

test("every sorter has exactly one page, addressed by its slug", () => {
    assert.deepEqual(SORT_PAGE_LIST.map((page) => page.key).sort(), Object.keys(SORTERS).sort());
    for (const [slug, page] of Object.entries(SORT_PAGES)) {
        assert.equal(page.id, slug);
        assert.equal(page.path, `/algorithms/sorting/${slug}`);
        assert.ok(page.h1 && page.intro && page.share.accent && page.share.subtitle, slug);
    }
});

test("the learning path numbers the tools 1, 2, 3 …", () => {
    assert.deepEqual(
        LEARNING_PATH.map((tool) => tool.pathOrder),
        LEARNING_PATH.map((_, index) => index + 1)
    );
    for (const tool of LEARNING_PATH) {
        assert.ok(tool.card.body && tool.card.short && tool.card.tags.length > 0, tool.id);
        assert.ok(ROADMAP_GROUPS.includes(tool.group), tool.id);
    }
});

test("planned topics are unique and land in a known section and roadmap group", () => {
    const names = PLANNED.map((topic) => topic.name);
    assert.equal(new Set(names).size, names.length);
    for (const topic of PLANNED) {
        assert.ok(SECTIONS[topic.section], topic.name);
        assert.ok(ROADMAP_GROUPS.includes(topic.group), topic.name);
        assert.ok(topic.note, topic.name);
    }
});

test("the sitemap lists every page exactly once with a real date", () => {
    const entries = sitemapEntries();
    const paths = entries.map((entry) => entry.path);
    assert.equal(new Set(paths).size, paths.length);
    for (const page of [...pages, ...Object.values(SECTIONS)]) {
        assert.ok(paths.includes(page.path), `${page.path} is missing from the sitemap`);
    }
    assert.ok(paths.includes("/"));
    for (const entry of entries) {
        assert.match(entry.lastModified, /^\d{4}-\d{2}-\d{2}$/, entry.path);
    }
});

test("buildMetadata sets every field a child route would otherwise inherit", () => {
    for (const page of pages) {
        const image = `${page.path}/opengraph-image`;
        const meta = buildMetadata({ ...page, image });
        assert.equal(meta.alternates.canonical, page.path);
        assert.equal(meta.openGraph.url, page.path);
        assert.equal(meta.openGraph.images[0].url, image);
        assert.equal(meta.twitter.images[0].url, image);
        assert.equal(meta.description, page.description);
    }
});

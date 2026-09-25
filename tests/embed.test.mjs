import test from "node:test";
import assert from "node:assert/strict";
import { EMBED_HEIGHT, embedSnippet, isEmbedSearch, toolForPath, withEmbed } from "../src/lib/embed.js";
import { TOOLS } from "../src/lib/catalog.js";

test("the embed flag is read from a search string", () => {
    assert.equal(isEmbedSearch("?embed=1"), true);
    assert.equal(isEmbedSearch("embed=1"), true);
    assert.equal(isEmbedSearch("?a=2&embed=1"), true);
    for (const search of ["", "?", "?embed=0", "?embed=true", "?embedded=1", undefined, null]) {
        assert.equal(isEmbedSearch(search), false, String(search));
    }
});

test("internal links gain the embed flag and keep their query and hash", () => {
    assert.equal(withEmbed("/algorithms/grid/flood-fill"), "/algorithms/grid/flood-fill?embed=1");
    assert.equal(withEmbed("/a?x=1"), "/a?x=1&embed=1");
    assert.equal(withEmbed("/a#g=abc&s=3"), "/a?embed=1#g=abc&s=3");
    assert.equal(withEmbed("/a?x=1#h"), "/a?x=1&embed=1#h");
    assert.equal(withEmbed("/a?embed=1#h"), "/a?embed=1#h");
    assert.equal(withEmbed("/a?embed=0"), "/a?embed=1");
    assert.equal(withEmbed("/"), "/?embed=1");
});

test("hash-only, external and empty links are left alone", () => {
    for (const href of ["#g=abc", "#", "https://github.com/salsadsid/visualizer", "//cdn.example.com/x", "mailto:a@b.c", "", undefined, null]) {
        assert.equal(withEmbed(href), href, String(href));
    }
});

test("the iframe snippet carries the page, the hash and an escaped title", () => {
    const snippet = embedSnippet({
        url: "https://visualizer-gold.vercel.app/data-structures/arrays/matrix/transpose",
        hash: "#g=abc&s=3",
        title: 'Transpose a Matrix · "DSA" <Visualizer>',
    });
    assert.match(snippet, /^<iframe src="https:\/\/visualizer-gold\.vercel\.app\/data-structures\/arrays\/matrix\/transpose\?embed=1#g=abc&amp;s=3" /);
    assert.match(snippet, new RegExp(`width="100%" height="${EMBED_HEIGHT}" `));
    assert.match(snippet, /style="border:0;border-radius:12px" loading="lazy" /);
    assert.match(snippet, /title="Transpose a Matrix · &quot;DSA&quot; &lt;Visualizer&gt;"><\/iframe>$/);
    assert.equal(embedSnippet({ url: "https://x.test/p", title: "P" }), '<iframe src="https://x.test/p?embed=1" width="100%" height="720" style="border:0;border-radius:12px" loading="lazy" title="P"></iframe>');
    assert.match(embedSnippet({ url: "https://x.test/p", title: "P", height: 500 }), / height="500" /);
});

test("a pathname maps to the most specific catalog tool", () => {
    assert.equal(toolForPath("/algorithms/sorting/bubble-sort"), "sorting");
    assert.equal(toolForPath("/algorithms/sorting"), "sorting");
    assert.equal(toolForPath("/data-structures/arrays"), "arrays");
    assert.equal(toolForPath("/data-structures/arrays/1d"), "arrays1d");
    assert.equal(toolForPath("/data-structures/arrays/traversal/spiral"), "traversals");
    assert.equal(toolForPath("/data-structures/arrays/matrix/multiply"), "matrix");
    assert.equal(toolForPath("/algorithms/grid/flood-fill"), "grid");
    assert.equal(toolForPath("/algorithms/complexity"), "complexity");
    for (const path of ["/", "/roadmap", "/data-structures", "/algorithms", "/data-structures/arraysx"]) {
        assert.equal(toolForPath(path), null, path);
    }
    for (const tool of Object.values(TOOLS)) assert.equal(toolForPath(tool.path), tool.id);
});

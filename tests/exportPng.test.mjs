import test from "node:test";
import assert from "node:assert/strict";
import { captionFor, siteHost, snapshotFilename } from "../src/lib/exportPng.js";

test("snapshot filenames are slugs with an optional step", () => {
    assert.equal(snapshotFilename({ page: "transpose", step: 6 }), "dsa-visualizer-transpose-step-6.png");
    assert.equal(snapshotFilename({ page: "2D Array" }), "dsa-visualizer-2d-array.png");
    assert.equal(snapshotFilename({ page: "  Matrix · Multiply!! " }), "dsa-visualizer-matrix-multiply.png");
    assert.equal(snapshotFilename({ page: "flood-fill", step: 0 }), "dsa-visualizer-flood-fill-step-0.png");
    assert.equal(snapshotFilename({ page: "flood-fill", step: 1.5 }), "dsa-visualizer-flood-fill.png");
    assert.equal(snapshotFilename({ page: "flood-fill", step: null }), "dsa-visualizer-flood-fill.png");
});

test("captions name the page, the step and the domain", () => {
    assert.equal(siteHost(), "visualizer-gold.vercel.app");
    assert.equal(captionFor({ name: "Spiral Traversal", step: 6, total: 14 }), "Spiral Traversal · step 6 of 14 · visualizer-gold.vercel.app");
    assert.equal(captionFor({ name: "2D Array Visualizer" }), "2D Array Visualizer · visualizer-gold.vercel.app");
    assert.equal(captionFor({ name: "Access", step: 1, total: 1 }), "Access · visualizer-gold.vercel.app");
    assert.equal(captionFor({ name: "X", step: "3", total: 5 }), "X · visualizer-gold.vercel.app");
});

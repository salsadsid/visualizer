import test from "node:test";
import assert from "node:assert/strict";
import nextConfig from "../next.config.mjs";

test("the Turbopack build cache stays off so a deploy cannot reuse a stale stylesheet", () => {
    assert.equal(nextConfig.experimental.turbopackFileSystemCacheForBuild, false);
});

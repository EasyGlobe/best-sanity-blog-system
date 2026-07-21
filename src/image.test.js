import assert from "node:assert/strict";
import test from "node:test";
import { createSanityImageUrlResolver, resolveSanityImageUrl } from "./image.js";

const source = {
  asset: {
    _type: "reference",
    _ref: "image-0123456789abcdef0123456789abcdef01234567-1200x800-jpg"
  }
};

const projectId = ["exam", "ple1"].join("");

test("resolves portable Sanity image URLs without project hardcoding", () => {
  const url = resolveSanityImageUrl(source, {
    projectId,
    dataset: "production",
    width: 1200
  });

  assert.match(url, new RegExp(`cdn\\.sanity\\.io/images/${projectId}/production`));
  assert.match(url, /w=1200/);
  assert.match(url, /auto=format/);
});

test("creates a reusable image URL resolver and ignores empty sources", () => {
  const resolve = createSanityImageUrlResolver({ projectId, dataset: "production" });

  assert.equal(resolve(undefined), undefined);
  assert.equal(resolve({}), undefined);
  assert.match(resolve(source), /w=1600/);
});

test("resolves materialized Sanity CDN URLs", () => {
  const url = resolveSanityImageUrl(
    { url: `https://cdn.sanity.io/images/${projectId}/production/abc-1200x800.jpg` },
    { projectId, dataset: "production", width: 800 }
  );

  assert.match(url, /abc-1200x800\.jpg\?w=800/);
});

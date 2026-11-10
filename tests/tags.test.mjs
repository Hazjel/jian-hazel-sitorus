import assert from "node:assert/strict";
import test from "node:test";
import { hasTag, uniqueTags } from "../src/lib/tags.js";

const projects = [
  { tags: ["scikit-learn", "Python"] },
  { tags: ["Scikit-Learn"] },
  { tags: [" Scikit-learn "] },
  { tags: null },
];

test("tag variants that differ only in case or spacing collapse into one label", () => {
  assert.deepEqual(uniqueTags(projects), ["Python", "scikit-learn"]);
});

test("selecting the deduped tag matches every project that carries any variant", () => {
  assert.equal(projects.filter((p) => hasTag(p, "scikit-learn")).length, 3);
});

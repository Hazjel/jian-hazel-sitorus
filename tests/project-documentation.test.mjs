import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../src/components/admin/ProjectDialog.jsx", import.meta.url), "utf8");
const start = source.indexOf("    const onSubmit = async (values) => {");
const end = source.indexOf("\n    return (", start);
assert.ok(start >= 0 && end > start, "ProjectDialog submit handler must be available");

async function saveProject(projectToEdit, documentationFiles = []) {
  let saved;
  const errors = [];
  const supabase = {
    storage: {
      from: () => ({
        upload: async () => ({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://example.com/new-documentation.png" } }),
      }),
    },
    from(table) {
      assert.equal(table, "projects");
      return {
        update(payload) {
          saved = payload;
          return { eq: async () => ({ error: null }) };
        },
        async insert([payload]) {
          saved = payload;
          return { error: null };
        },
      };
    },
  };
  // Exercise the real handler while replacing only its external storage/database boundary.
  const submit = new Function(
    "setLoading", "imageFile", "documentationFiles", "projectToEdit", "supabase",
    "toast", "handleOpenChange", "onSuccess",
    `${source.slice(start, end)}\nreturn onSubmit;`,
  )(() => {}, null, documentationFiles, projectToEdit, supabase,
    { success() {}, error: (message) => errors.push(message) }, () => {}, () => {});
  await submit({ title: "Existing project", description: "Updated description", tags: "Python", project_date: "2026-01", image_url: "", demo_link: "", repo_link: "" });
  assert.deepEqual(errors, []);
  return saved;
}

test("editing a project preserves existing documentation without another upload", async () => {
  const existing = { id: "project-1", documentation_urls: ["https://example.com/original.png"] };
  const saved = await saveProject(existing);
  assert.deepEqual(saved.documentation_urls, ["https://example.com/original.png"]);
});

test("uploading documentation appends it without mutating the existing project", async () => {
  const existing = { id: "project-1", documentation_urls: ["https://example.com/original.png"] };
  const saved = await saveProject(existing, [{ name: "additional.png" }]);
  assert.deepEqual(saved.documentation_urls, ["https://example.com/original.png", "https://example.com/new-documentation.png"]);
  assert.deepEqual(existing.documentation_urls, ["https://example.com/original.png"]);
});

test("creating a project without documentation stores an empty list", async () => {
  const saved = await saveProject(null);
  assert.deepEqual(saved.documentation_urls, []);
});

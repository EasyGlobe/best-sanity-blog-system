import { defineConfig } from "sanity";
import { createBlogStudioIntegration } from "../../src/studio.js";

const blog = createBlogStudioIntegration();

export default defineConfig({
  name: "blog-system-smoke-test",
  title: "Blog System Smoke Test",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? ["exam", "ple1"].join(""),
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [...blog.plugins],
  form: blog.form,
  schema: {
    types: blog.schemaTypes
  }
});

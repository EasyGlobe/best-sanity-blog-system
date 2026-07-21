import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? ["exam", "ple1"].join(""),
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production"
  }
});

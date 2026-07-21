import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "best-sanity-blog-studio-"));
const sanity = join(root, "node_modules", ".bin", "sanity");

try {
  const result = spawnSync(sanity, ["build", output, "--yes"], {
    cwd: join(root, "tests", "studio"),
    stdio: "inherit"
  });

  if (result.error) {
    throw result.error;
  }

  process.exitCode = result.status ?? 1;
} finally {
  rmSync(output, { recursive: true, force: true });
}

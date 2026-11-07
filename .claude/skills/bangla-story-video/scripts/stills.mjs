// Render check stills (half-res JPEG) from a Remotion project without re-bundling per frame.
// Usage: node stills.mjs <projectDir> <compositionId> <outDir> <frame> [frame...]
// Copy into the project dir first if module resolution fails (it needs @remotion/bundler + renderer).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
const [root, id, out, ...fr] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id });
for (const f of fr.map(Number)) {
  await renderStill({ serveUrl, composition, frame: f, output: `${out}/f${String(f).padStart(5, "0")}.jpg`, imageFormat: "jpeg", scale: 0.5 });
  console.log("still", f);
}

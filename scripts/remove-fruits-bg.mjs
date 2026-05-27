/**
 * AI background removal for src/assets/fruits (requires rembg).
 * Install once: pip install "rembg[cpu]" onnxruntime
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pyScript = path.join(__dirname, "remove-fruits-bg.py");

const result = spawnSync("python", [pyScript], { stdio: "inherit" });

if (result.status !== 0) {
  console.error(
    "\nBackground removal failed. Install dependencies:\n  pip install \"rembg[cpu]\" onnxruntime\n",
  );
  process.exit(result.status ?? 1);
}

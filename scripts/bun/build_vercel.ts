import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

declare const Bun: any;

const outputDir = "dist";
const assetDir = join(outputDir, "assets", "dist");

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

for (const name of readdirSync("public")) {
  if (name !== "assets") {
    cpSync(join("public", name), join(outputDir, name), { recursive: true });
  }
}

mkdirSync(join(outputDir, "assets"), { recursive: true });
cpSync(
  "node_modules/monaco-editor/min/vs",
  join(outputDir, "assets", "monaco"),
  { recursive: true },
);

writeFileSync(
  join(outputDir, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FarmBot Web App assets</title>
  </head>
  <body>
    <p>This Vercel deployment serves static assets only.</p>
    <p>The FarmBot Rails application must be hosted separately.</p>
  </body>
</html>
`,
);

process.env.NODE_ENV = "production";
process.env.ASSET_JS_ENTRIES = JSON.stringify([
  "frontend/main_app/index.tsx",
  "frontend/front_page/index.tsx",
  "frontend/password_reset/index.tsx",
  "frontend/tos_update/index.tsx",
  "frontend/demo/index.tsx",
  "frontend/try_farmbot/index.tsx",
  "frontend/promo/index.tsx",
  "frontend/os_download/index.tsx",
  "frontend/terminal/index.tsx",
]);
process.env.ASSET_CSS_ENTRIES = JSON.stringify([
  ["frontend/css/_index.scss", `${assetDir}/css/index.css`],
  ["frontend/css/xterm.css", `${assetDir}/css/xterm.css`],
]);
process.env.ASSET_OUTDIR = assetDir;
process.env.ASSET_PUBLIC_PATH = "/assets/dist/";

const build = Bun.spawn(["bun", "scripts/bun/build.ts"], {
  env: process.env,
  stdout: "inherit",
  stderr: "inherit",
});
process.exit(await build.exited);

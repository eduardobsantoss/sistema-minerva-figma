#!/usr/bin/env node
/**
 * Compares screenshots of the original React app against the new Vue app,
 * view by view, to verify the Vue migration did not change any pixels.
 *
 * Usage:
 *   node scripts/visual-diff.mjs --react=http://localhost:5183 --vue=http://localhost:5174
 *
 * For each entry in VIEWS below it:
 *   1. Opens `${baseUrl}/?view=${key}` in both apps (bypasses the login screen).
 *   2. Screenshots the full page at a fixed viewport.
 *   3. Diffs the two screenshots with pixelmatch.
 *   4. Writes screenshots + a diff image to scripts/visual-diff-output/<key>/.
 *
 * Requires the two dev servers to already be running (see README output of
 * this script for suggested commands).
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'visual-diff-output');

const VIEWS = [
  { key: 'login', path: '/' },
  { key: 'dashboard', path: '/?view=dashboard' },
  { key: 'solicitacoes', path: '/?view=solicitacoes' },
  { key: 'fidcs', path: '/?view=fidcs' },
  { key: 'cras', path: '/?view=cras' },
  { key: 'cobranca-notif', path: '/?view=cobranca-notif' },
  { key: 'risco-ratings', path: '/?view=risco-ratings' },
  { key: 'risco-agrupamentos', path: '/?view=risco-agrupamentos' },
  { key: 'risco-grupos', path: '/?view=risco-grupos' },
  { key: 'risco-rel', path: '/?view=risco-rel' },
  { key: 'risco-dashboard', path: '/?view=risco-dashboard' },
];

function arg(name, fallback) {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : fallback;
}

const reactBase = arg('react', 'http://localhost:5183');
const vueBase = arg('vue', 'http://localhost:5174');
const viewport = { width: 1440, height: 900 };

async function screenshot(browser, url) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: 'networkidle' });
  // Let CSS transitions/animations settle.
  await page.waitForTimeout(400);
  const buffer = await page.screenshot({ fullPage: true });
  await page.close();
  return buffer;
}

function diffPngs(bufA, bufB, outPath) {
  const a = PNG.sync.read(bufA);
  const b = PNG.sync.read(bufB);
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const normalize = (img) => {
    if (img.width === width && img.height === height) return img;
    const canvas = new PNG({ width, height });
    PNG.bitblt(img, canvas, 0, 0, img.width, img.height, 0, 0);
    return canvas;
  };
  const na = normalize(a);
  const nb = normalize(b);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(na.data, nb.data, diff.data, width, height, {
    threshold: 0.1,
  });
  fs.writeFileSync(outPath, PNG.sync.write(diff));
  const totalPixels = width * height;
  return { diffPixels, totalPixels, pct: (diffPixels / totalPixels) * 100 };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  for (const view of VIEWS) {
    const dir = path.join(OUT_DIR, view.key);
    fs.mkdirSync(dir, { recursive: true });
    try {
      const [reactBuf, vueBuf] = await Promise.all([
        screenshot(browser, reactBase + view.path),
        screenshot(browser, vueBase + view.path),
      ]);
      fs.writeFileSync(path.join(dir, 'react.png'), reactBuf);
      fs.writeFileSync(path.join(dir, 'vue.png'), vueBuf);
      const { diffPixels, totalPixels, pct } = diffPngs(
        reactBuf,
        vueBuf,
        path.join(dir, 'diff.png'),
      );
      results.push({ view: view.key, diffPixels, totalPixels, pct, error: null });
    } catch (err) {
      results.push({ view: view.key, error: err.message });
    }
  }

  await browser.close();

  console.log('\n=== Visual diff summary (React baseline vs Vue) ===\n');
  for (const r of results) {
    if (r.error) {
      console.log(`${r.view.padEnd(20)} ERROR: ${r.error}`);
    } else {
      const flag = r.pct > 0.05 ? '⚠️ ' : '✅ ';
      console.log(
        `${flag}${r.view.padEnd(20)} ${r.diffPixels} / ${r.totalPixels} px diff (${r.pct.toFixed(4)}%)`,
      );
    }
  }
  console.log(`\nScreenshots + diff images written to ${OUT_DIR}\n`);
}

main();

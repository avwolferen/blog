// One-off script: scans content/blog for image references and verifies the files exist on disk.
import fs from 'fs';
import path from 'path';

const blogRoot = path.join(process.cwd(), 'content', 'blog');
const folders = fs.readdirSync(blogRoot).filter((f) => fs.statSync(path.join(blogRoot, f)).isDirectory());

const report = [];

for (const folder of folders) {
  const postDir = path.join(blogRoot, folder);
  const indexPath = path.join(postDir, 'index.md');
  if (!fs.existsSync(indexPath)) continue;

  const raw = fs.readFileSync(indexPath, 'utf8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = fmMatch ? fmMatch[1] : '';
  const body = fmMatch ? raw.slice(fmMatch[0].length) : raw;

  const refs = new Set();

  // frontmatter: coverImage / img
  for (const m of frontmatter.matchAll(/^(coverImage|img):\s*["']?(.+?)["']?\s*$/gm)) {
    refs.add(m[2].trim());
  }

  // markdown images ![alt](path)
  for (const m of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    refs.add(m[1].trim());
  }

  // html <img src="...">
  for (const m of body.matchAll(/<img[^>]+src=["']([^"']+)["']/g)) {
    refs.add(m[1].trim());
  }

  const broken = [];
  const external = [];
  for (let ref of refs) {
    if (/^https?:\/\//i.test(ref)) {
      external.push(ref);
      continue; // external images are reported separately, not existence-checked
    }
    if (ref.startsWith('/')) continue; // skip root-relative (public/) - not this post's own assets
    let cleaned = ref.startsWith('./') ? ref.slice(2) : ref;
    const resolved = path.join(postDir, cleaned);
    if (!fs.existsSync(resolved)) {
      broken.push({ ref, resolved: path.relative(blogRoot, resolved) });
    }
  }

  if (broken.length > 0 || external.length > 0) {
    report.push({ folder, broken, external });
  }
}

const withBroken = report.filter((r) => r.broken.length > 0);
const withExternal = report.filter((r) => r.external.length > 0);

if (withBroken.length === 0) {
  console.log('No broken local image references found.');
} else {
  console.log(`Found broken image references in ${withBroken.length} post(s):\n`);
  for (const { folder, broken } of withBroken) {
    console.log(`- ${folder}`);
    for (const b of broken) {
      console.log(`    ✗ ${b.ref}  (expected at content/blog/${b.resolved})`);
    }
  }
}

console.log();

if (withExternal.length === 0) {
  console.log('No externally-hosted images found.');
} else {
  console.log(`Found externally-hosted images in ${withExternal.length} post(s):\n`);
  for (const { folder, external } of withExternal) {
    console.log(`- ${folder}`);
    for (const url of external) {
      console.log(`    \u2192 ${url}`);
    }
  }
}

if (withBroken.length > 0 || withExternal.length > 0) {
  process.exitCode = 1;
}

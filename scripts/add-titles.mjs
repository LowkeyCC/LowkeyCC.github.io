import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const folders = ['masques', 'regles', 'guide-joueur', 'technique', 'bal'];
const rootFiles = ['index.md'];

function processFile(path) {
  const raw = readFileSync(path, 'utf8');
  if (raw.startsWith('---')) return; // déjà un frontmatter

  const lines = raw.split(/\r?\n/);
  let title = null;
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^#\s+(.+)$/);
    if (m) {
      title = m[1].trim();
      startIdx = i;
      break;
    }
    if (lines[i].trim() !== '') break; // première ligne non vide n'est pas un titre
  }
  if (!title) title = path.split(/[\\/]/).pop().replace(/\.md$/, '');

  const yamlTitle = JSON.stringify(title); // échappement YAML sûr
  const body = lines.slice(startIdx >= 0 ? startIdx : 0).join('\n');
  const out = `---\ntitle: ${yamlTitle}\n---\n\n${body.replace(/^\r?\n/, '')}`;
  writeFileSync(path, out, 'utf8');
  console.log('updated', path);
}

for (const f of folders) {
  const dir = join(process.cwd(), f);
  if (!statSync(dir, { throwIfNoEntry: false })) continue;
  for (const name of readdirSync(dir)) {
    if (name.endsWith('.md')) processFile(join(dir, name));
  }
}
for (const f of rootFiles) {
  const p = join(process.cwd(), f);
  if (statSync(p, { throwIfNoEntry: false })) processFile(p);
}

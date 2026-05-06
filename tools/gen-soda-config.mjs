import fs from 'fs';
import path from 'path';
const root = path.resolve('public/assets/source/icons');
const cwd = process.cwd().replace(/\\/g, '/');

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.png')) files.push(full.replace(/\\/g, '/'));
  }
}
walk(root);

function niceName(entry) {
  const parts = entry.split('/');
  const folder = parts[parts.length - 2];
  const base = path.posix.basename(entry, '.png');
  const cleanBase = base.replace(/^SODA_Icon_[A-Za-z]+_/, '');
  const name = folder.toLowerCase().replace(/s_/, '') + '/' + cleanBase.toLowerCase().replace(/_/g, '-') + '.png';
  // relative to project root
  const rel = entry.startsWith(cwd + '/') ? entry.slice(cwd.length + 1) : entry;
  return { source: rel, name };
}

const frames = files.map(niceName).sort((a, b) => a.name.localeCompare(b.name));

const configPath = 'tools/packed-atlases.config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
config.atlases = config.atlases.filter(a => a.id !== 'soda-icons');
config.atlases.push({
  id: 'soda-icons',
  outputImage: 'public/assets/atlases/soda-icons.png',
  outputJson: 'public/assets/atlases/soda-icons.atlas.json',
  padding: 2,
  targetWidth: 1024,
  frames: frames
});
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Updated packed-atlases.config.json with soda-icons. Frames:', frames.length);

import fs from 'fs';
import path from 'path';

function collect(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name === 'components' || entry.name === 'lib') continue;
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes = routes.concat(collect(full, rel));
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
      const route = '/' + base.replace(/\\index$/, '').replace(/\\/g, '/');
      routes.push(route === '' ? '/' : route);
    }
  }
  return routes;
}

const root = path.join(process.cwd(), 'app');
const routes = collect(root).sort();
console.log('Built routes:\n' + routes.join('\n'));

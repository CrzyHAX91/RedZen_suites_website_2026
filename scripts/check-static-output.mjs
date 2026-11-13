import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

async function verify(root) {
  for (const item of await readdir(root, { withFileTypes: true })) {
    const name = path.join(root, item.name);
    if (item.isDirectory()) await verify(name);
    else if (/\.cjs(?:\.map)?$|^server|^\.env|\.sql$/i.test(item.name)) {
      throw new Error('Server-only artifact in static output');
    } else if (/\.js$/.test(item.name) && /redzen_(?:early_access|property|investor)_leads_v1/.test(await readFile(name, 'utf8'))) {
      throw new Error('Legacy browser lead storage in public output');
    }
  }
}
await verify('dist');
console.log('Static output contains no server artifacts.');

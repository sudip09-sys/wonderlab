import {spawnSync} from 'node:child_process';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
const build=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build','--config','vite.pages.config.ts'],{stdio:'inherit'});
if(build.status!==0)process.exit(build.status??1);
await mkdir('dist-pages/art',{recursive:true});
for(const name of ['hero.webp','solar.webp'])await copyFile('public/art/'+name,'dist-pages/art/'+name);
await copyFile('public/favicon.svg','dist-pages/favicon.svg');
await writeFile('dist-pages/.nojekyll','');

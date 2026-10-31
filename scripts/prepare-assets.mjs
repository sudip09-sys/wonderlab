import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('sharp');
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#1c5148"/><path d="M210 142h92M226 146v96l-69 109c-14 23 2 51 29 51h140c27 0 43-28 29-51l-69-109v-96" fill="none" stroke="#d6f2d7" stroke-width="23" stroke-linecap="round" stroke-linejoin="round"/><path d="M198 326c33-21 62 23 108 1l28 45H178z" fill="#a5e2bd"/><circle cx="254" cy="281" r="10" fill="#eac987"/><circle cx="279" cy="303" r="7" fill="#eac987"/></svg>';
await fs.writeFile('public/favicon.svg',svg);
for(const size of [192,512])await sharp(Buffer.from(svg)).resize(size,size).png().toFile(`public/icons/icon-${size}.png`);
// Assets are compressed from original concept artwork, without changing the artwork.
for(const name of ['hero','solar'])await sharp(`public/art/${name}.png`).resize({width:1400,withoutEnlargement:true}).webp({quality:86}).toFile(`public/art/${name}.webp`);
console.log('PWA icons and web images prepared.');

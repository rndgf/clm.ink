import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';

const PROFILE_URL = 'https://www.instagram.com/clm.ink/';
const OUTPUT_DIR = path.resolve('public/images/gallery');
const MAX_IMAGES = 20;

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(get(res.headers.location));
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Request failed with status ${res.statusCode}`));
          res.resume();
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
      .on('error', reject);
  });
}

async function download(url, filename) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(download(res.headers.location, filename));
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Download failed with status ${res.statusCode}`));
          res.resume();
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', async () => {
          const buffer = Buffer.concat(chunks);
          await fs.writeFile(path.join(OUTPUT_DIR, filename), buffer);
          resolve();
        });
      })
      .on('error', reject);
  });
}

async function main() {
  console.log(`Scraping Instagram profile: ${PROFILE_URL}`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const html = await get(PROFILE_URL);

  // Instagram renvoie généralement des URLs d'images dans des champs "display_url"
  const urlRegex = /"display_url":"(https:[^"]+?\.jpg)"/g;
  const urls = [];

  for (const match of html.matchAll(urlRegex)) {
    const raw = match[1].replace(/\\u0026/g, '&');
    if (!urls.includes(raw)) {
      urls.push(raw);
    }
    if (urls.length >= MAX_IMAGES) break;
  }

  if (!urls.length) {
    console.error('No image URLs found. Instagram may require authentication or have changed its HTML.');
    console.error('You may need to run this script with cookies or update the scraping logic.');
    process.exit(1);
  }

  console.log(`Found ${urls.length} image URLs. Downloading to ${OUTPUT_DIR}...`);

  let index = 1;
  for (const url of urls) {
    const fileIndex = String(index).padStart(2, '0');
    const filename = `clm-${fileIndex}.jpg`;
    console.log(`→ [${index}/${urls.length}] ${filename}`);
    await download(url, filename);
    index += 1;
  }

  console.log('Done. Images saved under public/images/gallery.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


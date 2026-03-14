#!/usr/bin/env node
/**
 * Rename gallery images to SEO-friendly names: {folder}-01.jpg, {folder}-02.jpg, etc.
 * Keeps original extension (jpeg, jpg, png, webp). Run from project root.
 */

import { readdirSync, renameSync } from "node:fs";
import { join } from "node:path";

const galleryBase = "public/images/gallery";
const imageExt = /\.(jpe?g|png|webp)$/i;
const folders = ["geometric", "realism", "blackwork"];

for (const folder of folders) {
  const dirPath = join(galleryBase, folder);
  let entries;
  try {
    entries = readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    console.warn(`Skip ${dirPath}: ${err.message}`);
    continue;
  }

  const files = entries
    .filter((e) => e.isFile() && imageExt.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) continue;

  const pad = String(files.length).length;
  const tempPrefix = "__tmp_";

  for (let i = 0; i < files.length; i++) {
    const oldName = files[i];
    const ext = oldName.replace(/^.*\./, "").toLowerCase();
    const newName = `${folder}-${String(i + 1).padStart(pad, "0")}.${ext}`;
    const oldPath = join(dirPath, oldName);
    const tempPath = join(dirPath, tempPrefix + newName);
    const newPath = join(dirPath, newName);

    try {
      renameSync(oldPath, tempPath);
    } catch (err) {
      console.error(`Failed to rename ${oldName}: ${err.message}`);
    }
  }

  const tempFiles = readdirSync(dirPath).filter((n) => n.startsWith(tempPrefix));
  for (const tempName of tempFiles) {
    const newName = tempName.slice(tempPrefix.length);
    const tempPath = join(dirPath, tempName);
    const newPath = join(dirPath, newName);
    try {
      renameSync(tempPath, newPath);
      console.log(`${folder}/${newName}`);
    } catch (err) {
      console.error(`Failed to rename ${tempName}: ${err.message}`);
    }
  }
}

console.log("Done.");

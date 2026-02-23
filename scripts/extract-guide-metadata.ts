#!/usr/bin/env npx tsx
/**
 * Extract guide screenshot metadata for annotation-driven cropping.
 * Reads guides.ts and outputs image path -> annotations map to guide-screenshot-regions.json.
 * Run: npx tsx scripts/extract-guide-metadata.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { guides } from '../app/webapp/guide/data/guides';

type Annotation = { x: number; y: number };

const imageToAnnotations = new Map<string, Annotation[]>();

for (const guide of guides) {
  for (const step of guide.steps) {
    const screenshot = step.content?.screenshot;
    if (!screenshot?.image || !screenshot.annotations?.length) continue;

    const img = screenshot.image.startsWith('/') ? screenshot.image : `/${screenshot.image}`;
    const existing = imageToAnnotations.get(img) ?? [];
    for (const a of screenshot.annotations) {
      existing.push({ x: a.x, y: a.y });
    }
    imageToAnnotations.set(img, existing);
  }
}

const regions: Record<string, Annotation[]> = {};
for (const [path, annotations] of imageToAnnotations) {
  regions[path] = annotations;
}

const outPath = join(__dirname, 'guide-screenshot-regions.json');
writeFileSync(outPath, JSON.stringify(regions, null, 2), 'utf8');
console.log(`Wrote ${Object.keys(regions).length} image regions to ${outPath}`);

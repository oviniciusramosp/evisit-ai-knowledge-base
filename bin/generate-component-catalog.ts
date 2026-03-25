#!/usr/bin/env ts-node

/**
 * generate-component-catalog.ts
 *
 * Lists all directories in src/ev-components/ and checks for:
 *   - index.ts barrel export
 *   - .stories.tsx file
 *   - __tests__/ directory
 *
 * Outputs a markdown summary to stdout, or to a file with --output <path>.
 *
 * Usage:
 *   npx ts-node bin/generate-component-catalog.ts
 *   npx ts-node bin/generate-component-catalog.ts --output docs/component-status.md
 */
import { readdirSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';

const COMPONENTS_DIR = resolve(__dirname, '..', 'src', 'ev-components');

const outputFlagIndex = process.argv.indexOf('--output');
const outputPath =
  outputFlagIndex !== -1 ? process.argv[outputFlagIndex + 1] : null;

const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name));

const rows: Array<{
  name: string;
  hasBarrel: boolean;
  hasStory: boolean;
  hasTests: boolean;
}> = [];

for (const entry of entries) {
  const dirPath = join(COMPONENTS_DIR, entry.name);

  const hasBarrel =
    existsSync(join(dirPath, 'index.ts')) ||
    existsSync(join(dirPath, 'index.tsx'));

  const hasStory = readdirSync(dirPath)
    .some(f => f.endsWith('.stories.tsx'));

  const hasTests = existsSync(join(dirPath, '__tests__'));

  rows.push({ name: entry.name, hasBarrel, hasStory, hasTests });
}

const yn = (val: boolean) => (val ? 'Yes' : 'No');

const lines: string[] = [
  '# ev-components Catalog',
  '',
  `> Auto-generated on ${new Date().toISOString().split('T')[0]}`,
  '',
  `| Component | Barrel Export | Story | Tests |`,
  `| --------- | ------------ | ----- | ----- |`,
];

for (const row of rows) {
  lines.push(
    `| ${row.name} | ${yn(row.hasBarrel)} | ${yn(row.hasStory)} | ${yn(row.hasTests)} |`,
  );
}

const totalComponents = rows.length;
const withBarrel = rows.filter(r => r.hasBarrel).length;
const withStory = rows.filter(r => r.hasStory).length;
const withTests = rows.filter(r => r.hasTests).length;

lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- **Total components**: ${totalComponents}`);
lines.push(
  `- **With barrel export**: ${withBarrel}/${totalComponents} (${Math.round((withBarrel / totalComponents) * 100)}%)`,
);
lines.push(
  `- **With stories**: ${withStory}/${totalComponents} (${Math.round((withStory / totalComponents) * 100)}%)`,
);
lines.push(
  `- **With tests**: ${withTests}/${totalComponents} (${Math.round((withTests / totalComponents) * 100)}%)`,
);

const output = lines.join('\n') + '\n';

if (outputPath) {
  const resolvedOutput = resolve(outputPath);
  mkdirSync(dirname(resolvedOutput), { recursive: true });
  writeFileSync(resolvedOutput, output, 'utf-8');
  // eslint-disable-next-line no-console
  console.log(`Catalog written to ${resolvedOutput}`);
} else {
  process.stdout.write(output);
}

#!/usr/bin/env node
import { globSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseFrontmatter } from 'ultramatter';

const readmePath = 'MAIN_README.md';

const root = new URL('..', import.meta.url).pathname;
const recipeDir = join(root, 'recipes');
const files = globSync('*.md', {
    cwd: recipeDir,
    exclude: ['creating-recipes.md']
}).sort();

const parse = (file) => {
    const { content, frontmatter = {} } = parseFrontmatter(
        readFileSync(join(recipeDir, file), 'utf8'),
    );
    const title = content.match(/^#\s+(.+)$/m)?.[1] ?? frontmatter.feature ?? file.replace(/\.md$/, '');
    const description = content
        .replace(/^#\s+.+$/m, '')
        .split(/^##\s+/m)[0]
        .trim();
    const prompt = content.match(/## Agent prompt\n\n```text\n([\s\S]*?)\n```/)?.[1]?.trim();

    return { file, title, description, prompt, ...frontmatter };
};

const recipeBlocks = files.map(parse).filter(recipe => recipe.status !== 'draft').map((recipe) => {
    const base = recipe.base || 'main';
    const branch = recipe.branch || `recipe/${recipe.file.replace(/\.md$/, '')}`;
    const description = recipe.description ? `\n${recipe.description}\n` : '';
    const prompt = recipe.prompt
        ? `\n<details>\n<summary>Agent prompt</summary>\n\n\`\`\`text\n${recipe.prompt}\n\`\`\`\n\n</details>\n`
        : '';

    return `### ${recipe.title}${description}${prompt}\nNot using an agent?\n\n- [Applied branch](../../tree/${branch})\n- [Diff](../../compare/${base}...${branch})`;
});

const section = `<!-- recipes:start -->\n\n## Recipes\n\nThese recipes can be applied with an agent, or copied from the applied branches.\n\n${recipeBlocks.length ? recipeBlocks.join('\n\n') : '_No recipes yet._'}\n\n<!-- recipes:end -->`;
const readme = readFileSync(readmePath, 'utf8');
const marker = /<!-- recipes:start -->[\s\S]*?<!-- recipes:end -->/;
const next = marker.test(readme) ? readme.replace(marker, section) : `${readme.trimEnd()}\n\n${section}\n`;
writeFileSync(readmePath, next);
console.log(`Updated ${readmePath}`);

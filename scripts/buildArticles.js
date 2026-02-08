const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT_DIR = path.join(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'articles');
const SOURCE_INDEX_PATH = path.join(ARTICLES_DIR, 'index.json');
const OUTPUT_DIR = path.join(ROOT_DIR, 'data', 'articles');

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function validateDate(dateText, slug) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(dateText), `Invalid date format for "${slug}": ${dateText}`);
}

function validateSlug(slug) {
    assert(/^[a-z0-9-]+$/.test(slug), `Invalid slug: "${slug}" (allowed: a-z, 0-9, -)`);
}

function extractHeadings(markdown) {
    const tokens = marked.lexer(markdown);
    return tokens
        .filter((token) => token.type === 'heading' && (token.depth === 2 || token.depth === 3))
        .map((token) => ({
            depth: token.depth,
            text: token.text
        }));
}

function loadArticleEntries() {
    assert(fs.existsSync(SOURCE_INDEX_PATH), `Missing file: ${SOURCE_INDEX_PATH}`);
    const entries = readJson(SOURCE_INDEX_PATH);
    assert(Array.isArray(entries), 'articles/index.json must be an array');
    assert(entries.length > 0, 'articles/index.json must contain at least one article');
    return entries;
}

function ensureOutputDir() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function buildArticle(entry, usedSlugs) {
    const requiredFields = ['slug', 'title', 'date', 'summary', 'source'];
    requiredFields.forEach((field) => {
        assert(typeof entry[field] === 'string' && entry[field].trim().length > 0, `Missing required field "${field}"`);
    });

    const slug = entry.slug.trim();
    validateSlug(slug);
    validateDate(entry.date.trim(), slug);

    assert(!usedSlugs.has(slug), `Duplicated slug: "${slug}"`);
    usedSlugs.add(slug);

    const sourcePath = path.join(ARTICLES_DIR, entry.source);
    assert(fs.existsSync(sourcePath), `Missing markdown source for "${slug}": ${sourcePath}`);

    const markdown = fs.readFileSync(sourcePath, 'utf8');
    assert(markdown.trim().length > 0, `Markdown is empty: ${entry.source}`);

    const html = marked.parse(markdown, { gfm: true, breaks: false });
    assert(typeof html === 'string' && html.trim().length > 0, `Failed to parse markdown for "${slug}"`);

    const articleData = {
        slug,
        title: entry.title.trim(),
        date: entry.date.trim(),
        summary: entry.summary.trim(),
        html,
        headings: extractHeadings(markdown)
    };

    const articleOutputPath = path.join(OUTPUT_DIR, `${slug}.json`);
    fs.writeFileSync(articleOutputPath, JSON.stringify(articleData, null, 2));

    return {
        slug: articleData.slug,
        title: articleData.title,
        date: articleData.date,
        summary: articleData.summary
    };
}

function main() {
    ensureOutputDir();
    const entries = loadArticleEntries();
    const usedSlugs = new Set();
    const outputIndex = entries.map((entry) => buildArticle(entry, usedSlugs));

    const indexOutputPath = path.join(OUTPUT_DIR, 'index.json');
    fs.writeFileSync(indexOutputPath, JSON.stringify(outputIndex, null, 2));
    console.log(`Built ${outputIndex.length} articles to ${OUTPUT_DIR}`);
}

if (require.main === module) {
    try {
        main();
    } catch (error) {
        console.error('Failed to build articles:', error.message);
        process.exit(1);
    }
}

module.exports = { main };

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const readline = require('readline/promises');
const { stdin, stdout } = require('process');

const ROOT_DIR = path.join(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'articles');
const SOURCE_INDEX_PATH = path.join(ARTICLES_DIR, 'index.json');

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function validateSlug(slug) {
    assert(/^[a-z0-9-]+$/.test(slug), `Invalid slug: "${slug}" (allowed: a-z, 0-9, -)`);
}

function validateDate(dateText) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(dateText), `Invalid date format: "${dateText}" (expected: YYYY-MM-DD)`);
}

function loadEntries() {
    assert(fs.existsSync(SOURCE_INDEX_PATH), `Missing file: ${SOURCE_INDEX_PATH}`);
    const entries = readJson(SOURCE_INDEX_PATH);
    assert(Array.isArray(entries), 'articles/index.json must be an array');
    return entries;
}

function askRequired(rl, label) {
    return rl.question(`${label}: `).then((value) => {
        const trimmed = value.trim();
        assert(trimmed.length > 0, `${label} is required`);
        return trimmed;
    });
}

function createMarkdownTemplate(title) {
    return [
        `# ${title}`,
        '',
        'ここに導入文を書いてください。',
        '',
        '## セクション見出し',
        '',
        '本文を追記してください。'
    ].join('\n');
}

function runBuildArticles() {
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    execFileSync(npmCommand, ['run', 'build-articles'], {
        cwd: ROOT_DIR,
        stdio: 'inherit'
    });
}

async function main() {
    const rl = readline.createInterface({ input: stdin, output: stdout });

    try {
        console.log('記事追加CLIを開始します。');
        const slug = await askRequired(rl, 'slug');
        const title = await askRequired(rl, 'title');
        const date = await askRequired(rl, 'date (YYYY-MM-DD)');
        const summary = await askRequired(rl, 'summary');

        validateSlug(slug);
        validateDate(date);

        const source = `${slug}.md`;
        const sourcePath = path.join(ARTICLES_DIR, source);
        const entries = loadEntries();

        assert(!entries.some((entry) => entry.slug === slug), `Duplicated slug: "${slug}"`);
        assert(!fs.existsSync(sourcePath), `Markdown already exists: ${sourcePath}`);

        console.log('\n以下の内容で作成します:');
        console.log(`- slug: ${slug}`);
        console.log(`- title: ${title}`);
        console.log(`- date: ${date}`);
        console.log(`- summary: ${summary}`);
        console.log(`- source: ${source}`);

        const confirm = (await rl.question('実行しますか？ (y/N): ')).trim().toLowerCase();
        assert(confirm === 'y', 'Canceled by user');

        fs.writeFileSync(sourcePath, `${createMarkdownTemplate(title)}\n`, 'utf8');

        const nextEntries = [
            ...entries,
            { slug, title, date, summary, source }
        ];
        writeJson(SOURCE_INDEX_PATH, nextEntries);

        runBuildArticles();

        console.log('\n記事の追加が完了しました。');
        console.log(`- Markdown: ${path.relative(ROOT_DIR, sourcePath)}`);
        console.log(`- Index: ${path.relative(ROOT_DIR, SOURCE_INDEX_PATH)}`);
    } finally {
        rl.close();
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error('Failed to add article:', error.message);
        process.exit(1);
    });
}


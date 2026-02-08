const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const readline = require('readline/promises');
const { stdin, stdout } = require('process');

const ROOT_DIR = path.join(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'articles');
const SOURCE_INDEX_PATH = path.join(ARTICLES_DIR, 'index.json');
const OUTPUT_DIR = path.join(ROOT_DIR, 'data', 'articles');

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

function askRequired(rl, label, guidance = '') {
    if (guidance) {
        console.log(guidance);
    }
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

function printFieldGuide() {
    console.log('\n入力ガイド:');
    console.log('- slug: URLに使う識別子（英小文字・数字・ハイフン）');
    console.log('  例: applied-information-pass-2025');
    console.log('- title: 記事タイトル');
    console.log('  例: 応用情報技術者試験に合格しました');
    console.log('- date (YYYY-MM-DD): 公開日');
    console.log('  例: 2025-12-25');
    console.log('- summary: 記事カードに表示する要約（1〜2文）');
    console.log('  例: 応用情報技術者試験の学習法と当日の振り返りをまとめました。');
}

function printCurrentArticles(entries) {
    console.log('\n現在の記事一覧:');
    if (entries.length === 0) {
        console.log('- (なし)');
        return;
    }

    entries.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.slug} | ${entry.date} | ${entry.title}`);
    });
}

async function askAction(rl) {
    console.log('\n操作を選択してください:');
    console.log('1) 追加');
    console.log('2) 削除');
    console.log('3) 一覧表示');
    const action = await askRequired(rl, 'action (1/2/3)');
    assert(['1', '2', '3'].includes(action), 'action must be 1, 2, or 3');
    return action;
}

async function addArticle(rl) {
    printFieldGuide();

    const slug = await askRequired(
        rl,
        'slug',
        '\nslugのルール: 英小文字・数字・ハイフンのみ（例: applied-information-pass-2025）'
    );
    const title = await askRequired(
        rl,
        'title',
        '\ntitleの例: 応用情報技術者試験に合格しました'
    );
    const date = await askRequired(
        rl,
        'date (YYYY-MM-DD)',
        '\ndateの例: 2025-12-25'
    );
    const summary = await askRequired(
        rl,
        'summary',
        '\nsummaryの例: 応用情報技術者試験の学習法と当日の振り返りをまとめました。'
    );

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
}

async function deleteArticle(rl) {
    const entries = loadEntries();
    assert(entries.length > 0, 'No articles found in articles/index.json');
    printCurrentArticles(entries);

    const targetInput = await askRequired(
        rl,
        'delete target',
        '\n削除したい記事の番号（例: 1）またはslug（例: internship-infra-lessons）を入力してください。'
    );
    const isNumericSelection = /^\d+$/.test(targetInput);

    let target = null;
    if (isNumericSelection) {
        const index = Number.parseInt(targetInput, 10) - 1;
        assert(index >= 0 && index < entries.length, `Invalid article number: "${targetInput}"`);
        target = entries[index];
    } else {
        validateSlug(targetInput);
        target = entries.find((entry) => entry.slug === targetInput);
        assert(target, `Article not found for slug: "${targetInput}"`);
    }

    assert(typeof target.source === 'string' && target.source.trim().length > 0, `Missing source for slug: "${target.slug}"`);

    const sourcePath = path.join(ARTICLES_DIR, target.source);
    const generatedPath = path.join(OUTPUT_DIR, `${target.slug}.json`);
    assert(fs.existsSync(sourcePath), `Markdown does not exist: ${sourcePath}`);

    console.log('\n以下を削除します:');
    console.log(`- slug: ${target.slug}`);
    console.log(`- title: ${target.title}`);
    console.log(`- source: ${target.source}`);

    const confirm = (await rl.question('削除を実行しますか？ (y/N): ')).trim().toLowerCase();
    assert(confirm === 'y', 'Canceled by user');

    fs.unlinkSync(sourcePath);
    const nextEntries = entries.filter((entry) => entry.slug !== target.slug);
    assert(nextEntries.length === entries.length - 1, `Failed to remove slug from index: "${target.slug}"`);
    writeJson(SOURCE_INDEX_PATH, nextEntries);

    if (fs.existsSync(generatedPath)) {
        fs.unlinkSync(generatedPath);
    }

    runBuildArticles();

    console.log('\n記事の削除が完了しました。');
    console.log(`- Removed markdown: ${path.relative(ROOT_DIR, sourcePath)}`);
    console.log(`- Updated index: ${path.relative(ROOT_DIR, SOURCE_INDEX_PATH)}`);
}

async function main() {
    const rl = readline.createInterface({ input: stdin, output: stdout });

    try {
        console.log('記事管理CLIを開始します。');
        const action = await askAction(rl);

        if (action === '1') {
            await addArticle(rl);
            return;
        }
        if (action === '2') {
            await deleteArticle(rl);
            return;
        }

        const entries = loadEntries();
        printCurrentArticles(entries);
    } finally {
        rl.close();
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error('Failed to manage article:', error.message);
        process.exit(1);
    });
}

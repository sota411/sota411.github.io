function formatArticleDate(dateText) {
    const parsed = new Date(dateText);
    if (Number.isNaN(parsed.getTime())) return dateText;
    return parsed.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function createArticleCard(article, index) {
    const delay = 100 + (index * 100);
    return `
        <a href="article.html?slug=${encodeURIComponent(article.slug)}" class="article-card-link" data-aos="fade-up" data-aos-delay="${delay}">
            <article class="article-card">
                <div class="article-card-meta">${formatArticleDate(article.date)}</div>
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
            </article>
        </a>
    `;
}

async function loadArticleIndex() {
    const response = await fetch('./data/articles/index.json');
    if (!response.ok) {
        throw new Error(`Failed to load article index: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error('Article index must be an array');
    }
    return data;
}

async function renderArticleList() {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;

    try {
        const articles = await loadArticleIndex();
        if (articles.length === 0) {
            grid.innerHTML = '<p class="article-empty-state">No articles published yet.</p>';
            return;
        }

        grid.innerHTML = articles.map((article, index) => createArticleCard(article, index)).join('');

        if (typeof window.applyLiquidGlassEffects === 'function') {
            window.applyLiquidGlassEffects(['.article-card']);
        }

        if (typeof AOS !== 'undefined') {
            if (typeof AOS.refreshHard === 'function') {
                AOS.refreshHard();
            } else {
                AOS.refresh();
            }
        }
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p class="article-empty-state">Failed to load articles.</p>';
    }
}

function renderArticleToc(contentElement, tocElement) {
    if (!tocElement) return;

    const headings = Array.from(contentElement.querySelectorAll('h2, h3'));
    if (headings.length === 0) {
        tocElement.innerHTML = '';
        tocElement.style.display = 'none';
        return;
    }

    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `section-${index + 1}`;
        }
    });

    const tocItems = headings.map((heading) => `
        <li class="${heading.tagName.toLowerCase() === 'h3' ? 'toc-depth-3' : 'toc-depth-2'}">
            <a href="#${heading.id}">${heading.textContent}</a>
        </li>
    `).join('');

    tocElement.innerHTML = `
        <h3>Contents</h3>
        <ul>${tocItems}</ul>
    `;
}

function removeDuplicatedTopHeading(contentElement, titleText) {
    const firstHeading = contentElement.querySelector('h1');
    if (!firstHeading) return;
    if (firstHeading.textContent.trim() !== titleText.trim()) return;
    firstHeading.remove();
}

async function renderArticleDetail() {
    const titleElement = document.getElementById('articleTitle');
    const dateElement = document.getElementById('articleDate');
    const contentElement = document.getElementById('articleContent');
    const tocElement = document.getElementById('articleToc');

    if (!titleElement || !dateElement || !contentElement) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
        titleElement.textContent = 'Article Not Found';
        dateElement.textContent = '';
        contentElement.innerHTML = '<p class="article-empty-state">Missing article slug.</p>';
        return;
    }

    try {
        const response = await fetch(`./data/articles/${encodeURIComponent(slug)}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load article: ${response.status}`);
        }

        const article = await response.json();
        titleElement.textContent = article.title;
        dateElement.textContent = formatArticleDate(article.date);
        contentElement.innerHTML = article.html;
        removeDuplicatedTopHeading(contentElement, article.title);
        document.title = `${article.title} | sota411`;
        renderArticleToc(contentElement, tocElement);

        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
    } catch (error) {
        console.error(error);
        titleElement.textContent = 'Article Not Found';
        dateElement.textContent = '';
        contentElement.innerHTML = '<p class="article-empty-state">Failed to load this article.</p>';
        if (tocElement) {
            tocElement.innerHTML = '';
            tocElement.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderArticleList();
    renderArticleDetail();
});

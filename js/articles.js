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
                <div class="article-card-readmore">
                    Read article
                    <i class="fas fa-arrow-right" aria-hidden="true"></i>
                </div>
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

function parseArticleTimestamp(article) {
    const timestamp = Date.parse(article.date);
    if (Number.isNaN(timestamp)) {
        throw new Error(`Invalid article date: ${article.date}`);
    }
    return timestamp;
}

function sortArticlesByDateDesc(articles) {
    return [...articles].sort((a, b) => parseArticleTimestamp(b) - parseArticleTimestamp(a));
}

function resolveArticleLimit(gridElement) {
    const rawLimit = gridElement.dataset.limit;
    if (!rawLimit) return null;

    const limit = Number.parseInt(rawLimit, 10);
    if (Number.isNaN(limit) || limit < 0) {
        throw new Error(`Invalid articles limit: ${rawLimit}`);
    }

    return limit;
}

function updateAosState() {
    if (typeof AOS === 'undefined') return;

    const isInitialized = document.documentElement.classList.contains('aos-initialized');
    if (!isInitialized) {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
        return;
    }

    if (typeof AOS.refreshHard === 'function') {
        AOS.refreshHard();
    } else {
        AOS.refresh();
    }
}

let tocObserver = null;
let tocScrollHandler = null;
let tocHashHandler = null;

function cleanupTocTracking() {
    if (tocObserver) {
        tocObserver.disconnect();
        tocObserver = null;
    }
    if (tocScrollHandler) {
        window.removeEventListener('scroll', tocScrollHandler);
        tocScrollHandler = null;
    }
    if (tocHashHandler) {
        window.removeEventListener('hashchange', tocHashHandler);
        tocHashHandler = null;
    }
}

function createHeadingId(text, index, usedIds) {
    const base = text
        .trim()
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-ぁ-んァ-ン一-龠]/g, '')
        .replace(/\-+/g, '-')
        .replace(/^\-|\-$/g, '');

    const fallback = `section-${index + 1}`;
    const seed = base.length > 0 ? base : fallback;
    let candidate = seed;
    let suffix = 2;

    while (usedIds.has(candidate)) {
        candidate = `${seed}-${suffix}`;
        suffix += 1;
    }

    usedIds.add(candidate);
    return candidate;
}

function setActiveTocLink(tocElement, headingId) {
    if (!tocElement) return;
    const links = tocElement.querySelectorAll('a');
    links.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${headingId}`;
        link.classList.toggle('is-active', isActive);
    });
}

function getCurrentHeadingId(headings, thresholdTop = 140) {
    let current = headings[0]?.id || null;
    headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top <= thresholdTop) {
            current = heading.id;
        }
    });
    return current;
}

function setupTocTracking(contentElement, tocElement) {
    cleanupTocTracking();

    if (!tocElement) return;
    const headings = Array.from(contentElement.querySelectorAll('h2, h3'));
    if (headings.length === 0) return;
    const headingIds = new Set(headings.map((heading) => heading.id));

    const syncActiveHeading = () => {
        const hashId = decodeURIComponent(window.location.hash || '').replace(/^#/, '');
        const isNearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        if (hashId && headingIds.has(hashId) && isNearBottom) {
            setActiveTocLink(tocElement, hashId);
            return;
        }

        const activeId = getCurrentHeadingId(headings);
        if (activeId) {
            setActiveTocLink(tocElement, activeId);
        }
    };

    tocObserver = new IntersectionObserver((entries) => {
        if (entries.length > 0) {
            syncActiveHeading();
        }
    }, {
        root: null,
        rootMargin: '-120px 0px -62% 0px',
        threshold: [0, 1]
    });

    headings.forEach((heading) => tocObserver.observe(heading));

    tocScrollHandler = syncActiveHeading;
    window.addEventListener('scroll', tocScrollHandler, { passive: true });
    tocHashHandler = syncActiveHeading;
    window.addEventListener('hashchange', tocHashHandler);

    const hash = decodeURIComponent(window.location.hash || '').replace(/^#/, '');
    if (hash && headings.some((heading) => heading.id === hash)) {
        setActiveTocLink(tocElement, hash);
        return;
    }

    const initialId = getCurrentHeadingId(headings, 220);
    if (initialId) {
        setActiveTocLink(tocElement, initialId);
    }
}

async function renderArticleList() {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;

    try {
        const articles = sortArticlesByDateDesc(await loadArticleIndex());
        if (articles.length === 0) {
            grid.innerHTML = '<p class="article-empty-state">No articles published yet.</p>';
            return;
        }

        const limit = resolveArticleLimit(grid);
        const displayedArticles = limit === null ? articles : articles.slice(0, limit);
        grid.innerHTML = displayedArticles.map((article, index) => createArticleCard(article, index)).join('');

        if (typeof window.applyLiquidGlassEffects === 'function') {
            window.applyLiquidGlassEffects(['.article-card']);
        }

        updateAosState();
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

    const usedIds = new Set();
    headings.forEach((heading, index) => {
        heading.id = createHeadingId(heading.textContent, index, usedIds);
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

    setupTocTracking(contentElement, tocElement);
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
    cleanupTocTracking();

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
        titleElement.textContent = 'Article Not Found';
        dateElement.textContent = '';
        contentElement.innerHTML = '<p class="article-empty-state">Missing article slug.</p>';
        if (tocElement) {
            tocElement.innerHTML = '';
            tocElement.style.display = 'none';
        }
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
        updateAosState();
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

// DOM要素の取得
const navContainer = document.querySelector('.nav-container');
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const sections = document.querySelectorAll('section');
const contactForm = document.getElementById('contactForm');
const navLinkItems = document.querySelectorAll('.nav-links li');

// タイピングアニメーションの設定
const typingContainer = document.querySelector('.typing-container');
const typingCursor = document.querySelector('.typing-cursor');
const textsToType = [
    "An IT vocational student",
    "Aspiring full-stack engineer",
    "Tech Enthusiast"
];
const typingConfig = {
    textIndex: 0,
    charIndex: 0,
    isDeleting: false,
    typingSpeed: 80,
    deletingSpeed: 40,
    delayBetweenTexts: 1000
};

// タイピングアニメーション関数
function typeText() {
    const currentText = textsToType[typingConfig.textIndex];
    let displayText = '';

    if (typingConfig.isDeleting) {
        displayText = currentText.substring(0, typingConfig.charIndex - 1);
        typingConfig.charIndex--;
    } else {
        displayText = currentText.substring(0, typingConfig.charIndex + 1);
        typingConfig.charIndex++;
    }

    if (typingContainer) {
        typingContainer.textContent = displayText;
    }

    let typeSpeed = typingConfig.typingSpeed;

    if (typingConfig.isDeleting) {
        typeSpeed = typingConfig.deletingSpeed;
    }

    if (!typingConfig.isDeleting && typingConfig.charIndex === currentText.length) {
        typeSpeed = typingConfig.delayBetweenTexts;
        typingConfig.isDeleting = true;
    } else if (typingConfig.isDeleting && typingConfig.charIndex === 0) {
        typingConfig.isDeleting = false;
        typingConfig.textIndex = (typingConfig.textIndex + 1) % textsToType.length;
        typeSpeed = typingConfig.typingSpeed;
    }

    setTimeout(typeText, typeSpeed);
}

// タイピングアニメーションの初期化
if (typingContainer && typingCursor) {
    setTimeout(typeText, 500);
}

// プロジェクトのフィルタリング
function filterProjects(category) {
    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// プロジェクトフィルターボタンのクリックイベント
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');
        filterProjects(category);
    });
});

// スクロールアニメーション
function animateOnScroll() {
    sections.forEach(section => {
        if (section.classList.contains('active')) return;
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('active');
        }
    });
}

function createRafThrottled(handler) {
    let ticking = false;
    return (...args) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            handler(...args);
            ticking = false;
        });
    };
}

function initSectionAnimations() {
    sections.forEach(section => {
        section.classList.add('fade-in');
    });

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: '0px 0px -15% 0px',
            threshold: 0.1
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
        return;
    }

    const throttledAnimateOnScroll = createRafThrottled(animateOnScroll);
    window.addEventListener('scroll', throttledAnimateOnScroll, { passive: true });
    animateOnScroll();
}


// ページ読み込み時のアニメーション初期化
window.addEventListener('load', () => {
    // プリローダーを非表示
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
    
    // インターンシップセクションのアニメーション
    const internshipCard = document.querySelector('.internship-card');
    if (internshipCard) {
        internshipCard.style.opacity = '0';
        internshipCard.style.transform = 'translateY(50px)';
        setTimeout(() => {
            internshipCard.style.opacity = '1';
            internshipCard.style.transform = 'translateY(0)';
        }, 300);
    }
    
});

// 初期化時にオフスクリーン要素監視を開始
initSectionAnimations();

// ヒーローセクションのタイピングエフェクト（オプション）
const heroTitle = document.querySelector('.hero h1');
const heroText = heroTitle.textContent;
if (heroTitle && heroText && false) { // デフォルトで無効、有効にする場合はtrueに設定
    heroTitle.textContent = '';
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < heroText.length) {
            heroTitle.textContent += heroText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 150);
        }
    }
    
    typeWriter();
}

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav-container');
    const navMenuLinks = document.querySelectorAll('.nav-links li');
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-links');
    const glitchElement = document.querySelector('.glitch');
    const projectFilters = document.querySelectorAll('.project-filters .filter-btn');
    const projectGrid = document.querySelector('.projects-grid');
    const projectCards = document.querySelectorAll('.project-card');
    const preloader = document.getElementById('preloader');

    // ハンバーガーメニューの処理（統合版）
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            burger.classList.toggle('toggle');
            
            // ボディのスクロールを制御
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            
            // リンクのアニメーション
            const menuItems = navMenu.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                item.style.animation = '';
                setTimeout(() => {
                    if (navMenu.classList.contains('active')) {
                        item.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    } else {
                        item.style.animation = '';
                    }
                }, 10);
            });
        });

        // メニューリンククリック時の処理
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    burger.classList.remove('toggle');
                    document.body.style.overflow = '';
                }
            });
        });

        // リサイズ時の処理
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                burger.classList.remove('toggle');
                document.body.style.overflow = '';
            }
        });
    }

    // プリローダーのフェードアウト
    window.addEventListener('load', () => {
        setTimeout(() => { // スムーズな遷移のための遅延
            if (preloader) { // プリローダーが存在するかチェック
                preloader.classList.add('hidden');
            }
        }, 100); // 500msから100msに短縮
    });

    // tsParticles の初期化
    tsParticles.load('tsparticles', {
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab' // インタラクション用にgrabモードに変更
                },
                onClick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 150,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        particles: {
            number: {
                value: 80, // パーティクル数を調整
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#ffffff' // パーティクルの色
            },
            shape: {
                type: 'circle', // パーティクルの形状
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2, // パーティクルの移動速度を遅く
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                }
            }
        },
        detectRetina: true,
    });

    // スティッキーナビゲーション & スクロールスパイの実装
    const mainSections = document.querySelectorAll('main section');
    let sectionMetrics = [];

    const updateSectionMetrics = () => {
        const navHeight = nav ? nav.offsetHeight : 0;
        sectionMetrics = Array.from(mainSections).map(section => {
            const top = section.offsetTop - navHeight - 100;
            return {
                id: section.getAttribute('id'),
                top,
                bottom: top + section.offsetHeight
            };
        });
    };

    const updateNavByScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (nav) {
            if (scrollTop > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        let currentSection = '';
        for (const metric of sectionMetrics) {
            if (scrollTop >= metric.top && scrollTop < metric.bottom) {
                currentSection = metric.id;
                break;
            }
        }

        if (!currentSection && sectionMetrics.length > 0 && scrollTop < sectionMetrics[0].top) {
            currentSection = 'home';
        }

        navMenuLinks.forEach(li => {
            const link = li.querySelector('a');
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    const throttledUpdateNavByScroll = createRafThrottled(updateNavByScroll);
    const throttledUpdateSectionMetrics = createRafThrottled(updateSectionMetrics);
    window.addEventListener('scroll', throttledUpdateNavByScroll, { passive: true });
    window.addEventListener('resize', throttledUpdateSectionMetrics, { passive: true });
    window.addEventListener('load', updateSectionMetrics);

    updateSectionMetrics();
    updateNavByScroll();

    // アンカーリンク用のスムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - nav.offsetHeight + 1; // 固定ナビ用の調整

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // モバイルナビが開いている場合は閉じる
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    burger.classList.remove('toggle');
                    document.body.style.overflow = '';
                }
            }
        });
    });


    // プロジェクトフィルタリング
    projectFilters.forEach(button => {
        button.addEventListener('click', () => {
            // 全てのボタンからactiveクラスを削除
            projectFilters.forEach(btn => btn.classList.remove('active'));
            // クリックされたボタンにactiveクラスを追加
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                // フィルタリング前にAOSアニメーション状態をリセット
                card.classList.remove('aos-animate');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    // アニメーションをトリガーするために短い遅延後にAOSクラスを再適用
                    setTimeout(() => card.classList.add('aos-animate'), 50);
                } else {
                    card.style.display = 'none';
                }
            });

            // フィルタリング後のAOS位置再計算（オプション、ちらつきの原因になる可能性あり）
            // AOS.refresh();
        });
    });

});

// Modern Activity Dashboard Manager
class ModernActivityDashboard {
    constructor() {
        this.activitiesSection = document.getElementById('activities');
        this.summaryElement = document.getElementById('summaryContent');
        this.lastUpdatedElement = document.getElementById('lastUpdated');
        this.tweetCountElement = document.getElementById('tweetCount');
        this.topicCountElement = document.getElementById('topicCount');
        this.engagementRateElement = document.getElementById('engagementRate');
        this.insightsGrid = document.getElementById('insightsGrid');
        this.activityTimeline = document.getElementById('activityTimeline');
        
        this.init();
    }

    async init() {
        try {
            await this.loadActivity();
            // 5分ごとに更新をチェック
            setInterval(() => this.loadActivity(), 5 * 60 * 1000);
        } catch (error) {
            console.error('アクティビティ初期化エラー:', error);
            this.showError();
        }
    }

    async loadActivity() {
        try {
            // GitHub Pages環境でもローカル環境でも静的ファイルから読み込み
            // const isGitHubPages = window.location.hostname === 'sota411.github.io' || 
            //                      window.location.hostname.includes('github.io') ||
            //                      !window.location.hostname.includes('localhost');
            
            let response;
            // if (isGitHubPages) {
            //     // 静的ファイルから読み込み
            //     response = await fetch('./data/activity.json');
            // } else {
            //     // ローカル環境ではAPIから読み込み
            //     response = await fetch('/api/activity');
            // }
            
            // キャッシュバスティングのためタイムスタンプを追加
            const timestamp = new Date().getTime();
            response = await fetch(`./data/activity.json?t=${timestamp}`); // 常に静的ファイルから読み込む
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.updateUI(data);
            
        } catch (error) {
            console.error('アクティビティ読み込みエラー:', error);
            this.showError();
        }
    }

    updateUI(data) {
        const isEmptyActivity = this.isEmptyActivityData(data);
        this.setActivityEmptyState(isEmptyActivity);

        // Summary content update with modern styling
        if (this.summaryElement) {
            this.summaryElement.innerHTML = isEmptyActivity
                ? this.formatEmptyActivitySummary()
                : this.formatModernSummary(data.summary);
            this.summaryElement.classList.add('updated');
            
            setTimeout(() => {
                this.summaryElement.classList.remove('updated');
            }, 600);
        }

        // Last updated with original data timestamp
        if (this.lastUpdatedElement && data.lastUpdated) {
            const updatedDate = new Date(data.lastUpdated);
            this.lastUpdatedElement.textContent = 
                `${updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${updatedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
        }

        // Enhanced stats update with animations
        if (data.stats) {
            this.updateModernStats(data.stats);
        }

        // Generate modern insights
        if (data.mood || data.technologies || data.achievements || data.focus_area) {
            this.generateInsights(data);
        } else if (this.insightsGrid) {
            this.insightsGrid.innerHTML = '';
        }

        // Create activity timeline
        if (data.highlights && data.highlights.length > 0) {
            this.createTimeline(data.highlights);
        } else if (this.activityTimeline) {
            this.activityTimeline.innerHTML = '';
        }
    }

    isEmptyActivityData(data) {
        const hasStats = typeof data.stats === 'object' && data.stats !== null;
        const hasNoTweets = hasStats && data.stats.tweetCount === 0;
        const hasNoHighlights = Array.isArray(data.highlights) && data.highlights.length === 0;
        const hasNoTopics = Array.isArray(data.topics) && data.topics.length === 0;
        return hasNoTweets && hasNoHighlights && hasNoTopics;
    }

    setActivityEmptyState(isEmpty) {
        if (!this.activitiesSection) return;
        this.activitiesSection.classList.toggle('is-empty-activity', isEmpty);
    }

    formatEmptyActivitySummary() {
        return `
            <div class="empty-activity-state">
                <h4>No Recent Posts</h4>
                <p>No tweets were found in the last 15 days.</p>
                <p class="empty-activity-note">The dashboard will expand automatically after new posts are analyzed.</p>
            </div>
        `;
    }

    formatModernSummary(summary) {
        if (!summary) {
            return `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Analyzing activities...</p>
                </div>
            `;
        }
        
        const paragraphs = summary.split('\n').filter(p => p.trim().length > 0);
        return `
            <div class="summary-text">
                ${paragraphs.map(p => `<p>${p.trim()}</p>`).join('')}
            </div>
        `;
    }

    updateModernStats(stats) {
        const statItems = [
            { element: this.tweetCountElement, value: stats.tweetCount || 0, max: 100 },
            { element: this.topicCountElement, value: stats.topicCount || 0, max: 20 },
            { element: this.engagementRateElement, value: stats.engagementRate || 0, max: 100, suffix: '%' }
        ];

        statItems.forEach((item, index) => {
            if (item.element) {
                setTimeout(() => {
                    this.animateStatNumber(item.element, item.value, item.suffix);
                    this.animateStatBar(item.element, item.value, item.max);
                }, index * 200);
            }
        });
    }

    animateStatNumber(element, targetValue, suffix = '') {
        const startValue = 0;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
            
            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    animateStatBar(element, value, max) {
        const card = element.closest('.stat-card');
        if (card) {
            const progressBar = card.querySelector('.stat-progress');
            if (progressBar) {
                const percentage = Math.min((value / max) * 100, 100);
                setTimeout(() => {
                    progressBar.style.width = `${percentage}%`;
                }, 300);
            }
        }
    }

    generateInsights(data) {
        if (!this.insightsGrid) return;

        const insights = [];

        if (data.focus_area) {
            insights.push({
                type: 'focus',
                icon: 'fas fa-bullseye',
                title: 'Current Focus',
                content: data.focus_area,
                color: 'var(--accent-color-1)'
            });
        }

        if (data.mood) {
            insights.push({
                type: 'mood',
                icon: 'fas fa-smile',
                title: 'Overall Mood',
                content: data.mood,
                color: 'var(--accent-color-2)'
            });
        }

        if (data.technologies && data.technologies.length > 0) {
            insights.push({
                type: 'tech',
                icon: 'fas fa-code',
                title: 'Technologies',
                content: data.technologies.slice(0, 3).join(', '),
                color: 'var(--accent-color-1)'
            });
        }

        this.insightsGrid.innerHTML = insights.map(insight => `
            <div class="insight-card" data-type="${insight.type}">
                <div class="insight-icon" style="color: ${insight.color}">
                    <i class="${insight.icon}"></i>
                </div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.content}</p>
                </div>
            </div>
        `).join('');
    }

    createTimeline(highlights) {
        if (!this.activityTimeline) return;

        this.activityTimeline.innerHTML = highlights.slice(0, 5).map((highlight, index) => `
            <div class="timeline-item" style="animation-delay: ${index * 0.1}s">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <p>${highlight}</p>
                </div>
            </div>
        `).join('');
    }


    updateStats(stats) {
        if (this.tweetCountElement) {
            this.animateNumber(this.tweetCountElement, stats.tweetCount || 0);
        }

        if (this.topicCountElement) {
            this.animateNumber(this.topicCountElement, stats.topicCount || 0);
        }

        if (this.engagementRateElement) {
            this.animateNumber(this.engagementRateElement, stats.engagementRate || 0, '%');
        }
    }

    animateNumber(element, targetValue, suffix = '') {
        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000; // 1秒
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // イージング関数（easeOutCubic）
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
            
            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    formatSummary(summary) {
        if (!summary) return '<p class="loading-message">アクティビティを読み込み中...</p>';
        
        // 文章を段落に分割
        const paragraphs = summary.split('\n').filter(p => p.trim().length > 0);
        return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
    }

    showHighlights(highlights) {
        // ハイライトを表示する要素があれば追加
        const summaryContent = this.summaryElement;
        if (summaryContent && highlights.length > 0) {
            const highlightsHtml = `
                <div class="activity-highlights">
                    <h4>主な活動</h4>
                    <ul>
                        ${highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            // 既存のハイライトを削除
            const existingHighlights = summaryContent.querySelector('.activity-highlights');
            if (existingHighlights) {
                existingHighlights.remove();
            }
            
            summaryContent.insertAdjacentHTML('beforeend', highlightsHtml);
        }
    }

    showGeminiDetails(data) {
        // Gemini分析の詳細情報を表示する要素を作成
        let detailsContainer = document.querySelector('.gemini-details');
        
        if (!detailsContainer) {
            detailsContainer = document.createElement('div');
            detailsContainer.className = 'gemini-details';
            this.summaryElement.parentElement.appendChild(detailsContainer);
        }
        
        let detailsHtml = '<div class="gemini-analysis-header"><h4><i class="fas fa-robot"></i> AI分析結果</h4></div>';
        
        // 注力分野
        if (data.focus_area) {
            detailsHtml += `
                <div class="analysis-item focus-area">
                    <div class="item-header">
                        <i class="fas fa-bullseye"></i>
                        <span class="item-title">現在の注力分野</span>
                    </div>
                    <div class="item-content focus-content">
                        ${data.focus_area}
                    </div>
                </div>
            `;
        }
        
        // 全体的な雰囲気
        if (data.mood) {
            const moodIcon = this.getMoodIcon(data.mood);
            detailsHtml += `
                <div class="analysis-item mood">
                    <div class="item-header">
                        <i class="${moodIcon}"></i>
                        <span class="item-title">全体的な雰囲気</span>
                    </div>
                    <div class="item-content mood-content">
                        <span class="mood-badge mood-${data.mood.toLowerCase()}">${data.mood}</span>
                    </div>
                </div>
            `;
        }
        
        // 使用技術
        if (data.technologies && data.technologies.length > 0) {
            detailsHtml += `
                <div class="analysis-item technologies">
                    <div class="item-header">
                        <i class="fas fa-code"></i>
                        <span class="item-title">言及された技術 (${data.technologies.length})</span>
                    </div>
                    <div class="item-content">
                        <div class="tech-tags">
                            ${data.technologies.map(tech => 
                                `<span class="tech-tag">${tech}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
        
        // 具体的な成果
        if (data.achievements && data.achievements.length > 0) {
            detailsHtml += `
                <div class="analysis-item achievements">
                    <div class="item-header">
                        <i class="fas fa-trophy"></i>
                        <span class="item-title">具体的な成果 (${data.achievements.length})</span>
                    </div>
                    <div class="item-content">
                        <ul class="achievements-list">
                            ${data.achievements.map(achievement => 
                                `<li class="achievement-item">${achievement}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        detailsContainer.innerHTML = detailsHtml;
        
        // アニメーション効果を追加
        detailsContainer.classList.add('fade-in');
    }
    
    getMoodIcon(mood) {
        const moodIcons = {
            'ポジティブ': 'fas fa-smile',
            'ニュートラル': 'fas fa-meh',
            'チャレンジング': 'fas fa-fist-raised',
            'ネガティブ': 'fas fa-frown'
        };
        return moodIcons[mood] || 'fas fa-meh';
    }

    showError() {
        this.setActivityEmptyState(false);

        if (this.summaryElement) {
            this.summaryElement.innerHTML = `
                <p class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    アクティビティデータの読み込みに失敗しました。しばらく後に再試行されます。
                </p>
            `;
        }

        if (this.lastUpdatedElement) {
            this.lastUpdatedElement.textContent = '最終更新: エラー';
        }

        // 統計値をリセット
        [this.tweetCountElement, this.topicCountElement, this.engagementRateElement].forEach(el => {
            if (el) el.textContent = '--';
        });

        if (this.insightsGrid) {
            this.insightsGrid.innerHTML = '';
        }

        if (this.activityTimeline) {
            this.activityTimeline.innerHTML = '';
        }
    }
}

// DOMが読み込まれたらモダンダッシュボードを初期化
document.addEventListener('DOMContentLoaded', () => {
    // 既存の初期化処理を維持
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // モダンアクティビティダッシュボードを初期化
    if (document.getElementById('summaryContent')) {
        window.modernDashboard = new ModernActivityDashboard();
    }
});

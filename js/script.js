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

// モバイルメニュートグル（メイン処理）
if (burger && navLinks) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('toggle');
        
        // ボディのスクロールを制御
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden'; // メニューが開いている間はスクロールを無効化
        } else {
            document.body.style.overflow = ''; // メニューを閉じたらスクロールを有効化
        }
        
        // リンクのアニメーション
        const menuItems = navLinks.querySelectorAll('li'); 
        menuItems.forEach((item, index) => {
            item.style.animation = '';
            setTimeout(() => {
                if (navLinks.classList.contains('active')) {
                    item.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                } else {
                    item.style.animation = '';
                }
            }, 10);
        });
    });
}

// スクロール時のナビゲーションバーの背景変更
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navContainer.classList.add('scrolled');
    } else {
        navContainer.classList.remove('scrolled');
    }
});

// モバイルメニューのリンククリック時の処理
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) { 
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
            document.body.style.overflow = ''; // スクロールを有効化
        }
    });
});

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // モバイル時はナビバーの高さを考慮
            const navHeight = navContainer.getBoundingClientRect().height;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - navHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// リサイズイベントの処理
window.addEventListener('resize', () => {
    // ウィンドウサイズが変更されたときにモバイルメニューを閉じる
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        burger.classList.remove('toggle');
        document.body.style.overflow = '';
    }
});

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
        if (!section.classList.contains('fade-in')) {
            section.classList.add('fade-in');
        }
        
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('active');
        }
    });
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
    
    animateOnScroll();
    
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
    
    // 画像の遅延読み込み設定
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // IntersectionObserverがサポートされていないブラウザ用のフォールバック
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
});

// スクロール時のアニメーション実行
window.addEventListener('scroll', animateOnScroll);

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

    // プリローダーのフェードアウト
    window.addEventListener('load', () => {
        setTimeout(() => { // スムーズな遷移のための遅延
            if (preloader) { // プリローダーが存在するかチェック
                preloader.classList.add('hidden');
            }
        }, 100); // 500msから100msに短縮
    });

    // AOS（Animate On Scroll）の初期化
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: false,
        disable: window.innerWidth < 768 ? 'phone' : false, // モバイルでは無効化（任意）
        offset: 50
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
    let lastScrollTop = 0;
    const sections = document.querySelectorAll('main section'); // メインセクションを全て選択
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // スクロール時のナビバー背景変更
        if (scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // スクロールスパイ: アクティブなナビリンクをハイライト
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - nav.offsetHeight - 100; // オフセットを調整
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // セクションがアクティブでない場合（例：トップやボトムでセクション範囲外）、ホームをデフォルトに
        if (!currentSection && scrollTop < sections[0].offsetTop - nav.offsetHeight - 100) {
            currentSection = 'home';
        }

        navMenuLinks.forEach(li => {
            const link = li.querySelector('a');
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // モバイルやネガティブスクロール用
    });

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
                }
            }
        });
    });

    // 重複したモバイルナビゲーション処理を削除（上記で既に処理済み）

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

// アクティビティ読み込み機能
class ActivityLoader {
    constructor() {
        this.summaryElement = document.getElementById('summaryContent');
        this.lastUpdatedElement = document.getElementById('lastUpdated');
        this.tweetCountElement = document.getElementById('tweetCount');
        this.topicCountElement = document.getElementById('topicCount');
        this.engagementRateElement = document.getElementById('engagementRate');
        
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
        // 要約テキストの更新
        if (this.summaryElement) {
            this.summaryElement.innerHTML = this.formatSummary(data.summary);
            this.summaryElement.classList.add('updated');
            
            // アニメーション後にクラスを削除
            setTimeout(() => {
                this.summaryElement.classList.remove('updated');
            }, 600);
        }

        // 最終更新時刻の更新
        if (this.lastUpdatedElement && data.lastUpdated) {
            const updatedDate = new Date(data.lastUpdated);
            this.lastUpdatedElement.textContent = 
                `最終更新: ${updatedDate.toLocaleDateString('ja-JP')} ${updatedDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
        }

        // 統計データの更新
        if (data.stats) {
            this.updateStats(data.stats);
        }

        // ハイライトの表示（もしあれば）
        if (data.highlights && data.highlights.length > 0) {
            this.showHighlights(data.highlights);
        }

        // Gemini 分析の詳細情報を表示
        if (data.mood || data.technologies || data.achievements || data.focus_area) {
            this.showGeminiDetails(data);
        }
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
    }
}

// DOMが読み込まれたらアクティビティローダーを初期化
document.addEventListener('DOMContentLoaded', () => {
    // 既存の初期化処理を維持
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // アクティビティローダーを初期化
    if (document.getElementById('summaryContent')) {
        new ActivityLoader();
    }
});

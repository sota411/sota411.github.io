// DOM要素の取得
const navContainer = document.querySelector('.nav-container');
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const sections = document.querySelectorAll('section');
const contactForm = document.getElementById('contactForm');

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

// スクロール時のナビゲーションバーの背景変更
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navContainer.classList.add('scrolled');
    } else {
        navContainer.classList.remove('scrolled');
    }
});

// ハンバーガーメニューの切り替え
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// モバイルメニューのリンククリック時の処理
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
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
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
    
    animateOnScroll();
});

// スクロール時のアニメーション実行
window.addEventListener('scroll', animateOnScroll);

// パフォーマンス向上のためのヒーロー背景画像のプリロード
const preloadImage = new Image();
preloadImage.src = '../img/hero-bg.jpg';

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

const createCustomCursor = () => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicked');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicked');
    });
    
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
};

const createThemeToggle = () => {
    const themeToggle = document.createElement('div');
    themeToggle.classList.add('theme-toggle');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
};

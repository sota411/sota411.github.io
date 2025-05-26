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

// モバイルメニュートグル
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
    
    // ナビゲーションメニューのアニメーション
    navLinkItems.forEach((link, index) => {
        // リンクのアニメーションをリセット
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            // フェードインアニメーションを設定（遅延を付けて連続的に表示）
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            link.style.opacity = '1';
        }
    });
    
    // ボディのスクロールを制御
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden'; // メニューが開いている間はスクロールを無効化
    } else {
        document.body.style.overflow = ''; // メニューを閉じたらスクロールを有効化
    }
});

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
            
            // アニメーションをリセット
            navLinkItems.forEach(link => {
                link.style.animation = '';
            });
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

// Resize イベントの処理
window.addEventListener('resize', () => {
    // ウィンドウサイズが変更されたときにモバイルメニューを閉じる
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        burger.classList.remove('toggle');
        document.body.style.overflow = '';
        
        // アニメーションをリセット
        navLinkItems.forEach(link => {
            link.style.animation = '';
        });
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
        // Fallback for browsers that don't support IntersectionObserver
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

// Custom Cursor Implementation
const createCustomCursor = () => {
    // モバイルデバイスまたはタッチデバイスの場合はカスタムカーソルを無効にする
    if (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return;
    }

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div'); // Inner dot for better visibility/style
    cursorDot.classList.add('custom-cursor-dot');
    cursor.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let speed = 0.2; // Smoothing factor - 追従速度を改善

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        let distX = mouseX - cursorX;
        let distY = mouseY - cursorY;

        cursorX += distX * speed;
        cursorY += distY * speed;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }

    requestAnimationFrame(animateCursor);

    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicked');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicked');
    });

    const hoverElements = document.querySelectorAll(
        'a, button, .project-card, .skill-item, .filter-btn, .burger, input[type="submit"], .social-links a, .theme-toggle' // Added more specific hover targets
    );
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            cursor.style.display = 'none';
        } else {
            cursor.style.display = 'flex';
        }
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

    // Initialize Custom Cursor
    createCustomCursor();

    // Initialize Theme Toggle (if applicable)
    // createThemeToggle();

    // Preloader fade out
    window.addEventListener('load', () => {
        setTimeout(() => { // Add a small delay for smoother transition
            if (preloader) { // Check if preloader exists
                preloader.classList.add('hidden');
            }
        }, 100); // Reduced delay from 500ms to 100ms
    });

    // AOS Initialization
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: false,
        disable: window.innerWidth < 768 ? 'phone' : false, // モバイルでは無効化（任意）
        offset: 50
    });

    // tsParticles Initialization
    tsParticles.load('tsparticles', {
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab' // Changed mode to grab for interaction
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
                value: 80, // Adjusted particle count
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#ffffff' // Particle color
            },
            shape: {
                type: 'circle', // Particle shape
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
                speed: 2, // Slower particle speed
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

    // Sticky Navigation & Scrollspy Logic
    let lastScrollTop = 0;
    const sections = document.querySelectorAll('main section'); // Select all main sections
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar background change on scroll
        if (scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Scrollspy: Highlight active nav link
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - nav.offsetHeight - 100; // Adjusted offset
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // If no section is active (e.g., at the top or bottom out of section range), default to home
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

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - nav.offsetHeight + 1; // Adjust for fixed nav

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    burger.classList.remove('toggle');
                }
            }
        });
    });

    // Mobile Navigation Toggle
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            burger.classList.toggle('toggle');

            // Animate Links - Target list items within the navMenu
            const menuItems = navMenu.querySelectorAll('li'); 
            menuItems.forEach((item, index) => {
                // Clear any existing animation before setting new one
                item.style.animation = '';
                
                // Apply animation with delay after a small timeout to ensure CSS transition works
                setTimeout(() => {
                    if (navMenu.classList.contains('active')) {
                        item.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    } else {
                        item.style.animation = '';
                    }
                }, 10);
            });
        });
    }

    // Project Filtering
    projectFilters.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            projectFilters.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const cardContainer = card.parentElement; // Get the grid item container if needed

                // Reset AOS animation state before filtering
                card.classList.remove('aos-animate');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    // Re-apply AOS class after a short delay to trigger animation
                    setTimeout(() => card.classList.add('aos-animate'), 50);
                } else {
                    card.style.display = 'none';
                }
            });

            // Refresh AOS to recalculate positions after filtering (optional, might cause flicker)
            // AOS.refresh();
        });
    });

});

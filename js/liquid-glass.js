// Liquid Glass Effect Application Script
document.addEventListener('DOMContentLoaded', function() {

    // Add the SVG filter for glass distortion if it doesn't exist
    function addGlassFilter() {
        if (document.getElementById('glass-distortion')) {
            return;
        }
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.display = 'none';
        svg.innerHTML = `
            <filter
                id="glass-distortion"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                filterUnits="objectBoundingBox"
            >
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.01 0.01"
                    numOctaves="1"
                    seed="5"
                    result="turbulence"
                />
                <feComponentTransfer in="turbulence" result="mapped">
                    <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
                    <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                    <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
                </feComponentTransfer>
                <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
                <feSpecularLighting
                    in="softMap"
                    surfaceScale="5"
                    specularConstant="1"
                    specularExponent="100"
                    lighting-color="white"
                    result="specLight"
                >
                    <fePointLight x="-200" y="-200" z="300" />
                </feSpecularLighting>
                <feComposite
                    in="specLight"
                    operator="arithmetic"
                    k1="0"
                    k2="1"
                    k3="1"
                    k4="0"
                    result="litImage"
                />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="softMap"
                    scale="150"
                    xChannelSelector="R"
                    yChannelSelector="G"
                />
            </filter>
        `;
        document.body.appendChild(svg);
    }
    
    // Function to wrap elements with liquid glass structure
    function applyLiquidGlass(element) {
        // Skip if already has liquid glass
        if (element.classList.contains('liquidGlass-wrapper') || element.querySelector('.liquidGlass-effect')) {
            return;
        }
        
        // Store original content and computed styles
        const originalContent = element.innerHTML;
        const computedStyle = window.getComputedStyle(element);
        const originalDisplay = computedStyle.display;
        const originalFlexDirection = computedStyle.flexDirection;
        const originalAlignItems = computedStyle.alignItems;
        const originalJustifyContent = computedStyle.justifyContent;
        
        // Remove background to allow glass effect to show
        element.style.backgroundColor = 'transparent';
        element.style.background = 'transparent';
        
        // Add liquid glass wrapper class (preserve existing classes)
        element.classList.add('liquidGlass-wrapper');
        
        // Create liquid glass structure
        element.innerHTML = `
            <div class="liquidGlass-effect"></div>
            <div class="liquidGlass-tint"></div>
            <div class="liquidGlass-shine"></div>
            <div class="liquidGlass-text" style="
                display: ${originalDisplay}; 
                width: 100%; 
                height: 100%; 
                flex-direction: ${originalFlexDirection}; 
                align-items: ${originalAlignItems}; 
                justify-content: ${originalJustifyContent};
                position: relative;
                z-index: 3;
            ">
                ${originalContent}
            </div>
        `;
    }
    
    // Apply liquid glass to different card types (excluding contact-item)
    const defaultSelectors = [
        '.certification-item',
        '.skill-item',
        '.project-card',
        '.dashboard-card',
        '.stat-card',
        '.section-description-card',
        '.insight-card',
        '.internship-card',
        '.article-card'
    ];

    function applyLiquidGlassEffects(selectors = defaultSelectors) {
        const targetSelectors = Array.isArray(selectors) ? selectors : [selectors];
        targetSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                if (!element.querySelector('.liquidGlass-effect')) {
                    applyLiquidGlass(element);
                }
            });
        });
    }

    // Initialize glass filter and apply once on initial DOM
    addGlassFilter();
    applyLiquidGlassEffects();

    // Expose hook for dynamically rendered cards (e.g. articles loaded via fetch)
    window.applyLiquidGlassEffects = applyLiquidGlassEffects;
});

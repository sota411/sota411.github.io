// シード付き乱数生成関数（mulberry32）
function mulberry32(a) {
    return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}
const seed = 123456789;
const random = mulberry32(seed);

// 宇宙のな色のパレット
const cosmicColors = [
    '#4B0082', '#9400D3', '#8A2BE2', '#9370DB', '#E6E6FA',
    '#00CED1', '#48D1CC', '#40E0D0', '#7FFFD4', '#00FA9A',
    '#FF69B4', '#FF1493', '#FF00FF', '#BA55D3', '#9932CC'
];

// 架空の人物を含むタイムラインデータ
const generateTimelineData = () => {
    const baseData = [
        {
            person: "Haraguchi Sota",
            birth: 2006,
            death: 2040,
            events: [
                { date: "2006.01.19", title: "Birth", description: "福島県にて誕生する", color: cosmicColors[0] },
                { date: "2010.04.01", title: "Junior High School", description: "〇〇小学校に入学", color: cosmicColors[2] },
                { date: "2015.04.01", title: "First Project", description: "初めてのプログラミングプロジェクトを完成させる。HTMLとCSSを使用した簡単なウェブサイトを作成。", color: cosmicColors[8] },
                { date: "2020.04.01", title: "High School", description: "技術高校に進学し、本格的にプログラミングを学び始める。複数のウェブアプリケーション開発に参加。", color: cosmicColors[3] },
                { date: "2025.03.20", title: "Advanced Skills", description: "高度なプログラミング概念を習得。フルスタック開発者としてのスキルを確立。", color: cosmicColors[9] },
                { date: "2030.07.15", title: "Portfolio Projects", description: "様々なフルスタックアプリケーションを開発。自身のポートフォリオを充実させる。", color: cosmicColors[4] },
                { date: "2040.01.01", title: "Future Vision", description: "開発者としての成長を続け、テクノロジー業界でのキャリアを確立。", color: cosmicColors[5] }
            ]
        }
    ];

    const startYear = 1500;
    const endYear = 2040;
    const numPeople = 60;

    for (let i = 0; i < numPeople; i++) {
        const birthYear = Math.floor(random() * (endYear - startYear)) + startYear;
        const lifespan = Math.floor(random() * 60) + 40;
        const deathYear = Math.min(birthYear + lifespan, 2040);
        
        const numEvents = Math.floor(random() * 4) + 3;
        const events = [];
        
        // 誕生イベント
        events.push({
            date: birthYear.toString(),
            title: "誕生",
            description: "新たな生命の誕生",
            color: cosmicColors[i % cosmicColors.length]
        });

        // 中間イベント
        for (let j = 1; j < numEvents - 1; j++) {
            const eventYear = Math.floor(random() * (deathYear - birthYear - 1)) + birthYear + 1;
            events.push({
                date: eventYear.toString(),
                title: `発見 ${j}`,
                description: `重要な発見や発明`,
                color: cosmicColors[(i + j) % cosmicColors.length]
            });
        }

        // 死亡/現在のイベント
        if (deathYear < 2040) {
            events.push({
                date: deathYear.toString(),
                title: "死去",
                description: "偉大な足跡を残して",
                color: cosmicColors[i % cosmicColors.length]
            });
        }

        baseData.push({
            person: `Person ${i + 1}`,
            birth: birthYear,
            death: deathYear,
            events: events.sort((a, b) => parseInt(a.date) - parseInt(b.date))
        });
    }

    return baseData;
};

const timelineData = generateTimelineData();

document.addEventListener('DOMContentLoaded', () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const container = d3.select('.timeline-container');
    const width = container.node().getBoundingClientRect().width;
    const baseHeight = 3000;
    const sotaHeight = 15000;
    const height = sotaHeight;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#000');

    const mainGroup = svg.append('g');

    // 背景の星を追加
    const numStars = 3000;
    const starAreaMultiplier = 5;
    const stars = Array.from({ length: numStars }, () => ({
        x: (random() * width * starAreaMultiplier) - (width * (starAreaMultiplier - 1) / 2),
        y: (random() * height * starAreaMultiplier) - (height * (starAreaMultiplier - 1) / 2),
        r: random() * 2.5
    }));

    // 背景グラデーション
    const radialGradient = svg.append('defs')
        .append('radialGradient')
        .attr('id', 'background-gradient')
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

    radialGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#0a0a2a');
    radialGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#000');

    mainGroup.append('rect')
        .attr('x', -width * starAreaMultiplier)
        .attr('y', -height * starAreaMultiplier)
        .attr('width', width * starAreaMultiplier * 2 + width)
        .attr('height', height * starAreaMultiplier * 2)
        .attr('fill', 'url(#background-gradient)');

    mainGroup.selectAll('.star')
        .data(stars)
        .enter()
        .append('circle')
        .attr('class', 'star')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .style('opacity', () => random() * 0.3);

    // 時間スケールの設定
    const allDates = timelineData.flatMap(person => [person.birth, person.death]);
    const minYear = Math.floor(Math.min(...allDates) / 10) * 10;
    const maxYear = Math.ceil(Math.max(...allDates) / 10) * 10;

    const dummyTimeScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([0, baseHeight]);

    const yourTimeline = timelineData.find(d => d.person === "Haraguchi Sota");
    const sotaFixedLength = (yourTimeline.death - yourTimeline.birth) * (15000 / (maxYear - minYear));
    const offsetAdjustment = Math.max(sotaHeight - 15000, -100);

    function createTimeScale(person) {
        if (person === "Haraguchi Sota") {
            return d3.scaleLinear()
                .domain([yourTimeline.birth, yourTimeline.death])
                .range([
                    dummyTimeScale(yourTimeline.birth) + offsetAdjustment - 450,
                    dummyTimeScale(yourTimeline.birth) + offsetAdjustment - 450 + sotaFixedLength
                ]);
        } else {
            return d3.scaleLinear()
                .domain([minYear, maxYear])
                .range([0, baseHeight]);
        }
    }

    let persons = timelineData.map(d => d.person);
    const sotaIndex = persons.indexOf("Haraguchi Sota");
    persons.splice(sotaIndex, 1);
    const leftPersons = [];
    const rightPersons = [];
    persons.forEach((person, i) => {
        if (i % 2 === 0) {
            leftPersons.push(person);
        } else {
            rightPersons.push(person);
        }
    });
    const newDomain = [...leftPersons, "Haraguchi Sota", ...rightPersons];
    const personScale = d3.scalePoint()
        .domain(newDomain)
        .range([width * 0.05, width * 0.95])
        .padding(0.1);

    const yourX = personScale("Haraguchi Sota");

    // タイムライン描画
    timelineData.forEach((person, i) => {
        const x = personScale(person.person);
        const personTimeScale = createTimeScale(person.person);
    
        const lineGradient = mainGroup.append('linearGradient')
            .attr('id', `line-gradient-${i}`)
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', personTimeScale(person.birth))
            .attr('x2', 0)
            .attr('y2', personTimeScale(person.death));
        lineGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'rgba(255, 255, 255, 0.05)');
        lineGradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', 'rgba(255, 255, 255, 0.3)');
        lineGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'rgba(255, 255, 255, 0.05)');
    
        mainGroup.append('line')
            .attr('class', 'timeline-line')
            .attr('x1', x)
            .attr('x2', x)
            .attr('y1', personTimeScale(person.birth))
            .attr('y2', personTimeScale(person.death))
            .style('stroke', `url(#line-gradient-${i})`)
            .style('opacity', person.person === "Haraguchi Sota" ? 1 : 0.2);
    
        const events = mainGroup.selectAll(`.event-${i}`)
            .data(person.events)
            .enter()
            .append('g')
            .attr('class', 'event-group')
            .attr('transform', d => `translate(${x}, ${personTimeScale(parseInt(d.date))})`);
    
        // サークルを追加
        const circleSelection = events.append('circle')
            .attr('class', 'event-circle')
            .each(function(d) {
                const baseRadius = person.person === "Haraguchi Sota" ? 8 : 3;
                d3.select(this)
                    .attr('r', baseRadius)
                    .attr('data-base-radius', baseRadius);
            })
            .attr('fill', d => d.color)
            .style('opacity', d => person.person === "Haraguchi Sota" ? 1 : 0.3);
    
        if (person.person === "Haraguchi Sota") {
            // クリックされたサークルの座標計算を getBoundingClientRect() で行う
            circleSelection.on('click', function(event, d) {
                // 新しい詳細ボックスを body 内に追加
                const detailBox = d3.select('body')
                    .append('div')
                    .attr('class', 'timeline-details')
                    .html(`
                        <h3 class="company-name" style="color: #fff;">${d.title}</h3>
                        <p class="description">${d.description}</p>
                        <p class="company-url" style="margin-top: 10px; color: #fff;">${d.date}</p>
                    `)
                    .style('border-left-color', d.color)
                    .style('position', 'absolute')
                    .style('display', 'block')
                    .style('opacity', '0')
                    .style('transform', 'translateX(-50px)')
                    .style('transition', 'opacity 0.6s ease-out, transform 0.6s ease-out');
    
                // 1) クリックされたサークルの最終的な画面座標を取得（getBoundingClientRect() を使用）
                const rect = this.getBoundingClientRect();

                // 修正点: スクロール量を加算して絶対座標を算出
                const scrollX = window.scrollX || document.documentElement.scrollLeft;
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                const circleCenterX = rect.left + rect.width / 2 + scrollX;
                const circleCenterY = rect.top + rect.height / 2 + scrollY;
                const offsetRight = 100;
                const leftPosition = rect.right + offsetRight + scrollX;

                // 2) detailBox のサイズを取得
                const detailRect = detailBox.node().getBoundingClientRect();
                // サークル中心と detailBox の縦中心を合わせる
                const topPosition = circleCenterY - (detailRect.height / 2);
    
                // 3) 位置を反映
                detailBox
                    .style('left', `${leftPosition}px`)
                    .style('top', `${topPosition}px`);

                // アニメーションの適用
                setTimeout(() => {
                    detailBox
                        .style('opacity', '1')
                        .style('transform', 'translateX(0)');
                }, 50);
    
                // 4) ログ出力（各イベントごとに座標を出力）
                console.log(`\n[Event: ${d.title}]`);
                console.log(`  サークル中心(画面座標): x=${circleCenterX}, y=${circleCenterY}`);
                console.log(`  詳細ボックス配置: left=${leftPosition}, top=${topPosition}`);
            });
        }
    });
    

    // ズーム設定
    const yourTimeScale = createTimeScale("Haraguchi Sota");
    const finalScale = 4;
    const initialTransform = d3.zoomIdentity
        .translate(
            width * 0.1 - yourX * finalScale,
            height/15 - (dummyTimeScale(yourTimeline.birth - 55) + offsetAdjustment) * finalScale
        )
        .scale(finalScale);

    const zoom = d3.zoom()
        .scaleExtent([1, 1])
        .translateExtent([
            [yourX - width * 0.2, -height],
            [yourX + width * 0.6, height * 2]
        ])
        .on('zoom', (event) => {
            const transform = event.transform;
            const fixedX = width * 0.1 - yourX * transform.k;
            transform.x = fixedX;
            mainGroup.attr('transform', transform);

            mainGroup.selectAll('.event-circle')
                .attr('r', function() {
                    const baseRadius = +this.getAttribute('data-base-radius');
                    return baseRadius / transform.k;
                });
        });

    svg.call(zoom).on("wheel.zoom", null);

    window.addEventListener('wheel', (event) => {
        if (!event.ctrlKey) {
            window.scrollBy(0, event.deltaY);
        }
    });
    
    svg.transition()
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .call(zoom.transform, initialTransform)
        .on('end', () => {
            mainGroup.selectAll('.portfolio-title, .portfolio-subtitle, .scroll-hint')
                .transition()
                .duration(1000)
                .style('opacity', 1);

            svg.on('.zoom', null);
            d3.select('.timeline-container').style('cursor', 'default');
        });

    mainGroup.append('text')
        .attr('class', 'portfolio-title')
        .attr('x', yourX + width * 0.045)
        .attr('y', yourTimeScale(yourTimeline.birth) - 54)
        .attr('text-anchor', 'start')
        .style('font-size', '20px')
        .style('fill', '#fff')
        .style('opacity', 0)
        .text('Sota Portfolio');

    mainGroup.append('text')
        .attr('class', 'portfolio-subtitle')
        .attr('x', yourX + width * 0.056)
        .attr('y', yourTimeScale(yourTimeline.birth) - 41)
        .attr('text-anchor', 'start')
        .style('font-size', '8px')
        .style('fill', 'rgba(255, 255, 255, 0.7)')
        .style('opacity', 0)
        .text('Technical School Student');
});

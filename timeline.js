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
            birth: 2006,  // 開始年を早める
            death: 2040,  // 終了年を遅くする
            events: [
                { date: "2006.01.19", title: "Birth", description: "福島県にて", color: cosmicColors[0] },
                { date: "2010", title: "Junior High School", description: "Started learning web development", color: cosmicColors[2] },
                { date: "2015", title: "First Project", description: "Completed first major coding project", color: cosmicColors[8] },
                { date: "2020", title: "High School", description: "Developed multiple web applications", color: cosmicColors[3] },
                { date: "2025", title: "Advanced Skills", description: "Mastered advanced programming concepts", color: cosmicColors[9] },
                { date: "2030", title: "Portfolio Projects", description: "Created various full-stack applications", color: cosmicColors[4] },
                { date: "2040", title: "Future Vision", description: "Continuing to grow as a developer", color: cosmicColors[5] }
            ]
        }
    ];

    // 架空の人物を生成
    const startYear = 1500;  // より古い時代から
    const endYear = 2040;  // 終了年を2040年に合わせる
    const numPeople = 60;

    for (let i = 0; i < numPeople; i++) {
        const birthYear = Math.floor(random() * (endYear - startYear)) + startYear;
        const lifespan = Math.floor(random() * 60) + 40; // 40-100年の寿命に変更
        const deathYear = Math.min(birthYear + lifespan, 2040);
        
        const numEvents = Math.floor(random() * 4) + 3; // 3-6個のイベントに変更
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

// D3.jsでタイムラインを描画
document.addEventListener('DOMContentLoaded', () => {
    const container = d3.select('.timeline-container');
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const width = container.node().getBoundingClientRect().width;
    // --- 修正箇所 ---
    const baseHeight = 3000;              // ダミー人物用の高さはそのまま
    const sotaHeight = 15000;             // ※見た目のオフセット調整用の値として残す（以降、sotaHeightの差分でオフセット調整を行う）
    const height = sotaHeight;            // SVGの高さは sotaHeight を使用

    // SVG要素の作成（ズーム用のグループを追加）
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#000');  // 背景を完全な黒に

    // ズーム用のメインコンテナ
    const mainGroup = svg.append('g');

    // 背景の星を追加（星の数と範囲を大幅に増加）
    const numStars = 3000;  // さらに星の数を増加
    const starAreaMultiplier = 5;  // 星を配置する範囲をさらに拡大
    const stars = Array.from({ length: numStars }, () => ({
        x: (random() * width * starAreaMultiplier) - (width * (starAreaMultiplier - 1) / 2),
        y: (random() * height * starAreaMultiplier) - (height * (starAreaMultiplier - 1) / 2),
        r: random() * 2.5
    }));

    // 背景のグラデーションを追加
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

    // 背景を追加（サイズを拡大）
    mainGroup.append('rect')
        .attr('x', -width * starAreaMultiplier)
        .attr('y', -height * starAreaMultiplier)
        .attr('width', width * starAreaMultiplier * 2 + width)
        .attr('height', height * starAreaMultiplier * 2)
        .attr('fill', 'url(#background-gradient)');

    // 星を描画
    mainGroup.selectAll('.star')
        .data(stars)
        .enter()
        .append('circle')
        .attr('class', 'star')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .style('opacity', () => random() * 0.3);

    // 時間のスケールを設定（全体の期間）
    const allDates = timelineData.flatMap(person => [person.birth, person.death]);
    const minYear = Math.floor(Math.min(...allDates) / 10) * 10;
    const maxYear = Math.ceil(Math.max(...allDates) / 10) * 10;

    // --- 新規追加 ---
    // ダミー人物の時間スケール（全体の期間を基に、baseHeightで描画）
    const dummyTimeScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([0, baseHeight]);
    // Haraguchi Sotaのデータ取得
    const yourTimeline = timelineData.find(d => d.person === "Haraguchi Sota");
    // Haraguchi Sotaの固定タイムライン長とオフセット調整の計算
    const sotaFixedLength = (yourTimeline.death - yourTimeline.birth) * (15000 / (maxYear - minYear));
    const offsetAdjustment = Math.max(sotaHeight - 15000, -100);

    // 人物ごとの時間スケールを生成する関数
    function createTimeScale(person) {
        if (person === "Haraguchi Sota") {
            return d3.scaleLinear()
                     .domain([yourTimeline.birth, yourTimeline.death])
                     .range([
                         // ここでオフセット調整を行う(Haraguchi Sotaのタイムラインの位置を調節)
                         dummyTimeScale(yourTimeline.birth) + offsetAdjustment - 500,
                         dummyTimeScale(yourTimeline.birth) + offsetAdjustment - 500 + sotaFixedLength
                     ]);
        } else {
            return d3.scaleLinear()
                     .domain([minYear, maxYear])
                     .range([0, baseHeight]);
        }
    }

    // 人物ごとの水平位置を設定（中央に自分が来るように調整）
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

    // Haraguchi Sotaの位置を取得
    const yourX = personScale("Haraguchi Sota");

    // 連結線を最初に作成
    const connectorLine = mainGroup.append('path')
        .attr('class', 'connector-line')
        .attr('d', '')
        .style('opacity', 0);

    // パーティクル用のデフ
    const particleDefs = svg.append('defs');
    // 輝きフィルター
    const glowFilter = particleDefs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    glowFilter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'blur');
    glowFilter.append('feComposite')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'blur')
        .attr('operator', 'over');

    // タイムラインを描画
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
        events.append('circle')
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
            // Haraguchi Sotaのイベントにラベルを追加
            events.append('text')
                .attr('class', 'event-label')
                .attr('x', 15)
                .attr('y', 5)
                .attr('text-anchor', 'start')
                .style('fill', 'rgba(255, 255, 255, 0.9)')
                .style('font-size', '12px')
                .style('opacity', 0)
                .text(d => d.title);
            events.append('text')
                .attr('class', 'event-year')
                .attr('x', -15)
                .attr('y', 5)
                .attr('text-anchor', 'end')
                .style('fill', 'rgba(255, 255, 255, 0.7)')
                .style('font-size', '12px')
                .style('opacity', 0)
                .text(d => d.date);
        }
    });

    // Haraguchi Sotaのタイムラインデータを取得（再宣言はそのまま）
    const yourTimeScale = createTimeScale("Haraguchi Sota");
    const finalScale = 4; // 初期スケールを調整
    const initialTransform = d3.zoomIdentity
        .translate(
            width * 0.1 - yourX * finalScale,
            height/15 - (dummyTimeScale(yourTimeline.birth - 55) + offsetAdjustment) * finalScale
        )
        .scale(finalScale);
    const zoom = d3.zoom()
        .scaleExtent([1, 1]) // ユーザーによるズームを無効化
        .translateExtent([
            [yourX - width * 0.2, -height],
            [yourX + width * 0.6, height * 2]
        ])
        .on('zoom', (event) => {
            const transform = event.transform;
            // 水平方向の移動を固定
            const fixedX = width * 0.1 - yourX * transform.k;
            transform.x = fixedX;
            mainGroup.attr('transform', transform);
            
            mainGroup.selectAll('.event-circle')
                .attr('r', function() {
                    const baseRadius = +this.getAttribute('data-base-radius');
                    return baseRadius / transform.k;
                });
            mainGroup.selectAll('.event-label, .event-year')
                .style('font-size', `${12 / transform.k}px`);
        });
    // ユーザーによるズームを無効化し、ホイールイベントを無効化
    svg.call(zoom).on("wheel.zoom", null);
    // ページ全体のスクロールを許可
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
            mainGroup.selectAll('.event-label, .event-year')
                .transition()
                .duration(800)
                .delay((d, i) => i * 150)
                .style('opacity', 0.9);
        });
    
    // ★★ タイトル・サブタイトルを mainGroup 内に追加（元の位置から右にずらす） ★★
    mainGroup.append('text')
        .attr('class', 'portfolio-title')
        .attr('x', yourX + width * 0.045)
        .attr('y', yourTimeScale(yourTimeline.birth) - 25)
        .attr('text-anchor', 'start')
        .style('font-size', '20px')
        .style('fill', '#fff')
        .style('opacity', 0)
        .text('Sota Portfolio');

    mainGroup.append('text')
        .attr('class', 'portfolio-subtitle')
        .attr('x', yourX + width * 0.056)
        .attr('y', yourTimeScale(yourTimeline.birth) - 12)
        .attr('text-anchor', 'start')
        .style('font-size', '8px')
        .style('fill', 'rgba(255, 255, 255, 0.7)')
        .style('opacity', 0)
        .text('Technical School Student');
});

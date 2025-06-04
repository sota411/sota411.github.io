const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor(config) {
        this.apiKey = config.API_KEY;
        this.model = config.MODEL;
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.generativeModel = this.genAI.getGenerativeModel({ model: this.model });
    }

    async analyzeTweets(tweets) {
        try {
            // ツイートのテキストを結合
            const tweetTexts = tweets.map(tweet => `- ${tweet.text}`).join('\n');
            
            const prompt = `
あなたは優秀なデータアナリストです。以下のTwitter投稿を分析し、ポートフォリオサイト用の魅力的な活動報告を作成してください。

【分析対象のツイート（過去15日間）】:
${tweetTexts}

【出力形式】（必ずJSON形式で回答してください）:
{
    "summary": "過去15日間の活動を要約した魅力的な文章（100-200文字）",
    "highlights": ["特に注目すべき成果や学習内容（3-6個の具体的な項目）"],
    "topics": ["主要な活動テーマ（最大5個）"],
    "mood": "全体的な雰囲気（例：積極的, 学習意欲旺盛, 挑戦的, など）",
    "technologies": ["言及された技術・ツール・言語（最大10個）"],
    "achievements": ["具体的な成果や達成事項（あれば）"],
    "focus_area": "現在最も注力している分野"
}

【分析の指針】:
- ポジティブで成長意欲を感じさせる表現を使用
- 技術的な内容は適切な専門用語を使用
- 読み手（採用担当者や協力者）に魅力を伝える
- 具体性と客観性のバランスを保つ
- 継続的な学習姿勢をアピール

【重要】: 回答は必ずJSON形式で、コードブロック不要で出力してください。
`;

            const result = await this.generativeModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // JSONの抽出を試行
            try {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const analysis = JSON.parse(jsonMatch[0]);
                    console.log('Gemini API 分析完了');
                    console.log('分析結果:', {
                        summaryLength: analysis.summary?.length || 0,
                        highlightsCount: analysis.highlights?.length || 0,
                        topicsCount: analysis.topics?.length || 0,
                        technologiesCount: analysis.technologies?.length || 0
                    });
                    return analysis;
                }
            } catch (parseError) {
                console.error('JSON解析エラー:', parseError);
                console.log('生のレスポンス:', text);
            }
            
            // JSON解析に失敗した場合のフォールバック
            return this.createFallbackAnalysis(tweets);
            
        } catch (error) {
            console.error('Gemini API エラー:', error.message);
            // エラー時はフォールバック分析を返す
            return this.createFallbackAnalysis(tweets);
        }
    }

    createFallbackAnalysis(tweets) {
        console.log('フォールバック分析を使用します');
        
        // 基本的な分析を行う
        const technologies = this.extractTechnologies(tweets);
        const topics = this.extractTopics(tweets);
        
        return {
            summary: `過去15日間で${tweets.length}件の投稿を行いました。技術学習、プロジェクト開発、インターンシップでの経験などについて幅広く発信しています。特にプログラミングスキルの向上とAI技術への取り組みに重点を置いた活動を継続しています。`,
            highlights: [
                "継続的な技術学習と実践的な開発経験",
                "インターンシップでの実務経験の積み重ね",
                "プログラミングスキルの向上と新技術への挑戦",
                "資格取得や大会参加などの成果"
            ],
            topics: topics.slice(0, 5),
            mood: "ポジティブ",
            technologies: technologies.slice(0, 10)
        };
    }

    extractTechnologies(tweets) {
        const techKeywords = [
            'JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'TypeScript',
            'HTML', 'CSS', 'AI', 'MachineLearning', 'DeepLearning', 'C#',
            'Docker', 'Git', 'GitHub', 'API', 'Database', 'SQL'
        ];
        
        const found = new Set();
        tweets.forEach(tweet => {
            techKeywords.forEach(tech => {
                if (tweet.text.toLowerCase().includes(tech.toLowerCase()) || 
                    tweet.text.includes(tech)) {
                    found.add(tech);
                }
            });
        });
        
        return Array.from(found);
    }

    extractTopics(tweets) {
        const topicKeywords = {
            '開発': ['開発', 'プログラミング', 'コード', 'アプリ', 'Web'],
            '学習': ['学習', '勉強', '資格', '試験', '本'],
            'インターン': ['インターン', '仕事', '会社', '業務'],
            'AI・機械学習': ['AI', 'MachineLearning', 'DeepLearning', 'JDLA'],
            'セキュリティ': ['CTF', 'セキュリティ', 'ハッキング'],
            '技術': ['技術', 'テック', 'エンジニア']
        };
        
        const topicCounts = {};
        Object.keys(topicKeywords).forEach(topic => {
            topicCounts[topic] = 0;
        });
        
        tweets.forEach(tweet => {
            Object.entries(topicKeywords).forEach(([topic, keywords]) => {
                keywords.forEach(keyword => {
                    if (tweet.text.includes(keyword)) {
                        topicCounts[topic]++;
                    }
                });
            });
        });
        
        return Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([topic]) => topic)
            .filter((topic, index) => index < 5);
    }
}

module.exports = { GeminiService }; 
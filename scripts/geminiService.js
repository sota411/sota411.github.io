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
以下は過去15日間のTwitterの投稿内容です。これらの内容を分析して、以下の形式でJSON形式で要約してください：

ツイート内容:
${tweetTexts}

要求する分析結果（JSON形式で回答してください）:
{
    "summary": "過去15日間の活動内容を自然な日本語で200文字程度でまとめた文章",
    "highlights": ["特に重要な出来事や成果を3-5個の短い文で表現"],
    "topics": ["主要なトピックやテーマ（最大5個）"],
    "mood": "全体的な感情や雰囲気（ポジティブ/ニュートラル/etc）",
    "technologies": ["言及された技術やツール（最大10個）"]
}

注意：
- summary は読みやすく、第三者にも理解できる内容にしてください
- highlights は実際の成果や学習内容を具体的に記載してください
- 技術的な内容については専門用語を適切に使用してください
- 全体的にポートフォリオサイトの読者に向けた内容として適切にしてください
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
                    return analysis;
                }
            } catch (parseError) {
                console.error('JSON解析エラー:', parseError);
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
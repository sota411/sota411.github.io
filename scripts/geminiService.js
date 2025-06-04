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
あなたは優秀なデータアナリストです。以下は過去15日間のTwitterの投稿内容です。これらの内容を分析して、以下の形式でJSON形式で要約してください：

ツイート内容:
${tweetTexts}

要求する分析結果（JSON形式で回答してください）:
{
    "summary": "過去15日間の活動内容を自然な日本語で200文字程度でまとめた文章",
    "highlights": ["特に重要な出来事や成果を3-5個の短い文で表現"],
    "topics": ["主要なトピックやテーマ（最大5個）"],
    "mood": "全体的な感情や雰囲気（ポジティブ/ニュートラル/etc）",
    "technologies": ["言及された技術やツール（最大10個）"],
    "achievements": ["具体的な成果や達成事項（あれば）"],
    "focus_area": "現在最も注力している分野"
}

注意：
- 文章はツイート上でされている具体的な内容を織り交ぜてください
- summary は読みやすく、第三者にも理解できる内容にしてください
- highlights は実際の成果や学習内容を具体的に記載してください
- 技術的な内容については専門用語を適切に使用してください
- 全体的にポートフォリオサイトの読者に向けた内容として適切にしてください
- 配列の要素は必ず文字列で返してください
`;

            console.log('Gemini APIにリクエストを送信中...');
            const result = await this.generativeModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            console.log('Gemini APIから応答を受信しました');
            
            // JSONの抽出を試行（より柔軟に）
            let jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                // バックティックで囲まれている場合も試行
                jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
                if (jsonMatch) {
                    jsonMatch[0] = jsonMatch[1];
                }
            }
            
            if (jsonMatch) {
                try {
                    const analysis = JSON.parse(jsonMatch[0]);
                    
                    // データの妥当性チェック
                    if (!analysis.summary || !Array.isArray(analysis.highlights)) {
                        throw new Error('分析結果の形式が不正です');
                    }
                    
                    console.log('Gemini API 分析完了');
                    console.log('分析結果プレビュー:', {
                        summary: analysis.summary.substring(0, 100) + '...',
                        highlightsCount: analysis.highlights.length,
                        topicsCount: analysis.topics?.length || 0,
                        technologiesCount: analysis.technologies?.length || 0
                    });
                    
                    return analysis;
                    
                } catch (parseError) {
                    console.error('JSON解析エラー:', parseError.message);
                    console.error('受信したテキスト:', text.substring(0, 500) + '...');
                    throw new Error(`Gemini APIの応答をJSON解析できませんでした: ${parseError.message}`);
                }
            } else {
                console.error('JSON形式の応答が見つかりませんでした');
                console.error('受信したテキスト:', text.substring(0, 500) + '...');
                throw new Error('Gemini APIからJSON形式の応答を取得できませんでした');
            }
            
        } catch (error) {
            console.error('Gemini API エラー:', error.message);
            throw error; // エラーを上位に伝播させる
        }
    }
}

module.exports = { GeminiService }; 
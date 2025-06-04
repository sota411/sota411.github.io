const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const { updateActivity } = require('./scripts/updateActivity');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // 静的ファイルの配信

// アクティビティデータを取得するAPI
app.get('/api/activity', (req, res) => {
    try {
        const activityPath = path.join(__dirname, 'data', 'activity.json');
        
        if (!fs.existsSync(activityPath)) {
            return res.json({
                summary: 'アクティビティデータを読み込み中...',
                stats: {
                    tweetCount: 0,
                    topicCount: 0,
                    engagementRate: 0
                },
                lastUpdated: new Date().toISOString()
            });
        }
        
        const activityData = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
        res.json(activityData);
    } catch (error) {
        console.error('アクティビティデータ取得エラー:', error);
        res.status(500).json({ 
            error: 'アクティビティデータの取得に失敗しました',
            summary: 'データ取得中にエラーが発生しました',
            stats: {
                tweetCount: 0,
                topicCount: 0,
                engagementRate: 0
            },
            lastUpdated: new Date().toISOString()
        });
    }
});

// アクティビティを手動更新するAPI
app.post('/api/update-activity', async (req, res) => {
    try {
        console.log('手動アクティビティ更新を開始...');
        const result = await updateActivity();
        res.json({
            success: true,
            message: 'アクティビティが正常に更新されました',
            data: result
        });
    } catch (error) {
        console.error('手動更新エラー:', error);
        res.status(500).json({
            success: false,
            error: 'アクティビティの更新に失敗しました',
            details: error.message
        });
    }
});

// メインページの配信
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 15日に一回のスケジュール実行（午前8時）
// cron形式: 分 時 日 月 曜日
// "0 8 */15 * *" = 毎月15日おきの午前8時
cron.schedule('0 8 */15 * *', async () => {
    console.log('定期アクティビティ更新を開始:', new Date().toISOString());
    try {
        await updateActivity();
        console.log('定期アクティビティ更新完了');
    } catch (error) {
        console.error('定期更新エラー:', error);
    }
}, {
    timezone: "Asia/Tokyo"
});

// データディレクトリが存在しない場合は作成
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// サーバー起動
app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました`);
    console.log(`ポートフォリオ: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/activity`);
    console.log('15日間隔の自動更新が設定されました');
    
    // 初回起動時に一度だけアクティビティを更新
    setTimeout(async () => {
        try {
            console.log('初回アクティビティ更新を実行...');
            await updateActivity();
            console.log('初回更新完了');
        } catch (error) {
            console.error('初回更新エラー:', error);
        }
    }, 5000); // 5秒後に実行
}); 
# Portfolio Activity Updater

## 概要

このシステムは、15日に一回自動でTwitterの直近のポストを取得し、Gemini APIを使って統合・要約して、ポートフォリオサイトに自動反映する機能です。

## 🚀 GitHub Pages での自動化セットアップ

### 1. リポジトリの準備

```bash
# ファイルをコミット
git add .
git commit -m "Add automated activity update system"
git push origin main
```

### 2. GitHub Secrets の設定

GitHubリポジトリの設定で以下のSecretsを追加：

1. リポジトリのページで **Settings** → **Secrets and variables** → **Actions** へ移動
2. **New repository secret** をクリックして以下を追加：

```
Name: X_API_BEARER_TOKEN
Value: あなたのTwitter Bearer Token

Name: GEMINI_API_KEY  
Value: あなたのGemini APIキー
```

### 3. GitHub Actions の有効化

1. リポジトリの **Actions** タブへ移動
2. ワークフローを有効化
3. **Update Portfolio Activity** ワークフローが表示される

### 4. GitHub Pages の設定

1. **Settings** → **Pages** へ移動
2. **Source** を **Deploy from a branch** に設定
3. **Branch** を `main` / `(root)` に設定
4. **Save** をクリック

### 5. 手動実行でテスト

1. **Actions** タブの **Update Portfolio Activity** をクリック
2. **Run workflow** → **Run workflow** で手動実行
3. 実行結果とデータファイルの更新を確認

## 🔄 自動更新の仕組み

### スケジュール
- **自動実行**: 15日ごとの午前8時（JST）
- **手動実行**: GitHub Actionsから随時可能

### データフロー
```
Twitter API → Gemini AI → activity.json → GitHub Pages
```

1. GitHub Actionsがツイートを取得
2. Gemini AIで内容を分析・要約
3. 結果を`data/activity.json`に保存
4. 自動でコミット・プッシュ
5. GitHub Pagesが更新されたサイトを配信

## 機能

- 🔄 **自動更新**: 15日ごとにTwitterポストを自動取得
- 🤖 **AI統合**: Gemini APIで過去15日間のツイートを分析・要約
- 📊 **統計表示**: ツイート数、主要トピック、活動度を可視化
- 🎨 **リアルタイム表示**: ポートフォリオサイトに動的に結果を反映
- ⚡ **高速読み込み**: 静的ファイルによる高速表示
- 📱 **レスポンシブ**: モバイル対応の美しいUI

## 技術スタック

### フロントエンド
- HTML5/CSS3/JavaScript
- AOS (Animation On Scroll)
- Font Awesome
- tsParticles

### バックエンド（GitHub Actions）
- Node.js
- Twitter API v2
- Google Gemini API
- GitHub Actions（自動実行）

## ローカル開発

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 設定ファイルの作成

`settings.json`ファイルを作成（GitHubには含めない）：

```json
{
  "X_API": {
    "BEARER_TOKEN": "あなたのTwitter Bearer Token",
    "BASE_URL": "https://api.twitter.com/2",
    "USERNAME": "Sota_411"
  },
  "GEMINI_API": {
    "API_KEY": "あなたのGemini APIキー",
    "MODEL": "gemini-1.5-flash",
    "BASE_URL": "https://generativelanguage.googleapis.com/v1beta/models"
  }
}
```

### 3. ローカルサーバー起動

```bash
# 開発環境
npm run dev

# 本番環境
npm start
```

### 4. 静的ファイル生成（テスト）

```bash
# GitHub Actions環境をシミュレート
node scripts/updateActivity.js
```

## ファイル構造

```
.
├── .github/workflows/
│   └── update-activity.yml   # GitHub Actions ワークフロー
├── scripts/
│   ├── updateActivity.js     # 統合された更新ロジック（ローカル/GitHub Actions両対応）
│   ├── twitterService.js     # Twitter API サービス
│   └── geminiService.js      # Gemini API サービス
├── data/
│   └── activity.json         # 生成されるアクティビティデータ
├── js/
│   └── script.js             # フロントエンドスクリプト
├── css/
│   └── style.css             # スタイルシート
├── index.html                # メインHTMLファイル
├── package.json              # 依存関係とスクリプト
└── README.md                 # このファイル
```

## カスタマイズ

### 更新間隔の変更

`.github/workflows/update-activity.yml`のcron設定を変更：

```yaml
schedule:
  # 毎日更新の場合
  - cron: '0 23 * * *'
  # 毎週更新の場合  
  - cron: '0 23 * * 1'
```

### 分析内容のカスタマイズ

`scripts/geminiService.js`のプロンプトを編集してAI分析内容を調整。

### UI のカスタマイズ

`css/style.css`でアクティビティセクションのスタイルを変更。

## トラブルシューティング

### よくある問題

1. **GitHub Actions が失敗する**
   - Secretsが正しく設定されているか確認
   - API制限に達していないか確認
   - ワークフローログでエラー詳細を確認

2. **データが表示されない**
   - `data/activity.json`が正しく生成されているか確認
   - ブラウザのコンソールでエラーをチェック
   - GitHub Pagesが正しく設定されているか確認

3. **Twitter API エラー**
   - Bearer Tokenが有効か確認
   - アカウントのツイートが公開設定か確認

4. **Gemini API エラー**
   - APIキーが有効か確認
   - 利用制限を確認

## 最適化された機能

### コード統合
- 重複していた `updateActivity.js` と `updateActivityStatic.js` を統合
- 共通ユーティリティ関数 `ActivityUtils` で保守性向上
- GitHub Actions とローカル環境の両方に対応

### パフォーマンス改善
- 未使用のファイル・関数・CSS変数を削除
- 287KBの未使用画像ファイルを削除
- 依存関係の最適化

### 自動化機能
- 15日間隔での自動実行
- 手動実行オプション
- エラー時のフォールバック機能
- 自動コミット・デプロイ

## セキュリティ

- APIキーはGitHub Secretsで管理
- settings.jsonはgitignoreで除外
- 公開リポジトリでも安全に運用可能

## 今後の拡張案

- [ ] 複数のSNSプラットフォーム対応
- [ ] より詳細な統計とグラフ表示
- [ ] 管理ダッシュボードの追加
- [ ] 他のCI/CDプラットフォーム対応
- [ ] 多言語対応

## ライセンス

MIT License

## 作者

sota411 - [@Sota_411](https://x.com/Sota_411)

---

このシステムによって、GitHub Pagesでホストされたポートフォリオサイトが自動で最新の活動内容を反映し、訪問者に現在の取り組みを効果的に伝えることができます。 
# 記事運用手順（追加・更新・削除）

このドキュメントは、`articles/` 配下の Markdown を使って記事を運用するための手順です。

## 前提

- Node.js / npm が利用できること
- プロジェクトルートで作業すること

## ファイル構成

- `articles/index.json`: 記事一覧メタ情報（編集対象）
- `articles/*.md`: 記事本文（編集対象）
- `data/articles/index.json`: 公開用記事一覧（生成物）
- `data/articles/*.json`: 公開用記事本文（生成物）

## index.json の必須項目

`articles/index.json` の各要素には次が必要です。

- `slug`: 英小文字・数字・ハイフンのみ（例: `my-first-post`）
- `title`: 記事タイトル
- `date`: `YYYY-MM-DD`
- `summary`: 記事カードに表示する要約
- `source`: 本文 Markdown ファイル名（例: `my-first-post.md`）

## 1. 記事を追加する（対話CLI）

次のコマンドを実行します。

```bash
npm run add-article
```

CLIで `action` に `1`（追加）を入力し、次を順番に入力します。

- `slug`（英小文字・数字・ハイフンのみ）
  - 例: `applied-information-pass-2025`
- `title`（記事タイトル）
  - 例: `応用情報技術者試験に合格しました`
- `date (YYYY-MM-DD)`（公開日）
  - 例: `2025-12-25`
- `summary`（記事カードに表示する要約）
  - 例: `応用情報技術者試験の学習法と当日の振り返りをまとめました。`

確定後に自動で次を実行します。

- `articles/<slug>.md` をテンプレート付きで作成
- `articles/index.json` に記事メタ情報を追加
- `npm run build-articles` を実行

## 2. 記事を更新する

1. 必要なファイルを編集します。

- 本文変更: `articles/<slug>.md`
- タイトル・日付・要約変更: `articles/index.json`

2. 次のコマンドを実行します。

```bash
npm run build-articles
```

## 3. 記事を削除する（対話CLI）

次のコマンドを実行します。

```bash
npm run add-article
```

CLIで `action` に `2`（削除）を入力し、対象記事の `番号` または `slug` を指定します。
CLIは次を自動実行します。

- `articles/<slug>.md` の削除
- `articles/index.json` から対象エントリを削除
- `data/articles/<slug>.json` があれば削除
- `npm run build-articles` を実行

## 4. 記事一覧を確認する（対話CLI）

次のコマンドを実行し、`action` に `3`（一覧表示）を入力します。

```bash
npm run add-article
```

`slug | date | title` 形式で現在の記事一覧が表示されます。

## 5. 反映確認

- `data/articles/index.json` に期待する内容が出力されている
- `data/articles/<slug>.json` が生成または更新されている
- `http://127.0.0.1:3000/#articles` でカードが表示される
- `http://127.0.0.1:3000/article.html?slug=<slug>` で本文が表示される

## トラブルシュート

1. `Failed to manage article` が出る場合  
`slug` 形式、`date` 形式、重複 `slug`、既存 Markdown 衝突を確認する。
2. `Failed to build articles` が出る場合  
`articles/index.json` の必須項目不足や日付形式、`source` で指定した Markdown ファイルの存在を確認する。
3. 記事が表示されない場合  
`npm run build-articles` 実行後に `data/articles/` の生成結果を確認し、`file://` ではなく `http://127.0.0.1:3000` で確認する。

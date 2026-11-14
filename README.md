# sou31415.github.io

このリポジトリは Next.js (TypeScript) で構築された個人ブログです。トップページと `/blog` に記事一覧を表示し、`/blog/[slug]` で記事本文を表示します。

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
npm run start
```

`public/` 配下には従来の静的アセットを配置しているため、既存ページの URL 構造を保ったまま公開できます。

## 記事の追加

`content/blog/posts/` に Markdown ファイルを追加します。ファイル名が記事の URL の末尾になります。先頭の `#` 見出しを記事タイトルとして使用し、フロントマターに `date: "YYYY-MM-DD"` を指定します。必要に応じて `description` と `tags` を追加できます。

開発・ビルド時に記事データを自動生成します。既存記事のメタデータは `content/blog/overrides.json` でも指定できます。

## 検証

```bash
npm run lint
npm run test:blog
```

`test:blog` は本番ビルド後、一時的なローカルサーバーを起動し、トップと既存のブログ URL、記事本文、一覧への導線、存在しない記事の 404 応答を検証します。

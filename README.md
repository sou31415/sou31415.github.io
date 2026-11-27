# sou31415.github.io

このリポジトリは Next.js (TypeScript) で構築された個人ブログです。トップページと `/blog` に、フォルダを問わず公開済みの記事を一覧表示します。

配色は端末のライトモード・ダークモード設定に合わせて自動で切り替わります。

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

`content/blog/posts/` に Markdown ファイルを追加します。このフォルダからの相対パスから `.md` を除いた部分が、`/blog/` に続く記事 URL になります。サブフォルダは任意の深さで作成できます。ファイルやフォルダを移動すると、記事 URL も変わります。

| 記事ファイル | URL |
| --- | --- |
| `content/blog/posts/2025.md` | `/blog/2025` |
| `content/blog/posts/advent2026/01.md` | `/blog/advent2026/01` |
| `content/blog/posts/notes/web/routing.md` | `/blog/notes/web/routing` |

先頭の `#` 見出しを記事タイトルとして使用し、フロントマターに `date: "YYYY-MM-DD"` を指定します。必要に応じて `description` と `tags` を追加できます。

開発・ビルド時に記事データを自動生成します。メタデータを `content/blog/overrides.json` で指定する場合は、`advent2026/01` のように `.md` を除いた相対パスをキーに使用します。

下書きには、フロントマターに `status: pending` を指定します。指定日を過ぎても一覧に表示されず、記事URLは404を返します。公開するには `status: ready` に変更してデプロイします。`status` を省略した記事は `ready` として扱います。

`ready` の記事は、デプロイ済みであれば指定日の午前0時（日本時間）から公開されます。たとえば `date: "2026-12-01"` の記事は、12月1日午前0時から一覧と記事URLに表示されます。公開前は記事URLが404を返します。公開リポジトリに追加したMarkdown原稿は、予約日時より前でもGitHubで閲覧できます。

## 検証

```bash
npm run lint
npm run test:blog
```

`test:blog` は本番ビルド後、一時的なローカルサーバーを起動し、記事一覧と本文、404 応答、日本時間の午前0時を境とした予約公開を検証します。

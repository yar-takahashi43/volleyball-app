# Request

現在のタスクは Redmine #41（Phase 8 — リリース / デプロイ準備）。

参照: phase0.md §11-2、memo/ai/phase0/task-roadmap-phase7-10-2026-11-15.md。
Phase 0〜7 は Complete。Render + Atlas で本番公開できる状態までリポジトリ側を固める。

スコープ:
- バックエンド `start` / `dev` 分離、本番 JWT / PORT / MONGOURL ガード
- `.env.example`（back / front）整備
- `render.yaml`（API Web Service + Static Site SPA rewrite）
- デプロイ手順・通し確認チェックリスト・phase0 更新

スコープ外:
- Render / Atlas ダッシュボード操作の代行（ユーザー側）
- Phase 9（スコア訂正）/ Phase 10（認証発展）
- `.env` のコミット

# Response

ホストは **Render**、DB は **既存 Atlas クラスタを本番接続**（ローカル開発はこれまでどおりローカル Mongo 可）で確定。リポジトリ側の起動・env・Blueprint・手順を追加した。

## 変更ファイル

- `volleyball-back/package.json`（`start`: node / `dev`: nodemon）
- `volleyball-back/server.js`（PORT 既定 5001、本番 JWT_SECRET 必須、MONGOURL 必須）
- `volleyball-back/.env.example`
- `volleyball-front/.env.example`（新規）
- `render.yaml`（新規）
- `Readme.md`
- `phase0.md`
- `memo/ai/phase8/task-9-release-deploy-2026-11-22.md`（本ログ）

## DB 現状（調査結果）

- ローカル `.env` の有効設定: `mongodb://127.0.0.1:27017/...`（ローカル Mongo）
- 同ファイルに Atlas（`mongodb+srv://...`）がコメントアウトで残存
- 本番は既存 Atlas を再有効化して使う（新規クラスタ作成はしない方針）

# Decisions

| 項目 | 決定 |
|------|------|
| ホスト | Render（API Web Service + Static Site） |
| DB 本番 | 既存 Atlas Cluster。Network Access で Render から接続可にする |
| 起動スクリプト | `npm start` = 本番、`npm run dev` = ローカル nodemon |
| JWT | 本番（`NODE_ENV=production`）で未設定なら `process.exit(1)` |
| Front API URL | `REACT_APP_API_URL`（末尾スラッシュなし）。`Api.js` が `/api` を付与 |
| SPA | Static の `/*` → `/index.html` rewrite |
| Blueprint 秘密情報 | `sync: false`（Dashboard で手動設定） |

# Status

- リポジトリ側のデプロイ準備: **Done**
- ユーザー側の Atlas / Render 設定・本番通し確認: **Pending**（下記チェックリスト）

---

## ユーザー作業手順

### A. MongoDB Atlas

1. [MongoDB Atlas](https://cloud.mongodb.com/) にログインし、既存クラスタが生きているか確認
2. Database Access: アプリ用ユーザーとパスワードを用意（`.env` に古い平文がある場合はローテーション推奨）
3. Network Access: Render から届くよう `0.0.0.0/0` を許可（または Render の outbound IP が分かる場合はそれに限定）
4. 接続文字列をコピー（DB 名は例: `volleyball`）。ローカル Mongo のデータとは別世界になる
5. パスワードに特殊文字がある場合は URL エンコードする

### B. Render（Blueprint）

1. GitHub 等にリポジトリを push（秘密の `.env` は含めない）
2. Render Dashboard → New → Blueprint → このリポジトリを選択（`render.yaml`）
3. 作成されるサービス:
   - `volleyball-api`（Web Service, root `volleyball-back`）
   - `volleyball-front`（Static Site, root `volleyball-front`）
4. **API の Environment**
   - `MONGOURL` = Atlas 接続文字列
   - `JWT_SECRET` = 長いランダム文字列
   - `JWT_EXPIRES_IN` = `7d`（Blueprint 既定あり）
   - `CLIENT_ORIGIN` = Front の HTTPS URL（例: `https://volleyball-front.onrender.com`）。末尾スラッシュなし
   - `NODE_ENV` = `production`（Blueprint 既定あり）
5. **Front の Environment（ビルド時）**
   - `REACT_APP_API_URL` = API の HTTPS URL（例: `https://volleyball-api.onrender.com`）。末尾スラッシュなし
6. デプロイ後、API のルート（`/`）が `hello` を返すこと、Front が開けることを確認
7. `CLIENT_ORIGIN` / `REACT_APP_API_URL` は互いに相手の本番 URL を指す。片方を変えたらもう方も更新して再デプロイ

手動作成する場合も同じ rootDir / build / start / rewrite / env で揃える。

### C. 注意

- Render Free はアイドル後にスリープし、初回 API 応答が遅くなることがある
- Front の env を変えたら **再ビルド（Redeploy）** が必要（CRA はビルド時に `REACT_APP_*` を埋め込む）
- 本番で `JWT_SECRET` 未設定だと API は起動しない（意図的）

---

## 通し確認チェックリスト（本番 HTTPS）

前提: Atlas 接続済み、Render の API / Front が Deploy Live。

### API / 認証

1. [ ] `https://<api>/` が応答する（初回はコールドスタートで数十秒かかることがある）
2. [ ] Front で新規 register できる（レスポンスに password なし・token あり）
3. [ ] login できる
4. [ ] 誤パスワードで失敗する
5. [ ] ログアウトできる

### CORS / env

6. [ ] ブラウザ Console に CORS エラーが出ない（`CLIENT_ORIGIN` = Front URL）
7. [ ] Network タブで API が `REACT_APP_API_URL` 向けに飛んでいる

### 試合フロー

8. [ ] 試合（match）を作成できる
9. [ ] 試合画面でスタメン等を操作できる
10. [ ] スコア確定（ace / miss / ラリー）が成功する
11. [ ] リロード後もスコアが復元される

### PWA（Phase 7 残り）

12. [ ] DevTools → Application → Manifest が読める
13. [ ] Service Worker が activated
14. [ ] タブレットで「ホーム画面に追加」できる
15. [ ] standalone 起動後もログイン〜試合画面が通る

結果は下表に追記する。

## 本番確認ログ

| 日付 | 項目 | 結果 | メモ |
|------|------|------|------|
| （未記入） | | | |

## 次フェーズ

- Phase 9: スコア確定後の訂正・削除（API + UI）
- Phase 10: 認証発展・細かい UX

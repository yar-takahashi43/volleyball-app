# Request

現在のタスクは Redmine #7（Phase 6 — 認証セキュリティ）。

設計書 phase0.md フェーズ分け「認証セキュリティ（bcrypt 等）」を参照。
Phase 0〜5 は Complete。

本番想定:
- MERN を PWA としてタブレット利用
- MongoDB Atlas
- フロント / バックは別オリジン（GitHub Pages 系 + 無料バックエンド）

スコープ（B + CORS/helmet）:
- bcrypt ハッシュ化 + JWT 発行/検証
- match / set / scores / player / opponent / users を保護
- レスポンスから password 除去、User スキーマ修正
- フロント: token 保存、Bearer 付与、ProtectedRoute、ログアウト
- helmet + CORS（CLIENT_ORIGIN）
- 既存平文ユーザーは再登録前提
- 作業ログ作成

スコープ外:
- リフレッシュトークン / HttpOnly cookie
- パスワードリセット
- isAdmin RBAC 詳細
- PWA manifest / service worker
- 平文ユーザー自動移行

# Response

volleyball-back / volleyball-front の双方を変更し、DoD を満たす実装を完了した。

主な変更ファイル:
- volleyball-back/models/User.js（password minlength/maxlength 修正）
- volleyball-back/utils/sanitizeUser.js（新規）
- volleyball-back/middleware/verifyToken.js（新規）
- volleyball-back/routes/auth.js（bcryptjs + JWT、`{ token, user }`）
- volleyball-back/routes/users.js（JWT の本人/admin 判定）
- volleyball-back/server.js（helmet、CORS、verifyToken 適用）
- volleyball-back/.env.example（JWT_SECRET / CLIENT_ORIGIN 等）
- volleyball-front/src/Api.js（Bearer interceptor、401 クリア）
- volleyball-front/src/actionCalls.js / state/Auth*（token + LOGOUT）
- volleyball-front/src/App.js（ProtectedRoute）
- volleyball-front/src/pages/login/Login.jsx / register/Register.jsx
- volleyball-front/src/pages/menu/Menu.jsx（ログアウト）
- MatchList / MatchListByDate / Member の生 axios → api 寄せ
- memo/ai/phase6/task-7-auth-security-2026-08-03.md（本ログ）

# Decisions

- Node 16 環境のため native `bcrypt` ではなく `bcryptjs` を採用。
- 認証方式は Bearer JWT + localStorage（別オリジン PWA 向け）。cookie セッションは採用しない。
- login / register レスポンス契約は `{ token, user }`（password なし）。
- 保護対象は `/api/users` `/api/match` `/api/set` `/api/scores` `/api/player` `/api/opponent`。`/api/auth/*` は公開。
- users 更新/削除は body の userId/isAdmin を信頼せず、JWT の `req.user` で判定。
- CORS は `CLIENT_ORIGIN`（未設定時は `http://localhost:3000`）。
- `JWT_SECRET` 未設定時は開発用仮シークレットを使い警告を出す。本番では必須設定。
- 既存平文ユーザーは移行せず再登録前提。
- 未ログインの `/` は Register ではなく Login へ誘導。

# Status

- Phase 6（Redmine #7）: **Complete**
- API 手動確認済み（register / login 成功・失敗 / password 非返却 / 401 / token 付き match）
- 次: Phase 7 — PWA + タブレット向けレスポンシブ（別チャット）。リリース/デプロイは Phase 8。ロードマップは phase0.md §11-2 / memo/ai/phase0/task-roadmap-phase7-10-2026-11-15.md

# Phase 6 まとめ

## 目的

平文パスワードと無防備な API をやめ、タブレット PWA + 別オリジン本番想定に耐える認証セキュリティを入れる。

## 実装内容

| 項目 | 内容 |
|------|------|
| パスワード | 登録時 bcryptjs ハッシュ、ログイン時 compare |
| JWT | login/register で発行、verifyToken で検証 |
| ルート保護 | auth 以外の業務 API に middleware 適用 |
| sanitize | password をレスポンスから除去 |
| フロント | auth localStorage、Bearer、ProtectedRoute、ログアウト |
| ヘッダ | helmet + CORS allowlist |

## 変更ファイル

### Backend
- `volleyball-back/models/User.js`
- `volleyball-back/utils/sanitizeUser.js`
- `volleyball-back/middleware/verifyToken.js`
- `volleyball-back/routes/auth.js`
- `volleyball-back/routes/users.js`
- `volleyball-back/server.js`
- `volleyball-back/package.json`（bcryptjs, jsonwebtoken）
- `volleyball-back/.env.example`

### Frontend
- `volleyball-front/src/Api.js`
- `volleyball-front/src/actionCalls.js`
- `volleyball-front/src/state/AuthContext.js`
- `volleyball-front/src/state/AuthReducer.js`
- `volleyball-front/src/state/AuthActions.js`
- `volleyball-front/src/App.js`
- `volleyball-front/src/pages/login/Login.jsx`
- `volleyball-front/src/pages/login/Login.css`
- `volleyball-front/src/pages/register/Register.jsx`
- `volleyball-front/src/pages/menu/Menu.jsx`
- `volleyball-front/src/pages/menu/Menu.css`
- `volleyball-front/src/pages/match/MatchList.jsx`
- `volleyball-front/src/pages/match/MatchListByDate.jsx`
- `volleyball-front/src/components/sidebar/Member.jsx`
- `volleyball-front/src/components/sidebar/Reception.jsx`

## Phase 6 動作確認（DoD）

1. 新規 register → ハッシュ保存・レスポンスに password なし・token あり（確認済み）
2. 正しい password で login 成功（確認済み）
3. 誤った password で 400（確認済み）
4. token なしで `/api/match/matches` が 401（確認済み）
5. token 付きで match 取得成功（確認済み）
6. フロント: token 永続化 / ProtectedRoute / ログアウト（実装済み・ブラウザ確認推奨）
7. 作業ログ作成済み

## デプロイ時メモ

- バックエンド `.env` に `JWT_SECRET`（長いランダム）、`JWT_EXPIRES_IN`、`CLIENT_ORIGIN`（フロント URL）を設定
- フロント `REACT_APP_API_URL` をバックエンド公開 URL に設定
- 既存平文ユーザーは再登録が必要

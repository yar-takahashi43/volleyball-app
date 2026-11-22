# volleyball-app

バレーボールの試合スコアをタブレットで記録するアプリ（React + Express + MongoDB）。

## 構成

| ディレクトリ | 役割 |
|--------------|------|
| `volleyball-front` | React フロント（PWA） |
| `volleyball-back` | Express API |
| `render.yaml` | Render Blueprint（本番） |

## ローカル起動

前提: Node.js、ローカル MongoDB または Atlas 接続文字列。

### 1. バックエンド

```bash
cd volleyball-back
cp .env.example .env
# .env の MONGOURL / JWT_SECRET / CLIENT_ORIGIN を編集
npm install
npm run dev
```

- 開発: `npm run dev`（nodemon）
- 本番相当の起動確認: `npm start`（`node server.js`）
- 既定ポート: `5001`（`PORT` で変更可）

### 2. フロントエンド

```bash
cd volleyball-front
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5001
npm install
npm start
```

ブラウザ: `http://localhost:3000`

## 本番デプロイ（Render + Atlas）

詳細手順と通し確認は [memo/ai/phase8/task-9-release-deploy-2026-11-22.md](memo/ai/phase8/task-9-release-deploy-2026-11-22.md) を参照。

概要:

1. MongoDB Atlas のクラスタ・DB ユーザー・Network Access（Render 向けに `0.0.0.0/0` 等）を用意
2. Render で Blueprint（`render.yaml`）または手動で API（Web Service）と Front（Static Site）を作成
3. API env: `MONGOURL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN`（Front の HTTPS URL）
4. Front ビルド env: `REACT_APP_API_URL`（API の HTTPS URL、末尾スラッシュなし）
5. HTTPS の本番 URL で register → 試合 → スコア確定まで通し確認

注意: Render Free 枠はスリープ後の初回応答が遅くなることがあります。`.env` はコミットしないでください。

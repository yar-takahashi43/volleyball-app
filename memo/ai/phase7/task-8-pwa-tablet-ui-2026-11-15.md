# Request

現在のタスクは Redmine #40（Phase 7 — PWA + タブレット UI）。

参照: phase0.md §11-2、memo/ai/phase0/task-roadmap-phase7-10-2026-11-15.md。
Phase 0〜6 は Complete。タブレット実機で使い心地を検証できるところまで実装する。

スコープ:
- manifest.json / アイコン / Service Worker（キャッシュ方針を確定）
- 試合画面・Sidebar・Scorebar・Topbar のタブレット幅対応
- 実機確認用の手順と改善ログ枠
- 作業ログ作成

スコープ外:
- 本番デプロイ / env 固め（Phase 8）
- スコア訂正・削除（Phase 9）
- 認証発展（Phase 10）
- オフラインでのスコア入力キュー（今回は API NetworkOnly）

# Response

volleyball-front を中心に PWA 化と試合画面のタブレット UI を実装した。`npm run build` で `build/service-worker.js` が生成されることを確認済み。

## キャッシュ方針（確定）

| 対象 | 戦略 | 理由 |
|------|------|------|
| ビルド成果物（JS/CSS/index.html） | Workbox precache | ホーム画面追加後の起動・再訪を速くする |
| 同一オリジン画像 | StaleWhileRevalidate（max 50） | アイコン等の静的ファイル |
| `/api` および localhost:5000/5001 | NetworkOnly | スコア・認証をキャッシュしない |
| ナビゲーション | App Shell（index.html） | SPA ルートを offline shell で受ける |

登録タイミング: **production ビルドのみ**（`npm start` では SW 登録しない）。  
PWA の install / SW 検証は HTTPS（または localhost の `serve -s build`）が必要。

## 変更ファイル

### PWA
- `volleyball-front/public/manifest.json`（アプリ名・theme・icons）
- `volleyball-front/public/index.html`（ja、viewport-fit、apple-mobile-web-app、相対 CSS）
- `volleyball-front/public/logo192.png` / `logo512.png` / `apple-touch-icon.png`（新規）
- `volleyball-front/src/service-worker.js`（新規）
- `volleyball-front/src/serviceWorkerRegistration.js`（新規）
- `volleyball-front/src/index.js`（register 呼び出し）

### タブレット UI
- `volleyball-front/src/pages/score/Score.css`（899px 境界で縦積み / 横並び）
- `volleyball-front/src/components/sidebar/Sidebar.css`（sticky + 画面内スクロール、タッチ 44px）
- `volleyball-front/src/components/member/Member.css`（固定 300px をやめて Sidebar 幅に追従）
- `volleyball-front/src/components/evaluation/Reception.css` / `Spike.css`（同上 + 44px ボタン）
- `volleyball-front/src/components/game/Scorebar.css` / `ScoreDetail.css`（行高・16px select・チェック拡大）
- `volleyball-front/src/components/topbar/Topbar.css`（56px、safe-area、狭い幅で折り返し）
- `volleyball-front/src/App.css`（overscroll / text-size-adjust）

### ドキュメント
- `phase0.md`（§11-2 Redmine #40、次フェーズ表記）
- `memo/ai/phase7/task-8-pwa-tablet-ui-2026-11-15.md`（本ログ）

# Decisions

| 項目 | 決定 |
|------|------|
| SW 導入方式 | CRA 5 の `src/service-worker.js` + InjectManifest（cra-template-pwa 相当） |
| API キャッシュ | しない（NetworkOnly）。ライブ採点の鮮度を優先 |
| ブレークポイント | 899px 以下: Sidebar 上 / Scorebar 下。900px 以上: 横並び + Sidebar sticky |
| タッチターゲット | +/-・Topbar 操作・チェックを概ね 44px 前後 |
| iOS ズーム防止 | Scorebar の select を font-size 16px |
| アイコン | 簡易生成 PNG（theme `#2c517c`）。本番ブランディング差し替え可 |
| 実機確認 | 実装側は完了。検証結果は本メモ「実機確認ログ」に追記 |

# Status

- PWA（manifest / icons / SW / register）: **Done**
- 試合画面タブレット UI: **Done**
- production build 成功（SW 生成確認）: **Done**
- ログイン/登録の説明文を一般向けに修正: **Done**（「試合のスコアを記録・管理」）
- DevServer 起動修正（proxy 削除 + HOST=127.0.0.1）: **Done**
- Phase 7: **Complete**（2026-11-15）

## 実機確認チェックリスト

前提: `cd volleyball-front && npm run build` 後、HTTPS 相当で配信（例: `npx serve -s build`、またはトンネル）。API は起動済み。

1. [ ] ブラウザで manifest が読める（DevTools → Application → Manifest）
2. [ ] Service Worker が activated（Application → Service Workers）
3. [ ] 「ホーム画面に追加」できる（iPad Safari / Android Chrome）
4. [ ] standalone 起動後、ログイン → 試合画面まで通る
5. [ ] 横向き: Sidebar 左・Scorebar 右、Sidebar が sticky で縦スクロールできる
6. [ ] 縦向き: Sidebar が上、Scorebar が下で操作できる
7. [ ] +/- ボタン・チェック・セレクトが指で押しやすい
8. [ ] スコア確定（ace / miss / ラリー）が API に届き、リロード後も復元される
9. [ ] 通信あり時に古いスコアが SW キャッシュから出ない（API NetworkOnly）

## 改善ログ（実機後に追記）

| 日付 | 端末 | 内容 | 対応 |
|------|------|------|------|
| （未記入） | | | |

## 次フェーズ

Phase 8（Redmine 新規）: リリース / デプロイ準備（env・ホスト・Atlas・HTTPS・通し確認）

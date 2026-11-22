# Request

現在のタスクは Redmine #5（Phase 4 — ルーティング）。

設計書 phase0.md §9 を参照。Phase 0 / 1 / 2 / 3 は Complete。バックエンド疎通確認済み。

スコープ:
- App に `/matches/:date` を追加（壊れた `/gamelist/date` を削除）
- 試合画面は `/match/:id` 固定（セット ID を URL に載せない）
- セット切替は `selectedSetId` state で管理
- Topbar 次ページから `/score/...` への navigate をやめる
- 日付一覧の試合行から `/match/:id` へ遷移できるようにする
- 作業ログ作成

動作確認後の追加（同 Phase 内 Follow-up）:
- 次ページ: 既存セットがあれば 1 つ先へ移動、最終セットのときだけ新規作成
- リロード: `currentSetId` で表示セットを復元
- 新セット: スタメン空・ベンチ全選手（重複解消）。セットごとにスタメンを選び直す
- セット切替時: GET set で最新のスタメン / actions を取り込み

スコープ外:
- Scorebar derive + pushScore 接続（Phase 5）
- 認証セキュリティ（Phase 6）
- `/gamelist` → `/matches` へのリネーム

# Response

volleyball-front を中心に変更し、Follow-up で set 作成 API も調整した。

主な変更ファイル:
- volleyball-front/src/App.js（`/matches/:date` 追加、`/gamelist/date` 削除）
- volleyball-front/src/pages/match/Game.jsx（`/match/:id` への Link）
- volleyball-front/src/pages/match/MatchList.jsx（Link の key / id）
- volleyball-front/src/pages/match/Match.jsx（selectSetById / selectNextSet / selectPreviousSet / applySetToSidebar）
- volleyball-front/src/pages/score/Score.jsx（コールバック配線）
- volleyball-front/src/components/topbar/Topbar.jsx（`/score` navigate 削除、前/次ページを state 切替）
- volleyball-front/src/utils/mergeSetIntoMatch.js（_id 比較を String 化）
- volleyball-back/routes/set.js（新規セットは starPlayer 空・benchMem 全選手）

# Decisions

- セット切替は URL に載せない。`selectedSetId` + `match.currentSetId`（PUT）で管理・リロード復元する。
- 「次ページ」は既存セットへ 1 つ移動。最終セットのときだけ POST で新規作成。
- セット切替ロジックは Match に寄せ、Topbar は `onSelectNextSet` / `onSelectPreviousSet` を呼ぶだけ。
- セット切替時は GET set → `mergeSetIntoMatch` で最新スタメン / actions を取り込む。
- スタメンはセット単位（`Set.starPlayer`）。セット 3 の変更はセット 1・2 に影響しない。
- 「スターティング」= そのセットのコートメンバー。新セットは毎回空スタートで選び直す。
- `/gamelist`（日付一覧）は維持し、日付詳細だけ `/matches/:date` とする。

# Status

- Phase 4（Redmine #5）: **Complete**
- Follow-up 含む動作確認済み（ルート / セット前後移動 / リロード復元 / スタメンセット単位 / 新セット重複なし）
- 次: Phase 5 — Scorebar derive + pushScore 接続（Redmine #6）※新しいチャットで開始

# Phase 4 まとめ

## 目的

phase0.md §9 に従い、試合一覧〜試合画面のルートを通し、セット切替を URL ではなく `selectedSetId` に統一する。あわせてセット前後移動・リロード復元・セット単位スタメンの UX を整える。

## 実装内容

| 項目 | 内容 |
|------|------|
| `/matches/:date` | App に登録。`MatchListByDate` を表示 |
| `/gamelist/date` | 削除（`:date` なしで壊れていた） |
| `/match/:id` | 維持。セット ID を URL に載せない |
| Game → Match | 日付・対戦相手表示を Link で `/match/:id` へ |
| 次ページ | 次の既存セットへ移動。最終なら新規作成。`/score` へ navigate しない |
| 前ページ | 前のセットへ移動。先頭なら無操作 |
| リロード復元 | `currentSetId` を PUT 保存し、ロード時に優先選択 |
| 新セット初期メンバー | `starPlayer: []`、`benchMem: 全選手`（重複なし） |
| セット切替同期 | GET set + `applySetToSidebar` でスタメン / actions を反映 |

## 変更ファイル

- `volleyball-front/src/App.js`
- `volleyball-front/src/pages/match/Game.jsx`
- `volleyball-front/src/pages/match/MatchList.jsx`
- `volleyball-front/src/pages/match/Match.jsx`
- `volleyball-front/src/pages/score/Score.jsx`
- `volleyball-front/src/components/topbar/Topbar.jsx`
- `volleyball-front/src/utils/mergeSetIntoMatch.js`
- `volleyball-back/routes/set.js`
- `memo/ai/phase4/task-5-routing-2026-07-31.md`（本ログ）

## Phase 4 動作確認（DoD）

1. `/gamelist` → 日付クリック → `/matches/:date` で試合一覧が表示される
2. 日付一覧の試合行から `/match/:id` へ遷移できる
3. 試合画面の URL は常に `/match/:id`（セット ID が入らない）
4. 「次ページ」は既存セットを 1 つずつ進み、最終セットのときだけ新規作成する（`/score` に飛ばない）
5. 「前ページ」で URL を変えずに前セットへ戻る（先頭では無操作）
6. セット切替後、Sidebar のスタメン/ベンチ/actions がそのセットの内容になる
7. リロード後も見ていたセット（`currentSetId`）に戻る
8. 新セットでスタメンとベンチが重複しない（スタメンは空から選び直し）

## 動作確認で解消した点

| 疑問点 | 対応 |
|--------|------|
| 戻ってから次でセットが飛ぶ | 次ページ = 既存移動、最終のみ作成 |
| セット移動でスコア等が消えるか | セット単位で DB 保持。切替時に GET set で再取得 |
| スタメンが全体に波及するか | セット単位。スターティング = そのセットのコートメンバー |
| スタメンがベンチにもいる | 新セットはスタメン空・ベンチ全選手 |
| リロードで 1 セット目に戻る | `currentSetId` で復元 |

## 次フェーズ

Phase 5（Redmine #6）: Scorebar derive + pushScore 接続

- Scorebar 行を `actions[]` から derive（serve / point、ace/miss ルール）
- Scorebar から `pushScore` 接続
- props: match / setId / start / bench / pushScore

参照: phase0.md §3 / §8-2

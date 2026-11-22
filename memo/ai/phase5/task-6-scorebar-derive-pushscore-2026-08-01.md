# Request

現在のタスクは Redmine #6（Phase 5 — Scorebar derive + pushScore 接続）。

設計書 phase0.md §3 / §4 / §8-2 を参照。Phase 0 / 1 / 2 / 3 / 4 は Complete。バックエンド疎通確認済み。

スコープ:
- Scorebar 行を `actions[]` から derive（serve / point、ace/miss ルール）
- Scorebar から `pushScore` 接続（行確定時のみ）
- props: match / setId / start / bench / pushScore
- 作業ログ作成

動作確認後の追加（同 Phase 内 Follow-up）:
- Scorebar 列ズレ修正（CSS grid でヘッダーと行を同期）
- 背番号セレクト幅の短縮
- 確定行の得点/失点を全文テキスト表示
- タブレット向けに文字・タッチサイズをサイドバー同等以上へ調整

スコープ外:
- 確定済み行の訂正・削除（更新/削除 API なし）
- Sidebar のレスポンシブ（狭い幅でスコア上に独立表示される件）
- 認証セキュリティ（Phase 6）
- batch API 変更

# Response

volleyball-front を中心に変更し、Follow-up で Scorebar レイアウトも整えた。

主な変更ファイル:
- volleyball-front/src/utils/deriveScoreRows.js（新規）
- volleyball-front/src/pages/score/Score.jsx（Scorebar props を §8-2 に揃える）
- volleyball-front/src/components/game/Scorebar.jsx（derive + draft + 確定時 pushScore）
- volleyball-front/src/components/game/ScoreDetail.jsx（playerId / controlled / reason enum / read-only / タブレット Select）
- volleyball-front/src/components/game/Scorebar.css（grid 列同期）
- volleyball-front/src/components/game/ScoreDetail.css（セレクト幅・全文表示・タブレットサイズ）
- memo/ai/phase5/task-6-scorebar-derive-pushscore-2026-08-01.md（本ログ）

# Decisions

- 永続化は行確定時のみ。batch が append-only のため、確定後の訂正は行わない。
- エース/ミス: `serve` のみ（`result: ace|miss`）。point は push しない。
- ラリー: `serve(result:null)` の直後に `point`（`result: my|opponent`, `reason`, `point: ±1`）。
- 空の下書き行は UI のみ。DB / batch に送らない。
- 確定済み行は derive 表示のみ（編集不可）。末尾に draft を常に 1 行置く。
- ラリー確定にはサーブ背番号 + 決定要因背番号 + reason が必要。
- 失点 reason は phase0 / batchSchema に合わせ `spike_lose` / `block_lose` / foul_* を使う。
- ScoreDetail の option value は `playerId`（Phase 3 と統一）。
- 確定行の得点/失点は Select ではなく全文テキスト（再選択できないため）。
- Scorebar はタブレット利用を前提に、サイドバー(14px)よりやや大きい文字・36px 高さの Select とする。
- Sidebar レスポンシブは別タスク。誤入力訂正も別タスク（API 設計が必要）。

# Status

- Phase 5（Redmine #6）: **Complete**
- Follow-up 含む動作確認済み（derive / pushScore / エース・ミス・ラリー / レイアウト）
- 次: Phase 6 — 認証セキュリティ（Redmine #7）※新しいチャットで開始

# Phase 5 まとめ

## 目的

phase0.md §3 / §8-2 に従い、Scorebar を `Set.actions[]` の SSOT に接続する。行は serve/point から derive し、確定時だけ `pushScore` で永続化する。あわせてタブレット向けの Scorebar 見た目を整える。

## 実装内容

| 項目 | 内容 |
|------|------|
| deriveScoreRows | serve で行開始、reception/spike 無視、§3-5 で累計スコア |
| Score props | `match` / `setId` / `start` / `bench` / `pushScore` |
| 確定タイミング | ace/miss または ラリー（選手+reason）が揃ったとき |
| draft 行 | 末尾 1 行、UI のみ |
| reason | 得点: spike/block/attack、失点: receive/toss/spike_lose/block_lose/foul_* |
| レイアウト | CSS grid で列同期、背番号セレクト短縮、確定理由の全文表示 |
| タブレット UI | 本文 15px 前後、Select 高さ 36px、スコア数字 16px bold |

## 変更ファイル

- `volleyball-front/src/utils/deriveScoreRows.js`
- `volleyball-front/src/pages/score/Score.jsx`
- `volleyball-front/src/components/game/Scorebar.jsx`
- `volleyball-front/src/components/game/ScoreDetail.jsx`
- `volleyball-front/src/components/game/Scorebar.css`
- `volleyball-front/src/components/game/ScoreDetail.css`
- `memo/ai/phase5/task-6-scorebar-derive-pushscore-2026-08-01.md`

## Phase 5 動作確認（DoD）

1. Scorebar にセット内容が表示される（props 不一致解消）
2. reception/spike が Scorebar 行に出ない
3. エース確定 → `serve(result:ace)` のみ push、スコア自+1
4. ミス確定 → `serve(result:miss)` のみ push、スコア相+1
5. ラリー確定 → `serve(null)` + `point` が連続 push、reason/result が正しい（サーブ背番号必須）
6. 空の下書き行は batch に送られない
7. リロード後も actions から行と累計スコアが復元される
8. Sidebar の reception/spike 操作と共存しても Scorebar 行が壊れない
9. 作業ログ作成済み

## 動作確認で解消した点 / 見送った点

| 内容 | 対応 |
|------|------|
| 決定要因だけ選んでも点が入らない | サーブ背番号が必須。手順説明で解消 |
| ヘッダーと行の列ズレ | CSS grid で同期 |
| 理由が「ス・・・」と切れる | 確定行は全文テキスト表示 |
| 文字が小さすぎる | タブレット向けにサイドバー以上へ拡大 |
| 誤入力の訂正 | スコープ外（別タスク） |
| Sidebar レスポンシブ | スコープ外（別タスク） |

## 次フェーズ

Phase 6（Redmine #7）: 認証セキュリティ（bcrypt 等）

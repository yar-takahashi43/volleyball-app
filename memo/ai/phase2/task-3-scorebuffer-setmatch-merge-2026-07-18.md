# Request

現在のタスクは Redmine #3（Phase 2 — scoreBuffer の flush → setMatch 同期）。

設計書 phase0.md §8-3 / §8-4 を参照。Phase 0 / Phase 1 は Complete。バックエンド疎通確認済み。

スコープ:
- Match.jsx の scoreBuffer / flushBuffer / pushScore 完成
- batch レスポンス `{ set }` を match に merge して setMatch
- 楽観的更新と flush 失敗時 rollback
- Reception の playerId: null（batch 400 回避）
- 作業ログ作成

スコープ外:
- Scorebar（Phase 5）
- normalizeMember / Member（Phase 3）
- ルーティング（Phase 4）
- バックエンド変更なし

# Response

volleyball-front のみを変更し、上記スコープを実装した。

主な変更ファイル:
- volleyball-front/src/utils/mergeSetIntoMatch.js（新規）
- volleyball-front/src/pages/match/Match.jsx（flush / merge / 楽観更新 / rollback）
- volleyball-front/src/components/sidebar/Reception.jsx（playerId: null）

# Decisions

- batch リクエストは `{ matchId, setId, scores }`。scores から matchId / setId を除いて送る。
- flush 成功時はフル GET 再取得せず、レスポンス `set` を `mergeSetIntoMatch` で差し替える。
- pushScore 直後にローカル `match.sets[].actions` へ append（楽観更新）。
- flush 失敗時は buffer 復帰 + timestamp 照合で楽観分を rollback。
- 二重 flush 防止に `isFlushingRef` を使用。
- reception は `playerId: null` 必須（Phase 1 batchSchema 契約）。

# Status

- Phase 2（Redmine #3）: **Complete**
- 次: Phase 3 — Sidebar UI（normalizeMember, Member, Spike）

# Phase 2 まとめ

## 目的

scoreBuffer の flush 後に batch レスポンス `{ set }` を match へ merge し、`setMatch` で UI を同期する（phase0.md §8-3 / §8-4）。

## 実装内容

| 項目 | 内容 |
|------|------|
| batch リクエスト | `{ matchId, setId, scores }`（契約どおり） |
| flush 成功 | `mergeSetIntoMatch` → `setMatch`。該当 set の start/bench も同期 |
| 楽観更新 | `pushScore` 直後にローカル `actions` へ append |
| flush 失敗 | buffer 復帰 + timestamp で楽観分 rollback |
| Reception | `playerId: null` を付与（batch バリデーション対応） |

## 変更ファイル

- `volleyball-front/src/utils/mergeSetIntoMatch.js`（新規）
- `volleyball-front/src/pages/match/Match.jsx`
- `volleyball-front/src/components/sidebar/Reception.jsx`

## Phase 2 動作確認（DoD）

1. レセプション ＋ で即時に数値が増える（楽観更新）
2. 3件 or 約5秒で `POST /api/scores/batch` が飛び、body に `matchId` / `setId` / `scores` がある
3. レスポンスが `{ set }` で、flush 後も数値が残る（merge）
4. flush 成功後リロードでレセプション数が残る（永続化）
5. flush 失敗時は数値と buffer が戻る（rollback）

## 動作確認で出た疑問点（スコープ外）と対応フェーズ

| 疑問点 | 答え | 対応フェーズ |
|--------|------|-------------|
| ベンチ→スタメンで他選手が消える | Member が `player._id` 前提。API は `playerId` string。`normalizeMember` 未実装 | Phase 3 |
| リロード後に選手が全て消える | 同上。Member / starPlayer の ID 契約と表示のズレ | Phase 3 |
| レセプションのマイナスが増える | 集計が `point` 符号を見ず件数加算している | Phase 3 |
| スパイクに選手名が出ない | Spike UI / `normalizeMember` 未整備 | Phase 3 |
| スパイク増減が動かない | `playerId` 参照不整合で `pushScore` まで届かない | Phase 3 |
| 「セットが選択されていません」／ゲームバーなし | Scorebar の props / derive 未接続 | Phase 5 |

## 次フェーズ

Phase 3（Redmine #4）: Sidebar UI — `normalizeMember`, Member, Spike（レセプション集計修正含む）
